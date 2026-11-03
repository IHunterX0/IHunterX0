/* 1001 — Eklentiler: Carvis kendi kodunu yazar (kullanıcı, 2026-11-03: "anlatırken openroute falan bunu kendi kendine kodlayabilsin
   demiştim, sonra öneri kutusu koyduk; o kendi kendine kodlayabilsin dediğim kısmı sen kodla").
   Akış: istek yazılır (ya da Carvis'e söylenir) → yapay zekâ (sağlayıcı zinciri) aşağıdaki güvenli API ile bir eklenti yazar →
   kullanıcı açıklamayı ve kodu görür → onaylarsa kaydedilir ve çalışır. Eklentiler açılışta yüklenir.
   Güvenlik: kod yalnız onayla çalışır; açılışta eklenti yüklenirken uygulama çökerse bir sonraki açılışta GÜVENLİ MOD (eklentiler
   kapalı) ve uyarı; adres çubuğuna ?guvenli eklenirse hiçbiri çalışmaz; her eklentinin hatası yakalanıp kaydedilir, "Düzelt" ile
   hata yapay zekâya geri verilir. Eklentiler internete yalnız api.ai üzerinden (sağlayıcı zinciri) erişir. */
(function () {
  'use strict';
  if (/[?&]gomulu\b/.test(location.search)) return;
  var U = window.Uygulama; if (!U) return;
  var el = U.el, $ = U.$, Y = U.Y;
  var ANAHTAR = 'eklentiler_v1', BAYRAK = 'eklenti_yukleniyor';
  function oku() { try { return JSON.parse(localStorage.getItem(ANAHTAR) || '[]'); } catch (e) { return []; } }
  function yaz(l) { try { localStorage.setItem(ANAHTAR, JSON.stringify(l)); } catch (e) {} }
  var calisan = {}, hatalar = {};

  /* ---------- eklentilere verilen API ---------- */
  function api(ek) {
    var ad = ek.id;
    return {
      el: el, $: $,
      toast: U.toast,
      panel: function (baslik) { return U.panelAc(baslik, 'Eklenti · ' + ek.ad); },
      depo: { oku: function (k, v) { try { var x = localStorage.getItem('ek_' + ad + '_' + k); return x == null ? v : JSON.parse(x); } catch (e) { return v; } }, yaz: function (k, v) { try { localStorage.setItem('ek_' + ad + '_' + k, JSON.stringify(v)); } catch (e) {} } },
      ai: function (istem) { return Y.sample(String(istem), { hafif: true }).then(function (r) { return r.text; }); },
      aiJson: function (istem) { return Y.sample.json(String(istem)); },
      sayfa: function (id, baslik, ciz) { // yeni sayfa: #ek-<id>
        var h = 'ek-' + id;
        U.GORUNUMLER[h] = function () { var ana = $('#ana'); ana.innerHTML = ''; var s = el('div', { class: 'sayfa' }); ana.appendChild(s); s.appendChild(el('div', { class: 'kahraman' }, [el('div', { class: 'ust-etiket', text: 'Eklenti' }), el('h1', { text: baslik })])); try { ciz(s); } catch (e) { hataKaydet(ek, e); s.appendChild(el('p', { class: 'hata-metni', text: 'Eklenti hatası: ' + e.message })); } };
        if (!U.SEKMELER.some(function (x) { return x.id === h; })) U.SEKMELER.push({ id: h, ad: baslik, ikon: '✦' });
        return '#' + h;
      },
      carvisAraci: function (t) { // {name, description, inputSchema, execute}
        ekAraclar[t.name] = t; return true;
      },
      kitaplar: function () { return U.Kitaplik.katalog(); },
      acikKitap: function () { var D = U.Durum || {}; return D.aktifKitap ? { id: D.aktifKitap.id, baslik: D.aktifKitap.baslik, bolum: D.aktifBolum ? (D.aktifBolum.kisa || D.aktifBolum.baslik) : null } : null; },
      calisma: function () { return U.calismaOnerisi ? U.calismaOnerisi() : Promise.resolve(null); },
      git: function (h) { location.hash = h; },
      konus: function (m) { if (window.Carvis && window.Carvis.soyle) return window.Carvis.soyle(m); },
      zamanlayici: function (fn, ms) { var z = setInterval(function () { try { fn(); } catch (e) { hataKaydet(ek, e); clearInterval(z); } }, Math.max(1000, ms || 60000)); (calisan[ad] = calisan[ad] || []).push(z); return z; }
    };
  }
  var ekAraclar = {};
  U.eklentiAraclari = function () { return Object.keys(ekAraclar).map(function (k) { return ekAraclar[k]; }); };
  function hataKaydet(ek, e) { hatalar[ek.id] = String(e && (e.stack || e.message) || e).slice(0, 800); var l = oku(); l.forEach(function (x) { if (x.id === ek.id) x.sonHata = hatalar[ek.id]; }); yaz(l); }
  function calistir(ek) {
    try { var f = new Function('api', '"use strict";\n' + ek.kod); var r = f(api(ek)); if (r && r.catch) r.catch(function (e) { hataKaydet(ek, e); }); return true; }
    catch (e) { hataKaydet(ek, e); return false; }
  }
  function durdur(ek) { (calisan[ek.id] || []).forEach(clearInterval); delete calisan[ek.id]; }

  /* ---------- açılışta yükle (güvenli mod korumalı) ---------- */
  var guvenli = /[?&]guvenli\b/.test(location.search), oncekiCokus = false;
  try { oncekiCokus = localStorage.getItem(BAYRAK) === '1'; } catch (e) {}
  if (!guvenli && !oncekiCokus) {
    try { localStorage.setItem(BAYRAK, '1'); } catch (e) {}
    setTimeout(function () {
      oku().filter(function (x) { return x.acik; }).forEach(calistir);
      setTimeout(function () { try { localStorage.removeItem(BAYRAK); } catch (e) {} }, 6000);
    }, 1200);
  } else if (oncekiCokus) {
    try { localStorage.removeItem(BAYRAK); } catch (e) {}
    setTimeout(function () { U.toast && U.toast('⚠ Güvenli mod: geçen açılışta bir eklenti yüklenirken uygulama kapandı; eklentiler bu açılışta çalışmadı. Eklentiler sayfasından kontrol et.'); }, 2500);
  }

  /* ---------- yapay zekâya eklenti yazdır ---------- */
  var API_BELGE = [
    'Eklenti gövdesi bir fonksiyon gövdesidir; tek parametre "api". Kullanılabilir:',
    'api.el(etiket, {class, text, html, onclick, style, ...}, [çocuklar]) → DOM öğesi oluşturur.',
    'api.panel(baslik) → yan panel açar, içine öğe eklenecek gövdeyi döndürür.',
    'api.sayfa(id, baslik, function (kap) {...}) → menüye yeni sayfa ekler (#ek-id); kap içine çiz.',
    'api.carvisAraci({ name, description, inputSchema, execute: function (girdi) { return sonuç ya da Promise } }) → Carvis\'e sesli komutla çağrılabilen yeni araç.',
    'api.ai(istem) → Promise<metin>; api.aiJson(istem) → Promise<JSON> (istemde "yalnız JSON" iste).',
    'api.depo.oku(anahtar, varsayılan) / api.depo.yaz(anahtar, değer) → kalıcı küçük veri.',
    'api.kitaplar() → Promise<[{id, baslik}]>; api.acikKitap() → {id, baslik, bolum} | null; api.calisma() → Promise<{pomodoro:{bugun_dakika, gunluk_hedef_dk, seri_gun}, sinav:{kitap, gun}, vadeli, isler:[{ad}]}>.',
    'api.toast(metin), api.git("#hash"), api.konus(metin) (Carvis sesli söyler), api.zamanlayici(fn, ms) (en az 1000 ms).',
    'Stil için class kullan: "dugme", "dugme kucuk", "dugme ana", "cip", "var-etiket", "yp-cevap", "kitap-kart". Satır içi stil de olur.',
    'YASAK: fetch/XMLHttpRequest ile başka sitelere istek, eval, localStorage\'a doğrudan yazmak (api.depo kullan), document.body\'yi silmek, sonsuz döngü. Uygulamanın başka kodlarına dokunma.'
  ].join('\n');
  function yazdir(istek, onceki, hata) {
    return Y.sample.json('Sen bir tıp öğrencisinin kişisel çalışma uygulaması "1001 / C.A.R.V.I.S." için küçük JavaScript eklentileri yazan bir geliştiricisin. Kullanıcının isteği: "' + istek + '".\n' +
      (onceki ? 'ÖNCEKİ KOD (düzelt/geliştir):\n' + onceki + '\n' : '') + (hata ? 'ALINAN HATA:\n' + hata + '\n' : '') +
      'API:\n' + API_BELGE + '\n\nES5 uyumlu, sade, hatasız kod yaz (arrow fonksiyon olur, ama modül/import yok). Türkçe arayüz metinleri. İstek bu API ile yapılamıyorsa en yakın yapılabilir hâlini yaz ve "sinir" alanında açıkla.\n' +
      'YALNIZ JSON: {"ad":"kısa ad","aciklama":"1-2 cümle: ne yapar, nasıl kullanılır","sinir":"yapamadıkların ya da boş","kod":"fonksiyon gövdesi"}', { cache: false }).then(function (j) {
      if (!j || !j.kod) throw new Error('Kod üretilemedi.');
      var k = String(j.kod);
      if (/\b(fetch|XMLHttpRequest|eval|importScripts|WebSocket)\s*\(|localStorage\.(setItem|removeItem|clear)|document\.body\.innerHTML\s*=/.test(k)) throw new Error('Üretilen kod yasaklı bir işlem içeriyordu; tekrar dene ya da isteği değiştir.');
      try { new Function('api', k); } catch (e) { throw new Error('Kodda sözdizimi hatası: ' + e.message); }
      return { ad: String(j.ad || istek).slice(0, 60), aciklama: String(j.aciklama || ''), sinir: String(j.sinir || ''), kod: k };
    });
  }

  /* ---------- sayfa ---------- */
  U.GORUNUMLER.eklentiler = function () {
    var ana = $('#ana'); ana.innerHTML = '';
    var sayfa = el('div', { class: 'sayfa' }); ana.appendChild(sayfa);
    sayfa.appendChild(el('div', { class: 'kahraman' }, [el('div', { class: 'ust-etiket', text: 'Carvis kendi kodunu yazar' }), el('h1', { text: '✦ Eklentiler' }),
      el('p', { text: 'Ne istediğini yaz: yapay zekâ bir eklenti yazar, sen açıklamayı ve kodu görüp onaylarsın, uygulamaya eklenir. Bir şey bozulursa eklentiyi kapat; uygulama açılışta kapanırsa bir sonraki açılış güvenli modda olur.' })]));
    var istek = el('textarea', { rows: 3, placeholder: 'Örn. "Merkez\'e bugün kaç kart çözdüğümü gösteren bir sayaç ekle" · "Carvis\'e \'motivasyon\' deyince sınavıma kalan günle bir cümle söylesin" · "Biyokimya için günlük 5 soruluk mini test sayfası"', style: 'width:100%;border-radius:14px;border:1px solid rgba(94,240,220,.3);background:rgba(2,12,16,.7);color:#e6fffb;padding:10px 12px;font:14px var(--f-govde,system-ui)' });
    var durum = el('p', { class: 'var-etiket', 'aria-live': 'polite' }), onizleme = el('div'), liste = el('div');
    sayfa.appendChild(istek);
    sayfa.appendChild(el('div', { class: 'dp-dugmeler' }, [el('button', { class: 'dugme ana', type: 'button', text: '✦ Yaz', onclick: function () { uret(istek.value.trim()); } }), guvenli ? el('span', { class: 'etiket-kucuk uyari', text: 'GÜVENLİ MOD (?guvenli)' }) : '']));
    sayfa.appendChild(durum); sayfa.appendChild(onizleme);
    sayfa.appendChild(el('h2', { text: 'Kurulu eklentiler' })); sayfa.appendChild(liste);
    function uret(q, onceki, hata, eskiId) {
      if (!q) { istek.focus(); return; }
      durum.textContent = 'Yapay zekâ eklentiyi yazıyor…'; onizleme.innerHTML = '';
      yazdir(q, onceki, hata).then(function (e) {
        durum.textContent = '';
        var kodEl = el('pre', { style: 'max-height:280px;overflow:auto;font:12px/1.5 var(--f-kod,monospace);background:rgba(0,0,0,.4);padding:10px;border-radius:12px;white-space:pre-wrap', text: e.kod });
        onizleme.appendChild(el('div', { class: 'yp-cevap' }, [el('b', { text: e.ad }), el('p', { text: e.aciklama }), e.sinir ? el('p', { class: 'var-etiket', text: 'Sınır: ' + e.sinir }) : '',
          el('details', {}, [el('summary', { text: 'Kodu göster (' + e.kod.split('\n').length + ' satır)' }), kodEl]),
          el('div', { class: 'dp-dugmeler' }, [
            el('button', { class: 'dugme ana', type: 'button', text: '✓ Onayla ve ekle', onclick: function () {
              var l = oku(), id = eskiId || ('e' + Date.now().toString(36));
              l = l.filter(function (x) { return x.id !== id; }); var ek = { id: id, ad: e.ad, aciklama: e.aciklama, istek: q, kod: e.kod, acik: true, t: Date.now() };
              l.push(ek); yaz(l); durdur(ek); var ok = calistir(ek); onizleme.innerHTML = ''; istek.value = ''; ciz();
              U.toast(ok ? 'Eklenti eklendi ve çalıştı: ' + e.ad : 'Eklendi ama hata verdi; listeden "Düzelt"e bas.'); if (U.sekmeleriCiz) try { U.sekmeleriCiz(); } catch (x) {} } }),
            el('button', { class: 'dugme', type: 'button', text: '↻ Yeniden yaz', onclick: function () { uret(q, onceki, hata, eskiId); } }),
            el('button', { class: 'dugme', type: 'button', text: 'Vazgeç', onclick: function () { onizleme.innerHTML = ''; } })])]));
      }, function (e) { durum.textContent = 'Olmadı: ' + (U.AI && U.AI.hataMetni ? U.AI.hataMetni(e) : e.message || e); });
    }
    function ciz() {
      liste.innerHTML = ''; var l = oku();
      if (!l.length) { liste.appendChild(el('p', { class: 'var-etiket', text: 'Henüz eklenti yok.' })); return; }
      l.forEach(function (ek) {
        var ac = el('input', { type: 'checkbox', checked: ek.acik ? true : null });
        ac.addEventListener('change', function () { var m = oku(); m.forEach(function (x) { if (x.id === ek.id) x.acik = ac.checked; }); yaz(m); if (ac.checked) calistir(ek); else durdur(ek); U.toast(ac.checked ? 'Açıldı' : 'Kapatıldı (sayfa yenilenince tamamen durur)'); });
        var h = hatalar[ek.id] || ek.sonHata;
        liste.appendChild(el('div', { class: 'yp-cevap', style: 'margin:8px 0' }, [
          el('label', { style: 'display:flex;gap:8px;align-items:center' }, [ac, el('b', { text: ek.ad })]),
          el('p', { class: 'var-etiket', text: ek.aciklama }),
          h ? el('p', { class: 'hata-metni', text: 'Son hata: ' + h.split('\n')[0] }) : '',
          el('div', { class: 'dp-dugmeler' }, [
            el('button', { class: 'dugme kucuk', type: 'button', text: '🛠 Düzelt / geliştir', onclick: function () { var q = prompt('Ne değişsin? (boş bırakırsan yalnız hatayı düzeltir)', '') ; uret((ek.istek || ek.ad) + (q ? ' — DEĞİŞİKLİK: ' + q : ''), ek.kod, h, ek.id); window.scrollTo({ top: 0, behavior: 'smooth' }); } }),
            el('button', { class: 'dugme kucuk', type: 'button', text: '🗑 Sil', onclick: function () { if (!confirm(ek.ad + ' silinsin mi?')) return; durdur(ek); yaz(oku().filter(function (x) { return x.id !== ek.id; })); ciz(); } })])]));
      });
    }
    ciz();
  };
  U.SEKMELER.push({ id: 'eklentiler', ad: 'Eklentiler', ikon: '✦' });
  if (U.sekmeleriCiz) try { U.sekmeleriCiz(); } catch (e) {}
  // Carvis: "şunu yapan bir özellik ekle" → eklenti yazdırma sayfasına yönlendirir
  U.eklentiYazdir = function (istek) { location.hash = 'eklentiler'; setTimeout(function () { var t = document.querySelector('#ana textarea'); if (t) { t.value = istek; var b = [].slice.call(document.querySelectorAll('#ana .dugme.ana')).filter(function (x) { return /Yaz/.test(x.textContent); })[0]; if (b) b.click(); } }, 400); return 'Eklenti sayfası açıldı; yapay zekâ yazıyor, kullanıcı onaylayınca eklenecek.'; };
})();
