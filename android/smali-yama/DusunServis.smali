.class public Lcom/dogac/bin1/DusunServis;
.super Landroid/app/Service;
.source "DusunServis.java"


# static fields
.field static final KANAL:Ljava/lang/String; = "carvis_dusun"

.field static calisiyor:Z

.field static kilit:Landroid/os/PowerManager$WakeLock;


# direct methods
.method static constructor <clinit>()V
    .locals 1

    .line 23
    const/4 v0, 0x0

    sput-boolean v0, Lcom/dogac/bin1/DusunServis;->calisiyor:Z

    return-void
.end method

.method public constructor <init>()V
    .locals 0

    .line 20
    invoke-direct {p0}, Landroid/app/Service;-><init>()V

    return-void
.end method

.method public static baslat(Landroid/content/Context;)Z
    .locals 2

    .line 41
    invoke-static {p0}, Lcom/dogac/bin1/DusunServis;->kilitAl(Landroid/content/Context;)V

    .line 43
    :try_start_0
    new-instance v0, Landroid/content/Intent;

    const-class v1, Lcom/dogac/bin1/DusunServis;

    invoke-direct {v0, p0, v1}, Landroid/content/Intent;-><init>(Landroid/content/Context;Ljava/lang/Class;)V

    .line 44
    invoke-virtual {p0, v0}, Landroid/content/Context;->startForegroundService(Landroid/content/Intent;)Landroid/content/ComponentName;
    :try_end_0
    .catchall {:try_start_0 .. :try_end_0} :catchall_0

    .line 45
    const/4 p0, 0x1

    return p0

    .line 46
    :catchall_0
    move-exception p0

    .line 47
    const/4 p0, 0x0

    return p0
.end method

.method public static bitir(Landroid/content/Context;)V
    .locals 2

    .line 52
    invoke-static {}, Lcom/dogac/bin1/DusunServis;->kilitBirak()V

    .line 53
    :try_start_0
    new-instance v0, Landroid/content/Intent;

    const-class v1, Lcom/dogac/bin1/DusunServis;

    invoke-direct {v0, p0, v1}, Landroid/content/Intent;-><init>(Landroid/content/Context;Ljava/lang/Class;)V

    invoke-virtual {p0, v0}, Landroid/content/Context;->stopService(Landroid/content/Intent;)Z
    :try_end_0
    .catchall {:try_start_0 .. :try_end_0} :catchall_0

    goto :goto_0

    :catchall_0
    move-exception p0

    .line 54
    :goto_0
    return-void
.end method

