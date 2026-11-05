/* 1001 — Akışkan hologram katmanı (kullanıcı, 2026-11-03: "uygulama aşırı rijit; holograflar su gibidir", "üstteki tabları
   güzelleştir, çok rijit", "sağ alttaki carvis mikrofonu ve pomodoro tuşunun yerleşimi çok kötü", "çevirmeli şeyler olsun, olay
   benim kullanımımı kolaylaştırmak", "zamanım yok pencerelerinde paragrafın üstüne tıklayıp kenara ayırabilsek, yapay zekâya soru
   sorabilsek, yan tarafta lab'dan molekülü göstersin").
   1) Yumuşak, cam gibi paneller; yüzeyde yavaş süzülen ışık; sayfa geçişlerinde bulanıktan netleşme.
   2) Sekmeler: hap biçimli, aktif sekmenin altında akarak kayan ışık.
   3) Komut kapsülü: altta ortada tek kapsül — solda pomodoro, ortada Carvis küresi, sağda müzik mini çalar.
   4) Kaydırma: ekranı yatay kaydırınca önceki/sonraki bölüm (MERKEZ ⇄ OKU ⇄ ÇALIŞ ⇄ LAB ⇄ MÜZİK).
   5) Yapay zekâ metinlerinde paragrafa dokun → ⧉ Ayır (yüzen pencere) · ❓ Sor (o paragrafa soru) · ⬡ 3B (geçen molekül). */
