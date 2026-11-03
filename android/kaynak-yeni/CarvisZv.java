package com.dogac.bin1;

import android.content.Context;
import android.content.res.AssetManager;
import android.media.AudioAttributes;
import android.media.AudioFormat;
import android.media.AudioTrack;
import com.k2fsa.sherpa.onnx.GeneratedAudio;
import com.k2fsa.sherpa.onnx.GenerationConfig;
import com.k2fsa.sherpa.onnx.OfflineTts;
import com.k2fsa.sherpa.onnx.OfflineTtsConfig;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.ArrayList;
import java.util.concurrent.LinkedBlockingQueue;
import org.json.JSONObject;

/** Carvis'in kendi sesi: ZipVoice (sherpa-onnx, internetsiz). Ses örneği APK'da (assets/zv/ornek.wav + ornek.txt),
 *  büyük akış modeli (fm_decoder_int8.onnx, ~125 MB) ilk açılışta Hugging Face'ten (k2-fsa/ZipVoice, Apache-2.0) indirilir.
 *  Metin cümlelere bölünür; bir cümle çalarken sonraki üretilir. Bitince window.zvBitti(id, hata) çağrılır. */
public final class CarvisZv {
    static final String MODEL_URL = "https://huggingface.co/k2-fsa/ZipVoice/resolve/main/zipvoice_distill/fm_decoder_int8.onnx";
    static final long MODEL_BOYUT = 124657100L;
    static final Object kilit = new Object();
    static OfflineTts tts;
    static float[] ornekSes; static int ornekSr; static String ornekMetin;
    static volatile boolean indiriliyor; static volatile int yuzde; static volatile String hata = "";
    static volatile float perdeYt = 0f, basDb = 0f, parlakDb = 0f; static volatile int adim = 8;
    public static void ayar(float perde, float bas, float parlak, int adimSayisi) { perdeYt = perde; basDb = bas; parlakDb = parlak; adim = Math.max(4, Math.min(12, adimSayisi)); }
    static volatile int nesil;
    static volatile String asama = "boşta"; static volatile long yuklemeMs = -1, sonUretimMs = -1, sonSesMs = -1, sonCalmaBas = 0; static volatile int calinan = 0; // her konus/sus çağrısında artar; eski üretim/çalma kendini durdurur
    static volatile AudioTrack calan;
    static final Object yaziKilit = new Object();
    static Thread isci; static final LinkedBlockingQueue<Object[]> kuyruk = new LinkedBlockingQueue<Object[]>();

    /** Yerel (native) çağrıdan önce aşamayı diske yazar; uygulama çökerse bir sonraki açılışta görünür ve motor kendini kapatır. */
    static void iz(Context c, String a) {
        if (a != null) asama = a;
        if (c == null) return;
        File f = new File(dizin(c), "cokus.iz");
        try { if (a == null) f.delete(); else { FileOutputStream o = new FileOutputStream(f); o.write(a.getBytes("UTF-8")); o.getFD().sync(); o.close(); } } catch (Exception e) { }
    }
    static String oncekiCokus(Context c) {
        File f = new File(dizin(c), "cokus.iz"); if (!f.exists() || tts != null || !asama.equals("boşta")) return "";
        try { FileInputStream i = new FileInputStream(f); byte[] b = new byte[200]; int n = i.read(b); i.close(); return n > 0 ? new String(b, 0, n, "UTF-8") : "?"; } catch (Exception e) { return "?"; }
    }
    public static void cokusSifirla() { Context c = bag(); if (c != null) new File(dizin(c), "cokus.iz").delete(); }
    static Context bag() { MainActivity a = MainActivity.ornek; return a == null ? null : a.getApplicationContext(); }
    static File dizin(Context c) { File d = new File(c.getFilesDir(), "zv"); d.mkdirs(); return d; }
    static File model(Context c) { return new File(dizin(c), "fm_decoder_int8.onnx"); }
    static Boolean apktaModel = null;
    static boolean apkta(Context c) {
        if (apktaModel == null) { boolean v = false; try { for (String s : c.getAssets().list("zv")) if (s.equals("fm_decoder_int8.onnx")) v = true; } catch (Exception e) { } apktaModel = v; }
        return apktaModel;
    }

