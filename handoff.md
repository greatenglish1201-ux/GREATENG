# GREATENG exam-analysis.html 작업 인계 (handoff)

작업 파일 `/home/claude/dongjigo/exam_work.html` → `/mnt/user-data/outputs/exam-analysis.html` (미러).
레포 `greatenglish1201-ux/GREATENG`. 항상 존댓말. 브랜드 와인`#7a1020`·골드`#C9A84C`.

---

## ✅ 이번 세션(최신) 완료 — "해설 수정해도 안 바뀐다" 버그 해결

**원인:** `renderReview()`(2746줄)가 카드를 그릴 때 **2752줄에서 `generatedQs.filter(q=>q.type!=='group')`** 를 써서 group(지문 묶음) 컨테이너만 제외하고 **그 안의 하위 문항을 펼치지 않았음**. 반면 `rvSave(n)`(2939줄)는 `_flat(generatedQs).find(...)`로 중첩을 평탄화해 정확한 객체의 `q.explanation`을 수정함.
→ 결과: group에 묶인 문항(예: 6번)은 메모리상으로는 수정되지만(`rvSave`는 옳은 객체를 고침), 화면을 그리는 `renderReview`가 그 객체를 보지 못해 옛 값으로 표시됨. **지난 세션의 group 버그 수정은 `rvSave` 절반만 고친 것이었고, 렌더 절반(`renderReview`)이 남아 있었음.**

**수정 (1줄 교체, 2752줄):**
```js
// before
const Q=generatedQs.filter(q=>q.type!=='group');
// after
const Q=_flat(generatedQs);  // group 내부 문항까지 펼쳐서 검토 (rvSave의 _flat과 일치)
```
`_flat`(1801줄)이 group 항목 자체를 펼쳐 하위 문항만 내보내므로 `type!=='group'` 필터는 불필요(평탄화 결과에 group 컨테이너 미포함).

**안전성 확인:**
- group 하위 문항은 자체적으로 `num/question/choices/explanation` 보유(표준 처리: 1494줄 `flatQs`, 2042줄, 3027줄도 동일하게 펼침).
- `_rvVerify`(2649줄)는 `q._orig`가 없으면 **반려하지 않고 '사람 확인(검수권장)'으로만 표시**(2655줄 주석) → group 하위 문항이 부모 원문을 상속해 `_orig`가 비어도 카드는 정상 렌더, 깨지지 않음.
- `<script>` 태그 균형 2:2 정상.

---

## ✅ 이번 세션(추가) — 교과서 지문 입력 시 콘솔 에러 / 저장 점검

**증상:** `Uncaught ReferenceError: updateManualCount is not defined` — 본문/대화문 textarea `oninput`에서 매 입력마다 발생.

**원인 1 (수정함): `updateManualCount` 함수 미정의.**
- 호출만 존재(863·874줄 `oninput="updateManualCount()"`), 정의 0건. `clearAllManual`(1285줄 부근)은 정상 → 어느 편집에서 카운터 함수만 누락된 것으로 추정.
- **복구:** `clearAllManual` 앞에 `updateManualCount()` 추가 — `manualTextBody`/`manualTextDialog` 읽어 글자수·단어수를 `#manualCountInfo`(880줄)에 표시. `clearAllManual` 끝에도 `updateManualCount()` 호출 추가.
- 위치: 현재 `function updateManualCount(){...}` **1285줄**.

**원인 2 (미수정·확인 필요): `grammarPointInput` 입력 UI(HTML) 부재.**
- `saveMiddlePassages`(1186줄)·`loadMiddlePassages`(1270줄)는 `document.getElementById('grammarPointInput')?.value`를 읽고 씀. 옵셔널 체이닝이라 에러는 없으나 **요소가 없어 문법포인트가 항상 ''(빈 값)으로 저장됨.**
- 조치 안 함(HTML 구조 변경 + 필립 확인 필요). 추가 시 본문/대화문 칸(853~877줄) 근처에 `<textarea id="grammarPointInput">` 삽입.

