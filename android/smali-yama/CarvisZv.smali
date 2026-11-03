.class public final Lcom/dogac/bin1/CarvisZv;
.super Ljava/lang/Object;
.source "CarvisZv.java"


# static fields
.field static final MODEL_BOYUT:J = 0x76e1dccL

.field static final MODEL_URL:Ljava/lang/String; = "https://huggingface.co/k2-fsa/ZipVoice/resolve/main/zipvoice_distill/fm_decoder_int8.onnx"

.field static volatile adim:I

.field static apktaModel:Ljava/lang/Boolean;

.field static volatile asama:Ljava/lang/String;

.field static volatile basDb:F

.field static volatile calan:Landroid/media/AudioTrack;

.field static volatile calinan:I

.field static volatile hata:Ljava/lang/String;

.field static volatile indiriliyor:Z

.field static isci:Ljava/lang/Thread;

.field static final kilit:Ljava/lang/Object;

.field static final kuyruk:Ljava/util/concurrent/LinkedBlockingQueue;
    .annotation system Ldalvik/annotation/Signature;
        value = {
            "Ljava/util/concurrent/LinkedBlockingQueue<",
            "[",
            "Ljava/lang/Object;",
            ">;"
        }
    .end annotation
.end field

.field static volatile nesil:I

.field static ornekMetin:Ljava/lang/String;

