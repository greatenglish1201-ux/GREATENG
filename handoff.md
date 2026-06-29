# GREATENG 작업 핸드오프
> 새 대화 시작 시 이 파일 링크를 Claude에게 주면 맥락이 복원됩니다.
> 마지막 갱신: 2026-06-29

## 0. 기본 정보
- 저장소: greatenglish1201-ux/GREATENG (GitHub Pages 배포)
- 배포 주소: greatenglish1201-ux.github.io/GREATENG/
- GA4 측정 ID: G-12E7VM1SQ8
- 이미지 폴더: /image/
- 브랜드 컬러: 와인 #7a1020, 골드 #C9A84C, 잉크 #3a2a20 / Pretendard 폰트
- 표준 팔레트(클래스 안내): C · 와인 & 잉크
- 위젯/썸네일 폰트: 한글 본카피=나눔명조 ExtraBold(800), 영문 태그라인=Lora Italic(500), 버튼=나눔고딕 Bold(700)

## 1. 지금 진행 중인 작업 ⬅️ 가장 중요
- **일반 상담신청서(apply.html) — GAS 미연결 상태. 배포 후 URL 연결 필요.**
  - apply.html 폼·검증·완료화면 완성. 5개 페이지(main·parent_guide·pohang_highschools·summer·suneung_2026)에 '일반 상담 신청' 버튼 8군데 연결 완료.
  - **남은 일 2가지**: ① consult_gas.gs를 받을 시트(151kfuk4...G18s)의 Apps Script에 붙여넣고 CONFIG.NOTIFY_EMAIL 교체 → 웹앱 배포(모든 사용자 액세스) → URL 복사. ② apply.html L약 320 `const GAS_URL = 'PASTE_...'` 한 줄을 그 URL로 교체. 이 둘 끝나면 작동.
  - ⚠️ consult_gas는 기존 고위험 3종과 **완전 분리된 새 GAS**라 기존 건 안 건드림(안전). 단 배포 절차(새 버전 배포)는 동일 준수.
  - **미정**: NOTIFY_EMAIL(알림 받을 주소) 아직 안 정해짐 → 필립 확인 필요.
- **관리자 페이지 보안 — 2단계(GAS 토큰) 남음. ⚠️ 시험기간이라 보류 중.**
  - 1단계(프론트 공통 게이트) = **완료**(아래 5번). 화면 차단까지 적용됨.
  - 2단계(남은 일): hw-monitor 등의 GAS doGet에 토큰 검사 추가 → "URL 알아도 데이터 못 받게". 1단계는 화면만 가리고 GAS는 여전히 무토큰 응답하므로 이게 진짜 방어선.
  - 구현 방향: auth.js 인증 통과 시 토큰 발급 → 관리 페이지의 모든 jsonp('type=admin...') 호출에 &token= 부착 → GAS doGet 첫 줄에서 토큰 일치 검사, 불일치 시 거부.
  - ⚠️ GAS 작업 철칙(3번) 반드시 준수. **시험 끝난 뒤 별도 세션**에서 진행. 대상 GAS = hw-monitor(우선), 그다음 voca/index 검토.
- ※ 새 작업 시작 시 이 칸에 파일/무엇을/어디까지/다음 할 일을 줄번호·함수명까지 정밀하게 기록

## 2. 보류 / 미적용 (적용 시 주의)
- index.html 대량 학생등록 / 일괄 날짜 기능: 빌드됐으나 미적용. 적용 시 그 시점 최신 index.html에서 처음부터 재구현(이전 버전 재사용 금지)
- **관리자 게이트 2단계(GAS 토큰): 위 1번 참조. 시험기간 종료 후 적용.**

## 3. GAS 상태 ⚠️ 고위험
- 대상 GAS 3종: 단어시험(voca) / 숙제점검(hw-monitor) / index 로그인
- 최근 완성본: Code.gs 759줄 (node --check 통과, route 28개 확인)
- 과거 사고: doGet 없는 부분 스니펫을 붙여넣어 로그인 전체 다운된 적 있음
- 철칙: ①기존 코드 먼저 백업 ②부분 스니펫 절대 금지(전체 파일 교체) ③저장 후 반드시 '새 버전'으로 배포 ④작업 전 어느 GAS인지 확인
- **예정: 보안 2단계에서 hw-monitor GAS doGet에 token 검사 추가 (위 1번)**

