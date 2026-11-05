/* Vikipedi görselleri (r115). Anahtarsız, çevrimiçi: Vikipedi'nin açık arama API'si (önce tr, yoksa en) ile maddenin görseli.
   Yalnız arama terimi gönderilir. Görsel ve bağlantı Vikipedi'den gelir; lisansı için madde sayfasına bakılır.
   Google görsel araması bu sürümde yok: ücretsiz kullanımı için anahtar ve sözleşme gerekir. */
(function () {
  'use strict';
  var ZAMAN_ASIMI = 9000;
  var onbellek = {};

  function mk(tag, ozel, cocuk) {
    var e = document.createElement(tag);
    Object.keys(ozel || {}).forEach(function (k) {
      var v = ozel[k];
      if (v == null || v === false) return;
      if (k === 'text') e.textContent = v;
      else if (k === 'class') e.className = v;
      else e.setAttribute(k, v === true ? '' : v);
    });
    (cocuk || []).forEach(function (c) { if (c != null) e.appendChild(typeof c === 'string' ? document.createTextNode(c) : c); });
    return e;
  }
  function normal(t) { return String(t || '').replace(/[\[\]{}<>"]/g, '').replace(/\s+/g, ' ').trim().slice(0, 80); }

  function getir(url) {
    var ctl = typeof AbortController === 'function' ? new AbortController() : null;
    var zaman = setTimeout(function () { if (ctl) ctl.abort(); }, ZAMAN_ASIMI);
    return fetch(url, ctl ? { signal: ctl.signal } : {})
      .then(function (r) { if (!r.ok) throw new Error('http ' + r.status); return r.json(); })
      .then(function (j) { clearTimeout(zaman); return j; }, function (e) { clearTimeout(zaman); throw e; });
  }

  // Bir Vikipedi dilinde arama; sonuçlar arasından görseli olan ilk madde
  function ara(dil, terim) {
    var url = 'https://' + dil + '.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=' + encodeURIComponent(terim) +
      '&gsrlimit=6&prop=pageimages|info&piprop=thumbnail&pithumbsize=600&inprop=url&format=json&origin=*';
    return getir(url).then(function (j) {
      var sayfalar = (j && j.query && j.query.pages) || {};
      var liste = Object.keys(sayfalar).map(function (k) { return sayfalar[k]; })
        .sort(function (a, b) { return (a.index || 0) - (b.index || 0); });
      var ilk = liste.filter(function (s) { return s.thumbnail && /^https:\/\/upload\.wikimedia\.org\//.test(s.thumbnail.source || ''); })[0];
      if (!ilk) return null;
      return { baslik: ilk.title, gorsel: ilk.thumbnail.source, sayfa: ilk.fullurl || ('https://' + dil + '.wikipedia.org/wiki/' + encodeURIComponent(ilk.title)), dil: dil };
    });
  }

  // Terim için görsel: { baslik, gorsel, sayfa, dil } ya da null. Ağ hatası önbelleğe alınmaz.
  function gorselBul(terim) {
    var t = normal(terim);
    if (t.length < 3) return Promise.resolve(null);
    var anahtar = t.toLocaleLowerCase('tr');
    if (Object.prototype.hasOwnProperty.call(onbellek, anahtar)) return Promise.resolve(onbellek[anahtar]);
    var hata = false;
    return ara('tr', t).catch(function () { hata = true; return null; }).then(function (s) {
      return s || ara('en', t).catch(function () { hata = true; return null; });
    }).then(function (s) {
      if (s || !hata) onbellek[anahtar] = s;
      return s;
    });
  }

  // Görsel kartı: resim, Vikipedi etiketi, madde adı ve sayfa bağlantısı
  function kart(s) {
    return mk('figure', { class: 'vk-gorsel' }, [
      mk('img', { src: s.gorsel, alt: s.baslik, loading: 'lazy', decoding: 'async' }),
      mk('figcaption', null, [
        mk('span', { class: 'etiket-kucuk ai', text: 'Vikipedi' }), ' ' + s.baslik + ' · ',
        mk('a', { href: s.sayfa, target: '_blank', rel: 'noopener', text: 'sayfada aç' }),
        ' · lisans için sayfaya bak'
      ])
    ]);
  }

  var css = document.createElement('style');
  css.textContent = '.vk-gorsel{margin:8px 0;border-radius:14px;overflow:hidden;background:rgba(2,10,14,.7);border:1px solid rgba(94,240,220,.25)}' +
    '.vk-gorsel img{display:block;width:100%;height:auto;max-height:260px;object-fit:contain;background:#030b10}' +
    '.vk-gorsel figcaption{padding:7px 10px;font:12px/1.45 var(--f-kod,monospace);color:#9fc3cf}' +
    '.vk-gorsel figcaption a{color:#7cf5d9}';
  document.head.appendChild(css);

  window.Vikipedi = { gorselBul: gorselBul, kart: kart };
})();
