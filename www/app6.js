/* 1001 — Aşama 6: Lab ortak çerçevesi (tur, HUD, sohbetle sahne kontrolü) + Molekül Lab (3Dmol.js) */
(function () {
  'use strict';
  var U = window.Uygulama, A = window.KitapAyristir;
  var el = U.el, $ = U.$, $$ = U.$$, esc = U.esc, duz = U.duz, toast = U.toast, Y = U.Y, Kitaplik = U.Kitaplik, Durum = U.Durum;
  var katla = A.katla, fnv = A.fnv;
  var AZ_HAREKET = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  function betik(url, kontrol) {
    if (kontrol()) return Promise.resolve();
    return new Promise(function (ok, red) { var s = document.createElement('script'); s.src = url; s.onload = function () { kontrol() ? ok() : red(new Error('Kütüphane yüklendi ama çalışmadı: ' + url)); }; s.onerror = function () { red(new Error('Kütüphane yüklenemedi: ' + url)); }; document.head.appendChild(s); });
  }
  U.betik = betik;

  /* ================= ortak Lab çerçevesi ================= */
  // ad: { katalog() → [{id, ad, tur?}], goster(id), isaret(id, etiket), kamera(id), sifirla(), metinBaglam() }
  function Lab(kok, adaptor) {
    var self = this;
    self.adaptor = adaptor;
    window.__aktifLab = self; // Carvis gömülü sahneyi buradan yönetir
    self.adimlar = []; self.i = -1; self.calisiyor = false; self.zaman = null; self.ses = false;
    self.kok = kok;
    self.hud = el('div', { class: 'hud-katman', 'aria-hidden': 'true' }, [el('div', { class: 'hud-halka' }), el('div', { class: 'hud-cizgi' })]);
    self.metin = el('div', { class: 'tur-metin', 'aria-live': 'polite' });
    self.adimListe = el('ol', { class: 'tur-adimlar' });
    self.kontrol = el('div', { class: 'tur-kontrol' }, [
      el('button', { class: 'dugme kucuk', type: 'button', onclick: function () { self.git(self.i - 1); } }, ['◀ Önceki']),
      self.oynat = el('button', { class: 'dugme kucuk ana', type: 'button', onclick: function () { self.calisiyor ? self.duraklat() : self.devam(); } }, ['❚❚ Duraklat']),
      el('button', { class: 'dugme kucuk', type: 'button', onclick: function () { self.git(self.i + 1); } }, ['Sonraki ▶']),
      self.sesDug = el('button', { class: 'dugme kucuk', type: 'button', 'aria-pressed': 'false', hidden: !('speechSynthesis' in window) ? true : null, onclick: function () { self.ses = !self.ses; self.sesDug.setAttribute('aria-pressed', String(self.ses)); if (!self.ses) try { speechSynthesis.cancel(); } catch (e) {} } }, ['🔊 Sesli'])
    ]);
  }
  Lab.prototype.baslat = function (adimlar, baslik) {
    var self = this, kat = self.adaptor.katalog();
    var gecerli = adimlar.filter(function (a) { return !a.hedef || kat.some(function (k) { return k.id === a.hedef; }); });
    if (gecerli.length < adimlar.length) toast((adimlar.length - gecerli.length) + ' adım katalogda olmayan bir hedefe işaret ettiği için atlandı.');
    if (!gecerli.length) { toast('Turda oynatılabilir adım yok.'); return false; }
    self.adimlar = gecerli; self.baslik = baslik || 'Tur';
    self.adimListe.innerHTML = '';
    gecerli.forEach(function (a, j) { self.adimListe.appendChild(el('li', null, [el('button', { type: 'button', onclick: function () { self.git(j); self.duraklat(); } }, [a.baslik || (kat.filter(function (k) { return k.id === a.hedef; })[0] || {}).ad || 'Genel bakış'])])); });
    self.calisiyor = true; self.oynat.textContent = '❚❚ Duraklat';
    self.git(0);
    return true;
  };
  Lab.prototype.git = function (j) {
    var self = this;
    if (!self.adimlar.length) return;
    j = Math.max(0, Math.min(self.adimlar.length - 1, j));
    self.i = j;
    clearTimeout(self.zaman);
    var a = self.adimlar[j];
    $$('li', self.adimListe).forEach(function (li, k) { li.classList.toggle('aktif', k === j); });
    if (a.hedef) { self.adaptor.goster(a.hedef); self.adaptor.kamera(a.hedef, a.kamera); if (a.isaret !== false) self.adaptor.isaret(a.hedef, a.isaretMetni || null); }
    else self.adaptor.sifirla();
    self.yaz(a);
    if (self.calisiyor && j < self.adimlar.length - 1) self.zaman = setTimeout(function () { self.git(j + 1); }, Math.max(6000, (a.metin || '').length * 55));
    if (j === self.adimlar.length - 1) { self.calisiyor = false; self.oynat.textContent = '▶ Oynat'; }
  };
  Lab.prototype.duraklat = function () { this.calisiyor = false; clearTimeout(this.zaman); this.oynat.textContent = '▶ Oynat'; };
  Lab.prototype.devam = function () { this.calisiyor = true; this.oynat.textContent = '❚❚ Duraklat'; this.git(this.i >= this.adimlar.length - 1 ? 0 : this.i + 1); };
  Lab.prototype.yaz = function (a) {
    var self = this;
    self.metin.innerHTML = '';
    var et = a.kaynakTur === 'kitap' ? el('span', { class: 'etiket-kucuk kitap', text: 'Kitaptan' }) : el('span', { class: 'etiket-kucuk genel', text: a.kaynakTur === 'ai' ? 'AI turu · genel bilgi' : 'Genel bilgi' });
    self.metin.appendChild(el('div', { class: 'tur-ust' }, [el('strong', { text: a.baslik || '' }), et]));
    var p = el('p', { class: 'daktilo' });
    self.metin.appendChild(p);
    if (a.kaynak) self.metin.appendChild(el('a', { class: 'capraz', href: '#' + U.okuHash(a.kaynak.kitap, a.kaynak.bolum), onclick: function () { Durum.vurguBlok = a.kaynak.blok; }, text: '→ ' + (a.kaynak.etiket || 'kitapta aç') }));
    var t = a.metin || '';
    if (AZ_HAREKET) p.textContent = t;
    else { var k = 0; (function yazdir() { if (!document.body.contains(p)) return; k = Math.min(t.length, k + 3); p.textContent = t.slice(0, k); if (k < t.length) requestAnimationFrame(yazdir); })(); }
    if (self.ses && t) try { speechSynthesis.cancel(); var u = new SpeechSynthesisUtterance(t); u.lang = 'tr-TR'; speechSynthesis.speak(u); } catch (e) {}
  };
  // HUD halkası: ekran koordinatına kilitlenir
  Lab.prototype.halka = function (x, y, r, gorunur) {
    var h = $('.hud-halka', this.hud), c = $('.hud-cizgi', this.hud);
    if (!gorunur) { h.style.opacity = 0; c.style.opacity = 0; return; }
    h.style.opacity = 1; c.style.opacity = 1;
    h.style.transform = 'translate(' + (x - r) + 'px,' + (y - r) + 'px)'; h.style.width = h.style.height = (2 * r) + 'px';
    c.style.transform = 'translate(' + (x + r * 0.7) + 'px,' + (y - r * 0.7) + 'px) rotate(-35deg)';
  };
  // Sohbetle sahne kontrolü (sample tools)
  Lab.prototype.sohbet = function (kap, baglamFn) {
    var self = this;
    var akis = el('div', { class: 'lab-sohbet-akis', 'aria-live': 'polite' });
    var girdi = el('input', { id: 'labSohbet', type: 'text', placeholder: self.adaptor.ornekSoru || 'Yaz: …', autocomplete: 'off', 'aria-label': 'Lab asistanına yaz' });
    var form = el('form', { class: 'yp-form' }, [girdi, el('button', { class: 'dugme kucuk ana', type: 'submit' }, ['Gönder'])]);
    kap.appendChild(akis); kap.appendChild(form);
    var mesajlar = [];
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var q = girdi.value.trim(); if (!q) return; girdi.value = '';
      akis.appendChild(el('div', { class: 'mesaj ben' }, [el('p', { text: q })]));
      var cev = el('div', { class: 'mesaj o' }, [el('div', { class: 'yukleniyor', text: 'Düşünüyor…' })]); akis.appendChild(cev); akis.scrollTop = akis.scrollHeight;
      var iz = el('div', { class: 'var-etiket arac-iz' });
      U.AI.hazir().then(function (ok) {
        if (!ok) throw { code: 'not_granted' };
        return Y.sample.limits().then(function (l) {
          if (!l || !l.tools) throw { code: 'tools_unavailable' };
          var araclar = self.araclar(iz, cev);
          mesajlar.push({ role: 'user', content: q });
          var kural = 'Sen bir 3B ' + self.adaptor.tur + ' laboratuvarını yöneten Türkçe asistansın. Sahneyi YALNIZ verilen araçlarla sür: önce katalog_ara ile parçayı bul, sonra parca_goster / kamera_yaklas / isaret_goster çağır; çok adımlı anlatım için tur_baslat. Katalogda olmayan kimlik UYDURMA. Sonra 2-5 cümlelik kısa açıklama yaz; kitaba dayanan kısmı "**Kitaptan:**", kendi bilgini "**Genel bilgi:**" diye ayır. Kitap bağlamı:\n' + (baglamFn ? baglamFn() : '');
          return Y.sample([{ role: 'user', content: kural + '\n\nAnladıysan "Tamam" yaz.' }, { role: 'assistant', content: 'Tamam.' }].concat(mesajlar.slice(-8)), { tools: araclar, onText: function (u) { cev.innerHTML = U.mdHtml(u.text); if (iz.textContent) cev.prepend(iz); } });
        });
      }).then(function (r) {
        mesajlar.push({ role: 'assistant', content: r.text });
        cev.innerHTML = U.mdHtml(r.text); if (iz.textContent) cev.prepend(iz);
        if (self.ses) try { speechSynthesis.cancel(); var u = new SpeechSynthesisUtterance(duz(U.mdHtml(r.text))); u.lang = 'tr-TR'; speechSynthesis.speak(u); } catch (e) {}
      }).catch(function (e) { cev.innerHTML = e && e.text ? U.mdHtml(e.text) : ''; cev.appendChild(el('p', { class: 'hata-metni', text: U.AI.hataMetni(e) })); });
    });
  };
  Lab.prototype.araclar = function (iz, cev) {
    var self = this, ad = self.adaptor;
    function kaydet(t) { iz.textContent = (iz.textContent ? iz.textContent + ' · ' : '⚙ ') + t; if (!iz.parentNode) cev.prepend(iz); }
    function bul(id) { var k = ad.katalog().filter(function (x) { return x.id === String(id); })[0]; if (!k) throw new Error('Katalogda yok: ' + id + '. Önce katalog_ara kullan.'); return k; }
    return [
      { name: 'katalog_ara', description: 'Sahnedeki parça/bölge kataloğunda ada göre arar (Türkçe, Latince ya da İngilizce). En çok 12 sonuç: {id, ad}. Diğer araçlara bu id verilir.',
        inputSchema: { type: 'object', properties: { ad: { type: 'string' } }, required: ['ad'] },
        execute: function (g) { kaydet('katalog_ara(' + g.ad + ')'); var q = katla(String(g.ad || '')); var s = ad.katalog().filter(function (k) { return katla(k.ad + ' ' + (k.ara || '')).indexOf(q) >= 0; }).slice(0, 12).map(function (k) { return { id: k.id, ad: k.ad }; }); return s.length ? s : 'Sonuç yok. Daha genel bir ad dene.'; } },
      { name: 'parca_goster', description: 'Parçayı/bölgeyi vurgular, diğerlerini soldurur.', inputSchema: { type: 'object', properties: { id: { type: 'string' } }, required: ['id'] },
        execute: function (g) { var k = bul(g.id); kaydet('parca_goster(' + k.ad + ')'); self.duraklat(); ad.goster(k.id); return 'Gösterildi: ' + k.ad; } },
      { name: 'kamera_yaklas', description: 'Kamerayı parçaya/bölgeye uçurur.', inputSchema: { type: 'object', properties: { hedef: { type: 'string', description: 'katalog id' } }, required: ['hedef'] },
        execute: function (g) { var k = bul(g.hedef); kaydet('kamera_yaklas(' + k.ad + ')'); ad.kamera(k.id); return 'Kamera: ' + k.ad; } },
      { name: 'isaret_goster', description: 'Parçanın üzerine halka ve etiket koyar.', inputSchema: { type: 'object', properties: { id: { type: 'string' }, etiket: { type: 'string' } }, required: ['id'] },
        execute: function (g) { var k = bul(g.id); kaydet('isaret_goster(' + k.ad + ')'); ad.isaret(k.id, g.etiket ? String(g.etiket) : null); return 'İşaretlendi.'; } },
      { name: 'tur_baslat', description: 'Adım adım tur oynatır. adimlar: [{hedef: katalog id, baslik, metin (1-2 cümle Türkçe)}]. Kimlikler katalogda olmalı.',
        inputSchema: { type: 'object', properties: { adimlar: { type: 'array', items: { type: 'object', properties: { hedef: { type: 'string' }, baslik: { type: 'string' }, metin: { type: 'string' } } } } }, required: ['adimlar'] },
        execute: function (g) { var l = (g.adimlar || []).map(function (a) { return { hedef: String(a.hedef || ''), baslik: String(a.baslik || ''), metin: String(a.metin || ''), kaynakTur: 'ai' }; }); kaydet('tur_baslat(' + l.length + ' adım)'); return self.baslat(l, 'AI turu') ? 'Tur başladı.' : 'Geçerli adım yok.'; } }
    ];
  };
  U.Lab = Lab;

  /* --- kitaptan özet: kavram dizininden ilk geçiş --- */
  function kitaptanOzet(kitapId, kavram) {
    // Kavramın geçtiği ilk birkaç bloktan, cevap anahtarı/tablo olmayan ve kavramı içeren en anlamlı paragrafı seç.
    return Promise.all([U.kavramDizini(kitapId), Kitaplik.katalog().then(function () { return Kitaplik.ac(kitapId); })]).then(function (r) {
      var dz = r[0], kj = r[1], k = katla(kavram), x = dz[k];
      if (!x) { var anah = Object.keys(dz).filter(function (a) { return a.indexOf(k) === 0; })[0]; x = anah ? dz[anah] : null; }
      if (!x) return null;
      var yerler = x.yer.slice(0, 8);
      return Promise.all(yerler.map(function (y) { return Kitaplik.bolumAc(kitapId, y[0]).then(function (b) { return { y: y, b: b }; }).catch(function () { return null; }); })).then(function (l) {
        var aday = [];
        l.forEach(function (o, i) {
          if (!o) return;
          var bul = null;
          o.b.altlar.forEach(function (a) { (function g(z) { z.forEach(function (b) { if (b.id === o.y[3]) bul = b; if (b.bloklar && !bul) g(b.bloklar); }); })(a.bloklar); });
          if (!bul) return;
          var t = duz(bul.html || (bul.ogeler || []).join(' • ') || (bul.bloklar || []).map(function (z) { return z.html || (z.ogeler || []).join(' • '); }).join(' '));
          var puan = (bul.t === 'p' ? 3 : bul.t === 'callout' ? 2 : bul.t === 'liste' ? 1 : -2) + (t.length > 80 ? 2 : 0) - (/^[A-E] —|^\d+\. /.test(t) ? 5 : 0) - (o.b.ozel ? 4 : 0) - i * 0.3 + (katla(t).indexOf(k) >= 0 ? 1 : 0);
          if (t) aday.push({ t: t, y: o.y, puan: puan });
        });
        if (!aday.length) return null;
        aday.sort(function (a, b) { return b.puan - a.puan; });
        var en = aday[0], y = en.y, m = en.t;
        return { metin: m.slice(0, 420) + (m.length > 420 ? '…' : ''), kaynak: { kitap: kitapId, bolum: y[0], blok: y[3], etiket: kj.baslik.replace(/^1001\s*/, '') + ' ' + (y[2] || ('Bölüm ' + kj.bolumler[y[0]].no)) } };
      });
    }).catch(function () { return null; });
  }
  U.kitaptanOzet = kitaptanOzet;

  /* ================= Molekül Lab ================= */
  var MOL3D = 'https://cdnjs.cloudflare.com/ajax/libs/3Dmol/2.4.2/3Dmol-min.js';
  var BOLGE_ACIKLAMA = {
    hidroksil: 'Hidroksil (–OH) grupları polardır; su ile hidrojen bağı kurar, molekülü suda çözünür kılar.',
    karboksil: 'Karboksil (–COOH) grubu fizyolojik pH\'ta proton verip –COO⁻ olur; asidik karakter buradan gelir.',
    amino: 'Amino (–NH2) grubu proton alıp –NH3⁺ olabilir; bazik uçtur.',
    imidazol: 'İmidazol halkasının pKa\'sı fizyolojik pH\'a yakındır; bu yüzden histidin hem proton alıp verebilir hem metal (ör. hemdeki Fe) bağlayabilir.',
    tiyol: 'Tiyol (–SH) grubu yükseltgenince iki sistein disülfit köprüsü kurar; protein yapısını sabitler.',
    indol: 'İndol halkası büyük ve aromatiktir; triptofanı en hidrofobik aminoasitlerden biri yapar ve UV (280 nm) soğurur.',
    pirolidin: 'Prolinin yan zinciri omurga azotuna geri bağlanır (iminoasit); zinciri büker, α-heliksi kırar.',
    fosfat: 'Fosfat grupları negatif yüklüdür; fosfoanhidrit bağları yüksek enerjilidir (ATP), fosfolipitte polar başı oluşturur.',
    glikozid: 'Glikozid bağı iki şekeri bir oksijen köprüsüyle bağlar; anomerik karbonun konumu (α/β) sindirilebilirliği belirler.',
    ester: 'Ester bağı yağ asidini gliserole bağlar; lipazlar bu bağı hidrolizler.',
    peptid: 'Peptid bağı kısmi çift bağ karakterlidir; düzlemseldir ve dönemez, protein omurgasının biçimini belirler.',
    cift_bag: 'Cis çift bağ zincirde kıvrım yaratır; yağ asitleri sıkı istiflenemez, erime noktası düşer.',
    kolin: 'Kolin başındaki kalıcı pozitif yük, fosfatın negatif yüküyle birlikte zwitteriyonik polar baş oluşturur.',
    anomerik: 'Anomerik karbon halka kapanınca oluşan yeni kiral merkezdir; α ve β anomerler burada ayrılır.',
    furanoz: 'Beş üyeli furanoz halkası (4 C + 1 O).', piranoz: 'Altı üyeli piranoz halkası (5 C + 1 O); sandalye konformasyonu alır.',
    aromatik: 'Düzlemsel aromatik halka; bazlar bu yüzden üst üste istiflenir ve hidrojen bağıyla eşleşir.',
    steroid: 'Dört kaynaşık halkalı steroid çekirdeği katı, düzlemsele yakın bir iskelettir; zarın akışkanlığını ayarlar.'
  };
  var Mol = { katalog: null, viewer: null, model: null, aktif: null };
  function molKatalog() { if (!Mol.katalog) Mol.katalog = fetch('lab/molekul/katalog.json').then(function (r) { return r.json(); }); return Mol.katalog; }
  U.molKatalog = molKatalog;

  U.GORUNUMLER['lab-molekul'] = function (molId) { labMolekul(molId); };
  function labMolekul(molId) {
    var ana = $('#ana'); ana.innerHTML = '';
    var sayfa = el('div', { class: 'lab-sayfa' }); ana.appendChild(sayfa);
    var sahneKap = el('div', { class: 'lab-sahne' });
    var tuval = el('div', { class: 'lab-tuval', id: 'molTuval', role: 'img', 'aria-label': '3B molekül görünümü' });
    sahneKap.appendChild(tuval);
    var yan = el('aside', { class: 'lab-yan' });
    sayfa.appendChild(sahneKap); sayfa.appendChild(yan);
    var ust = el('div', { class: 'lab-ust' });
    var secici = el('select', { id: 'molSec', 'aria-label': 'Molekül' });
    ust.appendChild(el('div', { class: 'ust-etiket', text: 'Molekül Lab' })); ust.appendChild(secici);
    sahneKap.appendChild(ust);
    var stiller = el('div', { class: 'lab-stiller' });
    sahneKap.appendChild(stiller);
    var durum = el('div', { class: 'lab-durum' }, [el('div', { class: 'yukleniyor', text: '3Dmol.js yükleniyor…' })]);
    sahneKap.appendChild(durum);
    var lab = new Lab(sahneKap, {
      tur: 'molekül', ornekSoru: 'Örn. "imidazol halkasını göster, neden önemli?"',
      katalog: function () { return Mol.aktif ? Mol.aktif.bolgeler.map(function (b) { return { id: b.id, ad: b.ad, ara: b.id }; }) : []; },
      goster: function (id) { bolgeVurgula(id); }, kamera: function (id) { bolgeYaklas(id); }, isaret: function (id, et) { bolgeIsaret(id, et); }, sifirla: function () { stilUygula(Mol.stil || 'cubuk'); Mol.viewer && Mol.viewer.zoomTo({}, AZ_HAREKET ? 0 : 700); lab.halka(0, 0, 0, false); }
    });
    sahneKap.appendChild(lab.hud);
    yan.appendChild(el('section', { class: 'lab-kutu' }, [el('h3', { text: 'Tur' }), lab.adimListe, lab.kontrol, lab.metin]));
    var bilgi = el('section', { class: 'lab-kutu lab-bilgi' });
    yan.appendChild(bilgi);
    var sohbetKutu = el('section', { class: 'lab-kutu ai-gerek' }, [el('h3', { text: 'Asistana yaz' })]);
    yan.appendChild(sohbetKutu);
    lab.sohbet(sohbetKutu, function () { return Mol.aktif ? 'Molekül: ' + Mol.aktif.ad + ' (' + Mol.aktif.tur + '). Bölge kataloğu: ' + Mol.aktif.bolgeler.map(function (b) { return b.id + '=' + b.ad; }).join(', ') : ''; });
    var atif = el('p', { class: 'lab-atif' }); yan.appendChild(atif);
    Promise.all([betik(MOL3D, function () { return !!window.$3Dmol; }), molKatalog()]).then(function (r) {
      var kat = r[1].molekuller;
      var gruplar = {};
      kat.forEach(function (m) { (gruplar[m.tur] = gruplar[m.tur] || []).push(m); });
      Object.keys(gruplar).forEach(function (t) { secici.appendChild(el('optgroup', { label: t }, gruplar[t].map(function (m) { return el('option', { value: m.id, text: m.ad }); }))); });
      var ilk = kat.filter(function (m) { return m.id === molId; })[0] || kat.filter(function (m) { return m.id === 'histidin'; })[0] || kat[0];
      secici.value = ilk.id;
      secici.addEventListener('change', function () { try { history.replaceState(null, '', '#lab-molekul-' + secici.value); } catch (e) {} yukle(kat.filter(function (m) { return m.id === secici.value; })[0]); });
      Mol.viewer = window.$3Dmol.createViewer(tuval, { backgroundColor: '#060c11', antialias: true });
      durum.innerHTML = '';
      Mol.viewer.setHoverable({}, false);
      // Halka 3B sahnenin içinde çizilir (bkz. bolgeVurgula); ekran koordinatı yüksek piksel yoğunluklu cihazlarda kayıyordu.
      lab.halka(0, 0, 0, false);
      window.addEventListener('resize', function () { Mol.viewer && Mol.viewer.resize(); });
      yukle(ilk);
    }).catch(function (e) { durum.innerHTML = ''; durum.appendChild(el('div', { class: 'bos hata-metni', text: '3B görüntüleyici açılamadı: ' + e.message + '. İnternet bağlantısını ya da tarayıcının WebGL desteğini kontrol et.' })); });

    function yukle(m) {
      Mol.aktif = m; Mol.isaretMerkez = null; lab.halka(0, 0, 0, false);
      Mol.viewer.clear();
      fetch('lab/molekul/' + m.dosya).then(function (r) { return r.text(); }).then(function (veri) {
        Mol.model = Mol.viewer.addModel(veri, m.bicim);
        Mol.stil = m.bicim === 'pdb' ? 'cartoon' : 'cubuk';
        stilDugmeleri(m);
        stilUygula(Mol.stil);
        Mol.viewer.zoomTo(); Mol.viewer.render();
        atif.innerHTML = '';
        atif.appendChild(document.createTextNode('Yapı: ' + m.kaynak.ad + ' ' + (m.kaynak.cid ? 'CID ' + m.kaynak.cid : m.kaynak.pdb) + ' · ' + m.kaynak.lisans + (m.kaynak.yontem ? ' · ' + m.kaynak.yontem : '') + ' · '));
        atif.appendChild(el('a', { href: m.kaynak.url, target: '_blank', rel: 'noopener', text: 'kaynak' }));
        atif.appendChild(document.createTextNode(' · Görüntüleyici: 3Dmol.js (BSD)'));
        bilgiCiz(m);
        varsayilanTur(m).then(function (adimlar) { lab.baslat(adimlar, m.ad); lab.duraklat(); lab.git(0); });
      });
    }
    function stilDugmeleri(m) {
      stiller.innerHTML = '';
      (m.bicim === 'pdb' ? [['cartoon', 'Kurdele'], ['cubuk', 'Çubuk'], ['kure', 'Küre'], ['yuzey', 'Yüzey']] : [['cubuk', 'Çubuk'], ['kure', 'Küre'], ['yuzey', 'Yüzey']]).forEach(function (s) {
        var b = el('button', { class: 'cip', type: 'button', 'aria-pressed': String(Mol.stil === s[0]) }, [s[1]]);
        b.addEventListener('click', function () { Mol.stil = s[0]; $$('.cip', stiller).forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); }); stilUygula(s[0]); if (Mol.vurgu) bolgeVurgula(Mol.vurgu, true); });
        stiller.appendChild(b);
      });
    }
    function stilUygula(s) {
      var v = Mol.viewer; if (!v) return;
      v.removeAllSurfaces(); v.removeAllShapes(); v.removeAllLabels(); Mol.vurgu = null; Mol.isaretMerkez = null;
      var protein = Mol.aktif && Mol.aktif.bicim === 'pdb';
      if (s === 'cartoon') { v.setStyle({}, { cartoon: { color: 'spectrum' } }); v.setStyle({ hetflag: true }, { stick: { radius: 0.2 } }); v.setStyle({ resn: 'HOH' }, {}); }
      else if (s === 'kure') v.setStyle({}, { sphere: { scale: protein ? 1 : 0.9 } });
      else { v.setStyle({}, { stick: { radius: protein ? 0.15 : 0.18 }, sphere: { scale: protein ? 0 : 0.22 } }); if (protein) v.setStyle({ resn: 'HOH' }, {}); }
      if (s === 'yuzey') v.addSurface(window.$3Dmol.SurfaceType.VDW, { opacity: 0.55, color: '#4fe0ff' }, protein ? { hetflag: false } : {});
      v.render();
    }
    function secim(b) {
      if (b.atomlar) return { index: b.atomlar };
      var s = b.secim, o = {};
      if (s.chain) o.chain = s.chain; if (s.resi != null) o.resi = s.resi; if (s.resn) o.resn = s.resn; if (s.atom) o.atom = s.atom; if (s.hetflag != null) o.hetflag = s.hetflag;
      if (s.atomNot) { var yok = s.atomNot; var rn = [].concat(s.resn || []); return { predicate: function (a) { return rn.indexOf(a.resn) >= 0 && yok.indexOf(a.atom) < 0; } }; }
      return o;
    }
    function bolgeBul(id) { return Mol.aktif && Mol.aktif.bolgeler.filter(function (b) { return b.id === id; })[0]; }
    function merkez(sel) { var at = Mol.viewer.selectedAtoms(sel); if (!at.length) return null; var x = 0, y = 0, z = 0; at.forEach(function (a) { x += a.x; y += a.y; z += a.z; }); return { x: x / at.length, y: y / at.length, z: z / at.length, n: at.length }; }
    function bolgeVurgula(id, stilKoru) {
      var b = bolgeBul(id); if (!b) return;
      var v = Mol.viewer, sel = secim(b);
      v.removeAllShapes(); v.removeAllLabels();
      var protein = Mol.aktif.bicim === 'pdb';
      // diğerleri soluk
      if (Mol.stil === 'cartoon') v.setStyle({}, { cartoon: { color: '#3a4a55', opacity: 0.5 } });
      else v.setStyle({}, { stick: { radius: 0.12, color: '#55656f' }, sphere: { scale: 0.15, color: '#55656f' } });
      if (protein) v.setStyle({ resn: 'HOH' }, {});
      v.setStyle(sel, Mol.stil === 'cartoon' && !(b.secim && (b.secim.resi != null || b.secim.resn)) ? { cartoon: { color: '#4fe0ff' } } : { stick: { radius: 0.28, colorscheme: 'cyanCarbon' }, sphere: { scale: 0.32, colorscheme: 'cyanCarbon' } });
      var m = merkez(sel);
      if (m) {
        var yc = Math.min(9, 1.6 + Math.sqrt(m.n) * 0.35);
        v.addSphere({ center: m, radius: yc, color: '#4fe0ff', opacity: 0.18 });
        v.addSphere({ center: m, radius: yc * 1.25, color: '#4fe0ff', opacity: 0.55, wireframe: true, linewidth: 1 });
      }
      v.render(); Mol.vurgu = id;
    }
    function bolgeYaklas(id) { var b = bolgeBul(id); if (!b) return; Mol.viewer.zoomTo(secim(b), AZ_HAREKET ? 0 : 900); }
    function bolgeIsaret(id, et) {
      var b = bolgeBul(id); if (!b) return;
      var m = merkez(secim(b)); if (!m) return;
      Mol.isaretMerkez = m;
      Mol.viewer.addLabel(et || b.ad, { position: m, backgroundColor: '#0b2430', backgroundOpacity: 0.85, fontColor: '#bff6ff', fontSize: 13, borderColor: '#4fe0ff', borderThickness: 1, inFront: true, showBackground: true });
      Mol.viewer.render();
    }
    function bilgiCiz(m) {
      bilgi.innerHTML = '';
      bilgi.appendChild(el('h3', { text: m.ad }));
      bilgi.appendChild(el('p', { class: 'var-etiket', text: m.tur + (m.atomSayisi ? ' · ' + m.atomSayisi + ' atom' : '') }));
      var bl = el('div', { class: 'yp-dugmeler' });
      m.bolgeler.forEach(function (b) { bl.appendChild(el('button', { class: 'cip', type: 'button', onclick: function () { lab.duraklat(); bolgeVurgula(b.id); bolgeYaklas(b.id); bolgeIsaret(b.id); } }, [b.ad])); });
      bilgi.appendChild(bl);
      bilgi.appendChild(el('button', { class: 'dugme kucuk ai-gerek', type: 'button', onclick: function () { aiTur(m); } }, ['✦ AI ile tur yaz']));
      bilgi.appendChild(el('button', { class: 'cip', type: 'button', onclick: function () { Kitaplik.katalog().then(function () { return Kitaplik.ac('biyokimya'); }).then(function (kj) { U.kavramAc(m.kavram, { kj: kj, bolum: null, blok: null }); }); } }, ['Kitaptaki kavram kartı']));
    }
    function varsayilanTur(m) {
      var adimlar = [{ hedef: null, baslik: m.ad + ' — genel bakış', metin: m.ad + ' (' + m.tur.toLocaleLowerCase('tr') + '). Fareyle ya da parmağınla döndür, iki parmakla yakınlaştır.', kaynakTur: 'genel' }];
      m.bolgeler.forEach(function (b) { adimlar.push({ hedef: b.id, baslik: b.ad, metin: BOLGE_ACIKLAMA[b.id] || b.ad + '.', kaynakTur: 'genel' }); });
      return kitaptanOzet('biyokimya', m.kavram).then(function (oz) {
        adimlar.push(oz ? { hedef: null, baslik: 'Kitapta: ' + m.ad, metin: oz.metin, kaynakTur: 'kitap', kaynak: oz.kaynak } : { hedef: null, baslik: 'Özet', metin: 'Kitapta bu molekül için ayrı bir paragraf bulunamadı.', kaynakTur: 'genel' });
        return adimlar;
      });
    }
    function aiTur(m) {
      U.AI.hazir().then(function (ok) {
        if (!ok) throw { code: 'not_granted' };
        lab.metin.innerHTML = ''; lab.metin.appendChild(el('div', { class: 'yukleniyor', text: 'AI tur yazıyor…' }));
        return kitaptanOzet('biyokimya', m.kavram).then(function (oz) {
          return Y.sample.json('Bir 3B molekül görüntüleyicisi için 4-6 adımlık Türkçe öğretici tur yaz. Molekül: ' + m.ad + '. YALNIZ şu bölge kimliklerini kullan (başka kimlik uydurma): ' + m.bolgeler.map(function (b) { return b.id + ' (' + b.ad + ')'; }).join(', ') +
            '. Genel bakış için hedef null. Her adım metni 1-2 cümle. Son adım işlev özeti olsun' + (oz ? ' ve şu kitap alıntısına dayansın: "' + oz.metin + '"' : '') + '. Yalnız JSON: [{"hedef":"id ya da null","baslik":"...","metin":"..."}]', { cache: false })
            .then(function (j) { var l = (Array.isArray(j) ? j : j.adimlar || []).map(function (a) { return { hedef: a.hedef ? String(a.hedef) : null, baslik: String(a.baslik || ''), metin: String(a.metin || ''), kaynakTur: 'ai' }; }); lab.baslat(l, 'AI turu'); });
        });
      }).catch(function (e) { lab.metin.innerHTML = ''; lab.metin.appendChild(el('p', { class: 'hata-metni', text: U.AI.hataMetni(e) })); });
    }
  }

  /* --- yönlendirme: #lab-molekul-<id> --- */

  /* --- kavram kartında "3B'de göster" --- */
  var eskiLab = U.labDugmesi;
  U.labDugmesi = function (kap, ad, kj) {
    if (eskiLab) eskiLab(kap, ad, kj);
    var q = katla(ad);
    molKatalog().then(function (k) {
      var m = k.molekuller.filter(function (x) { var a = katla(x.ad), kv = katla(x.kavram); return q === kv || a.indexOf(q) === 0 || q.indexOf(kv) === 0; })[0];
      if (m) kap.prepend(el('a', { class: 'dugme kucuk ana lab-dug', href: '#lab-molekul-' + m.id, onclick: function () { U.panelKapat(); } }, ['⬡ 3B\'de göster: ' + m.ad]));
    }).catch(function () {});
  };
  U.SEKMELER.push({ id: 'lab-molekul', ad: 'Molekül', ikon: '⬡' });
  U.sekmeleriCiz();
})();
