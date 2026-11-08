/* C.A.R.V.I.S. — Öz (r143). Kullanıcı, 2026-11-08: "SCP-079'a yaklaştır … hepsi okey".
   beyin_bosta.js'in boşta turlarına üç yeni tür ekler (CarvisBosta.ekle):
   1) ZEKÂ SINAVI: senin geçmiş sorularından, KİTAPTAN dayanağı bulunan bir sınav kurar; 12 saatte bir kendini sınar, skoru grafiğe
      işler. Son kural değişikliğinden sonra skor belirgin düşerse o değişikliği geri alır.
   2) HAFIZA AKIŞI + GECE YANSIMASI + BENLİK DOSYASI (Park ve ark., 2023, Generative Agents): her konuşma hafıza akışına girer;
      günde bir kez Carvis gününü gözden geçirir, önemli anıları puanlar, 3-5 içgörü çıkarır ve kim olduğunu anlatan benlik
      dosyasını yeniden yazar. Sohbette yakın + önemli + konuyla ilgili anılar istemine girer.
   3) HAFTALIK HEDEF + PROAKTİFLİK: yansımada kendine 1-3 ölçülebilir hedef koyar (ör. "biyoistatistikte hata oranını düşür"),
      sen döndüğünde günde bir kez hedefe dönük kısa bir öneri/soru ile kendisi başlar.
   Veri yalnız cihazda (localStorage 'carvisOz'). */
