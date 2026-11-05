/* Tüm dersi 0'dan öğren (r118). Rota: #kurs-<kitap>.
   Akış: plan (süre seçimi) → seviye ölçme (isteğe bağlı) → konu döngüsü → her 4 konuda karışık tekrar → çıkmış mini sınav.
   Tam konu adımları: tahmin · formül · anlatım · çözümlü örnek · tuzak · kontrol · kapanış.
   Hızlı mod (seviye ölçmede doğru cevaplanan konu): kontrol · tuzak · kapanış.
   İçerik kitabın kendi bloklarından (formul, tuzak, cozelim, hoca) ve çıkmış soru havuzundan gelir; yapay zekâ kullanılmaz.
   "Bilmiyorum" gerçek bilgisizlik sayılır: konu tam işlenir ve sınavda yanlış kabul edilir. */
(function () {
  'use strict';
  var U = window.Uygulama; if (!U) return;
  var el = U.el;
  var ANAHTAR = 'kurs_', VARSAYILAN_DK = 90;
  var KONU_TABAN_DK = 2, KARISIK_HER = 4, KARISIK_N = 3, MINI_N = 10, SEVIYE_N = 8;
  var SABIT_DK = { seviye: 6, mini: 10, karisik: 2 };

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
          return { sira: x.sira, ad: x.b.kisa || x.b.baslik || ('Bölüm ' + (x.sira + 1)), soru: soru, soruSayi: soru.length };
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
  function yeniDurum(kid, veri) {
    return { kid: kid, toplamDk: VARSAYILAN_DK, asama: 'plan', konu: 0, adim: 0,
      konular: veri.konular.map(function (k) { return { sira: k.sira, ad: k.ad, soruSayi: k.soruSayi, mod: 'tam', dk: 0 }; }),
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
  function konuAdimlari(kid, st, k, veri, bolum) {
    var ic = icerikAyikla(bolum), kv = veriKonu(veri, k.sira);
    var soru = kv.soru.slice();
    var tahminQ = (k.mod === 'tam' && soru.length) ? soru[soru.length > 1 ? 1 : 0] : null;
    var kontrolQ = soru.filter(function (q) { return !tahminQ || q.id !== tahminQ.id; }).slice(0, 2);
    function devamDugmesi(metin, fn) { return el('div', { class: 'kurs-eylem' }, [el('button', { class: 'dugme ana', type: 'button', text: metin, onclick: fn })]); }

    var tahmin = tahminQ ? { ad: 'Tahmin et', ciz: function (kap, bitir) {
      kap.appendChild(el('p', { class: 'var-etiket', text: 'Önce tahmin et. Yanlış bilsen de öğrenme bu andan başlar.' }));
      var devam = devamDugmesi('Devam', bitir); devam.hidden = true;
      var m = soruModel(tahminQ);
      kap.appendChild(soruKarti(m, function (r) { sonucKaydet(st, veri, kid, k.sira, r.durum, m); yaz(kid, st); devam.hidden = false; }, formulKart(kid, k.sira)));
      kap.appendChild(devam);
    } } : null;
    var formul = (k.mod === 'tam' && ic.formuller.length) ? { ad: 'Formül', ciz: function (kap, bitir) {
      kap.appendChild(el('p', { class: 'var-etiket', text: 'Sınavda bu formüller verilir. Nereden geldiklerine bak.' }));
      formulBloklari(ic.formuller).forEach(function (x) { kap.appendChild(x); });
      kap.appendChild(devamDugmesi('Anladım, devam', bitir));
    } } : null;
    var anlatim = null;
    if (k.mod === 'tam') {
      var parcalar = [];
      ic.hocalar.slice(0, 1).forEach(function (h) { parcalar.push({ baslik: h.etiket || 'Hoca vurgusu', html: html(h.bloklar) }); });
      ic.alt.slice(0, 3).forEach(function (a) { parcalar.push({ baslik: a.baslik || 'Ana fikir', metin: kisa(a.metin, 2) }); });
      if (parcalar.length) anlatim = { ad: 'Anlatım', ciz: function (kap, bitir) {
        var i = 0, alan = el('div', { class: 'kurs-kart' });
        kap.appendChild(alan);
        function goster() {
          alan.innerHTML = '';
          var p = parcalar[i];
          alan.appendChild(el('div', { class: 'kurs-hedef', text: (i + 1) + '/' + parcalar.length + ' · ' + p.baslik }));
          alan.appendChild(p.html ? el('div', { html: p.html }) : el('p', { text: p.metin }));
          alan.appendChild(devamDugmesi(i + 1 < parcalar.length ? 'Devam' : 'Anlatım bitti', function () { if (i + 1 < parcalar.length) { i++; goster(); } else bitir(); }));
        }
        goster();
      } };
    }
    var cozelim = ic.cozelimler.length ? { ad: 'Çözümlü örnek', ciz: function (kap, bitir) {
      var c = ic.cozelimler[0];
      var ilk = (c.bloklar && c.bloklar[0]) ? c.bloklar[0].html || '' : '';
      var ayrik = ilk.split(/<br\s*\/?>\s*<br\s*\/?>/i);
      kap.appendChild(el('div', { class: 'kurs-kart' }, [el('div', { class: 'kurs-mat', text: 'Gel çözelim · önce kendin dene' }), el('div', { html: ayrik.slice(0, 2).join('<br><br>') })]));
      var cozum = el('div', { class: 'kurs-kart', hidden: true });
      var kalanBloklar = (c.bloklar || []).slice(1).map(function (y) { return y.html || ''; }).join('<br>');
      cozum.appendChild(el('div', { html: ayrik.slice(2).join('<br><br>') + (kalanBloklar ? '<br>' + kalanBloklar : '') }));
      kap.appendChild(cozum);
      var goster = el('button', { class: 'dugme', type: 'button', text: 'Çözümü göster' });
      goster.addEventListener('click', function () { cozum.hidden = false; goster.hidden = true; });
      kap.appendChild(el('div', { class: 'kurs-eylem' }, [goster, el('button', { class: 'dugme ana', type: 'button', text: 'Devam', onclick: bitir })]));
    } } : null;
    var tuzak = ic.tuzaklar.length ? { ad: 'Tuzak', ciz: function (kap, bitir) {
      kap.appendChild(el('p', { class: 'var-etiket', text: 'Sınavda en çok buraya düşülür.' }));
      ic.tuzaklar.forEach(function (x) { kap.appendChild(el('div', { class: 'kurs-tuzak', html: html(x.bloklar) })); });
      kap.appendChild(devamDugmesi('Devam', bitir));
    } } : null;
    var kontrol = kontrolQ.length ? { ad: 'Kontrol', ciz: function (kap, bitir) {
      var i = 0, alan = el('div');
      kap.appendChild(alan);
      function goster() {
        alan.innerHTML = '';
        var m = soruModel(kontrolQ[i]);
        alan.appendChild(el('div', { class: 'kurs-hedef', text: 'Kontrol ' + (i + 1) + '/' + kontrolQ.length }));
        var devam = devamDugmesi(i + 1 < kontrolQ.length ? 'Sonraki' : 'Kontrol bitti', function () { if (i + 1 < kontrolQ.length) { i++; goster(); } else bitir(); });
        devam.hidden = true;
        alan.appendChild(soruKarti(m, function (r) { sonucKaydet(st, veri, kid, k.sira, r.durum, m); yaz(kid, st); devam.hidden = false; }, formulKart(kid, k.sira)));
        alan.appendChild(devam);
      }
      goster();
    } } : null;
    var kapanis = { ad: 'Kapanış', ciz: function (kap, bitir) {
      kap.appendChild(el('p', { class: 'var-etiket', text: 'Bu konuyu tek cümleyle, kendi kelimenle anlat. Sınavda bunu yapabilmen gerekecek.' }));
      var ta = el('textarea', { rows: '3', 'aria-label': 'Kendi cümlen', style: 'width:100%;background:var(--zemin);color:var(--metin);border:1px solid var(--cizgi);border-radius:10px;padding:8px;font:15px/1.5 var(--f-govde)' });
      kap.appendChild(ta);
      kap.appendChild(devamDugmesi('Kaydet ve devam', function () { st.kapanis[k.sira] = ta.value.trim().slice(0, 400); yaz(kid, st); bitir(); }));
    } };
    // Hızlı mod: kontrol · tuzak · kapanış. Tam mod: tahmin · formül · anlatım · çözümlü örnek · tuzak · kontrol · kapanış.
    var sira = k.mod === 'hizli' ? [kontrol, tuzak, kapanis] : [tahmin, formul, anlatim, cozelim, tuzak, kontrol, kapanis];
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
    if (!st || !st.konular || st.konular.length !== veri.konular.length) { st = yeniDurum(kid, veri); yaz(kid, st); }
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
    kap.appendChild(el('div', { class: 'kurs-kart' }, [
      el('p', { text: st.konular.length + ' konu, kitap sırasıyla. Her konuda önce tahmin edersin, sonra kitabın formül, tuzak ve çözümlü örneklerine bakarsın. Toplam süre:' }),
      el('div', { class: 'kurs-eylem' }, [60, 90, 120].map(function (dk) {
        return el('button', { class: 'dugme' + (st.toplamDk === dk ? ' ana' : ''), type: 'button', text: dk + ' dk', onclick: function () { st.toplamDk = dk; dagit(st); yaz(kid, st); sayfaCiz(kid, veri); } });
      }))
    ]));
    var liste = el('div', { class: 'kurs-kart' });
    st.konular.forEach(function (k) { liste.appendChild(el('div', { class: 'kurs-mat', text: k.ad + ' · ' + k.dk + ' dk · ' + k.soruSayi + ' çıkmış soru' })); });
    kap.appendChild(liste);
    kap.appendChild(el('div', { class: 'kurs-eylem' }, [
      el('button', { class: 'dugme ana', type: 'button', text: 'Seviye ölçmeyle başla (önerilen)', onclick: function () { st.asama = 'seviye'; st.seviyeSorular = seviyeSecim(veri); st.seviyeIdx = 0; st.seviyeCevap = []; yaz(kid, st); sayfaCiz(kid, veri); } }),
      el('button', { class: 'dugme', type: 'button', text: 'Doğrudan başla', onclick: function () { st.asama = 'konu'; st.konu = 0; st.adim = 0; yaz(kid, st); sayfaCiz(kid, veri); } })
    ]));
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
