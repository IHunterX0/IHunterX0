package com.dogac.bin1;

/* loaded from: classes3.dex */
public class Cihaz {
    static android.media.MediaRecorder kaydedici;
    static java.lang.String kayitAd;
    static android.os.ParcelFileDescriptor kayitFd;
    static final android.os.Handler ana = new android.os.Handler(android.os.Looper.getMainLooper());
    static volatile boolean iptal = false;
    static long geminiKapali = 0;
    static final java.util.regex.Pattern WHISPER_UYDURMA = java.util.regex.Pattern.compile("(?i)^(altyaz[ıi].*|.*izledi[ğg]iniz i[çc]in te[şs]ekk[üu]r.*|.*abone ol.*|.*bir sonraki videoda.*|m\\.?k\\.?|\\.+|te[şs]ekk[üu]rler\\.?)$");

    interface Sonuc {
        void hata(java.lang.String str);

        void metin(java.lang.String str);
    }

    static java.lang.String sesSeviyesi(android.content.Context c, int yuzde) {
        android.media.AudioManager am = (android.media.AudioManager) c.getSystemService("audio");
        int max = am.getStreamMaxVolume(3);
        int v = java.lang.Math.max(0, java.lang.Math.min(max, java.lang.Math.round((max * yuzde) / 100.0f)));
        am.setStreamVolume(3, v, 1);
        return "Medya sesi %" + java.lang.Math.round((v * 100.0f) / max);
    }

    /* JADX WARN: Can't fix incorrect switch cases order, some code will duplicate */
    static java.lang.String medya(android.content.Context c, java.lang.String komut) {
        char c2;
        int k;
        java.lang.String str = komut == null ? "" : komut;
        switch (str.hashCode()) {
            case -2028343201:
                if (str.equals("sonraki")) {
                    c2 = 2;
                    break;
                }
                c2 = 65535;
                break;
            case -1992278060:
                if (str.equals("duraklat")) {
                    c2 = 0;
                    break;
                }
                c2 = 65535;
                break;
            case -1012494433:
                if (str.equals("onceki")) {
                    c2 = 3;
                    break;
                }
                c2 = 65535;
                break;
            case 106224375:
                if (str.equals("oynat")) {
                    c2 = 1;
                    break;
                }
                c2 = 65535;
                break;
            default:
                c2 = 65535;
                break;
        }
        switch (c2) {
            case 0:
                k = kotlinx.coroutines.scheduling.WorkQueueKt.MASK;
                break;
            case 1:
                k = 126;
                break;
            case 2:
                k = 87;
                break;
            case 3:
                k = 88;
                break;
            default:
                k = 85;
                break;
        }
        android.media.AudioManager am = (android.media.AudioManager) c.getSystemService("audio");
        am.dispatchMediaKeyEvent(new android.view.KeyEvent(0, k));
        am.dispatchMediaKeyEvent(new android.view.KeyEvent(1, k));
        return "Tamam: " + komut;
    }

    static java.lang.String muzik(android.app.Activity a, java.lang.String sorgu, java.lang.String uygulama) {
        java.lang.String paket = (uygulama == null || !uygulama.toLowerCase(java.util.Locale.ROOT).contains("youtube")) ? "com.spotify.music" : "com.google.android.apps.youtube.music";
        if (sorgu == null || sorgu.trim().isEmpty()) {
            return medya(a, "oynat");
        }
        if ("com.spotify.music".equals(paket) && com.dogac.bin1.CarvisErisim.aktif()) {
            try {
                a.startActivity(new android.content.Intent("android.intent.action.VIEW", android.net.Uri.parse("spotify:search:" + android.net.Uri.encode(sorgu))).setPackage(paket).addFlags(268435456));
                ana.postDelayed(new java.lang.Runnable() { // from class: com.dogac.bin1.Cihaz$$ExternalSyntheticLambda4
                    @Override // java.lang.Runnable
                    public final void run() {
                        com.dogac.bin1.CarvisErisim.spotifyIlkSarki(25);
                    }
                }, 1200L);
                return "Çalınıyor (Spotify): " + sorgu;
            } catch (java.lang.Exception e) {
                android.util.Log.w("Carvis", "spotify arama: " + e);
            }
        }
        if (oturumdanCal(a, paket, sorgu)) {
            return "Çalma komutu gönderildi: " + sorgu;
        }
        try {
            android.content.Intent i = new android.content.Intent("android.media.action.MEDIA_PLAY_FROM_SEARCH");
            i.putExtra("query", sorgu);
            i.putExtra("android.intent.extra.focus", "vnd.android.cursor.item/*");
            i.setPackage(paket);
            i.addFlags(268435456);
            a.startActivity(i);
            return "Çalınıyor (" + paket + "): " + sorgu;
        } catch (java.lang.Exception e2) {
            try {
                a.startActivity(new android.content.Intent("android.intent.action.VIEW", android.net.Uri.parse("spotify:search:" + android.net.Uri.encode(sorgu))).addFlags(268435456));
                return "Spotify'da arandı (çalmak için seçmek gerekebilir): " + sorgu;
            } catch (java.lang.Exception e22) {
                return "Müzik uygulaması açılamadı: " + e22.getMessage();
            }
        }
    }

