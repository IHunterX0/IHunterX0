/* 1001 — Holografik pencereler (kullanıcı: "bilgileri açınca kenarlara atabileyim, Jarvis gibi").
   - Her yan panelin (açıklamalar, Zamanım yok, ayarlar, testler…) başlığında ⧉ düğmesi: paneli havada süzülen
     holografik pencereye dönüştürür. Panelin başlığını tutup yana çekmek de aynısını yapar (parmağın altında kopar).
   - Pencere: başlığından sürüklenir; hızlı fırlatılırsa ya da kenara bırakılırsa o kenara park olur (dikey sekme).
     Kenardaki sekmeye dokununca eski yerine uçarak döner. Köşeden boyutlanır, başlığa çift dokununca büyür/küçülür.
   - Sürüklerken hızına göre 3B eğilir ve arkasında ışık izi bırakır; kenara yaklaşınca o kenar parlar.
   - Pencereler sayfa değişse de kalır (gövdedeki düğümler taşınır, içerik çalışmaya devam eder). */
(function () {
  'use strict';
  var U = window.Uygulama; if (!U) return;
  if (/[?&]gomulu\b/.test(location.search)) return;
  var el = U.el, $ = U.$, $$ = U.$$, body = document.body;
  var ES = 70, UST = 66; // kenar yakalama mesafesi, üst çubuk yüksekliği
  var zSira = 90, sayac = 0, pencereler = [];

  var css = document.createElement('style');
  css.textContent = [
    '.hp{position:fixed;z-index:90;display:flex;flex-direction:column;min-width:260px;min-height:160px;color:var(--metin);',
    'background:var(--holo-tarama),linear-gradient(165deg,rgba(14,48,70,.82),rgba(4,16,26,.86) 55%,rgba(10,30,50,.82));border:1px solid rgba(94,231,255,.55);',
    'box-shadow:0 0 0 1px rgba(94,231,255,.15),0 0 34px rgba(47,180,255,.32),inset 0 0 40px rgba(94,231,255,.08),0 24px 60px rgba(0,0,0,.55),calc(var(--vx,0) * -0.03px) calc(var(--vy,0) * -0.03px) 0 -2px rgba(94,231,255,.25),calc(var(--vx,0) * -0.06px) calc(var(--vy,0) * -0.06px) 0 -4px rgba(160,120,255,.15);',
    'backdrop-filter:blur(10px) saturate(1.3);-webkit-backdrop-filter:blur(10px) saturate(1.3);clip-path:polygon(16px 0,100% 0,100% calc(100% - 16px),calc(100% - 16px) 100%,0 100%,0 16px);',
    'transform:perspective(1100px) rotateY(calc(var(--vx,0) * 0.012deg)) rotateX(calc(var(--vy,0) * -0.012deg));transform-origin:50% 0;touch-action:none;animation:hpYansit .45s cubic-bezier(.2,.8,.2,1)}',
    '.hp.kayiyor{transition:left .38s cubic-bezier(.2,.9,.25,1),top .38s cubic-bezier(.2,.9,.25,1),width .38s cubic-bezier(.2,.9,.25,1),height .38s cubic-bezier(.2,.9,.25,1)}',
    '.hp::before{content:"";position:absolute;left:0;right:0;top:0;height:2px;background:linear-gradient(90deg,transparent,#9ff6ff,transparent);box-shadow:0 0 16px #5ee7ff;z-index:3}',
    '.hp::after{content:"";position:absolute;inset:0;pointer-events:none;background:linear-gradient(115deg,transparent 25%,rgba(94,255,240,.10) 40%,rgba(160,120,255,.10) 50%,rgba(255,140,210,.07) 58%,transparent 72%);background-size:250% 250%;background-position:calc(50% + var(--hx,0) * 40%) 50%;mix-blend-mode:color-dodge}',
    '.hp-ust{display:flex;align-items:center;gap:8px;padding:8px 8px 8px 14px;border-bottom:1px solid rgba(94,231,255,.25);cursor:grab;user-select:none;-webkit-user-select:none;background:linear-gradient(180deg,rgba(94,231,255,.14),transparent)}',
    '.hp.surukleniyor .hp-ust{cursor:grabbing}',
    '.hp-kod{font:600 9.5px var(--f-kod);letter-spacing:.18em;color:var(--holo-sicak,#ffb547)}',
    '.hp-baslik{flex:1;min-width:0;display:grid}.hp-baslik b{font:600 14px var(--f-baslik);color:#eafcff;letter-spacing:.04em;text-shadow:0 0 10px rgba(94,231,255,.5);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
    '.hp-baslik small{font:10.5px var(--f-kod);letter-spacing:.12em;color:rgba(191,239,255,.6);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;text-transform:uppercase}',
    '.hp-d{width:30px;height:30px;flex-shrink:0;display:grid;place-items:center;background:rgba(94,231,255,.08);border:1px solid rgba(94,231,255,.3);color:var(--holo,#5ee7ff);font-size:13px;cursor:pointer;clip-path:polygon(6px 0,100% 0,100% calc(100% - 6px),calc(100% - 6px) 100%,0 100%,0 6px)}',
    '.hp-d:hover{background:rgba(94,231,255,.22);color:#fff}',
    '.hp-govde{flex:1;overflow:auto;padding:12px 14px 18px;display:grid;gap:12px;align-content:start;overscroll-behavior:contain;touch-action:pan-y}',
    '.hp-govde textarea{width:100%;font-family:var(--f-govde);resize:vertical}',
    '.hp-boyut{position:absolute;right:0;bottom:0;width:26px;height:26px;cursor:nwse-resize;z-index:4;touch-action:none;background:linear-gradient(135deg,transparent 50%,rgba(94,231,255,.7) 50%,rgba(94,231,255,.7) 56%,transparent 56%,transparent 66%,rgba(94,231,255,.7) 66%,rgba(94,231,255,.7) 72%,transparent 72%)}',
    // kenarda park
    '.hp.kenarda{min-width:0;min-height:0;width:46px!important;height:150px!important;clip-path:polygon(0 0,100% 10px,100% calc(100% - 10px),0 100%);cursor:pointer;animation:none;transform:none}',
    '.hp.kenarda.sag{clip-path:polygon(0 10px,100% 0,100% 100%,0 calc(100% - 10px))}',
    '.hp.kenarda .hp-govde,.hp.kenarda .hp-boyut,.hp.kenarda .hp-d,.hp.kenarda .hp-baslik small{display:none}',
    '.hp.kenarda .hp-ust{flex-direction:column;height:100%;padding:10px 0;border:0;cursor:pointer;justify-content:flex-start;gap:10px}',
    '.hp.kenarda .hp-baslik{writing-mode:vertical-rl;transform:rotate(180deg);flex:1;overflow:hidden}.hp.kenarda.sol .hp-baslik{transform:none}',
    '.hp.kenarda .hp-baslik b{font-size:12px;letter-spacing:.12em}',
    '.hp.kenarda::before{left:auto;right:0;top:0;bottom:0;width:2px;height:auto;background:linear-gradient(180deg,transparent,#9ff6ff,transparent)}.hp.kenarda.sag::before{right:auto;left:0}',
    '.hp.kenarda:hover{box-shadow:0 0 30px rgba(94,231,255,.6)}',
    // kenar parıltısı (sürüklerken)
    '.hp-kenar-isik{position:fixed;top:0;bottom:0;width:90px;z-index:89;pointer-events:none;opacity:0;transition:opacity .2s}',
    '.hp-kenar-isik.sol{left:0;background:linear-gradient(90deg,rgba(94,231,255,.45),transparent)}.hp-kenar-isik.sag{right:0;background:linear-gradient(270deg,rgba(94,231,255,.45),transparent)}',
    '.hp-kenar-isik.yanik{opacity:1}',
    '@keyframes hpYansit{0%{opacity:0;filter:brightness(2.5);clip-path:polygon(0 49%,100% 49%,100% 51%,0 51%)}45%{opacity:1;clip-path:polygon(0 0,100% 0,100% 100%,0 100%)}55%{opacity:.5}65%{opacity:1}100%{filter:none}}',
    '.yp-ayir{margin-left:auto}',
    '@media (prefers-reduced-motion: reduce){.hp{animation:none}.hp.kayiyor{transition:none}}'
  ].join('\n');
  document.head.appendChild(css);
  var isikSol = el('div', { class: 'hp-kenar-isik sol' }), isikSag = el('div', { class: 'hp-kenar-isik sag' });
  body.appendChild(isikSol); body.appendChild(isikSag);
  function ses(t) { if (window.HoloSes) window.HoloSes(t); }

  /* ---------------- pencere ---------------- */
  function sinirla(r) {
    var W = innerWidth, H = innerHeight;
    r.w = Math.min(Math.max(r.w, 260), W - 16); r.h = Math.min(Math.max(r.h, 160), H - UST - 12);
    r.x = Math.min(Math.max(r.x, 8), W - r.w - 8); r.y = Math.min(Math.max(r.y, UST + 4), H - r.h - 8);
    return r;
  }
  function pencereAc(o) {
    var p = { id: ++sayac, kenar: null, r: sinirla({ x: o.x, y: o.y, w: o.w || 420, h: o.h || 520 }), onceki: null, buyuk: false };
    var govde = el('div', { class: 'hp-govde' });
    (o.dugumler || []).forEach(function (d) { govde.appendChild(d); });
    var kapat = el('button', { class: 'hp-d', type: 'button', title: 'Kapat', 'aria-label': 'Kapat' }, ['✕']);
    var parkSol = el('button', { class: 'hp-d', type: 'button', title: 'Sola park et', 'aria-label': 'Sola park et' }, ['⇤']);
    var parkSag = el('button', { class: 'hp-d', type: 'button', title: 'Sağa park et', 'aria-label': 'Sağa park et' }, ['⇥']);
    var ust = el('div', { class: 'hp-ust' }, [el('span', { class: 'hp-kod', text: 'HOLO-' + String(p.id).padStart(2, '0') }),
      el('div', { class: 'hp-baslik' }, [el('small', { text: o.alt || 'Bilgi' }), el('b', { text: o.baslik || 'Pencere' })]), parkSol, parkSag, kapat]);
    var boyut = el('i', { class: 'hp-boyut', 'aria-hidden': 'true' });
    var d = el('section', { class: 'hp', role: 'dialog', 'aria-label': o.baslik || 'Holografik pencere' }, [ust, govde, boyut]);
    p.el = d; p.ust = ust;
    yerlestir(p); one(p);
    body.appendChild(d); pencereler.push(p);
    kapat.addEventListener('click', function (e) { e.stopPropagation(); pencereKapat(p); });
    parkSol.addEventListener('click', function (e) { e.stopPropagation(); parkEt(p, 'sol'); });
    parkSag.addEventListener('click', function (e) { e.stopPropagation(); parkEt(p, 'sag'); });
    d.addEventListener('pointerdown', function () { one(p); }, true);
    ust.addEventListener('dblclick', function () { if (!p.kenar) buyut(p); });
    suruklemeBagla(p, ust, o.surukle);
    boyutBagla(p, boyut);
    ses('ac');
    return p;
  }
  function yerlestir(p) {
    var s = p.el.style;
    if (p.kenar) {
      var sira = pencereler.filter(function (x) { return x.kenar === p.kenar; }).indexOf(p);
      s.left = (p.kenar === 'sol' ? 0 : innerWidth - 46) + 'px'; s.top = (UST + 24 + Math.max(0, sira) * 158) + 'px';
    } else { s.left = p.r.x + 'px'; s.top = p.r.y + 'px'; s.width = p.r.w + 'px'; s.height = p.r.h + 'px'; }
  }
  function kaydir(p, f) { p.el.classList.add('kayiyor'); f(); setTimeout(function () { p.el.classList.remove('kayiyor'); }, 420); }
  function one(p) { p.el.style.zIndex = String(++zSira); }
  function pencereKapat(p) {
    ses('kapat');
    p.el.style.transition = 'opacity .25s, filter .25s'; p.el.style.opacity = '0'; p.el.style.filter = 'brightness(2.5) blur(3px)';
    setTimeout(function () { p.el.remove(); }, 260);
    pencereler = pencereler.filter(function (x) { return x !== p; });
    pencereler.forEach(function (x) { if (x.kenar) kaydir(x, function () { yerlestir(x); }); });
  }
  function parkEt(p, kenar) {
    if (p.kenar === kenar) return;
    p.kenar = kenar; p.el.classList.add('kenarda'); p.el.classList.toggle('sol', kenar === 'sol'); p.el.classList.toggle('sag', kenar === 'sag');
    p.el.style.setProperty('--vx', 0); p.el.style.setProperty('--vy', 0);
    kaydir(p, function () { yerlestir(p); });
    ses('sec');
  }
  function geriGetir(p) {
    var k = p.kenar; p.kenar = null; p.el.classList.remove('kenarda', 'sol', 'sag');
    sinirla(p.r); kaydir(p, function () { yerlestir(p); });
    pencereler.forEach(function (x) { if (x.kenar === k) kaydir(x, function () { yerlestir(x); }); });
    one(p); ses('ac');
  }
  function buyut(p) {
    if (p.buyuk) { p.r = p.onceki; p.buyuk = false; }
    else { p.onceki = Object.assign({}, p.r); p.r = { x: 12, y: UST + 8, w: innerWidth - 24, h: innerHeight - UST - 20 }; p.buyuk = true; }
    kaydir(p, function () { yerlestir(p); });
  }

  /* ---------------- sürükle + fırlat ---------------- */
  function suruklemeBagla(p, tutamac, baslangic) {
    var iz = null;
    function basla(e) {
      if (e.target.closest('.hp-d')) return;
      if (p.kenar) { // kenardaki sekme: dokununca geri gel (çekerek de çıkarılabilir)
        iz = { kenarTik: true, sx: e.clientX, sy: e.clientY };
        tutamac.setPointerCapture(e.pointerId); return;
      }
      iz = { dx: e.clientX - p.r.x, dy: e.clientY - p.r.y, ornek: [{ x: e.clientX, y: e.clientY, t: performance.now() }] };
      try { tutamac.setPointerCapture(e.pointerId); } catch (x) {}
      p.el.classList.add('surukleniyor'); one(p);
    }
    tutamac.addEventListener('pointerdown', basla);
    tutamac.addEventListener('pointermove', function (e) {
      if (!iz) return;
      if (iz.kenarTik) {
        if (Math.abs(e.clientX - iz.sx) > 24) { // sekmeyi dışarı çekti: parmağın altında aç
          var k = p.kenar; p.kenar = null; p.el.classList.remove('kenarda', 'sol', 'sag');
          p.r.x = e.clientX - p.r.w / 2; p.r.y = e.clientY - 20; sinirla(p.r); yerlestir(p);
          pencereler.forEach(function (x) { if (x.kenar === k) kaydir(x, function () { yerlestir(x); }); });
          iz = { dx: e.clientX - p.r.x, dy: e.clientY - p.r.y, ornek: [{ x: e.clientX, y: e.clientY, t: performance.now() }] };
          p.el.classList.add('surukleniyor');
        }
        return;
      }
      p.r.x = e.clientX - iz.dx; p.r.y = Math.max(UST + 4, e.clientY - iz.dy);
      p.el.style.left = p.r.x + 'px'; p.el.style.top = p.r.y + 'px';
      var t = performance.now(); iz.ornek.push({ x: e.clientX, y: e.clientY, t: t }); while (iz.ornek.length > 2 && t - iz.ornek[0].t > 90) iz.ornek.shift();
      var h = hiz(iz.ornek); p.el.style.setProperty('--vx', h.x.toFixed(0)); p.el.style.setProperty('--vy', h.y.toFixed(0));
      isikSol.classList.toggle('yanik', p.r.x < ES || h.x < -900); isikSag.classList.toggle('yanik', p.r.x + p.r.w > innerWidth - ES || h.x > 900);
    });
    function bitir(e) {
      if (!iz) return;
      var z = iz; iz = null;
      isikSol.classList.remove('yanik'); isikSag.classList.remove('yanik');
      if (z.kenarTik) { if (Math.abs(e.clientX - z.sx) < 8 && Math.abs(e.clientY - z.sy) < 8) geriGetir(p); return; }
      p.el.classList.remove('surukleniyor');
      var h = hiz(z.ornek);
      p.el.style.setProperty('--vx', 0); p.el.style.setProperty('--vy', 0);
      // fırlatma ya da kenara bırakma → park
      if (h.x < -900 || p.r.x < ES - p.r.w * 0.3) return parkEt(p, 'sol');
      if (h.x > 900 || p.r.x + p.r.w > innerWidth - ES + p.r.w * 0.3) return parkEt(p, 'sag');
      // ataletle süzül
      var vx = h.x, vy = h.y, son = performance.now();
      (function suz(t) {
        var dt = Math.min(0.05, (t - son) / 1000); son = t;
        vx *= Math.pow(0.04, dt); vy *= Math.pow(0.04, dt);
        p.r.x += vx * dt; p.r.y += vy * dt;
        var once = { x: p.r.x, y: p.r.y }; sinirla(p.r);
        if (once.x !== p.r.x) vx = 0; if (once.y !== p.r.y) vy = 0;
        p.el.style.left = p.r.x + 'px'; p.el.style.top = p.r.y + 'px';
        if (Math.abs(vx) + Math.abs(vy) > 20) requestAnimationFrame(suz);
      })(son);
    }
    tutamac.addEventListener('pointerup', bitir);
    tutamac.addEventListener('pointercancel', bitir);
    if (baslangic) { // panelden koparken parmak zaten basılı: sürüklemeyi devral
      iz = { dx: baslangic.clientX - p.r.x, dy: baslangic.clientY - p.r.y, ornek: [{ x: baslangic.clientX, y: baslangic.clientY, t: performance.now() }] };
      p.el.classList.add('surukleniyor');
      try { tutamac.setPointerCapture(baslangic.pointerId); } catch (x) {}
    }
  }
  function hiz(o) { if (o.length < 2) return { x: 0, y: 0 }; var a = o[0], b = o[o.length - 1], dt = Math.max(16, b.t - a.t) / 1000; return { x: (b.x - a.x) / dt, y: (b.y - a.y) / dt }; }
  function boyutBagla(p, tut) {
    var b = null;
    tut.addEventListener('pointerdown', function (e) { e.stopPropagation(); b = { x: e.clientX, y: e.clientY, w: p.r.w, h: p.r.h }; tut.setPointerCapture(e.pointerId); one(p); });
    tut.addEventListener('pointermove', function (e) { if (!b) return; p.r.w = b.w + e.clientX - b.x; p.r.h = b.h + e.clientY - b.y; sinirla(p.r); yerlestir(p); });
    tut.addEventListener('pointerup', function () { b = null; });
  }
  addEventListener('resize', function () { pencereler.forEach(function (p) { if (!p.kenar) sinirla(p.r); yerlestir(p); }); });

  /* ---------------- yan panelden ayırma ---------------- */
  function ayir(e) {
    var panel = $('.yan-panel.acik'); if (!panel) return null;
    var g = $('.yp-govde', panel), r = panel.getBoundingClientRect();
    var baslik = ($('.yp-baslik', panel) || {}).textContent || 'Bilgi', alt = ($('.yp-ust .ust-etiket', panel) || {}).textContent || '';
    var dugumler = g ? Array.prototype.slice.call(g.childNodes) : [];
    var w = Math.min(440, innerWidth - 24), h = Math.min(Math.max(r.height, 320), innerHeight - UST - 30);
    var x = e && e.clientX != null ? e.clientX - w / 2 : r.left - 40, y = e && e.clientY != null ? e.clientY - 18 : Math.max(UST + 10, r.top + 10);
    var p = pencereAc({ baslik: baslik, alt: alt, dugumler: dugumler, x: x, y: y, w: w, h: h, surukle: e && e.pointerId != null ? e : null });
    if (U.panelKapat) U.panelKapat();
    return p;
  }
  function panelDuzenle() {
    $$('.yan-panel .yp-ust').forEach(function (ust) {
      if (ust.__hp) return; ust.__hp = true;
      var kapat = ust.querySelector('button[aria-label="Paneli kapat"]');
      var d = el('button', { class: 'ikon-dugme yp-ayir', type: 'button', title: 'Hologram olarak ayır (ya da başlığı tutup yana çek)', 'aria-label': 'Hologram olarak ayır' }, ['⧉']);
      d.addEventListener('click', function () { ayir(null); });
      if (kapat) kapat.before(d); else ust.appendChild(d);
      // başlığı tutup yana/aşağı çekmek: panel kopar, pencere parmağın altında kalır
      var bas = null;
      ust.addEventListener('pointerdown', function (e) { if (e.target.closest('button')) return; bas = { x: e.clientX, y: e.clientY }; });
      ust.addEventListener('pointermove', function (e) {
        if (!bas) return;
        if (Math.abs(e.clientX - bas.x) > 28 || (innerWidth > 640 && Math.abs(e.clientY - bas.y) > 40)) {
          bas = null; ayir(e);
        }
      });
      ust.addEventListener('pointerup', function () { bas = null; });
    });
  }
  new MutationObserver(panelDuzenle).observe(body, { childList: true });
  var panelGozcu = setInterval(function () { var y = $('.yan-panel'); if (y) { new MutationObserver(panelDuzenle).observe(y, { childList: true }); panelDuzenle(); clearInterval(panelGozcu); } }, 500);

  window.HoloPencere = { ac: pencereAc, ayir: ayir, liste: function () { return pencereler; } };
})();
