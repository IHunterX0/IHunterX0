/* 1001 — Aşama 7: Anatomi 3B (three.js + BodyParts3D iskelet), tur, sohbetle sahne kontrolü, ince işaretler (Set-of-Mark) */
(function () {
  'use strict';
  var U = window.Uygulama, A = window.KitapAyristir;
  var el = U.el, $ = U.$, $$ = U.$$, duz = U.duz, toast = U.toast, Y = U.Y, Kitaplik = U.Kitaplik, Durum = U.Durum;
  var katla = A.katla, fnv = A.fnv;
  var AZ_HAREKET = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var THREE_URL = 'https://cdn.jsdelivr.net/npm/three@0.147.0/build/three.min.js';
  var GLTF_URL = 'https://cdn.jsdelivr.net/npm/three@0.147.0/examples/js/loaders/GLTFLoader.js';
  var ORBIT_URL = 'https://cdn.jsdelivr.net/npm/three@0.147.0/examples/js/controls/OrbitControls.js';
  var KEMIK = 0xe2d8c4, VURGU = 0x4fe0ff;
  // three r147: saydamlık değişince materyal yeniden derlenmeli (OPAQUE tanımı), yoksa opaklık uygulanmaz.
  function saydam(mt, v) { if (mt.transparent !== v) { mt.transparent = v; mt.needsUpdate = true; } }
  var DURUM_AD = { derlendi: 'Derlendi (görsel kontrol)', onayli: 'Onaylı (kullanıcı)', 'ai-tutarli': 'AI: tutarlı', 'ai-belirsiz': 'AI önerisi: belirsiz' };

  // Dokunulan noktada ad etiketi: nokta nesnenin yerel uzayında tutulur, model dönünce/hareket edince etiket onu izler.
  U.labEtiket = function (tuval, kam) {
    var d = el('div', { class: 'ad-etiket', hidden: true, 'aria-live': 'polite' });
    tuval.appendChild(d);
    var nesne = null, yerel = null;
    function guncelle() {
      if (!document.body.contains(d)) return;
      requestAnimationFrame(guncelle);
      if (!nesne) return;
      var w = yerel.clone().applyMatrix4(nesne.matrixWorld).project(kam);
      var on = w.z < 1 && nesne.visible !== false;
      d.style.display = on ? '' : 'none';
      var x = (w.x + 1) / 2 * tuval.clientWidth, sag = x > tuval.clientWidth * 0.62;
      d.classList.toggle('sag', sag);
      d.style.transform = 'translate(' + x + 'px,' + ((1 - w.y) / 2 * tuval.clientHeight) + 'px) translate(' + (sag ? '-100%' : '0') + ', calc(-100% - 10px))';
    }
    requestAnimationFrame(guncelle);
    return {
      goster: function (o, nokta, ad, alt, uyari) {
        nesne = o; o.updateMatrixWorld(); yerel = o.worldToLocal(nokta.clone());
        d.innerHTML = '';
        d.appendChild(el('b', { text: ad }));
        if (alt) d.appendChild(el('small', { text: alt }));
        if (uyari) d.appendChild(el('small', { class: 'uyari', text: uyari }));
        d.hidden = false;
      },
      gizle: function () { nesne = null; d.hidden = true; }
    };
  };

  var An = { katalog: null, sahne: null };
  function anKatalog() { if (!An.katalog) An.katalog = fetch('lab/anatomi/katalog.json').then(function (r) { return r.json(); }); return An.katalog; }
  U.anKatalog = anKatalog;
  function hazirIsaretler() { if (!An.hazir) An.hazir = fetch('lab/anatomi/isaretler.json').then(function (r) { return r.ok ? r.json() : { isaretler: [] }; }).catch(function () { return { isaretler: [] }; }); return An.hazir; }

  U.GORUNUMLER['lab-anatomi'] = function (parcaId) { labAnatomi(parcaId); };
  function labAnatomi(parcaId) {
    var ana = $('#ana'); ana.innerHTML = '';
    var sayfa = el('div', { class: 'lab-sayfa' }); ana.appendChild(sayfa);
    var sahneKap = el('div', { class: 'lab-sahne' });
    var tuval = el('div', { class: 'lab-tuval', role: 'img', 'aria-label': '3B iskelet' });
    var etiketKat = el('div', { class: 'isaret-katman', 'aria-hidden': 'true' });
    sahneKap.appendChild(tuval); sahneKap.appendChild(etiketKat);
    var yan = el('aside', { class: 'lab-yan' });
    sayfa.appendChild(sahneKap); sayfa.appendChild(yan);
    var ara = el('input', { id: 'anAra', type: 'search', placeholder: 'Kemik ara: femur, kaburga, scapula…', 'aria-label': 'Kemik ara', autocomplete: 'off' });
    var oneriler = el('div', { class: 'an-oneri' });
    sahneKap.appendChild(el('div', { class: 'lab-ust' }, [el('div', { class: 'ust-etiket', text: 'Anatomi 3B · iskelet' }), el('div', { class: 'an-ara-kap' }, [ara, oneriler])]));
    var bolgeKap = el('div', { class: 'lab-stiller' });
    sahneKap.appendChild(bolgeKap);
    var durum = el('div', { class: 'lab-durum' }, [el('div', { class: 'yukleniyor', text: 'three.js yükleniyor…' })]);
    sahneKap.appendChild(durum);
    var S = { parcalar: {}, kat: {}, gruplar: {}, secili: null, isaretler: [], tasima: null, isaretMesh: [] };
    An.sahne = S; U.anSahne = S;
    var lab = new U.Lab(sahneKap, {
      tur: 'anatomi (iskelet)', ornekSoru: 'Örn. "femur boynunu göster, neden kırılgan?"',
      katalog: function () { return Object.keys(S.kat).map(function (id) { var k = S.kat[id]; return { id: id, ad: k.tr + ' (' + k.la + ')', ara: k.en }; }); },
      goster: function (id) { sec(id, true); }, kamera: function (id) { uc(id); }, isaret: function (id, et) { S.halkaHedef = id; S.halkaEtiket = et; },
      // Carvis: kemik üzerindeki ince işaret (processus coracoideus…) — bul (önbellek ya da AI) ve titreşen odak + çubuklu bilgi kartı
      secili: function () { return S.secili; },
      isaretBul: function (id, ad) { return isaretBulSoz(id, ad); },
      odak: function (id, ad, bilgi) { return odakIsaret(id, ad, bilgi); },
      sifirla: function () { secimiKaldir(); genelBakis(); }
    });
    sahneKap.appendChild(lab.hud);
    var kart = el('section', { class: 'lab-kutu lab-bilgi' }, [el('p', { class: 'var-etiket', text: 'Bir kemiğe dokun ya da ara. Döndür: sürükle · Yakınlaş: tekerlek / iki parmak.' })]);
    yan.appendChild(kart);
    yan.appendChild(el('section', { class: 'lab-kutu' }, [el('h3', { text: 'Tur' }), lab.adimListe, lab.kontrol, lab.metin]));
    var sohbetKutu = el('section', { class: 'lab-kutu ai-gerek' }, [el('h3', { text: 'Asistana yaz' })]);
    yan.appendChild(sohbetKutu);
    lab.sohbet(sohbetKutu, function () { return S.secili ? 'Seçili kemik: ' + S.kat[S.secili].tr + ' (' + S.kat[S.secili].la + ', id ' + S.secili + ').' : 'Henüz kemik seçilmedi.'; });
    var atif = el('p', { class: 'lab-atif' }); yan.appendChild(atif);

    Promise.all([anKatalog(), U.betik(THREE_URL, function () { return !!window.THREE; })]).then(function (r) {
      return Promise.all([U.betik(GLTF_URL, function () { return !!(window.THREE && THREE.GLTFLoader); }), U.betik(ORBIT_URL, function () { return !!(window.THREE && THREE.OrbitControls); })]).then(function () { return r[0]; });
    }).then(function (kat) {
      S.katJson = kat;
      kat.parcalar.forEach(function (p) { S.kat[p.id] = p; });
      atif.innerHTML = '';
      atif.appendChild(document.createTextNode(kat.kaynak + '. '));
      atif.appendChild(el('a', { href: 'https://creativecommons.org/licenses/by-sa/2.1/jp/deed.en', target: '_blank', rel: 'noopener', text: 'Lisans: CC BY-SA 2.1 JP' }));
      atif.appendChild(document.createTextNode(' — Bu modellerden türetilen içerik aynı lisansla paylaşılmalıdır (ShareAlike). Modeller sadeleştirildi ve bölgelere ayrıldı. '));
      atif.appendChild(el('a', { href: kat.url, target: '_blank', rel: 'noopener', text: 'kaynak' }));
      kur(kat);
    }).catch(function (e) { durum.innerHTML = ''; durum.appendChild(el('div', { class: 'bos hata-metni', text: '3B görüntüleyici açılamadı: ' + e.message + '. İnternet bağlantısını ya da WebGL desteğini kontrol et.' })); });

    function kur(kat) {
      var T = window.THREE;
      var r;
      try { r = new T.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true }); } catch (e) { durum.innerHTML = ''; durum.appendChild(el('div', { class: 'bos hata-metni', text: 'Bu tarayıcıda WebGL açılamadı.' })); return; }
      r.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
      r.outputEncoding = T.sRGBEncoding;
      tuval.appendChild(r.domElement);
      var sahne = new T.Scene(); sahne.background = new T.Color(0x060c11);
      var kam = new T.PerspectiveCamera(35, 1, 0.01, 50);
      kam.position.set(0, 1.0, 3.2);
      var kont = new T.OrbitControls(kam, r.domElement);
      kont.target.set(0, 0.9, 0); kont.enableDamping = !AZ_HAREKET; kont.dampingFactor = 0.12; kont.minDistance = 0.05; kont.maxDistance = 6;
      sahne.add(new T.HemisphereLight(0xdff6ff, 0x1a2228, 0.85));
      var dl = new T.DirectionalLight(0xffffff, 0.9); dl.position.set(1.5, 3, 2.5); sahne.add(dl);
      var dl2 = new T.DirectionalLight(0x88ccff, 0.35); dl2.position.set(-2, 1, -2); sahne.add(dl2);
      // HUD ızgarası (zemin)
      var izg = new T.GridHelper(2.4, 24, 0x0f5466, 0x0a2a33); izg.material.transparent = true; izg.material.opacity = 0.5; sahne.add(izg);
      S.T = T; S.r = r; S.sahne = sahne; S.kam = kam; S.kont = kont;
      function boyut() { var w = tuval.clientWidth || 600, h = tuval.clientHeight || 500; r.setSize(w, h, false); kam.aspect = w / h; kam.updateProjectionMatrix(); }
      boyut(); window.addEventListener('resize', boyut);
      var yukleyici = new T.GLTFLoader();
      var bekleyen = kat.bolgeler.length;
      durum.innerHTML = ''; durum.appendChild(el('div', { class: 'yukleniyor', text: 'İskelet yükleniyor (0/' + bekleyen + ')…' }));
      kat.bolgeler.forEach(function (b) {
        var grup = new T.Group(); grup.name = b.id; sahne.add(grup); S.gruplar[b.id] = grup;
        var c = el('button', { class: 'cip', type: 'button', 'aria-pressed': 'true' }, [b.ad]);
        c.addEventListener('click', function () { grup.visible = !grup.visible; c.setAttribute('aria-pressed', String(grup.visible)); });
        bolgeKap.appendChild(c);
        glbYukle(yukleyici, 'lab/anatomi/' + b.dosya, function (g) {
          g.scene.traverse(function (o) {
            if (!o.isMesh) return;
            var id = /^FMA\d+/.test(o.name) ? o.name.match(/^FMA\d+/)[0] : (o.parent && /^FMA\d+/.test(o.parent.name) ? o.parent.name.match(/^FMA\d+/)[0] : null);
            if (!id || !S.kat[id]) return;
            o.material = new T.MeshStandardMaterial({ color: KEMIK, roughness: 0.78, metalness: 0.02 });
            o.userData.fma = id;
            if (!o.geometry.attributes.normal) o.geometry.computeVertexNormals();
            if (o.geometry.attributes.color) o.geometry.deleteAttribute('color');
            o.geometry.computeBoundingSphere();
            S.parcalar[id] = o;
          });
          grup.add(g.scene);
          bekleyen--;
          durum.innerHTML = '';
          if (bekleyen > 0) durum.appendChild(el('div', { class: 'yukleniyor', text: 'İskelet yükleniyor (' + (kat.bolgeler.length - bekleyen) + '/' + kat.bolgeler.length + ')…' }));
          else hazir();
        }, null, function (e) { bekleyen--; toast(b.ad + ' yüklenemedi.'); });
      });
      // seçme: tıkla (sürüklemeyi ayır)
      var ray = new T.Raycaster(), fare = new T.Vector2(), bas = null;
      r.domElement.addEventListener('pointerdown', function (e) { bas = [e.clientX, e.clientY]; });
      r.domElement.addEventListener('pointerup', function (e) {
        if (!bas || Math.hypot(e.clientX - bas[0], e.clientY - bas[1]) > 6) return;
        var rc = r.domElement.getBoundingClientRect();
        fare.set(((e.clientX - rc.left) / rc.width) * 2 - 1, -((e.clientY - rc.top) / rc.height) * 2 + 1);
        ray.setFromCamera(fare, kam);
        var hed = ray.intersectObjects(Object.keys(S.parcalar).map(function (k) { return S.parcalar[k]; }).filter(function (m) { return gorunur(m); }), false);
        if (S.tasima) { if (hed.length && hed[0].object.userData.fma === S.tasima.fma) { S.tasima.bitti(hed[0].point); S.tasima = null; } else toast('İşareti kemiğin yüzeyine koy.'); return; }
        if (hed.length) {
          var fma = hed[0].object.userData.fma, kk = S.kat[fma];
          lab.duraklat(); sec(fma);
          if (kk) etiket.goster(hed[0].object, hed[0].point, kk.tr, kk.la, kk.dogrulama === 'doğrulanmadı' || kk.dogrulama === 'kitapla çelişiyor' ? 'Ad: ' + kk.dogrulama : null);
        } else etiket.gizle();
      });
      var etiket = S.etiket = U.labEtiket(tuval, kam);
      (function dongu() {
        if (!document.body.contains(r.domElement)) return;
        requestAnimationFrame(dongu);
        if (S.ucus) S.ucus();
        if (S.odakAnim) S.odakAnim();
        kont.update();
        r.render(sahne, kam);
        hudGuncelle();
      })();
    }
    // Artifact .glb sunmadığı için model base64 JSON içinde gelir; ikiliye çevirip parse edilir.
    function glbYukle(yk, url, ok, _, hata) {
      fetch(url).then(function (r) { if (!r.ok) throw new Error(r.status); return /.json$/.test(url) ? r.json() : r.arrayBuffer(); }).then(function (v) {
        var buf = v instanceof ArrayBuffer ? v : (function () { var s = atob(v.veri), u = new Uint8Array(s.length); for (var i = 0; i < s.length; i++) u[i] = s.charCodeAt(i); return u.buffer; })();
        yk.parse(buf, '', ok, hata);
      }).catch(hata);
    }
    function gorunur(m) { var o = m; while (o) { if (o.visible === false) return false; o = o.parent; } return true; }
    function merkez(id) { var m = S.parcalar[id]; if (!m) return null; var c = m.geometry.boundingSphere.center.clone(); m.localToWorld(c); return { c: c, r: m.geometry.boundingSphere.radius * m.getWorldScale(new S.T.Vector3()).x }; }
    function ekran(v) { var p = v.clone().project(S.kam); var w = S.r.domElement.clientWidth, h = S.r.domElement.clientHeight; return { x: (p.x + 1) / 2 * w, y: (1 - p.y) / 2 * h, on: p.z < 1 }; }
    function hudGuncelle() {
      var id = S.halkaHedef || S.secili;
      if (id && S.parcalar[id]) { var m = merkez(id), e = ekran(m.c); var off = tuval.offsetTop; lab.halka(e.x, e.y + off, 40, e.on); } else lab.halka(0, 0, 0, false);
      // işaret etiketleri
      // Etiket çakışması (2026-11-02): 16 etiket üst üste biniyordu. Kameraya yakın olan öncelikli; çakışan etiket gizlenir
      // (nokta kalır, üzerine gelince ad görünür). Odak açıkken diğerleri soluk, odaktaki işaretin kendi etiketi gizli.
      var kutular = [], odakAd = S.odak && S.odak.kart ? (S.odak.kart.querySelector('b') || {}).textContent : null;
      S.isaretMesh.map(function (x) { return { x: x, e: ekran(x.nokta), d: S.kam.position.distanceToSquared(x.nokta) }; }).sort(function (a, b) { return a.d - b.d; }).forEach(function (o) {
        var x = o.x, e = o.e, w = x.genislik || (x.genislik = x.el.offsetWidth || x.x.ad.length * 7 + 16), hh = 20, ust = x.el.matches(':hover');
        x.el.style.transform = 'translate(' + e.x + 'px,' + (e.y + tuval.offsetTop) + 'px)';
        var kx = e.x + 10, ky = e.y - 30, cak = kutular.some(function (k) { return kx < k[2] && kx + w > k[0] && ky < k[3] && ky + hh > k[1]; });
        var goster = e.on && !cak && x.x.ad !== odakAd;
        x.el.style.display = e.on ? '' : 'none';
        x.el.classList.toggle('gizli', !goster && !ust);
        x.el.classList.toggle('soluk', !!odakAd && !ust);
        if (x.kure) x.kure.material.opacity = odakAd ? 0.35 : 0.95;
        if (goster) kutular.push([kx, ky, kx + w, ky + hh]);
      });
      // odak işareti: noktadan çıkan çubuk + bilgi kartı
      if (S.odak) {
        var o = S.odak, e2 = ekran(o.nokta), W = tuval.clientWidth, Hh = tuval.clientHeight, off2 = tuval.offsetTop;
        var sag = e2.x < W * 0.55, kw = Math.min(300, W * 0.46);
        var kx = sag ? Math.min(W - kw - 10, e2.x + 70) : Math.max(10, e2.x - 70 - kw), ky = Math.max(10, Math.min(Hh - o.kart.offsetHeight - 10, e2.y - 110));
        o.kart.style.transform = 'translate(' + kx + 'px,' + (ky + off2) + 'px)'; o.kart.style.width = kw + 'px';
        var ux = sag ? kx : kx + kw, uy = ky + 22;
        // dirsek: noktadan 45° çıkıp yatay olarak karta
        var dy = (uy - e2.y), dx = Math.min(Math.abs(ux - e2.x) * 0.5, Math.abs(dy)) * (sag ? 1 : -1), bx = e2.x + dx, by = e2.y + (dy > 0 ? 1 : -1) * Math.abs(dx);
        o.cizgi.setAttribute('points', e2.x + ',' + (e2.y + off2) + ' ' + bx + ',' + (by + off2) + ' ' + ux + ',' + (uy + off2));
        o.uc.setAttribute('cx', e2.x); o.uc.setAttribute('cy', e2.y + off2);
        // işaret kemiğin arkasında mı? (kameradan noktaya ışın; ilk kesişim noktadan önceyse arkada) — 150 ms'de bir
        if (S.odakFma && S.parcalar[S.odakFma] && (!o._sonKontrol || performance.now() - o._sonKontrol > 150)) {
          o._sonKontrol = performance.now();
          var yon = o.nokta.clone().sub(S.kam.position), uz = yon.length(); o._ray = o._ray || new S.T.Raycaster(); o._ray.set(S.kam.position, yon.normalize());
          var hh = o._ray.intersectObject(S.parcalar[S.odakFma], false); o._arkada = !!(hh.length && hh[0].distance < uz - merkez(S.odakFma).r * 0.015);
        }
        o.svg.style.opacity = o._arkada ? '0.45' : '1'; o.cizgi.setAttribute('stroke-dasharray', o._arkada ? '3 5' : 'none');
        o.arkaEl.hidden = !o._arkada;
        o.kart.style.display = o.svg.style.display = e2.on ? '' : 'none';
      }
    }
    /* ---------- Carvis odak işareti ---------- */
    function isaretBulSoz(fma, ad) {
      if (!S.parcalar[fma]) return Promise.reject(new Error('Önce kemiği aç.'));
      var q = katla(ad);
      return tumIsaretler(fma).then(function (l) {
        var x = l.filter(function (y) { var k = katla(y.ad); return k === q || k.indexOf(q) >= 0 || q.indexOf(k) >= 0; })[0];
        if (x) return x;
        return aiIsaretBul(fma, ad, null);
      });
    }
    function odakTemizle() {
      var o = S.odak; if (!o) return;
      o.parcalar.forEach(function (m) { S.sahne.remove(m); m.geometry.dispose(); m.material.dispose(); });
      o.kart.remove(); o.svg.remove(); S.odak = null; S.odakAnim = null;
    }
    function odakIsaret(fma, ad, bilgi) {
      return isaretBulSoz(fma, ad).then(function (x) {
        odakTemizle();
        var T = S.T, m = merkez(fma), p = new T.Vector3(x.nokta[0], x.nokta[1], x.nokta[2]), boy = m.r;
        var cekirdek = new T.Mesh(new T.SphereGeometry(Math.max(0.0025, boy * 0.03), 20, 14), new T.MeshBasicMaterial({ color: 0xbff6ff, depthTest: false, transparent: true, opacity: 0.95 }));
        var hale = new T.Mesh(new T.SphereGeometry(Math.max(0.005, boy * 0.07), 24, 16), new T.MeshBasicMaterial({ color: 0x4fe0ff, depthTest: false, transparent: true, opacity: 0.35 }));
        var dalga = new T.Mesh(new T.SphereGeometry(Math.max(0.005, boy * 0.07), 24, 16), new T.MeshBasicMaterial({ color: 0x8fe8ff, depthTest: false, transparent: true, opacity: 0.5, wireframe: true }));
        [cekirdek, hale, dalga].forEach(function (k, i) { k.position.copy(p); k.renderOrder = 20 + i; S.sahne.add(k); });
        var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('class', 'odak-svg'); svg.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;overflow:visible;z-index:6';
        var cizgi = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
        cizgi.setAttribute('fill', 'none'); cizgi.setAttribute('stroke', '#7ff3ff'); cizgi.setAttribute('stroke-width', '2'); cizgi.setAttribute('stroke-linejoin', 'round');
        cizgi.style.filter = 'drop-shadow(0 0 3px rgba(79,224,255,.8))';
        var uc = document.createElementNS('http://www.w3.org/2000/svg', 'circle'); uc.setAttribute('r', '4'); uc.setAttribute('fill', '#e8fbff'); uc.setAttribute('stroke', '#4fe0ff'); uc.setAttribute('stroke-width', '2');
        svg.appendChild(cizgi); svg.appendChild(uc); sahneKap.appendChild(svg);
        var arkaEl = el('small', { hidden: true, style: 'display:block;color:#ffcf7a', text: '↻ işaret arka yüzde — döndür' });
        var kart = el('div', { class: 'odak-kart' }, [el('b', { text: x.ad }), el('p', { text: bilgi || '' }),
          el('small', { text: (DURUM_AD[x.durum] || '') + (x.durum === 'onayli' || x.durum === 'derlendi' ? '' : ' · konum yaklaşık') }), arkaEl]);
        kart.style.cssText = 'position:absolute;left:0;top:0;z-index:7;pointer-events:none;background:linear-gradient(135deg,rgba(10,44,60,.94),rgba(4,18,27,.94));border:1px solid #4fe0ff;border-radius:10px;padding:' + (tuval.clientWidth < 600 ? '6px 8px' : '9px 11px') + ';color:#e8fbff;font-size:' + (tuval.clientWidth < 600 ? '11px' : '13px') + ';line-height:1.35;box-shadow:0 0 22px rgba(79,224,255,.35)';
        sahneKap.appendChild(kart);
        S.odak = { nokta: p, kart: kart, svg: svg, cizgi: cizgi, uc: uc, arkaEl: arkaEl, parcalar: [cekirdek, hale, dalga] }; S.odakFma = fma;
        if (kart.animate) kart.animate([{ opacity: 0, filter: 'blur(4px)' }, { opacity: 1, filter: 'blur(0)' }], { duration: 450, easing: 'ease-out' });
        var t0 = performance.now();
        S.odakAnim = function () { // açık mavi titreşim + dışa yayılan halka
          var t = (performance.now() - t0) / 1000, n = 0.5 + 0.5 * Math.sin(t * 6);
          hale.scale.setScalar(0.85 + 0.35 * n); hale.material.opacity = 0.25 + 0.3 * n;
          var d = (t % 1.4) / 1.4; dalga.scale.setScalar(1 + d * 2.2); dalga.material.opacity = 0.55 * (1 - d);
          cekirdek.material.opacity = 0.75 + 0.25 * n;
        };
        // kamerayı işaretin dışa bakan yüzüne çevir
        var yon = p.clone().sub(m.c).normalize().add(new T.Vector3(0, 0.25, 0.35)).normalize();
        S.halkaHedef = null; lab.duraklat && lab.duraklat();
        hedefeUc(p, Math.max(0.09, boy * 2.1), false, yon);
        return x;
      });
    }
    function hazir() {
      genelBakis(true);
      kart.innerHTML = '';
      kart.appendChild(el('p', { class: 'var-etiket', text: Object.keys(S.parcalar).length + ' kemik yüklendi. Bir kemiğe dokun ya da ara.' }));
      var genelTur = [{ hedef: null, baslik: 'İskelet', metin: 'Bu model BodyParts3D veritabanından ' + Object.keys(S.parcalar).length + ' kemikten oluşuyor. Döndürmek için sürükle, yakınlaşmak için tekerleği ya da iki parmağını kullan.', kaynakTur: 'genel' }];
      ['FMA52748', 'FMA13395', 'FMA23130', 'FMA16202', 'FMA16586', 'FMA24474', 'FMA24477'].forEach(function (id) { if (S.kat[id]) genelTur.push({ hedef: id, baslik: S.kat[id].tr, metin: S.kat[id].la + ' — ' + S.kat[id].en + '.', kaynakTur: 'genel' }); });
      if (parcaId && S.kat[parcaId]) kemikTuru(parcaId); else { lab.baslat(genelTur, 'İskelet'); lab.duraklat(); lab.git(0); }
    }
    function genelBakis(ani) { hedefeUc(new S.T.Vector3(0, 0.9, 0), 3.2, ani, new S.T.Vector3(0, 0.15, 1)); }
    function hedefeUc(hedef, uzaklik, ani, yon) {
      var T = S.T, kam = S.kam, kont = S.kont;
      var d = yon ? yon.clone().normalize() : kam.position.clone().sub(kont.target).normalize();
      var sonKam = hedef.clone().add(d.multiplyScalar(uzaklik));
      if (ani || AZ_HAREKET) { kont.target.copy(hedef); kam.position.copy(sonKam); S.ucus = null; return; }
      var t0 = performance.now(), bT = kont.target.clone(), bK = kam.position.clone();
      S.ucus = function () { var t = Math.min(1, (performance.now() - t0) / 900); var e = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; kont.target.lerpVectors(bT, hedef, e); kam.position.lerpVectors(bK, sonKam, e); if (t >= 1) S.ucus = null; };
    }
    function uc(id) { var m = merkez(id); if (!m) return; hedefeUc(m.c, Math.max(0.12, m.r * 3.4)); }
    function secimiKaldir() {
      S.secili = null; S.halkaHedef = null;
      Object.keys(S.parcalar).forEach(function (k) { var mt = S.parcalar[k].material; mt.color.setHex(KEMIK); mt.emissive.setHex(0); saydam(mt, false); mt.opacity = 1; mt.depthWrite = true; S.parcalar[k].visible = true; });
      isaretleriTemizle(); odakTemizle();
      if (S.etiket) S.etiket.gizle();
    }
    function sec(id, turdan) {
      if (!S.parcalar[id]) return;
      secimiKaldir();
      S.secili = id;
      Object.keys(S.parcalar).forEach(function (k) {
        var mt = S.parcalar[k].material;
        if (k === id) { mt.color.setHex(0xf2fbff); mt.emissive.setHex(0x0b5f74); }
        else { saydam(mt, true); mt.opacity = 0.14; mt.depthWrite = false; }
      });
      if (!turdan) uc(id);
      kartCiz(id);
      isaretleriCiz(id);
    }
    function kartCiz(id) {
      var k = S.kat[id];
      kart.innerHTML = '';
      kart.appendChild(el('div', { class: 'ust-etiket', text: k.bolge === 'ust' ? 'Üst ekstremite' : k.bolge === 'alt' ? 'Alt ekstremite' : k.bolge === 'kafa' ? 'Kafa' : 'Gövde iskeleti' }));
      kart.appendChild(el('h3', { class: 'an-ad', text: k.tr }));
      kart.appendChild(el('p', { class: 'an-la' }, [el('em', { text: k.la }), ' · ' + k.en]));
      kart.appendChild(el('span', { class: 'etiket-kucuk ' + (k.dogrulama === 'doğrulanmadı' || k.dogrulama === 'kitapla çelişiyor' ? 'uyari' : 'kitap'), text: 'Ad: ' + k.dogrulama }));
      if (k.not) kart.appendChild(el('p', { class: 'uyari-kutu', text: k.not }));
      var kitap = el('div', { class: 'kk-ic' }, [el('div', { class: 'yukleniyor', text: 'Kitapta aranıyor…' })]);
      kart.appendChild(el('h4', { text: 'Kitapta: neden böyle, ne işe yarar' })); kart.appendChild(kitap);
      kitapBilgisi(k, kitap);
      kart.appendChild(el('div', { class: 'yp-dugmeler' }, [
        el('button', { class: 'cip', type: 'button', onclick: function () { kemikTuru(id); } }, ['▶ Bu kemiğin turu']),
        el('button', { class: 'cip', type: 'button', onclick: function () { Kitaplik.katalog().then(function () { return Kitaplik.ac('anatomi'); }).then(function (kj) { U.kavramAc(k.la.split(' (')[0], { kj: kj, bolum: null, blok: null }); }); } }, ['Kavram kartı']),
        el('button', { class: 'cip', type: 'button', onclick: function () { secimiKaldir(); genelBakis(); kart.innerHTML = ''; } }, ['Seçimi kaldır'])]));
      // ince işaretler
      var isk = el('div', { class: 'isaret-liste' });
      kart.appendChild(el('h4', { text: 'İnce işaretler' })); kart.appendChild(isk);
      S.isaretListeEl = isk;
      var oner = el('div', { class: 'ai-gerek' });
      kart.appendChild(oner);
      isaretOneriCiz(id, oner);
    }
    function kitapBilgisi(k, kap) {
      var anahtar = k.la.split(' (')[0].replace(/ (I|II|III|IV|V|VI|VII|VIII|IX|X|XI|XII)$/, '');
      U.indeksle('anatomi').then(function (ix) {
        var qs = [katla(anahtar), katla(anahtar.split(' ').slice(-1)[0])].filter(function (x) { return x.length > 3; });
        var bul = [];
        ['neden', 'klinik', 'koken', 'siklik', 'tuzak'].forEach(function (tur) {
          for (var i = 0; i < ix.liste.length && bul.length < 5; i++) { var x = ix.liste[i]; if (x.tur === tur && qs.some(function (q) { return x.katli.indexOf(q) >= 0; }) && !bul.some(function (b) { return b.tur === tur; })) bul.push(x); }
        });
        kap.innerHTML = '';
        if (!bul.length) { kap.appendChild(el('p', { class: 'var-etiket', text: 'Kitapta bu kemik için neden/klinik kutusu bulunamadı.' })); return; }
        bul.forEach(function (x) {
          var b = ix.kj.bolumler[x.b], a = b.altlar[x.a], t = U.turBilgi(ix.kj, x.tur);
          kap.appendChild(el('a', { class: 'kk-alinti', href: '#' + U.okuHash('anatomi', x.b), style: '--c:' + t.renk, onclick: function () { Durum.vurguBlok = x.id; } },
            [el('small', { text: t.ikon + ' ' + t.etiket + ' · Anatomi ' + (a.no || b.no) }), el('span', { text: x.metin.slice(0, 260) + (x.metin.length > 260 ? '…' : '') })]));
        });
      });
    }
    function kemikTuru(id) {
      var k = S.kat[id];
      sec(id, true); uc(id);
      var adimlar = [{ hedef: id, baslik: k.tr, metin: k.la + ' (' + k.en + ').', kaynakTur: 'genel' }];
      tumIsaretler(id).then(function (l) {
        l.forEach(function (x) { adimlar.push({ hedef: id, baslik: x.ad, metin: x.ad + ' — ' + DURUM_AD[x.durum] + '.', kaynakTur: 'genel', isaretNokta: x }); });
        return U.kitaptanOzet('anatomi', k.la.split(' (')[0]);
      }).then(function (oz) {
        if (oz) adimlar.push({ hedef: id, baslik: 'Kitapta: ' + k.tr, metin: oz.metin, kaynakTur: 'kitap', kaynak: oz.kaynak });
        lab.baslat(adimlar, k.tr);
      });
    }

    /* ---------- ince işaretler ---------- */
    function isaretAnahtar(fma, ad) { return fma + '~' + fnv(katla(ad)); }
    function tumIsaretler(fma) {
      var dbden = Y.db ? Y.db.collection('isaretler').where('fma', '==', fma).get().then(function (s) { return s.docs.map(function (d) { return d.data(); }); }).catch(function () { return []; }) : Promise.resolve([]);
      return Promise.all([hazirIsaretler(), dbden]).then(function (r) {
        var h = {};
        r[0].isaretler.filter(function (x) { return x.fma === fma; }).forEach(function (x) { h[katla(x.ad)] = x; });
        r[1].forEach(function (x) { if (x.durum === 'reddedildi') delete h[katla(x.ad)]; else h[katla(x.ad)] = x; });
        return Object.keys(h).map(function (k) { return h[k]; });
      });
    }
    function isaretleriTemizle() { S.isaretMesh.forEach(function (x) { if (x.kure) S.sahne.remove(x.kure); x.el.remove(); }); S.isaretMesh = []; }
    function isaretleriCiz(fma) {
      tumIsaretler(fma).then(function (l) {
        if (S.secili !== fma) return;
        isaretleriTemizle();
        S.isaretler = l;
        var T = S.T, boy = merkez(fma).r;
        l.forEach(function (x) {
          var p = new T.Vector3(x.nokta[0], x.nokta[1], x.nokta[2]);
          var renk = x.durum === 'onayli' ? 0x5fe0a0 : x.durum === 'ai-tutarli' || x.durum === 'derlendi' ? 0x4fe0ff : 0xffb547;
          var kure = new T.Mesh(new T.SphereGeometry(Math.max(0.0022, boy * 0.022), 16, 12), new T.MeshBasicMaterial({ color: renk, depthTest: false, transparent: true, opacity: 0.95 }));
          kure.renderOrder = 10; kure.position.copy(p); S.sahne.add(kure);
          var e = el('div', { class: 'isaret-etiket d-' + x.durum, title: x.ad + ' · ' + (DURUM_AD[x.durum] || '') }, [el('span', { text: x.ad })]);
          etiketKat.appendChild(e);
          S.isaretMesh.push({ nokta: p, el: e, kure: kure, x: x });
        });
        listeCiz(fma, l);
      });
    }
    function listeCiz(fma, l) {
      var isk = S.isaretListeEl; if (!isk) return;
      isk.innerHTML = '';
      if (!l.length) isk.appendChild(el('p', { class: 'var-etiket', text: 'Bu kemik için işaret yok. Aşağıdan yapay zekâya buldurabilir ya da kendin koyabilirsin.' }));
      l.forEach(function (x) {
        var sat = el('div', { class: 'isaret-satir d-' + x.durum }, [el('strong', { text: x.ad }), el('span', { class: 'etiket-kucuk', text: DURUM_AD[x.durum] }),
          x.durum !== 'onayli' ? el('button', { class: 'cip', type: 'button', title: 'Doğru: onayla', onclick: function () { kaydet(fma, x.ad, x.nokta, 'onayli', x).then(function () { isaretleriCiz(fma); toast('Onaylandı; bütün turlarda kullanılacak.'); }); } }, ['✓']) : null,
          el('button', { class: 'cip', type: 'button', title: 'Yanlış: reddet', onclick: function () { kaydet(fma, x.ad, x.nokta, 'reddedildi', x).then(function () { isaretleriCiz(fma); toast('Reddedildi. "AI ile bul" ile yeniden dene ya da kendin koy.'); }); } }, ['✗']),
          el('button', { class: 'cip', type: 'button', title: 'Yerini düzelt', onclick: function () { tasi(fma, x.ad); } }, ['⤧ Taşı'])]);
        isk.appendChild(sat);
      });
    }
    function kaydet(fma, ad, nokta, durum, eski) {
      var veri = { fma: fma, ad: ad, nokta: nokta.map(function (v) { return +(+v).toFixed(5); }), durum: durum, t: Date.now(), kaynak: durum === 'onayli' ? 'kullanıcı' : (eski && eski.kaynak) || 'ai' };
      if (eski && eski.dogrulama) veri.dogrulama = eski.dogrulama;
      if (!Y.db) { toast('Kaydetmek için sayfayı claude.ai içinde aç.'); return Promise.resolve(); }
      return Y.db.doc('isaretler/' + isaretAnahtar(fma, ad)).set(veri).catch(function () { toast('Kaydedilemedi (yetki?).'); });
    }
    function tasi(fma, ad) {
      toast('Yeni yeri kemiğin üzerine dokunarak seç.');
      S.tasima = { fma: fma, bitti: function (p) { kaydet(fma, ad, [p.x, p.y, p.z], 'onayli').then(function () { isaretleriCiz(fma); toast('Yeni yer kaydedildi (Onaylı).'); }); } };
    }
    function isaretOneriCiz(fma, kap) {
      kap.innerHTML = '';
      var girdi = el('input', { id: 'isaretAd', type: 'text', list: 'isaretOneri', placeholder: 'İşaret adı: tuberculum majus…', 'aria-label': 'İşaret adı' });
      var dl = el('datalist', { id: 'isaretOneri' });
      var durumEl = el('div', { class: 'var-etiket', 'aria-live': 'polite' });
      kap.appendChild(el('div', { class: 'yp-form' }, [girdi, dl]));
      kap.appendChild(el('div', { class: 'yp-dugmeler' }, [
        el('button', { class: 'dugme kucuk ana', type: 'button', onclick: function () { var a = girdi.value.trim(); if (a) aiIsaretBul(fma, a, durumEl).catch(function () {}); else toast('İşaret adını yaz.'); } }, ['✦ AI ile bul']),
        el('button', { class: 'dugme kucuk', type: 'button', onclick: function () { var a = girdi.value.trim(); if (!a) { toast('İşaret adını yaz.'); return; } tasi(fma, a); } }, ['Kendim koyayım'])]));
      kap.appendChild(durumEl);
      hedefTerimler(fma).then(function (l) { l.forEach(function (t) { dl.appendChild(el('option', { value: t })); }); if (l.length) durumEl.textContent = 'Kitaptan öneriler: ' + l.slice(0, 6).join(', ') + (l.length > 6 ? '…' : ''); });
    }
    // Kitabın bu kemiğe ait alt bölümlerindeki ince işaret terimleri
    function hedefTerimler(fma) {
      var k = S.kat[fma], ad = katla(k.la.split(' ')[0] === 'Os' ? k.la.split(' ').slice(0, 2).join(' ') : k.la.split(' ')[0]);
      return Promise.all([Kitaplik.katalog().then(function () { return Kitaplik.ac('anatomi'); }), U.kavramDizini('anatomi')]).then(function (r) {
        var kj = r[0], dz = r[1], altlar = {};
        kj.bolumler.forEach(function (b) { b.altlar.forEach(function (a) { if (a.baslik && katla(a.baslik).indexOf(ad) >= 0) altlar[a.id] = 1; }); });
        var IS = /^(tuberculum|tuberositas|caput|collum|corpus|condylus|epicondylus|trochanter|fossa|foramen|incisura|processus|sulcus|facies|crista|spina|linea|margo|angulus|malleolus|fovea|tuber|eminentia|acromion|olecranon|capitulum|trochlea|cavitas|acetabulum|ramus|arcus|lamina|pediculus|dens)\b/;
        return Object.keys(dz).filter(function (t) { return IS.test(t) && dz[t].yer.some(function (y) { return altlar[y[1]]; }); }).map(function (t) { return dz[t].ad; }).slice(0, 30);
      });
    }

    /* Set-of-Mark hattı: aday noktalar → kanonik görünümler → "hangi numara?" → bağımsız tekrar → işaretli doğrulama */
    var GORUNUM = [['ön', [0, 0, 1]], ['arka', [0, 0, -1]], ['dış yan', [-1, 0, 0]], ['iç yan', [1, 0, 0]], ['üst', [0, 1, 0.001]], ['alt', [0, -1, 0.001]]];
    function adaylar(fma, n, tohum) {
      var m = S.parcalar[fma], pos = m.geometry.attributes.position, T = S.T, l = [];
      var adim = Math.max(1, Math.floor(pos.count / 1500));
      for (var i = tohum % adim; i < pos.count; i += adim) { var v = new T.Vector3().fromBufferAttribute(pos, i); m.localToWorld(v); l.push(v); }
      var sec = [l[(tohum * 7919) % l.length]], uz = l.map(function (v) { return v.distanceToSquared(sec[0]); });
      while (sec.length < n && sec.length < l.length) {
        var en = 0; for (var j = 1; j < l.length; j++) if (uz[j] > uz[en]) en = j;
        sec.push(l[en]); for (var q = 0; q < l.length; q++) uz[q] = Math.min(uz[q], l[q].distanceToSquared(l[en]));
      }
      return sec;
    }
    // Kaba konumun çevresindeki yüzey noktaları (ince ayar adayları): yarıçap içinden en uzak nokta örneklemesi
    function yakinAdaylar(fma, odak, yaricap, n) {
      var mm = S.parcalar[fma], pos = mm.geometry.attributes.position, T = S.T, l = [];
      for (var i = 0; i < pos.count; i++) { var v = new T.Vector3().fromBufferAttribute(pos, i); mm.localToWorld(v); if (v.distanceTo(odak) < yaricap) l.push(v); }
      if (l.length < n) return l;
      var sec = [l.reduce(function (a, b) { return a.distanceTo(odak) < b.distanceTo(odak) ? a : b; })], uz = l.map(function (v) { return v.distanceToSquared(sec[0]); });
      while (sec.length < n) { var en = 0; for (var j = 1; j < l.length; j++) if (uz[j] > uz[en]) en = j; sec.push(l[en]); for (var q = 0; q < l.length; q++) uz[q] = Math.min(uz[q], l[q].distanceToSquared(l[en])); }
      return sec;
    }
    function gorunumleriCiz(fma, noktalar, isaretNokta, odak) {
      var T = S.T, m = merkez(fma), W = 360, H = 360;
      // odak verilirse kamera o bölgeye yakınlaşır (ince ayar görünümleri)
      if (odak) m = { c: odak.c, r: odak.r };
      var sheet = document.createElement('canvas'); sheet.width = W * 3; sheet.height = H * 2;
      var g = sheet.getContext('2d'); g.fillStyle = '#ffffff'; g.fillRect(0, 0, sheet.width, sheet.height);
      var kam = new T.PerspectiveCamera(30, 1, 0.001, 20);
      var r = new T.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true }); r.setSize(W, H); r.outputEncoding = T.sRGBEncoding;
      var sahne = new T.Scene(); sahne.background = new T.Color(0xffffff);
      var kopya = new T.Mesh(S.parcalar[fma].geometry, new T.MeshStandardMaterial({ color: 0xd9cfbd, roughness: 0.85 }));
      kopya.applyMatrix4(S.parcalar[fma].matrixWorld); sahne.add(kopya);
      sahne.add(new T.HemisphereLight(0xffffff, 0x666666, 0.9)); var d = new T.DirectionalLight(0xffffff, 0.6); sahne.add(d);
      var ray = new T.Raycaster(), harita = [];
      GORUNUM.forEach(function (gv, gi) {
        var yon = new T.Vector3(gv[1][0], gv[1][1], gv[1][2]).normalize();
        kam.position.copy(m.c.clone().add(yon.clone().multiplyScalar(m.r * 4.2))); kam.up.set(0, Math.abs(yon.y) > 0.9 ? 0 : 1, Math.abs(yon.y) > 0.9 ? -1 : 0); kam.lookAt(m.c); kam.updateMatrixWorld();
        d.position.copy(kam.position);
        r.render(sahne, kam);
        var ox = (gi % 3) * W, oy = Math.floor(gi / 3) * H;
        g.drawImage(r.domElement, ox, oy);
        g.fillStyle = '#000'; g.font = 'bold 16px sans-serif'; g.fillText(gv[0], ox + 8, oy + 20);
        g.strokeStyle = '#999'; g.strokeRect(ox + 0.5, oy + 0.5, W - 1, H - 1);
        (noktalar || []).forEach(function (p, ni) {
          var pr = p.clone().project(kam); if (pr.z > 1) return;
          var dirv = p.clone().sub(kam.position), mes = dirv.length(); ray.set(kam.position, dirv.normalize());
          var h = ray.intersectObject(kopya, false); if (!h.length || h[0].distance < mes - m.r * 0.04) return; // arkada kalan
          var x = ox + (pr.x + 1) / 2 * W, y = oy + (1 - pr.y) / 2 * H;
          g.beginPath(); g.arc(x, y, 9, 0, 7); g.fillStyle = '#d0021b'; g.fill(); g.fillStyle = '#fff'; g.font = 'bold 11px sans-serif'; g.textAlign = 'center'; g.fillText(String(ni + 1), x, y + 4); g.textAlign = 'left';
          harita.push({ n: ni + 1, gorunum: gv[0] });
        });
        if (isaretNokta) { var pr2 = isaretNokta.clone().project(kam); var x2 = ox + (pr2.x + 1) / 2 * W, y2 = oy + (1 - pr2.y) / 2 * H; g.beginPath(); g.arc(x2, y2, 12, 0, 7); g.lineWidth = 4; g.strokeStyle = '#0057ff'; g.stroke(); g.lineWidth = 1; }
      });
      r.dispose(); kopya.material.dispose();
      return new Promise(function (ok) { sheet.toBlob(function (b) { ok({ blob: b, harita: harita }); }, 'image/png'); });
    }
    function aiIsaretBul(fma, ad, durumEl) {
      var k = S.kat[fma];
      durumEl = durumEl || {};
      durumEl.textContent = 'Görünümler hazırlanıyor…';
      return U.AI.hazir().then(function (ok) {
        if (!ok) throw { code: 'not_granted' };
        return Y.sample.limits().then(function (l) { if (!l || !l.images) throw { code: 'images_unavailable' }; });
      }).then(function () {
        function sor(tohum) {
          var nok = adaylar(fma, 28, tohum);
          return gorunumleriCiz(fma, nok).then(function (g) {
            durumEl.textContent = 'Yapay zekâ görünümleri inceliyor (' + (tohum === 1 ? '1' : '2') + '/2)…';
            return Y.sample.json('Görselde bir kemiğin (' + k.la + ' — ' + k.en + ', ' + k.tr + ') altı standart görünümü var; her panelin sol üstünde görünüm adı yazıyor. Kırmızı numaralı noktalar kemik yüzeyindeki aday noktalardır. Anatomik işaret "' + ad + '" hangi numaralı noktaya EN YAKIN? Piksel koordinatı verme, yalnız numara seç. Emin değilsen emin değerini düşük ver; işaret hiçbir noktaya yakın değilse numara null. Yalnız JSON: {"numara": 1-28 ya da null, "gorunum": "panel adı", "emin": 0-1, "neden": "kısa"}',
              { images: [g.blob], cache: false }).then(function (j) { var n = +j.numara; return { nokta: n >= 1 && n <= nok.length ? nok[n - 1] : null, j: j }; });
          });
        }
        // ince ayar: kaba noktanın çevresine yakınlaşmış 6 görünüm + 18 sık aday (28 kaba aday kemik başına çok seyrek kalıyordu)
        function incele(kaba) {
          var R = merkez(fma).r, yar = R * 0.32, nok = yakinAdaylar(fma, kaba, yar, 18);
          if (nok.length < 4) return Promise.resolve(kaba);
          durumEl.textContent = 'İnce ayar: bölgeye yakınlaşılıyor…';
          return gorunumleriCiz(fma, nok, null, { c: kaba, r: yar * 0.9 }).then(function (g) {
            return Y.sample.json('Görselde bir kemiğin (' + k.la + ' — ' + k.en + ') küçük bir BÖLGESİNE yakınlaşılmış altı görünüm var (panel adı sol üstte). Kırmızı numaralı noktalar o bölgedeki aday noktalar. Anatomik işaret "' + ad + '" (çıkıntının tepesi / çukurun ortası / yüzeyin merkezi) hangi numaraya EN YAKIN? Yalnız JSON: {"numara": 1-' + nok.length + ' ya da null, "emin": 0-1, "neden": "kısa"}', { images: [g.blob], cache: false });
          }).then(function (j) { var n = +j.numara; return n >= 1 && n <= nok.length && (j.emin == null || j.emin >= 0.35) ? nok[n - 1] : kaba; }, function () { return kaba; });
        }
        return sor(1).then(function (a) {
          if (!a.nokta) throw new Error('Yapay zekâ işareti aday noktalarda bulamadı (' + (a.j.neden || '') + ').');
          return sor(2).then(function (b) {
            var boy = merkez(fma).r * 2, uzak = b.nokta ? a.nokta.distanceTo(b.nokta) : Infinity;
            var tutarli = uzak < Math.max(0.006, boy * 0.07);
            var kaba = tutarli ? a.nokta.clone().add(b.nokta).multiplyScalar(0.5) : a.nokta;
            return incele(kaba).then(function (nokta) { return { nokta: nokta, tutarli: tutarli, uzak: uzak, inceKayma: +nokta.distanceTo(kaba).toFixed(4) }; });
          }).then(function (s1) {
            var nokta = s1.nokta, tutarli = s1.tutarli, uzak = s1.uzak;
            durumEl.textContent = 'İşaret çizilip son kez doğrulatılıyor…';
            return gorunumleriCiz(fma, null, nokta).then(function (g) {
              return Y.sample.json('Görselde ' + k.la + ' (' + k.en + ') kemiğinin altı görünümü var. Mavi halka, "' + ad + '" işaretinin konduğu yeri gösteriyor. Halka doğru anatomik yerde mi? Yalnız JSON: {"dogru": true/false, "neden": "kısa"}', { images: [g.blob], cache: false });
            }).then(function (v) {
              var durum = tutarli && v && v.dogru === true ? 'ai-tutarli' : 'ai-belirsiz';
              return kaydet(fma, ad, [nokta.x, nokta.y, nokta.z], durum, { kaynak: 'ai', dogrulama: { mesafe: +uzak.toFixed(4), inceAyar: s1.inceKayma, son: v && v.dogru, neden: v && v.neden } }).then(function () {
                durumEl.textContent = DURUM_AD[durum] + (durum === 'ai-belirsiz' ? ' — iki bağımsız deneme ya da son kontrol uyuşmadı; ✓/✗ ile karar ver ya da taşı.' : ' — iki deneme uyuştu ve son kontrol geçti. Kesin değil; doğruysa ✓ ile onayla.');
                isaretleriCiz(fma);
                return { fma: fma, ad: ad, nokta: [nokta.x, nokta.y, nokta.z], durum: durum };
              });
            });
          });
        });
      }).catch(function (e) { durumEl.textContent = e && e.code ? U.AI.hataMetni(e) : (e.message || 'Hata'); throw e; });
    }

    /* arama */
    ara.addEventListener('input', U.geciktir(function () {
      var q = katla(ara.value.trim()); oneriler.innerHTML = '';
      if (q.length < 2) return;
      Object.keys(S.kat).filter(function (id) { var k = S.kat[id]; return katla(k.tr + ' ' + k.la + ' ' + k.en).indexOf(q) >= 0; }).slice(0, 8).forEach(function (id) {
        oneriler.appendChild(el('button', { type: 'button', onclick: function () { oneriler.innerHTML = ''; ara.value = ''; lab.duraklat(); sec(id); } }, [S.kat[id].tr + ' · ' + S.kat[id].la]));
      });
    }, 150));
    // turda işaret adımları: halka işarete gitsin
    var eskiGit = lab.git.bind(lab);
    lab.git = function (j) { eskiGit(j); var a = lab.adimlar[lab.i]; if (a && a.isaretNokta) { var p = a.isaretNokta.nokta; hedefeUc(new S.T.Vector3(p[0], p[1], p[2]), Math.max(0.08, merkez(a.hedef).r * 1.6)); } };
  }

  /* --- kavram kartında "3B'de göster" (kemik) --- */
  var eskiLab = U.labDugmesi;
  U.labDugmesi = function (kap, ad, kj) {
    if (eskiLab) eskiLab(kap, ad, kj);
    if (kj && kj.id !== 'anatomi') return;
    var q = katla(ad);
    anKatalog().then(function (k) {
      var p = k.parcalar.filter(function (x) { var la = katla(x.la.split(' (')[0]), tr = katla(x.tr.replace(/^(sağ|sol) /, '')); return la === q || tr === q || katla(x.en.replace(/^(right|left) /, '')) === q; });
      if (!p.length) return;
      var x = p.filter(function (z) { return z.taraf !== 'sol'; })[0] || p[0];
      kap.prepend(el('a', { class: 'dugme kucuk ana lab-dug', href: '#lab-anatomi-' + x.id, onclick: function () { U.panelKapat(); } }, ['🦴 3B\'de göster: ' + x.tr]));
    }).catch(function () {});
  };
  U.SEKMELER.push({ id: 'lab-anatomi', ad: 'Anatomi 3B', ikon: '🦴' });
  U.sekmeleriCiz();
})();
