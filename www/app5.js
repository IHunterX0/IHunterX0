/* 1001 — Aşama 5: görsel paketleri (açık lisanslı gerçek görseller), atıflı galeri, zaman çizelgesi */
(function () {
  'use strict';
  var U = window.Uygulama, A = window.KitapAyristir;
  var el = U.el, $ = U.$, $$ = U.$$, esc = U.esc, toast = U.toast, Y = U.Y, Kitaplik = U.Kitaplik;
  var katla = A.katla;

  // İzinli lisanslar: yalnız açık ve atfı belli olanlar. Belirsiz lisans reddedilir.
  var LISANS = /^(CC0|PD|Public Domain|Kamu malı|CC BY(-SA)? (1\.0|2\.0|2\.5|3\.0|4\.0)|CC BY(-SA)? 2\.1 JP)$/i;
  function lisansGecerli(l) { return LISANS.test(String(l || '').trim()); }
  U.lisansGecerli = lisansGecerli;

  var Paket = { liste: null };
  function paketler() {
    if (Paket.liste) return Paket.liste;
    Paket.liste = U.yetenekSozu.then(function () {
      if (!Y.db) return [];
      return Y.db.collection('gorselPaketleri').get().then(function (s) { return s.docs.map(function (d) { return d.data(); }); }).catch(function () { return []; });
    });
    return Paket.liste;
  }
  U.gorselPaketleri = paketler;

  // manifest.json + dosyalar → doğrulanmış paket önizlemesi
  function manifestOku(manifest, dosyalar) {
    var m = typeof manifest === 'string' ? JSON.parse(manifest) : manifest;
    if (!m || !Array.isArray(m.gorseller)) throw new Error('manifest.json içinde "gorseller" dizisi yok.');
    var kabul = [], red = [];
    m.gorseller.forEach(function (g) {
      var sorun = [];
      if (!g.dosya) sorun.push('dosya adı yok');
      else if (!dosyalar[g.dosya] && !dosyalar[Object.keys(dosyalar).filter(function (k) { return k.split('/').pop() === g.dosya; })[0]]) sorun.push('dosya pakette yok');
      if (!lisansGecerli(g.lisans)) sorun.push('lisans belirsiz/izinsiz: "' + (g.lisans || '—') + '"');
      if (!g.kaynak) sorun.push('kaynak URL yok');
      if (!g.atif && !/^(CC0|PD|Public Domain|Kamu malı)$/i.test(g.lisans || '')) sorun.push('atıf satırı yok');
      if (!Array.isArray(g.anahtarlar) || !g.anahtarlar.length) sorun.push('kavram anahtar kelimesi yok');
      if (sorun.length) red.push({ g: g, sorun: sorun }); else kabul.push(g);
    });
    return { kitap: m.kitap || null, baslik: m.baslik || 'Görsel paketi', kabul: kabul, red: red };
  }
  U.manifestOku = manifestOku;

  function paketYukle(p, dosyalar, ilerle) {
    var yuklenen = [], ids = [];
    var i = 0;
    function sonraki() {
      if (i >= p.kabul.length) return Promise.resolve();
      var g = p.kabul[i++];
      var anahtar = dosyalar[g.dosya] ? g.dosya : Object.keys(dosyalar).filter(function (k) { return k.split('/').pop() === g.dosya; })[0];
      var b = dosyalar[anahtar];
      ilerle('Görsel ' + i + '/' + p.kabul.length + ' yükleniyor…');
      return Y.assets.upload(b, { type: /svg/i.test(anahtar) ? 'image/svg+xml' : /png$/i.test(anahtar) ? 'image/png' : 'image/jpeg' }).then(function (r) {
        ids.push(r.id);
        yuklenen.push({ id: r.id, anahtarlar: g.anahtarlar, baslik: g.baslik || '', yazar: g.yazar || '', lisans: g.lisans, kaynak: g.kaynak, atif: g.atif || g.lisans, yil: g.yil != null ? g.yil : null, not: g.not || '' });
      }).then(sonraki);
    }
    return sonraki().then(function () {
      var id = 'p' + Date.now().toString(36);
      var belge = { id: id, kitap: p.kitap, baslik: p.baslik, gorseller: yuklenen, assetler: ids, t: Date.now() };
      return Y.db.doc('gorselPaketleri/' + id).set(belge).then(function () { Paket.liste = null; return belge; });
    }).catch(function (e) { return Promise.all(ids.map(function (x) { return Y.assets.delete(x).catch(function () {}); })).then(function () { throw e; }); });
  }

  /* --- Kitap ekle ekranına "Görsel paketi" bölümü --- */
  var eskiEkle = U.GORUNUMLER.ekle;
  U.GORUNUMLER.ekle = function () {
    eskiEkle();
    var sayfa = $('#ana .sayfa'); if (!sayfa) return;
    var kap = el('section', { class: 'analiz-kutu', style: 'margin-top:24px' });
    kap.appendChild(el('h2', { text: 'Görsel paketi ekle' }));
    kap.appendChild(el('p', { class: 'var-etiket', text: 'ZIP içinde manifest.json + görseller (biçim: KITAP_SEMASI.md › Görsel paketi). Yalnız açık lisanslı (CC0, kamu malı, CC BY, CC BY-SA) ve kaynağı yazılı görseller kabul edilir; lisansı belirsiz olan reddedilir.' }));
    var g = el('input', { id: 'paketSec', type: 'file', accept: '.zip', class: 'gizli-erisim' });
    var rapor = el('div', { class: 'ekle-rapor' });
    kap.appendChild(el('label', { class: 'dugme kucuk', for: 'paketSec' }, ['Görsel paketi (.zip) seç']));
    kap.appendChild(g); kap.appendChild(rapor);
    var liste = el('div', { class: 'kk-ic' });
    kap.appendChild(el('h4', { text: 'Yüklü paketler' })); kap.appendChild(liste);
    sayfa.appendChild(kap);
    function listeCiz() {
      paketler().then(function (l) {
        liste.innerHTML = '';
        if (!l.length) liste.appendChild(el('p', { class: 'var-etiket', text: 'Henüz görsel paketi yok.' }));
        l.forEach(function (p) {
          liste.appendChild(el('div', { class: 'yonetim-satir' }, [el('strong', { text: p.baslik }), el('span', { class: 'var-etiket', text: (p.gorseller || []).length + ' görsel' + (p.kitap ? ' · ' + p.kitap : '') }),
            Y.assets ? (function () { var b = el('button', { class: 'dugme kucuk', type: 'button' }, ['Sil']); b.addEventListener('click', function () {
              if (b.dataset.onay !== '1') { b.dataset.onay = '1'; b.textContent = 'Emin misin?'; b.classList.add('tehlike'); return; }
              Promise.all((p.assetler || []).map(function (x) { return Y.assets.delete(x).catch(function () {}); })).then(function () { return Y.db.doc('gorselPaketleri/' + p.id).delete(); }).then(function () { Paket.liste = null; listeCiz(); toast('Paket silindi.'); });
            }); return b; })() : null]));
        });
      });
    }
    listeCiz();
    g.addEventListener('change', function () {
      var f = g.files[0]; g.value = ''; if (!f) return;
      rapor.innerHTML = ''; rapor.appendChild(el('div', { class: 'yukleniyor', text: 'Paket okunuyor…' }));
      zipAc(f).then(function (dosyalar) {
        var mk = Object.keys(dosyalar).filter(function (k) { return /(^|\/)manifest\.json$/i.test(k); })[0];
        if (!mk) throw new Error('ZIP içinde manifest.json yok.');
        return dosyalar[mk].text().then(function (t) { return { p: manifestOku(t, dosyalar), dosyalar: dosyalar }; });
      }).then(function (o) {
        rapor.innerHTML = '';
        var kart = el('div', { class: 'onizleme' }, [el('div', { class: 'ust-etiket', text: 'Görsel paketi önizlemesi' }), el('strong', { text: o.p.baslik }),
          el('p', { text: o.p.kabul.length + ' görsel kabul, ' + o.p.red.length + ' görsel reddedildi.' })]);
        if (o.p.red.length) kart.appendChild(el('div', { class: 'uyari-kutu' }, o.p.red.slice(0, 10).map(function (r) { return el('p', { text: '⚠ ' + (r.g.dosya || '?') + ': ' + r.sorun.join(', ') }); })));
        var durum = el('p', { class: 'var-etiket', 'aria-live': 'polite' });
        var onay = el('button', { class: 'dugme ana', type: 'button', disabled: !o.p.kabul.length || !Y.assets || !Y.db ? true : null }, ['Onayla ve ekle']);
        onay.addEventListener('click', function () { onay.disabled = true; paketYukle(o.p, o.dosyalar, function (m) { durum.textContent = m; }).then(function () { durum.textContent = 'Eklendi.'; listeCiz(); }).catch(function (e) { durum.textContent = 'Eklenemedi: ' + (e.message || e.code); onay.disabled = false; }); });
        kart.appendChild(el('div', { class: 'yp-dugmeler' }, [onay])); kart.appendChild(durum);
        if (!Y.assets || !Y.db) durum.textContent = 'Eklemek için sayfayı düzenleme yetkisiyle claude.ai içinde aç.';
        rapor.appendChild(kart);
      }).catch(function (e) { rapor.innerHTML = ''; rapor.appendChild(el('div', { class: 'bos hata-metni', text: 'Okunamadı: ' + e.message })); });
    });
  };
  function zipAc(f) {
    var url = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js';
    var yukle = window.JSZip ? Promise.resolve() : new Promise(function (ok, red) { var s = document.createElement('script'); s.src = url; s.onload = ok; s.onerror = function () { red(new Error('JSZip yüklenemedi')); }; document.head.appendChild(s); });
    return yukle.then(function () { return window.JSZip.loadAsync(f); }).then(function (zip) {
      var out = {}, l = [];
      zip.forEach(function (yol, g) { if (!g.dir && !/(^|\/)(__MACOSX|\.)/.test(yol)) l.push([yol, g]); });
      return Promise.all(l.map(function (x) { return x[1].async('blob').then(function (b) { out[x[0]] = b; }); })).then(function () { return out; });
    });
  }

  /* --- Kavram kartına paket görselleri (atıflı) --- */
  var eskiLab = U.labDugmesi;
  U.labDugmesi = function (kap, ad, kj) {
    if (eskiLab) eskiLab(kap, ad, kj);
    var qk = katla(ad);
    paketler().then(function (l) {
      var bulunan = [];
      l.forEach(function (p) { if (p.kitap && kj && p.kitap !== kj.id) return; (p.gorseller || []).forEach(function (g) { if ((g.anahtarlar || []).some(function (a) { var k = katla(a); return k === qk || k.indexOf(qk) >= 0 || qk.indexOf(k) >= 0; })) bulunan.push(g); }); });
      if (!bulunan.length) return;
      var g = el('div', { class: 'tarih-galeri' });
      bulunan.slice(0, 8).forEach(function (x) { g.appendChild(tarihKart(x)); });
      kap.insertBefore(el('h4', { class: 'tarih-baslik', text: '🏛 Gerçek görseller (açık lisanslı)' }), kap.firstChild);
      kap.insertBefore(g, kap.children[1]);
    });
  };
  function yilYaz(y) { y = +y; return y < 0 ? 'MÖ ' + (-y) : String(y); }
  function tarihKart(x) {
    var src = '/_blob/' + x.id;
    return el('figure', { class: 'tarih-kart' }, [
      el('a', { href: src, target: '_blank', rel: 'noopener' }, [el('img', { src: src, alt: x.baslik, loading: 'lazy' })]),
      el('figcaption', null, [el('strong', { text: x.baslik + (x.yil != null ? ' (' + yilYaz(x.yil) + ')' : '') }), x.not ? el('span', { text: x.not }) : null,
        el('small', null, [(x.yazar ? x.yazar + ' · ' : '') + x.lisans + ' · ', el('a', { href: x.kaynak, target: '_blank', rel: 'noopener', text: 'kaynak' }), x.atif ? ' · ' + x.atif : ''])])]);
  }

  /* --- Zaman çizelgesi --- */
  U.GORUNUMLER.zaman = function () {
    var ana = $('#ana'); ana.innerHTML = '';
    var sayfa = el('div', { class: 'sayfa calis-sayfa' }); ana.appendChild(sayfa);
    sayfa.appendChild(el('div', { class: 'kahraman' }, [el('div', { class: 'ust-etiket', text: 'Görsel paketleri' }), el('h1', { text: 'Zaman çizelgesi' })]));
    var akis = el('div', { class: 'zaman-akis' }); sayfa.appendChild(akis);
    paketler().then(function (l) {
      var hepsi = [];
      l.forEach(function (p) { (p.gorseller || []).forEach(function (g) { if (g.yil != null && !isNaN(+g.yil)) hepsi.push(g); }); });
      hepsi.sort(function (a, b) { return +a.yil - +b.yil; });
      if (!hepsi.length) { akis.appendChild(el('div', { class: 'bos', text: 'Yıl bilgisi olan görsel yok. Tıp tarihi gibi bir kitap için görsel paketi eklediğinde burada yıla göre dizilir.' })); return; }
      hepsi.forEach(function (g) { akis.appendChild(el('div', { class: 'zaman-satir' }, [el('div', { class: 'zaman-yil', text: yilYaz(g.yil) }), tarihKart(g)])); });
    });
  };
  paketler().then(function (l) { if (l.some(function (p) { return (p.gorseller || []).some(function (g) { return g.yil != null; }); })) { U.SEKMELER.push({ id: 'zaman', ad: 'Zaman', ikon: '⧗' }); U.sekmeleriCiz(); } });
})();