    static boolean oturumdanCal(android.content.Context c, java.lang.String paket, java.lang.String sorgu) {
        try {
            android.media.session.MediaSessionManager m = (android.media.session.MediaSessionManager) c.getSystemService("media_session");
            for (android.media.session.MediaController mc : m.getActiveSessions(new android.content.ComponentName(c, (java.lang.Class<?>) com.dogac.bin1.CarvisBildirim.class))) {
                if (paket.equals(mc.getPackageName())) {
                    mc.getTransportControls().playFromSearch(sorgu, new android.os.Bundle());
                    android.util.Log.i("Carvis", "medya oturumundan çal: " + sorgu);
                    return true;
                }
            }
            return false;
        } catch (java.lang.SecurityException e) {
            android.util.Log.w("Carvis", "bildirim erişimi yok: medya oturumu okunamadı");
            return false;
        } catch (java.lang.Exception e2) {
            android.util.Log.w("Carvis", "oturumdanCal: " + e2);
            return false;
        }
    }

    static java.lang.String duzle(java.lang.String s) {
        return s == null ? "" : s.toLowerCase(new java.util.Locale("tr")).replaceAll("[^a-z0-9çğıöşü]", "");
    }

    static java.lang.String uygulamaAc(android.app.Activity a, java.lang.String ad) {
        int p;
        android.content.pm.PackageManager pm = a.getPackageManager();
        android.content.Intent q = new android.content.Intent("android.intent.action.MAIN").addCategory("android.intent.category.LAUNCHER");
        java.util.List<android.content.pm.ResolveInfo> l = pm.queryIntentActivities(q, 0);
        java.lang.String duzle = duzle(ad);
        android.content.pm.ResolveInfo en = null;
        int puan = 0;
        for (android.content.pm.ResolveInfo r : l) {
            java.lang.String duzle2 = duzle(r.loadLabel(pm).toString());
            if (duzle2.equals(duzle)) {
                p = 3;
            } else if (duzle2.startsWith(duzle)) {
                p = 2;
            } else {
                p = ((duzle2.contains(duzle) || duzle.contains(duzle2)) && duzle2.length() > 2) ? 1 : 0;
            }
            if (p > puan) {
                puan = p;
                en = r;
            }
        }
        if (en == null) {
            return "Bu adla uygulama bulunamadı: " + ad;
        }
        android.content.Intent i = pm.getLaunchIntentForPackage(en.activityInfo.packageName);
        if (i == null) {
            return "Açılamadı";
        }
        a.startActivity(i.addFlags(268435456));
        return "Açıldı: " + ((java.lang.Object) en.loadLabel(pm));
    }

    static java.lang.String numara(android.app.Activity a, java.lang.String kisi) {
        java.lang.String rakam = kisi.replaceAll("[^0-9+]", "");
        if (rakam.replace("+", "").length() >= 10) {
            return normalle(rakam);
        }
        if (a.checkSelfPermission("android.permission.READ_CONTACTS") != 0) {
            a.requestPermissions(new java.lang.String[]{"android.permission.READ_CONTACTS"}, 21);
            return null;
        }
        android.net.Uri u = android.net.Uri.withAppendedPath(android.provider.ContactsContract.CommonDataKinds.Phone.CONTENT_FILTER_URI, android.net.Uri.encode(kisi));
        try {
            android.database.Cursor c = a.getContentResolver().query(u, new java.lang.String[]{"data1", "display_name"}, null, null, null);
            if (c != null) {
                try {
                    if (c.moveToFirst()) {
                        java.lang.String str = normalle(c.getString(0)) + "|" + c.getString(1);
                        if (c != null) {
                            c.close();
                        }
                        return str;
                    }
                } finally {
                }
            }
            if (c != null) {
                c.close();
            }
        } catch (java.lang.Exception e) {
            android.util.Log.e("Carvis", "kisi", e);
        }
        return "";
    }

    static java.lang.String normalle(java.lang.String n) {
        java.lang.String d = n.replaceAll("[^0-9]", "");
        return d.startsWith("00") ? d.substring(2) : d.startsWith("0") ? "90" + d.substring(1) : (d.length() == 10 && d.startsWith("5")) ? "90" + d : d;
    }

    static java.lang.String whatsappPaket(android.app.Activity a) {
        java.lang.String[] strArr = {"com.whatsapp", "com.whatsapp.w4b"};
        for (int i = 0; i < 2; i++) {
            java.lang.String p = strArr[i];
            try {
                a.getPackageManager().getPackageInfo(p, 0);
                return p;
            } catch (java.lang.Exception e) {
            }
        }
        return null;
    }

    static java.lang.String whatsapp(android.app.Activity a, java.lang.String kisi, java.lang.String metin, java.lang.String islem, boolean gonder) {
        java.lang.String paket = whatsappPaket(a);
        if (paket == null) {
            return "WhatsApp yüklü değil.";
        }
        java.lang.String n = numara(a, kisi);
        if (n == null) {
            return "Kişiler izni gerekiyor; ekranda izin istendi. Kullanıcı izin verince tekrar dene.";
        }
        if (n.isEmpty()) {
            return whatsappAdla(a, paket, kisi, metin, islem, gonder);
        }
        java.lang.String[] p = n.split("\\|");
        java.lang.String no = p[0];
        java.lang.String ad = p.length > 1 ? p[1] : kisi;
        java.lang.String url = "https://api.whatsapp.com/send?phone=" + no + ((!"mesaj".equals(islem) || metin == null) ? "" : "&text=" + android.net.Uri.encode(metin));
        a.startActivity(new android.content.Intent("android.intent.action.VIEW", android.net.Uri.parse(url)).setPackage(paket).addFlags(268435456));
        if (!gonder) {
            return ad + " sohbeti açıldı" + ("mesaj".equals(islem) ? ", mesaj taslağı yazıldı (gönderilmedi)." : ".");
        }
        if (!com.dogac.bin1.CarvisErisim.aktif()) {
            return ad + " sohbeti açıldı ama Carvis'in Erişilebilirlik izni kapalı; " + ("mesaj".equals(islem) ? "Gönder'e" : "arama düğmesine") + " kullanıcı basmalı.";
        }
        if ("mesaj".equals(islem)) {
            android.util.Log.i("Carvis", "whatsapp: gönder aranıyor");
            com.dogac.bin1.CarvisErisim.tikla(new java.lang.String[]{paket + ":id/send"}, new java.lang.String[]{"Gönder", "Send"}, 30, null);
            return ad + " kişisine mesaj gönderiliyor: " + metin;
        }
        boolean v = "goruntulu".equals(islem);
        java.lang.String[] strArr = new java.lang.String[0];
        java.lang.String[] strArr2 = new java.lang.String[2];
        if (v) {
            strArr2[0] = "Görüntülü arama";
            strArr2[1] = "Video call";
        } else {
            strArr2[0] = "Sesli arama";
            strArr2[1] = "Voice call";
        }
        com.dogac.bin1.CarvisErisim.tikla(strArr, strArr2, 30, new java.lang.Runnable() { // from class: com.dogac.bin1.Cihaz$$ExternalSyntheticLambda5
            @Override // java.lang.Runnable
            public final void run() {
                com.dogac.bin1.CarvisErisim.tikla(new java.lang.String[]{"android:id/button1"}, new java.lang.String[]{"ARA", "Ara", "CALL", "Call", "Başlat"}, 8, null);
            }
        });
        return ad + " " + (v ? "görüntülü" : "sesli") + " aranıyor.";
    }

