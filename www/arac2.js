/* 1001 — Okuma araç çubuğu v2 (kullanıcı, 2026-11-03: "şu üstteki tab çok kötü duruyor, bir şekilde değiştirelim").
   Birçok modül .arac-cubugu'na kendi düğmesini ekliyordu: tam genişlik, taşan, metnin üstüne binen bir şerit oluyordu.
   Şimdi: ortada süzülen holografik kapsül — ☰ · kitap · ⚡ Zamanım yok · 🎯 Seviyemi ölç · ◎ Ders programı · ⋯
   "⋯" açılır panel: okuma seviyesi, A− / A+, kutular, okuma modu, kitapta ara. Aşağı kaydırınca gizlenir, yukarı kaydırınca gelir.
   Düğmeler taşınır (yeniden yaratılmaz), olay dinleyicileri korunur. */
(function () {
  'use strict';
  if (/[?&]gomulu\b/.test(location.search)) return;
  var U = window.Uygulama; if (!U) return;
  var el = U.el;
  var css = document.createElement('style');
  css.textContent = [
    '.arac-cubugu.ac2{position:sticky!important;top:10px;z-index:40;display:flex!important;align-items:center;gap:4px;width:max-content;max-width:calc(100% - 20px);margin:8px auto 16px!important;padding:5px 6px!important;' +
      'border-radius:999px!important;border:0!important;background:linear-gradient(180deg,rgba(6,26,32,.86),rgba(3,12,16,.9))!important;backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);' +
      'box-shadow:0 0 0 1px rgba(110,255,235,.32),0 10px 34px rgba(0,0,0,.55),0 0 26px rgba(94,240,220,.12)!important;overflow:visible!important;transition:transform .35s cubic-bezier(.2,.9,.2,1),opacity .3s}',
    '.arac-cubugu.ac2.gizli{transform:translateY(-130%);opacity:0;pointer-events:none}',
    '.arac-cubugu.ac2 > *{flex-shrink:0}',
    '.arac-cubugu.ac2 .ayrac{display:none!important}',
    '.arac-cubugu.ac2 .kitap-adi{font:700 13px var(--f-kod,monospace)!important;letter-spacing:.08em;padding:0 8px 0 2px;max-width:160px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;text-shadow:0 0 10px currentColor}',
    '.arac-cubugu.ac2 > button,.arac-cubugu.ac2 > a{height:38px;min-width:38px;padding:0 13px!important;border-radius:999px!important;border:1px solid transparent!important;background:transparent!important;box-shadow:none!important;' +
      'color:#d6fbf5!important;font:600 13.5px var(--f-govde,system-ui)!important;display:inline-flex!important;align-items:center;gap:6px;white-space:nowrap;cursor:pointer}',
    '.arac-cubugu.ac2 > button:hover,.arac-cubugu.ac2 > button:focus-visible{border-color:rgba(110,255,235,.4)!important;background:rgba(94,240,220,.08)!important}',
    '.arac-cubugu.ac2 > #zamanimYokDug{color:#ffe2a8!important;background:linear-gradient(135deg,rgba(255,211,138,.18),rgba(255,211,138,.04))!important;border-color:rgba(255,211,138,.5)!important;box-shadow:0 0 14px rgba(255,200,100,.18)!important}',
    '.arac-cubugu.ac2 > .cekmece-dugme{padding:0!important;width:38px}',
    '.arac-cubugu.ac2 .ac-daha{padding:0!important;width:38px;font-size:18px!important;letter-spacing:.05em}',
    '.arac-cubugu.ac2 .ac-daha[aria-expanded=true]{border-color:#9ffff0!important;background:rgba(94,240,220,.14)!important}',
    '.ac-fazla{position:absolute;right:6px;top:calc(100% + 10px);z-index:41;min-width:260px;padding:12px;border-radius:20px;display:grid;grid-template-columns:1fr 1fr;gap:8px;' +
      'background:linear-gradient(180deg,rgba(6,26,32,.96),rgba(3,12,16,.97));box-shadow:0 0 0 1px rgba(110,255,235,.35),0 18px 44px rgba(0,0,0,.6);animation:acAc .22s cubic-bezier(.2,.9,.2,1.2)}',
    '@keyframes acAc{from{opacity:0;transform:translateY(-8px) scale(.97)}}',
    '.ac-fazla[hidden]{display:none}',
    '.ac-fazla > *{min-height:40px;border-radius:14px!important;justify-content:center}',
    '.ac-fazla select{grid-column:1/-1;width:100%;padding:8px 12px}',
    '.ac-fazla .ac-boyut{grid-column:1/-1;display:grid;grid-template-columns:auto 1fr 1fr;gap:8px;align-items:center}.ac-fazla .ac-boyut span{font:600 11px var(--f-kod,monospace);letter-spacing:.12em;color:#8fc7bf}',
    '.ac-fazla button{display:inline-flex!important;align-items:center;gap:6px}',
    '.ac-fazla .uzun{display:inline!important}',
    '@media (max-width:700px){.arac-cubugu.ac2 > button .uzun,.arac-cubugu.ac2 > button span.ad{display:none}.arac-cubugu.ac2 .kitap-adi{max-width:90px}}'
  ].join('\n');
  document.head.appendChild(css);

  function duzenle(arac) {
    if (!arac || arac.dataset.acIsleniyor) return;
    arac.dataset.acIsleniyor = '1';
    try {
      arac.classList.add('ac2');
      var fazla = arac.querySelector(':scope > .ac-fazla'), daha = arac.querySelector(':scope > .ac-daha');
      if (!fazla) {
        fazla = el('div', { class: 'ac-fazla', hidden: true, role: 'menu' });
        daha = el('button', { class: 'ac-daha', type: 'button', 'aria-label': 'Diğer ayarlar', 'aria-expanded': 'false', text: '⋯' });
        daha.addEventListener('click', function (e) { e.stopPropagation(); fazla.hidden = !fazla.hidden; daha.setAttribute('aria-expanded', String(!fazla.hidden)); });
        document.addEventListener('click', function (e) { if (!fazla.hidden && !e.target.closest('.ac-fazla, .ac-daha')) { fazla.hidden = true; daha.setAttribute('aria-expanded', 'false'); } });
        arac.appendChild(daha); arac.appendChild(fazla);
        fazla.appendChild(el('div', { class: 'ac-boyut' }, [el('span', { text: 'YAZI' })]));
      }
      var boyut = fazla.querySelector('.ac-boyut');
      var ad = arac.querySelector('.kitap-adi'); if (ad && /^1001\s/.test(ad.textContent)) ad.textContent = ad.textContent.replace(/^1001\s*/, '');
      Array.prototype.slice.call(arac.children).forEach(function (c) {
        if (c === fazla || c === daha) return;
        var etiket = (c.getAttribute('aria-label') || '') + ' ' + (c.id || '') + ' ' + (c.className || '');
        if (/Yazıyı (küçült|büyüt)/.test(etiket)) { boyut.appendChild(c); return; }
        if (c.tagName === 'SELECT' || /Kutu filtreleri|Bu kitapta ara|okumaModuDug/.test(etiket)) { if (/Bu kitapta ara/.test(etiket) && !c.dataset.acEt) { c.dataset.acEt = 1; c.appendChild(document.createTextNode(' Kitapta ara')); } fazla.appendChild(c); return; }
      });
      // ⋯ her zaman en sonda
      if (arac.lastElementChild !== fazla) { arac.appendChild(daha); arac.appendChild(fazla); }
    } finally { setTimeout(function () { delete arac.dataset.acIsleniyor; }, 0); }
  }
  var bekle = 0;
  new MutationObserver(function () {
    if (bekle) return; bekle = requestAnimationFrame(function () { bekle = 0; Array.prototype.forEach.call(document.querySelectorAll('.arac-cubugu'), duzenle); });
  }).observe(document.documentElement, { childList: true, subtree: true });

  // aşağı kaydırınca gizle, yukarı kaydırınca göster
  var son = new WeakMap();
  window.addEventListener('scroll', function (e) {
    var arac = document.querySelector('.arac-cubugu.ac2'); if (!arac) return;
    var hedef = e.target === document ? document.scrollingElement : e.target; if (!hedef || typeof hedef.scrollTop !== 'number') return;
    var y = hedef.scrollTop, o = son.get(hedef) || 0; son.set(hedef, y);
    if (Math.abs(y - o) < 6) return;
    var f = arac.querySelector('.ac-fazla');
    if (y > o && y > 120 && (!f || f.hidden)) arac.classList.add('gizli'); else arac.classList.remove('gizli');
  }, { passive: true, capture: true });
})();
