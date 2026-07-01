# GREATENG handoff

## hw-monitor.html

### 이번 변경 (지연제출 일수 표기)
- **검수 격자에 "+N일" 배지 추가**: 학생 점검(homeworkStatus) 격자에서 status가 `지연제출`인 칸에 숙제 날짜 대비 며칠 뒤 제출인지 `+N일`로 표기.
- 추가 함수 `lateDaysOf(d)` (renderInspectDays 바로 위): `d.submitDate || d.submittedAt || d.submitTs || d.ts` 중 존재하는 제출일을 읽어 `d.date`와의 일수 차이(올림, 양수만) 반환. 후보 필드가 없으면 0 → 배지 미표시(기존 동작 유지).
- `renderInspectDays`: day 칸 렌더에 `lateBadge` 추가. ld>0일 때 `+N일`(font 10px, var(--late), weight 800) 출력.

### 진행 중 / 후속 필요 (정밀)
- **GAS 의존성**: 위 배지는 백엔드가 day 객체에 제출일을 실어 보내야 동작.
  - 대상 GAS: **숙제점검 GAS** (단어시험/index 로그인 GAS 아님)
  - 핸들러 `homeworkStatus`의 `days` 배열 생성부에서, status가 `지연제출`인 day에 해당 row의 제출 타임스탬프를 `submitDate`(YYYY-MM-DD 또는 ISO) 필드로 추가 필요.
  - HTML은 `submitDate/submittedAt/submitTs/ts` 어느 키든 자동 인식. ⚠️ GAS 수정 시: 전체 백업 → 부분 붙여넣기 금지 → '새 버전으로 배포'.
- 확인 필요: `homeworkStatus` 응답 day 객체에 이미 `ts`류 필드가 들어있다면 GAS 수정 없이 바로 표시됨. 응답 샘플 확인 후 확정.

### 추가 변경 (전체 그리드 "+N일" 표기)
- 사용자가 본 화면은 개별 검수가 아니라 **전체 그리드(adminGrid → renderGrid L883~)**. △ 글자만 찍던 곳.
- `buildGrid` L876: `row.statuses[i] || ''` → `(!== undefined && !== null) ? : ''`. 객체값(0/falsy 객체) 보존 위해.
- `renderGrid` 셀 렌더 L897~: `statusByStudent[nm][dt]`가 **문자열("지연제출") 또는 객체({s:"지연제출", late:N})** 둘 다 허용하도록 정규화. st/lateN 분리 추출. 지연이고 late>0이면 `<sup>+N</sup>` 부착.
- 구버전 문자열 status 그대로 동작(하위호환). 단위테스트 통과(O/X/△/◎/시/빈값 + 객체형 △+N).

### 진행 중 / GAS 후속 (그리드용, 정밀)
- ⚠️ **숙제점검 GAS `adminGrid` 핸들러 수정 필요**: status가 `지연제출`인 칸을 `'지연제출'`(문자열) 대신 `{s:'지연제출', late: (제출일-숙제날짜) 일수}` 객체로 push.
  - 위치: adminGrid에서 `statuses` 배열 채우는 루프(학생×날짜). 지연 판정 시점에 해당 row 제출 타임스탬프 보유 중이면 거기서 late 계산.
  - 이 변경 없으면 그리드는 기존처럼 △만 표시(오류 없음).
- 개별 검수(renderInspectDays)용 GAS 후속은 위 항목과 별개 — homeworkStatus day에 submitDate 추가.

### GAS 수정 확정안 (숙제점검 GAS — adminGrid)
- **상태 시트엔 제출시각 없음.** 지연일수는 응답 시트(설문지 응답 시트 1) A열(타임스탬프)·D열(숙제날짜)에서 계산해야 함.
- 수정 대상: **`hw_getAdminGrid_(days)` 함수 1개만 전체 교체.** (hw_getStatus_ 등 타 함수 불변)
- 추가 로직:
  1) 응답 시트 순회 → `earliestSubmit` Map: key `_norm(이름):숙제날짜ms` → 가장 이른 제출 ts(ms). `type==='단어쓰기'` 제외(refreshStatus와 동일).
  2) `lateDaysFor_(nameKey, dms)`: 제출일 0시 − 숙제날짜 0시 일수차(올림→round, 양수만).
  3) statuses 빌드 시 값이 `'지연제출'`이면 `{s:'지연제출', late:N}` 객체, 그 외는 기존 문자열 그대로.
- 지연일수 정의: 숙제날짜 기준 며칠 뒤 제출(예 6/1숙제 6/3제출 = +2). cutoff(48h) 기준 아님 — 화면 직관 우선.
- ⚠️ 배포: 전체 백업 → 함수 블록만 교체 → 저장 → '새 버전으로 배포'(덮어쓰기 아님). 대상=숙제점검 GAS.

### 추가 변경 (그리드 지연일수 글자 키움)
- renderGrid L905 `lateSup`: `<sup>` 9px → `<span>` 13px, weight 900, vertical-align baseline. 위첨자 제거하고 마크(△)와 같은 줄 일반 크기로 표시. 예: `△+2`.

