/* ============================================================
   GREENG 메인 적중요약 렌더러 (results-summary.js)
   ------------------------------------------------------------
   main.html에서 results.js 다음에 로드하세요.
   #hsGrid 안에 최근 2개 시험 카드를 자동으로 그립니다.
   (results.js 하나만 갱신하면 이 섹션도 같이 갱신됩니다.)
   ============================================================ */
(function(){
  var grid = document.getElementById("hsGrid");
  if (!grid) return;
  if (typeof RESULTS === "undefined" || !Array.isArray(RESULTS) || !RESULTS.length){
    grid.innerHTML = "";
    return;
  }
  function esc(s){
    return String(s==null?"":s).replace(/[&<>"']/g,function(c){
      return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c];
    });
  }
  var data = RESULTS.slice().sort(function(a,b){
    return (b.date||"").localeCompare(a.date||"");
  }).slice(0, 2); // 최근 2건만

  grid.innerHTML = data.map(function(r){
    var pct = r.total ? Math.round(r.hit/r.total*100) : 0;
    return '<div class="hs-card">' +
      '<div class="school">'+esc(r.school)+'</div>' +
      '<div class="exam">'+esc(r.exam)+'</div>' +
      '<div class="rate"><span class="pct">'+pct+'%</span>' +
      '<span class="frac">'+r.hit+' / '+r.total+' 적중</span></div>' +
      '<div class="basis">'+esc(r.basis||"")+'</div>' +
    '</div>';
  }).join("");
})();
