/* 1001 — Kütüphane holografik kartlar (kullanıcı, 2026-11-03: "şu alttaki kitap ve sekmeler tablarını daha holografik ve kullanılabilir
   hale dönüştürelim"). Kartlar ışıktan yapılmış, tabanından yükselen bir projeksiyon gibi; okuma ilerlemesi halka; kartın tamamı
   "devam et"; altta tek dokunuşla Zamanım yok / Reels / Tahmin / Test. Hızlı düğmeler ikonlu ışık kapsülleri; sıradaki sınav çipi.
   Sayfanın altı alttaki komut kapsülünün arkasında kalmasın diye boşluk bırakılır. */
(function () {
  'use strict';
  if (/[?&]gomulu\b/.test(location.search)) return;
  var U = window.Uygulama; if (!U) return;
  var el = U.el;
  var css = document.createElement('style');
  css.textContent = [
    '#ana .sayfa.hk-sayfa{padding-bottom:170px}',
    '.hizli.hk-komut{display:flex;gap:10px;overflow-x:auto;scrollbar-width:none;padding:6px 2px 10px;flex-wrap:nowrap;align-items:stretch}',
    '.hizli.hk-komut::-webkit-scrollbar{display:none}',
    '.hk-komut > .dugme,.hk-komut > a.dugme,.hk-komut > .hk-cip{flex:none;display:flex;align-items:center;gap:8px;min-height:46px;padding:8px 16px 8px 8px!important;border-radius:999px!important;position:relative;white-space:nowrap}',
    '.hk-komut .hk-ik{width:30px;height:30px;border-radius:50%;display:grid;place-items:center;font-size:15px;background:radial-gradient(circle,rgba(94,240,220,.28),rgba(94,240,220,.04) 70%);box-shadow:0 0 0 1px rgba(110,255,235,.45),0 0 14px rgba(94,240,220,.35)}',
    '.hk-komut > .dugme.ana{background:linear-gradient(90deg,rgba(94,240,220,.22),rgba(70,200,255,.08))!important}',
    '.hk-cip{border:1px solid rgba(255,211,138,.45);color:#ffe9c2;background:rgba(255,211,138,.06);text-decoration:none;font-size:14px}',
    '.hk-cip .hk-ik{background:radial-gradient(circle,rgba(255,211,138,.3),transparent 70%);box-shadow:0 0 0 1px rgba(255,211,138,.5)}',
    '.kart-izgara.hk-izgara{display:grid!important;grid-template-columns:repeat(auto-fill,minmax(250px,1fr))!important;gap:26px 18px!important;perspective:1200px}',
    '.kitap-kart.hk-kart{min-width:0!important;width:auto!important}',
    '.kitap-kart.hk-kart .sayilar{display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important}',
    '.kitap-kart.hk-kart .kart-alt{display:flex!important;align-items:center;gap:10px}.kitap-kart.hk-kart .kart-alt > span{flex:1;min-width:0;font-size:12px}',
    '.kitap-kart.hk-kart{cursor:pointer;padding:18px 18px 16px!important;transform-style:preserve-3d;transition:transform .5s cubic-bezier(.2,.9,.2,1),box-shadow .4s;overflow:visible!important;' +
      'background:linear-gradient(180deg,color-mix(in srgb,var(--k) 10%,transparent),transparent 70%)!important}',
    '.kitap-kart.hk-kart:hover,.kitap-kart.hk-kart:focus-within{transform:translateY(-6px) rotateX(4deg)}',
    '.kitap-kart.hk-kart .hk-taban{position:absolute;left:12%;right:12%;bottom:-14px;height:18px;border-radius:50%;pointer-events:none;' +
      'background:radial-gradient(ellipse,color-mix(in srgb,var(--k) 55%,transparent),transparent 70%);filter:blur(2px);animation:hkNefes 3.2s ease-in-out infinite}',
    '@keyframes hkNefes{50%{opacity:.45}}',
    '.kitap-kart.hk-kart h2{font-size:clamp(17px,1.8vw,21px)!important;letter-spacing:.12em;text-shadow:0 0 14px color-mix(in srgb,var(--k) 70%,transparent)!important;margin:4px 0 10px!important}',
    '.hk-ust{display:flex;align-items:center;gap:14px}',
    '.hk-halka{flex:none;width:48px;height:48px;position:relative}.hk-halka svg{width:100%;height:100%;transform:rotate(-90deg)}',
    '.hk-halka b{position:absolute;inset:0;display:grid;place-items:center;font:800 12px var(--f-kod,monospace);color:#fff;text-shadow:0 0 10px var(--k)}',
    '.kitap-kart.hk-kart .cubuk{display:none}',
    '.kitap-kart.hk-kart .sayilar{gap:6px!important}',
    '.kitap-kart.hk-kart .sayi{background:transparent!important;border:0!important;box-shadow:inset 0 -1px 0 color-mix(in srgb,var(--k) 40%,transparent)!important}',
    '.hk-eylem{display:grid;grid-template-columns:repeat(4,1fr);gap:6px;margin-top:12px}',
    '.hk-eylem button{display:flex;flex-direction:column;align-items:center;gap:3px;padding:8px 2px;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;border-radius:14px;border:1px solid color-mix(in srgb,var(--k) 45%,transparent);background:color-mix(in srgb,var(--k) 7%,transparent);color:#effffc;font:600 11.5px var(--f-govde,system-ui);cursor:pointer;min-height:52px}',
    '.hk-eylem button span{font-size:18px;filter:drop-shadow(0 0 6px var(--k))}',
    '.hk-eylem button:active{transform:scale(.95)}',
    '.kitap-kart.hk-kart .kart-alt{margin-top:10px}'
  ].join('\n');
  document.head.appendChild(css);

  function ikonla(b, ik) { if (!b || b.querySelector('.hk-ik')) return; var t = b.textContent.replace(/^[^\wÇĞİÖŞÜçğıöşü]+\s*/, ''); b.textContent = ''; b.appendChild(el('span', { class: 'hk-ik', text: ik })); b.appendChild(document.createTextNode(t)); }
  function halka(yuzde, renk) {
    var s = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); s.setAttribute('viewBox', '0 0 40 40');
    var c = 2 * Math.PI * 16;
    s.innerHTML = '<circle cx="20" cy="20" r="16" fill="none" stroke="rgba(255,255,255,.1)" stroke-width="3.5"/><circle cx="20" cy="20" r="16" fill="none" stroke="' + renk + '" stroke-width="3.5" stroke-linecap="round" stroke-dasharray="' + (c * yuzde / 100).toFixed(1) + ' ' + c.toFixed(1) + '" style="filter:drop-shadow(0 0 4px ' + renk + ')"/>';
    return el('div', { class: 'hk-halka' }, [s, el('b', { text: '%' + yuzde })]);
  }
  function kartlariDonustur(izgara, liste) {
    izgara.classList.add('hk-izgara');
    var kartlar = izgara.querySelectorAll('.kitap-kart');
    Array.prototype.forEach.call(kartlar, function (kart, i) {
      if (kart.classList.contains('hk-kart')) return; var k = liste[i]; if (!k) return;
      kart.classList.add('hk-kart'); kart.setAttribute('tabindex', '0'); kart.setAttribute('role', 'group'); kart.setAttribute('aria-label', k.baslik);
      var renk = k.renk || '#4fe0ff', cb = kart.querySelector('.cubuk'), yuzde = cb ? +cb.getAttribute('aria-valuenow') || 0 : 0;
      var h2 = kart.querySelector('h2'), say = kart.querySelector('.sayilar');
      var alt = kart.querySelector('.kart-alt'); if (alt) alt.insertBefore(halka(yuzde, renk), alt.firstChild);
      var devam = kart.querySelector('.kart-alt .dugme');
      function eylem(ik, ad, fn) { return el('button', { type: 'button', 'aria-label': ad + ' · ' + k.baslik, onclick: function (e) { e.stopPropagation(); fn(); } }, [el('span', { text: ik }), ad]); }
      kart.appendChild(el('div', { class: 'hk-eylem' }, [
        eylem('⚡', 'Özet', function () { if (window.Carvis && window.Carvis.zamanimYok) window.Carvis.zamanimYok(k.id, 0); else location.hash = '#' + U.okuHash(k.id, 0); }),
        eylem('▶', 'Reels', function () { if (U.reelsAc) U.reelsAc(k.id); else location.hash = '#reels'; }),
        eylem('🔮', 'Tahmin', function () { location.hash = '#tahmin-' + k.id; }),
        eylem('◎', 'Test', function () { try { sessionStorage.setItem('dersKitap', k.id); } catch (e) {} location.hash = '#test'; })]));
      kart.appendChild(el('div', { class: 'hk-taban', 'aria-hidden': 'true' }));
      kart.addEventListener('click', function (e) { if (e.target.closest('button, a')) return; if (devam) devam.click(); });
      kart.addEventListener('keydown', function (e) { if ((e.key === 'Enter' || e.key === ' ') && e.target === kart) { e.preventDefault(); if (devam) devam.click(); } });
    });
  }
  var eski = U.GORUNUMLER.kutuphane;
  U.GORUNUMLER.kutuphane = function () {
    eski.apply(this, arguments);
    var sayfa = document.querySelector('#ana .sayfa'); if (sayfa) sayfa.classList.add('hk-sayfa');
    var hizli = document.querySelector('.hizli'), izgara = document.querySelector('.kart-izgara');
    function hizliDuzen() {
      if (!hizli) return; hizli.classList.add('hk-komut');
      Array.prototype.forEach.call(hizli.querySelectorAll('.dugme'), function (b) {
        var t = b.textContent; ikonla(b, /Kaldığın/.test(t) ? '▶' : /tekrar/i.test(t) ? '❖' : /Test/.test(t) ? '◎' : /çalışmalı/i.test(t) ? '◭' : /ne çıkar/i.test(t) ? '🔮' : '•');
      });
    }
    hizliDuzen();
    if (hizli && U.siradakiSinav) U.siradakiSinav().then(function (sn) {
      if (!sn || !sn.tarih || hizli.querySelector('.hk-cip')) return;
      var c = el('a', { class: 'hk-cip', href: '#plan' }, [el('span', { class: 'hk-ik', text: '🗓' }), (sn.ad || sn.tur) + ' · ' + (sn.gun === 0 ? 'BUGÜN' : sn.gun + ' gün')]);
      hizli.insertBefore(c, hizli.firstChild);
    });
    if (!izgara) return;
    U.Kitaplik.katalog().then(function (liste) {
      var dene = 0;
      (function bekle() {
        hizliDuzen();
        if (izgara.querySelectorAll('.kitap-kart').length >= liste.length || dene++ > 40) { kartlariDonustur(izgara, liste); hizliDuzen(); return; }
        setTimeout(bekle, 80);
      })();
    });
  };
  if (/^#?(kutuphane)?$/.test(location.hash.replace(/^#/, '')) && document.querySelector('.kart-izgara')) try { U.GORUNUMLER.kutuphane(); } catch (e) {}
})();
