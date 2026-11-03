/* 1001 — Carvis ana ekran (launcher) arayüzü (kullanıcı, 2026-11-03: "Carvis'i direkt tabletimin UI'si yapalım").
   Android tarafı: manifestte HOME kategorisi + Uygulamalar.java (Kopru.uygulamaListesi / uygulamaBaslat / anaEkranAyari / anaEkranMi).
   - #uygulamalar: yüklü uygulamalar holografik ızgarada, arama; uzun bas → favorilere sabitle/çıkar.
   - Ana panoda UYGULAMALAR paneli (favoriler) ve "Carvis'i ana ekran yap" düğmesi (Android'in varsayılan ana ekran ayarını açar).
   - Ana ekran tuşu → Carvis ana sayfası (window.carvisEv). */
(function () {
  'use strict';
  if (/[?&]gomulu\b/.test(location.search)) return;
  var U = window.Uygulama; if (!U) return;
  var el = U.el, Depo = U.Depo, K = window.AndroidKopru || null;
  var VAR = !!(K && K.uygulamaListesi);
  var liste = null, bekleyen = [];
  window.carvisUyg = {
    liste: function (json) { try { liste = JSON.parse(json).sort(function (a, b) { return a.ad.localeCompare(b.ad, 'tr'); }); } catch (e) { liste = []; } var l = bekleyen; bekleyen = []; l.forEach(function (f) { f.ok(liste); }); },
    hata: function (m) { var l = bekleyen; bekleyen = []; l.forEach(function (f) { f.hata(new Error(m)); }); }
  };
  U.uygulamalar = function (zorla) {
    if (!VAR) return Promise.reject(new Error('Bu özellik yalnız Android uygulamasında (r66+) çalışır.'));
    if (liste && !zorla) return Promise.resolve(liste);
    return new Promise(function (ok, hata) { bekleyen.push({ ok: ok, hata: hata }); try { K.uygulamaListesi(!!zorla); } catch (e) { hata(e); } });
  };
  function ac(u) { sayac(u.paket); try { var r = K.uygulamaBaslat(u.paket, u.sinif || ''); if (r !== 'ok') U.toast('Açılamadı: ' + r); } catch (e) { U.toast('Açılamadı'); } }
  /* kullanıcı, 2026-11-03: "oto gruplandırsın"; "en sık kullandığım uygulamalar: Chrome, Samsung Browser, Spotify, Instagram, WhatsApp,
     Claude, Dosyalar" → bunlar varsayılan favori (ana sayfadaki raf), uygulamalar kategoriye kendiliğinden ayrılır. */
  var VARSAYILAN_FAVORI = ['com.android.chrome', 'com.sec.android.app.sbrowser', 'com.spotify.music', 'com.instagram.android', 'com.whatsapp', 'com.anthropic.claude', 'com.sec.android.app.myfiles', 'com.google.android.apps.nbu.files'];
  var KATEGORI = [
    ['Tarayıcı', /chrome|sbrowser|firefox|opera|edge|brave|duckduckgo|browser/i, /tarayıcı|internet|chrome|browser/i],
    ['Sosyal ve mesaj', /instagram|whatsapp|telegram|twitter|com\.x\.|tiktok|musically|snapchat|facebook|discord|messenger|messaging|mms|reddit|linkedin|threads|bereal/i, /mesaj|instagram|whatsapp|telegram|tiktok|discord/i],
    ['Ders ve yapay zekâ', /anthropic|openai|chatgpt|gemini|bard|notion|docs|drive|office|word|excel|powerpoint|notes|keep|anki|pdf|acrobat|xodo|classroom|duolingo|zoom|teams|meet|quizlet|goodnotes|noteshelf|calendar|takvim|perplexity|copilot|kindle/i, /claude|gemini|chatgpt|not|takvim|pdf|ders|okul|zoom|teams/i],
    ['Müzik ve medya', /spotify|youtube|music|netflix|prime|disney|gallery|video|podcast|soundcloud|deezer|twitch|photos|camera/i, /müzik|youtube|galeri|video|kamera|spotify/i],
    ['Araçlar', /myfiles|nbu\.files|documentsui|settings|clock|calculator|vending|galaxyapps|contacts|dialer|maps|weather|translate|lens|scanner|keyboard|smartthings|samsung|google/i, /dosya|ayar|saat|hesap|harita|rehber|telefon|store|mağaza/i]
  ];
  function kategori(u) { for (var i = 0; i < KATEGORI.length; i++) if (KATEGORI[i][1].test(u.paket) || KATEGORI[i][2].test(u.ad)) return KATEGORI[i][0]; return 'Diğer'; }
  function favoriler() {
    return Depo.oku('anaEkran').then(function (v) {
      if (v && v.favori) return v.favori;
      return (liste ? Promise.resolve(liste) : U.uygulamalar(false).catch(function () { return []; })).then(function (l) {
        var f = VARSAYILAN_FAVORI.filter(function (p) { return l.some(function (u) { return u.paket === p; }); });
        U.depoGuncelle('anaEkran', function (d) { if (!d.favori) d.favori = f; }, 100); return f;
      });
    });
  }
  function stil() { return Depo.oku('anaEkran').then(function (v) { return (v && v.stil) || 'hologram'; }); }
  function sayac(paket) { U.depoGuncelle('anaEkran', function (v) { v.acilis = v.acilis || {}; v.acilis[paket] = (v.acilis[paket] || 0) + 1; }, 300); }
  function favoriDegis(paket) { return U.depoGuncelle('anaEkran', function (v) { v.favori = v.favori || []; var i = v.favori.indexOf(paket); if (i >= 0) v.favori.splice(i, 1); else v.favori.push(paket); }, 100); }
  window.carvisEv = function () {
    try { var b = document.querySelector('.kd-tekerlek'); if (b) document.querySelector('.kd-perde').click(); } catch (e) {}
    if (location.hash !== '#kutuphane') location.hash = '#kutuphane';
  };

  var css = document.createElement('style');
  css.textContent = [
    '.ae-ust{display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-bottom:14px}.ae-ust input{flex:1;min-width:200px;padding:10px 16px;font-size:15px}',
    '.ae-izgara{display:grid;grid-template-columns:repeat(auto-fill,minmax(96px,1fr));gap:18px 10px}',
    '.ae-uyg{display:flex;flex-direction:column;align-items:center;gap:8px;padding:10px 4px;border:0;background:transparent;color:#e2fbf6;cursor:pointer;border-radius:18px;-webkit-touch-callout:none;user-select:none}',
    '.ae-uyg:active{transform:scale(.94)}',
    '.ae-ikon{width:62px;height:62px;border-radius:50%;display:grid;place-items:center;background:radial-gradient(circle,rgba(94,240,220,.16),rgba(2,12,16,.6) 70%);box-shadow:0 0 0 1px rgba(110,255,235,.35),0 0 18px rgba(94,240,220,.18);position:relative}',
    '.ae-ikon img{width:44px;height:44px;border-radius:12px;filter:saturate(.75) contrast(1.05)}',
    '.ae-uyg.fav .ae-ikon{box-shadow:0 0 0 1.5px #ffd38a,0 0 20px rgba(255,211,138,.35)}',
    '.ae-uyg span{font-size:12.5px;line-height:1.2;text-align:center;max-width:100%;overflow:hidden;text-overflow:ellipsis;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical}',
    '.ae-baslik{margin:18px 0 8px;font:700 11px var(--f-kod,monospace);letter-spacing:.2em;color:#7fe8da}',
    '.jv-panel.ae-pano .ae-mini{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-top:6px}',
    '.jv-panel.ae-pano .ae-mini button{display:flex;flex-direction:column;align-items:center;gap:3px;border:0;background:transparent;color:#cfeee9;font:600 10px var(--f-kod,monospace);cursor:pointer;padding:2px}',
    '.jv-panel.ae-pano .ae-mini img{width:34px;height:34px;border-radius:10px;box-shadow:0 0 10px rgba(94,240,220,.25)}',
    '.ae-kur{display:flex;align-items:center;gap:12px;padding:12px 14px;border-radius:18px;margin-bottom:12px;background:linear-gradient(135deg,rgba(94,240,220,.12),rgba(255,211,138,.06));box-shadow:0 0 0 1px rgba(110,255,235,.4)}',
    '.ae-kur p{margin:0;flex:1;font-size:13.5px;color:#d6f7f1}',
    /* hologram ikon stili: renkli ikonlar tek renk turkuaz ışık */
    'body.ae-hologram .ae-ikon img,body.ae-hologram .ae-raf img{filter:grayscale(1) brightness(1.35) sepia(1) hue-rotate(125deg) saturate(2.4) drop-shadow(0 0 6px rgba(94,240,220,.7))!important;opacity:.95}',
    '.ae-raf{position:fixed;bottom:calc(14px + env(safe-area-inset-bottom,0px));z-index:61;display:flex;gap:6px;align-items:flex-end;padding:6px 10px 4px;border-radius:22px 22px 999px 999px;' +
      'background:radial-gradient(120% 90% at 50% 100%,rgba(94,240,220,.16),transparent 70%);animation:aeRaf .5s cubic-bezier(.2,.9,.2,1.1)}',
    '.ae-raf::after{content:"";position:absolute;left:8%;right:8%;bottom:0;height:2px;border-radius:2px;background:linear-gradient(90deg,transparent,rgba(140,255,240,.8),transparent);box-shadow:0 0 12px rgba(94,240,220,.8)}',
    '.ae-raf.sol{right:calc(50% + 150px)}.ae-raf.sag{left:calc(50% + 150px)}',
    '@keyframes aeRaf{from{opacity:0;transform:translateY(16px)}}',
    '.ae-raf-uyg{width:64px;display:flex;flex-direction:column;align-items:center;gap:4px;border:0;background:transparent;color:#cfeee9;cursor:pointer;padding:4px 0;border-radius:14px;transition:transform .2s}',
    '.ae-raf-uyg:active{transform:translateY(-4px) scale(.96)}',
    '.ae-raf-uyg img,.ae-raf-uyg b,.ae-raf-uyg i{width:42px;height:42px;border-radius:12px;display:grid;place-items:center;font-style:normal;font-size:22px;box-shadow:0 0 0 1px rgba(110,255,235,.3),0 6px 16px rgba(0,0,0,.4)}',
    '.ae-raf-uyg span{font:600 10.5px var(--f-govde,system-ui);max-width:62px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
    'body.rl-acik .ae-raf{display:none}',
    '@media (max-width:900px){.ae-raf.sol{right:calc(50% + 120px)}.ae-raf.sag{left:calc(50% + 120px)}.ae-raf-uyg{width:52px}.ae-raf-uyg span{display:none}}'
  ].join('\n');
  document.head.appendChild(css);

  function anaEkranMi() { try { return !!(K && K.anaEkranMi && K.anaEkranMi()); } catch (e) { return false; } }
  function kurKutusu() {
    if (!VAR || anaEkranMi()) return null;
    return el('div', { class: 'ae-kur' }, [el('p', { text: 'Carvis\'i tabletin ana ekranı yap: ana ekran tuşuna basınca Carvis açılır, uygulamalar buradan başlar. Açılan ayarda "C.A.R.V.I.S."i seç.' }),
      el('button', { class: 'dugme kucuk ana', type: 'button', text: 'Ana ekran yap', onclick: function () { K.anaEkranAyari(); } })]);
  }
  U.GORUNUMLER.uygulamalar = function () {
    var ana = U.$('#ana'); ana.innerHTML = '';
    var sayfa = el('div', { class: 'sayfa' }); ana.appendChild(sayfa);
    sayfa.appendChild(el('div', { class: 'kahraman' }, [el('div', { class: 'ust-etiket', text: 'Tablet' }), el('h1', { text: 'Uygulamalar' }), el('p', { class: 'var-etiket', text: 'Dokun: aç · uzun bas: favorilere sabitle (ana panoda görünür).' })]));
    var kur = kurKutusu(); if (kur) sayfa.appendChild(kur);
    if (!VAR) { sayfa.appendChild(el('p', { class: 'var-etiket', text: 'Bu ekran Android uygulamasının r66 ve sonraki tam sürümünde çalışır.' })); return; }
    var ara = el('input', { type: 'search', placeholder: 'Uygulama ara…', 'aria-label': 'Uygulama ara' }), yen = el('button', { class: 'dugme kucuk', type: 'button', text: '↻' });
    var stilSec = el('select', { 'aria-label': 'İkon stili' }, [el('option', { value: 'hologram', text: 'İkonlar: hologram' }), el('option', { value: 'orijinal', text: 'İkonlar: orijinal renk' })]);
    stil().then(function (s2) { stilSec.value = s2; document.body.classList.toggle('ae-hologram', s2 === 'hologram'); });
    stilSec.addEventListener('change', function () { U.depoGuncelle('anaEkran', function (d) { d.stil = stilSec.value; }, 100); document.body.classList.toggle('ae-hologram', stilSec.value === 'hologram'); });
    sayfa.appendChild(el('div', { class: 'ae-ust' }, [ara, stilSec, yen]));
    var kap = el('div', {}, [el('div', { class: 'yukleniyor', text: 'Uygulamalar okunuyor…' })]); sayfa.appendChild(kap);
    var L = [], F = [];
    function ciz() {
      kap.innerHTML = ''; var q = ara.value.trim().toLocaleLowerCase('tr');
      var l = L.filter(function (u) { return !q || u.ad.toLocaleLowerCase('tr').indexOf(q) >= 0; });
      function izgara(baslik, dizi) {
        if (!dizi.length) return; kap.appendChild(el('div', { class: 'ae-baslik', text: baslik }));
        var g = el('div', { class: 'ae-izgara' });
        dizi.forEach(function (u) {
          var b = el('button', { type: 'button', class: 'ae-uyg' + (F.indexOf(u.paket) >= 0 ? ' fav' : ''), 'aria-label': u.ad }, [el('div', { class: 'ae-ikon' }, [u.ikon ? el('img', { src: u.ikon, alt: '' }) : el('b', { text: u.ad.charAt(0) })]), el('span', { text: u.ad })]);
          var zm = null, uzun = false;
          b.addEventListener('pointerdown', function () { uzun = false; zm = setTimeout(function () { uzun = true; try { navigator.vibrate && navigator.vibrate(25); } catch (e) {} favoriDegis(u.paket).then(function () { return favoriler(); }).then(function (f) { F = f; ciz(); U.toast(F.indexOf(u.paket) >= 0 ? 'Favorilere eklendi: ' + u.ad : 'Favorilerden çıkarıldı'); }); }, 550); });
          ['pointerup', 'pointercancel', 'pointerleave'].forEach(function (ev) { b.addEventListener(ev, function () { clearTimeout(zm); }); });
          b.addEventListener('click', function () { if (!uzun) ac(u); });
          b.addEventListener('contextmenu', function (e) { e.preventDefault(); });
          g.appendChild(b);
        });
        kap.appendChild(g);
      }
      if (q) { izgara('SONUÇLAR', l); return; }
      izgara('FAVORİLER', F.map(function (p) { return l.filter(function (u) { return u.paket === p; })[0]; }).filter(Boolean));
      var grup = {}; l.forEach(function (u) { var k = kategori(u); (grup[k] = grup[k] || []).push(u); });
      KATEGORI.map(function (k) { return k[0]; }).concat(['Diğer']).forEach(function (k) { if (grup[k]) izgara(k.toLocaleUpperCase('tr') + ' · ' + grup[k].length, grup[k]); });
    }
    function yukle(z) { Promise.all([U.uygulamalar(z), favoriler()]).then(function (r) { L = r[0]; F = r[1]; ciz(); }, function (e) { kap.innerHTML = ''; kap.appendChild(el('p', { class: 'hata-metni', text: e.message })); }); }
    ara.addEventListener('input', ciz); yen.addEventListener('click', function () { yukle(true); });
    yukle(false);
  };
  U.SEKMELER.push({ id: 'uygulamalar', ad: 'Uygulamalar', ikon: '▦' });
  if (U.sekmeleriCiz) try { U.sekmeleriCiz(); } catch (e) {}

  /* ana sayfa: alttaki komut kapsülünün iki yanında ışık rafı (favoriler; yalnız ana sayfada) */
  function raf() {
    if (!VAR) return; var ev = document.body.classList.contains('ev-sade') || /^#?(kutuphane)?$/.test(location.hash.replace(/^#/, ''));
    var eski = document.querySelectorAll('.ae-raf'); if (!ev) { Array.prototype.forEach.call(eski, function (x) { x.remove(); }); return; }
    Promise.all([U.uygulamalar(false), favoriler(), stil()]).then(function (r) {
      var L = r[0], F = r[1]; document.body.classList.toggle('ae-hologram', r[2] === 'hologram');
      var l = F.map(function (p) { return L.filter(function (u) { return u.paket === p; })[0]; }).filter(Boolean).slice(0, 8);
      Array.prototype.forEach.call(document.querySelectorAll('.ae-raf'), function (x) { x.remove(); });
      var yari = Math.ceil(l.length / 2), sol = el('div', { class: 'ae-raf sol' }), sag = el('div', { class: 'ae-raf sag' });
      function d(u) { return el('button', { type: 'button', class: 'ae-raf-uyg', title: u.ad, 'aria-label': u.ad, onclick: function () { ac(u); } }, [u.ikon ? el('img', { src: u.ikon, alt: '' }) : el('b', { text: u.ad.charAt(0) }), el('span', { text: u.ad })]); }
      l.slice(0, yari).forEach(function (u) { sol.appendChild(d(u)); }); l.slice(yari).forEach(function (u) { sag.appendChild(d(u)); });
      sag.appendChild(el('button', { type: 'button', class: 'ae-raf-uyg tum', title: 'Tüm uygulamalar', onclick: function () { location.hash = '#uygulamalar'; } }, [el('i', { text: '▦' }), el('span', { text: 'Tümü' })]));
      document.body.appendChild(sol); document.body.appendChild(sag);
    }).catch(function () {});
  }
  window.addEventListener('hashchange', function () { setTimeout(raf, 120); });
  var eskiKut = U.GORUNUMLER.kutuphane;
  U.GORUNUMLER.kutuphane = function () { eskiKut.apply(this, arguments); setTimeout(raf, 500); };
  setTimeout(raf, 1600);
})();
