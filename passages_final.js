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
},

/* ===== 2025수능 속독 (18·19·20) ===== */
{
  id: "s25_18_marathon",
  src: "2025수능 18번", qnum: 18, qtype: "목적",
  qtext: "다음 글의 목적으로 가장 적절한 것은?",
  star: 1, time: 40,
  fast: true,

  sents: [
    "Dear Rosydale City Marathon Racers,",
    "We are really grateful to all of you who have signed up for the 10th Rosydale City Marathon that was scheduled for this coming Saturday at 10 a.m.",
    "Unfortunately, as you may already know, the weather forecast says that there is going to be a downpour throughout the race day.",
    "We truly hoped that the race would go smoothly.",
    "However, it is likely that the heavy rain will make the roads too slippery and dangerous for the racers to run safely.",
    "As a result, we have decided to cancel the race.",
    "We hope you understand and we promise to hold another race in the near future.",
    "Sincerely, Martha Kingsley, Race Manager"
  ],
  choices: [
    "마라톤 경기 취소 사실을 공지하려고",
    "마라톤 경기 사전 행사 참여를 독려하려고",
    "마라톤 경기 참가비 환불 절차를 설명하려고",
    "마라톤 경기 참여 시 규칙 준수를 당부하려고",
    "마라톤 경기 진행에 따른 도로 통제를 안내하려고"
  ],
  ans: 1,
  key: "<b class=w>Rosydale City Marathon</b> - 마라톤 대회",
  attr: "<b class=w>we have decided to cancel the race</b> (6) - 경기를 취소하기로 했다",
  dir: "부정",
  fastWhy: "6번 <b class=w>As a result, we have decided to cancel the race</b>. "
         + "목적문은 <b>As a result / Therefore</b> 뒤의 결정 동사에 있다. 앞 5문장은 사정 설명이라 안 읽어도 된다.",
  teachNote: "2026-18번(Therefore + 요청)과 같은 구조. <b>맨 끝에서 두세 번째 문장</b>부터 읽는 습관을 여기서 굳힐 것. "
           + "다만 Unfortunately(3)·However(5)가 있어 학생이 중간에 멈추기 쉽다 - 그것들은 <u>사정 설명</u>이고 결론은 6번이다."
},

{
  id: "s25_19_peter",
  src: "2025수능 19번", qnum: 19, qtype: "심경",
  qtext: "다음 글에 드러난 Peter의 심경 변화로 가장 적절한 것은?",
  star: 1, time: 45,
  fast: true, fastMode: "mood",

  sents: [
    "It was Valentine\u2019s Day on Friday and Peter was certain that his wife, Amy, was going to love his surprise.",
    "Peter had spent a long time searching online for an event that would be a new way to spend time with Amy.",
    "He had finally found the perfect thing for her.",
    "She often told him that she liked to go to places she had never visited before, and he was absolutely sure that she would love going to the new, five-star restaurant downtown.",
    "He smiled as he called the restaurant and asked for a reservation for Friday.",
    "Unfortunately, his smile quickly disappeared when he was told that the restaurant was fully reserved.",
    "\u201cThat\u2019s too bad,\u201d he said quietly. \u201cI thought that I had found the right place.\u201d"
  ],
  choices: [
    "relaxed → indifferent",
    "confident → disappointed",
    "confused → satisfied",
    "jealous → discouraged",
    "embarrassed → joyful"
  ],
  ans: 2,
  moodPivot: "<b class=w>Unfortunately</b> (6)",
  fastWhy: "앞 <b class=w>was certain · perfect · absolutely sure · smiled</b> (자신감) → "
         + "뒤 <b class=w>smile quickly disappeared · That\u2019s too bad</b> (실망). 전환은 6번 <b>Unfortunately</b>.",
  teachNote: "2026-19번의 Suddenly와 짝. 심경 전환 신호어 <b>Unfortunately · Suddenly · However · But</b>을 "
           + "여기서 목록으로 정리해 줄 것. 선택지를 먼저 보고 <u>앞 감정</u>만 훑으면 20초에 끝난다."
},

{
  id: "s25_20_games",
  src: "2025수능 20번", qnum: 20, qtype: "주장",
  qtext: "다음 글에서 필자가 주장하는 바로 가장 적절한 것은?",
  star: 1, time: 50,
  fast: true,

  sents: [
    "We almost universally accept that playing video games is at best a pleasant break from a student\u2019s learning and more often what prevents a student from accomplishing their goals.",
    "Games catch and hold attention in a way that few things can.",
    "And yet once they have our focus, they rarely seem to offer anything meaningful to help students grow in their lives outside the games.",
    "While this may be true for many games, we are too easily ignoring a valuable tool that could be used to enhance productivity instead of derailing it.",
    "Rather, it is desirable that we develop games that connect to the learning outcomes we want for our students.",
    "This will enable educators to take advantage of games\u2019 attention commanding capacities and allow our students to enjoy their games while learning."
  ],
  choices: [
    "학습 효과 증진에 활용될 수 있는 게임을 개발해야 한다.",
    "교육 현장에서 학습과 게임 활동을 적절하게 분배해야 한다.",
    "학습 활동에 게임이 초래하는 집중력 저하를 경계해야 한다.",
    "여가 시간에 게임을 활용함으로써 학습 효율을 향상해야 한다.",
    "게임의 부정적 영향을 줄이기 위해 학습 공동체가 노력해야 한다."
  ],
  ans: 1,
  key: "<b class=w>playing video games</b> + 학습 - 게임을 학습에 쓸 수 있나",
  attr: "<b class=w>We almost universally accept that... prevents a student from accomplishing their goals</b> (1)<br>- 게임이 학습을 방해한다는 <b>통념</b>",
  dir: "통념",
  fastWhy: "1번 <b class=w>We almost universally accept</b>가 <b>통념 신호</b>. 4번 <b class=w>While this may be true</b>에서 뒤집히고 "
         + "5번 <b class=w>Rather, it is desirable that we develop games</b>가 주장. 통념형은 <b>Rather / Instead</b> 뒤가 답이다.",
  teachNote: "<b>통념 반전형 주장문의 표본.</b> 2026-20번(첫 문장에 방향이 다 나옴)과 대비시켜 두 유형을 가르칠 것. "
           + "1번만 읽고 ③·⑤(게임을 경계하자)를 고르는 학생이 반드시 나온다 - <u>universally accept는 필자 생각이 아니다</u>를 못 박을 것. "
           + "속독이라도 <b>Rather·Instead·However가 보이면 거기까지는 가야 한다</b>는 예외를 여기서 심는다."
},

