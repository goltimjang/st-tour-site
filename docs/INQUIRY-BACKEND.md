# 자체 문의 접수 서버 1차 구현

작성: 2026-10-07. 브랜치: feature/inquiry-backend.

## 현재 상태

- **서버 연결 준비 단계 (2026-10-11 갱신)**. 운영 홈페이지는 기존 Formspree를 사용한다. 전용 Cloudflare D1 생성 및 초기 스키마 적용 완료. 관리자 전용 Worker 배포와 Access 이메일 인증 설정 완료. 관리자 실제 로그인 및 새로고침 성공 확인. SOLAPI API 키 2개 Secret 저장 및 로컬 HMAC 읽기 인증 성공. 운영 알림 메일과 홈페이지 자동 알림톡은 아직 미연결.
- 사용자가 로그인한 기존 Cloudflare 계정에서 전용 `st-tour-inquiries` DB를 생성했다. 기존 다른 사업의 Worker/DB는 변경하지 않았다. 비밀 키를 이 문서에 저장하지 않는다.
- 10/7 확인한 기존 장애는 Formspree 스팸 오분류였다. 승인된 기존 문의 3건을 복원하고 Gmail 수신을 확인했다. 이 복원은 새 서버의 운영 검증이 아니다.

## 구조

고객 폼 → Workers 검증 → D1 문의 + 알림 대기 기록을 한 트랜잭션으로 저장 → 서버 접수번호 반환 → 담당자 알림.

- UUID 요청 키와 정규화된 내용 해시로 같은 요청의 동시/재전송을 병합한다. 내용이 달라지면 409. 클라이언트 시각은 중복 판단에서 제외하고 서버 시각을 별도 저장한다.
- 조회용 공개 API는 없다. 고객은 저장 성공 응답으로 접수번호를 받는다. 요청 키/본문 해시는 관리자 응답에도 노출하지 않는다.
- 오류 시 Formspree로 자동 재전송하지 않는다. 양쪽에 저장될 수 있는 이중 접수를 피한다. 전환 전 사이트 빌드에서 백엔드 주소를 비워 두면 기존 전송을 유지한다.
- 서버 입력 검증, 24KB 제한, 허용 Origin, Turnstile 서버 검증(action/hostname), IP를 해시한 10분 제한을 사용한다. 제한 기록은 만료 후 정리한다. Origin 검증만으로 인증을 대신하지 않는다.
- 관리자 `/admin*` 전체(HTML/JS/CSS/API)에 Access JWT 서명/발급자/대상/만료/허용 이메일을 검증한다. 헤더 이메일만 믿지 않는다. 쓰기는 동일 Origin만 허용한다.
- 상담 상태와 메모는 버전 확인 후 저장한다. 동시 편집 충돌은 409로 표시하고 변경 이력을 기록한다.
- 화면 내 고객 입력은 textContent로 출력한다. 개인정보 목록은 최소화하고 상세 화면은 인증 뒤에만 제공한다.

## 알림

- Resend 어댑터를 준비했으나 발신 도메인/키가 없으면 `blocked`로 표시한다. 조용히 성공으로 바꾸지 않는다. 로컬 개발에서는 외부 메일 전송이 불가능한 어댑터를 사용한다.
- 메일에는 접수번호와 로그인 필요한 관리자 주소만 넣는다. 이름/전화/상담 본문을 알림 메일에 복사하지 않는다.
- lease를 원자적으로 획득한 작업만 처리한다. 종료되지 않은 작업은 만료 뒤 회수한다. 발송 요청에 고정된 provider idempotency key를 사용한다.
- 5분 간격 예약 실행에서 자동 재시도. 최대 5번, 지수 지연. 첫 시도 후 23시간을 넘으면 수동 검토로 멈춘다. 공급사 중복 방지 보장(24시간)을 넘겨 자동 재발송하지 않는다.
- `accepted`는 발송 업체가 접수한 상태다. Gmail 수신/고객 수신이 아니다. 전달 결과 웹훅과 카카오 발송은 후속 작업이다.
- 알림 설정 미완료로 실제 시도하지 않은 경우 시도 횟수를 차감하고 최초 시도 시각을 비운다. 최초 설정을 다음 날 완료해도 재시도 가능하다.
- 알림 재시도와 예약 확정 상태 변경은 자동 고객 발송을 유발하지 않는다.

