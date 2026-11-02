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

.field static volatile dokum:Ljava/lang/String;

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

    .line 129
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

    .line 134
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

    .line 135
    :cond_0
    const-string v1, ".*(duraklat|pause|ekle|add |sonraki|next|\u00f6nceki|previous|indir|download|payla\u015f|share|kar\u0131\u015ft\u0131r|shuffle off|takip|follow|radyo|radio).*"

    invoke-virtual {p0, v1}, Ljava/lang/String;->matches(Ljava/lang/String;)Z

    move-result v1

    if-eqz v1, :cond_1

    return v0

    .line 136
    :cond_1
    sget-object v1, Lcom/dogac/bin1/SpotifyYerel;->OYNAT_ETIKET:Ljava/util/List;

    invoke-interface {v1, p0}, Ljava/util/List;->contains(Ljava/lang/Object;)Z

    move-result v1

    const/4 v2, 0x1

    if-eqz v1, :cond_2

    return v2

    .line 137
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

    .line 134
    :cond_5
    :goto_0
    return v0
.end method

.method static dene(IJ)V
    .locals 2

    .line 141
    sget-object v0, Lcom/dogac/bin1/CarvisErisim;->ana:Landroid/os/Handler;

    new-instance v1, Lcom/dogac/bin1/SpotifyYerel$1;

    invoke-direct {v1, p0}, Lcom/dogac/bin1/SpotifyYerel$1;-><init>(I)V

    invoke-virtual {v0, v1, p1, p2}, Landroid/os/Handler;->postDelayed(Ljava/lang/Runnable;J)Z

    .line 150
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

    .line 161
    invoke-virtual {p0}, Landroid/view/accessibility/AccessibilityNodeInfo;->getContentDescription()Ljava/lang/CharSequence;

    move-result-object v0

    .line 162
    if-nez v0, :cond_0

    invoke-virtual {p0}, Landroid/view/accessibility/AccessibilityNodeInfo;->getText()Ljava/lang/CharSequence;

    move-result-object v0

    .line 163
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

.method public static listeCal(Landroid/content/Context;Ljava/lang/String;)Ljava/lang/String;
    .locals 2

    .line 120
    sget-object v0, Lcom/dogac/bin1/CarvisErisim;->ornek:Lcom/dogac/bin1/CarvisErisim;

    if-nez v0, :cond_0

    const-string p0, "erisim_yok"

    return-object p0

    .line 122
    :cond_0
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

    .line 123
    nop

    .line 124
    const-string p0, "aciliyor"

    sput-object p0, Lcom/dogac/bin1/SpotifyYerel;->listeSon:Ljava/lang/String;

    .line 125
    const/16 p0, 0x24

    const-wide/16 v0, 0x640

    invoke-static {p0, v0, v1}, Lcom/dogac/bin1/SpotifyYerel;->dene(IJ)V

    .line 126
    const-string p0, "ok"

    return-object p0

    .line 123
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

.method public static listeDurum()Ljava/lang/String;
    .locals 2

    .line 130
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

.method static sagPanelde(Landroid/view/accessibility/AccessibilityNodeInfo;)Z
    .locals 2

    .line 153
    nop

    :goto_0
    if-eqz p0, :cond_2

    .line 154
    invoke-virtual {p0}, Landroid/view/accessibility/AccessibilityNodeInfo;->getViewIdResourceName()Ljava/lang/String;

    move-result-object v0

    .line 155
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

    .line 153
    :cond_1
    invoke-virtual {p0}, Landroid/view/accessibility/AccessibilityNodeInfo;->getParent()Landroid/view/accessibility/AccessibilityNodeInfo;

    move-result-object p0

    goto :goto_0

    .line 157
    :cond_2
    const/4 p0, 0x0

    return p0
.end method

