/* C.A.R.V.I.S. — Boşta öğrenme (r137). Kullanıcı, 2026-11-08: "boş kaldığında sürekli kendini geliştirmenin yollarını bulsun,
   kişiliğe adaptasyonla, benim kişisel profilimle bilimsel makale okusun".
   Uygulama açık ve sen birkaç dakika dokunmadığında Carvis kendi kendine bir "tur" yapar:
   - Okuma turu: ilgi alanlarından ya da sana son sorduğun konulardan birini seçer, Europe PMC'de açık erişimli yeni bir makale bulur,
     yalnız makalenin özetine dayanarak sana göre (hedefin, sınav, ilgi) kısa bir not + 2 kart çıkarır. Bu not sonraki sohbetlerde
     Carvis'in istemine girer ("geçen gün şu makaleyi okudum…").
   - Üslup turu: sana son yazdıklarına bakıp nasıl konuşulmayı sevdiğini ve Carvis'in tekrar etmemesi gereken hatalarını özetler.
   Carvis kendi KODUNU değiştirmez; geliştirdiği şey hafızası, okuma listesi ve sana nasıl konuşacağıdır. Her şey cihazda saklanır,
   ayarlardan kapatılabilir ve silinebilir. Kota için: günde en çok GUN_TAVAN tur, turlar arası en az ARA_DK dakika, hafif model. */
