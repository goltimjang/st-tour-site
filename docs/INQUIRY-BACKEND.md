# 자체 문의 접수 서버 1차 구현

작성: 2026-10-07. 브랜치: feature/inquiry-backend.

## 현재 상태

- **로컬 구현/검증 단계**. 운영 홈페이지는 기존 Formspree를 사용한다. Cloudflare 배포, 운영 DB 생성, 관리자 로그인 연결, 실제 이메일 발송, 알림톡은 아직 완료되지 않았다.
- 현재 브라우저의 Cloudflare 계정은 운영 메일과 다르므로 사용자에게 사용 계정을 확인 중이다. 계정 ID나 비밀 키를 이 문서에 저장하지 않는다.
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
