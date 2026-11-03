/* 1001 — Pratik Pusulası entegrasyonu (kullanıcı, 2026-11-03: "okul programını biri Pratik Pusulası altında yapmıştı, onu Carvis'e
   entegre edelim, benim plannerım olsun"; kaynak: https://cerrahpasa-turkce-tip.vercel.app — veri dosyaları CORS'a açık).
   - #pusula: günün dersleri (saat, ders, ABD, hoca, yer), kendi pratiklerin (öğrenci numarasıyla; numara yalnız bu cihazda),
     sıradaki komite sınavına geri sayım, serbest çalışma günleri; her ders için kitapta ilgili bölüm ve Carvis ile çalışma.
   - Komite sınavları (kurul ara/final) kendiliğinden Plan'a aktarılır → tahmin, reels, ders programı sıradaki sınava göre.
   - Carvis aracı ders_programi: "yarın ne var", "bu hafta pratik", "sınava kaç gün". */
(function () {
  'use strict';
  if (/[?&]gomulu\b/.test(location.search)) return;
  var U = window.Uygulama; if (!U) return;
  var el = U.el, Depo = U.Depo;
  var KAYNAK = 'https://cerrahpasa-turkce-tip.vercel.app/';
  var KITAP = { Anatomi: 'anatomi', Biyokimya: 'biyokimya', Biyofizik: 'biyofizik', Biyoistatistik: 'biyoistatistik' };
  var GUN = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'], AY = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
  function iki(n) { return ('0' + n).slice(-2); }
  function tarihStr(d) { return d.getFullYear() + '-' + iki(d.getMonth() + 1) + '-' + iki(d.getDate()); }
  function bugun() { return tarihStr(new Date()); }
  function gunEkle(t, n) { var d = new Date(t + 'T12:00:00'); d.setDate(d.getDate() + n); return tarihStr(d); }
  function gunFark(t) { return Math.round((new Date(t + 'T00:00:00') - new Date(bugun() + 'T00:00:00')) / 864e5); }
  function okunur(t) { var d = new Date(t + 'T12:00:00'); return d.getDate() + ' ' + AY[d.getMonth()] + ' ' + GUN[d.getDay()]; }

  /* ---------- veri ---------- */
  var V = null, yukleniyor = null;
  function getir(ad) { return fetch(KAYNAK + 'data/' + ad + '.json', { cache: 'no-cache' }).then(function (r) { if (!r.ok) throw new Error(ad + ' ' + r.status); return r.json(); }); }
  function yukle(zorla) {
    if (V && !zorla) return Promise.resolve(V);
    if (yukleniyor) return yukleniyor;
    return yukleniyor = Depo.oku('pusulaVeri').then(function (on) {
      var taze = on && on.veri && Date.now() - (on.t || 0) < 6 * 3600e3;
      if (taze && !zorla) { V = on; return V; }
      return Promise.all([getir('veri'), getir('liste').catch(function () { return null; })]).then(function (r) {
        V = { veri: r[0], liste: r[1], t: Date.now() };
        return U.depoGuncelle('pusulaVeri', function (d) { d.veri = V.veri; d.liste = V.liste; d.t = V.t; }, 100).then(function () { return V; });
      }, function (e) { if (on && on.veri) { V = on; V.eski = true; return V; } throw e; });
    }).then(function (v) { yukleniyor = null; komiteAktar(v); return v; }, function (e) { yukleniyor = null; throw e; });
  }
  // kişiye özel varsayılan (www/ozel-pusula.js — gitignore'da, yalnız kullanıcıya giden yamada): numara girilmemişse kullanılır
  function ayar() { return Depo.oku('pusula').then(function (a) { a = a || {}; a.program = a.program || 'TR';
    var oz = window.CARVIS_OZEL || {}; if (!a.numara && oz.numara) { a.numara = String(oz.numara); U.depoGuncelle('pusula', function (d) { if (!d.numara) d.numara = a.numara; }, 100); }
    return a; }); }
  function grupBul(no) {
    if (!V || !no) return ''; var n = Number(no);
    for (var i = 0; i < V.veri.gruplar.length; i++) { var g = V.veri.gruplar[i], bas = Number(g.bas), bit = g.bit ? Number(g.bit) : null; if (bit != null && n >= bas && n <= bit) return g.grup; }
    var ing = String(no).indexOf('0902') === 0, acik = V.veri.gruplar.filter(function (g) { return !g.bit && (g.program === 'EN') === ing; });
    return acik.length ? acik[acik.length - 1].grup : '';
  }
  function ozet(no) {
    if (!V || !V.liste || !window.crypto || !crypto.subtle) return Promise.resolve(null);
    return crypto.subtle.digest('SHA-256', new TextEncoder().encode(V.liste.tuz + no)).then(function (b) { return Array.prototype.map.call(new Uint8Array(b), function (x) { return ('0' + x.toString(16)).slice(-2); }).join('').slice(0, 12); });
  }
  function benimOturumlar(a) {
    if (!a.numara) return Promise.resolve([]);
    return ozet(a.numara).then(function (h) { var l = (h && V.liste.numara[h]) || []; return l.map(function (i) { return V.liste.oturumlar[i]; }).filter(Boolean); });
  }
  function dersler(a, t) { var p = V.veri.programlar[a.program] || V.veri.programlar.TR; return ((p && p.gunler) || {})[t] || []; }
  function pratikler(a, t, benim) {
    var g = a.grup || grupBul(a.numara), out = [];
    if (g) (V.veri.pratik && V.veri.pratik.kurullar || []).forEach(function (k) {
      k.gunler.forEach(function (sat) {
        if (sat.tarih !== t) return;
        Object.keys(sat.degerler || {}).forEach(function (ders) {
          var v = String(sat.degerler[ders] || '').replace(/\s/g, '').toLowerCase(); if (!v || v === '-') return;
          if (v !== g && v !== g[0]) return;
          var kr = (V.veri.kurallar || {})[ders] || V.veri.kural_varsayilan || {};
          out.push({ ders: ders, kurul: k.kurul, bas: kr.bas || (kr.saatler ? kr.saatler.join(' / ') : ''), yer: kr.yer || '', onluk: kr.onluk || '', tahmini: true, not: (kr.tarih_notlari || {})[t] || '' });
        });
      });
    });
    (benim || []).forEach(function (o) {
      if (o.tarih !== t) return; var p = out.filter(function (x) { return x.ders === o.ders; })[0];
      if (!p) { var kr = (V.veri.kurallar || {})[o.ders] || {}; p = { ders: o.ders, kurul: o.kurul, yer: kr.yer || '', onluk: kr.onluk || '' }; out.push(p); }
      p.bas = o.bas + (o.bit ? '–' + o.bit : ''); p.tahmini = false; p.alt = o.grup + '-' + o.alt;
    });
    (V.veri.duzeltmeler || []).forEach(function (d) { if (d.tarih === t && (d.grup === g || d.grup === 'hepsi') && d.tur === 'pratik') { var p = out.filter(function (x) { return x.ders === d.ders; })[0]; if (p) { if (d.bas) p.bas = d.bas; if (d.yer) p.yer = d.yer; p.not = (p.not ? p.not + ' · ' : '') + (d.not || d.durum || ''); p.tahmini = false; } } });
    return out;
  }
  function komiteler() {
    if (!V) return [];
    var p = V.veri.programlar.TR || {}, l = [];
    (p.onemli || []).forEach(function (o) { if (o.kurul && (o.tur === 'ara' || o.tur === 'final')) l.push({ tarih: o.tarih, tur: o.tur === 'ara' ? 'Vize' : 'Final', kurul: o.kurul, saat: o.saat, metin: o.metin }); });
    return l.sort(function (a, b) { return a.tarih < b.tarih ? -1 : 1; });
  }
  function siradakiKomite() { return komiteler().filter(function (k) { return gunFark(k.tarih) >= 0; })[0] || null; }
  // komite sınavlarını Plan'a aktar (kaynak: pusula); kullanıcının elle girdikleri korunur
  function komiteAktar() {
    var l = komiteler(); if (!l.length) return;
    U.depoGuncelle('plan', function (v) {
      v.komite = (v.komite || []).filter(function (k) { return k.kaynak !== 'pusula'; });
      l.forEach(function (k) { if (!v.komite.some(function (x) { return x.tarih === k.tarih; })) v.komite.push({ id: 'pp-' + k.tarih, tarih: k.tarih, tur: k.tur, ad: k.kurul + ' komite ' + (k.tur === 'Vize' ? 'ara sınavı' : 'finali'), kaynak: 'pusula' }); });
      var yakin = v.komite.filter(function (k) { return k.tarih && gunFark(k.tarih) >= 0; }).sort(function (a, b) { return a.tarih < b.tarih ? -1 : 1; })[0];
      if (yakin && U.Kitaplik) { v.sinav = v.sinav || {}; Object.keys(KITAP).forEach(function (d) { v.sinav[KITAP[d]] = yakin.tarih; }); }
    }, 300);
  }

  /* ---------- ders ↔ kitap bölümü ---------- */
  function kitapBul(abd) { abd = String(abd || ''); return /anatomi/i.test(abd) ? 'anatomi' : /biyokimya/i.test(abd) ? 'biyokimya' : /biyofizik/i.test(abd) ? 'biyofizik' : /istatistik/i.test(abd) ? 'biyoistatistik' : null; }
  var DUR = { ve: 1, ile: 1, genel: 1, bilgiler: 1, hakkinda: 1, giris: 1, bir: 1, the: 1, of: 1, and: 1 };
  function bel(s) { return String(s || '').toLocaleLowerCase('tr').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/ı/g, 'i').split(/[^a-z0-9]+/).filter(function (w) { return w.length > 2 && !DUR[w]; }); }
  function bolumBul(kitap, baslik) {
    if (!U.Kitaplik) return Promise.resolve(null);
    return U.Kitaplik.ac(kitap).then(function (kj) {
      var q = bel(baslik), en = null, enP = 0;
      (kj.bolumler || []).forEach(function (b, i) {
        var t = bel((b.baslik || '') + ' ' + (b.kisa || '') + ' ' + (b.altlar || []).map(function (a) { return a.baslik; }).join(' '));
        var p = q.filter(function (w) { return t.some(function (x) { return x === w || (w.length > 4 && x.indexOf(w.slice(0, 5)) === 0); }); }).length;
        if (p > enP) { enP = p; en = { sira: i, ad: b.kisa || b.baslik }; }
      });
      return enP >= 1 ? en : null;
    }).catch(function () { return null; });
  }

  /* ---------- sayfa ---------- */
  var css = document.createElement('style');
  css.textContent = [
    '.pp-ust{display:flex;align-items:center;gap:14px;flex-wrap:wrap;margin-bottom:10px}',
    '.pp-sayac{flex:1;min-width:240px;padding:14px 18px;border-radius:20px;box-shadow:0 0 0 1px rgba(255,211,138,.45),0 0 30px rgba(255,200,100,.15);background:linear-gradient(135deg,rgba(255,211,138,.1),transparent)}',
    '.pp-sayac b{display:block;font:800 clamp(26px,4vw,40px) var(--f-kod,monospace);color:#ffd38a;text-shadow:0 0 18px rgba(255,211,138,.6)}.pp-sayac span{color:#ffe9c2;font-size:14px}',
    '.pp-gunler{display:flex;gap:6px;overflow-x:auto;scrollbar-width:none;padding:4px 0 10px}.pp-gunler::-webkit-scrollbar{display:none}',
    '.pp-gunler button{flex:none;min-width:64px;padding:8px 6px;border-radius:14px;border:1px solid rgba(110,255,235,.25);background:transparent;color:#cfeee9;font:600 12px var(--f-kod,monospace);text-align:center;cursor:pointer}',
    '.pp-gunler button b{display:block;font-size:18px;color:#fff}.pp-gunler button.on{border-color:#9ffff0;box-shadow:0 0 16px rgba(94,240,220,.45);background:rgba(94,240,220,.12)}',
    '.pp-gunler button.sinav{border-color:#ffd38a;color:#ffe9c2}.pp-gunler button.bos{opacity:.45}',
    '.pp-ders{display:grid;grid-template-columns:76px 1fr auto;gap:12px;align-items:start;padding:12px 14px;border-radius:16px;margin:8px 0;box-shadow:inset 3px 0 0 var(--r,#5ef0dc),0 0 0 1px rgba(110,255,235,.14)}',
    '.pp-ders .saat{font:700 14px var(--f-kod,monospace);color:#9ffff0}.pp-ders .saat small{display:block;color:#7fb7b0;font-weight:500}',
    '.pp-ders h4{margin:0 0 3px;font-size:15.5px;line-height:1.35;color:#f2fffd}.pp-ders p{margin:0;color:#a9d6d0;font-size:13px}',
    '.pp-ders .ey{display:flex;flex-direction:column;gap:6px;align-items:flex-end}',
    '.pp-ders.pratik{--r:#ffd38a}.pp-ders.olay{--r:#ff7a7a;background:rgba(255,122,122,.06)}.pp-ders.serbest{--r:#8cffa0}',
    '.pp-rozet{display:inline-block;font:700 10px var(--f-kod,monospace);letter-spacing:.08em;padding:2px 7px;border-radius:999px;margin-right:6px;background:rgba(255,211,138,.15);color:#ffd38a}',
    '.pp-ayar{display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin:10px 0}'
  ].join('\n');
  document.head.appendChild(css);

  var secili = null;
  U.GORUNUMLER.pusula = function (arg) {
    var ana = U.$('#ana'); ana.innerHTML = '';
    var sayfa = el('div', { class: 'sayfa' }); ana.appendChild(sayfa);
    sayfa.appendChild(el('div', { class: 'kahraman' }, [el('div', { class: 'ust-etiket', text: 'Pratik Pusulası · Cerrahpaşa Tıp 1. sınıf' }), el('h1', { text: 'Program' }),
      el('p', { class: 'var-etiket', text: 'Ders programı, pratik grupların ve komite sınavları okulun programından (Pratik Pusulası) canlı alınır. Öğrenci numaran yalnız bu cihazda saklanır.' })]));
    var govde = el('div', {}, [el('div', { class: 'yukleniyor', text: 'Program alınıyor…' })]); sayfa.appendChild(govde);
    Promise.all([yukle(), ayar()]).then(function (r) {
      var a = r[1]; if (a.numara && !a.grup) a.grup = grupBul(a.numara);
      return benimOturumlar(a).then(function (benim) { ciz(govde, a, benim, arg); });
    }).catch(function (e) { govde.innerHTML = ''; govde.appendChild(el('p', { class: 'hata-metni', text: 'Program alınamadı (internet?): ' + (e.message || e) })); govde.appendChild(el('a', { class: 'dugme', href: KAYNAK, target: '_blank', rel: 'noopener', text: 'Pratik Pusulası\'nı aç ↗' })); });
  };
  function ciz(govde, a, benim, arg) {
    govde.innerHTML = '';
    var k = siradakiKomite();
    var ust = el('div', { class: 'pp-ust' });
    if (k) ust.appendChild(el('div', { class: 'pp-sayac' }, [el('b', { text: gunFark(k.tarih) === 0 ? 'BUGÜN' : gunFark(k.tarih) + ' gün' }), el('span', { text: k.kurul + ' Ders Kurulu ' + (k.tur === 'Vize' ? 'ARA' : 'FİNAL') + ' sınavı · ' + okunur(k.tarih) + (k.saat ? ' · ' + k.saat : '') })]));
    var no = el('input', { type: 'text', inputmode: 'numeric', maxlength: '10', placeholder: 'öğrenci no (0901260…)', value: a.numara || '', style: 'max-width:200px' });
    var prog = el('select', {}, ['TR', 'EN', 'MT'].map(function (x) { return el('option', { value: x, text: x === 'TR' ? 'Türkçe program' : x === 'EN' ? 'English program' : 'MT', selected: a.program === x ? true : null }); }));
    var kaydet = el('button', { class: 'dugme kucuk ana', type: 'button', text: 'Kaydet' });
    kaydet.addEventListener('click', function () { var n = no.value.replace(/\D/g, ''); U.depoGuncelle('pusula', function (d) { d.numara = n; d.grup = grupBul(n); d.program = prog.value; }, 200).then(function () { U.toast(n ? 'Grubun: ' + (grupBul(n) || '?') : 'Kaydedildi'); U.GORUNUMLER.pusula(); }); });
    ust.appendChild(el('div', { class: 'pp-ayar' }, [no, prog, kaydet, a.grup ? el('span', { class: 'pp-rozet', text: 'GRUP ' + a.grup.toUpperCase() }) : '', el('a', { class: 'dugme kucuk', href: KAYNAK, target: '_blank', rel: 'noopener', text: 'Siteyi aç ↗' })]));
    govde.appendChild(ust);
    if (V.eski) govde.appendChild(el('p', { class: 'var-etiket', text: '⚠ Çevrimdışı: son kaydedilen program gösteriliyor (' + new Date(V.t).toLocaleString('tr-TR') + ').' }));
    // gün şeridi: bugün -3 … +11
    var bas = bugun(); if (!secili) secili = /^\d{4}-\d{2}-\d{2}$/.test(arg || '') ? arg : (dersler(a, bas).length || new Date().getHours() < 17 ? bas : gunEkle(bas, 1));
    var serit = el('div', { class: 'pp-gunler', role: 'tablist' }), kom = {}; komiteler().forEach(function (x) { kom[x.tarih] = x; });
    for (var i = -3; i <= 11; i++) (function (t) {
      var d = new Date(t + 'T12:00:00'), n = dersler(a, t).length;
      var b = el('button', { type: 'button', class: (t === secili ? 'on ' : '') + (kom[t] ? 'sinav ' : '') + (!n && !kom[t] ? 'bos' : ''), 'aria-selected': String(t === secili) }, [GUN[d.getDay()].slice(0, 3) + (t === bas ? ' · bugün' : ''), el('b', { text: String(d.getDate()) }), AY[d.getMonth()].slice(0, 3)]);
      b.addEventListener('click', function () { secili = t; ciz(govde, a, benim); });
      serit.appendChild(b);
    })(gunEkle(bas, i));
    govde.appendChild(serit);
    setTimeout(function () { var on = serit.querySelector('.on'); if (on) on.scrollIntoView({ inline: 'center', block: 'nearest' }); }, 50);
    govde.appendChild(el('h3', { text: okunur(secili) }));
    var l = dersler(a, secili), pr = pratikler(a, secili, benim);
    if (kom[secili]) govde.appendChild(el('div', { class: 'pp-ders olay' }, [el('div', { class: 'saat', text: kom[secili].saat || '—' }), el('div', {}, [el('h4', { text: kom[secili].metin }), el('p', { text: 'Komite: bütün dersler aynı gün. Tahmin ve reels bu sınava göre ayarlı.' })]),
      el('div', { class: 'ey' }, [el('a', { class: 'dugme kucuk ana', href: '#tahmin', text: 'Tahmin' })])]));
    pr.forEach(function (p) {
      govde.appendChild(el('div', { class: 'pp-ders pratik' }, [el('div', { class: 'saat' }, [p.bas || '?', el('small', { text: p.tahmini ? 'tahmini' : (p.alt ? 'grup ' + p.alt : '') })]),
        el('div', {}, [el('h4', {}, [el('span', { class: 'pp-rozet', text: 'PRATİK' }), p.ders]), el('p', { text: [p.yer, p.onluk, p.not].filter(Boolean).join(' · ') })]), el('div', { class: 'ey' })]));
    });
    if (!l.length && !pr.length && !kom[secili]) govde.appendChild(el('p', { class: 'var-etiket', text: 'Bu gün ders yok.' }));
    l.forEach(function (x) {
      var tur = /sınav/i.test(x.ders) && x.tur === 'olay' ? 'olay' : x.tur === 'serbest' ? 'serbest' : '';
      var ey = el('div', { class: 'ey' }), kitap = kitapBul(x.abd);
      var d = el('div', { class: 'pp-ders ' + tur }, [el('div', { class: 'saat' }, [x.bas || '', el('small', { text: x.bit ? '– ' + x.bit : '' })]),
        el('div', {}, [el('h4', { text: x.ders }), el('p', { text: [x.abd, x.hoca, x.yer].filter(Boolean).join(' · ') })]), ey]);
      if (kitap) bolumBul(kitap, x.ders).then(function (b) {
        if (b) ey.appendChild(el('a', { class: 'dugme kucuk', href: '#' + U.okuHash(kitap, b.sira), title: b.ad, text: 'Kitapta oku' }));
        ey.appendChild(el('button', { class: 'dugme kucuk ana', type: 'button', text: 'Özet', onclick: function () { if (window.Carvis && window.Carvis.zamanimYok) window.Carvis.zamanimYok(kitap, b ? b.sira : 0); } }));
      });
      govde.appendChild(d);
    });
    var src = (V.veri.kaynaklar || []).slice(0, 3);
    govde.appendChild(el('p', { class: 'var-etiket', style: 'margin-top:16px' }, ['Kaynak: Pratik Pusulası (güncelleme ' + new Date(V.veri.guncelleme).toLocaleString('tr-TR') + ')' + (src.length ? ' · okul belgeleri: ' : '')].concat(src.map(function (s, i) { return el('a', { href: s.url, target: '_blank', rel: 'noopener', text: (i ? ', ' : '') + s.ad }); }))));
  }
  U.SEKMELER.push({ id: 'pusula', ad: 'Program', ikon: '🧭' });
  if (U.sekmeleriCiz) try { U.sekmeleriCiz(); } catch (e) {}

  /* ---------- Carvis aracı ---------- */
  var eskiEk = U.sohbetEkAraclari;
  U.sohbetEkAraclari = function () {
    var l = eskiEk ? eskiEk() : [];
    return l.concat([{ name: 'ders_programi', description: 'Okulun ders programı ve kullanıcının pratikleri (Pratik Pusulası): bir günün dersleri (saat, ders, hoca, yer), pratikleri ve sıradaki komite sınavı. "Yarın ne var", "bugün pratik var mı", "sınava kaç gün" gibi sorularda kullan.',
      inputSchema: { type: 'object', properties: { tarih: { type: 'string', description: 'YYYY-AA-GG ya da "bugun"/"yarin"' } } },
      execute: function (g) {
        var t = !g.tarih || /bug/i.test(g.tarih) ? bugun() : /yar/i.test(g.tarih) ? gunEkle(bugun(), 1) : g.tarih;
        return Promise.all([yukle(), ayar()]).then(function (r) { var a = r[1]; if (a.numara && !a.grup) a.grup = grupBul(a.numara); return benimOturumlar(a).then(function (b) {
          var k = siradakiKomite();
          return { tarih: okunur(t), dersler: dersler(a, t).map(function (x) { return x.bas + '-' + x.bit + ' ' + x.ders + (x.abd ? ' (' + x.abd + ')' : '') + (x.yer ? ' @' + x.yer : ''); }),
            pratikler: pratikler(a, t, b).map(function (p) { return p.ders + ' pratiği ' + (p.bas || '') + (p.tahmini ? ' (saat tahmini)' : '') + (p.yer ? ' @' + p.yer : ''); }),
            grup: a.grup || 'numara girilmemiş (Program sayfası)', siradaki_sinav: k ? k.kurul + ' ' + k.tur + ' · ' + okunur(k.tarih) + ' · ' + gunFark(k.tarih) + ' gün' : 'yok' };
        }); });
      } }]);
  };
  // açılışta komiteleri arka planda güncelle (günde bir kez yeterli; önbellek 6 saat)
  setTimeout(function () { yukle().catch(function () {}); }, 4000);
})();