## 4. 다음 사이클 예정 작업
- **보안 2단계(GAS 토큰) — 시험 종료 직후 1순위.** 데이터의 진짜 빗장(파일 숨겨도 GAS가 무토큰이면 데이터 샘).
- **공개/관리 파일 분리 — 보안 2단계 다음 정리 작업.** 현재 한 저장소·한 폴더에 섞여 hub 하나로 다 노출되는 게 문제의 뿌리.
  - 공개 저장소(현 public): 학생/학부모용만 → index, voca, main, parent_guide, summer, suneung_2026, pohang_highschools
  - 관리용 → 분리 대상: hub, teacher, hw-monitor, exam-analysis, greateng_thumbnail_pro2_2
  - 방식 갈래: (A) **private 저장소로 관리용 이전** = 소스/파일목록 비공개로 가장 강력. 단 무료플랜은 Pages 비공개배포 불가 → 배포 페이지는 URL 알면 열림. 진짜 비공개 배포 원하면 GitHub Pro/Team 등 유료 검토. 무료로 가면 'private 저장소 + auth.js 게이트 + GAS 토큰' 조합이 현실적. (B) **/admin/ 하위폴더로 정리** = 관리·정리·robots/게이트 일괄적용엔 편하나 public인 한 소스 노출 그대로(보안 효과 작음).
  - 권장 순서: ①GAS 토큰 → ②관리 파일 private 분리(배포 비공개 필요 시 유료 검토) → ③auth.js는 보조 게이트로 유지. 결과: '공개=학생용만 / 관리=숨김+토큰+게이트' 3중.
- 보카 DB ↔ 지문 DB 교재명 통일 (현재 불일치: 지문 27ST_E_test2,3 ↔ 보카 '테스트편 1,2,3'; 절대유형 16강 보카 DB 누락; 영독 Mini Test 혼재). 보카 DB를 지문 DB 명명 규칙에 맞추는 방향
- 여름 특강 3개 반(중1-2 / 중3-고1 / 고3 주말 잠정) 커리큘럼·교재 확정

## 5. 최근 완료 (참고용)
- **제철중3 기말 예상문제 → JSON 신규 생성 (jechuljung3_2026_1f_exam.json) (2026-06-29)**
  - 검수 통과한 PDF 26문항을 제철고 JSON과 동일 평면스키마(key/meta/questions, 문항=type:single + qtype/score/question/choices/answer/explanation/source/_orig/_origtype/_src)로 작성.
  - **파일명 학교급 분리**: 레포 기존 `exams/jechul3_2026_1f_exam.json`은 이름과 달리 **제철고3 영어II 30문항**이 들어있어 혼선. 그래서 중3은 `jechuljung3_2026_1f_exam.json`으로 명명(고3은 향후 jechulgo3 권장).
  - meta.key=제철중_3학년_2026_1학기_기말 / school=제철중 / subject=영어 / publisher=비상(김진완) / scope=L3 The Secret of My Father·L4 The Junk Orchestra.
  - **밑줄형 `<u>` 태그 적용**(복제프로그램 밑줄 렌더링용): 어법 밑줄형 Q1·3·5·7과 개수형 Q2·4·6·8, 어휘 Q9·Q15 = 각 5개씩 정확 삽입 확인.
  - **PDF 대비 다듬기 1건 반영**: Q7 본문 "inspire people by recycled music" → "through recycled music"(자연스러움, 정답 ④that→it·밑줄 무관).
  - 자동검수: 26문항·100점·정답분포 ①6②6③6④4⑤4·유형분포 메타=실제 일치, HIGH 0건. MED 6건(Q2·4·6·8·22·25)은 정답이 '개수형(n개)/기호형(ⓔ·ⓒ)'이라 해설에 동그라미기호가 없을 뿐 정답-해설 정합 정상(검수기 오탐). JSON 유효성 통과.
  - 산출: `/mnt/user-data/outputs/jechuljung3_2026_1f_exam.json`. 빌더 build_jc3.py/build_jc3_part2.py/assemble.py(재실행 동일 산출).
  - ⚠️ 레포 반영 시: outputs 파일을 GitHub Desktop으로 `exams/`에 추가(기존 제철고3 파일 덮어쓰기 금지 — 파일명 다르므로 충돌 없음).
