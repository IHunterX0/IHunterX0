/* 1001 — Kadran (kullanıcı, 2026-11-03: "ana sayfada ses asistanı yerine GTA'da silah seçtiğin halka gibi, tıklayınca açılıp kitap,
   reels, makale vs. gösteren çember; sol üstteki menüyle ikisini de ortaya alalım, biri büyük biri küçük; Jarvis'in dış çemberinde
   kasa kilidi gibi döndürülen bir şey olsun, normalde en üstte dursun; sola sürüklersem küçük olan, sağa sürüklersem büyük olan
   açılsın"; "ayrı ayrı kitapları gösteren kısmı kaldır, aşağı kaydırıyoruz, kitap gibi duruyor; üstüne tıklayınca açılsınlar sadece").
   - Ana sayfa: yalnız Carvis panosu; kitap kartları/halkası ve kaydırma yok; SES ASİSTANI paneli ve sol üst nokta kalkar.
   - Jarvis dürbününün dış çemberinde dönebilen kasa kadranı (100 çentik, 0-90 rakamları); üstte işaret.
     Sola çevir (≥ 35°) → küçük çark (kitaplar + reels, makale, kartlar, test, tahmin, plan); sağa çevir → büyük menü (tüm bölümler).
     Dokun → küçük çark. Bırakınca kadran yaylanarak tepeye döner. */
