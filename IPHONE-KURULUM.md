# Carvis'i iPhone'a kurma

Carvis iPhone'da bir web uygulaması (PWA) olarak çalışır. Ana ekrandan açılır ve tam ekran olur, normal bir uygulama gibi görünür. Kitaplar, Jane, Zamanım yok, Reels, pomodoro, kartlar ve Carvis sohbeti çalışır.

Paket: `carvis-iphone.zip` (17 MB, 383 dosya). Reels'teki 2000+ kitap görseli bu ilk sürümde yok; Reels onların yerine Vikipedi görsellerini kullanır.

## 1. Yayınla (bir kere, ~10 dk, tabletten de olur)

1. **dash.cloudflare.com** adresinden ücretsiz bir hesap aç.
2. **Workers & Pages → Create → Pages → Upload assets** yolunu izle.
3. Proje adı ver. Tahmin edilmesi zor bir ad seç, örneğin `carvis-dgc-7k2`.
4. `carvis-iphone.zip` dosyasını yükle ve **Deploy**'a bas. Adresin `https://<proje-adı>.pages.dev` olur.
5. **Koruma (önerilir):** Proje → **Settings → General → Access policy → Enable** yolunu izle ve kendi e-postanı ekle. Böylece adresi yalnızca sen açabilirsin; giriş kodu e-postana gelir.
   - Cloudflare Zero Trust kurulumu senden ödeme bilgisi isterse ücretsiz planı seç.
   - Kart istemesini istemiyorsan bu adımı atlayabilirsin. O zaman güvenlik yalnızca proje adının gizli olmasına dayanır.

**Güncelleme:** Ben yeni bir `carvis-iphone.zip` gönderdiğimde aynı projede **Create deployment** ile yükle.

## 2. iPhone'a ekle

1. **Safari**'de adresini aç. Access açıksa e-postana gelen kodu gir.
2. **Paylaş → Ana Ekrana Ekle** yolunu izle. Simge adı "Carvis" olur.
3. Ana ekrandaki **Carvis** simgesinden aç. Artık tam ekran bir uygulama.

## 3. Tabletteki verilerini taşı

1. **Tablette** menüden **Arşiv → Notlarım** yolunu izle, en alttaki **Yedek** bölümünde **⇩ Yedeği indir**'e bas.
2. Dosyayı (`1001-yedek-….json`) iPhone'a gönder: kendine e-posta, WhatsApp ya da Drive.
3. **iPhone'da** önce dosyayı **Dosyalar**'a kaydet.
4. Carvis'te **Arşiv → Notlarım → Yedek → ⇧ Yedekten geri yükle** yolunu izle ve dosyayı seç.

Taşınanlar: ilerleme, notlar, vurgular, kartlar ve tekrar durumları, testler, eksikler, plan, pomodoro, Jane'in hafızası, sağlık kayıtları, Carvis profili ve sohbetler.

## 4. Yapay zekâ anahtarları

Carvis'in ayarlarındaki (⚙) **Yapay zekâ sağlayıcıları** bölümüne anahtarlarını gir. Tablettekiyle aynı anahtarları kullanabilirsin. Anahtarlar yalnızca iPhone'da durur. Birden fazla sağlayıcı ekle; biri dolunca Carvis sıradakine geçer:

- Gemini: aistudio.google.com → Get API key
- Groq: console.groq.com → API Keys
- OpenRouter: openrouter.ai → Keys (kart gerekmez)
- Cerebras: cloud.cerebras.ai
- Mistral: console.mistral.ai (ücretsiz "Experiment" planı)
- GitHub Models: GitHub hesabından token

Kota ipucu: Carvis tanım ve mekanizma sorularında artık kitapta önce kendisi arıyor ve aynı soruyu 14 gün hafızasından cevaplıyor. Hafızadan gelen cevaplarda "hafızadan (kota harcamadı)" yazar.

## 5. Android'deki özelliklerin iPhone karşılıkları

### "Hey Siri, Carvis" (uyandırma)

1. **Kestirmeler** uygulamasını aç, **+** ile yeni kestirme oluştur.
2. **URL'yi Aç** eylemini ekle. Adres: `https://<proje-adı>.pages.dev/index.html#carvis`
3. Kestirmenin adını **Carvis** yap.

"Hey Siri, Carvis" deyince Carvis sohbeti açık gelir. Mikrofona dokunup konuş; iOS, sesin bir dokunuşla başlamasını şart koşuyor.

### Ekran gözü (hangi uygulamada olursan ol, ekranı Carvis'e sor)

Yeni bir kestirme oluştur, adı **Carvis ekrana bak** olsun. Eylemler sırayla:

1. **Ekran Görüntüsü Al**
2. **Görüntüyü Yeniden Boyutlandır** → genişlik 1080
3. **Görüntüyü Dönüştür** → JPEG, kalite %70
4. **Base64 Kodla**
5. **Metin** eylemi. İçeriği aşağıdaki gibi; `[Base64]` yerine 4. adımın değişkenini koy:
   ```
   {"contents":[{"parts":[{"text":"Sen Carvis'sin, tıp öğrencisinin asistanı. Bu ekranda ne olduğunu 2-3 cümlede Türkçe söyle ve işime yarayacak bir şey ekle (soru ise cevabı, tıp konusuysa kısa doğru açıklama)."},{"inline_data":{"mime_type":"image/jpeg","data":"[Base64]"}}]}]}
   ```
6. **URL İçeriğini Al**
   - URL: `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=GEMINI_ANAHTARIN`
   - Yöntem: **POST**
   - Başlık: `Content-Type` = `application/json`
   - İstek Gövdesi: **Dosya** → 5. adımdaki Metin
7. **Sözlük Değerini Al** → `candidates`. Ardından **Listeden Öge Al** → İlk Öge.
8. **Sözlük Değerini Al** → `content`. Ardından **Sözlük Değerini Al** → `parts`. Ardından **Listeden Öge Al** → İlk Öge. Ardından **Sözlük Değerini Al** → `text`.
9. **Metni Seslendir** (dil: Türkçe), ardından **Sonucu Göster**.

Telefonun arkasına iki kez vurunca çalışması için: **Ayarlar → Erişilebilirlik → Dokunma → Arkaya Dokun → İki Kez Dokun → Carvis ekrana bak**. iPhone 15 Pro ve sonrasında Eylem Tuşu'na da atanabilir.

Bu kestirmede anahtarın yalnızca senin telefonunda durur. Kestirmeyi kimseyle paylaşma.

### Uygulama açma

Carvis'e "YouTube'u aç" dersen uygulamayı bağlantıyla açar (YouTube, Spotify, WhatsApp, Instagram, Chrome, Claude, Gmail, Telegram, Takvim, Haritalar…). İlk seferde iOS "açılsın mı?" diye sorabilir.

### iPhone'da olmayanlar

Ana ekran (launcher) olma, sürekli arka planda "Carvis" dinleme ve Spotify'ı doğrudan kontrol etme iOS'ta mümkün değil. Bunlar için yukarıdaki Siri ve kestirme yolları var.
