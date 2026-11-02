/* 1001 — Eksikler: "Bilmiyorum" ve yanlış cevaplar konu/bölüm bazında toplanır; seviye ölçümleri ve test sonuçlarıyla
   birleştirilip "nerede eksiğim var?" sorusuna (Carvis aracı: eksiklerim) ve plana kaynak olur. */
(function () {
  'use strict';
  var U = window.Uygulama; if (!U) return;
  var css = document.createElement('style');
  css.textContent = '.sik.bilmiyorum{border-style:dashed;opacity:.85}.sik.bilmiyorum.secildi{opacity:1;border-color:var(--uyari,#ffb547);color:var(--uyari,#ffb547)}';
  document.head.appendChild(css);

  // eksikler: { liste: [{kitap, bolum, sira, konu, soru, bilmiyor, kaynak, t}] } — en çok 400 kayıt
  U.eksikEkle = function (e) {
    e.t = Date.now();
    return U.depoGuncelle('eksikler', function (v) { v.liste = (v.liste || []).concat([e]).slice(-400); }, 400).catch(function () {});
  };
  // Konu/bölüm bazında zayıflık puanı: bilmiyorum 2, yanlış 1; son 30 günün kayıtları daha ağır
  U.eksikOzeti = function (kitap) {
    return Promise.all([U.Depo.oku('eksikler'), U.Depo.oku('seviye'), U.Kitaplik.katalog()]).then(function (r) {
      var l = (r[0].liste || []).filter(function (e) { return !kitap || e.kitap === kitap; });
      var simdi = Date.now(), gr = {};
      l.forEach(function (e) {
        var k = e.kitap + '|' + e.sira;
        var g = gr[k] = gr[k] || { kitap: e.kitap, bolum: e.bolum, sira: e.sira, puan: 0, bilmiyor: 0, yanlis: 0, konular: {}, ornek: [] };
        var agirlik = (e.bilmiyor ? 2 : 1) * (simdi - e.t < 30 * 864e5 ? 1.5 : 1);
        g.puan += agirlik; if (e.bilmiyor) g.bilmiyor++; else g.yanlis++;
        if (e.konu) g.konular[e.konu] = (g.konular[e.konu] || 0) + agirlik;
        if (g.ornek.length < 2 && e.soru) g.ornek.push(e.soru);
      });
      // seviye ölçümleri: düşük puanlı bölümler de eksik sayılır
      var sv = r[1] || {}, adlar = {};
      (r[2] || []).forEach(function (k) { adlar[k.id] = k.baslik; });
      var olcumler = [];
      Object.keys(sv).forEach(function (kid) {
        if (kitap && kid !== kitap) return;
        var o = (sv[kid] && sv[kid].olcum) || {};
        Object.keys(o).forEach(function (bid) { olcumler.push({ kitap: kid, bolumId: bid, puan: o[bid].puan, seviye: o[bid].seviye }); });
      });
      var liste = Object.keys(gr).map(function (k) { var g = gr[k]; g.konular = Object.keys(g.konular).sort(function (a, b) { return g.konular[b] - g.konular[a]; }).slice(0, 4); g.kitapAd = adlar[g.kitap] || g.kitap; return g; })
        .sort(function (a, b) { return b.puan - a.puan; });
      return { zayif: liste.slice(0, 8), olcumler: olcumler.filter(function (x) { return x.puan < 60; }).slice(0, 8), toplamKayit: l.length };
    });
  };
})();