## 로컬 실행

```sh
cd /Users/goltimjang/Projects/st-tour-site/backend
npm ci
npm run db:local
npm run dev
# 다른 터미널에서 가상 자료 3건 추가
node scripts/seed-local.mjs
```

접수함: http://127.0.0.1:8787/admin/

로컬 전용 entry `src/local.ts`는 localhost에만 응답하며 가상 자료 전용이다. 실제 개인정보를 넣지 않는다. 운영 entry는 반드시 `src/index.ts`. 배포 전 점검 스크립트에서 로컬 entry를 거부한다.

## 운영 연결 순서 (미완료)

1. 사용자 소유 Cloudflare 계정 확인. 전용 D1 생성 및 migration 적용. 기존 다른 서비스 자원은 재사용하지 않는다.
2. 소유 도메인의 API 호스트를 정하고 `wrangler.jsonc`의 routes, DB ID, ADMIN_ORIGIN 설정. 홈페이지 DNS를 통째로 이전할 필요가 있는지는 실제 DNS 관리 상태부터 확인한다.
3. Cloudflare Access로 `/admin*`을 보호하고 승인된 관리자만 허용. issuer/audience/email allowlist 설정. 임의 이메일 자동 가입 불가. 비로그인/다른 계정/위조 JWT 실제 거부를 검증한다.
4. Turnstile 위젯 등록, 실제 사이트 hostname 제한, secret을 Wrangler secret으로 저장. RATE_SALT도 비밀 값으로 등록한다. 브라우저에는 site key만 배포한다.
5. 이메일 발송 서비스 계정 및 발신 도메인 인증. RESEND_API_KEY를 secret으로 등록하고 MAIL_FROM/MAIL_TO 설정. MAIL_TO는 운영자 수신 주소다. 다른 광고주/고객 메일로 설정하지 않는다.
6. 실제 수탁자·처리 국가·보관 기간에 맞게 `/privacy/` 본문을 확정한다. 폼의 조건부 안내만으로 전환하지 않는다. 상담 종료 후 1년 삭제 정책을 이행할 정리 작업과 백업 보관/접근 권한도 정한다. 현 버전에는 자동 개인정보 삭제/운영 백업 작업이 없다.
7. 시험 환경에서 DB 백업 → 별도 DB 복원 → 건수/접수번호/상담 메모 일치 확인. 운영 DB에 복원 시험을 하지 않는다.
8. 승인받은 가상 접수로 운영 API 저장, 관리자 확인, 실제 메일 수신을 대조. 메일 오류/응답 유실/중복 클릭/권한 거부/모바일/PC/백업 복구를 검증한다.
9. Next 빌드의 `NEXT_PUBLIC_INQUIRY_API_URL=https://<확인한호스트>/v1/inquiries`, `NEXT_PUBLIC_TURNSTILE_SITE_KEY` 설정. 기존 GitHub workflow에는 아직 두 변수를 연결하지 않았다. 개인정보 안내와 검증을 완료한 후 workflow와 운영 변수를 연결한다.
10. 신규 접수부터 전환한다. 기존 Formspree 저장분은 동의/필요 범위를 확인해 별도 이관한다. 고객 자료를 이중 전송하거나 기존 접수함을 삭제하지 않는다.

`npm run deploy`는 미완성 설정을 차단한다. 설정 준비 후 ST_BACKEND_DEPLOY_READY=yes를 명시해야 실행된다. 이는 실제 연결/보안/메일 검증을 대신하지 않는다.

## 디자인

기존 사이트의 네이비 #142347, 블루 #1248ed, 배경 #f3f6fa, 구분선 #dae2ed, 본문 #172641, 상태용 녹색 #14664f. 한국어 시스템 글꼴, PC 좌측 접수 목록/우측 상세, 모바일 상세 대화상자. 왼쪽 정렬과 실제 상태 표식을 사용하며 불필요한 장식/자동 애니메이션을 두지 않는다. 새 문의와 상담 액션이 우선인 업무 화면이다.

## 검증 기록