    static java.lang.String whatsappAdla(android.app.Activity a, final java.lang.String paket, java.lang.String kisi, java.lang.String metin, java.lang.String islem, boolean gonder) {
        java.lang.Runnable ara;
        java.lang.StringBuilder sb;
        java.lang.StringBuilder append;
        java.lang.String str;
        if (!com.dogac.bin1.CarvisErisim.aktif()) {
            return "Rehberde '" + kisi + "' yok; WhatsApp'ta adıyla bulmak için Carvis'in Erişilebilirlik izni gerekli. Numarasını sor.";
        }
        boolean mesaj = "mesaj".equals(islem);
        if (mesaj) {
            android.content.Intent i = new android.content.Intent("android.intent.action.SEND").setType(androidx.webkit.internal.AssetHelper.DEFAULT_MIME_TYPE).putExtra("android.intent.extra.TEXT", metin == null ? "" : metin).setPackage(paket).addFlags(268435456);
            a.startActivity(i);
            com.dogac.bin1.CarvisErisim.paylasModu = true;
            ara = gonder ? new java.lang.Runnable() { // from class: com.dogac.bin1.Cihaz$$ExternalSyntheticLambda14
                @Override // java.lang.Runnable
                public final void run() {
                    com.dogac.bin1.CarvisErisim.paylasimGonder(paket, 16);
                }
            } : null;
            com.dogac.bin1.CarvisErisim.adlaSec(paket, kisi, 40, ara);
            return gonder ? "'" + kisi + "' WhatsApp listesinde aranıp mesaj gönderiliyor: " + metin : "WhatsApp paylaşım ekranında '" + kisi + "' seçiliyor; mesaj hazır, GÖNDERİLMEDİ.";
        }
        android.content.Intent ac = a.getPackageManager().getLaunchIntentForPackage(paket);
        if (ac == null) {
            return "WhatsApp açılamadı.";
        }
        a.startActivity(ac.addFlags(268435456));
        final boolean v = "goruntulu".equals(islem);
        ara = gonder ? new java.lang.Runnable() { // from class: com.dogac.bin1.Cihaz$$ExternalSyntheticLambda1
            @Override // java.lang.Runnable
            public final void run() {
                com.dogac.bin1.Cihaz.lambda$whatsappAdla$4(v);
            }
        } : null;
        com.dogac.bin1.CarvisErisim.paylasModu = false;
        com.dogac.bin1.CarvisErisim.adlaSec(paket, kisi, 40, ara);
        if (gonder) {
            sb = new java.lang.StringBuilder();
            append = sb.append("'").append(kisi).append("' WhatsApp'ta bulunup ").append(v ? "görüntülü" : "sesli");
            str = " aranıyor.";
        } else {
            sb = new java.lang.StringBuilder();
            append = sb.append("'").append(kisi);
            str = "' sohbeti WhatsApp'ta açılıyor.";
        }
        return append.append(str).toString();
    }

    static /* synthetic */ void lambda$whatsappAdla$4(boolean v) {
        java.lang.String[] strArr = new java.lang.String[0];
        java.lang.String[] strArr2 = new java.lang.String[2];
        if (v) {
            strArr2[0] = "Görüntülü arama";
            strArr2[1] = "Video call";
        } else {
            strArr2[0] = "Sesli arama";
            strArr2[1] = "Voice call";
        }
        com.dogac.bin1.CarvisErisim.tikla(strArr, strArr2, 30, new java.lang.Runnable() { // from class: com.dogac.bin1.Cihaz$$ExternalSyntheticLambda13
            @Override // java.lang.Runnable
            public final void run() {
                com.dogac.bin1.CarvisErisim.tikla(new java.lang.String[]{"android:id/button1"}, new java.lang.String[]{"ARA", "Ara", "CALL", "Call", "Başlat"}, 8, null);
            }
        });
    }

