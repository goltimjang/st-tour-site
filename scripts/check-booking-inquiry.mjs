// Offline boundary checks only; no external requests.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
const source = ts.transpileModule(fs.readFileSync('src/lib/booking-inquiry.ts', 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;
const context = { exports: {}, Intl, Date }; vm.runInNewContext(source, context);
const { validateBooking, bookingPayload, koreaToday, BOOKING_SESSIONS } = context.exports;
const input = { date: '2026-10-15', session: '2부', name: ' 테스트 문의 ', phone: '010-0000-0000', people: '4', memo: '', agree: true };
const check = changes => validateBooking({ ...input, ...changes }, '2026-10-01');
let checks = 0;
for (const session of BOOKING_SESSIONS) { assert.equal(Object.keys(check({session})).length, 0); checks++; }
for (const [key,value] of [['date',''],['date','2026-09-30'],['date','2026-02-30'],['date','invalid'],['session',''],['session','4부'],['name','  '],['name','가'.repeat(41)],['phone','123'],['phone','010abcd5678'],['agree',false],['people','1'],['memo','가'.repeat(501)]]) { assert.ok(check({[key]:value})[key], key); checks++; }
assert.equal(Object.keys(check({date:'2026-10-01'})).length,0); checks++;
assert.equal(Object.keys(check({date:'2028-02-29'})).length,0); checks++;
assert.ok(check({date:'2027-02-29'}).date); checks++;
assert.equal(koreaToday(new Date('2026-09-30T15:01:00Z')),'2026-10-01'); checks++;
const payload = bookingPayload({...input,people:'단체'}, {name:'포세븐 금강CC',slug:'fourseven-geumgang'}, 'STB-TEST');
assert.equal(payload.연락처,'01000000000'); assert.equal(payload.예약자,'테스트 문의'); assert.equal(payload.문의유형,'할인부킹'); assert.match(payload.접수상태,/예약 미확정/); assert.equal(payload.접수번호,'STB-TEST'); assert.match(payload.인원,/단체/); checks++;
console.log(`PASS ${checks} booking validation/payload boundary checks (offline)`);
