(function(){
  function onReady(fn){ if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',fn);else fn(); }
  onReady(function(){
    // collapse-toggle behavior
    document.querySelectorAll('.collapse-toggle').forEach(function(btn){
      btn.addEventListener('click', function(e){ e.preventDefault(); var container = btn.closest('.nav-container'); var menu = container ? container.querySelector('.collapse-menu') : document.querySelector('.collapse-menu'); if(!menu) return; var opened = menu.classList.toggle('open'); btn.setAttribute('aria-expanded', opened? 'true':'false'); menu.setAttribute('aria-hidden', opened? 'false':'true'); });
    });
    // click outside closes
    document.addEventListener('click', function(e){ if(!e.target.closest('.nav-container')){ document.querySelectorAll('.collapse-menu.open').forEach(function(m){ m.classList.remove('open'); m.setAttribute('aria-hidden','true'); }); document.querySelectorAll('.collapse-toggle[aria-expanded="true"]').forEach(function(b){ b.setAttribute('aria-expanded','false'); }); } });
  });
})();
