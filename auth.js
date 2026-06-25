/* ============================================================
 *  GREATENG 공통 관리자 게이트  ·  auth.js
 *  ------------------------------------------------------------
 *  사용법: 보호할 관리 페이지 <head> 안, 다른 스크립트보다 먼저 한 줄 추가
 *      <script src="auth.js"></script>
 *
 *  동작:
 *   - 페이지 로드 즉시(본체 렌더 전) 인증 여부 확인
 *   - 미인증이면 전체 화면 잠금 오버레이를 띄우고 비밀번호 요구
 *   - 통과하면 localStorage에 인증 시각 저장 → 같은 브라우저에서 7일간 재입력 없음(새 탭·재시작 무관)
 *   - 7일이 지나면 다시 한 번 비밀번호를 묻습니다
 *
 *  ⚠️ 한계(반드시 인지): GitHub Pages 정적 호스팅이라 이 게이트는
 *     "화면을 가리는 1층"입니다. 데이터를 직접 내주는 GAS(hw-monitor 등)는
 *     이 게이트와 무관하게 여전히 응답합니다. 완전 차단은 GAS doGet에
 *     토큰 검사를 넣는 2층 작업이 필요합니다(시험기간 후 별도 진행).
 *
 *  비밀번호 변경:  아래 PW_HASH 를 새 비번의 SHA-256 값으로 교체.
 *     해시 생성:  브라우저 콘솔에서
 *       crypto.subtle.digest('SHA-256', new TextEncoder().encode('새비번'))
 *         .then(b=>console.log([...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('')))
 * ============================================================ */
(function () {
  'use strict';

  // 'vlfl2125' 의 SHA-256 (평문 미노출)
  var PW_HASH = '1262090373cc2818e4b632e4667fbb191a5bb7fddcb1f12d642693ede022c3d1';
  var SESSION_KEY = 'greateng_admin_authed_at';  // 인증 시각(ms) 저장
  var MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;       // 7일

  // 이미 인증된 브라우저면 통과 (7일 이내, 새 탭·재시작 무관)
  try {
    var savedAt = parseInt(localStorage.getItem(SESSION_KEY) || '0', 10);
    if (savedAt && (Date.now() - savedAt) < MAX_AGE_MS) return;
  } catch (e) { /* localStorage 불가 환경: 아래 게이트로 진행 */ }

  // ── 본체 렌더 차단용 전체화면 오버레이 ──────────────────────
  // DOM이 아직 없을 수 있으므로 즉시 실행 스타일 + 지연 마운트 병행
  var STYLE = [
    '#greateng-gate{position:fixed;inset:0;z-index:2147483647;',
    'background:linear-gradient(160deg,#241A16 0%,#3a1420 60%,#7A0F24 100%);',
    'display:flex;align-items:center;justify-content:center;',
    "font-family:'Pretendard',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;}",
    '#greateng-gate .box{width:min(360px,86vw);background:rgba(255,255,255,.06);',
    'backdrop-filter:blur(8px);border:1px solid rgba(194,160,90,.35);',
    'border-radius:20px;padding:34px 28px;text-align:center;',
    'box-shadow:0 24px 60px rgba(0,0,0,.45);}',
    '#greateng-gate .logo{font-size:13px;letter-spacing:3px;color:#C2A05A;',
    'font-weight:700;margin-bottom:6px;}',
    '#greateng-gate h1{color:#fff;font-size:18px;margin:0 0 4px;font-weight:700;}',
    '#greateng-gate p{color:rgba(255,255,255,.55);font-size:12.5px;margin:0 0 22px;}',
    '#greateng-gate input{width:100%;box-sizing:border-box;padding:14px 16px;',
    'border-radius:12px;border:1.5px solid rgba(194,160,90,.4);',
    'background:rgba(0,0,0,.25);color:#fff;font-size:16px;text-align:center;',
    'outline:none;margin-bottom:12px;font-family:inherit;}',
    '#greateng-gate input:focus{border-color:#C2A05A;}',
    '#greateng-gate button{width:100%;padding:14px;border:none;border-radius:12px;',
    'background:#C2A05A;color:#241A16;font-size:15px;font-weight:700;',
    'cursor:pointer;font-family:inherit;transition:filter .15s;}',
    '#greateng-gate button:hover{filter:brightness(1.08);}',
    '#greateng-gate .err{color:#ff9b9b;font-size:12.5px;height:16px;margin-bottom:8px;}',
    'html.greateng-locked,body.greateng-locked{overflow:hidden !important;}'
  ].join('');

  function injectStyle() {
    var s = document.createElement('style');
    s.id = 'greateng-gate-style';
    s.textContent = STYLE;
    (document.head || document.documentElement).appendChild(s);
  }

  function sha256Hex(str) {
    var enc = new TextEncoder().encode(str);
    return crypto.subtle.digest('SHA-256', enc).then(function (buf) {
      return [].slice.call(new Uint8Array(buf))
        .map(function (b) { return b.toString(16).padStart(2, '0'); }).join('');
    });
  }

  function mountGate() {
    if (document.getElementById('greateng-gate')) return;
    injectStyle();
    try { document.documentElement.classList.add('greateng-locked'); } catch (e) {}

    var ov = document.createElement('div');
    ov.id = 'greateng-gate';
    ov.innerHTML =
      '<div class="box">' +
        '<div class="logo">GREATENG</div>' +
        '<h1>관리자 전용</h1>' +
        '<p>이 페이지는 관리자 인증이 필요합니다.</p>' +
        '<div class="err" id="greateng-gate-err"></div>' +
        '<input id="greateng-gate-pw" type="password" placeholder="비밀번호" ' +
          'autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false">' +
        '<button id="greateng-gate-go">입력</button>' +
      '</div>';
    document.body.appendChild(ov);
    try { document.body.classList.add('greateng-locked'); } catch (e) {}

    var pw  = document.getElementById('greateng-gate-pw');
    var go  = document.getElementById('greateng-gate-go');
    var err = document.getElementById('greateng-gate-err');

    function submit() {
      var v = pw.value || '';
      if (!v) { err.textContent = '비밀번호를 입력하세요.'; return; }
      sha256Hex(v).then(function (h) {
        if (h === PW_HASH) {
          try { localStorage.setItem(SESSION_KEY, String(Date.now())); } catch (e) {}
          try {
            document.documentElement.classList.remove('greateng-locked');
            document.body.classList.remove('greateng-locked');
          } catch (e) {}
          ov.parentNode && ov.parentNode.removeChild(ov);
        } else {
          err.textContent = '비밀번호가 올바르지 않습니다.';
          pw.value = ''; pw.focus();
        }
      });
    }

    go.addEventListener('click', submit);
    pw.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') submit();
    });
    setTimeout(function () { pw.focus(); }, 60);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mountGate);
  } else {
    mountGate();
  }
})();
