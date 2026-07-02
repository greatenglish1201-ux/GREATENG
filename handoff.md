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

### 추가 변경 (리포트 총평 — 지연多+미제출 케이스 불일치 수정)
- 증상: 제출12·지연8·미제출2 → `teacherComment`(L770~)에서 `l/total ≥ 0.3`(36%)이 `m ≥ 2` 검사보다 먼저 걸려 `[습관 형성]` 반환. 이 문구가 미제출을 전혀 언급하지 않아 데이터(미제출 2)와 총평이 불일치.
- 수정: `teacherComment` 내 `l/total >= 0.3` 분기를 블록으로 확장(수정 후 L774~777). `m >= 1`이면 "…기한을 넘겨 제출하는 경우가 많고, 미제출도 N회 있었습니다…" 문구, `m === 0`이면 기존 문구 그대로(하위호환).
- 회귀테스트 8케이스 통과: (12,8,2)→습관형성(미제출 언급), (12,8,0)→습관형성(기존문구), (10,0,3)→관심필요, (20,1,1)→양호, (22,0,0)→최우수, (21,1,0)→우수, (18,4,0)→성실, (15,3,2)→보완권장.
- 참고: 우수/성실/최우수 분기는 분기 순서상 m=0일 때만 도달하므로 추가 수정 불요. GAS 수정 없음(프론트 문구 로직만).

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

### 추가 변경 (제목·설명 텍스트 편집)
- 편집창에 **제목(name)·설명(desc) 입력칸** 추가 → 이제 편집창 하나에서 제목·설명·아이콘·색 4가지 편집.
- 모달 마크업: 미리보기 아래 `.text-input#edNameInput`(maxlength 20), `#edDescInput`(maxlength 40) 추가. 미리보기에 `.pv-desc#edPvDesc` 추가(제목 아래 설명 표시).
- CSS: `.text-input`(emoji-input과 동일 스타일), `.modal-preview .pv-desc` 추가.
- JS: draft 변수 `draftName`/`draftDesc` 추가. `openEditor`에서 초기값 세팅 + 입력칸 value 채움. `edTitle`은 이제 항상 "카드 꾸미기"(카드명 미포함, 편집 중 제목바뀜 대응). `updatePreview`가 `draftName`/`draftDesc` 실시간 반영(기존 `PAGES[editTarget].name` 직접참조 제거). name/desc input 이벤트 추가. `적용` 시 `PAGES[idx].name/desc`도 저장, **빈 제목이면 alert 후 차단**(카드 깨짐 방지).
- 검증: node --check PASS. Playwright — 초기값 로드/텍스트 편집 반영/적용 후 카드 텍스트 변경/빈제목 방어(모달 유지) 정상, JS 에러 없음.
- 전체본 486줄.

### 추가 변경 (페이지 추가·삭제 + URL 편집)
- 편집창에서 **URL(연결 주소) 편집** 가능 + **새 카드 추가** + **카드 삭제**까지. 이제 화면만으로 카드 CRUD 전부.
- 모달 마크업: 설명 아래 `#edUrlInput`(연결 주소, maxlength 300) 추가. 액션 버튼 아래 `.modal-delete#edDelete`("이 카드 삭제") 추가.
- CSS: `.tile.add-tile`(점선 + 카드, hover 와인), `.modal-delete`(연한 적색 톤) 추가.
- render: editMode일 때 그리드 끝에 `#addTile`("+ 새 카드") insertAdjacentHTML로 append → click=openNewCard. edit-btn title "이 카드 편집"로 변경.
- JS 상태: `isNewCard` 플래그, `draftUrl` 추가. **openEditor를 `fillEditor()`로 리팩터**(그리드 렌더 공통화) + `openNewCard()`(빈 draft, 삭제버튼 숨김, 제목 "새 카드 추가") 신설. openEditor는 제목 "카드 편집", 삭제버튼 표시.
- 적용 로직 재작성: 제목·**URL 둘 다 필수**(빈값이면 alert 차단). `isNewCard`면 `PAGES.push(...)` + `order.push(끝인덱스)`, 아니면 기존 인덱스 갱신(url 포함).
- 삭제: confirm 후 `PAGES.splice(del,1)` + **order 재구성**(삭제 idx 제거 + del보다 큰 인덱스 -1). 저장 전이면 새로고침으로 복구 가능(안내 포함).
- ⚠️ 저장은 여전히 수동: 추가·삭제·편집 뒤 '변경 저장(코드 복사)' → hub.html의 `const PAGES` 통째 교체 → 커밋. copyPagesCode는 order 순서대로 출력하므로 추가분·삭제분·순서 모두 반영됨.
- 검증: node --check PASS. Playwright — 새카드 추가(11→12) / 신규모달 삭제버튼 숨김 / URL 빈값 방어 / 편집모달 URL 로드 / 삭제(12→11, order 정합) 전부 정상, JS 에러 없음.