- **제철중3 기말 예상문제 PDF(26문항) 전수 검수 — 실오류 0건 (2026-06-29)**
  - 입력=완성 시험지 PDF(`포항제철중학교_중3_기말고사_영어_예상문제.pdf`, 문제 4p + 정답해설 2p). 레포엔 JSON 산출물 없음(outputs 전용).
  - 자동집계: 26문항·100점·정답분포 ①6②6③6④4⑤4 (handoff 기존 기록과 일치).
  - **어법 8문항**(L3 명사절if/과거완료, L4 분사후치/가목적어it~to) 핵심4포인트 충실. 개수형(Q2③·Q4④·Q6④·Q8③) 올바른선지 개수 일일이 대조 → 전부 정답 유일.
  - **내용일치**(Q16①·Q18①불일치, Q17②·Q19⑤일치) 사실관계 전수 확인: Q18=플루트 설명을 바이올린에 갖다붙인 함정, Q19=연도1995→2005·악기제작자 Gómez·Lucy White 인터뷰어 등 미세변형 함정 정확. **복수정답 없음.**
  - **교차 답노출 점검**: 독립운동 진실은 Q17 단독 유지, Q24 제목정답④는 "숨겨진 진실"로 추상화(독립운동 직접노출 회피). handoff 'Q17 단독' 원칙 지켜짐 ✓.
  - 대화(Q20②·Q21②·Q22⑤어색)·독해(Q23①·Q24④·Q26②)·영작배열(Q25③, 4번째=ⓒ an arrangement) 전부 정답 유일.
  - **다듬기 권장 1건(오답 아님)**: Q7 본문 "inspire people **by** recycled music" → through/with가 자연스러움. 밑줄(②it)·정답(④that→it)과 무관.
  - **미확인(다음 권장)**: 어법 밑줄형 Q1·3·5·7, 어휘 Q15의 `<u>단어</u>` 태그 정합은 PDF만으론 미검증 → JSON 원본 주면 apply_underline 태그까지 확인 가능.
  - 산출: `/mnt/user-data/outputs/제철중3_기말_검수보고서.md` (문항별 판정·근거). 시험지 자체는 수정 불필요(이상 없음).
- **기출 검수: jechul3_2026_1f_exam.json — 해설 정답기호 불일치 3건 수정 (2026-06-29)**
  - 레포(raw)에서 handoff.md + exam_authoring_universal_handoff.md 먼저 읽음. 검수 대상 JSON은 레포 미존재(outputs 전용 워크플로) → 사용자 업로드본으로 검수.
  - ⚠️ **파일명 vs 내용 불일치 주의**: 파일명은 jechul3(제철중3 뉘앙스)이나 **meta는 제철고 3학년·영어II·기말 30문항**(meta.key=제철고_3학년_2026_1학기_기말). 제철중3 26문항과 별개 시험. 산출 파일명은 업로드 원본명 유지.
  - 기계 전수검수(gate_check.py): 선지5개·기호순서·정답기호유효·배점합(=100)·정답분포(meta=실제 ①6②6③6④6⑤6)·qtype분포(meta=실제 10유형) **전부 일치, HIGH 0건**.
  - **수정한 실오류(MED→0)**: 해설 끝 동그라미번호가 answer와 어긋난 3건. **해설 설명 내용 자체는 정답 선지를 정확히 가리키고 번호만 틀린 안전 케이스**라 번호만 교체.
    - Q1(제목, 정답③): 해설 "①이 제목으로 적절"→"③이 제목으로 적절".
    - Q4(함축, 정답①): 해설 "②를 의미한다"→"①을 의미한다".
    - Q16(추론, 정답③): 해설 "①을 추론할 수 있다"→"③을 추론할 수 있다".
  - 남은 LOW 30건 = 전 문항 `_review` 카드 부재(검수자 편의 메타, 정답 정합성과 무관). 검토탭 빠른검수 원하면 13번 _review 스키마대로 후속 작성 필요.
  - 산출: `/mnt/user-data/outputs/jechul3_2026_1f_exam.json` (json.tool 유효성 통과). 평면스키마(key/meta/questions) 유지, 해설 외 필드·구조 무변경. 작업스크립트 gate_check.py/fix.py(재실행 동일 산출).
- **exam-analysis.html: 검수 승인 상태 유지(파일 업데이트해도 안 풀림) (2026-06-29)**
  - 문제: 파일 업데이트/재불러오기 때마다 검수 문항이 바뀜(승인 표시 초기화). 원인=`_rvApprovedKey()`가 examMeta.key에 의존했는데 이 값이 불러올 때마다 달라지거나 비어서 localStorage 'ea_approved_{key}' 매칭 실패.
  - 해결: key를 **시험 내용 기반 안정값**으로 변경. [school,grade,year,semester,exam] 조합(sig)을 우선 사용 → 같은 시험이면 examMeta.key가 달라도 항상 동일 key. fallback: sig 없으면 examMeta.key, 그것도 없으면 'q'+첫문항번호. 특수문자 정규화.
  - 시뮬 검증: 같은 제철고 기말을 key 다른 두 버전으로 불러와도 동일 key(승인 유지). 제철중과는 구분(충돌 없음).
  - 동일 파일 누적(앞 작업들 + 이번). JS 문법 통과. buildOutput·GAS·passages.js 미변경.
