.class Lcom/dogac/bin1/CarvisZv$3;
.super Ljava/lang/Object;
.source "CarvisZv.java"

# interfaces
.implements Ljava/lang/Runnable;


# annotations
.annotation system Ldalvik/annotation/EnclosingMethod;
    value = Lcom/dogac/bin1/CarvisZv;->konus(Ljava/lang/String;Ljava/lang/String;FF)V
.end annotation

.annotation system Ldalvik/annotation/InnerClass;
    accessFlags = 0x0
    name = null
.end annotation


# instance fields
.field final synthetic val$benim:I

.field final synthetic val$efekt:F

.field final synthetic val$hiz:F

.field final synthetic val$id:Ljava/lang/String;

.field final synthetic val$metin:Ljava/lang/String;


# direct methods
.method constructor <init>(Ljava/lang/String;IFFLjava/lang/String;)V
    .locals 0
    .annotation system Ldalvik/annotation/Signature;
        value = {
            "()V"
        }
    .end annotation

    .line 209
    iput-object p1, p0, Lcom/dogac/bin1/CarvisZv$3;->val$metin:Ljava/lang/String;

    iput p2, p0, Lcom/dogac/bin1/CarvisZv$3;->val$benim:I

    iput p3, p0, Lcom/dogac/bin1/CarvisZv$3;->val$hiz:F

    iput p4, p0, Lcom/dogac/bin1/CarvisZv$3;->val$efekt:F

    iput-object p5, p0, Lcom/dogac/bin1/CarvisZv$3;->val$id:Ljava/lang/String;

    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    return-void
.end method