/* ===== 2025수능 장문 ===== */
{
  id: "s25_4142_hand",
  src: "2025수능 41-42번", qnum: 41, qlabel: "41-42번", qtype: "장문",
  qtext: "윗글의 제목으로 가장 적절한 것은?",
  star: 3, time: 180,
  note: "* primate: 영장류  ** anatomy: 해부학  *** subsistence: 생계",

  sents: [
    "Imagine grabbing a piece of paper between your thumb and index finger.",
    "Maybe you already are, as you turn this page.",
    "We use this type of forceful, pad-to-pad precision gripping without thinking about it, and literally in a snap.",
    "Yet it was a breakthrough in human evolution.",
    "Other primates exhibit some kinds of precision grips in the handling and use of objects, but not with the kind of <u class=\"n1\">efficient</u> opposition that our hand anatomy allows.",
    "In a single hand, humans can easily hold and manipulate objects, even small and delicate ones, while adjusting our fingers to their shape and reorienting them with <u class=\"n2\">displacements</u> of our fingertip pads.",
    "Our relatively long, powerful thumb and other anatomical attributes, including our flat nails (which nearly all primates possess), make this <u class=\"n3\">possible</u>.",
    "Just picture trying \u2014 and failing \u2014 to dog-ear this page with pointy, curved claws.",
    "With a unique combination of traits, the human hand shaped our history.",
    "No question, stone tools couldn\u2019t have become a keystone of human technology and subsistence <u class=\"n4\">without</u> hands that could do the job, along with a nervous system that could regulate and coordinate the necessary signals.",
    "Anybody who\u2019s ever attempted to make a spear tip or arrowhead from a rock knows that it <u class=\"n5\">excludes</u> strong grips, constant rotation and repositioning, and forceful, careful strikes with another hard object.",
    "And even with a fair amount of know-how, it can be a bloody business."
  ],
  choices: [
    "Anatomical Distance Between Humans and Other Primates",
    "Human Hands: A Decisive Leap in the Evolutionary Path",
    "Our Hands: An Unexpected Outcome of Evolution",
    "Human Grip: The Dilemma of Human Survival",
    "Hidden Power of the Daily Use of Tools"
  ],
  ans: 2,
  ans42: 5,   // 42번(어휘) 정답

  lead: {to:4,
    note:"1~3번은 종이를 집는 장면을 그려보게 하는 도입. 4번 <b>Yet it was a breakthrough</b>에서 방향이 나온다",
    why:"1~3번은 <b>장면 묘사</b>다. 4번의 <b>Yet</b>까지 읽어야 필자의 방향이 보인다."},
  key:  "<b class=w>precision gripping</b> - 손으로 정밀하게 쥐는 능력",
  attr: "<b class=w>it was a breakthrough in human evolution</b> (4) - 인류 진화의 도약이었다",
  dir:  "긍정",
  dirWord: "<b class=w>Yet it was a breakthrough</b> (4) - 아무렇지 않아 보이지만(1~3) 사실은 대단하다는 뒤집기",

  skip: [
    {n:2,  head:"Maybe you already are, as you turn this page.", skip:false},
    {n:3,  head:"We use this type of forceful, pad-to-pad...", skip:false},
    {n:4,  head:"Yet it was a breakthrough in human evolution.", skip:false},
    {n:5,  head:"Other primates exhibit some kinds of precision grips...", skip:false},
    {n:6,  head:"In a single hand, humans can easily hold...", skip:false},
    {n:7,  head:"Our relatively long, powerful thumb...", skip:false},
    {n:8,  head:"Just picture trying \u2014 and failing \u2014 to dog-ear...", skip:true,
     why:"<b>Just picture</b> - 상상해 보라는 <u>예시</u>. 앞말을 그림으로 보여줄 뿐"},
    {n:9,  head:"With a unique combination of traits...", skip:false},
    {n:10, head:"No question, stone tools couldn\u2019t have become...", skip:false},
    {n:11, head:"<b>Anybody who\u2019s ever attempted</b> to make a spear tip...", skip:true,
     why:"구체적 장면(창끝 만들기) - 앞말을 뒷받침하는 예시. <u>다만 밑줄이 있으면 그 단어만 확인</u>"},
    {n:12, head:"And even with a fair amount of know-how...", skip:true,
     why:"11번 예시의 <b>연장</b> - 예시가 끝나는 곳까지 함께 건너뛴다"}
  ],

  trunk1: "손의 정밀한 쥐기가 인류 진화의 도약이었다 - 한 방향",
  trunk2: "",
  pivotAt: 0,

  tree: [
    {n:1,  lb:"주제도입", head:true,  txt:"엄지와 검지로 종이를 집는 장면을 떠올려 보라"},
    {n:2,  lb:"부연",     head:false, to:1,  txt:"지금 책장을 넘기며 이미 하고 있을 것이다"},
    {n:3,  lb:"부연",     head:false, to:1,  txt:"우리는 이 정밀한 쥐기를 생각 없이 순식간에 한다"},
    {n:4,  lb:"주장",     head:true,  txt:"그러나 이것은 인류 진화의 <b>도약</b>이었다 - 글의 축"},
    {n:5,  lb:"근거",     head:false, to:4,  txt:"다른 영장류도 정밀한 쥐기를 하지만 우리만큼 효율적이지 않다"},
    {n:6,  lb:"부연",     head:false, to:5,  txt:"인간은 한 손으로 작고 섬세한 것도 잡고 조작한다"},
    {n:7,  lb:"근거",     head:false, to:6,  txt:"긴 엄지와 평평한 손톱 같은 해부학적 특징이 이를 가능하게 한다"},
    {n:8,  lb:"예시",     head:false, to:7,  txt:"뾰족한 발톱으로 책장 모서리를 접어보라 - 안 된다"},
    {n:9,  lb:"주장",     head:true,  txt:"이 독특한 특징 조합이 인류의 역사를 만들었다"},
    {n:10, lb:"근거",     head:false, to:9,  txt:"손과 신경계가 없었다면 석기가 기술의 초석이 될 수 없었다"},
    {n:11, lb:"예시",     head:false, to:10, txt:"창끝을 만들어 본 사람은 강한 쥐기와 회전이 필요함을 안다"},
    {n:12, lb:"예시",     head:false, to:11, txt:"요령이 있어도 피 보는 일이다"}
  ],

  pivot: {sig:"없음", at:0, from:"이 글에는 줄기를 바꾸는 전환이 없다", to:"4번의 방향이 12번까지 그대로 간다"},
  pivotSub: "4번의 <b>Yet</b>은 <u>줄기를 바꾸는 전환이 아니라</u> '별것 아닌 듯하지만 사실은'이라는 <b>방향 설정</b>이다. "
          + "5번의 <b>but</b>도 다른 영장류와 견주는 딸림일 뿐. <b>신호어가 있다고 다 전환은 아니다.</b>",

  vocab: [
    {n:1, word:"efficient",    ok:true,
     why:"다른 영장류는 우리만큼 '효율적'인 맞섬이 안 된다 - 인간 손의 우월성과 순행"},
    {n:2, word:"displacements", ok:true,
     why:"손끝을 '옮겨가며' 방향을 바꾼다 - 조작의 정밀함"},
    {n:3, word:"possible",     ok:true,
     why:"엄지와 손톱이 이것을 '가능하게' 한다"},
    {n:4, word:"without",      ok:true,
     why:"손이 '없었다면' 석기가 초석이 될 수 없었다 - 손의 필요성 강조"},
    {n:5, word:"excludes",     ok:false, fix:"requires / involves",
     why:"창끝 만들기가 강한 쥐기와 회전을 <b>배제한다</b>가 아니라 <b>요구한다</b>. 손의 중요성을 말하는 글인데 혼자 방향이 뒤집힘"}
  ],

  gist: "손의 정밀한 쥐기 능력은 인류 진화의 결정적 도약이었고, 인류의 역사를 만들었다.",
  wrong: {
    "1": "인간과 영장류의 '해부학적 거리'를 재는 글이 아님 - 5번의 소재일 뿐",
    "3": "'뜻밖의 결과'가 아니라 <b>결정적 도약</b>. Unexpected가 방향을 흐린다",
    "4": "생존의 '딜레마'가 없음 - 갈등 구조가 아님",
    "5": "도구의 일상적 사용이 아니라 <b>손 자체</b>의 능력"
  },
  wrongNote: "③이 최대 함정. Our Hands까지는 맞지만 <b>Unexpected Outcome</b>이 글의 방향과 어긋난다. "
           + "필자는 손을 '뜻밖의 산물'이 아니라 <b>결정적 도약</b>으로 본다.",

  teachNote: "42번 정답 ⑤ excludes는 <b>글 전체 방향</b>으로만 잡힌다 - 11번 문장만 보면 어색함을 못 느낀다. "
           + "손이 중요하다는 글에서 '손 쓰기를 배제한다'가 말이 되나를 물을 것. "
           + "그리고 <b>Yet(4)·but(5)이 전환이 아니라는 것</b>을 STEP 4에서 확인시킬 것 - 2026-41번의 However와 같은 함정이다."
},

