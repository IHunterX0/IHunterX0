/* Öğrenci modeli (r131): kavram bazlı hakimiyet, Bayesçi bilgi izleme (Corbett & Anderson, 1994).
   Her cevapta hakimiyet güncellenir: doğru cevap hakimiyeti artırır, yanlış cevap azaltır. Zayıf konular kurs planında ve Carvis istemlerinde kullanılır.
   Veri yalnızca bu cihazda (localStorage); sunucuya gitmez. */
(function () {
  'use strict';
  var U = window.Uygulama; if (!U) return;
  var ANAHTAR = 'ogrenci_model';
  var P0 = 0.3, OGRENME = 0.2, KAYMA = 0.1, TAHMIN = 0.25, USTA = 0.95;

  function oku() { try { return JSON.parse(localStorage.getItem(ANAHTAR) || '{}'); } catch (e) { return {}; } }
  function yaz(m) { try { localStorage.setItem(ANAHTAR, JSON.stringify(m)); } catch (e) {} }

  // Bir gözlem sonrası hakimiyet olasılığı (BKT güncellemesi).
  function guncelle(p, dogru) {
    var pObs = dogru
      ? (p * (1 - KAYMA)) / (p * (1 - KAYMA) + (1 - p) * TAHMIN)
      : (p * KAYMA) / (p * KAYMA + (1 - p) * (1 - TAHMIN));
    return pObs + (1 - pObs) * OGRENME;
  }

  var ogrenci = {
    // konu: "kitapId:bolumSirasi" gibi kararlı bir anahtar. dogru: true/false.
    kaydet: function (konu, dogru) {
      var m = oku(), k = m[konu] || { p: P0, n: 0, d: 0 };
      k.p = guncelle(k.p, !!dogru); k.n += 1; if (dogru) k.d += 1; k.t = Date.now();
      m[konu] = k; yaz(m); return k.p;
    },
    hakimiyet: function (konu) { var k = oku()[konu]; return k ? k.p : P0; },
    usta: function (konu) { return this.hakimiyet(konu) >= USTA; },
    // En zayıf n konu (en az denenmiş ve hakimiyeti düşük olanlar öne).
    zayifKonular: function (kitap, n) {
      var m = oku();
      return Object.keys(m).filter(function (k) { return k.indexOf(kitap + ':') === 0 && m[k].n > 0; })
        .sort(function (a, b) { return m[a].p - m[b].p; }).slice(0, n || 3)
        .map(function (k) { return { konu: k.split(':')[1], p: Math.round(m[k].p * 100) }; });
    },
    sifirla: function () { try { localStorage.removeItem(ANAHTAR); } catch (e) {} }
  };
  U.ogrenci = ogrenci;
})();