# virtual methods
.method public run()V
    .locals 9

    .line 210
    const/4 v0, 0x5

    :try_start_0
    invoke-static {v0}, Landroid/os/Process;->setThreadPriority(I)V
    :try_end_0
    .catchall {:try_start_0 .. :try_end_0} :catchall_0

    goto :goto_0

    :catchall_0
    move-exception v0

    .line 211
    :goto_0
    nop

    .line 213
    const/4 v0, 0x0

    :try_start_1
    invoke-static {}, Lcom/dogac/bin1/CarvisZv;->bag()Landroid/content/Context;

    move-result-object v1

    if-eqz v1, :cond_3

    .line 214
    invoke-static {v1}, Lcom/dogac/bin1/CarvisZv;->yukle(Landroid/content/Context;)V

    .line 215
    iget-object v1, p0, Lcom/dogac/bin1/CarvisZv$3;->val$metin:Ljava/lang/String;

    invoke-static {v1}, Lcom/dogac/bin1/CarvisZv;->cumleler(Ljava/lang/String;)Ljava/util/ArrayList;

    move-result-object v1

    .line 216
    new-instance v2, Ljava/util/concurrent/LinkedBlockingQueue;

    invoke-direct {v2}, Ljava/util/concurrent/LinkedBlockingQueue;-><init>()V

    .line 217
    new-instance v3, Ljava/lang/Object;

    invoke-direct {v3}, Ljava/lang/Object;-><init>()V

    .line 218
    new-instance v4, Ljava/lang/Thread;

    new-instance v5, Lcom/dogac/bin1/CarvisZv$3$1;

    invoke-direct {v5, p0, v1, v2, v3}, Lcom/dogac/bin1/CarvisZv$3$1;-><init>(Lcom/dogac/bin1/CarvisZv$3;Ljava/util/ArrayList;Ljava/util/concurrent/LinkedBlockingQueue;Ljava/lang/Object;)V

    invoke-direct {v4, v5}, Ljava/lang/Thread;-><init>(Ljava/lang/Runnable;)V

    .line 242
    invoke-virtual {v4}, Ljava/lang/Thread;->start()V

    .line 244
    :goto_1
    invoke-virtual {v2}, Ljava/util/concurrent/LinkedBlockingQueue;->take()Ljava/lang/Object;

    move-result-object v1

    .line 245
    if-ne v1, v3, :cond_0

    .line 251
    move-object v1, v0

    goto :goto_2

    .line 246
    :cond_0
    instance-of v4, v1, Ljava/lang/Throwable;

    if-nez v4, :cond_2

    .line 247
    iget v4, p0, Lcom/dogac/bin1/CarvisZv$3;->val$benim:I

    sget v5, Lcom/dogac/bin1/CarvisZv;->nesil:I

    if-eq v4, v5, :cond_1

    goto :goto_1

    .line 248
    :cond_1
    check-cast v1, [Ljava/lang/Object;

    .line 249
    iget v4, p0, Lcom/dogac/bin1/CarvisZv$3;->val$benim:I

    const/4 v5, 0x0

    aget-object v5, v1, v5

    check-cast v5, [F

    const/4 v6, 0x1

    aget-object v7, v1, v6

    check-cast v7, Ljava/lang/Integer;

    invoke-virtual {v7}, Ljava/lang/Integer;->intValue()I

    move-result v7

    iget v8, p0, Lcom/dogac/bin1/CarvisZv$3;->val$efekt:F

    invoke-static {v5, v7, v8}, Lcom/dogac/bin1/CarvisZv;->cila([FIF)[F

    move-result-object v5

    aget-object v1, v1, v6

    check-cast v1, Ljava/lang/Integer;

    invoke-virtual {v1}, Ljava/lang/Integer;->intValue()I

    move-result v1

    invoke-static {v4, v5, v1}, Lcom/dogac/bin1/CarvisZv;->cal(I[FI)V

    .line 250
    goto :goto_1

    .line 246
    :cond_2
    check-cast v1, Ljava/lang/Throwable;

    throw v1

    .line 213
    :cond_3
    new-instance v1, Ljava/lang/Exception;

    const-string v2, "uygulama kapal\u0131"

    invoke-direct {v1, v2}, Ljava/lang/Exception;-><init>(Ljava/lang/String;)V

    throw v1
    :try_end_1
    .catchall {:try_start_1 .. :try_end_1} :catchall_1

    .line 251
    :catchall_1
    move-exception v1

    new-instance v2, Ljava/lang/StringBuilder;

    invoke-direct {v2}, Ljava/lang/StringBuilder;-><init>()V

    invoke-virtual {v1}, Ljava/lang/Object;->getClass()Ljava/lang/Class;

    move-result-object v3

    invoke-virtual {v3}, Ljava/lang/Class;->getSimpleName()Ljava/lang/String;

    move-result-object v3

    invoke-virtual {v2, v3}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v2

    const-string v3, ": "

    invoke-virtual {v2, v3}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v2

    invoke-virtual {v1}, Ljava/lang/Throwable;->getMessage()Ljava/lang/String;

    move-result-object v1

    invoke-virtual {v2, v1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v1

    invoke-virtual {v1}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v1

    .line 252
    :goto_2
    invoke-static {}, Lcom/dogac/bin1/CarvisZv;->bag()Landroid/content/Context;

    move-result-object v2

    invoke-static {v2, v0}, Lcom/dogac/bin1/CarvisZv;->iz(Landroid/content/Context;Ljava/lang/String;)V

    .line 253
    if-nez v1, :cond_4

    const-string v0, "bitti"

    goto :goto_3

    :cond_4
    const-string v0, "hata"

    :goto_3
    sput-object v0, Lcom/dogac/bin1/CarvisZv;->asama:Ljava/lang/String;

    .line 254
    if-eqz v1, :cond_5

    sput-object v1, Lcom/dogac/bin1/CarvisZv;->hata:Ljava/lang/String;

    .line 255
    :cond_5
    sget-object v0, Lcom/dogac/bin1/MainActivity;->ornek:Lcom/dogac/bin1/MainActivity;

    .line 256
    if-eqz v0, :cond_7

    new-instance v2, Ljava/lang/StringBuilder;

    invoke-direct {v2}, Ljava/lang/StringBuilder;-><init>()V

    const-string v3, "window.zvBitti&&window.zvBitti("

    invoke-virtual {v2, v3}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v2

    iget-object v3, p0, Lcom/dogac/bin1/CarvisZv$3;->val$id:Ljava/lang/String;

    invoke-static {v3}, Lorg/json/JSONObject;->quote(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v3

    invoke-virtual {v2, v3}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v2

    const-string v3, ","

    invoke-virtual {v2, v3}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v2

    if-nez v1, :cond_6

    const-string v1, "null"

    goto :goto_4

    :cond_6
    invoke-static {v1}, Lorg/json/JSONObject;->quote(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v1

    :goto_4
    invoke-virtual {v2, v1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v1

    const-string v2, ")"

    invoke-virtual {v1, v2}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v1

    invoke-virtual {v1}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v1

    invoke-virtual {v0, v1}, Lcom/dogac/bin1/MainActivity;->js(Ljava/lang/String;)V

    .line 257
    :cond_7
    return-void
.end method
