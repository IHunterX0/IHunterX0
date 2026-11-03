/* 1001 — Carvis canlı modu (kullanıcı, 2026-11-03: "Carvis ekranın tümünü kaplamasın demiştim, arkada işlem yapmama izin vermiyor;
   Gemini Live gibi bir şey olsun"). Balon varsayılan olarak altta ince bir "canlı şerit": yalnız son mesaj(lar), durum ve giriş.
   Sayfa görünür ve dokunulabilir kalır. ⤢ ile tam sohbet, ⤡ ile tekrar şerit; şerit üst çubuğundan sürüklenip taşınabilir. */
(function () {
  'use strict';
  if (/[?&]gomulu\b/.test(location.search)) return;
  var U = window.Uygulama; if (!U) return;
  var css = document.createElement('style');
  css.textContent = [
    '.cv-balon.canli{width:min(640px,calc(100vw - 32px))!important;max-height:none!important;height:auto!important;' +
      'background:linear-gradient(180deg,rgba(4,22,28,.78),rgba(2,10,14,.86))!important;backdrop-filter:blur(16px) saturate(1.2);-webkit-backdrop-filter:blur(16px) saturate(1.2);border-radius:26px!important;clip-path:none!important}',
    '.cv-balon.canli .cv-sahne{display:none!important}',
    '.cv-balon.canli .cv-akis{max-height:118px!important;overflow:hidden!important;padding:6px 14px!important;-webkit-mask-image:linear-gradient(180deg,transparent,#000 30%);mask-image:linear-gradient(180deg,transparent,#000 30%);display:flex!important;flex-direction:column;justify-content:flex-end}',
    '.cv-balon.canli .cv-akis > *:not(:nth-last-child(-n+2)){display:none!important}',
    '.cv-balon.canli .cv-akis .cv-kaynak,.cv-balon.canli .cv-akis .etiket-kucuk{display:none}',
    '.cv-balon.canli .cv-ust{padding:6px 10px!important;cursor:grab;touch-action:none}',
    '.cv-balon.canli .cv-alt{padding:6px 10px!important}',
    '.cv-balon .cv-boyut{font-size:15px}',
    '.cv-balon.canli.suruklendi{transition:none!important}',
    /* kullanıcı, 2026-11-03: "soldaki yazı şeysini daha müsait yere taşı" → sağ alt köşe (projektör kalktı, orası boş);
       ortadaki büyük küreyle çakışmasın diye dar. Dik ekranda sağ üst. Sürüklenince elle verilen yer geçerli. */
    '.cv-balon.canli{width:min(460px,40vw,calc(100vw - var(--cv-sag,16px) - 16px))!important;left:auto!important;top:auto!important;right:var(--cv-sag,16px)!important;bottom:calc(92px + env(safe-area-inset-bottom,0px))!important;transform:none!important;transform-origin:100% 100%!important}',
    '@media (orientation:portrait){.cv-balon.canli{width:min(420px,calc(100vw - 32px))!important;bottom:auto!important;top:calc(12px + env(safe-area-inset-top,0px))!important;transform-origin:100% 0!important}}',
    '.cv-balon.canli .cv-durum{min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
    '.cv-balon.canli .cv-ust{flex-wrap:nowrap!important;gap:6px!important}.cv-balon.canli .cv-ust > *{flex-shrink:0}.cv-balon.canli .cv-ust .cv-durum{flex:1 1 0!important}',
    'html body.cv-canli-acik .jv-altyazi{bottom:var(--cv-ust,100px)!important;left:var(--cv-x,50%)!important;width:var(--cv-w,min(860px,calc(100vw - 32px)))!important}',
    '.cv-balon.canli.tasindi{right:auto!important;bottom:auto!important;left:var(--tx)!important;top:var(--ty)!important}'
  ].join('\n');
  document.head.appendChild(css);
  function kur() {
    var b = document.querySelector('.cv-balon'); if (!b || b.dataset.canli) return !!b;
    b.dataset.canli = '1';
    var canli = true; try { canli = localStorage.getItem('cv_canli') !== '0'; } catch (e) {}
    var ust = b.querySelector('.cv-ust');
    var dug = U.el('button', { class: 'ikon-dugme cv-boyut', type: 'button', 'aria-label': 'Sohbeti genişlet / daralt', title: 'Canlı şerit ↔ tam sohbet' });
    function uygula() {
      b.classList.toggle('canli', canli); dug.textContent = canli ? '⤢' : '⤡';
      try { localStorage.setItem('cv_canli', canli ? '1' : '0'); } catch (e) {}
      if (!canli) { b.classList.remove('tasindi'); b.style.left = ''; b.style.top = ''; b.style.bottom = ''; b.style.right = ''; b.style.transform = ''; }
    }
    dug.addEventListener('click', function (e) { e.stopPropagation(); canli = !canli; uygula(); });
    if (ust) { var kapat = ust.querySelector('[aria-label="Kapat"]'); ust.insertBefore(dug, kapat || null); }
    uygula();
    // sürükleme (yalnız canlı modda, üst çubuktan)
    var s = null;
    if (ust) {
      ust.addEventListener('pointerdown', function (e) { if (!canli || e.target.closest('button, input, select')) return; var r = b.getBoundingClientRect(); s = { x: e.clientX - r.left, y: e.clientY - r.top, id: e.pointerId }; try { ust.setPointerCapture(e.pointerId); } catch (x) {} b.classList.add('suruklendi'); });
      ust.addEventListener('pointermove', function (e) {
        if (!s || e.pointerId !== s.id) return; var w = b.offsetWidth, h = b.offsetHeight;
        var x = Math.max(8, Math.min(innerWidth - w - 8, e.clientX - s.x)), y = Math.max(8, Math.min(innerHeight - h - 8, e.clientY - s.y));
        b.classList.add('tasindi'); b.style.setProperty('--tx', x + 'px'); b.style.setProperty('--ty', y + 'px');
      });
      ['pointerup', 'pointercancel'].forEach(function (ev) { ust.addEventListener(ev, function () { s = null; b.classList.remove('suruklendi'); }); });
    }
    // yazmaya başlayınca ya da uzun cevapta tam sohbete geçmek isteyene kısa yol: girişe çift dokunma → genişlet
    var giris = b.querySelector('.cv-alt input'); if (giris) giris.addEventListener('dblclick', function () { if (canli) { canli = false; uygula(); } });
    // sağda bir yan panel (ayarlar, Zamanım yok…) açıksa şerit onun soluna kayar, altında kalmaz
    setInterval(function () {
      var p = document.querySelector('.yan-panel.acik'), sag = 16;
      if (p && innerWidth > innerHeight) { var r = p.getBoundingClientRect(); if (r.width && r.right > innerWidth - 40) sag = Math.round(innerWidth - r.left + 12); }
      if (innerWidth - sag < 320) sag = 16;
      var v = sag + 'px'; if (b.style.getPropertyValue('--cv-sag') !== v) b.style.setProperty('--cv-sag', v);
      // altyazı şeridin üstüne çıkar, üst üste binmesin
      var gorunur = canli && !b.hidden && b.getClientRects().length > 0; document.body.classList.toggle('cv-canli-acik', gorunur);
      if (gorunur) { var bt = b.getBoundingClientRect(); if (bt.top > innerHeight / 2) { var ds = document.documentElement.style; ds.setProperty('--cv-ust', Math.round(innerHeight - bt.top + 10) + 'px'); ds.setProperty('--cv-x', Math.round(bt.left + bt.width / 2) + 'px'); ds.setProperty('--cv-w', Math.round(Math.max(bt.width, 320)) + 'px'); } else document.body.classList.remove('cv-canli-acik'); }
    }, 400);
    return true;
  }
  if (!kur()) { var d = setInterval(function () { if (kur()) clearInterval(d); }, 400); setTimeout(function () { clearInterval(d); }, 20000); }
})();
