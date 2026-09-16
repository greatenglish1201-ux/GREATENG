// ════════════════════════════════════════════════════════════
// GREATENG GAS — 전체본 v6 (index 로그인 GAS)
// v6 변경 (랭킹 기준 전면 수정):
//   - 문제: 교재가 한정돼 많이 풀수록 같은 문제를 다시 만나고, 반복분을 깎던 기존
//     방식에서는 '많이 푼 학생'일수록 유효시도가 줄어 손해를 봤다(유지율 98%→66%).
//     반대로 좁은 범위를 매일 도는 학생은 간격이 벌어져 거의 안 깎여 상위에 올랐다.
//   - 해결: 랭킹을 '첫 시도 정답률 + 서로 다른 문제 수(표본)'로 계산.
//       · 정답률 = 각 (지문|유형)의 첫 시도만 반영 → 처음 보는 문제를 맞히는 실력
//       · 표본   = 서로 다른 문제 수 → 좁게 도는 학생은 표본이 작아 평균으로 당겨짐
//       · 반복은 점수에 유·불리 없음(복습은 사각지대·학습량이 따로 평가)
//   - RANK_MIN_ITEMS(100)는 이제 '서로 다른 문제 수' 기준
//   - studentStats에 uniq(고유 문항 수), firstRate(첫시도 정답률) 추가
// v5 (유지) 클래스별 보기:
//   - '학생' 시트 G열 '클래스' 지원 (예: 고3 / 고1 / 중2)
//   - login·getStudents: cls 필드 반환 / saveStudent: cls 저장(미전달 시 기존값 보존)
//   - getStats: studentStats에 cls 포함 → 화면에서 클래스별 랭킹 필터 가능
//   - initSheets: 새 학생 시트 헤더에 '클래스' 포함
// v4 (유지) 랭킹 공정성:
//   - 랭킹 진입 최소 100문항(RANK_MIN_ITEMS) → 미달자는 순위 제외(목록엔 표시)
//   - C(베이지안 상수) 100 고정 → 데이터 증가에도 순위 안정
//   - 진단 필드 _ec/_en(유효정답·유효시도) 노출 (화면 미사용, 원인 추적용)
//   - 간격 보정(τ=3): 첫 시도=1, 반복 정답=1-exp(-gap/3), 반복 오답=1
// v3 (유지): getStats/getRank/getStatsDetailed CacheService 5분 캐시
// v2 (유지): 학생별 통계시작일(F열) — 랭킹·유형·오답 집계에서 이전 기록 제외
// v1 (유지): 결과_상세 long format, 시험기간 태깅, 아카이빙, getStatsDetailed
//
// [중요] '학생' 시트 G1 셀에 「클래스」 헤더가 있어야 합니다(이미 있으면 OK)
// [중요] 붙여넣고 저장 → 배포 관리 → 새 버전 배포 → 5분 대기(또는 학생 1명 저장)
// ════════════════════════════════════════════════════════════

const SHEET_PASSAGE  = '지문DB';
const SHEET_QUESTION = '출제DB';
const SHEET_STUDENT  = '학생';
const SHEET_RESULT   = '결과';
const SHEET_RESULT_DETAIL = '결과_상세';
const SHEET_BOOKS    = '교재목록';
const PROP_ADMIN_PW  = 'ADMIN_PW';
const PROP_EXAM_PERIOD = 'CUR_EXAM_PERIOD';
const DEFAULT_ADMIN_PW = 'great2025';

function doGet(e) {
  const p   = e.parameter;
  const cb  = p.callback || 'callback';
  let result;
  try { result = route(p); }
  catch (err) { result = { ok: false, error: err.message }; }
  return ContentService
    .createTextOutput(cb + '(' + JSON.stringify(result) + ')')
    .setMimeType(ContentService.MimeType.JAVASCRIPT);
}

function doPost(e) {
  let result;
  let cb = 'cb';
  try {
    let p = e.parameter || {};
    if (p.payload) {
      try { const parsed = JSON.parse(p.payload); p = Object.assign({}, p, parsed); }
      catch (parseErr) { throw new Error('payload JSON 파싱 실패: ' + parseErr.message); }
    }
    cb = p.callback || 'cb';
    result = route(p);
  } catch (err) { result = { ok: false, error: err.message }; }
  const json = JSON.stringify(result)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  const html = '<!DOCTYPE html><html><body>'
    + '<textarea id="__greateng_response__">' + json + '</textarea>'
    + '</body></html>';
  return HtmlService.createHtmlOutput(html)
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function route(p) {
  const action = p.action;
  switch (action) {
    case 'savePassage':     return savePassage(p);
    case 'getPassages':     return getPassages(p);
    case 'saveQuestions':   return saveQuestions(p);
    case 'getQuestions':    return getQuestions(p);
    case 'getQuestionPids': return getQuestionPids();
    case 'login':           return login(p);
    case 'getStudents':     return getStudents(p);
    case 'saveStudent':     return saveStudent(p);
    case 'deleteStudent':   return deleteStudent(p);
    case 'changeAdminPw':   return changeAdminPw(p);
    case 'saveResult':      return saveResult(p);
    case 'getResults':      return getResults(p);
    case 'getStats':        return getStats(p);
    case 'getRank':         return getRank(p);
    case 'initSheets':      return initSheets();
    case 'saveAnalysis':    return saveAnalysis(p);
    case 'getAnalysisList': return getAnalysisList(p);
    case 'saveHitResult':   return saveHitResult(p);
    case 'getHitResults':   return getHitResults(p);
    case 'saveMiddlePassage':  return saveMiddlePassage(p);
    case 'getMiddlePassages':  return getMiddlePassages(p);
    case 'saveExam':        return saveExam(p);
    case 'getExamList':     return getExamList();
    case 'getBooks':        return getBooks(p);
    case 'saveBooks':       return saveBooks(p);
    case 'savePreset':      return savePreset(p);
    case 'getPresets':      return getPresets(p);
    case 'deletePreset':    return deletePreset(p);
    case 'setExamPeriod':   return setExamPeriod(p);
    case 'getExamPeriod':   return getExamPeriod(p);
    case 'listExamPeriods': return listExamPeriods(p);
    case 'archiveResults':  return archiveResults(p);
    case 'getStatsDetailed':return getStatsDetailed(p);
    default:
      return { ok: false, error: 'Unknown action: ' + action };
  }
}

function initSheets() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!ss.getSheetByName(SHEET_PASSAGE)) {
    const sh = ss.insertSheet(SHEET_PASSAGE);
    sh.appendRow(['id','source','chapter','number','difficulty','title','abstract',
                  'sentences_json','flow_json','blockSummaries_json','is_public','updated_at',
                  'is_hot','chapter_org']);
    sh.setFrozenRows(1);
  }
  if (!ss.getSheetByName(SHEET_QUESTION)) {
    const sh = ss.insertSheet(SHEET_QUESTION);
    sh.appendRow(['pid','type','data_json','answer','updated_at']);
    sh.setFrozenRows(1);
  }
  if (!ss.getSheetByName(SHEET_STUDENT)) {
    const sh = ss.insertSheet(SHEET_STUDENT);
    sh.appendRow(['이름','비밀번호','만료일','활성화','시작일','통계시작일','클래스']);
    sh.setFrozenRows(1);
  }
  if (!ss.getSheetByName(SHEET_RESULT)) {
    const sh = ss.insertSheet(SHEET_RESULT);
    sh.appendRow(['날짜','이름','점수','정답률','상세']);
    sh.setFrozenRows(1);
  }
  ensureResultDetailSheet_(ss);
  if (!ss.getSheetByName(SHEET_BOOKS)) {
    const sh = ss.insertSheet(SHEET_BOOKS);
    sh.appendRow(['id','label','storage','meta_json','updated_at']);
    sh.setFrozenRows(1);
  }
  return { ok: true, message: '시트 초기화 완료' };
}