### 산출물
- `숙제관리_GAS_전체.gs`: 전체 통합본 (hw_getAdminGrid_만 교체, 나머지 25개 함수 원본 동일). 구문검증 PASS. 이걸로 GAS 전체 교체 후 '새 버전으로 배포'.
- `hw_getAdminGrid_교체본.gs`: 함수 1개만 바꾸고 싶을 때용.

### 참고 (제출일 데이터 위치)
- 사진/로그 items에는 제출일 정보 존재: `it.ts`(제출시각), `it.due`(숙제 날짜). (renderInspectPhotos L515~, 로그표 L943~)
- day 객체(`renderInspectDays`)에는 기존엔 `date`,`status`만 있었음 — 이번 작업의 핵심 격차.

---

## hub.html

### 이번 변경 (카드 꾸미기 — 아이콘·색 화면 편집)
- 목적: 코드 직접수정 없이 허브 화면에서 카드 **아이콘(이모지)·왼쪽 색선**을 클릭·선택으로 변경. 저장은 기존 '순서 저장'과 동일한 "코드 복사 → PAGES 붙여넣기 → 커밋" 흐름.
- **CSS 추가** (`.sort-bar` @media 뒤): `.edit-btn`(카드 우상단 ✎), `.tile.editable`, `.modal-back`/`.modal`, `.emoji-grid`/`.emoji-cell`/`.emoji-input`, `.color-grid`/`.color-cell`/`.color-custom`, `.modal-preview`, `.modal-actions`/`.btn-cancel`/`.btn-apply`. 기존 토큰(--wine/--gold/--line/--fill) 재사용, 신규 스타일 없음.
- **툴바 변경**: `.sort-ctrl` 안에 `#editToggle`("카드 꾸미기") 버튼을 `#sortToggle` 옆에 배치(flex gap). `#editBar`(꾸미기 저장 바) 추가.
- **모달 마크업**: `.wrap` 닫힘 `</div>` 직후 `#editModal`(미리보기 + 이모지그리드 + 직접입력 + 색상그리드 + color picker + hex + 취소/적용) 추가.
- **render()**: `editMode` 분기 추가 — 편집 모드 시 `<a>` 대신 `<div class="tile editable">` + `.edit-btn`(data-edit=idx) 렌더, 링크 비활성. 끝에 `if(editMode) bindEdit();`.
- **JS 로직 추가** (`정렬 모드 토글` 바로 앞): 상수 `EMOJIS`(32개), `COLORS`(12개). 함수 `bindEdit`, `openEditor(idx)`, `syncEmojiSel`, `setColor(hex)`, `updatePreview`, `closeEditor`, `copyPagesCode`. 이벤트: 이모지셀 클릭 / 직접입력(input) / color picker / hex input / 취소 / 배경클릭 닫기 / 적용(PAGES[idx].icon·color 갱신 후 render) / editToggle / editSave.
- **상호배타 처리**: `editToggle`은 sortMode 켜져있으면 끄고, `sortToggle`은 editMode 켜져있으면 끔. (두 모드 동시 활성 방지)
- **적용 3경로 검증**: 이모지 그리드 클릭 / 이모지 직접붙여넣기 / 색상 HEX 직접입력 모두 정상. softBg()로 아이콘 배경 자동 연화.

### 검증
- node --check: JS 문법 PASS.
- Playwright(headless, auth 게이트 제거 후): 카드 11개 렌더, 편집버튼 11개, 모달 open/apply 정상, JS 콘솔에러 없음(403은 로컬 auth.js 원격검증 실패로 기능 무관).

### 진행 중 / 후속 필요
- 저장은 **수동 흐름 유지**(정적 사이트라 자동저장 불가): 꾸미기 후 '변경 저장(코드 복사)' → GitHub에서 hub.html의 `const PAGES = [ ... ];`(L116~ 부근) 통째 교체 → 커밋. copyPagesCode()가 순서까지 포함해 출력하므로 순서·꾸미기 어느 쪽 저장이든 최신 PAGES 전체가 복사됨.
- `auth.js` 게이트가 실제 배포 환경에서 편집 버튼 클릭을 막지 않는지 로그인 후 확인 필요(로컬 테스트에선 게이트 제거하고 검증). 로그인 통과 상태면 게이트 div가 사라지므로 정상 동작 예상.

### 산출물
- `hub.html`: 카드 꾸미기 기능 포함 전체본(456줄). 기존 순서편집·드래그·PAGES 구조 모두 보존, diff 기준 추가만 함.

---

## 위젯 (네이버 블로그) — 참고 메모
- 여름특강 위젯: link `summer.html`, img `image/summer.png`.
- 수능파이널 위젯: link `suneung_2026.html`, img `image/sf_widget_banner.png`(구 `suneung_final.png`는 영문라벨 "Summer Intensive" 오타 → `sf_widget_banner.png`로 교체, 라벨 "Final Class"). width=170 권장(네 위젯 통일).
- 네이버 위젯 제약: 가로 170px·세로 600px 한계, JS/iframe 불가, `<a><img></a>` 형태만. 이미지 파일명 공백 금지(URL %20 이슈).
