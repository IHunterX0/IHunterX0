/* 1001 — Gerçek hologram katmanı (kullanıcı, 2026-11-03: "şu uygulamayı rijit yapma, gittikçe rijitleştiriyorsun; attığın resimlerin
   hologramla alakası yok, çok katılar", "sol üstteki 1001 simgesini kaldır").
   İlke: hologramda dolu yüzey yoktur — ışıktan yapılmıştır. Paneller saydam; kenarlar uçlara doğru sönen ışık çizgileri; yazılar
   hafif parlar; sayfa havada hafif açıyla süzülür, dokunma/eğimle paralaks yapar; hafif titreşim ve tarama. Okuma modunda sade kalır. */
(function () {
  'use strict';
  if (/[?&]gomulu\b/.test(location.search)) return;
  var st = document.createElement('style');
  var PANEL = '#ana .sayfa > .kahraman,.koc-yontem > div,.koc-kpi > div,.sonuc,.not-kart,.tablo-kap,.ray-bolum,.kk-alinti,.kitap-kart,.tarih-kart,.analiz-kutu,.metin-kart,.sp-kutu,.oncelik-satir,.an-oneri,.jv-panel,.dp-is-kart,.dp-bolum,.dp-gun,.tt-kutu,.yp-cevap,.mk-kart,.hc-kart,.hc-aciklama,.hc-tuval,.lab-kutu,.lab-durum';
  st.textContent = [
    /* logo yok */
    '.logo{display:none!important}',
    'a.hc-kart,a.hc-kart *{text-decoration:none!important}',
    /* paneller: ışıktan */
    PANEL + '{background:radial-gradient(120% 80% at 50% 0%,rgba(94,240,220,.07),transparent 60%)!important;border:0!important;box-shadow:none!important;backdrop-filter:none!important;-webkit-backdrop-filter:none!important;border-radius:22px!important;position:relative;isolation:isolate}',
    PANEL.split(',').map(function (s) { return s + '::before'; }).join(',') + '{content:"";position:absolute!important;inset:0!important;width:auto!important;height:auto!important;border-radius:inherit;padding:1px;pointer-events:none;z-index:-1;' +
      'background:linear-gradient(90deg,transparent 0%,rgba(110,255,235,.55) 18%,rgba(110,255,235,.12) 50%,rgba(110,255,235,.55) 82%,transparent 100%) top/100% 1px no-repeat,linear-gradient(90deg,transparent 10%,rgba(110,255,235,.28) 50%,transparent 90%) bottom/100% 1px no-repeat,linear-gradient(180deg,rgba(110,255,235,.35),transparent 70%) left/1px 100% no-repeat,linear-gradient(180deg,rgba(110,255,235,.35),transparent 70%) right/1px 100% no-repeat!important;box-shadow:none!important;left:0!important;right:0!important;top:0!important}',
    PANEL.split(',').map(function (s) { return s + '::after'; }).join(',') + '{content:"";position:absolute!important;inset:0!important;border-radius:inherit;pointer-events:none;z-index:-1;background:repeating-linear-gradient(0deg,rgba(140,255,240,.035) 0 1px,transparent 1px 4px)!important;animation:h2Titre 6s steps(1) infinite!important;transform:none!important}',
    '@keyframes h2Titre{0%,100%{opacity:1}47%{opacity:.6}48%{opacity:1}83%{opacity:.8}84%{opacity:1}}',
    /* yazılar parlasın */
    '#ana .sayfa{color:#d8fff8}',
    '#ana .sayfa h1,#ana .sayfa h2,#ana .sayfa h3,.jv-panel h3,.hc-aciklama h3{text-shadow:0 0 14px rgba(94,240,220,.55),0 0 2px rgba(200,255,250,.6)!important}',
    '#ana .sayfa b,#ana .sayfa strong{text-shadow:0 0 10px rgba(94,240,220,.35)}',
    /* düğmeler: dolu değil, ışık kenarlı */
    '.dugme,.cip,.jv-yuva button,.dp-is-kart,.hc-evreler button{background:transparent!important;border:1px solid rgba(110,255,235,.35)!important;box-shadow:0 0 12px rgba(94,240,220,.12),inset 0 0 12px rgba(94,240,220,.08)!important;color:#c9fff5!important;text-shadow:0 0 8px rgba(94,240,220,.5)}',
    '.dugme.ana{border-color:rgba(160,255,240,.75)!important;box-shadow:0 0 18px rgba(94,240,220,.35),inset 0 0 16px rgba(94,240,220,.18)!important;color:#fff!important}',
    '.dugme:hover,.cip:hover,.dugme:focus-visible,.cip:focus-visible{box-shadow:0 0 22px rgba(94,240,220,.45),inset 0 0 18px rgba(94,240,220,.2)!important}',
    'input,select,textarea{background:rgba(94,240,220,.03)!important;border:1px solid rgba(110,255,235,.25)!important;border-radius:999px;color:#e6fffb!important}',
    'textarea{border-radius:16px!important}',
    /* üst çubuk: düz şerit değil, ışık çizgisi */
    'header,.serit{background:linear-gradient(180deg,rgba(2,10,14,.55),transparent)!important;border-bottom:0!important;box-shadow:none!important}',
    'header::after,.serit::after{content:"";position:absolute;left:8%;right:8%;bottom:0;height:1px;background:linear-gradient(90deg,transparent,rgba(110,255,235,.5),transparent)}',
    '.hud-nav{background:transparent!important;border-color:transparent!important;backdrop-filter:none!important}',
    /* sayfa: havada süzülür */
    '#ana{perspective:1600px}',
    '#ana > .sayfa{transform-style:preserve-3d;transform:rotateX(var(--h2x,2deg)) rotateY(var(--h2y,0deg));transform-origin:50% 0;transition:transform .9s cubic-bezier(.2,.8,.2,1)}',
    'body.fx-okuma #ana > .sayfa{transform:none!important}',
    /* Jarvis panosu: zemin çizgisi ve kutu yok */
    '.jv-pano{background:radial-gradient(ellipse at 50% 55%,rgba(30,120,130,.16),transparent 62%)!important;border:0!important}',
    '.jv-pano::after{display:none!important}',
    /* kapsül de ışıktan */
    '.ak-kapsul{background:radial-gradient(100% 140% at 50% 100%,rgba(94,240,220,.14),transparent 70%)!important;border-color:rgba(110,255,235,.22)!important}',
    '@media (prefers-reduced-motion: reduce){' + PANEL.split(',').map(function (s) { return s + '::after'; }).join(',') + '{animation:none!important}#ana > .sayfa{transform:none!important}}'
  ].join('\n');
  document.head.appendChild(st);
  try { document.title = 'C.A.R.V.I.S.'; } catch (e) {}

  // paralaks: parmak/fare ve cihaz eğimi
  var hx = 2, hy = 0, zm = null;
  function uygula() { var s = document.querySelector('#ana > .sayfa'); if (!s) return; s.style.setProperty('--h2x', hx.toFixed(2) + 'deg'); s.style.setProperty('--h2y', hy.toFixed(2) + 'deg'); }
  window.addEventListener('pointermove', function (e) {
    if (e.pointerType === 'touch' && e.buttons) return;
    hx = 2 - (e.clientY / innerHeight - 0.5) * 2.4; hy = (e.clientX / innerWidth - 0.5) * 2.4;
    if (!zm) zm = requestAnimationFrame(function () { zm = null; uygula(); });
  }, { passive: true });
  window.addEventListener('deviceorientation', function (e) {
    if (e.beta == null) return;
    hx = 2 + Math.max(-2.5, Math.min(2.5, (e.beta - 45) / 12)); hy = Math.max(-2.5, Math.min(2.5, (e.gamma || 0) / 12));
    if (!zm) zm = requestAnimationFrame(function () { zm = null; uygula(); });
  }, { passive: true });
  window.addEventListener('hashchange', function () { setTimeout(uygula, 100); });
})();
