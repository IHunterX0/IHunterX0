/* 1001 — Ana sayfa "Merkez": büyük, dönen çubuklu Jarvis küresi; kitaplar küreden uzanan ince ışık çubuklarının ucunda,
   adları YATAY yazılı holo kartlar.
   Kullanıcı (2026-11-02): "kütüphaneyi Jarvis'in etrafına çubuk olarak çıkar; tıklayınca biraz büyüsün, 1,5 sn basılı tutarsam
   kitabı açsın" → ilk sürüm (kalın dikey çubuklar) beğenilmedi: "Jarvis'i büyüt, isimleri yatay yaz".
   Dokun: kart büyür + alt satırda ayrıntı. 0,5 sn basılı tut (kullanıcı 1,5 sn'den indirdi): kartın altında ışık dolar, kitap kaldığı yerden açılır.
   Küreye dokun: Carvis (cihazda) ya da Sohbet (artifact). Klavye: Enter/Space = aç. */
(function () {
  'use strict';
  var U = window.Uygulama; if (!U) return;
  var el = U.el, $ = U.$, Kitaplik = U.Kitaplik, Depo = U.Depo;
  var AZ = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var css = document.createElement('style');
  css.textContent = [
    '.merkez{position:relative;width:100%;max-width:980px;aspect-ratio:16/10;margin:0 auto 4px;touch-action:manipulation;user-select:none;-webkit-user-select:none}',
    '@media (max-width:640px){.merkez{aspect-ratio:4/5}.mz-kitap{min-width:0;max-width:48.5%;padding:6px 10px 8px 12px}.mz-kitap .ad{font-size:12.5px;letter-spacing:.03em;overflow:hidden;text-overflow:ellipsis}.mz-kitap .alt{font-size:10.5px}}',
    '.merkez canvas{position:absolute;inset:0;width:100%;height:100%;pointer-events:none}',
    '.mz-kure{position:absolute;left:50%;top:50%;width:var(--kd,40%);aspect-ratio:1/1;transform:translate(-50%,-50%);border-radius:50%;border:0;background:transparent;color:var(--vurgu);cursor:pointer;display:grid;place-items:center;z-index:2}',
    '.mz-kure span{font:600 clamp(11px,1.8vw,16px) var(--f-baslik,inherit);letter-spacing:.28em;text-shadow:0 0 14px rgba(79,224,255,.9);transform:translateY(118%)}',
    '.mz-kure:focus-visible{outline:2px solid var(--vurgu);outline-offset:4px}',
    '.mz-kitap{position:absolute;left:0;top:0;transform:translate(-50%,-50%) scale(var(--s,1));z-index:3;cursor:pointer;border:1px solid color-mix(in srgb,var(--k) 75%,transparent);',
    '  background:linear-gradient(135deg,rgba(10,30,42,.92),rgba(4,14,20,.92));color:#eafcff;border-radius:10px;padding:8px 14px 10px 16px;min-width:clamp(118px,17vw,170px);text-align:left;',
    '  box-shadow:0 0 16px color-mix(in srgb,var(--k) 30%,transparent),inset 3px 0 0 var(--k);transition:transform .3s cubic-bezier(.2,.9,.3,1.4),box-shadow .3s;overflow:hidden}',
    '.mz-kitap .ad{display:block;font:700 clamp(13px,1.7vw,17px) var(--f-baslik,inherit);letter-spacing:.06em;text-transform:uppercase;white-space:nowrap}',
    '.mz-kitap .alt{display:block;font-size:11.5px;color:var(--metin-sonuk);margin-top:2px;white-space:nowrap}',
    '.mz-kitap .ek{display:block;max-height:0;opacity:0;font-size:11px;color:var(--k);transition:max-height .3s,opacity .3s;white-space:nowrap}',
    '.mz-kitap .il{position:absolute;left:0;bottom:0;height:3px;width:var(--y,0%);background:var(--k);opacity:.55}',
    '.mz-kitap .dolum{position:absolute;left:0;bottom:0;height:3px;width:var(--d,0%);background:#fff;box-shadow:0 0 10px #fff}',
    '.mz-kitap.secili{--s:1.16;z-index:4;box-shadow:0 0 30px color-mix(in srgb,var(--k) 60%,transparent),inset 3px 0 0 var(--k)}',
    '.mz-kitap.secili .ek{max-height:20px;opacity:1;margin-top:3px}',
    '.mz-kitap.aciliyor{--s:1.22;filter:brightness(1.4)}',
    '.mz-kitap:focus-visible{outline:2px solid #fff;outline-offset:2px}',
    '.mz-hud{position:absolute;left:50%;transform:translateX(-50%);display:flex;gap:8px;flex-wrap:wrap;justify-content:center;z-index:3;width:max-content;max-width:96%}',
    '.mz-hud.ust{top:2%}.mz-hud.alt{bottom:2%}',
    '.mz-cip{border:1px solid rgba(79,224,255,.35);background:rgba(4,14,20,.75);color:var(--metin);border-radius:999px;padding:4px 11px;font-size:12px;cursor:pointer;white-space:nowrap;backdrop-filter:blur(4px)}',
    '.mz-cip:hover{border-color:var(--vurgu)}.mz-cip b{color:var(--vurgu);font-weight:700}',
    '.mz-kaydir{display:flex;overflow-x:auto;scroll-snap-type:x mandatory;scrollbar-width:none;overscroll-behavior-x:contain;scroll-behavior:smooth}.mz-kaydir::-webkit-scrollbar{display:none}',
    '.mz-ekran{flex:0 0 100%;scroll-snap-align:start;min-width:0}',
    '.mz-gecis{display:flex;justify-content:center;align-items:center;gap:10px;margin:0 0 4px}',
    '.mz-gecis button{background:rgba(4,14,20,.7);border:1px solid rgba(79,224,255,.3);color:var(--metin-sonuk);border-radius:999px;padding:4px 14px;font:600 12px var(--f-baslik,inherit);letter-spacing:.12em;text-transform:uppercase;cursor:pointer}',
    '.mz-gecis button[aria-pressed=true]{color:#04121a;background:var(--vurgu);border-color:var(--vurgu);box-shadow:0 0 16px rgba(79,224,255,.5)}',
    '.mz-ok{position:absolute;top:50%;transform:translateY(-50%);z-index:6;width:40px;height:40px;border-radius:50%;border:1px solid rgba(79,224,255,.4);background:rgba(4,14,20,.75);color:var(--vurgu);font-size:20px;cursor:pointer}',
    '.mz-ok.sol{left:4px}.mz-ok.sag{right:4px}@media (hover:none){.mz-ok{display:none}}',
    '.mz-bolum{position:absolute;left:0;top:0;transform:translate(-50%,-50%) scale(var(--s,1));z-index:3;cursor:pointer;display:flex;align-items:center;gap:8px;border:1px solid color-mix(in srgb,var(--k) 70%,transparent);background:linear-gradient(135deg,rgba(10,30,42,.92),rgba(4,14,20,.92));color:#eafcff;border-radius:10px;padding:6px 12px 6px 8px;white-space:nowrap;box-shadow:0 0 14px color-mix(in srgb,var(--k) 25%,transparent),inset 3px 0 0 var(--k);transition:transform .25s cubic-bezier(.2,.9,.3,1.4),box-shadow .25s;font:600 clamp(11px,1.35vw,14px) var(--f-baslik,inherit);letter-spacing:.04em}',
    '.mz-bolum .ik{display:grid;place-items:center;width:24px;height:24px;border-radius:50%;border:1px solid color-mix(in srgb,var(--k) 70%,transparent);font-size:12px;box-shadow:0 0 10px color-mix(in srgb,var(--k) 40%,transparent)}',
    '.mz-bolum:hover,.mz-bolum:focus-visible{--s:1.12;box-shadow:0 0 26px color-mix(in srgb,var(--k) 55%,transparent),inset 3px 0 0 var(--k)}',
    '@media (max-width:640px){.mz-bolum{padding:4px 8px 4px 5px;gap:5px;font-size:11px}.mz-bolum .ik{width:20px;height:20px;font-size:10px}}',
    '.mz-ipucu{text-align:center;font-size:12px;color:var(--metin-sonuk);margin:0 0 10px}',
    '@media (prefers-reduced-motion: reduce){.mz-kitap{transition:none}}'
  ].join('\n');
  document.head.appendChild(css);

  /* ---- canvas: büyük çubuklu küre + kitaplara uzanan ince ışık çubukları (üzerlerinde dışa akan ışık) ---- */
  function sahneCiz(cv, durum) {
    var g = cv.getContext('2d'), N = 340, nok = [], t0 = performance.now(), dpr = Math.min(2, window.devicePixelRatio || 1);
    for (var i = 0; i < N; i++) { var y = 1 - (i / (N - 1)) * 2, r = Math.sqrt(1 - y * y), th = i * 2.399963; nok.push([Math.cos(th) * r, y, Math.sin(th) * r, 0.55 + 0.45 * Math.abs(Math.sin(i * 12.9898))]); }
    // kullanıcı, 2026-11-03: "çubuklu küre tasarımını görmek istemiyorum, yeni Carvis tasarımını istiyorum" → JarvisKure (jarvis.js) üst katmanda
    var jk = null, jkO = null, jkS = 0;
    if (window.JarvisKure && cv.parentNode) { jk = document.createElement('canvas'); jk.setAttribute('aria-hidden', 'true'); jk.style.cssText = 'position:absolute;pointer-events:none;z-index:1'; cv.parentNode.insertBefore(jk, cv.nextSibling); jkO = new window.JarvisKure(jk, { serit: 3, iplik: 5, nokta: 130 }); }
    (function kare() {
      if (!document.body.contains(cv)) return;
      requestAnimationFrame(kare);
      if (document.hidden) return;
      var bx = cv.getBoundingClientRect(); if (bx.right < 0 || bx.left > innerWidth || bx.width < 10) return;
      var w = cv.clientWidth, h = cv.clientHeight;
      if (cv.width !== Math.round(w * dpr) || cv.height !== Math.round(h * dpr)) { cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr); }
      var t = (performance.now() - t0) / 1000;
      g.setTransform(dpr, 0, 0, dpr, 0, 0); g.clearRect(0, 0, w, h);
      var cx = w / 2, cy = h / 2, R = durum.R || Math.min(w, h) * 0.2, konus, konus = !!(window.Carvis && window.Carvis.konusuyor), a = AZ ? 0.6 : t * (konus ? 0.5 : 0.22), b = 0.35, nb = 1 + (konus ? 0.08 * Math.abs(Math.sin(t * 7)) : 0.035 * Math.sin(t * 2.2));
      var ca = Math.cos(a), sa = Math.sin(a), cb = Math.cos(b), sb = Math.sin(b);
      // kitaplara uzanan ince çubuklar
      (durum.uclar || []).forEach(function (u, k) {
        var dx = u.x - cx, dy = u.y - cy, L = Math.sqrt(dx * dx + dy * dy) || 1, ux = dx / L, uy = dy / L;
        var x1 = cx + ux * R * 1.18, y1 = cy + uy * R * 1.18, x2 = u.x - ux * u.bosluk, y2 = u.y - uy * u.bosluk, secili = durum.secili === k;
        g.strokeStyle = u.renk; g.globalAlpha = secili ? 0.95 : 0.55; g.lineWidth = secili ? 2.2 : 1.3;
        g.shadowColor = u.renk; g.shadowBlur = secili ? 14 : 8;
        g.beginPath(); g.moveTo(x1, y1); g.lineTo(x2, y2); g.stroke();
        g.shadowBlur = 0;
        // dışa akan ışık
        var f = AZ ? 0.5 : ((t * 0.45 + k * 0.27) % 1), px = x1 + (x2 - x1) * f, py = y1 + (y2 - y1) * f;
        g.globalAlpha = 0.9 * Math.sin(f * Math.PI); g.fillStyle = '#eafcff'; g.beginPath(); g.arc(px, py, secili ? 3 : 2.2, 0, 7); g.fill();
        g.globalAlpha = 1; g.fillStyle = u.renk; g.beginPath(); g.arc(x1, y1, 2.4, 0, 7); g.fill();
      });
      g.globalAlpha = 1;
      // HUD halkaları
      if (jkO) { g.globalAlpha = 1; }
      g.strokeStyle = 'rgba(79,224,255,.2)'; g.lineWidth = 1;
      [1.12, 1.32].forEach(function (k, j) { var s0 = AZ ? 0 : t * (j ? -0.18 : 0.12); g.beginPath(); g.setLineDash(j ? [2, 7] : [30, 10]); g.arc(cx, cy, R * k, s0, s0 + Math.PI * 1.75); g.stroke(); });
      g.setLineDash([]);
      if (jkO) {
        var S = Math.round(R * 2.5); if (S !== jkS) { jkS = S; jk.style.width = S + 'px'; jk.style.height = S + 'px'; jkO.boyut(); }
        jk.style.left = (cv.offsetLeft + cx - S / 2) + 'px'; jk.style.top = (cv.offsetTop + cy - S / 2) + 'px';
        return;
      }
      // çubuklu küre (JarvisKure yoksa yedek)
      var l = nok.map(function (p) { var x = p[0] * ca + p[2] * sa, z = -p[0] * sa + p[2] * ca, y = p[1] * cb - z * sb; z = p[1] * sb + z * cb; return [x, y, z, p[3]]; }).sort(function (u, v) { return u[2] - v[2]; });
      l.forEach(function (p) {
        var on = (p[2] + 1) / 2, rr = R * 0.9 * nb, x1 = cx + p[0] * rr, y1 = cy - p[1] * rr, uz = 1 + 0.17 * p[3] * (0.7 + 0.3 * Math.sin(t * 3 + p[3] * 9)), x2 = cx + p[0] * rr * uz, y2 = cy - p[1] * rr * uz;
        g.strokeStyle = 'rgba(' + Math.round(120 + 100 * on) + ',' + Math.round(220 + 30 * on) + ',255,' + (0.1 + 0.75 * on) + ')';
        g.lineWidth = 0.6 + 1.6 * on; g.beginPath(); g.moveTo(x1, y1); g.lineTo(x2, y2); g.stroke();
      });
      var gr = g.createRadialGradient(cx, cy, 0, cx, cy, R); gr.addColorStop(0, 'rgba(79,224,255,.2)'); gr.addColorStop(1, 'rgba(79,224,255,0)');
      g.fillStyle = gr; g.beginPath(); g.arc(cx, cy, R, 0, 7); g.fill();
    })();
  }

  function merkezCiz(kap) {
    var m = el('div', { class: 'merkez', role: 'group', 'aria-label': 'Kitaplar ve Carvis' });
    var cv = el('canvas', { 'aria-hidden': 'true' }); m.appendChild(cv);
    var kure = el('button', { class: 'mz-kure', type: 'button', 'aria-label': 'Carvis ile konuş' }, [el('span', { text: 'C.A.R.V.I.S.' })]);
    kure.addEventListener('click', function () { if (window.Carvis && window.Carvis.ac) { var b = document.querySelector('.cv-balon'); if (b) b.hidden = false; window.Carvis.ac(); } else U.git('sohbet'); });
    m.appendChild(kure);
    kap.appendChild(m);
    kap.appendChild(el('p', { class: 'mz-ipucu', text: 'Kitaba dokun: büyür · 0,5 sn basılı tut: açılır · küreye dokun: Carvis' }));
    var durum = { uclar: [], secili: -1, R: 0 };
    // Canlı pano: bugünkü durum (plan, seri, vadeli kart, pomodoro, eksik) — dokununca ilgili sayfa
    var hudUst = el('div', { class: 'mz-hud ust' }), hudAlt = el('div', { class: 'mz-hud alt' }); m.appendChild(hudUst); m.appendChild(hudAlt);
    function cip(kap, ikon, metin, guclu, eylem) { kap.appendChild(el('button', { class: 'mz-cip', type: 'button', onclick: eylem }, [ikon + ' ', guclu != null ? el('b', { text: String(guclu) }) : null, guclu != null ? ' ' : null, metin])); }
    function panoCiz() {
      if (!document.body.contains(m) || !U.calismaOnerisi) return;
      U.calismaOnerisi().then(function (o) {
        hudUst.innerHTML = ''; hudAlt.innerHTML = '';
        var pm = o.pomodoro || {}, ilk = o.isler.filter(function (x) { return x.tur === 'plan'; })[0];
        if (o.sinav) cip(hudUst, '📅', 'gün: ' + o.sinav.kitap + ' sınavı', o.sinav.gun, function () { U.git('plan'); });
        cip(hudUst, '🔥', 'gün seri', pm.seri_gun || 0, function () { U.git('koc'); });
        cip(hudUst, '⏱', '/ ' + (pm.gunluk_hedef_dk || 120) + ' dk bugün', pm.bugun_dakika || 0, function () { U.saatAc && U.saatAc(); });
        if (o.vadeli) cip(hudAlt, '❖', 'vadeli kart', o.vadeli, function () { U.git('kartlar'); });
        if (pm.calisiyor) cip(hudAlt, pm.mod === 'calis' ? '📖' : '☕', 'kaldı', pm.kalan, function () { U.saatAc && U.saatAc(); });
        if (ilk) cip(hudAlt, '▶', ilk.ad.length > 34 ? ilk.ad.slice(0, 33) + '…' : ilk.ad, null, function () { if (ilk.kitap) U.git(U.okuHash(ilk.kitap, ilk.sira || 0)); else U.git('koc'); });
        var ek = o.isler.filter(function (x) { return x.tur === 'eksik'; })[0];
        if (ek) cip(hudAlt, '🎯', 'eksik kapat', null, function () { U.git('koc'); });
      }).catch(function () {});
    }
    panoCiz(); var panoZaman = setInterval(function () { if (!document.body.contains(m)) return clearInterval(panoZaman); panoCiz(); }, 60000);
    sahneCiz(cv, durum);
    Promise.all([Kitaplik.katalog(), Depo.oku('ilerleme')]).then(function (r) {
      var liste = r[0], il = r[1] || {}, n = liste.length; if (!n) return;
      var kartlar = [];
      function kapat() { kartlar.forEach(function (c) { c.classList.remove('secili'); }); durum.secili = -1; }
      liste.forEach(function (k, i) {
        var renk = k.renk || '#4fe0ff';
        var okunan = Object.keys(((il.okunan || {})[k.id]) || {}).length, top = (k.sayilar && k.sayilar.altBolum) || 0, yz = top ? Math.min(100, Math.round(100 * okunan / top)) : 0;
        var ad = k.baslik.replace(/^1001\s*/, '');
        var c = el('button', { class: 'mz-kitap', type: 'button', style: '--k:' + renk + ';--y:' + yz + '%', 'aria-label': ad + ', %' + yz + ' okundu. Açmak için Enter ya da yarım saniye basılı tut.' }, [
          el('span', { class: 'ad', text: ad }),
          el('span', { class: 'alt', text: '%' + yz + ' okundu · ' + ((k.sayilar && k.sayilar.bolum) || '–') + ' bölüm' }),
          el('span', { class: 'ek', text: ((k.sayilar && k.sayilar.soruAilesi) || 0) + ' çıkmış soru · basılı tut: aç' }),
          el('span', { class: 'il' }), el('span', { class: 'dolum' })]);
        var zaman = null, bas = 0, raf = null, acildi = false;
        function ac() {
          acildi = true; c.classList.add('aciliyor'); try { if (navigator.vibrate) navigator.vibrate(35); } catch (e) {}
          var s = (il.okuma || {})[k.id]; setTimeout(function () { U.git(U.okuHash(k.id, s ? s.bolum : 0)); }, 160);
        }
        function sec() { var yeni = !c.classList.contains('secili'); kapat(); if (yeni) { c.classList.add('secili'); durum.secili = i; } }
        function birak() { clearTimeout(zaman); cancelAnimationFrame(raf); c.style.setProperty('--d', '0%'); }
        c.addEventListener('pointerdown', function (e) {
          if (e.button && e.button !== 0) return;
          acildi = false; bas = performance.now(); try { c.setPointerCapture(e.pointerId); } catch (x) {}
          zaman = setTimeout(ac, 500);
          (function dol() { var p = Math.min(1, (performance.now() - bas) / 500); c.style.setProperty('--d', Math.round(p * 100) + '%'); if (p < 1) raf = requestAnimationFrame(dol); })();
        });
        c.addEventListener('pointerup', function () { var sure = performance.now() - bas; birak(); if (!acildi && sure < 500) sec(); });
        c.addEventListener('pointercancel', birak); c.addEventListener('lostpointercapture', function () { if (!acildi) birak(); });
        c.addEventListener('contextmenu', function (e) { e.preventDefault(); });
        c.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); ac(); } });
        c.addEventListener('click', function (e) { e.preventDefault(); });
        kartlar.push(c); m.appendChild(c);
      });
      // yerleşim: kartlar kürenin etrafında elips üzerinde (yatayda geniş), çapraz açılarda; küre büyük
      function olc() {
        var w = m.clientWidth, h = m.clientHeight, dar = w < 640;
        durum.R = Math.min(w, h) * (dar ? 0.2 : 0.23);
        m.style.setProperty('--kd', Math.round(durum.R * 2 / w * 100) + '%');
        var rx = dar ? w * 0.25 : Math.min(w * 0.36, h * 0.62), ry = dar ? h * 0.39 : h * 0.37;
        durum.uclar = kartlar.map(function (c, i) {
          var aci = (n === 4 ? -135 + 90 * i : -90 + (360 / n) * i) * Math.PI / 180, x = w / 2 + Math.cos(aci) * rx, y = h / 2 + Math.sin(aci) * ry;
          if (dar && Math.abs(Math.cos(aci)) > 0.3) x = Math.cos(aci) > 0 ? w - c.offsetWidth / 2 - 2 : c.offsetWidth / 2 + 2; // dar ekranda kenarlara yasla
          c.style.left = x + 'px'; c.style.top = y + 'px';
          return { x: x, y: y, renk: getComputedStyle(c).getPropertyValue('--k').trim() || '#4fe0ff', bosluk: Math.min(c.offsetWidth, c.offsetHeight * 2.4) / 2 + 4 };
        });
      }
      olc(); window.addEventListener('resize', olc); setTimeout(olc, 300);
      m.addEventListener('pointerdown', function (e) { if (e.target === m) kapat(); });
    });
  }
  U.merkezCiz = merkezCiz;
  var RENKLER = ['#4fe0ff', '#7ff0b0', '#ffb547', '#c792ff', '#ff7a9c', '#6aa8ff', '#5fe0a0', '#ffd76a'];
  function bolumlerCiz(kap) {
    var m = el('div', { class: 'merkez', role: 'group', 'aria-label': 'Bölümler' });
    var cv = el('canvas', { 'aria-hidden': 'true' }); m.appendChild(cv);
    var kure = el('button', { class: 'mz-kure', type: 'button', 'aria-label': 'Carvis ile konuş' }, [el('span', { text: 'BÖLÜMLER' })]);
    kure.addEventListener('click', function () { if (window.Carvis && window.Carvis.ac) { var b = document.querySelector('.cv-balon'); if (b) b.hidden = false; window.Carvis.ac(); } else U.git('sohbet'); });
    m.appendChild(kure); kap.appendChild(m);
    kap.appendChild(el('p', { class: 'mz-ipucu', text: 'Bir bölüme dokun: açılır · sola kaydır: kitaplar' }));
    var durum = { uclar: [], secili: -1, R: 0 }; sahneCiz(cv, durum);
    var liste = (U.SEKMELER || []).filter(function (x) { return x.id !== 'kutuphane' && x.id !== 'oku'; });
    var kartlar = liste.map(function (x, i) {
      var renk = RENKLER[i % RENKLER.length];
      var c = el('button', { class: 'mz-bolum', type: 'button', style: '--k:' + renk, 'aria-label': x.ad, onclick: function () { U.git(x.id); } }, [el('span', { class: 'ik', text: x.ikon || '•' }), el('span', { text: x.ad })]);
      m.appendChild(c); return c;
    });
    function olc() {
      var w = m.clientWidth, h = m.clientHeight, dar = w < 640, n = kartlar.length;
      if (!w) return;
      durum.R = Math.min(w, h) * (dar ? 0.17 : 0.2);
      m.style.setProperty('--kd', Math.round(durum.R * 2 / w * 100) + '%');
      var rx = dar ? w * 0.3 : Math.min(w * 0.4, h * 0.72), ry = h * (dar ? 0.43 : 0.41);
      durum.uclar = kartlar.map(function (c, i) {
        var aci = (-90 + (360 / n) * i) * Math.PI / 180, x = w / 2 + Math.cos(aci) * rx, y = h / 2 + Math.sin(aci) * ry;
        var yari = c.offsetWidth / 2 + 2;
        if (dar) { // telefonda iki sütun: sol yarı solda, sağ yarı sağda, eşit aralıklı (elipste üst/alt kartlar çakışıyordu)
          var sol = Math.ceil(n / 2), sag = i < sol, j = sag ? i : i - sol, adet = sag ? sol : n - sol;
          y = h * 0.06 + (h * 0.88) * (adet > 1 ? j / (adet - 1) : 0.5); x = sag ? yari : w - yari;
        }
        x = Math.max(yari, Math.min(w - yari, x));
        c.style.left = x + 'px'; c.style.top = y + 'px';
        return { x: x, y: y, renk: getComputedStyle(c).getPropertyValue('--k').trim() || '#4fe0ff', bosluk: Math.min(c.offsetWidth / 2, c.offsetHeight * 1.6) + 4 };
      });
    }
    olc(); window.addEventListener('resize', olc); setTimeout(olc, 300); setTimeout(olc, 1200);
    return olc;
  }
  U.bolumlerCiz = bolumlerCiz;
  var eskiKutup = U.GORUNUMLER.kutuphane;
  U.GORUNUMLER.kutuphane = function () {
    eskiKutup.apply(this, arguments);
    var sayfa = $('#ana .sayfa'), kahraman = sayfa && sayfa.querySelector('.kahraman');
    if (!sayfa) return;
    // Kullanıcı (2026-11-02): "Jarvis ekranından sağa kaydırayım, üstteki bölümler de Jarvis'in etrafına çubukla bağlı (yatay yazı) olsun"
    var kap = el('div', { class: 'merkez-kap', style: 'position:relative' });
    if (kahraman) { var h1 = kahraman.querySelector('h1'); if (h1) h1.textContent = 'Merkez'; kahraman.after(kap); } else sayfa.prepend(kap);
    var e1 = el('div', { class: 'mz-ekran' }), e2 = el('div', { class: 'mz-ekran' }), kaydir = el('div', { class: 'mz-kaydir' }, [e1, e2]);
    var d1 = el('button', { type: 'button', 'aria-pressed': 'true', text: 'Kitaplar', onclick: function () { git(0); } }), d2 = el('button', { type: 'button', 'aria-pressed': 'false', text: 'Bölümler', onclick: function () { git(1); } });
    kap.appendChild(el('div', { class: 'mz-gecis' }, [d1, d2]));
    kap.appendChild(kaydir);
    kap.appendChild(el('button', { class: 'mz-ok sol', type: 'button', 'aria-label': 'Kitaplar', text: '‹', onclick: function () { git(0); } }));
    kap.appendChild(el('button', { class: 'mz-ok sag', type: 'button', 'aria-label': 'Bölümler', text: '›', onclick: function () { git(1); } }));
    merkezCiz(e1); var olc2 = bolumlerCiz(e2);
    function git(i) { kaydir.scrollTo({ left: i * kaydir.clientWidth, behavior: 'smooth' }); }
    kaydir.addEventListener('scroll', function () {
      var i = Math.round(kaydir.scrollLeft / Math.max(1, kaydir.clientWidth));
      d1.setAttribute('aria-pressed', String(i === 0)); d2.setAttribute('aria-pressed', String(i === 1));
      try { sessionStorage.setItem('merkezEkran', String(i)); } catch (e) {}
      if (i === 1 && olc2) olc2();
    }, { passive: true });
    try { if (sessionStorage.getItem('merkezEkran') === '1') setTimeout(function () { kaydir.scrollLeft = kaydir.clientWidth; }, 50); } catch (e) {}
  };
})();
