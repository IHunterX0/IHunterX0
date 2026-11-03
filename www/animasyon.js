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
    '.an-alt{position:absolute;left:4%;right:4%;bottom:6%;z-index:6;text-align:center;font:900 clamp(24px,5.2vw,44px)/1.18 var(--f-baslik,system-ui);letter-spacing:-.01em;pointer-events:none;text-transform:none}',
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
    '.an-cubuk{position:absolute;left:0;right:0;bottom:0;height:14px;z-index:9;cursor:pointer;display:flex;align-items:flex-end}',
    '.an-cubuk::before{content:"";position:absolute;left:0;right:0;bottom:0;height:3px;background:rgba(255,255,255,.18)}',
    '.an-cubuk b{position:relative;display:block;height:3px;width:0;background:linear-gradient(90deg,#46c8ff,#5ef0dc,#fff);box-shadow:0 0 10px #5ef0dc;transition:width .12s linear}',
    '.an-cubuk b::after{content:"";position:absolute;right:-5px;top:-4px;width:11px;height:11px;border-radius:50%;background:#fff;box-shadow:0 0 10px #5ef0dc}',
    '.an-sure{position:absolute;right:12px;bottom:12px;z-index:9;font:600 11px var(--f-kod,monospace);color:rgba(230,255,250,.7);pointer-events:none}',
    '.an-nisan{position:absolute;left:50%;top:42%;width:min(34vw,220px);aspect-ratio:1;transform:translate(-50%,-50%);z-index:5;pointer-events:none;opacity:0;border-radius:50%;border:1.5px dashed rgba(140,255,240,.7);box-shadow:0 0 30px rgba(94,240,220,.35),inset 0 0 30px rgba(94,240,220,.2)}',
    '.an-nisan::before,.an-nisan::after{content:"";position:absolute;inset:-14px;border-radius:50%;border:2px solid transparent;border-top-color:#8ffff0;border-bottom-color:#8ffff0;animation:anDon 3s linear infinite}',
    '.an-nisan::after{inset:10px;border-top-color:transparent;border-bottom-color:transparent;border-left-color:#ffd38a;border-right-color:#ffd38a;animation-duration:2.2s;animation-direction:reverse}',
    '@keyframes anDon{to{transform:rotate(360deg)}}',
    '.an-not{position:absolute;right:5%;top:58%;max-width:min(300px,52%);z-index:6;padding:10px 14px;border-radius:14px;background:linear-gradient(135deg,rgba(6,40,46,.82),rgba(3,14,18,.7));box-shadow:0 0 0 1px rgba(110,255,235,.45),0 0 26px rgba(94,240,220,.25);color:#e9fffb;font:600 clamp(14px,2.2vw,18px)/1.4 var(--f-baslik,system-ui);pointer-events:none;opacity:0}',
    '.an-not:empty{display:none}',
    '.an-tarama{position:absolute;left:-5%;right:-5%;height:12%;top:0;background:linear-gradient(180deg,transparent,rgba(94,240,220,.18),transparent);animation:anTara 4s linear infinite;pointer-events:none}',
    '@keyframes anTara{from{top:-12%}to{top:100%}}',
    '.an-vucut .org{cursor:pointer}',
    '.an-gorsel{position:absolute;transform:translate(-50%,-50%);border-radius:20px;overflow:hidden;background:#02090c;box-shadow:0 0 0 1px rgba(110,255,235,.45),0 0 40px rgba(94,240,220,.25)}',
    '.an-gorsel img{width:100%;height:100%;object-fit:contain;display:block;background:#f4f8f8}',
    '.an-gorsel::after{content:"";position:absolute;inset:0;pointer-events:none;background:repeating-linear-gradient(0deg,rgba(94,240,220,.06) 0 1px,transparent 1px 4px),radial-gradient(ellipse at center,transparent 60%,rgba(2,12,16,.55))}',
    '.an-gorsel small{position:absolute;left:8px;bottom:6px;z-index:2;font:500 9.5px var(--f-kod,monospace);color:#fff;background:rgba(0,0,0,.55);padding:2px 6px;border-radius:6px;max-width:94%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
    '.an-zincir{position:absolute;left:50%;transform:translateX(-50%);width:min(82%,520px);display:flex;flex-direction:column;align-items:center;gap:4px;z-index:3}',
    '.an-zadim{width:100%;text-align:center;padding:11px 14px;border-radius:16px;background:linear-gradient(135deg,rgba(94,240,220,.12),rgba(0,0,0,.25));box-shadow:0 0 0 1px var(--r);color:#f2fffd;font:700 clamp(15px,2.6vw,21px)/1.3 var(--f-baslik,system-ui);text-shadow:0 0 10px rgba(0,0,0,.6)}',
    '.an-zok{font-size:22px;line-height:1;text-shadow:0 0 10px currentColor}',
    '.an-kars{position:absolute;left:4%;right:4%;display:grid;grid-template-columns:1fr auto 1fr;gap:10px;align-items:start;z-index:3}',
    '.an-kkol{padding:12px;border-radius:18px;box-shadow:0 0 0 1px var(--r),0 0 24px rgba(0,0,0,.3);background:linear-gradient(180deg,rgba(255,255,255,.05),transparent)}',
    '.an-kkol h5{margin:0 0 8px;font:800 clamp(16px,2.8vw,22px) var(--f-baslik,system-ui);color:var(--r);text-shadow:0 0 14px var(--r)}',
    '.an-kmadde{padding:6px 0;border-top:1px solid rgba(255,255,255,.08);color:#effffc;font-size:clamp(13.5px,2.2vw,17px);line-height:1.35}',
    '.an-vs{align-self:center;font:900 22px var(--f-baslik,system-ui);color:#ff7a7a;text-shadow:0 0 16px #ff7a7a}',
    '.an-eksen{position:absolute;transform:translate(calc(-100% - 8px),-50%);font:600 clamp(10px,1.6vw,13px) var(--f-kod,monospace);color:rgba(200,255,245,.75);white-space:nowrap;pointer-events:none}',
    '.an-eksen.y{transform:none;color:#9ff}.an-eksen.x{transform:translateX(-100%)}',
    '.an-okuma{font:700 clamp(13px,2vw,17px) var(--f-kod,monospace);text-shadow:0 0 10px currentColor,0 2px 0 #000;white-space:nowrap;pointer-events:none}',
    '.an-isaret{font:700 clamp(11px,1.8vw,14px) var(--f-kod,monospace);color:#111;background:var(--r);padding:3px 8px;border-radius:999px;box-shadow:0 0 14px var(--r);white-space:nowrap;pointer-events:none}',
    '.an-geri{height:4px;border-radius:2px;background:rgba(255,255,255,.12);overflow:hidden;margin:-2px 0 6px}.an-geri i{display:block;height:100%;width:100%;background:#ffd38a;box-shadow:0 0 8px #ffd38a}',
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

  /* ---------- organların görevi (dokununca) ---------- */
  var GOREV = {
    beyin: 'Her şeyin kontrol merkezi: duyu, hareket, bilinç, hafıza.', goz: 'Işığı retinada sinyale çevirir.', tiroid: 'T3/T4 ile metabolizma hızını ayarlar.',
    akciger_sag: 'Alveollerde O₂ alınır, CO₂ verilir (3 lob).', akciger_sol: 'Gaz değişimi; kalbe yer açmak için 2 lob.', kalp: 'Dört odacıklı pompa: dakikada ~5 L kan.',
    aort: 'Sol ventrikülden çıkan en büyük arter.', karaciger: 'Metabolizma, detoks, safra, plazma proteinleri.', mide: 'HCl + pepsin ile protein sindirimi başlar.',
    dalak: 'Yaşlı eritrositleri temizler, bağışıklık süzgeci.', pankreas: 'Ekzokrin enzimler + endokrin insülin/glukagon.', bobrek_sag: 'Kanı süzer: günde ~180 L filtrat, ~1.5 L idrar.',
    bobrek_sol: 'Süzme, geri emilim, sekresyon; RAAS ve EPO.', bagirsak: 'Emilim yüzeyi: villuslar ve mikrovilluslar.', mesane: 'İdrar deposu; detrusor kası boşaltır.',
    omurilik: 'Beyin ile vücut arasındaki iletim yolu + refleks merkezi.', kafatasi: 'Beyni koruyan kemik kutu.', humerus: 'Üst kolun tek kemiği; n. radialis oluğu.',
    radius_ulna: 'Ön kol kemikleri; pronasyon-supinasyon.', femur: 'Vücudun en uzun kemiği.', tibia: 'Bacağın yük taşıyan kemiği.',
    biceps: 'Dirsek fleksiyonu ve supinasyon (n. musculocutaneus).', kuadriseps: 'Diz ekstansiyonu (n. femoralis).', kalp_damar: 'Arterler kanı dokulara taşır.'
  };

  /* ---------- açık lisanslı gerçek görsel (Wikimedia Commons) ---------- */
  var gorselBellek = {};
  function commonsBul(sorgu) {
    sorgu = String(sorgu || '').trim(); if (!sorgu) return Promise.resolve(null);
    if (gorselBellek[sorgu]) return gorselBellek[sorgu];
    var anahtar = 'cg|' + sorgu.toLowerCase().slice(0, 80);
    var D = U.Depo;
    return gorselBellek[sorgu] = (D ? D.oku(anahtar) : Promise.resolve({})).then(function (v) {
      if (v && v.g !== undefined) return v.g;
      var url = 'https://commons.wikimedia.org/w/api.php?action=query&format=json&origin=*&generator=search&gsrnamespace=6&gsrlimit=8&gsrsearch=' + encodeURIComponent(sorgu + ' filetype:bitmap|drawing') +
        '&prop=imageinfo&iiprop=url|extmetadata|mime&iiurlwidth=900&iiextmetadatafilter=LicenseShortName|Artist';
      return fetch(url, { headers: { 'Api-User-Agent': 'CarvisCalisma/1.0 (kisisel ders uygulamasi)' } }).then(function (r) { if (!r.ok) throw new Error('commons ' + r.status); return r.json(); }).then(function (j) {
        var l = Object.keys((j.query && j.query.pages) || {}).map(function (k) { return j.query.pages[k]; }).sort(function (a, b) { return (a.index || 0) - (b.index || 0); });
        var g = null;
        l.some(function (p) {
          var ii = (p.imageinfo || [])[0]; if (!ii || !ii.thumburl) return false;
          var m = ii.extmetadata || {}, lis = String((m.LicenseShortName && m.LicenseShortName.value) || '').trim();
          if (U.lisansGecerli && !U.lisansGecerli(lis)) return false;
          if (!/image\/(jpeg|png|svg\+xml|webp)/.test(ii.mime || '')) return false;
          var yazar = String((m.Artist && m.Artist.value) || '').replace(/<[^>]+>/g, '').trim().slice(0, 60);
          g = { url: ii.thumburl, lisans: lis, yazar: yazar, sayfa: ii.descriptionurl || '' }; return true;
        });
        if (D && U.depoGuncelle) U.depoGuncelle(anahtar, function (d) { d.g = g; }, 100);
        return g;
      });
    }).catch(function () { delete gorselBellek[sorgu]; return null; });
  }

  /* ---------- senaryo onarımı: taşma, çakışma, eksik alanlar ---------- */
  function duzelt(j) {
    (j.sahneler || []).forEach(function (s) {
      if (!s || s.tip === 'soru') return;
      s.anlatim = String(s.anlatim || '').split(/\s+/).slice(0, 34).join(' ');
      var yazilar = [];
      (s.ogeler || []).forEach(function (g) {
        if (!g) return;
        if (/^(yazi|ikon|etiket|sayac)$/.test(g.tip)) { g.y = Math.max(0.06, Math.min(0.76, sayi(g.y, 0.4))); g.x = Math.max(0.1, Math.min(0.9, sayi(g.x, 0.5))); }
        if (g.tip === 'grafik') { g.y = Math.max(0.12, Math.min(0.5, sayi(g.y, 0.26))); g.y2 = Math.min(sayi(g.y2, 0.42), 0.78 - g.y); }
        if (g.tip === 'lab' || g.tip === 'gorsel') { var hh = sayi(g.y2, 0.5); g.y = Math.max(0.08 + hh / 2, Math.min(0.78 - hh / 2, sayi(g.y, 0.42))); }
        if (g.tip === 'yazi') yazilar.push(g);
      });
      yazilar.sort(function (a, b) { return sayi(a.t, 0) - sayi(b.t, 0); });
      for (var a = 0; a < yazilar.length; a++) for (var b = 0; b < a; b++) {
        if (Math.abs(yazilar[a].y - yazilar[b].y) < 0.1 && Math.abs(yazilar[a].x - yazilar[b].x) < 0.4) yazilar[a].y = Math.min(0.76, yazilar[b].y + 0.12);
      }
    });
    return j;
  }
  function onYukle(j) { (j.sahneler || []).forEach(function (s) { (s.ogeler || []).forEach(function (g) { if (g && g.tip === 'gorsel' && g.ara) commonsBul(g.ara).then(function (r) { if (r) { var im = new Image(); im.src = r.url; } }); }); }); }

  /* ---------- oynatıcı: tek parça akan video ---------- */
  function sahneSuresi(s) { return s.tip === 'soru' ? 11 : Math.max(sayi(s.sure, 4.5), Math.min(14, String(s.anlatim || '').length / 14 + 0.8)); }
  function Oynatici(kap, senaryo, o) {
    o = o || {};
    var G = window.gsap;
    duzelt(senaryo);
    var sahneler = (senaryo.sahneler || []).filter(function (s) { return s && (s.tip === 'soru' ? s.soru && s.siklar : true); }).slice(0, 16);
    var sureler = sahneler.map(sahneSuresi), toplam = sureler.reduce(function (a, b) { return a + b; }, 0) || 1;
    var kok = el('div', { class: 'an-sahne' }), cv = el('canvas', { style: 'position:absolute;inset:0;width:100%;height:100%' });
    var sahne = el('div', { class: 'an-katman' }), alt = el('div', { class: 'an-alt' }), flas = el('div', { class: 'an-flas' });
    var cubuk = el('div', { class: 'an-cubuk', role: 'slider', 'aria-label': 'Video ilerlemesi' }, [el('b')]), sureYazi = el('div', { class: 'an-sure' });
    var nisan = el('div', { class: 'an-nisan' }), notK = el('div', { class: 'an-not' });
    kok.appendChild(cv); kok.appendChild(sahne); kok.appendChild(nisan); kok.appendChild(notK); kok.appendChild(alt); kok.appendChild(flas); kok.appendChild(cubuk); kok.appendChild(sureYazi); kap.appendChild(kok);
    var i = -1, tl = null, durdu = false, arkaCiz = null, arkaTur = '', bitti = false, raf = 0, D = null, sesSoz = null, kusak = 0, soruZaman = null;
    function yeniDunya() {
      var d = el('div', { class: 'an-dunya' }), svg = document.createElementNS(NS, 'svg'); svg.setAttribute('class', 'an-svg'); svg.setAttribute('viewBox', '0 0 1000 1000'); svg.setAttribute('preserveAspectRatio', 'none');
      var k = el('div', { class: 'an-katman' }); d.appendChild(svg); d.appendChild(k); sahne.appendChild(d);
      return { d: d, svg: svg, k: k, labs: [], vucut: null, kayit: {} };
    }
    function eskiyiSondur(E, tur) {
      if (!E) return;
      E.d.style.pointerEvents = 'none';
      var hedef = tur === 'dal' ? { opacity: 0, scale: (G.getProperty(E.d, 'scale') || 1) * 1.6, filter: 'blur(10px)' } : tur === 'kaydir' ? { opacity: 0, xPercent: -25, filter: 'blur(8px)' } : { opacity: 0 };
      G.to(E.d, Object.assign(hedef, { duration: 0.6, ease: 'power2.in', onComplete: function () { E.labs.forEach(function (l) { try { l.durdur(); } catch (e) {} }); E.d.remove(); } }));
    }
    function ilerleme(f) {
      var once = 0; for (var k = 0; k < i; k++) once += sureler[k];
      var gec = once + (i >= 0 ? sureler[i] * kl(f) : 0);
      cubuk.firstChild.style.width = (gec / toplam * 100).toFixed(2) + '%';
      var kalan = Math.max(0, Math.round(toplam - gec)); sureYazi.textContent = Math.floor(kalan / 60) + ':' + ('0' + kalan % 60).slice(-2);
    }
    function konus(m) { if (!o.konus || !m) { sesSoz = null; return; } try { var p = o.konus(m); sesSoz = p && p.then ? p : null; } catch (e) { sesSoz = null; } }
    function sus() { sesSoz = null; if (o.sus) try { o.sus(); } catch (e) {} }
    function px(x) { return kl(sayi(x, 0.5)) * 100 + '%'; }
    function svgEl(ad, at) { var e = document.createElementNS(NS, ad); for (var k in at) e.setAttribute(k, at[k]); if (/^(path|line|rect|ellipse|polygon)$/.test(ad)) e.setAttribute('vector-effect', 'non-scaling-stroke'); D.svg.appendChild(e); return e; }
    function ipucu(m, x, y) {
      var p = el('div', { class: 'an-ipucu', style: 'left:' + px(x) + ';top:' + px(y), text: m }); kok.appendChild(p);
      G.fromTo(p, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.3 }); setTimeout(function () { G.to(p, { opacity: 0, duration: 0.4, onComplete: function () { p.remove(); } }); }, 4200);
    }
    function kokOran(r) { var kr = kok.getBoundingClientRect(); return { x: (r.left + r.width / 2 - kr.left) / kr.width, y: (r.top + r.height / 2 - kr.top) / kr.height }; }
    function kameraHedef(h) {
      if (!h) return null;
      if (typeof h === 'object' && h.x != null) return { x: kl(sayi(h.x, 0.5)), y: kl(sayi(h.y, 0.5)) };
      if (D.vucut) { var p = D.vucut.querySelector('[data-org="' + h + '"]'); if (p) { var kr = kok.getBoundingClientRect(), r = p.getBoundingClientRect(), dr = D.d.getBoundingClientRect(), sc = dr.width / kr.width || 1; return { x: ((r.left + r.width / 2) - dr.left) / sc / kr.width, y: ((r.top + r.height / 2) - dr.top) / sc / kr.height }; } }
      return null;
    }
    function altyazi(m, sure) {
      var kel = String(m || '').split(/\s+/).filter(Boolean); alt.innerHTML = ''; if (!kel.length) return;
      // 3-5 kelimelik öbekler hâlinde (TikTok gibi): ekranda hep tek satır, konuşulan kelime sarı
      var obek = [], k = 0; while (k < kel.length) { var n = kel.length - k <= 5 ? kel.length - k : 4; obek.push(kel.slice(k, k + n)); k += n; }
      var pr = { n: 0 }, son = -1, sonObek = -1, spans = [];
      tl.to(pr, { n: kel.length, duration: Math.max(1, sure - 0.5), ease: 'none', onUpdate: function () {
        var w = Math.floor(pr.n); if (w === son) return; son = w;
        var say = 0, oi = 0; for (oi = 0; oi < obek.length; oi++) { if (w < say + obek[oi].length) break; say += obek[oi].length; } if (oi >= obek.length) oi = obek.length - 1, say -= obek[oi].length;
        if (oi !== sonObek) { sonObek = oi; alt.innerHTML = ''; spans = obek[oi].map(function (x) { var s = document.createElement('span'); s.textContent = x + ' '; alt.appendChild(s); return s; }); G.fromTo(alt, { scale: 0.9, opacity: 0.4 }, { scale: 1, opacity: 1, duration: 0.18, ease: 'back.out(3)' }); }
        spans.forEach(function (s, j) { s.className = say + j < w ? 'soy' : say + j === w ? 'simdi' : ''; });
      } }, 0.1);
    }
    function sahneKur(s, el2) {
      kusak++; var benim = kusak;
      var gecisTur = s.gecis || ['dal', 'kaydir', 'parla'][i % 3];
      var eski = D; D = yeniDunya();
      var tur = s.arka || senaryo.arka || 'izgara'; if (tur !== arkaTur) { arkaTur = tur; arkaCiz = arka(cv, tur); }
      if (tl) tl.kill(); tl = G.timeline({ paused: true, onUpdate: function () { ilerleme(tl.progress()); }, onComplete: function () { sahneBitti(benim); } });
      G.to(nisan, { opacity: 0, duration: 0.3 }); G.to(notK, { opacity: 0, duration: 0.3 });
      if (soruZaman) { soruZaman.kill(); soruZaman = null; }
      // vücut sahneden sahneye taşınır: kamera kaldığı yerden devam eder → kesintisiz
      var vucutVar = (s.ogeler || []).some(function (g) { return g && g.tip === 'vucut'; });
      var tasindi = false;
      if (vucutVar && eski && eski.vucut) {
        G.set(D.d, { x: G.getProperty(eski.d, 'x'), y: G.getProperty(eski.d, 'y'), scale: G.getProperty(eski.d, 'scale') });
        D.k.appendChild(eski.vucut); D.vucut = eski.vucut; eski.vucut = null; tasindi = true;
        Array.prototype.forEach.call(D.vucut.querySelectorAll('.org.on'), function (p) { p.classList.remove('on'); });
        eski.d.style.transition = 'none'; G.to(eski.d, { opacity: 0, duration: 0.45, onComplete: function () { eski.labs.forEach(function (l) { try { l.durdur(); } catch (e) {} }); eski.d.remove(); } });
      } else {
        eskiyiSondur(eski, gecisTur);
        if (gecisTur === 'dal') G.fromTo(D.d, { scale: 0.7, opacity: 0, filter: 'blur(10px)' }, { scale: 1, opacity: 1, filter: 'blur(0px)', duration: 0.65, ease: 'power3.out' });
        else if (gecisTur === 'kaydir') G.fromTo(D.d, { xPercent: 28, opacity: 0, filter: 'blur(8px)' }, { xPercent: 0, opacity: 1, filter: 'blur(0px)', duration: 0.55, ease: 'power3.out' });
        else { G.fromTo(flas, { opacity: 0.85 }, { opacity: 0, duration: 0.55 }); G.fromTo(D.d, { opacity: 0 }, { opacity: 1, duration: 0.35 }); }
      }
      if (s.tip === 'soru') { tl.to({}, { duration: 0.01 }); alt.innerHTML = ''; soruKur(s, benim); return; }
      var sure = sureler[i];
      tl.to({}, { duration: sure });
      (s.ogeler || []).slice(0, 18).forEach(function (g) { try { ogeKur(g, s, sure, tasindi); } catch (e) { console.warn('öğe', g && g.tip, e); } });
      [].concat(s.kamera || []).slice(0, 4).forEach(function (k) {
        var t0 = Math.max(0, Math.min(sure - 0.4, sayi(k.t, 0.6))), z = Math.max(1, Math.min(5, sayi(k.zoom, 2.4))), ks = sayi(k.sure, 1.3);
        tl.call(function () {
          var p = kameraHedef(k.hedef); if (!p) return; var kr = kok.getBoundingClientRect();
          G.to(D.d, { x: kr.width / 2 - p.x * kr.width * z, y: kr.height * 0.42 - p.y * kr.height * z, scale: z, duration: ks, ease: 'power3.inOut' });
          if (D.vucut && typeof k.hedef === 'string') Array.prototype.forEach.call(D.vucut.querySelectorAll('.org'), function (o2) { if (o2.getAttribute('data-org') === k.hedef) o2.classList.add('on'); });
          G.fromTo(nisan, { opacity: 0, scale: 1.8, rotation: -40 }, { opacity: 1, scale: 1, rotation: 0, duration: 0.6, delay: ks * 0.7, ease: 'back.out(1.6)' });
          if (k.not) { notK.textContent = k.not; G.fromTo(notK, { opacity: 0, x: 20 }, { opacity: 1, x: 0, duration: 0.45, delay: ks * 0.85 }); }
        }, null, t0);
      });
      if (s.kameraSifirla != null) tl.call(function () { G.to(D.d, { x: 0, y: 0, scale: 1, duration: 1, ease: 'power3.inOut' }); G.to([nisan, notK], { opacity: 0, duration: 0.3 }); }, null, Math.min(sure - 0.2, sayi(s.kameraSifirla, sure - 1)));
      altyazi(s.anlatim, sure);
      tl.call(function () { konus(s.anlatim); }, null, 0.05);
      if (!durdu) tl.play();
    }
    function sahneBitti(benim) {
      // anlatım sürüyorsa bekle (en çok 6 sn) → cümle yarıda kesilmez, akış kopmaz
      var p = sesSoz; if (!p) return ilerle(benim);
      var to = new Promise(function (ok) { setTimeout(ok, 6000); });
      Promise.race([p, to]).then(function () { ilerle(benim); }, function () { ilerle(benim); });
    }
    function ilerle(benim) { if (benim !== kusak || durdu || !kok.isConnected) return; git(i + 1, true); }
    function ogeKur(g, s, sure, tasindi) {
      if (!g) return;
      var t0 = Math.max(0, Math.min(sure - 0.3, sayi(g.t, 0))), r = renk(g.renk), b = Math.max(0.4, Math.min(3, sayi(g.boyut, 1))), e = null, acik = s.aciklamalar && g.id && s.aciklamalar[g.id], katman = D.k;
      if (g.tip === 'vucut') {
        var odak = [].concat(g.odak || []).filter(function (k) { return ORGAN[k]; });
        var vk = D.vucut;
        if (!vk) {
          vk = el('div', { class: 'an-vucut', style: g.x != null ? 'left:' + px(g.x) + ';top:' + px(g.y) : '' }); vk.appendChild(vucutKur([], null)); katman.appendChild(vk); D.vucut = vk;
          vk.appendChild(el('div', { class: 'an-tarama' }));
          G.set(vk, { opacity: 0 }); tl.fromTo(vk, { opacity: 0, scale: 0.92 }, { opacity: 1, scale: 1, duration: 0.6, ease: 'power2.out' }, t0);
          vk.addEventListener('click', function (ev) { var p = ev.target.closest('[data-org]'); if (!p) return; ev.stopPropagation(); var k = p.getAttribute('data-org'), oo = kokOran(p.getBoundingClientRect()); p.classList.add('on'); ipucu((ORGAN[k] ? ORGAN[k].ad.toUpperCase() + ' — ' : '') + (GOREV[k] || ''), oo.x, oo.y); });
        }
        tl.call(function () { odak.forEach(function (k) { var p = vk.querySelector('[data-org="' + k + '"]'); if (p) { p.classList.add('on'); if (g.renk) p.style.color = renk(g.renk); } }); }, null, t0 + 0.2);
        if (g.etiket !== false) odak.forEach(function (k, j) { tl.call(function () { var p = vk.querySelector('[data-org="' + k + '"]'); if (!p) return; var kr = kok.getBoundingClientRect(), rr = p.getBoundingClientRect(), dr = D.d.getBoundingClientRect(), sc = dr.width / kr.width || 1; var et = el('div', { class: 'an-o an-etiket', style: 'color:' + renk(ORGAN[k].r) + ';left:' + (((rr.right - dr.left) / sc) + 14) / kr.width * 100 + '%;top:' + (((rr.top + rr.height / 2) - dr.top) / sc) / kr.height * 100 + '%;transform:translate(0,-50%)' }, ['◀ ' + ORGAN[k].ad]); D.k.appendChild(et); G.fromTo(et, { opacity: 0, x: -10 }, { opacity: 1, x: 0, duration: 0.4 }); }, null, t0 + 0.5 + j * 0.3); });
        return;
      }
      if (g.tip === 'lab') {
        var lw = kl(sayi(g.g, 0.86)), lh = kl(sayi(g.y2, 0.5));
        var lk = el('div', { class: 'an-lab', style: 'left:' + px(g.x) + ';top:' + px(g.y) + ';width:' + lw * 100 + '%;height:' + lh * 100 + '%' }), lcv = el('canvas'), E = D;
        lk.appendChild(lcv); katman.appendChild(lk); G.set(lk, { opacity: 0 });
        tl.fromTo(lk, { opacity: 0, scale: 0.4, filter: 'blur(10px)' }, { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 0.7, ease: 'back.out(1.4)', onStart: function () { if (U.hucreOynat && !lk.dataset.b) { lk.dataset.b = 1; var oy = U.hucreOynat(lcv, g.surec); if (oy) E.labs.push(oy); } } }, t0);
        if (g.etiket) { var le = el('div', { class: 'an-o an-etiket', style: 'left:' + px(g.x) + ';top:calc(' + px(sayi(g.y, 0.5) - lh / 2) + ' - 14px)' }, [g.etiket]); katman.appendChild(le); G.set(le, { opacity: 0 }); tl.to(le, { opacity: 1, duration: 0.4 }, t0 + 0.4); }
        return;
      }
      if (g.tip === 'gorsel') {
        var gw = kl(sayi(g.g, 0.84)), gh = kl(sayi(g.y2, 0.5));
        var gk = el('div', { class: 'an-gorsel', style: 'left:' + px(g.x) + ';top:' + px(g.y) + ';width:' + gw * 100 + '%;height:' + gh * 100 + '%' }), atif = el('small');
        gk.appendChild(atif); katman.appendChild(gk); G.set(gk, { opacity: 0 });
        commonsBul(g.ara).then(function (res) {
          if (!res) { gk.remove(); return; }
          var im = new Image(); im.alt = g.etiket || g.ara; im.src = res.url; gk.insertBefore(im, atif);
          atif.textContent = (res.yazar ? res.yazar + ' · ' : '') + res.lisans + ' · Wikimedia Commons';
          G.fromTo(im, { scale: 1.02, xPercent: -1 }, { scale: 1.16, xPercent: 1.5, duration: sure + 2, ease: 'none' });
        });
        tl.fromTo(gk, { opacity: 0, scale: 0.9, filter: 'blur(8px)' }, { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 0.7, ease: 'power2.out' }, t0);
        if (g.etiket) { var ge = el('div', { class: 'an-o an-etiket', style: 'left:' + px(g.x) + ';top:calc(' + px(sayi(g.y, 0.5) - gh / 2) + ' - 14px)' }, [g.etiket]); katman.appendChild(ge); G.set(ge, { opacity: 0 }); tl.to(ge, { opacity: 1, duration: 0.4 }, t0 + 0.4); }
        return;
      }
      if (g.tip === 'zincir') {
        var adim = (g.adimlar || []).slice(0, 6).map(String); if (!adim.length) return;
        var zk = el('div', { class: 'an-zincir', style: 'top:' + px(sayi(g.y, 0.12)) }), ara = Math.max(0.35, Math.min(1.4, (sure - t0 - 0.8) / adim.length));
        adim.forEach(function (a, k) {
          if (k) { var ok = el('div', { class: 'an-zok', style: 'color:' + r }, ['↓']); zk.appendChild(ok); G.set(ok, { opacity: 0 }); tl.to(ok, { opacity: 1, duration: 0.2 }, t0 + k * ara - 0.15); }
          var kt = el('div', { class: 'an-zadim', style: '--r:' + r }, [a]); zk.appendChild(kt); G.set(kt, { opacity: 0 });
          tl.fromTo(kt, { opacity: 0, y: 14, scale: 0.92 }, { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: 'back.out(2)' }, t0 + k * ara);
          tl.fromTo(kt, { boxShadow: '0 0 0 1px ' + r + ',0 0 34px ' + r }, { boxShadow: '0 0 0 1px ' + r + ',0 0 0px ' + r, duration: 0.8 }, t0 + k * ara + 0.2);
        });
        katman.appendChild(zk); return;
      }
      if (g.tip === 'karsilastir') {
        var sol = g.sol || {}, sag = g.sag || {}, ck = el('div', { class: 'an-kars', style: 'top:' + px(sayi(g.y, 0.1)) });
        var aral = Math.max(0.3, (sure - t0 - 1) / Math.max(1, Math.max((sol.maddeler || []).length, (sag.maddeler || []).length)));
        [[sol, 'teal'], [sag, 'sari']].forEach(function (yz, k) {
          var c = renk(yz[0].renk || yz[1]), kol = el('div', { class: 'an-kkol', style: '--r:' + c }, [el('h5', { text: yz[0].baslik || '' })]);
          (yz[0].maddeler || []).slice(0, 5).forEach(function (m, j) { var li = el('div', { class: 'an-kmadde', text: m }); kol.appendChild(li); G.set(li, { opacity: 0 }); tl.fromTo(li, { opacity: 0, x: k ? 20 : -20 }, { opacity: 1, x: 0, duration: 0.35 }, t0 + 0.5 + j * aral + k * 0.15); });
          ck.appendChild(kol); if (!k) ck.appendChild(el('div', { class: 'an-vs', text: 'VS' }));
        });
        katman.appendChild(ck); G.set(ck, { opacity: 0 }); tl.fromTo(ck, { opacity: 0, scale: 0.94 }, { opacity: 1, scale: 1, duration: 0.45 }, t0); return;
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
        var x = kl(sayi(g.x, 0.5)) * 1000, y = kl(sayi(g.y, 0.5)) * 1000, sw = kl(sayi(g.g, 0.2)) * 1000, sh = kl(sayi(g.y2, g.g || 0.2)) * 1000, sk = g.sekil || 'daire';
        if (sk === 'daire' || sk === 'hucre') e = svgEl('ellipse', { cx: x, cy: y, rx: sw / 2, ry: sh / 2 });
        else if (sk === 'altigen') { var pts = []; for (var k = 0; k < 6; k++) { var a = Math.PI / 6 + k * Math.PI / 3; pts.push((x + Math.cos(a) * sw / 2).toFixed(0) + ',' + (y + Math.sin(a) * sh / 2).toFixed(0)); } e = svgEl('polygon', { points: pts.join(' ') }); }
        else if (sk === 'kanal') { e = svgEl('rect', { x: x - sw / 2, y: y - sh / 2, width: sw, height: sh, rx: 6 }); svgEl('line', { x1: x, y1: y - sh / 2, x2: x, y2: y + sh / 2, stroke: r, 'stroke-width': 2, 'stroke-dasharray': '6 5', opacity: 0.6 }); }
        else if (sk === 'zar') e = svgEl('rect', { x: x - sw / 2, y: y - 14, width: sw, height: 28, rx: 14 });
        else e = svgEl('rect', { x: x - sw / 2, y: y - sh / 2, width: sw, height: sh, rx: 18 });
        e.setAttribute('fill', r); e.setAttribute('fill-opacity', sk === 'hucre' ? 0.08 : 0.14); e.setAttribute('stroke', r); e.setAttribute('stroke-width', 3); e.style.filter = 'drop-shadow(0 0 8px ' + r + ')';
        G.set(e, { opacity: 0, transformOrigin: '50% 50%' }); tl.fromTo(e, { opacity: 0, scale: 0.5 }, { opacity: 1, scale: 1, duration: 0.55, ease: 'back.out(1.8)' }, t0);
        if (g.etiket) { var et = el('div', { class: 'an-o an-etiket', style: 'left:' + px(g.x) + ';top:calc(' + px(sayi(g.y, 0.5) + (sk === 'zar' ? 0.03 : sayi(g.y2, g.g || 0.2) / 2)) + ' + 16px)' }, [g.etiket]); katman.appendChild(et); G.set(et, { opacity: 0 }); tl.to(et, { opacity: 1, duration: 0.4 }, t0 + 0.3); }
        if (acik) { e.style.cursor = 'pointer'; e.addEventListener('click', function (ev) { ev.stopPropagation(); ipucu(acik, g.x, g.y); }); }
        e = null;
      } else if (g.tip === 'ok') {
        var x1 = kl(sayi(g.x1, 0.2)) * 1000, y1 = kl(sayi(g.y1, 0.5)) * 1000, x2 = kl(sayi(g.x2, 0.8)) * 1000, y2 = kl(sayi(g.y2, 0.5)) * 1000;
        var kv = sayi(g.kavis, 0), mx0 = (x1 + x2) / 2 - (y2 - y1) * kv, my0 = (y1 + y2) / 2 + (x2 - x1) * kv;
        var cz = svgEl('path', { d: 'M' + x1 + ' ' + y1 + ' Q' + mx0 + ' ' + my0 + ' ' + x2 + ' ' + y2, stroke: r, 'stroke-width': 5, fill: 'none', 'stroke-linecap': 'round' }), L = cz.getTotalLength ? cz.getTotalLength() : Math.hypot(x2 - x1, y2 - y1);
        cz.style.filter = 'drop-shadow(0 0 7px ' + r + ')'; cz.setAttribute('stroke-dasharray', L); cz.setAttribute('stroke-dashoffset', L);
        var an = Math.atan2(y2 - my0, x2 - mx0), uc = svgEl('path', { d: 'M' + (x2 - 24 * Math.cos(an - 0.45)) + ' ' + (y2 - 24 * Math.sin(an - 0.45)) + ' L' + x2 + ' ' + y2 + ' L' + (x2 - 24 * Math.cos(an + 0.45)) + ' ' + (y2 - 24 * Math.sin(an + 0.45)), stroke: r, 'stroke-width': 5, fill: 'none', opacity: 0 });
        tl.to(cz, { attr: { 'stroke-dashoffset': 0 }, duration: 0.55, ease: 'power2.inOut' }, t0); tl.to(uc, { opacity: 1, duration: 0.2 }, t0 + 0.5);
        if (g.etiket) { var et2 = el('div', { class: 'an-o an-etiket', style: 'left:' + (mx0 / 10) + '%;top:calc(' + (my0 / 10) + '% - 18px)' }, [g.etiket]); katman.appendChild(et2); G.set(et2, { opacity: 0 }); tl.to(et2, { opacity: 1, duration: 0.4 }, t0 + 0.45); }
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
        grafikKur(g, t0, r, katman);
      } else if (g.tip === 'vurgu' || g.tip === 'cizik') {
        var hd = D.kayit[g.hedef]; if (!hd) return;
        if (g.tip === 'vurgu') { var hl = el('div', { class: 'an-o', style: 'left:' + hd.style.left + ';top:' + hd.style.top + ';width:140px;height:140px;border-radius:50%;box-shadow:0 0 0 4px ' + r + ',0 0 34px ' + r + ';pointer-events:none' }); katman.appendChild(hl); G.set(hl, { opacity: 0, scale: 1.8 }); tl.to(hl, { opacity: 1, scale: 1, duration: 0.45, ease: 'back.out(2)' }, t0); tl.to(hl, { scale: 1.15, duration: 0.35, yoyo: true, repeat: 3 }, t0 + 0.45); }
        else tl.to(hd, { textDecoration: 'line-through', color: '#ff7a7a', opacity: 0.6, duration: 0.3 }, t0);
      }
      if (e) { if (g.id) D.kayit[g.id] = e; if (acik) e.addEventListener('click', function (ev) { ev.stopPropagation(); ipucu(acik, g.x, g.y); }); }
    }
    // gerçek grafik: eksen değerleri, yumuşak eğri, eşik çizgisi, nokta ilerlerken anlık değer okunur
    function grafikKur(g, t0, r, katman) {
      var gx = kl(sayi(g.x, 0.1)) * 1000, gy = kl(sayi(g.y, 0.26)) * 1000, gg = kl(sayi(g.g, 0.8)) * 1000, gh = kl(sayi(g.y2, 0.42)) * 1000;
      var nk = (g.noktalar || []).filter(function (p) { return Array.isArray(p) && p.length === 2 && isFinite(+p[0]) && isFinite(+p[1]); }).sort(function (a, b) { return a[0] - b[0]; });
      if (nk.length < 2) return;
      var ys = nk.map(function (p) { return +p[1]; }); if (g.esik && isFinite(+g.esik.deger)) ys.push(+g.esik.deger);
      var mn = Math.min.apply(null, ys), mx = Math.max.apply(null, ys), pay = (mx - mn) * 0.08 || 1; mn -= pay; mx += pay; var rng = mx - mn;
      var xs = nk.map(function (p) { return +p[0]; }), x0 = Math.min.apply(null, xs), x1 = Math.max.apply(null, xs), xr = (x1 - x0) || 1;
      function X(v) { return gx + (v - x0) / xr * gg; } function Yy(v) { return gy + gh - (v - mn) / rng * gh; }
      var gid = 'anG' + Math.random().toString(36).slice(2, 7), df = document.createElementNS(NS, 'defs'); df.innerHTML = '<linearGradient id="' + gid + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + r + '" stop-opacity=".5"/><stop offset="1" stop-color="' + r + '" stop-opacity="0"/></linearGradient>'; D.svg.appendChild(df);
      var cerceve = [];
      for (var k = 0; k <= 4; k++) { var yy = gy + gh * k / 4; cerceve.push(svgEl('line', { x1: gx, x2: gx + gg, y1: yy, y2: yy, stroke: 'rgba(160,255,240,.13)', 'stroke-width': 1 })); }
      cerceve.push(svgEl('line', { x1: gx, x2: gx, y1: gy, y2: gy + gh, stroke: 'rgba(160,255,240,.45)', 'stroke-width': 1.5 }), svgEl('line', { x1: gx, x2: gx + gg, y1: gy + gh, y2: gy + gh, stroke: 'rgba(160,255,240,.45)', 'stroke-width': 1.5 }));
      var birim = g.birim ? ' ' + g.birim : '';
      function yuvarla(v) { return Math.abs(rng) >= 20 ? Math.round(v) : Math.round(v * 10) / 10; }
      [mx, (mx + mn) / 2, mn].forEach(function (v, k) { var t = el('div', { class: 'an-eksen', style: 'left:' + (gx / 10) + '%;top:' + (gy + gh * k / 2) / 10 + '%' }, [String(yuvarla(v))]); katman.appendChild(t); cerceve.push(t); });
      if (mn < 0 && mx > 0) cerceve.push(svgEl('line', { x1: gx, x2: gx + gg, y1: Yy(0), y2: Yy(0), stroke: 'rgba(255,255,255,.28)', 'stroke-width': 1, 'stroke-dasharray': '3 4' }));
      if (g.yEtiket || g.birim) { var ye = el('div', { class: 'an-eksen y', style: 'left:' + (gx / 10) + '%;top:calc(' + (gy / 10) + '% - 26px)' }, [String(g.yEtiket || g.birim)]); katman.appendChild(ye); cerceve.push(ye); }
      if (g.xEtiket) { var xe = el('div', { class: 'an-eksen x', style: 'left:' + ((gx + gg) / 10) + '%;top:calc(' + ((gy + gh) / 10) + '% + 10px)' }, [String(g.xEtiket)]); katman.appendChild(xe); cerceve.push(xe); }
      if (g.esik && isFinite(+g.esik.deger)) {
        var ey = Yy(+g.esik.deger), el1 = svgEl('line', { x1: gx, x2: gx + gg, y1: ey, y2: ey, stroke: renk(g.esik.renk || 'kirmizi'), 'stroke-width': 2, 'stroke-dasharray': '10 8', opacity: 0.85 });
        var et = el('div', { class: 'an-eksen', style: 'left:' + ((gx + gg) / 10) + '%;top:' + (ey / 10) + '%;color:' + renk(g.esik.renk || 'kirmizi') + ';transform:translate(-100%,-130%)' }, [(g.esik.metin || 'eşik') + ' ' + g.esik.deger + birim]); katman.appendChild(et); cerceve.push(el1, et);
      }
      cerceve.forEach(function (c) { G.set(c, { opacity: 0 }); }); tl.to(cerceve, { opacity: 1, duration: 0.4, stagger: 0.02 }, t0);
      // Catmull-Rom → Bezier yumuşak eğri (g.keskin: true ise düz çizgi)
      var P = nk.map(function (p) { return [X(+p[0]), Yy(+p[1])]; }), d = 'M' + P[0][0].toFixed(1) + ' ' + P[0][1].toFixed(1);
      for (var q = 0; q < P.length - 1; q++) {
        if (g.keskin) { d += ' L' + P[q + 1][0].toFixed(1) + ' ' + P[q + 1][1].toFixed(1); continue; }
        var p0 = P[q - 1] || P[q], p1 = P[q], p2 = P[q + 1], p3 = P[q + 2] || p2, tt = 0.18;
        var c1x = p1[0] + (p2[0] - p0[0]) * tt, c1y = p1[1] + (p2[1] - p0[1]) * tt, c2x = p2[0] - (p3[0] - p1[0]) * tt, c2y = p2[1] - (p3[1] - p1[1]) * tt;
        // taşma/ilmek olmasın: kontrol noktaları iki veri noktasının kutusunda kalır (sivri tepeler düzgün çizilir)
        var lx = Math.min(p1[0], p2[0]), hx = Math.max(p1[0], p2[0]), ly = Math.min(p1[1], p2[1]), hy = Math.max(p1[1], p2[1]);
        c1x = Math.max(lx, Math.min(hx, c1x)); c2x = Math.max(lx, Math.min(hx, c2x)); c1y = Math.max(ly, Math.min(hy, c1y)); c2y = Math.max(ly, Math.min(hy, c2y));
        d += ' C' + c1x.toFixed(1) + ' ' + c1y.toFixed(1) + ' ' + c2x.toFixed(1) + ' ' + c2y.toFixed(1) + ' ' + p2[0].toFixed(1) + ' ' + p2[1].toFixed(1);
      }
      var alan = svgEl('path', { d: d + ' L' + P[P.length - 1][0] + ' ' + (gy + gh) + ' L' + P[0][0] + ' ' + (gy + gh) + ' Z', fill: 'url(#' + gid + ')', opacity: 0, stroke: 'none' });
      var pth = svgEl('path', { d: d, stroke: r, 'stroke-width': 5, fill: 'none', 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }); pth.style.filter = 'drop-shadow(0 0 10px ' + r + ')';
      var L2 = pth.getTotalLength ? pth.getTotalLength() : 2000; pth.setAttribute('stroke-dasharray', L2); pth.setAttribute('stroke-dashoffset', L2);
      var nok = el('div', { class: 'an-o', style: 'width:18px;height:18px;border-radius:50%;background:#fff;opacity:0;box-shadow:0 0 16px ' + r + ',0 0 4px #fff;pointer-events:none' }); katman.appendChild(nok);
      var oku = el('div', { class: 'an-o an-okuma', style: 'opacity:0;color:' + r }); katman.appendChild(oku);
      var gs = sayi(g.sure, 2.6), prg = { f: 0 };
      tl.to(prg, { f: 1, duration: gs, ease: 'none', onStart: function () { nok.style.opacity = 1; oku.style.opacity = 1; }, onUpdate: function () {
        pth.setAttribute('stroke-dashoffset', L2 * (1 - prg.f));
        if (pth.getPointAtLength) { var pp = pth.getPointAtLength(L2 * prg.f); nok.style.left = pp.x / 10 + '%'; nok.style.top = pp.y / 10 + '%'; oku.style.left = pp.x / 10 + '%'; oku.style.top = 'calc(' + pp.y / 10 + '% - 30px)'; oku.textContent = yuvarla(mn + (gy + gh - pp.y) / gh * rng) + birim; }
      } }, t0 + 0.3);
      tl.to(alan, { opacity: 1, duration: 0.8 }, t0 + 0.3 + gs * 0.5);
      (g.isaretler || []).slice(0, 5).forEach(function (m) {
        var mv = isFinite(+m.x) ? +m.x : x0, fx = (mv - x0) / xr, mxp = X(mv);
        // işaretin noktası: eğrideki en yakın veri noktasının yüksekliği
        var yak = nk.reduce(function (a, b) { return Math.abs(b[0] - mv) < Math.abs(a[0] - mv) ? b : a; });
        var me = el('div', { class: 'an-o an-isaret', style: 'left:calc(' + mxp / 10 + '% + 12px);top:calc(' + Yy(+yak[1]) / 10 + '% - 30px);transform:translate(0,-50%);--r:' + renk(m.renk || 'sari') }, [m.metin || '']); katman.appendChild(me); G.set(me, { opacity: 0 });
        tl.fromTo(me, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.3 }, t0 + 0.3 + gs * kl(fx));
      });
      if (g.etiket) { var et3 = el('div', { class: 'an-o an-etiket', style: 'left:' + ((gx + gg / 2) / 10) + '%;top:calc(' + (gy / 10) + '% - 40px)' }, [g.etiket]); katman.appendChild(et3); G.set(et3, { opacity: 0 }); tl.to(et3, { opacity: 1, duration: 0.4 }, t0); }
    }
    function soruKur(s, benim) {
      var kutu = el('div', { class: 'an-soru' }, [el('h4', { text: s.soru })]), cevaplandi = false, dogru = Math.max(0, Math.min(4, +s.dogru || 0));
      var halka = el('div', { class: 'an-geri' }, [el('i')]); kutu.appendChild(halka);
      konus(s.soru);
      var btn = s.siklar.slice(0, 5).map(function (sk, k) {
        var b = el('button', { type: 'button', text: 'ABCDE'[k] + ') ' + sk });
        b.addEventListener('click', function (ev) { ev.stopPropagation(); cevapla(k); });
        kutu.appendChild(b); return b;
      });
      function cevapla(k) {
        if (cevaplandi || benim !== kusak) return; cevaplandi = true; if (soruZaman) { soruZaman.kill(); soruZaman = null; } halka.style.visibility = 'hidden';
        var ok = k === dogru;
        if (k >= 0) btn[k].classList.add(ok ? 'dogru' : 'yanlis'); if (!ok && btn[dogru]) btn[dogru].classList.add('dogru');
        kutu.appendChild(el('p', { text: (k < 0 ? '⏱ Süre doldu. ' : ok ? '✓ ' : '✗ ') + (s.aciklama || '') }));
        if (k >= 0 && o.cevap) o.cevap(ok, s);
        if (k >= 0) G.fromTo(btn[k], { scale: 1.06 }, { scale: 1, duration: 0.4, ease: 'back.out(3)' });
        sus(); konus((k < 0 ? 'Doğrusu ' + 'ABCDE'[dogru] + '. ' : ok ? 'Doğru. ' : 'Hayır. ') + (s.aciklama || ''));
        var bekle = new Promise(function (r2) { setTimeout(r2, 2600); });
        bekle.then(function () { sahneBitti(benim); });
      }
      D.k.appendChild(kutu); ilerleme(0.3);
      G.from(kutu.children, { opacity: 0, y: 20, stagger: 0.08, duration: 0.35 });
      // kendiliğinden akar: 10 sn içinde cevap gelmezse doğru şık gösterilir ve video sürer
      var zf = { f: 0 };
      soruZaman = G.to(zf, { f: 1, duration: 10, ease: 'none', onUpdate: function () { halka.firstChild.style.width = (100 - zf.f * 100) + '%'; ilerleme(0.3 + zf.f * 0.5); }, onComplete: function () { cevapla(-1); } });
      if (durdu) soruZaman.pause();
    }
    function git(k, dogal) {
      if (k < 0) k = 0;
      if (k >= sahneler.length) { bitti = true; ilerleme(1); if (o.bitti) o.bitti(); return; }
      if (!dogal) sus();
      i = k; sahneKur(sahneler[i]);
    }
    function durdur(v) {
      durdu = v; if (tl) { if (v) tl.pause(); else tl.play(); } if (soruZaman) { if (v) soruZaman.pause(); else soruZaman.play(); }
      if (v) sus();
      var dd = kok.querySelector('.an-durdu'); if (v && !dd) kok.appendChild(el('div', { class: 'an-durdu', text: '❚❚' })); if (!v && dd) dd.remove();
      if (!v && tl && tl.progress() >= 1) sahneBitti(kusak);
    }
    cubuk.addEventListener('click', function (e) {
      e.stopPropagation(); var r = cubuk.getBoundingClientRect(), f = (e.clientX - r.left) / r.width * toplam, k = 0, s = 0;
      while (k < sureler.length - 1 && s + sureler[k] < f) { s += sureler[k]; k++; }
      durdu = false; var dd = kok.querySelector('.an-durdu'); if (dd) dd.remove(); git(k);
    });
    kok.addEventListener('click', function (e) {
      if (e.target.closest('button, .an-tikla, .an-cubuk, [data-org]')) return;
      var r = kok.getBoundingClientRect(), fx = (e.clientX - r.left) / r.width;
      if (fx < 0.18) { durdu = false; var d1 = kok.querySelector('.an-durdu'); if (d1) d1.remove(); git(i - 1); }
      else if (fx > 0.82) { durdu = false; var d2 = kok.querySelector('.an-durdu'); if (d2) d2.remove(); git(i + 1); }
      else durdur(!durdu);
    });
    function kare(t) { raf = requestAnimationFrame(kare); if (!kok.isConnected) return cancelAnimationFrame(raf); if (arkaCiz && !document.hidden) arkaCiz(t); }
    raf = requestAnimationFrame(kare);
    this.basla = function () { durdu = false; bitti = false; git(0); };
    this.durdur = function () { durdur(true); };
    this.surdur = function () { durdur(false); };
    this.yoket = function () { kusak++; if (tl) tl.kill(); if (soruZaman) soruZaman.kill(); if (D) D.labs.forEach(function (l) { try { l.durdur(); } catch (e) {} }); cancelAnimationFrame(raf); sus(); kok.remove(); };
    this.bittiMi = function () { return bitti; };
    this.toplamSure = function () { return toplam; };
  }
  U.Animasyon = { Oynatici: Oynatici, hazir: function () { return !!window.gsap; }, organlar: function () { return Object.keys(ORGAN); }, duzelt: duzelt, onYukle: onYukle, gorselBul: commonsBul, sure: function (j) { return (j.sahneler || []).reduce(function (a, s) { return a + (s ? sahneSuresi(s) : 0); }, 0); } };

  /* ---------- yapay zekâya verilecek senaryo kuralları ---------- */
  U.Animasyon.senaryoKurali = function () {
    var lab = U.hucreSurecleri ? U.hucreSurecleri().map(function (x) { return x.id + ' (' + x.ad + ')'; }).join('; ') : '';
    return [
      'BU TEK PARÇA AKAN BİR VİDEO (reels), slayt değil: sahneler birbirine akar; bir sahnede kurulan görüntü (özellikle vücut) sonraki sahnede kamera hareketiyle sürer. Ekran dikey; koordinatlar 0..1 (x sağa, y aşağı). Alt %22 altyazıya ayrılmış: oraya öğe koyma. Öğeleri üst üste bindirme.',
      'ANLATICI Patrick Jane (The Mentalist): sakin, kendinden emin, muzip; izleyicinin aklından geçeni okur ("Herkes … sanır. Değil.", "Şimdi bak…", "İşin hilesi şu:"). Her sahnede 1-2 kısa cümle (en çok 24 kelime). Sahnedeki görüntüyü ANLAT ("şu sarı eğri…", "kalbin sol tarafına bak").',
      'YAZI AZ, GÖRÜNTÜ ÇOK: ekrana yazı yalnız kancada ve en önemli 1-2 terimde (en çok 5 kelime). Bilgiyi anlatım + animasyon taşır. Her sahnede EN AZ BİR görsel öğe (vucut, lab, gorsel, grafik, zincir, karsilastir, akis, sekil) olsun.',
      '"sahneler": 9-13 sahne, her biri 3.5-6 sn. Sahne: {"anlatim":"…","sure":4.5,"arka":"vucut|hucre|kan|beyin|kalp|uzay|koridor","gecis":"dal|kaydir|parla","ogeler":[…],"kamera":[{"hedef":"organ ya da {x,y}","zoom":1.5-4,"t":0.6,"sure":1.3,"not":"zoomdan sonra çıkan 1 kısa cümle: organ burada ne yapıyor"}],"kameraSifirla":saniye,"aciklamalar":{"ogeId":"dokununca çıkan 1 cümle"}}',
      'Öğeler (her birinde "id" ve "t" = sahne içinde başlama saniyesi):',
      ' {"tip":"vucut","odak":["kalp"],"renk":"kirmizi"} — holografik insan vücudu; odak organ parlar ve etiketlenir. Arka arkaya iki sahnede vucut kullanırsan aynı vücut kalır, kamera kaldığı yerden devam eder (kesintisiz). Organlar: ' + Object.keys(ORGAN).join(', ') + '.',
      ' {"tip":"lab","surec":"…","x":0.5,"y":0.4,"g":0.9,"y2":0.5,"etiket":"kısa"} — hücre düzeyi CANLI simülasyon. Süreçler: ' + lab,
      ' {"tip":"gorsel","ara":"İngilizce Wikimedia Commons arama terimi (ör. \'nephron diagram\', \'cardiac action potential\', \'brachial plexus\')","x":0.5,"y":0.4,"g":0.9,"y2":0.5,"etiket":"kısa"} — GERÇEK açık lisanslı şema/görsel, yavaşça yakınlaşır. Anatomi ve histolojide 1-2 sahnede kullan.',
      ' {"tip":"grafik","noktalar":[[0,-70],[1,-70],[1.5,30],[3,-80],[5,-70]],"birim":"mV","xEtiket":"ms","esik":{"deger":-55,"metin":"eşik"},"isaretler":[{"x":1.5,"metin":"tepe +30"}],"x":0.12,"y":0.2,"g":0.8,"y2":0.44,"renk":"sari","sure":2.6} — gerçek veri noktaları (x gerçek birim, y gerçek değer); eksenler, eşik çizgisi ve anlık değer otomatik çizilir.',
      ' {"tip":"zincir","adimlar":["Na⁺ kanalı açılır","Na⁺ içeri","Depolarizasyon","K⁺ çıkar"],"y":0.1,"renk":"teal"} — neden→sonuç zinciri, adım adım belirir (mekanizmalar için en iyisi).',
      ' {"tip":"karsilastir","sol":{"baslik":"…","maddeler":["…"]},"sag":{"baslik":"…","maddeler":["…"]},"y":0.1} — karıştırılan iki kavram yan yana (ayırt etme).',
      ' {"tip":"yazi","metin":"en çok 5 kelime","x":0.5,"y":0.14,"giris":"patla|yaz|uc|belir"} · {"tip":"ikon","emoji":"tek emoji","x":..,"y":..,"boyut":1-2.8,"nabiz":true,"hareket":[{"x":..,"y":..,"t":..,"sure":1}]}',
      ' {"tip":"sayac","x":..,"y":..,"bas":-70,"son":30,"birim":"mV","sure":2} · {"tip":"akis","yol":[[x,y],…],"etiket":"Na⁺","adet":5-10,"renk":"yesil","sure":1.8} · {"tip":"ok","x1":..,"y1":..,"x2":..,"y2":..,"kavis":0.2,"etiket":".."}',
      ' {"tip":"sekil","sekil":"hucre|daire|kutu|altigen|kanal|zar","x":..,"y":..,"g":..,"y2":..,"renk":"..","etiket":".."} · {"tip":"etiket","metin":"..","x":..,"y":..} · {"tip":"vurgu","hedef":"id"} · {"tip":"cizik","hedef":"yanlış yazının id\'si"}',
      'Renkler: teal, sari, mor, kirmizi, yesil, mavi, turuncu, beyaz. Ortaya (5.-6. sahne) ve sona birer SORU sahnesi: {"tip":"soru","soru":"…","siklar":["…","…","…","…"],"dogru":0,"aciklama":"Jane tarzı kısa açıklama"} — video beklemez; 10 sn içinde cevap gelmezse doğrusu gösterilir.',
      'ÖRNEK AKIŞ (kalp konusu için, kısaltılmış): [{"anlatim":"Herkes kalbin beyinden emir beklediğini sanır. Değil.","arka":"kalp","ogeler":[{"id":"y","tip":"yazi","metin":"Kalbi kim ateşler?","x":0.5,"y":0.16,"t":0},{"id":"i","tip":"ikon","emoji":"🫀","x":0.5,"y":0.48,"boyut":2.6,"nabiz":true,"t":0.4}]},' +
        '{"anlatim":"Göğsün ortasına, biraz sola in. Şuradaki küçük düğüm: SA nod.","arka":"vucut","gecis":"dal","ogeler":[{"id":"v","tip":"vucut","odak":["kalp"],"t":0}],"kamera":[{"hedef":"kalp","zoom":3.2,"t":1,"sure":1.4,"not":"Sağ atriyumda doğal pil: dakikada 60-100 uyarı"}]},' +
        '{"anlatim":"Şimdi hücreye gir. Kalsiyum içeri dolar, plato bu yüzden uzun.","arka":"hucre","ogeler":[{"id":"l","tip":"lab","surec":"kalp-ap","x":0.5,"y":0.4,"g":0.92,"y2":0.52,"etiket":"ventrikül kas hücresi","t":0.2}]},' +
        '{"anlatim":"Grafiğe bak: hızlı yükseliş, uzun plato, iniş.","arka":"kalp","ogeler":[{"id":"g","tip":"grafik","noktalar":[[0,-90],[5,20],[20,5],[200,-5],[280,-90],[320,-90]],"birim":"mV","xEtiket":"ms","isaretler":[{"x":5,"metin":"faz 0"},{"x":120,"metin":"plato"}],"t":0.2,"sure":2.8}]}, …]'
    ].join('\n');
  };
  U.Animasyon.SENARYO_KURALI = '';
  try { Object.defineProperty(U.Animasyon, 'SENARYO_KURALI', { get: function () { return U.Animasyon.senaryoKurali(); } }); } catch (e) {}
})();
