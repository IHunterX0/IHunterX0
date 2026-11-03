.class Lcom/dogac/bin1/CarvisZv$2$1;
.super Ljava/lang/Object;
.source "CarvisZv.java"

# interfaces
.implements Ljava/lang/Runnable;


# annotations
.annotation system Ldalvik/annotation/EnclosingMethod;
    value = Lcom/dogac/bin1/CarvisZv$2;->run()V
.end annotation

.annotation system Ldalvik/annotation/InnerClass;
    accessFlags = 0x0
    name = null
.end annotation


# instance fields
.field final synthetic this$0:Lcom/dogac/bin1/CarvisZv$2;

.field final synthetic val$BITTI:Ljava/lang/Object;

.field final synthetic val$hazir:Ljava/util/concurrent/LinkedBlockingQueue;

.field final synthetic val$l:Ljava/util/ArrayList;


# direct methods
.method constructor <init>(Lcom/dogac/bin1/CarvisZv$2;Ljava/util/ArrayList;Ljava/util/concurrent/LinkedBlockingQueue;Ljava/lang/Object;)V
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

    .line 161
    iput-object p1, p0, Lcom/dogac/bin1/CarvisZv$2$1;->this$0:Lcom/dogac/bin1/CarvisZv$2;

    iput-object p2, p0, Lcom/dogac/bin1/CarvisZv$2$1;->val$l:Ljava/util/ArrayList;

    iput-object p3, p0, Lcom/dogac/bin1/CarvisZv$2$1;->val$hazir:Ljava/util/concurrent/LinkedBlockingQueue;

    iput-object p4, p0, Lcom/dogac/bin1/CarvisZv$2$1;->val$BITTI:Ljava/lang/Object;

    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    return-void
.end method


