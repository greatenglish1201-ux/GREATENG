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
    basis: "전체 25문항 기준",
    detailUrl: "",
    blogUrl: "",
    hits: [] /* 상세 지문 목록은 추후 입력 가능 — 비어 있어도 카드는 정상 표시 */
  }
];
