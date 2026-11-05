/* Tüm dersi 0'dan öğren — anatomi ve tıp tarihi konu içeriği (r125).
   Sıra: çekirdek → türetme (çekirdekten detaya, adım adım) → uygulama (kullanıcı türetir, Jane değerlendirir).
   Eşleme bölüm kimliğiyle yapılır (bolum); anatomide bolum-11 kapalıdır. Kaynak: kitabın bölüm başlıkları ve alt başlıkları. */
(function () {
  'use strict';
  window.KursIcerik = window.KursIcerik || {};

  window.KursIcerik.anatomi = [
    { bolum: 'bolum-0', ad: 'Anatominin dili',
      cekirdek: [
        { b: 'Anatomik duruş', m: 'Kişi ayakta, yüz öne, avuç içleri öne bakar. Bütün yön terimleri bu duruşa göre tanımlanır.' },
        { b: 'Üç düzlem', m: 'Sagittal: sağ–sol ayırır. Frontal (koronal): ön–arka ayırır. Transversal: üst–alt ayırır.' },
        { b: 'Zıt çiftler', m: 'Anterior–posterior, superior–inferior, medial–lateral, proksimal–distal, superfisyal–profunda.' }
      ],
      turet: { baslik: 'Bir yapının yerini çekirdekten söyle', adimlar: ['Duruşta kişinin önü anterior, arkası posterior.', 'Orta hatta yakın olan medial, uzak olan lateral.', 'Burun gözün medialindedir ve ondan anteriordur: medial ve anterior.', 'Aynı mantıkla: bir yapı gövdeye yakınsa proksimal, uzaksa distal.'], kendin: 'Dirsek omuza göre hangi yöndedir? Ön kolun el tarafı hangi uçtur?', kendinCevap: 'Dirsek omuza göre distal ve inferior; ön kolda el tarafı distaldir.' } },

    { bolum: 'bolum-1', ad: 'Kemik: genel bilgi',
      cekirdek: [
        { b: 'Kemik canlı bir dokudur', m: 'Dışta sert kortikal kemik, içte süngerimsi (spongioz) kemik. İlik kan yapar.' },
        { b: 'Dört temel tip', m: 'Uzun, kısa, yassı, düzensiz. Havalı kemikler ve sesamoidler bunların özel durumlarıdır.' },
        { b: 'İki kemikleşme yolu', m: 'Yassı kemikler (kafatası çatısı) doğrudan bağ dokusundan. Uzun kemikler kıkırdak taslağından.' }
      ],
      turet: { baslik: 'Uzun kemik neden kendi uçlarından büyür?', adimlar: ['Uzun kemiğin gövdesi önce kemikleşir.', 'Uçları ilk başta kıkırdaktır ve ayrı merkezlerden kemikleşir.', 'Gövde ile uç arasında büyüme plağı (kıkırdak) kalır: boyuna büyüme buradan olur.', 'Büyüme bitince plak kapanır; uçlar gövdeyle kaynaşır.'], kendin: 'Yassı kemikler (kafatası çatısı) hangi yolla kemikleşir?', kendinCevap: 'İntramembranöz yolla: taslak olmadan doğrudan bağ dokusunda kemikleşir.' } },

    { bolum: 'bolum-2', ad: 'Eklemler: genel bilgi',
      cekirdek: [
        { b: 'Eklem iki kemiği bağlar', m: 'Üç sınıf: fibröz (oynamaz ya da az oynar), kıkırdak, sinovyal (en çok hareket eden).' },
        { b: 'Sinovyal eklemin parçaları', m: 'Eklem yüzleri (kıkırdakla kaplı), eklem kapsülü, sinovyal sıvı.' },
        { b: 'Eksen sayısı yüzey şeklini belirler', m: 'Bir eksen: menteşe. İki eksen: eliptik. Üç eksen: küresel (top–yuva).' }
      ],
      turet: { baslik: 'Hareket sayısını eksenden çıkar', adimlar: ['Bir eksen etrafında tek bir düzlemde dönüş olur: bükme–açma.', 'İki eksen iki düzlemde hareket demektir: bükme–açma ile yana gitme.', 'Üç eksen her yöne dönüş demektir.', 'Yüz şekli eksen sayısını, eksen sayısı da hareket sayısını belirler.'], kendin: 'Omuz eklemi neden bu kadar hareketli, buna karşılık neden çıkmaya yatkın?', kendinCevap: 'Küresel (üç eksen) ve sığ yuva; stabilite kapsül ve kaslardan gelir, yuva derin değildir.' } },

    { bolum: 'bolum-3', ad: 'Kaslar: genel bilgi',
      cekirdek: [
        { b: 'Üç kas tipi', m: 'İskelet kası (istemli, hızlı), düz kas (istem dışı, organlarda), kalp kası (kalpte, istem dışı).' },
        { b: 'Kas yalnızca çeker', m: 'İki ucu iki kemiğe bağlanır (origo, insertio) ve arada en az bir eklem vardır. Kas itmez.' },
        { b: 'Agonist ve antagonist', m: 'Bir hareketi yapan kas agonisttir; onu geri alan kas antagonisttir.' }
      ],
      turet: { baslik: 'Dirsek hem bükülür hem açılır: kas çiftinden çıkar', adimlar: ['Kas yalnızca kısalarak çeker.', 'Dirseği bükmek için biceps kısalır: agonist.', 'Dirseği açmak için triceps kısalır; biceps gevşer: antagonist.', 'Sonuç: her eklemde en az bir çift kas vardır.'], kendin: 'Dirseği açan (düzelten) kas hangisidir?', kendinCevap: 'M. triceps brachii.' } },

    { bolum: 'bolum-4', ad: 'Üst ekstremite kemikleri',
      cekirdek: [
        { b: 'Kuşak ve serbest kol', m: 'Kuşak: clavicula ve scapula. Serbest kol: humerus, radius, ulna ve el kemikleri.' },
        { b: 'El üç katlıdır', m: 'Ossa carpi (8), ossa metacarpi (5), phalanges (14). Bu kemiklerin sayısı bu üç katmanla ezberlenir.' },
        { b: 'Önkolda iki kemik', m: 'Radius başparmak tarafında (lateral), ulna küçük parmak tarafında (medial). Radius, ulnanın etrafında döner.' }
      ],
      turet: { baslik: 'Dönme hareketi (pronasyon–supinasyon) önkoldan çıkar', adimlar: ['Önkolda iki kemik paralel durur; ikisi birbirine uçlarından bağlıdır.', 'Radius, ulnanın etrafında dönebilir: avuç yukarı (supinasyon) ya da aşağı (pronasyon) çevrilir.', 'Dönmenin ekseni proksimal ve distal radioulnar eklemlerden geçer.', 'Bu yüzden radius kırığı dönmeyi de bozar.'], kendin: 'Incisura radialis hangi kemiktedir?', kendinCevap: 'Ulnada (ulnanın proksimal ucunda): radius başı burada yerleşir.' } },

    { bolum: 'bolum-5', ad: 'Üst ekstremite: eklemler, kaslar, sinirler',
      cekirdek: [
        { b: 'Eklemlerin tipi farklıdır', m: 'Omuz küresel, dirsek menteşe benzeri ve radioulnar bağlantılı, el bileği elipsoid.' },
        { b: 'Plexus brachialis', m: 'Kolun sinirleri C5–T1 spinal sinirlerinden çıkar; kolun kasları ve derisi buradan beslenir.' },
        { b: 'Sinir kemiğe yaslanınca yaralanır', m: 'Humerus cisminde n. radialis, epicondylus medialis yakınında n. ulnaris, collum chirurgicum’da n. axillaris risk altındadır.' }
      ],
      turet: { baslik: 'Kırıktan sinir hasarını çıkar', adimlar: ['N. radialis, humerus cisminin arkasında spiral oluk boyunca gider.', 'Cisim kırılırsa sinir ezilir ya da kopar.', 'Bu sinir bilek ve parmak açıcılarını besler: el bileği düşer (drop).', 'Kırık yerini bilirsen, kaybolacak hareketi de tahmin edersin.'], kendin: 'Epicondylus medialis kırığında hangi sinir risk altındadır?', kendinCevap: 'N. ulnaris (N. medianus değil).' } },

    { bolum: 'bolum-6', ad: 'Alt ekstremite kemikleri',
      cekirdek: [
        { b: 'Kalça kemiği ve femur', m: 'Os coxae (ilium, ischium, pubis) gövde ağırlığını sacruma bağlar; femur vücudun en uzun kemiğidir.' },
        { b: 'Tibia taşır, fibula destekler', m: 'Tibia ağırlığı ayak bileğine taşır; fibula dış tarafta kas tutunma yeridir.' },
        { b: 'Ayak kemerleri', m: 'Tarsus, metatarsus ve phalanges; talus ve calcaneus ağırlığı yere iletir.' }
      ],
      turet: { baslik: 'Ağırlığın yolunu çıkar', adimlar: ['Gövdenin ağırlığı omurganın ucundaki sacruma gelir.', 'Sacrumdan os coxae, oradan femura geçer.', 'Femurdan diz üzerinden tibiaya, oradan talusa iner.', 'Talus ağırlığı calcaneus ve ayak kemerleriyle yere dağıtır.'], kendin: 'Vücut ağırlığı ayak bileğinden ayağa hangi kemik üzerinden geçer?', kendinCevap: 'Talus üzerinden; sonra calcaneus ve ayak kemerleriyle yere yayılır.' } },

    { bolum: 'bolum-7', ad: 'Alt ekstremite: eklemler, kaslar, sinirler',
      cekirdek: [
        { b: 'Kalça eklemi derindir', m: 'Caput femoris acetabulum içinde yer alır; kapsül ve bağlar ile sağlamlaşır.' },
        { b: 'Diz iki kaldıracın ucunda', m: 'Femur ve tibia arasında menteşe benzeri hareket; menisküsler yüzeyleri uyumlandırır.' },
        { b: 'Plexus lumbosacralis ve n. ischiadicus', m: 'Bacağın sinirleri L1–S4 segmentlerinden gelir; en büyük sinir n. ischiadicus’tur.' }
      ],
      turet: { baslik: 'Kalça çıkığının neden zor olduğunu çıkar', adimlar: ['Caput femoris derin bir yuvaya oturur.', 'Kapsül ve bağlar yuvayı kapatır.', 'Çıkık için bu güçlü duvarın aşılması gerekir.', 'Bu yüzden kalça çıkığı çoğunlukla büyük yüksek enerjili travmadan olur.'], kendin: 'Kalça eklemini stabil tutan iki ana etken nedir?', kendinCevap: 'Derin acetabulum ve kapsül (bağlar yardımcıdır).' } },

    { bolum: 'bolum-8', ad: 'Columna vertebralis (omurga)',
      cekirdek: [
        { b: 'Tipik omur', m: 'Gövde yükü taşır; arka kemer ile foramen vertebrale birlikte omurilik kanalını oluşturur.' },
        { b: 'Bölgeler', m: 'Boyun (C1–C7), göğüs (T1–T12), bel (L1–L5), sacrum (5 kaynaşık omur), coccyx.' },
        { b: 'Eğrilikler ve diskler', m: 'Boyun ve bel lordoz, göğüs ve sacrum kifozdur. Diskler omurlar arasında yastıktır.' }
      ],
      turet: { baslik: 'Bölgelerin farklı şekilde olmasını çıkar', adimlar: ['Bel bölgesi en çok yük taşır: gövdeler büyüktür.', 'Boyun en çok hareket eder: gövdeler küçük, foramen transversarium vardır.', 'Göğüs bölgesi kaburgalarla eklem yapar: gövde ve kaburga yüzleri bulunur.', 'Sonuç: şekil, bölgenin işine göre değişir.'], kendin: 'Foramen transversarium hangi bölgede bulunur?', kendinCevap: 'Boyun omurlarında (ve yalnız orada); bel omurlarında yoktur.' } },

    { bolum: 'bolum-9', ad: 'Pelvis ve karın duvarı',
      cekirdek: [
        { b: 'Pelvis bir halkadır', m: 'Sacrum ve iki os coxae; yükü omurgadan bacaklara iletir.' },
        { b: 'Linea terminalis', m: 'Pelvis major (üst, geniş) ile pelvis minor (alt, dar) arasını ayırır.' },
        { b: 'Karın duvarı kemiksizdir', m: 'Kas katmanlarından oluşur; canalis inguinalis erkekte testisin geçtiği eğik tünelidir.' }
      ],
      turet: { baslik: 'Kadın pelvisi neden geniş çıkar', adimlar: ['Pelvis, doğum kanalı görevi görür.', 'Kadında giriş (apertura pelvis superior) daha geniş ve yuvarlak olmalıdır.', 'Arcus pubis kadında daha geniştir.', 'Bu fark doğum çapına göre seçilmiştir.'], kendin: 'Facies auricularis hangi kemikte bulunur?', kendinCevap: 'Os ilium ve sacrum: sakroiliak eklemi oluşturur.' } },

    { bolum: 'bolum-10', ad: 'Thorax ve solunum',
      cekirdek: [
        { b: 'Göğüs kafesi', m: '12 çift kosta, sternum ve 12 torasik omur. Kalp ve akciğerleri korur.' },
        { b: 'Solunum: hacim ve basınç', m: 'Diyafram ve interkostal kaslar göğüs hacmini büyütür; basınç düşer, hava girer.' },
        { b: 'İki kapı', m: 'Apertura thoracis superior (üst) ve inferior (alt); diyafram alt kapıyı kapatır.' }
      ],
      turet: { baslik: 'Nefes almanın mekaniğini çıkar', adimlar: ['Diyafram kasılır ve aşağı iner.', 'Kaburgalar yukarı ve dışarı kalkar; göğüs hacmi büyür.', 'Akciğer genişler; içerideki basınç düşer.', 'Dış basınç yüksek olduğu için hava içeri girer.'], kendin: 'Diyafram kasılınca göğüs hacmi artar mı?', kendinCevap: 'Evet: diyafram aşağı iner, hacim büyür, basınç düşer, hava girer.' } },

    { bolum: 'bolum-12', ad: 'Dolaşım I: kalp',
      cekirdek: [
        { b: 'İki devre, dört odacık', m: 'Akciğer devresi (sağ kalp → akciğer → sol atrium) ve vücut devresi (sol kalp → vücut → sağ atrium).' },
        { b: 'Kapaklar tek yönlü akış sağlar', m: 'Trikuspit ve pulmonal (sağ), mitral ve aort (sol).' },
        { b: 'İleti sistemi', m: 'SA düğüm → AV düğüm → His demeti → Purkinje lifleri. Atımı SA düğüm başlatır.' }
      ],
      turet: { baslik: 'Kanın yolunu çekirdekten çıkar', adimlar: ['Vücuttan kirli kan vena cava ile sağ atriuma gelir.', 'Trikuspitten sağ ventriküle geçer; pulmonal kapaktan akciğere gider.', 'Oksijenlenip pulmonal venlerle sol atriuma döner.', 'Mitralden sol ventriküle, aort kapaktan vücuda çıkar.'], kendin: 'Atrium dextrum’a açılmayan yapı hangisidir: V. cava superior, V. cava inferior, sinus coronarius, V. pulmonalis?', kendinCevap: 'V. pulmonalis: pulmonal venler sol atriuma açılır.' } },

    { bolum: 'bolum-13', ad: 'Dolaşım II: damarlar ve lenf',
      cekirdek: [
        { b: 'Üç damar tipi', m: 'Arter (kalpten uzaklaşır), ven (kalbe döner), kapiller (değiş tokuş). Duvarlar üç katmanlıdır.' },
        { b: 'Aorta ve dalları', m: 'Vücudun ana arteridir; göğüs ve karın kısmı ile dallarına ayrılır.' },
        { b: 'Lenf dokudan artık sıvıyı alır', m: 'Kapillerden sızan sıvı proteinleriyle birlikte lenf damarlarıyla geri döner.' }
      ],
      turet: { baslik: 'Sıvının neden geri döndüğünü çıkar', adimlar: ['Kapiller arter ucunda basınçla sıvıyı dışarı iter.', 'Proteinler sıvıyı geri çeken bir basınç yaratır (ozmotik).', 'Venöz uçta basınç düştüğünde sıvı geri döner.', 'Geri dönemeyen küçük kısım lenfle taşınır.'], kendin: 'Oksijenli kan hangi damarlarda taşınır?', kendinCevap: 'Arterlerde (istisna: pulmonal ven, akciğerden oksijenli kan taşır).' } },

    { bolum: 'bolum-14', ad: 'Solunum sistemi',
      cekirdek: [
        { b: 'İletici yol ve solunum bölümü', m: 'Burun, yutak, gırtlak, trakea, bronşlar iletir; alveoller gaz değişimi yapar.' },
        { b: 'Gırtlak', m: 'Kıkırdaklardan oluşur; ses telleri ses üretir ve yutkunmada sfinkter görevi görür.' },
        { b: 'Difüzyon yüzeyi', m: 'Alveol duvarı çok ince ve kapillerle çevrilidir; yüzey çok geniştir.' }
      ],
      turet: { baslik: 'Akciğer neden çok sayıda alveolden oluşur', adimlar: ['Gaz değişimi yüzeye orantılıdır.', 'Tek büyük bir keseyle yüzey çok küçük kalır.', 'Çok sayıda küçük alveol yüzeyi çok büyütür.', 'Duvar ince olduğu için difüzyon çok hızlı olur.'], kendin: 'Alveol duvarı neden ince olmalıdır?', kendinCevap: 'Oksijen ve karbondioksit kısa mesafede difüzyonla geçsin diye.' } },

    { bolum: 'bolum-15', ad: 'Sindirim sistemi',
      cekirdek: [
        { b: 'Sindirim tüpü', m: 'Ağız, yutak, özofagus, mide, ince bağırsak, kalın bağırsak, rektum.' },
        { b: 'Mekanik ve kimyasal sindirim', m: 'Dişler ve mide kas hareketleriyle parçalar; enzimler ve asitle kimyasal sindirim yapılır.' },
        { b: 'Emilim ince bağırsakta', m: 'Duodenum, jejunum, ileum. Villus ve mikrovilluslar emilim yüzeyini büyütür.' }
      ],
      turet: { baslik: 'İnce bağırsağın neden uzun olduğunu çıkar', adimlar: ['Emilim yüzeyle orantılıdır.', 'Yüzeyi büyütmenin yolu kıvrımlar, villuslar ve mikrovilluslardır.', 'Bu kıvrımlar uzunluk ve yüzey kazandırır.', 'Sonuç: kısa bir tüp yerine uzun bir tüp emilim yapar.'], kendin: 'Duodenumda mideden gelen asidi nötrleyen madde nedir ve kaynağı neresidir?', kendinCevap: 'Bikarbonat; pankreas ve safra salgısından gelir.' } },

    { bolum: 'bolum-16', ad: 'Ürogenital sistem',
      cekirdek: [
        { b: 'Nefron süzgeci', m: 'Böbreğin işlevsel birimi. Önce süzer, sonra gerekli maddeleri geri emer, kalanı idrar olur.' },
        { b: 'İdrar yolu', m: 'Üreter, mesane, üretra. Mesane depodur.' },
        { b: 'Erkek ve kadın organları', m: 'Gonad (testis/ovaryum), kanallar ve bezler. Yapılar farklı, plan benzer.' }
      ],
      turet: { baslik: 'İdrarın bileşimini nefrondan çıkar', adimlar: ['Glomerüldeki süzgeçte su ve küçük moleküller süzülür.', 'Proksimal tübülde glikoz, su ve tuz geri emilir.', 'Henle kıvrımı ve distal tübül suyu ve tuzu ayarlar.', 'Kalan sıvı idrardır; kullanılmayan madde ile fazla su atılır.'], kendin: 'Nefronun en çok geri emilim yaptığı kısım hangisidir?', kendinCevap: 'Proksimal tübül.' } },

    { bolum: 'bolum-17', ad: 'Endokrin sistem ve duyu organları',
      cekirdek: [
        { b: 'Hormon kan yoluyla taşınır', m: 'Hipotalamus-hipofiz ekseni, tiroid, adrenal, pankreas, gonadlar.' },
        { b: 'Negatif geri bildirim', m: 'Hedef hormonu yükselince üst düzey salgıyı azaltır. Denge bu şekilde sağlanır.' },
        { b: 'Duyu organları çevirmendir', m: 'Dış uyaranı sinir sinyaline çevirir: reseptör, iletim, beyin.' }
      ],
      turet: { baslik: 'Tiroid hormonunun geri bildirimini çıkar', adimlar: ['Hipotalamus TRH salgılar.', 'Hipofiz TSH salgılar.', 'Tiroid T3 ve T4 üretir.', 'T3 ve T4 artınca hipofiz ve hipotalamusu baskılar: TSH azalır.'], kendin: 'T3 ve T4 artınca TSH ne olur?', kendinCevap: 'Azalır (negatif geri bildirim).' } },

    { bolum: 'bolum-18', ad: 'Sinir sistemi',
      cekirdek: [
        { b: 'Nöron ve miyelin', m: 'Nöron sinyali iletir; miyelin kılıf sinyali hızlandırır. Glia destek hücreleridir.' },
        { b: 'MSS ve PSS', m: 'Merkezi sinir sistemi: beyin ve omurilik. Periferik: kranial ve spinal sinirler.' },
        { b: 'Gri ve beyaz madde', m: 'Gri madde hücre gövdeleri (sinaps), beyaz madde miyelinli liflerdir.' }
      ],
      turet: { baslik: 'Refleks yayının neden beyne uğramadığını çıkar', adimlar: ['Reseptör uyarılır ve duyu nöronu sinyali omuriliğe taşır.', 'Omurilikte sinaps, motor nörona doğrudan bağlanır.', 'Motor nöron kas ya da bezi uyarır.', 'Beyne bilgi gider ama karar beklenmez: refleks hızlıdır.'], kendin: 'Bir refleks yayında beyne gitmek zorunlu mudur?', kendinCevap: 'Hayır: omurilikteki sinaps yeterlidir; beyin sonradan bilgilenir.' } },

    { bolum: 'bolum-19', ad: 'Sentez: anatomiyi birleştiren iplikler',
      cekirdek: [
        { b: 'Eklem: hareket ile sağlamlık', m: 'Çok hareketli eklem sığ yuva ve gevşek kapsül ister, bu da çıkığa yol açar. Sağlamlık derin yuva ve güçlü bağ ister.' },
        { b: 'Sinir kemiğe yaslanır', m: 'Sinir nerede kemiğe ya da sert yapıya değiyorsa oradan yaralanır.' },
        { b: 'Tek uçtan kan gelen kemik', m: 'Kemiğin büyük kısmı kıkırdakla kaplıysa, tek bir damar ucu kırıkla kesilince parça kansız kalır (avasküler nekroz).' }
      ],
      turet: { baslik: 'Kırıktan sinir hasarını çıkar', adimlar: ['Humerus cisim kırığı: n. radialis, spiral oluk boyunca gider; orada ezilir.', 'Collum chirurgicum kırığı: n. axillaris, kırık hattına yakındır.', 'Epicondylus medialis kırığı: n. ulnaris, sulcus ulnaris içindedir.', 'Kırık yerini bulduğunda hasarlanan siniri de söylersin.'], kendin: 'Collum chirurgicum humeri kırığında hangi sinir risk altındadır?', kendinCevap: 'N. axillaris.' } }
  ];

  window.KursIcerik['tip-tarihi'] = [
    { bolum: 'bolum-1', ad: 'Tıp tarihine giriş ve antik medeniyetler',
      cekirdek: [
        { b: 'Tıbbın hedefi', m: 'Acıyı azaltmak ve insanı daha iyi hale getirmek. Tıp hem bilim hem sanattır.' },
        { b: 'Bilim paradigma ile ilerler (Kuhn)', m: 'Paradigma, normal bilim, birikmiş anomaliler, kriz, devrim, yeni paradigma.' },
        { b: 'Tarih öncesi bir kanıt yorumudur', m: 'Yazılı kayıt yoksa bilgi kalıntılardan çıkarılır (ör. trepanasyon).' }
      ],
      turet: { baslik: 'Hümoral patolojiden hücresel patolojiye geçişi çıkar', adimlar: ['Dört hılt (kan, balgam, sarı safra, kara safra) hastalığı açıklar.', 'Morgagni organ düzeyinde hastalık aramaya başlar.', 'Bichat dokuları, Virchow hücreyi hastalığın birimi yapar.', 'Her yeni gözlem eskiyi zorlayınca paradigma değişir.'], kendin: 'Hümoral patolojinin yerini hangi yaklaşım aldı?', kendinCevap: 'Hücresel patoloji (Virchow).' } },

    { bolum: 'bolum-2', ad: 'Klasik dönem İslam ve Türk tıbbı',
      cekirdek: [
        { b: 'Sentez', m: 'İslam tıbbı Yunan mirasını (Hipokrat, Galen) ve deneyimi birleştirdi.' },
        { b: 'Kuramsal temel', m: 'Rükün (dört unsur), mizaç, hılt ve kuva. Hastalık denge bozukluğudur.' },
        { b: 'Kurumlar', m: 'Bimaristan (hastane ve tıp okulu). Anadolu’da Türkçe tıp metinleri yazıldı (Tuhfe-i Mübârizî).' }
      ],
      turet: { baslik: 'Tedavinin neden dengeyi geri getirmek olduğunu çıkar', adimlar: ['Sağlık, hılt ve mizacın dengesidir.', 'Hastalık, dengenin bozulmasıdır: bir hılt fazlaysa.', 'Tedavi fazlalığı azaltmak ya da eksiği tamamlamaktır.', 'Mizaca göre diyet ve kan alma seçilir.'], kendin: 'Kanı fazla bir hastada hangi tedavi denge için seçilir?', kendinCevap: 'Kan alma (fleobotomi): fazla hıltı azaltmak için.' } },

    { bolum: 'bolum-3', ad: 'Ortaçağ Batı, Rönesans ve Aydınlanma tıbbı',
      cekirdek: [
        { b: 'Ortaçağ', m: 'Kilise ve dogma etkili; Kara Ölüm (1348–51) tıbbı sorgulatır.' },
        { b: 'Rönesans', m: 'Antik metinlere dönüş, anatomi çalışmaları; matbaa bilgiyi yaygınlaştırdı.' },
        { b: '17.–18. yüzyıl', m: 'Ölçme, deney, mikroskop; Aydınlanma’da akıl ve deneyim öne çıktı.' }
      ],
      turet: { baslik: 'Anatomide yöntem değişimini çıkar', adimlar: ['Galen’in anatomisi hayvan gözlemine dayanıyordu ve dogma haline gelmişti.', 'Vesalius bedeni bizzat keserek ve çizerek gözlemledi.', 'Gözlem, eski metinle çelişince metin düzeltildi.', 'Sonuç: gözlem ve kanıt, otorite önüne geçti.'], kendin: 'Vesalius’u Galen’den ayıran temel fark nedir?', kendinCevap: 'Doğrudan gözlem ve kanıtın otoriteye üstün tutulması.' } },

    { bolum: 'bolum-4', ad: 'Modern tıbbın gelişimi (19.–20. yüzyıl)',
      cekirdek: [
        { b: 'Mikrobiyoloji', m: 'Bulaşıcı hastalıkların mikroplardan kaynaklandığı kabul edildi (Pasteur, Koch).' },
        { b: 'Anestezi, antisepsi, asepsi', m: 'Ağrıyı kesmek, mikropları öldürmek (antisepsi) ve bulaştırmamak (asepsi).' },
        { b: '20. yüzyıl', m: 'Psikiyatri (Kraepelin, Freud), ilaç ve aşı çalışmaları, tanı teknikleri.' }
      ],
      turet: { baslik: 'Cerrahi ölümlerinin azalışını çıkar', adimlar: ['Cerrahi ölümlerinin büyük kısmı enfeksiyondandı.', 'Antisepsi ile cerrahi aletler ve yara kimyasallarla temizlenir.', 'Asepsi ile en başta bulaştırma önlenir.', 'Sonuç: enfeksiyon oranı düşer, cerrahi güvenli hale gelir.'], kendin: 'Antisepsi ile asepsi arasındaki fark nedir?', kendinCevap: 'Antisepsi mikropları öldürmeye çalışır; asepsi mikropları en baştan bulaştırmamayı hedefler.' } },

    { bolum: 'bolum-5', ad: 'Türk tıbbının modernleşmesi',
      cekirdek: [
        { b: 'Batıya yöneliş', m: '18.–19. yüzyılda askeri ve tıbbi okullar kuruldu; Batı’dan hekim ve kitap getirildi.' },
        { b: '1933 üniversite reformu', m: 'Darülfünun, İstanbul Üniversitesi’ne dönüştü; tıp eğitimi kurumsallaştı.' },
        { b: 'Erken Cumhuriyet: koruyucu sağlık', m: 'Yüksek bebek ve anne ölümü, bulaşıcı hastalıklar; sağlık hizmetleri koruyucu ve yaygın hale getirildi.' }
      ],
      turet: { baslik: 'Koruyucu sağlığın neden öne alındığını çıkar', adimlar: ['Başlangıçta yüksek bebek ve anne ölümü vardı.', 'Bulaşıcı hastalıklar kitlesel ölüme yol açıyordu.', 'Tedaviden önce bulaşmanın önlenmesi daha az kaynakla daha çok kişiyi korur.', 'Sonuç: koruyucu hizmetler ve yaygın sağlık hizmeti önceliklendi.'], kendin: 'Erken Cumhuriyet’in koruyucu sağlığa öncelik vermesinin ana nedeni nedir?', kendinCevap: 'Yüksek bebek ve anne ölümü ile bulaşıcı hastalıklar; az kaynakla çok kişiyi korumak.' } }
  ];
})();