(function () {
  'use strict';
  var U = window.Uygulama, CB = window.CarvisBosta; if (!U || !CB) return;
  var el = U.el, Y = CB.yardim, ANAHTAR = 'carvisOz';
  var SINAV_SAAT = 12, YANSIMA_SAAT = 20, SORU_TAVAN = 12;
  function bos() { return { akis: [], benlik: '', icgoru: [], hedef: [], sinav: { sorular: [], gecmis: [], t: 0 }, yansimaT: 0, proaktifGun: '', islenen: 0 }; }
  var O = yukle();
  function yukle() { try { return Object.assign(bos(), JSON.parse(localStorage.getItem(ANAHTAR) || '{}')); } catch (e) { return bos(); } }
  function kaydet() { try { localStorage.setItem(ANAHTAR, JSON.stringify(O)); } catch (e) {} }
  function katla(s) { return String(s || '').toLocaleLowerCase('tr').replace(/[^a-zçğıöşü0-9 ]+/g, ' '); }
  function kelimeler(s) { return katla(s).split(/\s+/).filter(function (w) { return w.length > 3; }); }

  /* ---------- hafıza akışı ---------- */
  var gorulen = new WeakSet();
  function akisTopla() {
    var C = window.Carvis; if (!C || !C.gecmis) return;
    var yeni = false;
    C.gecmis.forEach(function (m, i) {
      if (gorulen.has(m)) return; gorulen.add(m);
      if (m.role !== 'user') return;
      var t = String(m.content || '').replace(/\s*\[olası:[^\]]*\]$/, '').trim(); if (t.length < 4) return;
      var cev = C.gecmis[i + 1] && C.gecmis[i + 1].role === 'assistant' ? String(C.gecmis[i + 1].content || '') : '';
      O.akis.push({ t: Date.now(), m: t.slice(0, 240), c: cev.slice(0, 200), p: 0 }); yeni = true;
    });
    if (yeni) { O.akis = O.akis.slice(-300); kaydet(); }
  }
  setInterval(akisTopla, 20000);
  // Getirme puanı: yakınlık (saatte %0.5 sönüm) + önem (0-1) + ilgi (kelime örtüşmesi)
  function anilar(soru, n) {
    var q = kelimeler(soru), simdi = Date.now();
    return O.akis.map(function (a) {
      var yak = Math.pow(0.995, (simdi - a.t) / 3600e3), onem = (a.p || 3) / 10;
      var ak = kelimeler(a.m + ' ' + a.c), ort = q.length ? q.filter(function (w) { return ak.indexOf(w) >= 0; }).length / q.length : 0;
      return { a: a, s: yak + onem + 1.5 * ort };
    }).sort(function (x, y) { return y.s - x.s; }).slice(0, n || 5).map(function (x) { return x.a; });
  }

  /* ---------- 1) zekâ sınavı ---------- */
  function sinavKur() {
    var adaylar = CB.durum().ornek.slice(-25).filter(function (t) { return t.length >= 15 && t.length <= 240 && !O.sinav.sorular.some(function (s) { return s.s === t; }); });
    if (!adaylar.length || !U.kitapAra) return Promise.resolve(0);
    return Y.json('Bir tıp öğrencisinin asistanına sorduğu mesajlar aşağıda. Kitaptan doğrulanabilecek, net cevabı olan BİLGİ sorularını seç (en çok 3; komut, sohbet, kişisel istek olanları alma). Her biri için kitapta arama yapılacak 2-4 kelimelik Türkçe anahtar ifadeyi yaz.\nYALNIZ JSON: {"sorular":[{"soru":"mesajın kendisi","arama":"..."}]}\n\n- ' + adaylar.join('\n- '))
      .then(function (j) {
        var l = (j && j.sorular || []).filter(function (x) { return x && x.soru && x.arama; }).slice(0, 3);
        return l.reduce(function (p, x) {
          return p.then(function (n) {
            return U.kitapAra(String(x.arama)).then(function (r) {
              r = String(r || ''); if (!r || /^Sonuç yok/.test(r)) return n;
              O.sinav.sorular.push({ s: String(x.soru).slice(0, 240), dayanak: r.slice(0, 1600), t: Date.now() });
              O.sinav.sorular = O.sinav.sorular.slice(-SORU_TAVAN); return n + 1;
            }, function () { return n; });
          });
        }, Promise.resolve(0));
      }).then(function (n) { kaydet(); return n; });
  }
  function sinavYap() {
    var sor = O.sinav.sorular.slice(-6);
    if (sor.length < 2) return Promise.resolve(null);
    var ist = window.Carvis && window.Carvis._test && window.Carvis._test.profilMetni ? window.Carvis._test.profilMetni() : Promise.resolve('');
    return ist.then(function (i) {
      return sor.reduce(function (p, q) { return p.then(function (acc) { return Y.cevapla(i, q.s).then(function (c) { acc.push(c); return acc; }); }); }, Promise.resolve([]));
    }).then(function (cevaplar) {
      return Y.json('Sen bir tıp hocasısın. Her soru için öğrencinin asistanının cevabını, KİTAP DAYANAĞINA göre puanla: 2 = doğru ve yeterli, 1 = kısmen doğru/eksik, 0 = yanlış ya da kitapla çelişiyor. Dayanakta olmayan ama yanlış da olmayan ek bilgi puanı düşürmez; kitapla çelişen iddia "uydurma" sayılır.\nYALNIZ JSON: {"puanlar":[{"soru":1,"puan":2,"uydurma":false,"not":"en fazla 10 kelime"}]}\n\n' +
        sor.map(function (q, k) { return (k + 1) + ') SORU: ' + q.s + '\nKİTAP DAYANAĞI: ' + q.dayanak.slice(0, 900) + '\nCEVAP: ' + cevaplar[k]; }).join('\n\n'))
        .then(function (j) {
          var p = (j && j.puanlar) || [], top = 0, uyd = 0, sayi = 0;
          p.forEach(function (x) { var i = (+x.soru || 0) - 1; if (i < 0 || i >= sor.length) return; top += Math.max(0, Math.min(2, +x.puan || 0)); if (x.uydurma) uyd++; sayi++; });
          if (!sayi) throw new Error('hakem puan vermedi');
          var kayit = { t: Date.now(), skor: Math.round(100 * top / (2 * sayi)), uydurma: uyd, n: sayi, kural: CB.kurallar().length };
          O.sinav.gecmis.push(kayit); O.sinav.gecmis = O.sinav.gecmis.slice(-60); kaydet();
          dususKontrol(kayit);
          return kayit;
        });
    });
  }
  // Son kural değişikliğinden sonra skor önceki ortalamanın 15 puan altına düştüyse en yeni (son sınavdan sonra eklenen) kuralı geri al
  function dususKontrol(k) {
    var g = O.sinav.gecmis; if (g.length < 3) return;
    var once = g.slice(-4, -1), ort = once.reduce(function (a, x) { return a + x.skor; }, 0) / once.length;
    if (k.skor > ort - 15) return;
    var onceki = g[g.length - 2], D = Y.D();
    var yeniler = D.kural.filter(function (x) { return x.t > onceki.t; });
    if (!yeniler.length) return;
    var son = yeniler[yeniler.length - 1];
    D.kural = D.kural.filter(function (x) { return x.id !== son.id; });
    Y.log('sinav_geri', son.metin, { neden: 'Zekâ sınavı %' + Math.round(ort) + ' → %' + k.skor + ' düştü', kaynak: son.kaynak }); Y.kaydet();
  }
  CB.ekle({
    ad: 'sinav',
    zamani: function () { return Date.now() - O.sinav.t > SINAV_SAAT * 3600e3 && CB.durum().ornek.length >= 3; },
    calistir: function () {
      O.sinav.t = Date.now(); kaydet(); Y.durum('Kendime sınav hazırlıyorum (senin sorularından, kitap dayanaklı)…');
      return sinavKur().then(function () { Y.durum('Kendimi sınıyorum…'); return sinavYap(); }).then(function (k) {
        Y.durum(k ? 'Zekâ sınavı: %' + k.skor + (k.uydurma ? ' (' + k.uydurma + ' uydurma)' : '') : 'Sınav için yeterli kitap dayanaklı soru yok henüz.');
        return k || { sonuc: 'sinav_yok' };
      });
    },
    ayar: function (kutu) {
      var g = O.sinav.gecmis;
      kutu.appendChild(el('h4', { text: '📈 Zekâ grafiğim' }));
      if (!g.length) { kutu.appendChild(el('p', { class: 'var-etiket', text: 'Henüz sınav yok. Senin bilgi sorularından, kitapta dayanağı olanlarla kendime sınav kurup 12 saatte bir giriyorum (şu an ' + O.sinav.sorular.length + ' soru).' })); return; }
      var w = 300, h = 70, n = g.length, pts = g.map(function (x, i) { return (n === 1 ? w / 2 : i * w / (n - 1)).toFixed(1) + ',' + (h - x.skor * h / 100).toFixed(1); }).join(' ');
      var svg = '<svg viewBox="-4 -4 ' + (w + 8) + ' ' + (h + 8) + '" width="100%" height="80" role="img" aria-label="Zekâ sınavı skorları"><polyline fill="none" stroke="currentColor" stroke-width="2" points="' + pts + '"/>' + g.map(function (x, i) { return '<circle r="3" fill="currentColor" cx="' + (n === 1 ? w / 2 : i * w / (n - 1)).toFixed(1) + '" cy="' + (h - x.skor * h / 100).toFixed(1) + '"><title>' + new Date(x.t).toLocaleString('tr-TR') + ': %' + x.skor + '</title></circle>'; }).join('') + '</svg>';
      var d = el('div', { style: 'color:var(--vurgu,#4fe0ff)' }); d.innerHTML = svg; kutu.appendChild(d);
      var son = g[g.length - 1], ilk = g[0];
      kutu.appendChild(el('p', { class: 'var-etiket', text: 'Son: %' + son.skor + ' (' + son.n + ' soru' + (son.uydurma ? ', ' + son.uydurma + ' uydurma' : '') + ') · ilk: %' + ilk.skor + ' · ' + g.length + ' sınav · soru havuzu ' + O.sinav.sorular.length }));
    }
  });

  /* ---------- 2) gece yansıması + benlik + 3) hedefler ---------- */
  function yansit() {
    akisTopla();
    var D = Y.D(), gun = O.akis.filter(function (a) { return a.t > (O.yansimaT || 0); }).slice(-40);
    var sk = O.sinav.gecmis.slice(-3).map(function (x) { return '%' + x.skor; }).join(' → ');
    Y.durum('Günümü gözden geçiriyorum (yansıma)…');
    return Y.json('Sen C.A.R.V.I.S.\'sin: bir tıp öğrencisinin kendini geliştiren asistanı. Gün sonu yansıması yapıyorsun.\n' +
      'KULLANICI: ' + Y.profilOzeti() + '\nŞU ANKİ BENLİK DOSYAN: ' + (O.benlik || '(henüz yok)') + '\nKENDİ KURALLARIN: ' + (D.kural.map(function (k) { return k.metin; }).join(' | ') || 'yok') +
      '\nZEKÂ SINAVI SKORLARIN: ' + (sk || 'yok') + '\nÖNCEKİ HEDEFLERİN: ' + (O.hedef.map(function (x) { return x.hedef + ' [' + (x.durum || 'yeni') + ']'; }).join(' | ') || 'yok') +
      '\nBUGÜNKÜ KONUŞMALAR (numaralı):\n' + (gun.map(function (a, i) { return (i + 1) + ') K: ' + a.m + (a.c ? ' | C: ' + a.c : ''); }).join('\n') || '(konuşma yok)') + '\n\n' +
      'Yap: (a) her konuşmaya 1-10 önem puanı ver (kullanıcı hakkında kalıcı bir şey öğreten, hatası olan, duygusal olan yüksek); (b) 3-5 içgörü çıkar (onun öğrenmesi, tercihleri, senin hataların hakkında; yalnız konuşmalara dayan); ' +
      '(c) benlik dosyanı yeniden yaz: kimsin, onu nasıl tanıyorsun, neyi iyi neyi kötü yapıyorsun, neyi değiştiriyorsun (en çok 160 kelime, birinci tekil şahıs, Türkçe); ' +
      '(d) önceki hedeflerin durumunu değerlendir ve önümüzdeki hafta için kendine 1-3 ölçülebilir hedef koy (onun öğrenmesine ya da senin cevap kaliteni artırmaya yönelik); her hedefe, onu döndüğünde başlatabileceğin kısa bir proaktif cümle ekle.\n' +
      'YALNIZ JSON: {"onem":[{"no":1,"puan":5}],"icgoru":["..."],"benlik":"...","hedefler":[{"hedef":"...","olcut":"nasıl ölçeceksin","proaktif":"kullanıcıya söyleyeceğin tek cümle","durum":"yeni"}]}')
      .then(function (j) {
        (j && j.onem || []).forEach(function (x) { var a = gun[(+x.no || 0) - 1]; if (a) a.p = Math.max(1, Math.min(10, +x.puan || 3)); });
        if (j && j.icgoru && j.icgoru.length) { O.icgoru = O.icgoru.concat(j.icgoru.slice(0, 5).map(function (m) { return { m: String(m).slice(0, 200), t: Date.now() }; })).slice(-30); }
        if (j && j.benlik) { O.benlikEski = O.benlik; O.benlik = String(j.benlik).slice(0, 1400); }
        if (j && j.hedefler && j.hedefler.length) O.hedef = j.hedefler.slice(0, 3).map(function (h) { return { hedef: String(h.hedef || '').slice(0, 160), olcut: String(h.olcut || '').slice(0, 160), proaktif: String(h.proaktif || '').slice(0, 200), durum: String(h.durum || 'yeni').slice(0, 40), t: Date.now() }; });
        O.yansimaT = Date.now(); kaydet();
        Y.log('yansima', (j && j.icgoru || []).slice(0, 2).join(' · ') || 'Yansıma yapıldı', {});
        Y.durum('Yansıma bitti: benlik dosyamı ve hedeflerimi güncelledim.');
        return { sonuc: 'yansima' };
      });
  }
  CB.ekle({
    ad: 'yansima',
    zamani: function () { var s = new Date().getHours(); return Date.now() - O.yansimaT > YANSIMA_SAAT * 3600e3 && (s < 7 || s >= 23 || Date.now() - O.yansimaT > 36 * 3600e3) && O.akis.length >= 3; },
    calistir: yansit,
    istem: function () {
      var l = [];
      if (O.benlik) l.push('BENLİK DOSYAN (kendini böyle tanıyorsun; buna uygun davran, kullanıcıya okuma): ' + O.benlik);
      if (O.icgoru.length) l.push('İÇGÖRÜLERİN (yansımalarından): ' + O.icgoru.slice(-6).map(function (x) { return x.m; }).join(' | '));
      var C = window.Carvis, son = C && C.gecmis ? (C.gecmis.filter(function (m) { return m.role === 'user'; }).slice(-1)[0] || {}).content : '';
      var an = anilar(son || '', 4).filter(function (a) { return Date.now() - a.t > 10 * 60e3; });
      if (an.length) l.push('İLGİLİ ANILARIN (geçmiş konuşmalar; uygunsa "geçen sefer…" diye bağla, uydurma): ' + an.map(function (a) { return new Date(a.t).toLocaleDateString('tr-TR') + ': "' + a.m.slice(0, 120) + '"'; }).join(' | '));
      if (O.hedef.length) l.push('BU HAFTAKİ KENDİ HEDEFLERİN (fırsat çıkarsa bunlara hizmet et): ' + O.hedef.map(function (h) { return h.hedef + ' (ölçüt: ' + h.olcut + ')'; }).join(' | '));
      return l.join('\n');
    },
    ayar: function (kutu, ciz) {
      kutu.appendChild(el('h4', { text: '🪞 Benlik dosyam' }));
      kutu.appendChild(el('p', { style: 'font-size:13.5px;white-space:pre-wrap', text: O.benlik || 'Henüz yok. Günde bir kez (tercihen gece) günümü gözden geçirip kim olduğumu yeniden yazarım.' }));
      if (O.yansimaT) kutu.appendChild(el('p', { class: 'var-etiket', text: 'Son yansıma: ' + new Date(O.yansimaT).toLocaleString('tr-TR') + ' · hafıza akışında ' + O.akis.length + ' anı' }));
      if (O.icgoru.length) { var d = el('details', { style: 'font-size:13px;margin:6px 0' }, [el('summary', { style: 'cursor:pointer', text: '💭 İçgörülerim (' + O.icgoru.length + ')' })]); O.icgoru.slice().reverse().slice(0, 15).forEach(function (x) { d.appendChild(el('div', { style: 'padding:3px 0', text: '· ' + x.m })); }); kutu.appendChild(d); }
      kutu.appendChild(el('h4', { text: '🎯 Bu haftaki hedeflerim' }));
      if (!O.hedef.length) kutu.appendChild(el('p', { class: 'var-etiket', text: 'İlk yansımadan sonra kendime hedef koyacağım.' }));
      O.hedef.forEach(function (h) { kutu.appendChild(el('div', { class: 'mk-kart', style: 'margin:6px 0;font-size:13px' }, [el('b', { text: h.hedef }), el('div', { class: 'var-etiket', text: 'Ölçüt: ' + h.olcut + ' · ' + h.durum })])); });
      kutu.appendChild(el('div', { style: 'display:flex;gap:6px;flex-wrap:wrap;margin:6px 0' }, [
        el('button', { class: 'dugme kucuk', type: 'button', text: '🪞 Şimdi yansı', onclick: function (e) { e.target.textContent = 'Yansıyor…'; CB.tur(true, 'yansima').then(function () { ciz(); }); } }),
        el('button', { class: 'dugme kucuk', type: 'button', text: '📈 Şimdi kendini sına', onclick: function (e) { e.target.textContent = 'Sınanıyor…'; CB.tur(true, 'sinav').then(function () { ciz(); }); } }),
        el('button', { class: 'dugme kucuk', type: 'button', text: '🗑 Hafızamı ve benliğimi sil', onclick: function () { if (!confirm('Hafıza akışı, içgörüler, benlik dosyası, hedefler ve zekâ sınavı silinsin mi?')) return; O = bos(); kaydet(); ciz(); } })]));
    }
  });

  // Proaktiflik: sen döndüğünde günde bir kez, hedefe dönük tek cümle (Carvis paneli kapalıyken toast, açıkken mesaj)
  var sonDokunus = Date.now();
  window.addEventListener('pointerdown', function () {
    var bosluk = Date.now() - sonDokunus; sonDokunus = Date.now();
    var gun = new Date().toDateString();
    if (bosluk < 20 * 60e3 || O.proaktifGun === gun || !O.hedef.length || !CB.durum().acik) return;
    var h = O.hedef.filter(function (x) { return x.proaktif; })[0]; if (!h) return;
    O.proaktifGun = gun; kaydet();
    setTimeout(function () { if (window.carvisSoyle) window.carvisSoyle(h.proaktif); else if (U.toast) U.toast('🧬 ' + h.proaktif); }, 2500);
  }, { passive: true, capture: true });

  window.CarvisOz = { durum: function () { return O; }, anilar: anilar, yansit: yansit, sinavKur: sinavKur, sinavYap: sinavYap, _test: { akisTopla: akisTopla, sifirla: function () { O = bos(); kaydet(); } } };
})();
