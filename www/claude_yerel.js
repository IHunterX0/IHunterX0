/* 1001 — cihaz sürümü (APK / iPhone ana ekran uygulaması): claude.ai'nin window.claude yeteneklerinin yerel karşılığı.
   db → IndexedDB (bellekte önbellekli), sample → Gemini API (anahtar cihazda), assets → IndexedDB blob, downloads → Android köprüsü ya da tarayıcı indirmesi.
   Uygulama kodu değişmeden çalışsın diye arayüz claude.ai ile aynıdır. */
(function () {
  'use strict';
  var MODEL = 'gemini-3.5-flash', YEDEK_MODEL = 'gemini-3.5-flash-lite';
  var API = 'https://generativelanguage.googleapis.com/v1beta/models/';
  var K = window.AndroidKopru || null;
  // claude.ai içinde (Artifact) açıldıysa gerçek yetenekler kullanılır: yapay zekâ Claude hesabından, veriler hesapta senkron (kullanıcı, 2026-11-04: iPhone'da bilgisayarsız kullanım)
  if (!K && window.claude && typeof window.claude.use === 'function' && !window.claude.__yerel) return;

  /* ---------- IndexedDB ---------- */
  function idbAc() {
    return new Promise(function (ok, red) {
      var r = indexedDB.open('1001-yerel', 1);
      r.onupgradeneeded = function () { r.result.createObjectStore('db'); r.result.createObjectStore('blob'); };
      r.onsuccess = function () { ok(r.result); }; r.onerror = function () { red(r.error); };
    });
  }
  var idb = idbAc();
  function idbIs(depo, kip, fn) { return idb.then(function (d) { return new Promise(function (ok, red) { var t = d.transaction(depo, kip); var s = fn(t.objectStore(depo)); t.oncomplete = function () { ok(s && s.result); }; t.onerror = function () { red(t.error); }; }); }); }

  /* ---------- db ---------- */
  var bellek = null;
  var yukle = idb.then(function (d) {
    return new Promise(function (ok) {
      bellek = {};
      var t = d.transaction('db', 'readonly'), s = t.objectStore('db').openCursor();
      s.onsuccess = function () { var c = s.result; if (c) { bellek[c.key] = c.value; c.continue(); } else ok(); };
      s.onerror = function () { ok(); };
    });
  }).catch(function () { bellek = bellek || {}; });
  function kopya(v) { return v == null ? v : JSON.parse(JSON.stringify(v)); }
  function yaz(yol, v) { if (v === undefined) { delete bellek[yol]; return idbIs('db', 'readwrite', function (s) { return s.delete(yol); }); } bellek[yol] = kopya(v); return idbIs('db', 'readwrite', function (s) { return s.put(bellek[yol], yol); }); }
  function snap(yol) { var v = bellek[yol]; return { id: yol.split('/').pop(), ref: docRef(yol), exists: v !== undefined, data: function () { return kopya(v); }, metadata: { fromCache: false, hasPendingWrites: false } }; }
  var dinleyiciler = [];
  function haberVer() { dinleyiciler.forEach(function (f) { try { f(); } catch (e) {} }); }
  function docRef(yol) {
    return { id: yol.split('/').pop(), path: yol,
      get: function () { return yukle.then(function () { return snap(yol); }); },
      set: function (d, o) { return yukle.then(function () { var v = o && o.merge && bellek[yol] ? Object.assign(kopya(bellek[yol]), d) : d; return yaz(yol, v); }).then(haberVer); },
      update: function (d) { return yukle.then(function () { if (bellek[yol] === undefined) throw { code: 'not_found', message: 'belge yok' }; return yaz(yol, Object.assign(kopya(bellek[yol]), d)); }).then(haberVer); },
      delete: function () { return yukle.then(function () { return yaz(yol, undefined); }).then(haberVer); },
      onSnapshot: function (n) { var f = function () { n(snap(yol)); }; dinleyiciler.push(f); yukle.then(f); return function () { dinleyiciler = dinleyiciler.filter(function (x) { return x !== f; }); }; },
      collection: function (p) { return colRef(yol + '/' + p); } };
  }
  function colRef(yol, q) {
    q = q || { w: [], o: [], l: 0 };
    function calis() {
      var on = yol + '/';
      var l = Object.keys(bellek).filter(function (k) { return k.indexOf(on) === 0 && k.slice(on.length).indexOf('/') < 0; }).map(snap);
      q.w.forEach(function (w) { l = l.filter(function (s) { var v = (s.data() || {})[w[0]]; switch (w[1]) { case '==': return v === w[2]; case '!=': return v !== w[2]; case '<': return v < w[2]; case '<=': return v <= w[2]; case '>': return v > w[2]; case '>=': return v >= w[2]; case 'in': return (w[2] || []).indexOf(v) >= 0; case 'array-contains': return Array.isArray(v) && v.indexOf(w[2]) >= 0; } return true; }); });
      q.o.forEach(function (o) { l.sort(function (a, b) { var x = (a.data() || {})[o[0]], y = (b.data() || {})[o[0]]; return (x < y ? -1 : x > y ? 1 : 0) * (o[1] === 'desc' ? -1 : 1); }); });
      if (q.l) l = l.slice(0, q.l);
      return { docs: l, size: l.length, empty: !l.length, forEach: function (f) { l.forEach(f); }, docChanges: function () { return []; }, metadata: { fromCache: false } };
    }
    var r = { path: yol, id: yol.split('/').pop(),
      doc: function (id) { return docRef(yol + '/' + (id || (Date.now().toString(36) + Math.random().toString(36).slice(2, 8)))); },
      add: function (d) { var x = r.doc(); return x.set(d).then(function () { return x; }); },
      where: function (a, op, b) { return colRef(yol, { w: q.w.concat([[a, op, b]]), o: q.o, l: q.l }); },
      orderBy: function (a, y) { return colRef(yol, { w: q.w, o: q.o.concat([[a, y || 'asc']]), l: q.l }); },
      limit: function (n) { return colRef(yol, { w: q.w, o: q.o, l: n }); },
      get: function () { return yukle.then(calis); },
      onSnapshot: function (n) { var f = function () { n(calis()); }; dinleyiciler.push(f); yukle.then(f); return function () { dinleyiciler = dinleyiciler.filter(function (x) { return x !== f; }); }; } };
    return r;
  }
  var db = { doc: docRef, collection: colRef };

  var user = { id: function () { return Promise.resolve('yerel'); }, me: function () { return Promise.resolve({ id: 'yerel', name: '', guest: false }); }, profiles: function () { return Promise.resolve({}); },
    isOwner: function () { return true; }, canEdit: function () { return true; }, can: function () { return true; } };

  /* ---------- Gemini anahtarı ---------- */
  function anahtar() {
    var k = '';
    try { k = localStorage.getItem('gemini_anahtar') || ''; } catch (e) {}
    if (!k && K && K.anahtar) { try { k = K.anahtar() || ''; } catch (e) {} }
    if (!k) {
      k = (window.prompt('Yapay zekâ için Gemini API anahtarını yapıştır (aistudio.google.com/apikey). Yalnız bu cihazda saklanır.') || '').trim();
      if (k) try { localStorage.setItem('gemini_anahtar', k); } catch (e) {}
    }
    return k;
  }
  window.yerelAyar = { anahtarDegistir: function () { try { localStorage.removeItem('gemini_anahtar'); } catch (e) {} return anahtar(); } };

  /* ---------- sample → Gemini ---------- */
  function blobB64(b) { return new Promise(function (ok, red) { var r = new FileReader(); r.onload = function () { ok(String(r.result).split(',')[1]); }; r.onerror = red; r.readAsDataURL(b); }); }
  function icerikler(input) {
    var l = typeof input === 'string' ? [{ role: 'user', content: input }] : input;
    return l.map(function (m) { return { role: m.role === 'assistant' ? 'model' : 'user', parts: [{ text: String(m.content) }] }; });
  }
  function hata(kod, m, metin) { var e = new Error(m || kod); e.code = kod; if (metin) e.text = metin; return e; }
  /* Model rotasyonu: her modelin ücretsiz kotası ayrı. 429 alan model dinlenmeye alınır (dakikalık 65 sn, günlük 6 sa),
     503/zaman aşımı 30 sn; istek hemen sıradakine geçer. Dinlenme süreleri cihazda saklanır (uygulama yeniden açılınca da geçerli). */
  var ZINCIR = ['gemini-3.8-flash', 'gemini-3.5-flash', 'gemini-3-flash-preview', 'gemini-3.6-flash', 'gemini-3.7-flash', 'gemini-3.1-flash-lite', 'gemini-3.5-flash-lite'];
  var HAFIF = ['gemini-3.1-flash-lite', 'gemini-3-flash-preview', 'gemini-3.8-flash', 'gemini-3.5-flash-lite'];
  var dinlen = {}; try { dinlen = JSON.parse(localStorage.getItem('gemini_dinlen') || '{}'); } catch (e) {}
  function dinlendir(m, sn) { dinlen[m] = Date.now() + sn * 1000; try { localStorage.setItem('gemini_dinlen', JSON.stringify(dinlen)); } catch (e) {} }
  function sira(model) {
    var l = (model === YEDEK_MODEL || model === 'hafif' ? HAFIF : ZINCIR).slice();
    var simdi = Date.now(), hazir = l.filter(function (m) { return !(dinlen[m] > simdi); });
    return hazir.length ? hazir : l.sort(function (a, b) { return (dinlen[a] || 0) - (dinlen[b] || 0); }).slice(0, 1);
  }
  function istek(model, govde, o, akis) {
    var l = sira(model), i = 0;
    function dene() {
      var m = l[i++];
      var bekle = dinlen[m] > Date.now() ? Math.min(30000, dinlen[m] - Date.now()) : 0; // hepsi dinleniyorsa en yakını bekle
      if (bekle && groqVar()) return Promise.reject(hata('rate_limited', 'Gemini modellerinin hepsi dinleniyor')); // beklemek yerine Groq yedeği
      if (bekle && window.Carvis && window.Carvis._durum) window.Carvis._durum('Kota doldu, ' + Math.ceil(bekle / 1000) + ' sn bekleniyor…');
      return new Promise(function (ok) { setTimeout(ok, bekle); }).then(function () { return istek1(m, govde, o, akis); }).then(function (r) { r.model = m; return r; }, function (e) {
        if (o && o.signal && o.signal.aborted) throw e;
        if (e && e.code === 'rate_limited') dinlendir(m, /per day|daily|PerDay/i.test(e.message || '') ? 6 * 3600 : 65);
        else if (e && (e.code === 'gecici')) dinlendir(m, 30);
        else throw e;
        if (i < l.length) return dene();
        throw e;
      });
    }
    return dene();
  }
  function istek1(model, govde, o, akis) {
    var k = anahtar(); if (!k) return Promise.reject(hata('not_granted', 'Gemini anahtarı yok'));
    var url = API + model + (akis ? ':streamGenerateContent?alt=sse' : ':generateContent');
    // Yanıt başlığı gelmezse (model takıldı) iptal et ve sıradakine geç. Uzun düşünen çağrılar o.zamanAsimi ile süre uzatır (varsayılan 25 sn).
    var ac = new AbortController(), zaman = false, zm = setTimeout(function () { zaman = true; ac.abort(); }, (o && o.zamanAsimi) || 25000);
    if (o && o.signal) { if (o.signal.aborted) ac.abort(); else o.signal.addEventListener('abort', function () { ac.abort(); }); }
    return fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-goog-api-key': k }, body: JSON.stringify(govde), signal: ac.signal }).then(function (r) {
      clearTimeout(zm);
      if (r.status === 429) return r.text().then(function (t) { throw hata('rate_limited', 'Gemini kotası doldu ' + t.slice(0, 600)); });
      if (r.status === 503 || r.status === 500 || r.status === 404) throw hata('gecici', 'HTTP ' + r.status);
      if (r.status === 400 || r.status === 403) return r.text().then(function (t) { if (/API key/i.test(t)) { try { localStorage.removeItem('gemini_anahtar'); } catch (e) {} throw hata('not_granted', 'Anahtar geçersiz'); } if (/too long|token/i.test(t)) throw hata('prompt_too_large'); throw hata('network', t.slice(0, 200)); });
      if (!r.ok) throw hata('network', 'HTTP ' + r.status);
      return r;
    }, function (e) { clearTimeout(zm); if (zaman) throw hata('gecici', 'zaman aşımı'); throw e && e.name === 'AbortError' ? hata('cancelled') : hata('network', String(e)); });
  }
  // Akışlı tek tur: metni ve fonksiyon çağrılarını toplar
  function tur(model, govde, o, onceki) {
    return istek(model, govde, o, true).then(function (r) {
      var okuyucu = r.body.getReader(), dec = new TextDecoder(), tampon = '', metin = '', parcalar = [], bitis = null, akisHata = null;
      function isle(satir) {
        if (satir.indexOf('data:') !== 0) return;
        var j; try { j = JSON.parse(satir.slice(5)); } catch (e) { return; }
        if (j.error) { if (window.__carvisKayit) console.log('AKIŞ HATASI ' + JSON.stringify(j.error).slice(0, 200)); akisHata = j.error; }
        var c = j.candidates && j.candidates[0]; if (!c) return;
        if (c.finishReason) bitis = c.finishReason;
        ((c.content && c.content.parts) || []).forEach(function (p) {
          parcalar.push(p);
          if (p.text && !p.thought) { metin += p.text; if (o && o.onText) o.onText({ text: onceki + metin, delta: p.text }); }
        });
      }
      function oku() {
        return okuyucu.read().then(function (x) {
          if (x.done) { if (tampon) isle(tampon); return { metin: metin, parcalar: parcalar, bitis: bitis }; }
          tampon += dec.decode(x.value, { stream: true });
          var s = tampon.split(/\r?\n/); tampon = s.pop(); s.forEach(isle);
          return oku();
        });
      }
      return oku();
    }).catch(function (e) { if (e && e.name === 'AbortError') throw hata('cancelled'); throw e; });
  }
  function sample(input, o) {
    o = o || {};
    var con = icerikler(input);
    var govde = { contents: con, generationConfig: { maxOutputTokens: 8192 } };
    var araclar = o.tools || [];
    if (araclar.length) govde.tools = [{ functionDeclarations: araclar.map(function (t) { var d = { name: t.name, description: t.description || '' }; if (t.inputSchema) d.parametersJsonSchema = t.inputSchema; return d; }) }];
    var imgSoz = (o.images && o.images.length) ? Promise.all(o.images.map(function (b) { return blobB64(b).then(function (d) { return { inline_data: { mime_type: b.type || 'image/jpeg', data: d } }; }); })) : Promise.resolve([]);
    var toplam = '', MAX_TUR = o.maxTur || 3, sonTur = false;
    function calis(model, n) {
      return tur(model, govde, o, toplam).then(function (r) {
        var cagrilar = r.parcalar.filter(function (p) { return p.functionCall; });
        if (window.__carvisKayit) console.log('TUR ' + n + ' metin=' + r.metin.length + ' cagri=' + cagrilar.map(function (p) { return p.functionCall.name; }).join(',') + ' bitis=' + r.bitis + ' parca=' + r.parcalar.length);
        toplam += r.metin;
        if (!cagrilar.length || sonTur) return { text: toplam, truncated: r.bitis === 'MAX_TOKENS', modelApplied: model };
        govde.contents.push({ role: 'model', parts: r.parcalar });
        return Promise.all(cagrilar.map(function (p) {
          var t = araclar.filter(function (x) { return x.name === p.functionCall.name; })[0];
          return Promise.resolve().then(function () { if (!t) throw new Error('Böyle bir araç yok'); return t.execute(p.functionCall.args || {}); })
            .then(function (v) { return { functionResponse: { name: p.functionCall.name, response: { sonuc: v === undefined ? null : v } } }; },
              function (e) { return { functionResponse: { name: p.functionCall.name, response: { hata: String(e && e.message || e) } } }; });
        })).then(function (cev) {
          // Kota tasarrufu: tur sınırına gelince araç tanımları kaldırılır; model eldeki sonuçlarla cevabı yazmak zorunda kalır
          if (n + 1 >= MAX_TUR && govde.tools) {
            delete govde.tools; sonTur = true;
            cev = cev.concat([{ text: '(Araç sınırı doldu. Araç çağırmadan, elindeki sonuçlarla kısa cevabını şimdi yaz.)' }]);
          }
          govde.contents.push({ role: 'user', parts: cev }); if (toplam && !/\s$/.test(toplam)) toplam += '\n\n'; return calis(model, n + 1);
        });
      });
    }
    return imgSoz.then(function (imgs) {
      if (imgs.length) { var son = govde.contents[govde.contents.length - 1]; son.parts = son.parts.concat(imgs); }
      return calis(o.hafif ? 'hafif' : MODEL, 0).catch(function (e) { if (e && e.code === 'rate_limited' && !toplam) return calis(YEDEK_MODEL, 0); throw e; });
    }).catch(function (e) { if (toplam && e && !e.text) e.text = toplam; throw e; });
  }
  sample.json = function (input, o) {
    o = o || {};
    var con = icerikler(input);
    function calis(model) {
      return istek(model, { contents: con, generationConfig: { responseMimeType: 'application/json', maxOutputTokens: 8192 } }, o, false).then(function (r) { return r.json(); }).then(function (j) {
        var t = ((j.candidates && j.candidates[0] && j.candidates[0].content && j.candidates[0].content.parts) || []).filter(function (p) { return !p.thought; }).map(function (p) { return p.text || ''; }).join('');
        return JSON.parse(t);
      });
    }
    return calis(MODEL).catch(function (e) { if (e && e.code === 'rate_limited') return calis(YEDEK_MODEL); throw e; });
  };
  // Kitapta olmayan bilgi için: Gemini + Google araması (kaynak linkleriyle)
  window.yerelGemini = { ara: function (soru, o) {
    function calis(model) {
      return istek(model, { contents: [{ role: 'user', parts: [{ text: soru }] }], tools: [{ google_search: {} }] }, o, false).then(function (r) { return r.json(); }).then(function (j) {
        var c = (j.candidates || [])[0] || {};
        var metin = ((c.content && c.content.parts) || []).filter(function (p) { return !p.thought; }).map(function (p) { return p.text || ''; }).join('');
        var kaynak = ((c.groundingMetadata && c.groundingMetadata.groundingChunks) || []).map(function (g) { return g.web ? { url: g.web.uri, baslik: g.web.title } : null; }).filter(Boolean);
        return { metin: metin, kaynaklar: kaynak };
      });
    }
    return calis(MODEL).catch(function (e) { if (e && e.code === 'rate_limited') return calis(YEDEK_MODEL); throw e; });
  } };
  sample.limits = function () { return Promise.resolve({ maxPromptBytes: 900000, images: { maxCount: 5, maxInputBytes: 7e6, mediaTypes: ['image/jpeg', 'image/png', 'image/webp'] }, tools: { maxCount: 20 } }); };

  /* ---------- Groq yedeği (ücretsiz): Gemini kotası dolunca / bütün modeller dinlenirken / 503'te ----------
     Kullanıcı (2026-11-02): "kota dolunca başka AI cevaplasa". Gemini'nin bütün ücretsiz modelleri aynı gün 429 verince
     Carvis "Dinliyorum"da kalıyordu. Groq (OpenAI uyumlu): araç çağırmalı sohbet + JSON. Görsel (resim) Groq'ta yok. */
  var GROQ_API = 'https://api.groq.com/openai/v1/chat/completions';
  var GROQ_ZINCIR = ['openai/gpt-oss-120b', 'qwen/qwen3.8-27b', 'openai/gpt-oss-20b'];
  var groqDinlen = {};
  function groqAnahtar() {
    var k = '';
    try { k = localStorage.getItem('groq_anahtar') || ''; } catch (e) {}
    if (!k && K && K.groqAnahtar) { try { k = K.groqAnahtar() || ''; } catch (e) {} }
    return k;
  }
  function groqVar() { return groqAnahtar().length > 10; }
  window.yerelAyar.groqVar = groqVar;
  /* ---------- Sağlayıcı zinciri (kullanıcı, 2026-11-03: "omniroute'u PC'siz/Termux'suz sen hallet", "ücret ödemeyeceğim") ----------
     OmniRoute'un yaptığını uygulamanın içinde yapar: OpenAI uyumlu ücretsiz sağlayıcılar sırayla denenir, kota/ağ hatasında
     sıradakine geçilir; en sonda Gemini + Groq. Her sağlayıcıda birden çok model (kendi içinde de sırayla). */
  var HAZIR_SAGLAYICI = {
    openrouter: { ad: 'OpenRouter (ücretsiz)', taban: 'https://openrouter.ai/api/v1', anahtarYeri: 'openrouter.ai → Keys (kart gerekmez)', ucretsizFiltre: true },
    github: { ad: 'GitHub Models', taban: 'https://models.github.ai/inference', modelListe: 'https://models.github.ai/catalog/models', anahtarYeri: 'github.com → Settings → Developer settings → Personal access tokens → Fine-grained → izin: Models (read)' },
    cerebras: { ad: 'Cerebras', taban: 'https://api.cerebras.ai/v1', anahtarYeri: 'cloud.cerebras.ai → API Keys' },
    nvidia: { ad: 'NVIDIA (NIM)', taban: 'https://integrate.api.nvidia.com/v1', anahtarYeri: 'build.nvidia.com → hesap aç → Get API Key (ücretsiz deneme kredisi)' },
    deepseek: { ad: 'DeepSeek', taban: 'https://api.deepseek.com', anahtarYeri: 'platform.deepseek.com → API keys (ücretli, çok ucuz; hesaba bakiye yükleyip anahtar oluştur)' },
    mistral: { ad: 'Mistral', taban: 'https://api.mistral.ai/v1', anahtarYeri: 'console.mistral.ai → API Keys (ücretsiz "Experiment" planı)' },
    omniroute: { ad: 'OmniRoute', taban: '', anahtarYeri: 'OmniRoute panelindeki API anahtarı (varsa)' }
  };
  function sagListe() {
    var l = null; try { l = JSON.parse(localStorage.getItem('saglayicilar_v1') || 'null'); } catch (e) {}
    if (!l) { // eski tek ayardan taşı
      l = []; var e = null; try { e = JSON.parse(localStorage.getItem('omni_ayar') || 'null'); } catch (x) {}
      if (e && e.url) l.push({ id: 's' + Date.now().toString(36), tur: /openrouter/.test(e.url) ? 'openrouter' : 'omniroute', ad: /openrouter/.test(e.url) ? 'OpenRouter (ücretsiz)' : 'OmniRoute', taban: e.url, anahtar: e.anahtar || '', modeller: e.model ? [e.model] : [], acik: e.acik !== false });
    }
    return l;
  }
  function sagYaz(l) { try { localStorage.setItem('saglayicilar_v1', JSON.stringify(l)); } catch (e) {} saglayiciNesneleri = null; }
  function sagAdres(taban, ek) {
    var u = String(taban || '').trim().replace(/\/+$/, '');
    if (!u) return '';
    if (/\/chat\/completions$/.test(u)) return ek === 'models' ? u.replace(/\/chat\/completions$/, '/models') : u;
    var b = /\/v1$|\/inference$|\/api\/v1$/.test(u) ? u : u + '/v1';
    return b + (ek === 'models' ? '/models' : '/chat/completions');
  }
  var sagUyku = {}, sagSonHata = {}, saglayiciNesneleri = null;
  function sagNesneleri() {
    if (saglayiciNesneleri) return saglayiciNesneleri;
    saglayiciNesneleri = sagListe().filter(function (x) { return x.acik !== false && x.taban && (x.anahtar || x.tur === 'omniroute') && (x.modeller || []).length; }).map(function (x) {
      return { id: x.id, ad: x.ad, api: function () { return sagAdres(x.taban); }, anahtar: function () { return x.anahtar || ''; }, dinlen: {}, anahtarsiz: true, yerelAg: true, ek: true,
        zincir: function () { return x.modeller.slice(0, 4); }, ince: function () {} };
    });
    return saglayiciNesneleri;
  }
  function sagHazir() { var t = Date.now(); return sagNesneleri().filter(function (S) { return !(sagUyku[S.id] > t); }); }
  // Android üzerinden ağ isteği (kullanıcı: OmniRoute tabletin içinde, Termux'ta → http://127.0.0.1:20128).
  // WebView'ın karışık içerik / CORS / yerel ağ kısıtlarına takılmaz; ek sağlayıcı istekleri bununla gider.
  var httpBekleyen = {}, httpSayac = 0;
  window.yerelHttpCevap = function (id, durum, govde, hataM) { var f = httpBekleyen[id]; delete httpBekleyen[id]; if (f) f(durum, govde, hataM); };
  function yerelFetch(url, o) {
    return new Promise(function (ok, red) {
      var id = 'h' + (++httpSayac), bitti = false;
      httpBekleyen[id] = function (durum, govde, hataM) {
        if (bitti) return; bitti = true;
        if (hataM) return red(new TypeError('Ağ hatası (Android): ' + hataM));
        ok({ ok: durum >= 200 && durum < 300, status: durum, headers: { get: function () { return null; } },
          json: function () { return Promise.resolve().then(function () { return JSON.parse(govde || '{}'); }); }, text: function () { return Promise.resolve(govde || ''); } });
      };
      if (o.signal) {
        if (o.signal.aborted) { bitti = true; return red(new DOMException('iptal', 'AbortError')); }
        o.signal.addEventListener('abort', function () { if (!bitti) { bitti = true; delete httpBekleyen[id]; red(new DOMException('iptal', 'AbortError')); } });
      }
      try { K.httpIstek(id, url, o.body == null ? null : o.body, JSON.stringify(o.headers || {}), 90000); } catch (e) { bitti = true; red(new TypeError('Android köprüsü: ' + e)); }
    });
  }
  function agIstegi(url, o, S) { return S && S.yerelAg && K && K.httpIstek ? yerelFetch(url, o) : fetch(url, o); }
  var GROQ = { ad: 'Groq', api: function () { return GROQ_API; }, anahtar: groqAnahtar, dinlen: groqDinlen,
    zincir: function (o, govde) { var arama = govde.tools && govde.tools.some(function (t) { return t.type === 'browser_search'; }); return (o && o.hafif && !arama ? GROQ_ZINCIR : GROQ_ZINCIR.filter(function (m) { return !/-20b$/.test(m) && !(arama && !/gpt-oss/.test(m)); })).slice(); },
    ince: function (m, g) { if (/gpt-oss/.test(m)) g.reasoning_effort = 'low'; else if (/qwen/.test(m)) g.reasoning_effort = 'none'; } };
  function groqMesajlar(input) {
    var l = typeof input === 'string' ? [{ role: 'user', content: input }] : input;
    return l.map(function (m) { return { role: m.role === 'assistant' ? 'assistant' : 'user', content: String(m.content) }; });
  }
  function groqIstek(govde, o, S) {
    S = S || GROQ;
    var groqDinlen = S.dinlen, k = S.anahtar();
    if (!k && !S.anahtarsiz) return Promise.reject(hata('not_granted', S.ad + ' anahtarı yok'));
    // Bilgi soruları yalnız güçlü modellerle (gpt-oss-20b PFK-1 basamağını yanlış anlattı, 2026-11-02); 20b yalnız tablet komutlarında
    var l = S.zincir(o, govde), i = 0, tur = 0;
    function dene() {
      // sıradaki açık model; hepsi sınırdaysa en erken açılanı (en çok 20 sn) bekle
      var acik = l.filter(function (x) { return !(groqDinlen[x] > Date.now()); });
      var m = acik.length ? acik[0] : l.slice().sort(function (a, b) { return groqDinlen[a] - groqDinlen[b]; })[0];
      var bekle = acik.length ? 0 : groqDinlen[m] - Date.now();
      if (bekle > 25000 || ++tur > 8) return Promise.reject(hata('rate_limited', S.ad + ' sınırı: ' + Math.ceil(bekle / 1000) + ' sn'));
      if (bekle > 0 && window.Carvis && window.Carvis._durum) window.Carvis._durum('Yoğunluk: ' + Math.ceil(bekle / 1000) + ' sn bekleniyor…');
      var g = Object.assign({ model: m }, govde);
      return new Promise(function (ok) { setTimeout(ok, Math.max(0, bekle)); }).then(function () { return dene1(m, g); });
    }
    function dene1(m, g) {
      S.ince(m, g);
      if (window.__carvisKayit) console.log(S.ad + ' İSTEK ' + m + ' ~' + Math.round(JSON.stringify(g).length / 3.2) + ' token');
      var ac = new AbortController(), zm = setTimeout(function () { ac.abort(); }, 30000);
      if (o && o.signal) { if (o.signal.aborted) ac.abort(); else o.signal.addEventListener('abort', function () { ac.abort(); }); }
      var bas = { 'Content-Type': 'application/json' }; if (k) bas.Authorization = 'Bearer ' + k;
      return agIstegi(S.api(), { method: 'POST', headers: bas, body: JSON.stringify(g), signal: ac.signal }, S).then(function (r) {
        clearTimeout(zm);
        return r.json().catch(function () { return {}; }).then(function (j) {
          if (r.ok) {
            j._model = m;
            // önden dönüş: bu modelin dakikalık token hakkı bir sonraki tura yetmeyecekse, sıfırlanana kadar diğer modeli kullan
            var kalan = +r.headers.get('x-ratelimit-remaining-tokens'), sif = /([\d.]+)(ms|s)/.exec(r.headers.get('x-ratelimit-reset-tokens') || '');
            if (kalan && kalan < 6500 && sif) groqDinlen[m] = Date.now() + (+sif[1]) * (sif[2] === 'ms' ? 1 : 1000) + 300;
            return j;
          }
          // dakikalık token sınırı (8K/model): Groq kaç saniye sonra açılacağını yazar ("try again in 4.2s")
          if (r.status === 429) { var sn = /try again in ([\d.]+)(ms|s|m)/i.exec(JSON.stringify(j)); var bek = sn ? (+sn[1]) * (sn[2] === 'ms' ? 1 : sn[2] === 'm' ? 60000 : 1000) : 20000; groqDinlen[m] = Date.now() + Math.min(bek + 300, /per day|TPD|RPD/i.test(JSON.stringify(j)) ? 6 * 3600e3 : 120000); }
          var e = hata(r.status === 429 ? 'rate_limited' : 'network', S.ad + ' ' + m + ' ' + r.status + ' ' + JSON.stringify(j.error || j).slice(0, 200)); throw e;
        });
      }, function (e) { clearTimeout(zm); throw o && o.signal && o.signal.aborted ? hata('cancelled') : hata('network', S.ad + ': ' + String(e)); })
        .catch(function (e) { if (e.code === 'cancelled') throw e; if (window.__carvisKayit) console.log('GROQ ' + e.message.slice(0, 120)); if (e.code !== 'rate_limited' && ++i >= l.length) throw e; if (e.code !== 'rate_limited') groqDinlen[m] = Date.now() + 30000; return dene(); });
    }
    return dene();
  }
  function groqSample(input, o, S) {
    o = o || {}; S = S || GROQ;
    if (o.images && o.images.length) return Promise.reject(hata('images_unavailable'));
    // dakikalık token sınırı için: istenirse bazı araçlar Groq'a gönderilmez (bilgi sorusunda müzik/WhatsApp vb.)
    var mesajlar = groqMesajlar(input), araclar = (o.tools || []).filter(function (t) { return !(o.groqAtla && o.groqAtla.test(t.name)); }), MAX_TUR = o.maxTur || 3, toplam = '';
    function kisa(sema) { var x = JSON.parse(JSON.stringify(sema || { type: 'object', properties: {} })); Object.keys(x.properties || {}).forEach(function (k) { var d = x.properties[k].description; if (d && d.length > 90) x.properties[k].description = d.slice(0, 90); }); return x; }
    var tanim = araclar.map(function (t) { var d = t.description || ''; return { type: 'function', function: { name: t.name, description: d.length > 260 ? d.slice(0, 257) + '…' : d, parameters: kisa(t.inputSchema) } }; });
    if (window.Carvis && window.Carvis._durum) window.Carvis._durum(S && S.ek ? 'Düşünüyor… (' + S.ad + ')' : 'Düşünüyor… (yedek yapay zekâ)');
    function calis(n) {
      var g = { messages: mesajlar, max_tokens: 4096, temperature: 0.4 };
      if (tanim.length && n < MAX_TUR) { g.tools = tanim; g.tool_choice = 'auto'; }
      return groqIstek(g, o, S).then(function (j) {
        var msg = (j.choices && j.choices[0] && j.choices[0].message) || {}, cagri = msg.tool_calls || [];
        if (window.__carvisKayit) console.log('GROQ TUR ' + n + ' ' + j._model + ' metin=' + (msg.content || '').length + ' cagri=' + cagri.map(function (c) { return c.function.name; }).join(','));
        if (msg.content) { toplam += (toplam && !/\s$/.test(toplam) ? '\n\n' : '') + msg.content; if (o.onText) o.onText({ text: toplam, delta: msg.content }); }
        if (!cagri.length) return { text: toplam, truncated: (j.choices[0] || {}).finish_reason === 'length', modelApplied: (S && S.ek ? S.ad + ':' : 'groq:') + j._model };
        mesajlar.push({ role: 'assistant', content: msg.content || '', tool_calls: cagri });
        return Promise.all(cagri.map(function (c) {
          var t = araclar.filter(function (x) { return x.name === c.function.name; })[0], arg = {};
          try { arg = JSON.parse(c.function.arguments || '{}'); } catch (e) {}
          return Promise.resolve().then(function () { if (!t) throw new Error('Böyle bir araç yok'); return t.execute(arg); })
            .then(function (v) { return { role: 'tool', tool_call_id: c.id, content: JSON.stringify(v === undefined ? null : v).slice(0, 5000) }; },
              function (e) { return { role: 'tool', tool_call_id: c.id, content: JSON.stringify({ hata: String(e && e.message || e) }) }; });
        })).then(function (cev) {
          mesajlar = mesajlar.concat(cev);
          if (n + 1 >= MAX_TUR) mesajlar.push({ role: 'user', content: '(Araç sınırı doldu. Araç çağırmadan, elindeki sonuçlarla kısa cevabını şimdi yaz.)' });
          return calis(n + 1);
        });
      });
    }
    return calis(0).catch(function (e) { if (toplam && !e.text) e.text = toplam; throw e; });
  }
  function groqJson(input, o, S) {
    var m = groqMesajlar(input); m[m.length - 1].content += '\n\nYalnız geçerli JSON döndür.';
    return groqIstek({ messages: m, max_tokens: 8192, temperature: 0.2, response_format: { type: 'json_object' } }, o, S).then(function (j) {
      var t = (j.choices && j.choices[0] && j.choices[0].message && j.choices[0].message.content) || '';
      var x = /[\[{][\s\S]*[\]}]/.exec(t); return JSON.parse(x ? x[0] : t);
    });
  }
  // Yedeğe geçilecek hatalar: kota, geçici (503/zaman aşımı), ağ — ama yarıda kalmış metin varsa değil
  function yedeklenir(e, o) { return groqVar() && e && !e.text && !(o && o.images && o.images.length) && /rate_limited|gecici|network/.test(e.code || ''); }
  var geminiSample = sample, geminiJson = sample.json, geminiAra = window.yerelGemini.ara;
  var anaSample = function (input, o) {
    // Yönlendirme (2026-11-02): Gemini flash modelleri ücretsizde model başına GÜNDE 20 istek → değerli; tablet komutları
    // (müzik, ses, pomodoro, WhatsApp…) Groq'a gider (hızlı, günde 1000). Groq olmazsa Gemini.
    if (o && o.hafif && groqVar() && !(o.images && o.images.length)) {
      return groqSample(input, o).catch(function (e) { if (e && (e.code === 'cancelled' || e.text)) throw e; if (window.__carvisKayit) console.log('Groq olmadı → Gemini: ' + String(e.message || '').slice(0, 80)); return geminiSample(input, o); });
    }
    return geminiSample(input, o).catch(function (e) {
      if (!yedeklenir(e, o)) throw e;
      if (window.__carvisKayit) console.log('YEDEK → Groq (' + (e.code || '') + ' ' + String(e.message || '').slice(0, 80) + ')');
      return groqSample(input, o);
    });
  };
  // Sağlayıcı zinciri: sırayla dene (görsel içeren istekler hariç), hepsi olmazsa eski düzen (Gemini + Groq)
  function zincirle(calistir, yedek, input, o) {
    var l = (o && o.images && o.images.length) ? [] : sagHazir(), i = 0;
    function dene() {
      if (i >= l.length) return yedek(input, o);
      var S = l[i++];
      return calistir(input, o, S).then(function (r) { sagSonHata[S.id] = ''; return r; }, function (e) {
        if (e && (e.code === 'cancelled' || e.text)) throw e;
        sagSonHata[S.id] = String(e && e.message || e).slice(0, 200);
        sagUyku[S.id] = Date.now() + (e && e.code === 'rate_limited' ? 60000 : e && e.code === 'network' ? 120000 : 30000);
        if (window.__carvisKayit) console.log(S.ad + ' olmadı → sıradaki: ' + sagSonHata[S.id]);
        return dene();
      });
    }
    return dene();
  }
  sample = function (input, o) { return zincirle(groqSample, anaSample, input, o); };
  var anaJson = function (input, o) { return geminiJson(input, o).catch(function (e) { if (!yedeklenir(e, o)) throw e; return groqJson(input, o); }); };
  sample.json = function (input, o) { return zincirle(groqJson, anaJson, input, o); };
  sample.limits = geminiSample.limits;
  function sagGecici(x) { return { id: x.id || 'gecici', ad: x.ad || 'Sağlayıcı', api: function () { return sagAdres(x.taban); }, anahtar: function () { return x.anahtar || ''; }, dinlen: {}, anahtarsiz: true, yerelAg: true, ek: true, zincir: function () { return (x.modeller || []).slice(0, 1); }, ince: function () {} }; }
  window.yerelAyar.ag = function (url, o) { return agIstegi(url, o || {}, { yerelAg: true }); }; // genel: Android üzerinden istek (GitHub vb.)
  window.yerelAyar.saglayici = {
    hazir: HAZIR_SAGLAYICI, liste: sagListe, yaz: sagYaz, adres: sagAdres, sonHata: function (id) { return sagSonHata[id] || ''; },
    // Bağlantı testi: ilk modelle kısa bir istek
    test: function (x) {
      if (!x.taban) return Promise.reject(new Error('Adres boş.'));
      if (!(x.modeller || []).length) return Promise.reject(new Error('Önce "Modelleri getir"e bas ya da model adı yaz.'));
      if (/^http:\/\//i.test(x.taban) && location.protocol === 'https:' && !(K && K.httpIstek)) return Promise.reject(new Error('http adres yalnız cihaz sürümünde çalışır.'));
      delete sagUyku[x.id]; var t0 = Date.now();
      return groqIstek({ messages: [{ role: 'user', content: 'Sadece "tamam" yaz.' }], max_tokens: 20, temperature: 0 }, { hafif: true }, sagGecici(x)).then(function (j) {
        var c = (j.choices && j.choices[0] && j.choices[0].message && j.choices[0].message.content) || '';
        return 'Bağlandı ✓ (' + (j.model || j._model) + ', ' + (Date.now() - t0) + ' ms): ' + c.slice(0, 60);
      }, function (e) {
        var m = String(e && e.message || e);
        if (/ 401 | 403 /.test(m)) m += ' — anahtar geçersiz ya da izni eksik.';
        else if (/Failed to fetch|NetworkError|TypeError|Ağ hatası/i.test(m)) m += ' — adrese ulaşılamadı.';
        throw new Error(m);
      });
    },
    // Model listesini sağlayıcıdan çek; OpenRouter'da yalnız ücretsiz + araç destekli olanlar
    modelleriGetir: function (x) {
      var h = HAZIR_SAGLAYICI[x.tur] || {}, url = h.modelListe || sagAdres(x.taban, 'models');
      var bas = {}; if (x.anahtar) bas.Authorization = 'Bearer ' + x.anahtar;
      return agIstegi(url, { method: 'GET', headers: bas }, { yerelAg: true }).then(function (r) {
        return r.json().then(function (j) {
          if (!r.ok) throw new Error('Model listesi alınamadı (' + r.status + '): ' + JSON.stringify(j.error || j).slice(0, 120));
          var l = Array.isArray(j) ? j : (j.data || j.models || []);
          var secilen = l.filter(function (m) {
            if (h.ucretsizFiltre) { var pr = m.pricing || {}; var ucretsiz = +pr.prompt === 0 && +pr.completion === 0; var arac = !m.supported_parameters || m.supported_parameters.indexOf('tools') >= 0; return ucretsiz && arac; }
            var tur = String(m.task || m.type || m.object || ''); return !/embed|image|audio|speech|moderation|rerank/i.test(String(m.id || m.name) + ' ' + tur);
          }).map(function (m) { return { id: m.id || m.name, b: +(m.context_length || m.max_input_tokens || (m.limits && m.limits.max_input_tokens) || 0) }; })
            .filter(function (m) { return m.id; });
          // tercih: bilinen güçlü aileler önce, sonra bağlam uzunluğu
          function puan(m) { var id = m.id.toLowerCase(); return (/nemotron|deepseek|qwen|llama-?3\.3|llama-?4|gpt-oss|mistral-(large|medium)|gemma-?3|kimi|glm|gpt-4\.1|gpt-4o/.test(id) ? 0 : 1) * 1e9 - m.b; }
          secilen.sort(function (a, b) { return puan(a) - puan(b); });
          return secilen.map(function (m) { return m.id; });
        });
      });
    }
  };
  // Açılışta: (1) yalnız cihaza özel derlemede gelen hazır sağlayıcıları (window.__ozelSaglayicilar) bir kez ekle;
  // (2) anahtarı olup modeli olmayan sağlayıcıların modellerini kendiliğinden çek (kullanıcı: "sen yapsana")
  setTimeout(function () {
    var SG = window.yerelAyar.saglayici, l = SG.liste(), degisti = false;
    (window.__ozelSaglayicilar || []).forEach(function (o) {
      if (l.some(function (x) { return x.tur === o.tur && x.anahtar === o.anahtar; })) return;
      var h = HAZIR_SAGLAYICI[o.tur] || {};
      l.push({ id: 's' + Date.now().toString(36) + o.tur, tur: o.tur, ad: h.ad || o.tur, taban: o.taban || h.taban, anahtar: o.anahtar, modeller: [], acik: true }); degisti = true;
    });
    if (degisti) SG.yaz(l);
    SG.liste().forEach(function (x, i) {
      if (!x.anahtar || (x.modeller || []).length || x.tur === 'omniroute') return;
      SG.modelleriGetir(x).then(function (m) { if (!m.length) return; var t = SG.liste(); if (t[i] && t[i].id === x.id) { t[i].modeller = m.slice(0, 12); SG.yaz(t); } }, function (e) { sagSonHata[x.id] = 'Modeller alınamadı: ' + e.message; });
    });
  }, 4000);
  sample.groq = groqSample; // test
  window.yerelGemini.ara = function (soru, o) {
    return geminiAra(soru, o).catch(function (e) {
      if (!yedeklenir(e, o)) throw e;
      // Groq gpt-oss: yerleşik web araması
      return groqIstek({ messages: [{ role: 'user', content: soru + '\n\nKaynakların bağlantılarını da ver.' }], max_tokens: 3000, tools: [{ type: 'browser_search' }] }, o).then(function (j) {
        var t = (j.choices[0].message || {}).content || '', k = [];
        (t.match(/https?:\/\/[^\s)\]>"]+/g) || []).forEach(function (u) { if (k.length < 5 && !k.some(function (x) { return x.url === u; })) k.push({ url: u, baslik: u.replace(/^https?:\/\/(www\.)?/, '').split('/')[0] }); });
        return { metin: t, kaynaklar: k };
      });
    });
  };

  /* ---------- assets ---------- */
  var nesneUrl = {};
  function blobUrl(id) {
    if (nesneUrl[id]) return Promise.resolve(nesneUrl[id]);
    return idbIs('blob', 'readonly', function (s) { return s.get(id); }).then(function (b) { if (!b) return null; nesneUrl[id] = URL.createObjectURL(b.blob); return nesneUrl[id]; });
  }
  var assets = {
    upload: function (b) { var id = ''; for (var i = 0; i < 32; i++) id += (Math.random() * 16 | 0).toString(16); var kayit = { id: id, blob: b, t: Date.now() };
      return idbIs('blob', 'readwrite', function (s) { return s.put(kayit, id); }).then(function () { return blobUrl(id); }).then(function (u) { return { id: id, url: u, sizeBytes: b.size, contentType: b.type }; }); },
    list: function () { return idb.then(function (d) { return new Promise(function (ok) { var l = [], s = d.transaction('blob', 'readonly').objectStore('blob').openCursor(); s.onsuccess = function () { var c = s.result; if (c) { l.push({ id: c.key, sizeBytes: c.value.blob.size, contentType: c.value.blob.type, createdAt: c.value.t }); c.continue(); } else ok({ assets: l, usage: { files: l.length, bytes: l.reduce(function (a, x) { return a + x.sizeBytes; }, 0), maxFiles: 100000, maxBytes: 4e9 } }); }; }); }); },
    delete: function (id) { return idbIs('blob', 'readwrite', function (s) { return s.delete(id); }); }
  };
  // "/_blob/<id>" adreslerini (img src ve fetch) IndexedDB'deki dosyaya çevir
  var asilFetch = window.fetch.bind(window);
  window.fetch = function (u, o) {
    var m = /\/_blob\/([0-9a-f]{32})/.exec(typeof u === 'string' ? u : (u && u.url) || '');
    if (m) return idbIs('blob', 'readonly', function (s) { return s.get(m[1]); }).then(function (b) { return b ? new Response(b.blob) : new Response('', { status: 404 }); });
    return asilFetch(u, o);
  };
  function srcDuzelt(n) { if (n.tagName === 'IMG' || n.tagName === 'VIDEO' || n.tagName === 'SOURCE') { var s = n.getAttribute('src') || '', m = /^\/_blob\/([0-9a-f]{32})/.exec(s); if (m) blobUrl(m[1]).then(function (u) { if (u) n.src = u; }); } }
  new MutationObserver(function (l) { l.forEach(function (x) { if (x.type === 'attributes') srcDuzelt(x.target); else x.addedNodes.forEach(function (n) { if (n.nodeType === 1) { srcDuzelt(n); n.querySelectorAll && n.querySelectorAll('img,video,source').forEach(srcDuzelt); } }); }); })
    .observe(document.documentElement, { childList: true, subtree: true, attributes: true, attributeFilter: ['src'] });

  /* ---------- downloads ---------- */
  var downloads = { save: function (o) {
    var b = o.data instanceof Blob ? o.data : new Blob([o.data], { type: 'application/octet-stream' });
    if (K && K.kaydet) return blobB64(b).then(function (d) { var r = K.kaydet(o.filename, d, b.type || 'application/octet-stream'); if (r !== 'ok') throw hata('save_failed', r); });
    var a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = o.filename; document.body.appendChild(a); a.click(); a.remove();
    return Promise.resolve();
  } };

  // iPhone/tarayıcı: çevrimdışı önbellek (Android WebView'da gerekmez, dosyalar APK'nın içinde)
  if (!K && 'serviceWorker' in navigator && location.protocol === 'https:') navigator.serviceWorker.register('sw.js').catch(function () {});
  var harita = { db: db, user: user, sample: sample, assets: assets, downloads: downloads };
  window.claude = { __yerel: true, use: function (ad) { return Promise.resolve(harita[ad] || null); } };
})();
