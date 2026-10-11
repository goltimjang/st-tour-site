const $ = (s) => document.querySelector(s);
const names = {
  new: "신규",
  consulting: "상담 중",
  quoted: "견적 발송",
  booked: "예약 확정",
  closed: "상담 종료",
  review: "검토 필요",
};
const noticeNames = {
  pending: "알림 대기",
  processing: "발송 처리 중",
  retry: "재시도 대기",
  accepted: "발송 서비스 접수",
  failed: "발송 확인 필요",
  blocked: "메일 연결 필요",
};
const errorNames = {
  mail_not_configured: "메일 서비스 연결 후 다시 시도할 수 있습니다.",
  mail_rejected:
    "발송 서비스가 요청을 거절했습니다. 발신 주소와 설정 확인이 필요합니다.",
  mail_temporary_error: "일시적인 발송 오류로 자동 재시도를 기다립니다.",
  mail_transport_error:
    "응답을 확인하지 못했습니다. 중복 방지 키를 유지해 재시도합니다.",
  mail_invalid_response: "발송 응답을 확인하지 못했습니다.",
  manual_review_required:
    "자동 재시도 범위를 넘었습니다. 관리자 확인이 필요합니다.",
};
let filter = "",
  offset = 0,
  active = "",
  selected = null,
  listSeq = 0,
  detailSeq = 0;
