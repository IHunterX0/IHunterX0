# C.A.R.V.I.S. — Geliştirme defteri

Bu dosya, yeni bir oturumun (ya da bağlamı özetlenmiş bir Claude'un) işi kaldığı yerden sürdürebilmesi için yazıldı.
Uygulama: **1001 Çalışma Kitapları + C.A.R.V.I.S.**, paket `com.dogac.bin1`, kullanıcının Samsung tabletinde (SM-X820).
Tek kullanıcı. Kullanıcıyla Türkçe konuşulur.

## Kurallar (değişmez)
- **Anahtar/sır asla repoya girmez.** Push'tan önce tara: `gsk_`, `sk-or-v1-`, `github_pat_`+uzun dizi, `AQ.`+uzun dizi.
  Orijinal APK'daki Groq ve Gemini anahtarları `android/smali-yama/MainActivity$Kopru.smali` içinde `*_ANAHTARI_KALDIRILDI`
  ile değiştirilmiş halde durur; derlemede bu dosya **temel APK'dan gelen sürümün üstüne yeni metotlar eklenerek** kullanılır.
- Kullanıcıya özel anahtarlar yalnız cihazda (localStorage) ya da yalnız kullanıcıya gönderilen özel APK'da (`www/ozel*.js`, gitignore'da).
- Gerçek kişilerin (oyuncuların) klon sesleri kullanılmaz.
- Her sürümde `www/spotify.js` içindeki `var SURUM = '…-rNN'` bir artırılır; tanılama raporlarının ilk satırı bunu gösterir.

