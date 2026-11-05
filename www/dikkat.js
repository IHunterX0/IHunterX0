/* Dikkat kancası (r113). Ders okurken dikkati tutan iki kanca. Kapatmak: ⚙ Carvis ayarları → Tasarım ve dikkat.
   1) Ön soru: bölümün başında o bölümden bir soru; cevabı hemen görürsün (okumadan önce denemek öğrenmeyi artırır).
   2) Kaldığın yer: uygulamaya dönünce, son okunan bölüm için bir cümleyle ne hatırladığını sorar (geri çağırma).
   Veri: localStorage 'dikkat_cevap' (ön soru yanıtları) ve 'dikkat_son' (son okunan yer); sessionStorage 'dikkat_gorulen';
   Depo 'dikkat_hatirla' (hatırlama cümleleri). */
(function () {
  'use strict';
  var U = window.Uygulama; if (!U) return;
  var el = U.el;
  var CEVAP = 'dikkat_cevap', SON = 'dikkat_son', ARA_MS = 90000;

  function acik() { try { return localStorage.getItem('dikkat_kanca') !== '0'; } catch (e) { return true; } }
  // Uygulamanın rota kuralıyla aynı (app.js yonlendir): kitap kimliği tire içerebilir ("tip-tarihi")
  function okuCoz(h) {
    var m = /^#oku-([a-z0-9-]+?)-(\d+)(?:-(\d+))?$/.exec(h || '');
    return m ? { kid: m[1], sira: +m[2] } : null;
  }
  function jget(k, d) { try { return JSON.parse(localStorage.getItem(k) || 'null') || d; } catch (e) { return d; } }
  function jset(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  function gorulen() { try { return JSON.parse(sessionStorage.getItem('dikkat_gorulen') || '[]'); } catch (e) { return []; } }
  function gorulenEkle(k) { try { var l = gorulen(); if (l.indexOf(k) < 0) l.push(k); sessionStorage.setItem('dikkat_gorulen', JSON.stringify(l)); } catch (e) {} }
  // soru kimliği: veride kimlik yoksa soru metninden türet (cevap kayıtları karışmasın)
  function qid(q) {
    if (q.id) return String(q.id);
    var v = (q.varyantlar || [])[0] || {};
    return q.bolum + ':' + String(v.govde || '').replace(/<[^>]+>/g, '').slice(0, 80);
  }
  // Kitaplik çağrıları eşzamanlı istisna da fırlatabilir (bilinmeyen kitap kimliği): hepsi söz zincirine alınır
  function kitapAl(kid) { return Promise.resolve().then(function () { return U.Kitaplik.ac(kid); }); }
  function sorulariAl(kid) { return Promise.resolve().then(function () { return U.Kitaplik.sorular(kid); }).catch(function () { return []; }); }

  // son okunan yer: görünürken düzenli yazılır, gizlenirken son an yazılır (arka plan sayaçları yanıltmasın)
  function yerKaydet(zorla) {
    if ((zorla || !document.hidden) && okuCoz(location.hash)) jset(SON, { hash: location.hash, t: Date.now() });
  }
  setInterval(function () { yerKaydet(false); }, 20000);
  window.addEventListener('hashchange', function () { yerKaydet(false); });
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) yerKaydet(true); else setTimeout(geriDon, 500);
  });
  yerKaydet(false);

  // 1) ön soru: bölüm başında, her bölüm için oturumda bir kez; cevabı verilen soru tekrar gelmez
  function onSoru() {
    if (!acik()) return;
    var y = okuCoz(location.hash), ana = document.getElementById('ana');
    if (!y || !ana || ana.querySelector('.dk-kart') || gorulen().indexOf(y.kid + ':' + y.sira) >= 0) return;
    kitapAl(y.kid).then(function (kj) {
      var b = kj && kj.bolumler && kj.bolumler[y.sira];
      if (!b) return null;
      return sorulariAl(y.kid).then(function (sorular) { return { b: b, sorular: sorular || [] }; });
    }).then(function (r) {
      var simdi = okuCoz(location.hash);
      if (!r || !ana.isConnected || ana.querySelector('.dk-kart') || !simdi || simdi.kid !== y.kid || simdi.sira !== y.sira) return;
      var cevapl = jget(CEVAP, {});
      var q = null, v = null;
      (r.sorular || []).some(function (x) {
        if (!x || x.bolum !== r.b.id || cevapl[qid(x)]) return false;
        var g = (x.varyantlar || []).filter(function (w) { return w && w.siklar && w.siklar.length && w.cevap; })[0];
        if (!g) return false;
        q = x; v = g; return true;
      });
      if (!q) return;
      var geri = el('p', { class: 'var-etiket' });
      var kart = el('div', { class: 'dk-kart', role: 'region', 'aria-label': 'Ön soru' }, [
        el('div', { class: 'dk-etiket', text: 'Ön soru · bu bölümden' }),
        el('div', { class: 'dk-soru', html: v.govde })
      ]);
      v.siklar.forEach(function (s) {
        kart.appendChild(el('button', { class: 'dugme kucuk', type: 'button', html: '<b>' + s.h + ')</b> ' + s.m, onclick: function () {
          if (kart.dataset.bitti) return; kart.dataset.bitti = '1';
          var dogru = s.h === v.cevap;
          var c = v.siklar.filter(function (z) { return z.h === v.cevap; })[0];
          geri.textContent = (dogru ? 'Doğru. ' : 'Doğru cevap: ' + v.cevap + ') ' + (c ? c.m : '') + '. ') + 'Bölümü okurken bunu kontrol et.';
          var c2 = jget(CEVAP, {}); c2[qid(q)] = { t: Date.now(), dogru: dogru }; jset(CEVAP, c2);
        } }));
      });
      kart.appendChild(geri);
      kart.appendChild(el('button', { class: 'cip', type: 'button', text: 'Gizle', onclick: function () { kart.remove(); } }));
      var metin = ana.querySelector('.metin');
      if (metin && metin.parentNode) metin.parentNode.insertBefore(kart, metin); else ana.insertBefore(kart, ana.firstChild);
      gorulenEkle(y.kid + ':' + y.sira);
    }).catch(function () {});
  }

  // 2) kaldığın yer: uygulamaya dönünce son bölüm için bir cümle sorar (geri çağırma)
  function geriDon() {
    if (!acik() || document.hidden || !okuCoz(location.hash) || document.querySelector('.dk-kanca')) return;
    var s = jget(SON, null);
    if (!s || !s.hash || Date.now() - (s.t || 0) < ARA_MS) return;
    var y = okuCoz(s.hash); if (!y) return;
    jset(SON, { hash: s.hash, t: Date.now() }); // bir sonraki gösterim için yeniden ARA_MS kadar uzakta kalmak gerekir
    kitapAl(y.kid).then(function (kj) {
      var b = kj && kj.bolumler && kj.bolumler[y.sira];
      if (!b || document.querySelector('.dk-kanca')) return;
      var ad = b.kisa || b.baslik || 'bu bölüm';
      var ta = el('textarea', { rows: '2', 'aria-label': 'Bir cümleyle hatırla', style: 'width:100%;background:var(--zemin);color:var(--metin);border:1px solid var(--cizgi);border-radius:10px;padding:8px;font:14px/1.5 var(--f-govde)' });
      var kart = el('div', { class: 'dk-kart dk-kanca', role: 'dialog', 'aria-label': 'Kaldığın yer' }, [
        el('div', { class: 'dk-etiket', text: 'Kaldığın yer' }),
        el('div', { class: 'dk-soru', text: ad + ': ne hatırlıyorsun? Bir cümleyle yaz.' }),
        ta,
        el('div', { style: 'display:flex;gap:8px;margin-top:10px;flex-wrap:wrap' }, [
          el('button', { class: 'dugme ana kucuk', type: 'button', text: 'Kaydet', onclick: function () {
            var cumle = ta.value.trim();
            if (cumle) {
              U.depoGuncelle('dikkat_hatirla', function (v) { v.liste = (v.liste || []).concat([{ hash: s.hash, cumle: cumle.slice(0, 300), t: Date.now() }]).slice(-80); }, 300);
              U.toast('Kaydedildi.');
            }
            kart.remove();
          } }),
          el('button', { class: 'dugme kucuk', type: 'button', text: 'Şimdilik geç', onclick: function () { kart.remove(); } })
        ])
      ]);
      document.body.appendChild(kart);
    }).catch(function () {});
  }

  window.addEventListener('hashchange', function () { setTimeout(onSoru, 700); });
  setTimeout(onSoru, 1500);
  window.DikkatKancasi = { onSoru: onSoru, geriDon: geriDon, okuCoz: okuCoz, qid: qid };
})();
