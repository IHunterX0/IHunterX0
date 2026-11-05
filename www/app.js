/* 1001 Çalışma Kitapları — uygulama */
(function () {
  'use strict';
  var A = window.KitapAyristir;

  /* =============== yardımcılar =============== */
  function $(s, k) { return (k || document).querySelector(s); }
  function $$(s, k) { return Array.prototype.slice.call((k || document).querySelectorAll(s)); }
  function el(tag, ozel, cocuk) {
    var e = document.createElement(tag);
    if (ozel) for (var k in ozel) {
      if (ozel[k] == null || ozel[k] === false) continue;
      if (k === 'class') e.className = ozel[k];
      else if (k === 'html') e.innerHTML = ozel[k];
      else if (k === 'text') e.textContent = ozel[k];
      else if (k.slice(0, 2) === 'on') e.addEventListener(k.slice(2), ozel[k]);
      else if (k === 'style') e.style.cssText = ozel[k];
      else e.setAttribute(k, ozel[k] === true ? '' : ozel[k]);
    }
    (cocuk || []).forEach(function (c) { if (c != null) e.appendChild(typeof c === 'string' ? document.createTextNode(c) : c); });
    return e;
  }
  function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  var katla = A.katla;
  function duz(h) { var d = document.createElement('div'); d.innerHTML = h || ''; return (d.textContent || '').replace(/\s+/g, ' ').trim(); }
  function geciktir(fn, ms) { var t; return function () { var a = arguments, s = this; clearTimeout(t); t = setTimeout(function () { fn.apply(s, a); }, ms); }; }
  function toast(m, ms) {
    var t = el('div', { class: 'toast', role: 'status', text: m });
    document.body.appendChild(t); setTimeout(function () { t.remove(); }, ms || 2800);
  }
  function ls(k, v) {
    try { if (arguments.length > 1) { localStorage.setItem('1001:' + k, JSON.stringify(v)); return v; } var x = localStorage.getItem('1001:' + k); return x ? JSON.parse(x) : null; }
    catch (e) { return null; }
  }
  function acikRenk(hex) { // kitabın koyu rengini koyu zeminde okunur yap
    if (!hex) return null;
    var m = /^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(hex.length === 4 ? '#' + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3] : hex);
    if (!m) return hex;
    var r = parseInt(m[1], 16) / 255, g = parseInt(m[2], 16) / 255, b = parseInt(m[3], 16) / 255;
    var mx = Math.max(r, g, b), mn = Math.min(r, g, b), h = 0, s, l = (mx + mn) / 2, d = mx - mn;
    s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
    if (d) { if (mx === r) h = ((g - b) / d) % 6; else if (mx === g) h = (b - r) / d + 2; else h = (r - g) / d + 4; h *= 60; if (h < 0) h += 360; }
    return 'hsl(' + Math.round(h) + ' ' + Math.round(Math.min(85, s * 100 + 15)) + '% 68%)';
  }

  /* =============== yetenekler & depo =============== */
  var Y = { db: null, user: null, uid: null, sample: null, assets: null, downloads: null, hazir: false };
  var yetenekSozu = (function () {
    if (!window.claude || !window.claude.use) return Promise.resolve();
    function al(ad) { try { return window.claude.use(ad).catch(function () { return null; }); } catch (e) { return Promise.resolve(null); } }
    return Promise.all([al('db'), al('user'), al('sample'), al('assets'), al('downloads')]).then(function (r) {
      Y.db = r[0]; Y.user = r[1]; Y.sample = r[2]; Y.assets = r[3]; Y.downloads = r[4];
      if (Y.user && Y.user.id) return Promise.resolve(Y.user.id()).then(function (id) { Y.uid = id || null; }).catch(function () {});
    }).then(function () { Y.hazir = true; document.dispatchEvent(new Event('yetenek')); });
  })();

  // Kişisel belge: db (data/users/<id>/<ad>) varsa orada, yoksa tarayıcıda.
  var Depo = {
    _cache: {}, _yaziliyor: {}, _bekleyen: {},
    yol: function (ad) { return 'data/users/' + Y.uid + '/' + ad; },
    oku: function (ad) {
      var self = this;
      if (self._cache[ad]) return Promise.resolve(self._cache[ad]);
      return yetenekSozu.then(function () {
        if (Y.db && Y.uid) {
          var zaman = new Promise(function (_, red) { setTimeout(function () { red(new Error('zaman aşımı')); }, 10000); });
          return Promise.race([Y.db.doc(self.yol(ad)).get(), zaman]).then(function (s) { return s.exists ? s.data() : null; })
            .catch(function () { return ls('d:' + ad); });
        }
        return ls('d:' + ad);
      }).then(function (v) { v = v ? JSON.parse(JSON.stringify(v)) : {}; self._cache[ad] = v; return v; });
    },
    // Tek seferde bir yazma; arada gelen değişiklik birleştirilir.
    yaz: function (ad, veri) {
      var self = this;
      self._cache[ad] = veri;
      ls('d:' + ad, veri);
      if (!(Y.db && Y.uid)) return Promise.resolve();
      if (self._yaziliyor[ad]) { self._bekleyen[ad] = true; return self._yaziliyor[ad]; }
      var p = Y.db.doc(self.yol(ad)).set(JSON.parse(JSON.stringify(veri))).catch(function (e) {
        if (e && e.code === 'quota_exceeded') toast('Kayıt alanı doldu; bu değişiklik yalnız bu tarayıcıda tutuldu.');
      }).then(function () {
        self._yaziliyor[ad] = null;
        if (self._bekleyen[ad]) { self._bekleyen[ad] = false; return self.yaz(ad, self._cache[ad]); }
      });
      self._yaziliyor[ad] = p;
      return p;
    }
  };
  var depoYazGecikmeli = {};
  function depoGuncelle(ad, fn, ms) {
    return Depo.oku(ad).then(function (v) {
      fn(v);
      if (!depoYazGecikmeli[ad]) depoYazGecikmeli[ad] = geciktir(function () { Depo.yaz(ad, Depo._cache[ad]); }, ms || 1500);
      depoYazGecikmeli[ad]();
      return v;
    });
  }

  /* =============== kütüphane verisi =============== */
  var Kitaplik = {
    liste: null, kitap: {}, bolum: {}, soru: {}, terim: {},
    katalog: function () {
      var self = this;
      if (self.liste) return Promise.resolve(self.liste);
      var dosya = fetch('kitaplar/katalog.json').then(function (r) { return r.json(); }).catch(function () { return { kitaplar: [] }; });
      var dbden = yetenekSozu.then(function () {
        if (!Y.db) return [];
        return Promise.race([Y.db.collection('kutuphane').get(), new Promise(function (r) { setTimeout(function () { r(null); }, 8000); })])
          .then(function (s) { return s ? s.docs.map(function (d) { return d.data(); }) : []; }).catch(function () { return []; });
      });
      return Promise.all([dosya, dbden]).then(function (r) {
        var harita = {};
        (r[0].kitaplar || []).forEach(function (k) { harita[k.id] = k; });
        r[1].forEach(function (k) { if (k && k.id && !k.silindi) harita[k.id] = Object.assign({}, harita[k.id] || {}, k); else if (k && k.silindi) delete harita[k.id]; });
        self.liste = Object.keys(harita).map(function (k) { return harita[k]; }).sort(function (a, b) { return (a.sira || 99) - (b.sira || 99) || String(a.baslik).localeCompare(b.baslik, 'tr'); });
        return self.liste;
      });
    },
    kayit: function (id) { return (this.liste || []).filter(function (k) { return k.id === id; })[0]; },
    url: function (k, dosya) {
      if (k.kaynak === 'asset') return (k.dosyalar || {})[dosya] || null;
      return (k.yol || ('kitaplar/' + k.id + '/')) + dosya;
    },
    getir: function (k, dosya) {
      var u = this.url(k, dosya);
      if (!u) return Promise.reject(new Error(dosya + ' bulunamadı'));
      return fetch(u).then(function (r) { if (!r.ok) throw new Error(dosya + ': ' + r.status); return r.json(); });
    },
    ac: function (id) {
      var self = this;
      if (!self.liste) return self.katalog().then(function () { return self.ac(id); });
      if (self.kitap[id]) return self.kitap[id];
      var k = self.kayit(id);
      self.kitap[id] = self.getir(k, 'kitap.json').then(function (j) {
        j.renk = j.renk || k.renk || '#4fe0ff';
        j.figurHarita = {}; j.slaytHarita = {};
        j.figurler.forEach(function (f, i) {
          f.sira = i; if (f.src && k.kaynak === 'asset') f.src = (k.dosyalar || {})[f.src] || f.src;
          j.figurHarita[f.id] = f; if (f.slayt) j.slaytHarita[f.slayt] = f;
        });
        j.altNo = {};
        j.bolumler.forEach(function (b) { b.altlar.forEach(function (a) { if (a.no) j.altNo[a.no] = { b: b, a: a }; }); });
        j.bolumNo = {};
        j.bolumler.forEach(function (b) { if (b.no != null) j.bolumNo[b.no] = b; });
        return j;
      }).catch(function (e) { delete self.kitap[id]; throw e; });
      return self.kitap[id];
    },
    bolumAc: function (id, sira) {
      var self = this, anahtar = id + '/' + sira;
      if (self.bolum[anahtar]) return self.bolum[anahtar];
      self.bolum[anahtar] = self.ac(id).then(function (kj) {
        return self.getir(self.kayit(id), kj.bolumler[sira].dosya);
      }).catch(function (e) { delete self.bolum[anahtar]; throw e; });
      return self.bolum[anahtar];
    },
    sorular: function (id) {
      var self = this;
      if (!self.liste) return self.katalog().then(function () { return self.sorular(id); });
      if (!self.soru[id]) self.soru[id] = self.getir(self.kayit(id), 'sorular.json').catch(function (e) { delete self.soru[id]; throw e; });
      return self.soru[id];
    },
    terimler: function (id) {
      var self = this;
      if (!self.liste) return self.katalog().then(function () { return self.terimler(id); });
      if (!self.terim[id]) self.terim[id] = self.getir(self.kayit(id), 'terimler.json').catch(function () { return []; });
      return self.terim[id];
    },
    tumBolumler: function (id) {
      var self = this;
      return self.ac(id).then(function (kj) { return Promise.all(kj.bolumler.map(function (_, i) { return self.bolumAc(id, i); })); });
    }
  };

  /* =============== durum =============== */
  var Durum = { gorunum: null, kitapId: null, bolumSira: 0, ayar: ls('ayar') || { boyut: 1.06, gizli: [], yalniz: false } };
  function ayarKaydet() { ls('ayar', Durum.ayar); }

  /* =============== sekmeler / yönlendirme =============== */
  var SEKMELER = [
    { id: 'kutuphane', ad: 'Kütüphane', ikon: '▦' },
    { id: 'oku', ad: 'Okuyucu', ikon: '❏' }
  ];
  function sekmeleriCiz() {
    var nav = $('#sekmeler'); nav.innerHTML = '';
    SEKMELER.forEach(function (s) {
      if (s.id === 'oku' && !Durum.kitapId) return;
      nav.appendChild(el('button', { class: 'sekme', type: 'button', 'aria-current': Durum.gorunum === s.id ? 'page' : null,
        onclick: function () { git(s.id === 'oku' ? okuHash(Durum.kitapId, Durum.bolumSira) : s.id); } },
        [el('span', { 'aria-hidden': 'true', text: s.ikon }), el('span', { class: 'yazi', text: s.ad }), s.rozet ? el('span', { class: 'rozet', text: s.rozet }) : null]));
    });
  }
  function okuHash(kitap, sira, altSira) { return 'oku-' + kitap + '-' + (sira || 0) + (altSira != null ? '-' + altSira : ''); }
  function git(h) { if (location.hash.slice(1) === h) yonlendir(); else location.hash = h; }
  var GORUNUMLER = {};
  function yonlendir() {
    var h = location.hash.slice(1) || 'kutuphane';
    var m = /^oku-([a-z0-9-]+?)-(\d+)(?:-(\d+))?$/.exec(h);
    katmanKapat();
    if (m) { Durum.gorunum = 'oku'; GORUNUMLER.oku(m[1], +m[2], m[3] != null ? +m[3] : null); }
    else if (GORUNUMLER[h]) { Durum.gorunum = h; GORUNUMLER[h](); }
    else if (Object.keys(GORUNUMLER).some(function (k) { return h.indexOf(k + '-') === 0; })) {
      var anahtar = Object.keys(GORUNUMLER).filter(function (k) { return h.indexOf(k + '-') === 0; }).sort(function (a, b) { return b.length - a.length; })[0];
      Durum.gorunum = anahtar; GORUNUMLER[anahtar](h.slice(anahtar.length + 1));
    }
    else { Durum.gorunum = 'kutuphane'; GORUNUMLER.kutuphane(); }
    sekmeleriCiz();
  }
  window.addEventListener('hashchange', yonlendir);

  /* =============== kütüphane görünümü =============== */
  GORUNUMLER.kutuphane = function () {
    var ana = $('#ana');
    ana.innerHTML = '';
    var sayfa = el('div', { class: 'sayfa' });
    ana.appendChild(sayfa);
    sayfa.appendChild(el('div', { class: 'kahraman' }, [
      el('div', { class: 'ust-etiket', text: 'Kişisel tıp asistanı' }),
      el('h1', { text: 'Kütüphane' }),
      el('p', { text: 'Kitabını seç, kaldığın yerden devam et. Arama her kitapta birden çalışır (Ctrl+K).' })
    ]));
    var hizli = el('div', { class: 'hizli' });
    sayfa.appendChild(hizli);
    var izgara = el('div', { class: 'kart-izgara' }, [el('div', { class: 'yukleniyor', text: 'Kitaplar yükleniyor…' })]);
    sayfa.appendChild(izgara);
    Promise.all([Kitaplik.katalog(), Depo.oku('ilerleme')]).then(function (r) {
      var liste = r[0], il = r[1] || {};
      izgara.innerHTML = '';
      if (!liste.length) { izgara.appendChild(el('div', { class: 'bos', text: 'Henüz kitap yok.' })); return; }
      var son = il.son;
      if (son && Kitaplik.kayit(son.kitap)) {
        hizli.appendChild(el('button', { class: 'dugme ana', type: 'button', onclick: function () { git(okuHash(son.kitap, son.bolum)); devamBlok = son.blok; } },
          ['▶ Kaldığın yerden: ' + (Kitaplik.kayit(son.kitap).baslik || son.kitap)]));
      }
      liste.forEach(function (k) {
        var renk = k.renk || '#4fe0ff';
        var okunan = Object.keys(((il.okunan || {})[k.id]) || {}).length;
        var yuzde = k.sayilar && k.sayilar.altBolum ? Math.min(100, Math.round(100 * okunan / k.sayilar.altBolum)) : 0;
        var kart = el('article', { class: 'kitap-kart', style: '--k:' + renk }, [
          el('div', { class: 'ust-etiket', style: 'color:' + renk, text: (k.kaynak === 'asset' ? 'Eklenen kitap' : 'Çalışma kitabı') }),
          el('h2', { text: k.baslik }),
          el('div', { class: 'sayilar' }, [
            el('div', { class: 'sayi' }, [el('b', { text: (k.sayilar && k.sayilar.bolum) || '–' }), el('span', { text: 'bölüm' })]),
            el('div', { class: 'sayi' }, [el('b', { text: (k.sayilar && k.sayilar.soruAilesi) || 0 }), el('span', { text: 'soru' })]),
            el('div', { class: 'sayi' }, [el('b', { text: (k.sayilar && k.sayilar.gorsel) || 0 }), el('span', { text: 'görsel' })])
          ]),
          el('div', { class: 'cubuk', role: 'progressbar', 'aria-valuenow': yuzde, 'aria-valuemin': 0, 'aria-valuemax': 100, 'aria-label': 'Okuma ilerlemesi' }, [el('i', { style: 'width:' + yuzde + '%' })]),
          el('div', { class: 'kart-alt' }, [
            el('span', { text: '%' + yuzde + ' okundu · ' + okunan + '/' + ((k.sayilar && k.sayilar.altBolum) || '?') + ' alt bölüm' }),
            el('button', { class: 'dugme kucuk', type: 'button', onclick: function () {
              var s = (il.okuma || {})[k.id]; devamBlok = s ? s.blok : null; git(okuHash(k.id, s ? s.bolum : 0));
            } }, [((il.okuma || {})[k.id] ? 'Devam et' : 'Oku')])
          ])
        ]);
        izgara.appendChild(kart);
      });
    }).catch(function (e) { izgara.innerHTML = ''; izgara.appendChild(el('div', { class: 'bos', text: 'Kütüphane açılamadı: ' + e.message })); });
  };

  /* =============== çapraz atıflar =============== */
  var ATIF = /(\bBölüm\s+(\d+)(?:\.(\d+))?((?:\s*(?:,|ve)\s*\d+(?:\.\d+)?)*))|(→\s?B(\d{2})\b)|(\b(S\d{2}[a-z]?)-s(\d+)((?:\s*(?:,|…|–|-)\s*s?\d+)*))/g;
  function atiflariBagla(kok, kj) {
    var yuruyen = document.createTreeWalker(kok, NodeFilter.SHOW_TEXT, null);
    var dugumler = [], n;
    while ((n = yuruyen.nextNode())) { if (/Bölüm\s+\d|→\s?B\d|S\d{2}[a-z]?-s\d/.test(n.nodeValue) && !(n.parentNode.closest && n.parentNode.closest('a,button,.capraz,.ust-etiket,h1,h2'))) dugumler.push(n); }
    dugumler.forEach(function (d) {
      var s = d.nodeValue, parca = document.createDocumentFragment(), son = 0, m;
      ATIF.lastIndex = 0;
      while ((m = ATIF.exec(s))) {
        parca.appendChild(document.createTextNode(s.slice(son, m.index)));
        if (m[1]) {
          var hedefler = [m[2] + (m[3] ? '.' + m[3] : '')];
          (m[4] || '').replace(/(\d+(?:\.\d+)?)/g, function (x) { hedefler.push(x); });
          var ilk = true, metin = m[0], kalan = metin;
          // ilk numarayı bağla, kalanları da ayrı ayrı bağla
          var re = /\d+(?:\.\d+)?/g, mm, ofs = 0;
          while ((mm = re.exec(metin))) {
            var no = mm[0];
            parca.appendChild(document.createTextNode(metin.slice(ofs, mm.index)));
            parca.appendChild(atifBag(no, kj, mm[0]));
            ofs = mm.index + no.length;
          }
          parca.appendChild(document.createTextNode(metin.slice(ofs)));
        } else if (m[5]) {
          parca.appendChild(document.createTextNode('→ '));
          parca.appendChild(atifBag(String(+m[6]), kj, 'B' + m[6]));
        } else if (m[7]) {
          var deste = m[8], metin2 = m[0], re2 = /s?(\d+)/g, m2, ofs2 = 0, bas = m[8].length + 1;
          parca.appendChild(slaytBag(deste + '-s' + m[9], kj, deste + '-s' + m[9]));
          ofs2 = (deste + '-s' + m[9]).length;
          var kuyruk = metin2.slice(ofs2), m3, re3 = /(s?)(\d+)/g, o3 = 0;
          while ((m3 = re3.exec(kuyruk))) {
            parca.appendChild(document.createTextNode(kuyruk.slice(o3, m3.index)));
            parca.appendChild(slaytBag(deste + '-s' + m3[2], kj, m3[0]));
            o3 = m3.index + m3[0].length;
          }
          parca.appendChild(document.createTextNode(kuyruk.slice(o3)));
        }
        son = m.index + m[0].length;
      }
      parca.appendChild(document.createTextNode(s.slice(son)));
      d.parentNode.replaceChild(parca, d);
    });
  }
  function atifBag(no, kj, yazi) {
    var hedef = null;
    if (no.indexOf('.') > 0 && kj.altNo[no]) hedef = kj.altNo[no];
    else if (kj.bolumNo[no.split('.')[0]]) hedef = { b: kj.bolumNo[no.split('.')[0]], a: null };
    if (!hedef) return document.createTextNode(yazi);
    return el('a', { class: 'capraz', href: '#' + okuHash(kj.id, hedef.b.sira, hedef.a ? hedef.b.altlar.indexOf(hedef.a) : null), title: (hedef.a ? hedef.a.baslik : hedef.b.baslik) || '', text: yazi });
  }
  function slaytBag(kimlik, kj, yazi) {
    var f = kj.slaytHarita[kimlik];
    if (!f) return document.createTextNode(yazi);
    return el('a', { class: 'capraz', href: 'javascript:void 0', role: 'button', title: 'Slaytı aç: ' + kimlik, text: yazi,
      onclick: function (e) { e.preventDefault(); galeriAc(kj, f.id); } });
  }

  /* =============== blok çizimi =============== */
  function turBilgi(kj, tur) {
    var t = (kj.turler || {})[tur] || A.TURLER[tur] || { etiket: tur, ikon: '◆', renk: '#8fa3b8' };
    return { etiket: t.etiket, ikon: t.ikon, renk: t.kitapRengi ? acikRenk(t.kitapRengi) : t.renk };
  }
  function blokCiz(b, kj, ctx) {
    var d;
    switch (b.t) {
      case 'p':
        if (ctx && ctx.kt && ctx.kt[b.id] && window.Uygulama.kendiniTestCiz) { d = window.Uygulama.kendiniTestCiz(ctx.kt[b.id], kj, b.id); break; }
        if (ctx && ctx.ktCevap && ctx.ktCevap[b.id] && /🔑/.test(b.html) && duz(b.html).length < 40) { d = el('span', { class: 'blok', id: 'b-' + b.id, hidden: true }); break; }
        if (ctx && ctx.ktCevap && ctx.ktCevap[b.id]) { d = el('details', { class: 'blok kt-anahtar', id: 'b-' + b.id }, [el('summary', { text: 'Cevap anahtarının tamamı' }), el('p', { html: b.html })]); break; }
        d = el('p', { class: 'blok', id: 'b-' + b.id, html: b.html }); break;
      case 'baslik': d = el('h' + Math.min(4, Math.max(3, b.seviye)), { class: 'blok baslik-blok', id: 'b-' + b.id, html: b.html }); break;
      case 'liste':
        d = el(b.sirali ? 'ol' : 'ul', { class: 'blok', id: 'b-' + b.id, start: b.bas || null });
        if (ctx && ctx.ktCevap && ctx.ktCevap[b.id]) { var ac = el('details', { class: 'blok kt-anahtar', id: 'b-' + b.id }, [el('summary', { text: 'Cevap anahtarının tamamı' })]); var ll = el(b.sirali ? 'ol' : 'ul'); b.ogeler.forEach(function (h) { ll.appendChild(el('li', { html: h })); }); ac.appendChild(ll); d = ac; break; }
        if (ctx && ctx.kt && ctx.kt[b.id + '#0'] && window.Uygulama.kendiniTestCiz) { d = el('div', { class: 'blok', id: 'b-' + b.id }); b.ogeler.forEach(function (h, i) { var q = ctx.kt[b.id + '#' + i]; d.appendChild(q ? window.Uygulama.kendiniTestCiz(q, kj, null) : el('p', { html: h })); }); break; }
        b.ogeler.forEach(function (h) { d.appendChild(el('li', { html: h })); });
        break;
      case 'tablo':
        var tb = el('table');
        if (b.bas && b.bas.length && b.bas.some(function (x) { return duz(x); })) tb.appendChild(el('thead', null, [el('tr', null, b.bas.map(function (h) { return el('th', { html: h }); }))]));
        tb.appendChild(el('tbody', null, b.satir.map(function (s) { return el('tr', null, s.map(function (h) { return el('td', { html: h }); })); })));
        d = el('div', { class: 'blok tablo-kap', id: 'b-' + b.id, tabindex: '0', role: 'region', 'aria-label': 'Tablo' }, [tb]);
        break;
      case 'kod': d = el('pre', { class: 'blok', id: 'b-' + b.id, text: b.metin }); break;
      case 'acilir':
        d = el('details', { class: 'blok', id: 'b-' + b.id }, [el('summary', { html: b.ozet })]);
        b.bloklar.forEach(function (x) { d.appendChild(blokCiz(x, kj, ctx)); });
        break;
      case 'figur':
        d = el('div', { class: 'blok figurler' + (b.tek || b.figurler.length === 1 ? ' tek' : ''), id: 'b-' + b.id });
        b.figurler.forEach(function (fid) {
          var f = kj.figurHarita[fid]; if (!f) return;
          var cap = f.slayt ? [el('b', { text: f.slayt }), ' · ' + (f.konu || '')] : [f.baslik || ''];
          d.appendChild(el('figure', { class: 'figur', tabindex: '0', role: 'button', 'aria-label': 'Büyüt: ' + (f.baslik || f.alt || 'görsel'),
            onclick: function () { galeriAc(kj, fid); }, onkeydown: function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); galeriAc(kj, fid); } } },
            [f.src ? el('img', { src: f.src, alt: f.alt || f.baslik || '', loading: 'lazy' }) : el('div', { class: 'bos', text: 'Görsel bulunamadı: ' + f.ozgunSrc }),
              el('figcaption', null, cap)]));
        });
        break;
      case 'callout': d = calloutCiz(b, kj, ctx); break;
      default: d = el('div', { class: 'blok', id: 'b-' + b.id, html: b.html || '' });
    }
    return d;
  }
  function calloutCiz(b, kj, ctx) {
    var t = turBilgi(kj, b.tur);
    var kutu = el('aside', { class: 'blok co co-' + b.tur, id: 'b-' + b.id, style: '--c:' + t.renk, 'data-tur': b.tur });
    var ust = el('div', { class: 'co-ust' }, [el('span', { 'aria-hidden': 'true', text: t.ikon }), el('span', { text: t.etiket })]);
    kutu.appendChild(ust);
    var ic = el('div', { class: 'co-ic' });
    kutu.appendChild(ic);
    var q = b.soru && ctx && ctx.sorular ? ctx.sorular[b.soru] : null;
    if (q && q.varyantlar.length && q.varyantlar.some(function (v) { return v.siklar.length; })) {
      kutu.classList.add('soru-kutu');
      soruCiz(q, ic, ust, kj);
    } else {
      b.bloklar.forEach(function (x) { ic.appendChild(blokCiz(x, kj, ctx)); });
    }
    return kutu;
  }
  // Soru ailesi: varyantlar tıklanabilir şıklarla; ardından kitabın cevap bölümü (gizli).
  function soruCiz(q, ic, ust, kj, secenek) {
    secenek = secenek || {};
    if (q.onem && (q.onem.yildiz || q.onem.ates)) ust.appendChild(el('span', { class: 'onem', title: (q.onem.yildiz ? q.onem.yildiz + ' sınavda çıktı' : '') + (q.onem.ates ? ' · sık çıkan' : '') },
      [(q.onem.ates ? '🔥 ' : '') + (q.onem.yildiz ? '★' + q.onem.yildiz : '')]));
    ic.appendChild(el('p', { class: 'var-baslik', html: '<strong>' + esc((q.baslik || '').replace(/^📝\s*/, '')) + '</strong>' }));
    var cevapKutu = el('div', { class: 'cevap-bolumu', hidden: true, html: q.cevapHtml || '<p>Kitapta cevap bölümü yok.</p>' });
    var acildi = false;
    function cevabiAc() { if (acildi) return; acildi = true; cevapKutu.hidden = false; atiflariBagla(cevapKutu, kj); goster.hidden = true; }
    q.varyantlar.forEach(function (v, vi) {
      var kap = el('div', { class: 'varyant' });
      var et = [v.etiket ? v.etiket + ') ' : '', v.kaynakEtiket && !/^📝/.test(v.kaynakEtiket) ? v.kaynakEtiket.replace(/^[a-h]\)\s*/, '') : (v.sinav ? v.sinav + (v.no ? ' · ' + v.no + '. soru' : '') : '')].join('');
      if (q.varyantlar.length > 1 || et.trim()) kap.appendChild(el('div', { class: 'var-etiket', text: et + (v.ayniKok ? ' (aynı kök)' : '') }));
      if (v.govde && (vi === 0 || !v.ayniKok)) kap.appendChild(el('p', { html: v.govde }));
      if (v.siklar.length) {
        var sl = el('div', { class: 'siklar', role: 'group', 'aria-label': 'Şıklar' });
        v.siklar.forEach(function (s) {
          var bt = el('button', { class: 'sik', type: 'button' }, [el('span', { class: 'harf', text: s.h + ')' }), el('span', { html: s.m })]);
          bt.addEventListener('click', function () {
            if (sl.dataset.cevaplandi) return;
            sl.dataset.cevaplandi = '1';
            var dogru = v.cevap;
            $$('.sik', sl).forEach(function (x, i) { x.disabled = true; if (dogru && v.siklar[i].h.toUpperCase() === dogru) x.classList.add('dogru'); });
            if (dogru && s.h.toUpperCase() !== dogru) bt.classList.add('yanlis');
            if (!dogru) kap.appendChild(el('p', { class: 'var-etiket', text: 'Bu varyant için kitapta tek bir resmî cevap harfi yok. Cevap bölümünü okuyup kendin değerlendir.' }));
            if (v.cevapNotu) kap.appendChild(el('p', { class: 'var-etiket', text: v.cevapNotu }));
            if (v.cevapKaynak === 'ai-yapilandirma') kap.appendChild(el('p', { class: 'var-etiket' }, [el('span', { class: 'etiket-kucuk ai', text: 'AI ile ayrıştırıldı' }), ' cevap harfi kitabın şu ifadesinden alındı: “' + (v.cevapAlinti || '') + '”']));
            if (secenek.cevapla) secenek.cevapla(q, v, s.h.toUpperCase(), dogru ? s.h.toUpperCase() === dogru : null, vi);
            else if (window.Uygulama.soruCevaplandi) window.Uygulama.soruCevaplandi(kj.id, q, vi, dogru ? s.h.toUpperCase() === dogru : null);
            cevabiAc();
          });
          sl.appendChild(bt);
        });
        kap.appendChild(sl);
      }
      if (v.sonNot) kap.appendChild(el('p', { html: v.sonNot }));
      ic.appendChild(kap);
    });
    var goster = el('button', { class: 'dugme kucuk', type: 'button', onclick: cevabiAc }, ['🔑 Cevabı göster']);
    ic.appendChild(goster);
    ic.appendChild(cevapKutu);
  }

  /* =============== okuyucu =============== */
  var devamBlok = null, gozlemci = null, konumGozlemci = null;
  GORUNUMLER.oku = function (kitapId, sira, altSira) {
    var ana = $('#ana');
    var ayniKitap = Durum.kitapId === kitapId && $('.okuyucu', ana);
    Durum.kitapId = kitapId; Durum.bolumSira = sira;
    if (!ayniKitap) {
      ana.innerHTML = '';
      ana.appendChild(el('div', { class: 'yukleniyor', text: 'Kitap açılıyor…' }));
    }
    Kitaplik.katalog().then(function () {
      if (!Kitaplik.kayit(kitapId)) throw new Error('Bu kitap kütüphanede yok.');
      return Promise.all([Kitaplik.ac(kitapId), Kitaplik.sorular(kitapId).catch(function () { return []; }), Depo.oku('ilerleme')]);
    }).then(function (r) {
      var kj = r[0], sorular = r[1], il = r[2];
      var soruHarita = {}, ktHarita = {}, ktCevap = {};
      sorular.forEach(function (q) { soruHarita[q.id] = q; if (q.kendiniTest) { ktHarita[q.blok + (q.liste != null ? '#' + q.liste : '')] = q; (q.cevapBloklari || []).forEach(function (c) { ktCevap[c] = 1; }); } });
      if (sira >= kj.bolumler.length) sira = 0;
      var kok = $('.okuyucu', ana);
      if (!kok || kok.dataset.kitap !== kitapId) kok = okuyucuIskelet(kj, il);
      rayGuncelle(kok, kj, sira, il);
      var alan = $('.metin', kok);
      alan.innerHTML = '';
      alan.appendChild(el('div', { class: 'yukleniyor', text: 'Bölüm yükleniyor…' }));
      return Kitaplik.bolumAc(kitapId, sira).then(function (bolum) {
        if (Durum.kitapId !== kitapId || Durum.bolumSira !== sira) return;
        bolumCiz(alan, bolum, kj, { sorular: soruHarita, kt: ktHarita, ktCevap: ktCevap });
        Durum.aktifBolum = bolum; Durum.aktifKitap = kj;
        var hedef = null;
        if (devamBlok) { hedef = document.getElementById('b-' + devamBlok); devamBlok = null; }
        else if (altSira != null) hedef = document.getElementById('alt-' + (bolum.altlar[altSira] || {}).id);
        if (Durum.vurguBlok) { hedef = document.getElementById('b-' + Durum.vurguBlok) || hedef; if (hedef) { hedef.classList.add('parla'); } Durum.vurguBlok = null; }
        if (hedef) { var h = hedef; requestAnimationFrame(function () { h.scrollIntoView({ block: 'start' }); }); }
        else window.scrollTo(0, 0);
        konumIzle(kj, bolum, sira);
      });
    }).catch(function (e) {
      ana.innerHTML = '';
      ana.appendChild(el('div', { class: 'sayfa' }, [el('div', { class: 'bos', text: 'Açılamadı: ' + e.message })]));
    });
  };

  function okuyucuIskelet(kj, il) {
    var ana = $('#ana');
    ana.innerHTML = '';
    var renk = kj.renk;
    var kok = el('div', { class: 'okuyucu', 'data-kitap': kj.id, style: '--k:' + renk });
    var ray = el('nav', { class: 'ray', 'aria-label': 'İçindekiler' });
    var alanKap = el('div', { class: 'okuma-alani' });
    kok.appendChild(ray); kok.appendChild(alanKap);
    // araç çubuğu
    var arac = el('div', { class: 'arac-cubugu' });
    arac.appendChild(el('button', { class: 'ikon-dugme cekmece-dugme', type: 'button', 'aria-label': 'İçindekiler', onclick: function () { ray.classList.toggle('acik'); } }, ['☰']));
    arac.appendChild(el('strong', { class: 'kitap-adi', style: 'color:' + renk, text: kj.baslik }));
    arac.appendChild(el('span', { class: 'ayrac' }));
    arac.appendChild(el('button', { class: 'ikon-dugme', type: 'button', 'aria-label': 'Yazıyı küçült', onclick: function () { boyut(-0.06); } }, ['A−']));
    arac.appendChild(el('button', { class: 'ikon-dugme', type: 'button', 'aria-label': 'Yazıyı büyüt', onclick: function () { boyut(0.06); } }, ['A+']));
    var filtreDugme = el('button', { class: 'ikon-dugme', type: 'button', 'aria-expanded': 'false', 'aria-label': 'Kutu filtreleri', onclick: function () {
      fp.hidden = !fp.hidden; filtreDugme.setAttribute('aria-expanded', String(!fp.hidden)); } }, ['⧩', el('span', { class: 'uzun', text: ' Kutular' })]);
    arac.appendChild(filtreDugme);
    arac.appendChild(el('button', { class: 'ikon-dugme', type: 'button', 'aria-label': 'Bu kitapta ara', onclick: function () { aramaAc(kj.id); } }, ['⌕']));
    alanKap.appendChild(arac);
    var fp = el('div', { class: 'filtre-panel', hidden: true });
    alanKap.appendChild(fp);
    filtreCiz(fp, kj, kok);
    alanKap.appendChild(el('div', { class: 'metin', style: '--okuma:' + Durum.ayar.boyut + 'rem' }));
    ana.appendChild(kok);
    // içindekiler
    ray.appendChild(el('h3', { text: 'İçindekiler' }));
    kj.bolumler.forEach(function (b, i) {
      var bt = el('button', { class: 'ray-bolum', type: 'button', 'data-sira': i, onclick: function () { ray.classList.remove('acik'); git(okuHash(kj.id, i)); } },
        [el('span', { text: b.baslik }), el('span', { class: 'ilerle' }, [el('i', { style: 'width:0' })])]);
      ray.appendChild(bt);
      var altKap = el('div', { class: 'ray-altlar', 'data-sira': i, hidden: true });
      b.altlar.forEach(function (a, ai) {
        if (!a.baslik) return;
        altKap.appendChild(el('button', { class: 'ray-alt', type: 'button', 'data-alt': a.id, onclick: function () {
          ray.classList.remove('acik');
          if (Durum.bolumSira === i) { var h = document.getElementById('alt-' + a.id); if (h) h.scrollIntoView({ block: 'start' }); }
          else git(okuHash(kj.id, i, ai));
        } }, [a.baslik]));
      });
      ray.appendChild(altKap);
    });
    function boyut(d) {
      Durum.ayar.boyut = Math.max(0.85, Math.min(1.5, +(Durum.ayar.boyut + d).toFixed(2))); ayarKaydet();
      $('.metin', kok).style.setProperty('--okuma', Durum.ayar.boyut + 'rem');
    }
    return kok;
  }

  function filtreCiz(fp, kj, kok) {
    fp.innerHTML = '';
    var gizli = Durum.ayar.gizli || [];
    var turler = Object.keys(kj.turler || {});
    var stil = el('style');
    function uygula() {
      stil.textContent = (Durum.ayar.gizli || []).map(function (t) { return '.okuyucu .co-' + t + '{display:none}'; }).join('');
      kok.classList.toggle('gizle-hepsi', !!Durum.ayar.yalniz);
      ayarKaydet();
    }
    fp.appendChild(el('span', { class: 'var-etiket', style: 'width:100%', text: 'Göster/gizle:' }));
    turler.forEach(function (t) {
      var b = turBilgi(kj, t);
      var c = el('button', { class: 'cip', type: 'button', style: '--c:' + b.renk, 'aria-pressed': String(gizli.indexOf(t) < 0) },
        [el('span', { class: 'nokta' }), b.ikon + ' ' + b.etiket]);
      c.addEventListener('click', function () {
        var g = Durum.ayar.gizli = Durum.ayar.gizli || [];
        var i = g.indexOf(t);
        if (i >= 0) g.splice(i, 1); else g.push(t);
        c.setAttribute('aria-pressed', String(i >= 0));
        uygula();
      });
      fp.appendChild(c);
    });
    var yalniz = el('button', { class: 'cip', type: 'button', 'aria-pressed': String(!!Durum.ayar.yalniz) }, ['Yalnız kutular (düz metni gizle)']);
    yalniz.addEventListener('click', function () { Durum.ayar.yalniz = !Durum.ayar.yalniz; yalniz.setAttribute('aria-pressed', String(Durum.ayar.yalniz)); uygula(); });
    fp.appendChild(yalniz);
    fp.appendChild(el('button', { class: 'cip', type: 'button', onclick: function () { Durum.ayar.gizli = []; Durum.ayar.yalniz = false; filtreCiz(fp, kj, kok); } }, ['Sıfırla']));
    fp.appendChild(stil);
    uygula();
  }

  function rayGuncelle(kok, kj, sira, il) {
    var okunan = ((il || {}).okunan || {})[kj.id] || {};
    $$('.ray-bolum', kok).forEach(function (b) {
      var i = +b.dataset.sira, bl = kj.bolumler[i];
      b.setAttribute('aria-current', String(i === sira));
      var n = bl.altlar.filter(function (a) { return okunan[a.id]; }).length;
      $('.ilerle i', b).style.width = (bl.altlar.length ? Math.round(100 * n / bl.altlar.length) : 0) + '%';
    });
    $$('.ray-altlar', kok).forEach(function (a) { a.hidden = +a.dataset.sira !== sira; });
    $$('.ray-alt', kok).forEach(function (a) { a.classList.toggle('okundu', !!okunan[a.dataset.alt]); });
    var aktif = $('.ray-bolum[aria-current="true"]', kok);
    if (aktif && aktif.scrollIntoViewIfNeeded) aktif.scrollIntoViewIfNeeded(); else if (aktif) aktif.scrollIntoView({ block: 'nearest' });
  }

  function bolumCiz(alan, bolum, kj, ctx) {
    alan.innerHTML = '';
    alan.appendChild(el('div', { class: 'ust-etiket', style: 'margin-top:18px', text: kj.baslik + (bolum.no != null ? ' · Bölüm ' + bolum.no : '') }));
    alan.appendChild(el('h1', { text: bolum.kisa || bolum.baslik }));
    alan.appendChild(el('div', { class: 'jane-satir', style: 'display:flex;gap:8px;flex-wrap:wrap;margin:6px 0 14px' }, [
      el('button', { class: 'dugme kucuk', type: 'button', text: '📖 Jane ile 0\'dan öğren', onclick: function () { if (window.JaneDers) JaneDers.baslat(kj.id, bolum.sira); } })
    ]));
    bolum.altlar.forEach(function (a) {
      var kap = el('section', { class: 'alt-bolum', id: 'alt-' + a.id, 'data-alt': a.id });
      if (a.baslik) kap.appendChild(el('h2', { class: 'blok baslik-blok', text: a.baslik }));
      a.bloklar.forEach(function (b) { kap.appendChild(blokCiz(b, kj, ctx)); });
      kap.appendChild(el('div', { class: 'alt-son', 'data-alt': a.id }));
      alan.appendChild(kap);
    });
    // önceki / sonraki
    var nav = el('div', { style: 'display:flex;gap:10px;justify-content:space-between;margin:40px 0 0;flex-wrap:wrap' });
    if (bolum.sira > 0) nav.appendChild(el('button', { class: 'dugme', type: 'button', onclick: function () { git(okuHash(kj.id, bolum.sira - 1)); } }, ['← ' + kj.bolumler[bolum.sira - 1].kisa]));
    nav.appendChild(el('span'));
    if (bolum.sira < kj.bolumler.length - 1) nav.appendChild(el('button', { class: 'dugme ana', type: 'button', onclick: function () { git(okuHash(kj.id, bolum.sira + 1)); } }, [kj.bolumler[bolum.sira + 1].kisa + ' →']));
    alan.appendChild(nav);
    atiflariBagla(alan, kj);
    if (window.Uygulama && window.Uygulama.sonIsle) window.Uygulama.sonIsle(alan, bolum, kj);
  }

  // Okuma konumu ve okunan alt bölümler
  function konumIzle(kj, bolum, sira) {
    if (gozlemci) gozlemci.disconnect();
    if (konumGozlemci) konumGozlemci.disconnect();
    var kaydetKonum = geciktir(function (blokId) {
      depoGuncelle('ilerleme', function (v) {
        v.okuma = v.okuma || {};
        v.okuma[kj.id] = { bolum: sira, blok: blokId, t: Date.now() };
        v.son = { kitap: kj.id, bolum: sira, blok: blokId, t: Date.now() };
      }, 2500);
    }, 1200);
    konumGozlemci = new IntersectionObserver(function (girdiler) {
      var gorunen = girdiler.filter(function (g) { return g.isIntersecting; });
      if (!gorunen.length) return;
      var ust = gorunen.sort(function (a, b) { return a.boundingClientRect.top - b.boundingClientRect.top; })[0];
      var id = ust.target.id.replace(/^b-/, '');
      kaydetKonum(id);
      var altId = ust.target.closest('.alt-bolum') && ust.target.closest('.alt-bolum').dataset.alt;
      $$('.ray-alt').forEach(function (x) { x.classList.toggle('burada', x.dataset.alt === altId); });
    }, { rootMargin: '-120px 0px -60% 0px' });
    $$('.metin > .alt-bolum > .blok').forEach(function (b) { konumGozlemci.observe(b); });
    gozlemci = new IntersectionObserver(function (girdiler) {
      girdiler.forEach(function (g) {
        if (!g.isIntersecting) return;
        var altId = g.target.dataset.alt;
        gozlemci.unobserve(g.target);
        depoGuncelle('ilerleme', function (v) {
          v.okunan = v.okunan || {}; v.okunan[kj.id] = v.okunan[kj.id] || {};
          if (!v.okunan[kj.id][altId]) v.okunan[kj.id][altId] = 1;
        }, 2500).then(function (v) { rayGuncelle($('.okuyucu'), kj, sira, v); });
      });
    });
    $$('.alt-son').forEach(function (b) { gozlemci.observe(b); });
  }

  /* =============== galeri =============== */
  function katmanKapat() { var k = $('#katman'); if (k) k.innerHTML = ''; document.body.style.overflow = ''; }
  function galeriAc(kj, figurId) {
    var sirali = kj.figurler.filter(function (f) { return f.src; });
    var slaytSirasi = sirali.filter(function (f) { return f.slayt; }).sort(function (a, b) {
      var x = /S(\d+)([a-z]?)-s(\d+)/.exec(a.slayt), y = /S(\d+)([a-z]?)-s(\d+)/.exec(b.slayt);
      return (+x[1] - +y[1]) || x[2].localeCompare(y[2]) || (+x[3] - +y[3]);
    });
    var mod = 'kitap', liste = sirali;
    var i = Math.max(0, liste.findIndex(function (f) { return f.id === figurId; }));
    var katman = $('#katman');
    katman.innerHTML = '';
    document.body.style.overflow = 'hidden';
    var resim = el('img', { alt: '' });
    var sahne = el('div', { class: 'ik-sahne', onclick: function (e) { if (e.target === resim) sahne.classList.toggle('buyuk'); } }, [resim]);
    var baslik = el('div', { class: 'ik-baslik', 'aria-live': 'polite' });
    var serit = el('div', { class: 'serit-kucuk' });
    var modDugme = el('button', { class: 'dugme kucuk', type: 'button', hidden: !slaytSirasi.length, onclick: function () {
      var simdiki = liste[i];
      mod = mod === 'kitap' ? 'slayt' : 'kitap'; liste = mod === 'kitap' ? sirali : slaytSirasi;
      i = Math.max(0, liste.indexOf(simdiki)); seritCiz(); goster();
    } });
    var kutu = el('div', { class: 'isik-kutu', role: 'dialog', 'aria-modal': 'true', 'aria-label': 'Görsel galerisi' }, [
      el('div', { class: 'ik-ust' }, [baslik, el('button', { class: 'ikon-dugme', type: 'button', 'aria-label': 'Kapat (Esc)', onclick: kapat }, ['✕'])]),
      sahne,
      el('div', { class: 'ik-alt' }, [
        el('button', { class: 'dugme kucuk', type: 'button', onclick: function () { adim(-1); } }, ['← Önceki']),
        el('button', { class: 'dugme kucuk', type: 'button', onclick: function () { adim(1); } }, ['Sonraki →']),
        el('button', { class: 'dugme kucuk', type: 'button', onclick: function () { sahne.classList.toggle('buyuk'); } }, ['⤢ Büyüt']),
        modDugme,
        el('span', { class: 'ayrac', style: 'flex:1' }),
        el('button', { class: 'dugme kucuk', type: 'button', onclick: function () { var f = liste[i]; kapat(); figureGit(kj, f); } }, ['Metinde göster']),
        serit
      ])
    ]);
    katman.appendChild(kutu);
    function seritCiz() {
      serit.innerHTML = '';
      liste.forEach(function (f, j) { serit.appendChild(el('img', { src: f.src, alt: f.baslik || '', loading: 'lazy', onclick: function () { i = j; goster(); } })); });
    }
    function goster() {
      var f = liste[i];
      resim.src = f.src; resim.alt = f.alt || f.baslik || '';
      sahne.classList.remove('buyuk');
      baslik.innerHTML = '';
      baslik.appendChild(el('strong', { text: f.slayt ? f.slayt + (f.konu ? ' · ' + f.konu : '') : (f.baslik || 'Görsel') }));
      baslik.appendChild(el('small', { text: (i + 1) + ' / ' + liste.length + (f.slayt && f.alt && f.alt !== f.slayt ? ' · ' + f.alt : '') + ' · ' + (mod === 'kitap' ? 'kitap sırası' : 'slayt sırası') }));
      modDugme.textContent = mod === 'kitap' ? 'Slayt sırasıyla gez' : 'Kitap sırasıyla gez';
      if (window.Uygulama.galeriEk) window.Uygulama.galeriEk(baslik, f, kj);
      $$('img', serit).forEach(function (x, j) { x.setAttribute('aria-current', String(j === i)); if (j === i) x.scrollIntoView({ block: 'nearest', inline: 'center' }); });
    }
    function adim(d) { i = (i + d + liste.length) % liste.length; goster(); }
    function tus(e) { if (e.key === 'Escape') kapat(); else if (e.key === 'ArrowRight') adim(1); else if (e.key === 'ArrowLeft') adim(-1); }
    var dx = null;
    sahne.addEventListener('touchstart', function (e) { dx = e.touches.length === 1 && !sahne.classList.contains('buyuk') ? e.touches[0].clientX : null; }, { passive: true });
    sahne.addEventListener('touchend', function (e) { if (dx == null) return; var f = e.changedTouches[0].clientX - dx; if (Math.abs(f) > 60) adim(f < 0 ? 1 : -1); dx = null; });
    function kapat() { document.removeEventListener('keydown', tus); katmanKapat(); }
    document.addEventListener('keydown', tus);
    seritCiz(); goster();
    $('button', kutu).focus();
  }
  function figureGit(kj, f) {
    var blok = null;
    Kitaplik.ac(kj.id).then(function () {
      var b = kj.bolumler.findIndex(function (x) { return x.id === f.bolum; });
      if (b < 0) return;
      return Kitaplik.bolumAc(kj.id, b).then(function (bol) {
        bol.altlar.forEach(function (a) { a.bloklar.forEach(function (x) { if (x.t === 'figur' && x.figurler.indexOf(f.id) >= 0 && !blok) blok = x.id; }); });
        Durum.vurguBlok = blok; git(okuHash(kj.id, b));
      });
    });
  }

  /* =============== arama =============== */
  var AramaIndeksi = {}; // kitapId -> [{b, a, id, metin, katli, tur}]
  function indeksle(kitapId) {
    if (AramaIndeksi[kitapId]) return AramaIndeksi[kitapId];
    AramaIndeksi[kitapId] = Promise.all([Kitaplik.ac(kitapId), Kitaplik.tumBolumler(kitapId)]).then(function (r) {
      var kj = r[0], liste = [];
      r[1].forEach(function (bol, bi) {
        bol.altlar.forEach(function (a, ai) {
          if (a.baslik) liste.push({ b: bi, a: ai, id: null, alt: a.id, metin: a.baslik, katli: katla(a.baslik), tur: 'baslik' });
          (function gez(bl, tur) {
            bl.forEach(function (x) {
              var m = '';
              if (x.html) m = duz(x.html);
              else if (x.ogeler) m = duz(x.ogeler.join(' • '));
              else if (x.satir) m = duz((x.bas || []).join(' | ') + ' ' + x.satir.map(function (s) { return s.join(' | '); }).join(' / '));
              else if (x.metin) m = x.metin;
              if (m) liste.push({ b: bi, a: ai, id: x.id, metin: m, katli: katla(m), tur: tur || x.t });
              if (x.bloklar) gez(x.bloklar, x.t === 'callout' ? x.tur : tur);
            });
          })(a.bloklar, null);
        });
      });
      return { kj: kj, liste: liste };
    }).catch(function (e) { delete AramaIndeksi[kitapId]; throw e; });
    return AramaIndeksi[kitapId];
  }
  function aramaAc(kitapKapsam) {
    var katman = $('#katman');
    katman.innerHTML = '';
    var kapsam = kitapKapsam || 'hepsi';
    var girdi = el('input', { id: 'aramaGirdi', type: 'search', placeholder: 'Ara: femur boynu, standart hata, hemoglobin…', autocomplete: 'off', 'aria-label': 'Arama' });
    var sonuc = el('div', { class: 'sonuclar', 'aria-live': 'polite' });
    var ayar = el('div', { class: 'arama-ayar' });
    var kap = el('div', { class: 'arama-kap', onclick: function (e) { if (e.target === kap) kapat(); } }, [
      el('div', { class: 'arama-kutu', role: 'dialog', 'aria-modal': 'true', 'aria-label': 'Arama' }, [
        el('div', { class: 'arama-satir' }, [girdi, el('button', { class: 'ikon-dugme', type: 'button', 'aria-label': 'Kapat', onclick: kapat }, ['✕'])]),
        ayar, sonuc])
    ]);
    katman.appendChild(kap);
    function kapat() { document.removeEventListener('keydown', tus); katmanKapat(); }
    function tus(e) { if (e.key === 'Escape') kapat(); }
    document.addEventListener('keydown', tus);
    Kitaplik.katalog().then(function (liste) {
      ayar.innerHTML = '';
      ayar.appendChild(el('span', { text: 'Kapsam:' }));
      [{ id: 'hepsi', baslik: 'Tüm kitaplar' }].concat(liste).forEach(function (k) {
        var c = el('button', { class: 'cip', type: 'button', 'aria-pressed': String(kapsam === k.id), style: k.renk ? '--c:' + k.renk : null }, [k.baslik]);
        c.addEventListener('click', function () { kapsam = k.id; $$('.cip', ayar).forEach(function (x) { x.setAttribute('aria-pressed', String(x === c)); }); ara(); });
        ayar.appendChild(c);
      });
    });
    var sayac = 0;
    var ara = geciktir(function () {
      var q = girdi.value.trim();
      var benim = ++sayac;
      sonuc.innerHTML = '';
      if (q.length < 2) { sonuc.appendChild(el('div', { class: 'var-etiket', style: 'padding:12px', text: 'En az 2 harf yaz. Büyük/küçük harf ve ı/i, ş/s, ğ/g, ç/c, ö/o, ü/u farkı önemsizdir.' })); return; }
      sonuc.appendChild(el('div', { class: 'yukleniyor', text: 'Aranıyor (ilk aramada kitaplar yükleniyor)…' }));
      var qk = katla(q);
      Kitaplik.katalog().then(function (liste) {
        var hedef = kapsam === 'hepsi' ? liste : liste.filter(function (k) { return k.id === kapsam; });
        return Promise.all(hedef.map(function (k) { return indeksle(k.id).catch(function () { return null; }); }));
      }).then(function (indeksler) {
        if (benim !== sayac) return;
        sonuc.innerHTML = '';
        var toplam = 0;
        indeksler.forEach(function (ix) {
          if (!ix) return;
          var bulunan = [];
          for (var i = 0; i < ix.liste.length && bulunan.length < 60; i++) if (ix.liste[i].katli.indexOf(qk) >= 0) bulunan.push(ix.liste[i]);
          if (!bulunan.length) return;
          toplam += bulunan.length;
          sonuc.appendChild(el('div', { class: 'sonuc-grup', style: 'color:' + ix.kj.renk, text: ix.kj.baslik + ' · ' + bulunan.length + (bulunan.length === 60 ? '+' : '') + ' sonuç' }));
          bulunan.forEach(function (r) {
            var bol = ix.kj.bolumler[r.b], alt = bol.altlar[r.a];
            var konum = r.katli.indexOf(qk), bas = Math.max(0, konum - 70), son = Math.min(r.metin.length, konum + qk.length + 110);
            var parca = r.metin.slice(bas, son), vurgu = esc(parca);
            if (r.katli.length === r.metin.length) {
              var o = konum - bas;
              vurgu = esc(parca.slice(0, o)) + '<mark>' + esc(parca.slice(o, o + qk.length)) + '</mark>' + esc(parca.slice(o + qk.length));
            }
            sonuc.appendChild(el('button', { class: 'sonuc', type: 'button', onclick: function () {
              kapat(); Durum.vurguBlok = r.id; if (!r.id) devamBlok = null;
              git(okuHash(ix.kj.id, r.b, r.id ? null : r.a));
            } }, [el('small', { text: (bol.no != null ? 'Bölüm ' + bol.no : bol.kisa) + (alt && alt.baslik ? ' › ' + alt.baslik : '') + (r.tur && r.tur !== 'p' && r.tur !== 'baslik' ? ' · ' + r.tur : '') }),
              el('span', { html: (bas > 0 ? '…' : '') + vurgu + (son < r.metin.length ? '…' : '') })]));
          });
        });
        if (!toplam) sonuc.appendChild(el('div', { class: 'bos', text: '“' + q + '” için sonuç yok.' }));
      });
    }, 220);
    girdi.addEventListener('input', ara);
    girdi.focus();
    ara();
  }
  $('#aramaAc').addEventListener('click', function () { aramaAc(Durum.gorunum === 'oku' ? Durum.kitapId : null); });
  document.addEventListener('keydown', function (e) {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); aramaAc(Durum.gorunum === 'oku' ? Durum.kitapId : null); }
  });

  /* =============== başlat =============== */
  window.Uygulama = { Y: Y, Depo: Depo, Kitaplik: Kitaplik, Durum: Durum, git: git, el: el, $: $, $$: $$, esc: esc, duz: duz, toast: toast, okuHash: okuHash,
    GORUNUMLER: GORUNUMLER, SEKMELER: SEKMELER, sekmeleriCiz: sekmeleriCiz, blokCiz: blokCiz, soruCiz: soruCiz, turBilgi: turBilgi, galeriAc: galeriAc,
    atiflariBagla: atiflariBagla, depoGuncelle: depoGuncelle, yetenekSozu: yetenekSozu, katmanKapat: katmanKapat, indeksle: indeksle, ls: ls, geciktir: geciktir };
  yonlendir();
})();
