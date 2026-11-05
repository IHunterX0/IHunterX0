/* Carvis alarmları (r109). Kullanıcı: "Carvis'e alarm kurma, alarm sesini biz seçelim".
   - Alarmlar cihazda saklanır (localStorage 'carvisAlarm'). Çalma uygulama açıkken olur; ekran kapalıyken kesin çalma için yerel Android bildirimi gerekir (sonraki sürüm).
   - Sesler: dört hazır ses (sentezlenir, dosya yok) ve kendi sesin (en çok 900 KB, cihazda saklanır).
   - Tekrar: bir kez, her gün, hafta içi. Erteleme: 5 dk. Çalma en çok 2 dk sürer, sonra "kaçtı" olarak kalır.
   - Carvis araçları: alarm_kur, alarm_listele, alarm_sil (sohbette konuşarak da kurulur). */
(function () {
  'use strict';
  var U = window.Uygulama; if (!U) return;
  var el = U.el;
  var ANAHTAR = 'carvisAlarm', OZEL = 'carvisAlarmOzel', OZEL_EN = 900 * 1024;
  var SESLER = [
    { id: 'zil', ad: 'Zil (iki ton)' },
    { id: 'kus', ad: 'Kuş cıvıltısı' },
    { id: 'dijital', ad: 'Dijital bip' },
    { id: 'yumusak', ad: 'Yumuşak yükseliş' },
    { id: 'ozel', ad: 'Kendi sesim' }
  ];
  var TEKRARLAR = { tek: 'bir kez', her_gun: 'her gün', hafta_ici: 'hafta içi' };
  var AKTIF = null, ZAMAN_ASIMI = 0;
  var motor = { ac: null, zamanlayici: null, audio: null, titresim: null };

  function oku() { try { return JSON.parse(localStorage.getItem(ANAHTAR) || '[]'); } catch (e) { return []; } }
  function yaz(liste) { try { localStorage.setItem(ANAHTAR, JSON.stringify(liste)); } catch (e) {} }
  function isaretle(id, fn) { var l = oku(); l.forEach(function (x) { if (x.id === id) fn(x); }); yaz(l); }
  function pad(n) { return ('0' + n).slice(-2); }
  function gunAnahtari(d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
  function saatNormal(s) { var m = /^\s*([01]?\d|2[0-3])[:.]([0-5]\d)\s*$/.exec(String(s || '')); return m ? pad(+m[1]) + ':' + m[2] : null; }
  function etiketBul(a) { return a.etiket ? a.etiket : 'Alarm ' + a.saat; }
  function sesAd(id) { var s = SESLER.filter(function (x) { return x.id === id; })[0]; return s ? s.ad : id; }
  function ozelOku() { try { return JSON.parse(localStorage.getItem(OZEL) || 'null'); } catch (e) { return null; } }

  /* ---------------- ses ---------------- */
  function sesMotoru() {
    if (!motor.ac) { var C = window.AudioContext || window.webkitAudioContext; if (!C) return null; motor.ac = new C(); }
    if (motor.ac.state === 'suspended') { try { motor.ac.resume(); } catch (e) {} }
    return motor.ac;
  }
  function tonla(ac, frek, t0, sure, tip, kazanc) {
    var o = ac.createOscillator(), g = ac.createGain();
    o.type = tip || 'sine'; o.frequency.setValueAtTime(frek, t0);
    g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(kazanc || 0.25, t0 + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t0 + sure);
    o.connect(g); g.connect(ac.destination); o.start(t0); o.stop(t0 + sure + 0.05);
  }
  var DESEN = {
    zil: function (ac, t) { tonla(ac, 880, t, 0.9); tonla(ac, 1320, t + 0.12, 0.8); },
    kus: function (ac, t) {
      for (var i = 0; i < 3; i++) {
        var u = t + i * 0.16, o = ac.createOscillator(), g = ac.createGain();
        o.frequency.setValueAtTime(1800, u); o.frequency.exponentialRampToValueAtTime(3200, u + 0.12);
        g.gain.setValueAtTime(0.0001, u); g.gain.exponentialRampToValueAtTime(0.2, u + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, u + 0.13);
        o.connect(g); g.connect(ac.destination); o.start(u); o.stop(u + 0.14);
      }
    },
    dijital: function (ac, t) { tonla(ac, 1000, t, 0.13, 'square', 0.12); tonla(ac, 1000, t + 0.22, 0.13, 'square', 0.12); tonla(ac, 1000, t + 0.44, 0.13, 'square', 0.12); },
    yumusak: function (ac, t) {
      var o = ac.createOscillator(), g = ac.createGain();
      o.frequency.setValueAtTime(392, t); o.frequency.linearRampToValueAtTime(523, t + 1.6);
      g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(0.18, t + 0.6); g.gain.linearRampToValueAtTime(0.0001, t + 1.8);
      o.connect(g); g.connect(ac.destination); o.start(t); o.stop(t + 1.9);
    }
  };
  var PERIYOT = { zil: 1.6, kus: 1.4, dijital: 1.8, yumusak: 2.4 };
  function sesDur() {
    if (motor.zamanlayici) clearInterval(motor.zamanlayici); motor.zamanlayici = null;
    if (motor.audio) { try { motor.audio.pause(); } catch (e) {} motor.audio = null; }
    if (motor.titresim) clearInterval(motor.titresim); motor.titresim = null;
  }
  function sesBaslat(id, dongu) {
    sesDur();
    if (id === 'ozel') {
      var d = ozelOku();
      if (d && d.veri) { var a = new Audio(d.veri); a.loop = !!dongu; a.play().catch(function () {}); motor.audio = a; return true; }
      id = 'zil';
    }
    var ac = sesMotoru(); if (!ac) return false;
    var cal = function () { try { DESEN[id] ? DESEN[id](ac, ac.currentTime + 0.05) : DESEN.zil(ac, ac.currentTime + 0.05); } catch (e) {} };
    cal();
    if (dongu) motor.zamanlayici = setInterval(cal, (PERIYOT[id] || 1.6) * 1000);
    return true;
  }

  /* ---------------- zamanlama ---------------- */
  // Bir alarm şu an çalmalı mı? Erteleme varsa onun zamanı; yoksa saat, gün ve tekrar kuralına bakılır.
  function vadesiGeldi(a, simdi) {
    if (!a.acik) return false;
    if (a.ertele) return simdi.getTime() >= a.ertele;
    if (a.saat !== pad(simdi.getHours()) + ':' + pad(simdi.getMinutes())) return false;
    if (a.son === gunAnahtari(simdi)) return false;
    if (a.tekrar === 'hafta_ici') { var g = simdi.getDay(); if (g === 0 || g === 6) return false; }
    return true;
  }
  function kontrol(simdi) {
    simdi = simdi || new Date();
    if (AKTIF) return null;
    var a = oku().filter(function (x) { return vadesiGeldi(x, simdi); })[0];
    if (!a) return null;
    // ertelemeden geliyorsa erteleme temizlenir; normal vadede bugün işaretlenir
    isaretle(a.id, function (x) { if (x.ertele) x.ertele = 0; else x.son = gunAnahtari(simdi); });
    ring(a);
    return a;
  }

  /* ---------------- çalma ekranı ---------------- */
  var css = document.createElement('style');
  css.textContent = '.al-kutu{position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);z-index:1300;width:min(340px,88vw);padding:22px 20px;border-radius:24px;text-align:center;color:#e9fffb;background:radial-gradient(120% 100% at 50% 0%,rgba(94,240,220,.16),rgba(2,12,16,.985) 70%);box-shadow:0 0 0 1px rgba(110,255,235,.5),0 0 60px rgba(94,240,220,.3)}' +
    '.al-kutu .al-saat{font:600 36px var(--f-kod,monospace);letter-spacing:.04em;text-shadow:0 0 14px rgba(94,240,220,.7)}.al-kutu .al-etiket{margin:6px 0 14px;font-size:15px;color:#bfe9e3}' +
    '.al-dugmeler{display:flex;gap:10px;justify-content:center;flex-wrap:wrap}' +
    '.al-satir{display:flex;align-items:center;gap:8px;flex-wrap:wrap;padding:6px 0;border-top:1px dashed var(--cizgi)}.al-satir span{flex:1;min-width:140px;font-size:13px;color:var(--metin-sonuk)}' +
    '.al-form{display:grid;gap:8px;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));margin-top:10px}.al-form label{display:grid;gap:4px;font-size:13px}' +
    '.al-form input,.al-form select{background:var(--zemin);border:1px solid var(--cizgi);border-radius:6px;color:var(--metin);padding:6px 8px;font:14px var(--f-govde)}';
  document.head.appendChild(css);

  function ring(a) {
    AKTIF = a;
    var kutu = el('div', { class: 'al-kutu', role: 'alertdialog', 'aria-label': 'Alarm çalıyor' }, [
      el('div', { class: 'al-saat', text: '⏰ ' + a.saat }),
      el('div', { class: 'al-etiket', text: etiketBul(a) }),
      el('div', { class: 'al-dugmeler' }, [
        el('button', { class: 'dugme ana', type: 'button', text: '✓ Kapat', onclick: function () { kapat(false); } }),
        el('button', { class: 'dugme', type: 'button', text: '5 dk ertele', onclick: function () { kapat(true); } })
      ])
    ]);
    document.body.appendChild(kutu);
    sesBaslat(a.ses, true);
    if (navigator.vibrate) motor.titresim = setInterval(function () { try { navigator.vibrate([400, 200, 400]); } catch (e) {} }, 2500);
    try { if (window.Carvis && window.Carvis.soyle) window.Carvis.soyle('Alarm: ' + etiketBul(a)).catch(function () {}); } catch (e) {}
    ZAMAN_ASIMI = setTimeout(function () { if (AKTIF === a) kapat(false, true); }, 120000);
    function kapat(ertele, kacirildi) {
      clearTimeout(ZAMAN_ASIMI); sesDur(); kutu.remove(); AKTIF = null;
      if (ertele) { isaretle(a.id, function (x) { x.ertele = Date.now() + 5 * 60000; }); U.toast && U.toast('Ertelendi: 5 dk sonra tekrar çalar.'); return; }
      isaretle(a.id, function (x) { x.ertele = 0; if (x.tekrar === 'tek') x.acik = false; });
      if (kacirildi) U.toast && U.toast('⏰ Alarm 2 dk çaldı, kapandı: ' + etiketBul(a));
    }
  }

  /* ---------------- kayıt ve araçlar ---------------- */
  function alarmEkle(g) {
    var s = saatNormal(g.saat); if (!s) return 'Saat anlaşılmadı. "07:30" gibi 24 saatlik yaz.';
    var tekrar = TEKRARLAR[g.tekrar] ? g.tekrar : 'tek';
    var sesId = SESLER.some(function (x) { return x.id === g.ses; }) ? g.ses : 'zil';
    if (sesId === 'ozel' && !ozelOku()) sesId = 'zil';
    var a = { id: 'a' + Date.now().toString(36) + Math.floor(Math.random() * 1000).toString(36), saat: s, etiket: String(g.etiket || '').trim().slice(0, 40), tekrar: tekrar, ses: sesId, acik: true, son: '', ertele: 0 };
    var l = oku(); l.push(a); yaz(l);
    return etiketBul(a) + ' alarmı kuruldu: ' + s + ', ' + TEKRARLAR[tekrar] + ', ses: ' + sesAd(sesId) + '.';
  }
  function araclar() {
    return [
      { name: 'alarm_kur', description: 'Kullanıcı için alarm kurar. saat: "HH:MM" (24 saat). tekrar: tek (varsayılan) | her_gun | hafta_ici. ses: zil | kus | dijital | yumusak | ozel. etiket: kısa ad. Alarm uygulama açıkken çalar.',
        inputSchema: { type: 'object', properties: { saat: { type: 'string' }, etiket: { type: 'string' }, tekrar: { type: 'string', enum: Object.keys(TEKRARLAR) }, ses: { type: 'string', enum: SESLER.map(function (x) { return x.id; }) } }, required: ['saat'] },
        execute: function (g) { return alarmEkle(g || {}); } },
      { name: 'alarm_listele', description: 'Kurulu alarmları, saatlerini ve açık/kapalı durumlarını söyler.', inputSchema: { type: 'object', properties: {} },
        execute: function () { var l = oku(); return l.length ? l.map(function (a) { return a.saat + ' — ' + etiketBul(a) + ' (' + TEKRARLAR[a.tekrar] + ', ' + (a.acik ? 'açık' : 'kapalı') + ')'; }).join('; ') : 'Kurulu alarm yok.'; } },
      { name: 'alarm_sil', description: 'Alarm siler. ara: etiketteki bir kelime ya da saat ("07:30"). "hepsi" yazılırsa tüm alarmlar silinir.', inputSchema: { type: 'object', properties: { ara: { type: 'string' } }, required: ['ara'] },
        execute: function (g) {
          var q = String((g && g.ara) || '').trim().toLowerCase(); if (!q) return 'Hangi alarmı sileyim?';
          var l = oku(), sm = saatNormal(q);
          var kalan = q === 'hepsi' ? [] : l.filter(function (a) { return !(sm && a.saat === sm) && etiketBul(a).toLowerCase().indexOf(q) < 0; });
          yaz(kalan); return (l.length - kalan.length) + ' alarm silindi.';
        } }
    ];
  }

  /* ---------------- panel ---------------- */
  function ac() {
    var govde = U.panelAc('⏰ Alarmlar', 'Kur, sesini seç, dinle. Uygulama açıkken çalar.');
    var liste = el('div'); govde.appendChild(liste);
    function listeCiz() {
      liste.innerHTML = '';
      var l = oku();
      if (!l.length) { liste.appendChild(el('p', { class: 'var-etiket', text: 'Henüz alarm yok. Aşağıdan saat seçip kur.' })); return; }
      l.forEach(function (a) {
        var onay = el('input', { type: 'checkbox', checked: a.acik ? true : null, 'aria-label': 'Alarmı aç ya da kapat' });
        onay.addEventListener('change', function () { isaretle(a.id, function (x) { x.acik = onay.checked; x.son = ''; x.ertele = 0; }); listeCiz(); });
        var dinle = el('button', { class: 'cip', type: 'button', text: '▶', title: 'Sesi dinle', onclick: function () { sesBaslat(a.ses, false); } });
        var sil = el('button', { class: 'cip', type: 'button', text: 'Sil', onclick: function () { yaz(oku().filter(function (x) { return x.id !== a.id; })); listeCiz(); } });
        liste.appendChild(el('div', { class: 'al-satir' }, [el('b', { text: a.saat }), el('span', { text: etiketBul(a) + ' · ' + TEKRARLAR[a.tekrar] + ' · ' + sesAd(a.ses) }), onay, dinle, sil]));
      });
    }
    var saatIn = el('input', { type: 'time', value: '07:30', 'aria-label': 'Alarm saati' });
    var etiketIn = el('input', { type: 'text', maxlength: '40', placeholder: 'Etiket (ör. Komite provası)', 'aria-label': 'Alarm etiketi' });
    var tekrarSec = el('select', { 'aria-label': 'Tekrar' }); Object.keys(TEKRARLAR).forEach(function (k) { tekrarSec.appendChild(el('option', { value: k, text: TEKRARLAR[k] })); });
    var sesSec = el('select', { 'aria-label': 'Alarm sesi' }); SESLER.forEach(function (s) { sesSec.appendChild(el('option', { value: s.id, text: s.ad })); });
    var dosya = el('input', { type: 'file', accept: 'audio/*', 'aria-label': 'Kendi alarm sesin' }); dosya.hidden = true;
    var ozelBilgi = el('span', { class: 'var-etiket', text: ozelOku() ? 'Kayıtlı sesin: ' + (ozelOku().ad || 'ses') : '' });
    var ozelKutu = el('label', {}, ['Kendi sesim', dosya, ozelBilgi]); ozelKutu.hidden = true;
    sesSec.addEventListener('change', function () { dosya.hidden = sesSec.value !== 'ozel'; ozelKutu.hidden = dosya.hidden; });
    dosya.addEventListener('change', function () {
      var f = dosya.files && dosya.files[0]; if (!f) return;
      if (f.size > OZEL_EN) { U.toast && U.toast('Ses çok büyük (en çok 900 KB). Kısa bir dosya seç.'); dosya.value = ''; return; }
      var okuyucu = new FileReader();
      okuyucu.onload = function () { try { localStorage.setItem(OZEL, JSON.stringify({ ad: f.name, veri: okuyucu.result })); } catch (e) { U.toast && U.toast('Ses kaydedilemedi (alan dolu olabilir).'); return; } ozelBilgi.textContent = 'Kayıtlı sesin: ' + f.name; U.toast && U.toast('Kendi sesin kaydedildi.'); };
      okuyucu.readAsDataURL(f);
    });
    var dinleDug = el('button', { class: 'dugme', type: 'button', text: '▶ Dinle', onclick: function () { if (sesSec.value === 'ozel' && !ozelOku()) { U.toast && U.toast('Önce kendi sesini seç.'); return; } sesBaslat(sesSec.value, false); } });
    var kurDug = el('button', { class: 'dugme ana', type: 'button', text: '＋ Alarm kur', onclick: function () {
      sesMotoru(); // ses motorunu kullanıcı hareketiyle aç (tarayıcı sesi engellemesin)
      var sonuc = alarmEkle({ saat: saatIn.value, etiket: etiketIn.value, tekrar: tekrarSec.value, ses: sesSec.value });
      U.toast && U.toast(sonuc); etiketIn.value = ''; listeCiz();
    } });
    govde.appendChild(el('div', { class: 'al-form' }, [
      el('label', {}, ['Saat', saatIn]), el('label', {}, ['Etiket', etiketIn]), el('label', {}, ['Tekrar', tekrarSec]),
      el('label', {}, ['Alarm sesi', sesSec]), ozelKutu
    ]));
    govde.appendChild(el('div', { class: 'al-dugmeler', style: 'margin-top:10px' }, [dinleDug, kurDug]));
    govde.appendChild(el('p', { class: 'var-etiket', text: 'Not: Alarm uygulama açıkken çalar. Ekran kapalıyken kesin çalma için Android bildirimi gerekir (sonraki sürüm).' }));
    listeCiz();
  }

  // Ana döngü: her 15 sn ve sekme görünür olunca vadeleri kontrol et
  setInterval(function () { kontrol(new Date()); }, 15000);
  document.addEventListener('visibilitychange', function () { if (!document.hidden) kontrol(new Date()); });

  window.CarvisAlarm = { ac: ac, araclar: araclar, liste: oku, ekle: alarmEkle, kontrol: kontrol, sesBaslat: sesBaslat, sesDur: sesDur, vadesiGeldi: vadesiGeldi };
})();
