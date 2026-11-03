/* 1001 — Holografik pencere animasyonları (kullanıcı, 2026-11-03: "pencereleri, animasyonları vs. holografik yap").
   Pencereler ince bir yatay ışık çizgisinden doğar (projeksiyon açılır), parlar, bir an titrer ve oturur; kapanırken ışığa çekilir.
   Kapsam: yan paneller (Zamanım yok vb.), ayrılmış holografik pencereler, menü/çarklar, Carvis balonu, hatırlatma ve sorular,
   reels alt sayfaları, sayfa geçişleri. Okuma modunda ve "azaltılmış hareket" ayarında kapalı. */
(function () {
  'use strict';
  if (/[?&]gomulu\b/.test(location.search)) return;
  var css = document.createElement('style');
  css.textContent = [
    '@keyframes holoDog{0%{clip-path:inset(49.5% 0 49.5% 0);opacity:.35;filter:brightness(2.6) saturate(1.6)}' +
      '30%{clip-path:inset(0 0 0 0);opacity:.85;filter:brightness(1.8) saturate(1.3)}42%{opacity:.55}50%{opacity:1}62%{opacity:.82}' +
      '72%{opacity:1;filter:brightness(1.15)}100%{clip-path:inset(0 0 0 0);opacity:1;filter:none}}',
    '@keyframes holoYumusak{0%{opacity:0;transform:translateY(10px) scale(.985);filter:brightness(2) blur(3px)}40%{opacity:.9;filter:brightness(1.4) blur(0)}55%{opacity:.6}70%{opacity:1}100%{opacity:1;transform:none;filter:none}}',
    '@keyframes holoSayfa{0%{opacity:0;filter:brightness(1.8) blur(2px)}35%{opacity:.85;filter:brightness(1.25) blur(0)}50%{opacity:.7}100%{opacity:1;filter:none}}',
    '@keyframes holoCizgi{0%{transform:scaleX(0);opacity:1}60%{transform:scaleX(1);opacity:1}100%{transform:scaleX(1);opacity:0}}',
    /* pencereler */
    '.yan-panel.acik{animation:holoDog .62s cubic-bezier(.2,.8,.2,1) both}',
    '.hp{animation:holoDog .58s cubic-bezier(.2,.8,.2,1) both}',
    '.kd-tekerlek,.bm-kutu,.ae-halka .ae-sahne,.mn .mn-sahne{animation:holoDog .55s cubic-bezier(.2,.8,.2,1) both}',
    '.kd-tekerlek{animation:holoDog .55s cubic-bezier(.2,.8,.2,1) both,kdAc .35s cubic-bezier(.2,1.3,.3,1)}',
    '.cv-balon:not([hidden]),.sg-hat,.rl-sayfa,.ac-fazla:not([hidden]),.an-ipucu,.jane-cta,.zy-alan:not([hidden]){animation:holoYumusak .5s cubic-bezier(.2,.8,.2,1) both}',
    '#ana > .sayfa{animation:holoSayfa .45s ease-out both}',
    /* doğuş çizgisi: pencere açılırken ortadan yayılan ışık çizgisi */
    '.holo-cizgi{position:fixed;height:2px;z-index:1300;pointer-events:none;transform-origin:50% 50%;background:linear-gradient(90deg,transparent,#c9fff6,#fff,#c9fff6,transparent);box-shadow:0 0 18px #5ef0dc,0 0 4px #fff;animation:holoCizgi .5s ease-out forwards}',
    'body.fx-okuma #ana > .sayfa,body.okuma-modu #ana > .sayfa{animation:none}',
    '@media (prefers-reduced-motion: reduce){.yan-panel.acik,.hp,.kd-tekerlek,.bm-kutu,.cv-balon,.sg-hat,.rl-sayfa,#ana > .sayfa,.ae-halka .ae-sahne,.mn .mn-sahne{animation:none!important}.holo-cizgi{display:none}}'
  ].join('\n');
  document.head.appendChild(css);
  // bir pencere görünür olduğunda ortasından yatay ışık çizgisi yay
  function cizgi(e) {
    try {
      if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      var r = e.getBoundingClientRect(); if (r.width < 120 || r.height < 60) return;
      var c = document.createElement('div'); c.className = 'holo-cizgi';
      c.style.left = r.left + 'px'; c.style.width = r.width + 'px'; c.style.top = (r.top + r.height / 2) + 'px';
      document.body.appendChild(c); setTimeout(function () { c.remove(); }, 560);
    } catch (x) {}
  }
  var SECICI = '.yan-panel.acik, .hp, .kd-tekerlek, .bm-kutu, .ae-halka .ae-sahne, .mn .mn-sahne';
  var gorulen = new WeakSet();
  new MutationObserver(function (ml) {
    ml.forEach(function (m) {
      if (m.type === 'attributes') { var t = m.target; if (t.matches && t.matches('.yan-panel.acik') && !gorulen.has(t)) { gorulen.add(t); cizgi(t); setTimeout(function () { gorulen.delete(t); }, 700); } return; }
      m.addedNodes.forEach(function (n) {
        if (n.nodeType !== 1) return;
        if (n.matches && n.matches(SECICI)) cizgi(n);
        else if (n.querySelector) { var i = n.querySelector(SECICI); if (i) requestAnimationFrame(function () { cizgi(i); }); }
      });
    });
  }).observe(document.body, { childList: true, subtree: false, attributes: true, attributeFilter: ['class'], subtree: true });
})();
