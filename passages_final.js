/* ============================================================
   대단한영어 · 수능 파이널 워크시트 · 지문 데이터
   ------------------------------------------------------------
   ⚠️ 이 파일에만 지문을 추가합니다. worksheet_engine.html은 건드리지 않습니다.
   ⚠️ 두 파일은 반드시 같은 폴더에 두세요.

   필드 설명
   id       고유값(영문·숫자·밑줄)
   src      출처 표기            qnum 문항번호        qtype 유형
   qtext    발문                 star 난이도(1~3)     time B지 목표초
   note     각주(없으면 "")
   ⚠️ 밑줄 규칙: sents 안의 밑줄은 <u>…</u>로 표시하며, 범위는 **발문과 정확히 일치**해야 함.
      (2026-08-05 사고: 21번 발문은 'made a lot of work less sticky'인데 지문엔 'less sticky'만 그어짐)
      30번처럼 번호 붙은 밑줄은 <u class="n1">…</u> 형태로, 번호는 CSS가 자동 부여
   sents    문장 배열 → A지는 ①②③ 자동 부여, B지는 통짜로 이어붙임 (원문 1회만 저장)
   choices  선택지 5개           ans 정답번호(1~5)
   key/attr/dir   STEP1 모범답안. dir는 "긍정" | "부정" | "통념"
   simplify [[지문표현, 모범 단순화], ...]  ← STEP2
   trunk1/trunk2  줄기 이름
   tree     [{n:문장번호, lb:라벨, head:true면 머리, txt:모범내용}]
   pivotAt  전환선을 그 문장번호 '앞'에 넣음
   pivot    {sig:신호어, at:문장번호, from:"", to:""}
   gist     요지 모범답안
   wrong    {"선택지번호":"오답 이유"}
   extra    "함축"이면 STEP7, "순서"면 STEP6 추가 (없으면 생략)

   ------------------------------------------------------------
   공개 층위 (온라인 자습 해설용 · 인쇄에는 영향 없음)
   ------------------------------------------------------------
   VIEW.open   학생이 바로 볼 수 있는 필드 — 정답 / 오답 이유 / 요지
   VIEW.gated  학생이 자기 답을 먼저 채워야 열리는 필드 — 트리 내용, STEP1·2 모범답안
   VIEW.staff  교사 전용 — 전이 점검표, 지도 메모

   ⚠️ 트리 모범답안(tree[].txt)은 반드시 gated.
      먼저 열어주면 학생이 트리를 안 그리고 베낌 → 훈련이 무력화됨.
   ⚠️ 지문마다 다시 지정할 필요 없음. 아래 VIEW 규격이 전 지문에 일괄 적용됨.
      개별 예외가 필요한 지문에만 해당 객체에 view:{...}를 넣어 덮어쓸 것.
   ============================================================ */

window.VIEW = {
  open:  ["ans", "choices", "wrong", "wrongNote", "gist"],
  gated: ["key", "attr", "dir", "simplify", "tree", "trunk1", "trunk2",
          "pivot", "pivotAt", "pivotSub"],
  staff: ["transferCheck", "teachNote"],

  // gated 해제 조건: 학생이 아래 항목을 모두 채워야 모범답안이 열림
  gateRequire: ["key", "dir", "treeAll", "gist"],
  gateMsg: "트리를 먼저 채워야 모범답안이 열립니다."
};

window.LABELS = {
  head: ["주제도입", "대조·반전", "주장", "재진술"],   // 머리 — 줄기를 여는 문장
  sub:  ["부연", "근거", "예시", "비유"]               // 딸림 — 머리에 붙는 문장
};
/* 2026-08-05 확정. flow_workbook_block1.html의 혼용 16종을 8종으로 정리한 표준.
   흡수 관계: 통념·양보→주제도입 / 전환→대조·반전 / 새화제·해결→주장 /
             함의→재진술 / 확장→부연
   ⚠️ 이 8종 밖의 라벨을 새로 만들지 말 것. 지문이 쌓인 뒤엔 되돌리기 어려움. */

