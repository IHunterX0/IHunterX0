/* C.A.R.V.I.S. — Derin düşünme modu (r144). Kullanıcı, 2026-11-08: "birbirleri arasında fikir takas etsinler, siyam ikizi
   beyinler gibi; harbi derin düşünme modu".
   İsteğe bağlı bir cevap modudur ("🧠 Derin" düğmesi ya da soruya "derin düşün:" diye başlamak). Ayarlardaki farklı
   sağlayıcılardan 2-3 model seçilir:
     Tur 1: her model soruyu bağımsız cevaplar (kitapta ilgili parça varsa hepsine aynı dayanak verilir).
     Tur 2: her model diğerlerinin cevabını okur, hata/eksik gösterir ve kendi cevabını günceller (fikir takası).
     Sentez: bir model ortak doğruları birleştirip tek cevap yazar; hâlâ anlaşmazlık varsa "Tartışmalı" diye belirtir.
   Kaynak: çoklu model tartışması (Du ve ark., 2023) ve katmanlı model karışımı (Wang ve ark., 2024).
   Maliyet: model sayısı × 2 + 1 çağrı; bu yüzden yalnız istendiğinde çalışır. */
(function () {
  'use strict';
  var U = window.Uygulama; if (!U) return;
  var el = U.el, HARF = 'ABC';
  function SG() { return window.yerelAyar && window.yerelAyar.saglayici; }
  function ad(k) { return String(k.m || '').split('/').pop(); }

  // Farklı sağlayıcılardan birer model; yetmezse aynı sağlayıcının başka modelleri
  function katilimcilar(n) {
    var sg = SG(); if (!sg || !sg.sor || !sg.liste) return [];
    var l = sg.liste().filter(function (x) { return x.acik !== false && (x.anahtar || x.tur === 'omniroute') && (x.modeller || []).some(sg.sohbetModeli); });
    var secim = [];
    function var_(m) { return secim.some(function (s) { return s.m === m; }); }
    l.forEach(function (x) { var m = x.modeller.filter(sg.sohbetModeli)[0]; if (secim.length < n && !var_(m)) secim.push({ x: x, m: m }); });
    l.forEach(function (x) { x.modeller.filter(sg.sohbetModeli).slice(1).forEach(function (m) { if (secim.length < n && !var_(m)) secim.push({ x: x, m: m }); }); });
    return secim;
  }
  function sor(k, mesajlar, o) {
    return SG().sor(Object.assign({}, k.x, { modeller: [k.m] }), mesajlar, { signal: o.signal, max_tokens: o.max_tokens });
  }
  function ayir(metin) {
    var i = metin.search(/(^|\n)\s*\**CEVAP\**\s*:/i);
    if (i < 0) return { elestiri: '', cevap: metin.trim() };
    return { elestiri: metin.slice(0, i).replace(/^\s*\**ELEŞTİRİ\**\s*:/i, '').trim(), cevap: metin.slice(i).replace(/^\s*\**CEVAP\**\s*:/i, '').trim() };
  }

  function calistir(soru, o) {
    o = o || {};
    var ilerle = o.ilerle || function () {};
    var kat = katilimcilar(o.adet || 3);
    if (kat.length < 2) return Promise.reject(new Error('Derin düşünme için ayarlarda en az iki çalışan model gerekiyor (farklı sağlayıcılar en iyisi). Carvis ayarları → sağlayıcılar → "📋 Model seç".'));
    var kitapP = U.kitapAra ? U.kitapAra(soru).then(function (r) { r = String(r || ''); return /^Sonuç yok/.test(r) ? '' : r.slice(0, 2500); }, function () { return ''; }) : Promise.resolve('');
    return kitapP.then(function (kitap) {
      var sistem = 'Bir tıp öğrencisinin (1. sınıf) sorusunu cevaplıyorsun. Türkçe, doğru ve açık yaz; terimlerin İngilizcesini parantezde ver. Emin olmadığın şeyi uydurma, "emin değilim" de.' +
        (kitap ? '\nKİTAPTAN İLGİLİ PARÇALAR (öncelikli dayanak; kaynak etiketlerini koru):\n' + kitap : '');
      ilerle('Tur 1: ' + kat.length + ' model bağımsız düşünüyor…');
      return Promise.all(kat.map(function (k) {
        return sor(k, [{ role: 'system', content: sistem }, { role: 'user', content: soru }], o).then(function (c) { return { k: k, c: c }; }, function (e) { return { k: k, hata: String(e && e.message || e).slice(0, 120) }; });
      })).then(function (t1) {
        var iyi = t1.filter(function (r) { return r.c && r.c.length > 20; });
        if (iyi.length < 2) {
          if (iyi.length === 1) return { metin: iyi[0].c, modeller: [ad(iyi[0].k)], tur: 1, t1: t1, t2: [], not: 'Diğer modeller cevap veremedi; bu tek modelin cevabı.' };
          throw new Error('Modeller cevap veremedi: ' + t1.map(function (r) { return ad(r.k) + ': ' + (r.hata || 'boş'); }).join('; '));
        }
        ilerle('Tur 2: modeller birbirinin cevabını okuyup fikir takas ediyor…');
        return Promise.all(iyi.map(function (r, i) {
          var digerleri = iyi.map(function (x, j) { return j === i ? null : 'MODEL ' + HARF[j] + ' CEVABI:\n' + x.c.slice(0, 2500); }).filter(Boolean).join('\n\n');
          return sor(r.k, [
            { role: 'system', content: sistem },
            { role: 'user', content: soru },
            { role: 'assistant', content: r.c },
            { role: 'user', content: 'Aynı soruya başka modeller de cevap verdi:\n\n' + digerleri + '\n\nOnların cevaplarını dikkatle oku: bir hata, eksik ya da senin atladığın doğru bir nokta var mı? Kendi cevabında yanlış bulursan düzelt; haklı olduğuna eminsen gerekçesiyle koru. Biçim: önce "ELEŞTİRİ:" başlığıyla 1-3 kısa madde, sonra "CEVAP:" başlığıyla güncellenmiş tam cevabın.' }
          ], o).then(function (c) { var a = ayir(c); return { k: r.k, ilk: r.c, elestiri: a.elestiri, cevap: a.cevap || r.c }; }, function () { return { k: r.k, ilk: r.c, elestiri: '', cevap: r.c }; });
        })).then(function (t2) {
          ilerle('Sentez: tek cevapta birleştiriliyor…');
          var metin = t2.map(function (r, i) { return 'MODEL ' + HARF[i] + ' (tartışmadan sonra):\n' + r.cevap.slice(0, 2500); }).join('\n\n');
          return sor(t2[0].k, [
            { role: 'system', content: sistem },
            { role: 'user', content: 'SORU: ' + soru + '\n\nAşağıda aynı soruya birkaç modelin, birbirinin cevabını okuyup tartıştıktan sonraki cevapları var:\n\n' + metin +
              '\n\nEn doğru ve eksiksiz TEK cevabı yaz: ortak doğruları birleştir, çelişkilerde kitap dayanağına ve gerekçesi güçlü olana uy. Modeller bir noktada hâlâ anlaşamıyorsa cevabın sonuna "⚠ Tartışmalı:" diye kısaca yaz. Model harflerinden söz etme; doğrudan öğrenciye yaz.' }
          ], o).then(function (s) { return s; }, function () { return t2[0].cevap; }).then(function (s) {
            return { metin: s || t2[0].cevap, modeller: t2.map(function (r) { return ad(r.k); }), tur: 2, t1: t1, t2: t2, kitap: !!kitap };
          });
        });
      });
    });
  }

  // "Düşünce takası" ayrıntısı: modellerin ilk cevapları ve birbirine yönelttikleri eleştiriler
  function ayrinti(r) {
    var d = el('details', { class: 'cv-derin', style: 'margin-top:8px;font-size:13px' }, [el('summary', { style: 'cursor:pointer', text: '🧠 Düşünce takası (' + r.modeller.join(', ') + ')' })]);
    if (r.not) d.appendChild(el('p', { class: 'var-etiket', text: r.not }));
    (r.t2.length ? r.t2 : r.t1.filter(function (x) { return x.c; }).map(function (x) { return { k: x.k, ilk: x.c, elestiri: '' }; })).forEach(function (x, i) {
      var ilk = el('div', { style: 'opacity:.85' }); ilk.innerHTML = U.mdHtml(String(x.ilk || '').slice(0, 900) + (String(x.ilk || '').length > 900 ? '…' : ''));
      d.appendChild(el('div', { style: 'border-top:1px solid var(--cizgi);padding:6px 0' }, [
        el('b', { text: 'Model ' + HARF[i] + ' · ' + ad(x.k) }),
        el('div', { class: 'var-etiket', text: 'İlk cevabı:' }), ilk,
        x.elestiri ? el('div', { class: 'var-etiket', text: 'Diğerlerine bakınca: ' + x.elestiri.slice(0, 500) }) : null]));
    });
    r.t1.filter(function (x) { return x.hata; }).forEach(function (x) { d.appendChild(el('p', { class: 'var-etiket', text: ad(x.k) + ' katılamadı: ' + x.hata })); });
    return d;
  }

  window.CarvisDerin = { calistir: calistir, ayrinti: ayrinti, katilimcilar: katilimcilar };
})();
