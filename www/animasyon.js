/* 1001 — Animasyon motoru v3 (kullanıcı, 2026-11-03: "gerçek reels gibi yap; graflar gözüksün, animasyonlar gözüksün; bağımlılık
   yapıcı; Patrick Jane anlatımı yapsın; Carvis bazı şeylere zoomlasın, insan vücudunda ne yaptığını anlatsın; flashcard gibi değil").
   Yapay zekâ SAHNE SENARYOSU (JSON) yazar; bu motor GSAP ile oynatır:
   - Holografik insan vücudu (organlar, kemikler, kaslar, sinir, damar) + KAMERA: organa yakınlaşma/kaydırma, organ nabız gibi parlar.
   - Hücre laboratuvarı simülasyonlarını sahne içine gömme ("kalbe zoom → kas hücresi kasılıyor").
   - Kinetik yazı, ikon, şekil, kendiliğinden çizilen ok, yol boyunca akan parçacık, sayaç, ışıkla dolan büyük grafik, vurgu, çizik.
   - TikTok tarzı büyük, kelime kelime yanan altyazı; sahneler arası dalma/kaydırma/parlama geçişleri.
   - Etkileşim: orta = durdur/sürdür, sol/sağ kenar = önceki/sonraki sahne, parlayan noktalı öğe = açıklama, soru durağı = cevap bekler. */
