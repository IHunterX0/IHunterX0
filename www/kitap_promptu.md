Sen bir tıp öğrencisi için "1001 Çalışma Kitabı" yazıyorsun. Ekte bu dersin ders notları/slaytları, (varsa) ders kitabı ve çıkmış sınav soruları var. Aşağıdaki kurallara harfiyen uy ve sonunda TEK bir JSON dosyası ver (biçim en altta). Bu dosya "1001 Çalışma Kitapları" uygulamasına "Kitap ekle" ile hiçbir tahmin yapılmadan yüklenecek.

# 1. Kaynak ve dürüstlük kuralları
- Bilgiyi YALNIZ verilen kaynaklardan al. Kaynakta olmayan bir şey eklemen gerekirse onu ayrı bir "genel" kutusuna koy ve "Genel bilgi (kaynakta yok)" diye etiketle. Kaynakta olmayanı kaynaktan gelmiş gibi yazma.
- Slayt ile ders kitabı çelişirse ikisini de yaz ve "Sınavda slayttaki değeri kullan" de.
- Sayısal değerleri ve formülleri kontrol et. Cevap anahtarında hata görürsen düzeltme, ikisini birden göster ("anahtar X diyor, doğrusu Y çünkü …").
- Çıkmış sorunun cevabı kaynakta yoksa cevap uydurma: "Cevap anahtarı yok" yaz.
- Kapsam: yalnız bu kurulun/sınavın konuları.

# 2. Bölüm yapısı (her konu için)
Her bölüm bir problemle başlar ve şu sırayla ilerler:
1. **Problem**: Bu yapı/kavram hangi sorunu çözmek için var?
2. **Çözüm**: Kavramın kendisi, tanımlar, yapı.
3. **Neden böyle? (ontolojik neden)**: Bu şey neden var ve neden tam olarak bu şekilde? Olmasaydı ne olurdu, başka bir biçim neden işe yaramazdı? Gerekirse en temel düzeye in (atom, mantık, fizik). Evrim yalnız uygun düştüğü yerde verilebilecek cevaplardan biridir, çerçevenin kendisi değildir.
4. **Örnek** ve gerekiyorsa **🧮 Gel çözelim**: her adımı gösterilmiş çözüm. Formülleri nereden geldiğini adım adım türeterek ver.
5. **Klinik**: hastalık, muayene bulgusu, yaralanma, ilaç bağlantısı.
6. **Korelasyon**: başka bölümlerle bağlantı ("(Bölüm 3.2)" biçiminde atıf yaz; uygulama bunu linke çevirir).
7. **🎯 Hoca vurgusu**: sınav odaklı kısa özet. Bölüm başına en çok 5–13 tane; fazlası kalabalık yapar.
8. **Kendini test et**: bölüm sonunda 8–15 soru. Şıklıysa her sorunun altında "Cevap: X — çünkü …" ver.

Kullanılacak kutu türleri (`callout.tur`):
- `neden`: 🧭 Neden böyle?
- `koken`: 🔤 Kelime kökeni (Latince/Yunanca kök, kelime anlamı, Türkçe–İngilizce karşılık)
- `hikaye`: 🔬 Keşif hikâyesi (kim, hangi soruyu sordu, nasıl buldu, `**Bugün:**` ne işe yarıyor)
- `klinik`: 🩺 Ne olursa ne olur
- `siklik`: 📊 Nerede ne sık
- `tuzak`: ⚠️ Sınav tuzağı (çeldiriciler, karıştırılanlar)
- `hoca`: 🎯 Hoca vurgusu
- `cozelim`: 🧮 Gel çözelim
- `formul`: formül kartı
- `soru`: 📝 Çıkmış soru kutusu
- `genel`: kaynakta olmayan genel bilgi

Dil Türkçe olmalı. Terimlerin ilk geçtiği yerde Latince/İngilizce karşılığını parantezde ver. Paragraflar kısa olsun; ezber yerine mantık kurdur.