(function () {
  'use strict';
  if (/[?&]gomulu\b/.test(location.search)) { var g = document.createElement('style'); g.textContent = '#saatCip,.sp-mini,.ak-kapsul,.jv-altyazi,.jv-buyuk{display:none!important}'; document.head.appendChild(g); return; }
  var U = window.Uygulama; if (!U) return;
  var el = U.el, $ = U.$, $$ = U.$$;

  var st = document.createElement('style');
  st.textContent = [
    /* 1) akışkan paneller — köşe kesikleri yerine yumuşak cam */
    '.kitap-kart,.tarih-kart,.analiz-kutu,.metin-kart,.sp-kutu,.oncelik-satir,.an-oneri,.jv-panel,.dp-is-kart,.dp-bolum,.yan-panel,.tt-kutu,.yp-cevap,.mk-kart,.cv-balon.jv-balon,.jv-ay-ic,#ana .sayfa > .kahraman{clip-path:none!important;border-radius:18px!important}',
    '.dugme,.cip,.jv-yuva button,.jv-balon button[data-jv]{clip-path:none!important;border-radius:999px!important}',
    '.kitap-kart,.tarih-kart,.analiz-kutu,.metin-kart,.sp-kutu,.jv-panel,.dp-is-kart,.dp-bolum,.tt-kutu,.mk-kart{border-color:rgba(94,240,220,.22)!important;background:linear-gradient(160deg,rgba(18,60,72,.42),rgba(4,18,26,.55) 55%,rgba(10,40,56,.42))!important;backdrop-filter:blur(12px) saturate(1.2);-webkit-backdrop-filter:blur(12px) saturate(1.2);overflow:hidden}',
    '.kitap-kart::after,.analiz-kutu::after,.sp-kutu::after,.jv-panel::after,.dp-is-kart::after,.tt-kutu::after,.mk-kart::after{content:"";position:absolute;inset:-40% -60%;pointer-events:none;background:linear-gradient(115deg,transparent 42%,rgba(150,255,240,.07) 50%,transparent 58%);animation:akIsik 9s ease-in-out infinite;z-index:0}',
    '@keyframes akIsik{0%{transform:translateX(-30%)}55%,100%{transform:translateX(30%)}}',
    '.kitap-kart::before,.tarih-kart::before,.analiz-kutu::before,.metin-kart::before,.sp-kutu::before,.jv-panel::before{width:auto!important;left:18px!important;right:18px!important;height:1px!important;background:linear-gradient(90deg,transparent,rgba(94,240,220,.7),transparent)!important;box-shadow:none!important}',
    '.jv-sol,.jv-sag{animation:akYuz 8s ease-in-out infinite!important}',
    '@keyframes akYuz{0%,100%{translate:0 0;filter:brightness(1)}50%{translate:0 -6px;filter:brightness(1.08)}}',
    '#ana.hud-belir > *{animation:akBelir .6s cubic-bezier(.2,.8,.2,1) both!important}',
    '@keyframes akBelir{from{opacity:0;filter:blur(8px);transform:translateY(10px) scale(.985)}to{opacity:1;filter:none;transform:none}}',
    /* 2) sekmeler */
    '.hud-nav{position:relative;gap:2px!important;padding:4px;border-radius:999px;background:rgba(6,24,32,.45);border:1px solid rgba(94,240,220,.14);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px)}',
    '.hud-grup{border:0!important;background:transparent!important;clip-path:none!important;border-radius:999px!important;box-shadow:none!important;height:34px!important;z-index:1;transition:color .35s,text-shadow .35s}',
    '.hud-grup::before,.hud-grup::after{display:none!important}',
    '.hud-grup[aria-current="true"],.hud-grup[aria-expanded="true"]{color:#eafffb!important;text-shadow:0 0 12px rgba(94,240,220,.9)}',
    '.hud-grup[aria-current="true"] .k,.hud-grup[aria-current="true"] .i{color:inherit!important;text-shadow:inherit!important}',
    '.ak-isik{position:absolute;top:4px;height:calc(100% - 8px);border-radius:999px;pointer-events:none;z-index:0;background:radial-gradient(120% 140% at 50% 120%,rgba(94,240,220,.55),rgba(70,200,255,.18) 55%,transparent 75%);box-shadow:0 0 18px rgba(94,240,220,.35),inset 0 0 0 1px rgba(150,255,240,.35);transition:left .55s cubic-bezier(.3,1.4,.4,1),width .55s cubic-bezier(.3,1.4,.4,1),opacity .3s}',
    /* 3) komut kapsülü */
    '.ak-kapsul{position:fixed;left:50%;bottom:calc(12px + env(safe-area-inset-bottom,0px));transform:translateX(-50%);z-index:62;display:flex;align-items:center;gap:10px;padding:6px 10px;border-radius:999px;background:linear-gradient(180deg,rgba(10,40,48,.62),rgba(3,14,20,.78));border:1px solid rgba(94,240,220,.28);backdrop-filter:blur(16px) saturate(1.3);-webkit-backdrop-filter:blur(16px) saturate(1.3);box-shadow:0 10px 40px rgba(0,0,0,.45),0 0 30px rgba(94,240,220,.12);transition:transform .45s cubic-bezier(.2,.9,.2,1.1),opacity .35s}',
    '.ak-kapsul.saklan{transform:translate(-50%,calc(100% + 24px));opacity:0}',
    '.ak-kapsul #carvisDug{position:relative!important;right:auto!important;bottom:auto!important;left:auto!important;margin:-18px 4px;width:68px!important;height:68px!important;flex:none}',
    '.ak-kapsul #saatCip{position:relative!important;left:auto!important;bottom:auto!important;right:auto!important;border-radius:999px!important;background:rgba(94,240,220,.08)!important;border:1px solid rgba(94,240,220,.3)!important;color:#d9fbf6!important;height:38px;flex:none}',
    '.ak-kapsul .sp-mini{position:relative!important;left:auto!important;bottom:auto!important;transform:none!important;border-radius:999px!important;max-width:min(40vw,300px)}',
    '.ak-kapsul .ak-bos{width:38px;height:38px;flex:none}',
    '.cv-balon{bottom:calc(96px + env(safe-area-inset-bottom,0px))!important;right:50%!important;transform:translateX(50%);transform-origin:50% 100%;animation:akBalon .4s cubic-bezier(.2,.9,.2,1.1)}',
    '@keyframes akBalon{from{opacity:0;transform:translateX(50%) translateY(20px) scale(.92);filter:blur(6px)}to{opacity:1;transform:translateX(50%);filter:none}}',
    '.jv-buyuk{bottom:calc(92px + env(safe-area-inset-bottom,0px))!important}',
    '.jv-altyazi{bottom:calc(min(46vmin,340px) + 96px + env(safe-area-inset-bottom,0px))!important}',
    'body.jv-merkez .jv-altyazi{bottom:calc(100px + env(safe-area-inset-bottom,0px))!important}',
    '#ana{padding-bottom:110px}',
    /* 4) kaydırma ipucu */
    '.ak-kaydir{position:fixed;top:50%;z-index:70;width:54px;height:120px;margin-top:-60px;pointer-events:none;opacity:0;transition:opacity .2s;background:radial-gradient(60% 50% at 0 50%,rgba(94,240,220,.45),transparent 70%)}',
    '.ak-kaydir.sag{right:0;transform:scaleX(-1)}.ak-kaydir.sol{left:0}',
    /* 5) paragraf eylemleri */
    '.ai-metin p,.ai-metin li{border-radius:10px;transition:background .25s,box-shadow .25s;cursor:pointer}',
    '.ai-metin p:hover,.ai-metin li:hover{background:rgba(94,240,220,.06)}',
    '.ai-metin .ak-sec{background:rgba(94,240,220,.12)!important;box-shadow:inset 3px 0 0 #5ef0dc}',
    '.ak-eylem{position:fixed;z-index:100000;display:flex;gap:4px;padding:5px;border-radius:999px;background:rgba(4,20,26,.92);border:1px solid rgba(94,240,220,.4);box-shadow:0 8px 30px rgba(0,0,0,.5),0 0 18px rgba(94,240,220,.25);animation:akBelir .25s ease-out}',
    '.ak-eylem button{border:0;background:transparent;color:#bff8ef;font:600 11px/1 var(--f-kod,monospace);letter-spacing:.1em;padding:8px 11px;border-radius:999px}',
    '.ak-eylem button:hover,.ak-eylem button:focus-visible{background:rgba(94,240,220,.18);color:#fff}',
    '.ak-sor{margin:6px 0 10px;display:grid;gap:6px}',
    '.ak-sor form{display:flex;gap:6px}.ak-sor input{flex:1;min-width:0;border-radius:999px;border:1px solid rgba(94,240,220,.35);background:rgba(2,12,16,.8);color:#e6fffb;padding:7px 12px;font:13px var(--f-govde,system-ui)}',
    '.ak-sahne{flex:1;width:100%;min-height:320px;border:0;background:#030b10;border-radius:12px}',
    '.hp-govde:has(.ak-sahne){display:flex;flex-direction:column}',
    '@media (prefers-reduced-motion: reduce){.kitap-kart::after,.analiz-kutu::after,.sp-kutu::after,.jv-panel::after,.dp-is-kart::after,.tt-kutu::after,.mk-kart::after{animation:none;display:none}.ak-isik{transition:none}}',
    'body.fx-okuma .kitap-kart::after,body.fx-okuma .tt-kutu::after{display:none}'
  ].join('\n');
  document.head.appendChild(st);

  /* ---------- 2) sekme ışığı ---------- */
  var isik = null;
  function isikCiz() {
    var nav = $('.hud-nav'); if (!nav) return;
    if (!isik || !nav.contains(isik)) { isik = el('i', { class: 'ak-isik', 'aria-hidden': 'true' }); nav.insertBefore(isik, nav.firstChild); }
    var a = nav.querySelector('.hud-grup[aria-current="true"]');
    if (!a) { isik.style.opacity = '0'; return; }
    isik.style.opacity = '1'; isik.style.left = a.offsetLeft + 'px'; isik.style.width = a.offsetWidth + 'px';
  }
  window.addEventListener('hashchange', function () { setTimeout(isikCiz, 80); setTimeout(isikCiz, 400); });
  window.addEventListener('resize', isikCiz);
  setTimeout(isikCiz, 600); setInterval(isikCiz, 2500);

  /* ---------- 3) komut kapsülü ---------- */
  var kapsul = el('div', { class: 'ak-kapsul', role: 'toolbar', 'aria-label': 'Carvis ve zamanlayıcı' });
  var solYer = el('div', { class: 'ak-bos' }), ortaYer = el('div', { class: 'ak-bos' }), sagYer = el('div', { class: 'ak-bos' });
  kapsul.appendChild(solYer); kapsul.appendChild(ortaYer); kapsul.appendChild(sagYer);
  document.body.appendChild(kapsul);
  function tasi() {
    var s = document.getElementById('saatCip'), c = document.getElementById('carvisDug'), m = document.querySelector('.sp-mini');
    if (s && s.parentNode !== kapsul) kapsul.replaceChild(s, solYer.parentNode === kapsul ? solYer : kapsul.children[0]);
    if (c && c.parentNode !== kapsul) { if (ortaYer.parentNode === kapsul) kapsul.replaceChild(c, ortaYer); else kapsul.insertBefore(c, kapsul.children[1] || null); }
    if (m && m.parentNode !== kapsul) { if (sagYer.parentNode === kapsul) kapsul.replaceChild(m, sagYer); else kapsul.appendChild(m); }
  }
  setInterval(tasi, 1600); setTimeout(tasi, 200);
  // aşağı kaydırırken saklan, yukarı kaydırırken ya da durunca görün
  var sonY = 0, zm = null;
  window.addEventListener('scroll', function () {
    var y = window.scrollY; if (Math.abs(y - sonY) < 6) return;
    kapsul.classList.toggle('saklan', y > sonY && y > 200 && !(window.Carvis && window.Carvis.acik)); sonY = y;
    clearTimeout(zm); zm = setTimeout(function () { kapsul.classList.remove('saklan'); }, 1600);
  }, { passive: true });

  /* ---------- 4) yatay kaydırma ile bölüm değiştir ---------- */
  var BOLUMLER = ['kutuphane', 'oku', 'ders', 'lab-molekul', 'muzik'];
  function bolumIdx() {
    var h = location.hash.slice(1) || 'kutuphane';
    if (/^oku/.test(h)) return 1; if (/^(ders|koc|plan|kartlar|test|tahmin|saray)/.test(h)) return 2; if (/^(lab|zaman)/.test(h)) return 3; if (/^muzik/.test(h)) return 4; return 0;
  }
  function git(i) {
    var h = BOLUMLER[i]; if (h === 'oku') { var D = U.Durum || {}; if (!D.kitapId) return false; h = U.okuHash(D.kitapId, D.bolumSira || 0); }
    location.hash = h; return true;
  }
  var ipSol = el('div', { class: 'ak-kaydir sol', 'aria-hidden': 'true' }), ipSag = el('div', { class: 'ak-kaydir sag', 'aria-hidden': 'true' });
  document.body.appendChild(ipSol); document.body.appendChild(ipSag);
  var bas = null;
  function engel(t) {
    for (var n = t; n && n !== document.body; n = n.parentNode) {
      if (n.nodeType !== 1) continue;
      if (/^(INPUT|TEXTAREA|SELECT|CANVAS|IFRAME|VIDEO)$/.test(n.tagName) || n.isContentEditable) return true;
      if (n.classList && (n.classList.contains('hp') || n.classList.contains('cv-balon') || n.classList.contains('yan-panel') || n.classList.contains('lab-sahne') || n.classList.contains('ak-kapsul'))) return true;
      if (n.scrollWidth > n.clientWidth + 8) { var ox = getComputedStyle(n).overflowX; if (ox === 'auto' || ox === 'scroll') return true; }
    }
    return false;
  }
  document.addEventListener('touchstart', function (e) {
    if (e.touches.length !== 1 || document.body.classList.contains('fx-okuma') || engel(e.target)) { bas = null; return; }
    bas = { x: e.touches[0].clientX, y: e.touches[0].clientY, t: Date.now() };
  }, { passive: true });
  document.addEventListener('touchmove', function (e) {
    if (!bas) return; var dx = e.touches[0].clientX - bas.x, dy = e.touches[0].clientY - bas.y;
    if (Math.abs(dy) > Math.abs(dx)) { ipSol.style.opacity = ipSag.style.opacity = '0'; return; }
    var o = Math.min(1, Math.abs(dx) / 140); (dx > 0 ? ipSol : ipSag).style.opacity = String(o); (dx > 0 ? ipSag : ipSol).style.opacity = '0';
  }, { passive: true });
  document.addEventListener('touchend', function (e) {
    ipSol.style.opacity = ipSag.style.opacity = '0';
    if (!bas) return; var t = e.changedTouches[0], dx = t.clientX - bas.x, dy = t.clientY - bas.y, dt = Date.now() - bas.t; bas = null;
    if (Math.abs(dx) < 110 || Math.abs(dy) > Math.abs(dx) * 0.55 || dt > 700) return;
    var i = bolumIdx(), j = dx < 0 ? i + 1 : i - 1;
    while (j >= 0 && j < BOLUMLER.length && !git(j)) j += dx < 0 ? 1 : -1;
  }, { passive: true });

  /* ---------- 5) paragraf eylemleri (Zamanım yok ve tüm yapay zekâ metinleri) ---------- */
  var MOL = null;
  function molKatalog() { if (!MOL) MOL = fetch('lab/molekul/katalog.json').then(function (r) { return r.json(); }).then(function (d) { return (Array.isArray(d) ? d : d.molekuller || []); }).catch(function () { return []; }); return MOL; }
  function katla(s) { return String(s || '').toLocaleLowerCase('tr').replace(/[^\p{L}\p{N} ]/gu, ' '); }
  function molBul(metin) {
    var t = ' ' + katla(metin) + ' ';
    return molKatalog().then(function (l) {
      return l.filter(function (m) { var adlar = [m.kavram, String(m.ad || '').split('(')[0], m.id].map(katla).filter(function (x) { return x && x.trim().length >= 3; }); return adlar.some(function (a) { return t.indexOf(' ' + a.trim()) >= 0; }); });
    });
  }
  var eylem = null, secilen = null;
  function eylemKapat() { if (eylem) eylem.remove(); eylem = null; if (secilen) secilen.classList.remove('ak-sec'); secilen = null; }
  function bolumAdi(p) { var y = p.closest('.yan-panel, .hp, .dp-bolum'); var h = y && y.querySelector('h2, .hp-baslik b, .dp-bolum-ust b'); return h ? h.textContent : ''; }
  function ayir(p) {
    if (!window.HoloPencere) return;
    var kopya = p.cloneNode(true); kopya.classList.remove('ak-sec');
    var r = p.getBoundingClientRect();
    window.HoloPencere.ac({ baslik: (p.textContent || '').trim().slice(0, 42) + '…', alt: 'Ayrılan not · ' + bolumAdi(p).slice(0, 30), dugumler: [el('div', { class: 'ai-metin', style: 'padding:12px 14px;font-size:15px;line-height:1.6' }, [kopya])], x: Math.max(12, innerWidth - 400), y: Math.max(80, r.top - 40), w: 360, h: 260 });
  }
  /* ---- 3B yedeği: kütüphanede molekül yoksa kemik (anatomi kataloğu), o da yoksa Vikipedi görseli ---- */
  var GORSEL_IPUCU = '\nGÖRSEL: Anlatımı gösteren bir Vikipedi görseli işe yarayacaksa cevabın EN SON satırına yalnız şunu yaz: [gorsel: Vikipedi madde adı] (ör. [gorsel: Ki-kare dağılımı]). Görsel gerekmiyorsa bu satırı hiç yazma.';
  var ANAT = null;
  function anatomiKatalog() {
    if (!ANAT) ANAT = fetch('lab/anatomi/katalog.json').then(function (r) { return r.json(); })
      .then(function (d) { return Array.isArray(d) ? d : (d.parcalar || d.kemikler || []); }).catch(function () { return []; });
    return ANAT;
  }
  function anatomiBul(metin) {
    var t = ' ' + katla(metin) + ' ';
    return anatomiKatalog().then(function (l) {
      return l.filter(function (x) {
        return [x.la, x.tr].map(katla).some(function (a) { a = a.trim(); return a.length >= 5 && t.indexOf(' ' + a + ' ') >= 0; });
      })[0] || null;
    });
  }
  function anatomiAc(x) {
    var f = el('iframe', { class: 'ak-sahne', src: 'index.html?gomulu#lab-anatomi-' + x.id, title: '3B: ' + (x.tr || x.la), allow: 'fullscreen' });
    if (window.HoloPencere) window.HoloPencere.ac({ baslik: x.tr || x.la, alt: '3B kemik · ' + (x.la || ''), dugumler: [el('div', { style: 'height:calc(100% - 4px);min-height:330px;padding:6px;display:flex' }, [f])], x: Math.max(12, innerWidth - 470), y: 90, w: 450, h: 440 });
  }
  function paragrafTerimi(p) {
    var s = p.querySelector('strong, b'), t = s ? (s.textContent || '').trim() : '';
    if (t.length < 3) t = bolumAdi(p).replace(/^\s*[\d.]+\s*/, '').split(':')[0].trim();
    if (t.length < 3) t = (p.textContent || '').trim().split(/\s+/).slice(0, 3).join(' ');
    return t.replace(/[:.!?…]+$/, '').slice(0, 60);
  }
  function vikipediGoster(p) {
    var terim = paragrafTerimi(p);
    if (!window.Vikipedi) return U.toast('Görsel modülü yüklenmedi.');
    U.toast('Vikipedi\'de "' + terim + '" aranıyor…');
    return Vikipedi.gorselBul(terim).then(function (s) {
      if (!s) return U.toast('Vikipedi\'de "' + terim + '" için görsel bulamadım.');
      if (window.HoloPencere) window.HoloPencere.ac({ baslik: s.baslik, alt: 'Vikipedi görseli · ' + terim.slice(0, 30), dugumler: [Vikipedi.kart(s)], x: Math.max(12, innerWidth - 470), y: 90, w: Math.min(450, innerWidth - 24), h: 420 });
    });
  }
  // Cevap bittiğinde: [gorsel: ...] satırını gizle, madde görselini cevabın üstüne koy
  function gorselEkle(c, metin) {
    c.querySelectorAll('.vk-gorsel, .vk-yok').forEach(function (x) { x.remove(); });
    c.querySelectorAll('.ai-metin p').forEach(function (q) { if (/^\s*\[gorsel:/i.test(q.textContent || '')) q.remove(); });
    var m = /\[gorsel:\s*([^\]\n]{2,80})\]/i.exec(metin || '');
    if (!m || !window.Vikipedi) return;
    var terim = m[1].trim();
    Vikipedi.gorselBul(terim).then(function (s) {
      if (!c.isConnected) return;
      c.querySelectorAll('.vk-gorsel, .vk-yok').forEach(function (x) { x.remove(); });
      c.insertBefore(s ? Vikipedi.kart(s) : el('p', { class: 'var-etiket vk-yok', text: 'Vikipedi\'de "' + terim + '" için görsel bulamadım.' }), c.firstChild);
    });
  }
  function sor(p) {
    var var0 = p.nextElementSibling; if (var0 && var0.classList && var0.classList.contains('ak-sor')) { var0.querySelector('input').focus(); return; }
    var girdi = el('input', { type: 'text', placeholder: 'Bu kısımla ilgili sor: "neden?", "örnek ver", "sınavda nasıl gelir?"…', 'aria-label': 'Paragrafa soru' });
    var cevap = el('div');
    var kutu = el('div', { class: 'ak-sor' }, [el('form', { onsubmit: function (e) { e.preventDefault(); var q = girdi.value.trim(); if (!q) return; girdi.value = '';
      var c = el('div', { class: 'yp-cevap' }); cevap.appendChild(c);
      U.cevapCalistir(c, 'paragrafSor|' + (p.textContent || '').slice(0, 80) + '|' + q, function () {
        return 'Bir tıp öğrencisi çalışırken şu metin parçasına takıldı ve soruyor. Kısa, net, sınav odaklı cevap ver (en fazla 140 kelime, Türkçe). Gerekirse mekanizmayı ve ayırt edici noktayı söyle; uydurma, emin değilsen söyle.\nKONU: ' + bolumAdi(p) + '\nPARÇA: """' + (p.textContent || '').trim().slice(0, 1500) + '"""\nSORU: ' + q + GORSEL_IPUCU;
      }, { eylem: 'paragrafSor', sonra: function (metin) { gorselEkle(c, metin); } });
    } }, [girdi, el('button', { class: 'dugme kucuk ana', type: 'submit' }, ['Sor'])]), cevap]);
    p.after(kutu); girdi.focus();
  }
  function uc(p) {
    molBul((p.textContent || '') + ' ' + bolumAdi(p)).then(function (l) {
      if (!l.length) return anatomiBul(p.textContent || '').then(function (a) { return a ? anatomiAc(a) : vikipediGoster(p); });
      l.slice(0, 1).forEach(function (m) {
        var f = el('iframe', { class: 'ak-sahne', src: 'index.html?gomulu#lab-molekul-' + m.id, title: '3B: ' + m.ad, allow: 'fullscreen' });
        if (window.HoloPencere) window.HoloPencere.ac({ baslik: m.ad, alt: '3B molekül · ' + (m.tur || ''), dugumler: [el('div', { style: 'height:calc(100% - 4px);min-height:330px;padding:6px;display:flex' }, [f])], x: Math.max(12, innerWidth - 470), y: 90, w: 450, h: 440 });
      });
      if (l.length > 1) U.toast('Bu paragrafta ayrıca: ' + l.slice(1, 4).map(function (m) { return m.ad.split('(')[0]; }).join(', '));
    });
  }
  document.addEventListener('click', function (e) {
    if (eylem && eylem.contains(e.target)) return;
    var p = e.target.closest && e.target.closest('.ai-metin p, .ai-metin li');
    if (!p || e.target.closest('a, button, input, textarea, .ak-sor')) { eylemKapat(); return; }
    var yuzen = !!p.closest('.hp'); // kullanıcı, 2026-11-04: yüzen pencerelerde de metne dokunup soru sorabilmeli / 3B açabilmeli
    if (secilen === p) { eylemKapat(); return; }
    eylemKapat(); secilen = p; p.classList.add('ak-sec');
    var r = p.getBoundingClientRect();
    eylem = el('div', { class: 'ak-eylem', role: 'toolbar', 'aria-label': 'Paragraf' }, [
      yuzen ? '' : el('button', { type: 'button', onclick: function () { ayir(p); eylemKapat(); } }, ['⧉ AYIR']),
      el('button', { type: 'button', onclick: function () { sor(p); eylemKapat(); } }, ['❓ SOR']),
      el('button', { type: 'button', onclick: function () { uc(p); eylemKapat(); } }, ['⬡ 3B'])]);
    document.body.appendChild(eylem);
    var x = Math.min(innerWidth - 250, Math.max(8, r.left + 12)), y = r.top - 46 < 70 ? r.bottom + 6 : r.top - 46;
    eylem.style.left = x + 'px'; eylem.style.top = y + 'px';
  });
  window.addEventListener('scroll', eylemKapat, { passive: true, capture: true });
})();
