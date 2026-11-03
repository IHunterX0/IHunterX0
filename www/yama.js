/* 1001 — Yama yükleme (kullanıcı, 2026-11-03: "bundan sonraki updateleri full apk olarak değil de apk'nın üstüne at ki uygulama
   400 MB'den büyük olabilsin"). Claude'un gönderdiği carvis-yama-*.zip dosyası seçilir; Android tarafı (Yama.java) internetsiz açar:
   www/ → web dosyaları (APK'dakilerin önüne geçer), model/ → ses modelleri vb., veri/ → büyük veri paketleri. Birden çok yama
   art arda kurulabilir; büyük modeller ayrı parçalar hâlinde gelebilir. Yeni tam APK kurulursa eski web yaması kendiliğinden kalkar. */
(function () {
  'use strict';
  if (/[?&]gomulu\b/.test(location.search)) return;
  var U = window.Uygulama; if (!U) return;
  var el = U.el, $ = U.$, K = window.AndroidKopru || null;
  var SURUM = (function () { try { return (document.querySelector('meta[name="carvis-surum"]') || {}).content || ''; } catch (e) { return ''; } })();
  function mb(b) { return (b / 1048576).toFixed(b > 104857600 ? 0 : 1) + ' MB'; }
  var durumKutu = null, ilerKutu = null, sonucKutu = null;

  window.carvisYama = {
    ilerleme: function (n, top) {
      if (!ilerKutu) return; ilerKutu.hidden = false;
      var f = top > 0 ? Math.min(1, n / top) : 0;
      ilerKutu.querySelector('b').style.width = (f * 100).toFixed(1) + '%';
      ilerKutu.querySelector('span').textContent = 'Açılıyor… ' + mb(n) + (top > 0 ? ' / ' + mb(top) : '');
    },
    bitti: function (json) {
      var r = {}; try { r = JSON.parse(json); } catch (e) {}
      if (ilerKutu) ilerKutu.hidden = true;
      if (r.iptal) return;
      if (!r.ok) { U.toast('Yama kurulamadı: ' + (r.hata || 'bilinmeyen hata')); if (sonucKutu) { sonucKutu.innerHTML = ''; sonucKutu.appendChild(el('p', { class: 'hata-metni', text: '✗ ' + (r.hata || 'Yama kurulamadı.') })); } return; }
      var m = '✓ ' + (r.ad || 'Yama') + (r.surum ? ' (' + r.surum + ')' : '') + ' kuruldu: ' + r.dosya + ' dosya, ' + mb(r.bayt || 0) + '.';
      U.toast(m);
      if (sonucKutu) { sonucKutu.innerHTML = ''; sonucKutu.appendChild(el('p', { text: m })); }
      durumCiz();
      if (r.yenidenYukle !== false) {
        if (sonucKutu) sonucKutu.appendChild(el('p', { class: 'var-etiket', text: 'Uygulama yeni sürümle yeniden açılıyor…' }));
        setTimeout(function () { location.reload(); }, 1600);
      }
    }
  };

  function durum() { try { return JSON.parse(K.yamaDurum() || '{}'); } catch (e) { return {}; } }
  function durumCiz() {
    if (!durumKutu || !K || !K.yamaDurum) return;
    var d = durum(), p = d.paketler || [];
    durumKutu.innerHTML = '';
    durumKutu.appendChild(el('p', { text: 'Uygulama sürümü: ' + (window.CARVIS_SURUM || SURUM || '—') + ' · Web yaması: ' + (d.wwwAktif ? 'etkin (' + mb(d.wwwBayt || 0) + ')' : 'yok') + ' · Modeller: ' + mb(d.modelBayt || 0) + ' · Veri: ' + mb(d.veriBayt || 0) }));
    if (p.length) {
      var ul = el('ul', { class: 'yama-liste' });
      p.slice(-12).reverse().forEach(function (x) { ul.appendChild(el('li', { text: (x.ad || 'yama') + (x.surum ? ' · ' + x.surum : '') + ' · ' + x.dosya + ' dosya · ' + mb(x.bayt || 0) + ' · ' + new Date(x.t).toLocaleString('tr-TR') })); });
      durumKutu.appendChild(ul);
    }
  }

  var css = document.createElement('style');
  css.textContent = '.yama-ilerleme{margin:12px 0;height:10px;border-radius:6px;background:rgba(94,240,220,.12);overflow:hidden;position:relative}.yama-ilerleme b{display:block;height:100%;width:0;background:linear-gradient(90deg,#46c8ff,#5ef0dc);box-shadow:0 0 10px #5ef0dc}.yama-ilerleme span{display:block;margin-top:14px;font:600 12px var(--f-kod,monospace);color:#9ff3e6}.yama-liste{margin:8px 0 0;padding-left:18px;font-size:13.5px;line-height:1.6;color:#cfeee9}';
  document.head.appendChild(css);

  U.GORUNUMLER.yama = function () {
    var ana = $('#ana'); ana.innerHTML = '';
    var sayfa = el('div', { class: 'sayfa' }); ana.appendChild(sayfa);
    sayfa.appendChild(el('h1', { text: '📦 Güncelleme (yama)' }));
    sayfa.appendChild(el('p', { text: 'Claude\'un gönderdiği "carvis-yama-….zip" dosyasını tabletine indir, sonra aşağıdan seç. Uygulamayı silip kurmana gerek yok; verilerin, notların ve ayarların korunur. Büyük modeller (ör. Piper sesi) ayrı parçalar hâlinde gelebilir: hepsini sırayla yükle.' }));
    if (!K || !K.yamaSec) {
      sayfa.appendChild(el('p', { class: 'hata-metni', text: 'Bu sürümde yama sistemi yok. Bir kez yeni tam APK\'yı (r57 ya da sonrası) kurman gerekiyor; ondan sonraki güncellemeler buradan yüklenir.' }));
      return;
    }
    var dug = el('button', { class: 'dugme ana', type: 'button', text: '📦 Yama dosyası seç ve yükle' });
    dug.addEventListener('click', function () { if (sonucKutu) sonucKutu.innerHTML = ''; try { K.yamaSec(); } catch (e) { U.toast('Dosya seçici açılamadı.'); } });
    sayfa.appendChild(dug);
    ilerKutu = el('div', { class: 'yama-ilerleme', hidden: true }, [el('b'), el('span')]); sayfa.appendChild(ilerKutu);
    sonucKutu = el('div', { class: 'yp-cevap' }); sayfa.appendChild(sonucKutu);
    sayfa.appendChild(el('h3', { text: 'Durum' }));
    durumKutu = el('div'); sayfa.appendChild(durumKutu); durumCiz();
    sayfa.appendChild(el('h3', { text: 'Sorun olursa' }));
    sayfa.appendChild(el('p', { class: 'var-etiket', text: 'Bir yamadan sonra bir şey bozulursa "Web yamasını kaldır"a bas: uygulama APK\'daki sürüme döner (indirilen modeller kalır). Uygulama hiç açılmıyorsa yeni tam APK\'yı üstüne kurman yeterli; eski web yaması kendiliğinden devre dışı kalır.' }));
    sayfa.appendChild(el('div', { class: 'mk-dugmeler' }, [
      el('button', { class: 'dugme kucuk', type: 'button', text: 'Web yamasını kaldır', onclick: function () { if (!confirm('Web yaması kaldırılsın mı? Uygulama APK\'daki sürüme döner.')) return; K.yamaSifirla('www'); U.toast('Web yaması kaldırıldı.'); setTimeout(function () { location.reload(); }, 800); } }),
      el('button', { class: 'dugme kucuk', type: 'button', text: 'Tüm yamaları ve modelleri sil', onclick: function () { if (!confirm('Tüm yamalar ve indirilen modeller silinsin mi?')) return; K.yamaSifirla('hepsi'); U.toast('Silindi.'); setTimeout(function () { location.reload(); }, 800); } })
    ]));
  };
  U.SEKMELER.push({ id: 'yama', ad: 'Güncelleme', ikon: '📦' });
  if (U.sekmeleriCiz) try { U.sekmeleriCiz(); } catch (e) {}
})();
