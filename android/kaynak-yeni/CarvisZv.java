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
    static volatile int nesil; // her konus/sus çağrısında artar; eski üretim/çalma kendini durdurur
    static volatile AudioTrack calan;
    static final Object yaziKilit = new Object();
    static Thread isci; static final LinkedBlockingQueue<Object[]> kuyruk = new LinkedBlockingQueue<Object[]>();

    static Context bag() { MainActivity a = MainActivity.ornek; return a == null ? null : a.getApplicationContext(); }
    static File dizin(Context c) { File d = new File(c.getFilesDir(), "zv"); d.mkdirs(); return d; }
    static File model(Context c) { return new File(dizin(c), "fm_decoder_int8.onnx"); }

    public static String durum() {
        JSONObject o = new JSONObject();
        try {
            Context c = bag();
            boolean var = c != null && model(c).length() == MODEL_BOYUT;
            boolean ornek = false;
            if (c != null) try { String[] l = c.getAssets().list("zv"); for (String s : l) if (s.equals("ornek.wav")) ornek = true; } catch (Exception e) { }
            o.put("model", var); o.put("ornek", ornek); o.put("hazir", tts != null); o.put("indiriliyor", indiriliyor); o.put("yuzde", yuzde); o.put("hata", hata);
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
            File d = dizin(c);
            if (model(c).length() != MODEL_BOYUT) throw new Exception("model indirilmedi");
            File surum = new File(d, "varliklar.surum"); String sv = "4";
            boolean guncel = false; try { FileInputStream f = new FileInputStream(surum); byte[] b = new byte[8]; int n = f.read(b); f.close(); guncel = n > 0 && new String(b, 0, n).equals(sv); } catch (Exception e) { }
            AssetManager am = c.getAssets();
            if (!guncel) {
                for (String s : am.list("zv")) kopyala(am, "zv/" + s, new File(d, s));
                FileOutputStream f = new FileOutputStream(surum); f.write(sv.getBytes()); f.close();
            }
            OfflineTtsConfig k = new OfflineTtsConfig();
            k.model.zipvoice.tokens = new File(d, "tokens.txt").getPath();
            k.model.zipvoice.encoder = new File(d, "text_encoder_int8.onnx").getPath();
            k.model.zipvoice.decoder = model(c).getPath();
            k.model.zipvoice.vocoder = new File(d, "vocos_24khz.onnx").getPath();
            k.model.zipvoice.dataDir = new File(d, "espeak-ng-data").getPath();
            k.model.zipvoice.lexicon = new File(d, "lexicon.txt").getPath();
            k.model.numThreads = Math.max(2, Math.min(4, Runtime.getRuntime().availableProcessors() / 2));
            ornekSesOku(new File(d, "ornek.wav"));
            FileInputStream f = new FileInputStream(new File(d, "ornek.txt")); byte[] b = new byte[(int) new File(d, "ornek.txt").length()]; int n = f.read(b); f.close();
            ornekMetin = new String(b, 0, Math.max(0, n), "UTF-8").trim();
            tts = new OfflineTts(k);
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
        return o;
    }

    /** id: JS'in bekleme anahtarı; hiz 0.5–2; efekt 0–1 (Jarvis cilası). */
    public static void konus(final String id, final String metin, final float hiz, final float efekt) {
        final int benim = ++nesil;
        durdurCalan();
        new Thread(new Runnable() { public void run() {
            String hataMetni = null;
            try {
                Context c = bag(); if (c == null) throw new Exception("uygulama kapalı");
                yukle(c);
                final ArrayList<String> l = cumleler(metin);
                final LinkedBlockingQueue<Object> hazir = new LinkedBlockingQueue<Object>();
                final Object BITTI = new Object();
                Thread uret = new Thread(new Runnable() { public void run() {
                    try {
                        for (String s : l) {
                            if (benim != nesil) break;
                            GenerationConfig g = new GenerationConfig();
                            g.speed = hiz <= 0 ? 1f : hiz; g.numSteps = 4; g.referenceAudio = ornekSes; g.referenceSampleRate = ornekSr; g.referenceText = ornekMetin;
                            GeneratedAudio a;
                            synchronized (kilit) { a = tts.generateWithConfig(s, g); }
                            hazir.put(new Object[] { a.samples, a.sampleRate });
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
            MainActivity a = MainActivity.ornek;
            if (a != null) a.js("window.zvBitti&&window.zvBitti(" + JSONObject.quote(id) + "," + (hataMetni == null ? "null" : JSONObject.quote(hataMetni)) + ")");
        } }).start();
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
            .setAudioAttributes(new AudioAttributes.Builder().setUsage(AudioAttributes.USAGE_ASSISTANT).setContentType(AudioAttributes.CONTENT_TYPE_SPEECH).build())
            .setAudioFormat(new AudioFormat.Builder().setSampleRate(sr).setEncoding(AudioFormat.ENCODING_PCM_FLOAT).setChannelMask(AudioFormat.CHANNEL_OUT_MONO).build())
            .setBufferSizeInBytes(Math.max(min, sr)).setTransferMode(AudioTrack.MODE_STREAM).build();
        synchronized (yaziKilit) { calan = t; }
        try {
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
