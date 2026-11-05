/* Tüm dersi 0'dan öğren — biyofizik, halk sağlığı, nükleer tıp konu içeriği (r126).
   Sıra: çekirdek → türetme (çekirdekten detaya, adım adım) → uygulama (kullanıcı türetir, Jane değerlendirir).
   Eşleme bölüm kimliğiyle yapılır. Kaynak: kitabın bölüm ve alt başlıkları. */
(function () {
  'use strict';
  window.KursIcerik = window.KursIcerik || {};

  window.KursIcerik.biyofizik = [
    { bolum: 'bolum-0', ad: 'Biyofizik neden var?',
      cekirdek: [
        { b: 'Biyofizik fiziğin sorusunu ekler', m: 'Biyoloji “ne oluyor?” diye sorar; biyofizik “neden ve nasıl?” diye, fiziğin dilinde sorar.' },
        { b: 'Canlıya özel bir fizik yoktur', m: 'Elektron bakır telde de sinir hücresinde de aynı yasalara uyar.' },
        { b: 'Üç ölçek', m: 'Molekül, hücre ve organizma. Her biri için farklı fiziksel yasa öne çıkar.' }
      ],
      turet: { baslik: 'Hekim neden biyofizik öğrenir?', adimlar: ['İlaç çoğu zaman bir molekülün reseptöre tutunmasıyla çalışır.', 'Tutunmanın gücünü ve yönünü fizik açıklar (bağ kuvvetleri).', 'EKG, MRI gibi ölçümler fiziğin ilkelerine dayanır.', 'Teşhis ve tedavi kararları bu ölçümleri doğru okumayı gerektirir.'], kendin: 'Bir ilacın etkisi zayıf bir bağla reseptöre tutunmasından geliyorsa, bu hangi ölçekte açıklanır?', kendinCevap: 'Moleküler ölçekte; bağ kuvvetleri ve yönü ile.' } },

    { bolum: 'bolum-1', ad: 'Atomik özellikler',
      cekirdek: [
        { b: 'Atomun yapısı', m: 'Çekirdek (proton ve nötron) ile elektronlar. Proton sayısı elementi belirler.' },
        { b: 'Elektron olasılık bulutudur', m: 'Dört kuantum sayısı bir elektronun durumunu tam tanımlar, bir adres gibi.' },
        { b: 'Elektron dizilimi davranışı belirler', m: 'Kimyasal bağ kurma eğilimi, en dış (değerlik) elektronlardan gelir.' }
      ],
      turet: { baslik: 'Karbon neden dört bağ yapar?', adimlar: ['Karbonun 6 elektronu vardır: 1s² 2s² 2p².', 'Dış kabukta 4 elektron vardır; 4 eksik ya da fazla değerlik var.', '2s ve 2p orbitalleri karışıp dört eşdeğer orbital oluşturabilir.', 'Sonuç: karbon dört ayrı yönde dört bağ kurar.'], kendin: 'Oksijen (8 elektron) kaç kovalent bağ yapma eğilimindedir?', kendinCevap: 'İki bağ: dış kabukta iki eksik elektron vardır.' } },

    { bolum: 'bolum-2', ad: 'Biyomoleküller arası etkileşimler',
      cekirdek: [
        { b: 'Kovalent bağ güçlü ve kalıcıdır', m: 'Elektron paylaşımı ile oluşur; kolay kopmaz, yapıyı sabit tutar.' },
        { b: 'Zayıf bağlar tersinirdir', m: 'Hidrojen bağı, van der Waals ve hidrofobik etkileşimler kısa ömürlüdür ve kurulup kopabilir.' },
        { b: 'Isıl enerji ile denge', m: 'Vücut sıcaklığında ısıl enerji (RT ≈ 2,6 kJ/mol) zayıf bağların kopup kurulmasına izin verir.' }
      ],
      turet: { baslik: 'Canlıda neden zayıf bağlar kullanılır?', adimlar: ['Kovalent bağ çok güçlüdür; kopması çok enerji ister.', 'Kopmayan bağ yapıyı sabitler, ama değişmesi gereken yerde işe yaramaz.', 'Zayıf bağlar, ısıl enerjiyle hem tutar hem bırakır.', 'Enzim ve ilaçlar bağlanıp ayrılabilir: yaşam dinamik kalır.'], kendin: 'DNA’nın iki sarmalını bir arada tutan bağ hangisidir ve neden zayıf olmalıdır?', kendinCevap: 'Hidrojen bağı; sarmalın açılıp kopyalanabilmesi için zayıf olması gerekir.' } },

    { bolum: 'bolum-3', ad: 'Canlıları oluşturan moleküller ve su',
      cekirdek: [
        { b: 'Su bükük ve polardır', m: 'Oksijen elektronları kendine çeker; su molekülleri aralarında hidrojen bağı kurar.' },
        { b: 'Dört biyomolekül sınıfı', m: 'Karbonhidrat, lipit, protein, nükleik asit.' },
        { b: 'Protein şekli diziye bağlıdır', m: 'Aminoasit dizisi katlanmayı belirler; yapı esneklik ile sertlik arasında dengededir.' }
      ],
      turet: { baslik: 'Suyun kaynama noktası neden yüksektir?', adimlar: ['Metan (18’e yakın kütle, 16 g/mol) −162 °C’de kaynar.', 'Su (18 g/mol) 100 °C’de kaynar: aradaki fark hidrojen bağlarıdır.', 'Hidrojen bağlarını koparmak ek enerji ister.', 'Bu yüzden su sıvı kalır ve canlılar için uygun bir çözücüdür.'], kendin: 'Su yerine metan sıvı olsaydı biyolojik reaksiyonlar nasıl etkilenirdi?', kendinCevap: 'Sıvı, polar bir çözücü ortamı olmazdı; çözünme ve tepkime ortamı ortadan kalkardı.' } },

    { bolum: 'bolum-4', ad: 'Sibernetik: geri besleme',
      cekirdek: [
        { b: 'Sistem girdi ve çıktıdır', m: 'Çıktı, girdiyi değiştiriyorsa bu bir geri beslemedir.' },
        { b: 'Negatif geri besleme homeostaz üretir', m: 'Sapma azaltılır ve döngü kendini durdurur.' },
        { b: 'Pozitif geri besleme sapmayı büyütür', m: 'Döngü kendini artırır; kaçış ve olay zinciri üretir.' }
      ],
      turet: { baslik: 'Kan şekeri nasıl dengelenir?', adimlar: ['Kan şekeri yükselir.', 'Pankreas insülin salgılar; glikoz hücrelere girer.', 'Kan şekeri düşer; insülin salgısı azalır.', 'Döngü dengeye yaklaşınca kendini durdurur: negatif geri besleme.'], kendin: 'Doğumda oksitosin ile kasılmalar neden birbirini artırır?', kendinCevap: 'Pozitif geri besleme: kasılma oksitosini artırır, oksitosin daha güçlü kasılma yapar.' } },

    { bolum: 'bolum-5', ad: 'Biyomekanik ve doku mühendisliği',
      cekirdek: [
        { b: 'Stres ve strain', m: 'Stres: birim alana düşen kuvvet. Strain: buna bağlı göreli şekil değişimi. Hooke: sınırda ikisi orantılıdır.' },
        { b: 'Kaldıraçlar', m: 'Kas kuvveti, dönme noktasına yakın bağlanır; yük uzaktadır. Bu yüzden kas çok güçlü olmalıdır.' },
        { b: 'Laplace yasası', m: 'Kavisli zarda duvar gerilimi, yarıçap ve basınçla orantılıdır (T ∝ r·P).' }
      ],
      turet: { baslik: 'Parmak ucunda yükselmek neden çok kas kuvveti ister?', adimlar: ['Dönme noktası ayak bileğidir.', 'Kas kuvveti kısa bir kolda çalışır; yük vücut ağırlığı uzun kolda çalışır.', 'Moment dengesi: F_kas × d_kas = W × d_yük.', 'd_kas küçük olduğu için F_kas, W’nin birkaç katı olur.'], kendin: 'Bir damarın yarıçapı iki katına çıkarsa duvar gerilimi (Laplace’a göre) nasıl değişir?', kendinCevap: 'İki kat artar (T ∝ r·P, basınç sabitse).' } },

    { bolum: 'bolum-6', ad: 'Nanotıp',
      cekirdek: [
        { b: 'Nano ölçek', m: '1 nanometre metrenin milyarda biridir. Nanoparçacıklar 100 nm’den küçük yapılardır.' },
        { b: 'Yüzey/hacim oranı büyür', m: 'Küçüldükçe yüzey, hacme göre çok artar; yüzey etkileşimleri baskınlaşır.' },
        { b: 'Hedefli ilaç taşıma', m: 'Yüzeyi bir molekülle kaplanmış nanoparçacık ilacı hedef dokuya taşır.' }
      ],
      turet: { baslik: 'Nanoparçacık neden hedefli taşıyıcı olur?', adimlar: ['Parçacık küçüldükçe yüzey/hacim oranı büyür.', 'Yüzeye hedef molekül bağlanabilir.', 'Tümör damarlarındaki boşluklardan parçacık birikir.', 'Sonuç: ilaç hedefte yoğunlaşır, dokuya yayılması azalır.'], kendin: 'Yüzey/hacim oranı küçülürse hedefli taşıyıcılık nasıl etkilenir?', kendinCevap: 'Zayıflar: yüzeydeki hedef molekül sayısı ve etkileşim azalır.' } },

    { bolum: 'bolum-7', ad: 'Sentez: tek bir neden zinciri',
      cekirdek: [
        { b: 'Ontolojik merdiven', m: 'Atom → kovalent bağ → molekül → zayıf etkileşimlerle yapı → hücre → organizma.' },
        { b: 'Yaşam dinamik kalır', m: 'Zayıf bağlar, ısıl enerji ile kurulup kopar; bu sayede yapı değişebilir.' },
        { b: 'Üç ana fikir', m: 'Yapı–işlev ilişkisi, enerji ve düzen, ölçek. Kitabın bütün konuları bu üçüne bağlanır.' }
      ],
      turet: { baslik: 'Protein katlanmasının neden zor olduğunu çıkar', adimlar: ['Aminoasit dizisi çok sayıda zayıf bağ oluşturabilir.', 'Bu bağların kombinasyonu çok sayıda olası şekil verir.', 'Yapı, enerjisi en düşük şekle yönelir; ama yol karmaşıktır.', 'Sonuç: diziden yapıyı tahmin etmek zordur.'], kendin: 'Çok sayıda zayıf bağ tek bir kovalent bağ kadar güçlü olmayabilir; yine de yapıyı nasıl tutar?', kendinCevap: 'Sayı ve yön: çok sayıda bağ birlikte güçlü bir yapı verir.' } }
  ];

  window.KursIcerik['halk-sagligi'] = [
    { bolum: 'bolum-1', ad: 'Halk sağlığı ve toplum hekimliği',
      cekirdek: [
        { b: 'Halk sağlığı tanımı', m: 'Örgütlenmiş toplum çabasıyla hastalığı önlemek ve sağlığı geliştirmek.' },
        { b: 'Klinik ve toplum hekimliği', m: 'Klinik hekim bireyi, toplum hekimi nüfusu hedefler.' },
        { b: 'Kanıt ve izleme', m: 'Önlemler ölçülür, kanıtla seçilir ve sonucu izlenir.' }
      ],
      turet: { baslik: 'Toplumsal bir önlem nasıl seçilir?', adimlar: ['Sorun hızlarla ölçülür.', 'Nedenleri araştırılır.', 'Etkili müdahale kanıtla seçilir.', 'Uygulanır ve sonuç izlenir.'], kendin: 'Antibiyotik direncinde klinik hekim ve toplum hekimi neye bakar?', kendinCevap: 'Klinik hekim bireyin tedavisine, toplum hekimi toplumda direnç ve kullanım oranına bakar.' } },

    { bolum: 'bolum-2', ad: 'Halk sağlığı düşüncesinin tarihi',
      cekirdek: [
        { b: 'Hekimliğin aşamaları', m: 'Bulgusal (her bulgu ayrı hastalık), laboratuvar (1880’ler), sonra toplumsal yaklaşım.' },
        { b: 'Sanitasyon ve bulaşıcı hastalık', m: 'Su, atık ve konut düzeni hastalıkların yayılmasını azaltmıştır.' },
        { b: 'Snow’un kolera çalışması', m: 'Vakalar bir su pompası çevresinde kümelendi; pompa kapatılınca vakalar düştü.' }
      ],
      turet: { baslik: 'Snow kolera nedenini nasıl buldu?', adimlar: ['Vakalar haritaya işlendi.', 'Vakalar bir su pompası çevresinde kümelendi.', 'Pompa kapatıldı; yeni vakalar azaldı.', 'Sonuç: nedenin su kaynağı olduğu gözlemle çıkarıldı.'], kendin: 'Bu çalışmada hangi yöntem kullanıldı?', kendinCevap: 'Epidemiyolojik gözlem ve haritalama (vaka kümelenmesi).' } },

    { bolum: 'bolum-3', ad: 'Hakkaniyet ve halk sağlığının ilkeleri',
      cekirdek: [
        { b: 'Eşitlik ile hakkaniyet farklıdır', m: 'Eşitlik herkese aynısını verir; hakkaniyet ihtiyaca göre verir.' },
        { b: 'Sağlıkta eşitsizlik', m: 'Gelir, eğitim ve bölge gibi sosyal nedenlerle hastalık ve erişim farkları oluşur.' },
        { b: 'Hedefli dağıtım', m: 'Hakkaniyet kaynağın en çok ihtiyacı olana yönlendirilmesini gerektirir.' }
      ],
      turet: { baslik: 'Hakkaniyetli dağıtım nasıl yapılır?', adimlar: ['İhtiyaç göstergesi seçilir.', 'Gruplar arasındaki farklar ölçülür.', 'En yüksek ihtiyaçlı gruba öncelik verilir.', 'Sonuç izlenir ve gerekirse güncellenir.'], kendin: 'Sağlık kaynağını eşit paylaştırmak mı, ihtiyaca göre paylaştırmak mı hakkaniyettir?', kendinCevap: 'İhtiyaca göre paylaştırmak.' } },

    { bolum: 'bolum-4', ad: 'Sağlık hizmetlerinin türleri ve korunma düzeyleri',
      cekirdek: [
        { b: 'Birincil korunma', m: 'Hastalık oluşmadan önlem almak: aşı, sağlıklı beslenme.' },
        { b: 'İkincil korunma', m: 'Erken tanı ve tedavi: tarama programları.' },
        { b: 'Üçüncül korunma', m: 'Komplikasyonu ve sakatlığı azaltmak, rehabilitasyon.' }
      ],
      turet: { baslik: 'Diyabette her korunma düzeyi ne yapar?', adimlar: ['Birincil: beslenme ve hareket önerisi (hastalığı önler).', 'İkincil: kan şekeri taraması (erken tanı).', 'Üçüncül: göz ve böbrek komplikasyonlarını önleme.', 'Her düzey bir önceki düzeyin üzerine eklenir.'], kendin: 'Bir aşı hangi korunma düzeyidir?', kendinCevap: 'Birincil korunma.' } },

    { bolum: 'bolum-5', ad: 'Temel sağlık hizmetleri: Alma-Ata, Ottawa, Astana',
      cekirdek: [
        { b: 'Temel sağlık hizmeti (TSH)', m: 'Toplumun kabul edeceği yollarla, toplumun tam katılımıyla ve ülkenin karşılayabileceği maliyetle sunulan hizmet.' },
        { b: 'Alma-Ata 1978', m: 'Sağlık eğitimi, temiz su ve sanitasyon, bağışıklama, temel ilaç gibi öğeleri içerir.' },
        { b: 'Ottawa 1986 ve Astana 2018', m: 'Ottawa sağlığı geliştirme ve kamu politikasını vurgular; Astana TSH’yi yeniden öne çıkarır.' }
      ],
      turet: { baslik: 'Toplum katılımı neden temel ilkedir?', adimlar: ['Hizmet toplumun yaşamına uymalıdır.', 'Toplum katılmazsa hizmet kabul görmez.', 'Katılım hem kabul edilebilirlik hem sürdürülebilirlik sağlar.', 'Sonuç: TSH toplumla birlikte kurulur.'], kendin: 'Ottawa Şartı’nın ana vurgusu nedir?', kendinCevap: 'Sağlığı geliştirme ve sağlığa etki eden kamu politikaları.' } },

    { bolum: 'bolum-6', ad: 'Türkiye’de koruyucu sağlık hizmetleri',
      cekirdek: [
        { b: 'Ana-çocuk sağlığı ve bağışıklama', m: 'Ulusal aşı takvimi; hastalıkların en tehlikeli olduğu yaşlarda bağışıklık kazandırır.' },
        { b: 'Sunan kurum', m: 'Koruyucu hizmeti aile hekimliği ve sağlık ocağı birimleri sunar.' },
        { b: 'Tarama programları', m: 'Kanser ve diyabet gibi hastalıklar için düzenli taramalar yapılır.' }
      ],
      turet: { baslik: 'Aşı takvimi neden erken yaşta başlar?', adimlar: ['Bazı hastalıklar bebeklikte çok ölümcüldür.', 'Bağışıklık, hastalığın en tehlikeli olduğu zamandan önce kazanılmalıdır.', 'Anneden geçen antikorlar zamanla azalır.', 'Takvim bu iki bilgiye göre sıralanır.'], kendin: 'Aşı takvimi neden “zamanında” uygulanmalıdır?', kendinCevap: 'Hastalığın en tehlikeli olduğu yaşta bağışıklık gerektiği için.' } },

    { bolum: 'bolum-7', ad: 'Sağlık hizmetlerinin örgütlenmesi',
      cekirdek: [
        { b: 'Basamaklı sistem', m: 'Birinci basamak aile hekimliği; ikinci basamak devlet hastanesi; üçüncü basamak eğitim ve uzman hastaneleri.' },
        { b: 'İlk başvuru birinci basamaktır', m: 'Sorunların çoğu burada çözülür; gerekirse yönlendirme yapılır.' },
        { b: 'Göstergeler', m: 'Bebek ölüm hızı, anne ölüm oranı, yaşam beklentisi sistemin çıktısını ölçer.' }
      ],
      turet: { baslik: 'İlk başvuru neden birinci basamaktır?', adimlar: ['Sorunların büyük kısmı basittir.', 'Bunlar ikinci ve üçüncü basamağa gitmeden çözülürse o basamaklar yük altına girmez.', 'Birinci basamak hızlı ve ucuzdur.', 'Sonuç: sistem daha verimli çalışır.'], kendin: 'Bebek ölüm hızı nasıl hesaplanır?', kendinCevap: 'Bir yaş altı ölen bebek sayısı ÷ canlı doğan bebek sayısı × 1000 (‰).' } },

    { bolum: 'bolum-8', ad: 'Türkiye’de halk sağlığının tarihi',
      cekirdek: [
        { b: 'Cumhuriyet’te koruyucu sağlık', m: 'Sağlık ocakları ve bulaşıcı hastalıkla mücadele Cumhuriyet döneminin temel adımlarıdır.' },
        { b: 'Sağlıkta Dönüşüm (2003)', m: 'Erişim ve kapsam arttı; kalite ve performans eleştirildi.' },
        { b: 'Aile hekimliği (2010)', m: 'Birinci basamak nüfusa sorumlu hekim sistemiyle yeniden örgütlendi.' }
      ],
      turet: { baslik: 'Sağlıkta Dönüşüm’ün kazanımları göstergelerde nasıl görünür?', adimlar: ['Erişim ve kapsam artar.', 'Koruyucu hizmetlere katılım yükselir.', 'Bebek ve anne ölümleri düşer.', 'Sonuç: göstergeler bu değişimi yansıtır.'], kendin: 'Sağlıkta Dönüşüm’ün olumlu ve eleştirilen yanları nelerdir?', kendinCevap: 'Olumlu: erişim ve kapsam; eleştiri: performans ve kalite.' } }
  ];

  window.KursIcerik['nukleer-tip'] = [
    { bolum: 'bolum-1', ad: 'Nükleer tıp nedir?',
      cekirdek: [
        { b: 'Radyofarmasötik', m: 'Radyonüklid, bağlayıcı molekül ve taşıyıcı molekülden oluşan ilaç.' },
        { b: 'Teşhis ve tedavi', m: 'Aynı yaklaşım hem görüntüleme (teşhis) hem tedavi için kullanılır.' },
        { b: 'İç radyasyon', m: 'Işın kaynağı vücudun içindedir; kamera dışarıdan algılar.' }
      ],
      turet: { baslik: 'Görüntü neden vücuda verilen ilaçla oluşur?', adimlar: ['Radyonüklid gama ışını yayar.', 'İlaç belirli bir organa taşınır.', 'Kamera dışarıdan gama fotonlarını sayar.', 'Sayım yoğunluğu organın fonksiyonunu gösterir.'], kendin: 'Kemik taramasında hangi tür birikim görüntülenir?', kendinCevap: 'Kemikte aktivitenin yoğun olduğu bölgeler (ör. Tc-99m-MDP).' } },

    { bolum: 'bolum-2', ad: 'Görüntüleme mi, tedavi mi? Radyasyon türleri',
      cekirdek: [
        { b: 'Alfa, beta, gama', m: 'Alfa ağır ve kısa menzilli; beta elektron yayar; gama foton yayar ve vücuttan çıkabilir.' },
        { b: 'Pozitron yayıcılar', m: 'Pozitron, elektronla karşılaşıp iki 511 keV fotonu üretir.' },
        { b: 'Görüntüleme ve tedavi ayrımı', m: 'Görüntüleme için gama ve pozitron, tedavi için alfa ve beta kullanılır.' }
      ],
      turet: { baslik: 'Görüntüleme için neden gama seçilir?', adimlar: ['Görüntüde ışın vücuttan dışarı çıkabilmeli.', 'Alfa ve beta vücutta kısa sürede durur.', 'Gama dışarı çıkar ve kamera ile sayılır.', 'Sonuç: görüntüleme için gama uygundur.'], kendin: 'Tedavide neden beta yayıcı tercih edilir?', kendinCevap: 'Menzili kısa olduğu için doz hedef dokuda yoğunlaşır.' } },

    { bolum: 'bolum-3', ad: 'Radyonüklidler ve radyofarmasötikler',
      cekirdek: [
        { b: 'Üç yarı ömür', m: 'Fiziksel yarı ömür (bozunma), biyolojik yarı ömür (vücuttan atılma), efektif yarı ömür (ikisinin birleşimi).' },
        { b: 'Tc-99m', m: 'Yaygın görüntüleme radyonüklidi; yarı ömrü yaklaşık 6 saat, gama enerjisi 140 keV.' },
        { b: 'Radyofarmasötiğin yapısı', m: 'Radyonüklid + bağlayıcı + taşıyıcı molekül.' }
      ],
      turet: { baslik: 'Efektif yarı ömür formülünü çıkar', adimlar: ['Vücuttaki toplam azalma iki sürecin birleşimidir.', 'Oranları çarpıp toplarsın: 1/T_eff = 1/T_fiz + 1/T_bio.', 'Bu, T_eff = (T_fiz × T_bio) / (T_fiz + T_bio) demektir.', 'Sonuç her zaman ikisinden küçüktür.'], kendin: 'Fiziksel yarı ömür 6 saat, biyolojik yarı ömür 12 saat ise efektif yarı ömür kaç saattir?', kendinCevap: '(6 × 12) / (6 + 12) = 4 saat.' } },

    { bolum: 'bolum-4', ad: 'Sintigrafik görüntüleme',
      cekirdek: [
        { b: 'Gama kamera ve SPECT', m: 'Gama kamera gama fotonlarını sayar; SPECT kamerayı döndürerek 3B kesit üretir.' },
        { b: 'PET ve koinsidans', m: 'İki zıt 511 keV foton aynı anda algılanınca olay yeri çizgisi bulunur.' },
        { b: 'Hibrit görüntüleme', m: 'SPECT/BT ve PET/BT fonksiyonel bilgiyi anatomik bilgiyle birleştirir.' }
      ],
      turet: { baslik: 'PET neden daha duyarlıdır?', adimlar: ['Pozitron iki foton üretir; ikisi zıt yönde ilerler.', 'Koinsidans: iki foton aynı anda algılanınca yerleşim çizgisi belirlenir.', 'Gereksiz sayımlar elenir.', 'Sonuç: daha iyi çözünürlük ve duyarlılık.'], kendin: 'PET’te iki fotonun enerjisi nedir?', kendinCevap: 'İkisi de 511 keV.' } },

    { bolum: 'bolum-5', ad: 'Radyonüklid tedavi ve teranostik',
      cekirdek: [
        { b: 'İç radyoterapi', m: 'Radyofarmasötik hedefe verilir ve yerinde ışınlar.' },
        { b: 'Teranostik', m: 'Aynı hedef molekülle önce teşhis, sonra tedavi yapılır.' },
        { b: 'Örnek', m: 'Ga-68 PSMA ile teşhis, Lu-177 PSMA ile tedavi (prostat kanseri).' }
      ],
      turet: { baslik: 'Teşhis neden tedaviden önce yapılır?', adimlar: ['Hedefe ilacın birikip birikmediği görüntüyle sınanır.', 'Birikim varsa tedavi dozu hesaplanır.', 'Tedavi uygulanır.', 'Yanıt yeniden görüntülenerek izlenir.'], kendin: 'Ga-68 PSMA ile Lu-177 PSMA arasındaki fark nedir?', kendinCevap: 'Ga-68 pozitron yayıcıdır (teşhis); Lu-177 beta yayıcıdır (tedavi); hedef molekül aynıdır.' } }
  ];
})();
