package com.dogac.bin1;

import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.InetSocketAddress;
import java.net.Socket;
import java.net.URI;
import java.net.URL;
import java.util.Iterator;
import java.util.Locale;
import org.json.JSONObject;

/** JS için ağ isteği (kullanıcı 2026-11-03: OmniRoute tabletin içinde, Termux'ta → http://127.0.0.1:20128).
 *  WebView'ın karışık içerik / CORS / yerel ağ kısıtlarına takılmaz. Uygulama manifesti şifresiz HTTP'yi kapattığı için
 *  http:// adresler HttpURLConnection yerine doğrudan soketle (HTTP/1.1, Connection: close, chunked çözümlü) yapılır.
 *  Sonuç: MainActivity.ornek.js("carvisYerel.httpCevap(id, durum, govde, hata)"). */
public final class YerelHttp {
    public static void istek(final String id, final String adres, final String govde, final String basliklar, final int zamanAsimiMs) {
        new Thread(new Runnable() {
            public void run() {
                int durum = 0; String cevap = ""; String hata = null;
                try {
                    String[] r = adres.toLowerCase(Locale.ROOT).startsWith("https://") ? https(adres, govde, basliklar, zamanAsimiMs) : http(adres, govde, basliklar, zamanAsimiMs);
                    durum = Integer.parseInt(r[0]); cevap = r[1];
                } catch (Throwable e) { hata = e.getClass().getSimpleName() + ": " + e.getMessage(); }
                MainActivity a = MainActivity.ornek;
                if (a != null) a.js("window.yerelHttpCevap&&window.yerelHttpCevap(" + JSONObject.quote(id) + "," + durum + "," + JSONObject.quote(cevap) + "," + (hata == null ? "null" : JSONObject.quote(hata)) + ")");
            }
        }).start();
    }

    static JSONObject baslik(String b) throws Exception { return new JSONObject(b == null || b.length() == 0 ? "{}" : b); }

    static String[] https(String adres, String govde, String basliklar, int zaman) throws Exception {
        HttpURLConnection c = (HttpURLConnection) new URL(adres).openConnection();
        c.setConnectTimeout(8000); c.setReadTimeout(zaman > 0 ? zaman : 60000);
        c.setRequestMethod(govde == null ? "GET" : "POST");
        JSONObject b = baslik(basliklar); Iterator<String> it = b.keys();
        while (it.hasNext()) { String k = it.next(); c.setRequestProperty(k, b.getString(k)); }
        if (govde != null) { byte[] v = govde.getBytes("UTF-8"); c.setDoOutput(true); c.setFixedLengthStreamingMode(v.length); OutputStream o = c.getOutputStream(); o.write(v); o.close(); }
        int d = c.getResponseCode();
        InputStream in = d >= 400 ? c.getErrorStream() : c.getInputStream();
        return new String[] { String.valueOf(d), in == null ? "" : new String(oku(in), "UTF-8") };
    }

    static String[] http(String adres, String govde, String basliklar, int zaman) throws Exception {
        URI u = new URI(adres);
        String host = u.getHost(); int port = u.getPort() > 0 ? u.getPort() : 80;
        String yol = (u.getRawPath() == null || u.getRawPath().length() == 0 ? "/" : u.getRawPath()) + (u.getRawQuery() != null ? "?" + u.getRawQuery() : "");
        byte[] v = govde == null ? new byte[0] : govde.getBytes("UTF-8");
        Socket s = new Socket();
        try {
            s.connect(new InetSocketAddress(host, port), 8000);
            s.setSoTimeout(zaman > 0 ? zaman : 60000);
            StringBuilder ist = new StringBuilder();
            ist.append(govde == null ? "GET " : "POST ").append(yol).append(" HTTP/1.1\r\n");
            ist.append("Host: ").append(host).append(port != 80 ? ":" + port : "").append("\r\n");
            ist.append("Connection: close\r\nAccept: application/json\r\nAccept-Encoding: identity\r\n");
            JSONObject b = baslik(basliklar); Iterator<String> it = b.keys();
            while (it.hasNext()) { String k = it.next(); ist.append(k).append(": ").append(b.getString(k)).append("\r\n"); }
            if (govde != null) ist.append("Content-Length: ").append(v.length).append("\r\n");
            ist.append("\r\n");
            OutputStream o = s.getOutputStream(); o.write(ist.toString().getBytes("UTF-8")); o.write(v); o.flush();
            byte[] tum = oku(s.getInputStream());
            int ayrac = -1;
            for (int i = 0; i + 3 < tum.length; i++) if (tum[i] == 13 && tum[i + 1] == 10 && tum[i + 2] == 13 && tum[i + 3] == 10) { ayrac = i; break; }
            if (ayrac < 0) throw new Exception("geçersiz HTTP cevabı");
            String bas = new String(tum, 0, ayrac, "ISO-8859-1");
            String[] satirlar = bas.split("\r\n");
            int d = Integer.parseInt(satirlar[0].split(" ")[1]);
            boolean parcali = bas.toLowerCase(Locale.ROOT).contains("transfer-encoding: chunked");
            byte[] gov = java.util.Arrays.copyOfRange(tum, ayrac + 4, tum.length);
            if (parcali) gov = parcaCoz(gov);
            return new String[] { String.valueOf(d), new String(gov, "UTF-8") };
        } finally { try { s.close(); } catch (Exception e) { } }
    }

    static byte[] parcaCoz(byte[] b) throws Exception {
        ByteArrayOutputStream o = new ByteArrayOutputStream(); int i = 0;
        while (i < b.length) {
            int sat = i; while (sat + 1 < b.length && !(b[sat] == 13 && b[sat + 1] == 10)) sat++;
            String boy = new String(b, i, sat - i, "ISO-8859-1").trim(); int nokta = boy.indexOf(';'); if (nokta >= 0) boy = boy.substring(0, nokta);
            if (boy.length() == 0) break;
            int n = Integer.parseInt(boy, 16); if (n == 0) break;
            int bas = sat + 2; if (bas + n > b.length) n = b.length - bas;
            o.write(b, bas, n); i = bas + n + 2;
        }
        return o.toByteArray();
    }

    static byte[] oku(InputStream in) throws Exception {
        ByteArrayOutputStream o = new ByteArrayOutputStream(); byte[] t = new byte[16384]; int n;
        while ((n = in.read(t)) > 0) o.write(t, 0, n);
        in.close(); return o.toByteArray();
    }
}
