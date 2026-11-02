package com.dogac.bin1;

/* loaded from: /tmp/claude-0/-home-user-IHunterX0/90d85fb8-2a42-5d54-b9be-15454082c495/scratchpad/chk/classes3.dex */
public class CarvisServis extends android.app.Service implements org.vosk.android.RecognitionListener {
    static final java.lang.String KANAL = "carvis";
    static final java.lang.String KANAL_UYAN = "carvis_uyan";
    static com.dogac.bin1.CarvisServis ornek;
    android.content.BroadcastReceiver alici;
    org.vosk.android.SpeechService dinleyici;
    org.vosk.Model model;
    static boolean konusuyor = false;
    static final java.lang.String[] RAKIPLER = {"servis", "serbest", "sevgi", "kervan", "saray", "karbon", "ceviz", "biz", "bir", "bu", "şu", "o", "ve", "de", "da", "paris", "pelvis", "sabah", "akşam", "bugün", "yarın", "ne", "nasıl", "neden", "evet", "hayır", "tamam", "kardeş", "çarşı", "başka", "servet", "seviye", "sert", "kas", "kemik", "glikoz", "protein", "enzim", "hücre", "kitap", "bölüm", "sayfa", "soru", "cevap", "test", "ders", "çalış", "anlat", "göster", "aç", "kapat", "dur", "devam", "geç", "tekrar", "yavaş", "hızlı", "merhaba", "selam", "lütfen", "teşekkür", "güzel", "iyi", "kötü", "var", "yok", "mi", "mı", "ben", "sen", "bunu", "şunu", "onu", "gel", "git", "al", "ver", "yap", "bak", "dinle", "konuş", "[unk]"};
    static volatile long konusmaBitis = 0;
    static volatile java.lang.String sonKonusma = "";
    static volatile boolean konusmaliCumle = false;
    static long sonUyanma = 0;
    boolean birakildi = false;
    final android.os.Handler ana = new android.os.Handler(android.os.Looper.getMainLooper());
    final java.lang.Runnable baslatR = new com.dogac.bin1.CarvisServis$$ExternalSyntheticLambda0(this);
    int kismiGorulen = 0;
    long sonKesme = 0;

    class Alici extends android.content.BroadcastReceiver {
        final com.dogac.bin1.CarvisServis s;

        Alici(com.dogac.bin1.CarvisServis carvisServis) {
            this.s = carvisServis;
        }

        @Override // android.content.BroadcastReceiver
        public void onReceive(android.content.Context context, android.content.Intent intent) {
            this.s.durumDegisti();
        }
    }

    boolean dinlemeUygun() {
        if (sessizMod()) {
            return false;
        }
        if (((android.os.PowerManager) getSystemService("power")).isInteractive()) {
            return true;
        }
        return ((android.os.BatteryManager) getSystemService("batterymanager")).isCharging();
    }

    void durumDegisti() {
        if (!dinlemeUygun()) {
            this.ana.removeCallbacks(this.baslatR);
            durdur();
            guncelle(uykuMetni());
        } else {
            if (this.birakildi) {
                return;
            }
            android.os.Handler handler = this.ana;
            java.lang.Runnable runnable = this.baslatR;
            handler.removeCallbacks(runnable);
            handler.postDelayed(runnable, 500L);
        }
    }

    java.lang.String uykuMetni() {
        return sessizMod() ? "Rahatsız Etmeyin açık: Carvis dinlemiyor" : "Ekran kapalı: Carvis pil için dinlemiyor";
    }

    static void konusmaBasladi() {
        konusuyor = true;
    }

    static void konusmaBitti() {
        konusuyor = false;
        konusmaBitis = java.lang.System.currentTimeMillis();
    }

    static void mikrofonuBirak() {
        final com.dogac.bin1.CarvisServis s = ornek;
        if (s == null) {
            return;
        }
        s.birakildi = true;
        s.ana.removeCallbacks(s.baslatR);
        if (android.os.Looper.myLooper() == android.os.Looper.getMainLooper()) {
            s.durdur();
            return;
        }
        android.os.Handler handler = s.ana;
        java.util.Objects.requireNonNull(s);
        handler.post(new java.lang.Runnable() { // from class: com.dogac.bin1.CarvisServis$$ExternalSyntheticLambda3
            @Override // java.lang.Runnable
            public final void run() {
                com.dogac.bin1.CarvisServis.this.durdur();
            }
        });
    }

