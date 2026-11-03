package com.dogac.bin1;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.database.Cursor;
import android.net.Uri;
import android.provider.OpenableColumns;
import android.webkit.WebResourceResponse;
import java.io.BufferedInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;
import org.json.JSONArray;
import org.json.JSONObject;

/* Yama sistemi (kullanıcı, 2026-11-03: "bundan sonraki updateleri full apk olarak değil de apk'nın üstüne at ki uygulama 400 MB'den
   büyük olabilsin; Piper falan da kuracağız").
   - Yama = .zip: kökte yama.json ({"uygulama":"carvis","ad":"…","surum":"r57","sil":["www/eski.js"]}) + www/… (web dosyaları),
     model/… (ses modelleri vb.), veri/… dizinleri. Uygulama içinden (Ayarlar → Yama yükle) seçilir, internetsiz kurulur.
   - WebView bir /assets/www/… dosyası istediğinde önce filesDir/yama/www/…'ye bakılır; varsa o verilir, yoksa APK'daki.
   - Yeni bir tam APK kurulursa (paket güncelleme zamanı değişirse) eski www yaması devre dışı kalır; model/ ve veri/ korunur. */
public class Yama {
    static final int ISTEK = 13;
    static volatile Boolean wwwGecerli = null;

    static Context bag() { MainActivity a = MainActivity.ornek; return a == null ? null : a.getApplicationContext(); }
    static File kok(Context c) { File d = new File(c.getFilesDir(), "yama"); d.mkdirs(); return d; }
    public static File modelDizini() { Context c = bag(); return c == null ? null : new File(kok(c), "model"); }

    static long apkZamani(Context c) {
        try { return c.getPackageManager().getPackageInfo(c.getPackageName(), 0).lastUpdateTime; } catch (Throwable t) { return 0; }
    }
    static String oku(File f) {
        try (InputStream in = new FileInputStream(f)) { byte[] b = new byte[(int) f.length()]; int n = 0; while (n < b.length) { int r = in.read(b, n, b.length - n); if (r < 0) break; n += r; } return new String(b, 0, n, "UTF-8"); } catch (Throwable t) { return null; }
    }
    static void yaz(File f, String s) {
        try (OutputStream o = new FileOutputStream(f)) { o.write(s.getBytes("UTF-8")); } catch (Throwable t) { }
    }
    // www yaması, kurulduğu andaki APK ile mi eşleşiyor?
    static boolean wwwGecerli(Context c) {
        Boolean g = wwwGecerli; if (g != null) return g;
        File k = kok(c), www = new File(k, "www"), z = new File(k, "apk_zamani");
        boolean ok = www.isDirectory() && !new File(k, "kapali").exists();
        if (ok) { String s = oku(z); ok = s != null && s.trim().equals(String.valueOf(apkZamani(c))); }
        if (!ok && www.isDirectory() && z.exists()) { sil(www); z.delete(); } // yeni tam APK kuruldu: eski web yaması temizlenir
        wwwGecerli = ok; return ok;
    }

    /* ---------- WebView kancası (MainActivity$1.shouldInterceptRequest başında çağrılır) ---------- */
    public static WebResourceResponse yanit(Uri u) {
        try {
            if (u == null || !"appassets.androidplatform.net".equals(u.getHost())) return null;
            String p = u.getPath(); if (p == null || !p.startsWith("/assets/www/") || p.contains("..")) return null;
            Context c = bag(); if (c == null || !wwwGecerli(c)) return null;
            File f = new File(kok(c), p.substring(8));
            if (!f.isFile()) return null;
            String ad = p.toLowerCase();
            boolean metin = ad.endsWith(".js") || ad.endsWith(".html") || ad.endsWith(".json") || ad.endsWith(".css") || ad.endsWith(".md") || ad.endsWith(".txt") || ad.endsWith(".svg");
            WebResourceResponse r = new WebResourceResponse(mime(ad), metin ? "utf-8" : null, new BufferedInputStream(new FileInputStream(f), 65536));
            java.util.HashMap<String, String> b = new java.util.HashMap<>(); b.put("Cache-Control", "no-cache"); b.put("Access-Control-Allow-Origin", "*");
            r.setResponseHeaders(b);
            return r;
        } catch (Throwable t) { return null; }
    }
    static String mime(String a) {
        if (a.endsWith(".js")) return "application/javascript";
        if (a.endsWith(".html")) return "text/html";
        if (a.endsWith(".json")) return "application/json";
        if (a.endsWith(".css")) return "text/css";
        if (a.endsWith(".jpg") || a.endsWith(".jpeg")) return "image/jpeg";
        if (a.endsWith(".png")) return "image/png";
        if (a.endsWith(".webp")) return "image/webp";
        if (a.endsWith(".svg")) return "image/svg+xml";
        if (a.endsWith(".wav")) return "audio/wav";
        if (a.endsWith(".mp3")) return "audio/mpeg";
        if (a.endsWith(".woff2")) return "font/woff2";
        if (a.endsWith(".md") || a.endsWith(".txt") || a.endsWith(".pdb") || a.endsWith(".sdf") || a.endsWith(".mol")) return "text/plain";
        return "application/octet-stream";
    }

