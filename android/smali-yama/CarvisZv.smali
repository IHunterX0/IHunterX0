.class public final Lcom/dogac/bin1/CarvisZv;
.super Ljava/lang/Object;
.source "CarvisZv.java"


# static fields
.field static final MODEL_BOYUT:J = 0x76e1dccL

.field static final MODEL_URL:Ljava/lang/String; = "https://huggingface.co/k2-fsa/ZipVoice/resolve/main/zipvoice_distill/fm_decoder_int8.onnx"

.field static volatile calan:Landroid/media/AudioTrack;

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

.field static tts:Lcom/k2fsa/sherpa/onnx/OfflineTts;

.field static final yaziKilit:Ljava/lang/Object;

.field static volatile yuzde:I


# direct methods
.method static constructor <clinit>()V
    .locals 1

    .line 29
    new-instance v0, Ljava/lang/Object;

    invoke-direct {v0}, Ljava/lang/Object;-><init>()V

    sput-object v0, Lcom/dogac/bin1/CarvisZv;->kilit:Ljava/lang/Object;

    .line 32
    const-string v0, ""

    sput-object v0, Lcom/dogac/bin1/CarvisZv;->hata:Ljava/lang/String;

    .line 35
    new-instance v0, Ljava/lang/Object;

    invoke-direct {v0}, Ljava/lang/Object;-><init>()V

    sput-object v0, Lcom/dogac/bin1/CarvisZv;->yaziKilit:Ljava/lang/Object;

    .line 36
    new-instance v0, Ljava/util/concurrent/LinkedBlockingQueue;

    invoke-direct {v0}, Ljava/util/concurrent/LinkedBlockingQueue;-><init>()V

    sput-object v0, Lcom/dogac/bin1/CarvisZv;->kuyruk:Ljava/util/concurrent/LinkedBlockingQueue;

    return-void
.end method

.method public constructor <init>()V
    .locals 0

    .line 26
    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    return-void
.end method

