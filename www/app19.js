/* 1001 — Fütüristik görünüm katmanı (kullanıcı, 2026-11-02: "genel tasarımı biraz daha fütüristik yap, görsel de ekleyebilirsin").
   - Arka plan: süzülen, ince çizgilerle bağlanan parçacıklar + ufukta parlayan perspektif ızgara (canvas; düşük FPS, gizliyken durur).
   - Cam (glass) kartlar ve paneller, HUD köşebentleri, üzerine gelince yükselme + parıltı.
   - Sayfa başlıklarında dönen yörünge halkaları + tarama çizgisi (SVG), "SYS // …" etiketi, renk geçişli başlık.
   - Kitap amblemleri (anatomi: kemik, biyokimya: altıgen molekül, biyofizik: dalga, biyoistatistik: çan eğrisi).
   - Köşesi kesik ana düğmeler, üzerinden geçen ışık, üst çubukta akan neon çizgi.
   Okuma metni sakin kalır (okuma görünümünde arka plan daha soluk). prefers-reduced-motion: animasyon yok. */
(function () {
  'use strict';
  var U = window.Uygulama; if (!U) return;
  if (/[?&]gomulu\b/.test(location.search)) return; // gömülü 3B sahne
  var el = U.el, $ = U.$, $$ = U.$$;
  var AZ = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var kose = function (r) { // HUD köşebentleri (4 köşe × 2 çizgi) — arka plana katman olarak eklenir
    var c = 'var(--kose-renk,rgba(79,224,255,.75))', u = '14px', k = '1.5px';
    return ['top left', 'top right', 'bottom left', 'bottom right'].map(function (p) { return 'linear-gradient(' + c + ',' + c + ') ' + p + ' / ' + u + ' ' + k + ' no-repeat, linear-gradient(' + c + ',' + c + ') ' + p + ' / ' + k + ' ' + u + ' no-repeat'; }).join(', ');
  };
  var KART = '.kitap-kart,.plan-gun,.tt-kutu,.koc-is,.sr-kart,.hr-kutu,.th-kpi > div,.koc-yontem > div,.sr-oda,.pm-tekrar,.df-giris,.bs-panel';
  var css = document.createElement('style');
  css.textContent = [
    ':root{--cam:rgba(10,24,34,.62);--cam-kenar:rgba(88,214,255,.22)}',
    'body{background:radial-gradient(1200px 700px at 85% -10%,rgba(79,224,255,.10),transparent 60%),radial-gradient(900px 600px at -10% 110%,rgba(120,90,255,.08),transparent 60%),var(--zemin)}',
    '#fxArka{position:fixed;inset:0;z-index:0;pointer-events:none;opacity:.55;transition:opacity .6s}',
    'body.fx-okuma #fxArka{opacity:.18}',
    '#ana,.serit,.yan-panel{position:relative;z-index:1}',
    '.fx-tarama{position:fixed;inset:0;z-index:2;pointer-events:none;background:repeating-linear-gradient(0deg,rgba(255,255,255,.018) 0 1px,transparent 1px 3px);mix-blend-mode:overlay}',
    // üst çubuk
    '.serit{background:linear-gradient(180deg,rgba(8,18,26,.92),rgba(8,18,26,.72));backdrop-filter:blur(10px) saturate(1.3);-webkit-backdrop-filter:blur(10px) saturate(1.3)}',
    '.serit::after{content:"";position:absolute;left:0;right:0;bottom:0;height:1px;background:linear-gradient(90deg,transparent,rgba(79,224,255,.9),transparent);background-size:40% 100%;background-repeat:no-repeat;animation:fxAkis 6s linear infinite}',
    '@keyframes fxAkis{from{background-position:-40% 0}to{background-position:140% 0}}',
    // cam kartlar + köşebentler
    KART.split(',').map(function (s) { return s + '{background:' + kose() + ',var(--cam)!important;backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);border-color:var(--cam-kenar)!important;transition:transform .25s,box-shadow .25s,border-color .25s}'; }).join('\n'),
    '.kitap-kart:hover,.sr-kart:hover,.koc-is:hover,.th-kpi > div:hover{transform:translateY(-3px);box-shadow:0 10px 30px rgba(0,0,0,.35),0 0 22px rgba(79,224,255,.14)}',
    '.yan-panel{background:linear-gradient(180deg,rgba(9,20,29,.94),rgba(6,13,19,.96))!important;backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);box-shadow:-12px 0 40px rgba(0,0,0,.45),inset 1px 0 0 rgba(79,224,255,.35)}',
    // başlık alanı
    '.kahraman{position:relative;padding-right:min(210px,32%);min-height:96px}',
    '.kahraman h1{background:linear-gradient(92deg,#eafcff 10%,#7ff0ff 55%,#4fb8ff 90%);-webkit-background-clip:text;background-clip:text;color:transparent;text-shadow:none;filter:drop-shadow(0 0 14px rgba(79,224,255,.25))}',
    '.kahraman .ust-etiket::before{content:"▸ SYS // ";color:var(--metin-cok-sonuk);letter-spacing:.12em}',
    '.kahraman .ust-etiket::after{content:"_";margin-left:2px;animation:fxImlec 1.1s steps(1) infinite}',
    '@keyframes fxImlec{50%{opacity:0}}',
    '.fx-hud{position:absolute;right:0;top:-6px;width:min(190px,30%);aspect-ratio:1/1;pointer-events:none;opacity:.9}',
    '.fx-hud .d1{transform-origin:50% 50%;animation:fxDon 18s linear infinite}.fx-hud .d2{transform-origin:50% 50%;animation:fxDon 11s linear infinite reverse}',
    '.fx-hud .tara{animation:fxTara 3.2s ease-in-out infinite}',
    '@keyframes fxDon{to{transform:rotate(360deg)}}@keyframes fxTara{0%,100%{transform:translateY(-38px);opacity:0}15%,85%{opacity:.8}50%{transform:translateY(38px)}}',
    '@media (max-width:640px){.kahraman{padding-right:0}.fx-hud{width:92px;top:-10px;opacity:.55}}',
    // düğmeler
    '.dugme{position:relative;overflow:hidden;backdrop-filter:blur(4px)}',
    '.dugme::after{content:"";position:absolute;inset:0;background:linear-gradient(110deg,transparent 30%,rgba(255,255,255,.18) 50%,transparent 70%);transform:translateX(-120%);transition:transform .6s;pointer-events:none}',
    '.dugme:hover::after{transform:translateX(120%)}',
    '.dugme.ana{clip-path:polygon(10px 0,100% 0,100% calc(100% - 10px),calc(100% - 10px) 100%,0 100%,0 10px);box-shadow:0 0 18px rgba(79,224,255,.35)}',
    // yükleniyor: tarama çubuğu
    '.yukleniyor{position:relative;overflow:hidden}',
    '.yukleniyor::after{content:"";position:absolute;left:0;bottom:0;height:2px;width:40%;background:linear-gradient(90deg,transparent,var(--vurgu),transparent);animation:fxAkis 1.4s linear infinite;background-size:100% 100%}',
    // kitap amblemi
    '.fx-amblem{position:absolute;right:12px;top:12px;width:54px;height:54px;opacity:.85;pointer-events:none;filter:drop-shadow(0 0 8px var(--k,#4fe0ff))}',
    '.kitap-kart h2{padding-right:60px}',
    '.mz-kitap .fx-amblem{position:static;width:22px;height:22px;float:right;margin:-2px -4px 0 8px;opacity:.9}',
    // üst bar (kullanıcı: "üstteki barı biraz daha güzelleştirelim"): cam haplar, halkalı simgeler, etkin sekmede neon, kenarlarda kaydırma geçişi
    '.serit-ic{min-height:58px}',
    '.logo-halka{position:relative;animation:fxNabiz 3.2s ease-in-out infinite}.logo-halka::after{content:"";position:absolute;inset:-5px;border-radius:50%;border:1px dashed rgba(79,224,255,.45);animation:fxDon 14s linear infinite}',
    '@keyframes fxNabiz{50%{box-shadow:0 0 0 1px rgba(79,224,255,.35),0 0 22px rgba(79,224,255,.45)}}',
    '.sekmeler{gap:6px;padding:6px 4px;-webkit-mask-image:linear-gradient(90deg,transparent,#000 18px,#000 calc(100% - 24px),transparent);mask-image:linear-gradient(90deg,transparent,#000 18px,#000 calc(100% - 24px),transparent)}',
    '.sekme{display:inline-flex;align-items:center;gap:7px;border-radius:999px!important;padding:5px 12px 5px 6px!important;background:rgba(10,24,34,.55)!important;border:1px solid rgba(88,214,255,.14)!important;font:600 12.5px var(--f-baslik);letter-spacing:.06em;text-transform:uppercase;transition:all .2s}',
    '.sekme > span[aria-hidden]{display:grid;place-items:center;width:22px;height:22px;border-radius:50%;border:1px solid rgba(79,224,255,.35);font-size:11px;color:var(--vurgu);background:rgba(79,224,255,.06)}',
    '.sekme:hover{color:#eafcff;border-color:rgba(79,224,255,.45)!important;box-shadow:0 0 14px rgba(79,224,255,.18)}',
    '.sekme[aria-current="page"]{color:#eafcff!important;background:linear-gradient(135deg,rgba(79,224,255,.22),rgba(79,224,255,.06))!important;border-color:var(--vurgu)!important;box-shadow:0 0 18px rgba(79,224,255,.35),inset 0 0 12px rgba(79,224,255,.15)}',
    '.sekme[aria-current="page"] > span[aria-hidden]{background:var(--vurgu);color:#04121a;box-shadow:0 0 12px rgba(79,224,255,.8)}',
    '.kahraman h1 .fx-emoji{-webkit-text-fill-color:initial;color:initial;background:none;filter:none;margin-right:.25em}',
    // sekme çubuğu: etkin sekme neon alt çizgi
    '.serit [aria-current="page"],.serit .etkin{box-shadow:inset 0 -2px 0 var(--vurgu),0 6px 16px -8px rgba(79,224,255,.8)}',
    '@media (prefers-reduced-motion: reduce){.serit::after,.fx-hud .d1,.fx-hud .d2,.fx-hud .tara,.kahraman .ust-etiket::after,.yukleniyor::after{animation:none}}'
  ].join('\n');
  document.head.appendChild(css);

  /* ---- arka plan: parçacık ağı + ufuk ızgarası ---- */
  var cv = el('canvas', { id: 'fxArka', 'aria-hidden': 'true' }); document.body.prepend(cv);
  document.body.appendChild(el('div', { class: 'fx-tarama', 'aria-hidden': 'true' }));
  (function () {
    var g = cv.getContext('2d'), dpr = Math.min(1.5, window.devicePixelRatio || 1), N = 46, p = [], son = 0, t0 = performance.now();
    function boy() { cv.width = innerWidth * dpr; cv.height = innerHeight * dpr; }
    boy(); addEventListener('resize', boy);
    for (var i = 0; i < N; i++) p.push({ x: Math.random(), y: Math.random(), vx: (Math.random() - .5) * .00012, vy: (Math.random() - .5) * .00012, r: .6 + Math.random() * 1.4 });
    function ciz(z) {
      var w = cv.width, h = cv.height, t = (z - t0) / 1000;
      g.clearRect(0, 0, w, h);
      // ufuk ızgarası (alt %35)
      var ufuk = h * .68; g.save(); g.globalAlpha = .5;
      var gr = g.createLinearGradient(0, ufuk, 0, h); gr.addColorStop(0, 'rgba(79,224,255,0)'); gr.addColorStop(1, 'rgba(79,224,255,.22)');
      g.strokeStyle = gr; g.lineWidth = 1 * dpr;
      for (var k = -14; k <= 14; k++) { g.beginPath(); g.moveTo(w / 2 + k * w * .012, ufuk); g.lineTo(w / 2 + k * w * .16, h); g.stroke(); }
      var kay = AZ ? 0 : (t * .25) % 1;
      for (var j = 0; j < 12; j++) { var f = (j + kay) / 12, y = ufuk + (h - ufuk) * f * f; g.beginPath(); g.moveTo(0, y); g.lineTo(w, y); g.stroke(); }
      g.restore();
      // parçacıklar
      for (var a = 0; a < N; a++) { var q = p[a]; if (!AZ) { q.x += q.vx * 16; q.y += q.vy * 16; if (q.x < 0 || q.x > 1) q.vx *= -1; if (q.y < 0 || q.y > 1) q.vy *= -1; } }
      for (var m = 0; m < N; m++) for (var n = m + 1; n < N; n++) {
        var dx = (p[m].x - p[n].x) * w, dy = (p[m].y - p[n].y) * h, d = Math.sqrt(dx * dx + dy * dy), lim = 150 * dpr;
        if (d < lim) { g.strokeStyle = 'rgba(79,224,255,' + (0.18 * (1 - d / lim)) + ')'; g.lineWidth = dpr * .7; g.beginPath(); g.moveTo(p[m].x * w, p[m].y * h); g.lineTo(p[n].x * w, p[n].y * h); g.stroke(); }
      }
      for (var b = 0; b < N; b++) { g.fillStyle = 'rgba(160,240,255,.7)'; g.beginPath(); g.arc(p[b].x * w, p[b].y * h, p[b].r * dpr, 0, 7); g.fill(); }
    }
    (function dongu(z) {
      requestAnimationFrame(dongu);
      if (document.hidden || z - son < 50) return; // ~20 FPS yeter
      son = z; ciz(z);
    })(performance.now());
    if (AZ) ciz(performance.now());
  })();

  /* ---- başlık HUD süsü + okuma görünümünde soluk arka plan + kitap amblemleri ---- */
  var KOD = { kutuphane: 'MERKEZ', plan: 'PLAN', koc: 'KOÇ', tahmin: 'TAHMİN', saray: 'SARAY', defter: 'DEFTER', sohbet: 'SOHBET', kartlar: 'KART', test: 'TEST', makaleler: 'MAKALE', notlar: 'NOT' };
  function hudSvg(kod) {
    var NS = 'http://www.w3.org/2000/svg', s = document.createElementNS(NS, 'svg');
    s.setAttribute('viewBox', '0 0 120 120'); s.setAttribute('class', 'fx-hud'); s.setAttribute('aria-hidden', 'true');
    s.innerHTML = '<defs><radialGradient id="fxg" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#4fe0ff" stop-opacity=".35"/><stop offset="1" stop-color="#4fe0ff" stop-opacity="0"/></radialGradient></defs>' +
      '<circle cx="60" cy="60" r="44" fill="url(#fxg)"/>' +
      '<g class="d1"><circle cx="60" cy="60" r="50" fill="none" stroke="#4fe0ff" stroke-opacity=".55" stroke-width="1" stroke-dasharray="60 14 8 14"/><circle cx="110" cy="60" r="2.4" fill="#bff6ff"/></g>' +
      '<g class="d2"><circle cx="60" cy="60" r="38" fill="none" stroke="#7ff0ff" stroke-opacity=".4" stroke-width="1" stroke-dasharray="3 6"/><rect x="58" y="20" width="4" height="4" fill="#4fe0ff"/></g>' +
      '<circle cx="60" cy="60" r="26" fill="none" stroke="#4fe0ff" stroke-opacity=".7" stroke-width="1.4"/>' +
      '<line class="tara" x1="36" y1="60" x2="84" y2="60" stroke="#bff6ff" stroke-width="1.2"/>' +
      '<text x="60" y="64" text-anchor="middle" font-family="JetBrains Mono,monospace" font-size="9" fill="#bff6ff" letter-spacing="1.5">' + kod + '</text>';
    return s;
  }
  var AMBLEM = {
    anatomi: '<path d="M14 10c-4 0-6 4-4 7l4 3 16 16 3 4c3 2 7 0 7-4 2 0 5-2 4-5-1-3-4-3-6-2L22 13c1-2 1-5-2-6-3-1-5 2-5 4" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linejoin="round"/>',
    biyokimya: '<g fill="none" stroke="currentColor" stroke-width="2.2"><polygon points="24,6 38,14 38,30 24,38 10,30 10,14"/><polygon points="24,14 31,18 31,26 24,30 17,26 17,18" opacity=".6"/><line x1="38" y1="14" x2="46" y2="9"/><circle cx="46" cy="9" r="2.5"/></g>',
    biyofizik: '<g fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M4 24c5-12 9-12 14 0s9 12 14 0 9-12 14 0"/><path d="M4 34h40" opacity=".4"/></g>',
    biyoistatistik: '<g fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M4 40c8 0 10-30 20-30s12 30 20 30"/><line x1="24" y1="10" x2="24" y2="40" stroke-dasharray="3 3" opacity=".6"/><line x1="4" y1="42" x2="44" y2="42" opacity=".5"/></g>'
  };
  function amblem(id, renk) {
    var a = AMBLEM[id] || '<circle cx="24" cy="24" r="14" fill="none" stroke="currentColor" stroke-width="2.4"/>';
    var s = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); s.setAttribute('viewBox', '0 0 48 48'); s.setAttribute('class', 'fx-amblem'); s.setAttribute('aria-hidden', 'true');
    s.style.color = renk || '#4fe0ff'; s.innerHTML = a; return s;
  }
  U.fxAmblem = amblem;
  function sus() {
    var h = location.hash.slice(1) || 'kutuphane', anahtar = h.split('-')[0];
    document.body.classList.toggle('fx-okuma', /^oku-/.test(h));
    setTimeout(function () {
      $$('#ana .kahraman').forEach(function (k) { if (!k.querySelector('.fx-hud')) k.appendChild(hudSvg(KOD[anahtar] || anahtar.toUpperCase().slice(0, 7))); });
      // başlıktaki emoji renk geçişli yazıyla beyaz lekeye dönmesin: ayrı span
      $$('#ana .kahraman h1').forEach(function (h) { if (h.querySelector('.fx-emoji')) return; var m = /^(\p{Extended_Pictographic}(?:\uFE0F)?)\s*/u.exec(h.textContent); if (m) { h.textContent = h.textContent.slice(m[0].length); h.prepend(el('span', { class: 'fx-emoji', text: m[1] })); } });
      U.Kitaplik.katalog().then(function (l) {
        var renk = {}; l.forEach(function (k) { renk[k.baslik] = [k.id, k.renk]; });
        $$('#ana .kitap-kart').forEach(function (kart) { if (kart.querySelector('.fx-amblem')) return; var h2 = kart.querySelector('h2'); var r = h2 && renk[h2.textContent]; if (r) kart.appendChild(amblem(r[0], r[1])); });
        $$('#ana .mz-kitap').forEach(function (c) { if (c.querySelector('.fx-amblem')) return; var ad = (c.querySelector('.ad') || {}).textContent || ''; var k = l.filter(function (x) { return x.baslik.replace(/^1001\s*/, '').toLowerCase() === ad.toLowerCase(); })[0]; if (k) c.prepend(amblem(k.id, k.renk)); });
      });
    }, 350);
  }
  window.addEventListener('hashchange', sus); setTimeout(sus, 600); setTimeout(sus, 2500);
})();
