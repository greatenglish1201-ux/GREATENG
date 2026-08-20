# GREATENG 작업 핸드오프
> 새 대화 시작 시 이 파일 링크를 Claude에게 주면 맥락이 복원됩니다.
> 마지막 갱신: 2026-07-01

## 0. 기본 정보
- 저장소: greatenglish1201-ux/GREATENG (GitHub Pages 배포)
- 배포 주소: greatenglish1201-ux.github.io/GREATENG/
- GA4 측정 ID: G-12E7VM1SQ8
- 브랜드 컬러: 와인 #7a1020, 골드 #C9A84C, 잉크 #3a2a20 / Pretendard 폰트
- index 로그인 GAS URL: `AKfycbyzDwEtCDj2wS_bPeujjVY52pvrmAMG7KtcupXDD05lb8EXfanJCsfYB44iKsCuOGVV`
  (index.html 589줄 HARDCODED_URL / report.html GAS_URL — 반드시 동일해야 함)

## 1. 지금 진행 중인 작업 ⬅️ 가장 중요
### GAS v3 (성능 캐시) — 2026-08-09, 배포 대기
**증상:** v2 배포 후 관리자 시험결과·교재목록이 "데이터 없음". 원인은 v2가 아니라 **결과 시트 누적으로 getStats가 15초 타임아웃 초과**. Console 로그 `Uncaught ReferenceError: __gas_cb_..._is not defined`(응답 도착 시 콜백이 이미 정리됨) + Network 타임라인 20초 초과로 확정. GAS 직접 호출은 정상(데이터 무손상).
**조치 (v3):**
- `getStats`/`getRank`/`getStatsDetailed`에 **CacheService 5분 캐시** 래퍼. 원본 계산 로직은 무수정으로 `*_uncached_` 로 이름만 변경(균등배분·사각지대·Bayesian 등 기존 튜닝 전부 보존).
- 무효화: `_bumpCache_()`를 saveResult(응시 저장)·saveStudent(통계시작일 변경)·archiveResults(wipe) 3곳에 배치 → 버전태그 방식이라 최신성 보장.
- 100KB 초과 응답은 캐시 생략(GAS 제한 회피), CacheService 실패 시 계산값 그대로 반환(안전).
- `index.html` jsonpFetch **타임아웃 15초 → 45초**(131줄). 캐시 미스 첫 호출 대비.
- 시뮬레이션 검증: 캐시 히트/무효화 후 재계산/학생별 키 분리 전부 정상. 문법 검증 통과.
**배포:** `gas_greateng_v3.gs` 전체 교체 → 저장 → 새 버전 배포. + 갱신된 index.html 업로드.
**후속 근본 대책(미실행):** 결과 시트 연도별 물리 분리(1학기분을 아카이브로 덜어내 읽는 양 감축). 고3 이력 영향 있어 신중히, 12월 연 리셋 때 함께.


### GAS v2 배포 (2026-08-09) — 배포는 v2 파일(`gas_greateng_v2.gs`)로!
- **목표 재확정:** 학기 전환은 삭제 없이 "학생별 통계시작일" 소프트 리셋 / 물리 리셋(아카이브+비움)은 **연도별 1회**(수능 직후~12월경, `결과_2026` 라벨).
- **v2 추가분** (v1 위에 누적):
  - `학생` 시트 **F열 '통계시작일'** — 빈칸=전체 인식(고3 기본). 고1은 새 학기 기준일 입력 → 랭킹·유형·틀린지문·오답복습·블라인드스팟이 그 날짜 이후만 인식.
  - `getStats`(417~449줄 부근): 함수 초입에 statsFromMap 로드 + 메인 루프에서 기준일 이전 행 continue.
  - `getRank`: 동일 필터(랭킹 일관성).
  - `login`/`getStudents`/`saveStudent`: statsFrom 필드 왕복. saveStudent는 statsFrom 미전달 시 기존 값 보존(구버전 index.html 호환 — 319줄 keep 로직).
  - `getResults`는 **의도적으로 필터 없음** (관리자 원본 열람 통로). index.html 확인 결과 오답복습(1001줄)·블라인드스팟·랭킹 전부 getStats/getRank만 사용 → 커버리지 완전.
- **시뮬레이션 검증 완료 (2026-08-09, v2.1 수정 반영):**
  - 업로드된 현행 index.html과 패치본 diff → 차이는 패치 21줄뿐(그사이 변경 없음). 패치본 그대로 업로드 안전 확인.
  - 결함 2건 발견·수정: ① 날짜 파싱 실패 행이 기준일 학생에서 통째 제외되던 것 → "파싱 불가=포함"으로 안전화 ② statsFromMap 조회 시 이름 미trim으로 필터 누수 가능 → trim 조회. getStats·getRank 양쪽 반영.
  - 경계 확인: 기준일 당일 00:00부터 포함(이전만 제외). 정상.
  - F열 날짜 입력: `2026-08-10`, `2026.8.10`, 시트 자동 날짜형 모두 인식. `20260810`(붙여쓰기)만 인식 실패 → **하이픈/점 형식으로 입력할 것**.
