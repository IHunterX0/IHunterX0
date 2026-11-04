/* 1001 — Aşama 4: Notlarım, yedek (indir/yükle), AI ile toplu kart önerisi (onaylı) */
(function () {
  'use strict';
  var U = window.Uygulama;
  var el = U.el, $ = U.$, $$ = U.$$, esc = U.esc, duz = U.duz, toast = U.toast, Y = U.Y, Kitaplik = U.Kitaplik, Durum = U.Durum;

  U.SEKMELER.push({ id: 'notlar', ad: 'Notlarım', ikon: '✎' });

  /* ================= Notlarım ================= */
  var RENK = { sari: '#ffd65a', yesil: '#6ee7a8', mavi: '#6cc7ff', pembe: '#ff8fc7' };
  U.GORUNUMLER.notlar = function () {
    var ana = $('#ana'); ana.innerHTML = '';
    var sayfa = el('div', { class: 'sayfa calis-sayfa' }); ana.appendChild(sayfa);
    sayfa.appendChild(el('div', { class: 'kahraman' }, [el('div', { class: 'ust-etiket', text: 'Vurgular, notlar, kendi kartların' }), el('h1', { text: 'Notlarım' }),
      el('p', { text: 'Okurken cümleye dokunup "Not / vurgu" ile ya da metin seçip "Not" ile eklenir.' })]));
    var arac = el('div', { class: 'filtre-ic' });
    var ara = el('input', { id: 'notAra', type: 'search', placeholder: 'Notlarda ara…', 'aria-label': 'Notlarda ara', class: 'arama-girdi' });
    var kSec = el('select', { id: 'notKitap', 'aria-label': 'Kitap' }, [el('option', { value: '', text: 'Tüm kitaplar' })]);
    arac.appendChild(ara); arac.appendChild(kSec);
    var liste = el('div', { class: 'not-liste' });
    var kartBolum = el('section', { class: 'analiz-kutu', style: 'margin-top:20px' });
    var yedek = el('section', { class: 'analiz-kutu', style: 'margin-top:20px' });
    sayfa.appendChild(arac); sayfa.appendChild(liste); sayfa.appendChild(kartBolum); sayfa.appendChild(yedek);
    Kitaplik.katalog().then(function (l) { l.forEach(function (k) { kSec.appendChild(el('option', { value: k.id, text: k.baslik })); }); });
    function ciz() {
      Promise.all([U.Depo.oku('notlar'), Kitaplik.katalog()]).then(function (r) {
        var notlar = (r[0].liste || []).slice().reverse(), q = A_katla(ara.value);
        liste.innerHTML = '';
        var g = notlar.filter(function (n) { return (!kSec.value || n.kitap === kSec.value) && (!q || A_katla(n.metin + ' ' + (n.not || '')).indexOf(q) >= 0); });
        if (!g.length) { liste.appendChild(el('div', { class: 'bos', text: notlar.length ? 'Bu filtrede not yok.' : 'Henüz not yok.' })); return; }
        g.forEach(function (n) {
          var k = Kitaplik.kayit(n.kitap);
          var sat = el('article', { class: 'not-kart', style: '--c:' + (RENK[n.renk] || RENK.sari) }, [
            el('div', { class: 'var-etiket', text: (k ? k.baslik : n.kitap) + ' · ' + new Date(n.t).toLocaleDateString('tr-TR') }),
            el('p', { class: 'alinti', text: '“' + n.metin + '”' }),
            n.not ? el('p', { text: n.not }) : null,
            el('div', { class: 'yp-dugmeler' }, [
              el('a', { class: 'cip', href: '#' + U.okuHash(n.kitap, n.bolum || 0), onclick: function () { Durum.vurguBlok = n.blok; } }, ['Kitapta aç']),
              el('button', { class: 'cip', type: 'button', onclick: function () {
                U.kartEkle({ on: n.not ? n.not : n.metin.slice(0, 140) + (n.metin.length > 140 ? '…' : ''), arka: n.metin, kitap: n.kitap, bolum: n.bolum, blok: n.blok, kaynak: n.metin, ai: false })
                  .then(function () { toast('Karta çevrildi. Kartlar ekranında "Benim kartım" olarak çıkar.'); });
              } }, ['Karta çevir']),
              silDugmesi(function () { return U.depoGuncelle('notlar', function (v) { v.liste = (v.liste || []).filter(function (x) { return x.id !== n.id; }); }, 200).then(ciz); })
            ])]);
          liste.appendChild(sat);
        });
      });
    }
    function A_katla(s) { return window.KitapAyristir.katla(s || ''); }
    ara.addEventListener('input', U.geciktir(ciz, 200));
    kSec.addEventListener('change', ciz);
    ciz();
    // kendi kartlarım
    kartBolum.appendChild(el('h2', { text: 'Kendi kartlarım' }));
    var kl = el('div', { class: 'kk-ic' }); kartBolum.appendChild(kl);
    function kartlariCiz() {
      U.Depo.oku('kartlarim').then(function (v) {
        kl.innerHTML = '';
        var l = (v.liste || []).slice().reverse();
        if (!l.length) kl.appendChild(el('p', { class: 'var-etiket', text: 'Henüz kendi kartın yok. Cümle panelinden "Kart yap" ya da Kartlar ekranından "AI ile kart öner".' }));
        l.forEach(function (k) {
          kl.appendChild(el('div', { class: 'kk-satir' }, [el('span', null, [k.ai ? el('span', { class: 'etiket-kucuk ai', text: 'AI' }) : null, ' ' + k.on]),
            silDugmesi(function () { return U.depoGuncelle('kartlarim', function (x) { x.liste = (x.liste || []).filter(function (y) { return y.id !== k.id; }); }, 200).then(kartlariCiz); })]));
        });
      });
    }
    kartlariCiz();
    yedekCiz(yedek);
  };
  function silDugmesi(fn) {
    var b = el('button', { class: 'cip', type: 'button' }, ['Sil']);
    b.addEventListener('click', function () {
      if (b.dataset.onay !== '1') { b.dataset.onay = '1'; b.textContent = 'Emin misin?'; b.classList.add('tehlike'); setTimeout(function () { b.dataset.onay = ''; b.textContent = 'Sil'; b.classList.remove('tehlike'); }, 4000); return; }
      b.disabled = true; fn();
    });
    return b;
  }

  /* ================= yedek ================= */
  var YEDEK_BELGELER = ['ilerleme', 'notlar', 'kartlarim', 'istatistik', 'testler', 'sohbetler', 'plan', 'sure', 'pomodoro', 'eksikler', 'seviye', 'saraylar', 'carvisProfil', 'defter', 'haftalikRapor', 'ekran', 'oneriler', 'saglik', 'janeOto', 'janeKalibrasyon', 'reels', 'makale', 'pusula', 'dersProgram', 'anaEkran'];
  function yedekBelgeleri() {
    return Kitaplik.katalog().then(function (l) {
      var adlar = YEDEK_BELGELER.slice();
      l.forEach(function (k) { adlar.push('srs-' + k.id, 'sonuclar-' + k.id); });
      return U.Depo.oku('sohbetler').then(function (s) { (s.liste || []).forEach(function (x) { adlar.push('sohbet-' + x.id); }); return adlar; });
    });
  }
  // Yedek verisi (indirme düğmesi ve haftalık otomatik yedek ortak kullanır)
  function yedekVeri() {
    return yedekBelgeleri().then(function (adlar) {
      return Promise.all(adlar.map(function (a) { return U.Depo.oku(a).then(function (v) { return [a, v]; }); }));
    }).then(function (ciftler) {
      var veri = { sema: '1001-yedek/1', tarih: new Date().toISOString(), belgeler: {} };
      ciftler.forEach(function (c) { if (c[1] && Object.keys(c[1]).length) veri.belgeler[c[0]] = c[1]; });
      return veri;
    });
  }
  U.yedekVeri = yedekVeri;
  function yedekCiz(kap) {
    kap.innerHTML = '';
    kap.appendChild(el('h2', { text: 'Yedek' }));
    kap.appendChild(el('p', { class: 'var-etiket', text: 'İlerleme, notlar, vurgular, kendi kartların, kart tekrar durumları, test sonuçları ve sohbet geçmişi tek bir JSON dosyasına yazılır. Kitapların kendisi yedeğe girmez.' }));
    var durum = el('p', { class: 'var-etiket', 'aria-live': 'polite' });
    var indir = el('button', { class: 'dugme', type: 'button' }, ['⇩ Yedeği indir']);
    var yukleGirdi = el('input', { id: 'yedekSec', type: 'file', accept: '.json,application/json', class: 'gizli-erisim' });
    var yukle = el('label', { class: 'dugme', for: 'yedekSec' }, ['⇧ Yedekten geri yükle']);
    kap.appendChild(el('div', { class: 'yp-dugmeler' }, [indir, yukle, yukleGirdi]));
    kap.appendChild(durum);
    U.yetenekSozu.then(function () { if (!Y.downloads) { indir.disabled = true; durum.textContent = 'Bu görünümde dosya indirme yok; sayfayı claude.ai içinde aç.'; } });
    indir.addEventListener('click', function () {
      indir.disabled = true; durum.textContent = 'Hazırlanıyor…';
      yedekBelgeleri().then(function (adlar) {
        return Promise.all(adlar.map(function (a) { return U.Depo.oku(a).then(function (v) { return [a, v]; }); }));
      }).then(function (ciftler) {
        var veri = { sema: '1001-yedek/1', tarih: new Date().toISOString(), belgeler: {} };
        ciftler.forEach(function (c) { if (c[1] && Object.keys(c[1]).length) veri.belgeler[c[0]] = c[1]; });
        return Y.downloads.save({ filename: '1001-yedek-' + new Date().toISOString().slice(0, 10) + '.json', data: new Blob([JSON.stringify(veri, null, 1)], { type: 'application/json' }) })
          .then(function () { durum.textContent = 'Yedek indirildi (' + Object.keys(veri.belgeler).length + ' belge).'; });
      }).catch(function (e) { durum.textContent = e && e.code === 'declined' ? 'İndirme iptal edildi.' : 'İndirilemedi: ' + ((e && (e.message || e.code)) || e); })
        .then(function () { indir.disabled = false; });
    });
    yukleGirdi.addEventListener('change', function () {
      var f = yukleGirdi.files[0]; yukleGirdi.value = '';
      if (!f) return;
      f.text().then(function (t) {
        var v = JSON.parse(t);
        if (v.sema !== '1001-yedek/1' || !v.belgeler) throw new Error('Bu bir 1001 yedeği değil.');
        // Yedeklenen her belge geri yüklenir (önceden plan, saraylar, eksikler, defter, Carvis profili vb. yedekleniyor ama geri yüklenmiyordu)
        var adlar = Object.keys(v.belgeler).filter(function (a) { return YEDEK_BELGELER.indexOf(a) >= 0 || /^(srs-[a-z0-9-]+|sonuclar-[a-z0-9-]+|sohbet-[a-z0-9]+)$/.test(a); });
        durum.innerHTML = '';
        durum.appendChild(document.createTextNode(adlar.length + ' belge bulundu (' + new Date(v.tarih).toLocaleString('tr-TR') + '). Şu anki verilerin bunlarla DEĞİŞTİRİLECEK. '));
        var onay = el('button', { class: 'dugme kucuk tehlike', type: 'button' }, ['Evet, geri yükle']);
        onay.addEventListener('click', function () {
          onay.disabled = true;
          var i = 0;
          (function sonraki() {
            if (i >= adlar.length) { durum.textContent = 'Geri yüklendi: ' + adlar.length + ' belge.'; return; }
            var a = adlar[i++];
            U.Depo._cache[a] = v.belgeler[a];
            U.Depo.yaz(a, v.belgeler[a]).then(sonraki);
          })();
        });
        durum.appendChild(onay);
      }).catch(function (e) { durum.textContent = 'Okunamadı: ' + e.message; });
    });
  }
  U.yedekCiz = yedekCiz;

  /* ================= AI ile kart önerisi (bölümden) ================= */
  var eskiKart = U.GORUNUMLER.kartlar;
  U.GORUNUMLER.kartlar = function () {
    eskiKart();
    var filtre = $('.filtre-satir');
    if (!filtre) return;
    var kutu = el('div');
    var dug = el('button', { class: 'dugme kucuk ai-gerek', type: 'button' }, ['✦ AI ile bu bölümden kart öner']);
    dug.addEventListener('click', function () {
      var kitap = $('#kartKitap') && $('#kartKitap').value, bolum = $('#kartBolum') && $('#kartBolum').value;
      if (!kitap || bolum === '') { toast('Önce bir bölüm seç.'); return; }
      aiKartOner(kitap, +bolum, kutu);
    });
    filtre.appendChild(el('div', { class: 'yp-dugmeler' }, [dug]));
    filtre.appendChild(kutu);
  };
  function aiKartOner(kitapId, sira, kutu) {
    kutu.innerHTML = '';
    kutu.appendChild(el('div', { class: 'yukleniyor', text: 'Yapay zekâ bölümü okuyup kart öneriyor…' }));
    Promise.all([Kitaplik.ac(kitapId), Kitaplik.bolumAc(kitapId, sira), U.AI.hazir()]).then(function (r) {
      var kj = r[0], bol = r[1];
      if (!r[2]) throw { code: 'not_granted' };
      var metin = '';
      bol.altlar.forEach(function (a) {
        if (metin.length > 14000) return;
        metin += '\n## ' + (a.baslik || '') + '\n';
        (function g(l) { l.forEach(function (x) { if (metin.length > 14000) return; if (x.html) metin += duz(x.html) + '\n'; else if (x.ogeler) metin += x.ogeler.map(duz).join('\n') + '\n'; if (x.bloklar) g(x.bloklar); }); })(a.bloklar);
      });
      return Y.sample.json('Aşağıdaki tıp çalışma kitabı bölümünden 8 flashcard üret. YALNIZ metindeki bilgiyi kullan, uydurma. Her kartın "kaynak" alanı metinden BİREBİR kopyalanmış kısa bir alıntı (en çok 200 karakter) olsun. Türkçe. Yalnız şu JSON dizisini döndür: [{"on":"soru","arka":"cevap","kaynak":"alıntı"}]\n\nKİTAP: ' + kj.baslik + '\nBÖLÜM: ' + bol.baslik + '\n"""' + metin + '"""', { cache: false })
        .then(function (dizi) { return { kj: kj, bol: bol, dizi: dizi, metin: metin }; });
    }).then(function (o) {
      kutu.innerHTML = '';
      var dz = Array.isArray(o.dizi) ? o.dizi : (o.dizi && o.dizi.kartlar) || [];
      var norm = function (s) { return window.KitapAyristir.katla(String(s || '')).replace(/\s+/g, ' ').trim(); };
      var nm = norm(o.metin);
      kutu.appendChild(el('p', { class: 'var-etiket', text: dz.length + ' öneri. Onayladıkların "AI" rozetiyle kartlarına eklenir. Alıntısı kitapta birebir bulunamayanlar işaretlidir.' }));
      dz.forEach(function (k) {
        var dogrulandi = k.kaynak && nm.indexOf(norm(k.kaynak).slice(0, 60)) >= 0;
        var sat = el('div', { class: 'not-kart', style: '--c:' + (dogrulandi ? 'var(--iyi)' : 'var(--uyari)') }, [
          el('p', null, [el('strong', { text: 'Ön: ' }), String(k.on || '')]), el('p', null, [el('strong', { text: 'Arka: ' }), String(k.arka || '')]),
          el('p', { class: 'alinti', text: (dogrulandi ? '✓ Kitapta bulundu: ' : '⚠ Alıntı kitapta birebir bulunamadı: ') + '“' + String(k.kaynak || '') + '”' })]);
        var ekle = el('button', { class: 'dugme kucuk ana', type: 'button' }, ['Onayla ve ekle']);
        ekle.addEventListener('click', function () {
          ekle.disabled = true;
          U.kartEkle({ on: String(k.on), arka: String(k.arka), kitap: o.kj.id, bolum: sira, blok: null, kaynak: String(k.kaynak || ''), ai: true, dogrulandi: !!dogrulandi }).then(function () { ekle.textContent = 'Eklendi ✓'; });
        });
        sat.appendChild(el('div', { class: 'yp-dugmeler' }, [ekle]));
        kutu.appendChild(sat);
      });
    }).catch(function (e) { kutu.innerHTML = ''; kutu.appendChild(el('p', { class: 'hata-metni', text: U.AI.hataMetni(e) })); });
  }

  U.sekmeleriCiz();
})();
