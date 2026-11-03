/* C.A.R.V.I.S. — Makaleler: ilgi alanlarını işaretle, Europe PMC'den (PubMed dahil, yasal; açık erişimliler işaretli)
   kendiliğinden makale bul, listele; her makalede "⚡ Zamanım yok" (Türkçe sınav/klinik odaklı özet, bir kez üretilir, saklanır).
   Carvis araçları: ilgi_ekle, makale_ara.  Sayfa: #makaleler */
(function () {
  'use strict';
  var U = window.Uygulama, A = window.KitapAyristir; if (!U) return;
  var el = U.el, $ = U.$, toast = U.toast, Depo = U.Depo, fnv = A ? A.fnv : function (s) { return String(s).length + '-' + String(s).slice(0, 20); };
  var API = 'https://www.ebi.ac.uk/europepmc/webservices/rest/search';
  var css = document.createElement('style');
  css.textContent = [
    '.mk-ilgiler{display:flex;flex-wrap:wrap;gap:8px;margin:10px 0}',
    '.mk-cip{display:inline-flex;align-items:center;gap:6px;border:1px solid var(--cizgi);border-radius:999px;padding:4px 10px;font-size:13px;background:var(--yuzey,rgba(255,255,255,.03))}',
    '.mk-cip button{background:none;border:0;color:var(--soluk,#8aa);cursor:pointer;font-size:14px}',
    '.mk-liste{display:grid;gap:12px;margin-top:8px}',
    '.mk-kart{border:1px solid var(--cizgi);border-radius:12px;padding:12px 14px;background:var(--yuzey,rgba(255,255,255,.02))}',
    '.mk-kart h3{margin:0 0 4px;font-size:15px;line-height:1.35}',
    '.mk-meta{font-size:12.5px;opacity:.75;margin-bottom:6px}',
    '.mk-rozet{display:inline-block;font-size:10.5px;letter-spacing:.1em;border-radius:4px;padding:1px 6px;margin-right:6px;font-weight:700}',
    '.mk-rozet.oa{background:#7dffb0;color:#04210f}.mk-rozet.yeni{background:#4fe0ff;color:#031018}',
    '.mk-dugmeler{display:flex;gap:8px;flex-wrap:wrap;margin-top:8px}',
    '.mk-ozet{margin-top:8px}',
    '.mk-baslik-konu{margin:18px 0 4px;font-size:13px;letter-spacing:.14em;text-transform:uppercase;color:var(--vurgu,#4fe0ff)}'
  ].join('\n');
  document.head.appendChild(css);

  /* ---------- veri ---------- */
  function ilgiler() { return Depo.oku('makale').then(function (v) { v.ilgiler = v.ilgiler || []; v.sonuc = v.sonuc || {}; v.gorulen = v.gorulen || {}; return v; }); }
  function kaydet(fn) { return U.depoGuncelle('makale', fn, 200); }
  // Türkçe konu → İngilizce arama terimi (hafif model, bir kez; başarısızsa konunun kendisi)
  /* İlgi netleştirme (kullanıcı, 2026-11-03: "nöronların cross talk yapması ilgimi çekiyor ama cross talk yazınca hiçbir makale
     gelmiyor; yz araştırsın ne eklemeye çalıştığımı netleştirsin"). Dil fark etmeksizin yapay zekâ konuyu yorumlar, Europe PMC
     sorgusu (eş anlamlılar OR ile, MeSH/serbest terim) ve 2-3 alternatif yorum üretir. Az sonuç gelirse tarih filtresi kalkar,
     sonra alternatifler denenir. */
  function ilgiNetlestir(konu) {
    var Y = U.Y;
    var duz = { sorgu: konu, anlam: '', alternatifler: [] };
    if (!Y || !Y.sample || !Y.sample.json) return Promise.resolve(duz);
    return Y.sample.json('Bir tıp öğrencisi bilimsel makale takibi için ilgi alanı ekliyor: "' + konu + '". Ne kastettiğini netleştir (kısa, gündelik ya da yarım bir ifade olabilir; ör. "nöronların cross talk yapması" → ephaptic coupling, nöronal crosstalk, gap junction ile elektriksel eşleşme). ' +
      'Europe PMC\'de iyi sonuç verecek bir İngilizce sorgu yaz: 3-6 eş anlamlı/yakın terimi tırnak içinde OR ile bağla, gerekirse AND ile bağlam ekle; çok dar olmasın. Konu birden çok anlama gelebiliyorsa 2-3 alternatif yorum da ver.\n' +
      'YALNIZ JSON: {"anlam":"Türkçe, en fazla 14 kelime: ne aradığımız","sorgu":"...","alternatifler":[{"anlam":"...","sorgu":"..."}]}')
      .then(function (j) {
        if (!j || !j.sorgu) return duz;
        return { sorgu: String(j.sorgu).slice(0, 400), anlam: String(j.anlam || '').slice(0, 160), alternatifler: (j.alternatifler || []).filter(function (x) { return x && x.sorgu; }).slice(0, 3).map(function (x) { return { anlam: String(x.anlam || '').slice(0, 160), sorgu: String(x.sorgu).slice(0, 400) }; }) };
      }, function () { return duz; });
  }
  // Az sonuç gelirse genişlet: önce son 3 yıl, sonra tüm yıllar, sonra alternatif yorumlar
  function genisAra(i, adet) {
    var denenen = [{ q: i.sorgu || i.konu, yeni: true, not: '' }, { q: i.sorgu || i.konu, yeni: false, not: 'tüm yıllar' }];
    (i.alternatifler || []).forEach(function (a) { denenen.push({ q: a.sorgu, yeni: false, not: 'yakın yorum: ' + a.anlam }); });
    var en = { l: [], not: '' };
    return denenen.reduce(function (z, d) {
      return z.then(function (bitti) { if (bitti) return true; return ara(d.q, { adet: adet, yeni: d.yeni, sirala: 'RELEVANCE' }).then(function (l) { if (l.length > en.l.length) en = { l: l, not: d.not }; return l.length >= 3; }, function () { return false; }); });
    }, Promise.resolve(false)).then(function () { return en; });
  }
  // Açık erişim olmayan makalenin yasal ücretsiz sürümü (yazar kopyası, kurum arşivi, PMC) — OpenAlex
  function ucretsizBul(doi) {
    return fetch('https://api.openalex.org/works/doi:' + encodeURIComponent(doi)).then(function (r) { if (!r.ok) throw new Error('OpenAlex ' + r.status); return r.json(); }).then(function (w) {
      var oa = w && w.open_access, yer = (w && w.best_oa_location) || {};
      return (oa && oa.is_oa && (yer.pdf_url || yer.landing_page_url || oa.oa_url)) || null;
    });
  }
  // Europe PMC geçici olarak kapalıysa PubMed (NCBI E-utilities) yedeği
  function pubmedAra(sorgu, o) {
    var E = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/';
    var url = E + 'esearch.fcgi?db=pubmed&retmode=json&sort=relevance&retmax=' + (o.adet || 8) + '&term=' + encodeURIComponent(sorgu + (o.acik ? ' AND free full text[sb]' : '')) + (o.yeni ? '&datetype=pdat&mindate=' + (new Date().getFullYear() - 3) + '&maxdate=3000' : '');
    return fetch(url).then(function (r) { if (!r.ok) throw new Error('PubMed ' + r.status); return r.json(); }).then(function (j) {
      var ids = (j.esearchresult && j.esearchresult.idlist) || []; if (!ids.length) return [];
      return Promise.all([
        fetch(E + 'esummary.fcgi?db=pubmed&retmode=json&id=' + ids.join(',')).then(function (r) { return r.json(); }),
        fetch(E + 'efetch.fcgi?db=pubmed&rettype=abstract&retmode=xml&id=' + ids.join(',')).then(function (r) { return r.text(); }).catch(function () { return ''; })
      ]).then(function (r) {
        var ozetler = {};
        try { var xml = new DOMParser().parseFromString(r[1], 'text/xml'); [].slice.call(xml.getElementsByTagName('PubmedArticle')).forEach(function (a) { var p = a.getElementsByTagName('PMID')[0]; ozetler[p && p.textContent] = [].slice.call(a.getElementsByTagName('AbstractText')).map(function (x) { return (x.getAttribute('Label') ? x.getAttribute('Label') + ': ' : '') + x.textContent; }).join(' '); }); } catch (e) {}
        var s = r[0].result || {};
        return ids.filter(function (id) { return s[id]; }).map(function (id) {
          var x = s[id], pmc = (x.articleids || []).filter(function (a) { return a.idtype === 'pmc'; })[0], doi = (x.articleids || []).filter(function (a) { return a.idtype === 'doi'; })[0];
          return { id: 'MED:' + id, baslik: x.title || '', yazar: (x.authors || []).map(function (a) { return a.name; }).join(', '), dergi: x.source || '', yil: String(x.pubdate || '').slice(0, 4), doi: doi ? doi.value : '', pmid: id, acik: !!pmc,
            ozet: (ozetler[id] || '').replace(/\s+/g, ' ').trim(), link: pmc ? 'https://pmc.ncbi.nlm.nih.gov/articles/' + pmc.value + '/' : 'https://pubmed.ncbi.nlm.nih.gov/' + id + '/', tur: (x.pubtype || []).slice(0, 2).join(', ') };
        });
      });
    });
  }
  function ara(sorgu, o) {
    o = o || {};
    return epmcAra(sorgu, o).catch(function (e) { console.warn('Europe PMC kullanılamadı, PubMed deneniyor:', e.message); return pubmedAra(sorgu, o); });
  }
  function epmcAra(sorgu, o) {
    var q = '(' + sorgu + ')' + (o.acik ? ' AND OPEN_ACCESS:Y' : '') + (o.yeni ? ' AND FIRST_PDATE:[' + (new Date().getFullYear() - 3) + '-01-01 TO 3000-01-01]' : '');
    var url = API + '?query=' + encodeURIComponent(q) + '&format=json&pageSize=' + (o.adet || 8) + '&resultType=core&sort=' + encodeURIComponent(o.sirala || 'RELEVANCE');
    return fetch(url).then(function (r) { if (!r.ok) throw new Error('Europe PMC ' + r.status); return r.json(); }).then(function (j) {
      if (!j.resultList) throw new Error('Europe PMC: ' + (j.errMsg || 'sonuç yok'));
      return ((j.resultList && j.resultList.result) || []).map(function (x) {
        var tam = ((x.fullTextUrlList && x.fullTextUrlList.fullTextUrl) || []).filter(function (u) { return u.availabilityCode === 'OA' || u.availabilityCode === 'F'; })[0];
        return { id: x.source + ':' + x.id, baslik: String(x.title || '').replace(/<[^>]+>/g, ''), yazar: x.authorString || '', dergi: (x.journalInfo && x.journalInfo.journal && (x.journalInfo.journal.isoabbreviation || x.journalInfo.journal.title)) || x.bookOrReportDetails && x.bookOrReportDetails.publisher || '',
          yil: x.pubYear || '', doi: x.doi || '', pmid: x.pmid || '', acik: x.isOpenAccess === 'Y', ozet: String(x.abstractText || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim(),
          link: tam ? tam.url : (x.doi ? 'https://doi.org/' + x.doi : 'https://europepmc.org/article/' + x.source + '/' + x.id), tur: (x.pubTypeList && x.pubTypeList.pubType || []).slice(0, 2).join(', ') };
      });
    });
  }
  // İlgi alanlarını tarar: yeni makaleleri kaydeder (günde en çok bir kez, ya da zorla)
  function tara(zorla) {
    return ilgiler().then(function (v) {
      var simdi = Date.now();
      var l = v.ilgiler.filter(function (i) { return zorla || i.anlam === undefined || !v.sonuc[i.konu] || simdi - (v.sonuc[i.konu].t || 0) > 20 * 3600e3; });
      return l.reduce(function (p, i) {
        return p.then(function () {
          var hazir = i.anlam === undefined ? ilgiNetlestir(i.konu).then(function (n) { i.sorgu = n.sorgu; i.anlam = n.anlam; i.alternatifler = n.alternatifler; return kaydet(function (d) { d.ilgiler.forEach(function (x) { if (x.konu === i.konu) { x.sorgu = n.sorgu; x.anlam = n.anlam; x.alternatifler = n.alternatifler; } }); }); }) : Promise.resolve();
          return hazir.then(function () { return genisAra(i, 8); }).then(function (gs) {
            var sonuc = gs.l;
            return kaydet(function (d) { d.sonuc = d.sonuc || {}; d.gorulen = d.gorulen || {};
              var eski = (d.sonuc[i.konu] && d.sonuc[i.konu].l || []).map(function (x) { return x.id; });
              sonuc.forEach(function (x) { x.yeni = eski.length > 0 && eski.indexOf(x.id) < 0; });
              d.sonuc[i.konu] = { t: Date.now(), not: gs.not, l: sonuc.map(function (x) { var y = Object.assign({}, x); y.ozet = y.ozet.slice(0, 2500); return y; }) }; });
          }).catch(function (e) { console.warn('makale taraması', i.konu, e); });
        });
      }, Promise.resolve()).then(function () { return l.length; });
    });
  }
  function ilgiEkle(konu) {
    konu = String(konu || '').trim(); if (!konu) return Promise.resolve('Konu boş.');
    return ilgiNetlestir(konu).then(function (n) {
      var sorgu = n.sorgu;
      return kaydet(function (d) { d.ilgiler = d.ilgiler || []; if (!d.ilgiler.some(function (x) { return x.konu.toLowerCase() === konu.toLowerCase(); })) d.ilgiler.push({ konu: konu, sorgu: sorgu, anlam: n.anlam, alternatifler: n.alternatifler, t: Date.now() }); })
        .then(function () { return tara(false); })
        .then(function () { return ilgiler(); })
        .then(function (v) { var s = (v.sonuc[konu] && v.sonuc[konu].l) || []; return { eklendi: konu, anladigim: n.anlam, arama: sorgu, bulunan: s.length, ilk: s.slice(0, 3).map(function (x) { return x.baslik + ' (' + x.dergi + ' ' + x.yil + ')'; }) }; });
    });
  }

  /* ---------- "Zamanım yok" makale özeti ---------- */
  function zamanimYok(m, kutu) {
    U.cevapCalistir(kutu, fnv('makale-zy|' + m.id), function () {
      return 'Bir tıp öğrencisi için bu makalenin özetini 1 dakikada okunacak biçimde Türkçe özetle. YALNIZ verilen metne dayan, uydurma; özet yoksa yalnız başlıktan ne çalışıldığını söyle ve bunu belirt.\nBiçim:\n**Ne soruldu?** (1 cümle)\n**Ne yapıldı?** (çalışma türü, örneklem — 1-2 cümle)\n**Ne bulundu?** (3-5 kısa madde, sayılar varsa koru)\n**Klinik/sınav çıkarımı** (1-2 cümle)\n**Sınırlılık** (1 cümle)\nEn fazla 180 kelime.\n\nBAŞLIK: ' + m.baslik + '\nDERGİ: ' + m.dergi + ' ' + m.yil + '\nÖZET: """' + (m.ozet || '(özet yok)') + '"""';
    }, { eylem: 'makale-zamanimyok' });
  }
  U.makaleZamanimYok = zamanimYok;

  /* ---------- sayfa ---------- */
  function kartCiz(m) {
    var ozetKutu = el('div', { class: 'yp-cevap mk-ozet', hidden: true });
    return el('article', { class: 'mk-kart' }, [
      el('h3', { text: m.baslik }),
      el('div', { class: 'mk-meta' }, [m.yeni ? el('span', { class: 'mk-rozet yeni', text: 'YENİ' }) : '', m.acik ? el('span', { class: 'mk-rozet oa', text: 'AÇIK ERİŞİM' }) : '', (m.dergi || '') + (m.yil ? ' · ' + m.yil : '') + (m.yazar ? ' · ' + m.yazar.split(',').slice(0, 3).join(',') + (m.yazar.split(',').length > 3 ? ' ve ark.' : '') : '')]),
      el('div', { class: 'mk-dugmeler' }, [
        el('button', { class: 'dugme kucuk ana', type: 'button', onclick: function () { ozetKutu.hidden = false; zamanimYok(m, ozetKutu); } }, ['⚡ Zamanım yok']),
        el('a', { class: 'dugme kucuk', href: m.link, target: '_blank', rel: 'noopener' }, [m.acik ? '📄 Tam metin' : '↗ Makaleyi aç']),
        !m.acik && m.doi ? el('button', { class: 'dugme kucuk', type: 'button', onclick: function () { var b = this; b.disabled = true; b.textContent = 'Aranıyor…';
          ucretsizBul(m.doi).then(function (u) { if (u) { b.textContent = '📄 Ücretsiz sürüm açılıyor'; window.open(u, '_blank', 'noopener'); } else b.textContent = 'Yasal ücretsiz sürüm yok'; }, function () { b.textContent = 'Bulunamadı (bağlantı)'; b.disabled = false; }); } }, ['🔓 Ücretsiz tam metin bul']) : '',
        m.ozet ? el('button', { class: 'dugme kucuk', type: 'button', onclick: function () { ozetKutu.hidden = false; ozetKutu.innerHTML = ''; ozetKutu.appendChild(el('p', { text: m.ozet })); } }, ['Özgün özet']) : ''
      ]),
      ozetKutu]);
  }
  U.GORUNUMLER.makaleler = function () {
    var ana = $('#ana'); ana.innerHTML = '';
    var sayfa = el('div', { class: 'sayfa' }); ana.appendChild(sayfa);
    sayfa.appendChild(el('div', { class: 'kahraman' }, [el('div', { class: 'ust-etiket', text: 'İlgi alanların' }), el('h1', { text: '📰 Makaleler' }),
      el('p', { text: 'İlgilendiğin konuları ekle (ya da Carvis\'e "şu konuyla ilgileniyorum" de). Yazdığını yapay zekâ netleştirir (Türkçe, İngilizce, yarım ifade olur), Europe PMC/PubMed\'den ilgili makaleleri kendiliğinden bulur, günde bir yeniler; açık erişim değilse 🔓 yasal ücretsiz sürümü arar. ⚡ Zamanım yok: 1 dakikalık Türkçe özet.' })]));
    var girdi = el('input', { type: 'text', placeholder: 'Konu: rotator manşet yırtığı, SGLT2 inhibitörleri…', 'aria-label': 'İlgi alanı' });
    var ilgiKap = el('div', { class: 'mk-ilgiler' }), liste = el('div'), durum = el('p', { class: 'var-etiket', 'aria-live': 'polite' });
    sayfa.appendChild(el('form', { class: 'yp-form', onsubmit: function (e) { e.preventDefault(); var k = girdi.value.trim(); if (!k) return; girdi.value = ''; durum.textContent = 'Ekleniyor ve aranıyor…'; ilgiEkle(k).then(function () { durum.textContent = ''; ciz(); }, function (e) { durum.textContent = 'Arama başarısız: ' + (e.message || e); }); } },
      [girdi, el('button', { class: 'dugme ana', type: 'submit' }, ['＋ İlgi ekle']), el('button', { class: 'dugme', type: 'button', onclick: function () { durum.textContent = 'Yenileniyor…'; tara(true).then(function () { durum.textContent = ''; ciz(); }); } }, ['↻ Yenile'])]));
    sayfa.appendChild(ilgiKap); sayfa.appendChild(durum); sayfa.appendChild(liste);
    function ciz() {
      ilgiler().then(function (v) {
        ilgiKap.innerHTML = ''; liste.innerHTML = '';
        if (!v.ilgiler.length) { liste.appendChild(el('p', { class: 'var-etiket', text: 'Henüz ilgi alanı yok.' })); return; }
        v.ilgiler.forEach(function (i) {
          ilgiKap.appendChild(el('span', { class: 'mk-cip' }, [i.konu, el('button', { type: 'button', 'aria-label': i.konu + ' kaldır', text: '✕', onclick: function () { kaydet(function (d) { d.ilgiler = d.ilgiler.filter(function (x) { return x.konu !== i.konu; }); }).then(ciz); } })]));
          var s = v.sonuc[i.konu];
          liste.appendChild(el('h2', { class: 'mk-baslik-konu', text: i.konu }));
          if (i.anlam || (s && s.not)) liste.appendChild(el('p', { class: 'var-etiket', text: (i.anlam ? 'Anladığım: ' + i.anlam : '') + (s && s.not ? ' · az sonuç çıktı, genişlettim (' + s.not + ')' : '') }));
          if (i.alternatifler && i.alternatifler.length) {
            var alt = el('div', { class: 'mk-ilgiler' }, [el('span', { class: 'var-etiket', text: 'Bunu mu kastettin?' })]);
            i.alternatifler.forEach(function (a) { alt.appendChild(el('button', { class: 'cip', type: 'button', text: a.anlam || a.sorgu, onclick: function () {
              durum.textContent = 'Yeni yoruma göre aranıyor…';
              kaydet(function (d) { d.ilgiler.forEach(function (x) { if (x.konu === i.konu) { var eski = { anlam: x.anlam, sorgu: x.sorgu }; x.anlam = a.anlam; x.sorgu = a.sorgu; x.alternatifler = x.alternatifler.filter(function (y) { return y.sorgu !== a.sorgu; }).concat(eski.sorgu ? [eski] : []); } }); delete d.sonuc[i.konu]; })
                .then(function () { return tara(false); }).then(function () { durum.textContent = ''; ciz(); }); } })); });
            liste.appendChild(alt);
          }
          var l = el('div', { class: 'mk-liste' });
          ((s && s.l) || []).forEach(function (m) { l.appendChild(kartCiz(m)); });
          if (!s || !s.l.length) l.appendChild(el('p', { class: 'var-etiket', text: s ? 'Sonuç yok.' : 'Aranıyor…' }));
          liste.appendChild(l);
        });
      });
    }
    ciz();
    tara(false).then(function (n) { if (n) ciz(); });
  };
  U.SEKMELER.push({ id: 'makaleler', ad: 'Makaleler', ikon: '📰' });
  if (U.sekmeleriCiz) try { U.sekmeleriCiz(); } catch (e) {}

  /* ---------- Carvis araçları ---------- */
  U.makaleAraclari = function () {
    return [
      { name: 'ilgi_ekle', description: 'Kullanıcının "şu konuyla ilgileniyorum / bunu takip et" dediği konuyu ilgi alanlarına ekler; Carvis o konuda yeni makaleleri kendiliğinden bulur ve Makaleler sayfasında listeler. Bulunan ilk makaleleri döndürür.',
        inputSchema: { type: 'object', properties: { konu: { type: 'string', description: 'Türkçe konu (kullanıcının dediği gibi)' } }, required: ['konu'] },
        execute: function (g) { return ilgiEkle(g.konu); } },
      { name: 'makale_ara', description: 'Europe PMC/PubMed\'de bilimsel makale arar (tek seferlik, ilgi alanına eklemeden). sorgu İNGİLİZCE ve kısa olmalı (MeSH terimleri). Sonuçta başlık, dergi, yıl, açık erişim ve özet var; kullanıcıya en ilgili 2-3 tanesini kısaca söyle.',
        inputSchema: { type: 'object', properties: { sorgu: { type: 'string' }, acik_erisim: { type: 'boolean' }, son_yillar: { type: 'boolean' } }, required: ['sorgu'] },
        execute: function (g) { return ara(String(g.sorgu), { adet: 6, acik: g.acik_erisim === true, yeni: g.son_yillar !== false }).then(function (l) { return l.map(function (m) { return { id: m.id, baslik: m.baslik, dergi: m.dergi, yil: m.yil, acik: m.acik, link: m.link, ozet: m.ozet.slice(0, 600) }; }); }); } }
    ];
  };
  U.makaleBul = ara; U.makaleIlgiEkle = ilgiEkle; U.makaleTara = tara;
  // açılışta (biraz sonra) ilgi alanlarını sessizce yenile
  setTimeout(function () { tara(false).catch(function () {}); }, 15000);
})();
