package com.dogac.bin1;

/* loaded from: classes3.dex */
public class CarvisErisim extends android.accessibilityservice.AccessibilityService {
    static com.dogac.bin1.CarvisErisim ornek;
    static boolean paylasModu;
    static final android.os.Handler ana = new android.os.Handler(android.os.Looper.getMainLooper());
    static final java.lang.String[] ENGEL_IDLER = {"com.whatsapp:id/ephemeral_nux_ok", "com.whatsapp:id/nux_ok", "com.whatsapp:id/ok_button"};

    @Override // android.accessibilityservice.AccessibilityService
    protected void onServiceConnected() {
        ornek = this;
        android.util.Log.i("Carvis", "erişilebilirlik bağlandı");
        ana.postDelayed(new java.lang.Runnable() { // from class: com.dogac.bin1.CarvisErisim$$ExternalSyntheticLambda4
            @Override // java.lang.Runnable
            public final void run() {
                com.dogac.bin1.CarvisErisim.this.lambda$onServiceConnected$0();
            }
        }, 1500L);
    }

    /* JADX INFO: Access modifiers changed from: private */
    public /* synthetic */ void lambda$onServiceConnected$0() {
        com.dogac.bin1.CarvisServis.baslatIstegi(this);
    }

    @Override // android.app.Service
    public boolean onUnbind(android.content.Intent i) {
        ornek = null;
        return super.onUnbind(i);
    }

    @Override // android.accessibilityservice.AccessibilityService
    public void onAccessibilityEvent(android.view.accessibility.AccessibilityEvent e) {
    }

    @Override // android.accessibilityservice.AccessibilityService
    public void onInterrupt() {
    }

    static boolean aktif() {
        return ornek != null;
    }

    static void tikla(final java.lang.String[] idler, final java.lang.String[] metinler, final int deneme, final java.lang.Runnable sonra) {
        ana.postDelayed(new java.lang.Runnable() { // from class: com.dogac.bin1.CarvisErisim$$ExternalSyntheticLambda3
            @Override // java.lang.Runnable
            public final void run() {
                com.dogac.bin1.CarvisErisim.lambda$tikla$1(idler, metinler, sonra, deneme);
            }
        }, 400L);
    }

    static /* synthetic */ void lambda$tikla$1(java.lang.String[] idler, java.lang.String[] metinler, java.lang.Runnable sonra, int deneme) {
        com.dogac.bin1.CarvisErisim s = ornek;
        if (s == null) {
            return;
        }
        if (s.bulTikla(idler, metinler)) {
            android.util.Log.i("Carvis", "tıklandı: " + java.lang.String.join("/", metinler));
            if (sonra != null) {
                ana.postDelayed(sonra, 900L);
                return;
            }
            return;
        }
        if (deneme <= 1) {
            android.util.Log.w("Carvis", "bulunamadı: " + java.lang.String.join("/", metinler));
        } else {
            tikla(idler, metinler, deneme - 1, sonra);
        }
    }

    boolean bulTikla(java.lang.String[] idler, java.lang.String[] metinler) {
        android.view.accessibility.AccessibilityNodeInfo kok = getRootInActiveWindow();
        if (kok == null) {
            return false;
        }
        for (java.lang.String id : ENGEL_IDLER) {
            java.util.Iterator<android.view.accessibility.AccessibilityNodeInfo> it = kok.findAccessibilityNodeInfosByViewId(id).iterator();
            while (it.hasNext()) {
                if (tiklaDugum(it.next())) {
                    android.util.Log.i("Carvis", "engel pencere kapatıldı: " + id);
                    return false;
                }
            }
        }
        for (java.lang.String str : idler) {
            java.util.List<android.view.accessibility.AccessibilityNodeInfo> l = kok.findAccessibilityNodeInfosByViewId(str);
            java.util.Iterator<android.view.accessibility.AccessibilityNodeInfo> it2 = l.iterator();
            while (it2.hasNext()) {
                if (tiklaDugum(it2.next())) {
                    return true;
                }
            }
        }
        for (java.lang.String m : metinler) {
            java.util.List<android.view.accessibility.AccessibilityNodeInfo> l2 = kok.findAccessibilityNodeInfosByText(m);
            for (android.view.accessibility.AccessibilityNodeInfo n : l2) {
                java.lang.CharSequence t = n.getText() != null ? n.getText() : n.getContentDescription();
                if (t != null && t.toString().trim().equalsIgnoreCase(m) && tiklaDugum(n)) {
                    return true;
                }
            }
        }
        return false;
    }