    static java.lang.String sesKaydi(android.app.Activity a, boolean basla) {
        try {
            if (!basla) {
                if (kaydedici == null) {
                    return "Açık kayıt yok.";
                }
                try {
                    kaydedici.stop();
                } catch (java.lang.Exception e) {
                }
                kaydedici.release();
                kaydedici = null;
                if (kayitFd != null) {
                    kayitFd.close();
                }
                kayitFd = null;
                return "Kayıt kaydedildi: Kayıtlar/CARVIS/" + kayitAd;
            }
            if (kaydedici != null) {
                return "Zaten kayıt yapılıyor.";
            }
            kayitAd = "carvis-" + new java.text.SimpleDateFormat("yyyyMMdd-HHmmss", java.util.Locale.ROOT).format(new java.util.Date()) + ".m4a";
            android.content.ContentValues v = new android.content.ContentValues();
            v.put("_display_name", kayitAd);
            v.put("mime_type", "audio/mp4");
            v.put("relative_path", (android.os.Build.VERSION.SDK_INT >= 31 ? android.os.Environment.DIRECTORY_RECORDINGS : android.os.Environment.DIRECTORY_MUSIC) + "/CARVIS");
            android.net.Uri u = a.getContentResolver().insert(android.provider.MediaStore.Audio.Media.getContentUri("external_primary"), v);
            kayitFd = a.getContentResolver().openFileDescriptor(u, "w");
            kaydedici = android.os.Build.VERSION.SDK_INT >= 31 ? new android.media.MediaRecorder(a) : new android.media.MediaRecorder();
            kaydedici.setAudioSource(1);
            kaydedici.setOutputFormat(2);
            kaydedici.setAudioEncoder(3);
            kaydedici.setAudioSamplingRate(44100);
            kaydedici.setAudioEncodingBitRate(96000);
            kaydedici.setOutputFile(kayitFd.getFileDescriptor());
            kaydedici.prepare();
            kaydedici.start();
            return "Ses kaydı başladı (" + kayitAd + "). Durdurmak için: Carvis, kaydı durdur.";
        } catch (java.lang.Exception e2) {
            kaydedici = null;
            return "Kayıt başlatılamadı: " + e2.getMessage();
        }
    }

    static boolean geminiKullanilabilir() {
        return java.lang.System.currentTimeMillis() > geminiKapali && com.dogac.bin1.BuildConfig.GEMINI_KEY.length() > 10;
    }

    static boolean groqVar() {
        return com.dogac.bin1.BuildConfig.GROQ_KEY.length() > 10;
    }

    static boolean sttKullanilabilir() {
        return groqVar() || geminiKullanilabilir();
    }

    static void durumYaz(final java.lang.String t) {
        ana.post(new java.lang.Runnable() { // from class: com.dogac.bin1.Cihaz$$ExternalSyntheticLambda2
            @Override // java.lang.Runnable
            public final void run() {
                com.dogac.bin1.Cihaz.lambda$durumYaz$5(t);
            }
        });
    }

    static /* synthetic */ void lambda$durumYaz$5(java.lang.String t) {
        if (com.dogac.bin1.MainActivity.ornek != null) {
            com.dogac.bin1.MainActivity.ornek.js("carvisYerel.durumYaz && carvisYerel.durumYaz(" + com.dogac.bin1.MainActivity.jsStr(t) + ")");
        }
    }

    static void geminiDinle(final java.lang.String baglam, final com.dogac.bin1.Cihaz.Sonuc s) {
        iptal = false;
        new java.lang.Thread(new java.lang.Runnable() { // from class: com.dogac.bin1.Cihaz$$ExternalSyntheticLambda3
            @Override // java.lang.Runnable
            public final void run() {
                com.dogac.bin1.Cihaz.lambda$geminiDinle$13(com.dogac.bin1.Cihaz.Sonuc.this, baglam);
            }
        }).start();
    }