- Workers 타입 검사 통과.
- 로컬 D1 통합 시험 35개: 정상 저장, 저장 실패 전체 롤백, 동시 5회 재전송 1건 저장, 동일 키/다른 내용 차단, 응답 유실 재조회, 동의/연락처/인원/부킹 팀수/크기 검증, Origin/위조 관리자/CSRF 차단, 동시 편집 충돌/감사 이력, 알림 실패/재시도/미연결/중복·시간창 제한, 요청 속도 제한.
- 전송 모듈 오프라인 28개 및 부킹 검증 41개 통과. 기존 Formspree 동작 유지, 새 모드 저장/접수번호 확인, 잘못된 설정·응답 차단 및 외부 공급사 자동 재전송 없음.
- Next production build 통과. 정적 110페이지/상품/이미지 검사 통과.
- 의존성 audit: 개발 도구의 sharp 취약 버전은 패치 버전으로 override, 이후 0건 확인.
- 로컬 관리자 가상 문의 3건, 상담 메모/상태 저장 및 새로고침 후 유지 확인. PC 기본 폭 및 모바일 375/320px에서 상세 열기, 목록 복귀와 가로 넘침 없음 확인. 실제 고객 자료/메일/카카오 발송 없음.
- 로컬 D1 SQL export를 별도 메모리 SQLite에 복원하여 문의 3건, 알림 작업 3건, 상담 메모와 상태 일치 확인.
- 운영 클라우드 연결, 실기기, 실제 발송 수신 및 운영 백업 복구는 별도 검증이 필요하다.

## 공식 구현 근거

- D1 batch 트랜잭션: https://developers.cloudflare.com/d1/worker-api/d1-database/
- Access JWT 검증: https://developers.cloudflare.com/cloudflare-one/access-controls/applications/http-apps/authorization-cookie/validating-json/
- Turnstile 서버 검증: https://developers.cloudflare.com/turnstile/get-started/server-side-validation/
- 이메일 중복 방지 키: https://resend.com/docs/dashboard/emails/idempotency-keys

## 2026-10-11 알림톡 연결 준비 후속

- Zero Trust Free 활성화를 계정 화면에서 확인. 팀명 fragrant-darkness-8f18. 관리자 앱 초안: ST Tour Inquiry Admin, st-tour-inquiries.forceo007.workers.dev/admin*, goltimjang@gmail.com 한 명 허용, 24시간 세션. 정책/앱은 아직 저장 전이며 실제 관리자 로그인 시험도 미완료.
- SOLAPI 김철순님 계정의 API Key 목록이 비어 있어 서버용 신규 키 생성 및 Cloudflare Secret 저장을 사용자에게 요청. 키 생성/저장과 관리자 권한 생성 승인 대기.
- src/alimtalk.ts: 서버 HMAC 인증, 승인된 여행 접수 템플릿만 사용, SMS 대체 OFF, 발송 결과는 accepted까지만 표시. 실제 전달 결과는 SOLAPI 로그에서 별도로 확인.
- 문의와 alimtalk_jobs를 같은 D1 batch에 기록. 동시 실행은 원자적 claim, 중복 접수는 기존 접수 반환. 응답 유실/처리 중 서버 종료는 unknown으로 전환하며 자동 재발송 금지. 설정 지연 등으로 1시간 지난 대기 알림은 자동 발송하지 않음.
- 메일 재시도 버튼은 메일만 처리. 알림톡 대기는 별도 처리하며 미승인 할인부킹/견적서 도착 템플릿은 사용하지 않음.
- 운영 전용 빈 D1에 0002_alimtalk.sql 적용. 운영 발송 플래그는 false 유지, Worker 미배포. 홈페이지는 기존 Formspree 그대로.
- 로컬 통합시험에 알림톡 큐 원자 저장/실패 롤백/중복 접수/미승인 부킹 제외를 추가. 별도 모의 SOLAPI 시험에서 HMAC, 비활성/키 누락, 문자 대체 차단, 응답 불명/오류, 동시 claim 및 무분별 재발송 방지 확인. 실제 고객 정보/발송 없음.
- workers.dev를 이용하려면 경로별 Access 적용 검증 후 preflight의 도메인 제한을 근거와 함께 변경해야 함. 지금은 기존 안전 차단 유지.

## 2026-10-11 관리자 권한 승인 후 배포

