/* Tüm dersi 0'dan öğren (r120). Rota: #kurs-<kitap>.
   Akış: plan (toplam yaklaşık 45 dk) → seviye ölçme (isteğe bağlı, 3 dk) → konu döngüsü → her 4 konuda karışık tekrar → çıkmış mini sınav.
   Konu adımları: çekirdek (temel bilgiler) · türetme (çekirdekten detaya, gösterim) · uygulama (sen türetirsin, Jane değerlendirir) · kontrol (çıkmış soru) · kapanış.
   İçerik: www/kurs_icerik.js (KursIcerik). Yapay zekâ kullanılmaz.
   "Bilmiyorum" gerçek bilgisizlik sayılır. */
(function () {
  'use strict';
  var U = window.Uygulama; if (!U) return;
  var el = U.el;
  var ANAHTAR = 'kurs_', VARSAYILAN_DK = 20;
  var KONU_TABAN_DK = 0, KARISIK_HER = 1000, KARISIK_N = 3, MINI_N = 6, SEVIYE_N = 5;
  var SABIT_DK = { seviye: 0, mini: 0, karisik: 0 };

  var css = document.createElement('style');
  css.textContent = '.kurs-ilerleme{height:10px;border-radius:999px;background:rgba(94,240,220,.12);overflow:hidden;margin:10px 0}' +
    '.kurs-ilerleme b{display:block;height:100%;background:linear-gradient(90deg,#46c8ff,#5ef0dc);transition:width .4s}' +
    '.kurs-hedef{font:600 12px var(--f-kod,monospace);letter-spacing:.12em;color:#7cf5d9;text-transform:uppercase;margin:6px 0}' +
    '.kurs-kart{border:1px solid rgba(94,240,220,.22);border-radius:16px;padding:16px;margin:12px 0;background:rgba(6,24,32,.5)}' +
    '.kurs-soru{font:600 17px/1.5 var(--f-govde,serif);margin:8px 0 10px}' +
    '.kurs-sik{display:flex;align-items:center;gap:10px;width:100%;min-height:46px;margin:6px 0;padding:10px 14px;text-align:left;border-radius:14px;border:1px solid rgba(94,240,220,.3);background:rgba(2,12,16,.6);color:var(--metin);font:15px/1.4 var(--f-govde,serif);cursor:pointer}' +
    '.kurs-sik:hover{border-color:#5ef0dc}' +
    '.kurs-sik.dogru{border-color:#7cf5d9;background:rgba(124,245,217,.14)}' +
    '.kurs-sik.yanlis{border-color:#ff8a8a;background:rgba(255,120,120,.14)}' +
    '.kurs-geri{margin-top:10px;padding:12px;border-radius:12px;background:rgba(2,12,16,.7);font-size:14px;line-height:1.6}' +
    '.kurs-eylem{display:flex;gap:8px;flex-wrap:wrap;margin-top:14px}.kurs-eylem[hidden]{display:none!important}' +
    '.kurs-mat{font-size:13px;color:#9fc3cf}' +
    '.kurs-formul{border-left:3px solid #5ef0dc;padding:6px 12px;margin:8px 0;font-size:15px;line-height:1.6}' +
    '.kurs-tuzak{border-left:3px solid #ffb84d;padding:6px 12px;margin:8px 0;font-size:15px;line-height:1.6}';
  document.head.appendChild(css);

  /* ---------- saklama ---------- */
  function oku(kid) { try { return JSON.parse(localStorage.getItem(ANAHTAR + kid) || 'null'); } catch (e) { return null; } }
  function yaz(kid, s) { s.t = Date.now(); try { localStorage.setItem(ANAHTAR + kid, JSON.stringify(s)); } catch (e) {} }

  /* ---------- veri ---------- */
  function soruVar(q) { return (q.varyantlar || []).some(function (v) { return v && v.siklar && v.siklar.length >= 2 && v.cevap; }); }
  function soruModel(q) {
    var v = (q.varyantlar || []).filter(function (x) { return x && x.siklar && x.siklar.length >= 2 && x.cevap; }).slice(-1)[0];
    if (!v) return null;
    var dogru = -1; v.siklar.forEach(function (s, i) { if (s.h === v.cevap) dogru = i; });
    return { id: String(q.id), govde: v.govde || '', siklar: v.siklar.map(function (s) { return { h: s.h, m: s.m }; }), dogru: dogru, aciklama: q.cevapHtml || '', sinav: v.sinav || '', konu: q.konu || '', bolum: q.bolum };
  }
  function veriYukle(kid) {
    return Promise.all([
      Promise.resolve().then(function () { return U.Kitaplik.ac(kid); }),
      Promise.resolve().then(function () { return U.Kitaplik.sorular(kid); }).catch(function () { return []; })
    ]).then(function (r) {
      var kj = r[0], sorular = r[1] || [];
      var konular = (kj.bolumler || []).map(function (b, i) { return { b: b, sira: b.sira != null ? b.sira : i }; })
        .filter(function (x) { return !x.b.ozel; }).map(function (x) {
          var soru = sorular.filter(function (q) { return q.bolum === x.b.id && !q.deneme && soruVar(q); })
            .sort(function (a, c) { return String(a.id).localeCompare(String(c.id), 'tr', { numeric: true }); });
          return { sira: x.sira, id: x.b.id, ad: x.b.kisa || x.b.baslik || ('Bölüm ' + (x.sira + 1)), soru: soru, soruSayi: soru.length };
        });
      return { kj: kj, konular: konular };
    });
  }
  function veriKonu(veri, sira) { return veri.konular.filter(function (k) { return k.sira === sira; })[0] || { soru: [] }; }
  var bolumCache = {};
  function bolumGetir(kid, sira) {
    var anahtar = kid + ':' + sira;
    if (!bolumCache[anahtar]) bolumCache[anahtar] = Promise.resolve().then(function () { return U.Kitaplik.bolumAc(kid, sira); });
    return bolumCache[anahtar];
  }
  function html(bloklar) { return (bloklar || []).map(function (y) { return y.html || ''; }).join('<br>'); }
  // Bölüm içeriğini blok türlerine göre ayırır. Anlatım yalnızca alt başlıkların düz paragraflarından gelir.
  function icerikAyikla(bolum) {
    var c = { formuller: [], tuzaklar: [], cozelimler: [], hocalar: [], alt: [] };
    function kutular(bloklar) {
      (bloklar || []).forEach(function (b) {
        if (!b || b.t !== 'callout') return;
        if (b.tur === 'formul') c.formuller.push(b);
        else if (b.tur === 'tuzak') c.tuzaklar.push(b);
        else if (b.tur === 'cozelim') c.cozelimler.push(b);
        else if (b.tur === 'hoca') c.hocalar.push(b);
      });
    }
    (bolum.altlar || []).forEach(function (a) {
      kutular(a.bloklar);
      var metin = (a.bloklar || []).filter(function (b) { return b && b.t === 'p'; }).map(function (b) { return U.duz(b.html || ''); }).join(' ');
      if (metin.trim().length > 40) c.alt.push({ baslik: a.baslik || '', metin: metin });
    });
    return c;
  }
  // Lookbehind kullanılmaz (eski iOS)
  function cumleler(metin) { return String(metin || '').replace(/([.!?])\s+/g, '$1|').split('|').filter(function (x) { return x && x.trim(); }); }
  function kisa(metin, n) { return cumleler(metin).slice(0, n || 2).join(' ').slice(0, 420); }
  function formulBloklari(liste) {
    return liste.map(function (x) {
      return el('div', { class: 'kurs-formul' }, [el('div', { class: 'kurs-mat', text: x.etiket || 'Formül' }), el('div', { html: html(x.bloklar) })]);
    });
  }

  /* ---------- durum ve plan ---------- */
  function yeniDurum(kid, veri, secim) {
    var liste = (secim && secim.length) ? secim.slice() : veri.konular.map(function (k, i) { return i; });
    return { kid: kid, toplamDk: VARSAYILAN_DK, asama: 'plan', konu: 0, adim: 0, secim: liste,
      konular: veri.konular.map(function (k, i) { return { no: i, sira: k.sira, id: k.id, ad: k.ad, soruSayi: k.soruSayi, mod: 'tam', dk: 0 }; })
        .filter(function (k) { return liste.indexOf(k.no) >= 0; }),
      sonuc: {}, kapanis: {}, eksik: [], seviyeSorular: [], seviyeIdx: 0, seviyeCevap: [],
      mini: null, miniIdx: 0, miniSonuc: [], karisikIdx: 0, karisikListe: [] };
  }
  function dagit(st) {
    var n = st.konular.length || 1;
    var sabit = SABIT_DK.seviye + SABIT_DK.mini + Math.ceil(n / KARISIK_HER) * SABIT_DK.karisik;
    var kalan = Math.max(0, (st.toplamDk || VARSAYILAN_DK) - sabit - n * KONU_TABAN_DK);
    var topAg = st.konular.reduce(function (s, k) { return s + (k.soruSayi || 1); }, 0) || n;
    st.konular.forEach(function (k) {
      k.dk = k.mod === 'hizli' ? 1 : KONU_TABAN_DK + Math.round(kalan * ((k.soruSayi || 1) / topAg));
    });
  }
  function kalanDk(st) {
    var dk = st.konular.slice(st.konu).reduce(function (s, k) { return s + (k.dk || 0); }, 0);
    var tekrar = Math.ceil(st.konular.length / KARISIK_HER) * SABIT_DK.karisik;
    return dk + SABIT_DK.mini + (st.asama === 'bitti' ? 0 : tekrar);
  }
  function konuDurumu(st, sira) {
    var s = st.sonuc[sira]; if (!s) return 'yok';
    if (s.bilmiyor) return 'bilmiyor';
    if (s.yanlis) return 'yanlis';
    return s.dogru ? 'dogru' : 'yok';
  }

  /* ---------- soru kartı: şıklar + "Bilmiyorum" ---------- */
  // cb({ durum: 'dogru'|'yanlis'|'bilmiyor', secim, soru }) — cevap verildikten sonra bir kez çağrılır
  function soruKarti(m, cb, formulKap) {
    var kut = el('div', { class: 'kurs-kart' });
    kut.appendChild(el('div', { class: 'kurs-mat', text: (m.sinav || 'Çıkmış soru') + (m.konu ? ' · ' + m.konu : '') }));
    kut.appendChild(el('div', { class: 'kurs-soru', html: m.govde }));
    if (formulKap) kut.appendChild(formulKap);
    var geri = el('div', { class: 'kurs-geri', hidden: true });
    var bitti = false;
    function sec(i) {
      if (bitti) return; bitti = true;
      var durum = i == null ? 'bilmiyor' : (i === m.dogru ? 'dogru' : 'yanlis');
      var dogruH = m.siklar[m.dogru] ? m.siklar[m.dogru].h : '?';
      kut.querySelectorAll('.kurs-sik').forEach(function (b, j) {
        b.disabled = true;
        if (j === m.dogru) b.classList.add('dogru'); else if (j === i) b.classList.add('yanlis');
      });
      geri.hidden = false; geri.innerHTML = '';
      geri.appendChild(el('p', { text: durum === 'dogru' ? '✔ Doğru.' : durum === 'yanlis' ? '✘ Yanlış. Doğru cevap: ' + dogruH + ')' : '○ "Bilmiyorum" dedin. Doğru cevap: ' + dogruH + ')' }));
      if (m.aciklama) geri.appendChild(el('div', { html: m.aciklama }));
      cb({ durum: durum, secim: i, soru: m });
    }
    m.siklar.forEach(function (s, i) {
      kut.appendChild(el('button', { class: 'kurs-sik', type: 'button', onclick: function () { sec(i); } }, [el('b', { text: s.h + ')' }), el('span', { html: s.m })]));
    });
    kut.appendChild(el('button', { class: 'dugme kucuk', type: 'button', text: 'Bilmiyorum', onclick: function () { sec(null); } }));
    kut.appendChild(geri);
    return kut;
  }
  // Sınavda verilen formüller: soruya bağlı açılır kart (sınav da formülleri verir)
  function formulKart(kid, sira) {
    var icerik = el('div', { hidden: true });
    var dugme = el('button', { class: 'dugme kucuk', type: 'button', text: '📐 Sınavda verilen formüller' });
    dugme.addEventListener('click', function () {
      icerik.hidden = !icerik.hidden;
      if (!icerik.hidden && !icerik.dataset.y) {
        icerik.dataset.y = '1';
        bolumGetir(kid, sira).then(function (bo) {
          var f = icerikAyikla(bo).formuller;
          if (!f.length) icerik.appendChild(el('p', { class: 'var-etiket', text: 'Bu konuda formül kartı yok.' }));
          formulBloklari(f).forEach(function (k) { icerik.appendChild(k); });
        }).catch(function () { icerik.appendChild(el('p', { class: 'hata-metni', text: 'Formüller yüklenemedi.' })); });
      }
    });
    return el('div', {}, [el('div', { class: 'kurs-eylem' }, [dugme]), icerik]);
  }

  /* ---------- seviye ölçme: kitap boyunca eşit aralıklı konulardan ---------- */
  function seviyeSecim(veri) {
    var havuz = veri.konular.filter(function (k) { return k.soru.length > 0; });
    if (!havuz.length) return [];
    var n = Math.min(SEVIYE_N, havuz.length), secim = [];
    for (var i = 0; i < n; i++) secim.push(havuz[Math.floor(i * havuz.length / n)]);
    return secim.map(function (k) { return { sira: k.sira, q: k.soru[0] }; });
  }

  /* ---------- sonuç kaydı ---------- */
  function sonucKaydet(st, veri, kid, sira, durum, m) {
    var s = st.sonuc[sira] || (st.sonuc[sira] = { dogru: 0, yanlis: 0, bilmiyor: 0, tamam: false });
    if (durum === 'dogru') s.dogru++; else if (durum === 'yanlis') s.yanlis++; else s.bilmiyor++;
    if (durum !== 'dogru') {
      st.eksik.push({ sira: sira, qid: m.id, durum: durum });
      try {
        var k = st.konular.filter(function (x) { return x.sira === sira; })[0];
        if (U.eksikEkle) U.eksikEkle({ kitap: kid, bolum: k ? k.ad : '', sira: sira, konu: m.konu || '', soru: U.duz(m.govde).slice(0, 160), bilmiyor: durum === 'bilmiyor', kaynak: 'kurs' });
      } catch (e) {}
    }
  }

  /* ---------- konu adımları ---------- */
  // Öğrencinin serbest cevabını Jane'in sesiyle değerlendirir; JSON döner: {"jane": "..."}.
  function janeIstem(soru, anahtar, cevap) {
    return 'Patrick Jane olarak bir tıp öğrencisinin cevabına 1-2 kısa cümleyle karşılık ver. Soru: ' + soru + '\nDoğru cevabın özü: ' + anahtar + '\nÖğrencinin cevabı:  + cevap + \n' +
      'Doğruysa kısaca kabul et ve cevabındaki en zayıf noktayı ima et; kısmen doğruysa neyin eksik olduğunu söyle; yanlışsa hangi varsayımın çöktüğünü söyle. Övme, dolgu yok. YALNIZ JSON: {"jane":"…"}';
  }
  function konuAdimlari(kid, st, k, veri, bolum) {
    var kv = veriKonu(veri, k.sira);
    var kontrolQ = kv.soru.slice(0, 1);
    // İçerik konu konumuna göre eşlenir (k.sira kitap bölüm numarasıdır; giriş bölümü 1'den başlayabilir).
    var konuNo = (typeof k.no === 'number') ? k.no : st.konular.indexOf(k);
    var icerikListe = (window.KursIcerik && window.KursIcerik[kid]) || [];
    var icerik = (icerikListe.filter(function (e) { return e.bolum === k.id; })[0]) ||
      (konuNo >= 0 && icerikListe[konuNo] && !icerikListe[konuNo].bolum ? icerikListe[konuNo] : null);
    var METIN_STIL = 'width:100%;background:var(--zemin);color:var(--metin);border:1px solid var(--cizgi);border-radius:10px;padding:8px;font:15px/1.5 var(--f-govde,system-ui)';
    function devamDugmesi(metin, fn) { return el('div', { class: 'kurs-eylem' }, [el('button', { class: 'dugme ana', type: 'button', text: metin, onclick: fn })]); }

    // 2) Çekirdek: üç temel bilgi, tek tek.
    var cekirdek = (icerik && icerik.cekirdek && icerik.cekirdek.length) ? { ad: 'Çekirdek', ciz: function (kap, bitir) {
      var c = icerik.cekirdek, i = 0, alan = el('div', { class: 'kurs-kart' });
      kap.appendChild(alan);
      function goster() {
        alan.innerHTML = '';
        alan.appendChild(el('div', { class: 'kurs-hedef', text: 'Çekirdek ' + (i + 1) + '/' + c.length }));
        alan.appendChild(el('div', { class: 'kurs-soru', text: c[i].b }));
        alan.appendChild(el('p', { text: c[i].m }));
        alan.appendChild(devamDugmesi(i + 1 < c.length ? 'Devam' : 'Çekirdek tamam', function () { if (i + 1 < c.length) { i++; goster(); } else bitir(); }));
      }
      goster();
    } } : null;

    // 3) Türetme: çekirdekten formüle, adım adım. Sonunda sen dene.
    var turet = (icerik && icerik.turet) ? { ad: 'Türetme', ciz: function (kap, bitir) {
      var t = icerik.turet, i = 0, alan = el('div', { class: 'kurs-kart' });
      kap.appendChild(alan);
      function goster() {
        alan.innerHTML = '';
        alan.appendChild(el('div', { class: 'kurs-hedef', text: 'Türet · ' + t.baslik }));
        t.adimlar.slice(0, i + 1).forEach(function (a, j) { alan.appendChild(el('p', { text: (j + 1) + '. ' + a })); });
        if (i + 1 < t.adimlar.length) { alan.appendChild(devamDugmesi('Sonraki adım', function () { i++; goster(); })); return; }
        alan.appendChild(devamDugmesi('Devam', bitir));
      }
      goster();
    } } : null;

    // Uygulama: çekirdekten bir detayı sen türet. Jane değerlendirir; doğrusu her hâlde gösterilir.
    var uygulama = (icerik && icerik.turet && icerik.turet.kendin) ? { ad: 'Uygulama', ciz: function (kap, bitir) {
      kap.appendChild(el('div', { class: 'kurs-mat', text: 'Şimdi sen türet · Jane değerlendirir' }));
      kap.appendChild(el('div', { class: 'kurs-soru', text: icerik.turet.kendin }));
      var ta = el('textarea', { rows: '2', 'aria-label': 'Tahminin', style: METIN_STIL });
      kap.appendChild(ta);
      var janeYer = el('div', { class: 'kurs-kart', hidden: true });
      kap.appendChild(janeYer);
      var cozum = el('div', { class: 'kurs-kart', hidden: true }, [
        el('div', { class: 'kurs-mat', text: 'Doğrusu' }),
        el('p', { text: icerik.turet.kendinCevap }),
        el('p', { class: 'var-etiket', text: 'Aynı mantığı bir sonraki detaya uygula.' })
      ]);
      var devam = devamDugmesi('Devam', bitir); devam.hidden = true;
      var eylem = el('div', { class: 'kurs-eylem' }, [
        el('button', { class: 'dugme', type: 'button', text: 'Bilmiyorum', onclick: acDogru }),
        el('button', { class: 'dugme ana', type: 'button', text: 'Cevapla', onclick: cevapla })
      ]);
      function acDogru() { cozum.hidden = false; eylem.hidden = true; devam.hidden = false; }
      // Cevabı Patrick Jane değerlendirir (yapay zekâ varsa). Boşsa, yapay zekâ yoksa ya da hata verirse doğrusu doğrudan gösterilir.
      function cevapla() {
        var c = ta.value.trim();
        if (c.length < 2 || !U.Y || !U.Y.sample || !U.Y.sample.json) return acDogru();
        eylem.hidden = true; janeYer.hidden = false; janeYer.innerHTML = '';
        janeYer.appendChild(el('p', { text: 'Jane tartıyor…' }));
        U.Y.sample.json(janeIstem(icerik.turet.kendin, icerik.turet.kendinCevap, c)).then(function (j) {
          janeYer.innerHTML = '';
          janeYer.appendChild(el('div', { class: 'kurs-mat', text: 'Patrick Jane' }));
          janeYer.appendChild(el('p', { text: String((j && j.jane) || 'Not aldım.') }));
          acDogru();
        }).catch(function () { janeYer.hidden = true; acDogru(); });
      }
      kap.appendChild(cozum);
      kap.appendChild(eylem);
      kap.appendChild(devam);
    } } : null;

    // 4) Kontrol: çıkmış sorulardan bir soru. "Bilmiyorum" da geçerli bir cevaptır.
    var kontrol = kontrolQ.length ? { ad: 'Kontrol', ciz: function (kap, bitir) {
      var m = soruModel(kontrolQ[0]);
      var devam = devamDugmesi('Devam', bitir); devam.hidden = true;
      kap.appendChild(el('p', { class: 'var-etiket', text: 'Çıkmış sorudan bir kontrol. Emin değilsen “Bilmiyorum” da dürüst bir cevaptır.' }));
      kap.appendChild(soruKarti(m, function (r) { sonucKaydet(st, veri, kid, k.sira, r.durum, m); yaz(kid, st); if (U.ogrenci) U.ogrenci.kaydet(kid + ':' + k.sira, r.durum === 'dogru'); devam.hidden = false; }, formulKart(kid, k.sira)));
      kap.appendChild(devam);
    } } : null;

    // 5) Kapanış: bu konuyu kendi cümlenle anlat.
    var kapanis = { ad: 'Kapanış', ciz: function (kap, bitir) {
      kap.appendChild(el('p', { class: 'var-etiket', text: 'Bu konuyu tek cümleyle, kendi kelimenle anlat. Ezber değil, çekirdekten çıkabildiğini göster.' }));
      var ta = el('textarea', { rows: '3', 'aria-label': 'Kendi cümlen', style: METIN_STIL });
      kap.appendChild(ta);
      kap.appendChild(devamDugmesi('Kaydet ve devam', function () { st.kapanis[k.sira] = ta.value.trim().slice(0, 400); yaz(kid, st); bitir(); }));
    } };

    // Hızlı mod (seviye ölçmede doğru cevaplanan konu): kontrol · kapanış. İçerik yoksa yalnız kontrol ve kapanış.
    var sira = icerik ? (k.mod === 'hizli' ? [kontrol, kapanis] : [cekirdek, turet, uygulama, kontrol, kapanis]) : [kontrol, kapanis];
    return sira.filter(Boolean);
  }

  /* ---------- ekran ---------- */
  function formulSayfasi(kid, veri) {
    var govde = U.panelAc('📐 Sınavda verilen formüller', veri.kj.baslik.replace(/^1001\s*/, ''));
    govde.appendChild(el('p', { class: 'var-etiket', text: 'Kitabın formül kartları konu sırasıyla. Sınavda da bu formüller verilir.' }));
    veri.konular.forEach(function (k) {
      var kap = el('div');
      govde.appendChild(kap);
      bolumGetir(kid, k.sira).then(function (bo) {
        var f = icerikAyikla(bo).formuller;
        if (!f.length) return;
        kap.appendChild(el('h4', { text: k.ad }));
        formulBloklari(f).forEach(function (x) { kap.appendChild(x); });
      }).catch(function () {});
    });
  }
  function ilerlemeKismi(st) {
    var n = st.konular.length;
    var biten = st.konular.filter(function (k) { return st.sonuc[k.sira] && st.sonuc[k.sira].tamam; }).length;
    var yuzde = st.asama === 'bitti' ? 100 : Math.round(100 * (biten + (st.asama === 'konu' ? 0.3 : 0)) / (n + 1));
    return el('div', {}, [
      el('div', { class: 'kurs-hedef', text: (st.asama === 'bitti' ? 'Tamamlandı' : 'Konu ' + Math.min(st.konu + 1, n) + '/' + n) + ' · kalan yaklaşık ' + (st.asama === 'bitti' ? 0 : kalanDk(st)) + ' dk' }),
      el('div', { class: 'kurs-ilerleme' }, [el('b', { style: 'width:' + Math.max(2, yuzde) + '%' })])
    ]);
  }

  function sayfaCiz(kid, veri) {
    var ana = document.getElementById('ana'); if (!ana) return;
    ana.innerHTML = '';
    var sayfa = el('div', { class: 'sayfa' }); ana.appendChild(sayfa);
    var st = oku(kid);
    if (!st || !st.konular || !st.konular.length) { st = yeniDurum(kid, veri); yaz(kid, st); }
    dagit(st);
    sayfa.appendChild(el('div', { class: 'kahraman' }, [el('div', { class: 'ust-etiket', text: 'Tüm dersi 0\'dan öğren' }), el('h1', { text: veri.kj.baslik.replace(/^1001\s*/, '') })]));
    sayfa.appendChild(ilerlemeKismi(st));
    sayfa.appendChild(el('div', { class: 'kurs-eylem' }, [
      el('button', { class: 'dugme kucuk', type: 'button', text: '📐 Formül sayfası', onclick: function () { formulSayfasi(kid, veri); } }),
      el('button', { class: 'dugme kucuk', type: 'button', text: '↺ Baştan başla', onclick: function () { if (confirm('Kurs ilerlemesi silinsin mi?')) { try { localStorage.removeItem(ANAHTAR + kid); } catch (e) {} sayfaCiz(kid, veri); } } })
    ]));
    var govde = el('div'); sayfa.appendChild(govde);
    if (st.asama === 'plan') return planCiz(kid, veri, st, govde);
    if (st.asama === 'seviye') return seviyeCiz(kid, veri, st, govde);
    if (st.asama === 'konu') return konuCiz(kid, veri, st, govde);
    if (st.asama === 'karisik') return karisikCiz(kid, veri, st, govde);
    if (st.asama === 'mini') return miniCiz(kid, veri, st, govde);
    return bitisCiz(kid, veri, st, govde);
  }

  function planCiz(kid, veri, st, kap) {
    if (!st.secim) st.secim = veri.konular.map(function (k, i) { return i; });
    function baslat(asama) {
      var yeni = yeniDurum(kid, veri, st.secim);
      yeni.toplamDk = st.toplamDk; yeni.asama = asama;
      if (asama === 'seviye') yeni.seviyeSorular = seviyeSecim(veri).filter(function (x) { return yeni.konular.some(function (k) { return k.sira === x.sira; }); });
      dagit(yeni); yaz(kid, yeni); sayfaCiz(kid, veri);
    }
    kap.appendChild(el('div', { class: 'kurs-kart' }, [
      el('p', { text: 'Öğrenmek istediğin konuları seç. Seçilenler sıfırdan, kitap sırasıyla işlenir; toplam süre seçime göre dağılır.' }),
      el('p', { class: 'var-etiket', text: 'Seçili: ' + st.secim.length + ' / ' + veri.konular.length + ' konu · toplam yaklaşık ' + st.toplamDk + ' dk' })
    ]));
    var liste = el('div', { class: 'kurs-kart' });
    veri.konular.forEach(function (k, i) {
      var kutu = el('input', { type: 'checkbox', 'aria-label': k.ad });
      kutu.checked = st.secim.indexOf(i) >= 0;
      kutu.addEventListener('change', function () {
        var p = st.secim.indexOf(i);
        if (kutu.checked && p < 0) st.secim.push(i);
        if (!kutu.checked && p >= 0) st.secim.splice(p, 1);
        st.secim.sort(function (x, y) { return x - y; });
        yaz(kid, st); sayfaCiz(kid, veri);
      });
      liste.appendChild(el('label', { class: 'kurs-mat', style: 'display:flex;gap:10px;align-items:center;padding:6px 0;cursor:pointer' }, [
        kutu, el('span', { text: (i + 1) + '. ' + k.ad + ' · ' + k.soruSayi + ' çıkmış soru' })
      ]));
    });
    kap.appendChild(liste);
    kap.appendChild(el('div', { class: 'kurs-eylem' }, [
      el('button', { class: 'dugme kucuk', type: 'button', text: 'Tümünü seç', onclick: function () { st.secim = veri.konular.map(function (k, i) { return i; }); yaz(kid, st); sayfaCiz(kid, veri); } }),
      el('button', { class: 'dugme kucuk', type: 'button', text: 'Temizle', onclick: function () { st.secim = []; yaz(kid, st); sayfaCiz(kid, veri); } })
    ]));
    var bos = !st.secim.length;
    var b1 = el('button', { class: 'dugme ana', type: 'button', text: 'Seviye ölçmeyle başla', onclick: function () { baslat('seviye'); } });
    var b2 = el('button', { class: 'dugme', type: 'button', text: 'Seçilenlerle sıfırdan başla', onclick: function () { baslat('konu'); } });
    b1.disabled = bos; b2.disabled = bos;
    kap.appendChild(el('div', { class: 'kurs-eylem' }, [b1, b2]));
  }

  function seviyeCiz(kid, veri, st, kap) {
    var toplam = st.seviyeSorular.length;
    kap.appendChild(el('p', { class: 'var-etiket', text: 'Seviye ölçme: ' + toplam + ' soru. "Bilmiyorum" dürüst bir cevaptır; o konu tam işlenir.' }));
    var i = st.seviyeIdx || 0;
    if (i >= toplam) {
      st.seviyeSorular.forEach(function (x, j) {
        var k = st.konular.filter(function (y) { return y.sira === x.sira; })[0];
        if (k) k.mod = (st.seviyeCevap[j] === 'dogru') ? 'hizli' : 'tam';
      });
      st.asama = 'konu'; st.konu = 0; st.adim = 0; dagit(st); yaz(kid, st);
      return sayfaCiz(kid, veri);
    }
    var x = st.seviyeSorular[i], m = soruModel(x.q);
    kap.appendChild(el('div', { class: 'kurs-hedef', text: 'Soru ' + (i + 1) + '/' + toplam }));
    var devam = el('div', { class: 'kurs-eylem' }, [el('button', { class: 'dugme ana', type: 'button', text: i + 1 < toplam ? 'Sonraki soru' : 'Sonuçları uygula', onclick: function () { st.seviyeIdx = i + 1; yaz(kid, st); sayfaCiz(kid, veri); } })]);
    devam.hidden = true;
    kap.appendChild(soruKarti(m, function (r) {
      st.seviyeCevap[i] = r.durum;
      sonucKaydet(st, veri, kid, x.sira, r.durum, m);
      yaz(kid, st);
      devam.hidden = false;
    }));
    kap.appendChild(devam);
  }

  function konuCiz(kid, veri, st, kap) {
    if (st.konu >= st.konular.length) {
      st.asama = 'mini'; st.miniIdx = 0; yaz(kid, st);
      return sayfaCiz(kid, veri);
    }
    var k = st.konular[st.konu];
    kap.appendChild(el('div', { class: 'kurs-hedef', text: 'Konu ' + (st.konu + 1) + '/' + st.konular.length + ' · ' + k.ad + ' · ' + (k.mod === 'hizli' ? 'hızlı kontrol' : 'tam anlatım') + ' · hedef ' + k.dk + ' dk' }));
    var alan = el('div'); kap.appendChild(alan);
    bolumGetir(kid, k.sira).then(function (bolum) {
      var adimlar = konuAdimlari(kid, st, k, veri, bolum);
      if (!adimlar.length) { st.konu++; st.adim = 0; yaz(kid, st); return sayfaCiz(kid, veri); }
      if (st.adim >= adimlar.length) st.adim = adimlar.length - 1;
      var a = adimlar[st.adim];
      alan.appendChild(el('div', { class: 'kurs-mat', text: 'Adım ' + (st.adim + 1) + '/' + adimlar.length + ' · ' + a.ad }));
      var icerik = el('div'); alan.appendChild(icerik);
      a.ciz(icerik, function () {
        if (st.adim + 1 < adimlar.length) { st.adim++; yaz(kid, st); return sayfaCiz(kid, veri); }
        var s = st.sonuc[k.sira] || (st.sonuc[k.sira] = { dogru: 0, yanlis: 0, bilmiyor: 0, tamam: false });
        s.tamam = true;
        st.konu++; st.adim = 0;
        if (st.konu % KARISIK_HER === 0 && st.konu < st.konular.length) {
          st.asama = 'karisik'; st.karisikIdx = 0; st.karisikListe = karisikHavuzu(st, veri);
          if (!st.karisikListe.length) st.asama = 'konu';
        }
        yaz(kid, st);
        sayfaCiz(kid, veri);
      });
    }).catch(function (e) { alan.appendChild(el('p', { class: 'hata-metni', text: 'Konu açılamadı: ' + (e.message || e) })); });
  }

  // Karışık tekrar: önce yanlış/bilmiyorum sorular, sonra tamamlanan konulardan birer soru
  function karisikHavuzu(st, veri) {
    var liste = [], gorulen = {};
    st.eksik.slice().reverse().forEach(function (e) {
      if (liste.length >= KARISIK_N || gorulen[e.qid]) return;
      var q = veriKonu(veri, e.sira).soru.filter(function (y) { return String(y.id) === String(e.qid); })[0];
      if (q) { liste.push({ sira: e.sira, q: q }); gorulen[e.qid] = 1; }
    });
    st.konular.slice(0, st.konu).forEach(function (k) {
      var q = veriKonu(veri, k.sira).soru[0];
      if (q && liste.length < KARISIK_N && !gorulen[q.id]) { liste.push({ sira: k.sira, q: q }); gorulen[q.id] = 1; }
    });
    return liste.slice(0, KARISIK_N);
  }
  function karisikCiz(kid, veri, st, kap) {
    kap.appendChild(el('p', { class: 'var-etiket', text: 'Karışık tekrar: önceki konulardan kısa bir karışım. Yanlışların yeniden gelir.' }));
    var i = st.karisikIdx || 0;
    if (i >= st.karisikListe.length) { st.asama = 'konu'; yaz(kid, st); return sayfaCiz(kid, veri); }
    var x = st.karisikListe[i], m = soruModel(x.q);
    kap.appendChild(el('div', { class: 'kurs-hedef', text: 'Tekrar ' + (i + 1) + '/' + st.karisikListe.length }));
    var devam = el('div', { class: 'kurs-eylem' }, [el('button', { class: 'dugme ana', type: 'button', text: 'Sonraki', onclick: function () { st.karisikIdx = i + 1; yaz(kid, st); sayfaCiz(kid, veri); } })]);
    devam.hidden = true;
    kap.appendChild(soruKarti(m, function (r) { sonucKaydet(st, veri, kid, x.sira, r.durum, m); yaz(kid, st); devam.hidden = false; }, formulKart(kid, x.sira)));
    kap.appendChild(devam);
  }

  // Çıkmış mini sınav: konular arasında dönüşümlü, her konudan en fazla bir soru (ilk tur)
  function miniListe(veri) {
    var sirali = veri.konular.filter(function (k) { return k.soru.length > 0; }).sort(function (a, b) { return b.soru.length - a.soru.length; });
    var liste = [], gorulen = {};
    for (var tur = 0; liste.length < MINI_N && tur < 10; tur++) {
      sirali.forEach(function (k) {
        var q = k.soru[tur];
        if (q && liste.length < MINI_N && !gorulen[q.id]) { gorulen[q.id] = 1; liste.push({ sira: k.sira, q: q }); }
      });
    }
    return liste;
  }
  function miniCiz(kid, veri, st, kap) {
    if (!st.mini || !st.mini.length) st.mini = miniListe(veri);
    if (!st.mini.length) { st.asama = 'bitti'; yaz(kid, st); return sayfaCiz(kid, veri); }
    kap.appendChild(el('p', { class: 'var-etiket', text: 'Çıkmış mini sınav: ' + st.mini.length + ' soru. Formül gerekiyorsa "Sınavda verilen formüller" düğmesine bas; sınavda da böyle.' }));
    var i = st.miniIdx || 0;
    if (i >= st.mini.length) { st.asama = 'bitti'; yaz(kid, st); return sayfaCiz(kid, veri); }
    var x = st.mini[i], m = soruModel(x.q);
    kap.appendChild(el('div', { class: 'kurs-hedef', text: 'Soru ' + (i + 1) + '/' + st.mini.length }));
    var devam = el('div', { class: 'kurs-eylem' }, [el('button', { class: 'dugme ana', type: 'button', text: i + 1 < st.mini.length ? 'Sonraki' : 'Sonucu gör', onclick: function () { st.miniIdx = i + 1; yaz(kid, st); sayfaCiz(kid, veri); } })]);
    devam.hidden = true;
    kap.appendChild(soruKarti(m, function (r) {
      st.miniSonuc[i] = { sira: x.sira, durum: r.durum };
      if (r.durum !== 'dogru') sonucKaydet(st, veri, kid, x.sira, r.durum, m);
      yaz(kid, st);
      devam.hidden = false;
    }, formulKart(kid, x.sira)));
    kap.appendChild(devam);
  }

  function bitisCiz(kid, veri, st, kap) {
    var sonuc = (st.miniSonuc || []).filter(Boolean);
    var toplam = (st.mini || []).length || sonuc.length || 1;
    var dogru = sonuc.filter(function (s) { return s.durum === 'dogru'; }).length;
    kap.appendChild(el('div', { class: 'kurs-kart' }, [
      el('div', { class: 'kurs-hedef', text: 'Çıkmış mini sınav sonucu' }),
      el('p', { text: 'Doğru: ' + dogru + '/' + toplam + ' (%' + Math.round(100 * dogru / toplam) + '). "Bilmiyorum" ve yanlışlar yanlış sayıldı.' })
    ]));
    var zayif = st.konular.filter(function (k) { var s = st.sonuc[k.sira]; return s && (s.bilmiyor || s.yanlis); });
    if (zayif.length) {
      kap.appendChild(el('p', { text: 'Tekrar edilecek konular:' }));
      zayif.forEach(function (k) {
        kap.appendChild(el('div', { class: 'kurs-eylem' }, [
          el('span', { class: 'kurs-mat', text: k.ad + ' (' + konuDurumu(st, k.sira) + ')' }),
          el('a', { class: 'dugme kucuk', href: '#' + U.okuHash(kid, k.sira), text: 'Konuyu oku' })
        ]));
      });
    } else {
      kap.appendChild(el('p', { text: 'Yanlış ya da bilmiyorum işaretlenen konu yok.' }));
    }
    kap.appendChild(el('div', { class: 'kurs-eylem' }, [el('button', { class: 'dugme', type: 'button', text: 'Mini sınavı yeniden kur', onclick: function () { st.mini = null; st.miniIdx = 0; st.miniSonuc = []; st.asama = 'mini'; yaz(kid, st); sayfaCiz(kid, veri); } })]));
  }

  U.GORUNUMLER.kurs = function (kid) {
    kid = String(kid || '').trim();
    var ana = document.getElementById('ana'); if (!ana) return;
    ana.innerHTML = '';
    if (!kid) { ana.appendChild(el('div', { class: 'sayfa' }, [el('p', { text: 'Önce bir kitap seç.' })])); return; }
    ana.appendChild(el('div', { class: 'sayfa' }, [el('div', { class: 'yukleniyor', text: 'Kurs hazırlanıyor…' })]));
    veriYukle(kid).then(function (veri) {
      if (!veri.konular.length) { ana.innerHTML = ''; ana.appendChild(el('div', { class: 'sayfa' }, [el('p', { class: 'hata-metni', text: 'Bu derste konu bulunamadı.' })])); return; }
      sayfaCiz(kid, veri);
    }).catch(function (e) {
      ana.innerHTML = '';
      ana.appendChild(el('div', { class: 'sayfa' }, [el('p', { class: 'hata-metni', text: 'Kurs açılamadı: ' + (e.message || e) })]));
    });
  };

  window.TamKurs = { formulSayfasi: formulSayfasi };
})();
