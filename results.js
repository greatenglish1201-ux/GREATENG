/* ============================================================
   GREATENG 적중사례 데이터 (results.js)
   ------------------------------------------------------------
   ▶ 새 시험 추가 방법: 아래 RESULTS 배열 "맨 앞"에 한 덩어리 추가
   ▶ 필드 설명
      school   : 학교명 (카드 제목)
      exam     : 시험명 (학년·학기·과목 포함)
      date     : 시험일 YYYY-MM-DD (최신순 정렬 기준)
      total    : 분모 문항수
      hit      : 적중 문항수
      hideRate : (선택) true면 적중률 % 대신 "지문 N개 적중"으로 표기하고
                 상단 평균 적중률 계산에서도 제외 (분모 기준이 달라 왜곡 방지용)
      basis    : 분모 산정 기준 문구 (카드에 그대로 표기 — 정직 표기용)
      detailUrl: 상세 분석 아카이브 링크 (analysis/ 폴더, 없으면 "")
      blogUrl  : 네이버 블로그 포스팅 링크 (없으면 "")
      hits     : 적중 상세 [{ topic, predicted, actual }]
                 topic=지문 소재, predicted=예상 유형, actual=실제 출제 유형
                 (상세 미입력 시 빈 배열 [] — 카드 요약만 표시됨)
   ▶ 주의: 지문 원문·시험 문제 원문은 절대 넣지 말 것 (저작권)
   ============================================================ */
