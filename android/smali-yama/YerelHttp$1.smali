.class Lcom/dogac/bin1/YerelHttp$1;
.super Ljava/lang/Object;
.source "YerelHttp.java"

# interfaces
.implements Ljava/lang/Runnable;


# annotations
.annotation system Ldalvik/annotation/EnclosingMethod;
    value = Lcom/dogac/bin1/YerelHttp;->istek(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;I)V
.end annotation

.annotation system Ldalvik/annotation/InnerClass;
    accessFlags = 0x0
    name = null
.end annotation


# instance fields
.field final synthetic val$adres:Ljava/lang/String;

.field final synthetic val$basliklar:Ljava/lang/String;

.field final synthetic val$govde:Ljava/lang/String;

.field final synthetic val$id:Ljava/lang/String;

.field final synthetic val$zamanAsimiMs:I


# direct methods
.method constructor <init>(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;ILjava/lang/String;)V
    .locals 0
    .annotation system Ldalvik/annotation/Signature;
        value = {
            "()V"
        }
    .end annotation

    .line 21
    iput-object p1, p0, Lcom/dogac/bin1/YerelHttp$1;->val$adres:Ljava/lang/String;

    iput-object p2, p0, Lcom/dogac/bin1/YerelHttp$1;->val$govde:Ljava/lang/String;

    iput-object p3, p0, Lcom/dogac/bin1/YerelHttp$1;->val$basliklar:Ljava/lang/String;

    iput p4, p0, Lcom/dogac/bin1/YerelHttp$1;->val$zamanAsimiMs:I

    iput-object p5, p0, Lcom/dogac/bin1/YerelHttp$1;->val$id:Ljava/lang/String;

    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    return-void
.end method


# virtual methods
.method public run()V
    .locals 6

    .line 23
    nop

    .line 25
    const/4 v0, 0x0

    :try_start_0
    iget-object v1, p0, Lcom/dogac/bin1/YerelHttp$1;->val$adres:Ljava/lang/String;

    sget-object v2, Ljava/util/Locale;->ROOT:Ljava/util/Locale;

    invoke-virtual {v1, v2}, Ljava/lang/String;->toLowerCase(Ljava/util/Locale;)Ljava/lang/String;

    move-result-object v1

    const-string v2, "https://"

    invoke-virtual {v1, v2}, Ljava/lang/String;->startsWith(Ljava/lang/String;)Z

    move-result v1

    if-eqz v1, :cond_0

    iget-object v1, p0, Lcom/dogac/bin1/YerelHttp$1;->val$adres:Ljava/lang/String;

    iget-object v2, p0, Lcom/dogac/bin1/YerelHttp$1;->val$govde:Ljava/lang/String;

    iget-object v3, p0, Lcom/dogac/bin1/YerelHttp$1;->val$basliklar:Ljava/lang/String;

    iget v4, p0, Lcom/dogac/bin1/YerelHttp$1;->val$zamanAsimiMs:I

    invoke-static {v1, v2, v3, v4}, Lcom/dogac/bin1/YerelHttp;->https(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;I)[Ljava/lang/String;

    move-result-object v1

    goto :goto_0

    :cond_0
    iget-object v1, p0, Lcom/dogac/bin1/YerelHttp$1;->val$adres:Ljava/lang/String;

    iget-object v2, p0, Lcom/dogac/bin1/YerelHttp$1;->val$govde:Ljava/lang/String;

    iget-object v3, p0, Lcom/dogac/bin1/YerelHttp$1;->val$basliklar:Ljava/lang/String;

    iget v4, p0, Lcom/dogac/bin1/YerelHttp$1;->val$zamanAsimiMs:I

    invoke-static {v1, v2, v3, v4}, Lcom/dogac/bin1/YerelHttp;->http(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;I)[Ljava/lang/String;

    move-result-object v1

    .line 26
    :goto_0
    aget-object v2, v1, v0

    invoke-static {v2}, Ljava/lang/Integer;->parseInt(Ljava/lang/String;)I

    move-result v0

    const/4 v2, 0x1

    aget-object v1, v1, v2
    :try_end_0
    .catchall {:try_start_0 .. :try_end_0} :catchall_0

    .line 27
    const/4 v2, 0x0

    goto :goto_1

    :catchall_0
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

    move-result-object v2

    const-string v1, ""

    .line 28
    :goto_1
    sget-object v3, Lcom/dogac/bin1/MainActivity;->ornek:Lcom/dogac/bin1/MainActivity;

    .line 29
    if-eqz v3, :cond_2

    new-instance v4, Ljava/lang/StringBuilder;

    invoke-direct {v4}, Ljava/lang/StringBuilder;-><init>()V

    const-string v5, "window.yerelHttpCevap&&window.yerelHttpCevap("

    invoke-virtual {v4, v5}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v4

    iget-object v5, p0, Lcom/dogac/bin1/YerelHttp$1;->val$id:Ljava/lang/String;

    invoke-static {v5}, Lorg/json/JSONObject;->quote(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v5

    invoke-virtual {v4, v5}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v4

    const-string v5, ","

    invoke-virtual {v4, v5}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v4

    invoke-virtual {v4, v0}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    move-result-object v0

    invoke-virtual {v0, v5}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v0

    invoke-static {v1}, Lorg/json/JSONObject;->quote(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v1

    invoke-virtual {v0, v1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v0

    invoke-virtual {v0, v5}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v0

    if-nez v2, :cond_1

    const-string v1, "null"

    goto :goto_2

    :cond_1
    invoke-static {v2}, Lorg/json/JSONObject;->quote(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v1

    :goto_2
    invoke-virtual {v0, v1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v0

    const-string v1, ")"

    invoke-virtual {v0, v1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v0

    invoke-virtual {v0}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v0

    invoke-virtual {v3, v0}, Lcom/dogac/bin1/MainActivity;->js(Ljava/lang/String;)V

    .line 30
    :cond_2
    return-void
.end method
