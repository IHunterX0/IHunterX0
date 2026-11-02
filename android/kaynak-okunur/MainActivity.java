package com.dogac.bin1;

/* loaded from: /tmp/claude-0/-home-user-IHunterX0/90d85fb8-2a42-5d54-b9be-15454082c495/scratchpad/chk/classes3.dex */
public class MainActivity extends android.app.Activity {
    static final java.lang.String ADRES = "https://appassets.androidplatform.net/assets/www/index.html";
    static final int DOSYA_SEC = 12;
    static final int IZIN_MIKROFON = 11;
    static final java.lang.String VARSAYILAN_SES = "tr-tr-x-ama-local";
    static com.dogac.bin1.MainActivity ornek;
    static volatile boolean oturumAcik = false;
    android.webkit.ValueCallback<android.net.Uri[]> dosyaGeri;
    android.speech.SpeechRecognizer tanima;
    java.util.ArrayList<java.lang.String> terimListesi;
    android.speech.tts.TextToSpeech tts;
    android.webkit.WebView web;
    boolean ttsHazir = false;
    boolean onPlanda = false;
    boolean uyandirmaIstendi = false;
    java.lang.String dinlemeBaglami = "";

    @Override // android.app.Activity
    protected void onCreate(android.os.Bundle b) {
        super.onCreate(b);
        ornek = this;
        getWindow().addFlags(128);
        this.web = new android.webkit.WebView(this);
        setContentView(this.web);
        final androidx.webkit.WebViewAssetLoader yukleyici = new androidx.webkit.WebViewAssetLoader.Builder().addPathHandler("/assets/", new androidx.webkit.WebViewAssetLoader.AssetsPathHandler(this)).build();
        android.webkit.WebSettings s = this.web.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true);
        s.setDatabaseEnabled(true);
        s.setMediaPlaybackRequiresUserGesture(false);
        s.setAllowFileAccess(false);
        s.setTextZoom(100);
        s.setSupportMultipleWindows(false);
        this.web.setWebViewClient(new android.webkit.WebViewClient() { // from class: com.dogac.bin1.MainActivity.1
            @Override // android.webkit.WebViewClient
            public android.webkit.WebResourceResponse shouldInterceptRequest(android.webkit.WebView v, android.webkit.WebResourceRequest r) {
                android.webkit.WebResourceResponse c = yukleyici.shouldInterceptRequest(r.getUrl());
                if (c != null && r.getUrl().getPath() != null) {
                    java.lang.String p = r.getUrl().getPath();
                    if (p.endsWith(".js") || p.endsWith(".html") || p.endsWith(".json") || p.endsWith(".css")) {
                        c.setEncoding("utf-8");
                    }
                }
                return c;
            }

            @Override // android.webkit.WebViewClient
            public boolean shouldOverrideUrlLoading(android.webkit.WebView v, android.webkit.WebResourceRequest r) {
                android.net.Uri u = r.getUrl();
                java.lang.String host = u.getHost();
                if ("appassets.androidplatform.net".equals(host)) {
                    return false;
                }
                if (host != null && host.endsWith("spotify.com") && !"open.spotify.com".equals(host)) {
                    return false;
                }
                try {
                    com.dogac.bin1.MainActivity.this.startActivity(new android.content.Intent("android.intent.action.VIEW", u));
                    return true;
                } catch (java.lang.Exception e) {
                    return true;
                }
            }
        });
        this.web.setWebChromeClient(new android.webkit.WebChromeClient() { // from class: com.dogac.bin1.MainActivity.2
            @Override // android.webkit.WebChromeClient
            public boolean onShowFileChooser(android.webkit.WebView v, android.webkit.ValueCallback<android.net.Uri[]> geri, android.webkit.WebChromeClient.FileChooserParams p) {
                if (com.dogac.bin1.MainActivity.this.dosyaGeri != null) {
                    com.dogac.bin1.MainActivity.this.dosyaGeri.onReceiveValue(null);
                }
                com.dogac.bin1.MainActivity.this.dosyaGeri = geri;
                try {
                    com.dogac.bin1.MainActivity.this.startActivityForResult(p.createIntent(), com.dogac.bin1.MainActivity.DOSYA_SEC);
                    return true;
                } catch (java.lang.Exception e) {
                    com.dogac.bin1.MainActivity.this.dosyaGeri = null;
                    return false;
                }
            }
        });
        this.web.addJavascriptInterface(new com.dogac.bin1.MainActivity.Kopru(), "AndroidKopru");
        android.webkit.WebView webView = this.web;
        if (b != null) {
            webView.restoreState(b);
        } else {
            webView.loadUrl(ADRES);
        }
        this.tts = new android.speech.tts.TextToSpeech(this, new android.speech.tts.TextToSpeech.OnInitListener() { // from class: com.dogac.bin1.MainActivity$$ExternalSyntheticLambda1
            @Override // android.speech.tts.TextToSpeech.OnInitListener
            public final void onInit(int i) {
                com.dogac.bin1.MainActivity.this.lambda$onCreate$0(i);
            }
        });
        if (android.os.Build.VERSION.SDK_INT >= 33 && checkSelfPermission("android.permission.POST_NOTIFICATIONS") != 0) {
            requestPermissions(new java.lang.String[]{"android.permission.POST_NOTIFICATIONS"}, 10);
        }
        uyanIstegi(getIntent());
    }

    /* JADX INFO: Access modifiers changed from: private */
    public /* synthetic */ void lambda$onCreate$0(int st) {
        if (st == 0) {
            this.tts.setLanguage(new java.util.Locale("tr", "TR"));
            sesUygula();
            this.ttsHazir = true;
            this.tts.setOnUtteranceProgressListener(new android.speech.tts.UtteranceProgressListener() { // from class: com.dogac.bin1.MainActivity.3
                @Override // android.speech.tts.UtteranceProgressListener
                public void onStart(java.lang.String id) {
                }

                @Override // android.speech.tts.UtteranceProgressListener
                public void onRangeStart(java.lang.String id, int bas, int son, int kare) {
                    com.dogac.bin1.MainActivity.this.js("carvisYerel.kelime&&carvisYerel.kelime(" + bas + "," + son + ")");
                }

                @Override // android.speech.tts.UtteranceProgressListener
                public void onDone(java.lang.String id) {
                    bitti(id);
                }

                @Override // android.speech.tts.UtteranceProgressListener
                public void onError(java.lang.String id) {
                    bitti(id);
                }

                @Override // android.speech.tts.UtteranceProgressListener
                public void onStop(java.lang.String id, boolean kesildi) {
                    bitti(id);
                }

                void bitti(java.lang.String id) {
                    com.dogac.bin1.CarvisServis.konusmaBitti();
                    com.dogac.bin1.MainActivity.this.js("carvisYerel.konusmaBitti(" + com.dogac.bin1.MainActivity.jsStr(id) + ")");
                }
            });
        }
    }

    @Override // android.app.Activity
    protected void onNewIntent(android.content.Intent i) {
        super.onNewIntent(i);
        uyanIstegi(i);
    }

    void uyanIstegi(android.content.Intent i) {
        if (i == null) {
            return;
        }
        if (i.getBooleanExtra("uyan", false)) {
            this.web.postDelayed(new java.lang.Runnable() { // from class: com.dogac.bin1.MainActivity$$ExternalSyntheticLambda4
                @Override // java.lang.Runnable
                public final void run() {
                    com.dogac.bin1.MainActivity.this.lambda$uyanIstegi$1();
                }
            }, 1200L);
        }
        if (i.hasExtra("muzik")) {
            final java.lang.String q = i.getStringExtra("muzik");
            this.web.postDelayed(new java.lang.Runnable() { // from class: com.dogac.bin1.MainActivity$$ExternalSyntheticLambda5
                @Override // java.lang.Runnable
                public final void run() {
                    com.dogac.bin1.MainActivity.this.lambda$uyanIstegi$2(q);
                }
            }, 800L);
        }
        if (i.hasExtra("ses")) {
            getSharedPreferences("carvis", 0).edit().putString("ses", i.getStringExtra("ses")).putFloat("perde", i.getFloatExtra("perde", 0.85f)).apply();
            this.web.postDelayed(new java.lang.Runnable() { // from class: com.dogac.bin1.MainActivity$$ExternalSyntheticLambda6
                @Override // java.lang.Runnable
                public final void run() {
                    com.dogac.bin1.MainActivity.this.lambda$uyanIstegi$3();
                }
            }, 1500L);
        }
    }

    /* JADX INFO: Access modifiers changed from: private */
    public /* synthetic */ void lambda$uyanIstegi$1() {
        js("carvisYerel.uyan()");
    }

    /* JADX INFO: Access modifiers changed from: private */
    public /* synthetic */ void lambda$uyanIstegi$2(java.lang.String q) {
        android.util.Log.i("Carvis", "müzik testi: " + com.dogac.bin1.Cihaz.muzik(this, q, "spotify"));
    }

    /* JADX INFO: Access modifiers changed from: private */
    public /* synthetic */ void lambda$uyanIstegi$3() {
        if (this.tts == null) {
            return;
        }
        sesUygula();
        com.dogac.bin1.CarvisServis.konusmaBasladi();
        this.tts.speak("Merhaba efendim. Bugün biyokimya çalışmaya hazır mısınız?", 0, null, "deneme");
    }

    void sesUygula() {
        android.content.SharedPreferences sp = getSharedPreferences("carvis", 0);
        java.lang.String ad = sp.getString("ses", VARSAYILAN_SES);
        this.tts.setPitch(sp.getFloat("perde", 0.85f));
        try {
            java.lang.StringBuilder liste = new java.lang.StringBuilder();
            for (android.speech.tts.Voice v : this.tts.getVoices()) {
                if ("tr".equals(v.getLocale().getLanguage())) {
                    liste.append(v.getName()).append(v.isNetworkConnectionRequired() ? "(ağ) " : " ");
                    if (v.getName().equals(ad)) {
                        this.tts.setVoice(v);
                    }
                }
            }
            android.util.Log.i("Carvis", "sesler: " + ((java.lang.Object) liste) + "| secili: " + this.tts.getVoice().getName());
        } catch (java.lang.Exception e) {
            android.util.Log.e("Carvis", "ses", e);
        }
    }

    @Override // android.app.Activity
    protected void onResume() {
        super.onResume();
        this.onPlanda = true;
        this.web.onResume();
    }

    @Override // android.app.Activity
    protected void onPause() {
        super.onPause();
        this.onPlanda = false;
    }

    @Override // android.app.Activity
    protected void onSaveInstanceState(android.os.Bundle b) {
        super.onSaveInstanceState(b);
        this.web.saveState(b);
    }

    @Override // android.app.Activity
    public void onBackPressed() {
        if (this.web.canGoBack()) {
            this.web.goBack();
        } else {
            moveTaskToBack(true);
        }
    }

    @Override // android.app.Activity
    protected void onDestroy() {
        if (ornek == this) {
            ornek = null;
        }
        if (this.tts != null) {
            this.tts.shutdown();
        }
        if (this.tanima != null) {
            this.tanima.destroy();
        }
        this.web.destroy();
        super.onDestroy();
    }

    @Override // android.app.Activity
    protected void onActivityResult(int k, int sonuc, android.content.Intent veri) {
        if (k == DOSYA_SEC && this.dosyaGeri != null) {
            android.net.Uri[] l = null;
            if (sonuc == -1 && veri != null) {
                if (veri.getClipData() != null) {
                    int n = veri.getClipData().getItemCount();
                    l = new android.net.Uri[n];
                    for (int x = 0; x < n; x++) {
                        l[x] = veri.getClipData().getItemAt(x).getUri();
                    }
                } else if (veri.getData() != null) {
                    l = new android.net.Uri[]{veri.getData()};
                }
            }
            this.dosyaGeri.onReceiveValue(l);
            this.dosyaGeri = null;
        }
        super.onActivityResult(k, sonuc, veri);
    }

    @Override // android.app.Activity
    public void onRequestPermissionsResult(int k, java.lang.String[] izinler, int[] sonuclar) {
        if (k == IZIN_MIKROFON) {
            boolean z = false;
            if (sonuclar.length > 0 && sonuclar[0] == 0) {
                z = true;
            }
            boolean var = z;
            if (var) {
                if (this.uyandirmaIstendi) {
                    servisBaslat();
                    return;
                }
                return;
            }
            js("carvisYerel.dinlemeHata('izin_yok')");
        }
    }

    /* JADX INFO: Access modifiers changed from: private */
    public /* synthetic */ void lambda$js$4(java.lang.String kod) {
        if (this.web != null) {
            this.web.evaluateJavascript(kod, null);
        }
    }

    void js(final java.lang.String kod) {
        runOnUiThread(new java.lang.Runnable() { // from class: com.dogac.bin1.MainActivity$$ExternalSyntheticLambda7
            @Override // java.lang.Runnable
            public final void run() {
                com.dogac.bin1.MainActivity.this.lambda$js$4(kod);
            }
        });
    }

    static java.lang.String jsStr(java.lang.String s) {
        if (s == null) {
            return "null";
        }
        java.lang.StringBuilder b = new java.lang.StringBuilder("\"");
        for (char c : s.toCharArray()) {
            if (c == '\"' || c == '\\') {
                b.append('\\').append(c);
            } else if (c == '\n') {
                b.append("\\n");
            } else if (c < ' ' || c == 8232 || c == 8233) {
                b.append(java.lang.String.format("\\u%04x", java.lang.Integer.valueOf(c)));
            } else {
                b.append(c);
            }
        }
        return b.append('\"').toString();
    }

    boolean mikrofonVar() {
        return checkSelfPermission("android.permission.RECORD_AUDIO") == 0;
    }

    void servisBaslat() {
        android.content.Intent i = new android.content.Intent(this, (java.lang.Class<?>) com.dogac.bin1.CarvisServis.class);
        startForegroundService(i);
    }

    void uyandir() {
        boolean arkaPlan = getSharedPreferences("carvis", 0).getBoolean("arkaPlan", true);
        if (!this.onPlanda && !oturumAcik && !arkaPlan) {
            com.dogac.bin1.CarvisServis.ekranAcBildirimi(this);
        } else {
            js("carvisYerel.uyan(" + (this.onPlanda ? "false" : "true") + ")");
        }
    }

    void oneGetir() {
        if (this.onPlanda) {
            return;
        }
        try {
            startActivity(new android.content.Intent(this, (java.lang.Class<?>) com.dogac.bin1.MainActivity.class).addFlags(805437440));
        } catch (java.lang.Exception e) {
            com.dogac.bin1.CarvisServis.ekranAcBildirimi(this);
        }
    }

    void tekCumleDinle() {
        if (!mikrofonVar()) {
            requestPermissions(new java.lang.String[]{"android.permission.RECORD_AUDIO"}, IZIN_MIKROFON);
            return;
        }
        if (!android.speech.SpeechRecognizer.isRecognitionAvailable(this)) {
            js("carvisYerel.dinlemeHata('tanima_yok')");
            return;
        }
        com.dogac.bin1.CarvisServis.mikrofonuBirak();
        if (com.dogac.bin1.Cihaz.sttKullanilabilir()) {
            this.web.postDelayed(new java.lang.Runnable() { // from class: com.dogac.bin1.MainActivity$$ExternalSyntheticLambda2
                @Override // java.lang.Runnable
                public final void run() {
                    com.dogac.bin1.MainActivity.this.lambda$tekCumleDinle$5();
                }
            }, 300L);
            return;
        }
        if (this.tanima == null) {
            this.tanima = android.speech.SpeechRecognizer.createSpeechRecognizer(this);
        }
        this.tanima.setRecognitionListener(new android.speech.RecognitionListener() { // from class: com.dogac.bin1.MainActivity.5
            @Override // android.speech.RecognitionListener
            public void onReadyForSpeech(android.os.Bundle p) {
            }

            @Override // android.speech.RecognitionListener
            public void onBeginningOfSpeech() {
            }

            @Override // android.speech.RecognitionListener
            public void onRmsChanged(float r) {
            }

            @Override // android.speech.RecognitionListener
            public void onBufferReceived(byte[] b) {
            }

            @Override // android.speech.RecognitionListener
            public void onEndOfSpeech() {
            }

            @Override // android.speech.RecognitionListener
            public void onPartialResults(android.os.Bundle p) {
            }

            @Override // android.speech.RecognitionListener
            public void onEvent(int t, android.os.Bundle p) {
            }

            @Override // android.speech.RecognitionListener
            public void onError(int e) {
                com.dogac.bin1.CarvisServis.mikrofonuAl();
                android.util.Log.i("Carvis", "tanima hata: " + e);
                java.lang.String str = "no_match";
                if (e != 7) {
                    if (e == 6) {
                        str = "speech_timeout";
                    } else if (e != 5) {
                        str = e == 9 ? "izin_yok" : (e == 2 || e == 1) ? "ag" : "hata_" + e;
                    }
                }
                java.lang.String kod = str;
                com.dogac.bin1.MainActivity.this.js("carvisYerel.dinlemeHata(" + com.dogac.bin1.MainActivity.jsStr(kod) + ")");
            }

            @Override // android.speech.RecognitionListener
            public void onResults(android.os.Bundle r) {
                com.dogac.bin1.CarvisServis.mikrofonuAl();
                java.util.ArrayList<java.lang.String> l = r.getStringArrayList("results_recognition");
                android.util.Log.i("Carvis", "tanima: " + l);
                if (l != null && l.size() > 1) {
                    java.lang.StringBuilder a = new java.lang.StringBuilder("[");
                    for (int k = 1; k < l.size() && k < 5; k++) {
                        if (k > 1) {
                            a.append(',');
                        }
                        a.append(com.dogac.bin1.MainActivity.jsStr(l.get(k)));
                    }
                    com.dogac.bin1.MainActivity.this.js("carvisYerel.alternatifler(" + ((java.lang.Object) a.append(']')) + ")");
                }
                com.dogac.bin1.MainActivity.this.js("carvisYerel.duydu(" + com.dogac.bin1.MainActivity.jsStr((l == null || l.isEmpty()) ? "" : l.get(0)) + ")");
            }
        });
        final android.content.Intent i = new android.content.Intent("android.speech.action.RECOGNIZE_SPEECH");
        i.putExtra("android.speech.extra.LANGUAGE_MODEL", "free_form");
        i.putExtra("android.speech.extra.LANGUAGE", "tr-TR");
        i.putExtra("android.speech.extra.PREFER_OFFLINE", false);
        i.putExtra("android.speech.extras.SPEECH_INPUT_COMPLETE_SILENCE_LENGTH_MILLIS", 1500L);
        i.putExtra("android.speech.extra.MAX_RESULTS", 5);
        if (android.os.Build.VERSION.SDK_INT >= 33) {
            i.putStringArrayListExtra("android.speech.extra.BIASING_STRINGS", terimler());
        }
        new android.os.Handler(android.os.Looper.getMainLooper()).postDelayed(new java.lang.Runnable() { // from class: com.dogac.bin1.MainActivity$$ExternalSyntheticLambda3
            @Override // java.lang.Runnable
            public final void run() {
                com.dogac.bin1.MainActivity.this.lambda$tekCumleDinle$6(i);
            }
        }, 300L);
    }

    /* JADX INFO: Access modifiers changed from: private */
    public /* synthetic */ void lambda$tekCumleDinle$5() {
        com.dogac.bin1.Cihaz.geminiDinle(this.dinlemeBaglami, new com.dogac.bin1.Cihaz.Sonuc() { // from class: com.dogac.bin1.MainActivity.4
            @Override // com.dogac.bin1.Cihaz.Sonuc
            public void metin(java.lang.String t) {
                com.dogac.bin1.CarvisServis.mikrofonuAl();
                com.dogac.bin1.MainActivity.this.js("carvisYerel.duydu(" + com.dogac.bin1.MainActivity.jsStr(t) + ")");
            }

            @Override // com.dogac.bin1.Cihaz.Sonuc
            public void hata(java.lang.String kod) {
                com.dogac.bin1.CarvisServis.mikrofonuAl();
                com.dogac.bin1.MainActivity.this.js("carvisYerel.dinlemeHata(" + com.dogac.bin1.MainActivity.jsStr(kod) + ")");
            }
        });
    }

    /* JADX INFO: Access modifiers changed from: private */
    public /* synthetic */ void lambda$tekCumleDinle$6(android.content.Intent i) {
        this.tanima.startListening(i);
    }

    java.util.ArrayList<java.lang.String> terimler() {
        if (this.terimListesi != null) {
            return this.terimListesi;
        }
        this.terimListesi = new java.util.ArrayList<>();
        try {
            java.io.BufferedReader r = new java.io.BufferedReader(new java.io.InputStreamReader(getAssets().open("terimler.txt"), "UTF-8"));
            while (true) {
                try {
                    java.lang.String s = r.readLine();
                    if (s == null) {
                        break;
                    }
                    if (!s.trim().isEmpty()) {
                        this.terimListesi.add(s.trim());
                    }
                } finally {
                }
            }
            r.close();
        } catch (java.lang.Exception e) {
            android.util.Log.e("Carvis", "terimler", e);
        }
        return this.terimListesi;
    }

    java.lang.String indirilenlereKaydet(final java.lang.String ad, java.lang.String b64, java.lang.String tip) {
        try {
            byte[] veri = android.util.Base64.decode(b64, 0);
            if (android.os.Build.VERSION.SDK_INT >= 29) {
                android.content.ContentValues cv = new android.content.ContentValues();
                cv.put("_display_name", ad);
                cv.put("mime_type", tip);
                cv.put("relative_path", android.os.Environment.DIRECTORY_DOWNLOADS + "/1001");
                android.net.Uri u = getContentResolver().insert(android.provider.MediaStore.Downloads.EXTERNAL_CONTENT_URI, cv);
                java.io.OutputStream o = getContentResolver().openOutputStream(u);
                try {
                    o.write(veri);
                    if (o != null) {
                        o.close();
                    }
                } finally {
                }
            } else {
                java.io.File d = new java.io.File(getCacheDir(), "paylas");
                d.mkdirs();
                java.io.File f = new java.io.File(d, ad);
                java.io.FileOutputStream o2 = new java.io.FileOutputStream(f);
                try {
                    o2.write(veri);
                    o2.close();
                    android.net.Uri u2 = androidx.core.content.FileProvider.getUriForFile(this, "com.dogac.bin1.dosya", f);
                    android.content.Intent i = new android.content.Intent("android.intent.action.SEND").setType(tip).putExtra("android.intent.extra.STREAM", u2).addFlags(1);
                    startActivity(android.content.Intent.createChooser(i, ad));
                } finally {
                }
            }
            runOnUiThread(new java.lang.Runnable() { // from class: com.dogac.bin1.MainActivity$$ExternalSyntheticLambda0
                @Override // java.lang.Runnable
                public final void run() {
                    com.dogac.bin1.MainActivity.this.lambda$indirilenlereKaydet$7(ad);
                }
            });
            return "ok";
        } catch (java.lang.Exception e) {
            return java.lang.String.valueOf(e.getMessage());
        }
    }

    /* JADX INFO: Access modifiers changed from: private */
    public /* synthetic */ void lambda$indirilenlereKaydet$7(java.lang.String ad) {
        android.widget.Toast.makeText(this, "İndirilenler/1001 klasörüne kaydedildi: " + ad, 1).show();
    }

    class Kopru {
        @android.webkit.JavascriptInterface
        public void bildirimIzniAc() {
            com.dogac.bin1.SpotifyYerel.bildirimIzniAc(com.dogac.bin1.MainActivity.this);
        }

        @android.webkit.JavascriptInterface
        public java.lang.String spotifyCal(java.lang.String str) {
            return com.dogac.bin1.SpotifyYerel.cal(com.dogac.bin1.MainActivity.this, str);
        }

        @android.webkit.JavascriptInterface
        public java.lang.String spotifyDurum() {
            return com.dogac.bin1.SpotifyYerel.durum(com.dogac.bin1.MainActivity.this);
        }

        @android.webkit.JavascriptInterface
        public java.lang.String spotifyKomut(java.lang.String str) {
            return com.dogac.bin1.SpotifyYerel.komut(com.dogac.bin1.MainActivity.this, str);
        }

        @android.webkit.JavascriptInterface
        public java.lang.String spotifyUri(java.lang.String str) {
            return com.dogac.bin1.SpotifyYerel.uri(com.dogac.bin1.MainActivity.this, str);
        }

        @android.webkit.JavascriptInterface
        public boolean spotifyYuklu() {
            return com.dogac.bin1.SpotifyYerel.yuklu(com.dogac.bin1.MainActivity.this);
        }

        Kopru() {
        }

        @android.webkit.JavascriptInterface
        public java.lang.String anahtar() {
            return com.dogac.bin1.BuildConfig.GEMINI_KEY;
        }

        @android.webkit.JavascriptInterface
        public java.lang.String groqAnahtar() {
            return com.dogac.bin1.BuildConfig.GROQ_KEY;
        }

        @android.webkit.JavascriptInterface
        public java.lang.String kaydet(java.lang.String ad, java.lang.String b64, java.lang.String tip) {
            return com.dogac.bin1.MainActivity.this.indirilenlereKaydet(ad, b64, tip);
        }

        @android.webkit.JavascriptInterface
        public void konus(final java.lang.String metin, final java.lang.String id, final java.lang.String hiz) {
            com.dogac.bin1.MainActivity.this.runOnUiThread(new java.lang.Runnable() { // from class: com.dogac.bin1.MainActivity$Kopru$$ExternalSyntheticLambda1
                @Override // java.lang.Runnable
                public final void run() {
                    com.dogac.bin1.MainActivity.Kopru.this.lambda$konus$0(id, hiz, metin);
                }
            });
        }

        /* JADX INFO: Access modifiers changed from: private */
        public /* synthetic */ void lambda$konus$0(java.lang.String id, java.lang.String hiz, java.lang.String metin) {
            if (!com.dogac.bin1.MainActivity.this.ttsHazir) {
                com.dogac.bin1.MainActivity.this.js("carvisYerel.konusmaBitti(" + com.dogac.bin1.MainActivity.jsStr(id) + ")");
                return;
            }
            try {
                com.dogac.bin1.MainActivity.this.tts.setSpeechRate(java.lang.Float.parseFloat(hiz));
            } catch (java.lang.Exception e) {
            }
            com.dogac.bin1.CarvisServis.konusmaBasladi();
            com.dogac.bin1.CarvisServis.sonKonusma = metin == null ? "" : metin;
            android.os.Bundle p = new android.os.Bundle();
            com.dogac.bin1.MainActivity.this.tts.speak(metin, 0, p, id);
        }

        /* JADX INFO: Access modifiers changed from: private */
        public /* synthetic */ void lambda$sus$1() {
            if (com.dogac.bin1.MainActivity.this.tts != null) {
                com.dogac.bin1.MainActivity.this.tts.stop();
            }
        }

        @android.webkit.JavascriptInterface
        public void sus() {
            com.dogac.bin1.MainActivity.this.runOnUiThread(new java.lang.Runnable() { // from class: com.dogac.bin1.MainActivity$Kopru$$ExternalSyntheticLambda5
                @Override // java.lang.Runnable
                public final void run() {
                    com.dogac.bin1.MainActivity.Kopru.this.lambda$sus$1();
                }
            });
        }

        @android.webkit.JavascriptInterface
        public void dinle() {
            com.dogac.bin1.MainActivity mainActivity = com.dogac.bin1.MainActivity.this;
            final com.dogac.bin1.MainActivity mainActivity2 = com.dogac.bin1.MainActivity.this;
            mainActivity.runOnUiThread(new java.lang.Runnable() { // from class: com.dogac.bin1.MainActivity$Kopru$$ExternalSyntheticLambda6
                @Override // java.lang.Runnable
                public final void run() {
                    com.dogac.bin1.MainActivity.this.tekCumleDinle();
                }
            });
        }

        /* JADX INFO: Access modifiers changed from: private */
        public /* synthetic */ void lambda$dinlemeyiKes$2() {
            if (com.dogac.bin1.MainActivity.this.tanima != null) {
                com.dogac.bin1.MainActivity.this.tanima.cancel();
            }
            com.dogac.bin1.CarvisServis.mikrofonuAl();
        }

        @android.webkit.JavascriptInterface
        public void dinlemeyiKes() {
            com.dogac.bin1.Cihaz.iptal = true;
            com.dogac.bin1.MainActivity.this.runOnUiThread(new java.lang.Runnable() { // from class: com.dogac.bin1.MainActivity$Kopru$$ExternalSyntheticLambda4
                @Override // java.lang.Runnable
                public final void run() {
                    com.dogac.bin1.MainActivity.Kopru.this.lambda$dinlemeyiKes$2();
                }
            });
        }

        @android.webkit.JavascriptInterface
        public void baglam(java.lang.String b) {
            com.dogac.bin1.MainActivity.this.dinlemeBaglami = b;
        }

        @android.webkit.JavascriptInterface
        public void oturum(boolean acik) {
            com.dogac.bin1.MainActivity.oturumAcik = acik;
        }

        @android.webkit.JavascriptInterface
        public boolean onPlandaMi() {
            return com.dogac.bin1.MainActivity.this.onPlanda;
        }

        @android.webkit.JavascriptInterface
        public void oneGetir() {
            com.dogac.bin1.MainActivity mainActivity = com.dogac.bin1.MainActivity.this;
            final com.dogac.bin1.MainActivity mainActivity2 = com.dogac.bin1.MainActivity.this;
            mainActivity.runOnUiThread(new java.lang.Runnable() { // from class: com.dogac.bin1.MainActivity$Kopru$$ExternalSyntheticLambda0
                @Override // java.lang.Runnable
                public final void run() {
                    com.dogac.bin1.MainActivity.this.oneGetir();
                }
            });
        }

        @android.webkit.JavascriptInterface
        public void arkaPlan(boolean acik) {
            com.dogac.bin1.MainActivity.this.getSharedPreferences("carvis", 0).edit().putBoolean("arkaPlan", acik).apply();
        }

        @android.webkit.JavascriptInterface
        public boolean arkaPlanMi() {
            return com.dogac.bin1.MainActivity.this.getSharedPreferences("carvis", 0).getBoolean("arkaPlan", true);
        }

        @android.webkit.JavascriptInterface
        public java.lang.String sesler() {
            org.json.JSONArray j = new org.json.JSONArray();
            try {
                for (android.speech.tts.Voice v : com.dogac.bin1.MainActivity.this.tts.getVoices()) {
                    if ("tr".equals(v.getLocale().getLanguage())) {
                        j.put(v.getName() + (v.isNetworkConnectionRequired() ? " (ağ)" : ""));
                    }
                }
            } catch (java.lang.Exception e) {
            }
            return j.toString();
        }

        @android.webkit.JavascriptInterface
        public java.lang.String secilenSes() {
            android.content.SharedPreferences sp = com.dogac.bin1.MainActivity.this.getSharedPreferences("carvis", 0);
            return sp.getString("ses", com.dogac.bin1.MainActivity.VARSAYILAN_SES) + "|" + sp.getFloat("perde", 0.85f);
        }

        @android.webkit.JavascriptInterface
        public void sesAyarla(java.lang.String ad, float perde) {
            com.dogac.bin1.MainActivity.this.getSharedPreferences("carvis", 0).edit().putString("ses", ad.replace(" (ağ)", "")).putFloat("perde", java.lang.Math.max(0.5f, java.lang.Math.min(1.6f, perde))).apply();
            com.dogac.bin1.MainActivity.this.runOnUiThread(new java.lang.Runnable() { // from class: com.dogac.bin1.MainActivity$Kopru$$ExternalSyntheticLambda2
                @Override // java.lang.Runnable
                public final void run() {
                    com.dogac.bin1.MainActivity.Kopru.this.lambda$sesAyarla$3();
                }
            });
        }

        /* JADX INFO: Access modifiers changed from: private */
        public /* synthetic */ void lambda$sesAyarla$3() {
            if (com.dogac.bin1.MainActivity.this.tts == null || !com.dogac.bin1.MainActivity.this.ttsHazir) {
                return;
            }
            com.dogac.bin1.MainActivity.this.sesUygula();
        }

        @android.webkit.JavascriptInterface
        public java.lang.String sesSeviyesi(int yuzde) {
            return com.dogac.bin1.Cihaz.sesSeviyesi(com.dogac.bin1.MainActivity.this, yuzde);
        }

        @android.webkit.JavascriptInterface
        public java.lang.String medya(java.lang.String komut) {
            return com.dogac.bin1.Cihaz.medya(com.dogac.bin1.MainActivity.this, komut);
        }

        @android.webkit.JavascriptInterface
        public java.lang.String muzik(java.lang.String sorgu, java.lang.String uygulama) {
            return com.dogac.bin1.Cihaz.muzik(com.dogac.bin1.MainActivity.this, sorgu, uygulama);
        }

        @android.webkit.JavascriptInterface
        public java.lang.String uygulamaAc(java.lang.String ad) {
            return com.dogac.bin1.Cihaz.uygulamaAc(com.dogac.bin1.MainActivity.this, ad);
        }

        @android.webkit.JavascriptInterface
        public java.lang.String whatsapp(java.lang.String kisi, java.lang.String metin, java.lang.String islem, boolean gonder) {
            return com.dogac.bin1.Cihaz.whatsapp(com.dogac.bin1.MainActivity.this, kisi, metin, islem, gonder);
        }

        @android.webkit.JavascriptInterface
        public java.lang.String sesKaydi(boolean basla) {
            return com.dogac.bin1.Cihaz.sesKaydi(com.dogac.bin1.MainActivity.this, basla);
        }

        @android.webkit.JavascriptInterface
        public boolean erisimAcik() {
            return com.dogac.bin1.CarvisErisim.aktif();
        }

        /* JADX INFO: Access modifiers changed from: private */
        public /* synthetic */ void lambda$erisimAyarAc$4() {
            try {
                com.dogac.bin1.MainActivity.this.startActivity(new android.content.Intent("android.settings.ACCESSIBILITY_SETTINGS"));
            } catch (java.lang.Exception e) {
            }
        }

        @android.webkit.JavascriptInterface
        public void erisimAyarAc() {
            com.dogac.bin1.MainActivity.this.runOnUiThread(new java.lang.Runnable() { // from class: com.dogac.bin1.MainActivity$Kopru$$ExternalSyntheticLambda8
                @Override // java.lang.Runnable
                public final void run() {
                    com.dogac.bin1.MainActivity.Kopru.this.lambda$erisimAyarAc$4();
                }
            });
        }

        @android.webkit.JavascriptInterface
        public void uyandirma(final boolean acik) {
            com.dogac.bin1.MainActivity.this.runOnUiThread(new java.lang.Runnable() { // from class: com.dogac.bin1.MainActivity$Kopru$$ExternalSyntheticLambda3
                @Override // java.lang.Runnable
                public final void run() {
                    com.dogac.bin1.MainActivity.Kopru.this.lambda$uyandirma$5(acik);
                }
            });
        }

        /* JADX INFO: Access modifiers changed from: private */
        public /* synthetic */ void lambda$uyandirma$5(boolean acik) {
            com.dogac.bin1.MainActivity.this.uyandirmaIstendi = acik;
            com.dogac.bin1.MainActivity.this.getSharedPreferences("carvis", 0).edit().putBoolean("uyandirma", acik).apply();
            if (!acik) {
                com.dogac.bin1.MainActivity.this.stopService(new android.content.Intent(com.dogac.bin1.MainActivity.this, (java.lang.Class<?>) com.dogac.bin1.CarvisServis.class));
            } else if (!com.dogac.bin1.MainActivity.this.mikrofonVar()) {
                com.dogac.bin1.MainActivity.this.requestPermissions(new java.lang.String[]{"android.permission.RECORD_AUDIO"}, com.dogac.bin1.MainActivity.IZIN_MIKROFON);
            } else {
                com.dogac.bin1.MainActivity.this.servisBaslat();
            }
        }

        @android.webkit.JavascriptInterface
        public boolean kullanimIzniVar() {
            android.app.AppOpsManager ao = (android.app.AppOpsManager) com.dogac.bin1.MainActivity.this.getSystemService("appops");
            int m = ao.checkOpNoThrow("android:get_usage_stats", android.os.Process.myUid(), com.dogac.bin1.MainActivity.this.getPackageName());
            return m == 0;
        }

        /* JADX INFO: Access modifiers changed from: private */
        public /* synthetic */ void lambda$kullanimIzniAc$6() {
            try {
                com.dogac.bin1.MainActivity.this.startActivity(new android.content.Intent("android.settings.USAGE_ACCESS_SETTINGS"));
            } catch (java.lang.Exception e) {
            }
        }

        @android.webkit.JavascriptInterface
        public void kullanimIzniAc() {
            com.dogac.bin1.MainActivity.this.runOnUiThread(new java.lang.Runnable() { // from class: com.dogac.bin1.MainActivity$Kopru$$ExternalSyntheticLambda7
                @Override // java.lang.Runnable
                public final void run() {
                    com.dogac.bin1.MainActivity.Kopru.this.lambda$kullanimIzniAc$6();
                }
            });
        }

        @android.webkit.JavascriptInterface
        public java.lang.String kullanim() {
            try {
                android.app.usage.UsageStatsManager um = (android.app.usage.UsageStatsManager) com.dogac.bin1.MainActivity.this.getSystemService("usagestats");
                java.util.Calendar c = java.util.Calendar.getInstance();
                c.set(com.dogac.bin1.MainActivity.IZIN_MIKROFON, 0);
                c.set(com.dogac.bin1.MainActivity.DOSYA_SEC, 0);
                c.set(13, 0);
                java.util.Map<java.lang.String, android.app.usage.UsageStats> l = um.queryAndAggregateUsageStats(c.getTimeInMillis(), java.lang.System.currentTimeMillis());
                org.json.JSONArray j = new org.json.JSONArray();
                android.content.pm.PackageManager pm = com.dogac.bin1.MainActivity.this.getPackageManager();
                for (android.app.usage.UsageStats s : l.values()) {
                    long dk = s.getTotalTimeInForeground() / 60000;
                    if (dk >= 1) {
                        java.lang.String ad = s.getPackageName();
                        try {
                            ad = pm.getApplicationLabel(pm.getApplicationInfo(s.getPackageName(), 0)).toString();
                        } catch (java.lang.Exception e) {
                        }
                        j.put(new org.json.JSONObject().put("paket", s.getPackageName()).put("ad", ad).put("dk", dk));
                    }
                }
                return j.toString();
            } catch (java.lang.Exception e2) {
                return "[]";
            }
        }

        @android.webkit.JavascriptInterface
        public boolean sessizMod() {
            android.app.NotificationManager n = (android.app.NotificationManager) com.dogac.bin1.MainActivity.this.getSystemService("notification");
            return (n == null || n.getCurrentInterruptionFilter() == 1) ? false : true;
        }
    }
}
