/* Tasarım v2 ve dikkat ayarları (r113). tasarim.css'i yükler; ⚙ Carvis ayarları → "🎛 Tasarım ve dikkat" panelini açar.
   Ayarlar: 'tasarim_v2' ('0' eski görünüm), 'dikkat_kanca' ('0' kapalı). */
(function () {
  'use strict';
  var U = window.Uygulama;
  var yuk = document.createElement('link');
  yuk.rel = 'stylesheet'; yuk.href = 'tasarim.css';
  document.head.appendChild(yuk);

  function v2() { try { return localStorage.getItem('tasarim_v2') !== '0'; } catch (e) { return true; } }
  function dikkatAcik() { try { return localStorage.getItem('dikkat_kanca') !== '0'; } catch (e) { return true; } }
  function uygula() { document.documentElement.classList.toggle('tasarim-eski', !v2()); }

  function ac() {
    if (!U) return;
    var govde = U.panelAc('🎛 Tasarım ve dikkat', 'Görünüm ve dikkat kancası');
    var tv = U.el('input', { type: 'checkbox', checked: v2() ? true : null, 'aria-label': 'Yeni tasarım' });
    tv.addEventListener('change', function () {
      try { localStorage.setItem('tasarim_v2', tv.checked ? '1' : '0'); } catch (e) {}
      uygula();
    });
    var dk = U.el('input', { type: 'checkbox', checked: dikkatAcik() ? true : null, 'aria-label': 'Dikkat kancası' });
    dk.addEventListener('change', function () {
      try { localStorage.setItem('dikkat_kanca', dk.checked ? '1' : '0'); } catch (e) {}
    });
    var satir = 'display:flex;gap:8px;align-items:center;margin:10px 0';
    govde.appendChild(U.el('label', { class: 'var-etiket', style: satir }, [tv, ' Yeni tasarım (kapatınca eski görünüm)']));
    govde.appendChild(U.el('label', { class: 'var-etiket', style: satir }, [dk, ' Dikkat kancası: bölüm başında ön soru, dönünce "kaldığın yer"']));
  }

  uygula();
  window.TasarimAyar = { ac: ac, v2: v2, dikkatAcik: dikkatAcik };
})();
