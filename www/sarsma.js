/* 1001 — Patrick Jane sarsılma turu.
   Kullanıcı, 2026-11-03: "Zamanım yok'ta ilk metni ben okuyup geçebileyim; Patrick Jane anlatımında beni biraz sarssın, beynimin
   otomatik doldurduğu yerleri sorgulatsın — iki aşamalı, sürtünmesiz"; "Jane kısmı biraz daha uzun olabilir, sarsılmayı seviyorum".
   Tasarım (Gemini + GPT kognitif stil raporlarının birleşimi):
   - Jane bölümde öğrencinin büyük ihtimalle "otomatik doldurduğu" 6 varsayımı seçer; her seferinde TEK, hedefli, açık uçlu soru.
   - Öğrenci cevap yazar (klavyenin mikrofonuyla sesli de olur) + güven seçer: eminim / sanırım / tahmin.
   - Yanlış/eksikse doğruyu hemen söylemez: çöken varsayımı yüzüne vurur + karşı örnek ipucu → ikinci deneme → sonra çözüm.
   - Doğruysa bırakmaz: daha zor bir stres testi takip sorusu.
   - "Emin ama yanlış" = otomatik doldurma → Eksikler'e ve janeOto listesine; 1 gün sonra Jane aynı kitabın turunda geri sorar.
   - Her cevap janeKalibrasyon'a (tür × güven × sonuç): hangi tür varsayımda yanıldığın veriyle görülsün. */