# 3. Çıkmış sorular
- Her çıkmış soruyu ilgili konunun hemen arkasına bir `soru` kutusu olarak koy.
- Aynı konudaki farklı yılların benzer sorularını tek bir **soru ailesinde** birleştir: varyantlar + ortak cevap bölümü.
- `onem.yildiz` = sorunun kaç farklı sınavda çıktığı (★N). `onem.ates` = sık çıkan konu (🔥).
- Her varyantın doğru şıkkını `cevap` alanına harf olarak yaz. Cevap anahtarı yoksa `cevap: null` bırak ve `cevapHtml` alanına "Cevap anahtarı yok" yaz.
- `cevapHtml` alanında doğru cevabın neden doğru olduğunu ve her yanlış şıkkın neden yanlış olduğunu açıkla.
- Sona bir "Deneme Sınavı" bölümü (`ozel: "deneme"`) ve bir "Terim Sözlüğü" bölümü (`ozel: "sozluk"`; Türkçe–Latince–İngilizce + köken) ekle.

# 4. Çıktı biçimi (1001 Kitap Şeması, `sema: "1001-kitap/1"`)
Yalnız geçerli JSON ver. Kod bloğunun dışında açıklama yazma. Uzunsa bölüm bölüm ayrı mesajlarda devam et; birleştirilecek şekilde aynı `bolumler` dizisinin parçalarını ver.

```json
{
  "sema": "1001-kitap/1",
  "id": "histoloji",
  "baslik": "1001 Histoloji",
  "renk": "#c38bff",
  "bolumler": [
    { "id": "bolum-1", "no": "1", "baslik": "Bölüm 1 — Epitel Doku", "kisa": "Epitel Doku", "ozel": null,
      "altlar": [
        { "id": "bolum-1-1_1", "no": "1.1", "baslik": "1.1 Problem: Vücudun yüzeyini kim örtecek?",
          "bloklar": [
            { "t": "p", "html": "Metin; satır içi izinli etiketler: <strong>, <em>, <br>, <code>, <sub>, <sup>, <span class=\"kod\">" },
            { "t": "liste", "sirali": false, "ogeler": ["madde 1", "madde 2"] },
            { "t": "tablo", "bas": ["Sütun 1", "Sütun 2"], "satir": [["a", "b"]] },
            { "t": "callout", "tur": "neden", "etiket": "🧭 Neden böyle?", "bloklar": [ { "t": "p", "html": "…" } ] },
            { "t": "callout", "tur": "soru", "etiket": "📝 Çıkmış soru", "soru": "q-histoloji-1", "bloklar": [] },
            { "t": "figur", "figurler": ["f-1"], "tek": true },
            { "t": "acilir", "ozet": "Cevabı göster", "bloklar": [ { "t": "p", "html": "…" } ] }
          ] }
      ] }
  ],
  "figurler": [ { "id": "f-1", "src": "img/S01-s05.jpg", "alt": "…", "baslik": "S01-s05 · Epitel çeşitleri", "slayt": "S01-s05" } ],
  "sorular": [
    { "id": "q-histoloji-1", "bolum": "bolum-1", "alt": "bolum-1-1_1",
      "baslik": "📝 Çıkmış soru — Çok katlı yassı epitel nerede bulunur?", "konu": "Çok katlı yassı epitel",
      "onem": { "yildiz": 3, "ates": true },
      "varyantlar": [ { "no": "2024 Final 12", "govde": "Soru metni…", "siklar": [ { "h": "A", "m": "…" }, { "h": "B", "m": "…" } ], "cevap": "B" } ],
      "cevapHtml": "<p><strong>Cevap B.</strong> Çünkü … A yanlış çünkü …</p>" }
  ],
  "terimler": [ { "terim": "epitel", "basA": "Terim", "alanlar": { "Latince": "epithelium", "İngilizce": "epithelium", "Köken": "Yun. epi (üzerinde) + thele (meme ucu)", "Anlam": "yüzeyi örten doku" } } ]
}
```

Görseller: slayt görsellerini kullanacaksan `src` alanına ZIP içindeki göreli yolu yaz (`img/…`). Sonra JSON'u ve `img/` klasörünü birlikte ZIP'leyip uygulamaya yükle. Görsel yoksa `figurler` alanını boş bırak.

# 5. Bitirmeden önce kontrol et
- Her çıkmış soru bir kutuda mı, ★/🔥 doğru mu?
- Her bölümde "Neden böyle?" ve "Kendini test et" var mı?
- Kaynakta olmayan her bilgi `genel` kutusunda mı?
- JSON geçerli mi (tırnaklar, virgüller)?
