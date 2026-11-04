/* 1001 — 🔮 Çıkmış sorular (kullanıcı, 2026-11-04: "tahmin kısmı çıkmış soruya dönüşsün"):
   📚 Konu konu: önce konu özeti, sonra Jane sarsılma turu, sonra o bölümün çıkmış soruları (en kesin çıkandan detaya doğru).
   🎯 Deneme: komite formatı, 100 soru / 100 dk. Dersler karışık, en olası çıkmışlar önde. Ders dağılımı komite tablosundan.
   🎩 Jane'in tahmini: Patrick Jane bölümde çıkmasını beklediği yerleri soruyla yoklar (gerçek çıkmışlardan ayrı etiketli).
   Her soruda 5 şık + "Bilmiyorum". İkisi birlikte işaretlenebilir: doğru şık + bilmiyorum = "tık bilgi"; yanlış şık + bilmiyorum = "şans denemesi".
   Bu ayrım geri bildirime ve Eksikler'e gider. Eski "Bu yıl ne çıkar" istatistik sayfası app15.js'te yerinde duruyor (dersprog/koç kullanır). */
(function () {
  'use strict';
  var U = window.Uygulama; if (!U) return;
  var el = U.el, $ = U.$, esc = U.esc, Y = U.Y, Kitaplik = U.Kitaplik, Durum = U.Durum;
  var DERSLER = [['Anatomi', /anatomi/i], ['Biyokimya', /biyokimya/i], ['Biyofizik', /biyofizik/i], ['Biyoistatistik', /istatistik/i],
    ['Nükleer Tıp', /nükleer/i], ['Halk Sağlığı', /halk sağlığı/i], ['Tıp Tarihi', /tıp tarihi|tarih/i]];
  // komite tablosu (1001 final, 100 soru / 100 dk)
  var DENEME_DAGILIM = { 'Anatomi': 23, 'Biyokimya': 26, 'Biyofizik': 14, 'Nükleer Tıp': 2, 'Tıp Tarihi': 14, 'Biyoistatistik': 19, 'Halk Sağlığı': 2 };
  var SURE_DK = 100;
  var KAT_ETIKET = { bildim: '✓ Bildin', yanlis: '✗ Yanlış', tikBilgi: '◐ Tık bilgi: doğru ama emin değildin', sans: '🎲 Şans denemesi: bilmiyordun ve yanlış şıkkı seçtin', bilmiyor: '? Bilmiyordun', bos: '— Boş bıraktın' };

  var css = document.createElement('style');
  css.textContent = [
    '.ck-sekme{display:flex;gap:6px;flex-wrap:wrap;margin:8px 0}.ck-sekme button.on{outline:2px solid var(--vurgu)}',
    '.ck-secili{outline:2px solid var(--vurgu);background:rgba(94,240,220,.08)!important}',
    '.ck-dogru{border-color:#5ef0dc!important}.ck-yanlis{border-color:#ff8a8a!important}',
    '.ck-bil{margin-top:6px;border-style:dashed}',
    '.ck-kart-ust{display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap}',
    '.ck-sayac{font:700 20px var(--f-kod,monospace);color:var(--vurgu)}',
    '.ck-nav{display:flex;gap:4px;flex-wrap:wrap;margin:8px 0}.ck-nav button{min-width:32px;padding:2px 4px;font-size:12px}.ck-nav .dolu{background:rgba(94,240,220,.18)}.ck-nav .aktif{outline:2px solid var(--vurgu)}',
    '.ck-ozet{white-space:pre-wrap;font-size:14px;line-height:1.5;max-height:340px;overflow:auto;border-left:2px solid var(--vurgu);padding:6px 10px}',
    '.ck-rozet{font-size:11px;padding:1px 6px;border-radius:4px;border:1px solid var(--vurgu);color:var(--vurgu);margin-left:4px}',
    '.ck-tablo{width:100%;border-collapse:collapse;font-size:13px;margin:8px 0}.ck-tablo td,.ck-tablo th{border-bottom:1px solid var(--cizgi);padding:4px 6px;text-align:left}'
  ].join('\n');
  document.head.appendChild(css);

  /* ---------- veri ---------- */
  function dersOf(baslik) { for (var i = 0; i < DERSLER.length; i++) if (DERSLER[i][1].test(String(baslik || ''))) return DERSLER[i][0]; return ''; }
  // yıl: "25-26 Final", "2025-26 Final" ya da "2024 Final 12" biçimlerinden
  function yilCoz(s) { s = String(s || ''); var m = /(\d{2})-(\d{2})/.exec(s); if (m) return 2000 + +m[1]; m = /(20\d{2})/.exec(s); return m ? +m[1] : 0; }
  function varyantEtiket(v) { return v.sinav || v.no || ''; }
  function secVaryant(q) {
    var vs = (q.varyantlar || []).filter(function (v) { return v.siklar && v.siklar.length >= 2 && v.cevap; });
    vs.sort(function (a, b) { return yilCoz(varyantEtiket(b)) - yilCoz(varyantEtiket(a)); });
    return vs[0] || null;
  }
  function bolumSira(kj, bolumId) { for (var i = 0; i < kj.bolumler.length; i++) if (kj.bolumler[i].id === bolumId) return i; return 0; }
  function bolumAd(kj, bolumId) { var b = kj.bolumler[bolumSira(kj, bolumId)] || {}; return b.kisa || b.baslik || ''; }
  // favori puanı: kaç farklı yılda çıktı, ateş işareti, yıldız; küçük rastgele pay (her turda aynı sıra çıkmasın)
  function favori(q) {
    var yillar = {}; (q.varyantlar || []).forEach(function (v) { var y = yilCoz(varyantEtiket(v)); if (y) yillar[y] = 1; });
    return Object.keys(yillar).length * 10 + ((q.onem && q.onem.yildiz) || 0) * 3 + (q.onem && q.onem.ates ? 4 : 0) + Math.random() * 2;
  }
  function soruDonustur(kj, q, ders) {
    var v = secVaryant(q); if (!v) return null;
    var dogru = -1; v.siklar.forEach(function (s, i) { if (s.h === v.cevap) dogru = i; }); if (dogru < 0) return null;
    return { id: q.id, kitap: kj.id, kitapAd: kj.baslik.replace(/^1001\s*/, ''), ders: ders, bolum: q.bolum, bolumAd: bolumAd(kj, q.bolum), sira: bolumSira(kj, q.bolum),
      alt: q.alt, konu: q.konu || '', soru: v.govde, siklar: v.siklar.map(function (s) { return s.m; }), dogru: dogru,
      aciklamaHtml: q.cevapHtml || '', etiket: varyantEtiket(v), guvenli: true, sk: favori(q), jane: false };
  }
  var havuzBellek = null;
  // tüm kitaplardan çıkmış soru havuzu (bir kez yüklenir)
  function havuzYukle() {
    if (havuzBellek) return Promise.resolve(havuzBellek);
    return Kitaplik.katalog().then(function (liste) {
      return Promise.all(liste.map(function (k) {
        var ders = dersOf(k.baslik);
        return Promise.all([Kitaplik.ac(k.id), Kitaplik.sorular(k.id)]).then(function (r) {
          return r[1].filter(function (q) { return !q.deneme; }).map(function (q) { return soruDonustur(r[0], q, ders || 'Diğer'); }).filter(Boolean);
        }).catch(function () { return []; });
      })).then(function (parcalar) { havuzBellek = [].concat.apply([], parcalar); return havuzBellek; });
    });
  }

  /* ---------- tek soru kartı ---------- */
  // anlik: true → cevapla düğmesi, hemen geri bildirim (konu/Jane). false → deneme: yalnız işaretle.
  function kategori(sik, bil, dogru) {
    if (sik < 0 && !bil) return 'bos';
    if (sik < 0 && bil) return 'bilmiyor';
    if (!bil) return sik === dogru ? 'bildim' : 'yanlis';
    return sik === dogru ? 'tikBilgi' : 'sans';
  }
  function soruKarti(q, no, o) {
    o = o || {};
    var st = { sik: o.ilk ? o.ilk.sik : -1, bil: o.ilk ? !!o.ilk.bil : false, kat: null };
    var kart = el('div', { class: 'tt-kutu ck-kart' });
    var baslik = el('div', { class: 'tt-soru' });
    baslik.innerHTML = no + '. ' + (q.guvenli ? q.soru : esc(q.soru)) + ' <small>(' + esc(q.etiket || '') + (q.konu ? ' · ' + esc(q.konu) : '') + (q.jane ? ' · Jane\'in tahmini' : '') + ')</small>';
    kart.appendChild(baslik);
    var siklar = el('div', { class: 'ck-siklar' }), dugmeler = [];
    q.siklar.forEach(function (s, j) {
      var b = el('button', { class: 'sik', type: 'button' }, [el('span', { class: 'harf', text: 'ABCDEFG'[j] }), el('span', { html: q.guvenli ? s : esc(s) })]);
      b.addEventListener('click', function () { if (st.kat) return; st.sik = st.sik === j ? -1 : j; boya(); if (o.secim) o.secim(st); });
      dugmeler.push(b); siklar.appendChild(b);
    });
    var bil = el('button', { class: 'sik ck-bil', type: 'button' }, [el('span', { class: 'harf', text: '?' }), el('span', { text: 'Bilmiyorum (şıkla birlikte de işaretleyebilirsin)' })]);
    bil.addEventListener('click', function () { if (st.kat) return; st.bil = !st.bil; boya(); if (o.secim) o.secim(st); });
    siklar.appendChild(bil); kart.appendChild(siklar);
    function boya() {
      dugmeler.forEach(function (b, j) { b.classList.toggle('ck-secili', st.sik === j); });
      bil.classList.toggle('ck-secili', st.bil);
      if (cevapDug) cevapDug.disabled = !(st.sik >= 0 || st.bil);
    }
    var cevapDug = null, geri = el('div');
    kart.appendChild(geri);
    if (o.anlik) {
      cevapDug = el('button', { class: 'dugme ana', type: 'button', text: 'Cevapla', disabled: true });
      cevapDug.addEventListener('click', function () {
        if (st.kat) return;
        st.kat = kategori(st.sik, st.bil, q.dogru);
        cevapDug.remove(); siklar.querySelectorAll('button').forEach(function (b) { b.disabled = true; });
        dugmeler.forEach(function (b, j) { if (j === q.dogru) b.classList.add('ck-dogru'); else if (j === st.sik) b.classList.add('ck-yanlis'); });
        var etiket = KAT_ETIKET[st.kat];
        geri.appendChild(el('div', { class: 'tt-sonuc', text: etiket + ' · doğru cevap ' + 'ABCDEFG'[q.dogru] }));
        if (q.aciklamaHtml) geri.appendChild(el('div', { class: 'tt-aciklama', html: q.aciklamaHtml }));
        if (o.cevaplandi) o.cevaplandi(st.kat, q);
      });
      kart.appendChild(cevapDug);
    }
    if (o.kilit) { siklar.querySelectorAll('button').forEach(function (b) { b.disabled = true; }); }
    boya();
    return { el: kart, st: st, q: q };
  }

  /* ---------- kayıt ---------- */
  // her çıkmış cevabı: kategori + soru kimliği. Yanlış / şans / bilmiyor → Eksikler (tekrar planına girer)
  function kayitEt(mod, cats) {
    var t = Date.now();
    U.depoGuncelle('cikmisSonuc', function (v) {
      v.liste = (v.liste || []).concat([{ t: t, mod: mod, cevaplar: cats.map(function (c) { return { id: c.q.id, kat: c.kat, ders: c.q.ders, kitap: c.q.kitap, konu: c.q.konu, jane: !!c.q.jane }; }) }]).slice(-200);
    }, 200).catch(function () {});
    cats.forEach(function (c) {
      if (['yanlis', 'sans', 'bilmiyor'].indexOf(c.kat) < 0 || !U.eksikEkle) return;
      U.eksikEkle({ kitap: c.q.kitap, bolum: c.q.bolumAd || '', sira: c.q.sira || 0, konu: c.q.konu || '', soru: String(U.duz ? U.duz(c.q.soru) : c.q.soru).slice(0, 160), bilmiyor: c.kat === 'bilmiyor', kaynak: 'cikmis-' + mod });
    });
  }

  /* ---------- 📚 konu konu ---------- */
  function konuAkisi(govde, kj, bolum, sorular) {
    govde.innerHTML = '';
    var adim = el('div', { class: 'tt-kutu' });
    govde.appendChild(adim);
    // 1) konu özeti
    adim.appendChild(el('div', { class: 'ck-kart-ust' }, [el('b', { text: '1 · Konu özeti · ' + (bolum.kisa || bolum.baslik || '') })]));
    var ozet = el('div', { class: 'ck-ozet', text: 'Özet hazırlanıyor…' }); adim.appendChild(ozet);
    var devam1 = el('button', { class: 'dugme ana', type: 'button', text: 'Özeti okudum → Jane' }); adim.appendChild(devam1);
    Promise.resolve().then(function () { ozet.textContent = U.bolumOzu ? U.bolumOzu(bolum, 4000) : ''; });
    // 2) Jane sarsılma
    var janeKap = el('div', { hidden: true }); govde.appendChild(janeKap);
    var devam2 = null;
    devam1.addEventListener('click', function () {
      devam1.remove(); janeKap.hidden = false;
      if (U.janeSorgu) U.janeSorgu(janeKap, kj, bolum);
      devam2 = el('button', { class: 'dugme kucuk ana', type: 'button', text: 'Jane bitti → çıkmış sorular' });
      devam2.addEventListener('click', function () { devam2.remove(); sorulariCiz(); });
      janeKap.appendChild(devam2);
    });
    // 3) çıkmış sorular
    function sorulariCiz() {
      var kap = el('div'); govde.appendChild(kap);
      if (!sorular.length) { kap.appendChild(el('p', { class: 'var-etiket', text: 'Bu bölümde çıkmış soru yok (kitap yüklü değil ya da bölüm eşleşmedi).' })); return; }
      kap.appendChild(el('h3', { text: '2 · Çıkmış sorular (' + sorular.length + ') — en kesin çıkandan detaya' }));
      var sayac = { bildim: 0, yanlis: 0, tikBilgi: 0, sans: 0, bilmiyor: 0 }, cats = [], ilk = 0;
      sorular.forEach(function (q, i) {
        var k = soruKarti(q, i + 1, { anlik: true, cevaplandi: function (kat) { sayac[kat] = (sayac[kat] || 0) + 1; cats.push({ q: q, kat: kat }); ilerle(); } });
        k.el.hidden = i !== 0; kap.appendChild(k.el);
      });
      var ozetKap = el('div'); kap.appendChild(ozetKap);
      function ilerle() {
        var sonraki = kap.querySelectorAll('.ck-kart')[cats.length];
        if (sonraki) { sonraki.hidden = false; sonraki.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
        if (cats.length === sorular.length) {
          kayitEt('konu', cats);
          ozetKap.appendChild(el('div', { class: 'tt-sonuc', text: 'Bölüm bitti: ' + sayac.bildim + ' bildin · ' + sayac.tikBilgi + ' tık bilgi · ' + sayac.sans + ' şans denemesi · ' + sayac.yanlis + ' yanlış · ' + sayac.bilmiyor + ' bilmiyordun. Yanlış ve bilmiyorduklarını Eksikler\'e ekledim.' }));
        }
      }
    }
  }

  /* ---------- 🎯 deneme ---------- */
  function denemeKur(havuz) {
    var secilen = [], eksik = {};
    Object.keys(DENEME_DAGILIM).forEach(function (d) {
      var aday = havuz.filter(function (x) { return x.ders === d; }).sort(function (a, b) { return b.sk - a.sk; });
      var n = DENEME_DAGILIM[d], al = aday.slice(0, n);
      if (al.length < n) eksik[d] = n - al.length;
      secilen = secilen.concat(al);
    });
    // en olası en önde; dersler karışık kalsın diye yalnız puana göre sıralanır
    secilen.sort(function (a, b) { return b.sk - a.sk; });
    return { sorular: secilen, eksik: eksik };
  }
  function denemeBaslat(govde, havuz) {
    govde.innerHTML = '';
    var d = denemeKur(havuz);
    if (!d.sorular.length) { govde.appendChild(el('p', { class: 'hata-metni', text: 'Deneme için çıkmış soru yok. Kitapları kütüphaneye yükle.' })); return; }
    var eksikMetin = Object.keys(d.eksik).length ? ' Havuzda yetmeyen dersler: ' + Object.keys(d.eksik).map(function (k) { return k + ' (-' + d.eksik[k] + ')'; }).join(', ') + '. Bu kitapları yükleyince tam 100 olur.' : '';
    govde.appendChild(el('p', { class: 'var-etiket', text: d.sorular.length + ' soru · ' + SURE_DK + ' dakika. Önce en olası çıkmışlar. Cevapları işaretle, sonda puan.' + eksikMetin }));
    var t0 = Date.now(), sureSn = SURE_DK * 60;
    var ust = el('div', { class: 'ck-kart-ust' }), sayacEl = el('span', { class: 'ck-sayac' });
    ust.appendChild(sayacEl); ust.appendChild(el('button', { class: 'dugme kucuk', type: 'button', text: 'Bitir', onclick: function () { bitir(); } }));
    govde.appendChild(ust);
    var nav = el('div', { class: 'ck-nav' }), kartKap = el('div'), kartlar = [], navDugme = [];
    govde.appendChild(nav); govde.appendChild(kartKap);
    d.sorular.forEach(function (q, i) {
      var k = soruKarti(q, i + 1, { anlik: false, secim: function () { boyaNav(); } });
      k.el.hidden = i !== 0; kartKap.appendChild(k.el); kartlar.push(k);
      var b = el('button', { class: 'dugme kucuk', type: 'button', text: String(i + 1) });
      b.addEventListener('click', function () { goster(i); });
      navDugme.push(b); nav.appendChild(b);
    });
    var aktif = 0, bitti = false;
    var geriBtn = el('button', { class: 'dugme kucuk', type: 'button', text: '← Önceki' }), ileriBtn = el('button', { class: 'dugme kucuk', type: 'button', text: 'Sonraki →' });
    geriBtn.addEventListener('click', function () { goster(aktif - 1); }); ileriBtn.addEventListener('click', function () { goster(aktif + 1); });
    govde.appendChild(el('div', { class: 'yp-dugmeler' }, [geriBtn, ileriBtn]));
    function goster(i) { if (i < 0 || i >= kartlar.length) return; kartlar[aktif].el.hidden = true; aktif = i; kartlar[i].el.hidden = false; boyaNav(); }
    function boyaNav() {
      navDugme.forEach(function (b, i) { b.classList.toggle('aktif', i === aktif); b.classList.toggle('dolu', !!(kartlar[i].st.sik >= 0 || kartlar[i].st.bil)); });
    }
    boyaNav();
    var iv = setInterval(function () {
      if (!document.body.contains(govde)) { clearInterval(iv); return; }
      var kalan = sureSn - Math.round((Date.now() - t0) / 1000);
      if (kalan <= 0) { clearInterval(iv); bitir(); return; }
      sayacEl.textContent = Math.floor(kalan / 60) + ':' + ('0' + kalan % 60).slice(-2);
    }, 1000);
    function bitir() {
      if (bitti) return; bitti = true; clearInterval(iv);
      var cats = kartlar.map(function (k) { return { q: k.q, kat: kategori(k.st.sik, k.st.bil, k.q.dogru), sik: k.st.sik, bil: k.st.bil }; });
      var say = { bildim: 0, tikBilgi: 0, sans: 0, yanlis: 0, bilmiyor: 0, bos: 0 }, dersSay = {};
      cats.forEach(function (c) {
        say[c.kat]++;
        var ds = dersSay[c.q.ders] = dersSay[c.q.ders] || { n: 0, dogru: 0 }; ds.n++;
        if (c.kat === 'bildim' || c.kat === 'tikBilgi') ds.dogru++;
      });
      var net = (say.bildim + say.tikBilgi) - (say.yanlis + say.sans) / 4;
      govde.innerHTML = '';
      govde.appendChild(el('h3', { text: 'Deneme sonucu' }));
      govde.appendChild(el('div', { class: 'th-kpi' }, [
        el('div', {}, [el('b', { text: say.bildim + say.tikBilgi + '/' + cats.length }), el('small', { text: 'doğru (' + say.tikBilgi + ' tık bilgi dahil)' })]),
        el('div', {}, [el('b', { text: net.toFixed(1) }), el('small', { text: 'net (yanlış ve şans: 4\'te 1 düşer)' })]),
        el('div', {}, [el('b', { text: say.sans + say.yanlis }), el('small', { text: 'yanlış + şans denemesi' })]),
        el('div', {}, [el('b', { text: say.bilmiyor + say.bos }), el('small', { text: 'bilmiyorum / boş' })])]));
      var tablo = el('table', { class: 'ck-tablo' }, [el('tr', {}, [el('th', { text: 'Ders' }), el('th', { text: 'Soru' }), el('th', { text: 'Doğru' })])]);
      Object.keys(dersSay).forEach(function (k) { tablo.appendChild(el('tr', {}, [el('td', { text: k }), el('td', { text: String(dersSay[k].n) }), el('td', { text: dersSay[k].dogru + '/' + dersSay[k].n })])); });
      govde.appendChild(tablo);
      kayitEt('deneme', cats);
      govde.appendChild(el('h3', { text: 'Soru soru gözden geçir' }));
      cats.forEach(function (c, i) {
        var k = soruKarti(c.q, i + 1, { anlik: false, kilit: true, ilk: { sik: c.sik, bil: c.bil } });
        k.el.appendChild(el('div', { class: 'tt-sonuc', text: KAT_ETIKET[c.kat] + ' · doğru cevap ' + 'ABCDEFG'[c.q.dogru] }));
        if (c.q.aciklamaHtml) k.el.appendChild(el('div', { class: 'tt-aciklama', html: c.q.aciklamaHtml }));
        k.el.querySelectorAll('.sik').forEach(function (b, j) { if (j === c.q.dogru) b.classList.add('ck-dogru'); else if (j === c.sik) b.classList.add('ck-yanlis'); });
        govde.appendChild(k.el);
      });
    }
  }

  /* ---------- 🎩 Jane'in tahmini ---------- */
  function janeTahmini(govde, kj, bolum) {
    govde.innerHTML = '';
    var durum = el('div', { class: 'yukleniyor', text: 'Jane bölümü okuyor, çıkmasını beklediği yerleri yazıyor…' });
    govde.appendChild(durum);
    var kapsam = U.bolumOzu ? U.bolumOzu(bolum, 6000) : '';
    Promise.all([U.cikmisOzet ? U.cikmisOzet(kj, bolum) : Promise.resolve(''), U.AI.hazir()]).then(function (r) {
      var ok = r[1]; if (!ok) throw { code: 'not_granted' };
      var istem = 'Sen Patrick Jane\'sin (The Mentalist): sakin, kendinden emin, oyuncu; isabetli ve adil. Bir tıp öğrencisine, aşağıdaki bölümde sınavda çıkması en olası 8 çoktan seçmeli soruyu yaz.\n' +
        'Kurallar: Her soru yalnız bu metinde açıkça geçen bilgiye dayansın. 5 şık (A-E), tek doğru; şıklar aynı türden ve inandırıcı olsun; "hepsi/hiçbiri" yok. Doğru şıkkın yeri değişsin. ' +
        'Sorular çıkmış sorulardaki sınanan noktalara yakın olsun (üslup ve konu), aynısını sorma. Doğru şık bölüm metninde açıkça yazılsın; çeldiriciler metinde geçen yakın kavramlardan olsun ki öğrenci gerçekten ayırt etmek zorunda kalsın.\n' +
        'Yalnız JSON: {"sorular":[{"soru":"...","siklar":["...","...","...","...","..."],"dogru":0-4,"aciklama":"doğru cevabın nedeni, 1-2 cümle, Jane ağzından","konu":"2-4 kelime"}]}\n\n' +
        (r[0] ? 'ÇIKMIŞ SORU ÖRNEKLERİ:\n' + r[0] + '\n\n' : '') + 'BÖLÜM METNİ:\n"""\n' + kapsam + '\n"""';
      return Y.sample.json(istem, { cache: false });
    }).then(function (j) {
      var sorular = (j && j.sorular || []).filter(function (q) { return q && q.soru && Array.isArray(q.siklar) && q.siklar.length === 5 && q.dogru >= 0 && q.dogru < 5 && metinde(q.soru + ' ' + q.siklar[q.dogru] + ' ' + (q.aciklama || ''), kapsam); }).slice(0, 8)
        .map(function (q, i) { return { id: 'jane-' + i, kitap: kj.id, kitapAd: kj.baslik, ders: dersOf(kj.baslik) || 'Diğer', bolum: bolum.id, bolumAd: bolum.kisa || bolum.baslik || '', sira: bolumSira(kj, bolum.id), alt: '', konu: String(q.konu || ''), soru: String(q.soru), guvenli: false, siklar: q.siklar.map(String), dogru: +q.dogru, aciklamaHtml: esc(String(q.aciklama || '')), etiket: 'Jane\'in tahmini', jane: true, sk: 0 }; });
      if (sorular.length < 3) throw new Error('Jane yeterince bölüme dayalı soru üretemedi (' + sorular.length + '/8). Yeniden dene.');
      govde.innerHTML = '';
      govde.appendChild(el('p', { class: 'var-etiket', text: 'Bunlar Jane\'in tahmini. Gerçek çıkmış sorular değil; sonuçları ayrı tutulur.' }));
      var cats = [], kap = el('div'); govde.appendChild(kap);
      sorular.forEach(function (q, i) {
        var k = soruKarti(q, i + 1, { anlik: true, cevaplandi: function (kat) { cats.push({ q: q, kat: kat }); var s2 = kap.querySelectorAll('.ck-kart')[cats.length]; if (s2) { s2.hidden = false; s2.scrollIntoView({ behavior: 'smooth', block: 'center' }); } if (cats.length === sorular.length) { kayitEt('jane', cats); kap.appendChild(el('div', { class: 'tt-sonuc', text: 'Jane tahmini bitti: ' + cats.filter(function (c) { return c.kat === 'bildim' || c.kat === 'tikBilgi'; }).length + '/' + cats.length + ' doğru.' })); } } });
        k.el.hidden = i !== 0; kap.appendChild(k.el);
      });
    }).catch(function (e) {
      govde.innerHTML = '';
      govde.appendChild(el('p', { class: 'hata-metni', text: 'Jane tahmin üretemedi: ' + (e && e.code === 'not_granted' ? 'yapay zekâ izni yok. Ayarlardan bağla.' : (e.message || e)) }));
    });
  }

  // Jane'in sorusu bölüm metninde karşılığı olan kelimelerden oluşmalı (anahtar kelimelerin yarısından fazlası metinde geçsin)
  var DURDUR = { bunu: 1, hangisi: 1, hangisidir: 1, olarak: 1, sonuç: 1, nedeni: 1, nedir: 1, nasıl: 1, öğrenci: 1, cevap: 1, neden: 1, doğru: 1, yanlış: 1, şekilde: 1, aşağıdakilerden: 1, aşağıdaki: 1 };
  function normal(s) { return String(s || '').toLocaleLowerCase('tr').replace(/[^a-zçğıöşü0-9]+/g, ' '); }
  function metinde(soru, metin) {
    var m = ' ' + normal(metin) + ' ';
    var kel = normal(soru).split(' ').filter(function (w) { return w.length >= 5 && !DURDUR[w]; });
    if (!kel.length) return false;
    var hit = kel.filter(function (w) { return m.indexOf(w) >= 0; }).length;
    return hit >= Math.max(1, Math.ceil(kel.length / 2));
  }

  /* ---------- sayfa ---------- */
  U.GORUNUMLER.tahmin = function (arg) {
    var ana = $('#ana'); ana.innerHTML = '';
    var sayfa = el('div', { class: 'sayfa' }); ana.appendChild(sayfa);
    sayfa.appendChild(el('div', { class: 'kahraman' }, [el('div', { class: 'ust-etiket', text: 'Çıkmış' }), el('h1', { text: '🔮 Çıkmış' }),
      el('p', { text: 'Konu konu çöz, komite formatında deneme yap ya da Jane\'in çıkmasını beklediği yerleri soy. Her soruda 5 şık + “Bilmiyorum”: ikisini birlikte işaretlersen doğruysa “tık bilgi”, yanlışsa “şans denemesi” olarak kaydedilir.' })]));
    var kitapSec = el('select', { 'aria-label': 'Kitap' }), bolumSec = el('select', { 'aria-label': 'Bölüm' });
    sayfa.appendChild(el('div', { class: 'yp-dugmeler', style: 'align-items:center;flex-wrap:wrap' }, [kitapSec, bolumSec]));
    var sekmeKap = el('div', { class: 'ck-sekme' }), govde = el('div');
    var modlar = [['konu', '📚 Konu konu'], ['deneme', '🎯 Deneme (100)'], ['jane', '🎩 Jane\'in tahmini']], aktifMod = 'konu';
    var sekmeDug = {};
    modlar.forEach(function (m) {
      var b = el('button', { class: 'dugme kucuk', type: 'button', text: m[1] });
      b.addEventListener('click', function () { aktifMod = m[0]; boya(); calistir(); });
      sekmeDug[m[0]] = b; sekmeKap.appendChild(b);
    });
    function boya() { Object.keys(sekmeDug).forEach(function (k) { sekmeDug[k].classList.toggle('on', k === aktifMod); }); }
    sayfa.appendChild(sekmeKap); sayfa.appendChild(govde);
    var katalog = [], kitapCache = {};
    Kitaplik.katalog().then(function (liste) {
      katalog = liste;
      liste.forEach(function (k) { kitapSec.appendChild(el('option', { value: k.id, text: (dersOf(k.baslik) || 'Diğer') + ' · ' + k.baslik.replace(/^1001\s*/, ''), selected: (arg || (Durum.aktifKitap && Durum.aktifKitap.id)) === k.id ? true : null })); });
      kitapSecDegisti();
      boya(); calistir();
    }).catch(function (e) { govde.appendChild(el('p', { class: 'hata-metni', text: 'Kitaplar yüklenemedi: ' + (e.message || e) })); });
    kitapSec.addEventListener('change', kitapSecDegisti);
    bolumSec.addEventListener('change', function () { calistir(); });
    function kitapSecDegisti() {
      bolumSec.innerHTML = '';
      Kitaplik.ac(kitapSec.value).then(function (kj) {
        kj.bolumler.forEach(function (b, i) { bolumSec.appendChild(el('option', { value: String(i), text: (b.no ? b.no + ' · ' : '') + (b.kisa || b.baslik || '') })); });
        var aktifB = Durum.aktifBolum && Durum.aktifKitap && Durum.aktifKitap.id === kj.id ? kj.bolumler.map(function (b) { return b.id; }).indexOf(Durum.aktifBolum.id) : -1;
        if (aktifB >= 0) bolumSec.value = String(aktifB);
      }).catch(function () {});
    }
    function calistir() {
      govde.innerHTML = '';
      govde.appendChild(el('div', { class: 'yukleniyor', text: 'Hazırlanıyor…' }));
      var kitapId = kitapSec.value;
      if (aktifMod === 'deneme') {
        havuzYukle().then(function (havuz) { govde.innerHTML = ''; denemeBaslat(govde, havuz); }).catch(function (e) { govde.innerHTML = ''; govde.appendChild(el('p', { class: 'hata-metni', text: 'Deneme yüklenemedi: ' + (e.message || e) })); });
        return;
      }
      Kitaplik.ac(kitapId).then(function (kj) {
        var idx = Math.max(0, +bolumSec.value || 0);
        // tam bölüm (bloklar dahil) gerekir: özet ve Jane metni oradan okunur
        return Kitaplik.bolumAc(kitapId, idx).then(function (bolum) {
          if (aktifMod === 'jane') { govde.innerHTML = ''; janeTahmini(govde, kj, bolum); return; }
          return Kitaplik.sorular(kitapId).catch(function () { return []; }).then(function (l) {
            var sorular = l.filter(function (q) { return !q.deneme && q.bolum === bolum.id; }).map(function (q) { return soruDonustur(kj, q, dersOf(kj.baslik)); }).filter(Boolean).sort(function (a, b) { return b.sk - a.sk; });
            konuAkisi(govde, kj, bolum, sorular);
          });
        });
      }).catch(function (e) { govde.innerHTML = ''; govde.appendChild(el('p', { class: 'hata-metni', text: 'Yüklenemedi: ' + (e.message || e) })); });
    }
  };
  // sekme adı: kısayollarda artık "Çıkmış"
  var sekme = (U.SEKMELER || []).filter(function (s) { return s.id === 'tahmin'; })[0];
  if (sekme) sekme.ad = 'Çıkmış';
})();