(function () {
  'use strict';
  var U = window.Uygulama, A = window.KitapAyristir; if (!U || !A) return;
  var el = U.el, Y = U.Y, fnv = A.fnv, duz = U.duz;
  var GUN = 864e5, TUR = 6;
  var TUR_AD = { 'gizli-basamak': 'Gizli basamak', 'mikro-kisit': 'Mikro kısıt', 'duzenleyici-celiski': 'Düzenleyici çelişki', 'kisir-dongu': 'Kısır döngü', 'sinir-kosulu': 'Sınır koşulu', 'ayirt-etme': 'Ayırt etme', 'kosul-degistir': 'Koşulu değiştir', 'tuzak-onerme': 'Gizli yanlış önerme', 'geri-donus': 'Geri dönüş' };
  var GUVEN = [['emin', 'Eminim'], ['saniyorum', 'Sanırım'], ['tahmin', 'Tahmin']];

  function uretIstem(kj, bolum, cikmis, eksik, n, okunan) {
    return 'Sen Patrick Jane\'sin (The Mentalist). Bir tıp öğrencisi aşağıdaki metni okudu (yalnız okuduğu kısım) ve konuyu bildiğini düşünüyor. ' +
      'Onun bilişsel profili: mekanizmayı ve genel mantığı çok hızlı kurar; ama genel mantığı kurunca aradaki mikro ayrıntıları (hangi enzim, hangi hücre bölmesi, kofaktör, ' +
      'düzenleyici sinyal, istisna, sıra/yön/sayı) kendi makro mantığıyla ("böyle olmak zorunda") doldurup bunu gerçek bilgi sanma riski taşır. Didaktik düzeltmeden sıkılır, ' +
      'yapısına yönelik isabetli saldırıdan öğrenir.\n' +
      'Görevin: bu bölümde onun büyük ihtimalle OTOMATİK DOLDURDUĞU ' + n + ' varsayımı bul ve her biri için tek, keskin, açık uçlu bir soru yaz.\n' +
      'Kurallar:\n- Soru bilginin kendisini değil, kurduğu yapının stres altındaki dayanıklılığını hedeflesin: koşulu değiştir, istisna, düzenleyici çelişki, gizli ara basamak, kısır döngü, sınır koşulu, benzer iki kavramı ayırt etme. Türleri çeşitlendir.\n' +
      '- Her sorunun cevabı YALNIZ aşağıdaki metinden kesin olarak çıkarılabilsin. Metinde olmayan bilgiyi sorma, uydurma; emin olmadığın sayı/sıra verme. Metnin dışında konu açma.\n' +
      '- Çıkmış sorularda sınanan noktaları ve öğrencinin geçmiş yanlışlarını öncele.\n' +
      '- En az 2 soru "tuzak-onerme" türünde olsun: sorunun içine Jane\'in kayıtsızca, kendinden emin söylediği YANLIŞ bir önerme göm (ör. "X zaten sitozolde çalıştığına göre…"). Öğrenci önermeyi düzeltmeden cevaplarsa yakalanır. Bu türde "beklenen"in ilk maddesi "Önermedeki hata: …" olsun ve doğrusunu yazsın.\n' +
      '- Jane\'in üslubu (The Mentalist): sakin, kendini beğenmiş, oyuncu; soğuk okuma yapar ("Şu an aklından \'tabii ki X\' geçti, değil mi?"), dikkati başka yere çeker, kişinin içgüdüsel ilk cevabını tetikleyip sonra onu sorgular, şüphe eker. Kısa cümleler. Övmez, terapist dili yok, küçümsemez; isabetli ve adil. Öğrenciyi bir cevaba bağlanmaya zorlar.\n' +
      'Her soru için alanlar:\n"varsayim": öğrencinin büyük ihtimalle kurduğu yanlış ya da eksik varsayım (1 cümle)\n' +
      '"tur": gizli-basamak | mikro-kisit | duzenleyici-celiski | kisir-dongu | sinir-kosulu | ayirt-etme | kosul-degistir | tuzak-onerme\n' +
      '"soru": Jane ağzından 1-3 cümle\n"beklenen": doğru cevabın özü, 2-4 kısa madde (dizi) — değerlendirme anahtarı\n' +
      '"ipucu": ilk yanlışta verilecek karşı örnek ya da çelişki; cevabı SÖYLEMEDEN düşündürsün (1-2 cümle, Jane ağzından)\n' +
      '"cozum": Jane ağzından 3-5 cümle: hangi varsayım çöküyor, doğru mekanizma, akılda kalan ayırt etme anahtarı\n' +
      '"takip": öğrenci doğru cevaplarsa soracağın daha zor stres testi sorusu (1-2 cümle; yine metne dayalı)\n"takip_beklenen": 2-3 kısa madde (dizi)\n"konu": 2-5 kelime\n' +
      'YALNIZ JSON: {"sorular":[{"varsayim":"…","tur":"…","soru":"…","beklenen":["…"],"ipucu":"…","cozum":"…","takip":"…","takip_beklenen":["…"],"konu":"…"}]}\n\n' +
      'BÖLÜM: ' + (bolum.kisa || bolum.baslik) + '\nOKUNAN METİN:\n"""\n' + (okunan || '') + '\n"""\n\n' +
      'ÇIKMIŞ SORULAR (bu bölüm):\n' + (cikmis || '(yok)') + '\n\nÖĞRENCİNİN BU BÖLÜMDEKİ YANLIŞLARI:\n' + (eksik || '(yok)');
  }
  function puanIstem(soru, beklenen, cevap, guven, son, davranis) {
    return 'Patrick Jane olarak bir tıp öğrencisinin açık uçlu cevabını değerlendir.\nSORU: ' + soru + '\nDOĞRU CEVABIN ÖZÜ:\n- ' + beklenen.join('\n- ') +
      '\nÖĞRENCİNİN CEVABI: """' + cevap + '"""\nÖĞRENCİNİN GÜVENİ: ' + guven + '\nDAVRANIŞI (gözlenen, gerçek): ' + (davranis || '-') + '\n' + (son ? 'BU SON DENEME.\n' : 'İLK DENEME (bir hakkı daha var).\n') +
      'Kurallar: YALNIZ SORUNUN SORDUĞU noktaya bak. Soruda istenmeyen ek bilgi, kapsam dışı ayrıntı ya da öğrencinin ekstra söylediği doğru şeyler eksik sayılmaz. Soruyu doğru karşılıyorsa "dogru" de. ' +
      'İfade farkı, yazım hatası, Türkçe/Latince farkı önemsiz. "kismen" yalnız sorunun istediği kritik noktanın bir parçası eksikse verilir. ' +
      'Sorunun istediği noktada YANLIŞ ya da uydurma bir bilgi varsa "yanlis"; "cokme" alanında açıkça adını koy.\n' +
      'Soru metninde Jane\'in sunduğu bir önerme yanlışsa ve öğrenci onu düzeltmeden kabul ettiyse cevap en fazla "kismen"dir.\n' +
      'Bu öğrenci tek cevap veriyor; ikinci şans yok. Cevabı olduğu gibi değerlendir.\n' +
      '"jane": Patrick Jane\'in tepkisi, 2-4 cümle; sakin, oyuncu, kendinden emin, isabetli. DAVRANIŞ verisinden soğuk okuma yap (ör. "Üç kez sildin. İlk yazdığın neydi?", "Başlamadan önce 12 saniye bekledin; bildiğin bir şeyi beklemezsin."); veride olmayanı uydurma. Doğruysa övme: kısaca kabul et, cevabındaki en zayıf halkayı ima et. ' +
      (!son ? 'Kısmen/yanlışsa DOĞRU CEVABI SÖYLEME; hangi varsayımın çöktüğünü yüzüne vur. ' : 'Bu son deneme: kısmen/yanlışsa doğru cevabı açıkça söyleyebilirsin. ') +
      'Güveni "emin" olduğu hâlde yanlışsa bunu özellikle vurgula ("Emindin. İşte tam da bu yüzden tehlikelisin…" gibi).\n' +
      'YALNIZ JSON: {"durum":"dogru|kismen|yanlis","cokme":"…","jane":"…"}';
  }
  function dizi(x) { return (Array.isArray(x) ? x : x ? [x] : []).map(String).filter(Boolean).slice(0, 5); }
  function temiz(q) {
    if (!q || !q.soru) return null;
    var b = dizi(q.beklenen); if (!b.length) return null;
    return { varsayim: String(q.varsayim || ''), tur: TUR_AD[q.tur] ? q.tur : 'gizli-basamak', soru: String(q.soru), beklenen: b, ipucu: String(q.ipucu || ''), cozum: String(q.cozum || ''),
      takip: String(q.takip || ''), takip_beklenen: dizi(q.takip_beklenen), konu: String(q.konu || '') };
  }
  function kalibre(kj, bolum, tur, guven, durum) {
    U.depoGuncelle('janeKalibrasyon', function (v) { v.liste = (v.liste || []).concat([{ t: Date.now(), kitap: kj.id, sira: bolum.sira, tur: tur, guven: guven, durum: durum }]).slice(-1500); }, 300).catch(function () {});
  }
  function otoEkle(kj, bolum, q) {
    U.depoGuncelle('janeOto', function (v) {
      var l = (v.liste || []).filter(function (x) { return x.soru !== q.soru; });
      l.push({ kitap: kj.id, sira: bolum.sira, bolumAd: bolum.kisa || bolum.baslik, soru: q.soru, beklenen: q.beklenen, cozum: q.cozum, ipucu: q.ipucu, konu: q.konu, varsayim: q.varsayim, t: Date.now(), sonra: Date.now() + GUN, kez: 0 });
      v.liste = l.slice(-200);
    }, 200).catch(function () {});
  }
  function otoGuncelle(q, dogru) {
    U.depoGuncelle('janeOto', function (v) {
      (v.liste || []).forEach(function (x) { if (x.soru === q.soru) { x.kez = (x.kez || 0) + 1; x.sonra = Date.now() + (dogru ? (x.kez >= 2 ? 0 : 4 * GUN) : GUN); if (dogru && x.kez >= 2) x.bitti = true; } });
      v.liste = (v.liste || []).filter(function (x) { return !x.bitti; });
    }, 200).catch(function () {});
  }

  U.janeSorgu = function (kutu, kj, bolum, veriFn, turNo) {
    turNo = turNo || 1;
    kutu.innerHTML = ''; kutu.hidden = false;
    var yuk = el('div', { class: 'yukleniyor', text: 'Jane bölümü okuyor, seni nerede yakalayacağını seçiyor…' }); kutu.appendChild(yuk);
    var okunanM = U.okunanMetin ? U.okunanMetin() : '';
    var anahtar = fnv('janeSorgu3|' + kj.id + '|' + bolum.id + '|' + turNo + '|' + okunanM.length + '|' + okunanM.slice(-300));
    var son = null, blofSayisi = 0, blofKandi = 0; // son cevabın davranışı (Jane'in soğuk okuması için)
    function okuma() {
      if (!son) return 'Rahat ol. Sadece birkaç soru. Ama her cevabında bir şey saklıyorsun ve ben onu bulacağım.';
      if (son.blofKandi) return 'Az önce doğru cevabını bir kaş kaldırışıma sattın. Bakalım bu sefer neye inanacaksın.';
      if (son.guven === 'emin' && son.durum !== 'dogru') return 'Az önce emindin. O güven şimdi nerede, merak ediyorum.';
      if (son.silme >= 3) return 'Önceki soruda ' + son.silme + ' kez sildin. Kararsızlık parmaklarından okunuyor.';
      if (son.ilkTus >= 15) return 'Başlamak için ' + son.ilkTus + ' saniye bekledin. Bildiğin bir şeyi beklemezsin.';
      if (son.durum === 'dogru' && son.sure < 25) return 'Hızlı cevap verdin. Hızlı cevaplar genelde ezberden gelir. Şimdi ezberin olmadığı yere gidiyoruz.';
      if (son.sureAsti) return 'Süreyi aştın. Panik iyi bir öğretmendir; ikinci ders geliyor.';
      return ['Şimdi biraz daha derine. Gözünü kırpma.', 'Bir sonrakinde çoğu kişi aynı yere basıyor. Sen de basacaksın; bakalım.', 'Sakin. Sadece içgüdüne güven. …Ya da güvenme.'][Math.floor(Math.random() * 3)];
    }
    var geri = U.Depo.oku('janeOto').then(function (v) {
      var simdi = Date.now();
      return (v.liste || []).filter(function (x) { return x.kitap === kj.id && x.sonra <= simdi; }).slice(0, 2).map(function (x) {
        return { varsayim: x.varsayim || '', tur: 'geri-donus', soru: x.soru, beklenen: x.beklenen || [], ipucu: x.ipucu || '', cozum: x.cozum || '', takip: '', takip_beklenen: [], konu: x.konu || '', geri: true, bolumAd: x.bolumAd };
      });
    }).catch(function () { return []; });
    var yeni = U.AI.onbellekOku(anahtar).then(function (onb) {
      if (onb && onb.json) return onb.json;
      return (veriFn ? veriFn() : Promise.resolve(['', ''])).then(function (r) {
        return Y.sample.json(uretIstem(kj, bolum, r[0], r[1], TUR, okunanM || (U.bolumOzu ? U.bolumOzu(bolum, 2500) : ''))).then(function (j) { U.AI.onbellekYaz(anahtar, { json: j, eylem: 'jane-sorgu', kitap: kj.id, t: Date.now() }); return j; });
      });
    });
    Promise.all([geri, yeni]).then(function (r) {
      var l = r[0].concat((r[1] && r[1].sorular || []).map(temiz).filter(Boolean).slice(0, TUR));
      if (!r[1] || !(r[1].sorular || []).length) throw new Error('Jane bu sefer soru kuramadı; tekrar dene.');
      yuk.remove(); calistir(l);
    }).catch(function (e) {
      yuk.remove();
      kutu.appendChild(el('p', { class: 'hata-metni', text: e && e.code ? U.AI.hataMetni(e) : String(e && e.message || e) }));
      kutu.appendChild(el('button', { class: 'dugme kucuk', type: 'button', text: 'Yeniden dene', onclick: function () { U.janeSorgu(kutu, kj, bolum, veriFn, turNo); } }));
    });

    function calistir(l) {
      var sonuc = { saglam: 0, kismen: 0, coken: 0, oto: [] };
      var bas = el('div', { class: 'js-bas' }, [el('b', { text: 'Sarsılma turu' }), el('span', { class: 'js-sayac' })]);
      var cubuk = el('div', { class: 'js-cubuk' }, [el('i')]);
      kutu.appendChild(bas); kutu.appendChild(cubuk);
      var sahne = el('div', { class: 'js-sahne' }); kutu.appendChild(sahne);
      var i = 0;
      function sayac() { bas.lastChild.textContent = Math.min(i + 1, l.length) + ' / ' + l.length; cubuk.firstChild.style.width = (i / l.length * 100) + '%'; }
      function sonraki() {
        if (i >= l.length) return bitir();
        sayac(); var q = l[i]; var kart = el('div', { class: 'js-kart' + (q.geri ? ' geri' : '') }); sahne.appendChild(kart);
        kart.appendChild(el('div', { class: 'js-etiket', text: (TUR_AD[q.tur] || '') + (q.geri ? ' · ' + (q.bolumAd || '') + ' · geçen sefer emindin ve yanıldın' : '') + (q.konu ? ' · ' + q.konu : '') }));
        sor(kart, q, q.soru, q.beklenen, 1, false, function (durum, ilkDurum, ilkGuven) {
          if (q.geri) otoGuncelle(q, durum === 'dogru');
          else if (ilkGuven === 'emin' && ilkDurum !== 'dogru') { otoEkle(kj, bolum, q); sonuc.oto.push(q.varsayim || q.konu || q.soru); }
          // ikinci denemede toparlanan cevap sağlam sayılmaz
          if (durum === 'dogru' && ilkDurum === 'dogru') sonuc.saglam++; else if (durum === 'dogru' || durum === 'kismen') sonuc.kismen++; else sonuc.coken++;
          if (durum !== 'dogru' && !q.geri && U.eksikEkle) U.eksikEkle({ kitap: kj.id, bolum: bolum.id, sira: bolum.sira, konu: q.konu || 'Jane sorgusu', soru: q.soru, bilmiyor: durum === 'bilmiyor', kaynak: 'jane-sorgu' });
          var devam = function () { i++; kart.classList.add('kapali'); sonraki(); setTimeout(function () { var s = sahne.lastChild; if (s && s.scrollIntoView) s.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 80); };
          if (durum === 'dogru' && q.takip) {
            var tk = el('div', { class: 'js-takip' }); kart.appendChild(tk);
            tk.appendChild(el('div', { class: 'js-etiket', text: 'Stres testi · Jane bırakmıyor' }));
            sor(tk, q, q.takip, q.takip_beklenen.length ? q.takip_beklenen : q.beklenen, 1, true, function () { ileriDug(kart, devam); });
          } else ileriDug(kart, devam);
        });
      }
      function bitir() {
        cubuk.firstChild.style.width = '100%'; bas.lastChild.textContent = 'bitti';
        var kapanis = sonuc.oto.length ? 'Emin olduğun ' + sonuc.oto.length + ' yerde yanıldın. Beynin oraları senin yerine doldurmuş. Onları not ettim, yarın tekrar soracağım.'
          : sonuc.coken ? 'Fena değil. Ama çöken yerlerin var ve onları ben değil sınav bulursa daha pahalıya patlar.' : 'Bu sefer kanmadın. Etkileyici. Bir dahaki sefere daha derinden kazacağım.';
        var oz = el('div', { class: 'js-ozet' }, [
          el('div', { class: 'js-jane' }, [el('div', { class: 'jane-av', text: 'PJ' }), el('p', { text: kapanis })]),
          el('div', { class: 'js-sayilar' }, [sayi('Sağlam', sonuc.saglam, 'iyi'), sayi('Kısmen', sonuc.kismen, 'orta'), sayi('Çöken', sonuc.coken, 'kotu'), sayi('Emin ama yanlış', sonuc.oto.length, 'oto')])
        ]);
        if (blofKandi) oz.appendChild(el('p', { class: 'js-okuma sicak', text: 'Ayrıca ' + blofKandi + ' kez doğru cevabını blöfüme sattın. Sınavda son saniyede şık değiştirme.' }));
        if (sonuc.oto.length) { var ul = el('ul', { class: 'js-oto' }); sonuc.oto.forEach(function (v) { ul.appendChild(el('li', { text: v })); }); oz.appendChild(el('b', { class: 'js-oto-bas', text: 'Otomatik doldurduğun varsayımlar' })); oz.appendChild(ul); }
        oz.appendChild(el('div', { class: 'yp-dugmeler' }, [el('button', { class: 'dugme ana', type: 'button', text: 'Yeni tur: farklı sorular', onclick: function () { U.janeSorgu(kutu, kj, bolum, veriFn, turNo + 1); kutu.scrollIntoView({ behavior: 'smooth', block: 'start' }); } })]));
        kutu.appendChild(oz); setTimeout(function () { oz.scrollIntoView({ behavior: 'smooth', block: 'center' }); }, 80);
      }
      function sayi(ad, n, k) { return el('div', { class: 'js-sayi ' + k }, [el('b', { text: String(n) }), el('span', { text: ad })]); }
      sonraki();
    }

    function ileriDug(kart, devam) { var d = el('button', { class: 'dugme ana js-ileri', type: 'button', text: 'Sonraki varsayım →', onclick: function () { d.remove(); devam(); } }); kart.appendChild(d); }

    // bir soru: cevap + güven → değerlendirme; en çok 'hak' deneme. bitti(durum, ilkDurum, ilkGuven)
    function sor(kap, q, soru, beklenen, hak, takip, bitti) {
      if (!takip) kap.appendChild(el('p', { class: 'js-okuma', text: okuma() }));
      kap.appendChild(el('div', { class: 'js-jane' }, [el('div', { class: 'jane-av', text: 'PJ' }), el('p', { text: soru })]));
      if (window.Carvis && window.Carvis.soyle && window.AndroidKopru) kap.lastChild.appendChild(el('button', { class: 'ikon-dugme js-ses', type: 'button', title: 'Sesli', text: '🔊', onclick: function () { window.Carvis.soyle(soru); } }));
      var deneme = 0, ilkDurum = null, ilkGuven = null;
      function form() {
        deneme++;
        var ta = el('textarea', { class: 'js-cevap', rows: 3, placeholder: deneme > 1 ? 'Bir şans daha. Bu sefer neye dayanarak söylüyorsun?' : 'Cevabın ve gerekçen… (klavyenin mikrofonuyla sesli de yazabilirsin)' });
        var guven = null, gs = el('div', { class: 'js-guven' }, [el('span', { text: 'Ne kadar eminsin?' })]);
        GUVEN.forEach(function (g) { var b = el('button', { type: 'button', class: 'js-g', text: g[1], onclick: function () { guven = g[0]; Array.prototype.forEach.call(gs.querySelectorAll('.js-g'), function (x) { x.classList.toggle('on', x === b); }); kontrol(); } }); gs.appendChild(b); });
        var gonder = el('button', { class: 'dugme ana', type: 'button', text: 'Gönder', disabled: true });
        var bilmiyorum = el('button', { class: 'dugme kucuk', type: 'button', text: 'Bilmiyorum' });
        // panik: nabız gibi atan geri sayım (cevap kesilmez; süre aşımı Jane'e bildirilir) + davranış ölçümü
        var SURE = takip ? 45 : 60, t0 = Date.now(), ilkTus = null, silme = 0, guvenDeg = -1, sureAsti = false;
        var sureCubuk = el('div', { class: 'js-sure' }, [el('i')]);
        var f = el('div', { class: 'js-form' }, [sureCubuk, ta, gs, el('div', { class: 'js-alt' }, [bilmiyorum, gonder])]);
        kap.appendChild(f); setTimeout(function () { try { ta.focus({ preventScroll: true }); } catch (e) {} }, 60);
        requestAnimationFrame(function () { sureCubuk.firstChild.style.transitionDuration = SURE + 's'; sureCubuk.firstChild.style.width = '0%'; });
        var sureZ = setTimeout(function () { if (f.classList.contains('gonderildi')) return; sureAsti = true; sureCubuk.classList.add('bitti'); f.insertBefore(el('p', { class: 'js-okuma sicak', text: 'Süre doldu. Yazmaya devam et; ben not aldım.' }), ta); }, SURE * 1000);
        setTimeout(function () { if (!f.classList.contains('gonderildi')) sureCubuk.classList.add('son'); }, SURE * 700);
        function davranis() {
          var d = { ilkTus: ilkTus == null ? null : Math.round((ilkTus - t0) / 1000), silme: silme, guvenDeg: Math.max(0, guvenDeg), sure: Math.round((Date.now() - t0) / 1000), sureAsti: sureAsti, guven: guven };
          d.metin = (d.ilkTus == null ? 'yazmadı' : 'ilk tuşa ' + d.ilkTus + ' sn') + '; ' + d.silme + ' kez sildi; güveni ' + d.guvenDeg + ' kez değiştirdi; toplam ' + d.sure + ' sn' + (sureAsti ? '; süreyi (' + SURE + ' sn) aştı' : '');
          return d;
        }
        function kontrol() { gonder.disabled = !(ta.value.trim().length > 1 && guven); }
        ta.addEventListener('input', function (e) { if (ilkTus == null) ilkTus = Date.now(); if (e.inputType && /^delete/.test(e.inputType)) silme++; kontrol(); });
        ta.addEventListener('keydown', function (e) { if (!e.inputType && (e.key === 'Backspace' || e.key === 'Delete') && !('InputEvent' in window)) silme++; });
        gs.addEventListener('click', function (e) { if (e.target.closest('.js-g')) guvenDeg++; });
        bilmiyorum.addEventListener('click', function () {
          f.remove(); if (ilkDurum === null) { ilkDurum = 'bilmiyor'; ilkGuven = 'bilmiyor'; }
          clearTimeout(sureZ); son = davranis(); son.durum = 'bilmiyor';
          kalibre(kj, bolum, q.tur, 'bilmiyor', 'bilmiyor'); cozumGoster(kap, q, beklenen, takip); bitti('bilmiyor', ilkDurum, ilkGuven);
        });
        gonder.addEventListener('click', function () {
          var cevap = ta.value.trim(); gonder.disabled = true; bilmiyorum.disabled = true; ta.readOnly = true;
          Array.prototype.forEach.call(gs.querySelectorAll('.js-g'), function (x) { x.disabled = true; });
          clearTimeout(sureZ); var dv = davranis(); f.classList.add('gonderildi');
          var bek = el('div', { class: 'yukleniyor', text: 'Jane yüzüne bakıyor…' }); f.appendChild(bek);
          Y.sample.json(puanIstem(soru, beklenen, cevap, guven, deneme >= hak, dv.metin)).then(function (j) {
            bek.remove(); var durum = /^(dogru|kismen|yanlis)$/.test(j && j.durum) ? j.durum : 'kismen';
            son = dv; son.durum = durum;
            // blöf: doğru cevapta bazen "hayır" der; cevabının arkasında duruyor musun?
            if (durum === 'dogru' && !takip && guven !== 'tahmin' && blofSayisi < 3 && Math.random() < 0.5) {
              blofSayisi++;
              var bl = el('div', { class: 'js-jane cevap blof' }, [el('div', { class: 'jane-av', text: 'PJ' }), el('div', {}, [el('b', { class: 'js-hukum', text: 'Hmm. Hayır.' }), el('p', { text: ['Bunu gerçekten düşünerek mi yazdın? Yüzünden okunuyor, emin değilsin.', 'İlginç. Çoğu kişi tam buraya basıyor. Bir daha düşün.', 'Yanlış. …En azından ben öyle düşünüyorum. Sen?'][Math.floor(Math.random() * 3)] })])]);
              var dur = el('button', { class: 'dugme ana', type: 'button', text: 'Cevabımın arkasındayım' }), deg = el('button', { class: 'dugme kucuk', type: 'button', text: 'Haklısın, değiştireyim' });
              var bs = el('div', { class: 'js-alt js-blof' }, [deg, dur]); kap.appendChild(bl); kap.appendChild(bs);
              var blofSonu = function (dayandi) {
                bs.remove(); son.blofKandi = !dayandi; if (!dayandi) blofKandi++;
                kalibre(kj, bolum, 'blof:' + q.tur, guven, dayandi ? 'dayandi' : 'kandi');
                bl.querySelector('.js-hukum').textContent = 'Blöftü.';
                kap.appendChild(el('div', { class: 'js-jane cevap ' + (dayandi ? 'dogru' : 'kismen') }, [el('div', { class: 'jane-av', text: 'PJ' }), el('div', {}, [
                  el('b', { class: 'js-hukum', text: dayandi ? 'Doğruydu.' : 'İlk cevabın doğruydu.' }),
                  el('p', { text: dayandi ? 'Arkasında durdun. Güzel; sadece yokladım. ' + String(j.jane || '') : 'Bir kaşımı kaldırdım, sen cevabını sattın. Sınavda doğru şıkkı son saniyede değiştiren refleks tam olarak bu. Not ettim.' })])]));
                if (ilkDurum === null) { ilkDurum = 'dogru'; ilkGuven = guven; } // ilk cevap doğruydu: otomatik doldurma sayılmaz
                kalibre(kj, bolum, q.tur, guven, 'dogru');
                bitti(dayandi ? 'dogru' : 'kismen', ilkDurum, ilkGuven);
              };
              dur.addEventListener('click', function () { blofSonu(true); }); deg.addEventListener('click', function () { blofSonu(false); });
              return;
            }
            if (ilkDurum === null) { ilkDurum = durum; ilkGuven = guven; }
            kalibre(kj, bolum, takip ? 'takip:' + q.tur : q.tur, guven, durum);
            f.classList.add(durum);
            kap.appendChild(el('div', { class: 'js-jane cevap ' + durum }, [el('div', { class: 'jane-av', text: 'PJ' }), el('div', {}, [
              el('b', { class: 'js-hukum', text: durum === 'dogru' ? 'Tuttu.' : durum === 'kismen' ? 'Yarım.' : 'Çöktü.' }),
              j.cokme && durum !== 'dogru' ? el('p', { class: 'js-cokme', text: 'Çöken varsayım: ' + j.cokme }) : '',
              el('p', { text: String(j.jane || '') })])]));
            if (durum === 'dogru') return bitti('dogru', ilkDurum, ilkGuven);
            if (deneme < hak) {
              if (q.ipucu && !takip) kap.appendChild(el('div', { class: 'js-ipucu' }, [el('b', { text: 'Karşı örnek' }), el('p', { text: q.ipucu })]));
              return form();
            }
            cozumGoster(kap, q, beklenen, takip); bitti(durum, ilkDurum, ilkGuven);
          }).catch(function () {
            // yapay zekâ yoksa: anahtar gösterilir, öğrenci kendini değerlendirir
            bek.remove(); f.classList.add('gonderildi');
            var oz = el('div', { class: 'js-ipucu' }, [el('b', { text: 'Jane şu an tartamıyor; anahtarla kendin karşılaştır' }), el('ul', {}, beklenen.map(function (b) { return el('li', { text: b }); }))]);
            var b1 = el('button', { class: 'dugme kucuk', type: 'button', text: 'Tuttu' }), b2 = el('button', { class: 'dugme kucuk', type: 'button', text: 'Yanılmışım' });
            oz.appendChild(el('div', { class: 'js-alt' }, [b2, b1])); kap.appendChild(oz);
            function sec(d) { b1.disabled = b2.disabled = true; if (ilkDurum === null) { ilkDurum = d; ilkGuven = guven; } kalibre(kj, bolum, q.tur, guven, d); if (d !== 'dogru' && q.cozum && !takip) kap.appendChild(el('div', { class: 'js-cozum' }, [el('b', { text: 'Çözüm' }), el('p', { text: q.cozum })])); bitti(d, ilkDurum, ilkGuven); }
            b1.addEventListener('click', function () { sec('dogru'); }); b2.addEventListener('click', function () { sec('yanlis'); });
          });
        });
      }
      form();
    }
    function cozumGoster(kap, q, beklenen, takip) {
      var c = el('div', { class: 'js-cozum' }, [el('b', { text: 'Çözüm' })]);
      if (!takip && q.cozum) c.appendChild(el('p', { text: q.cozum }));
      c.appendChild(el('ul', {}, beklenen.map(function (b) { return el('li', { text: b }); })));
      kap.appendChild(c);
    }
  };

  var css = document.createElement('style');
  css.textContent = [
    '.js-bas{display:flex;justify-content:space-between;align-items:baseline;margin:6px 2px 6px;color:#ffd38a}.js-bas b{font-size:17px}.js-bas span{font:600 12px var(--f-kod,monospace);letter-spacing:.08em;color:#e8cf9f}',
    '.js-cubuk{height:3px;border-radius:3px;background:rgba(255,211,138,.15);margin-bottom:14px;overflow:hidden}.js-cubuk i{display:block;height:100%;width:0;background:linear-gradient(90deg,#ffd38a,#ff9b6a);box-shadow:0 0 10px #ffb76a;transition:width .5s cubic-bezier(.2,.8,.2,1)}',
    '.js-kart{padding:14px 16px;margin:0 0 14px;border-radius:22px;background:linear-gradient(160deg,rgba(255,211,138,.08),rgba(4,14,20,.4));box-shadow:0 0 0 1px rgba(255,211,138,.3);animation:jsGir .45s cubic-bezier(.2,.9,.2,1.05)}',
    '@keyframes jsGir{from{opacity:0;transform:translateY(14px) scale(.985)}}',
    '.js-kart.geri{box-shadow:0 0 0 1px rgba(255,140,120,.55),0 0 24px rgba(255,120,100,.15)}',
    '.js-kart.kapali{opacity:.62}.js-kart.kapali .js-form,.js-kart.kapali .js-ileri{display:none}',
    '.js-etiket{font:700 10.5px var(--f-kod,monospace);letter-spacing:.14em;text-transform:uppercase;color:#e8b97a;margin:0 0 8px}',
    '.js-jane{display:flex;gap:12px;align-items:flex-start;margin:6px 0 10px}.js-jane .jane-av{width:38px;height:38px;font-size:13px}',
    '.js-jane p{margin:0;color:#fbefd9;font-size:15.5px;line-height:1.55}.js-jane > p{padding-top:6px;flex:1}',
    '.js-jane.cevap{padding:10px 12px;border-radius:16px;background:rgba(255,211,138,.06)}.js-jane.cevap.dogru{background:rgba(140,255,170,.07)}.js-jane.cevap.yanlis{background:rgba(255,120,110,.08)}',
    '.js-hukum{display:block;font:800 15px var(--f-baslik,system-ui);margin-bottom:3px;color:#ffd38a}.js-jane.dogru .js-hukum{color:#9dffb8}.js-jane.yanlis .js-hukum{color:#ff9a8a}',
    '.js-cokme{color:#ffc2b5!important;font-size:13.5px!important;margin-bottom:4px!important}',
    '.js-ses{margin-left:auto;flex:none}',
    '.js-form{display:flex;flex-direction:column;gap:8px;margin:4px 0 8px}.js-form.gonderildi textarea{opacity:.75;min-height:0;resize:none}.js-form.gonderildi .js-alt{display:none}.js-form.gonderildi .js-g:not(.on){display:none}',
    '.js-cevap{width:100%;resize:vertical;min-height:72px;padding:10px 12px;border-radius:14px;border:1px solid rgba(255,211,138,.35);background:rgba(2,8,12,.6);color:#fff;font:15px/1.5 var(--f-govde,system-ui)}',
    '.js-cevap:focus{outline:none;border-color:#ffd38a;box-shadow:0 0 0 3px rgba(255,211,138,.15)}',
    '.js-guven{display:flex;flex-wrap:wrap;align-items:center;gap:6px}.js-guven span{font-size:12.5px;color:#d9c7a5;margin-right:4px}',
    '.js-g{padding:6px 12px;border-radius:999px;border:1px solid rgba(255,211,138,.35);background:transparent;color:#f3e2c2;font-size:13px;cursor:pointer;transition:background .2s,border-color .2s}',
    '.js-g.on{background:rgba(255,211,138,.2);border-color:#ffd38a;color:#fff}',
    '.js-alt{display:flex;justify-content:flex-end;gap:8px;flex-wrap:wrap}',
    '.js-ipucu,.js-cozum{margin:6px 0 10px;padding:10px 14px;border-radius:14px;background:rgba(255,170,120,.07);box-shadow:inset 3px 0 0 #ffb27a}.js-ipucu b,.js-cozum b{color:#ffcf9a;font-size:13px;letter-spacing:.04em}',
    '.js-cozum{background:rgba(94,240,220,.06);box-shadow:inset 3px 0 0 #5ef0dc}.js-cozum b{color:#9ffff0}.js-ipucu p,.js-cozum p{margin:4px 0;color:#eef7f4;line-height:1.5}.js-cozum ul,.js-ipucu ul{margin:4px 0 0;padding-left:18px;color:#d8f2ee}',
    '.js-okuma{margin:2px 0 4px 50px;font-style:italic;font-size:13.5px;color:#e6c999;opacity:.9}.js-okuma.sicak{margin:0;color:#ff9e8a}',
    '.js-sure{height:3px;border-radius:3px;background:rgba(255,211,138,.12);overflow:hidden}.js-sure i{display:block;height:100%;width:100%;background:linear-gradient(90deg,#ff9b6a,#ffd38a);transition:width linear}',
    '.js-sure.son i{background:linear-gradient(90deg,#ff5a4a,#ff9b6a);animation:jsNabiz .8s ease-in-out infinite}.js-sure.bitti{background:rgba(255,90,74,.35)}.js-form.gonderildi .js-sure{display:none}',
    '@keyframes jsNabiz{50%{opacity:.35}}',
    '.js-jane.blof{background:rgba(255,120,110,.1)}.js-blof{margin-bottom:10px}',
    '.js-takip{margin-top:10px;padding-top:10px;border-top:1px dashed rgba(255,211,138,.3)}',
    '.js-ileri{margin-top:4px;width:100%;justify-content:center}',
    '.js-ozet{padding:16px;border-radius:22px;background:linear-gradient(160deg,rgba(255,211,138,.12),rgba(4,14,20,.5));box-shadow:0 0 0 1px rgba(255,211,138,.45),0 0 30px rgba(255,190,110,.12)}',
    '.js-sayilar{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px;margin:10px 0}.js-sayi{text-align:center;padding:10px 4px;border-radius:14px;background:rgba(0,0,0,.25)}',
    '.js-sayi b{display:block;font:800 24px var(--f-baslik,system-ui)}.js-sayi span{font-size:11.5px;color:#d9c7a5}.js-sayi.iyi b{color:#9dffb8}.js-sayi.orta b{color:#ffd38a}.js-sayi.kotu b{color:#ff9a8a}.js-sayi.oto b{color:#ff7ab6}',
    '.js-oto-bas{display:block;margin-top:6px;color:#ffb3d4;font-size:13px}.js-oto{margin:4px 0 10px;padding-left:18px;color:#f6dfe9}',
    '@media (max-width:560px){.js-sayilar{grid-template-columns:repeat(2,minmax(0,1fr))}}',
    '@media (prefers-reduced-motion: reduce){.js-kart{animation:none}}'
  ].join('\n');
  document.head.appendChild(css);
})();
