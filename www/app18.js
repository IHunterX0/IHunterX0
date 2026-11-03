/* 1001 — Öneriler paketi (kullanıcı, 2026-11-02: "hepsini ekle"):
   1) Saray odaları → tekrar kartları (SM-2): ön yüz sahne, arka yüz bilgi + eşleme.
   2) 🎯 Ayırt etme testi: Jane'in "takılacağın yer" çiftlerinden şıklı test (yanlış → Eksikler).
   3) 🎩 Haftalık Jane raporu: haftanın verisinden (süre, saatler, eksikler, testler, saraylar, tahmin) dürüst bir "okuma" + 3 hamle.
   4) 🇬🇧 İngilizcesi: okurken cümle panelinde terimlerin İngilizcesi, okunuşu, akademik kullanım.
   5) 🔬 Araştırma defteri (#defter): araştırma soruları, makaleler, fikirler; Markdown olarak indir.
   7) 🎯 3B "beni sına": Anatomi 3B'de etiketler gizli, işaret yanıp söner, 4 şıktan adını seç.
   8) Haftalık otomatik yedek (cihazda İndirilenler/1001; artifact'ta hatırlatma).
   (6 — Merkez canlı pano — app16.js içinde.) */
(function () {
  'use strict';
  var U = window.Uygulama; if (!U) return;
  var el = U.el, $ = U.$, Y = U.Y, Depo = U.Depo, Kitaplik = U.Kitaplik, Durum = U.Durum, toast = U.toast;
  var css = document.createElement('style');
  css.textContent = [
    '.df-giris{display:grid;gap:6px;border:1px solid var(--cizgi);border-radius:var(--r);padding:10px;margin:10px 0}',
    '.df-giris textarea,.df-giris input,.df-giris select{background:var(--zemin);border:1px solid var(--cizgi);border-radius:6px;color:var(--metin);padding:7px 9px;font:14px var(--f-govde,inherit)}',
    '.df-kayit{border-top:1px solid var(--cizgi);padding:8px 0;display:flex;gap:10px;align-items:flex-start}.df-kayit .m{flex:1;white-space:pre-wrap}.df-kayit small{color:var(--metin-sonuk);display:block}',
    '.lab-sinav-modu .isaret-etiket{display:none!important}.lab-sinav-modu .odak-kart{visibility:hidden}.lab-sinav-modu .odak-svg polyline{display:none}',
    '.bs-panel{position:fixed;left:50%;bottom:calc(76px + env(safe-area-inset-bottom,0px));transform:translateX(-50%);z-index:61;width:min(520px,calc(100vw - 24px));background:rgba(4,14,20,.96);border:1px solid var(--vurgu);border-radius:14px;padding:12px 14px;box-shadow:0 10px 40px rgba(0,0,0,.6)}',
    '.bs-panel .sik{margin:4px 0}.bs-ust{display:flex;justify-content:space-between;align-items:center;margin-bottom:6px}',
    '.bs-dug{position:absolute;right:12px;top:58px;z-index:8}',
    '.hr-kutu{border:1px solid var(--vurgu);border-radius:12px;padding:12px 14px;margin:12px 0;background:radial-gradient(circle at 0 0,rgba(79,224,255,.1),transparent 60%)}'
  ].join('\n');
  document.head.appendChild(css);
  function gunStr(d) { d = d || new Date(); return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2); }
  function haftaNo(d) { d = new Date(d || Date.now()); var y = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate())); var g = y.getUTCDay() || 7; y.setUTCDate(y.getUTCDate() + 4 - g); var b = new Date(Date.UTC(y.getUTCFullYear(), 0, 1)); return y.getUTCFullYear() + '-H' + Math.ceil(((y - b) / 864e5 + 1) / 7); }

  /* ---------- 1) saray → kartlar ---------- */
  U.sarayKartla = function (s) {
    return Depo.oku('kartlarim').then(function (v) {
      var var_ = {}; (v.liste || []).forEach(function (k) { if (k.kaynak) var_[k.kaynak] = 1; });
      var yeni = s.odalar.map(function (o, i) {
        var kay = 'saray:' + s.id + ':' + i; if (var_[kay]) return null;
        return { on: '🏛 ' + s.ad + ' · ' + (i + 1) + '. oda: ' + o.ad + '\n' + o.sahne + '\n\nBu sahne hangi bilgiyi saklıyor?', arka: o.bilgi + (o.esleme ? '\n🔗 ' + o.esleme : ''), kitap: s.kitap, bolum: s.sira, kaynak: kay, ai: true };
      }).filter(Boolean);
      if (!yeni.length) return 0;
      return U.depoGuncelle('kartlarim', function (w) { w.liste = w.liste || []; yeni.forEach(function (k) { k.id = 'k' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6); k.t = Date.now(); w.liste.push(k); }); }, 300).then(function () { return yeni.length; });
    });
  };

  /* ---------- 2) ayırt etme testi ---------- */
  U.ayirtTesti = function (kap, janeMetin, kj, bolum) {
    kap.innerHTML = ''; var y = el('div', { class: 'yukleniyor', text: 'Karışan kavramlardan sorular hazırlanıyor…' }); kap.appendChild(y);
    return U.AI.hazir().then(function (ok) {
      if (!ok) throw { code: 'not_granted' };
      return Y.sample.json('Aşağıdaki "takılacağın yer" anlatımında geçen, birbirine karıştırılan kavram çiftlerinin HER BİRİ için 1-2 çoktan seçmeli soru yaz (toplam 5-8 soru). ' +
        'Amaç AYIRT ETTİRMEK: şıklarda çiftin iki tarafı da bulunsun, doğru cevap ayırt edici özelliğe dayansın. 5 şık (A-E), tek doğru, "hepsi/hiçbiri" yok. "aciklama": neden bu, neden çiftin diğeri değil (1-2 cümle). ' +
        'YALNIZ kitap metnine dayan; uydurma. Türkçe, Latince terimler korunur. Doğru şıkkın yeri sorudan soruya değişsin.\n' +
        'Yalnız JSON: {"sorular":[{"soru":"...","siklar":["...","...","...","...","..."],"dogru":0-4,"aciklama":"...","konu":"X mi Y mi"}]}\n\nANLATIM:\n"""\n' + janeMetin + '\n"""\n\nKİTAP METNİ:\n"""\n' + (U.bolumOzu ? U.bolumOzu(bolum, 7000) : '') + '\n"""', { cache: false });
    }).then(function (j) {
      var sorular = (j && j.sorular || []).filter(function (q) { return q && q.soru && Array.isArray(q.siklar) && q.siklar.length >= 3 && q.dogru >= 0 && q.dogru < q.siklar.length; }).slice(0, 8)
        .map(function (q) { return { soru: String(q.soru), siklar: q.siklar.map(String), dogru: +q.dogru, aciklama: String(q.aciklama || ''), konu: String(q.konu || ''), kitap: kj.id, sira: bolum.sira, bolumAd: bolum.kisa || bolum.baslik }; });
      if (!sorular.length) throw new Error('Soru üretilemedi; yeniden dene.');
      y.remove(); U.testCiz(kap, { baslik: 'Ayırt etme · ' + (bolum.kisa || bolum.baslik), sorular: sorular }, { kaynak: 'ayirt' });
    }).catch(function (e) { y.remove(); kap.appendChild(el('p', { class: 'hata-metni', text: e && e.code ? U.AI.hataMetni(e) : String(e.message || e) })); });
  };

  /* ---------- 3) haftalık Jane raporu ---------- */
  function haftaVerisi() {
    return Promise.all([Depo.oku('sure'), Depo.oku('pomodoro'), Depo.oku('eksikler'), Depo.oku('testler'), Depo.oku('saraylar'), Kitaplik.katalog(),
      U.calismaOnerisi ? U.calismaOnerisi().catch(function () { return null; }) : null]).then(function (r) {
      var sure = r[0], pom = r[1] || {}, simdi = Date.now(), ad = {}; r[5].forEach(function (k) { ad[k.id] = k.baslik.replace(/^1001\s*/, ''); });
      var gunler = [], top = 0, onceki = 0, ders = {};
      for (var i = 0; i < 14; i++) {
        var k = gunStr(new Date(simdi - i * 864e5)), g = sure[k] || {}, t = 0;
        Object.keys(g).forEach(function (d) { t += g[d]; if (i < 7) ders[d] = (ders[d] || 0) + g[d]; });
        if (i < 7) { top += t; gunler.push(['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'][new Date(simdi - i * 864e5).getDay()] + ' ' + Math.round(t) + ' dk'); } else onceki += t;
      }
      var ek = (r[2].liste || []).filter(function (e) { return simdi - e.t < 7 * 864e5; }), kon = {};
      ek.forEach(function (e) { var x = (ad[e.kitap] || e.kitap) + ' · ' + (e.konu || e.bolum || '?'); kon[x] = (kon[x] || 0) + 1; });
      var testler = Object.keys(r[3]).map(function (x) { return r[3][x]; }).filter(function (t) { return t && t.sonuc && simdi - t.sonuc.t < 7 * 864e5; });
      var saray = (r[4].liste || []).filter(function (s) { return s.gezinti && simdi - (s.gezinti.son || 0) < 7 * 864e5; });
      var saat = pom.saat || {}, saatEn = Object.keys(saat).sort(function (a, b) { return saat[b] - saat[a]; }).slice(0, 3);
      var o = r[6];
      return {
        toplam_dk: Math.round(top), onceki_hafta_dk: Math.round(onceki), gunler: gunler.reverse(),
        ders_dagilimi: Object.keys(ders).map(function (d) { return (ad[d] || d) + ': ' + Math.round(ders[d]) + ' dk'; }),
        pomodoro_en_verimli_saatler: saatEn.map(function (h) { return h + ':00 (' + saat[h] + ' pomodoro)'; }),
        eksik_sayisi: ek.length, bilmiyorum: ek.filter(function (e) { return e.bilmiyor; }).length,
        en_cok_takilinan: Object.keys(kon).sort(function (a, b) { return kon[b] - kon[a]; }).slice(0, 6).map(function (x) { return x + ' (' + kon[x] + ')'; }),
        testler: testler.map(function (t) { return t.baslik + ': ' + t.sonuc.dogru + '/' + t.sonuc.n; }),
        gezilen_saraylar: saray.map(function (s) { return s.ad + ' (' + Object.keys(s.gezinti.bildi || {}).length + '/' + s.odalar.length + ' hatırlandı)'; }),
        en_yakin_sinav: o && o.sinav ? U.sinavAdi(o.sinav) + ', ' + o.sinav.gun + ' gün' : null, seri_gun: o && o.pomodoro ? o.pomodoro.seri_gun : null,
        siradaki_isler: o ? o.isler.slice(0, 4).map(function (x) { return x.ad; }) : []
      };
    });
  }
  U.haftalikRapor = function (yenile) {
    var anahtar = haftaNo();
    return Depo.oku('haftalikRapor').then(function (v) {
      if (!yenile && v[anahtar] && v[anahtar].metin) return v[anahtar];
      return haftaVerisi().then(function (veri) {
        return U.AI.hazir().then(function (ok) {
          if (!ok) throw { code: 'not_granted' };
          return Y.sample('Sen Patrick Jane\'sin; karşındaki tıp öğrencisinin (1. sınıf, hedefi yurt dışında PhD) bu haftasını aşağıdaki VERİDEN okuyorsun. ' +
            'Biçim: 1) "**Haftanın okuması:**" 2-3 cümle, veriye dayalı keskin bir gözlem (ör. hangi günler düştü, hangi konuda ısrarla takıldı, en verimli saatleri). ' +
            '2) "**Gördüğüm örüntü:**" bir çıkarım (nedeni ne olabilir; tahmin olduğunu belli et). 3) "**Kör noktan:**" ihmal ettiği bir şey (sınav tahmini, akademik hedef, tekrar). ' +
            '4) "**Gelecek hafta 3 hamle:**" somut, ölçülebilir 3 madde. Toplam 180-280 kelime. Sakin, zeki, hafif muzip; asla kırıcı değil. VERİDE OLMAYAN SAYI YA DA OLAY UYDURMA; veri azsa bunu söyle. Türkçe.\n\nVERİ:\n' + JSON.stringify(veri, null, 1), { cache: false });
        }).then(function (r) {
          var kayit = { metin: r.text, t: Date.now(), veri: veri };
          return U.depoGuncelle('haftalikRapor', function (w) { w[anahtar] = kayit; var k = Object.keys(w).sort(); while (k.length > 12) delete w[k.shift()]; }, 200).then(function () { return kayit; });
        });
      });
    });
  };
  function raporCiz(kap) {
    var kutu = el('div', { class: 'hr-kutu' }, [el('h3', { text: '🎩 Haftalık okuma (' + haftaNo() + ')' }), el('div', { class: 'yukleniyor', text: 'Haftan okunuyor…' })]);
    kap.appendChild(kutu);
    function ciz(yenile) {
      U.haftalikRapor(yenile).then(function (k) {
        kutu.innerHTML = ''; kutu.appendChild(el('h3', { text: '🎩 Haftalık okuma (' + haftaNo() + ')' }));
        var m = el('div', { html: U.mdHtml ? U.mdHtml(k.metin) : U.esc(k.metin) }); kutu.appendChild(m);
        kutu.appendChild(el('div', { class: 'yp-dugmeler' }, [el('button', { class: 'dugme kucuk', type: 'button', text: '↻ Yeniden oku', onclick: function () { kutu.innerHTML = '<div class="yukleniyor">Haftan okunuyor…</div>'; ciz(true); } }),
          window.Carvis && window.AndroidKopru ? el('button', { class: 'dugme kucuk', type: 'button', text: '🔊 Carvis okusun', onclick: function () { window.Carvis.soyle(k.metin); } }) : null,
          el('span', { class: 'etiket-kucuk ai', text: 'AI · ' + new Date(k.t).toLocaleString('tr-TR') })]));
      }).catch(function (e) { kutu.innerHTML = ''; kutu.appendChild(el('p', { class: 'hata-metni', text: e && e.code ? U.AI.hataMetni(e) : String(e.message || e) })); });
    }
    ciz(false);
  }
  var eskiKoc = U.GORUNUMLER.koc;
  if (eskiKoc) U.GORUNUMLER.koc = function () { eskiKoc.apply(this, arguments); var s = $('#ana .sayfa'); if (s) { var k = el('div'); var h = s.querySelector('h3'); if (h) s.insertBefore(k, h); else s.appendChild(k); raporCiz(k); } };
  // Pazar 17:00 sonrası ilk açılışta hatırlat
  setTimeout(function () {
    var d = new Date(); if (d.getDay() !== 0 || d.getHours() < 17) return;
    try { if (localStorage.getItem('haftalikHatir') === haftaNo()) return; localStorage.setItem('haftalikHatir', haftaNo()); } catch (e) {}
    toast('🎩 Haftalık okuman hazır: Koç sayfasına bak.');
  }, 6000);

  /* ---------- 4) 🇬🇧 İngilizcesi (cümle paneli eylemi) ---------- */
  if (U.EYLEMLER && !U.EYLEMLER.some(function (e) { return e.id === 'ingilizce'; })) U.EYLEMLER.push({ id: 'ingilizce', ad: '🇬🇧 İngilizcesi',
    istek: 'Cümledeki temel tıp terimlerinin (en fazla 4) İngilizcesini ver. Her terim için: **İngilizce terim** — okunuşu (Türkçe harflerle, vurgulu hece BÜYÜK harfle) — tek cümlelik İngilizce tanım — akademik bir makalede geçebilecek örnek cümle. Sonunda cümlenin akademik İngilizce çevirisini ver. Kitaptan/Genel bilgi ayrımı gerekmez; terim ve çeviri doğruluğuna özen göster.' });

  /* ---------- 5) 🔬 araştırma defteri ---------- */
  var TUR = { soru: '❓ Araştırma sorusu', makale: '📰 Makale', fikir: '💡 Fikir / not' };
  U.defterEkle = function (k) { k.id = 'd' + Date.now().toString(36); k.t = Date.now(); return U.depoGuncelle('defter', function (v) { v.liste = (v.liste || []).concat([k]).slice(-500); }, 200).then(function () { return k; }); };
  U.defterTaslak = function (metin) { try { sessionStorage.setItem('defterTaslak', metin); } catch (e) {} U.git('defter'); };
  U.SEKMELER.push({ id: 'defter', ad: 'Defter', ikon: '🔬' });
  U.GORUNUMLER.defter = function () {
    var ana = $('#ana'); ana.innerHTML = ''; var sayfa = el('div', { class: 'sayfa' }); ana.appendChild(sayfa);
    sayfa.appendChild(el('div', { class: 'kahraman' }, [el('div', { class: 'ust-etiket', text: 'Akademik hedef' }), el('h1', { text: '🔬 Araştırma defteri' }),
      el('p', { text: 'Araştırma soruların, okuduğun makaleler ve fikirlerin burada birikir. İleride bir araştırma grubuna ya da yurt dışı programa başvururken "neyle ilgileniyorum" sorusunun somut cevabı olur.' })]));
    var tur = el('select', {}), metin = el('textarea', { rows: '3', placeholder: 'Ör. "LDL reseptör geri dönüşümünü PCSK9 nasıl hızlandırıyor ve bu neden ilaç hedefi?"' }), etiket = el('input', { type: 'text', placeholder: 'Etiket (ör. lipid, kardiyoloji)' });
    Object.keys(TUR).forEach(function (k) { tur.appendChild(el('option', { value: k, text: TUR[k] })); });
    var taslak = null; try { taslak = sessionStorage.getItem('defterTaslak'); sessionStorage.removeItem('defterTaslak'); } catch (e) {}
    if (taslak) { metin.placeholder = 'Görev: ' + taslak; if (/makale/i.test(taslak)) tur.value = 'makale'; else if (/soru/i.test(taslak)) tur.value = 'soru'; }
    var bag = Durum.aktifKitap && Durum.aktifBolum ? { kitap: Durum.aktifKitap.id, bolum: Durum.aktifBolum.kisa || Durum.aktifBolum.baslik } : {};
    sayfa.appendChild(el('form', { class: 'df-giris', onsubmit: function (e) { e.preventDefault(); var m = metin.value.trim(); if (!m) return; U.defterEkle({ tur: tur.value, metin: m, etiket: etiket.value.trim(), kitap: bag.kitap || null, bolum: bag.bolum || null }).then(function () { metin.value = ''; ciz(); toast('Deftere eklendi.'); }); } },
      [el('div', { style: 'display:flex;gap:6px;flex-wrap:wrap' }, [tur, etiket]), metin, el('div', { class: 'yp-dugmeler' }, [el('button', { class: 'dugme kucuk ana', type: 'submit', text: '＋ Ekle' }),
        el('button', { class: 'dugme kucuk', type: 'button', text: '⇩ Markdown indir', onclick: indir })])]));
    var liste = el('div'); sayfa.appendChild(liste);
    function ciz() {
      Depo.oku('defter').then(function (v) {
        liste.innerHTML = ''; var l = (v.liste || []).slice().reverse();
        if (!l.length) { liste.appendChild(el('p', { class: 'bos', text: 'Defter boş. Plandaki 🌍 akademik görevlerden "✍ Deftere yaz" ile ya da Carvis\'e "bunu deftere yaz" diyerek ekleyebilirsin.' })); return; }
        Object.keys(TUR).forEach(function (t) {
          var g = l.filter(function (x) { return x.tur === t; }); if (!g.length) return;
          liste.appendChild(el('h3', { text: TUR[t] + ' (' + g.length + ')' }));
          g.forEach(function (x) {
            liste.appendChild(el('div', { class: 'df-kayit' }, [el('div', { class: 'm' }, [x.metin, el('small', { text: new Date(x.t).toLocaleDateString('tr-TR') + (x.etiket ? ' · #' + x.etiket : '') + (x.bolum ? ' · ' + x.bolum : '') })]),
              el('button', { class: 'cip', type: 'button', text: '✕', title: 'Sil', onclick: function () { U.depoGuncelle('defter', function (w) { w.liste = (w.liste || []).filter(function (z) { return z.id !== x.id; }); }, 100).then(ciz); } })]));
          });
        });
      });
    }
    function indir() {
      Depo.oku('defter').then(function (v) {
        var l = v.liste || [], md = '# Araştırma defteri\n\n_' + new Date().toLocaleDateString('tr-TR') + '_\n';
        Object.keys(TUR).forEach(function (t) { var g = l.filter(function (x) { return x.tur === t; }); if (!g.length) return; md += '\n## ' + TUR[t] + '\n\n' + g.map(function (x) { return '- ' + x.metin.replace(/\n/g, ' ') + (x.etiket ? ' `#' + x.etiket + '`' : '') + ' (' + new Date(x.t).toLocaleDateString('tr-TR') + ')'; }).join('\n') + '\n'; });
        return U.yetenekSozu.then(function () { if (!Y.downloads) throw new Error('Bu görünümde indirme yok.'); return Y.downloads.save({ filename: 'arastirma-defteri-' + gunStr() + '.md', data: new Blob([md], { type: 'text/markdown' }) }); });
      }).then(function () { toast('Defter indirildi.'); }, function (e) { toast('İndirilemedi: ' + (e.message || e.code || e)); });
    }
    if (taslak) metin.focus();
    ciz();
  };

  /* ---------- 7) 3B "beni sına" ---------- */
  function beniSina() {
    var S = U.anSahne, lab = window.__aktifLab;
    if (!S || !lab || !lab.adaptor || !lab.adaptor.odak) return toast('Önce Anatomi 3B\'yi aç.');
    var fma = S.secili;
    if (!fma) return toast('Önce bir kemik seç (dokun ya da ara).');
    fetch('lab/anatomi/isaretler.json').then(function (r) { return r.json(); }).then(function (j) {
      var l = j.isaretler.filter(function (x) { return x.fma === fma; });
      if (l.length < 4) return toast('Bu kemikte yeterli işaret yok (en az 4). Scapula, humerus, femur, os coxae… dene.');
      var kap = document.querySelector('.lab-sahne') ? document.querySelector('.lab-sahne').parentNode : document.body;
      var sira = l.slice().sort(function () { return Math.random() - 0.5; }).slice(0, Math.min(10, l.length)), i = 0, dogru = 0;
      var panel = el('div', { class: 'bs-panel', role: 'dialog', 'aria-label': 'İşaret sınavı' }); document.body.appendChild(panel);
      function kapat() { document.body.classList.remove('lab-sinav-modu'); panel.remove(); }
      function soru() {
        if (i >= sira.length) { panel.innerHTML = ''; panel.appendChild(el('div', { class: 'bs-ust' }, [el('b', { text: '🎯 Sonuç: ' + dogru + '/' + sira.length }), el('button', { class: 'ikon-dugme', type: 'button', text: '✕', onclick: kapat })])); panel.appendChild(el('p', { class: 'var-etiket', text: dogru === sira.length ? 'Kusursuz. Başka bir kemiğe geç.' : 'Yanlışlar Eksikler\'e eklendi.' })); document.body.classList.remove('lab-sinav-modu'); return; }
        var x = sira[i]; document.body.classList.add('lab-sinav-modu');
        lab.adaptor.odak(fma, x.ad, '').then(function () {
          var secenek = [x.ad].concat(l.filter(function (y) { return y.ad !== x.ad; }).sort(function () { return Math.random() - 0.5; }).slice(0, 3).map(function (y) { return y.ad; })).sort(function () { return Math.random() - 0.5; });
          panel.innerHTML = '';
          panel.appendChild(el('div', { class: 'bs-ust' }, [el('b', { text: '🎯 ' + (i + 1) + '/' + sira.length + ' · Yanıp sönen işaret hangisi?' }), el('button', { class: 'ikon-dugme', type: 'button', text: '✕', 'aria-label': 'Sınavı kapat', onclick: kapat })]));
          var bitti = false;
          secenek.forEach(function (s, k) {
            panel.appendChild(el('button', { class: 'sik', type: 'button', onclick: function () {
              if (bitti) return; bitti = true; var ok = s === x.ad; if (ok) dogru++;
              this.classList.add(ok ? 'dogru' : 'yanlis'); if (!ok) [].forEach.call(panel.querySelectorAll('.sik'), function (b) { if (b.textContent.indexOf(x.ad) >= 0) b.classList.add('dogru'); });
              if (!ok && U.eksikEkle) U.eksikEkle({ kitap: 'anatomi', bolum: 'Anatomi 3B', sira: 0, konu: x.ad, soru: 'İşaret: ' + x.ad + ' (' + ((S.kat[fma] || {}).la || fma) + ')', bilmiyor: false, kaynak: '3b-sinav' });
              document.body.classList.remove('lab-sinav-modu');
              panel.appendChild(el('button', { class: 'dugme kucuk ana', type: 'button', text: i + 1 < sira.length ? 'Sonraki →' : 'Sonucu gör', onclick: function () { i++; soru(); } }));
            } }, [el('span', { class: 'harf', text: 'ABCD'[k] }), el('span', { text: s })]));
          });
        }, function (e) { i++; soru(); });
      }
      soru();
    });
  }
  U.beniSina = beniSina;
  // Anatomi 3B sayfasına düğme
  function dugmeKoy() {
    if (Durum.gorunum !== 'lab-anatomi' && !/^#lab-anatomi/.test(location.hash)) return;
    var sahne = document.querySelector('.lab-sahne'); if (!sahne || sahne.querySelector('.bs-dug')) return;
    if (getComputedStyle(sahne).position === 'static') sahne.style.position = 'relative';
    sahne.appendChild(el('button', { class: 'dugme kucuk ana bs-dug', type: 'button', text: '🎯 Beni sına', title: 'Seçili kemiğin işaretlerinden sınav: etiketler gizlenir, yanıp sönen işaretin adını seç', onclick: beniSina }));
  }
  window.addEventListener('hashchange', function () { setTimeout(dugmeKoy, 1500); setTimeout(dugmeKoy, 5000); });
  setTimeout(dugmeKoy, 2500);

  /* ---------- 8) haftalık otomatik yedek ---------- */
  setTimeout(function () {
    if (!U.yedekVeri) return;
    var son = 0; try { son = +localStorage.getItem('otoYedek') || 0; } catch (e) {}
    if (Date.now() - son < 7 * 864e5) return;
    if (!window.AndroidKopru) { if (son) toast('Son yedeğin 1 haftadan eski: Notlarım → Yedek → ⇩ Yedeği indir.'); try { localStorage.setItem('otoYedek', String(Date.now())); } catch (e) {} return; }
    U.yetenekSozu.then(function () { return U.yedekVeri(); }).then(function (veri) {
      return Y.downloads.save({ filename: '1001-yedek-' + gunStr() + '.json', data: new Blob([JSON.stringify(veri)], { type: 'application/json' }) });
    }).then(function () { try { localStorage.setItem('otoYedek', String(Date.now())); } catch (e) {} }).catch(function (e) { console.warn('otomatik yedek', e); });
  }, 20000);

  /* ---------- Carvis / Sohbet araçları ---------- */
  var eskiEk = U.sohbetEkAraclari;
  U.sohbetEkAraclari = function () {
    return (eskiEk ? eskiEk() : []).concat([
      { name: 'haftalik_rapor', description: 'Öğrencinin bu haftasının Patrick Jane tarzı okumasını döndürür (çalışma süresi, takıldığı konular, örüntü, kör nokta, 3 hamle). "Haftam nasıl geçti", "haftalık rapor" denince.', inputSchema: { type: 'object', properties: {} },
        execute: function () { return U.haftalikRapor(false).then(function (k) { return k.metin; }); } },
      { name: 'deftere_ekle', description: 'Araştırma defterine kayıt ekler: araştırma sorusu, okunan makale ya da fikir ("bunu deftere yaz", "araştırma sorusu olarak kaydet").',
        inputSchema: { type: 'object', properties: { tur: { type: 'string', enum: ['soru', 'makale', 'fikir'] }, metin: { type: 'string' }, etiket: { type: 'string' } }, required: ['metin'] },
        execute: function (g) { return U.defterEkle({ tur: g.tur || 'fikir', metin: String(g.metin), etiket: g.etiket || '', kitap: Durum.aktifKitap ? Durum.aktifKitap.id : null, bolum: Durum.aktifBolum ? (Durum.aktifBolum.kisa || Durum.aktifBolum.baslik) : null }).then(function () { return 'Deftere eklendi.'; }); } }
    ]);
  };
  U.sekmeleriCiz();
})();