{
  id: "s25_4345_ethan",
  src: "2025수능 43-45번", qnum: 43, qlabel: "43-45번", qtype: "장문 배열",
  star: 2, time: 150,
  note: "",

  paras: [
    {tag:"A",
     text:"\u201cDo you remember when Sean used to tell me that I was the best dad in the world?\u201d Ethan asked his wife, Grace. \u201cYes, I do. I always envied your relationship with Sean,\u201d she replied. Ethan then shared how things had changed since <u class=\"n1\">(a) his</u> son started middle school. Grace had noticed Ethan often pushing Sean to study harder. \u201cMaybe he isn\u2019t that into school right now. How about going hiking, just the two of you?\u201d she suggested. He agreed, and realizing that both his and Sean\u2019s hiking jackets were still at the laundry, he asked his wife to go and pick them up with him.",
     gist:"Ethan이 아들과 멀어진 것을 아내와 이야기 → 하이킹 제안, 세탁소에 재킷 찾으러 가기로",
     cue:"주어진 글. <b>세탁소로 가기로 한 것</b>이 다음을 부른다"},
    {tag:"B",
     text:"Ethan and Grace came back home with the jackets and checked if Sean had everything else he needed for hiking. Luckily, in his drawers they found his hat, shoes, sunglasses, and hiking sticks. When Sean returned from school, Ethan softly said, \u201cSean, let\u2019s go hiking this Saturday, just the two of us.\u201d Though Sean thanked <u class=\"n2\">(b) him</u> for the suggestion, he said he had to go to the library. Grace stepped in, \u201cYou know, the weather this weekend will be the best of the year. Why not enjoy it?\u201d After a moment\u2019s hesitation, <u class=\"n3\">(c) he</u> agreed.",
     gist:"재킷을 갖고 <b>돌아와</b> 준비 확인 → Sean에게 제안, 망설이다 승낙",
     cue:"<b>came back home with the jackets</b> - 세탁소 다녀온 <u>뒤</u>"},
    {tag:"C",
     text:"\u201cWhen did you bring the jackets in?\u201d the clerk at the laundry asked. \u201cMaybe two weeks ago,\u201d Ethan replied. Then, Grace quickly reminded <u class=\"n4\">(d) him</u>, \u201cHoney, we actually left them here a month ago.\u201d The clerk went into the storage area to look for the clothes. Finally, he returned with the jackets and handed them to Ethan. The clerk politely said, \u201cI am sorry, but please collect your items earlier next time. Our storage is too full.\u201d Ethan felt embarrassed for the late collection and apologized.",
     gist:"세탁소에서 재킷을 찾음. 늦게 찾아 민망해함",
     cue:"(A)의 <b>go and pick them up</b>을 바로 받음"},
    {tag:"D",
     text:"The weather was perfect. Ethan and Sean set off hiking along the valley by Aicken Mountain. They walked in silence until Sean fell over a rock and twisted his ankle. Realizing he couldn\u2019t walk, Ethan carried his son down on his back. He felt Sean\u2019s heartbeat, something he hadn\u2019t felt since Sean was a baby. Suddenly, Sean said, \u201cDad, I\u2019m sorry. At some point, I started to become afraid of disappointing <u class=\"n5\">(e) you</u>. But you are still the best dad.\u201d Energized, he felt no weight on his back and replied, \u201cYou are the best son, no matter what.\u201d",
     gist:"토요일 하이킹 → Sean이 다침 → 업고 내려오며 마음을 나눔",
     cue:"결말. 승낙한 <b>그 주 토요일</b>"}
  ],

  orderAns: ["C","B","D"],
  ans43: 2,
  orderWhy: "(A) 세탁소 가기로 함 → (C) 세탁소에서 찾음 → (B) 갖고 돌아와 제안·승낙 → (D) 토요일 하이킹. 시간 순서 그대로",

  refs: [
    {tag:"a", word:"his",  who:"Ethan", why:"Ethan의 아들 = his son"},
    {tag:"b", word:"him",  who:"Ethan", why:"Sean이 <b>제안에</b> 고마워한 대상 = 제안한 아빠"},
    {tag:"c", word:"he",   who:"Sean",  why:"망설이다 <b>승낙한</b> 사람 = 제안을 받은 아들"},
    {tag:"d", word:"him",  who:"Ethan", why:"Grace가 일깨워 준 상대 = 남편"},
    {tag:"e", word:"you",  who:"Ethan", why:"Sean이 실망시킬까 두려웠던 대상 = 아빠"}
  ],
  refOdd: "Sean",
  ans44: 3,

  ans45: 4,
  why45: "(A)에서 Ethan은 <b class=w>asked his wife to go and pick them up with him</b> - 아내와 <b>함께</b> 갔다. '혼자서'는 반대",

  teachNote: "2026-43~45(Mia)와 같은 구조지만 <b>인물이 셋(Ethan·Grace·Sean)</b>이라 지칭이 더 까다롭다. "
           + "44번은 (c) he만 Sean이고 나머지 넷은 Ethan - <b>제안한 쪽과 받은 쪽</b>을 가르는 것이 전부다. "
           + "순서는 <b>재킷의 이동</b>만 따라가면 잡힌다: 맡겨둠(A) → 찾음(C) → 갖고 옴(B) → 입고 감(D). "
           + "<u>사물의 위치를 따라가는 것</u>도 시간축 추적의 한 방법임을 가르칠 것."
},

