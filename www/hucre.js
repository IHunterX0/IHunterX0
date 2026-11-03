/* 1001 — Hücre laboratuvarı (kullanıcı, 2026-11-03: "hareket kısmındaki yapıları kaldır; büyük yapı değil hücre düzeyinde görmek
   istiyorum: bir nöronun anlık değişimleri, kas hücresinin kasılması, ribozomun, mitokondrinin çalışması… böyle bir liste yap, girip
   bakabileyim; iki üç şey olsa sıkıcı olur").
   Her süreç: holografik canvas animasyonu (döngü), evre çipleri (dokununca o evreye atlar), evrenin açıklaması, oynat/durdur, hız,
   "Carvis'e sor". Animasyonlar şematiktir; açıklamalar standart fizyoloji/biyokimya bilgisidir. */
(function () {
  'use strict';
  var U = window.Uygulama; if (!U) return;
  var el = U.el, $ = U.$;
  var TEAL = '94,240,220', MAVI = '70,200,255', SARI = '255,207,110', MOR = '200,140,255', KIRMIZI = '255,120,120', YESIL = '140,255,160';
  function rgba(c, a) { return 'rgba(' + c + ',' + a + ')'; }
  function kl(x) { return Math.max(0, Math.min(1, x)); }
  function ara(t, a, b) { return kl((t - a) / (b - a)); }
  function yumu(x) { x = kl(x); return x * x * (3 - 2 * x); }
  function lerp(a, b, x) { return a + (b - a) * x; }

  /* ---------- çizim yardımcıları ---------- */
  function Cz(ctx, w, h) {
    var z = Math.min(w, h) / 470;
    return {
      z: z,
      cizgi: function (pts, c, a, lw) { ctx.strokeStyle = rgba(c, a); ctx.lineWidth = (lw || 1.5) * z; ctx.beginPath(); pts.forEach(function (p, i) { if (i) ctx.lineTo(p[0], p[1]); else ctx.moveTo(p[0], p[1]); }); ctx.stroke(); },
      daire: function (x, y, r, c, a, dolu) { ctx.beginPath(); ctx.arc(x, y, r * z, 0, Math.PI * 2); if (dolu === false) { ctx.strokeStyle = rgba(c, a); ctx.lineWidth = 1.4 * z; ctx.stroke(); } else { ctx.fillStyle = rgba(c, a); ctx.fill(); } },
      kutu: function (x, y, bw, bh, c, a, r) { r = (r || 8) * z; ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + bw, y, x + bw, y + bh, r); ctx.arcTo(x + bw, y + bh, x, y + bh, r); ctx.arcTo(x, y + bh, x, y, r); ctx.arcTo(x, y, x + bw, y, r); ctx.closePath(); ctx.fillStyle = rgba(c, a * 0.25); ctx.fill(); ctx.strokeStyle = rgba(c, a); ctx.lineWidth = 1.4 * z; ctx.stroke(); },
      yazi: function (s, x, y, c, a, boy, hiza) { ctx.fillStyle = rgba(c || '220,255,250', a == null ? 0.9 : a); ctx.font = '600 ' + Math.round((boy || 12) * z) + 'px ui-monospace,monospace'; ctx.textAlign = hiza || 'center'; ctx.fillText(s, x, y); },
      iyon: function (x, y, s, c, a) { ctx.beginPath(); ctx.arc(x, y, 7 * z, 0, Math.PI * 2); ctx.fillStyle = rgba(c, 0.25 * (a == null ? 1 : a)); ctx.fill(); ctx.strokeStyle = rgba(c, a == null ? 1 : a); ctx.lineWidth = 1.3 * z; ctx.stroke(); ctx.fillStyle = rgba(c, a == null ? 1 : a); ctx.font = '700 ' + Math.round(8 * z) + 'px ui-monospace,monospace'; ctx.textAlign = 'center'; ctx.fillText(s, x, y + 3 * z); },
      zar: function (x0, x1, y, kal, c, a) { // fosfolipit çift tabaka
        var adim = 12 * z; for (var x = x0; x < x1; x += adim) { [y - kal / 2, y + kal / 2].forEach(function (yy, i) { ctx.beginPath(); ctx.arc(x, yy, 3.6 * z, 0, Math.PI * 2); ctx.fillStyle = rgba(c, a); ctx.fill(); ctx.strokeStyle = rgba(c, a * 0.5); ctx.lineWidth = z; ctx.beginPath(); ctx.moveTo(x - 1.5 * z, yy + (i ? -1 : 1) * 4 * z); ctx.lineTo(x - 1.5 * z, y + (i ? 1 : -1) * 2 * z); ctx.moveTo(x + 1.5 * z, yy + (i ? -1 : 1) * 4 * z); ctx.lineTo(x + 1.5 * z, y + (i ? 1 : -1) * 2 * z); ctx.stroke(); }); }
      },
      ok: function (x0, y0, x1, y1, c, a) { var an = Math.atan2(y1 - y0, x1 - x0), l = 7 * z; this.cizgi([[x0, y0], [x1, y1]], c, a, 1.6); this.cizgi([[x1 - l * Math.cos(an - 0.45), y1 - l * Math.sin(an - 0.45)], [x1, y1], [x1 - l * Math.cos(an + 0.45), y1 - l * Math.sin(an + 0.45)]], c, a, 1.6); },
      grafik: function (x, y, gw, gh, f, t, etiketler) { // f(u)→mV, u 0..1 ; t'ye kadar çizilir
        ctx.strokeStyle = rgba(TEAL, 0.25); ctx.lineWidth = z; ctx.strokeRect(x, y, gw, gh);
        function yy(v) { return y + gh - (v + 100) / 150 * gh; }
        (etiketler || [[30, '+30'], [0, '0'], [-55, '-55 eşik'], [-70, '-70'], [-90, '-90']]).forEach(function (e) { ctx.strokeStyle = rgba(TEAL, 0.1); ctx.beginPath(); ctx.moveTo(x, yy(e[0])); ctx.lineTo(x + gw, yy(e[0])); ctx.stroke(); this.yazi(e[1], x - 6 * z, yy(e[0]) + 4 * z, '160,220,220', 0.7, 9, 'right'); }, this);
        ctx.strokeStyle = rgba(SARI, 0.95); ctx.lineWidth = 2.2 * z; ctx.beginPath();
        for (var i = 0; i <= 200 * t; i++) { var u = i / 200, X = x + u * gw, Y = yy(f(u)); if (i) ctx.lineTo(X, Y); else ctx.moveTo(X, Y); }
        ctx.stroke();
        var son = f(t); this.daire(x + t * gw, yy(son), 4, SARI, 1); this.yazi(Math.round(son) + ' mV', x + t * gw, yy(son) - 10 * z, SARI, 1, 11);
      }
    };
  }

  /* ---------- süreçler ---------- */
  var SUREC = [];
  function surec(o) { SUREC.push(o); }

  // 1) Nöron aksiyon potansiyeli
  function apV(u) { // mV
    if (u < 0.15) return -70; if (u < 0.2) return lerp(-70, -55, yumu(ara(u, 0.15, 0.2)));
    if (u < 0.3) return lerp(-55, 30, yumu(ara(u, 0.2, 0.3))); if (u < 0.45) return lerp(30, -80, yumu(ara(u, 0.3, 0.45)));
    if (u < 0.6) return lerp(-80, -72, ara(u, 0.45, 0.6)); return -70;
  }
  surec({ id: 'aksiyon-potansiyeli', ad: 'Nöronda aksiyon potansiyeli', kat: 'Sinir', sure: 9000,
    ozet: 'Voltaj kapılı Na⁺ ve K⁺ kanallarıyla depolarizasyon, repolarizasyon, hiperpolarizasyon; canlı voltaj grafiği.',
    evreler: [
      [0, 0.15, 'Dinlenim', 'Zar potansiyeli ≈ −70 mV. Sızıntı K⁺ kanalları ve Na⁺/K⁺-ATPaz dengeyi korur; voltaj kapılı Na⁺ kanalları kapalı ama aktive edilebilir durumda.'],
      [0.15, 0.2, 'Eşiğe ulaşma', 'Dendrit/soma kaynaklı uyarı aksonun başlangıç bölgesinde zarı ≈ −55 mV eşiğine taşır. Eşik aşılırsa ya hep ya hiç yanıt başlar.'],
      [0.2, 0.3, 'Depolarizasyon', 'Voltaj kapılı Na⁺ kanalları hızla açılır; Na⁺ elektrokimyasal gradyanla içeri akar (pozitif geri besleme). Potansiyel ≈ +30 mV\'ye çıkar.'],
      [0.3, 0.45, 'Repolarizasyon', 'Na⁺ kanalları inaktive olur (inaktivasyon kapısı kapanır); gecikmeli voltaj kapılı K⁺ kanalları açılır, K⁺ dışarı çıkar. Mutlak refrakter dönem.'],
      [0.45, 0.6, 'Hiperpolarizasyon', 'K⁺ kanalları yavaş kapandığı için potansiyel −70\'in altına iner (≈ −80 mV). Göreceli refrakter dönem: daha güçlü uyarı gerekir.'],
      [0.6, 1, 'Dinlenime dönüş', 'K⁺ kanalları kapanır; Na⁺/K⁺-ATPaz (3 Na⁺ dışarı, 2 K⁺ içeri) uzun vadede iyon gradyanlarını korur. Tek bir AP gradyanları anlamlı değiştirmez.']],
    ciz: function (ctx, w, h, u, C) {
      var my = h * 0.33, x0 = w * 0.06, x1 = w * 0.94;
      C.yazi('HÜCRE DIŞI', w * 0.5, my - 60 * C.z, MAVI, 0.6, 11); C.yazi('SİTOPLAZMA', w * 0.5, my + 70 * C.z, MAVI, 0.6, 11);
      C.zar(x0, x1, my, 26 * C.z, TEAL, 0.55);
      var na = u >= 0.2 && u < 0.3, k = u >= 0.3 && u < 0.6;
      [0.28, 0.62].forEach(function (f) { var x = w * f; C.kutu(x - 14 * C.z, my - 22 * C.z, 28 * C.z, 44 * C.z, na ? YESIL : TEAL, na ? 1 : 0.5, 6); C.yazi('Na⁺ k.', x, my - 28 * C.z, TEAL, 0.8, 9); });
      [0.45, 0.8].forEach(function (f) { var x = w * f; C.kutu(x - 14 * C.z, my - 22 * C.z, 28 * C.z, 44 * C.z, k ? MOR : TEAL, k ? 1 : 0.5, 6); C.yazi('K⁺ k.', x, my - 28 * C.z, TEAL, 0.8, 9); });
      for (var i = 0; i < 7; i++) { // Na+ akışı
        var p = (u * 6 + i / 7) % 1, x = w * (i % 2 ? 0.28 : 0.62) + (i - 3) * 2 * C.z;
        if (na) C.iyon(x, lerp(my - 50 * C.z, my + 50 * C.z, (ara(u, 0.2, 0.3) + i / 7) % 1), 'Na⁺', YESIL, 1);
        else C.iyon(w * (0.12 + i * 0.12), my - 44 * C.z + Math.sin(p * 6.28 + i) * 6 * C.z, 'Na⁺', YESIL, 0.5);
        if (k) C.iyon(w * (i % 2 ? 0.45 : 0.8) + (i - 3) * 2 * C.z, lerp(my + 50 * C.z, my - 50 * C.z, (ara(u, 0.3, 0.6) + i / 7) % 1), 'K⁺', MOR, 1);
        else C.iyon(w * (0.16 + i * 0.12), my + 46 * C.z + Math.sin(p * 6.28 + i) * 6 * C.z, 'K⁺', MOR, 0.5);
      }
      C.grafik(w * 0.12, h * 0.58, w * 0.8, h * 0.36, apV, u);
    } });

  // 2) Sinaps
  surec({ id: 'sinaps', ad: 'Kimyasal sinaps iletimi', kat: 'Sinir', sure: 10000,
    ozet: 'AP gelir, Ca²⁺ girer, vezikül ekzositozu, nörotransmitter reseptöre bağlanır, EPSP, geri alım.',
    evreler: [
      [0, 0.15, 'AP terminale ulaşır', 'Aksiyon potansiyeli akson terminalini depolarize eder.'],
      [0.15, 0.3, 'Ca²⁺ girişi', 'Voltaj kapılı Ca²⁺ kanalları (N/P/Q tipi) açılır; Ca²⁺ terminale girer.'],
      [0.3, 0.5, 'Ekzositoz', 'Ca²⁺ sinaptotagmine bağlanır; SNARE kompleksi (sinaptobrevin, sintaksin, SNAP-25) vezikülü zara kaynaştırır. Nörotransmitter yarığa salınır. Botulinum toksini SNARE\'leri keser.'],
      [0.5, 0.7, 'Reseptöre bağlanma', 'Nörotransmitter (ör. glutamat, ACh) yarıktan difüzyonla geçip postsinaptik ligand kapılı iyon kanallarına bağlanır.'],
      [0.7, 0.85, 'Postsinaptik potansiyel', 'Kanal açılır; Na⁺ girişi EPSP oluşturur (inhibitör sinapsta Cl⁻ girişi → IPSP). Toplanırsa postsinaptik nöronda AP doğar.'],
      [0.85, 1, 'Sonlanma', 'Nörotransmitter geri alınır (taşıyıcılar), parçalanır (ACh → asetilkolinesteraz) ya da difüze olur. Veziküller endositozla geri döner.']],
    ciz: function (ctx, w, h, u, C) {
      var cx = w / 2, ust = h * 0.42, alt = h * 0.6;
      ctx.beginPath(); ctx.moveTo(cx - 200 * C.z, h * 0.05); ctx.quadraticCurveTo(cx - 210 * C.z, ust, cx, ust); ctx.quadraticCurveTo(cx + 210 * C.z, ust, cx + 200 * C.z, h * 0.05);
      ctx.strokeStyle = rgba(TEAL, 0.8); ctx.lineWidth = 2 * C.z; ctx.stroke(); ctx.fillStyle = rgba(TEAL, 0.06); ctx.fill();
      C.cizgi([[cx - 230 * C.z, alt], [cx + 230 * C.z, alt]], TEAL, 0.8, 2); C.yazi('POSTSİNAPTİK', cx, alt + 40 * C.z, MAVI, 0.6, 11); C.yazi('PRESİNAPTİK TERMİNAL', cx, h * 0.1, MAVI, 0.6, 11);
      if (u < 0.15) C.ok(cx, h * 0.02, cx, h * 0.02 + lerp(0, 90, u / 0.15) * C.z, SARI, 1);
      [-120, 120].forEach(function (dx) { var ac = u > 0.15 && u < 0.5; C.kutu(cx + dx * C.z - 10 * C.z, ust - 26 * C.z, 20 * C.z, 30 * C.z, ac ? SARI : TEAL, ac ? 1 : 0.4, 5); if (ac) for (var i = 0; i < 3; i++) C.iyon(cx + dx * C.z, lerp(ust - 80 * C.z, ust - 10 * C.z, (ara(u, 0.15, 0.3) + i / 3) % 1), 'Ca', SARI, 0.9); });
      var fz = ara(u, 0.3, 0.5);
      [-60, 0, 60].forEach(function (dx, i) { var y = lerp(ust - 90 * C.z, ust - 22 * C.z, yumu(fz)); C.daire(cx + dx * C.z, y, fz > 0.95 ? 0 : 18, TEAL, 0.9, false); if (fz < 0.95) for (var j = 0; j < 5; j++) C.daire(cx + dx * C.z + Math.cos(j * 1.3 + i) * 8 * C.z, y + Math.sin(j * 1.3 + i) * 8 * C.z, 2.5, YESIL, 0.9); });
      if (u > 0.45) for (var n = 0; n < 18; n++) { var d = ara(u, 0.45 + (n % 6) * 0.01, 0.7), x = cx + (n - 9) * 13 * C.z + Math.sin(n * 7) * 6 * C.z; var y2 = lerp(ust, alt - 8 * C.z, d); if (u > 0.85) { y2 = lerp(alt - 8 * C.z, ust + 10 * C.z, ara(u, 0.85, 1)); } C.daire(x, y2, 2.6, YESIL, u > 0.85 ? 0.5 : 0.95); }
      [-100, -35, 35, 100].forEach(function (dx) { var ac = u > 0.6 && u < 0.88; C.kutu(cx + dx * C.z - 12 * C.z, alt - 6 * C.z, 24 * C.z, 22 * C.z, ac ? YESIL : TEAL, ac ? 1 : 0.5, 4); if (ac) C.iyon(cx + dx * C.z, lerp(alt - 30 * C.z, alt + 34 * C.z, (ara(u, 0.7, 0.85) * 2) % 1), 'Na⁺', YESIL, 0.9); });
    } });

  // 3) Kas kasılması — kayan filaman
  surec({ id: 'kas-kasilmasi', ad: 'Kas hücresi kasılması (kayan filamanlar)', kat: 'Kas', sure: 11000,
    ozet: 'Ca²⁺–troponin, tropomiyozin kayması, çapraz köprü döngüsü, ATP ile ayrılma; Z çizgileri yaklaşır.',
    evreler: [
      [0, 0.15, 'Ca²⁺ salınır', 'T tübüldeki AP, DHP reseptörü (L tipi kanal) aracılığıyla sarkoplazmik retikulumdaki riyanodin reseptörünü açar; sitozolik Ca²⁺ artar.'],
      [0.15, 0.28, 'Bağlanma yerleri açılır', 'Ca²⁺ troponin C\'ye bağlanır; tropomiyozin aktin üzerindeki miyozin bağlanma yerlerinden kayar.'],
      [0.28, 0.4, 'Çapraz köprü', 'ADP + Pi taşıyan "kurulmuş" miyozin başı aktine bağlanır.'],
      [0.4, 0.58, 'Güç vuruşu', 'Pi salınır, baş döner ve ince filamanı sarkomer merkezine (M çizgisi) çeker; ADP ayrılır. Z çizgileri yaklaşır, I bandı ve H bölgesi kısalır, A bandı DEĞİŞMEZ.'],
      [0.58, 0.7, 'ATP ile ayrılma', 'Yeni ATP miyozin başına bağlanınca baş aktinden ayrılır. ATP yoksa baş bağlı kalır: rigor mortis.'],
      [0.7, 0.82, 'Başın kurulması', 'Miyozin ATPaz ATP\'yi ADP + Pi\'ye hidrolize eder; baş yeniden kurulur. Ca²⁺ yüksek kaldıkça döngü tekrarlar.'],
      [0.82, 1, 'Gevşeme', 'SERCA pompası Ca²⁺\'u ATP harcayarak SR\'ye geri alır; tropomiyozin bağlanma yerlerini yeniden örter, filamanlar geri kayar.']],
    ciz: function (ctx, w, h, u, C) {
      var cx = w / 2, cy = h * 0.5, kis = u < 0.4 ? 0 : u < 0.58 ? yumu(ara(u, 0.4, 0.58)) : u < 0.82 ? 1 : 1 - yumu(ara(u, 0.82, 1));
      var yari = lerp(250, 175, kis) * C.z; // Z çizgisi mesafesi
      C.cizgi([[cx - yari, cy - 110 * C.z], [cx - yari, cy + 110 * C.z]], MAVI, 1, 3); C.cizgi([[cx + yari, cy - 110 * C.z], [cx + yari, cy + 110 * C.z]], MAVI, 1, 3);
      C.yazi('Z', cx - yari, cy - 120 * C.z, MAVI, 1, 13); C.yazi('Z', cx + yari, cy - 120 * C.z, MAVI, 1, 13); C.yazi('M', cx, cy - 120 * C.z, TEAL, 0.7, 12);
      C.cizgi([[cx, cy - 105 * C.z], [cx, cy + 105 * C.z]], TEAL, 0.25, 1);
      [-80, -27, 27, 80].forEach(function (dy) { // ince filamanlar
        [-1, 1].forEach(function (s) { var x0 = cx + s * yari, x1 = cx + s * (yari - 190 * C.z); C.cizgi([[x0, cy + dy * C.z], [x1, cy + dy * C.z]], TEAL, 0.95, 3);
          var acik = u > 0.15 && u < 0.85; C.cizgi([[x0, cy + dy * C.z + (acik ? 7 : 3) * C.z], [x1, cy + dy * C.z + (acik ? 7 : 3) * C.z]], MOR, 0.6, 1.2); }); });
      [-53, 0, 53].forEach(function (dy) { // kalın filamanlar + başlar
        C.cizgi([[cx - 150 * C.z, cy + dy * C.z], [cx + 150 * C.z, cy + dy * C.z]], SARI, 0.9, 6);
        for (var i = 1; i <= 5; i++) [-1, 1].forEach(function (s) {
          var bx = cx + s * (30 + i * 23) * C.z, aci;
          if (u < 0.28) aci = 0.9; else if (u < 0.4) aci = 0.9; else if (u < 0.58) aci = lerp(0.9, 0.25, yumu(ara(u, 0.4, 0.58))); else if (u < 0.7) aci = 0.25; else if (u < 0.82) aci = lerp(0.25, 0.9, ara(u, 0.7, 0.82)); else aci = 0.9;
          var bagli = u > 0.28 && u < 0.6, yon = dy <= 0 ? -1 : 1;
          [-1, 1].forEach(function (v) { if (dy === 0 && v === 1) return; var tx = bx + s * Math.cos(aci) * 16 * C.z * -1, ty = cy + dy * C.z + v * Math.sin(1.2) * (bagli ? 22 : 16) * C.z * (dy === 0 ? yon : 1); C.cizgi([[bx, cy + dy * C.z], [tx, ty]], bagli ? YESIL : SARI, 0.9, 2.2); C.daire(tx, ty, 3.2, bagli ? YESIL : SARI, 1); });
        });
      });
      if (u < 0.85) for (var j = 0; j < 10; j++) C.iyon(cx + Math.cos(j * 2.4 + u * 6) * 220 * C.z, cy + 150 * C.z + Math.sin(j * 1.7) * 18 * C.z, 'Ca', SARI, u < 0.15 ? ara(u, 0, 0.15) : 0.8);
      C.yazi('Sarkomer uzunluğu: ' + (2.5 - 0.6 * kis).toFixed(2) + ' µm', cx, h * 0.93, '220,255,250', 0.85, 12);
    } });

  // 4) Ribozom — translasyon
  var KODON = ['AUG', 'GCU', 'UUC', 'GGA', 'AAA', 'CUG', 'UAC', 'GAU', 'UGG', 'CCA'], AA = ['Met', 'Ala', 'Phe', 'Gly', 'Lys', 'Leu', 'Tyr', 'Asp', 'Trp', 'Pro'];
  surec({ id: 'ribozom', ad: 'Ribozomda translasyon', kat: 'Organel', sure: 7000, dongu: true,
    ozet: 'mRNA kodonları, A/P/E bölgeleri, aminoasil-tRNA girişi, peptit bağı, translokasyon; polipeptit uzar.',
    evreler: [
      [0, 0.3, 'tRNA A bölgesine girer', 'Doğru antikodonu taşıyan aminoasil-tRNA, EF-Tu·GTP ile A bölgesine gelir. Kodon–antikodon eşleşmesi doğrulanınca GTP hidrolize olur.'],
      [0.3, 0.55, 'Peptit bağı', 'Büyük alt birimdeki peptidil transferaz (bir ribozim: 23S/28S rRNA) P\'deki zinciri A\'daki amino aside aktarır.'],
      [0.55, 0.85, 'Translokasyon', 'EF-G (ökaryotta eEF2)·GTP ile ribozom mRNA üzerinde 3 nükleotit (bir kodon) 3\' yönüne kayar: A→P, P→E. Difteri toksini eEF2\'yi ADP-ribozillenir.'],
      [0.85, 1, 'E bölgesinden çıkış', 'Boş tRNA E bölgesinden ayrılır; A bölgesi bir sonraki kodon için boştur. Dur kodonunda (UAA, UAG, UGA) salım faktörleri zinciri serbest bırakır.']],
    ciz: function (ctx, w, h, u, C, tur) {
      var cy = h * 0.62, kw = 64 * C.z, cx = w / 2, n = tur % (KODON.length - 3);
      var kay = u > 0.55 && u < 0.85 ? yumu(ara(u, 0.55, 0.85)) : u >= 0.85 ? 1 : 0;
      for (var i = 0; i < KODON.length; i++) { var x = cx + (i - n - 1 - kay) * kw; C.kutu(x - kw / 2 + 2, cy, kw - 4, 24 * C.z, i === n + 1 ? YESIL : TEAL, 0.7, 4); C.yazi(KODON[i], x, cy + 17 * C.z, '220,255,250', 0.9, 12); }
      C.yazi("5'", cx - 5.5 * kw, cy + 17 * C.z, TEAL, 0.7, 12); C.yazi("3' mRNA", cx + 5.6 * kw, cy + 17 * C.z, TEAL, 0.7, 12);
      C.kutu(cx - 1.9 * kw, cy - 150 * C.z, 3.8 * kw, 140 * C.z, MAVI, 0.6, 40); C.kutu(cx - 1.6 * kw, cy + 30 * C.z, 3.2 * kw, 46 * C.z, MAVI, 0.5, 20);
      ['E', 'P', 'A'].forEach(function (s, i) { C.yazi(s, cx + (i - 1) * kw, cy - 120 * C.z, MAVI, 0.9, 14); });
      function trna(x, y, aa, a) { C.cizgi([[x, y], [x, y - 60 * C.z]], MOR, a, 3); C.kutu(x - 22 * C.z, y - 20 * C.z, 44 * C.z, 18 * C.z, MOR, a, 6); return [x, y - 64 * C.z]; }
      var pT = trna(cx - kay * kw, cy - 4 * C.z, AA[n], 1);
      var gir = u < 0.3 ? yumu(ara(u, 0, 0.3)) : 1, ax = cx + kw - kay * kw, ay = lerp(cy - 180 * C.z, cy - 4 * C.z, gir);
      var aT = trna(ax, ay, AA[n + 1], 1);
      if (u > 0.85) { var c = ara(u, 0.85, 1); trna(cx - kw - c * 40 * C.z, cy - 4 * C.z - c * 80 * C.z, '', 1 - c); }
      var zincirde = u > 0.55 ? n + 2 : n + 1, uc = u > 0.42 ? aT : pT;
      for (var z = 0; z < zincirde; z++) { var zx = uc[0] - z * 18 * C.z, zy = uc[1] - z * 12 * C.z - Math.sin(z) * 6 * C.z; C.daire(zx, zy, 8, z === 0 ? YESIL : SARI, 0.9); C.yazi(AA[zincirde - 1 - z] || '', zx, zy - 12 * C.z, SARI, 0.8, 8); }
      if (u < 0.42) C.daire(aT[0], aT[1], 8, YESIL, 0.9);
      if (u > 0.3 && u < 0.55) C.yazi('peptidil transferaz', cx + kw * 0.5, cy - 160 * C.z, SARI, 1, 11);
    } });

  // 5) Mitokondri — ETZ + ATP sentaz
  surec({ id: 'mitokondri', ad: 'Mitokondri: elektron taşıma zinciri ve ATP sentaz', kat: 'Organel', sure: 12000,
    ozet: 'NADH/FADH₂ elektronları kompleks I–IV, proton pompalama, O₂ → H₂O, ATP sentazın dönmesi.',
    evreler: [
      [0, 0.18, 'Kompleks I', 'NADH elektronlarını Kompleks I\'e (NADH dehidrojenaz, FMN, Fe-S) verir; 4 H⁺ matristen zarlar arası boşluğa pompalanır. Rotenon bloke eder.'],
      [0.18, 0.3, 'Kompleks II ve Q', 'FADH₂ (süksinat dehidrojenaz = Kompleks II) elektronlarını ubikinona (Q) verir; Kompleks II proton POMPALAMAZ. QH₂ elektronları Kompleks III\'e taşır.'],
      [0.3, 0.48, 'Kompleks III ve sitokrom c', 'Q döngüsüyle 4 H⁺ pompalanır; elektronlar sitokrom c\'ye geçer. Antimisin A bloke eder.'],
      [0.48, 0.65, 'Kompleks IV', 'Sitokrom c oksidaz elektronları O₂\'ye verir: ½O₂ + 2H⁺ → H₂O; 2 H⁺ pompalanır. Siyanür, CO, azid bloke eder.'],
      [0.65, 1, 'ATP sentaz', 'Proton gradyanı (proton itici güç) H⁺\'yı F₀\'dan geri akıtır; c halkası ve γ alt birimi döner, F₁\'deki β alt birimleri ADP + Pi → ATP yapar. Oligomisin F₀\'ı bloke eder; DNP/termogenin gradyanı ATP\'siz harcar.']],
    ciz: function (ctx, w, h, u, C, tur, t) {
      var my = h * 0.5; C.zar(w * 0.03, w * 0.97, my, 30 * C.z, TEAL, 0.5);
      C.yazi('ZARLAR ARASI BOŞLUK (H⁺ yüksek)', w * 0.5, my - 110 * C.z, MAVI, 0.6, 11); C.yazi('MATRİKS', w * 0.5, my + 120 * C.z, MAVI, 0.6, 11);
      var kx = [0.12, 0.27, 0.43, 0.6, 0.83].map(function (f) { return w * f; }), ad = ['I', 'II', 'III', 'IV', 'ATP sentaz'];
      ad.forEach(function (a, i) { var aktif = (i === 0 && u < 0.18) || (i === 1 && u >= 0.18 && u < 0.3) || (i === 2 && u >= 0.3 && u < 0.48) || (i === 3 && u >= 0.48 && u < 0.65) || (i === 4 && u >= 0.65);
        if (i < 4) { C.kutu(kx[i] - 24 * C.z, my - 40 * C.z, 48 * C.z, 80 * C.z, aktif ? SARI : TEAL, aktif ? 1 : 0.6, 10); C.yazi(a, kx[i], my + 5 * C.z, '220,255,250', 1, 14); } });
      // ATP sentaz: F0 halkası + F1 başı (matrikste)
      var ax = kx[4], don = t * 0.004 * (u >= 0.65 ? 1 : 0.25);
      C.kutu(ax - 30 * C.z, my - 18 * C.z, 60 * C.z, 36 * C.z, TEAL, 0.8, 16);
      for (var i = 0; i < 10; i++) { var a = don + i / 10 * Math.PI * 2; C.daire(ax + Math.cos(a) * 22 * C.z, my + Math.sin(a) * 9 * C.z, 3, YESIL, 0.9); }
      C.cizgi([[ax, my + 18 * C.z], [ax, my + 50 * C.z]], TEAL, 0.8, 3);
      for (var j = 0; j < 6; j++) { var b = j / 6 * Math.PI * 2 + don * 0.3; C.daire(ax + Math.cos(b) * 20 * C.z, my + 70 * C.z + Math.sin(b) * 10 * C.z, 11, j % 2 ? MAVI : TEAL, 0.7); }
      C.yazi('F₀', ax + 46 * C.z, my + 4 * C.z, TEAL, 0.8, 11); C.yazi('F₁', ax + 46 * C.z, my + 74 * C.z, TEAL, 0.8, 11);
      // elektron yolu
      var yol = [[kx[0], my + 70 * C.z], [kx[0], my], [kx[1] + 10 * C.z, my + 6 * C.z], [kx[2], my], [kx[2] + 30 * C.z, my - 50 * C.z], [kx[3], my], [kx[3], my + 60 * C.z]];
      var ep = Math.min(0.999, u / 0.65), seg = ep * (yol.length - 1), si = Math.floor(seg), sf = seg - si;
      if (u < 0.65) { var p0 = yol[si], p1 = yol[si + 1]; C.daire(lerp(p0[0], p1[0], sf), lerp(p0[1], p1[1], sf), 6, SARI, 1); C.yazi('e⁻', lerp(p0[0], p1[0], sf), lerp(p0[1], p1[1], sf) - 10 * C.z, SARI, 1, 11); }
      C.yazi('NADH → NAD⁺', kx[0], my + 92 * C.z, '220,255,250', u < 0.18 ? 1 : 0.4, 11); C.yazi('FADH₂', kx[1], my + 92 * C.z, '220,255,250', u >= 0.18 && u < 0.3 ? 1 : 0.4, 11);
      C.yazi('cyt c', kx[2] + 34 * C.z, my - 60 * C.z, SARI, 0.9, 10); C.yazi('½O₂ + 2H⁺ → H₂O', kx[3], my + 92 * C.z, '220,255,250', u >= 0.48 && u < 0.65 ? 1 : 0.4, 11);
      [0, 2, 3].forEach(function (i, k) { var bas = [0, 0.3, 0.48][k], son = [0.18, 0.48, 0.65][k]; if (u > bas && u < son + 0.1) for (var q = 0; q < 3; q++) C.iyon(kx[i] + (q - 1) * 12 * C.z, lerp(my + 30 * C.z, my - 80 * C.z, (ara(u, bas, son + 0.1) + q * 0.2) % 1), 'H⁺', MOR, 0.9); });
      for (var r = 0; r < 12; r++) C.iyon(w * (0.08 + r * 0.075), my - 70 * C.z - Math.sin(r * 3 + t * 0.002) * 8 * C.z, 'H⁺', MOR, 0.35 + 0.3 * kl(u * 2));
      if (u >= 0.65) { for (var s = 0; s < 3; s++) C.iyon(ax - 8 * C.z + s * 8 * C.z, lerp(my - 70 * C.z, my + 30 * C.z, (ara(u, 0.65, 1) * 3 + s / 3) % 1), 'H⁺', MOR, 1); var at = ara(u, 0.75, 1); if (at > 0) C.yazi('ADP + Pi → ATP', ax, my + 112 * C.z, YESIL, at, 13); }
    } });

  // 6) Na+/K+ pompası
  surec({ id: 'na-k-pompasi', ad: 'Na⁺/K⁺-ATPaz pompası', kat: 'Zar', sure: 9000,
    ozet: 'E1/E2 konformasyon döngüsü: 3 Na⁺ dışarı, 2 K⁺ içeri, 1 ATP; elektrojenik.',
    evreler: [
      [0, 0.2, 'E1: 3 Na⁺ bağlanır', 'Pompa içe açık (E1) konformasyonda; yüksek afiniteyle sitoplazmadan 3 Na⁺ bağlar.'],
      [0.2, 0.35, 'Fosforilasyon', 'ATP → ADP; pompa aspartat kalıntısından fosforile olur (P tipi ATPaz).'],
      [0.35, 0.55, 'E2: Na⁺ dışarı', 'Konformasyon değişir (E2-P, dışa açık); Na⁺ afinitesi düşer, 3 Na⁺ hücre dışına salınır.'],
      [0.55, 0.7, '2 K⁺ bağlanır', 'Dışarıdan 2 K⁺ bağlanır. Digoksin/ouabain bu bölgeye bağlanıp pompayı inhibe eder.'],
      [0.7, 0.82, 'Defosforilasyon', 'Fosfat ayrılır; pompa E1\'e döner.'],
      [0.82, 1, 'K⁺ içeri', '2 K⁺ sitoplazmaya bırakılır. Net: her döngüde bir pozitif yük dışarı → elektrojenik, dinlenim potansiyeline küçük katkı; asıl önemi gradyanları korumak.']],
    ciz: function (ctx, w, h, u, C) {
      var my = h * 0.5, cx = w / 2; C.zar(w * 0.05, cx - 70 * C.z, my, 30 * C.z, TEAL, 0.5); C.zar(cx + 70 * C.z, w * 0.95, my, 30 * C.z, TEAL, 0.5);
      C.yazi('HÜCRE DIŞI (Na⁺ yüksek)', cx, h * 0.12, MAVI, 0.6, 11); C.yazi('SİTOPLAZMA (K⁺ yüksek)', cx, h * 0.92, MAVI, 0.6, 11);
      var disa = u >= 0.35 && u < 0.82 ? 1 : 0, gec = u >= 0.3 && u < 0.4 ? ara(u, 0.3, 0.4) : u >= 0.78 && u < 0.86 ? 1 - ara(u, 0.78, 0.86) : disa;
      var ust = lerp(18, 50, gec) * C.z, alt = lerp(50, 18, gec) * C.z;
      ctx.beginPath(); ctx.moveTo(cx - 60 * C.z, my - 80 * C.z); ctx.lineTo(cx - ust, my - 80 * C.z); ctx.lineTo(cx - 14 * C.z, my); ctx.lineTo(cx - alt, my + 80 * C.z); ctx.lineTo(cx - 60 * C.z, my + 80 * C.z); ctx.closePath();
      ctx.moveTo(cx + 60 * C.z, my - 80 * C.z); ctx.lineTo(cx + ust, my - 80 * C.z); ctx.lineTo(cx + 14 * C.z, my); ctx.lineTo(cx + alt, my + 80 * C.z); ctx.lineTo(cx + 60 * C.z, my + 80 * C.z); ctx.closePath();
      ctx.fillStyle = rgba(TEAL, 0.18); ctx.fill(); ctx.strokeStyle = rgba(TEAL, 0.9); ctx.lineWidth = 1.6 * C.z; ctx.stroke();
      var fosfor = u >= 0.2 && u < 0.78; if (fosfor) { C.daire(cx + 66 * C.z, my + 30 * C.z, 9, SARI, 0.9); C.yazi('P', cx + 66 * C.z, my + 34 * C.z, '10,20,20', 1, 10); }
      if (u >= 0.2 && u < 0.35) C.yazi('ATP → ADP', cx + 120 * C.z, my + 60 * C.z, SARI, 1, 12);
      for (var i = 0; i < 3; i++) { var x = cx + (i - 1) * 14 * C.z, y;
        if (u < 0.2) y = lerp(my + 140 * C.z, my + 10 * C.z, yumu(ara(u, 0, 0.2))); else if (u < 0.35) y = my + 10 * C.z; else y = lerp(my - 10 * C.z, my - 150 * C.z, yumu(ara(u, 0.35, 0.55)));
        if (u < 0.6) C.iyon(x, y, 'Na⁺', YESIL, 1); }
      for (var k = 0; k < 2; k++) { var x2 = cx + (k - 0.5) * 16 * C.z, y2;
        if (u < 0.55) y2 = my - 150 * C.z; else if (u < 0.7) y2 = lerp(my - 150 * C.z, my - 10 * C.z, yumu(ara(u, 0.55, 0.7))); else if (u < 0.82) y2 = my - 6 * C.z; else y2 = lerp(my + 10 * C.z, my + 150 * C.z, yumu(ara(u, 0.82, 1)));
        C.iyon(x2, y2, 'K⁺', MOR, u < 0.5 ? 0.4 : 1); }
    } });

  // 7) DNA replikasyonu
  surec({ id: 'dna-replikasyonu', ad: 'DNA replikasyonu (çatal)', kat: 'Çekirdek', sure: 12000,
    ozet: 'Helikaz, SSB, primaz, DNA pol III, öncü ve gecikmeli zincir, Okazaki parçaları, ligaz.',
    evreler: [
      [0, 0.2, 'Açılma', 'Helikaz hidrojen bağlarını kırarak çift sarmalı açar; tek zincir bağlayan proteinler (SSB) zincirleri ayrık tutar. Önde topoizomeraz (giraz) aşırı kıvrılmayı giderir (kinolonlar bakteriyel girazı inhibe eder).'],
      [0.2, 0.4, 'Primer', 'Primaz kısa RNA primerleri sentezler: DNA polimeraz sıfırdan başlayamaz, 3\'-OH ucuna ihtiyaç duyar.'],
      [0.4, 0.7, 'Öncü ve gecikmeli zincir', 'DNA pol III (ökaryotta δ/ε) yalnız 5\'→3\' sentezler: öncü zincir çatal yönünde kesintisiz, gecikmeli zincir ters yönde Okazaki parçaları halinde.'],
      [0.7, 1, 'Primer değişimi ve ligaz', 'DNA pol I primerleri 5\'→3\' ekzonükleaz ile çıkarıp DNA ile doldurur; DNA ligaz parçaları fosfodiester bağıyla birleştirir. Sonuç: yarı korunumlu replikasyon.']],
    ciz: function (ctx, w, h, u, C, tur, t) {
      var cy = h * 0.5, fx = lerp(w * 0.3, w * 0.62, u), ay = 70 * C.z;
      function sarmal(x0, x1, yy, faz) { for (var x = x0; x < x1; x += 6 * C.z) { var s = Math.sin((x / C.z) * 0.05 + faz); C.daire(x, yy + s * 14 * C.z, 2.4, TEAL, 0.7); C.daire(x, yy - s * 14 * C.z, 2.4, MAVI, 0.7); if (Math.abs(s) < 0.2) C.cizgi([[x, yy - 14 * C.z], [x, yy + 14 * C.z]], TEAL, 0.25, 1); } }
      sarmal(fx + 30 * C.z, w * 0.96, cy, t * 0.002);
      C.cizgi([[fx, cy], [w * 0.04, cy - ay]], TEAL, 0.9, 3); C.cizgi([[fx, cy], [w * 0.04, cy + ay]], MAVI, 0.9, 3);
      C.daire(fx + 12 * C.z, cy, 16, SARI, 0.9); C.yazi('helikaz', fx + 12 * C.z, cy - 24 * C.z, SARI, 0.9, 10);
      C.daire(fx + 70 * C.z, cy, 12, MOR, 0.6, false); C.yazi('topoizomeraz', fx + 70 * C.z, cy - 20 * C.z, MOR, 0.8, 9);
      var oncu = ara(u, 0.4, 1); // öncü zincir (üstte: 3'→5' kalıp, sentez çatala doğru)
      var ox1 = lerp(w * 0.04, fx - 20 * C.z, oncu);
      C.cizgi([[w * 0.04, cy - ay + 10 * C.z], [ox1, cy - ay + 10 * C.z + (ox1 - w * 0.04) / (fx - w * 0.04) * (ay - 10 * C.z)]], YESIL, 0.95, 3);
      C.yazi('öncü zincir (kesintisiz) →', w * 0.18, cy - ay - 16 * C.z, YESIL, 0.9, 11);
      // gecikmeli zincir: Okazaki parçaları
      var n = Math.floor(lerp(1, 5, u));
      for (var i = 0; i < n; i++) { var b = w * 0.04 + i * (fx - w * 0.04) / 5, e = b + (fx - w * 0.04) / 5 * 0.85; var yb = cy + ay - 10 * C.z - (b - w * 0.04) / (fx - w * 0.04) * (ay - 10 * C.z), ye = cy + ay - 10 * C.z - (e - w * 0.04) / (fx - w * 0.04) * (ay - 10 * C.z);
        var primerSil = u > 0.7 && i < n - 1; C.cizgi([[b, yb], [lerp(b, e, 0.2), lerp(yb, ye, 0.2)]], primerSil ? YESIL : KIRMIZI, 0.95, 3); C.cizgi([[lerp(b, e, 0.2), lerp(yb, ye, 0.2)], [e, ye]], YESIL, 0.95, 3);
        if (u > 0.85 && i < n - 1) C.daire(e, ye, 4, SARI, 1); }
      C.yazi('← gecikmeli zincir (Okazaki)', w * 0.2, cy + ay + 26 * C.z, YESIL, 0.9, 11); C.yazi('kırmızı: RNA primeri · sarı: ligaz', w * 0.2, cy + ay + 42 * C.z, '220,255,250', 0.6, 10);
      for (var s = 0; s < 6; s++) C.daire(lerp(fx - 30 * C.z, w * 0.06, s / 6) + 20 * C.z, cy + ay * (s / 6) + 4 * C.z, 3, TEAL, 0.5, false);
    } });

  // 8) Transkripsiyon
  surec({ id: 'transkripsiyon', ad: 'Transkripsiyon (RNA polimeraz II)', kat: 'Çekirdek', sure: 11000,
    ozet: 'Promotör (TATA), transkripsiyon kabarcığı, 5\'→3\' mRNA sentezi, sonlanma ve işlenme.',
    evreler: [
      [0, 0.2, 'Başlama', 'Genel transkripsiyon faktörleri (TFIID TATA kutusuna bağlanır) RNA pol II\'yi promotöre yerleştirir; TFIIH DNA\'yı açar ve CTD\'yi fosforiler.'],
      [0.2, 0.75, 'Uzama', 'RNA pol II kalıp (antisens) zinciri 3\'→5\' okur, RNA\'yı 5\'→3\' sentezler (U, T yerine). Primer gerekmez. α-amanitin RNA pol II\'yi inhibe eder.'],
      [0.75, 0.9, 'Sonlanma', 'PoliA sinyalinden (AAUAAA) sonra kesim olur; polimeraz ayrılır.'],
      [0.9, 1, 'İşlenme', 'Pre-mRNA: 5\' 7-metilguanozin şapka, 3\' poli-A kuyruğu, intronların splayzozomla çıkarılması (snRNP). Olgun mRNA sitoplazmaya taşınır.']],
    ciz: function (ctx, w, h, u, C) {
      var cy = h * 0.45, px = lerp(w * 0.18, w * 0.8, ara(u, 0.15, 0.85)), ac = u > 0.12 && u < 0.88;
      for (var x = w * 0.04; x < w * 0.96; x += 7 * C.z) { var yakin = ac && Math.abs(x - px) < 40 * C.z, d = yakin ? (1 - Math.abs(x - px) / (40 * C.z)) * 22 * C.z : 0; C.daire(x, cy - 10 * C.z - d, 2.2, TEAL, 0.75); C.daire(x, cy + 10 * C.z + d, 2.2, MAVI, 0.75); }
      C.yazi('kodlayan (sens) zincir', w * 0.12, cy - 26 * C.z, TEAL, 0.7, 10, 'left'); C.yazi('kalıp (antisens) zincir', w * 0.12, cy + 34 * C.z, MAVI, 0.7, 10, 'left');
      C.kutu(w * 0.12, cy - 8 * C.z, 40 * C.z, 16 * C.z, SARI, u < 0.2 ? 1 : 0.4, 4); C.yazi('TATA', w * 0.12 + 20 * C.z, cy + 4 * C.z, SARI, 0.9, 9);
      C.daire(px, cy, 34, MOR, 0.35); C.daire(px, cy, 34, MOR, 0.9, false); C.yazi('RNA pol II', px, cy - 44 * C.z, MOR, 0.9, 11);
      if (u > 0.2) { var bas = w * 0.18 + 20 * C.z; ctx.strokeStyle = rgba(YESIL, 0.95); ctx.lineWidth = 2.6 * C.z; ctx.beginPath(); ctx.moveTo(px, cy + 14 * C.z); var uz = px - bas; for (var i = 0; i <= 30; i++) { var f = i / 30; ctx.lineTo(px - f * uz, cy + 50 * C.z + f * 50 * C.z + Math.sin(f * 9) * 8 * C.z); } ctx.stroke(); C.yazi("5' → 3' mRNA", px - uz / 2, cy + 120 * C.z, YESIL, 0.9, 11); }
      if (u > 0.9) { C.daire(w * 0.2, cy + 100 * C.z, 7, SARI, 1); C.yazi('5\' şapka', w * 0.2, cy + 122 * C.z, SARI, 1, 10); C.yazi('AAAAA… poli-A', w * 0.62, cy + 150 * C.z, SARI, 1, 11); }
    } });

  // 9) G proteini – cAMP
  surec({ id: 'gpcr-camp', ad: 'G proteini kenetli reseptör → cAMP', kat: 'Sinyal', sure: 11000,
    ozet: 'Ligand, GPCR, Gαs GDP→GTP, adenilat siklaz, cAMP, PKA; GTP hidrolizi ile kapanma.',
    evreler: [
      [0, 0.15, 'Ligand bağlanır', 'Hormon (ör. adrenalin β-reseptöre, glukagon) 7 transmembran segmentli GPCR\'a bağlanır; reseptör konformasyon değiştirir.'],
      [0.15, 0.32, 'GDP → GTP', 'Reseptör guanin nükleotit değişim faktörü gibi davranır: Gαs GDP\'yi bırakıp GTP bağlar.'],
      [0.32, 0.48, 'Ayrılma', 'Gα-GTP, βγ\'dan ayrılır ve zar boyunca adenilat siklaza gider.'],
      [0.48, 0.7, 'cAMP üretimi', 'Adenilat siklaz ATP → cAMP. Kolera toksini Gαs\'yi ADP-ribozillenip GTPaz\'ını bozar (sürekli aktif); boğmaca toksini Gαi\'yi inhibe eder.'],
      [0.7, 0.88, 'PKA aktivasyonu', 'cAMP, PKA\'nın düzenleyici alt birimlerine bağlanır; katalitik alt birimler serbest kalıp hedef proteinleri fosforiller.'],
      [0.88, 1, 'Kapanma', 'Gα kendi GTP\'sini GDP\'ye hidrolize eder ve βγ ile yeniden birleşir; fosfodiesteraz cAMP\'yi AMP\'ye yıkar (kafein/teofilin PDE\'yi inhibe eder).']],
    ciz: function (ctx, w, h, u, C) {
      var my = h * 0.42; C.zar(w * 0.04, w * 0.96, my, 30 * C.z, TEAL, 0.5);
      var rx = w * 0.26, acx = w * 0.7;
      for (var i = 0; i < 7; i++) C.cizgi([[rx - 36 * C.z + i * 12 * C.z, my - 30 * C.z], [rx - 36 * C.z + i * 12 * C.z, my + 30 * C.z]], MAVI, u > 0.08 ? 1 : 0.6, 4);
      C.yazi('GPCR', rx, my - 46 * C.z, MAVI, 0.9, 11);
      var ly = lerp(my - 150 * C.z, my - 38 * C.z, yumu(ara(u, 0, 0.12))); if (u < 0.92) C.daire(rx, ly, 10, SARI, 1); C.yazi('ligand', rx + 26 * C.z, ly, SARI, 0.9, 10, 'left');
      var gx = u < 0.32 ? rx + 50 * C.z : lerp(rx + 50 * C.z, acx - 46 * C.z, yumu(ara(u, 0.32, 0.48))); if (u > 0.88) gx = lerp(acx - 46 * C.z, rx + 50 * C.z, ara(u, 0.88, 1));
      C.daire(gx, my + 44 * C.z, 18, YESIL, 0.8); C.yazi('Gαs', gx, my + 48 * C.z, '10,20,20', 1, 10);
      C.yazi(u > 0.15 && u < 0.92 ? 'GTP' : 'GDP', gx, my + 76 * C.z, u > 0.15 && u < 0.92 ? YESIL : '220,255,250', 1, 10);
      C.daire(rx + 92 * C.z, my + 44 * C.z, 14, MOR, 0.6); C.yazi('βγ', rx + 92 * C.z, my + 48 * C.z, '220,255,250', 0.9, 10);
      C.kutu(acx - 26 * C.z, my - 34 * C.z, 52 * C.z, 68 * C.z, MAVI, u > 0.48 && u < 0.88 ? 1 : 0.5, 10); C.yazi('AC', acx, my + 5 * C.z, '220,255,250', 1, 12);
      if (u > 0.48) for (var c = 0; c < 12; c++) { var f = ara(u, 0.48 + c * 0.012, 0.85), x = acx + Math.cos(c * 2.3) * f * 130 * C.z, y = my + 50 * C.z + Math.sin(c * 1.9) * f * 30 * C.z + f * 90 * C.z; if (f > 0) C.yazi('cAMP', x, y, SARI, u > 0.92 ? 1 - ara(u, 0.92, 1) : 0.9, 9); }
      var pka = ara(u, 0.7, 0.88); C.kutu(w * 0.42, my + 150 * C.z, 70 * C.z, 40 * C.z, pka > 0 ? YESIL : TEAL, 0.5 + pka * 0.5, 8); C.yazi(pka > 0.5 ? 'PKA aktif' : 'PKA (R₂C₂)', w * 0.42 + 35 * C.z, my + 175 * C.z, '220,255,250', 0.9, 10);
    } });

  // 10) Kalp kası AP
  function kalpV(u) { if (u < 0.05) return -90; if (u < 0.08) return lerp(-90, 20, ara(u, 0.05, 0.08)); if (u < 0.12) return lerp(20, 5, ara(u, 0.08, 0.12)); if (u < 0.5) return lerp(5, -5, ara(u, 0.12, 0.5)); if (u < 0.7) return lerp(-5, -90, yumu(ara(u, 0.5, 0.7))); return -90; }
  surec({ id: 'kalp-ap', ad: 'Ventrikül kas hücresi aksiyon potansiyeli', kat: 'Kas', sure: 9000,
    ozet: 'Faz 0–4: hızlı Na⁺, geçici K⁺, plato (L tipi Ca²⁺), repolarizasyon; uzun refrakter dönem.',
    evreler: [
      [0, 0.05, 'Faz 4', 'Dinlenim ≈ −90 mV; IK1 (içe doğrultucu K⁺) kanallarıyla korunur.'],
      [0.05, 0.08, 'Faz 0', 'Hızlı voltaj kapılı Na⁺ kanalları açılır: hızlı depolarizasyon. Sınıf I antiaritmikler bu fazı yavaşlatır.'],
      [0.08, 0.12, 'Faz 1', 'Na⁺ kanalları inaktive olur; geçici dışa K⁺ akımı (Ito) küçük repolarizasyon çentiği yapar.'],
      [0.12, 0.5, 'Faz 2 (plato)', 'L tipi Ca²⁺ kanallarından Ca²⁺ girişi K⁺ çıkışını dengeler. Giren Ca²⁺ SR\'den Ca²⁺ salınımını tetikler (Ca²⁺ ile tetiklenen Ca²⁺ salınımı) → kasılma. Kalsiyum kanal blokerleri (sınıf IV) burada etkili.'],
      [0.5, 0.7, 'Faz 3', 'Ca²⁺ kanalları kapanır, gecikmeli doğrultucu K⁺ (IKr, IKs) açılır: repolarizasyon. Sınıf III antiaritmikler (amiodaron) uzatır; IKr blokajı uzun QT.'],
      [0.7, 1, 'Faz 4\'e dönüş', 'Uzun plato sayesinde refrakter dönem kasılma süresi kadar uzundur → tetanik kasılma olmaz.']],
    ciz: function (ctx, w, h, u, C) {
      C.grafik(w * 0.12, h * 0.1, w * 0.8, h * 0.5, kalpV, u, [[20, '+20'], [0, '0'], [-40, '-40'], [-90, '-90']]);
      var by = h * 0.75, aktif = u < 0.05 ? 'IK1' : u < 0.08 ? 'INa' : u < 0.12 ? 'Ito' : u < 0.5 ? 'ICa,L' : u < 0.7 ? 'IKr/IKs' : 'IK1';
      ['INa', 'Ito', 'ICa,L', 'IKr/IKs', 'IK1'].forEach(function (k, i) { var x = w * (0.16 + i * 0.17), on = k === aktif; C.kutu(x - 46 * C.z, by - 18 * C.z, 92 * C.z, 36 * C.z, on ? SARI : TEAL, on ? 1 : 0.4, 10); C.yazi(k, x, by + 5 * C.z, on ? SARI : '220,255,250', on ? 1 : 0.6, 13); if (on) C.ok(x, by + 24 * C.z, x, by + (/K/.test(k) ? -40 : 60) * C.z, SARI, 1); });
      C.yazi('içe akım (Na⁺, Ca²⁺) ↓ · dışa akım (K⁺) ↑', w / 2, h * 0.95, '220,255,250', 0.6, 11);
    } });

  // 11) Mitoz
  surec({ id: 'mitoz', ad: 'Mitoz', kat: 'Hücre döngüsü', sure: 14000,
    ozet: 'Profaz, prometafaz, metafaz, anafaz, telofaz ve sitokinez; iğ iplikleri ve kinetokorlar.',
    evreler: [
      [0, 0.18, 'Profaz', 'Kromatin kromozomlara yoğunlaşır (iki kardeş kromatit, kohezinle bağlı); sentrozomlar kutuplara gider, iğ oluşur.'],
      [0.18, 0.32, 'Prometafaz', 'Çekirdek zarı dağılır; kinetokor mikrotübülleri sentromerlerdeki kinetokorlara bağlanır.'],
      [0.32, 0.5, 'Metafaz', 'Kromozomlar ekvator (metafaz) plağında dizilir. İğ kontrol noktası tüm kinetokorlar bağlanana dek anafazı bekletir. Kolşisin/vinka alkaloidleri iğ oluşumunu bozar.'],
      [0.5, 0.7, 'Anafaz', 'APC/C ayrılmayı başlatır: separaz kohezini keser; kardeş kromatitler zıt kutuplara çekilir. Taksanlar mikrotübül yıkımını engeller.'],
      [0.7, 0.85, 'Telofaz', 'Kromatitler kutuplarda gevşer, çekirdek zarları yeniden oluşur.'],
      [0.85, 1, 'Sitokinez', 'Aktin–miyozin kontraktil halka hücreyi boğumlayarak iki özdeş yavru hücre oluşturur.']],
    ciz: function (ctx, w, h, u, C) {
      var cx = w / 2, cy = h * 0.5, bog = ara(u, 0.85, 1) * 60 * C.z, R = 170 * C.z;
      ctx.beginPath(); ctx.ellipse(cx - bog * 0.6, cy, R + bog * 0.3, R - bog * 0.9, 0, 0, Math.PI * 2); ctx.strokeStyle = rgba(TEAL, 0.8); ctx.lineWidth = 2 * C.z; ctx.stroke();
      if (bog) { ctx.beginPath(); ctx.ellipse(cx + bog * 0.6, cy, R + bog * 0.3, R - bog * 0.9, 0, 0, Math.PI * 2); ctx.stroke(); }
      var cekirdek = u < 0.2 ? 1 - ara(u, 0.15, 0.2) : u > 0.72 ? ara(u, 0.72, 0.8) : 0;
      if (cekirdek > 0) { if (u < 0.5) C.daire(cx, cy, 90, MAVI, cekirdek * 0.8, false); else { C.daire(cx - 120 * C.z, cy, 50, MAVI, cekirdek * 0.8, false); C.daire(cx + 120 * C.z, cy, 50, MAVI, cekirdek * 0.8, false); } }
      var kutup = lerp(20, 150, yumu(ara(u, 0, 0.3))) * C.z;
      [-1, 1].forEach(function (s) { C.daire(cx + s * kutup, cy, 6, SARI, 1); if (u > 0.15 && u < 0.85) for (var i = 0; i < 9; i++) { var a = (i - 4) * 0.16; C.cizgi([[cx + s * kutup, cy], [cx + s * kutup - s * Math.cos(a) * 160 * C.z, cy + Math.sin(a) * 160 * C.z]], SARI, 0.25, 1); } });
      for (var k = 0; k < 4; k++) {
        var hy = cy + (k - 1.5) * 34 * C.z, dizi = yumu(ara(u, 0.18, 0.4)), ayr = yumu(ara(u, 0.5, 0.72));
        var bx = lerp(cx + Math.cos(k * 2.1) * 50 * C.z, cx, dizi), by = lerp(cy + Math.sin(k * 1.7) * 50 * C.z, hy, dizi);
        [-1, 1].forEach(function (s) { var x = bx + s * (6 * C.z + ayr * 110 * C.z), ren = k % 2 ? MOR : YESIL;
          if (u < 0.12) { ctx.strokeStyle = rgba(ren, 0.5); ctx.lineWidth = C.z; ctx.beginPath(); for (var q = 0; q < 12; q++) ctx.lineTo(x + Math.sin(q * 2 + k) * 14 * C.z, by + Math.cos(q * 1.7) * 14 * C.z); ctx.stroke(); }
          else { var yog = u > 0.75 ? 1 - ara(u, 0.75, 0.85) * 0.6 : 1; C.cizgi([[x - s * 3 * C.z, by - 14 * C.z * yog], [x + s * 3 * C.z, by], [x - s * 3 * C.z, by + 14 * C.z * yog]], ren, 0.95, 4); } });
      }
    } });


  // 12) Miyelinli akson — sıçrayarak iletim
  surec({ id: 'saltatorik', ad: 'Miyelinli aksonda sıçrayarak iletim', kat: 'Sinir', sure: 8000,
    ozet: 'Ranvier boğumlarında Na⁺ kanalları; miyelin kapasitansı düşürür, AP boğumdan boğuma atlar.',
    evreler: [
      [0, 0.25, 'Boğumda AP', 'Voltaj kapılı Na⁺ kanalları Ranvier boğumlarında yoğundur; AP yalnız boğumlarda oluşur.'],
      [0.25, 0.75, 'Elektrotonik yayılım', 'Miyelin (MSS\'de oligodendrosit, PSS\'de Schwann hücresi) zar direncini artırıp kapasitansı düşürür; akım bir sonraki boğuma kayıpsız ve hızlı yayılır.'],
      [0.75, 1, 'Klinik', 'Hız: miyelinli Aα liflerde ~120 m/s, miyelinsiz C liflerinde ~1 m/s. Multipl skleroz (MSS) ve Guillain-Barré (PSS) demiyelinizasyonla iletimi yavaşlatır/bloke eder.']],
    ciz: function (ctx, w, h, u, C) {
      var cy = h * 0.45, x0 = w * 0.06, x1 = w * 0.94, n = 5, ara2 = (x1 - x0) / n;
      C.cizgi([[x0, cy], [x1, cy]], TEAL, 0.4, 2);
      for (var i = 0; i < n; i++) { var bx = x0 + i * ara2 + 14 * C.z; C.kutu(bx, cy - 28 * C.z, ara2 - 28 * C.z, 56 * C.z, MAVI, 0.6, 26); C.yazi('miyelin', bx + (ara2 - 28 * C.z) / 2, cy + 4 * C.z, MAVI, 0.6, 10); }
      var aktif = Math.floor(u * (n + 0.999));
      for (var k = 0; k <= n; k++) { var nx = x0 + k * ara2, on = k === aktif; C.daire(nx, cy, on ? 14 : 7, on ? SARI : TEAL, on ? 1 : 0.6); if (on) { C.iyon(nx, cy - 34 * C.z, 'Na⁺', YESIL, 1); C.ok(nx, cy - 24 * C.z, nx, cy - 4 * C.z, YESIL, 1); } }
      var fx = x0 + (aktif + (u * (n + 1)) % 1) * ara2; if (aktif < n) C.ok(x0 + aktif * ara2 + 16 * C.z, cy + 46 * C.z, Math.min(fx, x1), cy + 46 * C.z, SARI, 0.9);
      C.yazi('Ranvier boğumu', x0 + aktif * ara2, cy + 74 * C.z, SARI, 1, 11);
      C.yazi('miyelinli ~120 m/s  ·  miyelinsiz ~1 m/s', w / 2, h * 0.85, '220,255,250', 0.7, 12);
    } });

  // 13) Nöromüsküler kavşak
  surec({ id: 'noromuskuler', ad: 'Nöromüsküler kavşak', kat: 'Kas', sure: 10000,
    ozet: 'ACh salınımı, nikotinik reseptör, son plak potansiyeli, asetilkolinesteraz; myastenia gravis.',
    evreler: [
      [0, 0.2, 'Ca²⁺ ve salınım', 'Motor nöron terminaline AP gelince P/Q tipi Ca²⁺ kanalları açılır; ACh veziküller ekzositozla salınır (Lambert-Eaton\'da bu kanallara antikor; botulinum SNARE\'i keser).'],
      [0.2, 0.45, 'Nikotinik reseptör', 'ACh, motor son plaktaki nikotinik (N_M, ligand kapılı katyon kanalı) reseptöre bağlanır; Na⁺ girişi (K⁺ çıkışından fazla) son plak potansiyeli oluşturur.'],
      [0.45, 0.7, 'Kas AP', 'Son plak potansiyeli komşu sarkolemmada voltaj kapılı Na⁺ kanallarını eşiğe taşır; kas aksiyon potansiyeli T tübüllere yayılır.'],
      [0.7, 1, 'Sonlanma', 'Asetilkolinesteraz ACh\'yi asetat + koline yıkar (neostigmin, piridostigmin inhibe eder; organofosfat zehirlenmesi). Myastenia gravis: nikotinik reseptöre antikor.']],
    ciz: function (ctx, w, h, u, C) {
      var cx = w / 2, ust = h * 0.38, alt = h * 0.5;
      ctx.beginPath(); ctx.ellipse(cx, ust - 60 * C.z, 150 * C.z, 70 * C.z, 0, 0, Math.PI * 2); ctx.strokeStyle = rgba(TEAL, 0.8); ctx.lineWidth = 2 * C.z; ctx.stroke();
      C.yazi('MOTOR NÖRON TERMİNALİ', cx, ust - 140 * C.z, MAVI, 0.6, 11);
      ctx.beginPath(); for (var x = -260; x <= 260; x += 4) { var y = alt + Math.abs(Math.sin(x * 0.04)) * 18; if (x === -260) ctx.moveTo(cx + x * C.z, y * 1); ctx.lineTo(cx + x * C.z, alt + Math.abs(Math.sin(x * 0.04)) * 18 * C.z); } ctx.strokeStyle = rgba(TEAL, 0.8); ctx.stroke();
      C.yazi('MOTOR SON PLAK (kıvrımlı sarkolemma)', cx, alt + 60 * C.z, MAVI, 0.6, 11);
      [-90, -30, 30, 90].forEach(function (dx, i) { var y = lerp(ust - 80 * C.z, ust - 14 * C.z, yumu(ara(u, 0.05, 0.2))); C.daire(cx + dx * C.z, y, u > 0.2 ? 0 : 14, TEAL, 0.9, false); });
      if (u > 0.15) for (var n = 0; n < 16; n++) { var f = ara(u, 0.15, 0.4), x2 = cx + (n - 8) * 16 * C.z, y2 = lerp(ust, alt - 4 * C.z, f); if (u > 0.7) { C.yazi(n % 2 ? 'kolin' : 'asetat', x2, alt - 14 * C.z - ara(u, 0.7, 1) * 40 * C.z, YESIL, 1 - ara(u, 0.85, 1), 8); } else C.daire(x2, y2, 3, YESIL, 0.95); }
      [-120, -60, 0, 60, 120].forEach(function (dx) { var on = u > 0.3 && u < 0.72; C.kutu(cx + dx * C.z - 10 * C.z, alt, 20 * C.z, 18 * C.z, on ? YESIL : TEAL, on ? 1 : 0.5, 4); if (on) C.iyon(cx + dx * C.z, lerp(alt - 20 * C.z, alt + 40 * C.z, (ara(u, 0.3, 0.6) * 2) % 1), 'Na⁺', YESIL, 0.9); });
      if (u > 0.45 && u < 0.75) C.ok(cx + 150 * C.z, alt + 90 * C.z, cx + 260 * C.z, alt + 90 * C.z, SARI, 1);
      if (u > 0.7) C.yazi('asetilkolinesteraz', cx, alt - 40 * C.z, SARI, 1, 12);
    } });

  // 14) Glikoliz
  var GLIK = [['Glukoz', 'Heksokinaz/Glukokinaz', -1], ['G6P', 'Fosfoglukoz izomeraz', 0], ['F6P', 'PFK-1 (hız kısıtlayıcı)', -1], ['F1,6BP', 'Aldolaz', 0], ['DHAP + G3P', 'Triozfosfat izomeraz', 0], ['2× G3P', 'G3P dehidrojenaz (NADH)', 0], ['2× 1,3-BPG', 'Fosfogliserat kinaz', 2], ['2× 3PG', 'Fosfogliserat mutaz', 0], ['2× 2PG', 'Enolaz', 0], ['2× PEP', 'Piruvat kinaz', 2], ['2× Piruvat', '', 0]];
  surec({ id: 'glikoliz', ad: 'Glikoliz', kat: 'Metabolizma', sure: 14000,
    ozet: '10 basamak, 3 geri dönüşümsüz enzim, net 2 ATP + 2 NADH; düzenleme noktaları.',
    evreler: [
      [0, 0.3, 'Hazırlık (yatırım) evresi', 'Heksokinaz (glukokinaz: karaciğer/β hücresi) ve PFK-1 ATP harcar (−2 ATP). PFK-1 en önemli düzenleme noktası: F2,6BP ve AMP aktive; ATP ve sitrat inhibe eder.'],
      [0.3, 0.55, 'Bölünme', 'Aldolaz F1,6BP\'yi iki trioza böler; triozfosfat izomeraz DHAP\'ı G3P\'ye çevirir: bundan sonra her basamak iki kez.'],
      [0.55, 0.85, 'Kazanç evresi', 'G3P dehidrojenaz NADH üretir; fosfogliserat kinaz ve piruvat kinaz substrat düzeyinde fosforilasyonla 4 ATP üretir. Arseniat 1,3-BPG basamağını atlatır (ATP kazanılmaz).'],
      [0.85, 1, 'Net ve klinik', 'Net: 2 ATP, 2 NADH, 2 piruvat. Eritrositte piruvat kinaz eksikliği → hemolitik anemi. Aerobikte piruvat → asetil-KoA (PDH); anaerobikte → laktat (NAD⁺ yenilenir).']],
    ciz: function (ctx, w, h, u, C) {
      var x = w * 0.18, y0 = h * 0.06, dy = (h * 0.86) / (GLIK.length - 1), aktif = Math.min(GLIK.length - 1, Math.floor(u * GLIK.length)), atp = 0, nadh = 0;
      GLIK.forEach(function (g, i) {
        var y = y0 + i * dy, on = i === aktif, gecti = i < aktif;
        C.kutu(x, y - 13 * C.z, 120 * C.z, 24 * C.z, on ? SARI : TEAL, on ? 1 : gecti ? 0.7 : 0.35, 8); C.yazi(g[0], x + 60 * C.z, y + 4 * C.z, '220,255,250', on || gecti ? 1 : 0.5, 11);
        if (i < GLIK.length - 1) { C.ok(x + 60 * C.z, y + 12 * C.z, x + 60 * C.z, y + dy - 14 * C.z, on ? SARI : TEAL, on ? 1 : 0.4); C.yazi(g[1], x + 140 * C.z, y + dy / 2 + 4 * C.z, /kısıtlayıcı/.test(g[1]) ? KIRMIZI : (on ? SARI : '160,220,220'), on ? 1 : 0.65, 10, 'left');
          if (g[2] && i <= aktif) C.yazi((g[2] > 0 ? '+' : '') + g[2] + ' ATP', x + 390 * C.z, y + dy / 2 + 4 * C.z, g[2] > 0 ? YESIL : KIRMIZI, 1, 11, 'left');
          if (/NADH/.test(g[1]) && i <= aktif) C.yazi('+2 NADH', x + 460 * C.z, y + dy / 2 + 4 * C.z, MOR, 1, 11, 'left'); }
        if (i < aktif || i === aktif) { atp += g[2]; if (/NADH/.test(g[1]) && i < aktif) nadh += 2; }
      });
      C.yazi('Net ATP: ' + Math.max(-2, atp), w * 0.85, h * 0.5, atp > 0 ? YESIL : KIRMIZI, 1, 16);
    } });

  // 15) Krebs döngüsü
  var KREBS = [['Sitrat', 'Sitrat sentaz'], ['İzositrat', 'Akonitaz'], ['α-Ketoglutarat', 'İzositrat DH (NADH, CO₂) — hız kısıtlayıcı'], ['Süksinil-KoA', 'α-KG DH (NADH, CO₂; B1,B2,B3,B5, lipoat)'], ['Süksinat', 'Süksinil-KoA sentetaz (GTP)'], ['Fumarat', 'Süksinat DH (FADH₂; Kompleks II)'], ['Malat', 'Fumaraz'], ['Oksaloasetat', 'Malat DH (NADH)']];
  surec({ id: 'krebs', ad: 'Krebs (sitrik asit) döngüsü', kat: 'Metabolizma', sure: 16000,
    ozet: 'Asetil-KoA + OAA → sitrat; 3 NADH, 1 FADH₂, 1 GTP, 2 CO₂; mitokondri matriksi.',
    evreler: [
      [0, 0.25, 'Sitrat oluşumu', 'Asetil-KoA (2C) oksaloasetatla (4C) birleşip sitrat (6C) olur. Florasetat akonitazı inhibe eder.'],
      [0.25, 0.5, 'Oksidatif dekarboksilasyonlar', 'İzositrat DH (hız kısıtlayıcı; ADP ve Ca²⁺ aktive eder, ATP/NADH inhibe) ve α-KG DH: 2 CO₂ + 2 NADH. α-KG DH, PDH gibi B1, B2, B3, B5 ve lipoik asit ister; arsenik lipoatı bağlar.'],
      [0.5, 0.75, 'Substrat düzeyinde fosforilasyon', 'Süksinil-KoA sentetaz GTP (ya da ATP) üretir; süksinat DH FADH₂ üretir ve aynı zamanda ETZ Kompleks II\'dir.'],
      [0.75, 1, 'OAA\'nın yenilenmesi', 'Fumaraz ve malat DH (NADH) oksaloasetatı yeniden üretir. Bir tur: 3 NADH + 1 FADH₂ + 1 GTP ≈ 10 ATP.']],
    ciz: function (ctx, w, h, u, C, tur, t) {
      var cx = w * 0.42, cy = h * 0.5, R = 160 * C.z, aktif = Math.floor(u * KREBS.length) % KREBS.length;
      C.daire(cx, cy, 160, TEAL, 0.3, false);
      KREBS.forEach(function (k, i) { var a = -Math.PI / 2 + i / KREBS.length * Math.PI * 2, x = cx + Math.cos(a) * R, y = cy + Math.sin(a) * R, on = i === aktif;
        C.daire(x, y, on ? 11 : 7, on ? SARI : TEAL, on ? 1 : 0.7); C.yazi(k[0], x + Math.cos(a) * 44 * C.z, y + Math.sin(a) * 26 * C.z + 4 * C.z, '220,255,250', on ? 1 : 0.7, 11); });
      var ka = -Math.PI / 2 + (u * KREBS.length) / KREBS.length * Math.PI * 2; C.daire(cx + Math.cos(ka) * R, cy + Math.sin(ka) * R, 5, YESIL, 1);
      C.yazi('Asetil-KoA', cx, cy - R - 46 * C.z, YESIL, 0.9, 12); C.ok(cx, cy - R - 38 * C.z, cx + 10 * C.z, cy - R - 10 * C.z, YESIL, 0.8);
      C.yazi(KREBS[aktif][1], w * 0.78, h * 0.45, SARI, 1, 12); C.yazi('enzim:', w * 0.78, h * 0.4, '160,220,220', 0.7, 10);
      var say = { NADH: 0, FADH2: 0, GTP: 0, CO2: 0 }; for (var i = 0; i <= aktif; i++) { var e = KREBS[i][1]; if (/NADH/.test(e)) say.NADH++; if (/FADH/.test(e)) say.FADH2++; if (/GTP/.test(e)) say.GTP++; if (/CO₂/.test(e)) say.CO2++; }
      C.yazi('NADH ' + say.NADH + '/3 · FADH₂ ' + say.FADH2 + '/1 · GTP ' + say.GTP + '/1 · CO₂ ' + say.CO2 + '/2', w * 0.5, h * 0.94, '220,255,250', 0.9, 12);
    } });

  // 16) Hemoglobin–O2
  function satur(p, kay) { var p50 = 26.7 + kay * 8; return Math.pow(p, 2.7) / (Math.pow(p, 2.7) + Math.pow(p50, 2.7)); }
  surec({ id: 'hemoglobin-o2', ad: 'Hemoglobin–O₂ ayrışma eğrisi', kat: 'Kan', sure: 12000,
    ozet: 'Kooperatif bağlanma (T→R), sigmoid eğri, P50; Bohr etkisi ve 2,3-BPG ile sağa kayma.',
    evreler: [
      [0, 0.3, 'Kooperatiflik', 'Hb dört alt birimli; bir O₂ bağlanınca T (gergin) → R (gevşek) geçişi diğerlerinin afinitesini artırır → sigmoid eğri. Miyoglobin tek alt birimli: hiperbolik eğri, düşük P50.'],
      [0.3, 0.65, 'Sağa kayma', 'Dokuda ↑CO₂, ↑H⁺ (↓pH, Bohr etkisi), ↑2,3-BPG, ↑sıcaklık afiniteyi düşürür → P50 artar (normal ≈ 26-27 mmHg), O₂ dokuya daha kolay verilir.'],
      [0.65, 1, 'Sola kayma', 'HbF (2,3-BPG\'yi zayıf bağlar), CO (karboksihemoglobin; eğriyi sola kaydırır ve şeklini bozar), methemoglobin, ↓sıcaklık → afinite artar, dokuya O₂ verimi azalır.']],
    ciz: function (ctx, w, h, u, C) {
      var x = w * 0.14, y = h * 0.08, gw = w * 0.72, gh = h * 0.72;
      ctx.strokeStyle = rgba(TEAL, 0.3); ctx.lineWidth = C.z; ctx.strokeRect(x, y, gw, gh);
      C.yazi('pO₂ (mmHg) →', x + gw / 2, y + gh + 30 * C.z, '160,220,220', 0.8, 11); C.yazi('% doygunluk', x - 10 * C.z, y - 8 * C.z, '160,220,220', 0.8, 11, 'left');
      function egri(kay, c, a) { ctx.strokeStyle = rgba(c, a); ctx.lineWidth = 2.4 * C.z; ctx.beginPath(); for (var p = 0; p <= 100; p++) { var X = x + p / 100 * gw, Y = y + gh - satur(p, kay) * gh; if (p) ctx.lineTo(X, Y); else ctx.moveTo(X, Y); } ctx.stroke(); }
      egri(0, TEAL, 0.9);
      var kay = u < 0.3 ? 0 : u < 0.65 ? yumu(ara(u, 0.3, 0.45)) : -yumu(ara(u, 0.65, 0.8));
      if (u >= 0.3) egri(kay, kay > 0 ? KIRMIZI : MAVI, 0.95);
      var p50 = 26.7 + kay * 8; C.cizgi([[x + p50 / 100 * gw, y + gh], [x + p50 / 100 * gw, y + gh / 2]], SARI, 0.7, 1.2); C.yazi('P50 ≈ ' + p50.toFixed(0), x + p50 / 100 * gw, y + gh + 14 * C.z, SARI, 1, 11);
      ctx.strokeStyle = rgba(MOR, 0.8); ctx.lineWidth = 1.6 * C.z; ctx.beginPath(); for (var q = 0; q <= 100; q++) { var X2 = x + q / 100 * gw, Y2 = y + gh - q / (q + 2.8) * gh; if (q) ctx.lineTo(X2, Y2); else ctx.moveTo(X2, Y2); } ctx.stroke(); C.yazi('miyoglobin', x + gw * 0.12, y + gh * 0.12, MOR, 0.9, 10);
      C.yazi(u < 0.3 ? 'normal' : kay > 0 ? 'SAĞA: ↑CO₂ ↑H⁺ ↑2,3-BPG ↑ısı' : 'SOLA: HbF, CO, ↓ısı', x + gw * 0.7, y + gh * 0.75, kay > 0 ? KIRMIZI : kay < 0 ? MAVI : TEAL, 1, 12);
    } });

  // 17) Endositoz
  surec({ id: 'endositoz', ad: 'Klatrin aracılı endositoz', kat: 'Zar', sure: 10000,
    ozet: 'Reseptör–ligand (ör. LDL), klatrin çukuru, dinamin, endozom, reseptör geri dönüşümü.',
    evreler: [
      [0, 0.25, 'Bağlanma', 'LDL (apoB-100) LDL reseptörüne bağlanır; reseptörler adaptör proteinlerle (AP2) klatrin kaplı çukurlarda toplanır. Ailevi hiperkolesterolemi: LDL reseptör defekti.'],
      [0.25, 0.5, 'İçe çöküş', 'Klatrin kafes oluşturup zarı içe büker.'],
      [0.5, 0.7, 'Kopma', 'Dinamin GTPazı vezikülün boynunu sıkıp koparır; klatrin kılıf çözülür.'],
      [0.7, 1, 'Endozom', 'Vezikül erken endozomla birleşir; asidik pH\'da ligand ayrılır, reseptör zara geri döner, LDL lizozomda kolesterol ve amino asitlere yıkılır.']],
    ciz: function (ctx, w, h, u, C) {
      var my = h * 0.35, cx = w / 2, cok = yumu(ara(u, 0.25, 0.5)) * 90 * C.z, kop = ara(u, 0.5, 0.7);
      ctx.strokeStyle = rgba(TEAL, 0.9); ctx.lineWidth = 3 * C.z; ctx.beginPath(); ctx.moveTo(w * 0.05, my); ctx.lineTo(cx - 70 * C.z, my);
      if (kop < 1) ctx.bezierCurveTo(cx - 70 * C.z, my + cok * 1.3, cx + 70 * C.z, my + cok * 1.3, cx + 70 * C.z, my); else ctx.lineTo(cx + 70 * C.z, my);
      ctx.lineTo(w * 0.95, my); ctx.stroke();
      C.yazi('HÜCRE DIŞI', cx, my - 70 * C.z, MAVI, 0.6, 11); C.yazi('SİTOPLAZMA', w * 0.2, my + 140 * C.z, MAVI, 0.6, 11);
      var vy = kop >= 1 ? lerp(my + cok, my + 220 * C.z, ara(u, 0.7, 1)) : my + cok * 0.7;
      [-40, -14, 14, 40].forEach(function (dx) { var x = cx + dx * C.z * (kop >= 1 ? 0.5 : 1), y = u < 0.25 ? my : vy - 10 * C.z; C.cizgi([[x, y], [x, y - 14 * C.z]], YESIL, 1, 3); C.daire(x, y - 22 * C.z * (u < 0.25 ? 1 : 0.3), 9, SARI, u < 0.15 ? ara(u, 0, 0.15) : 0.9); });
      if (u < 0.6) for (var i = 0; i < 9; i++) { var a = Math.PI * (i / 8); C.yazi('✣', cx + Math.cos(a) * 70 * C.z, my + Math.sin(a) * cok * 1.1 + 10 * C.z, MOR, u > 0.25 ? 0.9 : 0.3, 12); }
      if (u > 0.5 && u < 0.72) { C.kutu(cx - 20 * C.z, my + cok * 0.15, 40 * C.z, 10 * C.z, SARI, 1, 4); C.yazi('dinamin', cx + 60 * C.z, my + cok * 0.2, SARI, 1, 10); }
      if (kop >= 1) { C.daire(cx, vy, 34, TEAL, 0.9, false); if (u > 0.85) { C.daire(cx + 140 * C.z, my + 230 * C.z, 46, MOR, 0.6, false); C.yazi('endozom (pH↓)', cx + 140 * C.z, my + 300 * C.z, MOR, 0.9, 10); } }
    } });

  // 18) ER → Golgi
  surec({ id: 'er-golgi', ad: 'ER → Golgi → sekresyon', kat: 'Organel', sure: 12000,
    ozet: 'Sinyal peptidi, granüllü ER, COPII/COPI, cis→trans Golgi, mannoz-6-fosfat, sekretuvar vezikül.',
    evreler: [
      [0, 0.2, 'Granüllü ER', 'Sinyal peptidini SRP tanır; ribozom ER\'e bağlanır, protein lümene sentezlenir. N-bağlı glikozilasyon ve katlanma (şaperonlar) ER\'de başlar.'],
      [0.2, 0.4, 'COPII', 'Doğru katlanan proteinler COPII kaplı veziküllerle ER\'den cis-Golgi\'ye ilerler (anterograd). COPI geri taşır (retrograd).'],
      [0.4, 0.7, 'Golgi', 'Cis → medial → trans: O-bağlı glikozilasyon, oligosakkarit düzenleme. Lizozomal enzimlere mannoz-6-fosfat eklenir (eksikliği: I-hücre hastalığı → enzimler dışarı salınır).'],
      [0.7, 1, 'Sekresyon', 'Trans-Golgi ağından veziküller: lizozoma (M6P reseptörü, klatrin), zara, ya da düzenli/düzenlenmiş sekresyona (ör. insülin granülleri, Ca²⁺ ile ekzositoz).']],
    ciz: function (ctx, w, h, u, C) {
      var erx = w * 0.18, gx = w * 0.56, cy = h * 0.5;
      for (var i = 0; i < 4; i++) { ctx.beginPath(); ctx.ellipse(erx, cy + (i - 1.5) * 40 * C.z, 90 * C.z, 14 * C.z, 0, 0, Math.PI * 2); ctx.strokeStyle = rgba(TEAL, 0.8); ctx.lineWidth = 1.6 * C.z; ctx.stroke(); for (var k = 0; k < 8; k++) C.daire(erx - 80 * C.z + k * 23 * C.z, cy + (i - 1.5) * 40 * C.z - 14 * C.z, 3, SARI, 0.9); }
      C.yazi('granüllü ER', erx, cy + 110 * C.z, TEAL, 0.9, 11);
      for (var j = 0; j < 5; j++) { ctx.beginPath(); ctx.arc(gx + j * 22 * C.z, cy, (110 - j * 8) * C.z, Math.PI * 0.62, Math.PI * 1.38); ctx.strokeStyle = rgba(j < 2 ? MAVI : j < 4 ? TEAL : MOR, 0.85); ctx.lineWidth = 6 * C.z; ctx.stroke(); }
      C.yazi('cis', gx - 80 * C.z, cy + 120 * C.z, MAVI, 0.9, 10); C.yazi('trans', gx + 40 * C.z, cy + 120 * C.z, MOR, 0.9, 10); C.yazi('Golgi', gx - 20 * C.z, cy - 130 * C.z, TEAL, 0.9, 12);
      var v1 = ara(u, 0.2, 0.4); if (v1 > 0 && v1 < 1) C.daire(lerp(erx + 90 * C.z, gx - 100 * C.z, v1), cy - 20 * C.z, 10, YESIL, 0.9, false);
      var g = ara(u, 0.4, 0.7); if (g > 0 && g < 1) C.daire(lerp(gx - 95 * C.z, gx + 80 * C.z, g), cy + Math.sin(g * 6) * 20 * C.z, 7, YESIL, 0.9);
      var s = ara(u, 0.7, 1); if (s > 0) { [-60, 0, 60].forEach(function (dy, i) { C.daire(lerp(gx + 90 * C.z, w * 0.92, s), cy + dy * C.z * s, 12, i === 0 ? SARI : YESIL, 0.9, false); }); C.yazi('lizozom (M6P)', w * 0.88, cy - 80 * C.z, SARI, s, 10); C.yazi('sekresyon', w * 0.88, cy + 90 * C.z, YESIL, s, 10); }
    } });

  // 19) SGLT1
  surec({ id: 'sglt1', ad: 'SGLT1 ile glukoz emilimi (ikincil aktif taşıma)', kat: 'Zar', sure: 10000,
    ozet: 'Apikal Na⁺–glukoz kotransportu, bazolateral GLUT2 ve Na⁺/K⁺-ATPaz; ORS\'nin temeli.',
    evreler: [
      [0, 0.35, 'Apikal SGLT1', 'Bazolateral Na⁺/K⁺-ATPaz\'ın kurduğu düşük hücre içi Na⁺, SGLT1 ile 2 Na⁺ + 1 glukoz (ya da galaktoz) birlikte içeri girer: ikincil aktif taşıma.'],
      [0.35, 0.65, 'Bazolateral GLUT2', 'Glukoz kolaylaştırılmış difüzyonla GLUT2 üzerinden kana geçer. Fruktoz apikalde GLUT5 ile girer.'],
      [0.65, 1, 'Klinik', 'Oral rehidrasyon sıvısı: glukoz Na⁺ (ve ardından su) emilimini artırır — koleradaki sekretuvar ishalde hayat kurtarır. SGLT2 inhibitörleri (gliflozinler) böbrek proksimal tübülde glukozüri yapar.']],
    ciz: function (ctx, w, h, u, C) {
      var sx = w * 0.3, bx = w * 0.7, cy = h * 0.5;
      C.yazi('LÜMEN', w * 0.12, h * 0.12, MAVI, 0.7, 12); C.yazi('ENTEROSİT', w * 0.5, h * 0.12, TEAL, 0.7, 12); C.yazi('KAN', w * 0.88, h * 0.12, KIRMIZI, 0.7, 12);
      C.cizgi([[sx, h * 0.15], [sx, h * 0.85]], TEAL, 0.8, 3); C.cizgi([[bx, h * 0.15], [bx, h * 0.85]], TEAL, 0.8, 3);
      C.kutu(sx - 16 * C.z, cy - 70 * C.z, 32 * C.z, 50 * C.z, YESIL, 1, 6); C.yazi('SGLT1', sx, cy - 80 * C.z, YESIL, 1, 10);
      C.kutu(bx - 16 * C.z, cy - 70 * C.z, 32 * C.z, 50 * C.z, SARI, 1, 6); C.yazi('GLUT2', bx, cy - 80 * C.z, SARI, 1, 10);
      C.kutu(bx - 16 * C.z, cy + 40 * C.z, 32 * C.z, 50 * C.z, MOR, 1, 6); C.yazi('Na⁺/K⁺', bx, cy + 104 * C.z, MOR, 1, 10);
      var a = ara(u, 0, 0.35), b = ara(u, 0.35, 0.65);
      C.iyon(lerp(w * 0.12, w * 0.5, a), cy - 54 * C.z, 'Na⁺', YESIL, 1); C.iyon(lerp(w * 0.12, w * 0.5, a), cy - 30 * C.z, 'Na⁺', YESIL, 1);
      C.daire(b > 0 ? lerp(w * 0.5, w * 0.88, b) : lerp(w * 0.14, w * 0.5, a), cy - 42 * C.z, 10, SARI, 1); C.yazi('glu', b > 0 ? lerp(w * 0.5, w * 0.88, b) : lerp(w * 0.14, w * 0.5, a), cy - 39 * C.z, '10,20,20', 1, 9);
      var p = (u * 3) % 1; C.iyon(lerp(w * 0.55, w * 0.85, p), cy + 56 * C.z, 'Na⁺', YESIL, 0.9); C.iyon(lerp(w * 0.85, w * 0.55, p), cy + 76 * C.z, 'K⁺', MOR, 0.9);
    } });

  // 20) Starling
  surec({ id: 'starling', ad: 'Kapiller sıvı değişimi (Starling kuvvetleri)', kat: 'Kan', sure: 11000,
    ozet: 'Hidrostatik (Pc, Pi) ve onkotik (πc, πi) basınçlar; arteryel uçta filtrasyon, venöz uçta geri emilim, ödem.',
    evreler: [
      [0, 0.35, 'Arteriyel uç', 'Net filtrasyon basıncı = (Pc − Pi) − (πc − πi). Arteriyel uçta Pc yüksek (≈ 35 mmHg) → sıvı dokuya geçer.'],
      [0.35, 0.7, 'Venöz uç', 'Pc ≈ 15 mmHg\'ye düşer; plazma onkotik basıncı (≈ 25 mmHg, çoğu albumin) sıvıyı geri çeker. Kalan sıvıyı lenfatikler toplar.'],
      [0.7, 1, 'Ödem', 'Ödem nedenleri: ↑Pc (kalp yetmezliği, venöz tıkanıklık), ↓πc (nefrotik sendrom, siroz, malnütrisyon), ↑geçirgenlik (yanık, sepsis), lenfatik tıkanma.']],
    ciz: function (ctx, w, h, u, C) {
      var y = h * 0.42, x0 = w * 0.08, x1 = w * 0.92;
      ctx.fillStyle = rgba(KIRMIZI, 0.08); ctx.fillRect(x0, y - 30 * C.z, x1 - x0, 60 * C.z);
      C.cizgi([[x0, y - 30 * C.z], [x1, y - 30 * C.z]], KIRMIZI, 0.7, 2); C.cizgi([[x0, y + 30 * C.z], [x1, y + 30 * C.z]], KIRMIZI, 0.7, 2);
      C.yazi('arteriyel uç  Pc ≈ 35', x0 + 60 * C.z, y - 44 * C.z, KIRMIZI, 0.9, 11, 'left'); C.yazi('venöz uç  Pc ≈ 15', x1 - 60 * C.z, y - 44 * C.z, MAVI, 0.9, 11, 'right');
      var odem = u > 0.75 ? ara(u, 0.75, 0.9) : 0;
      for (var i = 0; i < 10; i++) { var f = i / 9, x = lerp(x0 + 40 * C.z, x1 - 40 * C.z, f), net = lerp(10, -10 + odem * 14, f), p = (u * 4 + i * 0.13) % 1;
        if (net > 0) C.daire(x, lerp(y + 30 * C.z, y + 110 * C.z, p), 4, MAVI, 0.9); else C.daire(x, lerp(y + 110 * C.z, y + 30 * C.z, p), 4, MAVI, 0.9);
        C.ok(x, y + (net > 0 ? 20 : 60) * C.z, x, y + (net > 0 ? 60 : 20) * C.z, net > 0 ? KIRMIZI : YESIL, 0.5); }
      C.yazi('İNTERSTİSYUM', w / 2, y + 150 * C.z, TEAL, 0.6, 11);
      C.yazi('πc ≈ 25 (albumin)', w / 2, y + 6 * C.z, SARI, 0.9, 12);
      if (odem) C.yazi('Ödem: ↓πc (nefrotik sendrom) → geri emilim azalır', w / 2, h * 0.9, KIRMIZI, odem, 12);
    } });

  // 21) Henle kulpu
  surec({ id: 'henle', ad: 'Henle kulpunda karşı akım çoğaltıcı', kat: 'Böbrek', sure: 12000,
    ozet: 'İnen kol suya, kalın çıkan kol NaCl\'ye geçirgen; medüller osmotik gradyan; loop diüretikleri.',
    evreler: [
      [0, 0.3, 'İnen ince kol', 'Suya geçirgen (akuaporin-1), tuza az geçirgen: hiperosmotik medullada su çıkar, tübül sıvısı yoğunlaşır (papillada ≈ 1200 mOsm/kg).'],
      [0.3, 0.6, 'Kalın çıkan kol', 'Suya geçirgen değil; NKCC2 (Na⁺-K⁺-2Cl⁻) tuzu dışarı pompalar → sıvı seyrelir (≈ 100 mOsm), interstisyum tuzlanır. Furosemid NKCC2\'yi bloke eder.'],
      [0.6, 0.85, 'Karşı akım çoğaltma', 'İki kolun zıt akışı küçük yatay farkı dikey büyük gradyana çevirir; üre geri dönüşümü ve vasa recta (karşı akım değiştirici) gradyanı korur.'],
      [0.85, 1, 'ADH', 'Toplayıcı kanalda ADH (V2 → akuaporin-2) suyu bu gradyana çeker: yoğun idrar. Diyabet insipidus: ADH yok ya da etkisiz.']],
    ciz: function (ctx, w, h, u, C) {
      var xi = w * 0.36, xc = w * 0.52, y0 = h * 0.1, y1 = h * 0.82;
      for (var k = 0; k < 6; k++) { var yy = lerp(y0, y1, k / 5); ctx.fillStyle = rgba(SARI, 0.03 + k * 0.025); ctx.fillRect(w * 0.08, yy, w * 0.84, (y1 - y0) / 5); C.yazi(Math.round(300 + k * 180) + '', w * 0.86, yy + 16 * C.z, SARI, 0.7, 10); }
      C.yazi('mOsm/kg', w * 0.86, y0 - 6 * C.z, SARI, 0.7, 10);
      C.cizgi([[xi, y0], [xi, y1], [xc, y1], [xc, y0]], TEAL, 0.9, 4); C.yazi('inen ince kol', xi - 10 * C.z, y0 - 8 * C.z, TEAL, 0.9, 10, 'right'); C.yazi('kalın çıkan kol', xc + 10 * C.z, y0 - 8 * C.z, TEAL, 0.9, 10, 'left');
      var p = (u * 2) % 1, yp = p < 0.45 ? lerp(y0, y1, p / 0.45) : p < 0.55 ? y1 : lerp(y1, y0, (p - 0.55) / 0.45), xp = p < 0.45 ? xi : p < 0.55 ? lerp(xi, xc, (p - 0.45) / 0.1) : xc;
      C.daire(xp, yp, 8, MAVI, 1);
      for (var i = 0; i < 4; i++) { var y = lerp(y0 + 40 * C.z, y1 - 30 * C.z, i / 3); if (u < 0.6 || u > 0.85) C.ok(xi, y, xi - 50 * C.z, y, MAVI, 0.7); C.yazi('H₂O', xi - 70 * C.z, y + 4 * C.z, MAVI, 0.8, 9); if (u > 0.3) C.ok(xc, y, xc + 50 * C.z, y, SARI, 0.8); C.yazi('NaCl', xc + 74 * C.z, y + 4 * C.z, SARI, 0.8, 9); }
      if (u > 0.85) { C.cizgi([[w * 0.7, y0], [w * 0.7, y1]], MOR, 0.9, 4); C.yazi('toplayıcı kanal + ADH', w * 0.7, y1 + 18 * C.z, MOR, 1, 10); C.ok(w * 0.7, h * 0.5, w * 0.62, h * 0.5, MAVI, 0.9); }
    } });

  // 22) Apoptoz
  surec({ id: 'apoptoz', ad: 'Apoptoz (intrinsik ve ekstrinsik yol)', kat: 'Hücre döngüsü', sure: 12000,
    ozet: 'BCL-2 ailesi, sitokrom c, apoptozom, kaspaz-9 / Fas–kaspaz-8, kaspaz-3; inflamasyonsuz hücre ölümü.',
    evreler: [
      [0, 0.25, 'Sinyal', 'İntrinsik: DNA hasarı (p53), büyüme faktörü yokluğu → BAX/BAK aktifleşir, BCL-2 baskılanır. Ekstrinsik: FasL–Fas ya da TNF reseptörü → kaspaz-8.'],
      [0.25, 0.5, 'Sitokrom c', 'Mitokondri dış zarı geçirgenleşir; sitokrom c sitozole çıkar, APAF-1 ile apoptozomu kurar → kaspaz-9 aktifleşir.'],
      [0.5, 0.75, 'Yürütücü kaspazlar', 'Kaspaz-9 ve kaspaz-8, kaspaz-3\'ü aktive eder: proteinler ve DNA (merdiven paterni) parçalanır.'],
      [0.75, 1, 'Apoptotik cisimcikler', 'Hücre büzülür, kromatin yoğunlaşır (piknoz), zar tomurcuklanır; fosfatidilserin dışa döner ve makrofajlar yutar — inflamasyon olmaz (nekrozdan farkı). BCL-2 aşırı ifadesi: foliküler lenfoma t(14;18).']],
    ciz: function (ctx, w, h, u, C, tur, t) {
      var cx = w / 2, cy = h * 0.5, buz = 1 - 0.35 * ara(u, 0.6, 0.9), R = 170 * C.z * buz;
      if (u < 0.75) C.daire(cx, cy, 170 * buz, TEAL, 0.8, false);
      else for (var b = 0; b < 6; b++) { var a = b / 6 * Math.PI * 2 + 0.3, d = ara(u, 0.75, 1) * 80 * C.z; C.daire(cx + Math.cos(a) * (R * 0.6 + d), cy + Math.sin(a) * (R * 0.6 + d), 34, TEAL, 0.8, false); }
      C.daire(cx - 50 * C.z * buz, cy, u > 0.6 ? 26 : 44, u > 0.6 ? MOR : MAVI, 0.6);
      C.yazi(u > 0.6 ? 'piknoz' : 'çekirdek', cx - 50 * C.z * buz, cy + 4 * C.z, '220,255,250', 0.8, 10);
      var mx = cx + 70 * C.z * buz, my = cy + 40 * C.z; ctx.beginPath(); ctx.ellipse(mx, my, 34 * C.z, 18 * C.z, 0.3, 0, Math.PI * 2); ctx.strokeStyle = rgba(SARI, 0.9); ctx.lineWidth = 1.8 * C.z; ctx.stroke();
      if (u > 0.25) for (var i = 0; i < 6; i++) { var f = ara(u, 0.25 + i * 0.02, 0.5); C.yazi('cyt c', mx + Math.cos(i) * f * 70 * C.z, my - f * 60 * C.z + Math.sin(i * 2) * 10 * C.z, SARI, 0.9, 9); }
      if (u > 0.4) { C.kutu(cx + 40 * C.z, cy - 110 * C.z, 90 * C.z, 26 * C.z, YESIL, ara(u, 0.4, 0.5), 8); C.yazi('apoptozom → kas-9', cx + 85 * C.z, cy - 92 * C.z, YESIL, 1, 10); }
      if (u > 0.5) C.yazi('kaspaz-3 ✂', cx, cy + 120 * C.z * buz, KIRMIZI, ara(u, 0.5, 0.6), 13);
      if (u < 0.25) { C.yazi('FasL → Fas → kaspaz-8', cx - 240 * C.z, cy - 150 * C.z, MOR, 0.9, 10, 'left'); C.yazi('p53 → BAX/BAK', cx + 110 * C.z, cy - 150 * C.z, MOR, 0.9, 10, 'left'); }
    } });

  // 23) Klorür kayması
  surec({ id: 'klorur-kaymasi', ad: 'CO₂ taşınması ve klorür kayması', kat: 'Kan', sure: 10000,
    ozet: 'Karbonik anhidraz, HCO₃⁻ çıkışı/Cl⁻ girişi (bant 3), H⁺\'nın Hb\'ye tamponlanması; Haldane etkisi.',
    evreler: [
      [0, 0.3, 'Dokuda CO₂ girişi', 'CO₂ eritrosite difüze olur; karbonik anhidraz CO₂ + H₂O → H₂CO₃ → H⁺ + HCO₃⁻. CO₂\'nin ~%70\'i bikarbonat olarak taşınır, ~%20-25\'i karbaminohemoglobin, ~%5-10\'u çözünmüş.'],
      [0.3, 0.6, 'Klorür kayması', 'HCO₃⁻ bant 3 (AE1) değiştiricisiyle plazmaya çıkar, karşılığında Cl⁻ girer (Hamburger kayması): elektronötralite korunur. Venöz eritrositte Cl⁻ daha yüksektir.'],
      [0.6, 0.85, 'H⁺ tamponlanması', 'H⁺ deoksihemoglobine bağlanır (deoksi-Hb daha iyi tampon). Haldane etkisi: deoksijenasyon CO₂ taşıma kapasitesini artırır.'],
      [0.85, 1, 'Akciğerde tersi', 'Akciğerde O₂ bağlanması H⁺\'yı serbestleştirir; HCO₃⁻ geri girer, Cl⁻ çıkar; CO₂ yeniden oluşup verilir. Asetazolamid karbonik anhidrazı inhibe eder.']],
    ciz: function (ctx, w, h, u, C) {
      var cx = w * 0.5, cy = h * 0.5; ctx.beginPath(); ctx.ellipse(cx, cy, 190 * C.z, 120 * C.z, 0, 0, Math.PI * 2); ctx.strokeStyle = rgba(KIRMIZI, 0.8); ctx.lineWidth = 2.2 * C.z; ctx.stroke(); C.yazi('ERİTROSİT', cx, cy - 130 * C.z, KIRMIZI, 0.8, 11);
      C.yazi('DOKU', w * 0.1, h * 0.15, TEAL, 0.7, 11); C.yazi('PLAZMA', w * 0.9, h * 0.15, MAVI, 0.7, 11);
      var a = ara(u, 0, 0.3); C.yazi('CO₂', lerp(w * 0.08, cx - 80 * C.z, a), cy - 40 * C.z, '220,255,250', 1, 13);
      C.kutu(cx - 50 * C.z, cy - 60 * C.z, 100 * C.z, 30 * C.z, YESIL, u > 0.1 && u < 0.35 ? 1 : 0.5, 8); C.yazi('karbonik anhidraz', cx, cy - 40 * C.z, YESIL, 1, 10);
      if (u > 0.2) C.yazi('H⁺ + HCO₃⁻', cx, cy + 4 * C.z, SARI, ara(u, 0.2, 0.3), 14);
      C.kutu(cx + 176 * C.z, cy - 20 * C.z, 28 * C.z, 40 * C.z, MOR, 1, 6); C.yazi('bant 3', cx + 190 * C.z, cy + 36 * C.z, MOR, 0.9, 10);
      var b = ara(u, 0.3, 0.6); if (b > 0) { C.yazi('HCO₃⁻', lerp(cx + 40 * C.z, w * 0.88, b), cy - 6 * C.z, SARI, 1, 12); C.yazi('Cl⁻', lerp(w * 0.88, cx + 60 * C.z, b), cy + 24 * C.z, YESIL, 1, 12); }
      if (u > 0.6) { C.daire(cx - 90 * C.z, cy + 60 * C.z, 22, KIRMIZI, 0.4); C.yazi('H⁺–Hb', cx - 90 * C.z, cy + 64 * C.z, '220,255,250', ara(u, 0.6, 0.7), 10); }
      if (u > 0.85) C.yazi('akciğerde: ters yön', cx, h * 0.92, MAVI, ara(u, 0.85, 0.95), 12);
    } });

  /* ---------- görünüm ---------- */
  var st = document.createElement('style');
  st.textContent = [
    '.hc-liste{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:12px;margin-top:12px}',
    '.hc-kart{text-decoration:none!important;position:relative;text-align:left;padding:14px 16px 16px;border-radius:18px;border:1px solid rgba(94,240,220,.24);background:linear-gradient(160deg,rgba(18,60,72,.42),rgba(4,18,26,.6));color:#d6f7f3;cursor:pointer;display:grid;gap:6px;overflow:hidden;transition:transform .3s,box-shadow .3s}',
    '.hc-kart:hover,.hc-kart:focus-visible{transform:translateY(-3px);box-shadow:0 0 26px rgba(94,240,220,.22)}',
    '.hc-kart small{font:600 10px var(--f-kod,monospace);letter-spacing:.2em;color:#7fd8cf;text-transform:uppercase}',
    '.hc-kart b{font-size:15.5px;line-height:1.3}.hc-kart span{font-size:12.5px;color:#9fc9cc;line-height:1.45}',
    '.hc-kart canvas{width:100%;height:110px;border-radius:12px;background:rgba(2,10,14,.6)}',
    '.hc-sahne{display:grid;grid-template-columns:minmax(0,1.7fr) minmax(260px,1fr);gap:14px;margin-top:10px}',
    '.hc-tuval{position:relative;border-radius:20px;border:1px solid rgba(94,240,220,.26);background:radial-gradient(ellipse at 50% 40%,rgba(30,110,120,.18),rgba(2,10,14,.85) 70%);overflow:hidden;aspect-ratio:4/3}',
    '.hc-tuval canvas{position:absolute;inset:0;width:100%;height:100%}',
    '.hc-yan{display:flex;flex-direction:column;gap:10px}',
    '.hc-evreler{display:flex;flex-wrap:wrap;gap:6px}',
    '.hc-evreler button{border-radius:999px;border:1px solid rgba(94,240,220,.3);background:rgba(94,240,220,.06);color:#bff0ea;font:600 11px var(--f-kod,monospace);letter-spacing:.06em;padding:6px 11px}',
    '.hc-evreler button[aria-current=true]{background:rgba(94,240,220,.28);color:#fff;box-shadow:0 0 14px rgba(94,240,220,.4)}',
    '.hc-aciklama{border-radius:16px;border:1px solid rgba(94,240,220,.24);background:rgba(3,16,22,.6);padding:14px 16px;min-height:140px}',
    '.hc-aciklama h3{margin:0 0 6px;font:600 13px var(--f-kod,monospace);letter-spacing:.16em;color:#5ef0dc;text-transform:uppercase}',
    '.hc-aciklama p{margin:0;line-height:1.6;font-size:14.5px}',
    '.hc-kontrol{display:flex;gap:8px;flex-wrap:wrap;align-items:center}',
    '@media (max-width:900px){.hc-sahne{grid-template-columns:1fr}}'
  ].join('\n');
  document.head.appendChild(st);

  var calan = null;
  function oynatici(cv, s, o) {
    o = o || {};
    var ctx = cv.getContext('2d'), w = 0, h = 0, t0 = performance.now(), duraklat = false, hiz = 1, faz = 0, son = 0, tur = 0, durdu = false;
    function boyut() { var r = cv.getBoundingClientRect(), d = Math.min(2, window.devicePixelRatio || 1); w = Math.max(1, r.width * d); h = Math.max(1, r.height * d); cv.width = w; cv.height = h; }
    boyut(); window.addEventListener('resize', boyut);
    function kare(now) {
      if (durdu || !cv.isConnected) return;
      requestAnimationFrame(kare);
      if (now - son < (o.kucuk ? 60 : 30)) return; var dt = Math.min(100, now - son); son = now;
      if (!duraklat) { faz += dt * hiz / s.sure; if (faz >= 1) { faz -= 1; tur++; } }
      if (!w) boyut();
      ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, w, h); ctx.globalCompositeOperation = 'lighter';
      s.ciz(ctx, w, h, faz, Cz(ctx, w, h), tur, now);
      ctx.globalCompositeOperation = 'source-over';
      if (o.evre) o.evre(faz);
    }
    requestAnimationFrame(kare);
    return { durdur: function () { durdu = true; }, duraklat: function (v) { duraklat = v; }, hiz: function (v) { hiz = v; }, git: function (f) { faz = f; }, durakli: function () { return duraklat; } };
  }

  U.GORUNUMLER['lab-hucre'] = function (id) {
    if (calan) { calan.forEach(function (x) { x.durdur(); }); } calan = [];
    var ana = $('#ana'); ana.innerHTML = '';
    var sayfa = el('div', { class: 'sayfa' }); ana.appendChild(sayfa);
    var s = SUREC.filter(function (x) { return x.id === id; })[0];
    if (!s) {
      sayfa.appendChild(el('div', { class: 'kahraman' }, [el('div', { class: 'ust-etiket', text: 'Hücre düzeyinde' }), el('h1', { text: '◉ Hücre laboratuvarı' }),
        el('p', { text: 'Canlı süreçler: dokun, evre evre izle. Her evrenin açıklaması ve sınav notları yanda.' })]));
      var liste = el('div', { class: 'hc-liste' });
      var katlar = {}; SUREC.forEach(function (x) { (katlar[x.kat] = katlar[x.kat] || []).push(x); });
      SUREC.forEach(function (x) {
        var cv = el('canvas', { 'aria-hidden': 'true' });
        var kart = el('a', { class: 'hc-kart', href: '#lab-hucre-' + x.id }, [cv, el('small', { text: x.kat }), el('b', { text: x.ad }), el('span', { text: x.ozet })]);
        liste.appendChild(kart);
        setTimeout(function () { calan.push(oynatici(cv, x, { kucuk: true })); }, 30);
      });
      sayfa.appendChild(liste);
      return;
    }
    sayfa.appendChild(el('div', { class: 'kahraman' }, [el('div', { class: 'ust-etiket', text: s.kat }), el('h1', { text: s.ad }), el('p', { text: s.ozet })]));
    var cv = el('canvas', { role: 'img', 'aria-label': s.ad + ' animasyonu' });
    var tuval = el('div', { class: 'hc-tuval' }, [cv]);
    var evreler = el('div', { class: 'hc-evreler', role: 'tablist' }), baslik = el('h3'), metin = el('p'), aciklama = el('div', { class: 'hc-aciklama', 'aria-live': 'polite' }, [baslik, metin]);
    var oynatDug = el('button', { class: 'dugme kucuk ana', type: 'button', text: '⏸ Durdur' }), hizSec = el('select', { 'aria-label': 'Hız', style: 'background:var(--zemin);border:1px solid var(--cizgi);color:var(--metin);border-radius:999px;padding:6px 10px' });
    [['0.5', '0,5×'], ['1', '1×'], ['1.5', '1,5×'], ['2', '2×']].forEach(function (x) { hizSec.appendChild(el('option', { value: x[0], text: x[1], selected: x[0] === '1' ? true : null })); });
    var sorDug = el('button', { class: 'dugme kucuk', type: 'button', text: '◎ Carvis\'e sor' });
    var yan = el('div', { class: 'hc-yan' }, [evreler, aciklama, el('div', { class: 'hc-kontrol' }, [oynatDug, hizSec, sorDug, el('a', { class: 'dugme kucuk', href: '#lab-hucre', text: '← Tüm süreçler' })])]);
    sayfa.appendChild(el('div', { class: 'hc-sahne' }, [tuval, yan]));
    var simdi = -1, dugmeler = [];
    s.evreler.forEach(function (e, i) { var b = el('button', { type: 'button', role: 'tab', text: (i + 1) + '. ' + e[2], onclick: function () { oy.git(e[0] + 0.001); oy.duraklat(true); oynatDug.textContent = '▶ Oynat'; } }); dugmeler.push(b); evreler.appendChild(b); });
    var oy = oynatici(cv, s, { evre: function (f) { var i = 0; s.evreler.forEach(function (e, j) { if (f >= e[0]) i = j; }); if (i !== simdi) { simdi = i; baslik.textContent = (i + 1) + ' · ' + s.evreler[i][2]; metin.textContent = s.evreler[i][3]; dugmeler.forEach(function (b, j) { b.setAttribute('aria-current', String(j === i)); }); } } });
    calan.push(oy);
    oynatDug.addEventListener('click', function () { var d = !oy.durakli(); oy.duraklat(d); oynatDug.textContent = d ? '▶ Oynat' : '⏸ Durdur'; });
    hizSec.addEventListener('change', function () { oy.hiz(+hizSec.value); });
    sorDug.addEventListener('click', function () { var b = document.querySelector('.cv-balon'); if (b) b.hidden = false; if (window.Carvis && window.Carvis.soru) window.Carvis.soru(s.ad + ' sürecinde "' + (s.evreler[Math.max(0, simdi)] || [])[2] + '" evresini sınav odaklı biraz daha açar mısın? Klinik bağlantısını da söyle.', true); });
  };
  U.SEKMELER.push({ id: 'lab-hucre', ad: 'Hücre lab', ikon: '◉' });
  if (U.sekmeleriCiz) try { U.sekmeleriCiz(); } catch (e) {}
  U.hucreSurecleri = function () { return SUREC.map(function (x) { return { id: x.id, ad: x.ad }; }); };
})();
