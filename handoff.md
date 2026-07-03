# GREATENG · 여름특강 안내 작업 handoff

> 이 문서는 세션 간 연속성을 위한 인수인계 노트입니다. 통째로 새로 쓰지 말고 **변경분만 누적**하세요.
> '진행 중' 항목은 파일·줄번호·함수명까지 정밀하게 적습니다.

---

## 최종 산출물 (outputs/)

| 파일 | 용도 | 상태 |
|---|---|---|
| `summer.html` | 여름특강 안내 웹페이지 (학부모·신규 대상) + **파비콘 삽입됨** | 배포 대기 |
| `main.html` | 학원 대표 홈 (여름특강 링크 연결) + **파비콘 삽입됨** | 배포 대기 |
| `hub.html` | 관리자 허브 — **✅ 카드편집·그룹·드래그·GAS자동저장 복구본(823줄) + favicon** | **복구완료·배포대기** |
| `favicon.svg` / `favicon.ico` / `favicon-16/32/192/512.png` / `apple-touch-icon.png` | **확정 파비콘 세트** (크림슨 nvw_2: 골드→크림슨→네이비 계단) | **완료** |
| `파비콘_설치안내.txt` | 파비콘 업로드·HTML 삽입·확인 안내 | 완료 |
| `appicon_app_A_네이비` ~ `app_F_크림슨` (.png) | 앱 아이콘 시안 6안 (512px, 세로 중앙정렬) | A·F 채택→다듬기 |
| `appicon_af_A1~A3`, `af_F1~F3` (.png) | A(네이비)·F(크림슨) 다듬기 각 3변형 | A2 채택→색 확장 |
| `appicon_a2_c1~c10` (.png) | A2 색 다양화 10안 (네이비 배경, 3단 각기 다른 색) | c8 채택 |
| `favicon.svg` / `favicon.ico` / `favicon-16/32/192/512.png` | **✅ 에메랄드 파비콘 세트** (에메랄드→골드→크림슨 계단, 투명, 84% 크기) | **완료·덮어쓰기 대기** |
| `apple-touch-icon.png` | **✅ 애플 아이콘 = c8 글로시** (에메랄드·골드·크림슨, 네이비 배경, 유리광택) | **완료·덮어쓰기 대기** |
| `favicon_emerald_source.svg` | 에메랄드 파비콘 원본 SVG | 완료 |
| `appicon_c8_glossy.svg` / `appicon_c8_glossy_final.png` | c8 글로시 원본 SVG·미리보기 | 완료 |
| `앱아이콘_A2색상_10안.png` | A2 색상 10안 비교 | 참고용 |
| `앱아이콘_AF다듬기_비교.png` | AF 다듬기 6안 비교 | 참고용 |
| `앱아이콘_6안_비교.png` | 앱 아이콘 6안 비교 (바탕화면 라운드 적용) | 참고용 |
| `suneung_2026.html` / `pohang_highschools.html` / `parent_guide.html` / `voca.html` | 저장소 최신본에 **파비콘 5줄만 삽입** (그 외 100% 원본 동일, voca 무손상) | 배포 대기 |
| `summer_notice_print.html` | 컬러 A4 가정통신문 (와인&잉크, 웹 인쇄용) | 완료 |
| `summer_notice_bw.docx` | **흑백 A4 가정통신문 (재원생용, 최종)** | 완료 |
| `summer_intensive_2026.html` | 내부 설계 문서 (배포 금지·민감정보 포함) | 참고용 |
| `blog_post_summer.txt` | 네이버 블로그 게시글 (외부 공개용, 가격 제외) | 완료 |
| `favicon_A_대.svg` / `favicon_B_G.svg` / `favicon_C_월계관.svg` | 파비콘 시안 3종 기본형 (와인 #7A0F24 + 골드 #C2A05A) | 구버전 |
| `favicon_고급_A_대.svg` / `favicon_고급_B_G.svg` / `favicon_고급_D_원형.svg` | 파비콘 고급 버전 3종 (금속 골드 그라데이션·광택·비네팅) | 글자형(반려) |
| `favicon_sym1_상승` ~ `favicon_sym5_방패ㄷ` (.svg/.png) | 파비콘 상징형 5안 (광택·비네팅 버전) | 과한마감(반려) |
| `favicon_ap_A_화살크림` ~ `favicon_ap_F_셰브론` (.svg/.png) | 파비콘 애플/크롬 느낌 6안 (사각배경+심볼) | 배경형(반려) |
| `favicon_sh1_원화살` ~ `favicon_sh6_물방울` (.svg/.png) | 파비콘 실루엣형 6안 (형태 자체가 아이콘) | 후보군 |
| `favicon_shd_A_셰브론` ~ `favicon_shd_D_순수` (.svg/.png) | 방패 고급 4안 (기존 심볼군, 전면 재검토로 보류) | 보류 |
| `favicon_st_A_계단` ~ `favicon_st_E_계단상승선` (.svg/.png) | 계단/막대형 5안 (와인 고정) | 후보군 |
| `favicon_lx_navy_stairs` 등 8종 (.svg/.png) | 추상 고급 8안 (색 다양화 + 골드) | 후보군 |
| `favicon_sg_A_명도` ~ `favicon_sg_H_4단` (.svg/.png) | 투명배경 계단+단별 그라데이션 8안 | 후보군 |
| `favicon_nv_1_반전투명` ~ `favicon_nv_4_네이비바탕명도` (.svg/.png) | 네이비-골드 역방향 4안 (nv_1 채택됨) | nv_1 채택 |
| `favicon_nvw_0_원안회갈` ~ `favicon_nvw_3_진골드와인` (.svg/.png) | **nv_1 중간색 변형 4안** (회갈/와인/크림슨/진골드+와인) | **선택 대기** |
| `favicon_중간색변형_비교.png` | nv_1 중간색 변형 비교 (체크무늬=투명) | 참고용 |
| `favicon_네이비역방향_4안_비교.png` | 역방향 4안 비교 (체크무늬=투명) | 참고용 |
| `favicon_계단그라데_8안_비교.png` | 계단 그라데 8안 비교 (체크무늬=투명 확인) | 참고용 |
| `favicon_추상고급_8안_비교.png` | 추상 고급 8안 크기별 비교 | 참고용 |
| `favicon_계단_5안_비교.png` | 계단형 5안 크기별(원본/32/16px) 비교 | 참고용 |
| `favicon_방패고급_4안_비교.png` | 방패 고급 4안 크기별(원본/32/16px) 비교 | 참고용 |
| `favicon_실루엣형_6안_비교.png` | 실루엣형 6안 크기별(원본/32/16px) 비교 | 참고용 |
| `favicon_애플느낌_6안_비교.png` | 애플느낌 6안 크기별(원본/32/16px) 비교 | 참고용 |
| `favicon_상징형_5안_비교.png` | 상징형 5안 크기별(원본/32/16px) 비교 | 참고용 |
| `favicon_고급_3안_비교.png` | 고급 3안 크기별(원본/48/32/16px) 비교 | 참고용 |
| `favicon_3안_비교.png` | 파비콘 3안 크기별(원본/48/32/16px) 비교 이미지 | 참고용 |

---

## 확정 사항 (2026 여름특강)

- **일정: 7/25 · 8/1 · 8/8 (토), 3주 과정 / 변경 가능** ← (월요일 7/27·8/3·8/10에서 토요일로 변경됨)
- 중등 2학기 내신반: 토 오후 1시~3시, 2시간 수업(암기 테스트 포함), 학교별 2학기 내신시험 대비(어법·독해)
- 고등 수능 어법반: 토 오후 3시 30분~6시, 2시간 30분, 수능 빈출 어법 / **예비고1(현 중3) 포함**
- 신청 마감: 7/11(금) 선착순
- 수강료(재원생 기준): 중등 15만 / 고등 22만  · 비재원생가(20만/27만)는 안내문에서 제외, "재원생 기준" 표기만
- 신청 방법(재원생 안내문): **문자 회신만** (자녀 이름·희망 반) — 온라인 신청서·톡톡·링크 제거
- 디자인: C 와인&잉크 팔레트, 애플식 버튼(높이 52px, radius 14px), 흑백 인쇄물은 검정 배경 금지(선·괘선·굵기 강조)

---

## 진행 중 / 미완 항목

0-B. **✅ favicon 작업 7개 파일 소실 정밀 점검 완료 (hub 외 전부 안전)**
   - 방법: 각 파일의 현최신(154072f) 커밋에서 favicon 5줄 제거 → favicon 직전 실작업 커밋과 diff. 일치하면 소실 없음.
   - **voca.html ✅** 안전: 154072f−favicon = 5067933(7/1) 100% 일치. auth게이트·GAS 무손상 (3970→3975줄).
   - **summer.html ✅** 안전: c77308a와 favicon 경로차(상대→절대 `/GREATENG/image/`)만. 여름특강 작업(meta desc·애플버튼) 정상 반영됨.
   - **main.html ✅** 안전: c77308a와 favicon 경로차만.
   - **suneung_2026.html ✅** 안전: 154072f−favicon = 68bb5ddc92(6/30) 일치 (805→810줄).
   - **pohang_highschools.html ✅** 안전: db55e5328d(6/29) 일치 (1354→1359줄).
   - **parent_guide.html ✅** 안전: 32ae514afa(7/1) 일치 (1172→1177줄).
   - **hub.html ⚠️→✅**: 유일한 사고. 232줄로 소실 → 7486533에서 823줄 복구(항목 0-A).
   - **교훈(재발방지)**: 핵심 파일(hub·index·voca·teacher, 특히 GAS 자동저장 붙은 것)은 zip 다운로드본을 최신이라 가정 말고 **커밋 히스토리로 진짜 최신 검증** 후 작업. 파일이 예상보다 짧거나 있어야 할 기능이 없으면 즉시 의심.

0-A. **⚠️→✅ hub.html 카드편집·그룹 기능 소실 사고 → 복구 완료**
   - 사고: favicon 작업 시 받은 저장소 hub.html이 232줄 단순버전(카드편집·그룹·드래그·GAS저장 전부 없음)이었음. 필립의 커스터마이징 작업본이 사라진 상태였음. (원인: favicon 커밋 과정 or 그 이전부터 main에 단순버전이 올라가 있었을 수 있음)
   - **복구**: GitHub 커밋 히스토리(`github.com/greatenglish1201-ux/GREATENG/commits/main/hub.html`)에서 **커밋 7486533** [7/2 02:48 "hub: update PAGES/GROUPS via 허브 저장"] = GAS 자동저장이 커밋한 818줄 완전본 발견. raw(`raw.githubusercontent.com/.../7486533/hub.html`)로 가져옴. 카드편집·그룹관리·드래그(moveCard/bindCardDrag)·GAS저장(SAVE_GAS_URL, SECRET greateng-hub-2026, editSaveGit)·auth게이트 전부 확인.
   - favicon 5줄(`/GREATENG/image/` 절대경로) 삽입 → **823줄 복구본**. favicon 외 원본과 100% 동일(diff), 태그 균형·GAS URL·SECRET·auth 전부 검증. `/mnt/user-data/outputs/hub.html`.
   - **남은 작업(필립)**: GitHub Desktop에서 Pull 먼저 → 이 823줄 hub.html로 교체 커밋. (⚠️ 232줄 버전이 다시 덮지 않도록 주의). 복구 후 GAS 자동저장이 정상 동작하는지 확인.
   - 참고: 관련 GAS = hub 전용 자동저장 프로젝트(`doPost` {secret,pagesBlock,groupsBlock} → 정규식으로 PAGES/GROUPS 2블록 교체 → GitHub API 커밋). CONFIG: SECRET greateng-hub-2026, OWNER greatenglish1201-ux, REPO GREATENG, PATH hub.html, BRANCH main.

0. **파비콘 — ✅ 에메랄드 통일 + 크기 키움 (최신, 이미지 덮어쓰기 대기)**
   - **에메랄드 통일 완료** (`make_favicon_emerald.py` → favicon_emerald.svg): 탭 파비콘도 앱아이콘과 색 통일 → 낮은단 에메랄드 #2E9E7A → 골드 #E6CD86 → 크림슨 #A31F38 (투명배경). 계단 크기 여백40=캔버스 84%로 키움(기존 62%, 즐겨찾기서 작아보이던 문제 해결). 바닥정렬 비율 0.52:0.72:1.0.
   - 세트(favicon_emerald_set→outputs): favicon.svg(투명 에메랄드 큰계단) / favicon.ico(16+32) / favicon-16·32·192·512.png / apple-touch-icon.png(=c8_glossy 에메랄드 글로시 네이비배경 180). **파일명 기존과 동일 → HTML 수정 불필요, image 폴더에 덮어쓰기 커밋만 하면 됨**.
   - 색 순서 주의: 앱아이콘(c8_glossy)·탭파비콘 모두 에메랄드→골드→크림슨으로 통일됨.
   - (이전 크림슨 버전 이력) 골드→크림슨→네이비 3단 계단(nvw_2)이 직전 확정본이었으나, 에메랄드 통일 요청으로 교체.

0-이전. **파비콘 크림슨(nvw_2) 이력 — 에메랄드로 대체됨 (배포·트러블슈팅 기록 보존)**
   - 최종: 투명배경 3단 계단, 골드 #F0DFA8 → 크림슨 #A31F38 → 네이비 #22345C. 세트=favicon.svg/ico/16·32·192·512.png + apple-touch-icon.png(크림배경 #FBF7EF, `make_apple_bg.py`)
   - **⚠️ 파비콘 파일은 저장소 `image/` 폴더에 위치** (루트 아님). 저장소 최신본에서 image/favicon.svg·ico·32·192·512·apple-touch-icon.png 6개 존재 확인.
   - **경로 = 절대경로 `/GREATENG/image/...`** (프로젝트 페이지라 저장소명 GREATENG 포함 필수). 상대경로 `image/...`에서 절대경로로 변경 완료(7개 HTML 각 5경로). 이유: 프로젝트 페이지에서 브라우저가 파비콘을 사이트 루트에서 찾으려다 실패하는 문제 방지.
   - **🔍 진단 결과(중요)**: raw.githubusercontent 확인 → `image/favicon.svg` HTTP 200, 내용 우리 크림슨 계단과 100% 동일. 저장소 배포 HTML(summer 등)에 favicon 5줄 정상 존재(경로 `image/favicon.svg` 상대경로 버전). 파일·HTML 모두 저장소엔 정상.
   - **⚠️ 필립 확인: Pages 주소 favicon.svg → 404 확정**. raw는 5개 파일 모두 200, 폴더명 소문자 `image` 정확. → 저장소 정상, Pages 배포만 문제.
   - **logo.png 테스트 무효**: logo.png는 image 폴더가 아니라 **루트**에 있음(내가 경로 잘못 안내). `image/logo.png`는 원래 없어서 404가 정상. logo.png 정확한 경로는 루트 `/GREATENG/logo.png`.
   - **핵심 발견**: main.html이 예전부터 `image/cert_bachelor.jpg` 등 image 폴더 이미지 참조 중. → **image 폴더의 기존 이미지(cert_bachelor.jpg)가 Pages에서 열리는지가 원인 확정 열쇠**. 필립 확인 요청: (A)`.../GREATENG/image/cert_bachelor.jpg` (B)`.../GREATENG/image/favicon.svg`. A열림+B404=파비콘 커밋만 빌드 미반영 / A·B둘다404=image폴더 통째 Pages 미배포(빌드실패/설정).
   - **✅ 원인 확정: A(cert)=열림, B(favicon)=404 → image 폴더는 Pages 정상, 파비콘 커밋만 Pages 빌드 미반영**. summer.html(루트)도 열림. 즉 저장소·코드·폴더 전부 정상, 순수하게 GitHub Pages 빌드가 파비콘 추가 커밋을 아직 배포 안 한 상태.
   - **해결(필립)**: ①10~30분 대기 후 재시도(빌드 밀림) ②Actions 탭에서 "pages build and deployment" 상태 확인(노랑=진행중 대기 / 빨강=실패 → 재배포 / 초록=완료면 잠시후 재시도) ③급하면 빈 커밋(README 공백 추가 등)이나 Settings→Pages Source None→main 재저장으로 빌드 강제 재실행.
   - 조사 완료: `.nojekyll` 없음, `.gitignore` 없음, `_config.yml` 없음. (Jekyll 기본 빌드 상태. 밑줄 폴더 아니라 image가 Jekyll에 무시될 이유는 표면상 없음 → 빌드 미완/실패 쪽이 유력)
   - **⚠️ 시크릿창에서도 안 뜬다고 함 → 캐시 문제 아님**. Claude 환경은 github.io가 네트워크 allowlist에 없어 Pages 직접 접근 불가(raw.githubusercontent만 가능) → Claude가 대신 Pages 확인 불가, 필립이 직접 확인 필요.
   - 남은 가능성 3개: (1)GitHub Pages 빌드 미반영/실패(Settings→Pages 빌드상태·커밋 체크표시 확인) (2)브라우저가 SVG 파비콘 우선 시도 실패 (3)해당 경로 파일 실제 404.
   - **대응: favicon link 순서를 ico 우선으로 재배치** (SVG 마지막). 순서: shortcut icon(ico) → png32 → png192 → svg → apple-touch. 7개 HTML 전부 적용(절대경로 `/GREATENG/image/` 유지). SVG를 브라우저가 못 받아들이는 경우(가능성2) 대비.
   - **다음 확인 요청**: 주소창에 `https://greatenglish1201-ux.github.io/GREATENG/image/favicon.svg` 직접 입력 → 계단 그림이면 파일정상(순서문제), 404면 Pages/커밋 문제.
   - HTML 삽입 완료: summer/main/hub.html + **suneung_2026·pohang_highschools·parent_guide·voca.html** 전부 `<title>` 바로 뒤 5줄 link 블록(href=`image/...`). 태그 균형 통과. voca.html 포함 favicon 5줄 외 원본과 100% 동일(diff 검증) — auth게이트·GAS백엔드 무손상. 저장소 zip(main, 7/2 재다운로드해 변경없음 확인) 기준 작업.
   - 남은 작업(필립): ① 파비콘 7파일을 저장소 **`image/` 폴더**에 업로드(루트 아님) ② 수정된 7개 HTML(summer·main·hub·suneung_2026·pohang_highschools·parent_guide·voca) 교체 커밋 ③ 파비콘 캐시 강하니 Ctrl+F5/시크릿창 확인
   - (이력) 원본 `logo.png`(260×260, 와인배경+골드 월계관+"대단한영어" 텍스트)는 파비콘 부적합: 16/32px 축소 시 텍스트·문양 뭉개짐 (검증 완료)
   - 파비콘 전용 단순화 3안 제작: A(대) / B(G) / C(월계관+대). 추천 = **A안**(작은 크기 가독성 최상)
   - **고급 버전 추가** (`make_favicons_lux.py` → lux_A/B/D): 금속 골드 그라데이션(하이라이트#F0DFA8→섀도#846127), 상단 광택(sheen), 방사형 와인 배경 + 비네팅, drop-shadow. D안=원형 엠블럼(원본 방패 계승). 색: 와인 #7A0F24, 골드 본색 #C9A85E
   - **글자형(대/G) 반려** → 추상·상징형 5안 제작 (`make_favicons_symbol.py`): sym1(상승/화살촉), sym2(펼친 책), sym3(월계관+체크), sym4(8각 별), sym5(방패+ㄷ 모노그램).
   - **과한 마감 반려** → 애플/크롬 느낌 플랫 6안 (`make_favicons_apple.py`): 광택·비네팅·drop-shadow 제거, 은은한 세로 그라데이션만, 넉넉한 여백, 애플 squircle(rx=114). ap_A/B(상승화살 크림/골드), ap_C(방패+ㄷ 라인), ap_D(5각별), ap_E(원링+대), ap_F(이중 셰브론). 색: 와인 #7A0F24, 골드 #D4B36A, 크림 #F5EEDF.
   - **사각 배경형 반려** → 배경 없는 실루엣형 6안 (`make_favicons_shape.py`): 사각 배경 제거, 형태 자체가 아이콘. sh1(원+화살), sh2(방패 실루엣+ㄷ), sh3(육각+이중셰브론), sh4(화살 실루엣 자체), sh5(원+링+획, 크롬스타일), sh6(물방울/펜촉). 투명 배경, 와인 그라데이션 형태 + 골드 심볼.
   - **방패 방향 채택 + ㄷ 제거 + 고급화** (`make_shield_lux.py` → shd_A~D): 방패 실루엣(SHIELD/SHIELD_IN 이중 경로)에 골드 외곽 + 와인 내부 + 상단 글로우. 내부 심볼: A(이중 셰브론)/B(별)/C(상승화살)/D(순수 테두리만). 색: 와인그라데 #A01E38→#560A1A, 골드그라데 #F0DFA8→#8A6A2E.
     주의: A안 생성 시 첫 path에 오타(`url(#goldv A)`) 있었음 → `sed`로 제거 완료. 재생성 시 스크립트의 A안 첫 줄 확인 필요.
   - **기존 심볼군(방패·화살·별) 전면 재검토** → 모토 "탁월함이 습관이 되도록(Excellence as a Habit)" 기반으로 새 출발. 핵심 해석 = 반복·축적이 쌓여 탁월함에 이름. 계단/막대형 5안 제작 (`make_stairs.py` → st_A~E): st_A(3단 계단), st_B(계단+정점 마름모), st_C(계단 실루엣, 배경없음), st_D(막대 4개 그래프), st_E(계단+상승선+정점 원). 색: 와인 #7A0F24, 골드그라데 #8A6A2E→#F0DFA8.
   - **와인색 고정 해제 + 추상·고급화** (`make_lux_abstract.py` → lx_*): 팔레트 6종(navy #1B2A4A / charcoal #2B2B30 / forest #183A32 / ink #20242C / plum #2E1B3A / black #1A1A1A) 각각 골드/실버 악센트. 모티프 4종: motif_stairs(미니멀 3단), motif_strokes(3획 상승 사선), motif_trajectory(궤적 곡선+정점 원), motif_layers(겹친 삼각 축적). 대표 8조합 생성.
     주의: PAL['ink'] 초기값에 오타("D8B familia") 있었으나 다음 줄에서 재정의로 덮어씀 — 재사용 시 첫 정의 라인 정리 권장.
   - **투명배경 계단+단별 그라데이션 8안** (`make_stairs_grad.py` → sg_A~H): 배경 사각형 제거(형태 자체가 아이콘), 3단 계단(STEPS 좌표: (96,300,108,142)/(202,226,108,216)/(308,138,108,304))에 단별 그라데. sg_A(명도 어두운→밝은골드 #8A6A2E→#EBC96A), sg_B(단별 세로그라데), sg_C(와인#7A0F24→골드 색전이), sg_D(네이비#22345C→골드), sg_E(대각 공유면 그라데), sg_F(불투명도 0.5→1.0 상승), sg_G(얇은 막대+대각), sg_H(4단 명도).
   - **네이비-골드 역방향 4안** (`make_navy_reverse.py` → nv_1~4): sg_D(아래네이비→위골드)의 역. 색순서 반전 2안(nv_1 투명배경 아래골드#F0DFA8→위네이비#22345C, nv_2 대각공유면 골드→네이비) + 배경/전경 반전 2안(nv_3 네이비바탕 squircle+골드계단, nv_4 네이비바탕+골드 명도그라데). 네이비 #22345C, 골드 #CBAA62.
   - **✅ nv_1 채택 → 중간색 nvw_2(크림슨 #A31F38) 최종 확정** (`make_nv1_variants.py` → nvw_0~3 중 nvw_2). 3단 = 골드#F0DFA8 / 크림슨#A31F38 / 네이비#22345C. 이 SVG로 favicon 세트 제작 완료(위 항목 0 참조).
   - 추출 색: 원본 골드 #AE8956, 와인 #66091B → 파비콘엔 밝은 버전 골드 #C2A05A, 와인 #7A0F24 사용
   - 생성 스크립트: `/home/claude/work/make_favicons.py`
   - **다음 단계(선택 후)**: ① favicon.svg + apple-touch-icon(180px PNG) + 32/16px PNG 세트 생성 ② 각 HTML `<head>`에 link 코드 삽입(main·summer·hub 등 통일) ③ GitHub 루트에 아이콘 파일 업로드
   - 삽입할 `<head>` 코드 예시:
     `<link rel="icon" type="image/svg+xml" href="favicon.svg">`
     `<link rel="apple-touch-icon" href="apple-touch-icon.png">`

1. **웹 summer.html ↔ 흑백 DOCX 불일치** (통일 필요)
   - DOCX에는 반영됐으나 summer.html에 **미반영**된 항목:
     - 일정 토요일(7/25·8/1·8/8) — summer.html은 아직 이전 상태일 수 있음 (요일·날짜 확인 필요)
     - 고등반 "예비고1(현 중3) 포함" 대상 — summer.html 고등 카드에 미추가
   - summer.html 파일 위치: 최신 라이브본은 `/home/claude/work/summer_live.html` (사용자 업로드본 기준으로 작업)
   - 관련 줄: 고등반 카드 대상 행, 중등반 카드 일정/회차 행

2. **다른 페이지 네비 "여름특강" 링크 통일 미완**
   - `parent_guide.html`, `suneung_2026.html`, `pohang_highschools.html` — 파일 미확보 상태. 네비에 여름특강 링크 추가 필요.
   - 완료된 것: main.html(네비+본문 카드), summer.html(네비 active)

3. **중1 4개 교과서별 내신 프린트(c안) 제작 대기**
   - 교과서 확정: 이동중=능률(김기택) / 유강중=천재(이상기) / 포여중=동아(윤정미) / 제철중=YBM(박준언), **전원 중1**
   - 2학기 범위 표준 가정: 중간 Lesson 5~6, 기말 7~8 (학교 평가계획 확정 시 조정)
   - 저작권: 교과서 본문은 필립이 제공해야 출제 가능

---

## GA4

- 측정 ID: G-12E7VM1SQ8
- hub.html에 gtag 코드 `<head>` 삽입 완료 (태그 누락 경고 해소)
- 내부 트래픽 IP 필터: 필립이 GA4 설정에서 완료함

---

## 이번 세션 변경 로그

- **✅ 파비콘 에메랄드 통일 + 크기 키움** (`make_favicon_emerald.py` → favicon_emerald.svg): 탭 파비콘을 앱아이콘(c8)과 색 통일 — 에메랄드 #2E9E7A→골드 #E6CD86→크림슨 #A31F38 투명 계단. 크기 여백40=84%(기존 62%, 즐겨찾기서 작던 문제 해결). 세트 재생성(svg/ico/16·32·192·512png) + apple-touch-icon=c8_glossy(180). 파일명 동일해 HTML 수정 불필요, image 덮어쓰기만. 픽셀 검증(색·84%·투명).

- **✅ favicon 7개 파일 소실 정밀 점검 완료**: 각 파일 현최신(154072f)−favicon vs 직전 실작업 커밋 diff 검증. voca(5067933)·suneung(68bb5ddc92)·pohang(db55e5328d)·parent_guide(32ae514afa) 전부 favicon만 추가·소실 없음. summer/main은 favicon 경로차(상대→절대)만. **hub.html만 사고였고 복구 완료**. 결론: 6개 안전, hub 복구.
- **✅ hub.html 복구 (카드편집·그룹·드래그·GAS저장 소실 → 커밋 히스토리에서 되살림)**: 저장소 hub.html이 232줄 단순버전으로 소실된 것 발견 → 커밋 7486533(GAS 자동저장분, 818줄)을 raw로 복구 → favicon 5줄 삽입해 823줄 완성. favicon 외 100% 원본 동일 검증. outputs/hub.html.

- 일정을 월요일(7/27·8/3·8/10) → **토요일(7/25·8/1·8/8)**로 변경 (DOCX 반영 완료, 웹 미반영)
  - `make_docx2.js` L80(상단 일정), L112(중등 시간), L125(고등 시간): "월"→"토" 및 날짜 교체
- 재원생 안내문(DOCX) 수강료 문구: 비재원생 금액 제거 → "※ 위 교육비는 재원생 기준입니다." (`make_docx2.js` L153)
- 고등반 대상에 "예비고1(현 중3) 포함" 추가 (`make_docx2.js` 고등 셀)
- 신청 방법: 문자 회신만 남기고 온라인 신청서·톡톡·링크 제거
- 학부모 확인 요청 문자 3종 작성(간결/인사포함/초간단) — 메시지 도구, 파일 아님
- 김목은 학부모(유강중, 중등 내신반) 답장 2종 작성 — 7/25 결석 시 보강 안내, 메시지 도구
- **네이버 블로그 게시글 작성** (`blog_post_summer.txt`): 외부 공개용 — 가격 제외("상담 문의"), 재원생 문구 제거, 신청은 전화·톡톡·상담링크, 검색 키워드(포항 영어학원 등)·태그 포함, 일정 7/25·8/1·8/8(토) 반영, 고등반 예비고1(현 중3) 포함 반영, 학교명 미노출
- **파비콘 시안 3종 제작** (`make_favicons.py` → favicon_A/B/C): GitHub 저장소 zip 받아 `logo.png` 확인 → 파비콘 부적합 판정(축소 시 뭉개짐) → 전용 단순화 SVG 3안(대/G/월계관+대). 선택 대기 상태.
- **파비콘 고급 버전 제작** (`make_favicons_lux.py` → lux_A/B/D): 금속 골드 그라데이션·상단 광택·비네팅·drop-shadow 적용. A(대)/B(G)/D(원형 엠블럼). 선택 대기.
- **파비콘 상징형 5안 제작** (`make_favicons_symbol.py` → sym1~5): 글자형(대/G) 반려 후 추상 심볼로 전환 — 상승/책/월계관+체크/별/방패+ㄷ. 원본 와인+금속골드 톤 계승. 선택 대기.
- **파비콘 애플/크롬 느낌 6안 제작** (`make_favicons_apple.py` → ap_A~F): 과한 마감 반려 후 플랫·미니멀로 전환 — 광택/비네팅 제거, squircle 배경, 넉넉한 여백. 상승화살(크림/골드)·방패ㄷ·별·원링+대·이중셰브론. 선택 대기.
- **파비콘 실루엣형 6안 제작** (`make_favicons_shape.py` → sh1~6): 사각 배경형 반려 후 "형태 자체가 아이콘"으로 전환 — 사각 배경 제거, 투명+와인그라데이션 실루엣. 원+화살·방패·육각+셰브론·화살실루엣·원+링(크롬스타일)·물방울. 선택 대기.
- **방패 고급 4안 제작** (`make_shield_lux.py` → shd_A~D): 실루엣형 중 방패 채택 → ㄷ 제거 + 고급화(이중테두리·금속골드 그라데·상단 글로우). 내부 심볼 셰브론/별/화살/순수. 보류.
- **계단/막대형 5안 제작** (`make_stairs.py` → st_A~E): 기존 심볼군 전면 재검토, 모토("탁월함이 습관이 되도록") 기반으로 새 출발. 반복·축적→탁월함 서사를 계단·막대로 시각화. 후보군.
- **추상 고급 8안 제작** (`make_lux_abstract.py` → lx_*): 와인색 고정 해제, 팔레트 6종(네이비/블랙/딥그린/차콜/플럼/잉크)×모티프 4종(계단/3획/궤적/레이어)에서 대표 8조합. 후보군.
- **투명배경 계단+단별 그라데이션 8안 제작** (`make_stairs_grad.py` → sg_A~H): 배경 제거 + 계단 형태 자체가 아이콘 + 단별 그라데(명도/색전이/불투명도/대각공유). 후보군.
- **네이비-골드 역방향 4안 제작** (`make_navy_reverse.py` → nv_1~4): sg_D 방향 반전 요청 — 색순서 반전(아래골드→위네이비) 2안 + 배경/전경 반전(네이비바탕+골드계단) 2안. nv_1 채택.
- **nv_1 중간색 변형 4안 제작** (`make_nv1_variants.py` → nvw_0~3): nv_1의 중간 단 색을 회갈(원안)/와인/크림슨/진골드+와인으로. 골드→와인→네이비 조합은 브랜드 와인색을 중간에 계승.
- **✅ 파비콘 최종 확정 = nvw_2 크림슨** (골드#F0DFA8→크림슨#A31F38→네이비#22345C, 투명배경 3단 계단). favicon 세트 제작(svg/ico/16·32·192·512png/apple-touch-icon, `make_apple_bg.py`) + summer/main/hub.html `<title>` 뒤 5줄 link 삽입 완료. 설치 안내 문서(`파비콘_설치안내.txt`) 작성.
- **나머지 4개 페이지 파비콘 삽입 완료**: 저장소 zip(main) 재다운로드→변경없음 확인 후 suneung_2026·pohang_highschools·parent_guide·voca.html의 `<title>` 뒤 5줄 삽입. diff로 favicon 외 무변경 검증(voca 3970→3975줄, 기능 무손상). 남은 건 GitHub 업로드+커밋.
- **파비콘 경로 image/ 폴더로 수정**: 필립이 파비콘을 저장소 `image/` 폴더에 업로드 → 7개 HTML 전부 href를 `favicon.svg`→`image/favicon.svg` 등으로 변경(각 5경로). 설치안내 문서도 image/ 경로+업로드 위치로 갱신.
- **파비콘 안 뜸 → 절대경로로 수정**: 저장소 재확인(image/에 6파일 정상 존재). 원인=프로젝트 페이지 상대경로 문제 추정. 7개 HTML href를 `image/...`→`/GREATENG/image/...` 절대경로로 변경. 진단용 정확 URL = greatenglish1201-ux.github.io/GREATENG/image/favicon.svg. 필립이 이 주소 직접 열어 파일 접근 가능 여부 확인 중(안 열린다 보고 → 주소 오타 or Pages 반영지연 or 커밋 미완 가능성).
- **파비콘 최종 진단**: raw.githubusercontent로 확인 결과 favicon.svg HTTP 200 + 내용 일치, 배포 HTML에 5줄 favicon 정상 포함. **파일·코드 모두 정상 → 원인은 순전히 브라우저/Pages 파비콘 캐시**. 해결=시크릿창 테스트+캐시 비우기+시간 경과. 절대경로 전환은 불필요했으나 outputs엔 절대경로 버전 HTML도 보관(무해).
- **파비콘 시크릿창도 실패 → 캐시 배제**: Claude가 github.io 접근 시 403(네트워크 미허용, 제 쪽 제한). raw는 200. 원인 후보를 빌드 미반영/구버전 HTML/폴더 미반영으로 좁힘. 필립에게 ①favicon.svg 주소 직접 입력 결과(계단 vs 404) ②Settings→Pages 빌드상태 확인 요청. 결과 대기 중.
- **파비콘 Pages 404 확정 → 빌드 문제로 진단**: raw로 image/ 5개 파비콘 전부 200 재확인(폴더명·파일명·대소문자 정상). Pages만 404 → 저장소 정상·Pages 배포 문제. 필립에게 logo.png(기존이미지) Pages 접근 여부 + Settings→Pages(Source/Branch/live주소/빌드실패) 확인 요청. 최유력=Pages 빌드 미완/실패로 파비콘 커밋 미반영.
- **logo.png 경로 오류 정정 + cert 테스트로 재진단**: logo.png는 루트에 있음(image/ 아님) → `image/logo.png` 404는 정상, 테스트 무효. main.html이 예전부터 `image/cert_*.jpg` 참조 확인 → 기존 image 이미지 cert_bachelor.jpg의 Pages 접근 여부로 재확정 요청. .nojekyll/.gitignore/_config.yml 모두 없음 확인(빌드 미완/실패 유력). A(cert)열림+B(favicon)404=파비콘커밋 미반영, 둘다404=image폴더 통째 미배포.
- **✅ 파비콘 원인 최종 확정**: 필립 확인 A(cert_bachelor.jpg)=열림, B(favicon.svg)=404. → image 폴더·코드·저장소 전부 정상, **파비콘 추가 커밋이 GitHub Pages에 아직 빌드·배포 안 된 것**. 해결=대기/Actions 빌드상태 확인/빈 커밋으로 재배포. 코드 수정 불필요(이미 완료). 필립 액션만 남음.
- **✅ 파비콘 배포 문제 해결됨**: Settings→Pages "Last deployed 8 hours ago"로 배포 멈춰있던 것 확인 → Branch None↔main 재저장(또는 재배포)으로 강제 재배포 → 파비콘 정상 표시. 바탕화면 앱아이콘도 "앱으로 설치"로 크롬 배지 없이 적용 완료. (Pages 설정: Source=Deploy from a branch, main /(root), live at greatenglish1201-ux.github.io/GREATENG/)
- **앱 아이콘 시안 6안 제작** (`make_appicon.py` → app_A~F): 기존 apple-touch(크림배경 180)가 흐리고 정사각 배경 언밸런스 지적 → 512px 재설계, 계단 중앙정렬 여백균등. A(네이비단색), B(네이비그라데), C(크림), D(흰), E(네이비 꽉찬계단), F(크림슨배경). 네이비 배경일 땐 3단 중 최상단을 밝은골드로(네이비끼리 안 겹치게). 선택 대기.
- **앱 아이콘 계단 세로 중앙정렬 수정**: 아래로 쏠림 지적(위여백156/아래74) → `make_appicon.py` cy_shift 6→-35 (A~D,F), E안 꽉찬계단 좌표 y-23 반영. 결과 위/아래 여백 115/115 균등(픽셀 검증). 6안 전부 재생성.
- **A(네이비)·F(크림슨) 다듬기 각 3변형** (`make_af_refine.py` → af_A1~A3, af_F1~F3): 금속골드 그라데(mg그라디언트 #B89043→#F4E4B0), 배경 그라데+상단 글로우 추가. A1(골드3단)/A2(골드·크림슨·골드=크림슨포인트)/A3(골드+drop-shadow입체), F1(골드·네이비·크림)/F2(금속골드3단)/F3(네이비·골드·크림). STEPS 좌표=세로중앙 (102,265,96,132)/(206,197,96,200)/(310,115,96,282). 추천 A2/F2.
- **A2 색 다양화 10안** (`make_a2_colors.py` → a2_c1~c10): A2가 양끝 다 골드라 뻔하다는 지적 → 3단 각기 다른 색. c1(크림슨·골드·아이스)/c2(틸·골드·크림)/c3(크림슨·골드·에메랄드)/c4(코퍼·골드·아이스)/c5(버건디·크림슨·골드)/c6(틸·골드·크림슨=보색)/c7(스카이·골드·크림슨)/c8(에메랄드·골드·크림슨)/c9(로즈·골드·아이스)/c10(앰버·크림슨·아이스). 네이비 배경 공통. 추천 c6/c5/c8.
- **✅ 앱 아이콘 최종 확정 = c8 에메랄드·골드·크림슨 + 글로시** (`make_c8_glossy.py` → c8_glossy.svg): 각 막대 세로 그라데(하이라이트→base→deep) + 상단 유리 하이라이트(glassTop, 위 42%) + drop-shadow 입체. 색: 에메랄드 #2E9E7A/골드 #E6CD86/크림슨 #A31F38, 네이비배경 그라데 #3A5488→#16233F. 픽셀 검증(막대 상단 밝음/하단 진함 확인). 앱아이콘 세트 생성: apple-touch-icon.png(180)·favicon-192.png·favicon-512.png. **탭 파비콘(favicon.svg/32/ico)은 크림슨 계단 투명 유지, 앱아이콘만 이 글로시로 교체 방향**(통일 원하면 favicon.svg도 교체 가능 — 필립 확인 대기).

---

## 주의 (안전 규칙)

- **GAS 작업 시**: 전체 백업 → 전체 파일 교체(부분 붙여넣기 금지) → '새 버전으로 배포' → 어느 GAS인지 확인
- **passages.js / teacher.html**: 기존 필드 제거·필드명 변경 금지, 전체 재작성 시 기존 파일 diff 기준
- **민감정보**: 재적 인원·귀국학생·폐강·학교명 등 공개/학부모 자료에 절대 노출 금지