/* ===== 2024수능 속독 ===== */
{
  id: "s24_18_webtoon", src: "2024수능 18번", qnum: 18, qtype: "목적",
  qtext: "다음 글의 목적으로 가장 적절한 것은?", star: 1, time: 40, fast: true,
  sents: [
    "I\u2019m Charlie Reeves, manager of Toon Skills Company.",
    "If you\u2019re interested in new webtoon-making skills and techniques, this post is for you.",
    "This year, we\u2019ve launched special online courses, which contain a variety of contents about webtoon production.",
    "Each course consists of ten units that help improve your drawing and story-telling skills.",
    "Moreover, these courses are designed to suit any level, from beginner to advanced.",
    "It costs $45 for one course, and you can watch your course as many times as you want for six months.",
    "Our courses with talented and experienced instructors will open up a new world of creativity for you.",
    "It\u2019s time to start creating your webtoon world at https://webtoonskills.com."
  ],
  choices: ["웹툰 제작 온라인 강좌를 홍보하려고","웹툰 작가 채용 정보를 제공하려고",
            "신작 웹툰 공개 일정을 공지하려고","웹툰 창작 대회에 출품을 권유하려고",
            "기초적인 웹툰 제작 방법을 설명하려고"],
  ans: 1,
  key: "<b class=w>online courses</b> - 웹툰 제작 온라인 강좌",
  attr: "<b class=w>we\u2019ve launched special online courses</b> (3) - 강좌를 열었다",
  dir: "긍정",
  fastWhy: "3번 <b class=w>we\u2019ve launched special online courses</b>. 이후 구성·수강료·기간이 이어지므로 <b>홍보문</b>. "
         + "안내문형은 <b>무엇을 열었나</b>만 잡으면 끝난다.",
  teachNote: "2026·2025의 18번(요청·취소)과 달리 <b>홍보문</b>이다. 세 유형(요청·공지·홍보)을 여기서 비교해 줄 것."
},
{
  id: "s24_19_david", src: "2024수능 19번", qnum: 19, qtype: "심경",
  qtext: "다음 글에 드러난 David의 심경 변화로 가장 적절한 것은?", star: 1, time: 45,
  fast: true, fastMode: "mood",
  sents: [
    "David was starting a new job in Vancouver, and he was waiting for his bus.",
    "He kept looking back and forth between his watch and the direction the bus would come from.",
    "He thought, \u201cMy bus isn\u2019t here yet. I can\u2019t be late on my first day.\u201d",
    "David couldn\u2019t feel at ease.",
    "When he looked up again, he saw a different bus coming that was going right to his work.",
    "The bus stopped in front of him and opened its door.",
    "He got on the bus thinking, \u201cPhew! Luckily, this bus came just in time so I won\u2019t be late.\u201d",
    "He leaned back on an unoccupied seat in the bus and took a deep breath, finally able to relax."
  ],
  choices: ["nervous → relieved","lonely → hopeful","pleased → confused",
            "indifferent → delighted","bored → thrilled"],
  ans: 1,
  moodPivot: "<b class=w>When he looked up again</b> (5)",
  fastWhy: "앞 <b class=w>kept looking back and forth · couldn\u2019t feel at ease</b> (불안) → "
         + "뒤 <b class=w>Phew! Luckily · took a deep breath, finally able to relax</b> (안도).",
  teachNote: "전환 신호어가 <b>없는</b> 심경 변화. 2026(Suddenly)·2025(Unfortunately)와 대비 - "
           + "<u>상황이 바뀌는 문장</u>(버스가 왔다)이 곧 전환점임을 가르칠 것."
},
{
  id: "s24_20_playbook", src: "2024수능 20번", qnum: 20, qtype: "주장",
  qtext: "다음 글에서 필자가 주장하는 바로 가장 적절한 것은?", star: 1, time: 50,
  fast: true,
  sents: [
    "Values alone do not create and build culture.",
    "Living your values only some of the time does not contribute to the creation and maintenance of culture.",
    "Changing values into behaviors is only half the battle.",
    "Certainly, this is a step in the right direction, but those behaviors must then be shared and distributed widely throughout the organization, along with a clear and concise description of what is expected.",
    "It is not enough to simply talk about it.",
    "It is critical to have a visual representation of the specific behaviors that leaders and all people managers can use to coach their people.",
    "Just like a sports team has a playbook with specific plays designed to help them perform well and win, your company should have a playbook with the key shifts needed to transform your culture into action and turn your values into winning behaviors."
  ],
  choices: [
    "조직 문화 혁신을 위해서 모든 구성원이 공유할 핵심 가치를 정립해야 한다.",
    "조직 구성원의 행동을 변화시키려면 지도자는 명확한 가치관을 가져야 한다.",
    "조직 내 문화가 공유되기 위해서 구성원의 자발적 행동이 뒷받침되어야 한다.",
    "조직의 핵심 가치 실현을 위해 구성원 간의 지속적인 의사소통이 필수적이다.",
    "조직의 문화 형성에는 가치를 반영한 행동의 공유를 위한 명시적 지침이 필요하다."
  ],
  ans: 5,
  key: "<b class=w>values</b> + <b class=w>culture</b> - 가치와 조직 문화",
  attr: "<b class=w>Values alone do not create and build culture</b> (1) - 가치만으로는 안 된다",
  dir: "부정",
  fastWhy: "1번 <b class=w>Values alone do not</b>가 방향(부정). 6번 <b class=w>It is critical to have a visual representation</b>, "
         + "7번 <b class=w>your company should have a playbook</b>가 주장. <b>critical·should</b>가 답을 가리킨다.",
  teachNote: "2025-20(통념 반전)과 달리 <b>처음부터 부정</b>으로 시작해 대안을 제시하는 형. "
           + "주장 문항 3유형(첫문장 직진 / 통념반전 / 부정→대안)을 여기서 완성할 것."
},

