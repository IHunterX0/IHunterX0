/* 1001 — Aşama 8: şematik hareket animasyonları (solunum, dirsek fleksiyonu) */
(function () {
  'use strict';
  var U = window.Uygulama, A = window.KitapAyristir;
  var el = U.el, $ = U.$, $$ = U.$$, toast = U.toast, Y = U.Y, Kitaplik = U.Kitaplik, Durum = U.Durum;
  var katla = A.katla;
  var AZ_HAREKET = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var THREE_URL = 'https://cdn.jsdelivr.net/npm/three@0.147.0/build/three.min.js';
  var GLTF_URL = 'https://cdn.jsdelivr.net/npm/three@0.147.0/examples/js/loaders/GLTFLoader.js';
  var ORBIT_URL = 'https://cdn.jsdelivr.net/npm/three@0.147.0/examples/js/controls/OrbitControls.js';

  // Lab sohbetine sahneye özel araç ekleyebilmek için
  var eskiAraclar = U.Lab.prototype.araclar;
  U.Lab.prototype.araclar = function (iz, cev) {
    var l = eskiAraclar.call(this, iz, cev), self = this;
    (self.adaptor.ekAraclar || []).forEach(function (t) {
      var ex = t.execute;
      l.push({ name: t.name, description: t.description, inputSchema: t.inputSchema, execute: function (g) { iz.textContent = (iz.textContent ? iz.textContent + ' · ' : '⚙ ') + t.name + '(' + Object.keys(g || {}).map(function (k) { return g[k]; }).join(', ') + ')'; if (!iz.parentNode) cev.prepend(iz); return ex(g); } });
    });
    return l;
  };

  var SAHNE = {
    solunum: { ad: 'Solunum: nefes alma ve verme', fazAd: ['Ekspiryum (nefes verme)', 'İnspiryum (nefes alma)'], dugme: [['Nefes al', 1], ['Nefes ver', 0]], periyot: 5,
      kitap: ['diafram', 'diaphragma', 'inspiryum', 'kova sapı', 'pompa kolu'],
      adimlar: [
        { baslik: 'Dinlenim (ekspiryum sonu)', faz: 0, metin: 'Diyafram kubbe biçiminde yukarıda, kaburgalar aşağı eğik. Akciğerler en küçük hacimde.' },
        { baslik: 'Diyafram kasılır', faz: 0.5, hedef: 'diyafram', metin: 'İnspiryumun ana kası diyaframdır: kasılınca kubbesi düzleşip aşağı iner, göğüs boşluğu dikey yönde büyür.' },
        { baslik: 'Kaburgalar kalkar', faz: 0.8, hedef: 'kaburga_R_3', metin: 'Üst kaburgalar arka uçları etrafında dönüp sternumu öne-yukarı iter (pompa kolu); alt kaburgalar yana açılır (kova sapı). Göğüs ön-arka ve yan çapta genişler.' },
        { baslik: 'Akciğerler genişler', faz: 1, hedef: 'akciger_R', metin: 'Göğüs boşluğu büyüyünce plevral basınç düşer, akciğerler pasif olarak genişler ve hava içeri akar.' },
        { baslik: 'Nefes verme', faz: 0, metin: 'Sakin ekspiryum pasiftir: kaslar gevşer, akciğer ve göğüs duvarının esnek geri dönüşü havayı dışarı iter.' }
      ] }
  };

  var H = { meta: null };
  function metaYukle() { if (!H.meta) H.meta = fetch('lab/hareket/hareket.json').then(function (r) { if (!r.ok) throw new Error('hareket verisi yok'); return r.json(); }); return H.meta; }

  U.GORUNUMLER['lab-hareket'] = function (sahneId) { if (sahneId === 'ust' || sahneId === 'alt' || sahneId === 'dirsek') { U.git('lab-eklem-' + (sahneId === 'alt' ? 'alt' : 'ust')); return; } labHareket('solunum'); };
  U.sahneCipleri = function (aktif) { var d = el('div', { class: 'yp-dugmeler' }); [['solunum', 'Solunum', 'lab-hareket-solunum'], ['ust', 'Üst ekstremite', 'lab-eklem-ust'], ['alt', 'Alt ekstremite', 'lab-eklem-alt']].forEach(function (x) { d.appendChild(el('button', { class: 'cip', type: 'button', 'aria-pressed': String(x[0] === aktif), onclick: function () { if (x[0] !== aktif) U.git(x[2]); } }, [x[1]])); }); return d; };
  function labHareket(sahneId) {
    var ana = $('#ana'); ana.innerHTML = '';
    var sayfa = el('div', { class: 'lab-sayfa' }); ana.appendChild(sayfa);
    var sahneKap = el('div', { class: 'lab-sahne' });
    var tuval = el('div', { class: 'lab-tuval', role: 'img', 'aria-label': 'Şematik 3B hareket animasyonu' });
    sahneKap.appendChild(tuval);
    var yan = el('aside', { class: 'lab-yan' });
    sayfa.appendChild(sahneKap); sayfa.appendChild(yan);
    var secici = U.sahneCipleri(sahneId);
    sahneKap.appendChild(el('div', { class: 'lab-ust' }, [el('div', { class: 'ust-etiket', text: 'Hareket · şematik animasyon' }), secici]));
    var kontrol = el('div', { class: 'lab-stiller hareket-kontrol' });
    sahneKap.appendChild(kontrol);
    var durum = el('div', { class: 'lab-durum' }, [el('div', { class: 'yukleniyor', text: 'Sahne yükleniyor…' })]);
    sahneKap.appendChild(durum);
    var S = { faz: 0, hedefFaz: 0, dongu: !AZ_HAREKET, roller: {}, t0: performance.now() };
    var tanim = SAHNE[sahneId];
    var lab = new U.Lab(sahneKap, {
      tur: 'hareket animasyonu (' + tanim.ad + ')', ornekSoru: sahneId === 'solunum' ? 'Örn. "nefes alırken diyafram ne yapar?"' : 'Örn. "fleksiyonda hangi kas kasılır?"',
      katalog: function () { return Object.keys(S.roller).map(function (r) { return { id: r, ad: rolAd(r) }; }); },
      goster: function (id) { vurgula(id); }, kamera: function (id) { odakla(id); }, isaret: function (id) { S.halka = id; }, sifirla: function () { vurgula(null); S.halka = null; },
      ekAraclar: [{ name: 'animasyon_oynat', description: 'Sahnedeki şematik animasyonu sürer. faz: "' + tanim.dugme.map(function (d) { return d[0]; }).join('", "') + '", "dongu" (sürekli) ya da 0-1 arası sayı.',
        inputSchema: { type: 'object', properties: { faz: { type: 'string' } }, required: ['faz'] },
        execute: function (g) { var f = String(g.faz || ''); var d = tanim.dugme.filter(function (x) { return katla(x[0]) === katla(f); })[0]; if (f === 'dongu') { S.dongu = true; return 'Döngü başladı.'; } S.dongu = false; S.hedefFaz = d ? d[1] : Math.max(0, Math.min(1, +f || 0)); return 'Faz: ' + S.hedefFaz; } }]
    });
    sahneKap.appendChild(lab.hud);
    var uyari = el('p', { class: 'uyari-kutu', text: 'Şematik animasyon: hareketin yönü ve sırası öğretici amaçla gösterilir; açı ve mesafeler gerçek ölçü değildir. BodyParts3D modelinde akciğer yüzeyi olmadığı için akciğer hacmi bronş ağacının dışbükey zarfından yaklaşık türetildi.' });
    yan.appendChild(el('section', { class: 'lab-kutu' }, [el('h3', { text: tanim.ad }), uyari]));
    yan.appendChild(el('section', { class: 'lab-kutu' }, [el('h3', { text: 'Tur' }), lab.adimListe, lab.kontrol, lab.metin]));
    var kitapKutu = el('section', { class: 'lab-kutu' }, [el('h3', { text: 'Kitapta' }), el('div', { class: 'yukleniyor', text: 'Aranıyor…' })]);
    yan.appendChild(kitapKutu);
    var sohbetKutu = el('section', { class: 'lab-kutu ai-gerek' }, [el('h3', { text: 'Asistana yaz' })]);
    yan.appendChild(sohbetKutu);
    lab.sohbet(sohbetKutu, function () { return 'Sahne: ' + tanim.ad + '. Şu anki faz: ' + (S.faz > 0.5 ? tanim.fazAd[1] : tanim.fazAd[0]) + '. Önce animasyon_oynat ile hareketi göster.'; });
    var atif = el('p', { class: 'lab-atif' }); yan.appendChild(atif);
    kitapAra(tanim.kitap, kitapKutu);

    // kontroller
    var kaydirici = el('input', { id: 'hareketFaz', type: 'range', min: '0', max: '1000', value: '0', 'aria-label': tanim.fazAd[0] + ' → ' + tanim.fazAd[1] });
    var dongDug = el('button', { class: 'cip', type: 'button', 'aria-pressed': String(S.dongu) }, ['⟳ Döngü']);
    dongDug.addEventListener('click', function () { S.dongu = !S.dongu; dongDug.setAttribute('aria-pressed', String(S.dongu)); if (!S.dongu) S.hedefFaz = S.faz; });
    tanim.dugme.forEach(function (d) { kontrol.appendChild(el('button', { class: 'cip', type: 'button', onclick: function () { S.dongu = false; dongDug.setAttribute('aria-pressed', 'false'); S.hedefFaz = d[1]; } }, [d[0]])); });
    kontrol.appendChild(dongDug);
    kontrol.appendChild(el('label', { class: 'faz-etiket', for: 'hareketFaz' }, [kaydirici]));
    kaydirici.addEventListener('input', function () { S.dongu = false; dongDug.setAttribute('aria-pressed', 'false'); S.hedefFaz = +kaydirici.value / 1000; });

    function rolAd(r) {
      var t = { diyafram: 'Diyafram', akciger_R: 'Sağ akciğer (bronş ağacı ve damarlar)', akciger_L: 'Sol akciğer (bronş ağacı ve damarlar)', zarf_R: 'Sağ akciğer (yaklaşık hacim)', zarf_L: 'Sol akciğer (yaklaşık hacim)', humerus: 'Humerus', radius: 'Radius', ulna: 'Ulna', scapula: 'Scapula', clavicula: 'Clavicula' }[r];
      if (t) return t;
      var m = /^kaburga_([RL])_(\d+)$/.exec(r); if (m) return (m[1] === 'R' ? 'Sağ ' : 'Sol ') + m[2] + '. kaburga';
      if (/^sternum/.test(r)) return 'Sternum (' + r.split('_')[1] + ')';
      if (/^omur_T/.test(r)) return r.replace('omur_', '') + ' omuru';
      if (/^biceps/.test(r)) return 'Biceps brachii (' + r.replace(/^biceps_?/, '').replace(/_/g, ' ') + ')';
      if (/^triceps/.test(r)) return 'Triceps brachii (' + r.replace(/^triceps_?/, '').replace(/_/g, ' ') + ')';
      if (/^el_/.test(r)) return 'El: ' + r.replace(/^el_/, '').replace(/_/g, ' ');
      return r;
    }
    function kitapAra(terimler, kap) {
      U.indeksle('anatomi').then(function (ix) {
        var bul = [];
        terimler.forEach(function (t) {
          var q = katla(t);
          for (var i = 0; i < ix.liste.length && bul.length < 4; i++) { var x = ix.liste[i]; if (x.id && /neden|klinik|p|liste/.test(x.tur) && x.katli.indexOf(q) >= 0 && !bul.some(function (b) { return b.id === x.id; })) { bul.push(x); break; } }
        });
        kap.innerHTML = ''; kap.appendChild(el('h3', { text: 'Kitapta' }));
        if (!bul.length) { kap.appendChild(el('p', { class: 'var-etiket', text: 'Kitapta doğrudan ilgili paragraf bulunamadı; tur metinleri genel bilgidir.' })); return; }
        bul.forEach(function (x) { var b = ix.kj.bolumler[x.b], a = b.altlar[x.a]; kap.appendChild(el('a', { class: 'kk-alinti', href: '#' + U.okuHash('anatomi', x.b), onclick: function () { Durum.vurguBlok = x.id; } }, [el('small', { text: 'Anatomi ' + (a.no || ('Bölüm ' + b.no)) }), el('span', { text: x.metin.slice(0, 240) + (x.metin.length > 240 ? '…' : '') })])); });
      });
    }

    Promise.all([metaYukle(), U.betik(THREE_URL, function () { return !!window.THREE; })]).then(function (r) {
      return Promise.all([U.betik(GLTF_URL, function () { return !!THREE.GLTFLoader; }), U.betik(ORBIT_URL, function () { return !!THREE.OrbitControls; })]).then(function () { return r[0]; });
    }).then(function (meta) {
      if (!meta.sahneler[sahneId]) throw new Error('Bu sahnenin verisi hazırlanmadı.');
      atif.textContent = meta.kaynak + ' · CC BY-SA 2.1 JP (türetilen içerik aynı lisansla paylaşılmalıdır). Animasyon şematiktir.';
      return fetch('lab/hareket/' + sahneId + '.glb.json').then(function (r) { return r.json(); }).then(function (j) { kur(meta.sahneler[sahneId], j); });
    }).catch(function (e) { durum.innerHTML = ''; durum.appendChild(el('div', { class: 'bos hata-metni', text: 'Sahne açılamadı: ' + e.message })); });

    function kur(meta, j) {
      var T = window.THREE, r;
      try { r = new T.WebGLRenderer({ antialias: true }); } catch (e) { durum.innerHTML = ''; durum.appendChild(el('div', { class: 'bos hata-metni', text: 'WebGL açılamadı.' })); return; }
      r.setPixelRatio(Math.min(2, window.devicePixelRatio || 1)); r.outputEncoding = T.sRGBEncoding;
      tuval.appendChild(r.domElement);
      var sahne = new T.Scene(); sahne.background = new T.Color(0x060c11);
      var kam = new T.PerspectiveCamera(35, 1, 0.01, 20);
      var kont = new T.OrbitControls(kam, r.domElement); kont.enableDamping = !AZ_HAREKET;
      sahne.add(new T.HemisphereLight(0xdff6ff, 0x1a2228, 0.85)); var dl = new T.DirectionalLight(0xffffff, 0.9); dl.position.set(1, 2, 3); sahne.add(dl);
      S.T = T; S.kam = kam; S.kont = kont;
      function boyut() { var w = tuval.clientWidth || 600, h = tuval.clientHeight || 500; r.setSize(w, h, false); kam.aspect = w / h; kam.updateProjectionMatrix(); }
      boyut(); window.addEventListener('resize', boyut);
      var s = atob(j.veri), u = new Uint8Array(s.length); for (var i = 0; i < s.length; i++) u[i] = s.charCodeAt(i);
      new T.GLTFLoader().parse(u.buffer, '', function (g) {
        sahne.add(g.scene);
        g.scene.traverse(function (o) {
          if (!o.isMesh) return;
          var rol = o.name && !/^mesh|^Mesh/.test(o.name) ? o.name : (o.parent && o.parent.name) || o.name;
          if (!o.geometry.attributes.normal) o.geometry.computeVertexNormals();
          if (o.geometry.attributes.color) o.geometry.deleteAttribute('color');
          var zarf = /^zarf_/.test(rol);
          var renk = zarf ? 0xf0a8a8 : /^akciger/.test(rol) ? 0xd98c8c : /^diyafram/.test(rol) ? 0xc0504d : /^(biceps|triceps)/.test(rol) ? 0xb5473f : 0xe2d8c4;
          o.material = new T.MeshStandardMaterial({ color: renk, roughness: 0.75, transparent: zarf || /^akciger/.test(rol), opacity: zarf ? 0.22 : /^akciger/.test(rol) ? 0.8 : 1, depthWrite: !(zarf || /^akciger/.test(rol)) });
          o.matrixAutoUpdate = false;
          o.updateMatrixWorld();
          S.roller[rol] = o;
        });
        hazirla(meta);
        var kutu = new T.Box3().setFromObject(g.scene), mer = kutu.getCenter(new T.Vector3()), byt = kutu.getSize(new T.Vector3()).length();
        kont.target.copy(mer); kam.position.copy(mer.clone().add(new T.Vector3(sahneId === 'dirsek' ? -0.35 : 0.25, 0.1, 1).normalize().multiplyScalar(byt * 1.25)));
        S.merkez = mer; S.boyut = byt;
        durum.innerHTML = '';
        lab.baslat(tanim.adimlar.map(function (a) { return { hedef: a.hedef ? hedefRol(a.hedef) : null, baslik: a.baslik, metin: a.metin, kaynakTur: 'genel', faz: a.faz }; }), tanim.ad);
        var git0 = lab.git.bind(lab);
        lab.git = function (k) { git0(k); var a = lab.adimlar[lab.i]; if (a && a.faz != null) { S.dongu = false; dongDug.setAttribute('aria-pressed', 'false'); S.hedefFaz = a.faz; } };
        lab.duraklat(); lab.git(0);
        (function dongu() {
          if (!document.body.contains(r.domElement)) return;
          requestAnimationFrame(dongu);
          if (S.dongu) S.hedefFaz = 0.5 - 0.5 * Math.cos(2 * Math.PI * ((performance.now() - S.t0) / 1000) / tanim.periyot);
          S.faz += (S.hedefFaz - S.faz) * (AZ_HAREKET ? 1 : 0.08);
          uygula(S.faz);
          kaydirici.value = String(Math.round(S.faz * 1000));
          kont.update(); r.render(sahne, kam);
          if (S.halka && S.roller[S.halka]) { var c = merkez(S.roller[S.halka]), p = c.project(kam); lab.halka((p.x + 1) / 2 * r.domElement.clientWidth, (1 - p.y) / 2 * r.domElement.clientHeight + tuval.offsetTop, 40, p.z < 1); } else lab.halka(0, 0, 0, false);
        })();
      }, function (e) { durum.innerHTML = ''; durum.appendChild(el('div', { class: 'bos hata-metni', text: 'Model açılamadı.' })); });
    }
    function hedefRol(h) { if (S.roller[h]) return h; return Object.keys(S.roller).filter(function (r) { return r.indexOf(h) === 0; })[0] || null; }
    function merkez(o) { o.geometry.computeBoundingSphere(); return o.geometry.boundingSphere.center.clone().applyMatrix4(o.matrixWorld); }
    function vurgula(id) {
      Object.keys(S.roller).forEach(function (r) { var m = S.roller[r].material; m.emissive.setHex(0); });
      var hedefler = id ? Object.keys(S.roller).filter(function (r) { return r === id || r.indexOf(id.replace(/_[^_]*$/, '')) === 0 && id.split('_')[0] === r.split('_')[0] && /^(biceps|triceps)/.test(id); }) : [];
      if (id && S.roller[id] && hedefler.indexOf(id) < 0) hedefler.push(id);
      hedefler.forEach(function (r) { S.roller[r].material.emissive.setHex(0x0b5f74); });
      S.halka = id;
    }
    function odakla(id) { if (!S.roller[id]) return; var c = merkez(S.roller[id]); S.kont.target.copy(c); }

    // ---- hareket tanımları ----
    var V = function (a) { return new S.T.Vector3(a[0], a[1], a[2]); };
    function hazirla(meta) {
      var T = S.T;
      S.anim = [];
      if (sahneId === 'solunum') {
        var arkaOrt = new T.Vector3(); (meta.kaburgalar || []).forEach(function (k) { arkaOrt.add(V(k.arka)); }); arkaOrt.multiplyScalar(1 / Math.max(1, meta.kaburgalar.length));
        (meta.kaburgalar || []).forEach(function (k) {
          var o = S.roller[k.rol]; if (!o) return;
          var arka = V(k.arka), on = V(k.on);
          var yanEksen = new T.Vector3(1, 0, 0);                // pompa kolu: transvers eksen
          var kovaEksen = on.clone().sub(arka).normalize();       // kova sapı: ön-arka uçları birleştiren eksen
          var aci = k.no <= 6 ? 0.07 : 0.05;
          var isaret = k.taraf === 'R' ? 1 : -1;
          S.anim.push(function (f) {
            var m = new T.Matrix4().makeTranslation(-arka.x, -arka.y, -arka.z);
            var q = new T.Quaternion().setFromAxisAngle(yanEksen, -aci * f * (k.no <= 6 ? 1 : 0.5));   // ön uç yukarı
            if (k.no >= 6) q.multiply(new T.Quaternion().setFromAxisAngle(kovaEksen, isaret * 0.09 * f)); // alt kaburgalar dışa
            m.premultiply(new T.Matrix4().makeRotationFromQuaternion(q)).premultiply(new T.Matrix4().makeTranslation(arka.x, arka.y, arka.z));
            o.matrix.copy(m); o.matrixWorldNeedsUpdate = true;
          });
        });
        ['sternum_manubrium', 'sternum_govde', 'sternum_xiphoid'].forEach(function (r) {
          var o = S.roller[r]; if (!o) return;
          S.anim.push(function (f) { o.matrix.makeTranslation(0, 0.012 * f, 0.014 * f); o.matrixWorldNeedsUpdate = true; });
        });
        var d = S.roller.diyafram, tepe = meta.parcalar.diyafram ? V(meta.parcalar.diyafram.tepe) : null;
        if (d && tepe) {
          d.geometry.computeBoundingBox(); var tab = d.geometry.boundingBox.min.y;
          S.anim.push(function (f) { // kubbe düzleşir ve iner: tabana göre y ölçeği küçülür, bütün aşağı kayar
            var sy = 1 - 0.35 * f, m = new T.Matrix4().makeTranslation(0, -tab, 0);
            m.premultiply(new T.Matrix4().makeScale(1 + 0.03 * f, sy, 1 + 0.03 * f)).premultiply(new T.Matrix4().makeTranslation(0, tab - 0.012 * f, 0));
            d.matrix.copy(m); d.matrixWorldNeedsUpdate = true;
          });
        }
        ['akciger_R', 'akciger_L', 'zarf_R', 'zarf_L'].forEach(function (r) {
          var o = S.roller[r], kaynak = r.replace('zarf_', 'akciger_'); if (!o || !meta.parcalar[kaynak]) return;
          var tp = V(meta.parcalar[kaynak].tepe);
          S.anim.push(function (f) { // apekse göre: aşağı ve yana büyür
            var m = new T.Matrix4().makeTranslation(-tp.x, -tp.y, -tp.z);
            m.premultiply(new T.Matrix4().makeScale(1 + 0.06 * f, 1 + 0.14 * f, 1 + 0.07 * f)).premultiply(new T.Matrix4().makeTranslation(tp.x, tp.y, tp.z));
            o.matrix.copy(m); o.matrixWorldNeedsUpdate = true;
          });
        });
      }
    }
    function uygula(f) { (S.anim || []).forEach(function (fn) { fn(f); }); }
  }

  // Anatomi lab'ine ve kavram kartlarına bağlantı
  var eskiLab = U.labDugmesi;
  U.labDugmesi = function (kap, ad, kj) {
    if (eskiLab) eskiLab(kap, ad, kj);
    var q = katla(ad);
    var hedef = /diafra|diaphragm|solunum|inspir|ekspir|kova sap|pompa kol|akciger|pulmo/.test(q) ? 'solunum' : /biceps|triceps|fleksiyon|ekstansiyon|abduksiyon|rotasyon|pronasyon|supinasyon|dirsek|omuz|bilek|kaldirac|agonist|antagonist|deltoid|brachialis|carpi/.test(q) ? 'ust' : /kalca|diz|ayak bilegi|gluteus|femoris|vastus|gastrocnemius|soleus|tibialis|plantar|dorsifleksiyon|inversiyon|eversiyon|sartorius|adductor|iliopsoas|psoas/.test(q) ? 'alt' : null;
    if (hedef) kap.prepend(el('a', { class: 'dugme kucuk ana lab-dug', href: hedef === 'solunum' ? '#lab-hareket-solunum' : '#lab-eklem-' + hedef, onclick: function () { U.panelKapat(); } }, ['▶ Animasyon: ' + (hedef === 'solunum' ? 'Solunum' : hedef === 'ust' ? 'Üst ekstremite hareketleri' : 'Alt ekstremite hareketleri')]));
  };
  U.SEKMELER.push({ id: 'lab-hareket', ad: 'Hareket', ikon: '◠' });
  U.sekmeleriCiz();
})();