    static void spotifyIlkSarki(final int deneme) {
        ana.postDelayed(new java.lang.Runnable() { // from class: com.dogac.bin1.CarvisErisim$$ExternalSyntheticLambda1
            @Override // java.lang.Runnable
            public final void run() {
                com.dogac.bin1.CarvisErisim.lambda$spotifyIlkSarki$2(deneme);
            }
        }, 400L);
    }

    static /* synthetic */ void lambda$spotifyIlkSarki$2(int deneme) {
        com.dogac.bin1.CarvisErisim s = ornek;
        if (s == null) {
            return;
        }
        android.view.accessibility.AccessibilityNodeInfo kok = s.getRootInActiveWindow();
        boolean oldu = false;
        if (kok != null) {
            if ("com.spotify.music".contentEquals(kok.getPackageName() == null ? "" : kok.getPackageName())) {
                java.util.List<android.view.accessibility.AccessibilityNodeInfo> satirlar = kok.findAccessibilityNodeInfosByViewId("com.spotify.music:id/row_root");
                android.view.accessibility.AccessibilityNodeInfo ilk = null;
                for (android.view.accessibility.AccessibilityNodeInfo r : satirlar) {
                    java.util.List<android.view.accessibility.AccessibilityNodeInfo> alt = r.findAccessibilityNodeInfosByViewId("com.spotify.music:id/subtitle");
                    java.lang.String a = (alt.isEmpty() || alt.get(0).getText() == null) ? "" : alt.get(0).getText().toString();
                    if (a.startsWith("Şarkı") || a.startsWith("Song")) {
                        ilk = r;
                        break;
                    }
                }
                if (ilk == null && !satirlar.isEmpty()) {
                    android.view.accessibility.AccessibilityNodeInfo ilk2 = satirlar.get(0);
                    ilk = ilk2;
                }
                if (ilk != null) {
                    oldu = tiklaDugum(ilk);
                }
            }
        }
        if (oldu) {
            android.util.Log.i("Carvis", "spotify: ilk şarkıya dokunuldu");
        } else if (deneme <= 1) {
            android.util.Log.w("Carvis", "spotify: sonuç satırı bulunamadı");
        } else {
            spotifyIlkSarki(deneme - 1);
        }
    }

    static java.lang.String sade(java.lang.CharSequence s) {
        return s == null ? "" : s.toString().replaceAll("\\p{Cf}", "").trim().toLowerCase(new java.util.Locale("tr")).replace((char) 305, 'i').replaceAll("\\s+", " ");
    }