    public static String durum() {
        JSONObject o = new JSONObject();
        try {
            Context c = bag();
            boolean var = c != null && (model(c).length() == MODEL_BOYUT || apkta(c));
            boolean ornek = false;
            if (c != null) try { String[] l = c.getAssets().list("zv"); for (String s : l) if (s.equals("ornek.wav")) ornek = true; } catch (Exception e) { }
            o.put("model", var); o.put("ornek", ornek); o.put("hazir", tts != null); o.put("indiriliyor", indiriliyor); o.put("yuzde", yuzde); o.put("hata", hata);
            o.put("asama", asama); if (c != null) o.put("cokus", oncekiCokus(c)); o.put("yuklemeMs", yuklemeMs); o.put("sonUretimMs", sonUretimMs); o.put("sonSesMs", sonSesMs); o.put("calinan", calinan);
            try { android.media.AudioManager am = (android.media.AudioManager) c.getSystemService(Context.AUDIO_SERVICE); o.put("medyaSes", am.getStreamVolume(android.media.AudioManager.STREAM_MUSIC) + "/" + am.getStreamMaxVolume(android.media.AudioManager.STREAM_MUSIC)); } catch (Exception e) { }
            o.put("abi", android.os.Build.SUPPORTED_ABIS.length > 0 ? android.os.Build.SUPPORTED_ABIS[0] : "");
        } catch (Exception e) { }
        return o.toString();
    }

    public static void indir() {
        if (indiriliyor) return;
        final Context c = bag(); if (c == null) return;
        indiriliyor = true; hata = ""; yuzde = 0;
        new Thread(new Runnable() { public void run() {
            try {
                File hedef = model(c);
                if (hedef.length() != MODEL_BOYUT) {
                    File gecici = new File(dizin(c), "fm_decoder_int8.onnx.part");
                    long bas = gecici.exists() ? gecici.length() : 0;
                    HttpURLConnection h = (HttpURLConnection) new URL(MODEL_URL).openConnection();
                    h.setInstanceFollowRedirects(true); h.setConnectTimeout(15000); h.setReadTimeout(60000);
                    if (bas > 0) h.setRequestProperty("Range", "bytes=" + bas + "-");
                    int d = h.getResponseCode();
                    if (d == 200) bas = 0; else if (d != 206) throw new Exception("HTTP " + d);
                    InputStream in = h.getInputStream(); OutputStream out = new FileOutputStream(gecici, bas > 0);
                    byte[] t = new byte[65536]; int n; long top = bas;
                    while ((n = in.read(t)) > 0) { out.write(t, 0, n); top += n; yuzde = (int) (top * 100 / MODEL_BOYUT); }
                    out.close(); in.close();
                    if (gecici.length() != MODEL_BOYUT) throw new Exception("eksik indirildi (" + gecici.length() + " bayt)");
                    if (!gecici.renameTo(hedef)) throw new Exception("dosya taşınamadı");
                }
                yuzde = 100;
                yukle(c);
            } catch (Throwable e) { hata = e.getClass().getSimpleName() + ": " + e.getMessage(); }
            indiriliyor = false;
            MainActivity a = MainActivity.ornek; if (a != null) a.js("window.zvDurum&&window.zvDurum()");
        } }).start();
    }

    static void kopyala(AssetManager am, String yol, File hedef) throws Exception {
        String[] l = am.list(yol);
        if (l != null && l.length > 0) { hedef.mkdirs(); for (String s : l) kopyala(am, yol + "/" + s, new File(hedef, s)); return; }
        InputStream in = am.open(yol); OutputStream out = new FileOutputStream(hedef);
        byte[] t = new byte[65536]; int n; while ((n = in.read(t)) > 0) out.write(t, 0, n);
        out.close(); in.close();
    }