    static /* synthetic */ void lambda$geminiDinle$13(final com.dogac.bin1.Cihaz.Sonuc s, final java.lang.String baglam) {
        byte[] pcm = kaydet();
        if (iptal) {
            ana.post(new java.lang.Runnable() { // from class: com.dogac.bin1.Cihaz$$ExternalSyntheticLambda0
                @Override // java.lang.Runnable
                public final void run() {
                    com.dogac.bin1.Cihaz.Sonuc.this.hata("iptal");
                }
            });
            return;
        }
        if (pcm == null) {
            ana.post(new java.lang.Runnable() { // from class: com.dogac.bin1.Cihaz$$ExternalSyntheticLambda6
                @Override // java.lang.Runnable
                public final void run() {
                    com.dogac.bin1.Cihaz.Sonuc.this.hata("no_match");
                }
            });
            return;
        }
        durumYaz("Yazıya döküyor…");
        com.dogac.bin1.CarvisServis.mikrofonuAl();
        final byte[] w = wav(pcm);
        java.lang.String t = null;
        int hataSay = 0;
        int deneme = 0;
        if (groqVar()) {
            java.lang.String[] sonuclar = new java.lang.String[2];
            final int[] hata = {0};
            final java.lang.String[] modeller = {"whisper-large-v3", "whisper-large-v3-turbo"};
            java.lang.Thread[] is = new java.lang.Thread[2];
            int k = 0;
            for (int i = 2; k < i; i = 2) {
                final int kk = k;
                final java.lang.String[] strArr = sonuclar;
                byte[] pcm2 = pcm;
                java.lang.Thread[] is2 = is;
                is2[k] = new java.lang.Thread(new java.lang.Runnable() { // from class: com.dogac.bin1.Cihaz$$ExternalSyntheticLambda7
                    @Override // java.lang.Runnable
                    public final void run() {
                        com.dogac.bin1.Cihaz.lambda$geminiDinle$8(strArr, kk, modeller, w, baglam, hata);
                    }
                });
                is2[k].start();
                k++;
                is = is2;
                pcm = pcm2;
                sonuclar = sonuclar;
            }
            java.lang.String[] sonuclar2 = sonuclar;
            for (java.lang.Thread x : is) {
                try {
                    x.join(12000L);
                } catch (java.lang.InterruptedException e) {
                }
            }
            deneme = 0 + 2;
            hataSay = 0 + hata[0];
            java.lang.String a = sonuclar2[0];
            java.lang.String b = sonuclar2[1];
            t = (a == null || a.isEmpty()) ? b : a;
            java.lang.String alt = (a == null || a.isEmpty() || b == null || b.isEmpty() || sade(a).equals(sade(b))) ? null : b;
            if (alt != null && com.dogac.bin1.MainActivity.ornek != null) {
                com.dogac.bin1.MainActivity.ornek.js("carvisYerel.alternatifler([" + com.dogac.bin1.MainActivity.jsStr(alt) + "])");
            }
        }
        if (t == null || t.isEmpty()) {
            if (geminiKullanilabilir()) {
                java.lang.String[] strArr2 = {"gemini-3.1-flash-lite", "gemini-3-flash-preview", "gemini-3.8-flash"};
                for (int i2 = 0; i2 < 3; i2++) {
                    java.lang.String model = strArr2[i2];
                    if (iptal) {
                        break;
                    }
                    deneme++;
                    try {
                        t = yaziyaDok(model, w, baglam);
                        if (t != null && !t.isEmpty()) {
                            break;
                        }
                    } catch (java.lang.Exception e2) {
                        hataSay++;
                        android.util.Log.w("Carvis", "gemini stt " + model + ": " + e2.getMessage());
                    }
                }
            }
        }
        if (iptal) {
            ana.post(new java.lang.Runnable() { // from class: com.dogac.bin1.Cihaz$$ExternalSyntheticLambda8
                @Override // java.lang.Runnable
                public final void run() {
                    com.dogac.bin1.Cihaz.Sonuc.this.hata("iptal");
                }
            });
            return;
        }
        final java.lang.String sonuc = t;
        if (sonuc != null && !sonuc.isEmpty()) {
            android.util.Log.i("Carvis", "tanima: " + sonuc);
            durumYaz("Düşünüyor…");
            ana.post(new java.lang.Runnable() { // from class: com.dogac.bin1.Cihaz$$ExternalSyntheticLambda11
                @Override // java.lang.Runnable
                public final void run() {
                    com.dogac.bin1.Cihaz.Sonuc.this.metin(sonuc);
                }
            });
        } else if (hataSay <= 0 || hataSay < deneme) {
            ana.post(new java.lang.Runnable() { // from class: com.dogac.bin1.Cihaz$$ExternalSyntheticLambda10
                @Override // java.lang.Runnable
                public final void run() {
                    com.dogac.bin1.Cihaz.Sonuc.this.hata("anlasilmadi");
                }
            });
        } else {
            geminiKapali = java.lang.System.currentTimeMillis() + 120000;
            ana.post(new java.lang.Runnable() { // from class: com.dogac.bin1.Cihaz$$ExternalSyntheticLambda9
                @Override // java.lang.Runnable
                public final void run() {
                    com.dogac.bin1.Cihaz.Sonuc.this.hata("stt_yok");
                }
            });
        }
    }

    static /* synthetic */ void lambda$geminiDinle$8(java.lang.String[] sonuclar, int kk, java.lang.String[] modeller, byte[] w, java.lang.String baglam, int[] hata) {
        try {
            long t0 = java.lang.System.currentTimeMillis();
            sonuclar[kk] = groqYaziyaDok(modeller[kk], w, baglam);
            android.util.Log.i("Carvis", "groq " + modeller[kk] + " " + (java.lang.System.currentTimeMillis() - t0) + " ms: " + sonuclar[kk]);
        } catch (java.lang.Exception e) {
            synchronized (hata) {
                hata[0] = hata[0] + 1;
                android.util.Log.w("Carvis", "groq stt " + modeller[kk] + ": " + e.getMessage());
            }
        }
    }

    static java.lang.String sade(java.lang.String s) {
        return s == null ? "" : s.toLowerCase(new java.util.Locale("tr")).replaceAll("[^\\p{L}\\p{N} ]", "").replaceAll("\\s+", " ").trim();
    }