## Mimari
- **Web katmanı** `www/` (APK'da `assets/www`): `index.html` modülleri sırayla yükler. Önemliler:
  `claude_yerel.js` (yapay zekâ istemcisi: Gemini zinciri + Groq + **sağlayıcı zinciri** OpenRouter/GitHub Models/OmniRoute),
  `carvis.js` (sesli asistan, ⚙ ayarlar), `spotify.js` (müzik), `oneri.js` (öneri kutusu), `hud.js` / `holo-*.js` (holografik arayüz),
  `app*.js` (çalışma kitabı özellikleri).
- **Android** (WebView + JS köprüsü `window.AndroidKopru`): okunur kaynak `android/kaynak-okunur/`, yeni sınıflar `android/kaynak-yeni/`
  (`SpotifyYerel.java` medya oturumu + erişilebilirlikle liste çalma, `YerelHttp.java` Android'den ağ isteği), smali yamaları `android/smali-yama/`.

## APK derleme (scratchpad düzeni)
1. Temel APK: kullanıcının yüklediği orijinal `com.dogac.bin1-1.apk` (repo gizli olunca `derleme-temeli` branch'ine konacak).
2. `java -jar apktool.jar d -r temel.apk -o dec` (apktool 2.10.0).
3. `android/smali-yama/*.smali` → `dec/smali_classes3/com/dogac/bin1/` (Kopru dosyası için yukarıdaki kurala uy), `www/*` → `dec/assets/www/`.
4. Yeni Java sınıfı: `javac -cp android.jar` (platform-34) + saplama sınıflar → `d8 --min-api 26` → dex'i temel APK'ya `classes4.dex`
   olarak ekleyip `apktool d` ile smali'ye çevir → `smali_classes3`'e kopyala.
5. `apktool b dec -o imzasiz.apk` → `android/Imzala.java` (apksig) ile imzala → `ApkVerifier` ile doğrula.
6. **İmza anahtarı** (`carvis.p12` + şifre) kullanıcıda; repoda yok. Eski (orijinal) uygulama Android Debug anahtarıyla imzalı;
   kullanıcı bir kez sil-kur yaptı, artık bu anahtarla imzalı sürümler üstüne kurulur.

## Jarvis uygulama ikonları (r69)
- `holoikon.js` → `U.holoIkon(u, stil)`: vektör çizim (marka logosu değil, işlevi anlatan çizim: küre, ses dalgası, diyafram, balon,
  kıvılcım, klasör…) + dönen iki yay + çentikler + tarama + titreme. Paket/ad eşlemesi `PAKET`. Bilinmeyen uygulama: orijinal ikon
  hologram tonunda aynı çerçevede. Stil: cizim (varsayılan) / hologram / orijinal. SVG özniteliğinde var() çalışmaz → style ile.
  Yapay zekâ resim modeli kullanılmadı: OpenRouter resim modelleri ücretli, tarz tutarsız.

## Uygulama çemberi + holografik pencereler (r68)
- `anaekran.js`: sağ altta amber nokta (.ae-nokta, sol alttaki menü noktasının eşi) → favori uygulamalar çemberde (`U.uygulamaHalkasi`);
  seçince ikon ışıyıp büyür, çember merkeze çöker, uygulama açılır. Raf kaldırıldı. Konumlar px (translate yüzdesi elemanın kendi boyutuna göre).
  Kategoriler: Tarayıcı / Sosyal ve mesaj / Ders ve yapay zekâ / Müzik ve medya / Araçlar / Diğer; varsayılan favoriler kullanıcının listesi.
- `holo3.js`: pencereler yatay ışık çizgisinden doğar (clip-path), parlar, titrer; sayfa geçişleri yumuşak holo; azaltılmış harekette kapalı.

## Carvis ana ekran / launcher (r66 TAM APK — yeni yama tabanı)
- Manifest: MainActivity'ye `MAIN + HOME + DEFAULT` intent-filter (metin hâli `android/manifest/AndroidManifest.metin.xml`).
  Üretim: `apktool d -s --no-assets <apk> -o tmpman` → metni düzenle → `apktool b tmpman` → çıkan ikili AndroidManifest.xml'i
  `dec/`e kopyala (public.xml sayesinde kaynak kimlikleri aynı kalır; doğrulandı).
- `kaynak-yeni/Uygulamalar.java` (+smali): liste (ad, paket, 72 px ikon), baslat, anaEkranAyari (ACTION_HOME_SETTINGS), anaEkranMi,
  yeniNiyet (onNewIntent'te HOME → JS carvisEv). Kopru: uygulamaListesi(Z), uygulamaBaslat, anaEkranAyari, anaEkranMi.
- `www/anaekran.js`: #uygulamalar ızgarası (uzun bas → favori), ana panoda UYGULAMALAR paneli, "Ana ekran yap".
- **Yama tabanı artık r66 commit'i** (`git log --grep "r66" -1`): `python3 araclar/yama_yap.py <r66-commit> rNN …`.

## Jane tuzakları, canlı mod, sağlık (r65)
- Jane sekmesinde "Beni kandırmaya çalış": yanlış sezgiyi hedefleyen 7 soru (Doğru/Yanlış + 5 şık), önbellek `janeTuzak2|…`.
- `canli.js`: Carvis balonu varsayılan "canlı şerit" (son 2 mesaj + giriş, yarı saydam, sürüklenebilir); ⤢ tam sohbet. Sayfa kullanılabilir kalır.
- `saglik.js`: su/vitamin/verim/uyku/kahve (Depo 'saglik'), #saglik sayfası + 7 günlük grafik, ana panoda SAĞLIK paneli,
  yerel komutlar Carvis.saatKomut'a eklendi (kota harcamaz), hatırlatmalar (su 90 dk, vitamin günde 1), Carvis aracı `saglik`.
- Menü noktası (.mn-nokta) sol alt köşede, ana sayfada da görünür.

## Zamanım yok v2 + okuma araç çubuğu (r64)
- `app10.js` zamanimYok: sekmeler Hızlı tekrar / İlk kez öğreniyorum / Patrick Jane / Hafıza sarayı. Hızlı tekrar ve İlk kez,
  bölümün HER alt başlığını ~7000 karakterlik partilerle sırayla üretir (`partiliOzet`, önbellek anahtarı `zy2|tur|kitap|bolum|j/n`),
  üstte başlık çipleri ve "n/n parça hazır". Jane: kart görünümü, bitince "Şimdi kendini sına" → ayırt testi.
  Carvis `zamanim_yok` aracı tüm parçalar bitene kadar bekler ve hepsini okur.
- `arac2.js`: .arac-cubugu ortada süzülen kapsül; seviye seçimi, A−/A+, Kutular, Okuma modu, Ara "⋯" paneline taşınır;
  aşağı kaydırınca gizlenir. Projektör modunda holo ✕ gizli (kenar sekmelerine yakın düşüp Carvis'i iptal ediyordu → "Durduruldu").

## Program (Pratik Pusulası), ikonlar, Hareket arşivi (r60)
- `www/pusula.js`: https://cerrahpasa-turkce-tip.vercel.app/data/{veri,liste}.json (CORS açık) → #pusula: gün şeridi, dersler,
  pratikler (öğrenci no → grup; liste.json'daki tuzlu SHA-256 özetle kesin oturumlar; numara yalnız cihazda), komite geri sayımı,
  ders başlığı → kitap bölümü eşleşmesi. Komite sınavları (programlar.TR.onemli, tur ara/final) Plan'a `kaynak:'pusula'` ile
  kendiliğinden aktarılır. Carvis aracı `ders_programi`. Önbellek Depo 'pusulaVeri' (6 saat).
- `www/ikon.js`: holografik çizgi ikon seti (`U.ikon`, `U.ikonYol`, `U.emojiIkon`); MutationObserver bilinen emojileri ikonla
  değiştirir, bilinmeyenleri tek renk hologram tonuna boyar. Reels `ikon` öğesi artık `ad` (ikon adı) alır; istem emoji yasaklar.
- Hareket (lab-hareket: kemik hareketi, kaslar, solunum) arşivde: menülerden ve Carvis araçlarından (hareket_yap, animasyon_oynat)
  çıkarıldı; kod duruyor (#lab-hareket).

## Ana sayfa kadranı, pomodoro, reels v5 (r59)
- `www/kadran.js`: ana sayfa yalnız Carvis panosu (kitap kartları/halkası, SES ASİSTANI paneli, sol üst nokta ve kaydırma gizli).
  Dürbünün dış çemberinde kasa kadranı: sola çevir/dokun → küçük çark (`U.kisaYolCarki`: kitaplar + reels, makale, kartlar, test, tahmin, plan),
  sağa çevir → büyük menü (`U.menuAc`). Dönüş SVG `transform` özniteliğiyle (CSS transform-box tarayıcıda yanlış merkez veriyordu).
- Çubuklu küre her yerde JarvisKure ile değiştirildi (holo.js projektörü, app16 sahneCiz → menü ve kitap halkası).
- Pomodoro (`app12.js`): 4 dk (okumada 8 dk) dokunuş yoksa "Burada mısın?" (45 sn geri sayım, Carvis sorar); cevap yoksa durur,
  yokken geçen süre sayaca geri eklenir ve günlük çalışma süresinden düşülür.
- Reels: TEK HİKÂYE kuralı (merkeziSoru), göremediğini göster → adım adım → grafikle kanıt → wiki kartı → "olmasaydı ne olurdu" →
  günlük hayat fun fact; kontrol turu bunları denetler. `wiki` öğesi: tr/en Vikipedi REST özeti, görsel yalnız Commons'tansa.
  Vücut v2: iskelet, kaslar, damar/sinir ağaçları, 37 yapı (animasyon.js `ORGAN`).

## Sınav türü, komite, kota (r58)
- Komite sınavları (`www/sinav.js`): Plan sayfasında tarih + tür; en yakın komite tüm derslerin sınav tarihi olur. `U.siradakiSinav()`.
- Vize/final: `U.sinavAyrimi` (bölüm başına kesin binom testi, genel vize payına göre) + `U.ayrimSinama(kitap, T)` (son 3 yılda ayrı veri
  vs birleşik veri isabeti). `U.cikmisTahminSirada` sıradaki sınavın türünü kullanır; o derste birleşik daha isabetliyse birleşik.
  2026-11 sınaması: hiçbir derste bölümler vize/final arasında anlamlı ayrışmıyor (p ≥ 0,05); ayrı veri biyokimya/biyofizik vizesinde
  biraz daha iyi, anatomide birleşik daha iyi — farklar küçük.
- Kota: Carvis her istekte yalnız konuyla ilgili araç gruplarını gönderir (`aracSec`), tur sınırı 3 (cihaz 2), geçmiş 4 mesaj;
  kısa sohbet hafif modelle. Reels yalnız bir sonrakini önden hazırlar. `ekrana_bak` aracı ekranda görüneni okur.
- Konuşma görünümü (`holo.js`): kart/detay yoksa küre sağ altta projektör üstünde (sayfa görünür ve dokunulabilir kalır).

## Yama sistemi (r57'den itibaren güncellemeler APK yerine .zip)
- Neden: tam APK 400 MiB gönderim sınırına dayandı; Piper vb. modeller eklenecek. Kullanıcı bir kez r57 tam APK'yı kurar; sonrası
  uygulama içinden **ARŞİV → 📦 Güncelleme** sayfasından `carvis-yama-*.zip` seçerek yüklenir (internetsiz).
- Android: `kaynak-yeni/Yama.java` (smali: `smali-yama/Yama*.smali`). Kancalar: `MainActivity$1.shouldInterceptRequest` başında
  `Yama.yanit(uri)` (filesDir/yama/www/… varsa onu verir), `MainActivity.onActivityResult` başında `Yama.sonuc(...)` (istek kodu 13),
  `Kopru.yamaSec/yamaDurum/yamaSifirla`. Yamalı `MainActivity.smali` de `smali-yama/`da (anahtar içermez).
- Zip biçimi: kökte `yama.json` (`{"uygulama":"carvis","ad","surum","taban","sil":[...],"wwwTemizle":false,"yenidenYukle":true}`) +
  `www/…`, `model/…`, `veri/…`. Yol denetimi (.., mutlak yol) var; önce `yama_gecici/`e açılır, sonra taşınır.
- Yeni tam APK kurulursa (`lastUpdateTime` değişir) eski www yaması silinir; `model/` ve `veri/` kalır. Java'dan model yolu: `Yama.modelDizini()`.
- Üretim: `python3 araclar/yama_yap.py <taban_commit> rNN cikti.zip [--ek model/piper=<klasör>]` — birikimli (tabandan bu yana tüm www
  değişiklikleri), sıra bağımsız. **r57 APK tabanı: bu bölümü ekleyen commit** (`git log --grep "Yama sistemi" -1`).
- Her yamada `www/spotify.js` SURUM yine artırılır (Güncelleme sayfası ve tanılama gösterir).

## Reels şema kütüphanesi (r54, internetsiz)
- `www/sema/` (yalnız APK'da, repoda değil; ~115 MB, 2155 figür): OpenStax *Anatomy & Physiology 2e* (öneki s, tümü), *Biology 2e* (b; kimya, hücre,
  metabolizma, genetik, sinir/endokrin/bağışıklık bölümleri), *Introductory Statistics 2e* (i; tümü), *College Physics 2e* (p; akışkanlar, ısı,
  dalga/işitme, elektrik, manyetizma, optik/görme, kuantum, nükleer tıp). Hepsi **CC BY-NC-SA 4.0** —
  kişisel/ticari olmayan kullanım, her görselde atıf). `sema/dizin.json`: dosya, başlık, açıklama, bölüm, boyut.
- Üretim: `git clone --depth 1 --filter=blob:none --sparse https://github.com/openstax/<repo>` → `git -C <repo> sparse-checkout set modules collections`
  → `python3 -I araclar/sema/sema_dizin.py <repo> <collection.xml> "<kitap etiketi>" ham.json "<bölüm;bölüm|hepsi>"`
  → `python3 -I araclar/sema/sema_indir.py ham.json <cikti> <repo> <önek>` (raw.githubusercontent'tan, 900 px JPEG q80; dizin.json'a ekler)
  → APK 400 MiB gönderim sınırı için 820 px / q72 yeniden sıkıştırılır (~93 MB).
  → `<cikti>/*` → `dec/assets/www/sema/`.
- JS: `U.semaBul(ara, kullanilan, ders)` (animasyon.js; ders → kitap önceliği) İngilizce terimle başlık/açıklama üzerinde puanlı arama; bulunamazsa Wikimedia Commons API (tablette; sunucu IP'si 429 alıyor).

## Reels senaryosu
- Üretim iki tur: taslak (kitap metni + derse özel rehber `U.Animasyon.dersRehberi`) → **kontrol turu** (`kontrolEt`, reels.js): editör kontrol
  listesiyle düzeltilmiş tam JSON; başarısız/bozuksa taslak kullanılır. Ardından `U.Animasyon.duzelt` (taşma, çakışma, görselsiz sahneye şema).
- Akış: konu reel'leri; her 4. sırada makale reel'i, her 7.'de (makale değilse) **keşif hikayesi** (`icerikKesif`, 5-8 sahne, arka `arsiv`). Jane yorumu videonun ~%35/%70'inde sabitlenmiş yorum balonu olarak belirir.
- Biyoistatistik: her reel'de `karar` (hangi test, neden) sahnesi zorunlu.
- Derse özel öğeler: `karar`, `dagilim` (yüzde sayısal integralle hesaplanır), `tablo`, `formul`, `molekul` (3Dmol + Molekül Lab kataloğu; sahne bitince WebGL bağlamı bırakılır).

## Carvis sesi — ZipVoice (r36, internetsiz)
- Motor: sherpa-onnx **v1.13.8 resmî AAR** (JitPack `com/github/k2-fsa/sherpa-onnx/sherpa-onnx/v1.13.8/sherpa-onnx-v1.13.8.aar`): `jni/arm64-v8a/*.so` + `classes.jar` içindeki Kotlin TTS sınıfları (d8 → smali). HF csukuangfj2 "1.13.8" paketi daha yeni bir derlemeydi, JNI alanları uymadı ve uygulamayı çökertti (r37–r39).
  JNI, Kotlin `Tts.kt` sınıflarını alan adıyla okur → `android/kaynak-yeni/sherpa-onnx/*.java` birebir karşılığı (alan adı/türü değişirse uygulama çöker).
- APK `assets/zv/`: `text_encoder_int8.onnx` + `tokens.txt` (HF `k2-fsa/ZipVoice/zipvoice_distill`), `vocos_24khz.onnx`
  (HF `wetdog/vocos-mel-24khz-onnx` + sherpa metadata: model_type=vocos, n_fft=1024, hop=256, win=1024, center=1, hann, reflect),
  `espeak-ng-data` (yalnız en_dict), `lexicon.txt` (boş olmasın diye "a a"), `ornek.wav`/`ornek.txt` (konuşan ses örneği).
- `fm_decoder_int8.onnx` (~125 MB) ilk kullanımda HF'ten indirilir (`CarvisZv.indir`).
- JS: `Zv` (carvis.js) Türkçe cevabı İngilizceye çevirip `K.zvKonus` ile konuşturur, altyazı Türkçe kalır; hata olursa Android TTS'e döner.
- **Konuşan ses örneği yalnız sesin sahibinin rızasıyla verilen ham kayıttan** seçilir (r37: kullanıcının kendi ham ses kaydından seçilen 8 sn; APK içinde, repoda değil). Seçim: iki kayıttaki tüm 6–12 sn cümle pencereleri ZipVoice ile denendi, eres2net+CAM++ konuşmacı benzerliğiyle puanlandı, son karar kullanıcının kulağı.

## Spotify — neden böyle (kullanıcı testleriyle öğrenildi)
- Geliştirici modu (2026): sahip Premium olmalı, User Management'a kullanıcı eklenmeli; `/me` artık `product` döndürmüyor;
  liste uç noktaları `/items`, `/me/playlists`.
- **Web API `PUT /me/player/play` bu cihazda çalmıyor**: istek kabul ediliyor (204) ama tablet oynatıcısını sıfırlıyor.
- Medya oturumundan `playFromSearch` Spotify oturumunu düşürüyor → kullanılmaz.
- **Çalışan yol:** karışım tek bir "Carvis · Şimdi" listesine yazılır → liste Spotify'da açılır → erişilebilirlik servisi
  **listenin en üstteki şarkı satırına** dokunur (Çal düğmesine değil; kullanıcının isteği) → Carvis'e dönülür.
- Oynat/duraklat/ileri/geri ve "şu an çalan" medya oturumundan (ağsız). Öneri motoru geri bildirimle öğrenir (atlama/👍👎).

## Yapay zekâ
- Sağlayıcı zinciri (OpenRouter ücretsiz modeller, GitHub Models) → Gemini → Groq. İstekler Android köprüsünden (`httpIstek`).
- Kullanıcı ücret ödemiyor; ücretli sağlayıcı önerilmez (Mistral/Cerebras kart istedi).

## Öneri kutusu ve otomatik döngü
- Öneri kutusu (`#oneriler`): öneri → AI değerlendirme → "✓ Onayla → Claude'a gönder" → GitHub işi `[Carvis] …`.
- Zamanlanmış görev "Carvis öneri kontrolü" (günde 3: 09:38, 14:38, 20:38 İstanbul) bu oturumu uyandırır; yalnız
  yazarı IHunterX0 olan açık `[Carvis]` işlerini uygular, yorum yazar, kapatır.

## Açık işler (öneri kutusunda da var)
- Animasyonlu ders anlatımı sekmesi (3B molekülde odaklanma + anlatım + soru; AI yalnız senaryo yazar).
- Yalnız kullanıcının sesiyle uyanma (Vosk konuşmacı modeli, ses tanıtma ekranı, sık kelimeler).
- Ses: izinli ses kütüphanesi ya da Piper + holografik efekt.

## r70–r76 (2026-11-03)
- r70: menü/çember/kadran ipucu yazıları kaldırıldı.
- r71–r74: sağ alttaki projektör hologramı gizlendi (ortadaki büyük küre kalır); Carvis yazı şeridi normalde gizli, altyazıya dokununca açılır; yan panel açıkken şerit ve altyazı panelin soluna ortalanır.
- r75: uygulama çemberi hızlandırıldı (tam ekran backdrop blur yok, arka sayfa ve JarvisKure'ler çember açıkken çizilmez, ikon animasyonları durağan, dönen halka ayrı GPU katmanında); ✕ kapat tuşu.
- r76: Zamanım yok iki aşamalı (Gemini + GPT kognitif stil raporlarına göre):
  - 1. aşama (hızlı tekrar, `zy3|` önbelleği): başlık başına Aktörler / Zincir / maddeler / **Kilit** (genel mantıktan tahmin edilemeyen istisna, düzenleme, yer, sıra) / **Ezber**; giriş, motivasyon, soru yok. Bitince "Okudum. Şimdi beni sars".
  - 2. aşama (`sarsma.js`, Patrick Jane sarsılma turu): 6 otomatik doldurma varsayımı; açık uçlu cevap + güven (eminim/sanırım/tahmin); yanlışta çöken varsayım + karşı örnek + ikinci hak, sonra çözüm; doğruysa stres testi takip sorusu. "Emin ama yanlış" → `janeOto` (1 gün sonra aynı kitabın turunda geri sorulur) + Eksikler. Her cevap `janeKalibrasyon`'a (tür × güven × sonuç).
- r77: Jane gerçek mentalist: soğuk okuma (önceki cevabın davranışından açılış cümlesi), davranış ölçümü (ilk tuşa süre, silme, güven değiştirme, süre aşımı → değerlendirme istemine), blöf (doğru cevaba %40 "Hayır" der; dayanır mısın / satar mısın → `blof:` kalibrasyonu), en az 2 "gizli yanlış önerme" sorusu, nabız gibi atan geri sayım (60/45 sn; cevap kesilmez). Eski "Beni kandırmaya çalış" testi ek olarak duruyor.
- r78 (tam APK): **Ekran gözü.** `android/kaynak-yeni/EkranGozu.java` (+ smali): CarvisErisim (erişilebilirlik) açıkken başka uygulamalarda TYPE_ACCESSIBILITY_OVERLAY Carvis noktası (sürüklenir, uzun bas → kapanır, Carvis öndeyken gizli). Dokununca erişilebilirlik ağacındaki yazılar + `takeScreenshot` (Android 11+, `erisim.xml`'e `canTakeScreenshot`) → Carvis öne gelir, `window.carvisEkran()` → `Carvis.ekranAnlat()` görüntüyle anlatır; `ekrana_bak` 3 dk boyunca dış ekranı da döndürür. Köprü: `ekranGozu(bool)`, `ekranGozuDurum()`, `ekranGozuSon()`. Ayar: Carvis ayarları → 👁 Ekran gözü. Yalnız dokunulduğunda okur.
- r79 (yama, taban r78 APK): yüzen pencerelerde (.hp) paragrafa dokununca SOR / 3B (AYIR gizli); paragraf araç çubuğu z-index 100000.
- r80 (yama, taban r78 APK): büyük menüde 6'dan çok alt seçenek (Arşiv) → halkanın ortasında iki sütunlu çekmece (üst üste binme/kesilme yok); menü açıkken tam ekran blur yok, arka sayfa ve küreler çizilmez. Akıllı pomodoro: akış koruma (süre bitince son 45 sn etkinsen "+10 dk?" en çok 2 kez), öğrenen süre (`pomodoro.uyum`: gün dilimine göre son 6 seans → ±5/10 dk, 15–60), yorgunluğa göre kısa mola (+1 dk/90 dk, en çok +5), gece geç + 4 saat üstü → günü kapatma önerisi. Ayar: "Akıllı".
- r81 (yama, taban r78 APK): **Kota:** bilgi sorularında `onAra()` kitapta_ara + kavram_getir'i yapay zekâdan önce cihazda çalıştırır, sonuç istem içine "ÖN ARAMA" olarak girer (araç döngüsü 2-3 istek → çoğu zaman 1); bağımsız bilgi soruları `cvc1|` anahtarıyla 14 gün hafızadan ("hafızadan (kota harcamadı)"). **Zekâ:** Jane'deki "emin ama yanlış" varsayımlar (`janeOto`) Carvis profiline "otomatik doldurma noktaları" olarak girer. **iPhone:** `uygulama_ac` iOS'ta uygulama bağlantılarıyla (youtube:// vb.), `#carvis` adresi Carvis'i açar (Siri/Kestirme). Yedeğe yeni belgeler eklendi (saglik, janeOto, janeKalibrasyon, reels, makale, pusula, dersProgram, anaEkran).
- r82 (yama, taban r78 APK): index.html'e viewport etiketi (iPhone Safari'de sayfa 980 px masaüstü genişliğinde çiziliyordu); telefonda okuma araç çubuğundaki ek düğmeler ⋯ menüsüne, tablolar kendi içinde kayar.
- r86 (yama, taban r78 APK): **Jane anlık sorular** (janeanlik.js): okuma sayfasında, sen etkinken 8–18 dk'da bir, ekranın ortasındaki paragraftan tek soru; günde en çok 8; Carvis konuşurken / pomodoro molasında / kutu açıkken çıkmaz; 60 sn'de kendiliğinden kapanır. Kapatma: localStorage jane_anlik=0.