    static void yukle(Context c) throws Exception {
        synchronized (kilit) {
            if (tts != null) return;
            long t0 = System.currentTimeMillis();
            File d = dizin(c);
            File surum = new File(d, "varliklar.surum"); String sv = "6";
            boolean guncel = false; try { FileInputStream f = new FileInputStream(surum); byte[] b = new byte[8]; int n = f.read(b); f.close(); guncel = n > 0 && new String(b, 0, n).equals(sv); } catch (Exception e) { }
            AssetManager am = c.getAssets();
            if (!guncel) {
                asama = "dosyalar kopyalanıyor";
                for (String s : am.list("zv")) { if (s.equals("fm_decoder_int8.onnx") && model(c).length() == MODEL_BOYUT) continue; kopyala(am, "zv/" + s, new File(d, s)); }
                FileOutputStream f = new FileOutputStream(surum); f.write(sv.getBytes()); f.close();
            }
            OfflineTtsConfig k = new OfflineTtsConfig();
            com.k2fsa.sherpa.onnx.OfflineTtsZipVoiceModelConfig zc = k.getModel().getZipvoice();
            zc.setTokens(new File(d, "tokens.txt").getPath());
            zc.setEncoder(new File(d, "text_encoder_int8.onnx").getPath());
            zc.setDecoder(model(c).getPath());
            zc.setVocoder(new File(d, "vocos_24khz.onnx").getPath());
            zc.setDataDir(new File(d, "espeak-ng-data").getPath());
            zc.setLexicon(new File(d, "lexicon.txt").getPath());
            k.getModel().setNumThreads(Math.max(2, Math.min(4, Runtime.getRuntime().availableProcessors() / 2)));
            ornekSesOku(new File(d, "ornek.wav"));
            FileInputStream f = new FileInputStream(new File(d, "ornek.txt")); byte[] b = new byte[(int) new File(d, "ornek.txt").length()]; int n = f.read(b); f.close();
            ornekMetin = new String(b, 0, Math.max(0, n), "UTF-8").trim();
            if (model(c).length() != MODEL_BOYUT) throw new Exception("model dosyası eksik");
            iz(c, "model yükleniyor");
            tts = new OfflineTts(null, k);
            iz(c, null);
            yuklemeMs = System.currentTimeMillis() - t0; asama = "hazır";
        }
    }

    static void ornekSesOku(File w) throws Exception {
        byte[] b = new byte[(int) w.length()]; FileInputStream f = new FileInputStream(w); int top = 0, n; while (top < b.length && (n = f.read(b, top, b.length - top)) > 0) top += n; f.close();
        int i = 12, sr = 0, kanal = 1, bit = 16, veri = -1, boy = 0;
        while (i + 8 <= b.length) {
            String ad = new String(b, i, 4, "ISO-8859-1"); int u = (b[i + 4] & 255) | (b[i + 5] & 255) << 8 | (b[i + 6] & 255) << 16 | (b[i + 7] & 255) << 24;
            if (ad.equals("fmt ")) { kanal = (b[i + 10] & 255) | (b[i + 11] & 255) << 8; sr = (b[i + 12] & 255) | (b[i + 13] & 255) << 8 | (b[i + 14] & 255) << 16 | (b[i + 15] & 255) << 24; bit = (b[i + 22] & 255) | (b[i + 23] & 255) << 8; }
            if (ad.equals("data")) { veri = i + 8; boy = Math.min(u, b.length - veri); break; }
            i += 8 + u + (u & 1);
        }
        if (veri < 0 || bit != 16 || kanal != 1) throw new Exception("ornek.wav 16 bit mono olmalı");
        float[] s = new float[boy / 2];
        for (int j = 0; j < s.length; j++) s[j] = (short) ((b[veri + 2 * j] & 255) | (b[veri + 2 * j + 1] << 8)) / 32768f;
        ornekSes = s; ornekSr = sr;
    }