    static void baslatIstegi(android.content.Context c) {
        try {
            if (ornek == null && c.checkSelfPermission("android.permission.RECORD_AUDIO") == 0 && c.getSharedPreferences(KANAL, 0).getBoolean("uyandirma", true)) {
                android.content.Intent i = new android.content.Intent(c, (java.lang.Class<?>) com.dogac.bin1.CarvisServis.class);
                c.startForegroundService(i);
                android.util.Log.i("Carvis", "dinleme servisi kendiliğinden başlatıldı");
            }
        } catch (java.lang.Exception e) {
            android.util.Log.w("Carvis", "servis başlatılamadı: " + e);
        }
    }

    static void mikrofonuAl() {
        com.dogac.bin1.CarvisServis s = ornek;
        if (s != null) {
            s.birakildi = false;
            s.ana.removeCallbacks(s.baslatR);
            s.ana.postDelayed(s.baslatR, 300L);
        }
    }

    @Override // android.app.Service
    public void onCreate() {
        super.onCreate();
        ornek = this;
        android.app.NotificationManager nm = (android.app.NotificationManager) getSystemService("notification");
        nm.createNotificationChannel(new android.app.NotificationChannel(KANAL, "Carvis dinliyor", 2));
        nm.createNotificationChannel(new android.app.NotificationChannel(KANAL_UYAN, "Carvis uyandı", 4));
        android.app.Notification n = bildirim("\"Carvis\" deyince uyanır");
        if (android.os.Build.VERSION.SDK_INT >= 29) {
            startForeground(1, n, 128);
        } else {
            startForeground(1, n);
        }
        new java.lang.Thread(new java.lang.Runnable() { // from class: com.dogac.bin1.CarvisServis$$ExternalSyntheticLambda2
            @Override // java.lang.Runnable
            public final void run() {
                com.dogac.bin1.CarvisServis.this.lambda$onCreate$0();
            }
        }).start();
        android.content.IntentFilter intentFilter = new android.content.IntentFilter();
        intentFilter.addAction("android.app.action.INTERRUPTION_FILTER_CHANGED");
        intentFilter.addAction("android.intent.action.SCREEN_ON");
        intentFilter.addAction("android.intent.action.SCREEN_OFF");
        intentFilter.addAction("android.intent.action.ACTION_POWER_CONNECTED");
        intentFilter.addAction("android.intent.action.ACTION_POWER_DISCONNECTED");
        com.dogac.bin1.CarvisServis.Alici alici = new com.dogac.bin1.CarvisServis.Alici(this);
        this.alici = alici;
        registerReceiver(alici, intentFilter);
    }

    /* JADX INFO: Access modifiers changed from: private */
    public /* synthetic */ void lambda$onCreate$0() {
        try {
            java.io.File d = modeliCikar();
            this.model = new org.vosk.Model(d.getAbsolutePath());
            this.ana.post(new com.dogac.bin1.CarvisServis$$ExternalSyntheticLambda0(this));
        } catch (java.lang.Exception e) {
            android.util.Log.e("Carvis", "model", e);
            guncelle("Ses modeli açılamadı: " + e.getMessage());
        }
    }

    android.app.Notification bildirim(java.lang.String metin) {
        android.content.Intent i = new android.content.Intent(this, (java.lang.Class<?>) com.dogac.bin1.MainActivity.class).addFlags(536870912);
        android.app.PendingIntent pi = android.app.PendingIntent.getActivity(this, 0, i, 67108864);
        android.app.Notification.Builder b = new android.app.Notification.Builder(this, KANAL);
        return b.setContentTitle("Carvis").setContentText(metin).setSmallIcon(android.R.drawable.ic_btn_speak_now).setContentIntent(pi).setOngoing(true).build();
    }

    void guncelle(java.lang.String metin) {
        ((android.app.NotificationManager) getSystemService("notification")).notify(1, bildirim(metin));
    }

