package com.dogac.bin1;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.os.Build;
import android.os.IBinder;
import android.os.PowerManager;

/* Ekran kilitliyken de kendini geliştirme (kullanıcı, 2026-11-08: "ekran kilitliyken de yapabilsin").
   Ekran kapanınca Android işlemciyi uyutur ve arka plandaki uygulamayı dondurur; WebView'daki boşta öğrenme döngüsü durur.
   Bu ön plan hizmeti (bildirimde "C.A.R.V.I.S. kendini geliştiriyor") süreci canlı tutar ve kısmi uyanıklık kilidiyle (ekran kapalı,
   işlemci açık) JS'in turlarını sürdürmesini sağlar. JS köprüsünden: dusunBaslat() / dusunBitir() / dusunDurum().
   Kilit en çok 3 saat tutulur (pil güvenliği); JS sürdükçe yeniler. Android arka plandan hizmet başlatmayı engellerse
   (ForegroundServiceStartNotAllowedException) sessizce false döner; yalnız kilit denenir. */
public class DusunServis extends Service {
    static final String KANAL = "carvis_dusun";
    static PowerManager.WakeLock kilit;
    static boolean calisiyor = false;

    static void kilitAl(Context c) {
        try {
            if (kilit == null) {
                PowerManager pm = (PowerManager) c.getApplicationContext().getSystemService(Context.POWER_SERVICE);
                kilit = pm.newWakeLock(PowerManager.PARTIAL_WAKE_LOCK, "carvis:dusun");
                kilit.setReferenceCounted(false);
            }
            kilit.acquire(3L * 3600 * 1000);
        } catch (Throwable t) { }
    }

    static void kilitBirak() {
        try { if (kilit != null && kilit.isHeld()) kilit.release(); } catch (Throwable t) { }
    }

    public static boolean baslat(Context c) {
        kilitAl(c);
        try {
            Intent i = new Intent(c, DusunServis.class);
            if (Build.VERSION.SDK_INT >= 26) c.startForegroundService(i); else c.startService(i);
            return true;
        } catch (Throwable t) {
            return false;
        }
    }

    public static void bitir(Context c) {
        kilitBirak();
        try { c.stopService(new Intent(c, DusunServis.class)); } catch (Throwable t) { }
    }

    public static String durum() {
        boolean k = false;
        try { k = kilit != null && kilit.isHeld(); } catch (Throwable t) { }
        return "{\"hizmet\":" + calisiyor + ",\"kilit\":" + k + "}";
    }

    @Override
    public void onCreate() {
        super.onCreate();
        try {
            NotificationManager nm = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
            if (Build.VERSION.SDK_INT >= 26 && nm.getNotificationChannel(KANAL) == null) {
                NotificationChannel ch = new NotificationChannel(KANAL, "Carvis kendini geliştirme", NotificationManager.IMPORTANCE_MIN);
                ch.setDescription("Ekran kilitliyken Carvis'in araştırma ve kendini geliştirme turları");
                ch.setShowBadge(false);
                nm.createNotificationChannel(ch);
            }
            Intent ac = new Intent();
            ac.setClassName(this, "com.dogac.bin1.MainActivity");
            ac.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_SINGLE_TOP);
            PendingIntent pi = PendingIntent.getActivity(this, 7, ac, PendingIntent.FLAG_IMMUTABLE | PendingIntent.FLAG_UPDATE_CURRENT);
            Notification n = new Notification.Builder(this, KANAL)
                .setContentTitle("C.A.R.V.I.S. kendini geliştiriyor")
                .setContentText("Ekran kilitliyken araştırıyor ve kendini sınıyor. Dokununca açılır.")
                .setSmallIcon(android.R.drawable.stat_notify_sync)
                .setContentIntent(pi).setOngoing(true).build();
            if (Build.VERSION.SDK_INT >= 34) startForeground(2, n, 0x40000000 /* FOREGROUND_SERVICE_TYPE_SPECIAL_USE */);
            else startForeground(2, n);
            calisiyor = true;
        } catch (Throwable t) {
            calisiyor = false;
            stopSelf();
        }
    }

    @Override
    public int onStartCommand(Intent i, int f, int id) {
        kilitAl(this);
        return START_NOT_STICKY;
    }

    @Override
    public void onDestroy() {
        calisiyor = false;
        kilitBirak();
        super.onDestroy();
    }

    @Override
    public IBinder onBind(Intent i) { return null; }
}
