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
    '.cv-balon.canli.suruklendi{transition:none!important}'
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
      if (!canli) { b.style.left = ''; b.style.top = ''; b.style.bottom = ''; b.style.right = ''; b.style.transform = ''; }
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
        b.style.transform = 'none'; b.style.right = 'auto'; b.style.bottom = 'auto'; b.style.left = x + 'px'; b.style.top = y + 'px';
      });
      ['pointerup', 'pointercancel'].forEach(function (ev) { ust.addEventListener(ev, function () { s = null; b.classList.remove('suruklendi'); }); });
    }
    // yazmaya başlayınca ya da uzun cevapta tam sohbete geçmek isteyene kısa yol: girişe çift dokunma → genişlet
    var giris = b.querySelector('.cv-alt input'); if (giris) giris.addEventListener('dblclick', function () { if (canli) { canli = false; uygula(); } });
    return true;
  }
  if (!kur()) { var d = setInterval(function () { if (kur()) clearInterval(d); }, 400); setTimeout(function () { clearInterval(d); }, 20000); }
})();
