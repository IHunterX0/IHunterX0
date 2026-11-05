/* Sınav modu (r111). Hedef: sınav performansı. Sınava 7 gün ya da daha az kaldıysa köşede 🎯 belirir.
   - Panel: sınava kalan gün, 90 dk deneme sayacı ve dört hazırlık eylemi (deneme, eksik tekrarı, vadesi gelen kartlar, en zayıf konu). Her eylemin bitti ölçütü yazılı.
   - Sayaç kalıcıdır (localStorage 'sinav_sayac'); süre dolunca alarm sesiyle haber verir.
   - Veri yalnızca okunur: mevcut U.calismaOnerisi. Yeni içerik üretmez; 18:00'den sonra yeni konu önermez.
   - Ayar: 'sinav_modu' = '1' her zaman göster; anahtar yoksa otomatik (sınava 7 gün kala). */
(function () {
  'use strict';
  var U = window.Uygulama; if (!U) return;
  var el = U.el;
  var SAYAC_ANAHTAR = 'sinav_sayac', MOD_ANAHTAR = 'sinav_modu', DENEME_DK = 90;

  var css = document.createElement('style');
  css.textContent = '#sinavCip{position:fixed;left:16px;bottom:calc(64px + env(safe-area-inset-bottom,0px));z-index:59;height:40px;min-width:40px;padding:0 10px;border-radius:20px;border:1px solid #ffb84d;background:rgba(6,12,17,.92);color:#ffe2b0;font:600 13px var(--f-kod,monospace)}' +
    '#sinavCip.acil{border-color:#ff6b6b;color:#ffb3b3}#sinavCip[hidden]{display:none}' +
    '.sm-satir{display:grid;gap:4px;padding:8px 0;border-top:1px dashed var(--cizgi)}.sm-satir small{color:var(--metin-sonuk)}';
  document.head.appendChild(css);

  var chip = el('button', { id: 'sinavCip', type: 'button', 'aria-label': 'Sınav modu', title: 'Sınav modu' }, ['🎯']);
  chip.hidden = true;
  document.body.appendChild(chip);

  function moduAyar() { try { return localStorage.getItem(MOD_ANAHTAR); } catch (e) { return null; } }
  function moduYaz(v) { try { if (v == null) localStorage.removeItem(MOD_ANAHTAR); else localStorage.setItem(MOD_ANAHTAR, v); } catch (e) {} }
  function sayac() { try { var v = JSON.parse(localStorage.getItem(SAYAC_ANAHTAR) || 'null'); return v && v.bitis ? v : null; } catch (e) { return null; } }
  function sayacYaz(v) { try { if (v) localStorage.setItem(SAYAC_ANAHTAR, JSON.stringify(v)); else localStorage.removeItem(SAYAC_ANAHTAR); } catch (e) {} }
  function kalanDk(v) { return Math.max(0, Math.ceil((v.bitis - Date.now()) / 60000)); }
  function kalanGun(o) { return o && o.sinav && typeof o.sinav.gun === 'number' ? o.sinav.gun : null; }

  /* ---- deneme sayacı ---- */
  var zaman = null, sonOneri = null;
  function sayacBaslat() {
    if (sayac()) return sayac();
    var v = { bitis: Date.now() + DENEME_DK * 60000 };
    sayacYaz(v); zamanlayiciGuncelle(); return v;
  }
  function sayacBitir(sesle) {
    sayacYaz(null); zamanlayiciGuncelle();
    if (sesle) {
      try { U.toast('⏰ Deneme süresi doldu.'); } catch (e) {}
      try { if (window.CarvisAlarm) CarvisAlarm.sesBaslat('zil', false); } catch (e) {}
    }
  }
  function sayacTick() {
    var v = sayac(); if (!v) return;
    if (Date.now() >= v.bitis) return sayacBitir(true);
    chipGuncelle();
  }
  function zamanlayiciGuncelle() {
    if (sayac()) { if (!zaman) zaman = setInterval(sayacTick, 15000); }
    else if (zaman) { clearInterval(zaman); zaman = null; }
    chipGuncelle();
  }

  /* ---- köşe düğmesi ---- */
  function chipGuncelle() {
    var v = sayac(), z = moduAyar();
    chip.textContent = v ? '⏳ ' + kalanDk(v) + ' dk' : '🎯';
    chip.classList.toggle('acil', !!v && kalanDk(v) <= 10);
    var gun = kalanGun(sonOneri);
    var gorunur = !!v || z === '1' || (gun != null && gun <= 7);
    chip.hidden = !gorunur;
  }

  /* ---- öneri verisi (yalnız okunur) ---- */
  function oneriYenile() {
    if (!U.calismaOnerisi) return Promise.resolve(null);
    return U.calismaOnerisi().then(function (o) { sonOneri = o || null; chipGuncelle(); return sonOneri; })
      .catch(function () { sonOneri = null; chipGuncelle(); return null; });
  }

  /* ---- panel ---- */
  function ac() {
    var govde = U.panelAc('🎯 Sınav modu', 'Sınava kalan güne göre hazırlık');
    var baslik = el('h4', { text: 'Yükleniyor…' }); govde.appendChild(baslik);
    var sayacKutu = el('div'); govde.appendChild(sayacKutu);
    var liste = el('div'); govde.appendChild(liste);
    var zorla = el('input', { type: 'checkbox', checked: moduAyar() === '1' ? true : null, 'aria-label': 'Her zaman göster' });
    zorla.addEventListener('change', function () { moduYaz(zorla.checked ? '1' : null); chipGuncelle(); });
    govde.appendChild(el('label', { class: 'var-etiket', style: 'display:flex;gap:8px;align-items:center;margin-top:10px' }, [zorla, 'Her zaman göster']));

    function ciz(o) {
      var gun = kalanGun(o);
      baslik.textContent = gun == null ? 'Sınav tarihi girilmemiş (Plan sekmesinden gir)' : gun === 0 ? 'Sınav bugün' : gun === 1 ? 'Sınav yarın' : 'Sınava ' + gun + ' gün';
      sayacKutu.innerHTML = '';
      var v = sayac();
      if (v) {
        sayacKutu.appendChild(el('p', { text: '⏳ Deneme sayacı: ' + kalanDk(v) + ' dk kaldı' }));
        sayacKutu.appendChild(el('button', { class: 'dugme kucuk', type: 'button', text: 'Sayacı durdur', onclick: function () { sayacBitir(false); ciz(o); } }));
      } else {
        sayacKutu.appendChild(el('button', { class: 'dugme kucuk ana', type: 'button', text: 'Deneme sayacını başlat (90 dk)', onclick: function () { sayacBaslat(); ciz(o); try { U.toast('⏱ 90 dk başladı. Testler sekmesinden denemeni çöz.'); } catch (e) {} } }));
      }
      liste.innerHTML = '';
      var ilkEksik = (o && o.isler || []).filter(function (x) { return x.tur === 'eksik' && x.kitap != null && x.sira != null; })[0];
      var eylemler = [
        { ad: 'Deneme çöz', ola: 'Deneme bitti; her yanlışa tek cümle neden yaz.', hedef: '#test' },
        { ad: 'Eksik tekrarı', ola: 'Testler sekmesinde Eksikler\'den 10 soru çöz.', hedef: '#test' },
        { ad: 'Vadesi gelen kartlar', ola: 'Vadesi gelen kartların tamamı.', hedef: '#kartlar' },
        ilkEksik
          ? { ad: 'En zayıf konu: ' + (ilkEksik.konu || ilkEksik.ad || 'eksik konu'), ola: 'Zamanım yok özeti, sonra 5 soru.', hedef: '#' + U.okuHash(ilkEksik.kitap, ilkEksik.sira) }
          : { ad: 'En zayıf konu', ola: 'Eksik konu yok; Testler\'de yeni soru çöz.', hedef: '#test' }
      ];
      eylemler.forEach(function (x) {
        liste.appendChild(el('div', { class: 'sm-satir' }, [
          el('b', { text: x.ad }), el('small', { text: 'Bitti ölçütü: ' + x.ola }),
          el('a', { class: 'dugme kucuk', href: x.hedef, text: 'Aç' })
        ]));
      });
      liste.appendChild(el('p', { class: 'var-etiket', text: 'Öneri: 18:00’den sonra yeni konu açma; yalnız tekrar.' }));
    }
    oneriYenile().then(ciz);
  }

  chip.addEventListener('click', ac);
  zamanlayiciGuncelle();
  setTimeout(oneriYenile, 4000);
  setInterval(oneriYenile, 30 * 60000);

  window.SinavModu = { ac: ac, sayacBaslat: sayacBaslat, sayacTick: sayacTick, oneriYenile: oneriYenile };
})();