    static java.lang.String groqYaziyaDok(java.lang.String model, byte[] wav, java.lang.String baglam) throws java.lang.Exception {
        java.lang.String str;
        java.lang.Throwable th;
        final java.lang.String sinir = "----carvis" + java.lang.System.nanoTime();
        java.lang.StringBuilder append = new java.lang.StringBuilder().append("Tıp öğrencisi Türkçe konuşuyor; Latince terimler: processus coracoideus, planum sagittale, musculus sternocleidomastoideus, asetil-KoA, L/S oranı, glikoliz. Carvis. Komutlar: Spotify'dan şarkı patlat, şarkı aç, müzik çal, sesi aç, sesi kıs, sonraki şarkı, WhatsApp'tan mesaj at, pomodoro başlat, zamanım yok, dinle, kapat.");
        if (baglam != null && !baglam.isEmpty()) {
            str = " Konu: " + baglam;
        } else {
            str = "";
        }
        java.lang.String ipucu = append.append(str).toString();
        final java.io.ByteArrayOutputStream g = new java.io.ByteArrayOutputStream();
        java.util.function.BiConsumer<java.lang.String, java.lang.String> alan = new java.util.function.BiConsumer() { // from class: com.dogac.bin1.Cihaz$$ExternalSyntheticLambda12
            @Override // java.util.function.BiConsumer
            public final void accept(java.lang.Object obj, java.lang.Object obj2) {
                g.write(("--" + sinir + "\r\nContent-Disposition: form-data; name=\"" + ((java.lang.String) obj) + "\"\r\n\r\n" + ((java.lang.String) obj2) + "\r\n").getBytes("UTF-8"));
            }
        };
        alan.accept("model", model);
        alan.accept("language", "tr");
        alan.accept("temperature", "0");
        alan.accept("response_format", "verbose_json");
        alan.accept("prompt", ipucu.length() > 600 ? ipucu.substring(0, 600) : ipucu);
        g.write(("--" + sinir + "\r\nContent-Disposition: form-data; name=\"file\"; filename=\"ses.wav\"\r\nContent-Type: audio/wav\r\n\r\n").getBytes("UTF-8"));
        g.write(wav);
        g.write(("\r\n--" + sinir + "--\r\n").getBytes("UTF-8"));
        java.net.HttpURLConnection c = (java.net.HttpURLConnection) new java.net.URL("https://api.groq.com/openai/v1/audio/transcriptions").openConnection();
        c.setRequestMethod("POST");
        c.setConnectTimeout(6000);
        c.setReadTimeout(10000);
        c.setDoOutput(true);
        c.setRequestProperty("Content-Type", "multipart/form-data; boundary=" + sinir);
        c.setRequestProperty("Authorization", "Bearer GROQ_ANAHTARI_KALDIRILDI");
        java.io.OutputStream o = c.getOutputStream();
        try {
            o.write(g.toByteArray());
            if (o != null) {
                o.close();
            }
            int kod = c.getResponseCode();
            if (kod != 200) {
                throw new java.lang.Exception("HTTP " + kod);
            }
            java.io.InputStream i = c.getInputStream();
            try {
                java.io.ByteArrayOutputStream b = new java.io.ByteArrayOutputStream();
                byte[] t = new byte[8192];
                while (true) {
                    int k = i.read(t);
                    if (k <= 0) {
                        break;
                    }
                    try {
                        b.write(t, 0, k);
                    } catch (java.lang.Throwable th2) {
                        th = th2;
                        if (i == null) {
                            throw th;
                        }
                        try {
                            i.close();
                            throw th;
                        } catch (java.lang.Throwable th3) {
                            th.addSuppressed(th3);
                            throw th;
                        }
                    }
                }
                java.lang.String yanit = b.toString("UTF-8");
                if (i != null) {
                    i.close();
                }
                org.json.JSONObject j = new org.json.JSONObject(yanit);
                org.json.JSONArray seg = j.optJSONArray("segments");
                double ns = 0.0d;
                double lp = 0.0d;
                int n = seg != null ? seg.length() : 0;
                int i2 = 0;
                while (i2 < n) {
                    ns += seg.getJSONObject(i2).optDouble("no_speech_prob", 0.0d);
                    lp += seg.getJSONObject(i2).optDouble("avg_logprob", 0.0d);
                    i2++;
                    sinir = sinir;
                    ipucu = ipucu;
                    g = g;
                }
                java.lang.String metin = j.optString("text", "").trim();
                if (n > 0 && ns / n > 0.7d && lp / n < -0.8d) {
                    android.util.Log.i("Carvis", "whisper: konuşma yok sayıldı (" + metin + ")");
                    return "";
                }
                if (WHISPER_UYDURMA.matcher(metin).matches()) {
                    android.util.Log.i("Carvis", "whisper uydurması atıldı: " + metin);
                    return "";
                }
                return metin;
            } catch (java.lang.Throwable th4) {
                th = th4;
            }
        } finally {
        }
    }

