/* 1001 — Holografik çizgi ikonlar (kullanıcı, 2026-11-03: "emojiler çok kötü duruyor, çocuk grafikleri gibi").
   - U.ikon(ad) → SVG (24×24, ince çizgi, currentColor, ışıma). U.ikonYol(ad) → path verisi (SVG içine gömmek için).
   - Bilinen emojiler sayfanın her yerinde kendiliğinden bu ikonlarla değiştirilir; bilinmeyen emojiler tek renk hologram tonuna
     çevrilir (renkli çocuk çizimi gibi durmasın). Giriş alanları, düzenlenebilir alanlar ve SVG metinleri elle bırakılır. */
(function () {
  'use strict';
  var U = window.Uygulama; if (!U) return;
  var NS = 'http://www.w3.org/2000/svg';
  var Y = {
    kalp: 'M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z M8.5 10.5h2l1-2 1.5 4 1-2h1.5',
    beyin: 'M9 4.5a3 3 0 0 0-3 3 3 3 0 0 0-1.5 5.3A3 3 0 0 0 7 17.5a2.5 2.5 0 0 0 5 .5V5.5A2 2 0 0 0 9 4.5Z M15 4.5a3 3 0 0 1 3 3 3 3 0 0 1 1.5 5.3 3 3 0 0 1-2.5 4.7 2.5 2.5 0 0 1-5 .5 M8 9h2 M14 12h2 M8 14h2',
    kemik: 'M7.5 4.5a2 2 0 0 0-3 2.4 2 2 0 0 0 2.4 3l9.2 9.2a2 2 0 0 0 3 2.4 2 2 0 0 0 2.4-3 2 2 0 0 0-2.4-3L9.9 6.9a2 2 0 0 0-2.4-2.4Z',
    dna: 'M7 3c0 5 10 5 10 9s-10 4-10 9 M17 3c0 5-10 5-10 9s10 4 10 9 M8 6h8 M8.5 18h7 M9.5 9.5h5 M9.5 14.5h5',
    molekul: 'M12 4l6 3.5v7L12 18l-6-3.5v-7Z M12 4V1.5 M18 14.5l2.2 1.3 M6 14.5l-2.2 1.3 M12 18v3',
    hucre: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Z M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z M6.5 8.5h.01 M17 15.5h.01 M16 7h.01',
    mikroskop: 'M9 3h4l-1 6h-2Z M10 9l-1 4h4 M6 21h12 M8 18h8 M14 13a5 5 0 0 1 0 5',
    test_tupu: 'M9 3h6 M10 3v13a2 2 0 0 0 4 0V3 M10 11h4',
    ilac: 'M8.5 15.5l7-7a3.5 3.5 0 0 0-5-5l-7 7a3.5 3.5 0 0 0 5 5Z M7 9l5 5',
    damla: 'M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11Z',
    akciger: 'M12 3v8 M12 8c-2 0-3 1-3 3 M12 8c2 0 3 1 3 3 M9 6C6 6 4 10 4 15c0 3 1 5 3 5s3-2 3-5V9 M15 6c3 0 5 4 5 9 0 3-1 5-3 5s-3-2-3-5V9',
    goz: 'M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z',
    kitap: 'M4 5a2 2 0 0 1 2-2h13v15H6a2 2 0 0 0-2 2Z M4 20a2 2 0 0 0 2 2h13v-4 M8 7h7',
    makale: 'M5 4h11v16H6a2 2 0 0 1-2-2V5a1 1 0 0 1 1-1Z M16 8h3v10a2 2 0 0 1-2 2 M8 8h5 M8 12h5 M8 16h3',
    oynat: 'M7 4.5v15l12-7.5Z',
    kart: 'M4 7h12v13H4Z M8 7V4h12v13h-4',
    hedef: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Z M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10Z M12 11a1 1 0 1 0 0 2 1 1 0 0 0 0-2Z',
    tahmin: 'M3 12h3l3-7 4 14 3-7h5 M18 5l1-2 M21 8l2-1',
    takvim: 'M7 3v3M17 3v3M4 9h16M5 5h14a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z M8 13h3v3H8Z',
    pusula: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Z M15.5 8.5l-2 5-5 2 2-5Z',
    saat: 'M12 4a9 9 0 1 0 0 18 9 9 0 0 0 0-18Z M12 8v5l3 2 M9 2h6',
    ates: 'M12 21a6 6 0 0 0 6-6c0-4-3-6-4-10-2 2-3 4-3 6-1-1-2-2-2-4-2 2-3 5-3 8a6 6 0 0 0 6 6Z M12 21a2.5 2.5 0 0 1-2.5-2.5c0-1.5 2.5-4 2.5-4s2.5 2.5 2.5 4A2.5 2.5 0 0 1 12 21Z',
    simsek: 'M13 2 4 14h7l-1 8 9-12h-7Z',
    yildiz: 'M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9Z',
    soru: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Z M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.3-1 .9-1 1.7v.5 M12 17h.01',
    uyari: 'M12 3l10 18H2Z M12 10v5 M12 18h.01',
    ampul: 'M9 18h6 M10 21h4 M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3Z',
    kilit: 'M6 11h12v10H6Z M8.5 11V8a3.5 3.5 0 0 1 7 0v3',
    kapat: 'M6 6l12 12M18 6 6 18',
    ses: 'M4 9h4l5-4v14l-5-4H4Z M16 9a4 4 0 0 1 0 6 M18.5 6.5a7.5 7.5 0 0 1 0 11',
    sessiz: 'M4 9h4l5-4v14l-5-4H4Z M16 9l5 6M21 9l-5 6',
    yorum: 'M4 5h16v11H9l-5 4Z M8 9h8 M8 12h5',
    buyutec: 'M10.5 4a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13Z M15.5 15.5 21 21',
    saray: 'M3 9l9-5 9 5 M5 10v8 M9.5 10v8 M14.5 10v8 M19 10v8 M3 20h18',
    dis: 'M14 4h6v6 M20 4l-9 9 M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5',
    grafik: 'M4 20V4 M4 20h16 M7 15l4-4 3 3 5-6',
    disli: 'M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z M12 2v3 M12 19v3 M2 12h3 M19 12h3 M4.9 4.9l2.1 2.1 M17 17l2.1 2.1 M4.9 19.1 7 17 M17 7l2.1-2.1',
    tik: 'M4 12.5l5 5L20 6.5',
    kahve: 'M5 8h11v6a5 5 0 0 1-5 5H10a5 5 0 0 1-5-5Z M16 10h2a2 2 0 0 1 0 4h-2 M8 3c0 1 1 1 1 2s-1 1-1 2 M12 3c0 1 1 1 1 2s-1 1-1 2',
    kosu: 'M14 4a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Z M6 20l3-5 3 2v4 M13 9l-3 1-2 3 M13 9l2 4 3 1 M12 17l1-4',
    uyku: 'M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z',
    yemek: 'M6 3v8a2 2 0 0 0 2 2v8 M10 3v8a2 2 0 0 1-2 2 M8 3v6 M17 3c-2 2-2 6 0 8v10',
    termometre: 'M10 4a2 2 0 0 1 4 0v10a4 4 0 1 1-4 0Z M12 9v7',
    pil: 'M3 8h15v8H3Z M18 11h2v2h-2 M6 11h3',
    kas: 'M5 18c2-6 4-9 9-10l3-3 2 2-2 3c0 5-5 9-12 8Z M10 13c1 1 3 1 4 0',
    el: 'M8 13V5a1.5 1.5 0 0 1 3 0v6 M11 10V4a1.5 1.5 0 0 1 3 0v7 M14 10V5.5a1.5 1.5 0 0 1 3 0V14a7 7 0 0 1-12 4l-2-4a1.5 1.5 0 0 1 2.6-1.5L8 15',
    kep: 'M2 9l10-5 10 5-10 5Z M6 11v5c3 2 9 2 12 0v-5 M21 9v6',
    duraklat: 'M8 5v14 M16 5v14',
    dalga: 'M2 12c2-5 4-5 6 0s4 5 6 0 4-5 6 0',
    mikrop: 'M12 6a6 6 0 1 0 0 12 6 6 0 0 0 0-12Z M12 2v4 M12 18v4 M2 12h4 M18 12h4 M5 5l3 3 M16 16l3 3 M5 19l3-3 M16 8l3-3',
    steteskop: 'M6 3v6a4 4 0 0 0 8 0V3 M10 13v3a5 5 0 0 0 10 0v-2 M20 12a2 2 0 1 0 0 .01',
    seker: 'M8 8l8 8 M7 12a5 5 0 0 1 5-5l4 4a5 5 0 0 1-5 5Z M4 4l3 3 M17 17l3 3',
    kalkan: 'M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6Z',
    plan: 'M9 5h11 M9 12h11 M9 19h11 M4 5h.01 M4 12h.01 M4 19h.01',
    ev: 'M3 11l9-7 9 7 M5 10v10h14V10',
    sinir: 'M12 4a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z M12 10v11 M12 14l-5 3 M12 17l5 3 M9.5 5.5 6 3 M14.5 5.5 18 3',
    enzim: 'M4 8a4 4 0 0 1 8 0v8a4 4 0 0 1-8 0 M12 12h8 M16 8v8',
    gunes: 'M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10Z M12 1v3 M12 20v3 M1 12h3 M20 12h3 M4.2 4.2l2.1 2.1 M17.7 17.7l2.1 2.1 M4.2 19.8l2.1-2.1 M17.7 6.3l2.1-2.1',
    ok: 'M5 12h14 M13 6l6 6-6 6',
    kupa: 'M7 4h10v5a5 5 0 0 1-10 0Z M7 6H4v2a3 3 0 0 0 3 3 M17 6h3v2a3 3 0 0 1-3 3 M12 14v4 M8 21h8',
    sise: 'M10 2h4 M10 2v5L7 11v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-9l-3-4V2 M7 14h10',
    izgara: 'M4 4h6v6H4Z M14 4h6v6h-6Z M4 14h6v6H4Z M14 14h6v6h-6Z'
  };
  // emoji → ikon
  var E = {};
  function es(ad, l) { l.split(' ').forEach(function (e) { E[e] = ad; }); }
  es('kalp', '❤️ ❤ ♥ 💓 💗 💖 🫀 ♥️'); es('beyin', '🧠'); es('kemik', '🦴'); es('dna', '🧬'); es('molekul', '⚛️ ⚛ ⬡'); es('mikroskop', '🔬'); es('test_tupu', '🧪 ⚗️ ⚗');
  es('ilac', '💊 💉'); es('damla', '🩸 💧 💦'); es('akciger', '🫁'); es('goz', '👁️ 👁 👀'); es('kitap', '📖 📚 📕 📗 📘 📙 📓 📔 ❏'); es('makale', '📰 📄 📃 📑 📝'); es('oynat', '▶️ ▶ ⏯ ⏯️');
  es('kart', '❖ 🃏 🗂 🗂️ 🎴'); es('hedef', '🎯 ◎'); es('tahmin', '🔮'); es('takvim', '📅 📆 🗓 🗓️'); es('pusula', '🧭'); es('saat', '⏱ ⏱️ ⏰ ⌛ ⏳ 🕐'); es('ates', '🔥'); es('simsek', '⚡ ⚡️');
  es('yildiz', '⭐ ★ ✨ 🌟 ✦'); es('soru', '❓ ❔'); es('uyari', '⚠️ ⚠ ❗ ❕ 🚨'); es('ampul', '💡'); es('kilit', '🔒 🔐'); es('kapat', '✕ ✖ ✖️ ❌'); es('ses', '🔊 🔉 🎙 🎙️ 🎤'); es('sessiz', '🔇');
  es('yorum', '💬 🗨 🗨️'); es('buyutec', '🔍 🔎'); es('saray', '🏛 🏛️'); es('dis', '↗ ↗️'); es('grafik', '📈 📊 📉'); es('disli', '⚙️ ⚙'); es('tik', '✅ ✓ ✔ ✔️ ☑️'); es('kahve', '☕');
  es('kosu', '🏃 🏃‍♂️ 🏃‍♀️ 🚴'); es('uyku', '😴 🌙 💤'); es('yemek', '🍽 🍽️ 🍔 🍕 🍞 🍝 🥗 🍎 🍌'); es('termometre', '🌡 🌡️'); es('pil', '🔋'); es('kas', '💪'); es('el', '✋ 🖐 🖐️ 👋');
  es('kep', '🎓'); es('duraklat', '⏸ ⏸️'); es('dalga', '〰 〰️ 🌊'); es('mikrop', '🦠'); es('steteskop', '🩺'); es('seker', '🍬 🍭 🍯 🧁 🍰 🍫'); es('kalkan', '🛡 🛡️'); es('plan', '📋'); es('ev', '🏠');
  es('enzim', '✂️ ✂'); es('gunes', '☀️ ☀'); es('ok', '➡️ ➡ →'); es('kupa', '🏆 🥇'); es('sise', '🍺 🍷 🥃 🧃 🥤'); es('izgara', '▦ 📱');

  U.IKONLAR = Y;
  U.ikonYol = function (ad) { return Y[ad] || Y[E[ad]] || null; };
  U.emojiIkon = function (e) { return E[String(e || '').replace(/️/g, '')] || E[e] || null; };
  U.ikon = function (ad, sinif) {
    var d = U.ikonYol(ad) || Y.yildiz, s = document.createElementNS(NS, 'svg');
    s.setAttribute('viewBox', '0 0 24 24'); s.setAttribute('class', 'hik' + (sinif ? ' ' + sinif : '')); s.setAttribute('aria-hidden', 'true');
    s.innerHTML = '<path d="' + d + '" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>';
    return s;
  };
  var css = document.createElement('style');
  css.textContent = '.hik{width:1.15em;height:1.15em;vertical-align:-.2em;display:inline-block;filter:drop-shadow(0 0 4px currentColor);overflow:visible}' +
    '.hemo{filter:grayscale(1) brightness(1.5) sepia(1) hue-rotate(125deg) saturate(2.6) drop-shadow(0 0 5px rgba(94,240,220,.8));opacity:.92}';
  document.head.appendChild(css);

  // sayfadaki emojileri dönüştür
  var RE = /(\p{Extended_Pictographic}(?:️|‍\p{Extended_Pictographic}|[\u{1F3FB}-\u{1F3FF}])*|[▶◀◎❖⬡〰✕✓★✦↗→])/gu;
  var DISLA = /^(INPUT|TEXTAREA|SCRIPT|STYLE|CODE|PRE|OPTION|SELECT|TITLE)$/;
  function isle(dugum) {
    var w = document.createTreeWalker(dugum, NodeFilter.SHOW_TEXT, { acceptNode: function (n) {
      var p = n.parentNode; if (!p || DISLA.test(p.nodeName) || p.isContentEditable || (p.namespaceURI === NS) || (p.closest && p.closest('.hemo,.hik,[data-emoji-dokunma]'))) return NodeFilter.FILTER_REJECT;
      RE.lastIndex = 0; return RE.test(n.nodeValue) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP; } });
    var l = []; while (w.nextNode()) l.push(w.currentNode);
    l.forEach(function (n) {
      var m = n.nodeValue, f = document.createDocumentFragment(), son = 0, x; RE.lastIndex = 0;
      while ((x = RE.exec(m))) {
        if (x.index > son) f.appendChild(document.createTextNode(m.slice(son, x.index)));
        var ad = U.emojiIkon(x[0]);
        if (ad) f.appendChild(U.ikon(ad)); else { var sp = document.createElement('span'); sp.className = 'hemo'; sp.textContent = x[0]; f.appendChild(sp); }
        son = x.index + x[0].length;
      }
      if (son < m.length) f.appendChild(document.createTextNode(m.slice(son)));
      if (n.parentNode) n.parentNode.replaceChild(f, n);
    });
  }
  var bekleyen = [], zm = 0;
  function kuyruk(n) { bekleyen.push(n); if (!zm) zm = requestAnimationFrame(function () { zm = 0; var l = bekleyen; bekleyen = []; l.forEach(function (x) { if (x.isConnected) try { isle(x.nodeType === 3 ? x.parentNode : x); } catch (e) {} }); }); }
  var mo = new MutationObserver(function (ml) { ml.forEach(function (m) { if (m.type === 'characterData') kuyruk(m.target); else m.addedNodes.forEach(function (n) { if (n.nodeType === 1 || n.nodeType === 3) kuyruk(n); }); }); });
  function basla() { isle(document.body); mo.observe(document.body, { childList: true, subtree: true, characterData: true }); }
  if (document.body) basla(); else document.addEventListener('DOMContentLoaded', basla);
})();
