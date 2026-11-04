package com.dogac.bin1;

import android.accessibilityservice.AccessibilityService;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.graphics.Paint;
import android.graphics.PixelFormat;
import android.graphics.RadialGradient;
import android.graphics.Shader;
import android.os.Build;
import android.os.Handler;
import android.os.Looper;
import android.util.Base64;
import android.view.Display;
import android.view.Gravity;
import android.view.HapticFeedbackConstants;
import android.view.MotionEvent;
import android.view.View;
import android.view.WindowManager;
import android.view.accessibility.AccessibilityNodeInfo;
import java.io.ByteArrayOutputStream;
import java.util.LinkedHashSet;
import org.json.JSONObject;

/* Ekran gözü (kullanıcı, 2026-11-04: "Carvis'e Gemini Live gibi ekranı okuma yetkisi"; "ekranı okuması için bir tuş olsun, ben aktive edeyim").
   - Erişilebilirlik hizmeti (CarvisErisim) açıkken, başka uygulamalarda ekranın kenarında küçük, sürüklenebilir bir Carvis noktası durur
     (TYPE_ACCESSIBILITY_OVERLAY: "üstte göster" izni gerekmez). Carvis öndeyken nokta gizlenir.
   - Noktaya DOKUNULUNCA (yalnız o an): ekrandaki yazılar (erişilebilirlik ağacı) + ekran görüntüsü (Android 11+, takeScreenshot) alınır,
     Carvis öne gelir ve JS'e window.carvisEkran() ile haber verilir. Dokunulmadıkça hiçbir şey okunmaz/kaydedilmez.
   - Uzun basınca nokta kapanır (Carvis ayarlarından yeniden açılır).
   Köprü: Kopru.ekranGozu(boolean) → "ok" | "erisim-kapali"; Kopru.ekranGozuDurum() → JSON; Kopru.ekranGozuSon() → son yakalama JSON. */
public class EkranGozu {
    static final Handler ana = new Handler(Looper.getMainLooper());
    static View nokta;
    static WindowManager.LayoutParams lp;
    static boolean acik, izliyor, yakalaniyor;
    static String son = null;

    static SharedPreferences tercih(Context c) { return c.getSharedPreferences("ekranGozu", 0); }
    static Context baglam() { return CarvisErisim.ornek != null ? CarvisErisim.ornek : MainActivity.ornek; }

