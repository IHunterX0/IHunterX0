.class Lcom/dogac/bin1/CarvisZv$2;
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

    .line 155
    iput-object p1, p0, Lcom/dogac/bin1/CarvisZv$2;->val$metin:Ljava/lang/String;

    iput p2, p0, Lcom/dogac/bin1/CarvisZv$2;->val$benim:I

    iput p3, p0, Lcom/dogac/bin1/CarvisZv$2;->val$hiz:F

    iput p4, p0, Lcom/dogac/bin1/CarvisZv$2;->val$efekt:F

    iput-object p5, p0, Lcom/dogac/bin1/CarvisZv$2;->val$id:Ljava/lang/String;

    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    return-void
.end method


# virtual methods
.method public run()V
    .locals 8

    .line 156
    nop

    .line 158
    :try_start_0
    invoke-static {}, Lcom/dogac/bin1/CarvisZv;->bag()Landroid/content/Context;

    move-result-object v0

    if-eqz v0, :cond_3

    .line 159
    invoke-static {v0}, Lcom/dogac/bin1/CarvisZv;->yukle(Landroid/content/Context;)V

    .line 160
    iget-object v0, p0, Lcom/dogac/bin1/CarvisZv$2;->val$metin:Ljava/lang/String;

    invoke-static {v0}, Lcom/dogac/bin1/CarvisZv;->cumleler(Ljava/lang/String;)Ljava/util/ArrayList;

    move-result-object v0

    .line 161
    new-instance v1, Ljava/util/concurrent/LinkedBlockingQueue;

    invoke-direct {v1}, Ljava/util/concurrent/LinkedBlockingQueue;-><init>()V

    .line 162
    new-instance v2, Ljava/lang/Object;

    invoke-direct {v2}, Ljava/lang/Object;-><init>()V

    .line 163
    new-instance v3, Ljava/lang/Thread;

    new-instance v4, Lcom/dogac/bin1/CarvisZv$2$1;

    invoke-direct {v4, p0, v0, v1, v2}, Lcom/dogac/bin1/CarvisZv$2$1;-><init>(Lcom/dogac/bin1/CarvisZv$2;Ljava/util/ArrayList;Ljava/util/concurrent/LinkedBlockingQueue;Ljava/lang/Object;)V

    invoke-direct {v3, v4}, Ljava/lang/Thread;-><init>(Ljava/lang/Runnable;)V

    .line 177
    invoke-virtual {v3}, Ljava/lang/Thread;->start()V

    .line 179
    :goto_0
    invoke-virtual {v1}, Ljava/util/concurrent/LinkedBlockingQueue;->take()Ljava/lang/Object;

    move-result-object v0

    .line 180
    if-ne v0, v2, :cond_0

    .line 186
    const/4 v0, 0x0

    goto :goto_1

    .line 181
    :cond_0
    instance-of v3, v0, Ljava/lang/Throwable;

    if-nez v3, :cond_2

    .line 182
    iget v3, p0, Lcom/dogac/bin1/CarvisZv$2;->val$benim:I

    sget v4, Lcom/dogac/bin1/CarvisZv;->nesil:I

    if-eq v3, v4, :cond_1

    goto :goto_0

    .line 183
    :cond_1
    check-cast v0, [Ljava/lang/Object;

    .line 184
    iget v3, p0, Lcom/dogac/bin1/CarvisZv$2;->val$benim:I

    const/4 v4, 0x0

    aget-object v4, v0, v4

    check-cast v4, [F

    const/4 v5, 0x1

    aget-object v6, v0, v5

    check-cast v6, Ljava/lang/Integer;

    invoke-virtual {v6}, Ljava/lang/Integer;->intValue()I

    move-result v6

    iget v7, p0, Lcom/dogac/bin1/CarvisZv$2;->val$efekt:F

    invoke-static {v4, v6, v7}, Lcom/dogac/bin1/CarvisZv;->cila([FIF)[F

    move-result-object v4

    aget-object v0, v0, v5

    check-cast v0, Ljava/lang/Integer;

    invoke-virtual {v0}, Ljava/lang/Integer;->intValue()I

    move-result v0

    invoke-static {v3, v4, v0}, Lcom/dogac/bin1/CarvisZv;->cal(I[FI)V

    .line 185
    goto :goto_0

    .line 181
    :cond_2
    check-cast v0, Ljava/lang/Throwable;

    throw v0

    .line 158
    :cond_3
    new-instance v0, Ljava/lang/Exception;

    const-string v1, "uygulama kapal\u0131"

    invoke-direct {v0, v1}, Ljava/lang/Exception;-><init>(Ljava/lang/String;)V

    throw v0
    :try_end_0
    .catchall {:try_start_0 .. :try_end_0} :catchall_0

    .line 186
    :catchall_0
    move-exception v0

    new-instance v1, Ljava/lang/StringBuilder;

    invoke-direct {v1}, Ljava/lang/StringBuilder;-><init>()V

    invoke-virtual {v0}, Ljava/lang/Object;->getClass()Ljava/lang/Class;

    move-result-object v2

    invoke-virtual {v2}, Ljava/lang/Class;->getSimpleName()Ljava/lang/String;

    move-result-object v2

    invoke-virtual {v1, v2}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v1

    const-string v2, ": "

    invoke-virtual {v1, v2}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v1

    invoke-virtual {v0}, Ljava/lang/Throwable;->getMessage()Ljava/lang/String;

    move-result-object v0

    invoke-virtual {v1, v0}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v0

    invoke-virtual {v0}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v0

    .line 187
    :goto_1
    sget-object v1, Lcom/dogac/bin1/MainActivity;->ornek:Lcom/dogac/bin1/MainActivity;

    .line 188
    if-eqz v1, :cond_5

    new-instance v2, Ljava/lang/StringBuilder;

    invoke-direct {v2}, Ljava/lang/StringBuilder;-><init>()V

    const-string v3, "window.zvBitti&&window.zvBitti("

    invoke-virtual {v2, v3}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v2

    iget-object v3, p0, Lcom/dogac/bin1/CarvisZv$2;->val$id:Ljava/lang/String;

    invoke-static {v3}, Lorg/json/JSONObject;->quote(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v3

    invoke-virtual {v2, v3}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v2

    const-string v3, ","

    invoke-virtual {v2, v3}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v2

    if-nez v0, :cond_4

    const-string v0, "null"

    goto :goto_2

    :cond_4
    invoke-static {v0}, Lorg/json/JSONObject;->quote(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v0

    :goto_2
    invoke-virtual {v2, v0}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v0

    const-string v2, ")"

    invoke-virtual {v0, v2}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v0

    invoke-virtual {v0}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v0

    invoke-virtual {v1, v0}, Lcom/dogac/bin1/MainActivity;->js(Ljava/lang/String;)V

    .line 189
    :cond_5
    return-void
.end method
