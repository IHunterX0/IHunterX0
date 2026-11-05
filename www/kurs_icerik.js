/* Tüm dersi 0'dan öğren (r120) — biyoistatistik konu içeriği.
   Jane tarzı: önce çekirdek bilgi, sonra çekirdekten türetme. Her konuda bir kanca sorusu (dikkat), bir çıkmış soru, bir "kendin dene".
   Kaynak: kitabın kendi bölümleri (Bölüm 0–18; sıra = kitap sırası). Yapay zekâ kullanılmaz. */
(function () {
  'use strict';
  window.KursIcerik = window.KursIcerik || {};
  window.KursIcerik.biyoistatistik = [
    { ad: 'İstatistik neden var?',
      kanca: { soru: 'Bir ilaç 100 hastada işe yaradı. Bu, ilacın gerçekten işe yaradığını kanıtlar mı?', cevap: 'Kesin değil. Aynı sonuç şansla da çıkabilir; asıl soru farkın şanstan büyük olup olmadığı.', neden: 'İstatistik tam bu ayrımı yapmak için var.' },
      cekirdek: [
        { b: 'Değişkenlik gerçektir', m: 'İki hasta aynı ilaca aynı tepkiyi vermez. İstatistik değişkenliği yok saymaz, ölçer.' },
        { b: 'Belirsizlik karar vermeyi engellemez', m: 'İstatistik kesinlik değil karar üretir: bu fark şanstan büyük mü?' },
        { b: 'Ham veri bilgi değildir', m: 'Sayı düzenlenip karşılaştırıldığında bilgi olur.' }
      ],
      turet: { baslik: 'Neden istatistik? Çekirdekten çıkar', adimlar: ['Değişkenlik varsa tek bir ölçüm yanıltır.', 'Tek ölçüm yanıltıyorsa birçok ölçümü özetlemek gerekir.', 'Özet bir karara dönüşecekse, farkın şanstan büyük olup olmadığını sınamak gerekir.'], kendin: 'Bir sınıfta iki yöntemle ders anlatılıyor. Hangi kanıt sizi yöntemin işe yaradığına inandırır?', kendinCevap: 'Tek bir ortalama farkı değil; farkın rastgele dalgalanmaya göre büyük olup olmadığını gösteren bir ölçü.' } },

    { ad: 'Terminoloji ve veri',
      kanca: { soru: 'Örneklem ile toplum arasındaki fark ne? Hangisi ölçülür, hangisi hakkında konuşulur?', cevap: 'Örneklem ölçülür, toplum hakkında konuşulur. Toplumun özeti parametredir (Yunan harfi), örneklemin özeti istatistiktir (Latin harfi).', neden: 'Sınavın ilk tuzağı bu iki sembolü karıştırmaktır.' },
      cekirdek: [
        { b: 'Toplum, örneklem, birim', m: 'Toplum ilgilendiğin bütün birimlerdir. Örneklem ölçtüğün alt kümedir. Birim tek bir kişi ya da olaydır.' },
        { b: 'Parametre ile istatistik', m: 'Toplum: μ, σ (Yunan). Örneklem: x̄, s (Latin). Kural: toplum Yunan, örneklem Latin.' },
        { b: 'Ölçek tipi neye izin verir?', m: 'Sıra, aralık, oran. Ölçek ne kadar bilgi taşıyorsa o kadar işlem anlamlıdır.' }
      ],
      turet: { baslik: 'Ölçek tipinden hangi işlem çıkar?', adimlar: ['Sıralı veride yalnızca büyüklük sırası anlamlıdır; fark ve oran anlamsızdır.', 'Aralık ölçekte fark anlamlıdır ama sıfır keyfidir: 40 °C, 20 °C’nin iki katı değildir.', 'Oran ölçekte sıfır gerçektir: 40 kg, 20 kg’ın iki katıdır.', 'Ortalama aralık ölçekte anlamlıdır; oran yalnızca oran ölçeğinde yapılır.'], kendin: 'Eğitim düzeyi (ilkokul, lise, üniversite) hangi ölçek? Ortalama almak mantıklı mı?', kendinCevap: 'Sıralı ölçek. Ortalama değil, ortanca ya da kategori dağılımı anlamlıdır.' } },

    { ad: 'Veriyi düzenlemek',
      kanca: { soru: '100 öğrencinin notu elinde. Hangisi daha bilgilendirici: 100 ham not mu, yoksa notların sınıflanmış frekans tablosu mu?', cevap: 'Frekans tablosu. Sınıflayınca desen görünür; ham listede görünmez.', neden: 'Düzenleme, veriden bilgi çıkarmanın ilk adımıdır.' },
      cekirdek: [
        { b: 'Veri iskeleti', m: 'Bir satır bir birim, bir sütun bir değişken. Her ölçüm bir hücrededir.' },
        { b: 'Frekans: kaç kez?', m: 'f: bir değerin ya da sınıfın gözlenme sayısı. Toplam n.' },
        { b: 'Oran ve birikim', m: 'Göreli frekans = f / n. Birikimli frekans: o sınıfa kadar olan f’lerin toplamı.' }
      ],
      turet: { baslik: 'Göreli ve birikimli frekans çekirdekten', adimlar: ['Toplam gözlem sayısı n’dir.', 'Bir sınıfın payı f / n. Bütün paylar toplanınca 1 (ya da %100) çıkar: kontrol et.', 'Birikimli frekans, bir önceki birikimliye o sınıfın f’sini eklenerek bulunur.', 'Son birikimli değer her zaman n’e eşittir; tablo doğruysa.'], kendin: 'n = 20, bir sınıfın f = 5. Göreli frekans kaçtır?', kendinCevap: '5 / 20 = 0,25, yani %25.' } },

    { ad: 'Merkezi eğilim',
      kanca: { soru: 'İki grubun ortalaması aynı. Birinde tek bir hasta çok uç. Hangisi “tipik değeri” daha dürüst anlatır?', cevap: 'Uç olmayan grubun ortalaması. Ortalama uçtan etkilenir; ortanca daha dürüst bir merkezdir.', neden: 'Tek sayı her zaman tam anlatmaz.' },
      cekirdek: [
        { b: 'Ortalama bir denge noktasıdır', m: 'Sapmaların toplamı sıfırdır: Σ(x − x̄) = 0.' },
        { b: 'Ağırlık, değerin kaç kez sayıldığıdır', m: 'Ağırlıklı ortalamada her değer kendi ağırlığı kadar sayılır.' },
        { b: 'Çarpımsal değişimde geometrik ortalama', m: 'Büyüme oranları çarpılır, toplanmaz. GO = n’inci kök(x₁ · … · xₙ).' }
      ],
      turet: { baslik: 'Ağırlıklı ortalama ortalamadan çıkar', adimlar: ['x̄ = Σx / n: n tane x’in toplamı bölü n.', 'Bir değer w kez gözlenmiş gibi düşün: toplamına w · x, adedine w eklenir.', 'Sonuç: x̄_w = Σ(w · x) / Σw.', 'Kontrol: bütün ağırlıklar 1 ise formül düz ortalamaya döner.'], kendin: 'Grup A: ortalama 70, n = 10. Grup B: ortalama 50, n = 30. Birleşik ortalama kaçtır?', kendinCevap: '(10 · 70 + 30 · 50) / 40 = 2200 / 40 = 55. Düz ortalama (60) yanıltıcıdır.' } },

    { ad: 'Dağılım ölçüleri',
      kanca: { soru: 'Ortalama aynı, ama biri daha dağınık. Dağınıklığı tek sayıyla nasıl ölçersin?', cevap: 'Sapmaların karesinin ortalaması (varyans) ve onun karekökü (SD).', neden: 'Düz sapmaların toplamı her zaman 0 çıkar; bu yüzden kareleri alınır.' },
      cekirdek: [
        { b: 'Sapma: değer eksi ortalama', m: 'x − x̄ bir değerin ortalamadan uzaklığıdır. Düz toplamı her zaman 0.' },
        { b: 'Karesi alınır, ortalaması alınır', m: 'Varyans = kareli sapmaların ortalaması. Birimi kare olur.' },
        { b: 'SD birimi geri getirir', m: 'SD = √varyans. Örneklemde n − 1’e bölünür.' }
      ],
      turet: { baslik: 'Varyans ve SD’yi sapmadan çıkar', adimlar: ['Σ(x − x̄) = 0 olduğu için sapmalar işaretsiz ölçülmeli: karesini al.', 'Kareli sapmaların toplamı: Σ(x − x̄)².', 'x̄ ölçüldüğü için bir serbestlik harcanır: n − 1’e böl. s² = Σ(x − x̄)² / (n − 1).', 'Karekök: SD = s. Ortalamanın dağınıklığı: SE = SD / √n.'], kendin: 'SE = 4 ve n = 16 ise SD kaçtır?', kendinCevap: 'SD = SE · √n = 4 · 4 = 16.' } },

    { ad: 'Olasılık',
      kanca: { soru: 'Rastgele bir öğrenci kadın ya da solak. Ama ikisi de olabilir. P(kadın veya solak) için ne yaparsın?', cevap: 'P(K) + P(S) − P(K ve S). Kesişimi çıkarmazsan çift sayarsın.', neden: 'Venn şekli bunu gösterir. Sınavın klasik tuzağıdır.' },
      cekirdek: [
        { b: 'Klasik olasılık: uygun / tüm', m: 'P(A) = n / N. Eşit olası sonuçlarda bu yeter.' },
        { b: 'Olasılık 0 ile 1 arasında', m: 'Tümleyen: P(Aᶜ) = 1 − P(A). Bütün olasılıkların toplamı 1.' },
        { b: 'Beklenen değer', m: 'E(X) = Σ xᵢ · P(xᵢ): olasılıkla ağırlıklı ortalama.' }
      ],
      turet: { baslik: 'Toplama kuralını Venn’den çıkar', adimlar: ['P(A) ve P(B) iki daireyi ayrı ayrı verir.', 'Ortak kısım iki kez sayıldı: hem A’da hem B’de.', 'Bir kez çıkar: P(A ∪ B) = P(A) + P(B) − P(A ∩ B).', 'Ayrıksa kesişim 0’dır ve formül P(A) + P(B) olur.'], kendin: 'P(A) = 0,4, P(B) = 0,3, P(A ∩ B) = 0,1. P(A ∪ B) kaçtır?', kendinCevap: '0,4 + 0,3 − 0,1 = 0,6.' } },

    { ad: 'Binom ve Poisson',
      kanca: { soru: 'Bir tedavi her hastada 0,75 olasılıkla işe yarıyor. 8 hastadan tam 3’ünde işe yarama olasılığı nedir?', cevap: 'C(8,3) · 0,75³ · 0,25⁵ ≈ 0,023. Bir dizilimin olasılığı, kaç dizilim olduğuyla çarpılır.', neden: 'Formülü ezberleme; iki parçasını bil.' },
      cekirdek: [
        { b: 'Bağımsız, iki sonuçlu denemeler', m: 'Her denemede başarı p, başarısızlık q = 1 − p. Denemeler birbirinden bağımsızdır.' },
        { b: 'Bir belirli dizilimin olasılığı', m: 'r başarı, n − r başarısızlık: p^r · q^(n−r).' },
        { b: 'Kaç dizilim var?', m: 'n denemede r başarının yerleşebileceği yer sayısı: C(n,r).' }
      ],
      turet: { baslik: 'Binom formülünü sıfırdan kur', adimlar: ['Tek bir dizilim seç: ilk r tanesi başarı, kalanı başarısızlık. Olasılığı p^r · q^(n−r).', 'Aynı sayıda başarı başka sıralarda da olabilir. Sıra sayısı: C(n,r) = n! / (r! · (n − r)!).', 'Farklı dizilimler ayrık olduğu için toplanır: P(X = r) = C(n,r) · p^r · q^(n−r).', 'Ortalama ve varyans: μ = np, σ² = npq.'], kendin: 'n = 8, p = 0,75, r = 3 için C(8,3) kaçtır?', kendinCevap: 'C(8,3) = 56. Olasılık 56 · 0,75³ · 0,25⁵ ≈ 0,023.' } },

    { ad: 'Normal dağılım',
      kanca: { soru: 'Toplumda ortalama boy 160 cm, SD 10 cm. 170 cm’lik biri uç sayılır mı?', cevap: 'Hayır. z = (170 − 160) / 10 = 1: ortalamadan 1 SD uzakta, uç değil.', neden: 'z dönüşümü her normal eğriyi tek bir eğriye çevirir.' },
      cekirdek: [
        { b: 'Çan eğrisi iki sayıyla tanımlanır', m: 'μ merkezi, σ yayılımı belirler. Altındaki alan 1.' },
        { b: 'Sürekli değişkende olasılık alandır', m: 'Tek bir değerin olasılığı 0’dır; bir aralığın olasılığı altındaki alandır.' },
        { b: '68–95–99,7 kuralı', m: 'Ortalamadan ±1σ içinde yaklaşık %68, ±2σ’da %95, ±3σ’da %99,7.' }
      ],
      turet: { baslik: 'z dönüşümünü kaydır ve ölçekle', adimlar: ['Kaydır: her değerden μ çıkar. Yeni ortalama 0 olur, şekil değişmez.', 'Ölçekle: her şeyi σ’ya böl. Yeni yayılım 1 olur.', 'Sonuç: z = (x − μ) / σ. Tek bir standart normal tablosu yeter.', 'Kontrol: x = μ ise z = 0; x = μ + σ ise z = 1.'], kendin: 'μ = 3200, σ = 450 ise x = 2500 için z kaçtır?', kendinCevap: 'z = (2500 − 3200) / 450 ≈ −1,56: ortalamanın belirgin altında.' } },

    { ad: 'Örnekleme',
      kanca: { soru: 'Ortalaması 5 olan bir toplumdan örneklem alsan, örneklem ortalaması hep 5 mi çıkar?', cevap: 'Hayır. Her örneklemin ortalaması değişir. Bu değişimin dağılımı örnekleme dağılımıdır; SE onun SD’sidir.', neden: 'Bütün çıkarımın temeli bu fikirdir.' },
      cekirdek: [
        { b: 'Olasılıklı yöntemler', m: 'Herkesin seçilme şansı bilinir: basit rastgele, sistematik, tabakalı, küme. Kota olasılıksızdır.' },
        { b: 'Örneklem ortalaması rastgele bir değişkendir', m: 'Her örneklemde farklı x̄ çıkar. Bu değerlerin dağılımı örnekleme dağılımıdır.' },
        { b: 'Merkezi limit teoremi', m: 'n yeterince büyükse x̄’nin dağılımı, toplum dağılımı ne olursa olsun yaklaşık normaldir.' }
      ],
      turet: { baslik: 'E(x̄) = μ ve Var(x̄) = σ²/n nereden gelir', adimlar: ['x̄ = (x₁ + … + xₙ) / n. Her xᵢ’nin beklenen değeri μ.', 'Beklenen değer doğrusaldır: E(x̄) = (μ + … + μ) / n = μ. Örneklem ortalaması yanlı değildir.', 'Bağımsız değişkenlerin varyansları toplanır: Var(x̄) = (σ² + … + σ²) / n² = σ² / n.', 'Karekök: SE = σ / √n. Örneklem büyüdükçe SE küçülür, ama yalnızca √n kadar.'], kendin: 'σ = 12, n = 36 ise SE kaçtır? Örneklemi 4 katına çıkarırsan SE ne olur?', kendinCevap: 'SE = 12 / 6 = 2. n = 144 olunca SE = 1: yarıya iner.' } },

    { ad: 'Hipotez testinin mantığı',
      kanca: { soru: 'Bir ilacın etkisi “sıfır” kabul ediliyor ve sen fark olduğunu söylemek istiyorsun. Önce neyi çürütmeye çalışırsın?', cevap: 'Sıfır hipotezini (H₀: fark yok). Testler H₀’ı çürütmeye çalışır, kanıtlamaya değil.', neden: 'Sınavda en çok düşülen yer burasıdır.' },
      cekirdek: [
        { b: 'H₀ varsayılan dünyadır', m: 'H₀: fark yok ya da değer μ₀. H₁: fark var. Test yalnızca H₀ hakkında karar verir.' },
        { b: 'p değeri', m: 'H₀ doğruyken bu kadar uç sonucun olasılığı. Küçük p, verinin H₀ ile zor uyuştuğunu gösterir. Doğru olma olasılığı değildir.' },
        { b: 'İki hata', m: 'I. tip: H₀ doğruyken reddetmek (α). II. tip: H₀ yanlışken reddetmemek (β).' }
      ],
      turet: { baslik: 'Test istatistiği sinyal bölü gürültüdür', adimlar: ['Sinyal: gözlenen fark x̄ − μ₀.', 'Gürültü: bu farkın rastgele dalgalanması: SE = σ / √n.', 'Oran: z = (x̄ − μ₀) / (σ / √n). |z| büyükse p küçüktür.', 'Karar: |z| kritik değeri aşarsa H₀ reddedilir.'], kendin: 'x̄ − μ₀ = 2, σ = 10, n = 25. z kaçtır? Kritik değer 1,96 ise karar ne?', kendinCevap: 'SE = 10 / 5 = 2, z = 2 / 2 = 1. 1 < 1,96: H₀ reddedilemez.' } },

    { ad: 'Tek örneklem testleri',
      kanca: { soru: 'σ bilinmiyor ve n = 10. Ortalamayı z ile mi, t ile mi test edersin?', cevap: 't. σ’yı örneklemden tahmin ettiğin için belirsizlik artar ve sd = n − 1.', neden: 'Bilinmeyen σ’nın bedeli budur.' },
      cekirdek: [
        { b: 'Tek örneklem testinin kalıbı', m: '(gözlenen − beklenen) / SE. Bütün testler bu kalıptadır.' },
        { b: 'z: σ biliniyorsa', m: 'z = (x̄ − μ₀) / (σ / √n).' },
        { b: 't: σ bilinmiyorsa', m: 't = (x̄ − μ₀) / (s / √n), sd = n − 1. Küçük n’de t daha yaygındır.' }
      ],
      turet: { baslik: 'z’den t’ye: bedel nereden çıkar', adimlar: ['z’de payda σ / √n. σ bilinmediği için s / √n ile değiştirilir.', 's bir tahmindir ve kendi belirsizliği vardır. Bu yüzden dağılım kalınlaşır: t.', 's, x̄’e göre hesaplandığı için bir serbestlik harcanır: sd = n − 1.', 'n büyüdükçe sd büyür ve t, z’ye yaklaşır.'], kendin: 'n = 9 ve n = 100 için sd kaçtır? Hangisinde t ile z arasındaki fark ihmal edilebilir?', kendinCevap: 'sd = 8 ve 99. n = 100’de fark ihmal edilebilir kadar küçüktür.' } },

    { ad: 'İki grubu karşılaştırmak',
      kanca: { soru: 'İki grubu karşılaştırıyorsun. Gruplar farklı kişilerden mi oluşuyor, yoksa aynı kişilerin önce-sonra ölçümü mü?', cevap: 'Farklı kişilerse bağımsız iki örneklem testi; aynı kişilerse eşli t (her kişinin farkına bakılır).', neden: 'Yanlış testi seçmek en pahalı tuzaktır.' },
      cekirdek: [
        { b: 'Bağımsız mı, eşli mi?', m: 'Farklı kişiler: bağımsız. Aynı kişi iki kez: eşli (bağımlı).' },
        { b: 'İki ortalama farkının SE’si', m: 'SE = √(s₁²/n₁ + s₂²/n₂). Varyanslar toplanır, SD’ler toplanmaz.' },
        { b: 'Varyans homojenliği', m: 'Varyanslar eşitse ortak (havuzlanmış) varyans; değilse Aspin-Welch.' }
      ],
      turet: { baslik: 'Fark testinin SE’sini varyanslardan çıkar', adimlar: ['x̄₁ − x̄₂’nin varyansı, iki bağımsız ortalamanın varyanslarının toplamıdır.', 'Var(x̄₁) = s₁² / n₁ ve Var(x̄₂) = s₂² / n₂.', 'Var(fark) = s₁²/n₁ + s₂²/n₂. Karekökü SE’dir.', 'Eşli ise fark serisinin SD’si ile SE = SD_d / √n: tek örneklem t’ye döner.'], kendin: 's₁ = 0,5, n₁ = 100; s₂ = 0,45, n₂ = 120. SE kaçtır?', kendinCevap: '√(0,25/100 + 0,2025/120) = √0,0041875 ≈ 0,065.' } },

    { ad: 'İkiden fazla grup: ANOVA',
      kanca: { soru: 'Üç grubu ikişer ikişer t testiyle karşılaştırırsan, toplam hata payı hâlâ %5 mi kalır?', cevap: 'Hayır. Her test %5 risk taşır; üç test birlikte yaklaşık %14 risk demektir.', neden: 'Bu yüzden önce tek bir genel test yapılır: ANOVA.' },
      cekirdek: [
        { b: 'α şişmesi', m: 'Çok test yanlış pozitif riskini büyütür: α_aile = 1 − (1 − α)^m.' },
        { b: 'ANOVA genel bir soru sorar', m: 'En az bir grup farklı mı? Hangi grup farklı, post-hoc ile bakılır.' },
        { b: 'Kareler toplamı ayrışır', m: 'GnKT = GAKT + GİKT: toplam değişkenlik, gruplar arası ve grup içi.' }
      ],
      turet: { baslik: 'F’yi kareler toplamından çıkar', adimlar: ['Toplam sapmaların kareleri: GnKT.', 'Grup ortalamalarının büyük ortalamadan sapması: GAKT. Grup içi sapmalar: GİKT.', 'Serbestlik: gruplar arası k − 1, grup içi n − k.', 'F = (GAKT / (k − 1)) / (GİKT / (n − k)). Gruplar arası büyükse F büyür.'], kendin: '3 grup, her birinde 10 kişi. Gruplar arası ve grup içi serbestlik dereceleri?', kendinCevap: 'k − 1 = 2 ve n − k = 27.' } },

    { ad: 'Tıpta büyük veri ve karar destek',
      kanca: { soru: 'Bir yapay zekâ “kanser var” diyor ve doğruluğu %90. Bu, sonucun %90 güvenilir olduğu anlamına gelir mi?', cevap: 'Hayır. Doğruluk hastalığın yaygınlığına bağlıdır. Duyarlılık, özgüllük ve PPV ayrı ayrı bakılmalıdır.', neden: 'Bu bir koşullu olasılık sorusudur.' },
      cekirdek: [
        { b: 'Büyük veri: hacim, çeşitlilik, hız, değer', m: 'Büyük yalnızca çok demek değildir. Ham veri tek başına bilgi değildir.' },
        { b: 'Makine öğrenmesi ve derin öğrenme', m: 'Desen öğrenen modellerdir. Derin öğrenme çok katmanlı sinir ağıdır.' },
        { b: 'Performans: dört oran', m: 'Duyarlılık, özgüllük, PPV, NPV. Her biri farklı bir koşullu olasılıktır.' }
      ],
      turet: { baslik: 'PPV’yi tablodan çıkar', adimlar: ['Tabloyu kur: hasta olanlar (a + c), olmayanlar (b + d). Pozitif çıkanlar a + b.', 'Duyarlılık = a / (a + c): hastalar içinde doğru yakalanan.', 'Özgüllük = d / (b + d): sağlamlar içinde doğru dışlanan.', 'PPV = a / (a + b): pozitif çıkanlar içinde gerçekten hasta olan. Yaygınlık düşükse PPV de düşer.'], kendin: '1000 kişi, yaygınlık %1, duyarlılık %90, özgüllük %90. PPV kaçtır?', kendinCevap: '9 gerçek pozitif, 99 yanlış pozitif: PPV = 9 / 108 ≈ %8.' } },

    { ad: 'Örneklem büyüklüğü',
      kanca: { soru: 'Bir oranı ±%5 hata ile tahmin etmek istiyorsun ama oranı bilmiyorsun. Hangi oranı alırsın?', cevap: '0,5. P(1 − P) en büyük olduğunda, yani belirsizlik en yüksek olduğunda, güvenli taraf budur.', neden: 'En kötü durumu varsayarak n’i yeterli seçersin.' },
      cekirdek: [
        { b: 'Üç şey belirler', m: 'Güven (Z), hata payı (d), değişkenlik (σ veya P(1 − P)).' },
        { b: 'Hata payı SE’den gelir', m: 'd = Z · SE. SE = σ / √n olduğu için n = Z² σ² / d².' },
        { b: 'Oran için', m: 'n = Z² · P(1 − P) / d². P = 0,5 en büyük değişkenliği verir.' }
      ],
      turet: { baslik: 'n formülünü d = Z · SE’den çıkar', adimlar: ['Güven aralığının yarı genişliği: d = Z · SE. (%95 için Z = 1,96.)', 'SE = σ / √n. Yerine koy: d = Z · σ / √n.', '√n’yi yalnız bırak: √n = Z · σ / d. İki yanın karesini al: n = Z² σ² / d².', 'Oran için σ² yerine P(1 − P) yaz.'], kendin: 'Z = 1,96, P = 0,5, d = 0,05. n kaçtır?', kendinCevap: '1,96² · 0,25 / 0,05² ≈ 384,2, yani 385 kişi.' } },

    { ad: 'Kategorik veri: ki-kare',
      kanca: { soru: 'İki kategorik değişkenin ilişkisini test edeceksin. Beklenen değerleri nasıl bulursun?', cevap: 'Beklenen = satır toplamı × sütun toplamı / N. İlişki yoksa olması gereken değer budur.', neden: 'Ki-kare, gözlenen ile beklenen arasındaki farka bakar.' },
      cekirdek: [
        { b: 'Kategorik veri sayılarla karşılaştırılır', m: 'Gözlenen (G) ve beklenen (B) frekanslar; sapma ikisinin farkıdır.' },
        { b: 'Beklenen, ilişkisizlik varsayımından gelir', m: 'B = satır toplamı × sütun toplamı / N.' },
        { b: 'χ² = Σ (G − B)² / B', m: 'Büyük sapma büyük χ² demektir. sd = (S − 1)(K − 1).' }
      ],
      turet: { baslik: 'Beklenen değer ve χ² nereden gelir', adimlar: ['İlişki yoksa, her satırın oranı genel orana eşit olmalı.', 'Hücre beklenen = satır toplamı × sütun toplamı / N: o hücreye düşecek pay.', 'Sapmayı kareleyip B’ye bölmek: (G − B)² / B. Kare işaretten kurtarır; B’ye bölmek büyük hücrelerin etkisini dengeler.', 'Hepsini topla: χ². sd = (S − 1)(K − 1), çünkü toplamlar sabitken yalnızca bu kadar hücre serbest kalır.'], kendin: 'Satır toplamları 50 ve 50, sütun toplamları 40 ve 60, N = 100. İlk hücrenin beklenen değeri kaçtır?', kendinCevap: '50 · 40 / 100 = 20.' } },

    { ad: 'Korelasyon ve regresyon',
      kanca: { soru: 'r = 0,9 ise X, Y’deki değişimin %90’ını açıklar mı?', cevap: 'Hayır. Açıklanan oran r² = 0,81’dir. Ayrıca korelasyon nedensellik değildir.', neden: 'r ile r²’yi karıştırmak en sık hatadır.' },
      cekirdek: [
        { b: 'r birlikte değişimin yönü ve gücüdür', m: '−1 ile +1 arasında. r = 0 doğrusal ilişki yok demektir, nedensellik değil.' },
        { b: 'Kovaryans, standartlaştırılmış', m: 'r = cov(x, y) / (SDx · SDy): her değişkeni z’ye çevirip çarpmanın ortalaması.' },
        { b: 'Regresyon: en iyi doğru', m: 'Y = a + bX. b eğim, a kesişim. r² açıklanan orandır.' }
      ],
      turet: { baslik: 'r’yi z skorlarından çıkar', adimlar: ['Her x için z_x = (x − x̄) / SDx, her y için z_y = (y − ȳ) / SDy.', 'Çarpımların toplamı: Σ(z_x · z_y). Örneklemde (n − 1) ile bölünce r çıkar.', 'Sonuç: r = Σ(x − x̄)(y − ȳ) / [(n − 1) · SDx · SDy].', 'r²: Y’nin toplam değişkenliğinin X ile açıklanan payı.'], kendin: 'r = 0,5 ise r² kaçtır?', kendinCevap: '0,25: değişkenliğin dörtte biri. r = 0,3 olsa yalnızca %9.' } },

    { ad: 'Tıp bilişimi II: büyük dil modelleri',
      kanca: { soru: 'Bir LLM “bu makale 2019 Lancet’te yayımlandı” diyor ama makale yok. Neden böyle yapar?', cevap: 'Model doğruyu değil, bağlamda en olası devamı üretir. Buna halüsinasyon denir.', neden: 'Olasılık makinesidir; kaynak doğrulaması yapmaz.' },
      cekirdek: [
        { b: 'LLM bir olasılık makinesidir', m: 'Bir metin dizisinden sonra en olası devamı üretir. Anlam bir olasılık tablosuna dönüşür.' },
        { b: 'Transformer ve dikkat', m: 'Her kelime cümledeki öteki kelimelere aynı anda bakar (attention). Eğitim: sonraki kelimeyi tahmin etmek.' },
        { b: 'Halüsinasyon: inandırıcı ama yanlış', m: 'Olası ile doğru aynı şey değildir. Doğrulama yoksa kaynak uydurulabilir.' }
      ],
      turet: { baslik: 'Cümlenin olasılığı koşullu olasılıkların çarpımıdır', adimlar: ['Model her sonraki kelime için P(kelime | önceki kelimeler) hesaplar.', 'Bir cümle bu koşullu olasılıkların çarpımıdır: P(w₁…wₙ) = P(w₁) · P(w₂ | w₁) · …', 'Bu, Bölüm 5’teki çarpma kuralının aynısıdır.', 'Halüsinasyon: en yüksek olasılıklı devamın gerçek dışı çıkmasıdır.'], kendin: 'Her kelime 0,5 olasılıkla seçiliyorsa üç kelimelik bir cümlenin olasılığı kaçtır?', kendinCevap: '0,5 · 0,5 · 0,5 = 0,125.' } },

    { ad: 'Sentez: tek kök',
      kanca: { soru: 'Bütün kitabı tek cümleye sığdır.', cevap: 'İstatistik, değişkenliğin içinde gerçeği şanstan ayırma sanatıdır.', neden: 'Her konu bu cümlenin bir parçasıdır.' },
      cekirdek: [
        { b: 'Tek kök: sapma (x − x̄)', m: 'Ortalama, varyans, SD, SE, z, t, F, χ², r: hepsi sapmadan türer.' },
        { b: 'Test kalıbı tek', m: '(gözlenen − beklenen) / SE. Test seçimi: tasarım → normallik → grup sayısı → varyans.' },
        { b: 'Sınav sabahı', m: 'Formül verilir, yeri sen bulursun. Varyans verilmişse önce karekök al.' }
      ],
      turet: { baslik: 'Bir formülü başka formülden çıkar: SE’den geri hesap', adimlar: ['SE = SD / √n. İki yanı √n ile çarp: SD = SE · √n.', 'Varyans, SD’nin karesidir: varyans = (SE · √n)².', 'Eşli t: t = |d̄| · √n / SD_d. Geri hesap: d̄ = t · SD_d / √n.', 'Hepsi aynı kökten: değişkenlik √n ile ölçeklenir.'], kendin: 'SE = 2 ve n = 25 ise SD ve varyans kaçtır?', kendinCevap: 'SD = 2 · 5 = 10; varyans = 100.' } }
  ];
})();
