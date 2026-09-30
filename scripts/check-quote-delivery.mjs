// Offline contract tests. No request is sent to any external service.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

const source = ts.transpileModule(fs.readFileSync('src/lib/quote-delivery.ts', 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
}).outputText;

function client(id, respond) {
  const calls = [];
  const context = {
    exports: {}, process: { env: { NEXT_PUBLIC_FORMSPREE_FORM_ID: id } },
    fetch: async (url, options) => { calls.push({ url, options }); return respond(options); },
  };
  vm.runInNewContext(source, context);
  return { send: context.exports.deliverQuote, calls };
}
const request = {
  subject: '[전송 점검용] 실제 상담 아님', email: '',
  payload: { 접수번호: 'ST-TEST-0000', 지역: '베트남 · 하노이', 연락처: '01000000000', 희망시기: '미정', 항공: '항공 불포함' },
  signal: new AbortController().signal,
};
const json = (body, ok = true) => ({ ok, json: async () => body });
let count = 0;
for (const email of ['', '  test@example.com  ']) {
  const { send, calls } = client('testform', () => json({ ok: true }));
  await send({ ...request, email });
  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, 'https://formspree.io/f/testform');
  const body = JSON.parse(calls[0].options.body);
  assert.deepEqual(body, { ...request.payload, subject: request.subject, ...(email ? { email: email.trim() } : {}) });
  assert.equal(calls[0].options.signal, request.signal);
  assert.equal(calls[0].options.redirect, 'error');
  count++;
}
for (const response of [
  json({ ok: false }), json({}), json(null), json([]), json({ success: true }),
  json({ ok: true }, false), json({ ok: true, errors: [{ message: 'Quota exceeded' }] }),
  json({ ok: true, error: 'challenge required' }),
  { ok: true, json: async () => { throw new SyntaxError('HTML instead of JSON'); } },
]) {
  const { send, calls } = client('testform', () => response);
  await assert.rejects(send(request));
  assert.equal(calls.length, 1, 'Must not duplicate requests or fall back to legacy provider');
  count++;
}
for (const error of [new TypeError('Network offline'), new DOMException('Timeout', 'AbortError')]) {
  const { send, calls } = client('testform', () => { throw error; });
  await assert.rejects(send(request));
  assert.equal(calls.length, 1);
  count++;
}
const invalid = client('https://other.example/f/x', () => { throw new Error('Should never send'); });
await assert.rejects(invalid.send(request));
assert.equal(invalid.calls.length, 0);
count++;
for (const id of ['', undefined]) {
  const configured = client(id, () => json({ ok: true }));
  await configured.send(request);
  assert.equal(configured.calls[0].url, 'https://formspree.io/f/xnpnrzgv');
  count++;
}
console.log(`PASS: ${count} offline quote delivery checks. Live receipt and email delivery remain separate checks.`);