    /* ---------- dosya seçme (Kopru.yamaSec) ve sonuç (MainActivity.onActivityResult başında) ---------- */
    public static void sec() {
        final MainActivity a = MainActivity.ornek; if (a == null) return;
        a.runOnUiThread(new Runnable() { public void run() {
            try {
                Intent i = new Intent(Intent.ACTION_OPEN_DOCUMENT); i.addCategory(Intent.CATEGORY_OPENABLE); i.setType("*/*");
                i.putExtra(Intent.EXTRA_MIME_TYPES, new String[]{"application/zip", "application/x-zip-compressed", "application/octet-stream"});
                a.startActivityForResult(i, ISTEK);
            } catch (Throwable t) { bildir(hata("Dosya seçici açılamadı: " + t.getMessage())); }
        } });
    }
    public static boolean sonuc(Activity a, int k, int s, Intent v) {
        if (k != ISTEK) return false;
        if (s != Activity.RESULT_OK || v == null || v.getData() == null) { bildir("{\"ok\":false,\"iptal\":true}"); return true; }
        final Uri u = v.getData(); long boy = -1; String ad = "";
        try (Cursor cr = a.getContentResolver().query(u, null, null, null, null)) {
            if (cr != null && cr.moveToFirst()) { int i = cr.getColumnIndex(OpenableColumns.SIZE); if (i >= 0) boy = cr.getLong(i); int j = cr.getColumnIndex(OpenableColumns.DISPLAY_NAME); if (j >= 0) ad = cr.getString(j); }
        } catch (Throwable t) { }
        final InputStream in;
        try { in = a.getContentResolver().openInputStream(u); } catch (Throwable t) { bildir(hata("Dosya açılamadı: " + t.getMessage())); return true; }
        final long boyut = boy; final String dosyaAdi = ad;
        new Thread(new Runnable() { public void run() { bildir(kur(in, boyut, dosyaAdi)); } }, "yama").start();
        return true;
    }

    static String hata(String m) { try { return new JSONObject().put("ok", false).put("hata", m).toString(); } catch (Throwable t) { return "{\"ok\":false}"; } }
    static void bildir(String json) { MainActivity a = MainActivity.ornek; if (a != null) a.js("window.carvisYama&&window.carvisYama.bitti(" + JSONObject.quote(json) + ")"); }
    static void ilerleme(long n, long top) { MainActivity a = MainActivity.ornek; if (a != null) a.js("window.carvisYama&&window.carvisYama.ilerleme(" + n + "," + top + ")"); }

