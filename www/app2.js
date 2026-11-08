/* 1001 — Aşama 2: cümle/kavram paneli, seçim araç çubuğu, yapay zekâ, sohbet, kitap ekleme */
(function () {
  'use strict';
  var U = window.Uygulama, A = window.KitapAyristir;
  var el = U.el, $ = U.$, $$ = U.$$, esc = U.esc, duz = U.duz, toast = U.toast, Y = U.Y, Kitaplik = U.Kitaplik, Durum = U.Durum;
  var katla = A.katla, fnv = A.fnv;

  /* ================= yapay zekâ çağrısı ================= */
  var AI = {
    durum: 'bilinmiyor', // bilinmiyor | hazir | yok | reddedildi
    sinir: null,
    hazir: function () {
      return U.yetenekSozu.then(function () {
        if (!Y.sample) { AI.durum = 'yok'; return false; }
        if (AI.durum === 'reddedildi') return false;
        if (!AI.sinir) AI.sinir = Promise.resolve(Y.sample.limits ? Y.sample.limits() : {}).catch(function () { return {}; });
        return AI.sinir.then(function () { if (AI.durum === 'bilinmiyor') AI.durum = 'hazir'; return true; });
      });
    },
    hataMetni: function (e) {
      var c = e && e.code;
      if (c === 'not_granted' || c === 'sampling_disabled' || c === 'not_declared' || c === 'capability_disabled' || c === 'capability_removed') {
        AI.durum = 'reddedildi'; document.body.classList.add('ai-yok');
        return 'Yapay zekâ bu sayfada kullanılamıyor (izin verilmedi ya da hesabında kapalı). Okuma, arama ve görseller çalışmaya devam eder.';
      }
      if (c === 'rate_limited') return 'Çok sık istek gönderildi ya da kullanım sınırına gelindi. Biraz bekleyip yeniden dene.';
      if (c === 'session_expired') return 'Oturum süresi doldu; claude.ai\'ye yeniden giriş yap.';
      if (c === 'prompt_too_large') return 'İstek çok uzun oldu; daha kısa bir metin seç.';
      if (c === 'refused') return 'Yapay zekâ bu isteği yanıtlamadı. Soruyu farklı sor.';
      if (c === 'cancelled') return 'Durduruldu.';
      if (c === 'images_unavailable') return 'Bu görünümde görsel gönderilemiyor.';
      if (c === 'tools_unavailable') return 'Bu görünümde sohbet araçları çalışmıyor.';
      return 'Bağlantı sorunu oldu. Yeniden dene.';
    },
    // Paylaşılan önbellek (aiOnbellek/<anahtar>) — aynı soru ikinci kez anında gelir.
    onbellekOku: function (k) {
      if (!Y.db) return Promise.resolve(null);
      return Promise.race([Y.db.doc('aiOnbellek/' + k).get(), new Promise(function (r) { setTimeout(function () { r(null); }, 6000); })])
        .then(function (s) { return s && s.exists ? s.data() : null; }).catch(function () { return null; });
    },
    onbellekYaz: function (k, veri) {
      if (!Y.db) return Promise.resolve();
      return Y.db.doc('aiOnbellek/' + k).set(veri).catch(function () {});
    }
  };
  U.AI = AI;

  /* ================= güvenli mini markdown ================= */
  function mdHtml(t, kj) {
    var parcalar = [], kodlar = [];
    t = String(t || '').replace(/```(\w*)\n([\s\S]*?)```/g, function (_, dil, kod) { kodlar.push({ dil: dil, kod: kod }); return '\u0000K' + (kodlar.length - 1) + '\u0000'; });
    var satirlar = (window.Matematik ? Matematik.tekSatir(esc(t)) : esc(t)).split('\n'), html = [], liste = null;
    function satirIc(s) {
      var mat = [];
      if (window.Matematik) s = Matematik.koru(s, mat);
      s = s.replace(/\[test:([a-z0-9]+)\]/g, '<span class="sohbet-test" data-test="$1"></span>')
        .replace(/\[([^\]\n]{1,300})\]\((https?:\/\/[^\s)"<>]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
        .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>').replace(/(^|[^*])\*([^*\n]+)\*/g, '$1<em>$2</em>').replace(/`([^`]+)`/g, '<code>$1</code>')
        .replace(/\[kaynak:([a-z0-9-]+)\|(\d+)\|([^|\]]*)\|([^\]]+)\]/g, function (_, k, b, blok, et) {
          return '<a class="capraz kaynak-bag" href="#' + U.okuHash(k, +b) + '" data-blok="' + blok + '">' + et + '</a>';
        });
      return window.Matematik ? Matematik.geri(s, mat) : s;
    }
    satirlar.forEach(function (s) {
      var m;
      if ((m = /^\u0000K(\d+)\u0000$/.exec(s.trim()))) { if (liste) { html.push('</' + liste + '>'); liste = null; } html.push('\u0000K' + m[1] + '\u0000'); return; }
      if ((m = /^#{1,4}\s+(.*)$/.exec(s))) { if (liste) { html.push('</' + liste + '>'); liste = null; } html.push('<h4>' + satirIc(m[1]) + '</h4>'); return; }
      if ((m = /^\s*[-*•]\s+(.*)$/.exec(s))) { if (liste !== 'ul') { if (liste) html.push('</' + liste + '>'); html.push('<ul>'); liste = 'ul'; } html.push('<li>' + satirIc(m[1]) + '</li>'); return; }
      if ((m = /^\s*\d+[.)]\s+(.*)$/.exec(s))) { if (liste !== 'ol') { if (liste) html.push('</' + liste + '>'); html.push('<ol>'); liste = 'ol'; } html.push('<li>' + satirIc(m[1]) + '</li>'); return; }
      if (liste) { html.push('</' + liste + '>'); liste = null; }
      if (s.trim()) html.push('<p>' + satirIc(s) + '</p>');
    });
    if (liste) html.push('</' + liste + '>');
    var sonuc = html.join('');
    sonuc = sonuc.replace(/\u0000K(\d+)\u0000/g, function (_, i) {
      var k = kodlar[+i];
      if (/svg/i.test(k.dil) || /^\s*<svg/i.test(k.kod)) {
        var svg = svgTemizle(k.kod);
        if (svg) return '<figure class="ai-cizim"><img alt="Yapay zekâ çizimi" src="data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg) + '"><figcaption><span class="etiket-kucuk ai">Yapay zekâ çizimi</span> Kitapla karşılaştır; kitap görseli değildir.</figcaption></figure>';
        return '<p class="var-etiket">Çizim güvenlik denetiminden geçmedi.</p>';
      }
      return '<pre>' + esc(k.kod) + '</pre>';
    });
    return sonuc;
  }
  U.mdHtml = mdHtml;
  var SVG_OGE = /^(svg|g|rect|circle|ellipse|line|polyline|polygon|path|text|tspan|defs|marker|title|desc)$/;
  var SVG_OZ = /^(x|y|x1|y1|x2|y2|cx|cy|r|rx|ry|dx|dy|width|height|viewBox|d|points|fill|stroke|stroke-width|stroke-dasharray|stroke-linecap|stroke-linejoin|font-size|font-family|font-weight|font-style|text-anchor|dominant-baseline|transform|opacity|fill-opacity|stroke-opacity|id|marker-end|marker-start|refX|refY|markerWidth|markerHeight|orient|xmlns|preserveAspectRatio)$/;
  function svgTemizle(kod) {
    try {
      var d = new DOMParser().parseFromString(kod.trim(), 'image/svg+xml');
      var kok = d.documentElement;
      if (!kok || kok.nodeName.toLowerCase() !== 'svg' || d.getElementsByTagName('parsererror').length) return null;
      (function gez(n) {
        Array.prototype.slice.call(n.children).forEach(function (c) {
          if (!SVG_OGE.test(c.nodeName)) { c.remove(); return; }
          gez(c);
        });
        Array.prototype.slice.call(n.attributes).forEach(function (a) {
          var v = a.value;
          if (!SVG_OZ.test(a.name) || /javascript:|data:|expression|@import/i.test(v) || (/url\(/i.test(v) && !/^url\(#[\w-]+\)$/.test(v.trim()))) n.removeAttribute(a.name);
        });
      })(kok);
      kok.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
      return new XMLSerializer().serializeToString(kok);
    } catch (e) { return null; }
  }

  /* ================= cümle bölme ================= */
  var KISALTMA = /(?:^|[\s(])(?:örn|vb|vs|bkz|Dr|Prof|Doç|yy|yak|Lat|Yun|Fr|İng|Ing|Alm|No|Şek|Tab|lig|ligg|art|artt|proc|vd|ör|bk|sf|s|ss|a|aa|v|vv|n|nn|m|mm|r|rr|gl|ggl|lnn|ln|for|fasc|tub|cap|med|lat|ant|post|sup|inf|dext|sin|St|Mr|Mrs|vol|ed|krş|bkz|çev|haz|cilt|syf|yön|örneğin)\.$/i;
  function cumleSinirlari(metin) {
    var sinir = [], re = /([.!?…]+)(["'”’)\]]*)(\s+)(?=["'“‘(]?[A-ZÇĞİÖŞÜ0-9])/g, m;
    while ((m = re.exec(metin))) {
      var son = m.index + m[1].length + m[2].length;
      var once = metin.slice(Math.max(0, m.index - 14), m.index + m[1].length);
      if (/\.\.$/.test(m[1]) && m[1] !== '…' && m[1] !== '...') continue;
      if (m[1] === '.' && KISALTMA.test(once)) continue;
      if (m[1] === '.' && /(^|\s)\d+\.$/.test(once)) continue;          // "5. Kaburga" sıra sayısı
      if (m[1] === '.' && /(^|\s)[A-ZÇĞİÖŞÜa-zçğıöşü]\.$/.test(once)) continue; // "A. carotis", "m. biceps"
      sinir.push(son + m[3].length);
    }
    return sinir;
  }
  // Paragrafın doğrudan çocuklarını cümle span'lerine ayırır. Satır içi öğe içindeki sınır, öğenin sonuna kaydırılır; <br> sınırdır.
  function cumlele(p) {
    if (p.dataset.cumle) return;
    p.dataset.cumle = '1';
    var cocuklar = Array.prototype.slice.call(p.childNodes);
    var metin = '', konum = [];
    cocuklar.forEach(function (c) { konum.push(metin.length); metin += c.nodeType === 1 && c.tagName === 'BR' ? '\n' : c.textContent; });
    var sinirlar = cumleSinirlari(metin.replace(/\n/g, ' '));
    for (var i = 0; i < metin.length; i++) if (metin[i] === '\n') sinirlar.push(i + 1);
    sinirlar.sort(function (a, b) { return a - b; });
    if (!sinirlar.length && metin.trim().length < 3) return;
    // metin düğümlerini sınırlarda böl
    var parca = [];
    cocuklar.forEach(function (c, ci) {
      var bas = konum[ci], son = bas + (c.nodeType === 1 && c.tagName === 'BR' ? 1 : c.textContent.length);
      if (c.nodeType === 3) {
        var kes = sinirlar.filter(function (s) { return s > bas && s < son; });
        var dugum = c, ofs = bas;
        kes.forEach(function (s) { var yeni = dugum.splitText(s - ofs); parca.push({ n: dugum, bas: ofs }); ofs = s; dugum = yeni; });
        parca.push({ n: dugum, bas: ofs });
      } else parca.push({ n: c, bas: bas });
    });
    var gruplar = [], grup = null, sinirIdx = 0;
    parca.forEach(function (x) {
      while (sinirIdx < sinirlar.length && sinirlar[sinirIdx] <= x.bas) { sinirIdx++; grup = null; }
      if (x.n.nodeType === 1 && x.n.tagName === 'BR') { gruplar.push([x.n]); grup = null; return; }
      if (!grup) { grup = []; gruplar.push(grup); }
      grup.push(x.n);
    });
    gruplar.forEach(function (g) {
      if (g.length === 1 && g[0].nodeType === 1 && g[0].tagName === 'BR') return;
      var tx = g.map(function (n) { return n.textContent; }).join('');
      if (!tx.trim()) return;
      var sp = document.createElement('span');
      sp.className = 'cumle'; sp.tabIndex = 0; sp.setAttribute('role', 'button');
      p.insertBefore(sp, g[0]);
      g.forEach(function (n) { sp.appendChild(n); });
    });
  }
  U.cumleSinirlari = cumleSinirlari;

  /* ================= okuyucuya ekler ================= */
  U.sonIsle = function (alan, bolum, kj) {
    $$('p.blok, .co-ic > p, .co-ic li, .metin > .alt-bolum > ul > li, .metin > .alt-bolum > ol > li', alan).forEach(function (p) {
      if (p.closest('.soru-kutu') || p.closest('.figurler')) return;
      cumlele(p);
    });
    // kavramlar: kalın terimler, tablo ilk sütunu (köken/sözlük), başlıklar
    $$('.metin strong', alan).forEach(function (s) {
      if (s.closest('.soru-kutu,.co-ust,h1,a,button')) return;
      var t = s.textContent.trim();
      if (t.length < 3 || t.length > 60 || /^[\d\W]+$/.test(t)) return;
      s.classList.add('kavram');
    });
    $$('.metin tbody tr > td:first-child', alan).forEach(function (td) { if (td.textContent.trim().length > 2 && td.textContent.length < 60) td.classList.add('kavram'); });
    $$('.metin h2, .metin h3', alan).forEach(function (h) { h.classList.add('kavram-baslik'); h.title = 'Kavram kartını aç'; });
    if (!alan.dataset.dinliyor) {
      alan.dataset.dinliyor = '1';
      alan.addEventListener('click', okuyucuTik);
      alan.addEventListener('keydown', function (e) { if ((e.key === 'Enter' || e.key === ' ') && e.target.classList && e.target.classList.contains('cumle')) { e.preventDefault(); okuyucuTik(e); } });
    }
  };
  function okuyucuTik(e) {
    if (document.body.classList.contains('okuma-modu')) return;
    var sec = window.getSelection && String(window.getSelection());
    if (sec && sec.trim().length > 1) return; // seçim yapılıyorsa araç çubuğu ilgilenir
    var t = e.target;
    if (t.closest('a,button,summary,.figur,input,textarea')) return;
    var kavram = t.closest('.kavram');
    var kj = Durum.aktifKitap, bolum = Durum.aktifBolum;
    if (kavram) { e.preventDefault(); kavramAc(kavram.textContent.trim(), { kj: kj, bolum: bolum, blok: blokBul(kavram) }); return; }
    var bas = t.closest('.kavram-baslik');
    if (bas) { kavramAc(bas.textContent.replace(/^\d+\.\d+\s*/, '').split(/[:(—]/)[0].trim(), { kj: kj, bolum: bolum, blok: blokBul(bas) }); return; }
    var c = t.closest('.cumle');
    if (c) {
      $$('.cumle.secili').forEach(function (x) { x.classList.remove('secili'); });
      c.classList.add('secili');
      cumlePaneli(c.textContent.replace(/\s+/g, ' ').trim(), { kj: kj, bolum: bolum, blok: blokBul(c), el: c });
    }
  }
  function blokBul(n) { var b = n.closest('.blok'); var alt = n.closest('.alt-bolum'); return { id: b ? b.id.replace(/^b-/, '') : null, alt: alt ? alt.dataset.alt : null }; }
  function altMetni(bolum, altId, sinir) {
    var a = (bolum.altlar || []).filter(function (x) { return x.id === altId; })[0] || bolum.altlar[0];
    if (!a) return '';
    var s = (a.baslik ? a.baslik + '\n' : '');
    (function gez(l) { l.forEach(function (x) { if (s.length > sinir) return; if (x.html) s += duz(x.html) + '\n'; else if (x.ogeler) s += x.ogeler.map(duz).join('\n') + '\n'; else if (x.satir) s += x.satir.map(function (r) { return r.map(duz).join(' | '); }).join('\n') + '\n'; else if (x.metin) s += x.metin + '\n'; if (x.bloklar) gez(x.bloklar); }); })(a.bloklar);
    return s.slice(0, sinir);
  }
  function altBaslik(bolum, altId) { var a = (bolum.altlar || []).filter(function (x) { return x.id === altId; })[0]; return a ? a.baslik : null; }

  /* ================= yan panel ================= */
  var panel = null;
  function panelAc(baslik, altBaslikMetni) {
    if (!panel) {
      panel = el('aside', { class: 'yan-panel', role: 'dialog', 'aria-label': 'Açıklama paneli' });
      document.body.appendChild(panel);
      document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && panel && panel.classList.contains('acik') && !$('#katman').children.length) panelKapat(); });
    }
    panel.innerHTML = '';
    var ust = el('div', { class: 'yp-ust' }, [
      el('div', { class: 'yp-tutamac', 'aria-hidden': 'true' }),
      el('div', { style: 'flex:1;min-width:0' }, [el('div', { class: 'ust-etiket', text: altBaslikMetni || '' }), el('div', { class: 'yp-baslik', text: baslik })]),
      el('button', { class: 'ikon-dugme', type: 'button', 'aria-label': 'Paneli kapat', onclick: panelKapat }, ['✕'])
    ]);
    var govde = el('div', { class: 'yp-govde' });
    panel.appendChild(ust); panel.appendChild(govde);
    panel.classList.add('acik');
    document.body.classList.add('panel-acik');
    return govde;
  }
  function panelKapat() { if (panel) panel.classList.remove('acik'); document.body.classList.remove('panel-acik'); $$('.cumle.secili').forEach(function (x) { x.classList.remove('secili'); }); }
  U.panelKapat = panelKapat;
  U.panelAc = function (b, a) { return panelAc(b, a); };

  var EYLEMLER = [
    { id: 'basit', ad: 'Basitçe anlat', istek: 'Bu cümleyi bir tıp öğrencisine en basit dille, 3-5 cümlede anlat.' },
    { id: 'neden', ad: 'Neden önemli', istek: 'Bu bilgi neden önemli? Kavramsal ve sınav açısından 3-5 madde.' },
    { id: 'klinik', ad: 'Klinik bağlantı', istek: 'Bu bilginin klinik bağlantısını (hastalık, muayene bulgusu, yaralanma, ilaç) kısa maddelerle anlat.' },
    { id: 'koken', ad: 'Latince/Yunanca kökü', istek: 'Cümledeki temel terim(ler)in Latince/Yunanca kökünü, kelime anlamını ve Türkçe-İngilizce karşılığını tablo gibi maddelerle ver.' },
    { id: 'sinav', ad: 'Sınavda nasıl sorulur', istek: 'Bu bilgi çoktan seçmeli sınavda nasıl sorulur? 1 örnek soru (A–E şıklı) yaz, doğru cevabı ve çeldiricilerin neden yanlış olduğunu ver. Örnek sorunun yapay zekâ üretimi olduğunu belirt.' },
    { id: 'mnemonic', ad: 'Mnemonic', istek: 'Bu bilgiyi akılda tutmak için Türkçe kısa bir hafıza ipucu (kısaltma, kafiye ya da imge) öner ve nasıl kullanılacağını açıkla.' },
    { id: 'sema', ad: 'Şemayla anlat', istek: 'Bu bilgiyi sade bir şemayla anlat. ```svg kod bloğu içinde en fazla 520x360 boyutlarında, yalnız rect, circle, ellipse, line, polyline, polygon, path, text öğeleri kullanan, koyu zemine uygun açık renkli çizgili ve Türkçe etiketli bir SVG çiz. Ardından 2-3 cümle açıklama yaz.' }
  ];
  U.EYLEMLER = EYLEMLER;
  var CEVAP_KURALI = 'Kurallar: Türkçe yaz. Kısa ve net ol (en fazla ~180 kelime, şema isteğinde SVG hariç). Cevabı iki etiketli bölüme ayır: önce "**Kitaptan:**" (yalnız aşağıda verilen kitap metnine dayanan bilgi; kitapta yoksa "Kitapta bu konuda bilgi yok." yaz), sonra "**Genel bilgi:**" (kitapta olmayan, kendi bilgin). Kitapta olmayan bir şeyi kitaptan geliyormuş gibi yazma. Emin olmadığın yerde "emin değilim" de.';

  function baglamMetni(ctx) {
    var kj = ctx.kj, bolum = ctx.bolum;
    var s = 'KİTAP: ' + kj.baslik + '\nBÖLÜM: ' + (bolum ? bolum.baslik : '') + '\n';
    var ab = bolum && ctx.blok ? altBaslik(bolum, ctx.blok.alt) : null;
    if (ab) s += 'ALT BÖLÜM: ' + ab + '\n';
    if (bolum && ctx.blok) s += '\nKİTAP METNİ (ilgili alt bölüm):\n"""\n' + altMetni(bolum, ctx.blok.alt, 6000) + '\n"""\n';
    return s;
  }

  function cumlePaneli(cumle, ctx) {
    var kj = ctx.kj, bolum = ctx.bolum;
    var govde = panelAc(cumle.length > 160 ? cumle.slice(0, 157) + '…' : cumle, kj.baslik + (bolum && bolum.no != null ? ' · Bölüm ' + bolum.no : ''));
    var cevap = el('div', { class: 'yp-cevap', 'aria-live': 'polite' });
    var dugmeler = el('div', { class: 'yp-dugmeler' });
    EYLEMLER.forEach(function (e) {
      dugmeler.appendChild(el('button', { class: 'cip ai-gerek', type: 'button', onclick: function () { sor(e.istek, e.id); } }, [e.ad]));
    });
    dugmeler.appendChild(el('button', { class: 'cip ai-gerek', type: 'button', onclick: function () { kartYap(cumle, ctx); } }, ['Kart yap']));
    dugmeler.appendChild(el('button', { class: 'cip', type: 'button', onclick: function () { notAc(cumle, ctx); } }, ['Not / vurgu']));
    govde.appendChild(dugmeler);
    var form = el('form', { class: 'yp-form ai-gerek' });
    var girdi = el('input', { id: 'ypSoru', type: 'text', placeholder: 'Bu cümle hakkında sor…', 'aria-label': 'Serbest soru', autocomplete: 'off' });
    form.appendChild(girdi);
    form.appendChild(el('button', { class: 'dugme kucuk ana', type: 'submit' }, ['Sor']));
    form.addEventListener('submit', function (e) { e.preventDefault(); var q = girdi.value.trim(); if (q) sor('Öğrencinin sorusu: ' + q, 'serbest:' + q); });
    govde.appendChild(form);
    govde.appendChild(cevap);
    govde.appendChild(aiYokNotu());
    var ctl = null;
    function sor(istek, eylemId, yenile) {
      var anahtar = fnv(kj.id + '|' + (ctx.blok && ctx.blok.id) + '|' + cumle + '|' + eylemId);
      cevapCalistir(cevap, anahtar, function () {
        return 'Bir tıp öğrencisinin çalışma kitabını okurken tıkladığı cümleyi açıklıyorsun.\n' + CEVAP_KURALI + '\n\n' + baglamMetni(ctx) +
          '\nTIKLANAN CÜMLE: "' + cumle + '"\n\nİSTEK: ' + istek;
      }, { yenile: yenile, kj: kj, eylem: eylemId });
    }
  }

  // Önbellekli cevap kutusu: önce db, sonra yapay zekâ (akışlı), "yeniden üret" ve "durdur".
  function cevapCalistir(kutu, anahtar, istemFn, o) {
    o = o || {};
    kutu.innerHTML = '';
    var icerik = el('div', { class: 'ai-metin' });
    var alt = el('div', { class: 'yp-cevap-alt' });
    kutu.appendChild(icerik); kutu.appendChild(alt);
    var ctl = new AbortController();
    function bitir(metin, kaynak) {
      icerik.innerHTML = mdHtml(metin, o.kj);
      bolumIsaretle(icerik);
      alt.innerHTML = '';
      alt.appendChild(el('span', { class: 'etiket-kucuk ai', text: kaynak === 'onbellek' ? 'AI · önbellekten' : 'AI üretimi' }));
      alt.appendChild(el('button', { class: 'dugme kucuk', type: 'button', onclick: function () { o.yenile = true; calis(); } }, ['↻ Yeniden üret']));
      if (o.sonra) o.sonra(metin, alt);
    }
    function calis() {
      icerik.innerHTML = ''; alt.innerHTML = '';
      icerik.appendChild(el('div', { class: 'yukleniyor', text: 'Düşünüyor…' }));
      var dur = el('button', { class: 'dugme kucuk', type: 'button', onclick: function () { ctl.abort(); } }, ['Durdur']);
      alt.appendChild(dur);
      (o.yenile ? Promise.resolve(null) : AI.onbellekOku(anahtar)).then(function (onb) {
        if (onb && onb.metin) { bitir(onb.metin, 'onbellek'); return; }
        return AI.hazir().then(function (ok) {
          if (!ok) { icerik.innerHTML = ''; icerik.appendChild(el('p', { class: 'var-etiket', text: AI.durum === 'yok' ? 'Yapay zekâ bu görünümde yok. Sayfayı claude.ai içinde aç.' : AI.hataMetni({ code: 'not_granted' }) })); alt.innerHTML = ''; return; }
          ctl = new AbortController();
          var istem = istemFn();
          return Y.sample(istem, { signal: ctl.signal, cache: false, onText: function (u) { icerik.innerHTML = mdHtml(u.text, o.kj); } }).then(function (r) {
            bitir(r.text, 'yeni');
            if (r.truncated) alt.appendChild(el('span', { class: 'var-etiket', text: 'Cevap yarıda kesildi.' }));
            AI.onbellekYaz(anahtar, { metin: r.text, eylem: o.eylem || null, kitap: o.kj ? o.kj.id : null, t: Date.now() });
          });
        });
      }).catch(function (e) {
        icerik.innerHTML = e && e.text ? mdHtml(e.text, o.kj) : '';
        icerik.appendChild(el('p', { class: 'hata-metni', text: AI.hataMetni(e) }));
        alt.innerHTML = '';
        if (AI.durum !== 'reddedildi') alt.appendChild(el('button', { class: 'dugme kucuk', type: 'button', onclick: calis }, ['Yeniden dene']));
      });
    }
    calis();
  }
  U.cevapCalistir = cevapCalistir;
  function bolumIsaretle(kok) {
    $$('p > strong:first-child', kok).forEach(function (s) {
      var t = s.textContent;
      if (/^Kitaptan/i.test(t)) s.parentNode.classList.add('kitaptan');
      if (/^Genel bilgi/i.test(t)) s.parentNode.classList.add('genel-bilgi');
    });
  }
  function aiYokNotu() { return el('p', { class: 'var-etiket ai-yok-notu', text: 'Yapay zekâ özellikleri kapalı. Kitap içeriği, görseller ve arama çalışmaya devam ediyor.' }); }

  /* ================= kart yap (AI, onaylı) ================= */
  function kartYap(metin, ctx) {
    var kj = ctx.kj;
    var govde = panelAc('Kart yap', kj.baslik);
    var on = el('textarea', { id: 'kartOn', rows: '3', 'aria-label': 'Ön yüz' }), arka = el('textarea', { id: 'kartArka', rows: '4', 'aria-label': 'Arka yüz' });
    var durum = el('div', { class: 'var-etiket', text: 'Yapay zekâ kart öneriyor…' });
    govde.appendChild(el('p', { class: 'alinti', text: '“' + metin + '”' }));
    govde.appendChild(durum);
    govde.appendChild(el('label', { class: 'var-etiket', for: 'kartOn', text: 'Ön yüz (soru)' })); govde.appendChild(on);
    govde.appendChild(el('label', { class: 'var-etiket', for: 'kartArka', text: 'Arka yüz (cevap)' })); govde.appendChild(arka);
    var kaydet = el('button', { class: 'dugme ana', type: 'button', onclick: function () {
      if (!on.value.trim() || !arka.value.trim()) { toast('İki yüzü de doldur.'); return; }
      kartEkle({ on: on.value.trim(), arka: arka.value.trim(), kitap: kj.id, bolum: ctx.bolum ? ctx.bolum.sira : null, blok: ctx.blok ? ctx.blok.id : null, kaynak: metin, ai: true }).then(function () { toast('Kart eklendi (AI rozetli).'); panelKapat(); });
    } }, ['Onayla ve kartlara ekle']);
    govde.appendChild(el('div', { style: 'display:flex;gap:8px;margin-top:10px;flex-wrap:wrap' }, [kaydet, el('button', { class: 'dugme', type: 'button', onclick: panelKapat }, ['Vazgeç'])]));
    AI.hazir().then(function (ok) {
      if (!ok) { durum.textContent = 'Yapay zekâ kapalı; kartı kendin yaz.'; on.value = metin; return; }
      return Y.sample.json('Tıp öğrencisi için tek bir flashcard üret. Yalnız aşağıdaki kitap metnine dayan, uydurma. Ön yüz kısa bir soru, arka yüz 1-2 cümlelik cevap olsun. Türkçe. Yalnız şu JSON\'u döndür: {"on":"...","arka":"..."}\n\n' +
        baglamMetni(ctx) + '\nKART KONUSU (kitaptan alıntı): "' + metin + '"', { cache: false }).then(function (j) {
        on.value = j.on || ''; arka.value = j.arka || ''; durum.textContent = 'Öneri hazır. Düzenleyip onayla. Kart "AI" rozetiyle ve kaynak alıntısıyla saklanır.';
      });
    }).catch(function (e) { durum.textContent = AI.hataMetni(e) + ' Kartı kendin yazabilirsin.'; on.value = metin; });
  }
  function kartEkle(k) {
    k.id = 'k' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
    k.t = Date.now();
    return U.depoGuncelle('kartlarim', function (v) { v.liste = v.liste || []; v.liste.push(k); }, 400);
  }
  U.kartEkle = kartEkle;

  /* ================= not / vurgu ================= */
  var RENKLER = [['sari', '#ffd65a'], ['yesil', '#6ee7a8'], ['mavi', '#6cc7ff'], ['pembe', '#ff8fc7']];
  function notAc(metin, ctx) {
    var kj = ctx.kj;
    var govde = panelAc('Not / vurgu', kj.baslik);
    govde.appendChild(el('p', { class: 'alinti', text: '“' + metin + '”' }));
    var renk = 'sari';
    var renkler = el('div', { class: 'yp-dugmeler', role: 'radiogroup', 'aria-label': 'Vurgu rengi' });
    RENKLER.forEach(function (r) {
      var b = el('button', { class: 'cip', type: 'button', role: 'radio', 'aria-checked': String(r[0] === renk), 'aria-pressed': String(r[0] === renk), style: '--c:' + r[1] }, [el('span', { class: 'nokta' }), r[0]]);
      b.addEventListener('click', function () { renk = r[0]; $$('.cip', renkler).forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); x.setAttribute('aria-checked', String(x === b)); }); });
      renkler.appendChild(b);
    });
    govde.appendChild(renkler);
    var ta = el('textarea', { id: 'notMetni', rows: '4', placeholder: 'Notun (isteğe bağlı)…', 'aria-label': 'Not' });
    govde.appendChild(ta);
    govde.appendChild(el('div', { style: 'display:flex;gap:8px;margin-top:10px;flex-wrap:wrap' }, [
      el('button', { class: 'dugme ana', type: 'button', onclick: function () {
        U.depoGuncelle('notlar', function (v) {
          v.liste = v.liste || [];
          v.liste.push({ id: 'n' + Date.now().toString(36), kitap: kj.id, bolum: ctx.bolum ? ctx.bolum.sira : 0, blok: ctx.blok ? ctx.blok.id : null, metin: metin, not: ta.value.trim(), renk: renk, t: Date.now() });
        }, 400).then(function () { toast('Kaydedildi.'); panelKapat(); vurgulariUygula(); });
      } }, ['Kaydet']),
      el('button', { class: 'dugme', type: 'button', onclick: panelKapat }, ['Vazgeç'])
    ]));
  }
  U.notAc = notAc;
  function vurgulariUygula() {
    var kj = Durum.aktifKitap; if (!kj) return;
    U.Depo.oku('notlar').then(function (v) {
      (v.liste || []).forEach(function (n) {
        if (n.kitap !== kj.id || !n.blok) return;
        var b = document.getElementById('b-' + n.blok); if (!b) return;
        $$('.cumle', b).forEach(function (c) { if (c.textContent.replace(/\s+/g, ' ').trim() === n.metin || (n.metin.length > 20 && c.textContent.indexOf(n.metin) >= 0)) { c.classList.add('vurgu-' + n.renk); if (n.not) c.title = n.not; } });
      });
    });
  }
  U.vurgulariUygula = vurgulariUygula;
  var eskiSon = U.sonIsle;
  U.sonIsle = function (alan, bolum, kj) { eskiSon(alan, bolum, kj); vurgulariUygula(); };

  /* ================= kavram kartı ================= */
  var Kavram = { dizin: {} };
  function kavramDizini(id) {
    if (!Kavram.dizin[id]) {
      Kavram.dizin[id] = Kitaplik.katalog().then(function () {
        var k = Kitaplik.kayit(id);
        return k ? Kitaplik.getir(k, 'kavramlar.json').catch(function () { return {}; }) : {};
      });
    }
    return Kavram.dizin[id];
  }
  U.kavramDizini = kavramDizini;
  function terimEsle(ad) {
    var k = katla(ad).replace(/[:.,;]+$/, '').trim();
    var varyant = [k, k.replace(/^(m|n|a|v|lig|art|os|proc|r)\.\s*/, ''), k.split(' (')[0]];
    return varyant;
  }
  function kavramAc(ad, ctx) {
    ad = ad.replace(/[:.,;]+$/, '').trim();
    var kj = ctx.kj;
    var govde = panelAc(ad, 'Kavram kartı');
    var bolumler = {
      tanim: kart('📖 Kitapta', 'tanim'), gorsel: kart('🖼 Görseller', 'gorsel'), dil: kart('🔤 Latince · Türkçe · İngilizce', 'dil'),
      klinik: kart('🩺 İlgili klinik ve tuzak kutuları', 'klinik'), soru: kart('📝 Geçtiği çıkmış sorular', 'soru'), diger: kart('📚 Diğer kitaplarda', 'diger'), ai: kart('✦ Yapay zekâ', 'ai')
    };
    function kart(baslik, id) { var k = el('section', { class: 'kk-bolum', 'data-k': id }, [el('h4', { text: baslik }), el('div', { class: 'kk-ic' }, [el('div', { class: 'yukleniyor', text: 'Aranıyor…' })])]); govde.appendChild(k); return $('.kk-ic', k); }
    var anahtarlar = terimEsle(ad);
    var qk = anahtarlar[1] || anahtarlar[0];
    // AI butonları
    bolumler.ai.innerHTML = '';
    var aiKutu = el('div');
    var aiDug = el('div', { class: 'yp-dugmeler' }, [
      el('button', { class: 'cip ai-gerek', type: 'button', onclick: function () { kavramAI('Bu kavramı kitap bağlamında açıkla: tanım, işlev, neden böyle olduğu.', 'acikla'); } }, ['Açıkla']),
      el('button', { class: 'cip ai-gerek', type: 'button', onclick: function () { kavramAI(EYLEMLER[6].istek, 'sema'); } }, ['Şema çiz']),
      el('button', { class: 'cip ai-gerek', type: 'button', onclick: function () { kartYap(ad, ctx); } }, ['Kart yap'])
    ]);
    bolumler.ai.appendChild(aiDug); bolumler.ai.appendChild(aiKutu); bolumler.ai.appendChild(aiYokNotu());
    function kavramAI(istek, eylem) {
      cevapCalistir(aiKutu, fnv(kj.id + '|kavram|' + katla(ad) + '|' + eylem), function () {
        return 'Bir tıp öğrencisi çalışma kitabında bir kavrama tıkladı.\n' + CEVAP_KURALI + '\n\n' + baglamMetni(ctx) + '\nKAVRAM: "' + ad + '"\nKitaptaki geçtiği yerler: ' + gecisOzeti + '\n\nİSTEK: ' + istek;
      }, { kj: kj, eylem: eylem });
    }
    var gecisOzeti = '';
    Promise.all([kavramDizini(kj.id), Kitaplik.terimler(kj.id), Kitaplik.sorular(kj.id).catch(function () { return []; })]).then(function (r) {
      var dz = r[0], terimler = r[1], sorular = r[2];
      var kayit = null;
      anahtarlar.forEach(function (a) { if (!kayit && dz[a]) kayit = dz[a]; });
      // 1) kitapta geçtiği yerler (alıntı + bağlantı)
      var yerler = kayit ? kayit.yer : [];
      var altlar = {};
      bolumler.tanim.innerHTML = '';
      var ilk = yerler.slice(0, 6);
      if (!ilk.length) bolumler.tanim.appendChild(el('p', { class: 'var-etiket', text: 'Kavram dizininde yok. Kitapta arıyorum…' }));
      Promise.all(ilk.map(function (y) { return Kitaplik.bolumAc(kj.id, y[0]).then(function (b) { return { y: y, b: b }; }).catch(function () { return null; }); })).then(function (lst) {
        lst.forEach(function (x) {
          if (!x) return;
          var blok = blokAra(x.b, x.y[3]);
          altlar[x.y[1]] = 1;
          var tx = blok ? blokMetni(blok) : (x.b.altlar.filter(function (a) { return a.id === x.y[1]; })[0] || {}).baslik || '';
          bolumler.tanim.appendChild(alintiBag(kj, x.b, x.y, tx, qk));
        });
        gecisOzeti = lst.filter(Boolean).map(function (x) { return (x.y[2] || x.b.kisa); }).join(', ');
        if (!ilk.length) {
          U.indeksle(kj.id).then(function (ix) {
            bolumler.tanim.innerHTML = '';
            var bul = ix.liste.filter(function (r) { return r.id && r.katli.indexOf(qk) >= 0; }).slice(0, 5);
            if (!bul.length) bolumler.tanim.appendChild(el('p', { class: 'var-etiket', text: 'Bu kitapta geçmiyor.' }));
            bul.forEach(function (r) { altlar[ix.kj.bolumler[r.b].altlar[r.a].id] = 1; bolumler.tanim.appendChild(alintiBag(kj, ix.kj.bolumler[r.b], [r.b, ix.kj.bolumler[r.b].altlar[r.a].id, ix.kj.bolumler[r.b].altlar[r.a].no, r.id], r.metin, qk)); });
            gorselleriBul();
          });
        } else gorselleriBul();
      });
      // 2) görseller
      function gorselleriBul() {
        var puan = {};
        kj.figurler.forEach(function (f) {
          if (!f.src) return;
          var p = 0;
          if (altlar[f.alt_bolum]) p += 3;
          (f.atifAltlar || []).forEach(function (a) { if (altlar[a]) p += 2; });
          var cap = katla((f.baslik || '') + ' ' + (f.alt || '') + ' ' + (f.aiBaslik || ''));
          if (cap.indexOf(qk) >= 0) p += 4;
          if ((f.anahtarlar || []).some(function (a) { return katla(a).indexOf(qk) >= 0; })) p += 2;
          if (p) puan[f.id] = p;
        });
        var sirali = Object.keys(puan).sort(function (a, b) { return puan[b] - puan[a]; }).slice(0, 12).map(function (id) { return kj.figurHarita[id]; });
        bolumler.gorsel.innerHTML = '';
        if (sirali.length) {
          var g = el('div', { class: 'kk-galeri' });
          sirali.forEach(function (f) {
            g.appendChild(el('button', { class: 'kk-fig', type: 'button', title: f.baslik || f.alt || '', onclick: function () { U.galeriAc(kj, f.id); } }, [el('img', { src: f.src, alt: f.alt || f.baslik || '', loading: 'lazy' }), el('span', { text: f.slayt || (f.baslik || '').slice(0, 40) })]));
          });
          bolumler.gorsel.appendChild(g);
          bolumler.gorsel.appendChild(el('p', { class: 'var-etiket', text: 'Kitabın kendi görselleri: kavramın geçtiği alt bölüm, metindeki slayt atıfları ve görsel başlıklarına göre eşlendi.' }));
        } else {
          bolumler.gorsel.appendChild(el('p', { class: 'var-etiket', text: 'Kitapta bu kavramla eşleşen görsel yok.' }));
          bolumler.gorsel.appendChild(el('button', { class: 'dugme kucuk ai-gerek', type: 'button', onclick: function () { kavramAI(EYLEMLER[6].istek, 'sema'); bolumler.ai.scrollIntoView({ behavior: 'smooth' }); } }, ['Yapay zekâya şema çizdir']));
        }
        var webQ = encodeURIComponent(ad + (kj.id === 'anatomi' ? ' anatomy' : ''));
        bolumler.gorsel.appendChild(el('div', { class: 'yp-dugmeler' }, [
          el('a', { class: 'cip', href: 'https://commons.wikimedia.org/w/index.php?search=' + webQ + '&title=Special:MediaSearch&type=image', target: '_blank', rel: 'noopener' }, ['Wikimedia Commons ↗']),
          el('a', { class: 'cip', href: 'https://www.google.com/search?tbm=isch&q=' + webQ, target: '_blank', rel: 'noopener' }, ['Google Görseller ↗'])
        ]));
        if (U.labDugmesi) U.labDugmesi(bolumler.gorsel, ad, kj);
      }
      // 3) sözlük / köken
      bolumler.dil.innerHTML = '';
      var tlist = terimler.filter(function (t) { var k = katla(t.terim); return anahtarlar.some(function (a) { return k === a || k.split(/[ (,]/)[0] === a || (a.length > 4 && k.indexOf(a) >= 0); }); }).slice(0, 4);
      if (!tlist.length) bolumler.dil.appendChild(el('p', { class: 'var-etiket', text: 'Sözlük ve köken kutularında girdisi yok.' }));
      tlist.forEach(function (t) {
        var dl = el('dl', { class: 'kk-dl' }, [el('dt', { text: t.basA || 'Terim' }), el('dd', { text: t.terim })]);
        Object.keys(t.alanlar).forEach(function (k) { dl.appendChild(el('dt', { text: k })); dl.appendChild(el('dd', { text: t.alanlar[k] })); });
        bolumler.dil.appendChild(dl);
      });
      // 4) klinik + tuzak kutuları
      U.indeksle(kj.id).then(function (ix) {
        bolumler.klinik.innerHTML = '';
        var kut = ix.liste.filter(function (r) { return /^(klinik|tuzak|siklik|neden)$/.test(r.tur) && r.katli.indexOf(qk) >= 0; }).slice(0, 6);
        if (!kut.length) bolumler.klinik.appendChild(el('p', { class: 'var-etiket', text: 'Bu kavramın geçtiği klinik/tuzak kutusu yok.' }));
        kut.forEach(function (r) { var b = ix.kj.bolumler[r.b]; var a = b.altlar[r.a]; bolumler.klinik.appendChild(alintiBag(kj, b, [r.b, a.id, a.no, r.id], r.metin, qk, U.turBilgi(kj, r.tur))); });
      });
      // 5) sorular
      bolumler.soru.innerHTML = '';
      var qs = sorular.filter(function (q) { return katla(q.baslik + ' ' + q.varyantlar.map(function (v) { return duz(v.govde) + ' ' + v.siklar.map(function (s) { return duz(s.m); }).join(' '); }).join(' ')).indexOf(qk) >= 0; }).slice(0, 8);
      if (!qs.length) bolumler.soru.appendChild(el('p', { class: 'var-etiket', text: 'Bu kavramı içeren soru yok.' }));
      qs.forEach(function (q) {
        var bs = kj.bolumler.findIndex(function (b) { return b.id === q.bolum; });
        bolumler.soru.appendChild(el('a', { class: 'kk-satir', href: '#' + U.okuHash(kj.id, bs), onclick: function () { Durum.vurguBlok = q.blok; panelKapat(); } },
          [el('span', { text: (q.baslik || '').replace(/^📝\s*(Çıkmış soru —\s*)?/, '') }), q.onem && q.onem.yildiz ? el('span', { class: 'onem', text: (q.onem.ates ? '🔥 ' : '') + '★' + q.onem.yildiz }) : null]));
      });
      // 6) diğer kitaplar
      Kitaplik.katalog().then(function (liste) {
        return Promise.all(liste.filter(function (k) { return k.id !== kj.id; }).map(function (k) {
          return Promise.all([kavramDizini(k.id), Kitaplik.ac(k.id)]).then(function (r) { var x = null; anahtarlar.forEach(function (a) { if (!x && r[0][a]) x = r[0][a]; }); return x ? { k: r[1], x: x } : null; }).catch(function () { return null; });
        }));
      }).then(function (lst) {
        bolumler.diger.innerHTML = '';
        lst = lst.filter(Boolean);
        if (!lst.length) bolumler.diger.appendChild(el('p', { class: 'var-etiket', text: 'Diğer kitaplarda kavram olarak geçmiyor.' }));
        lst.forEach(function (o) {
          var satir = el('div', { class: 'kk-diger' }, [el('strong', { style: 'color:' + o.k.renk, text: o.k.baslik.replace(/^1001\s*/, '') + ': ' })]);
          o.x.yer.slice(0, 6).forEach(function (y, i) {
            var b = o.k.bolumler[y[0]];
            satir.appendChild(el('a', { class: 'capraz', href: '#' + U.okuHash(o.k.id, y[0]), onclick: function () { Durum.vurguBlok = y[3]; panelKapat(); }, text: y[2] || ('Bölüm ' + (b && b.no != null ? b.no : y[0])) }));
            if (i < Math.min(5, o.x.yer.length - 1)) satir.appendChild(document.createTextNode(', '));
          });
          bolumler.diger.appendChild(satir);
        });
      });
    });
  }
  U.kavramAc = kavramAc;
  function blokAra(bolum, id) { var bul = null; bolum.altlar.forEach(function (a) { (function g(l) { l.forEach(function (x) { if (x.id === id) bul = x; if (x.bloklar && !bul) g(x.bloklar); }); })(a.bloklar); }); return bul; }
  function blokMetni(x) { return x.html ? duz(x.html) : x.ogeler ? x.ogeler.map(duz).join(' • ') : x.satir ? x.satir.map(function (s) { return s.map(duz).join(' | '); }).join(' / ') : x.bloklar ? x.bloklar.map(blokMetni).join(' ') : (x.metin || ''); }
  function alintiBag(kj, bolum, y, tx, qk, tur) {
    var k = katla(tx), i = k.indexOf(qk), bas = Math.max(0, i - 90), son = Math.min(tx.length, (i < 0 ? 0 : i) + qk.length + 160);
    var parca = tx.slice(bas, son), h = esc(parca);
    if (i >= 0 && k.length === tx.length) { var o = i - bas; h = esc(parca.slice(0, o)) + '<mark>' + esc(parca.slice(o, o + qk.length)) + '</mark>' + esc(parca.slice(o + qk.length)); }
    return el('a', { class: 'kk-alinti', href: '#' + U.okuHash(kj.id, y[0]), style: tur ? '--c:' + tur.renk : null, onclick: function () { Durum.vurguBlok = y[3]; panelKapat(); } }, [
      el('small', { text: (tur ? tur.ikon + ' ' + tur.etiket + ' · ' : '') + (y[2] ? kj.baslik.replace(/^1001\s*/, '') + ' ' + y[2] : bolum.kisa) }),
      el('span', { html: (bas ? '…' : '') + h + (son < tx.length ? '…' : '') })]);
  }

  /* ================= seçim araç çubuğu ================= */
  var secimCubugu = null;
  function secimKontrol() {
    var s = window.getSelection();
    var t = s && String(s).replace(/\s+/g, ' ').trim();
    if (!t || t.length < 2 || t.length > 600 || !s.rangeCount) { if (secimCubugu) secimCubugu.hidden = true; return; }
    var r = s.getRangeAt(0), kap = r.commonAncestorContainer;
    kap = kap.nodeType === 1 ? kap : kap.parentNode;
    if (!kap.closest || !kap.closest('.metin') || document.body.classList.contains('okuma-modu')) { if (secimCubugu) secimCubugu.hidden = true; return; }
    if (!secimCubugu) {
      secimCubugu = el('div', { class: 'secim-cubugu', role: 'toolbar', 'aria-label': 'Seçim araçları' });
      document.body.appendChild(secimCubugu);
    }
    var ctx = { kj: Durum.aktifKitap, bolum: Durum.aktifBolum, blok: blokBul(kap) };
    secimCubugu.innerHTML = '';
    [['Açıkla', function () { cumlePaneli(t, ctx); }], ['Görsel bul', function () { kavramAc(t.slice(0, 60), ctx); }], ['Kart yap', function () { kartYap(t, ctx); }], ['Not', function () { notAc(t, ctx); }]].forEach(function (d) {
      secimCubugu.appendChild(el('button', { type: 'button', onmousedown: function (e) { e.preventDefault(); }, onclick: function () { secimCubugu.hidden = true; d[1](); } }, [d[0]]));
    });
    var k = r.getBoundingClientRect();
    secimCubugu.hidden = false;
    var w = secimCubugu.offsetWidth;
    secimCubugu.style.left = Math.max(8, Math.min(window.innerWidth - w - 8, k.left + k.width / 2 - w / 2)) + 'px';
    secimCubugu.style.top = (k.top > 70 ? k.top - 48 : k.bottom + 8) + window.scrollY + 'px';
  }
  document.addEventListener('selectionchange', U.geciktir(secimKontrol, 250));

  /* ================= okuma modu ================= */
  function okumaModu(acik) { document.body.classList.toggle('okuma-modu', acik); U.ls('okumaModu', acik); }
  okumaModu(!!U.ls('okumaModu'));
  function okumaDugmesi() {
    var arac = $('.arac-cubugu');
    if (!arac || $('#okumaModuDug', arac)) return;
    var d = el('button', { id: 'okumaModuDug', class: 'ikon-dugme', type: 'button', 'aria-pressed': String(document.body.classList.contains('okuma-modu')), title: 'Okuma modu: cümle tıklamayı kapatır' },
      ['☾', el('span', { class: 'uzun', text: ' Okuma modu' })]);
    d.addEventListener('click', function () { var a = !document.body.classList.contains('okuma-modu'); okumaModu(a); d.setAttribute('aria-pressed', String(a)); toast(a ? 'Okuma modu: tıklamalar kapalı.' : 'Tıklama açık: cümleye ya da kalın terime dokun.'); });
    arac.insertBefore(d, arac.lastChild);
  }
  var sonIsle2 = U.sonIsle;
  U.sonIsle = function (alan, bolum, kj) { sonIsle2(alan, bolum, kj); okumaDugmesi(); };

  /* ================= galeri: "bu görseli açıkla" ================= */
  U.galeriEk = function (baslik, f, kj) {
    var d = el('button', { class: 'dugme kucuk ai-gerek', type: 'button', style: 'margin-top:6px' }, ['✦ Bu görseli açıkla']);
    var kutu = el('div', { class: 'ai-gorsel-cevap' });
    d.addEventListener('click', function () { gorselAcikla(f, kj, kutu); });
    baslik.appendChild(d); baslik.appendChild(kutu);
  };
  function gorselBlob(f) {
    return fetch(f.src).then(function (r) { return r.blob(); }).then(function (b) {
      if (/svg/.test(b.type) || /\.svg$/i.test(f.src)) {
        return new Promise(function (ok, red) {
          var img = new Image(); var u = URL.createObjectURL(b);
          img.onload = function () { var c = document.createElement('canvas'); var s = Math.min(1, 1400 / Math.max(img.width || 800, img.height || 600)); c.width = (img.width || 800) * s; c.height = (img.height || 600) * s; var x = c.getContext('2d'); x.fillStyle = '#fff'; x.fillRect(0, 0, c.width, c.height); x.drawImage(img, 0, 0, c.width, c.height); c.toBlob(function (bb) { URL.revokeObjectURL(u); ok(bb); }, 'image/png'); };
          img.onerror = red; img.src = u;
        });
      }
      return b;
    });
  }
  function gorselAcikla(f, kj, kutu) {
    kutu.innerHTML = '';
    var anahtar = fnv(kj.id + '|gorsel|' + f.id);
    AI.onbellekOku(anahtar).then(function (o) {
      if (o && o.metin) { kutu.innerHTML = mdHtml(o.metin); kutu.appendChild(el('span', { class: 'etiket-kucuk ai', text: 'AI · önbellekten' })); return; }
      kutu.appendChild(el('div', { class: 'yukleniyor', text: 'Görsel inceleniyor…' }));
      return AI.hazir().then(function (ok) {
        if (!ok) throw { code: 'not_granted' };
        return Y.sample.limits().then(function (l) {
          if (!l || !l.images) throw { code: 'images_unavailable' };
          return gorselBlob(f).then(function (b) {
            return Y.sample('Bu görsel bir tıp çalışma kitabından (' + kj.baslik + '). Başlığı: "' + (f.baslik || f.alt || '') + '". Görselde ne gösterildiğini Türkçe, kısa maddelerle açıkla; önemli yapıları adlandır. Emin olmadığın etiketleri "emin değilim" diye belirt. Sonda "**Etiketler:**" satırına 3-8 kavram yaz.',
              { images: [b], cache: false, onText: function (u) { kutu.innerHTML = mdHtml(u.text); } });
          });
        });
      }).then(function (r) {
        kutu.innerHTML = mdHtml(r.text);
        kutu.appendChild(el('span', { class: 'etiket-kucuk ai', text: 'AI üretimi' }));
        AI.onbellekYaz(anahtar, { metin: r.text, t: Date.now(), kitap: kj.id, figur: f.id });
        var m = /Etiketler:\**\s*(.+)$/im.exec(r.text);
        if (m && Y.db) Y.db.doc('figurEtiket/' + kj.id + '~' + f.id).set({ kitap: kj.id, figur: f.id, etiketler: m[1].split(/[,;·]/).map(function (x) { return x.trim(); }).filter(Boolean).slice(0, 8), t: Date.now() }).catch(function () {});
      });
    }).catch(function (e) { kutu.innerHTML = ''; kutu.appendChild(el('p', { class: 'hata-metni', text: AI.hataMetni(e) })); });
  }

  /* ================= sohbet ================= */
  U.SEKMELER.push({ id: 'sohbet', ad: 'Sohbet', ikon: '✦' });
  U.SEKMELER.push({ id: 'ekle', ad: 'Kitap ekle', ikon: '＋' });
  var Sohbet = { konu: null, mesajlar: [], ctl: null };
  function sohbetAraclari() {
    return [
      { name: 'kitapta_ara', description: 'Kütüphanedeki kitaplarda metin arar. En fazla 8 sonuç döndürür: her biri {kaynak, kitap, konum, metin}. Cevapta alıntı yaparken sonucun "kaynak" alanını aynen yaz.',
        inputSchema: { type: 'object', properties: { sorgu: { type: 'string', description: 'Aranacak kelime/ifade (Türkçe)' }, kitap: { type: 'string', description: 'İsteğe bağlı kitap kimliği: ' + (Kitaplik.liste || []).map(function (k) { return k.id; }).join(', ') } }, required: ['sorgu'] },
        execute: function (g) { return aramaAraci(String(g.sorgu || ''), g.kitap ? String(g.kitap) : null); } },
      { name: 'bolum_getir', description: 'Bir kitabın bölümünü ya da alt bölümünü (no: "4" ya da "4.6") metin olarak getirir (en çok ~5000 karakter). Bölüm numarası verilmezse içindekileri döndürür.',
        inputSchema: { type: 'object', properties: { kitap: { type: 'string' }, no: { type: 'string' } }, required: ['kitap'] },
        execute: function (g) { return bolumAraci(String(g.kitap || ''), g.no ? String(g.no) : null); } },
      { name: 'kavram_getir', description: 'Bir kavramın kitaplardaki sözlük/köken girdisini ve geçtiği yerleri döndürür.',
        inputSchema: { type: 'object', properties: { ad: { type: 'string' } }, required: ['ad'] },
        execute: function (g) { return kavramAraci(String(g.ad || '')); } }
    ];
  }
  U.sohbetAraclari = sohbetAraclari;
  function kaynakJeton(kj, bsira, blokId, etiket) { return '[kaynak:' + kj.id + '|' + bsira + '|' + (blokId || '') + '|' + etiket + ']'; }
  // Arama (Carvis): sorgu kelimeleri ayrı ayrı puanlanır; kısaltmalar açılır; en alakalı sonuçlar önce gelir.
  var ARAMA_KISA = { ga: 'güven aralığı', sd: 'standart sapma', se: 'standart hata', ppv: 'pozitif öngörü değeri', npv: 'negatif öngörü değeri', anova: 'varyans analizi', gnkt: 'genel kareler toplamı', gakt: 'gruplar arası kareler toplamı', gikt: 'gruplar içi kareler toplamı' };
  var ARAMA_DURDUR = { ve: 1, veya: 1, ile: 1, bir: 1, bu: 1, da: 1, de: 1, mi: 1, mı: 1, mu: 1, nedir: 1, nasıl: 1, ne: 1, için: 1, olan: 1, gibi: 1, hangi: 1, hangisi: 1 };
  function aramaGruplari(q) {
    return katla(q).split(/\s+/).filter(function (w) { return w && !ARAMA_DURDUR[w]; }).map(function (w) {
      var g = [w];
      if (ARAMA_KISA[w]) katla(ARAMA_KISA[w]).split(/\s+/).forEach(function (x) { if (x && g.indexOf(x) < 0) g.push(x); });
      return g;
    });
  }
  // Puan: eşleşen kelime grupları sayısı; grupların en az %60'ı eşleşmeli; tam sorgu geçiyorsa bonus.
  function aramaPuani(katli, gruplar, tamSorgu) {
    var say = 0;
    gruplar.forEach(function (g) { if (g.some(function (x) { return katli.indexOf(x) >= 0; })) say++; });
    if (say === 0 || say < Math.max(1, Math.ceil(gruplar.length * 0.6))) return 0;
    return say + (tamSorgu && katli.indexOf(tamSorgu) >= 0 ? 2 : 0);
  }
  function aramaAraci(q, kitap) {
    var qk = katla(q).trim();
    var gruplar = aramaGruplari(q);
    if (!gruplar.length) return 'Sonuç yok: "' + q + '"';
    return Kitaplik.katalog().then(function (liste) {
      var hedef = liste.filter(function (k) { return !kitap || k.id === kitap; });
      return Promise.all(hedef.map(function (k) { return U.indeksle(k.id).catch(function () { return null; }); }));
    }).then(function (ixler) {
      var adaylar = [];
      ixler.forEach(function (ix) {
        if (!ix) return;
        ix.liste.forEach(function (r) {
          if (!r.id) return;
          var p = aramaPuani(r.katli, gruplar, qk);
          if (p > 0) adaylar.push({ p: p, ix: ix, r: r });
        });
      });
      adaylar.sort(function (x, y) { return y.p - x.p; });
      var out = [], kitapSay = {};
      adaylar.forEach(function (c) {
        if (out.length >= 8) return;
        var kid = c.ix.kj.id;
        if ((kitapSay[kid] || 0) >= 5) return;
        kitapSay[kid] = (kitapSay[kid] || 0) + 1;
        var b = c.ix.kj.bolumler[c.r.b], a = b.altlar[c.r.a];
        var konum = c.ix.kj.baslik.replace(/^1001\s*/, '') + ' ' + (a.no || ('Bölüm ' + (b.no != null ? b.no : b.kisa)));
        out.push({ kaynak: kaynakJeton(c.ix.kj, c.r.b, c.r.id, konum), kitap: kid, konum: konum + (a.baslik ? ' — ' + a.baslik : ''), metin: c.r.metin.slice(0, 380) });
      });
      if (!out.length) return 'Sonuç yok: "' + q + '"';
      return out;
    });
  }
  function bolumAraci(kitap, no) {
    if (!Kitaplik.kayit(kitap)) throw new Error('Böyle bir kitap yok. Geçerli kimlikler: ' + (Kitaplik.liste || []).map(function (k) { return k.id; }).join(', '));
    return Kitaplik.ac(kitap).then(function (kj) {
      if (!no) return kj.bolumler.map(function (b, i) { return { sira: i, no: b.no, baslik: b.baslik, altlar: b.altlar.filter(function (a) { return a.no; }).map(function (a) { return a.no + ' ' + (a.baslik || '').replace(/^\d+\.\d+\s*/, ''); }).slice(0, 30) }; });
      var hedef = kj.altNo[no] || (kj.bolumNo[no] ? { b: kj.bolumNo[no], a: null } : null);
      if (!hedef) throw new Error(no + ' numaralı bölüm bulunamadı.');
      return Kitaplik.bolumAc(kitap, hedef.b.sira).then(function (bol) {
        var metin = hedef.a ? altMetni(bol, hedef.a.id, 5000) : bol.altlar.map(function (a) { return a.baslik || ''; }).join('\n') + '\n\n' + altMetni(bol, bol.altlar[0].id, 3000);
        return { kaynak: kaynakJeton(kj, hedef.b.sira, null, kj.baslik.replace(/^1001\s*/, '') + ' ' + no), baslik: hedef.a ? hedef.a.baslik : hedef.b.baslik, metin: metin };
      });
    });
  }
  function kavramAraci(ad) {
    var an = terimEsle(ad);
    return Kitaplik.katalog().then(function (liste) {
      return Promise.all(liste.map(function (k) {
        return Promise.all([kavramDizini(k.id), Kitaplik.terimler(k.id), Kitaplik.ac(k.id)]).then(function (r) {
          var x = null; an.forEach(function (a) { if (!x && r[0][a]) x = r[0][a]; });
          var t = r[1].filter(function (t) { var kk = katla(t.terim); return an.indexOf(kk) >= 0 || an.indexOf(kk.split(/[ (,]/)[0]) >= 0; }).slice(0, 3);
          if (!x && !t.length) return null;
          return { kitap: k.id, sozluk: t.map(function (z) { return Object.assign({ terim: z.terim }, z.alanlar); }),
            gectigi: x ? x.yer.slice(0, 8).map(function (y) { return kaynakJeton(r[2], y[0], y[3], r[2].baslik.replace(/^1001\s*/, '') + ' ' + (y[2] || 'Bölüm ' + r[2].bolumler[y[0]].no)); }) : [] };
        }).catch(function () { return null; });
      }));
    }).then(function (l) { l = l.filter(Boolean); return l.length ? l : 'Kavram dizinlerinde yok; kitapta_ara ile dene.'; });
  }

  U.GORUNUMLER.sohbet = function () {
    var ana = $('#ana'); ana.innerHTML = '';
    var sayfa = el('div', { class: 'sohbet-sayfa' });
    ana.appendChild(sayfa);
    var konular = el('nav', { class: 'sohbet-konular', 'aria-label': 'Konular' });
    var akis = el('div', { class: 'sohbet-akis', 'aria-live': 'polite' });
    var form = el('form', { class: 'sohbet-form' });
    var girdi = el('textarea', { id: 'sohbetGirdi', rows: '2', placeholder: 'Sor: "Femur boynu neden kırılgan?", "SE ile SD farkı ne?", "Hemoglobinde proksimal His ne yapar?"', 'aria-label': 'Mesaj' });
    var gonder = el('button', { class: 'dugme ana', type: 'submit' }, ['Gönder']);
    var durdur = el('button', { class: 'dugme', type: 'button', hidden: true, onclick: function () { if (Sohbet.ctl) Sohbet.ctl.abort(); } }, ['Durdur']);
    form.appendChild(girdi); form.appendChild(el('div', { class: 'sohbet-dugmeler' }, [durdur, gonder]));
    var baglamSec = el('select', { id: 'sohbetBaglam', 'aria-label': 'Bağlam kitabı' });
    sayfa.appendChild(konular);
    sayfa.appendChild(el('div', { class: 'sohbet-ana' }, [
      el('div', { class: 'sohbet-ust' }, [el('div', { class: 'ust-etiket', text: 'Kitaplarla sohbet' }), el('label', { class: 'var-etiket', for: 'sohbetBaglam' }, ['Öncelikli kitap: ']), baglamSec]),
      akis, form, aiYokNotu()]));
    Kitaplik.katalog().then(function (l) {
      baglamSec.appendChild(el('option', { value: '', text: 'Hepsi' }));
      l.forEach(function (k) { baglamSec.appendChild(el('option', { value: k.id, text: k.baslik, selected: Durum.kitapId === k.id ? true : null })); });
    });
    girdi.addEventListener('keydown', function (e) { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); form.requestSubmit ? form.requestSubmit() : form.dispatchEvent(new Event('submit')); } });
    function konulariCiz() {
      U.Depo.oku('sohbetler').then(function (v) {
        konular.innerHTML = '';
        konular.appendChild(el('button', { class: 'dugme kucuk', type: 'button', onclick: function () { Sohbet.konu = null; Sohbet.mesajlar = []; akisCiz(); konulariCiz(); } }, ['＋ Yeni konu']));
        (v.liste || []).slice().reverse().forEach(function (k) {
          konular.appendChild(el('button', { class: 'ray-bolum', type: 'button', 'aria-current': String(Sohbet.konu === k.id), onclick: function () {
            U.Depo.oku('sohbet-' + k.id).then(function (d) { Sohbet.konu = k.id; Sohbet.mesajlar = d.mesajlar || []; akisCiz(); konulariCiz(); });
          } }, [k.baslik]));
        });
      });
    }
    function akisCiz() {
      akis.innerHTML = '';
      if (!Sohbet.mesajlar.length) akis.appendChild(el('div', { class: 'bos', text: 'Kitaplara dayalı sorular sor. Asistan kitapta arar, bölüm getirir ve kaynağı bağlantı olarak verir. Kitapta yoksa genel bilgisini kullanır ve bunu belirtir.' }));
      Sohbet.mesajlar.forEach(function (m) { akis.appendChild(mesajCiz(m)); });
      akis.scrollTop = akis.scrollHeight;
    }
    function mesajCiz(m) {
      var d = el('div', { class: 'mesaj ' + (m.rol === 'user' ? 'ben' : 'o') });
      if (m.rol === 'user') d.appendChild(el('p', { text: m.metin }));
      else { d.innerHTML = mdHtml(m.metin); bolumIsaretle(d); kaynakBagla(d); if (U.testBagla) U.testBagla(d); }
      return d;
    }
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var q = girdi.value.trim();
      if (!q || gonder.disabled) return;
      girdi.value = '';
      Sohbet.mesajlar.push({ rol: 'user', metin: q, t: Date.now() });
      akisCiz();
      var cevapEl = el('div', { class: 'mesaj o' }, [el('div', { class: 'yukleniyor', text: 'Düşünüyor…' })]);
      akis.appendChild(cevapEl); akis.scrollTop = akis.scrollHeight;
      gonder.disabled = true; durdur.hidden = false;
      var izEl = el('div', { class: 'var-etiket arac-iz' });
      AI.hazir().then(function (ok) {
        if (!ok) throw { code: 'not_granted' };
        return Y.sample.limits().then(function (l) {
          var araclar = l && l.tools ? sohbetAraclari().concat(U.sohbetEkAraclari ? U.sohbetEkAraclari() : []).map(function (t) {
            var ex = t.execute;
            t.execute = function (g) { izEl.textContent = '⚙ ' + t.name + '(' + Object.keys(g || {}).map(function (k) { return g[k]; }).join(', ') + ')'; if (!izEl.parentNode) cevapEl.prepend(izEl); return ex(g); };
            return t;
          }) : null;
          Sohbet.ctl = new AbortController();
          var kural = 'Sen bir tıp öğrencisinin kişisel çalışma asistanısın. Kütüphanede şu kitaplar var: ' + (Kitaplik.liste || []).map(function (k) { return k.id + ' (' + k.baslik + ')'; }).join(', ') + '.' +
            (baglamSec.value ? ' Öğrenci şu an özellikle ' + baglamSec.value + ' kitabıyla çalışıyor.' : '') +
            (Durum.aktifBolum && Durum.aktifKitap ? ' En son okuduğu yer: ' + Durum.aktifKitap.baslik + ', ' + Durum.aktifBolum.baslik + '.' : '') +
            '\nKurallar: Türkçe, kısa ve net yaz. Kitaba dayalı her bilgi için ' + (araclar ? 'önce araçlarla kitapta ara (kitapta_ara, bolum_getir, kavram_getir) ve ' : '') + 'kaynağı, araç sonucundaki "kaynak" alanını (örn. [kaynak:anatomi|6|...|Anatomi 6.3]) AYNEN kopyalayarak göster. Cevabı "**Kitaptan:**" ve "**Genel bilgi:**" olarak ayır; kitapta bulamadığını kitaptan geliyormuş gibi yazma; emin değilsen söyle. Uydurma kaynak jetonu yazma.' + (araclar && U.sohbetEkKural ? U.sohbetEkKural : '');
          var turlar = [{ role: 'user', content: kural + '\n\nAnladıysan yalnız "Tamam" yaz.' }, { role: 'assistant', content: 'Tamam.' }]
            .concat(Sohbet.mesajlar.slice(-12).map(function (m) { return { role: m.rol === 'user' ? 'user' : 'assistant', content: m.metin }; }));
          var o = { signal: Sohbet.ctl.signal, onText: function (u) { cevapEl.innerHTML = mdHtml(u.text); if (izEl.textContent) cevapEl.prepend(izEl); akis.scrollTop = akis.scrollHeight; } };
          if (araclar) o.tools = araclar; else o.cache = false;
          return Y.sample(turlar, o);
        });
      }).then(function (r) {
        Sohbet.mesajlar.push({ rol: 'assistant', metin: U.sohbetSonrasi ? U.sohbetSonrasi(r.text) : r.text, t: Date.now() });
        cevapEl.replaceWith(mesajCiz(Sohbet.mesajlar[Sohbet.mesajlar.length - 1]));
        kaydet(q);
      }).catch(function (e) {
        cevapEl.innerHTML = e && e.text ? mdHtml(e.text) : '';
        cevapEl.appendChild(el('p', { class: 'hata-metni', text: AI.hataMetni(e) }));
        if (e && e.text) { Sohbet.mesajlar.push({ rol: 'assistant', metin: e.text + '\n\n(yarıda kaldı)', t: Date.now() }); kaydet(q); }
      }).then(function () { gonder.disabled = false; durdur.hidden = true; });
    });
    function kaydet(ilkSoru) {
      if (!Sohbet.konu) {
        Sohbet.konu = 's' + Date.now().toString(36);
        U.depoGuncelle('sohbetler', function (v) { v.liste = v.liste || []; v.liste.push({ id: Sohbet.konu, baslik: ilkSoru.slice(0, 60), t: Date.now() }); if (v.liste.length > 60) v.liste.shift(); }, 300).then(konulariCiz);
      }
      // belge 256 KB sınırı: son 60 mesaj
      U.Depo.yaz('sohbet-' + Sohbet.konu, { mesajlar: Sohbet.mesajlar.slice(-60) });
    }
    konulariCiz(); akisCiz();
  };
  function kaynakBagla(kok) {
    $$('a.kaynak-bag', kok).forEach(function (a) { a.addEventListener('click', function () { Durum.vurguBlok = a.dataset.blok || null; }); });
  }
  U.kaynakBagla = kaynakBagla;

  /* ================= kitap ekleme ================= */
  var Betik = {};
  function betikYukle(url, kontrol) {
    if (kontrol()) return Promise.resolve();
    if (!Betik[url]) Betik[url] = new Promise(function (ok, red) { var s = document.createElement('script'); s.src = url; s.onload = ok; s.onerror = function () { delete Betik[url]; red(new Error('Kütüphane yüklenemedi: ' + url)); }; document.head.appendChild(s); });
    return Betik[url];
  }
  var JSZIP = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js';
  var PDFJS = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
  var PDFJS_W = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

  U.GORUNUMLER.ekle = function () {
    var ana = $('#ana'); ana.innerHTML = '';
    var sayfa = el('div', { class: 'sayfa' });
    ana.appendChild(sayfa);
    sayfa.appendChild(el('div', { class: 'kahraman' }, [el('div', { class: 'ust-etiket', text: 'Kütüphaneye kitap ekle' }), el('h1', { text: 'Kitap ekle' }),
      el('p', { text: 'JSON (1001 şeması, tahminsiz), ZIP ya da klasör (HTML + görseller), tek HTML, Markdown/TXT ya da PDF bırak. Eklemeden önce rapor gösterilir; onaylamadan hiçbir şey kaydedilmez.' })]));
    var giris = el('input', { id: 'dosyaSec', type: 'file', accept: '.json,.zip,.html,.htm,.md,.txt,.pdf', multiple: true, class: 'gizli-erisim' });
    var klasor = el('input', { id: 'klasorSec', type: 'file', webkitdirectory: true, multiple: true, class: 'gizli-erisim' });
    var alan = el('div', { class: 'birak', tabindex: '0', role: 'button', 'aria-label': 'Dosya seç ya da buraya bırak' }, [
      el('div', { class: 'birak-halka', 'aria-hidden': 'true', text: '＋' }),
      el('strong', { text: 'Dosyayı buraya bırak' }), el('span', { class: 'var-etiket', text: '.json · .zip · .html · .md · .txt · .pdf' }),
      el('div', { class: 'yp-dugmeler', style: 'justify-content:center' }, [
        el('label', { class: 'dugme kucuk', for: 'dosyaSec' }, ['Dosya seç']), el('label', { class: 'dugme kucuk', for: 'klasorSec' }, ['Klasör seç'])])
    ]);
    var rapor = el('div', { class: 'ekle-rapor' });
    sayfa.appendChild(giris); sayfa.appendChild(klasor); sayfa.appendChild(alan); sayfa.appendChild(rapor);
    var yonetim = el('section', { class: 'yonetim' });
    sayfa.appendChild(yonetim);
    yonetimCiz(yonetim);
    alan.addEventListener('dragover', function (e) { e.preventDefault(); alan.classList.add('ustunde'); });
    alan.addEventListener('dragleave', function () { alan.classList.remove('ustunde'); });
    alan.addEventListener('drop', function (e) {
      e.preventDefault(); alan.classList.remove('ustunde');
      var items = e.dataTransfer.items, dosyalar = [];
      if (items && items.length && items[0].webkitGetAsEntry) {
        var girdiler = Array.prototype.map.call(items, function (i) { return i.webkitGetAsEntry(); }).filter(Boolean);
        klasorOku(girdiler).then(function (l) { isle(l); });
      } else isle(Array.prototype.map.call(e.dataTransfer.files, function (f) { return { yol: f.name, dosya: f }; }));
    });
    alan.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); giris.click(); } });
    giris.addEventListener('change', function () { isle(Array.prototype.map.call(giris.files, function (f) { return { yol: f.name, dosya: f }; })); giris.value = ''; });
    klasor.addEventListener('change', function () { isle(Array.prototype.map.call(klasor.files, function (f) { return { yol: f.webkitRelativePath || f.name, dosya: f }; })); klasor.value = ''; });
    function isle(liste) {
      rapor.innerHTML = '';
      rapor.appendChild(el('div', { class: 'yukleniyor', text: 'Okunuyor ve ayrıştırılıyor…' }));
      paketOku(liste).then(function (p) { onizle(p, rapor, yonetim); }).catch(function (e) {
        rapor.innerHTML = ''; rapor.appendChild(el('div', { class: 'bos hata-metni', text: 'Okunamadı: ' + (e.message || e) }));
      });
    }
  };
  function klasorOku(girdiler) {
    var out = [];
    function gez(g, yol) {
      return new Promise(function (ok) {
        if (g.isFile) g.file(function (f) { out.push({ yol: yol + f.name, dosya: f }); ok(); }, function () { ok(); });
        else if (g.isDirectory) {
          var r = g.createReader(), hepsi = [];
          (function oku() { r.readEntries(function (l) { if (!l.length) Promise.all(hepsi.map(function (x) { return gez(x, yol + g.name + '/'); })).then(ok); else { hepsi = hepsi.concat(Array.prototype.slice.call(l)); oku(); } }, function () { ok(); }); })();
        } else ok();
      });
    }
    return Promise.all(girdiler.map(function (g) { return gez(g, ''); })).then(function () { return out; });
  }
  // Dosya listesi → {kitap, gorseller: {göreliYol: Blob}}
  function paketOku(liste) {
    if (liste.length === 1 && /\.zip$/i.test(liste[0].yol)) {
      return betikYukle(JSZIP, function () { return !!window.JSZip; }).then(function () { return window.JSZip.loadAsync(liste[0].dosya); }).then(function (zip) {
        var l = [];
        zip.forEach(function (yol, g) { if (!g.dir && !/(^|\/)(__MACOSX|\.)/.test(yol)) l.push({ yol: yol, zip: g }); });
        return Promise.all(l.map(function (x) { return x.zip.async('blob').then(function (b) { return { yol: x.yol, dosya: new File([b], x.yol.split('/').pop(), { type: tipBul(x.yol) }) }; }); }));
      }).then(paketOku);
    }
    var ana = liste.filter(function (x) { return /\.json$/i.test(x.yol) && !/manifest\.json$/i.test(x.yol); })[0] || liste.filter(function (x) { return /\.html?$/i.test(x.yol); }).sort(function (a, b) { return b.dosya.size - a.dosya.size; })[0] ||
      liste.filter(function (x) { return /\.(md|txt)$/i.test(x.yol); })[0] || liste.filter(function (x) { return /\.pdf$/i.test(x.yol); })[0];
    if (!ana) return Promise.reject(new Error('Kitap dosyası bulunamadı (.json, .html, .md, .txt ya da .pdf gerekli).'));
    var gorseller = {};
    liste.forEach(function (x) { if (/\.(jpe?g|png|gif|webp|svg)$/i.test(x.yol)) gorseller[x.yol.replace(/\\/g, '/')] = x.dosya; });
    var anaKlasor = ana.yol.replace(/\\/g, '/').split('/').slice(0, -1).join('/');
    function gorselBul(src) {
      if (!src || /^(https?:|data:)/i.test(src)) return null;
      var tam = normal((anaKlasor ? anaKlasor + '/' : '') + src);
      if (gorseller[tam]) return tam;
      var ad = src.split('/').pop();
      var k = Object.keys(gorseller).filter(function (p) { return p.split('/').pop() === ad; })[0];
      return k || null;
    }
    var baslikTahmin = ana.yol.split('/').pop().replace(/\.[^.]+$/, '').replace(/[_-]+/g, ' ');
    var manifest = liste.filter(function (x) { return /manifest\.json$/i.test(x.yol); })[0];
    var tur = /\.json$/i.test(ana.yol) ? 'json' : /\.html?$/i.test(ana.yol) ? 'html' : /\.pdf$/i.test(ana.yol) ? 'pdf' : 'md';
    var kitapSozu;
    if (tur === 'json') kitapSozu = ana.dosya.text().then(function (t) { return A.jsonKitap(JSON.parse(t)); });
    else if (tur === 'html') kitapSozu = ana.dosya.text().then(function (t) {
      var doc = new DOMParser().parseFromString(t, 'text/html'); // script çalışmaz
      return A.htmlKitap(doc, { gorselCoz: gorselBul, kaynak: { tur: 'html', dosya: ana.yol } });
    });
    else if (tur === 'md') kitapSozu = ana.dosya.text().then(function (t) { return A.mdKitap(t, { baslik: baslikTahmin, tur: /\.txt$/i.test(ana.yol) ? 'txt' : 'md' }); });
    else kitapSozu = pdfMetni(ana.dosya).then(function (sayfalar) { return A.pdfKitap(sayfalar, { baslik: baslikTahmin }); });
    return kitapSozu.then(function (kitap) {
      if (tur === 'json') kitap.figurler.forEach(function (f) { var g = gorselBul(f.src); if (g) f.src = g; else if (f.src) { kitap.rapor.eksikGorseller.push(f.src); f.src = null; } });
      kitap.rapor.gorsel = kitap.figurler.length;
      return { kitap: kitap, gorseller: gorseller, tur: tur, manifest: manifest };
    });
  }
  function normal(p) { var o = []; p.split('/').forEach(function (s) { if (s === '..') o.pop(); else if (s && s !== '.') o.push(s); }); return o.join('/'); }
  function tipBul(y) { var e = (y.split('.').pop() || '').toLowerCase(); return { jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', gif: 'image/gif', webp: 'image/webp', svg: 'image/svg+xml', json: 'application/json', html: 'text/html', htm: 'text/html', md: 'text/markdown', txt: 'text/plain', pdf: 'application/pdf' }[e] || 'application/octet-stream'; }
  function pdfMetni(dosya) {
    return betikYukle(PDFJS_W, function () { return !!window.pdfjsWorker; }).then(function () { return betikYukle(PDFJS, function () { return !!window.pdfjsLib; }); }).then(function () {
      return dosya.arrayBuffer().then(function (buf) { return window.pdfjsLib.getDocument({ data: buf, isEvalSupported: false }).promise; });
    }).then(function (pdf) {
      var sayfalar = [], i = 1;
      function sonraki() {
        if (i > pdf.numPages) return sayfalar;
        return pdf.getPage(i++).then(function (s) { return s.getTextContent(); }).then(function (tc) {
          var satirlar = [], son = null, satir = '';
          tc.items.forEach(function (it) { var y = Math.round(it.transform[5]); if (son !== null && Math.abs(y - son) > 2) { satirlar.push(satir); satir = ''; } satir += it.str; son = y; });
          satirlar.push(satir); sayfalar.push(satirlar.join('\n')); return sonraki();
        });
      }
      return sonraki();
    });
  }
  U.paketOku = paketOku;

  function onizle(p, rapor, yonetim) {
    var k = p.kitap, r = k.rapor;
    rapor.innerHTML = '';
    var baslik = el('input', { id: 'yeniBaslik', type: 'text', value: k.baslik, 'aria-label': 'Kitap adı' });
    var maddeler = [
      r.bolum + ' bölüm, ' + r.altBolum + ' alt bölüm',
      r.soruAilesi + ' soru ailesi (' + r.varyant + ' varyant), ' + r.otomatikNotlanan + ' varyant otomatik notlanabilir',
      r.gorsel + ' görsel' + (r.eksikGorseller.length ? ', ' + r.eksikGorseller.length + ' eksik görsel: ' + r.eksikGorseller.slice(0, 6).join(', ') + (r.eksikGorseller.length > 6 ? '…' : '') : ''),
      Object.keys(r.callout || {}).length ? 'Kutular: ' + Object.keys(r.callout).map(function (t) { return t + ' ' + r.callout[t]; }).join(', ') : 'Kutu yok',
      r.terim + ' sözlük/köken girdisi'
    ];
    var bilinmeyen = Object.keys(k.turler || {}).filter(function (t) { return k.turler[t].bilinmeyen; });
    if (bilinmeyen.length) maddeler.push(bilinmeyen.length + ' bilinmeyen callout türü (nötr gösterilecek): ' + bilinmeyen.join(', '));
    var kart = el('div', { class: 'onizleme' }, [
      el('div', { class: 'ust-etiket', text: 'Önizleme raporu · ' + p.tur.toUpperCase() }),
      el('label', { class: 'var-etiket', for: 'yeniBaslik', text: 'Kitap adı' }), baslik,
      el('ul', null, maddeler.map(function (m) { return el('li', { text: m }); })),
      r.uyarilar.length ? el('div', { class: 'uyari-kutu' }, r.uyarilar.slice(0, 8).map(function (u) { return el('p', { text: '⚠ ' + u }); })) : null
    ]);
    rapor.appendChild(kart);
    var islem = el('div', { class: 'yp-dugmeler' });
    kart.appendChild(islem);
    var durum = el('div', { class: 'var-etiket', 'aria-live': 'polite' });
    kart.appendChild(durum);
    Promise.all([Kitaplik.katalog(), U.yetenekSozu]).then(function (r2) {
      if (!Y.assets || !Y.db) {
        durum.textContent = 'Kitap eklemek için sayfanın düzenleme yetkisiyle claude.ai içinde açılması gerekiyor (dosya deposu ya da veritabanı bu görünümde yok).';
        return;
      }
      var ayni = r2[0].filter(function (x) { return katla(x.baslik) === katla(k.baslik); })[0];
      if (ayni) {
        islem.appendChild(el('button', { class: 'dugme ana', type: 'button', onclick: function () { kaydet(ayni.id); } }, ['Güncelle (ilerleme ve notlar korunur)']));
        islem.appendChild(el('button', { class: 'dugme', type: 'button', onclick: function () { kaydet(null, true); } }, ['Ayrı kitap olarak ekle']));
        durum.textContent = '“' + ayni.baslik + '” adlı kitap zaten var. Güncellemede blok kimlikleri içerikten türetildiği için ilerleme, not ve vurgular eşleşmeye devam eder.';
      } else islem.appendChild(el('button', { class: 'dugme ana', type: 'button', onclick: function () { kaydet(null); } }, ['Onayla ve ekle']));
      islem.appendChild(el('button', { class: 'dugme', type: 'button', onclick: function () { rapor.innerHTML = ''; } }, ['Vazgeç']));
    });
    function kaydet(hedefId, ayri) {
      $$('button', islem).forEach(function (b) { b.disabled = true; });
      k.baslik = baslik.value.trim() || k.baslik;
      var id = hedefId || (A.slug(k.baslik.replace(/^1001\s*/, '')) + (ayri ? '-' + Date.now().toString(36).slice(-4) : ''));
      if (!hedefId && Kitaplik.kayit(id)) id += '-' + Date.now().toString(36).slice(-4);
      k.id = id;
      kitapYukle(k, p.gorseller, function (m) { durum.textContent = m; }).then(function () {
        durum.textContent = 'Eklendi.';
        Kitaplik.liste = null; delete Kitaplik.kitap[id]; Object.keys(Kitaplik.bolum).forEach(function (x) { if (x.indexOf(id + '/') === 0) delete Kitaplik.bolum[x]; }); delete Kitaplik.soru[id]; delete Kitaplik.terim[id];
        delete Kavram.dizin[id];
        toast('“' + k.baslik + '” kütüphanede.');
        yonetimCiz(yonetim);
        rapor.appendChild(el('a', { class: 'dugme ana', href: '#' + U.okuHash(id, 0) }, ['Kitabı aç →']));
      }).catch(function (e) {
        durum.textContent = 'Eklenemedi: ' + (e.message || e.code || e);
        $$('button', islem).forEach(function (b) { b.disabled = false; });
      });
    }
  }

  // Görsel küçült (uzun kenar ≤1400, JPEG q≈0.8; SVG olduğu gibi)
  function kucult(blob) {
    if (/svg/.test(blob.type)) return Promise.resolve(blob);
    return new Promise(function (ok) {
      var u = URL.createObjectURL(blob), img = new Image();
      img.onload = function () {
        var s = Math.min(1, 1400 / Math.max(img.naturalWidth, img.naturalHeight));
        if (s === 1 && blob.size < 600000 && /jpe?g/.test(blob.type)) { URL.revokeObjectURL(u); ok(blob); return; }
        var c = document.createElement('canvas'); c.width = Math.round(img.naturalWidth * s); c.height = Math.round(img.naturalHeight * s);
        var x = c.getContext('2d'); x.fillStyle = '#fff'; x.fillRect(0, 0, c.width, c.height); x.drawImage(img, 0, 0, c.width, c.height);
        c.toBlob(function (b) { URL.revokeObjectURL(u); ok(b || blob); }, 'image/jpeg', 0.8);
      };
      img.onerror = function () { URL.revokeObjectURL(u); ok(blob); };
      img.src = u;
    });
  }
  function kitapYukle(k, gorseller, ilerle) {
    var dosyalar = {}, assetIdler = [];
    function yukle(blob, tip) {
      return Y.assets.upload(blob, { type: tip }).then(function (r) { assetIdler.push(r.id); return '/_blob/' + r.id; });
    }
    var kullanilan = {};
    k.figurler.forEach(function (f) { if (f.src && gorseller[f.src]) kullanilan[f.src] = gorseller[f.src]; });
    var yollar = Object.keys(kullanilan);
    var toplamBoy = yollar.reduce(function (s, y) { return s + kullanilan[y].size; }, 0);
    ilerle('Depolama alanı denetleniyor…');
    return Y.assets.list().then(function (l) {
      var u = l.usage || {};
      if (u.maxBytes && u.bytes + toplamBoy * 0.7 + 3e6 > u.maxBytes) throw new Error('Dosya deposu dolmak üzere (' + Math.round(u.bytes / 1e6) + '/' + Math.round(u.maxBytes / 1e6) + ' MB). Eski bir kitabı sil ya da görselleri azalt.');
      if (u.maxFiles && u.files + yollar.length + k.bolumler.length + 5 > u.maxFiles) throw new Error('Dosya sayısı sınırı aşılacak (' + u.files + '/' + u.maxFiles + ').');
    }).then(function () {
      var i = 0;
      function sonraki() {
        if (i >= yollar.length) return Promise.resolve();
        var y = yollar[i++];
        ilerle('Görseller yükleniyor ' + i + '/' + yollar.length + '…');
        return kucult(kullanilan[y]).then(function (b) { return yukle(b, /svg/.test(b.type) ? 'image/svg+xml' : /png/.test(b.type) ? 'image/png' : 'image/jpeg'); }).then(function (url) { dosyalar['img:' + y] = url; }).then(sonraki);
      }
      return sonraki();
    }).then(function () {
      k.figurler.forEach(function (f) { if (f.src && dosyalar['img:' + f.src]) f.src = dosyalar['img:' + f.src]; else if (f.src && !/^\/_blob\//.test(f.src)) f.src = null; });
      var index = Object.assign({}, k, { bolumler: [] }); delete index.sorular; delete index.terimler; delete index.rapor;
      var i = 0;
      function bolumYukle() {
        if (i >= k.bolumler.length) return Promise.resolve();
        var b = k.bolumler[i], ad = 'bolum-' + String(i).padStart(2, '0') + '.json'; i++;
        ilerle('Bölümler yükleniyor ' + i + '/' + k.bolumler.length + '…');
        index.bolumler.push({ id: b.id, no: b.no, baslik: b.baslik, kisa: b.kisa, sira: b.sira, ozel: b.ozel, sayilar: b.sayilar, dosya: ad, altlar: b.altlar.map(function (a) { return { id: a.id, no: a.no, baslik: a.baslik }; }) });
        return yukle(new Blob([JSON.stringify(b)], { type: 'application/json' }), 'application/json').then(function (u) { dosyalar[ad] = u; }).then(bolumYukle);
      }
      return bolumYukle().then(function () {
        ilerle('Dizin yükleniyor…');
        var kavram = kavramDiziniUret(k);
        return Promise.all([
          yukle(new Blob([JSON.stringify(index)], { type: 'application/json' }), 'application/json').then(function (u) { dosyalar['kitap.json'] = u; }),
          yukle(new Blob([JSON.stringify(k.sorular || [])], { type: 'application/json' }), 'application/json').then(function (u) { dosyalar['sorular.json'] = u; }),
          yukle(new Blob([JSON.stringify(k.terimler || [])], { type: 'application/json' }), 'application/json').then(function (u) { dosyalar['terimler.json'] = u; }),
          yukle(new Blob([JSON.stringify(kavram)], { type: 'application/json' }), 'application/json').then(function (u) { dosyalar['kavramlar.json'] = u; })
        ]);
      });
    }).then(function () {
      var r = k.rapor;
      return Y.db.doc('kutuphane/' + k.id).get().then(function (s) {
        var eski = s.exists ? s.data() : null;
        var kayit = { id: k.id, baslik: k.baslik, renk: k.renk || '#9ad0ff', sira: eski && eski.sira || 50, kaynak: 'asset', dosyalar: dosyalar, assetler: assetIdler,
          sayilar: { bolum: r.bolum, altBolum: r.altBolum, soruAilesi: r.soruAilesi, varyant: r.varyant, otomatik: r.otomatikNotlanan, gorsel: r.gorsel }, tarih: new Date().toISOString().slice(0, 10) };
        return Y.db.doc('kutuphane/' + k.id).set(kayit).then(function () {
          // eski sürümün varlıklarını temizle (güncellemede)
          if (eski && eski.assetler) return Promise.all(eski.assetler.map(function (id) { return Y.assets.delete(id).catch(function () {}); }));
        });
      });
    }).catch(function (e) {
      // yarıda kalan yüklemeleri geri al
      return Promise.all(assetIdler.map(function (id) { return Y.assets.delete(id).catch(function () {}); })).then(function () { throw e; });
    });
  }
  function kavramDiziniUret(k) {
    var kavram = {};
    k.bolumler.forEach(function (b) { b.altlar.forEach(function (a) { (function g(l) { l.forEach(function (x) {
      var h = x.html || (x.ogeler || []).join(' ');
      (h.match(/<strong>([^<]{3,48})<\/strong>/g) || []).forEach(function (s) { var t = duz(s).replace(/[:.,;]+$/, ''); var kk = katla(t); var o = kavram[kk] || (kavram[kk] = { ad: t, yer: [] }); if (o.yer.length < 14) o.yer.push([b.sira, a.id, a.no, x.id]); });
      if (x.bloklar) g(x.bloklar); }); })(a.bloklar); }); });
    return kavram;
  }
  function yonetimCiz(kap) {
    kap.innerHTML = '';
    kap.appendChild(el('h2', { text: 'Kütüphanedeki kitaplar' }));
    Promise.all([Kitaplik.katalog(), U.yetenekSozu]).then(function (r) {
      var l = r[0];
      var tablo = el('div', { class: 'yonetim-liste' });
      l.forEach(function (k) {
        var sat = el('div', { class: 'yonetim-satir' }, [el('span', { class: 'nokta', style: 'background:' + (k.renk || '#4fe0ff') }), el('strong', { text: k.baslik }),
          el('span', { class: 'var-etiket', text: (k.kaynak === 'asset' ? 'eklenen' : 'yerleşik') + ' · ' + ((k.sayilar || {}).bolum || '?') + ' bölüm' })]);
        if (k.kaynak === 'asset' && Y.assets && Y.db) {
          var sil = el('button', { class: 'dugme kucuk', type: 'button' }, ['Sil']);
          sil.addEventListener('click', function () {
            if (sil.dataset.onay !== '1') { sil.dataset.onay = '1'; sil.textContent = 'Emin misin? Kalıcı silinir'; sil.classList.add('tehlike'); setTimeout(function () { sil.dataset.onay = ''; sil.textContent = 'Sil'; sil.classList.remove('tehlike'); }, 5000); return; }
            sil.disabled = true; sil.textContent = 'Siliniyor…';
            Promise.all((k.assetler || []).map(function (id) { return Y.assets.delete(id).catch(function () {}); })).then(function () { return Y.db.doc('kutuphane/' + k.id).delete(); })
              .then(function () { Kitaplik.liste = null; toast('Silindi.'); yonetimCiz(kap); }).catch(function (e) { toast('Silinemedi: ' + (e.message || e.code)); sil.disabled = false; });
          });
          sat.appendChild(sil);
        }
        tablo.appendChild(sat);
      });
      kap.appendChild(tablo);
      if (Y.assets) Y.assets.list().then(function (x) { var u = x.usage || {}; if (u.maxBytes) kap.appendChild(el('p', { class: 'var-etiket', text: 'Dosya deposu: ' + (u.bytes / 1e6).toFixed(1) + ' / ' + Math.round(u.maxBytes / 1e6) + ' MB · ' + u.files + ' / ' + u.maxFiles + ' dosya' })); }).catch(function () {});
    });
  }

  // yetenek durumu → AI düğmelerini gizle
  U.yetenekSozu.then(function () { if (!Y.sample) document.body.classList.add('ai-yok'); });
  U.sekmeleriCiz();
})();
