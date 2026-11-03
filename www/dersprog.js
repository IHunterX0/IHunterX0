/* 1001 — Ders programı (kullanıcı, 2026-11-03: "zamanım yok tuşu sadece konulara değil tüm derslere; ağırlıkları çıkmış sorulara ve
   soru tahminleri istatistiğine göre bölsün, öyle konu anlatımı yapsın + patrick jane gibi takıldığın yerleri çöz tuşu ve ayırt etme
   testleri ana dersler için de olsun; biyokimyayı açtığımda direkt öyle bir şey yapabileyim, sonra seviye ölçme testine soksun, böyle
   programlar olsun").
   Tek ders için dört iş:
   1) ⚡ Zamanım yok — tüm ders: bölümler çıkmış soru tahminindeki beklenen soru sayısına göre ağırlıklanır, verilen süre (30/60/120 dk)
      bu ağırlıkla bölünür; her bölüm için süresine göre uzunlukta, en olası konuları öne çıkaran sınav odaklı anlatım.
   2) 🎩 Takıldığın yerleri çöz: eksikler (yanlış/bilmiyorum) + en olası konular → Patrick Jane tarzı "göründüğü gibi değil / aslında".
   3) 🔍 Ayırt etme testi: dersin en çok karıştırılan çiftlerinden 10 soru.
   4) 🎯 Seviye ölç → program: en ağırlıklı bölümlerden GERÇEK çıkmış sorularla tanı testi; bölüm başarısı × ağırlık ile sınav gününe
      kadar günlük program (her maddede Zamanım yok / sesli anlat / Jane düğmesi). Program saklanır, işaretlenebilir. */