function ensureResultDetailSheet_(ss) {
  ss = ss || SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(SHEET_RESULT_DETAIL);
  if (!sh) {
    sh = ss.insertSheet(SHEET_RESULT_DETAIL);
    sh.appendRow(['timestamp','exam_period','student_name','session_id',
                  'q_no','pid','q_type','correct_ans','chosen_ans','is_correct',
                  'distractor_type']);
    sh.setFrozenRows(1);
  }
  return sh;
}

function savePassage(p) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sh = ss.getSheetByName(SHEET_PASSAGE);
  if (!sh) throw new Error('지문DB 시트 없음. initSheets 먼저 실행');
  const id = p.id;
  if (!id) throw new Error('id 필수');
  const headers = sh.getRange(1,1,1,sh.getLastColumn()).getValues()[0];
  const now = new Date().toISOString();
  const data = sh.getDataRange().getValues();
  let rowIdx = -1;
  for (let i=1; i<data.length; i++) { if (data[i][0]===id) { rowIdx=i+1; break; } }
  const colMap = {};
  headers.forEach((h,i) => { colMap[h]=i; });
  const row = rowIdx>0 ? sh.getRange(rowIdx,1,1,headers.length).getValues()[0] : new Array(headers.length).fill('');
  const set = (col,val) => { if (col in colMap && val!==undefined) row[colMap[col]]=val; };
  set('id',id); set('source',p.source); set('chapter',p.chapter); set('chapter_org', p.chapter_org); set('number',p.number);
  set('difficulty',p.difficulty); set('title',p.title); set('abstract',p.abstract);
  set('sentences_json',p.sentences_json); set('flow_json',p.flow_json);
  set('blockSummaries_json',p.blockSummaries_json); set('is_public',p.is_public);
  set('is_hot',p.is_hot);
  set('updated_at',now);
  if (rowIdx>0) { sh.getRange(rowIdx,1,1,headers.length).setValues([row]); }
  else { sh.appendRow(row); }
  return { ok:true, id, action: rowIdx>0?'updated':'inserted' };
}

function getPassages(p) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sh = ss.getSheetByName(SHEET_PASSAGE);
  if (!sh) return { ok:true, passages:[] };
  const data = sh.getDataRange().getValues();
  if (data.length<2) return { ok:true, passages:[] };
  const headers = data[0];
  const col = {};
  headers.forEach((h,i) => { col[h]=i; });
  const filterSource = p.source||'';
  const filterId     = p.id||'';
  const publicOnly   = p.public_only==='true';
  const passages = [];
  for (let i=1; i<data.length; i++) {
    const row = data[i];
    if (!row[col['id']]) continue;
    if (filterSource && row[col['source']]!==filterSource) continue;
    if (filterId     && row[col['id']]!==filterId) continue;
    if (publicOnly) { const pub=row[col['is_public']]; if (pub!=='TRUE'&&pub!==true) continue; }
    passages.push({
      id: row[col['id']], source: row[col['source']], chapter: row[col['chapter']],
      chapter_org: ('chapter_org' in col) ? (row[col['chapter_org']]||'') : '',
      number: row[col['number']], difficulty: row[col['difficulty']],
      title: row[col['title']], abstract: row[col['abstract']],
      sentences_json: row[col['sentences_json']]||'',
      flow_json: row[col['flow_json']]||'',
      blockSummaries_json: row[col['blockSummaries_json']]||'',
      is_public: row[col['is_public']]||'',
      is_hot: row[col['is_hot']]||'',
      updated_at: row[col['updated_at']]||'',
    });
  }
  return { ok:true, passages };
}

function saveQuestions(p) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sh = ss.getSheetByName(SHEET_QUESTION);
  if (!sh) throw new Error('출제DB 시트 없음. initSheets 먼저 실행');
  const pid = p.pid;
  if (!pid) throw new Error('pid 필수');
  let questions;
  try { questions=JSON.parse(p.questions_json); }
  catch(e) { throw new Error('questions_json 파싱 실패: '+e.message); }
  const data = sh.getDataRange().getValues();
  const headers = data[0];
  const col = {};
  headers.forEach((h,i) => { col[h]=i; });
  const now = new Date().toISOString();
  questions.forEach(q => {
    const type=q.type; if (!type) return;
    let rowIdx=-1;
    for (let i=1; i<data.length; i++) {
      if (data[i][col['pid']]===pid && data[i][col['type']]===type) { rowIdx=i+1; break; }
    }
    const row = rowIdx>0 ? sh.getRange(rowIdx,1,1,headers.length).getValues()[0] : new Array(headers.length).fill('');
    row[col['pid']]=pid; row[col['type']]=type;
    row[col['data_json']]=q.data_json||'';
    row[col['answer']]=q.answer!==undefined?q.answer:'';
    row[col['updated_at']]=now;
    if (rowIdx>0) { sh.getRange(rowIdx,1,1,headers.length).setValues([row]); }
    else { sh.appendRow(row); }
  });
  return { ok:true, pid, saved:questions.length };
}