    /* JADX WARN: Can't wrap try/catch for region: R(19:0|1|(1:3)|4|(6:367|368|369|371|372|5)|12|(1:14)(1:364)|15|(1:363)(1:19)|20|(23:(30:357|358|359|23|24|25|26|27|28|29|30|31|(1:35)|36|(1:40)|42|43|(3:44|45|(3:47|48|(2:328|329)(14:50|(4:52|53|54|55)|120|121|122|123|124|(4:126|127|128|129)|135|136|(2:321|322)(5:138|(2:145|146)|152|(5:295|296|297|298|(7:300|301|302|303|304|305|306)(2:312|313))(10:154|155|156|157|158|159|160|(7:162|163|(2:227|228)|165|(3:167|(3:169|(3:172|173|170)|174)|175)(3:223|(1:225)|226)|176|(1:182)(1:178))(6:234|235|236|(1:238)(1:281)|239|(1:243)(1:280))|179|180)|181)|314|315|181))(2:331|332))|246|247|(1:249)(1:279)|250|(1:278)(1:254)|255|(6:258|259|260|262|263|256)|266|267|268|(2:271|272)|270)|30|31|(2:33|35)|36|(2:38|40)|42|43|(4:44|45|(0)(0)|181)|246|247|(0)(0)|250|(1:252)|278|255|(1:256)|266|267|268|(0)|270|(3:(0)|(4:200|(6:204|205|206|207|208|210)|202|203)|(1:195)))|22|23|24|25|26|27|28|29) */
    /* JADX WARN: Can't wrap try/catch for region: R(23:(30:357|358|359|23|24|25|26|27|28|29|30|31|(1:35)|36|(1:40)|42|43|(3:44|45|(3:47|48|(2:328|329)(14:50|(4:52|53|54|55)|120|121|122|123|124|(4:126|127|128|129)|135|136|(2:321|322)(5:138|(2:145|146)|152|(5:295|296|297|298|(7:300|301|302|303|304|305|306)(2:312|313))(10:154|155|156|157|158|159|160|(7:162|163|(2:227|228)|165|(3:167|(3:169|(3:172|173|170)|174)|175)(3:223|(1:225)|226)|176|(1:182)(1:178))(6:234|235|236|(1:238)(1:281)|239|(1:243)(1:280))|179|180)|181)|314|315|181))(2:331|332))|246|247|(1:249)(1:279)|250|(1:278)(1:254)|255|(6:258|259|260|262|263|256)|266|267|268|(2:271|272)|270)|30|31|(2:33|35)|36|(2:38|40)|42|43|(4:44|45|(0)(0)|181)|246|247|(0)(0)|250|(1:252)|278|255|(1:256)|266|267|268|(0)|270|(3:(0)|(4:200|(6:204|205|206|207|208|210)|202|203)|(1:195))) */
    /* JADX WARN: Code restructure failed: missing block: B:184:0x033e, code lost:
    
        r1 = r38;
     */
    /* JADX WARN: Code restructure failed: missing block: B:186:0x0340, code lost:
    
        android.util.Log.i(r1, "kayıt: konuşma yok (taban " + ((int) r9) + ")");
     */
    /* JADX WARN: Code restructure failed: missing block: B:187:0x0343, code lost:
    
        r1 = r35.iterator();
     */
    /* JADX WARN: Code restructure failed: missing block: B:189:0x034b, code lost:
    
        if (r1.hasNext() == false) goto L304;
     */
    /* JADX WARN: Code restructure failed: missing block: B:190:0x034d, code lost:
    
        r21 = r1.next();
     */
    /* JADX WARN: Code restructure failed: missing block: B:192:0x0355, code lost:
    
        r21.release();
     */
    /* JADX WARN: Code restructure failed: missing block: B:199:0x035b, code lost:
    
        r41.stop();
     */
    /* JADX WARN: Code restructure failed: missing block: B:218:0x0380, code lost:
    
        r0 = e;
     */
    /* JADX WARN: Code restructure failed: missing block: B:219:0x03ed, code lost:
    
        r2 = r15;
        r18 = r41;
     */
    /* JADX WARN: Code restructure failed: missing block: B:220:0x0377, code lost:
    
        r0 = move-exception;
     */
    /* JADX WARN: Code restructure failed: missing block: B:221:0x0378, code lost:
    
        r2 = r15;
        r18 = r41;
        r1 = r0;
     */
    /* JADX WARN: Code restructure failed: missing block: B:330:0x0424, code lost:
    
        r6 = r4;
        r4 = r20;
     */
    /* JADX WARN: Code restructure failed: missing block: B:343:0x0114, code lost:
    
        r0 = move-exception;
     */
    /* JADX WARN: Code restructure failed: missing block: B:344:0x0115, code lost:
    
        android.util.Log.w(r14, "ses efekti: " + r0);
     */
    /* JADX WARN: Code restructure failed: missing block: B:345:0x0103, code lost:
    
        r0 = move-exception;
     */
    /* JADX WARN: Code restructure failed: missing block: B:346:0x0104, code lost:
    
        r18 = r1;
        r35 = r12;
        r2 = r13;
        r1 = r0;
     */
    /* JADX WARN: Code restructure failed: missing block: B:348:0x04f7, code lost:
    
        r0 = e;
     */
    /* JADX WARN: Code restructure failed: missing block: B:349:0x04f8, code lost:
    
        r35 = r12;
        r2 = r13;
        r1 = r14;
     */
    /* JADX WARN: Code restructure failed: missing block: B:350:0x04e8, code lost:
    
        r0 = move-exception;
     */
    /* JADX WARN: Code restructure failed: missing block: B:351:0x04e9, code lost:
    
        r35 = r12;
        r2 = r13;
        r1 = r0;
     */
    /* JADX WARN: Code restructure failed: missing block: B:353:0x0513, code lost:
    
        r0 = e;
     */
    /* JADX WARN: Code restructure failed: missing block: B:354:0x0514, code lost:
    
        r35 = r0;
        r1 = "Carvis";
        r2 = r13;
     */
    /* JADX WARN: Code restructure failed: missing block: B:355:0x0505, code lost:
    
        r0 = move-exception;
     */
    /* JADX WARN: Code restructure failed: missing block: B:356:0x0506, code lost:
    
        r35 = r0;
        r2 = r13;
        r1 = r0;
     */
    /* JADX WARN: Removed duplicated region for block: B:106:0x0579 A[EXC_TOP_SPLITTER, SYNTHETIC] */
    /* JADX WARN: Removed duplicated region for block: B:112:? A[SYNTHETIC] */
    /* JADX WARN: Removed duplicated region for block: B:113:0x056f A[EXC_TOP_SPLITTER, SYNTHETIC] */
    /* JADX WARN: Removed duplicated region for block: B:249:0x0453  */
    /* JADX WARN: Removed duplicated region for block: B:258:0x0479  */
    /* JADX WARN: Removed duplicated region for block: B:271:0x0490 A[EXC_TOP_SPLITTER, SYNTHETIC] */
    /* JADX WARN: Removed duplicated region for block: B:279:0x0456  */
    /* JADX WARN: Removed duplicated region for block: B:331:0x0413 A[SYNTHETIC] */
    /* JADX WARN: Removed duplicated region for block: B:47:0x015f A[Catch: all -> 0x04a5, Exception -> 0x04b4, TRY_LEAVE, TryCatch #44 {Exception -> 0x04b4, all -> 0x04a5, blocks: (B:45:0x015b, B:47:0x015f), top: B:44:0x015b }] */
    /* JADX WARN: Removed duplicated region for block: B:65:0x0530  */
    /* JADX WARN: Removed duplicated region for block: B:76:0x0549 A[EXC_TOP_SPLITTER, SYNTHETIC] */
    /* JADX WARN: Removed duplicated region for block: B:83:? A[RETURN, SYNTHETIC] */
    /* JADX WARN: Removed duplicated region for block: B:84:0x053f A[EXC_TOP_SPLITTER, SYNTHETIC] */
    /* JADX WARN: Removed duplicated region for block: B:95:0x0560  */
    /*
        Code decompiled incorrectly, please refer to instructions dump.
        To view partially-correct add '--show-bad-code' argument
    */
    static byte[] kaydet() {
        /*
            Method dump skipped, instructions count: 1411
            To view this dump add '--comments-level debug' option
        */
        throw new UnsupportedOperationException("Method not decompiled: com.dogac.bin1.Cihaz.kaydet():byte[]");
    }