# virtual methods
.method public run()V
    .locals 5

    .line 163
    :try_start_0
    iget-object v0, p0, Lcom/dogac/bin1/CarvisZv$2$1;->val$l:Ljava/util/ArrayList;

    invoke-virtual {v0}, Ljava/util/ArrayList;->iterator()Ljava/util/Iterator;

    move-result-object v0

    :goto_0
    invoke-interface {v0}, Ljava/util/Iterator;->hasNext()Z

    move-result v1

    if-eqz v1, :cond_2

    invoke-interface {v0}, Ljava/util/Iterator;->next()Ljava/lang/Object;

    move-result-object v1

    check-cast v1, Ljava/lang/String;

    .line 164
    iget-object v2, p0, Lcom/dogac/bin1/CarvisZv$2$1;->this$0:Lcom/dogac/bin1/CarvisZv$2;

    iget v2, v2, Lcom/dogac/bin1/CarvisZv$2;->val$benim:I

    sget v3, Lcom/dogac/bin1/CarvisZv;->nesil:I

    if-eq v2, v3, :cond_0

    goto :goto_2

    .line 165
    :cond_0
    new-instance v2, Lcom/k2fsa/sherpa/onnx/GenerationConfig;

    invoke-direct {v2}, Lcom/k2fsa/sherpa/onnx/GenerationConfig;-><init>()V

    .line 166
    iget-object v3, p0, Lcom/dogac/bin1/CarvisZv$2$1;->this$0:Lcom/dogac/bin1/CarvisZv$2;

    iget v3, v3, Lcom/dogac/bin1/CarvisZv$2;->val$hiz:F

    const/4 v4, 0x0

    cmpg-float v3, v3, v4

    if-gtz v3, :cond_1

    const/high16 v3, 0x3f800000    # 1.0f

    goto :goto_1

    :cond_1
    iget-object v3, p0, Lcom/dogac/bin1/CarvisZv$2$1;->this$0:Lcom/dogac/bin1/CarvisZv$2;

    iget v3, v3, Lcom/dogac/bin1/CarvisZv$2;->val$hiz:F

    :goto_1
    iput v3, v2, Lcom/k2fsa/sherpa/onnx/GenerationConfig;->speed:F

    const/4 v3, 0x4

    iput v3, v2, Lcom/k2fsa/sherpa/onnx/GenerationConfig;->numSteps:I

    sget-object v3, Lcom/dogac/bin1/CarvisZv;->ornekSes:[F

    iput-object v3, v2, Lcom/k2fsa/sherpa/onnx/GenerationConfig;->referenceAudio:[F

    sget v3, Lcom/dogac/bin1/CarvisZv;->ornekSr:I

    iput v3, v2, Lcom/k2fsa/sherpa/onnx/GenerationConfig;->referenceSampleRate:I

    sget-object v3, Lcom/dogac/bin1/CarvisZv;->ornekMetin:Ljava/lang/String;

    iput-object v3, v2, Lcom/k2fsa/sherpa/onnx/GenerationConfig;->referenceText:Ljava/lang/String;

    .line 168
    sget-object v3, Lcom/dogac/bin1/CarvisZv;->kilit:Ljava/lang/Object;

    monitor-enter v3
    :try_end_0
    .catchall {:try_start_0 .. :try_end_0} :catchall_1

    :try_start_1
    sget-object v4, Lcom/dogac/bin1/CarvisZv;->tts:Lcom/k2fsa/sherpa/onnx/OfflineTts;

    invoke-virtual {v4, v1, v2}, Lcom/k2fsa/sherpa/onnx/OfflineTts;->generateWithConfig(Ljava/lang/String;Lcom/k2fsa/sherpa/onnx/GenerationConfig;)Lcom/k2fsa/sherpa/onnx/GeneratedAudio;

    move-result-object v1

    monitor-exit v3
    :try_end_1
    .catchall {:try_start_1 .. :try_end_1} :catchall_0

    .line 169
    :try_start_2
    iget-object v2, p0, Lcom/dogac/bin1/CarvisZv$2$1;->val$hazir:Ljava/util/concurrent/LinkedBlockingQueue;

    iget-object v3, v1, Lcom/k2fsa/sherpa/onnx/GeneratedAudio;->samples:[F

    iget v1, v1, Lcom/k2fsa/sherpa/onnx/GeneratedAudio;->sampleRate:I

    invoke-static {v1}, Ljava/lang/Integer;->valueOf(I)Ljava/lang/Integer;

    move-result-object v1

    filled-new-array {v3, v1}, [Ljava/lang/Object;

    move-result-object v1

    invoke-virtual {v2, v1}, Ljava/util/concurrent/LinkedBlockingQueue;->put(Ljava/lang/Object;)V
    :try_end_2
    .catchall {:try_start_2 .. :try_end_2} :catchall_1

    .line 170
    goto :goto_0

    .line 168
    :catchall_0
    move-exception v0

    :try_start_3
    monitor-exit v3
    :try_end_3
    .catchall {:try_start_3 .. :try_end_3} :catchall_0

    :try_start_4
    throw v0
    :try_end_4
    .catchall {:try_start_4 .. :try_end_4} :catchall_1

    .line 171
    :catchall_1
    move-exception v0

    :try_start_5
    iget-object v1, p0, Lcom/dogac/bin1/CarvisZv$2$1;->val$hazir:Ljava/util/concurrent/LinkedBlockingQueue;

    invoke-virtual {v1, v0}, Ljava/util/concurrent/LinkedBlockingQueue;->put(Ljava/lang/Object;)V
    :try_end_5
    .catch Ljava/lang/Exception; {:try_start_5 .. :try_end_5} :catch_0

    goto :goto_2

    :catch_0
    move-exception v0

    :cond_2
    :goto_2
    nop

    .line 172
    :try_start_6
    iget-object v0, p0, Lcom/dogac/bin1/CarvisZv$2$1;->val$hazir:Ljava/util/concurrent/LinkedBlockingQueue;

    iget-object v1, p0, Lcom/dogac/bin1/CarvisZv$2$1;->val$BITTI:Ljava/lang/Object;

    invoke-virtual {v0, v1}, Ljava/util/concurrent/LinkedBlockingQueue;->put(Ljava/lang/Object;)V
    :try_end_6
    .catch Ljava/lang/Exception; {:try_start_6 .. :try_end_6} :catch_1

    goto :goto_3

    :catch_1
    move-exception v0

    .line 173
    :goto_3
    return-void
.end method
