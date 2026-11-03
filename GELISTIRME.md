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
