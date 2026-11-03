/* 1001 — 🔮 Çıkmış tahmini (bu yıl hangi çıkmışlar gelebilir: geçmiş yıllardan geriye dönük sınanmış istatistik + yapay zekâ yorumu),
   🧭 Çalışma koçu (bugün ne yapayım: vadeli kartlar, plan, eksikler, yüksek olasılıklı çıkmışlar; bilimsel çalışma yöntemleri),
   📝 interaktif test (şıklı, anında geri bildirim, yanlışlar Eksikler'e) ve Sohbet'e yeni araçlar:
   test_hazirla, makale_bul, cikmis_tahmin, eksiklerim, calisma_onerisi, pomodoro. */
(function () {
  'use strict';
  var U = window.Uygulama, A = window.KitapAyristir; if (!U) return;
  var el = U.el, $ = U.$, esc = U.esc, toast = U.toast, Y = U.Y, Kitaplik = U.Kitaplik, Durum = U.Durum, Depo = U.Depo, katla = A.katla;
  var css = document.createElement('style');
  css.textContent = [
    '.tt-kutu{border:1px solid var(--cizgi);border-radius:var(--r);padding:10px 12px;margin:8px 0;background:rgba(255,255,255,.015)}',
    '.tt-ust{display:flex;gap:8px;align-items:center;justify-content:space-between;flex-wrap:wrap;margin-bottom:6px}.tt-ust b{color:var(--vurgu)}',
    '.tt-soru{margin:10px 0 4px;font-weight:600}.tt-soru small{font-weight:400;color:var(--metin-sonuk)}',
    '.tt-aciklama{font-size:13px;border-left:2px solid var(--vurgu);padding:4px 8px;margin:6px 0;color:var(--metin)}',
    '.tt-sonuc{font-weight:700;margin-top:8px}.tt-ilerleme{height:5px;border-radius:3px;background:rgba(255,255,255,.07);overflow:hidden}.tt-ilerleme i{display:block;height:100%;background:var(--iyi);transition:width .3s}',
    '.sohbet-test{display:block}.sohbet-cipler{display:flex;gap:6px;flex-wrap:wrap;margin:0 0 6px}.sohbet-cipler button{font-size:12px}',
    '.th-satir{border-top:1px solid var(--cizgi);padding:8px 0;display:grid;gap:4px}.th-ust{display:flex;gap:8px;align-items:center;flex-wrap:wrap}.th-ust .ad{flex:1;min-width:180px;font-weight:600}',
    '.th-yuzde{font:700 15px var(--f-kod);min-width:48px;text-align:right}.th-gecmis{display:flex;gap:3px;flex-wrap:wrap}.th-gecmis span{font:11px var(--f-kod);padding:0 4px;border-radius:3px;border:1px solid var(--cizgi);color:var(--metin-sonuk)}.th-gecmis span.var{border-color:var(--vurgu);color:var(--vurgu);background:rgba(79,224,255,.08)}',
    '.th-bolum{display:grid;grid-template-columns:minmax(120px,1.4fr) 3fr 46px;gap:8px;align-items:center;font-size:13px;margin:3px 0}.th-bolum .c{height:10px;border-radius:5px;background:rgba(255,255,255,.06);overflow:hidden}.th-bolum .c i{display:block;height:100%;background:linear-gradient(90deg,var(--vurgu),var(--iyi))}',
    '.th-kpi{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:8px;margin:10px 0}.th-kpi div{border:1px solid var(--cizgi);border-radius:var(--r);padding:8px 10px}.th-kpi b{display:block;font:700 22px var(--f-kod);color:var(--vurgu)}.th-kpi small{color:var(--metin-sonuk)}',
    '.koc-is{display:flex;gap:10px;align-items:center;flex-wrap:wrap;border:1px solid var(--cizgi);border-radius:var(--r);padding:8px 10px;margin:6px 0}.koc-is .ad{flex:1;min-width:200px}.koc-is small{display:block;color:var(--metin-sonuk)}',
    '.koc-yontem{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:8px}.koc-yontem > div{border:1px solid var(--cizgi);border-radius:var(--r);padding:8px 10px;font-size:13px}.koc-yontem b{display:block;margin-bottom:2px}'
  ].join('\n');
  document.head.appendChild(css);
  function bugunStr() { var d = new Date(); return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2); }
  function bolumSira(kj, bolumId) { for (var i = 0; i < kj.bolumler.length; i++) if (kj.bolumler[i].id === bolumId) return i; return +(String(bolumId || '').split('-')[1] || 0); }
  function kitapAd(kj) { return kj.baslik.replace(/^1001\s*/, ''); }

  /* ================= 📝 interaktif test ================= */
  // test: {id, baslik, sorular:[{soru, siklar:[..], dogru: index, aciklama?, aciklamaHtml?, kitap?, sira?, konu?, etiket?}]}
  U.testCiz = function (kap, test, o) {
    o = o || {};
    var kutu = el('div', { class: 'tt-kutu' }); kap.appendChild(kutu);
    var bar = el('i', { style: 'width:0%' });
    var sayac = el('small', { class: 'var-etiket' });
    kutu.appendChild(el('div', { class: 'tt-ust' }, [el('b', { text: '📝 ' + (test.baslik || 'Test') }), sayac]));
    kutu.appendChild(el('div', { class: 'tt-ilerleme' }, [bar]));
    var govde = el('div'); kutu.appendChild(govde);
    var cevaplanan = 0, dogru = 0, yanlislar = [], n = test.sorular.length;
    function guncelle() { sayac.textContent = cevaplanan + '/' + n + ' · ' + dogru + ' doğru'; bar.style.width = Math.round(cevaplanan / n * 100) + '%'; }
    test.sorular.forEach(function (q, i) {
      var blok = el('div');
      blok.appendChild(el('div', { class: 'tt-soru', html: (i + 1) + '. ' + (o.guvenliHtml ? q.soru : esc(q.soru)) + (q.etiket ? ' <small>(' + esc(q.etiket) + ')</small>' : '') }));
      var bitti = false;
      q.siklar.forEach(function (s, j) {
        var d = el('button', { class: 'sik', type: 'button' }, [el('span', { class: 'harf', text: 'ABCDEFG'[j] }), el('span', { html: o.guvenliHtml ? s : esc(s) })]);
        d.addEventListener('click', function () {
          if (bitti) return; bitti = true; cevaplanan++;
          var ok = j === q.dogru; if (ok) dogru++; else yanlislar.push(q);
          if (o.cevap) try { o.cevap(q, ok); } catch (e) {}
          d.classList.add(ok ? 'dogru' : 'yanlis');
          if (!ok && blok.querySelectorAll('.sik')[q.dogru]) blok.querySelectorAll('.sik')[q.dogru].classList.add('dogru');
          if (q.aciklama || q.aciklamaHtml) blok.appendChild(el('div', { class: 'tt-aciklama', html: q.aciklamaHtml || esc(q.aciklama) }));
          if (!ok && U.eksikEkle && q.kitap) U.eksikEkle({ kitap: q.kitap, bolum: q.bolumAd || '', sira: q.sira != null ? q.sira : 0, konu: q.konu || '', soru: String(U.duz ? U.duz(q.soru) : q.soru).slice(0, 160), bilmiyor: false, kaynak: o.kaynak || 'ai-test' });
          guncelle();
          if (cevaplanan === n) bitir();
        });
        blok.appendChild(d);
      });
      if (q.kitap && q.sira != null && U.okuHash) blok.appendChild(el('a', { class: 'var-etiket', href: '#' + U.okuHash(q.kitap, q.sira), text: '↗ kitapta aç', onclick: function () { if (q.blok) Durum.vurguBlok = q.blok; } }));
      govde.appendChild(blok);
    });
    function bitir() {
      var yuzde = Math.round(dogru / n * 100);
      kutu.appendChild(el('div', { class: 'tt-sonuc', text: 'Sonuç: ' + dogru + '/' + n + ' (%' + yuzde + ')' + (yuzde >= 80 ? ' — çok iyi.' : yuzde >= 50 ? ' — fena değil; yanlışlar Eksikler\'e eklendi.' : ' — bu konuya geri dön; yanlışlar Eksikler\'e eklendi.') }));
      if (yanlislar.length) kutu.appendChild(el('button', { class: 'dugme kucuk', type: 'button', text: '↻ Yanlışları yeniden çöz', onclick: function () { U.testCiz(kap, { baslik: (test.baslik || 'Test') + ' · yanlışlar', sorular: yanlislar }, o); this.remove(); } }));
      if (test.id) U.depoGuncelle('testler', function (v) { if (v[test.id]) v[test.id].sonuc = { dogru: dogru, n: n, t: Date.now() }; }, 500);
      if (o.bitti) o.bitti(dogru, n);
    }
    guncelle();
    return kutu;
  };
  // Yapay zekâ testi: kitaptan bağlam (bölüm ya da arama) + aynı konudaki çıkmış sorular örnek olarak → 5 şıklı sorular
  function aracBul(ad) { return (U.sohbetAraclari ? U.sohbetAraclari() : []).filter(function (t) { return t.name === ad; })[0]; }
  function benzerCikmislar(kitap, konu, adet) {
    if (!kitap) return Promise.resolve([]);
    var q = katla(konu || ''); if (q.length < 3) return Promise.resolve([]);
    var kel = q.split(' ').filter(function (w) { return w.length > 3; });
    return Kitaplik.sorular(kitap).then(function (l) {
      var p = [];
      l.forEach(function (s) { var v = (s.varyantlar || [])[0]; if (!v || !v.siklar) return; var t = katla((s.konu || '') + ' ' + (U.duz ? U.duz(v.govde || '') : '')); var puan = kel.filter(function (w) { return t.indexOf(w) >= 0; }).length; if (puan) p.push({ puan: puan, s: s, v: v }); });
      return p.sort(function (a, b) { return b.puan - a.puan; }).slice(0, adet || 3).map(function (x) { return (U.duz ? U.duz(x.v.govde) : x.v.govde) + ' ' + x.v.siklar.map(function (k) { return k.h + ') ' + k.m; }).join(' ') + ' [Cevap ' + x.v.cevap + ']'; });
    }).catch(function () { return []; });
  }
  U.testUret = function (g) {
    g = g || {};
    var sayi = Math.max(3, Math.min(15, +g.sayi || 5)), kitap = g.kitap || (Durum.aktifKitap && Durum.aktifKitap.id) || null, konu = String(g.konu || '').trim();
    var bag;
    if (g.bolum_no && kitap) bag = Promise.resolve().then(function () { return aracBul('bolum_getir').execute({ kitap: kitap, no: String(g.bolum_no) }); }).then(function (r) { return { metin: r.metin, baslik: r.baslik, kaynak: r.kaynak }; });
    else if (!konu && Durum.aktifKitap && Durum.aktifBolum) bag = Promise.resolve({ metin: (Durum.aktifBolum.altlar || []).map(function (a) { return (a.baslik || '') + '\n' + (U.altMetin ? U.altMetin(a, 1400) : ''); }).join('\n\n').slice(0, 9000), baslik: Durum.aktifBolum.kisa || Durum.aktifBolum.baslik, sira: Durum.aktifBolum.sira });
    else bag = Promise.resolve().then(function () { return aracBul('kitapta_ara').execute({ sorgu: konu.split(/\s+/).slice(0, 2).join(' '), kitap: kitap || undefined }); }).then(function (r) {
      if (!Array.isArray(r)) return { metin: '', baslik: konu };
      if (r[0] && !kitap) kitap = r[0].kitap;
      var m = /\[kaynak:[^|]+\|(\d+)\|/.exec(r[0] ? r[0].kaynak : ''); return { metin: r.map(function (x) { return x.konum + ': ' + x.metin; }).join('\n\n'), baslik: konu, sira: m ? +m[1] : null };
    }).catch(function () { return { metin: '', baslik: konu }; });
    return Promise.all([bag, benzerCikmislar(kitap, konu || (Durum.aktifBolum && Durum.aktifBolum.kisa) || '', 3)]).then(function (r) {
      var b = r[0] || {}, ornek = r[1];
      var zorluk = g.zorluk === 'kolay' ? 'çoğu temel tanım/ezber' : g.zorluk === 'zor' ? 'çoğu mekanizma, iki bilgiyi birleştirme, klinik vaka' : 'karışık: 1/3 temel, 1/3 ilişki kurma, 1/3 mekanizma/klinik';
      var istem = 'Tıp fakültesi sınavı için ' + sayi + ' soruluk çoktan seçmeli Türkçe test hazırla. Konu: ' + (konu || b.baslik || 'açık bölüm') + '.\n' +
        'Kurallar: Her soruda 5 şık (A-E), tek doğru. Zorluk: ' + zorluk + '. Şıklar aynı türden ve inandırıcı olsun (tuzak şıklar sık karıştırılan kavramlardan). "Hepsi/hiçbiri" kullanma. ' +
        (b.metin ? 'Sorular ÖNCELİKLE aşağıdaki kitap metnine dayansın; metinde olmayan ayrıntı sorma. ' : 'Kitap metni bulunamadı; standart tıp kaynaklarına dayan. ') +
        'Her sorunun "aciklama" alanında doğru cevabın nedenini ve en güçlü çeldiricinin neden yanlış olduğunu 1-2 cümleyle yaz. Doğru şıkkın yeri sorudan soruya değişsin.\n' +
        (ornek.length ? 'Bu dersin gerçek çıkmış sorularından örnekler (üslubu taklit et, aynısını sorma):\n- ' + ornek.join('\n- ') + '\n' : '') +
        'Yalnız JSON: {"baslik":"kısa test adı","sorular":[{"soru":"...","siklar":["...","...","...","...","..."],"dogru":0-4,"aciklama":"...","konu":"2-4 kelime"}]}' +
        (b.metin ? '\n\nKİTAP METNİ:\n"""\n' + String(b.metin).slice(0, 9000) + '\n"""' : '');
      return U.AI.hazir().then(function (ok) { if (!ok) throw { code: 'not_granted' }; return Y.sample.json(istem, { cache: false }); }).then(function (j) {
        var sorular = (j && j.sorular || []).filter(function (q) { return q && q.soru && Array.isArray(q.siklar) && q.siklar.length >= 3 && q.dogru >= 0 && q.dogru < q.siklar.length; }).slice(0, sayi)
          .map(function (q) { return { soru: String(q.soru), siklar: q.siklar.map(String), dogru: +q.dogru, aciklama: String(q.aciklama || ''), konu: String(q.konu || konu || ''), kitap: kitap, sira: b.sira != null ? b.sira : null, bolumAd: b.baslik || '' }; });
        if (!sorular.length) throw new Error('Yapay zekâ geçerli soru üretemedi; yeniden dene.');
        var test = { id: 't' + Date.now().toString(36), baslik: String(j.baslik || konu || b.baslik || 'Test'), sorular: sorular, t: Date.now(), kitap: kitap };
        return U.depoGuncelle('testler', function (v) { v[test.id] = test; var k = Object.keys(v).sort(function (a, c) { return (v[a].t || 0) - (v[c].t || 0); }); while (k.length > 30) delete v[k.shift()]; }, 300).then(function () { return test; });
      });
    });
  };
  // Sohbet mesajındaki [test:ID] yer tutucularını interaktif teste çevirir
  U.testBagla = function (kok) {
    [].forEach.call(kok.querySelectorAll('.sohbet-test[data-test]'), function (d) {
      if (d._bagli) return; d._bagli = true;
      Depo.oku('testler').then(function (v) { var t = v[d.dataset.test]; d.innerHTML = ''; if (!t) { d.appendChild(el('p', { class: 'var-etiket', text: 'Test bulunamadı (silinmiş olabilir).' })); return; } U.testCiz(d, t); });
    });
  };
  var sonTestler = [];
  // Sohbet cevabı bitince: araçla test üretildi ama model [test:ID] yazmayı unuttuysa ekle
  U.sohbetSonrasi = function (metin) {
    var ek = sonTestler.filter(function (id) { return String(metin).indexOf('[test:' + id + ']') < 0; }).map(function (id) { return '[test:' + id + ']'; });
    sonTestler = [];
    return ek.length ? String(metin || '') + '\n\n' + ek.join('\n') : metin;
  };

  /* ================= 🔮 çıkmış tahmini ================= */
  // Birim: ALT BÖLÜM (konu). Aynı sorunun yıllar içinde birebir tekrarı seyrek (biyokimyada hiç yok), konu düzeyinde
  // tekrar belirgin. Puan: konunun geçmiş yıllarda çıkışı, yıllık %15 azalan ağırlıkla (o yıl çok soru geldiyse biraz daha ağır).
  // 4 kitapta 2023-2025 geriye dönük sınamasında en iyi yöntem buydu (AUC ~0,63; aile düzeyi ~0,55, düz sayım 0,60).
  // Yüzde: aynı puanın geçmiş yıllardaki gerçek çıkma oranından (puan dilimleri) kalibre edilir.
  function sinavCoz(s) { var m = /^(\d{2})-(\d{2})\s+(Vize|Final|Bütünleme|But)/i.exec(String(s || '')); return m ? { yil: 2000 + +m[1], tur: /vize/i.test(m[3]) ? 'Vize' : /final/i.test(m[3]) ? 'Final' : 'Büt' } : null; }
  var AZALMA = 0.85;
  function puan(yillar, y) { var t = 0; for (var k in yillar) if (+k < y) t += Math.pow(AZALMA, y - 1 - k) * (1 + 0.3 * Math.min(3, yillar[k])); return t; }
  function onceVar(u, y) { for (var k in u.yillar) if (+k < y) return true; return false; }
  function birimler(kj, sorular, tur) {
    var altAd = {}; kj.bolumler.forEach(function (b, i) { (b.altlar || []).forEach(function (a) { altAd[a.id] = (a.no ? a.no + ' ' : '') + String(a.baslik || '').replace(/^\d+(\.\d+)*\s*/, ''); }); });
    var g = {};
    sorular.forEach(function (q) {
      if (q.deneme) return;
      var yillar = {};
      (q.varyantlar || []).forEach(function (v) { var s = sinavCoz(v.sinav); if (!s || (tur !== 'hepsi' && s.tur !== tur)) return; yillar[s.yil] = (yillar[s.yil] || 0) + 1; });
      if (!Object.keys(yillar).length) return;
      var anahtar = q.alt || q.bolum, sira = bolumSira(kj, q.bolum), b = kj.bolumler[sira] || {};
      var u = g[anahtar] = g[anahtar] || { alt: anahtar, konu: altAd[q.alt] || q.konu || b.kisa || '', bolum: b.kisa || b.baslik || '', sira: sira, blok: q.blok, yillar: {}, aileler: [] };
      Object.keys(yillar).forEach(function (y) { u.yillar[y] = (u.yillar[y] || 0) + yillar[y]; });
      u.aileler.push({ q: q, yillar: yillar });
    });
    return Object.keys(g).map(function (k) { return g[k]; });
  }
  // puan → olasılık: geçmiş yıllar (sinir öncesi) için 3-6 puan dilimindeki çıkma oranı, düzleştirilmiş ve monoton
  function kalibre(l, yillar, sinir) {
    var cift = [];
    yillar.forEach(function (y, i) { if (i === 0 || y >= sinir) return; l.forEach(function (u) { if (onceVar(u, y)) cift.push([puan(u.yillar, y), u.yillar[y] ? 1 : 0]); }); });
    if (cift.length < 8) return function () { return 0.3; };
    cift.sort(function (a, b) { return a[0] - b[0]; });
    var taban = cift.reduce(function (t, c) { return t + c[1]; }, 0) / cift.length, dilim = [], n = Math.max(3, Math.min(6, Math.floor(cift.length / 20)));
    for (var d = 0; d < n; d++) { var p = cift.slice(Math.floor(d * cift.length / n), Math.floor((d + 1) * cift.length / n)); var h = p.reduce(function (t, c) { return t + c[1]; }, 0); dilim.push({ alt: p.length ? p[0][0] : 0, ust: p.length ? p[p.length - 1][0] : 0, oran: (h + 3 * taban) / (p.length + 3) }); }
    for (var j = 1; j < n; j++) dilim[j].oran = Math.max(dilim[j].oran, dilim[j - 1].oran);
    return function (s) { // dilim ortaları arasında doğrusal
      var o = dilim.map(function (x) { return [(x.alt + x.ust) / 2, x.oran]; });
      if (s <= o[0][0]) return o[0][1]; if (s >= o[n - 1][0]) return o[n - 1][1];
      for (var k = 1; k < n; k++) if (s <= o[k][0]) { var t = (s - o[k - 1][0]) / ((o[k][0] - o[k - 1][0]) || 1); return o[k - 1][1] + t * (o[k][1] - o[k - 1][1]); }
      return o[n - 1][1];
    };
  }
  U.cikmisTahmin = function (kitap, tur) {
    tur = tur || 'hepsi';
    return Promise.all([Kitaplik.ac(kitap), Kitaplik.sorular(kitap)]).then(function (r) {
      var kj = r[0], l = birimler(kj, r[1], tur);
      var yillar = {}; l.forEach(function (u) { Object.keys(u.yillar).forEach(function (y) { yillar[y] = 1; }); });
      yillar = Object.keys(yillar).map(Number).sort();
      if (yillar.length < 3) return { kitap: kitap, yok: true, mesaj: 'Bu kitapta yıl bilgili yeterli çıkmış soru yok (en az 3 yıl gerekir).' };
      var son = yillar[yillar.length - 1], hedefYil = son + 1;
      // geriye dönük sınama: son 3 yılın her biri yalnız öncesindeki verilerle tahmin edilir
      var isabet = 0, K = 0, rastgele = 0, sinanan = [];
      yillar.slice(-3).forEach(function (y) {
        var aday = l.filter(function (u) { return onceVar(u, y); }).map(function (u) { return { u: u, s: puan(u.yillar, y) }; }).sort(function (a, b) { return b.s - a.s; });
        var cikan = aday.filter(function (x) { return x.u.yillar[y]; }).length; if (!aday.length) return;
        var k = Math.max(5, cikan); K += k; isabet += aday.slice(0, k).filter(function (x) { return x.u.yillar[y]; }).length; rastgele += cikan / aday.length * k; sinanan.push(y);
      });
      // son yılın sorularının yüzde kaçının konusu daha önce de sorulmuştu?
      var sonTop = 0, sonTekrar = 0; l.forEach(function (u) { if (u.yillar[son]) { sonTop += u.yillar[son]; if (onceVar(u, son)) sonTekrar += u.yillar[son]; } });
      var kal = kalibre(l, yillar, hedefYil);
      var tahmin = l.map(function (u) {
        var s = puan(u.yillar, hedefYil), ys = Object.keys(u.yillar);
        u.aileler.sort(function (a, b) { return puan(b.yillar, hedefYil) - puan(a.yillar, hedefYil); });
        return Object.assign(u, { puan: s, olasilik: kal(s), kez: ys.length, son: Math.max.apply(null, ys.map(Number)), soruYil: ys.reduce(function (t, y) { return t + u.yillar[y]; }, 0) / ys.length });
      }).sort(function (a, b) { return b.puan - a.puan; });
      // bölüm başına beklenen soru: konu beklentisi + yeni konu payı (geçmiş payına göre)
      var bolumSoru = {}, toplamSoru = 0;
      l.forEach(function (u) { Object.keys(u.yillar).forEach(function (y) { bolumSoru[u.sira] = (bolumSoru[u.sira] || 0) + u.yillar[y]; toplamSoru += u.yillar[y]; }); });
      var ortSoru = toplamSoru / yillar.length, beklenenEski = tahmin.reduce(function (t, x) { return t + x.olasilik * x.soruYil; }, 0), yeniPay = Math.max(0, ortSoru - beklenenEski);
      var bolumler = {};
      tahmin.forEach(function (x) { var o = bolumler[x.sira] = bolumler[x.sira] || { sira: x.sira, ad: x.bolum, tekrar: 0 }; o.tekrar += x.olasilik * x.soruYil; });
      Object.keys(bolumSoru).forEach(function (s) { var o = bolumler[s] = bolumler[s] || { sira: +s, ad: (kj.bolumler[s] || {}).kisa || '', tekrar: 0 }; o.pay = bolumSoru[s] / toplamSoru; o.beklenen = o.tekrar + yeniPay * o.pay; });
      return { kitap: kitap, kitapAd: kitapAd(kj), tur: tur, yillar: yillar, hedefYil: hedefYil, tahmin: tahmin, ortSoru: Math.round(ortSoru),
        bolumler: Object.keys(bolumler).map(function (k) { return bolumler[k]; }).filter(function (b) { return b.beklenen; }).sort(function (a, b) { return b.beklenen - a.beklenen; }),
        sinama: { yillar: sinanan, K: K, isabet: isabet, rastgeleIsabet: Math.round(rastgele * 10) / 10, yil: son, tekrarOrani: sonTop ? sonTekrar / sonTop : 0 } };
    });
  };
  function yilEtiket(y) { return String(y).slice(2) + '-' + String(y + 1).slice(2); }
  function sinamaMetni(s) { return s.yillar.map(yilEtiket).join(', ') + ' yılları geriye dönük tahmin edildi: önerilen ilk konuların ' + s.isabet + '/' + s.K + ' tanesi gerçekten çıktı (rastgele seçimle ~' + s.rastgeleIsabet + ')'; }
  function tahminAraci(g) {
    var kitap = g.kitap || (Durum.aktifKitap && Durum.aktifKitap.id) || 'anatomi';
    return U.cikmisTahmin(kitap, g.tur === 'Vize' || g.tur === 'Final' ? g.tur : 'hepsi').then(function (t) {
      if (t.yok) return t.mesaj;
      return { kitap: t.kitapAd, hedef_yil: yilEtiket(t.hedefYil), yontem: 'konu (alt bölüm) düzeyinde, geçmiş ' + t.yillar.length + ' yılın tekrar örüntüsü; ' + sinamaMetni(t.sinama) + '. Kesin değil, öncelik sırası.',
        konu_tekrar_orani: '%' + Math.round(t.sinama.tekrarOrani * 100) + ' (son yılın sorularından konusu önceki yıllarda da sorulmuş olanlar)',
        en_olasi_konular: t.tahmin.slice(0, 12).map(function (x) { return x.konu + ' (' + x.bolum.slice(0, 40) + ') %' + Math.round(x.olasilik * 100) + ', ' + x.kez + '/' + t.yillar.length + ' yıl çıktı, son ' + yilEtiket(x.son) + ', ' + x.aileler.length + ' farklı soru'; }),
        en_cok_soru_beklenen_bolumler: t.bolumler.slice(0, 6).map(function (b) { return b.ad.slice(0, 50) + ': ~' + b.beklenen.toFixed(1) + ' soru'; }),
        not: 'Ayrıntı ve tahmini deneme: 🔮 Tahmin sayfası.' };
    });
  }

  U.SEKMELER.push({ id: 'tahmin', ad: 'Tahmin', ikon: '🔮' });
  U.GORUNUMLER.tahmin = function (arg) {
    var ana = $('#ana'); ana.innerHTML = '';
    var sayfa = el('div', { class: 'sayfa' }); ana.appendChild(sayfa);
    sayfa.appendChild(el('div', { class: 'kahraman' }, [el('div', { class: 'ust-etiket', text: 'Çıkmış sorulardan' }), el('h1', { text: '🔮 Bu yıl ne çıkar?' }),
      el('p', { text: 'Her konunun (alt bölüm) geçmiş sınavlarda kaç yıl, kaç soruyla ve en son ne zaman sorulduğuna bakılır; yakın yıllar daha ağır sayılır. Yüzdeler, aynı puandaki konuların geçmişte ertesi yıl gerçekten çıkma oranıdır. Yöntem son üç yıla geriye dönük uygulanarak sınandı; isabet aşağıda. Kesin değil, öncelik sırası içindir. Her konunun altında o konunun çıkmış soruları çözülebilir.' })]));
    var kitapSec = el('select', { 'aria-label': 'Kitap' }), turSec = el('select', { 'aria-label': 'Sınav' });
    [['hepsi', 'Vize + Final'], ['Vize', 'Vize'], ['Final', 'Final']].forEach(function (x) { turSec.appendChild(el('option', { value: x[0], text: x[1] })); });
    var aiDug = el('button', { class: 'dugme kucuk', type: 'button', text: '✦ Yapay zekâ yorumu' }), denemeDug = el('button', { class: 'dugme kucuk ana', type: 'button', text: '🎯 Tahmini deneme (20 soru)' });
    sayfa.appendChild(el('div', { class: 'yp-dugmeler', style: 'align-items:center;flex-wrap:wrap' }, [kitapSec, turSec, denemeDug, aiDug]));
    var sonuc = el('div'); sayfa.appendChild(sonuc);
    Kitaplik.katalog().then(function (l) {
      l.forEach(function (k) { kitapSec.appendChild(el('option', { value: k.id, text: k.baslik, selected: (arg || (Durum.aktifKitap && Durum.aktifKitap.id)) === k.id ? true : null })); });
      ciz();
    });
    kitapSec.addEventListener('change', ciz); turSec.addEventListener('change', ciz);
    var T = null;
    function ciz() {
      sonuc.innerHTML = ''; sonuc.appendChild(el('div', { class: 'yukleniyor', text: 'Hesaplanıyor…' }));
      U.cikmisTahmin(kitapSec.value, turSec.value).then(function (t) {
        T = t; sonuc.innerHTML = '';
        if (t.yok) { sonuc.appendChild(el('p', { class: 'var-etiket', text: t.mesaj })); return; }
        var s = t.sinama;
        sonuc.appendChild(el('div', { class: 'th-kpi' }, [
          el('div', {}, [el('b', { text: yilEtiket(t.hedefYil) }), el('small', { text: 'tahmin edilen yıl · ' + t.yillar.length + ' yıllık veri' })]),
          el('div', {}, [el('b', { text: '%' + Math.round(s.tekrarOrani * 100) }), el('small', { text: yilEtiket(s.yil) + ' sorularından konusu daha önce de sorulmuş olanlar' })]),
          el('div', {}, [el('b', { text: s.isabet + '/' + s.K }), el('small', { text: 'geriye dönük sınama (' + s.yillar.map(yilEtiket).join(', ') + '): önerilen konulardan gerçekten çıkan · rastgele seçimle ~' + s.rastgeleIsabet })]),
          el('div', {}, [el('b', { text: '~' + t.ortSoru }), el('small', { text: 'yılda ortalama soru (' + (turSec.value === 'hepsi' ? 'vize+final' : turSec.value) + ')' })])]));
        var aiKap = el('div'); sonuc.appendChild(aiKap); T.aiKap = aiKap;
        sonuc.appendChild(el('h3', { text: 'Bölüm başına beklenen soru' }));
        var enCok = t.bolumler[0] ? t.bolumler[0].beklenen : 1;
        t.bolumler.slice(0, 12).forEach(function (b) {
          sonuc.appendChild(el('div', { class: 'th-bolum' }, [el('a', { href: '#' + U.okuHash(t.kitap, b.sira), text: b.ad || ('Bölüm ' + b.sira) }), el('div', { class: 'c' }, [el('i', { style: 'width:' + Math.round(b.beklenen / enCok * 100) + '%' })]), el('span', { text: '~' + b.beklenen.toFixed(1) })]));
        });
        sonuc.appendChild(el('h3', { text: 'En olası konular' }));
        var liste = el('div'); sonuc.appendChild(liste);
        var gosterilen = 0;
        function dahaCiz() {
          t.tahmin.slice(gosterilen, gosterilen + 25).forEach(function (x) { liste.appendChild(satir(t, x)); });
          gosterilen += 25; if (gosterilen < t.tahmin.length) liste.appendChild(el('button', { class: 'dugme kucuk', type: 'button', text: 'Daha fazla (' + (t.tahmin.length - gosterilen) + ')', onclick: function () { this.remove(); dahaCiz(); } }));
        }
        dahaCiz();
      }).catch(function (e) { sonuc.innerHTML = ''; sonuc.appendChild(el('p', { class: 'hata-metni', text: 'Hesaplanamadı: ' + (e.message || e) })); });
    }
    function satir(t, x) {
      var gec = el('div', { class: 'th-gecmis' });
      t.yillar.forEach(function (y) { gec.appendChild(el('span', { class: x.yillar[y] ? 'var' : '', title: x.yillar[y] ? x.yillar[y] + ' soru' : 'sorulmadı', text: yilEtiket(y) + (x.yillar[y] > 1 ? '×' + x.yillar[y] : '') })); });
      var ac = el('div', { hidden: true });
      var d = el('div', { class: 'th-satir' }, [
        el('div', { class: 'th-ust' }, [el('span', { class: 'th-yuzde', text: '%' + Math.round(x.olasilik * 100) }), el('span', { class: 'ad', text: x.konu }),
          el('button', { class: 'dugme kucuk', type: 'button', text: 'Soruları çöz (' + x.aileler.length + ')', onclick: function () { ac.hidden = !ac.hidden; if (!ac.children.length) U.testCiz(ac, { baslik: x.konu, sorular: konuSorulari(t.kitap, x, 8) }, { guvenliHtml: true, kaynak: 'tahmin' }); } }),
          el('a', { class: 'dugme kucuk', href: '#' + U.okuHash(t.kitap, x.sira), text: '↗', title: 'Kitapta aç', onclick: function () { Durum.vurguBlok = x.blok; } })]),
        el('small', { class: 'var-etiket', text: x.bolum + ' · ' + x.kez + '/' + t.yillar.length + ' yıl çıktı · son ' + yilEtiket(x.son) + ' · yılda ~' + x.soruYil.toFixed(1) + ' soru' }), gec, ac]);
      return d;
    }
    denemeDug.addEventListener('click', function () {
      if (!T || T.yok) return;
      var govde = U.panelAc('🎯 Tahmini deneme · ' + T.kitapAd, yilEtiket(T.hedefYil) + ' için en olası konulardan 20 soru');
      // en olası konulardan sırayla: önce her konudan 1, yetmezse 2. tur
      var sorular = [], tur = 0;
      while (sorular.length < 20 && tur < 3) { T.tahmin.slice(0, 30).forEach(function (x) { if (sorular.length < 20) { var q = konuSorulari(T.kitap, x, tur + 1)[tur]; if (q) sorular.push(q); } }); tur++; }
      govde.appendChild(el('p', { class: 'var-etiket', text: 'Her soru, o konunun en olası çıkmış sorusunun en son sorulan biçimi. Yanlışlar Eksikler\'e eklenir.' }));
      U.testCiz(govde, { baslik: 'Tahmini deneme', sorular: sorular }, { guvenliHtml: true, kaynak: 'tahmin' });
    });
    aiDug.addEventListener('click', function () { if (T && !T.yok) aiYorum(T, T.aiKap); });
  };
  // Konunun soru aileleri (en olası önce), her aileden en son sorulan biçim → test sorusu (kitap HTML'i güvenli kaynak)
  function konuSorulari(kitap, x, adet) {
    return x.aileler.slice(0, adet || 8).map(function (a) {
      var v = (a.q.varyantlar || []).filter(function (v) { return v.siklar && v.siklar.length && v.cevap; }).slice().sort(function (p, q) { var sp = sinavCoz(p.sinav), sq = sinavCoz(q.sinav); return (sq ? sq.yil : 0) - (sp ? sp.yil : 0); })[0];
      if (!v) return null;
      var d = 0; v.siklar.forEach(function (s, i) { if (s.h === v.cevap) d = i; });
      return { soru: v.govde, siklar: v.siklar.map(function (s) { return s.m; }), dogru: d, aciklamaHtml: a.q.cevapHtml || '', etiket: v.sinav, kitap: kitap, sira: x.sira, blok: a.q.blok, konu: a.q.konu || x.konu, bolumAd: x.bolum };
    }).filter(Boolean);
  }
  function aiYorum(t, kap) {
    var anahtar = 'tahminAI-' + t.kitap + '-' + t.tur;
    kap.innerHTML = ''; var kutu = el('div', { class: 'yp-cevap' }, [el('div', { class: 'yukleniyor', text: 'Yapay zekâ örüntüleri inceliyor…' })]); kap.appendChild(kutu);
    Depo.oku(anahtar).then(function (on) {
      if (on && on.gun === bugunStr() && on.j) return on.j;
      var ozet = t.tahmin.slice(0, 45).map(function (x) { return x.konu + ' | ' + x.bolum.slice(0, 40) + ' | yıllar: ' + Object.keys(x.yillar).map(function (y) { return yilEtiket(+y); }).join(',') + ' | model %' + Math.round(x.olasilik * 100); }).join('\n');
      var bol = t.bolumler.map(function (b) { return b.ad.slice(0, 50) + ': geçmiş pay %' + Math.round((b.pay || 0) * 100); }).join('\n');
      return U.AI.hazir().then(function (ok) { if (!ok) throw { code: 'not_granted' }; return Y.sample.json('Bir tıp fakültesinin ' + t.kitapAd + ' dersinde ' + yilEtiket(t.hedefYil) + ' sınavında (' + (t.tur === 'hepsi' ? 'vize+final' : t.tur) + ') hangi soruların çıkabileceğini tahmin ediyoruz. İstatistik modelin çıktısı aşağıda (aile = aynı konunun farklı yıllardaki soruları).\n' +
        'Görevin: örüntüleri yorumla (dönüşümlü sorulan konular, hiç atlanmayanlar, uzun süredir sorulmayıp sırası gelmiş olanlar, bölüm ağırlığındaki eğilim). Modelin gözden kaçırdığı olası durumları belirt. Uydurma istatistik yazma; yalnız verilenle konuş. Türkçe, kısa.\n' +
        'Yalnız JSON: {"genel":"2-3 cümle","yukselen":[{"konu":"listeden aynen","neden":"kısa"}],"sirasi_gelen":[{"konu":"listeden aynen","neden":"kısa"}],"strateji":"bu derse son hafta çalışma stratejisi, 2-3 cümle"}\n\nAİLELER (konu | bölüm | çıktığı yıllar | model):\n' + ozet + '\n\nBÖLÜM PAYLARI:\n' + bol, { cache: false }); })
        .then(function (j) { Depo.yaz(anahtar, { gun: bugunStr(), j: j }); return j; });
    }).then(function (j) {
      kutu.innerHTML = '';
      kutu.appendChild(el('p', { text: j.genel || '' }));
      function liste(bas, l) { if (!l || !l.length) return; kutu.appendChild(el('h4', { text: bas })); var u = el('ul'); l.slice(0, 6).forEach(function (x) { u.appendChild(el('li', {}, [el('b', { text: x.konu + ': ' }), String(x.neden || '')])); }); kutu.appendChild(u); }
      liste('📈 Yükselen / hep sorulan', j.yukselen); liste('⏳ Sırası gelmiş olabilir', j.sirasi_gelen);
      if (j.strateji) kutu.appendChild(el('p', {}, [el('b', { text: 'Strateji: ' }), String(j.strateji)]));
      kutu.appendChild(el('span', { class: 'etiket-kucuk ai', text: 'AI yorumu · istatistiğe dayanır, kesin değil' }));
    }).catch(function (e) { kutu.innerHTML = ''; kutu.appendChild(el('p', { class: 'hata-metni', text: e && e.code ? U.AI.hataMetni(e) : String(e.message || e) })); });
  }

  /* ================= 🧭 çalışma koçu ================= */
  function gunNo() { return Math.floor((Date.now() - new Date().getTimezoneOffset() * 60000) / 864e5); }
  function vadeliKart() {
    return Kitaplik.katalog().then(function (l) {
      return Promise.all(l.map(function (k) { return Depo.oku('srs-' + k.id).then(function (v) { var g = gunNo(), n = 0; Object.keys(v).forEach(function (x) { if (x[0] !== '_' && v[x][3] <= g) n++; }); return n; }); }));
    }).then(function (ns) { return ns.reduce(function (a, b) { return a + b; }, 0); }).catch(function () { return 0; });
  }
  U.calismaOnerisi = function () {
    var plan = U.planBugunListe ? U.planBugunListe().catch(function () { return null; }) : Promise.resolve(null);
    var eksik = U.eksikOzeti ? Promise.resolve(U.eksikOzeti(null)).catch(function () { return null; }) : Promise.resolve(null);
    var pom = U.Pomodoro ? U.Pomodoro.durum().catch(function () { return null; }) : Promise.resolve(null);
    return Promise.all([plan, eksik, vadeliKart(), pom, Depo.oku('plan')]).then(function (r) {
      var isler = [], plan = r[0], ek = r[1], vade = r[2], pm = r[3], ay = r[4] || {};
      // en yakın sınav
      var sinav = null; Object.keys(ay.sinav || {}).forEach(function (k) { var g = Math.round((new Date(ay.sinav[k] + 'T00:00:00') - new Date(bugunStr() + 'T00:00:00')) / 864e5); if (g >= 0 && (!sinav || g < sinav.gun)) sinav = { kitap: k, gun: g }; });
      if (vade) isler.push({ tur: 'kart', ad: vade + ' vadeli tekrar kartı', neden: 'Aralıklı tekrar: unutmadan hemen önce hatırlamak kalıcılığı en çok artıran adım. Güne bununla başla.', dk: Math.max(5, Math.round(vade * 0.4)), hash: 'kartlar' });
      (plan || []).filter(function (x) { return !x.tekrar; }).slice(0, 4).forEach(function (x) { isler.push({ tur: 'plan', ad: x.akademikGorev ? '🌍 ' + x.ad : (x.derin ? '🎓 ' : '') + x.kitapAd + ' · ' + x.ad, neden: 'Plan: ' + (x.neden || '') + (x.sinavaGun != null ? ' · sınava ' + x.sinavaGun + ' gün' : ''), dk: x.dk, kitap: x.kitap, sira: x.sira }); });
      ((ek && ek.zayif) || []).slice(0, 2).forEach(function (z) { isler.push({ tur: 'eksik', ad: 'Eksik kapat: ' + (z.kitapAd || z.kitap).replace(/^1001\s*/, '') + ' · ' + (z.bolum || ''), neden: z.bilmiyor + ' bilmiyorum, ' + z.yanlis + ' yanlış' + (z.konular && z.konular.length ? ' (' + z.konular.slice(0, 2).join(', ') + ')' : '') + '. Önce Zamanım yok özeti, sonra 5 soruluk test.', dk: 25, kitap: z.kitap, sira: z.sira, konu: (z.konular || [])[0] }); });
      var tah = sinav ? U.cikmisTahmin(sinav.kitap, 'hepsi').catch(function () { return null; }) : Promise.resolve(null);
      return tah.then(function (t) {
        if (t && !t.yok) isler.push({ tur: 'tahmin', ad: 'Yüksek olasılıklı konular: ' + t.kitapAd, neden: 'Sınava ' + sinav.gun + ' gün. En olası: ' + t.tahmin.slice(0, 3).map(function (x) { return x.konu + ' %' + Math.round(x.olasilik * 100); }).join(', ') + '.', dk: 20, hash: 'tahmin-' + t.kitap });
        return { isler: isler, sinav: sinav, pomodoro: pm, vadeli: vade };
      });
    });
  };
  function oneriAraci() {
    return U.calismaOnerisi().then(function (o) {
      return { en_yakin_sinav: o.sinav ? o.sinav.kitap + ', ' + o.sinav.gun + ' gün' : 'girilmemiş', bugun_calisilan_dk: o.pomodoro ? o.pomodoro.bugun_dakika : null, gunluk_hedef_dk: o.pomodoro ? o.pomodoro.gunluk_hedef_dk : null, seri_gun: o.pomodoro ? o.pomodoro.seri_gun : null,
        sirali_isler: o.isler.map(function (x, i) { return (i + 1) + '. ' + x.ad + ' (~' + x.dk + ' dk) — ' + x.neden; }) };
    });
  }
  var YONTEMLER = [
    { ad: 'Aktif hatırlama', metin: 'Okuduktan sonra kitabı kapatıp kendini test et; tekrar okumaktan çok daha kalıcı.', eylem: ['◎ Test çöz', '#test'] },
    { ad: 'Aralıklı tekrar', metin: 'Kartları vadesi gelince çöz; aralıklar sen bildikçe uzar (SM-2).', eylem: ['❖ Kartlar', '#kartlar'] },
    { ad: 'Karışık çalışma', metin: 'Tek bölüm yerine 2-3 bölümden karışık soru çöz; sınavda hangi bilginin gerektiğini ayırt etmeyi öğretir.', eylem: ['🎯 Tahmini deneme', '#tahmin'] },
    { ad: 'Ön test', metin: 'Yeni bölüme başlamadan 3-5 soru çöz; yanlış yapsan bile sonraki okumayı güçlendirir.', eylem: ['📝 Bölüm testi', '#sohbet'] },
    { ad: 'Kendine anlat (Feynman)', metin: 'Konuyu Carvis\'e anlat, "şöyle mi?" de; boşlukların ortaya çıkar.', eylem: null },
    { ad: 'Odak blokları', metin: 'Telefonu uzak tut, pomodoro ile çalış; aklına geleni "Aklıma geldi"ye yaz, sonra bak.', eylem: ['⏱ Pomodoro', 'saat'] },
    { ad: 'Uyku', metin: 'Bellek pekişmesi uykuda olur; sınavdan önceki gece sabahlamak genelde net kayıptır.', eylem: null }
  ];
  U.SEKMELER.push({ id: 'koc', ad: 'Koç', ikon: '🧭' });
  U.GORUNUMLER.koc = function () {
    var ana = $('#ana'); ana.innerHTML = '';
    var sayfa = el('div', { class: 'sayfa' }); ana.appendChild(sayfa);
    sayfa.appendChild(el('div', { class: 'kahraman' }, [el('div', { class: 'ust-etiket', text: 'Çalışma koçu' }), el('h1', { text: '🧭 Bugün ne yapayım?' }),
      el('p', { text: 'Vadeli kartlar, sınav planı, eksiklerin ve en yakın sınavın çıkmış tahmini tek sırada. ▶ ile o işi pomodoro seansı olarak başlat.' })]));
    var kpi = el('div', { class: 'th-kpi' }), liste = el('div', {}, [el('div', { class: 'yukleniyor', text: 'Hazırlanıyor…' })]);
    sayfa.appendChild(kpi); sayfa.appendChild(el('h3', { text: 'Sıradaki işler' })); sayfa.appendChild(liste);
    U.calismaOnerisi().then(function (o) {
      var pm = o.pomodoro || {};
      kpi.appendChild(el('div', {}, [el('b', { text: (pm.bugun_dakika || 0) + '/' + (pm.gunluk_hedef_dk || 120) }), el('small', { text: 'bugün çalışılan dk / hedef' })]));
      kpi.appendChild(el('div', {}, [el('b', { text: '🔥 ' + (pm.seri_gun || 0) }), el('small', { text: 'gün seri' })]));
      kpi.appendChild(el('div', {}, [el('b', { text: o.sinav ? o.sinav.gun + ' gün' : '—' }), el('small', { text: o.sinav ? 'en yakın sınav: ' + o.sinav.kitap : 'sınav tarihi gir (Plan)' })]));
      kpi.appendChild(el('div', {}, [el('b', { text: String(o.vadeli || 0) }), el('small', { text: 'vadeli kart' })]));
      liste.innerHTML = '';
      if (!o.isler.length) liste.appendChild(el('p', { class: 'var-etiket', text: 'Önerecek iş yok: Plan sekmesinden sınav tarihi gir, birkaç test çöz; koç bunlardan beslenir.' }));
      o.isler.forEach(function (x) {
        var bas = el('button', { class: 'dugme kucuk ana', type: 'button', text: '▶ ' + x.dk + ' dk', onclick: function () {
          if (x.hash && x.hash !== 'saat') { U.git(x.hash); return; }
          if (U.Pomodoro) U.Pomodoro.baslat(Math.min(90, Math.max(15, x.dk)), x.kitap ? { kitap: x.kitap, sira: x.sira, ad: x.ad } : null).then(toast);
        } });
        var ek = [];
        if (x.tur === 'eksik') ek.push(el('button', { class: 'dugme kucuk', type: 'button', text: '📝 5 soru', onclick: function () { testPanel({ kitap: x.kitap, konu: x.konu || '', sayi: 5 }); } }));
        liste.appendChild(el('div', { class: 'koc-is' }, [el('div', { class: 'ad' }, [el('b', { text: x.ad }), el('small', { text: x.neden })]), bas].concat(ek)));
      });
    });
    sayfa.appendChild(el('h3', { text: 'İşe yarayan çalışma yöntemleri' }));
    var y = el('div', { class: 'koc-yontem' }); sayfa.appendChild(y);
    YONTEMLER.forEach(function (m) {
      y.appendChild(el('div', {}, [el('b', { text: m.ad }), m.metin, m.eylem ? el('div', { style: 'margin-top:6px' }, [el('button', { class: 'dugme kucuk', type: 'button', text: m.eylem[0], onclick: function () { if (m.eylem[1] === 'saat') U.saatAc && U.saatAc(); else U.git(m.eylem[1].slice(1)); } })]) : null]));
    });
  };
  function testPanel(g) {
    var govde = U.panelAc('📝 Yapay zekâ testi', g.konu || 'bölüm');
    var y = el('div', { class: 'yukleniyor', text: 'Sorular hazırlanıyor (kitaptan)…' }); govde.appendChild(y);
    return U.testUret(g).then(function (t) { y.remove(); U.testCiz(govde, t); return t; }).catch(function (e) { y.remove(); govde.appendChild(el('p', { class: 'hata-metni', text: e && e.code ? U.AI.hataMetni(e) : String(e.message || e) })); });
  }
  U.testPanel = testPanel;
  // kütüphane hızlı düğmeleri
  var eskiKutup = U.GORUNUMLER.kutuphane;
  if (eskiKutup) U.GORUNUMLER.kutuphane = function () {
    eskiKutup.apply(this, arguments);
    var hizli = $('.hizli'); if (!hizli) return;
    hizli.appendChild(el('a', { class: 'dugme', href: '#koc' }, ['🧭 Bugün ne yapayım?']));
    hizli.appendChild(el('a', { class: 'dugme', href: '#tahmin' }, ['🔮 Bu yıl ne çıkar?']));
  };

  /* ================= sohbet: ek araçlar + hızlı düğmeler ================= */
  function makaleAra(sorgu, acik) {
    if (U.makaleBul) return U.makaleBul(sorgu, { adet: 6, acik: acik, yeni: true });
    var q = '(' + sorgu + ')' + (acik ? ' AND OPEN_ACCESS:Y' : '') + ' AND FIRST_PDATE:[' + (new Date().getFullYear() - 4) + '-01-01 TO 3000-01-01]';
    return fetch('https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=' + encodeURIComponent(q) + '&format=json&pageSize=6&resultType=core').then(function (r) { if (!r.ok) throw new Error('Europe PMC ' + r.status); return r.json(); }).then(function (j) {
      return ((j.resultList && j.resultList.result) || []).map(function (x) {
        return { baslik: String(x.title || '').replace(/<[^>]+>/g, ''), dergi: x.journalInfo && x.journalInfo.journal ? x.journalInfo.journal.isoabbreviation || x.journalInfo.journal.title : '', yil: x.pubYear, acik: x.isOpenAccess === 'Y',
          link: x.doi ? 'https://doi.org/' + x.doi : 'https://europepmc.org/article/' + x.source + '/' + x.id, ozet: String(x.abstractText || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() };
      });
    });
  }
  U.sohbetEkAraclari = function () {
    return [
      { name: 'test_hazirla', description: 'Kullanıcı test/soru/quiz/deneme isterse kullan: kitaptan 5 şıklı, açıklamalı, İNTERAKTİF çoktan seçmeli test üretir. Konu verilmezse açık bölüm. Dönen test_id ile cevabına AYNEN "[test:ID]" satırını ekle; soruları ve cevapları metne YAZMA (ekranda tıklanabilir test olarak çıkar).',
        inputSchema: { type: 'object', properties: { konu: { type: 'string' }, kitap: { type: 'string' }, bolum_no: { type: 'string', description: 'ör. "4" ya da "4.6"' }, sayi: { type: 'number', description: '3-15, varsayılan 5' }, zorluk: { type: 'string', enum: ['kolay', 'karisik', 'zor'] } } },
        execute: function (g) { return U.testUret(g).then(function (t) { sonTestler.push(t.id); return { test_id: t.id, baslik: t.baslik, soru_sayisi: t.sorular.length, yazilacak: '[test:' + t.id + ']' }; }); } },
      { name: 'makale_bul', description: 'Europe PMC/PubMed\'de güncel bilimsel makale arar (son 4 yıl). sorgu İNGİLİZCE, kısa (MeSH terimleri). Cevapta en ilgili 3-5 makaleyi markdown bağlantısıyla listele: [Başlık](link) — dergi, yıl; altına bir cümlelik Türkçe özet.',
        inputSchema: { type: 'object', properties: { sorgu: { type: 'string' }, acik_erisim: { type: 'boolean' } }, required: ['sorgu'] },
        execute: function (g) { return makaleAra(String(g.sorgu), g.acik_erisim === true).then(function (l) { return l.length ? l.map(function (m) { return { baslik: m.baslik, dergi: m.dergi, yil: m.yil, acik_erisim: m.acik, link: m.link, ozet: String(m.ozet || '').slice(0, 500) }; }) : 'Sonuç yok; sorguyu sadeleştir.'; }, function (e) { return 'Makale servisine ulaşılamadı (' + (e.message || e) + '). Bu görünümde internet kapalı olabilir.'; }); } },
      { name: 'cikmis_tahmin', description: 'Bu yıl hangi çıkmış soruların/konuların gelebileceğini istatistikle tahmin eder (geçmiş yılların tekrar örüntüsü, geriye dönük sınanmış). "Ne çıkar, hangi çıkmışlar gelir, nereye ağırlık vereyim" sorularında kullan.',
        inputSchema: { type: 'object', properties: { kitap: { type: 'string' }, tur: { type: 'string', enum: ['Vize', 'Final', 'hepsi'] } } }, execute: tahminAraci },
      { name: 'eksiklerim', description: 'Öğrencinin "Bilmiyorum" dediği/yanlış yaptığı konular ve düşük seviye ölçümleri.', inputSchema: { type: 'object', properties: { kitap: { type: 'string' } } },
        execute: function (g) { return U.eksikOzeti ? U.eksikOzeti(g.kitap || null) : 'Eksik kaydı yok.'; } },
      { name: 'calisma_onerisi', description: 'Bugün ne çalışmalı: vadeli kartlar, plan, eksikler ve çıkmış tahminini birleştirip sıralı iş listesi döndürür; bugünkü çalışma dakikası ve seri de var.', inputSchema: { type: 'object', properties: {} }, execute: oneriAraci },
      { name: 'pomodoro', description: 'Pomodoro çalışma saatini yönetir: baslat (dakika ve konu isteğe bağlı), duraklat (ya da devam), atla, durdur, durum.',
        inputSchema: { type: 'object', properties: { islem: { type: 'string', enum: ['baslat', 'duraklat', 'atla', 'durdur', 'durum'] }, dakika: { type: 'number' } }, required: ['islem'] },
        execute: function (g) { var P = U.Pomodoro; if (!P) return 'Pomodoro yok.'; if (g.islem === 'baslat') return P.baslat(g.dakika || null, null); if (g.islem === 'durum') return P.durum(); return P[g.islem] ? P[g.islem]() : 'Bilinmeyen işlem.'; } }
    ];
  };
  U.sohbetEkKural = '\nYeteneklerin: test/soru/quiz isterse test_hazirla (cevaba yalnız [test:ID] satırını ve bir cümle yaz). Makale/literatür/güncel çalışma isterse makale_bul (İngilizce sorgu) ve sonuçları [Başlık](link) bağlantılarıyla listele. "Bu yıl ne çıkar / hangi çıkmışlar" → cikmis_tahmin. "Eksiğim ne" → eksiklerim. "Bugün ne çalışayım" → calisma_onerisi. Pomodoro/zamanlayıcı → pomodoro.';
  // Sohbet sayfasına hızlı düğmeler
  var eskiSohbet = U.GORUNUMLER.sohbet;
  if (eskiSohbet) U.GORUNUMLER.sohbet = function () {
    eskiSohbet.apply(this, arguments);
    var form = $('.sohbet-form'), girdi = $('#sohbetGirdi'); if (!form || !girdi) return;
    function sor(m) { girdi.value = m; form.requestSubmit ? form.requestSubmit() : form.dispatchEvent(new Event('submit')); }
    var bolumAd = Durum.aktifBolum ? (Durum.aktifBolum.kisa || Durum.aktifBolum.baslik) : null;
    form.parentNode.insertBefore(el('div', { class: 'sohbet-cipler' }, [
      el('button', { class: 'dugme kucuk', type: 'button', text: '📝 Test hazırla', onclick: function () { var k = girdi.value.trim(); sor(k ? k + ' konusundan 5 soruluk test hazırla' : bolumAd ? '"' + bolumAd + '" bölümünden 5 soruluk test hazırla' : 'Açık bölümden 5 soruluk test hazırla'); } }),
      el('button', { class: 'dugme kucuk', type: 'button', text: '📰 Makale getir', onclick: function () { var k = girdi.value.trim(); sor((k || bolumAd || 'bu konu') + ' hakkında son yılların önemli makalelerini getir ve kısaca özetle'); } }),
      el('button', { class: 'dugme kucuk', type: 'button', text: '🔮 Bu yıl ne çıkar?', onclick: function () { sor('Bu yıl ' + (Durum.aktifKitap ? Durum.aktifKitap.baslik.replace(/^1001\s*/, '') : '') + ' sınavında hangi çıkmışlar gelebilir? Nereye ağırlık vereyim?'); } }),
      el('button', { class: 'dugme kucuk', type: 'button', text: '🧭 Bugün ne çalışayım?', onclick: function () { sor('Bugün ne çalışmalıyım? Eksiklerime ve planıma göre sırala.'); } })
    ]), form);
  };
  U.sekmeleriCiz();
})();
