/* 1001 — Halka menü (kullanıcı, 2026-11-03: "en üstteki tabı kaldır, çok rijit ve forced duruyor; sağ üst de öyle; carvis'in
   holografının altındaki tab kalp krizi geçirttirecek").
   Üst şerit (sekmeler + sağ üst göstergeler) ve Merkez'deki düğme sırası tamamen kalkar. Gezinme:
   - Sol üstteki küçük ışık noktası ya da alttaki Carvis küresine BASILI TUTMA → ekran kararır, bölümler kürenin etrafında halka
     olarak açılır; bir bölüme dokununca alt sayfaları onun çevresinde yörüngeye çıkar. Ortadaki küre: Carvis. Altta: Ara.
   - Yatay kaydırma (akis.js) bölümler arasında geçmeye devam eder. */
(function () {
  'use strict';
  if (/[?&]gomulu\b/.test(location.search)) return;
  var U = window.Uygulama; if (!U) return;
  var el = U.el;

  var BOLUM = [
    { ad: 'MERKEZ', ikon: '◉', h: 'kutuphane', alt: [] },
    { ad: 'OKU', ikon: '❏', h: 'oku', alt: [] },
    { ad: 'ÇALIŞ', ikon: '◈', alt: [['reels', 'Reels'], ['ders', 'Ders programı'], ['koc', 'Bugün'], ['plan', 'Plan'], ['kartlar', 'Kartlar'], ['test', 'Test'], ['tahmin', 'Tahmin'], ['saray', 'Saraylar']] },
    { ad: 'LAB', ikon: '⬡', alt: [['lab-hucre', 'Hücre'], ['lab-anatomi', 'Anatomi'], ['lab-molekul', 'Molekül'], ['zaman', 'Zaman']] },
    { ad: 'MÜZİK', ikon: '♫', h: 'muzik', alt: [] },
    { ad: 'ARŞİV', ikon: '▤', alt: null } // diğer tüm sekmeler
  ];

  var st = document.createElement('style');
  st.textContent = [
    'header.serit,.serit{display:none!important}',
    'body{padding-top:0!important}#ana{padding-top:max(18px,env(safe-area-inset-top))!important}',
    '.hud-kose{display:none!important}',
    '.jv-yuva,.mz-gecis,.mz-ok,.mz-ipucu,.mz-hud{display:none!important}',
    '.jv-ust{display:none!important}',
    '.mn-nokta{position:fixed;left:max(14px,env(safe-area-inset-left));top:max(14px,env(safe-area-inset-top));z-index:200;width:34px;height:34px;border-radius:50%;border:0;background:radial-gradient(circle,#c9fff6 0 14%,rgba(94,240,220,.55) 20%,rgba(94,240,220,.08) 55%,transparent 70%);box-shadow:0 0 18px rgba(94,240,220,.45);animation:mnNefes 3.6s ease-in-out infinite;cursor:pointer}',
    '@keyframes mnNefes{0%,100%{transform:scale(.9);opacity:.75}50%{transform:scale(1.08);opacity:1}}',
    'body.rl-acik .mn-nokta{display:none}',
    '.mn{position:fixed;inset:0;z-index:400;display:grid;place-items:center;background:radial-gradient(circle at 50% 50%,rgba(4,30,36,.78),rgba(1,6,9,.94) 70%);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);animation:mnAc .35s ease-out}',
    '@keyframes mnAc{from{opacity:0;backdrop-filter:blur(0)}to{opacity:1}}',
    '.mn-sahne{position:relative;width:min(92vmin,640px);height:min(92vmin,640px)}',
    '.mn-sahne svg.mn-halka{position:absolute;inset:0;width:100%;height:100%;pointer-events:none;animation:mnDon 40s linear infinite}',
    '@keyframes mnDon{to{transform:rotate(360deg)}}',
    '.mn-orta{position:absolute;left:50%;top:50%;width:26%;height:26%;transform:translate(-50%,-50%);border-radius:50%;border:0;background:transparent;cursor:pointer}',
    '.mn-orta canvas{width:100%;height:100%}',
    '.mn-dugum{position:absolute;left:50%;top:50%;width:92px;height:92px;margin:-46px 0 0 -46px;border-radius:50%;border:0;background:radial-gradient(circle,rgba(94,240,220,.18),rgba(94,240,220,.03) 62%,transparent 70%);color:#dffffa;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;font:600 11px var(--f-kod,monospace);letter-spacing:.18em;text-shadow:0 0 10px rgba(94,240,220,.8);transition:transform .6s cubic-bezier(.2,1.3,.4,1),opacity .4s,box-shadow .3s;cursor:pointer}',
    '.mn-dugum span{font-size:26px;letter-spacing:0}',
    '.mn-dugum::before{content:"";position:absolute;inset:6px;border-radius:50%;box-shadow:0 0 0 1px rgba(110,255,235,.35),inset 0 0 18px rgba(94,240,220,.15)}',
    '.mn-dugum.secili{box-shadow:0 0 40px rgba(94,240,220,.55)}',
    '.mn-dugum.secili::before{box-shadow:0 0 0 1.5px #8ffff0,inset 0 0 24px rgba(94,240,220,.35)}',
    '.mn-dugum.aktif::after{content:"";position:absolute;bottom:8px;width:6px;height:6px;border-radius:50%;background:#8ffff0;box-shadow:0 0 8px #8ffff0}',
    '.mn-alt{position:absolute;left:50%;top:50%;padding:8px 13px;border-radius:999px;border:0;background:radial-gradient(120% 160% at 50% 50%,rgba(94,240,220,.14),transparent 70%);box-shadow:0 0 0 1px rgba(110,255,235,.3);color:#e6fffb;font:600 12.5px var(--f-govde,system-ui);white-space:nowrap;transform:translate(-50%,-50%) scale(.4);opacity:0;transition:transform .5s cubic-bezier(.2,1.3,.4,1),opacity .35s;cursor:pointer}',
    '.mn-alt.gor{opacity:1}',
    '.mn-alt:hover,.mn-alt:focus-visible{box-shadow:0 0 0 1px #8ffff0,0 0 18px rgba(94,240,220,.5)}',
    '.mn-alt-sayfa{position:fixed;left:50%;bottom:max(24px,env(safe-area-inset-bottom));transform:translateX(-50%);display:flex;gap:10px}',
    '.mn-alt-sayfa button{background:transparent;border:0;box-shadow:0 0 0 1px rgba(110,255,235,.3);color:#cffff6;border-radius:999px;padding:9px 16px;font:600 12px var(--f-kod,monospace);letter-spacing:.14em}',
    '.mn-ipucu{position:fixed;top:max(20px,env(safe-area-inset-top));left:0;right:0;text-align:center;font:11px var(--f-kod,monospace);letter-spacing:.2em;color:rgba(160,240,230,.6)}',
    '@media (prefers-reduced-motion: reduce){.mn-sahne svg.mn-halka{animation:none}.mn-nokta{animation:none}}'
  ].join('\n');
  document.head.appendChild(st);

  function arsiv() {
    var bilinen = {}; BOLUM.forEach(function (b) { if (b.h) bilinen[b.h] = 1; (b.alt || []).forEach(function (a) { bilinen[a[0]] = 1; }); });
    bilinen.oku = 1;
    return (U.SEKMELER || []).filter(function (s) { return !bilinen[s.id] && !/^lab-hareket$/.test(s.id); }).map(function (s) { return [s.id, s.ad]; });
  }
  function git(h) { if (h === 'oku') { var D = U.Durum || {}; if (D.kitapId) { location.hash = U.okuHash(D.kitapId, D.bolumSira || 0); return; } h = 'kutuphane'; } location.hash = h; }
  function aktifBolum() {
    var h = location.hash.slice(1) || 'kutuphane';
    if (/^oku/.test(h)) return 'OKU'; if (h === 'kutuphane') return 'MERKEZ'; if (h === 'muzik') return 'MÜZİK';
    var b = BOLUM.filter(function (x) { return x.alt && x.alt.some(function (a) { return h.indexOf(a[0]) === 0; }); })[0];
    return b ? b.ad : 'ARŞİV';
  }

  var acik = null;
  function ac() {
    if (acik) return kapat();
    var sahne = el('div', { class: 'mn-sahne' });
    var ns = 'http://www.w3.org/2000/svg', svg = document.createElementNS(ns, 'svg'); svg.setAttribute('viewBox', '-100 -100 200 200'); svg.setAttribute('class', 'mn-halka');
    var hs = '<g fill="none" stroke="rgba(110,255,235,.35)" stroke-width=".35"><circle r="62"/><circle r="70" stroke-dasharray="1 2.4"/><circle r="94" stroke="rgba(110,255,235,.15)"/>';
    for (var i = 0; i < 120; i++) { var a = i / 120 * Math.PI * 2, r1 = i % 10 ? 90 : 86; hs += '<line x1="' + (Math.cos(a) * r1).toFixed(1) + '" y1="' + (Math.sin(a) * r1).toFixed(1) + '" x2="' + (Math.cos(a) * 92).toFixed(1) + '" y2="' + (Math.sin(a) * 92).toFixed(1) + '"/>'; }
    svg.innerHTML = hs + '</g>'; sahne.appendChild(svg);
    var cv = el('canvas', { 'aria-hidden': 'true' });
    var orta = el('button', { class: 'mn-orta', type: 'button', 'aria-label': 'Carvis ile konuş', onclick: function () { kapat(); var b = document.querySelector('.cv-balon'); if (b) b.hidden = false; if (window.Carvis && window.Carvis.ac && !window.Carvis.acik) window.Carvis.ac(); } }, [cv]);
    sahne.appendChild(orta);
    var R = 0.36, dugumler = [], altlar = [];
    var akt = aktifBolum();
    BOLUM.forEach(function (b, i) {
      var a = -Math.PI / 2 + i / BOLUM.length * Math.PI * 2;
      var d = el('button', { class: 'mn-dugum' + (b.ad === akt ? ' aktif' : ''), type: 'button', 'aria-label': b.ad }, [el('span', { text: b.ikon }), b.ad]);
      d.style.transform = 'translate(0,0) scale(.2)'; d.style.opacity = '0';
      sahne.appendChild(d); dugumler.push(d);
      setTimeout(function () { d.style.opacity = '1'; d.style.transform = 'translate(' + (Math.cos(a) * R * 100) + '%,' + (Math.sin(a) * R * 100) + '%) scale(1)'; d.style.transform = 'translate(calc(' + (Math.cos(a) * R) + ' * min(92vmin,640px)),calc(' + (Math.sin(a) * R) + ' * min(92vmin,640px))) scale(1)'; }, 40 + i * 55);
      d.addEventListener('click', function () {
        var liste = b.alt === null ? arsiv() : b.alt;
        if (!liste.length) { kapat(); git(b.h); return; }
        dugumler.forEach(function (x) { x.classList.toggle('secili', x === d); });
        altlar.forEach(function (x) { x.remove(); }); altlar = [];
        var n = liste.length, yay = Math.min(Math.PI * 1.1, 0.42 * n), r2 = 0.17 + (n > 6 ? 0.03 : 0);
        liste.forEach(function (s, k) {
          var aa = a + (n === 1 ? 0 : -yay / 2 + k / (n - 1) * yay), cx = Math.cos(a) * R + Math.cos(aa) * r2, cy = Math.sin(a) * R + Math.sin(aa) * r2;
          var x = el('button', { class: 'mn-alt', type: 'button', text: s[1], onclick: function () { kapat(); git(s[0]); } });
          x.style.left = 'calc(50% + ' + (Math.cos(a) * R) + ' * min(92vmin,640px))'; x.style.top = 'calc(50% + ' + (Math.sin(a) * R) + ' * min(92vmin,640px))';
          sahne.appendChild(x); altlar.push(x);
          setTimeout(function () { x.classList.add('gor'); x.style.left = 'calc(50% + ' + cx + ' * min(92vmin,640px))'; x.style.top = 'calc(50% + ' + cy + ' * min(92vmin,640px))'; x.style.transform = 'translate(-50%,-50%) scale(1)'; }, 30 + k * 45);
          x.style.transition += ',left .5s cubic-bezier(.2,1.3,.4,1),top .5s cubic-bezier(.2,1.3,.4,1)';
        });
      });
    });
    var arama = el('div', { class: 'mn-alt-sayfa' }, [
      el('button', { type: 'button', text: '⌕ ARA', onclick: function () { kapat(); var a = document.getElementById('aramaAc'); if (a) a.click(); } }),
      el('button', { type: 'button', text: '⚙ AYARLAR', onclick: function () { kapat(); var b = document.querySelector('.cv-balon button[aria-label="Carvis ayarları"]'); if (b) b.click(); } })]);
    acik = el('div', { class: 'mn', role: 'dialog', 'aria-label': 'Menü' }, [el('div', { class: 'mn-ipucu', text: 'BÖLÜM SEÇ · DIŞARI DOKUN: KAPAT' }), sahne, arama]);
    acik.addEventListener('click', function (e) { if (e.target === acik) kapat(); });
    document.body.appendChild(acik);
    if (window.JarvisKure) new window.JarvisKure(cv, { kucuk: true, serit: 2, iplik: 4, nokta: 100, kosul: function () { return !!acik; } });
  }
  function kapat() { if (!acik) return; var a = acik; acik = null; a.style.transition = 'opacity .25s'; a.style.opacity = '0'; setTimeout(function () { a.remove(); }, 260); }
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && acik) kapat(); });
  window.addEventListener('hashchange', kapat);

  var nokta = el('button', { class: 'mn-nokta', type: 'button', 'aria-label': 'Menü', title: 'Menü', onclick: ac });
  document.body.appendChild(nokta);

  // Carvis küresine basılı tut → menü
  function basiliTut(hedef) {
    var z = null, tetik = false;
    hedef.addEventListener('pointerdown', function () { tetik = false; z = setTimeout(function () { tetik = true; if (navigator.vibrate) try { navigator.vibrate(12); } catch (e) {} ac(); }, 480); });
    ['pointerup', 'pointerleave', 'pointercancel'].forEach(function (t) { hedef.addEventListener(t, function () { clearTimeout(z); }); });
    hedef.addEventListener('click', function (e) { if (tetik) { e.stopImmediatePropagation(); e.preventDefault(); tetik = false; } }, true);
  }
  (function bagla() { var d = document.getElementById('carvisDug'); if (!d) return setTimeout(bagla, 400); basiliTut(d); })();
  U.menuAc = ac;
})();