window.PASSAGES = [

{
  id: "s23_speed",
  src: "2026수능 23번",
  qnum: 23,
  qtype: "주제",
  qtext: "다음 글의 주제로 가장 적절한 것은?",
  star: 2,
  time: 60,
  note: "* commute: 통근",

  sents: [
    "Emphasizing <i>speed over frequency</i> can make sense in contexts where everyone is expected to plan around the timetable, including peak-only commute services and very long trips with low demand.",
    "In all other contexts, though, it seems to be a common motorist's error.",
    "Roads are there all the time, so their speed is the most important fact that distinguishes them.",
    "But transit is only there if it's coming soon.",
    "If you have a car, you can use a road whenever you want and experience its speed.",
    "But transit has to exist when you need it (span), and it needs to be coming soon (frequency).",
    "Otherwise, waiting time will wipe out any time savings from a faster service.",
    "Unless you're comfortable planning your life around a particular scheduled trip, speed is worthless without frequency, so a transit map that screams about speed and whispers about frequency may simply be planting confusion."
  ],

  choices: [
    "consequences of adjusting frequency of transit",
    "significance of designing an accurate transit map",
    "importance of valuing frequency in public transportation",
    "impact of creating high-speed public transportation systems",
    "methods to improve speed and frequency of commute services"
  ],
  ans: 3,

  key:  "speed vs frequency — 대중교통에서 어느 쪽을 중시하나",
  attr: "속도를 빈도보다 앞세우는 것이 \"말이 되는\" 경우가 있다",
  dir:  "통념",

  simplify: [
    ["a common motorist's error <span class=g>(②)</span>", "운전자 머리로 생각해서 생기는 착각"],
    ["waiting time will wipe out any time savings <span class=g>(⑦)</span>", "기다리다 보면 빨라서 아낀 시간이 다 날아간다"],
    ["screams about speed and whispers about frequency <span class=g>(⑧)</span>", "속도는 크게 써놓고 배차 간격은 작게 써놓은 노선도"]
  ],

  trunk1: "인정하고 들어가는 부분",
  trunk2: "진짜 하고 싶은 말",
  pivotAt: 2,

  tree: [
    {n:1, lb:"주제도입",    head:true ,  txt:"속도 우선이 통하는 예외 상황이 있긴 하다 (양보)"},
    {n:2, lb:"대조·반전",  head:true ,  txt:"그 외 상황에선 그건 운전자식 착각이다 ← 글의 머리"},
    {n:3, lb:"근거",        head:false, txt:"도로는 항상 있음 → 속도가 유일한 변수"},
    {n:4, lb:"근거",        head:false, txt:"대중교통은 곧 와야 비로소 존재함"},
    {n:5, lb:"예시",        head:false, txt:"차는 아무 때나 타고 속도를 누린다"},
    {n:6, lb:"부연",        head:false, txt:"대중교통은 span + frequency가 필요"},
    {n:7, lb:"근거",        head:false, txt:"그래서 빈도 없으면 기다림이 속도 이득을 상쇄"},
    {n:8, lb:"재진술",      head:true ,  txt:"속도는 빈도 없이는 무가치"}
  ],

  pivot: {sig:"though", at:2, from:"속도 우선을 인정", to:"그건 착각이다"},
  pivotSub: "부수 신호어 But(④⑥) · Otherwise(⑦) · Unless(⑧)",

  gist: "대중교통에서 속도는 빈도가 받쳐주지 않으면 의미가 없다.",

  wrong: {
    "1": "빈도 \"조정의 결과\"를 다룬 글이 아님",
    "2": "transit map은 ⑧의 비유 소재일 뿐 — 딸림을 머리로 오인한 함정",
    "4": "고속 시스템 \"구축의 영향\"이 아님",
    "5": "둘 다 개선하는 \"방법\"이 아니라 빈도의 중요성"
  },
  wrongNote: "②·⑤가 주된 함정. 둘 다 딸림 문장의 소재를 머리로 착각한 유형.",

  // staff 층 — 학생에게 노출되지 않음
  teachNote: "transit map(⑧)에 끌려 ②를 고르는지가 이 지문의 관전 포인트. "
           + "딸림의 소재를 머리로 오인하는 전형이라, 틀린 학생은 STEP 3의 head 판정부터 다시 시킬 것."
},

/* ------------------------------------------------------------ */
{
  id: "s26_21_sticky",
  src: "2026수능 21번",
  qnum: 21,
  qtype: "함축",
  qtext: "밑줄 친 <b>made a lot of work less sticky</b>가 다음 글에서 의미하는 바로 가장 적절한 것은?",
  star: 3,
  time: 90,
  note: "* commoditise: 상품화하다  ** granularity: 과립상(顆粒狀)",

  sents: [
    "Digital platforms have <u>made a lot of work less sticky</u>.",
    "As work becomes ever more modularised, commoditised and standardised, and as markets for digital work are created, ties between service work and particular places can be disconnected.",
    "While the business process of outsourcing that emerged in the 1990s allowed large companies to take advantage of a ‘global reserve army’ by moving their call centres to cheap and distant labour markets, cloudwork changes the volume and granularity at which geographically non-proximate work can take place.",
    "A small business in New York can hire a freelance transcriber in Nairobi one day and New Delhi the next.",
    "No offices or factories need to be built, no local regulations are observed, and ― in most cases ― no local taxes are paid.",
    "The switch in the production network of work happens by simply sending some emails or clicking some buttons on a digital work platform.",
    "And, in this way, the employer leaves behind no material traces in the places where it was once an employer."
  ],

  choices: [
    "settled the locational dilemma of the global markets",
    "elevated the spatial flexibility in conducting business",
    "weakened the geographical expansion of local business",
    "relieved the strict legal processes of regional outsourcing",
    "allowed business to be less complicated in its hiring process"
  ],
  ans: 2,

  key:  "디지털 플랫폼과 일 — 일이 장소에 묶이는 정도",
  attr: "일이 특정 장소에 \"들러붙어(sticky)\" 있지 않게 되었다",
  dir:  "긍정",

  simplify: [
    ["made a lot of work less sticky <span class=g>(①)</span>", "일이 특정 장소에 들러붙어 있지 않게 만들었다"],
    ["a ‘global reserve army’ <span class=g>(③)</span>", "값싸게 쓸 수 있는 해외 인력 예비군"],
    ["leaves behind no material traces <span class=g>(⑦)</span>", "그 지역에 아무 흔적도 남기지 않는다"]
  ],

  trunk1: "핵심 주장과 그 원리",
  trunk2: "예전 방식과 무엇이 달라졌나",
  pivotAt: 3,

  tree: [
    {n:1, lb:"주제도입",    head:true ,  txt:"디지털 플랫폼이 일을 장소에서 떼어냈다 ← 밑줄 = 글의 머리"},
    {n:2, lb:"부연",        head:false, txt:"일이 쪼개지고·상품화·표준화되며 장소와의 끈이 끊김 (원리)"},
    {n:3, lb:"대조·반전",  head:false, txt:"1990년대 아웃소싱 ↔ 클라우드워크 — 규모와 잘게 쪼개는 정도가 다름"},
    {n:4, lb:"예시",        head:false, txt:"뉴욕 소기업이 오늘은 나이로비, 내일은 뉴델리 사람을 고용"},
    {n:5, lb:"부연",        head:false, txt:"사무실·규제·세금 어느 것도 그 지역에 얽히지 않음"},
    {n:6, lb:"부연",        head:false, txt:"이메일 몇 통·클릭 몇 번으로 생산망이 갈아탐"},
    {n:7, lb:"재진술",      head:true ,  txt:"고용주가 그 지역에 아무 물리적 흔적도 남기지 않는다"}
  ],

  pivot: {sig:"While", at:3, from:"과거 아웃소싱(콜센터 이전)", to:"클라우드워크(규모·세분화가 다름)"},
  pivotSub: "⚠️ 이 지문은 통념 반전형이 아님 — 주장 제시 후 원리·대조·예시로 확장하는 형. 전환 신호가 약한 대신 딸림이 길다.",

  implied: {
    phrase: "made a lot of work less sticky",
    restateAt: [2, 7],
    model: "일이 특정 장소에 묶여 있지 않게 됐다 = 어디서든 일을 시킬 수 있게 됐다 → 공간적 유연성"
  },

  gist: "디지털 플랫폼 덕분에 일이 장소에 묶이지 않게 되어, 어디서든 일을 맡길 수 있게 되었다.",

  wrong: {
    "1": "\"딜레마를 해결했다\"가 아님 — 애초에 딜레마 얘기가 없음",
    "3": "약화된 것은 지역 기업의 확장이 아니라 일과 장소의 연결",
    "4": "법 절차가 완화된 게 아니라 아예 적용을 피해감(⑤)",
    "5": "채용 간소화는 ④의 예시 소재일 뿐 — 딸림을 머리로 오인한 함정"
  },
  wrongNote: "⑤가 최대 함정. ④번 문장만 보면 맞는 말이라 끌린다. 머리(①·⑦)로 돌아가야 걸러짐.",

  teachNote: "sticky의 사전적 뜻(끈적한)에 갇히면 못 푼다. STEP 7에서 ②·⑦번 문장이 같은 말을 다시 하고 있음을 "
           + "찾게 하는 것이 이 지문의 전부. 어휘력이 아니라 '지문 안에서 되찾기'가 21번의 정체임을 여기서 못 박을 것."
},

/* ------------------------------------------------------------ */
{
  id: "s26_22_coopetition",
  src: "2026수능 22번",
  qnum: 22,
  qtype: "요지",
  qtext: "다음 글의 요지로 가장 적절한 것은?",
  star: 2,
  time: 60,
  note: "* simultaneous: 동시의  ** paramount: 최고의",

  sents: [
    "A sport ecosystem exists based on the type and rate of coopetition existing.",
    "Coopetition is defined as “the simultaneous pursuit of cooperation and competition among firms to leverage strategically important resources for superior value creation purposes”.",
    "It is a useful way to understand the dynamic nature of sport businesses which need to collaborate for resource efficiency purposes but potentially compete with each other.",
    "This special relationship should be managed properly due to trust and confidence issues being paramount.",
    "It can be challenging to be collaborative and competitive in sport as they involve different forms of behaviour.",
    "This means a careful balancing act may be required in terms of the amount of emphasis placed on each activity.",
    "Often sport managers will try to be more competitive due to performance reasons and less collaborative.",
    "By necessity they may need to share information but do so in a cautious manner.",
    "This means it might be better to have plans in place about how to pursue both simultaneously.",
    "This will ensure one is not neglected at the expense of the other."
  ],

  choices: [
    "스포츠 산업에서는 협력과 경쟁 사이의 균형 잡힌 접근이 요구된다.",
    "협력에 기반한 경쟁을 위해서 스포츠 정신 함양 교육이 필수적이다.",
    "스포츠에서는 성과를 중요시하기 때문에 협력을 과소평가하기 쉽다.",
    "스포츠 산업에서는 효율적 자원 활용을 위한 전략이 필요하다.",
    "스포츠 산업에서의 성취는 경쟁을 필연적으로 수반한다."
  ],
  ans: 1,

  key:  "coopetition — 스포츠 기업의 협력과 경쟁",
  attr: "스포츠 생태계는 협력·경쟁이 어떻게 섞이느냐에 따라 성립한다",
  dir:  "긍정",

  simplify: [
    ["the simultaneous pursuit of cooperation and competition <span class=g>(②)</span>", "협력과 경쟁을 동시에 밀고 나가는 것"],
    ["a careful balancing act may be required <span class=g>(⑥)</span>", "어느 쪽에 힘을 얼마나 줄지 조심스럽게 조절해야 한다"],
    ["one is not neglected at the expense of the other <span class=g>(⑩)</span>", "한쪽 챙기다가 다른 쪽을 놓치지 않게"]
  ],

  trunk1: "개념 — 협력과 경쟁이 함께 있다",
  trunk2: "주장 — 그래서 균형 있게 관리하라",
  pivotAt: 4,

  tree: [
    {n:1, lb:"주제도입",    head:true , txt:"스포츠 생태계는 coopetition의 형태·정도에 따라 성립"},
    {n:2, lb:"부연",        head:false, txt:"coopetition = 협력과 경쟁의 동시 추구"},
    {n:3, lb:"부연",        head:false, txt:"자원 효율을 위해 협력하면서도 서로 경쟁하는 역동성"},
    {n:4, lb:"주장",        head:true ,  txt:"이 관계는 제대로 관리되어야 한다 ← 주장 시작"},
    {n:5, lb:"근거",        head:false, txt:"둘은 행동 방식이 달라 동시에 하기 어렵다"},
    {n:6, lb:"주장",        head:true ,  txt:"어느 쪽에 얼마나 힘을 줄지 세심한 균형이 필요"},
    {n:7, lb:"근거",        head:false, txt:"현장에선 성과 때문에 경쟁 쪽으로 기울기 쉽다"},
    {n:8, lb:"부연",        head:false, txt:"필요해서 정보는 공유하되 조심스럽게 한다"},
    {n:9, lb:"재진술",      head:true ,  txt:"둘을 동시에 추구할 계획을 미리 세워두는 편이 낫다"},
    {n:10, lb:"근거",        head:false, txt:"그래야 한쪽을 희생시키지 않는다"}
  ],

  pivot: {sig:"should (조동사)", at:4, from:"개념 설명", to:"이렇게 해야 한다는 주장"},
  pivotSub: "⚠️ However·But 같은 신호어가 없는 전환. <b>조동사(should / may be required / might be better)</b>가 전환 신호. 신호어만 찾는 학생이 놓치는 유형.",

  gist: "스포츠 산업에서는 협력과 경쟁 어느 한쪽에 치우치지 않도록 균형 있게 관리해야 한다.",

  wrong: {
    "2": "스포츠 정신 함양 교육은 언급 자체가 없음",
    "3": "⑦번 문장(현실 지적) 하나만 본 것 — 딸림을 요지로 오인",
    "4": "자원 효율은 ③의 부분 소재. 글은 '자원 전략'이 아니라 '균형'을 말함",
    "5": "경쟁의 필연성이 아니라 협력과의 균형이 요지 — 방향이 반대"
  },
  wrongNote: "③이 최대 함정. 실제로 지문에 나온 말이지만 딸림 문장이다.",

  teachNote: "신호어가 없는 전환을 훈련하기에 최적인 지문. STEP 4에서 학생이 '신호어가 없다'고 하면 "
           + "조동사·This means를 짚어줄 것. 21번·24번과 달리 머리가 셋(④⑥⑨)이라 요지 재구성 연습에도 좋다."
},

/* ------------------------------------------------------------ */
{
  id: "s26_24_culturtainment",
  src: "2026수능 24번",
  qnum: 24,
  qtype: "제목",
  qtext: "다음 글의 제목으로 가장 적절한 것은? [3점]",
  star: 3,
  time: 70,
  note: "* homogeneous: 동종의  ** dilution: 희석  *** exploitation: 착취",

  sents: [
    "The economic benefit of culturtainment makes it attractive to politicians and policy makers alike.",
    "A potential increase in inbound visitor numbers coupled with their demand for related goods and services (travel, accommodation, retail) is an incentive for those within governments and authorities to work with cultural groups in order to develop celebrations and commemorations into larger and more high-profile events.",
    "However, such commercialization risks culturtainment becoming homogeneous and losing its original ‘message’ that could lead to a dilution of audiences.",
    "This could also lead to smaller non-commercial independent events being set up that would only serve to divide audiences further.",
    "This is something that planners and stakeholders will need to balance against potential financial gain.",
    "Changing political, social and religious landscapes will lead to the emergence of new cultures, and with them new culturtainment experiences.",
    "Overall this is a healthy growth sector of the entertainment industry, but one that by its very nature is delicate in the face of exploitation."
  ],

  choices: [
    "The Commercialization of Culture and Its Unexpected Benefits",
    "Cash or Soul? When Culture Couples with Entertainment",
    "Culturtainment: An Ambition of Entertainment to Be a Culture",
    "New Cultures! The Poisonous Fruit of Culturtainment",
    "Why Balanced Investments Matter in the Entertainment Industry"
  ],
  ans: 2,

  key:  "culturtainment — 문화의 상업화",
  attr: "경제적 이익 때문에 정치인·정책 입안자에게 매력적이다",
  dir:  "통념",

  simplify: [
    ["coupled with their demand for related goods and services <span class=g>(②)</span>", "관광객이 늘면 딸려오는 소비까지"],
    ["losing its original ‘message’ <span class=g>(③)</span>", "원래 전하려던 뜻이 사라진다"],
    ["delicate in the face of exploitation <span class=g>(⑦)</span>", "이익만 노리고 파고들면 쉽게 망가진다"]
  ],

  trunk1: "돈이 되는 쪽 — 왜 매력적인가",
  trunk2: "잃는 쪽 — 무엇이 위험한가",
  pivotAt: 3,

  tree: [
    {n:1, lb:"주제도입",    head:true ,  txt:"경제적 이익 때문에 정치권에 매력적이다 (양보 — 장점 먼저)"},
    {n:2, lb:"부연",        head:false, txt:"관광객 증가와 소비가 유인이 되어 행사를 키우려 한다"},
    {n:3, lb:"대조·반전",  head:true ,  txt:"그러나 상업화는 획일화·본래 메시지 상실의 위험 ← 글의 머리"},
    {n:4, lb:"부연",        head:false, txt:"독립 행사가 따로 생겨 관객이 더 쪼개질 수도"},
    {n:5, lb:"주장",        head:true ,  txt:"기획자·이해관계자가 금전적 이익과 저울질해야 할 문제"},
    {n:6, lb:"부연",        head:false, txt:"사회가 바뀌면 새 문화와 새 culturtainment가 계속 나온다"},
    {n:7, lb:"재진술",      head:true ,  txt:"건강한 성장 분야지만, 본질상 착취에 취약하다"}
  ],

  pivot: {sig:"However", at:3, from:"경제적 이익(장점)", to:"상업화의 위험(단점)"},
  pivotSub: "⑦의 <b>but</b>이 한 번 더 눌러준다 — 마지막 문장까지 읽어야 '둘 다'라는 균형이 보임.",

  gist: "culturtainment는 경제적 이익을 주지만 상업화로 본래 의미를 잃을 위험이 있어, 둘을 저울질해야 한다.",

  wrong: {
    "1": "이익만 담고 후반의 위험을 통째로 누락 — 줄기 1만 읽은 답",
    "3": "오락이 문화가 되려 한다는 내용은 지문에 없음",
    "4": "위험만 담고 ⑦의 'healthy growth sector'를 놓침 — 줄기 2만 읽은 답",
    "5": "균형은 맞지만 대상이 '투자'가 아니라 '상업화와 본래 의미'"
  },
  wrongNote: "①과 ④가 정확히 반대 방향의 함정. 한 줄기만 읽으면 둘 중 하나로 간다. 제목은 <b>두 줄기를 다 담은 것</b>이라야 한다.",

  teachNote: "제목 문항이 주제 문항과 다른 지점을 보여주기에 가장 좋은 지문. 정답 ②가 'Cash or Soul?'이라는 "
           + "비유·의문형이라 STEP 5의 요지를 그대로 옮기면 안 되고 한 번 더 변환해야 함. "
           + "①④를 고른 학생은 트리의 전환선을 못 그은 것이므로 STEP 3으로 되돌릴 것."
},

/* ------------------------------------------------------------ */
{
  id: "s26_30_situational",
  src: "2026수능 30번",
  qnum: 30,
  qtype: "어휘",
  qtext: "다음 글의 밑줄 친 부분 중, 문맥상 낱말의 쓰임이 적절하지 <b>않은</b> 것은? [3점]",
  star: 3,
  time: 80,
  note: "",

  sents: [
    "<i>Situational ethics</i> is an ethical theory that takes into account the context of a situation or an act when judging whether it is ethical.",
    "Supporters of this theory willingly permit casting aside <u class=\"n1\">absolute</u> moral standards.",
    "In the absence of a universal standard or law, what matters is the outcome or consequences; so, the end <u class=\"n2\">justifies</u> the means.",
    "Possibly the following contrasting realities can help illustrate the application of situational ethics.",
    "In a pickup game of basketball played among friends, everyone is expected to call his or her own fouls or acknowledge knocking the ball out-of-bounds.",
    "Caring about one’s friends and maybe getting to <u class=\"n3\">keep</u> playing with the group leads to these actions.",
    "But, once an organized game is played with officials, most athletes will not admit to the same fouls or violations as the end goal of winning is more important than expressing <u class=\"n4\">concern</u> for competitors.",
    "Situational ethics has been extended by many athletes and coaches to mean trying to get away with as many actions on the field or court as possible to <u class=\"n5\">abandon</u> competitive advantages."
  ],

  choices: ["absolute", "justifies", "keep", "concern", "abandon"],
  ans: 5,

  key:  "situational ethics — 상황에 따라 판단하는 윤리",
  attr: "행위의 맥락을 따져서 윤리성을 판단한다",
  dir:  "긍정",

  simplify: [
    ["takes into account the context <span class=g>(①)</span>", "그때그때 상황을 따져본다"],
    ["the end justifies the means <span class=g>(③)</span>", "결과만 좋으면 방법은 상관없다"],
    ["trying to get away with as many actions as possible <span class=g>(⑧)</span>", "최대한 안 걸리고 넘어가려 한다"]
  ],

  trunk1: "상황윤리란 무엇인가 — 그리고 친구끼리 하는 경기",
  trunk2: "공식 경기에서는 정반대가 된다",
  pivotAt: 7,

  tree: [
    {n:1, lb:"주제도입",  head:true,  txt:"상황윤리 = 맥락을 따져 윤리성을 판단하는 이론"},
    {n:2, lb:"부연",      head:false, txt:"절대적 도덕 기준을 기꺼이 치워둔다"},
    {n:3, lb:"부연",      head:false, txt:"보편 기준이 없으니 결과가 중요 → 목적이 수단을 정당화"},
    {n:4, lb:"부연",      head:false, txt:"대조되는 두 현실로 설명해 보겠다 (예고)"},
    {n:5, lb:"예시",      head:false, txt:"친구끼리 하는 픽업 게임 — 스스로 파울을 선언한다"},
    {n:6, lb:"근거",      head:false, txt:"친구를 아끼고 계속 뛰고 싶어서 그렇게 행동"},
    {n:7, lb:"대조·반전", head:true,  txt:"심판 있는 공식 경기에서는 파울을 인정하지 않는다"},
    {n:8, lb:"재진술",    head:true,  txt:"결국 최대한 안 걸리고 넘어가려는 태도로 확장됨"}
  ],

  pivot: {sig:"But, once", at:7, from:"친구끼리 — 배려가 우선", to:"공식 경기 — 이기는 것이 우선"},
  pivotSub: "④번 문장의 <b>contrasting realities</b>가 전환을 미리 예고한다. 신호어보다 먼저 나오는 예고어.",

  vocab: [
    {n:1, word:"absolute",  ok:true,
     why:"보편 기준을 부정하는 이론이므로 '절대적' 기준을 치워두는 것이 맞음"},
    {n:2, word:"justifies", ok:true,
     why:"결과가 중요하다는 앞 문장과 순행 — 목적이 수단을 정당화"},
    {n:3, word:"keep",      ok:true,
     why:"친구와 계속 뛰고 싶은 마음이 스스로 파울을 인정하게 만듦 (배려 방향)"},
    {n:4, word:"concern",   ok:true,
     why:"이기는 것이 상대에 대한 '배려'를 표현하는 것보다 중요하다 — 순행"},
    {n:5, word:"abandon",   ok:false,
     why:"최대한 빠져나가려는 이유는 경쟁 우위를 '버리려고'가 아니라 '얻으려고'",
     fix:"gain / obtain"}
  ],

  gist: "상황윤리는 맥락에 따라 판단하므로, 스포츠에서는 이기기 위해 최대한 빠져나가려는 태도로까지 확장된다.",

  wrong: {},
  wrongNote: "①~④는 모두 '결과 우선'이라는 글의 방향과 순행. ⑤만 혼자 방향이 뒤집혀 있다.",

  teachNote: "30번은 어휘력 문항이 아니라 STEP 1의 <b>속성 방향</b>을 밑줄 5개에 반복 적용하는 문항임을 각인시킬 것. "
           + "역행 표시가 둘 이상 나온 학생은 단어를 몰라서가 아니라 글의 방향 자체를 잘못 잡은 것 → STEP 1로 되돌림. "
           + "⑤는 앞의 to부정사(목적)를 놓치면 안 보임 — '무엇을 하려고 빠져나가는가'를 물어볼 것."
},

/* ===== 속독 트랙 (fast:true) — 트리 없이 STEP 1만. 3문항이 한 장에 묶임 ===== */
{
  id: "s26_18_club",
  src: "2026수능 18번", qnum: 18, qtype: "목적",
  qtext: "다음 글의 목적으로 가장 적절한 것은?",
  star: 1, time: 40,
  fast: true,

  sents: [
    "Dear students, I am Amanda Clark, the school club director, and I am writing to you about our school clubs.",
    "Over the last few semesters, there have been requests for more diverse school clubs.",
    "For this reason, the school decided to expand the number of clubs for extracurricular activities.",
    "This provides students with an opportunity to make additional clubs.",
    "Students can make any type of club based on their various interests, such as hip-hop, K-pop dancing, or coding.",
    "Therefore, I am encouraging you to submit a proposal for a new club that you would like to create.",
    "Please turn this in to my office by the end of this week.",
    "I look forward to seeing your great ideas. Best regards, Amanda Clark"
  ],
  choices: [
    "동아리 활동에 대한 만족도를 조사하려고",
    "동아리 개설 제안서 제출을 독려하려고",
    "체험 활동 결과 보고서를 요청하려고",
    "동아리 신규 회원 모집을 공지하려고",
    "방과 후 활동 프로그램을 설명하려고"
  ],
  ans: 2,
  fastWhy: "⑥번 문장 Therefore + I am encouraging you to submit a proposal. 목적문은 거의 항상 "
         + "Therefore·So 뒤의 요청 동사에 있다. 앞 5문장은 배경이라 안 읽어도 됨.",
  teachNote: "목적 문항은 <b>맨 끝에서 두세 번째 문장</b>부터 읽으라고 지도할 것. 위에서부터 읽으면 시간만 쓴다."
},

{
  id: "s26_19_sophie",
  src: "2026수능 19번", qnum: 19, qtype: "심경",
  qtext: "다음 글에 드러난 Sophie의 심경 변화로 가장 적절한 것은?",
  star: 1, time: 45,
  fast: true, fastMode: "mood",

  sents: [
    "“Where could it be?” Sophie asked herself.",
    "It had been more than ten years since she had last visited the area where she had grown up.",
    "The village had changed a lot over time.",
    "Uncertain, she awkwardly looked around at her surroundings.",
    "She walked the narrow streets of the village, unsure about which way to go.",
    "Suddenly, Sophie saw a familiar sight.",
    "“Yes, this must be it,” she thought.",
    "In front of her was a wall with flowers painted on it.",
    "Although the colors were now faded, the familiar shapes on the wall were the same ones she had painted with her father as a child.",
    "Sophie nodded, smiled brightly, and walked toward the gate.",
    "At last, she had finally found the house she had grown up in."
  ],
  choices: [
    "confused → pleased",
    "confident → embarrassed",
    "thrilled → anxious",
    "relieved → nervous",
    "bored → excited"
  ],
  ans: 1,
  fastWhy: "앞 = Uncertain · awkwardly · unsure (혼란) / 뒤 = smiled brightly · At last · finally found (만족). "
         + "전환 지점은 ⑥번 <b>Suddenly</b>. 심경 문항의 전환은 거의 언제나 Suddenly·Then·But 뒤.",
  teachNote: "심경은 '방향(+/−)'이 아니라 <b>앞뒤 두 지점</b>을 잡는 문항. 그래서 속독지에서도 칸이 다르다. "
         + "선택지를 먼저 보고 앞 감정 후보만 훑게 하면 20초에 끝난다."
},

{
  id: "s26_20_lyricists",
  src: "2026수능 20번", qnum: 20, qtype: "주장",
  qtext: "다음 글에서 필자가 주장하는 바로 가장 적절한 것은?",
  star: 1, time: 50,
  fast: true,
  note: "* lyricist: 작사가  ** restraint: 제약",

  sents: [
    "The study of literature has repeatedly failed to recognize the influence of modern musical lyricists and their contributions to the evolution of language.",
    "Unlike Shakespeare, who has been studied and celebrated for his development of the English language, particularly in vocabulary and grammatical structure, modern songwriters have experienced restraints on the acknowledgement of their contributions and largely been ignored.",
    "Over the past century, we have witnessed an explosion of incredible literary works by these artists, who, through their music, have used linguistic manipulation and storytelling to enrich our language and literature.",
    "Producing lyrics of distinct and complex imagery, songwriters have had an incredible literary impact on our language.",
    "Their remarkable works, including influences on modern language development, must be recognized in the field of modern literature."
  ],
  choices: [
    "독특하고 복합적인 이미지 표현 기법을 작사 과정에 적용해야 한다.",
    "가사를 통해 작사가들이 언어와 문학에 기여한 바를 인정해야 한다.",
    "셰익스피어의 작품이 영문학 발전에 미친 영향을 분석해야 한다.",
    "문학 작품을 감상하기 위해 스토리텔링 기법을 이해해야 한다.",
    "문학 작품과 가사에 사용되는 언어의 차이를 연구해야 한다.",
  ],
  ans: 2,
  fastWhy: "①번 문장에서 이미 소재(작사가의 기여)와 방향(−, 인정받지 못함)이 다 나온다. "
         + "마지막 <b>must be recognized</b>가 확인 사살. 주장 문항은 첫 문장 + must/should 문장 두 개면 끝.",
  teachNote: "속독 훈련의 표본. STEP 1만으로 ①에서 답이 잡히고, 중간 ③④는 근거라 건너뛰어도 된다. "
         + "첫 시간에 이 지문으로 '다 읽지 않아도 된다'를 체감시킬 것."
}

];