    // Söylenen cümlelerin sesi diskte saklanır (en çok ~60 MB); aynı cümle bir daha anında çalar.
    static File onbellekDosya(String s) {
        Context c = bag(); if (c == null) return null;
        File d = new File(dizin(c), "onbellek"); d.mkdirs();
        String k = s.trim() + "|" + adim + "|" + ornekMetin;
        return new File(d, Integer.toHexString(k.hashCode()) + "_" + Integer.toHexString(k.length() * 31 + k.charAt(0)) + ".f32");
    }
    static float[] onbellekOku(String s) {
        try {
            File f = onbellekDosya(s); if (f == null || !f.exists()) return null;
            java.nio.ByteBuffer b = java.nio.ByteBuffer.allocate((int) f.length()); FileInputStream i = new FileInputStream(f); i.getChannel().read(b); i.close(); b.flip();
            float[] o = new float[b.remaining() / 4]; b.order(java.nio.ByteOrder.LITTLE_ENDIAN).asFloatBuffer().get(o); f.setLastModified(System.currentTimeMillis()); return o;
        } catch (Throwable e) { return null; }
    }
    static void onbellekYaz(String s, float[] o) {
        try {
            File f = onbellekDosya(s); if (f == null || o.length > 24000 * 30) return;
            java.nio.ByteBuffer b = java.nio.ByteBuffer.allocate(o.length * 4).order(java.nio.ByteOrder.LITTLE_ENDIAN); b.asFloatBuffer().put(o);
            FileOutputStream w = new FileOutputStream(f); w.write(b.array()); w.close();
            File[] l = f.getParentFile().listFiles(); long top = 0; for (File x : l) top += x.length();
            if (top > 60L * 1024 * 1024) { java.util.Arrays.sort(l, new java.util.Comparator<File>() { public int compare(File a, File b2) { return Long.compare(a.lastModified(), b2.lastModified()); } }); for (File x : l) { if (top <= 45L * 1024 * 1024) break; top -= x.length(); x.delete(); } }
        } catch (Throwable e) { }
    }

    static ArrayList<String> cumleler(String m) {
        ArrayList<String> l = new ArrayList<String>(); StringBuilder s = new StringBuilder();
        for (int i = 0; i < m.length(); i++) {
            char ch = m.charAt(i); s.append(ch);
            boolean son = (ch == '.' || ch == '!' || ch == '?' || ch == ';' || ch == '\n') && (i + 1 >= m.length() || Character.isWhitespace(m.charAt(i + 1)));
            if ((son && s.toString().trim().length() > 0) || s.length() > 220 && ch == ',') { String t = s.toString().trim(); if (t.length() > 0) l.add(t); s.setLength(0); }
        }
        String t = s.toString().trim(); if (t.length() > 0) l.add(t);
        // çok kısa parçaları bir öncekine ekle (ZipVoice tek kelimede tuhaflaşabilir)
        ArrayList<String> o = new ArrayList<String>();
        for (String x : l) { if (!o.isEmpty() && x.length() < 12) o.set(o.size() - 1, o.get(o.size() - 1) + " " + x); else o.add(x); }
        if (!o.isEmpty() && o.get(0).length() > 70) {
            String ilk = o.get(0); int v = ilk.indexOf(", ", 25);
            if (v > 0 && v < ilk.length() - 20) { o.set(0, ilk.substring(v + 2)); o.add(0, ilk.substring(0, v + 1)); }
        }
        return o;
    }