const RESULTS = [
  {
    school: "동지고",
    exam: "3학년 1학기 기말 (영어독해와작문)",
    date: "2026-07-06",
    total: 26,
    hit: 6,
    hideRate: true,   /* 적중률(%) 미표기 · "지문 N개 적중"만 · 평균 계산 제외 */
    basis: "사전 배포 예상문제와 동일한 지문이 실제 출제된 6개 (6건 전부 유형 변형)",
    detailUrl: "",
    blogUrl: "",
    hits: [
        { topic: "NFL 쿼터백 랭킹·수학과 일상 (수특 24강)", predicted: "어법", actual: "요지 (지문 적중)" },
        { topic: "자기방어·성공실패 재해석 (수특 28강)", predicted: "함축의미", actual: "제목 (지문 적중)" },
        { topic: "아동 미각선호·양수·분유 (수특 30강)", predicted: "문장삽입", actual: "어법 (지문 적중)" },
        { topic: "연결성과 서식지 단편화 (수특 22강)", predicted: "흐름무관", actual: "어휘 (지문 적중)" },
        { topic: "환경 인종주의·redlining (수특 29강)", predicted: "빈칸추론", actual: "주제 (지문 적중)" },
        { topic: "자전거·운전 학습 (수특 25강)", predicted: "문장삽입", actual: "흐름무관 (지문 적중)" }
    ]
  },
  {
    school: "포항제철고",
    exam: "1학년 1학기 기말 (공통영어1)",
    date: "2026-07-06",
    total: 28,
    hit: 6,
    hideRate: true,   /* 적중률 % 대신 "지문 N개 적중" 표기 · 평균 계산 제외 */
    basis: "사전 배포 예상문제와 동일 지문 출제 6개 기준",
    detailUrl: "",
    blogUrl: "",
    hits: [
        { topic: "권태와 자기주도 놀이", predicted: "흐름무관", actual: "흐름무관 (완전 적중)" },
        { topic: "신경망 AI와 예술", predicted: "제목", actual: "제목 (유형 적중)" },
        { topic: "디지털·가상 공간의 실재성", predicted: "빈칸추론", actual: "문장삽입 (지문 적중)" },
        { topic: "뇌과학과 사고력", predicted: "빈칸추론", actual: "제목 (지문 적중)" },
        { topic: "영어의 지역적 변이(Englishes)", predicted: "내용일치", actual: "제목" },
        { topic: "확증편향과 정보처리", predicted: "요약문완성", actual: "빈칸추론" }
    ]
  },
  {
    school: "포항제철중",
    exam: "3학년 1학기 기말 (비상 김진완 L3·L4)",
    date: "2026-07-01",
    total: 26,
    hit: 19,
    basis: "완전 적중 9 + 부분 적중 10 = 총 19문항 / 전체 26문항",
    detailUrl: "",
    blogUrl: "",
    hits: [
        { topic: "L3 파락호 — 어법 밑줄", predicted: "L3 어법 밑줄형", actual: "어법 (완전 적중)" },
        { topic: "L3 파락호 — 내용 일치/불일치", predicted: "L3 내용일치", actual: "내용 불일치 (완전 적중)" },
        { topic: "공통 어법 — if 명사절 판별", predicted: "if 용법 구별", actual: "if 용법 (완전 적중)" },
        { topic: "L4 정크오케스트라 — 내용 일치", predicted: "L4 내용일치", actual: "내용 일치 (완전 적중)" },
        { topic: "공통 어법 — 가목적어 it", predicted: "가목적어 it 판별", actual: "가목적어 it (완전 적중)" },
        { topic: "공통 어법 — 어법상 옳은 것", predicted: "어법 옳은 문장", actual: "어법 (완전 적중)" },
        { topic: "공통 어휘 — 영영풀이 매칭", predicted: "영영풀이 판별", actual: "영영풀이 (완전 적중)" },
        { topic: "공통 대화 — [A][B] 불일치", predicted: "대화 일치/불일치", actual: "대화 불일치 (완전 적중)" },
        { topic: "공통 대화 — [A][B] 일치", predicted: "대화 일치", actual: "대화 일치 (완전 적중)" },
        { topic: "L3 결혼·궤짝 — 어법 밑줄", predicted: "어법 밑줄형", actual: "어법 밑줄 ①~⑤" },
        { topic: "L3 결혼·궤짝 — 핵심어휘 빈칸", predicted: "핵심어휘 빈칸", actual: "빈칸 어휘" },
        { topic: "공통 어법 — 밑줄 오류 판별", predicted: "어법 밑줄 짝", actual: "어법 밑줄 짝" },
        { topic: "L4 정크 — 빈칸 어휘 짝", predicted: "L4 빈칸 어휘", actual: "빈칸 어휘 ⓐⓑ" },
        { topic: "L4 정크 — 내용 이해", predicted: "L4 내용 판별", actual: "댓글 이해" },
        { topic: "공통 어법 — 올바른 형태", predicted: "어법 형태 고치기", actual: "어법 형태" },
        { topic: "공통 어법 — 분사 후치수식", predicted: "분사 후치수식", actual: "분사 playing 쓰임" },
        { topic: "공통 어휘 — 핵심어휘 빈칸", predicted: "핵심어휘 빈칸", actual: "어휘 빈칸" },
        { topic: "공통 어휘 — 어휘 빈칸(가)", predicted: "어휘 빈칸", actual: "빈칸 어휘(가)" },
        { topic: "공통 대화 — 속담·표현", predicted: "대화 속 속담", actual: "속담(No pain no gain)" }
    ]
  },
  {
    school: "포항제철고",
    exam: "3학년 1학기 기말 (영어Ⅱ)",
    date: "2026-07-03",
    total: 15,
    hit: 7,
    basis: "교재(수특영독) 범위 출제 15문항 기준 · 외부지문 15문항 제외",
    detailUrl: "analysis/jechulgo3_2026_1f.html",
    blogUrl: "",
    hits: [
      { topic: "역사가의 서사 구성",            predicted: "제목",       actual: "요지" },
      { topic: "아시아계 미국인 양육방식",       predicted: "빈칸추론",   actual: "글의순서" },
      { topic: "동물보호법 vs 동물권",           predicted: "어휘",       actual: "어휘 (완전 적중)" },
      { topic: "얼굴 표정의 보편성",             predicted: "흐름무관",   actual: "빈칸추론" },
      { topic: "과학의 이상화·이상기체법칙",     predicted: "글의순서",   actual: "문장삽입" },
      { topic: "창업 위해 퇴사하는 직원들",      predicted: "함축의미",   actual: "글의순서" },
      { topic: "전자적 소수의견의 설득력",       predicted: "요약문완성", actual: "어휘" }
    ]
  },
  {
    school: "이동고",
    exam: "3학년 1학기 기말 (영어독해와작문)",
    date: "2026-07-01", /* TODO: 정확한 시험일 확인 후 수정 */
    total: 25,
    hit: 17,
    basis: "전체 25문항 기준 · 17문항 적중 (16문항은 유형 변형)",
    detailUrl: "",
    blogUrl: "",
    hits: [
      { topic: "꿈과 기억의 출처 (수특영어 28강)",     predicted: "어법",   actual: "어법 (완전 적중)" },
      { topic: "사바나 선호 가설 (수특영어 28강)",     predicted: "어법",   actual: "빈칸추론" },
      { topic: "아시아계 아동 양육 (5·6월 모의고사)",  predicted: "글의순서", actual: "내용일치" }
      /* 블로그 공개 대표 3건. 전체 17건 중 나머지는 미공개 */
    ]
  }
];
