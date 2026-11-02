.class public final Lcom/dogac/bin1/SpotifyYerel;
.super Ljava/lang/Object;
.source "SpotifyYerel.java"


# static fields
.field static final OYNAT_ETIKET:Ljava/util/List;
    .annotation system Ldalvik/annotation/Signature;
        value = {
            "Ljava/util/List<",
            "Ljava/lang/String;",
            ">;"
        }
    .end annotation
.end field

.field static final OYNAT_IDLER:[Ljava/lang/String;

.field static final PAKET:Ljava/lang/String; = "com.spotify.music"

.field static volatile denemeNo:I

.field static volatile dokum:Ljava/lang/String;

.field static volatile hedefAd:Ljava/lang/String;

.field static volatile listeSon:Ljava/lang/String;


# direct methods
.method static constructor <clinit>()V
    .locals 10

    .line 114
    const-string v0, ""

    sput-object v0, Lcom/dogac/bin1/SpotifyYerel;->listeSon:Ljava/lang/String;

    .line 115
    const-string v1, "com.spotify.music:id/button_play"

    const-string v2, "com.spotify.music:id/playlist_play_button"

    const-string v3, "com.spotify.music:id/button_play_and_pause"

    const-string v4, "com.spotify.music:id/play_button"

    const-string v5, "com.spotify.music:id/actionbar_play_button"

    filled-new-array {v3, v4, v5, v1, v2}, [Ljava/lang/String;

    move-result-object v1

    sput-object v1, Lcom/dogac/bin1/SpotifyYerel;->OYNAT_IDLER:[Ljava/lang/String;

    .line 116
    const-string v8, "kar\u0131\u015f\u0131k \u00e7al"

    const-string v9, "shuffle play"

    const-string v2, "\u00e7al"

    const-string v3, "play"

    const-string v4, "oynat"

    const-string v5, "\u00e7alma listesini \u00e7al"

    const-string v6, "play playlist"

    const-string v7, "listeyi \u00e7al"

    filled-new-array/range {v2 .. v9}, [Ljava/lang/String;

    move-result-object v1

    invoke-static {v1}, Ljava/util/Arrays;->asList([Ljava/lang/Object;)Ljava/util/List;

    move-result-object v1

    sput-object v1, Lcom/dogac/bin1/SpotifyYerel;->OYNAT_ETIKET:Ljava/util/List;

    .line 121
    sput-object v0, Lcom/dogac/bin1/SpotifyYerel;->hedefAd:Ljava/lang/String;

    .line 122
    const/4 v1, 0x0

    sput v1, Lcom/dogac/bin1/SpotifyYerel;->denemeNo:I

    .line 139
    sput-object v0, Lcom/dogac/bin1/SpotifyYerel;->dokum:Ljava/lang/String;

    return-void
.end method

.method public constructor <init>()V
    .locals 0

    .line 23
    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    return-void
.end method

.method public static bildirimIzniAc(Landroid/content/Context;)V
    .locals 2

    .line 105
    :try_start_0
    new-instance v0, Landroid/content/Intent;

    const-string v1, "android.settings.ACTION_NOTIFICATION_LISTENER_SETTINGS"

    invoke-direct {v0, v1}, Landroid/content/Intent;-><init>(Ljava/lang/String;)V

    const/high16 v1, 0x10000000

    invoke-virtual {v0, v1}, Landroid/content/Intent;->addFlags(I)Landroid/content/Intent;

    move-result-object v0

    invoke-virtual {p0, v0}, Landroid/content/Context;->startActivity(Landroid/content/Intent;)V
    :try_end_0
    .catch Ljava/lang/Exception; {:try_start_0 .. :try_end_0} :catch_0

    goto :goto_0

    :catch_0
    move-exception p0

    .line 106
    :goto_0
    return-void
.end method

.method static bul(Landroid/content/Context;)Landroid/media/session/MediaController;
    .locals 3

    .line 27
    const-string v0, "media_session"

    invoke-virtual {p0, v0}, Landroid/content/Context;->getSystemService(Ljava/lang/String;)Ljava/lang/Object;

    move-result-object v0

    check-cast v0, Landroid/media/session/MediaSessionManager;

    .line 28
    new-instance v1, Landroid/content/ComponentName;

    const-class v2, Lcom/dogac/bin1/CarvisBildirim;

    invoke-direct {v1, p0, v2}, Landroid/content/ComponentName;-><init>(Landroid/content/Context;Ljava/lang/Class;)V

    invoke-virtual {v0, v1}, Landroid/media/session/MediaSessionManager;->getActiveSessions(Landroid/content/ComponentName;)Ljava/util/List;

    move-result-object p0

    invoke-interface {p0}, Ljava/util/List;->iterator()Ljava/util/Iterator;

    move-result-object p0

    :goto_0
    invoke-interface {p0}, Ljava/util/Iterator;->hasNext()Z

    move-result v0

    if-eqz v0, :cond_1

    invoke-interface {p0}, Ljava/util/Iterator;->next()Ljava/lang/Object;

    move-result-object v0

    check-cast v0, Landroid/media/session/MediaController;

    .line 29
    const-string v1, "com.spotify.music"

    invoke-virtual {v0}, Landroid/media/session/MediaController;->getPackageName()Ljava/lang/String;

    move-result-object v2

    invoke-virtual {v1, v2}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v1

    if-eqz v1, :cond_0

    return-object v0

    .line 30
    :cond_0
    goto :goto_0

    .line 31
    :cond_1
    const/4 p0, 0x0

    return-object p0
.end method

.method public static cal(Landroid/content/Context;Ljava/lang/String;)Ljava/lang/String;
    .locals 1

    .line 37
    :try_start_0
    invoke-static {p0}, Lcom/dogac/bin1/SpotifyYerel;->bul(Landroid/content/Context;)Landroid/media/session/MediaController;

    move-result-object p0

    .line 38
    if-nez p0, :cond_0

    const-string p0, "oturum_yok"

    return-object p0

    .line 39
    :cond_0
    invoke-virtual {p0}, Landroid/media/session/MediaController;->getTransportControls()Landroid/media/session/MediaController$TransportControls;

    move-result-object p0

    new-instance v0, Landroid/os/Bundle;

    invoke-direct {v0}, Landroid/os/Bundle;-><init>()V

    invoke-virtual {p0, p1, v0}, Landroid/media/session/MediaController$TransportControls;->playFromSearch(Ljava/lang/String;Landroid/os/Bundle;)V

    .line 40
    const-string p0, "ok"
    :try_end_0
    .catch Ljava/lang/SecurityException; {:try_start_0 .. :try_end_0} :catch_1
    .catch Ljava/lang/Exception; {:try_start_0 .. :try_end_0} :catch_0

    return-object p0

    .line 41
    :catch_0
    move-exception p0

    new-instance p1, Ljava/lang/StringBuilder;

    invoke-direct {p1}, Ljava/lang/StringBuilder;-><init>()V

    const-string v0, "hata:"

    invoke-virtual {p1, v0}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object p1

    invoke-virtual {p0}, Ljava/lang/Exception;->getMessage()Ljava/lang/String;

    move-result-object p0

    invoke-virtual {p1, p0}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object p0

    invoke-virtual {p0}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object p0

    return-object p0

    :catch_1
    move-exception p0

    const-string p0, "izin_yok"

    return-object p0
.end method

.method static calEtiketi(Ljava/lang/String;)Z
    .locals 3

    .line 144
    const/4 v0, 0x0

    if-eqz p0, :cond_5

    invoke-virtual {p0}, Ljava/lang/String;->length()I

    move-result v1

    if-eqz v1, :cond_5

    invoke-virtual {p0}, Ljava/lang/String;->length()I

    move-result v1

    const/16 v2, 0x50

    if-le v1, v2, :cond_0

    goto :goto_0

    .line 145
    :cond_0
    const-string v1, ".*(duraklat|pause|ekle|add |sonraki|next|\u00f6nceki|previous|indir|download|payla\u015f|share|kar\u0131\u015ft\u0131r|shuffle off|takip|follow|radyo|radio).*"

    invoke-virtual {p0, v1}, Ljava/lang/String;->matches(Ljava/lang/String;)Z

    move-result v1

    if-eqz v1, :cond_1

    return v0

    .line 146
    :cond_1
    sget-object v1, Lcom/dogac/bin1/SpotifyYerel;->OYNAT_ETIKET:Ljava/util/List;

    invoke-interface {v1, p0}, Ljava/util/List;->contains(Ljava/lang/Object;)Z

    move-result v1

    const/4 v2, 0x1

    if-eqz v1, :cond_2

    return v2

    .line 147
    :cond_2
    const-string v1, "^(\u00e7al|play|oynat|dinle|ba\u015flat)( .*)?$"

    invoke-virtual {p0, v1}, Ljava/lang/String;->matches(Ljava/lang/String;)Z

    move-result v1

    if-nez v1, :cond_3

    const-string v1, "^.* (\u00e7al|oynat)$"

    invoke-virtual {p0, v1}, Ljava/lang/String;->matches(Ljava/lang/String;)Z

    move-result v1

    if-nez v1, :cond_3

    const-string v1, "^(\u00e7alma listesini|listeyi) (\u00e7al|oynat).*"

    invoke-virtual {p0, v1}, Ljava/lang/String;->matches(Ljava/lang/String;)Z

    move-result p0

    if-eqz p0, :cond_4

    :cond_3
    move v0, v2

    :cond_4
    return v0

    .line 144
    :cond_5
    :goto_0
    return v0
.end method

.method static dene(IJ)V
    .locals 2

    .line 151
    sget-object v0, Lcom/dogac/bin1/CarvisErisim;->ana:Landroid/os/Handler;

    new-instance v1, Lcom/dogac/bin1/SpotifyYerel$1;

    invoke-direct {v1, p0}, Lcom/dogac/bin1/SpotifyYerel$1;-><init>(I)V

    invoke-virtual {v0, v1, p1, p2}, Landroid/os/Handler;->postDelayed(Ljava/lang/Runnable;J)Z

    .line 160
    return-void
.end method

.method public static durum(Landroid/content/Context;)Ljava/lang/String;
    .locals 9

    .line 71
    const-string v0, "izin"

    new-instance v1, Lorg/json/JSONObject;

    invoke-direct {v1}, Lorg/json/JSONObject;-><init>()V

    .line 74
    const/4 v2, 0x0

    :try_start_0
    invoke-static {p0}, Lcom/dogac/bin1/SpotifyYerel;->bul(Landroid/content/Context;)Landroid/media/session/MediaController;

    move-result-object p0

    const/4 v3, 0x1

    invoke-virtual {v1, v0, v3}, Lorg/json/JSONObject;->put(Ljava/lang/String;Z)Lorg/json/JSONObject;
    :try_end_0
    .catch Ljava/lang/SecurityException; {:try_start_0 .. :try_end_0} :catch_1
    .catch Ljava/lang/Exception; {:try_start_0 .. :try_end_0} :catch_0

    .line 75
    :try_start_1
    const-string v0, "var"

    if-eqz p0, :cond_0

    move v4, v3

    goto :goto_0

    :cond_0
    move v4, v2

    :goto_0
    invoke-virtual {v1, v0, v4}, Lorg/json/JSONObject;->put(Ljava/lang/String;Z)Lorg/json/JSONObject;

    .line 76
    if-nez p0, :cond_1

    invoke-virtual {v1}, Lorg/json/JSONObject;->toString()Ljava/lang/String;

    move-result-object p0

    return-object p0

    .line 77
    :cond_1
    invoke-virtual {p0}, Landroid/media/session/MediaController;->getPlaybackState()Landroid/media/session/PlaybackState;

    move-result-object v0

    .line 78
    invoke-virtual {p0}, Landroid/media/session/MediaController;->getMetadata()Landroid/media/MediaMetadata;

    move-result-object p0

    .line 79
    if-eqz v0, :cond_6

    .line 80
    invoke-virtual {v0}, Landroid/media/session/PlaybackState;->getState()I

    move-result v4

    const/4 v5, 0x3

    if-ne v4, v5, :cond_2

    move v2, v3

    .line 81
    :cond_2
    invoke-virtual {v0}, Landroid/media/session/PlaybackState;->getPosition()J

    move-result-wide v3

    .line 82
    if-eqz v2, :cond_3

    invoke-virtual {v0}, Landroid/media/session/PlaybackState;->getLastPositionUpdateTime()J

    move-result-wide v5

    const-wide/16 v7, 0x0

    cmp-long v5, v5, v7

    if-lez v5, :cond_3

    invoke-static {}, Landroid/os/SystemClock;->elapsedRealtime()J

    move-result-wide v5

    invoke-virtual {v0}, Landroid/media/session/PlaybackState;->getLastPositionUpdateTime()J

    move-result-wide v7

    sub-long/2addr v5, v7

    long-to-float v5, v5

    invoke-virtual {v0}, Landroid/media/session/PlaybackState;->getPlaybackSpeed()F

    move-result v6

    mul-float/2addr v5, v6

    float-to-long v5, v5

    add-long/2addr v3, v5

    .line 83
    :cond_3
    const-string v5, "calisiyor"

    invoke-virtual {v1, v5, v2}, Lorg/json/JSONObject;->put(Ljava/lang/String;Z)Lorg/json/JSONObject;

    const-string v2, "durum"

    invoke-virtual {v0}, Landroid/media/session/PlaybackState;->getState()I

    move-result v5

    invoke-virtual {v1, v2, v5}, Lorg/json/JSONObject;->put(Ljava/lang/String;I)Lorg/json/JSONObject;

    const-string v2, "konum"

    invoke-virtual {v1, v2, v3, v4}, Lorg/json/JSONObject;->put(Ljava/lang/String;J)Lorg/json/JSONObject;

    const-string v2, "eylemler"

    invoke-virtual {v0}, Landroid/media/session/PlaybackState;->getActions()J

    move-result-wide v3

    invoke-virtual {v1, v2, v3, v4}, Lorg/json/JSONObject;->put(Ljava/lang/String;J)Lorg/json/JSONObject;

    .line 84
    invoke-virtual {v0}, Landroid/media/session/PlaybackState;->getErrorMessage()Ljava/lang/CharSequence;

    move-result-object v2

    if-eqz v2, :cond_4

    const-string v3, "hataMesaji"

    invoke-interface {v2}, Ljava/lang/CharSequence;->toString()Ljava/lang/String;

    move-result-object v2

    invoke-virtual {v1, v3, v2}, Lorg/json/JSONObject;->put(Ljava/lang/String;Ljava/lang/Object;)Lorg/json/JSONObject;

    .line 85
    :cond_4
    invoke-virtual {v0}, Landroid/media/session/PlaybackState;->getExtras()Landroid/os/Bundle;

    move-result-object v0

    if-eqz v0, :cond_6

    new-instance v2, Ljava/lang/StringBuilder;

    invoke-direct {v2}, Ljava/lang/StringBuilder;-><init>()V

    invoke-virtual {v0}, Landroid/os/Bundle;->keySet()Ljava/util/Set;

    move-result-object v3

    invoke-interface {v3}, Ljava/util/Set;->iterator()Ljava/util/Iterator;

    move-result-object v3

    :goto_1
    invoke-interface {v3}, Ljava/util/Iterator;->hasNext()Z

    move-result v4

    if-eqz v4, :cond_5

    invoke-interface {v3}, Ljava/util/Iterator;->next()Ljava/lang/Object;

    move-result-object v4

    check-cast v4, Ljava/lang/String;

    invoke-virtual {v0, v4}, Landroid/os/Bundle;->get(Ljava/lang/String;)Ljava/lang/Object;

    move-result-object v5

    invoke-virtual {v2, v4}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v4

    const-string v6, "="

    invoke-virtual {v4, v6}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v4

    invoke-static {v5}, Ljava/lang/String;->valueOf(Ljava/lang/Object;)Ljava/lang/String;

    move-result-object v5

    invoke-virtual {v4, v5}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v4

    const-string v5, "; "

    invoke-virtual {v4, v5}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    goto :goto_1

    :cond_5
    invoke-virtual {v2}, Ljava/lang/StringBuilder;->length()I

    move-result v0

    if-lez v0, :cond_6

    const-string v0, "ekler"

    invoke-virtual {v2}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v2

    invoke-virtual {v1, v0, v2}, Lorg/json/JSONObject;->put(Ljava/lang/String;Ljava/lang/Object;)Lorg/json/JSONObject;

    .line 87
    :cond_6
    if-eqz p0, :cond_9

    .line 88
    const-string v0, "baslik"

    const-string v2, "android.media.metadata.TITLE"

    invoke-virtual {p0, v2}, Landroid/media/MediaMetadata;->getString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v2

    invoke-virtual {v1, v0, v2}, Lorg/json/JSONObject;->put(Ljava/lang/String;Ljava/lang/Object;)Lorg/json/JSONObject;

    .line 89
    const-string v0, "android.media.metadata.ARTIST"

    invoke-virtual {p0, v0}, Landroid/media/MediaMetadata;->getString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v0

    .line 90
    const-string v2, "sanatci"

    if-eqz v0, :cond_7

    :goto_2
    goto :goto_3

    :cond_7
    const-string v0, "android.media.metadata.ALBUM_ARTIST"

    invoke-virtual {p0, v0}, Landroid/media/MediaMetadata;->getString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v0

    goto :goto_2

    :goto_3
    invoke-virtual {v1, v2, v0}, Lorg/json/JSONObject;->put(Ljava/lang/String;Ljava/lang/Object;)Lorg/json/JSONObject;

    .line 91
    const-string v0, "album"

    const-string v2, "android.media.metadata.ALBUM"

    invoke-virtual {p0, v2}, Landroid/media/MediaMetadata;->getString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v2

    invoke-virtual {v1, v0, v2}, Lorg/json/JSONObject;->put(Ljava/lang/String;Ljava/lang/Object;)Lorg/json/JSONObject;

    .line 92
    const-string v0, "sure"

    const-string v2, "android.media.metadata.DURATION"

    invoke-virtual {p0, v2}, Landroid/media/MediaMetadata;->getLong(Ljava/lang/String;)J

    move-result-wide v2

    invoke-virtual {v1, v0, v2, v3}, Lorg/json/JSONObject;->put(Ljava/lang/String;J)Lorg/json/JSONObject;

    .line 93
    const-string v0, "android.media.metadata.ALBUM_ART_URI"

    invoke-virtual {p0, v0}, Landroid/media/MediaMetadata;->getString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v0

    .line 94
    if-nez v0, :cond_8

    const-string v0, "android.media.metadata.ART_URI"

    invoke-virtual {p0, v0}, Landroid/media/MediaMetadata;->getString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v0

    .line 95
    :cond_8
    if-eqz v0, :cond_9

    const-string p0, "http"

    invoke-virtual {v0, p0}, Ljava/lang/String;->startsWith(Ljava/lang/String;)Z

    move-result p0

    if-eqz p0, :cond_9

    const-string p0, "kapak"

    invoke-virtual {v1, p0, v0}, Lorg/json/JSONObject;->put(Ljava/lang/String;Ljava/lang/Object;)Lorg/json/JSONObject;

    .line 99
    :cond_9
    goto :goto_5

    .line 97
    :catch_0
    move-exception p0

    goto :goto_4

    .line 74
    :catch_1
    move-exception p0

    invoke-virtual {v1, v0, v2}, Lorg/json/JSONObject;->put(Ljava/lang/String;Z)Lorg/json/JSONObject;

    invoke-virtual {v1}, Lorg/json/JSONObject;->toString()Ljava/lang/String;

    move-result-object p0
    :try_end_1
    .catch Ljava/lang/Exception; {:try_start_1 .. :try_end_1} :catch_0

    return-object p0

    .line 98
    :goto_4
    :try_start_2
    const-string v0, "hata"

    invoke-virtual {p0}, Ljava/lang/Exception;->getMessage()Ljava/lang/String;

    move-result-object p0

    invoke-static {p0}, Ljava/lang/String;->valueOf(Ljava/lang/Object;)Ljava/lang/String;

    move-result-object p0

    invoke-virtual {v1, v0, p0}, Lorg/json/JSONObject;->put(Ljava/lang/String;Ljava/lang/Object;)Lorg/json/JSONObject;
    :try_end_2
    .catch Ljava/lang/Exception; {:try_start_2 .. :try_end_2} :catch_2

    goto :goto_5

    :catch_2
    move-exception p0

    .line 100
    :goto_5
    invoke-virtual {v1}, Lorg/json/JSONObject;->toString()Ljava/lang/String;

    move-result-object p0

    return-object p0
.end method

.method static etiket(Landroid/view/accessibility/AccessibilityNodeInfo;)Ljava/lang/String;
    .locals 2

    .line 171
    invoke-virtual {p0}, Landroid/view/accessibility/AccessibilityNodeInfo;->getContentDescription()Ljava/lang/CharSequence;

    move-result-object v0

    .line 172
    if-nez v0, :cond_0

    invoke-virtual {p0}, Landroid/view/accessibility/AccessibilityNodeInfo;->getText()Ljava/lang/CharSequence;

    move-result-object v0

    .line 173
    :cond_0
    if-nez v0, :cond_1

    const/4 p0, 0x0

    goto :goto_0

    :cond_1
    invoke-interface {v0}, Ljava/lang/CharSequence;->toString()Ljava/lang/String;

    move-result-object p0

    invoke-virtual {p0}, Ljava/lang/String;->trim()Ljava/lang/String;

    move-result-object p0

    new-instance v0, Ljava/util/Locale;

    const-string v1, "tr"

    invoke-direct {v0, v1}, Ljava/util/Locale;-><init>(Ljava/lang/String;)V

    invoke-virtual {p0, v0}, Ljava/lang/String;->toLowerCase(Ljava/util/Locale;)Ljava/lang/String;

    move-result-object p0

    :goto_0
    return-object p0
.end method

.method public static komut(Landroid/content/Context;Ljava/lang/String;)Ljava/lang/String;
    .locals 1

    .line 57
    :try_start_0
    invoke-static {p0}, Lcom/dogac/bin1/SpotifyYerel;->bul(Landroid/content/Context;)Landroid/media/session/MediaController;

    move-result-object p0

    .line 58
    if-nez p0, :cond_0

    const-string p0, "oturum_yok"

    return-object p0

    .line 59
    :cond_0
    invoke-virtual {p0}, Landroid/media/session/MediaController;->getTransportControls()Landroid/media/session/MediaController$TransportControls;

    move-result-object p0

    .line 60
    const-string v0, "oynat"

    invoke-virtual {v0, p1}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    if-eqz v0, :cond_1

    invoke-virtual {p0}, Landroid/media/session/MediaController$TransportControls;->play()V

    goto :goto_0

    .line 61
    :cond_1
    const-string v0, "duraklat"

    invoke-virtual {v0, p1}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    if-eqz v0, :cond_2

    invoke-virtual {p0}, Landroid/media/session/MediaController$TransportControls;->pause()V

    goto :goto_0

    .line 62
    :cond_2
    const-string v0, "sonraki"

    invoke-virtual {v0, p1}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    if-eqz v0, :cond_3

    invoke-virtual {p0}, Landroid/media/session/MediaController$TransportControls;->skipToNext()V

    goto :goto_0

    .line 63
    :cond_3
    const-string v0, "onceki"

    invoke-virtual {v0, p1}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result p1

    if-eqz p1, :cond_4

    invoke-virtual {p0}, Landroid/media/session/MediaController$TransportControls;->skipToPrevious()V

    .line 65
    :goto_0
    const-string p0, "ok"

    return-object p0

    .line 64
    :cond_4
    const-string p0, "hata:komut"
    :try_end_0
    .catch Ljava/lang/SecurityException; {:try_start_0 .. :try_end_0} :catch_1
    .catch Ljava/lang/Exception; {:try_start_0 .. :try_end_0} :catch_0

    return-object p0

    .line 66
    :catch_0
    move-exception p0

    new-instance p1, Ljava/lang/StringBuilder;

    invoke-direct {p1}, Ljava/lang/StringBuilder;-><init>()V

    const-string v0, "hata:"

    invoke-virtual {p1, v0}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object p1

    invoke-virtual {p0}, Ljava/lang/Exception;->getMessage()Ljava/lang/String;

    move-result-object p0

    invoke-virtual {p1, p0}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object p0

    invoke-virtual {p0}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object p0

    return-object p0

    :catch_1
    move-exception p0

    const-string p0, "izin_yok"

    return-object p0
.end method

.method static listeAc(Landroid/content/Context;Ljava/lang/String;)Ljava/lang/String;
    .locals 2

    .line 129
    sget-object v0, Lcom/dogac/bin1/CarvisErisim;->ornek:Lcom/dogac/bin1/CarvisErisim;

    if-nez v0, :cond_0

    const-string p0, "erisim_yok"

    return-object p0

    .line 130
    :cond_0
    const/4 v0, 0x0

    sput v0, Lcom/dogac/bin1/SpotifyYerel;->denemeNo:I

    .line 132
    :try_start_0
    new-instance v0, Landroid/content/Intent;

    const-string v1, "android.intent.action.VIEW"

    invoke-static {p1}, Landroid/net/Uri;->parse(Ljava/lang/String;)Landroid/net/Uri;

    move-result-object p1

    invoke-direct {v0, v1, p1}, Landroid/content/Intent;-><init>(Ljava/lang/String;Landroid/net/Uri;)V

    const-string p1, "com.spotify.music"

    invoke-virtual {v0, p1}, Landroid/content/Intent;->setPackage(Ljava/lang/String;)Landroid/content/Intent;

    move-result-object p1

    const/high16 v0, 0x10000000

    invoke-virtual {p1, v0}, Landroid/content/Intent;->addFlags(I)Landroid/content/Intent;

    move-result-object p1

    invoke-virtual {p0, p1}, Landroid/content/Context;->startActivity(Landroid/content/Intent;)V
    :try_end_0
    .catch Ljava/lang/Exception; {:try_start_0 .. :try_end_0} :catch_0

    .line 133
    nop

    .line 134
    const-string p0, "aciliyor"

    sput-object p0, Lcom/dogac/bin1/SpotifyYerel;->listeSon:Ljava/lang/String;

    .line 135
    const/16 p0, 0x24

    const-wide/16 v0, 0x640

    invoke-static {p0, v0, v1}, Lcom/dogac/bin1/SpotifyYerel;->dene(IJ)V

    .line 136
    const-string p0, "ok"

    return-object p0

    .line 133
    :catch_0
    move-exception p0

    new-instance p1, Ljava/lang/StringBuilder;

    invoke-direct {p1}, Ljava/lang/StringBuilder;-><init>()V

    const-string v0, "hata:"

    invoke-virtual {p1, v0}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object p1

    invoke-virtual {p0}, Ljava/lang/Exception;->getMessage()Ljava/lang/String;

    move-result-object p0

    invoke-virtual {p1, p0}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object p0

    invoke-virtual {p0}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object p0

    return-object p0
.end method

.method public static listeCal(Landroid/content/Context;Ljava/lang/String;)Ljava/lang/String;
    .locals 1

    .line 127
    const-string v0, ""

    sput-object v0, Lcom/dogac/bin1/SpotifyYerel;->hedefAd:Ljava/lang/String;

    invoke-static {p0, p1}, Lcom/dogac/bin1/SpotifyYerel;->listeAc(Landroid/content/Context;Ljava/lang/String;)Ljava/lang/String;

    move-result-object p0

    return-object p0
.end method

.method public static listeDurum()Ljava/lang/String;
    .locals 2

    .line 140
    sget-object v0, Lcom/dogac/bin1/SpotifyYerel;->listeSon:Ljava/lang/String;

    const-string v1, "bulunamadi"

    invoke-virtual {v0, v1}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    if-eqz v0, :cond_0

    sget-object v0, Lcom/dogac/bin1/SpotifyYerel;->dokum:Ljava/lang/String;

    invoke-virtual {v0}, Ljava/lang/String;->length()I

    move-result v0

    if-lez v0, :cond_0

    new-instance v0, Ljava/lang/StringBuilder;

    invoke-direct {v0}, Ljava/lang/StringBuilder;-><init>()V

    const-string v1, "bulunamadi | ekrandaki dokunulabilirler: "

    invoke-virtual {v0, v1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v0

    sget-object v1, Lcom/dogac/bin1/SpotifyYerel;->dokum:Ljava/lang/String;

    invoke-virtual {v0, v1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v0

    invoke-virtual {v0}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v0

    goto :goto_0

    :cond_0
    sget-object v0, Lcom/dogac/bin1/SpotifyYerel;->listeSon:Ljava/lang/String;

    :goto_0
    return-object v0
.end method

.method public static listeSarkiCal(Landroid/content/Context;Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;
    .locals 2

    .line 124
    if-nez p2, :cond_0

    const-string p2, ""

    goto :goto_0

    :cond_0
    invoke-virtual {p2}, Ljava/lang/String;->trim()Ljava/lang/String;

    move-result-object p2

    new-instance v0, Ljava/util/Locale;

    const-string v1, "tr"

    invoke-direct {v0, v1}, Ljava/util/Locale;-><init>(Ljava/lang/String;)V

    invoke-virtual {p2, v0}, Ljava/lang/String;->toLowerCase(Ljava/util/Locale;)Ljava/lang/String;

    move-result-object p2

    :goto_0
    sput-object p2, Lcom/dogac/bin1/SpotifyYerel;->hedefAd:Ljava/lang/String;

    .line 125
    invoke-static {p0, p1}, Lcom/dogac/bin1/SpotifyYerel;->listeAc(Landroid/content/Context;Ljava/lang/String;)Ljava/lang/String;

    move-result-object p0

    return-object p0
.end method

.method static sagPanelde(Landroid/view/accessibility/AccessibilityNodeInfo;)Z
    .locals 2

    .line 163
    nop

    :goto_0
    if-eqz p0, :cond_2

    .line 164
    invoke-virtual {p0}, Landroid/view/accessibility/AccessibilityNodeInfo;->getViewIdResourceName()Ljava/lang/String;

    move-result-object v0

    .line 165
    if-eqz v0, :cond_1

    sget-object v1, Ljava/util/Locale;->ROOT:Ljava/util/Locale;

    invoke-virtual {v0, v1}, Ljava/lang/String;->toLowerCase(Ljava/util/Locale;)Ljava/lang/String;

    move-result-object v0

    const-string v1, "now_playing"

    invoke-virtual {v0, v1}, Ljava/lang/String;->contains(Ljava/lang/CharSequence;)Z

    move-result v1

    if-nez v1, :cond_0

    const-string v1, "nowplaying"

    invoke-virtual {v0, v1}, Ljava/lang/String;->contains(Ljava/lang/CharSequence;)Z

    move-result v1

    if-nez v1, :cond_0

    const-string v1, "npv"

    invoke-virtual {v0, v1}, Ljava/lang/String;->contains(Ljava/lang/CharSequence;)Z

    move-result v1

    if-nez v1, :cond_0

    const-string v1, "mini"

    invoke-virtual {v0, v1}, Ljava/lang/String;->contains(Ljava/lang/CharSequence;)Z

    move-result v1

    if-nez v1, :cond_0

    const-string v1, "connect_device"

    invoke-virtual {v0, v1}, Ljava/lang/String;->contains(Ljava/lang/CharSequence;)Z

    move-result v0

    if-eqz v0, :cond_1

    :cond_0
    const/4 p0, 0x1

    return p0

    .line 163
    :cond_1
    invoke-virtual {p0}, Landroid/view/accessibility/AccessibilityNodeInfo;->getParent()Landroid/view/accessibility/AccessibilityNodeInfo;

    move-result-object p0

    goto :goto_0

    .line 167
    :cond_2
    const/4 p0, 0x0

    return p0
.end method

.method static sarkiyaDokun(Landroid/view/accessibility/AccessibilityNodeInfo;Ljava/util/List;II)Ljava/lang/String;
    .locals 16
    .annotation system Ldalvik/annotation/Signature;
        value = {
            "(",
            "Landroid/view/accessibility/AccessibilityNodeInfo;",
            "Ljava/util/List<",
            "Landroid/view/accessibility/AccessibilityNodeInfo;",
            ">;II)",
            "Ljava/lang/String;"
        }
    .end annotation

    .line 187
    move/from16 v0, p2

    move/from16 v1, p3

    new-instance v2, Landroid/graphics/Rect;

    invoke-direct {v2}, Landroid/graphics/Rect;-><init>()V

    .line 188
    nop

    .line 190
    sget-object v3, Lcom/dogac/bin1/SpotifyYerel;->hedefAd:Ljava/lang/String;

    invoke-virtual {v3}, Ljava/lang/String;->length()I

    move-result v3

    const-wide v4, 0x3fe6666666666666L    # 0.7

    const-wide v6, 0x3fe999999999999aL    # 0.8

    const v9, 0x7fffffff

    if-lez v3, :cond_7

    .line 191
    invoke-interface/range {p1 .. p1}, Ljava/util/List;->iterator()Ljava/util/Iterator;

    move-result-object v3

    const/4 v10, 0x0

    const/4 v11, 0x0

    :cond_0
    :goto_0
    invoke-interface {v3}, Ljava/util/Iterator;->hasNext()Z

    move-result v12

    if-eqz v12, :cond_8

    invoke-interface {v3}, Ljava/util/Iterator;->next()Ljava/lang/Object;

    move-result-object v12

    check-cast v12, Landroid/view/accessibility/AccessibilityNodeInfo;

    .line 192
    invoke-virtual {v12}, Landroid/view/accessibility/AccessibilityNodeInfo;->getText()Ljava/lang/CharSequence;

    move-result-object v13

    if-eqz v13, :cond_0

    invoke-virtual {v12}, Landroid/view/accessibility/AccessibilityNodeInfo;->isVisibleToUser()Z

    move-result v14

    if-nez v14, :cond_1

    goto :goto_0

    .line 193
    :cond_1
    invoke-interface {v13}, Ljava/lang/CharSequence;->toString()Ljava/lang/String;

    move-result-object v13

    invoke-virtual {v13}, Ljava/lang/String;->trim()Ljava/lang/String;

    move-result-object v13

    new-instance v14, Ljava/util/Locale;

    const-string v15, "tr"

    invoke-direct {v14, v15}, Ljava/util/Locale;-><init>(Ljava/lang/String;)V

    invoke-virtual {v13, v14}, Ljava/lang/String;->toLowerCase(Ljava/util/Locale;)Ljava/lang/String;

    move-result-object v13

    .line 194
    sget-object v14, Lcom/dogac/bin1/SpotifyYerel;->hedefAd:Ljava/lang/String;

    invoke-virtual {v13, v14}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v14

    if-nez v14, :cond_3

    sget-object v14, Lcom/dogac/bin1/SpotifyYerel;->hedefAd:Ljava/lang/String;

    invoke-virtual {v13, v14}, Ljava/lang/String;->startsWith(Ljava/lang/String;)Z

    move-result v14

    if-nez v14, :cond_3

    invoke-virtual {v13}, Ljava/lang/String;->length()I

    move-result v14

    const/4 v15, 0x3

    if-le v14, v15, :cond_2

    sget-object v14, Lcom/dogac/bin1/SpotifyYerel;->hedefAd:Ljava/lang/String;

    invoke-virtual {v14, v13}, Ljava/lang/String;->startsWith(Ljava/lang/String;)Z

    move-result v14

    if-nez v14, :cond_3

    :cond_2
    goto :goto_0

    .line 195
    :cond_3
    invoke-virtual {v12, v2}, Landroid/view/accessibility/AccessibilityNodeInfo;->getBoundsInScreen(Landroid/graphics/Rect;)V

    .line 196
    invoke-virtual {v2}, Landroid/graphics/Rect;->isEmpty()Z

    move-result v14

    if-nez v14, :cond_0

    iget v14, v2, Landroid/graphics/Rect;->top:I

    int-to-double v14, v14

    move/from16 p1, v9

    int-to-double v8, v1

    mul-double/2addr v8, v6

    cmpl-double v8, v14, v8

    if-gtz v8, :cond_6

    invoke-virtual {v2}, Landroid/graphics/Rect;->centerX()I

    move-result v8

    int-to-double v8, v8

    int-to-double v14, v0

    mul-double/2addr v14, v4

    cmpl-double v8, v8, v14

    if-gtz v8, :cond_6

    invoke-static {v12}, Lcom/dogac/bin1/SpotifyYerel;->sagPanelde(Landroid/view/accessibility/AccessibilityNodeInfo;)Z

    move-result v8

    if-eqz v8, :cond_4

    move/from16 v9, p1

    goto :goto_0

    .line 197
    :cond_4
    iget v8, v2, Landroid/graphics/Rect;->top:I

    move/from16 v9, p1

    if-ge v8, v9, :cond_5

    iget v9, v2, Landroid/graphics/Rect;->top:I

    new-instance v8, Ljava/lang/StringBuilder;

    invoke-direct {v8}, Ljava/lang/StringBuilder;-><init>()V

    const-string v10, "\u015fark\u0131 ad\u0131 \'"

    invoke-virtual {v8, v10}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v8

    invoke-virtual {v8, v13}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v8

    const-string v10, "\'"

    invoke-virtual {v8, v10}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v8

    invoke-virtual {v8}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v8

    move-object v11, v8

    move-object v10, v12

    .line 198
    :cond_5
    goto/16 :goto_0

    .line 196
    :cond_6
    move/from16 v9, p1

    goto/16 :goto_0

    .line 190
    :cond_7
    const/4 v10, 0x0

    const/4 v11, 0x0

    .line 201
    :cond_8
    if-nez v10, :cond_c

    sget v3, Lcom/dogac/bin1/SpotifyYerel;->denemeNo:I

    const/4 v8, 0x6

    if-lt v3, v8, :cond_c

    .line 202
    const-string v3, "com.spotify.music:id/row_root"

    move-object/from16 v8, p0

    invoke-virtual {v8, v3}, Landroid/view/accessibility/AccessibilityNodeInfo;->findAccessibilityNodeInfosByViewId(Ljava/lang/String;)Ljava/util/List;

    move-result-object v3

    invoke-interface {v3}, Ljava/util/List;->iterator()Ljava/util/Iterator;

    move-result-object v3

    :cond_9
    :goto_1
    invoke-interface {v3}, Ljava/util/Iterator;->hasNext()Z

    move-result v8

    if-eqz v8, :cond_c

    invoke-interface {v3}, Ljava/util/Iterator;->next()Ljava/lang/Object;

    move-result-object v8

    check-cast v8, Landroid/view/accessibility/AccessibilityNodeInfo;

    .line 203
    invoke-virtual {v8, v2}, Landroid/view/accessibility/AccessibilityNodeInfo;->getBoundsInScreen(Landroid/graphics/Rect;)V

    .line 204
    invoke-virtual {v8}, Landroid/view/accessibility/AccessibilityNodeInfo;->isVisibleToUser()Z

    move-result v12

    if-eqz v12, :cond_9

    invoke-virtual {v2}, Landroid/graphics/Rect;->isEmpty()Z

    move-result v12

    if-nez v12, :cond_9

    iget v12, v2, Landroid/graphics/Rect;->top:I

    int-to-double v12, v12

    int-to-double v14, v1

    mul-double/2addr v14, v6

    cmpl-double v12, v12, v14

    if-gtz v12, :cond_9

    invoke-virtual {v2}, Landroid/graphics/Rect;->centerX()I

    move-result v12

    int-to-double v12, v12

    int-to-double v14, v0

    mul-double/2addr v14, v4

    cmpl-double v12, v12, v14

    if-gtz v12, :cond_9

    invoke-static {v8}, Lcom/dogac/bin1/SpotifyYerel;->sagPanelde(Landroid/view/accessibility/AccessibilityNodeInfo;)Z

    move-result v12

    if-eqz v12, :cond_a

    goto :goto_1

    .line 205
    :cond_a
    iget v12, v2, Landroid/graphics/Rect;->top:I

    if-ge v12, v9, :cond_b

    iget v9, v2, Landroid/graphics/Rect;->top:I

    const-string v11, "en \u00fcstteki sat\u0131r (row_root)"

    move-object v10, v8

    .line 206
    :cond_b
    goto :goto_1

    .line 208
    :cond_c
    if-nez v10, :cond_d

    const/4 v0, 0x0

    return-object v0

    .line 209
    :cond_d
    const/4 v0, 0x0

    new-instance v1, Landroid/graphics/Rect;

    invoke-direct {v1}, Landroid/graphics/Rect;-><init>()V

    invoke-virtual {v10, v1}, Landroid/view/accessibility/AccessibilityNodeInfo;->getBoundsInScreen(Landroid/graphics/Rect;)V

    .line 210
    invoke-static {v10}, Lcom/dogac/bin1/CarvisErisim;->tiklaDugum(Landroid/view/accessibility/AccessibilityNodeInfo;)Z

    move-result v2

    if-eqz v2, :cond_e

    new-instance v0, Ljava/lang/StringBuilder;

    invoke-direct {v0}, Ljava/lang/StringBuilder;-><init>()V

    invoke-virtual {v0, v11}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v0

    const-string v2, " @"

    invoke-virtual {v0, v2}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v0

    invoke-virtual {v1}, Landroid/graphics/Rect;->centerX()I

    move-result v2

    invoke-virtual {v0, v2}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    move-result-object v0

    const-string v2, ","

    invoke-virtual {v0, v2}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v0

    iget v1, v1, Landroid/graphics/Rect;->top:I

    invoke-virtual {v0, v1}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    move-result-object v0

    invoke-virtual {v0}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v8

    goto :goto_2

    :cond_e
    move-object v8, v0

    :goto_2
    return-object v8
.end method

.method static tikla()Ljava/lang/String;
    .locals 31

    .line 214
    sget-object v0, Lcom/dogac/bin1/CarvisErisim;->ornek:Lcom/dogac/bin1/CarvisErisim;

    .line 215
    const/4 v1, 0x0

    if-nez v0, :cond_0

    return-object v1

    .line 216
    :cond_0
    invoke-virtual {v0}, Lcom/dogac/bin1/CarvisErisim;->getRootInActiveWindow()Landroid/view/accessibility/AccessibilityNodeInfo;

    move-result-object v2

    .line 217
    if-nez v2, :cond_1

    return-object v1

    .line 218
    :cond_1
    invoke-virtual {v2}, Landroid/view/accessibility/AccessibilityNodeInfo;->getPackageName()Ljava/lang/CharSequence;

    move-result-object v3

    .line 219
    if-eqz v3, :cond_2a

    const-string v4, "com.spotify.music"

    invoke-virtual {v4, v3}, Ljava/lang/String;->contentEquals(Ljava/lang/CharSequence;)Z

    move-result v4

    if-nez v4, :cond_2

    goto/16 :goto_12

    .line 220
    :cond_2
    sget v3, Lcom/dogac/bin1/SpotifyYerel;->denemeNo:I

    const/4 v4, 0x1

    add-int/2addr v3, v4

    sput v3, Lcom/dogac/bin1/SpotifyYerel;->denemeNo:I

    .line 221
    invoke-virtual {v0}, Lcom/dogac/bin1/CarvisErisim;->getResources()Landroid/content/res/Resources;

    move-result-object v3

    invoke-virtual {v3}, Landroid/content/res/Resources;->getDisplayMetrics()Landroid/util/DisplayMetrics;

    move-result-object v3

    iget v3, v3, Landroid/util/DisplayMetrics;->heightPixels:I

    invoke-virtual {v0}, Lcom/dogac/bin1/CarvisErisim;->getResources()Landroid/content/res/Resources;

    move-result-object v0

    invoke-virtual {v0}, Landroid/content/res/Resources;->getDisplayMetrics()Landroid/util/DisplayMetrics;

    move-result-object v0

    iget v0, v0, Landroid/util/DisplayMetrics;->widthPixels:I

    .line 222
    new-instance v5, Ljava/util/ArrayList;

    invoke-direct {v5}, Ljava/util/ArrayList;-><init>()V

    const/4 v6, 0x0

    invoke-static {v2, v5, v6}, Lcom/dogac/bin1/SpotifyYerel;->topla(Landroid/view/accessibility/AccessibilityNodeInfo;Ljava/util/List;I)V

    .line 223
    sget-object v7, Lcom/dogac/bin1/SpotifyYerel;->hedefAd:Ljava/lang/String;

    invoke-virtual {v7}, Ljava/lang/String;->length()I

    move-result v7

    const/16 v8, 0x1e

    const-string v9, "] "

    const-string v10, " y="

    const-string v11, "\' x="

    if-lez v7, :cond_8

    .line 224
    invoke-static {v2, v5, v0, v3}, Lcom/dogac/bin1/SpotifyYerel;->sarkiyaDokun(Landroid/view/accessibility/AccessibilityNodeInfo;Ljava/util/List;II)Ljava/lang/String;

    move-result-object v0

    .line 225
    if-eqz v0, :cond_3

    return-object v0

    .line 227
    :cond_3
    new-instance v0, Ljava/lang/StringBuilder;

    invoke-direct {v0}, Ljava/lang/StringBuilder;-><init>()V

    const-string v2, "\u015fark\u0131 sat\u0131r\u0131 aran\u0131yor ("

    invoke-virtual {v0, v2}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v0

    sget v2, Lcom/dogac/bin1/SpotifyYerel;->denemeNo:I

    invoke-virtual {v0, v2}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    move-result-object v0

    const-string v2, ")"

    invoke-virtual {v0, v2}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v0

    invoke-virtual {v0}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v0

    sput-object v0, Lcom/dogac/bin1/SpotifyYerel;->listeSon:Ljava/lang/String;

    .line 228
    sget v0, Lcom/dogac/bin1/SpotifyYerel;->denemeNo:I

    if-lt v0, v8, :cond_7

    .line 229
    new-instance v0, Ljava/lang/StringBuilder;

    invoke-direct {v0}, Ljava/lang/StringBuilder;-><init>()V

    new-instance v2, Landroid/graphics/Rect;

    invoke-direct {v2}, Landroid/graphics/Rect;-><init>()V

    .line 230
    invoke-interface {v5}, Ljava/util/List;->iterator()Ljava/util/Iterator;

    move-result-object v3

    :cond_4
    :goto_0
    invoke-interface {v3}, Ljava/util/Iterator;->hasNext()Z

    move-result v4

    if-eqz v4, :cond_6

    invoke-interface {v3}, Ljava/util/Iterator;->next()Ljava/lang/Object;

    move-result-object v4

    check-cast v4, Landroid/view/accessibility/AccessibilityNodeInfo;

    invoke-virtual {v4}, Landroid/view/accessibility/AccessibilityNodeInfo;->getText()Ljava/lang/CharSequence;

    move-result-object v5

    if-eqz v5, :cond_4

    invoke-virtual {v4}, Landroid/view/accessibility/AccessibilityNodeInfo;->isVisibleToUser()Z

    move-result v7

    if-nez v7, :cond_5

    goto :goto_0

    :cond_5
    invoke-virtual {v4, v2}, Landroid/view/accessibility/AccessibilityNodeInfo;->getBoundsInScreen(Landroid/graphics/Rect;)V

    const-string v4, "[\'"

    invoke-virtual {v0, v4}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v4

    invoke-virtual {v4, v5}, Ljava/lang/StringBuilder;->append(Ljava/lang/CharSequence;)Ljava/lang/StringBuilder;

    move-result-object v4

    invoke-virtual {v4, v11}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v4

    invoke-virtual {v2}, Landroid/graphics/Rect;->centerX()I

    move-result v5

    invoke-virtual {v4, v5}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    move-result-object v4

    invoke-virtual {v4, v10}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v4

    iget v5, v2, Landroid/graphics/Rect;->top:I

    invoke-virtual {v4, v5}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    move-result-object v4

    invoke-virtual {v4, v9}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    add-int/lit8 v6, v6, 0x1

    const/16 v4, 0x19

    if-lt v6, v4, :cond_4

    .line 231
    :cond_6
    invoke-virtual {v0}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v0

    sput-object v0, Lcom/dogac/bin1/SpotifyYerel;->dokum:Ljava/lang/String;

    .line 233
    :cond_7
    return-object v1

    .line 235
    :cond_8
    nop

    .line 236
    new-instance v2, Ljava/lang/StringBuilder;

    invoke-direct {v2}, Ljava/lang/StringBuilder;-><init>()V

    .line 237
    new-instance v7, Landroid/graphics/Rect;

    invoke-direct {v7}, Landroid/graphics/Rect;-><init>()V

    .line 238
    invoke-interface {v5}, Ljava/util/List;->iterator()Ljava/util/Iterator;

    move-result-object v12

    const/16 v13, 0x63

    const v14, 0x7fffffff

    move-object v15, v1

    move v1, v6

    move-object v6, v15

    :goto_1
    invoke-interface {v12}, Ljava/util/Iterator;->hasNext()Z

    move-result v16

    const-string v8, " \'"

    const-string v17, "-"

    const-string v4, "["

    move-object/from16 v19, v6

    const-string v20, ""

    if-eqz v16, :cond_1d

    invoke-interface {v12}, Ljava/util/Iterator;->next()Ljava/lang/Object;

    move-result-object v16

    move-object/from16 v6, v16

    check-cast v6, Landroid/view/accessibility/AccessibilityNodeInfo;

    .line 239
    invoke-virtual {v6}, Landroid/view/accessibility/AccessibilityNodeInfo;->isVisibleToUser()Z

    move-result v16

    if-nez v16, :cond_9

    move-object/from16 v22, v5

    move-object/from16 v16, v12

    move v4, v14

    move-object/from16 v23, v15

    move-object v12, v10

    move v14, v13

    move-object v13, v9

    goto/16 :goto_c

    .line 240
    :cond_9
    move-object/from16 v16, v12

    invoke-virtual {v6}, Landroid/view/accessibility/AccessibilityNodeInfo;->getViewIdResourceName()Ljava/lang/String;

    move-result-object v12

    move-object/from16 v22, v5

    if-nez v12, :cond_a

    move-object/from16 v5, v20

    goto :goto_2

    :cond_a
    const/16 v5, 0x2f

    invoke-virtual {v12, v5}, Ljava/lang/String;->indexOf(I)I

    move-result v5

    const/16 v18, 0x1

    add-int/lit8 v5, v5, 0x1

    invoke-virtual {v12, v5}, Ljava/lang/String;->substring(I)Ljava/lang/String;

    move-result-object v5

    .line 241
    :goto_2
    move-object/from16 v23, v15

    invoke-static {v6}, Lcom/dogac/bin1/SpotifyYerel;->etiket(Landroid/view/accessibility/AccessibilityNodeInfo;)Ljava/lang/String;

    move-result-object v15

    .line 242
    if-eqz v12, :cond_b

    sget-object v21, Lcom/dogac/bin1/SpotifyYerel;->OYNAT_IDLER:[Ljava/lang/String;

    move/from16 v24, v14

    invoke-static/range {v21 .. v21}, Ljava/util/Arrays;->asList([Ljava/lang/Object;)Ljava/util/List;

    move-result-object v14

    invoke-interface {v14, v12}, Ljava/util/List;->contains(Ljava/lang/Object;)Z

    move-result v12

    if-eqz v12, :cond_c

    const/4 v12, 0x1

    goto :goto_3

    :cond_b
    move/from16 v24, v14

    :cond_c
    const/4 v12, 0x0

    .line 243
    :goto_3
    if-nez v12, :cond_d

    invoke-static {v15}, Lcom/dogac/bin1/SpotifyYerel;->calEtiketi(Ljava/lang/String;)Z

    move-result v14

    if-nez v14, :cond_d

    move-object v12, v10

    move v14, v13

    move/from16 v4, v24

    move-object v13, v9

    goto/16 :goto_c

    .line 244
    :cond_d
    invoke-virtual {v6, v7}, Landroid/view/accessibility/AccessibilityNodeInfo;->getBoundsInScreen(Landroid/graphics/Rect;)V

    .line 245
    invoke-virtual {v7}, Landroid/graphics/Rect;->isEmpty()Z

    move-result v14

    if-nez v14, :cond_1c

    iget v14, v7, Landroid/graphics/Rect;->top:I

    move/from16 v25, v13

    int-to-double v13, v14

    move-object/from16 v26, v9

    move-object/from16 v27, v10

    int-to-double v9, v3

    const-wide v28, 0x3fe70a3d70a3d70aL    # 0.72

    mul-double v9, v9, v28

    cmpl-double v9, v13, v9

    if-gtz v9, :cond_1b

    invoke-static {v6}, Lcom/dogac/bin1/SpotifyYerel;->sagPanelde(Landroid/view/accessibility/AccessibilityNodeInfo;)Z

    move-result v9

    if-eqz v9, :cond_e

    move/from16 v4, v24

    move/from16 v14, v25

    move-object/from16 v13, v26

    move-object/from16 v12, v27

    goto/16 :goto_c

    .line 246
    :cond_e
    invoke-virtual {v7}, Landroid/graphics/Rect;->centerX()I

    move-result v9

    int-to-double v9, v9

    int-to-double v13, v0

    const-wide v28, 0x3fe4cccccccccccdL    # 0.65

    mul-double v13, v13, v28

    cmpg-double v9, v9, v13

    if-gez v9, :cond_f

    const/4 v9, 0x1

    goto :goto_4

    :cond_f
    const/4 v9, 0x0

    .line 247
    :goto_4
    if-eqz v15, :cond_10

    const-string v10, "carvis"

    invoke-virtual {v15, v10}, Ljava/lang/String;->contains(Ljava/lang/CharSequence;)Z

    move-result v10

    if-eqz v10, :cond_10

    const/4 v9, 0x0

    goto :goto_5

    :cond_10
    if-nez v9, :cond_11

    const/4 v9, 0x5

    goto :goto_5

    :cond_11
    if-eqz v12, :cond_12

    const/4 v9, 0x1

    goto :goto_5

    :cond_12
    const/4 v9, 0x2

    .line 248
    :goto_5
    add-int/lit8 v10, v1, 0x1

    const/16 v12, 0x8

    if-ge v1, v12, :cond_15

    invoke-virtual {v2, v4}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v1

    invoke-virtual {v5}, Ljava/lang/String;->length()I

    move-result v4

    if-lez v4, :cond_13

    move-object v4, v5

    goto :goto_6

    :cond_13
    move-object/from16 v4, v17

    :goto_6
    invoke-virtual {v1, v4}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v1

    invoke-virtual {v1, v8}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v1

    if-nez v15, :cond_14

    move-object/from16 v4, v20

    goto :goto_7

    :cond_14
    move-object v4, v15

    :goto_7
    invoke-virtual {v1, v4}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v1

    invoke-virtual {v1, v11}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v1

    invoke-virtual {v7}, Landroid/graphics/Rect;->centerX()I

    move-result v4

    invoke-virtual {v1, v4}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    move-result-object v1

    move-object/from16 v12, v27

    invoke-virtual {v1, v12}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v1

    iget v4, v7, Landroid/graphics/Rect;->top:I

    invoke-virtual {v1, v4}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    move-result-object v1

    const-string v4, " p="

    invoke-virtual {v1, v4}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v1

    invoke-virtual {v1, v9}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    move-result-object v1

    move-object/from16 v13, v26

    invoke-virtual {v1, v13}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    goto :goto_8

    :cond_15
    move-object/from16 v13, v26

    move-object/from16 v12, v27

    .line 249
    :goto_8
    move/from16 v14, v25

    if-lt v9, v14, :cond_18

    if-ne v9, v14, :cond_16

    iget v1, v7, Landroid/graphics/Rect;->top:I

    move/from16 v4, v24

    if-ge v1, v4, :cond_17

    goto :goto_9

    :cond_16
    move/from16 v4, v24

    .line 250
    :cond_17
    move v9, v14

    move-object/from16 v6, v19

    move-object/from16 v15, v23

    move v14, v4

    goto :goto_b

    .line 249
    :cond_18
    :goto_9
    iget v1, v7, Landroid/graphics/Rect;->top:I

    new-instance v4, Ljava/lang/StringBuilder;

    invoke-direct {v4}, Ljava/lang/StringBuilder;-><init>()V

    invoke-virtual {v5}, Ljava/lang/String;->length()I

    move-result v8

    if-lez v8, :cond_19

    goto :goto_a

    :cond_19
    move-object/from16 v5, v20

    :goto_a
    invoke-virtual {v4, v5}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v4

    const-string v5, "\'"

    invoke-virtual {v4, v5}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v4

    if-nez v15, :cond_1a

    move-object/from16 v15, v20

    :cond_1a
    invoke-virtual {v4, v15}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v4

    invoke-virtual {v4, v5}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v4

    invoke-virtual {v4}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v4

    move v14, v1

    move-object v15, v6

    move-object v6, v4

    .line 250
    :goto_b
    move v1, v10

    move-object v10, v12

    move-object/from16 v12, v16

    move-object/from16 v5, v22

    const/4 v4, 0x1

    const/16 v8, 0x1e

    move-object/from16 v30, v13

    move v13, v9

    move-object/from16 v9, v30

    goto/16 :goto_1

    .line 245
    :cond_1b
    move/from16 v4, v24

    move/from16 v14, v25

    move-object/from16 v13, v26

    move-object/from16 v12, v27

    goto :goto_c

    :cond_1c
    move-object v12, v10

    move v14, v13

    move/from16 v4, v24

    move-object v13, v9

    .line 238
    :goto_c
    move-object v10, v12

    move-object v9, v13

    move v13, v14

    move-object/from16 v12, v16

    move-object/from16 v6, v19

    move-object/from16 v5, v22

    move-object/from16 v15, v23

    const/16 v8, 0x1e

    move v14, v4

    const/4 v4, 0x1

    goto/16 :goto_1

    .line 251
    :cond_1d
    move-object/from16 v22, v5

    move-object v12, v10

    move v14, v13

    move-object/from16 v23, v15

    move-object v13, v9

    if-nez v23, :cond_28

    .line 252
    const-string v0, "araniyor"

    sput-object v0, Lcom/dogac/bin1/SpotifyYerel;->listeSon:Ljava/lang/String;

    .line 253
    nop

    .line 254
    new-instance v0, Ljava/lang/StringBuilder;

    invoke-direct {v0}, Ljava/lang/StringBuilder;-><init>()V

    .line 255
    invoke-interface/range {v22 .. v22}, Ljava/util/List;->iterator()Ljava/util/Iterator;

    move-result-object v1

    const/4 v6, 0x0

    :cond_1e
    :goto_d
    invoke-interface {v1}, Ljava/util/Iterator;->hasNext()Z

    move-result v2

    if-eqz v2, :cond_27

    invoke-interface {v1}, Ljava/util/Iterator;->next()Ljava/lang/Object;

    move-result-object v2

    check-cast v2, Landroid/view/accessibility/AccessibilityNodeInfo;

    .line 256
    invoke-virtual {v2}, Landroid/view/accessibility/AccessibilityNodeInfo;->isClickable()Z

    move-result v3

    if-nez v3, :cond_1f

    invoke-virtual {v2}, Landroid/view/accessibility/AccessibilityNodeInfo;->getActionList()Ljava/util/List;

    move-result-object v3

    sget-object v5, Landroid/view/accessibility/AccessibilityNodeInfo$AccessibilityAction;->ACTION_CLICK:Landroid/view/accessibility/AccessibilityNodeInfo$AccessibilityAction;

    invoke-interface {v3, v5}, Ljava/util/List;->contains(Ljava/lang/Object;)Z

    move-result v3

    if-eqz v3, :cond_1e

    :cond_1f
    invoke-virtual {v2}, Landroid/view/accessibility/AccessibilityNodeInfo;->isVisibleToUser()Z

    move-result v3

    if-nez v3, :cond_20

    goto :goto_d

    .line 257
    :cond_20
    invoke-virtual {v2, v7}, Landroid/view/accessibility/AccessibilityNodeInfo;->getBoundsInScreen(Landroid/graphics/Rect;)V

    .line 258
    invoke-virtual {v2}, Landroid/view/accessibility/AccessibilityNodeInfo;->getViewIdResourceName()Ljava/lang/String;

    move-result-object v3

    invoke-static {v2}, Lcom/dogac/bin1/SpotifyYerel;->etiket(Landroid/view/accessibility/AccessibilityNodeInfo;)Ljava/lang/String;

    move-result-object v5

    .line 259
    if-eqz v3, :cond_21

    invoke-virtual {v3}, Ljava/lang/String;->length()I

    move-result v9

    if-nez v9, :cond_22

    :cond_21
    if-nez v5, :cond_22

    goto :goto_d

    .line 260
    :cond_22
    invoke-virtual {v0, v4}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v9

    if-nez v3, :cond_23

    move-object/from16 v3, v17

    const/16 v10, 0x2f

    const/4 v15, 0x1

    goto :goto_e

    :cond_23
    const/16 v10, 0x2f

    invoke-virtual {v3, v10}, Ljava/lang/String;->indexOf(I)I

    move-result v14

    const/4 v15, 0x1

    add-int/2addr v14, v15

    invoke-virtual {v3, v14}, Ljava/lang/String;->substring(I)Ljava/lang/String;

    move-result-object v3

    :goto_e
    invoke-virtual {v9, v3}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v3

    invoke-virtual {v3, v8}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v3

    if-nez v5, :cond_24

    move-object/from16 v5, v20

    :cond_24
    invoke-virtual {v3, v5}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v3

    invoke-virtual {v3, v11}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v3

    invoke-virtual {v7}, Landroid/graphics/Rect;->centerX()I

    move-result v5

    invoke-virtual {v3, v5}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    move-result-object v3

    invoke-virtual {v3, v12}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v3

    iget v5, v7, Landroid/graphics/Rect;->top:I

    invoke-virtual {v3, v5}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    move-result-object v3

    invoke-static {v2}, Lcom/dogac/bin1/SpotifyYerel;->sagPanelde(Landroid/view/accessibility/AccessibilityNodeInfo;)Z

    move-result v2

    if-eqz v2, :cond_25

    const-string v2, " panel"

    goto :goto_f

    :cond_25
    move-object/from16 v2, v20

    :goto_f
    invoke-virtual {v3, v2}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v2

    invoke-virtual {v2, v13}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    .line 261
    add-int/lit8 v6, v6, 0x1

    const/16 v2, 0x1e

    if-lt v6, v2, :cond_26

    goto :goto_10

    .line 262
    :cond_26
    goto/16 :goto_d

    .line 263
    :cond_27
    :goto_10
    invoke-virtual {v0}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v0

    sput-object v0, Lcom/dogac/bin1/SpotifyYerel;->dokum:Ljava/lang/String;

    .line 264
    const/4 v0, 0x0

    return-object v0

    .line 266
    :cond_28
    new-instance v0, Landroid/graphics/Rect;

    invoke-direct {v0}, Landroid/graphics/Rect;-><init>()V

    move-object/from16 v1, v23

    invoke-virtual {v1, v0}, Landroid/view/accessibility/AccessibilityNodeInfo;->getBoundsInScreen(Landroid/graphics/Rect;)V

    .line 267
    new-instance v3, Ljava/lang/StringBuilder;

    invoke-direct {v3}, Ljava/lang/StringBuilder;-><init>()V

    move-object/from16 v6, v19

    invoke-virtual {v3, v6}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v3

    const-string v4, " @"

    invoke-virtual {v3, v4}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v3

    invoke-virtual {v0}, Landroid/graphics/Rect;->centerX()I

    move-result v4

    invoke-virtual {v3, v4}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    move-result-object v3

    const-string v4, ","

    invoke-virtual {v3, v4}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v3

    iget v0, v0, Landroid/graphics/Rect;->top:I

    invoke-virtual {v3, v0}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    move-result-object v0

    const-string v3, " (puan "

    invoke-virtual {v0, v3}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v0

    invoke-virtual {v0, v14}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    move-result-object v0

    const-string v3, ") | adaylar: "

    invoke-virtual {v0, v3}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v0

    invoke-virtual {v0, v2}, Ljava/lang/StringBuilder;->append(Ljava/lang/Object;)Ljava/lang/StringBuilder;

    move-result-object v0

    invoke-virtual {v0}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v0

    .line 268
    invoke-static {v1}, Lcom/dogac/bin1/CarvisErisim;->tiklaDugum(Landroid/view/accessibility/AccessibilityNodeInfo;)Z

    move-result v1

    if-eqz v1, :cond_29

    move-object v1, v0

    goto :goto_11

    :cond_29
    const/4 v1, 0x0

    :goto_11
    return-object v1

    .line 219
    :cond_2a
    :goto_12
    new-instance v0, Ljava/lang/StringBuilder;

    invoke-direct {v0}, Ljava/lang/StringBuilder;-><init>()V

    const-string v1, "bekleniyor:"

    invoke-virtual {v0, v1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v0

    invoke-virtual {v0, v3}, Ljava/lang/StringBuilder;->append(Ljava/lang/Object;)Ljava/lang/StringBuilder;

    move-result-object v0

    invoke-virtual {v0}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v0

    sput-object v0, Lcom/dogac/bin1/SpotifyYerel;->listeSon:Ljava/lang/String;

    const/4 v0, 0x0

    return-object v0
.end method

.method static topla(Landroid/view/accessibility/AccessibilityNodeInfo;Ljava/util/List;I)V
    .locals 3
    .annotation system Ldalvik/annotation/Signature;
        value = {
            "(",
            "Landroid/view/accessibility/AccessibilityNodeInfo;",
            "Ljava/util/List<",
            "Landroid/view/accessibility/AccessibilityNodeInfo;",
            ">;I)V"
        }
    .end annotation

    .line 177
    if-eqz p0, :cond_2

    const/16 v0, 0x28

    if-le p2, v0, :cond_0

    goto :goto_1

    .line 178
    :cond_0
    invoke-interface {p1, p0}, Ljava/util/List;->add(Ljava/lang/Object;)Z

    .line 179
    const/4 v0, 0x0

    :goto_0
    invoke-virtual {p0}, Landroid/view/accessibility/AccessibilityNodeInfo;->getChildCount()I

    move-result v1

    if-ge v0, v1, :cond_1

    invoke-virtual {p0, v0}, Landroid/view/accessibility/AccessibilityNodeInfo;->getChild(I)Landroid/view/accessibility/AccessibilityNodeInfo;

    move-result-object v1

    add-int/lit8 v2, p2, 0x1

    invoke-static {v1, p1, v2}, Lcom/dogac/bin1/SpotifyYerel;->topla(Landroid/view/accessibility/AccessibilityNodeInfo;Ljava/util/List;I)V

    add-int/lit8 v0, v0, 0x1

    goto :goto_0

    .line 180
    :cond_1
    return-void

    .line 177
    :cond_2
    :goto_1
    return-void
.end method

.method public static uri(Landroid/content/Context;Ljava/lang/String;)Ljava/lang/String;
    .locals 1

    .line 47
    :try_start_0
    invoke-static {p0}, Lcom/dogac/bin1/SpotifyYerel;->bul(Landroid/content/Context;)Landroid/media/session/MediaController;

    move-result-object p0

    .line 48
    if-nez p0, :cond_0

    const-string p0, "oturum_yok"

    return-object p0

    .line 49
    :cond_0
    invoke-virtual {p0}, Landroid/media/session/MediaController;->getTransportControls()Landroid/media/session/MediaController$TransportControls;

    move-result-object p0

    invoke-static {p1}, Landroid/net/Uri;->parse(Ljava/lang/String;)Landroid/net/Uri;

    move-result-object p1

    new-instance v0, Landroid/os/Bundle;

    invoke-direct {v0}, Landroid/os/Bundle;-><init>()V

    invoke-virtual {p0, p1, v0}, Landroid/media/session/MediaController$TransportControls;->playFromUri(Landroid/net/Uri;Landroid/os/Bundle;)V

    .line 50
    const-string p0, "ok"
    :try_end_0
    .catch Ljava/lang/SecurityException; {:try_start_0 .. :try_end_0} :catch_1
    .catch Ljava/lang/Exception; {:try_start_0 .. :try_end_0} :catch_0

    return-object p0

    .line 51
    :catch_0
    move-exception p0

    new-instance p1, Ljava/lang/StringBuilder;

    invoke-direct {p1}, Ljava/lang/StringBuilder;-><init>()V

    const-string v0, "hata:"

    invoke-virtual {p1, v0}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object p1

    invoke-virtual {p0}, Ljava/lang/Exception;->getMessage()Ljava/lang/String;

    move-result-object p0

    invoke-virtual {p1, p0}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object p0

    invoke-virtual {p0}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object p0

    return-object p0

    :catch_1
    move-exception p0

    const-string p0, "izin_yok"

    return-object p0
.end method

.method public static yuklu(Landroid/content/Context;)Z
    .locals 2

    .line 110
    const/4 v0, 0x0

    :try_start_0
    invoke-virtual {p0}, Landroid/content/Context;->getPackageManager()Landroid/content/pm/PackageManager;

    move-result-object p0

    const-string v1, "com.spotify.music"

    invoke-virtual {p0, v1, v0}, Landroid/content/pm/PackageManager;->getPackageInfo(Ljava/lang/String;I)Landroid/content/pm/PackageInfo;
    :try_end_0
    .catch Ljava/lang/Exception; {:try_start_0 .. :try_end_0} :catch_0

    const/4 p0, 0x1

    return p0

    :catch_0
    move-exception p0

    return v0
.end method