    public static String ayarla(final boolean ac) {
        Context c = baglam();
        if (c != null) tercih(c).edit().putBoolean("acik", ac).apply();
        acik = ac;
        if (CarvisErisim.ornek == null) {
            if (ac) {
                final MainActivity a = MainActivity.ornek;
                if (a != null) a.runOnUiThread(new Runnable() { public void run() {
                    try { a.startActivity(new Intent(android.provider.Settings.ACTION_ACCESSIBILITY_SETTINGS).addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)); } catch (Throwable t) { }
                } });
            }
            return "erisim-kapali";
        }
        ana.post(new Runnable() { public void run() { if (acik) kur(); else kaldir(); } });
        return "ok";
    }

    public static String durum() {
        try {
            Context c = baglam();
            JSONObject o = new JSONObject();
            o.put("erisim", CarvisErisim.ornek != null);
            o.put("acik", c != null && tercih(c).getBoolean("acik", false));
            o.put("nokta", nokta != null);
            o.put("goruntu", Build.VERSION.SDK_INT >= 30);
            return o.toString();
        } catch (Throwable t) { return "{}"; }
    }

    public static String sonYakalama() { return son == null ? "" : son; }

    static int dp(Context c, int x) { return Math.round(x * c.getResources().getDisplayMetrics().density); }

    static void kur() {
        final CarvisErisim s = CarvisErisim.ornek;
        if (s == null || nokta != null) return;
        final WindowManager wm = (WindowManager) s.getSystemService(Context.WINDOW_SERVICE);
        final int boy = dp(s, 54);
        nokta = new View(s) {
            final Paint p = new Paint(Paint.ANTI_ALIAS_FLAG);
            long t0 = System.currentTimeMillis();
            @Override protected void onDraw(Canvas cv) {
                float w = getWidth(), h = getHeight(), cx = w / 2f, cy = h / 2f, r = Math.min(w, h) / 2f;
                float faz = (System.currentTimeMillis() - t0) % 2400 / 2400f, nefes = (float) (0.5 + 0.5 * Math.sin(faz * Math.PI * 2));
                p.setStyle(Paint.Style.FILL);
                p.setShader(new RadialGradient(cx, cy, r, new int[] { 0xCC5EF0DC, 0x445EF0DC, 0x00000000 }, new float[] { 0f, 0.45f, 1f }, Shader.TileMode.CLAMP));
                p.setAlpha(yakalaniyor ? 255 : (int) (150 + 90 * nefes));
                cv.drawCircle(cx, cy, r, p);
                p.setShader(null);
                p.setColor(0xE6061418); cv.drawCircle(cx, cy, r * 0.46f, p);
                p.setStyle(Paint.Style.STROKE); p.setStrokeWidth(r * 0.08f); p.setColor(0xFF9FFFF0);
                cv.drawCircle(cx, cy, r * 0.46f, p);
                p.setStrokeWidth(r * 0.05f); p.setAlpha(170);
                float a0 = faz * 360f;
                cv.drawArc(cx - r * 0.72f, cy - r * 0.72f, cx + r * 0.72f, cy + r * 0.72f, a0, 70, false, p);
                cv.drawArc(cx - r * 0.72f, cy - r * 0.72f, cx + r * 0.72f, cy + r * 0.72f, a0 + 180, 70, false, p);
                p.setStyle(Paint.Style.FILL); p.setAlpha(255); p.setColor(0xFFEFFFFC);
                cv.drawCircle(cx, cy, r * (yakalaniyor ? 0.22f : 0.13f + 0.04f * nefes), p);
                postInvalidateDelayed(40);
            }
        };
        lp = new WindowManager.LayoutParams(boy, boy, WindowManager.LayoutParams.TYPE_ACCESSIBILITY_OVERLAY,
            WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE | WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS, PixelFormat.TRANSLUCENT);
        lp.gravity = Gravity.TOP | Gravity.LEFT;
        int ew = s.getResources().getDisplayMetrics().widthPixels, eh = s.getResources().getDisplayMetrics().heightPixels;
        SharedPreferences tp = tercih(s);
        lp.x = tp.getInt("x", ew - boy - dp(s, 6)); lp.y = tp.getInt("y", (int) (eh * 0.42f));
        nokta.setContentDescription("Carvis ekran gözü");
        nokta.setOnTouchListener(new View.OnTouchListener() {
            float dx, dy; int x0, y0; boolean surukle; long bas;
            final Runnable uzun = new Runnable() { public void run() {
                if (surukle || nokta == null) return;
                nokta.performHapticFeedback(HapticFeedbackConstants.LONG_PRESS);
                ayarla(false); MainActivity a = MainActivity.ornek; if (a != null) a.js("window.carvisEkranKapandi&&window.carvisEkranKapandi()");
            } };
            public boolean onTouch(View v, MotionEvent e) {
                switch (e.getActionMasked()) {
                    case MotionEvent.ACTION_DOWN: dx = e.getRawX(); dy = e.getRawY(); x0 = lp.x; y0 = lp.y; surukle = false; bas = System.currentTimeMillis(); ana.postDelayed(uzun, 750); return true;
                    case MotionEvent.ACTION_MOVE:
                        if (!surukle && Math.hypot(e.getRawX() - dx, e.getRawY() - dy) > dp(v.getContext(), 10)) { surukle = true; ana.removeCallbacks(uzun); }
                        if (surukle) { lp.x = x0 + (int) (e.getRawX() - dx); lp.y = y0 + (int) (e.getRawY() - dy); try { wm.updateViewLayout(nokta, lp); } catch (Throwable t) { } }
                        return true;
                    case MotionEvent.ACTION_UP:
                        ana.removeCallbacks(uzun);
                        if (surukle) { tercih(v.getContext()).edit().putInt("x", lp.x).putInt("y", lp.y).apply(); }
                        else if (System.currentTimeMillis() - bas < 700) yakala();
                        return true;
                    case MotionEvent.ACTION_CANCEL: ana.removeCallbacks(uzun); return true;
                }
                return false;
            }
        });
        try { wm.addView(nokta, lp); } catch (Throwable t) { nokta = null; return; }
        if (!izliyor) { izliyor = true; ana.postDelayed(gorunurluk, 700); }
    }

    // Carvis öndeyken nokta gizli; hizmet kapanırsa nokta da kalkar
    static final Runnable gorunurluk = new Runnable() { public void run() {
        if (nokta == null) { izliyor = false; return; }
        if (CarvisErisim.ornek == null) { nokta = null; izliyor = false; return; }
        MainActivity a = MainActivity.ornek;
        boolean carvisOnde = a != null && a.hasWindowFocus();
        if (!yakalaniyor) nokta.setVisibility(carvisOnde ? View.GONE : View.VISIBLE);
        ana.postDelayed(this, 700);
    } };

    static void kaldir() {
        CarvisErisim s = CarvisErisim.ornek;
        if (nokta != null && s != null) { try { ((WindowManager) s.getSystemService(Context.WINDOW_SERVICE)).removeView(nokta); } catch (Throwable t) { } }
        nokta = null;
    }

    static void yakala() {
        final CarvisErisim s = CarvisErisim.ornek;
        if (s == null || yakalaniyor) return;
        yakalaniyor = true;
        nokta.performHapticFeedback(HapticFeedbackConstants.CONTEXT_CLICK);
        // önce yazılar (nokta görünürken de alınabilir), sonra nokta gizlenip görüntü alınır
        final String[] bilgi = agac(s);
        nokta.setVisibility(View.INVISIBLE);
        ana.postDelayed(new Runnable() { public void run() {
            if (Build.VERSION.SDK_INT >= 30) {
                try {
                    s.takeScreenshot(Display.DEFAULT_DISPLAY, s.getMainExecutor(), new AccessibilityService.TakeScreenshotCallback() {
                        public void onSuccess(AccessibilityService.ScreenshotResult r) {
                            String b64 = null;
                            try {
                                Bitmap hw = Bitmap.wrapHardwareBuffer(r.getHardwareBuffer(), r.getColorSpace());
                                Bitmap b = hw.copy(Bitmap.Config.ARGB_8888, false); hw.recycle(); r.getHardwareBuffer().close();
                                int en = b.getWidth(), boy = b.getHeight(); float k = Math.min(1f, 1280f / Math.max(en, boy));
                                if (k < 1f) { Bitmap k2 = Bitmap.createScaledBitmap(b, Math.round(en * k), Math.round(boy * k), true); b.recycle(); b = k2; }
                                ByteArrayOutputStream o = new ByteArrayOutputStream(); b.compress(Bitmap.CompressFormat.JPEG, 72, o); b.recycle();
                                b64 = Base64.encodeToString(o.toByteArray(), Base64.NO_WRAP);
                            } catch (Throwable t) { }
                            bitir(s, bilgi, b64, null);
                        }
                        public void onFailure(int kod) { bitir(s, bilgi, null, "ekran görüntüsü alınamadı (" + kod + ")"); }
                    });
                } catch (Throwable t) { bitir(s, bilgi, null, String.valueOf(t.getMessage())); }
            } else bitir(s, bilgi, null, "Android 11 altı: yalnız yazılar");
        } }, 140);
    }

    static void bitir(Context s, String[] bilgi, String b64, String not) {
        try {
            JSONObject o = new JSONObject();
            o.put("paket", bilgi[0]); o.put("uygulama", bilgi[1]); o.put("metin", bilgi[2]);
            if (b64 != null) o.put("resim", b64);
            if (not != null) o.put("not", not);
            o.put("t", System.currentTimeMillis());
            son = o.toString();
        } catch (Throwable t) { }
        yakalaniyor = false;
        if (nokta != null) nokta.setVisibility(View.VISIBLE);
        try {
            Intent i = new Intent(s, MainActivity.class).addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_REORDER_TO_FRONT | Intent.FLAG_ACTIVITY_SINGLE_TOP);
            i.putExtra("ekranGozu", true);
            s.startActivity(i);
        } catch (Throwable t) { }
        ana.postDelayed(new Runnable() { public void run() { MainActivity a = MainActivity.ornek; if (a != null) a.js("window.carvisEkran&&window.carvisEkran()"); } }, 650);
    }

    // [paket, uygulama adı, ekrandaki yazılar]
    static String[] agac(CarvisErisim s) {
        String paket = "", ad = "";
        LinkedHashSet<String> l = new LinkedHashSet<String>();
        try {
            AccessibilityNodeInfo kok = s.getRootInActiveWindow();
            if (kok != null) {
                paket = String.valueOf(kok.getPackageName());
                try { ad = String.valueOf(s.getPackageManager().getApplicationLabel(s.getPackageManager().getApplicationInfo(paket, 0))); } catch (Throwable t) { ad = paket; }
                topla(kok, l, 0);
            }
        } catch (Throwable t) { }
        StringBuilder b = new StringBuilder();
        for (String x : l) { if (b.length() + x.length() > 6000) break; b.append(x).append('\n'); }
        return new String[] { paket, ad, b.toString() };
    }

    static void topla(AccessibilityNodeInfo n, LinkedHashSet<String> l, int derin) {
        if (n == null || derin > 45 || l.size() > 400) return;
        CharSequence t = n.getText(), d = n.getContentDescription();
        if (t != null && t.toString().trim().length() > 0) l.add(t.toString().trim());
        else if (d != null && d.toString().trim().length() > 1) l.add("[" + d.toString().trim() + "]");
        for (int i = 0; i < n.getChildCount(); i++) { try { topla(n.getChild(i), l, derin + 1); } catch (Throwable e) { } }
    }
}
