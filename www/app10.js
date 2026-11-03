/* 1001 — "Kendini test et" soruları (şık seç / cevabını yaz) ve "Zamanım yok" bölüm özeti */
(function () {
  'use strict';
  var U = window.Uygulama, A = window.KitapAyristir;
  var el = U.el, $ = U.$, duz = U.duz, toast = U.toast, Y = U.Y, Kitaplik = U.Kitaplik, Durum = U.Durum;
  var fnv = A.fnv;

  /* ---------- Kendini test et ---------- */
  U.kendiniTestCiz = function (q, kj, blokId) {
    var kutu = el('aside', { class: 'blok co co-kt soru-kutu', id: blokId ? 'b-' + blokId : null, style: '--c:#7fd1ff' });
    var ust = el('div', { class: 'co-ust' }, [el('span', { 'aria-hidden': 'true', text: '✎' }), el('span', { text: 'Kendini test et · ' + q.varyantlar[0].no })]);
    var ic = el('div', { class: 'co-ic' });
    kutu.appendChild(ust); kutu.appendChild(ic);
    var v = q.varyantlar[0];
    if (!q.acikUclu && v.siklar.length) {
      // Şıklı: dokununca doğru şık yeşil, yanlış seçim kırmızı; ardından kitabın açıklaması açılır.
      U.soruCiz(Object.assign({}, q, { baslik: '' }), ic, ust, kj);
      var b = ic.querySelector('.var-baslik'); if (b && !b.textContent.trim()) b.remove();
      if (!q.cevapHtml) { var gb = ic.querySelector('.cevap-bolumu'); if (gb) gb.innerHTML = '<p>Kitapta bu sorunun cevabı yok.</p>'; }
      return kutu;
    }
    // Açık uçlu: cevabını yaz → kitabın cevabını gör → (isteğe bağlı) AI değerlendirsin → kendini puanla
    ic.appendChild(el('p', { html: v.govde || '' }));
    var id = 'kt-' + fnv(q.id);
    var ta = el('textarea', { id: id, rows: '3', class: 'kt-girdi', placeholder: 'Cevabını yaz (isteğe bağlı)…', 'aria-label': 'Cevabın' });
    var cevap = el('div', { class: 'cevap-bolumu', hidden: true, html: q.cevapHtml || '<p>Kitapta bu sorunun cevabı yok.</p>' });
    var aiKutu = el('div');
    var puan = el('div', { class: 'yp-dugmeler', hidden: true }, [
      el('button', { class: 'dugme kucuk', type: 'button', onclick: function () { kaydet(true); } }, ['✓ Bildim']),
      el('button', { class: 'dugme kucuk', type: 'button', onclick: function () { kaydet(false); } }, ['✗ Bilemedim'])]);
    function kaydet(d) { if (U.soruCevaplandi) U.soruCevaplandi(kj.id, q, 0, d); puan.innerHTML = ''; puan.appendChild(el('span', { class: 'var-etiket', text: d ? 'Kaydedildi: bildim.' : 'Kaydedildi: yanlış defterine eklendi.' })); }
    var goster = el('button', { class: 'dugme kucuk', type: 'button', onclick: function () { cevap.hidden = false; puan.hidden = false; goster.hidden = true; U.atiflariBagla(cevap, kj); } }, ['🔑 Cevabı göster']);
    var aiDug = el('button', { class: 'dugme kucuk ai-gerek', type: 'button', onclick: function () {
      if (!ta.value.trim()) { toast('Önce cevabını yaz.'); ta.focus(); return; }
      cevap.hidden = false; puan.hidden = false; goster.hidden = true;
      U.cevapCalistir(aiKutu, fnv(q.id + '|' + ta.value.trim()), function () {
        return 'Bir tıp öğrencisinin açık uçlu soruya verdiği cevabı, kitabın cevap anahtarına göre değerlendir. Türkçe, en fazla 120 kelime. Önce tek satırla "**Değerlendirme:** doğru / kısmen doğru / yanlış" yaz; sonra eksik ya da hatalı noktaları madde madde söyle. Kitabın cevabında olmayan bir şeyi eklersen "**Genel bilgi:**" diye ayır.\n\nSORU: ' + duz(v.govde) +
          '\nKİTABIN CEVABI: ' + (duz(q.cevapHtml) || '(kitapta cevap yok; kendi bilginle değerlendir ve bunu belirt)') + '\nÖĞRENCİNİN CEVABI: ' + ta.value.trim();
      }, { kj: kj, eylem: 'kt-degerlendir' });
    } }, ['✦ AI değerlendirsin']);
    ic.appendChild(ta);
    ic.appendChild(el('div', { class: 'yp-dugmeler' }, [goster, aiDug]));
    ic.appendChild(aiKutu); ic.appendChild(cevap); ic.appendChild(puan);
    return kutu;
  };

  /* ---------- Zamanım yok: bölümün 5 dakikalık özeti ---------- */
  function bolumOzu(bolum, sinir) {
    // Önce sınav açısından en yoğun bloklar: soru kutusu başlıkları, tuzak, hoca vurgusu, "Sınav notu", başlıklar; sonra ilk paragraflar.
    var oncelik = [], diger = [];
    bolum.altlar.forEach(function (a) {
      if (a.baslik) oncelik.push('## ' + a.baslik);
      var ilk = true;
      (function g(l, tur) {
        l.forEach(function (x) {
          var t = x.html ? duz(x.html) : x.ogeler ? x.ogeler.map(duz).join(' • ') : x.satir ? x.satir.map(function (s) { return s.map(duz).join(' | '); }).join(' / ') : '';
          if (x.t === 'callout') { if (/tuzak|hoca|soru|formul/.test(x.tur)) oncelik.push('[' + x.tur + '] ' + x.bloklar.map(function (y) { return y.html ? duz(y.html) : y.ogeler ? y.ogeler.map(duz).join(' • ') : ''; }).join(' ').slice(0, 700)); else g(x.bloklar, x.tur); return; }
          if (!t) return;
          if (/Sınav notu|🔥|★/.test(t)) oncelik.push(t);
          else if (ilk) { oncelik.push(t); ilk = false; }
          else diger.push(t);
        });
      })(a.bloklar);
    });
    var s = oncelik.join('\n'); if (s.length < sinir) s += '\n' + diger.join('\n');
    return s.slice(0, sinir);
  }
  function zamanimYok() {
    var kj = Durum.aktifKitap, bolum = Durum.aktifBolum;
    if (!kj || !bolum) return;
    var govde = U.panelAc('⚡ Zamanım yok: ' + (bolum.kisa || bolum.baslik), kj.baslik);
    var kutu = el('div', { class: 'yp-cevap' });
    /* kullanıcı, 2026-11-03: "bölüm başına Zamanım yok, bütün başlıkların özetini çıkarsın"; "konuyu ilk defa öğreniyorsam bazı şeyleri
       değişik anlatsın; Patrick Jane + test çok güzel, biraz daha güzelleştirelim" → sekmeler: Hızlı tekrar (her alt başlık) ·
       İlk kez öğreniyorum (sezgi → terimler → adım adım → kendine sor) · Patrick Jane (takılacağın yer → ayırt testi) · Hafıza sarayı */
    var sekmeler = el('div', { class: 'zy-sekmeler', role: 'tablist' }), alanlar = {};
    var sHizli = el('div', { class: 'zy-alan', 'data-s': 'hizli' }), sIlk = el('div', { class: 'zy-alan', 'data-s': 'ilk', hidden: true }), sJane = el('div', { class: 'zy-alan', 'data-s': 'jane', hidden: true }), sSaray = el('div', { class: 'zy-alan', 'data-s': 'saray', hidden: true });
    var ilkKutu = el('div', { class: 'yp-cevap' }), ilkBasladi = false;
    [['hizli', '⚡', 'Hızlı tekrar', 'sınav için, her başlık'], ['ilk', '🌱', 'İlk kez öğreniyorum', 'sezgi + adım adım'], ['jane', '🎩', 'Patrick Jane', 'takılacağın yer + test'], ['saray', '🏛', 'Hafıza sarayı', 'mekânda ezber']].forEach(function (x) {
      var b = el('button', { type: 'button', role: 'tab', class: 'zy-sekme' + (x[0] === 'hizli' ? ' on' : ''), 'aria-selected': String(x[0] === 'hizli') }, [el('span', { class: 'ik', text: x[1] }), el('b', { text: x[2] }), el('small', { text: x[3] })]);
      b.addEventListener('click', function () {
        Array.prototype.forEach.call(sekmeler.children, function (c) { c.classList.toggle('on', c === b); c.setAttribute('aria-selected', String(c === b)); });
        [sHizli, sIlk, sJane, sSaray].forEach(function (a) { a.hidden = a.getAttribute('data-s') !== x[0]; });
        if (x[0] === 'ilk' && !ilkBasladi) { ilkBasladi = true; partiliOzet(ilkKutu, kj, bolum, 'ilk'); }
        if (x[0] === 'saray' && !sarayKutu.dataset.b) { sarayKutu.dataset.b = 1; sarayKutu.hidden = false; if (U.sarayKurPaneli) U.sarayKurPaneli(sarayKutu, kj, bolum); }
      });
      sekmeler.appendChild(b);
    });
    govde.appendChild(sekmeler);
    sHizli.appendChild(kutu); sIlk.appendChild(el('p', { class: 'var-etiket', text: 'Konuyu ilk kez görüyorsan: her başlık önce günlük hayattan bir sezgiyle, sonra yeni terimler, adım adım mantık ve kendini kontrol sorusuyla anlatılır. Bilgi yalnız kitabın bu bölümünden.' })); sIlk.appendChild(ilkKutu);
    govde.appendChild(sHizli); govde.appendChild(sIlk); govde.appendChild(sJane); govde.appendChild(sSaray);
    // 🎩 Patrick Jane gibi anlat — kullanıcı (2026-11-02): ilk sürüm "çok kısa ve anlamsız". İstenen: metni okurken nerede
    // karıştıracağımı (ör. B-48 / B-100) önceden bilsin, "asıl takıldığın nokta şu, göründüğü gibi değil, aslında böyle; bu yüzden
    // hocalar ısrarla soruyor" desin. Dayanak: bölüm metni + bu bölümün çıkmış soruları (kaç yıl soruldu) + öğrencinin bu bölümdeki yanlışları.
    var janeKutu = el('div', { class: 'yp-cevap jane-kart', hidden: true });
    function janeVerisi() {
      var cikmis = Kitaplik.sorular(kj.id).then(function (l) {
        return l.filter(function (q) { return q.bolum === bolum.id && !q.deneme; }).map(function (q) {
          var yil = {}; (q.varyantlar || []).forEach(function (v) { if (v.sinav && /\d{2}-\d{2}/.test(v.sinav)) yil[v.sinav] = 1; });
          var v = (q.varyantlar || [])[0] || {}, d = (v.siklar || []).filter(function (s) { return s.h === v.cevap; })[0];
          return { n: Object.keys(yil).length, s: '• ' + (q.konu || '') + ' — ' + Object.keys(yil).length + ' sınavda (' + Object.keys(yil).join(', ') + '): "' + duz(v.govde || '').slice(0, 160) + '" → doğru: ' + (d ? duz(d.m) : v.cevap) + ' | şıklar: ' + (v.siklar || []).map(function (s) { return duz(s.m); }).join(' / ').slice(0, 200) };
        }).sort(function (a, b) { return b.n - a.n; }).slice(0, 14).map(function (x) { return x.s; }).join('\n');
      }).catch(function () { return ''; });
      var eksik = U.Depo.oku('eksikler').then(function (v) {
        return (v.liste || []).filter(function (e) { return e.kitap === kj.id && e.sira === bolum.sira; }).slice(-12).map(function (e) { return '• ' + (e.bilmiyor ? 'BİLMİYORUM: ' : 'YANLIŞ: ') + (e.konu || '') + ' — ' + (e.soru || ''); }).join('\n');
      }).catch(function () { return ''; });
      return Promise.all([cikmis, eksik]);
    }
    sJane.appendChild(el('div', { class: 'jane-giris' }, [el('div', { class: 'jane-av', text: 'PJ' }), el('div', {}, [el('b', { text: 'Patrick Jane' }), el('p', { text: '"Bu bölümü okurken aklından geçeni söyleyeyim…" — çıkmış sorulara ve senin yanlışlarına bakıp nerede karıştıracağını önceden çözer; sonunda o karışıklıklardan ayırt etme testi.' })])]));
    sJane.appendChild(el('div', { class: 'yp-dugmeler' }, [el('button', { class: 'dugme ana jane-dug', type: 'button', onclick: function () {
      var d = this; d.disabled = true; d.style.display = 'none'; janeKutu.hidden = false;
      janeKutu.innerHTML = '<div class="yukleniyor">Çıkmışlar ve yanlışların inceleniyor…</div>';
      janeVerisi().then(function (r) {
        var cikmis = r[0], eksik = r[1];
        U.cevapCalistir(janeKutu, fnv('jane4|' + kj.id + '|' + bolum.id + '|' + eksik.length), function () {
          return 'Sen Patrick Jane\'sin (The Mentalist): karşındakinin aklından geçeni okuyan, sakin ve kendinden emin biri. Bir tıp öğrencisi aşağıdaki çalışma kitabı bölümünü okuyacak. ' +
            'Görevin: bu metni okurken KAFASININ NEREDE KARIŞACAĞINI önceden tahmin etmek ve çözmek. Birbirine benzeyen, sık karıştırılan kavramlara odaklan (ör. apolipoprotein B-48 ile B-100 gibi; adı, yeri, işlevi ya da sayısı benzeyen çiftler).\n' +
            'Biçim:\n1) Tek cümlelik açılış: "Bu bölümü okurken aklından geçeni söyleyeyim…" tarzında.\n' +
            '2) En önemli 3-5 karışıklık noktası; her biri için başlık "**Takılacağın yer: X mi Y mi?**" ve altında akıcı bir paragraf: ' +
            '"Göründüğü gibi değil:" (öğrencinin büyük ihtimalle yanlış kurduğu sezgi) → "Aslında:" (ayırt eden mantık/mekanizma; NEDEN böyle olmak zorunda) → ' +
            '"Hocalar neden ısrarla soruyor:" (aşağıdaki ÇIKMIŞ SORULAR verisine dayan; kaç sınavda sorulduğunu söyle, hangi çeldiricinin kurulduğunu göster; veri yoksa sınav mantığıyla açıkla ama sayı uydurma) → ' +
            '"Ayırt etme anahtarı:" tek cümlelik, akılda kalan bir kural.\n' +
            '3) Öğrencinin bu bölümde yanlış yaptığı ya da "bilmiyorum" dediği sorular aşağıda verildiyse, en az bir karışıklık noktasını DOĞRUDAN onlardan seç ve bunu belli et ("Bunu daha önce kaçırdın; sebebi şu…"). Kaç kez kaçırdığını YALNIZ verideki sayıya göre söyle; sayı verilmediyse sayı söyleme.\n' +
            '4) Kapanış: "**Aklında kalsın:**" tek cümle.\n' +
            'Sıralama, sayı, yön ve oran içeren her iddiayı (ör. elektroforezde göç sırası, yoğunluk sırası) metinle karşılaştır; metinde yoksa ve emin değilsen o ayrıntıyı hiç söyleme. Uzunluk 350-550 kelime; dolgu cümle yok, her cümle bilgi taşısın. YALNIZ bölüm metnine ve verilen sorulara dayan; tıbbi bilgi uydurma. Türkçe; Latince/İngilizce terimleri koru.\n\n' +
            'BÖLÜM: ' + (bolum.kisa || bolum.baslik) + '\n"""\n' + bolumOzu(bolum, 9000) + '\n"""\n\n' +
            'ÇIKMIŞ SORULAR (bu bölüm; en çok sorulan önce):\n' + (cikmis || '(yok)') + '\n\n' +
            'ÖĞRENCİNİN BU BÖLÜMDEKİ YANLIŞLARI / BİLMİYORUMLARI:\n' + (eksik ? eksik + '\n(toplam ' + eksik.split('\n').length + ' kayıt)' : '(kayıt yok)');
        }, { kj: kj, eylem: 'jane', sonra: function (metin, alt) {
          if (window.Carvis && window.Carvis.soyle && window.AndroidKopru) alt.appendChild(el('button', { class: 'dugme kucuk', type: 'button', onclick: function () { window.Carvis.soyle(metin); } }, ['🔊 Carvis sesiyle dinle']));
          if (U.ayirtTesti) { var tk = el('div', { class: 'jane-test' }); alt.after(tk);
            var cta = el('button', { class: 'jane-cta', type: 'button' }, [el('span', { class: 'ik', text: '🎯' }), el('span', {}, [el('b', { text: 'Şimdi kendini sına' }), el('small', { text: 'Yukarıdaki karışıklıklardan ayırt etme testi · yanlışlar Eksikler\'e' })])]);
            cta.addEventListener('click', function () { cta.remove(); U.ayirtTesti(tk, metin, kj, bolum); setTimeout(function () { tk.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 300); });
            tk.before(cta); }
        } });
      });
    } }, ['🎩 Nerede takılacağımı çöz'])]));
    sJane.appendChild(janeKutu);
    /* 🃏 Jane'in tuzakları (kullanıcı, 2026-11-03: "Patrick Jane bizi yanıltmak için gıcığına soru sorsun; yanıldığımız yeri erkenden
       eleyelim"): okumadan önce de çözülebilir. Her soru tek bir yanlış sezgiyi hedefler; yanlışlar Eksikler'e düşer. */
    var tuzakKutu = el('div', { class: 'jane-test' });
    var tuzakDug = el('button', { class: 'jane-cta tuzak', type: 'button' }, [el('span', { class: 'ik', text: '🃏' }), el('span', {}, [el('b', { text: 'Beni kandırmaya çalış' }), el('small', { text: 'Jane, en çok yanıldığın sezgileri hedefleyen gıcık sorular sorar · okumadan önce de olur' })])]);
    tuzakDug.addEventListener('click', function () {
      tuzakDug.disabled = true; tuzakKutu.innerHTML = '<div class="yukleniyor">Jane tuzak kuruyor…</div>';
      var an = fnv('janeTuzak2|' + kj.id + '|' + bolum.id);
      U.AI.onbellekOku(an).then(function (onb) {
        if (onb && onb.json) return onb.json;
        return janeVerisi().then(function (r) {
          return Y.sample.json('Sen Patrick Jane\'sin (The Mentalist): insanların yanlış sezgilerini okuyup onları kendi tuzağına düşüren, muzip ama ADİL biri. Bir tıp öğrencisini YANILTMAK için tasarlanmış 7 "gıcık" soru yaz. ' +
            'Her soru öğrencinin büyük ihtimalle kurduğu tek bir YANLIŞ sezgiyi hedeflesin: birbirine benzeyen kavramlar, ters çevrilmiş sıra/yön, "genellikle doğru ama burada değil" istisnası, tek kelimesi değiştirilmiş doğru cümle, küçük sayısal sapma, sezgisel ama yanlış neden-sonuç. ' +
            'Karışık türler: (a) en az 3 tane "Bu cümle doğru mu?" — siklar ["Doğru","Yanlış"]; cümle neredeyse doğru görünsün. (b) gerisi 5 şıklı; en cazip çeldirici sezgisel cevap olsun. ' +
            'Kurallar: YALNIZ aşağıdaki metne dayan; her sorunun metne göre TEK ve kesin doğru cevabı olsun (hile, belirsizlik yok); "hepsi/hiçbiri" yok; doğru şıkkın yeri değişsin. ' +
            'Çıkmış sorularda kurulan çeldiricileri ve öğrencinin geçmiş yanlışlarını özellikle hedefle.\n' +
            'Her soru için: "tuzak" = hangi yanılgıyı hedeflediği (1 kısa cümle); "aciklama" = Jane ağzından 2-3 cümle: önce yakaladıysa "Yakaladım. …", kanmadıysa da geçerli olacak şekilde "Çoğu kişi burada … der; oysa …", sonunda ayırt etme anahtarı.\n' +
            'YALNIZ JSON: {"sorular":[{"soru":"…","siklar":["…"],"dogru":0,"tuzak":"…","aciklama":"…","konu":"…"}]}\n\n' +
            'BÖLÜM: ' + (bolum.kisa || bolum.baslik) + '\n"""\n' + bolumOzu(bolum, 8000) + '\n"""\n\nÇIKMIŞ SORULAR:\n' + (r[0] || '(yok)') + '\n\nÖĞRENCİNİN YANLIŞLARI:\n' + (r[1] || '(yok)'));
        }).then(function (j) { U.AI.onbellekYaz(an, { json: j, eylem: 'jane-tuzak', kitap: kj.id, t: Date.now() }); return j; });
      }).then(function (j) {
        var sorular = (j && j.sorular || []).filter(function (q) { return q && q.soru && Array.isArray(q.siklar) && q.siklar.length >= 2 && +q.dogru >= 0 && +q.dogru < q.siklar.length; }).slice(0, 8).map(function (q) {
          return { soru: String(q.soru), siklar: q.siklar.map(String), dogru: +q.dogru, aciklama: '🎩 ' + String(q.aciklama || '') + (q.tuzak ? '\n\nTuzak: ' + q.tuzak : ''), konu: String(q.konu || ''), kitap: kj.id, sira: bolum.sira, bolumAd: bolum.kisa || bolum.baslik };
        });
        if (!sorular.length) throw new Error('Jane bu sefer tuzak kuramadı; tekrar dene.');
        tuzakKutu.innerHTML = ''; tuzakDug.style.display = 'none';
        U.testCiz(tuzakKutu, { baslik: 'Jane\'in tuzakları · ' + (bolum.kisa || bolum.baslik), sorular: sorular }, { kaynak: 'jane-tuzak', bitti: function (d) { U.toast(d ? '🎩 "Kanmadın. Etkileyici."' : '🎩 "Yakaladım. Eksiklerine ekledim."'); } });
      }).catch(function (e) { tuzakDug.disabled = false; tuzakKutu.innerHTML = ''; tuzakKutu.appendChild(el('p', { class: 'hata-metni', text: e && e.code ? U.AI.hataMetni(e) : String(e && e.message || e) })); });
    });
    var janeGiris = sJane.querySelector('.jane-giris');
    if (janeGiris) { janeGiris.after(tuzakDug); tuzakDug.after(tuzakKutu); } else { sJane.appendChild(tuzakDug); sJane.appendChild(tuzakKutu); }
    // 🏛 Hafıza sarayı (app17.js): bölümün kritik bilgileri bir mekânın odalarına
    var sarayKutu = el('div', { class: 'yp-cevap', hidden: true });
    sSaray.appendChild(sarayKutu);
    // AI yoksa: kitabın kendi sınav odaklı parçaları
    U.AI.hazir().then(function (ok) {
      if (!ok) { yedek(); return; }
      partiliOzet(kutu, kj, bolum, 'hizli');
    });
    function yedek() {
      kutu.innerHTML = '';
      kutu.appendChild(el('p', { class: 'var-etiket', text: 'Yapay zekâ bu görünümde yok; kitabın sınav odaklı parçaları gösteriliyor.' }));
      var l = el('ul');
      bolumOzu(bolum, 4000).split('\n').filter(function (x) { return /^\[(tuzak|hoca|soru)\]|Sınav notu|🔥|★/.test(x); }).slice(0, 14).forEach(function (x) { l.appendChild(el('li', { text: x.replace(/^\[(\w+)\]\s*/, function (_, t) { return ({ tuzak: '⚠️ ', hoca: '🎯 ', soru: '📝 ' })[t] || ''; }).slice(0, 260) })); });
      kutu.appendChild(l);
    }
  }
  /* Bölümün HER alt başlığı: metin ~7000 karakterlik partilere bölünür, partiler sırayla üretilir (önbellekli). Üstte başlık çipleri. */
  function partiliOzet(kutu, kj, bolum, tur) {
    kutu.innerHTML = '';
    var altlar = (bolum.altlar || []).filter(function (a) { return a.baslik || (a.bloklar && a.bloklar.length); });
    var partiler = [], p = [], boy = 0;
    altlar.forEach(function (a, i) { var m = U.altMetin ? U.altMetin(a, 3500) : ''; if (p.length && boy + m.length > 7000) { partiler.push(p); p = []; boy = 0; } p.push({ a: a, i: i, m: m }); boy += m.length; });
    if (p.length) partiler.push(p);
    var toc = el('div', { class: 'zy-toc' }), durum = el('div', { class: 'zy-durum' });
    var kaplar = partiler.map(function () { return el('div', { class: 'zy-parti' }); });
    altlar.forEach(function (a, i) {
      var pj = 0; partiler.forEach(function (pp, j) { if (pp.some(function (x) { return x.i === i; })) pj = j; });
      toc.appendChild(el('button', { type: 'button', class: 'zy-cip', onclick: function () {
        var hedef = null, ad = String(a.baslik || '').replace(/^\d+(\.\d+)*\s*/, '').slice(0, 18).toLocaleLowerCase('tr');
        Array.prototype.some.call(kaplar[pj].querySelectorAll('h1,h2,h3,h4,strong'), function (h) { if (h.textContent.toLocaleLowerCase('tr').indexOf(ad) >= 0) { hedef = h; return true; } });
        (hedef || kaplar[pj]).scrollIntoView({ behavior: 'smooth', block: 'start' });
      } }, [basAd(a, i)]));
    });
    kutu.appendChild(toc); kutu.appendChild(durum); kaplar.forEach(function (k) { kutu.appendChild(k); });
    var sira = 0, hazir = 0;
    function ilerle() { durum.textContent = hazir >= partiler.length ? '✓ ' + altlar.length + ' başlığın hepsi hazır' : hazir + '/' + partiler.length + ' parça hazır · ' + altlar.length + ' başlık'; }
    ilerle();
    function sonraki() {
      if (sira >= partiler.length) return; var j = sira++, pp = partiler[j], c = el('div'); kaplar[j].appendChild(c);
      var yedek = setTimeout(sonraki, 50000), cagrildi = false;
      U.cevapCalistir(c, fnv('zy2|' + tur + '|' + kj.id + '|' + bolum.id + '|' + j + '/' + partiler.length), function () { return istem(tur, kj, bolum, pp); },
        { kj: kj, eylem: tur === 'ilk' ? 'zamanimyok-ilk' : 'zamanimyok', sonra: function () { clearTimeout(yedek); hazir++; ilerle(); if (!cagrildi) { cagrildi = true; sonraki(); } } });
    }
    sonraki();
  }
  // başlık adı: numara iki kez yazılmasın ("11.1 11.1 …"); adsız giriş bloğu "Giriş"
  function basAd(a, i) { var b = String(a.baslik || '').trim(), no = String(a.no || '').trim(); if (!b) return i === 0 ? 'Giriş' : 'Kısım ' + (i + 1); return no && b.indexOf(no) !== 0 ? no + ' ' + b : b; }
  function istem(tur, kj, bolum, pp) {
    var metin = pp.map(function (x) { return '=== BAŞLIK: ' + basAd(x.a, x.i) + ' ===\n' + x.m; }).join('\n\n');
    if (tur === 'ilk') return 'Bu konuyu İLK KEZ öğrenen bir tıp öğrencisine anlat — ezber için değil, ANLAMAK için. Aşağıdaki HER alt başlığı ayrı ayrı ve sırayla anlat; hiçbirini atlama. ' +
      'Bilgiyi YALNIZ bu metinden al; benzetmeler gerçeği çarpıtmasın, metinde olmayan sayı/ad uydurma. Sade, sıcak, "sen" diliyle; Latince/İngilizce terimleri koru.\nHer başlık için TAM bu biçim:\n' +
      '### <başlık numarası ve adı>\n**Önce sezgi:** günlük hayattan bir benzetme ya da somut bir sahne (2-3 cümle)\n**Yeni terimler:** başlıktaki 2-5 yeni terim; her biri "terim (İngilizce/Latince) — sade tanım"\n' +
      '**Adım adım:** mantığı/mekanizmayı 3-6 numaralı adımda, her adımda "çünkü" ile\n**Neden önemli:** vücutta ya da klinikte nerede karşına çıkar (1-2 cümle)\n**Kendine sor:** tek kısa soru; hemen altına "> Cevap: …"\n\n' +
      'BÖLÜM: ' + (bolum.kisa || bolum.baslik) + '\n"""\n' + metin + '\n"""';
    return 'Bir tıp öğrencisinin komite sınavına çok az zamanı var. Aşağıdaki bölümün HER alt başlığını ayrı ayrı, sırayla özetle; hiçbir başlığı atlama, başlık sırasını koru. YALNIZ bu metne dayan, uydurma. Türkçe; Latince/İngilizce terimleri koru.\n' +
      'Her başlık için TAM bu biçim:\n### <başlık numarası ve adı>\n**Özü:** 1-2 cümle\n- 3-7 kısa madde: tanımlar, sayılar, sıralamalar, ayırt edici özellikler — sınavda sorulabilecek her şey\n**Tuzak:** karıştırılan nokta (yalnız metinde varsa)\n\n' +
      'BÖLÜM: ' + (bolum.kisa || bolum.baslik) + '\n"""\n' + metin + '\n"""';
  }
  var zyCss = document.createElement('style');
  zyCss.textContent = [
    '.zy-sekmeler{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:8px;margin:4px 0 14px}',
    '.zy-sekme{display:flex;flex-direction:column;align-items:flex-start;gap:2px;padding:10px 12px;border-radius:16px;border:1px solid rgba(110,255,235,.22);background:rgba(94,240,220,.04);color:#cfeee9;text-align:left;cursor:pointer;min-width:0}',
    '.zy-sekme .ik{font-size:18px}.zy-sekme b{font-size:14px;color:#effffc;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%}.zy-sekme small{font-size:11.5px;color:#8fc7bf;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%}',
    '.zy-sekme.on{border-color:#9ffff0;background:linear-gradient(135deg,rgba(94,240,220,.18),rgba(70,200,255,.05));box-shadow:0 0 18px rgba(94,240,220,.3)}',
    '.zy-sekme[data-x]{}',
    '@media (max-width:640px){.zy-sekmeler{grid-template-columns:repeat(2,minmax(0,1fr))}}',
    '.zy-toc{display:flex;flex-wrap:wrap;gap:6px;margin:0 0 8px}.zy-cip{padding:5px 10px;border-radius:999px;border:1px solid rgba(110,255,235,.28);background:transparent;color:#bfeee8;font-size:12.5px;cursor:pointer}',
    '.zy-durum{font:600 11.5px var(--f-kod,monospace);letter-spacing:.06em;color:#7fe8da;margin:2px 0 10px}',
    '.zy-parti .ai-metin h4{margin:18px 0 6px;padding:6px 12px;border-radius:12px;background:linear-gradient(90deg,rgba(94,240,220,.14),transparent);color:#effffc;font-size:16px;scroll-margin-top:90px}',
    '.zy-alan[data-s="ilk"] .ai-metin h4{background:linear-gradient(90deg,rgba(140,255,160,.16),transparent)}',
    '.zy-alan .ai-metin blockquote{margin:6px 0;padding:6px 12px;border-left:3px solid #8cffa0;background:rgba(140,255,160,.06);border-radius:0 10px 10px 0}',
    '.jane-giris{display:flex;gap:14px;align-items:center;padding:14px 16px;border-radius:18px;margin-bottom:10px;background:linear-gradient(135deg,rgba(255,211,138,.12),rgba(0,0,0,0));box-shadow:0 0 0 1px rgba(255,211,138,.4)}',
    '.jane-av{flex:none;width:52px;height:52px;border-radius:50%;display:grid;place-items:center;font:800 18px var(--f-baslik,system-ui);color:#1b1206;background:linear-gradient(135deg,#ffe2a8,#c08a3a);box-shadow:0 0 18px rgba(255,200,100,.5)}',
    '.jane-giris b{color:#ffd38a;font-size:16px}.jane-giris p{margin:3px 0 0;color:#f3e6cf;font-size:13.5px;line-height:1.45;font-style:italic}',
    '.jane-dug{width:100%;justify-content:center}',
    '.jane-kart .ai-metin p strong:first-child{color:#ffd38a}.jane-kart .ai-metin p:has(> strong:first-child){padding:10px 14px;border-radius:14px;background:rgba(255,211,138,.05);box-shadow:inset 3px 0 0 #ffd38a}',
    '.jane-cta{display:flex;align-items:center;gap:14px;width:100%;margin:14px 0;padding:16px 18px;border-radius:20px;border:0;cursor:pointer;text-align:left;color:#fff;background:linear-gradient(135deg,rgba(94,240,220,.25),rgba(255,211,138,.15));box-shadow:0 0 0 1px rgba(160,255,240,.6),0 0 30px rgba(94,240,220,.3);animation:janeNefes 2.4s ease-in-out infinite}',
    '.jane-cta.tuzak{background:linear-gradient(135deg,rgba(255,122,122,.18),rgba(255,211,138,.12));box-shadow:0 0 0 1px rgba(255,170,140,.6),0 0 26px rgba(255,140,120,.25);animation:none;margin-top:0}',
    '.jane-cta .ik{font-size:26px}.jane-cta b{display:block;font-size:17px}.jane-cta small{display:block;color:#d5f5ef;font-size:12.5px}',
    '@keyframes janeNefes{50%{box-shadow:0 0 0 1px rgba(160,255,240,.9),0 0 46px rgba(94,240,220,.5)}}'
  ].join('\n');
  document.head.appendChild(zyCss);
  U.zamanimYok = zamanimYok;
  U.bolumOzu = bolumOzu;
  var onceki = U.sonIsle;
  U.sonIsle = function (alan, bolum, kj) {
    onceki(alan, bolum, kj);
    var arac = $('.arac-cubugu');
    if (arac && !$('#zamanimYokDug', arac)) {
      var d = el('button', { id: 'zamanimYokDug', class: 'ikon-dugme zy', type: 'button', title: 'Zamanım yok: bölümün 5 dakikalık özeti', onclick: zamanimYok }, ['⚡', el('span', { class: 'uzun', text: ' Zamanım yok' })]);
      arac.insertBefore(d, arac.children[2] || null);
    }
  };
})();