- 사용자 승인: goltimjang@gmail.com 한 명, 세션 24시간, SOLAPI 서버용 신규 키 생성 및 Cloudflare Secret 연결. 추가 발송/고객 자동 발송 활성화는 제외.
- Access 앱 d67e34fa-e151-455f-8d9d-4a1145b27a8f, 정책 0e204062-5f73-48cf-b1e3-01da1880a0f6 저장 후 다시 열어 경로/세션 확인. HTTP Only 쿠키 ON, App Launcher OFF. 로그인 제공자는 One-time PIN만 선택. 이메일 허용 규칙은 기존 승인된 운영 메일 한 명 유지.
- st-tour-inquiries Worker 관리자 준비 모드 배포: 52498cdb-8b3f-41dc-be06-cb4c8d701490. 주소 https://st-tour-inquiries.forceo007.workers.dev/admin/ . INTAKE_ENABLED=false, ALIMTALK_ENABLED=false, preview_urls=false. 기존 다른 사업 Worker/DB와 홈페이지 DNS/배포는 변경하지 않음.
- preflight에 ST_BACKEND_SETUP_ONLY=yes 모드 추가. 실제 배포 entry/DB/Access issuer·audience/관리자 한 명/검증된 workers.dev 주소/관리자 자산 인증을 검사하고 접수와 고객 발송 OFF를 강제한다. 운영 모드는 종전 운영 준비 검증을 계속 요구한다.
- 실제 HTTPS 점검: health 200, /admin 및 /admin/ 및 /admin/api/inquiries 및 관리자 JS는 인증 없는 접근에서 Access 302, /index.html은 404. 빈 본문 접수 POST는 503 intake_not_enabled로 차단. 고객 정보/접수/알림 생성 없음. 로컬 통합시험 42개 및 모의 SOLAPI 시험 통과.
- 관리자 브라우저에서 이메일 OTP 화면 확인, 운영 메일로 로그인 코드 요청. 실제 코드 입력/접수함 로그인 성공은 사용자 진행 대기.
- SOLAPI 키 생성 UI의 IP 조건 추가 발견: 기본 현재 PC /32. 고정 서버 IP가 준비되어 있지 않아 모든 IP 허용 + 90일 키 생성을 별도 질문. 확인 팝업에서 중지, 아직 키 생성하지 않음. Wrangler secret list는 빈 배열.
- 앞으로 필요한 작업: IP 범위 승인 후 키 생성 및 비밀 저장, 실제 관리자 인증 성공 확인, Turnstile/메일/개인정보 보관 안내/운영 시험. Formspree에서 전환하거나 고객 자동 발송을 켜지 않는다.

## 2026-10-11 IP 범위 승인 및 관리자 실로그인 확인

- 사용자 승인: SOLAPI 모든 IP 허용(0.0.0.0/0), 유효기간 90일. 실제 생성 화면 만료일 2027-01-09 23:59:59 KST. 키 값은 기록하지 않는다.
- 김철순님 계정에 ST Tour inquiry backend 메모로 키 1개 생성. Cloudflare Worker st-tour-inquiries에 SOLAPI_API_KEY와 SOLAPI_API_SECRET을 secret_text로 저장 후 이름/유형 재조회 성공. 전달용 임시 파일은 0700 디렉터리/0600 파일로 처리 후 제거.
- 발송 없는 로컬 HMAC 인증 GET /messages/v4/list?limit=1: HTTP 200, 기존 시험 내역 1건, accountId가 확인한 김철순님 계정과 일치. 이는 Cloudflare 발송 실행/고객 수신 검증이 아니다.
- 사용자가 이메일 PIN 인증을 완료. 실제 /admin/에서 문의 접수함 표시 및 새로고침 완료, 오류 없음. 현재 DB 문의 0건은 신규 서버이며 Formspree 과거 문의 미이관 상태이다.
- 키 저장 뒤에도 익명 관리자 API는 Access 302, 접수 POST는 503 intake_not_enabled. ALIMTALK_ENABLED=false 유지. 추가 알림톡/문자 발송 없음.
- 현 단계 완료: 관리자 로그인과 서버용 키 저장. 남은 전환 단계: Turnstile, 운영 메일, 개인정보 안내/보관/백업, 승인받은 실제 서버 종단 시험, 이후 별도 운영 활성화.

## 2026-10-11 보안 인증 및 관리자 종단 시험 준비

