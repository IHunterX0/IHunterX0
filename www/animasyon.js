/* 1001 — Animasyon motoru v3 (kullanıcı, 2026-11-03: "gerçek reels gibi yap; graflar gözüksün, animasyonlar gözüksün; bağımlılık
   yapıcı; Patrick Jane anlatımı yapsın; Carvis bazı şeylere zoomlasın, insan vücudunda ne yaptığını anlatsın; flashcard gibi değil").
   Yapay zekâ SAHNE SENARYOSU (JSON) yazar; bu motor GSAP ile oynatır:
   - Holografik insan vücudu (organlar, kemikler, kaslar, sinir, damar) + KAMERA: organa yakınlaşma/kaydırma, organ nabız gibi parlar.
   - Hücre laboratuvarı simülasyonlarını sahne içine gömme ("kalbe zoom → kas hücresi kasılıyor").
   - Kinetik yazı, ikon, şekil, kendiliğinden çizilen ok, yol boyunca akan parçacık, sayaç, ışıkla dolan büyük grafik, vurgu, çizik.
   - TikTok tarzı büyük, kelime kelime yanan altyazı; sahneler arası dalma/kaydırma/parlama geçişleri.
   - Etkileşim: orta = durdur/sürdür, sol/sağ kenar = önceki/sonraki sahne, parlayan noktalı öğe = açıklama, soru durağı = cevap bekler. */