    static void ekranAcBildirimi(android.content.Context c) {
        android.content.Intent i = new android.content.Intent(c, (java.lang.Class<?>) com.dogac.bin1.MainActivity.class).putExtra("uyan", true).addFlags(805306368);
        android.app.PendingIntent pi = android.app.PendingIntent.getActivity(c, 2, i, 201326592);
        android.app.Notification.Builder b = new android.app.Notification.Builder(c, KANAL_UYAN);
        android.app.Notification n = b.setContentTitle("Carvis").setContentText("Dinliyorum — dokun").setSmallIcon(android.R.drawable.ic_btn_speak_now).setContentIntent(pi).setFullScreenIntent(pi, true).setAutoCancel(true).setCategory("call").build();
        ((android.app.NotificationManager) c.getSystemService("notification")).notify(2, n);
        try {
            pi.send();
        } catch (java.lang.Exception e) {
        }
    }

    java.io.File modeliCikar() throws java.lang.Exception {
        java.io.File hedef = new java.io.File(getFilesDir(), "vosk-tr");
        java.io.File isaret = new java.io.File(hedef, ".tamam");
        if (isaret.exists()) {
            return hedef;
        }
        kopyala(getAssets(), "vosk-tr", hedef);
        isaret.createNewFile();
        return hedef;
    }

    static void kopyala(android.content.res.AssetManager am, java.lang.String yol, java.io.File hedef) throws java.lang.Exception {
        java.lang.String[] l = am.list(yol);
        if (l == null || l.length == 0) {
            hedef.getParentFile().mkdirs();
            java.io.InputStream i = am.open(yol);
            try {
                java.io.OutputStream o = new java.io.FileOutputStream(hedef);
                try {
                    byte[] b = new byte[65536];
                    while (true) {
                        int n = i.read(b);
                        if (n <= 0) {
                            break;
                        } else {
                            o.write(b, 0, n);
                        }
                    }
                    o.close();
                    if (i != null) {
                        i.close();
                        return;
                    }
                    return;
                } finally {
                }
            } catch (java.lang.Throwable th) {
                if (i != null) {
                    try {
                        i.close();
                    } catch (java.lang.Throwable th2) {
                        th.addSuppressed(th2);
                    }
                }
                throw th;
            }
        }
        hedef.mkdirs();
        for (java.lang.String a : l) {
            kopyala(am, yol + "/" + a, new java.io.File(hedef, a));
        }
    }

    void baslat() {
        if (this.model == null || this.dinleyici != null) {
            return;
        }
        if (!dinlemeUygun()) {
            guncelle(uykuMetni());
            return;
        }
        try {
            org.json.JSONArray g = new org.json.JSONArray();
            for (java.lang.String w : RAKIPLER) {
                g.put(w);
            }
            org.vosk.Recognizer r = new org.vosk.Recognizer(this.model, 16000.0f, g.toString());
            r.setWords(true);
            this.dinleyici = new org.vosk.android.SpeechService(r, 16000.0f);
            this.dinleyici.startListening(this);
            guncelle("\"Carvis\" deyince uyanır");
        } catch (java.lang.Exception e) {
            android.util.Log.e("Carvis", "baslat", e);
            this.dinleyici = null;
            guncelle("Mikrofon açılamadı");
        }
    }

    void durdur() {
        if (this.dinleyici != null) {
            this.dinleyici.stop();
            this.dinleyici.shutdown();
            this.dinleyici = null;
        }
    }

    boolean sessizMod() {
        android.app.NotificationManager n = (android.app.NotificationManager) getSystemService("notification");
        return n.getCurrentInterruptionFilter() != 1;
    }

    public void onResult(java.lang.String json) {
        kontrol(json);
    }

    public void onFinalResult(java.lang.String json) {
        kontrol(json);
    }

