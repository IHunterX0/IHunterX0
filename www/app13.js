/* 1001 — "Kitap ekle" sayfasına yeni kitap promptu: kopyala / indir. Claude'a ders notlarıyla birlikte verilir, çıkan JSON (ya da JSON + img/ ZIP) buradan yüklenir. */
(function () {
  'use strict';
  var U = window.Uygulama;
  var el = U.el, $ = U.$, toast = U.toast, Y = U.Y;
  var onceki = U.GORUNUMLER.ekle;
  U.GORUNUMLER.ekle = function () {
    onceki.apply(this, arguments);
    var sayfa = $('#ana .sayfa'); if (!sayfa) return;
    var kutu = el('details', { class: 'kt-anahtar', id: 'kitapPromptu' });
    kutu.appendChild(el('summary', { text: '📘 Yeni kitap promptu (ör. histoloji): Claude\'a kitabı bu kurallarla yazdır' }));
    var ic = el('div');
    ic.appendChild(el('ol', {}, [
      el('li', { text: 'Promptu kopyala.' }),
      el('li', { text: 'Claude\'a ders notlarını, slaytları ve çıkmış soruları ekle, promptu yapıştırıp gönder.' }),
      el('li', { text: 'Claude tek bir JSON verir. Görsel varsa JSON\'u img/ klasörüyle birlikte ZIP\'le.' }),
      el('li', { text: 'Dosyayı bu sayfaya bırak. Önizleme raporunu kontrol et, sonra onayla.' })]));
    var pre = el('pre', { class: 'kod', style: 'max-height:280px;overflow:auto;white-space:pre-wrap;font-size:12px', text: 'Yükleniyor…' });
    var metin = '';
    fetch('kitap_promptu.md').then(function (r) { return r.text(); }).then(function (t) { metin = t; pre.textContent = t; }).catch(function () { pre.textContent = 'Prompt dosyası açılamadı.'; });
    ic.appendChild(el('div', { class: 'yp-dugmeler' }, [
      el('button', { class: 'dugme kucuk ana', type: 'button', onclick: function () {
        if (!metin) return;
        (navigator.clipboard ? navigator.clipboard.writeText(metin) : Promise.reject()).then(function () { toast('Prompt kopyalandı.'); }, function () {
          var r = document.createRange(); r.selectNodeContents(pre); var s = getSelection(); s.removeAllRanges(); s.addRange(r); toast('Kopyalanamadı; metin seçildi, elle kopyala.');
        });
      } }, ['📋 Kopyala']),
      el('button', { class: 'dugme kucuk', type: 'button', onclick: function () {
        if (!metin) return;
        var b = new Blob([metin], { type: 'text/markdown' });
        if (Y.downloads) Y.downloads.save({ filename: '1001-kitap-promptu.md', data: b }).catch(function () {});
        else { var a = el('a', { href: URL.createObjectURL(b), download: '1001-kitap-promptu.md' }); document.body.appendChild(a); a.click(); a.remove(); }
      } }, ['⬇ İndir'])]));
    ic.appendChild(pre);
    kutu.appendChild(ic);
    var birak = $('.birak', sayfa);
    sayfa.insertBefore(kutu, birak || null);
  };
})();
