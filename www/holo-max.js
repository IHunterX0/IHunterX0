/* 1001 — Holografik efektler, 3. kat: MAX (kullanıcı: "abart efektleri").
   - 3B hologram sahnesi (tek canvas, kütüphanesiz): iki yanda dönen DNA sarmalları (eğimle paralaks),
     Merkez'de projektör ışığında yükselen toz, parmak izinde ışık parçacıkları.
   - Sayfa geçişi: yukarıdan aşağı tarama ışını + RGB ayrışmalı parlama; başlıklar "şifre çözülerek" belirir.
   - Rastgele parazit bantları; Carvis açıkken ekran kenarı nefes alır, konuşurken her kelimede nabız atar.
   - Açılışa radar taraması ve altıgen ızgara.
   Telemetrideki ✦ düğmesi: MAX ↔ NORMAL (NORMAL'de canvas, parazit, iz ve şifre çözme kapalı).
   Okuma görünümünde, 3B lab ekranlarında ve uygulama arkadayken canvas durur (pil). prefers-reduced-motion: hepsi kapalı. */
(function () {
  'use strict';
  var U = window.Uygulama; if (!U) return;
  if (/[?&]gomulu\b/.test(location.search)) return;
  if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var el = U.el, $ = U.$, $$ = U.$$, body = document.body, root = document.documentElement;

  var seviye = 'max'; try { seviye = localStorage.getItem('hx_seviye') || 'max'; } catch (e) {}
  function max() { return seviye === 'max'; }
  function sakin() { return body.classList.contains('fx-okuma') || /^#?lab-/.test(location.hash.slice(1)) || document.hidden; }

  var css = document.createElement('style');
  css.textContent = [
    '.hx-sahne{position:fixed;inset:0;width:100%;height:100%;z-index:0;pointer-events:none;mix-blend-mode:screen}',
    'body:not(.hx-max) .hx-sahne{display:none}',
    // tarama ışını geçişi
    '.hx-isin{position:fixed;left:0;right:0;top:0;height:3px;z-index:120;pointer-events:none;background:linear-gradient(90deg,transparent,#bff8ff 20%,#fff 50%,#bff8ff 80%,transparent);box-shadow:0 0 18px 4px rgba(94,231,255,.9),0 0 60px 14px rgba(94,231,255,.35);animation:hxIsin .6s cubic-bezier(.4,0,.2,1) forwards}',
    '.hx-isin::after{content:"";position:absolute;left:0;right:0;bottom:3px;height:120px;background:linear-gradient(0deg,rgba(94,231,255,.22),transparent)}',
    '@keyframes hxIsin{from{transform:translateY(60px);opacity:1}85%{opacity:1}to{transform:translateY(100vh);opacity:0}}',
    '#ana.hx-ayris{animation:hxAyris .45s ease-out}',
    '@keyframes hxAyris{0%{filter:drop-shadow(-6px 0 0 rgba(255,40,120,.75)) drop-shadow(6px 0 0 rgba(40,220,255,.75)) brightness(1.6);clip-path:inset(0 0 100% 0)}60%{filter:drop-shadow(-2px 0 0 rgba(255,40,120,.4)) drop-shadow(2px 0 0 rgba(40,220,255,.4));clip-path:inset(0 0 0 0)}100%{filter:none;clip-path:none}}',
    // parazit bandı
    '.hx-bant{position:fixed;left:0;right:0;z-index:110;pointer-events:none;backdrop-filter:hue-rotate(80deg) saturate(2.5) brightness(1.4);-webkit-backdrop-filter:hue-rotate(80deg) saturate(2.5) brightness(1.4);border-top:1px solid rgba(94,231,255,.6);border-bottom:1px solid rgba(255,60,140,.4);animation:hxBant .22s steps(3) forwards}',
    '@keyframes hxBant{0%{transform:translateX(-14px)}33%{transform:translateX(10px)}66%{transform:translateX(-5px)}100%{transform:none;opacity:0}}',
    // Carvis kenar ışığı + nabız
    '.hx-kenar{position:fixed;inset:0;z-index:57;pointer-events:none;opacity:0;transition:opacity .6s;box-shadow:inset 0 0 0 1px rgba(94,231,255,.35),inset 0 0 60px rgba(94,231,255,.28),inset 0 0 160px rgba(47,180,255,.16)}',
    'body.hx-carvis .hx-kenar{opacity:1;animation:hxNefes 3.2s ease-in-out infinite}',
    'body.hx-nabiz .hx-kenar{animation:none;opacity:1;box-shadow:inset 0 0 0 2px rgba(160,250,255,.75),inset 0 0 90px rgba(94,231,255,.5),inset 0 0 220px rgba(47,180,255,.28)}',
    'body.hx-nabiz .hud-kose{border-color:#dffcff;filter:drop-shadow(0 0 10px #5ee7ff)}',
    'body.hx-nabiz .serit::after{animation-duration:.8s}',
    '@keyframes hxNefes{50%{opacity:.45}}',
    // kartlara basınca yankı halkası
    'body.hx-max .hx-egim:active{box-shadow:0 0 0 1px #9ff6ff,0 0 30px rgba(94,231,255,.7)!important}',
    // açılış: radar + altıgen
    '.hx-acilis::before{content:"";position:absolute;inset:0;opacity:.25;background-image:linear-gradient(30deg,rgba(94,231,255,.25) 1px,transparent 1px),linear-gradient(150deg,rgba(94,231,255,.25) 1px,transparent 1px),linear-gradient(90deg,rgba(94,231,255,.18) 1px,transparent 1px);background-size:34px 60px;-webkit-mask-image:radial-gradient(circle,#000,transparent 65%);mask-image:radial-gradient(circle,#000,transparent 65%)}',
    '.hx-acilis::after{content:"";position:absolute;left:50%;top:50%;width:min(80vmin,560px);aspect-ratio:1;border-radius:50%;transform:translate(-50%,-50%);background:conic-gradient(from 0deg,rgba(94,231,255,.5),rgba(94,231,255,0) 22%,transparent);animation:hxRadar 1.6s linear infinite;-webkit-mask-image:radial-gradient(circle,transparent 30%,#000 31%);mask-image:radial-gradient(circle,transparent 30%,#000 31%)}',
    '@keyframes hxRadar{to{transform:translate(-50%,-50%) rotate(360deg)}}',
    '.hx-seviye{background:none;border:0;color:var(--holo,#5ee7ff);font:600 11px var(--f-kod);letter-spacing:.12em;cursor:pointer;padding:0 2px;text-shadow:0 0 8px currentColor}'
  ].join('\n');
  document.head.appendChild(css);

  var kenar = el('div', { class: 'hx-kenar', 'aria-hidden': 'true' }); body.appendChild(kenar);

  /* ---------------- MAX/NORMAL düğmesi ---------------- */
  var tel = $('.hud-tel');
  var svDug = el('button', { class: 'hx-seviye', type: 'button', title: 'Efekt seviyesi (pil için NORMAL)' });
  function seviyeUygula() { body.classList.toggle('hx-max', max()); svDug.textContent = max() ? '✦ MAX' : '✧ NORMAL'; try { localStorage.setItem('hx_seviye', seviye); } catch (e) {} if (max()) basla(); }
  svDug.addEventListener('click', function () { seviye = max() ? 'normal' : 'max'; seviyeUygula(); if (window.HoloSes) window.HoloSes('sec'); });
  if (tel) tel.prepend(svDug);

  /* ---------------- 3B hologram sahnesi ---------------- */
  var cv = el('canvas', { class: 'hx-sahne', 'aria-hidden': 'true' });
  var arka = $('#fxArka'); if (arka) arka.after(cv); else body.prepend(cv);
  var ctx = cv.getContext('2d'), W = 0, H = 0, DPR = 1, calisiyor = false, son = 0, t0 = performance.now();
  function boyut() { DPR = Math.min(window.devicePixelRatio || 1, 1.5); W = innerWidth; H = innerHeight; cv.width = W * DPR; cv.height = H * DPR; ctx.setTransform(DPR, 0, 0, DPR, 0, 0); }
  addEventListener('resize', boyut); boyut();
  function egim() { var s = getComputedStyle(root); return { x: +s.getPropertyValue('--hx') || 0, y: +s.getPropertyValue('--hy') || 0 }; }
  var eg = { x: 0, y: 0 }, egT = 0;

  function sarmal(cx, ust, boy, t, R, yon) {
    var N = Math.max(24, Math.round(boy / 16)), adim = boy / N;
    for (var i = 0; i < N; i++) {
      var y = ust + i * adim, a = i * 0.36 + t * yon;
      var c = Math.cos(a), s = Math.sin(a);
      var x1 = cx + c * R + eg.x * 14 * (1 + s), x2 = cx - c * R + eg.x * 14 * (1 - s);
      var d1 = (s + 1) / 2, d2 = (1 - s) / 2; // derinlik 0 (arka) … 1 (ön)
      var kenarSon = Math.min(1, i / 5, (N - 1 - i) / 5);
      if (i % 2 === 0) { // basamak (baz çifti)
        var g = ctx.createLinearGradient(x1, y, x2, y);
        g.addColorStop(0, 'rgba(94,231,255,' + (0.06 + 0.22 * d1) * kenarSon + ')'); g.addColorStop(1, 'rgba(160,120,255,' + (0.06 + 0.22 * d2) * kenarSon + ')');
        ctx.strokeStyle = g; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(x1, y); ctx.lineTo(x2, y); ctx.stroke();
      }
      nokta(x1, y, 1 + d1 * 2.2, 'rgba(120,240,255,', (0.2 + 0.7 * d1) * kenarSon);
      nokta(x2, y, 1 + d2 * 2.2, 'rgba(190,150,255,', (0.2 + 0.7 * d2) * kenarSon);
    }
  }
  function nokta(x, y, r, renk, a) {
    ctx.fillStyle = renk + (a * 0.18) + ')'; ctx.beginPath(); ctx.arc(x, y, r * 3.2, 0, 6.2832); ctx.fill();
    ctx.fillStyle = renk + a + ')'; ctx.beginPath(); ctx.arc(x, y, r, 0, 6.2832); ctx.fill();
  }
  // Merkez: projektör ışığında yükselen toz
  var toz = [], merkezKutu = null, kutuT = 0;
  function tozCiz(dt) {
    if (!body.classList.contains('hx-merkez')) { toz.length = 0; return; }
    if (performance.now() - kutuT > 1000) { kutuT = performance.now(); var m = $('.merkez'); merkezKutu = m ? m.getBoundingClientRect() : null; }
    if (!merkezKutu) return;
    var cx = merkezKutu.left + merkezKutu.width / 2, alt = merkezKutu.bottom, boy = merkezKutu.height * 0.7;
    while (toz.length < 70) toz.push({ y: Math.random(), o: (Math.random() - 0.5), h: 0.04 + Math.random() * 0.08, r: 0.6 + Math.random() * 1.6 });
    toz.forEach(function (p) {
      p.y += p.h * dt; if (p.y > 1) { p.y = 0; p.o = Math.random() - 0.5; }
      var gen = merkezKutu.width * 0.06 + p.y * merkezKutu.width * 0.5; // koni genişler
      nokta(cx + p.o * gen, alt - p.y * boy, p.r, 'rgba(170,245,255,', 0.55 * Math.sin(p.y * Math.PI));
    });
  }
  // parmak izi
  var iz = [];
  addEventListener('pointermove', function (e) { if (!max() || sakin() || (e.pointerType === 'mouse' && !e.buttons)) return; for (var k = 0; k < 2; k++) iz.push({ x: e.clientX + (Math.random() - 0.5) * 8, y: e.clientY + (Math.random() - 0.5) * 8, vx: (Math.random() - 0.5) * 30, vy: -10 - Math.random() * 30, o: 1 }); if (iz.length > 120) iz.splice(0, iz.length - 120); }, { passive: true });
  function izCiz(dt) { iz = iz.filter(function (p) { p.o -= dt * 1.4; p.x += p.vx * dt; p.y += p.vy * dt; if (p.o <= 0) return false; nokta(p.x, p.y, 1.4, 'rgba(160,250,255,', p.o * 0.9); return true; }); }

  function kare(simdi) {
    if (!calisiyor) return;
    if (!max() || sakin()) { calisiyor = false; ctx.clearRect(0, 0, W, H); return; }
    requestAnimationFrame(kare);
    if (simdi - son < 33) return; // ~30 fps
    var dt = Math.min(0.1, (simdi - son) / 1000); son = simdi;
    if (simdi - egT > 200) { egT = simdi; eg = egim(); }
    var t = (simdi - t0) / 1000;
    ctx.clearRect(0, 0, W, H);
    ctx.globalCompositeOperation = 'lighter';
    if (W >= 700) {
      var R = Math.min(46, W * 0.035), ust = 90 + eg.y * 10, boy = H - 140;
      sarmal(Math.max(48, W * 0.045), ust, boy, t * 0.9, R, 1);
      sarmal(W - Math.max(48, W * 0.045), ust + 30, boy - 30, t * 0.75 + 2, R * 0.85, -1);
    }
    tozCiz(dt); izCiz(dt);
    ctx.globalCompositeOperation = 'source-over';
  }
  function basla() { if (calisiyor || !max() || sakin()) return; calisiyor = true; son = 0; requestAnimationFrame(kare); }
  document.addEventListener('visibilitychange', basla);

  /* ---------------- geçiş: tarama ışını + şifre çözme ---------------- */
  var ana = $('#ana');
  var HARF = 'ABCDEFGHIJKLMNOPRSTUVYZ0123456789#%&@<>/\\=+';
  function sifreCoz(h) {
    var dugum = null; for (var i = 0; i < h.childNodes.length; i++) if (h.childNodes[i].nodeType === 3 && h.childNodes[i].nodeValue.trim()) { dugum = h.childNodes[i]; break; }
    if (!dugum || dugum.__cozuluyor) return;
    var hedef = dugum.nodeValue, n = hedef.length, bas = performance.now(), sure = 520 + n * 18;
    dugum.__cozuluyor = true;
    (function adim(s) {
      var o = Math.min(1, (s - bas) / sure), cozulen = Math.floor(o * n), m = '';
      for (var k = 0; k < n; k++) m += k < cozulen || hedef[k] === ' ' ? hedef[k] : HARF[Math.random() * HARF.length | 0];
      if (dugum.parentNode !== h) { dugum.nodeValue = hedef; return; } // başka bir modül başlığı yeniden yazdıysa bırak
      dugum.nodeValue = m;
      if (o < 1) requestAnimationFrame(adim); else { dugum.nodeValue = hedef; dugum.__cozuluyor = false; }
    })(bas);
  }
  function gecis() {
    if (!max() || sakin()) return;
    var isin = el('div', { class: 'hx-isin', 'aria-hidden': 'true' }); body.appendChild(isin); setTimeout(function () { isin.remove(); }, 700);
    if (ana) { ana.classList.remove('hx-ayris'); void ana.offsetWidth; ana.classList.add('hx-ayris'); }
    // app19 başlıktaki emojiyi 350 ms'de ayrı span'e alıyor (metni yeniden yazarak); ondan sonra başla
    setTimeout(function () { var h = $('.kahraman h1'); if (h) sifreCoz(h); }, 420);
  }
  addEventListener('hashchange', function () { setTimeout(gecis, 0); setTimeout(basla, 50); });

  /* ---------------- parazit bantları ---------------- */
  (function zamanla() {
    setTimeout(function () {
      if (max() && !sakin()) {
        var h = 6 + Math.random() * 26, b = el('div', { class: 'hx-bant', 'aria-hidden': 'true', style: 'top:' + (8 + Math.random() * 84) + '%;height:' + h + 'px' });
        body.appendChild(b); setTimeout(function () { b.remove(); }, 260);
        if (Math.random() < 0.35) setTimeout(function () { var b2 = el('div', { class: 'hx-bant', style: 'top:' + (8 + Math.random() * 84) + '%;height:' + (3 + Math.random() * 8) + 'px' }); body.appendChild(b2); setTimeout(function () { b2.remove(); }, 260); }, 90);
      }
      zamanla();
    }, 5000 + Math.random() * 9000);
  })();

  /* ---------------- Carvis: kenar ışığı + kelime nabzı ---------------- */
  var nabizZ = null;
  function nabiz() { if (!max()) return; body.classList.add('hx-nabiz'); clearTimeout(nabizZ); nabizZ = setTimeout(function () { body.classList.remove('hx-nabiz'); }, 120); }
  if (window.Holo && window.Holo.kelime) { var eskiK = window.Holo.kelime; window.Holo.kelime = function () { nabiz(); return eskiK.apply(this, arguments); }; }
  setInterval(function () { var c = window.Carvis; body.classList.toggle('hx-carvis', !!(c && c.acik) && max()); if (c && c.konusuyor && max() && Math.random() < 0.5) nabiz(); }, 260);

  seviyeUygula();
})();
