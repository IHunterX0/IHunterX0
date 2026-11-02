/* 1001 Çalışma Kitapları — kitap ayrıştırıcı (tarayıcı + Node ortak).
   Girdi: DOM Document (DOMParser / linkedom). Çıktı: kanonik kitap (KITAP_SEMASI.md). */
(function (kok, fabrika) {
  if (typeof module === 'object' && module.exports) module.exports = fabrika();
  else kok.KitapAyristir = fabrika();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';
  var SEMA = '1001-kitap/1';

  /* ---------- yardımcılar ---------- */
  function fnv(s) {
    var h = 0x811c9dc5;
    for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; }
    return h.toString(36);
  }
  function bosluk(s) { return String(s || '').replace(/\s+/g, ' ').trim(); }
  function trKucuk(s) { return String(s || '').toLocaleLowerCase('tr'); }
  function katla(s) {
    return trKucuk(s).replace(/[ıİ]/g, 'i').replace(/ş/g, 's').replace(/ğ/g, 'g').replace(/ç/g, 'c')
      .replace(/ö/g, 'o').replace(/ü/g, 'u').replace(/[âàá]/g, 'a').replace(/[îí]/g, 'i').replace(/[ûú]/g, 'u');
  }
  function kacis(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function slug(s) { return katla(s).replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40) || 'kitap'; }

  /* ---------- güvenli HTML (izin listesi) ---------- */
  var SATIRICI = { STRONG: 'strong', B: 'strong', EM: 'em', I: 'em', BR: 'br', CODE: 'code', SUB: 'sub', SUP: 'sup',
    U: 'u', S: 's', DEL: 's', SMALL: 'small', MARK: 'mark' };
  var BLOKICI = { UL: 'ul', OL: 'ol', LI: 'li', P: 'p' };
  function temizHtml(dugum, bloklarIzinli) {
    var out = '';
    var ch = dugum.childNodes;
    for (var i = 0; i < ch.length; i++) {
      var n = ch[i];
      if (n.nodeType === 3) { out += kacis(n.nodeValue); continue; }
      if (n.nodeType !== 1) continue;
      var t = n.tagName.toUpperCase();
      if (t === 'SCRIPT' || t === 'STYLE' || t === 'IFRAME' || t === 'OBJECT' || t === 'EMBED' || t === 'TEMPLATE') continue;
      if (t === 'BR') { out += '<br>'; continue; }
      if (t === 'SPAN' && /(^|\s)kod(\s|$)/.test(n.getAttribute('class') || '')) {
        out += '<span class="kod">' + temizHtml(n, false) + '</span>'; continue;
      }
      var ad = SATIRICI[t] || (bloklarIzinli && BLOKICI[t]);
      if (ad) out += '<' + ad + '>' + temizHtml(n, bloklarIzinli) + '</' + ad + '>';
      else out += temizHtml(n, bloklarIzinli); // izin yok: aç, içeriği koru
    }
    return out;
  }
  function metin(n) { return bosluk(n ? n.textContent : ''); }

  /* ---------- callout türleri ---------- */
  var TURLER = {
    neden: { etiket: 'Neden böyle?', ikon: '🧭', renk: '#4fb3d9' },
    koken: { etiket: 'Kelime kökeni', ikon: '🔤', renk: '#b48ce0' },
    klinik: { etiket: 'Ne olursa ne olur', ikon: '🩺', renk: '#e06c75' },
    tuzak: { etiket: 'Tuzak', ikon: '⚠️', renk: '#e5a33b' },
    soru: { etiket: 'Çıkmış soru', ikon: '📝', renk: '#5fd3a0' },
    hikaye: { etiket: 'Keşif hikâyesi', ikon: '🔬', renk: '#d4b45c' },
    siklik: { etiket: 'Nerede, ne sık', ikon: '📊', renk: '#6a9ff0' },
    cozelim: { etiket: 'Gel çözelim', ikon: '🧮', renk: '#3fc1c9' },
    formul: { etiket: 'Formül', ikon: '📐', renk: '#8bb8ff' },
    test: { etiket: 'Test kartı', ikon: '🧪', renk: '#7fd17f' },
    hoca: { etiket: 'Hoca vurgusu', ikon: '🎯', renk: '#f07ab0' },
    genel: { etiket: 'Not', ikon: '💬', renk: '#8fa3b8' }
  };
  function sinifsizTur(etiket) {
    var e = katla(etiket);
    if (/hoca vurgu/.test(e)) return 'hoca';
    if (/^(🔤 )?kelime koken/.test(e)) return 'koken';
    if (/tuzak/.test(e) && e.length < 30) return 'tuzak';
    return 'genel';
  }

  /* ---------- ana HTML içe aktarıcı ---------- */
  function htmlKitap(doc, ayar) {
    ayar = ayar || {};
    var rapor = { uyarilar: [], bilinmeyenTurler: {}, eksikGorseller: [], gorselSayisi: 0 };
    var body = doc.body || doc.documentElement;
    // Kapanmamış <details>: cevap metninden sonraki blok öğeleri details'in dışına (ardına) taşı.
    var BLOKLAR = /^(P|H[1-6]|DETAILS|BLOCKQUOTE|TABLE|HR|DIV|UL|OL|PRE|FIGURE)$/;
    var detaylar = body.querySelectorAll('details');
    for (var di = 0; di < detaylar.length; di++) {
      var dt = detaylar[di], kes = null;
      for (var ci = 0; ci < dt.childNodes.length; ci++) {
        var cn0 = dt.childNodes[ci];
        if (cn0.nodeType === 1 && cn0.tagName.toUpperCase() !== 'SUMMARY' && BLOKLAR.test(cn0.tagName.toUpperCase())) { kes = cn0; break; }
      }
      if (!kes) continue;
      var tasinan = [];
      for (var x0 = kes; x0; x0 = x0.nextSibling) tasinan.push(x0);
      var sonra = dt.nextSibling;
      for (var ti = 0; ti < tasinan.length; ti++) dt.parentNode.insertBefore(tasinan[ti], sonra);
    }
    function satirliMetin(n) { if (!n) return ''; var s = ''; (function g(x) { for (var i = 0; i < x.childNodes.length; i++) { var c = x.childNodes[i]; if (c.nodeType === 3) s += c.nodeValue; else if (c.nodeType === 1) { if (c.tagName.toUpperCase() === 'BR') s += ' '; else g(c); } } })(n); return bosluk(s); }
    var baslik = ayar.baslik || satirliMetin(doc.querySelector('title')) || satirliMetin(doc.querySelector('div.kapak h1')) || satirliMetin(doc.querySelector('h1')) || 'Adsız kitap';
    var id = ayar.id || slug(baslik.replace(/^1001\s*/, '').replace(/çalışma kitabı/i, ''));
    var stil = {};
    // <style> içinden callout renkleri (başlangıç paleti)
    var stiller = doc.querySelectorAll('style');
    for (var si = 0; si < stiller.length; si++) {
      var css = stiller[si].textContent, re = /blockquote\.([a-z]+)\s*\{([^}]*)\}/g, m;
      while ((m = re.exec(css))) {
        var r = /border-left[^;]*?(#[0-9a-fA-F]{3,6})/.exec(m[2]) || /border-color\s*:\s*(#[0-9a-fA-F]{3,6})/.exec(m[2]);
        if (r) stil[m[1]] = r[1];
      }
    }
    var turler = {};
    function turKullan(tur, sinif) {
      if (!turler[tur]) {
        var b = TURLER[tur];
        turler[tur] = b ? { etiket: b.etiket, ikon: b.ikon, renk: b.renk, kitapRengi: stil[tur] || null }
          : { etiket: sinif, ikon: '◆', renk: '#8fa3b8', kitapRengi: stil[sinif] || null, bilinmeyen: true };
      }
    }

    var bolumler = [];
    var figurler = [];
    var sorular = [];
    var terimler = [];
    var idSay = {};
    function blokId(onEk, txt) {
      var k = onEk + '-' + fnv(bosluk(txt).slice(0, 400));
      if (idSay[k]) { idSay[k]++; k = k + '_' + idSay[k]; } else idSay[k] = 1;
      return k;
    }

    var bolum = null, alt = null;
    function yeniAlt(no, bsl, hid) {
      alt = { id: hid || (bolum.id + '-' + (no ? no.replace(/\./g, '_') : fnv(bsl || ('g' + bolum.altlar.length)))), no: no, baslik: bsl, bloklar: [] };
      bolum.altlar.push(alt);
    }
    function ekle(b) { if (!bolum) return; if (!alt) yeniAlt(null, null); alt.bloklar.push(b); }

    function gorselEkle(img, cap, tek) {
      var src = img.getAttribute('src') || '';
      var cozulen = ayar.gorselCoz ? ayar.gorselCoz(src) : src;
      var altm = bosluk(img.getAttribute('alt'));
      var capm = cap ? bosluk(cap) : '';
      var sm = /\b(S\d{2}[a-z]?-s\d+)\b/.exec(capm + ' ' + altm + ' ' + src);
      var f = { id: 'f-' + fnv(src), src: cozulen || null, ozgunSrc: src, alt: altm, baslik: capm || altm, slayt: sm ? sm[1] : null,
        bolum: bolum ? bolum.id : null, alt_bolum: alt ? alt.id : null };
      if (capm) { var p = capm.split('·'); if (p.length > 1) f.konu = bosluk(p.slice(1).join('·')); }
      if (!cozulen) rapor.eksikGorseller.push(src);
      rapor.gorselSayisi++;
      // aynı görsel birden çok kez geçebilir
      var var_ = null;
      for (var i = 0; i < figurler.length; i++) if (figurler[i].id === f.id) { var_ = figurler[i]; break; }
      if (!var_) figurler.push(f);
      return f.id;
    }

    function tabloOku(t) {
      var bas = [], satir = [];
      var ths = t.querySelectorAll('thead th');
      for (var i = 0; i < ths.length; i++) bas.push(temizHtml(ths[i], false));
      var trs = t.querySelectorAll('tbody tr');
      if (!ths.length) trs = t.querySelectorAll('tr');
      for (var j = 0; j < trs.length; j++) {
        var hucre = trs[j].querySelectorAll('td,th'), s = [];
        for (var k = 0; k < hucre.length; k++) s.push(temizHtml(hucre[k], true));
        satir.push(s);
      }
      return { bas: bas, satir: satir };
    }
    function htmlDuz(h) { return bosluk(String(h).replace(/<br>/g, ' ').replace(/<[^>]+>/g, '').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&amp;/g, '&')); }

    function terimTablosu(tb, kaynakId) {
      if (!tb.satir.length || tb.satir[0].length < 2) return;
      var bas = tb.bas.map(htmlDuz);
      tb.satir.forEach(function (s) {
        var terim = htmlDuz(s[0]);
        if (!terim || terim.length > 80) return;
        var alan = {};
        for (var i = 1; i < s.length; i++) { var v = htmlDuz(s[i]); if (v && v !== '→') alan[bas[i] || ('s' + i)] = v; }
        terimler.push({ terim: terim, basA: bas[0] || 'Terim', alanlar: alan, blok: kaynakId });
      });
    }

    /* düğüm → blok(lar) */
    function bloklar(dugum, onEk, hedef, ctx) {
      var ch = dugum.children;
      for (var i = 0; i < ch.length; i++) tekBlok(ch[i], onEk, hedef, ctx);
    }
    function tekBlok(n, onEk, hedef, ctx) {
      var t = n.tagName.toUpperCase();
      var cls = n.getAttribute('class') || '';
      if (t === 'HR' || t === 'SCRIPT' || t === 'STYLE') return;
      if (t === 'DIV') {
        if (/\b(kapak|icindekiler)\b/.test(cls)) return;
        if (/\bslaytlar\b/.test(cls)) {
          var figs = n.querySelectorAll('figure'), og = [];
          for (var i = 0; i < figs.length; i++) {
            var im = figs[i].querySelector('img'); if (!im) continue;
            var fc = figs[i].querySelector('figcaption');
            og.push(gorselEkle(im, fc ? fc.textContent : '', /\btek\b/.test(cls)));
          }
          if (og.length) hedef.push({ t: 'figur', id: blokId(onEk, 'fig' + og.join()), figurler: og, tek: /\btek\b/.test(cls) });
          return;
        }
        bloklar(n, onEk, hedef, ctx); return;
      }
      if (t === 'FIGURE') {
        var im2 = n.querySelector('img'); if (!im2) return;
        var fc2 = n.querySelector('figcaption');
        var fid = gorselEkle(im2, fc2 ? fc2.textContent : '', true);
        hedef.push({ t: 'figur', id: blokId(onEk, 'fig' + fid), figurler: [fid], tek: true }); return;
      }
      if (t === 'P') {
        var imgs = n.querySelectorAll('img');
        if (imgs.length && !bosluk(n.textContent)) {
          var ids = []; for (var a = 0; a < imgs.length; a++) ids.push(gorselEkle(imgs[a], '', true));
          hedef.push({ t: 'figur', id: blokId(onEk, 'fig' + ids.join()), figurler: ids, tek: ids.length === 1 }); return;
        }
        var h = temizHtml(n, false).trim();
        if (!h) return;
        var tx = n.textContent;
        var b = { t: 'p', id: blokId(onEk, tx), html: h };
        hedef.push(b);
        if (imgs.length) for (var c = 0; c < imgs.length; c++) {
          var fid3 = gorselEkle(imgs[c], '', true);
          hedef.push({ t: 'figur', id: blokId(onEk, 'fig' + fid3), figurler: [fid3], tek: true });
        }
        return;
      }
      if (t === 'IMG') {
        var fid4 = gorselEkle(n, '', true);
        hedef.push({ t: 'figur', id: blokId(onEk, 'fig' + fid4), figurler: [fid4], tek: true }); return;
      }
      if (t === 'UL' || t === 'OL') {
        var lis = [], c2 = n.children;
        for (var d = 0; d < c2.length; d++) if (c2[d].tagName.toUpperCase() === 'LI') lis.push(temizHtml(c2[d], true).trim());
        var lb = { t: 'liste', id: blokId(onEk, n.textContent), sirali: t === 'OL', ogeler: lis };
        if (t === 'OL' && n.getAttribute('start')) lb.bas = parseInt(n.getAttribute('start'), 10) || 1;
        hedef.push(lb); return;
      }
      if (t === 'TABLE') {
        var tb = tabloOku(n);
        var tbb = { t: 'tablo', id: blokId(onEk, n.textContent), bas: tb.bas, satir: tb.satir };
        hedef.push(tbb);
        if (ctx && (ctx.koken || ctx.sozluk)) terimTablosu(tb, tbb.id);
        return;
      }
      if (t === 'PRE') { hedef.push({ t: 'kod', id: blokId(onEk, n.textContent), metin: n.textContent.replace(/\n$/, '') }); return; }
      if (/^H[2-6]$/.test(t)) { hedef.push({ t: 'baslik', id: blokId(onEk, n.textContent), seviye: +t[1], html: temizHtml(n, false) }); return; }
      if (t === 'DETAILS') {
        var sm = n.querySelector('summary');
        var icerik = [];
        var hamMetin = '';
        for (var e = 0; e < n.childNodes.length; e++) {
          var cn = n.childNodes[e];
          if (cn.nodeType === 1 && cn.tagName.toUpperCase() === 'SUMMARY') continue;
          if (cn.nodeType === 3) hamMetin += cn.nodeValue;
          else if (cn.nodeType === 1 && /^(BR|STRONG|B|EM|I|CODE|SUB|SUP)$/.test(cn.tagName.toUpperCase())) {
            hamMetin += cn.tagName.toUpperCase() === 'BR' ? BR_I : AC_I + temizHtml({ childNodes: [cn] }, false) + KA_I;
          } else if (cn.nodeType === 1) { if (bosluk(hamMetin)) { mdParagraflar(hamMetin, onEk, icerik); hamMetin = ''; } tekBlok(cn, onEk, icerik, ctx); }
        }
        // Kapanmamış details: cevaplardan sonra gelen ham markdown (### başlık, **N.** sorular) dışarıdaki akışa aittir.
        var kesim = /\n#{2,4}\s/.exec('\n' + hamMetin);
        var disari = '';
        if (kesim) { disari = hamMetin.slice(kesim.index); hamMetin = hamMetin.slice(0, kesim.index); }
        if (bosluk(hamMetin)) mdParagraflar(hamMetin, onEk, icerik);
        var db = { t: 'acilir', id: blokId(onEk, n.textContent), ozet: sm ? temizHtml(sm, false) : 'Ayrıntı', bloklar: icerik };
        hedef.push(db);
        if (disari) mdParagraflar(disari, onEk, hedef);
        return;
      }
      if (t === 'BLOCKQUOTE') { hedef.push(callout(n, onEk, ctx)); return; }
      // bilinmeyen: içeriği paragraf olarak koru
      var hh = temizHtml(n, true).trim();
      if (hh) hedef.push({ t: 'p', id: blokId(onEk, n.textContent), html: hh });
    }

    var BR_I = '\u0001', AC_I = '\u0002', KA_I = '\u0003', ISARET = /[\u0001-\u0003]/g;
    function mdParagraflar(txt, onEk, hedef) {
      txt.split(/\n\s*\n/).forEach(function (par) {
        par = par.trim(); if (!par) return;
        var hm = /^(#{2,4})\s+([^\n]*)\n?([\s\S]*)$/.exec(par);
        if (hm) {
          hedef.push({ t: 'baslik', id: blokId(onEk, hm[2]), seviye: Math.min(4, hm[1].length + 1), html: kacis(hm[2].replace(ISARET, '')) });
          par = hm[3].trim(); if (!par) return;
        }
        var h = kacis(par).replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>').replace(/(^|[^*])\*([^*\n]+)\*/g, '$1<em>$2</em>')
          .replace(/\s*\n\s*/g, '<br>').replace(/\u0001/g, '<br>')
          .replace(/\u0002([\s\S]*?)\u0003/g, function (_, x) { return x.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&amp;/g, '&'); })
          .replace(/(<br>\s*)+/g, '<br>').replace(/^<br>|<br>$/g, '');
        hedef.push({ t: 'p', id: blokId(onEk, par), html: h, md: par.replace(ISARET, ' ') });
      });
    }

    function callout(n, onEk, ctx) {
      var cls = bosluk(n.getAttribute('class'));
      var ilkStrong = n.querySelector('strong');
      var etiket = ilkStrong ? bosluk(ilkStrong.textContent) : '';
      var tur = cls ? cls.split(' ')[0] : sinifsizTur(etiket);
      if (cls && !TURLER[tur]) rapor.bilinmeyenTurler[tur] = (rapor.bilinmeyenTurler[tur] || 0) + 1;
      turKullan(tur, tur);
      var ic = [];
      bloklar(n, onEk, ic, { koken: tur === 'koken', sozluk: ctx && ctx.sozluk });
      var b = { t: 'callout', id: blokId(onEk, n.textContent), tur: tur, etiket: etiket.replace(/:$/, ''), bloklar: ic };
      if (tur === 'soru' || /çıkmış soru|deneme \d/i.test(etiket)) {
        var aile = soruAilesi(n, b);
        if (aile) { b.soru = aile.id; sorular.push(aile); }
      }
      return b;
    }

    /* ---------- soru ailesi ---------- */
    function soruAilesi(bq, blok) {
      var ps = bq.children;
      var soruKis = [], cevapKis = [], cevapta = false;
      for (var i = 0; i < ps.length; i++) {
        var tx = bosluk(ps[i].textContent);
        if (!cevapta && /^🔑\s*Cevap/.test(tx)) { cevapta = true; var kalan = bosluk(tx.replace(/^🔑\s*Cevap\s*:?/, '')); if (kalan) cevapKis.push(ps[i]); continue; }
        (cevapta ? cevapKis : soruKis).push(ps[i]);
      }
      var bas = soruKis.length ? soruKis[0].querySelector('strong') : null;
      var baslikTx = bas ? bosluk(bas.textContent) : '';
      var aile = { id: 'q-' + blok.id, blok: blok.id, bolum: bolum.id, alt: alt ? alt.id : null, baslik: baslikTx,
        konu: null, kodlar: [], onem: { yildiz: 0, ates: false }, deneme: /deneme/i.test(baslikTx) || /deneme/i.test(bolum.baslik),
        varyantlar: [], cevapHtml: '', otomatik: false };
      var ym = /★\s*(\d+)/.exec(baslikTx); if (ym) aile.onem.yildiz = +ym[1];
      if (/🔥/.test(baslikTx)) aile.onem.ates = true;
      var km = baslikTx.match(/\b[A-ZÇĞİÖŞÜ]{2,4}-\d+\b/g); if (km) aile.kodlar = km;
      var konu = baslikTx.replace(/^📝\s*/, '').replace(/^(Çıkmış soru|Deneme)\s*\d*\s*—?\s*/i, '').replace(/\([^)]*\)/g, '').replace(/🔥|★\s*\d+/g, '');
      aile.konu = bosluk(konu) || null;

      // Soru kısmını satırlara böl (br ve paragraf sınırları), varyant başlıklarını yakala
      var satirlar = []; // {html, txt, strongBas}
      soruKis.forEach(function (p, pi) {
        var parca = temizHtml(p, true).split(/<br>/);
        parca.forEach(function (h, hi) {
          var tx = htmlDuz(h);
          if (!tx) return;
          satirlar.push({ html: h.trim(), txt: tx, ilk: pi === 0 && hi === 0 });
        });
      });
      // başlık satırını çıkar
      if (satirlar.length && satirlar[0].ilk) {
        var s0 = satirlar[0];
        var kalanH = s0.html.replace(/^<strong>[\s\S]*?<\/strong>/, '').trim();
        if (htmlDuz(kalanH)) { s0.html = kalanH; s0.txt = htmlDuz(kalanH); s0.ilk = false; } else satirlar.shift();
      }
      var VARB = /^<strong>\s*(?:([a-h])\)\s*)?([^<]*?(?:soru|Vize|Final|Bütünleme|Büt|Mazeret|Deneme)[^<]*?)\s*:?\s*<\/strong>\s*:?/i;
      var simdiki = null;
      function yeniVar(etk, sinavTx) {
        simdiki = { etiket: etk || null, sinav: null, no: null, kod: null, govde: [], siklar: [], cevap: null };
        if (sinavTx) {
          var sm2 = /(\d{2}-\d{2})\s+([A-Za-zÇĞİÖŞÜçğıöşü]+(?:\s+\d)?)/.exec(sinavTx);
          if (sm2) simdiki.sinav = sm2[1] + ' ' + sm2[2].replace(/\s+\d$/, '');
          var nm = /(\d+)\.\s*soru/.exec(sinavTx) || /·\s*(\d+)\b/.exec(sinavTx); if (nm) simdiki.no = +nm[1];
          var kd = /\(([A-ZÇĞİÖŞÜ]{2,4}-\d+)\)/.exec(sinavTx); if (kd) simdiki.kod = kd[1];
          simdiki.kaynakEtiket = bosluk(sinavTx.replace(/:$/, ''));
          if (/aynı kök/i.test(sinavTx)) simdiki.ayniKok = true;
        }
        aile.varyantlar.push(simdiki);
      }
      // tek-soru başlığı (Biyokimya: "Çıkmış soru — 24-25 Vize · 92. soru")
      var tekBaslik = /(\d{2}-\d{2})\s+[A-Za-zÇĞİÖŞÜçğıöşü]+.*?(\d+)\.\s*soru/.test(baslikTx);
      var SIK = /^\s*\(?([A-Ea-e])\)\s*(.*)$/;
      function satirIsle(s) {
        // tek satırda birden çok şık: "A) 0,33 B) 2 C) 3"
        var coklu = s.txt.match(/(^|\s)([A-E])\)\s/g);
        if (coklu && coklu.length >= 3 && /^\s*A\)/.test(s.txt)) {
          var parc = s.html.split(/(?:^|\s)(?=[A-E]\)\s)/);
          parc.forEach(function (pp) { var mm = SIK.exec(htmlDuz(pp)); if (mm) simdiki.siklar.push({ h: mm[1], m: kacis(mm[2]) }); });
          return;
        }
        var sm3 = SIK.exec(s.txt);
        if (sm3 && (simdiki.siklar.length || /^\s*\(?[Aa]\)/.test(s.txt))) {
          var beklenen = String.fromCharCode(65 + simdiki.siklar.length);
          if (sm3[1].toUpperCase() === beklenen) {
            simdiki.siklar.push({ h: sm3[1], m: s.html.replace(/^\s*\(?[A-Ea-e]\)\s*/, '') });
            return;
          }
        }
        if (simdiki.siklar.length) simdiki.sonNot = (simdiki.sonNot ? simdiki.sonNot + '<br>' : '') + s.html;
        else simdiki.govde.push(s.html);
      }
      satirlar.forEach(function (s) {
        var vm = VARB.exec(s.html);
        if (vm && (vm[1] || /soru|deneme/i.test(vm[2]))) {
          yeniVar(vm[1] || null, (vm[1] ? vm[1] + ') ' : '') + vm[2]);
          var geri = s.html.slice(vm[0].length).trim();
          if (/^\(aynı kök\)/i.test(htmlDuz(geri))) { simdiki.ayniKok = true; geri = geri.replace(/^\s*\(aynı kök\)\s*/i, ''); }
          if (htmlDuz(geri)) satirIsle({ html: geri, txt: htmlDuz(geri) });
          return;
        }
        if (!simdiki) yeniVar(null, tekBaslik ? baslikTx : null);
        satirIsle(s);
      });
      // "A. ... B. ..." biçimli şıklar: yalnız A–C ardışık satırlar varsa kabul
      aile.varyantlar.forEach(function (v) {
        if (v.siklar.length) return;
        var idx = -1;
        for (var i = 0; i < v.govde.length; i++) if (/^\s*A\.\s/.test(htmlDuz(v.govde[i])) && v.govde[i + 1] && /^\s*B\.\s/.test(htmlDuz(v.govde[i + 1])) && v.govde[i + 2] && /^\s*C\.\s/.test(htmlDuz(v.govde[i + 2]))) { idx = i; break; }
        if (idx < 0) return;
        var kalan = v.govde.splice(idx);
        kalan.forEach(function (h, j) {
          var harf = String.fromCharCode(65 + v.siklar.length);
          if (new RegExp('^\s*' + harf + '\.\s').test(htmlDuz(h)) && j === v.siklar.length) v.siklar.push({ h: harf, m: h.replace(/^\s*[A-E]\.\s*/, '') });
          else v.sonNot = (v.sonNot ? v.sonNot + '<br>' : '') + h;
        });
      });
      // "aynı kök": gövde yoksa ilk varyantın gövdesini göster
      var ilkGovde = aile.varyantlar.length ? aile.varyantlar[0].govde : [];
      aile.varyantlar.forEach(function (v) { if (v.ayniKok && !v.govde.length) v.govde = ilkGovde.slice(); });
      aile.varyantlar.forEach(function (v) { v.govde = v.govde.join('<br>'); });
      aile.varyantlar = aile.varyantlar.filter(function (v) { return v.siklar.length || htmlDuz(v.govde); });

      // cevap bölümü
      var cevapHtml = cevapKis.map(function (p) {
        var tag = p.tagName.toUpperCase();
        if (tag === 'UL' || tag === 'OL') return '<' + tag.toLowerCase() + '>' + temizHtml(p, true) + '</' + tag.toLowerCase() + '>';
        return '<p>' + temizHtml(p, true) + '</p>';
      }).join('');
      aile.cevapHtml = cevapHtml.replace(/^<p>\s*<strong>🔑\s*Cevap:?\s*<\/strong>\s*/, '<p>');
      var cevapTx = cevapKis.map(function (p) { return bosluk(p.textContent); }).join(' ');
      cevapAta(aile, cevapKis, cevapTx);
      return aile;
    }

    function cevapAta(aile, cevapKis, cevapTx) {
      if (!cevapKis.length || !aile.varyantlar.length) return;
      var ilk = cevapKis[0];
      var st = ilk.querySelector('strong');
      var stTx = st ? bosluk(st.textContent) : '';
      var ilkTx = bosluk(ilk.textContent).replace(/^🔑\s*Cevap\s*:?\s*/, '');
      var tartismali = /anahtar(?:ı|da|a göre)?\s+[A-E]\b|anahtarda|iptal edil|tartışmalı|itiraz/i.test(cevapTx);
      function gecerli(v, h) {
        if (!h) return null;
        for (var i = 0; i < v.siklar.length; i++) if (v.siklar[i].h.toUpperCase() === h.toUpperCase()) return v.siklar[i].h.toUpperCase();
        return null;
      }
      if (aile.varyantlar.length === 1) {
        var v = aile.varyantlar[0];
        var m = /^\(?([A-Ea-e])(?:\)|\s*—|\s*-|\.|\s*$|\s|,)/.exec(stTx) || /^\(?([A-Ea-e])(?:\)|\s*—|\s*-\s)/.exec(ilkTx);
        if (m && v.siklar.length) v.cevap = gecerli(v, m[1]);
      } else {
        var kaynak = stTx + ' ¦ ' + ilkTx;
        var re = /(?:^|[\s·;,(¦])([a-h])\)\s*:?\s*([A-Ea-e])(?=$|[\s).—,·;:\-¦])/g, mm, harita = {};
        while ((mm = re.exec(kaynak))) if (!harita[mm[1]]) harita[mm[1]] = mm[2];
        aile.varyantlar.forEach(function (v) { if (v.etiket && harita[v.etiket]) v.cevap = gecerli(v, harita[v.etiket]); });
        // etiketsiz çoklu varyant + tek ortak cevap ("aynı kök")
        var hepsiEtiketsiz = aile.varyantlar.every(function (v) { return !v.etiket; });
        if (hepsiEtiketsiz) {
          var m2 = /^\(?([A-Ea-e])(?:\)|\s*—|\s*-|\.|\s*$|\s)/.exec(stTx);
          if (m2) aile.varyantlar.forEach(function (v) { v.cevap = gecerli(v, m2[1]); });
        }
      }
      if (tartismali) {
        aile.tartismali = true;
        // Metin resmî anahtarı açıkça söylüyor ve baştaki harfle aynıysa kabul; farklıysa / iptalse notlama yok.
        var anh = [], ar = /anahtar\S*\s+(?:da\s+|hâlâ\s+|yine\s+)?([A-E])\b|\b([A-E])\s*\(anahtara göre\)|anahtar\S*\s+[^.]{0,12}?\b([A-E])\s+diyor/g, am;
        while ((am = ar.exec(cevapTx))) anh.push(am[1] || am[2] || am[3]);
        var iptal = /iptal edil/i.test(cevapTx);
        aile.varyantlar.forEach(function (v) {
          if (!v.cevap) return;
          var uyumlu = !iptal && aile.varyantlar.length === 1 && anh.length && anh.every(function (h) { return h === v.cevap; });
          if (uyumlu) v.cevapNotu = 'Kitap bu sorunun tartışmalı olduğunu not ediyor; işaretlenen, sınavın cevap anahtarı.';
          else { v.cevapAday = v.cevap; v.cevap = null; }
        });
      }
      aile.varyantlar.forEach(function (v) { if (v.cevap) v.cevapKaynak = 'kural'; });
      aile.otomatik = aile.varyantlar.some(function (v) { return !!v.cevap; });
    }

    /* ---------- deneme sınavı (numaralı paragraflar) ---------- */
    function denemeTara(bolum) {
      var denemeler = [];
      var anahtar = {}, aciklama = {};
      bolum.altlar.forEach(function (a) {
        a.bloklar.forEach(function (b, bi) {
          if (b.t === 'p') {
            var m = /^<strong>(\d{1,3})\.<\/strong>\s*([\s\S]*)$/.exec(b.html);
            if (m && /(^|<br>)\s*A\)/.test(m[2])) denemeler.push({ no: +m[1], html: m[2], blok: b.id, alt: a.id });
            else if (m) {
              // soru birkaç bloğa yayılmış (paragraf + tablo + şıklar)
              var parca = [m[2]];
              for (var j = bi + 1; j < Math.min(a.bloklar.length, bi + 5); j++) {
                var x = a.bloklar[j];
                if (x.t === 'p' && /^<strong>\d{1,3}\.<\/strong>/.test(x.html)) break;
                if (x.t === 'tablo') parca.push('<span class="kod">' + [x.bas.map(htmlDuz).join(' | ')].concat(x.satir.map(function (s) { return s.map(htmlDuz).join(' | '); })).join('<br>') + '</span>');
                else if (x.t === 'p') parca.push(x.html);
                else break;
                if (x.t === 'p' && /(^|<br>)\s*A\)/.test(x.html)) { denemeler.push({ no: +m[1], html: parca.join('<br>'), blok: b.id, alt: a.id }); break; }
              }
            }
          }
          if (b.t === 'tablo' && b.bas.length && b.bas.every(function (h) { return /^\d+$/.test(htmlDuz(h)); })) {
            b.satir.forEach(function (s) { s.forEach(function (c, i) { var h = htmlDuz(c); if (/^[A-E]$/.test(h)) anahtar[+htmlDuz(b.bas[i])] = h; }); });
          }
          if (b.t === 'acilir') b.bloklar.forEach(function (x) {
            if (x.md) x.md.split(/\n(?=\d+\.\s)/).forEach(function (sat) {
              var mm = /^(\d+)\.\s+\*\*([A-E])\*\*\s*—?\s*([\s\S]*)$/.exec(sat.trim());
              if (mm) { anahtar[+mm[1]] = mm[2]; aciklama[+mm[1]] = mm[3]; }
            });
          });
        });
      });
      // çözüm paragrafları: "<strong>N.</strong>" ile başlayan ama şıksız paragraflar (anahtar sonrası)
      bolum.altlar.forEach(function (a) {
        a.bloklar.forEach(function (b) {
          if (b.t !== 'p') return;
          var m = /^<strong>(\d{1,3})\.?\s*(?:\(([A-E])\))?\.?<\/strong>\s*([\s\S]*)$/.exec(b.html);
          if (m && !/(^|<br>)\s*A\)/.test(m[3]) && !aciklama[+m[1]]) aciklama[+m[1]] = m[3];
        });
      });
      denemeler.forEach(function (d) {
        var v = { etiket: null, sinav: 'Deneme', no: d.no, kod: null, govde: '', siklar: [], cevap: null };
        var par = d.html.split(/<br>/), govde = [];
        par.forEach(function (h) {
          var tx = htmlDuz(h);
          var coklu = tx.match(/(^|\s)([A-E])\)\s/g);
          if (coklu && coklu.length >= 3 && /^\s*A\)/.test(tx)) {
            h.split(/(?:^|\s)(?=[A-E]\)\s)/).forEach(function (pp) { var mm = /^\s*([A-E])\)\s*([\s\S]*)$/.exec(htmlDuz(pp)); if (mm) v.siklar.push({ h: mm[1], m: kacis(mm[2]) }); });
            return;
          }
          var mm = /^\s*([A-E])\)\s*/.exec(tx);
          if (mm && mm[1] === String.fromCharCode(65 + v.siklar.length)) v.siklar.push({ h: mm[1], m: h.replace(/^\s*[A-E]\)\s*/, '') });
          else if (!v.siklar.length) govde.push(h); else v.sonNot = (v.sonNot || '') + h;
        });
        v.govde = govde.join('<br>');
        if (anahtar[d.no] && v.siklar.some(function (s) { return s.h === anahtar[d.no]; })) { v.cevap = anahtar[d.no]; v.cevapKaynak = 'kural'; }
        var ac = aciklama[d.no] || '';
        sorular.push({ id: 'q-' + d.blok, blok: d.blok, bolum: bolum.id, alt: d.alt, baslik: 'Deneme · ' + d.no, konu: null, kodlar: [],
          onem: { yildiz: 0, ates: false }, deneme: true, varyantlar: [v],
          cevapHtml: ac ? '<p>' + (/[<]/.test(ac) ? ac : kacis(ac).replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')) + '</p>' : '',
          otomatik: !!v.cevap });
      });
    }

    /* ---------- gövdeyi gez ---------- */
    var cocuklar = body.children;
    var bolumSira = 0;
    for (var i = 0; i < cocuklar.length; i++) {
      var n = cocuklar[i], t = n.tagName.toUpperCase();
      if (t === 'DIV' && /\b(kapak|icindekiler)\b/.test(n.getAttribute('class') || '')) continue;
      if (t === 'H1') {
        var bt = bosluk(n.textContent);
        var nm = /^Bölüm\s+(\d+)/.exec(bt);
        var bid = n.getAttribute('id') || ('bolum-' + (nm ? nm[1] : 'x' + bolumSira));
        bolum = { id: bid, no: nm ? nm[1] : null, baslik: bt, kisa: bosluk(bt.replace(/^Bölüm\s+\d+\s*[—–-]\s*/, '')), sira: bolumSira++, altlar: [],
          ozel: /deneme/i.test(bt) ? 'deneme' : /sözlü/i.test(bt) ? 'sozluk' : /öncelik haritası/i.test(bt) ? 'oncelik' : /formül kart/i.test(bt) ? 'formul' : null };
        bolumler.push(bolum); alt = null;
        continue;
      }
      if (!bolum) continue;
      if (t === 'H2') {
        var ht = bosluk(n.textContent);
        var am = /^(\d+\.\d+)\s/.exec(ht);
        yeniAlt(am ? am[1] : null, ht, n.getAttribute('id') ? bolum.id + '-' + n.getAttribute('id') : null);
        if (/sözlü/i.test(ht) && bolum.ozel !== 'sozluk') alt.sozluk = true;
        continue;
      }
      var hedef = (alt || (yeniAlt(null, null), alt)).bloklar;
      tekBlok(n, bolum.id, hedef, { sozluk: bolum.ozel === 'sozluk' || alt.sozluk });
    }
    bolumler.forEach(function (b) { if (b.ozel === 'deneme') denemeTara(b); });
    bolumler.forEach(kendiniTestTara);

    /* ---------- "Kendini test et": numaralı sorular + sondaki "🔑 Cevap" listesi (sırayla eşleşir) ---------- */
    function kendiniTestTara(bolum) {
      bolum.altlar.forEach(function (a) {
        if (!/kendini (test|sına)/i.test(a.baslik || '')) return;
        var sorular_ = [], cevaplar = {}, cevapta = false, bitti = false, cevapBloklari = [];
        a.bloklar.forEach(function (b) {
          var h = b.html || '';
          if (bitti) return;
          if (b.t === 'p' && /🔑\s*Cevap/.test(htmlDuz(h))) { cevapta = true; cevapBloklari.push(b.id); return; }
          if (cevapta) {
            var nm = /^<strong>(\d+)\./.exec(h);
            if (b.t === 'liste') {
              var bas = b.bas || 1, sira = bas;
              b.ogeler.forEach(function (o) {
                // tek maddede "… 2. … 3. …" diye sıralanmış cevaplar
                var parca = o.split(/\s(?=\d{1,2}\.\s)/);
                parca.forEach(function (pc, j) {
                  var nm2 = /^(\d{1,2})\.\s+([\s\S]*)$/.exec(pc);
                  if (j > 0 && nm2) { sira = +nm2[1]; cevaplar[sira] = nm2[2]; }
                  else cevaplar[sira] = pc;
                });
                sira++;
              });
              cevapBloklari.push(b.id);
            }
            else if (b.t === 'p' && nm) { cevaplar[+nm[1]] = h.replace(/^<strong>\d+\.\s*/, '<strong>'); cevapBloklari.push(b.id); }
            else bitti = true;
            return;
          }
          if (b.t === 'p' && /^<strong>\d+\.[^<]*<\/strong>/.test(h)) sorular_.push({ b: b, h: h.replace(/^<strong>(\d+)\.[^<]*<\/strong>\s*/, ''), no: +/^<strong>(\d+)/.exec(h)[1] });
          else if (b.t === 'liste' && b.sirali !== false && !sorular_.length) b.ogeler.forEach(function (o, i) { sorular_.push({ b: b, h: o, no: (b.bas || 1) + i, liste: i }); });
        });
        if (!sorular_.length) return;
        sorular_.forEach(function (s, i) {
          var v = { etiket: null, sinav: 'Kendini test et', no: s.no, govde: '', siklar: [], cevap: null };
          var govde = [];
          s.h.split(/<br>/).forEach(function (p) {
            var tx = htmlDuz(p);
            var coklu = tx.match(/(^|\s)([A-E])\)\s/g);
            if (coklu && coklu.length >= 3 && /^\s*A\)/.test(tx) && !v.siklar.length) {
              p.split(/(?:^|\s)(?=[A-E]\)\s)/).forEach(function (pp) { var m2 = /^\s*([A-E])\)\s*([\s\S]*)$/.exec(htmlDuz(pp)); if (m2) v.siklar.push({ h: m2[1], m: kacis(m2[2].trim()) }); });
              return;
            }
            var mm = /^\s*([A-E])\)\s*/.exec(tx);
            if (mm && mm[1] === String.fromCharCode(65 + v.siklar.length)) v.siklar.push({ h: mm[1], m: p.replace(/^\s*[A-E]\)\s*/, '') });
            else if (!v.siklar.length) govde.push(p);
          });
          v.govde = govde.join('<br>');
          var c = cevaplar[s.no] || '';
          var ch = /^\s*([A-E])(?=\)|\s|\.|—|-|$)/.exec(htmlDuz(c));
          if (ch && v.siklar.some(function (x) { return x.h === ch[1]; })) { v.cevap = ch[1]; v.cevapKaynak = 'kural'; }
          sorular.push({ id: 'q-' + s.b.id + (s.liste != null ? '-' + s.liste : ''), blok: s.b.id, liste: s.liste != null ? s.liste : null, bolum: bolum.id, alt: a.id,
            baslik: 'Kendini test et · ' + s.no, konu: null, kodlar: [], onem: { yildiz: 0, ates: false }, deneme: false, kendiniTest: true,
            acikUclu: !v.siklar.length, varyantlar: [v], cevapHtml: c ? '<p>' + c + '</p>' : '', cevapBloklari: cevapBloklari, otomatik: !!v.cevap });
        });
      });
    }

    var kitap = paketle({ id: id, baslik: baslik, turler: turler, bolumler: bolumler, figurler: figurler, sorular: sorular, terimler: terimler, kaynak: ayar.kaynak || { tur: 'html' } });
    Object.keys(rapor.bilinmeyenTurler).forEach(function (k) { rapor.uyarilar.push('Bilinmeyen callout türü: ' + k + ' (' + rapor.bilinmeyenTurler[k] + ')'); });
    kitap.rapor = raporla(kitap, rapor);
    return kitap;
  }

  /* ---------- paketle / say ---------- */
  function paketle(o) {
    var kitap = { sema: SEMA, id: o.id, baslik: o.baslik, renk: o.renk || null, olusturma: new Date().toISOString(), kaynak: o.kaynak,
      turler: o.turler || {}, bolumler: o.bolumler, figurler: o.figurler || [], sorular: o.sorular || [], terimler: o.terimler || [] };
    kitap.bolumler.forEach(function (b) {
      var say = { blok: 0, soru: 0, figur: 0, callout: {} };
      (function gez(list) { list.forEach(function (x) { say.blok++; if (x.t === 'figur') say.figur += x.figurler.length; if (x.t === 'callout') { say.callout[x.tur] = (say.callout[x.tur] || 0) + 1; if (x.soru) say.soru++; } if (x.bloklar) gez(x.bloklar); }); })(
        [].concat.apply([], b.altlar.map(function (a) { return a.bloklar; })));
      b.sayilar = say;
    });
    return kitap;
  }
  function raporla(kitap, r) {
    var aile = 0, varyant = 0, notlanan = 0, ailesiOto = 0, deneme = 0, kt = 0, ktSik = 0;
    kitap.sorular.forEach(function (q) { if (q.kendiniTest) { kt++; if (!q.acikUclu) ktSik++; return; } aile++; if (q.deneme) deneme++; varyant += q.varyantlar.length; q.varyantlar.forEach(function (v) { if (v.cevap) notlanan++; }); if (q.otomatik) ailesiOto++; });
    var callout = {};
    kitap.bolumler.forEach(function (b) { for (var k in b.sayilar.callout) callout[k] = (callout[k] || 0) + b.sayilar.callout[k]; });
    return { bolum: kitap.bolumler.length, altBolum: kitap.bolumler.reduce(function (s, b) { return s + b.altlar.length; }, 0),
      soruAilesi: aile, denemeSorusu: deneme, kendiniTest: kt, kendiniTestSikli: ktSik, varyant: varyant, otomatikNotlanan: notlanan, otomatikAile: ailesiOto,
      gorsel: kitap.figurler.length, eksikGorseller: r ? r.eksikGorseller : [], callout: callout, terim: kitap.terimler.length,
      uyarilar: r ? r.uyarilar : [] };
  }

  /* ---------- JSON içe aktarıcı (tahmin yok, yalnız doğrulama) ---------- */
  function jsonKitap(obj) {
    var hata = [];
    if (!obj || typeof obj !== 'object') throw new Error('JSON bir nesne değil.');
    if (obj.sema && obj.sema !== SEMA) hata.push('Şema sürümü farklı: ' + obj.sema);
    if (!obj.baslik) throw new Error('"baslik" alanı yok.');
    if (!Array.isArray(obj.bolumler) || !obj.bolumler.length) throw new Error('"bolumler" dizisi yok ya da boş.');
    var id = obj.id || slug(obj.baslik);
    var idSay = {};
    function sanit(h) { return temizHtmlDizgi(h); }
    var sorular = Array.isArray(obj.sorular) ? obj.sorular.slice() : [];
    obj.bolumler.forEach(function (b, bi) {
      b.id = b.id || 'bolum-' + bi; b.sira = bi; b.kisa = b.kisa || b.baslik;
      if (!Array.isArray(b.altlar)) b.altlar = [{ id: b.id + '-g', no: null, baslik: null, bloklar: b.bloklar || [] }];
      b.altlar.forEach(function (a, ai) {
        a.id = a.id || b.id + '-' + ai;
        (function gez(list) {
          list.forEach(function (x) {
            if (!x.id) { var k = a.id + '-' + fnv(JSON.stringify(x).slice(0, 300)); if (idSay[k]) k += '_' + (++idSay[k]); else idSay[k] = 1; x.id = k; }
            if (x.html) x.html = sanit(x.html);
            if (x.ogeler) x.ogeler = x.ogeler.map(sanit);
            if (Array.isArray(x.bas)) x.bas = x.bas.map(sanit); // sayı olan "bas" (ör. liste başlangıcı) olduğu gibi kalır
            if (x.satir) x.satir = x.satir.map(function (s) { return s.map(sanit); });
            if (x.bloklar) gez(x.bloklar);
          });
        })(a.bloklar || (a.bloklar = []));
      });
    });
    sorular.forEach(function (q, i) {
      q.id = q.id || 'q-' + id + '-' + i;
      q.varyantlar = (q.varyantlar || []).map(function (v) {
        v.govde = sanit(v.govde || ''); v.siklar = (v.siklar || []).map(function (s) { return { h: s.h, m: sanit(s.m || '') }; });
        var ok = v.cevap && v.siklar.some(function (s) { return s.h.toUpperCase() === String(v.cevap).toUpperCase(); });
        if (v.cevap && !ok) hata.push('Soru ' + q.id + ': cevap "' + v.cevap + '" şıklarda yok, boş bırakıldı.');
        v.cevap = ok ? String(v.cevap).toUpperCase() : null;
        if (v.cevap) v.cevapKaynak = v.cevapKaynak || 'json';
        return v;
      });
      q.cevapHtml = sanit(q.cevapHtml || '');
      q.onem = q.onem || { yildiz: 0, ates: false };
      q.otomatik = q.varyantlar.some(function (v) { return !!v.cevap; });
    });
    var kitap = paketle({ id: id, baslik: obj.baslik, renk: obj.renk, turler: obj.turler, bolumler: obj.bolumler, figurler: obj.figurler, sorular: sorular, terimler: obj.terimler, kaynak: { tur: 'json' } });
    Object.keys(kitap.turler).length || kitap.bolumler.forEach(function (b) { b.altlar.forEach(function (a) { (function g(l) { l.forEach(function (x) { if (x.t === 'callout' && !kitap.turler[x.tur]) { var t = TURLER[x.tur]; kitap.turler[x.tur] = t ? { etiket: t.etiket, ikon: t.ikon, renk: t.renk } : { etiket: x.tur, ikon: '◆', renk: '#8fa3b8', bilinmeyen: true }; } if (x.bloklar) g(x.bloklar); }); })(a.bloklar); }); });
    kitap.rapor = raporla(kitap, { eksikGorseller: [], uyarilar: hata });
    return kitap;
  }

  // DOM'suz ortamda (JSON / MD) HTML dizgisini temizle
  var _ayr = null;
  function temizHtmlDizgi(h) {
    if (!h) return '';
    if (typeof DOMParser !== 'undefined') {
      _ayr = _ayr || new DOMParser();
      var d = _ayr.parseFromString('<div>' + h + '</div>', 'text/html');
      return temizHtml(d.body.firstChild, true);
    }
    if (temizHtmlDizgi.dom) { var d2 = temizHtmlDizgi.dom('<div>' + h + '</div>'); return temizHtml(d2.body.firstChild || d2.body, true); }
    return kacis(String(h).replace(/<[^>]+>/g, ''));
  }

  /* ---------- Markdown / düz metin ---------- */
  function mdKitap(txt, ayar) {
    ayar = ayar || {};
    var satir = String(txt).replace(/\r/g, '').split('\n');
    var html = [], i = 0, liste = null;
    function satIc(s) {
      return kacis(s).replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>').replace(/(^|[^*])\*([^*\n]+)\*/g, '$1<em>$2</em>').replace(/`([^`]+)`/g, '<code>$1</code>');
    }
    function listeKapat() { if (liste) { html.push('</' + liste + '>'); liste = null; } }
    while (i < satir.length) {
      var s = satir[i];
      if (/^```/.test(s)) { listeKapat(); var kod = []; i++; while (i < satir.length && !/^```/.test(satir[i])) kod.push(satir[i++]); i++; html.push('<pre>' + kacis(kod.join('\n')) + '</pre>'); continue; }
      var h = /^(#{1,4})\s+(.*)$/.exec(s);
      if (h) { listeKapat(); html.push('<h' + h[1].length + '>' + satIc(h[2]) + '</h' + h[1].length + '>'); i++; continue; }
      if (/^>\s?/.test(s)) {
        listeKapat(); var bq = [];
        while (i < satir.length && /^>\s?/.test(satir[i])) bq.push(satir[i++].replace(/^>\s?/, ''));
        var sin = /^\[!(\w+)\]/.exec(bq[0] || ''); if (sin) bq[0] = bq[0].replace(/^\[!\w+\]\s*/, '');
        html.push('<blockquote' + (sin ? ' class="' + slug(sin[1]) + '"' : '') + '><p>' + bq.map(satIc).join('<br>') + '</p></blockquote>');
        continue;
      }
      var li = /^\s*([-*]|\d+\.)\s+(.*)$/.exec(s);
      if (li) { var tip = /\d/.test(li[1]) ? 'ol' : 'ul'; if (liste !== tip) { listeKapat(); html.push('<' + tip + '>'); liste = tip; } html.push('<li>' + satIc(li[2]) + '</li>'); i++; continue; }
      if (/^\|/.test(s)) {
        listeKapat(); var rows = [];
        while (i < satir.length && /^\|/.test(satir[i])) rows.push(satir[i++]);
        var hucre = function (r) { return r.replace(/^\||\|$/g, '').split('|').map(function (c) { return satIc(c.trim()); }); };
        var th = hucre(rows[0]), govde = rows.slice(/^\|[\s:-]+\|/.test(rows[1] || '') ? 2 : 1);
        html.push('<table><thead><tr>' + th.map(function (c) { return '<th>' + c + '</th>'; }).join('') + '</tr></thead><tbody>' +
          govde.map(function (r) { return '<tr>' + hucre(r).map(function (c) { return '<td>' + c + '</td>'; }).join('') + '</tr>'; }).join('') + '</tbody></table>');
        continue;
      }
      if (!s.trim()) { listeKapat(); i++; continue; }
      listeKapat(); var par = [];
      while (i < satir.length && satir[i].trim() && !/^(#{1,4}\s|>|```|\s*([-*]|\d+\.)\s|\|)/.test(satir[i])) par.push(satir[i++]);
      html.push('<p>' + par.map(satIc).join('<br>') + '</p>');
    }
    listeKapat();
    // # yoksa tek bölüm
    var govdeHtml = html.join('\n');
    if (!/<h1>/.test(govdeHtml)) govdeHtml = '<h1>' + kacis(ayar.baslik || 'Metin') + '</h1>' + govdeHtml;
    var doc = ayar.dom ? ayar.dom('<html><body>' + govdeHtml + '</body></html>') : new DOMParser().parseFromString('<html><body>' + govdeHtml + '</body></html>', 'text/html');
    return htmlKitap(doc, { baslik: ayar.baslik, id: ayar.id, kaynak: { tur: ayar.tur || 'md' } });
  }

  /* ---------- PDF metni (sayfa dizisi) ---------- */
  function pdfKitap(sayfalar, ayar) {
    // Yapı zayıf: büyük harfli/numaralı kısa satırlar başlık sayılır.
    var md = [];
    sayfalar.forEach(function (s) {
      s.split('\n').forEach(function (l) {
        var t = l.trim();
        if (!t) { md.push(''); return; }
        if (/^(BÖLÜM|Bölüm|CHAPTER|Chapter)\s+\d+/.test(t) && t.length < 90) md.push('\n# ' + t + '\n');
        else if (/^\d+\.\d+\s+\S/.test(t) && t.length < 90) md.push('\n## ' + t + '\n');
        else md.push(t);
      });
      md.push('');
    });
    var k = mdKitap(md.join('\n'), { baslik: ayar.baslik, id: ayar.id, dom: ayar.dom, tur: 'pdf' });
    k.rapor.uyarilar.push('PDF metninden çıkarıldı: başlık yapısı tahmini, tablolar ve görseller alınmadı.');
    return k;
  }

  return { SEMA: SEMA, TURLER: TURLER, htmlKitap: htmlKitap, jsonKitap: jsonKitap, mdKitap: mdKitap, pdfKitap: pdfKitap,
    temizHtml: temizHtml, temizHtmlDizgi: temizHtmlDizgi, katla: katla, fnv: fnv, slug: slug, raporla: raporla };
});