(function () {
  'use strict';
  var U = window.Uygulama; if (!U) return;
  var el = U.el;
  var ANAHTAR = 'carvisBosta', BOS_DK = 4, ARA_DK = 25, GUN_TAVAN = 6, USLUP_GUN = 3;
  var D = yukle(), calisiyor = false, sonEtkin = Date.now(), dinleyici = [];

  function bos() { return { acik: true, kayit: [], okunan: [], gun: { t: '', n: 0 }, son: 0, sira: {}, ornek: [], uslup: [], hata: [], uslupT: 0, konular: [], konuT: 0, sonDurum: '' }; }
  function yukle() { try { return Object.assign(bos(), JSON.parse(localStorage.getItem(ANAHTAR) || '{}')); } catch (e) { return bos(); } }
  function kaydet() { try { localStorage.setItem(ANAHTAR, JSON.stringify(D)); } catch (e) {} dinleyici.forEach(function (f) { try { f(); } catch (e) {} }); }
  function bugun() { return new Date().toDateString(); }
  function durum(m) { D.sonDurum = m; kaydet(); }

  ['pointerdown', 'keydown', 'touchstart', 'wheel'].forEach(function (t) { window.addEventListener(t, function () { sonEtkin = Date.now(); }, { passive: true, capture: true }); });

  // Carvis'e yazdıklarını (yalnız senin mesajların) üslup öğrenmek için biriktir
  function orneklerTopla() {
    var C = window.Carvis; if (!C || !C.gecmis) return;
    var yeni = false;
    C.gecmis.forEach(function (m) {
      if (m.role !== 'user') return;
      var t = String(m.content || '').replace(/\s*\[olası:[^\]]*\]$/, '').trim();
      if (t.length < 3 || /^\[Ekranımı gösterdim/.test(t) || D.ornek.indexOf(t) >= 0) return;
      D.ornek.push(t.slice(0, 300)); yeni = true;
    });
    if (yeni) { D.ornek = D.ornek.slice(-40); kaydet(); }
  }

  function aiHazir() { return U.AI && U.AI.hazir ? U.AI.hazir().catch(function () { return false; }) : Promise.resolve(!!(U.Y && U.Y.sample)); }
  function json(istem) { return U.Y.sample.json(istem, { hafif: true, cache: false }); }

  function konuHavuzu() {
    return (U.Depo && U.Depo.oku ? U.Depo.oku('makale').catch(function () { return {}; }) : Promise.resolve({})).then(function (v) {
      var l = (v.ilgiler || []).map(function (i) { return { konu: i.konu, sorgu: i.sorgu || i.konu, kaynak: 'ilgi alanın' }; });
      D.konular.forEach(function (k) { if (!l.some(function (x) { return x.konu.toLowerCase() === k.konu.toLowerCase(); })) l.push({ konu: k.konu, sorgu: k.sorgu, kaynak: 'son sorduğun' }); });
      return l;
    });
  }
  // Son sorduklarından okumaya değer konuları çıkar (2 günde bir)
  function konuKesfet() {
    var son = D.ornek.slice(-15);
    if (son.length < 3 || Date.now() - D.konuT < 2 * 864e5) return Promise.resolve(false);
    return json('Bir tıp öğrencisinin yapay zekâ asistanına son yazdığı mesajlar aşağıda. Bunlardan, bilimsel makale okumaya değer en fazla 4 TIP/BİLİM konusu çıkar (müzik, uygulama ayarı, sohbet gibi konuları atla). ' +
      'Her biri için Europe PMC\'de iyi sonuç verecek İngilizce bir sorgu yaz (2-4 terim, gerekirse OR).\nYALNIZ JSON: {"konular":[{"konu":"Türkçe kısa ad","sorgu":"..."}]}\n\nMESAJLAR:\n- ' + son.join('\n- '))
      .then(function (j) {
        var l = (j && j.konular || []).filter(function (k) { return k && k.konu && k.sorgu; }).slice(0, 4);
        D.konuT = Date.now();
        l.forEach(function (k) { if (!D.konular.some(function (x) { return x.konu.toLowerCase() === String(k.konu).toLowerCase(); })) D.konular.push({ konu: String(k.konu).slice(0, 60), sorgu: String(k.sorgu).slice(0, 200), t: Date.now() }); });
        D.konular = D.konular.slice(-12); kaydet(); return l.length > 0;
      });
  }

  function profilOzeti() {
    var p = []; try { var pr = JSON.parse(localStorage.getItem('carvisProfil') || '{}'); if (pr.hafiza && pr.hafiza.length) p.push('Kendisi hakkında söyledikleri: ' + pr.hafiza.slice(-8).map(function (h) { return h.m; }).join('; ')); } catch (e) {}
    if (D.uslup.length) p.push('Üslup tercihleri: ' + D.uslup.join('; '));
    return 'Tıp 1. sınıf öğrencisi; hedefi yurt dışında PhD ve akademik kariyer. ' + p.join(' ');
  }

  function okumaTuru() {
    return konuHavuzu().then(function (l) {
      if (!l.length) return konuKesfet().then(function (v) { return v ? konuHavuzu() : []; });
      return l;
    }).then(function (l) {
      if (!l.length) { durum('Okuyacak konu yok: Makaleler sayfasından ilgi alanı ekle ya da bana birkaç bilim sorusu sor.'); return null; }
      l.sort(function (a, b) { return (D.sira[a.konu] || 0) - (D.sira[b.konu] || 0); });
      var k = l[0]; D.sira[k.konu] = Date.now(); kaydet();
      if (!U.makaleBul) throw new Error('makale modülü yok');
      durum('“' + k.konu + '” üzerine makale arıyorum…');
      return U.makaleBul(k.sorgu, { acik: true, yeni: true, adet: 8 }).then(function (r) {
        return r.length ? r : U.makaleBul(k.sorgu, { acik: true, adet: 8 });
      }).then(function (r) {
        var m = r.filter(function (x) { return x.ozet && x.ozet.length > 300 && D.okunan.indexOf(x.id) < 0; })[0];
        if (!m) { durum('“' + k.konu + '” için okumadığım açık erişimli makale kalmadı.'); return null; }
        durum('Okuyorum: ' + m.baslik.slice(0, 90));
        return json('Sen C.A.R.V.I.S.\'sin; kullanıcın boştayken onun için bir makale okudun. KULLANICI: ' + profilOzeti() + '\n' +
          'Aşağıdaki makaleyi YALNIZ özetindeki bilgiye dayanarak işle; özette olmayan sayı, sonuç ya da iddia ekleme. Türkçe, sade, kısa.\n' +
          'YALNIZ JSON: {"ozet":"3 cümle: ne sordular, nasıl baktılar, ne buldular","onem":"1 cümle: bu ONA neden ilginç (hedefi/ilgisi açısından)",' +
          '"sinav":"1 cümle: 1. sınıf ders bilgisine bağlantı (temel mekanizma); yoksa boş","kartlar":[{"on":"kısa soru","arka":"1-2 cümle cevap"},{"on":"...","arka":"..."}],' +
          '"not":"en fazla 25 kelime: sonraki sohbette bunu ona nasıl açacağın (kendine not)","terimler":["İngilizce terim — Türkçe karşılığı"]}\n\n' +
          'KONU: ' + k.konu + '\nBAŞLIK: ' + m.baslik + ' (' + m.dergi + ', ' + m.yil + ')\nÖZET: ' + m.ozet.slice(0, 3500))
          .then(function (j) {
            if (!j || !j.ozet) throw new Error('boş yanıt');
            var kay = { id: m.id, konu: k.konu, neden: k.kaynak, baslik: m.baslik, dergi: m.dergi, yil: m.yil, link: m.link, pmcid: m.pmcid || '',
              ozet: String(j.ozet).slice(0, 700), onem: String(j.onem || '').slice(0, 300), sinav: String(j.sinav || '').slice(0, 300),
              kartlar: (j.kartlar || []).filter(function (c) { return c && c.on && c.arka; }).slice(0, 3).map(function (c) { return { on: String(c.on).slice(0, 200), arka: String(c.arka).slice(0, 400) }; }),
              not: String(j.not || '').slice(0, 220), terimler: (j.terimler || []).slice(0, 5).map(String), t: Date.now(), goruldu: false };
            D.kayit.unshift(kay); D.kayit = D.kayit.slice(0, 50);
            D.okunan.push(m.id); D.okunan = D.okunan.slice(-300);
            durum('Okudum: ' + m.baslik.slice(0, 90));
            return kay;
          });
      });
    });
  }

  function uslupTuru() {
    var son = D.ornek.slice(-25);
    durum('Seninle nasıl konuştuğumu gözden geçiriyorum…');
    return json('Sen C.A.R.V.I.S.\'sin (tıp öğrencisinin asistanı). Kullanıcının sana son yazdıkları aşağıda. Kendini geliştirmek için çıkar:\n' +
      '1) "uslup": onunla nasıl konuşulmalı (cevap uzunluğu, dil, ton, ne zaman doğrudan sonuca gelinmeli); en fazla 4 madde, her biri ≤ 15 kelime.\n' +
      '2) "hatalar": mesajlarda Carvis\'e karşı şikâyet/düzeltme varsa (ör. "yanlış", "kısa yaz", "bunu sormadım"), tekrar etmemen gerekenler; en fazla 3 madde. Yoksa boş liste.\n' +
      'Yalnız mesajlarda görünen şeye dayan; kişiliği hakkında hüküm verme, yalnız tercih yaz. YALNIZ JSON: {"uslup":["..."],"hatalar":["..."]}\n\nMESAJLAR:\n- ' + son.join('\n- '))
      .then(function (j) {
        D.uslup = (j && j.uslup || []).slice(0, 4).map(function (x) { return String(x).slice(0, 120); });
        D.hata = (j && j.hatalar || []).slice(0, 3).map(function (x) { return String(x).slice(0, 120); });
        D.uslupT = Date.now(); durum('Üslup notlarımı güncelledim.');
        return { uslup: D.uslup, hata: D.hata };
      });
  }

  // Tek tur: önce (gerekirse) üslup, yoksa okuma. zorla: kullanıcı "şimdi dene" dedi
  function tur(zorla) {
    if (calisiyor) return Promise.resolve(null);
    if (D.gun.t !== bugun()) D.gun = { t: bugun(), n: 0 };
    if (!zorla && D.gun.n >= GUN_TAVAN) return Promise.resolve(null);
    calisiyor = true; D.son = Date.now(); D.gun.n += 1; kaydet();
    return aiHazir().then(function (ok) {
      if (!ok) { durum('Yapay zekâ bağlı değil; ayarlardan bir sağlayıcı ekle.'); return null; }
      var uslupZamani = D.ornek.length >= 6 && Date.now() - D.uslupT > USLUP_GUN * 864e5;
      return (uslupZamani ? uslupTuru() : konuKesfet().catch(function () {}).then(okumaTuru));
    }).catch(function (e) { durum('Bu tur olmadı: ' + String(e && e.message || e).slice(0, 120)); return null; })
      .then(function (r) { calisiyor = false; kaydet(); return r; });
  }

  function kontrol() {
    orneklerTopla();
    if (!D.acik || calisiyor || document.hidden || navigator.onLine === false) return;
    if (window.Carvis && window.Carvis.acik) return;
    var simdi = Date.now();
    if (simdi - sonEtkin < BOS_DK * 60e3 || simdi - D.son < ARA_DK * 60e3) return;
    tur(false);
  }
  setInterval(kontrol, 60000);

  // Carvis istemine girecek kısa metin (eşzamanlı)
  function istemMetni() {
    var l = [];
    if (D.uslup.length) l.push('ÜSLUP NOTLARIN (kullanıcının mesajlarından kendin öğrendin; uy): ' + D.uslup.join('; ') + '.');
    if (D.hata.length) l.push('TEKRARLAMA (daha önce şikâyet ettiği şeyler): ' + D.hata.join('; ') + '.');
    var k = D.kayit.slice(0, 4);
    if (k.length) l.push('BOŞTAYKEN OKUDUKLARIN (Europe PMC, açık erişim; yalnız konu açılırsa ya da uygun anda tek cümleyle bahset, kaynağı söyle, özette olmayanı uydurma):\n' +
      k.map(function (x) { return '- [' + x.konu + '] ' + x.baslik + ' (' + x.dergi + ', ' + x.yil + '): ' + x.ozet + (x.not ? ' | kendine not: ' + x.not : ''); }).join('\n'));
    return l.join('\n');
  }

  /* ---------- ayarlar bölümü ---------- */
  function ayarBolumu() {
    var kutu = el('div', { class: 'bb-kutu', style: 'margin:14px 0;border-top:1px solid var(--cizgi);padding-top:10px' });
    function ciz() {
      kutu.innerHTML = '';
      kutu.appendChild(el('h4', { text: '🧠 Boştayken kendini geliştirme' }));
      var ac = el('input', { type: 'checkbox', checked: D.acik ? true : null });
      ac.addEventListener('change', function () { D.acik = ac.checked; kaydet(); });
      kutu.appendChild(el('label', { style: 'display:flex;gap:8px;align-items:center;font-size:13px;margin:6px 0' }, [ac, 'Uygulama açıkken ' + BOS_DK + ' dk dokunmazsan makale okusun ve üslubunu öğrensin (günde en çok ' + GUN_TAVAN + ' tur, hafif model)']));
      var gn = D.gun.t === bugun() ? D.gun.n : 0;
      kutu.appendChild(el('p', { class: 'var-etiket', text: 'Bugün ' + gn + '/' + GUN_TAVAN + ' tur' + (D.sonDurum ? ' · ' + D.sonDurum : '') }));
      if (D.uslup.length || D.hata.length) kutu.appendChild(el('p', { style: 'font-size:13px;margin:6px 0' }, ['Öğrendiğim üslup: ' + D.uslup.concat(D.hata.map(function (h) { return 'yapma: ' + h; })).join(' · ')]));
      var sonuc = el('span', { class: 'var-etiket' });
      kutu.appendChild(el('div', { style: 'display:flex;gap:8px;flex-wrap:wrap;margin:6px 0' }, [
        el('button', { class: 'dugme kucuk', type: 'button', text: '▶ Şimdi bir tur yap', onclick: function () { sonuc.textContent = 'Çalışıyor…'; tur(true).then(function (r) { sonuc.textContent = r ? 'Bitti.' : (D.sonDurum || 'Olmadı.'); ciz(); }); } }),
        el('button', { class: 'dugme kucuk', type: 'button', text: '🗑 Öğrendiklerini sil', onclick: function () { if (!confirm('Okuma notları, üslup notları ve biriken mesaj örnekleri silinsin mi?')) return; var a = D.acik; D = bos(); D.acik = a; kaydet(); ciz(); } }),
        sonuc]));
      D.kayit.slice(0, 12).forEach(function (x) {
        var kartlar = el('div', { style: 'display:grid;gap:4px;margin-top:6px' });
        x.kartlar.forEach(function (c) {
          var b = el('button', { class: 'cip', type: 'button', text: '＋ Karta ekle', onclick: function () { if (!U.kartEkle) return; U.kartEkle({ on: c.on, arka: c.arka, kitap: '', bolum: null, blok: null, kaynak: x.baslik + ' (' + x.yil + ') ' + x.link, ai: true }).then(function () { b.textContent = 'Eklendi ✓'; b.disabled = true; }); } });
          kartlar.appendChild(el('div', { style: 'font-size:13px' }, [el('b', { text: 'S: ' }), c.on, el('br'), el('b', { text: 'C: ' }), c.arka, ' ', b]));
        });
        kutu.appendChild(el('details', { class: 'mk-kart', style: 'margin:8px 0' }, [
          el('summary', { style: 'cursor:pointer;font-size:14px' }, [el('b', { text: x.konu + ' · ' }), x.baslik]),
          el('p', { class: 'mk-meta', text: (x.dergi || '') + ' · ' + (x.yil || '') + ' · ' + new Date(x.t).toLocaleString('tr-TR') + ' · seçme nedeni: ' + (x.neden || '') }),
          el('p', { style: 'font-size:13.5px', text: x.ozet }),
          x.onem ? el('p', { style: 'font-size:13px', text: '💡 ' + x.onem }) : null,
          x.sinav ? el('p', { style: 'font-size:13px', text: '📘 ' + x.sinav }) : null,
          x.terimler.length ? el('p', { class: 'var-etiket', text: x.terimler.join(' · ') }) : null,
          kartlar,
          el('div', { class: 'mk-dugmeler' }, [
            el('a', { class: 'dugme kucuk', href: x.link, target: '_blank', rel: 'noopener', text: '↗ Makale' }),
            el('span', { class: 'etiket-kucuk ai', text: 'AI üretimi · yalnız özetten' })])
        ]));
      });
      x0();
    }
    function x0() { D.kayit.forEach(function (x) { x.goruldu = true; }); try { localStorage.setItem(ANAHTAR, JSON.stringify(D)); } catch (e) {} }
    ciz();
    return kutu;
  }

  window.CarvisBosta = { tur: tur, istemMetni: istemMetni, ayarBolumu: ayarBolumu, durum: function () { return D; }, dinle: function (f) { dinleyici.push(f); },
    _test: { kontrol: kontrol, bosZaman: function (ms) { sonEtkin = Date.now() - ms; D.son = 0; }, sifirla: function () { D = bos(); kaydet(); } } };
})();