    static synchronized String kur(InputStream ham, long toplam, String dosyaAdi) {
        Context c = bag(); if (c == null) return hata("Uygulama hazır değil");
        File k = kok(c), gecici = new File(c.getFilesDir(), "yama_gecici");
        sil(gecici); gecici.mkdirs();
        long okunan = 0, sonBildirim = 0; int adet = 0; String manifest = null;
        byte[] tampon = new byte[1 << 16];
        try (ZipInputStream z = new ZipInputStream(new BufferedInputStream(ham, 1 << 16))) {
            ZipEntry e;
            while ((e = z.getNextEntry()) != null) {
                String ad = e.getName().replace('\\', '/');
                if (ad.startsWith("/") || ad.contains("../") || ad.equals("..")) throw new IOException("Geçersiz yol: " + ad);
                if (e.isDirectory()) continue;
                if (ad.equals("yama.json")) { java.io.ByteArrayOutputStream b = new java.io.ByteArrayOutputStream(); int r; while ((r = z.read(tampon)) > 0) b.write(tampon, 0, r); manifest = b.toString("UTF-8"); continue; }
                if (!(ad.startsWith("www/") || ad.startsWith("model/") || ad.startsWith("veri/"))) continue;
                File f = new File(gecici, ad);
                if (!f.getCanonicalPath().startsWith(gecici.getCanonicalPath() + File.separator)) throw new IOException("Geçersiz yol: " + ad);
                f.getParentFile().mkdirs();
                try (OutputStream o = new FileOutputStream(f)) { int r; while ((r = z.read(tampon)) > 0) { o.write(tampon, 0, r); okunan += r; if (okunan - sonBildirim > (4 << 20)) { sonBildirim = okunan; ilerleme(okunan, toplam); } } }
                adet++;
            }
        } catch (Throwable t) { sil(gecici); return hata("Yama açılamadı: " + t.getMessage()); }
        try {
            if (manifest == null) { sil(gecici); return hata("Bu bir Carvis yaması değil (yama.json yok)."); }
            JSONObject m = new JSONObject(manifest);
            if (!"carvis".equals(m.optString("uygulama"))) { sil(gecici); return hata("Bu bir Carvis yaması değil."); }
            JSONArray s = m.optJSONArray("sil");
            if (s != null) for (int i = 0; i < s.length(); i++) { String p = s.optString(i); if (p.length() > 0 && !p.contains("..") && (p.startsWith("www/") || p.startsWith("model/") || p.startsWith("veri/"))) sil(new File(k, p)); }
            if (m.optBoolean("wwwTemizle", false)) sil(new File(k, "www"));
            tasi(gecici, k, gecici);
            sil(gecici);
            if (new File(k, "www").isDirectory()) yaz(new File(k, "apk_zamani"), String.valueOf(apkZamani(c)));
            new File(k, "kapali").delete();
            wwwGecerli = null;
            JSONObject kayit = new JSONObject().put("ad", m.optString("ad", dosyaAdi)).put("surum", m.optString("surum")).put("dosya", adet).put("bayt", okunan).put("t", System.currentTimeMillis());
            File pk = new File(k, "paketler.json"); JSONArray l; String eski = oku(pk); l = eski == null ? new JSONArray() : new JSONArray(eski); l.put(kayit); yaz(pk, l.toString());
            return new JSONObject().put("ok", true).put("ad", kayit.optString("ad")).put("surum", kayit.optString("surum")).put("dosya", adet).put("bayt", okunan).put("yenidenYukle", m.optBoolean("yenidenYukle", true)).toString();
        } catch (Throwable t) { sil(gecici); return hata("Yama kurulamadı: " + t.getMessage()); }
    }
    static void tasi(File d, File hedefKok, File kaynakKok) throws IOException {
        File[] l = d.listFiles(); if (l == null) return;
        for (File f : l) {
            if (f.isDirectory()) { tasi(f, hedefKok, kaynakKok); continue; }
            String rel = f.getAbsolutePath().substring(kaynakKok.getAbsolutePath().length() + 1);
            File h = new File(hedefKok, rel); h.getParentFile().mkdirs(); if (h.exists()) h.delete();
            if (!f.renameTo(h)) throw new IOException("Taşınamadı: " + rel);
        }
    }
    static void sil(File f) { if (f == null || !f.exists()) return; File[] l = f.listFiles(); if (l != null) for (File x : l) sil(x); f.delete(); }
    static long boyut(File f) { if (f.isFile()) return f.length(); long t = 0; File[] l = f.listFiles(); if (l != null) for (File x : l) t += boyut(x); return t; }

    public static String durum() {
        try {
            Context c = bag(); if (c == null) return "{}";
            File k = kok(c); String pk = oku(new File(k, "paketler.json"));
            return new JSONObject().put("paketler", pk == null ? new JSONArray() : new JSONArray(pk)).put("wwwAktif", wwwGecerli(c))
                .put("wwwBayt", boyut(new File(k, "www"))).put("modelBayt", boyut(new File(k, "model"))).put("veriBayt", boyut(new File(k, "veri"))).toString();
        } catch (Throwable t) { return "{}"; }
    }
    // hangi: "www" (web yamasını kaldır, APK'daki sürüme dön), "hepsi"
    public static void sifirla(String hangi) {
        Context c = bag(); if (c == null) return; File k = kok(c);
        if ("hepsi".equals(hangi)) { sil(k); } else { sil(new File(k, "www")); new File(k, "apk_zamani").delete(); }
        wwwGecerli = null;
    }
}
