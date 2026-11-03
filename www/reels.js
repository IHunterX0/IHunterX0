/* 1001 — Reels (kullanıcı, 2026-11-03: "notlarını atıyorsun, sana video tarzı bir şey yapıyor; yemek yerken bile çalışabileyim;
   bağımlılık yapıcı olsun; 1 dk'lık zamanım yok özetlerinin animasyonları olsun, reels kaydırır gibi kaydırayım; videolarda hafıza
   sarayı tekniği kullanılsın, izleyince hafıza sarayını kaydet yapayım; izledikten sonra ayırt edici test; sahte yorumlar sekmesi,
   Patrick Jane'in hap bilgileri yorumlarda olsun").
   Akış: seçilen dersin konuları çıkmış soru tahmini olasılığına göre sıralanır (en olası önce). Her reel ~60 sn:
   kanca → hafıza sarayı yolculuğu (5 durak: yer + çarpıcı imge + bilgi; duraklar animasyonla belirir, Carvis sesli anlatır) →
   "akılda kalsın" özeti. Sağda: ❤ beğen (çift dokunuş), 🏛 sarayı kaydet (Saraylar sekmesine), 🔍 ayırt testi, 💬 yorumlar (Jane'in hap
   bilgileri + "öğrenci" yorumları), ↗ kitapta aç. Seri, XP ve günlük hedef halkası; reel bitince bir sonrakine kayar. Reeller
   önden hazırlanır ve saklanır (tekrar izlerken yapay zekâ beklemez). Metinler YALNIZ kitaba dayanır. */
