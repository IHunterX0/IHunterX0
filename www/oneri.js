/* 1001 — Öneri kutusu (kullanıcı, 2026-11-03: "uygulamanın gelişmesi için suggestion box; AI hem kendi değerlendirsin
   eklesin hem ben ekleyebileyim, istekleri sıralasın, direkt kopyalayabileyim").
   - Öneriler Depo'da ('oneriler'); yedeğe dahil. Kaynak: ben / AI.
   - AI değerlendirme: fayda, zorluk, öncelik (0-100), kısa plan, riskler → öncelik sırasına göre listelenir.
   - AI kendi önerisi: uygulamanın modülleri + mevcut öneriler + kullanım özetinden 3 yeni fikir.
   - Kopyala: tek tek ya da hepsi; Claude Code'a yapıştırmaya hazır istem metni.
   - Carvis aracı: oneri_ekle ("Carvis, öneri kutusuna … ekle"). */
(function () {
  'use strict';
  var U = window.Uygulama; if (!U) return;
  var el = U.el, $ = U.$, Depo = U.Depo;
  var ANAHTAR = 'oneriler';
  var MODULLER = 'Çalışma kitapları okuyucu (anatomi, biyokimya, biyofizik, biyoistatistik), Zamanım yok özeti, Patrick Jane karışıklık analizi, kartlar (SM-2), testler, çıkmış soru tahmini, koç, plan, pomodoro, hafıza sarayları, araştırma defteri, makale takibi, 3B lab (molekül 3Dmol, anatomi iskelet/kas, hareket), Carvis sesli asistan (Vosk uyandırma + Android ses tanıma + TTS, araç çağırma), holografik HUD arayüzü (sürüklenebilir pencereler, efektler), Spotify müzik (ruh hâli karışımı, öğrenen öneri, liste aç + ilk şarkıya dokun), yapay zekâ sağlayıcı zinciri (OpenRouter, GitHub Models, Gemini, Groq). Android (WebView + Kotlin, imzalı APK), web katmanı HTML/JS.';
  var BASLANGIC = [
    'Ders anlatımı sekmesi: Carvis holografik ve animasyonlu ders anlatsın. Örn. histidini anlatırken 3B molekülde imidazol halkasına yakınlaşsın, parlatsın, "tampon kapasitesi yüksektir" desin, sonra bana soru sorsun. Yapay zekâ yalnız senaryoyu (adımlar, odaklanılacak atomlar, anlatım, soru) yazsın; animasyonu uygulama yapsın.',
    'Ses tanıma: Carvis yalnız benim sesimle uyansın. Bir kez 5-6 kez "Carvis" diyerek sesimi tanıtayım (konuşmacı parmak izi, Vosk konuşmacı modeli); TV, başkaları ve Carvis\'in kendi sesi uyandırmasın.',
    'Carvis kendi kodunu yazabilsin: öneri kutusundaki onaylı istekler GitHub\'da iş (issue) olarak açılsın, Claude Code yazsın, güncelleme imzalı paket olarak uygulamaya insin (APK kurmadan).'
  ];

  function oku() { return Depo.oku(ANAHTAR).then(function (v) { v = v || {}; v.liste = v.liste || []; return v; }); }
  function guncelle(f) { return U.depoGuncelle(ANAHTAR, function (v) { v.liste = v.liste || []; f(v); }, 50); }
  function yeniId() { return 'o' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5); }
  function jsonAyikla(m) { var a = m.indexOf('{'), b = m.lastIndexOf('}'); if (a < 0 || b < a) throw new Error('Cevap okunamadı.'); return JSON.parse(m.slice(a, b + 1)); }
  function ai(istem) {
    if (!U.Y || !U.Y.sample) return Promise.reject(new Error('Yapay zekâ yok.'));
    var zaman = new Promise(function (_, red) { setTimeout(function () { red(new Error('yapay zekâ 40 sn\'de cevap vermedi')); }, 40000); });
    return Promise.race([U.Y.sample(istem, { cache: false }), zaman]).then(function (c) { return jsonAyikla(c.text || ''); });
  }

  function degerlendir(o, digerleri) {
    var istem = 'Bir tıp öğrencisinin kişisel çalışma uygulaması C.A.R.V.I.S. için gelen geliştirme önerisini değerlendir.\nUygulamanın mevcut parçaları: ' + MODULLER + '\n' +
      (digerleri.length ? 'Kutudaki diğer öneriler (öncelik karşılaştırması için): ' + digerleri.map(function (x) { return '- ' + (x.baslik || x.metin.slice(0, 60)); }).join('\n') + '\n' : '') +
      'ÖNERİ: "' + o.metin + '"\n' +
      'Dürüst ol: teknik olarak ücretsiz araçlarla yapılabilir mi, ne kadar emek ister. fayda ve zorluk 1-5; oncelik 0-100 (yüksek = önce yapılmalı; kullanıcıya fayda yüksek ve zorluk düşükse yüksek). adimlar en çok 5 kısa madde. ' +
      'YALNIZ JSON: {"baslik":"en çok 6 kelime","ozet":"1-2 cümle","fayda":1-5,"zorluk":1-5,"oncelik":0-100,"adimlar":["…"],"riskler":"1 cümle","yapilabilir":true}';
    return ai(istem).then(function (j) {
      return { baslik: String(j.baslik || '').slice(0, 60), ozet: String(j.ozet || '').slice(0, 300), fayda: +j.fayda || 0, zorluk: +j.zorluk || 0, oncelik: Math.max(0, Math.min(100, +j.oncelik || 0)),
        adimlar: (j.adimlar || []).slice(0, 5).map(String), riskler: String(j.riskler || '').slice(0, 200), yapilabilir: j.yapilabilir !== false, t: Date.now() };
    });
  }
  function ekle(metin, kaynak) {
    metin = String(metin || '').trim(); if (!metin) return Promise.reject(new Error('Öneri boş.'));
    var o = { id: yeniId(), metin: metin.slice(0, 1200), kaynak: kaynak || 'ben', durum: 'acik', t: Date.now() };
    return guncelle(function (v) { v.liste.unshift(o); }).then(function () { return o; });
  }
  function degerlendirKaydet(id) {
    return oku().then(function (v) {
      var o = v.liste.filter(function (x) { return x.id === id; })[0]; if (!o) throw new Error('Öneri bulunamadı.');
      var diger = v.liste.filter(function (x) { return x.id !== id && x.durum === 'acik'; }).slice(0, 12).map(function (x) { return { metin: x.metin, baslik: x.d && x.d.baslik }; });
      return degerlendir(o, diger).then(function (d) { return guncelle(function (w) { w.liste.forEach(function (x) { if (x.id === id) x.d = d; }); }).then(function () { return d; }); });
    });
  }
  function aiKendiOnerisi() {
    return Promise.all([oku(), Depo.oku('sure').catch(function () { return {}; }), Depo.oku('eksikler').catch(function () { return {}; })]).then(function (r) {
      var v = r[0], sure = r[1] || {}, eks = (r[2] && r[2].liste) || [];
      var gun = Object.keys(sure).sort().slice(-7), toplam = gun.reduce(function (t, g) { return t + Object.keys(sure[g] || {}).reduce(function (a, k) { return a + (+sure[g][k] || 0); }, 0); }, 0);
      var istem = 'C.A.R.V.I.S. adlı kişisel tıp çalışma uygulamasının ürün yöneticisisin. Mevcut parçalar: ' + MODULLER + '\n' +
        'Kullanım özeti: son 7 günde toplam ' + Math.round(toplam) + ' dk çalışma; ' + eks.length + ' eksik kaydı.\n' +
        'Kutudaki öneriler (tekrar etme): ' + v.liste.slice(0, 20).map(function (x) { return '- ' + (x.d && x.d.baslik || x.metin.slice(0, 70)); }).join('\n') + '\n' +
        'Bu öğrencinin işine en çok yarayacak, ücretsiz araçlarla yapılabilir 3 YENİ geliştirme öner (somut, tek cümlelik istek gibi yaz). YALNIZ JSON: {"oneriler":["…","…","…"]}';
      return ai(istem).then(function (j) {
        var l = (j.oneriler || []).slice(0, 3).map(String).filter(Boolean);
        return l.reduce(function (z, m) { return z.then(function (acc) { return ekle(m, 'ai').then(function (o) { acc.push(o); return acc; }); }); }, Promise.resolve([]));
      });
    });
  }
  /* ---- Claude'a gönder (kullanıcı, 2026-11-03: "istekler otomatik Claude'a iletilsin; onaylarsam direkt senin önüne düşsün",
     "günde birkaç kez claude oturumu açılsın checklesin"). Onaylanan öneri GitHub'da "[Carvis] …" başlıklı iş olarak açılır;
     zamanlanmış Claude oturumları bu işleri alır, uygular ve işin altına yorum yazar. Anahtar yalnız bu cihazda. ---- */
  var REPO = 'IHunterX0/IHunterX0';
  function ghAnahtar() { try { return localStorage.getItem('github_is_anahtari') || ''; } catch (e) { return ''; } }
  function gh(yol, o) {
    var k = ghAnahtar(); if (!k) return Promise.reject(new Error('GitHub iş anahtarı girilmemiş (aşağıdaki "Claude bağlantısı" bölümü).'));
    var url = 'https://api.github.com' + yol, opt = { method: (o && o.method) || 'GET', headers: { Authorization: 'Bearer ' + k, Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28', 'User-Agent': 'CARVIS' } };
    if (o && o.body) { opt.body = JSON.stringify(o.body); opt.headers['Content-Type'] = 'application/json'; }
    var ag = window.yerelAyar && window.yerelAyar.ag ? window.yerelAyar.ag(url, opt) : fetch(url, opt);
    return ag.then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { if (!r.ok) throw new Error('GitHub ' + r.status + ': ' + (j.message || '') + (r.status === 403 || r.status === 404 ? ' — anahtarın bu repoda "Issues: Read and write" izni olmalı.' : '')); return j; }); });
  }
  function claudeyaGonder(id) {
    return oku().then(function (v) {
      var o = v.liste.filter(function (x) { return x.id === id; })[0]; if (!o) throw new Error('Öneri bulunamadı.');
      if (o.is) return o.is;
      var baslik = '[Carvis] ' + ((o.d && o.d.baslik) || o.metin.slice(0, 60));
      var govde = topluIstem([o]) + '\n\n---\n_Carvis öneri kutusundan, kullanıcı onayıyla gönderildi · öneri-id: ' + o.id + '_';
      return gh('/repos/' + REPO + '/issues', { method: 'POST', body: { title: baslik, body: govde } }).then(function (j) {
        var is = { no: j.number, url: j.html_url, t: Date.now() };
        return guncelle(function (w) { w.liste.forEach(function (x) { if (x.id === id) { x.is = is; x.onay = true; } }); }).then(function () { return is; });
      });
    });
  }
  function isDurumu(o) {
    if (!o.is) return Promise.resolve(null);
    return Promise.all([gh('/repos/' + REPO + '/issues/' + o.is.no), gh('/repos/' + REPO + '/issues/' + o.is.no + '/comments?per_page=5')]).then(function (r) {
      var is = r[0], y = r[1] || [], son = y[y.length - 1];
      return { acik: is.state === 'open', yorum: son ? String(son.body || '').replace(/\s+/g, ' ').slice(0, 220) : '', yorumSayisi: is.comments || 0 };
    });
  }
  function istemMetni(o, sira) {
    var d = o.d || {};
    return (sira ? sira + '. ' : '') + (d.baslik || 'İstek') + '\n' +
      'İstek (' + (o.kaynak === 'ai' ? 'Carvis önerisi' : 'kullanıcı') + '): ' + o.metin + '\n' +
      (d.ozet ? 'Özet: ' + d.ozet + '\n' : '') +
      (d.adimlar && d.adimlar.length ? 'Önerilen plan:\n' + d.adimlar.map(function (a) { return '  - ' + a; }).join('\n') + '\n' : '') +
      (d.riskler ? 'Riskler: ' + d.riskler + '\n' : '') +
      (d.oncelik != null ? 'Öncelik: ' + d.oncelik + '/100 · fayda ' + d.fayda + '/5 · zorluk ' + d.zorluk + '/5\n' : '');
  }
  function topluIstem(liste) {
    return 'C.A.R.V.I.S. (repo IHunterX0/IHunterX0, branch claude/carvis-apk-app-on9wp0) için öneri kutusundan istekler, öncelik sırasıyla. ' +
      'Her birini sırayla ele al; uygulamadan önce kısa plan ver, test et, APK olarak gönder.\n\n' + liste.map(function (o, i) { return istemMetni(o, i + 1); }).join('\n');
  }
  function kopyala(t) {
    var ok = function () { U.toast('Kopyalandı — Claude\'a yapıştır'); };
    try { if (navigator.clipboard && navigator.clipboard.writeText) return navigator.clipboard.writeText(t).then(ok, function () { yedekKopya(t); ok(); }); } catch (e) {}
    yedekKopya(t); ok();
  }
  function yedekKopya(t) { var a = el('textarea', { style: 'position:fixed;opacity:0' }); a.value = t; document.body.appendChild(a); a.select(); try { document.execCommand('copy'); } catch (e) {} a.remove(); }
  function sirala(l) {
    return l.slice().sort(function (a, b) {
      var da = a.durum === 'acik' ? 0 : 1, db = b.durum === 'acik' ? 0 : 1; if (da !== db) return da - db;
      var pa = a.d ? a.d.oncelik : -1, pb = b.d ? b.d.oncelik : -1; if (pa !== pb) return pb - pa;
      return (b.t || 0) - (a.t || 0);
    });
  }

  /* ---------------- stil ---------------- */
  var css = document.createElement('style');
  css.textContent = [
    '.ok-kart{position:relative;border:1px solid var(--holo-kenar,var(--cizgi));border-radius:var(--r);padding:12px 14px;margin:10px 0;background:linear-gradient(160deg,rgba(94,231,255,.07),transparent 60%)}',
    '.ok-kart.kapali{opacity:.5}',
    '.ok-ust{display:flex;gap:10px;align-items:flex-start}.ok-puan{min-width:54px;text-align:center;font:600 20px var(--f-kod,monospace);color:var(--holo,#5ee7ff);text-shadow:0 0 10px rgba(94,231,255,.4)}.ok-puan small{display:block;font-size:9.5px;letter-spacing:.12em;color:var(--metin-sonuk)}',
    '.ok-govde{flex:1;min-width:0}.ok-govde b{display:block;font-size:15px}.ok-govde p{margin:4px 0}.ok-etiket{display:inline-block;font:600 10px var(--f-kod,monospace);letter-spacing:.12em;padding:1px 6px;border:1px solid currentColor;margin-right:6px}',
    '.ok-ai{color:var(--holo-sicak,#ffb547)}.ok-ben{color:var(--holo,#5ee7ff)}',
    '.ok-adim{margin:4px 0 0 18px;padding:0;font-size:13px;color:var(--metin-sonuk)}',
    '.ok-dugmeler{display:flex;gap:6px;flex-wrap:wrap;margin-top:8px}',
    '.ok-giris{display:grid;gap:8px}.ok-giris textarea{width:100%;min-height:80px;background:var(--zemin);border:1px solid var(--cizgi);border-radius:6px;color:var(--metin);padding:10px;font:15px var(--f-govde)}'
  ].join('\n');
  document.head.appendChild(css);

  /* ---------------- sayfa ---------------- */
  U.GORUNUMLER.oneriler = function () {
    var ana = $('#ana'); ana.innerHTML = '';
    var sayfa = el('div', { class: 'sayfa' }); ana.appendChild(sayfa);
    sayfa.appendChild(el('div', { class: 'kahraman' }, [el('div', { class: 'ust-etiket', text: 'Geliştirme' }), el('h1', { text: 'Öneri kutusu' }),
      el('p', { class: 'var-etiket', text: 'Uygulamayı geliştirmek için fikirler. Sen ekle ya da Carvis\'e söyle ("Carvis, öneri kutusuna … ekle"); yapay zekâ değerlendirip önceliklendirir, kendi fikirlerini de ekler. Kopyalayıp Claude\'a yapıştır.' })]));
    var durum = el('p', { class: 'var-etiket', 'aria-live': 'polite' });
    var metin = el('textarea', { placeholder: 'Ne olsun? Ör. "Kartlarda ses kaydıyla cevap verebileyim"', 'aria-label': 'Yeni öneri' });
    var ekleD = el('button', { class: 'dugme ana', type: 'button', text: '＋ Ekle ve değerlendir' });
    var aiD = el('button', { class: 'dugme', type: 'button', text: '✦ Carvis kendi önerilerini eklesin' });
    var kopyaD = el('button', { class: 'dugme', type: 'button', text: '📋 Açık önerilerin hepsini kopyala' });
    var degD = el('button', { class: 'dugme', type: 'button', text: '↻ Değerlendirilmemişleri değerlendir' });
    sayfa.appendChild(el('div', { class: 'ok-giris' }, [metin, el('div', { class: 'ok-dugmeler' }, [ekleD, aiD, degD, kopyaD]), durum]));
    var liste = el('div'); sayfa.appendChild(liste);
    var ghIn = el('input', { type: 'password', value: ghAnahtar(), placeholder: 'GitHub iş anahtarı (github_pat_…)', autocomplete: 'off', style: 'flex:1;min-width:220px;background:var(--zemin);border:1px solid var(--cizgi);border-radius:6px;color:var(--metin);padding:8px 10px' });
    var ghSonuc = el('p', { class: 'var-etiket', 'aria-live': 'polite' });
    sayfa.appendChild(el('div', { class: 'ok-kart' }, [el('b', { text: '🔗 Claude bağlantısı' }),
      el('p', { class: 'var-etiket', text: 'Onayladığın öneriler GitHub\'da "[Carvis] …" işi olarak açılır; Claude günde birkaç kez bakıp uygular ve işin altına yazar. Gereken: yalnız ' + REPO + ' reposu için "Issues: Read and write" izinli bir GitHub anahtarı (github.com/settings/personal-access-tokens/new → Only select repositories → ' + REPO + ' → Repository permissions → Issues: Read and write). Anahtar yalnız bu cihazda saklanır.' }),
      el('div', { class: 'ok-dugmeler' }, [ghIn, el('button', { class: 'dugme kucuk', type: 'button', text: 'Kaydet ve dene', onclick: function () { try { localStorage.setItem('github_is_anahtari', ghIn.value.trim()); } catch (e) {} ghSonuc.textContent = 'Deneniyor…'; gh('/repos/' + REPO).then(function (j) { ghSonuc.textContent = '✓ Bağlandı: ' + j.full_name + (j.private ? ' (gizli)' : ' (HERKESE AÇIK — gizli yapman önerilir)') + (j.has_issues === false ? ' · ⚠ bu repoda Issues kapalı: Settings → Features → Issues' : ''); }, function (e) { ghSonuc.textContent = '✗ ' + e.message; }); } })]), ghSonuc]));
    function ciz() {
      return oku().then(function (v) {
        liste.innerHTML = '';
        var l = sirala(v.liste);
        if (!l.length) { liste.appendChild(el('p', { class: 'bos', text: 'Henüz öneri yok.' })); return; }
        l.forEach(function (o) {
          var d = o.d || null;
          var kart = el('div', { class: 'ok-kart' + (o.durum !== 'acik' ? ' kapali' : '') }, [
            el('div', { class: 'ok-ust' }, [
              el('div', { class: 'ok-puan' }, [d ? String(d.oncelik) : '—', el('small', { text: 'ÖNCELİK' })]),
              el('div', { class: 'ok-govde' }, [
                el('div', {}, [el('span', { class: 'ok-etiket ' + (o.kaynak === 'ai' ? 'ok-ai' : 'ok-ben'), text: o.kaynak === 'ai' ? 'CARVIS' : 'SEN' }), o.durum === 'yapildi' ? el('span', { class: 'ok-etiket', text: 'YAPILDI' }) : o.durum === 'reddedildi' ? el('span', { class: 'ok-etiket', text: 'VAZGEÇİLDİ' }) : null]),
                el('b', { text: d && d.baslik ? d.baslik : o.metin.slice(0, 80) }),
                el('p', { text: o.metin }),
                d ? el('p', { class: 'var-etiket', text: d.ozet + ' · fayda ' + d.fayda + '/5 · zorluk ' + d.zorluk + '/5' + (d.yapilabilir ? '' : ' · ⚠ zor/belirsiz') }) : el('p', { class: 'var-etiket', text: 'Henüz değerlendirilmedi.' }),
                d && d.adimlar.length ? el('ul', { class: 'ok-adim' }, d.adimlar.map(function (a) { return el('li', { text: a }); })) : null,
                d && d.riskler ? el('p', { class: 'var-etiket', text: 'Risk: ' + d.riskler }) : null
              ])
            ]),
            el('div', { class: 'ok-dugmeler' }, [
              o.is ? el('a', { class: 'dugme kucuk', href: o.is.url, target: '_blank', rel: 'noopener', text: '↗ İş #' + o.is.no }) :
                o.durum === 'acik' ? el('button', { class: 'dugme kucuk ana', type: 'button', text: '✓ Onayla → Claude\'a gönder', onclick: function () { var b = this; b.disabled = true; b.textContent = 'Gönderiliyor…'; claudeyaGonder(o.id).then(function () { durum.textContent = '✓ Gönderildi: Claude bir sonraki kontrolde ele alacak.'; ciz(); }, function (e) { b.disabled = false; b.textContent = '✓ Onayla → Claude\'a gönder'; durum.textContent = '✗ ' + e.message; }); } }) : null,
              o.is ? el('button', { class: 'dugme kucuk', type: 'button', text: '🔄 Claude ne dedi?', onclick: function () { var b = this; b.textContent = 'Bakılıyor…'; isDurumu(o).then(function (d) { b.textContent = '🔄 Claude ne dedi?'; durum.textContent = d ? ('İş #' + o.is.no + ' · ' + (d.acik ? 'açık' : 'kapandı (tamam)') + ' · ' + d.yorumSayisi + ' yorum' + (d.yorum ? ' · son: ' + d.yorum : '')) : ''; if (d && !d.acik) guncelle(function (w) { w.liste.forEach(function (x) { if (x.id === o.id) x.durum = 'yapildi'; }); }).then(ciz); }, function (e) { b.textContent = '🔄 Claude ne dedi?'; durum.textContent = '✗ ' + e.message; }); } }) : null,
              el('button', { class: 'dugme kucuk', type: 'button', text: '📋 Kopyala', onclick: function () { kopyala(topluIstem([o])); } }),
              el('button', { class: 'dugme kucuk', type: 'button', text: d ? '↻ Yeniden değerlendir' : '✦ Değerlendir', onclick: function () { var b = this; b.disabled = true; b.textContent = 'Değerlendiriliyor…'; degerlendirKaydet(o.id).then(ciz, function (e) { b.disabled = false; b.textContent = '✦ Değerlendir'; durum.textContent = '✗ ' + e.message; }); } }),
              o.durum === 'acik' ? el('button', { class: 'dugme kucuk', type: 'button', text: '✓ Yapıldı', onclick: function () { guncelle(function (v) { v.liste.forEach(function (x) { if (x.id === o.id) x.durum = 'yapildi'; }); }).then(ciz); } })
                : el('button', { class: 'dugme kucuk', type: 'button', text: '↺ Yeniden aç', onclick: function () { guncelle(function (v) { v.liste.forEach(function (x) { if (x.id === o.id) x.durum = 'acik'; }); }).then(ciz); } }),
              o.durum === 'acik' ? el('button', { class: 'dugme kucuk', type: 'button', text: '✕ Vazgeç', onclick: function () { guncelle(function (v) { v.liste.forEach(function (x) { if (x.id === o.id) x.durum = 'reddedildi'; }); }).then(ciz); } }) : null,
              el('button', { class: 'dugme kucuk', type: 'button', text: '🗑', title: 'Sil', onclick: function () { if (!confirm('Öneri silinsin mi?')) return; guncelle(function (v) { v.liste = v.liste.filter(function (x) { return x.id !== o.id; }); }).then(ciz); } })
            ])
          ]);
          liste.appendChild(kart);
        });
      });
    }
    ekleD.addEventListener('click', function () {
      var m = metin.value.trim(); if (!m) { metin.focus(); return; }
      ekleD.disabled = true; durum.textContent = 'Eklendi, değerlendiriliyor…';
      ekle(m, 'ben').then(function (o) { metin.value = ''; ciz(); return degerlendirKaydet(o.id); }).then(function () { durum.textContent = '✓ Eklendi ve değerlendirildi.'; ciz(); }, function (e) { durum.textContent = 'Eklendi; değerlendirme olmadı: ' + e.message; ciz(); }).then(function () { ekleD.disabled = false; });
    });
    aiD.addEventListener('click', function () {
      aiD.disabled = true; durum.textContent = 'Carvis düşünüyor…';
      aiKendiOnerisi().then(function (l) { ciz(); durum.textContent = l.length + ' öneri eklendi, değerlendiriliyor…'; return l.reduce(function (z, o) { return z.then(function () { return degerlendirKaydet(o.id).catch(function () {}); }); }, Promise.resolve()); })
        .then(function () { durum.textContent = '✓ Carvis\'in önerileri eklendi.'; ciz(); }, function (e) { durum.textContent = '✗ ' + e.message; }).then(function () { aiD.disabled = false; });
    });
    degD.addEventListener('click', function () {
      degD.disabled = true;
      oku().then(function (v) {
        var l = v.liste.filter(function (x) { return !x.d && x.durum === 'acik'; });
        durum.textContent = l.length ? l.length + ' öneri değerlendiriliyor…' : 'Değerlendirilmemiş öneri yok.';
        return l.reduce(function (z, o, i) { return z.then(function () { durum.textContent = (i + 1) + '/' + l.length + ' değerlendiriliyor…'; return degerlendirKaydet(o.id).then(ciz).catch(function (e) { durum.textContent = '✗ ' + e.message; }); }); }, Promise.resolve());
      }).then(function () { degD.disabled = false; });
    });
    kopyaD.addEventListener('click', function () { oku().then(function (v) { var l = sirala(v.liste).filter(function (x) { return x.durum === 'acik'; }); if (!l.length) { durum.textContent = 'Açık öneri yok.'; return; } kopyala(topluIstem(l)); }); });
    ciz();
  };
  U.SEKMELER.push({ id: 'oneriler', ad: 'Öneri kutusu', ikon: '💡' });
  if (U.sekmeleriCiz) U.sekmeleriCiz();

  // İlk açılışta kullanıcının 2026-11-03'te söylediği fikirler (bir kez)
  oku().then(function (v) {
    if (v.tohum) return;
    return guncelle(function (w) { w.tohum = true; BASLANGIC.slice().reverse().forEach(function (m) { w.liste.unshift({ id: yeniId(), metin: m, kaynak: 'ben', durum: 'acik', t: Date.now() }); }); });
  }).catch(function () {});

  /* ---------------- Carvis aracı ---------------- */
  var eskiEk = U.sohbetEkAraclari;
  U.sohbetEkAraclari = function () {
    return (eskiEk ? eskiEk() : []).concat([{
      name: 'oneri_ekle', description: 'Kullanıcının uygulama için geliştirme fikrini/isteğini öneri kutusuna ekler ve yapay zekâyla değerlendirir ("öneri kutusuna ekle", "şöyle bir özellik olsa", "bunu not al geliştirme için").',
      inputSchema: { type: 'object', properties: { oneri: { type: 'string', description: 'İsteğin kendisi, kullanıcının sözleriyle ve net' } }, required: ['oneri'] },
      execute: function (g) { return ekle(g.oneri, 'ben').then(function (o) { return degerlendirKaydet(o.id).then(function (d) { return { eklendi: true, baslik: d.baslik, oncelik: d.oncelik }; }, function () { return { eklendi: true, degerlendirme: 'sonra yapılacak' }; }); }); }
    }]);
  };
  window.OneriKutusu = { ekle: ekle, oku: oku, degerlendir: degerlendirKaydet, kendi: aiKendiOnerisi, istem: topluIstem };
})();
