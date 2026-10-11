# 접수 운영 및 복구 절차

2026-10-11. 운영 계정 goltimjang@gmail.com. 접수함 https://st-tour-inquiries.forceo007.workers.dev/admin/ . 관리자 인증 후 확인한다.

## 정상 흐름

1. 고객이 개인정보 안내를 확인하고 견적 요청을 제출한다.
2. 서버는 입력·동의 버전·Turnstile을 검증하고 D1에 문의와 알림 작업을 함께 저장한다.
3. DB 저장이 확인된 접수번호를 고객 화면에 표시한다. 메일·알림톡 실패는 저장된 문의를 취소하지 않는다.
4. 운영 메일에는 접수번호와 보호된 접수함 주소만 들어간다. 고객 정보는 관리자 로그인 후 확인한다.
5. 국내·해외·상품·프로모션 골프여행은 승인된 접수 알림톡을 보낸다. 할인부킹은 전용 템플릿이 검수 중이므로 저장·운영 메일까지만 자동 처리한다.

메일 accepted와 알림톡 accepted는 발송 서비스의 접수 상태다. 실제 수신은 Gmail의 Inbox/Spam, SOLAPI의 최종 메시지 로그에서 별도 확인한다. 알림톡 미사용 전화번호·서비스 장애·잔액 부족 등은 실패할 수 있으므로 접수함을 상담 기준으로 삼는다. 예약 확정 안내와 접수 완료 안내를 혼동하지 않는다.

## 매일 확인

- 신규 문의 및 발송 확인 필요 건, 운영 메일 스팸함 확인.
- SOLAPI 잔액·하루 발송 한도 확인. 2026-10-11 최종 시험 후 잔액 261원, 일 한도 잔여 47건. 운영 전 충전 필요. 유료 충전·자동 결제는 설정하지 않았다.
- SOLAPI 서버 키 만료 2027-01-09 23:59:59 KST. 만료 전에 기존 권한 범위로 갱신하고 Worker Secret에만 저장한다.
- Resend 무료 발송 한도와 Cloudflare 무료 사용량을 콘솔에서 확인. 한도 초과는 메일/접수에 영향을 줄 수 있다.
- 운영 메일은 같은 중복 방지 키로 제한된 재시도를 수행한다. 응답 불명인 알림톡은 중복 방지를 위해 자동 재발송하지 않는다. SOLAPI 로그 확인 후 필요한 고객에게 수동 연락한다.

## 보관 및 삭제

- 일반 문의는 최종 접수/상담 기록 갱신 후 1년, 예약 확정 이력이 있는 관련 기록은 5년 기준으로 정리한다.
- 5분 주기 작업은 만료 레코드를 최대 1건씩 종속 알림/상담 기록과 원자적으로 삭제한다. 관리자 동시 편집 시 버전이 다르면 삭제하지 않는다. 복구용 Time Travel 이력은 별도 7일 보관된다.
- 고객의 삭제·처리정지 요청은 본인 확인 후 관련 법령상 보관 의무와 범위를 검토한다. 서비스 제공자별 발송 이력의 삭제 요청도 별도 처리한다.
- 기존 Formspree 자료는 자동 이관하거나 삭제하지 않았다. 종전 접수 기록도 보관 기한과 요청에 맞춰 관리한다.

## 백업 검증

Cloudflare Workers Free 플랜을 실제 콘솔에서 확인했다. D1 Time Travel은 별도 예약 없이 항상 동작하며 현재 플랜은 7일 복구 이력을 제공한다. 2026-10-11 실제 bookmark 조회 성공:
`00000008-00000000-00005101-a5f2ccd882bea53006cb1f124ff7c6e4`

`python3 backend/scripts/verify-backup.py`는 운영 DB를 읽기 전용으로 export하고 권한 0700 임시 폴더의 SQLite에 복원한다. 무결성·외래키 및 5개 업무 테이블의 모든 행을 운영 DB와 대조하고 SHA256/건수만 출력한다. 원본 개인정보가 들어 있는 SQL/복원 DB는 실행 종료 시 삭제된다. 접수 중에는 스냅샷 이후 데이터가 바뀌어 비교가 실패할 수 있으므로 유지보수 시간에 점검한다.

2026-10-11 실제 운영 데이터 결과: inquiries 1, notifications 1, alimtalk_jobs 1, audit_events 4, rate_limits 1. 전체 행 동일, integrity/foreign_key_check 통과. 운영 DB를 덮어쓰는 Time Travel 복원은 수행하지 않았다.

## 실제 장애 복구 시

1. 현재 설정·배포 버전과 최신 DB export를 비공개 저장소에 보존한다. 공개 GitHub에 고객 데이터나 백업을 넣지 않는다.
2. INTAKE_ENABLED=false, ALIMTALK_ENABLED=false, RETENTION_ENABLED=false로 두고 wrangler의 triggers.crons를 빈 배열로 만들어 작업을 중지한 유지보수 배포를 한다. 복구 중에는 메일 재시도 버튼도 사용하지 않는다.
3. `wrangler d1 time-travel info st-tour-inquiries`로 현재 되돌리기용 bookmark를 기록하고 장애 직전 시점을 선택한다. 실제 restore는 기존 DB를 덮어쓰므로 복구 시점·영향 건수에 대해 운영자 승인을 먼저 받는다.
4. 복원 후 접수번호·건수·최근 문의를 대조한다. 복원 뒤 사라진 접수는 최신 export와 비교해 복구한다. 삭제 요청과 보관 만료 데이터가 부활하지 않도록 재반영한다.
5. 복원 시점 이후 발송된 메일·알림톡은 Resend/SOLAPI 이력과 대조한다. 발송 여부가 불명확한 작업은 자동 재발송 상태로 돌리지 않는다. 특히 24시간 넘은 메일의 중복 방지 키는 보장되지 않는다.
6. 무결성·문의·발송 이력 대조와 삭제 요청 재적용을 마친 후에만 Cron/접수/알림톡을 다시 켠다.

## 홈페이지 롤백

새 요청을 기존 접수 경로로 되돌려야 하면 workflow의 NEXT_PUBLIC_INQUIRY_API_URL과 NEXT_PUBLIC_TURNSTILE_SITE_KEY를 제거한 커밋을 배포한다. Formspree가 실제 접수 가능한 상태인지 먼저 확인한다. 응답이 불명확한 고객 요청을 자동으로 두 서비스에 보내지 않는다. 새 서버에 이미 저장된 문의는 접수함에서 계속 처리한다.

## 공식 근거

- https://developers.cloudflare.com/d1/reference/time-travel/
- https://developers.cloudflare.com/d1/platform/limits/
- https://resend.com/security
- https://resend.com/docs/dashboard/emails/idempotency-keys
- https://solapi.com/guides/privacy