- 사용자 신규 승인: 본인 시험 번호로 실제 접수부터 운영 메일·알림톡까지 1건 시험. 일반 고객 자동 발송 활성화와 추가 반복 시험은 포함하지 않음.
- Cloudflare Turnstile 위젯 ST Tour Inquiry 생성. 공개 site key 0x4AAAAAAFTn7axVU6e3EACa. 허용 호스트 stgolftours.com 및 st-tour-inquiries.forceo007.workers.dev, Managed 모드, pre-clearance OFF. 서버는 www/루트/시험 서버 정확한 hostname과 action=inquiry를 별도로 검증한다.
- TURNSTILE_SECRET 및 RATE_SALT를 전용 Worker Secret으로 저장. 전달용 제한 권한 임시 파일 제거 완료.
- /admin/owner-test 및 /admin/api/owner-test 추가. Access 관리자 인증과 동일 Origin 검사, 고정된 서버 측 수신 번호·UUID, 최대 24시간 만료, 실제 Turnstile 검증을 요구한다. 원래 intake 검증과 D1 원자 저장 경로를 재사용하며 시험 알림은 해당 inquiry ID만 처리한다. 공개 접수/일반 알림톡 플래그는 false 유지.
- 발신 서비스 설정이 비어 있으면 시험 접수도 저장/발송하지 않는다. 중복 클릭·응답 유실은 같은 접수번호로 복구하며 임의 번호/UUID 덮어쓰기는 무시한다. 시험 활성화는 별도 ST_BACKEND_OWNER_TEST_READY 확인이 있어야 배포된다.
- 배포 c7df4f1a-7801-4721-add1-4f283b0ea401: TEST_INTAKE_ENABLED=false. 실제 관리자 화면에서 비활성 안내 확인. 익명 시험 페이지/API는 Access 302, 루트 시험 JS 404, 공개 intake 503 유지.
- 로컬 D1 통합시험 58개 및 모의 SOLAPI 시험 통과. 실제 시험 발송은 아직 없음.
- Resend의 goltimjang 계정 로그인 확인. 등록된 API 키 없음. ST Tour operator notification / Sending access / All domains 구성 후 키 생성·Worker 비밀 저장 승인 대기. 일반 홈페이지 DNS는 변경하지 않음. Resend 도메인 인증은 아직 완료되지 않았으며 현재 온보딩 화면의 시험 발신자는 onboarding@resend.dev이다.

## 2026-10-11 16:19 KST 실제 종단 시험 1건

