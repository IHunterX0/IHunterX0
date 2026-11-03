/* 1001 — Komite sınavları ve "sıradaki sınav" (kullanıcı, 2026-11-03: "benim sınavlarım komite şeklinde, tüm dersleri aynı gün test
   şeklinde alıyoruz"; "çıkmış tahmininde vize ve final ayrılsın").
   - Plan sayfasına "Komite sınavları" kutusu: tarih + tür (Vize/Final). Kaydedilince en yakın komitenin tarihi TÜM derslerin sınav
     tarihi olur (mevcut planlayıcı böylece komiteye göre dağıtır).
   - U.siradakiSinav() → {tarih, tur:'Vize'|'Final'|'hepsi', gun, ad}. Reels sırası, ders programı, çalışma önerisi ve Tahmin sayfası
     artık vize+final karışımı yerine sıradaki sınavın türüne göre hesaplar. */
(function () {
  'use strict';
  if (/[?&]gomulu\b/.test(location.search)) return;
  var U = window.Uygulama; if (!U) return;
  var el = U.el, Depo = U.Depo;
  function bugun() { var d = new Date(); return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2); }
  function gunFark(t) { return Math.round((new Date(t + 'T00:00:00') - new Date(bugun() + 'T00:00:00')) / 864e5); }
  function siradaki(v) {
    var l = (v.komite || []).filter(function (k) { return k && k.tarih && gunFark(k.tarih) >= 0; }).sort(function (a, b) { return a.tarih < b.tarih ? -1 : 1; });
    return l[0] || null;
  }
  U.siradakiSinav = function () {
    return Depo.oku('plan').then(function (v) {
      var k = siradaki(v || {});
      if (k) return { tarih: k.tarih, tur: k.tur || 'Vize', gun: gunFark(k.tarih), ad: k.ad || ((k.tur || 'Vize') + ' komitesi'), komite: true };
      return { tarih: null, tur: (v && v.sinavTuru) || 'hepsi', gun: null, ad: '' };
    }).catch(function () { return { tur: 'hepsi' }; });
  };
  // sıradaki sınavın türü; ama o derste ayrı veri geriye dönük sınamada birleşikten kötüyse birleşik kullanılır (app15 U.ayrimSinama)
  U.cikmisTahminSirada = function (kitap) {
    return U.siradakiSinav().then(function (s) {
      var tur = s.tur || 'hepsi'; if (tur === 'hepsi' || !U.ayrimSinama) return U.cikmisTahmin(kitap, tur);
      return U.ayrimSinama(kitap, tur).then(function (x) { return U.cikmisTahmin(kitap, x.oneri); }, function () { return U.cikmisTahmin(kitap, tur); });
    });
  };
  function tumDerslereYay(v) {
    var k = siradaki(v); if (!k) return Promise.resolve(v);
    return U.Kitaplik.katalog().then(function (l) { v.sinav = v.sinav || {}; l.forEach(function (x) { v.sinav[x.id] = k.tarih; }); return v; });
  }

  var css = document.createElement('style');
  css.textContent = '.komite{margin:0 0 16px;padding:14px 16px;border-radius:20px;position:relative}.komite h3{margin:0 0 4px}.komite-satir{display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin:6px 0}' +
    '.komite-satir.yakin{box-shadow:inset 3px 0 0 #5ef0dc;padding-left:10px}.komite-satir .gun{font:700 12px var(--f-kod,monospace);color:#ffd38a;letter-spacing:.06em}';
  document.head.appendChild(css);

  var eskiPlan = U.GORUNUMLER.plan;
  U.GORUNUMLER.plan = function () {
    eskiPlan.apply(this, arguments);
    var form = document.querySelector('.plan-form'); if (!form) return;
    var kutu = el('section', { class: 'komite metin-kart' }, [el('h3', { text: '🗓 Komite sınavları' }),
      el('p', { class: 'var-etiket', text: 'Tüm dersler aynı gün test olarak soruluyorsa sınavlarını buraya gir. En yakın komitenin tarihi bütün derslerin sınav tarihi olur; tahmin, reels ve ders programı o sınavın türüne (vize/final) göre hesaplanır.' })]);
    form.parentNode.insertBefore(kutu, form);
    var liste = el('div'); kutu.appendChild(liste);
    function ciz(v) {
      liste.innerHTML = '';
      var l = (v.komite || []).slice().sort(function (a, b) { return a.tarih < b.tarih ? -1 : 1; }), yakin = siradaki(v);
      l.forEach(function (k, i) {
        var t = el('input', { type: 'date', value: k.tarih || '' }), tur = el('select', {}, ['Vize', 'Final'].map(function (x) { return el('option', { value: x, text: x, selected: k.tur === x ? true : null }); }));
        var ad = el('input', { type: 'text', value: k.ad || '', placeholder: 'ad (ör. 2. komite)', style: 'max-width:180px' });
        var g = k.tarih ? gunFark(k.tarih) : null;
        function kaydet() { guncelle(function (x) { x.komite = x.komite || []; var h = x.komite.filter(function (y) { return y.id === k.id; })[0]; if (h) { h.tarih = t.value; h.tur = tur.value; h.ad = ad.value; } }); }
        t.addEventListener('change', kaydet); tur.addEventListener('change', kaydet); ad.addEventListener('change', kaydet);
        liste.appendChild(el('div', { class: 'komite-satir' + (yakin && yakin.id === k.id ? ' yakin' : '') }, [t, tur, ad,
          el('span', { class: 'gun', text: g == null ? '' : g < 0 ? 'geçti' : g === 0 ? 'BUGÜN' : g + ' gün' }),
          el('button', { class: 'dugme kucuk', type: 'button', text: '✕', 'aria-label': 'Sil', onclick: function () { guncelle(function (x) { x.komite = (x.komite || []).filter(function (y) { return y.id !== k.id; }); }); } })]));
      });
      liste.appendChild(el('button', { class: 'dugme kucuk ana', type: 'button', text: '+ Komite ekle', onclick: function () { guncelle(function (x) { x.komite = x.komite || []; x.komite.push({ id: Date.now().toString(36), tarih: '', tur: (x.komite.length % 2) ? 'Final' : 'Vize', ad: '' }); }); } }));
    }
    function guncelle(fn) {
      return Depo.oku('plan').then(function (v) { fn(v); return tumDerslereYay(v); }).then(function (v) {
        return U.depoGuncelle('plan', function (d) { d.komite = v.komite; if (v.sinav) d.sinav = v.sinav; }, 200).then(function () { U.GORUNUMLER.plan(); });
      });
    }
    Depo.oku('plan').then(ciz);
  };
})();
