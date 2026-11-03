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
  function ac(u) { try { var r = K.uygulamaBaslat(u.paket, u.sinif || ''); if (r !== 'ok') U.toast('Açılamadı: ' + r); } catch (e) { U.toast('Açılamadı'); } }
  function favoriler() { return Depo.oku('anaEkran').then(function (v) { return (v && v.favori) || []; }); }
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
    '.ae-kur p{margin:0;flex:1;font-size:13.5px;color:#d6f7f1}'
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
    sayfa.appendChild(el('div', { class: 'ae-ust' }, [ara, yen]));
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
      if (!q) izgara('FAVORİLER', l.filter(function (u) { return F.indexOf(u.paket) >= 0; }));
      izgara(q ? 'SONUÇLAR' : 'TÜMÜ', l);
    }
    function yukle(z) { Promise.all([U.uygulamalar(z), favoriler()]).then(function (r) { L = r[0]; F = r[1]; ciz(); }, function (e) { kap.innerHTML = ''; kap.appendChild(el('p', { class: 'hata-metni', text: e.message })); }); }
    ara.addEventListener('input', ciz); yen.addEventListener('click', function () { yukle(true); });
    yukle(false);
  };
  U.SEKMELER.push({ id: 'uygulamalar', ad: 'Uygulamalar', ikon: '▦' });
  if (U.sekmeleriCiz) try { U.sekmeleriCiz(); } catch (e) {}

  // ana panoda favori uygulamalar
  function panoPaneli() {
    if (!VAR) return; var sag = document.querySelector('.jv-pano .jv-sag'); if (!sag || sag.querySelector('.ae-pano')) return;
    var p = el('div', { class: 'jv-panel ae-pano' }, [el('h3', { text: 'UYGULAMALAR' })]), ic = el('div'); p.appendChild(ic); sag.appendChild(p);
    Promise.all([U.uygulamalar(false), favoriler()]).then(function (r) {
      var L = r[0], F = r[1], l = L.filter(function (u) { return F.indexOf(u.paket) >= 0; }).slice(0, 7);
      var g = el('div', { class: 'ae-mini' });
      l.forEach(function (u) { g.appendChild(el('button', { type: 'button', title: u.ad, onclick: function () { ac(u); } }, [u.ikon ? el('img', { src: u.ikon, alt: '' }) : u.ad.charAt(0), u.ad.slice(0, 9)])); });
      g.appendChild(el('button', { type: 'button', onclick: function () { location.hash = '#uygulamalar'; } }, [el('span', { style: 'font-size:22px;line-height:34px', text: '▦' }), 'TÜMÜ']));
      ic.appendChild(g);
      if (!l.length) ic.appendChild(el('div', { class: 'jv-kucuk', text: 'Uygulamalar ekranında uzun bas: favori ekle' }));
      var kur = kurKutusu(); if (kur) { kur.style.marginTop = '8px'; ic.appendChild(kur); }
    }).catch(function () { p.remove(); });
  }
  var eskiKut = U.GORUNUMLER.kutuphane;
  U.GORUNUMLER.kutuphane = function () { eskiKut.apply(this, arguments); setTimeout(panoPaneli, 500); setTimeout(panoPaneli, 1600); };
  setTimeout(panoPaneli, 1600);
})();
