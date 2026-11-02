package com.dogac.bin1;

import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.media.MediaMetadata;
import android.media.session.MediaController;
import android.media.session.MediaSessionManager;
import android.media.session.PlaybackState;
import android.net.Uri;
import android.os.Bundle;
import android.os.SystemClock;
import org.json.JSONObject;
import android.graphics.Rect;
import android.view.accessibility.AccessibilityNodeInfo;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Locale;

/** Spotify'ı Web API olmadan, Android medya oturumu üzerinden kontrol eder (uygulama değişmez, Premium/kota gerekmez).
 *  Bildirim erişimi (CarvisBildirim) verilmiş olmalı; Spotify en az bir kez açılmış olmalı. */
public final class SpotifyYerel {
    static final String PAKET = "com.spotify.music";

    static MediaController bul(Context c) {
        MediaSessionManager m = (MediaSessionManager) c.getSystemService(Context.MEDIA_SESSION_SERVICE);
        for (MediaController mc : m.getActiveSessions(new ComponentName(c, CarvisBildirim.class))) {
            if (PAKET.equals(mc.getPackageName())) return mc;
        }
        return null;
    }

    /** Arayıp çal: "ok" | "oturum_yok" | "izin_yok" | "hata:…" */
    public static String cal(Context c, String sorgu) {
        try {
            MediaController mc = bul(c);
            if (mc == null) return "oturum_yok";
            mc.getTransportControls().playFromSearch(sorgu, new Bundle());
            return "ok";
        } catch (SecurityException e) { return "izin_yok"; } catch (Exception e) { return "hata:" + e.getMessage(); }
    }

    /** spotify:track:… gibi bir adresi çal (Spotify destekliyorsa) */
    public static String uri(Context c, String adres) {
        try {
            MediaController mc = bul(c);
            if (mc == null) return "oturum_yok";
            mc.getTransportControls().playFromUri(Uri.parse(adres), new Bundle());
            return "ok";
        } catch (SecurityException e) { return "izin_yok"; } catch (Exception e) { return "hata:" + e.getMessage(); }
    }

    /** oynat | duraklat | sonraki | onceki */
    public static String komut(Context c, String k) {
        try {
            MediaController mc = bul(c);
            if (mc == null) return "oturum_yok";
            MediaController.TransportControls t = mc.getTransportControls();
            if ("oynat".equals(k)) t.play();
            else if ("duraklat".equals(k)) t.pause();
            else if ("sonraki".equals(k)) t.skipToNext();
            else if ("onceki".equals(k)) t.skipToPrevious();
            else return "hata:komut";
            return "ok";
        } catch (SecurityException e) { return "izin_yok"; } catch (Exception e) { return "hata:" + e.getMessage(); }
    }

    /** Şu an çalan: {"izin":true,"var":true,"calisiyor":…,"baslik":…,"sanatci":…,"konum":ms,"sure":ms,"eylemler":bitmask} */
    public static String durum(Context c) {
        JSONObject j = new JSONObject();
        try {
            MediaController mc;
            try { mc = bul(c); j.put("izin", true); } catch (SecurityException e) { j.put("izin", false); return j.toString(); }
            j.put("var", mc != null);
            if (mc == null) return j.toString();
            PlaybackState ps = mc.getPlaybackState();
            MediaMetadata md = mc.getMetadata();
            if (ps != null) {
                boolean cal = ps.getState() == PlaybackState.STATE_PLAYING;
                long konum = ps.getPosition();
                if (cal && ps.getLastPositionUpdateTime() > 0) konum += (long) ((SystemClock.elapsedRealtime() - ps.getLastPositionUpdateTime()) * ps.getPlaybackSpeed());
                j.put("calisiyor", cal); j.put("durum", ps.getState()); j.put("konum", konum); j.put("eylemler", ps.getActions());
                CharSequence hm = ps.getErrorMessage(); if (hm != null) j.put("hataMesaji", hm.toString());
                Bundle ek = ps.getExtras(); if (ek != null) { StringBuilder sb = new StringBuilder(); for (String k : ek.keySet()) { Object v = ek.get(k); sb.append(k).append("=").append(String.valueOf(v)).append("; "); } if (sb.length() > 0) j.put("ekler", sb.toString()); }
            }
            if (md != null) {
                j.put("baslik", md.getString(MediaMetadata.METADATA_KEY_TITLE));
                String s = md.getString(MediaMetadata.METADATA_KEY_ARTIST);
                j.put("sanatci", s != null ? s : md.getString(MediaMetadata.METADATA_KEY_ALBUM_ARTIST));
                j.put("album", md.getString(MediaMetadata.METADATA_KEY_ALBUM));
                j.put("sure", md.getLong(MediaMetadata.METADATA_KEY_DURATION));
                String k = md.getString(MediaMetadata.METADATA_KEY_ALBUM_ART_URI);
                if (k == null) k = md.getString(MediaMetadata.METADATA_KEY_ART_URI);
                if (k != null && k.startsWith("http")) j.put("kapak", k);
            }
        } catch (Exception e) {
            try { j.put("hata", String.valueOf(e.getMessage())); } catch (Exception ignored) { }
        }
        return j.toString();
    }

