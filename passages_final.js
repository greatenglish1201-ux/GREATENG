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
   lead     {to:2, note:"...", why:"..."}  ← STEP1을 **어디까지 읽고** 잡는가
            to   : 도입부 마지막 문장 번호 (없으면 1 = 첫 문장만)
            note : 왜 거기까지인지 (교사용 해설에 표시)
            why  : 학생용 힌트. 초·중급(lv≤2)에서만 노출
            ⚠️ 첫 문장이 비유·정의·인용이면 소재·속성이 안 잡힘 → to를 2~3으로 늘릴 것
   key/attr/dir   STEP1 모범답안. dir는 "긍정" | "부정" | "통념"
   ⚠️ key·attr에는 **본문에 실제로 나온 영어 표현**을 <b class=w>…</b>로 감싸 넣을 것.
      학생이 '지문 어디를 보고 그렇게 판단했는지' 역추적할 수 있어야 함.
      한국어 요약만 있으면 어디를 봐야 할지 알 수 없다.
   dirWord  방향을 결정지은 본문 표현 (영어). 방향 체크칸 옆에 근거로 표시됨
   simplify [[지문표현, 모범 단순화], ...]  ← STEP2
   trunk1/trunk2  줄기 이름
   tree     [{n:문장번호, lb:라벨, head:true면 머리, txt:모범내용}]
   pivotAt  전환선을 그 문장번호 '앞'에 넣음
   pivot    {sig:신호어, at:문장번호, from:"", to:""}
   gist     요지 모범답안
   wrong    {"선택지번호":"오답 이유"}
   ans42    41-42형 전용. vocab이 있는 장문은 41번(ans)과 42번(ans42) 정답이 다름
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

  lead: {to:1, note:"①의 can make sense in contexts where…가 조건부 인정 = 양보. 첫 문장으로 충분"},
  key:  "<b class=w>speed over frequency</b> — 속도와 빈도 중 어느 쪽을 앞세우나",
  attr: "<b class=w>can make sense in contexts where…</b> — 어떤 상황에서는 말이 된다 (조건부 인정)",
  dir:  "통념",
  dirWord: "can make sense <b class=w>in contexts where</b> — 범위를 한정하면 곧 뒤집힌다",

  skip: [
    {n:2, head:"In all other contexts, though...", skip:false},
    {n:3, head:"Roads are there all the time...", skip:false},
    {n:4, head:"But transit is only there if...", skip:false},
    {n:5, head:"If you have a car, you can use a road...", skip:false},
    {n:6, head:"But transit has to exist when you need it...", skip:false},
    {n:7, head:"Otherwise, waiting time will wipe out...", skip:false},
    {n:8, head:"Unless you\u2019re comfortable planning your life...", skip:false}
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

  lead: {to:2,
    note:"①은 밑줄 문장 자체이자 비유(sticky)라 여기서 속성을 잡을 수 없다. "
       + "②의 modularised·commoditised·standardised, ties…disconnected가 sticky를 풀어준 첫 자리",
    why:"①의 <b>sticky</b>는 비유라 뜻이 아직 안 잡힌다. <b>②번까지</b> 읽고 속성을 정하라."},
  key:  "<b class=w>Digital platforms</b> + <b class=w>work</b> — 일이 장소에 묶이는 정도",
  attr: "<b class=w>ties between service work and particular places can be disconnected</b> ②<br>— 일과 장소의 끈이 끊어진다",
  dir:  "긍정",
  dirWord: "<b class=w>modularised, commoditised and standardised</b> ② — 셋 다 같은 방향으로 나열",

  skip: [
    {n:2, head:"As work becomes ever more modularised...", skip:false},
    {n:3, head:"While the business process of outsourcing that emerged in <b>the 1990s</b>...", skip:true,
     why:"<b>연도</b>(1990s) - 과거 사례를 드는 자리"},
    {n:4, head:"A small business in <b>New York</b> can hire... in <b>Nairobi</b>... <b>New Delhi</b>", skip:true,
     why:"<b>지명</b>(New York/Nairobi/New Delhi) - 전형적인 예시"},
    {n:5, head:"No offices or factories need to be built...", skip:false},
    {n:6, head:"The switch in the production network...", skip:false},
    {n:7, head:"And, in this way, the employer leaves behind...", skip:false}
  ],


  trunk1: "일이 장소에서 풀려났다 — 처음부터 끝까지 한 방향",
  trunk2: "",
  pivotAt: 0,   // ⚠️ 전환점 없음. While(③)은 줄기 전환이 아니라 과거와의 비교(딸림)

  tree: [
    {n:1, lb:"주제도입",    head:true ,  txt:"디지털 플랫폼이 일을 장소에서 떼어냈다 ← 밑줄 = 글의 머리"},
    {n:2, lb:"부연",        head:false, txt:"일이 쪼개지고·상품화·표준화되며 장소와의 끈이 끊김 (원리)"},
    {n:3, lb:"근거",       head:false, txt:"1990년대 아웃소싱과 견줌 — 규모·세분화가 다를 뿐 방향은 같음 (줄기 전환 아님)"},
    {n:4, lb:"예시",        head:false, txt:"뉴욕 소기업이 오늘은 나이로비, 내일은 뉴델리 사람을 고용"},
    {n:5, lb:"부연",        head:false, txt:"사무실·규제·세금 어느 것도 그 지역에 얽히지 않음"},
    {n:6, lb:"부연",        head:false, txt:"이메일 몇 통·클릭 몇 번으로 생산망이 갈아탐"},
    {n:7, lb:"재진술",      head:true ,  txt:"고용주가 그 지역에 아무 물리적 흔적도 남기지 않는다"}
  ],

  pivot: {sig:"없음", at:0,
    from:"이 글에는 흐름 전환이 없다",
    to:"①의 방향이 ⑦까지 그대로 이어진다"},
  pivotSub: "③의 <b>While</b>은 <u>줄기를 바꾸지 않는다</u> — 과거 아웃소싱과 클라우드워크를 견주는 "
          + "<b>딸림 문장</b>일 뿐, 둘 다 '일이 장소에서 풀려난다'는 같은 방향이다. "
          + "<b>전환점이 없는 글도 있다</b>는 것을 가르치는 지문.",

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

  lead: {to:3,
    note:"①은 용어만 던지고 ②가 정의, ③이 '왜 중요한가'. 세 문장이 한 덩어리로 도입부",
    why:"①만으로는 coopetition이 뭔지 모른다. <b>③번까지</b> 읽어라."},
  key:  "<b class=w>coopetition</b> — 협력(cooperation)과 경쟁(competition)의 합성어",
  attr: "<b class=w>the simultaneous pursuit of cooperation and competition</b> ②<br>— 둘을 동시에 추구하는 것",
  dir:  "긍정",
  dirWord: "<b class=w>a useful way to understand</b> ③ — 유용하다고 평가 = 긍정",

  skip: [
    {n:2,  head:"Coopetition is defined as...", skip:false},
    {n:3,  head:"It is a useful way to understand...", skip:false},
    {n:4,  head:"This special relationship should be managed...", skip:false},
    {n:5,  head:"It can be challenging to be collaborative...", skip:false},
    {n:6,  head:"This means a careful balancing act...", skip:false},
    {n:7,  head:"Often sport managers will try...", skip:false},
    {n:8,  head:"By necessity they may need to share...", skip:false},
    {n:9,  head:"This means it might be better...", skip:false},
    {n:10, head:"This will ensure one is not neglected...", skip:false}
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

  pivot: {sig:"should (조동사)", at:4, from:"개념 설명(무엇인가)", to:"주장(어떻게 해야 하는가)"},
  pivotSub: "⚠️ However·But이 <u>하나도 없는</u> 전환. <b>조동사(should · may be required · might be better)</b>가 "
          + "전환 신호다. 신호어만 찾는 학생이 통째로 놓치는 유형. "
          + "여기서 바뀌는 것은 <b>방향이 아니라 성격</b>(설명 → 주장)임에 유의.",

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

  lead: {to:1, note:"①에 소재·속성·방향(양보)이 다 있다. 도입부 확장 불필요"},
  key:  "<b class=w>culturtainment</b> — 문화(culture)와 오락(entertainment)의 합성어",
  attr: "<b class=w>The economic benefit … makes it attractive</b> ① — 돈이 되니 매력적이다",
  dir:  "통념",
  dirWord: "<b class=w>attractive to politicians</b>로 장점부터 — 장점 먼저 = 양보. However를 기다려라",

  skip: [
    {n:2, head:"A potential increase in inbound visitor numbers...", skip:false},
    {n:3, head:"However, such commercialization risks...", skip:false},
    {n:4, head:"This could also lead to smaller...", skip:false},
    {n:5, head:"This is something that planners...", skip:false},
    {n:6, head:"Changing political, social and religious landscapes...", skip:false},
    {n:7, head:"Overall this is a healthy growth sector...", skip:false}
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
    {n:6, lb:"주제도입",    head:true ,  txt:"(새 화제) 사회가 바뀌면 새 문화·새 culturtainment가 계속 나온다 — 앞의 위험 얘기와 별개"},
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

  teachNote: "⑥번은 앞의 위험 얘기와 무관한 <b>새 화제</b>다. 여기서 '왜 갑자기 이 말이 나오지?'를 못 느끼면 "
           + "글의 구조를 못 읽은 것. 다만 새 화제여도 ⑦이 두 줄기를 다시 묶으므로 제목은 바뀌지 않는다. "
           + "제목 문항이 주제 문항과 다른 지점을 보여주기에 가장 좋은 지문. 정답 ②가 'Cash or Soul?'이라는 "
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

  lead: {to:3,
    note:"①은 용어 정의라 방향이 없다. ②의 casting aside absolute standards와 "
       + "③의 the end justifies the means까지 가야 '결과 우선'이라는 방향이 잡힘",
    why:"①은 <b>정의문</b>이라 방향이 안 보인다. <b>③번까지</b> 읽어라."},
  key:  "<b class=w>Situational ethics</b> — 상황을 따져 판단하는 윤리",
  attr: "<b class=w>casting aside absolute moral standards</b> ② / <b class=w>the end justifies the means</b> ③<br>— 절대 기준을 치우고 결과로 판단",
  dir:  "긍정",
  dirWord: "<b class=w>what matters is the outcome or consequences</b> ③ — 결과 우선이 글의 방향",

  skip: [
    {n:2, head:"Supporters of this theory willingly permit...", skip:false},
    {n:3, head:"In the absence of a universal standard...", skip:false},
    {n:4, head:"Possibly the following contrasting realities...", skip:false},
    {n:5, head:"In a <b>pickup game of basketball</b> played among friends...", skip:true,
     why:"구체적 장면(친구들끼리 하는 농구) - 앞말을 보여주는 예시"},
    {n:6, head:"Caring about one\u2019s friends and maybe getting to keep...", skip:false},
    {n:7, head:"But, once an organized game is played...", skip:false},
    {n:8, head:"Situational ethics has been extended...", skip:false}
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
  key: "<b class=w>school clubs</b> — 동아리 개설",
  attr: "<b class=w>submit a proposal for a new club</b> ⑥ — 제안서를 내라",
  dir: "긍정",
  ans: 2,
  fastWhy: "⑥ <b class=w>Therefore, I am encouraging you to submit a proposal</b>. 목적문은 거의 항상 "
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
  moodPivot: "<b class=w>Suddenly</b> ⑥",
  fastWhy: "앞 <b class=w>Uncertain · awkwardly · unsure</b> (혼란) → 뒤 <b class=w>smiled brightly · At last · finally found</b> (만족). "
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
  key: "<b class=w>modern musical lyricists</b> — 작사가의 언어·문학 기여",
  attr: "<b class=w>has repeatedly failed to recognize</b> ① — 학계가 계속 인정하지 않아 왔다",
  dir: "부정",
  ans: 2,
  fastWhy: "①번 문장에서 이미 소재(작사가의 기여)와 방향(−, 인정받지 못함)이 다 나온다. "
         + "마지막 <b class=w>must be recognized</b>가 확인 사살. 주장 문항은 첫 문장 + must/should 문장 두 개면 끝.",
  teachNote: "속독 훈련의 표본. STEP 1만으로 ①에서 답이 잡히고, 중간 ③④는 근거라 건너뛰어도 된다. "
         + "첫 시간에 이 지문으로 '다 읽지 않아도 된다'를 체감시킬 것."
},

/* ===== 장문 =================================================== */
{
  id: "s26_4142_dress",
  src: "2026수능 41-42번", qnum: 41, qlabel: "41-42번", qtype: "장문",
  qtext: "윗글의 제목으로 가장 적절한 것은? [3점]",
  star: 3, time: 180,
  note: "* garment: 의복",

  sents: [
    "There is an obvious problem with the history of dress in all of its displays and that is, although textiles survive from early periods and cultures of recorded history, actual garments do not provide an uninterrupted flow of evidence across the same long time-span.",
    "Therefore, to give the study of dress equal significance to other areas such as architecture, painting, prints, drawings and sculpture, it was <u class=\"n1\">inevitable</u> that these other areas would provide much of the source material.",
    "The history of surviving dress really only starts in the 17th century, and like all artefacts described as fine or decorative art, is a highly visual subject.",
    "However, unlike most of the categories of collection and study that make up those areas, it is fluid rather than static.",
    "Garments should be seen in <u class=\"n2\">movement</u> on a human body, not frozen on a display figure.",
    "This is one of the many difficulties when curating collections of costume and also why some modern writers find costume collections physically and intellectually <u class=\"n3\">lifeless</u>.",
    "Fortunately, in the period after 1660, when more items of dress survive to enrich our understanding of the history of the subject, there are also many painted, printed, photographed and filmed sources of evidence of people in clothing, caught in movement.",
    "Often a variety of different types of illustrative examples will <u class=\"n4\">provide</u> evidence about how a garment was worn within the period in which it was made.",
    "Without the information contained in art in all of its forms, from drawing to sculpture, it is <u class=\"n5\">unlikely</u> that displays of historic dress would be awkward imitations of the intentions of their original makers and owners."
  ],

  ans42: 5,   // ⚠️ 41-42는 문항이 둘. ans=41번(제목) 정답, ans42=42번(어휘) 정답
  choices: [
    "Dress as Visual Arts: Record What You Wear Now!",
    "Visual Sources: Filling in the Gaps of Dress History",
    "Why Do Collectors Want the Unknown Dresses of History?",
    "Dress Culture: Searching for the Origin of Human Clothing",
    "Seeing Is Believing! Importance of Illustration in Dress Design"
  ],
  ans: 2,

  lead: {to:2,
    note:"1번이 문제 제기(의복 증거가 끊긴다), 2번이 그래서 다른 분야가 자료를 댄다는 해법. 두 문장이 한 덩어리",
    why:"1번은 <b>문제 제기</b>만 한다. 2번의 <b>Therefore</b>까지 읽어야 방향이 보인다."},
  key:  "<b class=w>the history of dress</b> - 의복사 연구의 자료 문제",
  attr: "<b class=w>actual garments do not provide an uninterrupted flow of evidence</b> (1)<br>- 실물 의복만으로는 증거가 끊긴다",
  dir:  "부정",
  dirWord: "<b class=w>an obvious problem</b> (1) - 대놓고 problem이라 했으니 부정. 뒤에 해법이 온다",

  skip: [
    {n:2, head:"Therefore, to give the study of dress equal significance...", skip:false},
    {n:3, head:"The history of surviving dress really only starts in the <b>17th century</b>...", skip:true,
     why:"<b>연도</b>(17th century) - 배경 정보"},
    {n:4, head:"However, unlike most of the categories...", skip:false},
    {n:5, head:"Garments should be seen in movement...", skip:false},
    {n:6, head:"This is one of the many difficulties...", skip:false},
    {n:7, head:"Fortunately, in the period after <b>1660</b>...", skip:false,
     why:"연도가 있지만 <b>Fortunately</b>가 전환 신호 - 표지가 겹치면 읽는다"},
    {n:8, head:"Often a variety of different types...", skip:false},
    {n:9, head:"Without the information contained in art...", skip:false}
  ],


  trunk1: "문제 - 실물 의복만으로는 증거가 끊긴다",
  trunk2: "해법 - 그림·사진이 그 빈틈을 메운다",
  pivotAt: 7,

  tree: [
    {n:1, lb:"주제도입",   head:true,  txt:"의복사에는 명백한 문제 - 실물 의복의 증거가 끊긴다"},
    {n:2, lb:"주장",       head:true,  txt:"그래서 건축·회화 등 다른 분야가 자료를 대는 게 불가피했다"},
    {n:3, lb:"부연",       head:false, txt:"남아 있는 의복사는 17세기부터. 시각적 주제다"},
    {n:4, lb:"부연",       head:false, txt:"다만 다른 분야와 달리 의복은 고정이 아니라 유동적"},
    {n:5, lb:"부연",       head:false, txt:"몸 위에서 움직이는 상태로 봐야 한다"},
    {n:6, lb:"근거",       head:false, txt:"그래서 전시가 어렵고, 생기 없다는 말을 듣는다"},
    {n:7, lb:"대조·반전",  head:true,  txt:"다행히 1660년 이후엔 움직임을 담은 그림·사진 자료가 많다"},
    {n:8, lb:"부연",       head:false, txt:"그 예시들이 옷을 어떻게 입었는지 증거를 준다"},
    {n:9, lb:"재진술",     head:true,  txt:"예술 속 정보가 없었다면 역사 의복 전시는 어설픈 흉내가 됐을 것"}
  ],

  pivot: {sig:"Fortunately", at:7, from:"증거가 끊기고 전시도 어렵다(문제)", to:"그림·사진이 빈틈을 메운다(해법)"},
  pivotSub: "4번의 <b>However</b>는 줄기를 바꾸지 않는다 - 문제를 더 파고드는 딸림. "
          + "진짜 전환은 7번의 <b>Fortunately</b>. <u>However가 늘 전환점은 아니다</u>는 것을 보여주는 지문.",

  vocab: [
    {n:1, word:"inevitable", ok:true,
     why:"실물 증거가 끊기니 다른 분야에 기댈 수밖에 - '불가피'가 맞음"},
    {n:2, word:"movement",   ok:true,
     why:"fluid rather than static과 순행. 몸 위 '움직임'으로 봐야 한다"},
    {n:3, word:"lifeless",   ok:true,
     why:"마네킹에 얼어붙은 상태 = '생기 없다'. 앞 문장과 순행"},
    {n:4, word:"provide",    ok:true,
     why:"7번의 '자료가 많다'를 이어받아 증거를 '준다'"},
    {n:5, word:"unlikely",   ok:false, fix:"likely",
     why:"예술 정보가 <b>없었다면</b> 전시가 어설픈 흉내가 <b>됐을 것</b>이라는 뜻. Without 가정문이라 방향이 뒤집힘"}
  ],

  gist: "의복사는 실물 증거가 끊기지만, 그림·사진 등 시각 자료가 그 빈틈을 메워준다.",
  wrong: {
    "1": "지금 옷을 기록하라는 실천 제안이 아님",
    "3": "수집가의 욕망을 다룬 글이 아님",
    "4": "의복의 기원 탐색이 아님 - 자료 문제를 다룸",
    "5": "의복 '디자인'에서 삽화의 중요성이 아니라 '역사 연구'의 자료 문제"
  },
  wrongNote: "제목에 <b>Gaps</b>(빈틈)와 <b>Filling in</b>(메우기)이 둘 다 들어간 2번만 두 줄기를 다 담는다.",

  teachNote: "42번(어휘)이 붙은 장문이라 STEP 8까지 다 쓴다. 5번 unlikely는 <b>Without 가정문</b>이 방향을 뒤집는 자리라 "
           + "3등급이 가장 많이 놓친다. '없었다면 ~했을 것'을 우리말로 옮겨보게 할 것. "
           + "4번 However를 전환점으로 잘못 잡는 학생이 많으니 STEP 4에서 반드시 확인."
},

{
  id: "s26_4345_mia",
  src: "2026수능 43-45번", qnum: 43, qlabel: "43-45번", qtype: "장문 배열",
  star: 2, time: 150,
  note: "",

  paras: [
    {tag:"A",
     text:"\u201cMia, let\u2019s go walk our dog!\u201d Julia called out, but there was no answer. She checked her daughter\u2019s room and found that Mia was absorbed in her smartphone, wearing her earbuds. Julia was concerned about her daughter. She turned to her husband, Sam. \u201cMia seems to live inside her phone, not with us.\u201d Sam nodded, \u201cI know. I feel like <u class=\"n1\">(a) she</u> is growing distant from us. Why don\u2019t we set up a family reading club?\u201d Julia brightened at the suggestion, and Sam promised to talk with Mia about it.",
     gist:"Julia가 스마트폰에 빠진 Mia를 걱정 → Sam이 독서 모임 제안",
     cue:"주어진 글. 모든 일의 출발"},
    {tag:"B",
     text:"Mia\u2019s family held their first book club meeting on Saturday afternoon. Everyone enjoyed the book Mia had chosen. Julia was the first to speak: \u201cDr. Duvall nearly invented a drug for eternal life, yet disappeared one day and ended up running Caf\u00e9 Paris. That\u2019s such a mystery.\u201d Mia responded, her eyes bright, and Sam listened to <u class=\"n2\">(b) his daughter</u>, and their conversation grew lively. During the discussion, Mia felt reconnected with her parents and already looked forward to their next book club meeting.",
     gist:"첫 모임 - Mia가 고른 책으로 대화, 가족과 다시 이어짐",
     cue:"결말. <b>first book club meeting</b>이라 책을 고른 뒤"},
    {tag:"C",
     text:"At the library, Mia scanned the shelves for nearly an hour, feeling lost among the endless titles. Then, a librarian approached and asked, \u201cLooking for something in particular?\u201d \u201cI need a book for my family\u2019s reading club,\u201d Mia admitted. \u201cWhat genre do you enjoy?\u201d she asked kindly. \u201cHmm, I like mysteries,\u201d Mia replied. The librarian handed her a book titled <i>Caf\u00e9 Paris</i> and said with a smile, \u201cYou\u2019ll love this one.\u201d Mia thanked <u class=\"n3\">(c) her</u> and checked it out.",
     gist:"도서관에서 사서 도움으로 <i>Caf\u00e9 Paris</i>를 고름",
     cue:"승낙 뒤, 모임 전. <b>이미 reading club이 정해진 상태</b>"},
    {tag:"D",
     text:"When Sam suggested starting a family reading club, Mia immediately shook her head and said, \u201cNo, Dad. I don\u2019t have time to read books. You know how busy <u class=\"n4\">(d) I</u> am with exams all semester.\u201d He didn\u2019t give up. \u201cBut wouldn\u2019t it be fun if we all read the same story and shared our thoughts? You could simply read for 20 minutes, maybe during your lunch break.\u201d After some persuasion, Mia reluctantly agreed. Deep down, <u class=\"n5\">(e) she</u> knew she was spending too much time on her phone. So she asked, \u201cDad, can I choose the first book?\u201d Sam gladly said, \u201cYes.\u201d",
     gist:"Sam이 제안 → Mia 거절 → 설득 끝에 승낙, 책 고르기를 자청",
     cue:"(A)의 <b>promised to talk with Mia</b>를 바로 받음"}
  ],

  orderAns: ["D","C","B"],
  ans43: 5,
  orderWhy: "(A) 제안하기로 함 → (D) 실제로 제안·승낙 → (C) 책 고름 → (B) 첫 모임. 시간 순서 그대로",

  refs: [
    {tag:"a", word:"she",          who:"Mia",           why:"Sam이 '우리와 멀어진다'고 말하는 대상 = 딸"},
    {tag:"b", word:"his daughter", who:"Mia",           why:"Sam의 딸"},
    {tag:"c", word:"her",          who:"the librarian", why:"Mia가 <b>감사한</b> 대상 = 책을 건넨 사서"},
    {tag:"d", word:"I",            who:"Mia",           why:"Mia가 아빠에게 하는 말 속의 '나'"},
    {tag:"e", word:"she",          who:"Mia",           why:"속으로 폰을 너무 많이 본다고 느낀 사람"}
  ],
  refOdd: "the librarian",
  ans44: 3,

  ans45: 5,
  why45: "(D)에서 Mia는 <b class=w>immediately shook her head</b>로 <b>거절</b>했다가 설득 끝에 마지못해 승낙 - '처음부터 환영'은 반대",

  teachNote: "43~45는 <b>흐름 트리를 그리지 않는다.</b> 시간 순서와 지칭만 따라가면 3문항이 한꺼번에 풀린다. "
           + "속독 병행 훈련(10월)의 주력 유형이므로 여기서 '단락 첫 문장만 보고 순서 잡기'를 반드시 몸에 붙일 것. "
           + "44번은 <b>(c) her</b>가 사서인 것만 잡으면 끝 - 나머지 넷은 다 Mia다. "
           + "45번은 선택지를 먼저 읽고 단락을 훑는 순서로 지도할 것."
},

/* ===== 2025수능 ============================================== */
{
  id: "s25_23_industrial",
  src: "2025수능 23번", qnum: 23, qtype: "주제",
  qtext: "다음 글의 주제로 가장 적절한 것은?",
  star: 2, time: 60,
  note: "* widget: 제품",

  sents: [
    "The arrival of the Industrial Age changed the relationship among time, labor, and capital.",
    "Factories could produce around the clock, and they could do so with greater speed and volume than ever before.",
    "A machine that runs twelve hours a day will produce more widgets than one that runs for only eight hours per day — and a machine that runs twenty-four hours per day will produce the most widgets of all.",
    "As such, at many factories, the workday is divided into eight-hour shifts, so that there will always be people on hand to keep the widget machines humming.",
    "Industrialization raised the potential value of every single work hour — the more hours you worked, the more widgets you produced, and the more money you made — and thus wages became tied to effort and production.",
    "Labor, previously guided by harvest cycles, became clock-oriented, and society started to reorganize around new principles of productivity."
  ],
  choices: [
    "shift in the work-time paradigm brought about by industrialization",
    "effects of standardizing production procedures on labor markets",
    "influence of industrialization on the machine-human relationship",
    "efficient ways to increase the value of time in the Industrial Age",
    "problems that excessive work hours have caused for laborers"
  ],
  ans: 1,

  lead: {to:1, note:"1번에 소재와 속성이 다 있다. changed가 방향까지 잡아준다"},
  key:  "<b class=w>the Industrial Age</b> - 시간·노동·자본의 관계",
  attr: "<b class=w>changed the relationship among time, labor, and capital</b> (1) - 셋의 관계를 바꿨다",
  dir:  "긍정",
  dirWord: "<b class=w>changed</b> (1) - 무엇이 어떻게 바뀌었는지가 끝까지 이어진다. 전환 없음",

  skip: [
    {n:2, head:"Factories could produce around the clock...", skip:false},
    {n:3, head:"A machine that runs <b>twelve hours</b> a day...", skip:true,
     why:"<b>숫자</b>(twelve / eight / twenty-four) - 앞말을 숫자로 다시 설명"},
    {n:4, head:"As such, at many factories, the workday...", skip:false},
    {n:5, head:"Industrialization raised the potential value...", skip:false},
    {n:6, head:"Labor, previously guided by harvest cycles...", skip:false}
  ],

  trunk1: "산업화가 시간·노동·자본의 관계를 바꿨다 - 한 방향",
  trunk2: "",
  pivotAt: 0,

  tree: [
    {n:1, lb:"주제도입", head:true,  txt:"산업화가 시간·노동·자본의 관계를 바꿨다"},
    {n:2, lb:"부연",     head:false, to:1, txt:"공장은 24시간 더 빠르고 많이 생산할 수 있게 됨"},
    {n:3, lb:"예시",     head:false, to:2, txt:"12시간 > 8시간, 24시간이 가장 많이 생산 (숫자 예시)"},
    {n:4, lb:"근거",     head:false, to:2, txt:"그래서 8시간 교대제가 생김"},
    {n:5, lb:"주장",     head:true,  txt:"산업화가 노동 1시간의 가치를 올렸고 임금이 노력·생산에 묶임"},
    {n:6, lb:"재진술",   head:true,  txt:"수확 주기를 따르던 노동이 시계 중심이 되고 사회가 재편됨"}
  ],

  pivot: {sig:"없음", at:0, from:"이 글에는 흐름 전환이 없다", to:"1번의 방향이 6번까지 그대로 간다"},
  pivotSub: "However·But이 하나도 없다. <b>As such</b>(4) <b>and thus</b>(5)는 전환이 아니라 <u>인과 연결</u>이다. "
          + "'그래서 그래서'로 이어지는 글은 전환점이 없다.",

  gist: "산업화로 시간이 노동·임금의 기준이 되면서 일하는 시간의 개념이 바뀌었다.",
  wrong: {
    "2": "생산 절차 '표준화'가 아니라 시간 개념의 변화",
    "3": "기계와 인간의 관계가 아니라 시간과 노동의 관계",
    "4": "시간 가치를 높이는 '방법'을 알려주는 글이 아님",
    "5": "장시간 노동의 '문제'를 지적하는 글이 아님 - 서술일 뿐"
  },
  wrongNote: "④⑤가 함정. 지문에 나온 소재(시간의 가치, 긴 노동시간)를 쓰지만 <b>글의 태도가 다르다</b>. 이 글은 비판하지 않고 설명만 한다.",

  teachNote: "전환점이 없는 글의 표본. 21번(2026)과 묶어서 <b>'전환 없는 글'</b>을 가르치기 좋다. "
           + "그리고 3번 문장이 숫자 예시라 건너뛰기 훈련에 딱 맞는다 - 12/8/24를 계산하려 드는 학생이 여기서 시간을 버린다."
},

{
  id: "s25_24_selfie",
  src: "2025수능 24번", qnum: 24, qtype: "제목",
  qtext: "다음 글의 제목으로 가장 적절한 것은?",
  star: 2, time: 65,
  note: "* resonate: 공명(共鳴)하다  ** depict: 그리다",

  sents: [
    "The selfie resonates not because it is new, but because it expresses, develops, expands, and intensifies the long history of the self-portrait.",
    "The self-portrait showed to others the status of the person depicted.",
    "In this sense, what we have come to call our own \u201cimage\u201d — the interface of the way we think we look and the way others see us — is the first and fundamental object of global visual culture.",
    "The selfie depicts the drama of our own daily performance of ourselves in tension with our inner emotions that may or may not be expressed as we wish.",
    "At each stage of the self-portrait\u2019s expansion, more and more people have been able to depict themselves.",
    "Today\u2019s young, urban, networked majority has reworked the history of the self-portrait to make the selfie into the first visual signature of the new era."
  ],
  choices: [
    "Are Selfies Just a Temporary Trend in Art History?",
    "Fantasy or Reality: Your Selfie Is Not the Real You",
    "The Selfie: A Symbol of Self-oriented Global Culture",
    "The End of Self-portraits: How Selfies Are Taking Over",
    "Selfies, the Latest Innovation in Representing Ourselves"
  ],
  ans: 5,

  lead: {to:1,
    note:"1번의 not A but B 구조에 소재·속성·방향이 다 들어 있다. B쪽(자화상의 역사를 잇는다)이 글의 방향",
    why:"1번의 <b>not ~ but ~</b>을 놓치지 마라. <b>but 뒤</b>가 필자의 주장이다."},
  key:  "<b class=w>The selfie</b> + <b class=w>the long history of the self-portrait</b> - 셀피와 자화상의 역사",
  attr: "<b class=w>not because it is new, but because it expresses... the long history of the self-portrait</b> (1)<br>- 새로워서가 아니라 자화상의 역사를 잇기 때문",
  dir:  "긍정",
  dirWord: "<b class=w>not because it is new, but because...</b> (1) - not A but B에서 <b>B가 방향</b>",

  skip: [
    {n:2, head:"The self-portrait showed to others...", skip:false},
    {n:3, head:"In this sense, what we have come to call...", skip:false},
    {n:4, head:"The selfie depicts the drama...", skip:false},
    {n:5, head:"At each stage of the self-portrait\u2019s expansion...", skip:false},
    {n:6, head:"Today\u2019s young, urban, networked majority...", skip:false}
  ],

  trunk1: "셀피는 자화상의 역사를 잇고 확장한 것 - 한 방향",
  trunk2: "",
  pivotAt: 0,

  tree: [
    {n:1, lb:"주제도입", head:true,  txt:"셀피가 울림을 주는 이유 - 새로워서가 아니라 자화상의 역사를 확장하기 때문"},
    {n:2, lb:"부연",     head:false, to:1, txt:"자화상은 그려진 사람의 지위를 남에게 보여줬다"},
    {n:3, lb:"부연",     head:false, to:2, txt:"그래서 '이미지'는 시각문화의 근본 대상이 된다"},
    {n:4, lb:"부연",     head:false, to:1, txt:"셀피는 겉으로 보이는 나와 속마음의 긴장을 그린다"},
    {n:5, lb:"근거",     head:false, to:1, txt:"자화상이 확장될 때마다 더 많은 사람이 자기를 그릴 수 있게 됐다"},
    {n:6, lb:"재진술",   head:true,  txt:"오늘의 다수가 자화상의 역사를 새로 써서 셀피를 새 시대의 첫 시각적 서명으로 만들었다"}
  ],

  pivot: {sig:"없음", at:0, from:"이 글에는 흐름 전환이 없다", to:"1번의 방향이 6번까지 그대로 간다"},
  pivotSub: "1번의 <b>not A but B</b>가 전환처럼 보이지만 <u>한 문장 안</u>에서 끝난다. "
          + "이런 건 줄기를 나누는 전환이 아니라 <b>방향을 정하는 장치</b>다.",

  gist: "셀피는 자화상의 오랜 역사를 이어받아 확장한, 우리를 표현하는 가장 최근의 방식이다.",
  wrong: {
    "1": "일시적 유행이냐고 묻는 글이 아님 - 오히려 역사를 잇는다고 함",
    "2": "진짜 나냐 아니냐를 따지는 글이 아님. 4번의 소재를 제목으로 오인",
    "3": "'자기중심적 문화의 상징'이라는 비판이 없음 - 방향이 다름",
    "4": "자화상의 <b>끝</b>이 아니라 <b>연장</b>. 1번의 not A but B를 정반대로 읽은 답"
  },
  wrongNote: "④가 최대 함정. 1번을 대충 읽으면 '셀피가 자화상을 대체했다'로 오해한다. <b>not new but history</b>가 핵심.",

  teachNote: "not A but B가 방향을 정하는 유형. 전환점이 없는데도 1번 안에 대조가 있어서 학생이 헷갈린다. "
           + "STEP 4에서 '전환이 없다'에 표시하게 하고, <b>한 문장 안의 대조는 전환이 아니다</b>를 못 박을 것. "
           + "정답 ⑤의 the Latest Innovation이 1번의 not new와 충돌하는 것처럼 보이지만, "
           + "'새롭지 않다'는 것은 <u>역사와 단절되지 않았다</u>는 뜻이지 최신이 아니라는 뜻이 아니다."
},

{
  id: "s25_21_shadow",
  src: "2025수능 21번", qnum: 21, qtype: "함축",
  qtext: "밑줄 친 <b>hunting the shadow, not the substance</b>가 다음 글에서 의미하는 바로 가장 적절한 것은? [3점]",
  star: 3, time: 90,
  note: "",

  sents: [
    "The position of the architect rose during the Roman Empire, as architecture symbolically became a particularly important political statement.",
    "Cicero classed the architect with the physician and the teacher and Vitruvius spoke of \u201cso great a profession as this.\u201d",
    "Marcus Vitruvius Pollio, a practicing architect during the rule of Augustus Caesar, recognized that architecture requires both practical and theoretical knowledge, and he listed the disciplines he felt the aspiring architect should master: literature and writing, draftsmanship, mathematics, history, philosophy, music, medicine, law, and astronomy \u2014 a curriculum that still has much to recommend it.",
    "All of this study was necessary, he argued, because architects who have aimed at acquiring manual skill without scholarship have never been able to reach a position of authority to correspond to their plans, while those who have relied only upon theories and scholarship were obviously <u>\u201chunting the shadow, not the substance.\u201d</u>"
  ],
  choices: [
    "seeking abstract knowledge emphasized by architectural tradition",
    "discounting the subjects necessary to achieve architectural goals",
    "pursuing the ideals of architecture without the practical skills",
    "prioritizing architecture\u2019s material aspects over its artistic ones",
    "following historical precedents without regard to current standards"
  ],
  ans: 3,

  lead: {to:3,
    note:"1번은 배경(건축가의 지위 상승), 2번은 인용 예시. 3번의 <b>both practical and theoretical</b>이 이 글의 축이다",
    why:"1·2번은 배경과 예시다. <b>3번의 both A and B</b>까지 읽어야 축이 보인다."},
  key:  "<b class=w>architecture requires both practical and theoretical knowledge</b> (3) - 실무와 이론 둘 다",
  attr: "둘 중 <b>하나만</b> 가진 건축가는 실패한다",
  dir:  "긍정",
  dirWord: "<b class=w>both practical and theoretical</b> (3) - 이항대립. 어느 한쪽만으로는 안 된다는 방향",

  skip: [
    {n:2, head:"<b>Cicero</b> classed the architect... and <b>Vitruvius</b> spoke of...", skip:true,
     why:"<b>고유명사</b>(Cicero, Vitruvius) - 지위가 높았다는 것을 보여주는 인용 예시"},
    {n:3, head:"<b>Marcus Vitruvius Pollio</b>, a practicing architect during the rule of <b>Augustus Caesar</b>...", skip:false,
     why:"고유명사가 있지만 여기서 <b>글의 축(both A and B)</b>이 나온다 - 이름 뒤를 봐야 한다"},
    {n:4, head:"All of this study was necessary, he argued, because...", skip:false}
  ],

  trunk1: "건축가는 실무와 이론을 둘 다 갖춰야 한다 - 한 방향",
  trunk2: "",
  pivotAt: 0,

  tree: [
    {n:1, lb:"주제도입", head:true,  txt:"로마 시대에 건축가의 지위가 올라갔다 (배경)"},
    {n:2, lb:"예시",     head:false, to:1, txt:"Cicero와 Vitruvius의 말 - 지위가 높았다는 증거"},
    {n:3, lb:"주장",     head:true,  txt:"건축은 <b>실무 지식과 이론 지식 둘 다</b> 필요하다 - 글의 축"},
    {n:4, lb:"근거",     head:false, to:3, txt:"실무만 있으면 권위를 못 얻고, 이론만 있으면 '그림자를 쫓는 것'"}
  ],

  pivot: {sig:"없음", at:0, from:"이 글에는 흐름 전환이 없다", to:"3번의 both A and B가 4번에서 두 경우로 나뉠 뿐"},
  pivotSub: "4번의 <b>while</b>은 전환이 아니라 <u>두 경우를 나란히 놓는 대조</u>다. "
          + "실무만 vs 이론만 - 둘 다 <b>같은 결론</b>(하나만으론 안 된다)으로 간다.",

  implied: {
    phrase: "hunting the shadow, not the substance",
    restateAt: [3, 4],
    model: "이론·학문만 붙들고 실무 기술이 없는 상태 - 실체 없이 그림자만 좇는 것"
  },

  gist: "건축가는 실무 기술과 이론 학문을 모두 갖춰야 하며, 어느 한쪽만으로는 부족하다.",
  wrong: {
    "1": "'건축 전통이 강조한' 추상 지식이 아님 - 전통 얘기가 없다",
    "2": "필요한 과목을 <b>무시</b>하는 게 아니라 이론만 <b>붙드는</b> 것",
    "4": "물질적 측면을 예술적 측면보다 앞세우는 것 - 방향이 정반대",
    "5": "역사적 선례를 따르는 것과 무관"
  },
  wrongNote: "④가 정반대 함정. shadow를 '실체 없는 것 = 물질이 아닌 것'까지는 갔는데, <b>어느 쪽이 shadow인지</b>를 뒤집어 읽은 답.",

  teachNote: "21번의 정석. shadow/substance를 사전 뜻으로 풀면 안 되고, <b>4번 문장 안에서 짝을 찾아야</b> 한다 - "
           + "while 앞이 실무만, 뒤가 이론만. 밑줄은 <u>뒤쪽</u>에 붙어 있다. "
           + "2번 문장(Cicero·Vitruvius)은 건너뛰어도 되지만 3번은 이름으로 시작해도 읽어야 한다는 것을 "
           + "<b>건너뛰기 규칙의 예외 훈련</b>으로 쓸 것 - 이름 뒤에 뭐가 오는지 보고 판단."
},

{
  id: "s25_22_emotion",
  src: "2025수능 22번", qnum: 22, qtype: "요지",
  qtext: "다음 글의 요지로 가장 적절한 것은?",
  star: 2, time: 60,
  note: "",

  sents: [
    "The ability to understand emotions \u2014 to have a diverse emotion vocabulary and to understand the causes and consequences of emotion \u2014 is particularly relevant in group settings.",
    "Individuals who are skilled in this domain are able to express emotions, feelings and moods accurately and thus, may facilitate clear communication between co-workers.",
    "Furthermore, they may be more likely to act in ways that accommodate their own needs as well as the needs of others (i.e. cooperate).",
    "In a group conflict situation, for example, a member with a strong ability to understand emotion will be able to express how he feels about the problem and why he feels this way.",
    "He also should be able to take the perspective of the other group members and understand why they are reacting in a certain manner.",
    "Appreciation of differences creates an arena for open communication and promotes constructive conflict resolution and improved group functioning."
  ],
  choices: [
    "집단 구성원 간 갈등 해소를 위해 감정 조절이 중요하다.",
    "감정 이해 능력은 집단 내 원활한 소통과 협력을 촉진한다.",
    "타인에 대한 공감 능력은 자신의 감정 표현 능력을 향상한다.",
    "감정 관련 어휘에 대한 지식은 공감 능력 발달의 기반이 된다.",
    "자신의 감정 상태에 대한 이해는 사회성 함양에 필수적 요소이다."
  ],
  ans: 2,

  lead: {to:1, note:"1번에 소재와 속성이 다 있다. 대시(\u2014) 사이는 소재를 풀어 쓴 것이라 건너뛰어도 된다"},
  key:  "<b class=w>The ability to understand emotions</b> - 감정을 이해하는 능력",
  attr: "<b class=w>is particularly relevant in group settings</b> (1) - 집단 상황에서 특히 중요하다",
  dir:  "긍정",
  dirWord: "<b class=w>particularly relevant</b> (1) - 중요하다는 긍정 방향이 끝까지 이어진다",

  skip: [
    {n:2, head:"Individuals who are skilled in this domain...", skip:false},
    {n:3, head:"Furthermore, they may be more likely to act...", skip:false},
    {n:4, head:"In a group conflict situation, <b>for example</b>...", skip:true,
     why:"<b>for example</b> - 앞말을 상황으로 보여주는 예시"},
    {n:5, head:"He also should be able to take the perspective...", skip:true,
     why:"4번 예시의 <b>연장</b>(He = 예시 속 인물) - 예시가 끝나는 곳까지 함께 건너뛴다"},
    {n:6, head:"Appreciation of differences creates an arena...", skip:false}
  ],

  trunk1: "감정 이해 능력이 집단에서 소통과 협력을 돕는다 - 한 방향",
  trunk2: "",
  pivotAt: 0,

  tree: [
    {n:1, lb:"주제도입", head:true,  txt:"감정 이해 능력은 집단 상황에서 특히 중요하다"},
    {n:2, lb:"근거",     head:false, to:1, txt:"감정을 정확히 표현해서 동료 간 소통을 원활하게 한다"},
    {n:3, lb:"근거",     head:false, to:1, txt:"게다가 자기 욕구와 타인 욕구를 함께 맞추는 협력을 한다"},
    {n:4, lb:"예시",     head:false, to:3, txt:"갈등 상황에서 자기 감정과 이유를 말할 수 있다"},
    {n:5, lb:"예시",     head:false, to:4, txt:"상대 입장에서 왜 그렇게 반응하는지도 이해한다"},
    {n:6, lb:"재진술",   head:true,  txt:"차이를 인정하면 열린 소통과 건설적 갈등 해결, 집단 기능 향상으로 이어진다"}
  ],

  pivot: {sig:"없음", at:0, from:"이 글에는 흐름 전환이 없다", to:"1번의 방향이 6번까지 그대로 간다"},
  pivotSub: "<b>Furthermore</b>(3)는 전환이 아니라 <u>같은 방향으로 하나 더 얹는</u> 신호다. "
          + "전환 신호(But·However)와 <b>덧붙임 신호</b>(Furthermore·Moreover·In addition)를 구별할 것.",

  gist: "감정을 이해하는 능력은 집단 안에서 소통을 원활하게 하고 협력을 이끌어낸다.",
  wrong: {
    "1": "'감정 조절'이 아니라 '감정 이해'. 갈등 해소는 6번의 결과 중 하나일 뿐",
    "3": "공감이 표현 능력을 향상시킨다는 인과가 없음 - 순서가 거꾸로",
    "4": "감정 어휘는 1번 대시 안의 <b>부분 소재</b>. 이걸 요지로 삼으면 안 됨",
    "5": "<b>자신의</b> 감정 이해가 아니라 감정 이해 능력 일반. '사회성 함양'도 지문에 없음"
  },
  wrongNote: "④가 전형적 함정. 1번의 대시(\u2014) 안에 나온 말을 요지로 오인한다. <b>대시 안은 소재 설명</b>이지 주장이 아니다.",

  teachNote: "건너뛰기 훈련에 좋다 - 4·5번이 한 덩어리 예시라 <b>예시가 어디서 끝나는지</b>를 가르칠 수 있다. "
           + "for example이 붙은 문장만 건너뛰고 5번을 읽는 학생이 많은데, He가 예시 속 인물이면 계속 예시다. "
           + "그리고 Furthermore를 전환으로 잡는 학생이 반드시 나온다 - STEP 4에서 '전환 없음'을 확인시킬 것."
},

{
  id: "s25_30_competition",
  src: "2025수능 30번", qnum: 30, qtype: "어휘",
  qtext: "다음 글의 밑줄 친 부분 중, 문맥상 낱말의 쓰임이 적절하지 <b>않은</b> 것은? [3점]",
  star: 3, time: 80,
  note: "* taint: 더럽히다  ** altruistic: 이타주의의",

  sents: [
    "Studies in psychology have reported cases in which competitive incentives resulted in lower task effort, and their focus was on the psychological underpinnings of the reduction in motivation.",
    "For example, competition presents an inevitable conflict between the motivation to achieve one\u2019s personal goal and the <u class=\"n1\">desire</u> to maintain good relationships with others.",
    "When the maintenance of interpersonal relationships is important, with their counterparts in particular or with others generally, competitors experience an <u class=\"n2\">internal</u> conflict that can harm their desire to achieve their goal and taint the good feeling brought about by winning.",
    "Exline and Lobel found that the perception of oneself as a target for upward social comparison often makes people <u class=\"n3\">uncomfortable</u>.",
    "When they believe that others are making envious comparisons with them, people feel uneasiness, distress, or sorrow.",
    "Feelings of guilt, an emotion generally associated with high motivation for goal-achievement, lead to <u class=\"n4\">stronger</u> motivation and performance in the pursuit of competitive goals.",
    "Consequences of this emotional state include lower task motivation in a competition and preferences for more cooperative and altruistic outcomes, such as <u class=\"n5\">diminishing</u> the significance of the outcome or sharing the winner\u2019s reward."
  ],
  choices: ["desire", "internal", "uncomfortable", "stronger", "diminishing"],
  ans: 4,

  lead: {to:1,
    note:"1번의 <b>lower task effort</b>와 <b>reduction in motivation</b>이 방향을 정한다. 경쟁이 동기를 <b>낮춘다</b>",
    why:"1번의 <b>lower</b>와 <b>reduction</b>을 잡아라. 이 글은 경쟁이 동기를 <b>떨어뜨린다</b>는 방향이다."},
  key:  "<b class=w>competitive incentives</b> - 경쟁이 동기에 미치는 영향",
  attr: "<b class=w>resulted in lower task effort</b> / <b class=w>the reduction in motivation</b> (1)<br>- 경쟁이 오히려 노력과 동기를 떨어뜨린다",
  dir:  "부정",
  dirWord: "<b class=w>lower</b> · <b class=w>reduction</b> (1) - 밑줄 5개를 전부 이 방향에 대보면 된다",

  skip: [
    {n:2, head:"<b>For example</b>, competition presents an inevitable conflict...", skip:true,
     why:"<b>For example</b> - 다만 <u>밑줄이 있으면 그 단어만은 확인</u>한다"},
    {n:3, head:"When the maintenance of interpersonal relationships...", skip:false},
    {n:4, head:"<b>Exline and Lobel</b> found that...", skip:true,
     why:"<b>고유명사</b>(연구자 이름) - 연구 인용은 앞말을 뒷받침하는 예시"},
    {n:5, head:"When they believe that others are making envious...", skip:false},
    {n:6, head:"Feelings of guilt, an emotion generally associated...", skip:false},
    {n:7, head:"Consequences of this emotional state include...", skip:false}
  ],

  trunk1: "경쟁이 동기를 떨어뜨린다 - 한 방향",
  trunk2: "",
  pivotAt: 0,

  tree: [
    {n:1, lb:"주제도입", head:true,  txt:"경쟁 유인이 오히려 과제 노력을 떨어뜨린다는 연구들"},
    {n:2, lb:"예시",     head:false, to:1, txt:"개인 목표 달성 동기와 관계 유지 욕구가 충돌한다"},
    {n:3, lb:"부연",     head:false, to:2, txt:"관계가 중요할 때 내적 갈등이 생겨 목표 의욕과 승리의 기쁨을 해친다"},
    {n:4, lb:"근거",     head:false, to:3, txt:"비교 대상이 되면 불편해진다는 연구 (Exline and Lobel)"},
    {n:5, lb:"부연",     head:false, to:4, txt:"남이 시샘하며 비교한다고 느끼면 불안·괴로움·슬픔을 느낀다"},
    {n:6, lb:"주장",     head:true,  txt:"죄책감은 경쟁 목표 추구에서 동기와 수행을 <b>떨어뜨린다</b>"},
    {n:7, lb:"재진술",   head:true,  txt:"그 결과 과제 동기가 낮아지고 협력적·이타적 결과를 선호하게 된다"}
  ],

  pivot: {sig:"없음", at:0, from:"이 글에는 흐름 전환이 없다", to:"1번의 부정 방향이 7번까지 그대로 간다"},
  pivotSub: "전환이 없다는 것이 <b>30번 풀이의 열쇠</b>다. 방향이 한 번도 안 바뀌므로 "
          + "밑줄 5개가 모두 같은 방향이어야 하고, <u>혼자 반대인 것</u>이 답이다.",

  vocab: [
    {n:1, word:"desire",        ok:true,
     why:"관계를 유지하려는 '욕구'가 목표 달성 동기와 충돌한다 - 자연스러움"},
    {n:2, word:"internal",      ok:true,
     why:"두 동기가 마음 안에서 부딪치므로 '내적' 갈등이 맞다"},
    {n:3, word:"uncomfortable", ok:true,
     why:"5번의 uneasiness·distress·sorrow와 순행"},
    {n:4, word:"stronger",      ok:false, fix:"lower / weaker",
     why:"7번이 <b>lower task motivation</b>이라고 못 박는다. 죄책감이 동기를 <b>떨어뜨리는</b> 흐름인데 혼자 '더 강한'이라 방향이 뒤집힘"},
    {n:5, word:"diminishing",   ok:true,
     why:"협력적·이타적 결과의 예 - 결과의 중요성을 '축소'하거나 보상을 나눈다"}
  ],

  gist: "경쟁은 관계 유지 욕구·죄책감과 충돌하여 오히려 과제 동기를 떨어뜨린다.",
  wrong: {},
  wrongNote: "④만 방향이 반대. 나머지 넷은 모두 '경쟁이 동기를 떨어뜨린다'와 순행한다.",

  teachNote: "④의 앞뒤 문장이 <b>an emotion generally associated with high motivation</b>이라 "
           + "'high'에 끌려 stronger를 자연스럽게 읽는 학생이 많다. 삽입구는 죄책감의 <u>일반적 성격</u>일 뿐이고, "
           + "이 글에서는 7번이 lower라고 못 박는다는 것을 짚을 것. "
           + "<b>글 전체 방향 &gt; 바로 앞 단어</b>라는 30번의 원칙을 각인시키기에 최적."
}

];
