/* Tıkla-öğren (r130): kitap, makale ve tam metinde seçilen metin için açıklama ve kitap araması.
   Seçim yapınca küçük bir kutu çıkar: "Açıkla" (yapay zekâ varsa bağlamlı açıklama, yoksa kitaptan kavram), "Kitapta ara" (çevrimdışı çalışır). */
(function () {
  'use strict';
  var U = window.Uygulama; if (!U) return;
  var kutu = null;

  function kapat() { if (kutu) { kutu.remove(); kutu = null; } }
  function arac(ad) { var l = (U.sohbetAraclari ? U.sohbetAraclari() : []).filter(function (a) { return a.name === ad; }); return l[0] || null; }
  function metin(sonuc) {
    if (typeof sonuc === 'string') return sonuc;
    if (!Array.isArray(sonuc) || !sonuc.length) return 'Kitapta eşleşme bulunamadı.';
    return sonuc.slice(0, 3).map(function (x) { return (x.konum || '') + ': ' + (x.metin || '').slice(0, 220); }).join('\n\n');
  }
  function cevapYaz(alan, t) { alan.innerHTML = ''; String(t).split('\n').forEach(function (satir) { if (satir.trim()) alan.appendChild(U.el('p', { text: satir })); }); }

  function baglam(node) {
    var b = node && node.nodeType === 3 ? node.parentNode : node;
    while (b && b.nodeType === 1 && b.tagName !== 'P' && b.tagName !== 'LI' && b.tagName !== 'DIV') b = b.parentNode;
    return ((b && b.textContent) || '').replace(/\s+/g, ' ').trim().slice(0, 600);
  }

  function goster(secilen, rect, bag) {
    kapat();
    var cikti = U.el('div', { class: 'secim-cikti', style: 'margin-top:8px;font-size:14px;line-height:1.5;max-height:45vh;overflow:auto' });
    var kisa = secilen.length > 60 ? secilen.slice(0, 60) + '…' : secilen;
    kutu = U.el('div', { class: 'secim-kutu', role: 'dialog', 'aria-label': 'Seçilen metin', style: 'position:fixed;z-index:9999;max-width:min(92vw,460px);padding:12px;border-radius:14px;background:#071a22;color:#dff;border:1px solid #2a8;box-shadow:0 8px 30px rgba(0,0,0,.5)' }, [
      U.el('div', { style: 'font-size:12px;opacity:.7', text: '“' + kisa + '”' }),
      U.el('div', { style: 'display:flex;gap:8px;margin-top:8px;flex-wrap:wrap' }, [
        U.el('button', { class: 'dugme kucuk ana', type: 'button', text: 'Açıkla', onclick: function () {
          cevapYaz(cikti, 'düşünüyor…');
          if (U.Y && U.Y.sample && U.Y.sample.json) {
            var istem = 'Öğrenci bir metinde şunu seçti: """' + secilen + '"""\nSeçimin geçtiği bağlam: """' + bag + '"""\nKısaca (en fazla 4 cümle, Türkçe) açıkla: bu ne, neden böyle, neden önemli. Sonunda kendini test etmek için tek bir kısa soru yaz. YALNIZ JSON: {"aciklama":"…","soru":"…"}';
            U.Y.sample.json(istem).then(function (j) { cevapYaz(cikti, (j.aciklama || '') + (j.soru ? '\n\nKontrol sorusu: ' + j.soru : '')); },
              function () { cevapYaz(cikti, 'Yapay zekâ yanıt veremedi; kitaptan bakalım.'); kitapta(secilen, cikti); });
          } else {
            var k = arac('kavram_getir');
            if (k) k.execute({ ad: secilen }).then(function (r) { cevapYaz(cikti, metin(r)); }, function () { kitapta(secilen, cikti); });
            else kitapta(secilen, cikti);
          }
        } }),
        U.el('button', { class: 'dugme kucuk', type: 'button', text: 'Kitapta ara', onclick: function () { cevapYaz(cikti, 'aranıyor…'); kitapta(secilen, cikti); } }),
        U.el('button', { class: 'dugme kucuk', type: 'button', text: 'Kapat', onclick: kapat })
      ]),
      cikti
    ]);
    document.body.appendChild(kutu);
    var asagi = rect.bottom + 300 <= window.innerHeight; var top = asagi ? rect.bottom + 8 : Math.max(8, rect.top - 300), left = Math.max(8, Math.min(rect.left, window.innerWidth - 480));
    kutu.style.top = Math.max(8, top) + 'px'; kutu.style.left = left + 'px';
  }

  function kitapta(sorgu, cikti) {
    var a = arac('kitapta_ara');
    if (!a) { cevapYaz(cikti, 'Kitap araması kullanılamıyor.'); return; }
    a.execute({ sorgu: sorgu.slice(0, 80) }).then(function (r) { cevapYaz(cikti, metin(r)); }, function () { cevapYaz(cikti, 'Arama yapılamadı.'); });
  }

  function secimi(e) {
    if (e.target && e.target.closest && e.target.closest('.secim-kutu, input, textarea, select')) return;
    setTimeout(function () {
      var s = window.getSelection && window.getSelection();
      if (!s || s.isCollapsed || s.rangeCount === 0) return;
      var t = String(s.toString() || '').replace(/\s+/g, ' ').trim();
      if (t.length < 3 || t.length > 300) return;
      var anchor = s.anchorNode;
      if (!anchor || !document.getElementById('ana') || !document.getElementById('ana').contains(anchor)) return;
      goster(t, s.getRangeAt(0).getBoundingClientRect(), baglam(anchor));
    }, 0);
  }
  document.addEventListener('mouseup', secimi);
  document.addEventListener('touchend', secimi);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') kapat(); });
  U.secimKapat = kapat;
})();