### 산출물 (최종)
- `hub.html`: 카드 꾸미기(아이콘·색) + 텍스트(제목·설명) + URL 편집 + 카드 추가/삭제 전체본(554줄). 기존 순서편집·드래그·PAGES·auth 게이트 모두 보존, diff 기준 추가만.

### 추가 변경 (그룹핑 — 그룹 묶기·접기·관리)
- 카드를 **그룹으로 묶고**, 자주 안 쓰는 그룹은 **접으면 텍스트 칩으로 가로 좁게** 표시. 그룹 접힘 상태는 코드 저장(전 기기 동일).
- **데이터 구조**: 각 카드에 `group:"그룹명"` 필드 추가(없으면 '기타'). 신규 `const GROUPS = [{name, collapsed}]`(순서=표시순서, PAGES 정의 바로 아래). 카드의 group이 GROUPS에 없으면 '기타' 섹션으로.
- **CSS**: `.group-sec/.group-head`(chevron·count배지·라인), `.chip-row/.chip`(접힌 그룹용 좌측 컬러바 칩), `.group-drop`(꾸미기 모드 드롭영역), 그룹관리 모달용 `.grp-row/.grp-move/.grp-name/.grp-collapse/.grp-del/.grp-add`.
- **render 전면 재구성**: 단일 `order.map` → `groupedOrder()`로 그룹별 버킷 분류 후 섹션 렌더. 헬퍼 분리: `cardTile(idx)`·`cardChip(idx)`. 펼침=`.grid` 타일, 접힘=`.chip-row` 칩. 정렬(sortMode)은 그룹 없이 평면 유지 → `renderFlatSort()`로 분리(display 토글 grid↔block). `collapsedState{}` 런타임 상태(GROUPS.collapsed에서 초기화). `bindGroupHeads`(헤더 클릭 접기/펼치기), `bindCardDrag`(카드 dragstart + group-drop에 drop→PAGES[i].group 변경).
- **편집창**: URL 아래 `#edGroupInput`(select) 추가 — GROUPS + '기타(미분류)' 옵션. `draftGroup` 추가, openEditor/openNewCard에서 세팅, 적용 시 `PAGES[i].group` 저장(신규는 GROUPS[0] 기본).
- **그룹 관리 모달**(`#groupModal`): 툴바 `#groupToggle`("그룹 관리")로 열림. 그룹별 순서 ▲▼·이름 인라인 수정·기본접힘 체크·삭제(🗑), "+ 그룹 추가". `grpDraft` 복제본으로 편집 후 **적용 시 검증**(빈이름/중복 차단) → 이름변경분 카드 group에 전파(orig→new), 삭제 그룹 카드는 '기타'로, GROUPS·collapsedState 재구성.
- **저장 통합**: `buildPagesCode()` 신설 — PAGES(group 필드 포함) + GROUPS(현재 collapsedState 반영) 두 블록 한 번에 출력. 꾸미기 저장·순서 저장 둘 다 이 함수 사용. ⚠️ 붙여넣을 때 **PAGES와 GROUPS 두 블록 모두 교체** 필요(alert 안내 수정됨).
- **검증**: node --check PASS. Playwright — 그룹 4섹션 렌더/운영 기본접힘→칩2개/헤더클릭 펼침/그룹관리 모달 4행·추가5행·적용/편집창 그룹 select 5옵션·변경반영/꾸미기 드롭영역 4개/buildPagesCode에 GROUPS·group 포함 전부 정상, JS 에러 없음.

### 진행 중 / 주의
- ⚠️ **저장 시 이제 두 블록**: '변경 저장' 코드에 `const PAGES`와 `const GROUPS`가 함께 나옴. GitHub hub.html에서 두 블록 모두 교체해야 함(하나만 바꾸면 불일치). alert 문구에 반영됨.
- 카드→그룹 **드래그**는 데스크톱 마우스 기준. 모바일 터치 드래그는 미검증(터치 환경에선 편집창의 그룹 select로 배정 권장).
- 접힘 상태 저장은 '기본 접힘'(GROUPS.collapsed) 기준. 화면에서 헤더 클릭으로 접었다 편 것도 저장 시 현재 상태로 코드에 반영됨(collapsedState 기준).

### 산출물 (그룹핑 포함 최종)
- `hub.html`: 위 모든 기능 + 그룹핑 전체본(808줄). 기존 구조·auth 게이트 보존, diff 기준 추가·render 재구성만.

---

## 위젯 (네이버 블로그) — 참고 메모
- 여름특강 위젯: link `summer.html`, img `image/summer.png`.
- 수능파이널 위젯: link `suneung_2026.html`, img `image/sf_widget_banner.png`(구 `suneung_final.png`는 영문라벨 "Summer Intensive" 오타 → `sf_widget_banner.png`로 교체, 라벨 "Final Class"). width=170 권장(네 위젯 통일).
- 네이버 위젯 제약: 가로 170px·세로 600px 한계, JS/iframe 불가, `<a><img></a>` 형태만. 이미지 파일명 공백 금지(URL %20 이슈).
