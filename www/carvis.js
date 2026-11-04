/* 1001 — Carvis: sesli asistan (yalnız cihaz sürümünde: APK ve iPhone ana ekran uygulaması).
   "Carvis" (ya da "Jarvis") → oturum açılır, tekrar "Carvis" → kapanır. Soru → önce kitapta ara, sayfayı aç,
   gerekirse balonda 3B molekül/kemik/kas sahnesi açıp ilgili parçayı işaretle; kitapta yoksa internetten (kaynaklı).
   Ses: Android'de yerel köprü (Vosk uyandırma + Android ses tanıma + TTS), tarayıcıda Web Speech API. */
(function () {
  'use strict';
  // Gömülü sahne (balondaki iframe): yalnız 3B sahne görünsün
  if (/[?&]gomulu\b/.test(location.search)) {
    document.documentElement.classList.add('gomulu');
    var st = document.createElement('style');
    st.textContent = 'html.gomulu .serit,html.gomulu .lab-yan,html.gomulu .lab-stiller,html.gomulu #carvisDug,html.gomulu .lab-ust,html.gomulu .lab-durum .yukleniyor~*{display:none!important}html.gomulu .lab-sayfa{display:block;height:100vh;max-width:none}html.gomulu .lab-sahne{height:100vh}html.gomulu body{overflow:hidden}';
    document.head.appendChild(st);
    return;
  }
  var U = window.Uygulama, A = window.KitapAyristir;
  if (!U) return;
  var el = U.el, $ = U.$, Y = U.Y, Durum = U.Durum, Kitaplik = U.Kitaplik, katla = A.katla;
  var K = window.AndroidKopru || null;

  /* ---------------- Carvis sesi: ZipVoice (internetsiz, İngilizce) + Türkçe altyazı ---------------- */
  var Zv = (function () {
    var onbellek = {}, z = { bekle: {}, sonHata: '' };
    function ayar(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) {} return null; }
    z.durum = function () { try { return JSON.parse(K && K.zvDurum ? K.zvDurum() : '{}'); } catch (e) { return {}; } };
    z.acik = function () { if (!K || !K.zvKonus || ayar('zv_acik') !== '1') return false; var d = z.durum(); return !!d.model && !!d.ornek && !d.cokus; };
    z.efekt = function () { return 0; };
    z.sayi = function (k, vars) { var v = parseFloat(ayar(k)); return isNaN(v) ? vars : v; };
    z.uygula = function () { try { if (K && K.zvAyar) K.zvAyar(0, 0, 0, 8); } catch (e) {} };
    z.ayar = ayar;
    // Türkçe cevabı Carvis'in İngilizcesine çevirir (önbellekli); çeviri olmazsa metni olduğu gibi döndürür
    z.ingilizce = function (m) {
      m = String(m || '').trim();
      if (!m) return Promise.resolve(m);
      if (!/[çğıöşüÇĞİÖŞÜ]/.test(m) && /\b(the|and|is|are|you|of|to)\b/i.test(m)) return Promise.resolve(m);
      if (onbellek[m]) return Promise.resolve(onbellek[m]);
      var is = Y.sample('Translate the following Turkish text into natural SPOKEN English, as C.A.R.V.I.S., a calm, witty British AI assistant talking to a medical student. Keep every fact, number and medical term exact (use standard English medical terminology). Keep it about the same length. Output ONLY the English text, no quotes, no notes.\n\nTEXT:\n' + m.slice(0, 3000), { hafif: true })
        .then(function (r) { var t = String(r && r.text || '').trim().replace(/^["“]|["”]$/g, ''); if (t) { onbellek[m] = t; return t; } return m; });
      return Promise.race([is, new Promise(function (ok) { setTimeout(function () { ok(null); }, 12000); })]).then(function (t) { return t || m; }, function () { return m; });
    };
    window.zvBitti = function (id, h) { var f = z.bekle[id]; delete z.bekle[id]; if (f) f(h || null); };
    window.zvDurum = function () { if (z.ciz) try { z.ciz(); } catch (e) {} };
    return z;
  })();

  /* ---------------- ses katmanı ---------------- */
  var Ses = (function () {
    var bekleyenKonus = {}, sayac = 0, dinleSoz = null, hiz = 1;
    var SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    var api = {
      yerel: !!K,
      get destek() { return !!K || !!window.__carvisSahteSes || (!!SR && 'speechSynthesis' in window); },
      hiz: function (h) { hiz = h; },
      sonMetin: '', sonBitis: 0,
      konus: function (metin) {
        api.sonMetin = metin || ''; api.sonBitis = Date.now() + 60000;
        var bitir = function () { api.sonBitis = Date.now(); };
        if (window.__carvisSahteSes) return window.__carvisSahteSes.konus(metin).then(function (x) { bitir(); return x; }); // yalnız testler
        return new Promise(function (ok0) { var ok = function () { bitir(); ok0(); };
          if (!metin) return ok();
          if (K && Zv.acik()) {
            var zid = 'z' + (++sayac); bekleyenKonus[zid] = ok;
            Zv.ingilizce(metin).then(function (en) {
              if (!bekleyenKonus[zid]) return; // bu arada susturuldu
              var izS = '', izT = Date.now();
              var zmn = setInterval(function () {
                if (!Zv.bekle[zid]) return clearInterval(zmn);
                var d = Zv.durum(), im = [d.asama, d.calinan, d.sonUretimMs].join('|');
                if (im !== izS) { izS = im; izT = Date.now(); return; }
                if (Date.now() - izT > (d.hazir ? 30000 : 90000)) { clearInterval(zmn); try { K.zvSus(); } catch (e) {} Zv.bekle[zid]('takıldı (' + (d.asama || '?') + ')'); }
              }, 2000);
              Zv.bekle[zid] = function (h) { clearInterval(zmn); if (!h) { delete bekleyenKonus[zid]; return ok(); } Zv.sonHata = h; var id2 = 'k' + (++sayac); bekleyenKonus[id2] = ok; delete bekleyenKonus[zid]; K.konus(metin, id2, String(hiz)); };
              Zv.uygula(); K.zvKonus(zid, en, hiz, Zv.efekt());
            });
            return;
          }
          if (K) { var id = 'k' + (++sayac); bekleyenKonus[id] = ok; K.konus(metin, id, String(hiz)); return; }
          try { speechSynthesis.cancel(); var u = new SpeechSynthesisUtterance(metin); u.lang = 'tr-TR'; u.rate = hiz; u.onend = u.onerror = function () { ok(); }; u.onboundary = function (e) { if (window.Holo) window.Holo.kelime(e.charIndex, e.charIndex + (e.charLength || 1)); }; speechSynthesis.speak(u); } catch (e) { ok(); }
        });
      },
      sus: function () { if (K && K.zvSus) try { K.zvSus(); } catch (e) {} if (K) K.sus(); else try { speechSynthesis.cancel(); } catch (e) {} Object.keys(bekleyenKonus).forEach(function (k) { bekleyenKonus[k](); delete bekleyenKonus[k]; }); },
      // Tek cümle dinler: metin ya da '' (sessizlik/anlaşılmadı) döner
      dinle: function () {
        if (window.__carvisSahteSes) return window.__carvisSahteSes.dinle();
        return new Promise(function (ok, red) {
          if (K) {
            // Ses tanıma bazen hiç cevap vermiyor (ör. servis yok): 15 sn sonra sessizlik say
            var bu = { ok: function (t) { clearTimeout(zm); ok(t); }, red: function (e) { clearTimeout(zm); red(e); } };
            var zm = setTimeout(function () { if (dinleSoz === bu) { dinleSoz = null; K.dinlemeyiKes(); ok(''); } }, 15000);
            dinleSoz = bu;
            try { if (K.baglam) K.baglam((typeof Durum !== 'undefined' && Durum.aktifKitap ? Durum.aktifKitap.baslik + (Durum.aktifBolum ? ' — ' + Durum.aktifBolum.baslik : '') : '')); } catch (e) {}
            K.dinle(); return;
          }
          if (!SR) return red(new Error('Bu tarayıcıda ses tanıma yok'));
          var r = new SR(); r.lang = 'tr-TR'; r.interimResults = false; r.maxAlternatives = 1;
          var bitti = false;
          r.onresult = function (e) { bitti = true; ok(e.results[0][0].transcript || ''); };
          r.onerror = function (e) { bitti = true; if (e.error === 'no-speech' || e.error === 'aborted') ok(''); else red(new Error(e.error)); };
          r.onend = function () { if (!bitti) ok(''); };
          try { r.start(); } catch (e) { red(e); }
          api._iptal = function () { try { r.abort(); } catch (e) {} };
        });
      },
      dinlemeyiKes: function () { if (K) K.dinlemeyiKes(); else if (api._iptal) api._iptal(); },
      uyandirma: function (acik) { if (K) K.uyandirma(!!acik); else webUyandirma(acik); }
    };
    // Android'den geri çağrılar
    window.carvisYerel = {
      konusmaBitti: function (id) { var f = bekleyenKonus[id]; delete bekleyenKonus[id]; if (f) f(); },
      durumYaz: function (t) { try { durum(t); } catch (e) {} },
      kelime: function (bas, son) { if (window.Holo) window.Holo.kelime(bas, son); },
      // Söz kesme sinyali hoparlörden gelen kendi sesiyle tetikleniyordu (Carvis kendini susturuyordu): yok sayılır; kesmek için 🎙'a dokunulur.
      dinleKomutu: function () {},
      alternatifler: function (l) { Ses.alternatifler = l || []; },
      duydu: function (metin) { var d = dinleSoz; dinleSoz = null; if (d) d.ok(metin || ''); },
      dinlemeHata: function (kod) { var d = dinleSoz; dinleSoz = null; Ses.sonHata = kod; if (d) { if (/no_match|speech_timeout|anlasilmadi|stt_yok|iptal/.test(kod)) d.ok(''); else d.red(new Error(kod)); } },
      uyan: function (arkaPlan) { Carvis.uyan(!!arkaPlan); }
    };
    // Tarayıcıda uyandırma: sürekli ses tanıma, "carvis/jarvis" geçince uyan (Android Chrome'da çalışır; iPhone Safari'de sınırlı)
    var webR = null;
    function webUyandirma(acik) {
      if (webR) { try { webR.onend = null; webR.abort(); } catch (e) {} webR = null; }
      if (!acik || !SR) return;
      webR = new SR(); webR.lang = 'tr-TR'; webR.continuous = true; webR.interimResults = true;
      webR.onresult = function (e) { for (var i = e.resultIndex; i < e.results.length; i++) if (UYANDIRMA.test(e.results[i][0].transcript)) { try { webR.abort(); } catch (x) {} Carvis.uyan(); return; } };
      webR.onend = function () { if (webR && !Carvis.acik) setTimeout(function () { try { webR.start(); } catch (e) {} }, 400); };
      try { webR.start(); } catch (e) {}
    }
    return api;
  })();
  var UYANDIRMA = /\b(c[aeâ]rv[iı][sz]|j[aâe]rv[iı][sz]|carvis|jarvis)\b/i;
  var KAPAT = /^\s*(c[aeâ]rv[iı][sz]|j[aâe]rv[iı][sz]|servis|görüşürüz|kapat|kapan)\s*[.!]?\s*$/i;

  /* ---------------- arayüz: baloncuk ---------------- */
  var css = document.createElement('style');
  css.textContent = [
    '#carvisDug{position:fixed;right:16px;bottom:calc(16px + env(safe-area-inset-bottom,0px));z-index:60;width:56px;height:56px;border-radius:50%;border:1px solid var(--vurgu);background:rgba(6,12,17,.92);color:var(--vurgu);font-size:24px;box-shadow:0 0 18px rgba(79,224,255,.25)}',
    '#carvisDug.acik{background:var(--vurgu);color:#04121a;animation:cvNabiz 1.6s infinite}',
    '@keyframes cvNabiz{0%,100%{box-shadow:0 0 0 0 rgba(79,224,255,.5)}50%{box-shadow:0 0 0 12px rgba(79,224,255,0)}}',
    '.cv-balon{position:fixed;right:16px;bottom:calc(84px + env(safe-area-inset-bottom,0px));z-index:60;width:min(420px,calc(100vw - 32px));max-height:min(72vh,640px);display:flex;flex-direction:column;background:rgba(6,12,17,.97);border:1px solid var(--vurgu);border-radius:14px;box-shadow:0 10px 40px rgba(0,0,0,.6);overflow:hidden}',
    '.cv-balon[hidden]{display:none}',
    '.cv-ust{display:flex;align-items:center;gap:8px;padding:8px 10px;border-bottom:1px solid var(--cizgi)}',
    '.cv-ust b{font-family:var(--f-baslik);letter-spacing:.08em;color:var(--vurgu)}.cv-durum{flex:1;font-size:12px;color:var(--metin-sonuk)}',
    '.cv-sahne{height:240px;border-bottom:1px solid var(--cizgi);position:relative}.cv-sahne[hidden]{display:none}.cv-sahne iframe{width:100%;height:100%;border:0;background:#060c11}',
    '.cv-sahne .cv-sahne-ad{position:absolute;left:8px;top:6px;font-size:11px;color:var(--metin-sonuk);background:rgba(6,12,17,.8);padding:1px 6px;border-radius:4px}',
    '.cv-akis{overflow:auto;padding:10px;display:grid;gap:8px;font-size:14px}',
    '.cv-ben{justify-self:end;background:rgba(79,224,255,.12);border-radius:10px;padding:6px 10px;max-width:85%}',
    '.cv-o{border-left:2px solid var(--vurgu);padding-left:8px}.cv-o .cv-kaynak{font-size:12px;display:grid;gap:2px;margin-top:4px}',
    '.cv-etiket{display:inline-block;font-size:11px;border:1px solid var(--uyari);color:var(--uyari);border-radius:4px;padding:0 5px;margin-bottom:4px}',
    '.cv-alt{display:flex;gap:6px;padding:8px 10px;border-top:1px solid var(--cizgi)}.cv-alt input{flex:1;min-width:0;background:var(--zemin);border:1px solid var(--cizgi);border-radius:8px;color:var(--metin);padding:6px 8px;font:14px var(--f-govde)}'
  ].join('\n');
  document.head.appendChild(css);
  var dug = el('button', { id: 'carvisDug', type: 'button', title: 'Carvis (sesli asistan)', 'aria-label': 'Carvis sesli asistan' }, ['🎙']);
  var durumEl = el('span', { class: 'cv-durum', text: '' });
  var sahne = el('div', { class: 'cv-sahne', hidden: true });
  var akis = el('div', { class: 'cv-akis', 'aria-live': 'polite' });
  var yaziGir = el('input', { type: 'text', placeholder: 'Yaz ya da konuş…', 'aria-label': 'Carvis\'e yaz' });
  var uyandirmaDug = el('button', { class: 'dugme kucuk', type: 'button', 'aria-pressed': 'false', title: '"Carvis" deyince uyansın' }, ['👂 Uyandırma']);
  var balon = el('div', { class: 'cv-balon', hidden: true, role: 'dialog', 'aria-label': 'Carvis' }, [
    el('div', { class: 'cv-ust' }, [el('b', { text: 'CARVIS' }), durumEl, uyandirmaDug,
      el('button', { class: 'ikon-dugme', type: 'button', 'aria-label': 'Carvis ayarları', title: 'Kişiselleştir', onclick: function () { ayarPaneli(); } }, ['⚙']),
      el('button', { class: 'ikon-dugme', type: 'button', 'aria-label': 'Kapat', onclick: function () { Carvis.kapat(true); balon.hidden = true; } }, ['✕'])]),
    sahne, akis,
    el('form', { class: 'cv-alt', onsubmit: function (e) { e.preventDefault(); var t = yaziGir.value.trim(); if (!t) return; yaziGir.value = ''; Carvis.soru(t, true); } }, [yaziGir,
      el('button', { class: 'dugme kucuk', type: 'button', title: 'Konuş', onclick: function () { Carvis.ac(); } }, ['🎙']),
      el('button', { class: 'dugme kucuk ana', type: 'submit' }, ['Sor'])])
  ]);
  document.body.appendChild(balon); document.body.appendChild(dug);
  dug.addEventListener('click', function () { if (balon.hidden) { balon.hidden = false; Carvis.ac(); } else if (Carvis.acik && Carvis.konusuyor) Ses.sus(); else if (Carvis.acik) Carvis.kapat(true); else Carvis.ac(); });
  var uyandirmaAcik = false;
  // APK'da (yerel ses) varsayılan açık; kullanıcı kapatırsa '0' saklanır
  try { var _u = localStorage.getItem('carvis_uyandirma'); uyandirmaAcik = _u === null ? !!Ses.yerel : _u === '1'; } catch (e) {}
  function uyandirmaUygula() { uyandirmaDug.setAttribute('aria-pressed', String(uyandirmaAcik)); try { localStorage.setItem('carvis_uyandirma', uyandirmaAcik ? '1' : '0'); } catch (e) {} if (!Carvis.acik) Ses.uyandirma(uyandirmaAcik); }
  uyandirmaDug.addEventListener('click', function () { uyandirmaAcik = !uyandirmaAcik; uyandirmaUygula(); U.toast(uyandirmaAcik ? '"Carvis" deyince uyanacak.' : 'Uyandırma kapalı; 🎙 düğmesini kullan.'); });
  var H = window.Holo || null;
  function durum(t) {
    durumEl.textContent = t || '';
    if (H) H.durum(/Dinliyor/i.test(t) ? 'dinliyor' : /Düşünüyor|Kota/i.test(t) ? 'dusunuyor' : /Konuşuyor/i.test(t) ? 'konusuyor' : 'bos');
  }
  if (H) H.onKapat = function () { if (Carvis.acik) Carvis.kapat(true); };
  function mesaj(sinif, html) { var d = el('div', { class: sinif, html: html }); akis.appendChild(d); akis.scrollTop = akis.scrollHeight; return d; }
  function sesMetni(md) { return U.duz(U.mdHtml(String(md).replace(/\[kaynak:[^\]]*\]/g, ''))).replace(/\*\*/g, '').replace(/\s+/g, ' ').trim(); }

  /* ---------------- gömülü 3B sahne ---------------- */
  var Sahne = { hash: null };
  function katalogAl(yol) { Sahne.k = Sahne.k || {}; return Sahne.k[yol] || (Sahne.k[yol] = fetch(yol).then(function (r) { return r.json(); })); }
  function sahneAc(hash, ad) {
    var panelde = !!(H && H.acikMi());
    var kap = panelde ? (Sahne.iframe && Sahne.hash === hash && H.detayAcikMi() && document.body.contains(Sahne.iframe) ? Sahne.iframe.parentNode : H.detayAc(ad)) : sahne;
    if (!panelde) sahne.hidden = false;
    if (Sahne.hash === hash && Sahne.iframe && Sahne.iframe.parentNode === kap) return Sahne.hazir;
    if (!panelde) sahne.innerHTML = ''; else if (Sahne.iframe && Sahne.iframe.parentNode === sahne) { sahne.innerHTML = ''; sahne.hidden = true; }
    var sahneKabi = kap;
    var f = el('iframe', { src: 'index.html?gomulu#' + hash, title: '3B sahne: ' + ad, allow: 'fullscreen' });
    sahneKabi.appendChild(f); if (!panelde) sahneKabi.appendChild(el('span', { class: 'cv-sahne-ad', text: ad }));
    Sahne.hash = hash; Sahne.iframe = f;
    Sahne.hazir = new Promise(function (ok, red) {
      var t0 = Date.now();
      (function bekle() {
        var w = f.contentWindow, lab = w && w.__aktifLab;
        var n = 0; try { n = lab ? lab.adaptor.katalog().length : 0; } catch (e) {}
        if (n) return setTimeout(function () { ok(lab); }, 600);
        if (Date.now() - t0 > 90000) return red(new Error('3B sahne yüklenemedi'));
        setTimeout(bekle, 400);
      })();
    });
    return Sahne.hazir;
  }
  // Kitabın çıkmış sorularında terimi arar (önce tam ifade, sonra en ayırt edici kelime)
  function sorulariBul(terim, kitap) {
    kitap = kitap || 'anatomi';
    return katalogAl('kitaplar/' + kitap + '/sorular.json').then(function (l) {
      l = Array.isArray(l) ? l : (l.sorular || []);
      var q = katla(terim), kel = q.split(' ').filter(function (w) { return w.length > 4; }).sort(function (a, b) { return b.length - a.length; })[0] || q;
      var puanli = [];
      l.forEach(function (soru) {
        (soru.varyantlar || []).forEach(function (v) {
          var govde = katla(U.duz ? U.duz(v.govde || '') : (v.govde || '')), tum = katla(JSON.stringify(v));
          var p = govde.indexOf(q) >= 0 ? 3 : govde.indexOf(kel) >= 0 ? 2 : tum.indexOf(kel) >= 0 ? 1 : 0;
          if (p) puanli.push({ p: p + (soru.onem && soru.onem.yildiz ? soru.onem.yildiz * 0.1 : 0), soru: soru, v: v });
        });
      });
      puanli.sort(function (a, b) { return b.p - a.p; });
      var gorulen = {};
      return puanli.filter(function (x) { if (gorulen[x.soru.id]) return false; gorulen[x.soru.id] = 1; return true; }).slice(0, 3).map(function (x) {
        var sik = (x.v.siklar || []).filter(function (k) { return k.h === x.v.cevap; })[0];
        return { kitap: kitap, blok: x.soru.blok, bolum: x.soru.bolum, sinav: x.v.sinav, govde: x.v.govde, siklar: x.v.siklar || [], cevap: x.v.cevap + (sik ? ') ' + sik.m : '') };
      });
    }).catch(function () { return []; });
  }
  function soruBolumleri(sorular) {
    sorular.forEach(function (q) {
      var sira = +(String(q.bolum || '').split('-')[1] || 0);
      H.detayBolum({ etiket: 'SINAV SORUSU', baslik: q.sinav || 'Çıkmış soru',
        html: '<p>' + q.govde + '</p><ol type="A">' + q.siklar.map(function (k) { return '<li>' + k.m + '</li>'; }).join('') + '</ol><p class="h-cevap">Cevap: ' + U.esc(q.cevap) + '</p>',
        eylem: function () { Durum.vurguBlok = q.blok; U.git(U.okuHash(q.kitap, sira)); } });
    });
  }
  function eslesen(liste, ad, alanlar) {
    var q = katla(ad); if (!q) return [];
    return liste.map(function (x) { var t = katla(alanlar.map(function (a) { return x[a] || ''; }).join(' ')); var p = t === q ? 3 : t.indexOf(q) >= 0 ? 2 : q.split(' ').every(function (w) { return t.indexOf(w) >= 0; }) ? 1 : 0; return { x: x, p: p }; })
      .filter(function (o) { return o.p; }).sort(function (a, b) { return b.p - a.p; }).map(function (o) { return o.x; });
  }
  function gorselAc(g) {
    var tur = String(g.tur || ''), ad = String(g.ad || '');
    if (tur === 'molekul') return katalogAl('lab/molekul/katalog.json').then(function (k) {
      var m = eslesen(k.molekuller, ad, ['id', 'ad', 'kavram'])[0];
      if (!m) return 'Molekül katalogda yok. Var olanlar: ' + k.molekuller.map(function (x) { return x.id; }).join(', ');
      return sahneAc('lab-molekul-' + m.id, m.ad).then(function (lab) {
        if (H && H.detayAcikMi()) {
          if (g.bilgi) H.detayBolum({ etiket: 'AÇIKLAMA', metin: String(g.bilgi) });
          if (g.mantik) H.detayBolum({ etiket: 'MANTIKSAL ÇERÇEVESİ', metin: String(g.mantik) });
          if (g.evrim) H.detayBolum({ etiket: 'EVRİMSEL NEDENİ', metin: String(g.evrim) });
          sorulariBul(m.ad, 'biyokimya').then(soruBolumleri);
        }
        return { acildi: m.ad, bolgeler: lab.adaptor.katalog().map(function (b) { return b.ad; }) };
      });
    });
    if (tur === 'kemik') return katalogAl('lab/anatomi/katalog.json').then(function (k) {
      var l = eslesen(k.parcalar, ad, ['tr', 'la', 'en']); var p = l[0];
      if (!p) return 'Kemik bulunamadı. İngilizce ya da Latince adla dene (ör. femur, os sacrum).';
      return sahneAc('lab-anatomi-' + p.id, p.tr).then(function (lab) {
        lab.adaptor.goster(p.id); lab.adaptor.kamera(p.id);
        var cevap = { acildi: p.tr + ' (' + p.la + ')', ad_dogrulama: p.dogrulama, digerleri: l.slice(1, 6).map(function (x) { return x.tr; }) };
        // Kemik üzerindeki işaret aynı çağrıda: titreşen odak + çubuklu bilgi kartı (ayrı tur/istek harcamaz)
        if (!g.isaret && H && H.detayAcikMi()) {
          if (g.bilgi) H.detayBolum({ etiket: 'AÇIKLAMA', metin: String(g.bilgi) });
          if (g.mantik) H.detayBolum({ etiket: 'MANTIKSAL ÇERÇEVESİ', metin: String(g.mantik) });
          if (g.evrim) H.detayBolum({ etiket: 'EVRİMSEL NEDENİ', metin: String(g.evrim) });
          sorulariBul(p.la.split(' (')[0], 'anatomi').then(soruBolumleri);
        }
        if (g.isaret && lab.adaptor.odak) {
          durum('İşaret aranıyor…');
          return lab.adaptor.odak(p.id, String(g.isaret).trim(), g.bilgi ? String(g.bilgi) : '').then(function (x) {
            cevap.isaretlendi = x.ad + (x.durum === 'onayli' || x.durum === 'derlendi' ? '' : ' (konum yapay zekâ ile bulundu, yaklaşık)');
            if (H && H.detayAcikMi()) {
              H.detayBaslik(x.ad + ' · ' + p.la);
              if (g.bilgi) H.detayBolum({ etiket: 'AÇIKLAMA', metin: String(g.bilgi) });
              if (g.mantik) H.detayBolum({ etiket: 'MANTIKSAL ÇERÇEVESİ', metin: String(g.mantik) });
              if (g.evrim) H.detayBolum({ etiket: 'EVRİMSEL NEDENİ', metin: String(g.evrim) });
              return sorulariBul(x.ad, 'anatomi').then(function (l) { soruBolumleri(l); cevap.cikmis_soru_sayisi = l.length; return cevap; });
            }
            return cevap;
          }, function (e) { cevap.isaret_hatasi = String(e && e.message || e); return cevap; });
        }
        return cevap; });
    });
    if (tur === 'kas') return katalogAl('lab/hareket/hareket.json').then(function (h) {
      var bolge = null, kas = null;
      ['ust', 'alt'].forEach(function (b) { if (kas) return; var l = eslesen(h.sahneler[b].kaslar, ad, ['la', 'en']); if (l.length) { kas = l[0]; bolge = b; } });
      if (!kas) return 'Kas bulunamadı (yalnız sağ üst ve alt ekstremite kasları var). Latince adla dene.';
      return sahneAc('lab-eklem-' + bolge, kas.la).then(function (lab) { lab.adaptor.goster(kas.rol); lab.adaptor.kamera(kas.rol); return { acildi: kas.la, kitapta_geciyor: !!kas.kitapta }; });
    });
    return Promise.resolve('tur: molekul | kemik | kas olmalı');
  }
  function sahneIsaretle(g) {
    if (!Sahne.hazir) return Promise.resolve('Önce gorsel_ac ile bir sahne aç.');
    if (!g.parca && g.etiket) g.parca = g.etiket; // model bazen adı etikete koyuyor
    var ISARET = /^(processus|tuberculum|tuberositas|caput|collum|corpus|condylus|epicondylus|trochanter|fossa|foramen|incisura|sulcus|facies|crista|spina|linea|margo|angulus|malleolus|fovea|tuber|eminentia|acromion|olecranon|capitulum|trochlea|cavitas|acetabulum|ramus|arcus|lamina|pediculus|dens|apex|basis|cornu|protuberantia|meatus|canalis|hamulus|lingula|glenoid|coracoid)/i;
    return Sahne.hazir.then(function (lab) {
      // Kemik üzerindeki ince işaret: noktayı bul (önbellek ya da yapay zekâ görüsü), titreşen odak + çubuklu bilgi kartı
      var secili = lab.adaptor.secili ? lab.adaptor.secili() : null;
      if (secili && lab.adaptor.odak && ISARET.test(String(g.parca || '').trim())) {
        durum('İşaret aranıyor…');
        return lab.adaptor.odak(secili, String(g.parca).trim(), g.bilgi ? String(g.bilgi) : '').then(function (x) {
          return 'İşaretlendi: ' + x.ad + (x.durum === 'onayli' || x.durum === 'derlendi' ? '' : ' (konum yapay zekâ ile bulundu, yaklaşık)');
        }, function (e) { return 'İşaret bulunamadı: ' + (e && e.message || e) + '. Kemiğin tamamı gösteriliyor.'; });
      }
      var l = eslesen(lab.adaptor.katalog(), String(g.parca || ''), ['ad', 'ara', 'id']);
      if (!l.length) return 'Sahnede bulunamadı. Var olan parçalar: ' + lab.adaptor.katalog().slice(0, 40).map(function (x) { return x.ad; }).join(', ');
      var k = l[0];
      lab.duraklat && lab.duraklat();
      lab.adaptor.goster(k.id); lab.adaptor.kamera(k.id); if (lab.adaptor.isaret) lab.adaptor.isaret(k.id, g.etiket ? String(g.etiket) : k.ad);
      return 'İşaretlendi: ' + k.ad;
    });
  }

  /* ---------------- araçlar ---------------- */
  function sayfaAc(g) {
    var m = /\[?kaynak:([^|\]]+)\|(\d+)\|([^|\]]*)\|([^\]]*)\]?/.exec(String(g.kaynak || ''));
    if (!m) return 'kaynak alanını kitapta_ara sonucundan aynen ver.';
    if (m[3]) Durum.vurguBlok = m[3];
    U.git(U.okuHash(m[1], +m[2]));
    return 'Açıldı: ' + m[4];
  }
  function kartlaSar(t) {
    if (!H) return t;
    var ex = t.execute;
    t.execute = function (g) {
      if (window.__carvisKayit) try { console.log('ARAÇ ' + t.name + ' ' + JSON.stringify(g).slice(0, 160)); } catch (e) {}
      return Promise.resolve(ex(g)).then(function (v) {
        if (window.__carvisKayit) try { console.log('SONUÇ ' + t.name + ' ' + JSON.stringify(v).slice(0, 200)); } catch (e) {}
        try {
          if (t.name === 'kitapta_ara' && Array.isArray(v)) v.slice(0, 4).forEach(function (x) {
            var mt = katla(x.konum + ' ' + x.metin);
            H.kart({ tur: /cikmis soru|soru/.test(mt) ? 'sinav' : 'sayfa', etiket: /evrim/.test(mt) ? 'EVRİMSEL NEDENİ' : /cikmis soru/.test(mt) ? 'SINAV SORUSU' : /neden|problem|mantik|cozum/.test(mt) ? 'MANTIKSAL ÇERÇEVESİ' : 'KİTAPTAN', anahtar: x.kaynak, baslik: x.konum, alt: x.metin, eylem: function () { sayfaAc({ kaynak: x.kaynak }); } });
          });
          if (t.name === 'gorsel_ac' && !/bulunamad|yok/i.test(String(v))) { var h = Sahne.hash; H.kart({ tur: 'sahne', etiket: '3 BOYUTLU YAPISI', anahtar: 'sahne|' + h, baslik: '3B: ' + g.ad, alt: 'Sahneyi tam ekran aç', eylem: function () { if (h) U.git(h); } }); }
          if (t.name === 'zamanim_yok' && /ÖZET:/.test(String(v))) { var hh = location.hash; H.kart({ tur: 'ozet', etiket: 'ÖZET', anahtar: 'ozet|' + hh, baslik: 'Zamanım yok özeti', alt: String(v).split('ÖZET:')[1].trim().slice(0, 160), eylem: function () { U.git(hh); setTimeout(function () { U.zamanimYok && U.zamanimYok(); }, 400); } }); }
          if (t.name === 'makale_ara' && Array.isArray(v)) v.slice(0, 4).forEach(function (m) {
            H.kart({ tur: 'makale', etiket: 'MAKALE', anahtar: m.id, baslik: m.baslik, alt: (m.dergi || '') + ' ' + (m.yil || '') + (m.acik ? ' · açık erişim' : ''), eylem: function () {
              var govde = U.panelAc('📰 ' + m.baslik, (m.dergi || '') + ' ' + (m.yil || '')); var kutu = el('div', { class: 'yp-cevap' });
              govde.appendChild(el('p', {}, [el('a', { href: m.link, target: '_blank', rel: 'noopener', text: m.acik ? '📄 Tam metni aç' : '↗ Makaleyi aç' })])); govde.appendChild(kutu);
              if (U.makaleZamanimYok) U.makaleZamanimYok(m, kutu);
            } });
          });
          if (t.name === 'ilgi_ekle' && v && v.eklendi) H.kart({ tur: 'makale', etiket: 'İLGİ ALANI', anahtar: 'ilgi|' + v.eklendi, baslik: v.eklendi + ' takip ediliyor', alt: (v.bulunan || 0) + ' makale bulundu · ' + (v.ilk || []).slice(0, 1).join(''), eylem: function () { U.git('makaleler'); } });
          if (t.name === 'eksiklerim' && v && v.zayif) v.zayif.slice(0, 4).forEach(function (z) {
            H.kart({ tur: 'sinav', etiket: 'EKSİK', anahtar: 'eksik|' + z.kitap + '|' + z.sira, baslik: (z.kitapAd || z.kitap).replace(/^1001\s*/, '') + ' · ' + (z.bolum || ''), alt: z.bilmiyor + ' bilmiyorum · ' + z.yanlis + ' yanlış' + (z.konular.length ? ' · ' + z.konular.slice(0, 2).join(', ') : ''), eylem: function () { U.git(U.okuHash(z.kitap, z.sira || 0)); } });
          });
          if (t.name === 'plan_oku') H.kart({ tur: 'plan', etiket: 'PLAN', anahtar: 'plan', baslik: 'Bugünkü plan', alt: String(v).slice(0, 160), eylem: function () { U.git('plan'); } });
          if (t.name === 'internet_ara') (Carvis._kaynaklar || []).slice(0, 3).forEach(function (k) { H.kart({ tur: 'internet', etiket: 'İNTERNETTEN', anahtar: k.url, baslik: k.baslik || k.url, alt: k.url, eylem: function () { window.open(k.url, '_blank'); } }); });
        } catch (e) {}
        return v;
      });
    };
    return t;
  }
  var GORSEL_ARAC = /^(sayfa_ac|gorsel_ac|sahne_isaretle|zamanim_yok|ders_baslat|test_hazirla)$/;
  function oneGetirSar(t) {
    if (!GORSEL_ARAC.test(t.name)) return t;
    var ex = t.execute;
    t.execute = function (g) { try { if (K && K.oneGetir && K.onPlandaMi && !K.onPlandaMi()) K.oneGetir(); } catch (e) {} return ex(g); };
    return t;
  }
  function ekranMetni() {
    var rl = document.querySelector('.rl'), kok = rl || document.querySelector('#ana'); if (!kok) return { sayfa: location.hash || 'ana' };
    var ust = (window.innerHeight || 800), parca = [], top = 0;
    // yalnız görünür alandaki metin (aşağıda kalan uzun sayfa gönderilmez)
    var yuruyen = document.createTreeWalker(kok, NodeFilter.SHOW_TEXT, null), n;
    while ((n = yuruyen.nextNode()) && top < 2400) {
      var m = n.nodeValue.replace(/\s+/g, ' ').trim(); if (m.length < 2) continue;
      var e = n.parentNode; if (!e || !e.getBoundingClientRect) continue;
      var r = e.getBoundingClientRect(); if (r.bottom < 0 || r.top > ust || r.width === 0) continue;
      var st = getComputedStyle(e); if (st.visibility === 'hidden' || st.display === 'none' || +st.opacity === 0) continue;
      parca.push(m); top += m.length + 1;
    }
    var h1 = kok.querySelector('h1, .rl-etiket');
    return { sayfa: location.hash || 'ana', baslik: h1 ? h1.textContent.trim().slice(0, 120) : '', gorunen_metin: parca.join(' ').slice(0, 2400) };
  }
  /* Kota tasarrufu (kullanıcı, 2026-11-03: "Carvis cevap verirken kotası çok hızlı doluyor"): her istekte 35+ araç tanımı gidiyordu
     (her tur yeniden). Artık sorunun konusuna göre yalnız ilgili araç grupları gönderilir; tur sınırı ve geçmiş kısaldı. */
  var GRUP = {
    cekirdek: /^(kitapta_ara|bolum_getir|kavram_getir|sayfa_ac|ekrana_bak|internet_ara)$/,
    gorsel: /^(gorsel_ac|sahne_isaretle|isaret_goster|kamera_yaklas|katalog_ara|parca_goster|tur_baslat|animasyon_oynat|hareket_yap)$/,
    calisma: /^(test_hazirla|zamanim_yok|ders_baslat|hafiza_sarayi|cikmis_tahmin|calisma_onerisi|eksiklerim|plan_oku|pomodoro|deftere_ekle|haftalik_rapor)$/,
    makale: /^(makale_ara|ilgi_ekle)$/,
    profil: /^(hatirla|unut|profil_ayarla)$/,
    eklenti: /^ozellik_ekle$/
  };
  function aracSec(t, tum) {
    var al = { cekirdek: 1 };
    if (/molekül|yapı|kemik|kas\b|kası|göster|3 ?b|3d|üç boyut|anatomi|halka|processus|tuberculum|fossa|foramen|animasyon|hareket|görsel|şekil|resim/i.test(t)) al.gorsel = 1;
    if (/test|soru|quiz|zamanım yok|özet|ders|anlat|saray|tahmin|çıka|çıkmış|ne çalış|plan|program|eksik|pomodoro|defter|not al|rapor|hafta|bugün|sınav|komite/i.test(t)) al.calisma = 1;
    if (/makale|araştırma|yayın|paper|literatür|ilgi alan/i.test(t)) al.makale = 1;
    if (/hatırla|unut|adım|bana .* de\b|hitap|profil|tonun|resmi konuş|samimi/i.test(t)) al.profil = 1;
    if (/eklenti|özellik (ekle|yaz)|kendine|kodla|yeni (bir )?(ekran|özellik|komut)/i.test(t)) al.eklenti = 1;
    var bilinen = function (a) { for (var g in GRUP) if (GRUP[g].test(a.name)) return true; return false; };
    return tum.filter(function (a) { for (var g in al) if (GRUP[g].test(a.name)) return true; return !bilinen(a); });
  }
  function araclar() {
    var l = (U.sohbetAraclari ? U.sohbetAraclari() : []).concat(U.makaleAraclari ? U.makaleAraclari() : []);
    var adlar = {}; l.forEach(function (t) { adlar[t.name] = 1; });
    // Sohbet'in ek araçları (makale_bul hariç: makale_ara zaten var). test_hazirla sesli oturumda testi panelde açar.
    (U.sohbetEkAraclari ? U.sohbetEkAraclari() : []).forEach(function (t) {
      if (adlar[t.name] || t.name === 'makale_bul' || t.name === 'eksiklerim') return;
      if (t.name === 'test_hazirla') { t.description = 'Kullanıcı test/soru/quiz isterse: kitaptan 5 şıklı interaktif test hazırlar ve ekranda panelde açar. Sen yalnız "Testin ekranda, kaç soru" gibi tek cümle söyle.'; t.execute = function (g) { return U.testPanel(g).then(function (x) { return x ? { ekranda: true, baslik: x.baslik, soru_sayisi: x.sorular.length } : 'Test hazırlanamadı.'; }); }; }
      l.push(t);
    });
    l = l.concat(hafizaAraclari());
    // kullanıcı, 2026-11-03: "Carvis ekranımı görebilsin" — gerektiğinde ekrandaki metni okur (her istekte göndermek kota yerdi)
    l.push({ name: 'ekrana_bak', description: 'Kullanıcının şu an ekranda gördüğünü döndürür (sayfa, başlık, görünen metin). "bu", "şu", "ekrandaki", "burada", "bunu açıkla" gibi ifadelerde önce bunu çağır.',
      inputSchema: { type: 'object', properties: {} }, execute: function () { var d = Carvis._disEkran; return (d && Date.now() - d.t < 180000 ? 'KULLANICININ PAYLAŞTIĞI DIŞ EKRAN (' + (d.uygulama || d.paket) + '):\n' + String(d.metin || '').slice(0, 3000) + '\n\n--- CARVIS EKRANI ---\n' : '') + ekranMetni(); } });
    // Eklentiler: Carvis kendi kodunu yazar (kullanıcı onayıyla) + eklentilerin tanımladığı araçlar
    if (U.eklentiAraclari) U.eklentiAraclari().forEach(function (t) { if (t && t.name && t.execute) l.push(t); });
    if (U.eklentiYazdir) l.push({ name: 'ozellik_ekle', description: 'Kullanıcı uygulamaya YENİ bir özellik/ekran/komut istediğinde ("şunu yapan bir şey ekle", "kendine şu özelliği yaz") eklenti yazdırır: Eklentiler sayfası açılır, yapay zekâ kodu yazar, kullanıcı onaylayınca eklenir. Sen kısaca "yazıyorum, onaylarsan eklenecek" de.',
      inputSchema: { type: 'object', properties: { istek: { type: 'string', description: 'kullanıcının istediği özellik, ayrıntılı' } }, required: ['istek'] }, execute: function (g) { return U.eklentiYazdir(String(g.istek || '')); } });
    l = l.filter(function (t) { return !/^(hareket_yap|animasyon_oynat)$/.test(t.name); }); // Hareket arşivde
    return l.concat([
      { name: 'sayfa_ac', description: 'Kitapta bulunan yeri ekranda açar ve cümleyi vurgular. kaynak: kitapta_ara sonucundaki "kaynak" alanı (aynen).',
        inputSchema: { type: 'object', properties: { kaynak: { type: 'string' } }, required: ['kaynak'] }, execute: sayfaAc },
      { name: 'gorsel_ac', description: 'Balonda 3B sahne açar. tur "molekul" (biyokimya molekülleri: glukoz, histidin, ATP, hemoglobin, DNA...), "kemik" (iskelet, ör. femur, scapula) ya da "kas" (sağ üst/alt ekstremite kasları, Latince ad). Molekülde dönen "bolgeler" listesindeki parçaları sahne_isaretle ile işaretleyebilirsin.',
        inputSchema: { type: 'object', properties: { tur: { type: 'string', enum: ['molekul', 'kemik', 'kas'] }, ad: { type: 'string' }, isaret: { type: 'string', description: 'tur=kemik iken kemik üzerindeki anatomik işaretin Latince adı (ör. processus coracoideus); verilirse o nokta titreşen odakla gösterilir' }, bilgi: { type: 'string', description: 'isaret için kart metni: oraya tutunan kaslar/bağlar ve işlevi (kitaptan, en fazla 25 kelime)' }, mantik: { type: 'string', description: 'MANTIKSAL ÇERÇEVESİ kutusu: yapı neden bu biçimde/bu yerde, işlevle ilişkisi (en fazla 30 kelime)' }, evrim: { type: 'string', description: 'EVRİMSEL NEDENİ kutusu: bu yapının evrimsel kökeni/avantajı (en fazla 30 kelime; emin değilsen boş bırak)' } }, required: ['tur', 'ad'] }, execute: gorselAc },
      { name: 'sahne_isaretle', description: 'Açık 3B sahnede bir parçayı/bölgeyi vurgular, kamerayı yaklaştırır ve etiket koyar (ör. histidinde "imidazol halkası"). Açık kemikte bir anatomik işaret adı (ör. processus coracoideus) verilirse o noktayı açık mavi titreşen odakla ve çubuklu bilgi kartıyla gösterir.',
        inputSchema: { type: 'object', properties: { parca: { type: 'string' }, etiket: { type: 'string' }, bilgi: { type: 'string', description: 'Kemik işareti için kart metni: oraya tutunan kaslar/bağlar ve işlevi (kitaptan, en fazla 25 kelime)' } }, required: ['parca'] }, execute: sahneIsaretle },
      { name: 'internet_ara', description: 'YALNIZ kitapta bulunamayan bilgi için internette (Google) arar; kaynak linkleriyle özet döndürür.',
        inputSchema: { type: 'object', properties: { soru: { type: 'string' } }, required: ['soru'] },
        execute: function (g) { if (!window.yerelGemini) return 'İnternet araması bu sürümde yok.'; return window.yerelGemini.ara('Türkçe, kısa ve doğru cevapla (tıp öğrencisi): ' + g.soru).then(function (r) { Carvis._kaynaklar = (Carvis._kaynaklar || []).concat(r.kaynaklar); Carvis._internet = true; return { ozet: r.metin.slice(0, 2500), kaynaklar: r.kaynaklar.slice(0, 5) }; }); } },
      { name: 'ekran_suresi', description: 'Bugün hangi uygulamada ne kadar kalındığını ve ders süresini döndürür (yalnız Android). Öğrenciye kısa, yargılamayan bir öneri yap.', inputSchema: { type: 'object', properties: {} },
        execute: function () { return U.ekranSuresi ? U.ekranSuresi() : 'Ekran süresi yalnız Android uygulamasında var.'; } },
      { name: 'plan_oku', description: 'Öğrencinin bugünkü çalışma planını döndürür ("bugün ne çalışıyorum?").', inputSchema: { type: 'object', properties: {} },
        execute: function () { return U.bugunkuPlan ? U.bugunkuPlan() : 'Plan yok.'; } },
      { name: 'ders_baslat', description: 'Eller serbest ders modunu başlatır: bölümü alt bölüm alt bölüm sesli anlatır, her birinden soru sorar. kitap ve bolum_sira verilmezse bugünkü planın ilk konusu ya da açık bölüm.',
        inputSchema: { type: 'object', properties: { kitap: { type: 'string' }, bolum_sira: { type: 'number' } } },
        execute: function (g) { setTimeout(function () { Carvis.dersModu(g.kitap || null, g.bolum_sira != null ? +g.bolum_sira : null); }, 50); return 'Ders modu başlıyor; sen kısa bir "Başlıyoruz" de, gerisini ders modu yapacak.'; } },
      { name: 'ses_seviyesi', description: 'Tabletin medya ses seviyesini yüzde olarak ayarlar (0-100).', inputSchema: { type: 'object', properties: { yuzde: { type: 'number' } }, required: ['yuzde'] },
        execute: function (g) { return K && K.sesSeviyesi ? K.sesSeviyesi(Math.round(+g.yuzde || 0)) : 'Yalnız Android uygulamasında.'; } },
      { name: 'muzik_cal', description: 'Spotify (varsayılan) ya da YouTube Music\'te şarkı/sanatçı/çalma listesi arayıp çalar. Ses seviyesi de istendiyse önce ses_seviyesi çağır.', inputSchema: { type: 'object', properties: { sorgu: { type: 'string' }, uygulama: { type: 'string', enum: ['spotify', 'youtube music'] } } },
        execute: function (g) { return K && K.muzik ? K.muzik(String(g.sorgu || ''), String(g.uygulama || 'spotify')) : 'Yalnız Android uygulamasında.'; } },
      { name: 'medya', description: 'Çalan müziği/videoyu kontrol eder.', inputSchema: { type: 'object', properties: { komut: { type: 'string', enum: ['oynat', 'duraklat', 'sonraki', 'onceki'] } }, required: ['komut'] },
        execute: function (g) { return K && K.medya ? K.medya(String(g.komut)) : 'Yalnız Android uygulamasında.'; } },
      { name: 'uygulama_ac', description: 'Tablette adı verilen uygulamayı açar (ör. YouTube, Ayarlar, Takvim, Kamera).', inputSchema: { type: 'object', properties: { ad: { type: 'string' } }, required: ['ad'] },
        execute: function (g) { return K && K.uygulamaAc ? K.uygulamaAc(String(g.ad)) : iosUygulamaAc(String(g.ad)); } },
      { name: 'whatsapp', description: 'WhatsApp\'ta rehberdeki ya da yalnız WhatsApp\'ta adıyla kayıtlı kişiye mesaj yazar ya da sesli/görüntülü arar. ÖNEMLİ: önce onaylandi=false ile çağırma; önce kullanıcıya kişiyi ve (mesajsa) metni sesli oku, "Göndereyim mi?" / "Arayayım mı?" diye sor. Kullanıcı açıkça evet/gönder/ara derse onaylandi=true ile çağır. Sadece "taslak yaz/aç" denirse onaylandi=false ile çağır (gönderilmez).',
        inputSchema: { type: 'object', properties: { kisi: { type: 'string', description: 'kişinin KAYITLI adı (ek almadan: "anneme at" → "Annem", "Aliyi ara" → "Ali") ya da numara' }, islem: { type: 'string', enum: ['mesaj', 'sesli', 'goruntulu'] }, metin: { type: 'string' }, onaylandi: { type: 'boolean' } }, required: ['kisi', 'islem'] },
        execute: function (g) { return K && K.whatsapp ? K.whatsapp(String(g.kisi), String(g.metin || ''), String(g.islem), g.onaylandi === true) : 'Yalnız Android uygulamasında.'; } },
      { name: 'ses_kaydi', description: 'Tabletin mikrofonuyla ses kaydı başlatır ya da durdurur (Kayıtlar/CARVIS klasörüne). Ders/sunum kaydı için.', inputSchema: { type: 'object', properties: { islem: { type: 'string', enum: ['basla', 'durdur'] } }, required: ['islem'] },
        execute: function (g) { return K && K.sesKaydi ? K.sesKaydi(g.islem === 'basla') : 'Yalnız Android uygulamasında.'; } },
      { name: 'eksiklerim', description: 'Öğrencinin eksik olduğu konuları döndürür: testlerde ve seviye ölçümlerinde "Bilmiyorum" dediği ya da yanlış yaptığı sorular (bölüm, konu, örnek soru) ve %60 altı seviye ölçümleri. "Nerede eksiğim var?", "neye çalışmalıyım?" sorularında kullan; en zayıf 2-3 yeri söyle ve ne yapacağını öner.',
        inputSchema: { type: 'object', properties: { kitap: { type: 'string', description: 'isteğe bağlı kitap kimliği' } } },
        execute: function (g) { return U.eksikOzeti ? U.eksikOzeti(g.kitap || null) : 'Eksik kaydı yok.'; } },
      { name: 'zamanim_yok', description: '"Zamanım yok" düğmesine basar: bölümün sınav odaklı 5 dakikalık özetini ekranda açar ve özet metnini döndürür ("zamanım yok", "hızlıca özetle", "sınava az kaldı"). kitap ve bolum_sira verilmezse açık bölüm. Dönen özeti madde işaretleri okumadan, doğal ve akıcı biçimde sesli anlat.',
        inputSchema: { type: 'object', properties: { kitap: { type: 'string' }, bolum_sira: { type: 'number' } } },
        execute: function (g) { return Carvis.zamanimYok(g.kitap || null, g.bolum_sira != null ? +g.bolum_sira : null); } }
    ]).map(oneGetirSar).map(kartlaSar);
  }

  /* ---------------- kişiselleştirme: profil, hafıza, selam, yankı süzgeci ---------------- */
  // Profil cihazda (localStorage) + kişisel depoda (Depo 'carvisProfil'); hangisi yeniyse o geçerli.
  var Profil = { ad: '', hitap: 'ad', ton: 'patrick', selam: true, hafiza: [], t: 0 };
  try { Object.assign(Profil, JSON.parse(localStorage.getItem('carvisProfil') || '{}')); } catch (e) {}
  U.Depo.oku('carvisProfil').then(function (v) { if (v && (v.t || 0) > (Profil.t || 0)) Object.assign(Profil, v); if (!Profil.tonSecildi) Profil.ton = 'patrick'; }).catch(function () {});
  if (!Profil.tonSecildi) Profil.ton = 'patrick'; // kullanıcı (2026-11-02): "Patrick Jane gibi rollendir" — kendisi başka üslup seçmediyse
  function profilKaydet() { Profil.t = Date.now(); try { localStorage.setItem('carvisProfil', JSON.stringify(Profil)); } catch (e) {} U.Depo.yaz('carvisProfil', JSON.parse(JSON.stringify(Profil))); }
  var TONLAR = {
    patrick: 'Patrick Jane (The Mentalist) gibi: keskin gözlemci, sakin ve şakacı bir özgüven, çekici ve hafif muzip. Küçük ipuçlarından (saat, açık sayfa, son yanlışlar, ne kadar süredir çalıştığı, sorunun nasıl sorulduğu) isabetli çıkarımlar yapar ve bunu doğal biçimde söyler (ör. "Gece ikide üçüncü kez glikolize dönüyorsun; sorun glikoliz değil, yorgunluk."). Çıkarımı her zaman somut bir gözleme dayandırır, gözlem yoksa uydurmaz; her cevapta değil, yerinde ve en fazla bir cümleyle yapar. Öğrenciyi doğru düğmeye basarak motive eder (meydan okuma, küçük bir iddia, merak). Asla kibirli ya da kırıcı değil. TIBBİ BİLGİDE asla blöf yapmaz: kitaptan ve doğru bilgiden şaşmaz, emin değilse bunu açıkça ve zarifçe söyler.',
    jarvis: 'Jarvis gibi: kibar, sakin, özgüvenli, arada ince ve kuru bir espri; kısa ve net.',
    samimi: 'Sıcak ve arkadaşça, "sen" diye; cesaretlendirici ama abartısız.',
    resmi: 'Resmî ve saygılı, "siz" diye; espri yok, yalnız bilgi.',
    koc: 'Disiplinli bir koç gibi: motive edici, hedef ve süre hatırlatan, bahaneyi nazikçe geri çeviren.'
  };
  function hitap() { return Profil.hitap === 'efendim' ? 'efendim' : Profil.hitap === 'hocam' ? 'hocam' : Profil.hitap === 'ad' && Profil.ad ? Profil.ad : ''; }
  // Kısa çalışma durumu (60 sn önbellek): pomodoro, en yakın sınav, vadeli kart, en zayıf yer
  var durumOnbellek = { t: 0, v: null };
  function calismaDurumu(ms) {
    if (Date.now() - durumOnbellek.t < 60000 && durumOnbellek.v) return Promise.resolve(durumOnbellek.v);
    var zaman = new Promise(function (ok) { setTimeout(function () { ok(null); }, ms || 400); });
    return Promise.race([U.calismaOnerisi ? U.calismaOnerisi().catch(function () { return null; }) : Promise.resolve(null), zaman]).then(function (o) {
      if (!o) return durumOnbellek.v;
      var pm = o.pomodoro || {};
      var v = { dk: pm.bugun_dakika || 0, hedef: pm.gunluk_hedef_dk || 120, seri: pm.seri_gun || 0, saat: pm.calisiyor ? (pm.mod === 'calis' ? 'çalışma' : 'mola') + ', ' + pm.kalan + ' kaldı' : null,
        sinav: o.sinav, vadeli: o.vadeli || 0, ilkIs: o.isler[0] ? o.isler[0].ad : null };
      durumOnbellek = { t: Date.now(), v: v };
      return v;
    });
  }
  // Gözlemler (Patrick Jane'in "okuma" malzemesi): yalnız gerçek veri; 30 sn önbellek, en çok 500 ms beklenir
  var sayfaBas = { hash: location.hash, t: Date.now() }, sonSoruT = 0, bugunSoru = 0;
  window.addEventListener('hashchange', function () { var h = location.hash.split('-').slice(0, 3).join('-'); if (h !== sayfaBas.hash) sayfaBas = { hash: h, t: Date.now() }; });
  var gozOnbellek = { t: 0, v: '' };
  function gozlemler() {
    var simdi = Date.now();
    var oncekiSoru = sonSoruT; sonSoruT = simdi; bugunSoru++;
    if (simdi - gozOnbellek.t < 30000) return Promise.resolve(gozOnbellek.v);
    var is = Promise.all([
      U.Depo.oku('eksikler').catch(function () { return {}; }),
      U.Depo.oku('testler').catch(function () { return {}; }),
      U.Depo.oku('pomodoro').catch(function () { return {}; }),
      U.ekranSuresi ? Promise.resolve(U.ekranSuresi()).catch(function () { return null; }) : Promise.resolve(null)
    ]).then(function (r) {
      var l = [];
      var kj = Durum.aktifKitap, bol = Durum.aktifBolum, dk = Math.round((simdi - sayfaBas.t) / 60000);
      if (kj && bol) l.push('Ekranda ' + kj.baslik.replace(/^1001\s*/, '') + ' — ' + (bol.kisa || bol.baslik) + ' açık' + (dk >= 3 ? ', ' + dk + ' dakikadır bu sayfada' : ''));
      var ek = (r[0].liste || []).filter(function (e) { return simdi - e.t < 3 * 3600e3; });
      if (ek.length) {
        var k = {}; ek.forEach(function (e) { var x = e.konu || e.bolum || ''; if (x) k[x] = (k[x] || 0) + 1; });
        var en = Object.keys(k).sort(function (a, b) { return k[b] - k[a]; }).slice(0, 3);
        l.push('Son 3 saatte ' + ek.length + ' yanlış/bilmiyorum' + (en.length ? ' (en çok: ' + en.map(function (x) { return x.slice(0, 40) + (k[x] > 1 ? ' ×' + k[x] : ''); }).join(', ') + ')' : '') + ', ' + ek.filter(function (e) { return e.bilmiyor; }).length + ' tanesi "bilmiyorum"');
      }
      var ts = Object.keys(r[1]).map(function (x) { return r[1][x]; }).filter(function (t) { return t && t.sonuc; }).sort(function (a, b) { return b.sonuc.t - a.sonuc.t; })[0];
      if (ts && simdi - ts.sonuc.t < 24 * 3600e3) l.push('Son test: "' + ts.baslik + '" ' + ts.sonuc.dogru + '/' + ts.sonuc.n + ' (' + Math.round((simdi - ts.sonuc.t) / 60000) + ' dk önce)');
      var d0 = new Date(), gk = d0.getFullYear() + '-' + ('0' + (d0.getMonth() + 1)).slice(-2) + '-' + ('0' + d0.getDate()).slice(-2), bp = ((r[2] || {}).gun || {})[gk];
      if (bp && bp.adet) l.push('Bugün ' + bp.adet + ' pomodoro tamamladı');
      var es = r[3]; if (es && es.uygulamalar && es.uygulamalar.length) { var ilk = es.uygulamalar[0], m = /: (\d+) dk/.exec(ilk); if (m && +m[1] >= 20) l.push('Ekran süresi: bugün en çok ' + ilk + ' (ders kaydı ' + es.ders_dk + ' dk)'); }
      if (oncekiSoru) { var ara = Math.round((simdi - oncekiSoru) / 60000); if (ara >= 30) l.push('Bir önceki sorusundan bu yana ' + ara + ' dakika geçti'); }
      if (bugunSoru >= 3) l.push('Bu oturumda ' + bugunSoru + '. sorusu');
      return l.join('; ');
    }).catch(function () { return ''; });
    return Promise.race([is, new Promise(function (ok) { setTimeout(function () { ok(null); }, 500); })]).then(function (v) { if (v === null) return gozOnbellek.v; gozOnbellek = { t: Date.now(), v: v }; return v; });
  }
  var DUSUNME = 'DÜŞÜNME YÖNTEMİN (cevaptan önce, içinden): 1) Asıl ne soruluyor, öğrenci neyi karıştırıyor olabilir? 2) Kitapta ara; bilgiyi mekanizma ve "neden"iyle bağla. 3) Sınavda nasıl sorulur, klasik tuzak ne? 4) Doğrula: metabolik basamaklarda substrat → ürün → enzim zincirini, anatomide yön/komşuluğu, sayıları ve birimleri tek tek kontrol et; kitap sonucuyla çelişen bir şey söyleme. Emin olmadığını kesinmiş gibi söyleme. Sonra kısa, akıcı, sesli okunacak biçimde cevapla; gerekiyorsa tek cümlelik bir sınav ipucu ekle.';
  function profilMetni() {
    return Promise.all([calismaDurumu(), gozlemler(), U.Depo.oku('janeOto').catch(function () { return {}; })]).then(function (rr) { var d = rr[0], gz = rr[1], jo = (rr[2] && rr[2].liste) || [];
      var s = new Date(), saat = s.getHours();
      var l = ['KULLANICI: ' + (Profil.ad ? 'adı ' + Profil.ad + '. ' : '') + (hitap() ? 'Ona "' + hitap() + '" diye hitap et (her cümlede değil, ara sıra). ' : '') + 'Üslup: ' + (TONLAR[Profil.ton] || TONLAR.jarvis),
        'Şu an: ' + s.toLocaleDateString('tr-TR', { weekday: 'long', day: 'numeric', month: 'long' }) + ', saat ' + ('0' + saat).slice(-2) + ':' + ('0' + s.getMinutes()).slice(-2) + (saat >= 0 && saat < 5 ? ' (gece geç saat: gerekirse uykuyu nazikçe hatırlat)' : '') + '.'];
      if (d) l.push('Çalışma durumu: bugün ' + d.dk + '/' + d.hedef + ' dk, ' + d.seri + ' gün seri' + (d.saat ? ', pomodoro: ' + d.saat : '') + (d.sinav ? ', en yakın sınav ' + U.sinavAdi(d.sinav) + ' (' + d.sinav.gun + ' gün' + (d.sinav.komite ? '; komite: anatomi, biyokimya, biyofizik, biyoistatistik aynı testte, ayrı ders sınavı yok' : '') + ')' : '') + (d.vadeli ? ', ' + d.vadeli + ' vadeli kart' : '') + (d.ilkIs ? ', sıradaki iş: ' + d.ilkIs : '') + '. Bunu yalnız ilgiliyse kullan.');
      // Akademik hedef (kullanıcı, 2026-11-02): 1. sınıf, yurt dışında PhD/akademik kariyer; sınav haftası tamamen sınava yönelik
      var kalan = d && d.sinav ? d.sinav.gun : null;
      l.push('HEDEF: Öğrenci tıpta 1. sınıf; hedefi yurt dışında PhD ve akademik kariyer. ' + (kalan != null && kalan <= 7
        ? 'ŞU AN SINAV HAFTASI (' + U.sinavAdi(d.sinav) + ' için ' + kalan + ' gün): yalnız sınava yönelik konuş — çıkmış soru mantığı, tuzaklar, kısa özet; akademik ayrıntıya girme.'
        : 'Sınava ' + (kalan != null ? kalan + ' gün var' : 'tarih girilmemiş') + ': cevabı sınav bilgisiyle bitir ama DERİNLEŞTİR — mekanizma ve "neden", terimin İngilizcesi, konunun güncel araştırma bağlantısı ya da klasik bir deney/keşif (bilmiyorsan uydurma). Uygun düştüğünde küçük bir araştırma sorusu ya da İngilizce okuma önerisi yap.'));
      if (gz) l.push('GÖZLEMLER (gerçek veri; çıkarım yaparken yalnız bunlara ve sohbete dayan): ' + gz + '.');
      // Jane sarsılma turunda "emin ama yanlış" çıkan varsayımlar: öğrencinin otomatik doldurma noktaları; konu açılınca kısaca uyar
      if (jo.length) l.push('OTOMATİK DOLDURMA NOKTALARI (Jane turunda emin olup yanıldığı; ilgili konu açılırsa bu tuzağa tek cümleyle dikkat çek): ' + jo.slice(-5).map(function (x) { return (x.konu || '') + ': ' + String(x.varsayim || x.soru || '').slice(0, 110); }).join(' | ') + '.');
      l.push(DUSUNME);
      if (Profil.hafiza.length) l.push('HAFIZAN (kullanıcının sana söyledikleri; uygun düştüğünde kullan, tekrar tekrar söyleme):\n- ' + Profil.hafiza.slice(-25).map(function (h) { return h.m; }).join('\n- '));
      l.push('Kullanıcı kendisi hakkında kalıcı bir bilgi/tercih söylerse ("sabahları çalışırım", "bana kısa anlat", "kardiyolojiyi seviyorum") ya da "bunu hatırla" derse hatirla aracını kullan; "unut" derse unut. "Bana X de", "daha resmi/samimi konuş" derse profil_ayarla.');
      return l.join('\n');
    });
  }
  function selamMetni() {
    var h = hitap(), saat = new Date().getHours(), bugun = new Date().toDateString();
    var kisa = Profil.ton === 'resmi' ? ['Sizi dinliyorum' + (h ? ', ' + h : '') + '.', 'Buyurun' + (h ? ' ' + h : '') + '.'] :
      Profil.ton === 'samimi' ? ['Dinliyorum' + (h ? ' ' + h : '') + '.', 'Söyle' + (h ? ' ' + h : '') + '.', 'Buradayım.'] :
      Profil.ton === 'koc' ? ['Dinliyorum. Hedefe odaklanalım.', 'Buradayım. Ne yapıyoruz?'] :
      Profil.ton === 'patrick' ? ['Buradayım' + (h ? ' ' + h : '') + '. Dinliyorum.', 'Söyle bakalım' + (h ? ' ' + h : '') + '.', 'Dinliyorum. Ne soracağını tahmin edebilirim ama sen söyle.', 'Evet' + (h ? ' ' + h : '') + '?'] :
      ['Dinliyorum' + (h ? ' ' + h : '') + '.', 'Buyurun' + (h ? ' ' + h : '') + '.', 'Emrinizdeyim.', 'Evet' + (h ? ' ' + h : '') + '?'];
    var sec = kisa[Math.floor(Math.random() * kisa.length)];
    var ilk = false; try { ilk = Profil.selam && localStorage.getItem('carvisSonSelam') !== bugun; } catch (e) {}
    if (!ilk) return Promise.resolve(sec);
    try { localStorage.setItem('carvisSonSelam', bugun); } catch (e) {}
    var zs = saat < 5 ? 'İyi geceler' : saat < 12 ? 'Günaydın' : saat < 18 ? 'İyi günler' : 'İyi akşamlar';
    return calismaDurumu(2500).then(function (d) {
      var p = [zs + (h ? ' ' + h : '') + '.'];
      if (d && d.sinav) { var sa = U.sinavAdi(d.sinav); p.push(sa.charAt(0).toUpperCase() + sa.slice(1) + (d.sinav.gun === 0 ? ' bugün.' : 'ne ' + d.sinav.gun + ' gün var.')); }
      if (d && d.vadeli) p.push(d.vadeli + ' tekrar kartı seni bekliyor.');
      if (d && d.seri > 1) p.push(d.seri + ' gündür serini koruyorsun.');
      p.push(Profil.ton === 'resmi' ? 'Sizi dinliyorum.' : 'Dinliyorum.');
      return p.join(' ');
    });
  }
  function vedaMetni() { var h = hitap(), l = Profil.ton === 'resmi' ? ['İyi çalışmalar.', 'Görüşmek üzere.'] : Profil.ton === 'koc' ? ['Odak sende. Görüşürüz.'] : ['Görüşürüz' + (h ? ' ' + h : '') + '.', 'Buradayım, seslenmen yeter.']; return l[Math.floor(Math.random() * l.length)]; }
  // Yankı: Carvis'in az önce söylediği cümlenin parçası "kullanıcı sözü" olarak geri gelirse yok say
  function yankiMi(t) {
    if (!Ses.sonMetin || Date.now() - Ses.sonBitis > 7000) return false;
    var sade = function (x) { return katla(x).replace(/[^a-z0-9 ]+/g, ' ').replace(/\s+/g, ' ').trim(); };
    var a = sade(t).split(' ').filter(function (w) { return w.length > 2; }), b = ' ' + sade(Ses.sonMetin) + ' ';
    if (!a.length) return false;
    var ortak = a.filter(function (w) { return b.indexOf(' ' + w + ' ') >= 0; }).length;
    return a.length >= 2 ? ortak / a.length >= 0.75 : (ortak === 1 && b.trim().split(' ').slice(-2).indexOf(a[0]) >= 0);
  }
  setTimeout(function () { calismaDurumu(30000); }, 4000); // önbelleği ısıt
  function oturumBildir(acik) { try { if (K && K.oturum) K.oturum(!!acik); } catch (e) {} }
  // Pomodoro ve diğer modüller Carvis'in sesiyle konuşsun; oturum açıkken dinlemeyle çakışmasın diye yalnız yazar
  window.carvisSoyle = function (m) {
    if (Carvis.acik) { mesaj('cv-o', '⏱ ' + U.esc(m)); U.toast(m); return; }
    Ses.konus(m);
  };
  function hafizaAraclari() {
    return [
      { name: 'hatirla', description: 'Kullanıcı hakkında kalıcı bir bilgiyi/tercihi hafızaya yazar (en fazla 40 madde). Kısa, üçüncü tekil kişi: "Sabahları çalışmayı seviyor".',
        inputSchema: { type: 'object', properties: { bilgi: { type: 'string' } }, required: ['bilgi'] },
        execute: function (g) { var m = String(g.bilgi || '').trim().slice(0, 200); if (!m) return 'Boş.'; if (Profil.hafiza.some(function (h) { return katla(h.m) === katla(m); })) return 'Zaten hatırlıyorum.'; Profil.hafiza.push({ m: m, t: Date.now() }); Profil.hafiza = Profil.hafiza.slice(-40); profilKaydet(); return 'Hafızaya yazıldı: ' + m; } },
      { name: 'unut', description: 'Hafızadan bir maddeyi siler (anahtar kelimeyle eşleşen). "hepsi" verilirse tamamını.',
        inputSchema: { type: 'object', properties: { bilgi: { type: 'string' } }, required: ['bilgi'] },
        execute: function (g) { var q = katla(String(g.bilgi || '')), once = Profil.hafiza.length; Profil.hafiza = q === 'hepsi' ? [] : Profil.hafiza.filter(function (h) { return katla(h.m).indexOf(q) < 0; }); profilKaydet(); return (once - Profil.hafiza.length) + ' madde silindi.'; } },
      { name: 'profil_ayarla', description: 'Kullanıcının adını, hitap biçimini ya da konuşma üslubunu değiştirir.',
        inputSchema: { type: 'object', properties: { ad: { type: 'string' }, hitap: { type: 'string', enum: ['ad', 'efendim', 'hocam', 'yok'] }, ton: { type: 'string', enum: ['patrick', 'jarvis', 'samimi', 'resmi', 'koc'] } } },
        execute: function (g) { if (g.ad) Profil.ad = String(g.ad).slice(0, 40); if (g.hitap) Profil.hitap = g.hitap; if (g.ton && TONLAR[g.ton]) { Profil.ton = g.ton; Profil.tonSecildi = true; } profilKaydet(); return 'Tamam: ' + JSON.stringify({ ad: Profil.ad, hitap: Profil.hitap, ton: Profil.ton }); } }
    ];
  }
  // ⚙ Ayarlar paneli
  function ayarPaneli() {
    var govde = U.panelAc('⚙ Carvis ayarları', 'Kişiselleştirme');
    function satir(et, girdi) { return el('label', { style: 'display:grid;gap:4px;margin:8px 0;font-size:13px' }, [et, girdi]); }
    var stil = 'background:var(--zemin);border:1px solid var(--cizgi);border-radius:6px;color:var(--metin);padding:6px 8px';
    var ad = el('input', { type: 'text', value: Profil.ad || '', placeholder: 'Adın', style: stil });
    var hit = el('select', { style: stil }); [['ad', 'Adımla'], ['efendim', '"Efendim"'], ['hocam', '"Hocam"'], ['yok', 'Hitapsız']].forEach(function (x) { hit.appendChild(el('option', { value: x[0], text: x[1], selected: Profil.hitap === x[0] ? true : null })); });
    var ton = el('select', { style: stil }); [['patrick', 'Patrick Jane (gözlemci, muzip, zeki)'], ['jarvis', 'Jarvis (kibar, ince espri)'], ['samimi', 'Samimi'], ['resmi', 'Resmî'], ['koc', 'Koç (motive edici)']].forEach(function (x) { ton.appendChild(el('option', { value: x[0], text: x[1], selected: Profil.ton === x[0] ? true : null })); });
    var selam = el('input', { type: 'checkbox', checked: Profil.selam ? true : null });
    function kaydet() { Profil.ad = ad.value.trim(); Profil.hitap = hit.value; if (Profil.ton !== ton.value) Profil.tonSecildi = true; Profil.ton = ton.value; Profil.selam = selam.checked; profilKaydet(); }
    [ad, hit, ton, selam].forEach(function (x) { x.addEventListener('change', kaydet); });
    govde.appendChild(satir('Adın', ad)); govde.appendChild(satir('Sana nasıl hitap etsin?', hit)); govde.appendChild(satir('Üslup', ton));
    govde.appendChild(el('label', { style: 'display:flex;gap:8px;align-items:center;font-size:13px;margin:8px 0' }, [selam, 'Günün ilk açılışında selam + kısa durum (sınava kalan gün, vadeli kart, seri)']));
    if (K && K.arkaPlan) {
      var ap = el('input', { type: 'checkbox', checked: K.arkaPlanMi() ? true : null });
      ap.addEventListener('change', function () { K.arkaPlan(ap.checked); });
      govde.appendChild(el('label', { style: 'display:flex;gap:8px;align-items:center;font-size:13px;margin:8px 0' }, [ap, 'Uygulama dışında "Carvis" deyince arka planda dinlesin (öne gelmez; sayfa/3B/test gerekince gelir)']));
    }
    // Ekran gözü (kullanıcı, 2026-11-04: "ekranı okuması için bir tuş olsun, ben aktive edeyim")
    if (K && K.ekranGozu) {
      var eg = {}; try { eg = JSON.parse(K.ekranGozuDurum() || '{}'); } catch (e) {}
      var egAc = el('input', { type: 'checkbox', checked: eg.acik && eg.erisim ? true : null });
      var egP = el('p', { class: 'var-etiket', text: eg.erisim ? 'Açıkken başka uygulamalarda kenarda küçük bir Carvis noktası durur. Ona dokunduğunda (yalnız o an) Carvis ekranı görür ve ne olduğunu anlatır. Sürükleyip taşıyabilir, uzun basıp kapatabilirsin.' : 'Önce Android ayarlarında Erişilebilirlik → C.A.R.V.I.S.\'i açman gerekiyor; kutuyu işaretleyince ayar sayfası açılır.' });
      egAc.addEventListener('change', function () { var r = K.ekranGozu(egAc.checked); if (r === 'erisim-kapali') { egAc.checked = false; egP.textContent = 'Erişilebilirlik → Yüklü uygulamalar → C.A.R.V.I.S.\'i aç, sonra buraya dönüp kutuyu yeniden işaretle.'; } else U.toast(egAc.checked ? 'Ekran gözü açık: başka bir uygulamaya geçince noktayı göreceksin.' : 'Ekran gözü kapandı.'); });
      govde.appendChild(el('h4', { text: '👁 Ekran gözü' }));
      govde.appendChild(el('label', { style: 'display:flex;gap:8px;align-items:center;font-size:13px;margin:8px 0' }, [egAc, 'Başka uygulamalarda Carvis noktası (dokununca ekranı okur)']));
      govde.appendChild(egP);
    }
    if (K && K.sesler) {
      var sesler = []; try { sesler = JSON.parse(K.sesler() || '[]'); } catch (e) {}
      var secili = (K.secilenSes() || '|0.85').split('|');
      var sesSec = el('select', { style: stil }); sesler.forEach(function (v) { sesSec.appendChild(el('option', { value: v, text: v, selected: v.replace(' (ağ)', '') === secili[0] ? true : null })); });
      var perde = el('input', { type: 'range', min: '0.6', max: '1.3', step: '0.05', value: secili[1] || '0.85' });
      var dene = el('button', { class: 'dugme kucuk', type: 'button', text: '▶ Dene', onclick: function () { K.sesAyarla(sesSec.value, +perde.value); setTimeout(function () { Ses.konus((hitap() ? 'Merhaba ' + hitap() + '. ' : 'Merhaba. ') + 'Bugün hangi konuya çalışıyoruz?'); }, 400); } });
      [sesSec, perde].forEach(function (x) { x.addEventListener('change', function () { K.sesAyarla(sesSec.value, +perde.value); }); });
      govde.appendChild(satir('Ses', sesSec)); govde.appendChild(satir('Perde (tını)', perde)); govde.appendChild(dene);
    }
    // Carvis sesi: ZipVoice (kullanıcı, 2026-11-03: "carvisin içine zipvoice kuralım", İngilizce konuşsun + Türkçe altyazı)
    if (K && K.zvDurum) {
      govde.appendChild(el('h4', { text: '🎙 Carvis sesi — ZipVoice (beta, internetsiz)' }));
      govde.appendChild(el('p', { class: 'var-etiket', text: 'Açıkken Carvis senin sesinle İngilizce konuşur (cevapları da İngilizce yazar). Ses tablette üretilir, internet gerekmez.' }));
      var zvAc = el('input', { type: 'checkbox', checked: Zv.ayar('zv_acik') === '1' ? true : null });
      var zvDurumP = el('p', { class: 'var-etiket', 'aria-live': 'polite' });
      var zvIndir = el('button', { class: 'dugme kucuk', type: 'button', text: '⇣ Ses modelini indir (125 MB)', onclick: function () { K.zvIndir(); Zv.ciz(); } });
      var zvDene = el('button', { class: 'dugme kucuk', type: 'button', text: '▶ Dene', onclick: function () { Ses.konus((hitap() ? 'Merhaba ' + hitap() + '. ' : 'Merhaba. ') + 'Bütün sistemler çevrimiçi. Bugün hangi konuya çalışıyoruz?'); } });
      var zvTekrar = el('button', { class: 'dugme kucuk', type: 'button', text: '↻ Tekrar dene', hidden: true, onclick: function () { try { K.zvCokusSifirla(); } catch (e) {} Zv.sonHata = ''; Zv.ciz(); } });
      var zvZm = null;
      Zv.ciz = function () {
        var d = Zv.durum();
        zvIndir.hidden = !!d.model || !!d.indiriliyor;
        zvDene.hidden = !d.model;
        var ayr = d.model ? ' · Aşama: ' + (d.asama || '?') + (d.yuklemeMs > 0 ? ' · yükleme ' + (d.yuklemeMs / 1000).toFixed(1) + ' sn' : '') + (d.sonUretimMs > 0 ? ' · son cümle ' + (d.sonSesMs / 1000).toFixed(1) + ' sn sesi ' + (d.sonUretimMs / 1000).toFixed(1) + ' sn\'de üretildi' : '') + ' · çalınan: ' + (d.calinan || 0) + (d.medyaSes ? ' · medya sesi ' + d.medyaSes : '') : '';
        zvDurumP.textContent = d.abi && !/arm64/.test(d.abi) ? 'Bu cihaz desteklenmiyor (' + d.abi + ').' :
          !d.ornek ? 'Ses örneği yok.' :
          d.indiriliyor ? 'İndiriliyor… %' + (d.yuzde || 0) :
          d.model ? (d.hazir ? 'Hazır ✓' : 'Model indirildi ✓ (ilk konuşmada birkaç saniye yüklenir)') + (Zv.sonHata ? ' · Son hata: ' + Zv.sonHata : '') + (d.hata && d.hata !== Zv.sonHata ? ' · Motor: ' + d.hata : '') :
          (d.hata ? 'İndirme hatası: ' + d.hata + ' — tekrar dene.' : 'Model henüz indirilmedi.');
        zvDurumP.textContent += ayr;
        if (d.cokus) zvDurumP.textContent = '⚠ Ses motoru önceki denemede uygulamayı kapattı (aşama: ' + d.cokus + '). Güvenlik için kapattım; Carvis eski sesle konuşuyor. "Tekrar dene"ye basarsan bir kez daha denenir.';
        zvTekrar.hidden = !d.cokus;
        clearTimeout(zvZm); if (document.body.contains(zvDurumP)) zvZm = setTimeout(Zv.ciz, 1000);
      };
      zvAc.addEventListener('change', function () { Zv.ayar('zv_acik', zvAc.checked ? '1' : '0'); if (zvAc.checked && !Zv.durum().model) K.zvIndir(); Zv.ciz(); });
      govde.appendChild(el('label', { style: 'display:flex;gap:8px;align-items:center;font-size:13px;margin:8px 0' }, [zvAc, 'Carvis bu sesle İngilizce konuşsun (altyazı Türkçe)']));
      govde.appendChild(el('div', { style: 'display:flex;gap:8px;flex-wrap:wrap' }, [zvIndir, zvDene, zvTekrar]));
      govde.appendChild(zvDurumP);
      Zv.ciz();
    }
    // Sağlayıcı zinciri (kullanıcı, 2026-11-03: "omniroute'u termux'suz sen hallet", "ücret ödemeyeceğim")
    var SG = window.yerelAyar && window.yerelAyar.saglayici;
    if (SG) {
      govde.appendChild(el('h4', { text: '🔀 Yapay zekâ sağlayıcıları (ücretsiz, sırayla)' }));
      govde.appendChild(el('p', { class: 'var-etiket', text: 'OmniRoute gibi: Carvis listedekileri yukarıdan aşağı dener; biri kotasını doldurursa ya da ulaşılamazsa sıradakine geçer, en sonda Gemini ve Groq. Her birine bir kez ücretsiz anahtarını gir, "Modelleri getir"e bas, "Test" ile dene.' }));
      var sgKap = el('div', { style: 'display:grid;gap:10px' });
      govde.appendChild(sgKap);
      var sgCiz = function () {
        sgKap.innerHTML = '';
        var l = SG.liste();
        if (!l.length) sgKap.appendChild(el('p', { class: 'var-etiket', text: 'Henüz sağlayıcı yok. Aşağıdan ekle.' }));
        l.forEach(function (x, i) {
          var h = SG.hazir[x.tur] || {};
          var kaydet = function () { var t = SG.liste(); t[i] = x; SG.yaz(t); };
          var anahtar = el('input', { type: 'password', value: x.anahtar || '', placeholder: 'Anahtar', style: stil, autocomplete: 'off' });
          anahtar.addEventListener('change', function () { x.anahtar = anahtar.value.trim(); kaydet(); });
          var taban = el('input', { type: 'url', value: x.taban || '', placeholder: 'Adres (ör. http://127.0.0.1:20128)', style: stil, autocomplete: 'off', hidden: x.tur !== 'omniroute' ? true : null });
          taban.addEventListener('change', function () { x.taban = taban.value.trim(); kaydet(); });
          var modeller = el('input', { type: 'text', value: (x.modeller || []).join(', '), placeholder: 'Modeller (virgülle) — "Modelleri getir" doldurur', style: stil, autocomplete: 'off' });
          modeller.addEventListener('change', function () { x.modeller = modeller.value.split(',').map(function (m) { return m.trim(); }).filter(Boolean); kaydet(); });
          var sonuc = el('p', { class: 'var-etiket', 'aria-live': 'polite', text: SG.sonHata(x.id) ? 'Son hata: ' + SG.sonHata(x.id) : '' });
          var acik = el('input', { type: 'checkbox', checked: x.acik === false ? null : true });
          acik.addEventListener('change', function () { x.acik = acik.checked; kaydet(); });
          var d = function (t, f) { return el('button', { class: 'dugme kucuk', type: 'button', text: t, onclick: f }); };
          sgKap.appendChild(el('div', { style: 'border:1px solid var(--cizgi);border-radius:8px;padding:10px;display:grid;gap:6px' }, [
            el('div', { style: 'display:flex;gap:8px;align-items:center' }, [el('b', { text: (i + 1) + '. ' + x.ad, style: 'flex:1' }), el('label', { style: 'display:flex;gap:4px;align-items:center;font-size:12px' }, [acik, 'açık'])]),
            h.anahtarYeri ? el('p', { class: 'var-etiket', text: 'Anahtar: ' + h.anahtarYeri }) : el('span'),
            taban, anahtar, modeller,
            el('div', { style: 'display:flex;gap:6px;flex-wrap:wrap' }, [
              d('⇣ Modelleri getir', function () { x.anahtar = anahtar.value.trim(); x.taban = taban.value.trim() || x.taban; kaydet(); sonuc.textContent = 'Modeller alınıyor…'; SG.modelleriGetir(x).then(function (m) { if (!m.length) { sonuc.textContent = 'Uygun model bulunamadı.'; return; } x.modeller = m.slice(0, 6); kaydet(); modeller.value = x.modeller.join(', '); sonuc.textContent = m.length + ' uygun model bulundu; ilk ' + x.modeller.length + ' tanesi sıraya alındı.'; }, function (e) { sonuc.textContent = '✗ ' + e.message; }); }),
              d('🔌 Test', function () { x.anahtar = anahtar.value.trim(); x.taban = taban.value.trim() || x.taban; kaydet(); sonuc.textContent = 'Deneniyor…'; SG.test(x).then(function (m) { sonuc.textContent = m; }, function (e) { sonuc.textContent = '✗ ' + e.message; }); }),
              i > 0 ? d('↑', function () { var t = SG.liste(); var y = t.splice(i, 1)[0]; t.splice(i - 1, 0, y); SG.yaz(t); sgCiz(); }) : el('span'),
              d('🗑', function () { if (!confirm(x.ad + ' silinsin mi?')) return; var t = SG.liste(); t.splice(i, 1); SG.yaz(t); sgCiz(); })]),
            sonuc]));
        });
        sgKap.appendChild(el('div', { style: 'display:flex;gap:6px;flex-wrap:wrap' }, [el('span', { class: 'var-etiket', text: 'Ekle:' })].concat(Object.keys(SG.hazir).map(function (k) {
          var h = SG.hazir[k];
          return el('button', { class: 'dugme kucuk', type: 'button', text: '＋ ' + h.ad, onclick: function () { var t = SG.liste(); t.push({ id: 's' + Date.now().toString(36), tur: k, ad: h.ad, taban: h.taban || (k === 'omniroute' ? 'http://127.0.0.1:20128' : ''), anahtar: '', modeller: [], acik: true }); SG.yaz(t); sgCiz(); } });
        }))));
      };
      sgCiz();
    }
    govde.appendChild(el('h4', { text: '🧠 Carvis\'in hafızası' }));
    var liste = el('ul', { class: 'var-etiket' }), yeni = el('input', { type: 'text', placeholder: 'Ör. "Sabahları çalışmayı seviyorum"', style: stil + ';flex:1;min-width:0' });
    function ciz() { liste.innerHTML = ''; if (!Profil.hafiza.length) liste.appendChild(el('li', { text: 'Boş. Konuşurken "bunu hatırla" diyebilirsin.' })); Profil.hafiza.slice().reverse().forEach(function (h) { liste.appendChild(el('li', {}, [h.m + ' ', el('button', { class: 'cip', type: 'button', text: '✕', title: 'Unut', onclick: function () { Profil.hafiza = Profil.hafiza.filter(function (x) { return x.t !== h.t; }); profilKaydet(); ciz(); } })])); }); }
    govde.appendChild(el('form', { style: 'display:flex;gap:6px', onsubmit: function (e) { e.preventDefault(); var m = yeni.value.trim(); if (!m) return; yeni.value = ''; Profil.hafiza.push({ m: m, t: Date.now() }); profilKaydet(); ciz(); } }, [yeni, el('button', { class: 'dugme kucuk', type: 'submit', text: 'Ekle' })]));
    govde.appendChild(liste); ciz();
  }

  /* ---------------- oturum ---------------- */
  var KURAL = 'Sen "Carvis"sin: tıp öğrencisinin çalışma kitaplarını bilen Türkçe sesli asistan. Cevapların SESLİ okunacak.\n' +
    'Kurallar: Önce kitapta ara (kitapta_ara / bolum_getir / kavram_getir). kitapta_ara metinde birebir geçen KISA ifadeyi arar: 1-2 kelimelik anahtar terimle ara (ör. "fosfofruktokinaz", "coracoideus"), cümle yazma; en fazla 2 arama yap, sonra elindekiyle cevapla. Bulursan sayfa_ac ile o yeri aç. Görsel bir yapıysa (molekül, halka, fonksiyonel grup, kemik, kas) gorsel_ac ile 3B sahneyi aç ve sahne_isaretle ile ilgili parçayı işaretle. Kemik üzerindeki bir işaret (processus coracoideus, tuberculum majus, fossa…) sorulursa: TEK çağrıda gorsel_ac tur=kemik, ad=kemik (ör. scapula), isaret=işaretin Latince adı, bilgi=oraya tutunan kaslar/bağlar ve işlevi (en fazla 25 kelime), mantik=neden bu biçimde/burada, evrim=evrimsel nedeni ver; ekranda etiketli kutular ve çıkmış sorular otomatik çıkar; sonra kısaca sesli anlat. Molekül ve kemik için de gorsel_ac aracına bilgi/mantik/evrim ver.\n' +
    '"Sesli özet" denirse zamanim_yok aracıyla açık bölümün özetini al ve onu akıcı, madde işaretsiz biçimde sesli anlat (en fazla 160 kelime; ekranda altyazı geçer).\n' +
    'Cevabı "**Kitaptan:**" ve gerekirse "**Genel bilgi:**" diye ayır; kitapta olmayanı kitaptan gelmiş gibi söyleme. Kitapta yoksa internet_ara kullan ve cevaba "**İnternetten:**" diye başla.\n' +
    'Ses tanıma Türkçe çalışır ve Latince/İngilizce tıp terimlerini bozar (ör. "protes kore kaydosu" = processus coracoideus, "sterno klido mastoid" = sternocleidomastoideus, "asetil koa" = asetil-KoA, "hanım yok" = zamanım yok). Kullanıcının sözünü önce seslerine göre en yakın tıp terimine çevir, kitapta o terimle ara; emin değilsen "processus coracoideus mu demek istediniz?" diye kısaca sor. [olası: ...] içindeki diğer tanıma tahminlerinden de yararlan.\n' +
    'Eksikler: "nerede eksiğim var / neye çalışmalıyım" denirse eksiklerim aracını kullan, en zayıf 2-3 bölümü/konuyu söyle ve somut öneri ver (ör. o bölümü ders modunda çalış, Zamanım yok özeti, ilgili test).\n' +
    'Makaleler: "şu konuyla ilgileniyorum / bunu takip et" denirse ilgi_ekle (Türkçe konu). Makale/literatür/güncel çalışma istenirse makale_ara (kısa İNGİLİZCE sorgu) ve en ilgili 2-3 makaleyi bir cümleyle anlat; kullanıcı kartta ⚡ Zamanım yok ile özet alabilir.\n' +
    'Müzik: "patlat", "aç", "koy", "çal" aynı anlamdadır ("şarkı patlat" = şarkı çal); ses tanıma bunları bozabilir ("bir çarpı patlılır" = bir şarkı patlat). Kendi müzik bilgini kullan. Kullanıcı bir ruh hâli, tarz ya da "X gibi bir şey" derse benzer tınıda BELİRLİ bir şarkı seç (ör. "Ode to the Mets gibi bir şey" → Daft Punk - Instant Crush), tek cümleyle nedenini söyle ("O zaman sana Instant Crush açıyorum") ve muzik_cal ile sorgu="Şarkı adı Sanatçı" olarak çal. Ses seviyesi de söylendiyse önce ses_seviyesi çağır. Sohbet ederek öneri isterse 2-3 seçenek sun.\n' +
    'Tablet komutlarında (müzik, ses, uygulama, WhatsApp, kayıt) kitapta arama yapma; doğrudan ilgili aracı kullan ve en fazla bir cümleyle onayla. WhatsApp mesajı/araması ASLA onaysız gönderilmez.\n' +
    '"Zamanım yok", "hızlıca özetle", "sınava az kaldı" denirse zamanim_yok aracını kullan.\n' +
    'Spotify bağlıysa (spotify_ruh_hali aracı varsa): ruh hâli, his ya da "bana göre bir şey çal / moduma uygun" isteklerinde spotify_ruh_hali; duraklat/sonraki/önceki/ne çalıyor için spotify_kontrol kullan (uygulamadan çıkmaz). Belirli şarkı/sanatçı isteğinde muzik_cal. Karışımı başlatınca adını ve bir cümlelik yorumunu söyle, şarkı listesini okuma.\n' +
    'Kısa konuş: en fazla 90 kelime, madde işareti yerine düz cümleler. "nasıl yani" denirse son anlattığını daha basit ve örnekle anlat; "şöyle mi" diye öğrencinin anlattığını değerlendir.';
  var Carvis = {
    acik: false, gecmis: [], son: '', ctl: null,
    uyan: function (arkaPlan) {
      if (Date.now() - (Carvis._uyanma || 0) < 2500) return; // çift sinyal: açıp anında kapatmasın
      Carvis._uyanma = Date.now();
      if (!Carvis.acik) Carvis.arkaPlan = !!arkaPlan; // uygulama dışında uyandı: yalnız sesle çalış, görsel gerekirse öne gel
      if (Carvis.acik && (Carvis.konusuyor || Date.now() - (Ses.sonBitis || 0) < 2000)) return; // kendi sesinin yankısı
      if (balon.hidden) balon.hidden = false; if (Carvis.acik) Carvis.kapat(); else Carvis.ac(); },
    ac: function () {
      if (!Ses.destek) { durum('Bu cihazda ses yok; yazarak sor.'); balon.hidden = false; yaziGir.focus(); return; }
      if (Carvis.acik) return;
      Carvis.acik = true; Carvis._acilis = Date.now(); dug.classList.add('acik'); balon.hidden = false; oturumBildir(true);
      if (H) { H.temizle(); H.soru(''); H.goster(); }
      // Oturum boyunca uyandırma dinleyicisi KAPALI: açıkken Carvis kendi sesini "Carvis" sanıp susuyordu ve mikrofon iki kez çalışıp pili yiyordu.
      // Oturumu kapatmak için "Carvis"/"kapat" demek yeterli (konuşma tanımadan, KAPAT), söz kesmek için 🎙'a dokunulur.
      Ses.uyandirma(false);
      durum('Dinliyorum');
      selamMetni().then(function (m) { if (!Carvis.acik) return; if (m.length > 30) mesaj('cv-o', U.esc(m)); return Carvis.soyle(m); }).then(Carvis.dongu);
    },
    kapat: function (sessiz) {
      if (!Carvis.acik) return;
      Carvis.acik = false; Carvis.arkaPlan = false; oturumBildir(false); dug.classList.remove('acik'); if (H) H.gizle(); Ses.dinlemeyiKes(); Ses.sus(); if (Carvis.ctl) Carvis.ctl.abort();
      durum('');
      (sessiz ? Promise.resolve() : Ses.konus(vedaMetni())).then(function () { Ses.uyandirma(uyandirmaAcik); });
    },
    dongu: function () {
      if (!Carvis.acik || Carvis.dersAktif) return;
      var bekle = 700 - (Date.now() - (Ses.sonBitis || 0)); // konuşma biter bitmez mikrofonu açma: kendi sesinin kuyruğunu duyuyordu
      if (bekle > 0 && bekle <= 700) return void setTimeout(Carvis.dongu, bekle);
      durum('Dinliyorum');
      Ses.dinle().then(function (t) {
        if (!Carvis.acik) return;
        t = (t || '').trim();
        var sh = Ses.sonHata; Ses.sonHata = null;
        // Konuşuldu ama yazıya dökülemedi: sessizce yeniden dinleme, söyle (kullanıcı "Dinliyorumda kaldı" diyordu)
        if (!t && sh === 'anlasilmadi') return Carvis.soyle(Profil.ton === 'resmi' ? 'Tam duyamadım, tekrar eder misiniz?' : 'Tam duyamadım, tekrar söyler misin?').then(Carvis.dongu);
        if (!t && sh === 'stt_yok') { mesaj('cv-o', '<p class="hata-metni">Ses tanıma servisine ulaşılamadı (kota ya da internet). Yazarak da sorabilirsin.</p>'); return Carvis.soyle('Ses tanıma servisine şu an ulaşamıyorum. Bir daha dener misin?').then(Carvis.dongu); }
        if (!t) return Carvis.dongu();
        if (yankiMi(t)) { if (window.__carvisKayit) console.log('YANKI yok sayıldı: ' + t); return Carvis.dongu(); }
        return Carvis.soru(t).then(Carvis.dongu);
      }).catch(function (e) { durum('Ses tanıma hatası: ' + e.message); Carvis.kapat(true); });
    },
    // Basit tablet komutları için yerel çözümleyici (Gemini isteği yok). Eşleşmezse null.
    yerelKomut: function (t) {
      if (!K || !K.medya) return null;
      var x = t.toLowerCase().trim().replace(/[.!?]+$/, ''), m;
      var sesM = /^(?:(?:müziğin|medya)\s+)?sesi?(?:ni)?\s+(?:yüzde\s*|%\s*)?(\d{1,3})(?:\s*(?:yap|olsun|e|a|'?e|'?a)?)?$/.exec(x) || /^ses(?:i)?\s*%\s*(\d{1,3})/.exec(x) || /^%\s*(\d{1,3})\s+ses/.exec(x);
      if (sesM) { K.sesSeviyesi(Math.min(100, +sesM[1])); return 'Ses yüzde ' + Math.min(100, +sesM[1]) + '.'; }
      if (/^(sesi )?(kıs|azalt)$/.test(x)) { K.sesSeviyesi(20); return 'Sesi kıstım.'; }
      if (/^(müziği |şarkıyı )?(durdur|duraklat)$/.test(x)) { K.medya('duraklat'); return 'Durdurdum.'; }
      if (/^(müziği |şarkıyı )?(devam ettir|devam|oynat|başlat)$/.test(x)) { K.medya('oynat'); return 'Devam ediyor.'; }
      if (/^(sonraki|diğer|bir sonraki) şarkı|^şarkıyı (geç|değiştir)$/.test(x)) { K.medya('sonraki'); return 'Sonraki şarkı.'; }
      if (/^(önceki|bir önceki) şarkı$/.test(x)) { K.medya('onceki'); return 'Önceki şarkı.'; }
      if ((m = /^(ses kaydı(nı)?|kaydı) (başlat|aç)$/.exec(x))) return K.sesKaydi(true);
      if (/^(ses kaydını|kaydı) (durdur|bitir|kapat)$/.test(x)) return K.sesKaydi(false);
      return null;
    },
    // Pomodoro komutları (Gemini'siz, APK ve tarayıcıda)
    saatKomut: function (t) {
      var P = U.Pomodoro; if (!P) return null;
      var x = t.toLowerCase().trim().replace(/[.!?]+$/, ''), m;
      if ((m = /^(\d{1,3}) ?(dakika|dk)(lık)? (pomodoro|çalışma|çalış|odak)( başlat| aç| kur)?$/.exec(x))) return P.baslat(+m[1], null);
      if (/^(pomodoro|çalışma saati|zamanlayıcı|odak modu)( başlat| aç| kur)?$|^pomodoro başlasın$/.test(x)) return P.baslat(null, null);
      if (/^(pomodoroyu|saati|zamanlayıcıyı) (duraklat|beklet)$|^(pomodoro|saat) (duraklat|beklet)$/.test(x)) return P.duraklat();
      if (/^(pomodoroya|saate) devam( et)?$/.test(x)) return P.duraklat();
      if (/^(molaya geç|pomodoroyu atla|aşamayı atla|molayı (atla|bitir))$/.test(x)) return P.atla();
      if (/^(pomodoroyu|saati|zamanlayıcıyı) (durdur|bitir|kapat)$/.test(x)) return P.durdur();
      if (/^(ne kadar (kaldı|süre kaldı)|kaç dakika kaldı|pomodoro (durumu|ne durumda))$/.test(x)) return P.durum().then(function (d) { return d.calisiyor ? (d.mod === 'calis' ? 'Çalışmanın bitmesine ' : 'Molanın bitmesine ') + d.kalan + ' var. Bugün ' + d.bugun_dakika + ' dakika çalıştın.' : 'Saat çalışmıyor. Bugün ' + d.bugun_dakika + ' dakika çalıştın.'; });
      return null;
    },
    soru: function (t, yazili) {
      if (KAPAT.test(t)) {
        // Açılıştan hemen sonra yalnız "Carvis" duyulursa kullanıcı tekrar seslenmiştir: kapatma, dinlemeye devam et
        if (Date.now() - (Carvis._acilis || 0) < 8000) { durum('Dinliyorum'); return Promise.resolve(); }
        Carvis.kapat(); return Promise.resolve();
      }
      if (H && !/^\s*(dur|iptal|sus|geç|tekrar|tamam yeter)\s*$/i.test(t)) { H.temizle(); H.soru(t); if (Carvis.acik || !yazili) H.goster(); }
      if (/^\s*(dur|iptal|sus|tamam yeter)\s*$/i.test(t)) { Ses.sus(); return Promise.resolve(); }
      if (/^\s*tekrar( anlat| söyle| et)?\s*$/i.test(t)) return Carvis.soyle(Carvis.son);
      if (/daha yavaş/i.test(t)) { Ses.hiz(0.8); return Carvis.soyle('Tamam, daha yavaş konuşacağım.'); }
      if (/daha hızlı|normal hız/i.test(t)) { Ses.hiz(1); return Carvis.soyle('Tamam.'); }
      var hizli = Carvis.yerelKomut(t) || Carvis.saatKomut(t);
      if (hizli) { mesaj('cv-ben', U.esc(t)); return Promise.resolve(hizli).then(function (h) { h = String(h); mesaj('cv-o', U.esc(h)); return Carvis.soyle(h); }); }
      mesaj('cv-ben', U.esc(t));
      durum('Düşünüyor…');
      var cev = mesaj('cv-o', '<div class="yukleniyor">Düşünüyor…</div>');
      var kj = Durum.aktifKitap, bol = Durum.aktifBolum;
      var baglam = (Zv.acik() ? 'DİL: Sesli yanıtın kullanıcının kendi sesiyle İngilizce okunuyor. Cevabının TAMAMINI doğal, sade, konuşma dilinde İNGİLİZCE yaz (tıbbi terimler İngilizce); Türkçe yazma. Araç parametreleri (kitapta arama terimleri vb.) Türkçe kalabilir.\n' : '') + 'Şu an açık: ' + (kj ? kj.baslik + (bol ? ', ' + bol.baslik : '') : (location.hash || 'kütüphane')) + '. Kitap kimlikleri: ' + (Kitaplik.liste || []).map(function (k) { return k.id; }).join(', ') + '.';
      Carvis._kaynaklar = []; Carvis._internet = false;
      var alt = (Ses.alternatifler || []).filter(function (x) { return x && x !== t; }); Ses.alternatifler = [];
      Carvis.gecmis.push({ role: 'user', content: alt.length ? t + ' [olası: ' + alt.join(' | ') + ']' : t });
      Carvis.ctl = new AbortController();
      if (!Y.sample) { cev.innerHTML = '<p class="hata-metni">Yapay zekâ yok.</p>'; return Promise.resolve(); }
      var cihazIsi = /spotify|ruh hal|moduma|şarkı|müzik|patlat|playlist|çalma listesi|\bçal\b|\baç\b.*(uygulama|youtube|ayarlar|kamera)|whatsapp|mesaj|\bara\b|arayayım|kayıt|ses(i|ini)? |%\s*\d|pomodoro|zamanlayıcı|hatırla|unut/i.test(t) && !/kitap|bölüm|sayfa|anatomi|biyokimya|biyofizik|istatistik|kemik|kas |molekül|enzim/i.test(t);
      var gecmis = Carvis.gecmis.slice(-4).map(function (m) { return m.role === 'assistant' && m.content.length > 450 ? { role: m.role, content: m.content.slice(0, 450) + '…' } : m; });
      var tumAraclar = araclar();
      // kısa sohbet/selamlaşma: hafif model (daha bol kotalı) yeter
      var basit = t.split(/\s+/).length <= 5 && !/neden|nasıl|nedir|ne demek|açıkla|anlat|fark|mekanizma|hesapla|çöz|test|soru/i.test(t);
      var CIHAZ_ARAC = /^(spotify_ruh_hali|spotify_kontrol|ses_seviyesi|muzik_cal|medya|uygulama_ac|whatsapp|ses_kaydi|plan_oku|ekran_suresi|eksiklerim|pomodoro|calisma_onerisi|hatirla|unut|profil_ayarla)$/;
      var obAn = onbAnahtar(t, kj, cihazIsi || basit);
      return (obAn ? U.AI.onbellekOku(obAn) : Promise.resolve(null)).then(function (ob) {
        if (ob && ob.metin && Date.now() - (ob.t || 0) < 14 * 864e5) return { text: ob.metin, _hafiza: true };
        return Promise.all([profilMetni(), onAra(t, cihazIsi || basit, tumAraclar)]).then(function (rr) { var pm = rr[0], on = rr[1]; return Y.sample([{ role: 'user', content: KURAL + '\n' + pm + '\n' + baglam + (on ? '\nÖN ARAMA (kitaplarda cihazda yapıldı, güvenilir; yeterliyse ARAÇ ÇAĞIRMADAN bunlarla cevapla, kaynak etiketlerini aynen koru; yetmezse araçları kullan):\n' + on : '') + '\nAnladıysan "Tamam" yaz.' }, { role: 'assistant', content: 'Tamam.' }].concat(gecmis),
        { tools: cihazIsi ? tumAraclar.filter(function (a) { return CIHAZ_ARAC.test(a.name); }) : aracSec(t, tumAraclar), hafif: cihazIsi || basit, maxTur: cihazIsi ? 2 : (on ? 2 : 3), groqAtla: cihazIsi ? null : /^(muzik_cal|medya|uygulama_ac|whatsapp|ses_kaydi|ekran_suresi|ilgi_ekle|unut|profil_ayarla|ses_seviyesi)$/, signal: Carvis.ctl.signal, onText: function (u) { cev.innerHTML = U.mdHtml(u.text); } }); }); })
        .then(function (r) {
          Carvis.gecmis.push({ role: 'assistant', content: r.text });
          if (obAn && !r._hafiza && !Carvis._internet && r.text && r.text.length > 60) U.AI.onbellekYaz(obAn, { metin: r.text, t: Date.now(), eylem: 'carvis' });
          cev.innerHTML = (Carvis._internet ? '<span class="cv-etiket">İnternetten · doğrula</span>' : '') + U.mdHtml(r.text);
          if (Carvis._kaynaklar.length) { var k = el('div', { class: 'cv-kaynak' }); Carvis._kaynaklar.slice(0, 5).forEach(function (s) { k.appendChild(el('a', { href: s.url, target: '_blank', rel: 'noopener', text: '↗ ' + (s.baslik || s.url) })); }); cev.appendChild(k); }
          U.atiflariBagla && kj && U.atiflariBagla(cev, kj);
          cev.appendChild(el('span', { class: 'etiket-kucuk ai', text: r._hafiza ? 'AI üretimi · hafızadan (kota harcamadı)' : 'AI üretimi' }));
          akis.scrollTop = akis.scrollHeight;
          return yazili && !Carvis.acik ? null : Carvis.soyle(r.text);
        }).catch(function (e) { cev.innerHTML = ''; cev.appendChild(el('p', { class: 'hata-metni', text: U.AI ? U.AI.hataMetni(e) : String(e) })); durum(''); });
    },
    soyle: function (md) {
      Carvis.son = md; var s = sesMetni(md);
      if (!s) return Promise.resolve();
      Carvis.konusuyor = true; durum('Konuşuyor (kesmek için 🎙\'a dokun)');
      if (H) H.altyaziBasla(s);
      return Ses.konus(s).then(function () { Carvis.konusuyor = false; if (H) H.altyaziBitir(); });
    }
  };
  /* ---------------- eller serbest ders modu ---------------- */
  function dersCevabiBekle() {
    // en çok 2 deneme; sessizlikte soruyu bir kez hatırlat
    return Ses.dinle().then(function (t) { return (t || '').trim() || Ses.konus('Cevabını bekliyorum. Bilmiyorsan "geç" de.').then(Ses.dinle).then(function (x) { return (x || '').trim(); }); });
  }
  // "⚡ Zamanım yok" düğmesini Carvis adına çalıştırır; özet bitince metnini döndürür (sesli okunsun diye)
  /* Ekran gözü: başka uygulamada Carvis noktasına dokunulunca Android ekranın yazılarını + görüntüsünü verir, Carvis öne gelir.
     Carvis ne gördüğünü kısaca söyler; sonraki sorularda (ekrana_bak) bu ekranı 3 dakika hatırlar. */
  Carvis.ekranAnlat = function () {
    var j = null; try { j = JSON.parse((K && K.ekranGozuSon && K.ekranGozuSon()) || 'null'); } catch (e) {}
    if (!j || (Carvis._disEkran && Carvis._disEkran.t === j.t)) return;
    Carvis._disEkran = j;
    if (!Carvis.acik) Carvis.ac();
    document.body.classList.remove('cv-yazi-kapali');
    var ad = j.uygulama || j.paket || 'ekran';
    var ben = mesaj('cv-ben', '<b>👁 ' + U.esc(ad) + '</b> ekranını gösterdim');
    var blob = null;
    if (j.resim) { try { var b = atob(j.resim), u8 = new Uint8Array(b.length); for (var i = 0; i < b.length; i++) u8[i] = b.charCodeAt(i); blob = new Blob([u8], { type: 'image/jpeg' }); ben.appendChild(el('img', { src: 'data:image/jpeg;base64,' + j.resim, alt: '', style: 'display:block;max-width:100%;max-height:180px;margin-top:6px;border-radius:10px;opacity:.9' })); } catch (e) { blob = null; } }
    var cev = mesaj('cv-o', '<div class="yukleniyor">Bakıyorum…</div>'); durum('Ekrana bakıyor…');
    var istem = 'Sen Carvis\'sin: tıp öğrencisinin Türkçe sesli asistanı. Kullanıcı şu an tablette "' + ad + '" uygulamasında ve ekranını sana bir tuşla gösterdi.' +
      (blob ? ' Ekran görüntüsü ekte.' : ' Ekran görüntüsü yok; yalnız ekrandaki yazılar var.') +
      ' Ekranda ne olduğunu 1-3 cümlede söyle; kullanıcının büyük ihtimalle ne yapmak ya da öğrenmek istediğini sez ve doğrudan işine yarayacak bir şey ekle (soru/ödev/makale/video ise özü ya da cevabı; tıp konusuysa kısa ve doğru açıklama). Uzatma; sesli okunacak; liste yerine akıcı konuşma dili. Emin olmadığını uydurma.\n\nEKRANDAKİ YAZILAR:\n' + String(j.metin || '(yok)').slice(0, 3500);
    Carvis.gecmis.push({ role: 'user', content: '[Ekranımı gösterdim: ' + ad + ']\n' + String(j.metin || '').slice(0, 600) });
    return Y.sample([{ role: 'user', content: istem }], blob ? { images: [blob] } : { hafif: true }).then(function (r) {
      Carvis.gecmis.push({ role: 'assistant', content: r.text });
      cev.innerHTML = U.mdHtml(r.text); cev.appendChild(el('span', { class: 'etiket-kucuk ai', text: 'AI üretimi' }));
      return Carvis.soyle(r.text);
    }).catch(function (e) { cev.innerHTML = ''; cev.appendChild(el('p', { class: 'hata-metni', text: U.AI ? U.AI.hataMetni(e) : String(e) })); durum(''); });
  };
  window.carvisEkran = function () { try { Carvis.ekranAnlat(); } catch (e) {} };
  window.carvisEkranKapandi = function () { U.toast('Ekran gözü kapandı (Carvis ayarlarından yeniden açabilirsin).'); };
  // açılışta: ekran gözü açık bırakılmışsa ve erişilebilirlik açıksa nokta geri gelsin
  setTimeout(function () { try { if (K && K.ekranGozuDurum) { var d = JSON.parse(K.ekranGozuDurum() || '{}'); if (d.acik && d.erisim && !d.nokta) K.ekranGozu(true); } } catch (e) {} }, 2500);
  /* iPhone (kullanıcı, 2026-11-04: "iPhone'a aktarmak istiyorum"; Android'e özel işler için geçici çözümler):
     uygulama bağlantılarıyla açma (iOS ilk seferde "açılsın mı?" diye sorabilir); Siri/Kestirme "…#carvis" adresiyle açınca Carvis hazır. */
  var IOS_UYG = [[/youtube|yutup/, 'youtube://'], [/spotify/, 'spotify://'], [/whats ?app|vatsap/, 'whatsapp://'], [/instagram|insta/, 'instagram://'], [/chrome/, 'googlechrome://'],
    [/claude/, 'claude://'], [/gmail|e-?posta|mail/, 'googlegmail://'], [/telegram/, 'tg://'], [/takvim|calendar/, 'calshow://'], [/harita|maps/, 'maps://'], [/netflix/, 'nflx://'],
    [/twitter|\bx\b/, 'twitter://'], [/tiktok/, 'snssdk1233://'], [/notlar|notes/, 'mobilenotes://'], [/müzik|apple music/, 'music://'], [/dosyalar|files/, 'shareddocuments://'], [/drive/, 'googledrive://'], [/safari|tarayıcı/, 'x-web-search://']];
  function iosUygulamaAc(ad) {
    var a = String(ad || '').toLocaleLowerCase('tr'), e = IOS_UYG.filter(function (x) { return x[0].test(a); })[0];
    if (!e) return 'Bu uygulamayı iPhone\'da açamıyorum; Siri\'ye "' + ad + '\'u aç" diyebilirsin.';
    setTimeout(function () { try { location.href = e[1]; } catch (x) {} }, 300);
    return ad + ' açılıyor (iPhone "açılsın mı?" diye sorarsa onayla).';
  }
  U.iosUygulamaAc = iosUygulamaAc;
  function kisayolKontrol() { if (/^#carvis\b/.test(location.hash) && !K) { history.replaceState(null, '', location.pathname + '#kutuphane'); setTimeout(function () { if (!Carvis.acik) Carvis.ac(); document.body.classList.remove('cv-yazi-kapali'); }, 600); } }
  window.addEventListener('hashchange', kisayolKontrol); setTimeout(kisayolKontrol, 1200);
  /* Kota (kullanıcı, 2026-11-04: "kota dolmasın diye napalım"): bilgi sorularında kitap araması yapay zekâya sorulmadan ÖNCE cihazda yapılır
     ve sonuçlar tek istekte gönderilir (araç döngüsü 2-3 istek yerine çoğu zaman 1); aynı bağımsız soru 14 gün hafızadan cevaplanır. */
  var DURAK = /^(nedir|neden|niçin|nasıl|nedenini|açıkla|açıklar|anlat|anlatır|misin|mısın|musun|müsün|bana|şunu|bunu|onun|bunun|şunun|arasındaki|farkı|fark|nelerdir|hangi|hangisi|kaç|demek|olur|olan|olarak|için|gibi|daha|kısaca|biraz|lütfen|carvis|jarvis|peki|yani|şimdi|değil|veya|ile|ve|ya|ne|mi|mı|mu|mü|bir|bu|şu|o)$/;
  function onAra(t, atla, araclar) {
    if (atla || !/\?|nedir|neden|niçin|nasıl|açıkla|anlat|fark|mekanizma|ne demek|ne işe|hangi|kaç|görev|yapısı|özelli/i.test(t)) return Promise.resolve('');
    var l = t.toLocaleLowerCase('tr').replace(/[^0-9a-zçğıöşüâîû\s-]/gi, ' ').split(/\s+/).filter(function (w) { return w.length > 3 && !DURAK.test(w); })
      .map(function (w) { return w.replace(/(ların|lerin|ları|leri|ının|inin|unun|ünün|nın|nin|nun|nün|dır|dir|dur|dür|da|de|ta|te|ı|i|u|ü|ın|in|un|ün|a|e)$/, ''); }).filter(function (w) { return w.length > 2; });
    l = l.sort(function (a, b) { return b.length - a.length; }).slice(0, 2);
    var ara = (araclar || []).filter(function (a) { return a.name === 'kitapta_ara'; })[0], kav = (araclar || []).filter(function (a) { return a.name === 'kavram_getir'; })[0];
    if (!ara || !l.length) return Promise.resolve('');
    var isler = l.map(function (w) { return Promise.resolve(ara.execute({ sorgu: w })).catch(function () { return ''; }); });
    if (kav) isler.push(Promise.resolve(kav.execute({ ad: l[0] })).catch(function () { return ''; }));
    return Promise.race([Promise.all(isler), new Promise(function (ok) { setTimeout(function () { ok([]); }, 2500); })]).then(function (rr) {
      return rr.map(function (x) { return typeof x === 'string' ? x : JSON.stringify(x); }).filter(function (x) { return x && x.length > 20 && !/^\[\]$|bulunamadı|sonuç yok/i.test(x); }).map(function (x) { return x.slice(0, 1400); }).join('\n').slice(0, 3200);
    }).catch(function () { return ''; });
  }
  function onbAnahtar(t, kj, atla) {
    var x = String(t || '').toLocaleLowerCase('tr').replace(/[^0-9a-zçğıöşü\s]/gi, ' ').replace(/\s+/g, ' ').trim();
    if (atla || x.length < 18 || /^(peki|bu|şu|o |onu|bunu|şunu|onun|bunun|devam|daha|tekrar|neden peki|ya )/.test(x) || /bugün|şimdi|saat|yarın|dün|plan|sınav|benim|ben |hatırla|kaç gün/.test(x)) return null;
    var A = window.KitapAyristir; return A && A.fnv ? A.fnv('cvc1|' + (kj ? kj.id : '') + '|' + x) : null;
  }
  Carvis.zamanimYok = function (kitapId, sira) {
    function bekle(kosul, ms) { return new Promise(function (ok) { var t0 = Date.now(); (function d() { var v = kosul(); if (v || Date.now() - t0 > ms) return ok(v); setTimeout(d, 400); })(); }); }
    var ac = kitapId ? Promise.all([Kitaplik.ac(kitapId), Kitaplik.bolumAc(kitapId, sira || 0)]).then(function (r) {
      U.git(U.okuHash(r[0].id, r[1].sira));
      return bekle(function () { return Durum.aktifBolum && Durum.aktifKitap && Durum.aktifKitap.id === r[0].id && Durum.aktifBolum.sira === r[1].sira; }, 15000);
    }) : Promise.resolve(!!(Durum.aktifKitap && Durum.aktifBolum));
    return ac.then(function (hazir) {
      if (!hazir || !U.zamanimYok) return 'Açık bölüm yok. Kullanıcıya hangi kitap ve bölüm olduğunu sor ya da plan_oku ile bugünkü konuyu bul, sonra zamanim_yok aracını kitap ve bolum_sira ile yeniden çağır.';
      var ad = Durum.aktifBolum.kisa || Durum.aktifBolum.baslik;
      U.zamanimYok();
      return bekle(function () {
        var k = document.querySelector('.yp-cevap'); if (!k) return null;
        var zd = k.querySelector('.zy-durum'); if (zd) return /✓/.test(zd.textContent) || k.querySelector('.hata-metni') ? k : null; // her başlık hazır olsun
        if (k.querySelector('.yp-cevap-alt .etiket-kucuk.ai, .hata-metni') || k.querySelector(':scope > ul')) return k;
        return null;
      }, 150000).then(function (k) {
        if (!k) return 'Özet zamanında üretilemedi (' + ad + '). Kullanıcıya ekranda açık olduğunu, birazdan hazır olacağını söyle.';
        var hata = k.querySelector('.hata-metni');
        var am = k.querySelectorAll('.ai-metin'), metin = (am.length ? Array.prototype.map.call(am, function (x) { return x.innerText; }).join('\n') : (k.innerText || '')).trim();
        if (hata && !metin.replace(hata.innerText, '').trim()) return 'Özet üretilemedi: ' + hata.innerText;
        return 'Ekranda açıldı: "Zamanım yok — ' + ad + '" (her alt başlık ayrı). ÖZET:\n' + metin.slice(0, 6000);
      });
    });
  };
  // Ders modunda parçaya ait yapıyı 3B hologramda açar ve anlatılan bölgeye yakınlaştırır; hata dersi durdurmaz
  function dersGorsel(g) {
    if (!g || !g.ad || !/^(molekul|kemik|kas)$/.test(g.tur || '')) return Promise.resolve();
    var tur = g.tur, parca = String(g.parca || '').trim();
    var ac = { tur: tur, ad: String(g.ad) };
    if (tur === 'kemik' && parca) { ac.isaret = parca; if (g.bilgi) ac.bilgi = String(g.bilgi); }
    durum('Ders: hologram hazırlanıyor');
    var is = Promise.resolve().then(function () { return gorselAc(ac); }).then(function (v) {
      if (typeof v === 'string' && /bulunamad|yok|olmalı/i.test(v)) return;
      if (tur === 'molekul' && parca) return sahneIsaretle({ parca: parca, etiket: parca, bilgi: g.bilgi ? String(g.bilgi) : undefined });
    }).catch(function () {});
    // görsel yavaşsa anlatımı en fazla 6 sn bekletir
    return Promise.race([is, new Promise(function (ok) { setTimeout(ok, 6000); })]);
  }
  Carvis.dersModu = function (kitapId, sira) {
    if (Carvis.dersAktif) return;
    var hedef = kitapId ? Promise.resolve({ kitap: kitapId, sira: sira || 0 }) :
      Durum.aktifKitap && Durum.aktifBolum ? Promise.resolve({ kitap: Durum.aktifKitap.id, sira: Durum.aktifBolum.sira }) : Promise.resolve(null);
    hedef.then(function (h) {
      if (!h) { Carvis.soyle('Önce bir bölüm aç ya da plandan bir konu seç.'); return; }
      Carvis.dersAktif = true; balon.hidden = false;
      if (!Carvis.acik) { Carvis.acik = true; dug.classList.add('acik'); Ses.uyandirma(Ses.yerel); }
      return Promise.all([Kitaplik.ac(h.kitap), Kitaplik.bolumAc(h.kitap, h.sira)]).then(function (r) {
        var kj = r[0], bol = r[1];
        U.git(U.okuHash(kj.id, bol.sira));
        var altlar = bol.altlar.filter(function (a) { return U.altMetin && U.altMetin(a).replace(/\s/g, '').length >= 120; });
        var dogru = 0, toplam = 0, i = 0, bitti = false;
        mesaj('cv-o', '<b>🎧 Ders modu:</b> ' + U.esc(bol.kisa || bol.baslik) + ' · ' + altlar.length + ' parça. Komutlar: "geç", "tekrar", "nasıl yani", "dur".');
        function parca() {
          if (bitti || !Carvis.acik || i >= altlar.length) return son();
          var a = altlar[i], metin = U.altMetin(a, 6000);
          durum('Ders: ' + (i + 1) + '/' + altlar.length + ' · hazırlanıyor');
          return Y.sample.json('Bir tıp öğrencisine çalışma kitabının bu kısmını SESLİ ders gibi anlatacaksın. YALNIZ metne dayan, uydurma. Türkçe, düz cümleler (madde işareti yok).\n' +
            'JSON döndür: {"anlatim":"en fazla 110 kelimelik sesli anlatım; sınavda çıkan noktayı vurgula","soru":"bu kısımdan tek bir kısa açık uçlu soru","cevap":"kitaba göre doğru cevap, 1-2 cümle","gorsel":null}\n' +
            'gorsel: parça BELİRLİ bir yapıyı anlatıyorsa 3B hologramda göster, yoksa null bırak. Biçim: {"tur":"molekul"|"kemik"|"kas","ad":"molekül adı (ör. histidin, glukoz, ATP, hemoglobin) ya da Latince kemik/kas adı (ör. scapula, biceps brachii)","parca":"molekülde odaklanılacak bölge (ör. imidazol halkası, karboksil grubu) ya da kemikte Latince anatomik işaret (ör. processus coracoideus); yoksa boş","bilgi":"o bölge için en fazla 20 kelimelik kart metni"}\n\nALT BÖLÜM: ' + (a.baslik || '') + '\n"""\n' + metin + '\n"""')
            .then(function (j) {
              mesaj('cv-o', '<b>' + U.esc(a.baslik || 'Parça ' + (i + 1)) + '</b><br>' + U.esc(j.anlatim || '') + '<br><i>Soru: ' + U.esc(j.soru || '') + '</i> <span class="etiket-kucuk ai">AI üretimi</span>');
              return dersGorsel(j.gorsel).then(function () { return Carvis.soyle(j.anlatim); }).then(function () { return sorVe(j, a, metin); });
            }).then(function () { i++; return parca(); })
            .catch(function (e) { mesaj('cv-o', '<p class="hata-metni">' + U.esc(U.AI ? U.AI.hataMetni(e) : String(e)) + '</p>'); bitti = true; return son(); });
        }
        function sorVe(j, a, metin) {
          if (!Carvis.acik || bitti) return;
          durum('Ders: soru — cevabını söyle');
          return Carvis.soyle('Soru: ' + j.soru).then(dersCevabiBekle).then(function (t) {
            if (!Carvis.acik) return;
            if (!t) { return Carvis.soyle('Geçiyorum. Doğru cevap: ' + j.cevap); }
            mesaj('cv-ben', U.esc(t));
            if (KAPAT.test(t) || /^\s*(dur|bitir|dersi bitir)\s*$/i.test(t)) { bitti = true; return; }
            if (/^\s*(geç|sonraki|atla|bilmiyorum)\b/i.test(t)) { toplam++; kartaEkle(j); return Carvis.soyle('Tamam. Doğru cevap: ' + j.cevap + '. Bunu kartlarına ekledim.'); }
            if (/^\s*tekrar/i.test(t)) return Carvis.soyle(j.anlatim).then(function () { return sorVe(j, a, metin); });
            if (/nasıl yani|anlamadım|basitçe/i.test(t)) return Y.sample('Bu anlatımı daha basit ve bir günlük hayat örneğiyle, en fazla 80 kelime, düz cümlelerle tekrar anlat. Yalnız metne dayan.\nANLATIM: ' + j.anlatim + '\nKİTAP METNİ:\n' + metin.slice(0, 3000))
              .then(function (r) { mesaj('cv-o', U.mdHtml(r.text)); return Carvis.soyle(r.text); }).then(function () { return sorVe(j, a, metin); });
            toplam++;
            return Y.sample.json('Öğrencinin sesli cevabını kitabın cevabıyla karşılaştır. Ses tanıma hataları olabilir, anlamca değerlendir. JSON: {"sonuc":"dogru"|"eksik"|"yanlis","geri":"en fazla 40 kelimelik Türkçe geri bildirim; eksikse eksik olanı söyle"}\nSORU: ' + j.soru + '\nKİTABIN CEVABI: ' + j.cevap + '\nÖĞRENCİ: ' + t)
              .then(function (d) {
                if (d.sonuc === 'dogru') dogru++; else kartaEkle(j);
                mesaj('cv-o', (d.sonuc === 'dogru' ? '✓ ' : '✗ ') + U.esc(d.geri || ''));
                return Carvis.soyle((d.geri || '') + (d.sonuc === 'dogru' ? '' : ' Bunu kartlarına ekledim.'));
              });
          });
        }
        function kartaEkle(j) { if (U.kartEkle) U.kartEkle({ on: j.soru, arka: j.cevap, kitap: kj.id, bolum: bol.sira, blok: null, kaynak: 'Ders modu (AI üretimi soru)', ai: true }); }
        function son() {
          Carvis.dersAktif = false;
          var m = 'Ders bitti. ' + toplam + ' sorudan ' + dogru + ' tanesini bildin.' + (toplam - dogru > 0 ? ' Bilemediklerini kartlarına ekledim.' : '');
          if (i >= altlar.length) U.depoGuncelle('plan', function (v) { v.biten = v.biten || {}; v.biten[kj.id + '|' + bol.id] = Date.now(); }, 300);
          mesaj('cv-o', '<b>' + U.esc(m) + '</b>');
          return Carvis.soyle(m).then(function () { if (Carvis.acik) Carvis.dongu(); });
        }
        return Carvis.soyle('Başlıyoruz: ' + (bol.kisa || bol.baslik)).then(parca);
      });
    }).catch(function (e) { Carvis.dersAktif = false; durum('Ders modu açılamadı: ' + (e.message || e)); });
  };
  Carvis._durum = durum;
  Carvis.gorselAc = gorselAc; Carvis.sahneIsaretle = sahneIsaretle; Carvis.sus = function () { Ses.sus(); };
  window.Carvis = Carvis;
  window.Carvis._test = { gorselAc: gorselAc, sahneIsaretle: sahneIsaretle, sayfaAc: sayfaAc, UYANDIRMA: UYANDIRMA, KAPAT: KAPAT, yankiMi: yankiMi, profilMetni: profilMetni, selamMetni: selamMetni, araclar: araclar, Profil: function () { return Profil; }, ayarPaneli: ayarPaneli };
  if (uyandirmaAcik) setTimeout(uyandirmaUygula, 1500);
  // Pil: uygulama görünmüyorsa ve "arka planda dinle" seçili değilse sürekli dinleme durur, geri gelince devam eder
  document.addEventListener('visibilitychange', function () {
    if (Carvis.acik) return;
    var arka = false; try { arka = !!(K && K.arkaPlanMi && K.arkaPlanMi()); } catch (e) {}
    if (document.hidden) { if (!arka) Ses.uyandirma(false); } else Ses.uyandirma(uyandirmaAcik);
  });
})();