- **exam-analysis.html: 정답분포 자동 보정 (방법2, AI 미사용) (2026-06-29)**
  - 문제: 게이트가 '정답분포 불균등'을 감지만 하고 못 고침 → 수동으로 선지·해설 번호 일일이 수정해야 함. AI 재생성 쓰면 검토 때 중복 호출 비효율.
  - 해결: `rvBalanceAnswers()` + `_balSwapQ(q,ai,bi)`. AI 없이 순수 코드로 동그라미숫자(①~⑤)만 매핑 swap. 과다번호→과소번호로 한 문항씩 이동하며 분포를 n/5로 맞춤. swap 시 (1)선지 내용 위치교환+기호 재부여 (2)정답기호 (3)지문 밑줄기호(밑줄형, ①~⑤ 4개↑ 있으면) (4)해설 동그라미숫자를 임시토큰(\u0001) 거쳐 안전 교환. **사후 정합검사**(선지5개·기호순서·정답기호 존재·해설에 정답기호 언급·지문밑줄 유지) 실패 시 그 문항 원본 복원하고 skipped에 기록 → alert로 '수동 확인 필요' 안내.
  - 핵심 안전장치: 해설에 정답·오답 번호가 섞여 자동교환이 위험한 문항은 사후검사로 걸러 제외(사용자 우려 반영). _flat은 원본객체 참조 유지 → q 직접수정이 generatedQs에 반영됨. 보정 후 renderReview()+runExamAudit() 재실행.
  - 시뮬레이션 검증: 내용일치 ①→③, 어법 밑줄형 ④→② 모두 선지·정답·지문기호·해설번호 정확히 이동 확인.
  - 미해결(다음 개선 후보): swap 후 해설 오답나열이 '②①④⑤'처럼 순서 뒤섞여 보일 수 있음(번호-내용 정합은 맞음). 가독성 위해 해당문항 '해설순서 확인' 표시 검토.
  - 게이트 패널에 '⚖ 정답분포 자동 보정 실행' 버튼(불균등 시만 노출). JS 문법 통과. buildOutput·GAS·passages.js 미변경.
- **exam-analysis.html 검토탭: 노안 대응 글씨 확대 (2026-06-29)**
  - 검토 탭 글씨가 .8~.9rem이라 작다는 요청. CSS 추가로 확대: .rv-card 1.06rem, .rv-bd(지문) 1.12rem, .rv-ch(선지) 1.08rem, .rv-stem 1.1rem, .rv-detail/.rv-kv 1.02rem, .rv-exp 1.04rem, .rv-orig 1.02rem, .rv-chk 1.0rem, .rv-editm textarea 1.04rem 등. (.rv-src 정의 직후에 블록 추가)
  - 참고(버그 아님): 검수 문항이 '사라지는' 현상 = 검수권장(👁) 문항을 '그래도 통과'로 승인하면 숨겨지는 정상 동작. 반려(⛔)는 cardHtml(r,false,false)로 절대 안 숨김. 승인 되돌리기는 상단 바 '전체 되돌리기'(rvUnapproveAll). 18번 반려는 제목 정답이 본문어휘 67% 복붙이라 정당한 반려(paraphrase 필요).
  - 동일 파일 누적(앞 4개 + 글씨확대). JS 문법 통과. buildOutput·GAS·passages.js 미변경.
- **exam-analysis.html 검토탭: '원문으로 다시 출제' 기능 (2026-06-29)**
  - 요청: 오류 반려만 내지 말고, 검수 패널 오른쪽 '원문 전체'(q._orig)를 가져다 다시 출제하는 길을 열 것.
  - 구현: (1) 검수 카드 우측 '원문 전체' details에 `📝 이 원문으로 다시 출제` 버튼 추가(details open으로 펼침). (2) `rvReauthorFromOrig(num)` 함수: 편집모드(.rv-view→.rv-editm) 자동 열기 → q._orig를 .rf-body 지문칸에 주입 → 빈칸추론이면 현재 정답선지 텍스트가 원문에 그대로 있으면 그 자리를 ______로 자동 치환(없으면 사용자가 직접 빈칸 지정하도록 안내) → AI 박스 열고 rvAISuggest(num,qtype) 호출로 출제 흐름 연결. (3) 빈칸추론이면 앞서 만든 '원문 자리 수동지정'(드래그→rvManualKeep)·해설 자동재생성과 그대로 연결됨.
  - 연결 확인: 카드 id=rvq{n} == .rv-card[data-num={n}] 동일 요소라 rvAISuggest의 .rf-body 읽기가 주입된 지문과 일치.
  - 이번까지 동일 파일 4개 작업 누적(해설 자동재생성 / 원문 빈칸자리 수동지정 / 빈칸 원문복원형 검수강등 / 원문으로 다시출제). JS 문법 통과. buildOutput·GAS·passages.js 미변경.
