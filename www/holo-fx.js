/* 1001 — Holografik efektler, 2. kat (kullanıcı: "daha da holografik olsun, sky is the limit").
   1) Açılış sekansı: oturumda bir kez, halkalar + sistem satırları → "ÇEVRİMİÇİ" (dokununca geçer).
   2) Eğim/paralaks: tabletin eğimi (ya da imleç) kartları 3B eğer; üstlerinde eğimle kayan gökkuşağı folyo yansıması.
   3) Merkez küresinin altında projektör ışık konisi ve taban halkası.
   4) Başlıklarda ara sıra kısa parazit (glitch).
   5) Dokunulan yerde hedef kilidi halkası.
   6) Merkez'de kenarlarda akan veri sütunları.
   7) Arayüz sesleri (WebAudio ile üretilir, dosya yok; telemetrideki 🔈 ile aç/kapa).
   Okuma görünümünde (body.fx-okuma) 2/4/5/6 kapalı; arka plandayken eğim dinlenmez; prefers-reduced-motion'da hepsi kapalı. */
(function () {
  'use strict';
  var U = window.Uygulama; if (!U) return;
  if (/[?&]gomulu\b/.test(location.search)) return;
  var el = U.el, $ = U.$, $$ = U.$$;
  var AZ = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var root = document.documentElement;

  var css = document.createElement('style');
  css.textContent = [
    // --- açılış
    '.hx-acilis{position:fixed;inset:0;z-index:200;display:grid;place-items:center;background:radial-gradient(circle at 50% 45%,rgba(20,70,100,.55),#02070b 70%);color:#bff6ff;font:600 12px var(--f-kod);letter-spacing:.22em;cursor:pointer;transition:opacity .5s,filter .5s}',
    '.hx-acilis.bitti{opacity:0;filter:brightness(2.5) blur(4px);pointer-events:none}',
    '.hx-acilis svg{width:min(62vmin,420px);height:auto;overflow:visible;filter:drop-shadow(0 0 10px rgba(94,231,255,.8))}',
    '.hx-acilis .h1{transform-origin:200px 200px;animation:hudDon 6s linear infinite}.hx-acilis .h2{transform-origin:200px 200px;animation:hudDon 3.5s linear infinite reverse}.hx-acilis .h3{transform-origin:200px 200px;animation:hudDon 10s linear infinite}',
    '.hx-acilis .cekirdek{animation:hxCekirdek 1.4s ease-out both}',
    '.hx-satirlar{position:absolute;left:50%;top:calc(50% + min(34vmin,230px));transform:translateX(-50%);width:min(90vw,520px);display:grid;gap:5px;text-align:left}',
    '.hx-satirlar div{opacity:0;animation:hxSatir .25s ease-out forwards;white-space:nowrap;overflow:hidden}.hx-satirlar b{color:#5fe0a0;font-weight:600}',
    '.hx-baslik{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);font:700 clamp(18px,4.2vmin,30px) var(--f-baslik);letter-spacing:.42em;color:#eafcff;text-shadow:0 0 18px #5ee7ff,0 0 40px rgba(94,231,255,.6);animation:hxBaslik 1.6s ease-out both;padding-left:.42em}',
    '@keyframes hxCekirdek{0%{r:0;opacity:0}60%{r:46;opacity:1}100%{r:38}}',
    '@keyframes hxSatir{from{opacity:0;transform:translateX(-8px)}to{opacity:1;transform:none}}',
    '@keyframes hxBaslik{0%,30%{opacity:0;letter-spacing:1.2em}70%{opacity:1}100%{opacity:1;letter-spacing:.42em}}',

    // --- eğim + folyo
    'body:not(.fx-okuma) .hx-egim{transform:perspective(900px) rotateX(calc(var(--hy,0) * -5deg)) rotateY(calc(var(--hx,0) * 6deg));transition:transform .25s ease-out;transform-style:preserve-3d}',
    '.hx-folyo{position:absolute;inset:0;pointer-events:none;z-index:2;mix-blend-mode:color-dodge;opacity:.55;',
    'background:linear-gradient(115deg,transparent 18%,rgba(94,255,240,.16) 32%,rgba(150,120,255,.16) 42%,rgba(255,120,200,.12) 50%,rgba(255,220,120,.12) 58%,transparent 72%);',
    'background-size:260% 260%;background-position:calc(50% + var(--hx,0) * 40%) calc(50% + var(--hy,0) * 40%);transition:background-position .25s ease-out}',
    '.hx-folyo::after{content:"";position:absolute;inset:0;background:radial-gradient(circle at calc(50% + var(--hx,0) * 45%) calc(30% + var(--hy,0) * 45%),rgba(255,255,255,.16),transparent 45%)}',
    'body.fx-okuma .hx-folyo{display:none}',

    // --- projektör konisi (Merkez küresi)
    '.merkez{isolation:isolate}',
    '.hx-koni{position:absolute;left:50%;bottom:-2%;width:58%;height:70%;transform:translateX(-50%);pointer-events:none;z-index:-1;',
    'background:linear-gradient(0deg,rgba(94,231,255,.30),rgba(94,231,255,.06) 55%,transparent 85%);clip-path:polygon(44% 100%,56% 100%,100% 0,0 0);filter:blur(6px);animation:hxKoni 3.8s ease-in-out infinite}',
    '.hx-taban{position:absolute;left:50%;bottom:0;width:26%;aspect-ratio:5/1;transform:translateX(-50%);border-radius:50%;pointer-events:none;z-index:-1;',
    'border:1.5px solid rgba(94,231,255,.7);box-shadow:0 0 22px rgba(94,231,255,.6),inset 0 0 18px rgba(94,231,255,.5);background:radial-gradient(ellipse,rgba(94,231,255,.35),transparent 70%)}',
    '.hx-taban::after{content:"";position:absolute;inset:-35% -18%;border-radius:50%;border:1px dashed rgba(94,231,255,.45);animation:hudDon 14s linear infinite}',
    '@keyframes hxKoni{50%{opacity:.6}}',

    // --- başlık paraziti
    'body:not(.fx-okuma) .kahraman h1{animation:hxParazit 9s steps(1) infinite}',
    '@keyframes hxParazit{0%,93%,100%{transform:none;clip-path:none}94%{transform:translate(-3px,1px) skewX(-8deg);clip-path:inset(10% 0 55% 0)}95%{transform:translate(4px,-1px);clip-path:inset(60% 0 8% 0)}96%{transform:translate(-1px,0) skewX(4deg);clip-path:inset(30% 0 30% 0)}97%{transform:none;clip-path:none}}',

    // --- dokunma halkası
    '.hx-kilit{position:fixed;z-index:190;width:58px;height:58px;margin:-29px 0 0 -29px;pointer-events:none;border:1.5px solid rgba(94,231,255,.9);border-radius:50%;box-shadow:0 0 14px rgba(94,231,255,.7);animation:hxKilit .55s ease-out forwards}',
    '.hx-kilit::before,.hx-kilit::after{content:"";position:absolute;left:50%;top:50%;background:rgba(94,231,255,.9)}',
    '.hx-kilit::before{width:76px;height:1px;margin-left:-38px}.hx-kilit::after{width:1px;height:76px;margin-top:-38px}',
    '@keyframes hxKilit{0%{transform:scale(.3) rotate(45deg);opacity:1}100%{transform:scale(1.25) rotate(0);opacity:0}}',

    // --- veri sütunları
    '.hx-akis{position:fixed;top:70px;bottom:0;width:64px;z-index:1;pointer-events:none;overflow:hidden;opacity:.22;font:10px/1.5 var(--f-kod);color:#5ee7ff;-webkit-mask-image:linear-gradient(transparent,#000 15%,#000 85%,transparent);mask-image:linear-gradient(transparent,#000 15%,#000 85%,transparent)}',
    '.hx-akis.sol{left:8px}.hx-akis.sag{right:8px;text-align:right}',
    '.hx-akis pre{margin:0;font:inherit;animation:hxAkis 38s linear infinite}.hx-akis.sag pre{animation-duration:52s}',
    '@keyframes hxAkis{from{transform:translateY(0)}to{transform:translateY(-50%)}}',
    'body:not(.hx-merkez) .hx-akis{display:none}',
    '@media (max-width:900px){.hx-akis{display:none}}',

    // --- ses düğmesi
    '.hx-ses{background:none;border:0;color:inherit;font:inherit;cursor:pointer;padding:0 2px;opacity:.85}',

    '@media (prefers-reduced-motion: reduce){.hx-koni,.hx-taban::after,.hx-akis pre,body .kahraman h1{animation:none!important}.hx-folyo{display:none}}'
  ].join('\n');
  document.head.appendChild(css);

  /* ---------------- 7) arayüz sesleri ---------------- */
  var sesAcik = true; try { sesAcik = localStorage.getItem('hx_ses') !== '0'; } catch (e) {}
  var ac = null;
  function bip(tur) {
    if (!sesAcik || AZ) return;
    try {
      ac = ac || new (window.AudioContext || window.webkitAudioContext)();
      var t = ac.currentTime, o = ac.createOscillator(), g = ac.createGain();
      var f = { ac: [880, 1320, .09], sec: [1320, 990, .06], acilis: [220, 880, .9], kapat: [990, 660, .07] }[tur] || [1000, 1000, .05];
      o.type = 'sine'; o.frequency.setValueAtTime(f[0], t); o.frequency.exponentialRampToValueAtTime(f[1], t + f[2]);
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.035, t + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t + f[2] + 0.05);
      o.connect(g); g.connect(ac.destination); o.start(t); o.stop(t + f[2] + 0.08);
    } catch (e) {}
  }
  window.HoloSes = bip;
  document.addEventListener('click', function (e) {
    var h = e.target.closest && e.target.closest('.hud-grup,.hud-oge,.sp-sarki,.sp-d');
    if (!h) return;
    bip(h.classList.contains('hud-grup') ? (h.getAttribute('aria-expanded') === 'true' ? 'kapat' : 'ac') : 'sec');
  }, true);
  var tel = $('.hud-tel');
  if (tel) {
    var sd = el('button', { class: 'hx-ses', type: 'button', title: 'Arayüz sesleri', 'aria-label': 'Arayüz sesleri', text: sesAcik ? '🔈' : '🔇' });
    sd.addEventListener('click', function () { sesAcik = !sesAcik; sd.textContent = sesAcik ? '🔈' : '🔇'; try { localStorage.setItem('hx_ses', sesAcik ? '1' : '0'); } catch (e) {} bip('sec'); });
    tel.prepend(sd); tel.removeAttribute('aria-hidden');
  }

  /* ---------------- 1) açılış sekansı ---------------- */
  var acilisGoruldu = false; try { acilisGoruldu = sessionStorage.getItem('hx_acilis') === '1'; sessionStorage.setItem('hx_acilis', '1'); } catch (e) {}
  if (!AZ && !acilisGoruldu) {
    var ns = 'http://www.w3.org/2000/svg';
    var svg = document.createElementNS(ns, 'svg'); svg.setAttribute('viewBox', '0 0 400 400');
    svg.innerHTML = '<g fill="none" stroke="#5ee7ff">' +
      '<circle class="h3" cx="200" cy="200" r="170" stroke-width="1" stroke-dasharray="2 10" opacity=".7"/>' +
      '<circle class="h1" cx="200" cy="200" r="140" stroke-width="3" stroke-dasharray="120 30 40 30" opacity=".9"/>' +
      '<circle class="h2" cx="200" cy="200" r="110" stroke-width="1.5" stroke-dasharray="6 6"/>' +
      '<circle cx="200" cy="200" r="82" stroke-width="1" opacity=".6"/>' +
      '<g class="h1">' + [0, 60, 120, 180, 240, 300].map(function (a) { return '<rect x="196" y="52" width="8" height="22" fill="#5ee7ff" opacity=".85" transform="rotate(' + a + ' 200 200)"/>'; }).join('') + '</g>' +
      '</g><circle class="cekirdek" cx="200" cy="200" r="38" fill="url(#hxg)"/>' +
      '<defs><radialGradient id="hxg"><stop offset="0" stop-color="#fff"/><stop offset=".45" stop-color="#9ff6ff"/><stop offset="1" stop-color="#2fb4ff" stop-opacity=".15"/></radialGradient></defs>';
    var satirlar = el('div', { class: 'hx-satirlar' });
    var perde = el('div', { class: 'hx-acilis', role: 'presentation' }, [svg, el('div', { class: 'hx-baslik', text: 'C.A.R.V.I.S.' }), satirlar]);
    document.body.appendChild(perde);
    var kitapSay = 0; try { kitapSay = (U.Kitaplik && U.Kitaplik.liste || []).length; } catch (e) {}
    var S = [
      ['ÇEKİRDEK BAŞLATILIYOR', 'OK'], ['NÖRAL ARAYÜZ', 'OK'], ['KÜTÜPHANE · ' + (kitapSay || 4) + ' KİTAP', 'YÜKLENDİ'],
      ['SES MODÜLÜ', window.AndroidKopru ? 'HAZIR' : 'TARAYICI'], ['SPOTIFY', window.Spotify && window.Spotify.bagli() ? 'BAĞLI' : 'BEKLEMEDE'], ['HOLOGRAFİK KATMAN', 'ÇEVRİMİÇİ']
    ];
    S.forEach(function (s, i) { satirlar.appendChild(el('div', { style: 'animation-delay:' + (300 + i * 170) + 'ms' }, ['▸ ' + s[0] + ' ', el('b', { text: '[' + s[1] + ']' })])); });
    var kapat = function () { if (perde.classList.contains('bitti')) return; perde.classList.add('bitti'); setTimeout(function () { perde.remove(); }, 600); };
    perde.addEventListener('click', kapat);
    setTimeout(function () { bip('acilis'); }, 150);
    setTimeout(kapat, 2300);
  }

  /* ---------------- 2) eğim + folyo ---------------- */
  var EGIM = '.kitap-kart,.koc-is,.sr-kart,.plan-gun,.sp-kutu,.hud-oge,.th-kpi > div';
  var FOLYO = '.kitap-kart,.koc-is,.sr-kart,.sp-kutu,.hud-menu,.mz-kitap';
  function isaretle(kok) {
    $$(EGIM, kok).forEach(function (x) { x.classList.add('hx-egim'); });
    $$(FOLYO, kok).forEach(function (x) { if (!x.querySelector(':scope > .hx-folyo')) { if (getComputedStyle(x).position === 'static') x.style.position = 'relative'; x.appendChild(el('i', { class: 'hx-folyo', 'aria-hidden': 'true' })); } });
  }
  var bekleyen = false;
  new MutationObserver(function () { if (bekleyen) return; bekleyen = true; requestAnimationFrame(function () { bekleyen = false; isaretle(document.body); }); }).observe(document.body, { childList: true, subtree: true });
  isaretle(document.body);
  if (!AZ) {
    var hx = 0, hy = 0, cizildi = true, taban = null;
    function uygula() { cizildi = true; root.style.setProperty('--hx', hx.toFixed(3)); root.style.setProperty('--hy', hy.toFixed(3)); }
    function ayarla(x, y) { x = Math.max(-1, Math.min(1, x)); y = Math.max(-1, Math.min(1, y)); if (Math.abs(x - hx) < 0.02 && Math.abs(y - hy) < 0.02) return; hx = x; hy = y; if (cizildi) { cizildi = false; requestAnimationFrame(uygula); } }
    window.addEventListener('deviceorientation', function (e) {
      if (document.hidden || document.body.classList.contains('fx-okuma') || e.beta == null) return;
      if (!taban) taban = { b: e.beta, g: e.gamma }; // ilk duruş nötr kabul edilir, yavaşça ona çekilir
      taban.b += (e.beta - taban.b) * 0.01; taban.g += (e.gamma - taban.g) * 0.01;
      var yatay = Math.abs(window.orientation || (screen.orientation && screen.orientation.angle) || 0) === 90;
      var dx = (yatay ? e.beta - taban.b : e.gamma - taban.g) / 18, dy = (yatay ? taban.g - e.gamma : e.beta - taban.b) / 18;
      ayarla(dx, dy);
    });
    window.addEventListener('pointermove', function (e) { if (e.pointerType !== 'mouse') return; ayarla(e.clientX / innerWidth * 2 - 1, e.clientY / innerHeight * 2 - 1); }, { passive: true });
  }

  /* ---------------- 3) projektör konisi ---------------- */
  function koniKoy() { $$('.merkez').forEach(function (m) { if (!m.querySelector(':scope > .hx-koni')) { m.appendChild(el('i', { class: 'hx-koni', 'aria-hidden': 'true' })); m.appendChild(el('i', { class: 'hx-taban', 'aria-hidden': 'true' })); } }); }

  /* ---------------- 5) hedef kilidi ---------------- */
  if (!AZ) document.addEventListener('pointerdown', function (e) {
    if (document.body.classList.contains('fx-okuma') || e.pointerType === 'mouse') return;
    if (e.target.closest && e.target.closest('input,textarea,select,.metin')) return;
    var k = el('i', { class: 'hx-kilit', style: 'left:' + e.clientX + 'px;top:' + e.clientY + 'px' });
    document.body.appendChild(k); setTimeout(function () { k.remove(); }, 600);
  }, { passive: true });

  /* ---------------- 6) veri sütunları ---------------- */
  function akisMetni(n) { var s = ''; for (var i = 0; i < n; i++) s += (Math.random() * 0xffffff | 0).toString(16).toUpperCase().padStart(6, '0') + (i % 3 === 2 ? '\n' : ' '); return s; }
  if (!AZ) ['sol', 'sag'].forEach(function (y) { var t = akisMetni(150); document.body.appendChild(el('div', { class: 'hx-akis ' + y, 'aria-hidden': 'true' }, [el('pre', { text: t + t })])); });

  function sayfaDegisti() {
    var h = location.hash.slice(1) || 'kutuphane';
    document.body.classList.toggle('hx-merkez', h === 'kutuphane');
    setTimeout(koniKoy, 60); setTimeout(koniKoy, 800);
  }
  window.addEventListener('hashchange', sayfaDegisti); sayfaDegisti();
})();
