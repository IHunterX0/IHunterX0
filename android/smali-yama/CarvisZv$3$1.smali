.class Lcom/dogac/bin1/CarvisZv$3$1;
.super Ljava/lang/Object;
.source "CarvisZv.java"

# interfaces
.implements Ljava/lang/Runnable;


# annotations
.annotation system Ldalvik/annotation/EnclosingMethod;
    value = Lcom/dogac/bin1/CarvisZv$3;->run()V
.end annotation

.annotation system Ldalvik/annotation/InnerClass;
    accessFlags = 0x0
    name = null
.end annotation


# instance fields
.field final synthetic this$0:Lcom/dogac/bin1/CarvisZv$3;

.field final synthetic val$BITTI:Ljava/lang/Object;

.field final synthetic val$hazir:Ljava/util/concurrent/LinkedBlockingQueue;

.field final synthetic val$l:Ljava/util/ArrayList;


# direct methods
.method constructor <init>(Lcom/dogac/bin1/CarvisZv$3;Ljava/util/ArrayList;Ljava/util/concurrent/LinkedBlockingQueue;Ljava/lang/Object;)V
    .locals 0
    .annotation system Ldalvik/annotation/MethodParameters;
        accessFlags = {
            0x8010,
            0x1010,
            0x1010,
            0x1010
        }
        names = {
            null,
            null,
            null,
            null
        }
    .end annotation

    .annotation system Ldalvik/annotation/Signature;
        value = {
            "()V"
        }
    .end annotation

    .line 218
    iput-object p1, p0, Lcom/dogac/bin1/CarvisZv$3$1;->this$0:Lcom/dogac/bin1/CarvisZv$3;

    iput-object p2, p0, Lcom/dogac/bin1/CarvisZv$3$1;->val$l:Ljava/util/ArrayList;

    iput-object p3, p0, Lcom/dogac/bin1/CarvisZv$3$1;->val$hazir:Ljava/util/concurrent/LinkedBlockingQueue;

    iput-object p4, p0, Lcom/dogac/bin1/CarvisZv$3$1;->val$BITTI:Ljava/lang/Object;

    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    return-void
.end method