.method static bag()Landroid/content/Context;
    .locals 1

    .line 38
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

    .line 209
    const/4 v0, 0x4

    invoke-static {p2, v0, v0}, Landroid/media/AudioTrack;->getMinBufferSize(III)I

    move-result v1

    .line 210
    new-instance v2, Landroid/media/AudioTrack$Builder;

    invoke-direct {v2}, Landroid/media/AudioTrack$Builder;-><init>()V

    new-instance v3, Landroid/media/AudioAttributes$Builder;

    invoke-direct {v3}, Landroid/media/AudioAttributes$Builder;-><init>()V

    .line 211
    const/16 v4, 0x10

    invoke-virtual {v3, v4}, Landroid/media/AudioAttributes$Builder;->setUsage(I)Landroid/media/AudioAttributes$Builder;

    move-result-object v3

    const/4 v4, 0x1

    invoke-virtual {v3, v4}, Landroid/media/AudioAttributes$Builder;->setContentType(I)Landroid/media/AudioAttributes$Builder;

    move-result-object v3

    invoke-virtual {v3}, Landroid/media/AudioAttributes$Builder;->build()Landroid/media/AudioAttributes;

    move-result-object v3

    invoke-virtual {v2, v3}, Landroid/media/AudioTrack$Builder;->setAudioAttributes(Landroid/media/AudioAttributes;)Landroid/media/AudioTrack$Builder;

    move-result-object v2

    new-instance v3, Landroid/media/AudioFormat$Builder;

    invoke-direct {v3}, Landroid/media/AudioFormat$Builder;-><init>()V

    .line 212
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

    .line 213
    invoke-static {v1, p2}, Ljava/lang/Math;->max(II)I

    move-result v1

    invoke-virtual {v0, v1}, Landroid/media/AudioTrack$Builder;->setBufferSizeInBytes(I)Landroid/media/AudioTrack$Builder;

    move-result-object v0

    invoke-virtual {v0, v4}, Landroid/media/AudioTrack$Builder;->setTransferMode(I)Landroid/media/AudioTrack$Builder;

    move-result-object v0

    invoke-virtual {v0}, Landroid/media/AudioTrack$Builder;->build()Landroid/media/AudioTrack;

    move-result-object v0

    .line 214
    sget-object v1, Lcom/dogac/bin1/CarvisZv;->yaziKilit:Ljava/lang/Object;

    monitor-enter v1

    :try_start_0
    sput-object v0, Lcom/dogac/bin1/CarvisZv;->calan:Landroid/media/AudioTrack;

    monitor-exit v1
    :try_end_0
    .catchall {:try_start_0 .. :try_end_0} :catchall_3

    .line 216
    const/4 v1, 0x0

    :try_start_1
    invoke-virtual {v0}, Landroid/media/AudioTrack;->play()V

    .line 217
    div-int/lit8 p2, p2, 0xa

    const/4 v2, 0x0

    move v3, v2

    .line 218
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

    .line 219
    :cond_1
    :goto_1
    sget p2, Lcom/dogac/bin1/CarvisZv;->nesil:I

    if-ne p0, p2, :cond_2

    .line 221
    invoke-static {}, Ljava/lang/System;->currentTimeMillis()J

    move-result-wide v2

    const-wide/16 v4, 0xbb8

    add-long/2addr v2, v4

    .line 222
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

    .line 225
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

    .line 226
    :try_start_3
    invoke-virtual {v0}, Landroid/media/AudioTrack;->stop()V
    :try_end_3
    .catch Ljava/lang/Exception; {:try_start_3 .. :try_end_3} :catch_0

    goto :goto_3

    :catch_0
    move-exception p0

    :goto_3
    invoke-virtual {v0}, Landroid/media/AudioTrack;->release()V

    .line 227
    nop

    .line 228
    return-void

    .line 225
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

    .line 226
    :try_start_6
    invoke-virtual {v0}, Landroid/media/AudioTrack;->stop()V
    :try_end_6
    .catch Ljava/lang/Exception; {:try_start_6 .. :try_end_6} :catch_1

    goto :goto_4

    :catch_1
    move-exception p1

    :goto_4
    invoke-virtual {v0}, Landroid/media/AudioTrack;->release()V

    .line 227
    throw p0

    .line 225
    :catchall_2
    move-exception p0

    :try_start_7
    monitor-exit p1
    :try_end_7
    .catchall {:try_start_7 .. :try_end_7} :catchall_2

    throw p0

    .line 214
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

    .line 191
    const v0, 0x3c23d70a    # 0.01f

    cmpg-float v0, p2, v0

    if-gtz v0, :cond_0

    return-object p0

    .line 192
    :cond_0
    const/high16 v0, 0x3f800000    # 1.0f

    invoke-static {v0, p2}, Ljava/lang/Math;->min(FF)F

    move-result p2

    .line 193
    array-length v1, p0

    int-to-float p1, p1

    const v2, 0x3db851ec    # 0.09f

    mul-float/2addr v2, p1

    float-to-int v2, v2

    add-int/2addr v1, v2

    new-array v2, v1, [F

    .line 195
    div-float v3, v0, p1

    const v4, 0x38b96dd0

    add-float/2addr v3, v4

    div-float/2addr v4, v3

    .line 196
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

    .line 198
    :cond_1
    const p0, 0x3cbc6a7f    # 0.023f

    mul-float/2addr p0, p1

    float-to-int p0, p0

    const v3, 0x3d79db23    # 0.061f

    mul-float/2addr p1, v3

    float-to-int p1, p1

    .line 199
    new-array v3, v1, [F

    .line 200
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

    .line 202
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

    .line 203
    :cond_5
    const p1, 0x3f733333    # 0.95f

    div-float/2addr p1, p0

    .line 204
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

    .line 205
    :cond_6
    return-object v3
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

    .line 136
    new-instance v0, Ljava/util/ArrayList;

    invoke-direct {v0}, Ljava/util/ArrayList;-><init>()V

    new-instance v1, Ljava/lang/StringBuilder;

    invoke-direct {v1}, Ljava/lang/StringBuilder;-><init>()V

    .line 137
    const/4 v2, 0x0

    move v3, v2

    :goto_0
    invoke-virtual {p0}, Ljava/lang/String;->length()I

    move-result v4

    const/4 v5, 0x1

    if-ge v3, v4, :cond_7

    .line 138
    invoke-virtual {p0, v3}, Ljava/lang/String;->charAt(I)C

    move-result v4

    invoke-virtual {v1, v4}, Ljava/lang/StringBuilder;->append(C)Ljava/lang/StringBuilder;

    .line 139
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

    .line 140
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

    .line 137
    :cond_6
    add-int/lit8 v3, v3, 0x1

    goto :goto_0

    .line 142
    :cond_7
    invoke-virtual {v1}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object p0

    invoke-virtual {p0}, Ljava/lang/String;->trim()Ljava/lang/String;

    move-result-object p0

    invoke-virtual {p0}, Ljava/lang/String;->length()I

    move-result v1

    if-lez v1, :cond_8

    invoke-virtual {v0, p0}, Ljava/util/ArrayList;->add(Ljava/lang/Object;)Z

    .line 144
    :cond_8
    new-instance p0, Ljava/util/ArrayList;

    invoke-direct {p0}, Ljava/util/ArrayList;-><init>()V

    .line 145
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

    move-result v2

    if-nez v2, :cond_9

    invoke-virtual {v1}, Ljava/lang/String;->length()I

    move-result v2

    const/16 v3, 0xc

    if-ge v2, v3, :cond_9

    invoke-virtual {p0}, Ljava/util/ArrayList;->size()I

    move-result v2

    sub-int/2addr v2, v5

    new-instance v3, Ljava/lang/StringBuilder;

    invoke-direct {v3}, Ljava/lang/StringBuilder;-><init>()V

    invoke-virtual {p0}, Ljava/util/ArrayList;->size()I

    move-result v4

    sub-int/2addr v4, v5

    invoke-virtual {p0, v4}, Ljava/util/ArrayList;->get(I)Ljava/lang/Object;

    move-result-object v4

    check-cast v4, Ljava/lang/String;

    invoke-virtual {v3, v4}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v3

    const-string v4, " "

    invoke-virtual {v3, v4}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v3

    invoke-virtual {v3, v1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v1

    invoke-virtual {v1}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v1

    invoke-virtual {p0, v2, v1}, Ljava/util/ArrayList;->set(ILjava/lang/Object;)Ljava/lang/Object;

    goto :goto_2

    :cond_9
    invoke-virtual {p0, v1}, Ljava/util/ArrayList;->add(Ljava/lang/Object;)Z

    goto :goto_2

    .line 146
    :cond_a
    return-object p0
.end method

.method static dizin(Landroid/content/Context;)Ljava/io/File;
    .locals 2

    .line 39
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

    .line 230
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
    .locals 10

    .line 43
    new-instance v0, Lorg/json/JSONObject;

    invoke-direct {v0}, Lorg/json/JSONObject;-><init>()V

    .line 45
    :try_start_0
    invoke-static {}, Lcom/dogac/bin1/CarvisZv;->bag()Landroid/content/Context;

    move-result-object v1

    .line 46
    const/4 v2, 0x1

    const/4 v3, 0x0

    if-eqz v1, :cond_0

    invoke-static {v1}, Lcom/dogac/bin1/CarvisZv;->model(Landroid/content/Context;)Ljava/io/File;

    move-result-object v4

    invoke-virtual {v4}, Ljava/io/File;->length()J

    move-result-wide v4
    :try_end_0
    .catch Ljava/lang/Exception; {:try_start_0 .. :try_end_0} :catch_2

    const-wide/32 v6, 0x76e1dcc

    cmp-long v4, v4, v6

    if-nez v4, :cond_0

    move v4, v2

    goto :goto_0

    :cond_0
    move v4, v3

    .line 47
    :goto_0
    nop

    .line 48
    if-eqz v1, :cond_2

    :try_start_1
    invoke-virtual {v1}, Landroid/content/Context;->getAssets()Landroid/content/res/AssetManager;

    move-result-object v1

    const-string v5, "zv"

    invoke-virtual {v1, v5}, Landroid/content/res/AssetManager;->list(Ljava/lang/String;)[Ljava/lang/String;

    move-result-object v1

    array-length v5, v1
    :try_end_1
    .catch Ljava/lang/Exception; {:try_start_1 .. :try_end_1} :catch_1

    move v6, v3

    move v7, v6

    :goto_1
    if-ge v6, v5, :cond_3

    :try_start_2
    aget-object v8, v1, v6

    const-string v9, "ornek.wav"

    invoke-virtual {v8, v9}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v8
    :try_end_2
    .catch Ljava/lang/Exception; {:try_start_2 .. :try_end_2} :catch_0

    if-eqz v8, :cond_1

    move v7, v2

    :cond_1
    add-int/lit8 v6, v6, 0x1

    goto :goto_1

    :catch_0
    move-exception v1

    goto :goto_2

    :catch_1
    move-exception v1

    move v7, v3

    goto :goto_2

    :cond_2
    move v7, v3

    .line 49
    :cond_3
    :goto_2
    :try_start_3
    const-string v1, "model"

    invoke-virtual {v0, v1, v4}, Lorg/json/JSONObject;->put(Ljava/lang/String;Z)Lorg/json/JSONObject;

    const-string v1, "ornek"

    invoke-virtual {v0, v1, v7}, Lorg/json/JSONObject;->put(Ljava/lang/String;Z)Lorg/json/JSONObject;

    const-string v1, "hazir"

    sget-object v4, Lcom/dogac/bin1/CarvisZv;->tts:Lcom/k2fsa/sherpa/onnx/OfflineTts;

    if-eqz v4, :cond_4

    goto :goto_3

    :cond_4
    move v2, v3

    :goto_3
    invoke-virtual {v0, v1, v2}, Lorg/json/JSONObject;->put(Ljava/lang/String;Z)Lorg/json/JSONObject;

    const-string v1, "indiriliyor"

    sget-boolean v2, Lcom/dogac/bin1/CarvisZv;->indiriliyor:Z

    invoke-virtual {v0, v1, v2}, Lorg/json/JSONObject;->put(Ljava/lang/String;Z)Lorg/json/JSONObject;

    const-string v1, "yuzde"

    sget v2, Lcom/dogac/bin1/CarvisZv;->yuzde:I

    invoke-virtual {v0, v1, v2}, Lorg/json/JSONObject;->put(Ljava/lang/String;I)Lorg/json/JSONObject;

    const-string v1, "hata"

    sget-object v2, Lcom/dogac/bin1/CarvisZv;->hata:Ljava/lang/String;

    invoke-virtual {v0, v1, v2}, Lorg/json/JSONObject;->put(Ljava/lang/String;Ljava/lang/Object;)Lorg/json/JSONObject;

    .line 50
    const-string v1, "abi"

    sget-object v2, Landroid/os/Build;->SUPPORTED_ABIS:[Ljava/lang/String;

    array-length v2, v2

    if-lez v2, :cond_5

    sget-object v2, Landroid/os/Build;->SUPPORTED_ABIS:[Ljava/lang/String;

    aget-object v2, v2, v3

    goto :goto_4

    :cond_5
    const-string v2, ""

    :goto_4
    invoke-virtual {v0, v1, v2}, Lorg/json/JSONObject;->put(Ljava/lang/String;Ljava/lang/Object;)Lorg/json/JSONObject;
    :try_end_3
    .catch Ljava/lang/Exception; {:try_start_3 .. :try_end_3} :catch_2

    goto :goto_5

    .line 51
    :catch_2
    move-exception v1

    :goto_5
    nop

    .line 52
    invoke-virtual {v0}, Lorg/json/JSONObject;->toString()Ljava/lang/String;

    move-result-object v0

    return-object v0
.end method

.method public static indir()V
    .locals 3

    .line 56
    sget-boolean v0, Lcom/dogac/bin1/CarvisZv;->indiriliyor:Z

    if-eqz v0, :cond_0

    return-void

    .line 57
    :cond_0
    invoke-static {}, Lcom/dogac/bin1/CarvisZv;->bag()Landroid/content/Context;

    move-result-object v0

    if-nez v0, :cond_1

    return-void

    .line 58
    :cond_1
    const/4 v1, 0x1

    sput-boolean v1, Lcom/dogac/bin1/CarvisZv;->indiriliyor:Z

    const-string v1, ""

    sput-object v1, Lcom/dogac/bin1/CarvisZv;->hata:Ljava/lang/String;

    const/4 v1, 0x0

    sput v1, Lcom/dogac/bin1/CarvisZv;->yuzde:I

    .line 59
    new-instance v1, Ljava/lang/Thread;

    new-instance v2, Lcom/dogac/bin1/CarvisZv$1;

    invoke-direct {v2, v0}, Lcom/dogac/bin1/CarvisZv$1;-><init>(Landroid/content/Context;)V

    invoke-direct {v1, v2}, Ljava/lang/Thread;-><init>(Ljava/lang/Runnable;)V

    .line 82
    invoke-virtual {v1}, Ljava/lang/Thread;->start()V

    .line 83
    return-void
.end method

.method public static konus(Ljava/lang/String;Ljava/lang/String;FF)V
    .locals 8

    .line 151
    sget v0, Lcom/dogac/bin1/CarvisZv;->nesil:I

    add-int/lit8 v3, v0, 0x1

    sput v3, Lcom/dogac/bin1/CarvisZv;->nesil:I

    .line 152
    invoke-static {}, Lcom/dogac/bin1/CarvisZv;->durdurCalan()V

    .line 153
    new-instance v0, Ljava/lang/Thread;

    new-instance v7, Lcom/dogac/bin1/CarvisZv$2;

    move-object v1, v7

    move-object v2, p1

    move v4, p2

    move v5, p3

    move-object v6, p0

    invoke-direct/range {v1 .. v6}, Lcom/dogac/bin1/CarvisZv$2;-><init>(Ljava/lang/String;IFFLjava/lang/String;)V

    invoke-direct {v0, v7}, Ljava/lang/Thread;-><init>(Ljava/lang/Runnable;)V

    .line 186
    invoke-virtual {v0}, Ljava/lang/Thread;->start()V

    .line 187
    return-void
.end method

.method static kopyala(Landroid/content/res/AssetManager;Ljava/lang/String;Ljava/io/File;)V
    .locals 6
    .annotation system Ldalvik/annotation/Throws;
        value = {
            Ljava/lang/Exception;
        }
    .end annotation

    .line 86
    invoke-virtual {p0, p1}, Landroid/content/res/AssetManager;->list(Ljava/lang/String;)[Ljava/lang/String;

    move-result-object v0

    .line 87
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

    .line 88
    :cond_1
    invoke-virtual {p0, p1}, Landroid/content/res/AssetManager;->open(Ljava/lang/String;)Ljava/io/InputStream;

    move-result-object p0

    new-instance p1, Ljava/io/FileOutputStream;

    invoke-direct {p1, p2}, Ljava/io/FileOutputStream;-><init>(Ljava/io/File;)V

    .line 89
    const/high16 p2, 0x10000

    new-array p2, p2, [B

    :goto_1
    invoke-virtual {p0, p2}, Ljava/io/InputStream;->read([B)I

    move-result v0

    if-lez v0, :cond_2

    invoke-virtual {p1, p2, v1, v0}, Ljava/io/OutputStream;->write([BII)V

    goto :goto_1

    .line 90
    :cond_2
    invoke-virtual {p1}, Ljava/io/OutputStream;->close()V

    invoke-virtual {p0}, Ljava/io/InputStream;->close()V

    .line 91
    return-void
.end method

.method static model(Landroid/content/Context;)Ljava/io/File;
    .locals 2

    .line 40
    new-instance v0, Ljava/io/File;

    invoke-static {p0}, Lcom/dogac/bin1/CarvisZv;->dizin(Landroid/content/Context;)Ljava/io/File;

    move-result-object p0

    const-string v1, "fm_decoder_int8.onnx"

    invoke-direct {v0, p0, v1}, Ljava/io/File;-><init>(Ljava/io/File;Ljava/lang/String;)V

    return-object v0
.end method

.method static ornekSesOku(Ljava/io/File;)V
    .locals 12
    .annotation system Ldalvik/annotation/Throws;
        value = {
            Ljava/lang/Exception;
        }
    .end annotation

    .line 121
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

    .line 122
    const/16 v2, 0xc

    const/16 v3, 0x10

    const/4 v4, 0x1

    move v7, p0

    move v6, v3

    move v5, v4

    .line 123
    :goto_1
    add-int/lit8 v8, v2, 0x8

    if-gt v8, v0, :cond_3

    .line 124
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

    .line 125
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

    .line 126
    :cond_1
    const-string v11, "data"

    invoke-virtual {v9, v11}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v9

    if-eqz v9, :cond_2

    sub-int/2addr v0, v8

    invoke-static {v10, v0}, Ljava/lang/Math;->min(II)I

    move-result v0

    goto :goto_2

    .line 127
    :cond_2
    add-int/lit8 v8, v10, 0x8

    and-int/lit8 v9, v10, 0x1

    add-int/2addr v8, v9

    add-int/2addr v2, v8

    .line 128
    goto/16 :goto_1

    .line 123
    :cond_3
    const/4 v8, -0x1

    move v0, p0

    .line 129
    :goto_2
    if-ltz v8, :cond_5

    if-ne v6, v3, :cond_5

    if-ne v5, v4, :cond_5

    .line 130
    div-int/lit8 v0, v0, 0x2

    new-array v2, v0, [F

    .line 131
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

    .line 132
    :cond_4
    sput-object v2, Lcom/dogac/bin1/CarvisZv;->ornekSes:[F

    sput v7, Lcom/dogac/bin1/CarvisZv;->ornekSr:I

    .line 133
    return-void

    .line 129
    :cond_5
    new-instance p0, Ljava/lang/Exception;

    const-string v0, "ornek.wav 16 bit mono olmal\u0131"

    invoke-direct {p0, v0}, Ljava/lang/Exception;-><init>(Ljava/lang/String;)V

    throw p0
.end method

.method public static sus()V
    .locals 1

    .line 232
    sget v0, Lcom/dogac/bin1/CarvisZv;->nesil:I

    add-int/lit8 v0, v0, 0x1

    sput v0, Lcom/dogac/bin1/CarvisZv;->nesil:I

    invoke-static {}, Lcom/dogac/bin1/CarvisZv;->durdurCalan()V

    return-void
.end method

.method static yukle(Landroid/content/Context;)V
    .locals 12
    .annotation system Ldalvik/annotation/Throws;
        value = {
            Ljava/lang/Exception;
        }
    .end annotation

    .line 94
    sget-object v0, Lcom/dogac/bin1/CarvisZv;->kilit:Ljava/lang/Object;

    monitor-enter v0

    .line 95
    :try_start_0
    sget-object v1, Lcom/dogac/bin1/CarvisZv;->tts:Lcom/k2fsa/sherpa/onnx/OfflineTts;

    if-eqz v1, :cond_0

    monitor-exit v0

    return-void

    .line 96
    :cond_0
    invoke-static {p0}, Lcom/dogac/bin1/CarvisZv;->dizin(Landroid/content/Context;)Ljava/io/File;

    move-result-object v1

    .line 97
    invoke-static {p0}, Lcom/dogac/bin1/CarvisZv;->model(Landroid/content/Context;)Ljava/io/File;

    move-result-object v2

    invoke-virtual {v2}, Ljava/io/File;->length()J

    move-result-wide v2

    const-wide/32 v4, 0x76e1dcc

    cmp-long v2, v2, v4

    if-nez v2, :cond_4

    .line 98
    new-instance v2, Ljava/io/File;

    const-string v3, "varliklar.surum"

    invoke-direct {v2, v1, v3}, Ljava/io/File;-><init>(Ljava/io/File;Ljava/lang/String;)V

    const-string v3, "4"
    :try_end_0
    .catchall {:try_start_0 .. :try_end_0} :catchall_0

    .line 99
    const/4 v4, 0x0

    :try_start_1
    new-instance v5, Ljava/io/FileInputStream;

    invoke-direct {v5, v2}, Ljava/io/FileInputStream;-><init>(Ljava/io/File;)V

    const/16 v6, 0x8

    new-array v6, v6, [B

    invoke-virtual {v5, v6}, Ljava/io/FileInputStream;->read([B)I

    move-result v7

    invoke-virtual {v5}, Ljava/io/FileInputStream;->close()V

    if-lez v7, :cond_1

    new-instance v5, Ljava/lang/String;

    invoke-direct {v5, v6, v4, v7}, Ljava/lang/String;-><init>([BII)V

    invoke-virtual {v5, v3}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v5
    :try_end_1
    .catch Ljava/lang/Exception; {:try_start_1 .. :try_end_1} :catch_0
    .catchall {:try_start_1 .. :try_end_1} :catchall_0

    if-eqz v5, :cond_1

    const/4 v5, 0x1

    goto :goto_0

    :cond_1
    move v5, v4

    goto :goto_0

    :catch_0
    move-exception v5

    move v5, v4

    .line 100
    :goto_0
    :try_start_2
    invoke-virtual {p0}, Landroid/content/Context;->getAssets()Landroid/content/res/AssetManager;

    move-result-object v6

    .line 101
    if-nez v5, :cond_3

    .line 102
    const-string v5, "zv"

    invoke-virtual {v6, v5}, Landroid/content/res/AssetManager;->list(Ljava/lang/String;)[Ljava/lang/String;

    move-result-object v5

    array-length v7, v5

    move v8, v4

    :goto_1
    if-ge v8, v7, :cond_2

    aget-object v9, v5, v8

    new-instance v10, Ljava/lang/StringBuilder;

    invoke-direct {v10}, Ljava/lang/StringBuilder;-><init>()V

    const-string v11, "zv/"

    invoke-virtual {v10, v11}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v10

    invoke-virtual {v10, v9}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v10

    invoke-virtual {v10}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v10

    new-instance v11, Ljava/io/File;

    invoke-direct {v11, v1, v9}, Ljava/io/File;-><init>(Ljava/io/File;Ljava/lang/String;)V

    invoke-static {v6, v10, v11}, Lcom/dogac/bin1/CarvisZv;->kopyala(Landroid/content/res/AssetManager;Ljava/lang/String;Ljava/io/File;)V

    add-int/lit8 v8, v8, 0x1

    goto :goto_1

    .line 103
    :cond_2
    new-instance v5, Ljava/io/FileOutputStream;

    invoke-direct {v5, v2}, Ljava/io/FileOutputStream;-><init>(Ljava/io/File;)V

    invoke-virtual {v3}, Ljava/lang/String;->getBytes()[B

    move-result-object v2

    invoke-virtual {v5, v2}, Ljava/io/FileOutputStream;->write([B)V

    invoke-virtual {v5}, Ljava/io/FileOutputStream;->close()V

    .line 105
    :cond_3
    new-instance v2, Lcom/k2fsa/sherpa/onnx/OfflineTtsConfig;

    invoke-direct {v2}, Lcom/k2fsa/sherpa/onnx/OfflineTtsConfig;-><init>()V

    .line 106
    iget-object v3, v2, Lcom/k2fsa/sherpa/onnx/OfflineTtsConfig;->model:Lcom/k2fsa/sherpa/onnx/OfflineTtsModelConfig;

    iget-object v3, v3, Lcom/k2fsa/sherpa/onnx/OfflineTtsModelConfig;->zipvoice:Lcom/k2fsa/sherpa/onnx/OfflineTtsZipVoiceModelConfig;

    new-instance v5, Ljava/io/File;

    const-string v6, "tokens.txt"

    invoke-direct {v5, v1, v6}, Ljava/io/File;-><init>(Ljava/io/File;Ljava/lang/String;)V

    invoke-virtual {v5}, Ljava/io/File;->getPath()Ljava/lang/String;

    move-result-object v5

    iput-object v5, v3, Lcom/k2fsa/sherpa/onnx/OfflineTtsZipVoiceModelConfig;->tokens:Ljava/lang/String;

    .line 107
    iget-object v3, v2, Lcom/k2fsa/sherpa/onnx/OfflineTtsConfig;->model:Lcom/k2fsa/sherpa/onnx/OfflineTtsModelConfig;

    iget-object v3, v3, Lcom/k2fsa/sherpa/onnx/OfflineTtsModelConfig;->zipvoice:Lcom/k2fsa/sherpa/onnx/OfflineTtsZipVoiceModelConfig;

    new-instance v5, Ljava/io/File;

    const-string v6, "text_encoder_int8.onnx"

    invoke-direct {v5, v1, v6}, Ljava/io/File;-><init>(Ljava/io/File;Ljava/lang/String;)V

    invoke-virtual {v5}, Ljava/io/File;->getPath()Ljava/lang/String;

    move-result-object v5

    iput-object v5, v3, Lcom/k2fsa/sherpa/onnx/OfflineTtsZipVoiceModelConfig;->encoder:Ljava/lang/String;

    .line 108
    iget-object v3, v2, Lcom/k2fsa/sherpa/onnx/OfflineTtsConfig;->model:Lcom/k2fsa/sherpa/onnx/OfflineTtsModelConfig;

    iget-object v3, v3, Lcom/k2fsa/sherpa/onnx/OfflineTtsModelConfig;->zipvoice:Lcom/k2fsa/sherpa/onnx/OfflineTtsZipVoiceModelConfig;

    invoke-static {p0}, Lcom/dogac/bin1/CarvisZv;->model(Landroid/content/Context;)Ljava/io/File;

    move-result-object p0

    invoke-virtual {p0}, Ljava/io/File;->getPath()Ljava/lang/String;

    move-result-object p0

    iput-object p0, v3, Lcom/k2fsa/sherpa/onnx/OfflineTtsZipVoiceModelConfig;->decoder:Ljava/lang/String;

    .line 109
    iget-object p0, v2, Lcom/k2fsa/sherpa/onnx/OfflineTtsConfig;->model:Lcom/k2fsa/sherpa/onnx/OfflineTtsModelConfig;

    iget-object p0, p0, Lcom/k2fsa/sherpa/onnx/OfflineTtsModelConfig;->zipvoice:Lcom/k2fsa/sherpa/onnx/OfflineTtsZipVoiceModelConfig;

    new-instance v3, Ljava/io/File;

    const-string v5, "vocos_24khz.onnx"

    invoke-direct {v3, v1, v5}, Ljava/io/File;-><init>(Ljava/io/File;Ljava/lang/String;)V

    invoke-virtual {v3}, Ljava/io/File;->getPath()Ljava/lang/String;

    move-result-object v3

    iput-object v3, p0, Lcom/k2fsa/sherpa/onnx/OfflineTtsZipVoiceModelConfig;->vocoder:Ljava/lang/String;

    .line 110
    iget-object p0, v2, Lcom/k2fsa/sherpa/onnx/OfflineTtsConfig;->model:Lcom/k2fsa/sherpa/onnx/OfflineTtsModelConfig;

    iget-object p0, p0, Lcom/k2fsa/sherpa/onnx/OfflineTtsModelConfig;->zipvoice:Lcom/k2fsa/sherpa/onnx/OfflineTtsZipVoiceModelConfig;

    new-instance v3, Ljava/io/File;

    const-string v5, "espeak-ng-data"

    invoke-direct {v3, v1, v5}, Ljava/io/File;-><init>(Ljava/io/File;Ljava/lang/String;)V

    invoke-virtual {v3}, Ljava/io/File;->getPath()Ljava/lang/String;

    move-result-object v3

    iput-object v3, p0, Lcom/k2fsa/sherpa/onnx/OfflineTtsZipVoiceModelConfig;->dataDir:Ljava/lang/String;

    .line 111
    iget-object p0, v2, Lcom/k2fsa/sherpa/onnx/OfflineTtsConfig;->model:Lcom/k2fsa/sherpa/onnx/OfflineTtsModelConfig;

    iget-object p0, p0, Lcom/k2fsa/sherpa/onnx/OfflineTtsModelConfig;->zipvoice:Lcom/k2fsa/sherpa/onnx/OfflineTtsZipVoiceModelConfig;

    new-instance v3, Ljava/io/File;

    const-string v5, "lexicon.txt"

    invoke-direct {v3, v1, v5}, Ljava/io/File;-><init>(Ljava/io/File;Ljava/lang/String;)V

    invoke-virtual {v3}, Ljava/io/File;->getPath()Ljava/lang/String;

    move-result-object v3

    iput-object v3, p0, Lcom/k2fsa/sherpa/onnx/OfflineTtsZipVoiceModelConfig;->lexicon:Ljava/lang/String;

    .line 112
    iget-object p0, v2, Lcom/k2fsa/sherpa/onnx/OfflineTtsConfig;->model:Lcom/k2fsa/sherpa/onnx/OfflineTtsModelConfig;

    invoke-static {}, Ljava/lang/Runtime;->getRuntime()Ljava/lang/Runtime;

    move-result-object v3

    invoke-virtual {v3}, Ljava/lang/Runtime;->availableProcessors()I

    move-result v3

    const/4 v5, 0x2

    div-int/2addr v3, v5

    const/4 v6, 0x4

    invoke-static {v6, v3}, Ljava/lang/Math;->min(II)I

    move-result v3

    invoke-static {v5, v3}, Ljava/lang/Math;->max(II)I

    move-result v3

    iput v3, p0, Lcom/k2fsa/sherpa/onnx/OfflineTtsModelConfig;->numThreads:I

    .line 113
    new-instance p0, Ljava/io/File;

    const-string v3, "ornek.wav"

    invoke-direct {p0, v1, v3}, Ljava/io/File;-><init>(Ljava/io/File;Ljava/lang/String;)V

    invoke-static {p0}, Lcom/dogac/bin1/CarvisZv;->ornekSesOku(Ljava/io/File;)V

    .line 114
    new-instance p0, Ljava/io/FileInputStream;

    new-instance v3, Ljava/io/File;

    const-string v5, "ornek.txt"

    invoke-direct {v3, v1, v5}, Ljava/io/File;-><init>(Ljava/io/File;Ljava/lang/String;)V

    invoke-direct {p0, v3}, Ljava/io/FileInputStream;-><init>(Ljava/io/File;)V

    new-instance v3, Ljava/io/File;

    const-string v5, "ornek.txt"

    invoke-direct {v3, v1, v5}, Ljava/io/File;-><init>(Ljava/io/File;Ljava/lang/String;)V

    invoke-virtual {v3}, Ljava/io/File;->length()J

    move-result-wide v5

    long-to-int v1, v5

    new-array v1, v1, [B

    invoke-virtual {p0, v1}, Ljava/io/FileInputStream;->read([B)I

    move-result v3

    invoke-virtual {p0}, Ljava/io/FileInputStream;->close()V

    .line 115
    new-instance p0, Ljava/lang/String;

    invoke-static {v4, v3}, Ljava/lang/Math;->max(II)I

    move-result v3

    const-string v5, "UTF-8"

    invoke-direct {p0, v1, v4, v3, v5}, Ljava/lang/String;-><init>([BIILjava/lang/String;)V

    invoke-virtual {p0}, Ljava/lang/String;->trim()Ljava/lang/String;

    move-result-object p0

    sput-object p0, Lcom/dogac/bin1/CarvisZv;->ornekMetin:Ljava/lang/String;

    .line 116
    new-instance p0, Lcom/k2fsa/sherpa/onnx/OfflineTts;

    invoke-direct {p0, v2}, Lcom/k2fsa/sherpa/onnx/OfflineTts;-><init>(Lcom/k2fsa/sherpa/onnx/OfflineTtsConfig;)V

    sput-object p0, Lcom/dogac/bin1/CarvisZv;->tts:Lcom/k2fsa/sherpa/onnx/OfflineTts;

    .line 117
    monitor-exit v0

    .line 118
    return-void

    .line 97
    :cond_4
    new-instance p0, Ljava/lang/Exception;

    const-string v1, "model indirilmedi"

    invoke-direct {p0, v1}, Ljava/lang/Exception;-><init>(Ljava/lang/String;)V

    throw p0

    .line 117
    :catchall_0
    move-exception p0

    monitor-exit v0
    :try_end_2
    .catchall {:try_start_2 .. :try_end_2} :catchall_0

    throw p0
.end method