function getQuestions(p) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sh = ss.getSheetByName(SHEET_QUESTION);
  if (!sh) return { ok:true, questions:[] };
  const pid=p.pid; if (!pid) throw new Error('pid 필수');
  const data = sh.getDataRange().getValues();
  if (data.length<2) return { ok:true, questions:[] };
  const headers=data[0]; const col={};
  headers.forEach((h,i) => { col[h]=i; });
  const questions=[];
  for (let i=1; i<data.length; i++) {
    const row=data[i]; if (row[col['pid']]!==pid) continue;
    questions.push({ pid:row[col['pid']], type:row[col['type']],
      data_json:row[col['data_json']]||'', answer:row[col['answer']],
      updated_at:row[col['updated_at']]||'' });
  }
  return { ok:true, questions };
}

function getQuestionPids() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sh = ss.getSheetByName(SHEET_QUESTION);
  if (!sh) return { ok:true, pids:[] };
  const data = sh.getDataRange().getValues();
  if (data.length<2) return { ok:true, pids:[] };
  const ci = data[0].indexOf('pid');
  if (ci<0) return { ok:true, pids:[] };
  const set = {};
  for (let i=1; i<data.length; i++) {
    const v = String(data[i][ci]||'').trim();
    if (v) set[v]=true;
  }
  return { ok:true, pids:Object.keys(set) };
}

function login(p) {
  const name=(p.name||'').trim(); const pw=p.password||'';
  const adminPw=PropertiesService.getScriptProperties().getProperty(PROP_ADMIN_PW)||DEFAULT_ADMIN_PW;
  if (name==='관리자'&&pw===adminPw) return { ok:true, role:'admin', name:'관리자' };
  const ss=SpreadsheetApp.getActiveSpreadsheet();
  const sh=ss.getSheetByName(SHEET_STUDENT);
  if (!sh) return { ok:false, error:'학생 시트 없음' };
  const data=sh.getDataRange().getDisplayValues();
  for (let i=1; i<data.length; i++) {
    const sName=data[i][0], sPw=data[i][1], expiry=data[i][2], active=data[i][3], startDate=data[i][4]||'', statsFrom=(data[i][5]||''), cls=(data[i][6]||'');
    if (sName!==name) continue;
    if (String(active).trim()==='FALSE'||String(active).trim()==='비활성') return { ok:false, error:'비활성 계정입니다' };
    if (expiry) { const exp=new Date(expiry); if (!isNaN(exp)&&exp<new Date()) return { ok:false, error:'만료된 계정입니다' }; }
    if (String(sPw)!==String(pw)) return { ok:false, error:'비밀번호가 틀렸습니다' };
    return { ok:true, role:'student', name, startDate:String(startDate||''), expiry:String(expiry||''), statsFrom:String(statsFrom||''), cls:String(cls||'') };
  }
  return { ok:false, error:'존재하지 않는 학생입니다' };
}

function getStudents(p) {
  const ss=SpreadsheetApp.getActiveSpreadsheet();
  const sh=ss.getSheetByName(SHEET_STUDENT);
  if (!sh) return { ok:true, students:[] };
  const data=sh.getDataRange().getDisplayValues(); const students=[];
  for (let i=1; i<data.length; i++) {
    const name=data[i][0], pw=data[i][1], expiry=data[i][2], active=data[i][3], startDate=data[i][4]||'', statsFrom=(data[i][5]||''), cls=(data[i][6]||'');
    if (!name) continue;
    students.push({ name, password:pw, expiry:expiry?String(expiry):'', active, startDate:startDate?String(startDate):'', statsFrom:statsFrom?String(statsFrom):'', cls:cls?String(cls):'' });
  }
  return { ok:true, students };
}

function saveStudent(p) {
  const ss=SpreadsheetApp.getActiveSpreadsheet();
  const sh=ss.getSheetByName(SHEET_STUDENT);
  if (!sh) throw new Error('학생 시트 없음');
  const name=(p.name||'').trim(); const pw=p.password||'';
  const expiry=p.expiry||''; const active=p.active!==undefined?p.active:'TRUE';
  const startDate=p.startDate||'';
  const statsFrom=p.statsFrom||'';
  if (!name) throw new Error('이름 필수');
  const data=sh.getDataRange().getDisplayValues();
  for (let i=1; i<data.length; i++) {
    if (data[i][0]===name) {
      const keep=(p.statsFrom===undefined)?(data[i][5]||''):statsFrom;
      const keepCls=(p.cls===undefined)?(data[i][6]||''):(p.cls||'');
      sh.getRange(i+1,1,1,7).setValues([[name,pw,expiry,active,startDate,keep,keepCls]]);
      _bumpCache_();
      return { ok:true, action:'updated' };
    }
  }
  sh.appendRow([name,pw,expiry,active,startDate,statsFrom,(p.cls||'')]);
  _bumpCache_();
  return { ok:true, action:'inserted' };
}

function deleteStudent(p) {
  const ss=SpreadsheetApp.getActiveSpreadsheet();
  const sh=ss.getSheetByName(SHEET_STUDENT);
  if (!sh) throw new Error('학생 시트 없음');
  const name=(p.name||'').trim(); if (!name) throw new Error('이름 필수');
  const data=sh.getDataRange().getDisplayValues();
  for (let i=data.length-1; i>=1; i--) {
    if (data[i][0]===name) { sh.deleteRow(i+1); return { ok:true }; }
  }
  return { ok:false, error:'학생 없음' };
}

function changeAdminPw(p) {
  const oldPw=p.oldPw||''; const newPw=p.newPw||'';
  const adminPw=PropertiesService.getScriptProperties().getProperty(PROP_ADMIN_PW)||DEFAULT_ADMIN_PW;
  if (oldPw!==adminPw) return { ok:false, error:'현재 비밀번호 틀림' };
  if (!newPw) return { ok:false, error:'새 비밀번호 필수' };
  PropertiesService.getScriptProperties().setProperty(PROP_ADMIN_PW,newPw);
  return { ok:true };
}

