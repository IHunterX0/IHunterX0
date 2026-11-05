/* Matematik (r114). Yapay zekâ metinlerindeki LaTeX ifadelerini ($X^2$, $\bar{x}$, $(r-1) \times (c-1)$, $$\frac{a}{b}$$)
   okunur HTML'e çevirir. Dış kütüphane yok, çevrimdışı çalışır. Tanınmayan komutlar ters eğik çizgisiz düz metin olur.
   app2.js mdHtml kullanır: tekSatir (çok satırlı blokları tek satıra indirir), koru (ifadeleri markdown'dan korur), geri (yerine koyar). */
(function () {
  'use strict';

  var SEMBOL = { times: '×', cdot: '·', div: '÷', pm: '±', mp: '∓', le: '≤', leq: '≤', ge: '≥', geq: '≥', ne: '≠', neq: '≠',
    approx: '≈', sim: '∼', equiv: '≡', propto: '∝', infty: '∞', to: '→', rightarrow: '→', leftarrow: '←', Rightarrow: '⇒',
    Leftarrow: '⇐', Leftrightarrow: '⇔', iff: '⇔', in: '∈', notin: '∉', subset: '⊂', cup: '∪', cap: '∩', forall: '∀',
    exists: '∃', partial: '∂', nabla: '∇', sum: '∑', prod: '∏', int: '∫', ldots: '…', dots: '…', cdots: '⋯', circ: '°',
    degree: '°', prime: '′', mid: '|', vert: '|', langle: '⟨', rangle: '⟩', quad: ' ', qquad: ' ' };
  var GREK = { alpha: 'α', beta: 'β', gamma: 'γ', delta: 'δ', epsilon: 'ε', varepsilon: 'ε', zeta: 'ζ', eta: 'η', theta: 'θ',
    iota: 'ι', kappa: 'κ', lambda: 'λ', mu: 'μ', nu: 'ν', xi: 'ξ', pi: 'π', rho: 'ρ', sigma: 'σ', tau: 'τ', upsilon: 'υ',
    phi: 'φ', varphi: 'φ', chi: 'χ', psi: 'ψ', omega: 'ω', Gamma: 'Γ', Delta: 'Δ', Theta: 'Θ', Lambda: 'Λ', Xi: 'Ξ',
    Pi: 'Π', Sigma: 'Σ', Phi: 'Φ', Psi: 'Ψ', Omega: 'Ω' };
  var FONKSIYON = { log: 1, ln: 1, exp: 1, sin: 1, cos: 1, tan: 1, cot: 1, sec: 1, csc: 1, max: 1, min: 1, lim: 1, det: 1, sup: 1, inf: 1, arg: 1 };
  var UST = { bar: '̄', overline: '̅', hat: '̂', tilde: '̃', vec: '⃗', dot: '̇', ddot: '̈' };
  var DUZ = { text: 1, textrm: 1, mathrm: 1, textbf: 1, textit: 1, mbox: 1, operatorname: 1 };
  var STIL = { mathbf: 1, mathit: 1, mathsf: 1, mathtt: 1, mathcal: 1, boldsymbol: 1, bf: 1, it: 1 };
  var YOK = { left: 1, right: 1, big: 1, Big: 1, bigg: 1, Bigg: 1, displaystyle: 1, textstyle: 1, scriptstyle: 1, limits: 1, nolimits: 1, hline: 1 };
  var KUMELER = { R: 'ℝ', N: 'ℕ', Z: 'ℤ', Q: 'ℚ', C: 'ℂ' };

  function kacis(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  // metin zaten HTML'e kaçırılmış olabilir (esc); LaTeX'i ham hâline döndürür
  function coz(s) { return s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&amp;/g, '&'); }

  // LaTeX metnini HTML'e çevirir (özyinelemeli; i imleci ortaktır)
  function donustur(t) {
    var i = 0, n = t.length, cikti = '';
    function ktoken() { // tek komut ya da tek karakter
      if (i >= n) return '';
      if (t.charAt(i) === '\\') { var m = /^\\(?:[a-zA-Z]+|.)/.exec(t.slice(i, i + 40)); if (m) { i += m[0].length; return m[0]; } }
      return t.charAt(i++);
    }
    function grup() { // '{...}' ise içini, değilse tek belirteci döndürür
      while (i < n && t.charAt(i) === ' ') i++;
      if (t.charAt(i) !== '{') return ktoken();
      var d = 0, bas = i + 1;
      for (; i < n; i++) {
        var c = t.charAt(i);
        if (c === '\\') { i++; continue; }
        if (c === '{') d++;
        else if (c === '}' && --d === 0) { i++; return t.slice(bas, i - 1); }
      }
      return t.slice(bas);
    }
    function komut(ad) {
      if (YOK[ad]) return '';
      if (SEMBOL[ad] !== undefined) return kacis(SEMBOL[ad]);
      if (GREK[ad]) return '<i>' + GREK[ad] + '</i>';
      if (UST[ad]) return donustur(grup()) + UST[ad];
      if (ad === 'frac' || ad === 'dfrac' || ad === 'tfrac') {
        var p = grup(), q = grup();
        return '<span class="mfrac"><span>' + donustur(p) + '</span><span>' + donustur(q) + '</span></span>';
      }
      if (ad === 'sqrt') {
        if (t.charAt(i) === '[') { var k = t.indexOf(']', i); if (k > 0) i = k + 1; }
        return '√<span class="mkok">' + donustur(grup()) + '</span>';
      }
      if (ad === 'binom') { var a1 = grup(), a2 = grup(); return 'C(' + donustur(a1) + ',' + donustur(a2) + ')'; }
      if (DUZ[ad]) return kacis(grup());
      if (STIL[ad]) return donustur(grup());
      if (ad === 'mathbb') { var kume = grup(); return kacis(KUMELER[kume] || kume); }
      if (ad === 'begin') { var ortam = grup(); if (ortam === 'array') grup(); return ''; }
      if (ad === 'end') { grup(); return ''; }
      if (FONKSIYON[ad]) return ad + ' ';
      return kacis(ad);
    }
    while (i < n) {
      var c = t.charAt(i);
      if (c === '\\') {
        var m = /^\\([a-zA-Z]+)/.exec(t.slice(i, i + 40));
        if (m) { i += m[0].length; cikti += komut(m[1]); continue; }
        var k2 = t.charAt(i + 1); i += 2;
        if (k2 === '\\') cikti += '<br>';
        else if (k2 === ',' || k2 === ';' || k2 === ':' || k2 === ' ') cikti += ' ';
        else if (k2 !== '!') cikti += kacis(k2);
        continue;
      }
      if (c === '^' || c === '_') {
        i++;
        var etiket = c === '^' ? 'sup' : 'sub';
        cikti += '<' + etiket + '>' + donustur(grup()) + '</' + etiket + '>';
        continue;
      }
      if (c === '{') { cikti += donustur(grup()); continue; }
      if (c === '}') { i++; continue; }
      if (c === '&') { cikti += ' '; i++; continue; }
      if (/[a-zA-Z]/.test(c)) {
        var j = i;
        while (j < n && /[a-zA-Z]/.test(t.charAt(j))) j++;
        cikti += '<i>' + kacis(t.slice(i, j)) + '</i>';
        i = j;
        continue;
      }
      i++;
      if (c === '-') cikti += '−';
      else if (c === "'") cikti += '′';
      else if (c === '~') cikti += ' ';
      else if (c === ' ' || c === '\t') { if (cikti.charAt(cikti.length - 1) !== ' ') cikti += ' '; }
      else cikti += kacis(c);
    }
    return cikti;
  }

  // $$..$$ ve \[..\] (blok), $..$ ve \(..\) (satır içi). Kapanış $ öncesi ve açılış $ sonrası boşluk olmamalı:
  // böylece "5$ ve 10$" gibi para birimi metinleri matematik sanılmaz.
  var DESEN = /\$\$([\s\S]+?)\$\$|\$(?!\s)([^$\n]*?[^\s$])\$|\\\(([\s\S]+?)\\\)|\\\[([\s\S]+?)\\\]/g;

  function html(m) {
    var blok = m.charAt(0) === '$' ? m.charAt(1) === '$' : m.charAt(1) === '[';
    var ic = m.charAt(0) === '$' ? (blok ? m.slice(2, -2) : m.slice(1, -1)) : m.slice(2, -2);
    return '<span class="mat' + (blok ? ' mat-blok' : '') + '">' + donustur(coz(ic)) + '</span>';
  }

  var css = document.createElement('style');
  css.textContent = '.mat{font-family:"Latin Modern Math","STIX Two Math","Cambria Math",Georgia,"Times New Roman",serif}' +
    '.mat sup,.mat sub{font-size:.72em}' +
    '.mat-blok{display:block;text-align:center;margin:.6em 0}' +
    '.mfrac{display:inline-flex;flex-direction:column;align-items:center;vertical-align:middle;margin:0 .12em}' +
    '.mfrac>span{display:block;padding:0 .2em}' +
    '.mfrac>span:first-child{border-bottom:1px solid currentColor}' +
    '.mkok{border-top:1px solid currentColor}';
  document.head.appendChild(css);

  window.Matematik = {
    // Kaçırılmış (esc) satır metninde blok ifadeleri (çok satırlı $$..$$ ve \[..\]) tek satıra indirir
    tekSatir: function (s) {
      return s.replace(/\$\$([\s\S]+?)\$\$|\\\[([\s\S]+?)\\\]/g, function (m) { return m.replace(/\n+/g, ' '); });
    },
    // İfadeleri yer tutucuya koyar; markdown dönüşümleri ifade içine girmez
    koru: function (s, dizi) {
      s = s.replace(/\\\$/g, '\u0002'); // \$ = düz dolar işareti
      return s.replace(DESEN, function (m) { dizi.push(html(m)); return '\u0001' + (dizi.length - 1) + '\u0001'; });
    },
    // Yer tutucuları HTML ile değiştirir
    geri: function (s, dizi) {
      return s.replace(/\u0001(\d+)\u0001/g, function (_, k) { return dizi[+k] || ''; }).replace(/\u0002/g, '$');
    },
    // Düz metindeki ifadeleri HTML'e çevirir (test ve yardımcı kullanım)
    metin: function (s) { return s.replace(DESEN, function (m) { return html(m); }); },
    donustur: function (latex) { return donustur(latex); }
  };
})();