- **배포 진행 상황:** 필립이 8단계 중 1(GAS 열기)·2(코드 백업) 완료. **3단계부터 v2 파일로 진행.** `결과` 시트 아카이브 사본도 완료됨.
- **배포 후 필립 수동 1회:** `학생` 시트 F1에 `통계시작일` 헤더 입력. 이후 값 입력은 **index.html 학생관리 UI에서 가능**(아래 참조).
- **index.html 학생관리 UI 통계 기준일 추가 (2026-08-09, 5318→5337줄):** 날짜 3개 혼동 방지를 위해 두 그룹으로 시각 분리 — 📅수강 관리(베이지 #fdfaf4: 학습 시작일·만료일) / 📊성적 집계(연녹 #f6f9f6: 통계 기준일, "비우면 전체 기간 · 삭제 아님" 안내). 학생 목록에는 기준일 있는 학생만 초록 배지(`📊 날짜~`) 표시. statsFrom 배선 8곳: 1253(state) 1289(normDate 로드) 1394(저장 payload) 1402·1932(리셋) 1487(편집 진입) 1918(입력) 1946(목록 배지). Babel JSX 컴파일 검증 통과.
- **성능 로드맵(기록):** 현재 규모(~300행)는 문제없음. 체감 저하 시 ① 연도별 시트 분리(=연 리셋 루틴이 자연 해결) ② CacheService 5~10분 캐시 ③ 증분 집계 순으로 카드 사용.


### DB 처리 방침 확정 (2026-07-09, 시험 종료 후)
- **아카이브 라벨 규칙: `YYYY_N학기_중간|기말`** (시트·repo 폴더 공통). 이번: `2026_1학기_기말`.
- **결과 시트: 아카이브만, 비우지 않음.** 사유: 수특(27ST_E)·영독(27STYD)·모의고사(MOGO) 학습이 올해 말까지 이어져, 원본을 비우면 오답복습·블라인드스팟·랭킹 이력이 끊김. 절대유형(ABSO_TYPE)은 수명 종료지만 삭제하지 않고 자연 은퇴(삭제 실익 없음, 삭제 리스크만 존재).
- **필립 수동 실행 대기(사실상 1개):** `결과` 시트 탭 복사 → `결과_2026_1학기_기말`로 이름 변경. 끝.
- **예상문제 JSON 정리는 선택사항으로 정정 (2026-07-09):** 원본은 exams 시트 json 열에 이미 영구 보존됨(saveExam이 JSON 통째 저장, key별 upsert). repo의 JSON은 서빙용 사본일 뿐이라 이동은 폴더 정리 취향의 문제. 이동한다면 results.html 등에서 해당 경로 참조 여부 먼저 확인(링크 깨짐 방지). 그냥 둬도 무손실.
- **장기 과제 예약:** getStats에 기간 필터(시즌별 랭킹 필요 시, 다음 GAS 작업 때 동반).


### 학부모 상담용 시험기간 종합 리포트 + 결과 아카이빙 (이번 세션 신규 구축, 배포 대기)
확정된 설계: report.html 독립 페이지 / 본문시험만(단어시험 v2로 보류) / long format 진단(Level 2까지) / 유형별 진단 / 시험기간 = 관리자가 GAS에 설정 / results 시험기간별 시트 복제 분리 / distractor_type 컬럼은 예약만(값 보류).

**배포 순서(중요) — 아직 아무것도 반영 안 됨:**
1. ⚠️ **index 로그인 GAS 교체** — `gas_greateng.gs` 전체를 붙여넣기 (뒤 3번 항목 참조)
2. **index.html 교체** — detail 생성부 확장본 (뒤 상세)
3. **report.html + auth.js 업로드** — 저장소 루트에 (auth.js는 기존 것 그대로 재사용, 변경 없음)
4. 관리자가 `setExamPeriod`로 현재 시험기간 1회 설정 → 이후 응시분부터 자동 태깅
   ※ 시험이 끝났으므로 **다음 시험 라벨(예: `2026_2학기_중간`)**로 설정할 것 — 여름 학습분부터 다음 상담 재료로 축적

**미완/다음 할 일:**
- report.html의 `GAS_URL`(약 90줄 부근 `var GAS_URL=`)이 index.html HARDCODED_URL과 동일한지 배포 전 재확인.
- **과거 응시분엔 exam_period·정답/선택 데이터 없음**: 결과_상세는 이번 배포 이후 응시분부터 채워짐. 과거 데이터는 '전체 기간'으로만 조회 가능(유형·회차는 나오나 오답번호는 공란).
- distractor_type 자동분류(Level 3)는 teacher.html에서 함정유형 export 붙일 때 진행 — 컬럼(`결과_상세` K열)은 이미 예약됨, GAS 재수정 불필요.
- 단어시험 통합(성실도 지표)은 v2 보류. report.html에 섹션 미배치.

## 2. 보류 / 미적용 (적용 시 주의)
- index.html 대량 학생등록 / 일괄 날짜 기능: 빌드됐으나 미적용. 적용 시 그 시점 최신 index.html 새로 받아 재작업.
- 보카·지문 DB 교재명 통일: 다음 시험 준비 때 진행. 아카이빙 시점에 지문 DB 체계로 매핑하면 일석이조.
- distractor_type(함정유형) 값 채우기: 이번엔 보류(유형별 진단까지만).

## 3. GAS 상태 ⚠️
- **대상: index 로그인 GAS** (단어시험/숙제점검 GAS 아님 — 반드시 구분)
- **이번 변경 = 전체 교체본 `gas_greateng.gs` 제공.** 기존 함수 전부 보존 + 아래만 변경/추가:
  - `saveResult` **변경**: 기존 '결과' 시트 append **유지**(getStats/getRank 무손상) + 신규 `결과_상세`(long format) 시트에 **추가** append + 현재 시험기간(ScriptProperties `CUR_EXAM_PERIOD`) 자동 태깅.
  - **신규 함수/액션 5개**: `setExamPeriod`(관리자 인증), `getExamPeriod`, `listExamPeriods`, `archiveResults`(시험기간별 시트 복제, wipe 옵션·하드삭제 없음), `getStatsDetailed`(상담리포트용 유형별 진단 집계).
  - **신규 헬퍼**: `ensureResultDetailSheet_` (결과_상세 시트 자동 생성, 헤더 11열).
  - route() switch에 신규 5개 case 추가.
- **detail 포맷 하위호환**: `pid|유형|O/X` → `pid|유형|O/X|정답|선택`로 확장. 기존 파서(getStats·getRank)는 `parts.length>=3`만 읽어 앞 3필드만 사용 → **안 깨짐**.
- ⚠️ **작업 철칙**: (1) 기존 GAS 전체 백업 먼저 (2) 코드 일부만 붙여넣지 말고 전체 교체 (3) 저장 후 반드시 **'새 버전으로 배포'**(덮어쓰기 아님) (4) 대상이 **index 로그인 GAS**인지 확인.
- 신규 시트 `결과_상세` 헤더: `timestamp | exam_period | student_name | session_id | q_no | pid | q_type | correct_ans | chosen_ans | is_correct | distractor_type`

## 4. 다음 사이클 예정
- 배포 후 실제 응시 1건으로 결과_상세 적재 확인 → report.html 조회 검증.
- 시험 종료 시 `archiveResults`(label 예: `2026_1학기_기말`, wipe=true) 실행해 결과 분리.
- 예상문제/지문 JSON은 GitHub `/archive/2026-1학기_기말/`로 이동(커밋 히스토리 보존).
- teacher.html 함정유형 export → distractor_type 채우기(Level 3).
- 단어시험 통합 필요성 재판단(v1 상담 사용 후).

## 5. 최근 완료 (이번 세션)
- `gas_greateng.gs`: index 로그인 GAS 전체 교체본 (saveResult 확장 + 신규 5액션). node --check 문법 통과, 함수 39개.
- `index.html`: 결과 저장 detail 생성부 확장 (5064~5087줄 부근). summary/insert/irrelevant/일반 4유형별 정답·선택 번호 직렬화 추가. 기존 5297줄 → 5318줄. 핵심 앵커(HARDCODED_URL·jsonpFetch·saveResult) 무손상.
- `report.html`: 신규. auth.js 게이트 재사용 + 시험기간/학생 드롭다운 + 히어로 + 유형별 진단바(취약순, n 표기) + 회차 추이 테이블 + 자동 진단 초안(경향 표현, 단정 회피) + 선생님 총평 슬롯(textarea) + 인쇄. JS 문법 통과.

## 산출물 (이번 세션)
- `gas_greateng.gs` (index 로그인 GAS 전체 교체본)
- `index.html` (detail 확장본)
- `report.html` (신규 상담 리포트)
- `handoff.md`
- ※ auth.js는 변경 없음 — 기존 저장소의 것 그대로 사용. report.html과 같은 폴더(루트)에 있어야 함.