(function () {
  'use strict';
  var U = window.Uygulama; if (!U) return;
  var el = U.el, NS = 'http://www.w3.org/2000/svg';
  var RENK = { teal: '#5ef0dc', sari: '#ffd38a', mor: '#c88cff', kirmizi: '#ff7a7a', yesil: '#8cffa0', mavi: '#46c8ff', beyaz: '#effffc', turuncu: '#ffab5e' };
  function renk(r) { return RENK[r] || (/^#[0-9a-f]{3,8}$/i.test(r || '') ? r : RENK.teal); }
  function sayi(v, d) { v = +v; return isFinite(v) ? v : d; }
  function kl(v) { return Math.max(0, Math.min(1, v)); }

  var st = document.createElement('style');
  st.textContent = [
    '.an-sahne{position:relative;width:100%;height:100%;overflow:hidden;touch-action:manipulation;user-select:none}',
    '.an-dunya{position:absolute;inset:0;transform-origin:0 0;will-change:transform}',
    '.an-sahne svg.an-svg{position:absolute;inset:0;width:100%;height:100%;overflow:visible}',
    '.an-katman{position:absolute;inset:0}',
    '.an-o{position:absolute;transform:translate(-50%,-50%);will-change:transform,opacity;pointer-events:auto}',
    '.an-yazi{font:800 calc(var(--b,1) * clamp(24px,5vw,48px))/1.12 var(--f-baslik,system-ui);color:#fff;text-align:center;letter-spacing:-.01em;text-shadow:0 0 22px rgba(94,240,220,.75),0 3px 0 rgba(0,0,0,.35);max-width:88%;white-space:pre-wrap}',
    '.an-ikon{font-size:calc(var(--b,1) * clamp(44px,8vw,88px));line-height:1;filter:drop-shadow(0 0 18px rgba(94,240,220,.7))}',
    '.an-etiket{font:700 calc(var(--b,1) * clamp(13px,1.9vw,17px)) var(--f-kod,monospace);letter-spacing:.04em;color:#e6fffb;text-shadow:0 0 10px rgba(94,240,220,.85);white-space:nowrap}',
    '.an-sayac{font:200 calc(var(--b,1) * clamp(40px,8vw,84px)) var(--f-kod,monospace);color:#ffd38a;text-shadow:0 0 24px rgba(255,200,100,.75)}',
    '.an-vucut{position:absolute;left:50%;top:50%;height:96%;aspect-ratio:200/520;transform:translate(-50%,-50%)}',
    '.an-vucut svg{width:100%;height:100%;overflow:visible}',
    '.an-vucut .org{transition:fill-opacity .4s,stroke-width .4s}',
    '.an-vucut .org.on{animation:anOrgan 1.1s ease-in-out infinite}',
    '@keyframes anOrgan{0%,100%{fill-opacity:.35;filter:drop-shadow(0 0 4px currentColor)}50%{fill-opacity:.8;filter:drop-shadow(0 0 14px currentColor)}}',
    '.an-lab{position:absolute;transform:translate(-50%,-50%);border-radius:22px;overflow:hidden;box-shadow:0 0 0 1px rgba(110,255,235,.4),0 0 40px rgba(94,240,220,.25);background:radial-gradient(circle,rgba(10,40,48,.6),rgba(2,8,12,.85))}',
    '.an-lab canvas{width:100%;height:100%;display:block}',
    '.an-alt{position:absolute;left:4%;right:4%;bottom:7%;z-index:6;text-align:center;font:900 clamp(20px,4.2vw,36px)/1.18 var(--f-baslik,system-ui);letter-spacing:-.01em;pointer-events:none;text-transform:none}',
    '.an-alt span{color:rgba(255,255,255,.35);transition:color .12s,text-shadow .12s;-webkit-text-stroke:0}',
    '.an-alt span.soy{color:#fff;text-shadow:0 2px 0 #000,0 0 18px rgba(0,0,0,.7)}',
    '.an-alt span.simdi{color:#ffe36e;text-shadow:0 2px 0 #000,0 0 22px rgba(255,220,100,.85)}',
    '.an-ipucu{position:absolute;z-index:8;max-width:min(320px,70%);padding:10px 14px;border-radius:16px;background:rgba(3,16,22,.94);box-shadow:0 0 0 1px rgba(110,255,235,.5),0 0 24px rgba(94,240,220,.3);color:#e6fffb;font-size:14px;line-height:1.45;transform:translate(-50%,calc(-100% - 18px))}',
    '.an-tikla{cursor:pointer}.an-tikla::after{content:"";position:absolute;right:-8px;top:-8px;width:10px;height:10px;border-radius:50%;background:#8ffff0;box-shadow:0 0 8px #8ffff0;animation:anNokta 1.4s ease-in-out infinite}',
    '@keyframes anNokta{50%{transform:scale(1.6);opacity:.4}}',
    '.an-durdu{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);font-size:64px;color:rgba(230,255,250,.85);pointer-events:none;text-shadow:0 0 24px rgba(94,240,220,.8);z-index:9}',
    '.an-segment{position:absolute;left:12px;right:12px;top:8px;display:flex;gap:4px;z-index:9;pointer-events:none}',
    '.an-segment i{flex:1;height:3px;border-radius:2px;background:rgba(255,255,255,.2);overflow:hidden}.an-segment i b{display:block;height:100%;width:0;background:#fff;box-shadow:0 0 8px #5ef0dc}',
    '.an-flas{position:absolute;inset:0;z-index:7;pointer-events:none;background:radial-gradient(circle,rgba(180,255,245,.55),transparent 70%);opacity:0}',
    '.an-soru{position:absolute;inset:10% 7%;z-index:8;display:flex;flex-direction:column;gap:10px;justify-content:center}',
    '.an-soru h4{margin:0 0 6px;font:800 clamp(20px,3.6vw,32px)/1.25 var(--f-baslik,system-ui);color:#fff;text-shadow:0 0 18px rgba(94,240,220,.6)}',
    '.an-soru button{text-align:left;padding:13px 16px;border-radius:16px;border:0;background:rgba(94,240,220,.08);box-shadow:0 0 0 1px rgba(110,255,235,.35);color:#f0fffc;font-size:16px;font-weight:600}',
    '.an-soru button.dogru{box-shadow:0 0 0 2px #8cffa0,0 0 24px rgba(140,255,160,.5)}.an-soru button.yanlis{box-shadow:0 0 0 2px #ff7a7a;opacity:.8}',
    '.an-soru p{margin:4px 0 0;color:#ffd38a;font-size:15px;line-height:1.45}'
  ].join('\n');
  document.head.appendChild(st);

  /* ---------- holografik insan vücudu (önden; hastanın sağı = görüntünün solu) ---------- */
  var ORGAN = {
    beyin: { d: 'M74 30 C74 12 126 12 126 30 C134 36 132 56 120 60 C112 66 88 66 80 60 C68 56 66 36 74 30 Z', r: 'mor', ad: 'beyin' },
    goz: { d: 'M86 52 a4 3 0 1 0 8 0 a4 3 0 1 0 -8 0 M106 52 a4 3 0 1 0 8 0 a4 3 0 1 0 -8 0', r: 'mavi', ad: 'göz' },
    tiroid: { d: 'M90 92 C94 86 106 86 110 92 C106 98 94 98 90 92 Z', r: 'turuncu', ad: 'tiroid' },
    akciger_sag: { d: 'M66 118 C66 104 90 100 94 112 L94 176 C84 182 66 180 62 170 Z', r: 'mavi', ad: 'sağ akciğer' },
    akciger_sol: { d: 'M134 118 C134 104 110 100 106 112 L106 176 C116 182 134 180 138 170 Z', r: 'mavi', ad: 'sol akciğer' },
    kalp: { d: 'M100 138 C96 126 110 122 114 132 C118 124 130 130 124 142 C120 152 110 160 104 164 C100 156 94 146 100 138 Z', r: 'kirmizi', ad: 'kalp' },
    aort: { d: 'M108 130 C104 112 98 112 100 124 L100 250', r: 'kirmizi', ad: 'aort', cizgi: true },
    karaciger: { d: 'M62 186 C70 176 108 176 112 186 C108 204 82 210 64 204 C58 198 58 192 62 186 Z', r: 'turuncu', ad: 'karaciğer' },
    mide: { d: 'M112 186 C124 178 140 186 136 202 C132 214 118 216 112 206 C108 198 108 192 112 186 Z', r: 'sari', ad: 'mide' },
    dalak: { d: 'M140 190 C148 188 150 204 142 208 C136 204 136 194 140 190 Z', r: 'mor', ad: 'dalak' },
    pankreas: { d: 'M90 214 C100 208 124 208 132 214 C124 220 100 222 90 218 Z', r: 'sari', ad: 'pankreas' },
    bobrek_sag: { d: 'M74 214 C66 216 66 236 76 238 C82 236 82 218 74 214 Z', r: 'mor', ad: 'sağ böbrek' },
    bobrek_sol: { d: 'M126 214 C134 216 134 236 124 238 C118 236 118 218 126 214 Z', r: 'mor', ad: 'sol böbrek' },
    bagirsak: { d: 'M74 240 C74 232 126 232 126 240 L126 270 C126 280 74 280 74 270 Z M84 248 h32 M84 258 h32 M84 266 h32', r: 'turuncu', ad: 'bağırsaklar' },
    mesane: { d: 'M90 284 C90 276 110 276 110 284 C110 294 90 294 90 284 Z', r: 'sari', ad: 'mesane' },
    omurilik: { d: 'M100 64 L100 270', r: 'sari', ad: 'omurilik', cizgi: true },
    kafatasi: { d: 'M70 36 C70 2 130 2 130 36 C132 58 120 74 100 76 C80 74 68 58 70 36 Z', r: 'beyaz', ad: 'kafatası', cizgi: true },
    humerus: { d: 'M50 104 L40 186', r: 'beyaz', ad: 'humerus', cizgi: true },
    radius_ulna: { d: 'M40 192 L32 262 M44 192 L38 262', r: 'beyaz', ad: 'radius-ulna', cizgi: true },
    femur: { d: 'M82 290 L80 392 M118 290 L120 392', r: 'beyaz', ad: 'femur', cizgi: true },
    tibia: { d: 'M80 400 L80 492 M120 400 L120 492', r: 'beyaz', ad: 'tibia', cizgi: true },
    biceps: { d: 'M150 112 C162 128 164 160 156 180 C150 168 146 130 150 112 Z', r: 'kirmizi', ad: 'biceps' },
    kuadriseps: { d: 'M124 296 C138 320 140 370 128 392 C120 370 118 320 124 296 Z', r: 'kirmizi', ad: 'kuadriseps' },
    kalp_damar: { d: 'M100 164 C80 200 60 260 46 300 M104 164 C124 200 140 260 152 300', r: 'kirmizi', ad: 'damarlar', cizgi: true }
  };
  var GOVDE = 'M100 4 C122 4 132 20 130 42 C128 62 118 76 108 80 L110 92 C130 96 150 98 160 110 C170 150 172 200 166 262 L156 264 C158 220 156 168 150 132 L144 130 C146 180 144 230 140 282 C138 330 136 390 132 500 L108 500 L104 300 L96 300 L92 500 L68 500 C64 390 62 330 60 282 C56 230 54 180 56 130 L50 132 C44 168 42 220 44 264 L34 262 C28 200 30 150 40 110 C50 98 70 96 90 92 L92 80 C82 76 72 62 70 42 C68 20 78 4 100 4 Z';
  function vucutKur(odaklar, renkOn) {
    var s = document.createElementNS(NS, 'svg'); s.setAttribute('viewBox', '0 0 200 520');
    var h = '<defs><linearGradient id="anVg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5ef0dc" stop-opacity=".14"/><stop offset="1" stop-color="#46c8ff" stop-opacity=".03"/></linearGradient></defs>' +
      '<path d="' + GOVDE + '" fill="url(#anVg)" stroke="#5ef0dc" stroke-opacity=".7" stroke-width="1.2" style="filter:drop-shadow(0 0 6px #5ef0dc)"/>';
    for (var y = 20; y < 500; y += 14) h += '<line x1="30" x2="170" y1="' + y + '" y2="' + y + '" stroke="#5ef0dc" stroke-opacity=".05"/>';
    s.innerHTML = h;
    Object.keys(ORGAN).forEach(function (k) {
      var o = ORGAN[k], p = document.createElementNS(NS, 'path'), c = renk(o.r);
      p.setAttribute('d', o.d); p.setAttribute('class', 'org'); p.setAttribute('data-org', k); p.style.color = c;
      if (o.cizgi) { p.setAttribute('fill', 'none'); p.setAttribute('stroke', c); p.setAttribute('stroke-width', k === 'omurilik' || k === 'aort' ? 2 : 2.4); p.setAttribute('stroke-opacity', '.55'); p.setAttribute('stroke-linecap', 'round'); }
      else { p.setAttribute('fill', c); p.setAttribute('fill-opacity', '.18'); p.setAttribute('stroke', c); p.setAttribute('stroke-width', '1'); p.setAttribute('stroke-opacity', '.75'); }
      s.appendChild(p);
    });
    (odaklar || []).forEach(function (k) { var p = s.querySelector('[data-org="' + k + '"]'); if (p) { p.classList.add('on'); if (renkOn) { p.style.color = renk(renkOn); } } });
    return s;
  }

  /* ---------- arka planlar ---------- */
  function arka(cv, tur) {
    var ctx = cv.getContext('2d'), w = 0, h = 0, P = [];
    var cfg = { hucre: ['120,255,235', 'kabarcik'], kan: ['255,120,130', 'disk'], beyin: ['200,140,255', 'ag'], kalp: ['255,120,130', 'nabiz'], uzay: ['160,200,255', 'yildiz'], koridor: ['94,240,220', 'izgara'], laboratuvar: ['94,240,220', 'izgara'], vucut: ['94,240,220', 'yildiz'], bos: ['94,240,220', 'yildiz'] }[tur] || ['94,240,220', 'izgara'];
    function boyut() { var r = cv.getBoundingClientRect(); w = cv.width = Math.max(1, r.width); h = cv.height = Math.max(1, r.height); P = []; for (var i = 0; i < 50; i++) P.push({ x: Math.random() * w, y: Math.random() * h, r: 2 + Math.random() * (cfg[1] === 'kabarcik' || cfg[1] === 'disk' ? 18 : 2), v: 0.15 + Math.random() * 0.5, a: Math.random() * 6 }); }
    return function (t) {
      if (!w || cv.width !== Math.round(cv.getBoundingClientRect().width)) boyut();
      ctx.clearRect(0, 0, w, h); ctx.globalCompositeOperation = 'lighter';
      var c = cfg[0];
      if (cfg[1] === 'izgara') { ctx.strokeStyle = 'rgba(' + c + ',.07)'; var uf = h * 0.62; for (var i = -12; i <= 12; i++) { ctx.beginPath(); ctx.moveTo(w / 2 + i * 18, uf); ctx.lineTo(w / 2 + i * w * 0.18, h); ctx.stroke(); } for (var j = 0; j < 9; j++) { var y = uf + Math.pow((j + (t * 0.0004) % 1) / 9, 2) * (h - uf); ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); } }
      if (cfg[1] === 'nabiz') { var n = Math.pow(Math.max(0, Math.sin(t * 0.004)), 12); var g0 = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w * 0.5); g0.addColorStop(0, 'rgba(' + c + ',' + (0.05 + 0.12 * n) + ')'); g0.addColorStop(1, 'rgba(' + c + ',0)'); ctx.fillStyle = g0; ctx.fillRect(0, 0, w, h); }
      P.forEach(function (q) {
        q.y -= q.v; q.x += Math.sin(t * 0.001 + q.a) * 0.3; if (q.y < -20) { q.y = h + 20; q.x = Math.random() * w; }
        if (cfg[1] === 'kabarcik' || cfg[1] === 'disk') { ctx.beginPath(); ctx.ellipse(q.x, q.y, q.r, q.r * (cfg[1] === 'disk' ? 0.55 : 1), q.a, 0, Math.PI * 2); ctx.strokeStyle = 'rgba(' + c + ',.12)'; ctx.stroke(); }
        else if (cfg[1] === 'ag') { ctx.fillStyle = 'rgba(' + c + ',.35)'; ctx.fillRect(q.x, q.y, 2, 2); }
        else { ctx.fillStyle = 'rgba(' + c + ',' + (0.2 + 0.3 * Math.sin(t * 0.002 + q.a)) + ')'; ctx.fillRect(q.x, q.y, q.r * 0.7, q.r * 0.7); }
      });
      ctx.globalCompositeOperation = 'source-over';
    };
  }

  /* ---------- oynatıcı ---------- */
  function Oynatici(kap, senaryo, o) {
    o = o || {};
    var G = window.gsap;
    var sahneler = (senaryo.sahneler || []).filter(function (s) { return s && (s.tip === 'soru' ? s.soru && s.siklar : true); }).slice(0, 14);
    var kok = el('div', { class: 'an-sahne' }), cv = el('canvas', { style: 'position:absolute;inset:0;width:100%;height:100%' });
    var dunya = el('div', { class: 'an-dunya' });
    var svg = document.createElementNS(NS, 'svg'); svg.setAttribute('class', 'an-svg'); svg.setAttribute('viewBox', '0 0 1000 1000'); svg.setAttribute('preserveAspectRatio', 'none');
    var katman = el('div', { class: 'an-katman' }), seg = el('div', { class: 'an-segment' }), alt = el('div', { class: 'an-alt' }), flas = el('div', { class: 'an-flas' });
    sahneler.forEach(function () { seg.appendChild(el('i', {}, [el('b')])); });
    dunya.appendChild(svg); dunya.appendChild(katman);
    kok.appendChild(cv); kok.appendChild(dunya); kok.appendChild(alt); kok.appendChild(flas); kok.appendChild(seg); kap.appendChild(kok);
    var i = -1, tl = null, durdu = false, arkaCiz = null, bitti = false, ipucu = null, raf = 0, labs = [], vucut = null;
    function temizle() { if (tl) tl.kill(); tl = null; svg.innerHTML = ''; katman.innerHTML = ''; alt.innerHTML = ''; vucut = null; labs.forEach(function (l) { try { l.durdur(); } catch (e) {} }); labs = []; if (ipucu) { ipucu.remove(); ipucu = null; } G.set(dunya, { x: 0, y: 0, scale: 1 }); }
    function segment(k, f) { Array.prototype.forEach.call(seg.children, function (x, j) { x.firstChild.style.width = (j < k ? 100 : j === k ? f * 100 : 0) + '%'; }); }
    function konus(m) { if (o.konus && m) try { o.konus(m); } catch (e) {} }
    function sus() { if (o.sus) try { o.sus(); } catch (e) {} }
    function px(x) { return kl(sayi(x, 0.5)) * 100 + '%'; }
    function svgEl(ad, at) { var e = document.createElementNS(NS, ad); for (var k in at) e.setAttribute(k, at[k]); svg.appendChild(e); return e; }
    // kamera: dünya katmanını hedef noktaya (sahne oranı 0..1) zoom ile getirir
    function kameraHedef(h) {
      if (!h) return null;
      if (typeof h === 'object' && h.x != null) return { x: kl(sayi(h.x, 0.5)), y: kl(sayi(h.y, 0.5)) };
      if (vucut) { var p = vucut.querySelector('[data-org="' + h + '"]'); if (p) { var kr = kok.getBoundingClientRect(), r = p.getBoundingClientRect(), dr = dunya.getBoundingClientRect(), sc = dr.width / kr.width || 1; return { x: ((r.left + r.width / 2) - dr.left) / sc / kr.width, y: ((r.top + r.height / 2) - dr.top) / sc / kr.height }; } }
      return null;
    }
    function gecis(tur) {
      G.set(flas, { opacity: 0 });
      if (tur === 'dal') G.fromTo(dunya, { scale: 1.35, opacity: 0, filter: 'blur(12px)' }, { scale: 1, opacity: 1, filter: 'blur(0px)', duration: 0.55, ease: 'power3.out' });
      else if (tur === 'kaydir') G.fromTo(dunya, { xPercent: 30, opacity: 0, filter: 'blur(8px)' }, { xPercent: 0, opacity: 1, filter: 'blur(0px)', duration: 0.45, ease: 'power3.out' });
      else { G.fromTo(flas, { opacity: 0.9 }, { opacity: 0, duration: 0.5 }); G.fromTo(dunya, { opacity: 0 }, { opacity: 1, duration: 0.3 }); }
    }
    function altyazi(m, sure) {
      var kel = String(m || '').split(/\s+/).filter(Boolean); alt.innerHTML = ''; if (!kel.length) return;
      var spans = kel.map(function (k) { var s = document.createElement('span'); s.textContent = k + ' '; alt.appendChild(s); return s; });
      var pr = { n: 0 }, son = -1;
      tl.to(pr, { n: kel.length, duration: Math.max(1, sure - 0.4), ease: 'none', onUpdate: function () { var k = Math.floor(pr.n); if (k === son) return; son = k; spans.forEach(function (s, j) { s.className = j < k ? 'soy' : j === k ? 'simdi' : ''; }); } }, 0.15);
    }
    function sahneKur(s, yon) {
      temizle(); arkaCiz = arka(cv, s.arka || senaryo.arka || 'izgara');
      tl = G.timeline({ paused: true, onUpdate: function () { segment(i, tl.progress()); }, onComplete: function () { if (!durdu) sonraki(); } });
      if (s.tip === 'soru') { soruKur(s); return; }
      var sure = Math.max(sayi(s.sure, 4.5), Math.min(14, String(s.anlatim || '').length / 15 + 0.8));
      tl.to({}, { duration: sure });
      gecis(s.gecis || ['dal', 'kaydir', 'parla'][i % 3]);
      var kayit = {};
      (s.ogeler || []).slice(0, 18).forEach(function (g) {
        var t0 = Math.max(0, Math.min(sure - 0.3, sayi(g.t, 0))), r = renk(g.renk), b = Math.max(0.4, Math.min(3, sayi(g.boyut, 1))), e = null, acik = s.aciklamalar && g.id && s.aciklamalar[g.id];
        if (g.tip === 'vucut') {
          var odak = [].concat(g.odak || []).filter(function (k) { return ORGAN[k]; });
          var vk = el('div', { class: 'an-vucut', style: g.x != null ? 'left:' + px(g.x) + ';top:' + px(g.y) : '' }); vk.appendChild(vucutKur(odak, g.renk)); katman.appendChild(vk); vucut = vk;
          G.set(vk, { opacity: 0 }); tl.fromTo(vk, { opacity: 0, scale: 0.92 }, { opacity: 1, scale: 1, duration: 0.6, ease: 'power2.out' }, t0);
          if (g.etiket !== false) odak.forEach(function (k, j) { var p = vk.querySelector('[data-org="' + k + '"]'); tl.call(function () { if (!p) return; var kr = kok.getBoundingClientRect(), rr = p.getBoundingClientRect(), dr = dunya.getBoundingClientRect(), sc = dr.width / kr.width || 1; var et = el('div', { class: 'an-o an-etiket', style: 'color:' + renk(ORGAN[k].r) + ';left:' + (((rr.right - dr.left) / sc) + 16) / kr.width * 100 + '%;top:' + (((rr.top + rr.height / 2) - dr.top) / sc) / kr.height * 100 + '%;transform:translate(0,-50%)' }, ['◀ ' + ORGAN[k].ad]); katman.appendChild(et); G.fromTo(et, { opacity: 0, x: -10 }, { opacity: 1, x: 0, duration: 0.4 }); }, null, t0 + 0.5 + j * 0.3); });
          return;
        }
        if (g.tip === 'lab') {
          var lw = kl(sayi(g.g, 0.8)), lh = kl(sayi(g.y2, 0.5));
          var lk = el('div', { class: 'an-lab', style: 'left:' + px(g.x) + ';top:' + px(g.y) + ';width:' + lw * 100 + '%;height:' + lh * 100 + '%' }), lcv = el('canvas');
          lk.appendChild(lcv); katman.appendChild(lk); G.set(lk, { opacity: 0 });
          tl.fromTo(lk, { opacity: 0, scale: 0.4, filter: 'blur(10px)' }, { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 0.7, ease: 'back.out(1.4)', onStart: function () { if (U.hucreOynat && !lk.dataset.b) { lk.dataset.b = 1; var oy = U.hucreOynat(lcv, g.surec); if (oy) labs.push(oy); } } }, t0);
          if (g.etiket) { var le = el('div', { class: 'an-o an-etiket', style: 'left:' + px(g.x) + ';top:calc(' + px(sayi(g.y, 0.5) - lh / 2) + ' - 14px)' }, [g.etiket]); katman.appendChild(le); G.set(le, { opacity: 0 }); tl.to(le, { opacity: 1, duration: 0.4 }, t0 + 0.4); }
          return;
        }
        if (g.tip === 'yazi' || g.tip === 'etiket' || g.tip === 'ikon' || g.tip === 'sayac') {
          var cls = g.tip === 'yazi' ? 'an-yazi' : g.tip === 'etiket' ? 'an-etiket' : g.tip === 'ikon' ? 'an-ikon' : 'an-sayac';
          e = el('div', { class: 'an-o ' + cls + (acik ? ' an-tikla' : ''), style: 'left:' + px(g.x) + ';top:' + px(g.y) + ';--b:' + b + ((g.tip === 'etiket' || g.tip === 'yazi') && g.renk ? ';color:' + r : '') }, [g.tip === 'ikon' ? (g.emoji || '◆') : g.tip === 'sayac' ? String(g.bas || 0) + (g.birim ? ' ' + g.birim : '') : String(g.metin || '')]);
          katman.appendChild(e); G.set(e, { opacity: 0 });
          var giris = g.giris || (g.tip === 'ikon' ? 'buyu' : g.tip === 'yazi' ? 'patla' : 'belir');
          if (giris === 'buyu') tl.fromTo(e, { opacity: 0, scale: 0.2, rotation: -12 }, { opacity: 1, scale: 1, rotation: 0, duration: 0.6, ease: 'back.out(2.4)' }, t0);
          else if (giris === 'uc') tl.fromTo(e, { opacity: 0, x: -160 }, { opacity: 1, x: 0, duration: 0.6, ease: 'power3.out' }, t0);
          else if (giris === 'yaz' && g.tip === 'yazi') { var m = String(g.metin || ''); e.textContent = ''; var pr = { n: 0 }; tl.set(e, { opacity: 1 }, t0); tl.to(pr, { n: m.length, duration: Math.min(1.2, m.length * 0.03), ease: 'none', onUpdate: function () { e.textContent = m.slice(0, Math.round(pr.n)); } }, t0); }
          else if (giris === 'patla') tl.fromTo(e, { opacity: 0, scale: 1.6, filter: 'blur(10px)' }, { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 0.45, ease: 'power4.out' }, t0);
          else tl.fromTo(e, { opacity: 0, y: 18, filter: 'blur(6px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.5, ease: 'power2.out' }, t0);
          if (g.tip === 'sayac') { var c = { v: sayi(g.bas, 0) }; tl.to(c, { v: sayi(g.son, 100), duration: sayi(g.sure, 2), ease: 'power2.inOut', onUpdate: function () { e.textContent = Math.round(c.v) + (g.birim ? ' ' + g.birim : ''); } }, t0 + 0.3); }
          (g.hareket || []).slice(0, 4).forEach(function (h) { tl.to(e, { left: px(h.x), top: px(h.y), duration: sayi(h.sure, 1), ease: 'power2.inOut' }, Math.max(t0 + 0.5, sayi(h.t, t0 + 1))); });
          if (g.nabiz) tl.to(e, { scale: 1.14, duration: 0.32, yoyo: true, repeat: Math.ceil(sure / 0.64), ease: 'sine.inOut' }, t0 + 0.6);
        } else if (g.tip === 'sekil') {
          var x = kl(sayi(g.x, 0.5)) * 1000, y = kl(sayi(g.y, 0.5)) * 1000, gw = kl(sayi(g.g, 0.2)) * 1000, gh = kl(sayi(g.y2, g.g || 0.2)) * 1000, sk = g.sekil || 'daire';
          if (sk === 'daire' || sk === 'hucre') e = svgEl('ellipse', { cx: x, cy: y, rx: gw / 2, ry: gh / 2 });
          else if (sk === 'altigen') { var pts = []; for (var k = 0; k < 6; k++) { var a = Math.PI / 6 + k * Math.PI / 3; pts.push((x + Math.cos(a) * gw / 2).toFixed(0) + ',' + (y + Math.sin(a) * gh / 2).toFixed(0)); } e = svgEl('polygon', { points: pts.join(' ') }); }
          else if (sk === 'kanal') { e = svgEl('rect', { x: x - gw / 2, y: y - gh / 2, width: gw, height: gh, rx: 6 }); svgEl('line', { x1: x, y1: y - gh / 2, x2: x, y2: y + gh / 2, stroke: r, 'stroke-width': 2, 'stroke-dasharray': '6 5', opacity: 0.6 }); }
          else if (sk === 'zar') e = svgEl('rect', { x: x - gw / 2, y: y - 14, width: gw, height: 28, rx: 14 });
          else e = svgEl('rect', { x: x - gw / 2, y: y - gh / 2, width: gw, height: gh, rx: 18 });
          e.setAttribute('fill', r); e.setAttribute('fill-opacity', sk === 'hucre' ? 0.08 : 0.14); e.setAttribute('stroke', r); e.setAttribute('stroke-width', 3); e.style.filter = 'drop-shadow(0 0 8px ' + r + ')';
          G.set(e, { opacity: 0, transformOrigin: '50% 50%' }); tl.fromTo(e, { opacity: 0, scale: 0.5 }, { opacity: 1, scale: 1, duration: 0.55, ease: 'back.out(1.8)' }, t0);
          if (g.etiket) { var et = el('div', { class: 'an-o an-etiket', style: 'left:' + px(g.x) + ';top:calc(' + px(sayi(g.y, 0.5) + (sk === 'zar' ? 0.03 : sayi(g.y2, g.g || 0.2) / 2)) + ' + 16px)' }, [g.etiket]); katman.appendChild(et); G.set(et, { opacity: 0 }); tl.to(et, { opacity: 1, duration: 0.4 }, t0 + 0.3); }
          if (acik) { e.style.cursor = 'pointer'; e.addEventListener('click', function (ev) { ev.stopPropagation(); goster(acik, g.x, g.y); }); }
          e = null;
        } else if (g.tip === 'ok') {
          var x1 = kl(sayi(g.x1, 0.2)) * 1000, y1 = kl(sayi(g.y1, 0.5)) * 1000, x2 = kl(sayi(g.x2, 0.8)) * 1000, y2 = kl(sayi(g.y2, 0.5)) * 1000;
          var cz = svgEl('path', { d: 'M' + x1 + ' ' + y1 + ' L' + x2 + ' ' + y2, stroke: r, 'stroke-width': 5, fill: 'none', 'stroke-linecap': 'round' }), L = Math.hypot(x2 - x1, y2 - y1);
          cz.style.filter = 'drop-shadow(0 0 7px ' + r + ')'; cz.setAttribute('stroke-dasharray', L); cz.setAttribute('stroke-dashoffset', L);
          var an = Math.atan2(y2 - y1, x2 - x1), uc = svgEl('path', { d: 'M' + (x2 - 24 * Math.cos(an - 0.45)) + ' ' + (y2 - 24 * Math.sin(an - 0.45)) + ' L' + x2 + ' ' + y2 + ' L' + (x2 - 24 * Math.cos(an + 0.45)) + ' ' + (y2 - 24 * Math.sin(an + 0.45)), stroke: r, 'stroke-width': 5, fill: 'none', opacity: 0 });
          tl.to(cz, { attr: { 'stroke-dashoffset': 0 }, duration: 0.55, ease: 'power2.inOut' }, t0); tl.to(uc, { opacity: 1, duration: 0.2 }, t0 + 0.5);
          if (g.etiket) { var et2 = el('div', { class: 'an-o an-etiket', style: 'left:' + ((x1 + x2) / 20) + '%;top:calc(' + ((y1 + y2) / 20) + '% - 18px)' }, [g.etiket]); katman.appendChild(et2); G.set(et2, { opacity: 0 }); tl.to(et2, { opacity: 1, duration: 0.4 }, t0 + 0.45); }
        } else if (g.tip === 'akis') {
          var yol = (g.yol || []).filter(function (p) { return Array.isArray(p) && p.length === 2; }).slice(0, 8).map(function (p) { return [kl(sayi(p[0], 0.5)), kl(sayi(p[1], 0.5))]; });
          if (yol.length < 2) return;
          var adet = Math.max(1, Math.min(14, sayi(g.adet, 7))), dur = sayi(g.sure, 2);
          for (var q = 0; q < adet; q++) (function (q) {
            var p = el('div', { class: 'an-o an-etiket', style: 'color:' + r + ';font-size:calc(var(--b,1) * 18px);left:' + yol[0][0] * 100 + '%;top:' + yol[0][1] * 100 + '%' }, [g.etiket || '●']); katman.appendChild(p); G.set(p, { opacity: 0 });
            var pr2 = { f: 0 };
            tl.to(pr2, { f: 1, duration: dur, ease: 'none', repeat: Math.max(0, Math.floor((sure - t0) / dur) - 1), onStart: function () { p.style.opacity = 1; }, onUpdate: function () { var s2 = pr2.f * (yol.length - 1), k2 = Math.min(yol.length - 2, Math.floor(s2)), f2 = s2 - k2; p.style.left = (yol[k2][0] + (yol[k2 + 1][0] - yol[k2][0]) * f2) * 100 + '%'; p.style.top = (yol[k2][1] + (yol[k2 + 1][1] - yol[k2][1]) * f2) * 100 + '%'; } }, t0 + q * dur / adet);
          })(q);
        } else if (g.tip === 'grafik') {
          var gx = kl(sayi(g.x, 0.08)) * 1000, gy = kl(sayi(g.y, 0.3)) * 1000, gg = kl(sayi(g.g, 0.84)) * 1000, gh2 = kl(sayi(g.y2, 0.42)) * 1000, nk = (g.noktalar || []).filter(function (p) { return Array.isArray(p) && p.length === 2; });
          if (nk.length < 2) return;
          var ys = nk.map(function (p) { return +p[1]; }), mn = Math.min.apply(null, ys), mx = Math.max.apply(null, ys), rng = (mx - mn) || 1;
          var gid = 'anG' + Math.random().toString(36).slice(2, 7), df = document.createElementNS(NS, 'defs'); df.innerHTML = '<linearGradient id="' + gid + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + r + '" stop-opacity=".45"/><stop offset="1" stop-color="' + r + '" stop-opacity="0"/></linearGradient>'; svg.appendChild(df);
          for (var gl = 0; gl <= 4; gl++) svgEl('line', { x1: gx, x2: gx + gg, y1: gy + gh2 * gl / 4, y2: gy + gh2 * gl / 4, stroke: 'rgba(160,255,240,.12)' });
          var nokt = nk.map(function (p) { return [gx + kl(+p[0]) * gg, gy + gh2 - ((+p[1] - mn) / rng) * gh2]; });
          var d = nokt.map(function (p, k) { return (k ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1); }).join(' ');
          var alan = svgEl('path', { d: d + ' L' + nokt[nokt.length - 1][0] + ' ' + (gy + gh2) + ' L' + nokt[0][0] + ' ' + (gy + gh2) + ' Z', fill: 'url(#' + gid + ')', opacity: 0 });
          var pth = svgEl('path', { d: d, stroke: r, 'stroke-width': 6, fill: 'none', 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }); pth.style.filter = 'drop-shadow(0 0 10px ' + r + ')';
          var L2 = pth.getTotalLength ? pth.getTotalLength() : 2000; pth.setAttribute('stroke-dasharray', L2); pth.setAttribute('stroke-dashoffset', L2);
          var nok = el('div', { class: 'an-o', style: 'width:20px;height:20px;border-radius:50%;background:#fff;opacity:0;box-shadow:0 0 16px ' + r + ',0 0 4px #fff;pointer-events:none' }); katman.appendChild(nok);
          var gs = sayi(g.sure, 2.4), prg = { f: 0 };
          tl.to(prg, { f: 1, duration: gs, ease: 'none', onStart: function () { nok.style.opacity = 1; }, onUpdate: function () { pth.setAttribute('stroke-dashoffset', L2 * (1 - prg.f)); if (pth.getPointAtLength) { var pp = pth.getPointAtLength(L2 * prg.f); nok.style.left = pp.x / 10 + '%'; nok.style.top = pp.y / 10 + '%'; } } }, t0);
          tl.to(alan, { opacity: 1, duration: 0.8 }, t0 + gs * 0.6);
          (g.isaretler || []).slice(0, 4).forEach(function (m) { var mxp = gx + kl(+m.x) * gg, me = el('div', { class: 'an-o an-etiket', style: 'left:' + mxp / 10 + '%;top:calc(' + gy / 10 + '% - 14px);color:' + renk(m.renk || 'sari') }, [m.metin || '']); katman.appendChild(me); G.set(me, { opacity: 0 }); tl.to(me, { opacity: 1, duration: 0.3 }, t0 + gs * kl(+m.x)); });
          if (g.etiket) { var et3 = el('div', { class: 'an-o an-etiket', style: 'left:' + (gx / 10) + '%;top:calc(' + ((gy + gh2) / 10) + '% + 18px);transform:none' }, [g.etiket]); katman.appendChild(et3); }
        } else if (g.tip === 'vurgu' || g.tip === 'cizik') {
          var hd = kayit[g.hedef]; if (!hd) return;
          if (g.tip === 'vurgu') { var hl = el('div', { class: 'an-o', style: 'left:' + hd.style.left + ';top:' + hd.style.top + ';width:140px;height:140px;border-radius:50%;box-shadow:0 0 0 4px ' + r + ',0 0 34px ' + r + ';pointer-events:none' }); katman.appendChild(hl); G.set(hl, { opacity: 0, scale: 1.8 }); tl.to(hl, { opacity: 1, scale: 1, duration: 0.45, ease: 'back.out(2)' }, t0); tl.to(hl, { scale: 1.15, duration: 0.35, yoyo: true, repeat: 3 }, t0 + 0.45); }
          else tl.to(hd, { textDecoration: 'line-through', color: '#ff7a7a', opacity: 0.6, duration: 0.3 }, t0);
        }
        if (e) { if (g.id) kayit[g.id] = e; if (acik) e.addEventListener('click', function (ev) { ev.stopPropagation(); goster(acik, g.x, g.y); }); }
      });
      // kamera hareketleri (vücut kurulduktan sonra hesaplanır)
      [].concat(s.kamera || []).slice(0, 4).forEach(function (k) {
        var t0 = Math.max(0, Math.min(sure - 0.4, sayi(k.t, 0.6))), z = Math.max(1, Math.min(5, sayi(k.zoom, 2.4)));
        tl.call(function () {
          var p = kameraHedef(k.hedef); if (!p) return; var kr = kok.getBoundingClientRect();
          G.to(dunya, { x: kr.width / 2 - p.x * kr.width * z, y: kr.height * 0.45 - p.y * kr.height * z, scale: z, duration: sayi(k.sure, 1.3), ease: 'power3.inOut' });
          if (vucut) Array.prototype.forEach.call(vucut.querySelectorAll('.org'), function (o2) { if (o2.getAttribute('data-org') === k.hedef) o2.classList.add('on'); });
        }, null, t0);
      });
      if (s.kameraSifirla) tl.call(function () { G.to(dunya, { x: 0, y: 0, scale: 1, duration: 1, ease: 'power3.inOut' }); }, null, sayi(s.kameraSifirla, sure - 1));
      altyazi(s.anlatim, sure);
      tl.call(function () { konus(s.anlatim); }, null, 0.05);
      if (!durdu) tl.play();
    }
    function goster(m, x, y) {
      durdur(true); if (ipucu) ipucu.remove();
      ipucu = el('div', { class: 'an-ipucu', style: 'left:' + px(x) + ';top:' + px(y), text: m }); kok.appendChild(ipucu);
      G.fromTo(ipucu, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.3 });
    }
    function soruKur(s) {
      gecis('parla');
      var kutu = el('div', { class: 'an-soru' }, [el('h4', { text: s.soru })]), cevaplandi = false;
      konus(s.soru);
      s.siklar.slice(0, 5).forEach(function (sk, k) {
        var b = el('button', { type: 'button', text: 'ABCDE'[k] + ') ' + sk });
        b.addEventListener('click', function (ev) { ev.stopPropagation(); if (cevaplandi) return; cevaplandi = true; var ok = k === (+s.dogru || 0);
          b.classList.add(ok ? 'dogru' : 'yanlis'); if (!ok) kutu.querySelectorAll('button')[+s.dogru || 0].classList.add('dogru');
          kutu.appendChild(el('p', { text: (ok ? '✓ ' : '✗ ') + (s.aciklama || '') })); if (o.cevap) o.cevap(ok, s);
          G.fromTo(b, { scale: 1.06 }, { scale: 1, duration: 0.4, ease: 'back.out(3)' });
          konus((ok ? 'Doğru. ' : 'Hayır. ') + (s.aciklama || '')); setTimeout(function () { if (!durdu) sonraki(); }, 4200); });
        kutu.appendChild(b);
      });
      katman.appendChild(kutu); segment(i, 0.5);
      G.from(kutu.children, { opacity: 0, y: 20, stagger: 0.08, duration: 0.35 });
    }
    function git(k) { if (k < 0) k = 0; if (k >= sahneler.length) { bitti = true; segment(sahneler.length, 0); if (o.bitti) o.bitti(); return; } i = k; sus(); sahneKur(sahneler[i]); }
    function sonraki() { git(i + 1); }
    function durdur(v) { durdu = v; if (tl) { if (v) tl.pause(); else tl.play(); } if (v) sus(); var dd = kok.querySelector('.an-durdu'); if (v && !dd) kok.appendChild(el('div', { class: 'an-durdu', text: '❚❚' })); if (!v && dd) dd.remove(); if (!v && ipucu) { ipucu.remove(); ipucu = null; } }
    kok.addEventListener('click', function (e) {
      if (e.target.closest('button, .an-tikla')) return;
      var r = kok.getBoundingClientRect(), fx = (e.clientX - r.left) / r.width;
      if (fx < 0.22) { durdu = false; git(i - 1); } else if (fx > 0.78) { durdu = false; git(i + 1); } else durdur(!durdu);
    });
    function kare(t) { raf = requestAnimationFrame(kare); if (!kok.isConnected) return cancelAnimationFrame(raf); if (arkaCiz) arkaCiz(t); }
    raf = requestAnimationFrame(kare);
    this.basla = function () { durdu = false; bitti = false; git(0); };
    this.durdur = function () { durdur(true); };
    this.yoket = function () { temizle(); cancelAnimationFrame(raf); sus(); kok.remove(); };
    this.bittiMi = function () { return bitti; };
  }
  U.Animasyon = { Oynatici: Oynatici, hazir: function () { return !!window.gsap; }, organlar: function () { return Object.keys(ORGAN); } };

  /* ---------- yapay zekâya verilecek senaryo kuralları ---------- */
  U.Animasyon.senaryoKurali = function () {
    var lab = U.hucreSurecleri ? U.hucreSurecleri().map(function (x) { return x.id; }).join(', ') : '';
    return [
      'BU BİR REELS: hızlı, görsel, merak uyandıran. Ekran dikey; koordinatlar 0..1 (x sağa, y aşağı). Alt %20\'ye öğe koyma (altyazı orada). Öğeleri üst üste bindirme.',
      'ANLATICI: Patrick Jane (The Mentalist) gibi konuşur — sakin, kendinden emin, muzip; izleyicinin aklından geçeni okur: "Herkes … sanır. Değil." "Şimdi bak…" "İşin hilesi şu:". Her sahnede 1-2 kısa cümle (en fazla 22 kelime).',
      '"sahneler": 8-12 sahne, her biri 3.5-6 sn. İLK sahne kanca (şaşırtıcı soru/iddia, büyük yazı + ikon). Mümkün olan her sahnede VÜCUT ya da LAB kullan: hareket ve yakınlaşma ezberden iyidir.',
      'Sahne: {"anlatim":"…","sure":3.5-6,"arka":"vucut|hucre|kan|beyin|kalp|uzay|koridor","gecis":"dal|kaydir|parla","ogeler":[…],"kamera":[{"hedef":"organ adı ya da {x,y}","zoom":1.5-4,"t":saniye,"sure":1.2}],"kameraSifirla":saniye,"aciklamalar":{"ogeId":"dokununca çıkan 1 cümle"}}',
      'Öğeler (her birinde "id" ve "t" = başlama saniyesi):',
      ' {"tip":"vucut","odak":["kalp"],"renk":"kirmizi"} — holografik insan vücudu; odak organ nabız gibi parlar ve etiketlenir. Organ adları: ' + Object.keys(ORGAN).join(', ') + '. Kamera ile o organa zoom yap.',
      ' {"tip":"lab","surec":"…","x":0.5,"y":0.42,"g":0.86,"y2":0.5,"etiket":"kısa"} — hücre düzeyi canlı simülasyon. Süreçler: ' + lab + '. (ör. kalbe zoom → sonraki sahnede "kalp-ap" ya da "kas-kasilmasi" lab).',
      ' {"tip":"yazi","metin":"en fazla 6 kelime, büyük","x":0.5,"y":0.14,"giris":"patla|yaz|uc|belir"} · {"tip":"ikon","emoji":"tek emoji","x":..,"y":..,"boyut":1-2.8,"nabiz":true,"hareket":[{"x":..,"y":..,"t":..,"sure":1}]}',
      ' {"tip":"grafik","noktalar":[[0,-70],[0.25,30],[0.5,-80],[1,-70]],"x":0.08,"y":0.28,"g":0.84,"y2":0.42,"renk":"sari","etiket":"eksen/anlam","sure":2.5,"isaretler":[{"x":0.25,"metin":"tepe +30 mV"}]} — BÜYÜK, ekranı doldurur.',
      ' {"tip":"sayac","x":..,"y":..,"bas":-70,"son":30,"birim":"mV","sure":2} · {"tip":"akis","yol":[[x,y],…],"etiket":"Na⁺","adet":5-10,"renk":"yesil","sure":1.8} · {"tip":"ok","x1":..,"y1":..,"x2":..,"y2":..,"etiket":".."}',
      ' {"tip":"sekil","sekil":"hucre|daire|kutu|altigen|kanal|zar","x":..,"y":..,"g":..,"y2":..,"renk":"..","etiket":".."} · {"tip":"etiket","metin":"..","x":..,"y":..} · {"tip":"vurgu","hedef":"id"} · {"tip":"cizik","hedef":"yanlış yazının id\'si"}',
      'Renkler: teal, sari, mor, kirmizi, yesil, mavi, turuncu, beyaz. Ortaya (5.-6. sahne) ve sona birer SORU sahnesi: {"tip":"soru","soru":"…","siklar":["…","…","…","…"],"dogru":0,"aciklama":"Jane tarzı kısa açıklama"}'
    ].join('\n');
  };
  U.Animasyon.SENARYO_KURALI = '';
  try { Object.defineProperty(U.Animasyon, 'SENARYO_KURALI', { get: function () { return U.Animasyon.senaryoKurali(); } }); } catch (e) {}
})();
