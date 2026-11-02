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
    govde.appendChild(el('p', { class: 'var-etiket', text: 'Bölümün sınav odaklı 5 dakikalık özeti. Yapay zekâ kitabın bu bölümünden çıkarır; bir kez üretilir ve saklanır.' }));
    govde.appendChild(kutu);
    // 🎩 Patrick Jane gibi anlat — kullanıcı (2026-11-02): ilk sürüm "çok kısa ve anlamsız". İstenen: metni okurken nerede
    // karıştıracağımı (ör. B-48 / B-100) önceden bilsin, "asıl takıldığın nokta şu, göründüğü gibi değil, aslında böyle; bu yüzden
    // hocalar ısrarla soruyor" desin. Dayanak: bölüm metni + bu bölümün çıkmış soruları (kaç yıl soruldu) + öğrencinin bu bölümdeki yanlışları.
    var janeKutu = el('div', { class: 'yp-cevap', hidden: true });
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
    govde.appendChild(el('div', { class: 'yp-dugmeler' }, [el('button', { class: 'dugme kucuk', type: 'button', onclick: function () {
      var d = this; d.disabled = true; janeKutu.hidden = false;
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
          if (U.ayirtTesti) { var tk = el('div'); alt.after(tk); alt.appendChild(el('button', { class: 'dugme kucuk ana', type: 'button', onclick: function () { this.disabled = true; U.ayirtTesti(tk, metin, kj, bolum); } }, ['🎯 Ayırt etme testi'])); }
        } });
      });
    } }, ['🎩 Patrick Jane: nerede takılacağını çöz'])]));
    govde.appendChild(janeKutu);
    // 🏛 Hafıza sarayı (app17.js): bölümün kritik bilgileri bir mekânın odalarına
    var sarayKutu = el('div', { class: 'yp-cevap', hidden: true });
    govde.appendChild(el('div', { class: 'yp-dugmeler' }, [el('button', { class: 'dugme kucuk', type: 'button', onclick: function () { sarayKutu.hidden = false; if (U.sarayKurPaneli) U.sarayKurPaneli(sarayKutu, kj, bolum); } }, ['🏛 Hafıza sarayı kur'])]));
    govde.appendChild(sarayKutu);
    // AI yoksa: kitabın kendi sınav odaklı parçaları
    U.AI.hazir().then(function (ok) {
      if (!ok) { yedek(); return; }
      U.cevapCalistir(kutu, fnv('zamanimyok|' + kj.id + '|' + bolum.id), function () {
        return 'Bir tıp öğrencisinin sınava çok az zamanı var. Aşağıdaki çalışma kitabı bölümünü 5 dakikada okunacak biçimde özetle. YALNIZ bu metne dayan, uydurma. Türkçe.\nBiçim:\n**Özün özü** (2 cümle)\n**Mutlaka bil** (8-12 kısa madde; sınavda çıkan/★/🔥 olanlara öncelik ver)\n**Tuzaklar** (en çok 4 madde)\n**Son 30 saniye** (3 maddelik ezber listesi)\nEn fazla 300 kelime.\n\nKİTAP: ' + kj.baslik + '\nBÖLÜM: ' + bolum.baslik + '\n"""\n' + bolumOzu(bolum, 15000) + '\n"""';
      }, { kj: kj, eylem: 'zamanimyok' });
    });
    function yedek() {
      kutu.innerHTML = '';
      kutu.appendChild(el('p', { class: 'var-etiket', text: 'Yapay zekâ bu görünümde yok; kitabın sınav odaklı parçaları gösteriliyor.' }));
      var l = el('ul');
      bolumOzu(bolum, 4000).split('\n').filter(function (x) { return /^\[(tuzak|hoca|soru)\]|Sınav notu|🔥|★/.test(x); }).slice(0, 14).forEach(function (x) { l.appendChild(el('li', { text: x.replace(/^\[(\w+)\]\s*/, function (_, t) { return ({ tuzak: '⚠️ ', hoca: '🎯 ', soru: '📝 ' })[t] || ''; }).slice(0, 260) })); });
      kutu.appendChild(l);
    }
  }
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