    static byte[] wav(byte[] pcm) {
        int L = pcm.length;
        byte[] h = new byte[44];
        java.nio.ByteBuffer bb = java.nio.ByteBuffer.wrap(h).order(java.nio.ByteOrder.LITTLE_ENDIAN);
        bb.put("RIFF".getBytes()).putInt(L + 36).put("WAVE".getBytes()).put("fmt ".getBytes()).putInt(16).putShort((short) 1).putShort((short) 1).putInt(16000).putInt(16000 * 2).putShort((short) 2).putShort((short) 16).put("data".getBytes()).putInt(L);
        byte[] w = new byte[L + 44];
        java.lang.System.arraycopy(h, 0, w, 0, 44);
        java.lang.System.arraycopy(pcm, 0, w, 44, L);
        return w;
    }

    static java.lang.String yaziyaDok(java.lang.String model, byte[] wav, java.lang.String baglam) throws java.lang.Exception {
        java.lang.String str = "";
        java.lang.StringBuilder append = new java.lang.StringBuilder().append("Bu ses kaydı, tıp öğrencisinin Türkçe sesli asistanı Carvis'e söylediği bir cümle. Söyleneni kelimesi kelimesine yazıya dök. Latince/İngilizce tıp terimlerini doğru yazımıyla yaz (ör. planum sagittale, processus coracoideus, tuberculum majus, musculus sternocleidomastoideus, asetil-KoA, glikoliz). Kişi, uygulama ve şarkı adlarını olduğu gibi yaz. Konuşma yoksa ya da anlaşılmıyorsa hiçbir şey yazma. Yalnız söylenen metni yaz, açıklama ekleme. Kayıtta asistanın (Carvis) kendi sentetik sesinin kuyruğu da olabilir: onu YAZMA, yalnız insanın (kullanıcının) söylediğini yaz; yalnız asistan sesi varsa hiçbir şey yazma.").append(com.dogac.bin1.CarvisServis.sonKonusma.isEmpty() ? "" : " Asistanın az önce söylediği (bunu tekrar yazma): \"" + com.dogac.bin1.CarvisServis.sonKonusma.substring(0, java.lang.Math.min(300, com.dogac.bin1.CarvisServis.sonKonusma.length())) + "\"");
        if (baglam != null && !baglam.isEmpty()) {
            str = " Bağlam: " + baglam;
        }
        java.lang.String istem = append.append(str).toString();
        org.json.JSONObject govde = new org.json.JSONObject().put("contents", new org.json.JSONArray().put(new org.json.JSONObject().put("parts", new org.json.JSONArray().put(new org.json.JSONObject().put("text", istem)).put(new org.json.JSONObject().put("inline_data", new org.json.JSONObject().put("mime_type", "audio/wav").put("data", android.util.Base64.encodeToString(wav, 2))))))).put("generationConfig", new org.json.JSONObject().put("temperature", 0).put("maxOutputTokens", 400));
        java.net.HttpURLConnection c = (java.net.HttpURLConnection) new java.net.URL("https://generativelanguage.googleapis.com/v1beta/models/" + model + ":generateContent").openConnection();
        c.setRequestMethod("POST");
        c.setConnectTimeout(8000);
        c.setReadTimeout(12000);
        c.setDoOutput(true);
        c.setRequestProperty("Content-Type", "application/json");
        c.setRequestProperty("x-goog-api-key", com.dogac.bin1.BuildConfig.GEMINI_KEY);
        java.io.OutputStream o = c.getOutputStream();
        try {
            o.write(govde.toString().getBytes("UTF-8"));
            if (o != null) {
                o.close();
            }
            int kod = c.getResponseCode();
            if (kod != 200) {
                throw new java.lang.Exception("HTTP " + kod);
            }
            java.io.InputStream i = c.getInputStream();
            try {
                java.io.ByteArrayOutputStream b = new java.io.ByteArrayOutputStream();
                byte[] t = new byte[8192];
                while (true) {
                    int k = i.read(t);
                    if (k <= 0) {
                        break;
                    }
                    b.write(t, 0, k);
                }
                java.lang.String yanit = b.toString("UTF-8");
                if (i != null) {
                    i.close();
                }
                org.json.JSONArray parts = new org.json.JSONObject(yanit).getJSONArray("candidates").getJSONObject(0).getJSONObject("content").optJSONArray("parts");
                java.lang.StringBuilder s = new java.lang.StringBuilder();
                if (parts != null) {
                    for (int i2 = 0; i2 < parts.length(); i2++) {
                        org.json.JSONObject p = parts.getJSONObject(i2);
                        if (!p.optBoolean("thought")) {
                            s.append(p.optString("text"));
                        }
                    }
                }
                return s.toString().trim();
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
        } catch (java.lang.Throwable th3) {
            if (o != null) {
                try {
                    o.close();
                } catch (java.lang.Throwable th4) {
                    th3.addSuppressed(th4);
                }
            }
            throw th3;
        }
    }
}
