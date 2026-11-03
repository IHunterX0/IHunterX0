/* 1001 — Holografik HUD katmanı (kullanıcı: "dizaynı Jarvis gibi yapmak istiyorum, holografik olsun").
   - Üst menü: 17 etiketsiz ikon yerine 5 etiketli grup (MERKEZ · OKU · ÇALIŞ · LAB · ARŞİV); grup seçilince
     ekrana yansıtılan holografik menü açılır. Asıl sekme düğmeleri gizli durur, yönlendirme onlara tıklanarak yapılır.
   - Ekran köşelerinde HUD çerçevesi; üst çubukta canlı telemetri (saat, pil, Carvis durumu).
   - Kartlar ve paneller holografik cam: tarama çizgileri, kenar ışığı, kesik köşe, ekrana "yansıtılarak" belirme.
   - Carvis düğmesi ark reaktörü gibi dönen halkalar.
   Okuma görünümünde (body.fx-okuma) hareket yok, metin sade kalır. prefers-reduced-motion: animasyon yok. */
(function () {
  'use strict';
  var U = window.Uygulama; if (!U) return;
  if (/[?&]gomulu\b/.test(location.search)) return;
  var el = U.el, $ = U.$, $$ = U.$$;

  var GRUPLAR = [
    { id: 'merkez', ad: 'MERKEZ', kod: '01', ikon: '◉', sekmeler: ['kutuphane'] },
    { id: 'oku', ad: 'OKU', kod: '02', ikon: '❏', sekmeler: ['oku'] },
    { id: 'calis', ad: 'ÇALIŞ', kod: '03', ikon: '◈', sekmeler: ['reels', 'ders', 'koc', 'plan', 'kartlar', 'test', 'tahmin', 'saray'] },
    { id: 'lab', ad: 'LAB', kod: '04', ikon: '⬡', sekmeler: ['lab-hucre', 'lab-anatomi', 'lab-molekul', 'zaman'] },
    { id: 'muzik', ad: 'MÜZİK', kod: '05', ikon: '♫', sekmeler: ['muzik'] },
    { id: 'arsiv', ad: 'ARŞİV', kod: '06', ikon: '▤', sekmeler: [] } // geri kalan her şey
  ];
  var ACIKLAMA = {
    reels: '1 dakikalık hafıza sarayı videoları', ders: 'Tüm ders: özet, tuzak, test, program', koc: 'Bugün ne yapayım', plan: 'Haftalık program', kartlar: 'Aralıklı tekrar', test: 'Soru çöz', tahmin: 'Bu yıl ne çıkar',
    saray: 'Hafıza sarayları', 'lab-anatomi': 'İskelet ve kaslar', 'lab-molekul': '3B moleküller', 'lab-hareket': 'Hareket ve solunum', 'lab-hucre': 'Nöron, kas, ribozom, mitokondri…',
    zaman: 'Zaman çizelgesi', notlar: 'Notlarım', defter: 'Araştırma defteri', makaleler: 'Literatür takibi', calisma: 'Çalışma analizi',
    sohbet: 'Yazılı sohbet', ekle: 'Yeni kitap ekle'
  };
  function grubuBul(id) {
    for (var i = 0; i < GRUPLAR.length - 1; i++) if (GRUPLAR[i].sekmeler.indexOf(id) >= 0) return GRUPLAR[i];
    return GRUPLAR[GRUPLAR.length - 1];
  }

  /* ---------------- stil ---------------- */
  var css = document.createElement('style');
  css.textContent = [
    ':root{--holo:#5ee7ff;--holo-2:#2fb4ff;--holo-sicak:#ffb547;--holo-cam:rgba(8,26,40,.5);--holo-kenar:rgba(94,231,255,.38);--holo-isik:0 0 0 1px rgba(94,231,255,.28),0 0 24px rgba(47,180,255,.18),inset 0 0 22px rgba(94,231,255,.06);',
    '--holo-tarama:repeating-linear-gradient(0deg,rgba(94,231,255,.05) 0 1px,transparent 1px 3px);--kesik:polygon(12px 0,100% 0,100% calc(100% - 12px),calc(100% - 12px) 100%,0 100%,0 12px)}',

    // --- üst çubuk: gruplu menü + telemetri
    '#sekmeler{display:none!important}',
    '.hud-nav{display:flex;gap:6px;flex:1;min-width:0;margin-left:10px;align-items:center}',
    '.hud-grup{position:relative;display:inline-flex;align-items:center;gap:8px;height:38px;padding:0 14px 0 10px;border:1px solid rgba(94,231,255,.22);background:linear-gradient(180deg,rgba(94,231,255,.08),rgba(94,231,255,.02));color:#bfefff;',
    'font:600 12.5px var(--f-baslik);letter-spacing:.16em;cursor:pointer;clip-path:polygon(8px 0,100% 0,100% calc(100% - 8px),calc(100% - 8px) 100%,0 100%,0 8px);transition:color .2s,background .2s,box-shadow .2s}',
    '.hud-grup .k{font:500 9.5px var(--f-kod);color:rgba(94,231,255,.55);letter-spacing:.05em}',
    '.hud-grup .i{color:var(--holo);font-size:13px;text-shadow:0 0 8px var(--holo)}',
    '.hud-grup:hover{color:#fff;background:linear-gradient(180deg,rgba(94,231,255,.18),rgba(94,231,255,.05))}',
    '.hud-grup[aria-current="true"]{color:#04121a;background:linear-gradient(180deg,#8ff3ff,#3fc8f0);border-color:#9ff6ff;box-shadow:0 0 22px rgba(94,231,255,.55)}',
    '.hud-grup[aria-current="true"] .k,.hud-grup[aria-current="true"] .i{color:#04121a;text-shadow:none}',
    '.hud-grup[aria-expanded="true"]{box-shadow:0 0 0 1px var(--holo),0 0 26px rgba(94,231,255,.5)}',
    '.hud-grup[hidden]{display:none}',
    '.hud-tel{display:flex;gap:12px;align-items:center;font:500 11px var(--f-kod);color:rgba(191,239,255,.75);letter-spacing:.08em;white-space:nowrap;margin-right:6px}',
    '.hud-tel b{color:var(--holo);font-weight:600}.hud-tel .nokta{width:7px;height:7px;border-radius:50%;background:#5fe0a0;box-shadow:0 0 8px #5fe0a0;display:inline-block;margin-right:5px;animation:hudNabiz 2s ease-in-out infinite}',
    '.hud-tel .nokta.uyku{background:var(--holo-sicak);box-shadow:0 0 8px var(--holo-sicak)}',
    '.hud-pil{display:inline-flex;align-items:center;gap:4px}.hud-pil i{display:inline-block;width:20px;height:9px;border:1px solid currentColor;border-radius:2px;position:relative}',
    '.hud-pil i::after{content:"";position:absolute;left:1px;top:1px;bottom:1px;width:calc((100% - 2px) * var(--p,1));background:var(--holo);box-shadow:0 0 6px var(--holo)}',
    '.hud-nav{overflow:hidden}.hud-grup{flex-shrink:0}',
    '@media (max-width:1440px){.hud-tel .uzun,.hud-tel .cv{display:none}.hud-grup .k{display:none}}',
    '@media (max-width:1100px){.hud-grup .k{display:none}.hud-tel .uzun{display:none}.logo small{display:none}}',
    '@media (max-width:900px){.hud-grup{padding:0 9px 0 7px;letter-spacing:.06em;gap:6px;font-size:12px}.hud-nav{gap:4px;margin-left:6px}.hud-tel{gap:8px}.hud-tel .cv,.hud-tel .hud-pil{display:none!important}.logo > span:last-child{display:none}}',
    '@media (max-width:640px){.hud-grup .ad{display:none}.hud-grup{padding:0 11px}.hud-tel{display:none}.logo > span:last-child{display:none}}',

    // --- holografik menü (gruba dokununca yansır)
    '.hud-menu{position:fixed;z-index:65;left:50%;top:calc(66px + env(safe-area-inset-top,0px));width:min(720px,calc(100vw - 24px));transform:translateX(-50%);padding:18px 18px 16px;',
    'background:var(--holo-tarama),radial-gradient(120% 140% at 50% 0%,rgba(47,180,255,.20),rgba(4,14,22,.88) 60%);border:1px solid var(--holo-kenar);box-shadow:var(--holo-isik),0 30px 80px rgba(0,0,0,.6);',
    'backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);clip-path:var(--kesik);transform-origin:50% 0}',
    '.hud-menu[hidden]{display:none}',
    '.hud-menu.yansit{animation:hudYansit .42s cubic-bezier(.2,.8,.2,1)}',
    '.hud-menu::before{content:"";position:absolute;left:0;right:0;top:0;height:2px;background:linear-gradient(90deg,transparent,var(--holo),transparent);box-shadow:0 0 14px var(--holo)}',
    '.hud-menu h3{margin:0 0 12px;font:600 11px var(--f-kod);letter-spacing:.3em;color:rgba(94,231,255,.8)}.hud-menu h3::before{content:"▸ ";color:var(--holo-sicak)}',
    '.hud-izgara{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:10px}',
    '.hud-oge{position:relative;display:grid;gap:4px;text-align:left;padding:14px 14px 12px;min-height:84px;color:#dff7ff;cursor:pointer;border:1px solid rgba(94,231,255,.25);',
    'background:linear-gradient(160deg,rgba(94,231,255,.12),rgba(94,231,255,.02) 60%);clip-path:polygon(10px 0,100% 0,100% calc(100% - 10px),calc(100% - 10px) 100%,0 100%,0 10px);',
    'transition:transform .2s,background .2s,box-shadow .2s;opacity:0;animation:hudOge .35s ease-out forwards}',
    '.hud-oge .i{font-size:22px;line-height:1;filter:drop-shadow(0 0 6px rgba(94,231,255,.7))}',
    '.hud-oge b{font:600 14px var(--f-baslik);letter-spacing:.06em}.hud-oge small{font:12px var(--f-baslik);color:rgba(191,239,255,.6)}',
    '.hud-oge:hover,.hud-oge:focus-visible{transform:translateY(-2px);background:linear-gradient(160deg,rgba(94,231,255,.26),rgba(94,231,255,.05) 60%);box-shadow:0 0 20px rgba(94,231,255,.3);outline:none}',
    '.hud-oge[aria-current="page"]{border-color:var(--holo);box-shadow:inset 0 0 0 1px var(--holo),0 0 18px rgba(94,231,255,.35)}',
    '.hud-oge .rozet{position:absolute;right:10px;top:10px}',
    '.hud-perde{position:fixed;inset:0;z-index:64;background:rgba(2,8,12,.35)}.hud-perde[hidden]{display:none}',

    // --- okuyucu: kutu filtreleri "Kutular" düğmesiyle açılır (CSS hidden'ı eziyordu, 10 çip her zaman görünüyordu)
    '.filtre-panel[hidden]{display:none!important}',
    '.arac-cubugu .ikon-dugme{display:inline-flex;align-items:center;justify-content:center;white-space:nowrap;gap:2px}',
    '.arac-cubugu{flex-wrap:nowrap!important;overflow-x:auto;scrollbar-width:none}.arac-cubugu::-webkit-scrollbar{display:none}.arac-cubugu > *{flex-shrink:0}.arac-cubugu .kitap-adi{flex-shrink:1}.arac-cubugu .seviye-sec{min-width:118px}',
    '.arac-cubugu{background:var(--holo-tarama),rgba(4,14,22,.9)!important;border-bottom-color:var(--holo-kenar)!important}',

    // --- holografik düğmeler ve çipler
    '.dugme,.ikon-dugme{border-color:rgba(94,231,255,.3)!important;background:linear-gradient(180deg,rgba(94,231,255,.10),rgba(94,231,255,.02))!important;color:#d9f6ff;clip-path:polygon(7px 0,100% 0,100% calc(100% - 7px),calc(100% - 7px) 100%,0 100%,0 7px);transition:box-shadow .2s,background .2s,color .2s}',
    '.dugme:hover,.ikon-dugme:hover{color:#fff;background:linear-gradient(180deg,rgba(94,231,255,.22),rgba(94,231,255,.05))!important;box-shadow:0 0 16px rgba(94,231,255,.3)}',
    '.dugme.ana{background:linear-gradient(180deg,#8ff3ff,#3fc8f0)!important;color:#04121a!important;border-color:#9ff6ff!important}',
    '.ikon-dugme.zy{color:var(--holo-sicak)!important;border-color:rgba(255,181,71,.45)!important;background:linear-gradient(180deg,rgba(255,181,71,.14),rgba(255,181,71,.03))!important}',
    '#carvisDug{clip-path:none!important}',
    '.cip{border-radius:2px!important;clip-path:polygon(6px 0,100% 0,100% calc(100% - 6px),calc(100% - 6px) 100%,0 100%,0 6px)}',

    // --- ekran köşesi çerçevesi
    '.hud-kose{position:fixed;z-index:3;width:34px;height:34px;pointer-events:none;border-color:rgba(94,231,255,.55);border-style:solid;border-width:0;filter:drop-shadow(0 0 4px rgba(94,231,255,.6))}',
    '.hud-kose.sol-ust{left:6px;top:calc(66px + env(safe-area-inset-top,0px));border-left-width:1.5px;border-top-width:1.5px}',
    '.hud-kose.sag-ust{right:6px;top:calc(66px + env(safe-area-inset-top,0px));border-right-width:1.5px;border-top-width:1.5px}',
    '.hud-kose.sol-alt{left:6px;bottom:6px;border-left-width:1.5px;border-bottom-width:1.5px}',
    '.hud-kose.sag-alt{right:6px;bottom:6px;border-right-width:1.5px;border-bottom-width:1.5px}',
    'body.fx-okuma .hud-kose{opacity:.35}',

    // --- holografik yüzeyler: kartlar, paneller
    '.kitap-kart,.plan-gun,.tt-kutu,.koc-is,.sr-kart,.hr-kutu,.sr-oda,.df-giris,.mz-kitap{clip-path:var(--kesik);box-shadow:var(--holo-isik)!important;border-color:var(--holo-kenar)!important}',
    '.kitap-kart::after,.koc-is::after,.sr-kart::after,.plan-gun::after{content:"";position:absolute;inset:0;pointer-events:none;background:var(--holo-tarama);mix-blend-mode:screen;opacity:.8}',
    '.kitap-kart,.koc-is,.sr-kart,.plan-gun{position:relative}',
    '.yan-panel{background:var(--holo-tarama),linear-gradient(180deg,rgba(8,30,46,.92),rgba(4,14,22,.95))!important;border-color:var(--holo-kenar)!important;box-shadow:-10px 0 50px rgba(0,0,0,.5),inset 1px 0 0 var(--holo),-1px 0 22px rgba(94,231,255,.25)!important}',
    '.yan-panel.acik .yp-govde{animation:hudBelir .5s ease-out}',
    '.yp-baslik{color:#eafcff;text-shadow:0 0 12px rgba(94,231,255,.45)}',
    '.kahraman h1{text-shadow:none;filter:drop-shadow(-1px 0 0 rgba(255,80,140,.25)) drop-shadow(1px 0 0 rgba(94,231,255,.45)) drop-shadow(0 0 16px rgba(94,231,255,.3))}',
    '#ana.hud-belir > *{animation:hudBelir .55s ease-out both}',
    '#ana.hud-belir > *:nth-child(2){animation-delay:.06s}#ana.hud-belir > *:nth-child(3){animation-delay:.12s}#ana.hud-belir > *:nth-child(4){animation-delay:.18s}',

    // --- Carvis düğmesi: ark reaktörü
    '#carvisDug{width:64px!important;height:64px!important;border:0!important;font-size:22px!important;color:#dffbff!important;',
    'background:radial-gradient(circle,#e8fdff 0 14%,#7fefff 15% 22%,rgba(10,40,58,.95) 23% 60%,rgba(94,231,255,.25) 61% 63%,rgba(6,16,24,.95) 64%)!important;',
    'box-shadow:0 0 0 1px rgba(94,231,255,.6),0 0 26px rgba(94,231,255,.45),inset 0 0 18px rgba(94,231,255,.4)!important;text-shadow:0 0 6px #fff}',
    '#carvisDug::before,#carvisDug::after{content:"";position:absolute;inset:-7px;border-radius:50%;border:1.5px dashed rgba(94,231,255,.6);animation:hudDon 9s linear infinite;pointer-events:none}',
    '#carvisDug::after{inset:-13px;border:1px solid transparent;border-top-color:var(--holo);border-bottom-color:var(--holo);animation-duration:5s;animation-direction:reverse}',
    '#carvisDug.acik{background:radial-gradient(circle,#fff 0 18%,#9ff6ff 19% 30%,#2fb4ff 31% 58%,rgba(94,231,255,.4) 59% 63%,rgba(6,16,24,.95) 64%)!important;color:#04121a!important}',
    '#carvisDug.acik::before{animation-duration:2.5s;border-color:#bff8ff}',

    // --- animasyonlar
    '@keyframes hudYansit{0%{opacity:0;transform:translateX(-50%) perspective(900px) rotateX(-12deg) scaleY(.03);filter:brightness(2.4)}55%{opacity:.85;transform:translateX(-50%) scaleY(1)}62%{opacity:.4}70%{opacity:.95}100%{opacity:1;transform:translateX(-50%);filter:none}}',
    '@keyframes hudBelir{0%{opacity:0;transform:translateY(6px);filter:brightness(1.8) blur(1px)}40%{opacity:.7}50%{opacity:.35}65%{opacity:.9}100%{opacity:1;transform:none;filter:none}}',
    '@keyframes hudOge{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}',
    '@keyframes hudDon{to{transform:rotate(360deg)}}',
    '@keyframes hudNabiz{50%{opacity:.35}}',
    'body.fx-okuma #ana.hud-belir > *{animation:none}',
    '@media (prefers-reduced-motion: reduce){.hud-menu.yansit,#ana.hud-belir > *,.hud-oge,.yan-panel.acik .yp-govde,#carvisDug::before,#carvisDug::after,.hud-tel .nokta{animation:none!important;opacity:1}}'
  ].join('\n');
  document.head.appendChild(css);

  /* ---------------- gruplu menü ---------------- */
  var eskiNav = $('#sekmeler');
  if (!eskiNav) return;
  var nav = el('nav', { class: 'hud-nav', 'aria-label': 'Ana menü' });
  eskiNav.after(nav);
  var menu = el('div', { class: 'hud-menu', hidden: true, role: 'menu' });
  var perde = el('div', { class: 'hud-perde', hidden: true });
  perde.addEventListener('click', menuKapat);
  document.body.appendChild(perde); document.body.appendChild(menu);
  var acikGrup = null;

  // Asıl (gizli) sekme düğmelerine kimlik ver: uygulama onları SEKMELER sırasıyla çizer, "oku" kitap açılmadıysa atlanır
  function sekmeler() {
    var Durum = U.Durum, l = U.SEKMELER.filter(function (s) { return !(s.id === 'oku' && !Durum.kitapId); });
    var d = $$('.sekme', eskiNav);
    return l.map(function (s, i) { return { s: s, d: d[i] }; }).filter(function (x) { return x.d; });
  }
  function git(x) { menuKapat(); x.d.click(); }
  function navCiz() {
    var l = sekmeler(), etkin = U.Durum.gorunum;
    var etkinGrup = grubuBul(etkin === 'oku' ? 'oku' : etkin).id;
    nav.innerHTML = '';
    GRUPLAR.forEach(function (g) {
      var uyeler = l.filter(function (x) { return grubuBul(x.s.id) === g; }).sort(function (a, b) {
        var i = g.sekmeler.indexOf(a.s.id), j = g.sekmeler.indexOf(b.s.id); return (i < 0 ? 99 : i) - (j < 0 ? 99 : j); });
      var b = el('button', { class: 'hud-grup', type: 'button', 'aria-current': String(g.id === etkinGrup), 'aria-expanded': String(acikGrup === g.id), title: g.ad,
        hidden: uyeler.length ? null : true,
        onclick: function () {
          if (uyeler.length === 1) return git(uyeler[0]);
          if (acikGrup === g.id) menuKapat(); else menuAc(g, uyeler);
        } }, [el('span', { class: 'k', text: g.kod }), el('span', { class: 'i', 'aria-hidden': 'true', text: g.ikon }), el('span', { class: 'ad', text: g.ad })]);
      nav.appendChild(b);
    });
  }
  function menuAc(g, uyeler) {
    acikGrup = g.id; menu.innerHTML = '';
    menu.appendChild(el('h3', { text: g.kod + ' // ' + g.ad }));
    var iz = el('div', { class: 'hud-izgara' });
    uyeler.forEach(function (x, i) {
      var o = el('button', { class: 'hud-oge', type: 'button', role: 'menuitem', 'aria-current': U.Durum.gorunum === x.s.id ? 'page' : null, style: 'animation-delay:' + (60 + i * 45) + 'ms', onclick: function () { git(x); } },
        [el('span', { class: 'i', 'aria-hidden': 'true', text: x.s.ikon }), el('b', { text: x.s.ad }), el('small', { text: ACIKLAMA[x.s.id] || '' }), x.s.rozet ? el('span', { class: 'rozet', text: x.s.rozet }) : null]);
      iz.appendChild(o);
    });
    menu.appendChild(iz);
    menu.hidden = false; perde.hidden = false;
    menu.classList.remove('yansit'); void menu.offsetWidth; menu.classList.add('yansit');
    navCiz();
    var ilk = $('.hud-oge', menu); if (ilk) ilk.focus({ preventScroll: true });
  }
  function menuKapat() { if (!acikGrup) return; acikGrup = null; menu.hidden = true; perde.hidden = true; navCiz(); }
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && acikGrup) { e.stopPropagation(); menuKapat(); } }, true);
  new MutationObserver(navCiz).observe(eskiNav, { childList: true });
  window.addEventListener('hashchange', function () { menuKapat(); setTimeout(navCiz, 0); });
  navCiz();

  /* ---------------- telemetri ---------------- */
  var saat = el('b'), tarih = el('span', { class: 'uzun' }), pilYazi = el('span'), pilI = el('i'), durumNokta = el('span', { class: 'nokta' }), durumYazi = el('span', { class: 'cv', text: 'C.A.R.V.I.S.' });
  var tel = el('div', { class: 'hud-tel', 'aria-hidden': 'true' }, [el('span', {}, [durumNokta, durumYazi]), el('span', { class: 'hud-pil', hidden: true }, [pilI, pilYazi]), tarih, saat]);
  var ara = $('#aramaAc'); if (ara) ara.before(tel);
  var GUN = ['PAZ', 'PZT', 'SAL', 'ÇAR', 'PER', 'CUM', 'CMT'];
  function iki(n) { return (n < 10 ? '0' : '') + n; }
  function saatCiz() { var d = new Date(); saat.textContent = iki(d.getHours()) + ':' + iki(d.getMinutes()); tarih.textContent = GUN[d.getDay()] + ' ' + iki(d.getDate()) + '.' + iki(d.getMonth() + 1); }
  saatCiz(); setInterval(saatCiz, 15000);
  if (navigator.getBattery) navigator.getBattery().then(function (b) {
    function ciz() { pilI.parentNode.hidden = false; pilI.style.setProperty('--p', String(b.level)); pilYazi.textContent = Math.round(b.level * 100) + '%' + (b.charging ? ' ⚡' : ''); }
    ciz(); b.addEventListener('levelchange', ciz); b.addEventListener('chargingchange', ciz);
  }).catch(function () {});
  // Carvis durumu: düğme açıkken "AKTİF", değilse hazır
  setInterval(function () {
    var c = window.Carvis, acik = !!(c && c.acik);
    durumYazi.textContent = acik ? (c.konusuyor ? 'KONUŞUYOR' : 'DİNLİYOR') : 'C.A.R.V.I.S.';
    durumNokta.classList.toggle('uyku', !acik);
  }, 1000);

  /* ---------------- köşe çerçevesi + sayfa belirme ---------------- */
  ['sol-ust', 'sag-ust', 'sol-alt', 'sag-alt'].forEach(function (k) { document.body.appendChild(el('div', { class: 'hud-kose ' + k, 'aria-hidden': 'true' })); });
  var ana = $('#ana');
  if (ana) window.addEventListener('hashchange', function () {
    ana.classList.remove('hud-belir'); void ana.offsetWidth; ana.classList.add('hud-belir');
  });
})();
