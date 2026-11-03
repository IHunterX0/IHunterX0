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
  function stil() { return Depo.oku('anaEkran').then(function (v) { return (v && v.stil) || 'cizim'; }); }
  function ikonEl(u, st) { return U.holoIkon ? U.holoIkon(u, st) : (u.ikon ? el('img', { src: u.ikon, alt: '' }) : el('b', { text: u.ad.charAt(0) })); }
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
    '.ae-uyg .hki{--hki-boy:78px}.ae-uyg.fav .hki{--hki-r:#ffe2a8;--hki-r2:#ffab5e}',
    '.ae-uyg span{font-size:12.5px;line-height:1.2;text-align:center;max-width:100%;overflow:hidden;text-overflow:ellipsis;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical}',
    '.ae-baslik{margin:18px 0 8px;font:700 11px var(--f-kod,monospace);letter-spacing:.2em;color:#7fe8da}',
    '.jv-panel.ae-pano .ae-mini{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-top:6px}',
    '.jv-panel.ae-pano .ae-mini button{display:flex;flex-direction:column;align-items:center;gap:3px;border:0;background:transparent;color:#cfeee9;font:600 10px var(--f-kod,monospace);cursor:pointer;padding:2px}',
    '.jv-panel.ae-pano .ae-mini img{width:34px;height:34px;border-radius:10px;box-shadow:0 0 10px rgba(94,240,220,.25)}',
    '.ae-kur{display:flex;align-items:center;gap:12px;padding:12px 14px;border-radius:18px;margin-bottom:12px;background:linear-gradient(135deg,rgba(94,240,220,.12),rgba(255,211,138,.06));box-shadow:0 0 0 1px rgba(110,255,235,.4)}',
    '.ae-kur p{margin:0;flex:1;font-size:13.5px;color:#d6f7f1}',
    /* hologram ikon stili: renkli ikonlar tek renk turkuaz ışık */
    'body.ae-hologram .ae-ikon img,body.ae-hologram .ae-raf img{filter:grayscale(1) brightness(1.35) sepia(1) hue-rotate(125deg) saturate(2.4) drop-shadow(0 0 6px rgba(94,240,220,.7))!important;opacity:.95}',
    '.ae-nokta{position:fixed;right:max(22px,env(safe-area-inset-right));bottom:calc(26px + env(safe-area-inset-bottom,0px));z-index:200;width:44px;height:44px;border-radius:50%;border:0;cursor:pointer;' +
      'background:radial-gradient(circle,#fff1cf 0 14%,rgba(255,211,138,.6) 22%,rgba(255,211,138,.08) 56%,transparent 70%);box-shadow:0 0 18px rgba(255,200,100,.45);animation:aeNefes 3.6s ease-in-out infinite}',
    '@keyframes aeNefes{0%,100%{transform:scale(.9);opacity:.75}50%{transform:scale(1.08);opacity:1}}',
    'body.rl-acik .ae-nokta{display:none}',
    '.ae-halka{position:fixed;inset:0;z-index:400;display:grid;place-items:center;background:radial-gradient(circle at 50% 50%,rgba(30,22,6,.55),rgba(1,6,9,.92) 70%);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);animation:aeAc .35s ease-out}',
    '.ae-halka.kapaniyor{animation:aeKapa .3s ease-in forwards}',
    '@keyframes aeAc{from{opacity:0}}@keyframes aeKapa{to{opacity:0;filter:blur(6px)}}',
    '.ae-ipucu{position:fixed;top:max(20px,env(safe-area-inset-top));left:0;right:0;text-align:center;font:11px var(--f-kod,monospace);letter-spacing:.2em;color:rgba(255,226,170,.6)}',
    '.ae-sahne{position:relative;width:min(92vmin,660px);height:min(92vmin,660px)}',
    '.ae-cizim{position:absolute;inset:0;width:100%;height:100%;pointer-events:none}',
    '.ae-don{transform-origin:0 0;animation:aeDon 50s linear infinite}@keyframes aeDon{to{transform:rotate(360deg)}}',
    '.ae-isin{stroke:rgba(255,226,170,.55);stroke-width:.5;stroke-dasharray:2 3;stroke-dashoffset:60;animation:aeIsin 1.4s linear infinite,aeIsinGir .5s ease-out both}',
    '@keyframes aeIsin{to{stroke-dashoffset:0}}@keyframes aeIsinGir{from{opacity:0}}',
    '.ae-orta{position:absolute;left:50%;top:50%;width:26%;height:26%;transform:translate(-50%,-50%);border-radius:50%;border:0;background:transparent;cursor:pointer;display:grid;place-items:center}',
    '.ae-orta canvas{position:absolute;inset:0;width:100%;height:100%}.ae-orta span{position:relative;font:700 10px var(--f-kod,monospace);letter-spacing:.24em;color:#ffe2a8;text-shadow:0 0 10px rgba(255,200,100,.8);margin-top:62%}',
    '.ae-dugum{position:absolute;left:50%;top:50%;width:104px;height:128px;margin:-64px 0 0 -52px;border:0;background:transparent;color:#fff4dd;cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:6px;' +
      'transform:translate(var(--x),var(--y));animation:aeDugum .55s cubic-bezier(.2,1.4,.4,1) both}',
    '@keyframes aeDugum{from{transform:translate(0,0) scale(.2);opacity:0;filter:blur(8px)}to{transform:translate(var(--x),var(--y)) scale(1);opacity:1;filter:blur(0)}}',
    '.ae-dugum i{width:66px;height:66px;border-radius:50%;display:grid;place-items:center;font-style:normal;position:relative;overflow:hidden;' +
      'background:radial-gradient(circle,rgba(255,211,138,.16),rgba(20,14,4,.55) 70%);box-shadow:0 0 0 1px rgba(255,211,138,.45),0 0 22px rgba(255,200,100,.22)}',
    '.ae-dugum i::after{content:"";position:absolute;inset:0;background:repeating-linear-gradient(0deg,rgba(255,240,210,.08) 0 1px,transparent 1px 3px);animation:aeTara 2.4s linear infinite;pointer-events:none}',
    '@keyframes aeTara{to{background-position:0 30px}}',
    '.ae-dugum .hki{--hki-boy:84px}',
    '.ae-dugum span{font:600 12px var(--f-govde,system-ui);max-width:96px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;text-shadow:0 0 8px rgba(0,0,0,.8)}',
    '.ae-dugum:hover .hki,.ae-dugum:focus-visible .hki{filter:brightness(1.35) drop-shadow(0 0 14px rgba(255,200,100,.6))}',
    '.ae-dugum.secildi{z-index:3;animation:aeSec .42s ease-in forwards}',
    '@keyframes aeSec{50%{transform:translate(var(--x),var(--y)) scale(1.35);filter:brightness(1.8) drop-shadow(0 0 22px #ffd38a)}100%{transform:translate(0,0) scale(.3);opacity:0;filter:brightness(2.5) blur(4px)}}',
    '.ae-halka.cokuyor .ae-dugum:not(.secildi){animation:aeCok .35s ease-in forwards}@keyframes aeCok{to{transform:translate(0,0) scale(.2);opacity:0;filter:blur(6px)}}',
    '.ae-halka.cokuyor .ae-isinlar{opacity:0;transition:opacity .25s}',
    'body.ae-hologram .ae-dugum img{filter:grayscale(1) brightness(1.4) sepia(1) hue-rotate(-10deg) saturate(2.2) drop-shadow(0 0 6px rgba(255,200,100,.7))}',
    '@media (prefers-reduced-motion: reduce){.ae-don,.ae-isin,.ae-nokta{animation:none}}'
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
    var stilSec = el('select', { 'aria-label': 'İkon stili' }, [el('option', { value: 'cizim', text: 'İkonlar: Jarvis çizim' }), el('option', { value: 'hologram', text: 'İkonlar: hologram renk' }), el('option', { value: 'orijinal', text: 'İkonlar: orijinal renk' })]);
    var ST = 'cizim';
    stil().then(function (s2) { ST = s2; stilSec.value = s2; if (L.length) ciz(); });
    stilSec.addEventListener('change', function () { ST = stilSec.value; U.depoGuncelle('anaEkran', function (d) { d.stil = ST; }, 100); ciz(); });
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
          var b = el('button', { type: 'button', class: 'ae-uyg' + (F.indexOf(u.paket) >= 0 ? ' fav' : ''), 'aria-label': u.ad }, [ikonEl(u, ST), el('span', { text: u.ad })]);
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

  /* Uygulama çemberi (kullanıcı, 2026-11-03: "yine çember olsun, sık kullanılan uygulamalar için; tıklayınca açılsınlar, o sol
     üstteki tuş gibi; pencereleri, animasyonları holografik yap"). Sağ altta amber nokta (sol alttaki menü noktasının eşi) →
     ekranın ortasında favori uygulamalar bir çember üzerinde; merkezden her birine akan ışık çizgileri, dönen çentikli halka;
     seçince ikon ışıyıp büyür, çember merkeze çöker, uygulama açılır. */
  var halka = null;
  function halkaAc() {
    if (halka) return halkaKapat();
    Promise.all([U.uygulamalar(false), favoriler(), stil()]).then(function (r) {
      var L = r[0], F = r[1];
      var l = F.map(function (p) { return L.filter(function (u) { return u.paket === p; })[0]; }).filter(Boolean).slice(0, 11);
      l.push({ ad: 'Tümü', tum: true });
      var NS = 'http://www.w3.org/2000/svg', sahne = el('div', { class: 'ae-sahne' }), n = l.length, R = 0.37;
      var svg = document.createElementNS(NS, 'svg'); svg.setAttribute('viewBox', '-100 -100 200 200'); svg.setAttribute('class', 'ae-cizim');
      var h = '<g class="ae-don" fill="none" stroke="rgba(255,211,138,.32)" stroke-width=".35"><circle r="60"/><circle r="68" stroke-dasharray="1 2.6"/><circle r="95" stroke="rgba(255,211,138,.14)"/>';
      for (var i = 0; i < 96; i++) { var aa = i / 96 * Math.PI * 2, r1 = i % 8 ? 91 : 87; h += '<line x1="' + (Math.cos(aa) * r1).toFixed(1) + '" y1="' + (Math.sin(aa) * r1).toFixed(1) + '" x2="' + (Math.cos(aa) * 95).toFixed(1) + '" y2="' + (Math.sin(aa) * 95).toFixed(1) + '"/>'; }
      h += '</g><g class="ae-isinlar">';
      l.forEach(function (u, k) { var a2 = -Math.PI / 2 + k / n * Math.PI * 2; h += '<line class="ae-isin" style="animation-delay:' + (k * 40) + 'ms" x1="' + (Math.cos(a2) * 13).toFixed(1) + '" y1="' + (Math.sin(a2) * 13).toFixed(1) + '" x2="' + (Math.cos(a2) * (R * 200 - 12)).toFixed(1) + '" y2="' + (Math.sin(a2) * (R * 200 - 12)).toFixed(1) + '"/>'; });
      svg.innerHTML = h + '</g>'; sahne.appendChild(svg);
      var orta = el('button', { class: 'ae-orta', type: 'button', 'aria-label': 'Tüm uygulamalar', onclick: function () { halkaKapat(); location.hash = '#uygulamalar'; } }, [el('canvas', { 'aria-hidden': 'true' }), el('span', { text: 'UYGULAMALAR' })]);
      sahne.appendChild(orta);
      var dugumler = [];
      l.forEach(function (u, k) {
        // translate yüzdesi elemanın kendi boyutuna göredir → sahne boyutundan piksel hesaplanır
        var S = Math.min(660, Math.min(innerWidth, innerHeight) * 0.92), a2 = -Math.PI / 2 + k / n * Math.PI * 2, x = Math.cos(a2) * R * S, y = Math.sin(a2) * R * S;
        var d = el('button', { class: 'ae-dugum' + (u.tum ? ' tum' : ''), type: 'button', 'aria-label': u.ad, style: '--x:' + x.toFixed(1) + 'px;--y:' + y.toFixed(1) + 'px;animation-delay:' + (80 + k * 45) + 'ms' },
          [ikonEl(u, r[2]), el('span', { text: u.ad })]);
        d.addEventListener('click', function (e) {
          e.stopPropagation(); if (u.tum) { halkaKapat(); location.hash = '#uygulamalar'; return; }
          try { navigator.vibrate && navigator.vibrate(18); } catch (x2) {}
          d.classList.add('secildi'); halka.classList.add('cokuyor');
          setTimeout(function () { ac(u); halkaKapat(true); }, 420);
        });
        sahne.appendChild(d); dugumler.push(d);
      });
      halka = el('div', { class: 'ae-halka', role: 'dialog', 'aria-label': 'Uygulamalar' }, [el('div', { class: 'ae-ipucu', text: 'UYGULAMA SEÇ · DIŞARI DOKUN: KAPAT' }), sahne]);
      halka.addEventListener('click', function (e) { if (e.target === halka || e.target === sahne) halkaKapat(); });
      document.body.appendChild(halka);
      if (window.JarvisKure) new window.JarvisKure(orta.querySelector('canvas'), { kucuk: true, serit: 2, iplik: 4, nokta: 90, kosul: function () { return !!halka; } });
    }).catch(function (e) { U.toast(e.message || 'Uygulamalar okunamadı'); });
  }
  function halkaKapat(hizli) { if (!halka) return; var h2 = halka; halka = null; h2.classList.add('kapaniyor'); setTimeout(function () { h2.remove(); }, hizli ? 120 : 320); }
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && halka) halkaKapat(); });
  window.addEventListener('hashchange', function () { if (halka) halkaKapat(); });
  U.uygulamaHalkasi = halkaAc;
  if (VAR) { var nokta = el('button', { class: 'ae-nokta', type: 'button', 'aria-label': 'Uygulamalar', title: 'Uygulamalar', onclick: halkaAc }); (document.body ? document.body.appendChild(nokta) : document.addEventListener('DOMContentLoaded', function () { document.body.appendChild(nokta); })); }
  var eskiKut = U.GORUNUMLER.kutuphane;
  U.GORUNUMLER.kutuphane = function () { eskiKut.apply(this, arguments); };
})();
