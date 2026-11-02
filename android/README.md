# Android tarafı

- `kaynak-okunur/`: APK'dan jadx ile çıkarılan Java kodu (okumak için; doğrudan derlenmez).
  `CarvisServis.java` yamalı sürümdür.
- `smali-yama/`: APK'ya uygulanan değişiklik (`CarvisServis.smali`, yeni `CarvisServis$Alici.smali`).
  - Rahatsız Etmeyin açıkken mikrofon tamamen kapanır, kapanınca geri açılır.
  - (Ekran kapalıyken de dinler; yalnız DND açıkken susar.)
- `MainActivity$1.smali`: Spotify giriş sayfaları (`*.spotify.com`, `open.spotify.com` hariç) WebView içinde açılır;
  böylece PKCE dönüşü uygulamanın kendi adresine gelir.

## Yeniden derleme
    java -jar apktool.jar d -r orijinal.apk -o dec
    # smali-yama/ dosyalarını dec/smali_classes3/com/dogac/bin1/ içine, www/ dosyalarını dec/assets/www/ içine kopyala
    java -jar apktool.jar b dec -o imzasiz.apk
    javac -cp apksig.jar Imzala.java && java -cp apksig.jar:. Imzala carvis.p12 <şifre> imzasiz.apk carvis.apk

İmza anahtarı (`carvis.p12`) repoda **yok**; sonraki güncellemeler aynı anahtarla imzalanmalı.

## Yerel Spotify kontrolü (Web API'siz)
- `kaynak-yeni/SpotifyYerel.java`: Spotify'ın Android medya oturumunu (MediaController) bildirim erişimiyle kullanır:
  aramayla/adresle çal, oynat/duraklat/sonraki/önceki, şu an çalan. Web API, Premium ve kota gerektirmez.
- Derleme: `javac -cp android.jar` (CarvisBildirim için boş bir taslak sınıfla) → `d8 --min-api 26` → apktool ile
  smali'ye çevrilip `smali_classes3/com/dogac/bin1/` içine konur.
- `MainActivity$Kopru.smali`: JS köprüsüne `spotifyCal`, `spotifyUri`, `spotifyKomut`, `spotifyDurum`, `spotifyYuklu`,
  `bildirimIzniAc` eklendi.