- **exam-analysis.html 검토탭: 빈칸추론 '원문 복원형 아님' 반려→검수권장 강등 (2026-06-29)**
  - 배경: 빈칸추론 검증(라인~2803)이 정답 선지가 원문(_orig)에 글자 그대로 있는지 단순 문자열 대조 → 없으면 '정답이 원문 복원형 아님' 플래그. 이건 우리가 추가한 '원문 대조 검수'가 아니라 빈칸 유형에 원래 있던 규칙. 문제는 빈칸추론 정답은 paraphrase가 정상인데 이 플래그가 autoflags(반려⛔)로 들어가 정상 문항이 막힘(예: 식물·인간 면역 지문 8번, 정답 'nurtures beneficial microbes that suppress pathogens'는 글 결론을 정확히 요약했으나 반려됨).
  - 해결(전자안 채택): _rvTriage에 SOFT_FLAGS=['정답이 원문 복원형 아님'] 도입. verify.flags 중 SOFT_FLAGS는 autoflags(반려) 대신 reasons(검수권장👁)로 라우팅 {tag:'원문 변형'} 객체로 push. 나머지 flags는 기존대로 반려. '오답이 원문에 존재'(복수정답)·'해설 정답기호 불일치'는 반려 유지 → 시뮬레이션으로 확인(원문복원만=review, +복수정답/해설불일치=reject).
  - 검증 표시(rows)도 빈칸추론 'present=false'를 빨강 '✗ 원문에 없음'→황색 '↺ paraphrase(원문 변형) — 빈칸추론에선 정상'으로 중립화.
  - 주의: reasons 배열은 {tag,q} 객체 형식(라인2961 rr.tag/rr.q 렌더링). 문자열로 push하면 깨짐 — 반드시 객체로.
  - 앞선 두 작업(해설 자동재생성, 원문 빈칸자리 수동지정)과 동일 파일 누적. JS 문법 통과. buildOutput·저장 미변경.