    /** id: JS'in bekleme anahtarı; hiz 0.5–2; efekt 0–1 (Jarvis cilası). */
    public static void konus(final String id, final String metin, final float hiz, final float efekt) {
        final int benim = ++nesil;
        durdurCalan();
        new Thread(new Runnable() { public void run() {
            try { android.os.Process.setThreadPriority(android.os.Process.THREAD_PRIORITY_BACKGROUND + android.os.Process.THREAD_PRIORITY_MORE_FAVORABLE * 5); } catch (Throwable e) { }
            String hataMetni = null;
            try {
                Context c = bag(); if (c == null) throw new Exception("uygulama kapalı");
                yukle(c);
                final ArrayList<String> l = cumleler(metin);
                final LinkedBlockingQueue<Object> hazir = new LinkedBlockingQueue<Object>();
                final Object BITTI = new Object();
                Thread uret = new Thread(new Runnable() { public void run() {
                    try { android.os.Process.setThreadPriority(android.os.Process.THREAD_PRIORITY_BACKGROUND + android.os.Process.THREAD_PRIORITY_MORE_FAVORABLE * 5); } catch (Throwable e) { }
                    try {
                        int sira = 0;
                        for (String s : l) {
                            if (benim != nesil) break;
                            sira++; asama = "üretiliyor " + sira + "/" + l.size();
                            long u0 = System.currentTimeMillis();
                            GenerationConfig g = new GenerationConfig();
                            final float oran = (float) Math.pow(2.0, perdeYt / 12.0);
                            g.setSpeed((hiz <= 0 ? 1f : hiz) / oran); g.setNumSteps(adim); g.setReferenceAudio(ornekSes); g.setReferenceSampleRate(ornekSr); g.setReferenceText(ornekMetin);
                            iz(bag(), "üretim " + sira);
                            float[] hazirSes = onbellekOku(s);
                            if (hazirSes != null) { iz(bag(), null); hazir.put(new Object[] { hazirSes, 24000 }); continue; }
                            GeneratedAudio a;
                            synchronized (kilit) { a = tts.generateWithConfig(s, g); }
                            iz(bag(), null);
                            sonUretimMs = System.currentTimeMillis() - u0; sonSesMs = a.getSamples().length * 1000L / Math.max(1, a.getSampleRate());
                            if (a.getSamples().length == 0) throw new Exception("motor boş ses üretti");
                            float[] son = ton(a.getSamples(), a.getSampleRate(), oran); if (a.getSampleRate() == 24000) onbellekYaz(s, son); hazir.put(new Object[] { son, a.getSampleRate() });
                        }
                    } catch (Throwable e) { try { hazir.put(e); } catch (Exception x) { } }
                    try { hazir.put(BITTI); } catch (Exception x) { }
                } });
                uret.start();
                while (true) {
                    Object o = hazir.take();
                    if (o == BITTI) break;
                    if (o instanceof Throwable) throw (Throwable) o;
                    if (benim != nesil) continue;
                    Object[] p = (Object[]) o;
                    cal(benim, cila((float[]) p[0], (Integer) p[1], efekt), (Integer) p[1]);
                }
            } catch (Throwable e) { hataMetni = e.getClass().getSimpleName() + ": " + e.getMessage(); }
            iz(bag(), null);
            asama = hataMetni == null ? "bitti" : "hata";
            if (hataMetni != null) hata = hataMetni;
            MainActivity a = MainActivity.ornek;
            if (a != null) a.js("window.zvBitti&&window.zvBitti(" + JSONObject.quote(id) + "," + (hataMetni == null ? "null" : JSONObject.quote(hataMetni)) + ")");
        } }).start();
    }

    /** Perde (yeniden örnekleme: süre konuşma hızıyla telafi edildi) + bas/parlaklık ekolayzırı (RBJ peaking biquad). */
    static float[] ton(float[] x, int sr, float oran) {
        float[] y = x;
        if (Math.abs(oran - 1f) > 0.003f) {
            int n = (int) (x.length / oran); y = new float[n];
            for (int i = 0; i < n; i++) { double p = i * (double) oran; int j = (int) p; double f = p - j; float a = x[Math.min(j, x.length - 1)], b = x[Math.min(j + 1, x.length - 1)]; y[i] = (float) (a + (b - a) * f); }
        }
        if (Math.abs(basDb) > 0.1f) y = tepe(y, sr, 180.0, 1.0, basDb);
        if (Math.abs(parlakDb) > 0.1f) y = tepe(y, sr, 3200.0, 1.2, parlakDb);
        float m = 0; for (float v : y) m = Math.max(m, Math.abs(v));
        if (m > 0.98f) { float k = 0.98f / m; for (int i = 0; i < y.length; i++) y[i] *= k; }
        return y;
    }
    static float[] tepe(float[] x, int sr, double f0, double q, double db) {
        double A = Math.pow(10, db / 40), w = 2 * Math.PI * f0 / sr, al = Math.sin(w) / (2 * q), c = Math.cos(w);
        double b0 = 1 + al * A, b1 = -2 * c, b2 = 1 - al * A, a0 = 1 + al / A, a1 = -2 * c, a2 = 1 - al / A;
        b0 /= a0; b1 /= a0; b2 /= a0; a1 /= a0; a2 /= a0;
        float[] y = new float[x.length]; double x1 = 0, x2 = 0, y1 = 0, y2 = 0;
        for (int i = 0; i < x.length; i++) { double v = b0 * x[i] + b1 * x1 + b2 * x2 - a1 * y1 - a2 * y2; x2 = x1; x1 = x[i]; y2 = y1; y1 = v; y[i] = (float) v; }
        return y;
    }