# virtual methods
.method public run()V
    .locals 12

    .line 219
    const/4 v0, 0x5

    :try_start_0
    invoke-static {v0}, Landroid/os/Process;->setThreadPriority(I)V
    :try_end_0
    .catchall {:try_start_0 .. :try_end_0} :catchall_0

    goto :goto_0

    :catchall_0
    move-exception v0

    .line 221
    :goto_0
    nop

    .line 222
    :try_start_1
    iget-object v0, p0, Lcom/dogac/bin1/CarvisZv$3$1;->val$l:Ljava/util/ArrayList;

    invoke-virtual {v0}, Ljava/util/ArrayList;->iterator()Ljava/util/Iterator;

    move-result-object v0

    const/4 v1, 0x0

    :goto_1
    invoke-interface {v0}, Ljava/util/Iterator;->hasNext()Z

    move-result v2

    if-eqz v2, :cond_5

    invoke-interface {v0}, Ljava/util/Iterator;->next()Ljava/lang/Object;

    move-result-object v2

    check-cast v2, Ljava/lang/String;

    .line 223
    iget-object v3, p0, Lcom/dogac/bin1/CarvisZv$3$1;->this$0:Lcom/dogac/bin1/CarvisZv$3;

    iget v3, v3, Lcom/dogac/bin1/CarvisZv$3;->val$benim:I

    sget v4, Lcom/dogac/bin1/CarvisZv;->nesil:I

    if-eq v3, v4, :cond_0

    goto/16 :goto_3

    .line 224
    :cond_0
    const/4 v3, 0x1

    add-int/2addr v1, v3

    new-instance v4, Ljava/lang/StringBuilder;

    invoke-direct {v4}, Ljava/lang/StringBuilder;-><init>()V

    const-string v5, "\u00fcretiliyor "

    invoke-virtual {v4, v5}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v4

    invoke-virtual {v4, v1}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    move-result-object v4

    const-string v5, "/"

    invoke-virtual {v4, v5}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v4

    iget-object v5, p0, Lcom/dogac/bin1/CarvisZv$3$1;->val$l:Ljava/util/ArrayList;

    invoke-virtual {v5}, Ljava/util/ArrayList;->size()I

    move-result v5

    invoke-virtual {v4, v5}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    move-result-object v4

    invoke-virtual {v4}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v4

    sput-object v4, Lcom/dogac/bin1/CarvisZv;->asama:Ljava/lang/String;

    .line 225
    invoke-static {}, Ljava/lang/System;->currentTimeMillis()J

    move-result-wide v4

    .line 226
    new-instance v6, Lcom/k2fsa/sherpa/onnx/GenerationConfig;

    invoke-direct {v6}, Lcom/k2fsa/sherpa/onnx/GenerationConfig;-><init>()V

    .line 227
    sget v7, Lcom/dogac/bin1/CarvisZv;->perdeYt:F

    float-to-double v7, v7

    const-wide/high16 v9, 0x4028000000000000L    # 12.0

    div-double/2addr v7, v9

    const-wide/high16 v9, 0x4000000000000000L    # 2.0

    invoke-static {v9, v10, v7, v8}, Ljava/lang/Math;->pow(DD)D

    move-result-wide v7

    double-to-float v7, v7

    .line 228
    iget-object v8, p0, Lcom/dogac/bin1/CarvisZv$3$1;->this$0:Lcom/dogac/bin1/CarvisZv$3;

    iget v8, v8, Lcom/dogac/bin1/CarvisZv$3;->val$hiz:F

    const/4 v9, 0x0

    cmpg-float v8, v8, v9

    if-gtz v8, :cond_1

    const/high16 v8, 0x3f800000    # 1.0f

    goto :goto_2

    :cond_1
    iget-object v8, p0, Lcom/dogac/bin1/CarvisZv$3$1;->this$0:Lcom/dogac/bin1/CarvisZv$3;

    iget v8, v8, Lcom/dogac/bin1/CarvisZv$3;->val$hiz:F

    :goto_2
    div-float/2addr v8, v7

    invoke-virtual {v6, v8}, Lcom/k2fsa/sherpa/onnx/GenerationConfig;->setSpeed(F)V

    sget v8, Lcom/dogac/bin1/CarvisZv;->adim:I

    invoke-virtual {v6, v8}, Lcom/k2fsa/sherpa/onnx/GenerationConfig;->setNumSteps(I)V

    sget-object v8, Lcom/dogac/bin1/CarvisZv;->ornekSes:[F

    invoke-virtual {v6, v8}, Lcom/k2fsa/sherpa/onnx/GenerationConfig;->setReferenceAudio([F)V

    sget v8, Lcom/dogac/bin1/CarvisZv;->ornekSr:I

    invoke-virtual {v6, v8}, Lcom/k2fsa/sherpa/onnx/GenerationConfig;->setReferenceSampleRate(I)V

    sget-object v8, Lcom/dogac/bin1/CarvisZv;->ornekMetin:Ljava/lang/String;

    invoke-virtual {v6, v8}, Lcom/k2fsa/sherpa/onnx/GenerationConfig;->setReferenceText(Ljava/lang/String;)V

    .line 229
    invoke-static {}, Lcom/dogac/bin1/CarvisZv;->bag()Landroid/content/Context;

    move-result-object v8

    new-instance v9, Ljava/lang/StringBuilder;

    invoke-direct {v9}, Ljava/lang/StringBuilder;-><init>()V

    const-string v10, "\u00fcretim "

    invoke-virtual {v9, v10}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v9

    invoke-virtual {v9, v1}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    move-result-object v9

    invoke-virtual {v9}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v9

    invoke-static {v8, v9}, Lcom/dogac/bin1/CarvisZv;->iz(Landroid/content/Context;Ljava/lang/String;)V

    .line 230
    invoke-static {v2}, Lcom/dogac/bin1/CarvisZv;->onbellekOku(Ljava/lang/String;)[F

    move-result-object v8

    .line 231
    const/16 v9, 0x5dc0

    const/4 v10, 0x0

    if-eqz v8, :cond_2

    invoke-static {}, Lcom/dogac/bin1/CarvisZv;->bag()Landroid/content/Context;

    move-result-object v2

    invoke-static {v2, v10}, Lcom/dogac/bin1/CarvisZv;->iz(Landroid/content/Context;Ljava/lang/String;)V

    iget-object v2, p0, Lcom/dogac/bin1/CarvisZv$3$1;->val$hazir:Ljava/util/concurrent/LinkedBlockingQueue;

    invoke-static {v9}, Ljava/lang/Integer;->valueOf(I)Ljava/lang/Integer;

    move-result-object v3

    filled-new-array {v8, v3}, [Ljava/lang/Object;

    move-result-object v3

    invoke-virtual {v2, v3}, Ljava/util/concurrent/LinkedBlockingQueue;->put(Ljava/lang/Object;)V

    goto/16 :goto_1

    .line 233
    :cond_2
    sget-object v8, Lcom/dogac/bin1/CarvisZv;->kilit:Ljava/lang/Object;

    monitor-enter v8
    :try_end_1
    .catchall {:try_start_1 .. :try_end_1} :catchall_2

    :try_start_2
    sget-object v11, Lcom/dogac/bin1/CarvisZv;->tts:Lcom/k2fsa/sherpa/onnx/OfflineTts;

    invoke-virtual {v11, v2, v6}, Lcom/k2fsa/sherpa/onnx/OfflineTts;->generateWithConfig(Ljava/lang/String;Lcom/k2fsa/sherpa/onnx/GenerationConfig;)Lcom/k2fsa/sherpa/onnx/GeneratedAudio;

    move-result-object v6

    monitor-exit v8
    :try_end_2
    .catchall {:try_start_2 .. :try_end_2} :catchall_1

    .line 234
    :try_start_3
    invoke-static {}, Lcom/dogac/bin1/CarvisZv;->bag()Landroid/content/Context;

    move-result-object v8

    invoke-static {v8, v10}, Lcom/dogac/bin1/CarvisZv;->iz(Landroid/content/Context;Ljava/lang/String;)V

    .line 235
    invoke-static {}, Ljava/lang/System;->currentTimeMillis()J

    move-result-wide v10

    sub-long/2addr v10, v4

    sput-wide v10, Lcom/dogac/bin1/CarvisZv;->sonUretimMs:J

    invoke-virtual {v6}, Lcom/k2fsa/sherpa/onnx/GeneratedAudio;->getSamples()[F

    move-result-object v4

    array-length v4, v4

    int-to-long v4, v4

    const-wide/16 v10, 0x3e8

    mul-long/2addr v4, v10

    invoke-virtual {v6}, Lcom/k2fsa/sherpa/onnx/GeneratedAudio;->getSampleRate()I

    move-result v8

    invoke-static {v3, v8}, Ljava/lang/Math;->max(II)I

    move-result v3

    int-to-long v10, v3

    div-long/2addr v4, v10

    sput-wide v4, Lcom/dogac/bin1/CarvisZv;->sonSesMs:J

    .line 236
    invoke-virtual {v6}, Lcom/k2fsa/sherpa/onnx/GeneratedAudio;->getSamples()[F

    move-result-object v3

    array-length v3, v3

    if-eqz v3, :cond_4

    .line 237
    invoke-virtual {v6}, Lcom/k2fsa/sherpa/onnx/GeneratedAudio;->getSamples()[F

    move-result-object v3

    invoke-virtual {v6}, Lcom/k2fsa/sherpa/onnx/GeneratedAudio;->getSampleRate()I

    move-result v4

    invoke-static {v3, v4, v7}, Lcom/dogac/bin1/CarvisZv;->ton([FIF)[F

    move-result-object v3

    invoke-virtual {v6}, Lcom/k2fsa/sherpa/onnx/GeneratedAudio;->getSampleRate()I

    move-result v4

    if-ne v4, v9, :cond_3

    invoke-static {v2, v3}, Lcom/dogac/bin1/CarvisZv;->onbellekYaz(Ljava/lang/String;[F)V

    :cond_3
    iget-object v2, p0, Lcom/dogac/bin1/CarvisZv$3$1;->val$hazir:Ljava/util/concurrent/LinkedBlockingQueue;

    invoke-virtual {v6}, Lcom/k2fsa/sherpa/onnx/GeneratedAudio;->getSampleRate()I

    move-result v4

    invoke-static {v4}, Ljava/lang/Integer;->valueOf(I)Ljava/lang/Integer;

    move-result-object v4

    filled-new-array {v3, v4}, [Ljava/lang/Object;

    move-result-object v3

    invoke-virtual {v2, v3}, Ljava/util/concurrent/LinkedBlockingQueue;->put(Ljava/lang/Object;)V

    .line 238
    goto/16 :goto_1

    .line 236
    :cond_4
    new-instance v0, Ljava/lang/Exception;

    const-string v1, "motor bo\u015f ses \u00fcretti"

    invoke-direct {v0, v1}, Ljava/lang/Exception;-><init>(Ljava/lang/String;)V

    throw v0
    :try_end_3
    .catchall {:try_start_3 .. :try_end_3} :catchall_2

    .line 233
    :catchall_1
    move-exception v0

    :try_start_4
    monitor-exit v8
    :try_end_4
    .catchall {:try_start_4 .. :try_end_4} :catchall_1

    :try_start_5
    throw v0
    :try_end_5
    .catchall {:try_start_5 .. :try_end_5} :catchall_2

    .line 239
    :catchall_2
    move-exception v0

    :try_start_6
    iget-object v1, p0, Lcom/dogac/bin1/CarvisZv$3$1;->val$hazir:Ljava/util/concurrent/LinkedBlockingQueue;

    invoke-virtual {v1, v0}, Ljava/util/concurrent/LinkedBlockingQueue;->put(Ljava/lang/Object;)V
    :try_end_6
    .catch Ljava/lang/Exception; {:try_start_6 .. :try_end_6} :catch_0

    goto :goto_3

    :catch_0
    move-exception v0

    :cond_5
    :goto_3
    nop

    .line 240
    :try_start_7
    iget-object v0, p0, Lcom/dogac/bin1/CarvisZv$3$1;->val$hazir:Ljava/util/concurrent/LinkedBlockingQueue;

    iget-object v1, p0, Lcom/dogac/bin1/CarvisZv$3$1;->val$BITTI:Ljava/lang/Object;

    invoke-virtual {v0, v1}, Ljava/util/concurrent/LinkedBlockingQueue;->put(Ljava/lang/Object;)V
    :try_end_7
    .catch Ljava/lang/Exception; {:try_start_7 .. :try_end_7} :catch_1

    goto :goto_4

    :catch_1
    move-exception v0

    .line 241
    :goto_4
    return-void
.end method
