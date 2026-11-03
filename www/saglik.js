/* 1001 — Sağlık ve verim takibi (kullanıcı, 2026-11-03: "Carvis'e su içme, vitamin alma, verim vs. de yükleyebileyim").
   - #saglik: bugünkü su (bardak), vitaminler/takviyeler, verim (1-5), uyku (saat), kahve; 7 günlük grafik ve çalışma süresiyle ilişki.
   - Sesli/yazılı yerel komutlar (yapay zekâ kotası harcamaz): "su içtim", "2 bardak su içtim", "D vitamini aldım", "vitaminlerimi aldım",
     "verimim 4", "7 saat uyudum", "kahve içtim".
   - Hatırlatma: uygulama açıkken su (varsayılan 90 dk'da bir, 09-23 arası) ve günde bir vitamin hatırlatması; dokununca kaydeder.
   - Carvis aracı `saglik`: kaydet / özet (verim ile su-uyku-çalışma ilişkisi dahil). Ana sayfa panosunda SAĞLIK paneli. */
(function () {
  'use strict';
  if (/[?&]gomulu\b/.test(location.search)) return;
  var U = window.Uygulama; if (!U) return;
  var el = U.el, Depo = U.Depo;
  var VARSAYILAN = { suHedef: 8, vitaminler: ['D vitamini', 'B12', 'Omega-3', 'Demir'], hatirlat: true, suAralik: 90, vitaminSaat: 10 };
  function iki(n) { return ('0' + n).slice(-2); }
  function gunStr(d) { d = d || new Date(); return d.getFullYear() + '-' + iki(d.getMonth() + 1) + '-' + iki(d.getDate()); }
  function oku() { return Depo.oku('saglik').then(function (v) { v = v || {}; v.gunler = v.gunler || {}; v.ayar = Object.assign({}, VARSAYILAN, v.ayar || {}); return v; }); }
  function guncelle(fn) { return U.depoGuncelle('saglik', function (v) { v.gunler = v.gunler || {}; v.ayar = Object.assign({}, VARSAYILAN, v.ayar || {}); var g = v.gunler[gunStr()] = v.gunler[gunStr()] || { su: 0, vitamin: {}, kahve: 0 }; g.vitamin = g.vitamin || {}; fn(g, v); }, 100).then(function () { yenile(); }); }
  var dinleyiciler = [];
  function yenile() { dinleyiciler = dinleyiciler.filter(function (f) { try { return f() !== false; } catch (e) { return false; } }); }

  var Saglik = U.Saglik = {
    su: function (n) { n = n == null ? 1 : +n; var son; return guncelle(function (g) { g.su = Math.max(0, (g.su || 0) + n); g.sonSu = Date.now(); son = g.su; }).then(function () { return oku(); }).then(function (v) { return '💧 ' + son + '/' + v.ayar.suHedef + ' bardak.'; }); },
    vitamin: function (ad) {
      return oku().then(function (v) {
        var l = v.ayar.vitaminler, q = String(ad || '').toLocaleLowerCase('tr').replace(/\s*vitamini?(mi)?$/, '').trim();
        var hedef = ad ? l.filter(function (x) { var y = x.toLocaleLowerCase('tr'); return y === q || y.indexOf(q + ' ') === 0 || (q.length > 2 && y.indexOf(q) >= 0); }) : l;
        if (ad && !hedef.length) hedef = [String(ad)];
        return guncelle(function (g) { hedef.forEach(function (x) { g.vitamin[x] = Date.now(); }); }).then(function () { return '💊 Kaydedildi: ' + hedef.join(', ') + '.'; });
      });
    },
    verim: function (x) { x = Math.max(1, Math.min(5, Math.round(+x))); return guncelle(function (g) { g.verim = x; }).then(function () { return 'Verim ' + x + '/5 kaydedildi.'; }); },
    uyku: function (s) { s = Math.max(0, Math.min(16, +s)); return guncelle(function (g) { g.uyku = s; }).then(function () { return 'Uyku ' + s + ' saat kaydedildi.'; }); },
    kahve: function (n) { n = n == null ? 1 : +n; return guncelle(function (g) { g.kahve = Math.max(0, (g.kahve || 0) + n); }).then(function () { return 'Kahve kaydedildi.'; }); },
    ozet: function (gunSay) {
      gunSay = gunSay || 7;
      return Promise.all([oku(), Depo.oku('sure')]).then(function (r) {
        var v = r[0], sure = r[1] || {}, l = [];
        for (var i = gunSay - 1; i >= 0; i--) { var d = new Date(); d.setDate(d.getDate() - i); var k = gunStr(d), g = v.gunler[k] || {}, s = sure[k] || {}, dk = 0; Object.keys(s).forEach(function (x) { dk += s[x]; });
          l.push({ gun: k, su: g.su || 0, vitamin: Object.keys(g.vitamin || {}).length, verim: g.verim || null, uyku: g.uyku || null, kahve: g.kahve || 0, calisma_dk: Math.round(dk) }); }
        return { ayar: v.ayar, gunler: l, bugun: l[l.length - 1], iliski: iliski(l) };
      });
    }
  };
  // verimle basit ilişki: verim girilmiş günlerde su/uyku/çalışma ortalaması, iyi (≥4) ve kötü (≤2) günler karşılaştırması
  function iliski(l) {
    var iyi = l.filter(function (x) { return x.verim >= 4; }), kotu = l.filter(function (x) { return x.verim && x.verim <= 2; });
    function ort(a, k) { var b = a.filter(function (x) { return x[k] != null; }); return b.length ? Math.round(b.reduce(function (t, x) { return t + x[k]; }, 0) / b.length * 10) / 10 : null; }
    if (!iyi.length || !kotu.length) return 'Karşılaştırma için hem iyi (4-5) hem kötü (1-2) verimli günlere ihtiyaç var.';
    return 'Verimli günlerde ortalama su ' + ort(iyi, 'su') + ', uyku ' + ort(iyi, 'uyku') + ' sa, çalışma ' + ort(iyi, 'calisma_dk') + ' dk; verimsiz günlerde su ' + ort(kotu, 'su') + ', uyku ' + ort(kotu, 'uyku') + ' sa, çalışma ' + ort(kotu, 'calisma_dk') + ' dk (gün sayısı az, kesin değil).';
  }

  /* ---------- yerel komutlar (Carvis.saatKomut'a eklenir) ---------- */
  var SAYI = { bir: 1, iki: 2, üç: 3, uc: 3, dört: 4, dort: 4, beş: 5, bes: 5, altı: 6, alti: 6, yedi: 7, sekiz: 8, dokuz: 9, on: 10, yarım: 0.5 };
  function sayi(s) { if (s == null) return null; s = String(s).trim().toLocaleLowerCase('tr'); return /^\d+([.,]\d+)?$/.test(s) ? +s.replace(',', '.') : SAYI[s] != null ? SAYI[s] : null; }
  function komut(t) {
    var x = String(t || '').toLocaleLowerCase('tr').trim().replace(/[.!?]+$/, ''), m;
    if ((m = /^(?:(\d+|bir|iki|üç|dört|beş|altı|yedi|sekiz) )?(?:bardak |şişe )?su içtim$/.exec(x))) return Saglik.su(sayi(m[1]) || 1);
    if (/^(su ?yu )?(geri al|bir bardak eksilt)$/.test(x)) return Saglik.su(-1);
    if ((m = /^(.{1,30}?) ?(?:vitamini(?:mi)?|takviyemi|hapımı|ilacımı)? aldım$/.exec(x)) && /vitamin|omega|demir|b12|magnezyum|çinko|takviye|hap|ilaç/.test(x)) { var ad = m[1].replace(/^(bugünkü|sabah|akşam)\s+/, ''); return Saglik.vitamin(/^(vitaminlerimi|vitaminimi|takviyelerimi|hepsini)$/.test(ad) ? null : ad); }
    if ((m = /^(?:bugünkü |bugün )?verim(?:im)? (\d|bir|iki|üç|dört|beş)(?:\/5)?$/.exec(x)) || (m = /^verim(?:im)? (\d) olsun$/.exec(x))) return Saglik.verim(sayi(m[1]));
    if ((m = /^(?:dün gece |bu gece |dün )?(\d+(?:[.,]\d)?|bir|iki|üç|dört|beş|altı|yedi|sekiz|dokuz|on) saat uyudum$/.exec(x))) return Saglik.uyku(sayi(m[1]));
    if (/^(bir )?kahve içtim$/.test(x)) return Saglik.kahve(1);
    if (/^(bugün )?(ne kadar|kaç bardak) su içtim$/.test(x)) return Saglik.ozet(1).then(function (o) { return 'Bugün ' + o.bugun.su + '/' + o.ayar.suHedef + ' bardak su.'; });
    return null;
  }
  function baglaCarvis() {
    var C = window.Carvis; if (!C || !C.saatKomut || C.saatKomut.__saglik) return !!(C && C.saatKomut && C.saatKomut.__saglik);
    var eski = C.saatKomut; C.saatKomut = function (t) { return eski.call(C, t) || komut(t); }; C.saatKomut.__saglik = true; return true;
  }
  if (!baglaCarvis()) { var dene = setInterval(function () { if (baglaCarvis()) clearInterval(dene); }, 500); setTimeout(function () { clearInterval(dene); }, 15000); }
  var eskiEk = U.sohbetEkAraclari;
  U.sohbetEkAraclari = function () {
    return (eskiEk ? eskiEk() : []).concat([{ name: 'saglik', description: 'Kullanıcının su, vitamin/takviye, verim (1-5), uyku ve kahve kayıtları. islem=su|vitamin|verim|uyku|kahve kaydeder; islem=ozet son 7 günü ve verimin su/uyku/çalışmayla ilişkisini döndürür. Sağlık tavsiyesinde temkinli ol, tıbbi tanı koyma.',
      inputSchema: { type: 'object', properties: { islem: { type: 'string', enum: ['su', 'vitamin', 'verim', 'uyku', 'kahve', 'ozet'] }, deger: { type: 'string', description: 'sayı ya da vitamin adı' } }, required: ['islem'] },
      execute: function (g) { var d = g.deger; return g.islem === 'ozet' ? Saglik.ozet(7) : g.islem === 'vitamin' ? Saglik.vitamin(d || null) : Saglik[g.islem] ? Saglik[g.islem](d != null && d !== '' ? (isNaN(+d) ? d : +d) : undefined) : 'Bilinmeyen işlem'; } }]);
  };

  /* ---------- hatırlatmalar ---------- */
  var css = document.createElement('style');
  css.textContent = [
    '.sg-hat{position:fixed;left:50%;top:18px;transform:translateX(-50%);z-index:1100;display:flex;align-items:center;gap:12px;padding:10px 12px 10px 16px;border-radius:999px;color:#e9fffb;' +
      'background:linear-gradient(135deg,rgba(6,30,40,.94),rgba(3,14,20,.94));box-shadow:0 0 0 1px rgba(110,200,255,.5),0 0 30px rgba(70,200,255,.25);animation:sgGir .4s cubic-bezier(.2,.9,.2,1.2)}',
    '@keyframes sgGir{from{opacity:0;transform:translate(-50%,-20px)}}',
    '.sg-hat .dugme{padding:6px 14px!important}',
    '.sg-kart{padding:16px 18px;border-radius:22px;margin:0 0 14px}',
    '.sg-su{display:flex;flex-wrap:wrap;gap:8px;margin:10px 0}',
    '.sg-bardak{width:40px;height:52px;border-radius:6px 6px 12px 12px;border:1.5px solid rgba(110,200,255,.55);background:transparent;position:relative;overflow:hidden;cursor:pointer;padding:0}',
    '.sg-bardak i{position:absolute;left:0;right:0;bottom:0;height:0;background:linear-gradient(180deg,rgba(120,220,255,.75),rgba(70,160,255,.55));transition:height .4s;box-shadow:0 0 12px rgba(70,200,255,.6)}',
    '.sg-bardak.dolu i{height:78%}',
    '.sg-cipler{display:flex;flex-wrap:wrap;gap:8px}.sg-cip{padding:8px 14px;border-radius:999px;border:1px solid rgba(110,255,235,.3);background:transparent;color:#d6fbf5;cursor:pointer}',
    '.sg-cip.on{border-color:#8cffa0;background:rgba(140,255,160,.14);color:#eaffef;box-shadow:0 0 14px rgba(140,255,160,.3)}',
    '.sg-verim{display:flex;gap:8px}.sg-verim button{width:46px;height:46px;border-radius:14px;border:1px solid rgba(255,211,138,.35);background:transparent;color:#ffe2a8;font:800 18px var(--f-kod,monospace);cursor:pointer}',
    '.sg-verim button.on{background:rgba(255,211,138,.2);border-color:#ffd38a;box-shadow:0 0 14px rgba(255,211,138,.4)}',
    '.sg-grafik{width:100%;height:170px}',
    '.sg-satir{display:flex;gap:14px;align-items:center;flex-wrap:wrap}',
    '.jv-panel.sg-pano .sg-mini{display:flex;gap:4px;margin:4px 0}.jv-panel.sg-pano .sg-mini i{width:12px;height:16px;border-radius:2px 2px 4px 4px;border:1px solid rgba(110,200,255,.55)}.jv-panel.sg-pano .sg-mini i.d{background:rgba(110,210,255,.7);box-shadow:0 0 6px rgba(70,200,255,.6)}',
    '.jv-panel.sg-pano .sg-pdug{display:flex;gap:6px;margin-top:6px}.jv-panel.sg-pano .sg-pdug button{flex:1;padding:5px 6px;border-radius:10px;border:1px solid rgba(110,255,235,.3);background:transparent;color:#cfeee9;font:600 11px var(--f-kod,monospace);cursor:pointer}'
  ].join('\n');
  document.head.appendChild(css);
  function hatirlat(metin, dugmeAd, eylem) {
    if (document.querySelector('.sg-hat')) return;
    var k = el('div', { class: 'sg-hat', role: 'status' }, [el('span', { text: metin })]);
    var d = el('button', { class: 'dugme kucuk ana', type: 'button', text: dugmeAd }), x = el('button', { class: 'dugme kucuk', type: 'button', text: 'Sonra' });
    d.addEventListener('click', function () { k.remove(); eylem().then(function (m) { U.toast(m); }); }); x.addEventListener('click', function () { k.remove(); });
    k.appendChild(d); k.appendChild(x); document.body.appendChild(k); setTimeout(function () { if (k.isConnected) k.remove(); }, 60000);
  }
  setInterval(function () {
    if (document.hidden || document.body.classList.contains('rl-acik')) return;
    oku().then(function (v) {
      if (!v.ayar.hatirlat) return; var s = new Date().getHours(); if (s < 9 || s >= 23) return;
      var g = v.gunler[gunStr()] || {}, son = g.sonSu || Number(sessionStorage.getItem('sg_acilis') || 0);
      if (!son) { try { sessionStorage.setItem('sg_acilis', String(Date.now())); } catch (e) {} return; }
      if ((g.su || 0) < v.ayar.suHedef && Date.now() - son > v.ayar.suAralik * 60000) hatirlat('💧 Su vakti (' + (g.su || 0) + '/' + v.ayar.suHedef + ')', 'İçtim', function () { return Saglik.su(1); });
      else if (s >= v.ayar.vitaminSaat && !Object.keys(g.vitamin || {}).length && !sessionStorage.getItem('sg_vit')) { try { sessionStorage.setItem('sg_vit', '1'); } catch (e) {} hatirlat('💊 Bugünkü vitaminler', 'Aldım', function () { return Saglik.vitamin(null); }); }
    });
  }, 120000);

  /* ---------- sayfa ---------- */
  U.GORUNUMLER.saglik = function () {
    var ana = U.$('#ana'); ana.innerHTML = '';
    var sayfa = el('div', { class: 'sayfa' }); ana.appendChild(sayfa);
    sayfa.appendChild(el('div', { class: 'kahraman' }, [el('div', { class: 'ust-etiket', text: 'Su · vitamin · verim · uyku' }), el('h1', { text: 'Sağlık ve verim' }),
      el('p', { class: 'var-etiket', text: 'Sesle de olur: "su içtim", "D vitamini aldım", "verimim 4", "7 saat uyudum". Kayıtlar yalnız bu cihazda.' })]));
    var kap = el('div'); sayfa.appendChild(kap);
    function ciz() {
      if (!kap.isConnected) return false;
      Saglik.ozet(7).then(function (o) {
        var g = o.bugun, v = o.ayar; kap.innerHTML = '';
        return oku().then(function (ham) {
          var bg = ham.gunler[gunStr()] || { vitamin: {} };
          var su = el('div', { class: 'sg-su' });
          for (var i = 0; i < Math.max(v.suHedef, g.su); i++) (function (i) { var b = el('button', { type: 'button', class: 'sg-bardak' + (i < g.su ? ' dolu' : ''), 'aria-label': (i + 1) + '. bardak' }, [el('i')]); b.addEventListener('click', function () { Saglik.su(i < g.su ? -1 : 1); }); su.appendChild(b); })(i);
          kap.appendChild(el('section', { class: 'sg-kart metin-kart' }, [el('h3', { text: '💧 Su · ' + g.su + '/' + v.suHedef + ' bardak' }), su]));
          var vit = el('div', { class: 'sg-cipler' });
          v.vitaminler.forEach(function (ad) { var on = !!(bg.vitamin || {})[ad]; var c = el('button', { type: 'button', class: 'sg-cip' + (on ? ' on' : ''), text: (on ? '✓ ' : '') + ad }); c.addEventListener('click', function () { guncelle(function (gg) { if (gg.vitamin[ad]) delete gg.vitamin[ad]; else gg.vitamin[ad] = Date.now(); }); }); vit.appendChild(c); });
          var ekle = el('button', { type: 'button', class: 'sg-cip', text: '+ ekle' }); ekle.addEventListener('click', function () { var a = prompt('Vitamin / takviye adı:'); if (a) U.depoGuncelle('saglik', function (d) { d.ayar = Object.assign({}, VARSAYILAN, d.ayar || {}); if (d.ayar.vitaminler.indexOf(a) < 0) d.ayar.vitaminler = d.ayar.vitaminler.concat([a]); }, 100).then(yenile); });
          vit.appendChild(ekle);
          kap.appendChild(el('section', { class: 'sg-kart metin-kart' }, [el('h3', { text: '💊 Vitamin ve takviyeler' }), vit]));
          var ver = el('div', { class: 'sg-verim' }); for (var k = 1; k <= 5; k++) (function (k) { var b = el('button', { type: 'button', class: g.verim === k ? 'on' : '', text: String(k) }); b.addEventListener('click', function () { Saglik.verim(k); }); ver.appendChild(b); })(k);
          var uyku = el('input', { type: 'number', min: '0', max: '16', step: '0.5', value: g.uyku != null ? String(g.uyku) : '', placeholder: 'saat', style: 'width:90px' }); uyku.addEventListener('change', function () { if (uyku.value) Saglik.uyku(+uyku.value); });
          var kahve = el('button', { type: 'button', class: 'sg-cip', text: '☕ ' + (g.kahve || 0) }); kahve.addEventListener('click', function () { Saglik.kahve(1); });
          kap.appendChild(el('section', { class: 'sg-kart metin-kart' }, [el('h3', { text: '⚡ Bugünkü verim' }), el('div', { class: 'sg-satir' }, [ver, el('label', { class: 'sg-satir' }, ['😴 Uyku', uyku]), kahve])]));
          kap.appendChild(el('section', { class: 'sg-kart metin-kart' }, [el('h3', { text: '📈 Son 7 gün' }), grafik(o.gunler), el('p', { class: 'var-etiket', text: o.iliski })]));
          var hat = el('input', { type: 'checkbox', checked: v.hatirlat ? true : null }), hedef = el('input', { type: 'number', min: '1', max: '20', value: String(v.suHedef), style: 'width:70px' }), aralik = el('input', { type: 'number', min: '30', max: '240', step: '15', value: String(v.suAralik), style: 'width:80px' });
          function ay() { U.depoGuncelle('saglik', function (d) { d.ayar = Object.assign({}, VARSAYILAN, d.ayar || {}, { hatirlat: hat.checked, suHedef: +hedef.value || 8, suAralik: +aralik.value || 90 }); }, 100).then(yenile); }
          [hat, hedef, aralik].forEach(function (x) { x.addEventListener('change', ay); });
          kap.appendChild(el('details', { class: 'sg-kart' }, [el('summary', { text: 'Ayarlar' }), el('div', { class: 'sg-satir', style: 'margin-top:10px' }, [el('label', { class: 'sg-satir' }, [hat, 'Hatırlat']), el('label', { class: 'sg-satir' }, ['Günlük su hedefi', hedef, 'bardak']), el('label', { class: 'sg-satir' }, ['Su hatırlatma', aralik, 'dk'])])]));
        });
      });
    }
    dinleyiciler.push(ciz); ciz();
  };
  function grafik(l) {
    var NS = 'http://www.w3.org/2000/svg', s = document.createElementNS(NS, 'svg'); s.setAttribute('viewBox', '0 0 700 170'); s.setAttribute('class', 'sg-grafik');
    var w = 700 / l.length, h = '', maxDk = Math.max(60, Math.max.apply(null, l.map(function (x) { return x.calisma_dk; })));
    l.forEach(function (x, i) {
      var cx = i * w + w / 2, suY = 130 - Math.min(1, x.su / 10) * 100, dkY = 130 - x.calisma_dk / maxDk * 100;
      h += '<rect x="' + (cx - 16) + '" y="' + suY + '" width="14" height="' + (130 - suY) + '" rx="3" fill="rgba(110,210,255,.55)"/>';
      h += '<rect x="' + (cx + 2) + '" y="' + dkY + '" width="14" height="' + (130 - dkY) + '" rx="3" fill="rgba(94,240,220,.35)"/>';
      if (x.verim) h += '<circle cx="' + cx + '" cy="' + (130 - x.verim / 5 * 100) + '" r="6" fill="#ffd38a" style="filter:drop-shadow(0 0 6px #ffd38a)"/>';
      h += '<text x="' + cx + '" y="152" text-anchor="middle" fill="#9fcfc8" style="font:600 12px monospace">' + x.gun.slice(8) + '.' + x.gun.slice(5, 7) + '</text>';
    });
    h += '<text x="6" y="166" fill="#7fb7b0" style="font:11px monospace">mavi: su · yeşil: çalışma dk · sarı: verim</text>';
    s.innerHTML = h; return s;
  }
  U.SEKMELER.push({ id: 'saglik', ad: 'Sağlık', ikon: '💧' });
  if (U.sekmeleriCiz) try { U.sekmeleriCiz(); } catch (e) {}

  /* ---------- ana sayfa panosu: SAĞLIK paneli ---------- */
  function panoPaneli() {
    var sol = document.querySelector('.jv-pano .jv-sol'); if (!sol || sol.querySelector('.sg-pano')) return;
    var p = el('div', { class: 'jv-panel sg-pano' }, [el('h3', { text: 'SAĞLIK' })]), ic = el('div'); p.appendChild(ic); sol.appendChild(p);
    function ciz() {
      if (!p.isConnected) return false;
      Saglik.ozet(1).then(function (o) {
        var g = o.bugun; ic.innerHTML = '';
        var mini = el('div', { class: 'sg-mini', title: g.su + '/' + o.ayar.suHedef + ' bardak' }); for (var i = 0; i < o.ayar.suHedef; i++) mini.appendChild(el('i', { class: i < g.su ? 'd' : '' }));
        ic.appendChild(el('div', { class: 'jv-kucuk', text: 'SU ' + g.su + '/' + o.ayar.suHedef + ' · VİTAMİN ' + g.vitamin + '/' + o.ayar.vitaminler.length + (g.verim ? ' · VERİM ' + g.verim + '/5' : '') }));
        ic.appendChild(mini);
        ic.appendChild(el('div', { class: 'sg-pdug' }, [el('button', { type: 'button', text: '+ SU', onclick: function () { Saglik.su(1); } }), el('button', { type: 'button', text: 'VİTAMİN', onclick: function () { Saglik.vitamin(null).then(U.toast); } }), el('button', { type: 'button', text: 'AYRINTI', onclick: function () { location.hash = '#saglik'; } })]));
      });
    }
    dinleyiciler.push(ciz); ciz();
  }
  var eskiKut = U.GORUNUMLER.kutuphane;
  U.GORUNUMLER.kutuphane = function () { eskiKut.apply(this, arguments); setTimeout(panoPaneli, 400); setTimeout(panoPaneli, 1500); };
  setTimeout(panoPaneli, 1500);
})();