    /** Bildirim erişimi ayar ekranını aç */
    public static void bildirimIzniAc(Context c) {
        try { c.startActivity(new Intent("android.settings.ACTION_NOTIFICATION_LISTENER_SETTINGS").addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)); } catch (Exception ignored) { }
    }

    /** Spotify yüklü mü */
    public static boolean yuklu(Context c) {
        try { c.getPackageManager().getPackageInfo(PAKET, 0); return true; } catch (Exception e) { return false; }
    }

    /* ---- Liste aç + Çal'a dokun (kullanıcı r22: Spotify dışarıdan başlatılan çalmayı kabul etmiyor, elle çalma çalışıyor) ---- */
    static volatile String listeSon = "";
    static final String[] OYNAT_IDLER = { "com.spotify.music:id/button_play_and_pause", "com.spotify.music:id/play_button", "com.spotify.music:id/actionbar_play_button", "com.spotify.music:id/button_play", "com.spotify.music:id/playlist_play_button" };
    static final List<String> OYNAT_ETIKET = Arrays.asList("çal", "play", "oynat", "çalma listesini çal", "play playlist", "listeyi çal", "karışık çal", "shuffle play");

    /** spotify:playlist:… adresini Spotify'da açar, sonra listenin Çal düğmesine (erişilebilirlikle) dokunur. */
    public static String listeCal(Context c, String adres) {
        if (CarvisErisim.ornek == null) return "erisim_yok";
        try {
            c.startActivity(new Intent(Intent.ACTION_VIEW, Uri.parse(adres)).setPackage(PAKET).addFlags(Intent.FLAG_ACTIVITY_NEW_TASK));
        } catch (Exception e) { return "hata:" + e.getMessage(); }
        listeSon = "aciliyor";
        dene(36, 1600L);
        return "ok";
    }

    static volatile String dokum = "";
    public static String listeDurum() { return listeSon.equals("bulunamadi") && dokum.length() > 0 ? "bulunamadi | ekrandaki dokunulabilirler: " + dokum : listeSon; }

    /** Etiket "Çal" düğmesine mi benziyor? (kullanıcı r23: birebir "çal/play" eşleşmesi Spotify tablette tutmadı) */
    static boolean calEtiketi(String t) {
        if (t == null || t.length() == 0 || t.length() > 80) return false;
        if (t.matches(".*(duraklat|pause|ekle|add |sonraki|next|önceki|previous|indir|download|paylaş|share|karıştır|shuffle off|takip|follow|radyo|radio).*")) return false;
        if (OYNAT_ETIKET.contains(t)) return true;
        return t.matches("^(çal|play|oynat|dinle|başlat)( .*)?$") || t.matches("^.* (çal|oynat)$") || t.matches("^(çalma listesini|listeyi) (çal|oynat).*");
    }

    static void dene(final int kalan, long gecikme) {
        CarvisErisim.ana.postDelayed(new Runnable() {
            public void run() {
                String r = null;
                try { r = tikla(); } catch (Exception e) { listeSon = "hata:" + e.getMessage(); }
                if (r != null) { listeSon = "tiklandi:" + r; return; }
                if (kalan <= 1) { if (!listeSon.startsWith("hata")) listeSon = "bulunamadi"; return; }
                dene(kalan - 1, 500L);
            }
        }, gecikme);
    }

    static boolean sagPanelde(AccessibilityNodeInfo n) {
        for (AccessibilityNodeInfo x = n; x != null; x = x.getParent()) {
            String id = x.getViewIdResourceName();
            if (id != null) { String k = id.toLowerCase(Locale.ROOT); if (k.contains("now_playing") || k.contains("nowplaying") || k.contains("npv") || k.contains("mini") || k.contains("connect_device")) return true; }
        }
        return false;
    }

    static String etiket(AccessibilityNodeInfo n) {
        CharSequence t = n.getContentDescription();
        if (t == null) t = n.getText();
        return t == null ? null : t.toString().trim().toLowerCase(new Locale("tr"));
    }

    static void topla(AccessibilityNodeInfo n, List<AccessibilityNodeInfo> l, int d) {
        if (n == null || d > 40) return;
        l.add(n);
        for (int i = 0; i < n.getChildCount(); i++) topla(n.getChild(i), l, d + 1);
    }

    /** Spotify ön plandaysa listenin Çal düğmesini bulup dokunur; bulamazsa null.
     *  Kullanıcı (r24): yanlış düğmeye (şimdi çalan şarkının devamı) dokunuldu → adaylar puanlanır:
     *  0 = etiketinde liste adı ("carvis") geçen; 1 = bilinen kimlik, sol taraf; 2 = Çal etiketi, sol taraf;
     *  5 = sağ taraf (şimdi çalıyor paneli olabilir). Alt %28 (mini çalar) ve panel kimlikleri hiç seçilmez. */
    static String tikla() {
        CarvisErisim s = CarvisErisim.ornek;
        if (s == null) return null;
        AccessibilityNodeInfo kok = s.getRootInActiveWindow();
        if (kok == null) return null;
        CharSequence pk = kok.getPackageName();
        if (pk == null || !PAKET.contentEquals(pk)) { listeSon = "bekleniyor:" + pk; return null; }
        int H = s.getResources().getDisplayMetrics().heightPixels, W = s.getResources().getDisplayMetrics().widthPixels;
        List<AccessibilityNodeInfo> l = new ArrayList<>(); topla(kok, l, 0);
        AccessibilityNodeInfo en = null; int enPuan = 99, enUst = Integer.MAX_VALUE; String neden = null;
        StringBuilder adaylar = new StringBuilder(); int say = 0;
        Rect r = new Rect();
        for (AccessibilityNodeInfo n : l) {
            if (!n.isVisibleToUser()) continue;
            String id = n.getViewIdResourceName(), kisaId = id == null ? "" : id.substring(id.indexOf('/') + 1);
            String t = etiket(n);
            boolean bilinen = id != null && Arrays.asList(OYNAT_IDLER).contains(id);
            if (!bilinen && !calEtiketi(t)) continue;
            n.getBoundsInScreen(r);
            if (r.isEmpty() || r.top > H * 0.72 || sagPanelde(n)) continue;
            boolean sol = r.centerX() < W * 0.65;
            int puan = (t != null && t.contains("carvis")) ? 0 : !sol ? 5 : bilinen ? 1 : 2;
            if (say++ < 8) adaylar.append("[").append(kisaId.length() > 0 ? kisaId : "-").append(" '").append(t == null ? "" : t).append("' x=").append(r.centerX()).append(" y=").append(r.top).append(" p=").append(puan).append("] ");
            if (puan < enPuan || (puan == enPuan && r.top < enUst)) { en = n; enPuan = puan; enUst = r.top; neden = (kisaId.length() > 0 ? kisaId : "") + "'" + (t == null ? "" : t) + "'"; }
        }
        if (en == null) {
            listeSon = "araniyor";
            List<AccessibilityNodeInfo> l2 = l;
            StringBuilder sb = new StringBuilder(); int k = 0;
            for (AccessibilityNodeInfo n : l2) {
                if (!(n.isClickable() || n.getActionList().contains(AccessibilityNodeInfo.AccessibilityAction.ACTION_CLICK)) || !n.isVisibleToUser()) continue;
                n.getBoundsInScreen(r);
                String id = n.getViewIdResourceName(); String t = etiket(n);
                if ((id == null || id.length() == 0) && t == null) continue;
                sb.append("[").append(id == null ? "-" : id.substring(id.indexOf('/') + 1)).append(" '").append(t == null ? "" : t).append("' x=").append(r.centerX()).append(" y=").append(r.top).append(sagPanelde(n) ? " panel" : "").append("] ");
                if (++k >= 30) break;
            }
            dokum = sb.toString();
            return null;
        }
        Rect rr = new Rect(); en.getBoundsInScreen(rr);
        String sonuc = neden + " @" + rr.centerX() + "," + rr.top + " (puan " + enPuan + ") | adaylar: " + adaylar;
        return CarvisErisim.tiklaDugum(en) ? sonuc : null;
    }
}