    static boolean paylasimEkrani(android.view.accessibility.AccessibilityNodeInfo kok) {
        java.lang.String[] strArr = {"Gönder…", "Gönder...", "Send to…", "Send to...", "seçildi", "selected"};
        for (int i = 0; i < 6; i++) {
            java.lang.String m = strArr[i];
            for (android.view.accessibility.AccessibilityNodeInfo n : kok.findAccessibilityNodeInfosByText(m)) {
                java.lang.CharSequence t = n.getText();
                if (t != null) {
                    java.lang.String s = t.toString().replaceAll("\\p{Cf}", "").trim();
                    if ((s.startsWith("Gönder") && s.length() <= 10) || ((s.startsWith("Send to") && s.length() <= 10) || s.matches("\\d+ kişi seçildi") || s.matches("\\d+ selected"))) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    static void paylasimGonder(final java.lang.String paket, final int deneme) {
        ana.postDelayed(new java.lang.Runnable() { // from class: com.dogac.bin1.CarvisErisim$$ExternalSyntheticLambda2
            @Override // java.lang.Runnable
            public final void run() {
                com.dogac.bin1.CarvisErisim.lambda$paylasimGonder$3(paket, deneme);
            }
        }, 500L);
    }

    static /* synthetic */ void lambda$paylasimGonder$3(java.lang.String paket, int deneme) {
        com.dogac.bin1.CarvisErisim s = ornek;
        if (s == null) {
            return;
        }
        android.view.accessibility.AccessibilityNodeInfo kok = s.paketKoku(paket);
        boolean secili = false;
        if (kok != null) {
            for (android.view.accessibility.AccessibilityNodeInfo n : kok.findAccessibilityNodeInfosByText("seçildi")) {
                if (n.getText() != null && n.getText().toString().replaceAll("\\p{Cf}", "").trim().equals("1 kişi seçildi")) {
                    secili = true;
                }
            }
        }
        if (kok != null && !secili) {
            for (android.view.accessibility.AccessibilityNodeInfo n2 : kok.findAccessibilityNodeInfosByText("selected")) {
                if (n2.getText() != null && n2.getText().toString().replaceAll("\\p{Cf}", "").trim().equals("1 selected")) {
                    secili = true;
                }
            }
        }
        if (secili) {
            java.util.Iterator<android.view.accessibility.AccessibilityNodeInfo> it = kok.findAccessibilityNodeInfosByViewId(paket + ":id/send").iterator();
            while (it.hasNext()) {
                if (tiklaDugum(it.next())) {
                    android.util.Log.i("Carvis", "whatsapp: paylaşımdan gönderildi");
                    return;
                }
            }
            for (android.view.accessibility.AccessibilityNodeInfo n3 : kok.findAccessibilityNodeInfosByText("Gönder")) {
                java.lang.CharSequence d = n3.getContentDescription();
                if (d != null && d.toString().trim().equals("Gönder") && tiklaDugum(n3)) {
                    android.util.Log.i("Carvis", "whatsapp: paylaşımdan gönderildi");
                    return;
                }
            }
        }
        if (deneme <= 1) {
            android.util.Log.w("Carvis", "whatsapp: paylaşım gönder düğmesi bulunamadı (gönderilmedi)");
        } else {
            paylasimGonder(paket, deneme - 1);
        }
    }

    static void adlaSec(final java.lang.String paket, final java.lang.String ad, final int deneme, final java.lang.Runnable sonra) {
        ana.postDelayed(new java.lang.Runnable() { // from class: com.dogac.bin1.CarvisErisim$$ExternalSyntheticLambda0
            @Override // java.lang.Runnable
            public final void run() {
                com.dogac.bin1.CarvisErisim.lambda$adlaSec$4(paket, ad, sonra, deneme);
            }
        }, 450L);
    }

    static /* synthetic */ void lambda$adlaSec$4(java.lang.String paket, java.lang.String ad, java.lang.Runnable sonra, int deneme) {
        com.dogac.bin1.CarvisErisim s = ornek;
        if (s == null) {
            return;
        }
        java.lang.String sonuc = s.adlaSecAdim(paket, ad);
        if ("tamam".equals(sonuc)) {
            android.util.Log.i("Carvis", "whatsapp: kişi seçildi: " + ad);
            if (sonra != null) {
                ana.postDelayed(sonra, 900L);
                return;
            }
            return;
        }
        if (deneme <= 1) {
            android.util.Log.w("Carvis", "whatsapp: kişi bulunamadı: " + ad);
        } else {
            adlaSec(paket, ad, deneme - 1, sonra);
        }
    }

    java.lang.String adlaSecAdim(java.lang.String paket, java.lang.String ad) {
        android.view.accessibility.AccessibilityNodeInfo kok = paketKoku(paket);
        if (kok == null) {
            android.view.accessibility.AccessibilityNodeInfo e = getRootInActiveWindow();
            android.util.Log.i("Carvis", "adlaSec: whatsapp penceresi yok, etkin=" + ((java.lang.Object) (e == null ? "null" : e.getPackageName())));
            return "bekle";
        }
        for (java.lang.String str : ENGEL_IDLER) {
            java.util.Iterator<android.view.accessibility.AccessibilityNodeInfo> it = kok.findAccessibilityNodeInfosByViewId(str).iterator();
            while (it.hasNext()) {
                if (tiklaDugum(it.next())) {
                    return "bekle";
                }
            }
        }
        boolean paylas = paylasimEkrani(kok);
        if (paylasModu && !paylas) {
            android.util.Log.i("Carvis", "adlaSec: paylaşım ekranı bekleniyor");
            return "bekle";
        }
        java.lang.String hedef = sade(ad);
        android.view.accessibility.AccessibilityNodeInfo yedek = null;
        java.util.List<android.view.accessibility.AccessibilityNodeInfo> bulunan = kok.findAccessibilityNodeInfosByText(ad);
        android.util.Log.i("Carvis", "adlaSec: '" + ad + "' eşleşme=" + bulunan.size() + (paylas ? " (paylaşım)" : ""));
        for (android.view.accessibility.AccessibilityNodeInfo n : bulunan) {
            java.lang.String id = n.getViewIdResourceName() == null ? "" : n.getViewIdResourceName();
            android.util.Log.i("Carvis", "adlaSec aday: id=" + id + " metin=[" + ((java.lang.Object) n.getText()) + "] eşit=" + hedef.equals(sade(n.getText())));
            if (!n.isEditable() && hedef.equals(sade(n.getText())) && !id.contains("conversation_contact_name") && (!paylasModu || !id.contains("conversations_row"))) {
                if (id.contains("contact_name") || id.contains("contactpicker") || id.endsWith(":id/name")) {
                    return tiklaDugum(n) ? "tamam" : "bekle";
                }
                if (yedek == null) {
                    yedek = n;
                }
            }
        }
        if (yedek != null) {
            return tiklaDugum(yedek) ? "tamam" : "bekle";
        }
        android.view.accessibility.AccessibilityNodeInfo kutu = duzenlenebilir(kok);
        if (kutu != null) {
            if (!hedef.equals(sade(kutu.getText()))) {
                android.os.Bundle b = new android.os.Bundle();
                b.putCharSequence(androidx.core.view.accessibility.AccessibilityNodeInfoCompat.ACTION_ARGUMENT_SET_TEXT_CHARSEQUENCE, ad);
                kutu.performAction(2097152, b);
            }
            return "bekle";
        }
        java.lang.String[] strArr = {paket + ":id/menuitem_search", paket + ":id/search_bar_inner_layout", paket + ":id/my_search_bar"};
        for (int i = 0; i < 3; i++) {
            java.util.Iterator<android.view.accessibility.AccessibilityNodeInfo> it2 = kok.findAccessibilityNodeInfosByViewId(strArr[i]).iterator();
            while (it2.hasNext()) {
                if (tiklaDugum(it2.next())) {
                    return "bekle";
                }
            }
        }
        bulTikla(new java.lang.String[0], new java.lang.String[]{"Ara", "Search"});
        return "bekle";
    }

    android.view.accessibility.AccessibilityNodeInfo paketKoku(java.lang.String paket) {
        android.view.accessibility.AccessibilityNodeInfo e = getRootInActiveWindow();
        if (e != null && e.getPackageName() != null && paket.contentEquals(e.getPackageName())) {
            return e;
        }
        try {
            for (android.view.accessibility.AccessibilityWindowInfo w : getWindows()) {
                android.view.accessibility.AccessibilityNodeInfo r = w.getRoot();
                if (r != null && r.getPackageName() != null && paket.contentEquals(r.getPackageName())) {
                    return r;
                }
            }
            return null;
        } catch (java.lang.Exception x) {
            android.util.Log.w("Carvis", "pencereler", x);
            return null;
        }
    }

    static android.view.accessibility.AccessibilityNodeInfo duzenlenebilir(android.view.accessibility.AccessibilityNodeInfo n) {
        if (n == null) {
            return null;
        }
        if (n.isEditable() && n.isVisibleToUser()) {
            java.lang.String id = n.getViewIdResourceName() == null ? "" : n.getViewIdResourceName();
            if (id.contains("search")) {
                return n;
            }
        }
        for (int i = 0; i < n.getChildCount(); i++) {
            android.view.accessibility.AccessibilityNodeInfo x = duzenlenebilir(n.getChild(i));
            if (x != null) {
                return x;
            }
        }
        return null;
    }

    static boolean tiklaDugum(android.view.accessibility.AccessibilityNodeInfo n) {
        for (android.view.accessibility.AccessibilityNodeInfo x = n; x != null; x = x.getParent()) {
            if (x.isClickable() && x.isEnabled()) {
                return x.performAction(16);
            }
        }
        android.view.accessibility.AccessibilityNodeInfo x2 = n;
        for (int k = 0; x2 != null && k < 6; k++) {
            if (x2.isEnabled() && x2.getActionList().contains(android.view.accessibility.AccessibilityNodeInfo.AccessibilityAction.ACTION_CLICK) && x2.performAction(16)) {
                return true;
            }
            x2 = x2.getParent();
        }
        return dokun(n);
    }

    static boolean dokun(android.view.accessibility.AccessibilityNodeInfo n) {
        com.dogac.bin1.CarvisErisim s = ornek;
        if (s == null || n == null) {
            return false;
        }
        android.graphics.Rect r = new android.graphics.Rect();
        n.getBoundsInScreen(r);
        android.util.DisplayMetrics dm = s.getResources().getDisplayMetrics();
        android.graphics.Rect ekran = new android.graphics.Rect(0, 0, dm.widthPixels, dm.heightPixels);
        if (r.isEmpty() || !n.isVisibleToUser() || !ekran.contains(r)) {
            android.util.Log.i("Carvis", "dokunma bekliyor (ekran dışı) " + r.toShortString());
            return false;
        }
        android.graphics.Path p = new android.graphics.Path();
        p.moveTo(r.exactCenterX(), r.exactCenterY());
        android.accessibilityservice.GestureDescription g = new android.accessibilityservice.GestureDescription.Builder().addStroke(new android.accessibilityservice.GestureDescription.StrokeDescription(p, 0L, 60L)).build();
        boolean ok = s.dispatchGesture(g, null, null);
        android.util.Log.i("Carvis", "dokunma hareketi " + r.toShortString() + " → " + ok);
        return ok;
    }
}
