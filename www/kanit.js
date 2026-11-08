/* Kanıt denetimi (r131): bir yanıttaki her iddia (cümle) kitapta destek buluyor mu?
   Her cümle için içerik kelimeleri kitapta_ara ile aranır; sonuçların metninde kelimelerin çoğu geçiyorsa "destekli" sayılır.
   Yanıt üretimine bağlanmadan da çağrılabilir: U.kanitDenetle(metin) -> [{cumle, destekli, kaynak}]. */
(function () {
  'use strict';
  var U = window.Uygulama; if (!U) return;
  var DURDUR = { ve: 1, veya: 1, ile: 1, bir: 1, bu: 1, şu: 1, da: 1, de: 1, için: 1, olan: 1, gibi: 1, daha: 1, çok: 1, en: 1, ise: 1, ama: 1, fakat: 1, çünkü: 1, değil: 1, her: 1, hem: 1, sonra: 1, önce: 1 };
  function katla(s) { return String(s || '').toLocaleLowerCase('tr').replace(/[^\p{L}\p{N} ]/gu, ' '); }
  function cumleler(metin) {
    return String(metin || '').replace(/\s+/g, ' ').split(/(?<=[.!?])\s+/).map(function (c) { return c.trim(); }).filter(function (c) { return c.length >= 40; });
  }
  function icerik(c) {
    return katla(c).split(/\s+/).filter(function (w) { return w.length >= 4 && !DURDUR[w]; });
  }
  function arac() { var l = (U.sohbetAraclari ? U.sohbetAraclari() : []).filter(function (a) { return a.name === 'kitapta_ara'; }); return l[0] || null; }

  // Bir cümle için kitapta destek: en uzun 4 içerik kelimesini ara, dönen metinlerde kelimelerin %60'ı geçsin.
  function destekBul(c, kitap) {
    var kel = icerik(c).sort(function (a, b) { return b.length - a.length; }).slice(0, 6);
    var a = arac();
    if (!kel.length || !a) return Promise.resolve({ destekli: false, kaynak: '' });
    // Üç kelime ikilisiyle ara (tek bir uzun sorgu çoğu zaman hiç sonuç vermez); sonuçları birleştir.
    var ikililer = [kel.slice(0, 2), kel.slice(2, 4), kel.slice(4, 6)].filter(function (x) { return x.length; });
    var sonuclar = [];
    return ikililer.reduce(function (p, ik) {
      return p.then(function () {
        return Promise.resolve(a.execute({ sorgu: ik.join(' '), kitap: kitap || undefined })).then(function (s) {
          if (Array.isArray(s)) s.forEach(function (x) { sonuclar.push(x); });
        }, function () {});
      });
    }, Promise.resolve()).then(function () {
      var esik = Math.max(2, Math.ceil(kel.length * 0.5));
      for (var i = 0; i < sonuclar.length; i++) {
        var m = katla(sonuclar[i].metin), say = 0;
        kel.forEach(function (w) { if (m.indexOf(w) >= 0) say++; });
        if (say >= esik) return { destekli: true, kaynak: sonuclar[i].kaynak || '' };
      }
      return { destekli: false, kaynak: '' };
    });
  }

  U.kanitDenetle = function (metin, kitap) {
    var liste = cumleler(metin);
    return liste.reduce(function (p, c) {
      return p.then(function (out) { return destekBul(c, kitap).then(function (d) { out.push({ cumle: c, destekli: d.destekli, kaynak: d.kaynak }); return out; }); });
    }, Promise.resolve([]));
  };
})();
