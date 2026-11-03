/* 1001 — Jarvis görünümü (kullanıcı, 2026-11-03: "dizaynı bunla birebir aynı olsun, 3 boyutlu holografik hali ve o jarvis
   şeyinin dalgalanmasını istiyorum" — iki görsel: ortada tel kafes küre + dalgalanan parçacık şeritleri; HUD panolu Jarvis ekranı).
   1) JarvisKure: canvas'ta dönen 3B tel kafes küre (ikosfer), dönen ince halkalar ve Carvis'in durumuna göre dalgalanan şeritler.
      Enerji: boşta yavaş nefes, dinlerken dalgalı, düşünürken hızlı dönüş, konuşurken hece ritminde titreşim.
   2) Carvis düğmesi küçük küre olur; Carvis açıkken ekranın altında büyük küre belirir.
   3) Merkez sayfasının başında Jarvis panosu: sol (sistem durumu, ortam, sıradaki iş, ses asistanı), orta (saat + hedef
      dürbünü içinde küre), sağ (görevler, bugünkü hedef göstergesi, açık kitap), altta hızlı erişim yuvası. Yan sütunlar 3B eğik. */
(function () {
  'use strict';
  if (/[?&]gomulu\b/.test(location.search)) return;
  var U = window.Uygulama; if (!U) return;
  var el = U.el, $ = U.$;
  var AZ_HAREKET = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------- Carvis durumu → enerji ---------------- */
  function cvDurum() {
    var c = window.Carvis;
    if (!c || !c.acik) return 'bosta';
    if (c.konusuyor) return 'konusuyor';
    var d = (document.querySelector('.cv-durum') || {}).textContent || '';
    if (/Düşünüyor|hazırlanıyor|aranıyor/i.test(d)) return 'dusunuyor';
    return 'dinliyor';
  }
  var Enerji = { v: 0.2, hedef: 0.2, hiz: 1, durum: 'bosta', hece: 0 };
  function enerjiGuncelle(t) {
    var d = cvDurum(); Enerji.durum = d;
    if (d === 'konusuyor') {
      // hece ritmi: 4-6 Hz'lik zarf + rastgele vurgu
      Enerji.hece = 0.5 + 0.5 * Math.sin(t * 0.0285) * Math.sin(t * 0.0091 + 1.3);
      Enerji.hedef = 0.55 + 0.45 * Math.abs(Enerji.hece);
      Enerji.hiz = 1.6;
    } else if (d === 'dinliyor') { Enerji.hedef = 0.5 + 0.1 * Math.sin(t * 0.004); Enerji.hiz = 1.2; }
    else if (d === 'dusunuyor') { Enerji.hedef = 0.4; Enerji.hiz = 2.6; }
    else { Enerji.hedef = 0.18 + 0.05 * Math.sin(t * 0.0012); Enerji.hiz = 0.7; }
    Enerji.v += (Enerji.hedef - Enerji.v) * 0.08;
  }

  /* ---------------- ikosfer ---------------- */
  function ikosfer(bolme) {
    var p = (1 + Math.sqrt(5)) / 2;
    var v = [[-1, p, 0], [1, p, 0], [-1, -p, 0], [1, -p, 0], [0, -1, p], [0, 1, p], [0, -1, -p], [0, 1, -p], [p, 0, -1], [p, 0, 1], [-p, 0, -1], [-p, 0, 1]];
    var f = [[0, 11, 5], [0, 5, 1], [0, 1, 7], [0, 7, 10], [0, 10, 11], [1, 5, 9], [5, 11, 4], [11, 10, 2], [10, 7, 6], [7, 1, 8], [3, 9, 4], [3, 4, 2], [3, 2, 6], [3, 6, 8], [3, 8, 9], [4, 9, 5], [2, 4, 11], [6, 2, 10], [8, 6, 7], [9, 8, 1]];
    function nor(a) { var l = Math.hypot(a[0], a[1], a[2]); return [a[0] / l, a[1] / l, a[2] / l]; }
    v = v.map(nor);
    for (var b = 0; b < bolme; b++) {
      var orta = {}, yeni = [];
      var m = function (i, j) { var k = i < j ? i + '_' + j : j + '_' + i; if (orta[k] == null) { v.push(nor([(v[i][0] + v[j][0]) / 2, (v[i][1] + v[j][1]) / 2, (v[i][2] + v[j][2]) / 2])); orta[k] = v.length - 1; } return orta[k]; };
      f.forEach(function (t) { var a = m(t[0], t[1]), c = m(t[1], t[2]), d = m(t[2], t[0]); yeni.push([t[0], a, d], [t[1], c, a], [t[2], d, c], [a, c, d]); });
      f = yeni;
    }
    var kenar = {}, ke = [];
    f.forEach(function (t) { [[t[0], t[1]], [t[1], t[2]], [t[2], t[0]]].forEach(function (e) { var k = e[0] < e[1] ? e[0] + '_' + e[1] : e[1] + '_' + e[0]; if (!kenar[k]) { kenar[k] = 1; ke.push(e); } }); });
    return { v: v, e: ke };
  }
  var IKO = ikosfer(2);

  /* ---------------- küre çizici ---------------- */
  function JarvisKure(cv, o) {
    o = o || {};
    var ctx = cv.getContext('2d'), w = 0, h = 0, dpr = 1, gorunur = true, oz = this;
    var serit = o.serit != null ? o.serit : 3, iplik = o.iplik != null ? o.iplik : 7, nokta = o.nokta != null ? o.nokta : 160;
    var tohum = [Math.random() * 10, Math.random() * 10, Math.random() * 10, Math.random() * 10];
    function boyut() {
      var r = cv.getBoundingClientRect(); dpr = Math.min(o.kucuk ? 2 : 1.5, window.devicePixelRatio || 1);
      w = Math.max(1, Math.round(r.width * dpr)); h = Math.max(1, Math.round(r.height * dpr));
      if (cv.width !== w || cv.height !== h) { cv.width = w; cv.height = h; }
    }
    this.boyut = boyut;
    if (window.IntersectionObserver) new IntersectionObserver(function (l) { gorunur = l[0].isIntersecting; }).observe(cv);
    this.ciz = function (t) {
      if (!gorunur || !cv.isConnected || (o.kosul && !o.kosul())) return;
      if (!w) boyut();
      var R = Math.min(w, h) / 2, cx = w / 2, cy = h / 2, E = Enerji.v, zs = t * 0.001 * Enerji.hiz;
      ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = 'lighter';
      // iç ışıma
      var g = ctx.createRadialGradient(cx, cy, 0, cx, cy, R * 0.42);
      g.addColorStop(0, 'rgba(80,240,220,' + (0.10 + 0.18 * E) + ')'); g.addColorStop(1, 'rgba(80,240,220,0)');
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, R * 0.42, 0, Math.PI * 2); ctx.fill();
      // tel kafes küre
      var r0 = R * (o.kucuk ? 0.34 : 0.23) * (1 + 0.04 * E), ay = zs * 0.6, ax = 0.45 + 0.15 * Math.sin(zs * 0.3);
      var sy = Math.sin(ay), cyy = Math.cos(ay), sx = Math.sin(ax), cxx = Math.cos(ax), P = [];
      for (var i = 0; i < IKO.v.length; i++) {
        var p = IKO.v[i], x = p[0] * cyy + p[2] * sy, z = -p[0] * sy + p[2] * cyy, y = p[1] * cxx - z * sx; z = p[1] * sx + z * cxx;
        var k = 3.2 / (3.2 - z); P.push([cx + x * r0 * k, cy + y * r0 * k, z]);
      }
      ctx.lineWidth = Math.max(0.6, dpr * 0.7);
      ctx.strokeStyle = 'rgba(120,255,235,' + (0.16 + 0.2 * E) + ')'; ctx.beginPath();
      IKO.e.forEach(function (e) { var a = P[e[0]], b = P[e[1]]; if (a[2] + b[2] < -0.6) return; ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); }); ctx.stroke();
      ctx.strokeStyle = 'rgba(120,255,235,0.07)'; ctx.beginPath();
      IKO.e.forEach(function (e) { var a = P[e[0]], b = P[e[1]]; if (a[2] + b[2] >= -0.6) return; ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); }); ctx.stroke();
      ctx.fillStyle = 'rgba(190,255,245,' + (0.5 + 0.4 * E) + ')';
      P.forEach(function (q) { if (q[2] > -0.2) { ctx.fillRect(q[0] - dpr * 0.8, q[1] - dpr * 0.8, dpr * 1.6, dpr * 1.6); } });
      if (o.kucuk) { ctx.globalCompositeOperation = 'source-over'; return halkaKucuk(R, cx, cy, E, zs); }
      // ince dönen halkalar (tik işaretli)
      [[0.31, 1, 64, 0.35], [0.355, -0.6, 120, 0.22], [0.40, 0.3, 4, 0.18]].forEach(function (hk, j) {
        var rr = R * hk[0], dn = zs * hk[1]; ctx.strokeStyle = 'rgba(110,240,255,' + (hk[3] + 0.15 * E) + ')'; ctx.lineWidth = dpr * (j === 2 ? 1.6 : 1);
        ctx.beginPath();
        for (var s = 0; s < hk[2]; s++) { var a0 = dn + s / hk[2] * Math.PI * 2, a1 = a0 + (j === 2 ? 0.9 : Math.PI / hk[2]); ctx.moveTo(cx + Math.cos(a0) * rr, cy + Math.sin(a0) * rr); ctx.arc(cx, cy, rr, a0, a1); }
        ctx.stroke();
      });
      // dalgalanan parçacık şeritleri
      for (var sr = 0; sr < serit; sr++) {
        var taban = R * (0.66 + sr * 0.075), genlik = R * (0.035 + 0.11 * E) * (1 - sr * 0.18);
        for (var ip = 0; ip < iplik; ip++) {
          var kay = (ip - (iplik - 1) / 2) / iplik;
          var parlak = ip === (iplik >> 1);
          ctx.strokeStyle = 'rgba(' + (sr === 1 ? '110,220,255' : '90,245,215') + ',' + (parlak ? 0.09 : (0.17 + 0.2 * E)) + ')';
          ctx.lineWidth = dpr * (parlak ? 7 : 0.9); ctx.beginPath();
          for (var n = 0; n <= nokta; n++) {
            var th = n / nokta * Math.PI * 2;
            var d = Math.sin(th * 3 + zs * 1.3 + tohum[sr]) * 0.55 + Math.sin(th * 5 - zs * 0.9 + tohum[sr + 1]) * 0.3 + Math.sin(th * 2 + zs * 0.5) * 0.35 + (Enerji.durum === 'konusuyor' ? Math.sin(th * 9 + zs * 6) * 0.25 * Enerji.hece : 0);
            var bur = Math.sin(th * 2 + zs * 0.7 + sr) * 0.5 + 0.5;
            var rr2 = taban + genlik * d + kay * R * 0.05 * (0.4 + bur);
            var x2 = cx + Math.cos(th) * rr2, y2 = cy + Math.sin(th) * rr2 * (o.basik || 1);
            if (n === 0) ctx.moveTo(x2, y2); else ctx.lineTo(x2, y2);
          }
          ctx.stroke();
        }
        // parıltılar
        ctx.fillStyle = 'rgba(200,255,245,' + (0.35 + 0.4 * E) + ')';
        for (var q2 = 0; q2 < 70; q2++) {
          var th2 = (q2 / 70) * Math.PI * 2 + zs * 0.2 * (sr % 2 ? -1 : 1), d2 = Math.sin(th2 * 3 + zs * 1.3 + tohum[sr]) * 0.55 + Math.sin(th2 * 5 - zs * 0.9 + tohum[sr + 1]) * 0.3 + Math.sin(th2 * 2 + zs * 0.5) * 0.35;
          var jit = Math.sin(q2 * 12.9898 + zs * 3) * R * 0.025, rr3 = taban + genlik * d2 + jit;
          ctx.fillRect(cx + Math.cos(th2) * rr3, cy + Math.sin(th2) * rr3 * (o.basik || 1), dpr * 1.3, dpr * 1.3);
        }
      }
      ctx.globalCompositeOperation = 'source-over';
    };
    function halkaKucuk(R, cx, cy, E, zs) {
      ctx.globalCompositeOperation = 'lighter';
      for (var ip = 0; ip < 3; ip++) {
        ctx.strokeStyle = 'rgba(90,245,215,' + (0.25 + 0.35 * E) + ')'; ctx.lineWidth = dpr; ctx.beginPath();
        for (var n = 0; n <= 90; n++) { var th = n / 90 * Math.PI * 2, d = Math.sin(th * 3 + zs * 1.5 + ip) * 0.6 + Math.sin(th * 5 - zs + ip * 2) * 0.4, rr = R * (0.72 + ip * 0.07) + R * (0.03 + 0.1 * E) * d; if (n) ctx.lineTo(cx + Math.cos(th) * rr, cy + Math.sin(th) * rr); else ctx.moveTo(cx + Math.cos(th) * rr, cy + Math.sin(th) * rr); }
        ctx.stroke();
      }
      ctx.globalCompositeOperation = 'source-over';
    }
    window.addEventListener('resize', function () { w = 0; });
    Kureler.push(this);
  }
  var Kureler = [];
  var sonT = 0;
  function dongu(t) {
    requestAnimationFrame(dongu);
    if (document.hidden) return;
    // okuma modunda ve hareket azaltılmışken saniyede ~12 kare, normalde ~40 kare (pil/kasma için)
    var aralik = AZ_HAREKET || document.body.classList.contains('fx-okuma') ? 80 : 24;
    if (t - sonT < aralik) return; sonT = t;
    enerjiGuncelle(t);
    Kureler = Kureler.filter(function (k) { return true; });
    for (var i = 0; i < Kureler.length; i++) Kureler[i].ciz(t);
    Dalga.forEach(function (f) { f(t); });
  }
  var Dalga = [];
  requestAnimationFrame(dongu);
  window.JarvisKure = JarvisKure;

  /* ---------------- stiller ---------------- */
  var st = document.createElement('style');
  st.textContent = [
    ':root{--jv:#5ef0dc;--jv2:#46c8ff;--jv-cam:rgba(4,22,30,.62);--jv-kenar:rgba(94,240,220,.42)}',
    /* Carvis düğmesi: küçük küre */
    '#carvisDug.jv-dug{background:radial-gradient(circle,rgba(20,60,64,.9),rgba(3,12,16,.95) 70%)!important;overflow:visible}',
    '#carvisDug.jv-dug>canvas{position:absolute;inset:-14px;width:calc(100% + 28px);height:calc(100% + 28px);pointer-events:none}',
    '#carvisDug.jv-dug>.jv-dug-ikon{opacity:0}',
    /* büyük küre (Carvis açıkken) */
    '.jv-buyuk{position:fixed;left:50%;bottom:calc(10px + env(safe-area-inset-bottom,0px));width:min(46vmin,340px);height:min(46vmin,340px);transform:translateX(-50%) scale(.6);opacity:0;pointer-events:none;z-index:55;transition:opacity .45s,transform .45s cubic-bezier(.2,.9,.2,1.2)}',
    '.jv-buyuk.acik{opacity:1;transform:translateX(-50%) scale(1)}',
    '.jv-buyuk canvas{width:100%;height:100%}',
    'body.jv-merkez .jv-buyuk{display:none}',
    /* pano */
    '.jv-pano{position:relative;display:grid;grid-template-columns:minmax(220px,1fr) minmax(320px,1.35fr) minmax(220px,1fr);grid-template-rows:auto 1fr auto;gap:14px;perspective:1600px;margin:4px 0 18px;padding:12px;min-height:min(78vh,760px);',
    'background:radial-gradient(ellipse at 50% 45%,rgba(30,120,130,.18),transparent 60%),linear-gradient(rgba(94,240,220,.05) 1px,transparent 1px) 0 0/100% 32px,linear-gradient(90deg,rgba(94,240,220,.05) 1px,transparent 1px) 0 0/32px 100%;border:1px solid rgba(94,240,220,.18);border-radius:4px;overflow:hidden}',
    '.jv-pano::after{content:"";position:absolute;inset:0;pointer-events:none;background:repeating-linear-gradient(0deg,rgba(255,255,255,.025) 0 1px,transparent 1px 3px);mix-blend-mode:screen}',
    '.jv-ust{grid-column:1/-1;display:flex;align-items:center;justify-content:center;gap:16px;position:relative}',
    '.jv-ust::before,.jv-ust::after{content:"";flex:1;height:1px;background:linear-gradient(90deg,transparent,var(--jv-kenar),transparent)}',
    '.jv-baslik{font:600 15px/1 var(--mono,monospace);letter-spacing:.5em;color:var(--jv);text-shadow:0 0 12px var(--jv);padding:6px 18px;border:1px solid var(--jv-kenar);clip-path:polygon(12px 0,calc(100% - 12px) 0,100% 50%,calc(100% - 12px) 100%,12px 100%,0 50%);background:rgba(4,22,30,.7)}',
    '.jv-sol,.jv-sag{display:flex;flex-direction:column;gap:12px;transform-style:preserve-3d;animation:jvYuz 7s ease-in-out infinite}',
    '.jv-sol{transform:rotateY(14deg) translateZ(-10px);transform-origin:right center}',
    '.jv-sag{transform:rotateY(-14deg) translateZ(-10px);transform-origin:left center;animation-delay:-3.5s}',
    '@keyframes jvYuz{0%,100%{translate:0 0}50%{translate:0 -5px}}',
    '.jv-panel{position:relative;background:var(--jv-cam);border:1px solid var(--jv-kenar);padding:10px 12px 12px;backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);',
    'clip-path:polygon(0 10px,10px 0,calc(100% - 22px) 0,100% 22px,100% 100%,22px 100%,0 calc(100% - 22px));box-shadow:inset 0 0 24px rgba(94,240,220,.08),0 0 18px rgba(70,200,255,.08)}',
    '.jv-panel::before{content:"";position:absolute;left:0;top:0;width:44px;height:2px;background:var(--jv);box-shadow:0 0 8px var(--jv)}',
    '.jv-panel h3{margin:0 0 8px;font:600 11px/1 var(--mono,monospace);letter-spacing:.22em;color:var(--jv);display:flex;align-items:center;gap:8px}',
    '.jv-panel h3::after{content:"";flex:1;height:1px;background:linear-gradient(90deg,var(--jv-kenar),transparent)}',
    '.jv-bar{display:grid;grid-template-columns:72px 1fr 48px;align-items:center;gap:8px;font:12px/1.6 var(--mono,monospace);color:#bfeff0}',
    '.jv-bar i{height:5px;background:rgba(94,240,220,.12);position:relative;overflow:hidden}',
    '.jv-bar i::after{content:"";position:absolute;inset:0;width:calc(var(--p,0) * 100%);background:linear-gradient(90deg,var(--jv2),var(--jv));box-shadow:0 0 8px var(--jv);transition:width .8s}',
    '.jv-bar b{text-align:right;color:var(--jv);font-weight:600}',
    '.jv-buyuk-yazi{font:300 30px/1 var(--mono,monospace);color:#e8fffb;text-shadow:0 0 14px rgba(94,240,220,.7)}',
    '.jv-kucuk{font:11px/1.5 var(--mono,monospace);color:#8fc9cc;letter-spacing:.08em}',
    '.jv-orta{position:relative;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px}',
    '.jv-saat{font:200 clamp(38px,5.4vw,64px)/1 var(--mono,monospace);color:#effffc;letter-spacing:.06em;text-shadow:0 0 18px rgba(94,240,220,.65)}',
    '.jv-tarih{font:12px/1 var(--mono,monospace);letter-spacing:.3em;color:var(--jv)}',
    '.jv-durbun{position:relative;width:min(100%,420px);aspect-ratio:1;margin-top:8px}',
    '.jv-durbun canvas{position:absolute;inset:0;width:100%;height:100%}',
    '.jv-durbun svg{position:absolute;inset:0;width:100%;height:100%;pointer-events:none}',
    '.jv-durbun button{position:absolute;inset:30%;border-radius:50%;background:transparent;border:0;cursor:pointer}',
    '.jv-hedef{font:11px/1.4 var(--mono,monospace);letter-spacing:.2em;color:var(--jv);text-align:center}',
    '.jv-hedef b{display:block;color:#e8fffb;letter-spacing:.06em;font-size:13px;margin-top:2px}',
    '.jv-gorev{list-style:none;margin:0;padding:0;font:12.5px/1.45 var(--mono,monospace);color:#cdeff0}',
    '.jv-gorev li{display:flex;gap:8px;padding:4px 0;border-bottom:1px dashed rgba(94,240,220,.12);cursor:pointer}',
    '.jv-gorev li::before{content:"";flex:none;width:9px;height:9px;margin-top:5px;border:1px solid var(--jv);box-shadow:0 0 6px var(--jv)}',
    '.jv-gorev li:first-child::before{background:var(--jv)}',
    '.jv-gosterge{display:flex;align-items:center;gap:14px}',
    '.jv-gosterge svg{width:96px;height:96px;flex:none}',
    '.jv-dalga{height:46px;width:100%}',
    '.jv-ses{display:flex;align-items:center;gap:10px}',
    '.jv-ses button{flex:none;width:38px;height:38px;border-radius:50%;border:1px solid var(--jv);background:rgba(94,240,220,.1);color:var(--jv);box-shadow:0 0 12px rgba(94,240,220,.3)}',
    '.jv-yuva{grid-column:1/-1;display:flex;justify-content:center;gap:8px;flex-wrap:wrap}',
    '.jv-yuva button{min-width:96px;padding:9px 12px 7px;background:var(--jv-cam);border:1px solid var(--jv-kenar);color:#cdeff0;font:600 10.5px/1.3 var(--mono,monospace);letter-spacing:.18em;clip-path:polygon(10px 0,100% 0,100% calc(100% - 10px),calc(100% - 10px) 100%,0 100%,0 10px);display:flex;flex-direction:column;align-items:center;gap:4px}',
    '.jv-yuva button span{font-size:19px;color:var(--jv);text-shadow:0 0 10px var(--jv);letter-spacing:0}',
    '.jv-yuva button:hover,.jv-yuva button:focus-visible{background:rgba(94,240,220,.16);color:#fff}',
    '@media (max-width:900px){.jv-pano{grid-template-columns:1fr;min-height:0}.jv-sol,.jv-sag{transform:none;animation:none}.jv-orta{order:-1}}',
    '@media (prefers-reduced-motion: reduce){.jv-sol,.jv-sag{animation:none}}',
    'body.fx-okuma .jv-pano{display:none}',
    /* altyazı */
    '.holo .h-altyazi{display:none!important}',
    '.jv-altyazi{position:fixed;left:50%;bottom:calc(min(46vmin,340px) + 14px + env(safe-area-inset-bottom,0px));transform:translate(-50%,14px);width:min(860px,calc(100vw - 32px));z-index:950;pointer-events:none;opacity:0;transition:opacity .35s,transform .35s}',
    '.jv-altyazi.acik{opacity:1;transform:translate(-50%,0)}',
    'body.jv-merkez .jv-altyazi{bottom:calc(24px + env(safe-area-inset-bottom,0px))}',
    '.jv-ay-ic{position:relative;padding:12px 22px 14px;text-align:center;font:500 clamp(16px,2.1vw,21px)/1.5 var(--f-govde,system-ui);letter-spacing:.01em;color:rgba(214,250,246,.42);',
    'background:linear-gradient(180deg,rgba(6,28,34,.78),rgba(3,14,18,.86));border:1px solid rgba(94,240,220,.32);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);',
    'clip-path:polygon(14px 0,calc(100% - 14px) 0,100% 14px,100% calc(100% - 14px),calc(100% - 14px) 100%,14px 100%,0 calc(100% - 14px),0 14px);box-shadow:inset 0 0 30px rgba(94,240,220,.08)}',
    '.jv-ay-ic::before,.jv-ay-ic::after{content:"";position:absolute;top:50%;width:26px;height:1px;background:var(--jv);box-shadow:0 0 8px var(--jv)}',
    '.jv-ay-ic::before{left:-1px}.jv-ay-ic::after{right:-1px}',
    '.jv-ay-ic.gir{animation:jvAyGir .45s ease-out}',
    '@keyframes jvAyGir{from{filter:blur(4px);opacity:.3;letter-spacing:.06em}to{filter:none;opacity:1;letter-spacing:.01em}}',
    '.jv-ay-ic span{transition:color .18s,text-shadow .18s}',
    '.jv-ay-ic span.soy{color:#e9fffb}',
    '.jv-ay-ic span.simdi{color:#7dfbe6;text-shadow:0 0 12px rgba(94,240,220,.9),0 0 2px #fff}',
    '@media (prefers-reduced-motion: reduce){.jv-ay-ic.gir{animation:none}}',
    /* ---- genel HUD görünümü (kullanıcı: "uygulama word dosyası gibi görünüyor", "dna zincirleri iyi görünmüyor") ---- */
    '.hx-akis,.fx-hud{display:none!important}',
    '#ana .sayfa > .kahraman{display:flex!important;flex-wrap:wrap;align-items:center;gap:6px 14px;min-height:0!important;padding:9px 16px 9px 18px!important;margin:0 0 16px!important;background:linear-gradient(90deg,rgba(94,240,220,.10),rgba(4,22,30,.55) 40%,rgba(4,22,30,.2));border:1px solid var(--jv-kenar);border-left:3px solid var(--jv);clip-path:polygon(0 0,calc(100% - 18px) 0,100% 18px,100% 100%,0 100%)}',
    '#ana .sayfa > .kahraman h1{font:600 14px/1.2 var(--f-kod,monospace)!important;letter-spacing:.32em!important;text-transform:uppercase;color:var(--jv)!important;background:none!important;-webkit-text-fill-color:currentColor!important;text-shadow:0 0 10px rgba(94,240,220,.55)!important;animation:none!important;margin:0!important}',
    '#ana .sayfa > .kahraman .ust-etiket{order:2;font:11px/1 var(--f-kod,monospace);letter-spacing:.14em;color:#7fb9bd;text-transform:uppercase}',
    '#ana .sayfa > .kahraman .ust-etiket::before,#ana .sayfa > .kahraman .ust-etiket::after{content:none!important}',
    '#ana .sayfa > .kahraman > p{order:3;flex-basis:100%;font:12px/1.5 var(--f-kod,monospace)!important;color:#7fa9ad!important;letter-spacing:.03em;max-width:none!important}',
    '#ana .sayfa h2{font-family:var(--f-kod,monospace);letter-spacing:.18em;text-transform:uppercase;font-size:13px;color:var(--jv);text-shadow:0 0 8px rgba(94,240,220,.4)}',
    '.kitap-kart,.tarih-kart,.analiz-kutu,.metin-kart,.sp-kutu,.oncelik-satir,.an-oneri{border-radius:0!important;border:1px solid var(--jv-kenar)!important;background:linear-gradient(180deg,rgba(6,28,36,.62),rgba(3,14,20,.7))!important;box-shadow:inset 0 0 22px rgba(94,240,220,.06)!important;clip-path:polygon(0 8px,8px 0,calc(100% - 16px) 0,100% 16px,100% 100%,16px 100%,0 calc(100% - 16px));position:relative}',
    '.kitap-kart::before,.tarih-kart::before,.analiz-kutu::before,.metin-kart::before,.sp-kutu::before{content:"";position:absolute;left:0;top:0;width:40px;height:2px;background:var(--jv);box-shadow:0 0 8px var(--jv);pointer-events:none}',
    '.dugme{border-radius:0!important;clip-path:polygon(6px 0,100% 0,100% calc(100% - 6px),calc(100% - 6px) 100%,0 100%,0 6px);letter-spacing:.04em}',
    '.cip{border-radius:0!important;clip-path:polygon(5px 0,100% 0,100% calc(100% - 5px),calc(100% - 5px) 100%,0 100%,0 5px)}',
    /* Carvis yan paneli */
    '.cv-balon.jv-balon{border-radius:0!important;border:1px solid var(--jv-kenar)!important;background:linear-gradient(180deg,rgba(5,26,32,.9),rgba(2,10,14,.94))!important;backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);box-shadow:0 0 0 1px rgba(94,240,220,.08),0 20px 60px rgba(0,0,0,.6),inset 0 0 40px rgba(94,240,220,.06)!important;clip-path:polygon(0 18px,18px 0,100% 0,100% calc(100% - 18px),calc(100% - 18px) 100%,0 100%)}',
    '.jv-balon::before{content:"";position:absolute;inset:0;pointer-events:none;background:repeating-linear-gradient(0deg,rgba(255,255,255,.02) 0 1px,transparent 1px 3px);z-index:0}',
    '.jv-balon>*{position:relative;z-index:1}',
    '.jv-balon .cv-ust{gap:10px!important;padding:10px 12px!important;border-bottom:1px solid rgba(94,240,220,.2)!important;background:linear-gradient(90deg,rgba(94,240,220,.12),transparent 70%)}',
    '.jv-balon .cv-ust b{font:600 13px/1 var(--f-kod,monospace)!important;letter-spacing:.32em!important;color:var(--jv)!important;text-shadow:0 0 10px rgba(94,240,220,.6)}',
    '.jv-balon .cv-durum{font:11px/1.3 var(--f-kod,monospace)!important;letter-spacing:.12em;text-transform:uppercase;color:#8fd8d0!important}',
    '.jv-balon-kure{width:34px;height:34px;flex:none;margin:-4px 0}',
    '.jv-balon button[data-jv]{display:inline-flex;align-items:center;gap:6px;height:32px;min-width:32px;padding:0 8px;background:rgba(94,240,220,.06)!important;border:1px solid rgba(94,240,220,.35)!important;color:var(--jv)!important;border-radius:0!important;font:600 10px/1 var(--f-kod,monospace);letter-spacing:.16em;clip-path:polygon(6px 0,100% 0,100% calc(100% - 6px),calc(100% - 6px) 100%,0 100%,0 6px);transition:background .2s,box-shadow .2s}',
    '.jv-balon button[data-jv] svg{width:17px;height:17px;flex:none}',
    '.jv-balon button[data-jv]:hover,.jv-balon button[data-jv]:focus-visible{background:rgba(94,240,220,.18)!important;box-shadow:0 0 14px rgba(94,240,220,.35)}',
    '.jv-balon button[data-jv][aria-pressed=true]{background:rgba(94,240,220,.22)!important;color:#eafffb!important;box-shadow:inset 0 0 10px rgba(94,240,220,.4)}',
    '.jv-balon .cv-alt button[type=submit][data-jv]{background:linear-gradient(90deg,rgba(70,200,255,.35),rgba(94,240,220,.35))!important;color:#eafffb!important}',
    '.jv-balon .cv-akis{font-size:14px;line-height:1.55;scrollbar-width:thin;scrollbar-color:rgba(94,240,220,.4) transparent}',
    '.jv-balon .cv-ben{background:rgba(70,200,255,.1)!important;border:1px solid rgba(70,200,255,.3);border-radius:0!important;clip-path:polygon(8px 0,100% 0,100% 100%,0 100%,0 8px);font-size:13.5px}',
    '.jv-balon .cv-o{border-left:2px solid var(--jv)!important;padding:4px 0 4px 10px!important;background:linear-gradient(90deg,rgba(94,240,220,.06),transparent 60%)}',
    '.jv-balon .cv-alt{border-top:1px solid rgba(94,240,220,.2)!important;padding:10px 12px!important;gap:8px!important}',
    '.jv-balon .cv-alt input{border-radius:0!important;background:rgba(2,12,16,.8)!important;border:1px solid rgba(94,240,220,.3)!important;font:13px var(--f-kod,monospace)!important;letter-spacing:.03em;color:#dffbf7!important}',
    '.jv-balon .cv-alt input:focus{outline:none;border-color:var(--jv)!important;box-shadow:0 0 12px rgba(94,240,220,.3)}',
    /* Merkez'de eski başlık bloğu (Merkez yazısı, SYS etiketi, Ctrl+K açıklaması, MERKEZ halkası) gizli: pano kendi başlığını taşıyor */
    'body.jv-merkez #ana .sayfa > .kahraman{display:none!important}'
  ].join('\n');
  document.head.appendChild(st);

  /* ---------------- Carvis düğmesi + büyük küre ---------------- */
  function dugmeKur() {
    var d = $('#carvisDug'); if (!d || d.classList.contains('jv-dug')) return !!d;
    d.classList.add('jv-dug');
    Array.prototype.forEach.call(d.childNodes, function (n) { if (n.nodeType === 3) { var s = el('span', { class: 'jv-dug-ikon', text: n.textContent }); d.replaceChild(s, n); } });
    var c = el('canvas', { 'aria-hidden': 'true' }); d.appendChild(c);
    new JarvisKure(c, { kucuk: true, serit: 1, iplik: 3, nokta: 90 });
    var b = el('div', { class: 'jv-buyuk', 'aria-hidden': 'true' }, [el('canvas')]); document.body.appendChild(b);
    new JarvisKure(b.firstChild, { serit: 3, iplik: 6, nokta: 150, kosul: function () { return b.classList.contains('acik') && !document.body.classList.contains('jv-merkez'); } });
    setInterval(function () { b.classList.toggle('acik', !!(window.Carvis && window.Carvis.acik)); }, 250);
    return true;
  }
  if (!dugmeKur()) { var dn = 0, z = setInterval(function () { if (dugmeKur() || ++dn > 40) clearInterval(z); }, 250); }

  /* ---------------- altyazı (kullanıcı: "altyazılar biraz daha şıklaştırılsın") ----------------
     Her sayfada altta cam panel; kelimeler söylendikçe yanar, o anki kelime parlar. Kelime olayı gelmezse (ör. kendi sesin)
     ilerleme konuşma hızından tahmin edilir. Tam ekran hologramın eski altyazısı gizlenir. */
  var AYZ = { m: '', kelimeler: [], t0: 0, son: -1, olay: 0, kap: null };
  function altyaziKur() {
    if (AYZ.kap) return;
    AYZ.kap = el('div', { class: 'jv-altyazi', 'aria-hidden': 'true' }, [el('div', { class: 'jv-ay-ic' })]);
    document.body.appendChild(AYZ.kap);
  }
  function altyaziYaz(kelimeIdx) {
    var ic = AYZ.kap.firstChild, l = AYZ.kelimeler; if (!l.length) return;
    // içinde bulunulan cümle penceresi (en çok ~26 kelime)
    var bas = kelimeIdx, son;
    while (bas > 0 && !/[.!?…]$/.test(l[bas - 1].k)) bas--;
    son = bas; while (son < l.length - 1 && !/[.!?…]$/.test(l[son].k)) son++;
    if (son - bas > 26) { bas = Math.max(bas, kelimeIdx - 10); son = Math.min(l.length - 1, bas + 25); }
    var anahtar = bas + ':' + son;
    if (ic.dataset.p !== anahtar) {
      ic.dataset.p = anahtar; ic.innerHTML = '';
      for (var i = bas; i <= son; i++) { var sp = document.createElement('span'); sp.textContent = l[i].k; sp.dataset.i = i; ic.appendChild(sp); ic.appendChild(document.createTextNode(' ')); }
      ic.classList.remove('gir'); void ic.offsetWidth; ic.classList.add('gir');
    }
    Array.prototype.forEach.call(ic.children, function (sp) { var i = +sp.dataset.i; sp.className = i < kelimeIdx ? 'soy' : i === kelimeIdx ? 'simdi' : ''; });
  }
  function altyaziBasla(m) {
    altyaziKur();
    AYZ.m = String(m || '').replace(/\s+/g, ' ').trim(); AYZ.kelimeler = []; AYZ.t0 = performance.now(); AYZ.son = -1; AYZ.olay = 0;
    var re = /\S+/g, x; while ((x = re.exec(AYZ.m))) AYZ.kelimeler.push({ k: x[0], b: x.index, s: x.index + x[0].length });
    if (!AYZ.kelimeler.length) return;
    AYZ.kap.classList.add('acik'); altyaziYaz(0);
  }
  function altyaziKelime(b) {
    AYZ.olay = performance.now();
    for (var i = 0; i < AYZ.kelimeler.length; i++) if (AYZ.kelimeler[i].b <= b && b < AYZ.kelimeler[i].s + 1) { AYZ.son = i; altyaziYaz(i); return; }
  }
  function altyaziBitir() { AYZ.m = ''; setTimeout(function () { if (!AYZ.m && AYZ.kap) AYZ.kap.classList.remove('acik'); }, 1400); }
  Dalga.push(function (t) {
    if (!AYZ.m || !AYZ.kelimeler.length) return;
    if (AYZ.olay && t - AYZ.olay < 1500) return; // gerçek kelime olayları geliyor
    if (Enerji.durum !== 'konusuyor') { AYZ.t0 += 24; return; } // ses henüz başlamadı (ör. üretiliyor): sayaç beklesin
    var hiz = /[çğıöşü]/i.test(AYZ.m) ? 12.5 : 14.5; // saniyede karakter
    var c = (t - AYZ.t0) / 1000 * hiz, i = 0;
    while (i < AYZ.kelimeler.length - 1 && AYZ.kelimeler[i].s < c) i++;
    if (i !== AYZ.son) { AYZ.son = i; altyaziYaz(i); }
  });
  (function holoBagla() {
    var H = window.Holo; if (!H || !H.altyaziBasla) return setTimeout(holoBagla, 300);
    var b0 = H.altyaziBasla, k0 = H.kelime, s0 = H.altyaziBitir;
    H.altyaziBasla = function (m) { try { altyaziBasla(m); } catch (e) {} return b0.apply(H, arguments); };
    H.kelime = function (bas) { try { if (bas != null) altyaziKelime(+bas); } catch (e) {} return k0.apply(H, arguments); };
    H.altyaziBitir = function () { try { altyaziBitir(); } catch (e) {} return s0.apply(H, arguments); };
  })();

  /* ---------------- Carvis yan paneli (kullanıcı: "emojilere basıyom çocuk tableti gibi, daha da hologramlaştırılsın") ---------------- */
  var IK = {
    mik: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3M8 21h8"/></svg>',
    gonder: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M4 12h14M13 6l6 6-6 6"/></svg>',
    ayar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1"/></svg>',
    kapat: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M6 6l12 12M18 6L6 18"/></svg>',
    dalga: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M3 12h2M7 8v8M11 5v14M15 8v8M19 11v2M21 12h0"/></svg>'
  };
  function ikonla(b, ikon, yazi) { if (!b || b.dataset.jv) return; b.dataset.jv = '1'; b.innerHTML = ikon + (yazi ? '<span>' + yazi + '</span>' : ''); }
  function balonKur() {
    var bal = document.querySelector('.cv-balon'); if (!bal || bal.dataset.jv) return !!bal;
    bal.dataset.jv = '1'; bal.classList.add('jv-balon');
    var ust = bal.querySelector('.cv-ust');
    if (ust) {
      var bs = ust.querySelectorAll('button');
      bs.forEach(function (x) {
        var t = (x.textContent || '').trim(), lbl = x.getAttribute('aria-label') || '';
        if (/Uyandırma/.test(t)) ikonla(x, IK.dalga, 'UYANDIR'); else if (/ayar/i.test(lbl)) ikonla(x, IK.ayar); else if (/Kapat/i.test(lbl)) ikonla(x, IK.kapat);
      });
      var b = ust.querySelector('b'); if (b) b.textContent = 'C.A.R.V.I.S.';
      var kc = el('canvas', { class: 'jv-balon-kure', 'aria-hidden': 'true' }); ust.insertBefore(kc, ust.firstChild);
      new JarvisKure(kc, { kucuk: true, serit: 1, iplik: 3, nokta: 80, kosul: function () { return !bal.hidden; } });
    }
    var alt = bal.querySelector('.cv-alt');
    if (alt) alt.querySelectorAll('button').forEach(function (x) { if (x.type === 'submit') ikonla(x, IK.gonder); else if (/🎙/.test(x.textContent)) { ikonla(x, IK.mik); x.setAttribute('aria-label', 'Konuş'); } });
    return true;
  }
  if (!balonKur()) { var bn = 0, bz = setInterval(function () { if (balonKur() || ++bn > 40) clearInterval(bz); }, 250); }

  /* ---------------- Merkez panosu ---------------- */
  var GUN = ['PAZAR', 'PAZARTESİ', 'SALI', 'ÇARŞAMBA', 'PERŞEMBE', 'CUMA', 'CUMARTESİ'], AY = ['OCAK', 'ŞUBAT', 'MART', 'NİSAN', 'MAYIS', 'HAZİRAN', 'TEMMUZ', 'AĞUSTOS', 'EYLÜL', 'EKİM', 'KASIM', 'ARALIK'];
  function iki(n) { return (n < 10 ? '0' : '') + n; }
  function bar(ad) { var i = el('i'), b = el('b', { text: '—' }); return { el: el('div', { class: 'jv-bar' }, [el('span', { text: ad }), i, b]), set: function (p, yazi) { i.style.setProperty('--p', String(Math.max(0, Math.min(1, p || 0)))); b.textContent = yazi; } }; }
  function panel(baslik, govde) { return el('div', { class: 'jv-panel' }, [el('h3', { text: baslik })].concat(govde)); }
  function durbunSvg() {
    var ns = 'http://www.w3.org/2000/svg', s = document.createElementNS(ns, 'svg'); s.setAttribute('viewBox', '-100 -100 200 200');
    var h = '<g fill="none" stroke="rgba(94,240,220,.55)" stroke-width=".5">' +
      '<circle r="96" stroke-dasharray="1 3"/><circle r="88" stroke="rgba(94,240,220,.25)"/>' +
      '<path d="M-100 0h14M86 0h14M0 -100v14M0 86v14" stroke-width=".8"/>' +
      '<path d="M-70 -70l8 8M70 -70l-8 8M-70 70l8 -8M70 70l-8 -8" stroke="rgba(94,240,220,.35)"/>';
    for (var i = 0; i < 72; i++) { var a = i / 72 * Math.PI * 2, r1 = i % 6 ? 92 : 89; h += '<line x1="' + (Math.cos(a) * r1).toFixed(1) + '" y1="' + (Math.sin(a) * r1).toFixed(1) + '" x2="' + (Math.cos(a) * 96).toFixed(1) + '" y2="' + (Math.sin(a) * 96).toFixed(1) + '"/>'; }
    h += '<path d="M-60 -96 A96 96 0 0 1 60 -96" stroke="rgba(94,240,220,.9)" stroke-width="1.2"/></g>';
    s.innerHTML = h; return s;
  }
  function gostergeSvg() {
    var ns = 'http://www.w3.org/2000/svg', s = document.createElementNS(ns, 'svg'); s.setAttribute('viewBox', '0 0 100 100');
    s.innerHTML = '<circle cx="50" cy="50" r="42" fill="none" stroke="rgba(94,240,220,.15)" stroke-width="7"/>' +
      '<circle class="jv-yay" cx="50" cy="50" r="42" fill="none" stroke="url(#jvg)" stroke-width="7" stroke-linecap="round" transform="rotate(-90 50 50)" stroke-dasharray="0 264" style="transition:stroke-dasharray 1s;filter:drop-shadow(0 0 4px #5ef0dc)"/>' +
      '<circle cx="50" cy="50" r="33" fill="none" stroke="rgba(94,240,220,.25)" stroke-dasharray="2 3"/>' +
      '<defs><linearGradient id="jvg"><stop offset="0" stop-color="#46c8ff"/><stop offset="1" stop-color="#5ef0dc"/></linearGradient></defs>' +
      '<text class="jv-yuzde" x="50" y="55" text-anchor="middle" fill="#effffc" style="font:300 17px monospace">—</text>';
    return s;
  }
  function panoKur(sayfa) {
    if (sayfa.querySelector('.jv-pano')) return;
    var b1 = bar('PİL'), b2 = bar('BUGÜN'), b3 = bar('SERİ'), b4 = bar('KART');
    var ortam = el('div'), sirad = el('div', { class: 'jv-kucuk', text: 'Yükleniyor…' }), sesDurum = el('div', { class: 'jv-kucuk', text: 'HAZIR' });
    var dalga = el('canvas', { class: 'jv-dalga', 'aria-hidden': 'true' });
    var mik = el('button', { type: 'button', 'aria-label': 'Carvis ile konuş', text: '🎙', onclick: carvisAc });
    var sol = el('div', { class: 'jv-sol' }, [
      panel('SİSTEM DURUMU', [b1.el, b2.el, b3.el, b4.el]),
      panel('ORTAM', [ortam]),
      panel('SIRADAKİ İŞ', [sirad]),
      panel('SES ASİSTANI', [el('div', { class: 'jv-ses' }, [mik, el('div', { style: 'flex:1;min-width:0' }, [sesDurum, dalga])])])
    ]);
    var saat = el('div', { class: 'jv-saat' }), tarih = el('div', { class: 'jv-tarih' });
    var kcv = el('canvas', { 'aria-hidden': 'true' });
    var durbun = el('div', { class: 'jv-durbun' }, [kcv, durbunSvg(), el('button', { type: 'button', 'aria-label': 'Carvis ile konuş', onclick: carvisAc })]);
    var hedef = el('div', { class: 'jv-hedef' });
    var orta = el('div', { class: 'jv-orta' }, [saat, tarih, durbun, hedef]);
    var gorev = el('ul', { class: 'jv-gorev' }), gos = gostergeSvg(), gosYazi = el('div', { class: 'jv-kucuk' }), kitap = el('div');
    var sag = el('div', { class: 'jv-sag' }, [
      panel('GÖREVLER', [gorev]),
      panel('HEDEF DURUMU', [el('div', { class: 'jv-gosterge' }, [gos, gosYazi])]),
      panel('KONUM', [kitap])
    ]);
    function yuva(ikon, ad, h) { return el('button', { type: 'button', onclick: function () { location.hash = h; } }, [el('span', { text: ikon }), ad]); }
    var pano = el('section', { class: 'jv-pano', 'aria-label': 'Carvis panosu' }, [
      el('div', { class: 'jv-ust' }, [el('div', { class: 'jv-baslik', text: 'C.A.R.V.I.S.' })]),
      sol, orta, sag,
      el('div', { class: 'jv-yuva' }, [yuva('❏', 'OKU', '#oku'), yuva('◈', 'BUGÜN', '#koc'), yuva('▦', 'PLAN', '#plan'), yuva('⧉', 'KARTLAR', '#kartlar'), yuva('⬡', 'LAB', '#lab-molekul'), yuva('♫', 'MÜZİK', '#muzik')])
    ]);
    var kahraman = sayfa.querySelector('.kahraman');
    if (kahraman) kahraman.after(pano); else sayfa.prepend(pano);
    new JarvisKure(kcv, { serit: 3, iplik: 7, nokta: 170 });
    document.body.classList.add('jv-merkez');
    // ses dalgası
    var dctx = dalga.getContext('2d');
    Dalga.push(function (t) {
      if (!dalga.isConnected) return;
      var r = dalga.getBoundingClientRect(), dw = Math.round(r.width), dh = Math.round(r.height); if (!dw) return;
      if (dalga.width !== dw) { dalga.width = dw; dalga.height = dh; }
      dctx.clearRect(0, 0, dw, dh); var n = 48, E = Enerji.v;
      for (var i = 0; i < n; i++) {
        var x = i / n * dw, a = Math.abs(Math.sin(i * 0.55 + t * 0.006 * Enerji.hiz) * Math.sin(i * 0.17 - t * 0.002)) * (0.15 + E) * dh * 0.9 + 1;
        dctx.fillStyle = 'rgba(94,240,220,' + (0.35 + 0.5 * E) + ')'; dctx.fillRect(x, (dh - a) / 2, Math.max(1, dw / n - 2), a);
      }
      var ad = { bosta: 'HAZIR · küreye ya da 🎙\'a dokun', dinliyor: 'DİNLİYOR…', dusunuyor: 'DÜŞÜNÜYOR…', konusuyor: 'KONUŞUYOR' }[Enerji.durum];
      if (sesDurum.textContent !== ad) sesDurum.textContent = ad;
    });
    function zaman() {
      var d = new Date(); saat.textContent = iki(d.getHours()) + ':' + iki(d.getMinutes());
      tarih.textContent = GUN[d.getDay()] + ', ' + d.getDate() + ' ' + AY[d.getMonth()] + ' ' + d.getFullYear();
      ortam.innerHTML = '';
      var bas = d.getHours() < 6 ? 'Gece' : d.getHours() < 12 ? 'Sabah' : d.getHours() < 18 ? 'Öğleden sonra' : 'Akşam';
      ortam.appendChild(el('div', { class: 'jv-buyuk-yazi', text: iki(d.getHours()) + ':' + iki(d.getMinutes()) }));
      ortam.appendChild(el('div', { class: 'jv-kucuk', text: bas.toLocaleUpperCase('tr') + ' · ' + (navigator.onLine ? 'ÇEVRİMİÇİ' : 'ÇEVRİMDIŞI') + ' · ' + (document.body.classList.contains('hx-max') ? 'HOLO MAX' : 'HOLO NORMAL') }));
    }
    zaman(); var zz = setInterval(function () { if (!pano.isConnected) return clearInterval(zz); zaman(); }, 15000);
    if (navigator.getBattery) navigator.getBattery().then(function (bt) { function c() { b1.set(bt.level, Math.round(bt.level * 100) + '%' + (bt.charging ? '⚡' : '')); } c(); bt.addEventListener('levelchange', c); bt.addEventListener('chargingchange', c); }).catch(function () { b1.set(1, '—'); });
    var D = U.Durum || {};
    var k = D.aktifKitap, bl = D.aktifBolum;
    hedef.innerHTML = ''; hedef.appendChild(document.createTextNode('HEDEF ANALİZİ')); hedef.appendChild(el('b', { text: k ? (bl ? (bl.kisa || bl.baslik) : k.baslik) : 'Carvis hazır' }));
    kitap.innerHTML = ''; kitap.appendChild(el('div', { class: 'jv-buyuk-yazi', style: 'font-size:18px', text: k ? k.baslik.replace(/^1001\s*/, '') : 'Kütüphane' }));
    kitap.appendChild(el('div', { class: 'jv-kucuk', text: bl ? 'Bölüm ' + bl.sira + ' · ' + (bl.kisa || bl.baslik) : 'Açık bölüm yok' }));
    if (k) kitap.style.cursor = 'pointer', kitap.onclick = function () { location.hash = '#oku'; };
    if (U.calismaOnerisi) U.calismaOnerisi().then(function (o) {
      var pm = o.pomodoro || {}, dk = pm.bugun_dakika || 0, hd = pm.gunluk_hedef_dk || 120, oran = Math.min(1, dk / hd);
      b2.set(oran, dk + ' dk'); b3.set(Math.min(1, (pm.seri_gun || 0) / 30), (pm.seri_gun || 0) + ' gün'); b4.set(Math.min(1, (o.vadeli || 0) / 50), String(o.vadeli || 0));
      sirad.textContent = o.isler[0] ? o.isler[0].ad : 'Bugünlük iş yok. Carvis\'e "bugün ne çalışayım" de.';
      sirad.style.cursor = 'pointer'; sirad.onclick = function () { location.hash = '#koc'; };
      gorev.innerHTML = '';
      (o.isler.length ? o.isler.slice(0, 5) : [{ ad: 'Plan boş — Plan sekmesinden sınav tarihi gir' }]).forEach(function (x) { gorev.appendChild(el('li', { text: x.ad, onclick: function () { location.hash = '#koc'; } })); });
      var yay = gos.querySelector('.jv-yay'), yz = gos.querySelector('.jv-yuzde');
      yay.setAttribute('stroke-dasharray', (264 * oran).toFixed(0) + ' 264'); yz.textContent = Math.round(oran * 100) + '%';
      gosYazi.innerHTML = ''; gosYazi.appendChild(el('div', { text: 'BUGÜN ' + dk + ' / ' + hd + ' DK' }));
      if (o.sinav) gosYazi.appendChild(el('div', { style: 'color:#ffcf7a', text: o.sinav.kitap.toLocaleUpperCase('tr') + ' SINAVI: ' + o.sinav.gun + ' GÜN' }));
      if (pm.calisiyor) gosYazi.appendChild(el('div', { text: 'POMODORO: ' + (pm.mod === 'calis' ? 'ÇALIŞMA' : 'MOLA') + ' · ' + pm.kalan }));
    }).catch(function () { sirad.textContent = 'Durum alınamadı.'; });
  }
  function carvisAc() { if (window.Carvis && window.Carvis.ac) { var b = document.querySelector('.cv-balon'); if (b) b.hidden = false; if (!window.Carvis.acik) window.Carvis.ac(); } }
  function merkezMi() { var h = location.hash.replace('#', ''); return !h || h === 'kutuphane' || h === 'merkez'; }
  function bak() {
    document.body.classList.toggle('jv-merkez', merkezMi());
    if (!merkezMi()) return;
    var dene = 0; (function d() { var s = $('#ana .sayfa'); if (s && s.querySelector('.merkez-kap, .kahraman')) return panoKur(s); if (++dene < 30) setTimeout(d, 120); })();
  }
  window.addEventListener('hashchange', function () { setTimeout(bak, 60); });
  setTimeout(bak, 300);
})();