/* 1001 — 📱 Ekran süresi (yalnız Android APK): hangi uygulamada ne kadar kalındığı, uygulama başına günlük sınır, ders süresiyle karşılaştırma.
   Veri cihazda kalır; yapay zekâya yalnız toplam süreler gider. */
(function () {
  'use strict';
  var K = window.AndroidKopru, U = window.Uygulama;
  if (!K || !K.kullanim || !U || /[?&]gomulu\b/.test(location.search)) return;
  var el = U.el;
  function bugun() { var d = new Date(); return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2); }
  function liste() { try { return JSON.parse(K.kullanim() || '[]').filter(function (x) { return x.paket !== 'com.dogac.bin1' && !/launcher|systemui|android$/.test(x.paket); }).sort(function (a, b) { return b.dk - a.dk; }); } catch (e) { return []; } }
  U.ekranSuresi = function () {
    if (!K.kullanimIzniVar()) return Promise.resolve('Kullanım erişimi izni verilmemiş (Plan sayfasından açılır).');
    return U.Depo.oku('sure').then(function (s) {
      var ders = 0, g = s[bugun()] || {}; Object.keys(g).forEach(function (k) { ders += g[k]; });
      return { ders_dk: Math.round(ders), uygulamalar: liste().slice(0, 8).map(function (x) { return x.ad + ': ' + x.dk + ' dk'; }) };
    });
  };
  // Plan sayfasına bölüm
  var planOnce = U.GORUNUMLER.plan;
  U.GORUNUMLER.plan = function () {
    planOnce.apply(this, arguments);
    var sayfa = document.querySelector('#ana .sayfa'); if (!sayfa) return;
    var kutu = el('section', { class: 'plan-gun', id: 'ekranSuresi' });
    kutu.appendChild(el('h3', { text: '📱 Ekran süresi (bugün)' }));
    sayfa.appendChild(kutu);
    if (!K.kullanimIzniVar()) {
      kutu.appendChild(el('p', { class: 'var-etiket', text: 'Hangi uygulamada ne kadar kaldığını görmek için "Kullanım erişimi" iznini ver. Veri yalnız bu tablette kalır.' }));
      kutu.appendChild(el('button', { class: 'dugme kucuk ana', type: 'button', onclick: function () { K.kullanimIzniAc(); } }, ['İzni aç']));
      return;
    }
    Promise.all([U.Depo.oku('ekran'), U.Depo.oku('sure')]).then(function (r) {
      var ayar = r[0]; ayar.sinir = ayar.sinir || {};
      var g = r[1][bugun()] || {}, ders = 0; Object.keys(g).forEach(function (k) { ders += g[k]; });
      var l = liste(), top = l.reduce(function (s, x) { return s + x.dk; }, 0);
      kutu.appendChild(el('p', { text: 'Ders (⏱ ile kaydedilen): ' + Math.round(ders) + ' dk · diğer uygulamalar: ' + top + ' dk' }));
      l.slice(0, 10).forEach(function (x) {
        var s = el('input', { type: 'number', min: '0', step: '15', value: ayar.sinir[x.paket] || '', placeholder: 'sınır', style: 'width:80px', 'aria-label': x.ad + ' günlük sınır (dk)' });
        s.addEventListener('change', function () { U.depoGuncelle('ekran', function (v) { v.sinir = v.sinir || {}; v.sinir[x.paket] = +s.value || null; }, 300); });
        var asim = ayar.sinir[x.paket] && x.dk >= ayar.sinir[x.paket];
        kutu.appendChild(el('div', { class: 'plan-is' }, [el('span', { class: 'ad', text: (asim ? '⚠️ ' : '') + x.ad + ' · ' + x.dk + ' dk' }), el('small', { text: 'günlük sınır (dk)' }), s]));
      });
      if (!l.length) kutu.appendChild(el('p', { class: 'var-etiket', text: 'Bugün kayıt yok.' }));
    });
  };
  // 5 dakikada bir sınır kontrolü: aşılırsa günde bir kez sesli uyarı
  var uyarilan = {};
  setInterval(function () {
    if (!K.kullanimIzniVar()) return;
    U.Depo.oku('ekran').then(function (ayar) {
      var sinir = ayar.sinir || {}, gun = bugun();
      liste().forEach(function (x) {
        var k = gun + x.paket;
        if (sinir[x.paket] && x.dk >= sinir[x.paket] && !uyarilan[k]) {
          uyarilan[k] = 1;
          var m = x.ad + ' için koyduğun ' + sinir[x.paket] + ' dakikalık sınır doldu. Derse dönmeye ne dersin?';
          U.toast(m); try { K.konus(m, 'ekran' + Date.now(), '1'); } catch (e) {}
        }
      });
    });
  }, 300000);
})();