(function () {
  'use strict';
  var U = window.Uygulama; if (!U) return;
  var el = U.el, NS = 'http://www.w3.org/2000/svg';
  var RENK = { teal: '#5ef0dc', sari: '#ffd38a', mor: '#c88cff', kirmizi: '#ff7a7a', yesil: '#8cffa0', mavi: '#46c8ff', beyaz: '#effffc', turuncu: '#ffab5e' };
  function renk(r) { return RENK[r] || (/^#[0-9a-f]{3,8}$/i.test(r || '') ? r : RENK.teal); }
  function sayi(v, d) { v = +v; return isFinite(v) ? v : d; }
  function kl(v) { return Math.max(0, Math.min(1, v)); }

  var st = document.createElement('style');
  st.textContent = [
    '.an-sahne{position:relative;width:100%;height:100%;overflow:hidden;touch-action:manipulation;user-select:none}',
    '.an-dunya{position:absolute;inset:0;transform-origin:0 0;will-change:transform}',
    '.an-sahne svg.an-svg{position:absolute;inset:0;width:100%;height:100%;overflow:visible}',
    '.an-katman{position:absolute;inset:0}',
    '.an-o{position:absolute;transform:translate(-50%,-50%);will-change:transform,opacity;pointer-events:auto}',
    '.an-yazi{font:800 calc(var(--b,1) * clamp(24px,5vw,48px))/1.12 var(--f-baslik,system-ui);color:#fff;text-align:center;letter-spacing:-.01em;text-shadow:0 0 22px rgba(94,240,220,.75),0 3px 0 rgba(0,0,0,.35);max-width:88%;white-space:pre-wrap}',
    '.an-ikon{font-size:calc(var(--b,1) * clamp(44px,8vw,88px));line-height:1;color:#9ffff0;filter:drop-shadow(0 0 18px rgba(94,240,220,.7))}',
    '.an-ikon .hik{width:1em;height:1em;vertical-align:0}',
    '.an-etiket{font:700 calc(var(--b,1) * clamp(13px,1.9vw,17px)) var(--f-kod,monospace);letter-spacing:.04em;color:#e6fffb;text-shadow:0 0 10px rgba(94,240,220,.85);white-space:nowrap}',
    '.an-sayac{font:200 calc(var(--b,1) * clamp(40px,8vw,84px)) var(--f-kod,monospace);color:#ffd38a;text-shadow:0 0 24px rgba(255,200,100,.75)}',
    '.an-vucut{position:absolute;left:50%;top:50%;height:96%;aspect-ratio:200/520;transform:translate(-50%,-50%)}',
    '.an-vucut svg{width:100%;height:100%;overflow:visible}',
    '.an-vucut .org{transition:fill-opacity .4s,stroke-width .4s}',
    '.an-vucut .org.on{animation:anOrgan 1.1s ease-in-out infinite}',
    '.an-vucut .org.on[fill="none"]{animation:anOrganCizgi 1.1s ease-in-out infinite}',
    '@keyframes anOrganCizgi{0%,100%{stroke-opacity:.5;stroke-width:1.6;filter:drop-shadow(0 0 3px currentColor)}50%{stroke-opacity:1;stroke-width:2.6;filter:drop-shadow(0 0 10px currentColor)}}',
    '@keyframes anOrgan{0%,100%{fill-opacity:.35;filter:drop-shadow(0 0 4px currentColor)}50%{fill-opacity:.8;filter:drop-shadow(0 0 14px currentColor)}}',
    '.an-lab{position:absolute;transform:translate(-50%,-50%);border-radius:22px;overflow:hidden;box-shadow:0 0 0 1px rgba(110,255,235,.4),0 0 40px rgba(94,240,220,.25);background:radial-gradient(circle,rgba(10,40,48,.6),rgba(2,8,12,.85))}',
    '.an-lab canvas{width:100%;height:100%;display:block}',
    '.an-alt{position:absolute;left:4%;right:4%;bottom:6%;z-index:6;text-align:center;font:900 clamp(24px,5.2vw,44px)/1.18 var(--f-baslik,system-ui);letter-spacing:-.01em;pointer-events:none;text-transform:none}',
    '.an-alt span{color:rgba(255,255,255,.35);transition:color .12s,text-shadow .12s;-webkit-text-stroke:0}',
    '.an-alt span.soy{color:#fff;text-shadow:0 2px 0 #000,0 0 18px rgba(0,0,0,.7)}',
    '.an-alt span.simdi{color:#ffe36e;text-shadow:0 2px 0 #000,0 0 22px rgba(255,220,100,.85)}',
    '.an-ipucu{position:absolute;z-index:8;max-width:min(320px,70%);padding:10px 14px;border-radius:16px;background:rgba(3,16,22,.94);box-shadow:0 0 0 1px rgba(110,255,235,.5),0 0 24px rgba(94,240,220,.3);color:#e6fffb;font-size:14px;line-height:1.45;transform:translate(-50%,calc(-100% - 18px))}',
    '.an-tikla{cursor:pointer}.an-tikla::after{content:"";position:absolute;right:-8px;top:-8px;width:10px;height:10px;border-radius:50%;background:#8ffff0;box-shadow:0 0 8px #8ffff0;animation:anNokta 1.4s ease-in-out infinite}',
    '@keyframes anNokta{50%{transform:scale(1.6);opacity:.4}}',
    '.an-durdu{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);font-size:64px;color:rgba(230,255,250,.85);pointer-events:none;text-shadow:0 0 24px rgba(94,240,220,.8);z-index:9}',
    '.an-segment{position:absolute;left:12px;right:12px;top:8px;display:flex;gap:4px;z-index:9;pointer-events:none}',
    '.an-segment i{flex:1;height:3px;border-radius:2px;background:rgba(255,255,255,.2);overflow:hidden}.an-segment i b{display:block;height:100%;width:0;background:#fff;box-shadow:0 0 8px #5ef0dc}',
    '.an-flas{position:absolute;inset:0;z-index:7;pointer-events:none;background:radial-gradient(circle,rgba(180,255,245,.55),transparent 70%);opacity:0}',
    '.an-cubuk{position:absolute;left:0;right:0;bottom:0;height:14px;z-index:9;cursor:pointer;display:flex;align-items:flex-end}',
    '.an-cubuk::before{content:"";position:absolute;left:0;right:0;bottom:0;height:3px;background:rgba(255,255,255,.18)}',
    '.an-cubuk b{position:relative;display:block;height:3px;width:0;background:linear-gradient(90deg,#46c8ff,#5ef0dc,#fff);box-shadow:0 0 10px #5ef0dc;transition:width .12s linear}',
    '.an-cubuk b::after{content:"";position:absolute;right:-5px;top:-4px;width:11px;height:11px;border-radius:50%;background:#fff;box-shadow:0 0 10px #5ef0dc}',
    '.an-sure{position:absolute;right:12px;bottom:12px;z-index:9;font:600 11px var(--f-kod,monospace);color:rgba(230,255,250,.7);pointer-events:none}',
    '.an-nisan{position:absolute;left:50%;top:42%;width:min(34vw,220px);aspect-ratio:1;transform:translate(-50%,-50%);z-index:5;pointer-events:none;opacity:0;border-radius:50%;border:1.5px dashed rgba(140,255,240,.7);box-shadow:0 0 30px rgba(94,240,220,.35),inset 0 0 30px rgba(94,240,220,.2)}',
    '.an-nisan::before,.an-nisan::after{content:"";position:absolute;inset:-14px;border-radius:50%;border:2px solid transparent;border-top-color:#8ffff0;border-bottom-color:#8ffff0;animation:anDon 3s linear infinite}',
    '.an-nisan::after{inset:10px;border-top-color:transparent;border-bottom-color:transparent;border-left-color:#ffd38a;border-right-color:#ffd38a;animation-duration:2.2s;animation-direction:reverse}',
    '@keyframes anDon{to{transform:rotate(360deg)}}',
    '.an-not{position:absolute;right:5%;top:58%;max-width:min(300px,52%);z-index:6;padding:10px 14px;border-radius:14px;background:linear-gradient(135deg,rgba(6,40,46,.82),rgba(3,14,18,.7));box-shadow:0 0 0 1px rgba(110,255,235,.45),0 0 26px rgba(94,240,220,.25);color:#e9fffb;font:600 clamp(14px,2.2vw,18px)/1.4 var(--f-baslik,system-ui);pointer-events:none;opacity:0}',
    '.an-not:empty{display:none}',
    '.an-tarama{position:absolute;left:-5%;right:-5%;height:12%;top:0;background:linear-gradient(180deg,transparent,rgba(94,240,220,.18),transparent);animation:anTara 4s linear infinite;pointer-events:none}',
    '@keyframes anTara{from{top:-12%}to{top:100%}}',
    '.an-vucut .org{cursor:pointer}',
    '.an-gorsel{position:absolute;transform:translate(-50%,-50%);border-radius:20px;overflow:hidden;background:#02090c;box-shadow:0 0 0 1px rgba(110,255,235,.45),0 0 40px rgba(94,240,220,.25)}',
    '.an-gorsel img{width:100%;height:100%;object-fit:contain;display:block;background:#f4f8f8}',
    '.an-gorsel::after{content:"";position:absolute;inset:0;pointer-events:none;background:repeating-linear-gradient(0deg,rgba(94,240,220,.06) 0 1px,transparent 1px 4px),radial-gradient(ellipse at center,transparent 60%,rgba(2,12,16,.55))}',
    '.an-gorsel small{position:absolute;left:8px;bottom:6px;z-index:2;font:500 9.5px var(--f-kod,monospace);color:#fff;background:rgba(0,0,0,.55);padding:2px 6px;border-radius:6px;max-width:94%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
    '.an-gbaslik{position:absolute;left:0;right:0;top:0;z-index:2;padding:6px 12px;font:700 12px var(--f-kod,monospace);letter-spacing:.06em;color:#e9fffb;background:linear-gradient(180deg,rgba(2,14,18,.85),transparent);text-shadow:0 0 8px rgba(94,240,220,.6)}',
    '.an-karar{position:absolute;left:50%;transform:translateX(-50%);width:min(90%,600px);display:flex;flex-direction:column;align-items:stretch;gap:3px;z-index:3}',
    '.an-ksat{display:flex;flex-direction:column;gap:6px;padding:8px 12px;border-radius:14px;background:rgba(94,240,220,.06);box-shadow:0 0 0 1px rgba(110,255,235,.25)}',
    '.an-ksoru{font:700 clamp(13px,2.2vw,17px) var(--f-kod,monospace);color:#7fe8da;letter-spacing:.03em}',
    '.an-ksec{display:flex;flex-wrap:wrap;gap:6px}.an-ksec span{padding:5px 11px;border-radius:999px;font:600 clamp(13px,2.2vw,17px) var(--f-baslik,system-ui);color:#e9fffb;box-shadow:0 0 0 1px rgba(255,255,255,.25);transition:all .3s}',
    '.an-ksec span.on{color:#0b1a12;background:#8cffa0;box-shadow:0 0 18px rgba(140,255,160,.7)}',
    '.an-karar .an-zok{text-align:center}',
    '.an-ksonuc{padding:12px 16px;border-radius:18px;text-align:center;box-shadow:0 0 0 2px var(--r),0 0 30px var(--r);background:linear-gradient(135deg,rgba(255,211,138,.15),rgba(0,0,0,.3))}',
    '.an-ksonuc b{display:block;font:900 clamp(19px,3.6vw,30px) var(--f-baslik,system-ui);color:#fff;text-shadow:0 0 14px var(--r)}.an-ksonuc small{display:block;margin-top:4px;color:#ffe9c2;font-size:clamp(13px,2.2vw,16px);line-height:1.35}',
    '.an-tablo{position:absolute;left:50%;transform:translateX(-50%);width:min(88%,560px);display:grid;gap:6px;z-index:3}',
    '.an-thucre{padding:12px 8px;border-radius:12px;text-align:center;font:700 clamp(15px,2.8vw,22px) var(--f-kod,monospace);color:#f2fffd;background:rgba(94,240,220,.07);box-shadow:0 0 0 1px rgba(110,255,235,.3)}',
    '.an-thucre.bas{background:transparent;box-shadow:none;color:#7fe8da;font-size:clamp(12px,2.1vw,16px);letter-spacing:.06em}',
    '.an-formul{position:absolute;left:50%;transform:translateX(-50%);width:min(90%,620px);display:flex;flex-direction:column;align-items:center;gap:10px;z-index:3}',
    '.an-fana{padding:14px 20px;border-radius:18px;font:800 clamp(20px,3.8vw,32px)/1.3 var(--f-kod,monospace);color:#fff;text-align:center;box-shadow:0 0 0 1px var(--r),0 0 30px rgba(94,240,220,.25);background:linear-gradient(135deg,rgba(94,240,220,.1),rgba(0,0,0,.3));text-shadow:0 0 14px var(--r)}',
    '.an-fadim{font:700 clamp(17px,3vw,26px) var(--f-kod,monospace);color:#d8fff8}.an-fadim.son{color:#ffd38a;font-size:clamp(22px,4.2vw,36px);text-shadow:0 0 18px rgba(255,211,138,.7)}',
    '.an-molekul{position:absolute;transform:translate(-50%,-50%);border-radius:22px;overflow:hidden;background:radial-gradient(circle,rgba(20,70,80,.5),rgba(2,8,12,.2) 70%);box-shadow:0 0 0 1px rgba(110,255,235,.35),0 0 40px rgba(94,240,220,.2)}',
    '.an-molekul small{position:absolute;left:8px;bottom:6px;z-index:2;font:500 9.5px var(--f-kod,monospace);color:#cfe;background:rgba(0,0,0,.5);padding:2px 6px;border-radius:6px}',
    '.an-wiki{position:absolute;transform:translate(-50%,-50%);display:flex;flex-direction:column;border-radius:20px;overflow:hidden;background:linear-gradient(180deg,rgba(240,248,250,.97),rgba(220,236,240,.95));color:#0d1b20;box-shadow:0 0 0 1px rgba(110,255,235,.6),0 0 40px rgba(94,240,220,.3);transform-style:preserve-3d}',
    '.an-wiki .gor{flex:1;min-height:0;overflow:hidden;background:#fff}.an-wiki .gor img{width:100%;height:100%;object-fit:contain}',
    '.an-wiki b{display:block;padding:8px 14px 0;font:800 clamp(16px,2.8vw,22px) Georgia,serif}.an-wiki p{margin:4px 14px 6px;font:500 clamp(13px,2.1vw,16px)/1.4 Georgia,serif;color:#24363b}',
    '.an-wiki.yazi{height:auto!important;padding:10px 0 4px}.an-wiki.yazi .gor{display:none}.an-wiki.yazi p{font-size:clamp(16px,2.8vw,21px)}',
    '.an-wiki small{padding:0 14px 8px;font:500 10px var(--f-kod,monospace);color:#5d7479}',
    '.an-wiki .rozet{position:absolute;right:10px;top:10px;z-index:2;font:800 10px var(--f-kod,monospace);letter-spacing:.1em;color:#fff;background:#0d1b20;padding:3px 8px;border-radius:999px}',
    '.an-zincir{position:absolute;left:50%;transform:translateX(-50%);width:min(82%,520px);display:flex;flex-direction:column;align-items:center;gap:4px;z-index:3}',
    '.an-zadim{width:100%;text-align:center;padding:11px 14px;border-radius:16px;background:linear-gradient(135deg,rgba(94,240,220,.12),rgba(0,0,0,.25));box-shadow:0 0 0 1px var(--r);color:#f2fffd;font:700 clamp(15px,2.6vw,21px)/1.3 var(--f-baslik,system-ui);text-shadow:0 0 10px rgba(0,0,0,.6)}',
    '.an-zok{font-size:22px;line-height:1;text-shadow:0 0 10px currentColor}',
    '.an-kars{position:absolute;left:4%;right:4%;display:grid;grid-template-columns:1fr auto 1fr;gap:10px;align-items:start;z-index:3}',
    '.an-kkol{padding:12px;border-radius:18px;box-shadow:0 0 0 1px var(--r),0 0 24px rgba(0,0,0,.3);background:linear-gradient(180deg,rgba(255,255,255,.05),transparent)}',
    '.an-kkol h5{margin:0 0 8px;font:800 clamp(16px,2.8vw,22px) var(--f-baslik,system-ui);color:var(--r);text-shadow:0 0 14px var(--r)}',
    '.an-kmadde{padding:6px 0;border-top:1px solid rgba(255,255,255,.08);color:#effffc;font-size:clamp(13.5px,2.2vw,17px);line-height:1.35}',
    '.an-vs{align-self:center;font:900 22px var(--f-baslik,system-ui);color:#ff7a7a;text-shadow:0 0 16px #ff7a7a}',
    '.an-eksen{position:absolute;transform:translate(calc(-100% - 8px),-50%);font:600 clamp(10px,1.6vw,13px) var(--f-kod,monospace);color:rgba(200,255,245,.75);white-space:nowrap;pointer-events:none}',
    '.an-eksen.y{transform:none;color:#9ff}.an-eksen.x{transform:translateX(-100%)}',
    '.an-okuma{font:700 clamp(13px,2vw,17px) var(--f-kod,monospace);text-shadow:0 0 10px currentColor,0 2px 0 #000;white-space:nowrap;pointer-events:none}',
    '.an-isaret{font:700 clamp(11px,1.8vw,14px) var(--f-kod,monospace);color:#111;background:var(--r);padding:3px 8px;border-radius:999px;box-shadow:0 0 14px var(--r);white-space:nowrap;pointer-events:none}',
    '.an-geri{height:4px;border-radius:2px;background:rgba(255,255,255,.12);overflow:hidden;margin:-2px 0 6px}.an-geri i{display:block;height:100%;width:100%;background:#ffd38a;box-shadow:0 0 8px #ffd38a}',
    '.an-soru{position:absolute;inset:10% 7%;z-index:8;display:flex;flex-direction:column;gap:10px;justify-content:center}',
    '.an-soru h4{margin:0 0 6px;font:800 clamp(20px,3.6vw,32px)/1.25 var(--f-baslik,system-ui);color:#fff;text-shadow:0 0 18px rgba(94,240,220,.6)}',
    '.an-soru button{text-align:left;padding:13px 16px;border-radius:16px;border:0;background:rgba(94,240,220,.08);box-shadow:0 0 0 1px rgba(110,255,235,.35);color:#f0fffc;font-size:16px;font-weight:600}',
    '.an-soru button.dogru{box-shadow:0 0 0 2px #8cffa0,0 0 24px rgba(140,255,160,.5)}.an-soru button.yanlis{box-shadow:0 0 0 2px #ff7a7a;opacity:.8}',
    '.an-soru p{margin:4px 0 0;color:#ffd38a;font-size:15px;line-height:1.45}'
  ].join('\n');
  document.head.appendChild(st);

  /* ---------- holografik insan vücudu v2 (kullanıcı, 2026-11-03: "insan vücudu daha detaylı olsun, çok ucuz duruyor; tam anatomik
     olmaması sorun değil"). Önden görünüm; hastanın sağı = görüntünün solu. Katmanlar: deri silueti → iskelet → kaslar → damar ve sinir
     ağaçları → organlar. Odak organ nabız gibi parlar; dokununca görevi çıkar. Koordinat: 200 × 520. */
  function ayna(d) { return d.replace(/(-?\d+(?:\.\d+)?)(\s+)(-?\d+(?:\.\d+)?)/g, function (m, x, sp, y) { return (200 - +x).toFixed(1).replace(/\.0$/, '') + sp + y; }); }
  function cift(d) { return d + ' ' + ayna(d); }
  var ORGAN = {
    beyin: { d: 'M74 30 C72 12 128 12 126 30 C134 38 132 56 120 60 C110 66 90 66 80 60 C68 56 66 38 74 30 Z', r: 'mor', ad: 'beyin',
      ic: 'M80 26 C86 22 90 30 96 24 M104 24 C110 30 114 22 120 26 M78 38 C84 34 90 42 98 36 M102 36 C110 42 116 34 122 38 M80 50 C88 46 94 54 100 48 C106 54 112 46 120 50 M100 16 L100 60' },
    beyincik: { d: 'M88 60 C92 66 108 66 112 60 C108 70 92 70 88 60 Z', r: 'mor', ad: 'beyincik' },
    goz: { d: 'M86 52 a4 3 0 1 0 8 0 a4 3 0 1 0 -8 0 M106 52 a4 3 0 1 0 8 0 a4 3 0 1 0 -8 0', r: 'mavi', ad: 'göz' },
    tiroid: { d: 'M90 94 C93 88 99 90 100 94 C101 90 107 88 110 94 C106 100 94 100 90 94 Z', r: 'turuncu', ad: 'tiroid' },
    trakea: { d: 'M98 84 L98 116 M102 84 L102 116 M98 88 h4 M98 93 h4 M98 98 h4 M98 103 h4 M98 108 h4 M98 113 h4', r: 'beyaz', ad: 'trakea', cizgi: true },
    akciger_sag: { d: 'M66 124 C64 108 86 100 95 114 L96 176 C86 184 66 182 61 172 C60 156 62 138 66 124 Z', r: 'mavi', ad: 'sağ akciğer',
      ic: 'M64 146 C74 142 84 146 95 140 M62 160 C72 156 84 160 95 156 M98 116 C92 124 86 130 78 138 M86 130 C84 144 80 154 74 162 M90 126 C92 140 90 156 86 168' },
    akciger_sol: { d: 'M134 124 C136 108 114 100 105 114 L106 128 C112 132 116 142 114 154 L106 176 C116 184 134 182 139 172 C140 156 138 138 134 124 Z', r: 'mavi', ad: 'sol akciğer',
      ic: 'M138 150 C128 146 118 152 112 150 M102 116 C108 124 114 130 122 138 M114 130 C116 144 120 154 126 162' },
    kalp: { d: 'M101 138 C96 126 110 121 115 131 C119 123 132 129 126 143 C121 153 111 161 105 166 C100 157 94 147 101 138 Z', r: 'kirmizi', ad: 'kalp',
      ic: 'M108 132 C110 142 108 152 105 164 M101 146 C108 148 116 146 124 140' },
    aort: { d: 'M108 132 C106 116 96 112 94 124 L100 132 L100 252', r: 'kirmizi', ad: 'aort', cizgi: true },
    diyafram: { d: 'M60 184 C74 172 88 176 100 182 C112 176 126 172 140 184', r: 'teal', ad: 'diyafram', cizgi: true },
    karaciger: { d: 'M60 188 C70 178 110 178 116 188 C112 206 86 214 66 208 C58 202 57 194 60 188 Z', r: 'turuncu', ad: 'karaciğer', ic: 'M92 182 C90 194 88 204 86 210' },
    safra_kesesi: { d: 'M90 206 C88 212 92 218 96 214 C96 210 94 206 90 206 Z', r: 'yesil', ad: 'safra kesesi' },
    mide: { d: 'M114 186 C126 178 142 186 138 202 C134 216 116 220 108 210 C104 204 110 198 116 198 C122 198 124 192 114 186 Z', r: 'sari', ad: 'mide' },
    dalak: { d: 'M141 190 C150 188 152 206 143 210 C137 206 137 194 141 190 Z', r: 'mor', ad: 'dalak' },
    pankreas: { d: 'M88 216 C96 210 122 208 134 214 C126 222 100 224 88 220 Z', r: 'sari', ad: 'pankreas' },
    adrenal: { d: cift('M70 210 C72 204 80 204 80 210 Z'), r: 'turuncu', ad: 'böbreküstü bezleri' },
    bobrek_sag: { d: 'M74 212 C64 214 64 236 76 239 C83 237 79 228 82 224 C80 218 80 214 74 212 Z', r: 'mor', ad: 'sağ böbrek' },
    bobrek_sol: { d: 'M126 212 C136 214 136 236 124 239 C117 237 121 228 118 224 C120 218 120 214 126 212 Z', r: 'mor', ad: 'sol böbrek' },
    ureter: { d: 'M80 228 C84 250 88 270 94 284 M120 228 C116 250 112 270 106 284', r: 'sari', ad: 'üreterler', cizgi: true },
    ince_bagirsak: { d: 'M84 236 C78 240 82 248 90 246 C98 244 104 248 98 254 C92 258 84 256 84 262 C84 270 96 268 104 264 C112 260 118 266 112 272 C106 276 96 274 92 278 M96 240 C104 236 114 238 116 246 C118 254 108 256 106 250', r: 'turuncu', ad: 'ince bağırsak', cizgi: true },
    kolon: { d: 'M74 274 L74 232 C74 226 80 224 86 226 L116 226 C122 224 128 228 126 236 L126 270 C126 280 118 284 110 282 C104 280 102 286 104 290', r: 'turuncu', ad: 'kalın bağırsak', cizgi: true },
    bagirsak: { d: 'M74 232 C74 226 126 226 126 232 L126 274 C126 284 74 284 74 274 Z', r: 'turuncu', ad: 'bağırsaklar', hayalet: true },
    mesane: { d: 'M90 286 C90 278 110 278 110 286 C110 296 90 296 90 286 Z', r: 'sari', ad: 'mesane' },
    omurilik: { d: 'M100 62 L100 270', r: 'sari', ad: 'omurilik', cizgi: true },
    sinirler: { d: cift('M98 104 C80 106 62 110 50 122 C46 150 42 180 40 220 C38 240 36 252 34 262 M98 268 C92 284 86 296 84 312 C84 360 84 400 82 440 C82 470 80 486 80 498 M98 140 C88 142 76 144 66 146 M98 160 C88 162 76 164 64 166'), r: 'sari', ad: 'sinirler', cizgi: true },
    kafatasi: { d: 'M70 36 C70 2 130 2 130 36 C132 58 120 74 100 76 C80 74 68 58 70 36 Z M78 62 Q100 88 122 62', r: 'beyaz', ad: 'kafatası', cizgi: true },
    klavikula: { d: cift('M98 100 Q80 95 58 104'), r: 'beyaz', ad: 'klavikula', cizgi: true },
    kaburga: { d: (function () { var d = 'M97 106 L97 166 M103 106 L103 166'; for (var i = 0; i < 10; i++) { var y = 108 + i * 7.2, a = 34 - Math.max(0, i - 6) * 3, b = a - 2; d += ' ' + cift('M98 ' + y + ' C' + (98 - b * 0.5) + ' ' + (y - 3) + ' ' + (98 - a) + ' ' + (y + 2) + ' ' + (98 - a + 2) + ' ' + (y + 12)); } return d; })(), r: 'beyaz', ad: 'kaburgalar', cizgi: true },
    pelvis: { d: 'M66 262 C58 280 74 302 92 302 L108 302 C126 302 142 280 134 262 C126 274 112 280 100 280 C88 280 74 274 66 262 Z M84 288 a5 6 0 1 0 0.1 0 M116 288 a5 6 0 1 0 0.1 0', r: 'beyaz', ad: 'pelvis', cizgi: true },
    humerus: { d: cift('M52 108 L42 188'), r: 'beyaz', ad: 'humerus', cizgi: true },
    radius_ulna: { d: cift('M41 192 L33 258 M45 192 L39 258 M30 262 L28 276 M34 262 L33 278 M38 262 L38 278 M42 262 L43 276'), r: 'beyaz', ad: 'radius-ulna', cizgi: true },
    femur: { d: cift('M84 300 L82 392'), r: 'beyaz', ad: 'femur', cizgi: true },
    tibia: { d: cift('M82 404 L82 490 M88 406 L87 488 M74 496 L92 498'), r: 'beyaz', ad: 'tibia-fibula', cizgi: true },
    biceps: { d: 'M150 112 C162 128 164 160 156 180 C150 168 146 130 150 112 Z', r: 'kirmizi', ad: 'biceps' },
    kuadriseps: { d: 'M124 296 C138 320 140 370 128 392 C120 370 118 320 124 296 Z', r: 'kirmizi', ad: 'kuadriseps' },
    kalp_damar: { d: cift('M94 124 C86 116 70 112 56 112 C48 140 44 170 42 200 C40 230 38 248 36 260 M96 124 L92 92 M100 250 C94 266 88 282 86 300 C84 340 84 380 84 420 C84 450 83 474 82 494'), r: 'kirmizi', ad: 'atardamarlar', cizgi: true },
    venler: { d: cift('M98 132 L98 96 M98 132 C90 122 74 116 60 116 C52 146 48 176 46 206 C44 232 42 250 40 262 M98 250 C92 266 92 282 90 300 C88 340 88 380 88 420 C88 452 87 476 86 494'), r: 'mavi', ad: 'toplardamarlar', cizgi: true }
  };
  // yalnız süs (odaklanmaz): kas konturları
  var KAS = cift('M100 112 C88 110 70 112 60 122 C66 136 84 142 100 140 M58 104 C46 108 44 124 48 136 C54 128 60 118 64 108 M92 190 L92 282 M86 200 L114 200 M86 222 L114 222 M86 244 L114 244 M86 264 L114 264 M70 196 C66 220 68 250 76 272 M50 122 C56 140 56 160 50 180 M74 300 C70 330 72 360 78 390 M90 300 C94 330 94 360 88 390 M80 410 C74 430 74 450 80 470');
  var GOVDE = 'M100 4 C122 4 132 20 130 42 C128 62 118 76 108 80 L110 92 C130 96 150 98 160 110 C170 150 172 200 166 262 L156 264 C158 220 156 168 150 132 L144 130 C146 180 144 230 140 282 C138 330 136 390 132 500 L108 500 L104 300 L96 300 L92 500 L68 500 C64 390 62 330 60 282 C56 230 54 180 56 130 L50 132 C44 168 42 220 44 264 L34 262 C28 200 30 150 40 110 C50 98 70 96 90 92 L92 80 C82 76 72 62 70 42 C68 20 78 4 100 4 Z';
  var KATMAN = { iskelet: /^(kafatasi|klavikula|kaburga|pelvis|humerus|radius_ulna|femur|tibia)$/, ag: /^(kalp_damar|venler|sinirler|omurilik|aort)$/ };
  function vucutKur(odaklar, renkOn) {
    var s = document.createElementNS(NS, 'svg'); s.setAttribute('viewBox', '0 0 200 520');
    var h = '<defs><linearGradient id="anVg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5ef0dc" stop-opacity=".16"/><stop offset="1" stop-color="#46c8ff" stop-opacity=".04"/></linearGradient>' +
      '<radialGradient id="anVi" cx=".5" cy=".35" r=".6"><stop offset="0" stop-color="#9ffff0" stop-opacity=".12"/><stop offset="1" stop-color="#5ef0dc" stop-opacity="0"/></radialGradient></defs>' +
      '<path d="' + GOVDE + '" fill="url(#anVg)" stroke="#5ef0dc" stroke-opacity=".75" stroke-width="1.2" style="filter:drop-shadow(0 0 6px #5ef0dc)"/>' +
      '<path d="' + GOVDE + '" fill="url(#anVi)"/>';
    for (var y = 14; y < 500; y += 9) h += '<line x1="28" x2="172" y1="' + y + '" y2="' + y + '" stroke="#5ef0dc" stroke-opacity=".045"/>';
    h += '<path d="' + KAS + '" fill="none" stroke="#ff9a9a" stroke-opacity=".16" stroke-width=".8"/>';
    s.innerHTML = h;
    // sıra: iskelet → damar/sinir ağı → organlar (organlar üstte, dokunulabilir)
    var sira = Object.keys(ORGAN).sort(function (a, b) { function k(x) { return KATMAN.iskelet.test(x) ? 0 : KATMAN.ag.test(x) ? 1 : 2; } return k(a) - k(b); });
    sira.forEach(function (k) {
      var o = ORGAN[k], c = renk(o.r), g = document.createElementNS(NS, 'g');
      var p = document.createElementNS(NS, 'path'); p.setAttribute('d', o.d); p.setAttribute('class', 'org'); p.setAttribute('data-org', k); p.style.color = c;
      if (o.hayalet) { p.setAttribute('fill', 'transparent'); p.setAttribute('stroke', 'none'); }
      else if (o.cizgi) { var isk = KATMAN.iskelet.test(k); p.setAttribute('fill', 'none'); p.setAttribute('stroke', c); p.setAttribute('stroke-width', isk ? 1.1 : k === 'omurilik' || k === 'aort' ? 2 : 1.3); p.setAttribute('stroke-opacity', isk ? '.32' : '.5'); p.setAttribute('stroke-linecap', 'round'); }
      else { p.setAttribute('fill', c); p.setAttribute('fill-opacity', '.2'); p.setAttribute('stroke', c); p.setAttribute('stroke-width', '1'); p.setAttribute('stroke-opacity', '.8'); }
      g.appendChild(p);
      if (o.ic) { var ic = document.createElementNS(NS, 'path'); ic.setAttribute('d', o.ic); ic.setAttribute('fill', 'none'); ic.setAttribute('stroke', c); ic.setAttribute('stroke-opacity', '.45'); ic.setAttribute('stroke-width', '.7'); ic.style.pointerEvents = 'none'; g.appendChild(ic); }
      s.appendChild(g);
    });
    // omurga segmentleri
    var om = ''; for (var v = 84; v < 280; v += 6.5) om += '<rect x="96.5" y="' + v.toFixed(1) + '" width="7" height="4.6" rx="1.4"/>';
    var og = document.createElementNS(NS, 'g'); og.setAttribute('fill', 'none'); og.setAttribute('stroke', '#effffc'); og.setAttribute('stroke-opacity', '.22'); og.setAttribute('stroke-width', '.6'); og.innerHTML = om; s.insertBefore(og, s.querySelector('g'));
    (odaklar || []).forEach(function (k) { var p = s.querySelector('[data-org="' + k + '"]'); if (p) { p.classList.add('on'); if (renkOn) { p.style.color = renk(renkOn); } } });
    return s;
  }

  /* ---------- arka planlar ---------- */
  function arka(cv, tur) {
    var ctx = cv.getContext('2d'), w = 0, h = 0, P = [];
    var cfg = { hucre: ['120,255,235', 'kabarcik'], kan: ['255,120,130', 'disk'], beyin: ['200,140,255', 'ag'], kalp: ['255,120,130', 'nabiz'], uzay: ['160,200,255', 'yildiz'], koridor: ['94,240,220', 'izgara'], laboratuvar: ['94,240,220', 'izgara'], vucut: ['94,240,220', 'yildiz'], arsiv: ['255,214,160', 'arsiv'], bos: ['94,240,220', 'yildiz'] }[tur] || ['94,240,220', 'izgara'];
    function boyut() { var r = cv.getBoundingClientRect(); w = cv.width = Math.max(1, r.width); h = cv.height = Math.max(1, r.height); P = []; for (var i = 0; i < 50; i++) P.push({ x: Math.random() * w, y: Math.random() * h, r: 2 + Math.random() * (cfg[1] === 'kabarcik' || cfg[1] === 'disk' ? 18 : 2), v: 0.15 + Math.random() * 0.5, a: Math.random() * 6 }); }
    return function (t) {
      if (!w || cv.width !== Math.round(cv.getBoundingClientRect().width)) boyut();
      ctx.clearRect(0, 0, w, h); ctx.globalCompositeOperation = 'lighter';
      var c = cfg[0];
      if (cfg[1] === 'izgara') { ctx.strokeStyle = 'rgba(' + c + ',.07)'; var uf = h * 0.62; for (var i = -12; i <= 12; i++) { ctx.beginPath(); ctx.moveTo(w / 2 + i * 18, uf); ctx.lineTo(w / 2 + i * w * 0.18, h); ctx.stroke(); } for (var j = 0; j < 9; j++) { var y = uf + Math.pow((j + (t * 0.0004) % 1) / 9, 2) * (h - uf); ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); } }
      if (cfg[1] === 'arsiv') {
        var gv = ctx.createRadialGradient(w / 2, h / 2, w * 0.2, w / 2, h / 2, Math.max(w, h) * 0.7); gv.addColorStop(0, 'rgba(255,214,160,.07)'); gv.addColorStop(1, 'rgba(0,0,0,.35)'); ctx.fillStyle = gv; ctx.fillRect(0, 0, w, h);
        for (var gi = 0; gi < 90; gi++) { ctx.fillStyle = 'rgba(255,230,190,' + (Math.random() * 0.12) + ')'; ctx.fillRect(Math.random() * w, Math.random() * h, 1.5, 1.5); }
        if (Math.random() < 0.25) { ctx.fillStyle = 'rgba(255,230,190,.08)'; ctx.fillRect(Math.random() * w, 0, 1, h); }
      }
      if (cfg[1] === 'nabiz') { var n = Math.pow(Math.max(0, Math.sin(t * 0.004)), 12); var g0 = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w * 0.5); g0.addColorStop(0, 'rgba(' + c + ',' + (0.05 + 0.12 * n) + ')'); g0.addColorStop(1, 'rgba(' + c + ',0)'); ctx.fillStyle = g0; ctx.fillRect(0, 0, w, h); }
      P.forEach(function (q) {
        q.y -= q.v; q.x += Math.sin(t * 0.001 + q.a) * 0.3; if (q.y < -20) { q.y = h + 20; q.x = Math.random() * w; }
        if (cfg[1] === 'kabarcik' || cfg[1] === 'disk') { ctx.beginPath(); ctx.ellipse(q.x, q.y, q.r, q.r * (cfg[1] === 'disk' ? 0.55 : 1), q.a, 0, Math.PI * 2); ctx.strokeStyle = 'rgba(' + c + ',.12)'; ctx.stroke(); }
        else if (cfg[1] === 'ag') { ctx.fillStyle = 'rgba(' + c + ',.35)'; ctx.fillRect(q.x, q.y, 2, 2); }
        else { ctx.fillStyle = 'rgba(' + c + ',' + (0.2 + 0.3 * Math.sin(t * 0.002 + q.a)) + ')'; ctx.fillRect(q.x, q.y, q.r * 0.7, q.r * 0.7); }
      });
      ctx.globalCompositeOperation = 'source-over';
    };
  }

  /* ---------- organların görevi (dokununca) ---------- */
  var GOREV = {
    beyin: 'Her şeyin kontrol merkezi: duyu, hareket, bilinç, hafıza.', goz: 'Işığı retinada sinyale çevirir.', tiroid: 'T3/T4 ile metabolizma hızını ayarlar.',
    akciger_sag: 'Alveollerde O₂ alınır, CO₂ verilir (3 lob).', akciger_sol: 'Gaz değişimi; kalbe yer açmak için 2 lob.', kalp: 'Dört odacıklı pompa: dakikada ~5 L kan.',
    aort: 'Sol ventrikülden çıkan en büyük arter.', karaciger: 'Metabolizma, detoks, safra, plazma proteinleri.', mide: 'HCl + pepsin ile protein sindirimi başlar.',
    dalak: 'Yaşlı eritrositleri temizler, bağışıklık süzgeci.', pankreas: 'Ekzokrin enzimler + endokrin insülin/glukagon.', bobrek_sag: 'Kanı süzer: günde ~180 L filtrat, ~1.5 L idrar.',
    bobrek_sol: 'Süzme, geri emilim, sekresyon; RAAS ve EPO.', bagirsak: 'Emilim yüzeyi: villuslar ve mikrovilluslar.', mesane: 'İdrar deposu; detrusor kası boşaltır.',
    omurilik: 'Beyin ile vücut arasındaki iletim yolu + refleks merkezi.', kafatasi: 'Beyni koruyan kemik kutu.', humerus: 'Üst kolun tek kemiği; n. radialis oluğu.',
    radius_ulna: 'Ön kol kemikleri; pronasyon-supinasyon.', beyincik: 'Denge, koordinasyon, motor öğrenme.', trakea: 'Hava yolu; C şeklinde kıkırdak halkalar.', diyafram: 'Ana solunum kası; kasılınca göğüs genişler (n. phrenicus).', safra_kesesi: 'Safrayı depolar ve yoğunlaştırır; yağ sindirimi.', adrenal: 'Kortizol, aldosteron, adrenalin.', ureter: 'İdrarı böbrekten mesaneye peristaltizmle taşır.', ince_bagirsak: 'Sindirimin ve emilimin çoğu burada (duodenum, jejunum, ileum).', kolon: 'Su ve elektrolit emilimi; dışkı oluşumu.', sinirler: 'Periferik sinirler: pleksuslar ve n. ischiadicus.', klavikula: 'Kolu gövdeye bağlayan tek kemik köprü.', kaburga: 'Göğüs kafesi: kalp ve akciğerleri korur, solunuma katılır.', pelvis: 'Leğen kemiği: gövdeyi bacaklara aktarır, organları taşır.', venler: 'Kanı kalbe geri taşır (vena cava).', femur: 'Vücudun en uzun kemiği.', tibia: 'Bacağın yük taşıyan kemiği.',
    biceps: 'Dirsek fleksiyonu ve supinasyon (n. musculocutaneus).', kuadriseps: 'Diz ekstansiyonu (n. femoralis).', kalp_damar: 'Arterler kanı dokulara taşır.'
  };

  /* ---------- açık lisanslı gerçek görsel (Wikimedia Commons) ---------- */
  var gorselBellek = {};
  function commonsBul(sorgu) {
    sorgu = String(sorgu || '').trim(); if (!sorgu) return Promise.resolve(null);
    if (gorselBellek[sorgu]) return gorselBellek[sorgu];
    var anahtar = 'cg|' + sorgu.toLowerCase().slice(0, 80);
    var D = U.Depo;
    return gorselBellek[sorgu] = (D ? D.oku(anahtar) : Promise.resolve({})).then(function (v) {
      if (v && v.g !== undefined) return v.g;
      var url = 'https://commons.wikimedia.org/w/api.php?action=query&format=json&origin=*&generator=search&gsrnamespace=6&gsrlimit=8&gsrsearch=' + encodeURIComponent(sorgu + ' filetype:bitmap|drawing') +
        '&prop=imageinfo&iiprop=url|extmetadata|mime&iiurlwidth=900&iiextmetadatafilter=LicenseShortName|Artist';
      return fetch(url, { headers: { 'Api-User-Agent': 'CarvisCalisma/1.0 (kisisel ders uygulamasi)' } }).then(function (r) { if (!r.ok) throw new Error('commons ' + r.status); return r.json(); }).then(function (j) {
        var l = Object.keys((j.query && j.query.pages) || {}).map(function (k) { return j.query.pages[k]; }).sort(function (a, b) { return (a.index || 0) - (b.index || 0); });
        var g = null;
        l.some(function (p) {
          var ii = (p.imageinfo || [])[0]; if (!ii || !ii.thumburl) return false;
          var m = ii.extmetadata || {}, lis = String((m.LicenseShortName && m.LicenseShortName.value) || '').trim();
          if (U.lisansGecerli && !U.lisansGecerli(lis)) return false;
          if (!/image\/(jpeg|png|svg\+xml|webp)/.test(ii.mime || '')) return false;
          var yazar = String((m.Artist && m.Artist.value) || '').replace(/<[^>]+>/g, '').trim().slice(0, 60);
          g = { url: ii.thumburl, lisans: lis, yazar: yazar, sayfa: ii.descriptionurl || '' }; return true;
        });
        if (D && U.depoGuncelle) U.depoGuncelle(anahtar, function (d) { d.g = g; }, 100);
        return g;
      });
    }).catch(function () { delete gorselBellek[sorgu]; return null; });
  }

  /* ---------- gömülü şema kütüphanesi (kullanıcı, 2026-11-03: "görsel olsa güzel olurdu") ----------
     OpenStax Anatomy & Physiology 2e figürleri (CC BY-NC-SA 4.0, kişisel/ticari olmayan kullanım, atıf gösterilir): APK içinde
     www/sema/ — internet gerekmez. Yapay zekâ İngilizce "ara" terimi yazar; başlık/açıklama üzerinde yerel puanlı arama yapılır.
     Uygun şema yoksa Wikimedia Commons denenir. */
  var SEMA = null, DUR = { the: 1, of: 1, and: 1, a: 1, an: 1, in: 1, to: 1, is: 1, are: 1, with: 1, for: 1, on: 1, by: 1, from: 1, or: 1, as: 1, at: 1, this: 1, that: 1, its: 1, be: 1, diagram: 1, figure: 1, human: 1, image: 1, illustration: 1, shows: 1, show: 1 };
  function kok(w) { w = w.replace(/(ies)$/, 'y').replace(/(ses|xes)$/, function (m) { return m.slice(0, 2); }); if (w.length > 4 && /s$/.test(w) && !/ss$/.test(w)) w = w.slice(0, -1); return w; }
  function belirtec(s) { return String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').split(/[^a-z0-9]+/).filter(function (w) { return w.length > 1 && !DUR[w]; }).map(kok); }
  function semaDizin() {
    if (!SEMA) SEMA = fetch('sema/dizin.json').then(function (r) { if (!r.ok) throw 0; return r.json(); }).then(function (l) {
      l.forEach(function (e) { e._t = belirtec(e.t); e._c = belirtec(e.c + ' ' + e.m); e._a = belirtec(e.a + ' ' + e.b); });
      return l;
    }).catch(function () { return []; });
    return SEMA;
  }
  var ES = [[/neuromuscular junction|nmj|motor end ?plate/i, 'motor end plate innervation'], [/alveol/i, 'respiratory zone structures'], [/coronary arter/i, 'coronary circulation'], [/gas exchange/i, 'external internal respiration'], [/(cardiac|heart) conduction|sa node|sinoatrial/i, 'cardiac conduction system'], [/action potential/i, 'action potential graph']];
  var DERS_KITAP = { anatomi: ['OpenStax A&P 2e'], biyokimya: ['OpenStax Biology 2e', 'OpenStax A&P 2e'], biyoistatistik: ['OpenStax Introductory Statistics 2e'], biyofizik: ['OpenStax College Physics 2e', 'OpenStax A&P 2e'] };
  function semaBul(ara, kullanilan, ders) {
    var tercih = DERS_KITAP[ders] || [];
    ara = String(ara || ''); ES.forEach(function (e) { if (e[0].test(ara)) ara = e[1] + ' ' + ara; });
    var q = belirtec(ara); if (!q.length) return Promise.resolve(null);
    return semaDizin().then(function (l) {
      var en = null, enP = 0;
      l.forEach(function (e) {
        if (kullanilan && kullanilan[e.f]) return;
        var p = 0, tumu = 0;
        q.forEach(function (w) { var v = e._t.indexOf(w) >= 0 ? 3 : e._c.indexOf(w) >= 0 ? 1.4 : e._a.indexOf(w) >= 0 ? 0.6 : 0; if (v) tumu++; p += v; });
        if (tumu === q.length) p += 2;                 // bütün terimler geçiyor
        if (e._t.join(' ').indexOf(q.join(' ')) >= 0) p += 3; // başlıkta aynı sırayla
        if (p && tercih.length) p += tercih.indexOf(e.k) === 0 ? 2.5 : tercih.indexOf(e.k) > 0 ? 1 : -1;
        if (p > enP) { enP = p; en = e; }
      });
      if (!en || enP < Math.max(2.5, q.length * 1.1)) return null;
      return { url: 'sema/' + en.f, lisans: 'CC BY-NC-SA 4.0', yazar: en.k || 'OpenStax', baslik: en.t, dosya: en.f, w: en.w, h: en.h };
    });
  }
  function gorselBul(ara, kullanilan, ders) { return semaBul(ara, kullanilan, ders).then(function (g) { return g || commonsBul(ara); }); }

  /* ---------- Vikipedi kartı (kullanıcı, 2026-11-03: "vikipediadan falan göstersin") ----------
     REST özet uç noktası (CORS açık); önce Türkçe, yoksa İngilizce. Görsel YALNIZ Wikimedia Commons'ta barındırılıyorsa gösterilir
     (özgür lisans; en.wikipedia'daki adil kullanım görselleri gösterilmez). Metin CC BY-SA, kaynak satırı kartta. */
  var wikiBellek = {};
  function wikiBul(baslik, dil) {
    baslik = String(baslik || '').trim(); if (!baslik) return Promise.resolve(null);
    var an = (dil || 'tr') + '|' + baslik.toLowerCase(); if (wikiBellek[an]) return wikiBellek[an];
    var D = U.Depo;
    function getir(d) {
      return fetch('https://' + d + '.wikipedia.org/api/rest_v1/page/summary/' + encodeURIComponent(baslik.replace(/ /g, '_')), { headers: { 'Api-User-Agent': 'CarvisCalisma/1.0 (kisisel ders uygulamasi)' } })
        .then(function (r) { if (!r.ok) throw new Error('wiki ' + r.status); return r.json(); })
        .then(function (j) {
          if (!j || j.type === 'disambiguation' || !j.extract) throw new Error('yok');
          var img = (j.thumbnail && j.thumbnail.source) || (j.originalimage && j.originalimage.source) || '';
          if (!/upload\.wikimedia\.org\/wikipedia\/commons\//.test(img)) img = '';
          return { baslik: j.title, ozet: String(j.extract).slice(0, 300), gorsel: img, dil: d, url: (j.content_urls && j.content_urls.mobile && j.content_urls.mobile.page) || '' };
        });
    }
    return wikiBellek[an] = (D ? D.oku('wk|' + an) : Promise.resolve({})).then(function (v) {
      if (v && v.w !== undefined) return v.w;
      var sira = dil === 'en' ? ['en', 'tr'] : ['tr', 'en'];
      return getir(sira[0]).catch(function () { return getir(sira[1]); }).then(function (w) {
        if (D && U.depoGuncelle) U.depoGuncelle('wk|' + an, function (d) { d.w = w; }, 100); return w;
      });
    }).catch(function () { delete wikiBellek[an]; return null; });
  }

  /* ---------- senaryo onarımı: taşma, çakışma, eksik alanlar ---------- */
  function duzelt(j) {
    // görsel yoksa: yalnız yazı/ikon olan sahnelere (kanca hariç) şema eklenir; arama terimi gorselAra ya da makaleSorgu'dan
    var terimler = [].concat(j.gorselAra || []).map(String).filter(Boolean);
    if (j.makaleSorgu) terimler.push(String(j.makaleSorgu).replace(/"|\bOR\b|\bAND\b|[()]/g, ' ').replace(/\s+/g, ' ').trim().split(' ').slice(0, 4).join(' '));
    var gorselSay = 0; (j.sahneler || []).forEach(function (s) { (s && s.ogeler || []).forEach(function (g) { if (g && g.tip === 'gorsel') gorselSay++; }); });
    if (gorselSay < 2 && terimler.length) {
      var eklenen = 0;
      (j.sahneler || []).forEach(function (s, k) {
        if (!k || !s || s.tip === 'soru' || eklenen >= 2 - gorselSay || eklenen >= terimler.length) return;
        var og = s.ogeler || [];
        if (og.some(function (g) { return g && !/^(yazi|ikon|etiket|vurgu|cizik)$/.test(g.tip); })) return;
        og.forEach(function (g) { if (g && (g.tip === 'yazi' || g.tip === 'etiket')) g.y = Math.min(sayi(g.y, 0.1), 0.12); if (g && g.tip === 'ikon') { g.y = 0.1; g.x = 0.88; g.boyut = 1; } });
        og.push({ id: 'oto' + k, tip: 'gorsel', ara: terimler[eklenen], x: 0.5, y: 0.48, g: 0.9, y2: 0.52, t: 0.3 }); s.ogeler = og; eklenen++;
      });
    }
    (j.sahneler || []).forEach(function (s) {
      if (!s || s.tip === 'soru') return;
      s.anlatim = String(s.anlatim || '').split(/\s+/).slice(0, 34).join(' ');
      var yazilar = [];
      (s.ogeler || []).forEach(function (g) {
        if (!g) return;
        if (/^(yazi|ikon|etiket|sayac)$/.test(g.tip)) { g.y = Math.max(0.06, Math.min(0.76, sayi(g.y, 0.4))); g.x = Math.max(0.1, Math.min(0.9, sayi(g.x, 0.5))); }
        if (g.tip === 'grafik') { g.y = Math.max(0.12, Math.min(0.5, sayi(g.y, 0.26))); g.y2 = Math.min(sayi(g.y2, 0.42), 0.78 - g.y); }
        if (g.tip === 'lab' || g.tip === 'gorsel') { var hh = sayi(g.y2, 0.5); g.y = Math.max(0.08 + hh / 2, Math.min(0.78 - hh / 2, sayi(g.y, 0.42))); }
        if (g.tip === 'yazi') yazilar.push(g);
      });
      yazilar.sort(function (a, b) { return sayi(a.t, 0) - sayi(b.t, 0); });
      for (var a = 0; a < yazilar.length; a++) for (var b = 0; b < a; b++) {
        if (Math.abs(yazilar[a].y - yazilar[b].y) < 0.1 && Math.abs(yazilar[a].x - yazilar[b].x) < 0.4) yazilar[a].y = Math.min(0.76, yazilar[b].y + 0.12);
      }
    });
    return j;
  }
  function onYukle(j) { (j.sahneler || []).forEach(function (s) { (s.ogeler || []).forEach(function (g) { if (g && g.tip === 'gorsel' && g.ara) gorselBul(g.ara, null, j.ders).then(function (r) { if (r) { var im = new Image(); im.src = r.url; } }); }); }); }

  /* ---------- oynatıcı: tek parça akan video ---------- */
  function sahneSuresi(s) { return s.tip === 'soru' ? 11 : Math.max(sayi(s.sure, 4.5), Math.min(14, String(s.anlatim || '').length / 14 + 0.8)); }
  function Oynatici(kap, senaryo, o) {
    o = o || {};
    var G = window.gsap;
    duzelt(senaryo);
    var sahneler = (senaryo.sahneler || []).filter(function (s) { return s && (s.tip === 'soru' ? s.soru && s.siklar : true); }).slice(0, 16);
    var sureler = sahneler.map(sahneSuresi), toplam = sureler.reduce(function (a, b) { return a + b; }, 0) || 1;
    var kok = el('div', { class: 'an-sahne' }), cv = el('canvas', { style: 'position:absolute;inset:0;width:100%;height:100%' });
    var sahne = el('div', { class: 'an-katman' }), alt = el('div', { class: 'an-alt' }), flas = el('div', { class: 'an-flas' });
    var cubuk = el('div', { class: 'an-cubuk', role: 'slider', 'aria-label': 'Video ilerlemesi' }, [el('b')]), sureYazi = el('div', { class: 'an-sure' });
    var nisan = el('div', { class: 'an-nisan' }), notK = el('div', { class: 'an-not' });
    kok.appendChild(cv); kok.appendChild(sahne); kok.appendChild(nisan); kok.appendChild(notK); kok.appendChild(alt); kok.appendChild(flas); kok.appendChild(cubuk); kok.appendChild(sureYazi); kap.appendChild(kok);
    var kullanilan = {};
    var i = -1, tl = null, durdu = false, arkaCiz = null, arkaTur = '', bitti = false, raf = 0, D = null, sesSoz = null, kusak = 0, soruZaman = null;
    function yeniDunya() {
      var d = el('div', { class: 'an-dunya' }), svg = document.createElementNS(NS, 'svg'); svg.setAttribute('class', 'an-svg'); svg.setAttribute('viewBox', '0 0 1000 1000'); svg.setAttribute('preserveAspectRatio', 'none');
      var k = el('div', { class: 'an-katman' }); d.appendChild(svg); d.appendChild(k); sahne.appendChild(d);
      return { d: d, svg: svg, k: k, labs: [], vucut: null, kayit: {} };
    }
    function eskiyiSondur(E, tur) {
      if (!E) return;
      E.d.style.pointerEvents = 'none';
      var hedef = tur === 'dal' ? { opacity: 0, scale: (G.getProperty(E.d, 'scale') || 1) * 1.6, filter: 'blur(10px)' } : tur === 'kaydir' ? { opacity: 0, xPercent: -25, filter: 'blur(8px)' } : { opacity: 0 };
      G.to(E.d, Object.assign(hedef, { duration: 0.6, ease: 'power2.in', onComplete: function () { E.labs.forEach(function (l) { try { l.durdur(); } catch (e) {} }); E.d.remove(); } }));
    }
    function ilerleme(f) {
      var once = 0; for (var k = 0; k < i; k++) once += sureler[k];
      var gec = once + (i >= 0 ? sureler[i] * kl(f) : 0);
      cubuk.firstChild.style.width = (gec / toplam * 100).toFixed(2) + '%';
      var kalan = Math.max(0, Math.round(toplam - gec)); sureYazi.textContent = Math.floor(kalan / 60) + ':' + ('0' + kalan % 60).slice(-2);
    }
    function konus(m) { if (!o.konus || !m) { sesSoz = null; return; } try { var p = o.konus(m); sesSoz = p && p.then ? p : null; } catch (e) { sesSoz = null; } }
    function sus() { sesSoz = null; if (o.sus) try { o.sus(); } catch (e) {} }
    function px(x) { return kl(sayi(x, 0.5)) * 100 + '%'; }
    function svgEl(ad, at) { var e = document.createElementNS(NS, ad); for (var k in at) e.setAttribute(k, at[k]); if (/^(path|line|rect|ellipse|polygon)$/.test(ad)) e.setAttribute('vector-effect', 'non-scaling-stroke'); D.svg.appendChild(e); return e; }
    function ipucu(m, x, y) {
      var p = el('div', { class: 'an-ipucu', style: 'left:' + px(x) + ';top:' + px(y), text: m }); kok.appendChild(p);
      G.fromTo(p, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.3 }); setTimeout(function () { G.to(p, { opacity: 0, duration: 0.4, onComplete: function () { p.remove(); } }); }, 4200);
    }
    function kokOran(r) { var kr = kok.getBoundingClientRect(); return { x: (r.left + r.width / 2 - kr.left) / kr.width, y: (r.top + r.height / 2 - kr.top) / kr.height }; }
    function kameraHedef(h) {
      if (!h) return null;
      if (typeof h === 'object' && h.x != null) return { x: kl(sayi(h.x, 0.5)), y: kl(sayi(h.y, 0.5)) };
      if (D.vucut) { var p = D.vucut.querySelector('[data-org="' + h + '"]'); if (p) { var kr = kok.getBoundingClientRect(), r = p.getBoundingClientRect(), dr = D.d.getBoundingClientRect(), sc = dr.width / kr.width || 1; return { x: ((r.left + r.width / 2) - dr.left) / sc / kr.width, y: ((r.top + r.height / 2) - dr.top) / sc / kr.height }; } }
      return null;
    }
    function altyazi(m, sure) {
      var kel = String(m || '').split(/\s+/).filter(Boolean); alt.innerHTML = ''; if (!kel.length) return;
      // 3-5 kelimelik öbekler hâlinde (TikTok gibi): ekranda hep tek satır, konuşulan kelime sarı
      var obek = [], k = 0; while (k < kel.length) { var n = kel.length - k <= 5 ? kel.length - k : 4; obek.push(kel.slice(k, k + n)); k += n; }
      var pr = { n: 0 }, son = -1, sonObek = -1, spans = [];
      tl.to(pr, { n: kel.length, duration: Math.max(1, sure - 0.5), ease: 'none', onUpdate: function () {
        var w = Math.floor(pr.n); if (w === son) return; son = w;
        var say = 0, oi = 0; for (oi = 0; oi < obek.length; oi++) { if (w < say + obek[oi].length) break; say += obek[oi].length; } if (oi >= obek.length) oi = obek.length - 1, say -= obek[oi].length;
        if (oi !== sonObek) { sonObek = oi; alt.innerHTML = ''; spans = obek[oi].map(function (x) { var s = document.createElement('span'); s.textContent = x + ' '; alt.appendChild(s); return s; }); G.fromTo(alt, { scale: 0.9, opacity: 0.4 }, { scale: 1, opacity: 1, duration: 0.18, ease: 'back.out(3)' }); }
        spans.forEach(function (s, j) { s.className = say + j < w ? 'soy' : say + j === w ? 'simdi' : ''; });
      } }, 0.1);
    }
    function sahneKur(s, el2) {
      kusak++; var benim = kusak;
      var gecisTur = s.gecis || ['dal', 'kaydir', 'parla'][i % 3];
      var eski = D; D = yeniDunya();
      var tur = s.arka || senaryo.arka || 'izgara'; if (tur !== arkaTur) { arkaTur = tur; arkaCiz = arka(cv, tur); }
      if (tl) tl.kill(); tl = G.timeline({ paused: true, onUpdate: function () { ilerleme(tl.progress()); }, onComplete: function () { sahneBitti(benim); } });
      G.to(nisan, { opacity: 0, duration: 0.3 }); G.to(notK, { opacity: 0, duration: 0.3 });
      if (soruZaman) { soruZaman.kill(); soruZaman = null; }
      // vücut sahneden sahneye taşınır: kamera kaldığı yerden devam eder → kesintisiz
      var vucutVar = (s.ogeler || []).some(function (g) { return g && g.tip === 'vucut'; });
      var tasindi = false;
      if (vucutVar && eski && eski.vucut) {
        G.set(D.d, { x: G.getProperty(eski.d, 'x'), y: G.getProperty(eski.d, 'y'), scale: G.getProperty(eski.d, 'scale') });
        D.k.appendChild(eski.vucut); D.vucut = eski.vucut; eski.vucut = null; tasindi = true;
        Array.prototype.forEach.call(D.vucut.querySelectorAll('.org.on'), function (p) { p.classList.remove('on'); });
        eski.d.style.transition = 'none'; G.to(eski.d, { opacity: 0, duration: 0.45, onComplete: function () { eski.labs.forEach(function (l) { try { l.durdur(); } catch (e) {} }); eski.d.remove(); } });
      } else {
        eskiyiSondur(eski, gecisTur);
        if (gecisTur === 'dal') G.fromTo(D.d, { scale: 0.7, opacity: 0, filter: 'blur(10px)' }, { scale: 1, opacity: 1, filter: 'blur(0px)', duration: 0.65, ease: 'power3.out' });
        else if (gecisTur === 'kaydir') G.fromTo(D.d, { xPercent: 28, opacity: 0, filter: 'blur(8px)' }, { xPercent: 0, opacity: 1, filter: 'blur(0px)', duration: 0.55, ease: 'power3.out' });
        else { G.fromTo(flas, { opacity: 0.85 }, { opacity: 0, duration: 0.55 }); G.fromTo(D.d, { opacity: 0 }, { opacity: 1, duration: 0.35 }); }
      }
      if (s.tip === 'soru') { tl.to({}, { duration: 0.01 }); alt.innerHTML = ''; soruKur(s, benim); return; }
      var sure = sureler[i];
      tl.to({}, { duration: sure });
      (s.ogeler || []).slice(0, 18).forEach(function (g) { try { ogeKur(g, s, sure, tasindi); } catch (e) { console.warn('öğe', g && g.tip, e); } });
      [].concat(s.kamera || []).slice(0, 4).forEach(function (k) {
        var t0 = Math.max(0, Math.min(sure - 0.4, sayi(k.t, 0.6))), z = Math.max(1, Math.min(5, sayi(k.zoom, 2.4))), ks = sayi(k.sure, 1.3);
        tl.call(function () {
          var p = kameraHedef(k.hedef); if (!p) return; var kr = kok.getBoundingClientRect();
          G.to(D.d, { x: kr.width / 2 - p.x * kr.width * z, y: kr.height * 0.42 - p.y * kr.height * z, scale: z, duration: ks, ease: 'power3.inOut' });
          if (D.vucut && typeof k.hedef === 'string') Array.prototype.forEach.call(D.vucut.querySelectorAll('.org'), function (o2) { if (o2.getAttribute('data-org') === k.hedef) o2.classList.add('on'); });
          G.fromTo(nisan, { opacity: 0, scale: 1.8, rotation: -40 }, { opacity: 1, scale: 1, rotation: 0, duration: 0.6, delay: ks * 0.7, ease: 'back.out(1.6)' });
          if (k.not) { notK.textContent = k.not; G.fromTo(notK, { opacity: 0, x: 20 }, { opacity: 1, x: 0, duration: 0.45, delay: ks * 0.85 }); }
        }, null, t0);
      });
      if (s.kameraSifirla != null) tl.call(function () { G.to(D.d, { x: 0, y: 0, scale: 1, duration: 1, ease: 'power3.inOut' }); G.to([nisan, notK], { opacity: 0, duration: 0.3 }); }, null, Math.min(sure - 0.2, sayi(s.kameraSifirla, sure - 1)));
      altyazi(s.anlatim, sure);
      tl.call(function () { konus(s.anlatim); }, null, 0.05);
      if (!durdu) tl.play();
    }
    function sahneBitti(benim) {
      // anlatım sürüyorsa bekle (en çok 6 sn) → cümle yarıda kesilmez, akış kopmaz
      var p = sesSoz; if (!p) return ilerle(benim);
      var to = new Promise(function (ok) { setTimeout(ok, 6000); });
      Promise.race([p, to]).then(function () { ilerle(benim); }, function () { ilerle(benim); });
    }
    function ilerle(benim) { if (benim !== kusak || durdu || !kok.isConnected) return; git(i + 1, true); }
    function ogeKur(g, s, sure, tasindi) {
      if (!g) return;
      var t0 = Math.max(0, Math.min(sure - 0.3, sayi(g.t, 0))), r = renk(g.renk), b = Math.max(0.4, Math.min(3, sayi(g.boyut, 1))), e = null, acik = s.aciklamalar && g.id && s.aciklamalar[g.id], katman = D.k;
      if (g.tip === 'vucut') {
        var odak = [].concat(g.odak || []).filter(function (k) { return ORGAN[k]; });
        var vk = D.vucut;
        if (!vk) {
          vk = el('div', { class: 'an-vucut', style: g.x != null ? 'left:' + px(g.x) + ';top:' + px(g.y) : '' }); vk.appendChild(vucutKur([], null)); katman.appendChild(vk); D.vucut = vk;
          vk.appendChild(el('div', { class: 'an-tarama' }));
          G.set(vk, { opacity: 0 }); tl.fromTo(vk, { opacity: 0, scale: 0.92 }, { opacity: 1, scale: 1, duration: 0.6, ease: 'power2.out' }, t0);
          vk.addEventListener('click', function (ev) { var p = ev.target.closest('[data-org]'); if (!p) return; ev.stopPropagation(); var k = p.getAttribute('data-org'), oo = kokOran(p.getBoundingClientRect()); p.classList.add('on'); ipucu((ORGAN[k] ? ORGAN[k].ad.toUpperCase() + ' — ' : '') + (GOREV[k] || ''), oo.x, oo.y); });
        }
        tl.call(function () { odak.forEach(function (k) { var p = vk.querySelector('[data-org="' + k + '"]'); if (p) { p.classList.add('on'); if (g.renk) p.style.color = renk(g.renk); } }); }, null, t0 + 0.2);
        if (g.etiket !== false) odak.forEach(function (k, j) { tl.call(function () { var p = vk.querySelector('[data-org="' + k + '"]'); if (!p) return; var kr = kok.getBoundingClientRect(), rr = p.getBoundingClientRect(), dr = D.d.getBoundingClientRect(), sc = dr.width / kr.width || 1; var et = el('div', { class: 'an-o an-etiket', style: 'color:' + renk(ORGAN[k].r) + ';left:' + (((rr.right - dr.left) / sc) + 14) / kr.width * 100 + '%;top:' + (((rr.top + rr.height / 2) - dr.top) / sc) / kr.height * 100 + '%;transform:translate(0,-50%)' }, ['◀ ' + ORGAN[k].ad]); D.k.appendChild(et); G.fromTo(et, { opacity: 0, x: -10 }, { opacity: 1, x: 0, duration: 0.4 }); }, null, t0 + 0.5 + j * 0.3); });
        return;
      }
      if (g.tip === 'lab') {
        var lw = kl(sayi(g.g, 0.86)), lh = kl(sayi(g.y2, 0.5));
        var lk = el('div', { class: 'an-lab', style: 'left:' + px(g.x) + ';top:' + px(g.y) + ';width:' + lw * 100 + '%;height:' + lh * 100 + '%' }), lcv = el('canvas'), E = D;
        lk.appendChild(lcv); katman.appendChild(lk); G.set(lk, { opacity: 0 });
        tl.fromTo(lk, { opacity: 0, scale: 0.4, filter: 'blur(10px)' }, { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 0.7, ease: 'back.out(1.4)', onStart: function () { if (U.hucreOynat && !lk.dataset.b) { lk.dataset.b = 1; var oy = U.hucreOynat(lcv, g.surec); if (oy) E.labs.push(oy); } } }, t0);
        if (g.etiket) { var le = el('div', { class: 'an-o an-etiket', style: 'left:' + px(g.x) + ';top:calc(' + px(sayi(g.y, 0.5) - lh / 2) + ' - 14px)' }, [g.etiket]); katman.appendChild(le); G.set(le, { opacity: 0 }); tl.to(le, { opacity: 1, duration: 0.4 }, t0 + 0.4); }
        return;
      }
      if (g.tip === 'wiki') {
        var ww = kl(sayi(g.g, 0.9)), wh = kl(sayi(g.y2, 0.5));
        var wk = el('div', { class: 'an-wiki', style: 'left:' + px(g.x) + ';top:' + px(g.y) + ';width:' + ww * 100 + '%;height:' + wh * 100 + '%' }), wimg = el('div', { class: 'gor' }), wbas = el('b'), wmet = el('p'), wat = el('small');
        wk.appendChild(el('span', { class: 'rozet', text: 'W · VİKİPEDİ' })); wk.appendChild(wimg); wk.appendChild(wbas); wk.appendChild(wmet); wk.appendChild(wat); katman.appendChild(wk); G.set(wk, { opacity: 0 });
        wikiBul(g.baslik || g.ara, g.dil).then(function (w) {
          if (!w) { wk.remove(); return; }
          wbas.textContent = w.baslik; var cumle = (w.ozet.match(/^.*?[.!?](\s.*?[.!?])?(?=\s|$)/) || [w.ozet])[0]; wmet.textContent = cumle.slice(0, 240);
          wat.textContent = (w.dil === 'tr' ? 'tr' : 'en') + '.wikipedia.org · CC BY-SA' + (w.gorsel ? ' · görsel: Wikimedia Commons' : '');
          if (w.gorsel) { var im = new Image(); im.alt = w.baslik; im.src = w.gorsel; wimg.appendChild(im); G.fromTo(im, { scale: 1.02 }, { scale: 1.14, duration: sure + 2, ease: 'none' }); } else wk.classList.add('yazi');
        });
        tl.fromTo(wk, { opacity: 0, y: 30, rotationX: 25 }, { opacity: 1, y: 0, rotationX: 0, duration: 0.6, ease: 'power3.out' }, t0);
        return;
      }
      if (g.tip === 'gorsel') {
        var gw = kl(sayi(g.g, 0.84)), gh = kl(sayi(g.y2, 0.5));
        var gk = el('div', { class: 'an-gorsel', style: 'left:' + px(g.x) + ';top:' + px(g.y) + ';width:' + gw * 100 + '%;height:' + gh * 100 + '%' }), atif = el('small');
        gk.appendChild(atif); katman.appendChild(gk); G.set(gk, { opacity: 0 });
        // aynı reel'de aynı şema iki kez çıkmasın: ara terimi + sahne sırasıyla önceden ayrılır
        (g._gs || (g._gs = gorselBul(g.ara, kullanilan, senaryo.ders))).then(function (res) {
          if (!res) { gk.remove(); return; }
          if (res.dosya) kullanilan[res.dosya] = 1;
          var im = new Image(); im.alt = g.etiket || g.ara; im.src = res.url; gk.insertBefore(im, atif);
          atif.textContent = (res.yazar ? res.yazar + ' · ' : '') + res.lisans + (res.dosya ? '' : ' · Wikimedia Commons');
          if (res.baslik && !g.etiket) { var be = el('div', { class: 'an-gbaslik', text: res.baslik }); gk.appendChild(be); }
          G.fromTo(im, { scale: 1.02, xPercent: -1 }, { scale: 1.16, xPercent: 1.5, duration: sure + 2, ease: 'none' });
        });
        tl.fromTo(gk, { opacity: 0, scale: 0.9, filter: 'blur(8px)' }, { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 0.7, ease: 'power2.out' }, t0);
        if (g.etiket) { var ge = el('div', { class: 'an-o an-etiket', style: 'left:' + px(g.x) + ';top:calc(' + px(sayi(g.y, 0.5) - gh / 2) + ' - 14px)' }, [g.etiket]); katman.appendChild(ge); G.set(ge, { opacity: 0 }); tl.to(ge, { opacity: 1, duration: 0.4 }, t0 + 0.4); }
        return;
      }
      if (g.tip === 'karar') {
        // "hangi test, neden?" — her adımda soru, seçenekler; seçilen yol yanar, sonunda test + gerekçe
        var ad = (g.adimlar || []).filter(function (x) { return x && x.soru; }).slice(0, 5); if (!ad.length) return;
        var kk = el('div', { class: 'an-karar', style: 'top:' + px(sayi(g.y, 0.08)) }), kara = Math.max(0.5, Math.min(1.3, (sure - t0 - 1.6) / (ad.length + 1)));
        ad.forEach(function (a, k) {
          var sat = el('div', { class: 'an-ksat' }, [el('div', { class: 'an-ksoru', text: String(a.soru) })]), sec = el('div', { class: 'an-ksec' }), tk = t0 + k * kara;
          (a.secenekler || []).slice(0, 4).forEach(function (o2, j) { var c = el('span', { text: String(o2) }); sec.appendChild(c); if (j === (+a.secilen || 0)) tl.call(function () { c.classList.add('on'); }, null, tk + kara * 0.55); else tl.to(c, { opacity: 0.35, duration: 0.3 }, tk + kara * 0.55); });
          sat.appendChild(sec); kk.appendChild(sat); G.set(sat, { opacity: 0 });
          tl.fromTo(sat, { opacity: 0, x: -24 }, { opacity: 1, x: 0, duration: 0.35, ease: 'power3.out' }, tk);
          if (k < ad.length - 1 || g.sonuc) { var ok2 = el('div', { class: 'an-zok', style: 'color:' + r }, ['↓']); kk.appendChild(ok2); G.set(ok2, { opacity: 0 }); tl.to(ok2, { opacity: 1, duration: 0.2 }, tk + kara * 0.8); }
        });
        if (g.sonuc) { var sn = el('div', { class: 'an-ksonuc', style: '--r:' + r }, [el('b', { text: String(g.sonuc) }), g.neden ? el('small', { text: 'Neden: ' + g.neden }) : '']); kk.appendChild(sn); G.set(sn, { opacity: 0 });
          tl.fromTo(sn, { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(2)' }, t0 + ad.length * kara); }
        katman.appendChild(kk); return;
      }
      if (g.tip === 'dagilim') { dagilimKur(g, t0, r, katman, sure); return; }
      if (g.tip === 'tablo') {
        var sat = (g.satirlar || []).filter(Array.isArray).slice(0, 6).map(function (x) { return x.slice(0, 5).map(String); }); if (!sat.length) return;
        var sut = Math.max.apply(null, sat.map(function (x) { return x.length; }));
        var tk = el('div', { class: 'an-tablo', style: 'top:' + px(sayi(g.y, 0.14)) + ';grid-template-columns:repeat(' + sut + ',1fr)' }), hucre = {};
        var adimT = Math.max(0.12, Math.min(0.5, (sure - t0 - 1.5) / (sat.length * sut)));
        sat.forEach(function (x, ri) { for (var ci = 0; ci < sut; ci++) {
          var bas = (ri === 0 && g.baslikSatiri !== false) || (ci === 0 && g.baslikSutunu !== false);
          var h = el('div', { class: 'an-thucre' + (bas ? ' bas' : ''), text: x[ci] || '' }); tk.appendChild(h); hucre[ri + ',' + ci] = h; G.set(h, { opacity: 0 });
          tl.fromTo(h, { opacity: 0, scale: 0.85 }, { opacity: 1, scale: 1, duration: 0.25, ease: 'back.out(2)' }, t0 + (ri * sut + ci) * adimT);
        } });
        katman.appendChild(tk);
        var vt = t0 + sat.length * sut * adimT + 0.3;
        (g.vurgu || []).slice(0, 6).forEach(function (v, k) { var h = hucre[(+v[0]) + ',' + (+v[1])]; if (!h) return; var c = renk(v[2] || 'sari');
          tl.to(h, { boxShadow: '0 0 0 2px ' + c + ',0 0 26px ' + c, color: c, scale: 1.06, duration: 0.3 }, vt + k * 0.35); });
        return;
      }
      if (g.tip === 'formul') {
        var fk = el('div', { class: 'an-formul', style: 'top:' + px(sayi(g.y, 0.2)) + ';--r:' + r }), fm = el('div', { class: 'an-fana', text: String(g.metin || '') });
        fk.appendChild(fm); katman.appendChild(fk); G.set(fm, { opacity: 0 });
        tl.fromTo(fm, { opacity: 0, y: 16, filter: 'blur(8px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.5 }, t0);
        var fa = (g.adimlar || []).slice(0, 4), fara = Math.max(0.5, Math.min(1.4, (sure - t0 - 1) / Math.max(1, fa.length)));
        fa.forEach(function (a, k) { var d = el('div', { class: 'an-fadim' + (k === fa.length - 1 ? ' son' : ''), text: String(a) }); fk.appendChild(d); G.set(d, { opacity: 0 });
          tl.fromTo(d, { opacity: 0, x: -20 }, { opacity: 1, x: 0, duration: 0.4, ease: 'power3.out' }, t0 + 0.7 + k * fara); });
        return;
      }
      if (g.tip === 'molekul') {
        var mw = kl(sayi(g.g, 0.8)), mh = kl(sayi(g.y2, 0.5)), E2 = D;
        var mk = el('div', { class: 'an-molekul', style: 'left:' + px(g.x) + ';top:' + px(g.y) + ';width:' + mw * 100 + '%;height:' + mh * 100 + '%' }), mt = el('div', { style: 'position:absolute;inset:0' }), ma = el('small');
        mk.appendChild(mt); mk.appendChild(ma); katman.appendChild(mk); G.set(mk, { opacity: 0 });
        tl.fromTo(mk, { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(1.5)', onStart: function () { if (mk.dataset.b) return; mk.dataset.b = 1; molekulKur(mt, ma, g, E2); } }, t0);
        if (g.etiket) { var mle = el('div', { class: 'an-o an-etiket', style: 'left:' + px(g.x) + ';top:calc(' + px(sayi(g.y, 0.5) - mh / 2) + ' - 14px)' }, [g.etiket]); katman.appendChild(mle); G.set(mle, { opacity: 0 }); tl.to(mle, { opacity: 1, duration: 0.4 }, t0 + 0.4); }
        return;
      }
      if (g.tip === 'zincir') {
        var adim = (g.adimlar || []).slice(0, 6).map(String); if (!adim.length) return;
        var zk = el('div', { class: 'an-zincir', style: 'top:' + px(sayi(g.y, 0.12)) }), ara = Math.max(0.35, Math.min(1.4, (sure - t0 - 0.8) / adim.length));
        adim.forEach(function (a, k) {
          if (k) { var ok = el('div', { class: 'an-zok', style: 'color:' + r }, ['↓']); zk.appendChild(ok); G.set(ok, { opacity: 0 }); tl.to(ok, { opacity: 1, duration: 0.2 }, t0 + k * ara - 0.15); }
          var kt = el('div', { class: 'an-zadim', style: '--r:' + r }, [a]); zk.appendChild(kt); G.set(kt, { opacity: 0 });
          tl.fromTo(kt, { opacity: 0, y: 14, scale: 0.92 }, { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: 'back.out(2)' }, t0 + k * ara);
          tl.fromTo(kt, { boxShadow: '0 0 0 1px ' + r + ',0 0 34px ' + r }, { boxShadow: '0 0 0 1px ' + r + ',0 0 0px ' + r, duration: 0.8 }, t0 + k * ara + 0.2);
        });
        katman.appendChild(zk); return;
      }
      if (g.tip === 'karsilastir') {
        var sol = g.sol || {}, sag = g.sag || {}, ck = el('div', { class: 'an-kars', style: 'top:' + px(sayi(g.y, 0.1)) });
        var aral = Math.max(0.3, (sure - t0 - 1) / Math.max(1, Math.max((sol.maddeler || []).length, (sag.maddeler || []).length)));
        [[sol, 'teal'], [sag, 'sari']].forEach(function (yz, k) {
          var c = renk(yz[0].renk || yz[1]), kol = el('div', { class: 'an-kkol', style: '--r:' + c }, [el('h5', { text: yz[0].baslik || '' })]);
          (yz[0].maddeler || []).slice(0, 5).forEach(function (m, j) { var li = el('div', { class: 'an-kmadde', text: m }); kol.appendChild(li); G.set(li, { opacity: 0 }); tl.fromTo(li, { opacity: 0, x: k ? 20 : -20 }, { opacity: 1, x: 0, duration: 0.35 }, t0 + 0.5 + j * aral + k * 0.15); });
          ck.appendChild(kol); if (!k) ck.appendChild(el('div', { class: 'an-vs', text: 'VS' }));
        });
        katman.appendChild(ck); G.set(ck, { opacity: 0 }); tl.fromTo(ck, { opacity: 0, scale: 0.94 }, { opacity: 1, scale: 1, duration: 0.45 }, t0); return;
      }
      if (g.tip === 'yazi' || g.tip === 'etiket' || g.tip === 'ikon' || g.tip === 'sayac') {
        var cls = g.tip === 'yazi' ? 'an-yazi' : g.tip === 'etiket' ? 'an-etiket' : g.tip === 'ikon' ? 'an-ikon' : 'an-sayac';
        var ikIcerik = g.tip === 'ikon' ? ((g.ad && U.ikonYol && U.ikonYol(g.ad)) ? U.ikon(g.ad) : (g.emoji && U.emojiIkon && U.emojiIkon(g.emoji)) ? U.ikon(U.emojiIkon(g.emoji)) : (g.emoji || '◆')) : null;
        e = el('div', { class: 'an-o ' + cls + (acik ? ' an-tikla' : ''), style: 'left:' + px(g.x) + ';top:' + px(g.y) + ';--b:' + b + ((g.tip === 'etiket' || g.tip === 'yazi' || g.tip === 'ikon') && g.renk ? ';color:' + r : '') }, [g.tip === 'ikon' ? ikIcerik : g.tip === 'sayac' ? String(g.bas || 0) + (g.birim ? ' ' + g.birim : '') : String(g.metin || '')]);
        katman.appendChild(e); G.set(e, { opacity: 0 });
        var giris = g.giris || (g.tip === 'ikon' ? 'buyu' : g.tip === 'yazi' ? 'patla' : 'belir');
        if (giris === 'buyu') tl.fromTo(e, { opacity: 0, scale: 0.2, rotation: -12 }, { opacity: 1, scale: 1, rotation: 0, duration: 0.6, ease: 'back.out(2.4)' }, t0);
        else if (giris === 'uc') tl.fromTo(e, { opacity: 0, x: -160 }, { opacity: 1, x: 0, duration: 0.6, ease: 'power3.out' }, t0);
        else if (giris === 'yaz' && g.tip === 'yazi') { var m = String(g.metin || ''); e.textContent = ''; var pr = { n: 0 }; tl.set(e, { opacity: 1 }, t0); tl.to(pr, { n: m.length, duration: Math.min(1.2, m.length * 0.03), ease: 'none', onUpdate: function () { e.textContent = m.slice(0, Math.round(pr.n)); } }, t0); }
        else if (giris === 'patla') tl.fromTo(e, { opacity: 0, scale: 1.6, filter: 'blur(10px)' }, { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 0.45, ease: 'power4.out' }, t0);
        else tl.fromTo(e, { opacity: 0, y: 18, filter: 'blur(6px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.5, ease: 'power2.out' }, t0);
        if (g.tip === 'sayac') { var c = { v: sayi(g.bas, 0) }; tl.to(c, { v: sayi(g.son, 100), duration: sayi(g.sure, 2), ease: 'power2.inOut', onUpdate: function () { e.textContent = Math.round(c.v) + (g.birim ? ' ' + g.birim : ''); } }, t0 + 0.3); }
        (g.hareket || []).slice(0, 4).forEach(function (h) { tl.to(e, { left: px(h.x), top: px(h.y), duration: sayi(h.sure, 1), ease: 'power2.inOut' }, Math.max(t0 + 0.5, sayi(h.t, t0 + 1))); });
        if (g.nabiz) tl.to(e, { scale: 1.14, duration: 0.32, yoyo: true, repeat: Math.ceil(sure / 0.64), ease: 'sine.inOut' }, t0 + 0.6);
      } else if (g.tip === 'sekil') {
        var x = kl(sayi(g.x, 0.5)) * 1000, y = kl(sayi(g.y, 0.5)) * 1000, sw = kl(sayi(g.g, 0.2)) * 1000, sh = kl(sayi(g.y2, g.g || 0.2)) * 1000, sk = g.sekil || 'daire';
        if (sk === 'daire' || sk === 'hucre') e = svgEl('ellipse', { cx: x, cy: y, rx: sw / 2, ry: sh / 2 });
        else if (sk === 'altigen') { var pts = []; for (var k = 0; k < 6; k++) { var a = Math.PI / 6 + k * Math.PI / 3; pts.push((x + Math.cos(a) * sw / 2).toFixed(0) + ',' + (y + Math.sin(a) * sh / 2).toFixed(0)); } e = svgEl('polygon', { points: pts.join(' ') }); }
        else if (sk === 'kanal') { e = svgEl('rect', { x: x - sw / 2, y: y - sh / 2, width: sw, height: sh, rx: 6 }); svgEl('line', { x1: x, y1: y - sh / 2, x2: x, y2: y + sh / 2, stroke: r, 'stroke-width': 2, 'stroke-dasharray': '6 5', opacity: 0.6 }); }
        else if (sk === 'zar') e = svgEl('rect', { x: x - sw / 2, y: y - 14, width: sw, height: 28, rx: 14 });
        else e = svgEl('rect', { x: x - sw / 2, y: y - sh / 2, width: sw, height: sh, rx: 18 });
        e.setAttribute('fill', r); e.setAttribute('fill-opacity', sk === 'hucre' ? 0.08 : 0.14); e.setAttribute('stroke', r); e.setAttribute('stroke-width', 3); e.style.filter = 'drop-shadow(0 0 8px ' + r + ')';
        G.set(e, { opacity: 0, transformOrigin: '50% 50%' }); tl.fromTo(e, { opacity: 0, scale: 0.5 }, { opacity: 1, scale: 1, duration: 0.55, ease: 'back.out(1.8)' }, t0);
        if (g.etiket) { var et = el('div', { class: 'an-o an-etiket', style: 'left:' + px(g.x) + ';top:calc(' + px(sayi(g.y, 0.5) + (sk === 'zar' ? 0.03 : sayi(g.y2, g.g || 0.2) / 2)) + ' + 16px)' }, [g.etiket]); katman.appendChild(et); G.set(et, { opacity: 0 }); tl.to(et, { opacity: 1, duration: 0.4 }, t0 + 0.3); }
        if (acik) { e.style.cursor = 'pointer'; e.addEventListener('click', function (ev) { ev.stopPropagation(); ipucu(acik, g.x, g.y); }); }
        e = null;
      } else if (g.tip === 'ok') {
        var x1 = kl(sayi(g.x1, 0.2)) * 1000, y1 = kl(sayi(g.y1, 0.5)) * 1000, x2 = kl(sayi(g.x2, 0.8)) * 1000, y2 = kl(sayi(g.y2, 0.5)) * 1000;
        var kv = sayi(g.kavis, 0), mx0 = (x1 + x2) / 2 - (y2 - y1) * kv, my0 = (y1 + y2) / 2 + (x2 - x1) * kv;
        var cz = svgEl('path', { d: 'M' + x1 + ' ' + y1 + ' Q' + mx0 + ' ' + my0 + ' ' + x2 + ' ' + y2, stroke: r, 'stroke-width': 5, fill: 'none', 'stroke-linecap': 'round' }), L = cz.getTotalLength ? cz.getTotalLength() : Math.hypot(x2 - x1, y2 - y1);
        cz.style.filter = 'drop-shadow(0 0 7px ' + r + ')'; cz.setAttribute('stroke-dasharray', L); cz.setAttribute('stroke-dashoffset', L);
        var an = Math.atan2(y2 - my0, x2 - mx0), uc = svgEl('path', { d: 'M' + (x2 - 24 * Math.cos(an - 0.45)) + ' ' + (y2 - 24 * Math.sin(an - 0.45)) + ' L' + x2 + ' ' + y2 + ' L' + (x2 - 24 * Math.cos(an + 0.45)) + ' ' + (y2 - 24 * Math.sin(an + 0.45)), stroke: r, 'stroke-width': 5, fill: 'none', opacity: 0 });
        tl.to(cz, { attr: { 'stroke-dashoffset': 0 }, duration: 0.55, ease: 'power2.inOut' }, t0); tl.to(uc, { opacity: 1, duration: 0.2 }, t0 + 0.5);
        if (g.etiket) { var et2 = el('div', { class: 'an-o an-etiket', style: 'left:' + (mx0 / 10) + '%;top:calc(' + (my0 / 10) + '% - 18px)' }, [g.etiket]); katman.appendChild(et2); G.set(et2, { opacity: 0 }); tl.to(et2, { opacity: 1, duration: 0.4 }, t0 + 0.45); }
      } else if (g.tip === 'akis') {
        var yol = (g.yol || []).filter(function (p) { return Array.isArray(p) && p.length === 2; }).slice(0, 8).map(function (p) { return [kl(sayi(p[0], 0.5)), kl(sayi(p[1], 0.5))]; });
        if (yol.length < 2) return;
        var adet = Math.max(1, Math.min(14, sayi(g.adet, 7))), dur = sayi(g.sure, 2);
        for (var q = 0; q < adet; q++) (function (q) {
          var p = el('div', { class: 'an-o an-etiket', style: 'color:' + r + ';font-size:calc(var(--b,1) * 18px);left:' + yol[0][0] * 100 + '%;top:' + yol[0][1] * 100 + '%' }, [g.etiket || '●']); katman.appendChild(p); G.set(p, { opacity: 0 });
          var pr2 = { f: 0 };
          tl.to(pr2, { f: 1, duration: dur, ease: 'none', repeat: Math.max(0, Math.floor((sure - t0) / dur) - 1), onStart: function () { p.style.opacity = 1; }, onUpdate: function () { var s2 = pr2.f * (yol.length - 1), k2 = Math.min(yol.length - 2, Math.floor(s2)), f2 = s2 - k2; p.style.left = (yol[k2][0] + (yol[k2 + 1][0] - yol[k2][0]) * f2) * 100 + '%'; p.style.top = (yol[k2][1] + (yol[k2 + 1][1] - yol[k2][1]) * f2) * 100 + '%'; } }, t0 + q * dur / adet);
        })(q);
      } else if (g.tip === 'grafik') {
        grafikKur(g, t0, r, katman);
      } else if (g.tip === 'vurgu' || g.tip === 'cizik') {
        var hd = D.kayit[g.hedef]; if (!hd) return;
        if (g.tip === 'vurgu') { var hl = el('div', { class: 'an-o', style: 'left:' + hd.style.left + ';top:' + hd.style.top + ';width:140px;height:140px;border-radius:50%;box-shadow:0 0 0 4px ' + r + ',0 0 34px ' + r + ';pointer-events:none' }); katman.appendChild(hl); G.set(hl, { opacity: 0, scale: 1.8 }); tl.to(hl, { opacity: 1, scale: 1, duration: 0.45, ease: 'back.out(2)' }, t0); tl.to(hl, { scale: 1.15, duration: 0.35, yoyo: true, repeat: 3 }, t0 + 0.45); }
        else tl.to(hd, { textDecoration: 'line-through', color: '#ff7a7a', opacity: 0.6, duration: 0.3 }, t0);
      }
      if (e) { if (g.id) D.kayit[g.id] = e; if (acik) e.addEventListener('click', function (ev) { ev.stopPropagation(); ipucu(acik, g.x, g.y); }); }
    }
    // gerçek grafik: eksen değerleri, yumuşak eğri, eşik çizgisi, nokta ilerlerken anlık değer okunur
    function grafikKur(g, t0, r, katman) {
      var gx = kl(sayi(g.x, 0.1)) * 1000, gy = kl(sayi(g.y, 0.26)) * 1000, gg = kl(sayi(g.g, 0.8)) * 1000, gh = kl(sayi(g.y2, 0.42)) * 1000;
      var nk = (g.noktalar || []).filter(function (p) { return Array.isArray(p) && p.length === 2 && isFinite(+p[0]) && isFinite(+p[1]); }).sort(function (a, b) { return a[0] - b[0]; });
      if (nk.length < 2) return;
      var ys = nk.map(function (p) { return +p[1]; }); if (g.esik && isFinite(+g.esik.deger)) ys.push(+g.esik.deger);
      var mn = Math.min.apply(null, ys), mx = Math.max.apply(null, ys), pay = (mx - mn) * 0.08 || 1; mn -= pay; mx += pay; var rng = mx - mn;
      var xs = nk.map(function (p) { return +p[0]; }), x0 = Math.min.apply(null, xs), x1 = Math.max.apply(null, xs), xr = (x1 - x0) || 1;
      function X(v) { return gx + (v - x0) / xr * gg; } function Yy(v) { return gy + gh - (v - mn) / rng * gh; }
      var gid = 'anG' + Math.random().toString(36).slice(2, 7), df = document.createElementNS(NS, 'defs'); df.innerHTML = '<linearGradient id="' + gid + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + r + '" stop-opacity=".5"/><stop offset="1" stop-color="' + r + '" stop-opacity="0"/></linearGradient>'; D.svg.appendChild(df);
      var cerceve = [];
      for (var k = 0; k <= 4; k++) { var yy = gy + gh * k / 4; cerceve.push(svgEl('line', { x1: gx, x2: gx + gg, y1: yy, y2: yy, stroke: 'rgba(160,255,240,.13)', 'stroke-width': 1 })); }
      cerceve.push(svgEl('line', { x1: gx, x2: gx, y1: gy, y2: gy + gh, stroke: 'rgba(160,255,240,.45)', 'stroke-width': 1.5 }), svgEl('line', { x1: gx, x2: gx + gg, y1: gy + gh, y2: gy + gh, stroke: 'rgba(160,255,240,.45)', 'stroke-width': 1.5 }));
      var birim = g.birim ? ' ' + g.birim : '';
      function yuvarla(v) { return Math.abs(rng) >= 20 ? Math.round(v) : Math.round(v * 10) / 10; }
      [mx, (mx + mn) / 2, mn].forEach(function (v, k) { var t = el('div', { class: 'an-eksen', style: 'left:' + (gx / 10) + '%;top:' + (gy + gh * k / 2) / 10 + '%' }, [String(yuvarla(v))]); katman.appendChild(t); cerceve.push(t); });
      if (mn < 0 && mx > 0) cerceve.push(svgEl('line', { x1: gx, x2: gx + gg, y1: Yy(0), y2: Yy(0), stroke: 'rgba(255,255,255,.28)', 'stroke-width': 1, 'stroke-dasharray': '3 4' }));
      if (g.yEtiket || g.birim) { var ye = el('div', { class: 'an-eksen y', style: 'left:' + (gx / 10) + '%;top:calc(' + (gy / 10) + '% - 26px)' }, [String(g.yEtiket || g.birim)]); katman.appendChild(ye); cerceve.push(ye); }
      if (g.xEtiket) { var xe = el('div', { class: 'an-eksen x', style: 'left:' + ((gx + gg) / 10) + '%;top:calc(' + ((gy + gh) / 10) + '% + 10px)' }, [String(g.xEtiket)]); katman.appendChild(xe); cerceve.push(xe); }
      if (g.esik && isFinite(+g.esik.deger)) {
        var ey = Yy(+g.esik.deger), el1 = svgEl('line', { x1: gx, x2: gx + gg, y1: ey, y2: ey, stroke: renk(g.esik.renk || 'kirmizi'), 'stroke-width': 2, 'stroke-dasharray': '10 8', opacity: 0.85 });
        var et = el('div', { class: 'an-eksen', style: 'left:' + ((gx + gg) / 10) + '%;top:' + (ey / 10) + '%;color:' + renk(g.esik.renk || 'kirmizi') + ';transform:translate(-100%,-130%)' }, [(g.esik.metin || 'eşik') + ' ' + g.esik.deger + birim]); katman.appendChild(et); cerceve.push(el1, et);
      }
      cerceve.forEach(function (c) { G.set(c, { opacity: 0 }); }); tl.to(cerceve, { opacity: 1, duration: 0.4, stagger: 0.02 }, t0);
      // Catmull-Rom → Bezier yumuşak eğri (g.keskin: true ise düz çizgi)
      var P = nk.map(function (p) { return [X(+p[0]), Yy(+p[1])]; }), d = 'M' + P[0][0].toFixed(1) + ' ' + P[0][1].toFixed(1);
      for (var q = 0; q < P.length - 1; q++) {
        if (g.keskin) { d += ' L' + P[q + 1][0].toFixed(1) + ' ' + P[q + 1][1].toFixed(1); continue; }
        var p0 = P[q - 1] || P[q], p1 = P[q], p2 = P[q + 1], p3 = P[q + 2] || p2, tt = 0.18;
        var c1x = p1[0] + (p2[0] - p0[0]) * tt, c1y = p1[1] + (p2[1] - p0[1]) * tt, c2x = p2[0] - (p3[0] - p1[0]) * tt, c2y = p2[1] - (p3[1] - p1[1]) * tt;
        // taşma/ilmek olmasın: kontrol noktaları iki veri noktasının kutusunda kalır (sivri tepeler düzgün çizilir)
        var lx = Math.min(p1[0], p2[0]), hx = Math.max(p1[0], p2[0]), ly = Math.min(p1[1], p2[1]), hy = Math.max(p1[1], p2[1]);
        c1x = Math.max(lx, Math.min(hx, c1x)); c2x = Math.max(lx, Math.min(hx, c2x)); c1y = Math.max(ly, Math.min(hy, c1y)); c2y = Math.max(ly, Math.min(hy, c2y));
        d += ' C' + c1x.toFixed(1) + ' ' + c1y.toFixed(1) + ' ' + c2x.toFixed(1) + ' ' + c2y.toFixed(1) + ' ' + p2[0].toFixed(1) + ' ' + p2[1].toFixed(1);
      }
      var alan = svgEl('path', { d: d + ' L' + P[P.length - 1][0] + ' ' + (gy + gh) + ' L' + P[0][0] + ' ' + (gy + gh) + ' Z', fill: 'url(#' + gid + ')', opacity: 0, stroke: 'none' });
      var pth = svgEl('path', { d: d, stroke: r, 'stroke-width': 5, fill: 'none', 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }); pth.style.filter = 'drop-shadow(0 0 10px ' + r + ')';
      var L2 = pth.getTotalLength ? pth.getTotalLength() : 2000; pth.setAttribute('stroke-dasharray', L2); pth.setAttribute('stroke-dashoffset', L2);
      var nok = el('div', { class: 'an-o', style: 'width:18px;height:18px;border-radius:50%;background:#fff;opacity:0;box-shadow:0 0 16px ' + r + ',0 0 4px #fff;pointer-events:none' }); katman.appendChild(nok);
      var oku = el('div', { class: 'an-o an-okuma', style: 'opacity:0;color:' + r }); katman.appendChild(oku);
      var gs = sayi(g.sure, 2.6), prg = { f: 0 };
      tl.to(prg, { f: 1, duration: gs, ease: 'none', onStart: function () { nok.style.opacity = 1; oku.style.opacity = 1; }, onUpdate: function () {
        pth.setAttribute('stroke-dashoffset', L2 * (1 - prg.f));
        if (pth.getPointAtLength) { var pp = pth.getPointAtLength(L2 * prg.f); nok.style.left = pp.x / 10 + '%'; nok.style.top = pp.y / 10 + '%'; oku.style.left = pp.x / 10 + '%'; oku.style.top = 'calc(' + pp.y / 10 + '% - 30px)'; oku.textContent = yuvarla(mn + (gy + gh - pp.y) / gh * rng) + birim; }
      } }, t0 + 0.3);
      tl.to(alan, { opacity: 1, duration: 0.8 }, t0 + 0.3 + gs * 0.5);
      (g.isaretler || []).slice(0, 5).forEach(function (m) {
        var mv = isFinite(+m.x) ? +m.x : x0, fx = (mv - x0) / xr, mxp = X(mv);
        // işaretin noktası: eğrideki en yakın veri noktasının yüksekliği
        var yak = nk.reduce(function (a, b) { return Math.abs(b[0] - mv) < Math.abs(a[0] - mv) ? b : a; });
        var me = el('div', { class: 'an-o an-isaret', style: 'left:calc(' + mxp / 10 + '% + 12px);top:calc(' + Yy(+yak[1]) / 10 + '% - 30px);transform:translate(0,-50%);--r:' + renk(m.renk || 'sari') }, [m.metin || '']); katman.appendChild(me); G.set(me, { opacity: 0 });
        tl.fromTo(me, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.3 }, t0 + 0.3 + gs * kl(fx));
      });
      if (g.etiket) { var et3 = el('div', { class: 'an-o an-etiket', style: 'left:' + ((gx + gg / 2) / 10) + '%;top:calc(' + (gy / 10) + '% - 40px)' }, [g.etiket]); katman.appendChild(et3); G.set(et3, { opacity: 0 }); tl.to(et3, { opacity: 1, duration: 0.4 }, t0); }
    }
    // olasılık dağılımı: normal ya da çarpık; gölgeli alan yüzdesi sayısal integralle hesaplanır (yapay zekâ uydurmasın)
    function dagilimKur(g, t0, r, katman, sure) {
      var gx = kl(sayi(g.x, 0.08)) * 1000, gy = kl(sayi(g.y, 0.22)) * 1000, gg = kl(sayi(g.g, 0.84)) * 1000, gh = kl(sayi(g.y2, 0.4)) * 1000;
      var ort = sayi(g.ort, 0), ss = Math.max(1e-9, Math.abs(sayi(g.ss, 1))), alfa = Math.max(-1, Math.min(1, sayi(g.carpiklik, 0))) * 5, birim = g.birim ? ' ' + g.birim : '';
      function Phi(z) { var t = 1 / (1 + 0.2316419 * Math.abs(z)), d = 0.3989423 * Math.exp(-z * z / 2), p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274)))); return z > 0 ? 1 - p : p; }
      function f(x) { var z = (x - ort) / ss; return 2 * Math.exp(-z * z / 2) * Phi(alfa * z); }
      var x0 = ort - 4 * ss, x1 = ort + 4 * ss, N = 160, P = [], ymax = 0;
      for (var k = 0; k <= N; k++) { var xv = x0 + (x1 - x0) * k / N, yv = f(xv); P.push([xv, yv]); if (yv > ymax) ymax = yv; }
      function X(v) { return gx + (v - x0) / (x1 - x0) * gg; } function Yy(v) { return gy + gh - v / (ymax * 1.08) * gh; }
      var d = P.map(function (p, k) { return (k ? 'L' : 'M') + X(p[0]).toFixed(1) + ' ' + Yy(p[1]).toFixed(1); }).join(' ');
      var eksen = svgEl('line', { x1: gx, x2: gx + gg, y1: gy + gh, y2: gy + gh, stroke: 'rgba(160,255,240,.5)', 'stroke-width': 1.5 }); G.set(eksen, { opacity: 0 }); tl.to(eksen, { opacity: 1, duration: 0.3 }, t0);
      [-2, -1, 0, 1, 2].forEach(function (s) { var v = ort + s * ss; var t = el('div', { class: 'an-eksen x', style: 'left:' + X(v) / 10 + '%;top:calc(' + (gy + gh) / 10 + '% + 8px);transform:translateX(-50%)' }, [s === 0 ? (g.ortEtiket || 'μ') + '=' + (Math.round(v * 100) / 100) : (s > 0 ? '+' : '−') + Math.abs(s) + 'σ']); katman.appendChild(t); G.set(t, { opacity: 0 }); tl.to(t, { opacity: 1, duration: 0.3 }, t0 + 0.2); });
      var pth = svgEl('path', { d: d, stroke: r, 'stroke-width': 5, fill: 'none', 'stroke-linejoin': 'round' }); pth.style.filter = 'drop-shadow(0 0 10px ' + r + ')';
      var L = pth.getTotalLength ? pth.getTotalLength() : 3000; pth.setAttribute('stroke-dasharray', L); pth.setAttribute('stroke-dashoffset', L);
      var gs = sayi(g.sure, 2); tl.to(pth, { attr: { 'stroke-dashoffset': 0 }, duration: gs, ease: 'power1.inOut' }, t0 + 0.2);
      var toplamAlan = 0; for (var q = 1; q <= N; q++) toplamAlan += (P[q][1] + P[q - 1][1]) / 2 * (P[q][0] - P[q - 1][0]);
      [].concat(g.golge || []).slice(0, 2).forEach(function (gl, j) {
        if (!gl) return;
        var a = gl.bas == null ? x0 : Math.max(x0, sayi(gl.bas, x0)), b = gl.son == null ? x1 : Math.min(x1, sayi(gl.son, x1)); if (b <= a) return;
        var alan = 0, nok = [];
        P.forEach(function (p) { if (p[0] >= a && p[0] <= b) nok.push(p); });
        nok.unshift([a, f(a)]); nok.push([b, f(b)]);
        for (var q2 = 1; q2 < nok.length; q2++) alan += (nok[q2][1] + nok[q2 - 1][1]) / 2 * (nok[q2][0] - nok[q2 - 1][0]);
        var c = renk(gl.renk || (j ? 'kirmizi' : 'sari'));
        var ad = 'M' + X(a) + ' ' + (gy + gh) + ' ' + nok.map(function (p) { return 'L' + X(p[0]).toFixed(1) + ' ' + Yy(p[1]).toFixed(1); }).join(' ') + ' L' + X(b) + ' ' + (gy + gh) + ' Z';
        var ap = svgEl('path', { d: ad, fill: c, 'fill-opacity': 0.4, stroke: 'none' }); G.set(ap, { opacity: 0 });
        var ts = t0 + 0.4 + gs + j * 0.9; tl.to(ap, { opacity: 1, duration: 0.6 }, ts);
        var yuzde = alan / toplamAlan * 100, yz = (yuzde >= 1 ? yuzde.toFixed(1) : yuzde.toFixed(2)).replace('.', ',');
        var et = el('div', { class: 'an-o an-isaret', style: '--r:' + c + ';left:' + X((a + b) / 2) / 10 + '%;top:calc(' + Yy(f((a + b) / 2)) / 10 + '% - 30px)' }, [(gl.metin ? gl.metin + ' ' : '') + '%' + yz]); katman.appendChild(et); G.set(et, { opacity: 0 });
        tl.fromTo(et, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.35 }, ts + 0.3);
      });
      (g.cizgiler || []).slice(0, 4).forEach(function (cz, j) {
        var v = sayi(cz.x, ort); if (v < x0 || v > x1) return; var c = renk(cz.renk || 'beyaz');
        var ln = svgEl('line', { x1: X(v), x2: X(v), y1: gy, y2: gy + gh, stroke: c, 'stroke-width': 2, 'stroke-dasharray': '8 6' }); G.set(ln, { opacity: 0 });
        var et = el('div', { class: 'an-eksen', style: 'left:' + X(v) / 10 + '%;top:calc(' + gy / 10 + '% - 10px);transform:translate(-50%,-100%);color:' + c }, [(cz.metin || '') + ' ' + v + birim]); katman.appendChild(et); G.set(et, { opacity: 0 });
        var ts = t0 + 0.6 + gs + j * 0.5; tl.to([ln, et], { opacity: 1, duration: 0.35 }, ts);
      });
      if (g.etiket) { var e3 = el('div', { class: 'an-o an-etiket', style: 'left:' + (gx + gg / 2) / 10 + '%;top:calc(' + gy / 10 + '% - 40px)' }, [g.etiket]); katman.appendChild(e3); G.set(e3, { opacity: 0 }); tl.to(e3, { opacity: 1, duration: 0.4 }, t0); }
    }
    // dönen 3B molekül (Molekül Lab kataloğu + 3Dmol.js); sahne bitince WebGL bağlamı bırakılır
    function molekulKur(kap, atif, g, E) {
      var MOL3D = 'https://cdnjs.cloudflare.com/ajax/libs/3Dmol/2.4.2/3Dmol-min.js', v = null, dur = false;
      E.labs.push({ durdur: function () { dur = true; try { if (v) { v.spin(false); v.clear(); } var c = kap.querySelector('canvas'), gl = c && (c.getContext('webgl2') || c.getContext('webgl')); var ex = gl && gl.getExtension('WEBGL_lose_context'); if (ex) ex.loseContext(); } catch (e) {} } });
      if (!U.betik || !U.molKatalog) return;
      Promise.all([U.betik(MOL3D, function () { return !!window.$3Dmol; }), U.molKatalog()]).then(function (r) {
        if (dur) return;
        var kat = r[1].molekuller || r[1], id = String(g.id || g.molekul || '').toLowerCase();
        var m = kat.filter(function (x) { return x.id === id; })[0] || kat.filter(function (x) { return (x.ad || '').toLowerCase().indexOf(id) >= 0; })[0];
        if (!m) { kap.parentNode.remove(); return; }
        return fetch('lab/molekul/' + m.dosya).then(function (x) { return x.text(); }).then(function (veri) {
          if (dur) return;
          v = window.$3Dmol.createViewer(kap, { backgroundColor: 'black', backgroundAlpha: 0, antialias: true });
          v.addModel(veri, m.bicim);
          var st = g.stil || (m.bicim === 'pdb' ? 'cartoon' : 'cubuk');
          if (st === 'cartoon') { v.setStyle({}, { cartoon: { color: 'spectrum' } }); v.setStyle({ hetflag: true }, { stick: { radius: 0.2 } }); v.setStyle({ resn: 'HOH' }, {}); }
          else if (st === 'kure') v.setStyle({}, { sphere: { scale: 0.9 } });
          else v.setStyle({}, { stick: { radius: 0.18 }, sphere: { scale: 0.22 } });
          v.zoomTo(); v.zoom(0.9); v.render(); v.spin('y', 0.6);
          atif.textContent = m.ad + ' · ' + (m.kaynak ? m.kaynak.ad + ' · ' + m.kaynak.lisans : '') + ' · 3Dmol.js';
        });
      }).catch(function () { try { kap.parentNode.remove(); } catch (e) {} });
    }
    function soruKur(s, benim) {
      var kutu = el('div', { class: 'an-soru' }, [el('h4', { text: s.soru })]), cevaplandi = false, dogru = Math.max(0, Math.min(4, +s.dogru || 0));
      var halka = el('div', { class: 'an-geri' }, [el('i')]); kutu.appendChild(halka);
      konus(s.soru);
      var btn = s.siklar.slice(0, 5).map(function (sk, k) {
        var b = el('button', { type: 'button', text: 'ABCDE'[k] + ') ' + sk });
        b.addEventListener('click', function (ev) { ev.stopPropagation(); cevapla(k); });
        kutu.appendChild(b); return b;
      });
      function cevapla(k) {
        if (cevaplandi || benim !== kusak) return; cevaplandi = true; if (soruZaman) { soruZaman.kill(); soruZaman = null; } halka.style.visibility = 'hidden';
        var ok = k === dogru;
        if (k >= 0) btn[k].classList.add(ok ? 'dogru' : 'yanlis'); if (!ok && btn[dogru]) btn[dogru].classList.add('dogru');
        kutu.appendChild(el('p', { text: (k < 0 ? '⏱ Süre doldu. ' : ok ? '✓ ' : '✗ ') + (s.aciklama || '') }));
        if (k >= 0 && o.cevap) o.cevap(ok, s);
        if (k >= 0) G.fromTo(btn[k], { scale: 1.06 }, { scale: 1, duration: 0.4, ease: 'back.out(3)' });
        sus(); konus((k < 0 ? 'Doğrusu ' + 'ABCDE'[dogru] + '. ' : ok ? 'Doğru. ' : 'Hayır. ') + (s.aciklama || ''));
        var bekle = new Promise(function (r2) { setTimeout(r2, 2600); });
        bekle.then(function () { sahneBitti(benim); });
      }
      D.k.appendChild(kutu); ilerleme(0.3);
      G.from(kutu.children, { opacity: 0, y: 20, stagger: 0.08, duration: 0.35 });
      // kendiliğinden akar: 10 sn içinde cevap gelmezse doğru şık gösterilir ve video sürer
      var zf = { f: 0 };
      soruZaman = G.to(zf, { f: 1, duration: 10, ease: 'none', onUpdate: function () { halka.firstChild.style.width = (100 - zf.f * 100) + '%'; ilerleme(0.3 + zf.f * 0.5); }, onComplete: function () { cevapla(-1); } });
      if (durdu) soruZaman.pause();
    }
    function git(k, dogal) {
      if (k < 0) k = 0;
      if (k >= sahneler.length) { bitti = true; ilerleme(1); if (o.bitti) o.bitti(); return; }
      if (!dogal) sus();
      i = k; sahneKur(sahneler[i]);
    }
    function durdur(v) {
      durdu = v; if (tl) { if (v) tl.pause(); else tl.play(); } if (soruZaman) { if (v) soruZaman.pause(); else soruZaman.play(); }
      if (v) sus();
      var dd = kok.querySelector('.an-durdu'); if (v && !dd) kok.appendChild(el('div', { class: 'an-durdu', text: '❚❚' })); if (!v && dd) dd.remove();
      if (!v && tl && tl.progress() >= 1) sahneBitti(kusak);
    }
    cubuk.addEventListener('click', function (e) {
      e.stopPropagation(); var r = cubuk.getBoundingClientRect(), f = (e.clientX - r.left) / r.width * toplam, k = 0, s = 0;
      while (k < sureler.length - 1 && s + sureler[k] < f) { s += sureler[k]; k++; }
      durdu = false; var dd = kok.querySelector('.an-durdu'); if (dd) dd.remove(); git(k);
    });
    kok.addEventListener('click', function (e) {
      if (e.target.closest('button, .an-tikla, .an-cubuk, [data-org]')) return;
      var r = kok.getBoundingClientRect(), fx = (e.clientX - r.left) / r.width;
      if (fx < 0.18) { durdu = false; var d1 = kok.querySelector('.an-durdu'); if (d1) d1.remove(); git(i - 1); }
      else if (fx > 0.82) { durdu = false; var d2 = kok.querySelector('.an-durdu'); if (d2) d2.remove(); git(i + 1); }
      else durdur(!durdu);
    });
    function kare(t) { raf = requestAnimationFrame(kare); if (!kok.isConnected) return cancelAnimationFrame(raf); if (arkaCiz && !document.hidden) arkaCiz(t); }
    raf = requestAnimationFrame(kare);
    this.basla = function () { durdu = false; bitti = false; git(0); };
    this.durdur = function () { durdur(true); };
    this.surdur = function () { durdur(false); };
    this.yoket = function () { kusak++; if (tl) tl.kill(); if (soruZaman) soruZaman.kill(); if (D) D.labs.forEach(function (l) { try { l.durdur(); } catch (e) {} }); cancelAnimationFrame(raf); sus(); kok.remove(); };
    this.bittiMi = function () { return bitti; };
    this.toplamSure = function () { return toplam; };
  }
  U.semaBul = semaBul;
  U.Animasyon = { Oynatici: Oynatici, semaBul: semaBul, hazir: function () { return !!window.gsap; }, organlar: function () { return Object.keys(ORGAN); }, duzelt: duzelt, onYukle: onYukle, gorselBul: gorselBul, sure: function (j) { return (j.sahneler || []).reduce(function (a, s) { return a + (s ? sahneSuresi(s) : 0); }, 0); } };

  /* ---------- yapay zekâya verilecek senaryo kuralları ---------- */
  var DERS_REHBER = {
    anatomi: 'ANATOMİ: vucut + kamera zoom ve gorsel (ders kitabı şeması) ağırlıklı; kas/sinir/damar seyri için akis ve ok; klinik: hangi yaralanmada ne olur.',
    biyokimya: 'BİYOKİMYA: molekul (dönen 3B yapı) + zincir (yolak adımları, enzim adları, ATP/NADH sayıları) + lab (glikoliz, krebs, hemoglobin-o2, dna-replikasyonu, transkripsiyon, ribozom) + grafik (Michaelis-Menten: [S]→v, Km, Vmax; O₂ dissosiyasyon eğrisi); formul ile Km/Vmax/ΔG; klinik: enzim eksikliği hastalıkları.',
    biyoistatistik: 'BİYOİSTATİSTİK: her kavramı bir KLİNİK ÇALIŞMA örneğiyle anlat (ör. yeni tanı testi, ilaç denemesi). HER REEL\'DE "HANGİ TEST/YÖNTEM, NEDEN?" sahnesi ZORUNLU: karar öğesiyle (veri türü → dağılım → grup sayısı → bağımsız/eşleştirilmiş …) o örnekte hangi testin neden seçildiğini göster; bir sahnede de "şu olsaydı hangi test?" diye koşulu değiştirip alternatif testi (ör. normal değilse Mann-Whitney U, 3+ grup ANOVA/Kruskal-Wallis, kategorik ki-kare/Fisher, eşleştirilmiş t/Wilcoxon, korelasyon Pearson/Spearman, sağkalım log-rank/Cox) anlat. Soru sahnelerinden biri mutlaka "bu durumda hangi test?" olsun. dagilim (normal eğri, ±σ, p değeri / güven aralığı alanı gölgeli), tablo (2×2: DP/YP/YN/DN, vurgu ile hücreleri yak), formul (duyarlılık, özgüllük, PPV, NNT, OR/RR adım adım sayıyla), grafik (ROC, saçılım-regresyon). gorsel: istatistik ders kitabı şeması. Sayılar tutarlı olsun (formuldeki hesap tablodaki sayılarla birebir).',
    biyofizik: 'BİYOFİZİK: formul (Nernst, Goldman, Ohm V=IR, Poiseuille, Fick, Laplace) sayılarla adım adım + grafik (gerçek eğri: akım-voltaj, basınç-hacim, logaritmik bozunma) + lab (aksiyon-potansiyeli, na-k-pompasi, saltatorik) + vucut (fizik ilkesinin vücuttaki yeri: damar, kulak, göz, akciğer); gorsel: fizik ders kitabı şeması (ör. "ultrasound", "MRI", "eye lens", "Poiseuille flow").'
  };
  U.Animasyon.dersRehberi = function (ders) { return DERS_REHBER[ders] || ''; };
  U.Animasyon.senaryoKurali = function () {
    var lab = U.hucreSurecleri ? U.hucreSurecleri().map(function (x) { return x.id + ' (' + x.ad + ')'; }).join('; ') : '';
    return [
      'BU TEK PARÇA AKAN BİR VİDEO (reels), slayt değil: sahneler birbirine akar; bir sahnede kurulan görüntü (özellikle vücut) sonraki sahnede kamera hareketiyle sürer. Ekran dikey; koordinatlar 0..1 (x sağa, y aşağı). Alt %22 altyazıya ayrılmış: oraya öğe koyma. Öğeleri üst üste bindirme.',
      'TEK HİKÂYE (en önemli kural): reel TEK bir merkezî soruyu cevaplar (ör. "Glikojen nasıl yapılır?"). Her sahne bir öncekinin doğurduğu soruyla başlar ("Peki bu neden önemli?", "Ya bu olmasaydı?"). Birbirinden kopuk bilgi sıralama; kitaptaki en önemli TEK mekanizmayı derinlemesine anlat.',
      'GÖREMEDİĞİNİ GÖSTER: önce olayın kendisini canlandır (lab simülasyonu, vücutta zoom, akis/molekul animasyonu), sonra açıkla, sonra grafikle kanıtla.',
      'ANLATICI Patrick Jane (The Mentalist): sakin, kendinden emin, muzip; izleyicinin aklından geçeni okur ("Herkes … sanır. Değil.", "Şimdi bak…", "İşin hilesi şu:"). Her sahnede 1-2 kısa cümle (en çok 24 kelime). Sahnedeki görüntüyü ANLAT ("şu sarı eğri…", "kalbin sol tarafına bak").',
      'YAZI AZ, GÖRÜNTÜ ÇOK: ekrana yazı yalnız kancada ve en önemli 1-2 terimde (en çok 5 kelime). Bilgiyi anlatım + animasyon taşır. Her sahnede EN AZ BİR görsel öğe (vucut, lab, gorsel, grafik, zincir, karsilastir, akis, sekil) olsun.',
      '"sahneler": 9-13 sahne, her biri 3.5-6 sn. Sahne: {"anlatim":"…","sure":4.5,"arka":"vucut|hucre|kan|beyin|kalp|uzay|koridor","gecis":"dal|kaydir|parla","ogeler":[…],"kamera":[{"hedef":"organ ya da {x,y}","zoom":1.5-4,"t":0.6,"sure":1.3,"not":"zoomdan sonra çıkan 1 kısa cümle: organ burada ne yapıyor"}],"kameraSifirla":saniye,"aciklamalar":{"ogeId":"dokununca çıkan 1 cümle"}}',
      'Öğeler (her birinde "id" ve "t" = sahne içinde başlama saniyesi):',
      ' {"tip":"vucut","odak":["kalp"],"renk":"kirmizi"} — holografik insan vücudu; odak organ parlar ve etiketlenir. Arka arkaya iki sahnede vucut kullanırsan aynı vücut kalır, kamera kaldığı yerden devam eder (kesintisiz). Organlar: ' + Object.keys(ORGAN).join(', ') + '.',
      ' {"tip":"lab","surec":"…","x":0.5,"y":0.4,"g":0.9,"y2":0.5,"etiket":"kısa"} — hücre düzeyi CANLI simülasyon. Süreçler: ' + lab,
      ' {"tip":"gorsel","ara":"2-4 İngilizce anatomi/fizyoloji ders kitabı terimi (ör. \'nephron\', \'cardiac muscle action potential\', \'brachial plexus\', \'humerus\', \'synapse\')","x":0.5,"y":0.46,"g":0.92,"y2":0.56,"etiket":"kısa"} — GERÇEK ders kitabı şeması (gömülü OpenStax kütüphanesi), yavaşça yakınlaşır. HER REEL\'DE EN AZ 2 SAHNEDE kullan (anatomide 3); terimleri ders kitabı figür başlığı gibi yaz.',
      ' {"tip":"wiki","baslik":"Vikipedi sayfa adı (Türkçe varsa Türkçe; ör. \'Uridin difosfat glukoz\', \'Glikojen\')","dil":"tr|en","x":0.5,"y":0.44,"g":0.9,"y2":0.56} — gerçek Vikipedi kartı (görsel + ilk cümle). Her reel\'de 1 kez, kavram ilk kez tanıtılırken.',
      ' {"tip":"grafik","noktalar":[[0,-70],[1,-70],[1.5,30],[3,-80],[5,-70]],"birim":"mV","xEtiket":"ms","esik":{"deger":-55,"metin":"eşik"},"isaretler":[{"x":1.5,"metin":"tepe +30"}],"x":0.12,"y":0.2,"g":0.8,"y2":0.44,"renk":"sari","sure":2.6} — gerçek veri noktaları (x gerçek birim, y gerçek değer); eksenler, eşik çizgisi ve anlık değer otomatik çizilir.',
      ' {"tip":"karar","adimlar":[{"soru":"Veri türü?","secenekler":["Sürekli","Kategorik"],"secilen":0},{"soru":"Normal dağılıyor mu?","secenekler":["Evet","Hayır"],"secilen":0},{"soru":"Kaç grup?","secenekler":["2","3+"],"secilen":0},{"soru":"Gruplar?","secenekler":["Bağımsız","Eşleştirilmiş"],"secilen":0}],"sonuc":"Bağımsız örneklem t-testi","neden":"iki bağımsız grubun ortalaması, normal dağılım","y":0.06,"renk":"sari"} — karar ağacı: hangi yöntem/test NEDEN seçilir; seçilen yol adım adım yanar.',
      ' {"tip":"dagilim","ort":120,"ss":15,"carpiklik":0,"birim":"mmHg","golge":[{"bas":150,"son":null,"metin":"hipertansif","renk":"kirmizi"}],"cizgiler":[{"x":150,"metin":"sınır"}],"y":0.2,"y2":0.4,"etiket":".."} — dağılım eğrisi; gölgeli alanın yüzdesi otomatik hesaplanır (sen yüzde yazma).',
      ' {"tip":"tablo","satirlar":[["","Hasta","Sağlam"],["Test +","90","30"],["Test −","10","170"]],"vurgu":[[1,1,"yesil"],[2,1,"kirmizi"]],"y":0.12} — küçük tablo (2×2 vb.), hücreler sırayla belirir, vurgu hücreleri yanar.',
      ' {"tip":"formul","metin":"Duyarlılık = DP / (DP + YN)","adimlar":["= 90 / (90 + 10)","= %90"],"y":0.5,"renk":"sari"} — formül ve sayılarla adım adım çözüm.',
      ' {"tip":"molekul","id":"atp","stil":"cubuk|kure|cartoon","x":0.5,"y":0.42,"g":0.8,"y2":0.5,"etiket":"ATP"} — dönen 3B molekül. Mevcut: glukoz, fruktoz, galaktoz, riboz, deoksiriboz, sukroz, laktoz, maltoz, palmitik, oleik, linoleik, arasidonik, tripalmitin, fosfatidilkolin, kolesterol, glisin, histidin, sistein, triptofan, prolin, glisilglisin, atp, adenin, guanin, sitozin, timin, urasil, hemoglobin, miyoglobin, dna, kollajen, albumin.',
      ' {"tip":"zincir","adimlar":["Na⁺ kanalı açılır","Na⁺ içeri","Depolarizasyon","K⁺ çıkar"],"y":0.1,"renk":"teal"} — neden→sonuç zinciri, adım adım belirir (mekanizmalar için en iyisi).',
      ' {"tip":"karsilastir","sol":{"baslik":"…","maddeler":["…"]},"sag":{"baslik":"…","maddeler":["…"]},"y":0.1} — karıştırılan iki kavram yan yana (ayırt etme).',
      ' {"tip":"yazi","metin":"en çok 5 kelime","x":0.5,"y":0.14,"giris":"patla|yaz|uc|belir"} · {"tip":"ikon","ad":"holografik çizgi ikon adı","renk":"..","x":..,"y":..,"boyut":1-2.8,"nabiz":true,"hareket":[{"x":..,"y":..,"t":..,"sure":1}]} — EMOJİ KULLANMA; ikon adları: ' + (U.IKONLAR ? Object.keys(U.IKONLAR).join(', ') : 'kalp, beyin, molekul') + '.',
      ' {"tip":"sayac","x":..,"y":..,"bas":-70,"son":30,"birim":"mV","sure":2} · {"tip":"akis","yol":[[x,y],…],"etiket":"Na⁺","adet":5-10,"renk":"yesil","sure":1.8} · {"tip":"ok","x1":..,"y1":..,"x2":..,"y2":..,"kavis":0.2,"etiket":".."}',
      ' {"tip":"sekil","sekil":"hucre|daire|kutu|altigen|kanal|zar","x":..,"y":..,"g":..,"y2":..,"renk":"..","etiket":".."} · {"tip":"etiket","metin":"..","x":..,"y":..} · {"tip":"vurgu","hedef":"id"} · {"tip":"cizik","hedef":"yanlış yazının id\'si"}',
      'Renkler: teal, sari, mor, kirmizi, yesil, mavi, turuncu, beyaz. Ortaya (5.-6. sahne) ve sona birer SORU sahnesi: {"tip":"soru","soru":"…","siklar":["…","…","…","…"],"dogru":0,"aciklama":"Jane tarzı kısa açıklama"} — video beklemez; 10 sn içinde cevap gelmezse doğrusu gösterilir.',
      'ÖRNEK AKIŞ (kalp konusu için, kısaltılmış): [{"anlatim":"Herkes kalbin beyinden emir beklediğini sanır. Değil.","arka":"kalp","ogeler":[{"id":"y","tip":"yazi","metin":"Kalbi kim ateşler?","x":0.5,"y":0.16,"t":0},{"id":"i","tip":"ikon","ad":"kalp","renk":"kirmizi","x":0.5,"y":0.48,"boyut":2.6,"nabiz":true,"t":0.4}]},' +
        '{"anlatim":"Göğsün ortasına, biraz sola in. Şuradaki küçük düğüm: SA nod.","arka":"vucut","gecis":"dal","ogeler":[{"id":"v","tip":"vucut","odak":["kalp"],"t":0}],"kamera":[{"hedef":"kalp","zoom":3.2,"t":1,"sure":1.4,"not":"Sağ atriyumda doğal pil: dakikada 60-100 uyarı"}]},' +
        '{"anlatim":"Şimdi hücreye gir. Kalsiyum içeri dolar, plato bu yüzden uzun.","arka":"hucre","ogeler":[{"id":"l","tip":"lab","surec":"kalp-ap","x":0.5,"y":0.4,"g":0.92,"y2":0.52,"etiket":"ventrikül kas hücresi","t":0.2}]},' +
        '{"anlatim":"Grafiğe bak: hızlı yükseliş, uzun plato, iniş.","arka":"kalp","ogeler":[{"id":"g","tip":"grafik","noktalar":[[0,-90],[5,20],[20,5],[200,-5],[280,-90],[320,-90]],"birim":"mV","xEtiket":"ms","isaretler":[{"x":5,"metin":"faz 0"},{"x":120,"metin":"plato"}],"t":0.2,"sure":2.8}]}, …]'
    ].join('\n');
  };
  U.Animasyon.SENARYO_KURALI = '';
  try { Object.defineProperty(U.Animasyon, 'SENARYO_KURALI', { get: function () { return U.Animasyon.senaryoKurali(); } }); } catch (e) {}
})();