(function () {
  'use strict';
  if (/[?&]gomulu\b/.test(location.search)) return;
  var U = window.Uygulama; if (!U) return;
  var el = U.el, NS = 'http://www.w3.org/2000/svg';
  var ESIK = 35;
  var css = document.createElement('style');
  css.textContent = [
    'body.ev-sade #ana .sayfa > :not(.jv-pano){display:none!important}',
    'body.ev-sade #ana .sayfa{padding-bottom:0!important}',
    /* sol üstteki menü noktası (kullanıcı: "çok güzel, daha uygun bir yere alalım") → sol alt köşe, başparmak hizası; ana sayfada da */
    '.mn-nokta{top:auto!important;bottom:calc(22px + env(safe-area-inset-bottom,0px))!important;left:max(20px,env(safe-area-inset-left))!important;width:66px!important;height:66px!important}',
    'body.ev-sade .jv-panel.kd-ses{display:none!important}',
    '.kd-kadran{position:absolute;left:50%;top:50%;width:100%;aspect-ratio:1;transform:translate(-50%,-50%);z-index:5;pointer-events:none}',
    '.kd-kadran svg{width:100%;height:100%;overflow:visible}',
    '.kd-cark .bant{pointer-events:stroke;cursor:grab;touch-action:none}',
    '.kd-tutamak{pointer-events:auto;cursor:grab;touch-action:none}',
    /* dokunmada tarayıcı kaydırmaya başlayıp sürüklemeyi iptal etmesin: üst kapsayıcılar da touch-action:none (SVG grubunda tek başına yetmiyor) */
    '.kd-kadran,.kd-kadran svg,.kd-kadran .bant{touch-action:none}',
    '.kd-ipucu{display:none!important;position:absolute;top:3%;font:700 10.5px var(--f-kod,monospace);letter-spacing:.2em;color:rgba(140,255,240,.55);white-space:nowrap;transition:color .2s,text-shadow .2s;pointer-events:none}',
    '.kd-ipucu.sol{right:60%}.kd-ipucu.sag{left:60%}',
    '.kd-ipucu.on{color:#fff;text-shadow:0 0 12px #5ef0dc}',
    /* küçük çark (silah çarkı) */
    '.kd-perde{position:fixed;inset:0;z-index:600;background:radial-gradient(circle at var(--x) var(--y),rgba(2,12,16,.35),rgba(2,8,12,.82) 60%);animation:kdPerde .25s ease-out}',
    '@keyframes kdPerde{from{opacity:0}}',
    '.kd-tekerlek{position:fixed;z-index:601;width:min(86vmin,620px);aspect-ratio:1;transform:translate(-50%,-50%) scale(1);animation:kdAc .35s cubic-bezier(.2,1.3,.3,1)}',
    '@keyframes kdAc{from{transform:translate(-50%,-50%) scale(.6) rotate(-25deg);opacity:0}}',
    '.kd-tekerlek svg{width:100%;height:100%;overflow:visible}',
    '.kd-dilim{cursor:pointer;transition:fill .15s;outline:none}',
    '.kd-dilim:focus,.kd-dilim:focus-visible{outline:none}',
    '.kd-dilim path.d{fill:rgba(8,40,48,.72);stroke:rgba(110,255,235,.35);stroke-width:1.2;transition:fill .15s,stroke .15s}',
    '.kd-dilim.on path.d{fill:rgba(94,240,220,.28);stroke:#9ffff0;stroke-width:2.2;filter:drop-shadow(0 0 10px #5ef0dc)}',
    '.kd-dilim text{fill:#e9fffb;font-family:var(--f-baslik,system-ui)!important;font-weight:700;letter-spacing:.02em;text-anchor:middle;pointer-events:none;paint-order:stroke;stroke:rgba(2,14,18,.7);stroke-width:2.5px}',
    '.kd-dilim text.ik{font-size:26px}',
    '.kd-orta{position:absolute;left:50%;top:50%;width:36%;transform:translate(-50%,-50%);text-align:center;pointer-events:none}',
    '.kd-orta b{display:block;font:800 clamp(16px,2.6vmin,22px) var(--f-baslik,system-ui);color:#fff;text-shadow:0 0 14px #5ef0dc}',
    '.kd-orta small{display:block;margin-top:4px;font-size:clamp(11px,1.7vmin,13px);color:#bfe9e3;line-height:1.35}'
  ].join('\n');
  document.head.appendChild(css);

  function titret(ms) { try { if (navigator.vibrate) navigator.vibrate(ms); } catch (e) {} }

  /* ---------- kasa kadranı ---------- */
  function kadranSvg() {
    var s = document.createElementNS(NS, 'svg'); s.setAttribute('viewBox', '-120 -120 240 240');
    var h = '<g class="kd-cark">';
    h += '<circle class="bant" r="108" fill="none" stroke="rgba(0,0,0,0)" stroke-width="18"/>';
    h += '<circle r="113" fill="none" stroke="rgba(94,240,220,.35)" stroke-width=".8"/><circle r="102" fill="none" stroke="rgba(94,240,220,.22)" stroke-width=".6"/>';
    for (var i = 0; i < 100; i++) {
      var a = i / 100 * Math.PI * 2 - Math.PI / 2, uz = i % 10 === 0 ? 9 : i % 5 === 0 ? 6 : 3.5, r1 = 112, r2 = r1 - uz;
      h += '<line x1="' + (Math.cos(a) * r1).toFixed(2) + '" y1="' + (Math.sin(a) * r1).toFixed(2) + '" x2="' + (Math.cos(a) * r2).toFixed(2) + '" y2="' + (Math.sin(a) * r2).toFixed(2) + '" stroke="rgba(140,255,240,' + (i % 10 === 0 ? '.9' : '.45') + ')" stroke-width="' + (i % 10 === 0 ? 1.1 : 0.6) + '"/>';
      if (i % 10 === 0) { var rt = 96; h += '<text x="' + (Math.cos(a) * rt).toFixed(2) + '" y="' + (Math.sin(a) * rt + 2.5).toFixed(2) + '" text-anchor="middle" fill="rgba(200,255,248,.75)" style="font:600 7px monospace">' + i + '</text>'; }
    }
    // tutamak çentikleri (kasa kadranının tırtıklı tutma yerleri)
    for (var j = 0; j < 4; j++) { var b = j * Math.PI / 2; h += '<path d="M' + (Math.cos(b - 0.06) * 116).toFixed(1) + ' ' + (Math.sin(b - 0.06) * 116).toFixed(1) + ' L' + (Math.cos(b) * 121).toFixed(1) + ' ' + (Math.sin(b) * 121).toFixed(1) + ' L' + (Math.cos(b + 0.06) * 116).toFixed(1) + ' ' + (Math.sin(b + 0.06) * 116).toFixed(1) + '" fill="rgba(94,240,220,.35)"/>'; }
    h += '</g>';
    // sabit işaret + tutamak (en üstte)
    h += '<g class="kd-tutamak"><circle cx="0" cy="-112" r="13" fill="rgba(2,16,20,.85)" stroke="#9ffff0" stroke-width="1.4" style="filter:drop-shadow(0 0 6px #5ef0dc)"/>' +
      '<path d="M-5 -116 L-9 -112 L-5 -108 M5 -116 L9 -112 L5 -108" fill="none" stroke="#c9fff6" stroke-width="1.4" stroke-linecap="round"/><circle cx="0" cy="-112" r="2.2" fill="#c9fff6"/></g>' +
      '<path d="M0 -99 l-4 -7 h8 z" fill="#ffd38a" style="filter:drop-shadow(0 0 4px #ffd38a)"/>';
    s.innerHTML = h; return s;
  }
  function kadranKur(durbun) {
    if (durbun.querySelector('.kd-kadran')) return;
    var kap = el('div', { class: 'kd-kadran' }), svg = kadranSvg();
    var ipSol = el('div', { class: 'kd-ipucu sol', text: '◀ KISA YOL' }), ipSag = el('div', { class: 'kd-ipucu sag', text: 'TÜM MENÜ ▶' });
    kap.appendChild(svg); kap.appendChild(ipSol); kap.appendChild(ipSag); durbun.appendChild(kap);
    var cark = svg.querySelector('.kd-cark'), tut = svg.querySelector('.kd-tutamak'), bant = svg.querySelector('.bant');
    var surukle = null, aciNow = 0, yayRaf = 0;
    function aciKoy(d) { aciNow = d; cark.setAttribute('transform', 'rotate(' + d.toFixed(2) + ')'); tut.setAttribute('transform', 'rotate(' + d.toFixed(2) + ')'); }
    function yay() { cancelAnimationFrame(yayRaf); var v = 0; (function f() { v = (v - aciNow * 0.18) * 0.72; aciKoy(aciNow + v); if (Math.abs(aciNow) > 0.05 || Math.abs(v) > 0.05) yayRaf = requestAnimationFrame(f); else aciKoy(0); })(); }
    function aci(e) { var r = kap.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2; return Math.atan2(e.clientX - cx, -(e.clientY - cy)) * 180 / Math.PI; }
    function bas(e) {
      e.preventDefault(); e.stopPropagation();
      surukle = { a0: aci(e), d: 0, son: 0, t: Date.now(), id: e.pointerId, x0: e.clientX, dx: 0 };
      try { (e.target.setPointerCapture ? e.target : kap).setPointerCapture(e.pointerId); } catch (x) {}
      cancelAnimationFrame(yayRaf);
    }
    function tasi(e) {
      if (!surukle || e.pointerId !== surukle.id) return;
      var d = aci(e) - surukle.a0; while (d > 180) d -= 360; while (d < -180) d += 360;
      d = Math.max(-80, Math.min(80, d)); surukle.d = d; surukle.dx = e.clientX - surukle.x0;
      aciKoy(d);
      var tik = Math.round(d / 7.2); if (tik !== surukle.son) { surukle.son = tik; titret(6); }
      ipSol.classList.toggle('on', d <= -ESIK); ipSag.classList.toggle('on', d >= ESIK);
    }
    function birak(e) {
      if (!surukle || (e && e.pointerId !== surukle.id)) return;
      var d = surukle.d, dx = surukle.dx, kisa = Date.now() - surukle.t < 350 && Math.abs(d) < 6 && Math.abs(dx) < 10; surukle = null;
      yay();
      ipSol.classList.remove('on'); ipSag.classList.remove('on');
      // sınıflandırma ekrandaki yatay hareketle: sağa = kitap listesi, sola ya da kısa dokunuş = kısa yol (dairesel açı yönü tersine dönebiliyor)
      var sag = dx >= 30 ? true : dx <= -30 ? false : (d >= ESIK ? true : d <= -ESIK ? false : null);
      if (kisa || sag === false) { titret(25); cark_ac(durbun, false); }
      else if (sag === true) { titret(25); cark_ac(durbun, true); }
    }
    [tut, bant].forEach(function (x) { x.addEventListener('pointerdown', bas); x.addEventListener('pointermove', tasi); x.addEventListener('pointerup', birak); x.addEventListener('pointercancel', birak); });
  }

  /* ---------- küçük çark (silah çarkı) ---------- */
  // sağa kaydırınca kitap listesi (kitapli=true); sola ya da kısa dokunuşta kısa yol çarkı (kitapli=false)
  function ogeler(kitapli) {
    return U.Kitaplik.katalog().then(function (l) {
      return U.Depo.oku('ilerleme').then(function (il) {
        il = il || {};
        var kit = l.map(function (k) { var s = (il.okuma || {})[k.id], okunan = Object.keys(((il.okunan || {})[k.id]) || {}).length, top = (k.sayilar && k.sayilar.altBolum) || 0;
          return { ik: /anatomi/.test(k.id) ? 'kemik' : /kimya/.test(k.id) ? 'molekul' : /istatistik/.test(k.id) ? 'grafik' : /fizik/.test(k.id) ? 'dalga' : 'kitap', ad: k.baslik.replace(/^1001\s*/, ''), alt: (top ? '%' + Math.round(100 * okunan / top) + ' okundu · ' : '') + (s ? 'kaldığın yerden aç' : 'baştan aç'), renk: k.renk || '#4fe0ff',
            git: function () { U.git(U.okuHash(k.id, s ? s.bolum : 0)); } }; });
        return (kitapli ? kit : []).concat([
          { ik: 'kitap', ad: 'Kitaplar', alt: 'bütün kitapların çarkı', git: function () { location.hash = '#kitaplar'; } },
          { ik: 'pusula', ad: 'Program', alt: 'bugünkü dersler, pratikler, komite', git: function () { location.hash = '#pusula'; } },
          { ik: 'izgara', ad: 'Uygulamalar', alt: 'tabletteki uygulamalar', git: function () { location.hash = '#uygulamalar'; } },
          { ik: 'damla', ad: 'Sağlık', alt: 'su, vitamin, verim, uyku', git: function () { location.hash = '#saglik'; } },
          { ik: 'oynat', ad: 'Reels', alt: 'kaydır, izle, öğren', git: function () { if (U.reelsAc) U.reelsAc(); else location.hash = '#reels'; } },
          { ik: 'makale', ad: 'Makaleler', alt: 'ilgi alanların, yeni araştırmalar', git: function () { location.hash = '#makaleler'; } },
          { ik: 'kart', ad: 'Kartlar', alt: 'bugünkü tekrar', git: function () { location.hash = '#kartlar'; } },
          { ik: 'hedef', ad: 'Test', alt: 'çıkmış sorular', git: function () { location.hash = '#test'; } },
          { ik: 'tahmin', ad: 'Çıkmış', alt: 'konu, deneme, Jane', git: function () { location.hash = '#tahmin'; } },
          { ik: 'takvim', ad: 'Plan', alt: 'komite ve günlük plan', git: function () { location.hash = '#plan'; } }
        ]);
      });
    });
  }
  function dilimYol(a0, a1, r0, r1) {
    function p(r, a) { return (Math.cos(a) * r).toFixed(2) + ' ' + (Math.sin(a) * r).toFixed(2); }
    var buyuk = a1 - a0 > Math.PI ? 1 : 0;
    return 'M' + p(r0, a0) + ' L' + p(r1, a0) + ' A' + r1 + ' ' + r1 + ' 0 ' + buyuk + ' 1 ' + p(r1, a1) + ' L' + p(r0, a1) + ' A' + r0 + ' ' + r0 + ' 0 ' + buyuk + ' 0 ' + p(r0, a0) + ' Z';
  }
  function cark_ac(durbun, kitapli) {
    if (document.querySelector('.kd-tekerlek')) return;
    var r = durbun.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    cx = Math.max(innerWidth * 0.3, Math.min(innerWidth * 0.7, cx)); cy = Math.max(innerHeight * 0.38, Math.min(innerHeight * 0.62, cy));
    var perde = el('div', { class: 'kd-perde', style: '--x:' + cx + 'px;--y:' + cy + 'px' }), tek = el('div', { class: 'kd-tekerlek', role: 'menu', 'aria-label': 'Kısa yol çarkı', style: 'left:' + cx + 'px;top:' + cy + 'px' });
    var orta = el('div', { class: 'kd-orta' }, [el('b', { text: 'KISA YOL' }), el('small', { text: '' })]);
    document.body.appendChild(perde); document.body.appendChild(tek);
    function kapat() { perde.remove(); tek.remove(); document.removeEventListener('keydown', tus); }
    function tus(e) { if (e.key === 'Escape') kapat(); }
    document.addEventListener('keydown', tus);
    perde.addEventListener('click', kapat);
    ogeler(kitapli).then(function (l) {
      var s = document.createElementNS(NS, 'svg'); s.setAttribute('viewBox', '-120 -120 240 240');
      var n = l.length, bosluk = 0.025, R0 = 48, R1 = 114;
      s.innerHTML = '<circle r="44" fill="rgba(2,14,18,.88)" stroke="rgba(110,255,235,.5)" stroke-width="1"/><circle r="117" fill="none" stroke="rgba(110,255,235,.25)" stroke-dasharray="2 4"/>';
      var dilimler = l.map(function (o, i) {
        var a0 = -Math.PI / 2 + i / n * Math.PI * 2 - Math.PI / n + bosluk, a1 = a0 + Math.PI * 2 / n - 2 * bosluk, am = (a0 + a1) / 2, rm = (R0 + R1) / 2 + 4;
        var g = document.createElementNS(NS, 'g'); g.setAttribute('class', 'kd-dilim'); g.setAttribute('role', 'menuitem'); g.setAttribute('tabindex', '0'); g.setAttribute('aria-label', o.ad);
        g.innerHTML = '<path class="d" d="' + dilimYol(a0, a1, R0, R1) + '"' + (o.renk ? ' style="stroke:' + o.renk + '"' : '') + '/>' +
          '<g transform="translate(' + (Math.cos(am) * rm - 9).toFixed(1) + ' ' + (Math.sin(am) * rm - 19).toFixed(1) + ') scale(.75)" style="color:' + (o.renk || '#c9fff6') + ';filter:drop-shadow(0 0 4px currentColor)"><path d="' + (U.ikonYol ? U.ikonYol(o.ik) : '') + '" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></g>' +
          '<text x="' + (Math.cos(am) * rm).toFixed(1) + '" y="' + (Math.sin(am) * rm + 16).toFixed(1) + '" style="font-size:' + (o.ad.length > 12 ? 8.2 : o.ad.length > 8 ? 9.2 : 10) + 'px">' + U.esc(o.ad) + '</text>';
        function sec() { dilimler.forEach(function (x) { x.classList.toggle('on', x === g); }); orta.firstChild.textContent = o.ad; orta.lastChild.textContent = o.alt; }
        g.addEventListener('pointerenter', sec); g.addEventListener('focus', sec);
        g.addEventListener('click', function (e) { e.stopPropagation(); titret(15); kapat(); o.git(); });
        g.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); kapat(); o.git(); } });
        s.appendChild(g); return g;
      });
      tek.appendChild(s); tek.appendChild(orta);
      // parmağı çarkın üstünde gezdirerek seçme (GTA gibi): basılı tutup kaydır, bırakınca seçilir
      var basili = false;
      tek.addEventListener('pointerdown', function () { basili = true; });
      tek.addEventListener('pointermove', function (e) {
        var rr = tek.getBoundingClientRect(), dx = e.clientX - (rr.left + rr.width / 2), dy = e.clientY - (rr.top + rr.height / 2), uz = Math.hypot(dx, dy) / (rr.width / 2) * 120;
        if (uz < 44 || uz > 125) return;
        var a = Math.atan2(dy, dx) + Math.PI / 2 + Math.PI / n; a = (a % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2);
        var i = Math.floor(a / (Math.PI * 2) * n) % n; dilimler[i].dispatchEvent(new Event('pointerenter'));
      });
      tek.addEventListener('pointerup', function () { if (!basili) return; basili = false; });
      if (dilimler[0]) { dilimler[0].dispatchEvent(new Event('pointerenter')); try { dilimler[0].focus({ preventScroll: true, focusVisible: false }); } catch (e) {} }
    });
  }
  /* Hareket bölümü arşivde (kullanıcı, 2026-11-03: "hareket kısmındaki kemik hareketi, kaslar, nefes alma kaldır, arşivle; ben sadece
     hücre düzeyinde istiyorum"): menülerden ve Carvis araçlarından çıkarıldı; kod duruyor, #lab-hareket adresiyle açılabilir. */
  (function () { var l = U.SEKMELER || []; for (var i = l.length - 1; i >= 0; i--) if (l[i] && l[i].id === 'lab-hareket') l.splice(i, 1); })();
  var arsivCss = document.createElement('style'); arsivCss.textContent = '.lab-dug[href*="lab-hareket"],.lab-dug[href*="lab-eklem"]{display:none!important}'; document.head.appendChild(arsivCss);
  // #kitaplar: kitap çarkı doğrudan açılır (kısa yol çarkındaki "Kitaplar" ve adres çubuğu için); kaydırmadan da erişilir
  window.addEventListener('hashchange', function () { if (location.hash === '#kitaplar') { history.replaceState(null, '', location.pathname + '#kutuphane'); var d = document.querySelector('.jv-durbun'); cark_ac(d || document.body, true); } });
  U.kisaYolCarki = function () { var d = document.querySelector('.jv-durbun'); cark_ac(d || document.body, false); };

  /* ---------- ana sayfa sadeleştirme + kurulum ---------- */
  function evMi() { var h = location.hash.replace(/^#/, ''); return h === '' || h === 'kutuphane'; }
  function kur() {
    document.body.classList.toggle('ev-sade', evMi());
    if (!evMi()) return;
    var durbun = document.querySelector('.jv-durbun'); if (durbun) kadranKur(durbun);
    Array.prototype.forEach.call(document.querySelectorAll('.jv-panel'), function (p) { var h = p.querySelector('h3'); if (h && /SES ASİSTANI/i.test(h.textContent)) p.classList.add('kd-ses'); });
  }
  var eski = U.GORUNUMLER.kutuphane;
  U.GORUNUMLER.kutuphane = function () { eski.apply(this, arguments); kur(); setTimeout(kur, 300); setTimeout(kur, 1200); };
  window.addEventListener('hashchange', function () { setTimeout(kur, 50); });
  setTimeout(kur, 800);
})();
