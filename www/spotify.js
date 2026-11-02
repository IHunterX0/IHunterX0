/* 1001 — Spotify (BETA) (kullanıcı, 2026-11-02: "spotify'ımı içine portla; şarkı değiştirmek için uygulama değişmeyeyim;
   playlistlerimden, beğenilen şarkılarımdan yola çıksın; ruh halimi söyleyeyim, şarkı önersin; beta sürümü gibi olsun").
   - Giriş: Spotify PKCE (sunucusuz). Kullanıcı kendi Spotify geliştirici uygulamasının Client ID'sini girer.
     Yönlendirme adresi uygulamanın kendi adresidir; Android tarafı accounts.spotify.com'u WebView içinde açar.
   - Kütüphane: beğenilen şarkılar (en çok 1000), en çok dinlenenler (kısa/orta vade), kendi listelerin (ilk 12 liste).
     Spotify yeni uygulamalara öneri/ses özelliği API'lerini kapattığı için ruh hâline göre seçimi Gemini yapar.
   - Çalma: Spotify Connect (tabletteki Spotify arka planda çalar, uygulama değişmez; Premium gerekir).
     Premium yoksa duraklat/sonraki/önceki Android medya tuşlarıyla, şarkı başlatma Spotify'da açarak yapılır.
   - Carvis araçları: spotify_ruh_hali, spotify_kontrol. */
