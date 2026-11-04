/* 1001 — Jane anlık sorular (kullanıcı, 2026-11-04: "Jane bazen okurken bir anda belirip bana soru sorsun").
   Okuma sayfasında, sen etkinken, 8–18 dakikada bir, ekranın ortasındaki paragraftan tek kısa soru sorar.
   Kısıtlar: günde en çok 8; Carvis konuşurken, pomodoro molasında ya da başka bir kutu açıkken çıkmaz; 60 sn cevapsız kalırsa kendiliğinden kapanır.
   Kapatmak için: localStorage 'jane_anlik' = '0'. Cevap verirsen Jane bir kısa geri bildirim verir. */
(function () {
  'use strict';
  var U = window.Uygulama, A = window.KitapAyristir; if (!U || !A || !U.Y) return;
  var el = U.el, Y = U.Y;
  var KAPALI = false; try { KAPALI = localStorage.getItem('jane_anlik') === '0'; } catch (e) {}
  var css = document.createElement('style');
  css.textContent = '.jane-anlik{position:fixed;left:50%;bottom:calc(100px + env(safe-area-inset-bottom,0px));transform:translateX(-50%);z-index:1250;width:min(440px,calc(100vw - 24px));padding:14px 16px;border-radius:20px;color:#fbefd9;' +
    'background:linear-gradient(160deg,#2a2010,#071219 70%);backdrop-filter:none;box-shadow:0 0 0 1px rgba(255,211,138,.5),0 0 30px rgba(255,190,110,.22);animation:jaGir .45s cubic-bezier(.2,.9,.2,1.1)}' +
    '@keyframes jaGir{from{opacity:0;transform:translate(-50%,16px)}}' +
    '.jane-anlik .ja-ust{display:flex;gap:10px;align-items:center;margin-bottom:6px}.jane-anlik .ja-ust .jane-av{width:34px;height:34px;font-size:12px}.jane-anlik .ja-ust b{color:#ffd38a;font-size:14px}.jane-anlik .ja-ust span{font-size:12.5px;color:#e6c999}' +
    '.jane-anlik .ja-soru{margin:4px 0 8px;font-size:15.5px;line-height:1.5}.jane-anlik .ja-alt{display:flex;gap:8px;justify-content:flex-end;flex-wrap:wrap;margin-top:8px}' +
    '.jane-anlik textarea{width:100%;resize:none;min-height:56px;padding:8px 10px;border-radius:12px;border:1px solid rgba(255,211,138,.35);background:rgba(2,8,12,.6);color:#fff;font:14.5px/1.45 var(--f-govde,system-ui)}' +
    '.jane-anlik .ja-sonuc{margin-top:8px;padding:8px 10px;border-radius:12px;background:rgba(255,211,138,.08);font-size:14px;line-height:1.5}' +
    '@media (prefers-reduced-motion: reduce){.jane-anlik{animation:none}}';
  document.head.appendChild(css);
  var okumaSn = 0, sonEtkilesim = Date.now(), siradaki = 30, kartVar = false, mesgul = false, kok = null;

  function bugunAnahtar() { var d = new Date(); return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate(); }
  function gunluk() { try { var v = JSON.parse(localStorage.getItem('janeAnlikGun') || '{}'); return v.g === bugunAnahtar() ? v : { g: bugunAnahtar(), n: 0 }; } catch (e) { return { g: bugunAnahtar(), n: 0 }; } }
  function gunlukYaz(v) { try { localStorage.setItem('janeAnlikGun', JSON.stringify(v)); } catch (e) {} }
  // kart kapandıktan sonra sayaç baştan başlar: en az 45 sn, en çok 105 sn (rastgele)
  function sonrakiAralik() { return 45 + Math.floor(Math.random() * 61); }
  // kaydırdığın / dokunduğun pencere: Zamanım yok paneli, yüzen pencere ya da kitap; soru oradan sorulur
  function kokBul(t) { if (!t || !t.closest) return; var k = t.closest('.yan-panel, .hp, .yp-govde, .ai-metin, .sohbet-akis, .zy-alan, .metin, .okuma-alani'); if (k && !k.closest('.kenarda')) kok = k; }

  ['pointerdown', 'keydown', 'wheel', 'touchstart'].forEach(function (ev) { document.addEventListener(ev, function (e) { sonEtkilesim = Date.now(); kokBul(e.target); }, { passive: true, capture: true }); });
  window.addEventListener('scroll', function (e) { sonEtkilesim = Date.now(); kokBul(e.target); }, { passive: true, capture: true });

  function okumada() { return /^#oku-/.test(location.hash) && !document.hidden && Date.now() - sonEtkilesim < 120000; }
  function mola() { var P = U.Pomodoro && U.Pomodoro.anlik ? U.Pomodoro.anlik() : null; return !!(P && P.calisiyor && P.mod !== 'calis'); }
  function bos() {
    if (window.Carvis && (window.Carvis.konusuyor || window.Carvis.acik)) return false;
    if (document.querySelector('.bm-kutu, .pm-akis, .jane-anlik, .mn, .ae-halka, .kd-tekerlek, .holo.acik')) return false;
    return true;
  }

  // aktif (ekranda açık, küçültülmemiş, kenara park edilmemiş) pencere
  function aktifYan() {
    var y = document.querySelector('.yan-panel.acik'); if (!y) return null;
    var r = y.getBoundingClientRect(); if (r.width < 200 || r.right <= 0 || r.left >= innerWidth) return null;
    return y;
  }
  function aktifHp() {
    var best = null, bz = -1;
    document.querySelectorAll('.hp:not(.kenarda)').forEach(function (h) {
      var r = h.getBoundingClientRect(); if (r.width < 150 || r.height < 100 || r.right <= 0 || r.left >= innerWidth) return;
      var z = parseInt(getComputedStyle(h).zIndex, 10) || 0; if (z > bz) { bz = z; best = h; }
    });
    return best;
  }
  // öncelik: açık Zamanım yok paneli > en üstteki açık pencere > son dokunulan (kenarda değilse) > kitap
  function kaynakKok() {
    var y = aktifYan(); if (y) return y.querySelector('.yp-govde') || y;
    var h = aktifHp(); if (h) return h;
    if (kok && document.body.contains(kok) && !kok.closest('.kenarda')) return kok;
    return document.querySelector('.metin');
  }
  // okunan paragraflar: ekranda gerçekten geçen metin (kaydırdığın yerler). Önemli kutular (tuzak, hoca, sınav notu, formül) öne alınır.
  var okunan = [];
  function okunanlariTara() {
    var koku = kaynakKok(); if (!koku) return;
    koku.querySelectorAll('p, li').forEach(function (p) {
      var r = p.getBoundingClientRect();
      if (r.height < 10 || r.top < 0 || r.bottom > innerHeight) return;
      if (p.textContent.trim().length < 80 || p.dataset.jo === '1') return;
      p.dataset.jo = '1'; okunan.push(p); if (okunan.length > 120) okunan.shift();
    });
  }
  function paragrafSec() {
    okunanlariTara();
    var koku = kaynakKok(); if (!koku) return null;
    var aday = okunan.filter(function (p) { return document.body.contains(p) && koku.contains(p); });
    if (!aday.length) return null;
    var skor = function (p) {
      var s = Math.random() * 0.5, co = p.closest('.co');
      if (co) { s += 3; if (/tuzak|sınav|hoca|dikkat|formül|ayırt|önemli/i.test(co.textContent)) s += 2; }
      if (p.querySelector('strong, b')) s += 1;
      var n = p.textContent.length; if (n >= 120 && n <= 700) s += 1;
      return s;
    };
    aday.sort(function (x, y) { return skor(y) - skor(x); });
    return aday[0];
  }

  function soruIstem(metin) {
    return 'Sen Patrick Jane\'sin (The Mentalist): sakin, kendinden emin, biraz oyuncu; isabetli ve adil. Bir tıp öğrencisi şu paragrafı okudu:\n"""' + metin + '"""\n' +
      'Tek bir kısa soru sor. Soru, metinde AÇIKÇA yazan bir olguyu, mekanizmayı, sayıyı ya da ayırt edici noktayı yoklasın; öğrencinin yanlış anlayabileceği bir yere dokunsun. YASAK: "metinde ... var mı", "paragrafta cevap var mı", "bunu okudun mu" gibi meta sorular; metinde olmayan bilgi. Soru en çok 25 kelime olsun.\n' +
      'YALNIZ JSON: {"soru":"…","anahtar":"doğru cevabın 1-2 cümlelik özü"}';
  }
  // soru, paragrafta geçen bir olguya dayanmalı: ayırt edici kelimelerinin yarısından fazlası metinde geçmeli
  var DURDUR = { metin: 1, metinde: 1, paragraf: 1, paragrafta: 1, cevap: 1, cevabı: 1, öğrenci: 1, soru: 1, neden: 1, nedir: 1, nasıl: 1, hangi: 1, hangisi: 1, bunu: 1, olarak: 1, şekilde: 1, nedeni: 1, anlamı: 1, mıdır: 1, midir: 1, mudur: 1, değil: 1, olduğu: 1, sence: 1, kadar: 1, sonra: 1, önce: 1 };
  function normal(s) { return String(s || '').toLocaleLowerCase('tr').replace(/[^a-zçğıöşü0-9]+/g, ' '); }
  function metinde(soru, metin) {
    var m = ' ' + normal(metin) + ' ';
    var kel = normal(soru).split(' ').filter(function (w) { return w.length >= 5 && !DURDUR[w]; });
    if (!kel.length) return false;
    var hit = kel.filter(function (w) { return m.indexOf(' ' + w) >= 0 || m.indexOf(w) >= 0; }).length;
    return hit >= Math.max(1, Math.ceil(kel.length / 2));
  }
  U.okunanMetin = function () {
    okunanlariTara();
    var y = aktifYan(); if (!y) return '';
    var koku = y.querySelector('.yp-govde') || y;
    return okunan.filter(function (p) { return document.body.contains(p) && koku.contains(p) && !p.closest('[class*="js-"]'); })
      .map(function (p) { return p.textContent.trim(); }).join('\n').slice(-9000);
  };
  function geriBildirimIstem(soru, anahtar, cevap) {
    return 'Patrick Jane olarak öğrencinin cevabına 1-2 kısa cümleyle karşılık ver. Soru: ' + soru + '\nDoğru cevabın özü: ' + anahtar + '\nÖğrencinin cevabı: """' + cevap + '"""\n' +
      'Doğruysa kısaca kabul et ve cevabındaki en zayıf noktayı ima et; yanlış ya da eksikse hangi varsayımın çöktüğünü söyle. Övme, dolgu yok. YALNIZ JSON: {"jane":"…"}';
  }

  function kartGoster(soru, anahtar, paragraf) {
    kartVar = true;
    var g = gunluk(); g.n++; gunlukYaz(g);
    var zamanlayici = null, kapat = function () { if (zamanlayici) clearTimeout(zamanlayici); k.remove(); kartVar = false; siradaki = okumaSn + sonrakiAralik(); };
    var cevapAlani = el('div', { hidden: true });
    var girdi = el('textarea', { class: 'js-cevap', rows: 2, placeholder: 'Cevabın… (klavyenin mikrofonuyla sesli de yazabilirsin)', 'aria-label': 'Jane\'e cevap' });
    var gonder = el('button', { class: 'dugme ana kucuk', type: 'button', text: 'Gönder' });
    var sonuc = el('div', { class: 'ja-sonuc', hidden: true });
    cevapAlani.appendChild(girdi); cevapAlani.appendChild(el('div', { class: 'ja-alt' }, [gonder]));
    var cevapla = el('button', { class: 'dugme kucuk', type: 'button', text: 'Cevapla' }), sonra = el('button', { class: 'dugme kucuk', type: 'button', text: 'Sonra' });
    var k = el('div', { class: 'jane-anlik', role: 'alertdialog', 'aria-label': 'Patrick Jane sorusu' }, [
      el('div', { class: 'ja-ust' }, [el('div', { class: 'jane-av', text: 'PJ' }), el('div', {}, [el('b', { text: 'Patrick Jane' }), el('span', { text: ' bunu sormadan geçemedim' })])]),
      el('p', { class: 'ja-soru', text: soru }), cevapAlani, sonuc,
      el('div', { class: 'ja-alt' }, [sonra, cevapla])
    ]);
    document.body.appendChild(k);
    zamanlayici = setTimeout(kapat, 25000);
    sonra.addEventListener('click', kapat);
    cevapla.addEventListener('click', function () { cevapla.remove(); cevapAlani.hidden = false; if (zamanlayici) clearTimeout(zamanlayici); zamanlayici = setTimeout(kapat, 120000); try { girdi.focus({ preventScroll: true }); } catch (e) {} });
    gonder.addEventListener('click', function () {
      var c = girdi.value.trim(); if (c.length < 2) return;
      if (zamanlayici) clearTimeout(zamanlayici); gonder.disabled = true; sonuc.hidden = false; sonuc.textContent = 'Jane tartıyor…';
      Y.sample.json(geriBildirimIstem(soru, anahtar, c)).then(function (j) {
        sonuc.innerHTML = ''; sonuc.appendChild(el('p', { text: String((j && j.jane) || 'Not aldım.') }));
        zamanlayici = setTimeout(kapat, 9000);
      }).catch(function () { sonuc.textContent = 'Şu an tartamıyorum. Cevabını kendin karşılaştır.'; zamanlayici = setTimeout(kapat, 6000); });
    });
  }

  function dene() {
    if (mesgul || kartVar) return;
    if (!Y.sample || !Y.sample.json) return;
    var p = paragrafSec();
    if (!p) { siradaki = okumaSn + 60; return; }
    mesgul = true;
    var metin = p.textContent.trim().slice(0, 900);
    Y.sample.json(soruIstem(metin)).then(function (j) {
      mesgul = false;
      var soru = String((j && j.soru) || '').trim(), anahtar = String((j && j.anahtar) || '').trim();
      if (!soru || !anahtar || !okumada() || !bos()) { siradaki = okumaSn + 120; return; }
      if (!metinde(soru, metin)) { siradaki = okumaSn + 60; return; } // metinde karşılığı olmayan soru: atla
      kartGoster(soru, anahtar, metin);
    }).catch(function () { mesgul = false; siradaki = okumaSn + 900; });
  }

  setInterval(function () {
    if (KAPALI) return;
    if (!okumada() && !aktifYan()) return;
    okumaSn += 5;
    okunanlariTara();
    if (okumaSn < siradaki) return;
    if (kartVar || mesgul) return;
    if (gunluk().n >= 300) { siradaki = okumaSn + 1800; return; }
    if (mola() || !bos()) { siradaki = okumaSn + 60; return; }
    dene();
  }, 5000);

  // sınama: konsoldan Uygulama.janeAnlikDene() ile hemen bir soru
  U.janeAnlikDene = function () { mesgul = false; kartVar = false; dene(); };
})();