const date = (v) =>
  new Date(v).toLocaleString("ko-KR", {
    timeZone: "Asia/Seoul",
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
function element(tag, text, cls) {
  const e = document.createElement(tag);
  if (text !== undefined) e.textContent = text;
  if (cls) e.className = cls;
  return e;
}
async function api(path, options = {}) {
  const res = await fetch("/admin/api/" + path, {
    ...options,
    credentials: "same-origin",
    headers: { "Content-Type": "application/json", ...options.headers },
  });
  let data;
  try {
    data = await res.json();
  } catch {
    throw Error("로그인 상태를 확인하고 페이지를 새로고침해 주세요.");
  }
  if (!res.ok)
    throw Error(
      res.status === 401
        ? "관리자 로그인이 필요합니다. 페이지를 새로고침해 주세요."
        : data.error === "updated_elsewhere"
          ? "다른 화면에서 변경되었습니다. 문의를 다시 열어 주세요."
          : data.error === "retry_requires_review"
            ? "이미 발송되었거나 재시도 범위를 넘었습니다. 발송 상태를 확인해 주세요."
            : "처리하지 못했습니다. 입력 내용은 유지됩니다. 잠시 후 다시 시도해 주세요.",
    );
  return data;
}
function message(text) {
  $("#message").textContent = text;
}
async function load() {
  const seq = ++listSeq;
  $("#refresh").disabled = true;
  try {
    const data = await api(`inquiries?status=${filter}&offset=${offset}`);
    if (seq !== listSeq) return;
    const counts = Object.fromEntries(
      data.counts.map((x) => [x.status, x.count]),
    );
    for (const b of $("#filters").querySelectorAll("button")) {
      b.setAttribute("aria-pressed", String(b.dataset.status === filter));
      b.querySelector("span").textContent = b.dataset.status
        ? counts[b.dataset.status] || 0
        : data.counts.reduce((n, x) => n + x.count, 0);
    }
    $("#alerts").hidden = !data.alerts.count;
    $("#alerts").textContent =
      `알림 확인이 필요한 문의 ${data.alerts.count}건이 있습니다. 문의 내용은 접수함에 저장되어 있습니다.`;
    const list = $("#list");
    list.replaceChildren();
    if (!data.items.length)
      list.append(element("p", "해당 상태의 문의가 없습니다.", "list-empty"));
    for (const i of data.items) {
      const b = element("button", undefined, "inquiry");
      b.setAttribute("aria-current", String(i.id === active));
      const top = element("div", undefined, "row-top");
      top.append(
        element("span", i.name + " 고객님", "customer"),
        element("span", names[i.status], "badge " + i.status),
      );
      b.append(
        top,
        element(
          "p",
          (i.kind === "booking" ? "할인부킹 · " : "골프여행 · ") +
            (i.region || i.course || "상세 확인"),
          "destination",
        ),
      );
      const bottom = element("div", undefined, "row-bottom");
      bottom.append(
        element("span", date(i.created_at) + "\n" + i.receipt, "receipt"),
        element(
          "span",
          noticeNames[i.notification] || "알림 확인 필요",
          "notice " +
            (["retry", "failed", "blocked"].includes(i.notification)
              ? "notice-warn"
              : ""),
        ),
      );
      b.append(bottom);
      b.addEventListener("click", () => openInquiry(i.id));
      list.append(b);
    }
    $("#previous").disabled = offset === 0;
    $("#next").disabled = !data.hasMore;
    $("#page").textContent = `${offset / 25 + 1}페이지`;
    $("#updated").textContent = date(Date.now()) + " 확인";
  } catch (e) {
    message(e.message);
  } finally {
    if (seq === listSeq) $("#refresh").disabled = false;
  }
}
async function openInquiry(id) {
  const seq = ++detailSeq;
  try {
    const data = await api("inquiries/" + id);
    if (seq !== detailSeq) return;
    selected = data;
    active = id;
    renderDetail();
    await load();
  } catch (e) {
    message(e.message);
  }
}
function renderDetail() {
  const { inquiry: i, notification: n, audit } = selected;
  const mobile = matchMedia("(max-width:760px)").matches;
  const target = mobile ? $("#mobile-content") : $("#detail");
  const other = mobile ? $("#detail") : $("#mobile-content");
  other.replaceChildren();
  target.replaceChildren();
  target.append(element("p", i.receipt, "muted"));
  const head = element("div", undefined, "detail-top");
  head.append(
    element("h2", i.name + " 고객님", "detail-title"),
    element("span", names[i.status], "badge " + i.status),
  );
  target.append(
    head,
    element("p", date(i.created_at) + " 접수 · 한국 시간", "muted"),
  );
  const contact = element("div", undefined, "contact");
  const tel = element("a", i.phone);
  tel.href = "tel:" + i.phone;
  contact.append(tel);
  if (i.email) {
    const email = element("a", i.email);
    email.href = "mailto:" + i.email;
    contact.append(email);
  }
  target.append(contact);
  const dl = element("dl", undefined, "conditions");
  for (const [key, value] of Object.entries(JSON.parse(i.payload))) {
    if (
      [
        "접수시각",
        "이름",
        "예약자",
        "연락처",
        "이메일",
        "개인정보동의",
      ].includes(key)
    )
      continue;
    dl.append(
      element(
        "dt",
        key === "type"
          ? "문의 종류"
          : key === "접수번호"
            ? "요청 참조번호"
            : key,
      ),
      element("dd", value),
    );
  }
  target.append(dl);
  const form = element("form", undefined, "editor");
  const heading = element("h2", "상담 기록");
  const statusLabel = element("label", "진행 상태");
  statusLabel.htmlFor = "edit-status";
  const status = element("select");
  status.id = "edit-status";
  for (const [value, label] of Object.entries(names)) {
    const option = element("option", label);
    option.value = value;
    status.append(option);
  }
  status.value = i.status;
  const noteLabel = element("label", "상담 메모");
  noteLabel.htmlFor = "edit-note";
  const note = element("textarea");
  note.id = "edit-note";
  note.maxLength = 2000;
  note.value = i.note;
  note.placeholder = "고객과 확인한 조건과 다음 할 일을 적어 주세요.";
  const save = element("button", "상담 기록 저장", "primary");
  save.type = "submit";
  const result = element("p");
  result.setAttribute("role", "status");
  form.append(heading, statusLabel, status, noteLabel, note, save, result);
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    save.disabled = true;
    try {
      await api("inquiries/" + i.id, {
        method: "PATCH",
        body: JSON.stringify({
          status: status.value,
          note: note.value,
          version: i.version,
        }),
      });
      message("상담 기록을 저장했습니다.");
      await openInquiry(i.id);
    } catch (err) {
      result.textContent = err.message;
    } finally {
      save.disabled = false;
    }
  });
  target.append(form);
  const box = element("div", undefined, "notification");
  box.append(
    element("strong", "담당자 메일 알림"),
    element("p", noticeNames[n?.status] || "확인 필요"),
  );
  if (n?.error_code)
    box.append(
      element("p", errorNames[n.error_code] || "관리자 확인이 필요합니다."),
    );
  box.append(
    element(
      "p",
      `발송 시도 ${n?.attempts || 0}회 · 실제 받은편지함 수신 여부는 별도로 확인해 주세요.`,
    ),
  );
  if (["retry", "failed", "blocked"].includes(n?.status)) {
    const retry = element("button", "메일 알림 다시 시도", "outline");
    retry.addEventListener("click", async () => {
      retry.disabled = true;
      try {
        await api("inquiries/" + i.id + "/retry", {
          method: "POST",
          body: "{}",
        });
        message("재시도를 요청했습니다. 잠시 후 새로고침해 상태를 확인하세요.");
        await openInquiry(i.id);
      } catch (e) {
        message(e.message);
      } finally {
        retry.disabled = false;
      }
    });
    box.append(retry);
  }
  target.append(box);
  const kakao = element("div", undefined, "notification");
  const a = selected.alimtalk;
  const labels = {
    pending: "발송 대기",
    blocked: "서버 키 연결 필요",
    processing: "발송 요청 중",
    accepted: "SOLAPI 접수, 실제 수신 미확인",
    failed: "발송 실패, 확인 필요",
    unknown: "결과 불명, SOLAPI 내역 확인 필요",
  };
  kakao.append(
    element("strong", "고객 접수 알림톡"),
    element("p", a ? labels[a.status] || "확인 필요" : "자동 발송 대상 아님"),
  );
  if (a?.provider_group_id)
    kakao.append(element("p", "발송 조회 번호: " + a.provider_group_id));
  if (a?.status === "unknown")
    kakao.append(
      element(
        "p",
        "중복 발송 방지를 위해 자동 재발송하지 않습니다. SOLAPI에서 접수번호와 발송 내역을 확인해 주세요.",
      ),
    );
  target.append(kakao);
  const history = element("div", undefined, "audit");
  history.append(element("strong", "최근 처리 이력"));
  for (const a of audit)
    history.append(
      element(
        "p",
        `${date(a.created_at)} · ${a.actor} · ${a.action === "retry_requested" ? "알림 재시도 요청" : "상담 기록 변경"}`,
      ),
    );
  target.append(history);
  if (mobile && !$("#mobile-detail").open) $("#mobile-detail").showModal();
}
$("#filters").addEventListener("click", (e) => {
  const b = e.target.closest("button");
  if (b) {
    filter = b.dataset.status;
    offset = 0;
    load();
  }
});
$("#refresh").addEventListener("click", () => {
  message("");
  if (active) openInquiry(active);
  else load();
});
$("#previous").addEventListener("click", () => {
  offset = Math.max(0, offset - 25);
  load();
});
$("#next").addEventListener("click", () => {
  offset += 25;
  load();
});
$("#close-detail").addEventListener("click", () => $("#mobile-detail").close());
matchMedia("(max-width:760px)").addEventListener("change", () => {
  if ($("#mobile-detail").open) $("#mobile-detail").close();
  if (selected) renderDetail();
});
if (["localhost", "127.0.0.1"].includes(location.hostname))
  $("#preview").hidden = false;
load();
