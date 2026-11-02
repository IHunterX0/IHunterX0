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
  var el = U.el, $ = U.$, K = window.AndroidKopru || null;
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
        if (!r.ok) { var h = new Error((j && j.error && (j.error.message || j.error)) || ('Spotify ' + r.status)); h.durum = r.status; h.neden = j && j.error && j.error.reason; throw h; }
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
            return istek('/playlists/' + l.id + '/items?limit=100').then(isle).catch(function (e) { if (e.durum === 429) return; return istek('/playlists/' + l.id + '/tracks?limit=100').then(isle); }).catch(function () {}); });
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
    return Promise.all([kutuphaneYukle(false), U.AI ? U.AI.hazir().catch(function () { return false; }) : Promise.resolve(!!(U.Y && U.Y.sample))]).then(function (r) {
      var kutu = r[0];
      if (!r[1]) return yerelKarisim(kutu, ruh, 'anahtar yok');
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
  function hataMetni(e) { return ((e && e.message) || String(e)) + (e && e.durum ? ' [Spotify ' + e.durum + (e.neden ? ' · ' + e.neden : '') + ']' : ''); }
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
  function kontrol(komut) {
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
  var Simdi = null;
  var mini = el('div', { class: 'sp-mini', hidden: true, role: 'region', 'aria-label': 'Spotify' });
  document.body.appendChild(mini);
  function simdiYenile() {
    if (!bagli() || document.hidden) return Promise.resolve();
    return api('/me/player/currently-playing').then(function (j) {
      Simdi = j && j.item ? { a: j.item.name, s: (j.item.artists || []).map(function (x) { return x.name; }).join(', '), kapak: ((j.item.album || {}).images || []).slice(-2)[0], calisiyor: !!j.is_playing, ilerleme: j.progress_ms || 0, sure: j.item.duration_ms || 1, alindi: Date.now() } : null;
      miniCiz(); simdiKartCiz();
    }).catch(function () {});
  }
  // "Ne çalıyor" yoklaması: yalnız uygulama görünürken VE (müzik sayfası açık ya da bir şey çalıyor) iken, 15 sn'de bir.
  // Hiçbir şey çalmıyorsa ve müzik sayfasında değilsen Spotify'a hiç istek gitmez. İlerleme çubuğu yerelde ilerler.
  setInterval(function () { if (bagli() && !document.hidden && !sogumaKaldi() && (U.Durum.gorunum === 'muzik' || (Simdi && Simdi.calisiyor))) simdiYenile(); }, 15000);
  setInterval(function () { if (Simdi && Simdi.calisiyor && U.Durum.gorunum === 'muzik') cubukGuncelle(); }, 1000);
  document.addEventListener('visibilitychange', function () { if (!document.hidden && (U.Durum.gorunum === 'muzik' || Simdi)) simdiYenile(); });
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
  function ruhKarisimCal(ruh, taze, kap) {
    return ruhHalindenOner(ruh, taze).then(function (k) {
      sonKarisim = k; if (kap) karisimCiz(kap, k);
      var d = function (t) { var x = kap && kap.querySelector('.sp-durum'); if (x && sonKarisim === k) x.textContent = t; };
      d('Başlatılıyor…');
      return cal(k.sarkilar.map(function (x) { return x.u; }), 0, k).then(function () { d('▶ Çalıyor — uygulamadan çıkmana gerek yok.'); return true; }, function (e) { d(e.bilgi ? e.message : hataMetni(e)); k._hata = e; return false; })
        .then(function (caliyor) {
          var arka = yenileriEkle(k, caliyor).then(function (yeni) { if (yeni.length && kap && sonKarisim === k) { karisimCiz(kap, k); d((caliyor ? '▶ Çalıyor · ' : '') + yeni.length + ' yeni öneri sıraya eklendi.'); } });
          return { k: k, caliyor: caliyor, arka: arka };
        });
    }, function (e) { if (kap) hataGoster(kap, e); throw e; }).catch(function (e) { return { hata: e }; });
  }
  function karisimCiz(kap, k) {
    kap.innerHTML = '';
    if (!k) return;
    kap.appendChild(el('h2', { text: 'KARIŞIM // ' + k.baslik.toLocaleUpperCase('tr') }));
    if (k.yorum) kap.appendChild(el('p', { text: k.yorum }));
    if (k.onbellekten || k.yerel) kap.appendChild(el('p', { class: 'sp-durum' }, [k.onbellekten ? 'Bu ruh hâli için birkaç saat önce kurulan karışım. ' : '',
      el('button', { class: 'cip', type: 'button', onclick: function () { kap.innerHTML = '<div class="yukleniyor">Yeni karışım kuruluyor…</div>'; ruhKarisimCal(k.ruh, true, kap); } }, ['↻ Yeni karışım kur'])]));
    var durum = el('span', { class: 'sp-durum' });
    kap.appendChild(el('div', { class: 'sp-satir' }, [
      el('button', { class: 'dugme ana', type: 'button', onclick: function () { durum.textContent = 'Başlatılıyor…'; cal(k.sarkilar.map(function (x) { return x.u; }), 0, k).then(function () { durum.textContent = '▶ Çalıyor — uygulamadan çıkmana gerek yok.'; }, function (e) { durum.textContent = e.bilgi ? e.message : hataMetni(e); }); } }, ['▶ Hepsini çal']),
      el('button', { class: 'dugme', type: 'button', onclick: function () { var b = this; b.disabled = true; durum.textContent = 'Spotify\'a kaydediliyor…'; karisimiKaydet(k).then(function () { durum.textContent = '✓ Listelerine eklendi: 1001 · ' + k.baslik; }, function (e) { b.disabled = false; durum.textContent = 'Kaydedilemedi: ' + hataMetni(e); }); } }, ['💾 Spotify\'a kaydet']),
      durum]));
    var l = el('div', { class: 'sp-liste' });
    k.sarkilar.forEach(function (x, i) {
      l.appendChild(el('button', { class: 'sp-sarki', type: 'button', style: 'animation-delay:' + Math.min(i * 30, 600) + 'ms', title: 'Buradan başlat', onclick: function () { durum.textContent = 'Başlatılıyor…'; cal(k.sarkilar.map(function (y) { return y.u; }), i, k).then(function () { durum.textContent = '▶ ' + x.a; }, function (e) { durum.textContent = e.bilgi ? e.message : hataMetni(e); }); } },
        [el('span', { class: 'n', text: String(i + 1).padStart(2, '0') }), el('span', {}, [el('b', { text: x.a }), el('small', { text: x.s })]), x.yeni ? el('span', { class: 'sp-yeni', text: 'YENİ' }) : el('span')]));
    });
    kap.appendChild(l);
  }
  var RUH_CIPLER = ['🎯 Odaklanmam lazım', '🌙 Gece ders çalışıyorum', '⚡ Enerji lazım', '🌧 Biraz hüzünlüyüm', '☀️ Keyfim yerinde', '😌 Sakinleşmek istiyorum', '🔥 Sınav öncesi motivasyon', '🧘 Stresliyim'];
  U.GORUNUMLER.muzik = function () {
    var ana = $('#ana'); ana.innerHTML = '';
    var sayfa = el('div', { class: 'sayfa' }); ana.appendChild(sayfa);
    sayfa.appendChild(el('div', { class: 'kahraman' }, [el('div', { class: 'ust-etiket', text: 'Ses modülü' }), el('h1', {}, ['Müzik', el('span', { class: 'sp-beta', text: 'BETA' })]),
      el('p', { class: 'var-etiket', text: 'Ruh hâlini söyle; Carvis senin beğenilerinden ve listelerinden bir karışım kursun. Spotify arka planda çalar, uygulamadan çıkmazsın.' })]));
    sayfaDurum = el('p', { class: 'sp-durum' });
    if (!D.clientId) { kurulumCiz(sayfa); return; }
    if (!bagli()) {
      var k = el('div', { class: 'sp-kutu' }, [el('h2', { text: 'BAĞLANTI' }), el('p', { text: 'Spotify hesabını bağla. Giriş sayfası uygulamanın içinde açılır (Google/Facebook ile giriş WebView\'da çalışmaz; e-posta ya da e-postana gelen kodla giriş yap).' })]);
      var hk = el('div');
      k.appendChild(el('div', { class: 'sp-satir' }, [el('button', { class: 'dugme ana', type: 'button', onclick: function () { baglan().catch(function (e) { hataGoster(hk, e); }); } }, ['🔗 Spotify\'a bağlan']),
        el('button', { class: 'dugme', type: 'button', onclick: function () { D.clientId = null; kaydet(); U.git('muzik'); } }, ['Client ID\'yi değiştir'])]));
      k.appendChild(hk); sayfa.appendChild(k);
      if (donus) donus.then(function () { U.git('muzik'); }, function (e) { hataGoster(hk, e); });
      return;
    }
    // bağlı
    simdiKap = el('div');
    sayfa.appendChild(el('div', { class: 'sp-kutu' }, [el('h2', { text: 'ŞİMDİ ÇALIYOR' }), simdiKap]));
    simdiKartCiz(); simdiYenile(); premiumTazele();
    var giris = el('input', { type: 'text', placeholder: 'Bugün nasılsın? "yorgunum ama 2 saat daha çalışmam lazım"…', 'aria-label': 'Ruh hâli', enterkeyhint: 'go' });
    var oner = el('button', { class: 'dugme ana', type: 'button' }, ['✦ Öner']);
    var karisimKap = el('div', { class: 'sp-kutu', hidden: !sonKarisim });
    function calistir(ruh) {
      giris.value = ruh; oner.disabled = true; karisimKap.hidden = false;
      karisimKap.innerHTML = '<div class="yukleniyor">' + (Kutu ? 'Ruh hâline göre seçiliyor…' : 'Kütüphanen ilk kez taranıyor (bir kerelik), sonra seçilecek…') + '</div>';
      ruhKarisimCal(ruh, false, karisimKap).then(function () { oner.disabled = false; });
    }
    oner.addEventListener('click', function () { calistir(giris.value); });
    giris.addEventListener('keydown', function (e) { if (e.key === 'Enter') calistir(giris.value); });
    var ruhKutu = el('div', { class: 'sp-kutu sp-ruh' }, [el('h2', { text: 'RUH HÂLİ' }), el('div', { class: 'sp-satir' }, [giris, oner])]);
    var cipler = el('div', { class: 'sp-cipler' });
    RUH_CIPLER.forEach(function (c) { cipler.appendChild(el('button', { class: 'cip', type: 'button', onclick: function () { calistir(c.replace(/^\S+\s/, '')); } }, [c])); });
    ruhKutu.appendChild(cipler);
    var gecmis = karisimlar().slice(0, 6);
    if (gecmis.length > 1) {
      var gl = el('div', { class: 'sp-cipler' }, [el('span', { class: 'sp-durum', text: 'Son karışımlar:' })]);
      gecmis.forEach(function (k) { gl.appendChild(el('button', { class: 'cip', type: 'button', onclick: function () { sonKarisim = k; karisimKap.hidden = false; karisimCiz(karisimKap, k); } }, [k.baslik])); });
      ruhKutu.appendChild(gl);
    }
    sayfa.appendChild(ruhKutu);
    sayfa.appendChild(karisimKap);
    if (sonKarisim) karisimCiz(karisimKap, sonKarisim);
    // kütüphane
    var kb = el('span', { class: 'sp-durum' });
    function kbYaz() { kb.textContent = Kutu ? Kutu.sarkilar.length + ' şarkı · ' + Kutu.listeler.length + ' liste · ' + new Date(Kutu.t).toLocaleString('tr-TR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) + ' taraması' : 'Kütüphane henüz taranmadı.'; }
    kbYaz();
    sayfa.appendChild(el('div', { class: 'sp-kutu' }, [el('h2', { text: 'KÜTÜPHANE' }),
      el('p', { text: (D.ben ? D.ben.ad + ' olarak bağlı' : 'Bağlı') + (D.premium === false ? ' · Premium yok: şarkı başlatınca Spotify açılır; duraklat/sonraki uygulamadan çalışır.' : '.') }),
      el('div', { class: 'sp-satir' }, [kb,
        el('button', { class: 'dugme', type: 'button', onclick: function () { var b = this; b.disabled = true; kutuphaneYukle(true).then(kbYaz, function (e) { kb.textContent = e.message; }).then(function () { b.disabled = false; }); } }, ['↻ Tazele']),
        el('button', { class: 'dugme', type: 'button', onclick: function () { if (!confirm('Spotify bağlantısı kesilsin mi?')) return; D = { clientId: D.clientId }; kaydet(); Kutu = null; try { localStorage.removeItem(KUTU_ANAHTAR); } catch (e) {} Simdi = null; miniCiz(); U.git('muzik'); } }, ['Bağlantıyı kes'])]),
      sayfaDurum]));
    if (!Kutu) kutuphaneYukle(false).then(kbYaz, function () {});
  };
  function kurulumCiz(sayfa) {
    var cid = el('input', { type: 'text', placeholder: 'Client ID (32 karakter)', 'aria-label': 'Spotify Client ID', autocomplete: 'off', spellcheck: 'false' });
    var hk = el('div');
    var kopyala = el('button', { class: 'dugme', type: 'button', onclick: function () { try { navigator.clipboard.writeText(YONLENDIR); U.toast('Kopyalandı'); } catch (e) {} } }, ['Kopyala']);
    sayfa.appendChild(el('div', { class: 'sp-kutu' }, [el('h2', { text: 'KURULUM · TEK SEFERLİK' }),
      el('p', { text: 'Spotify, kişisel uygulamaların kendi anahtarıyla bağlanmasını istiyor. 3 dakikalık iş:' }),
      el('ol', { class: 'sp-adim' }, [
        el('li', {}, ['developer.spotify.com/dashboard adresine Spotify hesabınla gir → ', el('b', { text: 'Create app' }), '.']),
        el('li', {}, ['App name: ', el('b', { text: '1001 Carvis' }), ' · Description: istediğin bir şey · ', el('b', { text: 'Web API' }), ' kutusunu işaretle.']),
        el('li', {}, ['Redirect URI olarak tam olarak şunu ekle:', el('div', { class: 'sp-kod' }, [el('code', { text: YONLENDIR }), kopyala])]),
        el('li', {}, ['Kaydet; ', el('b', { text: 'Settings' }), ' sayfasındaki ', el('b', { text: 'Client ID' }), '\'yi aşağıya yapıştır.']),
        el('li', {}, ['Gerekirse ', el('b', { text: 'User Management' }), ' bölümüne kendi Spotify e-postanı ekle.'])]),
      el('div', { class: 'sp-satir' }, [cid, el('button', { class: 'dugme ana', type: 'button', onclick: function () {
        var v = cid.value.trim(); if (!/^[0-9a-f]{32}$/i.test(v)) { hataGoster(hk, new Error('Client ID 32 karakterlik bir kod olmalı.')); return; }
        D.clientId = v; kaydet(); U.git('muzik'); } }, ['Kaydet'])]), hk]));
  }
  U.SEKMELER.push({ id: 'muzik', ad: 'Müzik', ikon: '♫' });
  if (U.sekmeleriCiz) U.sekmeleriCiz();

  /* ---------------- Carvis araçları ---------------- */
  function araclar() {
    if (!bagli()) return [];
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

  window.Spotify = { bagli: bagli, oner: ruhHalindenOner, cal: cal, kontrol: kontrol, kaydet: karisimiKaydet, kutuphane: kutuphaneYukle, simdi: function () { return Simdi; }, _test: { D: function () { return D; } } };
  if (bagli()) setTimeout(simdiYenile, 2500);
})();