.method public static durum()Ljava/lang/String;
    .locals 3

    .line 57
    nop

    .line 58
    const/4 v0, 0x0

    :try_start_0
    sget-object v1, Lcom/dogac/bin1/DusunServis;->kilit:Landroid/os/PowerManager$WakeLock;

    if-eqz v1, :cond_0

    sget-object v1, Lcom/dogac/bin1/DusunServis;->kilit:Landroid/os/PowerManager$WakeLock;

    invoke-virtual {v1}, Landroid/os/PowerManager$WakeLock;->isHeld()Z

    move-result v1
    :try_end_0
    .catchall {:try_start_0 .. :try_end_0} :catchall_0

    if-eqz v1, :cond_0

    const/4 v0, 0x1

    goto :goto_0

    :catchall_0
    move-exception v1

    .line 59
    :cond_0
    :goto_0
    new-instance v1, Ljava/lang/StringBuilder;

    invoke-direct {v1}, Ljava/lang/StringBuilder;-><init>()V

    const-string v2, "{\"hizmet\":"

    invoke-virtual {v1, v2}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v1

    sget-boolean v2, Lcom/dogac/bin1/DusunServis;->calisiyor:Z

    invoke-virtual {v1, v2}, Ljava/lang/StringBuilder;->append(Z)Ljava/lang/StringBuilder;

    move-result-object v1

    const-string v2, ",\"kilit\":"

    invoke-virtual {v1, v2}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v1

    invoke-virtual {v1, v0}, Ljava/lang/StringBuilder;->append(Z)Ljava/lang/StringBuilder;

    move-result-object v0

    const-string v1, "}"

    invoke-virtual {v0, v1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v0

    invoke-virtual {v0}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v0

    return-object v0
.end method

.method static kilitAl(Landroid/content/Context;)V
    .locals 2

    .line 27
    :try_start_0
    sget-object v0, Lcom/dogac/bin1/DusunServis;->kilit:Landroid/os/PowerManager$WakeLock;

    if-nez v0, :cond_0

    .line 28
    invoke-virtual {p0}, Landroid/content/Context;->getApplicationContext()Landroid/content/Context;

    move-result-object p0

    const-string v0, "power"

    invoke-virtual {p0, v0}, Landroid/content/Context;->getSystemService(Ljava/lang/String;)Ljava/lang/Object;

    move-result-object p0

    check-cast p0, Landroid/os/PowerManager;

    .line 29
    const-string v0, "carvis:dusun"

    const/4 v1, 0x1

    invoke-virtual {p0, v1, v0}, Landroid/os/PowerManager;->newWakeLock(ILjava/lang/String;)Landroid/os/PowerManager$WakeLock;

    move-result-object p0

    sput-object p0, Lcom/dogac/bin1/DusunServis;->kilit:Landroid/os/PowerManager$WakeLock;

    .line 30
    sget-object p0, Lcom/dogac/bin1/DusunServis;->kilit:Landroid/os/PowerManager$WakeLock;

    const/4 v0, 0x0

    invoke-virtual {p0, v0}, Landroid/os/PowerManager$WakeLock;->setReferenceCounted(Z)V

    .line 32
    :cond_0
    sget-object p0, Lcom/dogac/bin1/DusunServis;->kilit:Landroid/os/PowerManager$WakeLock;

    const-wide/32 v0, 0xa4cb80

    invoke-virtual {p0, v0, v1}, Landroid/os/PowerManager$WakeLock;->acquire(J)V
    :try_end_0
    .catchall {:try_start_0 .. :try_end_0} :catchall_0

    goto :goto_0

    .line 33
    :catchall_0
    move-exception p0

    :goto_0
    nop

    .line 34
    return-void
.end method

.method static kilitBirak()V
    .locals 1

    .line 37
    :try_start_0
    sget-object v0, Lcom/dogac/bin1/DusunServis;->kilit:Landroid/os/PowerManager$WakeLock;

    if-eqz v0, :cond_0

    sget-object v0, Lcom/dogac/bin1/DusunServis;->kilit:Landroid/os/PowerManager$WakeLock;

    invoke-virtual {v0}, Landroid/os/PowerManager$WakeLock;->isHeld()Z

    move-result v0

    if-eqz v0, :cond_0

    sget-object v0, Lcom/dogac/bin1/DusunServis;->kilit:Landroid/os/PowerManager$WakeLock;

    invoke-virtual {v0}, Landroid/os/PowerManager$WakeLock;->release()V
    :try_end_0
    .catchall {:try_start_0 .. :try_end_0} :catchall_0

    goto :goto_0

    :catchall_0
    move-exception v0

    .line 38
    :cond_0
    :goto_0
    return-void
.end method


# virtual methods
.method public onBind(Landroid/content/Intent;)Landroid/os/IBinder;
    .locals 0

    .line 105
    const/4 p1, 0x0

    return-object p1
.end method

.method public onCreate()V
    .locals 6

    .line 64
    const-string v0, "carvis_dusun"

    invoke-super {p0}, Landroid/app/Service;->onCreate()V

    .line 66
    const/4 v1, 0x0

    :try_start_0
    const-string v2, "notification"

    invoke-virtual {p0, v2}, Lcom/dogac/bin1/DusunServis;->getSystemService(Ljava/lang/String;)Ljava/lang/Object;

    move-result-object v2

    check-cast v2, Landroid/app/NotificationManager;

    .line 67
    invoke-virtual {v2, v0}, Landroid/app/NotificationManager;->getNotificationChannel(Ljava/lang/String;)Landroid/app/NotificationChannel;

    move-result-object v3

    const/4 v4, 0x1

    if-nez v3, :cond_0

    .line 68
    new-instance v3, Landroid/app/NotificationChannel;

    const-string v5, "Carvis kendini geli\u015ftirme"

    invoke-direct {v3, v0, v5, v4}, Landroid/app/NotificationChannel;-><init>(Ljava/lang/String;Ljava/lang/CharSequence;I)V

    .line 69
    const-string v5, "Ekran kilitliyken Carvis\'in ara\u015ft\u0131rma ve kendini geli\u015ftirme turlar\u0131"

    invoke-virtual {v3, v5}, Landroid/app/NotificationChannel;->setDescription(Ljava/lang/String;)V

    .line 70
    invoke-virtual {v3, v1}, Landroid/app/NotificationChannel;->setShowBadge(Z)V

    .line 71
    invoke-virtual {v2, v3}, Landroid/app/NotificationManager;->createNotificationChannel(Landroid/app/NotificationChannel;)V

    .line 73
    :cond_0
    new-instance v2, Landroid/content/Intent;

    invoke-direct {v2}, Landroid/content/Intent;-><init>()V

    .line 74
    const-string v3, "com.dogac.bin1.MainActivity"

    invoke-virtual {v2, p0, v3}, Landroid/content/Intent;->setClassName(Landroid/content/Context;Ljava/lang/String;)Landroid/content/Intent;

    .line 75
    const/high16 v3, 0x30000000

    invoke-virtual {v2, v3}, Landroid/content/Intent;->addFlags(I)Landroid/content/Intent;

    .line 76
    const/4 v3, 0x7

    const/high16 v5, 0xc000000

    invoke-static {p0, v3, v2, v5}, Landroid/app/PendingIntent;->getActivity(Landroid/content/Context;ILandroid/content/Intent;I)Landroid/app/PendingIntent;

    move-result-object v2

    .line 77
    new-instance v3, Landroid/app/Notification$Builder;

    invoke-direct {v3, p0, v0}, Landroid/app/Notification$Builder;-><init>(Landroid/content/Context;Ljava/lang/String;)V

    const-string v0, "C.A.R.V.I.S. kendini geli\u015ftiriyor"

    .line 78
    invoke-virtual {v3, v0}, Landroid/app/Notification$Builder;->setContentTitle(Ljava/lang/CharSequence;)Landroid/app/Notification$Builder;

    move-result-object v0

    const-string v3, "Ekran kilitliyken ara\u015ft\u0131r\u0131yor ve kendini s\u0131n\u0131yor. Dokununca a\u00e7\u0131l\u0131r."

    .line 79
    invoke-virtual {v0, v3}, Landroid/app/Notification$Builder;->setContentText(Ljava/lang/CharSequence;)Landroid/app/Notification$Builder;

    move-result-object v0

    .line 80
    const v3, 0x108007c

    invoke-virtual {v0, v3}, Landroid/app/Notification$Builder;->setSmallIcon(I)Landroid/app/Notification$Builder;

    move-result-object v0

    .line 81
    invoke-virtual {v0, v2}, Landroid/app/Notification$Builder;->setContentIntent(Landroid/app/PendingIntent;)Landroid/app/Notification$Builder;

    move-result-object v0

    invoke-virtual {v0, v4}, Landroid/app/Notification$Builder;->setOngoing(Z)Landroid/app/Notification$Builder;

    move-result-object v0

    invoke-virtual {v0}, Landroid/app/Notification$Builder;->build()Landroid/app/Notification;

    move-result-object v0

    .line 82
    sget v2, Landroid/os/Build$VERSION;->SDK_INT:I

    const/16 v3, 0x22

    const/4 v5, 0x2

    if-lt v2, v3, :cond_1

    const/high16 v2, 0x40000000    # 2.0f

    invoke-virtual {p0, v5, v0, v2}, Lcom/dogac/bin1/DusunServis;->startForeground(ILandroid/app/Notification;I)V

    goto :goto_0

    .line 83
    :cond_1
    invoke-virtual {p0, v5, v0}, Lcom/dogac/bin1/DusunServis;->startForeground(ILandroid/app/Notification;)V

    .line 84
    :goto_0
    sput-boolean v4, Lcom/dogac/bin1/DusunServis;->calisiyor:Z
    :try_end_0
    .catchall {:try_start_0 .. :try_end_0} :catchall_0

    .line 88
    goto :goto_1

    .line 85
    :catchall_0
    move-exception v0

    .line 86
    sput-boolean v1, Lcom/dogac/bin1/DusunServis;->calisiyor:Z

    .line 87
    invoke-virtual {p0}, Lcom/dogac/bin1/DusunServis;->stopSelf()V

    .line 89
    :goto_1
    return-void
.end method

.method public onDestroy()V
    .locals 1

    .line 99
    const/4 v0, 0x0

    sput-boolean v0, Lcom/dogac/bin1/DusunServis;->calisiyor:Z

    .line 100
    invoke-static {}, Lcom/dogac/bin1/DusunServis;->kilitBirak()V

    .line 101
    invoke-super {p0}, Landroid/app/Service;->onDestroy()V

    .line 102
    return-void
.end method

.method public onStartCommand(Landroid/content/Intent;II)I
    .locals 0

    .line 93
    invoke-static {p0}, Lcom/dogac/bin1/DusunServis;->kilitAl(Landroid/content/Context;)V

    .line 94
    const/4 p1, 0x2

    return p1
.end method
