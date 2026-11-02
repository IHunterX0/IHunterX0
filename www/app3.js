/* 1001 — Aşama 3: kartlar (SM-2), test, yanlış defteri, zayıf konular, öncelik haritası */
(function () {
  'use strict';
  var U = window.Uygulama, A = window.KitapAyristir;
  var el = U.el, $ = U.$, $$ = U.$$, esc = U.esc, duz = U.duz, toast = U.toast, Y = U.Y, Kitaplik = U.Kitaplik, Durum = U.Durum;
  var fnv = A.fnv, katla = A.katla;

  function bugun() { return Math.floor((Date.now() - new Date().getTimezoneOffset() * 60000) / 864e5); }
  function gunAdi(g) { return new Date(g * 864e5).toISOString().slice(0, 10); }

  U.SEKMELER.splice(2, 0, { id: 'kartlar', ad: 'Kartlar', ikon: '❖' }, { id: 'test', ad: 'Test', ikon: '◎' }, { id: 'calisma', ad: 'Analiz', ikon: '◭' });

  /* ================= kart üretimi ================= */
  function kartlariUret(kitapId) {
    return Promise.all([Kitaplik.ac(kitapId), Kitaplik.sorular(kitapId).catch(function () { return []; }), Kitaplik.terimler(kitapId), Kitaplik.tumBolumler(kitapId), U.Depo.oku('kartlarim')])
      .then(function (r) {
        var kj = r[0], sorular = r[1], terimler = r[2], bolumler = r[3], benim = (r[4].liste || []).filter(function (k) { return k.kitap === kitapId; });
        var kartlar = [], bolumSira = {};
        kj.bolumler.forEach(function (b) { bolumSira[b.id] = b.sira; });
        // soru varyantları
        sorular.forEach(function (q) {
          q.varyantlar.forEach(function (v, i) {
            if (!v.siklar.length && !duz(v.govde)) return;
            kartlar.push({ id: 'q:' + q.id + ':' + i, tur: 'soru', kitap: kitapId, bolum: bolumSira[q.bolum], blok: q.blok,
              on: (v.etiket || v.sinav ? '<div class="var-etiket">' + esc([v.sinav, v.no ? v.no + '. soru' : ''].filter(Boolean).join(' · ')) + '</div>' : '') + '<p>' + v.govde + '</p>' +
                (v.siklar.length ? '<ol class="kart-sik">' + v.siklar.map(function (s) { return '<li><b>' + s.h + ')</b> ' + s.m + '</li>'; }).join('') + '</ol>' : ''),
              arka: (v.cevap ? '<p class="kart-cevap">Cevap: <b>' + v.cevap + '</b></p>' : '<p class="var-etiket">Tek resmî cevap harfi yok; açıklamaya göre değerlendir.</p>') + (q.cevapHtml || ''),
              onem: q.onem });
          });
        });
        // köken / sözlük
        terimler.forEach(function (t) {
          var alan = Object.keys(t.alanlar);
          if (!alan.length) return;
          kartlar.push({ id: 't:' + fnv(t.terim + '|' + (t.blok || '')), tur: 'terim', kitap: kitapId, bolum: null, blok: t.blok,
            on: '<p class="kart-terim">' + esc(t.terim) + '</p><p class="var-etiket">' + esc(alan.join(' · ')) + '?</p>',
            arka: '<dl class="kk-dl">' + alan.map(function (k) { return '<dt>' + esc(k) + '</dt><dd>' + esc(t.alanlar[k]) + '</dd>'; }).join('') + '</dl>' });
        });
        // tuzak + formül kutuları
        bolumler.forEach(function (bol) {
          bol.altlar.forEach(function (a) {
            (function gez(l) {
              l.forEach(function (x) {
                if (x.t === 'callout' && (x.tur === 'tuzak' || x.tur === 'formul')) {
                  var govde = x.bloklar.map(function (y) { return U.blokCiz(y, kj, {}).outerHTML; }).join('');
                  kartlar.push({ id: 'c:' + x.id, tur: x.tur, kitap: kitapId, bolum: bol.sira, blok: x.id,
                    on: '<div class="var-etiket">' + esc((a.baslik || bol.kisa)) + '</div><p class="kart-terim">' + (x.tur === 'tuzak' ? '⚠️ Bu konudaki tuzak ne?' : '📐 ' + esc(x.etiket.replace(/^📐\s*/, ''))) + '</p>',
                    arka: govde });
                }
                if (x.bloklar) gez(x.bloklar);
              });
            })(a.bloklar);
          });
        });
        benim.forEach(function (k) {
          kartlar.push({ id: 'k:' + k.id, tur: k.ai ? 'ai' : 'benim', kitap: kitapId, bolum: k.bolum, blok: k.blok, on: '<p>' + esc(k.on) + '</p>',
            arka: '<p>' + esc(k.arka) + '</p>' + (k.kaynak ? '<p class="alinti">Kaynak: “' + esc(k.kaynak) + '”</p>' : ''), ai: !!k.ai });
        });
        return { kj: kj, kartlar: kartlar };
      });
  }
  U.kartlariUret = kartlariUret;

  /* SM-2: durum [ef, aralik(gün), tekrar, vade(gün)] ; puan 1..4 → q 1,3,4,5 */
  function sm2(d, puan) {
    var q = [0, 1, 3, 4, 5][puan];
    var ef = d ? d[0] : 2.5, ar = d ? d[1] : 0, n = d ? d[2] : 0;
    if (q < 3) { n = 0; ar = 1; }
    else { n++; ar = n === 1 ? 1 : n === 2 ? 6 : Math.round(ar * ef); if (puan === 4) ar = Math.round(ar * 1.3); }
    ef = Math.max(1.3, ef + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02)));
    return [+ef.toFixed(2), ar, n, bugun() + (q < 3 ? 0 : ar)];
  }
  U.sm2 = sm2;

  var KART_TUR = { soru: 'Çıkmış soru', terim: 'Köken/sözlük', tuzak: 'Tuzak', formul: 'Formül', benim: 'Benim kartım', ai: 'AI kartı' };
  U.GORUNUMLER.kartlar = function () {
    var ana = $('#ana'); ana.innerHTML = '';
    var sayfa = el('div', { class: 'sayfa calis-sayfa' }); ana.appendChild(sayfa);
    var ust = el('div', { class: 'kahraman' }, [el('div', { class: 'ust-etiket', text: 'Aralıklı tekrar · SM-2' }), el('h1', { text: 'Kartlar' })]);
    sayfa.appendChild(ust);
    var filtre = el('div', { class: 'filtre-satir' });
    var alan = el('div', { class: 'kart-alan' }, [el('div', { class: 'yukleniyor', text: 'Kartlar hazırlanıyor…' })]);
    sayfa.appendChild(filtre); sayfa.appendChild(alan);
    var secim = U.ls('kartFiltre') || { kitap: Durum.kitapId || 'anatomi', bolum: '', tur: ['soru', 'terim', 'tuzak', 'formul', 'benim', 'ai'], yeni: 20 };
    Kitaplik.katalog().then(function (liste) {
      if (!Kitaplik.kayit(secim.kitap)) secim.kitap = liste[0].id;
      var kSec = el('select', { id: 'kartKitap', 'aria-label': 'Kitap' }, liste.map(function (k) { return el('option', { value: k.id, text: k.baslik, selected: k.id === secim.kitap ? true : null }); }));
      var bSec = el('select', { id: 'kartBolum', 'aria-label': 'Bölüm' });
      var turKap = el('div', { class: 'yp-dugmeler' });
      Object.keys(KART_TUR).forEach(function (t) {
        var c = el('button', { class: 'cip', type: 'button', 'aria-pressed': String(secim.tur.indexOf(t) >= 0) }, [KART_TUR[t]]);
        c.addEventListener('click', function () { var i = secim.tur.indexOf(t); if (i >= 0) secim.tur.splice(i, 1); else secim.tur.push(t); c.setAttribute('aria-pressed', String(i < 0)); yukle(); });
        turKap.appendChild(c);
      });
      filtre.appendChild(el('div', { class: 'filtre-ic' }, [el('label', { class: 'var-etiket', for: 'kartKitap', text: 'Kitap' }), kSec, el('label', { class: 'var-etiket', for: 'kartBolum', text: 'Bölüm' }), bSec]));
      filtre.appendChild(turKap);
      kSec.addEventListener('change', function () { secim.kitap = kSec.value; secim.bolum = ''; yukle(true); });
      bSec.addEventListener('change', function () { secim.bolum = bSec.value; yukle(); });
      function yukle(bolumYenile) {
        U.ls('kartFiltre', secim);
        alan.innerHTML = ''; alan.appendChild(el('div', { class: 'yukleniyor', text: 'Kartlar hazırlanıyor…' }));
        Promise.all([kartlariUret(secim.kitap), U.Depo.oku('srs-' + secim.kitap)]).then(function (r) {
          var kj = r[0].kj, srs = r[1];
          if (bolumYenile || !bSec.options.length) {
            bSec.innerHTML = ''; bSec.appendChild(el('option', { value: '', text: 'Tüm bölümler' }));
            kj.bolumler.forEach(function (b) { bSec.appendChild(el('option', { value: String(b.sira), text: b.baslik, selected: String(b.sira) === secim.bolum ? true : null })); });
          }
          var havuz = r[0].kartlar.filter(function (k) { return secim.tur.indexOf(k.tur) >= 0 && (secim.bolum === '' || String(k.bolum) === secim.bolum); });
          var g = bugun();
          var vadeli = havuz.filter(function (k) { return srs[k.id] && srs[k.id][3] <= g; });
          var yeniBugun = (srs._yeni && srs._yeni.g === g) ? srs._yeni.n : 0;
          var yeniler = havuz.filter(function (k) { return !srs[k.id]; }).sort(function (a, b) { return ((b.onem && b.onem.yildiz) || 0) - ((a.onem && a.onem.yildiz) || 0); }).slice(0, Math.max(0, secim.yeni - yeniBugun));
          oturum(alan, kj, vadeli.concat(yeniler), srs, havuz.length, secim.kitap);
        }).catch(function (e) { alan.innerHTML = ''; alan.appendChild(el('div', { class: 'bos', text: 'Kartlar açılamadı: ' + e.message })); });
      }
      yukle(true);
    });
  };
  function oturum(alan, kj, kuyruk, srs, toplam, kitapId) {
    alan.innerHTML = '';
    var sayac = el('div', { class: 'kart-sayac' });
    alan.appendChild(sayac);
    if (!kuyruk.length) {
      alan.appendChild(el('div', { class: 'bos' }, ['Bugünlük tekrar bitti. ', el('br'), 'Bu filtrede ' + toplam + ' kart var; yeni kartlar yarın gelir. Filtreyi değiştirerek başka kartlara geçebilirsin.']));
      return;
    }
    var i = 0, cevrik = false, cozulen = 0;
    var kartEl = el('div', { class: 'flash', tabindex: '0', role: 'button', 'aria-label': 'Kartı çevir' });
    var puanlar = el('div', { class: 'puanlar', hidden: true });
    [['1', 'Tekrar', 'kotu'], ['2', 'Zor', 'uyari'], ['3', 'İyi', 'iyi'], ['4', 'Kolay', 'vurgu']].forEach(function (p) {
      puanlar.appendChild(el('button', { class: 'puan puan-' + p[2], type: 'button', onclick: function () { puanla(+p[0]); } }, [el('b', { text: p[0] }), ' ' + p[1]]));
    });
    var cevir = el('button', { class: 'dugme ana cevir-dugme', type: 'button', onclick: function () { cevirKart(); } }, ['Çevir (boşluk)']);
    alan.appendChild(kartEl); alan.appendChild(cevir); alan.appendChild(puanlar);
    alan.appendChild(el('p', { class: 'var-etiket', style: 'text-align:center', text: 'Klavye: boşluk çevirir, 1–4 puanlar.' }));
    function ciz() {
      var k = kuyruk[i];
      cevrik = false;
      kartEl.innerHTML = '';
      kartEl.appendChild(el('div', { class: 'flash-ust' }, [el('span', { class: 'etiket-kucuk' + (k.ai ? ' ai' : ''), text: KART_TUR[k.tur] + (k.ai ? ' · AI' : '') }),
        k.onem && k.onem.yildiz ? el('span', { class: 'onem', text: (k.onem.ates ? '🔥 ' : '') + '★' + k.onem.yildiz }) : null,
        el('span', { class: 'ayrac', style: 'flex:1' }),
        k.bolum != null ? el('a', { class: 'capraz', href: '#' + U.okuHash(k.kitap, k.bolum), onclick: function () { Durum.vurguBlok = k.blok; }, text: 'kitapta aç' }) : null]));
      kartEl.appendChild(el('div', { class: 'flash-on metin-kart', html: k.on }));
      var arka = el('div', { class: 'flash-arka metin-kart', hidden: true, html: k.arka });
      kartEl.appendChild(arka);
      puanlar.hidden = true; cevir.hidden = false;
      sayac.textContent = (i + 1) + ' / ' + kuyruk.length + ' · bugün ' + cozulen + ' kart';
    }
    function cevirKart() {
      if (cevrik) return;
      cevrik = true;
      $('.flash-arka', kartEl).hidden = false;
      U.atiflariBagla($('.flash-arka', kartEl), kj);
      puanlar.hidden = false; cevir.hidden = true;
      $('button', puanlar).focus();
    }
    function puanla(p) {
      if (!cevrik) return;
      var k = kuyruk[i];
      var yeni = !srs[k.id];
      srs[k.id] = sm2(srs[k.id], p);
      if (yeni) { var g = bugun(); srs._yeni = srs._yeni && srs._yeni.g === g ? { g: g, n: srs._yeni.n + 1 } : { g: g, n: 1 }; }
      U.Depo._cache['srs-' + kitapId] = srs;
      U.depoGuncelle('srs-' + kitapId, function () {}, 1500);
      U.depoGuncelle('istatistik', function (v) { var d = gunAdi(bugun()); v.gun = v.gun || {}; v.gun[d] = (v.gun[d] || 0) + 1; }, 2000);
      cozulen++;
      if (p === 1) kuyruk.push(k); // bugün tekrar gelsin
      i++;
      if (i >= kuyruk.length) { alan.innerHTML = ''; alan.appendChild(el('div', { class: 'bos' }, ['✓ Oturum bitti: ' + cozulen + ' kart. ', el('a', { href: '#calisma', text: 'Analize bak' })])); document.removeEventListener('keydown', tus); return; }
      ciz();
    }
    function tus(e) {
      if (!document.body.contains(kartEl)) { document.removeEventListener('keydown', tus); return; }
      if (/INPUT|TEXTAREA|SELECT/.test((e.target.tagName || ''))) return;
      if (e.key === ' ') { e.preventDefault(); cevirKart(); }
      else if (/^[1-4]$/.test(e.key) && cevrik) puanla(+e.key);
    }
    document.addEventListener('keydown', tus);
    kartEl.addEventListener('click', function (e) { if (!e.target.closest('a')) cevirKart(); });
    // tek elle: sağa kaydır = İyi, sola = Tekrar (çevrildikten sonra)
    var x0 = null;
    kartEl.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
    kartEl.addEventListener('touchend', function (e) { if (x0 == null) return; var dx = e.changedTouches[0].clientX - x0; x0 = null; if (!cevrik || Math.abs(dx) < 70) return; puanla(dx > 0 ? 3 : 1); });
    ciz();
  }

  /* ================= cevap kayıtları ================= */
  // sonuclar-<kitap>: { "<qid>:<i>": [dogru, yanlis, sonDogruMu(1/0), t] }
  function kaydet(kitapId, q, vi, dogru) {
    if (dogru == null) return Promise.resolve();
    return U.depoGuncelle('sonuclar-' + kitapId, function (v) {
      var k = q.id + ':' + vi, s = v[k] || [0, 0, 0, 0];
      if (dogru) s[0]++; else s[1]++;
      s[2] = dogru ? 1 : 0; s[3] = Date.now();
      v[k] = s;
    }, 1500);
  }
  U.soruCevaplandi = function (kitapId, q, vi, dogru) { kaydet(kitapId, q, vi, dogru); };

  /* ================= test ================= */
  U.GORUNUMLER.test = function () {
    var ana = $('#ana'); ana.innerHTML = '';
    var sayfa = el('div', { class: 'sayfa calis-sayfa' }); ana.appendChild(sayfa);
    sayfa.appendChild(el('div', { class: 'kahraman' }, [el('div', { class: 'ust-etiket', text: 'Çıkmış ve deneme soruları' }), el('h1', { text: 'Test' })]));
    var form = el('form', { class: 'test-form', novalidate: true });
    var alan = el('div', { class: 'test-alan' });
    sayfa.appendChild(form); sayfa.appendChild(alan);
    var ayar = U.ls('testAyar') || { kitap: Durum.kitapId || 'biyokimya', bolum: '', sinav: '', onem: '', yalnizYanlis: false, gorulmemis: false, deneme: true, sayi: 20, sureli: false, dakika: 30 };
    Kitaplik.katalog().then(function (liste) {
      if (!Kitaplik.kayit(ayar.kitap)) ayar.kitap = liste[0].id;
      var kSec = el('select', { id: 'tKitap' }, liste.map(function (k) { return el('option', { value: k.id, text: k.baslik, selected: k.id === ayar.kitap ? true : null }); }));
      var bSec = el('select', { id: 'tBolum' }), sSec = el('select', { id: 'tSinav' });
      var oSec = el('select', { id: 'tOnem' }, [['', 'Hepsi'], ['ates', '🔥 sık çıkanlar'], ['2', '★2 ve üstü'], ['3', '★3 ve üstü']].map(function (o) { return el('option', { value: o[0], text: o[1], selected: ayar.onem === o[0] ? true : null }); }));
      var sayi = el('input', { id: 'tSayi', type: 'number', min: '1', max: '300', value: String(ayar.sayi) });
      var dk = el('input', { id: 'tDakika', type: 'number', min: '1', max: '240', value: String(ayar.dakika) });
      function kutu(id, ad, deger) { var c = el('input', { id: id, type: 'checkbox', checked: deger ? true : null }); return el('label', { class: 'onay', for: id }, [c, ' ' + ad]); }
      var yy = kutu('tYanlis', 'Yalnız yanlışlarım', ayar.yalnizYanlis), gg = kutu('tGorulmemis', 'Hiç görmediklerim', ayar.gorulmemis), dd = kutu('tDeneme', 'Deneme sorularını kat', ayar.deneme), ss = kutu('tSureli', 'Süreli deneme (sonuçlar sonda)', ayar.sureli);
      var bilgi = el('p', { class: 'var-etiket', 'aria-live': 'polite' });
      form.appendChild(el('div', { class: 'test-ayar' }, [
        alanEtiket('tKitap', 'Kitap', kSec), alanEtiket('tBolum', 'Bölüm', bSec), alanEtiket('tSinav', 'Sınav', sSec), alanEtiket('tOnem', 'Önem', oSec),
        alanEtiket('tSayi', 'Soru sayısı', sayi), alanEtiket('tDakika', 'Süre (dk)', dk)]));
      form.appendChild(el('div', { class: 'yp-dugmeler' }, [yy, gg, dd, ss]));
      form.appendChild(bilgi);
      form.appendChild(el('button', { class: 'dugme ana', type: 'submit' }, ['Testi başlat']));
      var veri = null;
      function oku() {
        ayar.kitap = kSec.value; ayar.bolum = bSec.value; ayar.sinav = sSec.value; ayar.onem = oSec.value; ayar.sayi = +sayi.value || 20; ayar.dakika = +dk.value || 30;
        ayar.yalnizYanlis = $('#tYanlis').checked; ayar.gorulmemis = $('#tGorulmemis').checked; ayar.deneme = $('#tDeneme').checked; ayar.sureli = $('#tSureli').checked;
        U.ls('testAyar', ayar);
      }
      function havuz() {
        if (!veri) return [];
        var sonuc = veri.sonuc, l = [];
        veri.sorular.forEach(function (q) {
          if (!ayar.deneme && q.deneme) return;
          var bs = veri.bolumSira[q.bolum];
          if (ayar.bolum !== '' && String(bs) !== ayar.bolum) return;
          if (ayar.onem === 'ates' && !(q.onem && q.onem.ates)) return;
          if (/^\d$/.test(ayar.onem) && !(q.onem && q.onem.yildiz >= +ayar.onem)) return;
          q.varyantlar.forEach(function (v, i) {
            if (!v.siklar.length) return;
            if (ayar.sinav && v.sinav !== ayar.sinav) return;
            var s = sonuc[q.id + ':' + i];
            if (ayar.yalnizYanlis && !(s && s[2] === 0)) return;
            if (ayar.gorulmemis && s) return;
            l.push({ q: q, v: v, i: i, bs: bs });
          });
        });
        return l;
      }
      function guncelle() { oku(); var h = havuz(); bilgi.textContent = h.length + ' soru uygun · ' + h.filter(function (x) { return x.v.cevap; }).length + ' tanesi otomatik notlanır, kalanında kendini puanlarsın.'; }
      function kitapYukle() {
        oku();
        bilgi.textContent = 'Yükleniyor…';
        Promise.all([Kitaplik.ac(ayar.kitap), Kitaplik.sorular(ayar.kitap).catch(function () { return []; }), U.Depo.oku('sonuclar-' + ayar.kitap)]).then(function (r) {
          var kj = r[0];
          veri = { kj: kj, sorular: r[1], sonuc: r[2], bolumSira: {} };
          kj.bolumler.forEach(function (b) { veri.bolumSira[b.id] = b.sira; });
          bSec.innerHTML = ''; bSec.appendChild(el('option', { value: '', text: 'Tümü' }));
          kj.bolumler.forEach(function (b) { if (r[1].some(function (q) { return q.bolum === b.id; })) bSec.appendChild(el('option', { value: String(b.sira), text: b.baslik, selected: String(b.sira) === ayar.bolum ? true : null })); });
          var sinavlar = {};
          r[1].forEach(function (q) { q.varyantlar.forEach(function (v) { if (v.sinav) sinavlar[v.sinav] = (sinavlar[v.sinav] || 0) + 1; }); });
          sSec.innerHTML = ''; sSec.appendChild(el('option', { value: '', text: 'Tümü' }));
          Object.keys(sinavlar).sort().reverse().forEach(function (s) { sSec.appendChild(el('option', { value: s, text: s + ' (' + sinavlar[s] + ')', selected: s === ayar.sinav ? true : null })); });
          guncelle();
        });
      }
      kSec.addEventListener('change', function () { ayar.bolum = ''; ayar.sinav = ''; kitapYukle(); });
      [bSec, sSec, oSec, sayi].forEach(function (x) { x.addEventListener('change', guncelle); });
      form.addEventListener('change', function (e) { if (e.target.type === 'checkbox') guncelle(); });
      form.addEventListener('submit', function (e) {
        e.preventDefault(); oku();
        var h = havuz();
        if (!h.length) { toast('Bu filtrelerle soru yok.'); return; }
        for (var i = h.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = h[i]; h[i] = h[j]; h[j] = t; }
        form.hidden = true;
        testCalistir(alan, veri.kj, h.slice(0, ayar.sayi), ayar, function () { form.hidden = false; kitapYukle(); });
      });
      kitapYukle();
    });
  };
  function alanEtiket(id, ad, girdi) { return el('div', { class: 'alan-etiket' }, [el('label', { class: 'var-etiket', for: id, text: ad }), girdi]); }

  function testCalistir(alan, kj, sorular, ayar, bitince) {
    alan.innerHTML = '';
    var cevaplar = new Array(sorular.length); // {secim, dogru(true/false/null)}
    var i = 0, bitti = false, kalan = ayar.dakika * 60, saat = null;
    var ust = el('div', { class: 'test-ust' });
    var kutu = el('div', { class: 'test-kutu' });
    var alt = el('div', { class: 'test-alt' });
    alan.appendChild(ust); alan.appendChild(kutu); alan.appendChild(alt);
    var sure = el('span', { class: 'sure', 'aria-live': 'off' });
    if (ayar.sureli) {
      saat = setInterval(function () {
        if (!document.body.contains(sure)) { clearInterval(saat); return; }
        kalan--; sure.textContent = '⏱ ' + Math.floor(kalan / 60) + ':' + String(kalan % 60).padStart(2, '0');
        if (kalan <= 0) { clearInterval(saat); toast('Süre doldu.'); bitir(); }
      }, 1000);
      sure.textContent = '⏱ ' + ayar.dakika + ':00';
    }
    function ciz() {
      var s = sorular[i], c = cevaplar[i];
      ust.innerHTML = '';
      ust.appendChild(el('strong', { text: 'Soru ' + (i + 1) + ' / ' + sorular.length }));
      ust.appendChild(el('span', { class: 'var-etiket', text: [kj.bolumler[s.bs] ? kj.bolumler[s.bs].kisa : '', s.v.sinav, s.v.no ? s.v.no + '. soru' : ''].filter(Boolean).join(' · ') }));
      if (s.q.onem && s.q.onem.yildiz) ust.appendChild(el('span', { class: 'onem', text: (s.q.onem.ates ? '🔥 ' : '') + '★' + s.q.onem.yildiz }));
      ust.appendChild(el('span', { style: 'flex:1' })); ust.appendChild(sure);
      kutu.innerHTML = '';
      kutu.appendChild(el('div', { class: 'metin-kart', html: '<p>' + s.v.govde + '</p>' }));
      var sl = el('div', { class: 'siklar' });
      s.v.siklar.forEach(function (o) {
        var b = el('button', { class: 'sik', type: 'button' }, [el('span', { class: 'harf', text: o.h + ')' }), el('span', { html: o.m })]);
        if (c && c.secim === o.h.toUpperCase()) b.classList.add('secildi');
        var gosterCevap = c && (!ayar.sureli || bitti);
        if (gosterCevap) {
          b.disabled = true;
          if (s.v.cevap && o.h.toUpperCase() === s.v.cevap) b.classList.add('dogru');
          if (c.secim === o.h.toUpperCase() && s.v.cevap && c.secim !== s.v.cevap) b.classList.add('yanlis');
        }
        b.addEventListener('click', function () { sec(o.h.toUpperCase()); });
        sl.appendChild(b);
      });
      // "Bilmiyorum": tahmin yerine dürüst eksik işareti → yanlış sayılır, eksikler listesine yazılır (Carvis ve plan bunu kullanır)
      var bil = el('button', { class: 'sik bilmiyorum', type: 'button' }, [el('span', { class: 'harf', text: '🤷' }), el('span', { text: 'Bilmiyorum' })]);
      if (c && c.secim === '?') bil.classList.add('secildi');
      if (c && (!ayar.sureli || bitti)) bil.disabled = true;
      bil.addEventListener('click', function () { sec('?'); });
      sl.appendChild(bil);
      kutu.appendChild(sl);
      if (c && (!ayar.sureli || bitti)) aciklama(s, c);
      alt.innerHTML = '';
      alt.appendChild(el('button', { class: 'dugme', type: 'button', disabled: i === 0 ? true : null, onclick: function () { i--; ciz(); } }, ['← Önceki']));
      alt.appendChild(el('button', { class: 'dugme', type: 'button', onclick: function () { if (i < sorular.length - 1) { i++; ciz(); } else bitir(); } }, [i < sorular.length - 1 ? 'Sonraki →' : 'Bitir']));
      if (!bitti) alt.appendChild(el('button', { class: 'dugme kucuk', type: 'button', onclick: bitir }, ['Testi bitir']));
      else alt.appendChild(el('button', { class: 'dugme kucuk', type: 'button', onclick: sonucCiz }, ['Sonuçlara dön']));
    }
    function sec(h) {
      var s = sorular[i];
      if (cevaplar[i] && (!ayar.sureli || bitti)) return;
      var dogru = h === '?' ? false : s.v.cevap ? h === s.v.cevap : null;
      cevaplar[i] = { secim: h, dogru: dogru, bilmiyor: h === '?' };
      if (!ayar.sureli) kaydet(kj.id, s.q, s.i, dogru);
      if (dogru === false && U.eksikEkle) U.eksikEkle({ kitap: kj.id, bolum: kj.bolumler[s.bs] ? kj.bolumler[s.bs].kisa || kj.bolumler[s.bs].baslik : '', sira: kj.bolumler[s.bs] && kj.bolumler[s.bs].sira != null ? kj.bolumler[s.bs].sira : s.bs, konu: s.q.konu || '', soru: U.duz ? U.duz(s.v.govde).slice(0, 160) : '', bilmiyor: h === '?', kaynak: 'test' });
      ciz();
    }
    function aciklama(s, c) {
      var kap = el('div', { class: 'cevap-bolumu' });
      if (!s.v.cevap) {
        kap.appendChild(el('p', { class: 'var-etiket', text: 'Bu soruda tek resmî cevap harfi yok. Açıklamayı oku ve kendini puanla:' }));
        var d = el('div', { class: 'yp-dugmeler' }, [
          el('button', { class: 'dugme kucuk', type: 'button', onclick: function () { c.dogru = true; kaydet(kj.id, s.q, s.i, true); ciz(); } }, ['✓ Doğru bildim']),
          el('button', { class: 'dugme kucuk', type: 'button', onclick: function () { c.dogru = false; kaydet(kj.id, s.q, s.i, false); ciz(); } }, ['✗ Yanlış'])]);
        if (c.dogru == null) kap.appendChild(d); else kap.appendChild(el('p', { class: 'var-etiket', text: 'Kendi puanın: ' + (c.dogru ? 'doğru' : 'yanlış') }));
      } else kap.appendChild(el('p', { html: c.dogru ? '<strong style="color:var(--iyi)">✓ Doğru</strong>' : '<strong style="color:var(--kotu)">✗ Yanlış</strong> · doğru cevap <b>' + s.v.cevap + '</b>' }));
      if (s.v.cevapNotu) kap.appendChild(el('p', { class: 'var-etiket', text: s.v.cevapNotu }));
      kap.appendChild(el('div', { class: 'metin-kart', html: s.q.cevapHtml || '' }));
      U.atiflariBagla(kap, kj);
      if (c.dogru === false && U.AI) {
        var aiKutu = el('div');
        kap.appendChild(el('button', { class: 'dugme kucuk ai-gerek', type: 'button', onclick: function () {
          U.cevapCalistir(aiKutu, fnv(kj.id + '|nedenyanlis|' + s.q.id + ':' + s.i + '|' + c.secim), function () {
            return 'Tıp öğrencisi bir çoktan seçmeli soruda yanlış şıkkı seçti. Seçtiği şıkkın NEDEN yanlış olduğunu ve doğru cevabın mantığını kısa anlat. Kitaptaki açıklamayı temel al.\nKurallar: Türkçe, en fazla 150 kelime. "**Kitaptan:**" ve "**Genel bilgi:**" bölümleri.\n\nSORU: ' + duz(s.v.govde) + '\nŞIKLAR:\n' +
              s.v.siklar.map(function (o) { return o.h + ') ' + duz(o.m); }).join('\n') + '\nÖĞRENCİNİN SEÇİMİ: ' + c.secim + '\nDOĞRU CEVAP: ' + (s.v.cevap || 'kitapta tek harf yok') + '\nKİTAPTAKİ AÇIKLAMA:\n"""' + duz(s.q.cevapHtml).slice(0, 4000) + '"""';
          }, { kj: kj, eylem: 'nedenyanlis' });
        } }, ['✦ AI: neden yanlış?']));
        kap.appendChild(aiKutu);
      }
      kutu.appendChild(kap);
    }
    function bitir() {
      if (saat) clearInterval(saat);
      if (!bitti && ayar.sureli) cevaplar.forEach(function (c, j) { if (c) kaydet(kj.id, sorular[j].q, sorular[j].i, c.dogru); });
      bitti = true;
      var ozet = { t: Date.now(), kitap: kj.id, n: sorular.length, dogru: cevaplar.filter(function (c) { return c && c.dogru === true; }).length,
        yanlis: cevaplar.filter(function (c) { return c && c.dogru === false; }).length, bos: cevaplar.filter(function (c) { return !c; }).length, sureli: !!ayar.sureli };
      U.depoGuncelle('testler', function (v) { v.liste = v.liste || []; v.liste.push(ozet); if (v.liste.length > 50) v.liste.shift(); }, 300);
      sonucCiz();
    }
    function sonucCiz() {
      ust.innerHTML = ''; alt.innerHTML = ''; kutu.innerHTML = '';
      var d = 0, y = 0, b = 0, puanli = 0;
      var bolum = {};
      sorular.forEach(function (s, j) {
        var c = cevaplar[j];
        var k = bolum[s.bs] || (bolum[s.bs] = { d: 0, n: 0 });
        if (!c) { b++; return; }
        if (c.dogru === true) { d++; k.d++; k.n++; } else if (c.dogru === false) { y++; k.n++; }
      });
      puanli = d + y;
      kutu.appendChild(el('div', { class: 'skor' }, [
        el('div', { class: 'skor-halka', style: '--p:' + (puanli ? Math.round(100 * d / puanli) : 0) }, [el('b', { text: '%' + (puanli ? Math.round(100 * d / puanli) : 0) })]),
        el('div', null, [el('h2', { text: d + ' doğru · ' + y + ' yanlış · ' + b + ' boş' }), el('p', { class: 'var-etiket', text: 'Kendini puanladığın sorular dahil. Yanlışlar Yanlış defterine yazıldı.' })])]));
      // bölüm ısı haritası
      kutu.appendChild(el('h3', { text: 'Bölüm bazlı başarı' }));
      kutu.appendChild(isiHaritasi(kj, bolum));
      // yanlış listesi
      var yl = el('div', { class: 'yanlis-liste' });
      sorular.forEach(function (s, j) {
        var c = cevaplar[j]; if (!c || c.dogru !== false) return;
        yl.appendChild(el('button', { class: 'kk-satir', type: 'button', onclick: function () { i = j; ciz(); } }, [el('span', { text: (j + 1) + '. ' + duz(s.v.govde).slice(0, 110) }), el('span', { class: 'var-etiket', text: c.secim + ' → ' + (s.v.cevap || '?') })]));
      });
      if (yl.children.length) { kutu.appendChild(el('h3', { text: 'Yanlışların' })); kutu.appendChild(yl); }
      alt.appendChild(el('button', { class: 'dugme ana', type: 'button', onclick: bitince }, ['Yeni test']));
      alt.appendChild(el('a', { class: 'dugme', href: '#calisma' }, ['Analiz ve yanlış defteri']));
    }
    ciz();
  }
  function isiHaritasi(kj, bolum) {
    var kap = el('div', { class: 'isi', role: 'table', 'aria-label': 'Bölüm başarı ısı haritası' });
    Object.keys(bolum).sort(function (a, b) { return a - b; }).forEach(function (bs) {
      var k = bolum[bs]; if (!k.n) return;
      var o = k.d / k.n;
      var renk = o >= .8 ? 'var(--iyi)' : o >= .5 ? 'var(--uyari)' : 'var(--kotu)';
      kap.appendChild(el('div', { class: 'isi-hucre', role: 'row', style: '--r:' + renk + ';--o:' + (0.25 + o * 0.55) }, [
        el('span', { role: 'cell', text: kj.bolumler[bs] ? (kj.bolumler[bs].no != null ? 'B' + kj.bolumler[bs].no + ' ' : '') + kj.bolumler[bs].kisa : '?' }),
        el('b', { role: 'cell', text: '%' + Math.round(o * 100) + ' (' + k.d + '/' + k.n + ')' })]));
    });
    if (!kap.children.length) kap.appendChild(el('p', { class: 'var-etiket', text: 'Puanlanmış soru yok.' }));
    return kap;
  }

  /* ================= analiz: yanlış defteri, zayıf konular, öncelik ================= */
  U.GORUNUMLER.calisma = function () {
    var ana = $('#ana'); ana.innerHTML = '';
    var sayfa = el('div', { class: 'sayfa calis-sayfa' }); ana.appendChild(sayfa);
    sayfa.appendChild(el('div', { class: 'kahraman' }, [el('div', { class: 'ust-etiket', text: 'Ne çalışmalıyım?' }), el('h1', { text: 'Analiz' })]));
    var sec = el('select', { id: 'aKitap', 'aria-label': 'Kitap' });
    var seri = el('div', { class: 'seri' });
    sayfa.appendChild(el('div', { class: 'filtre-ic' }, [el('label', { class: 'var-etiket', for: 'aKitap', text: 'Kitap' }), sec, seri]));
    var izgara = el('div', { class: 'analiz-izgara' });
    sayfa.appendChild(izgara);
    serisiCiz(seri);
    Kitaplik.katalog().then(function (liste) {
      var secili = U.ls('analizKitap') || Durum.kitapId || liste[0].id;
      if (!Kitaplik.kayit(secili)) secili = liste[0].id;
      liste.forEach(function (k) { sec.appendChild(el('option', { value: k.id, text: k.baslik, selected: k.id === secili ? true : null })); });
      sec.addEventListener('change', function () { U.ls('analizKitap', sec.value); ciz(sec.value); });
      ciz(secili);
    });
    function ciz(kitapId) {
      izgara.innerHTML = '';
      var yd = panelKutu('Yanlış defteri'), zk = panelKutu('Zayıf konular'), on = panelKutu('Çalışma öncelik haritası');
      izgara.appendChild(yd.k); izgara.appendChild(zk.k); izgara.appendChild(on.k);
      Promise.all([Kitaplik.ac(kitapId), Kitaplik.sorular(kitapId).catch(function () { return []; }), U.Depo.oku('sonuclar-' + kitapId)]).then(function (r) {
        var kj = r[0], sorular = r[1], sonuc = r[2];
        var qHarita = {}; sorular.forEach(function (q) { qHarita[q.id] = q; });
        var bolumSira = {}; kj.bolumler.forEach(function (b) { bolumSira[b.id] = b.sira; });
        // yanlış defteri
        var yanlislar = Object.keys(sonuc).filter(function (k) { return sonuc[k][2] === 0; }).map(function (k) {
          var p = k.lastIndexOf(':'), q = qHarita[k.slice(0, p)]; return q ? { q: q, i: +k.slice(p + 1), s: sonuc[k] } : null;
        }).filter(Boolean).sort(function (a, b) { return b.s[3] - a.s[3]; });
        if (!yanlislar.length) yd.ic.appendChild(el('p', { class: 'var-etiket', text: 'Yanlışın yok ya da henüz soru çözmedin. Okuyucudaki ve testteki cevaplar buraya yazılır.' }));
        else {
          yd.ic.appendChild(el('a', { class: 'dugme kucuk ana', href: '#test', onclick: function () { var a = U.ls('testAyar') || {}; a.kitap = kitapId; a.yalnizYanlis = true; a.gorulmemis = false; a.bolum = ''; a.sinav = ''; a.onem = ''; U.ls('testAyar', a); } }, ['Yanlışlarımı yeniden çöz (' + yanlislar.length + ')']));
          yanlislar.slice(0, 40).forEach(function (y) {
            var v = y.q.varyantlar[y.i];
            yd.ic.appendChild(el('a', { class: 'kk-satir', href: '#' + U.okuHash(kitapId, bolumSira[y.q.bolum]), onclick: function () { Durum.vurguBlok = y.q.blok; } },
              [el('span', { text: duz(v.govde).slice(0, 100) || y.q.baslik }), el('span', { class: 'var-etiket', text: y.s[1] + '× yanlış' })]));
          });
        }
        // zayıf konular (kural tabanlı) + AI önerisi
        var bolumHata = {}, konuHata = {};
        Object.keys(sonuc).forEach(function (k) {
          var p = k.lastIndexOf(':'), q = qHarita[k.slice(0, p)]; if (!q) return;
          var s = sonuc[k], bs = bolumSira[q.bolum];
          var o = bolumHata[bs] || (bolumHata[bs] = { d: 0, n: 0 }); o.d += s[0]; o.n += s[0] + s[1];
          if (s[1] > 0) { var kn = q.konu || q.baslik; var ko = konuHata[kn] || (konuHata[kn] = { n: 0, q: q }); ko.n += s[1]; }
        });
        var zayif = Object.keys(konuHata).sort(function (a, b) { return konuHata[b].n - konuHata[a].n; }).slice(0, 10);
        if (!zayif.length) zk.ic.appendChild(el('p', { class: 'var-etiket', text: 'Henüz yanlış yok.' }));
        else {
          zk.ic.appendChild(isiHaritasi(kj, bolumHata));
          zk.ic.appendChild(el('h4', { text: 'En çok yanlış yaptığın konular' }));
          zayif.forEach(function (kn) {
            var q = konuHata[kn].q;
            zk.ic.appendChild(el('a', { class: 'kk-satir', href: '#' + U.okuHash(kitapId, bolumSira[q.bolum]), onclick: function () { Durum.vurguBlok = q.blok; } }, [el('span', { text: kn.replace(/^📝\s*(Çıkmış soru —\s*)?/, '') }), el('span', { class: 'var-etiket', text: konuHata[kn].n + ' yanlış' })]));
          });
          var aiKutu = el('div');
          zk.ic.appendChild(el('button', { class: 'dugme kucuk ai-gerek', type: 'button', onclick: function () {
            var liste = zayif.map(function (kn) { var q = konuHata[kn].q; var b = kj.bolumler[bolumSira[q.bolum]]; return '- ' + kn + ' (' + konuHata[kn].n + ' yanlış) → [kaynak:' + kitapId + '|' + b.sira + '|' + q.blok + '|' + (b.no != null ? 'Bölüm ' + b.no : b.kisa) + ']'; }).join('\n');
            U.cevapCalistir(aiKutu, fnv(kitapId + '|zayif|' + liste), function () {
              return 'Bir tıp öğrencisinin ' + kj.baslik + ' sorularında en çok yanlış yaptığı konular aşağıda. Ortak kavramsal zayıflıkları bul ve "Şunlara tekrar bak" diye 3-6 maddelik kısa, somut bir çalışma planı yaz. Her maddede ilgili kaynak jetonunu ([kaynak:...]) aynen kopyala. Türkçe, en fazla 160 kelime.\n\n' + liste;
            }, { kj: kj, eylem: 'zayif' });
          } }, ['✦ AI: şunlara tekrar bak']));
          zk.ic.appendChild(aiKutu);
        }
        // öncelik haritası
        var bolPuan = {};
        sorular.forEach(function (q) {
          if (q.deneme) return;
          var bs = bolumSira[q.bolum], o = bolPuan[bs] || (bolPuan[bs] = { aile: 0, puan: 0, ates: 0, aileler: [] });
          o.aile++; o.puan += Math.max(1, q.onem.yildiz || q.varyantlar.length); if (q.onem.ates) o.ates++; o.aileler.push(q);
        });
        var sirali = Object.keys(bolPuan).sort(function (a, b) { return bolPuan[b].puan - bolPuan[a].puan; });
        var mx = sirali.length ? bolPuan[sirali[0]].puan : 1;
        if (!sirali.length) on.ic.appendChild(el('p', { class: 'var-etiket', text: 'Bu kitapta çıkmış soru yok.' }));
        on.ic.appendChild(el('p', { class: 'var-etiket', text: 'Puan = her soru ailesi için ★N (kaç sınavda çıktığı; yoksa varyant sayısı). 🔥 sık çıkan aile sayısı.' }));
        sirali.forEach(function (bs, n) {
          var o = bolPuan[bs], b = kj.bolumler[bs];
          var satir = el('details', { class: 'oncelik-satir', open: n < 2 ? true : null }, [el('summary', null, [
            el('span', { class: 'oncelik-ad', text: (n + 1) + '. ' + b.baslik }),
            el('span', { class: 'cubuk', style: '--k:var(--vurgu)' }, [el('i', { style: 'width:' + Math.round(100 * o.puan / mx) + '%' })]),
            el('span', { class: 'var-etiket', text: o.puan + ' puan · ' + o.aile + ' aile' + (o.ates ? ' · 🔥' + o.ates : '') })])]);
          o.aileler.sort(function (a, c) { return (c.onem.yildiz || 0) - (a.onem.yildiz || 0) || (c.onem.ates ? 1 : 0) - (a.onem.ates ? 1 : 0); }).slice(0, 8).forEach(function (q) {
            satir.appendChild(el('a', { class: 'kk-satir', href: '#' + U.okuHash(kitapId, +bs), onclick: function () { Durum.vurguBlok = q.blok; } }, [el('span', { text: (q.konu || q.baslik).replace(/^📝\s*/, '') }), el('span', { class: 'onem', text: (q.onem.ates ? '🔥 ' : '') + (q.onem.yildiz ? '★' + q.onem.yildiz : '') })]));
          });
          on.ic.appendChild(satir);
        });
        var kendi = kj.bolumler.filter(function (b) { return b.ozel === 'oncelik'; })[0];
        if (kendi) {
          var kk = el('details', { class: 'oncelik-satir kitabin' }, [el('summary', null, [el('span', { class: 'oncelik-ad', text: '📌 Kitabın kendi öncelik haritası' })])]);
          on.ic.prepend(kk);
          kk.addEventListener('toggle', function () {
            if (!kk.open || kk.dataset.yuklu) return; kk.dataset.yuklu = '1';
            Kitaplik.bolumAc(kitapId, kendi.sira).then(function (bol) { var m = el('div', { class: 'metin' }); bol.altlar.forEach(function (a) { if (a.baslik) m.appendChild(el('h3', { text: a.baslik })); a.bloklar.forEach(function (x) { m.appendChild(U.blokCiz(x, kj, {})); }); }); kk.appendChild(m); U.atiflariBagla(m, kj); });
          });
        }
      });
    }
  };
  function panelKutu(baslik) { var ic = el('div', { class: 'kk-ic' }); return { k: el('section', { class: 'analiz-kutu' }, [el('h2', { text: baslik }), ic]), ic: ic }; }
  function serisiCiz(kap) {
    U.Depo.oku('istatistik').then(function (v) {
      var g = v.gun || {}, n = 0, d = bugun();
      if (!g[gunAdi(d)]) d--; // bugün henüz çalışılmadıysa dünden say
      while (g[gunAdi(d)]) { n++; d--; }
      kap.innerHTML = '';
      kap.appendChild(el('span', { class: 'etiket-kucuk', text: '🔥 Seri: ' + n + ' gün · bugün ' + (g[gunAdi(bugun())] || 0) + ' kart' }));
    });
  }

  /* ================= kütüphanede "bugünkü tekrar" ================= */
  var eskiKutup = U.GORUNUMLER.kutuphane;
  U.GORUNUMLER.kutuphane = function () {
    eskiKutup();
    var hizli = $('.hizli');
    if (!hizli) return;
    var b = el('a', { class: 'dugme', href: '#kartlar' }, ['❖ Bugünkü tekrar']);
    var t = el('a', { class: 'dugme', href: '#test' }, ['◎ Test çöz']);
    var a = el('a', { class: 'dugme', href: '#calisma' }, ['◭ Ne çalışmalıyım?']);
    hizli.appendChild(b); hizli.appendChild(t); hizli.appendChild(a);
    var s = el('span', { class: 'seri', style: 'align-self:center' }); hizli.appendChild(s); serisiCiz(s);
    Kitaplik.katalog().then(function (l) {
      return Promise.all(l.map(function (k) { return U.Depo.oku('srs-' + k.id).then(function (v) { var g = bugun(), n = 0; Object.keys(v).forEach(function (x) { if (x[0] !== '_' && v[x][3] <= g) n++; }); return n; }); }));
    }).then(function (ns) { var n = ns.reduce(function (a, b) { return a + b; }, 0); b.textContent = '❖ Bugünkü tekrar' + (n ? ' · ' + n + ' vadeli kart' : ''); });
  };

  U.sekmeleriCiz();
})();
