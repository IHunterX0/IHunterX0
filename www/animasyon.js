/* 1001 — Animasyon motoru (kullanıcı, 2026-11-03: "reels tabına gerçek animasyon özelliği koy; gerçekten interaktif video şeklinde
   olsun, AI üretebilsin").
   Yapay zekâ bir SAHNE SENARYOSU (JSON) yazar; bu motor onu GSAP zaman çizelgesiyle canlı oynatır, Carvis her sahneyi sesli anlatır.
   Öğe türleri: yazi, ikon, sekil, ok, akis (yol boyunca akan parçacıklar), sayac, grafik, vurgu, cizik. Sahne türü "soru": video
   durur, cevap bekler. Etkileşim: ekranın ortasına dokun = durdur/sürdür; sol/sağ kenar = önceki/sonraki sahne; açıklaması olan
   öğeye dokun = açıklama balonu (video durur). Koordinatlar 0..1 (sahne genişliği/yüksekliği). */
(function () {
  'use strict';
  var U = window.Uygulama; if (!U) return;
  var el = U.el, NS = 'http://www.w3.org/2000/svg';
  var RENK = { teal: '#5ef0dc', sari: '#ffd38a', mor: '#c88cff', kirmizi: '#ff7a7a', yesil: '#8cffa0', mavi: '#46c8ff', beyaz: '#effffc' };
  function renk(r) { return RENK[r] || (/^#/.test(r || '') ? r : RENK.teal); }
  function sayi(v, d) { v = +v; return isFinite(v) ? v : d; }
  function kl(v) { return Math.max(0, Math.min(1, v)); }

  var st = document.createElement('style');
  st.textContent = [
    '.an-sahne{position:relative;width:100%;height:100%;overflow:hidden;touch-action:manipulation;user-select:none}',
    '.an-sahne svg.an-svg{position:absolute;inset:0;width:100%;height:100%;overflow:visible}',
    '.an-katman{position:absolute;inset:0}',
    '.an-o{position:absolute;transform:translate(-50%,-50%);will-change:transform,opacity;pointer-events:auto}',
    '.an-yazi{font:700 calc(var(--b,1) * clamp(18px,3.2vw,30px))/1.2 var(--f-baslik,system-ui);color:#effffc;text-align:center;text-shadow:0 0 18px rgba(94,240,220,.6);max-width:84%;white-space:pre-wrap}',
    '.an-yazi.kucuk{font-weight:600}',
    '.an-ikon{font-size:calc(var(--b,1) * clamp(34px,6vw,64px));line-height:1;filter:drop-shadow(0 0 14px rgba(94,240,220,.65))}',
    '.an-etiket{font:600 calc(var(--b,1) * 13px) var(--f-kod,monospace);letter-spacing:.06em;color:#dffffa;text-shadow:0 0 8px rgba(94,240,220,.7);white-space:nowrap}',
    '.an-sayac{font:300 calc(var(--b,1) * clamp(28px,5vw,52px)) var(--f-kod,monospace);color:#ffd38a;text-shadow:0 0 16px rgba(255,200,100,.6)}',
    '.an-ipucu{position:absolute;z-index:5;max-width:min(320px,70%);padding:10px 14px;border-radius:16px;background:rgba(3,16,22,.92);box-shadow:0 0 0 1px rgba(110,255,235,.5),0 0 24px rgba(94,240,220,.3);color:#e6fffb;font-size:14px;line-height:1.45;transform:translate(-50%,calc(-100% - 18px))}',
    '.an-tikla{cursor:pointer}.an-tikla::after{content:"";position:absolute;right:-8px;top:-8px;width:9px;height:9px;border-radius:50%;background:#8ffff0;box-shadow:0 0 8px #8ffff0;animation:anNokta 1.4s ease-in-out infinite}',
    '@keyframes anNokta{50%{transform:scale(1.6);opacity:.4}}',
    '.an-durdu{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);font-size:64px;color:rgba(230,255,250,.85);pointer-events:none;text-shadow:0 0 24px rgba(94,240,220,.8)}',
    '.an-segment{position:absolute;left:12px;right:12px;top:8px;display:flex;gap:4px;z-index:6;pointer-events:none}',
    '.an-segment i{flex:1;height:3px;border-radius:2px;background:rgba(160,255,240,.18);overflow:hidden}.an-segment i b{display:block;height:100%;width:0;background:#8ffff0;box-shadow:0 0 8px #5ef0dc}',
    '.an-soru{position:absolute;inset:8% 6%;z-index:7;display:flex;flex-direction:column;gap:10px;justify-content:center}',
    '.an-soru h4{margin:0 0 6px;font:700 clamp(18px,2.8vw,26px)/1.3 var(--f-baslik,system-ui);color:#effffc;text-shadow:0 0 14px rgba(94,240,220,.5)}',
    '.an-soru button{text-align:left;padding:11px 14px;border-radius:14px;border:0;background:rgba(94,240,220,.06);box-shadow:0 0 0 1px rgba(110,255,235,.3);color:#e6fffb;font-size:15px}',
    '.an-soru button.dogru{box-shadow:0 0 0 2px #8cffa0,0 0 20px rgba(140,255,160,.4)}.an-soru button.yanlis{box-shadow:0 0 0 2px #ff7a7a;opacity:.8}',
    '.an-soru p{margin:4px 0 0;color:#ffd38a;font-size:14px;line-height:1.45}'
  ].join('\n');
  document.head.appendChild(st);

  /* ---------- arka planlar (kendi canvas'ı) ---------- */
  function arka(cv, tur) {
    var ctx = cv.getContext('2d'), w = 0, h = 0, P = [];
    var cfg = { hucre: ['120,255,235', 'kabarcik'], kan: ['255,120,130', 'disk'], beyin: ['200,140,255', 'ag'], kalp: ['255,120,130', 'nabiz'], uzay: ['160,200,255', 'yildiz'], koridor: ['94,240,220', 'izgara'], laboratuvar: ['94,240,220', 'izgara'], bos: ['94,240,220', 'yildiz'] }[tur] || ['94,240,220', 'izgara'];
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
        else if (cfg[1] === 'ag') { ctx.fillStyle = 'rgba(' + c + ',.35)'; ctx.fillRect(q.x, q.y, 2, 2); P.forEach(function (o) { var dx = o.x - q.x, dy = o.y - q.y; if (dx * dx + dy * dy < 6400 && o !== q) { ctx.strokeStyle = 'rgba(' + c + ',.05)'; ctx.beginPath(); ctx.moveTo(q.x, q.y); ctx.lineTo(o.x, o.y); ctx.stroke(); } }); }
        else { ctx.fillStyle = 'rgba(' + c + ',' + (0.2 + 0.3 * Math.sin(t * 0.002 + q.a)) + ')'; ctx.fillRect(q.x, q.y, q.r * 0.7, q.r * 0.7); }
      });
      ctx.globalCompositeOperation = 'source-over';
    };
  }

  /* ---------- oynatıcı ---------- */
  function Oynatici(kap, senaryo, o) {
    o = o || {};
    var G = window.gsap, oz = this;
    var sahneler = (senaryo.sahneler || []).filter(function (s) { return s && (s.tip === 'soru' ? s.soru && s.siklar : true); }).slice(0, 12);
    var kok = el('div', { class: 'an-sahne' }), cv = el('canvas', { style: 'position:absolute;inset:0;width:100%;height:100%' });
    var svg = document.createElementNS(NS, 'svg'); svg.setAttribute('class', 'an-svg'); svg.setAttribute('viewBox', '0 0 1000 1000'); svg.setAttribute('preserveAspectRatio', 'none');
    var katman = el('div', { class: 'an-katman' }), seg = el('div', { class: 'an-segment' });
    sahneler.forEach(function () { seg.appendChild(el('i', {}, [el('b')])); });
    kok.appendChild(cv); kok.appendChild(svg); kok.appendChild(katman); kok.appendChild(seg); kap.appendChild(kok);
    var i = -1, tl = null, durdu = false, arkaCiz = null, bitti = false, sesZm = null, ipucu = null, raf = 0;
    function temizle() { if (tl) tl.kill(); tl = null; svg.innerHTML = ''; katman.innerHTML = ''; if (ipucu) { ipucu.remove(); ipucu = null; } clearTimeout(sesZm); }
    function segment(k, f) { Array.prototype.forEach.call(seg.children, function (x, j) { x.firstChild.style.width = (j < k ? 100 : j === k ? f * 100 : 0) + '%'; }); }
    function konus(m) { if (o.konus && m) try { o.konus(m); } catch (e) {} }
    function sus() { if (o.sus) try { o.sus(); } catch (e) {} }
    function px(x) { return kl(sayi(x, 0.5)) * 100 + '%'; }
    function svgEl(ad, at) { var e = document.createElementNS(NS, ad); for (var k in at) e.setAttribute(k, at[k]); svg.appendChild(e); return e; }
    function sahneKur(s) {
      temizle(); arkaCiz = arka(cv, s.arka || senaryo.arka || 'izgara');
      tl = G.timeline({ paused: true, onUpdate: function () { segment(i, tl.progress()); }, onComplete: function () { if (!durdu) sonraki(); } });
      var kayit = {};
      if (s.tip === 'soru') { soruKur(s); return; }
      var sure = Math.max(sayi(s.sure, 6), Math.min(14, String(s.anlatim || '').length / 14 + 1.2));
      tl.to({}, { duration: sure });
      (s.ogeler || []).slice(0, 16).forEach(function (g) {
        var t0 = Math.max(0, Math.min(sure - 0.3, sayi(g.t, 0))), r = renk(g.renk), b = Math.max(0.4, Math.min(3, sayi(g.boyut, 1))), e = null, acik = s.aciklamalar && g.id && s.aciklamalar[g.id];
        if (g.tip === 'yazi' || g.tip === 'etiket' || g.tip === 'ikon' || g.tip === 'sayac') {
          var cls = g.tip === 'yazi' ? 'an-yazi' : g.tip === 'etiket' ? 'an-etiket' : g.tip === 'ikon' ? 'an-ikon' : 'an-sayac';
          e = el('div', { class: 'an-o ' + cls + (acik ? ' an-tikla' : ''), style: 'left:' + px(g.x) + ';top:' + px(g.y) + ';--b:' + b + (g.tip === 'etiket' && g.renk ? ';color:' + r : '') }, [g.tip === 'ikon' ? (g.emoji || '◆') : g.tip === 'sayac' ? String(g.bas || 0) + (g.birim ? ' ' + g.birim : '') : String(g.metin || '')]);
          katman.appendChild(e); G.set(e, { opacity: 0 });
          var giris = g.giris || (g.tip === 'ikon' ? 'buyu' : g.tip === 'yazi' ? 'yaz' : 'belir');
          if (giris === 'buyu') tl.fromTo(e, { opacity: 0, scale: 0.2 }, { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(2.2)' }, t0);
          else if (giris === 'uc') tl.fromTo(e, { opacity: 0, x: -120 }, { opacity: 1, x: 0, duration: 0.7, ease: 'power3.out' }, t0);
          else if (giris === 'yaz' && g.tip === 'yazi') { var m = String(g.metin || ''); e.textContent = ''; var pr = { n: 0 }; tl.set(e, { opacity: 1 }, t0); tl.to(pr, { n: m.length, duration: Math.min(1.6, m.length * 0.035), ease: 'none', onUpdate: function () { e.textContent = m.slice(0, Math.round(pr.n)); } }, t0); }
          else tl.fromTo(e, { opacity: 0, y: 14, filter: 'blur(6px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.6, ease: 'power2.out' }, t0);
          if (g.tip === 'sayac') { var c = { v: sayi(g.bas, 0) }; tl.to(c, { v: sayi(g.son, 100), duration: sayi(g.sure, 2), ease: 'power1.inOut', onUpdate: function () { e.textContent = Math.round(c.v) + (g.birim ? ' ' + g.birim : ''); } }, t0 + 0.3); }
          (g.hareket || []).slice(0, 4).forEach(function (h) { tl.to(e, { left: px(h.x), top: px(h.y), duration: sayi(h.sure, 1), ease: 'power2.inOut' }, Math.max(t0 + 0.5, sayi(h.t, t0 + 1))); });
          if (g.nabiz) tl.to(e, { scale: 1.12, duration: 0.35, yoyo: true, repeat: Math.ceil(sure / 0.7), ease: 'sine.inOut' }, t0 + 0.6);
        } else if (g.tip === 'sekil') {
          var x = kl(sayi(g.x, 0.5)) * 1000, y = kl(sayi(g.y, 0.5)) * 1000, gw = kl(sayi(g.g, 0.2)) * 1000, gh = kl(sayi(g.y2, g.g || 0.2)) * 1000;
          var sk = g.sekil || 'daire';
          if (sk === 'daire' || sk === 'hucre') e = svgEl('ellipse', { cx: x, cy: y, rx: gw / 2, ry: gh / 2 });
          else if (sk === 'altigen') { var pts = []; for (var k = 0; k < 6; k++) { var a = Math.PI / 6 + k * Math.PI / 3; pts.push((x + Math.cos(a) * gw / 2).toFixed(0) + ',' + (y + Math.sin(a) * gh / 2).toFixed(0)); } e = svgEl('polygon', { points: pts.join(' ') }); }
          else if (sk === 'kanal') { e = svgEl('rect', { x: x - gw / 2, y: y - gh / 2, width: gw, height: gh, rx: 6 }); svgEl('line', { x1: x, y1: y - gh / 2, x2: x, y2: y + gh / 2, stroke: r, 'stroke-width': 2, 'stroke-dasharray': '6 5', opacity: 0.6 }); }
          else if (sk === 'zar') { e = svgEl('rect', { x: x - gw / 2, y: y - 14, width: gw, height: 28, rx: 14 }); }
          else e = svgEl('rect', { x: x - gw / 2, y: y - gh / 2, width: gw, height: gh, rx: 18 });
          e.setAttribute('fill', r); e.setAttribute('fill-opacity', sk === 'hucre' ? 0.06 : 0.1); e.setAttribute('stroke', r); e.setAttribute('stroke-width', sk === 'hucre' ? 3 : 2.2); e.style.filter = 'drop-shadow(0 0 6px ' + r + ')';
          G.set(e, { opacity: 0, transformOrigin: '50% 50%' }); tl.fromTo(e, { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(1.6)' }, t0);
          if (g.etiket) { var et = el('div', { class: 'an-o an-etiket', style: 'left:' + px(g.x) + ';top:calc(' + px(sayi(g.y, 0.5) + (sk === 'zar' ? 0.03 : sayi(g.y2, g.g || 0.2) / 2)) + ' + 14px)' }, [g.etiket]); katman.appendChild(et); G.set(et, { opacity: 0 }); tl.to(et, { opacity: 1, duration: 0.4 }, t0 + 0.3); }
          if (acik) { e.style.cursor = 'pointer'; e.addEventListener('click', function (ev) { ev.stopPropagation(); goster(acik, g.x, g.y); }); }
          e = null;
        } else if (g.tip === 'ok') {
          var x1 = kl(sayi(g.x1, 0.2)) * 1000, y1 = kl(sayi(g.y1, 0.5)) * 1000, x2 = kl(sayi(g.x2, 0.8)) * 1000, y2 = kl(sayi(g.y2, 0.5)) * 1000;
          var cz = svgEl('path', { d: 'M' + x1 + ' ' + y1 + ' L' + x2 + ' ' + y2, stroke: r, 'stroke-width': 3, fill: 'none', 'stroke-linecap': 'round' }), L = Math.hypot(x2 - x1, y2 - y1);
          cz.style.filter = 'drop-shadow(0 0 5px ' + r + ')'; cz.setAttribute('stroke-dasharray', L); cz.setAttribute('stroke-dashoffset', L);
          var an = Math.atan2(y2 - y1, x2 - x1), uc = svgEl('path', { d: 'M' + (x2 - 18 * Math.cos(an - 0.45)) + ' ' + (y2 - 18 * Math.sin(an - 0.45)) + ' L' + x2 + ' ' + y2 + ' L' + (x2 - 18 * Math.cos(an + 0.45)) + ' ' + (y2 - 18 * Math.sin(an + 0.45)), stroke: r, 'stroke-width': 3, fill: 'none', opacity: 0 });
          tl.to(cz, { attr: { 'stroke-dashoffset': 0 }, duration: 0.7, ease: 'power2.inOut' }, t0); tl.to(uc, { opacity: 1, duration: 0.2 }, t0 + 0.6);
          if (g.etiket) { var et2 = el('div', { class: 'an-o an-etiket', style: 'left:' + ((x1 + x2) / 20) + '%;top:calc(' + ((y1 + y2) / 20) + '% - 16px)' }, [g.etiket]); katman.appendChild(et2); G.set(et2, { opacity: 0 }); tl.to(et2, { opacity: 1, duration: 0.4 }, t0 + 0.5); }
        } else if (g.tip === 'akis') {
          var yol = (g.yol || []).filter(function (p) { return Array.isArray(p) && p.length === 2; }).slice(0, 8).map(function (p) { return [kl(sayi(p[0], 0.5)), kl(sayi(p[1], 0.5))]; });
          if (yol.length < 2) return;
          var adet = Math.max(1, Math.min(12, sayi(g.adet, 6))), dur = sayi(g.sure, 2.4);
          for (var q = 0; q < adet; q++) (function (q) {
            var p = el('div', { class: 'an-o an-etiket', style: 'color:' + r + ';left:' + yol[0][0] * 100 + '%;top:' + yol[0][1] * 100 + '%' }, [g.etiket || '●']); katman.appendChild(p); G.set(p, { opacity: 0 });
            var pr2 = { f: 0 };
            tl.to(pr2, { f: 1, duration: dur, ease: 'none', repeat: Math.max(0, Math.floor((sure - t0) / dur) - 1), onStart: function () { p.style.opacity = 1; }, onUpdate: function () { var s2 = pr2.f * (yol.length - 1), k2 = Math.min(yol.length - 2, Math.floor(s2)), f2 = s2 - k2; p.style.left = (yol[k2][0] + (yol[k2 + 1][0] - yol[k2][0]) * f2) * 100 + '%'; p.style.top = (yol[k2][1] + (yol[k2 + 1][1] - yol[k2][1]) * f2) * 100 + '%'; } }, t0 + q * dur / adet);
          })(q);
        } else if (g.tip === 'grafik') {
          var gx = kl(sayi(g.x, 0.1)) * 1000, gy = kl(sayi(g.y, 0.5)) * 1000, gg = kl(sayi(g.g, 0.8)) * 1000, gh2 = kl(sayi(g.y2, 0.35)) * 1000, nk = (g.noktalar || []).filter(function (p) { return Array.isArray(p) && p.length === 2; });
          if (nk.length < 2) return;
          var ys = nk.map(function (p) { return +p[1]; }), mn = Math.min.apply(null, ys), mx = Math.max.apply(null, ys), rng = (mx - mn) || 1;
          svgEl('rect', { x: gx, y: gy, width: gg, height: gh2, fill: 'none', stroke: 'rgba(110,255,235,.25)' });
          var d = nk.map(function (p, k) { return (k ? 'L' : 'M') + (gx + kl(+p[0]) * gg).toFixed(1) + ' ' + (gy + gh2 - ((+p[1] - mn) / rng) * gh2).toFixed(1); }).join(' ');
          var pth = svgEl('path', { d: d, stroke: r, 'stroke-width': 3.2, fill: 'none' }); pth.style.filter = 'drop-shadow(0 0 6px ' + r + ')';
          var L2 = pth.getTotalLength ? pth.getTotalLength() : 2000; pth.setAttribute('stroke-dasharray', L2); pth.setAttribute('stroke-dashoffset', L2);
          tl.to(pth, { attr: { 'stroke-dashoffset': 0 }, duration: sayi(g.sure, 2.5), ease: 'none' }, t0);
          if (g.etiket) { var et3 = el('div', { class: 'an-o an-etiket', style: 'left:' + (gx / 10) + '%;top:calc(' + (gy / 10) + '% - 12px);transform:none' }, [g.etiket]); katman.appendChild(et3); }
        } else if (g.tip === 'vurgu' || g.tip === 'cizik') {
          var hd = kayit[g.hedef]; if (!hd) return;
          if (g.tip === 'vurgu') { var hl = el('div', { class: 'an-o', style: 'left:' + hd.style.left + ';top:' + hd.style.top + ';width:120px;height:120px;border-radius:50%;box-shadow:0 0 0 3px ' + r + ',0 0 30px ' + r + ';pointer-events:none' }); katman.appendChild(hl); G.set(hl, { opacity: 0, scale: 1.8 }); tl.to(hl, { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(2)' }, t0); tl.to(hl, { scale: 1.15, duration: 0.4, yoyo: true, repeat: 3 }, t0 + 0.5); }
          else tl.to(hd, { textDecoration: 'line-through', color: '#ff7a7a', opacity: 0.6, duration: 0.3 }, t0);
        }
        if (e) { if (g.id) kayit[g.id] = e; if (acik) e.addEventListener('click', function (ev) { ev.stopPropagation(); goster(acik, g.x, g.y); }); }
      });
      tl.call(function () { konus(s.anlatim); }, null, 0.05);
      if (!durdu) tl.play();
    }
    function goster(m, x, y) {
      durdur(true); if (ipucu) ipucu.remove();
      ipucu = el('div', { class: 'an-ipucu', style: 'left:' + px(x) + ';top:' + px(y), text: m }); kok.appendChild(ipucu);
      if (window.gsap) window.gsap.fromTo(ipucu, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.3 });
    }
    function soruKur(s) {
      var kutu = el('div', { class: 'an-soru' }, [el('h4', { text: '⏸ ' + s.soru })]), cevaplandi = false;
      konus('Soru: ' + s.soru);
      s.siklar.slice(0, 5).forEach(function (sk, k) {
        var b = el('button', { type: 'button', text: 'ABCDE'[k] + ') ' + sk });
        b.addEventListener('click', function (ev) { ev.stopPropagation(); if (cevaplandi) return; cevaplandi = true; var ok = k === (+s.dogru || 0);
          b.classList.add(ok ? 'dogru' : 'yanlis'); if (!ok) kutu.querySelectorAll('button')[+s.dogru || 0].classList.add('dogru');
          kutu.appendChild(el('p', { text: (ok ? '✓ ' : '✗ ') + (s.aciklama || '') })); if (o.cevap) o.cevap(ok, s);
          konus((ok ? 'Doğru. ' : 'Değil. ') + (s.aciklama || '')); setTimeout(function () { if (!durdu) sonraki(); }, 4200); });
        kutu.appendChild(b);
      });
      katman.appendChild(kutu); segment(i, 0.5);
    }
    function git(k) { if (k < 0) k = 0; if (k >= sahneler.length) { bitti = true; segment(sahneler.length, 0); if (o.bitti) o.bitti(); return; } i = k; sus(); sahneKur(sahneler[i]); }
    function sonraki() { git(i + 1); }
    function durdur(v) { durdu = v; if (tl) { if (v) tl.pause(); else tl.play(); } if (v) sus(); var dd = kok.querySelector('.an-durdu'); if (v && !dd) kok.appendChild(el('div', { class: 'an-durdu', text: '❚❚' })); if (!v && dd) dd.remove(); if (!v && ipucu) { ipucu.remove(); ipucu = null; } }
    kok.addEventListener('click', function (e) {
      if (e.target.closest('button, .an-tikla')) return;
      var r = kok.getBoundingClientRect(), fx = (e.clientX - r.left) / r.width;
      if (fx < 0.22) { durdu = false; git(i - 1); } else if (fx > 0.78) { durdu = false; git(i + 1); } else durdur(!durdu);
    });
    function kare(t) { raf = requestAnimationFrame(kare); if (arkaCiz && kok.isConnected) arkaCiz(t); else if (!kok.isConnected) cancelAnimationFrame(raf); }
    raf = requestAnimationFrame(kare);
    this.basla = function () { durdu = false; bitti = false; git(0); };
    this.durdur = function () { durdur(true); };
    this.yoket = function () { temizle(); cancelAnimationFrame(raf); sus(); kok.remove(); };
    this.bittiMi = function () { return bitti; };
  }
  U.Animasyon = { Oynatici: Oynatici, hazir: function () { return !!window.gsap; } };

  /* ---------- yapay zekâya verilecek senaryo kuralları ---------- */
  U.Animasyon.SENARYO_KURALI = [
    'ANİMASYON SENARYOSU kuralları (sahne koordinatları 0..1; x sağa, y aşağı; öğeleri birbirinin üstüne bindirme, kenarlardan 0.08 içeride kal):',
    '"sahneler": 6-9 sahne. Her sahne: {"anlatim":"Carvis\'in söyleyeceği 1-2 kısa cümle","sure":5-9,"arka":"hucre|kan|beyin|kalp|uzay|koridor|laboratuvar","ogeler":[...],"aciklamalar":{"ogeId":"dokununca çıkacak 1 cümle"}}',
    'Öğeler (her birinde "id" ve başlama saniyesi "t" olsun; sahne içinde sırayla görünsünler):',
    ' {"tip":"yazi","metin":"en fazla 8 kelime","x":0.5,"y":0.15,"boyut":1,"giris":"yaz|belir|uc"}',
    ' {"tip":"ikon","emoji":"tek emoji","x":..,"y":..,"boyut":1-2.5,"giris":"buyu","nabiz":true/false,"hareket":[{"x":..,"y":..,"t":saniye,"sure":1}]}',
    ' {"tip":"sekil","sekil":"hucre|daire|kutu|altigen|kanal|zar","x":..,"y":..,"g":genişlik 0..1,"y2":yükseklik 0..1,"renk":"teal|sari|mor|kirmizi|yesil|mavi","etiket":"kısa ad"}',
    ' {"tip":"ok","x1":..,"y1":..,"x2":..,"y2":..,"renk":"..","etiket":"kısa"}',
    ' {"tip":"akis","yol":[[x,y],[x,y],...],"etiket":"Na⁺ gibi 1-3 karakter","adet":3-8,"renk":"..","sure":2}  — yol boyunca akan parçacıklar (iyon, elektron, kan hücresi)',
    ' {"tip":"sayac","x":..,"y":..,"bas":-70,"son":30,"birim":"mV","sure":2}',
    ' {"tip":"grafik","noktalar":[[0,-70],[0.3,30],[1,-70]],"x":0.1,"y":0.55,"g":0.8,"y2":0.3,"renk":"sari","etiket":"Vm","sure":2.5}',
    ' {"tip":"etiket","metin":"kısa not","x":..,"y":..,"renk":".."}',
    ' {"tip":"vurgu","hedef":"başka öğenin id\'si"} · {"tip":"cizik","hedef":"yanlış bilgi yazısının id\'si"}',
    'Sahnelerin ortasına (3. ya da 4. sırada) ve sonuna birer SORU sahnesi koy: {"tip":"soru","soru":"…","siklar":["…","…","…","…"],"dogru":0,"aciklama":"neden"}',
    'Anlatımı GÖRSELLEŞTİR: mekanizmayı hareketle göster (iyon akışı, enzim bağlanması, kan akımı, sinyal yayılımı), sayıları sayaçla, eğrileri grafikle; yanlış sezgiyi yazıp üstünü çiz. Her sahnede 3-7 öğe.'
  ].join('\n');
})();
