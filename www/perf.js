/* Performans koruyucu (r108). Kullanıcı: "fps ve pil sağlığı artsın, stil istediğim gibi olsun, rijitlik azalsın".
   - Mod (Carvis ayarları → Performans): akici (sınırsız) · dengeli (varsayılan: ambient 30 kare, canvas çözünürlüğü ≤ 1.25) · pil (ambient 15, diğer kareler 30, çözünürlük 1).
   - Sekme/uygulama gizliyken hiçbir kare üretilmez; görünür olunca kaldığı yerden sürer.
   - Yalnız "ambient" kaynaklar kısılır (arka plan ızgarası, Carvis küresi, toz ve iz, hero küre, holo katmanları).
     GSAP, reels ve sürükleme gibi kullanıcı hareketleri dengeli modda tam hızda kalır; pil modunda 30 kareye iner.
   - Modüller değişmez: requestAnimationFrame çağrıları aynen çalışır; kısıt yalnız kare zamanlamasında uygulanır.
   - Stil (Carvis ayarları → Görünüm): holo (varsayılan) · sade (parıltı, toz, arka plan kapalı).
   - API: CarvisPerf.mod(), .stil(), .modAyarla(m), .stilAyarla(s), .dpr(taban), .arkaPlanKapali(). */
(function () {
  'use strict';
  if (window.CarvisPerf) return;
  var rafN = window.requestAnimationFrame.bind(window);
  var AMBIYANS = /^(app16|app19|jarvis|holo-max|holo-fx|holo-pencere|holo|holo2|holo3|holoikon|hud|arac2|ikon|anaekran|akis|canli)\.js$/;
  var HIZ = { akici: 0, dengeli: 30, pil: 15 }; // ambient kaynakların üst sınırı (kare/sn; 0 = sınırsız)
  var TUM = { akici: 0, dengeli: 0, pil: 30 };  // pil modunda diğer kareler
  var DPR = { akici: 2, dengeli: 1.25, pil: 1 }; // canvas çözünürlük tavanı
  var mod = 'dengeli', stil = 'holo';
  try { mod = localStorage.getItem('cv_perf') || 'dengeli'; stil = localStorage.getItem('cv_stil') || 'holo'; } catch (e) {}
  if (!HIZ.hasOwnProperty(mod)) mod = 'dengeli';
  if (stil !== 'sade') stil = 'holo';

  var sira = new Map(), sayac = 0, zamanli = false, zamanZ = 0, gizli = !!document.hidden;

  // Çağrıyı yapan dosya (ambient mi, değil mi): yığın izinden ilk .js adı
  function kaynak() {
    var s = (new Error().stack || '').split('\n');
    for (var i = 2; i < s.length; i++) {
      var m = /\/([^\/\s?#()]+\.js)/.exec(s[i]);
      if (m && m[1] !== 'perf.js') return m[1];
    }
    return '';
  }
  // Bir sonraki native kareyi iste; acil=false iken zaten bekleyen bir kare/zamanlayıcı varsa dokunma
  function kareIste(acil) {
    if (gizli || !sira.size) return;
    if (zamanli) { if (!acil || !zamanZ) return; clearTimeout(zamanZ); zamanZ = 0; zamanli = false; }
    zamanli = true; rafN(kareIsle);
  }
  // Yeni kayıt için: hemen mi, yoksa bir sonraki uygun ana kadar zamanlayıcıyla mı
  function plan(e) {
    var hz = e.amb ? HIZ[mod] : TUM[mod];
    if (!hz) return kareIste(true);
    var kalanMs = e.son + 1000 / hz - performance.now();
    if (kalanMs <= 2) return kareIste(false);
    if (!zamanli) { zamanli = true; zamanZ = setTimeout(function () { zamanZ = 0; zamanli = false; kareIste(false); }, kalanMs); }
  }
  function kareIsle(ts) {
    zamanli = false;
    if (gizli || !sira.size) return;
    var simdi = performance.now(), liste = Array.from(sira.values());
    sira.clear();
    for (var i = 0; i < liste.length; i++) {
      var e = liste[i], hz = e.amb ? HIZ[mod] : TUM[mod];
      if (hz && simdi - e.son < 1000 / hz - 3) { sira.set(e.id, e); continue; } // henüz sırası değil
      e.son = simdi;
      try { e.cb(ts); } catch (err) { if (window.console) console.error(err); }
    }
    if (zamanli || !sira.size) return; // geri çağrılar zaten bir kare ya da zamanlayıcı istedi
    var kisa = Infinity, simdi2 = performance.now();
    sira.forEach(function (x) {
      var hz2 = x.amb ? HIZ[mod] : TUM[mod];
      kisa = Math.min(kisa, hz2 ? Math.max(0, x.son + 1000 / hz2 - simdi2) : 0);
    });
    if (kisa <= 2) kareIste(false);
    else { zamanli = true; zamanZ = setTimeout(function () { zamanZ = 0; zamanli = false; kareIste(false); }, kisa); }
  }

  window.requestAnimationFrame = function (cb) {
    var id = ++sayac, amb = AMBIYANS.test(kaynak()), e = { id: id, cb: cb, amb: amb, son: 0 };
    sira.set(id, e);
    if (!gizli) plan(e);
    return id;
  };
  window.cancelAnimationFrame = function (id) { sira.delete(id); };
  document.addEventListener('visibilitychange', function () { gizli = !!document.hidden; if (!gizli) kareIste(true); });

  function dpr(taban) { var b = taban || 1, c = DPR[mod] || 1.25; return Math.min(b, window.devicePixelRatio || 1, c); }
  function uygula() {
    var k = document.documentElement;
    k.setAttribute('data-perf', mod); k.setAttribute('data-stil', stil);
    kareIste(true);
    try { window.dispatchEvent(new Event('resize')); } catch (e) {} // canvas'lar yeni çözünürlüğü alsın
  }
  function modAyarla(m) { if (!HIZ.hasOwnProperty(m)) return; mod = m; try { localStorage.setItem('cv_perf', m); } catch (e) {} uygula(); }
  function stilAyarla(s) { stil = s === 'sade' ? 'sade' : 'holo'; try { localStorage.setItem('cv_stil', stil); } catch (e) {} uygula(); }
  function arkaPlanKapali() { return stil === 'sade' || (mod === 'pil' && !!document.body && document.body.classList.contains('fx-okuma')); }

  var st = document.createElement('style');
  st.textContent = '[data-stil=sade] .hx-bant,[data-stil=sade] .hx-kenar,[data-stil=sade] .hx-acilis::before,[data-stil=sade] .hx-acilis::after,[data-stil=sade] .fx-tarama,[data-stil=sade] #fxArka,[data-stil=sade] .hx-sahne{display:none!important}' +
    '[data-perf=pil] .hx-kenar,[data-perf=pil] .serit::after{animation:none!important}';
  (document.head || document.documentElement).appendChild(st);
  window.CarvisPerf = { mod: function () { return mod; }, stil: function () { return stil; }, modAyarla: modAyarla, stilAyarla: stilAyarla, dpr: dpr, arkaPlanKapali: arkaPlanKapali };
  uygula();

  // Pil düşükse bir kez bilgi ver (kendiliğinden moda geçmez; kullanıcı karar verir)
  try {
    if (navigator.getBattery) navigator.getBattery().then(function (b) {
      var uyarildi = false;
      function kontrol() {
        if (uyarildi || b.charging || b.level >= 0.2 || mod === 'pil') return;
        uyarildi = true;
        setTimeout(function () { try { window.Uygulama && window.Uygulama.toast && window.Uygulama.toast('Pil %' + Math.round(b.level * 100) + ': Carvis ayarları → Performans → Pil modu ile ısınmayı azaltabilirsin.'); } catch (e) {} }, 4000);
      }
      kontrol(); b.addEventListener && b.addEventListener('levelchange', kontrol);
    }).catch(function () {});
  } catch (e) {}
})();