- 사용자 Resend 발송 전용 키 생성·Worker 저장 승인. 승인 응답 직전 ST Tour operator notification 키가 사용자 화면에서 생성되어 있었으나 전체 값 재열람 불가. 이 키는 건드리지 않았고 ST Tour Worker sending / Sending access / All domains 키를 생성해 RESEND_API_KEY로 저장. 새 키 ID 9f70ef5a-b0a4-4d77-9bf4-70aff1eabc9b. 전체 값은 저장하지 않음. 앞의 미사용 키 ID 79183464-276f-42fa-87d0-bb354b67ff61는 정리 여부 확인 필요.
- 시험 수신 번호는 TEST_PHONE secret으로 저장. 제한 권한 임시 파일은 저장 성공 후 삭제. 정식 도메인 미인증이므로 발신은 onboarding@resend.dev, 수신 goltimjang@gmail.com.
- 관리자 인증 + 실제 Turnstile 검증 + 공통 intake 입력 검증을 거쳐 시험 1건 저장. 접수번호 ST-20261011-2832F1B61C50, 고정 request key 2de2cdda-2288-42b7-a48c-b9b90b093247. 여행 조건은 하노이/일정 미정/4명 시험 데이터.
- D1 문의 1건, 운영 메일 작업 1건 attempts=1 accepted, 알림톡 작업 1건 attempts=1 accepted. 이메일 provider ID 01a129d4-47da-7a5a-b186-98dc642f737d. SOLAPI group G4V20261011161900OR4ZVRLKRHJXSK2.
- SOLAPI 실제 화면: 2026-10-11 16:19:00, ATA, 수신 번호 끝 2546, 발송완료 4000 / 수신 완료. 추가 비용 13P, 잔액 274P. 사용자의 휴대전화 실제 도착 확인은 질문 후 대기.
- Resend Delivered 확인. Gmail 검색/헤더로 동일 접수번호 메일 도착 확인, 단 SPAM 라벨로 받은편지함 도착은 실패. SPF/DKIM/DMARC는 모두 pass이므로 인증 실패라고 단정하지 않음. 스팸 판정의 구체 원인은 미확인. 스팸함 복원이나 필터 변경은 하지 않음.
- 시험 후 TEST_INTAKE_ENABLED=false로 되돌리고 만료값 제거, 배포 fd04bae3-eaba-472d-bb0f-35f3bc0eb879 완료. 공개 INTAKE_ENABLED=false, 일반 ALIMTALK_ENABLED=false 유지. 시험 한도 소비됨: 추가 알림톡 발송은 새 승인 필요.
- 정식 운영 메일 후속: notify.stgolftours.com 도메인 Resend 등록, 도쿄 리전, 도메인 ID f2fb74f8-4426-49bb-afbc-ce9d583956ba. DNS 인증 대기. 서버 MAIL_FROM은 아직 시험 주소. 가비아 로그인 요청 상태이며 DNS는 변경하지 않음. 기존 NS 가비아, www CNAME goltimjang.github.io 유지.
- Resend 표시 필수 DNS: TXT resend._domainkey.notify (발급된 공개 DKIM), CNAME rsend.notify -> rsend-apne1.forge.rmta.net, CNAME send.notify -> send.forge.rmta.net. 실제 기존 레코드 충돌 검사 후 추가 승인/검증 필요. 루트 _dmarc 안내는 기존 정책과 충돌할 수 있어 적용하지 않음. 수신 메일 Enable Receiving OFF.
- 이번 시험은 관리자 전용 실제 서버 경로의 종단 시험이며 공개 홈페이지 폼은 아직 Formspree 사용. 실제 고객 전환/개인정보 안내/보관·백업 정비/할인부킹 승인 템플릿 연결은 별도 남음.
- 시험 문의는 관리자 UI에서 상담 종료 처리하고 검증 결과 메모 저장. 새로고침 후 전체 1건/신규 0건/상담 종료 1건 확인. 고객 문의와 구분해 기록을 보존했으며 삭제하지 않음.
- 사용자 답변으로 ST-20261011-2832F1B61C50 알림톡의 휴대전화 실제 도착 확인 완료. 가비아 로그인도 사용자 완료, 정식 발신 DNS 확인 계속 진행.
- 가비아 실제 stgolftours.com DNS 확인: A 루트 GitHub 4개, CNAME www, Google 검증 TXT 총 6개. notify 관련 기존 레코드 없음. 필수 메일 인증 3개를 수정 모달에 작성해 각각 행 확인, 전체 저장 전 중지. DNS 저장 및 정식 발신 운영 메일 1건 추가 시험(알림톡 추가 없음) 승인 요청 상태. 초안 화면 /tmp/st-mail-dns-approval-20261011.png.

## 2026-10-11 정식 메일 발신 DNS 승인 적용