(function () {
  'use strict';
  var U = window.Uygulama; if (!U) return;
  var el = U.el, $ = U.$, Depo = U.Depo, Kitaplik = U.Kitaplik, Y = U.Y;
  var esc = U.esc || function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };

  function secili() { try { return sessionStorage.getItem('dersKitap') || (U.Durum && U.Durum.kitapId) || ''; } catch (e) { return ''; } }
  function sec(id) { try { sessionStorage.setItem('dersKitap', id); } catch (e) {} }
  function bugunStr() { var d = new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
  function gunFark(t) { return Math.round((new Date(t + 'T00:00:00') - new Date(bugunStr() + 'T00:00:00')) / 864e5); }
  function aiVar() { return U.AI ? U.AI.hazir().catch(function () { return false; }) : Promise.resolve(!!(Y && Y.sample)); }

  // Bölüm ağırlıkları: önce çıkmış soru tahmini (beklenen soru), yetmezse bölüm başına çıkmış soru sayısı, o da yoksa eşit
  function agirliklar(kitap) {
    return Promise.all([Kitaplik.ac(kitap), U.cikmisTahmin ? (U.cikmisTahminSirada ? U.cikmisTahminSirada(kitap) : U.cikmisTahmin(kitap, 'hepsi')).catch(function () { return { yok: true }; }) : Promise.resolve({ yok: true }), Kitaplik.sorular(kitap).catch(function () { return []; })]).then(function (r) {
      var kj = r[0], t = r[1], sorular = Array.isArray(r[2]) ? r[2] : (r[2] && r[2].sorular) || [];
      var bol = (kj.bolumler || []).map(function (b, i) { return { sira: b.sira != null ? b.sira : i, ad: b.kisa || b.baslik, id: b.id, w: 0, konular: [] }; });
      var kaynak;
      if (!t.yok && t.bolumler && t.bolumler.length) {
        kaynak = 'çıkmış soru tahmini (' + t.yillar.length + ' yıl, hedef ' + t.hedefYil + ')';
        t.bolumler.forEach(function (x) { var b = bol.filter(function (y) { return y.sira === x.sira; })[0]; if (b) { b.w = x.beklenen; b.beklenen = x.beklenen; } });
        t.tahmin.forEach(function (x) { var b = bol.filter(function (y) { return y.sira === x.sira; })[0]; if (b && b.konular.length < 4) b.konular.push({ konu: x.konu, ol: x.olasilik, x: x }); });
      } else if (sorular.length) {
        kaynak = 'bölüm başına çıkmış soru sayısı';
        sorular.forEach(function (s) { var b = bol.filter(function (y) { return y.id === s.bolum; })[0]; if (b) b.w += (s.varyantlar || []).length || 1; });
      }
      if (!bol.some(function (b) { return b.w > 0; })) { kaynak = 'eşit (çıkmış soru verisi yok)'; bol.forEach(function (b) { b.w = 1; }); }
      var top = bol.reduce(function (s, b) { return s + b.w; }, 0) || 1;
      bol.forEach(function (b) { b.pay = b.w / top; });
      bol.sort(function (a, b) { return b.w - a.w; });
      return { kj: kj, t: t, bol: bol.filter(function (b) { return b.w > 0; }), kaynak: kaynak };
    });
  }

  // gerçek çıkmış soru → test sorusu (en son sorulan biçim)
  function testSorusu(kitap, q, b) {
    var v = (q.varyantlar || []).filter(function (v) { return v.siklar && v.siklar.length && v.cevap; }).slice(-1)[0]; if (!v) return null;
    var d = 0; v.siklar.forEach(function (s, i) { if (s.h === v.cevap) d = i; });
    return { soru: v.govde, siklar: v.siklar.map(function (s) { return s.m; }), dogru: d, aciklamaHtml: q.cevapHtml || '', etiket: v.sinav, kitap: kitap, sira: b.sira, blok: q.blok, konu: q.konu, bolumAd: b.ad };
  }

  /* ---------------- 1) Zamanım yok — tüm ders ---------------- */
  function zamanimYokDers(kap, A, dk) {
    kap.innerHTML = '';
    var secilen = A.bol.filter(function (b) { return b.pay >= 0.02; }).slice(0, 12), top = secilen.reduce(function (s, b) { return s + b.pay; }, 0) || 1;
    kap.appendChild(el('p', { class: 'var-etiket', text: dk + ' dakika, ' + secilen.length + ' bölüme ağırlıklarına göre bölündü · ağırlık kaynağı: ' + A.kaynak + '. En ağırlıklı bölümler önce; her bölüm açılınca anlatım hazırlanır.' }));
    var sira = [];
    secilen.forEach(function (b, i) {
      var bdk = Math.max(3, Math.round(dk * b.pay / top));
      var anlat = el('div', { class: 'dp-anlat', hidden: true });
      var kart = el('div', { class: 'dp-bolum' }, [
        el('div', { class: 'dp-bolum-ust' }, [
          el('b', { text: (i + 1) + '. ' + b.ad }),
          el('span', { class: 'dp-pay' }, [el('i', { style: 'width:' + Math.round(b.pay / secilen[0].pay * 100) + '%' })]),
          el('small', { text: '%' + Math.round(b.pay * 100) + (b.beklenen ? ' · ~' + b.beklenen.toFixed(1) + ' soru' : '') + ' · ' + bdk + ' dk' })]),
        b.konular.length ? el('div', { class: 'dp-konular', text: 'En olası: ' + b.konular.map(function (k) { return k.konu + ' %' + Math.round(k.ol * 100); }).join(' · ') }) : '',
        el('div', { class: 'dp-dugmeler' }, [
          el('button', { class: 'dugme kucuk ana', type: 'button', onclick: function () { anlat.hidden = !anlat.hidden; if (!anlat.hidden && !anlat.dataset.y) bolumAnlat(anlat, A, b, bdk); } }, ['⚡ Anlat (' + bdk + ' dk)']),
          el('button', { class: 'dugme kucuk', type: 'button', onclick: function () { if (window.Carvis && window.Carvis.dersModu) window.Carvis.dersModu(A.kj.id, b.sira); } }, ['🎧 Sesli anlat']),
          el('a', { class: 'dugme kucuk', href: '#' + U.okuHash(A.kj.id, b.sira) }, ['↗ Bölümü aç'])]),
        anlat]);
      kap.appendChild(kart); sira.push(function () { anlat.hidden = false; bolumAnlat(anlat, A, b, bdk); });
    });
    if (sira[0]) sira[0](); // ilkini hemen hazırla
  }
  function bolumAnlat(kutu, A, b, bdk) {
    kutu.dataset.y = '1';
    kutu.appendChild(el('div', { class: 'yukleniyor', text: 'Anlatım hazırlanıyor…' }));
    Kitaplik.bolumAc(A.kj.id, b.sira).then(function (bolum) {
      var kelime = Math.min(900, Math.max(150, bdk * 110));
      U.cevapCalistir(kutu, 'dersZY|' + A.kj.id + '|' + b.sira + '|' + kelime, function () {
        return 'Bir tıp öğrencisinin ' + A.kj.baslik + ' sınavına az zamanı var; bu bölüme ' + bdk + ' dakika ayırabiliyor. Bölümü SINAV ODAKLI anlat. YALNIZ aşağıdaki kitap metnine dayan, uydurma. Türkçe, yaklaşık ' + kelime + ' kelime.\n' +
          (b.konular.length ? 'Çıkmış soru istatistiğine göre EN OLASI konular (öncelik ver, her birini ayrı başlıkta işle): ' + b.konular.map(function (k) { return k.konu + ' (%' + Math.round(k.ol * 100) + ')'; }).join('; ') + '\n' : '') +
          'Biçim: **Özün özü** (2 cümle) · her olası konu için **başlık** + 3-6 madde (mekanizma, sayı, ayırt edici bilgi) · **Klasik tuzaklar** (2-4 madde) · **Son 30 saniye** (3 madde ezber).\n\nKİTAP METNİ:\n"""\n' + (U.bolumOzu ? U.bolumOzu(bolum, 9000) : '') + '\n"""';
      }, { kj: A.kj, eylem: 'zamanimyok' });
    }).catch(function (e) { kutu.innerHTML = ''; kutu.appendChild(el('p', { class: 'hata-metni', text: 'Bölüm açılamadı: ' + (e.message || e) })); });
  }

  /* ---------------- 2) Takıldığın yerleri çöz ---------------- */
  function janeDers(kap, A) {
    kap.innerHTML = ''; kap.appendChild(el('div', { class: 'yukleniyor', text: 'Patrick Jane notlarına bakıyor…' }));
    Promise.resolve(U.eksikOzeti ? U.eksikOzeti(A.kj.id).catch(function () { return null; }) : null).then(function (ek) {
      var zayif = ((ek && ek.zayif) || []).slice(0, 5);
      var hedefler = zayif.length ? zayif.map(function (z) { return { sira: z.sira, ad: z.bolum, not: z.bilmiyor + ' bilmiyorum, ' + z.yanlis + ' yanlış' + (z.konular && z.konular.length ? '; konular: ' + z.konular.slice(0, 4).join(', ') : '') + (z.ornek && z.ornek.length ? '; örnek yanlış: ' + z.ornek.slice(0, 2).join(' | ') : '') }; })
        : A.bol.slice(0, 4).map(function (b) { return { sira: b.sira, ad: b.ad, not: 'henüz yanlış kaydı yok; en olası konular: ' + b.konular.map(function (k) { return k.konu; }).join(', ') }; });
      return Promise.all(hedefler.map(function (h) { return Kitaplik.bolumAc(A.kj.id, h.sira).then(function (bo) { h.metin = U.bolumOzu ? U.bolumOzu(bo, 2600) : ''; return h; }).catch(function () { h.metin = ''; return h; }); })).then(function (hs) {
        kap.innerHTML = '';
        kap.appendChild(el('p', { class: 'var-etiket', text: zayif.length ? 'Kaynak: senin yanlışların ve "bilmiyorum"ların (' + zayif.length + ' bölüm).' : 'Henüz yanlış kaydın yok; en ağırlıklı bölümlerin klasik tuzaklarına bakıyorum. Test çözdükçe kişiselleşir.' }));
        var kutu = el('div'); kap.appendChild(kutu);
        U.cevapCalistir(kutu, 'dersJane|' + A.kj.id + '|' + bugunStr() + '|' + hs.map(function (h) { return h.sira; }).join(','), function () {
          return 'Sen Patrick Jane\'sin (The Mentalist): karşındakinin aklından geçeni okuyan, sakin, kendinden emin biri. Bir tıp öğrencisinin ' + A.kj.baslik + ' dersinde NEREDE TAKILDIĞINI ve NEDEN takıldığını çöz. Kibar ama keskin; uydurma, yalnız kitap metnine dayan.\n' +
            'Her takılma noktası için: **Göründüğü gibi değil:** (yanlış kurulan sezgi, tek cümle) → **Aslında:** (ayırt eden mekanizma, 2-4 cümle) → **Sınavda şöyle gelir:** (soru kalıbı) → **Kanca:** (akılda tutma ipucu). En sonda tek cümlelik "Benim tahminim" (bu öğrencinin genel düşünme hatası).\n\n' +
            hs.map(function (h, i) { return (i + 1) + ') BÖLÜM: ' + h.ad + ' — ' + h.not + '\n"""\n' + h.metin + '\n"""'; }).join('\n\n');
        }, { kj: A.kj, eylem: 'jane' });
      });
    });
  }

  /* ---------------- 3) Ayırt etme testi ---------------- */
  function ayirtDers(kap, A) {
    kap.innerHTML = ''; var y = el('div', { class: 'yukleniyor', text: 'Karıştırılan çiftler seçiliyor, sorular yazılıyor…' }); kap.appendChild(y);
    var hedef = A.bol.slice(0, 5);
    Promise.all(hedef.map(function (b) { return Kitaplik.bolumAc(A.kj.id, b.sira).then(function (bo) { return { b: b, m: U.bolumOzu ? U.bolumOzu(bo, 2200) : '' }; }).catch(function () { return { b: b, m: '' }; }); })).then(function (ms) {
      return Y.sample.json('Bir tıp fakültesi ' + A.kj.baslik + ' sınavı için AYIRT ETME testi yaz: dersin en çok karıştırılan kavram çiftlerinden (ör. iki enzim, iki yolak, iki kas, iki sendrom) 10 soru. Amaç ayırt ettirmek: şıklarda çiftin iki tarafı da olsun, doğru cevap ayırt edici özelliğe dayansın. 5 şık (A-E), tek doğru, Türkçe, YALNIZ aşağıdaki metinlere dayan.\n' +
        'Yalnız JSON: {"sorular":[{"soru":"...","siklar":["...","...","...","...","..."],"dogru":0-4,"aciklama":"neden; ayırt edici nokta","konu":"X mi Y mi","bolum":"bölüm adı"}]}\n\n' +
        ms.map(function (x) { return 'BÖLÜM: ' + x.b.ad + (x.b.konular.length ? ' (olası: ' + x.b.konular.map(function (k) { return k.konu; }).join(', ') + ')' : '') + '\n"""\n' + x.m + '\n"""'; }).join('\n\n'), { cache: false });
    }).then(function (j) {
      var sorular = ((j && j.sorular) || []).filter(function (q) { return q && q.soru && q.siklar && q.siklar.length >= 4; }).map(function (q) {
        var b = A.bol.filter(function (x) { return x.ad === q.bolum; })[0];
        return { soru: q.soru, siklar: q.siklar.slice(0, 5), dogru: Math.max(0, Math.min(4, +q.dogru || 0)), aciklama: q.aciklama || '', konu: q.konu || '', kitap: A.kj.id, sira: b ? b.sira : null, bolumAd: q.bolum || '' };
      });
      y.remove();
      if (!sorular.length) throw new Error('Soru üretilemedi.');
      U.testCiz(kap, { baslik: 'Ayırt etme · ' + A.kj.baslik.replace(/^1001\s*/, ''), sorular: sorular }, { kaynak: 'ayirt' });
    }).catch(function (e) { y.remove(); kap.appendChild(el('p', { class: 'hata-metni', text: U.AI && U.AI.hataMetni ? U.AI.hataMetni(e) : String(e.message || e) })); });
  }

  /* ---------------- 4) Seviye ölç → program ---------------- */
  function seviyeDers(kap, A, bitince) {
    kap.innerHTML = '';
    Kitaplik.sorular(A.kj.id).then(function (ham) {
      var sorular = Array.isArray(ham) ? ham : (ham && ham.sorular) || [];
      var test = [], hedef = A.bol.slice(0, 8);
      hedef.forEach(function (b) {
        var aday = [];
        if (b.konular.length) b.konular.forEach(function (k) { (k.x.aileler || []).slice(0, 2).forEach(function (a) { if (a.q) aday.push(a.q); }); });
        sorular.forEach(function (q) { if (q.bolum === b.id && aday.indexOf(q) < 0) aday.push(q); });
        aday.slice(0, 6).map(function (q) { return testSorusu(A.kj.id, q, b); }).filter(Boolean).slice(0, 2).forEach(function (q) { test.push(q); });
      });
      if (test.length < 4) { kap.appendChild(el('p', { class: 'hata-metni', text: 'Bu derste seviye ölçmeye yetecek çıkmış soru yok.' })); return; }
      var skor = {};
      kap.appendChild(el('p', { class: 'var-etiket', text: test.length + ' gerçek çıkmış soru, en ağırlıklı ' + hedef.length + ' bölümden. Bitince sınav gününe kadar programın çıkacak.' }));
      U.testCiz(kap, { baslik: 'Seviye ölçümü · ' + A.kj.baslik.replace(/^1001\s*/, ''), sorular: test }, { guvenliHtml: true, kaynak: 'seviye',
        cevap: function (q, ok) { var s = skor[q.sira] = skor[q.sira] || { d: 0, n: 0 }; s.n++; if (ok) s.d++; },
        bitti: function () { programKur(A, skor).then(bitince); } });
    });
  }
  function programKur(A, skor) {
    return Depo.oku('plan').then(function (ayar) {
      var t = ayar && ayar.sinav && ayar.sinav[A.kj.id], gun = t ? Math.max(1, gunFark(t)) : 3, gunluk = +(ayar && (ayar.gunlukDk || ayar.gunluk)) || 180;
      var l = A.bol.slice(0, 14).map(function (b) {
        var s = skor[b.sira], basari = s ? s.d / s.n : 0.5;
        return { sira: b.sira, ad: b.ad, pay: b.pay, basari: s ? basari : null, oncelik: b.pay * (1.15 - basari), dk: 0 };
      }).sort(function (a, b) { return b.oncelik - a.oncelik; });
      var topO = l.reduce(function (s, x) { return s + x.oncelik; }, 0) || 1, toplamDk = gun * gunluk;
      l.forEach(function (x) { x.dk = Math.max(15, Math.round(toplamDk * 0.8 * x.oncelik / topO / 5) * 5); });
      var gunler = []; for (var g = 0; g < gun; g++) gunler.push({ g: g, dk: 0, isler: [] });
      l.forEach(function (x) { var hedefGun = gunler.slice().sort(function (a, b) { return a.dk - b.dk; })[0]; hedefGun.isler.push(x); hedefGun.dk += x.dk; });
      if (gun > 1) gunler[gun - 1].isler.push({ tekrar: true, ad: 'Genel tekrar: Takıldığın yerleri çöz + ayırt etme testi', dk: 45 });
      var p = { t: Date.now(), kitap: A.kj.id, kitapAd: A.kj.baslik, sinav: t || null, gunler: gunler, bitenler: {} };
      return U.depoGuncelle('dersProgram', function (v) { v[A.kj.id] = p; }, 100).then(function () { return p; });
    });
  }
  function programCiz(kap, p, A) {
    kap.innerHTML = '';
    if (!p) return;
    var bas = new Date(p.t); bas.setHours(0, 0, 0, 0);
    kap.appendChild(el('h2', { text: 'PROGRAM · ' + (p.sinav ? 'sınava ' + Math.max(0, gunFark(p.sinav)) + ' gün' : 'sınav tarihi girilmemiş (3 güne göre)') }));
    p.gunler.forEach(function (g) {
      var d = new Date(bas.getTime() + g.g * 864e5);
      var kutu = el('div', { class: 'dp-gun' }, [el('b', { text: (g.g === 0 ? 'BUGÜN' : d.toLocaleDateString('tr-TR', { weekday: 'long', day: 'numeric', month: 'long' }).toLocaleUpperCase('tr')) + ' · ~' + g.dk + ' dk' })]);
      g.isler.forEach(function (x, i) {
        var anahtar = g.g + '-' + i, cb = el('input', { type: 'checkbox', checked: p.bitenler[anahtar] ? true : null });
        cb.addEventListener('change', function () { U.depoGuncelle('dersProgram', function (v) { if (v[p.kitap]) v[p.kitap].bitenler[anahtar] = cb.checked; }, 200); });
        var satir = el('div', { class: 'dp-is' }, [el('label', {}, [cb, el('span', { text: x.ad + (x.dk ? ' · ' + x.dk + ' dk' : '') + (x.basari != null ? ' · seviye %' + Math.round(x.basari * 100) : '') })])]);
        if (!x.tekrar) satir.appendChild(el('div', { class: 'dp-dugmeler' }, [
          el('a', { class: 'dugme kucuk', href: '#' + U.okuHash(p.kitap, x.sira) }, ['↗ Oku']),
          el('button', { class: 'dugme kucuk', type: 'button', onclick: function () { if (window.Carvis && window.Carvis.dersModu) window.Carvis.dersModu(p.kitap, x.sira); } }, ['🎧 Sesli']),
          el('button', { class: 'dugme kucuk', type: 'button', onclick: function () { location.hash = U.okuHash(p.kitap, x.sira); setTimeout(function () { if (U.zamanimYok) U.zamanimYok(); }, 1500); } }, ['⚡ Zamanım yok'])]));
        kutu.appendChild(satir);
      });
      kap.appendChild(kutu);
    });
  }

  /* ---------------- sayfa ---------------- */
  var st = document.createElement('style');
  st.textContent = [
    '.dp-isler{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:10px;margin:12px 0 16px}',
    '.dp-is-kart{text-align:left;padding:14px 14px 12px;background:linear-gradient(180deg,rgba(6,28,36,.7),rgba(3,14,20,.8));border:1px solid rgba(94,240,220,.38);color:#d6f7f3;clip-path:polygon(0 10px,10px 0,calc(100% - 18px) 0,100% 18px,100% 100%,18px 100%,0 calc(100% - 18px));cursor:pointer;display:grid;gap:6px;transition:background .2s,box-shadow .2s}',
    '.dp-is-kart:hover,.dp-is-kart[aria-pressed=true]{background:linear-gradient(180deg,rgba(20,70,76,.75),rgba(5,24,30,.85));box-shadow:inset 0 0 26px rgba(94,240,220,.18)}',
    '.dp-is-kart b{font:600 12px/1.2 var(--f-kod,monospace);letter-spacing:.16em;color:#5ef0dc;text-transform:uppercase}',
    '.dp-is-kart span{font-size:12.5px;color:#9fc9cc;line-height:1.45}',
    '.dp-is-kart i{font-style:normal;font-size:22px}',
    '.dp-bolum{padding:12px 14px;margin:10px 0;border:1px solid rgba(94,240,220,.25);background:rgba(3,16,22,.55)}',
    '.dp-bolum-ust{display:grid;grid-template-columns:minmax(0,1.4fr) minmax(80px,1fr) auto;gap:10px;align-items:center}',
    '.dp-pay{height:6px;background:rgba(94,240,220,.12)}.dp-pay i{display:block;height:100%;background:linear-gradient(90deg,#46c8ff,#5ef0dc);box-shadow:0 0 8px #5ef0dc}',
    '.dp-bolum small{font:11px var(--f-kod,monospace);color:#7fb9bd;white-space:nowrap}',
    '.dp-konular{font-size:12.5px;color:#ffd38a;margin:6px 0}',
    '.dp-dugmeler{display:flex;gap:6px;flex-wrap:wrap;margin-top:6px}',
    '.dp-anlat{margin-top:10px}',
    '.dp-gun{padding:10px 14px;margin:8px 0;border-left:3px solid #5ef0dc;background:rgba(3,16,22,.55)}',
    '.dp-gun>b{font:600 12px var(--f-kod,monospace);letter-spacing:.14em;color:#5ef0dc}',
    '.dp-is{padding:6px 0;border-bottom:1px dashed rgba(94,240,220,.14)}.dp-is label{display:flex;gap:8px;align-items:flex-start}',
    '@media (max-width:640px){.dp-bolum-ust{grid-template-columns:1fr}}'
  ].join('\n');
  document.head.appendChild(st);

  U.GORUNUMLER.ders = function () {
    var ana = $('#ana'); ana.innerHTML = '';
    var sayfa = el('div', { class: 'sayfa' }); ana.appendChild(sayfa);
    sayfa.appendChild(el('div', { class: 'kahraman' }, [el('div', { class: 'ust-etiket', text: 'Tüm ders' }), el('h1', { text: '◎ Ders programı' }),
      el('p', { text: 'Bir ders seç: çıkmış soru ve soru tahmini ağırlıklarıyla tüm dersi özetle, takıldığın yerleri çöz, ayırt etme testi çöz, seviyeni ölç ve sınava kadar programını çıkar.' })]));
    var secim = el('select', { 'aria-label': 'Ders', style: 'background:var(--zemin);border:1px solid var(--cizgi);color:var(--metin);padding:8px 10px;min-width:220px' });
    var bilgi = el('p', { class: 'var-etiket' });
    var isler = el('div', { class: 'dp-isler' }), icerik = el('div'), prog = el('div');
    sayfa.appendChild(el('div', { class: 'sp-satir', style: 'display:flex;gap:10px;align-items:center;flex-wrap:wrap' }, [secim, bilgi]));
    sayfa.appendChild(isler); sayfa.appendChild(icerik); sayfa.appendChild(prog);
    var A = null;
    function yukle(id) {
      sec(id); bilgi.textContent = 'Ağırlıklar hesaplanıyor…'; icerik.innerHTML = ''; prog.innerHTML = '';
      agirliklar(id).then(function (a) {
        A = a;
        bilgi.textContent = 'Ağırlık: ' + a.kaynak + ' · ilk 3 bölüm: ' + a.bol.slice(0, 3).map(function (b) { return b.ad + ' %' + Math.round(b.pay * 100); }).join(', ');
        return Depo.oku('dersProgram').then(function (v) { if (v && v[id]) programCiz(prog, v[id], a); });
      }).catch(function (e) { bilgi.textContent = 'Ders açılamadı: ' + (e.message || e); });
    }
    function is(ikon, ad, alt, fn) {
      var b = el('button', { class: 'dp-is-kart', type: 'button', 'aria-pressed': 'false' }, [el('i', { text: ikon }), el('b', { text: ad }), el('span', { text: alt })]);
      b.addEventListener('click', function () { if (!A) return; isler.querySelectorAll('.dp-is-kart').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); }); fn(); icerik.scrollIntoView({ behavior: 'smooth', block: 'start' }); });
      isler.appendChild(b);
    }
    is('⚡', 'Zamanım yok', 'Tüm ders; süreyi çıkmış soru ağırlığına göre böler, en olası konulardan anlatır.', function () {
      icerik.innerHTML = '';
      var sec2 = el('div', { class: 'dp-dugmeler' }, [el('span', { class: 'var-etiket', text: 'Ne kadar vaktin var?' })]);
      [30, 60, 120, 240].forEach(function (d) { sec2.appendChild(el('button', { class: 'cip', type: 'button', text: d < 60 ? d + ' dk' : d / 60 + ' saat', onclick: function () { zamanimYokDers(kutu, A, d); } })); });
      var kutu = el('div'); icerik.appendChild(sec2); icerik.appendChild(kutu);
    });
    is('🎩', 'Takıldığın yerler', 'Patrick Jane: yanlışlarından nerede ve neden takıldığını çözer.', function () { aiVar().then(function (ok) { if (!ok) return yok(); janeDers(icerik, A); }); });
    is('🔍', 'Ayırt etme testi', 'Dersin en çok karıştırılan çiftlerinden 10 soru.', function () { aiVar().then(function (ok) { if (!ok) return yok(); ayirtDers(icerik, A); }); });
    is('🎯', 'Seviye ölç → program', 'Gerçek çıkmış sorularla tanı testi; sonra sınav gününe kadar günlük program.', function () { seviyeDers(icerik, A, function (p) { programCiz(prog, p, A); prog.scrollIntoView({ behavior: 'smooth' }); }); });
    function yok() { icerik.innerHTML = ''; icerik.appendChild(el('p', { class: 'hata-metni', text: 'Bunun için yapay zekâ gerekiyor (Carvis ayarlarından sağlayıcı ekle).' })); }
    Kitaplik.katalog().then(function (l) {
      var ilk = secili();
      (l || []).forEach(function (k) { secim.appendChild(el('option', { value: k.id, text: String(k.baslik || k.id).replace(/^1001\s*/, ''), selected: k.id === ilk ? true : null })); });
      secim.addEventListener('change', function () { yukle(secim.value); });
      if (secim.value) yukle(secim.value);
    });
  };
  U.SEKMELER.push({ id: 'ders', ad: 'Ders programı', ikon: '◎' });
  if (U.sekmeleriCiz) try { U.sekmeleriCiz(); } catch (e) {}
  U.dersProgramiAc = function (kitap) { if (kitap) sec(kitap); if (location.hash === '#ders') U.git('ders'); else location.hash = 'ders'; };

  // Okuma ekranında araç çubuğuna "◎ Ders programı" (kitabı açınca direkt)
  setInterval(function () {
    var o = document.getElementById('seviyeOlcDug'); if (!o || document.getElementById('dersProgDug')) return;
    o.after(el('button', { id: 'dersProgDug', class: 'dugme kucuk', type: 'button', title: 'Tüm ders: Zamanım yok, takıldığın yerler, ayırt etme, seviye → program', onclick: function () { U.dersProgramiAc(U.Durum && U.Durum.kitapId); } }, ['◎ Ders programı']));
  }, 1500);
})();
