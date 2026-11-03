/* C.A.R.V.I.S. — sinematik katman: çubuklu küre (konuşmayla nabız atar), yana oklarla açılan etiketli kartlar,
   büyük detay paneli (3B yapı + etiketli bölümler, sırayla açılıp büyür) ve kelime kelime altyazı.
   API: Holo.goster(), gizle(), acikMi(), durum('bos'|'dinliyor'|'dusunuyor'|'konusuyor'), soru(metin), temizle(),
        kart({tur, etiket, baslik, alt, eylem, anahtar}),
        detayAc(baslik) → 3B sahne kabı (iframe buraya), detayBolum({etiket, baslik, metin|html, eylem}), detayKapat(),
        altyaziBasla(metin), kelime(bas, son), altyaziBitir(). */
(function () {
  'use strict';
  var css = document.createElement('style');
  css.textContent = [
    '.holo{position:fixed;inset:0;z-index:900;display:none;background:radial-gradient(ellipse at 30% 50%,rgba(6,30,44,.88),rgba(2,8,13,.95) 70%);backdrop-filter:blur(3px);-webkit-backdrop-filter:blur(3px);color:#cdf6ff;font-family:var(--f-govde,system-ui);overflow:hidden}',
    '.holo.acik{display:block;animation:holoGir .45s ease-out}',
    /* kullanıcı, 2026-11-03: "Carvis tüm ekranı kaplamasın, ekranımı görebileyim; konuşma efekti yeni hologram olsun" →
       boşta/dinlerken/konuşurken küre köşede bir projektörün üstünde süzülür; sayfa görünür ve dokunulabilir kalır.
       Kart ya da detay paneli açılınca yalnız hafif bir karartma gelir (bulanıklık yok). */
    '.holo{background:none!important;backdrop-filter:none!important;-webkit-backdrop-filter:none!important;pointer-events:none}',
    '.holo.dolu{background:linear-gradient(90deg,rgba(2,8,13,.62),rgba(2,8,13,.35))!important}',
    '.holo .h-kapat,.holo .h-kart,.holo .h-detay,.holo .h-bolum{pointer-events:auto}',
    '.holo:not(.dolu) .h-ust,.holo:not(.dolu) .h-soru,.holo:not(.dolu) .h-altyazi{display:none}',
    '.holo:not(.dolu) .h-durum{font-size:10px;letter-spacing:.32em}',
    '.holo:not(.dolu) .h-kapat{width:30px;height:30px;font-size:13px;background:rgba(2,12,18,.6)}',
    '@keyframes holoGir{from{opacity:0;transform:scale(1.03)}to{opacity:1;transform:none}}',
    '.holo canvas.kure{position:absolute;inset:0;width:100%;height:100%}',
    '.holo svg.oklar{position:absolute;inset:0;width:100%;height:100%;pointer-events:none;overflow:visible}',
    '.holo svg.oklar path{fill:none;stroke:#4fe0ff;stroke-width:1.6;opacity:.75;stroke-dasharray:6 5;animation:okAk 1.2s linear infinite}',
    '.holo svg.oklar path.odak{stroke-width:2.6;opacity:1}',
    '@keyframes okAk{to{stroke-dashoffset:-22}}',
    '.holo .h-ust{position:absolute;left:0;right:0;top:16px;text-align:center;letter-spacing:.32em;font-size:12px;color:#7fe9ff;opacity:.85}',
    '.holo .h-soru{position:absolute;left:5%;right:5%;top:38px;text-align:center;font-size:15px;color:#e8fbff;opacity:.9;min-height:20px}',
    '.holo .h-durum{position:absolute;letter-spacing:.42em;font-size:12px;color:#4fe0ff;transform:translateX(-50%);white-space:nowrap;text-shadow:0 0 12px rgba(79,224,255,.8)}',
    '.holo .h-kapat{position:absolute;top:10px;right:12px;background:none;border:1px solid rgba(79,224,255,.4);color:#7fe9ff;border-radius:50%;width:38px;height:38px;font-size:16px;cursor:pointer;z-index:3}',
    '.holo .h-kartlar{position:absolute;display:flex;flex-direction:column;gap:14px}',
    '.holo .h-kart{pointer-events:auto;cursor:pointer;text-align:left;background:linear-gradient(135deg,rgba(14,52,70,.92),rgba(6,22,32,.92));border:1px solid rgba(79,224,255,.45);border-radius:12px;padding:12px 14px;color:#e8fbff;box-shadow:0 0 18px rgba(79,224,255,.15);transform-origin:left center;opacity:0;transform:translateX(30px) scale(.7);transition:transform .45s cubic-bezier(.2,1.4,.4,1),opacity .35s,box-shadow .3s,border-color .3s;font:inherit;position:relative}',
    '.holo .h-kart.gir{opacity:1;transform:none}',
    '.holo .h-kart.odak{transform:scale(1.1);border-color:#7ff3ff;box-shadow:0 0 34px rgba(79,224,255,.55)}',
    '.holo .h-kart b{display:block;font-size:14px;margin-bottom:4px}',
    '.holo .h-kart span.h-alt{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;font-size:12.5px;opacity:.8}',
    '.holo .h-kart i{font-style:normal;float:right;font-size:11px;letter-spacing:.15em;color:#4fe0ff;margin-left:8px}',
    '.holo .h-etiket{display:inline-block;font-size:10px;letter-spacing:.18em;font-weight:700;color:#031018;background:#4fe0ff;border-radius:4px;padding:2px 7px;margin-bottom:6px;box-shadow:0 0 12px rgba(79,224,255,.6)}',
    '.holo .h-etiket.e-sinav{background:#ffb547;box-shadow:0 0 12px rgba(255,181,71,.6)}',
    '.holo .h-etiket.e-evrim{background:#7dffb0;box-shadow:0 0 12px rgba(125,255,176,.55)}',
    '.holo .h-etiket.e-eksik{background:#ff6b6b;color:#fff;box-shadow:0 0 12px rgba(255,107,107,.6)}',
    '.holo .h-etiket.e-mantik{background:#c9a7ff;box-shadow:0 0 12px rgba(201,167,255,.55)}',
    // detay paneli
    '.holo .h-detay{position:absolute;display:none;flex-direction:column;gap:10px;background:linear-gradient(160deg,rgba(10,40,56,.95),rgba(3,14,21,.96));border:1px solid rgba(79,224,255,.6);border-radius:16px;box-shadow:0 0 50px rgba(79,224,255,.25);padding:12px;transform-origin:left center;overflow:hidden}',
    '.holo .h-detay.acik{display:flex;animation:detayGir .55s cubic-bezier(.2,1.3,.4,1)}',
    '@keyframes detayGir{from{opacity:0;transform:scale(.25) translateX(-40px)}to{opacity:1;transform:none}}',
    '.holo .h-detay h2{margin:0;font-size:17px;letter-spacing:.06em;color:#e8fbff}',
    '.holo .h-sahne{position:relative;flex:0 0 46%;min-height:200px;border-radius:12px;overflow:hidden;border:1px solid rgba(79,224,255,.35);background:#060c11}',
    '.holo .h-sahne iframe{width:100%;height:100%;border:0;background:#060c11}',
    '.holo .h-sahne .h-etiket{position:absolute;left:10px;top:10px;z-index:2}',
    '.holo .h-bolumler{flex:1;overflow-y:auto;display:flex;flex-direction:column;gap:10px;padding-right:4px;scroll-behavior:smooth}',
    '.holo .h-bolum{border:1px solid rgba(79,224,255,.3);border-radius:10px;padding:9px 11px;background:rgba(6,26,36,.75);opacity:0;transform:translateY(14px) scale(.92);transition:transform .45s cubic-bezier(.2,1.4,.4,1),opacity .35s,border-color .3s,box-shadow .3s;transform-origin:left top}',
    '.holo .h-bolum.gir{opacity:1;transform:none}',
    '.holo .h-bolum.odak{transform:scale(1.035);border-color:#7ff3ff;box-shadow:0 0 26px rgba(79,224,255,.4)}',
    '.holo .h-bolum b{display:block;font-size:13.5px;margin-bottom:3px;color:#e8fbff}',
    '.holo .h-bolum p{margin:2px 0;font-size:13px;line-height:1.45;color:#cdeef7}',
    '.holo .h-bolum.tik{cursor:pointer}',
    '.holo .h-bolum ol{margin:4px 0 0 18px;padding:0;font-size:12.5px;color:#cdeef7}',
    '.holo .h-bolum .h-cevap{color:#7dffb0;font-weight:600}',
    // altyazı
    '.holo .h-altyazi{position:absolute;left:6%;right:6%;bottom:22px;text-align:center;font-size:19px;line-height:1.45;color:rgba(232,251,255,.38);text-shadow:0 2px 10px rgba(0,0,0,.9);pointer-events:none;min-height:28px}',
    '.holo .h-altyazi .soy{color:#fff}.holo .h-altyazi .simdi{color:#7ff3ff}',
    '@media (prefers-reduced-motion:reduce){.holo.acik,.holo .h-detay.acik{animation:none}.holo svg.oklar path{animation:none}}'
  ].join('\n');
  document.head.appendChild(css);

  function el(t, a, c) { var e = document.createElement(t); for (var k in a || {}) { if (k === 'text') e.textContent = a[k]; else if (k === 'html') e.innerHTML = a[k]; else if (k.slice(0, 2) === 'on') e.addEventListener(k.slice(2), a[k]); else e.setAttribute(k, a[k]); } (c || []).forEach(function (x) { e.appendChild(typeof x === 'string' ? document.createTextNode(x) : x); }); return e; }
  var ETIKET_SINIF = { 'EKSİK': 'e-eksik', 'SINAV SORUSU': 'e-sinav', 'EVRİMSEL NEDENİ': 'e-evrim', 'MANTIKSAL ÇERÇEVESİ': 'e-mantik' };
  function etiketEl(t) { return el('span', { class: 'h-etiket ' + (ETIKET_SINIF[t] || ''), text: t }); }

  var kok = el('div', { class: 'holo', role: 'dialog', 'aria-label': 'C.A.R.V.I.S.' });
  var cv = el('canvas', { class: 'kure', 'aria-hidden': 'true' });
  var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); svg.setAttribute('class', 'oklar');
  svg.innerHTML = '<defs><marker id="hOk" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#4fe0ff" style="stroke:none;animation:none"/></marker></defs>';
  var ust = el('div', { class: 'h-ust', text: 'C . A . R . V . I . S .' });
  var soruEl = el('div', { class: 'h-soru' });
  var durumEl = el('div', { class: 'h-durum' });
  var kartlarEl = el('div', { class: 'h-kartlar' });
  var detayEl = el('div', { class: 'h-detay', 'aria-live': 'polite' });
  var altyaziEl = el('div', { class: 'h-altyazi', 'aria-hidden': 'true' });
  var kapat = el('button', { class: 'h-kapat', type: 'button', 'aria-label': 'Küçült', text: '✕', onclick: function () { Holo.gizle(); if (Holo.onKapat) Holo.onKapat(); } });
  [cv, svg, ust, soruEl, durumEl, kartlarEl, detayEl, altyaziEl, kapat].forEach(function (x) { kok.appendChild(x); });
  function tak() { if (!kok.parentNode && document.body) document.body.appendChild(kok); }
  if (document.body) tak(); else document.addEventListener('DOMContentLoaded', tak);

  /* ---------- küre ---------- */
  var N = 260, P = [];
  for (var i = 0; i < N; i++) { var y = 1 - (i / (N - 1)) * 2, r = Math.sqrt(1 - y * y), th = i * 2.399963; P.push({ x: Math.cos(th) * r, y: y, z: Math.sin(th) * r, f: Math.random() * 6.28, h: 0.6 + Math.random() * 0.8 }); }
  var D = { durum: 'bos', enerji: 0, hedef: 0.15, aci: 0, hiz: 0.25, sonKelime: 0, w: 0, h: 0, dpr: 1, cx: 0, cy: 0, R: 0 };
  var ETIKET = { bos: 'HAZIR', dinliyor: 'DİNLİYORUM', dusunuyor: 'ANALİZ EDİLİYOR', konusuyor: '' };
  function detayAcik() { return detayEl.classList.contains('acik'); }
  function boyut() {
    D.dpr = Math.min(window.devicePixelRatio || 1, 2); D.w = kok.clientWidth; D.h = kok.clientHeight;
    cv.width = D.w * D.dpr; cv.height = D.h * D.dpr;
    var genis = D.w >= 760, dolu = kartlarEl.children.length || detayAcik();
    kok.classList.toggle('dolu', !!dolu); D.dock = !dolu;
    if (!dolu) {
      // projektör: sağ altta, alttaki komut kapsülünün ve Carvis balonunun üstünde
      D.R = Math.max(40, Math.min(78, Math.min(D.w, D.h) * 0.08));
      D.cx = D.w - D.R * 1.9 - 18; D.cy = D.h - D.R * 2.6 - 120;
      durumEl.style.left = D.cx + 'px'; durumEl.style.top = (D.cy + D.R * 2.25) + 'px';
      kapat.style.cssText = 'top:' + Math.max(8, D.cy - D.R * 1.6) + 'px;right:' + Math.max(8, D.w - D.cx - D.R * 1.5) + 'px';
      kartlarEl.style.cssText = 'display:none'; detayEl.style.cssText = '';
      oklariCiz(); return;
    }
    kapat.style.cssText = '';
    D.cx = genis ? D.w * (detayAcik() ? 0.17 : dolu ? 0.3 : 0.5) : D.w / 2;
    D.cy = genis ? D.h * 0.5 : D.h * (dolu ? (detayAcik() ? 0.13 : 0.27) : 0.45);
    D.R = Math.min(D.w, D.h) * (genis ? (detayAcik() ? 0.12 : 0.17) : (detayAcik() ? 0.08 : 0.16));
    durumEl.style.left = D.cx + 'px'; durumEl.style.top = (D.cy + D.R * 1.75) + 'px';
    if (genis) {
      kartlarEl.style.cssText = 'right:4%;top:50%;transform:translateY(-50%);width:min(430px,46vw)' + (detayAcik() ? ';display:none' : '');
      detayEl.style.cssText = 'left:34%;right:2.5%;top:64px;bottom:76px';
    } else {
      kartlarEl.style.cssText = 'left:16px;right:16px;top:' + (D.cy + D.R * 2.05) + 'px' + (detayAcik() ? ';display:none' : '');
      detayEl.style.cssText = 'left:10px;right:10px;top:' + (D.cy + D.R * 1.9) + 'px;bottom:70px';
    }
    oklariCiz();
  }
  window.addEventListener('resize', function () { if (kok.classList.contains('acik')) boyut(); });
  var raf = null, t0 = performance.now();
  function kare(t) {
    raf = requestAnimationFrame(kare);
    var dt = Math.min(0.05, (t - t0) / 1000); t0 = t;
    var s = D.durum;
    if (s === 'konusuyor') { if (t - D.sonKelime > 420 && Math.random() < 0.18) D.enerji = Math.max(D.enerji, 0.5 + Math.random() * 0.4); D.hedef = 0.2; D.hiz = 0.45; }
    else if (s === 'dinliyor') { D.hedef = 0.3 + 0.12 * Math.sin(t / 380); D.hiz = 0.3; }
    else if (s === 'dusunuyor') { D.hedef = 0.28; D.hiz = 1.4; }
    else { D.hedef = 0.12; D.hiz = 0.18; }
    D.enerji += (D.hedef - D.enerji) * Math.min(1, dt * (s === 'konusuyor' ? 5 : 3));
    D.aci += dt * D.hiz;
    var c = cv.getContext('2d'); c.setTransform(D.dpr, 0, 0, D.dpr, 0, 0); c.clearRect(0, 0, D.w, D.h);
    c.globalCompositeOperation = 'lighter';
    projektor(c, t);
    c.globalAlpha = 0.86 + 0.14 * Math.random() * (Math.random() < 0.06 ? 1 : 0.25); // hologram titreşimi
    var ca = Math.cos(D.aci), sa = Math.sin(D.aci), ct = Math.cos(0.38), st = Math.sin(0.38), R = D.R;
    for (var k = 0; k < 3; k++) { c.beginPath(); c.ellipse(D.cx, D.cy, R * (1.32 + k * 0.17), R * (0.34 + k * 0.05), D.aci * (k % 2 ? -0.6 : 0.4) + k, 0, 6.283); c.strokeStyle = 'rgba(79,224,255,' + (0.12 + 0.05 * D.enerji) + ')'; c.lineWidth = 1; c.stroke(); }
    var g = c.createRadialGradient(D.cx, D.cy, 0, D.cx, D.cy, R * 0.95);
    g.addColorStop(0, 'rgba(160,245,255,' + (0.35 + D.enerji * 0.5) + ')'); g.addColorStop(0.35, 'rgba(79,224,255,' + (0.12 + D.enerji * 0.2) + ')'); g.addColorStop(1, 'rgba(79,224,255,0)');
    c.fillStyle = g; c.beginPath(); c.arc(D.cx, D.cy, R * 0.95, 0, 6.283); c.fill();
    var zaman = t / 1000;
    for (var j = 0; j < N; j++) {
      var p = P[j], x = p.x * ca + p.z * sa, z = -p.x * sa + p.z * ca, yy = p.y, y2 = yy * ct - z * st, z2 = yy * st + z * ct;
      var dalga = 0.5 + 0.5 * Math.sin(zaman * (s === 'konusuyor' ? 9 : 2.2) + p.f + yy * 3);
      var boy = R * (0.07 + p.h * D.enerji * 0.62 * dalga), r0 = R * 0.62, r1 = r0 + boy, per = 1 / (1 + z2 * 0.35), a = 0.18 + 0.62 * (z2 + 1) / 2;
      var x0 = D.cx + x * r0 * per, y0 = D.cy + y2 * r0 * per, x1 = D.cx + x * r1 * per, y1 = D.cy + y2 * r1 * per;
      c.strokeStyle = 'rgba(79,224,255,' + (a * 0.25) + ')'; c.lineWidth = 4.5; c.beginPath(); c.moveTo(x0, y0); c.lineTo(x1, y1); c.stroke();
      c.strokeStyle = 'rgba(190,250,255,' + a + ')'; c.lineWidth = 1.4; c.beginPath(); c.moveTo(x0, y0); c.lineTo(x1, y1); c.stroke();
    }
    // tarama çizgileri (yatay, aşağı akar)
    c.save(); c.beginPath(); c.arc(D.cx, D.cy, R * 1.12, 0, 6.283); c.clip();
    var adim = Math.max(3, R / 14), kay = (t / 40) % adim;
    c.fillStyle = 'rgba(160,250,255,' + (0.05 + 0.04 * D.enerji) + ')';
    for (var sy = D.cy - R * 1.12 + kay; sy < D.cy + R * 1.12; sy += adim) c.fillRect(D.cx - R * 1.12, sy, R * 2.24, 1);
    c.restore();
    c.globalAlpha = 1;
    c.globalCompositeOperation = 'source-over';
  }
  // projektör tabanı + ışık konisi (menüdeki hologramla aynı dil)
  function projektor(c, t) {
    var R = D.R, bx = D.cx, by = D.cy + R * 1.85, rx = R * 1.15, ry = R * 0.3;
    var kon = c.createLinearGradient(0, by, 0, D.cy - R * 0.2);
    kon.addColorStop(0, 'rgba(79,224,255,' + (0.2 + 0.1 * D.enerji) + ')'); kon.addColorStop(1, 'rgba(79,224,255,0)');
    c.fillStyle = kon; c.beginPath(); c.moveTo(bx - rx * 0.92, by); c.lineTo(D.cx - R * 0.85, D.cy); c.lineTo(D.cx + R * 0.85, D.cy); c.lineTo(bx + rx * 0.92, by); c.closePath(); c.fill();
    for (var k = 0; k < 5; k++) { var f = (k + 1) / 6, x = bx - rx * 0.8 + rx * 1.6 * f; c.strokeStyle = 'rgba(160,250,255,' + (0.05 + 0.05 * Math.sin(t / 300 + k * 1.7)) + ')'; c.lineWidth = 1; c.beginPath(); c.moveTo(x, by); c.lineTo(D.cx + (x - bx) * 0.75, D.cy + R * 0.2); c.stroke(); }
    var gl = c.createRadialGradient(bx, by, 0, bx, by, rx * 1.3); gl.addColorStop(0, 'rgba(120,240,255,.35)'); gl.addColorStop(1, 'rgba(79,224,255,0)');
    c.fillStyle = gl; c.beginPath(); c.ellipse(bx, by, rx * 1.3, ry * 1.6, 0, 0, 6.283); c.fill();
    c.strokeStyle = 'rgba(140,250,255,.75)'; c.lineWidth = 1.6; c.beginPath(); c.ellipse(bx, by, rx, ry, 0, 0, 6.283); c.stroke();
    c.strokeStyle = 'rgba(140,250,255,.3)'; c.lineWidth = 1; c.beginPath(); c.ellipse(bx, by, rx * 0.62, ry * 0.62, 0, 0, 6.283); c.stroke();
    c.beginPath(); c.ellipse(bx, by + ry * 0.55, rx * 1.06, ry * 1.05, 0, 0.15, Math.PI - 0.15); c.strokeStyle = 'rgba(79,224,255,.25)'; c.stroke();
  }

  /* ---------- kartlar + oklar ---------- */
  var kartlar = [], odakSayac = null, odakI = -1, bolumler = [], bolumOdakI = -1, bolumSayac = null;
  function ok(x0, y0, x1, y1, genis, odak) {
    var d = genis ? 'M' + x0 + ',' + y0 + ' C' + (x0 + (x1 - x0) * 0.5) + ',' + y0 + ' ' + (x0 + (x1 - x0) * 0.5) + ',' + y1 + ' ' + x1 + ',' + y1
                  : 'M' + x0 + ',' + y0 + ' C' + x0 + ',' + (y0 + 30) + ' ' + x1 + ',' + (y1 - 30) + ' ' + x1 + ',' + y1;
    var p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    p.setAttribute('d', d); p.setAttribute('class', 'ok' + (odak ? ' odak' : '')); p.setAttribute('marker-end', 'url(#hOk)'); svg.appendChild(p);
  }
  function oklariCiz() {
    [].slice.call(svg.querySelectorAll('path.ok')).forEach(function (x) { x.remove(); });
    if (!kok.classList.contains('acik')) return;
    var kb = kok.getBoundingClientRect(), genis = D.w >= 760;
    if (detayAcik()) { // küreden detay paneline tek kalın ok
      var b = detayEl.getBoundingClientRect();
      if (genis) ok(D.cx + D.R * 1.25, D.cy, b.left - kb.left - 8, b.top - kb.top + Math.min(b.height * 0.25, 160), true, true);
      else ok(D.cx, D.cy + D.R * 1.2, b.left - kb.left + 40, b.top - kb.top - 4, false, true);
      return;
    }
    kartlar.forEach(function (k, i) {
      if (!k.el.classList.contains('gir')) return;
      var b = k.el.getBoundingClientRect();
      if (genis) ok(D.cx + D.R * 1.2, D.cy + (i - (kartlar.length - 1) / 2) * D.R * 0.28, b.left - kb.left - 8, b.top - kb.top + b.height / 2, true, i === odakI);
      else ok(D.cx + (i - (kartlar.length - 1) / 2) * 18, D.cy + D.R * 1.25, b.left - kb.left + 26, b.top - kb.top - 4, false, i === odakI);
    });
  }
  function odakDongu() {
    clearInterval(odakSayac);
    odakSayac = setInterval(function () { // yapılar sırayla büyür
      if (!kartlar.length || detayAcik()) return;
      odakI = (odakI + 1) % kartlar.length;
      kartlar.forEach(function (k, i) { k.el.classList.toggle('odak', i === odakI); });
      oklariCiz();
    }, 1900);
  }
  function bolumDongu() {
    clearInterval(bolumSayac);
    bolumSayac = setInterval(function () { // detay bölümleri sırayla büyür (ve görünür alana kayar)
      if (!bolumler.length) return;
      bolumOdakI = (bolumOdakI + 1) % bolumler.length;
      bolumler.forEach(function (b, i) { b.classList.toggle('odak', i === bolumOdakI); });
      var b = bolumler[bolumOdakI], kap = b.parentNode;
      if (kap) kap.scrollTop = Math.max(0, b.offsetTop - kap.offsetTop - 6);
    }, 2600);
  }
  var IKON = { makale: '📰', sayfa: '📖', sahne: '🧬', ozet: '⚡', internet: '🌐', plan: '📅', uygulama: '📱', sinav: '📝' };

  /* ---------- altyazı ---------- */
  var AY = { metin: '', cumleler: [] };
  function altyaziCiz(bas, son) {
    var m = AY.metin; if (!m) { altyaziEl.innerHTML = ''; return; }
    // içinde bulunulan cümle (ve gerekirse bir sonrakinin başı) gösterilir; söylenenler parlak
    var cb = 0, cs = m.length;
    for (var i = 0; i < AY.cumleler.length; i++) { var c = AY.cumleler[i]; if (bas >= c[0] && bas < c[1]) { cb = c[0]; cs = c[1]; break; } }
    if (cs - cb > 190) { cb = Math.max(cb, bas - 80); cs = Math.min(cs, cb + 190); }
    function e(s) { return s.replace(/[&<>]/g, function (x) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;' }[x]; }); }
    altyaziEl.innerHTML = '<span class="soy">' + e(m.slice(cb, bas)) + '</span><span class="simdi">' + e(m.slice(bas, son)) + '</span>' + e(m.slice(son, cs));
  }

  var Holo = window.Holo = {
    onKapat: null,
    goster: function () { tak(); if (kok.classList.contains('acik')) return; kok.classList.add('acik'); boyut(); t0 = performance.now(); if (!raf) raf = requestAnimationFrame(kare); },
    gizle: function () { kok.classList.remove('acik'); if (raf) cancelAnimationFrame(raf); raf = null; clearInterval(odakSayac); clearInterval(bolumSayac); },
    acikMi: function () { return kok.classList.contains('acik'); },
    durum: function (s) { D.durum = s; durumEl.textContent = ETIKET[s] != null ? ETIKET[s] : ''; },
    kelime: function (bas, son) {
      D.sonKelime = performance.now(); D.enerji = Math.min(1.25, D.enerji + 0.55 + Math.random() * 0.3);
      if (AY.metin && bas != null && son != null) altyaziCiz(+bas, +son);
    },
    soru: function (t) { soruEl.textContent = t ? '› ' + t : ''; },
    temizle: function () { kartlar = []; kartlarEl.innerHTML = ''; odakI = -1; clearInterval(odakSayac); Holo.detayKapat(); if (Holo.acikMi()) boyut(); },
    kart: function (k) {
      if (kartlar.length >= 6 || kartlar.some(function (x) { return x.anahtar && x.anahtar === k.anahtar; })) return;
      var e = el('button', { class: 'h-kart', type: 'button' }, [
        k.etiket ? etiketEl(k.etiket) : '',
        el('b', {}, [(IKON[k.tur] || '◆') + ' ' + (k.baslik || ''), el('i', { text: k.eylem ? 'AÇ ›' : '' })]),
        el('span', { class: 'h-alt', text: k.alt || '' })]);
      e.addEventListener('click', function () { if (k.eylem) { Holo.gizle(); k.eylem(); } });
      var kayit = { el: e, anahtar: k.anahtar || null }; kartlar.push(kayit); kartlarEl.appendChild(e);
      if (Holo.acikMi()) boyut();
      setTimeout(function () { e.classList.add('gir'); setTimeout(oklariCiz, 480); }, 120 + (kartlar.length - 1) * 260); // sırayla açılır
      odakDongu();
    },
    /* Detay paneli: kutucuk büyüyüp ekranın yanına yerleşir; 3B yapı üstte, etiketli bölümler altta */
    detayAc: function (baslik) {
      detayEl.innerHTML = ''; bolumler = []; bolumOdakI = -1;
      var sahneKabi = el('div', { class: 'h-sahne' }, [etiketEl('3 BOYUTLU YAPISI')]);
      detayEl.appendChild(el('h2', { text: baslik || '' }));
      detayEl.appendChild(sahneKabi);
      detayEl.appendChild(el('div', { class: 'h-bolumler' }));
      detayEl.classList.remove('acik'); void detayEl.offsetWidth; detayEl.classList.add('acik');
      Holo.goster(); boyut(); setTimeout(oklariCiz, 600);
      return sahneKabi;
    },
    detayBaslik: function (t) { var h = detayEl.querySelector('h2'); if (h) h.textContent = t; },
    detayBolum: function (b) {
      var kap = detayEl.querySelector('.h-bolumler'); if (!kap) return;
      var e = el('div', { class: 'h-bolum' + (b.eylem ? ' tik' : '') }, [etiketEl(b.etiket || 'AÇIKLAMA'), b.baslik ? el('b', { text: b.baslik }) : '']);
      if (b.html) e.appendChild(el('div', { html: b.html })); else if (b.metin) e.appendChild(el('p', { text: b.metin }));
      if (b.eylem) e.addEventListener('click', function () { Holo.gizle(); b.eylem(); });
      kap.appendChild(e); bolumler.push(e);
      setTimeout(function () { e.classList.add('gir'); }, 200 + (bolumler.length - 1) * 380);
      bolumDongu();
      return e;
    },
    detayKapat: function () { detayEl.classList.remove('acik'); detayEl.innerHTML = ''; bolumler = []; clearInterval(bolumSayac); if (Holo.acikMi()) boyut(); },
    detayAcikMi: detayAcik,
    altyaziBasla: function (metin) {
      AY.metin = String(metin || ''); AY.cumleler = [];
      var re = /[^.!?…]+[.!?…]*\s*/g, m; while ((m = re.exec(AY.metin))) AY.cumleler.push([m.index, m.index + m[0].length]);
      altyaziCiz(0, 0);
    },
    altyaziBitir: function () { AY.metin = ''; setTimeout(function () { if (!AY.metin) altyaziEl.innerHTML = ''; }, 1200); }
  };
})();
