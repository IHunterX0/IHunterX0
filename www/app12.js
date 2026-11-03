/* 1001 — 📅 Çalışma planı (sınav tarihine göre günlük plan, kendini kaydırır) ve ⏱ çalışma saati (pomodoro + derse göre süre kaydı) */
(function () {
  'use strict';
  var U = window.Uygulama;
  var el = U.el, $ = U.$, toast = U.toast, Kitaplik = U.Kitaplik, Durum = U.Durum, Depo = U.Depo;
  var GUN = 86400000;
  function bugun() { var d = new Date(); return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2); }
  function gunFark(t) { var a = new Date(bugun() + 'T00:00:00'), b = new Date(t + 'T00:00:00'); return Math.round((b - a) / GUN); }

  /* ================= ⏱ çalışma saati (pomodoro 2) =================
     Hazır düzenler (25/5, 50/10, 90/20, 15/3) ya da özel; her N çalışmada uzun mola; otomatik geçiş; seans hedefi
     (bugünkü plandan ya da açık bölüm); duraklat/atla; yenilemede kaldığı yerden sürer (localStorage);
     zil + sesli haber; mola önerisi; "aklıma geldi" notu (dikkat dağıtanı yaz, sonra bak);
     çalışma bitince 3 soruluk hızlı tekrar (o bölümün çıkmış sorularından, yapay zekâsız);
     günlük hedef, seri (gün), son 7 gün çubukları. Carvis için U.Pomodoro API. */
  var VARSAYILAN = { calis: 25, mola: 5, uzunMola: 15, dongu: 4, otomatik: true, sesli: true, zil: true, hedef: 120, tekrar: true, otoBaslat: true };
  var DUZENLER = [
    { ad: 'Klasik', calis: 25, mola: 5, uzunMola: 15, dongu: 4, not: 'Yeni konu, dikkat dağınıkken' },
    { ad: 'Derin', calis: 50, mola: 10, uzunMola: 20, dongu: 3, not: 'Okuma + not çıkarma' },
    { ad: 'Uzun blok', calis: 90, mola: 20, uzunMola: 30, dongu: 2, not: 'Sınava yakın, akıştayken' },
    { ad: 'Isınma', calis: 15, mola: 3, uzunMola: 10, dongu: 4, not: 'Başlamakta zorlanınca' }
  ];
  var MOLA_ONERI = ['Kalk, bir bardak su iç.', '20-20-20: 20 saniye boyunca 20 adım uzağa bak.', 'Omuzlarını ve boynunu esnet.', 'Pencereyi aç, birkaç derin nefes al.', 'Telefona bakma; kısa bir yürüyüş yap.', 'Az önce okuduğunu kitaba bakmadan kendine bir cümleyle anlat.'];
  var Saat = { calisiyor: false, duraklatildi: false, mod: 'calis', bitis: 0, kalanMs: 0, sayac: 0, hedef: null };
  function ayarlar() { return Depo.oku('plan').then(function (v) { v.pomodoro = Object.assign({}, VARSAYILAN, v.pomodoro || {}); return v; }); }
  function sakla() { try { localStorage.setItem('pomodoroDurum', JSON.stringify(Saat)); } catch (e) {} }
  try { var _s = JSON.parse(localStorage.getItem('pomodoroDurum') || 'null'); if (_s && _s.calisiyor && (_s.duraklatildi || _s.bitis > Date.now() - 3600000)) Object.assign(Saat, _s); } catch (e) {}
  var cip = el('button', { id: 'saatCip', type: 'button', title: 'Çalışma saati (pomodoro)', 'aria-label': 'Çalışma saati' }, ['⏱']);
  var css = document.createElement('style');
  css.textContent = '#saatCip{position:fixed;left:16px;bottom:calc(16px + env(safe-area-inset-bottom,0px));z-index:59;height:40px;min-width:40px;padding:0 10px;border-radius:20px;border:1px solid var(--cizgi-guclu);background:rgba(6,12,17,.92);color:var(--metin);font:600 14px var(--f-kod);font-variant-numeric:tabular-nums}#saatCip.calis{border-color:var(--iyi);color:var(--iyi)}#saatCip.mola{border-color:var(--uyari);color:var(--uyari)}#saatCip.dur{opacity:.7;border-style:dashed}' +
    '.pm-halka{display:grid;place-items:center;margin:8px auto 4px;width:190px;height:190px;position:relative}.pm-halka svg{position:absolute;inset:0;transform:rotate(-90deg)}.pm-halka .pm-sure{font:700 38px var(--f-kod);font-variant-numeric:tabular-nums}.pm-halka .pm-mod{font-size:12px;color:var(--metin-sonuk);text-align:center}' +
    '.pm-duzen{display:flex;flex-wrap:wrap;gap:6px;margin:6px 0}.pm-duzen button[aria-pressed=true]{border-color:var(--vurgu);color:var(--vurgu)}.pm-ayar{display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:6px 10px;font-size:13px;margin:8px 0}.pm-ayar label{display:flex;gap:6px;align-items:center;justify-content:space-between}.pm-ayar input[type=number]{width:62px;background:var(--zemin);border:1px solid var(--cizgi);border-radius:6px;color:var(--metin);padding:3px 5px}' +
    '.pm-noktalar{display:flex;gap:5px;justify-content:center;margin:2px 0 8px}.pm-noktalar i{width:9px;height:9px;border-radius:50%;border:1px solid var(--iyi)}.pm-noktalar i.d{background:var(--iyi)}' +
    '.pm-gun{display:flex;align-items:flex-end;gap:6px;height:90px;margin:6px 0 2px}.pm-gun div{flex:1;display:flex;flex-direction:column;align-items:center;gap:3px;font-size:11px;color:var(--metin-sonuk)}.pm-gun b{display:block;width:100%;max-width:26px;border-radius:4px 4px 0 0;background:var(--vurgu);min-height:2px}.pm-gun .hedefte b{background:var(--iyi)}' +
    '.pm-seans{width:100%;background:var(--zemin);border:1px solid var(--cizgi);border-radius:6px;color:var(--metin);padding:5px}.pm-tekrar{border:1px solid var(--cizgi);border-radius:var(--r);padding:8px 10px;margin:8px 0}.pm-tekrar .sik{display:block;width:100%;text-align:left;margin:4px 0}' +
    '.plan-gun{border:1px solid var(--cizgi);border-radius:var(--r);padding:10px 12px;margin:10px 0}.plan-gun h3{margin:0 0 6px}.plan-is{display:flex;flex-wrap:wrap;gap:6px 10px;align-items:center;padding:6px 0;border-top:1px dashed var(--cizgi)}.plan-is:first-of-type{border-top:0}.plan-is .ad{flex:1;min-width:200px}.plan-is.bitti .ad{text-decoration:line-through;opacity:.6}.plan-is small{color:var(--metin-sonuk)}' +
    '.plan-form{display:grid;gap:8px;grid-template-columns:repeat(auto-fit,minmax(220px,1fr))}.plan-form label{display:grid;gap:4px;font-size:13px}.plan-form input{background:var(--zemin);border:1px solid var(--cizgi);border-radius:var(--r);color:var(--metin);padding:6px 8px;font:14px var(--f-govde)}.plan-cubuk{height:8px;border-radius:4px;background:rgba(255,255,255,.06);overflow:hidden}.plan-cubuk i{display:block;height:100%;background:var(--vurgu)}';
  document.head.appendChild(css);
  document.body.appendChild(cip);
  function kalanMs() { return Saat.duraklatildi ? Saat.kalanMs : Math.max(0, Saat.bitis - Date.now()); }
  function mmss(ms) { var s = Math.round(ms / 1000); return Math.floor(s / 60) + ':' + ('0' + s % 60).slice(-2); }
  function cipCiz() {
    if (!Saat.calisiyor) { cip.textContent = '⏱'; cip.className = ''; return; }
    cip.textContent = (Saat.mod === 'calis' ? '📖 ' : '☕ ') + mmss(kalanMs()) + (Saat.duraklatildi ? (U.pomodoroOto && U.pomodoroOto.otoDurdu ? (U.pomodoroOto.disarida ? ' ⏸ çalışma dışı' : ' ⏸ uzaktasın') : ' ⏸') : '');
    cip.className = Saat.mod === 'calis' ? 'calis' : 'mola'; if (Saat.duraklatildi) cip.className += ' dur';
    if (Saat._ciz) Saat._ciz();
  }
  function sureKaydet(dk) {
    if (dk <= 0) return;
    var ders = Saat.hedef && Saat.hedef.kitap ? Saat.hedef.kitap : Durum.aktifKitap ? Durum.aktifKitap.id : 'genel';
    U.depoGuncelle('sure', function (v) { var g = v[bugun()] = v[bugun()] || {}; g[ders] = Math.round(((g[ders] || 0) + dk) * 10) / 10; }, 500);
  }
  function zil(kez) {
    try {
      var C = window.AudioContext || window.webkitAudioContext; if (!C) return;
      var ac = zil.ac = zil.ac || new C(); if (ac.state === 'suspended') ac.resume(); var t = ac.currentTime;
      clearTimeout(zil.z); zil.z = setTimeout(function () { try { ac.suspend(); } catch (e) {} }, 2000); // ses odağını tutmasın (Spotify'ı durdurmasın)
      for (var i = 0; i < (kez || 2); i++) {
        var o = ac.createOscillator(), g = ac.createGain();
        o.type = 'sine'; o.frequency.value = i % 2 ? 660 : 880; o.connect(g); g.connect(ac.destination);
        g.gain.setValueAtTime(0.0001, t + i * 0.28); g.gain.exponentialRampToValueAtTime(0.25, t + i * 0.28 + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t + i * 0.28 + 0.26);
        o.start(t + i * 0.28); o.stop(t + i * 0.28 + 0.27);
      }
    } catch (e) {}
    try { if (navigator.vibrate) navigator.vibrate([120, 80, 120]); } catch (e) {}
  }
  function sesliSoyle(m) {
    if (window.carvisSoyle) return window.carvisSoyle(m); // Carvis açıksa kendi sesiyle (dinlemeyle çakışmaz)
    if (window.AndroidKopru) try { window.AndroidKopru.konus(m, 'saat' + Date.now(), '1'); } catch (e) {}
    else if ('speechSynthesis' in window) try { var u = new SpeechSynthesisUtterance(m); u.lang = 'tr-TR'; speechSynthesis.speak(u); } catch (e) {}
  }
  function pomodoroKaydet(dk) {
    U.depoGuncelle('pomodoro', function (v) { v.gun = v.gun || {}; var g = v.gun[bugun()] = v.gun[bugun()] || { adet: 0, dk: 0 }; g.adet++; g.dk += dk; v.saat = v.saat || {}; var sa = new Date().getHours(); v.saat[sa] = (v.saat[sa] || 0) + 1; }, 500);
  }
  var sonDakika = 0;
  function gecis() {
    ayarlar().then(function (a) {
      var p = a.pomodoro, m;
      if (Saat.mod === 'calis') {
        Saat.sayac++; pomodoroKaydet(p.calis);
        var uzun = Saat.sayac % Math.max(1, p.dongu) === 0;
        Saat.mod = uzun ? 'uzun' : 'mola';
        var dk = uzun ? p.uzunMola : p.mola;
        m = (uzun ? 'Harika, ' + Saat.sayac + '. pomodoro bitti. Uzun mola: ' : 'Mola zamanı: ') + dk + ' dakika. ' + MOLA_ONERI[Math.floor(Math.random() * MOLA_ONERI.length)];
        Saat.bitis = Date.now() + dk * 60000;
        if (p.tekrar) Saat.tekrarBekliyor = true;
      } else {
        Saat.mod = 'calis'; Saat.bitis = Date.now() + p.calis * 60000; sonDakika = Date.now();
        m = 'Mola bitti. ' + (Saat.hedef ? Saat.hedef.ad + ' ile devam.' : 'Çalışmaya devam.');
      }
      if (!p.otomatik) { Saat.duraklatildi = true; Saat.kalanMs = Saat.bitis - Date.now(); m += ' Başlamak için saate dokun.'; }
      sakla(); if (p.zil) zil(Saat.mod === 'calis' ? 2 : 3); toast(m); if (p.sesli) sesliSoyle(m);
      if (Saat.tekrarBekliyor && Saat.mod !== 'calis' && !Saat._ciz) { /* panel kapalı: çipte işaret */ cip.title = 'Hızlı tekrar hazır — dokun'; }
      cipCiz();
    });
  }
  function tik() {
    if (!Saat.calisiyor || Saat.duraklatildi) return cipCiz();
    if (Saat.mod === 'calis' && Date.now() - sonDakika >= 60000) { sonDakika = Date.now(); sureKaydet(1); }
    if (Date.now() >= Saat.bitis && !Saat._geciyor) { Saat._geciyor = true; gecis(); setTimeout(function () { Saat._geciyor = false; }, 1500); }
    cipCiz();
  }
  setInterval(tik, 1000);
  document.addEventListener('visibilitychange', function () { if (!document.hidden) tik(); });
  var Pomodoro = U.Pomodoro = {
    anlik: function () { return { calisiyor: !!(Saat.calisiyor && !Saat.duraklatildi), mod: Saat.mod }; }, // müzik önerisi bağlamı
    baslat: function (dk, hedef, oto) {
      return ayarlar().then(function (a) {
        if (dk) U.depoGuncelle('plan', function (v) { v.pomodoro = Object.assign({}, VARSAYILAN, v.pomodoro || {}, { calis: Math.max(5, Math.min(180, +dk)) }); }, 300);
        var c = dk ? +dk : a.pomodoro.calis;
        Object.assign(Saat, { calisDk: c, calisiyor: true, duraklatildi: false, mod: 'calis', bitis: Date.now() + c * 60000, hedef: hedef || Saat.hedef || null, tekrarBekliyor: false });
        if (!Saat.ilk || Date.now() - Saat.ilk > 12 * 3600000) { Saat.sayac = 0; Saat.ilk = Date.now(); }
        sonDakika = Date.now(); sakla(); cipCiz();
        if (!oto && Saat.hedef && Saat.hedef.kitap != null && Saat.hedef.sira != null && U.okuHash) U.git(U.okuHash(Saat.hedef.kitap, Saat.hedef.sira));
        return c + ' dakikalık pomodoro başladı' + (Saat.hedef ? ': ' + Saat.hedef.ad : '') + '.';
      });
    },
    duraklat: function () { if (!Saat.calisiyor) return 'Çalışan saat yok.'; if (Saat.duraklatildi) { Saat.duraklatildi = false; Saat.bitis = Date.now() + Saat.kalanMs; sonDakika = Date.now(); sakla(); cipCiz(); return 'Devam ediyor.'; } Saat.duraklatildi = true; Saat.kalanMs = Saat.bitis - Date.now(); sakla(); cipCiz(); return 'Duraklatıldı.'; },
    atla: function () { if (!Saat.calisiyor) return 'Çalışan saat yok.'; Saat.duraklatildi = false; Saat.bitis = Date.now(); tik(); return 'Sonraki aşamaya geçildi.'; },
    durdur: function () { Saat.calisiyor = false; Saat.duraklatildi = false; sakla(); cipCiz(); return 'Saat durdu.'; },
    durum: function () {
      return Promise.all([Depo.oku('pomodoro'), Depo.oku('sure'), ayarlar()]).then(function (r) {
        var g = (r[0].gun || {})[bugun()] || { adet: 0, dk: 0 }, s = r[1][bugun()] || {}, top = 0; Object.keys(s).forEach(function (k) { top += s[k]; });
        return { calisiyor: Saat.calisiyor, mod: Saat.mod, kalan: Saat.calisiyor ? mmss(kalanMs()) : null, duraklatildi: Saat.duraklatildi, hedef: Saat.hedef ? Saat.hedef.ad : null,
          bugun_pomodoro: g.adet, bugun_dakika: Math.round(top), gunluk_hedef_dk: r[2].pomodoro.hedef, seri_gun: seri(r[1], r[2].pomodoro.hedef), ayar: r[2].pomodoro };
      });
    }
  };
  /* ---- Otomatik pomodoro (kullanıcı, 2026-11-02: "kendi kendine çalışsın, manuel kurmayayım") ----
     Çalışma ekranı açılınca (okuma, kartlar, test, saray, 3B anatomi) başlar; 4 dk hareketsizlikte ya da uygulamadan çıkınca
     duraklar, ilk dokunuşta/dönüşte sürer; 25 dk hiç dönülmezse biter. Molalar kendi akışında. Ayar: "Otomatik başlat / duraklat". */
  var Oto = { sonHareket: Date.now(), otoDurdu: false, gizliBas: 0, disarida: 0, soruyor: false };
  var bmCss = document.createElement('style');
  bmCss.textContent = '.bm-kutu{position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);z-index:1200;width:min(360px,86vw);padding:22px 20px 18px;border-radius:24px;text-align:center;color:#e9fffb;' +
    'background:radial-gradient(120% 100% at 50% 0%,rgba(94,240,220,.16),rgba(2,12,16,.92) 70%);box-shadow:0 0 0 1px rgba(110,255,235,.5),0 0 60px rgba(94,240,220,.3);animation:bmGir .4s cubic-bezier(.2,.9,.2,1.2)}' +
    '@keyframes bmGir{from{opacity:0;transform:translate(-50%,-46%) scale(.9)}}.bm-kutu h3{margin:6px 0 4px;font-size:22px;letter-spacing:.04em;text-shadow:0 0 14px rgba(94,240,220,.7)}.bm-kutu p{margin:0 0 14px;color:#bfe9e3;font-size:14px}' +
    '.bm-halka{width:84px;height:84px;margin:0 auto}.bm-halka circle{transition:stroke-dashoffset 1s linear}.bm-kutu .dugme{margin:4px}';
  document.head.appendChild(bmCss);
  function buradaMisin(bos) {
    Oto.soruyor = true;
    var SURE = 45, kalan = SURE, C = 2 * Math.PI * 36;
    var halka = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); halka.setAttribute('viewBox', '0 0 84 84'); halka.setAttribute('class', 'bm-halka');
    halka.innerHTML = '<circle cx="42" cy="42" r="36" fill="none" stroke="rgba(94,240,220,.15)" stroke-width="5"/><circle cx="42" cy="42" r="36" fill="none" stroke="#5ef0dc" stroke-width="5" stroke-linecap="round" stroke-dasharray="' + C + '" stroke-dashoffset="0" transform="rotate(-90 42 42)" style="filter:drop-shadow(0 0 6px #5ef0dc)"/><text x="42" y="49" text-anchor="middle" fill="#effffc" style="font:300 20px monospace">' + SURE + '</text>';
    var kutu = el('div', { class: 'bm-kutu', role: 'alertdialog', 'aria-label': 'Burada mısın?' }, [halka, el('h3', { text: 'Burada mısın?' }),
      el('p', { text: Math.round(bos / 60000) + ' dakikadır ekrana dokunmadın. Cevap gelmezse pomodoro durur ve bu süre çalışmaya sayılmaz.' })]);
    var evet = el('button', { class: 'dugme ana', type: 'button', text: '✋ Buradayım' }), mola = el('button', { class: 'dugme', type: 'button', text: '☕ Mola ver' });
    kutu.appendChild(evet); kutu.appendChild(mola); document.body.appendChild(kutu);
    try { if (window.Carvis && window.Carvis.soyle && !window.Carvis.konusuyor && localStorage.getItem('bm_ses') !== '0') window.Carvis.soyle('Burada mısın?'); } catch (e) {}
    var z = setInterval(function () {
      kalan--; var c2 = halka.querySelectorAll('circle')[1]; c2.setAttribute('stroke-dashoffset', String(C * (1 - kalan / SURE))); halka.querySelector('text').textContent = String(Math.max(0, kalan));
      if (kalan <= 0) bitir(false);
    }, 1000);
    function bitir(burada) {
      clearInterval(z); kutu.remove(); Oto.soruyor = false;
      if (burada) { Oto.sonHareket = Date.now(); toast('⏱ Devam.'); return; }
      if (!Saat.calisiyor || Saat.duraklatildi) return;
      // yokken geçen süre (son hareketten bu yana) sayaca geri eklenir
      var yok = Date.now() - Oto.sonHareket;
      Oto.otoDurdu = true; Pomodoro.duraklat();
      if (Saat.duraklatildi && Saat.kalanMs != null) { Saat.kalanMs = Math.min(Saat.kalanMs + yok, ((Saat.calisDk || 25) * 60000)); sakla(); cipCiz(); }
      // bugünkü çalışma süresinden de düş (dakika dakika sayılmıştı)
      var dusDk = Math.floor(yok / 60000); if (dusDk > 0) { var ders = Saat.hedef && Saat.hedef.kitap ? Saat.hedef.kitap : Durum.aktifKitap ? Durum.aktifKitap.id : 'genel';
        U.depoGuncelle('sure', function (v) { var g = v[bugun()] = v[bugun()] || {}; g[ders] = Math.max(0, Math.round(((g[ders] || 0) - dusDk) * 10) / 10); }, 300); }
      toast('⏸ Pomodoro durdu (' + Math.round(yok / 60000) + ' dk yokken geçen süre sayılmadı). Dokununca devam eder.');
    }
    evet.addEventListener('click', function () { bitir(true); });
    mola.addEventListener('click', function () { clearInterval(z); kutu.remove(); Oto.soruyor = false; Oto.otoDurdu = false; if (Saat.calisiyor && !Saat.duraklatildi) Pomodoro.duraklat(); toast('☕ Mola: hazır olunca saatten devam et.'); });
    // dokunma = buradayım (kutunun dışına dokunsa da)
    setTimeout(function () { document.addEventListener('pointerdown', function d(e) { if (!kutu.isConnected) return document.removeEventListener('pointerdown', d, true); if (e.target.closest('.bm-kutu')) return; document.removeEventListener('pointerdown', d, true); bitir(true); }, true); }, 300);
  }
  var CALISMA_EKRANI = /^#(oku-|kartlar|test|saray-|lab-anatomi|lab-molekul|lab-hareket)/;
  function otoAcik() { return ayarlar().then(function (a) { return a.pomodoro.otoBaslat !== false; }); }
  function calismaHedefi() { var kj = Durum.aktifKitap, b = Durum.aktifBolum; return kj && b && /^#oku-/.test(location.hash) ? { kitap: kj.id, sira: b.sira, ad: kj.baslik.replace(/^1001\s*/, '') + ' · ' + (b.kisa || b.baslik) } : null; }
  function hareket() {
    Oto.sonHareket = Date.now();
    if (Saat.calisiyor && Saat.duraklatildi && Oto.otoDurdu && CALISMA_EKRANI.test(location.hash)) { Oto.otoDurdu = false; Oto.disarida = 0; Pomodoro.duraklat(); toast('⏱ Devam ediyor.'); }
  }
  ['pointerdown', 'keydown', 'wheel', 'touchstart'].forEach(function (ev) { document.addEventListener(ev, hareket, { passive: true, capture: true }); });
  window.addEventListener('scroll', hareket, { passive: true, capture: true });
  function otoBaslat() {
    if (Saat.calisiyor || !CALISMA_EKRANI.test(location.hash)) return;
    otoAcik().then(function (acik) {
      if (!acik || Saat.calisiyor) return;
      var h = calismaHedefi(); Oto.sonHareket = Date.now(); Oto.otoDurdu = false;
      Pomodoro.baslat(null, h, true).then(function (m) { toast('⏱ Pomodoro kendiliğinden başladı' + (h ? ': ' + h.ad : '') + '. Uzaklaşırsan duraklar.'); });
    });
  }
  window.addEventListener('hashchange', function () {
    if (!Saat.calisiyor) { setTimeout(otoBaslat, 1500); return; }
    otoAcik().then(function (acik) {
      if (!acik) return;
      var calisma = CALISMA_EKRANI.test(location.hash);
      if (!calisma && Saat.mod === 'calis' && !Saat.duraklatildi) { Oto.otoDurdu = true; Oto.disarida = Date.now(); Pomodoro.duraklat(); toast('⏸ Çalışma ekranından çıktın: pomodoro durdu. Dönünce devam eder.'); }
      else if (calisma && Saat.duraklatildi && Oto.otoDurdu) { Oto.otoDurdu = false; Oto.disarida = 0; Pomodoro.duraklat(); toast('⏱ Devam ediyor.'); }
    });
  });
  setTimeout(otoBaslat, 3000);
  // açık bölüm değişince seans hedefi de güncellensin (yalnız çalışma sırasında, okuma ekranında)
  window.addEventListener('hashchange', function () { setTimeout(function () { if (Saat.calisiyor && Saat.mod === 'calis') { var h = calismaHedefi(); if (h) { Saat.hedef = h; sakla(); } } }, 1600); });
  setInterval(function () {
    if (!Saat.calisiyor) return;
    otoAcik().then(function (acik) {
      if (!acik) return;
      var bos = Date.now() - Oto.sonHareket, carvisAcik = !!(window.Carvis && window.Carvis.acik);
      if (carvisAcik) { Oto.sonHareket = Date.now(); return; }
      // kullanıcı, 2026-11-03: "ekrana uzun süre dokunmazsam burada mısın diye sorsun, durdursun" — önce sorar (45 sn), cevap yoksa
      // durdurur ve yokken geçen süreyi çalışmaya saymaz. Okuma ekranında eşik daha uzun (uzun paragraf okurken dokunmamak doğal).
      var esik = (/^#oku-/.test(location.hash) ? 8 : 4) * 60000;
      if (Saat.mod === 'calis' && !Saat.duraklatildi && bos > esik && !Oto.soruyor) buradaMisin(bos);
      if (Saat.duraklatildi && Oto.otoDurdu && (bos > 25 * 60000 || (Oto.disarida && Date.now() - Oto.disarida > 25 * 60000))) { Oto.otoDurdu = false; Oto.disarida = 0; Pomodoro.durdur(); }
    });
  }, 15000);
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) { Oto.gizliBas = Date.now(); return; }
    var bos = Oto.gizliBas ? Date.now() - Oto.gizliBas : 0; Oto.gizliBas = 0;
    if (bos > 60000) hareket(); // dönüşte devam (uzun süre yoksa yukarıdaki döngü zaten durdurmuştu)
  });
  // uygulamadan çıkınca (sekme/uygulama arka planda) 1 dk sonra duraklat
  setInterval(function () {
    if (document.hidden && Oto.gizliBas && Saat.calisiyor && Saat.mod === 'calis' && !Saat.duraklatildi && Date.now() - Oto.gizliBas > 60000) { Oto.otoDurdu = true; Pomodoro.duraklat(); Oto.sonHareket = Oto.gizliBas; }
  }, 15000);
  U.pomodoroOto = Oto;
  function gunAnahtar(i) { var d = new Date(Date.now() - i * GUN); return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2); }
  function gunToplam(sure, k) { var t = 0, g = sure[k] || {}; Object.keys(g).forEach(function (x) { t += g[x]; }); return t; }
  // seri: hedefin en az yarısına ulaşılan ardışık gün (bugün henüz ulaşılmadıysa dünden sayılır)
  function seri(sure, hedef) { var n = 0, esik = Math.max(15, (hedef || 120) / 2); for (var i = 0; i < 400; i++) { var t = gunToplam(sure, gunAnahtar(i)); if (t >= esik) n++; else if (i > 0) break; } return n; }
  // 3 soruluk hızlı tekrar: seansın bölümündeki çıkmış sorulardan (yanlış → eksikler)
  function hizliTekrar(kap) {
    var h = Saat.hedef || (Durum.aktifKitap && Durum.aktifBolum ? { kitap: Durum.aktifKitap.id, sira: Durum.aktifBolum.sira, ad: Durum.aktifBolum.kisa || Durum.aktifBolum.baslik } : null);
    Saat.tekrarBekliyor = false; sakla(); cip.title = 'Çalışma saati (pomodoro)';
    if (!h || h.kitap == null) { kap.appendChild(el('p', { class: 'var-etiket', text: 'Hızlı tekrar için önce bir bölüm aç ya da seans hedefi seç.' })); return; }
    Promise.all([Kitaplik.ac(h.kitap), Kitaplik.sorular(h.kitap).catch(function () { return []; })]).then(function (r) {
      var b = r[0].bolumler[h.sira]; if (!b) return;
      var havuz = [];
      r[1].filter(function (q) { return q.bolum === b.id; }).forEach(function (q) { (q.varyantlar || []).forEach(function (v) { if (v.siklar && v.siklar.length && v.cevap) havuz.push({ q: q, v: v }); }); });
      if (!havuz.length) { kap.appendChild(el('p', { class: 'var-etiket', text: 'Bu bölümde çoktan seçmeli soru yok; az önce okuduğunu kitaba bakmadan bir cümleyle anlat.' })); return; }
      havuz.sort(function () { return Math.random() - 0.5; });
      var kutu = el('div', { class: 'pm-tekrar' }, [el('b', { text: '🧠 Hızlı tekrar · ' + (b.kisa || b.baslik) })]); kap.appendChild(kutu);
      var i = 0, dogru = 0, sec = havuz.slice(0, 3);
      (function soru() {
        if (i >= sec.length) { kutu.appendChild(el('p', { text: 'Sonuç: ' + dogru + '/' + sec.length + (dogru === sec.length ? ' — mükemmel.' : ' — yanlışlar Eksikler\'e eklendi.') })); return; }
        var x = sec[i], blok = el('div');
        blok.appendChild(el('p', { html: (i + 1) + '. ' + x.v.govde + ' <small>(' + U.esc(x.v.sinav || '') + ')</small>' }));
        x.v.siklar.forEach(function (s) {
          blok.appendChild(el('button', { class: 'dugme kucuk sik', type: 'button', html: '<b>' + s.h + ')</b> ' + s.m, onclick: function () {
            if (blok._bitti) return; blok._bitti = true;
            var ok = s.h === x.v.cevap; if (ok) dogru++;
            this.style.borderColor = ok ? 'var(--iyi)' : 'var(--hata,#ff6b6b)';
            if (!ok) { var d = x.v.siklar.filter(function (z) { return z.h === x.v.cevap; })[0]; blok.appendChild(el('p', { class: 'var-etiket', html: 'Doğru: <b>' + x.v.cevap + ') ' + (d ? d.m : '') + '</b>' }));
              if (U.eksikEkle) U.eksikEkle({ kitap: h.kitap, bolum: b.kisa || b.baslik, sira: h.sira, konu: x.q.konu || '', soru: U.duz ? U.duz(x.v.govde).slice(0, 160) : '', bilmiyor: false, kaynak: 'pomodoro' }); }
            i++; setTimeout(soru, ok ? 500 : 1400);
          } }));
        });
        kutu.appendChild(blok);
      })();
    });
  }
  function seansSecenekleri(sec) {
    sec.appendChild(el('option', { value: '', text: 'Açık bölüm / serbest' }));
    var plan = U.planBugunListe ? U.planBugunListe() : Promise.resolve([]);
    plan.then(function (l) {
      (l || []).filter(function (x) { return !x.tekrar && !x.akademikGorev; }).forEach(function (x, i) { sec.appendChild(el('option', { value: JSON.stringify({ kitap: x.kitap, sira: x.sira, ad: x.kitapAd + ' · ' + x.ad }), text: '📅 ' + x.kitapAd + ' · ' + x.ad + ' (' + x.dk + ' dk)', selected: Saat.hedef && Saat.hedef.kitap === x.kitap && Saat.hedef.sira === x.sira ? true : null })); });
      if (Durum.aktifKitap && Durum.aktifBolum) sec.appendChild(el('option', { value: JSON.stringify({ kitap: Durum.aktifKitap.id, sira: Durum.aktifBolum.sira, ad: Durum.aktifKitap.baslik.replace(/^1001\s*/, '') + ' · ' + (Durum.aktifBolum.kisa || Durum.aktifBolum.baslik) }), text: '📖 Açık: ' + (Durum.aktifBolum.kisa || Durum.aktifBolum.baslik) }));
    }).catch(function () {});
  }
  cip.addEventListener('click', function () {
    var govde = U.panelAc('⏱ Çalışma saati', 'Pomodoro · hedef · hızlı tekrar');
    ayarlar().then(function (a) {
      var p = a.pomodoro;
      // halka
      var R = 84, CEV = 2 * Math.PI * R;
      var halkaYol = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); svg.setAttribute('viewBox', '0 0 190 190');
      svg.innerHTML = '<circle cx="95" cy="95" r="' + R + '" fill="none" stroke="rgba(255,255,255,.08)" stroke-width="9"/>';
      [['cx', 95], ['cy', 95], ['r', R], ['fill', 'none'], ['stroke-width', 9], ['stroke-linecap', 'round'], ['stroke-dasharray', CEV]].forEach(function (k) { halkaYol.setAttribute(k[0], k[1]); });
      svg.appendChild(halkaYol);
      var sureEl = el('div', { class: 'pm-sure' }), modEl = el('div', { class: 'pm-mod' });
      govde.appendChild(el('div', { class: 'pm-halka' }, [svg, el('div', {}, [sureEl, modEl])]));
      var noktalar = el('div', { class: 'pm-noktalar', 'aria-hidden': 'true' }); govde.appendChild(noktalar);
      var basDug = el('button', { class: 'dugme ana', type: 'button' }), durDug = el('button', { class: 'dugme', type: 'button', onclick: function () { Pomodoro.duraklat(); ciz(); } }),
        atlaDug = el('button', { class: 'dugme', type: 'button', text: '⏭ Atla', onclick: function () { Pomodoro.atla(); } }),
        bitirDug = el('button', { class: 'dugme', type: 'button', text: '■ Bitir', onclick: function () { Pomodoro.durdur(); ciz(); } });
      govde.appendChild(el('div', { class: 'yp-dugmeler', style: 'justify-content:center' }, [basDug, durDug, atlaDug, bitirDug]));
      var seans = el('select', { class: 'pm-seans', 'aria-label': 'Bu seansın hedefi' }); seansSecenekleri(seans);
      govde.appendChild(el('label', { class: 'var-etiket', style: 'display:grid;gap:4px;margin:6px 0' }, ['Bu seansta ne çalışacaksın?', seans]));
      var tekrarKap = el('div'); govde.appendChild(tekrarKap);
      function ciz() {
        var top = Saat.mod === 'calis' ? p.calis : Saat.mod === 'uzun' ? p.uzunMola : p.mola, k = Saat.calisiyor ? kalanMs() : p.calis * 60000;
        sureEl.textContent = mmss(k);
        modEl.textContent = !Saat.calisiyor ? 'Hazır · ' + p.calis + '/' + p.mola + ' dk' : (Saat.mod === 'calis' ? '📖 Çalışma' : Saat.mod === 'uzun' ? '🌿 Uzun mola' : '☕ Mola') + (Saat.duraklatildi ? ' · duraklatıldı' : '') + (Saat.hedef ? '\n' + Saat.hedef.ad : '');
        halkaYol.setAttribute('stroke', Saat.mod === 'calis' ? 'var(--iyi)' : 'var(--uyari)');
        halkaYol.setAttribute('stroke-dashoffset', String(CEV * (1 - (Saat.calisiyor ? Math.max(0, Math.min(1, k / (top * 60000))) : 1))));
        basDug.textContent = Saat.calisiyor ? '↺ Baştan' : '▶ Başlat'; durDug.textContent = Saat.duraklatildi ? '▶ Devam' : '⏸ Duraklat';
        durDug.hidden = atlaDug.hidden = bitirDug.hidden = !Saat.calisiyor;
        noktalar.innerHTML = ''; for (var i = 0; i < Math.max(1, p.dongu); i++) noktalar.appendChild(el('i', { class: i < Saat.sayac % Math.max(1, p.dongu) ? 'd' : '' }));
        if (Saat.tekrarBekliyor && Saat.mod !== 'calis' && !tekrarKap.children.length) hizliTekrar(tekrarKap);
      }
      Saat._ciz = ciz;
      var gozlem = new MutationObserver(function () { if (!document.body.contains(govde)) { Saat._ciz = null; gozlem.disconnect(); } }); gozlem.observe(document.body, { childList: true, subtree: true });
      basDug.addEventListener('click', function () { var h = null; try { h = seans.value ? JSON.parse(seans.value) : null; } catch (e) {} Saat.hedef = h; Pomodoro.baslat(null, h).then(ciz); });
      // düzenler + ayarlar
      var duzenKap = el('div', { class: 'pm-duzen' });
      DUZENLER.forEach(function (d) {
        duzenKap.appendChild(el('button', { class: 'dugme kucuk', type: 'button', title: d.not, 'aria-pressed': String(p.calis === d.calis && p.mola === d.mola), onclick: function () {
          Object.assign(p, { calis: d.calis, mola: d.mola, uzunMola: d.uzunMola, dongu: d.dongu }); kaydetAyar(); alanlar(); [].forEach.call(duzenKap.children, function (b) { b.setAttribute('aria-pressed', 'false'); }); this.setAttribute('aria-pressed', 'true'); ciz();
        } }, [d.ad + ' ' + d.calis + '/' + d.mola]));
      });
      govde.appendChild(el('h4', { text: 'Düzen' })); govde.appendChild(duzenKap);
      var ayarKap = el('div', { class: 'pm-ayar' }); govde.appendChild(ayarKap);
      function kaydetAyar() { U.depoGuncelle('plan', function (v) { v.pomodoro = Object.assign({}, p); }, 300); }
      function sayi(ad, an, min, max) { var i = el('input', { type: 'number', min: String(min), max: String(max), value: String(p[an]) }); i.addEventListener('change', function () { p[an] = Math.max(min, Math.min(max, +i.value || VARSAYILAN[an])); i.value = p[an]; kaydetAyar(); ciz(); }); return el('label', {}, [ad, i]); }
      function kutu(ad, an) { var i = el('input', { type: 'checkbox', checked: p[an] ? true : null }); i.addEventListener('change', function () { p[an] = i.checked; kaydetAyar(); }); return el('label', {}, [ad, i]); }
      function alanlar() {
        ayarKap.innerHTML = '';
        [sayi('Çalış (dk)', 'calis', 5, 180), sayi('Mola (dk)', 'mola', 1, 60), sayi('Uzun mola', 'uzunMola', 5, 60), sayi('Uzun mola her', 'dongu', 1, 8), sayi('Günlük hedef (dk)', 'hedef', 15, 720),
          kutu('Otomatik geçiş', 'otomatik'), kutu('Sesli haber', 'sesli'), kutu('Zil + titreşim', 'zil'), kutu('Molada hızlı tekrar', 'tekrar'), kutu('Otomatik başlat / duraklat', 'otoBaslat')].forEach(function (x) { ayarKap.appendChild(x); });
      }
      alanlar();
      // aklıma geldi
      var not = el('input', { type: 'text', placeholder: 'Aklına gelen işi yaz, sonra bak (dikkatin dağılmasın)', style: 'flex:1;min-width:0;background:var(--zemin);border:1px solid var(--cizgi);border-radius:6px;color:var(--metin);padding:5px 7px' });
      var notListe = el('ul', { class: 'var-etiket' });
      function notlariCiz() { Depo.oku('pomodoro').then(function (v) { notListe.innerHTML = ''; (v.dikkat || []).slice(-6).reverse().forEach(function (n, i, l) { notListe.appendChild(el('li', {}, [n.m + ' ', el('button', { class: 'cip', type: 'button', text: '✓', title: 'Hallettim', onclick: function () { U.depoGuncelle('pomodoro', function (w) { w.dikkat = (w.dikkat || []).filter(function (z) { return z.t !== n.t; }); }, 200).then(notlariCiz); } })])); }); }); }
      govde.appendChild(el('h4', { text: '💭 Aklıma geldi' }));
      govde.appendChild(el('form', { style: 'display:flex;gap:6px', onsubmit: function (e) { e.preventDefault(); var m = not.value.trim(); if (!m) return; not.value = ''; U.depoGuncelle('pomodoro', function (v) { v.dikkat = (v.dikkat || []).concat([{ m: m, t: Date.now() }]).slice(-30); }, 200).then(notlariCiz); } }, [not, el('button', { class: 'dugme kucuk', type: 'submit', text: 'Ekle' })]));
      govde.appendChild(notListe); notlariCiz();
      // istatistik
      var ozet = el('div'); govde.appendChild(ozet);
      Promise.all([Depo.oku('sure'), Kitaplik.katalog(), Depo.oku('pomodoro')]).then(function (r) { ozet.appendChild(sureOzeti(r[0], r[1], r[2], p)); });
      ciz();
    });
  });
  function sureOzeti(sure, kitaplar, pom, p) {
    var ad = {}; kitaplar.forEach(function (k) { ad[k.id] = k.baslik.replace(/^1001\s*/, ''); }); ad.genel = 'Genel';
    var bu = sure[bugun()] || {}, hafta = {}, bugunTop = gunToplam(sure, bugun()), pg = ((pom || {}).gun || {})[bugun()] || { adet: 0 };
    for (var i = 0; i < 7; i++) { var k = gunAnahtar(i); Object.keys(sure[k] || {}).forEach(function (x) { hafta[x] = (hafta[x] || 0) + sure[k][x]; }); }
    var kap = el('div');
    kap.appendChild(el('h4', { text: 'Bugün: ' + Math.round(bugunTop) + ' / ' + p.hedef + ' dk · ' + pg.adet + ' pomodoro · 🔥 ' + seri(sure, p.hedef) + ' gün seri' }));
    kap.appendChild(el('div', { class: 'plan-cubuk' }, [el('i', { style: 'width:' + Math.min(100, Math.round(bugunTop / p.hedef * 100)) + '%' })]));
    var l = el('ul'); Object.keys(bu).forEach(function (x) { l.appendChild(el('li', { text: (ad[x] || x) + ': ' + Math.round(bu[x]) + ' dk' })); }); if (!l.children.length) l.appendChild(el('li', { text: 'Henüz kayıt yok.' }));
    kap.appendChild(l);
    kap.appendChild(el('h4', { text: 'Son 7 gün' }));
    var cubuk = el('div', { class: 'pm-gun' }), enCok = 1, gunler = [];
    for (var j = 6; j >= 0; j--) { var t = gunToplam(sure, gunAnahtar(j)); gunler.push({ t: t, ad: ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'][new Date(Date.now() - j * GUN).getDay()] }); enCok = Math.max(enCok, t, p.hedef); }
    gunler.forEach(function (g) { cubuk.appendChild(el('div', { class: g.t >= p.hedef ? 'hedefte' : '', title: Math.round(g.t) + ' dk' }, [el('span', { text: g.t ? String(Math.round(g.t)) : '' }), el('b', { style: 'height:' + Math.round(g.t / enCok * 64) + 'px' }), el('span', { text: g.ad })])); });
    kap.appendChild(cubuk);
    var l2 = el('ul'); Object.keys(hafta).forEach(function (x) { l2.appendChild(el('li', { text: (ad[x] || x) + ': ' + (hafta[x] / 60).toFixed(1) + ' saat' })); }); if (!l2.children.length) l2.appendChild(el('li', { text: 'Henüz kayıt yok.' }));
    kap.appendChild(l2);
    return kap;
  }
  U.saatAc = function () { cip.click(); };

  /* ================= 📅 çalışma planı ================= */
  // Her bölüm için öncelik puanı: ★ toplamı + 🔥×2 + yanlış×3 + ölçülen seviye düşükse +, okunmuşsa −. Süre: alt bölüm başına ~6 dk + metin uzunluğu.
  function bolumVerisi(kayit) {
    return Promise.all([Kitaplik.ac(kayit.id), Kitaplik.sorular(kayit.id).catch(function () { return []; }), Depo.oku('sonuclar-' + kayit.id), Depo.oku('ilerleme'), Depo.oku('seviye')]).then(function (r) {
      var kj = r[0], sorular = r[1], sonuc = r[2] || {}, ilerleme = r[3] || {}, seviye = (r[4] || {})[kayit.id] || {};
      var okunan = (ilerleme.okunan || {})[kayit.id] || {};
      return kj.bolumler.map(function (b, i) {
        if (b.ozel) return null; // deneme sınavı, sözlük gibi özel bölümler konu değil
        var qs = sorular.filter(function (q) { return q.bolum === b.id; });
        var yildiz = 0, ates = 0, yanlis = 0;
        qs.forEach(function (q) { yildiz += (q.onem && q.onem.yildiz) || 0; if (q.onem && q.onem.ates) ates++; Object.keys(sonuc).forEach(function (k) { if (k.indexOf(q.id + ':') === 0 && sonuc[k][2] === 0) yanlis++; }); });
        var altlar = b.altlar || [], okundu = altlar.filter(function (a) { return okunan[a.id]; }).length;
        var olcum = seviye.olcum && seviye.olcum[b.id];
        var oran = altlar.length ? okundu / altlar.length : 0;
        var puan = yildiz + ates * 2 + yanlis * 3 + (olcum ? (5 - olcum.seviye) * 2 : 2) + qs.length * 0.3;
        var dk = Math.max(15, Math.round(altlar.length * 6 * (1 - oran * 0.6)));
        return { kitap: kayit.id, kitapAd: kj.baslik.replace(/^1001\s*/, ''), sira: i, bolumId: b.id, ad: b.kisa || b.baslik, puan: Math.round(puan * 10) / 10, dk: dk, oran: oran,
          neden: [yildiz ? '★' + yildiz : '', ates ? '🔥' + ates : '', yanlis ? yanlis + ' yanlış' : '', olcum ? 'seviye ' + olcum.seviye : 'seviye ölçülmedi', Math.round(oran * 100) + '% okundu'].filter(Boolean).join(' · ') };
      }).filter(Boolean);
    });
  }
  /* Akademik hedef (2026-11-02): kullanıcı 1. sınıf, hedefi yurt dışında PhD / akademik kariyer → "yüzeysel öğrenme yetmez,
     akademik ve derin de öğrenmeliyim; sınav haftası direkt sınava yönelik olsun". Denge sınava kalan güne göre: */
  function denge(kalan) {
    if (kalan <= 7) return { derin: 0, ad: 'Sınav haftası: %100 sınava yönelik' };
    if (kalan <= 21) return { derin: 0.25, ad: '%25 derin · %75 sınav' };
    if (kalan <= 42) return { derin: 0.5, ad: '%50 derin · %50 sınav' };
    return { derin: 0.7, ad: '%70 derin · %30 sınav' };
  }
  U.planDenge = denge;
  var AKADEMIK_GOREV = [
    { ad: 'İngilizce makale özeti oku (PubMed/Europe PMC) ve 5 yeni terimi kartlarına ekle', eylem: 'makale' },
    { ad: 'Bugünkü konunun mekanizmasını İngilizce 5 cümleyle yaz; Carvis\'e kontrol ettir', eylem: 'carvis' },
    { ad: 'Bir makalenin Methods bölümündeki istatistik testini bul ve neden seçildiğini açıkla', eylem: 'makale' },
    { ad: 'Araştırma sorusu kur: bugünkü konuda hâlâ bilinmeyen ne? (1 soru + nasıl test edilir)', eylem: 'carvis' },
    { ad: 'Konuyu 2 dakika İngilizce sesli anlat (Carvis dinlesin, düzeltsin)', eylem: 'carvis' },
    { ad: 'Bir klasik deneyi/keşfi oku: kim, nasıl kanıtladı? (kitaptaki kâşif kutuları)', eylem: 'kitap' }
  ];
  function planYap(ayar, bolumler, biten) {
    // sınavı olan dersler; her gün için bütçe (dk) en yakın sınava ağırlıklı dağıtılır
    var dersler = Object.keys(ayar.sinav || {}).filter(function (k) { return ayar.sinav[k] && gunFark(ayar.sinav[k]) >= 0; });
    var butce = Math.max(30, +ayar.gunluk || 180), gunSay = 7, gunler = [];
    var kuyruk = {};
    dersler.forEach(function (d) {
      kuyruk[d] = bolumler.filter(function (b) { return b.kitap === d && !biten[d + '|' + b.bolumId] && b.oran < 0.98; }).sort(function (a, b) { return b.puan - a.puan; }).map(function (b) { return Object.assign({}, b); });
    });
    for (var g = 0; g < gunSay; g++) {
      var tarih = new Date(Date.now() + g * GUN), isler = [];
      var aktif = dersler.filter(function (d) { return gunFark(ayar.sinav[d]) >= g && kuyruk[d].length; });
      if (!aktif.length) { gunler.push({ tarih: tarih, isler: isler }); continue; }
      // ağırlık: kalan iş / kalan gün (yakın sınav ve çok iş → daha çok pay)
      var agirlik = {}, toplam = 0;
      aktif.forEach(function (d) { var kalanGun = Math.max(1, gunFark(ayar.sinav[d]) - g), is = kuyruk[d].reduce(function (s, b) { return s + b.dk; }, 0); agirlik[d] = is / kalanGun; toplam += agirlik[d]; });
      var kalan = butce - 15; // 15 dk tekrar kartları
      var akademik = ayar.akademik !== false;
      aktif.forEach(function (d) {
        var pay = Math.max(20, Math.round(kalan * agirlik[d] / toplam));
        var dg = denge(gunFark(ayar.sinav[d]) - g), derinDk = akademik ? Math.round(pay * dg.derin / 5) * 5 : 0;
        if (derinDk >= 10 && kuyruk[d].length) {
          var konu = kuyruk[d][0];
          isler.push({ derin: true, kitap: d, kitapAd: konu.kitapAd, sira: konu.sira, bolumId: konu.bolumId, ad: 'Derin çalışma: ' + konu.ad, dk: derinDk, denge: dg.ad,
            neden: 'mekanizma ve "neden", İngilizce terimler, ilgili bir makale; sınava ' + (gunFark(ayar.sinav[d]) - g) + ' gün' });
          pay -= derinDk;
        }
        while (pay > 10 && kuyruk[d].length) {
          var b = kuyruk[d][0], al = Math.min(b.dk, pay);
          isler.push(Object.assign({}, b, { dk: al, parca: al < b.dk }));
          b.dk -= al; pay -= al; if (b.dk <= 5) kuyruk[d].shift();
        }
      });
      isler.push({ tekrar: true, dk: 15, ad: 'Tekrar kartları (SM-2)' });
      // akademik gelişim bloğu: sınav haftasında değil (en yakın sınav > 7 gün), her gün dönüşümlü görev
      var enYakin = Math.min.apply(null, dersler.map(function (d) { return gunFark(ayar.sinav[d]) - g; }));
      if (ayar.akademik !== false && enYakin > 7) { var gv = AKADEMIK_GOREV[(Math.floor(tarih / GUN) + 7) % AKADEMIK_GOREV.length]; isler.push({ akademikGorev: true, ad: gv.ad, eylem: gv.eylem, dk: 20 }); }
      gunler.push({ tarih: tarih, isler: isler });
    }
    var yetismeyen = dersler.filter(function (d) { return kuyruk[d].length && gunFark(ayar.sinav[d]) < gunSay; });
    return { gunler: gunler, yetismeyen: yetismeyen };
  }
  U.GORUNUMLER.plan = function () {
    var ana = $('#ana'); ana.innerHTML = '';
    var sayfa = el('div', { class: 'sayfa' }); ana.appendChild(sayfa);
    sayfa.appendChild(el('div', { class: 'kahraman' }, [el('div', { class: 'ust-etiket', text: 'Sınava göre' }), el('h1', { text: '📅 Çalışma planı' }),
      el('p', { text: 'Sınav tarihlerini gir. Plan bölümleri ★ (kaç sınavda çıktığı), 🔥, yanlışların, seviye ölçümün ve okuma durumuna göre sıralar; her açılışta yeniden hesaplanır, yani bir günü atlarsan kendiliğinden kayar.' })]));
    var form = el('div', { class: 'plan-form' }); sayfa.appendChild(form);
    var planKap = el('div'); sayfa.appendChild(planKap);
    Promise.all([Kitaplik.katalog(), Depo.oku('plan')]).then(function (r) {
      var kitaplar = r[0], ayar = r[1]; ayar.sinav = ayar.sinav || {}; ayar.biten = ayar.biten || {};
      kitaplar.forEach(function (k) {
        var g = el('input', { type: 'date', value: ayar.sinav[k.id] || '', min: bugun() });
        g.addEventListener('change', function () { U.depoGuncelle('plan', function (v) { v.sinav = v.sinav || {}; v.sinav[k.id] = g.value || null; }, 300).then(ciz); });
        form.appendChild(el('label', {}, [k.baslik.replace(/^1001\s*/, '') + ' sınavı', g]));
      });
      var gunluk = el('input', { type: 'number', min: '30', max: '720', step: '15', value: String(ayar.gunluk || 180) });
      gunluk.addEventListener('change', function () { U.depoGuncelle('plan', function (v) { v.gunluk = +gunluk.value || 180; }, 300).then(ciz); });
      form.appendChild(el('label', {}, ['Günde çalışma (dk)', gunluk]));
      var akd = el('input', { type: 'checkbox', checked: ayar.akademik !== false ? true : null });
      akd.addEventListener('change', function () { U.depoGuncelle('plan', function (v) { v.akademik = akd.checked; }, 300).then(ciz); });
      form.appendChild(el('label', { style: 'display:flex;gap:8px;align-items:center' }, [akd, '🎓 Akademik hedef (yurt dışı PhD): sınavdan uzakken derin öğrenme']));
      sayfa.insertBefore(el('details', { class: 'plan-gun' }, [el('summary', { text: '🎓 Akademik denge nasıl çalışır?' }),
        el('p', { class: 'var-etiket', text: 'Sınava 6 haftadan fazla: %70 derin · 3-6 hafta: %50 · 1-3 hafta: %25 · sınav haftası (≤7 gün): tamamen sınava yönelik (çıkmışlar, Zamanım yok özeti, tahmin). Derin bloklar mekanizma, İngilizce terim ve makale okumayı içerir; sınav haftası dışında her gün 20 dk akademik gelişim görevi eklenir.' }),
        el('p', { class: 'var-etiket', text: '1. sınıf için yol haritası: İngilizce bilimsel okuma-yazma (her gün az), biyoistatistik ve araştırma yöntemlerini sağlam öğrenme, ilgini çeken bir alanı makalelerle takip etme (📰 Makaleler), ilerleyen yıllarda bir araştırma grubuna/öğrenci projesine katılma. Notlar yüksek kalsın: sınav haftası bu yüzden tamamen sınava ayrılıyor.' })]), planKap);
      function ciz() {
        planKap.innerHTML = ''; planKap.appendChild(el('div', { class: 'yukleniyor', text: 'Plan hesaplanıyor…' }));
        Depo.oku('plan').then(function (ay) {
          ay.sinav = ay.sinav || {}; ay.biten = ay.biten || {};
          var secili = kitaplar.filter(function (k) { return ay.sinav[k.id] && gunFark(ay.sinav[k.id]) >= 0; });
          if (!secili.length) { planKap.innerHTML = ''; planKap.appendChild(el('p', { class: 'bos', text: 'Plan için en az bir sınav tarihi gir.' })); return; }
          return Promise.all(secili.map(bolumVerisi)).then(function (l) {
            var bolumler = [].concat.apply([], l), p = planYap(ay, bolumler, ay.biten);
            planKap.innerHTML = '';
            secili.forEach(function (k) {
              var bl = bolumler.filter(function (b) { return b.kitap === k.id; }), ok = bl.filter(function (b) { return ay.biten[k.id + '|' + b.bolumId] || b.oran >= 0.98; }).length;
              planKap.appendChild(el('div', { class: 'var-etiket', text: k.baslik.replace(/^1001\s*/, '') + ': sınava ' + gunFark(ay.sinav[k.id]) + ' gün · ' + ok + '/' + bl.length + ' bölüm bitti' + (ay.akademik !== false ? ' · ' + denge(gunFark(ay.sinav[k.id])).ad : '') }));
              planKap.appendChild(el('div', { class: 'plan-cubuk' }, [el('i', { style: 'width:' + Math.round(100 * ok / Math.max(1, bl.length)) + '%' })]));
            });
            if (p.yetismeyen.length) planKap.appendChild(el('p', { class: 'uyari-kutu', text: 'Bu tempoyla yetişmeyen: ' + p.yetismeyen.join(', ') + '. Günlük süreyi artır ya da düşük ★ bölümleri hızlı geç.' }));
            p.gunler.forEach(function (g, gi) {
              var kutu = el('section', { class: 'plan-gun' });
              var top = g.isler.reduce(function (s, x) { return s + x.dk; }, 0);
              kutu.appendChild(el('h3', { text: (gi === 0 ? 'Bugün' : gi === 1 ? 'Yarın' : g.tarih.toLocaleDateString('tr-TR', { weekday: 'long', day: 'numeric', month: 'long' })) + ' · ' + Math.round(top / 60 * 10) / 10 + ' saat' }));
              if (!g.isler.length) kutu.appendChild(el('p', { class: 'var-etiket', text: 'Plan yok.' }));
              g.isler.forEach(function (x) {
                var satir = el('div', { class: 'plan-is' });
                if (x.akademikGorev) {
                  satir.appendChild(el('span', { class: 'ad' }, [el('b', { text: '🌍 Akademik gelişim: ' }), x.ad + ' · ' + x.dk + ' dk']));
                  if (gi === 0) satir.appendChild(x.eylem === 'makale' ? el('a', { class: 'dugme kucuk', href: U.GORUNUMLER.makaleler ? '#makaleler' : '#sohbet' }, ['📰 Makale']) :
                    el('button', { class: 'dugme kucuk', type: 'button', onclick: function () { if (window.Carvis && window.Carvis.ac) { var b = document.querySelector('.cv-balon'); if (b) b.hidden = false; window.Carvis.ac(); } else U.git('sohbet'); } }, ['🎙 Carvis']));
                  if (gi === 0 && U.defterTaslak) satir.appendChild(el('button', { class: 'dugme kucuk', type: 'button', onclick: function () { U.defterTaslak(x.ad); } }, ['✍ Deftere yaz']));
                  kutu.appendChild(satir); return;
                }
                if (x.derin) {
                  satir.appendChild(el('span', { class: 'ad' }, [el('b', { text: '🎓 ' + x.kitapAd + ': ' }), x.ad + ' · ' + x.dk + ' dk', el('br'), el('small', { text: x.neden })]));
                  if (gi === 0) {
                    satir.appendChild(el('a', { class: 'dugme kucuk', href: '#' + U.okuHash(x.kitap, x.sira) }, ['Oku (derin)']));
                    satir.appendChild(el('a', { class: 'dugme kucuk', href: U.GORUNUMLER.makaleler ? '#makaleler' : '#sohbet' }, ['📰 Makale']));
                    if (window.Carvis && window.Carvis.dersModu) satir.appendChild(el('button', { class: 'dugme kucuk', type: 'button', onclick: function () { window.Carvis.dersModu(x.kitap, x.sira); } }, ['🎧 Sesli anlat']));
                  }
                  kutu.appendChild(satir); return;
                }
                if (x.tekrar) { satir.appendChild(el('span', { class: 'ad', text: '❖ ' + x.ad + ' · ' + x.dk + ' dk' })); if (gi === 0) satir.appendChild(el('a', { class: 'dugme kucuk', href: '#kartlar' }, ['Başla'])); kutu.appendChild(satir); return; }
                satir.appendChild(el('span', { class: 'ad' }, [el('b', { text: x.kitapAd + ': ' }), x.ad + (x.parca ? ' (bir kısmı)' : '') + ' · ' + x.dk + ' dk', el('br'), el('small', { text: 'Neden: ' + x.neden + ' · öncelik ' + x.puan })]));
                if (gi === 0) {
                  satir.appendChild(el('a', { class: 'dugme kucuk', href: '#' + U.okuHash(x.kitap, x.sira) }, ['Oku']));
                  if (window.Carvis && window.Carvis.dersModu) satir.appendChild(el('button', { class: 'dugme kucuk', type: 'button', onclick: function () { window.Carvis.dersModu(x.kitap, x.sira); } }, ['🎧 Sesli anlat']));
                  satir.appendChild(el('button', { class: 'dugme kucuk', type: 'button', onclick: function () { U.depoGuncelle('plan', function (v) { v.biten = v.biten || {}; v.biten[x.kitap + '|' + x.bolumId] = Date.now(); }, 300).then(function () { toast('Bitti olarak işaretlendi; plan kaydırıldı.'); ciz(); }); } }, ['✓ Bitti']));
                }
                kutu.appendChild(satir);
              });
              planKap.appendChild(kutu);
            });
          });
        }).catch(function (e) { planKap.innerHTML = ''; planKap.appendChild(el('p', { class: 'hata-metni', text: 'Plan hesaplanamadı: ' + (e.message || e) })); });
      }
      ciz();
    });
  };
  U.SEKMELER.push({ id: 'plan', ad: 'Plan', ikon: '📅' });
  // Carvis için: bugünün planını metin olarak ver
  // Bugünün işleri (yapılandırılmış): pomodoro seans seçimi ve çalışma koçu kullanır. Sınav tarihi yoksa null.
  U.planBugunListe = function () {
    return Promise.all([Kitaplik.katalog(), Depo.oku('plan')]).then(function (r) {
      var ay = r[1]; ay.sinav = ay.sinav || {}; ay.biten = ay.biten || {};
      var secili = r[0].filter(function (k) { return ay.sinav[k.id] && gunFark(ay.sinav[k.id]) >= 0; });
      if (!secili.length) return null;
      return Promise.all(secili.map(bolumVerisi)).then(function (l) {
        var p = planYap(ay, [].concat.apply([], l), ay.biten), sinavlar = {};
        secili.forEach(function (k) { sinavlar[k.id] = gunFark(ay.sinav[k.id]); });
        return p.gunler[0].isler.map(function (x) { return Object.assign({ sinavaGun: x.kitap ? sinavlar[x.kitap] : null }, x); });
      });
    });
  };
  U.bugunkuPlan = function () {
    return U.planBugunListe().then(function (l) {
      if (!l) return 'Sınav tarihi girilmemiş; Plan sekmesinden gir.';
      return l.map(function (x) { return x.tekrar ? 'Tekrar kartları ' + x.dk + ' dakika' : x.akademikGorev ? 'Akademik gelişim: ' + x.ad + ', ' + x.dk + ' dakika' : x.kitapAd + ': ' + x.ad + ', ' + x.dk + ' dakika' + (x.denge ? ' (' + x.denge + ')' : ''); }).join('; ');
    });
  };
})();
