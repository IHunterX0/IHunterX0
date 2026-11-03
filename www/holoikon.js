/* 1001 — Jarvis tarzı uygulama ikonları (kullanıcı, 2026-11-03: "resimlere, dizayna biraz daha dikkat edelim; Jarvis efektli ikonlar").
   Yapay zekâ resmi yerine vektör çizim: ücretsiz, tutarlı, her boyutta keskin, internet istemez. Marka logosu kopyalanmaz; uygulamanın
   işini anlatan ışık çizimi kullanılır. Her ikon: dış çerçeve + zıt yönde dönen iki ışık yayı + çizim (ışıma) + tarama + ara sıra titreme.
   Bilinmeyen uygulamada: uygulamanın kendi ikonu hologram tonuna boyanıp aynı çerçeveye konur.
   U.holoIkon(u) → eleman. Stil (Depo anaEkran.stil): 'cizim' (varsayılan) · 'hologram' (boyalı orijinal) · 'orijinal'. */
(function () {
  'use strict';
  var U = window.Uygulama; if (!U) return;
  var NS = 'http://www.w3.org/2000/svg';
  // 24×24 çizimler (U.IKONLAR'a ek)
  var CIZIM = {
    kure: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Z M3 12h18 M12 3c2.6 2.6 3.8 5.6 3.8 9s-1.2 6.4-3.8 9 M12 3c-2.6 2.6-3.8 5.6-3.8 9s1.2 6.4 3.8 9 M1.5 8.5c5-3.5 15-3.5 21 2',
    dalgaSes: 'M3 12h2 M7 8v8 M10.5 5v14 M14 9v6 M17.5 6.5v11 M21 11v2',
    diyafram: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Z M14.3 3.3 9.7 11.2 M20.4 9.2 11.3 9.2 M18.5 17.8 13.9 9.9 M9.7 20.7 14.3 12.8 M3.6 14.8 12.7 14.8 M5.5 6.2 10.1 14.1',
    sohbet: 'M12 4c5 0 9 3.1 9 7s-4 7-9 7c-1.2 0-2.3-.2-3.3-.5L4 19l1.3-3.6C4.5 14.2 3 12.7 3 11c0-3.9 4-7 9-7Z M8.5 11h.01 M12 11h.01 M15.5 11h.01',
    kivilcim: 'M12 2v6 M12 16v6 M2 12h6 M16 12h6 M5 5l4 4 M15 15l4 4 M19 5l-4 4 M9 15l-4 4 M12 9.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5Z',
    klasor: 'M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z M3 10h18 M9 14h6',
    ekranOynat: 'M3 6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z M10 8v6l5-3Z M8 21h8',
    ucak: 'M21 3 3 10.5l7 2.5 2.5 7Z M21 3 10 13',
    resim: 'M3 5h18v14H3Z M3 16l5-5 4 4 3-3 6 6 M15.5 8.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Z',
    harita: 'M12 21s7-6.1 7-11.5a7 7 0 1 0-14 0C5 14.9 12 21 12 21Z M12 7a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5Z',
    canta: 'M5 8h14l-1 12H6Z M9 8V6a3 3 0 0 1 6 0v2 M10.5 12v5l4-2.5Z',
    telefon: 'M5 3h4l2 5-2.5 1.5a11 11 0 0 0 6 6L16 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2Z',
    zarf: 'M3 6h18v12H3Z M3 6l9 7 9-7',
    hesap: 'M6 3h12v18H6Z M8.5 6h7v3h-7Z M9 12h.01 M12 12h.01 M15 12h.01 M9 15h.01 M12 15h.01 M15 15h.01 M9 18h.01 M12 18h.01 M15 18h.01',
    notDefter: 'M6 3h10l3 3v15H6Z M16 3v3h3 M9 10h7 M9 14h7 M9 18h4',
    kartlar: 'M7 4h12v14H7Z M4 7v13h12',
    oyun: 'M7 9h10a4 4 0 0 1 4 4v2a3 3 0 0 1-5.4 1.8L14 15h-4l-1.6 1.8A3 3 0 0 1 3 15v-2a4 4 0 0 1 4-4Z M8 11v4 M6 13h4 M16 12h.01 M18 14h.01',
    kullanici: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z M4 21a8 8 0 0 1 16 0',
    bulut: 'M7 18a4.5 4.5 0 0 1-.4-9A6 6 0 0 1 18 9.5a4 4 0 0 1-.5 8.5Z',
    video: 'M3 6h12v12H3Z M15 10l6-3v10l-6-3'
  };
  var PAKET = [
    [/chrome|sbrowser|firefox|opera|edge|brave|duckduckgo|browser/i, 'kure'],
    [/spotify|music|deezer|soundcloud|podcast/i, 'dalgaSes'],
    [/instagram|camera|kamera/i, 'diyafram'],
    [/telegram/i, 'ucak'],
    [/whatsapp|messag|mms|messenger|discord|signal|chat/i, 'sohbet'],
    [/anthropic|claude|openai|chatgpt|gemini|bard|copilot|perplexity/i, 'kivilcim'],
    [/myfiles|nbu\.files|documentsui|files/i, 'klasor'],
    [/youtube|netflix|prime|disney|twitch|video/i, 'ekranOynat'],
    [/gallery|photos|galeri/i, 'resim'],
    [/maps|harita|waze|yandex\.navi/i, 'harita'],
    [/vending|galaxyapps|store/i, 'canta'],
    [/dialer|phone|telecom/i, 'telefon'],
    [/contacts|rehber/i, 'kullanici'],
    [/gmail|mail|outlook/i, 'zarf'],
    [/calculator|hesap/i, 'hesap'],
    [/notes|keep|notion|onenote|goodnotes|noteshelf|docs/i, 'notDefter'],
    [/anki|quizlet/i, 'kartlar'],
    [/settings|ayarlar/i, 'disli'],
    [/clock|alarm/i, 'saat'],
    [/calendar|takvim/i, 'takvim'],
    [/drive|dropbox|onedrive|cloud/i, 'bulut'],
    [/zoom|teams|meet/i, 'video'],
    [/game|oyun|play\.games/i, 'oyun']
  ];
  function cizimAdi(u) {
    if (u.tum) return 'izgara';
    var k = (u.paket || '') + ' ' + (u.ad || '');
    for (var i = 0; i < PAKET.length; i++) if (PAKET[i][0].test(k)) return PAKET[i][1];
    return null;
  }
  function yol(ad) { return CIZIM[ad] || (U.ikonYol && U.ikonYol(ad)) || null; }
  var sayac = 0;
  U.holoIkon = function (u, stil) {
    stil = stil || 'cizim';
    var kap = document.createElement('span'); kap.className = 'hki';
    var id = 'hkg' + (++sayac), ad = stil === 'cizim' ? cizimAdi(u) : null, d = ad && yol(ad);
    var s = document.createElementNS(NS, 'svg'); s.setAttribute('viewBox', '0 0 100 100'); s.setAttribute('aria-hidden', 'true');
    var h = '<defs><linearGradient id="' + id + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset=".55" style="stop-color:var(--hki-r,#9ffff0)"/><stop offset="1" style="stop-color:var(--hki-r2,#46c8ff)"/></linearGradient>' +
      '<radialGradient id="' + id + 'z"><stop offset="0" style="stop-color:var(--hki-r,#5ef0dc)" stop-opacity=".28"/><stop offset=".7" style="stop-color:var(--hki-r,#5ef0dc)" stop-opacity=".05"/><stop offset="1" style="stop-color:var(--hki-r,#5ef0dc)" stop-opacity="0"/></radialGradient></defs>' +
      '<circle cx="50" cy="50" r="44" fill="url(#' + id + 'z)"/>' +
      '<circle cx="50" cy="50" r="41" fill="none" style="stroke:var(--hki-r,#5ef0dc)" stroke-opacity=".35" stroke-width=".8"/>' +
      '<g class="hki-yay a"><circle cx="50" cy="50" r="47" fill="none" stroke="transparent"/><path d="M50 3 A47 47 0 0 1 91 27" fill="none" style="stroke:var(--hki-r,#9ffff0)" stroke-width="2.2" stroke-linecap="round"/><path d="M50 97 A47 47 0 0 1 9 73" fill="none" style="stroke:var(--hki-r,#9ffff0)" stroke-width="1.2" stroke-linecap="round" opacity=".6"/></g>' +
      '<g class="hki-yay b"><circle cx="50" cy="50" r="37" fill="none" stroke="transparent"/><path d="M13 50 A37 37 0 0 1 30 19" fill="none" style="stroke:var(--hki-r2,#46c8ff)" stroke-width="1.4" stroke-linecap="round" opacity=".8"/><path d="M87 50 A37 37 0 0 1 70 81" fill="none" style="stroke:var(--hki-r2,#46c8ff)" stroke-width="1.4" stroke-linecap="round" opacity=".8"/></g>';
    for (var i = 0; i < 24; i++) { var a = i / 24 * Math.PI * 2, r1 = i % 6 ? 42.5 : 41; h += '<line x1="' + (50 + Math.cos(a) * r1).toFixed(1) + '" y1="' + (50 + Math.sin(a) * r1).toFixed(1) + '" x2="' + (50 + Math.cos(a) * 44).toFixed(1) + '" y2="' + (50 + Math.sin(a) * 44).toFixed(1) + '" style="stroke:var(--hki-r,#5ef0dc)" stroke-opacity=".45" stroke-width=".6"/>'; }
    if (d) h += '<g transform="translate(23 23) scale(2.25)" class="hki-cizim"><path d="' + d + '" fill="none" stroke="url(#' + id + ')" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round"/></g>';
    s.innerHTML = h; kap.appendChild(s);
    if (!d) {
      if (u.ikon && stil !== 'cizim-yalniz') { var im = document.createElement('img'); im.src = u.ikon; im.alt = ''; im.className = stil === 'orijinal' ? 'hki-img orj' : 'hki-img'; kap.appendChild(im); }
      else { var b = document.createElement('b'); b.className = 'hki-harf'; b.textContent = String(u.ad || '?').charAt(0).toLocaleUpperCase('tr'); kap.appendChild(b); }
    }
    return kap;
  };
  var css = document.createElement('style');
  css.textContent = [
    '.hki{position:relative;display:inline-grid;place-items:center;width:var(--hki-boy,72px);height:var(--hki-boy,72px);flex:none}',
    '.hki > svg{position:absolute;inset:0;width:100%;height:100%;overflow:visible}',
    '.hki-cizim{filter:drop-shadow(0 0 2.2px var(--hki-r,#5ef0dc)) drop-shadow(0 0 6px var(--hki-r,#5ef0dc));animation:hkiTitre 7s steps(1) infinite}',
    '.hki-yay{transform-box:fill-box;transform-origin:center;animation:hkiDon 9s linear infinite}.hki-yay.b{animation-duration:13s;animation-direction:reverse}',
    '@keyframes hkiDon{to{transform:rotate(360deg)}}',
    '@keyframes hkiTitre{0%,100%{opacity:1}61%{opacity:.55}62%{opacity:1}87%{opacity:.8}88%{opacity:1}}',
    '.hki::after{content:"";position:absolute;inset:16%;border-radius:50%;pointer-events:none;background:repeating-linear-gradient(0deg,rgba(220,255,250,.10) 0 1px,transparent 1px 3px);animation:hkiTara 3s linear infinite;-webkit-mask-image:radial-gradient(circle,#000 55%,transparent 72%);mask-image:radial-gradient(circle,#000 55%,transparent 72%)}',
    '@keyframes hkiTara{to{background-position:0 24px}}',
    '.hki-img{position:relative;width:48%;height:48%;border-radius:22%;filter:grayscale(1) brightness(1.4) sepia(1) hue-rotate(125deg) saturate(2.5) drop-shadow(0 0 5px var(--hki-r,#5ef0dc));opacity:.95}',
    '.hki-img.orj{filter:drop-shadow(0 0 6px rgba(94,240,220,.5));opacity:1}',
    '.hki-harf{position:relative;font:300 calc(var(--hki-boy,72px) * .42) var(--f-kod,monospace);color:#effffc;text-shadow:0 0 8px var(--hki-r,#5ef0dc),0 0 18px var(--hki-r,#5ef0dc)}',
    '.ae-halka .hki{--hki-r:#ffd38a;--hki-r2:#ffab5e}',
    '@media (prefers-reduced-motion: reduce){.hki-yay,.hki-cizim,.hki::after{animation:none}}'
  ].join('\n');
  document.head.appendChild(css);
})();