    public void onPartialResult(java.lang.String json) {
        try {
            java.lang.String t = new org.json.JSONObject(json).optString("partial", "").trim();
            java.lang.String[] k = t.isEmpty() ? new java.lang.String[0] : t.split("\\s+");
            if (k.length < this.kismiGorulen) {
                this.kismiGorulen = 0;
            }
            if (konusuyor && k.length > 0) {
                konusmaliCumle = true;
            }
            if (!konusuyor) {
                this.kismiGorulen = k.length;
                return;
            }
            int i = this.kismiGorulen;
            while (true) {
                if (i >= k.length) {
                    break;
                }
                if (!"dinle".equals(k[i]) || java.lang.System.currentTimeMillis() - this.sonKesme <= 1500) {
                    i++;
                } else {
                    this.sonKesme = java.lang.System.currentTimeMillis();
                    android.util.Log.i("Carvis", "söz kesme (dinle): " + t);
                    com.dogac.bin1.MainActivity a = com.dogac.bin1.MainActivity.ornek;
                    if (a != null) {
                        a.js("carvisYerel.dinleKomutu&&carvisYerel.dinleKomutu()");
                    }
                }
            }
            int i2 = k.length;
            this.kismiGorulen = i2;
        } catch (java.lang.Exception e) {
        }
    }

    public void onError(java.lang.Exception e) {
        android.util.Log.e("Carvis", "vosk", e);
        durdur();
        this.ana.postDelayed(new com.dogac.bin1.CarvisServis$$ExternalSyntheticLambda0(this), 2000L);
    }

    public void onTimeout() {
        durdur();
        baslat();
    }

    void kontrol(java.lang.String json) {
        try {
            org.json.JSONArray r = new org.json.JSONObject(json).optJSONArray("result");
            android.util.Log.i("Carvis", "duydu: " + json.replaceAll(" +", " "));
            if (r != null && r.length() != 0) {
                org.json.JSONObject ilk = r.getJSONObject(0);
                if (konusuyor) {
                    return;
                }
                if (konusmaliCumle) {
                    konusmaliCumle = false;
                    if (java.lang.System.currentTimeMillis() - konusmaBitis < 6000) {
                        android.util.Log.i("Carvis", "kendi sesi yok sayıldı");
                        return;
                    }
                }
                if (java.lang.System.currentTimeMillis() - konusmaBitis < 1500) {
                    return;
                }
                java.lang.String w = ilk.optString("word");
                double guven = ilk.optDouble("conf", 0.0d);
                if (!"servis".equals(w) && !"ceviz".equals(w) && r.length() > 1 && java.util.Arrays.asList("o", "bu", "şu", "ve", "de", "da", "bir", "[unk]").contains(w)) {
                    org.json.JSONObject iki = r.getJSONObject(1);
                    w = iki.optString("word");
                    guven = iki.optDouble("conf", 0.0d);
                }
                if (("servis".equals(w) || "ceviz".equals(w)) && guven >= 0.55d && java.lang.System.currentTimeMillis() - this.sonKesme >= 3000 && java.lang.System.currentTimeMillis() - sonUyanma >= 2500) {
                    sonUyanma = java.lang.System.currentTimeMillis();
                    if (sessizMod()) {
                        guncelle("Rahatsız Etmeyin açık: Carvis uyuyor");
                        return;
                    }
                    final com.dogac.bin1.MainActivity a = com.dogac.bin1.MainActivity.ornek;
                    if (a == null) {
                        ekranAcBildirimi(this);
                    } else {
                        java.util.Objects.requireNonNull(a);
                        a.runOnUiThread(new java.lang.Runnable() { // from class: com.dogac.bin1.CarvisServis$$ExternalSyntheticLambda1
                            @Override // java.lang.Runnable
                            public final void run() {
                                com.dogac.bin1.MainActivity.this.uyandir();
                            }
                        });
                    }
                }
            }
        } catch (java.lang.Exception e) {
        }
    }

    @Override // android.app.Service
    public int onStartCommand(android.content.Intent i, int f, int id) {
        return 1;
    }

    @Override // android.app.Service
    public void onDestroy() {
        android.content.BroadcastReceiver broadcastReceiver = this.alici;
        if (broadcastReceiver != null) {
            try {
                unregisterReceiver(broadcastReceiver);
            } catch (java.lang.Exception unused) {
            }
        }
        durdur();
        if (this.model != null) {
            this.model.close();
        }
        if (ornek == this) {
            ornek = null;
        }
        super.onDestroy();
    }

    @Override // android.app.Service
    public android.os.IBinder onBind(android.content.Intent i) {
        return null;
    }
}
