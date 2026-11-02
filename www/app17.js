/* 1001 — 🏛 Hafıza sarayı (method of loci). Kullanıcı (2026-11-02): "Patrick Jane tuşuna memory palace özelliği getir, sonra
   Memory palace diye tab aç, farklı sarayları ziyaret edebileyim".
   - Kur: bölümün sınavda kritik ve sık karıştırılan bilgileri, bir mekânın (kullanıcının bildiği bir yer ya da hazır tema)
     sırayla gezilen 6-9 odasına; her odada bilgiyi kodlayan abartılı, duyusal bir sahne. Yalnız kitap metnine dayanır.
   - Sekme (#saray): saraylar listesi → kat planı (odalar bir yol boyunca) → gezinti (sahne → hatırla → bilgiyi aç)
     ve sınav modu (hatırlayamadığın oda Eksikler'e). Cihazda Carvis sesli gezdirir.
   Depo: 'saraylar' { liste: [{id, ad, tema, kitap, kitapAd, sira, bolumAd, odalar:[{ad, sembol, sahne, bilgi, anahtar}], t, gezinti:{n, son, bildi}}] } */
(function () {
  'use strict';
  var U = window.Uygulama; if (!U) return;
  var el = U.el, $ = U.$, Y = U.Y, Depo = U.Depo, Kitaplik = U.Kitaplik, toast = U.toast;
  var css = document.createElement('style');
  css.textContent = [
    '.sr-izgara{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:12px;margin:12px 0}',
    '.sr-kart{border:1px solid var(--cizgi);border-radius:12px;padding:12px 14px;background:linear-gradient(135deg,rgba(10,30,42,.6),rgba(4,14,20,.6));box-shadow:inset 3px 0 0 var(--k,var(--vurgu));cursor:pointer;text-align:left;color:var(--metin)}',
    '.sr-kart:hover{border-color:var(--k,var(--vurgu))}.sr-kart b{display:block;font-size:16px}.sr-kart small{color:var(--metin-sonuk)}.sr-kart .em{font-size:20px;letter-spacing:4px;margin:6px 0}',
    '.sr-plan{width:100%;height:auto;display:block;margin:8px 0 4px;max-height:360px}',
    '.sr-plan .oda{cursor:pointer}.sr-plan .oda rect{fill:rgba(10,30,42,.85);stroke:var(--cizgi-guclu,#2b4a5a);stroke-width:1.5;transition:all .25s}',
    '.sr-plan .oda.gezildi rect{stroke:var(--iyi,#5fe0a0)}.sr-plan .oda.su rect{fill:rgba(79,224,255,.18);stroke:var(--vurgu);stroke-width:2.5;filter:drop-shadow(0 0 8px rgba(79,224,255,.6))}',
    '.sr-plan text{fill:var(--metin);font-size:13px;text-anchor:middle;pointer-events:none}.sr-plan .no{fill:var(--metin-sonuk);font-size:10px}',
    '.sr-plan .yol{fill:none;stroke:rgba(79,224,255,.35);stroke-width:3;stroke-dasharray:6 6}',
    '.sr-oda{border:1px solid var(--vurgu);border-radius:14px;padding:16px 18px;margin:10px 0;background:radial-gradient(circle at 15% 0,rgba(79,224,255,.12),rgba(4,14,20,.9) 60%)}',
    '.sr-oda .ust{display:flex;align-items:center;gap:10px;margin-bottom:6px}.sr-oda .sembol{font-size:34px}.sr-oda h3{margin:0}',
    '.sr-oda .sahne{font-size:15.5px;line-height:1.55;font-style:italic}',
    '.sr-oda .bilgi{margin-top:10px;padding:10px 12px;border-left:3px solid var(--iyi,#5fe0a0);background:rgba(95,224,160,.07);border-radius:6px}',
    '.sr-oda .anahtar{margin-top:6px;font-size:13px;color:var(--metin-sonuk)}',
    '.sr-gez{display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin:8px 0}'
  ].join('\n');
  document.head.appendChild(css);
  function sarayKaydet(s) { return U.depoGuncelle('saraylar', function (v) { v.liste = (v.liste || []).filter(function (x) { return x.id !== s.id; }); v.liste.push(s); if (v.liste.length > 60) v.liste.shift(); }, 300); }

  /* ---------- kur (Jane panelinden) ---------- */
  U.sarayKurPaneli = function (kap, kj, bolum, onHikaye) {
    kap.innerHTML = '';
    var mekan = el('input', { type: 'text', placeholder: 'Bildiğin bir mekân (ör. evim, fakülte binası) — boş bırakırsan tema seçilir', style: 'width:100%;background:var(--zemin);border:1px solid var(--cizgi);border-radius:6px;color:var(--metin);padding:7px 9px' });
    try { mekan.value = localStorage.getItem('sarayMekan') || ''; } catch (e) {}
    var durum = el('div', { class: 'var-etiket', 'aria-live': 'polite' });
    // Kullanıcı (2026-11-02): "kolesterolü kuryenin siparişi GPS'ten bulması, yemeği bırakıp restorana dönmesi diye kodladım;
    // onun daha iyi memory palace hâlini istedim" → kendi hikâyesi omurga olur, saray onu geliştirir.
    var hikaye = el('textarea', { rows: '3', placeholder: 'Senin hikâyen / çağrışımın (isteğe bağlı) — ör. "Kolesterol: kurye siparişi GPS\'ten bulur, yemeği kapıya bırakır, restorana döner." Yazarsan saray bu hikâyenin üzerine kurulur.', style: 'width:100%;margin-top:6px;background:var(--zemin);border:1px solid var(--cizgi);border-radius:6px;color:var(--metin);padding:7px 9px;font:14px var(--f-govde,inherit)' });
    if (onHikaye) hikaye.value = onHikaye;
    kap.appendChild(el('p', { class: 'var-etiket', text: 'Hafıza sarayı: bölümün kritik bilgilerini bir yolculuğun duraklarına yerleştirir. Kendi benzetmeni yazarsan saray onu omurga yapar, her durakta benzetmenin bilimsel karşılığını eşler ve benzetmenin bozulduğu yeri düzeltir.' }));
    kap.appendChild(mekan); kap.appendChild(hikaye);
    kap.appendChild(el('div', { class: 'yp-dugmeler' }, [el('button', { class: 'dugme kucuk ana', type: 'button', text: '🏛 Sarayı kur', onclick: function () {
      var b = this; b.disabled = true; try { localStorage.setItem('sarayMekan', mekan.value.trim()); } catch (e) {}
      durum.textContent = 'Saray kuruluyor… (çıkmışlar ve kitap metni inceleniyor)';
      sarayUret(kj, bolum, mekan.value.trim(), hikaye.value.trim()).then(function (s) {
        durum.textContent = ''; kap.appendChild(el('p', {}, ['✅ "' + s.ad + '" kuruldu: ' + s.odalar.length + ' oda. ', el('a', { href: '#saray-' + s.id, onclick: function () { U.panelKapat && U.panelKapat(); } }, ['Sarayı gez →'])]));
      }).catch(function (e) { b.disabled = false; durum.textContent = e && e.code ? U.AI.hataMetni(e) : 'Kurulamadı: ' + (e.message || e); });
    } })]));
    kap.appendChild(durum);
  };
  function sarayUret(kj, bolum, mekan, hikaye) {
    var cikmis = Kitaplik.sorular(kj.id).then(function (l) {
      return l.filter(function (q) { return q.bolum === bolum.id && !q.deneme; }).slice(0, 14).map(function (q) { var v = (q.varyantlar || [])[0] || {}, d = (v.siklar || []).filter(function (s) { return s.h === v.cevap; })[0]; return '• ' + (q.konu || '') + ': ' + U.duz(v.govde || '').slice(0, 140) + ' → ' + (d ? U.duz(d.m) : ''); }).join('\n');
    }).catch(function () { return ''; });
    return Promise.all([cikmis, U.AI.hazir()]).then(function (r) {
      if (!r[1]) throw { code: 'not_granted' };
      var istem = 'Bir tıp öğrencisi için HAFIZA SARAYI (method of loci) kur. Odalar bir YOLCULUĞUN sırayla gezilen durakları olsun ve birbirine hikâyeyle bağlansın (bir duraktan ötekine ne olduğu için geçildiği belli olsun); rastgele odalar değil, akan bir olay örgüsü.\n' +
        (hikaye ? 'ÖĞRENCİNİN KENDİ HİKÂYESİ (omurga bu; değiştirme, GELİŞTİR): "' + hikaye + '"\n' +
          '- Hikâyenin karakterlerini, mekânlarını ve olaylarını koru; odalar hikâyenin durakları olsun (ör. restoran → GPS ekranı → yol → kapıya teslim → dönüş yolu). Eksik kalan bilgileri hikâyeye yeni karakter/olay olarak ekle (ör. trafik polisi, zil, adres etiketi).\n' +
          '- Her durakta "esleme": hikâyedeki öge → bilimsel karşılığı, açık ve kesin (ör. "GPS = LDL reseptörünün apo B-100\'ü tanıması").\n' +
          '- Benzetme bir yerde biyolojiyle UYUŞMUYORSA o durakta "sinir" alanında açıkça yaz ve doğrusunu söyle (yanlış öğrenmesin).\n'
          : (mekan ? 'Mekân: öğrencinin bildiği "' + mekan + '"; duraklar bu mekânın gerçekçi, sırayla gezilen yerleri olsun.\n' : 'Mekân: konunun mantığına uyan canlı bir benzetme-dünya seç (ör. yağ taşımayı bir lojistik/kargo şirketi gibi); duraklar o dünyanın yerleri olsun.\n')) +
        'Bölümün sınavda en kritik ve en sık KARIŞTIRILAN 6-9 bilgisini sırayla duraklara yerleştir (benzer çiftleri yan yana duraklara koy ki fark akılda kalsın).\n' +
        'Her durak için: "sahne" = bilgiyi kodlayan ABARTILI, duyusal, hareketli bir imge (renk, ses, koku; sayıları/harfleri nesnelere çevir: ör. B-48 → sırtında 48 yazan forma); "bilgi" = kitaba göre DOĞRU bilgi (1-2 cümle, Latince terimler korunur); "esleme" = sahnedeki öge → bilimsel karşılık; "anahtar" = tek cümlelik çağrışım; "sinir" = (yalnız gerekiyorsa) benzetmenin bozulduğu nokta ve doğrusu, yoksa boş.\n' +
        'YALNIZ aşağıdaki kitap metnine dayan; bilgi uydurma. Türkçe.\n' +
        'Yalnız JSON: {"ad":"sarayın adı","tema":"mekân/hikâye dünyası","odalar":[{"ad":"durak adı","sembol":"tek emoji","sahne":"...","bilgi":"...","esleme":"...","anahtar":"...","sinir":""}]}\n\n' +
        'BÖLÜM: ' + (bolum.kisa || bolum.baslik) + '\n"""\n' + (U.bolumOzu ? U.bolumOzu(bolum, 9000) : '') + '\n"""\n\nÇIKMIŞ SORULAR:\n' + (r[0] || '(yok)');
      return Y.sample.json(istem, { cache: false });
    }).then(function (j) {
      var odalar = (j && j.odalar || []).filter(function (o) { return o && o.sahne && o.bilgi; }).slice(0, 10).map(function (o) { return { ad: String(o.ad || 'Oda'), sembol: String(o.sembol || '🚪').slice(0, 4), sahne: String(o.sahne), bilgi: String(o.bilgi), esleme: String(o.esleme || ''), anahtar: String(o.anahtar || ''), sinir: String(o.sinir || '') }; });
      if (odalar.length < 3) throw new Error('Yapay zekâ yeterli oda üretemedi; yeniden dene.');
      var s = { id: 's' + Date.now().toString(36), ad: String(j.ad || 'Hafıza sarayı'), tema: String(j.tema || mekan || ''), hikaye: hikaye || '', kitap: kj.id, kitapAd: kj.baslik.replace(/^1001\s*/, ''), renk: (Kitaplik.kayit(kj.id) || {}).renk || '#4fe0ff',
        sira: bolum.sira, bolumAd: bolum.kisa || bolum.baslik, odalar: odalar, t: Date.now(), gezinti: { n: 0, son: 0, bildi: {} } };
      return sarayKaydet(s).then(function () { return U.sarayKartla ? U.sarayKartla(s) : null; }).then(function () { return s; });
    });
  }
  U.sarayUret = sarayUret;

  /* ---------- kat planı (SVG): odalar yılan biçimli bir yol boyunca ---------- */
  function planCiz(s, su, sec) {
    var n = s.odalar.length, kol = n <= 4 ? n : n <= 8 ? 4 : 5, satir = Math.ceil(n / kol), W = 150, H = 92, G = 26;
    var gw = kol * W + (kol + 1) * G, gh = satir * H + (satir + 1) * G;
    var NS = 'http://www.w3.org/2000/svg', svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('viewBox', '0 0 ' + gw + ' ' + gh); svg.setAttribute('class', 'sr-plan'); svg.setAttribute('role', 'img'); svg.setAttribute('aria-label', s.ad + ' kat planı');
    var mer = s.odalar.map(function (o, i) { var r = Math.floor(i / kol), c = i % kol; if (r % 2) c = kol - 1 - c; return [G + c * (W + G), G + r * (H + G)]; });
    var yol = document.createElementNS(NS, 'path');
    yol.setAttribute('d', mer.map(function (m, i) { return (i ? 'L' : 'M') + (m[0] + W / 2) + ' ' + (m[1] + H / 2); }).join(' ')); yol.setAttribute('class', 'yol'); svg.appendChild(yol);
    s.odalar.forEach(function (o, i) {
      var g = document.createElementNS(NS, 'g'); g.setAttribute('class', 'oda' + (i === su ? ' su' : '') + (s.gezinti && s.gezinti.bildi && s.gezinti.bildi[i] ? ' gezildi' : ''));
      g.setAttribute('tabindex', '0'); g.setAttribute('role', 'button'); g.setAttribute('aria-label', (i + 1) + '. oda: ' + o.ad);
      var r = document.createElementNS(NS, 'rect'); r.setAttribute('x', mer[i][0]); r.setAttribute('y', mer[i][1]); r.setAttribute('width', W); r.setAttribute('height', H); r.setAttribute('rx', 12); g.appendChild(r);
      function t(y, metin, cls, boy) { var x = document.createElementNS(NS, 'text'); x.setAttribute('x', mer[i][0] + W / 2); x.setAttribute('y', mer[i][1] + y); if (cls) x.setAttribute('class', cls); if (boy) x.setAttribute('font-size', boy); x.textContent = metin; g.appendChild(x); }
      t(16, (i + 1) + '. oda', 'no'); t(50, o.sembol, null, 26); t(78, o.ad.length > 18 ? o.ad.slice(0, 17) + '…' : o.ad);
      g.addEventListener('click', function () { sec(i); }); g.addEventListener('keydown', function (e) { if (e.key === 'Enter') sec(i); });
      svg.appendChild(g);
    });
    return svg;
  }

  /* ---------- sekme ---------- */
  U.SEKMELER.push({ id: 'saray', ad: 'Saraylar', ikon: '🏛' });
  U.GORUNUMLER.saray = function (arg) {
    var ana = $('#ana'); ana.innerHTML = '';
    if (U.panelKapat) U.panelKapat();
    var sayfa = el('div', { class: 'sayfa' }); ana.appendChild(sayfa);
    Depo.oku('saraylar').then(function (v) {
      var l = (v.liste || []).slice().sort(function (a, b) { return b.t - a.t; });
      var s = arg ? l.filter(function (x) { return x.id === arg; })[0] : null;
      if (s) return sarayGez(sayfa, s);
      sayfa.appendChild(el('div', { class: 'kahraman' }, [el('div', { class: 'ust-etiket', text: 'Method of loci' }), el('h1', { text: '🏛 Hafıza sarayları' }),
        el('p', { text: 'Her saray bir bölümün kritik bilgilerini bir mekânın odalarına yerleştirir. Odaları sırayla gez: önce sahneyi gör, bilgiyi kendin hatırlamaya çalış, sonra aç. Yeni saray: bir bölümde ⚡ Zamanım yok → 🏛 Hafıza sarayı kur.' })]));
      if (!l.length) { sayfa.appendChild(el('p', { class: 'bos', text: 'Henüz saray yok. Bir bölüm aç → ⚡ Zamanım yok → 🏛 Hafıza sarayı kur.' })); return; }
      var iz = el('div', { class: 'sr-izgara' }); sayfa.appendChild(iz);
      l.forEach(function (x) {
        var bildi = Object.keys((x.gezinti || {}).bildi || {}).length;
        iz.appendChild(el('button', { class: 'sr-kart', type: 'button', style: '--k:' + (x.renk || '#4fe0ff'), onclick: function () { U.git('saray-' + x.id); } }, [
          el('small', { text: x.kitapAd + ' · ' + x.bolumAd }), el('b', { text: x.ad }), el('div', { class: 'em', text: x.odalar.map(function (o) { return o.sembol; }).join('') }),
          el('small', { text: x.odalar.length + ' oda · ' + (x.tema ? x.tema + ' · ' : '') + ((x.gezinti || {}).n || 0) + ' kez gezildi · ' + bildi + '/' + x.odalar.length + ' hatırlandı' })]));
      });
    });
  };
  function sarayGez(sayfa, s) {
    var su = 0, sinav = false, acik = false, K = window.AndroidKopru;
    sayfa.appendChild(el('a', { class: 'var-etiket', href: '#saray', text: '← Saraylar' }));
    sayfa.appendChild(el('div', { class: 'kahraman' }, [el('div', { class: 'ust-etiket', text: s.kitapAd + ' · ' + s.bolumAd }), el('h1', { text: '🏛 ' + s.ad }), s.tema ? el('p', { text: 'Mekân: ' + s.tema }) : null, s.hikaye ? el('p', { class: 'var-etiket', text: 'Senin hikâyen: ' + s.hikaye }) : null]));
    var planKap = el('div'), odaKap = el('div'), gez = el('div', { class: 'sr-gez' });
    sayfa.appendChild(planKap); sayfa.appendChild(gez); sayfa.appendChild(odaKap);
    var mod = el('button', { class: 'dugme kucuk', type: 'button', onclick: function () { sinav = !sinav; this.textContent = sinav ? '👁 Gezinti modu' : '🧠 Sınav modu'; git(0); } }, ['🧠 Sınav modu']);
    gez.appendChild(el('button', { class: 'dugme kucuk', type: 'button', text: '← Önceki', onclick: function () { git(su - 1); } }));
    gez.appendChild(el('button', { class: 'dugme kucuk ana', type: 'button', text: 'Sonraki →', onclick: function () { git(su + 1); } }));
    gez.appendChild(mod);
    if (window.Carvis && window.Carvis.soyle && K) gez.appendChild(el('button', { class: 'dugme kucuk', type: 'button', text: '🔊 Sesli gez', onclick: function () { sesliGez(0); } }));
    if (U.sarayKartla) gez.appendChild(el('button', { class: 'dugme kucuk', type: 'button', text: '❖ Kartlara ekle', title: 'Her oda bir tekrar kartı olur (ön: sahne, arka: bilgi)', onclick: function () { U.sarayKartla(s).then(function (n) { toast(n ? n + ' oda kartlara eklendi.' : 'Bu sarayın odaları zaten kartlarda.'); }); } }));
    var yenidenKap = el('div', { class: 'yp-cevap', hidden: true });
    gez.appendChild(el('button', { class: 'dugme kucuk', type: 'button', text: '✍ Kendi hikâyemle yeniden kur', onclick: function () {
      yenidenKap.hidden = false; Promise.all([Kitaplik.ac(s.kitap), Kitaplik.bolumAc(s.kitap, s.sira)]).then(function (r) { U.sarayKurPaneli(yenidenKap, r[0], r[1], s.hikaye || ''); });
    } }));
    sayfa.appendChild(yenidenKap);
    gez.appendChild(el('button', { class: 'dugme kucuk', type: 'button', text: '🗑 Sil', onclick: function () { if (!confirm('"' + s.ad + '" silinsin mi?')) return; U.depoGuncelle('saraylar', function (v) { v.liste = (v.liste || []).filter(function (x) { return x.id !== s.id; }); }, 100).then(function () { U.git('saray'); }); } }));
    function kaydet() { sarayKaydet(s); }
    s.gezinti = s.gezinti || { n: 0, son: 0, bildi: {} }; s.gezinti.n++; s.gezinti.son = Date.now(); kaydet();
    function git(i) {
      su = Math.max(0, Math.min(s.odalar.length - 1, i)); acik = !sinav;
      planKap.innerHTML = ''; planKap.appendChild(planCiz(s, su, git));
      odaCiz();
    }
    function odaCiz() {
      var o = s.odalar[su]; odaKap.innerHTML = '';
      var kart = el('div', { class: 'sr-oda' }, [el('div', { class: 'ust' }, [el('span', { class: 'sembol', text: o.sembol }), el('div', {}, [el('small', { class: 'var-etiket', text: (su + 1) + '. oda / ' + s.odalar.length }), el('h3', { text: o.ad })])]),
        el('p', { class: 'sahne', text: o.sahne })]);
      if (acik) {
        kart.appendChild(el('div', { class: 'bilgi' }, [el('b', { text: 'Bilgi: ' }), o.bilgi]));
        if (o.esleme) kart.appendChild(el('div', { class: 'anahtar', text: '🔗 ' + o.esleme }));
        if (o.anahtar) kart.appendChild(el('div', { class: 'anahtar', text: '🔑 ' + o.anahtar }));
        if (o.sinir) kart.appendChild(el('div', { class: 'anahtar', style: 'color:var(--uyari,#ffb547)', text: '⚠ Benzetmenin sınırı: ' + o.sinir }));
        if (sinav) kart.appendChild(el('div', { class: 'yp-dugmeler' }, [
          el('button', { class: 'dugme kucuk', type: 'button', text: '✓ Hatırladım', onclick: function () { s.gezinti.bildi[su] = Date.now(); kaydet(); git(su + 1); } }),
          el('button', { class: 'dugme kucuk', type: 'button', text: '✗ Hatırlayamadım', onclick: function () { delete s.gezinti.bildi[su]; kaydet(); if (U.eksikEkle) U.eksikEkle({ kitap: s.kitap, bolum: s.bolumAd, sira: s.sira, konu: o.ad, soru: o.bilgi.slice(0, 160), bilmiyor: true, kaynak: 'saray' }); git(su + 1); } })]));
      } else {
        kart.appendChild(el('p', { class: 'var-etiket', text: 'Bu sahne hangi bilgiyi saklıyor? Önce kendin söyle.' }));
        kart.appendChild(el('button', { class: 'dugme kucuk ana', type: 'button', text: 'Bilgiyi aç', onclick: function () { acik = true; odaCiz(); } }));
      }
      odaKap.appendChild(kart);
      if (su === s.odalar.length - 1 && acik) odaKap.appendChild(el('p', { class: 'var-etiket', text: 'Sarayın sonu. Şimdi gözünü kapat ve odaları baştan sona zihninde gez — her odada sahneyi gör, bilgiyi söyle.' }));
    }
    function sesliGez(i) {
      if (i >= s.odalar.length) return;
      git(i); var o = s.odalar[i];
      Promise.resolve(window.Carvis.soyle((i === 0 ? s.ad + '. ' : '') + o.ad + '. ' + o.sahne + ' Bilgi: ' + o.bilgi)).then(function () { if (location.hash === '#saray-' + s.id) sesliGez(i + 1); });
    }
    git(0);
  }
  // Carvis aracı: sarayları listele / gezdir
  U.sarayAraclari = function () {
    return [{ name: 'hafiza_sarayi', description: 'Öğrencinin hafıza saraylarını listeler ya da birini açar ("hafıza sarayımı aç", "lipoprotein sarayını gezdir"). ad verilirse en uyan sarayı açar.',
      inputSchema: { type: 'object', properties: { ad: { type: 'string' } } },
      execute: function (g) { return Depo.oku('saraylar').then(function (v) { var l = v.liste || []; if (!l.length) return 'Henüz saray yok. Bir bölümde Zamanım yok → Hafıza sarayı kur.'; var q = String(g.ad || '').toLowerCase(), s = q ? l.filter(function (x) { return (x.ad + ' ' + x.bolumAd + ' ' + x.kitapAd).toLowerCase().indexOf(q) >= 0; })[0] : null; if (s) { U.git('saray-' + s.id); return 'Açıldı: ' + s.ad + ' (' + s.odalar.length + ' oda). Odalar: ' + s.odalar.map(function (o) { return o.ad; }).join(', '); } U.git('saray'); return 'Saraylar: ' + l.map(function (x) { return x.ad + ' (' + x.bolumAd + ')'; }).join('; '); }); } }];
  };
  var eskiEk = U.sohbetEkAraclari; // Sohbet ve Carvis (ek araçlar üzerinden) sarayları açabilsin
  U.sohbetEkAraclari = function () { return (eskiEk ? eskiEk() : []).concat(U.sarayAraclari()); };
  U.sekmeleriCiz();
})();
