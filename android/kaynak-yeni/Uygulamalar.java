package com.dogac.bin1;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.content.pm.ResolveInfo;
import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.graphics.drawable.Drawable;
import android.util.Base64;
import java.io.ByteArrayOutputStream;
import java.util.List;
import org.json.JSONArray;
import org.json.JSONObject;

/* Carvis tabletin ana ekranı (kullanıcı, 2026-11-03: "Carvis'i direkt tabletimin UI'si yapalım"). Manifestte MainActivity'ye
   MAIN + HOME + DEFAULT eklendi; Android "varsayılan ana ekran" olarak Carvis'i seçtirir. Bu sınıf:
   - liste(): yüklü (başlatılabilir) uygulamalar, ad + paket + 72 px PNG ikon (base64), arka planda; sonuç JS'e carvisUyg.liste(json)
   - baslat(paket), anaEkranAyari() (sistem "varsayılan ana ekran" ekranı), anaEkranMi()
   - yeniNiyet(i): Carvis ana ekranken ana ekran tuşu → JS carvisEv() (Carvis'in ana sayfasına döner) */
public class Uygulamalar {
    static String onbellek = null;
    static long onbellekZaman = 0;

    static void js(String kod) { MainActivity a = MainActivity.ornek; if (a != null) a.js(kod); }

    public static void liste(final boolean zorla) {
        final MainActivity a = MainActivity.ornek; if (a == null) return;
        if (!zorla && onbellek != null && System.currentTimeMillis() - onbellekZaman < 10 * 60000) { js("window.carvisUyg&&window.carvisUyg.liste(" + JSONObject.quote(onbellek) + ")"); return; }
        new Thread(new Runnable() { public void run() {
            try {
                PackageManager pm = a.getPackageManager();
                Intent q = new Intent(Intent.ACTION_MAIN).addCategory(Intent.CATEGORY_LAUNCHER);
                List<ResolveInfo> l = pm.queryIntentActivities(q, 0);
                JSONArray dizi = new JSONArray(); String ben = a.getPackageName();
                for (ResolveInfo r : l) {
                    String paket = r.activityInfo.packageName; if (ben.equals(paket)) continue;
                    JSONObject o = new JSONObject();
                    o.put("ad", String.valueOf(r.loadLabel(pm))); o.put("paket", paket); o.put("sinif", r.activityInfo.name);
                    try { o.put("ikon", ikon(r.loadIcon(pm), 72)); } catch (Throwable t) { }
                    dizi.put(o);
                }
                onbellek = dizi.toString(); onbellekZaman = System.currentTimeMillis();
                js("window.carvisUyg&&window.carvisUyg.liste(" + JSONObject.quote(onbellek) + ")");
            } catch (Throwable t) { js("window.carvisUyg&&window.carvisUyg.hata(" + JSONObject.quote(String.valueOf(t.getMessage())) + ")"); }
        } }, "uygulamalar").start();
    }
    static String ikon(Drawable d, int boy) {
        Bitmap b = Bitmap.createBitmap(boy, boy, Bitmap.Config.ARGB_8888); Canvas c = new Canvas(b);
        d.setBounds(0, 0, boy, boy); d.draw(c);
        ByteArrayOutputStream o = new ByteArrayOutputStream(); b.compress(Bitmap.CompressFormat.PNG, 90, o); b.recycle();
        return "data:image/png;base64," + Base64.encodeToString(o.toByteArray(), Base64.NO_WRAP);
    }
    public static String baslat(String paket, String sinif) {
        MainActivity a = MainActivity.ornek; if (a == null) return "hazır değil";
        try {
            Intent i;
            if (sinif != null && sinif.length() > 0) { i = new Intent(Intent.ACTION_MAIN).addCategory(Intent.CATEGORY_LAUNCHER).setClassName(paket, sinif); }
            else { i = a.getPackageManager().getLaunchIntentForPackage(paket); if (i == null) return "açılamadı"; }
            i.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_RESET_TASK_IF_NEEDED);
            a.startActivity(i); return "ok";
        } catch (Throwable t) { return "hata: " + t.getMessage(); }
    }
    public static void anaEkranAyari() {
        final MainActivity a = MainActivity.ornek; if (a == null) return;
        a.runOnUiThread(new Runnable() { public void run() {
            try { a.startActivity(new Intent(android.provider.Settings.ACTION_HOME_SETTINGS).addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)); }
            catch (Throwable t) { try { a.startActivity(new Intent(android.provider.Settings.ACTION_SETTINGS).addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)); } catch (Throwable t2) { } }
        } });
    }
    public static boolean anaEkranMi() {
        MainActivity a = MainActivity.ornek; if (a == null) return false;
        try {
            ResolveInfo r = a.getPackageManager().resolveActivity(new Intent(Intent.ACTION_MAIN).addCategory(Intent.CATEGORY_HOME), PackageManager.MATCH_DEFAULT_ONLY);
            return r != null && r.activityInfo != null && a.getPackageName().equals(r.activityInfo.packageName);
        } catch (Throwable t) { return false; }
    }
    public static void yeniNiyet(Intent i) {
        try { if (i != null && i.hasCategory(Intent.CATEGORY_HOME)) js("window.carvisEv&&window.carvisEv()"); } catch (Throwable t) { }
    }
}
