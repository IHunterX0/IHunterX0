/* 1001 — Okuma seviyesi (1–5: AI aynı alt bölümü yeniden yazar; "Orijinal" = kitabın kendisi) ve AI seviye ölçme sınavı */
(function () {
  'use strict';
  var U = window.Uygulama, A = window.KitapAyristir;
  var el = U.el, $ = U.$, $$ = U.$$, duz = U.duz, toast = U.toast, Y = U.Y, Durum = U.Durum, Depo = U.Depo;
  var fnv = A.fnv;

  var SEVIYELER = {
    1: { ad: 'Seviye 1 · Çok özet', istek: 'Yalnız sınavda çıkmış ya da çıkabilecek çekirdek bilgiler. Kitapta ★, 🔥, "Sınav notu", tuzak ya da hoca vurgusu olan yerlere öncelik ver. Madde madde, en fazla ~90 kelime. Açıklama yapma, yalnız bilinmesi gerekeni yaz.' },
    2: { ad: 'Seviye 2 · Özet', istek: 'Sınav odaklı kısa özet: temel tanımlar, çıkmış/★ bilgiler, en önemli 1-2 tuzak. Madde madde, en fazla ~170 kelime.' },
    3: { ad: 'Seviye 3 · Dengeli', istek: 'Ana fikirler ve her birinin kısa nedeni. Sınav bilgilerini koru, ama neden öyle olduğunu da birer cümleyle söyle. Kısa paragraflar ve maddeler, en fazla ~300 kelime.' },
    4: { ad: 'Seviye 4 · Ayrıntılı', istek: 'Ayrıntılı anlatım: mekanizmalar, yapılar arası ilişkiler, sebep-sonuç zinciri. Sınav bilgilerini işaretle (★ ile). En fazla ~450 kelime.' },
    5: { ad: 'Seviye 5 · Mantık odaklı', istek: 'En ayrıntılı ve mantık odaklı anlatım: her bilginin NEDEN böyle olduğunu adım adım akıl yürüterek açıkla (yapı → işlev → sonuç; "bu olmasaydı ne olurdu?"). Kavramları birbirine bağla, ezberi mantıkla değiştir. Sınav bilgilerini ★ ile işaretle. En fazla ~650 kelime.' }
  };
  var KURAL = 'Kurallar: Türkçe yaz. Aşağıdaki kitap metnini SEÇİLEN SEVİYEDE yeniden yaz. Bilgiyi YALNIZ bu metinden al; metinde olmayan sayı, ad ya da olgu uydurma. Metinde olmayan bir açıklama eklemen gerekirse onu ayrı bir "**Genel bilgi:**" paragrafına koy. Başlık olarak alt bölüm adını tekrar yazma. Markdown kullan (kalın, madde).';

  /* ---------- kitap metni (alt bölüm) ---------- */
  function blokMetni(l, s) {
    l.forEach(function (x) {
      if (x.t === 'callout') { s.push('[' + x.tur + '] '); blokMetni(x.bloklar || [], s); return; }
      if (x.t === 'soru' || x.t === 'figur') return;
      if (x.html) s.push(duz(x.html));
      else if (x.ogeler) s.push(x.ogeler.map(function (o) { return '• ' + duz(o); }).join('\n'));
      else if (x.satir) s.push(x.satir.map(function (r) { return r.map(duz).join(' | '); }).join('\n'));
      if (x.bloklar && x.t !== 'callout') blokMetni(x.bloklar, s);
    });
    return s;
  }
  function altMetin(a, sinir) { return blokMetni(a.bloklar, []).join('\n').slice(0, sinir || 9000); }
  U.altMetin = altMetin;

  /* ---------- seçili seviye (kişisel: genel + bölüm başına) ---------- */
  function seviyeAl(kj, bolum) {
    return Depo.oku('seviye').then(function (v) {
      var k = (v && v[kj.id]) || {};
      return k.bolum && k.bolum[bolum.id] != null ? k.bolum[bolum.id] : (k.genel != null ? k.genel : 0);
    });
  }
  function seviyeKaydet(kj, bolum, n, olcum) {
    return U.depoGuncelle('seviye', function (v) {
      var k = v[kj.id] = v[kj.id] || {}; k.bolum = k.bolum || {};
      k.bolum[bolum.id] = n;
      if (olcum) { k.olcum = k.olcum || {}; k.olcum[bolum.id] = olcum; }
    }, 300);
  }

  /* ---------- bir alt bölümü seviyesinde göster ---------- */
  function altUygula(kap, a, kj, n) {
    var eski = $('.seviye-gorunum', kap); if (eski) eski.remove();
    var asil = $$(':scope > :not(h2):not(.alt-son):not(.seviye-gorunum)', kap);
    if (!n) { asil.forEach(function (x) { x.hidden = false; }); kap.classList.remove('seviyeli'); return; }
    var metin = altMetin(a);
    if (metin.replace(/\s/g, '').length < 120) { asil.forEach(function (x) { x.hidden = false; }); return; } // çok kısa alt bölümü olduğu gibi bırak
    asil.forEach(function (x) { x.hidden = true; });
    kap.classList.add('seviyeli');
    var kutu = el('div', { class: 'yp-cevap' });
    var g = el('div', { class: 'seviye-gorunum' }, [
      el('div', { class: 'sv-ust' }, [
        el('span', { class: 'etiket-kucuk ai', text: 'AI yeniden yazımı · ' + SEVIYELER[n].ad }),
        el('span', { class: 'var-etiket', text: 'Kitabın orijinali değil; kitabın bu alt bölümünden üretildi.' }),
        el('button', { class: 'dugme kucuk', type: 'button', onclick: function () { var gz = asil[0] && asil[0].hidden; asil.forEach(function (x) { x.hidden = !gz; }); this.textContent = gz ? 'Orijinali gizle' : '📖 Orijinali göster'; } }, ['📖 Orijinali göster'])]),
      kutu]);
    kap.insertBefore(g, $('.alt-son', kap));
    var basla = function () {
      U.cevapCalistir(kutu, fnv('seviye|' + kj.id + '|' + a.id + '|' + n + '|' + fnv(metin)), function () {
        return 'Bir tıp öğrencisi çalışma kitabını kendi seviyesinde okuyor.\n' + KURAL + '\n\nSEVİYE ' + n + ' (1 = çok özet ve çıkmış odaklı, 5 = çok ayrıntılı ve mantık odaklı): ' + SEVIYELER[n].istek +
          '\n\nKİTAP: ' + kj.baslik + '\nALT BÖLÜM: ' + (a.baslik || '') + '\n"""\n' + metin + '\n"""';
      }, { kj: kj, eylem: 'seviye' + n, sonra: function () { U.atiflariBagla(kutu, kj); } });
    };
    // Yalnız ekrana yaklaşınca üret (gereksiz çağrı yok)
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (e) { if (e.some(function (x) { return x.isIntersecting; })) { io.disconnect(); basla(); } }, { rootMargin: '400px 0px' });
      io.observe(g);
    } else basla();
  }
  function bolumUygula(alan, bolum, kj, n) {
    bolum.altlar.forEach(function (a) { var kap = document.getElementById('alt-' + a.id); if (kap) altUygula(kap, a, kj, n); });
    var s = $('#seviyeSec'); if (s) s.value = String(n);
  }

  function seviyeSecici(alan, bolum, kj) {
    var arac = $('.arac-cubugu');
    if (!arac || $('#seviyeSec', arac)) return;
    var sec = el('select', { id: 'seviyeSec', class: 'seviye-sec', 'aria-label': 'Okuma seviyesi', title: 'Okuma seviyesi: yapay zekâ bölümü seçtiğin seviyede yeniden yazar' });
    sec.appendChild(el('option', { value: '0', text: '📖 Orijinal' }));
    [1, 2, 3, 4, 5].forEach(function (n) { sec.appendChild(el('option', { value: String(n), text: 'Sv ' + n + ' · ' + SEVIYELER[n].ad.split(' · ')[1] + ' (AI)' })); });
    sec.addEventListener('change', function () {
      var n = +sec.value, kjA = Durum.aktifKitap, bA = Durum.aktifBolum;
      if (n) U.AI.hazir().then(function (ok) { if (!ok) { toast('Yapay zekâ bu görünümde yok; seviyeli okuma için sayfayı claude.ai içinde aç.'); sec.value = '0'; return; } seviyeKaydet(kjA, bA, n); bolumUygula($('.metin'), bA, kjA, n); });
      else { seviyeKaydet(kjA, bA, 0); bolumUygula($('.metin'), bA, kjA, 0); }
    });
    var olc = el('button', { id: 'seviyeOlcDug', class: 'ikon-dugme ai-gerek', type: 'button', title: 'Seviyemi ölç: bu bölümden AI sınavı', onclick: function () { olcumAc(Durum.aktifKitap, Durum.aktifBolum); } }, ['🎯', el('span', { class: 'uzun', text: ' Seviyemi ölç' })]);
    var zy = $('#zamanimYokDug', arac);
    arac.insertBefore(sec, zy ? zy.nextSibling : (arac.children[2] || null));
    arac.insertBefore(olc, sec.nextSibling);
  }

  var onceki = U.sonIsle;
  U.sonIsle = function (alan, bolum, kj) {
    onceki(alan, bolum, kj);
    seviyeSecici(alan, bolum, kj);
    var s = $('#seviyeSec'); if (s) s.value = '0';
    seviyeAl(kj, bolum).then(function (n) {
      if (Durum.aktifBolum !== bolum || !n) return;
      U.AI.hazir().then(function (ok) { if (ok && Durum.aktifBolum === bolum) bolumUygula(alan, bolum, kj, n); });
    });
  };

  /* ---------- AI seviye ölçme sınavı ---------- */
  var SORU_SAYISI = 10;
  function katla(s) { return String(s || '').toLocaleLowerCase('tr').replace(/[^0-9a-zçğıöşü]+/g, ' ').trim(); }
  function olcumAc(kj, bolum) {
    if (!kj || !bolum) return;
    var govde = U.panelAc('🎯 Seviye ölçme · ' + (bolum.kisa || bolum.baslik), kj.baslik);
    govde.appendChild(el('p', { class: 'var-etiket', text: 'Yapay zekâ bu bölümün metninden kolaydan zora ' + SORU_SAYISI + ' soru üretir. Sorular AI üretimidir; her biri kitaptan birebir bir alıntıya dayanır, alıntısı kitapta bulunamayan soru atılır. Sonuca göre okuma seviyen önerilir.' }));
    var kutu = el('div', { class: 'olcum' });
    govde.appendChild(kutu);
    kutu.appendChild(el('div', { class: 'yukleniyor', text: 'Sorular hazırlanıyor…' }));
    var metinler = bolum.altlar.map(function (a) { return (a.baslik ? '## ' + a.baslik + '\n' : '') + altMetin(a, 2600); });
    var metin = metinler.join('\n').slice(0, 16000), kat = katla(metin);
    var anahtar = fnv('olcum|' + kj.id + '|' + bolum.id + '|' + fnv(metin));
    U.AI.hazir().then(function (ok) {
      if (!ok) { kutu.innerHTML = ''; kutu.appendChild(el('p', { class: 'var-etiket', text: 'Yapay zekâ bu görünümde yok. Sayfayı claude.ai içinde aç.' })); return; }
      return U.AI.onbellekOku(anahtar).then(function (o) {
        if (o && o.sorular) return o.sorular;
        var istem = 'Bir tıp öğrencisinin aşağıdaki çalışma kitabı bölümündeki seviyesini ölçmek için ' + SORU_SAYISI + ' çoktan seçmeli soru yaz. Türkçe.\n' +
          'Kurallar:\n- Sorular YALNIZ bu metne dayansın; metinde olmayan bilgi sorma.\n- Zorluk 1-5: her zorluktan 2 soru. 1 = sınavda çıkmış/temel tanım (ezber), 3 = kavramlar arası ilişki, 5 = mekanizma ve "neden" (mantık yürütme, iki bilgiyi birleştirme).\n- Her sorunun 4 şıkkı olsun, tek doğru.\n- "kanit": cevabı destekleyen, metinden BİREBİR kopyalanmış 6-25 kelimelik alıntı.\n' +
          'Yalnız JSON dizi döndür: [{"zorluk":1,"soru":"...","siklar":["...","...","...","..."],"dogru":0,"aciklama":"tek cümle","kanit":"..."}]\n\nKİTAP: ' + kj.baslik + '\nBÖLÜM: ' + bolum.baslik + '\n"""\n' + metin + '\n"""';
        return Y.sample.json(istem, { modelTier: 'default' }).then(function (l) {
          if (!Array.isArray(l)) l = (l && l.sorular) || [];
          var temiz = l.filter(function (q) {
            return q && q.soru && Array.isArray(q.siklar) && q.siklar.length >= 3 && q.dogru >= 0 && q.dogru < q.siklar.length && q.kanit && kat.indexOf(katla(q.kanit)) >= 0;
          }).map(function (q) { return { z: Math.max(1, Math.min(5, +q.zorluk || 3)), s: String(q.soru), k: q.siklar.map(String), d: +q.dogru, a: String(q.aciklama || ''), kn: String(q.kanit) }; });
          if (temiz.length) U.AI.onbellekYaz(anahtar, { sorular: temiz, atilan: l.length - temiz.length, kitap: kj.id, eylem: 'olcum', t: Date.now() });
          return temiz;
        });
      }).then(function (sorular) {
        if (!sorular || sorular.length < 4) { kutu.innerHTML = ''; kutu.appendChild(el('p', { class: 'hata-metni', text: 'Yeterli doğrulanmış soru üretilemedi (alıntıları kitapta bulunamadı). Yeniden dene.' })); kutu.appendChild(el('button', { class: 'dugme kucuk', type: 'button', onclick: function () { olcumAc(kj, bolum); } }, ['Yeniden dene'])); return; }
        sorular.sort(function (x, y) { return x.z - y.z; });
        sinavCiz(kutu, sorular, kj, bolum);
      });
    }).catch(function (e) { kutu.innerHTML = ''; kutu.appendChild(el('p', { class: 'hata-metni', text: (e && e.message && /JSON/.test(e.message)) ? 'Yapay zekânın cevabı okunamadı. Yeniden dene.' : U.AI.hataMetni(e) })); kutu.appendChild(el('button', { class: 'dugme kucuk', type: 'button', onclick: function () { olcumAc(kj, bolum); } }, ['Yeniden dene'])); });
  }

  function sinavCiz(kutu, sorular, kj, bolum) {
    kutu.innerHTML = '';
    var cevap = {};
    var sayac = el('div', { class: 'var-etiket', text: '0 / ' + sorular.length + ' cevaplandı' });
    kutu.appendChild(sayac);
    sorular.forEach(function (q, i) {
      var k = el('div', { class: 'olcum-soru' });
      k.appendChild(el('div', { class: 'ust-etiket', text: (i + 1) + '. soru · zorluk ' + '●'.repeat(q.z) + '○'.repeat(5 - q.z) + ' · AI üretimi' }));
      k.appendChild(el('p', { text: q.s }));
      var ac = el('div', { class: 'olcum-aciklama', hidden: true }, [el('p', { text: q.a }), el('p', { class: 'var-etiket', text: 'Kitaptan: “' + q.kn + '”' })]);
      q.k.forEach(function (s, j) {
        k.appendChild(el('button', { class: 'sik', type: 'button', onclick: function () {
          if (i in cevap) return;
          cevap[i] = j === q.d;
          if (j !== q.d && U.eksikEkle) U.eksikEkle({ kitap: kj.id, bolum: bolum.kisa || bolum.baslik, sira: bolum.sira, konu: (q.kn || '').slice(0, 80), soru: q.s.slice(0, 160), bilmiyor: false, zorluk: q.z, kaynak: 'seviye' });
          $$('.sik', k).forEach(function (b, bj) { if (bj === q.d) b.classList.add('dogru'); else if (bj === j) b.classList.add('yanlis'); b.disabled = true; });
          ac.hidden = false;
          var n = Object.keys(cevap).length; sayac.textContent = n + ' / ' + sorular.length + ' cevaplandı';
          if (n === sorular.length) sonuc();
        } }, [String.fromCharCode(65 + j) + ') ' + s]));
      });
      // "Bilmiyorum": yanlış sayılır ve eksik olarak kaydedilir (Carvis "nerede eksiğim var" sorusunda kullanır)
      k.appendChild(el('button', { class: 'sik bilmiyorum', type: 'button', onclick: function () {
        if (i in cevap) return;
        cevap[i] = false;
        $$('.sik', k).forEach(function (b, bj) { if (bj === q.d) b.classList.add('dogru'); b.disabled = true; });
        this.classList.add('secildi');
        ac.hidden = false;
        if (U.eksikEkle) U.eksikEkle({ kitap: kj.id, bolum: bolum.kisa || bolum.baslik, sira: bolum.sira, konu: (q.kn || '').slice(0, 80), soru: q.s.slice(0, 160), bilmiyor: true, zorluk: q.z, kaynak: 'seviye' });
        var n = Object.keys(cevap).length; sayac.textContent = n + ' / ' + sorular.length + ' cevaplandı';
        if (n === sorular.length) sonuc();
      } }, ['🤷 Bilmiyorum']));
      k.appendChild(ac);
      kutu.appendChild(k);
    });
    var sonucKutu = el('div', { class: 'olcum-sonuc' });
    kutu.appendChild(sonucKutu);
    function sonuc() {
      // Puan zorlukla ağırlıklı; seviye = doğru oranı ≥ %60 olan en yüksek zorluk basamağı (alttakiler de geçilmiş olmalı)
      var top = 0, al = 0, kz = {};
      sorular.forEach(function (q, i) { top += q.z; if (cevap[i]) al += q.z; kz[q.z] = kz[q.z] || [0, 0]; kz[q.z][1]++; if (cevap[i]) kz[q.z][0]++; });
      var sv = 0;
      for (var z = 1; z <= 5; z++) { if (!kz[z]) { if (sv === z - 1) sv = z; continue; } if (kz[z][0] / kz[z][1] >= 0.6 && sv === z - 1) sv = z; else break; }
      sv = Math.max(1, sv);
      var puan = Math.round(100 * al / top);
      sonucKutu.innerHTML = '';
      sonucKutu.appendChild(el('h3', { text: 'Sonuç: ' + puan + ' / 100 · önerilen seviye ' + sv }));
      sonucKutu.appendChild(el('p', { class: 'var-etiket', text: 'Seviye, %60 ve üstü doğru yaptığın en yüksek zorluk basamağıdır. Seviye yükseldikçe okuma daha ayrıntılı ve mantık odaklı olur. Bu bir öneridir, istediğin zaman değiştirebilirsin.' }));
      sonucKutu.appendChild(el('div', { class: 'yp-dugmeler' }, [
        el('button', { class: 'dugme kucuk ana', type: 'button', onclick: function () {
          seviyeKaydet(kj, bolum, sv, { puan: puan, seviye: sv, t: Date.now() });
          if (Durum.aktifBolum === bolum) bolumUygula($('.metin'), bolum, kj, sv);
          toast('Bu bölüm artık ' + SEVIYELER[sv].ad + ' ile gösteriliyor.'); U.panelKapat();
        } }, ['Seviye ' + sv + ' uygula']),
        el('button', { class: 'dugme kucuk', type: 'button', onclick: function () { seviyeKaydet(kj, bolum, Durum.aktifBolum === bolum && $('#seviyeSec') ? +$('#seviyeSec').value : 0, { puan: puan, seviye: sv, t: Date.now() }); toast('Sonuç kaydedildi.'); } }, ['Yalnız sonucu kaydet'])]));
      sonucKutu.scrollIntoView({ block: 'nearest' });
    }
  }
  U.olcumAc = olcumAc;
})();