/* ===== 2024수능 ===== */
{
  id: "s24_21_nonstick", src: "2024수능 21번", qnum: 21, qtype: "함축",
  qtext: "밑줄 친 <b>a nonstick frying pan</b>이 다음 글에서 의미하는 바로 가장 적절한 것은? [3점]",
  star: 3, time: 90, note: "* provoke: 유발시키다",
  sents: [
    "How you focus your attention plays a critical role in how you deal with stress.",
    "Scattered attention harms your ability to let go of stress, because even though your attention is scattered, it is narrowly focused, for you are able to fixate only on the stressful parts of your experience.",
    "When your attentional spotlight is widened, you can more easily let go of stress.",
    "You can put in perspective many more aspects of any situation and not get locked into one part that ties you down to superficial and anxiety-provoking levels of attention.",
    "A narrow focus heightens the stress level of each experience, but a widened focus turns down the stress level because you\u2019re better able to put each situation into a broader perspective.",
    "One anxiety-provoking detail is less important than the bigger picture.",
    "It\u2019s like transforming yourself into <u>a nonstick frying pan</u>.",
    "You can still fry an egg, but the egg won\u2019t stick to the pan."
  ],
  choices: [
    "never being confronted with any stressful experiences in daily life",
    "broadening one\u2019s perspective to identify the cause of stress",
    "rarely confining one\u2019s attention to positive aspects of an experience",
    "having a larger view of an experience beyond its stressful aspects",
    "taking stress into account as the source of developing a wide view"
  ],
  ans: 4,
  key: "<b class=w>focus your attention</b> - 주의를 어떻게 두느냐",
  attr: "<b class=w>plays a critical role in how you deal with stress</b> (1) - 스트레스 대처를 좌우한다",
  dir: "긍정",
  skip: [
    {n:2, head:"Scattered attention harms your ability...", skip:false},
    {n:3, head:"When your attentional spotlight is widened...", skip:false},
    {n:4, head:"You can put in perspective many more aspects...", skip:false},
    {n:5, head:"A narrow focus heightens the stress level...", skip:false},
    {n:6, head:"One anxiety-provoking detail is less important...", skip:false},
    {n:7, head:"It\u2019s like transforming yourself into a nonstick frying pan.", skip:false},
    {n:8, head:"You can still fry an egg, but the egg won\u2019t stick...", skip:false}
  ],
  trunk1: "주의를 넓게 두면 스트레스가 덜 붙는다 - 한 방향", trunk2: "", pivotAt: 0,
  tree: [
    {n:1, lb:"주제도입", head:true,  txt:"주의를 어떻게 두느냐가 스트레스 대처를 좌우한다"},
    {n:2, lb:"근거",     head:false, to:1, txt:"주의가 흩어지면 스트레스 부분에만 고착된다"},
    {n:3, lb:"주장",     head:true,  txt:"주의의 초점을 <b>넓히면</b> 스트레스를 놓아버리기 쉽다"},
    {n:4, lb:"부연",     head:false, to:3, txt:"상황을 여러 각도로 보고 한 부분에 갇히지 않는다"},
    {n:5, lb:"근거",     head:false, to:3, txt:"좁은 초점은 스트레스를 높이고 넓은 초점은 낮춘다"},
    {n:6, lb:"부연",     head:false, to:5, txt:"불안을 유발하는 한 가지 세부보다 큰 그림이 중요"},
    {n:7, lb:"비유",     head:false, to:3, txt:"눌어붙지 않는 프라이팬이 되는 것과 같다"},
    {n:8, lb:"부연",     head:false, to:7, txt:"계란은 여전히 부치지만 팬에 들러붙지 않는다"}
  ],
  pivot: {sig:"없음", at:0, from:"이 글에는 흐름 전환이 없다", to:"1번의 방향이 8번까지 그대로 간다"},
  pivotSub: "5번의 <b>but</b>은 좁은 초점 ↔ 넓은 초점을 <u>한 문장 안에서</u> 견주는 것. 줄기를 바꾸지 않는다.",
  implied: {
    phrase: "a nonstick frying pan",
    restateAt: [3, 8],
    model: "스트레스 경험을 <b>더 큰 시야로</b> 보아 그것이 나에게 들러붙지 않게 하는 상태"
  },
  gist: "주의의 초점을 넓히면 스트레스가 자신에게 들러붙지 않는다.",
  wrong: {
    "1": "스트레스를 <b>겪지 않는다</b>가 아님 - 8번 '계란은 여전히 부친다'가 반박",
    "2": "스트레스의 <b>원인을 찾는</b> 글이 아님",
    "3": "긍정적인 면에만 주의를 두라는 말이 아님",
    "5": "스트레스를 <b>넓은 시야의 원천</b>으로 삼는 것 - 인과가 거꾸로"
  },
  wrongNote: "①이 최대 함정. nonstick을 '스트레스가 아예 없다'로 읽으면 걸린다. <b>8번이 정확히 그걸 막아준다</b> - 계란은 부친다.",
  teachNote: "비유의 <b>뒷문장이 해설</b>인 전형. 7번만 보면 못 풀고 8번 <b>You can still fry an egg</b>를 봐야 한다. "
           + "STEP 3(함축)에서 8번을 반드시 짚게 할 것."
},
{
  id: "s24_22_compliment", src: "2024수능 22번", qnum: 22, qtype: "요지",
  qtext: "다음 글의 요지로 가장 적절한 것은?", star: 2, time: 60, note: "* compliment: 칭찬",
  sents: [
    "Being able to prioritize your responses allows you to connect more deeply with individual customers, be it a one-off interaction around a particularly delightful or upsetting experience, or the development of a longer-term relationship with a significantly influential individual within your customer base.",
    "If you\u2019ve ever posted a favorable comment \u2014 or any comment, for that matter \u2014 about a brand, product or service, think about what it would feel like if you were personally acknowledged by the brand manager, for example, as a result.",
    "In general, people post because they have something to say \u2014 and because they want to be recognized for having said it.",
    "In particular, when people post positive comments they are expressions of appreciation for the experience that led to the post.",
    "While a compliment to the person standing next to you is typically answered with a response like \u201cThank You,\u201d the sad fact is that most brand compliments go unanswered.",
    "These are lost opportunities to understand what drove the compliments and create a solid fan based on them."
  ],
  choices: [
    "고객과의 관계 증진을 위해 고객의 브랜드 칭찬에 응답하는 것은 중요하다.",
    "고객의 피드백을 면밀히 분석함으로써 브랜드의 성공 가능성을 높일 수 있다.",
    "신속한 고객 응대를 통해서 고객의 긍정적인 반응을 이끌어 낼 수 있다.",
    "브랜드 매니저에게는 고객의 부정적인 의견을 수용하는 태도가 요구된다.",
    "고객의 의견을 경청하는 것은 브랜드의 새로운 이미지 창출에 도움이 된다."
  ],
  ans: 1,
  key: "<b class=w>prioritize your responses</b> - 고객 반응에 응답하기",
  attr: "<b class=w>allows you to connect more deeply with individual customers</b> (1) - 고객과 더 깊이 연결된다",
  dir: "긍정",
  skip: [
    {n:2, head:"If you\u2019ve ever posted a favorable comment... <b>for example</b>", skip:true,
     why:"<b>for example</b> - 독자에게 상황을 가정해 보게 하는 예시"},
    {n:3, head:"In general, people post because...", skip:false},
    {n:4, head:"In particular, when people post positive comments...", skip:false},
    {n:5, head:"While a compliment to the person standing next to you...", skip:false},
    {n:6, head:"These are lost opportunities to understand...", skip:false}
  ],
  trunk1: "응답하면 고객과 깊이 연결된다 - 한 방향", trunk2: "", pivotAt: 0,
  tree: [
    {n:1, lb:"주제도입", head:true,  txt:"응답에 우선순위를 두면 고객과 더 깊이 연결된다"},
    {n:2, lb:"예시",     head:false, to:1, txt:"내가 쓴 칭찬에 브랜드가 직접 답해준다면 어떨까"},
    {n:3, lb:"근거",     head:false, to:1, txt:"사람들은 할 말이 있어서, 그리고 인정받고 싶어서 글을 쓴다"},
    {n:4, lb:"부연",     head:false, to:3, txt:"특히 긍정적 댓글은 좋은 경험에 대한 감사 표현이다"},
    {n:5, lb:"근거",     head:false, to:1, txt:"옆사람 칭찬엔 고맙다고 하면서 브랜드 칭찬은 대개 무응답"},
    {n:6, lb:"재진술",   head:true,  txt:"응답하지 않는 것은 팬을 만들 기회를 잃는 것이다"}
  ],
  pivot: {sig:"없음", at:0, from:"이 글에는 흐름 전환이 없다", to:"1번의 방향이 6번까지 그대로 간다"},
  pivotSub: "5번의 <b>While</b>은 옆사람 ↔ 브랜드를 견주는 <u>대조</u>일 뿐 줄기 전환이 아니다.",
  gist: "고객의 브랜드 칭찬에 응답하는 것이 고객과의 관계를 깊게 만든다.",
  wrong: {
    "2": "피드백 <b>분석</b>이 아니라 <b>응답</b>",
    "3": "'신속한' 응대가 아니라 응답 자체의 중요성",
    "4": "<b>부정적</b> 의견이 아니라 <b>칭찬</b>에 답하는 것",
    "5": "'새 이미지 창출'이 아니라 팬 만들기·관계 증진"
  },
  wrongNote: "④가 방향 반대. 이 글은 <b>positive comments</b>를 다룬다.",
  teachNote: "6번 <b>These are lost opportunities</b>가 요지를 뒤집어 말한 재진술. "
           + "'하지 않으면 잃는다' = '해야 한다'로 바꿔 읽는 훈련을 시킬 것."
},
{
  id: "s24_23_forest", src: "2024수능 23번", qnum: 23, qtype: "주제",
  qtext: "다음 글의 주제로 가장 적절한 것은?", star: 2, time: 60,
  note: "* exploitation: 이용  ** timber: 목재",
  sents: [
    "Managers of natural resources typically face market incentives that provide financial rewards for exploitation.",
    "For example, owners of forest lands have a market incentive to cut down trees rather than manage the forest for carbon capture, wildlife habitat, flood protection, and other ecosystem services.",
    "These services provide the owner with no financial benefits, and thus are unlikely to influence management decisions.",
    "But the economic benefits provided by these services, based on their non-market values, may exceed the economic value of the timber.",
    "For example, a United Nations initiative has estimated that the economic benefits of ecosystem services provided by tropical forests, including climate regulation, water purification, and erosion prevention, are over three times greater per hectare than the market benefits.",
    "Thus cutting down the trees is economically inefficient, and markets are not sending the correct \u201csignal\u201d to favor ecosystem services over extractive uses."
  ],
  choices: [
    "necessity of calculating the market values of ecosystem services",
    "significance of weighing forest resources\u2019 non-market values",
    "impact of using forest resources to maximize financial benefits",
    "merits of balancing forests\u2019 market and non-market values",
    "ways of increasing the efficiency of managing natural resources"
  ],
  ans: 2,
  key: "<b class=w>natural resources</b> + <b class=w>market incentives</b> - 자원 관리와 시장 유인",
  attr: "<b class=w>market incentives that provide financial rewards for exploitation</b> (1)<br>- 시장은 자원을 <b>써버리는</b> 쪽에 보상한다",
  dir: "부정",
  skip: [
    {n:2, head:"<b>For example</b>, owners of forest lands...", skip:true,
     why:"<b>For example</b> - 산림 소유자를 든 예시"},
    {n:3, head:"These services provide the owner with no financial benefits...", skip:false},
    {n:4, head:"But the economic benefits provided by these services...", skip:false},
    {n:5, head:"<b>For example</b>, a <b>United Nations</b> initiative has estimated... <b>three times</b>", skip:true,
     why:"<b>For example</b> + 기관명 + 숫자 - 앞말을 뒷받침하는 통계 예시"},
    {n:6, head:"Thus cutting down the trees is economically inefficient...", skip:false}
  ],
  trunk1: "시장은 자원을 써버리는 쪽에 보상한다", trunk2: "그러나 비시장 가치가 더 클 수 있다",
  pivotAt: 4,
  tree: [
    {n:1, lb:"주제도입", head:true,  txt:"자원 관리자는 자원을 이용할수록 보상받는 시장 유인에 놓인다"},
    {n:2, lb:"예시",     head:false, to:1, txt:"산림 소유자는 생태계 서비스보다 벌목에 유인이 있다"},
    {n:3, lb:"부연",     head:false, to:2, txt:"생태계 서비스는 금전 이익이 없어 결정에 영향을 못 준다"},
    {n:4, lb:"대조·반전", head:true, txt:"그러나 <b>비시장 가치</b>에 따른 경제적 이익이 목재 가치를 넘을 수 있다"},
    {n:5, lb:"근거",     head:false, to:4, txt:"UN 추정 - 열대림 생태계 서비스가 시장 이익의 3배 이상"},
    {n:6, lb:"재진술",   head:true,  txt:"따라서 벌목은 비효율이며 시장이 잘못된 신호를 보내고 있다"}
  ],
  pivot: {sig:"But", at:4, from:"시장 유인은 벌목 쪽", to:"비시장 가치가 더 크다"},
  pivotSub: "<b>But</b>(4)이 진짜 전환. 3번까지는 '왜 벌목하나'를 설명하고, 4번부터 '그게 왜 틀렸나'로 넘어간다.",
  gist: "산림의 비시장 가치가 목재 가치를 넘을 수 있으므로 이를 따져봐야 한다.",
  wrong: {
    "1": "<b>시장</b> 가치 계산이 아니라 <b>비시장</b> 가치 - 정반대",
    "3": "금전 이익 극대화의 <b>영향</b>을 다룬 글이 아님",
    "4": "둘의 <b>균형</b>이 아니라 비시장 가치를 따져봐야 한다는 주장",
    "5": "관리 <b>효율을 높이는 방법</b>을 알려주는 글이 아님"
  },
  wrongNote: "④가 그럴듯한 함정. balancing은 중립적인데 이 글은 <b>비시장 쪽에 무게</b>를 싣는다.",
  teachNote: "전환점이 <b>있는</b> 글이라 21·22번(전환 없음)과 묶어 대비시키기 좋다. "
           + "For example이 <b>두 번</b> 나오는 것도 건너뛰기 훈련에 좋은 재료."
},
{
  id: "s24_24_overtourism", src: "2024수능 24번", qnum: 24, qtype: "제목",
  qtext: "다음 글의 제목으로 가장 적절한 것은? [3점]", star: 3, time: 70,
  note: "* demarcate: 경계를 정하다",
  sents: [
    "The concept of overtourism rests on a particular assumption about people and places common in tourism studies and the social sciences in general.",
    "Both are seen as clearly defined and demarcated.",
    "People are framed as bounded social actors either playing the role of hosts or guests.",
    "Places, in a similar way, are treated as stable containers with clear boundaries.",
    "Hence, places can be full of tourists and thus suffer from overtourism.",
    "But what does it mean for a place to be full of people?",
    "Indeed, there are examples of particular attractions that have limited capacity and where there is actually no room for more visitors.",
    "This is not least the case with some man-made constructions such as the Eiffel Tower.",
    "However, with places such as cities, regions or even whole countries being promoted as destinations and described as victims of overtourism, things become more complex.",
    "What is excessive or out of proportion is highly relative and might be more related to other aspects than physical capacity, such as natural degradation and economic leakages (not to mention politics and local power dynamics)."
  ],
  choices: [
    "The Solutions to Overtourism: From Complex to Simple",
    "What Makes Popular Destinations Attractive to Visitors?",
    "Are Tourist Attractions Winners or Losers of Overtourism?",
    "The Severity of Overtourism: Much Worse than Imagined",
    "Overtourism: Not Simply a Matter of People and Places"
  ],
  ans: 5,
  key: "<b class=w>overtourism</b> - 과잉관광이라는 개념",
  attr: "<b class=w>rests on a particular assumption about people and places</b> (1)<br>- 사람과 장소에 대한 <b>어떤 전제</b>에 기대고 있다",
  dir: "통념",
  skip: [
    {n:2, head:"Both are seen as clearly defined and demarcated.", skip:false},
    {n:3, head:"People are framed as bounded social actors...", skip:false},
    {n:4, head:"Places, in a similar way, are treated as stable containers...", skip:false},
    {n:5, head:"Hence, places can be full of tourists...", skip:false},
    {n:6, head:"But what does it mean for a place to be full of people?", skip:false},
    {n:7, head:"Indeed, there are examples of particular attractions...", skip:false},
    {n:8, head:"This is not least the case with... the <b>Eiffel Tower</b>.", skip:true,
     why:"<b>고유명사</b>(Eiffel Tower) - 앞말을 보여주는 예시"},
    {n:9, head:"However, with places such as cities, regions...", skip:false},
    {n:10, head:"What is excessive or out of proportion is highly relative...", skip:false}
  ],
  trunk1: "과잉관광이 기대는 전제 - 사람도 장소도 경계가 뚜렷하다",
  trunk2: "그러나 그 전제가 흔들린다 - 넘침은 상대적이다",
  pivotAt: 6,
  tree: [
    {n:1,  lb:"주제도입", head:true,  txt:"과잉관광 개념은 사람·장소에 대한 어떤 전제에 기대고 있다"},
    {n:2,  lb:"부연",     head:false, to:1, txt:"둘 다 뚜렷하게 정의되고 경계 지어진 것으로 본다"},
    {n:3,  lb:"부연",     head:false, to:2, txt:"사람은 주인 아니면 손님이라는 틀에 갇힌다"},
    {n:4,  lb:"부연",     head:false, to:2, txt:"장소도 경계가 분명한 안정된 그릇으로 다뤄진다"},
    {n:5,  lb:"근거",     head:false, to:2, txt:"그래서 장소가 관광객으로 '가득 찰' 수 있다는 말이 성립"},
    {n:6,  lb:"대조·반전", head:true, txt:"그런데 장소가 사람으로 가득 찬다는 건 무슨 뜻인가"},
    {n:7,  lb:"부연",     head:false, to:6, txt:"수용 한계가 뚜렷한 명소도 분명 있다 (양보)"},
    {n:8,  lb:"예시",     head:false, to:7, txt:"에펠탑 같은 인공 구조물이 그렇다"},
    {n:9,  lb:"주장",     head:true,  txt:"그러나 도시·지역·국가 단위가 되면 문제가 훨씬 복잡해진다"},
    {n:10, lb:"재진술",   head:true,  txt:"무엇이 '과함'인지는 매우 상대적이며 물리적 수용력만의 문제가 아니다"}
  ],
  pivot: {sig:"But", at:6, from:"경계가 뚜렷하다는 전제", to:"그 전제가 흔들린다"},
  pivotSub: "<b>But</b>(6)이 큰 전환, <b>However</b>(9)가 한 번 더 눌러준다. "
          + "7·8번은 <u>양보</u>(맞는 경우도 있다)이므로 9번의 However를 놓치면 방향을 반대로 잡는다.",
  gist: "과잉관광은 사람·장소의 경계가 뚜렷하다는 전제에 기대지만, 무엇이 과한지는 상대적이다.",
  wrong: {
    "1": "해결책을 제시하는 글이 아님",
    "2": "관광지의 매력 요인을 다루지 않음",
    "3": "승자·패자를 가리는 글이 아님",
    "4": "심각성을 강조하는 글이 아님 - 오히려 <b>개념 자체를 의심</b>한다"
  },
  wrongNote: "④가 최대 함정. 과잉관광을 다루니 '심각하다'로 읽기 쉽지만, 이 글은 <b>그 개념이 단순하지 않다</b>고 말한다. 정답 ⑤의 <b>Not Simply</b>가 그것.",
  teachNote: "양보(7·8) 뒤의 <b>However</b>를 잡는 훈련. 2026-24번(culturtainment)과 같은 구조라 묶어서 가르칠 것."
},
{
  id: "s24_30_bazaar", src: "2024수능 30번", qnum: 30, qtype: "어휘",
  qtext: "다음 글의 밑줄 친 부분 중, 문맥상 낱말의 쓰임이 적절하지 <b>않은</b> 것은? [3점]",
  star: 3, time: 80, note: "* constraint: 압박  ** consensus: 일치",
  sents: [
    "Bazaar economies feature an apparently flexible price-setting mechanism that sits atop more enduring ties of shared culture.",
    "Both the buyer and seller are aware of each other\u2019s <u class=\"n1\">restrictions</u>.",
    "In Delhi\u2019s bazaars, buyers and sellers can <u class=\"n2\">assess</u> to a large extent the financial constraints that other actors have in their everyday life.",
    "Each actor belonging to a specific economic class understands what the other sees as a necessity and a luxury.",
    "In the case of electronic products like video games, they are not a <u class=\"n3\">necessity</u> at the same level as other household purchases such as food items.",
    "So, the seller in Delhi\u2019s bazaars is careful not to directly ask for very <u class=\"n4\">low</u> prices for video games because at no point will the buyer see possession of them as an absolute necessity.",
    "Access to this type of knowledge establishes a price consensus by relating to each other\u2019s preferences and limitations of belonging to a <u class=\"n5\">similar</u> cultural and economic universe."
  ],
  choices: ["restrictions","assess","necessity","low","similar"],
  ans: 4,
  key: "<b class=w>Bazaar economies</b> - 바자르 경제의 가격 결정",
  attr: "<b class=w>ties of shared culture</b> (1) - 공유된 문화의 끈 위에서 가격이 정해진다",
  dir: "긍정",
  skip: [
    {n:2, head:"Both the buyer and seller are aware...", skip:false},
    {n:3, head:"In <b>Delhi</b>\u2019s bazaars, buyers and sellers can assess...", skip:false,
     why:"지명이 있지만 밑줄이 있어 확인 필요"},
    {n:4, head:"Each actor belonging to a specific economic class...", skip:false},
    {n:5, head:"In the case of electronic products like video games...", skip:false},
    {n:6, head:"So, the seller in Delhi\u2019s bazaars is careful...", skip:false},
    {n:7, head:"Access to this type of knowledge establishes...", skip:false}
  ],
  trunk1: "서로의 사정을 알기에 가격 합의가 이뤄진다 - 한 방향", trunk2: "", pivotAt: 0,
  tree: [
    {n:1, lb:"주제도입", head:true,  txt:"바자르 경제의 가격은 공유된 문화의 끈 위에서 정해진다"},
    {n:2, lb:"부연",     head:false, to:1, txt:"사는 쪽과 파는 쪽이 서로의 제약을 안다"},
    {n:3, lb:"부연",     head:false, to:2, txt:"델리 시장에선 상대의 재정 압박을 상당히 가늠할 수 있다"},
    {n:4, lb:"부연",     head:false, to:3, txt:"같은 경제 계층이라 무엇이 필수품이고 사치인지 안다"},
    {n:5, lb:"예시",     head:false, to:4, txt:"비디오게임은 식료품만큼의 필수품이 아니다"},
    {n:6, lb:"근거",     head:false, to:5, txt:"그래서 판매자는 게임에 <b>아주 높은</b> 값을 부르지 않는다"},
    {n:7, lb:"재진술",   head:true,  txt:"이런 앎이 서로의 선호와 한계를 반영한 가격 합의를 만든다"}
  ],
  pivot: {sig:"없음", at:0, from:"이 글에는 흐름 전환이 없다", to:"1번의 방향이 7번까지 그대로 간다"},
  pivotSub: "<b>So</b>(6)는 인과 연결이지 전환이 아니다. 방향이 한 번도 안 바뀌므로 밑줄 중 <u>혼자 반대인 것</u>이 답.",
  vocab: [
    {n:1, word:"restrictions", ok:true, why:"서로의 '제약'을 안다 - 3번 financial constraints와 순행"},
    {n:2, word:"assess",       ok:true, why:"상대의 재정 압박을 '가늠한다' - 서로 안다는 흐름과 일치"},
    {n:3, word:"necessity",    ok:true, why:"게임은 식료품만큼의 '필수품'이 아니다"},
    {n:4, word:"low",          ok:false, fix:"high",
     why:"필수품이 아니라고 <b>여기지 않으므로</b> 판매자는 <b>높은</b> 값을 못 부른다. 낮은 값을 조심할 이유가 없다"},
    {n:5, word:"similar",      ok:true, why:"'비슷한' 문화·경제 세계에 속한 데서 오는 한계 - 1번 shared culture와 순행"}
  ],
  gist: "바자르에서는 서로의 경제적 사정을 알기에 가격 합의가 이뤄진다.",
  wrong: {},
  wrongNote: "④만 방향이 반대. 나머지 넷은 모두 '서로의 사정을 안다'는 흐름과 순행한다.",
  teachNote: "④가 <b>부정어(not)와 겹쳐</b> 헷갈린다. 'not to ask for very low' = '낮은 값을 부르지 않으려 조심' - "
           + "말이 되나? 필수품이 아니면 <u>비싸게</u> 못 부르는 것이다. 문장을 우리말로 뒤집어 읽게 할 것."
}

];
