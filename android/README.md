# Android tarafı

- `kaynak-okunur/`: APK'dan jadx ile çıkarılan Java kodu (okumak için; doğrudan derlenmez).
  `CarvisServis.java` yamalı sürümdür.
- `smali-yama/`: APK'ya uygulanan değişiklik (`CarvisServis.smali`, yeni `CarvisServis$Alici.smali`).
  - Rahatsız Etmeyin açıkken mikrofon tamamen kapanır, kapanınca geri açılır.
  - (Ekran kapalıyken de dinler; yalnız DND açıkken susar.)

## Yeniden derleme
    java -jar apktool.jar d -r orijinal.apk -o dec
    # smali-yama/ dosyalarını dec/smali_classes3/com/dogac/bin1/ içine, www/ dosyalarını dec/assets/www/ içine kopyala
    java -jar apktool.jar b dec -o imzasiz.apk
    javac -cp apksig.jar Imzala.java && java -cp apksig.jar:. Imzala carvis.p12 <şifre> imzasiz.apk carvis.apk

İmza anahtarı (`carvis.p12`) repoda **yok**; sonraki güncellemeler aynı anahtarla imzalanmalı.