function saveResult(p) {
  const ss=SpreadsheetApp.getActiveSpreadsheet();
  const sh=ss.getSheetByName(SHEET_RESULT);
  if (!sh) throw new Error('결과 시트 없음');
  const now=new Date();
  const kst=new Date(now.getTime()+9*60*60*1000);
  const dateStr=kst.toISOString().slice(0,16).replace('T',' ');
  sh.appendRow(["'"+dateStr,p.name||'',p.score||'',p.rate||'',p.detail||'']);

  try {
    const detail=String(p.detail||'');
    if (detail.trim()) {
      const dsh=ensureResultDetailSheet_(ss);
      const examPeriod=PropertiesService.getScriptProperties().getProperty(PROP_EXAM_PERIOD)||'';
      const sessionId=(p.name||'')+'#'+kst.getTime();
      const items=detail.split('||').filter(x=>x.trim());
      const rows=[];
      items.forEach((item,qi)=>{
        const parts=item.split('|');
        if (parts.length<3) return;
        const pid=(parts[0]||'').trim();
        const qtype=(parts[1]||'').trim();
        const ox=(parts[2]||'').trim();
        const corr=parts.length>=4?(parts[3]||'').trim():'';
        const chosen=parts.length>=5?(parts[4]||'').trim():'';
        rows.push(["'"+dateStr, examPeriod, p.name||'', sessionId,
                   qi+1, pid, qtype, corr, chosen, ox==='O'?1:0, '']);
      });
      if (rows.length) {
        dsh.getRange(dsh.getLastRow()+1,1,rows.length,rows[0].length).setValues(rows);
      }
    }
  } catch(e) { /* 상세 저장 실패는 무시(기존 저장은 이미 성공) */ }

  _bumpCache_();
  return { ok:true };
}

function getResults(p) {
  const ss=SpreadsheetApp.getActiveSpreadsheet();
  const sh=ss.getSheetByName(SHEET_RESULT);
  if (!sh) return { ok:true, results:[] };
  const data=sh.getDataRange().getDisplayValues(); const filter=p.student||''; const results=[];
  for (let i=1; i<data.length; i++) {
    const [date,name,score,rate,detail]=data[i];
    if (filter&&name!==filter) continue;
    results.push({ date,name,score,rate,detail });
  }
  return { ok:true, results };
}

// ════════ 캐시 레이어 (성능) ════════
const CACHE_TTL = 300;
const CACHE_VER_KEY = 'GE_CACHE_VER';

function _cacheVer_() {
  const props = PropertiesService.getScriptProperties();
  let v = props.getProperty(CACHE_VER_KEY);
  if (!v) { v = String(Date.now()); props.setProperty(CACHE_VER_KEY, v); }
  return v;
}

function _bumpCache_() {
  try { PropertiesService.getScriptProperties().setProperty(CACHE_VER_KEY, String(Date.now())); }
  catch (e) {}
}

function _cached_(key, fn) {
  let cache = null;
  try { cache = CacheService.getScriptCache(); } catch (e) {}
  const fullKey = 'v' + _cacheVer_() + '_' + key;
  if (cache) {
    try {
      const hit = cache.get(fullKey);
      if (hit) { const o = JSON.parse(hit); o._cached = true; return o; }
    } catch (e) {}
  }
  const result = fn();
  if (cache) {
    try {
      const s = JSON.stringify(result);
      if (s.length < 100000) cache.put(fullKey, s, CACHE_TTL);
    } catch (e) {}
  }
  return result;
}

function getStats(p) {
  const key = 'stats_' + ((p.student || '').trim() || 'ALL');
  return _cached_(key, function () { return getStats_uncached_(p); });
}

