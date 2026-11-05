/* Jane ile 0'dan öğren (r112). Kullanıcı: "Jane tekrar var, bir de konu anlatımı olsun; 0'dan öğreniyorsan Patrick Jane'in teknikleriyle öğretsin".
   Patrick Jane teknikleri, bu modülde sırayla:
   1) Gözlem: bölümden üç ipucu; önce bak, sonra konuş.
   2) Tahmin: anlatmadan önce kendi tahminini yaz (boş bırakılabilir).
   3) Açıklama: kitap metni alt başlık alt başlık; her birinde bir kontrol sorusu.
   4) Tuzak: yaygın yanılgıyı göster; bölümü kendi cümlenle anlat.
   5) Kapanış: kayıt; yanlışlar Eksikler'e düşer.
   Kaynak: yalnız kitabın metni ve soruları. Yapay zekâ kullanılmaz; her adım deterministik. İlerleme 'jane_ders' belgesinde. */
(function () {
  'use strict';
  var U = window.Uygulama; if (!U) return;
  var el = U.el, toast = U.toast;
  var SON_ANAHTAR = 'jane_ders_son';
  var TA_STIL = 'width:100%;background:var(--zemin);border:1px solid var(--cizgi);border-radius:6px;color:var(--metin);padding:6px;font:14px var(--f-govde)';

  function ilkCumle(metin) {
    var t = String(metin || '').replace(/\s+/g, ' ').trim();
    var k = t.indexOf('. ');
    return (k > 0 ? t.slice(0, k + 1) : t).slice(0, 220);
  }
  function baslikYaz(kap, metin) { kap.appendChild(el('h4', { text: metin })); }
  // Liste sırasında ders için uygun bölümü olan ilk kitabın dizini (yoksa null)
  function ilkKullanilabilir(liste, i) {
    if (i >= liste.length) return Promise.resolve(null);
    return U.Kitaplik.ac(liste[i].id).then(function (kj) {
      var var_ = (kj.bolumler || []).some(function (b) { return !b.ozel && (b.altlar || []).some(function (a) { return a.baslik; }); });
      return var_ ? i : ilkKullanilabilir(liste, i + 1);
    }).catch(function () { return ilkKullanilabilir(liste, i + 1); });
  }
  // Yalnız gerçek metni olan alt başlıklar: bloklar dizisi olmayanlar atlanır (eski ve özel bölümler)
  function altOk(a) { return !!a && !!a.baslik && Array.isArray(a.bloklar); }
  function metinOf(a, n) { try { return U.altMetin(a, n) || ''; } catch (e) { return ''; } }

  /* ---- 0. seçim ---- */
  function ac() {
    var govde = U.panelAc('📖 Jane: 0\'dan öğret', 'Gözlem, tahmin, açıklama, tuzak, kapanış');
    var kap = el('div'); govde.appendChild(kap);
    secimEkrani(kap);
  }

  function secimEkrani(kap) {
    kap.innerHTML = '';
    kap.appendChild(el('p', { class: 'var-etiket', text: 'Bir bölüm seç. Önce sen tahmin edeceksin, sonra anlatacağım.' }));
    var kitapSec = el('select', { 'aria-label': 'Kitap' });
    var bolumSec = el('select', { 'aria-label': 'Bölüm' });
    var basla = el('button', { class: 'dugme ana', type: 'button', text: 'Başlat' });
    kap.appendChild(el('label', { class: 'var-etiket', style: 'display:grid;gap:4px' }, ['Kitap', kitapSec]));
    kap.appendChild(el('label', { class: 'var-etiket', style: 'display:grid;gap:4px' }, ['Bölüm', bolumSec]));
    kap.appendChild(basla);

    function bolumleriDoldur() {
      bolumSec.innerHTML = '';
      var kid = kitapSec.value; if (!kid) return Promise.resolve();
      return U.Kitaplik.ac(kid).then(function (kj) {
        kj.bolumler.forEach(function (b, i) {
          if (b.ozel || !(b.altlar || []).some(function (a) { return a.baslik; })) return;
          bolumSec.appendChild(el('option', { value: String(i), text: b.kisa || b.baslik || ('Bölüm ' + (i + 1)) }));
        });
      });
    }
    U.Kitaplik.katalog().then(function (liste) {
      liste = liste || [];
      liste.forEach(function (k) { kitapSec.appendChild(el('option', { value: k.id, text: String(k.baslik || k.id).replace(/^1001\s*/, '') })); });
      // açılışta ders için uygun bölümü olan ilk kitabı seç
      return ilkKullanilabilir(liste, 0).then(function (i) {
        if (i != null) kitapSec.value = liste[i].id;
        return bolumleriDoldur();
      });
    }).catch(function () { kap.appendChild(el('p', { class: 'hata-metni', text: 'Kitap listesi okunamadı.' })); });
    kitapSec.addEventListener('change', bolumleriDoldur);
    basla.addEventListener('click', function () {
      var kid = kitapSec.value, bi = parseInt(bolumSec.value, 10);
      if (!kid || isNaN(bi)) return toast('Önce bir bölüm seç.');
      U.Kitaplik.ac(kid).then(function (kj) { dersBaslat(kap, kid, kj, bi); });
    });
  }

  /* ---- ders ---- */
  // Bölüm içeriği (bloklar) tembel yüklenir: önce tam bölümü al, sonra dersi kur
  function dersBaslat(kap, kid, kj, bi) {
    if (!kj.bolumler[bi]) return;
    kap.innerHTML = '';
    U.Kitaplik.bolumAc(kid, bi).then(function (bo) { dersIcerik(kap, kid, kj, bi, bo); })
      .catch(function () { kap.appendChild(el('p', { class: 'hata-metni', text: 'Bölüm yüklenemedi.' })); });
  }
  function dersIcerik(kap, kid, kj, bi, bo) {
    var b = Object.assign({}, kj.bolumler[bi], { altlar: (bo && bo.altlar) || [] });
    var altlar = (b.altlar || []).filter(altOk);
    kap.innerHTML = '';
    if (!altlar.length) {
      kap.appendChild(el('p', { text: 'Bu bölümde alt başlık yok. Başka bir bölüm seç.' }));
      kap.appendChild(el('button', { class: 'dugme', type: 'button', text: 'Bölüm seçimine dön', onclick: function () { secimEkrani(kap); } }));
      return;
    }
    U.Kitaplik.sorular(kid).catch(function () { return []; }).then(function (sorular) {
      var havuz = (sorular || []).filter(function (q) { return q.bolum === b.id && (q.varyantlar || []).some(function (v) { return v.siklar && v.siklar.length && v.cevap; }); });
      adim1(kap, { kid: kid, kj: kj, b: b, bi: bi, altlar: altlar, havuz: havuz, tahmin: '' });
    });
  }

  // 1) Gözlem: üç ipucu, önce bak
  function adim1(kap, d) {
    kap.innerHTML = '';
    baslikYaz(kap, '1. Gözlem · ' + (d.b.kisa || d.b.baslik));
    kap.appendChild(el('p', { text: 'Açıklamadan önce bak. Bu bölümden üç ipucu:' }));
    d.altlar.slice(0, 3).forEach(function (a, i) {
      kap.appendChild(el('p', { class: 'var-etiket', text: 'İpucu ' + (i + 1) + ' · ' + a.baslik + ': ' + ilkCumle(metinOf(a, 400)) }));
    });
    kap.appendChild(el('button', { class: 'dugme ana', type: 'button', text: 'Tahminimi yazayım', onclick: function () { adim2(kap, d); } }));
  }

  // 2) Tahmin: anlatmadan önce
  function adim2(kap, d) {
    kap.innerHTML = '';
    baslikYaz(kap, '2. Tahmin · ' + (d.b.kisa || d.b.baslik));
    kap.appendChild(el('p', { text: 'Üç ipucuna bakarak: bu bölüm neyi açıklıyor, hangi mekanizma ya da hangi kural var? Kısa yaz. Boş bırakabilirsin, ama tahmin öğrenmenin yarısıdır.' }));
    var ta = el('textarea', { rows: '3', style: TA_STIL, 'aria-label': 'Tahminin' });
    kap.appendChild(ta);
    kap.appendChild(el('button', { class: 'dugme ana', type: 'button', text: 'Açıklamayı göster', onclick: function () { d.tahmin = ta.value.trim(); adim3(kap, d, 0); } }));
  }

  // 3) Açıklama: alt başlık alt başlık; her birinde bir kontrol sorusu (varsa)
  function adim3(kap, d, i) {
    kap.innerHTML = '';
    if (i >= d.altlar.length) return adim4(kap, d);
    var a = d.altlar[i];
    baslikYaz(kap, '3. Açıklama · ' + (i + 1) + '/' + d.altlar.length + ' · ' + a.baslik);
    kap.appendChild(el('div', { class: 'var-etiket', style: 'white-space:pre-wrap;line-height:1.5', text: metinOf(a, 1400) }));
    var q = d.havuz[i];
    var v = q ? q.varyantlar.filter(function (x) { return x.siklar && x.siklar.length && x.cevap; })[0] : null;
    var ileri = el('button', { class: 'dugme ana', type: 'button', text: 'Devam', onclick: function () { adim3(kap, d, i + 1); } });
    if (!v) { kap.appendChild(ileri); return; }
    var kutu = el('div', { class: 'pm-tekrar' });
    kutu.appendChild(el('p', { html: '<b>Kontrol:</b> ' + v.govde }));
    var geri = el('p', { class: 'var-etiket', text: '' });
    v.siklar.forEach(function (s) {
      kutu.appendChild(el('button', { class: 'dugme kucuk sik', type: 'button', html: '<b>' + s.h + ')</b> ' + s.m, onclick: function () {
        if (kutu._bitti) return; kutu._bitti = true;
        var dogru = s.h === v.cevap;
        if (dogru) geri.textContent = 'Doğru.';
        else {
          var c = v.siklar.filter(function (z) { return z.h === v.cevap; })[0];
          geri.textContent = 'Yanlış. Doğru: ' + v.cevap + ') ' + (c ? c.m : '') + '. Bu seçeneği seçtiysen hangi varsayımla seçtin? Bunu not et.';
          if (U.eksikEkle) U.eksikEkle({ kitap: d.kid, bolum: d.b.kisa || d.b.baslik, sira: d.bi, konu: q.konu || '', soru: U.duz ? U.duz(v.govde).slice(0, 160) : '', bilmiyor: false, kaynak: 'jane_ders' });
        }
      } }));
    });
    kutu.appendChild(geri);
    kap.appendChild(kutu);
    kap.appendChild(ileri);
  }

  // 4) Tuzak: yaygın yanılgı, sonra kendi cümlen
  function adim4(kap, d) {
    kap.innerHTML = '';
    baslikYaz(kap, '4. Tuzak · ' + (d.b.kisa || d.b.baslik));
    kap.appendChild(el('p', { text: 'Yaygın hata: terimi tanımak, mekanizmayı anlamak demek değildir. Bu bölümü “bildiğini” sanabilirsin, çünkü isimleri tanıyorsun. Şimdi bölümü bir cümleyle, kendi kelimelerinle anlat.' }));
    var ta = el('textarea', { rows: '3', style: TA_STIL, 'aria-label': 'Kendi cümlen' });
    kap.appendChild(ta);
    kap.appendChild(el('button', { class: 'dugme ana', type: 'button', text: 'Kapat', onclick: function () { d.birCumle = ta.value.trim(); adim5(kap, d); } }));
  }

  // 5) Kapanış: kayıt ve sonraki bölüm
  function adim5(kap, d) {
    kap.innerHTML = '';
    baslikYaz(kap, '5. Kapanış · ' + (d.b.kisa || d.b.baslik));
    kap.appendChild(el('ul', {}, d.altlar.map(function (a) { return el('li', { text: a.baslik }); })));
    if (d.tahmin) kap.appendChild(el('p', { class: 'var-etiket', text: 'Tahminin: ' + d.tahmin.slice(0, 200) }));
    if (d.birCumle) kap.appendChild(el('p', { class: 'var-etiket', text: 'Kendi cümlen: ' + d.birCumle.slice(0, 240) }));
    kayitYaz(d);
    kap.appendChild(el('p', { text: 'Kaydedildi.' }));
    kap.appendChild(el('button', { class: 'dugme ana', type: 'button', text: 'Sonraki bölüm', onclick: function () { sonrakiBolum(kap, d); } }));
    kap.appendChild(el('button', { class: 'dugme', type: 'button', text: 'Bölüm seçimine dön', onclick: function () { secimEkrani(kap); } }));
  }

  function kayitYaz(d) {
    try { localStorage.setItem(SON_ANAHTAR, JSON.stringify({ kitap: d.kid, bolum: d.bi })); } catch (e) {}
    U.depoGuncelle('jane_ders', function (v) {
      v.kayit = v.kayit || {};
      v.kayit[d.kid + ':' + d.b.id] = { t: Date.now(), tahmin: (d.tahmin || '').slice(0, 300) };
    }, 400);
  }

  function sonrakiBolum(kap, d) {
    var n = d.bi + 1;
    while (n < d.kj.bolumler.length && !(d.kj.bolumler[n].altlar || []).some(function (a) { return a.baslik; })) n++;
    if (n >= d.kj.bolumler.length) { toast('Bu kitapta başka bölüm yok.'); return secimEkrani(kap); }
    dersBaslat(kap, d.kid, d.kj, n);
  }

  // Okuma sayfasındaki düğmeden: bu kitap ve bölümle doğrudan başlar (bölüm uygun değilse seçim ekranı)
  function baslat(kid, bi) {
    var govde = U.panelAc('📖 Jane: 0\'dan öğret', 'Gözlem, tahmin, açıklama, tuzak, kapanış');
    var kap = el('div'); govde.appendChild(kap);
    return Promise.resolve().then(function () { return U.Kitaplik.ac(kid); }).then(function (kj) {
      if (!kj || !kj.bolumler || !kj.bolumler[bi]) return secimEkrani(kap);
      dersBaslat(kap, kid, kj, bi);
    }).catch(function () { secimEkrani(kap); });
  }
  window.JaneDers = { ac: ac, baslat: baslat };
})();