**저장 실패 자체 원인 판단:**
- `saveMiddlePassages`는 독립 함수라 원인1과 직접 연결은 아님. 단, oninput 에러가 다른 초기화/이벤트를 막았다면 이번 수정으로 해소됐을 수 있음.
- 저장 경로는 `postToGAS({action:'saveMiddlePassage',...})`(1172줄~) → `APPS_SCRIPT_URL`(1038줄). ⚠️ **주의: `postToGAS`는 iframe 응답을 못 읽으면 무조건 `{ok:true}` 반환(1104·1110줄) → GAS가 실제 실패해도 화면엔 "✅ 저장 완료"로 보일 수 있음.** "완료 떴는데 시트에 없음"이면 GAS(`saveMiddlePassage` 핸들러) 점검 필요. 과거 doGet 덮어쓰기 사고 인스턴스와 동일 URL.

---

## 직전 세션 완료(이전 파일에 반영됨)

1. 검토 탭 3구역 UI — ⛔반려/👁검수권장/✓자동통과, 심플 디자인(반려만 빨강 강조)
2. 검수 안내 상세화 — 유형별 정답확인·오답확인(선지 나열)·단서·해설대조
3. 본문 하이라이트 — 어법/어휘 정답 밑줄 빨강 (빈칸은 표시 안 함)
4. 빈칸 원문 자리 찾기 `_rvBlankOriginal(q)` — 출제본 빈칸 앞뒤로 _orig에서 원문 구절 추출, 실패 시 이유 표시
5. 빈칸 AI 두 옵션 — ①원문 그대로 정답+오답만 AI(mode=keep) / ②원문 변형(transform). `rvAIBlankMode`·`rvAIBlankReset`
6. GitHub 직접 저장 `rvSaveToGitHub` — 파일명 `원본베이스_v버전_YYYYMMDD_HHMM.json`, exams/ 폴더, 저장 후 재읽기 검증
7. 로컬 저장도 동일 파일명 — 공통 함수 `_examFileBase()`·`_examStamp()`
8. 파일명 확인 프롬프트 `_confirmFileBase()` — 기본값 'exam'이면 경고+입력
9. rvSave group 버그 수정 — `generatedQs.find` → `_flat(generatedQs).find` (※ 위에서 보듯 rvSave만 고쳐졌고 renderReview는 이번 세션에 마저 고침)

---

## 🔎 미해결 / 다음 창 확인 사항

- **이번 수정 실사용 검증 필요:** 6번(또는 group 내 문항) 해설 수정·저장 → **검토 탭 화면에서 즉시 반영되는지** 확인. 함께 출력 탭/인쇄 미리보기도 일치하는지 교차 확인.
  - 그래도 안 바뀌면: 수정창이 닫힌 채(`.rf-exp`가 display:none 상태이나 DOM엔 존재) 저장됐는지 → `rvSave`(2939줄)에서 `.rf-exp` `.value` 읽기 시점 점검. 단, 현재 코드상 textarea는 렌더돼 있어 값은 읽힘.
- (참고) group 하위 문항 `_orig` 상속 폴백은 없음 → 그런 문항은 '검수권장'으로 분류됨(반려 아님). 원문 대조까지 자동화하려면 `_flat` 직후 부모 group의 `_orig`를 하위 문항에 주입하는 폴백 추가 검토. **우선순위 낮음.**

---

## 핵심 함수 위치 (exam_work.html, 현재 3048줄)

- `renderReview()` **2746** / 평탄화 적용 라인 **2752**
- `rvSave(n)` **2939** / `_flat` **1801**
- 검토 카드 렌더 `cardHtml` (renderReview 내부, 카드 템플릿 ~2839) · 수정창 입력란 `.rf-stem/.rf-body/.rf-ch/.rf-ans/.rf-exp` (2855~2865)
- `rvToggle(n)` **2933** · `rvCardToggle(n)` **2906** · `rvApprove(n)` **2914**
- `_rvVerify(q)` **2649** (원문 없으면 검수권장 처리)
- `rvSaveToGitHub` **2984** · `rvExport` **2975** · `_examFileBase/_examStamp/_confirmFileBase` 2953~2974

---

## ⚠️ 주의

- **GAS 작업 극도 위험**(과거 doGet 덮어쓰기 사고). 전체 백업 후 전체 교체만, 새 버전 배포, 어느 인스턴스(voca/hw-monitor/index)인지 확인.
- **teacher.html passages.js 필드 보호**(필드 삭제·개명 금지, buildOutput 신규 필드는 사전 확인).
- 파일 교체 후 반드시 **Ctrl+Shift+R 강력 새로고침**(캐시 때문에 "안 바뀜" 재발).