function getStats_uncached_(p) {
  const ss=SpreadsheetApp.getActiveSpreadsheet();
  const sh=ss.getSheetByName(SHEET_RESULT);
  if (!sh) return { ok:true, studentStats:[],typeStats:[],bookStats:[],wrongRanking:[] };
  const data=sh.getDataRange().getDisplayValues();
  if (data.length<2) return { ok:true, studentStats:[],typeStats:[],bookStats:[],wrongRanking:[] };
  const filterStudent=(p.student||'').trim();
  // (참고) 간격 보정(TAU)은 v6에서 랭킹 계산에서 제외됨.
  //   교재가 한정돼 많이 풀수록 반복이 늘어나 '많이 푼 학생'이 손해 보는 역설이 있었음.
  //   이제 랭킹은 '첫 시도 정답률 + 서로 다른 문제 수'로 계산한다(아래 effByStudent 참고).

  // ── 학생별 통계시작일 로드 (빈칸=전체 인식) ──
  const statsFromMap={};
  const clsMap={};   // 이름 → 클래스(G열)
  try {
    const stuSh=ss.getSheetByName(SHEET_STUDENT);
    if (stuSh) {
      const sd=stuSh.getDataRange().getDisplayValues();
      for (let i=1;i<sd.length;i++){
        const nm=String(sd[i][0]||'').trim();
        const sf=String(sd[i][5]||'').trim();
        if (nm && sf) {
          const d=new Date(sf);
          if (!isNaN(d)) statsFromMap[nm]=d.getTime();
        }
        if (nm) clsMap[nm]=String(sd[i][6]||'').trim();   // G열 클래스
      }
    }
  } catch(e) { /* 학생 시트 문제 시 필터 없이 진행 */ }

  const byStudent={}; const byType={}; const byBook={}; const byPid={}; const sessions=[];
  const histByStudent={}; // { name: { 'pid|type': [{day, ok}, ...] } }

  for (let i=1; i<data.length; i++) {
    const [date,name,score,rate,detail]=data[i];
    if (!name||!detail) continue;
    if (String(name).trim()==='관리자' && filterStudent!=='관리자') continue;
    if (filterStudent&&name!==filterStudent) continue;

    const dt=new Date(String(date).replace(' ','T'));

    const _sf=statsFromMap[String(name).trim()];
    if (_sf!==undefined && !isNaN(dt) && dt.getTime()<_sf) continue;

    if (!byStudent[name]) byStudent[name]={total:0,correct:0,count:0};
    byStudent[name].count++;
    if (filterStudent) sessions.push({ date:String(date),score:String(score),rate:String(rate),detail:String(detail) });

    const dayNum=isNaN(dt)?null:Math.floor(dt.getTime()/86400000);
    if (!histByStudent[name]) histByStudent[name]={};

    const items=String(detail).split('||').filter(x=>x.trim());
    items.forEach(item => {
      const parts=item.split('|'); if (parts.length<3) return;
      const pid=parts[0].trim(); const type=parts[1].trim(); const ox=parts[2].trim();
      const correct=ox==='O'?1:0;
      byStudent[name].total++; byStudent[name].correct+=correct;

      const key=pid+'|'+type;
      if (!histByStudent[name][key]) histByStudent[name][key]=[];
      histByStudent[name][key].push({day:dayNum, ok:correct===1});

      if (!byType[type]) byType[type]={total:0,correct:0};
      byType[type].total++; byType[type].correct+=correct;
      let book='';
      if      (pid.startsWith('ABSO_TYPE')) book='ABSO_TYPE';
      else if (pid.startsWith('27ST_E'))    book='27ST_E';
      else if (pid.startsWith('27STYD'))    book='27STYD';
      else book=pid.split('_')[0];
      if (!byBook[book]) byBook[book]={total:0,correct:0};
      byBook[book].total++; byBook[book].correct+=correct;
      if (!byPid[pid]) byPid[pid] = { wrong: 0, total: 0, types: {} };
      byPid[pid].total++;
      if (!correct) {
        byPid[pid].wrong++;
        byPid[pid].types[type] = (byPid[pid].types[type] || 0) + 1;
      }
    });
  }
  const pct=(c,t)=>t>0?Math.round(c/t*100):0;

  // ── 랭킹 기준: '첫 시도 정답률' + '서로 다른 문제 수(표본)' ──
  //   why: 교재가 한정돼 있어 많이 풀수록 같은 문제를 다시 만나게 된다.
  //        반복분을 깎는 방식은 '많이 푼 학생'이 손해를 보는 역설을 낳았다.
  //   how: 각 (지문|유형)의 첫 시도만 정답률에 반영 → 처음 보는 문제를 맞히는 실력.
  //        반복은 점수에 유리하지도 불리하지도 않다(복습은 사각지대/학습량이 따로 평가).
  //        표본 = 서로 다른 문제 수 → 좁은 범위만 도는 학생은 표본이 작아 평균으로 당겨짐.
  const effByStudent={};
  Object.keys(histByStudent).forEach(name=>{
    let fc=0, fn=0;   // 첫 시도 정답 수 / 서로 다른 문제 수
    const keys=histByStudent[name];
    Object.keys(keys).forEach(key=>{
      const arr=keys[key];
      if (!arr.length) return;
      fn++;                       // 이 (지문|유형)은 표본 1개
      if (arr[0].ok) fc++;        // 첫 시도 정오만 반영
    });
    effByStudent[name]={ec:fc, en:fn};
  });

  const _names=Object.keys(byStudent).filter(n=>n!=='관리자');
  const _effCorrect=_names.reduce((a,n)=>a+((effByStudent[n]&&effByStudent[n].ec)||0),0);
  const _effItems=_names.reduce((a,n)=>a+((effByStudent[n]&&effByStudent[n].en)||0),0);
  const _globalRate=_effItems>0?_effCorrect/_effItems:0;
  // C 고정: 표본(서로 다른 문제 수)이 적으면 평균 쪽으로 당기고,
  //   넓게 많이 푼 학생은 자기 실력이 그대로 드러난다.
  const C=100;
  const RANK_MIN_ITEMS=100;  // 랭킹 진입 최소 '서로 다른 문제 수'
  const adjRate=(ec,en)=>Math.round((_globalRate*C + ec)/(C + en)*100);

  const studentStats=Object.entries(byStudent).map(([name,v])=>{
    const eb=effByStudent[name]||{ec:0,en:0};
    const uniq=eb.en;                                // 서로 다른 문제 수
    const ranked=uniq>=RANK_MIN_ITEMS;
    return {
      name, count:v.count, correct:v.correct, total:v.total,
      cls:clsMap[String(name).trim()]||'',         // 클래스(G열) — 클래스별 랭킹용
      rate:pct(v.correct,v.total),                 // 표시용: 단순 정답률(전체 시도)
      adjRate:adjRate(eb.ec, eb.en),               // 랭킹: 첫시도 정답률 + 표본 보정
      uniq:uniq,                                   // 서로 다른 문제 수(표본)
      firstRate:pct(eb.ec, eb.en),                 // 첫 시도 정답률
      _ec:Math.round(eb.ec*10)/10,                 // 진단용(화면 미사용)
      _en:Math.round(eb.en*10)/10,                 // 진단용(화면 미사용)
      ranked:ranked,                               // false면 순위 제외 대상
      needMore:ranked?0:(RANK_MIN_ITEMS-uniq)
    };
  }).sort((a,b)=>{
    if (a.ranked!==b.ranked) return a.ranked?-1:1; // 표본 충족자 우선
    return b.adjRate-a.adjRate;
  });

  const typeStats=Object.entries(byType).map(([type,v])=>({ type,correct:v.correct,total:v.total,rate:pct(v.correct,v.total) })).sort((a,b)=>b.rate-a.rate);
  const bookLabels={'27ST_E':'27수특영어','27STYD':'27영독','ABSO_TYPE':'절대유형'};
  const bookStats=Object.entries(byBook).map(([book,v])=>({ book,label:bookLabels[book]||book,correct:v.correct,total:v.total,rate:pct(v.correct,v.total) })).sort((a,b)=>b.rate-a.rate);
  const wrongRanking = Object.entries(byPid).map(([pid, v]) => ({
    pid,
    wrong: v.wrong,
    total: v.total,
    rate: pct(v.total - v.wrong, v.total),
    types: Object.entries(v.types)
      .map(([t, w]) => ({ type: t, wrong: w }))
      .sort((a, b) => b.wrong - a.wrong)
  })).filter(x => x.wrong > 0)
    .sort((a, b) => b.wrong !== a.wrong ? b.wrong - a.wrong : b.total - a.total)
    .slice(0, 20);
  const result={ ok:true, studentStats, typeStats, bookStats, wrongRanking };
  if (filterStudent) result.sessionStats=sessions;
  return result;
}

function saveHitResult(p) {
  try {
    const ss=SpreadsheetApp.getActiveSpreadsheet();
    let sheet=ss.getSheetByName('적중률');
    if (!sheet) {
      sheet=ss.insertSheet('적중률');
      sheet.appendRow(['key','school','grade','year','semester','exam',
                       'type_hit','type_total','type_hit_rate',
                       'pred_patterns_json','actual_patterns_json','summary','saved_at']);
      sheet.setFrozenRows(1);
    }
    const data=JSON.parse(p.data||'{}');
    const row=[data.key||'',data.school||'',data.grade||'',data.year||'',
               data.semester||'',data.exam||'',
               data.typeHit||0,data.typeTotal||0,data.typeHitRate||0,
               JSON.stringify(data.predPatterns||{}),
               JSON.stringify(data.actualPatterns||{}),
               data.summary||'',new Date().toISOString()];
    sheet.appendRow(row);
    return { ok:true };
  } catch(e) { return { ok:false, error:e.message }; }
}