(function () {
  'use strict';
  var U = window.Uygulama; if (!U) return;
  if (/[?&]gomulu\b/.test(location.search)) return;
  var el = U.el, $ = U.$, $$ = U.$$, K = window.AndroidKopru || null;
  var YONLENDIR = location.origin + location.pathname;
  var KAPSAM = ['user-library-read', 'playlist-read-private', 'playlist-read-collaborative', 'playlist-modify-private', 'user-top-read',
    'user-read-playback-state', 'user-modify-playback-state', 'user-read-currently-playing', 'user-read-recently-played'].join(' ');
  var API = 'https://api.spotify.com/v1';
  var ANAHTAR = 'spotify_v1', KUTU_ANAHTAR = 'spotify_kutuphane_v1', KARISIM_ANAHTAR = 'spotify_karisimlar_v1';

  function oku(k, v) { try { var x = localStorage.getItem(k); return x ? JSON.parse(x) : v; } catch (e) { return v; } }
  function yaz(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  var D = oku(ANAHTAR, {}); // { clientId, erisim, yenile, bitis, ben:{id,ad}, premium }
  function kaydet() { yaz(ANAHTAR, D); }

  /* ---------------- giriş (PKCE) ---------------- */
  function rastgele(n) { var a = new Uint8Array(n); crypto.getRandomValues(a); return Array.prototype.map.call(a, function (b) { return ('0' + b.toString(16)).slice(-2); }).join(''); }
  function b64url(buf) { return btoa(String.fromCharCode.apply(null, new Uint8Array(buf))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''); }
  function baglan() {
    if (!D.clientId) return Promise.reject(new Error('Önce Client ID gir.'));
    var dogrulayici = rastgele(48), durum = rastgele(8);
    return crypto.subtle.digest('SHA-256', new TextEncoder().encode(dogrulayici)).then(function (h) {
      yaz('spotify_pkce', { v: dogrulayici, s: durum });
      location.href = 'https://accounts.spotify.com/authorize?' + new URLSearchParams({
        client_id: D.clientId, response_type: 'code', redirect_uri: YONLENDIR, scope: KAPSAM,
        code_challenge_method: 'S256', code_challenge: b64url(h), state: durum
      }).toString();
    });
  }
  function tokenIste(govde) {
    return fetch('https://accounts.spotify.com/api/token', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams(govde).toString() })
      .then(function (r) { return r.json().then(function (j) { if (!r.ok) throw new Error(j.error_description || j.error || ('token ' + r.status)); return j; }); })
      .then(function (j) { D.erisim = j.access_token; if (j.refresh_token) D.yenile = j.refresh_token; D.bitis = Date.now() + (j.expires_in - 60) * 1000; kaydet(); });
  }
  // Spotify'dan dönüş: ?code=… adresten hemen silinir (yönlendirme son satırda #muzik'i açar), takas arka planda yapılır
  var donus = null;
  (function () {
    var q = new URLSearchParams(location.search);
    if (!q.has('code') && !q.has('error')) return;
    var p = oku('spotify_pkce', null); try { localStorage.removeItem('spotify_pkce'); } catch (e) {}
    history.replaceState(null, '', location.pathname + '#muzik');
    if (q.has('error')) { donus = Promise.reject(new Error(q.get('error') === 'access_denied' ? 'Spotify izni verilmedi.' : q.get('error'))); return; }
    if (!p || p.s !== q.get('state')) { donus = Promise.reject(new Error('Giriş doğrulanamadı, tekrar dene.')); return; }
    donus = tokenIste({ grant_type: 'authorization_code', code: q.get('code'), redirect_uri: YONLENDIR, client_id: D.clientId, code_verifier: p.v })
      .then(function () { return api('/me'); })
      .then(function (m) { D.ben = { id: m.id, ad: m.display_name || m.id }; D.premium = m.product === 'premium'; kaydet(); kutuphaneYukle(true).catch(function () {}); });
    donus.catch(function () {});
  })();
  function bagli() { return !!(D.clientId && D.yenile); }
  function erisim() {
    if (D.erisim && Date.now() < D.bitis) return Promise.resolve(D.erisim);
    if (!D.yenile) return Promise.reject(new Error('Spotify bağlı değil.'));
    return tokenIste({ grant_type: 'refresh_token', refresh_token: D.yenile, client_id: D.clientId }).then(function () { return D.erisim; })
      .catch(function (e) { if (/invalid_grant|revoked/i.test(e.message)) { D.erisim = D.yenile = null; kaydet(); } throw e; });
  }
  // Spotify geliştirici modunda istek sınırı düşük: 429 gelince Retry-After kadar HİÇ istek atılmaz (soğuma),
  // uzun beklemeler kullanıcıyı dondurmaz; her istek 12 sn'de zaman aşımına uğrar.
  var soguma = oku('spotify_soguma', 0);
  function sogumaKaldi() { return Math.max(0, soguma - Date.now()); }
  var hataKaydi = [];
  function hataKaydet(yol, e) { hataKaydi.unshift({ t: new Date().toLocaleTimeString('tr-TR'), yol: String(yol).replace(API, '').split('?')[0], durum: e.durum || '-', neden: e.neden || '', m: String(e.message || e).slice(0, 160) }); hataKaydi.length = Math.min(hataKaydi.length, 12); }
  // Spotify'ın İngilizce hatalarını ne yapılacağıyla birlikte Türkçeye çevirir (kaynak: Spotify Şubat/Mart 2026 geliştirici modu kuralları)
  function cevir(e) {
    var m = String(e && e.message || e || ''), d = e && e.durum, n = e && e.neden;
    if (n === 'QUOTA_EXCEEDED') return 'Spotify geliştirici kotası doldu (hesap başına sayılıyor). Bir süre sonra tekrar dene; bu sırada yerel mod çalışmaya devam eder.';
    if (d === 403 && /premium/i.test(m) && !/player|playback/i.test(m)) return 'Spotify, Mart 2026\'dan beri geliştirici uygulamalarının çalışması için uygulama SAHİBİNİN Premium olmasını şart koşuyor. Hesabın Premium değilse "Spotify hesabı" bağlantısı çalışmaz — yerel mod (bildirim erişimiyle) yine çalışır.';
    if (d === 403 && /regist|user may not|developer dashboard|not.*allow/i.test(m)) return 'Spotify hesabın, geliştirici panelindeki uygulamanın "User Management" listesinde yok. developer.spotify.com/dashboard → uygulaman → User Management → kendi adını ve Spotify e-postanı ekle.';
    if (d === 403 && /premium/i.test(m)) return 'Bu işlem (uygulama içinden çalma) Spotify Premium istiyor; yerel mod Premium istemez.';
    if (d === 401) return 'Spotify oturumu geçersiz; "Bağlantıyı kes" deyip yeniden bağlan.';
    return m;
  }
  var ard429 = 0; // art arda kota hatası: Retry-After okunamazsa bekleme 30 sn → 1 → 2 → 4 … en çok 10 dk
  function sogumaHatasi() { var sn = Math.ceil(sogumaKaldi() / 1000); var h = new Error('Spotify istek sınırı doldu; ' + (sn > 90 ? Math.ceil(sn / 60) + ' dk' : sn + ' sn') + ' sonra tekrar dene.'); h.durum = 429; return h; }
  function api(yol, o, tekrar) {
    o = o || {};
    if (sogumaKaldi() > 0) return Promise.reject(sogumaHatasi());
    return erisim().then(function (t) {
      var ctl = new AbortController(), zm = setTimeout(function () { ctl.abort(); }, 12000);
      return fetch(/^https:/.test(yol) ? yol : API + yol, { method: o.method || 'GET', signal: ctl.signal, headers: { Authorization: 'Bearer ' + t, 'Content-Type': 'application/json' }, body: o.body ? JSON.stringify(o.body) : undefined })
        .finally(function () { clearTimeout(zm); })
        .catch(function (e) { throw new Error(e && e.name === 'AbortError' ? 'Spotify cevap vermedi (zaman aşımı).' : 'Spotify\'a ulaşılamadı: ' + (e && e.message || e)); });
    }).then(function (r) {
      if (r.status === 401 && !tekrar) { D.bitis = 0; return api(yol, o, true); }
      if (r.status === 429) {
        var s = +r.headers.get('Retry-After') || 0;
        if (s && s <= 4 && !tekrar) return new Promise(function (ok) { setTimeout(ok, s * 1000); }).then(function () { return api(yol, o, true); });
        ard429++; soguma = Date.now() + Math.max(s, Math.min(30 * Math.pow(2, ard429 - 1), 600)) * 1000; yaz('spotify_soguma', soguma);
        throw sogumaHatasi();
      }
      if (r.ok) ard429 = 0;
      if (r.status === 204 || r.status === 202) return null;
      return r.text().then(function (m) {
        var j = null; try { j = m ? JSON.parse(m) : null; } catch (e) {}
        if (!r.ok) { var h = new Error((j && j.error && (j.error.message || j.error)) || ('Spotify ' + r.status)); h.durum = r.status; h.neden = j && j.error && j.error.reason; hataKaydet(yol, h); throw h; }
        return j;
      });
    });
  }

  /* ---------------- kütüphane ---------------- */
  // İstek bütçesi: ~15 istek (önceden ~40). 24 saatte bir, arka planda, istekler arası kısa ara ile taranır.
  var Kutu = oku(KUTU_ANAHTAR, null); // { t, sarkilar:[{id,u,a,s,k}], listeler:[{id,ad,n}] }  k: kaynak etiketi
  function iz(t) { return t && t.id && !t.is_local ? { id: t.id, u: t.uri, a: t.name, s: (t.artists || []).map(function (x) { return x.name; }).join(', ') } : null; }
  var yukleniyor = null;
  function kutuphaneYukle(zorla) {
    if (!bagli()) return Promise.reject(new Error('Spotify bağlı değil.'));
    if (!zorla && Kutu && Kutu.sarkilar.length) {
      if (Date.now() - Kutu.t > 24 * 3600e3 && !yukleniyor) setTimeout(function () { kutuphaneYukle(true).catch(function () {}); }, 4000); // eskiyse arkada tazele
      return Promise.resolve(Kutu);
    }
    if (yukleniyor) return yukleniyor;
    var harita = {}, sira = [], listeler = [], n = 0;
    function ekle(t, k) { var x = iz(t); if (!x) return; if (harita[x.id]) { if (harita[x.id].k.indexOf(k) < 0) harita[x.id].k += ',' + k; return; } x.k = k; harita[x.id] = x; sira.push(x); }
    function istek(yol) { n++; durumYaz('Kütüphane taranıyor… (' + n + ')'); return bekle(150).then(function () { return api(yol); }); }
    function sayfalar(yol, sinir, isle) {
      var say = 0;
      function sayfa(url) { return istek(url).then(function (j) { (j.items || []).forEach(isle); say += (j.items || []).length; if (j.next && say < sinir) return sayfa(j.next); }); }
      return sayfa(yol);
    }
    yukleniyor = istek('/me/top/tracks?limit=50&time_range=short_term').then(function (j) { (j.items || []).forEach(function (t) { ekle(t, 'son'); }); }).catch(function () {})
      .then(function () { return istek('/me/top/tracks?limit=50&time_range=medium_term').then(function (j) { (j.items || []).forEach(function (t) { ekle(t, 'favori'); }); }).catch(function () {}); })
      .then(function () { return sayfalar('/me/tracks?limit=50', 400, function (it) { ekle(it.track || it.item, 'begeni'); }).catch(function (e) { if (e.durum === 429) throw e; }); })
      .then(function () { return istek('/me/playlists?limit=50').then(function (j) { (j.items || []).forEach(function (p) { if (p) listeler.push({ id: p.id, ad: p.name, n: (p.tracks || p.items || {}).total || 0, sahip: p.owner && D.ben && p.owner.id === D.ben.id }); }); }).catch(function () {}); })
      .then(function () {
        var kendi = listeler.filter(function (l) { return l.sahip; }).slice(0, 4);
        return kendi.reduce(function (z, l) {
          return z.then(function () { if (sogumaKaldi()) return; var isle = function (j) { (j.items || []).forEach(function (it) { ekle(it.item || it.track, 'liste:' + l.ad); }); };
            return istek('/playlists/' + l.id + '/items?limit=50').then(isle).catch(function (e) { if (e.durum === 429) return; return istek('/playlists/' + l.id + '/tracks?limit=50').then(isle); }).catch(function () {}); });
        }, Promise.resolve());
      })
      .then(function () {
        if (!sira.length) { if (sogumaKaldi()) throw sogumaHatasi(); throw new Error('Kütüphanede şarkı bulunamadı.'); }
        Kutu = { t: Date.now(), sarkilar: sira, listeler: listeler }; yaz(KUTU_ANAHTAR, Kutu); durumYaz(''); return Kutu;
      })
      .catch(function (e) { durumYaz(''); if (Kutu && Kutu.sarkilar.length) return Kutu; throw e; }) // tarama yarıda kalırsa eski önbellekle devam
      .finally(function () { yukleniyor = null; });
    return yukleniyor;
  }

  /* ---------------- ruh hâli → karışım ---------------- */
  // Hız + kota: yapay zekâya en çok 220 satır gider, "hafif" yoldan (Groq varsa orası, yoksa Gemini'nin hafif modelleri;
  // değerli Gemini flash kotası harcanmaz). Aynı ruh hâli 6 saat önbellekte. Yapay zekâ cevap vermezse yerel karışım.
  // Liste dışı "yeni" öneriler karışım ÇALMAYA BAŞLADIKTAN sonra aranır ve sıraya eklenir (beklemeyi uzatmaz).
  function karisimlar() { return oku(KARISIM_ANAHTAR, []); }
  function karisimSakla(k) { var h = karisimlar().filter(function (x) { return x.id !== k.id; }); h.unshift(k); yaz(KARISIM_ANAHTAR, h.slice(0, 8)); }
  function jsonAyikla(m) { var a = m.indexOf('{'), b = m.lastIndexOf('}'); if (a < 0 || b < a) throw new Error('Öneri okunamadı.'); return JSON.parse(m.slice(a, b + 1)); }
  function katla2(t) { return String(t || '').toLocaleLowerCase('tr').replace(/[^\p{L}\p{N} ]/gu, ' ').replace(/\s+/g, ' ').trim(); }
  function karistir(l) { l = l.slice(); for (var i = l.length - 1; i > 0; i--) { var j = Math.random() * (i + 1) | 0, t = l[i]; l[i] = l[j]; l[j] = t; } return l; }
  var Zevk = oku('spotify_zevk', '');
  function kutuKaynak() {
    function yerelKutu() { return { t: 0, sarkilar: Dinlenen.map(function (x, i) { return { id: 'y' + i, u: null, a: x.a, s: x.s, k: 'son' }; }), listeler: [] }; }
    function sec(x) { return x && x.sarkilar && x.sarkilar.length ? x : yerelKutu(); }
    if (!bagli()) return Promise.resolve(sec(Kutu));
    return kutuphaneYukle(false).then(sec, function () { return sec(Kutu); });
  }
  function satirdanSarki(q, i) { var p = String(q).split(/\s+[-–—]\s+/); return { id: 'n' + Date.now().toString(36) + i, u: null, s: p.length > 1 ? p[0].trim() : '', a: (p.length > 1 ? p.slice(1).join(' - ') : p[0]).trim(), yeni: true }; }
  function yeniCevir(k) {
    var y = (k.yeniAra || []).map(satirdanSarki); k.yeniAra = []; if (!y.length) return;
    var l = []; k.sarkilar.forEach(function (x, i) { l.push(x); if (i % 4 === 3 && y.length) l.push(y.shift()); }); k.sarkilar = l.concat(y);
  }
  // Kütüphane yoksa (Spotify hesabı bağlı değil / kullanılamıyor): yazdığın zevk + yerelde dinlediklerinden 15 şarkı önerir
  function zevktenOner(kutu, ruh) {
    var ipucu = kutu.sarkilar.slice(0, 40).map(function (x) { return x.a + ' — ' + x.s; }).join('; ');
    var istem = 'Sen bir DJ\'sin. Tıp öğrencisi kullanıcının ruh hâli: "' + ruh + '". Saat ' + new Date().getHours() + ':00.\n' +
      (Zevk ? 'Sevdiği sanatçılar/türler: ' + Zevk + '\n' : '') + (ipucu ? 'Son dinledikleri: ' + ipucu + '\n' : '') +
      'Bu ruh hâline ve zevkine uyan, Spotify\'da GERÇEKTEN var olan 15 şarkı öner; akış ruh hâlini yakalayıp istenen yöne taşısın. Ders/odak isteniyorsa az sözlü olanları öne al. Zevk bilgisi azsa Türk ve yabancı karışık, bilinen şarkılar seç.\n' +
      'YALNIZ JSON yaz: {"baslik":"2-4 kelime","yorum":"1-2 samimi Türkçe cümle","yeni":["Sanatçı - Şarkı"]}';
    var zaman = new Promise(function (_, red) { setTimeout(function () { red(new Error('yapay zekâ 25 sn\'de cevap vermedi')); }, 25000); });
    return Promise.race([U.Y.sample(istem, { cache: false, hafif: true }), zaman]).then(function (c) {
      var j = jsonAyikla(c.text || ''), l = (j.yeni || []).slice(0, 18).map(satirdanSarki).filter(function (x) { return x.a; });
      l.forEach(function (x) { x.yeni = false; });
      if (l.length < 3) throw new Error('öneri boş geldi');
      var k = { id: Date.now().toString(36), ruh: ruh, baslik: j.baslik || ruh, yorum: j.yorum || '', sarkilar: l, yeniAra: [], t: Date.now() };
      karisimSakla(k); return k;
    }, function (e) {
      if (kutu.sarkilar.length >= 5) return yerelKarisim(kutu, ruh, 'zaman aşımı/kota');
      var m = String(e && (e.code || e.message) || e);
      throw new Error(/rate|kota|429/i.test(m) ? 'Yapay zekâ kotası şu an dolu; biraz sonra tekrar dene.' : 'Yapay zekâ cevap vermedi: ' + (e && e.message || e));
    });
  }
  function yerelKarisim(kutu, ruh, neden) {
    var tercih = kutu.sarkilar.filter(function (x) { return /son|favori/.test(x.k); }), digeri = kutu.sarkilar.filter(function (x) { return !/son|favori/.test(x.k); });
    var l = karistir(tercih).slice(0, 12).concat(karistir(digeri).slice(0, 6));
    return { id: Date.now().toString(36), ruh: ruh, baslik: 'Senin favorilerin', yorum: 'Yapay zekâ şu an cevap vermedi (' + neden + '); en çok dinlediklerinden karışık bir liste kurdum.', sarkilar: l, yeniAra: [], t: Date.now(), yerel: true };
  }
  function ruhHalindenOner(ruh, taze) {
    ruh = String(ruh || '').trim(); if (!ruh) return Promise.reject(new Error('Ruh hâlini yaz.'));
    var anahtar = katla2(ruh);
    var onbellek = taze ? null : karisimlar().filter(function (x) { return !x.yerel && katla2(x.ruh) === anahtar && Date.now() - x.t < 6 * 3600e3; })[0];
    if (onbellek) return Promise.resolve(Object.assign({}, onbellek, { yeniAra: [], onbellekten: true }));
    return Promise.all([kutuKaynak(), U.AI ? U.AI.hazir().catch(function () { return false; }) : Promise.resolve(!!(U.Y && U.Y.sample))]).then(function (r) {
      var kutu = r[0];
      if (!r[1]) { if (kutu.sarkilar.length >= 5) return yerelKarisim(kutu, ruh, 'yapay zekâ anahtarı yok'); throw new Error('Öneri için yapay zekâ gerekiyor: Gemini anahtarını gir (ya da Spotify\'da birkaç şarkı dinle, onlardan karıştırayım).'); }
      if (kutu.sarkilar.length < 15) return zevktenOner(kutu, ruh);
      var l = kutu.sarkilar.slice().sort(function (a, b) { function p(x) { return /son/.test(x.k) ? 0 : /favori/.test(x.k) ? 1 : /begeni/.test(x.k) ? 2 : 3; } return p(a) - p(b); });
      l = l.slice(0, 120).concat(karistir(l.slice(120)).slice(0, 100)); // en çok dinlenenler + kütüphaneden rastgele bir kesit
      var istem = 'Sen bir DJ\'sin. Tıp öğrencisi kullanıcının ruh hâli: "' + ruh + '". Saat ' + new Date().getHours() + ':00.\n' +
        'Aşağıdaki KENDİ şarkılarından (numara|şarkı — sanatçı) bu ruh hâline en uygun 15 tanesini seç; tempo, enerji ve sözlerin duygusunu düşün, akış ruh hâlini yakalayıp istenen yöne taşısın. Ders/odak isteniyorsa az sözlü olanları öne al. ' +
        'Ayrıca zevkine uyan ama listede OLMAYAN, gerçekten var olan 4 şarkı öner.\n' +
        'YALNIZ JSON yaz: {"baslik":"2-4 kelime","yorum":"1-2 samimi Türkçe cümle","secim":[numaralar],"yeni":["Sanatçı - Şarkı"]}\n\n' +
        l.map(function (x, i) { return i + '|' + x.a.slice(0, 50) + ' — ' + x.s.split(',')[0].slice(0, 30); }).join('\n');
      var zaman = new Promise(function (_, red) { setTimeout(function () { red(new Error('yapay zekâ 25 sn\'de cevap vermedi')); }, 25000); });
      return Promise.race([U.Y.sample(istem, { cache: false, hafif: true }), zaman]).then(function (c) {
        var j = jsonAyikla(c.text || ''), g = {};
        var secim = (j.secim || []).map(function (i) { return l[+i]; }).filter(function (x) { if (!x || g[x.id]) return false; g[x.id] = 1; return true; });
        if (secim.length < 3) throw new Error('öneri boş geldi');
        var k = { id: Date.now().toString(36), ruh: ruh, baslik: j.baslik || ruh, yorum: j.yorum || '', sarkilar: secim, yeniAra: (j.yeni || []).slice(0, 4), t: Date.now() };
        if (YEREL) yeniCevir(k); // yerel mod aramayla çaldığı için Spotify araması gerekmez
        karisimSakla(k);
        return k;
      }).catch(function (e) {
        var m = String(e && (e.code || e.message) || e);
        return yerelKarisim(kutu, ruh, /rate|kota|429/i.test(m) ? 'kota doldu' : /cevap vermedi/.test(m) ? 'zaman aşımı' : 'hata');
      });
    });
  }
  // Liste dışı önerileri sırayla ara (en çok 4 istek), karışıma ekle; çalıyorsa sıraya (queue) koy
  function yenileriEkle(k, caliyor) {
    var l = (k.yeniAra || []).slice(); k.yeniAra = [];
    var eklenen = [], g = {}; k.sarkilar.forEach(function (x) { g[x.id] = 1; });
    return l.reduce(function (z, q) {
      return z.then(function () {
        if (sogumaKaldi()) return;
        return api('/search?type=track&limit=1&q=' + encodeURIComponent(q)).then(function (s) {
          var t = iz(s && s.tracks && s.tracks.items && s.tracks.items[0]); if (!t || g[t.id]) return; g[t.id] = 1; t.yeni = true; eklenen.push(t); k.sarkilar.push(t);
          if (caliyor) return api('/me/player/queue?uri=' + encodeURIComponent(t.u), { method: 'POST' }).catch(function () {});
        }).catch(function () {});
      });
    }, Promise.resolve()).then(function () { if (eklenen.length) karisimSakla(k); return eklenen; });
  }

  /* ---------------- çalma ---------------- */
  function bekle(ms) { return new Promise(function (ok) { setTimeout(ok, ms); }); }
  function hataMetni(e) { return cevir(e) + (e && e.durum ? ' [Spotify ' + e.durum + (e.neden ? ' · ' + e.neden : '') + ']' : ''); }
  function spotifydaAc(uri) { try { location.href = uri; } catch (e) {} }
  function oneDon() { try { if (K && K.oneGetir && K.onPlandaMi && !K.onPlandaMi()) K.oneGetir(); } catch (e) {} }
  function cihazBul() {
    return api('/me/player/devices').then(function (d) {
      var l = ((d && d.devices) || []).filter(function (x) { return !x.is_restricted; });
      l.sort(function (a, b) { function p(x) { return x.is_active ? 0 : /tablet|smartphone/i.test(x.type) ? 1 : 2; } return p(a) - p(b); });
      return l[0] || null;
    });
  }
  // Spotify kapalıysa: uygulamayı uyandır, cihaz listesinde görünene kadar bekle (en çok ~14 sn)
  function spotifyUyandir(uri) {
    spotifydaAc(uri);
    var t0 = Date.now();
    return (function dene() { return bekle(1500).then(cihazBul).then(function (c) { return c || (Date.now() - t0 > 14000 ? null : dene()); }); })();
  }
  function premiumTazele() {
    return api('/me').then(function (m) { D.premium = m.product === 'premium'; if (!D.ben) D.ben = { id: m.id, ad: m.display_name || m.id }; kaydet(); return D.premium; }).catch(function () { return D.premium; });
  }
  // Premium olmadan: karışımı Spotify listesi olarak kaydet ve listeyi Spotify'da aç (tek şarkı değil, bütün karışım)
  function listeOlarakAc(k) {
    return karisimiKaydet(k).then(function (p) { spotifydaAc('spotify:playlist:' + p.id); return 'liste'; });
  }
  // uriler: çalınacak şarkılar; bas: başlangıç sırası; k: (varsa) karışım — Premium yoksa liste olarak açmak için
  function cal(uriler, bas, k) {
    uriler = uriler.slice(0, 100); bas = bas || 0;
    var govde = { uris: uriler, offset: { position: bas } };
    function oynat(c) { return api('/me/player/play' + (c ? '?device_id=' + encodeURIComponent(c.id) : ''), { method: 'PUT', body: govde }); }
    function premiumYok(e) {
      D.premium = false; kaydet();
      if (k) return listeOlarakAc(k).then(function () { throw Object.assign(new Error('Premium olmadığı için uygulama içinden başlatılamıyor; karışım Spotify\'a liste olarak kaydedildi ve açıldı (oradan ▶ ile baştan sona çalar).'), { bilgi: true }); });
      spotifydaAc(uriler[bas]); throw e;
    }
    return oynat(null).catch(function (e) {
      if (e.durum === 404 || e.neden === 'NO_ACTIVE_DEVICE') {
        return cihazBul().then(function (c) {
          if (c) return api('/me/player', { method: 'PUT', body: { device_ids: [c.id], play: false } }).catch(function () {}).then(function () { return bekle(500); }).then(function () { return oynat(c); });
          return spotifyUyandir(uriler[bas]).then(function (c2) {
            if (!c2) throw new Error('Spotify açıldı ama tablet cihaz olarak görünmedi. Spotify\'da herhangi bir şarkıyı bir kez başlatıp geri dön, sonra tekrar dene.');
            return oynat(c2).then(function () { setTimeout(oneDon, 700); });
          });
        });
      }
      if (e.durum === 403) {
        if (e.neden === 'PREMIUM_REQUIRED' || /premium/i.test(e.message)) return premiumYok(e);
        return premiumTazele().then(function (pr) { if (!pr) return premiumYok(e); throw e; });
      }
      throw e;
    }).then(function () { D.premium = true; kaydet(); setTimeout(simdiYenile, 900); });
  }
  function kontrolApi(komut) {
    var yol = { duraklat: ['PUT', '/me/player/pause', 'duraklat'], devam: ['PUT', '/me/player/play', 'oynat'], sonraki: ['POST', '/me/player/next', 'sonraki'], onceki: ['POST', '/me/player/previous', 'onceki'] }[komut];
    if (!yol) return Promise.reject(new Error('Bilinmeyen komut'));
    var yedek = function () { if (K && K.medya) { K.medya(yol[2]); return null; } throw new Error('Kontrol edilemedi.'); };
    return (bagli() && D.premium !== false ? api(yol[1], { method: yol[0] }).catch(yedek) : Promise.resolve().then(yedek)).then(function () { setTimeout(simdiYenile, 700); });
  }
  /* ---------------- liste kaydetme ---------------- */
  // Spotify 2026'da bazı uç noktaları değiştirdi (/playlists/{id}/tracks → /items, /users/{id}/playlists → /me/playlists): ikisi de denenir
  function eskiyeDus(e) { return e && (e.durum === 404 || e.durum === 405 || e.durum === 410 || e.durum === 403); }
  function listeOlustur(ad, aciklama) {
    var g = { name: ad, public: false, description: aciklama };
    return api('/me/playlists', { method: 'POST', body: g }).catch(function (e) {
      if (!eskiyeDus(e) || !D.ben) throw e;
      return api('/users/' + encodeURIComponent(D.ben.id) + '/playlists', { method: 'POST', body: g }).catch(function () { throw e; });
    });
  }
  function listeyeEkle(id, uriler) {
    var parcalar = []; for (var i = 0; i < uriler.length; i += 100) parcalar.push(uriler.slice(i, i + 100));
    return parcalar.reduce(function (z, p) {
      return z.then(function () {
        return api('/playlists/' + id + '/items', { method: 'POST', body: { uris: p } }).catch(function (e) {
          if (!eskiyeDus(e)) throw e;
          return api('/playlists/' + id + '/tracks', { method: 'POST', body: { uris: p } }).catch(function () { throw e; });
        });
      });
    }, Promise.resolve());
  }
  function karisimiKaydet(k) {
    if (k.listeId) return Promise.resolve({ id: k.listeId });
    return listeOlustur('1001 · ' + k.baslik, 'Carvis karışımı — "' + k.ruh + '"').then(function (p) {
      return listeyeEkle(p.id, k.sarkilar.map(function (x) { return x.u; })).then(function () {
        k.listeId = p.id; var h = karisimlar(); h.forEach(function (x) { if (x.id === k.id) x.listeId = p.id; }); yaz(KARISIM_ANAHTAR, h);
        return p;
      });
    });
  }

  /* ---------------- şimdi çalıyor + mini oynatıcı ---------------- */
  /* ---------------- YEREL MOD: Android medya oturumu (Web API yok, kota yok, Premium yok, uygulama değişmez) ---------------- */
  var SURUM = '2026.11.02-r13';
  var YEREL = !!(K && K.spotifyDurum && K.spotifyCal);
  function yDurum() { if (!YEREL) return null; try { return JSON.parse(K.spotifyDurum() || '{}'); } catch (e) { return null; } }
  function sade(t) { return String(t || '').toLocaleLowerCase('tr').replace(/\(.*?\)|\[.*?\]/g, '').replace(/ - .*$/, '').replace(/[^\p{L}\p{N}]/gu, ''); }
  function izinHatasi() { var e = new Error('Carvis\'in Spotify\'ı uygulamadan çıkmadan kontrol edebilmesi için "Bildirim erişimi" izni gerekiyor (Ayarlar → Bildirim erişimi → C.A.R.V.I.S.).'); e.izin = true; return e; }
  var Dinlenen = oku('spotify_dinlenen', []); // yerelde görülen şarkılar → API yokken zevk kaynağı
  function dinlenenEkle(d) { if (!d.baslik) return; var k = sade(d.baslik) + '|' + sade(d.sanatci); if (Dinlenen.some(function (x) { return x.k === k; })) return; Dinlenen.unshift({ k: k, a: d.baslik, s: d.sanatci || '' }); Dinlenen = Dinlenen.slice(0, 300); yaz('spotify_dinlenen', Dinlenen); }
  var Kuyruk = null; // { k, i, t, onceki, bizim, konum, sure }
  function yerelSarkiCal(x, d) {
    if (x.u && d && (d.eylemler & 8192)) { var r = K.spotifyUri(x.u); if (r === 'ok') return r; } // ACTION_PLAY_FROM_URI
    return K.spotifyCal((x.a + ' ' + String(x.s || '').split(',')[0]).trim());
  }
  function yerelBaslat(k, i) {
    return Promise.resolve().then(function () {
      var d = yDurum(); if (!d) throw new Error('Yerel Spotify kontrolü bu sürümde yok.');
      if (d.izin === false) throw izinHatasi();
      var x = k.sarkilar[i || 0]; if (!x) throw new Error('Karışım boş.');
      Kuyruk = { k: k, i: i || 0, t: Date.now(), onceki: d.baslik || '', bizim: null };
      if (!d.var) { // Spotify kapalı: bir kez açılır (başlatmanın tek yolu), sonra Carvis'e dönülür
        K.muzik((x.a + ' ' + String(x.s || '').split(',')[0]).trim(), 'spotify');
        setTimeout(function () { try { if (K.onPlandaMi && !K.onPlandaMi()) K.oneGetir(); } catch (e) {} }, 7000);
        return 'acildi';
      }
      var r = yerelSarkiCal(x, d);
      if (r === 'izin_yok') throw izinHatasi();
      if (r === 'oturum_yok') { K.muzik((x.a + ' ' + x.s).trim(), 'spotify'); setTimeout(function () { try { if (!K.onPlandaMi()) K.oneGetir(); } catch (e) {} }, 7000); return 'acildi'; }
      if (r !== 'ok') throw new Error('Spotify komutu kabul etmedi (' + r + ').');
      setTimeout(simdiYenile, 1500);
      return 'ok';
    });
  }
  function ilerle(n) {
    if (!Kuyruk) return false;
    var j = Kuyruk.i + n; if (j < 0 || j >= Kuyruk.k.sarkilar.length) { Kuyruk = null; return false; }
    var d = yDurum() || {};
    Kuyruk.i = j; Kuyruk.t = Date.now(); Kuyruk.onceki = d.baslik || ''; Kuyruk.bizim = null;
    yerelSarkiCal(Kuyruk.k.sarkilar[j], d); setTimeout(simdiYenile, 1500); kuyrukCiz();
    return true;
  }
  // Kuyruk bekçisi: yerel (ağsız) yoklama. Şarkımız bitip Spotify başka şarkıya geçince sıradakini çalar;
  // kullanıcı Spotify'da elle başka şarkı seçerse (bizimki bitmeden) karışımı bırakır.
  setInterval(function () {
    if (!YEREL) return;
    var d = yDurum(); if (!d || !d.var) return;
    if (d.calisiyor) dinlenenEkle(d);
    if (!Kuyruk) return;
    if (!Kuyruk.bizim) {
      if (d.calisiyor && d.baslik && (d.baslik !== Kuyruk.onceki || Date.now() - Kuyruk.t > 6000)) { Kuyruk.bizim = d.baslik; Kuyruk.konum = d.konum || 0; Kuyruk.sure = d.sure || 0; Kuyruk.calar = true; Kuyruk.ornekT = Date.now(); }
      else if (Date.now() - Kuyruk.t > 45000) Kuyruk = null;
      return;
    }
    if (d.baslik === Kuyruk.bizim) { Kuyruk.konum = d.konum || 0; Kuyruk.sure = d.sure || 0; Kuyruk.calar = !!d.calisiyor; Kuyruk.ornekT = Date.now(); if (!d.calisiyor && Kuyruk.sure && Kuyruk.konum >= Kuyruk.sure - 2500) ilerle(1); return; }
    // Şarkı değişti: bizimki bitmiş miydi? Son ölçümden bu yana geçen süreyi de say (arka planda zamanlayıcılar seyrekleşir)
    var tahmin = (Kuyruk.konum || 0) + (Kuyruk.calar ? Date.now() - (Kuyruk.ornekT || Date.now()) : 0);
    var bitmisti = !Kuyruk.sure || tahmin >= Kuyruk.sure - 9000;
    if (bitmisti) ilerle(1); else Kuyruk = null;
  }, 2500);
  function kontrol(komut) {
    if (YEREL) {
      var d = yDurum();
      if (d && d.izin !== false && d.var) {
        if (Kuyruk && (komut === 'sonraki' || komut === 'onceki') && ilerle(komut === 'sonraki' ? 1 : -1)) return Promise.resolve();
        var r = K.spotifyKomut(komut === 'devam' ? 'oynat' : komut);
        if (r === 'ok') { setTimeout(simdiYenile, 600); return Promise.resolve(); }
      }
    }
    return kontrolApi(komut);
  }
  function karisimCal(k, i) {
    if (YEREL) return yerelBaslat(k, i);
    var l = k.sarkilar.slice(i || 0).filter(function (x) { return x.u; }).map(function (x) { return x.u; });
    if (!l.length) return Promise.reject(new Error('Bu karışım yalnız cihaz sürümünde çalınabilir.'));
    return cal(l, 0, k).then(function () { return 'ok'; });
  }
  function calMesaji(r) { return r === 'acildi' ? 'Spotify kapalıydı: bir kez açtım, birkaç saniyede buraya dönüyorum. Sonraki şarkılar kendiliğinden sıralanır.' : '▶ Çalıyor — Spotify arka planda, uygulamadan çıkmadın.'; }

  var Simdi = null;
  var mini = el('div', { class: 'sp-mini', hidden: true, role: 'region', 'aria-label': 'Spotify' });
  document.body.appendChild(mini);
  function simdiYenile() {
    if (document.hidden) return Promise.resolve();
    var d = yDurum();
    if (d && d.var && d.baslik) {
      Simdi = { a: d.baslik, s: d.sanatci || '', kapak: d.kapak ? { url: d.kapak } : null, calisiyor: !!d.calisiyor, ilerleme: d.konum || 0, sure: d.sure || 1, alindi: Date.now() };
      miniCiz(); simdiKartCiz(); return Promise.resolve();
    }
    if (YEREL && d && d.izin !== false) { Simdi = null; miniCiz(); simdiKartCiz(); return Promise.resolve(); }
    if (!bagli()) return Promise.resolve();
    return api('/me/player/currently-playing').then(function (j) {
      Simdi = j && j.item ? { a: j.item.name, s: (j.item.artists || []).map(function (x) { return x.name; }).join(', '), kapak: ((j.item.album || {}).images || []).slice(-2)[0], calisiyor: !!j.is_playing, ilerleme: j.progress_ms || 0, sure: j.item.duration_ms || 1, alindi: Date.now() } : null;
      miniCiz(); simdiKartCiz();
    }).catch(function () {});
  }
  // Yoklama: yerel modda ağ yok (3 sn); API modunda yalnız müzik sayfasında/çalarken 15 sn
  setInterval(function () { if (YEREL && !document.hidden) simdiYenile(); }, 3000);
  setInterval(function () { if (!YEREL && bagli() && !document.hidden && !sogumaKaldi() && (U.Durum.gorunum === 'muzik' || (Simdi && Simdi.calisiyor))) simdiYenile(); }, 15000);
  setInterval(function () { if (Simdi && Simdi.calisiyor && U.Durum.gorunum === 'muzik') cubukGuncelle(); }, 1000);
  document.addEventListener('visibilitychange', function () { if (!document.hidden) simdiYenile(); });
  function dugme(t, et, f) { return el('button', { class: 'sp-d', type: 'button', 'aria-label': et, title: et, onclick: function (e) { e.stopPropagation(); f(); } }, [t]); }
  function miniCiz() {
    if (!Simdi || U.Durum.gorunum === 'muzik') { mini.hidden = true; return; }
    mini.hidden = false; mini.innerHTML = '';
    mini.classList.toggle('calar', Simdi.calisiyor);
    mini.appendChild(el('div', { class: 'sp-disk', style: Simdi.kapak ? 'background-image:url("' + Simdi.kapak.url + '")' : '' }));
    mini.appendChild(el('button', { class: 'sp-bilgi', type: 'button', onclick: function () { U.git('muzik'); } }, [el('b', { text: Simdi.a }), el('small', { text: Simdi.s })]));
    mini.appendChild(dugme('⏮', 'Önceki', function () { kontrol('onceki'); }));
    mini.appendChild(dugme(Simdi.calisiyor ? '⏸' : '▶', Simdi.calisiyor ? 'Duraklat' : 'Çal', function () { kontrol(Simdi.calisiyor ? 'duraklat' : 'devam'); }));
    mini.appendChild(dugme('⏭', 'Sonraki', function () { kontrol('sonraki'); }));
    mini.appendChild(el('div', { class: 'sp-ekolayzer', 'aria-hidden': 'true' }, [el('i'), el('i'), el('i'), el('i')]));
  }
  window.addEventListener('hashchange', function () { setTimeout(miniCiz, 50); });

  /* ---------------- stil ---------------- */
  var css = document.createElement('style');
  css.textContent = [
    '.sp-beta{display:inline-block;font:600 10px var(--f-kod);letter-spacing:.2em;color:#04121a;background:var(--holo-sicak,#ffb547);padding:2px 7px;margin-left:10px;vertical-align:middle;clip-path:polygon(5px 0,100% 0,100% calc(100% - 5px),calc(100% - 5px) 100%,0 100%,0 5px);-webkit-text-fill-color:#04121a}',
    '.sp-kutu{position:relative;margin:14px 0;padding:18px;border:1px solid var(--holo-kenar,rgba(94,231,255,.38));background:var(--holo-tarama),linear-gradient(160deg,rgba(94,231,255,.10),rgba(4,14,22,.7) 60%);clip-path:var(--kesik);box-shadow:var(--holo-isik)}',
    '.sp-kutu h2{margin:0 0 10px;font:600 13px var(--f-kod);letter-spacing:.24em;color:var(--holo,#5ee7ff)}.sp-kutu h2::before{content:"▸ ";color:var(--holo-sicak,#ffb547)}',
    '.sp-adim{margin:6px 0 6px 18px;padding:0}.sp-adim li{margin:6px 0}',
    '.sp-kod{display:flex;gap:8px;align-items:center;flex-wrap:wrap}.sp-kod code{font:12px var(--f-kod);background:rgba(94,231,255,.08);border:1px solid rgba(94,231,255,.25);padding:4px 8px;word-break:break-all}',
    '.sp-satir{display:flex;gap:8px;flex-wrap:wrap;align-items:center}.sp-satir input{flex:1;min-width:200px;background:rgba(2,10,16,.8);border:1px solid rgba(94,231,255,.35);color:var(--metin);padding:12px 14px;font:16px var(--f-baslik)}',
    '.sp-ruh input{font-size:18px;padding:14px 16px;box-shadow:inset 0 0 20px rgba(94,231,255,.08)}',
    '.sp-cipler{display:flex;gap:8px;flex-wrap:wrap;margin-top:10px}',
    '.sp-simdi{display:grid;grid-template-columns:auto 1fr;gap:18px;align-items:center}',
    '.sp-kapak{width:132px;height:132px;background:#061018 center/cover;border:1px solid var(--holo-kenar);box-shadow:0 0 30px rgba(94,231,255,.25);clip-path:var(--kesik);position:relative}',
    '.sp-kapak::after{content:"";position:absolute;inset:0;background:var(--holo-tarama),linear-gradient(120deg,transparent 30%,rgba(255,255,255,.18) 50%,transparent 70%);mix-blend-mode:screen}',
    '.sp-simdi b{display:block;font:600 20px var(--f-baslik);color:#eafcff;text-shadow:0 0 14px rgba(94,231,255,.4)}.sp-simdi small{color:var(--metin-sonuk)}',
    '.sp-cubuk{height:3px;background:rgba(94,231,255,.15);margin:12px 0 10px;position:relative}.sp-cubuk i{position:absolute;left:0;top:0;bottom:0;background:var(--holo);box-shadow:0 0 10px var(--holo)}',
    '.sp-kontroller{display:flex;gap:8px}',
    '.sp-liste{display:grid;gap:2px;margin-top:12px;counter-reset:sp}',
    '.sp-sarki{display:grid;grid-template-columns:28px 1fr auto;gap:10px;align-items:center;padding:8px 10px;border-left:2px solid transparent;cursor:pointer;background:none;border-top:0;border-right:0;border-bottom:1px solid rgba(94,231,255,.08);color:inherit;text-align:left;font:inherit;opacity:0;animation:hudOge .3s ease-out forwards}',
    '.sp-sarki:hover{background:rgba(94,231,255,.08);border-left-color:var(--holo)}.sp-sarki .n{font:12px var(--f-kod);color:var(--metin-cok-sonuk)}',
    '.sp-sarki b{display:block;font-weight:600}.sp-sarki small{color:var(--metin-sonuk)}',
    '.sp-yeni{font:600 9.5px var(--f-kod);letter-spacing:.15em;color:var(--holo-sicak,#ffb547);border:1px solid currentColor;padding:1px 5px}',
    '.sp-durum{font:12px var(--f-kod);color:var(--metin-sonuk);letter-spacing:.05em}',
    '.sp-hata{color:var(--kotu)}',
    '.sp-sarki.simdi{background:rgba(94,231,255,.14);border-left-color:var(--holo)}.sp-sarki.simdi .n{color:var(--holo)}',
    '.sp-rapor{white-space:pre-wrap;font:12px/1.5 var(--f-kod);background:rgba(2,10,16,.8);border:1px solid rgba(94,231,255,.25);padding:10px;margin-top:10px;max-height:320px;overflow:auto}',
    // mini oynatıcı
    '.sp-mini{position:fixed;z-index:58;left:50%;transform:translateX(-50%);bottom:calc(14px + env(safe-area-inset-bottom,0px));display:flex;align-items:center;gap:6px;padding:6px 10px 6px 6px;max-width:min(460px,calc(100vw - 180px));',
    'background:var(--holo-tarama),rgba(4,16,26,.88);border:1px solid var(--holo-kenar,rgba(94,231,255,.38));box-shadow:var(--holo-isik),0 10px 30px rgba(0,0,0,.5);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);clip-path:polygon(10px 0,100% 0,100% calc(100% - 10px),calc(100% - 10px) 100%,0 100%,0 10px)}',
    '.sp-mini[hidden]{display:none}',
    '.sp-disk{width:38px;height:38px;border-radius:50%;flex-shrink:0;background:#0a2230 center/cover;box-shadow:0 0 0 2px rgba(94,231,255,.35),0 0 14px rgba(94,231,255,.35)}',
    '.sp-mini.calar .sp-disk{animation:hudDon 8s linear infinite}',
    '.sp-bilgi{min-width:0;flex:1;background:none;border:0;color:inherit;text-align:left;padding:0 4px;cursor:pointer}.sp-bilgi b,.sp-bilgi small{display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:200px}',
    '.sp-bilgi b{font:600 13px var(--f-baslik)}.sp-bilgi small{font-size:11px;color:var(--metin-sonuk)}',
    '.sp-d{background:none;border:0;color:var(--holo,#5ee7ff);font-size:16px;width:32px;height:32px;cursor:pointer;text-shadow:0 0 8px currentColor}',
    '.sp-ekolayzer{display:flex;gap:2px;align-items:flex-end;height:16px;margin-left:2px}.sp-ekolayzer i{width:3px;height:30%;background:var(--holo);box-shadow:0 0 6px var(--holo)}',
    '.sp-mini.calar .sp-ekolayzer i{animation:spEq .9s ease-in-out infinite}.sp-mini.calar .sp-ekolayzer i:nth-child(2){animation-delay:.2s}.sp-mini.calar .sp-ekolayzer i:nth-child(3){animation-delay:.45s}.sp-mini.calar .sp-ekolayzer i:nth-child(4){animation-delay:.1s}',
    '@keyframes spEq{0%,100%{height:25%}50%{height:100%}}',
    '@media (max-width:640px){.sp-mini{left:12px;right:84px;transform:none;max-width:none}.sp-ekolayzer{display:none}.sp-simdi{grid-template-columns:1fr}.sp-kapak{width:100%;height:auto;aspect-ratio:1}}'
  ].join('\n');
  document.head.appendChild(css);

  /* ---------------- sayfa: #muzik ---------------- */
  var sayfaDurum = null, sonKarisim = karisimlar()[0] || null, simdiKap = null;
  function durumYaz(t) { if (sayfaDurum) sayfaDurum.textContent = t; }
  function hataGoster(kap, e) { kap.innerHTML = ''; kap.appendChild(el('p', { class: 'sp-hata', text: (e && e.message) || String(e) })); }
  function cubukGuncelle() {
    var i = simdiKap && simdiKap.querySelector('.sp-cubuk i'); if (!i || !Simdi) return;
    var oran = Math.min(1, (Simdi.ilerleme + (Simdi.calisiyor ? Date.now() - Simdi.alindi : 0)) / Simdi.sure);
    i.style.width = (oran * 100).toFixed(1) + '%';
    if (oran >= 1) { Simdi.ilerleme = 0; Simdi.alindi = Date.now(); setTimeout(simdiYenile, 1500); } // şarkı bitti: bir kez sor
  }
  function simdiKartCiz() {
    if (!simdiKap || !document.body.contains(simdiKap)) return;
    simdiKap.innerHTML = '';
    if (!Simdi) { simdiKap.appendChild(el('p', { class: 'sp-durum', text: 'Şu an çalan bir şey yok. Bir ruh hâli söyle, karışımı başlatayım.' })); return; }
    var oran = Math.min(1, (Simdi.ilerleme + (Simdi.calisiyor ? Date.now() - Simdi.alindi : 0)) / Simdi.sure);
    simdiKap.appendChild(el('div', { class: 'sp-simdi' }, [
      el('div', { class: 'sp-kapak', style: Simdi.kapak ? 'background-image:url("' + Simdi.kapak.url + '")' : '' }),
      el('div', {}, [el('b', { text: Simdi.a }), el('small', { text: Simdi.s }),
        el('div', { class: 'sp-cubuk' }, [el('i', { style: 'width:' + (oran * 100).toFixed(1) + '%' })]),
        el('div', { class: 'sp-kontroller' }, [
          el('button', { class: 'dugme', type: 'button', onclick: function () { kontrol('onceki'); } }, ['⏮']),
          el('button', { class: 'dugme ana', type: 'button', onclick: function () { kontrol(Simdi.calisiyor ? 'duraklat' : 'devam'); } }, [Simdi.calisiyor ? '⏸ Duraklat' : '▶ Çal']),
          el('button', { class: 'dugme', type: 'button', onclick: function () { kontrol('sonraki'); } }, ['⏭'])])])]));
  }
  function izinDugmesi() { return el('button', { class: 'dugme ana', type: 'button', onclick: function () { try { K.bildirimIzniAc(); } catch (e) {} } }, ['🔓 Bildirim erişimini aç']); }
  function hataYaz(yer, e) { yer.innerHTML = ''; yer.appendChild(el('span', { class: 'sp-hata', text: e && e.bilgi ? e.message : (e && e.izin ? e.message : hataMetni(e)) })); if (e && e.izin) { yer.appendChild(document.createTextNode(' ')); yer.appendChild(izinDugmesi()); } }
  function ruhKarisimCal(ruh, taze, kap) {
    return ruhHalindenOner(ruh, taze).then(function (k) {
      sonKarisim = k; if (kap) karisimCiz(kap, k);
      var yer = function () { var x = kap && kap.querySelector('.sp-durum.cal'); return x && sonKarisim === k ? x : null; };
      var d = function (t) { var x = yer(); if (x) x.textContent = t; };
      d('Başlatılıyor…');
      return karisimCal(k, 0).then(function (r) { d(calMesaji(r)); return true; }, function (e) { var x = yer(); if (x) hataYaz(x, e); k._hata = e; return false; })
        .then(function (caliyor) {
          var arka = YEREL ? Promise.resolve() : yenileriEkle(k, caliyor).then(function (yeni) { if (yeni.length && kap && sonKarisim === k) { karisimCiz(kap, k); d((caliyor ? '▶ Çalıyor · ' : '') + yeni.length + ' yeni öneri sıraya eklendi.'); } });
          return { k: k, caliyor: caliyor, arka: arka };
        });
    }, function (e) { if (kap) hataGoster(kap, e); throw e; }).catch(function (e) { return { hata: e }; });
  }
  function kuyrukCiz() { $$('.sp-sarki').forEach(function (b, i) { b.classList.toggle('simdi', !!(Kuyruk && Kuyruk.k === sonKarisim && Kuyruk.i === i)); }); }
  function karisimCiz(kap, k) {
    kap.innerHTML = '';
    if (!k) return;
    kap.appendChild(el('h2', { text: 'KARIŞIM // ' + k.baslik.toLocaleUpperCase('tr') }));
    if (k.yorum) kap.appendChild(el('p', { text: k.yorum }));
    if (k.onbellekten || k.yerel) kap.appendChild(el('p', { class: 'sp-durum' }, [k.onbellekten ? 'Bu ruh hâli için birkaç saat önce kurulan karışım. ' : '',
      el('button', { class: 'cip', type: 'button', onclick: function () { kap.innerHTML = '<div class="yukleniyor">Yeni karışım kuruluyor…</div>'; ruhKarisimCal(k.ruh, true, kap); } }, ['↻ Yeni karışım kur'])]));
    var durum = el('span', { class: 'sp-durum cal' });
    function basla(i) { durum.textContent = 'Başlatılıyor…'; karisimCal(k, i).then(function (r) { durum.textContent = calMesaji(r); kuyrukCiz(); }, function (e) { hataYaz(durum, e); }); }
    var satir = [el('button', { class: 'dugme ana', type: 'button', onclick: function () { basla(0); } }, ['▶ Hepsini çal'])];
    if (bagli()) satir.push(el('button', { class: 'dugme', type: 'button', onclick: function () { var b = this; b.disabled = true; durum.textContent = 'Spotify\'a kaydediliyor…'; karisimiKaydet(k).then(function () { durum.textContent = '✓ Listelerine eklendi: 1001 · ' + k.baslik; }, function (e) { b.disabled = false; durum.textContent = 'Kaydedilemedi: ' + hataMetni(e); }); } }, ['💾 Spotify\'a kaydet']));
    satir.push(durum);
    kap.appendChild(el('div', { class: 'sp-satir' }, satir));
    var l = el('div', { class: 'sp-liste' });
    k.sarkilar.forEach(function (x, i) {
      l.appendChild(el('button', { class: 'sp-sarki', type: 'button', style: 'animation-delay:' + Math.min(i * 30, 600) + 'ms', title: 'Buradan başlat', onclick: function () { basla(i); } },
        [el('span', { class: 'n', text: String(i + 1).padStart(2, '0') }), el('span', {}, [el('b', { text: x.a }), el('small', { text: x.s })]), x.yeni ? el('span', { class: 'sp-yeni', text: 'YENİ' }) : el('span')]));
    });
    kap.appendChild(l); kuyrukCiz();
  }
  /* ---------------- tanılama ---------------- */
  function tanila() {
    var r = ['C.A.R.V.I.S. ' + SURUM + ' · ' + new Date().toLocaleString('tr-TR')], sat = function (a, b) { r.push('• ' + a + ': ' + b); };
    var d = yDurum();
    sat('Yerel kontrol (Android köprüsü)', YEREL ? 'var' : 'YOK (bu sürüm eski ya da tarayıcı)');
    if (YEREL) {
      try { sat('Spotify yüklü', K.spotifyYuklu() ? 'evet' : 'HAYIR'); } catch (e) {}
      sat('Bildirim erişimi', d && d.izin ? 'verilmiş' : 'VERİLMEMİŞ → yerel mod çalışmaz');
      if (d && d.izin) {
        sat('Spotify oturumu', d.var ? (d.calisiyor ? 'çalıyor: ' : 'duraklatılmış: ') + (d.baslik || '?') + ' — ' + (d.sanatci || '?') : 'yok (Spotify kapalı; ilk çalmada bir kez açılır)');
        if (d.var) sat('Desteklenen', ['aramayla çal ' + ((d.eylemler & 2048) ? '✓' : '✗'), 'adresle çal ' + ((d.eylemler & 8192) ? '✓' : '✗'), 'sonraki ' + ((d.eylemler & 32) ? '✓' : '✗')].join(', '));
      }
    }
    sat('Kuyruk', Kuyruk ? (Kuyruk.i + 1) + '/' + Kuyruk.k.sarkilar.length + ' · ' + (Kuyruk.bizim || 'başlıyor') : 'yok');
    sat('Yerel dinleme geçmişi', Dinlenen.length + ' şarkı');
    sat('Spotify hesabı (isteğe bağlı)', !D.clientId ? 'kurulmadı' : !bagli() ? 'Client ID var, bağlı değil' : 'bağlı (' + (D.ben ? D.ben.ad : '?') + ', ' + (D.premium === true ? 'Premium' : D.premium === false ? 'Premium DEĞİL' : 'Premium bilinmiyor') + ')');
    if (sogumaKaldi()) sat('Spotify API soğuma', Math.ceil(sogumaKaldi() / 1000) + ' sn');
    sat('Kütüphane önbelleği', Kutu ? Kutu.sarkilar.length + ' şarkı' : 'yok');
    var api1 = bagli() && !sogumaKaldi() ? api('/me').then(function (m) { D.premium = m.product === 'premium'; kaydet(); sat('API /me', 'tamam · ürün: ' + m.product + (m.product !== 'premium' ? ' → Mart 2026 kuralı: geliştirici uygulaması için sahibin Premium olması gerekir' : '')); }, function (e) { sat('API /me', 'HATA ' + hataMetni(e)); }) : Promise.resolve();
    var ai = (U.AI ? U.AI.hazir() : Promise.resolve(false)).then(function (ok) { sat('Yapay zekâ', ok ? 'hazır' : 'KAPALI (anahtar yok)'); }, function () { sat('Yapay zekâ', 'hata'); });
    return Promise.all([api1, ai]).then(function () {
      if (hataKaydi.length) { r.push('Son Spotify API hataları:'); hataKaydi.forEach(function (h) { r.push('  ' + h.t + ' ' + h.yol + ' → ' + h.durum + ' ' + h.neden + ' ' + h.m); }); }
      return r.join('\n');
    });
  }
  var RUH_CIPLER = ['🎯 Odaklanmam lazım', '🌙 Gece ders çalışıyorum', '⚡ Enerji lazım', '🌧 Biraz hüzünlüyüm', '☀️ Keyfim yerinde', '😌 Sakinleşmek istiyorum', '🔥 Sınav öncesi motivasyon', '🧘 Stresliyim'];
  U.GORUNUMLER.muzik = function () {
    var ana = $('#ana'); ana.innerHTML = '';
    var sayfa = el('div', { class: 'sayfa' }); ana.appendChild(sayfa);
    sayfa.appendChild(el('div', { class: 'kahraman' }, [el('div', { class: 'ust-etiket', text: 'Ses modülü' }), el('h1', {}, ['Müzik', el('span', { class: 'sp-beta', text: 'BETA' })]),
      el('p', { class: 'var-etiket', text: 'Ruh hâlini söyle; Carvis bir karışım kurup Spotify\'da çalsın. Spotify arka planda çalar, uygulamadan çıkmazsın.' }),
      el('p', { class: 'sp-durum', text: 'Sürüm ' + SURUM + (YEREL ? ' · yerel mod' : ' · tarayıcı') })]));
    sayfaDurum = el('p', { class: 'sp-durum' });
    var d = yDurum();
    if (YEREL && d && d.izin === false) sayfa.appendChild(el('div', { class: 'sp-kutu' }, [el('h2', { text: 'TEK ADIM' }),
      el('p', { text: 'Carvis, Spotify\'ı uygulamadan çıkmadan çalıp durdurabilmek için Android\'in "Bildirim erişimi" iznine ihtiyaç duyuyor (Spotify hesabı, Premium ya da internet kotası gerekmez). Açılan listede C.A.R.V.I.S.\'i aç, sonra geri dön.' }),
      el('div', { class: 'sp-satir' }, [izinDugmesi(), el('button', { class: 'dugme', type: 'button', onclick: function () { U.git('muzik'); } }, ['↻ Kontrol et'])])]));
    if (!YEREL && !bagli()) { // tarayıcı: yalnız Spotify hesabıyla çalışır
      if (!D.clientId) kurulumCiz(sayfa); else baglantiCiz(sayfa);
      return;
    }
    simdiKap = el('div');
    sayfa.appendChild(el('div', { class: 'sp-kutu' }, [el('h2', { text: 'ŞİMDİ ÇALIYOR' }), simdiKap]));
    simdiKartCiz(); simdiYenile(); if (bagli()) premiumTazele();
    var giris = el('input', { type: 'text', placeholder: 'Bugün nasılsın? "yorgunum ama 2 saat daha çalışmam lazım"…', 'aria-label': 'Ruh hâli', enterkeyhint: 'go' });
    var oner = el('button', { class: 'dugme ana', type: 'button' }, ['✦ Öner']);
    var karisimKap = el('div', { class: 'sp-kutu', hidden: !sonKarisim });
    function calistir(ruh) {
      if (!String(ruh || '').trim()) { giris.focus(); return; }
      giris.value = ruh; oner.disabled = true; karisimKap.hidden = false;
      karisimKap.innerHTML = '<div class="yukleniyor">' + (bagli() && !Kutu ? 'Kütüphanen ilk kez taranıyor (bir kerelik), sonra seçilecek…' : 'Ruh hâline göre seçiliyor…') + '</div>';
      ruhKarisimCal(ruh, false, karisimKap).then(function () { oner.disabled = false; });
    }
    oner.addEventListener('click', function () { calistir(giris.value); });
    giris.addEventListener('keydown', function (e) { if (e.key === 'Enter') calistir(giris.value); });
    var ruhKutu = el('div', { class: 'sp-kutu sp-ruh' }, [el('h2', { text: 'RUH HÂLİ' }), el('div', { class: 'sp-satir' }, [giris, oner])]);
    var cipler = el('div', { class: 'sp-cipler' });
    RUH_CIPLER.forEach(function (c) { cipler.appendChild(el('button', { class: 'cip', type: 'button', onclick: function () { calistir(c.replace(/^\S+\s/, '')); } }, [c])); });
    ruhKutu.appendChild(cipler);
    var zevk = el('input', { type: 'text', value: Zevk, placeholder: 'Sevdiğin sanatçılar / türler (ör. Duman, Arctic Monkeys, lo-fi, Ludovico Einaudi)', 'aria-label': 'Müzik zevkin' });
    zevk.addEventListener('change', function () { Zevk = zevk.value.trim(); yaz('spotify_zevk', Zevk); U.toast('Zevkin kaydedildi'); });
    ruhKutu.appendChild(el('div', { class: 'sp-satir', style: 'margin-top:10px' }, [zevk]));
    ruhKutu.appendChild(el('p', { class: 'sp-durum', text: bagli() ? 'Öneriler Spotify kütüphanenden (beğeniler, en çok dinlediklerin, listelerin) seçilir.' : 'Öneriler yazdığın zevkten ve Spotify\'da dinlediklerinden (Carvis açıkken öğrenir: ' + Dinlenen.length + ' şarkı) kurulur. İstersen aşağıdan Spotify hesabını da bağlayabilirsin.' }));
    var gecmis = karisimlar().slice(0, 6);
    if (gecmis.length > 1) {
      var gl = el('div', { class: 'sp-cipler' }, [el('span', { class: 'sp-durum', text: 'Son karışımlar:' })]);
      gecmis.forEach(function (k) { gl.appendChild(el('button', { class: 'cip', type: 'button', onclick: function () { sonKarisim = k; karisimKap.hidden = false; karisimCiz(karisimKap, k); } }, [k.baslik])); });
      ruhKutu.appendChild(gl);
    }
    sayfa.appendChild(ruhKutu);
    sayfa.appendChild(karisimKap);
    if (sonKarisim) karisimCiz(karisimKap, sonKarisim);
    // Spotify hesabı (isteğe bağlı)
    var hesap = el('div', { class: 'sp-kutu' }, [el('h2', { text: 'SPOTIFY HESABI · İSTEĞE BAĞLI' })]);
    if (bagli()) {
      var kb = el('span', { class: 'sp-durum' });
      var kbYaz = function () { kb.textContent = Kutu ? Kutu.sarkilar.length + ' şarkı · ' + Kutu.listeler.length + ' liste · ' + new Date(Kutu.t).toLocaleString('tr-TR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) + ' taraması' : 'Kütüphane henüz taranmadı.'; };
      kbYaz();
      hesap.appendChild(el('p', { text: (D.ben ? D.ben.ad + ' olarak bağlı' : 'Bağlı') + (D.premium === false ? ' · Premium değil: Mart 2026\'dan beri Spotify, geliştirici uygulamaları için sahibin Premium olmasını istiyor; kütüphane okunamayabilir. Yerel mod etkilenmez.' : '.') }));
      hesap.appendChild(el('div', { class: 'sp-satir' }, [kb,
        el('button', { class: 'dugme', type: 'button', onclick: function () { var b = this; b.disabled = true; kutuphaneYukle(true).then(kbYaz, function (e) { kb.textContent = hataMetni(e); }).then(function () { b.disabled = false; }); } }, ['↻ Tazele']),
        el('button', { class: 'dugme', type: 'button', onclick: function () { if (!confirm('Spotify bağlantısı kesilsin mi?')) return; D = { clientId: D.clientId }; kaydet(); Kutu = null; try { localStorage.removeItem(KUTU_ANAHTAR); } catch (e) {} U.git('muzik'); } }, ['Bağlantıyı kes'])]));
      hesap.appendChild(sayfaDurum);
      if (!Kutu) kutuphaneYukle(false).then(kbYaz, function (e) { kb.textContent = hataMetni(e); });
    } else {
      hesap.appendChild(el('p', { text: 'Gerekli değil. Bağlarsan öneriler beğenilerinden ve listelerinden seçilir, karışımları Spotify\'a liste olarak kaydedebilirsin. Not: Spotify, Mart 2026\'dan beri bu bağlantı için hesabının Premium olmasını şart koşuyor.' }));
      var ic = el('div'); hesap.appendChild(ic);
      if (!D.clientId) ic.appendChild(el('button', { class: 'dugme', type: 'button', onclick: function () { ic.innerHTML = ''; kurulumCiz(ic); } }, ['Kurulumu göster'])); else baglantiCiz(ic);
    }
    sayfa.appendChild(hesap);
    // tanılama
    var rapor = el('pre', { class: 'sp-rapor', hidden: true });
    var kopya = el('button', { class: 'dugme', type: 'button', hidden: true, onclick: function () { try { navigator.clipboard.writeText(rapor.textContent); U.toast('Kopyalandı — Claude\'a yapıştır'); } catch (e) {} } }, ['Kopyala']);
    sayfa.appendChild(el('div', { class: 'sp-kutu' }, [el('h2', { text: 'TANILAMA' }),
      el('p', { class: 'sp-durum', text: 'Bir şey çalışmazsa buna bas, çıkan raporu kopyalayıp gönder.' }),
      el('div', { class: 'sp-satir' }, [el('button', { class: 'dugme', type: 'button', onclick: function () { rapor.hidden = false; rapor.textContent = 'Kontrol ediliyor…'; tanila().then(function (t) { rapor.textContent = t; kopya.hidden = false; }); } }, ['🩺 Tanılama çalıştır']), kopya]), rapor]));
  };
  function baglantiCiz(kap) {
    var hk = el('div');
    kap.appendChild(el('p', { text: 'Giriş sayfası uygulamanın içinde açılır (Google/Facebook ile giriş WebView\'da çalışmaz; e-posta ya da e-postana gelen kodla giriş yap).' }));
    kap.appendChild(el('div', { class: 'sp-satir' }, [el('button', { class: 'dugme ana', type: 'button', onclick: function () { baglan().catch(function (e) { hataGoster(hk, e); }); } }, ['🔗 Spotify\'a bağlan']),
      el('button', { class: 'dugme', type: 'button', onclick: function () { D.clientId = null; kaydet(); U.git('muzik'); } }, ['Client ID\'yi değiştir'])]));
    kap.appendChild(hk);
    if (donus) donus.then(function () { U.git('muzik'); }, function (e) { hk.innerHTML = ''; hk.appendChild(el('p', { class: 'sp-hata', text: hataMetni(e) })); });
  }
  U.SEKMELER.push({ id: 'muzik', ad: 'Müzik', ikon: '♫' });
  if (U.sekmeleriCiz) U.sekmeleriCiz();

  /* ---------------- Carvis araçları ---------------- */
  function araclar() {
    if (!YEREL && !bagli()) return [];
    return [
      { name: 'spotify_ruh_hali', description: 'Kullanıcının ruh hâline/isteğine göre KENDİ Spotify kütüphanesinden (beğeniler, en çok dinledikleri, listeleri) karışım kurar ve uygulamadan çıkmadan çalar ("canım sıkkın bir şey aç", "odaklanacağım müzik", "enerjik bir şeyler", "bana göre bir şey çal"). Belirli bir şarkı/sanatçı istenirse muzik_cal kullan.',
        inputSchema: { type: 'object', properties: { ruh_hali: { type: 'string', description: 'Kullanıcının kendi sözleriyle ruh hâli/istek' } }, required: ['ruh_hali'] },
        execute: function (g) { return ruhKarisimCal(g.ruh_hali, false, null).then(function (r) { if (r.hata) return 'olmadı: ' + hataMetni(r.hata); var k = r.k; return { baslik: k.baslik, yorum: k.yorum, durum: r.caliyor ? 'çalıyor' : (k._hata && k._hata.bilgi ? k._hata.message : 'çalınamadı: ' + hataMetni(k._hata)), ilk_sarkilar: k.sarkilar.slice(0, 3).map(function (x) { return x.a + ' — ' + x.s; }) }; }); } },
      { name: 'spotify_kontrol', description: 'Spotify\'ı uygulamadan çıkmadan kontrol eder: duraklat, devam, sonraki, onceki; ya da ne_caliyor ile çalan şarkıyı söyler.',
        inputSchema: { type: 'object', properties: { komut: { type: 'string', enum: ['duraklat', 'devam', 'sonraki', 'onceki', 'ne_caliyor'] } }, required: ['komut'] },
        execute: function (g) { if (g.komut === 'ne_caliyor') return simdiYenile().then(function () { return Simdi ? Simdi.a + ' — ' + Simdi.s + (Simdi.calisiyor ? '' : ' (duraklatıldı)') : 'Şu an çalan yok.'; }); return kontrol(g.komut).then(function () { return 'tamam'; }); } }
    ];
  }
  var eskiEk = U.sohbetEkAraclari;
  U.sohbetEkAraclari = function () { return (eskiEk ? eskiEk() : []).concat(araclar()); };

  window.Spotify = { bagli: bagli, oner: ruhHalindenOner, cal: cal, kontrol: kontrol, kaydet: karisimiKaydet, karisimCal: karisimCal, tanila: tanila, yerel: function () { return YEREL; }, kuyruk: function () { return Kuyruk; }, kutuphane: kutuphaneYukle, simdi: function () { return Simdi; }, _test: { D: function () { return D; } } };
  setTimeout(simdiYenile, 2500);
})();