- **exam-analysis.html 검토탭: 빈칸추론 원문 자리 수동 지정 기능 (2026-06-29)**
  - 문제: 빈칸추론 문항에서 출제본 지문의 빈칸 앞뒤 단어가 원문(_orig)과 달라 `_rvBlankOriginal` 자동 탐지가 실패하면, ①번(원문 그대로 정답) 방식이 아예 막히고 ②번(변형)만 강제됨. 사용자는 원문 그대로 정답을 넣고 싶은데 불가.
  - 해결: 자동 탐지 실패 시에도 _orig가 있으면 **원문 전체를 보여주고 빈칸 칠 구절을 직접 지정**하게 함. (1) rvAISuggest의 방식선택 UI에서 bo.ok=false일 때 원문 div(#rvorig{num}) + 입력칸(#rvman{num}) + '① 원문 그대로 적용' 버튼 표시. (2) document mouseup 핸들러: #rvorig 영역에서 드래그 선택하면 #rvman 입력칸에 자동 반영. (3) `rvManualKeep(num)`: 선택/입력 구절을 window['_manualAns'+num]에 저장하고 keep 모드로 rvAISuggest 재호출. (4) keep 모드 생성부에서 _manualAns가 있으면 자동탐지(bo.text) 대신 그 값을 정답①로 주입. (5) rvAIBlankReset에서 _manualAns도 초기화.
  - 직전 작업(선지 변경 시 해설 자동 재생성)과 함께 동일 파일에 누적. JS 문법검증 통과. buildOutput·저장 미변경.
  - 작업파일: /home/claude/dongjigo/exam_work.html → outputs/exam-analysis.html.
- **exam-analysis.html 검토탭: 선지 변경 시 해설 자동 재생성 (2026-06-29)**
  - 문제: AI로 선지를 새로 만들면(rvApplyChoices/rvApplyWrongOnly) 선지·정답은 ①로 바뀌는데 **해설은 이전 버전 그대로** 남아, 검수기가 '해설 정답기호 불일치'로 자동 반려(예: 정답①인데 해설엔 '③이 정답'). 기존 코드는 "해설을 직접 수정하세요" 경고만 띄움.
  - 해결(확실한 방법): 선지 적용 직후 **`_rvRegenExplanation(num)` 호출로 해설을 AI 자동 재생성**. 새 프롬프트 `_explPrompt(body,choices,ansSym)`가 현재 지문·선지5개·정답기호를 넘겨 → 정답기호 명시 + 정답 근거 + 오답4개 사유(현재 선지순서 기준)를 한국어 해설로 생성. 모델 claude-sonnet-4-6 재사용.
  - 안전장치: 재생성 전 기존 해설 백업(exp.dataset.prevExp) + "↺ 이전 해설로" 버튼(`_rvUndoExpl`). API키 없거나 실패 시 기존 해설 보존하고 안내만.
  - 변경 위치: rvApplyChoices(라인~1826)·rvApplyWrongOnly(~1795)의 수동경고 블록을 _rvRegenExplanation 호출로 교체. _explPrompt는 _blankPrompt 직후, _rvRegenExplanation/_rvUndoExpl는 rvPickChoice 직후 추가. buildOutput·저장·기타 필드 미변경. JS 문법검증 통과.
  - 작업파일: /home/claude/dongjigo/exam_work.html → outputs/exam-analysis.html. 원본(업로드) 기준 diff로만 작업함.
- **제철중 중3 2026 1학기 기말 예상문제 — 밑줄태그+난이도상향+킬러3 (2026-06-26)**
  - **밑줄 <u> 태그 추가**: 복제프로그램이 시험지 렌더링 시 밑줄 표시하려면 ①기호만으론 안 되고 <u>단어</u> 태그 필요(시트 중간패턴 _orig가 <u>allow</u> 방식). build_exam.py에 apply_underline() 후처리 추가 — 밑줄형(Q1·3·5·7 어법, Q15 어휘)의 지문 ①단어→①<u>단어</u> 자동 적용. Q9(킬러)는 영영풀이라 본문인용 단어에 직접 <u> 부여.
  - **킬러 3문항 교체**(쉬워 보이나 실수 유발, 기존 평이 3개와 교체, 26문항 유지): Q9 어휘(다의어 본문적용 영영풀이, 정답③ devote), Q10 어휘(led/treasure/recycled/inspiring 짝맞추기, inspiring vs inspired 어형함정, 정답①), Q19 내용일치(연도1995↔2005·주체 Chávez↔Gómez·역할 Lucy White 미세변형, 정답⑤). 셋 다 정답 유일성 정밀검수 완료.
  - **난이도 상향**: Q14(분사·수동태 어형 made/formed 함정), Q26(빈칸추론 종합형: 빈칸앞 문장만 보면 오답 매력적). 배점 킬러2개(Q10·Q19)+Q8+Q25=5점.
  - 어법 8문항은 직전 세션의 핵심4포인트(명사절if·과거완료·분사후치·가목적어 it~to) 유지. 최종 전수검수 통과: 밑줄태그·정답유일·핵심포인트·해설일치·독립운동 Q17단독 OK. 정답분포 ①6②6③6④4⑤4, 100점.
  - ⭐⭐**어법 8문항 전면 재출제**: 기존 어법이 교과서 핵심 포인트와 불일치(임의로 시제일치·사역·would습관·도치·as long as·so~that 사용)했음. 시트 dialog_text의 '언어형식'에 명시된 **핵심 4개 포인트로만** 재출제 — L3:명사절 접속사 if/과거완료, L4:분사 후치수식/가목적어 it~진목적어 to부정사. **각 포인트 2문항씩(밑줄형1+개수형1) = 8문항**, 함정도 해당 포인트 자체로만 구성.
  - ⚠️교훈: 내신 어법은 교과서가 콕 집은 '언어형식'에서만 출제. 다음 출제 때도 시트 dialog_text의 ■언어형식 항목을 먼저 확인하고 그 포인트로만 어법 낼 것.
  - ⭐고등수준 전수검수에서 잡은 오류(앞 세션): Q3 선택지-지문 밑줄기호 어긋남(relocate 부작용), Q1·Q6·Q11 독립운동 문장이 Q17과 답노출, relocate가 해설번호 미수정→정답-해설 불일치. **relocate 함수 제거**하고 각 문항 정답위치 직접작성으로 전환.
  - 최종 자동검수 통과: 어법 8문항 모두 핵심4포인트, 선택지5·기호순서·어법밑줄정합·정답해설일치·독립운동문장 Q17단독 전부 OK. 정답분포 ①5②6③6④5⑤4, 배점 5×4·4×14·3×8=100. 빌더=build_exam.py(grammar8.py=어법블록).
  - ⭐검수에서 잡은 오류(고등 수준 재검수): ①Q3 선택지-지문 밑줄기호 어긋남(relocate 부작용) ②Q1·Q6 본문5 독립운동 문장이 Q17과 중복돼 답노출 ③relocate 함수가 해설 번호 미수정→Q16/20/23 정답-해설 불일치 ④Q11에 independence fighters 노출(Q17 단서). → 전부 수정. **relocate(정답위치 자동이동) 함수는 지문 밑줄·해설 번호를 안 고쳐서 제거**하고 각 문항을 정답위치에 직접 작성하는 방식으로 전환.
  - 최종 자동검수 통과: 선택지5개·기호순서·어법밑줄정합·정답해설일치·독립운동문장 Q17단독 전부 OK. 정답분포 ①5②6③4④6⑤5, 배점 5×4·4×14·3×8=100.
  - 산출물: `jechul3_final_exam.json` (outputs). 스키마=제철고 기말 JSON과 동일 평면구조(key/meta/questions, 각 문항 type:single + qtype/score/question/choices/answer/explanation/source).
  - 범위: 비상(김진완) Lesson 3 The Secret of My Father / Lesson 4 The Junk Orchestra. 본문·대화문은 통합분석어시스트 시트 '중등지문'(중3 비상 김진완 행 2개)에서 로드. ⚠️ 시트엔 이번에 처음 저장됨(이전 세션은 채팅 붙여넣기였음).
  - 구성: 26문항/100점, 중간 기출패턴 그대로 = 어법8·어휘7·내용일치4·대화완성3·주제요지2·영작1·빈칸추론1. 배점 5점×4(Q6,7,8,25)·4점×14·3점×8. 정답분포 ①4②4③6④6⑤6.
  - **요청 핵심 2가지 반영**: ①지문 중복 답노출 제거 — Q17(내용일치)·Q24(제목)·Q25(영작)이 본문5 동일문장 공유해 서로 답 노출하던 것 분리(Q24=본문2·5 정서반전 중심으로 재작성·독립운동 직접문장 삭제, Q25=본문3 과거완료 arrangement 영작으로 이동). ②어법 8문항 고난도화 — 핵심어법(L3 과거완료/명사절if/관계대명사which/습관would, L4 분사후치/가목적어it~to/so~that/not only도치/as long as)을 한 문장에 복수로 얽어 단순식별 차단, 밑줄형5+개수형3 혼합.
  - 자체검수 통과: 선택지5개·정답기호·해설 전수 OK, 영작 Q25 4번째=ⓒ an arrangement(정답③) 위치 재확인.
  - 빌더: /home/claude/work/build_exam.py (재실행시 동일 산출). source.json=본문원문 백업.
- **일반 상담신청서 apply.html + 상담 전용 GAS (2026-06-24)**
  - 신규 `apply.html`: 네이버 톡톡 없이 신청 가능한 일반 폼. 브랜드(와인/골드/잉크)·Pretendard. 항목=이름·연락처(필수)·연락가능시간(필수)·학교(필수)·학년(필수)·성별·영어실력단계·거주지역(필수)·상담경로·추천인·상담내용(필수,20자↑)·가이드동의(필수)·연락약속동의(필수). 허니팟(name=website) 스팸방지. 제출=fetch POST(form-urlencoded)→완료화면.
  - **진상/쇼핑 거르기**: 가이드정독 필수동의 + 상담내용 20자↑ + 핵심항목 필수 + 상단 안내문. **잠수방지**: 연락처 필수화(톡톡은 선택이었음) + 연락가능시간 필수 + 연락약속 동의 + 즉시 알림메일.
  - 신규 `consult_gas.gs`: 받을시트=151kfuk4...G18s. doPost(시트 기록+서버 재검증+알림메일) + 허니팟 + doGet 헬스체크. 기존 3종과 분리된 새 GAS.
  - 5개 페이지 네이버 버튼 옆에 '일반 상담 신청' 버튼 추가(총 8군데). 기존 네이버 버튼·기존 코드 무변경 확인. apply.html JS 문법 OK.
  - ⚠️ **아직 미작동**: GAS 배포+URL 연결 전(1번 참조). 연결 전까지 일반신청 버튼 누르면 "네이버로 신청" 안내 뜸.
- **parent_guide.html: 시간표 아래 안내문구 편집 기능 추가 (2026-06-24)**
  - 기존 시간표(TUITION) 편집 방식과 동일 패턴으로 `fee-note` 문구도 화면 편집 가능화. 변수 `NOTE_TEXT` 신설(데이터영역) + `<p class="fee-note" id="feeNote">`에 id 부여 + `renderNote()` 함수 추가(보기=textContent, 편집=textarea) + enterEdit/exitEdit에 renderNote 연동 + 코드복사(feeCopyBtn)에 NOTE_TEXT 포함(복사 안내문도 "...NOTE_TEXT까지" 로 갱신).
  - 관리자 비번 `admin4625`(평문, 코드 내 ADMIN_PW). 점(·) 클릭→비번→편집모드. 시간표 기존 기능(반추가/삭제/코드복사) 무변경 확인. JS 3블록 문법 OK.
- **관리자 페이지 보안 1단계 — 공통 프론트 게이트 (2026-06-24)**
  - 신규 파일 auth.js: 보호 페이지 <head>에 <script src="auth.js"></script> 한 줄로 적용. 미인증 시 전체화면 와인/골드 오버레이로 본체 차단 → 비번 통과 시 sessionStorage['greateng_admin_authed']='1' 저장(같은 탭 내 관리 페이지 이동 시 재입력 없음, 탭 닫으면 해제).
  - 비밀번호는 평문 미저장 — SHA-256 해시(PW_HASH)로만 검증. **변경 시 auth.js의 PW_HASH만 교체**(생성법 파일 상단 주석에 명시).
  - 적용된 4개 페이지(각 파일은 auth.js 1줄만 추가, 기존 코드 무수정 / diff 검증 완료):
    hub.html(L4), hw-monitor.html(L4), teacher.html(L5), exam-analysis.html(L4).
  - **게이트 미적용(의도적)**: voca.html·index.html은 이미 자체 인증 보유(voca=voca_admin_authed, index=학생/관리자 비번) → 충돌 방지 위해 제외. 학생용 페이지(index 퀴즈, voca 학생)도 막지 않음.
  - 발견된 구멍(이번 작업 배경): hub.html이 무인증 인덱스라 모든 관리 페이지+GA4 직링크 노출, hw-monitor.html은 인증 0으로 전교생 사진·성적 즉시 표출. 저장소가 public이라 파일명·소스·GA4 ID 공개. → GA4 "관리자 허브" 집계의 외부/본인 구분 이슈가 발단.
  - ⚠️ 한계: 정적 호스팅이라 프론트 게이트는 화면만 가림. GAS는 여전히 무토큰 응답 → 2단계 필수(1번 참조).
  - **유입경로 점검(2026-06-24, 코드만 읽음·무수정)**: 공개 페이지→관리 페이지 '보이는 링크' 유입경로 **없음** 확인. index의 teacher.html 언급=코드 주석/함수명(링크 아님). voca·voca-test의 관리 링크는 모두 `admin-screen`(관리자 로그인 후에만 표시, "학생에겐 안 보임" 주석) 안. 남는 접근은 URL 직접입력뿐 → auth.js 게이트에 걸림. 단, voca/voca-test 소스에 관리 파일명이 평문 노출(화면엔 안 보이나 소스 보기로 확인 가능) → 게이트로 실질 위험 낮고, 공개/관리 분리 시 자연 해소.
- index.html: 로고 축소 완료. 학습 진도 모니터링(시작일/만료일/일일목표/부족분 경고 팝업, 추천공식 30+ceil(부족분×1.5÷(마감-5))), 사각지대 분석, 프리셋 시험범위 선택, 로고 base64→logo.png 분리
- voca.html: 시험결과 3열 레이아웃(명단|결과|단어쓰기), 숙제 14일 그리드, 단어 교재 카테고리 분류, 출제구성 애플 스타일, 전체 단어시험 현황 그리드(캐싱+병렬8), 관리자 한번에 로그인, 허브 메뉴
- hw-monitor.html: 성적 추이 SVG 차트(모의고사/내신 분리), 제출 기록 실시간 로그
- teacher.html: 지문 난이도 저장 우선순위 버그 수정(meta.difficulty 우선)
- 마케팅: main/summer/suneung_2026/parent_guide/pohang_highschools 크로스링크, 파워링크 광고 검토 제출
- 출제: 제철중3·제철고1 예상문제, exam-analysis.html 2단계 검증엔진 + _review 필드
- 행정: 혁신 소상공인 AI활용 지원사업 신청서 제출, 교습비 변경신고(D등급 추가)