function getHitResults(p) {
  try {
    const ss=SpreadsheetApp.getActiveSpreadsheet();
    const sheet=ss.getSheetByName('적중률');
    if (!sheet) return { ok:true, list:[] };
    const rows=sheet.getDataRange().getValues();
    if (rows.length<=1) return { ok:true, list:[] };
    const headers=rows[0];
    const list=rows.slice(1).map(row => {
      const obj={}; headers.forEach((h,i) => { obj[h]=row[i]; });
      try { obj.predPatterns=JSON.parse(obj.pred_patterns_json); } catch(e){}
      try { obj.actualPatterns=JSON.parse(obj.actual_patterns_json); } catch(e){}
      return obj;
    });
    return { ok:true, list };
  } catch(e) { return { ok:false, error:e.message }; }
}

function saveAnalysis(p) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName('기출패턴');
  if (!sh) sh = ss.insertSheet('기출패턴');
  const key = p.key;
  const json = JSON.stringify(p.data);
  const savedAt = new Date().toISOString();
  const data = sh.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === key) {
      sh.getRange(i+1, 1, 1, 3).setValues([[key, json, savedAt]]);
      return {ok: true, key};
    }
  }
  sh.appendRow([key, json, savedAt]);
  return {ok: true, key};
}

function getAnalysisList(p) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sh = ss.getSheetByName('기출패턴');
  if (!sh) return {ok: true, list: []};
  const data = sh.getDataRange().getValues();
  const list = [];
  for (let i = 1; i < data.length; i++) {
    if (data[i][0]) {
      try {
        list.push({key: data[i][0], data: JSON.parse(data[i][1]), savedAt: data[i][2]});
      } catch(e) {}
    }
  }
  return {ok: true, list};
}

function saveMiddlePassage(p) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName('중등지문');
  if (!sh) {
    sh = ss.insertSheet('중등지문');
    sh.appendRow(['school','grade','publisher','author','year','semester','lesson','body_text','dialog_text','grammar_points','saved_at']);
  }
  const row = [
    p.school||'', p.grade||'', p.publisher||'', p.author||'',
    p.year||'', p.semester||'', p.lesson||'',
    p.body_text||'', p.dialog_text||'', p.grammar_points||'',
    new Date().toISOString()
  ];
  const data = sh.getDataRange().getValues();
  for(let i=1; i<data.length; i++){
    if(data[i][0]===row[0] && data[i][1]===row[1] &&
       data[i][2]===row[2] && data[i][3]===row[3] &&
       data[i][6]===row[6]){
      sh.getRange(i+1,1,1,row.length).setValues([row]);
      return {ok:true, updated:true};
    }
  }
  sh.appendRow(row);
  return {ok:true, updated:false};
}

function getMiddlePassages(p) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sh = ss.getSheetByName('중등지문');
  if (!sh) return {ok:true, list:[]};
  const rows = sh.getDataRange().getValues();
  const headers = rows[0];
  const eq = (a, b) => String(a == null ? '' : a).trim() === String(b == null ? '' : b).trim();
  const list = rows.slice(1).filter(r=>r[0]).map(r=>{
    const obj={};
    headers.forEach((h,i)=>obj[h]=r[i]);
    return obj;
  }).filter(r=>
    (!p.school    || eq(r.school,    p.school)) &&
    (!p.grade     || eq(r.grade,     p.grade)) &&
    (!p.year      || eq(r.year,      p.year)) &&
    (!p.semester  || eq(r.semester,  p.semester)) &&
    (!p.publisher || eq(r.publisher, p.publisher)) &&
    (!p.author    || eq(r.author,    p.author)) &&
    (!p.lesson    || eq(r.lesson,    p.lesson))
  );
  return {ok:true, list};
}

function getBooks(p) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sh = ss.getSheetByName(SHEET_BOOKS);
    if (!sh) return { ok: true, books: [] };
    const data = sh.getDataRange().getValues();
    if (data.length < 2) return { ok: true, books: [] };
    const headers = data[0];
    const col = {};
    headers.forEach((h, i) => { col[h] = i; });
    const books = [];
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const id = row[col['id']];
      if (!id) continue;
      const book = {
        id: String(id),
        label: String(row[col['label']] || id),
        storage: String(row[col['storage']] || 'sheet')
      };
      const metaRaw = row[col['meta_json']];
      if (metaRaw) { try { Object.assign(book, JSON.parse(metaRaw)); } catch (e) {} }
      books.push(book);
    }
    return { ok: true, books };
  } catch (e) { return { ok: false, error: e.message }; }
}

function saveBooks(p) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sh = ss.getSheetByName(SHEET_BOOKS);
    if (!sh) {
      sh = ss.insertSheet(SHEET_BOOKS);
      sh.appendRow(['id', 'label', 'storage', 'meta_json', 'updated_at']);
      sh.setFrozenRows(1);
    }
    let books;
    try { books = JSON.parse(p.books_json || '[]'); }
    catch (e) { throw new Error('books_json 파싱 실패: ' + e.message); }
    if (!Array.isArray(books)) throw new Error('books_json은 배열이어야 함');

    const now = new Date().toISOString();
    const data = sh.getDataRange().getValues();
    const headers = data[0];
    const col = {};
    headers.forEach((h, i) => { col[h] = i; });

    const idRow = {};
    for (let i = 1; i < data.length; i++) {
      if (data[i][col['id']]) idRow[String(data[i][col['id']])] = i + 1;
    }

    books.forEach(b => {
      if (!b || !b.id) return;
      const meta = {};
      Object.keys(b).forEach(k => {
        if (k !== 'id' && k !== 'label' && k !== 'storage') meta[k] = b[k];
      });
      const row = [
        String(b.id),
        String(b.label || b.id),
        String(b.storage || 'sheet'),
        Object.keys(meta).length ? JSON.stringify(meta) : '',
        now
      ];
      const existing = idRow[String(b.id)];
      if (existing) { sh.getRange(existing, 1, 1, row.length).setValues([row]); }
      else { sh.appendRow(row); idRow[String(b.id)] = sh.getLastRow(); }
    });
    return { ok: true, saved: books.length };
  } catch (e) { return { ok: false, error: e.message }; }
}

function getExamSheet_() {
  const ss = SpreadsheetApp.getActive();
  let sh = ss.getSheetByName('exams');
  if (!sh) {
    sh = ss.insertSheet('exams');
    sh.appendRow(['key','school','grade','year','semester','exam','total','savedAt','json']);
  }
  return sh;
}