.field static ornekSes:[F

.field static ornekSr:I

.field static volatile parlakDb:F

.field static volatile perdeYt:F

.field static volatile sonCalmaBas:J

.field static volatile sonSesMs:J

.field static volatile sonUretimMs:J

.field static tts:Lcom/k2fsa/sherpa/onnx/OfflineTts;

.field static final yaziKilit:Ljava/lang/Object;

.field static volatile yuklemeMs:J

.field static volatile yuzde:I


# direct methods
.method static constructor <clinit>()V
    .locals 2

    .line 29
    new-instance v0, Ljava/lang/Object;

    invoke-direct {v0}, Ljava/lang/Object;-><init>()V

    sput-object v0, Lcom/dogac/bin1/CarvisZv;->kilit:Ljava/lang/Object;

    .line 32
    const-string v0, ""

    sput-object v0, Lcom/dogac/bin1/CarvisZv;->hata:Ljava/lang/String;

    .line 33
    const/4 v0, 0x0

    sput v0, Lcom/dogac/bin1/CarvisZv;->perdeYt:F

    sput v0, Lcom/dogac/bin1/CarvisZv;->basDb:F

    sput v0, Lcom/dogac/bin1/CarvisZv;->parlakDb:F

    const/16 v0, 0x8

    sput v0, Lcom/dogac/bin1/CarvisZv;->adim:I

    .line 36
    const-string v0, "bo\u015fta"

    sput-object v0, Lcom/dogac/bin1/CarvisZv;->asama:Ljava/lang/String;

    const-wide/16 v0, -0x1

    sput-wide v0, Lcom/dogac/bin1/CarvisZv;->yuklemeMs:J

    sput-wide v0, Lcom/dogac/bin1/CarvisZv;->sonUretimMs:J

    sput-wide v0, Lcom/dogac/bin1/CarvisZv;->sonSesMs:J

    const-wide/16 v0, 0x0

    sput-wide v0, Lcom/dogac/bin1/CarvisZv;->sonCalmaBas:J

    const/4 v0, 0x0

    sput v0, Lcom/dogac/bin1/CarvisZv;->calinan:I

    .line 38
    new-instance v0, Ljava/lang/Object;

    invoke-direct {v0}, Ljava/lang/Object;-><init>()V

    sput-object v0, Lcom/dogac/bin1/CarvisZv;->yaziKilit:Ljava/lang/Object;

    .line 39
    new-instance v0, Ljava/util/concurrent/LinkedBlockingQueue;

    invoke-direct {v0}, Ljava/util/concurrent/LinkedBlockingQueue;-><init>()V

    sput-object v0, Lcom/dogac/bin1/CarvisZv;->kuyruk:Ljava/util/concurrent/LinkedBlockingQueue;

    .line 56
    const/4 v0, 0x0

    sput-object v0, Lcom/dogac/bin1/CarvisZv;->apktaModel:Ljava/lang/Boolean;

    return-void
.end method

.method public constructor <init>()V
    .locals 0

    .line 26
    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    return-void
.end method

.method static apkta(Landroid/content/Context;)Z
    .locals 5

    .line 58
    sget-object v0, Lcom/dogac/bin1/CarvisZv;->apktaModel:Ljava/lang/Boolean;

    if-nez v0, :cond_2

    const/4 v0, 0x0

    :try_start_0
    invoke-virtual {p0}, Landroid/content/Context;->getAssets()Landroid/content/res/AssetManager;

    move-result-object p0

    const-string v1, "zv"

    invoke-virtual {p0, v1}, Landroid/content/res/AssetManager;->list(Ljava/lang/String;)[Ljava/lang/String;

    move-result-object p0

    array-length v1, p0
    :try_end_0
    .catch Ljava/lang/Exception; {:try_start_0 .. :try_end_0} :catch_1

    move v2, v0

    :goto_0
    if-ge v0, v1, :cond_1

    :try_start_1
    aget-object v3, p0, v0

    const-string v4, "fm_decoder_int8.onnx"

    invoke-virtual {v3, v4}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v3
    :try_end_1
    .catch Ljava/lang/Exception; {:try_start_1 .. :try_end_1} :catch_0

    if-eqz v3, :cond_0

    const/4 v2, 0x1

    :cond_0
    add-int/lit8 v0, v0, 0x1

    goto :goto_0

    :catch_0
    move-exception p0

    move v0, v2

    goto :goto_1

    :catch_1
    move-exception p0

    :goto_1
    move v2, v0

    :cond_1
    invoke-static {v2}, Ljava/lang/Boolean;->valueOf(Z)Ljava/lang/Boolean;

    move-result-object p0

    sput-object p0, Lcom/dogac/bin1/CarvisZv;->apktaModel:Ljava/lang/Boolean;

    .line 59
    :cond_2
    sget-object p0, Lcom/dogac/bin1/CarvisZv;->apktaModel:Ljava/lang/Boolean;

    invoke-virtual {p0}, Ljava/lang/Boolean;->booleanValue()Z

    move-result p0

    return p0
.end method

.method public static ayar(FFFI)V
    .locals 0

    .line 34
    sput p0, Lcom/dogac/bin1/CarvisZv;->perdeYt:F

    sput p1, Lcom/dogac/bin1/CarvisZv;->basDb:F

    sput p2, Lcom/dogac/bin1/CarvisZv;->parlakDb:F

    const/16 p0, 0xc

    invoke-static {p0, p3}, Ljava/lang/Math;->min(II)I

    move-result p0

    const/4 p1, 0x4

    invoke-static {p1, p0}, Ljava/lang/Math;->max(II)I

    move-result p0

    sput p0, Lcom/dogac/bin1/CarvisZv;->adim:I

    return-void
.end method

.method static bag()Landroid/content/Context;
    .locals 1

    .line 53
    sget-object v0, Lcom/dogac/bin1/MainActivity;->ornek:Lcom/dogac/bin1/MainActivity;

    if-nez v0, :cond_0

    const/4 v0, 0x0

    goto :goto_0

    :cond_0
    invoke-virtual {v0}, Lcom/dogac/bin1/MainActivity;->getApplicationContext()Landroid/content/Context;

    move-result-object v0

    :goto_0
    return-object v0
.end method

.method static cal(I[FI)V
    .locals 6
    .annotation system Ldalvik/annotation/Throws;
        value = {
            Ljava/lang/Exception;
        }
    .end annotation

    .line 302
    const/4 v0, 0x4

    invoke-static {p2, v0, v0}, Landroid/media/AudioTrack;->getMinBufferSize(III)I

    move-result v1

    .line 303
    new-instance v2, Landroid/media/AudioTrack$Builder;

    invoke-direct {v2}, Landroid/media/AudioTrack$Builder;-><init>()V

    new-instance v3, Landroid/media/AudioAttributes$Builder;

    invoke-direct {v3}, Landroid/media/AudioAttributes$Builder;-><init>()V

    .line 304
    const/4 v4, 0x1

    invoke-virtual {v3, v4}, Landroid/media/AudioAttributes$Builder;->setUsage(I)Landroid/media/AudioAttributes$Builder;

    move-result-object v3

    invoke-virtual {v3, v4}, Landroid/media/AudioAttributes$Builder;->setContentType(I)Landroid/media/AudioAttributes$Builder;

    move-result-object v3

    invoke-virtual {v3}, Landroid/media/AudioAttributes$Builder;->build()Landroid/media/AudioAttributes;

    move-result-object v3

    invoke-virtual {v2, v3}, Landroid/media/AudioTrack$Builder;->setAudioAttributes(Landroid/media/AudioAttributes;)Landroid/media/AudioTrack$Builder;

    move-result-object v2

    new-instance v3, Landroid/media/AudioFormat$Builder;

    invoke-direct {v3}, Landroid/media/AudioFormat$Builder;-><init>()V

    .line 305
    invoke-virtual {v3, p2}, Landroid/media/AudioFormat$Builder;->setSampleRate(I)Landroid/media/AudioFormat$Builder;

    move-result-object v3

    invoke-virtual {v3, v0}, Landroid/media/AudioFormat$Builder;->setEncoding(I)Landroid/media/AudioFormat$Builder;

    move-result-object v3

    invoke-virtual {v3, v0}, Landroid/media/AudioFormat$Builder;->setChannelMask(I)Landroid/media/AudioFormat$Builder;

    move-result-object v0

    invoke-virtual {v0}, Landroid/media/AudioFormat$Builder;->build()Landroid/media/AudioFormat;

    move-result-object v0

    invoke-virtual {v2, v0}, Landroid/media/AudioTrack$Builder;->setAudioFormat(Landroid/media/AudioFormat;)Landroid/media/AudioTrack$Builder;

    move-result-object v0

    .line 306
    invoke-static {v1, p2}, Ljava/lang/Math;->max(II)I

    move-result v1

    invoke-virtual {v0, v1}, Landroid/media/AudioTrack$Builder;->setBufferSizeInBytes(I)Landroid/media/AudioTrack$Builder;

    move-result-object v0

    invoke-virtual {v0, v4}, Landroid/media/AudioTrack$Builder;->setTransferMode(I)Landroid/media/AudioTrack$Builder;

    move-result-object v0

    invoke-virtual {v0}, Landroid/media/AudioTrack$Builder;->build()Landroid/media/AudioTrack;

    move-result-object v0

    .line 307
    sget-object v1, Lcom/dogac/bin1/CarvisZv;->yaziKilit:Ljava/lang/Object;

    monitor-enter v1

    :try_start_0
    sput-object v0, Lcom/dogac/bin1/CarvisZv;->calan:Landroid/media/AudioTrack;

    monitor-exit v1
    :try_end_0
    .catchall {:try_start_0 .. :try_end_0} :catchall_3

    .line 309
    const/4 v1, 0x0

    :try_start_1
    const-string v2, "\u00e7al\u0131yor"

    sput-object v2, Lcom/dogac/bin1/CarvisZv;->asama:Ljava/lang/String;

    sget v2, Lcom/dogac/bin1/CarvisZv;->calinan:I

    add-int/2addr v2, v4

    sput v2, Lcom/dogac/bin1/CarvisZv;->calinan:I

    .line 310
    invoke-virtual {v0}, Landroid/media/AudioTrack;->play()V

    .line 311
    div-int/lit8 p2, p2, 0xa

    const/4 v2, 0x0

    move v3, v2

    .line 312
    :goto_0
    array-length v4, p1

    if-ge v3, v4, :cond_1

    sget v4, Lcom/dogac/bin1/CarvisZv;->nesil:I

    if-ne p0, v4, :cond_1

    array-length v4, p1

    sub-int/2addr v4, v3

    invoke-static {p2, v4}, Ljava/lang/Math;->min(II)I

    move-result v4

    invoke-virtual {v0, p1, v3, v4, v2}, Landroid/media/AudioTrack;->write([FIII)I

    move-result v4

    if-gtz v4, :cond_0

    goto :goto_1

    :cond_0
    add-int/2addr v3, v4

    goto :goto_0

    .line 313
    :cond_1
    :goto_1
    sget p2, Lcom/dogac/bin1/CarvisZv;->nesil:I

    if-ne p0, p2, :cond_2

    .line 315
    invoke-static {}, Ljava/lang/System;->currentTimeMillis()J

    move-result-wide v2

    const-wide/16 v4, 0xbb8

    add-long/2addr v2, v4

    .line 316
    :goto_2
    sget p2, Lcom/dogac/bin1/CarvisZv;->nesil:I

    if-ne p0, p2, :cond_2

    invoke-virtual {v0}, Landroid/media/AudioTrack;->getPlaybackHeadPosition()I

    move-result p2

    array-length v4, p1

    if-ge p2, v4, :cond_2

    invoke-static {}, Ljava/lang/System;->currentTimeMillis()J

    move-result-wide v4

    cmp-long p2, v4, v2

    if-gez p2, :cond_2

    const-wide/16 v4, 0x14

    invoke-static {v4, v5}, Ljava/lang/Thread;->sleep(J)V
    :try_end_1
    .catchall {:try_start_1 .. :try_end_1} :catchall_1

    goto :goto_2

    .line 319
    :cond_2
    sget-object p0, Lcom/dogac/bin1/CarvisZv;->yaziKilit:Ljava/lang/Object;

    monitor-enter p0

    :try_start_2
    sget-object p1, Lcom/dogac/bin1/CarvisZv;->calan:Landroid/media/AudioTrack;

    if-ne p1, v0, :cond_3

    sput-object v1, Lcom/dogac/bin1/CarvisZv;->calan:Landroid/media/AudioTrack;

    :cond_3
    monitor-exit p0
    :try_end_2
    .catchall {:try_start_2 .. :try_end_2} :catchall_0

    .line 320
    :try_start_3
    invoke-virtual {v0}, Landroid/media/AudioTrack;->stop()V
    :try_end_3
    .catch Ljava/lang/Exception; {:try_start_3 .. :try_end_3} :catch_0

    goto :goto_3

    :catch_0
    move-exception p0

    :goto_3
    invoke-virtual {v0}, Landroid/media/AudioTrack;->release()V

    .line 321
    nop

    .line 322
    return-void

    .line 319
    :catchall_0
    move-exception p1

    :try_start_4
    monitor-exit p0
    :try_end_4
    .catchall {:try_start_4 .. :try_end_4} :catchall_0

    throw p1

    :catchall_1
    move-exception p0

    sget-object p1, Lcom/dogac/bin1/CarvisZv;->yaziKilit:Ljava/lang/Object;

    monitor-enter p1

    :try_start_5
    sget-object p2, Lcom/dogac/bin1/CarvisZv;->calan:Landroid/media/AudioTrack;

    if-ne p2, v0, :cond_4

    sput-object v1, Lcom/dogac/bin1/CarvisZv;->calan:Landroid/media/AudioTrack;

    :cond_4
    monitor-exit p1
    :try_end_5
    .catchall {:try_start_5 .. :try_end_5} :catchall_2

    .line 320
    :try_start_6
    invoke-virtual {v0}, Landroid/media/AudioTrack;->stop()V
    :try_end_6
    .catch Ljava/lang/Exception; {:try_start_6 .. :try_end_6} :catch_1

    goto :goto_4

    :catch_1
    move-exception p1

    :goto_4
    invoke-virtual {v0}, Landroid/media/AudioTrack;->release()V

    .line 321
    throw p0

    .line 319
    :catchall_2
    move-exception p0

    :try_start_7
    monitor-exit p1
    :try_end_7
    .catchall {:try_start_7 .. :try_end_7} :catchall_2

    throw p0

    .line 307
    :catchall_3
    move-exception p0

    :try_start_8
    monitor-exit v1
    :try_end_8
    .catchall {:try_start_8 .. :try_end_8} :catchall_3

    throw p0
.end method

.method static cila([FIF)[F
    .locals 10

    .line 284
    const v0, 0x3c23d70a    # 0.01f

    cmpg-float v0, p2, v0

    if-gtz v0, :cond_0

    return-object p0

    .line 285
    :cond_0
    const/high16 v0, 0x3f800000    # 1.0f

    invoke-static {v0, p2}, Ljava/lang/Math;->min(FF)F

    move-result p2

    .line 286
    array-length v1, p0

    int-to-float p1, p1

    const v2, 0x3db851ec    # 0.09f

    mul-float/2addr v2, p1

    float-to-int v2, v2

    add-int/2addr v1, v2

    new-array v2, v1, [F

    .line 288
    div-float v3, v0, p1

    const v4, 0x38b96dd0

    add-float/2addr v3, v4

    div-float/2addr v4, v3

    .line 289
    const/4 v3, 0x0

    const/4 v5, 0x0

    move v6, v3

    move v7, v5

    :goto_0
    array-length v8, p0

    if-ge v7, v8, :cond_1

    aget v8, p0, v7

    add-float/2addr v3, v8

    sub-float/2addr v3, v6

    mul-float/2addr v3, v4

    aget v6, p0, v7

    aget v8, p0, v7

    const v9, 0x3ee66666    # 0.45f

    mul-float/2addr v9, p2

    mul-float/2addr v9, v3

    add-float/2addr v8, v9

    aput v8, v2, v7

    add-int/lit8 v7, v7, 0x1

    goto :goto_0

    .line 291
    :cond_1
    const p0, 0x3cbc6a7f    # 0.023f

    mul-float/2addr p0, p1

    float-to-int p0, p0

    const v3, 0x3d79db23    # 0.061f

    mul-float/2addr p1, v3

    float-to-int p1, p1

    .line 292
    new-array v3, v1, [F

    .line 293
    move v4, v5

    :goto_1
    if-ge v4, v1, :cond_4

    aget v6, v2, v4

    if-lt v4, p0, :cond_2

    const v7, 0x3e6147ae    # 0.22f

    mul-float/2addr v7, p2

    sub-int v8, v4, p0

    aget v8, v2, v8

    mul-float/2addr v7, v8

    add-float/2addr v6, v7

    :cond_2
    if-lt v4, p1, :cond_3

    const v7, 0x3df5c28f    # 0.12f

    mul-float/2addr v7, p2

    sub-int v8, v4, p1

    aget v8, v2, v8

    mul-float/2addr v7, v8

    add-float/2addr v6, v7

    :cond_3
    aput v6, v3, v4

    add-int/lit8 v4, v4, 0x1

    goto :goto_1

    .line 295
    :cond_4
    const p0, 0x38d1b717    # 1.0E-4f

    move p1, v5

    :goto_2
    if-ge p1, v1, :cond_5

    aget v2, v3, p1

    invoke-static {v2}, Ljava/lang/Math;->abs(F)F

    move-result v2

    invoke-static {p0, v2}, Ljava/lang/Math;->max(FF)F

    move-result p0

    add-int/lit8 p1, p1, 0x1

    goto :goto_2

    .line 296
    :cond_5
    const p1, 0x3f733333    # 0.95f

    div-float/2addr p1, p0

    .line 297
    nop

    :goto_3
    if-ge v5, v1, :cond_6

    aget p0, v3, v5

    mul-float/2addr p0, p1

    const v2, 0x3f4ccccd    # 0.8f

    mul-float/2addr v2, p2

    add-float/2addr v2, v0

    mul-float/2addr p0, v2

    float-to-double v6, p0

    invoke-static {v6, v7}, Ljava/lang/Math;->tanh(D)D

    move-result-wide v6

    double-to-float p0, v6

    float-to-double v6, v2

    invoke-static {v6, v7}, Ljava/lang/Math;->tanh(D)D

    move-result-wide v6

    double-to-float v2, v6

    div-float/2addr p0, v2

    aput p0, v3, v5

    add-int/lit8 v5, v5, 0x1

    goto :goto_3

    .line 298
    :cond_6
    return-object v3
.end method

.method public static cokusSifirla()V
    .locals 3

    .line 52
    invoke-static {}, Lcom/dogac/bin1/CarvisZv;->bag()Landroid/content/Context;

    move-result-object v0

    if-eqz v0, :cond_0

    new-instance v1, Ljava/io/File;

    invoke-static {v0}, Lcom/dogac/bin1/CarvisZv;->dizin(Landroid/content/Context;)Ljava/io/File;

    move-result-object v0

    const-string v2, "cokus.iz"

    invoke-direct {v1, v0, v2}, Ljava/io/File;-><init>(Ljava/io/File;Ljava/lang/String;)V

    invoke-virtual {v1}, Ljava/io/File;->delete()Z

    :cond_0
    return-void
.end method

.method static cumleler(Ljava/lang/String;)Ljava/util/ArrayList;
    .locals 8
    .annotation system Ldalvik/annotation/Signature;
        value = {
            "(",
            "Ljava/lang/String;",
            ")",
            "Ljava/util/ArrayList<",
            "Ljava/lang/String;",
            ">;"
        }
    .end annotation

    .line 188
    new-instance v0, Ljava/util/ArrayList;

    invoke-direct {v0}, Ljava/util/ArrayList;-><init>()V

    new-instance v1, Ljava/lang/StringBuilder;

    invoke-direct {v1}, Ljava/lang/StringBuilder;-><init>()V

    .line 189
    const/4 v2, 0x0

    move v3, v2

    :goto_0
    invoke-virtual {p0}, Ljava/lang/String;->length()I

    move-result v4

    const/4 v5, 0x1

    if-ge v3, v4, :cond_7

    .line 190
    invoke-virtual {p0, v3}, Ljava/lang/String;->charAt(I)C

    move-result v4

    invoke-virtual {v1, v4}, Ljava/lang/StringBuilder;->append(C)Ljava/lang/StringBuilder;

    .line 191
    const/16 v6, 0x2e

    if-eq v4, v6, :cond_0

    const/16 v6, 0x21

    if-eq v4, v6, :cond_0

    const/16 v6, 0x3f

    if-eq v4, v6, :cond_0

    const/16 v6, 0x3b

    if-eq v4, v6, :cond_0

    const/16 v6, 0xa

    if-ne v4, v6, :cond_1

    :cond_0
    add-int/lit8 v6, v3, 0x1

    invoke-virtual {p0}, Ljava/lang/String;->length()I

    move-result v7

    if-ge v6, v7, :cond_2

    invoke-virtual {p0, v6}, Ljava/lang/String;->charAt(I)C

    move-result v6

    invoke-static {v6}, Ljava/lang/Character;->isWhitespace(C)Z

    move-result v6

    if-eqz v6, :cond_1

    goto :goto_1

    :cond_1
    move v5, v2

    .line 192
    :cond_2
    :goto_1
    if-eqz v5, :cond_3

    invoke-virtual {v1}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v5

    invoke-virtual {v5}, Ljava/lang/String;->trim()Ljava/lang/String;

    move-result-object v5

    invoke-virtual {v5}, Ljava/lang/String;->length()I

    move-result v5

    if-gtz v5, :cond_4

    :cond_3
    invoke-virtual {v1}, Ljava/lang/StringBuilder;->length()I

    move-result v5

    const/16 v6, 0xdc

    if-le v5, v6, :cond_6

    const/16 v5, 0x2c

    if-ne v4, v5, :cond_6

    :cond_4
    invoke-virtual {v1}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v4

    invoke-virtual {v4}, Ljava/lang/String;->trim()Ljava/lang/String;

    move-result-object v4

    invoke-virtual {v4}, Ljava/lang/String;->length()I

    move-result v5

    if-lez v5, :cond_5

    invoke-virtual {v0, v4}, Ljava/util/ArrayList;->add(Ljava/lang/Object;)Z

    :cond_5
    invoke-virtual {v1, v2}, Ljava/lang/StringBuilder;->setLength(I)V

    .line 189
    :cond_6
    add-int/lit8 v3, v3, 0x1

    goto :goto_0

    .line 194
    :cond_7
    invoke-virtual {v1}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object p0

    invoke-virtual {p0}, Ljava/lang/String;->trim()Ljava/lang/String;

    move-result-object p0

    invoke-virtual {p0}, Ljava/lang/String;->length()I

    move-result v1

    if-lez v1, :cond_8

    invoke-virtual {v0, p0}, Ljava/util/ArrayList;->add(Ljava/lang/Object;)Z

    .line 196
    :cond_8
    new-instance p0, Ljava/util/ArrayList;

    invoke-direct {p0}, Ljava/util/ArrayList;-><init>()V

    .line 197
    invoke-virtual {v0}, Ljava/util/ArrayList;->iterator()Ljava/util/Iterator;

    move-result-object v0

    :goto_2
    invoke-interface {v0}, Ljava/util/Iterator;->hasNext()Z

    move-result v1

    if-eqz v1, :cond_a

    invoke-interface {v0}, Ljava/util/Iterator;->next()Ljava/lang/Object;

    move-result-object v1

    check-cast v1, Ljava/lang/String;

    invoke-virtual {p0}, Ljava/util/ArrayList;->isEmpty()Z

    move-result v3

    if-nez v3, :cond_9

    invoke-virtual {v1}, Ljava/lang/String;->length()I

    move-result v3

    const/16 v4, 0xc

    if-ge v3, v4, :cond_9

    invoke-virtual {p0}, Ljava/util/ArrayList;->size()I

    move-result v3

    sub-int/2addr v3, v5

    new-instance v4, Ljava/lang/StringBuilder;

    invoke-direct {v4}, Ljava/lang/StringBuilder;-><init>()V

    invoke-virtual {p0}, Ljava/util/ArrayList;->size()I

    move-result v6

    sub-int/2addr v6, v5

    invoke-virtual {p0, v6}, Ljava/util/ArrayList;->get(I)Ljava/lang/Object;

    move-result-object v6

    check-cast v6, Ljava/lang/String;

    invoke-virtual {v4, v6}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v4

    const-string v6, " "

    invoke-virtual {v4, v6}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v4

    invoke-virtual {v4, v1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v1

    invoke-virtual {v1}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v1

    invoke-virtual {p0, v3, v1}, Ljava/util/ArrayList;->set(ILjava/lang/Object;)Ljava/lang/Object;

    goto :goto_2

    :cond_9
    invoke-virtual {p0, v1}, Ljava/util/ArrayList;->add(Ljava/lang/Object;)Z

    goto :goto_2

    .line 198
    :cond_a
    invoke-virtual {p0}, Ljava/util/ArrayList;->isEmpty()Z

    move-result v0

    if-nez v0, :cond_b

    invoke-virtual {p0, v2}, Ljava/util/ArrayList;->get(I)Ljava/lang/Object;

    move-result-object v0

    check-cast v0, Ljava/lang/String;

    invoke-virtual {v0}, Ljava/lang/String;->length()I

    move-result v0

    const/16 v1, 0x46

    if-le v0, v1, :cond_b

    .line 199
    invoke-virtual {p0, v2}, Ljava/util/ArrayList;->get(I)Ljava/lang/Object;

    move-result-object v0

    check-cast v0, Ljava/lang/String;

    const-string v1, ", "

    const/16 v3, 0x19

    invoke-virtual {v0, v1, v3}, Ljava/lang/String;->indexOf(Ljava/lang/String;I)I

    move-result v1

    .line 200
    if-lez v1, :cond_b

    invoke-virtual {v0}, Ljava/lang/String;->length()I

    move-result v3

    add-int/lit8 v3, v3, -0x14

    if-ge v1, v3, :cond_b

    add-int/lit8 v3, v1, 0x2

    invoke-virtual {v0, v3}, Ljava/lang/String;->substring(I)Ljava/lang/String;

    move-result-object v3

    invoke-virtual {p0, v2, v3}, Ljava/util/ArrayList;->set(ILjava/lang/Object;)Ljava/lang/Object;

    add-int/2addr v1, v5

    invoke-virtual {v0, v2, v1}, Ljava/lang/String;->substring(II)Ljava/lang/String;

    move-result-object v0

    invoke-virtual {p0, v2, v0}, Ljava/util/ArrayList;->add(ILjava/lang/Object;)V

    .line 202
    :cond_b
    return-object p0
.end method

.method static dizin(Landroid/content/Context;)Ljava/io/File;
    .locals 2

    .line 54
    new-instance v0, Ljava/io/File;

    invoke-virtual {p0}, Landroid/content/Context;->getFilesDir()Ljava/io/File;

    move-result-object p0

    const-string v1, "zv"

    invoke-direct {v0, p0, v1}, Ljava/io/File;-><init>(Ljava/io/File;Ljava/lang/String;)V

    invoke-virtual {v0}, Ljava/io/File;->mkdirs()Z

    return-object v0
.end method

.method static durdurCalan()V
    .locals 2

    .line 324
    sget-object v0, Lcom/dogac/bin1/CarvisZv;->yaziKilit:Ljava/lang/Object;

    monitor-enter v0

    :try_start_0
    sget-object v1, Lcom/dogac/bin1/CarvisZv;->calan:Landroid/media/AudioTrack;
    :try_end_0
    .catchall {:try_start_0 .. :try_end_0} :catchall_0

    if-eqz v1, :cond_0

    :try_start_1
    invoke-virtual {v1}, Landroid/media/AudioTrack;->pause()V

    invoke-virtual {v1}, Landroid/media/AudioTrack;->flush()V
    :try_end_1
    .catch Ljava/lang/Exception; {:try_start_1 .. :try_end_1} :catch_0
    .catchall {:try_start_1 .. :try_end_1} :catchall_0

    goto :goto_0

    :catch_0
    move-exception v1

    :cond_0
    :goto_0
    :try_start_2
    monitor-exit v0

    return-void

    :catchall_0
    move-exception v1

    monitor-exit v0
    :try_end_2
    .catchall {:try_start_2 .. :try_end_2} :catchall_0

    throw v1
.end method

.method public static durum()Ljava/lang/String;
    .locals 11

    .line 63
    new-instance v0, Lorg/json/JSONObject;

    invoke-direct {v0}, Lorg/json/JSONObject;-><init>()V

    .line 65
    :try_start_0
    invoke-static {}, Lcom/dogac/bin1/CarvisZv;->bag()Landroid/content/Context;

    move-result-object v1

    .line 66
    const/4 v2, 0x1

    const/4 v3, 0x0

    if-eqz v1, :cond_1

    invoke-static {v1}, Lcom/dogac/bin1/CarvisZv;->model(Landroid/content/Context;)Ljava/io/File;

    move-result-object v4

    invoke-virtual {v4}, Ljava/io/File;->length()J

    move-result-wide v4

    const-wide/32 v6, 0x76e1dcc

    cmp-long v4, v4, v6

    if-eqz v4, :cond_0

    invoke-static {v1}, Lcom/dogac/bin1/CarvisZv;->apkta(Landroid/content/Context;)Z

    move-result v4
    :try_end_0
    .catch Ljava/lang/Exception; {:try_start_0 .. :try_end_0} :catch_3

    if-eqz v4, :cond_1

    :cond_0
    move v4, v2

    goto :goto_0

    :cond_1
    move v4, v3

    .line 67
    :goto_0
    nop

    .line 68
    if-eqz v1, :cond_3

    :try_start_1
    invoke-virtual {v1}, Landroid/content/Context;->getAssets()Landroid/content/res/AssetManager;

    move-result-object v5

    const-string v6, "zv"

    invoke-virtual {v5, v6}, Landroid/content/res/AssetManager;->list(Ljava/lang/String;)[Ljava/lang/String;

    move-result-object v5

    array-length v6, v5
    :try_end_1
    .catch Ljava/lang/Exception; {:try_start_1 .. :try_end_1} :catch_1

    move v7, v3

    move v8, v7

    :goto_1
    if-ge v7, v6, :cond_4

    :try_start_2
    aget-object v9, v5, v7

    const-string v10, "ornek.wav"

    invoke-virtual {v9, v10}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v9
    :try_end_2
    .catch Ljava/lang/Exception; {:try_start_2 .. :try_end_2} :catch_0

    if-eqz v9, :cond_2

    move v8, v2

    :cond_2
    add-int/lit8 v7, v7, 0x1

    goto :goto_1

    :catch_0
    move-exception v5

    goto :goto_2

    :catch_1
    move-exception v5

    move v8, v3

    goto :goto_2

    :cond_3
    move v8, v3

    .line 69
    :cond_4
    :goto_2
    :try_start_3
    const-string v5, "model"

    invoke-virtual {v0, v5, v4}, Lorg/json/JSONObject;->put(Ljava/lang/String;Z)Lorg/json/JSONObject;

    const-string v4, "ornek"

    invoke-virtual {v0, v4, v8}, Lorg/json/JSONObject;->put(Ljava/lang/String;Z)Lorg/json/JSONObject;

    const-string v4, "hazir"

    sget-object v5, Lcom/dogac/bin1/CarvisZv;->tts:Lcom/k2fsa/sherpa/onnx/OfflineTts;

    if-eqz v5, :cond_5

    goto :goto_3

    :cond_5
    move v2, v3

    :goto_3
    invoke-virtual {v0, v4, v2}, Lorg/json/JSONObject;->put(Ljava/lang/String;Z)Lorg/json/JSONObject;

    const-string v2, "indiriliyor"

    sget-boolean v4, Lcom/dogac/bin1/CarvisZv;->indiriliyor:Z

    invoke-virtual {v0, v2, v4}, Lorg/json/JSONObject;->put(Ljava/lang/String;Z)Lorg/json/JSONObject;

    const-string v2, "yuzde"

    sget v4, Lcom/dogac/bin1/CarvisZv;->yuzde:I

    invoke-virtual {v0, v2, v4}, Lorg/json/JSONObject;->put(Ljava/lang/String;I)Lorg/json/JSONObject;

    const-string v2, "hata"

    sget-object v4, Lcom/dogac/bin1/CarvisZv;->hata:Ljava/lang/String;

    invoke-virtual {v0, v2, v4}, Lorg/json/JSONObject;->put(Ljava/lang/String;Ljava/lang/Object;)Lorg/json/JSONObject;

    .line 70
    const-string v2, "asama"

    sget-object v4, Lcom/dogac/bin1/CarvisZv;->asama:Ljava/lang/String;

    invoke-virtual {v0, v2, v4}, Lorg/json/JSONObject;->put(Ljava/lang/String;Ljava/lang/Object;)Lorg/json/JSONObject;

    if-eqz v1, :cond_6

    const-string v2, "cokus"

    invoke-static {v1}, Lcom/dogac/bin1/CarvisZv;->oncekiCokus(Landroid/content/Context;)Ljava/lang/String;

    move-result-object v4

    invoke-virtual {v0, v2, v4}, Lorg/json/JSONObject;->put(Ljava/lang/String;Ljava/lang/Object;)Lorg/json/JSONObject;

    :cond_6
    const-string v2, "yuklemeMs"

    sget-wide v4, Lcom/dogac/bin1/CarvisZv;->yuklemeMs:J

    invoke-virtual {v0, v2, v4, v5}, Lorg/json/JSONObject;->put(Ljava/lang/String;J)Lorg/json/JSONObject;

    const-string v2, "sonUretimMs"

    sget-wide v4, Lcom/dogac/bin1/CarvisZv;->sonUretimMs:J

    invoke-virtual {v0, v2, v4, v5}, Lorg/json/JSONObject;->put(Ljava/lang/String;J)Lorg/json/JSONObject;

    const-string v2, "sonSesMs"

    sget-wide v4, Lcom/dogac/bin1/CarvisZv;->sonSesMs:J

    invoke-virtual {v0, v2, v4, v5}, Lorg/json/JSONObject;->put(Ljava/lang/String;J)Lorg/json/JSONObject;

    const-string v2, "calinan"

    sget v4, Lcom/dogac/bin1/CarvisZv;->calinan:I

    invoke-virtual {v0, v2, v4}, Lorg/json/JSONObject;->put(Ljava/lang/String;I)Lorg/json/JSONObject;
    :try_end_3
    .catch Ljava/lang/Exception; {:try_start_3 .. :try_end_3} :catch_3

    .line 71
    :try_start_4
    const-string v2, "audio"

    invoke-virtual {v1, v2}, Landroid/content/Context;->getSystemService(Ljava/lang/String;)Ljava/lang/Object;

    move-result-object v1

    check-cast v1, Landroid/media/AudioManager;

    const-string v2, "medyaSes"

    new-instance v4, Ljava/lang/StringBuilder;

    invoke-direct {v4}, Ljava/lang/StringBuilder;-><init>()V

    const/4 v5, 0x3

    invoke-virtual {v1, v5}, Landroid/media/AudioManager;->getStreamVolume(I)I

    move-result v6

    invoke-virtual {v4, v6}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    move-result-object v4

    const-string v6, "/"

    invoke-virtual {v4, v6}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v4

    invoke-virtual {v1, v5}, Landroid/media/AudioManager;->getStreamMaxVolume(I)I

    move-result v1

    invoke-virtual {v4, v1}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    move-result-object v1

    invoke-virtual {v1}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v1

    invoke-virtual {v0, v2, v1}, Lorg/json/JSONObject;->put(Ljava/lang/String;Ljava/lang/Object;)Lorg/json/JSONObject;
    :try_end_4
    .catch Ljava/lang/Exception; {:try_start_4 .. :try_end_4} :catch_2

    goto :goto_4

    :catch_2
    move-exception v1

    .line 72
    :goto_4
    :try_start_5
    const-string v1, "abi"

    sget-object v2, Landroid/os/Build;->SUPPORTED_ABIS:[Ljava/lang/String;

    array-length v2, v2

    if-lez v2, :cond_7

    sget-object v2, Landroid/os/Build;->SUPPORTED_ABIS:[Ljava/lang/String;

    aget-object v2, v2, v3

    goto :goto_5

    :cond_7
    const-string v2, ""

    :goto_5
    invoke-virtual {v0, v1, v2}, Lorg/json/JSONObject;->put(Ljava/lang/String;Ljava/lang/Object;)Lorg/json/JSONObject;
    :try_end_5
    .catch Ljava/lang/Exception; {:try_start_5 .. :try_end_5} :catch_3

    goto :goto_6

    .line 73
    :catch_3
    move-exception v1

    :goto_6
    nop

    .line 74
    invoke-virtual {v0}, Lorg/json/JSONObject;->toString()Ljava/lang/String;

    move-result-object v0

    return-object v0
.end method

.method public static indir()V
    .locals 3

    .line 78
    sget-boolean v0, Lcom/dogac/bin1/CarvisZv;->indiriliyor:Z

    if-eqz v0, :cond_0

    return-void

    .line 79
    :cond_0
    invoke-static {}, Lcom/dogac/bin1/CarvisZv;->bag()Landroid/content/Context;

    move-result-object v0

    if-nez v0, :cond_1

    return-void

    .line 80
    :cond_1
    const/4 v1, 0x1

    sput-boolean v1, Lcom/dogac/bin1/CarvisZv;->indiriliyor:Z

    const-string v1, ""

    sput-object v1, Lcom/dogac/bin1/CarvisZv;->hata:Ljava/lang/String;

    const/4 v1, 0x0

    sput v1, Lcom/dogac/bin1/CarvisZv;->yuzde:I

    .line 81
    new-instance v1, Ljava/lang/Thread;

    new-instance v2, Lcom/dogac/bin1/CarvisZv$1;

    invoke-direct {v2, v0}, Lcom/dogac/bin1/CarvisZv$1;-><init>(Landroid/content/Context;)V

    invoke-direct {v1, v2}, Ljava/lang/Thread;-><init>(Ljava/lang/Runnable;)V

    .line 104
    invoke-virtual {v1}, Ljava/lang/Thread;->start()V

    .line 105
    return-void
.end method

.method static iz(Landroid/content/Context;Ljava/lang/String;)V
    .locals 2

    .line 43
    if-eqz p1, :cond_0

    sput-object p1, Lcom/dogac/bin1/CarvisZv;->asama:Ljava/lang/String;

    .line 44
    :cond_0
    if-nez p0, :cond_1

    return-void

    .line 45
    :cond_1
    new-instance v0, Ljava/io/File;

    invoke-static {p0}, Lcom/dogac/bin1/CarvisZv;->dizin(Landroid/content/Context;)Ljava/io/File;

    move-result-object p0

    const-string v1, "cokus.iz"

    invoke-direct {v0, p0, v1}, Ljava/io/File;-><init>(Ljava/io/File;Ljava/lang/String;)V

    .line 46
    if-nez p1, :cond_2

    :try_start_0
    invoke-virtual {v0}, Ljava/io/File;->delete()Z

    goto :goto_0

    :cond_2
    new-instance p0, Ljava/io/FileOutputStream;

    invoke-direct {p0, v0}, Ljava/io/FileOutputStream;-><init>(Ljava/io/File;)V

    const-string v0, "UTF-8"

    invoke-virtual {p1, v0}, Ljava/lang/String;->getBytes(Ljava/lang/String;)[B

    move-result-object p1

    invoke-virtual {p0, p1}, Ljava/io/FileOutputStream;->write([B)V

    invoke-virtual {p0}, Ljava/io/FileOutputStream;->getFD()Ljava/io/FileDescriptor;

    move-result-object p1

    invoke-virtual {p1}, Ljava/io/FileDescriptor;->sync()V

    invoke-virtual {p0}, Ljava/io/FileOutputStream;->close()V
    :try_end_0
    .catch Ljava/lang/Exception; {:try_start_0 .. :try_end_0} :catch_0

    goto :goto_0

    :catch_0
    move-exception p0

    .line 47
    :goto_0
    return-void
.end method

.method public static konus(Ljava/lang/String;Ljava/lang/String;FF)V
    .locals 8

    .line 207
    sget v0, Lcom/dogac/bin1/CarvisZv;->nesil:I

    add-int/lit8 v3, v0, 0x1

    sput v3, Lcom/dogac/bin1/CarvisZv;->nesil:I

    .line 208
    invoke-static {}, Lcom/dogac/bin1/CarvisZv;->durdurCalan()V

    .line 209
    new-instance v0, Ljava/lang/Thread;

    new-instance v7, Lcom/dogac/bin1/CarvisZv$3;

    move-object v1, v7

    move-object v2, p1

    move v4, p2

    move v5, p3

    move-object v6, p0

    invoke-direct/range {v1 .. v6}, Lcom/dogac/bin1/CarvisZv$3;-><init>(Ljava/lang/String;IFFLjava/lang/String;)V

    invoke-direct {v0, v7}, Ljava/lang/Thread;-><init>(Ljava/lang/Runnable;)V

    .line 257
    invoke-virtual {v0}, Ljava/lang/Thread;->start()V

    .line 258
    return-void
.end method

.method static kopyala(Landroid/content/res/AssetManager;Ljava/lang/String;Ljava/io/File;)V
    .locals 6
    .annotation system Ldalvik/annotation/Throws;
        value = {
            Ljava/lang/Exception;
        }
    .end annotation

    .line 108
    invoke-virtual {p0, p1}, Landroid/content/res/AssetManager;->list(Ljava/lang/String;)[Ljava/lang/String;

    move-result-object v0

    .line 109
    const/4 v1, 0x0

    if-eqz v0, :cond_1

    array-length v2, v0

    if-lez v2, :cond_1

    invoke-virtual {p2}, Ljava/io/File;->mkdirs()Z

    array-length v2, v0

    :goto_0
    if-ge v1, v2, :cond_0

    aget-object v3, v0, v1

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

    invoke-static {p0, v4, v5}, Lcom/dogac/bin1/CarvisZv;->kopyala(Landroid/content/res/AssetManager;Ljava/lang/String;Ljava/io/File;)V

    add-int/lit8 v1, v1, 0x1

    goto :goto_0

    :cond_0
    return-void

    .line 110
    :cond_1
    invoke-virtual {p0, p1}, Landroid/content/res/AssetManager;->open(Ljava/lang/String;)Ljava/io/InputStream;

    move-result-object p0

    new-instance p1, Ljava/io/FileOutputStream;

    invoke-direct {p1, p2}, Ljava/io/FileOutputStream;-><init>(Ljava/io/File;)V

    .line 111
    const/high16 p2, 0x10000

    new-array p2, p2, [B

    :goto_1
    invoke-virtual {p0, p2}, Ljava/io/InputStream;->read([B)I

    move-result v0

    if-lez v0, :cond_2

    invoke-virtual {p1, p2, v1, v0}, Ljava/io/OutputStream;->write([BII)V

    goto :goto_1

    .line 112
    :cond_2
    invoke-virtual {p1}, Ljava/io/OutputStream;->close()V

    invoke-virtual {p0}, Ljava/io/InputStream;->close()V

    .line 113
    return-void
.end method

.method static model(Landroid/content/Context;)Ljava/io/File;
    .locals 2

    .line 55
    new-instance v0, Ljava/io/File;

    invoke-static {p0}, Lcom/dogac/bin1/CarvisZv;->dizin(Landroid/content/Context;)Ljava/io/File;

    move-result-object p0

    const-string v1, "fm_decoder_int8.onnx"

    invoke-direct {v0, p0, v1}, Ljava/io/File;-><init>(Ljava/io/File;Ljava/lang/String;)V

    return-object v0
.end method

.method static onbellekDosya(Ljava/lang/String;)Ljava/io/File;
    .locals 5

    .line 165
    invoke-static {}, Lcom/dogac/bin1/CarvisZv;->bag()Landroid/content/Context;

    move-result-object v0

    if-nez v0, :cond_0

    const/4 p0, 0x0

    return-object p0

    .line 166
    :cond_0
    new-instance v1, Ljava/io/File;

    invoke-static {v0}, Lcom/dogac/bin1/CarvisZv;->dizin(Landroid/content/Context;)Ljava/io/File;

    move-result-object v0

    const-string v2, "onbellek"

    invoke-direct {v1, v0, v2}, Ljava/io/File;-><init>(Ljava/io/File;Ljava/lang/String;)V

    invoke-virtual {v1}, Ljava/io/File;->mkdirs()Z

    .line 167
    new-instance v0, Ljava/lang/StringBuilder;

    invoke-direct {v0}, Ljava/lang/StringBuilder;-><init>()V

    invoke-virtual {p0}, Ljava/lang/String;->trim()Ljava/lang/String;

    move-result-object p0

    invoke-virtual {v0, p0}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object p0

    const-string v0, "|"

    invoke-virtual {p0, v0}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object p0

    sget v2, Lcom/dogac/bin1/CarvisZv;->adim:I

    invoke-virtual {p0, v2}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    move-result-object p0

    invoke-virtual {p0, v0}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object p0

    sget-object v0, Lcom/dogac/bin1/CarvisZv;->ornekMetin:Ljava/lang/String;

    invoke-virtual {p0, v0}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object p0

    invoke-virtual {p0}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object p0

    .line 168
    new-instance v0, Ljava/io/File;

    new-instance v2, Ljava/lang/StringBuilder;

    invoke-direct {v2}, Ljava/lang/StringBuilder;-><init>()V

    invoke-virtual {p0}, Ljava/lang/String;->hashCode()I

    move-result v3

    invoke-static {v3}, Ljava/lang/Integer;->toHexString(I)Ljava/lang/String;

    move-result-object v3

    invoke-virtual {v2, v3}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v2

    const-string v3, "_"

    invoke-virtual {v2, v3}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v2

    invoke-virtual {p0}, Ljava/lang/String;->length()I

    move-result v3

    mul-int/lit8 v3, v3, 0x1f

    const/4 v4, 0x0

    invoke-virtual {p0, v4}, Ljava/lang/String;->charAt(I)C

    move-result p0

    add-int/2addr v3, p0

    invoke-static {v3}, Ljava/lang/Integer;->toHexString(I)Ljava/lang/String;

    move-result-object p0

    invoke-virtual {v2, p0}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object p0

    const-string v2, ".f32"

    invoke-virtual {p0, v2}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object p0

    invoke-virtual {p0}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object p0

    invoke-direct {v0, v1, p0}, Ljava/io/File;-><init>(Ljava/io/File;Ljava/lang/String;)V

    return-object v0
.end method

.method static onbellekOku(Ljava/lang/String;)[F
    .locals 5

    .line 172
    const/4 v0, 0x0

    :try_start_0
    invoke-static {p0}, Lcom/dogac/bin1/CarvisZv;->onbellekDosya(Ljava/lang/String;)Ljava/io/File;

    move-result-object p0

    if-eqz p0, :cond_1

    invoke-virtual {p0}, Ljava/io/File;->exists()Z

    move-result v1

    if-nez v1, :cond_0

    goto :goto_0

    .line 173
    :cond_0
    invoke-virtual {p0}, Ljava/io/File;->length()J

    move-result-wide v1

    long-to-int v1, v1

    invoke-static {v1}, Ljava/nio/ByteBuffer;->allocate(I)Ljava/nio/ByteBuffer;

    move-result-object v1

    new-instance v2, Ljava/io/FileInputStream;

    invoke-direct {v2, p0}, Ljava/io/FileInputStream;-><init>(Ljava/io/File;)V

    invoke-virtual {v2}, Ljava/io/FileInputStream;->getChannel()Ljava/nio/channels/FileChannel;

    move-result-object v3

    invoke-virtual {v3, v1}, Ljava/nio/channels/FileChannel;->read(Ljava/nio/ByteBuffer;)I

    invoke-virtual {v2}, Ljava/io/FileInputStream;->close()V

    invoke-virtual {v1}, Ljava/nio/ByteBuffer;->flip()Ljava/nio/Buffer;

    .line 174
    invoke-virtual {v1}, Ljava/nio/ByteBuffer;->remaining()I

    move-result v2

    div-int/lit8 v2, v2, 0x4

    new-array v2, v2, [F

    sget-object v3, Ljava/nio/ByteOrder;->LITTLE_ENDIAN:Ljava/nio/ByteOrder;

    invoke-virtual {v1, v3}, Ljava/nio/ByteBuffer;->order(Ljava/nio/ByteOrder;)Ljava/nio/ByteBuffer;

    move-result-object v1

    invoke-virtual {v1}, Ljava/nio/ByteBuffer;->asFloatBuffer()Ljava/nio/FloatBuffer;

    move-result-object v1

    invoke-virtual {v1, v2}, Ljava/nio/FloatBuffer;->get([F)Ljava/nio/FloatBuffer;

    invoke-static {}, Ljava/lang/System;->currentTimeMillis()J

    move-result-wide v3

    invoke-virtual {p0, v3, v4}, Ljava/io/File;->setLastModified(J)Z
    :try_end_0
    .catchall {:try_start_0 .. :try_end_0} :catchall_0

    return-object v2

    .line 172
    :cond_1
    :goto_0
    return-object v0

    .line 175
    :catchall_0
    move-exception p0

    return-object v0
.end method

.method static onbellekYaz(Ljava/lang/String;[F)V
    .locals 6

    .line 179
    :try_start_0
    invoke-static {p0}, Lcom/dogac/bin1/CarvisZv;->onbellekDosya(Ljava/lang/String;)Ljava/io/File;

    move-result-object p0

    if-eqz p0, :cond_3

    array-length v0, p1

    const v1, 0xafc80

    if-le v0, v1, :cond_0

    goto :goto_2

    .line 180
    :cond_0
    array-length v0, p1

    mul-int/lit8 v0, v0, 0x4

    invoke-static {v0}, Ljava/nio/ByteBuffer;->allocate(I)Ljava/nio/ByteBuffer;

    move-result-object v0

    sget-object v1, Ljava/nio/ByteOrder;->LITTLE_ENDIAN:Ljava/nio/ByteOrder;

    invoke-virtual {v0, v1}, Ljava/nio/ByteBuffer;->order(Ljava/nio/ByteOrder;)Ljava/nio/ByteBuffer;

    move-result-object v0

    invoke-virtual {v0}, Ljava/nio/ByteBuffer;->asFloatBuffer()Ljava/nio/FloatBuffer;

    move-result-object v1

    invoke-virtual {v1, p1}, Ljava/nio/FloatBuffer;->put([F)Ljava/nio/FloatBuffer;

    .line 181
    new-instance p1, Ljava/io/FileOutputStream;

    invoke-direct {p1, p0}, Ljava/io/FileOutputStream;-><init>(Ljava/io/File;)V

    invoke-virtual {v0}, Ljava/nio/ByteBuffer;->array()[B

    move-result-object v0

    invoke-virtual {p1, v0}, Ljava/io/FileOutputStream;->write([B)V

    invoke-virtual {p1}, Ljava/io/FileOutputStream;->close()V

    .line 182
    invoke-virtual {p0}, Ljava/io/File;->getParentFile()Ljava/io/File;

    move-result-object p0

    invoke-virtual {p0}, Ljava/io/File;->listFiles()[Ljava/io/File;

    move-result-object p0

    array-length p1, p0

    const/4 v0, 0x0

    const-wide/16 v1, 0x0

    move v3, v0

    :goto_0
    if-ge v3, p1, :cond_1

    aget-object v4, p0, v3

    invoke-virtual {v4}, Ljava/io/File;->length()J

    move-result-wide v4

    add-long/2addr v1, v4

    add-int/lit8 v3, v3, 0x1

    goto :goto_0

    .line 183
    :cond_1
    const-wide/32 v3, 0x3c00000

    cmp-long p1, v1, v3

    if-lez p1, :cond_4

    new-instance p1, Lcom/dogac/bin1/CarvisZv$2;

    invoke-direct {p1}, Lcom/dogac/bin1/CarvisZv$2;-><init>()V

    invoke-static {p0, p1}, Ljava/util/Arrays;->sort([Ljava/lang/Object;Ljava/util/Comparator;)V

    array-length p1, p0

    :goto_1
    if-ge v0, p1, :cond_4

    aget-object v3, p0, v0

    const-wide/32 v4, 0x2d00000

    cmp-long v4, v1, v4

    if-gtz v4, :cond_2

    goto :goto_3

    :cond_2
    invoke-virtual {v3}, Ljava/io/File;->length()J

    move-result-wide v4

    sub-long/2addr v1, v4

    invoke-virtual {v3}, Ljava/io/File;->delete()Z
    :try_end_0
    .catchall {:try_start_0 .. :try_end_0} :catchall_0

    add-int/lit8 v0, v0, 0x1

    goto :goto_1

    .line 179
    :cond_3
    :goto_2
    return-void

    .line 184
    :catchall_0
    move-exception p0

    :cond_4
    :goto_3
    nop

    .line 185
    return-void
.end method

.method static oncekiCokus(Landroid/content/Context;)Ljava/lang/String;
    .locals 5

    .line 49
    const-string v0, "?"

    new-instance v1, Ljava/io/File;

    invoke-static {p0}, Lcom/dogac/bin1/CarvisZv;->dizin(Landroid/content/Context;)Ljava/io/File;

    move-result-object p0

    const-string v2, "cokus.iz"

    invoke-direct {v1, p0, v2}, Ljava/io/File;-><init>(Ljava/io/File;Ljava/lang/String;)V

    invoke-virtual {v1}, Ljava/io/File;->exists()Z

    move-result p0

    if-eqz p0, :cond_2

    sget-object p0, Lcom/dogac/bin1/CarvisZv;->tts:Lcom/k2fsa/sherpa/onnx/OfflineTts;

    if-nez p0, :cond_2

    sget-object p0, Lcom/dogac/bin1/CarvisZv;->asama:Ljava/lang/String;

    const-string v2, "bo\u015fta"

    invoke-virtual {p0, v2}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result p0

    if-nez p0, :cond_0

    goto :goto_0

    .line 50
    :cond_0
    :try_start_0
    new-instance p0, Ljava/io/FileInputStream;

    invoke-direct {p0, v1}, Ljava/io/FileInputStream;-><init>(Ljava/io/File;)V

    const/16 v1, 0xc8

    new-array v1, v1, [B

    invoke-virtual {p0, v1}, Ljava/io/FileInputStream;->read([B)I

    move-result v2

    invoke-virtual {p0}, Ljava/io/FileInputStream;->close()V

    if-lez v2, :cond_1

    new-instance p0, Ljava/lang/String;

    const-string v3, "UTF-8"

    const/4 v4, 0x0

    invoke-direct {p0, v1, v4, v2, v3}, Ljava/lang/String;-><init>([BIILjava/lang/String;)V
    :try_end_0
    .catch Ljava/lang/Exception; {:try_start_0 .. :try_end_0} :catch_0

    move-object v0, p0

    :cond_1
    return-object v0

    :catch_0
    move-exception p0

    return-object v0

    .line 49
    :cond_2
    :goto_0
    const-string p0, ""

    return-object p0
.end method

.method static ornekSesOku(Ljava/io/File;)V
    .locals 12
    .annotation system Ldalvik/annotation/Throws;
        value = {
            Ljava/lang/Exception;
        }
    .end annotation

    .line 149
    invoke-virtual {p0}, Ljava/io/File;->length()J

    move-result-wide v0

    long-to-int v0, v0

    new-array v1, v0, [B

    new-instance v2, Ljava/io/FileInputStream;

    invoke-direct {v2, p0}, Ljava/io/FileInputStream;-><init>(Ljava/io/File;)V

    const/4 p0, 0x0

    move v3, p0

    :goto_0
    if-ge v3, v0, :cond_0

    sub-int v4, v0, v3

    invoke-virtual {v2, v1, v3, v4}, Ljava/io/FileInputStream;->read([BII)I

    move-result v4

    if-lez v4, :cond_0

    add-int/2addr v3, v4

    goto :goto_0

    :cond_0
    invoke-virtual {v2}, Ljava/io/FileInputStream;->close()V

    .line 150
    const/16 v2, 0xc

    const/16 v3, 0x10

    const/4 v4, 0x1

    move v7, p0

    move v6, v3

    move v5, v4

    .line 151
    :goto_1
    add-int/lit8 v8, v2, 0x8

    if-gt v8, v0, :cond_3

    .line 152
    new-instance v9, Ljava/lang/String;

    const-string v10, "ISO-8859-1"

    const/4 v11, 0x4

    invoke-direct {v9, v1, v2, v11, v10}, Ljava/lang/String;-><init>([BIILjava/lang/String;)V

    add-int/lit8 v10, v2, 0x4

    aget-byte v10, v1, v10

    and-int/lit16 v10, v10, 0xff

    add-int/lit8 v11, v2, 0x5

    aget-byte v11, v1, v11

    and-int/lit16 v11, v11, 0xff

    shl-int/lit8 v11, v11, 0x8

    or-int/2addr v10, v11

    add-int/lit8 v11, v2, 0x6

    aget-byte v11, v1, v11

    and-int/lit16 v11, v11, 0xff

    shl-int/2addr v11, v3

    or-int/2addr v10, v11

    add-int/lit8 v11, v2, 0x7

    aget-byte v11, v1, v11

    and-int/lit16 v11, v11, 0xff

    shl-int/lit8 v11, v11, 0x18

    or-int/2addr v10, v11

    .line 153
    const-string v11, "fmt "

    invoke-virtual {v9, v11}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v11

    if-eqz v11, :cond_1

    add-int/lit8 v5, v2, 0xa

    aget-byte v5, v1, v5

    and-int/lit16 v5, v5, 0xff

    add-int/lit8 v6, v2, 0xb

    aget-byte v6, v1, v6

    and-int/lit16 v6, v6, 0xff

    shl-int/lit8 v6, v6, 0x8

    or-int/2addr v5, v6

    add-int/lit8 v6, v2, 0xc

    aget-byte v6, v1, v6

    and-int/lit16 v6, v6, 0xff

    add-int/lit8 v7, v2, 0xd

    aget-byte v7, v1, v7

    and-int/lit16 v7, v7, 0xff

    shl-int/lit8 v7, v7, 0x8

    or-int/2addr v6, v7

    add-int/lit8 v7, v2, 0xe

    aget-byte v7, v1, v7

    and-int/lit16 v7, v7, 0xff

    shl-int/2addr v7, v3

    or-int/2addr v6, v7

    add-int/lit8 v7, v2, 0xf

    aget-byte v7, v1, v7

    and-int/lit16 v7, v7, 0xff

    shl-int/lit8 v7, v7, 0x18

    or-int/2addr v7, v6

    add-int/lit8 v6, v2, 0x16

    aget-byte v6, v1, v6

    and-int/lit16 v6, v6, 0xff

    add-int/lit8 v11, v2, 0x17

    aget-byte v11, v1, v11

    and-int/lit16 v11, v11, 0xff

    shl-int/lit8 v11, v11, 0x8

    or-int/2addr v6, v11

    .line 154
    :cond_1
    const-string v11, "data"

    invoke-virtual {v9, v11}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v9

    if-eqz v9, :cond_2

    sub-int/2addr v0, v8

    invoke-static {v10, v0}, Ljava/lang/Math;->min(II)I

    move-result v0

    goto :goto_2

    .line 155
    :cond_2
    add-int/lit8 v8, v10, 0x8

    and-int/lit8 v9, v10, 0x1

    add-int/2addr v8, v9

    add-int/2addr v2, v8

    .line 156
    goto/16 :goto_1

    .line 151
    :cond_3
    const/4 v8, -0x1

    move v0, p0

    .line 157
    :goto_2
    if-ltz v8, :cond_5

    if-ne v6, v3, :cond_5

    if-ne v5, v4, :cond_5

    .line 158
    div-int/lit8 v0, v0, 0x2

    new-array v2, v0, [F

    .line 159
    nop

    :goto_3
    if-ge p0, v0, :cond_4

    mul-int/lit8 v3, p0, 0x2

    add-int/2addr v3, v8

    aget-byte v5, v1, v3

    and-int/lit16 v5, v5, 0xff

    add-int/2addr v3, v4

    aget-byte v3, v1, v3

    shl-int/lit8 v3, v3, 0x8

    or-int/2addr v3, v5

    int-to-short v3, v3

    int-to-float v3, v3

    const/high16 v5, 0x47000000    # 32768.0f

    div-float/2addr v3, v5

    aput v3, v2, p0

    add-int/lit8 p0, p0, 0x1

    goto :goto_3

    .line 160
    :cond_4
    sput-object v2, Lcom/dogac/bin1/CarvisZv;->ornekSes:[F

    sput v7, Lcom/dogac/bin1/CarvisZv;->ornekSr:I

    .line 161
    return-void

    .line 157
    :cond_5
    new-instance p0, Ljava/lang/Exception;

    const-string v0, "ornek.wav 16 bit mono olmal\u0131"

    invoke-direct {p0, v0}, Ljava/lang/Exception;-><init>(Ljava/lang/String;)V

    throw p0
.end method

.method public static sus()V
    .locals 1

    .line 326
    sget v0, Lcom/dogac/bin1/CarvisZv;->nesil:I

    add-int/lit8 v0, v0, 0x1

    sput v0, Lcom/dogac/bin1/CarvisZv;->nesil:I

    invoke-static {}, Lcom/dogac/bin1/CarvisZv;->durdurCalan()V

    return-void
.end method

.method static tepe([FIDDD)[F
    .locals 23

    .line 274
    move-object/from16 v0, p0

    const-wide/high16 v1, 0x4044000000000000L    # 40.0

    div-double v1, p6, v1

    const-wide/high16 v3, 0x4024000000000000L    # 10.0

    invoke-static {v3, v4, v1, v2}, Ljava/lang/Math;->pow(DD)D

    move-result-wide v1

    const-wide v3, 0x401921fb54442d18L    # 6.283185307179586

    mul-double v3, v3, p2

    move/from16 v5, p1

    int-to-double v5, v5

    div-double/2addr v3, v5

    invoke-static {v3, v4}, Ljava/lang/Math;->sin(D)D

    move-result-wide v5

    const-wide/high16 v7, 0x4000000000000000L    # 2.0

    mul-double v7, v7, p4

    div-double/2addr v5, v7

    invoke-static {v3, v4}, Ljava/lang/Math;->cos(D)D

    move-result-wide v3

    .line 275
    mul-double v7, v5, v1

    const-wide/high16 v9, 0x3ff0000000000000L    # 1.0

    add-double v11, v7, v9

    const-wide/high16 v13, -0x4000000000000000L    # -2.0

    mul-double/2addr v3, v13

    sub-double v7, v9, v7

    div-double/2addr v5, v1

    add-double v1, v5, v9

    sub-double/2addr v9, v5

    .line 276
    div-double/2addr v11, v1

    div-double/2addr v3, v1

    div-double/2addr v7, v1

    div-double/2addr v9, v1

    .line 277
    array-length v1, v0

    new-array v1, v1, [F

    .line 278
    const-wide/16 v5, 0x0

    const/4 v2, 0x0

    move-wide v13, v5

    move-wide v15, v13

    move-wide/from16 v17, v15

    :goto_0
    move-object/from16 p1, v1

    array-length v1, v0

    if-ge v2, v1, :cond_0

    aget v1, v0, v2

    float-to-double v0, v1

    mul-double/2addr v0, v11

    mul-double v19, v3, v5

    add-double v0, v0, v19

    mul-double/2addr v13, v7

    add-double/2addr v0, v13

    mul-double v13, v3, v15

    sub-double/2addr v0, v13

    mul-double v17, v17, v9

    sub-double v0, v0, v17

    aget v13, p0, v2

    float-to-double v13, v13

    move-wide/from16 p2, v3

    double-to-float v3, v0

    aput v3, p1, v2

    add-int/lit8 v2, v2, 0x1

    move-wide/from16 v3, p2

    move-wide/from16 v17, v15

    move-wide v15, v0

    move-object/from16 v0, p0

    move-object/from16 v1, p1

    move-wide/from16 v21, v5

    move-wide v5, v13

    move-wide/from16 v13, v21

    goto :goto_0

    .line 279
    :cond_0
    return-object p1
.end method

.method static ton([FIF)[F
    .locals 13

    .line 262
    nop

    .line 263
    const/high16 v0, 0x3f800000    # 1.0f

    sub-float v0, p2, v0

    invoke-static {v0}, Ljava/lang/Math;->abs(F)F

    move-result v0

    const v1, 0x3b449ba6    # 0.003f

    cmpl-float v0, v0, v1

    const/4 v1, 0x0

    if-lez v0, :cond_1

    .line 264
    array-length v0, p0

    int-to-float v0, v0

    div-float/2addr v0, p2

    float-to-int v0, v0

    new-array v2, v0, [F

    .line 265
    move v3, v1

    :goto_0
    if-ge v3, v0, :cond_0

    int-to-double v4, v3

    float-to-double v6, p2

    mul-double/2addr v4, v6

    double-to-int v6, v4

    int-to-double v7, v6

    sub-double/2addr v4, v7

    array-length v7, p0

    add-int/lit8 v7, v7, -0x1

    invoke-static {v6, v7}, Ljava/lang/Math;->min(II)I

    move-result v7

    aget v7, p0, v7

    add-int/lit8 v6, v6, 0x1

    array-length v8, p0

    add-int/lit8 v8, v8, -0x1

    invoke-static {v6, v8}, Ljava/lang/Math;->min(II)I

    move-result v6

    aget v6, p0, v6

    float-to-double v8, v7

    sub-float/2addr v6, v7

    float-to-double v6, v6

    mul-double/2addr v6, v4

    add-double/2addr v8, v6

    double-to-float v4, v8

    aput v4, v2, v3

    add-int/lit8 v3, v3, 0x1

    goto :goto_0

    :cond_0
    move-object v4, v2

    goto :goto_1

    .line 263
    :cond_1
    move-object v4, p0

    .line 267
    :goto_1
    sget p0, Lcom/dogac/bin1/CarvisZv;->basDb:F

    invoke-static {p0}, Ljava/lang/Math;->abs(F)F

    move-result p0

    const p2, 0x3dcccccd    # 0.1f

    cmpl-float p0, p0, p2

    if-lez p0, :cond_2

    sget p0, Lcom/dogac/bin1/CarvisZv;->basDb:F

    float-to-double v10, p0

    const-wide v6, 0x4066800000000000L    # 180.0

    const-wide/high16 v8, 0x3ff0000000000000L    # 1.0

    move v5, p1

    invoke-static/range {v4 .. v11}, Lcom/dogac/bin1/CarvisZv;->tepe([FIDDD)[F

    move-result-object v4

    :cond_2
    move-object v5, v4

    .line 268
    sget p0, Lcom/dogac/bin1/CarvisZv;->parlakDb:F

    invoke-static {p0}, Ljava/lang/Math;->abs(F)F

    move-result p0

    cmpl-float p0, p0, p2

    if-lez p0, :cond_3

    sget p0, Lcom/dogac/bin1/CarvisZv;->parlakDb:F

    float-to-double v11, p0

    const-wide/high16 v7, 0x40a9000000000000L    # 3200.0

    const-wide v9, 0x3ff3333333333333L    # 1.2

    move v6, p1

    invoke-static/range {v5 .. v12}, Lcom/dogac/bin1/CarvisZv;->tepe([FIDDD)[F

    move-result-object v5

    .line 269
    :cond_3
    array-length p0, v5

    const/4 p1, 0x0

    move p2, v1

    :goto_2
    if-ge p2, p0, :cond_4

    aget v0, v5, p2

    invoke-static {v0}, Ljava/lang/Math;->abs(F)F

    move-result v0

    invoke-static {p1, v0}, Ljava/lang/Math;->max(FF)F

    move-result p1

    add-int/lit8 p2, p2, 0x1

    goto :goto_2

    .line 270
    :cond_4
    const p0, 0x3f7ae148    # 0.98f

    cmpl-float p2, p1, p0

    if-lez p2, :cond_5

    div-float/2addr p0, p1

    :goto_3
    array-length p1, v5

    if-ge v1, p1, :cond_5

    aget p1, v5, v1

    mul-float/2addr p1, p0

    aput p1, v5, v1

    add-int/lit8 v1, v1, 0x1

    goto :goto_3

    .line 271
    :cond_5
    return-object v5
.end method

.method static yukle(Landroid/content/Context;)V
    .locals 17
    .annotation system Ldalvik/annotation/Throws;
        value = {
            Ljava/lang/Exception;
        }
    .end annotation

    .line 116
    move-object/from16 v1, p0

    sget-object v2, Lcom/dogac/bin1/CarvisZv;->kilit:Ljava/lang/Object;

    monitor-enter v2

    .line 117
    :try_start_0
    sget-object v0, Lcom/dogac/bin1/CarvisZv;->tts:Lcom/k2fsa/sherpa/onnx/OfflineTts;

    if-eqz v0, :cond_0

    monitor-exit v2

    return-void

    .line 118
    :cond_0
    invoke-static {}, Ljava/lang/System;->currentTimeMillis()J

    move-result-wide v3

    .line 119
    invoke-static/range {p0 .. p0}, Lcom/dogac/bin1/CarvisZv;->dizin(Landroid/content/Context;)Ljava/io/File;

    move-result-object v5

    .line 120
    new-instance v6, Ljava/io/File;

    const-string v0, "varliklar.surum"

    invoke-direct {v6, v5, v0}, Ljava/io/File;-><init>(Ljava/io/File;Ljava/lang/String;)V

    const-string v7, "6"
    :try_end_0
    .catchall {:try_start_0 .. :try_end_0} :catchall_0

    .line 121
    const/4 v8, 0x0

    :try_start_1
    new-instance v0, Ljava/io/FileInputStream;

    invoke-direct {v0, v6}, Ljava/io/FileInputStream;-><init>(Ljava/io/File;)V

    const/16 v9, 0x8

    new-array v9, v9, [B

    invoke-virtual {v0, v9}, Ljava/io/FileInputStream;->read([B)I

    move-result v10

    invoke-virtual {v0}, Ljava/io/FileInputStream;->close()V

    if-lez v10, :cond_1

    new-instance v0, Ljava/lang/String;

    invoke-direct {v0, v9, v8, v10}, Ljava/lang/String;-><init>([BII)V

    invoke-virtual {v0, v7}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0
    :try_end_1
    .catch Ljava/lang/Exception; {:try_start_1 .. :try_end_1} :catch_0
    .catchall {:try_start_1 .. :try_end_1} :catchall_0

    if-eqz v0, :cond_1

    const/4 v0, 0x1

    goto :goto_0

    :cond_1
    move v0, v8

    goto :goto_0

    :catch_0
    move-exception v0

    move v0, v8

    .line 122
    :goto_0
    :try_start_2
    invoke-virtual/range {p0 .. p0}, Landroid/content/Context;->getAssets()Landroid/content/res/AssetManager;

    move-result-object v9

    .line 123
    const-wide/32 v10, 0x76e1dcc

    if-nez v0, :cond_4

    .line 124
    const-string v0, "dosyalar kopyalan\u0131yor"

    sput-object v0, Lcom/dogac/bin1/CarvisZv;->asama:Ljava/lang/String;

    .line 125
    const-string v0, "zv"

    invoke-virtual {v9, v0}, Landroid/content/res/AssetManager;->list(Ljava/lang/String;)[Ljava/lang/String;

    move-result-object v0

    array-length v12, v0

    move v13, v8

    :goto_1
    if-ge v13, v12, :cond_3

    aget-object v14, v0, v13

    const-string v15, "fm_decoder_int8.onnx"

    invoke-virtual {v14, v15}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v15

    if-eqz v15, :cond_2

    invoke-static/range {p0 .. p0}, Lcom/dogac/bin1/CarvisZv;->model(Landroid/content/Context;)Ljava/io/File;

    move-result-object v15

    invoke-virtual {v15}, Ljava/io/File;->length()J

    move-result-wide v15

    cmp-long v15, v15, v10

    if-nez v15, :cond_2

    :goto_2
    goto :goto_3

    :cond_2
    new-instance v15, Ljava/lang/StringBuilder;

    invoke-direct {v15}, Ljava/lang/StringBuilder;-><init>()V

    const-string v10, "zv/"

    invoke-virtual {v15, v10}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v10

    invoke-virtual {v10, v14}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v10

    invoke-virtual {v10}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v10

    new-instance v11, Ljava/io/File;

    invoke-direct {v11, v5, v14}, Ljava/io/File;-><init>(Ljava/io/File;Ljava/lang/String;)V

    invoke-static {v9, v10, v11}, Lcom/dogac/bin1/CarvisZv;->kopyala(Landroid/content/res/AssetManager;Ljava/lang/String;Ljava/io/File;)V

    goto :goto_2

    :goto_3
    add-int/lit8 v13, v13, 0x1

    const-wide/32 v10, 0x76e1dcc

    goto :goto_1

    .line 126
    :cond_3
    new-instance v0, Ljava/io/FileOutputStream;

    invoke-direct {v0, v6}, Ljava/io/FileOutputStream;-><init>(Ljava/io/File;)V

    invoke-virtual {v7}, Ljava/lang/String;->getBytes()[B

    move-result-object v6

    invoke-virtual {v0, v6}, Ljava/io/FileOutputStream;->write([B)V

    invoke-virtual {v0}, Ljava/io/FileOutputStream;->close()V

    .line 128
    :cond_4
    new-instance v0, Lcom/k2fsa/sherpa/onnx/OfflineTtsConfig;

    invoke-direct {v0}, Lcom/k2fsa/sherpa/onnx/OfflineTtsConfig;-><init>()V

    .line 129
    invoke-virtual {v0}, Lcom/k2fsa/sherpa/onnx/OfflineTtsConfig;->getModel()Lcom/k2fsa/sherpa/onnx/OfflineTtsModelConfig;

    move-result-object v6

    invoke-virtual {v6}, Lcom/k2fsa/sherpa/onnx/OfflineTtsModelConfig;->getZipvoice()Lcom/k2fsa/sherpa/onnx/OfflineTtsZipVoiceModelConfig;

    move-result-object v6

    .line 130
    new-instance v7, Ljava/io/File;

    const-string v9, "tokens.txt"

    invoke-direct {v7, v5, v9}, Ljava/io/File;-><init>(Ljava/io/File;Ljava/lang/String;)V

    invoke-virtual {v7}, Ljava/io/File;->getPath()Ljava/lang/String;

    move-result-object v7

    invoke-virtual {v6, v7}, Lcom/k2fsa/sherpa/onnx/OfflineTtsZipVoiceModelConfig;->setTokens(Ljava/lang/String;)V

    .line 131
    new-instance v7, Ljava/io/File;

    const-string v9, "text_encoder_int8.onnx"

    invoke-direct {v7, v5, v9}, Ljava/io/File;-><init>(Ljava/io/File;Ljava/lang/String;)V

    invoke-virtual {v7}, Ljava/io/File;->getPath()Ljava/lang/String;

    move-result-object v7

    invoke-virtual {v6, v7}, Lcom/k2fsa/sherpa/onnx/OfflineTtsZipVoiceModelConfig;->setEncoder(Ljava/lang/String;)V

    .line 132
    invoke-static/range {p0 .. p0}, Lcom/dogac/bin1/CarvisZv;->model(Landroid/content/Context;)Ljava/io/File;

    move-result-object v7

    invoke-virtual {v7}, Ljava/io/File;->getPath()Ljava/lang/String;

    move-result-object v7

    invoke-virtual {v6, v7}, Lcom/k2fsa/sherpa/onnx/OfflineTtsZipVoiceModelConfig;->setDecoder(Ljava/lang/String;)V

    .line 133
    new-instance v7, Ljava/io/File;

    const-string v9, "vocos_24khz.onnx"

    invoke-direct {v7, v5, v9}, Ljava/io/File;-><init>(Ljava/io/File;Ljava/lang/String;)V

    invoke-virtual {v7}, Ljava/io/File;->getPath()Ljava/lang/String;

    move-result-object v7

    invoke-virtual {v6, v7}, Lcom/k2fsa/sherpa/onnx/OfflineTtsZipVoiceModelConfig;->setVocoder(Ljava/lang/String;)V

    .line 134
    new-instance v7, Ljava/io/File;

    const-string v9, "espeak-ng-data"

    invoke-direct {v7, v5, v9}, Ljava/io/File;-><init>(Ljava/io/File;Ljava/lang/String;)V

    invoke-virtual {v7}, Ljava/io/File;->getPath()Ljava/lang/String;

    move-result-object v7

    invoke-virtual {v6, v7}, Lcom/k2fsa/sherpa/onnx/OfflineTtsZipVoiceModelConfig;->setDataDir(Ljava/lang/String;)V

    .line 135
    new-instance v7, Ljava/io/File;

    const-string v9, "lexicon.txt"

    invoke-direct {v7, v5, v9}, Ljava/io/File;-><init>(Ljava/io/File;Ljava/lang/String;)V

    invoke-virtual {v7}, Ljava/io/File;->getPath()Ljava/lang/String;

    move-result-object v7

    invoke-virtual {v6, v7}, Lcom/k2fsa/sherpa/onnx/OfflineTtsZipVoiceModelConfig;->setLexicon(Ljava/lang/String;)V

    .line 136
    invoke-virtual {v0}, Lcom/k2fsa/sherpa/onnx/OfflineTtsConfig;->getModel()Lcom/k2fsa/sherpa/onnx/OfflineTtsModelConfig;

    move-result-object v6

    invoke-static {}, Ljava/lang/Runtime;->getRuntime()Ljava/lang/Runtime;

    move-result-object v7

    invoke-virtual {v7}, Ljava/lang/Runtime;->availableProcessors()I

    move-result v7

    const/4 v9, 0x2

    div-int/2addr v7, v9

    const/4 v10, 0x4

    invoke-static {v10, v7}, Ljava/lang/Math;->min(II)I

    move-result v7

    invoke-static {v9, v7}, Ljava/lang/Math;->max(II)I

    move-result v7

    invoke-virtual {v6, v7}, Lcom/k2fsa/sherpa/onnx/OfflineTtsModelConfig;->setNumThreads(I)V

    .line 137
    new-instance v6, Ljava/io/File;

    const-string v7, "ornek.wav"

    invoke-direct {v6, v5, v7}, Ljava/io/File;-><init>(Ljava/io/File;Ljava/lang/String;)V

    invoke-static {v6}, Lcom/dogac/bin1/CarvisZv;->ornekSesOku(Ljava/io/File;)V

    .line 138
    new-instance v6, Ljava/io/FileInputStream;

    new-instance v7, Ljava/io/File;

    const-string v9, "ornek.txt"

    invoke-direct {v7, v5, v9}, Ljava/io/File;-><init>(Ljava/io/File;Ljava/lang/String;)V

    invoke-direct {v6, v7}, Ljava/io/FileInputStream;-><init>(Ljava/io/File;)V

    new-instance v7, Ljava/io/File;

    const-string v9, "ornek.txt"

    invoke-direct {v7, v5, v9}, Ljava/io/File;-><init>(Ljava/io/File;Ljava/lang/String;)V

    invoke-virtual {v7}, Ljava/io/File;->length()J

    move-result-wide v9

    long-to-int v5, v9

    new-array v5, v5, [B

    invoke-virtual {v6, v5}, Ljava/io/FileInputStream;->read([B)I

    move-result v7

    invoke-virtual {v6}, Ljava/io/FileInputStream;->close()V

    .line 139
    new-instance v6, Ljava/lang/String;

    invoke-static {v8, v7}, Ljava/lang/Math;->max(II)I

    move-result v7

    const-string v9, "UTF-8"

    invoke-direct {v6, v5, v8, v7, v9}, Ljava/lang/String;-><init>([BIILjava/lang/String;)V

    invoke-virtual {v6}, Ljava/lang/String;->trim()Ljava/lang/String;

    move-result-object v5

    sput-object v5, Lcom/dogac/bin1/CarvisZv;->ornekMetin:Ljava/lang/String;

    .line 140
    invoke-static/range {p0 .. p0}, Lcom/dogac/bin1/CarvisZv;->model(Landroid/content/Context;)Ljava/io/File;

    move-result-object v5

    invoke-virtual {v5}, Ljava/io/File;->length()J

    move-result-wide v5

    const-wide/32 v7, 0x76e1dcc

    cmp-long v5, v5, v7

    if-nez v5, :cond_5

    .line 141
    const-string v5, "model y\u00fckleniyor"

    invoke-static {v1, v5}, Lcom/dogac/bin1/CarvisZv;->iz(Landroid/content/Context;Ljava/lang/String;)V

    .line 142
    new-instance v5, Lcom/k2fsa/sherpa/onnx/OfflineTts;

    const/4 v6, 0x0

    invoke-direct {v5, v6, v0}, Lcom/k2fsa/sherpa/onnx/OfflineTts;-><init>(Landroid/content/res/AssetManager;Lcom/k2fsa/sherpa/onnx/OfflineTtsConfig;)V

    sput-object v5, Lcom/dogac/bin1/CarvisZv;->tts:Lcom/k2fsa/sherpa/onnx/OfflineTts;

    .line 143
    invoke-static {v1, v6}, Lcom/dogac/bin1/CarvisZv;->iz(Landroid/content/Context;Ljava/lang/String;)V

    .line 144
    invoke-static {}, Ljava/lang/System;->currentTimeMillis()J

    move-result-wide v0

    sub-long/2addr v0, v3

    sput-wide v0, Lcom/dogac/bin1/CarvisZv;->yuklemeMs:J

    const-string v0, "haz\u0131r"

    sput-object v0, Lcom/dogac/bin1/CarvisZv;->asama:Ljava/lang/String;

    .line 145
    monitor-exit v2

    .line 146
    return-void

    .line 140
    :cond_5
    new-instance v0, Ljava/lang/Exception;

    const-string v1, "model dosyas\u0131 eksik"

    invoke-direct {v0, v1}, Ljava/lang/Exception;-><init>(Ljava/lang/String;)V

    throw v0

    .line 145
    :catchall_0
    move-exception v0

    monitor-exit v2
    :try_end_2
    .catchall {:try_start_2 .. :try_end_2} :catchall_0

    throw v0
.end method