(function () {
  'use strict';
  if (/[?&]gomulu\b/.test(location.search)) return;
  var U = window.Uygulama; if (!U) return;
  var el = U.el, $ = U.$, Depo = U.Depo, Kitaplik = U.Kitaplik, Y = U.Y;
  var SURE = 60000, DURAK = 5;

  function bugun() { var d = new Date(); return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate(); }
  function istat() { return Depo.oku('reels').then(function (v) { v.gun = v.gun || {}; v.begen = v.begen || {}; v.xp = v.xp || 0; v.seri = v.seri || 0; return v; }); }
  function izlendi(id, xp) {
    return U.depoGuncelle('reels', function (v) {
      v.gun = v.gun || {}; var g = bugun(); v.gun[g] = (v.gun[g] || 0) + 1; v.xp = (v.xp || 0) + xp;
      var dun = new Date(Date.now() - 864e5), ds = dun.getFullYear() + '-' + (dun.getMonth() + 1) + '-' + dun.getDate();
      if (v.sonGun !== g) { v.seri = v.sonGun === ds ? (v.seri || 0) + 1 : 1; v.sonGun = g; }
      v.izlenen = v.izlenen || {}; v.izlenen[id] = Date.now();
    }, 300);
  }

  /* ---------- akış: tahmin ağırlıklı konular ---------- */
  function akisKur(kitap) {
    return Promise.all([Kitaplik.ac(kitap), U.cikmisTahmin ? U.cikmisTahmin(kitap, 'hepsi').catch(function () { return { yok: true }; }) : Promise.resolve({ yok: true }), Depo.oku('reels')]).then(function (r) {
      var kj = r[0], t = r[1], izl = (r[2] && r[2].izlenen) || {}, l = [];
      if (!t.yok) t.tahmin.forEach(function (x) { l.push({ id: kitap + '|' + x.alt, kitap: kitap, kitapAd: kj.baslik, sira: x.sira, alt: x.alt, konu: x.konu, bolum: x.bolum, ol: x.olasilik, aile: x.aileler }); });
      else (kj.bolumler || []).forEach(function (b, i) { (b.altlar || []).forEach(function (a) { l.push({ id: kitap + '|' + a.id, kitap: kitap, kitapAd: kj.baslik, sira: i, alt: a.id, konu: (a.no ? a.no + ' ' : '') + (a.baslik || ''), bolum: b.kisa || b.baslik, ol: null }); }); });
      // izlenmemişler önce (olasılık sırasıyla), sonra izlenenler (en eski önce) — tekrar etkisi
      var yeni = l.filter(function (x) { return !izl[x.id]; }), eski = l.filter(function (x) { return izl[x.id]; }).sort(function (a, b) { return izl[a.id] - izl[b.id]; });
      return { kj: kj, l: yeni.concat(eski) };
    });
  }

  /* ---------- reel içeriği (yapay zekâ, kitaba dayalı; saklanır) ---------- */
  var bellek = {};
  function icerik(it) {
    if (bellek[it.id]) return bellek[it.id];
    var anahtar = 'reel6|' + it.id;
    return bellek[it.id] = Depo.oku(anahtar).then(function (v) {
      if (v && v.j && v.j.sahneler) { if (U.Animasyon.onYukle) U.Animasyon.onYukle(v.j); return v.j; }
      return Kitaplik.bolumAc(it.kitap, it.sira).then(function (bolum) {
        var a = (bolum.altlar || []).filter(function (x) { return x.id === it.alt; })[0];
        var metin = a && U.altMetin ? U.altMetin(a, 3500) : (U.bolumOzu ? U.bolumOzu(bolum, 3500) : '');
        var ornek = (it.aile || []).slice(0, 2).map(function (f) { var vv = (f.q.varyantlar || [])[0]; return vv ? vv.govde : ''; }).filter(Boolean).join(' | ');
        return Y.sample.json('Bir tıp öğrencisi için ~60-80 saniyelik, KAYDIRARAK izlenen, ANİMASYONLU ve ETKİLEŞİMLİ bir "reels" dersi yaz. Konu: ' + it.kitapAd + ' · ' + it.bolum + ' · ' + it.konu + '.\n' +
          'YALNIZ aşağıdaki kitap metnine dayan; sayılar ve terimler doğru olsun. Türkçe, kısa cümleler.' + (ornek ? ' Bu konudan çıkmış sorular: ' + ornek.slice(0, 600) : '') + '\n' +
          akisMetni(it.kitap) + '\n' + (U.Animasyon.dersRehberi ? U.Animasyon.dersRehberi(it.kitap) + '\n' : '') +
          U.Animasyon.SENARYO_KURALI + '\n' +
          'YALNIZ JSON: {"baslik":"kısa","sahneler":[...],"saray":{"mekan":"…","duraklar":[{"yer":"…","sembol":"emoji","imge":"abartılı imge","bilgi":"bilgi","anahtar":"1-3 kelime"}]},"ozet":"tek cümle","makaleSorgu":"…","gorselAra":["2-3 İngilizce ders kitabı şema terimi (ör. humerus, brachial plexus)"],"yorumlar":[{"ad":"patrick.jane","metin":"…","begeni":sayi}]}\n' +
          'makaleSorgu: bu konuyla ilgili YENİ araştırmaları bulmak için İngilizce Europe PMC sorgusu (2-4 terim, OR ile eş anlamlılar; klinik ya da mekanizma odaklı, ilginç olsun).\n' +
          'saray: 4-5 durak. yorumlar: 6 yorum; 3 tanesi patrick.jane (sınav tuzağı, karıştırılan çift, kestirme), 3 tanesi farklı öğrenci kullanıcı adlarıyla.\n\nKİTAP METNİ:\n"""\n' + metin + '\n"""', { cache: false })
          .then(function (j) {
            if (!j || !j.sahneler || !j.sahneler.length) throw new Error('reel üretilemedi');
            return kontrolEt(j, metin, it);
          })
          .then(function (j) {
            j.ders = it.kitap;
            if (U.Animasyon && U.Animasyon.duzelt) U.Animasyon.duzelt(j);
            if (j.saray && j.saray.duraklar) { j.mekan = j.saray.mekan; j.duraklar = j.saray.duraklar.slice(0, 6); } else j.duraklar = [];
            j.soru = j.soru || (j.sahneler.filter(function (x) { return x && x.tip === 'soru'; }).slice(-1)[0]) || null;
            U.depoGuncelle(anahtar, function (d) { d.j = j; d.t = Date.now(); }, 200);
            if (U.Animasyon.onYukle) U.Animasyon.onYukle(j);
            return j;
          });
      });
    }).catch(function (e) { delete bellek[it.id]; throw e; });
  }

  function akisMetni(ders) {
    var ortak = 'Akış (GERÇEK REELS, flashcard DEĞİL): 1) KANCA — Patrick Jane izleyicinin yanlış bildiğini yakalar ("Herkes … sanır."), büyük yazı + ikon ';
    if (ders === 'anatomi' || !ders) return ortak + '2) VÜCUDA DAL — holografik vücutta ilgili yapıya kamera ile zoom 3) GERÇEK ŞEMA (gorsel) ile yapının ayrıntısı 4) seyir/ilişki: akis, ok, hücre düzeyi lab 5) orta soru 6) HAFIZA SARAYI 1-2 sahne (arka "koridor"; abartılı imge ikonu) 7) klinik bağlantı (yaralanırsa ne olur — vücutta geri zoom) 8) final soru + "akılda kalsın" tek cümle.';
    return ortak + '2) BAĞLAM — bu kavram vücutta/klinikte nerede karşına çıkar (vucut + zoom, gorsel ya da gerçekçi bir hasta/çalışma senaryosu) 3) MEKANİZMA ya da HESAP — derse özgü araçlarla adım adım (aşağıdaki DERS rehberine uy) 4) SAYILAR — grafik/dagilim/formul ile gerçek değerler 5) orta soru 6) karıştırılan kavramlar: karsilastir 7) HAFIZA SARAYI 1 sahne (arka "koridor") 8) klinik/sınav tuzağı 9) final soru + "akılda kalsın" tek cümle.';
  }
  /* İkinci kontrol turu (kullanıcı, 2026-11-03: "ikinci kontrol iyi olur"): ilk taslağı eleştirel bir editör gözden geçirip düzeltir.
     Başarısız olursa ya da sonuç bozuksa ilk taslak kullanılır (akış takılmaz). Önden hazırlandığı için izlerken beklenmez. */
  function kontrolEt(j, metin, it) {
    if (!Y.sample || !Y.sample.json) return Promise.resolve(j);
    var ham = JSON.stringify(j); if (ham.length > 24000) return Promise.resolve(j);
    return Y.sample.json('Sen titiz bir tıp eğitimi video editörüsün. Aşağıdaki reels senaryosunu (JSON) kontrol et ve DÜZELTİLMİŞ TAM JSON\'u döndür (aynı alanlar: baslik, sahneler, saray, ozet, makaleSorgu, gorselAra, yorumlar; açıklama yazma).\n' +
      'KONTROL LİSTESİ:\n1) Kitap metniyle çelişen ya da uydurma bilgi/sayı → kitaba göre düzelt.\n2) Her sahnede en az bir görsel öğe (vucut, lab, gorsel, grafik, dagilim, tablo, formul, molekul, zincir, karsilastir, akis, sekil). Yalnız yazıdan oluşan sahneyi görsele çevir (kanca hariç).\n' +
      '3) Grafik noktaları gerçekçi ve fizyolojik/istatistiksel olarak doğru; eksen birimi var. formul ve tablo sayıları birbiriyle tutarlı, hesap doğru.\n4) Koordinatlar 0..1, öğeler üst üste binmiyor, alt %22 boş.\n5) Kanca gerçekten merak uyandırıyor; anlatım Patrick Jane tonunda, her sahnede en çok 24 kelime, görüntüyü anlatıyor.\n' +
      '6) Soru sahneleri: tek doğru cevap, "dogru" indeksi gerçekten doğru şık, çeldiriciler makul.\n7) gorsel.ara İngilizce ders kitabı figür başlığı gibi (ör. "brachial plexus", "Michaelis-Menten", "normal distribution"). Ders: ' + it.kitapAd + '. En az 2 gorsel sahnesi.\n' +
      '8) organ / lab surec / molekul id\'leri kurallardaki listelerden; olmayanı listeden en yakınıyla değiştir.\n9) Sahne sayısı 9-13; akış kopmasın (vücut sahneleri art arda ise kamera devam etsin).\n\n' +
      'KURALLAR:\n' + U.Animasyon.SENARYO_KURALI + '\n\nKİTAP METNİ:\n"""\n' + String(metin || '').slice(0, 3500) + '\n"""\n\nTASLAK JSON:\n' + ham, { cache: false })
      .then(function (d) {
        if (!d || !Array.isArray(d.sahneler) || d.sahneler.length < Math.max(4, Math.floor(j.sahneler.length * 0.6))) return j;
        ['saray', 'makaleSorgu', 'gorselAra', 'yorumlar', 'ozet', 'baslik'].forEach(function (k) { if (d[k] == null && j[k] != null) d[k] = j[k]; });
        d.kontrol = 1; return d;
      }, function () { return j; });
  }

  /* ---------- makale reels'i (kullanıcı, 2026-11-03: "arada makale şeyleri de çıksın, yz kendi eklesin") ----------
     Kaynak sırayla: kullanıcının Makaleler'deki ilgi alanları ve az önce izlenen konunun yapay zekâ tarafından yazılan makaleSorgu'su.
     Europe PMC (yedek PubMed) — yalnız özeti olan, daha önce gösterilmemiş son 3 yılın makaleleri. Senaryo YALNIZ özete dayanır. */
  var mkSecildi = {};
  function makaleSec(it) {
    return Promise.all([Depo.oku('makale'), Depo.oku('reels'), it.onceki ? icerik(it.onceki).catch(function () { return null; }) : null]).then(function (r) {
      var ilg = ((r[0] && r[0].ilgiler) || []).filter(function (x) { return x && (x.sorgu || x.konu); }), gor = (r[1] && r[1].makaleGor) || {}, sorgular = [];
      if (r[2] && r[2].makaleSorgu) sorgular.push({ q: String(r[2].makaleSorgu).slice(0, 300), neden: it.onceki.konu });
      if (ilg.length) { var x = ilg[Math.floor(it.slot / 4) % ilg.length]; sorgular.splice(Math.floor(it.slot / 4) % 2 ? sorgular.length : 0, 0, { q: x.sorgu || x.konu, neden: 'ilgi alanın: ' + x.konu }); }
      if (!sorgular.length || !U.makaleBul) throw new Error('makale kaynağı yok');
      function dene(k, yeni) {
        if (k >= sorgular.length) { if (yeni) return dene(0, false); throw new Error('uygun makale bulunamadı'); }
        return U.makaleBul(sorgular[k].q, { adet: 10, yeni: yeni }).then(function (l) {
          var m = l.filter(function (m) { return m.ozet && m.ozet.length > 300 && !gor[m.id] && !mkSecildi[m.id]; })[0];
          if (!m) return dene(k + 1, yeni);
          mkSecildi[m.id] = 1; m.neden = sorgular[k].neden; return m;
        }, function () { return dene(k + 1, yeni); });
      }
      return dene(0, true);
    });
  }
  function icerikMakale(it) {
    if (bellek[it.id]) return bellek[it.id];
    return bellek[it.id] = makaleSec(it).then(function (m) {
      var anahtar = 'reelm|' + m.id;
      return Depo.oku(anahtar).then(function (v) {
        if (v && v.j && v.j.sahneler) return v.j;
        return Y.sample.json('Bir tıp öğrencisi için bu YENİ ARAŞTIRMAYI ~45-60 saniyelik, kaydırarak izlenen, ANİMASYONLU bir reels olarak anlat.\n' +
          'YALNIZ aşağıdaki özete dayan; özette olmayan sayı ya da sonuç UYDURMA. Türkçe, kısa cümleler.\n' +
          (U.Animasyon.dersRehberi ? U.Animasyon.dersRehberi(it.kitap) + '\n' : '') +
          'Akış: 1) KANCA — Jane: "Bunu kimse sana anlatmadı: …" (en çarpıcı bulgu) 2) arka plan: hangi organ/hücre süreci (vucut + kamera zoom ya da lab) 3) ne yaptılar (kısa) 4) ne buldular (özetteki sayılarla grafik/sayaç/zincir) 5) sınav ve klinik için anlamı (bildiğin ders bilgisiyle bağla) 6) bir SORU sahnesi 7) "akılda kalsın".\n' +
          U.Animasyon.SENARYO_KURALI + '\n' +
          'YALNIZ JSON: {"baslik":"kısa","sahneler":[...],"ozet":"tek cümle","yorumlar":[{"ad":"patrick.jane","metin":"…","begeni":sayi}]} (yorumlar: 4; 2 tanesi patrick.jane — bulguyu ders bilgisine bağlayan hap bilgi).\n\n' +
          'MAKALE: ' + m.baslik + ' — ' + (m.dergi || '') + ' ' + (m.yil || '') + '\nÖZET:  + m.ozet.slice(0, 3500) + ', { cache: false })
          .then(function (j) {
            if (!j || !j.sahneler || !j.sahneler.length) throw new Error('reel üretilemedi');
            return kontrolEt(j, 'MAKALE ÖZETİ: ' + m.ozet, { kitapAd: 'Yeni araştırma (' + (it.onceki ? it.onceki.kitapAd : '') + ')' });
          }).then(function (j) {
            j.ders = it.kitap; U.Animasyon.duzelt(j); j.duraklar = []; j.soru = j.sahneler.filter(function (x) { return x && x.tip === 'soru'; }).slice(-1)[0] || null;
            U.depoGuncelle(anahtar, function (d) { d.j = j; d.t = Date.now(); }, 200);
            return j;
          });
      }).then(function (j) {
        j.makale = { id: m.id, baslik: m.baslik, dergi: m.dergi, yil: m.yil, link: m.link, neden: m.neden };
        U.depoGuncelle('reels', function (v) { v.makaleGor = v.makaleGor || {}; v.makaleGor[m.id] = Date.now(); var k = Object.keys(v.makaleGor); if (k.length > 400) delete v.makaleGor[k[0]]; }, 200);
        if (U.Animasyon.onYukle) U.Animasyon.onYukle(j);
        return j;
      });
    }).catch(function (e) { delete bellek[it.id]; throw e; });
  }
  function icerikHer(it) { return it.tur === 'makale' ? icerikMakale(it) : icerik(it); }

  /* ---------- stil ---------- */
  var st = document.createElement('style');
  st.textContent = [
    'body.rl-acik{overflow:hidden}body.rl-acik .ak-kapsul,body.rl-acik header,body.rl-acik .serit,body.rl-acik .jv-altyazi,body.rl-acik .jv-buyuk,body.rl-acik .mn-nokta{display:none!important}',
    '.rl-reel .rl-ilerleme{display:none}',
    '.rl-etiket{position:absolute;left:14px;top:62px;z-index:4;max-width:calc(100% - 100px);font:600 11px var(--f-kod,monospace);letter-spacing:.14em;color:#9ff3e6;text-transform:uppercase;text-shadow:0 0 10px rgba(94,240,220,.6);pointer-events:none;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
    '.rl-etiket.mk{color:#ffd38a;text-shadow:0 0 10px rgba(255,200,100,.6)}',
    '.rl{position:fixed;inset:0;z-index:300;background:radial-gradient(ellipse at 50% 40%,#06222a,#01070a 70%);overflow-y:scroll;scroll-snap-type:y mandatory;overscroll-behavior:contain;scrollbar-width:none}',
    '.rl::-webkit-scrollbar{display:none}',
    '.rl-reel{position:relative;height:100vh;height:100dvh;scroll-snap-align:start;scroll-snap-stop:always;overflow:hidden;display:flex;align-items:center;justify-content:center}',
    '.rl-reel > canvas{position:absolute;inset:0;width:100%;height:100%}',
    '.rl-sahnekap{position:absolute;left:0;right:76px;top:80px;bottom:0}',
    '@media (max-width:640px){.rl-sahnekap{right:64px}}',
    '.rl-ic{position:relative;width:min(720px,calc(100vw - 110px));display:flex;flex-direction:column;gap:14px;align-items:flex-start;padding:80px 20px 120px}',
    '.rl-konu{font:600 11px var(--f-kod,monospace);letter-spacing:.24em;color:#7fe8da;text-transform:uppercase;text-shadow:0 0 10px rgba(94,240,220,.6)}',
    '.rl-kanca{font:700 clamp(24px,4.4vw,40px)/1.18 var(--f-baslik,system-ui);color:#f0fffc;text-shadow:0 0 22px rgba(94,240,220,.55);animation:rlGir .7s cubic-bezier(.2,.9,.2,1.2) both}',
    '.rl-durak{display:grid;grid-template-columns:62px 1fr;gap:12px;align-items:center;opacity:0;transform:translateX(-30px) scale(.96);filter:blur(6px);transition:all .65s cubic-bezier(.2,.9,.2,1.15)}',
    '.rl-durak.gor{opacity:1;transform:none;filter:none}',
    '.rl-durak.simdi .rl-sembol{box-shadow:0 0 0 2px #5ef0dc,0 0 30px rgba(94,240,220,.8);transform:scale(1.12)}',
    '.rl-sembol{width:62px;height:62px;border-radius:50%;display:grid;place-items:center;font-size:30px;background:radial-gradient(circle,rgba(94,240,220,.22),rgba(94,240,220,.02) 70%);box-shadow:0 0 0 1px rgba(110,255,235,.4);transition:all .4s}',
    '.rl-durak small{display:block;font:600 10.5px var(--f-kod,monospace);letter-spacing:.18em;color:#7fe8da;text-transform:uppercase}',
    '.rl-durak i{display:block;font-style:normal;color:#ffd38a;font-size:14.5px;line-height:1.35;margin:2px 0}',
    '.rl-durak b{display:block;color:#effffc;font-size:17px;line-height:1.35;text-shadow:0 0 12px rgba(94,240,220,.35)}',
    '.rl-ozet{font:600 18px/1.4 var(--f-baslik,system-ui);color:#bfffef;opacity:0;transition:opacity .6s;padding:10px 16px;border-radius:16px;box-shadow:inset 0 0 0 1px rgba(110,255,235,.35),0 0 24px rgba(94,240,220,.2)}',
    '.rl-ozet.gor{opacity:1}',
    '.rl-sag{position:absolute;right:max(12px,env(safe-area-inset-right));bottom:120px;display:flex;flex-direction:column;gap:16px;align-items:center;z-index:3}',
    '.rl-sag button{width:54px;height:54px;border-radius:50%;border:0;background:radial-gradient(circle,rgba(94,240,220,.18),rgba(0,0,0,.25) 70%);box-shadow:0 0 0 1px rgba(110,255,235,.35);color:#e9fffb;font-size:22px;display:grid;place-items:center;position:relative}',
    '.rl-sag button small{position:absolute;bottom:-17px;font:600 10.5px var(--f-kod,monospace);color:#bfeee8;white-space:nowrap}',
    '.rl-sag button[aria-pressed=true]{color:#ff6b8a;box-shadow:0 0 0 1px #ff6b8a,0 0 20px rgba(255,107,138,.5)}',
    '.rl-ust{position:fixed;top:max(12px,env(safe-area-inset-top));left:14px;right:14px;z-index:310;display:flex;align-items:center;gap:12px;pointer-events:none}',
    '.rl-ust > *{pointer-events:auto}',
    '.rl-ust button,.rl-ust select{background:rgba(0,0,0,.3);border:1px solid rgba(110,255,235,.35);color:#e6fffb;border-radius:999px;padding:7px 12px;font:600 12px var(--f-kod,monospace)}',
    '.rl-istat{margin-left:auto;font:600 12px var(--f-kod,monospace);color:#ffd38a;letter-spacing:.06em;text-shadow:0 0 10px rgba(255,200,100,.5);display:flex;align-items:center;gap:10px}',
    '.rl-halka{width:30px;height:30px}',
    '.rl-ilerleme{position:absolute;left:0;right:0;bottom:0;height:3px;background:rgba(94,240,220,.12);z-index:3}',
    '.rl-ilerleme i{display:block;height:100%;width:0;background:linear-gradient(90deg,#46c8ff,#5ef0dc);box-shadow:0 0 10px #5ef0dc}',
    '.rl-kalp{position:absolute;font-size:110px;pointer-events:none;animation:rlKalp .9s ease-out forwards;z-index:4;filter:drop-shadow(0 0 20px rgba(255,107,138,.8))}',
    '@keyframes rlKalp{0%{opacity:0;transform:scale(.3)}25%{opacity:1;transform:scale(1.15)}100%{opacity:0;transform:scale(1) translateY(-60px)}}',
    '@keyframes rlGir{from{opacity:0;transform:translateY(20px);filter:blur(8px)}to{opacity:1;transform:none;filter:none}}',
    '.rl-sayfa{position:fixed;left:0;right:0;bottom:0;z-index:320;max-height:72vh;overflow:auto;border-radius:24px 24px 0 0;background:linear-gradient(180deg,rgba(6,28,34,.96),rgba(2,10,14,.98));box-shadow:0 -1px 0 rgba(110,255,235,.4),0 -20px 60px rgba(0,0,0,.6);padding:16px 18px 30px;animation:rlSayfa .35s cubic-bezier(.2,.9,.2,1.1)}',
    '@keyframes rlSayfa{from{transform:translateY(100%)}to{transform:none}}',
    '.rl-sayfa h3{margin:0 0 10px;font:600 12px var(--f-kod,monospace);letter-spacing:.2em;color:#5ef0dc}',
    '.rl-yorum{display:grid;grid-template-columns:36px 1fr auto;gap:10px;padding:10px 0;border-bottom:1px solid rgba(94,240,220,.08)}',
    '.rl-yorum .av{width:36px;height:36px;border-radius:50%;display:grid;place-items:center;font-weight:700;background:rgba(94,240,220,.15);color:#5ef0dc}',
    '.rl-yorum .jane{background:linear-gradient(135deg,#ffd38a,#c08a3a);color:#1b1206}',
    '.rl-yorum b{font-size:13px;color:#9fdcd4}.rl-yorum b.jane-ad{color:#ffd38a}.rl-yorum p{margin:2px 0 0;font-size:14.5px;line-height:1.45;color:#e6fffb}',
    '.rl-yorum span{font-size:12px;color:#8fb9b5;align-self:center}',
    '.rl-yukleniyor{position:relative;color:#9fe8de;font:600 13px var(--f-kod,monospace);letter-spacing:.12em}',
    '@media (max-width:640px){.rl-ic{width:calc(100vw - 90px);padding-top:70px}.rl-durak{grid-template-columns:48px 1fr}.rl-sembol{width:48px;height:48px;font-size:24px}}'
  ].join('\n');
  document.head.appendChild(st);

  /* ---------- arka plan: holografik ızgara + parçacıklar ---------- */
  function arkaPlan(cv, renkKay) {
    var ctx = cv.getContext('2d'), w, h, p = [];
    function boyut() { var r = cv.getBoundingClientRect(); w = cv.width = r.width; h = cv.height = r.height; p = []; for (var i = 0; i < 60; i++) p.push({ x: Math.random() * w, y: Math.random() * h, v: 0.2 + Math.random() * 0.6, r: Math.random() * 1.6 + 0.4 }); }
    boyut();
    return function (t, enerji) {
      if (!w) boyut();
      ctx.clearRect(0, 0, w, h); ctx.globalCompositeOperation = 'lighter';
      var ufuk = h * 0.62; ctx.strokeStyle = 'rgba(94,240,220,0.08)'; ctx.lineWidth = 1;
      for (var i = -12; i <= 12; i++) { ctx.beginPath(); ctx.moveTo(w / 2 + i * 18, ufuk); ctx.lineTo(w / 2 + i * w * 0.18, h); ctx.stroke(); }
      for (var j = 0; j < 9; j++) { var y = ufuk + Math.pow((j + (t * 0.0004) % 1) / 9, 2) * (h - ufuk); ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }
      p.forEach(function (q) { q.y -= q.v * (1 + enerji); if (q.y < 0) { q.y = h; q.x = Math.random() * w; } ctx.fillStyle = 'rgba(' + (renkKay ? '120,220,255' : '120,255,235') + ',' + (0.25 + 0.35 * Math.sin(t * 0.002 + q.x)) + ')'; ctx.fillRect(q.x, q.y, q.r, q.r); });
      var g = ctx.createRadialGradient(w * 0.5, h * 0.35, 0, w * 0.5, h * 0.35, Math.max(w, h) * 0.5); g.addColorStop(0, 'rgba(94,240,220,' + (0.06 + 0.08 * enerji) + ')'); g.addColorStop(1, 'rgba(94,240,220,0)'); ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
      ctx.globalCompositeOperation = 'source-over';
    };
  }

  /* ---------- oynatıcı ---------- */
  var R = null; // açık reels durumu
  function ac(kitap) {
    if (R) kapat();
    var kok = el('div', { class: 'rl', role: 'feed', 'aria-label': 'Reels' });
    var dersSec = el('select', { 'aria-label': 'Ders' }), ses = el('button', { type: 'button', text: '🔊' }), kapatDug = el('button', { type: 'button', text: '✕', 'aria-label': 'Kapat', onclick: kapat });
    var istatEl = el('div', { class: 'rl-istat' });
    var ust = el('div', { class: 'rl-ust' }, [kapatDug, dersSec, ses, istatEl]);
    document.body.appendChild(kok); document.body.appendChild(ust); document.body.classList.add('rl-acik');
    R = { kok: kok, ust: ust, sesAcik: true, reels: [], aktif: -1, raf: 0 };
    try { R.sesAcik = localStorage.getItem('rl_ses') !== '0'; } catch (e) {}
    ses.textContent = R.sesAcik ? '🔊' : '🔇';
    ses.addEventListener('click', function () { R.sesAcik = !R.sesAcik; ses.textContent = R.sesAcik ? '🔊' : '🔇'; try { localStorage.setItem('rl_ses', R.sesAcik ? '1' : '0'); } catch (e) {} if (!R.sesAcik && window.Carvis && window.Carvis.sus) try { window.Carvis.sus(); } catch (e) {} });
    function istatCiz() { istat().then(function (v) { var g = v.gun[bugun()] || 0, hedef = 10, o = Math.min(1, g / hedef); istatEl.innerHTML = ''; istatEl.appendChild(document.createTextNode('🔥 ' + (v.seri || 0) + ' gün · ⚡ ' + v.xp + ' XP · ' + g + '/' + hedef)); var s = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); s.setAttribute('viewBox', '0 0 36 36'); s.setAttribute('class', 'rl-halka'); s.innerHTML = '<circle cx="18" cy="18" r="15" fill="none" stroke="rgba(255,211,138,.2)" stroke-width="4"/><circle cx="18" cy="18" r="15" fill="none" stroke="#ffd38a" stroke-width="4" stroke-linecap="round" stroke-dasharray="' + (94 * o).toFixed(0) + ' 94" transform="rotate(-90 18 18)"/>'; istatEl.appendChild(s); }); }
    R.istatCiz = istatCiz; istatCiz();
    Kitaplik.katalog().then(function (l) {
      var ilk = kitap || (U.Durum && U.Durum.kitapId) || (function () { try { return sessionStorage.getItem('dersKitap'); } catch (e) { return null; } })() || (l[0] && l[0].id);
      l.forEach(function (k) { dersSec.appendChild(el('option', { value: k.id, text: String(k.baslik).replace(/^1001\s*/, ''), selected: k.id === ilk ? true : null })); });
      katalogIds = l.map(function (k) { return k.id; });
      dersSec.addEventListener('change', function () { yukle(dersSec.value); });
      yukle(ilk);
    });
    /* SONSUZ AKIŞ (kullanıcı: "reels akışı hiç bitmesin, kaydırabildiğim kadar kaydırayım"): seçilen dersin konuları (sınav olasılığı
       sırasıyla) → bitince diğer dersler eklenir → hepsi bitince başa döner (izlenenler önbellekten, kota harcamaz). Her 4. reel makale. */
    var katalogIds = [];
    function yukle(k) {
      kok.innerHTML = ''; R.reels = []; R.aktif = -1; R.liste = []; R.imlec = 0; R.n = 0; R.sonKonu = null; R.yuklenen = [k]; R.kitapYukleniyor = false;
      if (R.io) R.io.disconnect();
      R.io = new IntersectionObserver(function (l) { l.forEach(function (e) { if (e.isIntersecting && e.intersectionRatio > 0.6) { var i = +e.target.dataset.i; if (i !== R.aktif) basla(i); } }); }, { root: kok, threshold: [0.6] });
      var bekle = el('div', { class: 'rl-reel' }, [el('div', { class: 'rl-yukleniyor', text: 'Akış hazırlanıyor: konular çıkmış soru olasılığına göre sıralanıyor…' })]); kok.appendChild(bekle);
      akisKur(k).then(function (a) { bekle.remove(); R.liste = a.l.slice(); ekle(6); });
    }
    function digerKitap() {
      if (R.kitapYukleniyor) return; var k = katalogIds.filter(function (x) { return R.yuklenen.indexOf(x) < 0; })[0]; if (!k) return;
      R.kitapYukleniyor = true; R.yuklenen.push(k);
      akisKur(k).then(function (a) { R.liste = R.liste.concat(a.l); }).catch(function () {}).then(function () { R.kitapYukleniyor = false; });
    }
    function sonrakiOge() {
      R.n++;
      if (R.n % 4 === 0 && R.sonKonu) return { tur: 'makale', id: 'mk|' + R.n, slot: R.n, onceki: R.sonKonu, kitap: R.sonKonu.kitap, kitapAd: '📰 Yeni araştırma', konu: 'Yeni araştırma', bolum: '', sira: R.sonKonu.sira };
      if (!R.liste.length) return null;
      if (R.imlec >= R.liste.length - 6) digerKitap();
      if (R.imlec >= R.liste.length) R.imlec = 0;
      var it = R.liste[R.imlec++]; R.sonKonu = it; return it;
    }
    function ekle(adet) {
      for (var k = 0; k < adet; k++) { var it = sonrakiOge(); if (!it) break; var r = reelKur(it, R.reels.length); R.reels.push(r); kok.appendChild(r.el); R.io.observe(r.el); }
    }
    R.ekle = ekle;
    var son = 0;
    function kare(t) {
      if (!R) return; R.raf = requestAnimationFrame(kare);
      if (t - son < 33) return; son = t;
      var r = R.reels[R.aktif]; if (r && r.ciz) r.ciz(t);
    }
    R.raf = requestAnimationFrame(kare);
  }
  function kapat() {
    if (!R) return; cancelAnimationFrame(R.raf); if (R.io) R.io.disconnect(); R.reels.forEach(function (r) { r.dur && r.dur(); });
    R.kok.remove(); R.ust.remove(); document.body.classList.remove('rl-acik'); try { if (window.Carvis && window.Carvis.sus) window.Carvis.sus(); } catch (e) {} R = null;
  }
  function onHazirla(i) { [i + 1, i + 2].forEach(function (j) { var r = R && R.reels[j]; if (r) icerikHer(r.it).catch(function () {}); }); }

  function reelKur(it, i) {
    var cv = el('canvas', { 'aria-hidden': 'true' }), ic = el('div', { class: 'rl-ic' }), ilerI = el('i'), sag = el('div', { class: 'rl-sag' });
    var kok = el('section', { class: 'rl-reel', 'data-i': String(i), 'aria-label': it.konu }, [cv, ic, sag, el('div', { class: 'rl-ilerleme' }, [ilerI])]);
    var r = { el: kok, it: it, j: null, t0: 0, durak: -1, bitti: false };
    var mk = it.tur === 'makale';
    var etiketMetni = mk ? '📰 Yeni araştırma · ' + (it.onceki ? it.onceki.konu : '') : String(it.kitapAd).replace(/^1001\s*/, '') + ' · ' + it.konu + (it.ol != null ? ' · sınavda %' + Math.round(it.ol * 100) : '');
    var etiket = el('div', { class: 'rl-etiket' + (mk ? ' mk' : ''), text: etiketMetni }); kok.appendChild(etiket);
    ic.appendChild(el('div', { class: 'rl-konu', text: etiketMetni }));
    ic.appendChild(el('div', { class: 'rl-yukleniyor', text: 'Hazırlanıyor…' }));
    var ap = null, begen = el('button', { type: 'button', 'aria-label': 'Beğen', 'aria-pressed': 'false' }, ['♥', el('small', { text: '' })]);
    function dugme(ikon, ad, fn) { var b = el('button', { type: 'button', 'aria-label': ad, onclick: fn }, [ikon, el('small', { text: ad })]); sag.appendChild(b); return b; }
    sag.appendChild(begen);
    dugme('🏛', 'Saray', function () { if (!r.j) return; if (!r.j.duraklar || !r.j.duraklar.length) return U.toast('Bu reel\'de hafıza sarayı yok.'); sarayKaydet(r); });
    dugme('🔍', 'Test', function () { if (r.j) testAc(r); });
    dugme('💬', 'Yorum', function () { if (r.j) yorumlar(r); });
    dugme(mk ? '📄' : '↗', mk ? 'Makale' : 'Kitap', function () { if (mk) { if (r.j && r.j.makale && r.j.makale.link) window.open(r.j.makale.link, '_blank', 'noopener'); return; } kapat(); location.hash = U.okuHash(it.kitap, it.sira); });
    istat().then(function (v) { var b = v.begen[it.id]; begen.setAttribute('aria-pressed', String(!!b)); begen.lastChild.textContent = String(800 + ((i * 7919) % 4000) + (b ? 1 : 0)); });
    function begenToggle(zorla) { U.depoGuncelle('reels', function (v) { v.begen = v.begen || {}; var on = zorla || !v.begen[it.id]; if (on) v.begen[it.id] = 1; else delete v.begen[it.id]; begen.setAttribute('aria-pressed', String(on)); begen.lastChild.textContent = String(800 + ((i * 7919) % 4000) + (on ? 1 : 0)); }, 200); }
    begen.addEventListener('click', function () { begenToggle(false); });
    var sonDokun = 0;
    kok.addEventListener('pointerup', function (e) { if (e.target.closest('button, select, .rl-sayfa')) return; var n = Date.now(); if (n - sonDokun < 320) { begenToggle(true); var k = el('div', { class: 'rl-kalp', text: '♥', style: 'left:' + (e.clientX - 50) + 'px;top:' + (e.clientY - 70) + 'px;color:#ff6b8a' }); kok.appendChild(k); setTimeout(function () { k.remove(); }, 900); } sonDokun = n; });
    var sahneKap = el('div', { class: 'rl-sahnekap' }); kok.insertBefore(sahneKap, sag);
    r.basla = function () {
      r.bitti = false; ilerI.style.width = '0';
      icerikHer(it).then(function (j) {
        r.j = j; if (!R || R.reels[R.aktif] !== r) return;
        if (mk && j.makale) etiket.textContent = '📰 ' + (j.makale.dergi || 'Yeni araştırma') + ' ' + (j.makale.yil || '') + ' · ' + (j.makale.neden || '');
        ic.style.display = 'none'; if (r.oy) r.oy.yoket();
        r.oy = new U.Animasyon.Oynatici(sahneKap, j, {
          konus: function (m) { if (R && R.sesAcik && window.Carvis && window.Carvis.soyle) return window.Carvis.soyle(m); },
          sus: function () { if (window.Carvis && window.Carvis.sus) window.Carvis.sus(); },
          cevap: function (ok, q) { izlendi(it.id + '|soru|' + String(q.soru).slice(0, 20), ok ? 20 : 5).then(function () { R && R.istatCiz(); }); if (!ok && !mk && U.eksikEkle) U.eksikEkle({ kitap: it.kitap, bolum: it.bolum, sira: it.sira, konu: it.konu, soru: String(q.soru).slice(0, 160), bilmiyor: false, kaynak: 'reels' }); },
          bitti: function () { if (r.bitti) return; r.bitti = true; ilerI.style.width = '100%'; izlendi(it.id, 10).then(function () { R && R.istatCiz(); }); var sonraki = R && R.reels[i + 1]; if (sonraki && !document.querySelector('.rl-sayfa')) setTimeout(function () { R.kok.scrollTo({ top: sonraki.el.offsetTop, behavior: 'smooth' }); }, 1200); }
        });
        r.oy.basla();
        onHazirla(i);
      }, function (e) {
        ic.style.display = ''; ic.lastChild.textContent = (mk ? 'Makale reel\'i hazırlanamadı: ' : 'Bu reel hazırlanamadı: ') + (U.AI && U.AI.hataMetni ? U.AI.hataMetni(e) : e.message || e) + ' — sonrakine geçiliyor…';
        // akış takılmasın: hatalı reel kendiliğinden atlanır
        setTimeout(function () { if (R && R.reels[R.aktif] === r && R.reels[i + 1]) R.kok.scrollTo({ top: R.reels[i + 1].el.offsetTop, behavior: 'smooth' }); }, mk ? 1200 : 3500);
      });
    };
    r.ciz = null;
    r.dur = function () { if (r.oy) { r.oy.yoket(); r.oy = null; } };
    return r;
  }
  function basla(i) {
    if (!R) return; var e = R.reels[R.aktif]; if (e) e.dur(); R.aktif = i; try { if (window.Carvis && window.Carvis.sus) window.Carvis.sus(); } catch (x) {}
    var s = document.querySelector('.rl-sayfa'); if (s) s.remove();
    R.reels[i].basla();
    if (i >= R.reels.length - 3 && R.ekle) R.ekle(5);
  }

  /* ---------- 🏛 sarayı kaydet ---------- */
  function sarayKaydet(r) {
    var j = r.j, it = r.it;
    var s = { id: 'rl-' + it.id.replace(/[^a-z0-9]/gi, '').slice(-24), ad: it.konu + ' sarayı', tema: j.mekan || 'Saray', kitap: it.kitap, kitapAd: it.kitapAd, sira: it.sira, bolumAd: it.bolum,
      odalar: j.duraklar.map(function (d) { return { ad: d.yer, sembol: d.sembol, sahne: d.imge, bilgi: d.bilgi, anahtar: d.anahtar || '' }; }), t: Date.now(), gezinti: { n: 0 } };
    U.depoGuncelle('saraylar', function (v) { v.liste = (v.liste || []).filter(function (x) { return x.id !== s.id; }); v.liste.push(s); if (v.liste.length > 60) v.liste.shift(); }, 200)
      .then(function () { izlendi(it.id + '|saray', 15); U.toast('🏛 Saray kaydedildi: Saraylar sekmesinde gezebilirsin (+15 XP)'); R && R.istatCiz(); });
  }
  /* ---------- 🔍 ayırt testi ---------- */
  function testAc(r) {
    var q = r.j.soru; if (!q || !q.siklar) return U.toast('Bu reel için soru yok.');
    var sayfa = el('div', { class: 'rl-sayfa', role: 'dialog', 'aria-label': 'Ayırt testi' }, [el('h3', { text: '🔍 AYIRT ET' }), el('button', { class: 'dugme kucuk', type: 'button', style: 'position:absolute;right:16px;top:12px', text: '✕', onclick: function () { sayfa.remove(); } })]);
    var kap = el('div'); sayfa.appendChild(kap); r.el.appendChild(sayfa);
    U.testCiz(kap, { baslik: r.it.konu, sorular: [{ soru: q.soru, siklar: q.siklar.slice(0, 5), dogru: Math.max(0, Math.min(4, +q.dogru || 0)), aciklama: q.aciklama || '', kitap: r.it.kitap, sira: r.it.sira, bolumAd: r.it.bolum, konu: r.it.konu }] }, { kaynak: 'reels', bitti: function (d) { izlendi(r.it.id + '|test', d ? 20 : 5).then(function () { R && R.istatCiz(); }); U.toast(d ? '✓ Doğru! +20 XP' : 'Yanlış, Eksikler\'e eklendi. +5 XP'); } });
  }
  /* ---------- 💬 yorumlar ---------- */
  function yorumlar(r) {
    var sayfa = el('div', { class: 'rl-sayfa', role: 'dialog', 'aria-label': 'Yorumlar' }, [el('h3', { text: '💬 YORUMLAR · ' + (r.j.yorumlar || []).length }), el('button', { class: 'dugme kucuk', type: 'button', style: 'position:absolute;right:16px;top:12px', text: '✕', onclick: function () { sayfa.remove(); } })]);
    (r.j.yorumlar || []).slice().sort(function (a, b) { return (b.ad === 'patrick.jane') - (a.ad === 'patrick.jane') || (b.begeni || 0) - (a.begeni || 0); }).forEach(function (y) {
      var jane = /jane/i.test(y.ad || '');
      sayfa.appendChild(el('div', { class: 'rl-yorum' }, [el('div', { class: 'av' + (jane ? ' jane' : ''), text: jane ? 'PJ' : String(y.ad || '?').charAt(0).toUpperCase() }), el('div', {}, [el('b', { class: jane ? 'jane-ad' : '', text: (y.ad || 'öğrenci') + (jane ? ' ✓' : '') }), el('p', { text: y.metin || '' })]), el('span', { text: '♥ ' + (y.begeni || 0) })]));
    });
    sayfa.appendChild(el('p', { class: 'var-etiket', style: 'margin-top:10px', text: 'Yorumlar yapay zekâ üretimidir (gerçek kişiler değil); bilgiler kitaba dayanır.' }));
    r.el.appendChild(sayfa);
  }

  U.reelsAc = ac;
  U.GORUNUMLER.reels = function () { var ana = $('#ana'); ana.innerHTML = ''; ana.appendChild(el('div', { class: 'sayfa' }, [el('p', { class: 'var-etiket', text: 'Reels açılıyor…' })])); ac(); };
  U.SEKMELER.push({ id: 'reels', ad: 'Reels', ikon: '▶' });
  if (U.sekmeleriCiz) try { U.sekmeleriCiz(); } catch (e) {}
})();