function saveExam(p) {
  const d = JSON.parse(p.data || p.payload || '{}');
  if (!d.key) return { ok: false, error: 'key 없음' };
  const sh = getExamSheet_();
  const rows = sh.getDataRange().getValues();
  const m = d.meta || {};
  const row = [d.key, m.school||'', m.grade||'', m.year||'', m.semester||'',
               m.exam||'', m.total||'', d.savedAt||new Date().toISOString(),
               JSON.stringify(d)];
  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][0]) === String(d.key)) {
      sh.getRange(i + 1, 1, 1, row.length).setValues([row]);
      return { ok: true, updated: true };
    }
  }
  sh.appendRow(row);
  return { ok: true, created: true };
}

function getExamList() {
  const sh = getExamSheet_();
  const rows = sh.getDataRange().getValues();
  if (rows.length < 2) return { ok: true, list: [] };
  const list = [];
  for (let i = 1; i < rows.length; i++) {
    if (!rows[i][0]) continue;
    list.push({
      key: rows[i][0], school: rows[i][1], grade: rows[i][2],
      year: rows[i][3], semester: rows[i][4], exam: rows[i][5],
      total: rows[i][6], savedAt: rows[i][7]
    });
  }
  return { ok: true, list };
}

function getRank(p) {
  const key = 'rank_' + ((p.student || '').trim() || 'ALL');
  return _cached_(key, function () { return getRank_uncached_(p); });
}

function getRank_uncached_(p) {
  const MIN_ITEMS = 100;
  const TOP_N = 3;
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sh = ss.getSheetByName(SHEET_RESULT);
  if (!sh) return { ok: true, show: false };
  const data = sh.getDataRange().getDisplayValues();
  if (data.length < 2) return { ok: true, show: false };
  const me = (p.student || '').trim();
  if (!me) return { ok: true, show: false };

  const statsFromMap = {};
  try {
    const stuSh = ss.getSheetByName(SHEET_STUDENT);
    if (stuSh) {
      const sd = stuSh.getDataRange().getDisplayValues();
      for (let i = 1; i < sd.length; i++) {
        const nm = String(sd[i][0] || '').trim();
        const sf = String(sd[i][5] || '').trim();
        if (nm && sf) { const d = new Date(sf); if (!isNaN(d)) statsFromMap[nm] = d.getTime(); }
      }
    }
  } catch (e) {}

  const acc = {};
  for (let i = 1; i < data.length; i++) {
    const [date, name, score, rate, detail] = data[i];
    if (!name || !detail || name === '관리자') continue;
    const _sf = statsFromMap[String(name).trim()];
    if (_sf !== undefined) {
      const dt = new Date(String(date).replace(' ', 'T'));
      if (!isNaN(dt) && dt.getTime() < _sf) continue;
    }
    if (!acc[name]) acc[name] = { correct: 0, total: 0 };
    String(detail).split('||').filter(x => x.trim()).forEach(item => {
      const parts = item.split('|');
      if (parts.length < 3) return;
      acc[name].total++;
      if (parts[2].trim() === 'O') acc[name].correct++;
    });
  }

  const allNames = Object.keys(acc);
  const gCorrect = allNames.reduce((a, n) => a + acc[n].correct, 0);
  const gItems = allNames.reduce((a, n) => a + acc[n].total, 0);
  const gRate = gItems > 0 ? gCorrect / gItems : 0;
  const C = 100;

  const ranked = allNames
    .filter(n => acc[n].total >= MIN_ITEMS)
    .map(n => ({ n, rate: (gRate * C + acc[n].correct) / (C + acc[n].total) }))
    .sort((a, b) => b.rate - a.rate);

  const idx = ranked.findIndex(r => r.n === me);
  if (idx === -1 || idx >= TOP_N) return { ok: true, show: false };
  return { ok: true, show: true, rank: idx + 1, total: ranked.length };
}

// ════════ 시험범위 프리셋 (공용) ════════
const SHEET_PRESET = '프리셋';

function getPresetSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(SHEET_PRESET);
  if (!sh) {
    sh = ss.insertSheet(SHEET_PRESET);
    sh.appendRow(['id', 'name', 'ranges_json', 'updated_at']);
    sh.setFrozenRows(1);
  }
  return sh;
}

function getPresets(p) {
  try {
    const sh = getPresetSheet_();
    const data = sh.getDataRange().getValues();
    if (data.length < 2) return { ok: true, presets: [] };
    const presets = [];
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      if (!row[0]) continue;
      let ranges = [];
      try { ranges = JSON.parse(row[2] || '[]'); } catch (e) { ranges = []; }
      presets.push({
        id: String(row[0]),
        name: String(row[1] || ''),
        ranges: Array.isArray(ranges) ? ranges : [],
        updated_at: row[3] ? String(row[3]) : ''
      });
    }
    presets.sort((a, b) => String(b.updated_at).localeCompare(String(a.updated_at)));
    return { ok: true, presets };
  } catch (e) { return { ok: false, error: e.message }; }
}

function savePreset(p) {
  try {
    const name = (p.name || '').trim();
    if (!name) throw new Error('name 필수');
    let ranges;
    try { ranges = JSON.parse(p.ranges_json || '[]'); }
    catch (e) { throw new Error('ranges_json 파싱 실패: ' + e.message); }
    if (!Array.isArray(ranges)) throw new Error('ranges_json은 배열이어야 함');

    const sh = getPresetSheet_();
    const now = new Date().toISOString();
    const id = (p.id || '').trim() || ('PR_' + Date.now());
    const rangesStr = JSON.stringify(ranges);
    const data = sh.getDataRange().getValues();
    for (let i = 1; i < data.length; i++) {
      if (String(data[i][0]) === id) {
        sh.getRange(i + 1, 1, 1, 4).setValues([[id, name, rangesStr, now]]);
        return { ok: true, id, action: 'updated' };
      }
    }
    sh.appendRow([id, name, rangesStr, now]);
    return { ok: true, id, action: 'inserted' };
  } catch (e) { return { ok: false, error: e.message }; }
}

function deletePreset(p) {
  try {
    const id = (p.id || '').trim();
    if (!id) throw new Error('id 필수');
    const sh = getPresetSheet_();
    const data = sh.getDataRange().getValues();
    for (let i = data.length - 1; i >= 1; i--) {
      if (String(data[i][0]) === id) {
        sh.deleteRow(i + 1);
        return { ok: true, id };
      }
    }
    return { ok: false, error: '프리셋 없음' };
  } catch (e) { return { ok: false, error: e.message }; }
}

// ════════════════════════════════════════════════════════════
// 시험기간 설정 / 아카이빙 / 상세 진단 집계 (상담리포트 지원)
// ════════════════════════════════════════════════════════════

