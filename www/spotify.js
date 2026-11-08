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
      .then(function (m) { D.ben = { id: m.id, ad: m.display_name || m.id }; D.premium = m.product ? m.product === 'premium' : true; kaydet(); kutuphaneYukle(true).catch(function () {}); });
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
  // Kutu: { t, surum, sarkilar:[{id,u,a,s,k}], listeler:[{id,ad,n}], sanatcilar:{kisa,orta,uzun}, sonCalinan:[{a,s,g}], eksik }
  // k: kaynak etiketleri (son, favori, begeni, liste:AD) virgülle ayrılır
  var Kutu = oku(KUTU_ANAHTAR, null);
  function iz(t) { return t && t.id && !t.is_local ? { id: t.id, u: t.uri, a: t.name, s: (t.artists || []).map(function (x) { return x.name; }).join(', ') } : null; }
  var yukleniyor = null;
  // Tam tarama: beğenilen şarkıların tamamı, kendi listelerinin bütün parçaları, Spotify'ın sanatçı ve şarkı sıralamaları, son çalınanlar.
  // Süre en çok ~80 sn: yeni istek 68. saniyeden sonra açılmaz. İstek sınırı, süre ya da 429 olursa elde kalan veri kaydedilir ("eksik" işareti).
  // Önbellek 7 gün geçerli; eksik kalan tarama günde bir yeniden denenir. Eski sürüm önbellek (surum < 2) hemen yenilenir.
  var KUTU_YENILEME = 7 * 24 * 3600e3, KUTU_EKSIK_YENILEME = 24 * 3600e3, KUTU_SURUM = 2;
  var TARAMA_BUTCE = (typeof window.__spotifyButceTest === 'number' && window.__spotifyButceTest) || 80000; // ms
  var TARAMA_ISTEK = 220, TARAMA_SARKI = 4000, TARAMA_LISTE = 80;
  var sonArkaPlan = 0; // arka plan taraması başarısız olursa her Öner denemesinde yeniden taramasın (kota)
  function etiketVar(x, e) { return String(x.k || '').split(',').indexOf(e) >= 0; }
  function kutuphaneYukle(zorla) {
    if (!bagli()) return Promise.reject(new Error('Spotify bağlı değil.'));
    if (!zorla && Kutu && Kutu.sarkilar.length) {
      var yas = Date.now() - Kutu.t, esik = Kutu.eksik ? KUTU_EKSIK_YENILEME : KUTU_YENILEME;
      if ((yas > esik || (Kutu.surum || 0) < KUTU_SURUM) && !yukleniyor && Date.now() - sonArkaPlan > 3600e3) { // eskiyse arkada tazele (saatte en çok bir kez)
        sonArkaPlan = Date.now(); setTimeout(function () { kutuphaneYukle(true).catch(function () {}); }, 4000);
      }
      return Promise.resolve(Kutu);
    }
    if (yukleniyor) return yukleniyor;
    var basla = Date.now(), istekSayi = 0, eksik = '';
    var harita = {}, sira = [], listeler = [], sanatciKutu = {}, sonCal = [];
    function butce() {
      if (sira.length >= TARAMA_SARKI) { eksik = eksik || 'şarkı sınırı'; return false; }
      if (istekSayi >= TARAMA_ISTEK) { eksik = eksik || 'istek sınırı'; return false; }
      if (Date.now() - basla >= TARAMA_BUTCE - 12000) { eksik = eksik || 'süre sınırı'; return false; }
      return true;
    }
    function ekle(t, k) {
      var x = iz(t); if (!x) return;
      if (harita[x.id]) { if (harita[x.id].k.indexOf(k) < 0) harita[x.id].k += ',' + k; return; }
      x.k = k; harita[x.id] = x; sira.push(x);
    }
    function istek(yol) {
      istekSayi++; durumYaz('Kütüphane taranıyor… ' + sira.length + ' şarkı · ' + Math.round((Date.now() - basla) / 1000) + ' sn');
      return bekle(150).then(function () { return api(yol); });
    }
    // sayfa sayfa; bütçe bitince ya da sınıra ulaşınca durur, elde kalanla devam edilir
    function sayfalar(yol, sinir, isle) {
      var say = 0;
      function sayfa(url) {
        if (!butce()) return Promise.resolve();
        return istek(url).then(function (j) {
          var items = (j && j.items) || [];
          items.forEach(isle); say += items.length;
          if (j && j.next && items.length && say < sinir) return sayfa(j.next);
        });
      }
      return sayfa(yol);
    }
    // 429 (istek sınırı) taramayı durdurur; öteki hatalar yalnız o adımı atlatır
    function adim(f) { return function () { return f().catch(function (e) { if (e && e.durum === 429) throw e; hataKaydet('tarama', e); }); }; }
    function listeIcerik(L) {
      var etiket = 'liste:' + L.ad, n = 0;
      function isle(it) { var t = it && (it.item || it.track); if (t && iz(t)) { ekle(t, etiket); n++; } }
      return sayfalar('/playlists/' + L.id + '/items?limit=50', 500, isle).catch(function (e) {
        if (e && e.durum === 429) throw e;
        if (n > 0) return; // yarıda kaldıysa aynı listeye öteki uç nokta ile dönme
        return sayfalar('/playlists/' + L.id + '/tracks?limit=50', 500, isle); // eski uç nokta
      }).catch(function (e) { if (e && e.durum === 429) throw e; hataKaydet('liste', e); }).then(function () { L.n = n; });
    }
    function sanatciAl(aralik, anahtar) {
      return adim(function () { return istek('/me/top/artists?limit=50&time_range=' + aralik).then(function (j) { sanatciKutu[anahtar] = ((j && j.items) || []).map(function (a) { return a.name; }).filter(Boolean); }); });
    }
    function sarkiAl(aralik, etiket) {
      return adim(function () { return istek('/me/top/tracks?limit=50&time_range=' + aralik).then(function (j) { ((j && j.items) || []).forEach(function (t) { ekle(t, etiket); }); }); });
    }
    var adimlar = [
      sarkiAl('short_term', 'son'), sarkiAl('medium_term', 'favori'), sarkiAl('long_term', 'favori'),
      sanatciAl('short_term', 'kisa'), sanatciAl('medium_term', 'orta'), sanatciAl('long_term', 'uzun'),
      adim(function () { return istek('/me/player/recently-played?limit=50').then(function (j) { ((j && j.items) || []).forEach(function (it) { var t = it && it.track; if (!t) return; ekle(t, 'son'); var x = iz(t); if (x) sonCal.push({ a: x.a, s: x.s, g: String(it.played_at || '').slice(0, 10) }); }); }); }),
      adim(function () { return sayfalar('/me/tracks?limit=50', 6000, function (it) { ekle(it && (it.track || it.item), 'begeni'); }); }),
      adim(function () { return sayfalar('/me/playlists?limit=50', 500, function (p) { if (!p || !p.id || (D.ben && p.owner && p.owner.id !== D.ben.id)) return; listeler.push({ id: p.id, ad: String(p.name || 'liste').replace(/,/g, ' ').trim() || 'liste', n: 0, total: ((p.tracks || p.items || {}).total) || 0 }); }); }),
      function () { listeler.sort(function (a, b) { return a.total - b.total; }); listeler = listeler.slice(0, TARAMA_LISTE); }, // küçük listeler önce: bütçe en çok liste yetsin
      function () { return listeler.reduce(function (z, L) { return z.then(function () { return listeIcerik(L); }); }, Promise.resolve()); }
    ];
    function kaydet() {
      Kutu = { t: Date.now(), surum: KUTU_SURUM, sarkilar: sira, listeler: listeler.map(function (L) { return { id: L.id, ad: L.ad, n: L.n }; }), sanatcilar: sanatciKutu, sonCalinan: sonCal.slice(0, 50), eksik: eksik };
      yaz(KUTU_ANAHTAR, Kutu); durumYaz(eksik ? 'Kütüphane kısmen tarandı (' + eksik + '): ' + sira.length + ' şarkı' : '');
      return Kutu;
    }
    yukleniyor = adimlar.reduce(function (z, f) { return z.then(f); }, Promise.resolve())
      .then(function () {
        if (!sira.length) { if (sogumaKaldi()) throw sogumaHatasi(); throw new Error('Kütüphanede şarkı bulunamadı.'); }
        return kaydet();
      })
      .catch(function (e) { // yarıda kalan tarama: elde kalan daha dolu ise onu kaydet; değilse eski önbellekle devam
        durumYaz('');
        if (!eksik) eksik = e && e.durum === 429 ? 'Spotify istek sınırı' : 'tarama hatası';
        if (sira.length && !(Kutu && Kutu.sarkilar.length > sira.length)) return kaydet();
        if (Kutu && Kutu.sarkilar.length) return Kutu;
        throw e;
      })
      .finally(function () { yukleniyor = null; });
    return yukleniyor;
  }

  /* ---------------- ruh hâli → karışım ---------------- */
  // Hız + kota: yapay zekâya en çok 220 satır gider, "hafif" yoldan (Groq varsa orası, yoksa Gemini'nin hafif modelleri;
  // değerli Gemini flash kotası harcanmaz). Aynı ruh hâli 6 saat önbellekte. Yapay zekâ cevap vermezse yerel karışım.
  // Liste dışı "yeni" öneriler karışım ÇALMAYA BAŞLADIKTAN sonra aranır ve sıraya eklenir (beklemeyi uzatmaz).
  function karisimlar() { return oku(KARISIM_ANAHTAR, []); }
  function karisimSakla(k) {
    // aynı şarkı (sanatçı + ad) iki kez geçmesin; sürüm farkı olsa da tek satır
    var g = {}; k.sarkilar = (k.sarkilar || []).filter(function (x) { var anahtar = katla2((x.a || '') + ' ' + (x.s || '')); if (g[anahtar]) return false; g[anahtar] = 1; return true; });
    var h = karisimlar().filter(function (x) { return x.id !== k.id; }); h.unshift(k); yaz(KARISIM_ANAHTAR, h.slice(0, 8));
  }
  function jsonAyikla(m) { var a = m.indexOf('{'), b = m.lastIndexOf('}'); if (a < 0 || b < a) throw new Error('Öneri okunamadı.'); return JSON.parse(m.slice(a, b + 1)); }
  function katla2(t) { return String(t || '').toLocaleLowerCase('tr').replace(/[^\p{L}\p{N} ]/gu, ' ').replace(/\s+/g, ' ').trim(); }
  function karistir(l) { l = l.slice(); for (var i = l.length - 1; i > 0; i--) { var j = Math.random() * (i + 1) | 0, t = l[i]; l[i] = l[j]; l[j] = t; } return l; }
  var Zevk = oku('spotify_zevk', '');
  // ton ekle: kullanıcının eklediği örnek şarkılar (tohum); öneri bunlara göre kurulur
  var Ornekler = oku('spotify_ornek', []);
  // banger modu: açıkken öneriler yalnızca kendini kanıtlamış hitlerden kurulur
  var Banger = !!oku('spotify_banger', false);
  // Sözsüz tercih (kullanıcı, 2026-11-05: ders ve okuma sırasında sözlü parça dikkati böler). Varsayılan kapalı.
  var Sozsuz = !!oku('spotify_sozsuz', false);
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
    }).catch(function (e) { // ayrıştırma/boş cevap hataları da buraya düşer
      if (kutu.sarkilar.length >= 5) return yerelKarisim(kutu, ruh, /boş/.test(String(e && e.message)) ? 'yetersiz cevap' : 'zaman aşımı/kota');
      var m = String(e && (e.code || e.message) || e);
      throw new Error(/rate|kota|429/i.test(m) ? 'Yapay zekâ kotası şu an dolu; biraz sonra tekrar dene.' : 'Yapay zekâ cevap vermedi: ' + (e && e.message || e));
    });
  }
  function yerelKarisim(kutu, ruh, neden) {
    var tercih = kutu.sarkilar.filter(function (x) { return /son|favori/.test(x.k); }), digeri = kutu.sarkilar.filter(function (x) { return !/son|favori/.test(x.k); });
    var l = karistir(tercih.filter(function (x) { return geriPuan(x) > -3; })).sort(function (a, b) { return geriPuan(b) - geriPuan(a); }).slice(0, 14).concat(karistir(digeri.filter(function (x) { return geriPuan(x) > -3; })).slice(0, 8));
    l = cesitlendir(l).slice(0, 18);
    return { id: Date.now().toString(36), ruh: ruh, baslik: 'Senin favorilerin', yorum: 'Yapay zekâ şu an cevap vermedi (' + neden + '); en çok dinlediklerinden karışık bir liste kurdum.', sarkilar: l, yeniAra: [], t: Date.now(), yerel: true };
  }
  /* ---- Öğrenen öneri (kullanıcı, 2026-11-03: "müzik kısmındaki AI'ı zekileştir") ----
     Geri bildirim: Carvis karışımından gelen şarkıyı 30 sn içinde geçmek = beğenmedi, sonuna kadar dinlemek = beğendi,
     👍/👎 açık oy (ağırlık 3). Bağlam: çalışılan kitap/bölüm, pomodoro, saat. İnce ayar: "daha hareketli" gibi istekler son
     karışımı düzeltir. Her şarkıya kısa gerekçe. Çeşitlilik kodla: sanatçı başına en çok 2, aynı sanatçı art arda gelmez. */
  /* ---- Konuşma: liste oluşturmanın tek girdi yeri (kullanıcı, 2026-11-04). Sorular sırayla sorulur, her cevap kaydedilir;
     en sonda kayıtlar ve işaretler birlikte düşünülüp liste kurulur. Odak ve düşünme modları tempo kuralını değiştirir. */
  var KONUSMA_ANAHTAR = 'spotify_konusma_v1', ISARET_ANAHTAR = 'spotify_isaret_v1';
  var KONUSMA_SORULAR = [
    { id: 'nasil', kisa: 'Ruh hâli', soru: 'Nasılsın? Bugün nasıl bir ruh hâlindesin?', ipucu: null, zorunlu: true },
    { id: 'odak', kisa: 'Odak mı, düşünme mi', soru: 'Şu an bir göreve mi odaklanmak istiyorsun, yoksa düşünmek mi?', ipucu: ['Göreve odaklanmak', 'Düşünmek'], zorunlu: true },
    { id: 'ornek', kisa: 'Benzer tarzlar', soru: 'Bu tip şarkılardan (ör. The Strokes, Radiohead, Arctic Monkeys) ya da benzerlerinden dinlemek istediğin var mı? Yaz; sanatçılarıyla birlikte karşına çıkarayım, sen onaylayasın.', ipucu: ['The Strokes, Radiohead, Arctic Monkeys', 'Yok'], zorunlu: false, sanatci: true },
    { id: 'edit', kisa: 'Edit', soru: 'Spesifik olarak bir edit\'in içerisinde kendini hayal ediyor musun? "Hayır" de ya da futbolcu yaz (ör. neymar / dybala).', ipucu: ['Hayır'], zorunlu: false },
    { id: 'tur', kisa: 'Tür', soru: 'Spesifik olarak istediğin bir tür var mı? Yoksa "yok" yaz.', ipucu: ['Yok'], zorunlu: false }
  ];
  var Konusma = Object.assign({ adim: 0, cevaplar: {}, sanatci: [], anilan: [], mod: '', gecmis: [] }, oku(KONUSMA_ANAHTAR, null) || {});
  var KonusmaBaglam = null; // toplu düşünme sırasında istem bölümü (yalnız o çağrıda dolu)
  var Isaret = oku(ISARET_ANAHTAR, {}); // { anahtar: { a, s, b: 'beğen' | 'beğenme' | 'alakasız', t } }
  function konusmaKaydet() { yaz(KONUSMA_ANAHTAR, Konusma); }
  function konusmaBitti() { return Konusma.adim >= KONUSMA_SORULAR.length; }
  function konusmaCevapla(c) {
    var s = KONUSMA_SORULAR[Konusma.adim]; if (!s) return;
    Konusma.cevaplar[s.id] = String(c || '').trim();
    if (s.id === 'odak') Konusma.mod = /düşün/i.test(c || '') ? 'dusunme' : /odak|çalış|ders|görev|sınav|bitir/i.test(c || '') ? 'odak' : 'dusunme';
    Konusma.adim++; konusmaKaydet();
  }
  function konusmaYeniOturum() {
    if (Konusma.adim > 0) Konusma.gecmis = [{ t: Date.now(), cevaplar: Konusma.cevaplar, mod: Konusma.mod, sanatci: Konusma.sanatci }].concat(Konusma.gecmis || []).slice(0, 20);
    Konusma.adim = 0; Konusma.cevaplar = {}; Konusma.sanatci = []; Konusma.anilan = []; Konusma.mod = ''; konusmaKaydet();
  }
  function konusmaOzet() {
    var c = Konusma.cevaplar || {}, p = [(c.nasil || 'belirtilmedi'), 'Mod: ' + (Konusma.mod === 'odak' ? 'görev odaklanma (enerji yüksek ya da yükseltilecek)' : 'düşünme (üzüntü yoluyla; yavaş ve içe dönük)')];
    if (c.tur && !/^yok/i.test(c.tur)) p.push('Tür: ' + c.tur);
    if (c.edit && !/^(hayır|yok)/i.test(c.edit)) p.push('Edit: ' + c.edit);
    if (Konusma.sanatci && Konusma.sanatci.length) p.push('Tarz: ' + Konusma.sanatci.join(', '));
    return p.join(' · ');
  }
  function konusmaBaglamKur() { var c = Konusma.cevaplar || {}; return { nasil: c.nasil || '', mod: Konusma.mod || 'dusunme', sanatci: (Konusma.sanatci || []).slice(), edit: c.edit || '', tur: c.tur || '', ornek: c.ornek || '' }; }
  // Öneri istemine giren bölüm: kullanıcının kendi cevapları ve moda göre tempo kuralı
  function konusmaSatirlari(s) {
    var odak = s.mod === 'odak';
    return [
      '- Sohbet cevapları (kullanıcı kendi yazdı; doğrudan istek):',
      '  · Bugün nasıl: ' + (s.nasil || '(belirtilmedi)'),
      '  · Mod: ' + (odak ? 'görev odaklanma' : 'düşünme (üzüntü yoluyla açığa çıkar)'),
      '  · Tempo kuralı: ' + (odak ? 'görevde enerji yüksek tutulmak ya da yükseltilmek isteniyor. Tempo ve enerji kademeli artsın (ör. 100 → 125 BPM), ritim dinamik kalsın; ağır ve yavaş parçalardan kaçın.' : 'yavaş, içe dönük ve melankolik parçalar; tempo düşük (70–95 BPM), enerji düşük. The Strokes, Radiohead ve Arctic Monkeys\'in yavaş, düşündüren tarzı örnek alınır, kopyalanmaz.'),
      '  · Kullanıcının kendi ifadesi (benzer tarzlar): ' + (s.ornek && !/^yok$/i.test(s.ornek) ? s.ornek : '(yok)'),
      '  · Onaylı benzer tarzlar (sanatçılar): ' + (s.sanatci && s.sanatci.length ? s.sanatci.join(', ') : '(yok)'),
      '  · Edit bağlamı: ' + (s.edit && !/^(hayır|yok)/i.test(s.edit) ? s.edit : '(yok)'),
      '  · Tür: ' + (s.tur && !/^yok/i.test(s.tur) ? s.tur : '(yok)')
    ];
  }
  // Verilen tarza yakın bilinen sanatçılar: yapay zekâ önerir, kullanıcı onaylar
  // Yapay zekâ kapalıysa yedek: cümleyi virgül / "ve" / "x" ile böl; her parça şarkı adı sayılır
  function konusmaBol(metin) {
    return String(metin || '').split(/,|;|\s+ve\s+|\s+x\s+|\s+and\s+|\//i).map(function (x) { return x.trim(); })
      .filter(function (x) { return x.length > 1 && !/^(yok|hayır|hayir)$/i.test(x); }).slice(0, 8).map(function (x) { return { sarki: x, sanatci: '' }; });
  }
  // Cümlede adı geçen şarkılar/sanatçılar + verilen tarza yakın benzer sanatçılar (yapay zekâ)
  function konusmaSanatciOner(metin) {
    var istem = 'Kullanıcı şunu yazdı: "' + metin + '". 1) Cümlede adı geçen şarkıları ve sanatçıları çıkar. Yazılışı koru. Tek başına geçen her ad bir ŞARKI adıdır: sanatci alanını boş bırak. Sanatçı yalnızca açıkça belirtilmişse (ör. köşeli parantez, "tarafından", "şarkı - sanatçı") sanatci alanına yaz. "istiyorum", "falan olur", "biraz" gibi sözcükleri alma. 2) Bu tarza yakın, Spotify\'da bulunan bilinen 12 sanatçı öner; cümlede adı geçenleri bu listeye koyma. YALNIZ JSON yaz: {"anilan":[{"sarki":"","sanatci":""}],"benzer":["Sanatçı adı"]}';
    var zaman = new Promise(function (_, red) { setTimeout(function () { red(new Error('yapay zekâ 30 sn\'de cevap vermedi')); }, 30000); });
    return Promise.race([U.Y.sample(istem, { cache: false, hafif: true }), zaman]).then(function (c) {
      var j = jsonAyikla(c.text || '');
      var anilan = (j.anilan || []).map(function (x) { return { sarki: String((x && x.sarki) || '').trim(), sanatci: String((x && x.sanatci) || '').trim() }; })
        .filter(function (x) { return x.sarki || x.sanatci; }).slice(0, 8);
      var benzer = (j.benzer || []).map(function (x) { return String(x || '').trim(); }).filter(function (x, i, d) { return x && d.indexOf(x) === i; }).slice(0, 12);
      return { anilan: anilan, benzer: benzer };
    });
  }
  // Adı geçen şarkılar Spotify'da aranır; bulunanlar listede tonlar gibi ilk sıraya girer. Yalnız sanatçı adı olanlar öneri olarak sunulur.
  function konusmaDogrula(anilan) {
    var bulunan = [], yok = [];
    return anilan.reduce(function (z, a) {
      return z.then(function () {
        if (!a.sarki) return;
        return (a.sanatci ? trackAra(a.sarki, a.sanatci) : tekTohum(a.sarki)).then(function (t) {
          var x = iz(t);
          if (!x) { yok.push(a.sarki + (a.sanatci ? ' — ' + a.sanatci : '')); return; }
          if (!bulunan.some(function (y) { return y.id === x.id; })) bulunan.push({ id: x.id, u: x.u, ad: x.a, sanatci: x.s });
        });
      });
    }, Promise.resolve()).then(function () {
      return { bulunan: bulunan, yok: yok, sanatciler: anilan.filter(function (a) { return !a.sarki && a.sanatci; }).map(function (a) { return a.sanatci; }) };
    });
  }
  // Adı geçen ve Spotify'da bulunan şarkılar: öneri istemine ton olarak girer (liste başında)
  function konusmaAnilanTonlari() { return (Konusma.anilan || []).map(function (x) { return { id: x.id, u: x.u, ad: x.ad, sanatci: x.sanatci }; }); }
  // İşaretler (alt çubuk): beğen / beğenme / alakasız. Beğen ve beğenme ayrıca Geri'ye (öneri öğrenmesi) yazılır.
  function isaretle(a, s2, b) {
    var k = geriAnahtar(a, s2); if (k === '|') return;
    Isaret[k] = { a: a, s: s2, b: b, t: Date.now() }; yaz(ISARET_ANAHTAR, Isaret);
    if (b === 'beğen') geriKaydet(a, s2, 'begen', 3); else if (b === 'beğenme') geriKaydet(a, s2, 'atla', 3);
  }
  function isaretSil(a, s2) { var k = geriAnahtar(a, s2); if (Isaret[k]) { delete Isaret[k]; yaz(ISARET_ANAHTAR, Isaret); } }
  function isaretOku(a, s2) { var x = Isaret[geriAnahtar(a, s2)]; return x ? x.b : null; }
  function kapakUrl(t) { var im = t && t.album && t.album.images; return im && im.length ? ((im.slice(-2)[0] || im[0]).url || null) : null; }
  // Yerel modda kapak gelmezse, şarkının kayıtlı karışımdaki kapağı kullanılır (karışım parçaları Spotify'dan kapaklı gelir)
  function kapakBul(a, s2) {
    var k = geriAnahtar(a, s2), kaynak = [sonKarisim].concat(karisimlar());
    for (var i = 0; i < kaynak.length; i++) { var l = (kaynak[i] && kaynak[i].sarkilar) || []; for (var j = 0; j < l.length; j++) if (l[j].kapak && geriAnahtar(l[j].a, l[j].s) === k) return l[j].kapak; }
    return null;
  }
  function isaretGrubu() {
    var g = el('span', { class: 'sp-isaret' }), mevcut = Simdi ? isaretOku(Simdi.a, Simdi.s) : null;
    [['beğen', '👍', 'Beğen'], ['beğenme', '👎', 'Beğenme'], ['alakasız', '⊘', 'Alakasız (bu ruh hâline uymuyor)']].forEach(function (x) {
      g.appendChild(el('button', { type: 'button', class: mevcut === x[0] ? 'aktif' : '', title: x[2], 'aria-label': x[2], 'aria-pressed': mevcut === x[0] ? 'true' : 'false', onclick: function (e) {
        e.stopPropagation(); if (!Simdi) return;
        if (isaretOku(Simdi.a, Simdi.s) === x[0]) isaretSil(Simdi.a, Simdi.s); else isaretle(Simdi.a, Simdi.s, x[0]);
        miniCiz(); U.toast(isaretOku(Simdi.a, Simdi.s) ? 'İşaret: ' + x[2] : 'İşaret kaldırıldı');
      } }, [x[1]]));
    });
    return g;
  }
  var Geri = oku('spotify_geri_v1', {});
  function geriAnahtar(a, s2) { return sade(a) + '|' + sade(String(s2 || '').split(',')[0]); }
  function geriKaydet(a, s2, tur, agirlik) {
    var k = geriAnahtar(a, s2); if (k === '|') return;
    var g = Geri[k] = Geri[k] || { a: a, s: s2, begen: 0, atla: 0 };
    g[tur] = (g[tur] || 0) + (agirlik || 1); g.t = Date.now();
    var ks = Object.keys(Geri); if (ks.length > 600) { ks.sort(function (x, y) { return (Geri[x].t || 0) - (Geri[y].t || 0); }); delete Geri[ks[0]]; }
    yaz('spotify_geri_v1', Geri);
  }
  function geriPuan(x) { var g = Geri[geriAnahtar(x.a, x.s)]; return g ? (g.begen || 0) - 1.5 * (g.atla || 0) : 0; }
  function karisimdaki(baslik) { return sonKarisim ? sonKarisim.sarkilar.filter(function (x) { return eslesirAd(baslik, x.a); })[0] || null : null; }
  // Dinleme izi: çalan şarkı değişince öncekinin ne kadar dinlendiğine bakar (yerel, ağsız)
  var Iz = null;
  function izGuncelle(d) {
    if (!d || !d.var || !d.baslik) return;
    if (!Iz || Iz.baslik !== d.baslik) {
      if (Iz && Iz.karisim) { // kayıt karışımdaki şarkının kendi adı/sanatçısıyla (kütüphaneyle eşleşsin)
        var dinlenen = Iz.enCok, sure = Iz.sure || 0, x = Iz.karisim;
        if (dinlenen < 30000 && (!sure || dinlenen < sure * 0.4)) geriKaydet(x.a, x.s, 'atla');
        else if (sure && dinlenen >= sure * 0.8) geriKaydet(x.a, x.s, 'begen');
      }
      Iz = { baslik: d.baslik, sure: d.sure || 0, enCok: d.konum || 0, karisim: karisimdaki(d.baslik) };
    } else { Iz.enCok = Math.max(Iz.enCok, d.konum || 0); if (d.sure) Iz.sure = d.sure; }
  }
  setInterval(function () { if (YEREL && sonKarisim) izGuncelle(yDurum()); }, 4000);
  function cesitlendir(l) {
    var say = {}, sonuc = [];
    l.forEach(function (x) { var sa = sade(String(x.s || '').split(',')[0]); say[sa] = (say[sa] || 0) + 1; if (say[sa] <= 2) sonuc.push(x); });
    for (var i = 1; i < sonuc.length; i++) { // aynı sanatçı art arda gelmesin
      if (sade(String(sonuc[i].s).split(',')[0]) !== sade(String(sonuc[i - 1].s).split(',')[0])) continue;
      for (var j = i + 1; j < sonuc.length; j++) if (sade(String(sonuc[j].s).split(',')[0]) !== sade(String(sonuc[i].s).split(',')[0])) { var t = sonuc[i]; sonuc[i] = sonuc[j]; sonuc[j] = t; break; }
    }
    return sonuc;
  }
  function baglamMetni() {
    var p = [], Du = U.Durum || {};
    if (Du.aktifKitap) p.push('şu an çalıştığı: ' + Du.aktifKitap.baslik + (Du.aktifBolum ? ' — ' + (Du.aktifBolum.kisa || Du.aktifBolum.baslik) : ''));
    try { var P = U.Pomodoro && U.Pomodoro.anlik && U.Pomodoro.anlik(); if (P && P.calisiyor) p.push('pomodoro: ' + (P.mod === 'calis' ? 'odak bloğunda' : 'molada')); } catch (e) {}
    var sa = new Date().getHours(); p.push('saat ' + sa + ':00' + (sa >= 23 || sa < 5 ? ' (gece geç saat)' : sa < 9 ? ' (sabah)' : ''));
    return p.join('; ');
  }
  var INCE = /^(daha|biraz|az |çok |bunun gibi|buna benzer|benzer|değiştir|çıkar|ekle|yerine|ama |sadece|türkçe|ingilizce|sözsüz|enstrümantal|hareketli|sakin|yavaş|hızlı)/i;
  /* ---- Keşif (kullanıcı, 2026-11-03: "sadece kütüphanemdeki şarkıları açıyor; arama yapıp başka şarkılar da önermeli.
     do i clench my fists - ridgeclub yazdım, onun etrafında bir şey kursun; 20-30 sn sürebilir, kaliteli olsun yeter") ----
     1) İstekte bir şarkı/sanatçı varsa Spotify'da bulunur (gerçek sanatçı, albüm, yıl, sanatçının diğer şarkıları).
     2) Güçlü model (hafif değil) bu tohum + zevk + geri bildirimle 24 şarkılık bir akış yazar; kütüphaneden de seçebilir.
     3) Her öneri Spotify'da aranır, sanatçı adı doğrulanır; bulunamayan ya da başka sanatçıya çıkan atılır. */
  var TOHUM = /\s[-–—]\s|["“”«»]|\bgibi\b|benzer|etraf|tarz|keşf|bunun|şuna|vibe|like\b/i;
  function muzikModu() { return oku('spotify_mod', 'karisik'); }
  function adBenzer(a, b) { a = sade(a); b = sade(b); return !!(a && b && (a === b || a.indexOf(b) >= 0 || b.indexOf(a) >= 0)); }
  function trackAra(sarki, sanatci) {
    var q1 = 'track:"' + String(sarki).replace(/"/g, '') + '"' + (sanatci ? ' artist:"' + String(sanatci).replace(/"/g, '') + '"' : '');
    function dene(q) { return api('/search?type=track&limit=5&q=' + encodeURIComponent(q)).then(function (j) { return (j && j.tracks && j.tracks.items) || []; }); }
    function sec(l) {
      var t = l.filter(function (x) { return x && (!sanatci || (x.artists || []).some(function (y) { return adBenzer(y.name, sanatci); })) && adBenzer(x.name, sarki); })[0]
        || l.filter(function (x) { return x && sanatci && (x.artists || []).some(function (y) { return adBenzer(y.name, sanatci); }) && sade(x.name).slice(0, 6) === sade(sarki).slice(0, 6); })[0];
      return t || null;
    }
    return dene(q1).then(function (l) { var t = sec(l); return t || dene(sarki + ' ' + (sanatci || '')).then(sec); }).catch(function () { return null; });
  }
  // "youngblood x attention", "A - B, C", "X ve Y": birden çok tohum şarkı. Sanatçı yazılmadıysa ada tam uyan en popüler şarkı seçilir.
  var AYRAC = /\s+(?:x|×|&|\+|ve|and|with|ile|vs\.?)\s+|\s*[,;\/]\s*/i;
  function tohumParcalari(ruh) {
    var temiz = String(ruh).replace(/["“”«»]/g, ' ').replace(/\b(gibi|benzer(i|leri)?|etrafında|etrafına|tarzında|tarzı|karışımı|karışım|mix(i)?|bir şey(ler)?|kur|oluştur|öner|şarkılar(ı)?|liste(si)?)\b/gi, ' ').replace(/\s+/g, ' ').trim();
    return temiz.split(AYRAC).map(function (x) { return x.trim(); }).filter(function (x) { return x && x.length <= 60; }).slice(0, 4);
  }
  function tohumMu(ruh) { return TOHUM.test(ruh) || (AYRAC.test(' ' + ruh + ' ') && tohumParcalari(ruh).length >= 2) || (!/[çğıöşü]/i.test(ruh) && String(ruh).trim().split(/\s+/).length <= 5); }
  function tekTohum(parca) {
    var p = parca.split(/\s+[-–—]\s+/);
    var adaylar = p.length > 1 ? [[p[0], p.slice(1).join(' ')], [p.slice(1).join(' '), p[0]]] : [];
    return adaylar.reduce(function (z, a) { return z.then(function (b) { return b || trackAra(a[0], a[1]); }); }, Promise.resolve(null)).then(function (t) {
      if (t) return t;
      // sanatçısız: adı tam eşleşenlerden en popüleri
      return api('/search?type=track&limit=10&q=' + encodeURIComponent('track:"' + parca.replace(/"/g, '') + '"')).then(function (j) {
        var l = ((j && j.tracks && j.tracks.items) || []).filter(function (x) { return x && sade(x.name) === sade(parca); });
        l.sort(function (a, b) { return (b.popularity || 0) - (a.popularity || 0); });
        return l[0] || null;
      }).catch(function () { return null; });
    });
  }
  function tohumBul(ruh) {
    var parcalar = tohumParcalari(ruh);
    return parcalar.reduce(function (z, x) { return z.then(function (l) { return tekTohum(x).then(function (t) { if (t && !l.some(function (y) { return y.id === t.id; })) l.push(t); return l; }); }); }, Promise.resolve([])).then(function (ts) {
      if (!ts.length) return null;
      return ts.reduce(function (z, t) {
        return z.then(function (l) {
          var sanatci = (t.artists || [])[0] || {};
          return api('/search?type=track&limit=8&q=' + encodeURIComponent('artist:"' + sanatci.name + '"')).then(function (j) { return (j && j.tracks && j.tracks.items) || []; }).catch(function () { return []; }).then(function (diger) {
            l.push({ t: t, ad: t.name, sanatci: (t.artists || []).map(function (x) { return x.name; }).join(', '), albüm: t.album && t.album.name, yil: t.album && String(t.album.release_date || '').slice(0, 4), pop: t.popularity,
              diger: diger.filter(function (x) { return x.id !== t.id; }).map(function (x) { return x.name + ' (' + String(x.album && x.album.release_date || '').slice(0, 4) + ')'; }).slice(0, 6) });
            return l;
          });
        });
      }, Promise.resolve([]));
    });
  }
  /* ---- Yeni öneri akışı (kullanıcı, 2026-11-04: "bu prompt'u kullanarak yeniden kodla") ----
     Tek istem: ruh hâli önceliği, ses paleti (tonlar), üç aday liste + karşılaştırma, geçiş kuralları, öz denetim, JSON.
     Dayanak: Kell & Tzanetakis (ISMIR, 2013; DJ setleri): ses dokusu en güçlü ölçüt, tempo ve ses seviyesi kontrol ediliyor, anahtar ikincil.
     Bittner ve ark. (ISMIR 2017): komşu parçalar benzer dokuda olmalı, tempo farkı 5 BPM altında tutulmalı, rahat dinleme listelerinde
     ses benzerliğine tempodan çok ağırlık verilebilir. Spotify ses seviyesi normalizasyonu (-14 LUFS) ayrıca kural gerektirmez.
     Ruh hâli örnekleri: kullanıcının "evet / x" ölçümü (x = ruh hâline uymadı, beğenmeme değil). */
  var RUH_ORNEK = {
    'on the verge of sadness': {
      uyan: ['Counting Stars — OneRepublic', 'Sign of the Times — Harry Styles', 'Stressed Out — Twenty One Pilots', 'Sucker — Jonas Brothers', 'There\'s Nothing Holdin\' Me Back — Shawn Mendes'],
      uymaz: ['Sugar — Maroon 5', 'Believer — Imagine Dragons', 'Levitating — Dua Lipa', 'SexyBack — Justin Timberlake', 'Locked out of Heaven — Bruno Mars', 'Toothbrush — DNCE', 'Nice to Meet Ya — Niall Horan', 'Adventure of a Lifetime — Coldplay', 'Pumped Up Kicks — Foster The People', 'Centuries — Fall Out Boy', 'Use Somebody — Kings of Leon', 'High Hopes — Panic! At The Disco']
    }
  };
  function ruhOrnekleri(ruh) { return RUH_ORNEK[katla2(ruh)] || { uyan: [], uymaz: [] }; }
  function satirlar(l) { return l && l.length ? l.join('\n  - ') : '(yok)'; }
  function istemUret(p) {
    return [
      'Sen deneyimli bir DJ ve müzik küratörüsün. Bir tıp öğrencisi için çalışma playlisti kuruyorsun.',
      'Ana ölçüt istenen RUH HÂLİ\'dir. Ses paleti ve zevk ikincildir.',
      '',
      'GİRDİLER',
      '- Ruh hâli: ' + p.ruh,
      '- Tonlar (ses paleti): ' + satirlar(p.tonlar),
      '- Ruh hâline uyan örnekler (kullanıcı onayladı): ' + satirlar(p.uyan),
      '- Ruh hâline uymayan örnekler (beğenmeme değil, uyumsuzluk örneği): ' + satirlar(p.uymaz),
      '- Kullanıcının ruh hâli listelerinden örnekler: ' + satirlar(p.listeler),
      '- Kütüphanem (tüm veri; dinleme süresi ve istatistik yok):',
      (p.profil || []).map(function (s) { return '  · ' + s; }).join('\n'),
      '- Mod: ' + (p.mod === 'kesif' ? 'keşif (kütüphanemdeki şarkıları önerme)' : 'karışık (kütüphanemden en çok 3 şarkı olabilir)'),
      (p.konusma ? konusmaSatirlari(p.konusma).join('\n') : ''),
      '- Atlananlar ve zaten listede olanlar (tekrar önerme): ' + satirlar(p.atlanan),
      '- Önceki liste (yalnızca ince ayar isteğinde; havayı koru, istenen yönde değiştir): ' + satirlar(p.onceki),
      '- Banger modu: ' + (p.banger ? 'açık' : 'kapalı'),
      '- Sözsüz tercih (ders ve okuma için): ' + (p.sozsuz ? 'açık. Parçaların çoğu sözsüz ya da sözü az olsun; sözü yoğun, ağıt tarzı ve duygusal vokal parçalar en çok bir-iki tane.' : 'kapalı'),
      '- İstek türü: ' + p.tur,
      '- Mevcut liste (yalnızca "ekle" modunda): ' + satirlar(p.mevcut),
      '',
      'ADIM 1 - Ruh hâli analizi (önce bunu yap)',
      'Ruh hâlini şu eksenlerde çöz: canlılık (1-5), gerginlik/huzursuzluk (1-5), duygusal ton, tempo aralığı, mod (majör / minör / belirsiz).',
      '',
      'Bilimsel ipuçları (basit piyano çalışmalarından; ticari şarkılara birebir aktarılmaz):',
      '- Canlılık hissini en çok tempo ve mod belirler: hızlı ve majör → canlılık artar; yavaş ve minör → canlılık düşer.',
      '- Minör mod gerginlik ve huzursuzluk hissini artırır. Bu hüzün demek değildir. Hüzün için sözler, vokal tonu ve dinginlik de hesaba katılmalı.',
      '- Yavaş tempo ihtişam ve derinlik hissini biraz artırabilir.',
      '',
      '"Hüzne eşiğinde" gibi ince ruh hâllerinde canlılığı düşük-orta, gerginliği düşük tut. Kasvetli değil dokunaklı parçaları öne al. (Bu hedef çıkarımdır, makalenin bulgusu değil.)',
      'Ruh hâline uyan örneklerden ortak özellikleri çıkar. Uymayanların neden uymadığını not et.',
      '',
      'ADIM 2 - Üç aday liste',
      'A) Ses paletine en yakın: vokal tınısı, prodüksiyon dokusu, kayıt dönemi, parlaklık (tiz-bas dengesi).',
      'B) Ruh hâli merkezli: ruh hâline en çok uyan. Ses paleti ikincil.',
      'C) Keşif: aynı ruh hâlinde tanınmış ama daha az çalınan parçalar.',
      'Her aday 12-15 şarkı. Tonların kendisini yeniden önerme, yalnızca onlardan ses dokusunu öğren. Tempo ve enerjiyi tonlardan kopyalama.',
      '',
      'ADIM 3 - Karşılaştır ve seç',
      'Adayları şu sırayla değerlendir: (1) ruh hâli uyumu, (2) geçiş pürüzsüzlüğü (ADIM 4), (3) çeşitlilik (aynı sanatçıdan en çok 2), (4) gerçek varlık.',
      'En iyi 12-14 şarkıyı seç ve sırala. Seçim gerekçeni "karsilastirma" alanında 2-3 cümleyle yaz.',
      '',
      'ADIM 4 - Geçiş kuralları',
      'Dayanak: DJ setlerinde ses dokusu en güçlü ölçüt; tempo ve ses seviyesi kontrol ediliyor; anahtar ikincil.',
      '- Ses dokusu: komşu iki şarkı arasında vokal tınısı, prodüksiyon ve parlaklık (tiz-bas dengesi) yakın olsun. En önemli kural.',
      '- Tempo: komşu şarkılar arasında BPM farkı mümkünse 5\'in altında. Yarı/çift tempo (ör. 70 ile 140) aynı aile sayılır. Aile değişen geçişte araya bir ara şarkı koy.',
      '- Anahtar: komşu anahtarlar ya da göreli majör-minör çiftleri uyumludur. Minör ruh hâlinde ani majör sıçramalarından kaçın.',
      '- Enerji: ani zıplamalar yerine kademeli değişim. Her 2-3 şarkıda en fazla bir seviye.',
      '- Vokal: iki ardışık şarkının ikisi de yoğun rap/vokal ağırlıklı olmasın.',
      '- Sürüklenme: liste sonunda da ruh hâline uyan kal. Adımların büyüklüğü mümkün olduğunca eşit olsun. Başlangıca uzaklığa göre sıralama yapma.',
      '- Ses seviyesi: Spotify normalizasyonu bunu büyük ölçüde halleder. Ayrıca kural koyma.',
      '- Tahminler: BPM ve mod senin bilgine dayanır. Her birine güven etiketi ver (düşük / orta / yüksek). Düşük güvenli tahmini sıkı kural gibi kullanma.',
      '',
      'ADIM 5 - Öz denetim',
      'Seçtiğin her şarkıya ruh hâli uyumu puanı ver (1-5). 4\'ün altındakileri çıkar, yerine yenisini koy. Listenin yarısından fazlası 4\'ün altındaysa baştan kur.',
      '',
      'ADIM 6 - Çıktı (yalnızca JSON, açıklamalar Türkçe)',
      '{',
      '  "baslik": "2-4 kelime",',
      '  "ruh_hali_analizi": "2-3 cümle",',
      '  "karsilastirma": "A/B/C\'den hangisi neden seçildi, 2-3 cümle",',
      '  "sarkilar": [',
      '    {"sira": 1, "sanatci": "tam sanatçı adı", "sarki": "tam şarkı adı", "mod": "majör | minör | belirsiz", "bpm_tahmini": "aralık, ör. 90-100", "bpm_guven": "düşük | orta | yüksek", "enerji": 1, "ruh_uyumu": 5, "etiketler": ["2-3 kısa etiket"], "gecis_notu": "önceki şarkıyla uyum: doku / tempo / anahtar. İlk şarkıda mevcut listenin son şarkısına göre yaz."}',
      '  ],',
      '  "yorum": "1-2 cümle; belirsizlikleri belirt"',
      '}',
      '',
      'KURALLAR',
      '- Spotify\'da gerçekten bulunabilecek şarkılar yaz. Emin değilsen yazma. Uydurma şarkı adı yasak.',
      '- Dinleme süresi, dakika ya da kişisel istatistik yazma ya da çıkarım yapma.',
      '- "ekle" modunda yalnızca yeni 10-12 şarkı ver. Mevcut listedeki şarkıları tekrar yazma.',
      '- Banger modu açıksa yalnızca kendini kanıtlamış, herkesin bildiği hitler. Kapalıysa serbest.',
      '- Edit konusu (ör. bir futbolcunun edit\'leri) gelirse bu prompt değil, ayrı edit akışı kullanılır.'
    ].join('\n');
  }
  // Kütüphane verisinden kullanıcının ruh hâli listeleri (liste adı + ilk parçalar). Adı ruh hâlindeki kelimelerle örtüşenler önce.
  function ruhIcinListeler(ruh) {
    var gruplar = {}, tok = katla2(ruh).split(' ').filter(function (w) { return w.length >= 4; });
    ((Kutu && Kutu.sarkilar) || []).forEach(function (x) {
      String(x.k || '').split(',').forEach(function (k) {
        if (k.indexOf('liste:') !== 0) return;
        var ad = k.slice(6); (gruplar[ad] = gruplar[ad] || []).push(x);
      });
    });
    return Object.keys(gruplar).map(function (ad) {
      var puan = tok.filter(function (w) { return katla2(ad).indexOf(w) >= 0; }).length;
      return { ad: ad, puan: puan, n: gruplar[ad].length, sarkilar: gruplar[ad].slice(0, 8).map(function (x) { return x.a + ' — ' + String(x.s).split(',')[0]; }) };
    }).sort(function (a, b) { return (b.puan - a.puan) || (b.n - a.n); }).slice(0, 6);
  }
  // Kütüphanenin tamamından özet: sayılar, liste adları, sık geçen sanatçılar, Spotify sıralamaları, son çalınanlar, örnek şarkılar.
  // Dinleme süresi, dakika ya da istatistik yoktur (Wrapped sürprizi bozulmasın diye).
  function kutuProfili() {
    var s = (Kutu && Kutu.sarkilar) || [], ls = (Kutu && Kutu.listeler) || [], sn = (Kutu && Kutu.sanatcilar) || {}, sc = (Kutu && Kutu.sonCalinan) || [];
    var begeni = s.filter(function (x) { return etiketVar(x, 'begeni'); }), say = {}, satir = [];
    s.forEach(function (x) { var a = String(x.s || '').split(',')[0].trim(); if (a) say[a] = (say[a] || 0) + 1; });
    var sanatcilar = Object.keys(say).sort(function (a, b) { return say[b] - say[a]; });
    satir.push('Kütüphane: ' + begeni.length + ' beğenilen şarkı, ' + ls.length + ' çalma listesi, ' + sanatcilar.length + ' farklı sanatçı.');
    if (ls.length) satir.push('Çalma listelerim (ad, şarkı sayısı): ' + ls.slice(0, 80).map(function (L) { return '"' + L.ad + '" (' + (L.n || 0) + ')'; }).join(', '));
    satir.push('Kütüphanemde en çok geçen sanatçılar: ' + sanatcilar.slice(0, 60).map(function (a) { return a + ' (' + say[a] + ')'; }).join(', '));
    var sirali = [['kisa', 'son 4 hafta'], ['orta', 'son 6 ay'], ['uzun', 'tüm zamanlar']].filter(function (x) { return (sn[x[0]] || []).length; })
      .map(function (x) { return x[1] + ': ' + sn[x[0]].slice(0, 20).join(', '); });
    if (sirali.length) satir.push("Spotify'da en çok dinlediğim sanatçılar: " + sirali.join('; '));
    if (sc.length) satir.push('Son çaldıklarım (yeniden eskiye, gün): ' + sc.slice(0, 30).map(function (x) { return x.a + ' — ' + x.s + (x.g ? ' (' + x.g + ')' : ''); }).join('; '));
    var aralik = Math.max(1, Math.ceil(begeni.length / 120));
    var ornek = begeni.filter(function (x, i) { return i % aralik === 0; }).slice(0, 120).map(function (x) { return x.a + ' — ' + String(x.s).split(',')[0]; });
    if (ornek.length) satir.push('Beğenilen şarkılardan örnek (kütüphanenin tüm bölümlerinden ' + ornek.length + ' adet): ' + ornek.join('; '));
    // İşaretler: beğendiklerin ve uymayanlar (işaret alt çubuktan ya da öneri listesinden verilir)
    var isaretler = Object.keys(Isaret).map(function (k) { return Isaret[k]; });
    var b1 = isaretler.filter(function (x) { return x.b === 'beğen'; }).slice(0, 40), b2 = isaretler.filter(function (x) { return x.b !== 'beğen'; }).slice(0, 40);
    if (b1.length) satir.push('Beğendiğim (işaretlediğim): ' + b1.map(function (x) { return x.a + ' — ' + x.s; }).join('; '));
    if (b2.length) satir.push('Beğenmediğim ya da bu ruh hâline uymayan (önerme): ' + b2.map(function (x) { return x.a + ' — ' + x.s; }).join('; '));
    return satir;
  }
  function atlananListe() { return Object.keys(Geri).filter(function (k) { return Geri[k].atla > Geri[k].begen; }).slice(-20).map(function (k) { return Geri[k].a + ' — ' + Geri[k].s; }); }
  function tonListesi() { return Ornekler.map(function (o) { return { id: o.id, u: o.u || null, ad: o.ad, sanatci: o.sanatci }; }); }
  function tonlarAnahtari() { return Ornekler.map(function (o) { return o.id || o.ad; }).join(','); }
  // Önbellek anahtarı: ruh hâli + ton seti + banger. Karışım kaydına yazılır, öneri öncesi bununla eşleştirilir.
  function oneriAnahtari(ruh) { return katla2(ruh) + '|' + tonlarAnahtari() + (Banger ? '|banger' : '') + (Sozsuz ? '|sozsuz' : ''); }
  // İstemi kurar, yapay zekâyı çağırır, JSON'u okur. Ruh hâli uyumu 4'ün altındaki ve tekrar eden adaylar çıkarılır.
  function yeniAkis(ruh, tur, mevcut, onceki) {
    var tonlar = tonListesi().concat(KonusmaBaglam ? konusmaAnilanTonlari() : []), ornek = ruhOrnekleri(ruh);
    var mevcutAd = (mevcut || []).map(function (x) { return x.a + ' — ' + String(x.s).split(',')[0]; });
    var istem = istemUret({
      ruh: ruh, tur: tur,
      onceki: onceki && onceki.sarkilar ? onceki.sarkilar.slice(0, 12).map(function (x) { return x.a + ' — ' + String(x.s).split(',')[0]; }) : [],
      tonlar: tonlar.map(function (t) { return '"' + t.ad + '" — ' + t.sanatci; }),
      uyan: ornek.uyan, uymaz: ornek.uymaz,
      listeler: ruhIcinListeler(ruh).map(function (x) { return 'Liste "' + x.ad + '": ' + x.sarkilar.join(' | '); }),
      profil: kutuProfili(), mod: muzikModu(), konusma: KonusmaBaglam,
      atlanan: atlananListe().concat(tur === 'ekle' ? mevcutAd : []),
      mevcut: tur === 'ekle' ? mevcutAd : [],
      banger: Banger, sozsuz: Sozsuz
    });
    // Liste kuran model düşünerek çalışır: 2,5 dk'ya kadar beklenir (yanıt başlığı süresi de aynı tutulur)
    var zaman = new Promise(function (_, red) { setTimeout(function () { red(new Error('yapay zekâ 150 sn\'de cevap vermedi')); }, 150000); });
    return Promise.race([U.Y.sample(istem, { cache: false, zamanAsimi: 150000 }), zaman]).then(function (c) {
      var j = jsonAyikla(c.text || '');
      var adaylar = (j.sarkilar || []).filter(function (x) { return x && x.sarki && x.sanatci && (x.ruh_uyumu == null || +x.ruh_uyumu >= 4); })
        .sort(function (a, b) { return (+a.sira || 0) - (+b.sira || 0); })
        .filter(function (x, i, d) { return d.findIndex(function (y) { return katla2(y.sanatci + ' ' + y.sarki) === katla2(x.sanatci + ' ' + x.sarki); }) === i; })
        .slice(0, 25);
      if (adaylar.length < 6) throw new Error('öneri yetersiz (' + adaylar.length + ' şarkı)');
      return { j: j, adaylar: adaylar, tonlar: tonlar };
    });
  }
  function etiketMetni(a) {
    var e = Array.isArray(a.etiketler) ? a.etiketler.join(', ') : '', g = a.gecis_notu ? String(a.gecis_notu) : '';
    return e + (e && g ? ' · ' : '') + g;
  }
  // Her aday Spotify'da aranır (sanatçı doğrulanır); bulunamayan ya da başka sanatçıya çıkan atılır. Üç eşzamanlı istek.
  function adaylariDogrula(adaylar, tonlar) {
    var bulunan = new Array(adaylar.length), g = {}, sira = 0, cozuldu = 0;
    var kutuKimlik = {}; ((Kutu && Kutu.sarkilar) || []).forEach(function (x) { kutuKimlik[x.id] = 1; }); // kütüphanedeki şarkılar işaretlenir
    tonlar.forEach(function (t) { if (t.id) g[t.id] = 1; });
    function isci() {
      var i = sira++; if (i >= adaylar.length || sogumaKaldi()) return Promise.resolve();
      var a = adaylar[i];
      return trackAra(a.sarki, a.sanatci).then(function (t) {
        var x = iz(t);
        if (x && !g[x.id]) { g[x.id] = 1; x.yeni = true; x.kapak = kapakUrl(t); x.bilinen = !!kutuKimlik[x.id]; x.neden = etiketMetni(a); x.uyum = +a.ruh_uyumu || 0; bulunan[i] = x; }
        cozuldu++; durumYaz('Spotify\'da doğrulanıyor… ' + cozuldu + '/' + adaylar.length);
      }).then(function () { return bekle(120); }).then(isci);
    }
    return Promise.all([isci(), isci(), isci()]).then(function () { return bulunan.filter(Boolean); });
  }
  // Liste: önce kullanıcının seçtiği tonlar (Spotify'da kaydı olanlar), sonra AI sırası. Aynı sanatçıdan en çok 2.
  function karisimKur(ruh, r, bulunan, onceki) {
    var g = {}, sarkilar = [], say = {};
    r.tonlar.forEach(function (t) { if (!t.u || g[t.id]) return; g[t.id] = 1; sarkilar.push({ id: t.id, u: t.u, a: t.ad, s: t.sanatci, neden: 'ton (senin seçtiğin)' }); });
    // Kütüphanedeki şarkı: keşifte yok, karışıkta en çok 3. Aynı sanatçıdan en çok 2.
    var kutuhane = 0, kutuhaneSinir = muzikModu() === 'kesif' ? 0 : 3;
    bulunan.forEach(function (x) {
      if (g[x.id]) return;
      if (x.bilinen && kutuhane >= kutuhaneSinir) return;
      var sa = sade(String(x.s).split(',')[0]); say[sa] = (say[sa] || 0) + 1; if (say[sa] > 2) return;
      g[x.id] = 1; if (x.bilinen) kutuhane++; sarkilar.push(x);
    });
    var toplam = bulunan.reduce(function (t, x) { return t + (x.uyum || 0); }, 0), ort = bulunan.length ? (toplam / bulunan.length).toFixed(1) : '-';
    return { id: Date.now().toString(36), ruh: onceki ? onceki.ruh + ' → ' + ruh : ruh, baslik: r.j.baslik || ruh,
      yorum: [r.j.ruh_hali_analizi, r.j.karsilastirma, r.j.yorum].filter(Boolean).join(' ') + ' (' + bulunan.length + ' şarkı Spotify\'da doğrulandı; ruh hâli uyumu ort. ' + ort + '/5.)',
      sarkilar: sarkilar, yeniAra: [], t: Date.now(), kesif: true, ince: !!onceki, anahtar: onceki ? null : oneriAnahtari(ruh) };
  }
  function kesifOner(ruh, onceki) {
    return yeniAkis(ruh, 'olustur', [], onceki).then(function (r) {
      return adaylariDogrula(r.adaylar, r.tonlar).then(function (bulunan) {
        durumYaz('');
        var yeni = bulunan.filter(function (x) { return !x.bilinen; }).length;
        if (yeni < 6) throw new Error('keşif için yeterli yeni şarkı bulunamadı (' + yeni + ')');
        var k = karisimKur(ruh, r, bulunan, onceki); karisimSakla(k); return k;
      });
    });
  }
  // "＋ Ekle": mevcut listenin sonuna yeni, etiketli şarkılar ekler. Liste yoksa yeni karışım.
  function ruhEkleAkis(ruh) {
    var mevcut = sonKarisim && sonKarisim.sarkilar ? sonKarisim.sarkilar : [];
    return yeniAkis(ruh, 'ekle', mevcut).then(function (r) {
      return adaylariDogrula(r.adaylar, r.tonlar).then(function (bulunan) {
        durumYaz('');
        var g = {}; mevcut.forEach(function (x) { g[x.id] = 1; });
        var yeniler = bulunan.filter(function (x) { if (g[x.id] || x.bilinen) return false; g[x.id] = 1; return true; });
        if (!yeniler.length) throw new Error('Spotify\'da bulunan yeni şarkı yok');
        var k = sonKarisim || { id: Date.now().toString(36), ruh: ruh, baslik: ruh, yorum: 'Ruh hâline göre etiketlendi.', sarkilar: [], yeniAra: [], t: Date.now(), ince: false };
        k.sarkilar = k.sarkilar.concat(yeniler);
        k.yorum = (k.yorum ? k.yorum + ' ' : '') + '+' + yeniler.length + ' şarkı (' + ruh + ').';
        return { k: k, eklenen: yeniler.length };
      });
    });
  }
  function ruhHalindenOner(ruh, taze) {
    ruh = String(ruh || '').trim(); if (!ruh) return Promise.reject(new Error('Ruh hâlini yaz.'));
    var anahtar = oneriAnahtari(ruh);
    var onceki = sonKarisim && Date.now() - (sonKarisim.t || 0) < 3 * 3600e3 && INCE.test(ruh) ? sonKarisim : null;
    var onbellek = taze || onceki ? null : karisimlar().filter(function (x) { return !x.yerel && x.anahtar === anahtar && Date.now() - x.t < 6 * 3600e3; })[0];
    if (onbellek) return Promise.resolve(Object.assign({}, onbellek, { yeniAra: [], onbellekten: true }));
    return Promise.all([kutuKaynak(), U.AI ? U.AI.hazir().catch(function () { return false; }) : Promise.resolve(!!(U.Y && U.Y.sample))]).then(function (r) {
      var kutu = r[0];
      if (!r[1]) { if (kutu.sarkilar.length >= 5) return yerelKarisim(kutu, ruh, 'yapay zekâ anahtarı yok'); throw new Error('Öneri için yapay zekâ gerekiyor: Gemini anahtarını gir (ya da Spotify\'da birkaç şarkı dinle, onlardan karıştırayım).'); }
      var mod = muzikModu();
      if (bagli() && mod !== 'kutuphane') return kesifOner(ruh, onceki).catch(function (e) { hataKaydet('kesif', e); return Promise.resolve(eskiYol()).then(function (k) { if (k) k.yorum = '⚠ Keşif bu sefer olmadı (' + String(e && e.message || e).slice(0, 120) + '); kütüphanenden kurdum. ' + (k.yorum || ''); return k; }); });
      return eskiYol();
      function eskiYol() {
      if (kutu.sarkilar.length < 15) return zevktenOner(kutu, ruh);
      // Aday havuzu: çok atlananlar çıkar; beğenilenler + en çok dinlenenler önce, sonra kütüphaneden rastgele kesit
      var l = kutu.sarkilar.filter(function (x) { return geriPuan(x) > -3; });
      l.sort(function (a, b) { function p(x) { return -geriPuan(x) * 10 + (/son/.test(x.k) ? 0 : /favori/.test(x.k) ? 1 : /begeni/.test(x.k) ? 2 : 3); } return p(a) - p(b); });
      l = l.slice(0, 130).concat(karistir(l.slice(130)).slice(0, 90));
      var sevilen = Object.keys(Geri).filter(function (k) { return Geri[k].begen > Geri[k].atla; }).slice(-10).map(function (k) { return Geri[k].a + ' — ' + Geri[k].s; });
      var atlanan = Object.keys(Geri).filter(function (k) { return Geri[k].atla > Geri[k].begen; }).slice(-10).map(function (k) { return Geri[k].a + ' — ' + Geri[k].s; });
      var istem = 'Sen kullanıcıyı iyi tanıyan bir DJ\'sin. Tıp öğrencisi kullanıcının isteği: "' + ruh + '".\nBağlam: ' + baglamMetni() + '.\n' +
        (onceki ? 'Bu bir İNCE AYAR isteği. Önceki karışım ("' + onceki.ruh + '"): ' + onceki.sarkilar.slice(0, 12).map(function (x) { return x.a + ' — ' + String(x.s).split(',')[0]; }).join('; ') + '. Önceki karışımın havasını koru ama yeni isteğe göre değiştir.\n' : '') +
        (sevilen.length ? 'Son zamanlarda SEVDİKLERİ (sonuna kadar dinledi / beğendi): ' + sevilen.join('; ') + '\n' : '') +
        (atlanan.length ? 'ATLADIKLARI (koyma, benzerlerinden de kaçın): ' + atlanan.join('; ') + '\n' : '') +
        'Aşağıdaki KENDİ şarkılarından (numara|şarkı — sanatçı) 15 tane seç. Tempo, enerji, sözlerin dili ve duygusunu kendi müzik bilginle değerlendir; akış isteği yakalayıp yavaşça istenen yöne taşısın. Odak/ders bağlamında az sözlü ya da tanıdık şarkıları öne al. Her seçime en çok 8 kelimelik Türkçe gerekçe yaz.\n' +
        'Ayrıca zevkine uyan ama listede OLMAYAN, gerçekten var olan 4 şarkı öner.\n' +
        'YALNIZ JSON yaz: {"baslik":"2-4 kelime","yorum":"1-2 samimi Türkçe cümle","secim":[{"n":numara,"neden":"kısa gerekçe"}],"yeni":["Sanatçı - Şarkı"]}\n\n' +
        l.map(function (x, i) { return i + '|' + x.a.slice(0, 50) + ' — ' + x.s.split(',')[0].slice(0, 30); }).join('\n');
      if (Banger) istem = 'BANGER MODU (açık): yalnızca kendini kanıtlamış, herkesin bildiği, yıllardır dinlenen ve partilerde/edit\'lerde hep çalan hit şarkılar öner. Deneysel, az bilinen ve niş parçalardan kaçın.\n' + istem;
      var zaman = new Promise(function (_, red) { setTimeout(function () { red(new Error('yapay zekâ 30 sn\'de cevap vermedi')); }, 30000); });
      return Promise.race([U.Y.sample(istem, { cache: false, hafif: true }), zaman]).then(function (c) {
        var j = jsonAyikla(c.text || ''), g = {};
        var secim = (j.secim || []).map(function (v) {
          var n = typeof v === 'object' && v ? v.n : v, x = l[+n];
          return x ? Object.assign({}, x, { neden: typeof v === 'object' && v && v.neden ? String(v.neden).slice(0, 80) : '' }) : null;
        }).filter(function (x) { if (!x || g[x.id]) return false; g[x.id] = 1; return true; });
        if (secim.length < 3) throw new Error('öneri boş geldi');
        var k = { id: Date.now().toString(36), ruh: onceki ? onceki.ruh + ' → ' + ruh : ruh, baslik: j.baslik || ruh, yorum: j.yorum || '', sarkilar: cesitlendir(secim), yeniAra: (j.yeni || []).slice(0, 4), t: Date.now(), ince: !!onceki };
        if (YEREL) yeniCevir(k); // yerel mod aramayla çaldığı için Spotify araması gerekmez
        karisimSakla(k);
        return k;
      }).catch(function (e) {
        var m = String(e && (e.code || e.message) || e);
        return yerelKarisim(kutu, ruh, /rate|kota|429/i.test(m) ? 'kota doldu' : /cevap vermedi/.test(m) ? 'zaman aşımı' : 'hata');
      });
      }
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
  function spotifydaAc(uri) { if (window.__spotifyAcTest) return window.__spotifyAcTest(uri); try { location.href = uri; } catch (e) {} }
  function oneDon() { try { if (K && K.oneGetir && K.onPlandaMi && !K.onPlandaMi()) K.oneGetir(); } catch (e) {} }
  // Bu tableti Spotify cihaz listesinde tanı: WebView user-agent'ındaki model adı (ör. SM-X710) ya da kayıtlı kimlik
  var MODEL = (/Android [^;]*; ([^;)]+?)(?: Build|\))/.exec(navigator.userAgent) || [])[1] || '';
  function tabletMi(x) { if (!x) return false; if (D.cihaz && x.id === D.cihaz) return true; var n = String(x.name || '').toLowerCase(), m = MODEL.toLowerCase().trim(); return !!(m && m.length > 2 && (n.indexOf(m) >= 0 || m.indexOf(n) >= 0)); }
  function cihazBul() {
    return api('/me/player/devices').then(function (d) {
      var l = ((d && d.devices) || []).filter(function (x) { return !x.is_restricted; });
      // Bu cihazın türü: tablet WebView'ının user-agent'ında "Mobile" yoktur → telefon tipindeki cihazlar asla "bu cihaz" sayılmaz
      var tur = /Mobile/.test(navigator.userAgent) ? /smartphone/i : /tablet/i;
      function p(x) { return tabletMi(x) ? 0 : (x.is_active && tur.test(x.type)) ? 1 : tur.test(x.type) ? 2 : x.is_active ? 4 : 9; }
      l.sort(function (a, b) { return p(a) - p(b); });
      var c = l[0] && p(l[0]) < 9 ? l[0] : null;
      if (YEREL && c && p(c) <= 2 && D.cihaz !== c.id) { D.cihaz = c.id; kaydet(); } // bu tabletin Spotify'ı
      if (c) c._bu = p(c) <= 2;
      return c;
    });
  }
  // Yerel modda: tabletteki Spotify duraklatılmışsa önce uyandır (Connect listesinden düşmüş olabilir), sonra tableti bul
  var Adimlar = [];
  function adim(t) { Adimlar.push(new Date().toLocaleTimeString('tr-TR') + ' ' + t); if (Adimlar.length > 30) Adimlar.shift(); }
  function tabletBul() { return cihazBul().then(function (c) { return c && c._bu ? c : null; }); }
  // Döner: tablet cihazı | null (yerel oturum yok → genel yol). Tabletin Spotify'ı açıkken asla başka cihaza çalmaz.
  // Aynı anda tek çalma denemesi (kullanıcı raporu: art arda basınca 5 deneme iç içe geçti). Yeni istek eskisini iptal eder.
  var CalNo = 0, Son = {};
  function iptalHatasi() { return Object.assign(new Error('iptal'), { iptal: true }); }
  function bekleNo(no, ms) { return bekle(ms).then(function () { if (no !== CalNo) throw iptalHatasi(); }); }
  // Kullanıcı raporu (r17): tablette Spotify kapalıyken "genel yol" listeyi o an aktif olan iPhone'a çaldı.
  // Cihaz sürümünde (YEREL) liste ASLA başka cihaza gitmez: Spotify kapalıysa tablette açılır, tablet listede aranır.
  function tabletHazirla(no, uri) {
    if (!YEREL) { adim('tarayıcı → aktif cihaza'); return Promise.resolve(null); }
    var d = yDurum() || {};
    var n = 0, onde = false, uyandir;
    // Kullanıcı (r21): uyandırma eski şarkıyı devam ettirip doğrulamayı yanıltıyordu → tablet listede varsa uyandırma yok
    var once = tabletBul().catch(function () { return null; });
    return once.then(function (c0) {
      if (c0) { adim('tablet listede: ' + c0.name + (c0.is_active ? ' (aktif)' : '') + ' → uyandırma gerekmedi'); return c0; }
      return tabletUyandirVeBul(no, uri, d);
    });
  }
  function tabletUyandirVeBul(no, uri, d) {
    var n = 0, onde = false, uyandir;
    if (d.izin !== false && !d.var) { // Spotify tablette kapalı: aç (öne gelir), listede görünmesini bekle
      onde = true; adim('tablette Spotify kapalı → açılıyor'); spotifydaAc(uri); uyandir = bekleNo(no, 3000);
    } else if (d.izin !== false && !d.calisiyor) { adim('tablet duraklatılmış → oynat (uyandırma)'); K.spotifyKomut('oynat'); uyandir = bekleNo(no, 1500); }
    else uyandir = Promise.resolve();
    function ara() {
      if (no !== CalNo) throw iptalHatasi();
      return tabletBul().then(function (c) {
        n++; adim('cihaz arama ' + n + ': ' + (c ? c.name + ' [' + c.type + (c.is_active ? ', aktif' : '') + ']' : 'tablet yok'));
        if (c) { if (onde) c._onde = true; return c; }
        if (n === 4 && !onde && uri) { // uyandırma yetmedi (r16 raporu: hiç cihaz yok): Spotify'ı öne getir, listede görünmesini bekle
          onde = true; adim('cihaz listede yok → Spotify öne getiriliyor'); spotifydaAc(uri);
          return bekleNo(no, 3000).then(ara);
        }
        if (n >= 8 || (n >= 4 && !uri)) return api('/me/player/devices').then(function (j) {
          if (onde) setTimeout(oneDon, 300);
          var l = ((j && j.devices) || []).map(function (x) { return x.name + ' [' + x.type + ']'; }).join(', ') || 'hiç cihaz yok';
          throw Object.assign(new Error('Bu tablet Spotify\'ın cihaz listesinde görünmüyor (görünenler: ' + l + '). Spotify\'ı açıp bir şarkıyı birkaç saniye çal, sonra tekrar dene.'), { bilgi: true });
        });
        return bekleNo(no, 2000).then(ara);
      });
    }
    return uyandir.then(ara);
  }
  // Cihaz görünene kadar seyrek yokla (en çok 5 kez, 2 sn arayla); kota hatası gelirse hemen dur
  function cihazBekle(n) {
    return bekle(2000).then(cihazBul).then(function (c) { return c || (n > 1 ? cihazBekle(n - 1) : null); }, function (e) { if (e.durum === 429) throw e; return n > 1 ? cihazBekle(n - 1) : null; });
  }
  // "Aktif cihaz yok" (kullanıcı raporu r14: 404 NO_ACTIVE_DEVICE — Spotify duraklatılmış kalınca tablet Connect listesinden düşüyor).
  // Çare: Spotify'ı medya oturumundan "oynat" ile uyandır (bu komut çalışıyor), tablet listeye dönünce listeyi ona çal.
  function cihazUyandir(uri) {
    var d = typeof yDurum === 'function' ? yDurum() : null;
    if (d && d.izin !== false && d.var) { try { K.spotifyKomut('oynat'); } catch (e) {} return cihazBekle(5); }
    // Spotify hiç açık değil: bir kez açılır (tek yol), sonra Carvis'e dönülür
    spotifydaAc(uri);
    return cihazBekle(6).then(function (c) { setTimeout(oneDon, 900); return c; });
  }
  function premiumTazele() {
    return api('/me').then(function (m) { D.premium = m.product ? m.product === 'premium' : (D.premium !== false); if (!D.ben) D.ben = { id: m.id, ad: m.display_name || m.id }; kaydet(); return D.premium; }).catch(function () { return D.premium; });
  }
  // Premium olmadan: karışımı Spotify listesi olarak kaydet ve listeyi Spotify'da aç (tek şarkı değil, bütün karışım)
  function listeOlarakAc(k) {
    return karisimiKaydet(k).then(function (p) { spotifydaAc('spotify:playlist:' + p.id); return 'liste'; });
  }
  // uriler: çalınacak şarkılar; bas: başlangıç sırası; k: (varsa) karışım — Premium yoksa liste olarak açmak için
  function cal(uriler, bas, k, beklenen) {
    uriler = uriler.slice(0, 100); bas = bas || 0;
    var no = ++CalNo; function b(ms) { return bekleNo(no, ms); }
    var govde = { uris: uriler, offset: { position: bas } };
    function oynat(c) { return api('/me/player/play' + (c ? '?device_id=' + encodeURIComponent(c.id) : ''), { method: 'PUT', body: govde }); }
    function premiumYok(e) {
      D.premium = false; kaydet();
      if (k) return listeOlarakAc(k).then(function () { throw Object.assign(new Error('Premium olmadığı için uygulama içinden başlatılamıyor; karışım Spotify\'a liste olarak kaydedildi ve açıldı (oradan ▶ ile baştan sona çalar).'), { bilgi: true }); });
      spotifydaAc(uriler[bas]); throw e;
    }
    // Kullanıcı tanılaması (r16): Spotify isteği kabul ediyor (204) ama tablet "aktif" değilken uygulama komutu yok sayıyor.
    // Bu yüzden her adımdan sonra tablette istenen şarkının GERÇEKTEN çaldığı yerelden doğrulanır; çalmıyorsa sıradaki yol denenir.
    function eslesir(a, b) { a = sade(a); b = sade(b); return !!(a && b && (a.indexOf(b) === 0 || b.indexOf(a) === 0)); }
    function caliyorMu(ms) {
      if (!beklenen || !YEREL) return Promise.resolve(true);
      var t0 = Date.now();
      return (function bak() { return b(700).then(function () { var d = yDurum() || {}; if (d.calisiyor && eslesir(d.baslik, beklenen)) return true; return Date.now() - t0 > ms ? false : bak(); }); })();
    }
    function oynatTekrar(c) { return oynat(c).catch(function (e2) { if (e2.durum !== 404) throw e2; adim('404 → 1,2 sn sonra tekrar'); return b(1200).then(function () { return oynat(c); }); }); }
    function aktifBekle(c, n) {
      if (c.is_active || !n) return Promise.resolve(c);
      return b(1500).then(cihazBul).then(function (c2) { if (c2 && c2.id === c.id && c2.is_active) { adim('tablet aktif oldu'); return c2; } return aktifBekle(c, n - 1); }, function () { return c; });
    }
    // Kullanıcı (r21 izleme raporu): elle çalınan şarkı sorunsuz çalıyor; Carvis'in art arda gönderdiği "aktar / öne getir /
    // tekrar çal" komutları zaten çalan şarkıyı bozuyordu. Artık: TEK komut, sağlam doğrulama (yerel + Spotify sunucusu),
    // şarkı 8 sn'de gerçekten başlamadıysa EN ÇOK bir yeniden deneme. Spotify öne getirilmez.
    function dogrula(ms, once) {
      var t0 = Date.now(), i = 0;
      return (function bak() {
        return b(1000).then(function () {
          i++;
          var d = yDurum() || {};
          if (d.calisiyor && (eslesir(d.baslik, beklenen) || (d.baslik && d.baslik !== once))) { adim('doğrulama: tablette çalıyor (' + d.baslik + ')'); return true; }
          var sor = i % 3 === 0 ? api('/me/player').then(function (p) { if (p && p.is_playing && p.item && (!beklenen || eslesir(p.item.name, beklenen))) { adim('doğrulama: Spotify sunucusu çalıyor diyor (' + p.item.name + ')'); return true; } return false; }, function () { return false; }) : Promise.resolve(false);
          return sor.then(function (ok) { if (ok) return true; return Date.now() - t0 > ms ? false : bak(); });
        });
      })();
    }
    function tabletteCal(c) {
      var once = (yDurum() || {}).baslik || '';
      if (!beklenen) return oynatTekrar(c);
      return oynatTekrar(c).then(function () { return dogrula(8000, once); }).then(function (ok) {
        if (ok) return;
        adim('8 sn\'de başlamadı → bir kez: çalmayı tablete aktar + tekrar gönder');
        return api('/me/player', { method: 'PUT', body: { device_ids: [c.id], play: false } }).catch(function (e) { adim('aktarma: ' + hataMetni(e)); })
          .then(function () { return b(1500); }).then(function () { return oynatTekrar(c); }).then(function () { return dogrula(8000, once); })
          .then(function (ok2) { if (!ok2) throw Object.assign(new Error('Spotify isteği kabul etti ama tablette şarkı başlamadı. ▶ Test çalma raporunu gönderirsen bakarım.'), { bilgi: true }); });
      });
    }
    Adimlar = [];
    return tabletHazirla(no, uriler[bas]).then(function (c) {
      adim('çal → ' + (c ? 'tablete (device_id)' : 'aktif cihaza'));
      if (!c) return oynat(null);
      return tabletteCal(c).then(function (r) { if (c._onde) setTimeout(oneDon, 500); Son.cihaz = c; return r; }, function (e) { if (c._onde) setTimeout(oneDon, 500); throw e; });
    }).then(function (r) { adim('çal: tamam'); return r; }, function (e) { adim('çal: ' + (e.bilgi ? e.message : hataMetni(e))); throw e; }).catch(function (e) {
      if (e.bilgi || e.iptal) throw e;
      if (no !== CalNo) throw iptalHatasi();
      if (e.durum === 404 || e.neden === 'NO_ACTIVE_DEVICE') {
        var dene = function (c) { return oynat(c).catch(function (e2) { if (e2.durum === 404) return bekle(1200).then(function () { return oynat(c); }); throw e2; }); };
        return cihazBul().then(function (c) {
          if (c) return dene(c);
          return cihazUyandir(uriler[bas]).then(function (c2) {
            if (!c2) throw new Error('Tablet Spotify\'da cihaz olarak görünmedi. Spotify\'ı açıp herhangi bir şarkıyı 2-3 saniye çal, Carvis\'e dönüp tekrar dene.');
            return dene(c2);
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
  var SURUM = '2026.11.08-r144'; window.CARVIS_SURUM = SURUM;
  var YEREL = !!(K && K.spotifyDurum && K.spotifyCal);
  function yDurum() { if (!YEREL) return null; try { return JSON.parse(K.spotifyDurum() || '{}'); } catch (e) { return null; } }
  // ı/i birleştirilir: "Do I Clench" Türkçe küçültmede "do ı clench" olur, kullanıcı "do i clench" yazar
  function sade(t) { return String(t || '').toLocaleLowerCase('tr').replace(/\(.*?\)|\[.*?\]/g, '').replace(/ - .*$/, '').replace(/ı/g, 'i').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^\p{L}\p{N}]/gu, ''); }
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
  // Listeyi çalma: Spotify Web API (Premium). Medya oturumundan "ara ve çal" Spotify oturumunu kapattığı için
  // (kullanıcı 2026-11-02: "şarkıya tıklayınca medya çalar bildirimi gidiyor, hiçbir şey çalmıyor") artık kullanılmıyor.
  // Liste Spotify'ın kendi çalma sırasına verilir: ⏭ listedeki sonraki şarkıya geçer.
  var Arama = oku('spotify_arama_v1', {}); // "şarkı sanatçı" → spotify:track:…
  function uriBul(x) {
    if (x.u) return Promise.resolve(x.u);
    var q = (x.a + ' ' + String(x.s || '').split(',')[0]).trim(), kq = katla2(q);
    if (Arama[kq]) { x.u = Arama[kq]; return Promise.resolve(x.u); }
    return api('/search?type=track&limit=1&q=' + encodeURIComponent(q)).then(function (s) {
      var t = s && s.tracks && s.tracks.items && s.tracks.items[0];
      if (t) { x.u = t.uri; Arama[kq] = t.uri; var ks = Object.keys(Arama); if (ks.length > 600) delete Arama[ks[0]]; yaz('spotify_arama_v1', Arama); }
      return x.u || null;
    }, function (e) { if (e.durum === 429 || e.durum === 401 || e.durum === 403) throw e; return null; });
  }
  function hesapGerekli() { var e = new Error('Listeyi Spotify\'da sırayla çalmak için Spotify hesabını bağlaman gerekiyor (Premium\'un var; "Spotify hesabı" bölümünden, tek seferlik).'); e.hesap = true; return e; }
  /* ---- Dokunarak çalma (kullanıcı r22 testi: Spotify, Web API'den başlatılan çalmada oynatıcıyı sıfırlıyor;
     elle çalma sorunsuz). Karışım tek bir "Carvis · Şimdi" listesine yazılır, liste Spotify'da açılır ve
     erişilebilirlik servisi listenin Çal düğmesine dokunur — Spotify için elle başlatılmış çalma. ---- */
  function erisimVar() { try { return !!(K && K.erisimAcik && K.erisimAcik()); } catch (e) { return false; } }
  function erisimHatasi() { var e = new Error('Carvis\'in Spotify\'da Çal\'a senin yerine dokunabilmesi için erişilebilirlik servisini açman gerekiyor: Ayarlar → Erişilebilirlik → Yüklü uygulamalar → C.A.R.V.I.S. → Aç.'); e.erisim = true; return e; }
  function eslesirAd(a, b) { a = sade(a); b = sade(b); return !!(a && b && (a.indexOf(b) === 0 || b.indexOf(a) === 0)); }
  function carvisListesi(uriler) {
    uriler = uriler.slice(0, 100);
    function yazListe(id) {
      return api('/playlists/' + id + '/items', { method: 'PUT', body: { uris: uriler } }).catch(function (e) {
        if (!eskiyeDus(e) || e.durum === 403) throw e;
        return api('/playlists/' + id + '/tracks', { method: 'PUT', body: { uris: uriler } }).catch(function () { throw e; });
      }).then(function () { return id; });
    }
    if (D.carvisListe) return yazListe(D.carvisListe).catch(function (e) { if (e.durum === 404 || e.durum === 403) { D.carvisListe = null; kaydet(); return carvisListesi(uriler); } throw e; });
    return listeOlustur('Carvis · Şimdi', 'C.A.R.V.I.S. ruh hâli karışımı — her öneride otomatik güncellenir').then(function (p) { D.carvisListe = p.id; kaydet(); return yazListe(p.id); });
  }
  function dokunarakCal(k, i) {
    var l = k.sarkilar.slice(i || 0, (i || 0) + 50);
    Adimlar = []; var no = ++CalNo;
    if (!erisimVar()) return Promise.reject(erisimHatasi());
    return l.reduce(function (z, x) { return z.then(function () { return uriBul(x); }); }, Promise.resolve()).then(function () {
      var uriler = l.map(function (x) { return x.u; }).filter(Boolean);
      if (!uriler.length) throw new Error('Bu şarkılar Spotify\'da bulunamadı.');
      adim('"Carvis · Şimdi" listesi güncelleniyor (' + uriler.length + ' şarkı)');
      return carvisListesi(uriler);
    }).then(function (id) {
      if (no !== CalNo) throw iptalHatasi();
      var ilkAd = (l.filter(function (x) { return x.u; })[0] || l[0]).a;
      adim('liste Spotify\'da açılıyor, en üstteki şarkıya dokunulacak (' + ilkAd + ')');
      var r = K.spotifyListeSarkiCal ? K.spotifyListeSarkiCal('spotify:playlist:' + id, ilkAd) : K.spotifyListeCal('spotify:playlist:' + id);
      if (r === 'erisim_yok') throw erisimHatasi();
      if (r !== 'ok') throw new Error('Spotify açılamadı: ' + r);
      var adlar = l.map(function (x) { return x.a; }), t0 = Date.now(), sonLd = '';
      return (function bak() {
        return bekleNo(no, 700).then(function () {
          var d = yDurum() || {}, ld = ''; try { ld = K.spotifyListeDurum() || ''; } catch (e) {}
          if (ld !== sonLd) { adim('dokunma: ' + ld); sonLd = ld; }
          if (d.calisiyor && adlar.some(function (a) { return eslesirAd(d.baslik, a); })) {
            adim('tablette çalıyor ✓ (' + d.baslik + ')'); karisimSakla(k); setTimeout(oneDon, 1500); return 'ok';
          }
          if (Date.now() - t0 > 18000 || (/bulunamadi|hata/.test(ld) && Date.now() - t0 > 4000)) {
            throw Object.assign(new Error('Liste Spotify\'da açıldı ama en üstteki şarkıya dokunulamadı (' + (ld || 'yanıt yok') + '). "Carvis · Şimdi" listesinde ilk şarkıya bir kez sen dokun; raporu gönderirsen düzeltirim.'), { bilgi: true });
          }
          return bak();
        });
      })();
    });
  }
  function karisimCal(k, i) {
    i = i || 0;
    if (YEREL && bagli() && K.spotifyListeCal) return dokunarakCal(k, i);
    if (!bagli()) {
      if (YEREL && K.muzik) { var x = k.sarkilar[i]; K.muzik((x.a + ' ' + String(x.s || '').split(',')[0]).trim(), 'spotify'); }
      return Promise.reject(hesapGerekli());
    }
    var l = k.sarkilar.slice(i);
    // İlk 6 şarkının adresini bul, hemen başlat; kalanları arkadan bulup Spotify sırasına ekle
    var ilk = l.slice(0, 6), kalan = l.slice(6);
    return ilk.reduce(function (z, x) { return z.then(function () { return uriBul(x); }); }, Promise.resolve()).then(function () {
      var uriler = ilk.map(function (x) { return x.u; }).filter(Boolean);
      if (!uriler.length) throw new Error('Bu şarkılar Spotify\'da bulunamadı.');
      return cal(uriler, 0, k, ilk.filter(function (x) { return x.u; })[0].a).then(function () {
        karisimSakla(k); Kuyruk = null;
        var no = CalNo, cihaz = Son.cihaz ? '&device_id=' + encodeURIComponent(Son.cihaz.id) : '';
        kalan.reduce(function (z, x) { return z.then(function () { return bekleNo(no, 300); }).then(function () { return uriBul(x).then(function (u) { if (u) return api('/me/player/queue?uri=' + encodeURIComponent(u) + cihaz, { method: 'POST' }); }); }); }, Promise.resolve())
          .then(function () { karisimSakla(k); }, function () {});
        return 'ok';
      });
    });
  }
  function calMesaji(r) { return YEREL ? '▶ Çalıyor — "Carvis · Şimdi" listesi Spotify\'da başladı, ⏭ listede ilerler.' : '▶ Çalıyor — liste Spotify\'ın sırasında, ⏭ listedeki sonraki şarkıya geçer.'; }

  var Simdi = null;
  var mini = el('div', { class: 'sp-mini', hidden: true, role: 'region', 'aria-label': 'Spotify' });
  document.body.appendChild(mini);
  function simdiYenile() {
    if (document.hidden) return Promise.resolve();
    var d = yDurum();
    if (d && d.var && d.baslik) {
      Simdi = { a: d.baslik, s: d.sanatci || '', kapak: d.kapak ? { url: d.kapak } : null, calisiyor: !!d.calisiyor, ilerleme: d.konum || 0, sure: d.sure || 1, alindi: Date.now() };
      miniCiz(); simdiKartCiz(); kuyrukCiz(); return Promise.resolve();
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
  var miniSig = ''; // mini çubuğun son çizilen içeriği
  function miniCiz() {
    if (!Simdi || U.Durum.gorunum === 'muzik') { mini.hidden = true; miniSig = ''; return; }
    // İçerik değişmediyse DOM yeniden kurulmaz: 3 sn'lik yoklama, tam o anda yapılan dokunuşu kaybettirmesin
    var sig = [Simdi.a, Simdi.s, (Simdi.kapak && Simdi.kapak.url) || kapakBul(Simdi.a, Simdi.s) || '', !!Simdi.calisiyor, isaretOku(Simdi.a, Simdi.s) || ''].join('\u0001');
    mini.hidden = false;
    if (sig === miniSig) return;
    miniSig = sig; mini.innerHTML = '';
    mini.classList.toggle('calar', Simdi.calisiyor);
    var kap = Simdi.kapak || (function () { var u = kapakBul(Simdi.a, Simdi.s); return u ? { url: u } : null; })();
    mini.appendChild(el('div', { class: 'sp-disk', style: kap ? 'background-image:url("' + kap.url + '")' : '' }));
    mini.appendChild(el('button', { class: 'sp-bilgi', type: 'button', onclick: function () { U.git('muzik'); } }, [el('b', { text: Simdi.a }), el('small', { text: Simdi.s })]));
    mini.appendChild(dugme('⏮', 'Önceki', function () { kontrol('onceki'); }));
    mini.appendChild(dugme(Simdi.calisiyor ? '⏸' : '▶', Simdi.calisiyor ? 'Duraklat' : 'Çal', function () { kontrol(Simdi.calisiyor ? 'duraklat' : 'devam'); }));
    mini.appendChild(dugme('⏭', 'Sonraki', function () { kontrol('sonraki'); }));
    mini.appendChild(isaretGrubu());
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
    '.sp-oy{display:flex;gap:6px;align-items:center}.sp-oyd{cursor:pointer;opacity:.55;font-size:15px;padding:2px 4px}.sp-oyd:hover{opacity:1}',
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
    '.sp-isaret{display:flex;gap:2px;flex-shrink:0}.sp-isaret button{width:26px;height:26px;padding:0;border:0;background:none;color:var(--metin-sonuk);font-size:13px;cursor:pointer}.sp-isaret button.aktif{color:var(--holo-sicak,#ffb547);text-shadow:0 0 8px currentColor}',
    '.sp-konusma{margin:4px 0 10px}.sp-balon{border-left:2px solid var(--holo,#5ee7ff);padding:8px 12px;margin:6px 0;background:rgba(94,231,255,.06)}.sp-balon b{font:600 11px var(--f-kod);letter-spacing:.18em;color:var(--holo-sicak,#ffb547)}.sp-balon p{margin:4px 0 0;font-size:15px}.sp-cevaplar{font-size:12px;color:var(--metin-sonuk);margin-top:6px}.sp-cevaplar span{display:block;margin:2px 0}.sp-cip-secili{border-color:var(--holo,#5ee7ff)!important;color:var(--holo,#5ee7ff)!important}',
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
  function hataYaz(yer, e) {
    yer.innerHTML = ''; yer.appendChild(el('span', { class: 'sp-hata', text: e && (e.bilgi || e.izin || e.hesap || e.erisim) ? e.message : hataMetni(e) }));
    if (e && e.erisim) { yer.appendChild(document.createTextNode(' ')); yer.appendChild(el('button', { class: 'dugme ana', type: 'button', onclick: function () { try { K.erisimAyarAc(); } catch (x) {} } }, ['♿ Erişilebilirliği aç'])); }
    if (e && e.izin) { yer.appendChild(document.createTextNode(' ')); yer.appendChild(izinDugmesi()); }
    if (e && e.hesap) { yer.appendChild(document.createTextNode(' ')); yer.appendChild(el('button', { class: 'dugme', type: 'button', onclick: function () { var h = $('#spHesap'); if (h) h.scrollIntoView({ behavior: 'smooth' }); } }, ['↓ Hesabı bağla'])); }
  }
  function ruhKarisimCal(ruh, taze, kap) {
    return ruhHalindenOner(ruh, taze).then(function (k) {
      sonKarisim = k; if (kap) karisimCiz(kap, k);
      var yer = function () { var x = kap && kap.querySelector('.sp-durum.cal'); return x && sonKarisim === k ? x : null; };
      var d = function (t) { var x = yer(); if (x) x.textContent = t; };
      d('Başlatılıyor…');
      return karisimCal(k, 0).then(function (r) { d(calMesaji(r)); return true; }, function (e) { if (e && e.iptal) return false; var x = yer(); if (x) hataYaz(x, e); k._hata = e; return false; })
        .then(function (caliyor) {
          var arka = YEREL ? Promise.resolve() : yenileriEkle(k, caliyor).then(function (yeni) { if (yeni.length && kap && sonKarisim === k) { karisimCiz(kap, k); d((caliyor ? '▶ Çalıyor · ' : '') + yeni.length + ' yeni öneri sıraya eklendi.'); } });
          return { k: k, caliyor: caliyor, arka: arka };
        });
    }, function (e) { if (kap) hataGoster(kap, e); throw e; }).catch(function (e) { return { hata: e }; });
  }
  function kuyrukCiz() {
    var c = Simdi && sade(Simdi.a), idx = -1;
    if (c && sonKarisim) sonKarisim.sarkilar.some(function (x, i) { var a = sade(x.a); if (a && (a === c || a.indexOf(c) === 0 || c.indexOf(a) === 0)) { idx = i; return true; } return false; });
    $$('.sp-sarki').forEach(function (b, i) { b.classList.toggle('simdi', i === idx); });
  }
  function karisimCiz(kap, k) {
    kap.innerHTML = '';
    if (!k) return;
    kap.appendChild(el('h2', { text: 'KARIŞIM // ' + k.baslik.toLocaleUpperCase('tr') }));
    if (k.yorum) kap.appendChild(el('p', { text: k.yorum }));
    if (k.onbellekten || k.yerel) kap.appendChild(el('p', { class: 'sp-durum' }, [k.onbellekten ? 'Bu ruh hâli için birkaç saat önce kurulan karışım. ' : '',
      el('button', { class: 'cip', type: 'button', onclick: function () { kap.innerHTML = '<div class="yukleniyor">Yeni karışım kuruluyor…</div>'; ruhKarisimCal(k.ruh, true, kap); } }, ['↻ Yeni karışım kur'])]));
    var durum = el('span', { class: 'sp-durum cal' });
    function basla(i) { durum.textContent = 'Başlatılıyor…'; karisimCal(k, i).then(function (r) { durum.textContent = calMesaji(r); kuyrukCiz(); }, function (e) { if (!(e && e.iptal)) hataYaz(durum, e); }); }
    var satir = [el('button', { class: 'dugme ana', type: 'button', onclick: function () { basla(0); } }, ['▶ Hepsini çal'])];
    if (bagli()) satir.push(el('button', { class: 'dugme', type: 'button', onclick: function () { var b = this; b.disabled = true; durum.textContent = 'Spotify\'a kaydediliyor…'; karisimiKaydet(k).then(function () { durum.textContent = '✓ Listelerine eklendi: 1001 · ' + k.baslik; }, function (e) { b.disabled = false; durum.textContent = 'Kaydedilemedi: ' + hataMetni(e); }); } }, ['💾 Spotify\'a kaydet']));
    satir.push(durum);
    kap.appendChild(el('div', { class: 'sp-satir' }, satir));
    var l = el('div', { class: 'sp-liste' });
    k.sarkilar.forEach(function (x, i) {
      l.appendChild(el('button', { class: 'sp-sarki', type: 'button', style: 'animation-delay:' + Math.min(i * 30, 600) + 'ms', title: 'Buradan başlat', onclick: function () { basla(i); } },
        [el('span', { class: 'n', text: String(i + 1).padStart(2, '0') }), el('span', {}, [el('b', { text: x.a }), el('small', { text: x.s + (x.neden ? ' · ' + x.neden : '') })]),
          el('span', { class: 'sp-oy' }, [x.yeni ? el('span', { class: 'sp-yeni', text: 'YENİ' }) : null,
            el('span', { class: 'sp-oyd', role: 'button', title: 'Beğendim', text: geriPuan(x) > 0 ? '💙' : '👍', onclick: function (e) { e.stopPropagation(); isaretle(x.a, x.s, 'beğen'); this.textContent = '💙'; U.toast('Not aldım: ' + x.a + ' 👍'); } }),
            el('span', { class: 'sp-oyd', role: 'button', title: 'Bunu koyma', text: '👎', onclick: function (e) { e.stopPropagation(); isaretle(x.a, x.s, 'beğenme'); this.closest('.sp-sarki').style.opacity = '.35'; U.toast('Bir daha koymam: ' + x.a); } })])]));
    });
    kap.appendChild(l); kuyrukCiz();
  }
  /* ---------------- tanılama ---------------- */
  // Kullanıcı (r18): "Spotify'da elle başlattığımda bile 1 sn çalıp duruyor." → Spotify'ın kendi durum/hata mesajını kaydet
  var DURUM_AD = { 0: 'yok', 1: 'durdu', 2: 'duraklatıldı', 3: 'ÇALIYOR', 4: 'ileri sarma', 5: 'geri sarma', 6: 'YÜKLENİYOR', 7: 'HATA', 8: 'bağlanıyor', 9: 'öncekine geçiyor', 10: 'sonrakine geçiyor', 11: 'sıradakine geçiyor' };
  function izle(ms) {
    var satir = [], son = '', t0 = Date.now();
    return new Promise(function (ok) {
      var zm = setInterval(function () {
        var d = yDurum() || {};
        var k = d.izin === false ? 'bildirim izni yok' : !d.var ? 'Spotify oturumu yok' : (DURUM_AD[d.durum] || ('durum ' + d.durum)) + ' · ' + (d.baslik || '?') + (d.konum != null ? ' · ' + Math.round(d.konum / 1000) + ' sn' : '') + (d.hataMesaji ? ' · SPOTIFY HATASI: ' + d.hataMesaji : '') + (d.ekler ? ' · ' + d.ekler.slice(0, 160) : '');
        var kisa = k.replace(/ · \d+ sn/, '');
        if (kisa !== son) { satir.push('+' + ((Date.now() - t0) / 1000).toFixed(1) + ' sn  ' + k); son = kisa; }
        if (Date.now() - t0 > ms) { clearInterval(zm); ok(satir); }
      }, 400);
    });
  }
  function sunucuDurumu() {
    return api('/me/player').then(function (p) {
      if (!p) return 'Spotify sunucusu: oynatıcı yok';
      return 'Spotify sunucusu: ' + (p.is_playing ? 'ÇALIYOR' : 'çalmıyor') + ' · cihaz: ' + (p.device ? p.device.name + (p.device.is_active ? ' (aktif)' : '') : '?') + ' · şarkı: ' + (p.item ? p.item.name : '?') + (p.actions && p.actions.disallows ? ' · yasak: ' + Object.keys(p.actions.disallows).filter(function (k) { return p.actions.disallows[k]; }).join(',') : '');
    }, function (e) { return 'Spotify sunucusu: ' + hataMetni(e); });
  }
  // Tek atış test: tableti bul, TEK çalma komutu gönder, 12 sn boyunca tabletteki durumu kaydet (yol denemesi yok)
  function testCal() {
    Adimlar = []; var no = ++CalNo;
    var x = (Kutu && Kutu.sarkilar[0]) || { u: 'spotify:track:4LRPiXqCikLlN15c3yImP7', a: 'As It Was' };
    return tabletHazirla(no, x.u).then(function (c) {
      if (!c) throw new Error('tablet bulunamadı');
      adim('TEK çalma komutu → ' + c.name + ' (' + x.a + ')');
      var iz = izle(12000);
      return api('/me/player/play?device_id=' + encodeURIComponent(c.id), { method: 'PUT', body: { uris: [x.u] } })
        .then(function () { adim('Spotify: komut kabul edildi'); }, function (e) { adim('Spotify: ' + hataMetni(e)); }).then(function () { return iz; });
    }).then(function (satir) { return sunucuDurumu().then(function (s2) { return ['Tablette 12 sn boyunca olanlar:'].concat(satir.map(function (l) { return '  ' + l; }), [s2]).join('\n'); }); },
      function (e) { return 'Test yapılamadı: ' + (e.bilgi ? e.message : hataMetni(e)); });
  }
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
    sat('Kayıtlı tablet cihazı', D.cihaz ? 'var' : 'henüz yok');
    if (YEREL) sat('Erişilebilirlik (Çal\'a dokunma)', erisimVar() ? 'açık' : 'KAPALI → aç');
    sat('Carvis · Şimdi listesi', D.carvisListe ? 'var' : 'henüz oluşturulmadı');
    sat('Liste çalma yolu', !bagli() ? 'HESAP BAĞLI DEĞİL → liste çalınamaz, yalnız kontrol' : (YEREL && K.spotifyListeCal) ? 'liste aç + Çal\'a dokun (elle çalma gibi)' : 'Spotify Web API');
    sat('Yerel dinleme geçmişi', Dinlenen.length + ' şarkı');
    var sesA = false; try { sesA = localStorage.getItem('hx_ses') === '1'; } catch (e) {} sat('Arayüz sesleri', sesA ? 'açık (müzik çalarken susar)' : 'kapalı');
    sat('Spotify hesabı (isteğe bağlı)', !D.clientId ? 'kurulmadı' : !bagli() ? 'Client ID var, bağlı değil' : 'bağlı (' + (D.ben ? D.ben.ad : '?') + ', ' + (D.premium === true ? 'Premium' : D.premium === false ? 'Premium DEĞİL' : 'Premium bilinmiyor') + ')');
    if (sogumaKaldi()) sat('Spotify API soğuma', Math.ceil(sogumaKaldi() / 1000) + ' sn');
    sat('Kütüphane önbelleği', Kutu ? Kutu.sarkilar.length + ' şarkı' : 'yok');
    var api1 = bagli() && !sogumaKaldi() ? api('/me').then(function (m) { if (m.product) { D.premium = m.product === 'premium'; kaydet(); } sat('API /me', 'tamam' + (m.product ? ' · ürün: ' + m.product : ' · (Spotify hesap türünü artık göstermiyor)')); }, function (e) { sat('API /me', 'HATA ' + hataMetni(e)); })
      .then(function () { return api('/me/player/devices').then(function (j) { var l = (j && j.devices) || []; sat('Spotify\'ın gördüğü cihazlar', l.length ? l.map(function (x) { return x.name + ' [' + x.type + (x.is_active ? ', AKTİF' : '') + (x.is_restricted ? ', kısıtlı' : '') + (tabletMi(x) ? ', ← bu tablet' : '') + ']'; }).join('; ') : 'HİÇ YOK'); }, function (e) { sat('Cihaz listesi', 'HATA ' + hataMetni(e)); }); }) : Promise.resolve();
    var ai = (U.AI ? U.AI.hazir() : Promise.resolve(false)).then(function (ok) { sat('Yapay zekâ', ok ? 'hazır' : 'KAPALI (anahtar yok)'); }, function () { sat('Yapay zekâ', 'hata'); });
    return Promise.all([api1, ai]).then(function () {
      if (Adimlar.length) { r.push('Son çalma denemesi:'); Adimlar.forEach(function (a) { r.push('  ' + a); }); }
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
    var giris = el('input', { type: 'text', placeholder: sonKarisim ? 'Ruh hâlin ya da ince ayar: "biraz daha hareketli", "daha az Türkçe"…' : 'Bugün nasılsın? "yorgunum ama 2 saat daha çalışmam lazım"…', 'aria-label': 'Ruh hâli', enterkeyhint: 'go' });
    var oner = el('button', { class: 'dugme ana', type: 'button' }, ['Gönder']);
    var karisimKap = el('div', { class: 'sp-kutu', hidden: !sonKarisim });
    function calistir(ruh) {
      if (!String(ruh || '').trim()) { giris.focus(); return; }
      giris.value = ruh; oner.disabled = true; hemenDug.disabled = true; karisimKap.hidden = false;
      karisimKap.innerHTML = '<div class="yukleniyor">' + (bagli() && !Kutu ? 'Kütüphanen taranıyor: ilk seferde 60–80 sn sürer, sonra öneriler hızlı gelir…' : (muzikModu() !== 'kutuphane' || tohumMu(ruh) ? 'Keşfediliyor: yapay zekâ liste kuruyor, şarkılar Spotify\'da tek tek doğrulanıyor (1–3 dk sürebilir)…' : 'Ruh hâline göre seçiliyor…')) + '</div>';
      ruhKarisimCal(ruh, false, karisimKap).then(function () { oner.disabled = false; hemenDug.disabled = false; });
    }
    // ruh hâli yalnızca yazılan metin; tonlar (ton kutusundaki örnek şarkılar) öneri istemine ayrıca girer
    function ruhGirisi() { return giris.value.trim() || (Ornekler.length ? 'tonlara benzer' : ''); }
    oner.addEventListener('click', function () { konusmaGonder(giris.value); });
    giris.addEventListener('keydown', function (e) { if (e.key === 'Enter') konusmaGonder(giris.value); });
    // ---- Konuşma paneli: tek girdi yerinde sırayla sorular; her cevap kaydedilir; en sonda toplu düşünülüp liste kurulur ----
    var konusmaKap = el('div', { class: 'sp-konusma' });
    var hemenDug = el('button', { class: 'dugme', type: 'button', title: 'Soru sormadan, yazdığın metinle hemen liste kurar' }, ['⚡ Hemen öner']);
    hemenDug.addEventListener('click', function () { calistir(ruhGirisi()); });
    var sanatciSecim = null, konusmaMesgul = false; // sanatçı önerisi aşaması yalnız bellekte tutulur
    function konusmaCiz() {
      konusmaKap.innerHTML = '';
      var bitti = konusmaBitti(), s = KONUSMA_SORULAR[Konusma.adim];
      if (konusmaMesgul) konusmaKap.appendChild(el('div', { class: 'sp-balon' }, [el('b', { text: 'CARVIS' }), el('p', { text: 'Düşünüyorum…' })]));
      if (!bitti && !sanatciSecim && !konusmaMesgul) {
        konusmaKap.appendChild(el('div', { class: 'sp-balon' }, [el('b', { text: 'CARVIS · ' + (Konusma.adim + 1) + ' / ' + KONUSMA_SORULAR.length }), el('p', { text: s.soru })]));
        var ipucular = s.ipucu || RUH_CIPLER.map(function (c) { return c.replace(/^\S+\s/, ''); });
        konusmaKap.appendChild(el('div', { class: 'sp-cipler' }, ipucular.map(function (t) { return el('button', { class: 'cip', type: 'button', onclick: function () { konusmaGonder(t); } }, [t]); })));
        if (!s.zorunlu) konusmaKap.appendChild(el('div', { class: 'sp-satir' }, [el('button', { class: 'cip', type: 'button', onclick: function () { konusmaGonder(''); } }, ['Atla'])]));
      }
      if (sanatciSecim) {
        konusmaKap.appendChild(el('div', { class: 'sp-balon' }, [el('b', { text: 'CARVIS · ' + (Konusma.adim + 1) + ' / ' + KONUSMA_SORULAR.length }), el('p', { text: 'Bu tarza yakın sanatçılar. Sevdiklerine dokun, sonra devam et.' + (sanatciSecim.bulunan && sanatciSecim.bulunan.length ? ' Listeye ilk sıraya girecek şarkılar: ' + sanatciSecim.bulunan.map(function (x) { return x.ad + ' — ' + x.sanatci; }).join(', ') + '.' : '') + (sanatciSecim.yok && sanatciSecim.yok.length ? ' Spotify\'da bulunamadı: ' + sanatciSecim.yok.join(', ') + '.' : '') })]));
        konusmaKap.appendChild(el('div', { class: 'sp-cipler' }, sanatciSecim.oneriler.map(function (a) { return el('button', { class: 'cip' + (sanatciSecim.secili[a] ? ' sp-cip-secili' : ''), type: 'button', onclick: function () { sanatciSecim.secili[a] = !sanatciSecim.secili[a]; konusmaCiz(); } }, [a]); })));
        konusmaKap.appendChild(el('div', { class: 'sp-satir' }, [el('button', { class: 'dugme', type: 'button', onclick: function () { sanatciDevam(); } }, ['Seçilenlerle devam'])]));
      }
      var cevaplar = KONUSMA_SORULAR.slice(0, Konusma.adim).map(function (q) { return el('span', { text: '✓ ' + q.kisa + ': ' + (Konusma.cevaplar[q.id] || '—') }); });
      if (cevaplar.length) konusmaKap.appendChild(el('div', { class: 'sp-cevaplar' }, cevaplar));
      if (bitti) {
        konusmaKap.appendChild(el('div', { class: 'sp-balon' }, [el('b', { text: 'CARVIS' }), el('p', { text: 'Cevapların kaydedildi. Toplu düşünüp listeyi kurayım mı?' + (Konusma.anilan && Konusma.anilan.length ? ' Adı geçen şarkılar listeye giriyor: ' + Konusma.anilan.map(function (x) { return x.ad + ' — ' + x.sanatci; }).join(', ') + '.' : '') })]));
        if (!konusmaMesgul) konusmaKap.appendChild(el('div', { class: 'sp-satir' }, [el('button', { class: 'cip', type: 'button', onclick: function () { if (konusmaMesgul) { U.toast('Liste hazırlanıyor; bitince yeni oturum açabilirsin.'); return; } konusmaYeniOturum(); konusmaCiz(); } }, ['↻ Yeni oturum (soruları baştan sor)'])]));
      }
      oner.textContent = bitti ? 'Liste kur' : 'Gönder';
      giris.placeholder = bitti ? 'İstersen "Liste kur" de' : 'Cevabını yaz ya da yukarıdan seç…';
    }
    // Gönder: sanatçı aşamasında seçilenlerle devam; konuşma bittiyse liste kur; değilse cevabı kaydet ve sonraki soruya geç
    function konusmaGonder(metin) {
      if (konusmaMesgul) return;
      var m = String(metin === undefined || metin === null ? giris.value : metin).trim();
      giris.value = '';
      if (sanatciSecim) { sanatciDevam(); return; }
      if (konusmaBitti()) { konusmaKur(); return; }
      var s = KONUSMA_SORULAR[Konusma.adim];
      if (!m && s.zorunlu) { giris.focus(); return; }
      if (s.sanatci && m && !/^yok$/i.test(m)) { sanatciAsama(m); return; }
      konusmaCevapla(m); konusmaCiz();
    }
    function sanatciAsama(m) {
      konusmaMesgul = true; konusmaCiz();
      konusmaSanatciOner(m).then(null, function () {
        U.toast('Sanatçı önerisi alınamadı; adı geçen şarkılar yine de aranıyor.');
        return { anilan: konusmaBol(m), benzer: [] };
      }).then(function (r) {
        return konusmaDogrula(r.anilan).then(function (d) {
          Konusma.anilan = d.bulunan; konusmaKaydet();
          var secili = {}; d.sanatciler.forEach(function (s) { secili[s] = true; });
          var oneriler = d.sanatciler.concat(r.benzer).filter(function (x, i, a) { return a.indexOf(x) === i; }).slice(0, 14);
          if (oneriler.length) sanatciSecim = { metin: m, oneriler: oneriler, secili: secili, bulunan: d.bulunan, yok: d.yok };
          else konusmaCevapla(m);
        });
      }).then(function () { konusmaMesgul = false; konusmaCiz(); }, function () { konusmaMesgul = false; konusmaCiz(); });
    }
    function sanatciDevam() {
      if (!sanatciSecim) return;
      var sec = sanatciSecim.oneriler.filter(function (a) { return sanatciSecim.secili[a]; });
      var m = sanatciSecim.metin; sanatciSecim = null;
      Konusma.sanatci = sec;
      konusmaCevapla(m); konusmaCiz();
    }
    // Toplu düşünme: kayıtlı cevaplar + işaretler + kütüphane birlikte istem olur; keşif listesi kurulur
    // Tıklanan düğme devre dışı bırakılmaz (meşguliyet bayrağı kullanılır); tarayıcı girdiyi kesmesin
    function konusmaKur() {
      if (konusmaMesgul) return;
      KonusmaBaglam = konusmaBaglamKur(); konusmaMesgul = true; konusmaCiz();
      karisimKap.hidden = false;
      karisimKap.innerHTML = '<div class="yukleniyor">Toplu düşünüyorum: cevapların, işaretlerin ve kütüphanen birlikte değerlendiriliyor (1–3 dk sürebilir)…</div>';
      var bitir = function () { KonusmaBaglam = null; konusmaMesgul = false; konusmaCiz(); };
      ruhKarisimCal(konusmaOzet(), true, karisimKap).then(bitir, bitir);
    }
    var modSec = el('select', { 'aria-label': 'Öneri kaynağı', style: 'background:var(--zemin);border:1px solid var(--cizgi);border-radius:6px;color:var(--metin);padding:6px 8px' });
    [['karisik', '🔀 Karışık: yeni keşifler + kütüphanem'], ['kesif', '🔭 Keşif: çoğu yeni şarkı'], ['kutuphane', '📚 Yalnız kütüphanem (hızlı)']].forEach(function (x) { modSec.appendChild(el('option', { value: x[0], text: x[1], selected: muzikModu() === x[0] ? true : null })); });
    modSec.addEventListener('change', function () { yaz('spotify_mod', modSec.value); });
    // ruh hâli → "＋ Ekle": yapay zekâ ruh hâlini çözümler, uyan şarkıları etiketler, Spotify'da doğrulanan şarkıları
    // mevcut listenin SONUNA ekler (liste yoksa yeni karışım kurulur)
    var ekleDug = el('button', { class: 'dugme', type: 'button', title: 'Ruh hâline uyan şarkıları etiketleyip listenin sonuna ekler' }, ['＋ Ekle']);
    function ruhEkle(ruh) {
      var konusmaTamam = konusmaBitti(); if (konusmaTamam) KonusmaBaglam = konusmaBaglamKur();
      ruh = konusmaTamam ? konusmaOzet() : (String(ruh || '').trim() || (Ornekler.length ? 'tonlara benzer' : '')); if (!ruh) { giris.focus(); return; }
      ekleDug.disabled = true; var eskiYazi = ekleDug.textContent; ekleDug.textContent = 'Düşünüyor…';
      ruhEkleAkis(ruh).then(function (r) {
        sonKarisim = r.k; karisimSakla(r.k); karisimCiz(karisimKap, r.k); karisimKap.hidden = false;
        U.toast(r.eklenen + ' yeni şarkı listenin sonuna eklendi');
      }).catch(function (e) { U.toast('Eklenemedi: ' + String(e && e.message || e)); })
        .then(function () { ekleDug.disabled = false; ekleDug.textContent = eskiYazi; KonusmaBaglam = null; });
    }
    ekleDug.addEventListener('click', function () { ruhEkle(giris.value); });
    var ruhKutu = el('div', { class: 'sp-kutu sp-ruh' }, [el('h2', { text: 'RUH HÂLİ' }), konusmaKap, el('div', { class: 'sp-satir' }, [giris, oner, ekleDug]), el('div', { class: 'sp-satir', style: 'margin-top:8px' }, [modSec, hemenDug, el('span', { class: 'sp-durum', text: 'Şarkı adı yazarsan (ör. "Do I Clench My Fists - Ridgeclub") onun etrafında kurar.' })])]);
    konusmaCiz();
    // ruh hâli seçenekleri konuşmanın ilk sorusunda (konusmaKap)
    var zevk = el('input', { type: 'text', value: Zevk, placeholder: 'Sevdiğin sanatçılar / türler (ör. Duman, Arctic Monkeys, lo-fi, Ludovico Einaudi)', 'aria-label': 'Müzik zevkin' });
    zevk.addEventListener('change', function () { Zevk = zevk.value.trim(); yaz('spotify_zevk', Zevk); U.toast('Zevkin kaydedildi'); });
    ruhKutu.appendChild(el('div', { class: 'sp-satir', style: 'margin-top:10px' }, [zevk]));
    ruhKutu.appendChild(el('p', { class: 'sp-durum', text: bagli() ? 'Karışık/Keşif: yapay zekâ yeni şarkılar önerir, her biri Spotify\'da aranıp doğrulanır; uyanlar kütüphanenden de eklenir. Şarkı adları yazabilirsin: "youngblood x attention".' : 'Öneriler yazdığın zevkten ve Spotify\'da dinlediklerinden (Carvis açıkken öğrenir: ' + Dinlenen.length + ' şarkı) kurulur. İstersen aşağıdan Spotify hesabını da bağlayabilirsin.' }));
    // ---- ton ekle · edit listesi · banger ----
    var ornekGiris = el('input', { type: 'text', placeholder: 'Şarkı ya da edit: attention charlie puth · neymar / dybala', 'aria-label': 'Örnek şarkı' });
    var ornekDug = el('button', { class: 'dugme', type: 'button' }, ['+ Ton ekle']);
    var ornekCipler = el('div', { class: 'sp-cipler' });
    function ornekCiz() {
      ornekCipler.innerHTML = '';
      Ornekler.forEach(function (o, i) {
        ornekCipler.appendChild(el('button', { class: 'cip', type: 'button', title: 'Çıkarmak için dokun', onclick: function () { Ornekler.splice(i, 1); yaz('spotify_ornek', Ornekler); ornekCiz(); } }, [o.ad + ' — ' + o.sanatci + ' ✕']));
      });
    }
    // edit konusu mu (ör. "neymar / dybala", "edit: x")? Değilse şarkı olarak aranır; bulunamazsa yine edit konusu sayılır
    function editKonusuMu(q) { return /\//.test(q) || /(^|\s)ve(\s|$)/i.test(q) || /^edit[:\s]/i.test(q) || /\bedit\b/i.test(q); }
    function ornekEkle() {
      var q = ornekGiris.value.trim(); if (!q) { ornekGiris.focus(); return; }
      if (editKonusuMu(q)) { ornekGiris.value = ''; editListesi(q.replace(/^edit[:\s]+/i, '')); return; }
      ornekDug.disabled = true; ornekDug.textContent = 'Aranıyor…';
      tohumBul(q).then(function (l) {
        var t = l && l[0];
        if (!t) { ornekGiris.value = ''; editListesi(q); return; }
        if (!Ornekler.some(function (o) { return o.id === t.t.id; })) Ornekler.push({ q: q, id: t.t.id, u: t.t.uri, ad: t.ad, sanatci: t.sanatci });
        yaz('spotify_ornek', Ornekler); ornekGiris.value = ''; ornekCiz(); U.toast('Ton eklendi: ' + t.ad);
      }).catch(function (e) { U.toast(String(e && e.message || e)); }).then(function () { ornekDug.disabled = false; ornekDug.textContent = '+ Ton ekle'; });
    }
    ornekDug.addEventListener('click', ornekEkle);
    ornekGiris.addEventListener('keydown', function (e) { if (e.key === 'Enter') ornekEkle(); });
    ornekCiz();
    ruhKutu.appendChild(el('div', { class: 'sp-satir', style: 'margin-top:10px' }, [ornekGiris, ornekDug]));
    ruhKutu.appendChild(ornekCipler);
    // Edit listesi: web'de (Gemini + Google araması) ilgili edit'lerde çok kullanılan şarkılar; 60–80 sn sürebilir
    var bangerCb = el('input', { type: 'checkbox', 'aria-label': 'Banger modu' });
    bangerCb.checked = Banger;
    var bangerEtiket = el('label', { class: 'sp-banger', style: 'display:inline-flex;align-items:center;gap:8px;cursor:pointer' }, [bangerCb, el('span', { text: '🏆 Banger modu: yalnız kendini kanıtlamış hitler' })]);
    bangerCb.addEventListener('change', function () { Banger = bangerCb.checked; yaz('spotify_banger', Banger); U.toast(Banger ? 'Banger modu açık: öneriler hit şarkılardan' : 'Banger modu kapalı'); });
    var sozsuzCb = el('input', { type: 'checkbox', 'aria-label': 'Sözsüz tercih' });
    sozsuzCb.checked = Sozsuz;
    var sozsuzEtiket = el('label', { class: 'sp-sozsuz', style: 'display:inline-flex;align-items:center;gap:8px;cursor:pointer' }, [sozsuzCb, el('span', { text: '🎧 Sözsüz: ders ve okuma için' })]);
    sozsuzCb.addEventListener('change', function () { Sozsuz = sozsuzCb.checked; yaz('spotify_sozsuz', Sozsuz); U.toast(Sozsuz ? 'Sözsüz açık: öneriler sözsüz ya da sözü az parçalardan' : 'Sözsüz kapalı'); });
    function editListesi(konu) {
      konu = String(konu || '').trim(); if (!konu) return;
      karisimKap.hidden = false;
      var bekleme = el('div', { class: 'yukleniyor', text: '"' + konu + '" için düşünülüyor… Üç ayrı aday liste kuruluyor (60–80 sn sürebilir).' });
      karisimKap.innerHTML = ''; karisimKap.appendChild(bekleme);
      var zamanlar = [];
      function durum(m, s) { zamanlar.push(setTimeout(function () { bekleme.textContent = m; }, s)); }
      durum('Edit kültürü araştırılıyor: aday listeler yazılıyor…', 0);
      durum('Adaylar karşılaştırılıyor: hangisi gerçekten edit\'lerde çalıyor, hangisi akışa uyuyor…', 22000);
      durum('En iyi 25 seçildi. Spotify\'da tek tek doğrulanıyor…', 48000);
      function ask(q) {
        return (window.yerelGemini && window.yerelGemini.ara) ? window.yerelGemini.ara(q, {}).then(function (r) { return r.metin || ''; }) : U.Y.sample(q, { cache: false }).then(function (c) { return c.text || ''; });
      }
      function listeAl(metin) { return (jsonAyikla(metin).sarkilar || []).map(String).filter(Boolean).slice(0, 25); }
      var bagimsiz = "Tıp öğrencisi için müzik listesi. Konu: \"" + konu + "\". ";
      var kurallar = " Yalnız gerçekten var olan şarkılar yaz; emin değilsen yazma. Yalnız JSON: {\"sarkilar\":[\"Sanatçı - Şarkı\", ...]} (20 şarkı)";
      var acilar = [
        bagimsiz + "Bu konuyla ilgili (TikTok, Instagram, YouTube edit/montajlarında) en çok kullanılan, enerjik ve tanınan şarkıları web'de ara." + kurallar,
        bagimsiz + "Edit kültüründe bilinen ama her yerde çalınmayan, keşfedilmemiş ya da az tanınan şarkıları web'de ara; tempo ve ruh hâli çeşitli olsun." + kurallar,
        bagimsiz + "Bu konunun izleyicilerinin yıllardır dinlediği, kendini kanıtlamış klasik ve hit şarkıları web'de ara." + kurallar
      ];
      var zaman = function (ms) { return new Promise(function (_, red) { setTimeout(function () { red(new Error('zaman aşımı')); }, ms); }); };
      Promise.race([Promise.all(acilar.map(function (q) { return ask(q).then(listeAl).catch(function () { return []; }); })), zaman(100000)]).then(function (adaylar) {
        var A = adaylar[0] || [], B = adaylar[1] || [], C = adaylar[2] || [];
        if (A.length + B.length + C.length < 10) throw new Error('aday listeler çıkarılamadı');
        var istem = (Banger ? "BANGER MODU: yalnız kendini kanıtlamış, herkesin bildiği hit şarkıları seç. " : "") + "Üç aday müzik listesi var (A: edit'te en çok kullanılanlar, B: keşif, C: klasik hit). Konu: \"" + konu + "\".\n" +
          "Hepsini karşılaştır ve en iyi 25 şarkıyı seç. Ölçütler: (1) gerçekten var olan şarkı (uydurma olmasın), (2) bu konunun edit/video dünyasında gerçekten çalma olasılığı, (3) listenin akışı ve enerji dengesi, (4) çeşitlilik: aynı sanatçıdan en çok 2 şarkı. " +
          "Hangi listeden seçtiğini ve neden daha iyi olduğunu belirt.\n" +
          "A: " + A.join(' | ') + "\nB: " + B.join(' | ') + "\nC: " + C.join(' | ') + "\n" +
          "YALNIZ JSON: {\"gerekce\":\"A/B/C karşılaştırması 2-3 cümle\",\"secim\":[{\"sarki\":\"Sanatçı - Şarkı\",\"kaynak\":\"A|B|C\",\"neden\":\"kısa\"}]}";
        var adaylarHepsi = A.concat(B, C);
        return Promise.race([U.Y.sample(istem, { cache: false }), zaman(60000)]).then(function (c) {
          var j = jsonAyikla(c.text || '');
          var secim = (j.secim || []).map(function (x) { return String(x.sarki || ''); }).filter(Boolean);
          var havuz = secim.concat(adaylarHepsi), gorulen = {}, sira = [];
          havuz.forEach(function (ad) { var k = ad.toLowerCase(); if (!gorulen[k]) { gorulen[k] = 1; sira.push(ad); } });
          return { liste: sira.slice(0, 40), gerekce: String(j.gerekce || '') };
        }, function () { return { liste: adaylarHepsi.slice(0, 40), gerekce: 'karşılaştırma yapılamadı, adaylar sırayla alındı' }; });
      }).then(function (sonuc) {
        bekleme.textContent = 'Spotify\'da doğrulanıyor (' + sonuc.liste.length + ' aday)…';
        var bulunan = [];
        return sonuc.liste.reduce(function (z, ad) {
          return z.then(function () {
            if (bulunan.length >= 25) return;
            return api('/search?type=track&limit=1&q=' + encodeURIComponent(ad)).then(function (sn) { var t = iz(sn && sn.tracks && sn.tracks.items && sn.tracks.items[0]); if (t) bulunan.push(t); }).catch(function () {});
          });
        }, Promise.resolve()).then(function () { return { bulunan: bulunan, gerekce: sonuc.gerekce }; });
      }).then(function (r) {
        var sarkilar = r.bulunan.filter(function (t, i, d) { return d.findIndex(function (x) { return x.id === t.id; }) === i; });
        if (sarkilar.length < 5) throw new Error('Spotify\'da yeterli şarkı bulunamadı (' + sarkilar.length + ')');
        var k = sonKarisim || { id: Date.now().toString(36), ruh: konu, baslik: konu, yorum: '', sarkilar: [], yeniAra: [], t: Date.now(), ince: false };
        var g = {}; k.sarkilar.forEach(function (x) { g[x.id] = 1; });
        var eklenen = 0;
        sarkilar.forEach(function (t) { if (g[t.id]) return; g[t.id] = 1; t.neden = 'edit · ' + konu; t.yeni = true; k.sarkilar.push(t); eklenen++; });
        k.yorum = (k.yorum ? k.yorum + ' ' : '') + '"' + konu + '" editlerinden ' + eklenen + ' şarkı sona eklendi' + (r.gerekce ? ' (' + r.gerekce + ')' : '') + '.';
        sonKarisim = k; karisimSakla(k); karisimCiz(karisimKap, k);
        U.toast(eklenen + ' edit şarkısı eklendi');
      }).catch(function (e) { karisimKap.innerHTML = ''; karisimKap.appendChild(el('p', { class: 'hata-metni', text: 'Edit şarkıları eklenemedi: ' + String(e && e.message || e) })); })
        .then(function () { zamanlar.forEach(clearTimeout); });
    }
    ruhKutu.appendChild(el('div', { class: 'sp-satir', style: 'margin-top:8px' }, [bangerEtiket, sozsuzEtiket]));
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
    var hesap = el('div', { class: 'sp-kutu', id: 'spHesap' }, [el('h2', { text: bagli() ? 'SPOTIFY HESABI' : 'SPOTIFY HESABI · LİSTEYİ ÇALMAK İÇİN GEREKLİ' })]);
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
      hesap.appendChild(el('p', { text: 'Önerilen listeyi Spotify\'da sırayla çalmak için gerekli (Premium hesaplarda; tek seferlik kurulum). Bağlayınca öneriler beğenilerinden ve listelerinden de seçilir, karışımları liste olarak kaydedebilirsin. Duraklat/ileri/geri ve "şu an çalan" bağlantısız da çalışır.' }));
      var ic = el('div'); hesap.appendChild(ic);
      if (!D.clientId) kurulumCiz(ic); else baglantiCiz(ic);
    }
    if (!bagli()) sayfa.insertBefore(hesap, ruhKutu); else sayfa.appendChild(hesap);
    // tanılama
    var rapor = el('pre', { class: 'sp-rapor', hidden: true });
    var kopya = el('button', { class: 'dugme', type: 'button', hidden: true, onclick: function () { try { navigator.clipboard.writeText(rapor.textContent); U.toast('Kopyalandı — Claude\'a yapıştır'); } catch (e) {} } }, ['Kopyala']);
    sayfa.appendChild(el('div', { class: 'sp-kutu' }, [el('h2', { text: 'TANILAMA' }),
      el('p', { class: 'sp-durum', text: 'Bir şey çalışmazsa buna bas, çıkan raporu kopyalayıp gönder.' }),
      el('div', { class: 'sp-satir' }, [el('button', { class: 'dugme', type: 'button', onclick: function () { rapor.hidden = false; rapor.textContent = 'Kontrol ediliyor…'; tanila().then(function (t) { rapor.textContent = t; kopya.hidden = false; }); } }, ['🩺 Tanılama çalıştır']),
        bagli() ? el('button', { class: 'dugme', type: 'button', title: 'Tablete tek bir çalma komutu gönderir, 12 sn boyunca ne olduğunu kaydeder', onclick: function () {
          rapor.hidden = false; rapor.textContent = 'Test: tablete tek komut gönderiliyor, 12 sn izleniyor…';
          var deneme = K && K.spotifyListeCal ? (function () { var l = ((Kutu && Kutu.sarkilar) || []).slice(0, 5); return dokunarakCal({ id: 'test', ruh: 'test', baslik: 'Test', sarkilar: l }, 0).then(function () { return 'TEST (dokunarak çalma): başarılı ✓'; }, function (e) { return 'TEST (dokunarak çalma): ' + (e.bilgi || e.erisim ? e.message : hataMetni(e)); }).then(function (m) { return izle(8000).then(function (s2) { return m + '\nSonraki 8 sn:\n' + s2.map(function (x) { return '  ' + x; }).join('\n'); }); }); })() : testCal();
          deneme.then(function (m) { return tanila().then(function (t) { rapor.textContent = m + '\n\n' + t; kopya.hidden = false; }); });
        } }, ['▶ Test çalma']) : el('span'),
        YEREL ? el('button', { class: 'dugme', type: 'button', title: 'Bas, Spotify\'a geç ve elle bir şarkı çal; 30 sn sonra Carvis\'e dön', onclick: function () {
          rapor.hidden = false; rapor.textContent = 'İzleniyor (30 sn): şimdi Spotify\'a geç, elle bir şarkı başlat, 30 sn sonra buraya dön…';
          izle(30000).then(function (satir) { return sunucuDurumu().then(function (s2) { return tanila().then(function (t) { rapor.textContent = ['30 sn izleme:'].concat(satir.map(function (l) { return '  ' + l; }), [s2, '', t]).join('\n'); kopya.hidden = false; }); }); });
        } }, ['📈 İzle (30 sn)']) : el('span'),
        kopya]), rapor]));
  };
  function baglantiCiz(kap) {
    var hk = el('div');
    kap.appendChild(el('p', { text: 'Giriş sayfası uygulamanın içinde açılır (Google/Facebook ile giriş WebView\'da çalışmaz; e-posta ya da e-postana gelen kodla giriş yap).' }));
    kap.appendChild(el('div', { class: 'sp-satir' }, [el('button', { class: 'dugme ana', type: 'button', onclick: function () { baglan().catch(function (e) { hataGoster(hk, e); }); } }, ['🔗 Spotify\'a bağlan']),
      el('button', { class: 'dugme', type: 'button', onclick: function () { D.clientId = null; kaydet(); U.git('muzik'); } }, ['Client ID\'yi değiştir'])]));
    kap.appendChild(hk);
    if (donus) donus.then(function () { U.git('muzik'); }, function (e) { hk.innerHTML = ''; hk.appendChild(el('p', { class: 'sp-hata', text: hataMetni(e) })); });
  }
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
        el('li', {}, [el('b', { text: 'User Management' }), ' bölümüne kendi adını ve Spotify e-postanı ekle (eklemezsen her istek 403 verir). Spotify, uygulama sahibinin Premium olmasını şart koşuyor.'])]),
      el('div', { class: 'sp-satir' }, [cid, el('button', { class: 'dugme ana', type: 'button', onclick: function () {
        var v = cid.value.trim(); if (!/^[0-9a-f]{32}$/i.test(v)) { hataGoster(hk, new Error('Client ID 32 karakterlik bir kod olmalı.')); return; }
        D.clientId = v; kaydet(); U.git('muzik'); } }, ['Kaydet'])]), hk]));
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