- 사용자 승인: notify.stgolftours.com 인증 DNS 3개 저장 및 운영 Gmail 확인 메일 1건 추가 시험. 추가 카카오톡 발송 없음.
- 가비아 16:25:55 KST 저장 성공, 총 9개 레코드 재조회. 기존 홈페이지 A 4개/www CNAME/Google TXT 6개 그대로 유지. TXT resend._domainkey.notify, CNAME rsend.notify/send.notify만 추가. TTL 600.
- ns.gabia.co.kr 권한 DNS 응답에서 신규 TXT/CNAME 실제 값 일치. Resend DNS verified, 도메인 전체 인증은 진행 중인 상태에서 시험 준비.
- 운영자 메일 시험은 Access 및 Origin 검사를 재사용하는 /admin/mail-test. 고정된 기존 시험 접수, 인증 발신자, 운영 Gmail 한 명, 최대 1시간 만료, D1 원자적 시도 기록으로 1건 제한. 신규 문의/알림톡 작업 생성 없음. 응답 불명 시 자동 재시도 없음. 승인한 메일을 1건 보낸 뒤 만료 설정을 제거한다.
- Resend 16:27 KST 도메인 전체 Verified, DKIM/SPF 관련 3개 모두 Verified 확인. MAIL_FROM을 에스티골프투어 접수 알림 <inquiries@notify.stgolftours.com>으로 변경 후 전용 Worker 배포.
- 16:29:19 KST 승인된 운영 메일 추가 1건 발송. provider ID 01a129dd-b80f-7d62-ade4-002fc60c81fa, 제목 [에스티골프투어] 새 문의 ST-20261011-2832F1B61C50 (발신 인증 시험). Resend Sent/Delivered 모두 16:29 확인.
- Gmail ID 1a129ddbf1e3d501, INBOX/IMPORTANT/CATEGORY_UPDATES/UNREAD. 이번 정식 도메인 시험은 스팸함이 아닌 받은편지함 도착 확인. SPF pass(rsend.notify.stgolftours.com), DKIM pass(notify.stgolftours.com). DMARC는 이번 헤더에 별도 결과가 없으며 루트 정책 추가하지 않음. 이 한 번의 성공으로 모든 향후 메일의 받은편지함 도착을 보장하지 않는다.
- 시험 끝난 뒤 MAIL_TEST_EXPIRES_AT 제거 및 Worker b9cf559f-644f-4975-995c-5f5372f2baa2 배포. INTAKE_ENABLED/ALIMTALK_ENABLED/TEST_INTAKE_ENABLED 모두 false. 공개 홈페이지는 Formspree 그대로, 일반 고객 새 백엔드 전환은 미실시.
- 메일 시험 D1 시도 기록 1개와 accepted 기록 1개. 별도 시험 발송이므로 기존 알림 작업의 provider ID/accepted 상태는 보존. 접수 1건/알림톡 작업 1건/알림톡 시도 1회 그대로 확인.
- 로컬 D1 통합 58개와 Alimtalk 모의시험, 운영자 메일 시험의 비활성/수신자 제한/동시 5요청 1발송/응답 불명 재시도 방지 통과. 타입 및 diff 검사 통과.
- 증거: /tmp/st-mail-dns-saved-20261011.png, /tmp/st-mail-domain-verified-20261011.png, /tmp/st-mail-test-delivered-20261011.png. 공개 DNS 정보만 backend/config/resend-domain.json에 기록하며 비밀 키는 Worker Secret에만 보관.

## 2026-10-11 공개 홈페이지 전환

- 사용자 승인: 개인정보 안내·백업 검증 후 홈페이지 전환 및 일반 골프여행 고객 접수 알림톡 자동 발송 활성화. 별도 최종 본인 번호 시험 1건도 승인(기존 포인트 20원 이내).
- 개인정보 안내에 Cloudflare 접수/보안 처리, Resend 최소 정보 운영 메일, SOLAPI·카카오 접수 알림, 국외 처리 가능성, 처리 항목·시점·보관·연락처·거부 시 전화 대안을 반영. 동의 버전 2026-10-11-backend-v2. 보관 정리와 복구 절차는 INQUIRY-OPERATIONS.md.
- 실제 D1 export를 격리된 임시 SQLite에 복원하고 업무 테이블 5개 전체 행 대조/무결성/외래키 검사 통과. 임시 개인정보 복원 파일은 삭제. 현재 Workers Free 및 Time Travel bookmark 조회 확인. 운영 DB 자체를 과거로 되돌리지는 않음.
- Worker 운영 배포 92dea057-c699-49b1-af6c-8a6d087b81e8. INTAKE_ENABLED=true, ALIMTALK_ENABLED=true, RETENTION_ENABLED=true. 관리자 시험 기능은 OFF.
- 할인부킹 템플릿은 콘솔에서 검수진행중 재확인. 부킹 저장·운영 메일은 지원하나 미승인 알림톡은 발송하지 않음. 다른 템플릿으로 대체하지 않음.
- 로컬 58개 D1 통합/모의 알림톡/메일 시험/보관 만료 시험, 견적 전송 28개/부킹 입력 41개 검사, Next production build/110페이지 정적/카탈로그/사진 검사 통과. 개인정보 페이지 모바일375·PC1280 가로 넘침 없음.
- GitHub Pages workflow에 공개 API URL와 Turnstile site key 지정. 비밀키는 포함하지 않음. main 배포와 실제 공개 폼 수신 결과는 아래 후속 검증에 기록한다.