function setExamPeriod(p) {
  const adminPw=PropertiesService.getScriptProperties().getProperty(PROP_ADMIN_PW)||DEFAULT_ADMIN_PW;
  if ((p.adminPw||'')!==adminPw) return { ok:false, error:'관리자 인증 실패' };
  const v=(p.period||'').trim();
  PropertiesService.getScriptProperties().setProperty(PROP_EXAM_PERIOD, v);
  return { ok:true, period:v };
}

function getExamPeriod(p) {
  const v=PropertiesService.getScriptProperties().getProperty(PROP_EXAM_PERIOD)||'';
  return { ok:true, period:v };
}

function listExamPeriods(p) {
  const ss=SpreadsheetApp.getActiveSpreadsheet();
  const sh=ss.getSheetByName(SHEET_RESULT_DETAIL);
  if (!sh) return { ok:true, periods:[] };
  const data=sh.getDataRange().getDisplayValues();
  if (data.length<2) return { ok:true, periods:[] };
  const set={};
  for (let i=1;i<data.length;i++){
    const v=String(data[i][1]||'').trim();
    if (v) set[v]=true;
  }
  return { ok:true, periods:Object.keys(set) };
}

function archiveResults(p) {
  const adminPw=PropertiesService.getScriptProperties().getProperty(PROP_ADMIN_PW)||DEFAULT_ADMIN_PW;
  if ((p.adminPw||'')!==adminPw) return { ok:false, error:'관리자 인증 실패' };
  const label=(p.label||'').trim();
  if (!label) return { ok:false, error:'label(아카이브 이름) 필수' };
  const wipe = String(p.wipe||'')==='true';

  const ss=SpreadsheetApp.getActiveSpreadsheet();
  const src=ss.getSheetByName(SHEET_RESULT);
  const srcD=ss.getSheetByName(SHEET_RESULT_DETAIL);
  if (!src) return { ok:false, error:'결과 시트 없음' };

  const arcName='결과_'+label;
  const arcNameD='결과_상세_'+label;
  if (ss.getSheetByName(arcName)) return { ok:false, error:'이미 존재하는 아카이브: '+arcName };

  const arc=src.copyTo(ss);
  arc.setName(arcName);

  if (srcD && !ss.getSheetByName(arcNameD)) {
    const arcD=srcD.copyTo(ss);
    arcD.setName(arcNameD);
  }

  let wiped=false;
  if (wipe) {
    const lr=src.getLastRow();
    if (lr>1) src.deleteRows(2, lr-1);
    if (srcD) { const lrd=srcD.getLastRow(); if (lrd>1) srcD.deleteRows(2, lrd-1); }
    wiped=true;
    _bumpCache_();
  }
  return { ok:true, archived:arcName, archivedDetail:(srcD?arcNameD:''), wiped };
}

function getStatsDetailed(p) {
  const key = 'detail_' + ((p.period||'').trim()||'ALL') + '_' + ((p.student||'').trim()||'ALL') + '_' + ((p.sheet||'').trim()||'DEF');
  return _cached_(key, function () { return getStatsDetailed_uncached_(p); });
}

function getStatsDetailed_uncached_(p) {
  const ss=SpreadsheetApp.getActiveSpreadsheet();
  const filterStudent=(p.student||'').trim();
  const filterPeriod=(p.period||'').trim();
  const useAll = !filterPeriod || filterPeriod==='전체';

  let sh;
  if (p.sheet) { sh=ss.getSheetByName(String(p.sheet)); }
  else { sh=ss.getSheetByName(SHEET_RESULT_DETAIL); }
  if (!sh) return { ok:true, students:[], periods:[] };
  const data=sh.getDataRange().getDisplayValues();
  if (data.length<2) return { ok:true, students:[], periods:[] };

  const H={}; data[0].forEach((h,i)=>{H[String(h).trim()]=i;});
  const ci={
    ts:H['timestamp'], period:H['exam_period'], name:H['student_name'],
    sess:H['session_id'], qno:H['q_no'], pid:H['pid'], qtype:H['q_type'],
    corr:H['correct_ans'], chosen:H['chosen_ans'], ok:H['is_correct']
  };

  const byStu={};
  const periodSet={};

  for (let i=1;i<data.length;i++){
    const row=data[i];
    const name=String(row[ci.name]||'').trim();
    if (!name || name==='관리자') continue;
    const period=String(row[ci.period]||'').trim();
    if (period) periodSet[period]=true;
    if (!useAll && period!==filterPeriod) continue;
    if (filterStudent && name!==filterStudent) continue;

    const type=String(row[ci.qtype]||'').trim();
    const ok=String(row[ci.ok]||'').trim()==='1'?1:0;
    const sid=String(row[ci.sess]||'').trim();
    const date=String(row[ci.ts]||'').replace(/^'/,'');
    const pid=String(row[ci.pid]||'').trim();
    const chosen=String(row[ci.chosen]||'').trim();
    const corr=String(row[ci.corr]||'').trim();

    if (!byStu[name]) byStu[name]={types:{}, sessions:{}, wrong:[], total:0, correct:0};
    const S=byStu[name];
    S.total++; S.correct+=ok;
    if (!S.types[type]) S.types[type]={c:0,t:0};
    S.types[type].t++; S.types[type].c+=ok;
    if (!S.sessions[sid]) S.sessions[sid]={date, c:0, t:0};
    S.sessions[sid].t++; S.sessions[sid].c+=ok;
    if (!ok) S.wrong.push({pid, type, correct_ans:corr, chosen_ans:chosen, date});
  }

  const pct=(c,t)=>t>0?Math.round(c/t*100):0;
  const students=Object.keys(byStu).map(name=>{
    const S=byStu[name];
    const typeStats=Object.keys(S.types).map(t=>({
      type:t, correct:S.types[t].c, total:S.types[t].t, rate:pct(S.types[t].c,S.types[t].t)
    })).sort((a,b)=>a.rate-b.rate);
    const sessions=Object.keys(S.sessions).map(sid=>({
      session_id:sid, date:S.sessions[sid].date,
      correct:S.sessions[sid].c, total:S.sessions[sid].t, rate:pct(S.sessions[sid].c,S.sessions[sid].t)
    })).sort((a,b)=>String(a.date).localeCompare(String(b.date)));
    return {
      name, total:S.total, correct:S.correct, rate:pct(S.correct,S.total),
      typeStats, sessions, wrong:S.wrong
    };
  }).sort((a,b)=>b.rate-a.rate);

  return { ok:true, students, periods:Object.keys(periodSet), period:(useAll?'전체':filterPeriod) };
}
