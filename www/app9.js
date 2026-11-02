/* 1001 — Aşama 8 (genel): eklem zinciri + kas motoru. Her eklem hareketi, o eklemi geçen bütün kasları geometriye göre kısaltır/uzatır. */
(function () {
  'use strict';
  var U = window.Uygulama, A = window.KitapAyristir;
  var el = U.el, $ = U.$, $$ = U.$$, toast = U.toast, Kitaplik = U.Kitaplik, Durum = U.Durum;
  var katla = A.katla;
  var AZ_HAREKET = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var THREE_URL = 'https://cdn.jsdelivr.net/npm/three@0.147.0/build/three.min.js';
  var GLTF_URL = 'https://cdn.jsdelivr.net/npm/three@0.147.0/examples/js/loaders/GLTFLoader.js';
  var ORBIT_URL = 'https://cdn.jsdelivr.net/npm/three@0.147.0/examples/js/controls/OrbitControls.js';
  // three r147: saydamlık değişince materyal yeniden derlenmeli (OPAQUE tanımı), yoksa opaklık uygulanmaz.
  function saydam(mt, v) { if (mt.transparent !== v) { mt.transparent = v; mt.needsUpdate = true; } }
  var kemikAdSozu = null;
  function kemikAdlari() { return kemikAdSozu || (kemikAdSozu = fetch('lab/anatomi/katalog.json').then(function (r) { return r.json(); }).then(function (j) { var m = {}; j.parcalar.forEach(function (p) { m[String(p.en).toLowerCase()] = p; }); return m; }).catch(function () { kemikAdSozu = null; return {}; })); }
  var BASLIK = { ust: 'Sağ üst ekstremite: eklemler ve kaslar', alt: 'Sağ alt ekstremite: eklemler ve kaslar' };
  var YON_AD = { fleksiyon: ['Fleksiyon', 'Ekstansiyon'], abduksiyon: ['Abdüksiyon', 'Addüksiyon'], rotasyon: ['İç rotasyon', 'Dış rotasyon'], pronasyon: ['Pronasyon', 'Supinasyon'],
    deviasyon: ['Ulnar deviasyon', 'Radial deviasyon'], plantar: ['Plantar fleksiyon', 'Dorsifleksiyon'], inversiyon: ['İnversiyon', 'Eversiyon'] };

  var meta = null;
  function metaYukle() { if (!meta) meta = fetch('lab/hareket/hareket.json').then(function (r) { return r.json(); }); return meta; }

  U.GORUNUMLER['lab-eklem'] = function (b) { labEklem(b === 'alt' ? 'alt' : 'ust'); };
  function labEklem(bolge) {
    var ana = $('#ana'); ana.innerHTML = '';
    var sayfa = el('div', { class: 'lab-sayfa' }); ana.appendChild(sayfa);
    var sahneKap = el('div', { class: 'lab-sahne' });
    var tuval = el('div', { class: 'lab-tuval', role: 'img', 'aria-label': '3B eklem ve kas animasyonu' });
    sahneKap.appendChild(tuval);
    var yan = el('aside', { class: 'lab-yan' });
    sayfa.appendChild(sahneKap); sayfa.appendChild(yan);
    sahneKap.appendChild(el('div', { class: 'lab-ust' }, [el('div', { class: 'ust-etiket', text: 'Hareket · eklemler ve kaslar' }), U.sahneCipleri(bolge)]));
    var gorKontrol = el('div', { class: 'lab-stiller' });
    sahneKap.appendChild(gorKontrol);
    var durum = el('div', { class: 'lab-durum' }, [el('div', { class: 'yukleniyor', text: 'Kemikler ve kaslar yükleniyor…' })]);
    sahneKap.appendChild(durum);
    var S = { aci: {}, hedef: {}, roller: {}, seg: {}, kas: [], secKas: null };
    var lab = new U.Lab(sahneKap, {
      tur: 'eklem-kas', ornekSoru: bolge === 'ust' ? 'Örn. "omuzu abdüksiyona getir, hangi kaslar çalışır?"' : 'Örn. "dizi bük, hangi kaslar kısalır?"',
      katalog: function () { return S.kas.map(function (k) { return { id: k.rol, ad: k.la, ara: k.en }; }).concat((S.meta ? S.meta.eklemler : []).map(function (e) { return { id: 'eklem:' + e.id, ad: e.ad, ara: e.id }; })); },
      goster: function (id) { if (/^eklem:/.test(id)) return; kasSec(id); }, kamera: function (id) { odakla(id); }, isaret: function (id) { S.halka = id; }, sifirla: function () { poz({}); kasSec(null); S.halka = null; },
      ekAraclar: [{ name: 'hareket_yap', description: 'Bir eklemi hareket ettirir. eklem: ' + '{eklemler}' + '. hareket: o eklemin hareket kimliği (ör. fleksiyon, abduksiyon, rotasyon, pronasyon, deviasyon, plantar, inversiyon). aci: derece (negatif = ters yön, ör. ekstansiyon -30). Sıfırlamak için eklem "hepsi", aci 0.',
        inputSchema: { type: 'object', properties: { eklem: { type: 'string' }, hareket: { type: 'string' }, aci: { type: 'number' } }, required: ['eklem', 'aci'] },
        execute: function (g) {
          if (String(g.eklem) === 'hepsi') { poz({}); return 'Sıfırlandı.'; }
          var e = (S.meta.eklemler || []).filter(function (x) { return x.id === String(g.eklem); })[0]; if (!e) throw new Error('Eklem yok. Geçerli: ' + S.meta.eklemler.map(function (x) { return x.id; }).join(', '));
          var h = e.hareketler.filter(function (x) { return x.id === String(g.hareket || e.hareketler[0].id); })[0]; if (!h) throw new Error('Hareket yok. Geçerli: ' + e.hareketler.map(function (x) { return x.id; }).join(', '));
          var a = Math.max(h.min, Math.min(h.max, +g.aci || 0)); S.hedef[e.id + '.' + h.id] = a; sliderGuncelle();
          var d = kasDurumu(Object.assign({}, S.hedef));
          return { eklem: e.ad, hareket: h.ad, aci: a, kisalan: d.kisalan.slice(0, 6).map(function (k) { return k.la + ' (' + k.yuzde + '%)'; }), uzayan: d.uzayan.slice(0, 4).map(function (k) { return k.la + ' (+' + k.yuzde + '%)'; }), not: 'Kas boy değişimi geometriden hesaplandı (şematik).' };
        } }]
    });
    sahneKap.appendChild(lab.hud);
    var eklemKutu = el('section', { class: 'lab-kutu' }, [el('h3', { text: BASLIK[bolge] })]);
    var kasKutu = el('section', { class: 'lab-kutu' }, [el('h3', { text: 'Bu pozda kaslar' })]);
    var kasListe = el('div', { class: 'kas-liste', 'aria-live': 'polite' }); kasKutu.appendChild(kasListe);
    var bilgi = el('section', { class: 'lab-kutu' });
    yan.appendChild(eklemKutu); yan.appendChild(kasKutu);
    yan.appendChild(el('section', { class: 'lab-kutu' }, [el('h3', { text: 'Tur: bütün hareketler' }), lab.adimListe, lab.kontrol, lab.metin]));
    yan.appendChild(bilgi);
    var sohbetKutu = el('section', { class: 'lab-kutu ai-gerek' }, [el('h3', { text: 'Asistana yaz' })]);
    yan.appendChild(sohbetKutu);
    lab.sohbet(sohbetKutu, function () { return 'Sahne: ' + BASLIK[bolge] + '. Eklemler ve hareketler: ' + (S.meta ? S.meta.eklemler.map(function (e) { return e.id + ' [' + e.hareketler.map(function (h) { return h.id + ' ' + h.min + '..' + h.max + '°'; }).join(', ') + ']'; }).join('; ') : '') + '. Önce hareket_yap ile göster, sonra dönen kısalan kas listesine dayanarak açıkla; bunun şematik bir geometri hesabı olduğunu belirt.'; });
    var atif = el('p', { class: 'lab-atif' }); yan.appendChild(atif);
    yan.appendChild(el('p', { class: 'uyari-kutu', text: 'Şematik: eklem merkezleri ve eksenleri kemik geometrisinden, kas tutunmaları en yakın kemik noktasından ve standart anatomiden alındı. Kısalan kas = o harekette kasılan aday kas (konsantrik). Skapula hareketi (skapulohumeral ritim) modellenmedi; hareket açıklıkları ders kitabı ortalamalarıdır.' }));

    Promise.all([metaYukle(), U.betik(THREE_URL, function () { return !!window.THREE; })]).then(function (r) {
      return Promise.all([U.betik(GLTF_URL, function () { return !!THREE.GLTFLoader; }), U.betik(ORBIT_URL, function () { return !!THREE.OrbitControls; })]).then(function () { return r[0]; });
    }).then(function (m) {
      S.meta = m.sahneler[bolge];
      if (!S.meta) throw new Error('Sahne verisi yok.');
      lab.adaptor.ekAraclar[0].description = lab.adaptor.ekAraclar[0].description.replace('{eklemler}', S.meta.eklemler.map(function (e) { return e.id; }).join(', '));
      atif.textContent = m.kaynak + ' · CC BY-SA 2.1 JP (türetilen içerik aynı lisansla paylaşılmalıdır).';
      return fetch('lab/hareket/' + bolge + '.glb.json').then(function (r) { return r.json(); }).then(kur);
    }).catch(function (e) { durum.innerHTML = ''; durum.appendChild(el('div', { class: 'bos hata-metni', text: 'Sahne açılamadı: ' + e.message })); });

    function kur(j) {
      var T = window.THREE, r;
      try { r = new T.WebGLRenderer({ antialias: true }); } catch (e) { durum.innerHTML = ''; durum.appendChild(el('div', { class: 'bos hata-metni', text: 'WebGL açılamadı.' })); return; }
      r.setPixelRatio(Math.min(2, window.devicePixelRatio || 1)); r.outputEncoding = T.sRGBEncoding;
      tuval.appendChild(r.domElement);
      var sahne = new T.Scene(); sahne.background = new T.Color(0x060c11);
      var kam = new T.PerspectiveCamera(35, 1, 0.01, 20), kont = new T.OrbitControls(kam, r.domElement); kont.enableDamping = !AZ_HAREKET;
      sahne.add(new T.HemisphereLight(0xdff6ff, 0x1a2228, 0.85)); var dl = new T.DirectionalLight(0xffffff, 0.85); dl.position.set(-1, 2, 3); sahne.add(dl);
      S.T = T; S.kam = kam; S.kont = kont; S.r = r;
      function boyut() { var w = tuval.clientWidth || 600, h = tuval.clientHeight || 500; r.setSize(w, h, false); kam.aspect = w / h; kam.updateProjectionMatrix(); }
      boyut(); window.addEventListener('resize', boyut);
      var s = atob(j.veri), u = new Uint8Array(s.length); for (var i = 0; i < s.length; i++) u[i] = s.charCodeAt(i);
      new T.GLTFLoader().parse(u.buffer, '', function (g) {
        sahne.add(g.scene);
        g.scene.traverse(function (o) {
          if (!o.isMesh) return;
          var rol = o.name && /^(k_|m_)/.test(o.name) ? o.name : (o.parent && o.parent.name) || o.name;
          if (!o.geometry.attributes.normal) o.geometry.computeVertexNormals();
          if (o.geometry.attributes.color) o.geometry.deleteAttribute('color');
          var kasMi = /^m_/.test(rol), sabit = /^k_(govde|pelvis)_/.test(rol);
          o.material = new T.MeshStandardMaterial({ color: kasMi ? 0xb5473f : 0xe2d8c4, roughness: kasMi ? 0.6 : 0.78, transparent: sabit, opacity: sabit ? 0.35 : 1, depthWrite: !sabit });
          o.matrixAutoUpdate = false; o.updateMatrix();
          S.roller[rol] = o;
        });
        Object.keys(S.meta.segmentler).forEach(function (seg) { S.seg[seg] = S.meta.segmentler[seg].map(function (r) { return S.roller[r]; }).filter(Boolean); });
        var V = function (a) { return new T.Vector3(a[0], a[1], a[2]); };
        S.kas = S.meta.kaslar.map(function (k) {
          var o = S.roller[k.rol]; if (!o) return null;
          var O = V(k.kok), I = V(k.uc), a0 = I.clone().sub(O); var L0 = a0.length(); a0.normalize();
          return Object.assign({}, k, { o: o, O: O, I: I, a0: a0, L0: L0 });
        }).filter(Boolean);
        eklemHazirla();
        panelCiz();
        var kutu = new T.Box3().setFromObject(g.scene), mer = kutu.getCenter(new T.Vector3()), byt = kutu.getSize(new T.Vector3()).length();
        kont.target.copy(mer); kam.position.copy(mer.clone().add(new T.Vector3(-0.55, 0.15, 1).normalize().multiplyScalar(byt * 1.15)));
        durum.innerHTML = '';
        turKur();
        // görünüm seçenekleri
        [['Kaslar', function (v) { S.kas.forEach(function (k) { k.o.visible = v; }); }], ['Gövde/pelvis', function (v) { Object.keys(S.roller).forEach(function (r) { if (/^k_(govde|pelvis)_/.test(r)) S.roller[r].visible = v; }); }]].forEach(function (x) {
          var c = el('button', { class: 'cip', type: 'button', 'aria-pressed': 'true' }, [x[0]]);
          c.addEventListener('click', function () { var v = c.getAttribute('aria-pressed') !== 'true'; c.setAttribute('aria-pressed', String(v)); x[1](v); });
          gorKontrol.appendChild(c);
        });
        gorKontrol.appendChild(el('button', { class: 'cip', type: 'button', onclick: function () { poz({}); } }, ['↺ Nötr pozisyon']));
        var sonListe = 0;
        (function dongu() {
          if (!document.body.contains(r.domElement)) return;
          requestAnimationFrame(dongu);
          var degisti = false;
          Object.keys(S.hedef).forEach(function (k) { var c = S.aci[k] || 0, h = S.hedef[k]; if (Math.abs(h - c) > 0.05) { S.aci[k] = AZ_HAREKET ? h : c + (h - c) * 0.1; degisti = true; } else if (c !== h) { S.aci[k] = h; degisti = true; } });
          if (degisti || !S.ilk) { S.ilk = true; uygula(S.aci); if (performance.now() - sonListe > 250) { sonListe = performance.now(); listeCiz(); sliderGuncelle(true); } }
          kont.update(); r.render(sahne, kam);
          if (S.halka) { var o = /^eklem:/.test(S.halka) ? null : S.roller[S.halka], c = o ? merkez(o) : eklemNoktasi(S.halka.replace('eklem:', '')); if (c) { var p = c.project(kam); lab.halka((p.x + 1) / 2 * r.domElement.clientWidth, (1 - p.y) / 2 * r.domElement.clientHeight + tuval.offsetTop, 36, p.z < 1); } } else lab.halka(0, 0, 0, false);
        })();
        // dokunarak kas seç
        var ray = new T.Raycaster(), fare = new T.Vector2(), bas = null;
        r.domElement.addEventListener('pointerdown', function (e) { bas = [e.clientX, e.clientY]; });
        r.domElement.addEventListener('pointerup', function (e) {
          if (!bas || Math.hypot(e.clientX - bas[0], e.clientY - bas[1]) > 6) return;
          var rc = r.domElement.getBoundingClientRect(); fare.set(((e.clientX - rc.left) / rc.width) * 2 - 1, -((e.clientY - rc.top) / rc.height) * 2 + 1);
          ray.setFromCamera(fare, kam);
          var kemikler = Object.keys(S.roller).filter(function (k) { return /^k_/.test(k) && S.roller[k].visible; }).map(function (k) { return S.roller[k]; });
          var h = ray.intersectObjects(S.kas.filter(function (k) { return k.o.visible; }).map(function (k) { return k.o; }).concat(kemikler), false);
          if (!h.length) { etiket.gizle(); return; }
          var rol = Object.keys(S.roller).filter(function (k) { return S.roller[k] === h[0].object; })[0];
          if (/^k_/.test(rol)) {
            // kemik: adı Anatomi 3B kataloğundan (aynı BodyParts3D İngilizce adı)
            kemikAdlari().then(function (ad) { var k = ad[rol.replace(/^k_[a-z]+_/, '').replace(/_/g, ' ')]; etiket.goster(h[0].object, h[0].point, k ? k.tr : rol, k ? k.la : null, k && (k.dogrulama === 'doğrulanmadı' || k.dogrulama === 'kitapla çelişiyor') ? 'Ad: ' + k.dogrulama : null); });
            return;
          }
          lab.duraklat(); kasSec(rol);
          var k = S.kas.filter(function (x) { return x.rol === rol; })[0];
          if (k) etiket.goster(h[0].object, h[0].point, k.la, k.en,k.kitapta ? null : 'Ad: doğrulanmadı');
        });
        var etiket = S.etiket = U.labEtiket(tuval, kam);
      }, function () { durum.innerHTML = ''; durum.appendChild(el('div', { class: 'bos hata-metni', text: 'Model açılamadı.' })); });
    }

    /* ---- eklem zinciri ---- */
    function eklemHazirla() {
      var T = S.T, V = function (a) { return new T.Vector3(a[0], a[1], a[2]); };
      var medialX = (S.meta.eklemler[0].pivot[0] < 0) ? 1 : -1; // sağ uzuv (x<0) için medial +x
      S.meta.eklemler.forEach(function (e) {
        e.P = V(e.pivot);
        var cocukMer = new T.Vector3(), n = 0;
        (S.seg[e.cocuk] || []).forEach(function (o) { o.geometry.computeBoundingSphere(); cocukMer.add(o.geometry.boundingSphere.center); n++; });
        if (n) cocukMer.multiplyScalar(1 / n);
        e.hareketler.forEach(function (h) {
          var ax = h.eksen === 'x' ? new T.Vector3(1, 0, 0) : h.eksen === 'z' || h.eksen === 'z_on' ? new T.Vector3(0, 0, 1) : h.eksen === 'y' ? cocukMer.clone().sub(e.P).normalize() : V(e.eksenB).sub(V(e.eksenA)).normalize();
          var test = V(h.test), v2 = test.clone().applyAxisAngle(ax, 0.3), d = v2.sub(test);
          var ist = { '+z': d.z, '-z': -d.z, '-y': -d.y, 'lateral': -d.x * medialX, 'medial': d.x * medialX }[h.yon];
          h.ax = ist >= 0 ? ax : ax.clone().negate();
          S.aci[e.id + '.' + h.id] = 0; S.hedef[e.id + '.' + h.id] = 0;
        });
      });
      S.sira = Object.keys(S.meta.zincir); // ebeveyn önce
    }
    function matrisler(aci) {
      var T = S.T, M = {};
      S.sira.forEach(function (seg) {
        var eb = S.meta.zincir[seg];
        if (!eb) { M[seg] = new T.Matrix4(); return; }
        var e = S.meta.eklemler.filter(function (x) { return x.cocuk === seg; })[0];
        var R = new T.Matrix4();
        if (e) e.hareketler.forEach(function (h) { var a = (aci[e.id + '.' + h.id] || 0) * Math.PI / 180; if (a) R.multiply(new T.Matrix4().makeRotationAxis(h.ax, a)); });
        var yerel = e ? new T.Matrix4().makeTranslation(e.P.x, e.P.y, e.P.z).multiply(R).multiply(new T.Matrix4().makeTranslation(-e.P.x, -e.P.y, -e.P.z)) : new T.Matrix4();
        M[seg] = M[eb].clone().multiply(yerel);
      });
      return M;
    }
    function kasMatris(k, M) {
      var T = S.T, O2 = k.O.clone().applyMatrix4(M[k.segKok]), I2 = k.I.clone().applyMatrix4(M[k.segUc]);
      var a = I2.clone().sub(O2), L = a.length(); a.normalize();
      var s = Math.max(0.55, Math.min(1.8, L / k.L0)), kk = 1 / Math.sqrt(s), a0 = k.a0;
      var e = [kk + (s - kk) * a0.x * a0.x, (s - kk) * a0.x * a0.y, (s - kk) * a0.x * a0.z, (s - kk) * a0.y * a0.x, kk + (s - kk) * a0.y * a0.y, (s - kk) * a0.y * a0.z, (s - kk) * a0.z * a0.x, (s - kk) * a0.z * a0.y, kk + (s - kk) * a0.z * a0.z];
      var Sm = new T.Matrix4().set(e[0], e[1], e[2], 0, e[3], e[4], e[5], 0, e[6], e[7], e[8], 0, 0, 0, 0, 1);
      // kökün bağlı olduğu segmentin dönüşü + doğrultuyu yeni uca çevir
      var segRot = new T.Quaternion().setFromRotationMatrix(M[k.segKok]);
      var a0d = a0.clone().applyQuaternion(segRot);
      var R = new T.Matrix4().makeRotationFromQuaternion(new T.Quaternion().setFromUnitVectors(a0d, a).multiply(segRot));
      return { m: new T.Matrix4().makeTranslation(-k.O.x, -k.O.y, -k.O.z).premultiply(Sm).premultiply(R).premultiply(new T.Matrix4().makeTranslation(O2.x, O2.y, O2.z)), s: s };
    }
    function uygula(aci) {
      var M = matrisler(aci);
      S.sira.forEach(function (seg) { (S.seg[seg] || []).forEach(function (o) { o.matrix.copy(M[seg]); o.matrixWorldNeedsUpdate = true; }); });
      S.kas.forEach(function (k) {
        var r = kasMatris(k, M); k.s = r.s;
        k.o.matrix.copy(r.m); k.o.matrixWorldNeedsUpdate = true;
        var d = r.s - 1, mt = k.o.material;
        if (S.secKas && S.secKas !== k.rol) { mt.emissive.setRGB(0, 0, 0); saydam(mt, true); mt.opacity = 0.18; mt.depthWrite = false; }
        else { saydam(mt, false); mt.opacity = 1; mt.depthWrite = true; if (d < -0.01) mt.emissive.setRGB(Math.min(0.9, -d * 4), Math.min(0.15, -d), 0); else if (d > 0.01) mt.emissive.setRGB(0, Math.min(0.12, d), Math.min(0.8, d * 4)); else mt.emissive.setRGB(0, 0, 0); if (S.secKas === k.rol) mt.emissive.setRGB(Math.max(mt.emissive.r, 0.05), Math.max(mt.emissive.g, 0.3), Math.max(mt.emissive.b, 0.35)); }
      });
      S.M = M;
    }
    function kasDurumu(aci) {
      var M = matrisler(aci), l = S.kas.filter(function (k) { return k.L0 > 0.03; }).map(function (k) { var s = kasMatris(k, M).s; return { rol: k.rol, la: k.la, en: k.en, s: s, yuzde: Math.round((s - 1) * 100) }; });
      return { kisalan: l.filter(function (x) { return x.s < 0.97; }).sort(function (a, b) { return a.s - b.s; }), uzayan: l.filter(function (x) { return x.s > 1.03; }).sort(function (a, b) { return b.s - a.s; }) };
    }
    function poz(p) { Object.keys(S.hedef).forEach(function (k) { S.hedef[k] = p[k] || 0; }); sliderGuncelle(); }
    function eklemNoktasi(id) { var e = S.meta.eklemler.filter(function (x) { return x.id === id; })[0]; if (!e || !S.M) return null; var eb = S.meta.zincir[e.cocuk]; return e.P.clone().applyMatrix4(S.M[eb]); }
    function merkez(o) { o.geometry.computeBoundingSphere(); return o.geometry.boundingSphere.center.clone().applyMatrix4(o.matrixWorld); }
    function odakla(id) { var c = /^eklem:/.test(id) ? eklemNoktasi(id.slice(6)) : S.roller[id] ? merkez(S.roller[id]) : null; if (c) S.kont.target.copy(c); }
    function kasSec(rol) {
      S.secKas = rol; S.halka = rol; uygula(S.aci);
      if (!rol && S.etiket) S.etiket.gizle();
      bilgi.innerHTML = '';
      if (!rol) return;
      var k = S.kas.filter(function (x) { return x.rol === rol; })[0]; if (!k) return;
      bilgi.appendChild(el('h3', { text: k.la }));
      bilgi.appendChild(el('p', { class: 'an-la', text: k.en.replace(/\bright\b/, 'sağ') + ' · ' + segAd(k.segKok) + ' → ' + segAd(k.segUc) }));
      bilgi.appendChild(el('span', { class: 'etiket-kucuk ' + (k.kitapta ? 'kitap' : 'uyari'), text: k.kitapta ? 'Ad kitapta geçiyor' : 'Ad: doğrulanmadı' }));
      if (k.elle) bilgi.appendChild(el('p', { class: 'var-etiket', text: 'Tutunma yeri standart anatomiden (genel bilgi); tendon modelde yok.' }));
      var d = el('div', { class: 'kk-ic' }, [el('div', { class: 'yukleniyor', text: 'Kitapta aranıyor…' })]);
      bilgi.appendChild(d);
      bilgi.appendChild(el('button', { class: 'cip', type: 'button', onclick: function () { kasSec(null); } }, ['Seçimi kaldır']));
      var ad = k.la.replace(/^M\.\s*/, '').split(',')[0];
      U.indeksle('anatomi').then(function (ix) {
        var q = katla(ad), bul = ix.liste.filter(function (x) { return x.id && x.katli.indexOf(q) >= 0; }).slice(0, 3);
        d.innerHTML = '';
        if (!bul.length) d.appendChild(el('p', { class: 'var-etiket', text: 'Kitapta bu kas geçmiyor (kitap: "kas adları sınavda sorulmaz" notu var).' }));
        bul.forEach(function (x) { var b = ix.kj.bolumler[x.b], a = b.altlar[x.a]; d.appendChild(el('a', { class: 'kk-alinti', href: '#' + U.okuHash('anatomi', x.b), onclick: function () { Durum.vurguBlok = x.id; } }, [el('small', { text: 'Anatomi ' + (a.no || ('Bölüm ' + b.no)) }), el('span', { text: x.metin.slice(0, 220) + (x.metin.length > 220 ? '…' : '') })])); });
      });
    }
    function segAd(s) { return { govde: 'gövde/skapula', humerus: 'humerus', ulna: 'ulna', radius: 'radius', el: 'el', pelvis: 'pelvis', femur: 'femur', bacak: 'tibia/fibula', ayak: 'ayak' }[s] || s; }

    /* ---- panel ---- */
    var sliderlar = {};
    function panelCiz() {
      S.meta.eklemler.forEach(function (e) {
        var kap = el('details', { class: 'eklem-kutu', open: true }, [el('summary', null, [e.ad])]);
        e.hareketler.forEach(function (h) {
          var k = e.id + '.' + h.id, ad = YON_AD[h.id] || [h.ad, ''];
          var sl = el('input', { id: 'sl-' + e.id + '-' + h.id, type: 'range', min: String(h.min), max: String(h.max), value: '0', step: '1', 'aria-label': e.ad + ': ' + h.ad });
          var deger = el('span', { class: 'aci-deger', text: '0°' });
          sl.addEventListener('input', function () { lab.duraklat(); S.hedef[k] = +sl.value; deger.textContent = sl.value + '°'; });
          sliderlar[k] = { sl: sl, deger: deger };
          kap.appendChild(el('div', { class: 'hareket-satir' }, [
            el('label', { for: 'sl-' + e.id + '-' + h.id, text: h.ad }), el('div', { class: 'hareket-ic' }, [
              el('button', { class: 'cip', type: 'button', title: ad[1] + ' (' + h.min + '°)', onclick: function () { lab.duraklat(); S.hedef[k] = h.min; sliderGuncelle(); } }, [ad[1] || '−']),
              sl,
              el('button', { class: 'cip', type: 'button', title: ad[0] + ' (' + h.max + '°)', onclick: function () { lab.duraklat(); S.hedef[k] = h.max; sliderGuncelle(); } }, [ad[0]]), deger])]));
        });
        eklemKutu.appendChild(kap);
      });
    }
    function sliderGuncelle(yalnizDeger) { Object.keys(sliderlar).forEach(function (k) { var v = Math.round(yalnizDeger ? (S.aci[k] || 0) : S.hedef[k] || 0); if (!yalnizDeger) sliderlar[k].sl.value = String(S.hedef[k] || 0); sliderlar[k].deger.textContent = v + '°'; }); }
    function listeCiz() {
      var k = S.kas.filter(function (x) { return x.L0 > 0.03 && x.s && Math.abs(x.s - 1) > 0.03; }).sort(function (a, b) { return a.s - b.s; });
      kasListe.innerHTML = '';
      if (!k.length) { kasListe.appendChild(el('p', { class: 'var-etiket', text: 'Nötr pozisyon: kaslar dinlenim boyunda. Bir eklemi hareket ettir.' })); return; }
      var kis = k.filter(function (x) { return x.s < 1; }).slice(0, 8), uz = k.filter(function (x) { return x.s > 1; }).reverse().slice(0, 6);
      function grup(baslik, l, sinif) {
        if (!l.length) return;
        kasListe.appendChild(el('h4', { text: baslik }));
        l.forEach(function (x) { kasListe.appendChild(el('button', { class: 'kas-satir ' + sinif, type: 'button', onclick: function () { kasSec(x.rol); } }, [el('span', { text: x.la }), el('b', { text: (x.s > 1 ? '+' : '') + Math.round((x.s - 1) * 100) + '%' })])); });
      }
      grup('Kısalan (kasılan aday)', kis, 'kisa');
      grup('Uzayan (antagonist / gerilen)', uz, 'uzun');
    }

    /* ---- otomatik tur: her eklem, her hareket, iki yön ---- */
    function turKur() {
      var adimlar = [{ hedef: null, baslik: 'Nötr anatomik pozisyon', metin: 'Bütün eklemler 0°. Bir sonraki adımlarda her eklemin her hareketi sırayla gösterilecek; o pozda kısalan kaslar kırmızı, uzayanlar mavi parlar.', kaynakTur: 'genel', poz: {} }];
      S.meta.eklemler.forEach(function (e) {
        e.hareketler.forEach(function (h) {
          var ad = YON_AD[h.id] || [h.ad, h.ad];
          [[h.max, ad[0]], [h.min, ad[1]]].forEach(function (x) {
            if (!x[0]) return;
            var p = {}; p[e.id + '.' + h.id] = x[0];
            var d = kasDurumu(p);
            var kis = d.kisalan.slice(0, 4).map(function (k) { return k.la.replace(/^M\. /, '') + ' (' + k.yuzde + '%)'; });
            var uz = d.uzayan.slice(0, 3).map(function (k) { return k.la.replace(/^M\. /, '') + ' (+' + k.yuzde + '%)'; });
            adimlar.push({ hedef: 'eklem:' + e.id, baslik: e.ad.split(' (')[0] + ': ' + x[1] + ' (' + Math.abs(x[0]) + '°)', poz: p, isaret: true, kaynakTur: 'genel',
              metin: (kis.length ? 'Kısalan kaslar: ' + kis.join(', ') + '. ' : 'Belirgin kısalan kas yok. ') + (uz.length ? 'Uzayanlar: ' + uz.join(', ') + '. ' : '') + '(Geometriden hesaplandı, şematik.)' });
          });
        });
      });
      adimlar.push({ hedef: null, baslik: 'Nötr pozisyon', metin: 'Tur bitti. Kaydırıcılarla eklemleri birlikte hareket ettirip kasların nasıl paylaştığını gözle; bir kasa dokununca kitapta geçtiği yer açılır.', kaynakTur: 'genel', poz: {} });
      lab.baslat(adimlar, BASLIK[bolge]);
      var git0 = lab.git.bind(lab);
      lab.git = function (k) { git0(k); var a = lab.adimlar[lab.i]; if (a && a.poz) { S.secKas = null; poz(a.poz); } };
      lab.duraklat(); lab.git(0);
    }
  }

  U.SEKMELER.forEach(function (s) { if (s.id === 'lab-hareket') s.ad = 'Hareket'; });
})();
