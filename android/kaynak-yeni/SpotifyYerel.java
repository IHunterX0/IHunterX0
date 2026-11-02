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
}
