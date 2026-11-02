.class public Lcom/dogac/bin1/CarvisServis;
.super Landroid/app/Service;
.source "CarvisServis.java"

# interfaces
.implements Lorg/vosk/android/RecognitionListener;


# static fields
.field static final KANAL:Ljava/lang/String; = "carvis"

.field static final KANAL_UYAN:Ljava/lang/String; = "carvis_uyan"

.field static final RAKIPLER:[Ljava/lang/String;

.field static volatile konusmaBitis:J

.field static volatile konusmaliCumle:Z

.field static konusuyor:Z

.field static ornek:Lcom/dogac/bin1/CarvisServis;

.field static volatile sonKonusma:Ljava/lang/String;

.field static sonUyanma:J


# instance fields
.field final ana:Landroid/os/Handler;

.field final baslatR:Ljava/lang/Runnable;

.field birakildi:Z

.field alici:Landroid/content/BroadcastReceiver;

.field dinleyici:Lorg/vosk/android/SpeechService;

.field kismiGorulen:I

.field model:Lorg/vosk/Model;

.field sonKesme:J


# direct methods
.method public static synthetic $r8$lambda$mfzofmSA7l7TZE-RwdwvRyGCORc(Lcom/dogac/bin1/CarvisServis;)V
    .locals 0

    invoke-direct {p0}, Lcom/dogac/bin1/CarvisServis;->lambda$onCreate$0()V

    return-void
.end method

.method static constructor <clinit>()V
    .locals 4

    .line 39
    const/4 v0, 0x0

    sput-boolean v0, Lcom/dogac/bin1/CarvisServis;->konusuyor:Z

    .line 44
    const/16 v1, 0x52

    new-array v1, v1, [Ljava/lang/String;

    const-string v2, "servis"

    aput-object v2, v1, v0

    const/4 v2, 0x1

    const-string v3, "serbest"

    aput-object v3, v1, v2

    const/4 v2, 0x2

    const-string v3, "sevgi"

    aput-object v3, v1, v2

    const/4 v2, 0x3

    const-string v3, "kervan"

    aput-object v3, v1, v2

    const/4 v2, 0x4

    const-string v3, "saray"

    aput-object v3, v1, v2

    const/4 v2, 0x5

    const-string v3, "karbon"

    aput-object v3, v1, v2

    const/4 v2, 0x6

    const-string v3, "ceviz"

    aput-object v3, v1, v2

    const/4 v2, 0x7

    const-string v3, "biz"

    aput-object v3, v1, v2

    const/16 v2, 0x8

    const-string v3, "bir"

    aput-object v3, v1, v2

    const/16 v2, 0x9

    const-string v3, "bu"

    aput-object v3, v1, v2

    const/16 v2, 0xa

    const-string v3, "\u015fu"

    aput-object v3, v1, v2

    const/16 v2, 0xb

    const-string v3, "o"

    aput-object v3, v1, v2

    const/16 v2, 0xc

    const-string v3, "ve"

    aput-object v3, v1, v2

    const/16 v2, 0xd

    const-string v3, "de"

    aput-object v3, v1, v2

    const/16 v2, 0xe

    const-string v3, "da"

    aput-object v3, v1, v2

    const/16 v2, 0xf

    const-string v3, "paris"

    aput-object v3, v1, v2

    const/16 v2, 0x10

    const-string v3, "pelvis"

    aput-object v3, v1, v2

    const/16 v2, 0x11

    const-string v3, "sabah"

    aput-object v3, v1, v2

    const/16 v2, 0x12

    const-string v3, "ak\u015fam"

    aput-object v3, v1, v2

    const/16 v2, 0x13

    const-string v3, "bug\u00fcn"

    aput-object v3, v1, v2

    const/16 v2, 0x14

    const-string v3, "yar\u0131n"

    aput-object v3, v1, v2

    const/16 v2, 0x15

    const-string v3, "ne"

    aput-object v3, v1, v2

    const/16 v2, 0x16

    const-string v3, "nas\u0131l"

    aput-object v3, v1, v2

    const/16 v2, 0x17

    const-string v3, "neden"

    aput-object v3, v1, v2

    const/16 v2, 0x18

    const-string v3, "evet"

    aput-object v3, v1, v2

    const/16 v2, 0x19

    const-string v3, "hay\u0131r"

    aput-object v3, v1, v2

    const/16 v2, 0x1a

    const-string v3, "tamam"

    aput-object v3, v1, v2

    const/16 v2, 0x1b

    const-string v3, "karde\u015f"

    aput-object v3, v1, v2

    const/16 v2, 0x1c

    const-string v3, "\u00e7ar\u015f\u0131"

    aput-object v3, v1, v2

    const/16 v2, 0x1d

    const-string v3, "ba\u015fka"

    aput-object v3, v1, v2

    const/16 v2, 0x1e

    const-string v3, "servet"

    aput-object v3, v1, v2

    const/16 v2, 0x1f

    const-string v3, "seviye"

    aput-object v3, v1, v2

    const/16 v2, 0x20

    const-string v3, "sert"

    aput-object v3, v1, v2

    const/16 v2, 0x21

    const-string v3, "kas"

    aput-object v3, v1, v2

    const/16 v2, 0x22

    const-string v3, "kemik"

    aput-object v3, v1, v2

    const/16 v2, 0x23

    const-string v3, "glikoz"

    aput-object v3, v1, v2

    const/16 v2, 0x24

    const-string v3, "protein"

    aput-object v3, v1, v2

    const/16 v2, 0x25

    const-string v3, "enzim"

    aput-object v3, v1, v2

    const/16 v2, 0x26

    const-string v3, "h\u00fccre"

    aput-object v3, v1, v2

    const/16 v2, 0x27

    const-string v3, "kitap"

    aput-object v3, v1, v2

    const/16 v2, 0x28

    const-string v3, "b\u00f6l\u00fcm"

    aput-object v3, v1, v2

    const/16 v2, 0x29

    const-string v3, "sayfa"

    aput-object v3, v1, v2

    const/16 v2, 0x2a

    const-string v3, "soru"

    aput-object v3, v1, v2

    const/16 v2, 0x2b

    const-string v3, "cevap"

    aput-object v3, v1, v2

    const/16 v2, 0x2c

    const-string v3, "test"

    aput-object v3, v1, v2

    const/16 v2, 0x2d

    const-string v3, "ders"

    aput-object v3, v1, v2

    const/16 v2, 0x2e

    const-string v3, "\u00e7al\u0131\u015f"

    aput-object v3, v1, v2

    const/16 v2, 0x2f

    const-string v3, "anlat"

    aput-object v3, v1, v2

    const/16 v2, 0x30

    const-string v3, "g\u00f6ster"

    aput-object v3, v1, v2

    const/16 v2, 0x31

    const-string v3, "a\u00e7"

    aput-object v3, v1, v2

    const/16 v2, 0x32

    const-string v3, "kapat"

    aput-object v3, v1, v2

    const/16 v2, 0x33

    const-string v3, "dur"

    aput-object v3, v1, v2

    const/16 v2, 0x34

    const-string v3, "devam"

    aput-object v3, v1, v2

    const/16 v2, 0x35

    const-string v3, "ge\u00e7"

    aput-object v3, v1, v2

    const/16 v2, 0x36

    const-string v3, "tekrar"

    aput-object v3, v1, v2

    const/16 v2, 0x37

    const-string v3, "yava\u015f"

    aput-object v3, v1, v2

    const/16 v2, 0x38

    const-string v3, "h\u0131zl\u0131"

    aput-object v3, v1, v2

    const/16 v2, 0x39

    const-string v3, "merhaba"

    aput-object v3, v1, v2

    const/16 v2, 0x3a

    const-string v3, "selam"

    aput-object v3, v1, v2

    const/16 v2, 0x3b

    const-string v3, "l\u00fctfen"

    aput-object v3, v1, v2

    const/16 v2, 0x3c

    const-string v3, "te\u015fekk\u00fcr"

    aput-object v3, v1, v2

    const/16 v2, 0x3d

    const-string v3, "g\u00fczel"

    aput-object v3, v1, v2

    const/16 v2, 0x3e

    const-string v3, "iyi"

    aput-object v3, v1, v2

    const/16 v2, 0x3f

    const-string v3, "k\u00f6t\u00fc"

    aput-object v3, v1, v2

    const/16 v2, 0x40

    const-string v3, "var"

    aput-object v3, v1, v2

    const/16 v2, 0x41

    const-string v3, "yok"

    aput-object v3, v1, v2

    const/16 v2, 0x42

    const-string v3, "mi"

    aput-object v3, v1, v2

    const/16 v2, 0x43

    const-string v3, "m\u0131"

    aput-object v3, v1, v2

    const/16 v2, 0x44

    const-string v3, "ben"

    aput-object v3, v1, v2

    const/16 v2, 0x45

    const-string v3, "sen"

    aput-object v3, v1, v2

    const/16 v2, 0x46

    const-string v3, "bunu"

    aput-object v3, v1, v2

    const/16 v2, 0x47

    const-string v3, "\u015funu"

    aput-object v3, v1, v2

    const/16 v2, 0x48

    const-string v3, "onu"

    aput-object v3, v1, v2

    const/16 v2, 0x49

    const-string v3, "gel"

    aput-object v3, v1, v2

    const/16 v2, 0x4a

    const-string v3, "git"

    aput-object v3, v1, v2

    const/16 v2, 0x4b

    const-string v3, "al"

    aput-object v3, v1, v2

    const/16 v2, 0x4c

    const-string v3, "ver"

    aput-object v3, v1, v2

    const/16 v2, 0x4d

    const-string v3, "yap"

    aput-object v3, v1, v2

    const/16 v2, 0x4e

    const-string v3, "bak"

    aput-object v3, v1, v2

    const/16 v2, 0x4f

    const-string v3, "dinle"

    aput-object v3, v1, v2

    const/16 v2, 0x50

    const-string v3, "konu\u015f"

    aput-object v3, v1, v2

    const/16 v2, 0x51

    const-string v3, "[unk]"

    aput-object v3, v1, v2

    sput-object v1, Lcom/dogac/bin1/CarvisServis;->RAKIPLER:[Ljava/lang/String;

    .line 53
    const-wide/16 v1, 0x0

    sput-wide v1, Lcom/dogac/bin1/CarvisServis;->konusmaBitis:J

    .line 54
    const-string v3, ""

    sput-object v3, Lcom/dogac/bin1/CarvisServis;->sonKonusma:Ljava/lang/String;

    .line 55
    sput-boolean v0, Lcom/dogac/bin1/CarvisServis;->konusmaliCumle:Z

    .line 158
    sput-wide v1, Lcom/dogac/bin1/CarvisServis;->sonUyanma:J

    return-void
.end method

.method public constructor <init>()V
    .locals 3

    .line 36
    invoke-direct {p0}, Landroid/app/Service;-><init>()V

    .line 42
    const/4 v0, 0x0

    iput-boolean v0, p0, Lcom/dogac/bin1/CarvisServis;->birakildi:Z

    .line 43
    new-instance v1, Landroid/os/Handler;

    invoke-static {}, Landroid/os/Looper;->getMainLooper()Landroid/os/Looper;

    move-result-object v2

    invoke-direct {v1, v2}, Landroid/os/Handler;-><init>(Landroid/os/Looper;)V

    iput-object v1, p0, Lcom/dogac/bin1/CarvisServis;->ana:Landroid/os/Handler;

    .line 59
    new-instance v1, Lcom/dogac/bin1/CarvisServis$$ExternalSyntheticLambda0;

    invoke-direct {v1, p0}, Lcom/dogac/bin1/CarvisServis$$ExternalSyntheticLambda0;-><init>(Lcom/dogac/bin1/CarvisServis;)V

    iput-object v1, p0, Lcom/dogac/bin1/CarvisServis;->baslatR:Ljava/lang/Runnable;

    .line 158
    iput v0, p0, Lcom/dogac/bin1/CarvisServis;->kismiGorulen:I

    const-wide/16 v0, 0x0

    iput-wide v0, p0, Lcom/dogac/bin1/CarvisServis;->sonKesme:J

    return-void
.end method

.method static baslatIstegi(Landroid/content/Context;)V
    .locals 4
    .param p0, "c"    # Landroid/content/Context;

    .line 68
    const-string v0, "Carvis"

    :try_start_0
    sget-object v1, Lcom/dogac/bin1/CarvisServis;->ornek:Lcom/dogac/bin1/CarvisServis;

    if-eqz v1, :cond_0

    return-void

    .line 69
    :cond_0
    const-string v1, "android.permission.RECORD_AUDIO"

    invoke-virtual {p0, v1}, Landroid/content/Context;->checkSelfPermission(Ljava/lang/String;)I

    move-result v1

    if-eqz v1, :cond_1

    return-void

    .line 70
    :cond_1
    const-string v1, "carvis"

    const/4 v2, 0x0

    invoke-virtual {p0, v1, v2}, Landroid/content/Context;->getSharedPreferences(Ljava/lang/String;I)Landroid/content/SharedPreferences;

    move-result-object v1

    const-string v2, "uyandirma"

    const/4 v3, 0x1

    invoke-interface {v1, v2, v3}, Landroid/content/SharedPreferences;->getBoolean(Ljava/lang/String;Z)Z

    move-result v1

    if-nez v1, :cond_2

    return-void

    .line 71
    :cond_2
    new-instance v1, Landroid/content/Intent;

    const-class v2, Lcom/dogac/bin1/CarvisServis;

    invoke-direct {v1, p0, v2}, Landroid/content/Intent;-><init>(Landroid/content/Context;Ljava/lang/Class;)V

    .line 72
    .local v1, "i":Landroid/content/Intent;
    invoke-virtual {p0, v1}, Landroid/content/Context;->startForegroundService(Landroid/content/Intent;)Landroid/content/ComponentName;

    .line 73
    const-string v2, "dinleme servisi kendili\u011finden ba\u015flat\u0131ld\u0131"

    invoke-static {v0, v2}, Landroid/util/Log;->i(Ljava/lang/String;Ljava/lang/String;)I
    :try_end_0
    .catch Ljava/lang/Exception; {:try_start_0 .. :try_end_0} :catch_0

    .line 74
    nop

    .end local v1    # "i":Landroid/content/Intent;
    goto :goto_0

    :catch_0
    move-exception v1

    .local v1, "e":Ljava/lang/Exception;
    new-instance v2, Ljava/lang/StringBuilder;

    invoke-direct {v2}, Ljava/lang/StringBuilder;-><init>()V

    const-string v3, "servis ba\u015flat\u0131lamad\u0131: "

    invoke-virtual {v2, v3}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v2

    invoke-virtual {v2, v1}, Ljava/lang/StringBuilder;->append(Ljava/lang/Object;)Ljava/lang/StringBuilder;

    move-result-object v2

    invoke-virtual {v2}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v2

    invoke-static {v0, v2}, Landroid/util/Log;->w(Ljava/lang/String;Ljava/lang/String;)I

    .line 75
    .end local v1    # "e":Ljava/lang/Exception;
    :goto_0
    return-void
.end method

.method static ekranAcBildirimi(Landroid/content/Context;)V
    .locals 7
    .param p0, "c"    # Landroid/content/Context;

    .line 108
    new-instance v0, Landroid/content/Intent;

    const-class v1, Lcom/dogac/bin1/MainActivity;

    invoke-direct {v0, p0, v1}, Landroid/content/Intent;-><init>(Landroid/content/Context;Ljava/lang/Class;)V

    const-string v1, "uyan"

    const/4 v2, 0x1

    invoke-virtual {v0, v1, v2}, Landroid/content/Intent;->putExtra(Ljava/lang/String;Z)Landroid/content/Intent;

    move-result-object v0

    const/high16 v1, 0x30000000

    invoke-virtual {v0, v1}, Landroid/content/Intent;->addFlags(I)Landroid/content/Intent;

    move-result-object v0

    .line 109
    .local v0, "i":Landroid/content/Intent;
    const/high16 v1, 0xc000000

    const/4 v3, 0x2

    invoke-static {p0, v3, v0, v1}, Landroid/app/PendingIntent;->getActivity(Landroid/content/Context;ILandroid/content/Intent;I)Landroid/app/PendingIntent;

    move-result-object v1

    .line 110
    .local v1, "pi":Landroid/app/PendingIntent;
    new-instance v4, Landroid/app/Notification$Builder;

    const-string v5, "carvis_uyan"

    invoke-direct {v4, p0, v5}, Landroid/app/Notification$Builder;-><init>(Landroid/content/Context;Ljava/lang/String;)V

    .line 111
    .local v4, "b":Landroid/app/Notification$Builder;
    const-string v5, "Carvis"

    invoke-virtual {v4, v5}, Landroid/app/Notification$Builder;->setContentTitle(Ljava/lang/CharSequence;)Landroid/app/Notification$Builder;

    move-result-object v5

    const-string v6, "Dinliyorum \u2014 dokun"

    invoke-virtual {v5, v6}, Landroid/app/Notification$Builder;->setContentText(Ljava/lang/CharSequence;)Landroid/app/Notification$Builder;

    move-result-object v5

    const v6, 0x10800a4

    invoke-virtual {v5, v6}, Landroid/app/Notification$Builder;->setSmallIcon(I)Landroid/app/Notification$Builder;

    move-result-object v5

    .line 112
    invoke-virtual {v5, v1}, Landroid/app/Notification$Builder;->setContentIntent(Landroid/app/PendingIntent;)Landroid/app/Notification$Builder;

    move-result-object v5

    invoke-virtual {v5, v1, v2}, Landroid/app/Notification$Builder;->setFullScreenIntent(Landroid/app/PendingIntent;Z)Landroid/app/Notification$Builder;

    move-result-object v5

    invoke-virtual {v5, v2}, Landroid/app/Notification$Builder;->setAutoCancel(Z)Landroid/app/Notification$Builder;

    move-result-object v2

    const-string v5, "call"

    invoke-virtual {v2, v5}, Landroid/app/Notification$Builder;->setCategory(Ljava/lang/String;)Landroid/app/Notification$Builder;

    move-result-object v2

    invoke-virtual {v2}, Landroid/app/Notification$Builder;->build()Landroid/app/Notification;

    move-result-object v2

    .line 113
    .local v2, "n":Landroid/app/Notification;
    const-string v5, "notification"

    invoke-virtual {p0, v5}, Landroid/content/Context;->getSystemService(Ljava/lang/String;)Ljava/lang/Object;

    move-result-object v5

    check-cast v5, Landroid/app/NotificationManager;

    invoke-virtual {v5, v3, v2}, Landroid/app/NotificationManager;->notify(ILandroid/app/Notification;)V

    .line 114
    :try_start_0
    invoke-virtual {v1}, Landroid/app/PendingIntent;->send()V
    :try_end_0
    .catch Ljava/lang/Exception; {:try_start_0 .. :try_end_0} :catch_0

    goto :goto_0

    :catch_0
    move-exception v3

    .line 115
    :goto_0
    return-void
.end method

.method static konusmaBasladi()V
    .locals 1

    .line 56
    const/4 v0, 0x1

    sput-boolean v0, Lcom/dogac/bin1/CarvisServis;->konusuyor:Z

    return-void
.end method

.method static konusmaBitti()V
    .locals 2

    .line 57
    const/4 v0, 0x0

    sput-boolean v0, Lcom/dogac/bin1/CarvisServis;->konusuyor:Z

    invoke-static {}, Ljava/lang/System;->currentTimeMillis()J

    move-result-wide v0

    sput-wide v0, Lcom/dogac/bin1/CarvisServis;->konusmaBitis:J

    return-void
.end method

.method static kopyala(Landroid/content/res/AssetManager;Ljava/lang/String;Ljava/io/File;)V
    .locals 7
    .param p0, "am"    # Landroid/content/res/AssetManager;
    .param p1, "yol"    # Ljava/lang/String;
    .param p2, "hedef"    # Ljava/io/File;
    .annotation system Ldalvik/annotation/Throws;
        value = {
            Ljava/lang/Exception;
        }
    .end annotation

    .line 126
    invoke-virtual {p0, p1}, Landroid/content/res/AssetManager;->list(Ljava/lang/String;)[Ljava/lang/String;

    move-result-object v0

    .line 127
    .local v0, "l":[Ljava/lang/String;
    const/4 v1, 0x0

    if-eqz v0, :cond_2

    array-length v2, v0

    if-nez v2, :cond_0

    goto :goto_1

    .line 132
    :cond_0
    invoke-virtual {p2}, Ljava/io/File;->mkdirs()Z

    .line 133
    array-length v2, v0

    :goto_0
    if-ge v1, v2, :cond_1

    aget-object v3, v0, v1

    .local v3, "a":Ljava/lang/String;
    new-instance v4, Ljava/lang/StringBuilder;

    invoke-direct {v4}, Ljava/lang/StringBuilder;-><init>()V

    invoke-virtual {v4, p1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v4

    const-string v5, "/"

    invoke-virtual {v4, v5}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v4

    invoke-virtual {v4, v3}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v4

    invoke-virtual {v4}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v4

    new-instance v5, Ljava/io/File;

    invoke-direct {v5, p2, v3}, Ljava/io/File;-><init>(Ljava/io/File;Ljava/lang/String;)V

    invoke-static {p0, v4, v5}, Lcom/dogac/bin1/CarvisServis;->kopyala(Landroid/content/res/AssetManager;Ljava/lang/String;Ljava/io/File;)V

    .end local v3    # "a":Ljava/lang/String;
    add-int/lit8 v1, v1, 0x1

    goto :goto_0

    .line 134
    :cond_1
    return-void

    .line 128
    :cond_2
    :goto_1
    invoke-virtual {p2}, Ljava/io/File;->getParentFile()Ljava/io/File;

    move-result-object v2

    invoke-virtual {v2}, Ljava/io/File;->mkdirs()Z

    .line 129
    invoke-virtual {p0, p1}, Landroid/content/res/AssetManager;->open(Ljava/lang/String;)Ljava/io/InputStream;

    move-result-object v2

    .local v2, "i":Ljava/io/InputStream;
    :try_start_0
    new-instance v3, Ljava/io/FileOutputStream;

    invoke-direct {v3, p2}, Ljava/io/FileOutputStream;-><init>(Ljava/io/File;)V
    :try_end_0
    .catchall {:try_start_0 .. :try_end_0} :catchall_2

    .local v3, "o":Ljava/io/OutputStream;
    const/high16 v4, 0x10000

    :try_start_1
    new-array v4, v4, [B

    .local v4, "b":[B
    :goto_2
    invoke-virtual {v2, v4}, Ljava/io/InputStream;->read([B)I

    move-result v5

    move v6, v5

    .local v6, "n":I
    if-lez v5, :cond_3

    invoke-virtual {v3, v4, v1, v6}, Ljava/io/OutputStream;->write([BII)V
    :try_end_1
    .catchall {:try_start_1 .. :try_end_1} :catchall_0

    goto :goto_2

    .end local v4    # "b":[B
    .end local v6    # "n":I
    :cond_3
    :try_start_2
    invoke-virtual {v3}, Ljava/io/OutputStream;->close()V
    :try_end_2
    .catchall {:try_start_2 .. :try_end_2} :catchall_2

    .end local v3    # "o":Ljava/io/OutputStream;
    if-eqz v2, :cond_4

    invoke-virtual {v2}, Ljava/io/InputStream;->close()V

    .line 130
    .end local v2    # "i":Ljava/io/InputStream;
    :cond_4
    return-void

    .line 129
    .restart local v2    # "i":Ljava/io/InputStream;
    .restart local v3    # "o":Ljava/io/OutputStream;
    :catchall_0
    move-exception v1

    :try_start_3
    invoke-virtual {v3}, Ljava/io/OutputStream;->close()V
    :try_end_3
    .catchall {:try_start_3 .. :try_end_3} :catchall_1

    goto :goto_3

    :catchall_1
    move-exception v4

    :try_start_4
    invoke-virtual {v1, v4}, Ljava/lang/Throwable;->addSuppressed(Ljava/lang/Throwable;)V

    .end local v0    # "l":[Ljava/lang/String;
    .end local v2    # "i":Ljava/io/InputStream;
    .end local p0    # "am":Landroid/content/res/AssetManager;
    .end local p1    # "yol":Ljava/lang/String;
    .end local p2    # "hedef":Ljava/io/File;
    :goto_3
    throw v1
    :try_end_4
    .catchall {:try_start_4 .. :try_end_4} :catchall_2

    .end local v3    # "o":Ljava/io/OutputStream;
    .restart local v0    # "l":[Ljava/lang/String;
    .restart local v2    # "i":Ljava/io/InputStream;
    .restart local p0    # "am":Landroid/content/res/AssetManager;
    .restart local p1    # "yol":Ljava/lang/String;
    .restart local p2    # "hedef":Ljava/io/File;
    :catchall_2
    move-exception v1

    if-eqz v2, :cond_5

    :try_start_5
    invoke-virtual {v2}, Ljava/io/InputStream;->close()V
    :try_end_5
    .catchall {:try_start_5 .. :try_end_5} :catchall_3

    goto :goto_4

    :catchall_3
    move-exception v3

    invoke-virtual {v1, v3}, Ljava/lang/Throwable;->addSuppressed(Ljava/lang/Throwable;)V

    :cond_5
    :goto_4
    throw v1
.end method

.method private synthetic lambda$onCreate$0()V
    .locals 3

    .line 91
    :try_start_0
    invoke-virtual {p0}, Lcom/dogac/bin1/CarvisServis;->modeliCikar()Ljava/io/File;

    move-result-object v0

    .line 92
    .local v0, "d":Ljava/io/File;
    new-instance v1, Lorg/vosk/Model;

    invoke-virtual {v0}, Ljava/io/File;->getAbsolutePath()Ljava/lang/String;

    move-result-object v2

    invoke-direct {v1, v2}, Lorg/vosk/Model;-><init>(Ljava/lang/String;)V

    iput-object v1, p0, Lcom/dogac/bin1/CarvisServis;->model:Lorg/vosk/Model;

    .line 93
    iget-object v1, p0, Lcom/dogac/bin1/CarvisServis;->ana:Landroid/os/Handler;

    new-instance v2, Lcom/dogac/bin1/CarvisServis$$ExternalSyntheticLambda0;

    invoke-direct {v2, p0}, Lcom/dogac/bin1/CarvisServis$$ExternalSyntheticLambda0;-><init>(Lcom/dogac/bin1/CarvisServis;)V

    invoke-virtual {v1, v2}, Landroid/os/Handler;->post(Ljava/lang/Runnable;)Z
    :try_end_0
    .catch Ljava/lang/Exception; {:try_start_0 .. :try_end_0} :catch_0

    .line 94
    nop

    .end local v0    # "d":Ljava/io/File;
    goto :goto_0

    :catch_0
    move-exception v0

    .local v0, "e":Ljava/lang/Exception;
    const-string v1, "Carvis"

    const-string v2, "model"

    invoke-static {v1, v2, v0}, Landroid/util/Log;->e(Ljava/lang/String;Ljava/lang/String;Ljava/lang/Throwable;)I

    new-instance v1, Ljava/lang/StringBuilder;

    invoke-direct {v1}, Ljava/lang/StringBuilder;-><init>()V

    const-string v2, "Ses modeli a\u00e7\u0131lamad\u0131: "

    invoke-virtual {v1, v2}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v1

    invoke-virtual {v0}, Ljava/lang/Exception;->getMessage()Ljava/lang/String;

    move-result-object v2

    invoke-virtual {v1, v2}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v1

    invoke-virtual {v1}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v1

    invoke-virtual {p0, v1}, Lcom/dogac/bin1/CarvisServis;->guncelle(Ljava/lang/String;)V

    .line 95
    .end local v0    # "e":Ljava/lang/Exception;
    :goto_0
    return-void
.end method

.method static mikrofonuAl()V
    .locals 5

    .line 76
    sget-object v0, Lcom/dogac/bin1/CarvisServis;->ornek:Lcom/dogac/bin1/CarvisServis;

    .local v0, "s":Lcom/dogac/bin1/CarvisServis;
    if-eqz v0, :cond_0

    const/4 v1, 0x0

    iput-boolean v1, v0, Lcom/dogac/bin1/CarvisServis;->birakildi:Z

    iget-object v1, v0, Lcom/dogac/bin1/CarvisServis;->ana:Landroid/os/Handler;

    iget-object v2, v0, Lcom/dogac/bin1/CarvisServis;->baslatR:Ljava/lang/Runnable;

    invoke-virtual {v1, v2}, Landroid/os/Handler;->removeCallbacks(Ljava/lang/Runnable;)V

    iget-object v1, v0, Lcom/dogac/bin1/CarvisServis;->ana:Landroid/os/Handler;

    iget-object v2, v0, Lcom/dogac/bin1/CarvisServis;->baslatR:Ljava/lang/Runnable;

    const-wide/16 v3, 0x12c

    invoke-virtual {v1, v2, v3, v4}, Landroid/os/Handler;->postDelayed(Ljava/lang/Runnable;J)Z

    :cond_0
    return-void
.end method

.method static mikrofonuBirak()V
    .locals 3

    .line 61
    sget-object v0, Lcom/dogac/bin1/CarvisServis;->ornek:Lcom/dogac/bin1/CarvisServis;

    .local v0, "s":Lcom/dogac/bin1/CarvisServis;
    if-nez v0, :cond_0

    return-void

    .line 62
    :cond_0
    const/4 v1, 0x1

    iput-boolean v1, v0, Lcom/dogac/bin1/CarvisServis;->birakildi:Z

    iget-object v1, v0, Lcom/dogac/bin1/CarvisServis;->ana:Landroid/os/Handler;

    iget-object v2, v0, Lcom/dogac/bin1/CarvisServis;->baslatR:Ljava/lang/Runnable;

    invoke-virtual {v1, v2}, Landroid/os/Handler;->removeCallbacks(Ljava/lang/Runnable;)V

    .line 63
    invoke-static {}, Landroid/os/Looper;->myLooper()Landroid/os/Looper;

    move-result-object v1

    invoke-static {}, Landroid/os/Looper;->getMainLooper()Landroid/os/Looper;

    move-result-object v2

    if-ne v1, v2, :cond_1

    invoke-virtual {v0}, Lcom/dogac/bin1/CarvisServis;->durdur()V

    goto :goto_0

    :cond_1
    iget-object v1, v0, Lcom/dogac/bin1/CarvisServis;->ana:Landroid/os/Handler;

    invoke-static {v0}, Ljava/util/Objects;->requireNonNull(Ljava/lang/Object;)Ljava/lang/Object;

    new-instance v2, Lcom/dogac/bin1/CarvisServis$$ExternalSyntheticLambda3;

    invoke-direct {v2, v0}, Lcom/dogac/bin1/CarvisServis$$ExternalSyntheticLambda3;-><init>(Lcom/dogac/bin1/CarvisServis;)V

    invoke-virtual {v1, v2}, Landroid/os/Handler;->post(Ljava/lang/Runnable;)Z

    .line 64
    :goto_0
    return-void
.end method


# virtual methods
.method baslat()V
    .locals 5

    .line 137
    iget-object v0, p0, Lcom/dogac/bin1/CarvisServis;->model:Lorg/vosk/Model;

    if-eqz v0, :cond_2

    iget-object v0, p0, Lcom/dogac/bin1/CarvisServis;->dinleyici:Lorg/vosk/android/SpeechService;

    if-eqz v0, :cond_0

    goto :goto_2

    .line 139
    :cond_0
    invoke-virtual {p0}, Lcom/dogac/bin1/CarvisServis;->dinlemeUygun()Z

    move-result v0

    if-nez v0, :uygun_0

    invoke-virtual {p0}, Lcom/dogac/bin1/CarvisServis;->uykuMetni()Ljava/lang/String;

    move-result-object v0

    invoke-virtual {p0, v0}, Lcom/dogac/bin1/CarvisServis;->guncelle(Ljava/lang/String;)V

    return-void

    :uygun_0
    :try_start_0
    new-instance v0, Lorg/json/JSONArray;

    invoke-direct {v0}, Lorg/json/JSONArray;-><init>()V

    .local v0, "g":Lorg/json/JSONArray;
    sget-object v1, Lcom/dogac/bin1/CarvisServis;->RAKIPLER:[Ljava/lang/String;

    array-length v2, v1

    const/4 v3, 0x0

    :goto_0
    if-ge v3, v2, :cond_1

    aget-object v4, v1, v3

    .local v4, "w":Ljava/lang/String;
    invoke-virtual {v0, v4}, Lorg/json/JSONArray;->put(Ljava/lang/Object;)Lorg/json/JSONArray;

    .end local v4    # "w":Ljava/lang/String;
    add-int/lit8 v3, v3, 0x1

    goto :goto_0

    .line 140
    :cond_1
    new-instance v1, Lorg/vosk/Recognizer;

    iget-object v2, p0, Lcom/dogac/bin1/CarvisServis;->model:Lorg/vosk/Model;

    invoke-virtual {v0}, Lorg/json/JSONArray;->toString()Ljava/lang/String;

    move-result-object v3

    const/high16 v4, 0x467a0000    # 16000.0f

    invoke-direct {v1, v2, v4, v3}, Lorg/vosk/Recognizer;-><init>(Lorg/vosk/Model;FLjava/lang/String;)V

    .line 141
    .local v1, "r":Lorg/vosk/Recognizer;
    const/4 v2, 0x1

    invoke-virtual {v1, v2}, Lorg/vosk/Recognizer;->setWords(Z)V

    .line 142
    new-instance v2, Lorg/vosk/android/SpeechService;

    invoke-direct {v2, v1, v4}, Lorg/vosk/android/SpeechService;-><init>(Lorg/vosk/Recognizer;F)V

    iput-object v2, p0, Lcom/dogac/bin1/CarvisServis;->dinleyici:Lorg/vosk/android/SpeechService;

    .line 143
    iget-object v2, p0, Lcom/dogac/bin1/CarvisServis;->dinleyici:Lorg/vosk/android/SpeechService;

    invoke-virtual {v2, p0}, Lorg/vosk/android/SpeechService;->startListening(Lorg/vosk/android/RecognitionListener;)Z

    .line 144
    const-string v2, "\"Carvis\" deyince uyan\u0131r"

    invoke-virtual {p0, v2}, Lcom/dogac/bin1/CarvisServis;->guncelle(Ljava/lang/String;)V
    :try_end_0
    .catch Ljava/lang/Exception; {:try_start_0 .. :try_end_0} :catch_0

    .line 145
    .end local v0    # "g":Lorg/json/JSONArray;
    .end local v1    # "r":Lorg/vosk/Recognizer;
    goto :goto_1

    :catch_0
    move-exception v0

    .local v0, "e":Ljava/lang/Exception;
    const-string v1, "Carvis"

    const-string v2, "baslat"

    invoke-static {v1, v2, v0}, Landroid/util/Log;->e(Ljava/lang/String;Ljava/lang/String;Ljava/lang/Throwable;)I

    const/4 v1, 0x0

    iput-object v1, p0, Lcom/dogac/bin1/CarvisServis;->dinleyici:Lorg/vosk/android/SpeechService;

    const-string v1, "Mikrofon a\u00e7\u0131lamad\u0131"

    invoke-virtual {p0, v1}, Lcom/dogac/bin1/CarvisServis;->guncelle(Ljava/lang/String;)V

    .line 146
    .end local v0    # "e":Ljava/lang/Exception;
    :goto_1
    return-void

    .line 137
    :cond_2
    :goto_2
    return-void
.end method

.method bildirim(Ljava/lang/String;)Landroid/app/Notification;
    .locals 5
    .param p1, "metin"    # Ljava/lang/String;

    .line 99
    new-instance v0, Landroid/content/Intent;

    const-class v1, Lcom/dogac/bin1/MainActivity;

    invoke-direct {v0, p0, v1}, Landroid/content/Intent;-><init>(Landroid/content/Context;Ljava/lang/Class;)V

    const/high16 v1, 0x20000000

    invoke-virtual {v0, v1}, Landroid/content/Intent;->addFlags(I)Landroid/content/Intent;

    move-result-object v0

    .line 100
    .local v0, "i":Landroid/content/Intent;
    const/4 v1, 0x0

    const/high16 v2, 0x4000000

    invoke-static {p0, v1, v0, v2}, Landroid/app/PendingIntent;->getActivity(Landroid/content/Context;ILandroid/content/Intent;I)Landroid/app/PendingIntent;

    move-result-object v1

    .line 101
    .local v1, "pi":Landroid/app/PendingIntent;
    new-instance v2, Landroid/app/Notification$Builder;

    const-string v3, "carvis"

    invoke-direct {v2, p0, v3}, Landroid/app/Notification$Builder;-><init>(Landroid/content/Context;Ljava/lang/String;)V

    .line 102
    .local v2, "b":Landroid/app/Notification$Builder;
    const-string v3, "Carvis"

    invoke-virtual {v2, v3}, Landroid/app/Notification$Builder;->setContentTitle(Ljava/lang/CharSequence;)Landroid/app/Notification$Builder;

    move-result-object v3

    invoke-virtual {v3, p1}, Landroid/app/Notification$Builder;->setContentText(Ljava/lang/CharSequence;)Landroid/app/Notification$Builder;

    move-result-object v3

    const v4, 0x10800a4

    invoke-virtual {v3, v4}, Landroid/app/Notification$Builder;->setSmallIcon(I)Landroid/app/Notification$Builder;

    move-result-object v3

    invoke-virtual {v3, v1}, Landroid/app/Notification$Builder;->setContentIntent(Landroid/app/PendingIntent;)Landroid/app/Notification$Builder;

    move-result-object v3

    const/4 v4, 0x1

    invoke-virtual {v3, v4}, Landroid/app/Notification$Builder;->setOngoing(Z)Landroid/app/Notification$Builder;

    move-result-object v3

    invoke-virtual {v3}, Landroid/app/Notification$Builder;->build()Landroid/app/Notification;

    move-result-object v3

    return-object v3
.end method

.method durdur()V
    .locals 1

    .line 147
    iget-object v0, p0, Lcom/dogac/bin1/CarvisServis;->dinleyici:Lorg/vosk/android/SpeechService;

    if-eqz v0, :cond_0

    iget-object v0, p0, Lcom/dogac/bin1/CarvisServis;->dinleyici:Lorg/vosk/android/SpeechService;

    invoke-virtual {v0}, Lorg/vosk/android/SpeechService;->stop()Z

    iget-object v0, p0, Lcom/dogac/bin1/CarvisServis;->dinleyici:Lorg/vosk/android/SpeechService;

    invoke-virtual {v0}, Lorg/vosk/android/SpeechService;->shutdown()V

    const/4 v0, 0x0

    iput-object v0, p0, Lcom/dogac/bin1/CarvisServis;->dinleyici:Lorg/vosk/android/SpeechService;

    :cond_0
    return-void
.end method

.method guncelle(Ljava/lang/String;)V
    .locals 3
    .param p1, "metin"    # Ljava/lang/String;

    .line 104
    const-string v0, "notification"

    invoke-virtual {p0, v0}, Lcom/dogac/bin1/CarvisServis;->getSystemService(Ljava/lang/String;)Ljava/lang/Object;

    move-result-object v0

    check-cast v0, Landroid/app/NotificationManager;

    const/4 v1, 0x1

    invoke-virtual {p0, p1}, Lcom/dogac/bin1/CarvisServis;->bildirim(Ljava/lang/String;)Landroid/app/Notification;

    move-result-object v2

    invoke-virtual {v0, v1, v2}, Landroid/app/NotificationManager;->notify(ILandroid/app/Notification;)V

    return-void
.end method

.method kontrol(Ljava/lang/String;)V
    .locals 17
    .param p1, "json"    # Ljava/lang/String;

    .line 184
    move-object/from16 v1, p0

    move-object/from16 v2, p1

    const-string v0, "servis"

    const-string v3, "conf"

    const-string v4, "word"

    const-string v5, "Carvis"

    :try_start_0
    new-instance v6, Lorg/json/JSONObject;

    invoke-direct {v6, v2}, Lorg/json/JSONObject;-><init>(Ljava/lang/String;)V

    const-string v7, "result"

    invoke-virtual {v6, v7}, Lorg/json/JSONObject;->optJSONArray(Ljava/lang/String;)Lorg/json/JSONArray;

    move-result-object v6

    .line 185
    .local v6, "r":Lorg/json/JSONArray;
    new-instance v7, Ljava/lang/StringBuilder;

    invoke-direct {v7}, Ljava/lang/StringBuilder;-><init>()V

    const-string v8, "duydu: "

    invoke-virtual {v7, v8}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v7

    const-string v8, " +"

    const-string v9, " "

    invoke-virtual {v2, v8, v9}, Ljava/lang/String;->replaceAll(Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;

    move-result-object v8

    invoke-virtual {v7, v8}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v7

    invoke-virtual {v7}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v7

    invoke-static {v5, v7}, Landroid/util/Log;->i(Ljava/lang/String;Ljava/lang/String;)I

    .line 186
    if-eqz v6, :cond_c

    invoke-virtual {v6}, Lorg/json/JSONArray;->length()I

    move-result v7

    if-nez v7, :cond_0

    goto/16 :goto_0

    .line 187
    :cond_0
    const/4 v7, 0x0

    invoke-virtual {v6, v7}, Lorg/json/JSONArray;->getJSONObject(I)Lorg/json/JSONObject;

    move-result-object v8

    .line 189
    .local v8, "ilk":Lorg/json/JSONObject;
    sget-boolean v9, Lcom/dogac/bin1/CarvisServis;->konusuyor:Z

    if-eqz v9, :cond_1

    return-void

    .line 191
    :cond_1
    sget-boolean v9, Lcom/dogac/bin1/CarvisServis;->konusmaliCumle:Z

    if-eqz v9, :cond_2

    sput-boolean v7, Lcom/dogac/bin1/CarvisServis;->konusmaliCumle:Z

    invoke-static {}, Ljava/lang/System;->currentTimeMillis()J

    move-result-wide v9

    sget-wide v11, Lcom/dogac/bin1/CarvisServis;->konusmaBitis:J

    sub-long/2addr v9, v11

    const-wide/16 v11, 0x1770

    cmp-long v9, v9, v11

    if-gez v9, :cond_2

    const-string v0, "kendi sesi yok say\u0131ld\u0131"

    invoke-static {v5, v0}, Landroid/util/Log;->i(Ljava/lang/String;Ljava/lang/String;)I

    return-void

    .line 192
    :cond_2
    invoke-static {}, Ljava/lang/System;->currentTimeMillis()J

    move-result-wide v9

    sget-wide v11, Lcom/dogac/bin1/CarvisServis;->konusmaBitis:J

    sub-long/2addr v9, v11

    const-wide/16 v11, 0x5dc

    cmp-long v5, v9, v11

    if-gez v5, :cond_3

    return-void

    .line 194
    :cond_3
    invoke-virtual {v8, v4}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v5

    .local v5, "w":Ljava/lang/String;
    const-wide/16 v9, 0x0

    invoke-virtual {v8, v3, v9, v10}, Lorg/json/JSONObject;->optDouble(Ljava/lang/String;D)D

    move-result-wide v11

    .line 195
    .local v11, "guven":D
    invoke-virtual {v0, v5}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v13
    :try_end_0
    .catch Ljava/lang/Exception; {:try_start_0 .. :try_end_0} :catch_0

    const-string v14, "ceviz"

    if-nez v13, :cond_4

    :try_start_1
    invoke-virtual {v14, v5}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v13

    if-nez v13, :cond_4

    invoke-virtual {v6}, Lorg/json/JSONArray;->length()I

    move-result v13

    const/4 v15, 0x1

    if-le v13, v15, :cond_4

    const/16 v13, 0x8

    new-array v13, v13, [Ljava/lang/String;

    const-string v16, "o"

    aput-object v16, v13, v7

    const-string v7, "bu"

    aput-object v7, v13, v15

    const-string v7, "\u015fu"

    const/16 v16, 0x2

    aput-object v7, v13, v16

    const-string v7, "ve"

    const/16 v16, 0x3

    aput-object v7, v13, v16

    const-string v7, "de"

    const/16 v16, 0x4

    aput-object v7, v13, v16

    const-string v7, "da"

    const/16 v16, 0x5

    aput-object v7, v13, v16

    const-string v7, "bir"

    const/16 v16, 0x6

    aput-object v7, v13, v16

    const-string v7, "[unk]"

    const/16 v16, 0x7

    aput-object v7, v13, v16

    invoke-static {v13}, Ljava/util/Arrays;->asList([Ljava/lang/Object;)Ljava/util/List;

    move-result-object v7

    invoke-interface {v7, v5}, Ljava/util/List;->contains(Ljava/lang/Object;)Z

    move-result v7

    if-eqz v7, :cond_4

    .line 196
    invoke-virtual {v6, v15}, Lorg/json/JSONArray;->getJSONObject(I)Lorg/json/JSONObject;

    move-result-object v7

    .local v7, "iki":Lorg/json/JSONObject;
    invoke-virtual {v7, v4}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v4

    move-object v5, v4

    invoke-virtual {v7, v3, v9, v10}, Lorg/json/JSONObject;->optDouble(Ljava/lang/String;D)D

    move-result-wide v3

    move-wide v11, v3

    .line 198
    .end local v7    # "iki":Lorg/json/JSONObject;
    :cond_4
    invoke-virtual {v0, v5}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    if-nez v0, :cond_5

    invoke-virtual {v14, v5}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    if-eqz v0, :cond_6

    :cond_5
    const-wide v3, 0x3fe199999999999aL    # 0.55

    cmpg-double v0, v11, v3

    if-gez v0, :cond_7

    :cond_6
    return-void

    .line 199
    :cond_7
    invoke-static {}, Ljava/lang/System;->currentTimeMillis()J

    move-result-wide v3

    iget-wide v9, v1, Lcom/dogac/bin1/CarvisServis;->sonKesme:J

    sub-long/2addr v3, v9

    const-wide/16 v9, 0xbb8

    cmp-long v0, v3, v9

    if-gez v0, :cond_8

    return-void

    .line 201
    :cond_8
    invoke-static {}, Ljava/lang/System;->currentTimeMillis()J

    move-result-wide v3

    sget-wide v9, Lcom/dogac/bin1/CarvisServis;->sonUyanma:J

    sub-long/2addr v3, v9

    const-wide/16 v9, 0x9c4

    cmp-long v0, v3, v9

    if-gez v0, :cond_9

    return-void

    .line 202
    :cond_9
    invoke-static {}, Ljava/lang/System;->currentTimeMillis()J

    move-result-wide v3

    sput-wide v3, Lcom/dogac/bin1/CarvisServis;->sonUyanma:J

    .line 203
    invoke-virtual/range {p0 .. p0}, Lcom/dogac/bin1/CarvisServis;->sessizMod()Z

    move-result v0

    if-eqz v0, :cond_a

    const-string v0, "Rahats\u0131z Etmeyin a\u00e7\u0131k: Carvis uyuyor"

    invoke-virtual {v1, v0}, Lcom/dogac/bin1/CarvisServis;->guncelle(Ljava/lang/String;)V

    return-void

    .line 204
    :cond_a
    sget-object v0, Lcom/dogac/bin1/MainActivity;->ornek:Lcom/dogac/bin1/MainActivity;

    .line 205
    .local v0, "a":Lcom/dogac/bin1/MainActivity;
    if-eqz v0, :cond_b

    invoke-static {v0}, Ljava/util/Objects;->requireNonNull(Ljava/lang/Object;)Ljava/lang/Object;

    new-instance v3, Lcom/dogac/bin1/CarvisServis$$ExternalSyntheticLambda1;

    invoke-direct {v3, v0}, Lcom/dogac/bin1/CarvisServis$$ExternalSyntheticLambda1;-><init>(Lcom/dogac/bin1/MainActivity;)V

    invoke-virtual {v0, v3}, Lcom/dogac/bin1/MainActivity;->runOnUiThread(Ljava/lang/Runnable;)V

    goto :goto_1

    .line 206
    :cond_b
    invoke-static/range {p0 .. p0}, Lcom/dogac/bin1/CarvisServis;->ekranAcBildirimi(Landroid/content/Context;)V
    :try_end_1
    .catch Ljava/lang/Exception; {:try_start_1 .. :try_end_1} :catch_0

    goto :goto_1

    .line 186
    .end local v0    # "a":Lcom/dogac/bin1/MainActivity;
    .end local v5    # "w":Ljava/lang/String;
    .end local v8    # "ilk":Lorg/json/JSONObject;
    .end local v11    # "guven":D
    :cond_c
    :goto_0
    return-void

    .line 207
    .end local v6    # "r":Lorg/json/JSONArray;
    :catch_0
    move-exception v0

    :goto_1
    nop

    .line 208
    return-void
.end method

.method modeliCikar()Ljava/io/File;
    .locals 4
    .annotation system Ldalvik/annotation/Throws;
        value = {
            Ljava/lang/Exception;
        }
    .end annotation

    .line 118
    new-instance v0, Ljava/io/File;

    invoke-virtual {p0}, Lcom/dogac/bin1/CarvisServis;->getFilesDir()Ljava/io/File;

    move-result-object v1

    const-string v2, "vosk-tr"

    invoke-direct {v0, v1, v2}, Ljava/io/File;-><init>(Ljava/io/File;Ljava/lang/String;)V

    .line 119
    .local v0, "hedef":Ljava/io/File;
    new-instance v1, Ljava/io/File;

    const-string v3, ".tamam"

    invoke-direct {v1, v0, v3}, Ljava/io/File;-><init>(Ljava/io/File;Ljava/lang/String;)V

    .line 120
    .local v1, "isaret":Ljava/io/File;
    invoke-virtual {v1}, Ljava/io/File;->exists()Z

    move-result v3

    if-eqz v3, :cond_0

    return-object v0

    .line 121
    :cond_0
    invoke-virtual {p0}, Lcom/dogac/bin1/CarvisServis;->getAssets()Landroid/content/res/AssetManager;

    move-result-object v3

    invoke-static {v3, v2, v0}, Lcom/dogac/bin1/CarvisServis;->kopyala(Landroid/content/res/AssetManager;Ljava/lang/String;Ljava/io/File;)V

    .line 122
    invoke-virtual {v1}, Ljava/io/File;->createNewFile()Z

    .line 123
    return-object v0
.end method

.method public onBind(Landroid/content/Intent;)Landroid/os/IBinder;
    .locals 1
    .param p1, "i"    # Landroid/content/Intent;

    .line 212
    const/4 v0, 0x0

    return-object v0
.end method

.method public onCreate()V
    .locals 5

    .line 79
    invoke-super {p0}, Landroid/app/Service;->onCreate()V

    .line 80
    sput-object p0, Lcom/dogac/bin1/CarvisServis;->ornek:Lcom/dogac/bin1/CarvisServis;

    .line 81
    const-string v0, "notification"

    invoke-virtual {p0, v0}, Lcom/dogac/bin1/CarvisServis;->getSystemService(Ljava/lang/String;)Ljava/lang/Object;

    move-result-object v0

    check-cast v0, Landroid/app/NotificationManager;

    .line 82
    .local v0, "nm":Landroid/app/NotificationManager;
    nop

    .line 83
    new-instance v1, Landroid/app/NotificationChannel;

    const-string v2, "Carvis dinliyor"

    const/4 v3, 0x2

    const-string v4, "carvis"

    invoke-direct {v1, v4, v2, v3}, Landroid/app/NotificationChannel;-><init>(Ljava/lang/String;Ljava/lang/CharSequence;I)V

    invoke-virtual {v0, v1}, Landroid/app/NotificationManager;->createNotificationChannel(Landroid/app/NotificationChannel;)V

    .line 84
    new-instance v1, Landroid/app/NotificationChannel;

    const-string v2, "Carvis uyand\u0131"

    const/4 v3, 0x4

    const-string v4, "carvis_uyan"

    invoke-direct {v1, v4, v2, v3}, Landroid/app/NotificationChannel;-><init>(Ljava/lang/String;Ljava/lang/CharSequence;I)V

    invoke-virtual {v0, v1}, Landroid/app/NotificationManager;->createNotificationChannel(Landroid/app/NotificationChannel;)V

    .line 86
    const-string v1, "\"Carvis\" deyince uyan\u0131r"

    invoke-virtual {p0, v1}, Lcom/dogac/bin1/CarvisServis;->bildirim(Ljava/lang/String;)Landroid/app/Notification;

    move-result-object v1

    .line 87
    .local v1, "n":Landroid/app/Notification;
    sget v2, Landroid/os/Build$VERSION;->SDK_INT:I

    const/16 v3, 0x1d

    const/4 v4, 0x1

    if-lt v2, v3, :cond_0

    const/16 v2, 0x80

    invoke-virtual {p0, v4, v1, v2}, Lcom/dogac/bin1/CarvisServis;->startForeground(ILandroid/app/Notification;I)V

    goto :goto_0

    .line 88
    :cond_0
    invoke-virtual {p0, v4, v1}, Lcom/dogac/bin1/CarvisServis;->startForeground(ILandroid/app/Notification;)V

    .line 89
    :goto_0
    new-instance v2, Ljava/lang/Thread;

    new-instance v3, Lcom/dogac/bin1/CarvisServis$$ExternalSyntheticLambda2;

    invoke-direct {v3, p0}, Lcom/dogac/bin1/CarvisServis$$ExternalSyntheticLambda2;-><init>(Lcom/dogac/bin1/CarvisServis;)V

    invoke-direct {v2, v3}, Ljava/lang/Thread;-><init>(Ljava/lang/Runnable;)V

    .line 95
    invoke-virtual {v2}, Ljava/lang/Thread;->start()V

    new-instance v2, Landroid/content/IntentFilter;

    invoke-direct {v2}, Landroid/content/IntentFilter;-><init>()V

    const-string v3, "android.app.action.INTERRUPTION_FILTER_CHANGED"

    invoke-virtual {v2, v3}, Landroid/content/IntentFilter;->addAction(Ljava/lang/String;)V

    new-instance v3, Lcom/dogac/bin1/CarvisServis$Alici;

    invoke-direct {v3, p0}, Lcom/dogac/bin1/CarvisServis$Alici;-><init>(Lcom/dogac/bin1/CarvisServis;)V

    iput-object v3, p0, Lcom/dogac/bin1/CarvisServis;->alici:Landroid/content/BroadcastReceiver;

    invoke-virtual {p0, v3, v2}, Lcom/dogac/bin1/CarvisServis;->registerReceiver(Landroid/content/BroadcastReceiver;Landroid/content/IntentFilter;)Landroid/content/Intent;

    .line 96
    return-void
.end method

.method public onDestroy()V
    .locals 1

    iget-object v0, p0, Lcom/dogac/bin1/CarvisServis;->alici:Landroid/content/BroadcastReceiver;

    if-eqz v0, :alici_yok

    :try_start_alici
    invoke-virtual {p0, v0}, Lcom/dogac/bin1/CarvisServis;->unregisterReceiver(Landroid/content/BroadcastReceiver;)V
    :try_end_alici
    .catch Ljava/lang/Exception; {:try_start_alici .. :try_end_alici} :alici_yok

    :alici_yok
    .line 211
    invoke-virtual {p0}, Lcom/dogac/bin1/CarvisServis;->durdur()V

    iget-object v0, p0, Lcom/dogac/bin1/CarvisServis;->model:Lorg/vosk/Model;

    if-eqz v0, :cond_0

    iget-object v0, p0, Lcom/dogac/bin1/CarvisServis;->model:Lorg/vosk/Model;

    invoke-virtual {v0}, Lorg/vosk/Model;->close()V

    :cond_0
    sget-object v0, Lcom/dogac/bin1/CarvisServis;->ornek:Lcom/dogac/bin1/CarvisServis;

    if-ne v0, p0, :cond_1

    const/4 v0, 0x0

    sput-object v0, Lcom/dogac/bin1/CarvisServis;->ornek:Lcom/dogac/bin1/CarvisServis;

    :cond_1
    invoke-super {p0}, Landroid/app/Service;->onDestroy()V

    return-void
.end method

.method public onError(Ljava/lang/Exception;)V
    .locals 4
    .param p1, "e"    # Ljava/lang/Exception;

    .line 179
    const-string v0, "Carvis"

    const-string v1, "vosk"

    invoke-static {v0, v1, p1}, Landroid/util/Log;->e(Ljava/lang/String;Ljava/lang/String;Ljava/lang/Throwable;)I

    invoke-virtual {p0}, Lcom/dogac/bin1/CarvisServis;->durdur()V

    iget-object v0, p0, Lcom/dogac/bin1/CarvisServis;->ana:Landroid/os/Handler;

    new-instance v1, Lcom/dogac/bin1/CarvisServis$$ExternalSyntheticLambda0;

    invoke-direct {v1, p0}, Lcom/dogac/bin1/CarvisServis$$ExternalSyntheticLambda0;-><init>(Lcom/dogac/bin1/CarvisServis;)V

    const-wide/16 v2, 0x7d0

    invoke-virtual {v0, v1, v2, v3}, Landroid/os/Handler;->postDelayed(Ljava/lang/Runnable;J)Z

    return-void
.end method

.method public onFinalResult(Ljava/lang/String;)V
    .locals 0
    .param p1, "json"    # Ljava/lang/String;

    .line 155
    invoke-virtual {p0, p1}, Lcom/dogac/bin1/CarvisServis;->kontrol(Ljava/lang/String;)V

    return-void
.end method

.method public onPartialResult(Ljava/lang/String;)V
    .locals 7
    .param p1, "json"    # Ljava/lang/String;

    .line 161
    :try_start_0
    new-instance v0, Lorg/json/JSONObject;

    invoke-direct {v0, p1}, Lorg/json/JSONObject;-><init>(Ljava/lang/String;)V

    const-string v1, "partial"

    const-string v2, ""

    invoke-virtual {v0, v1, v2}, Lorg/json/JSONObject;->optString(Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;

    move-result-object v0

    invoke-virtual {v0}, Ljava/lang/String;->trim()Ljava/lang/String;

    move-result-object v0

    .line 162
    .local v0, "t":Ljava/lang/String;
    invoke-virtual {v0}, Ljava/lang/String;->isEmpty()Z

    move-result v1

    const/4 v2, 0x0

    if-eqz v1, :cond_0

    new-array v1, v2, [Ljava/lang/String;

    goto :goto_0

    :cond_0
    const-string v1, "\\s+"

    invoke-virtual {v0, v1}, Ljava/lang/String;->split(Ljava/lang/String;)[Ljava/lang/String;

    move-result-object v1

    .line 163
    .local v1, "k":[Ljava/lang/String;
    :goto_0
    array-length v3, v1

    iget v4, p0, Lcom/dogac/bin1/CarvisServis;->kismiGorulen:I

    if-ge v3, v4, :cond_1

    iput v2, p0, Lcom/dogac/bin1/CarvisServis;->kismiGorulen:I

    .line 164
    :cond_1
    sget-boolean v2, Lcom/dogac/bin1/CarvisServis;->konusuyor:Z

    if-eqz v2, :cond_2

    array-length v2, v1

    if-lez v2, :cond_2

    const/4 v2, 0x1

    sput-boolean v2, Lcom/dogac/bin1/CarvisServis;->konusmaliCumle:Z

    .line 165
    :cond_2
    sget-boolean v2, Lcom/dogac/bin1/CarvisServis;->konusuyor:Z

    if-nez v2, :cond_3

    array-length v2, v1

    iput v2, p0, Lcom/dogac/bin1/CarvisServis;->kismiGorulen:I

    return-void

    .line 167
    :cond_3
    iget v2, p0, Lcom/dogac/bin1/CarvisServis;->kismiGorulen:I

    .local v2, "i":I
    :goto_1
    array-length v3, v1

    if-ge v2, v3, :cond_5

    .line 168
    const-string v3, "dinle"

    aget-object v4, v1, v2

    invoke-virtual {v3, v4}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v3

    if-eqz v3, :cond_4

    invoke-static {}, Ljava/lang/System;->currentTimeMillis()J

    move-result-wide v3

    iget-wide v5, p0, Lcom/dogac/bin1/CarvisServis;->sonKesme:J

    sub-long/2addr v3, v5

    const-wide/16 v5, 0x5dc

    cmp-long v3, v3, v5

    if-lez v3, :cond_4

    .line 169
    invoke-static {}, Ljava/lang/System;->currentTimeMillis()J

    move-result-wide v3

    iput-wide v3, p0, Lcom/dogac/bin1/CarvisServis;->sonKesme:J

    .line 170
    const-string v3, "Carvis"

    new-instance v4, Ljava/lang/StringBuilder;

    invoke-direct {v4}, Ljava/lang/StringBuilder;-><init>()V

    const-string v5, "s\u00f6z kesme (dinle): "

    invoke-virtual {v4, v5}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v4

    invoke-virtual {v4, v0}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v4

    invoke-virtual {v4}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v4

    invoke-static {v3, v4}, Landroid/util/Log;->i(Ljava/lang/String;Ljava/lang/String;)I

    .line 171
    sget-object v3, Lcom/dogac/bin1/MainActivity;->ornek:Lcom/dogac/bin1/MainActivity;

    .line 172
    .local v3, "a":Lcom/dogac/bin1/MainActivity;
    if-eqz v3, :cond_5

    const-string v4, "carvisYerel.dinleKomutu&&carvisYerel.dinleKomutu()"

    invoke-virtual {v3, v4}, Lcom/dogac/bin1/MainActivity;->js(Ljava/lang/String;)V

    goto :goto_2

    .line 167
    .end local v3    # "a":Lcom/dogac/bin1/MainActivity;
    :cond_4
    add-int/lit8 v2, v2, 0x1

    goto :goto_1

    .line 176
    .end local v2    # "i":I
    :cond_5
    :goto_2
    array-length v2, v1

    iput v2, p0, Lcom/dogac/bin1/CarvisServis;->kismiGorulen:I
    :try_end_0
    .catch Ljava/lang/Exception; {:try_start_0 .. :try_end_0} :catch_0

    .end local v0    # "t":Ljava/lang/String;
    .end local v1    # "k":[Ljava/lang/String;
    goto :goto_3

    .line 177
    :catch_0
    move-exception v0

    :goto_3
    nop

    .line 178
    return-void
.end method

.method public onResult(Ljava/lang/String;)V
    .locals 0
    .param p1, "json"    # Ljava/lang/String;

    .line 154
    invoke-virtual {p0, p1}, Lcom/dogac/bin1/CarvisServis;->kontrol(Ljava/lang/String;)V

    return-void
.end method

.method public onStartCommand(Landroid/content/Intent;II)I
    .locals 1
    .param p1, "i"    # Landroid/content/Intent;
    .param p2, "f"    # I
    .param p3, "id"    # I

    .line 210
    const/4 v0, 0x1

    return v0
.end method

.method public onTimeout()V
    .locals 0

    .line 180
    invoke-virtual {p0}, Lcom/dogac/bin1/CarvisServis;->durdur()V

    invoke-virtual {p0}, Lcom/dogac/bin1/CarvisServis;->baslat()V

    return-void
.end method

.method sessizMod()Z
    .locals 3

    .line 150
    const-string v0, "notification"

    invoke-virtual {p0, v0}, Lcom/dogac/bin1/CarvisServis;->getSystemService(Ljava/lang/String;)Ljava/lang/Object;

    move-result-object v0

    check-cast v0, Landroid/app/NotificationManager;

    .line 151
    .local v0, "n":Landroid/app/NotificationManager;
    invoke-virtual {v0}, Landroid/app/NotificationManager;->getCurrentInterruptionFilter()I

    move-result v1

    const/4 v2, 0x1

    if-eq v1, v2, :cond_0

    goto :goto_0

    :cond_0
    const/4 v2, 0x0

    :goto_0
    return v2
.end method


# --- eklendi: Rahatsız Etmeyin ve pil ---
.method dinlemeUygun()Z
    .locals 1

    invoke-virtual {p0}, Lcom/dogac/bin1/CarvisServis;->sessizMod()Z

    move-result v0

    xor-int/lit8 v0, v0, 0x1

    return v0
.end method

.method uykuMetni()Ljava/lang/String;
    .locals 1

    const-string v0, "Rahats\u0131z Etmeyin a\u00e7\u0131k: Carvis dinlemiyor"

    return-object v0
.end method

.method durumDegisti()V
    .locals 4

    invoke-virtual {p0}, Lcom/dogac/bin1/CarvisServis;->dinlemeUygun()Z

    move-result v0

    if-eqz v0, :kapat

    iget-boolean v0, p0, Lcom/dogac/bin1/CarvisServis;->birakildi:Z

    if-nez v0, :bitti

    iget-object v0, p0, Lcom/dogac/bin1/CarvisServis;->ana:Landroid/os/Handler;

    iget-object v1, p0, Lcom/dogac/bin1/CarvisServis;->baslatR:Ljava/lang/Runnable;

    invoke-virtual {v0, v1}, Landroid/os/Handler;->removeCallbacks(Ljava/lang/Runnable;)V

    const-wide/16 v2, 0x1f4

    invoke-virtual {v0, v1, v2, v3}, Landroid/os/Handler;->postDelayed(Ljava/lang/Runnable;J)Z

    :bitti
    return-void

    :kapat
    iget-object v0, p0, Lcom/dogac/bin1/CarvisServis;->ana:Landroid/os/Handler;

    iget-object v1, p0, Lcom/dogac/bin1/CarvisServis;->baslatR:Ljava/lang/Runnable;

    invoke-virtual {v0, v1}, Landroid/os/Handler;->removeCallbacks(Ljava/lang/Runnable;)V

    invoke-virtual {p0}, Lcom/dogac/bin1/CarvisServis;->durdur()V

    invoke-virtual {p0}, Lcom/dogac/bin1/CarvisServis;->uykuMetni()Ljava/lang/String;

    move-result-object v0

    invoke-virtual {p0, v0}, Lcom/dogac/bin1/CarvisServis;->guncelle(Ljava/lang/String;)V

    return-void
.end method