    /** Jarvis cilası: hafif presence vurgusu + yumuşak sıkıştırma + kısa yankı (iki gecikmeli kopya). efekt=0 → ham ses. */
    static float[] cila(float[] x, int sr, float efekt) {
        if (efekt <= 0.01f) return x;
        float e = Math.min(1f, efekt);
        float[] y = new float[x.length + (int) (sr * 0.09f)];
        // 1) yüksek geçiren kopya ile netlik (1. derece, ~1.8 kHz)
        float rc = 1f / (2f * (float) Math.PI * 1800f), dt = 1f / sr, al = rc / (rc + dt), hp = 0, onceki = 0;
        for (int i = 0; i < x.length; i++) { hp = al * (hp + x[i] - onceki); onceki = x[i]; y[i] = x[i] + 0.45f * e * hp; }
        // 2) yankı: 23 ms ve 61 ms
        int d1 = (int) (sr * 0.023f), d2 = (int) (sr * 0.061f);
        float[] z = new float[y.length];
        for (int i = 0; i < y.length; i++) { float v = y[i]; if (i >= d1) v += 0.22f * e * y[i - d1]; if (i >= d2) v += 0.12f * e * y[i - d2]; z[i] = v; }
        // 3) yumuşak sıkıştırma + seviye
        float tepe = 0.0001f; for (float v : z) tepe = Math.max(tepe, Math.abs(v));
        float k = 0.95f / tepe;
        for (int i = 0; i < z.length; i++) { float v = z[i] * k; z[i] = (float) Math.tanh(v * (1f + 0.8f * e)) / (float) Math.tanh(1f + 0.8f * e); }
        return z;
    }

    static void cal(int benim, float[] s, int sr) throws Exception {
        int min = AudioTrack.getMinBufferSize(sr, AudioFormat.CHANNEL_OUT_MONO, AudioFormat.ENCODING_PCM_FLOAT);
        AudioTrack t = new AudioTrack.Builder()
            .setAudioAttributes(new AudioAttributes.Builder().setUsage(AudioAttributes.USAGE_MEDIA).setContentType(AudioAttributes.CONTENT_TYPE_SPEECH).build())
            .setAudioFormat(new AudioFormat.Builder().setSampleRate(sr).setEncoding(AudioFormat.ENCODING_PCM_FLOAT).setChannelMask(AudioFormat.CHANNEL_OUT_MONO).build())
            .setBufferSizeInBytes(Math.max(min, sr)).setTransferMode(AudioTrack.MODE_STREAM).build();
        synchronized (yaziKilit) { calan = t; }
        try {
            asama = "çalıyor"; calinan++;
            t.play();
            int i = 0, adim = sr / 10;
            while (i < s.length && benim == nesil) { int n = Math.min(adim, s.length - i); int w = t.write(s, i, n, AudioTrack.WRITE_BLOCKING); if (w <= 0) break; i += w; }
            if (benim == nesil) {
                // kalan tamponun çalmasını bekle
                long bitis = System.currentTimeMillis() + 3000;
                while (benim == nesil && t.getPlaybackHeadPosition() < s.length && System.currentTimeMillis() < bitis) Thread.sleep(20);
            }
        } finally {
            synchronized (yaziKilit) { if (calan == t) calan = null; }
            try { t.stop(); } catch (Exception x) { } t.release();
        }
    }

    static void durdurCalan() { synchronized (yaziKilit) { AudioTrack t = calan; if (t != null) try { t.pause(); t.flush(); } catch (Exception e) { } } }

    public static void sus() { nesil++; durdurCalan(); }
}