.method static tikla()Ljava/lang/String;
    .locals 20

    .line 174
    sget-object v0, Lcom/dogac/bin1/CarvisErisim;->ornek:Lcom/dogac/bin1/CarvisErisim;

    .line 175
    const/4 v1, 0x0

    if-nez v0, :cond_0

    return-object v1

    .line 176
    :cond_0
    invoke-virtual {v0}, Lcom/dogac/bin1/CarvisErisim;->getRootInActiveWindow()Landroid/view/accessibility/AccessibilityNodeInfo;

    move-result-object v2

    .line 177
    if-nez v2, :cond_1

    return-object v1

    .line 178
    :cond_1
    invoke-virtual {v2}, Landroid/view/accessibility/AccessibilityNodeInfo;->getPackageName()Ljava/lang/CharSequence;

    move-result-object v3

    .line 179
    if-eqz v3, :cond_1c

    const-string v4, "com.spotify.music"

    invoke-virtual {v4, v3}, Ljava/lang/String;->contentEquals(Ljava/lang/CharSequence;)Z

    move-result v4

    if-nez v4, :cond_2

    goto/16 :goto_b

    .line 180
    :cond_2
    invoke-virtual {v0}, Lcom/dogac/bin1/CarvisErisim;->getResources()Landroid/content/res/Resources;

    move-result-object v0

    invoke-virtual {v0}, Landroid/content/res/Resources;->getDisplayMetrics()Landroid/util/DisplayMetrics;

    move-result-object v0

    iget v0, v0, Landroid/util/DisplayMetrics;->heightPixels:I

    .line 181
    nop

    .line 182
    new-instance v3, Landroid/graphics/Rect;

    invoke-direct {v3}, Landroid/graphics/Rect;-><init>()V

    .line 183
    sget-object v4, Lcom/dogac/bin1/SpotifyYerel;->OYNAT_IDLER:[Ljava/lang/String;

    array-length v5, v4

    const v7, 0x7fffffff

    move-object v9, v1

    move-object v10, v9

    const/4 v8, 0x0

    :goto_0
    const/16 v11, 0x2f

    const-wide v12, 0x3fe70a3d70a3d70aL    # 0.72

    if-ge v8, v5, :cond_8

    aget-object v14, v4, v8

    .line 184
    invoke-virtual {v2, v14}, Landroid/view/accessibility/AccessibilityNodeInfo;->findAccessibilityNodeInfosByViewId(Ljava/lang/String;)Ljava/util/List;

    move-result-object v15

    invoke-interface {v15}, Ljava/util/List;->iterator()Ljava/util/Iterator;

    move-result-object v15

    :goto_1
    invoke-interface {v15}, Ljava/util/Iterator;->hasNext()Z

    move-result v16

    if-eqz v16, :cond_7

    invoke-interface {v15}, Ljava/util/Iterator;->next()Ljava/lang/Object;

    move-result-object v16

    move-object/from16 v1, v16

    check-cast v1, Landroid/view/accessibility/AccessibilityNodeInfo;

    .line 185
    invoke-virtual {v1, v3}, Landroid/view/accessibility/AccessibilityNodeInfo;->getBoundsInScreen(Landroid/graphics/Rect;)V

    .line 186
    invoke-virtual {v1}, Landroid/view/accessibility/AccessibilityNodeInfo;->isVisibleToUser()Z

    move-result v16

    if-eqz v16, :cond_5

    invoke-virtual {v3}, Landroid/graphics/Rect;->isEmpty()Z

    move-result v16

    if-nez v16, :cond_5

    iget v6, v3, Landroid/graphics/Rect;->top:I

    move-object/from16 v17, v4

    move/from16 v18, v5

    int-to-double v4, v6

    move-object v6, v9

    move-object/from16 v19, v10

    int-to-double v9, v0

    mul-double/2addr v9, v12

    cmpl-double v4, v4, v9

    if-gtz v4, :cond_6

    invoke-static {v1}, Lcom/dogac/bin1/SpotifyYerel;->sagPanelde(Landroid/view/accessibility/AccessibilityNodeInfo;)Z

    move-result v4

    if-eqz v4, :cond_3

    goto :goto_3

    .line 187
    :cond_3
    iget v4, v3, Landroid/graphics/Rect;->top:I

    if-ge v4, v7, :cond_4

    iget v7, v3, Landroid/graphics/Rect;->top:I

    invoke-virtual {v14, v11}, Ljava/lang/String;->indexOf(I)I

    move-result v4

    add-int/lit8 v4, v4, 0x1

    invoke-virtual {v14, v4}, Ljava/lang/String;->substring(I)Ljava/lang/String;

    move-result-object v4

    move-object v9, v1

    move-object v10, v4

    goto :goto_2

    :cond_4
    move-object v9, v6

    move-object/from16 v10, v19

    .line 188
    :goto_2
    move-object/from16 v4, v17

    move/from16 v5, v18

    const/4 v1, 0x0

    goto :goto_1

    .line 186
    :cond_5
    move-object/from16 v17, v4

    move/from16 v18, v5

    move-object v6, v9

    move-object/from16 v19, v10

    .line 184
    :cond_6
    :goto_3
    move-object v9, v6

    move-object/from16 v4, v17

    move/from16 v5, v18

    move-object/from16 v10, v19

    const/4 v1, 0x0

    goto :goto_1

    .line 183
    :cond_7
    move-object/from16 v17, v4

    move/from16 v18, v5

    move-object v6, v9

    move-object/from16 v19, v10

    add-int/lit8 v8, v8, 0x1

    const/4 v1, 0x0

    goto :goto_0

    .line 190
    :cond_8
    if-nez v9, :cond_f

    .line 191
    new-instance v1, Ljava/util/ArrayList;

    invoke-direct {v1}, Ljava/util/ArrayList;-><init>()V

    .line 192
    const/4 v4, 0x0

    invoke-static {v2, v1, v4}, Lcom/dogac/bin1/SpotifyYerel;->topla(Landroid/view/accessibility/AccessibilityNodeInfo;Ljava/util/List;I)V

    .line 193
    invoke-interface {v1}, Ljava/util/List;->iterator()Ljava/util/Iterator;

    move-result-object v1

    :goto_4
    invoke-interface {v1}, Ljava/util/Iterator;->hasNext()Z

    move-result v4

    if-eqz v4, :cond_e

    invoke-interface {v1}, Ljava/util/Iterator;->next()Ljava/lang/Object;

    move-result-object v4

    check-cast v4, Landroid/view/accessibility/AccessibilityNodeInfo;

    .line 194
    invoke-static {v4}, Lcom/dogac/bin1/SpotifyYerel;->etiket(Landroid/view/accessibility/AccessibilityNodeInfo;)Ljava/lang/String;

    move-result-object v5

    .line 195
    invoke-static {v5}, Lcom/dogac/bin1/SpotifyYerel;->calEtiketi(Ljava/lang/String;)Z

    move-result v6

    if-nez v6, :cond_9

    move-object v6, v9

    goto :goto_6

    .line 196
    :cond_9
    invoke-virtual {v4, v3}, Landroid/view/accessibility/AccessibilityNodeInfo;->getBoundsInScreen(Landroid/graphics/Rect;)V

    .line 197
    invoke-virtual {v4}, Landroid/view/accessibility/AccessibilityNodeInfo;->isVisibleToUser()Z

    move-result v6

    if-eqz v6, :cond_c

    invoke-virtual {v3}, Landroid/graphics/Rect;->isEmpty()Z

    move-result v6

    if-nez v6, :cond_c

    iget v6, v3, Landroid/graphics/Rect;->top:I

    int-to-double v14, v6

    move-object v6, v9

    int-to-double v8, v0

    mul-double/2addr v8, v12

    cmpl-double v8, v14, v8

    if-gtz v8, :cond_d

    invoke-static {v4}, Lcom/dogac/bin1/SpotifyYerel;->sagPanelde(Landroid/view/accessibility/AccessibilityNodeInfo;)Z

    move-result v8

    if-eqz v8, :cond_a

    goto :goto_6

    .line 198
    :cond_a
    iget v8, v3, Landroid/graphics/Rect;->top:I

    if-ge v8, v7, :cond_b

    iget v6, v3, Landroid/graphics/Rect;->top:I

    new-instance v7, Ljava/lang/StringBuilder;

    invoke-direct {v7}, Ljava/lang/StringBuilder;-><init>()V

    const-string v8, "etiket:"

    invoke-virtual {v7, v8}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v7

    invoke-virtual {v7, v5}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v5

    invoke-virtual {v5}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v10

    move-object v9, v4

    move v7, v6

    goto :goto_5

    :cond_b
    move-object v9, v6

    .line 199
    :goto_5
    goto :goto_4

    .line 197
    :cond_c
    move-object v6, v9

    .line 193
    :cond_d
    :goto_6
    move-object v9, v6

    goto :goto_4

    :cond_e
    move-object v6, v9

    .line 201
    :cond_f
    if-nez v9, :cond_1a

    .line 202
    const-string v0, "araniyor"

    sput-object v0, Lcom/dogac/bin1/SpotifyYerel;->listeSon:Ljava/lang/String;

    .line 204
    new-instance v0, Ljava/util/ArrayList;

    invoke-direct {v0}, Ljava/util/ArrayList;-><init>()V

    const/4 v1, 0x0

    invoke-static {v2, v0, v1}, Lcom/dogac/bin1/SpotifyYerel;->topla(Landroid/view/accessibility/AccessibilityNodeInfo;Ljava/util/List;I)V

    .line 205
    new-instance v2, Ljava/lang/StringBuilder;

    invoke-direct {v2}, Ljava/lang/StringBuilder;-><init>()V

    .line 206
    invoke-interface {v0}, Ljava/util/List;->iterator()Ljava/util/Iterator;

    move-result-object v0

    move v6, v1

    :cond_10
    :goto_7
    invoke-interface {v0}, Ljava/util/Iterator;->hasNext()Z

    move-result v1

    if-eqz v1, :cond_19

    invoke-interface {v0}, Ljava/util/Iterator;->next()Ljava/lang/Object;

    move-result-object v1

    check-cast v1, Landroid/view/accessibility/AccessibilityNodeInfo;

    .line 207
    invoke-virtual {v1}, Landroid/view/accessibility/AccessibilityNodeInfo;->isClickable()Z

    move-result v4

    if-nez v4, :cond_11

    invoke-virtual {v1}, Landroid/view/accessibility/AccessibilityNodeInfo;->getActionList()Ljava/util/List;

    move-result-object v4

    sget-object v5, Landroid/view/accessibility/AccessibilityNodeInfo$AccessibilityAction;->ACTION_CLICK:Landroid/view/accessibility/AccessibilityNodeInfo$AccessibilityAction;

    invoke-interface {v4, v5}, Ljava/util/List;->contains(Ljava/lang/Object;)Z

    move-result v4

    if-eqz v4, :cond_10

    :cond_11
    invoke-virtual {v1}, Landroid/view/accessibility/AccessibilityNodeInfo;->isVisibleToUser()Z

    move-result v4

    if-nez v4, :cond_12

    goto :goto_7

    .line 208
    :cond_12
    invoke-virtual {v1, v3}, Landroid/view/accessibility/AccessibilityNodeInfo;->getBoundsInScreen(Landroid/graphics/Rect;)V

    .line 209
    invoke-virtual {v1}, Landroid/view/accessibility/AccessibilityNodeInfo;->getViewIdResourceName()Ljava/lang/String;

    move-result-object v4

    invoke-static {v1}, Lcom/dogac/bin1/SpotifyYerel;->etiket(Landroid/view/accessibility/AccessibilityNodeInfo;)Ljava/lang/String;

    move-result-object v5

    .line 210
    if-eqz v4, :cond_13

    invoke-virtual {v4}, Ljava/lang/String;->length()I

    move-result v7

    if-nez v7, :cond_14

    :cond_13
    if-nez v5, :cond_14

    goto :goto_7

    .line 211
    :cond_14
    const-string v7, "["

    invoke-virtual {v2, v7}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v7

    if-nez v4, :cond_15

    const-string v4, "-"

    goto :goto_8

    :cond_15
    invoke-virtual {v4, v11}, Ljava/lang/String;->indexOf(I)I

    move-result v8

    add-int/lit8 v8, v8, 0x1

    invoke-virtual {v4, v8}, Ljava/lang/String;->substring(I)Ljava/lang/String;

    move-result-object v4

    :goto_8
    invoke-virtual {v7, v4}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v4

    const-string v7, " \'"

    invoke-virtual {v4, v7}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v4

    const-string v7, ""

    if-nez v5, :cond_16

    move-object v5, v7

    :cond_16
    invoke-virtual {v4, v5}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v4

    const-string v5, "\' y="

    invoke-virtual {v4, v5}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v4

    iget v5, v3, Landroid/graphics/Rect;->top:I

    invoke-virtual {v4, v5}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    move-result-object v4

    invoke-static {v1}, Lcom/dogac/bin1/SpotifyYerel;->sagPanelde(Landroid/view/accessibility/AccessibilityNodeInfo;)Z

    move-result v1

    if-eqz v1, :cond_17

    const-string v7, " panel"

    :cond_17
    invoke-virtual {v4, v7}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v1

    const-string v4, "] "

    invoke-virtual {v1, v4}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    .line 212
    add-int/lit8 v6, v6, 0x1

    const/16 v1, 0x1e

    if-lt v6, v1, :cond_18

    goto :goto_9

    .line 213
    :cond_18
    goto/16 :goto_7

    .line 214
    :cond_19
    :goto_9
    invoke-virtual {v2}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v0

    sput-object v0, Lcom/dogac/bin1/SpotifyYerel;->dokum:Ljava/lang/String;

    .line 215
    const/4 v0, 0x0

    return-object v0

    .line 217
    :cond_1a
    invoke-static {v9}, Lcom/dogac/bin1/CarvisErisim;->tiklaDugum(Landroid/view/accessibility/AccessibilityNodeInfo;)Z

    move-result v0

    if-eqz v0, :cond_1b

    move-object v1, v10

    goto :goto_a

    :cond_1b
    const/4 v1, 0x0

    :goto_a
    return-object v1

    .line 179
    :cond_1c
    :goto_b
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

    .line 167
    if-eqz p0, :cond_2

    const/16 v0, 0x28

    if-le p2, v0, :cond_0

    goto :goto_1

    .line 168
    :cond_0
    invoke-interface {p1, p0}, Ljava/util/List;->add(Ljava/lang/Object;)Z

    .line 169
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

    .line 170
    :cond_1
    return-void

    .line 167
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
