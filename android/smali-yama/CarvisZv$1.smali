.class Lcom/dogac/bin1/CarvisZv$1;
.super Ljava/lang/Object;
.source "CarvisZv.java"

# interfaces
.implements Ljava/lang/Runnable;


# annotations
.annotation system Ldalvik/annotation/EnclosingMethod;
    value = Lcom/dogac/bin1/CarvisZv;->indir()V
.end annotation

.annotation system Ldalvik/annotation/InnerClass;
    accessFlags = 0x0
    name = null
.end annotation


# instance fields
.field final synthetic val$c:Landroid/content/Context;


# direct methods
.method constructor <init>(Landroid/content/Context;)V
    .locals 0
    .annotation system Ldalvik/annotation/Signature;
        value = {
            "()V"
        }
    .end annotation

    .line 59
    iput-object p1, p0, Lcom/dogac/bin1/CarvisZv$1;->val$c:Landroid/content/Context;

    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    return-void
.end method


# virtual methods
.method public run()V
    .locals 14

    .line 61
    const/4 v0, 0x0

    :try_start_0
    iget-object v1, p0, Lcom/dogac/bin1/CarvisZv$1;->val$c:Landroid/content/Context;

    invoke-static {v1}, Lcom/dogac/bin1/CarvisZv;->model(Landroid/content/Context;)Ljava/io/File;

    move-result-object v1

    .line 62
    invoke-virtual {v1}, Ljava/io/File;->length()J

    move-result-wide v2

    const-wide/32 v4, 0x76e1dcc

    cmp-long v2, v2, v4

    if-eqz v2, :cond_8

    .line 63
    new-instance v2, Ljava/io/File;

    iget-object v3, p0, Lcom/dogac/bin1/CarvisZv$1;->val$c:Landroid/content/Context;

    invoke-static {v3}, Lcom/dogac/bin1/CarvisZv;->dizin(Landroid/content/Context;)Ljava/io/File;

    move-result-object v3

    const-string v6, "fm_decoder_int8.onnx.part"

    invoke-direct {v2, v3, v6}, Ljava/io/File;-><init>(Ljava/io/File;Ljava/lang/String;)V

    .line 64
    invoke-virtual {v2}, Ljava/io/File;->exists()Z

    move-result v3

    const-wide/16 v6, 0x0

    if-eqz v3, :cond_0

    invoke-virtual {v2}, Ljava/io/File;->length()J

    move-result-wide v8

    goto :goto_0

    :cond_0
    move-wide v8, v6

    .line 65
    :goto_0
    new-instance v3, Ljava/net/URL;

    const-string v10, "https://huggingface.co/k2-fsa/ZipVoice/resolve/main/zipvoice_distill/fm_decoder_int8.onnx"

    invoke-direct {v3, v10}, Ljava/net/URL;-><init>(Ljava/lang/String;)V

    invoke-virtual {v3}, Ljava/net/URL;->openConnection()Ljava/net/URLConnection;

    move-result-object v3

    check-cast v3, Ljava/net/HttpURLConnection;

    .line 66
    const/4 v10, 0x1

    invoke-virtual {v3, v10}, Ljava/net/HttpURLConnection;->setInstanceFollowRedirects(Z)V

    const/16 v11, 0x3a98

    invoke-virtual {v3, v11}, Ljava/net/HttpURLConnection;->setConnectTimeout(I)V

    const v11, 0xea60

    invoke-virtual {v3, v11}, Ljava/net/HttpURLConnection;->setReadTimeout(I)V

    .line 67
    cmp-long v11, v8, v6

    if-lez v11, :cond_1

    const-string v11, "Range"

    new-instance v12, Ljava/lang/StringBuilder;

    invoke-direct {v12}, Ljava/lang/StringBuilder;-><init>()V

    const-string v13, "bytes="

    invoke-virtual {v12, v13}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v12

    invoke-virtual {v12, v8, v9}, Ljava/lang/StringBuilder;->append(J)Ljava/lang/StringBuilder;

    move-result-object v12

    const-string v13, "-"

    invoke-virtual {v12, v13}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v12

    invoke-virtual {v12}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v12

    invoke-virtual {v3, v11, v12}, Ljava/net/HttpURLConnection;->setRequestProperty(Ljava/lang/String;Ljava/lang/String;)V

    .line 68
    :cond_1
    invoke-virtual {v3}, Ljava/net/HttpURLConnection;->getResponseCode()I

    move-result v11

    .line 69
    const/16 v12, 0xc8

    if-ne v11, v12, :cond_2

    move-wide v8, v6

    goto :goto_1

    :cond_2
    const/16 v12, 0xce

    if-ne v11, v12, :cond_7

    .line 70
    :goto_1
    invoke-virtual {v3}, Ljava/net/HttpURLConnection;->getInputStream()Ljava/io/InputStream;

    move-result-object v3

    new-instance v11, Ljava/io/FileOutputStream;

    cmp-long v6, v8, v6

    if-lez v6, :cond_3

    goto :goto_2

    :cond_3
    move v10, v0

    :goto_2
    invoke-direct {v11, v2, v10}, Ljava/io/FileOutputStream;-><init>(Ljava/io/File;Z)V

    .line 71
    const/high16 v6, 0x10000

    new-array v6, v6, [B

    .line 72
    :goto_3
    invoke-virtual {v3, v6}, Ljava/io/InputStream;->read([B)I

    move-result v7

    if-lez v7, :cond_4

    invoke-virtual {v11, v6, v0, v7}, Ljava/io/OutputStream;->write([BII)V

    int-to-long v12, v7

    add-long/2addr v8, v12

    const-wide/16 v12, 0x64

    mul-long/2addr v12, v8

    div-long/2addr v12, v4

    long-to-int v7, v12

    sput v7, Lcom/dogac/bin1/CarvisZv;->yuzde:I

    goto :goto_3

    .line 73
    :cond_4
    invoke-virtual {v11}, Ljava/io/OutputStream;->close()V

    invoke-virtual {v3}, Ljava/io/InputStream;->close()V

    .line 74
    invoke-virtual {v2}, Ljava/io/File;->length()J

    move-result-wide v6

    cmp-long v3, v6, v4

    if-nez v3, :cond_6

    .line 75
    invoke-virtual {v2, v1}, Ljava/io/File;->renameTo(Ljava/io/File;)Z

    move-result v1

    if-eqz v1, :cond_5

    goto :goto_4

    :cond_5
    new-instance v1, Ljava/lang/Exception;

    const-string v2, "dosya ta\u015f\u0131namad\u0131"

    invoke-direct {v1, v2}, Ljava/lang/Exception;-><init>(Ljava/lang/String;)V

    throw v1

    .line 74
    :cond_6
    new-instance v1, Ljava/lang/Exception;

    new-instance v3, Ljava/lang/StringBuilder;

    invoke-direct {v3}, Ljava/lang/StringBuilder;-><init>()V

    const-string v4, "eksik indirildi ("

    invoke-virtual {v3, v4}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v3

    invoke-virtual {v2}, Ljava/io/File;->length()J

    move-result-wide v4

    invoke-virtual {v3, v4, v5}, Ljava/lang/StringBuilder;->append(J)Ljava/lang/StringBuilder;

    move-result-object v2

    const-string v3, " bayt)"

    invoke-virtual {v2, v3}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v2

    invoke-virtual {v2}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v2

    invoke-direct {v1, v2}, Ljava/lang/Exception;-><init>(Ljava/lang/String;)V

    throw v1

    .line 69
    :cond_7
    new-instance v1, Ljava/lang/Exception;

    new-instance v2, Ljava/lang/StringBuilder;

    invoke-direct {v2}, Ljava/lang/StringBuilder;-><init>()V

    const-string v3, "HTTP "

    invoke-virtual {v2, v3}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v2

    invoke-virtual {v2, v11}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    move-result-object v2

    invoke-virtual {v2}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v2

    invoke-direct {v1, v2}, Ljava/lang/Exception;-><init>(Ljava/lang/String;)V

    throw v1

    .line 77
    :cond_8
    :goto_4
    const/16 v1, 0x64

    sput v1, Lcom/dogac/bin1/CarvisZv;->yuzde:I

    .line 78
    iget-object v1, p0, Lcom/dogac/bin1/CarvisZv$1;->val$c:Landroid/content/Context;

    invoke-static {v1}, Lcom/dogac/bin1/CarvisZv;->yukle(Landroid/content/Context;)V
    :try_end_0
    .catchall {:try_start_0 .. :try_end_0} :catchall_0

    .line 79
    goto :goto_5

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

    move-result-object v1

    sput-object v1, Lcom/dogac/bin1/CarvisZv;->hata:Ljava/lang/String;

    .line 80
    :goto_5
    sput-boolean v0, Lcom/dogac/bin1/CarvisZv;->indiriliyor:Z

    .line 81
    sget-object v0, Lcom/dogac/bin1/MainActivity;->ornek:Lcom/dogac/bin1/MainActivity;

    if-eqz v0, :cond_9

    const-string v1, "window.zvDurum&&window.zvDurum()"

    invoke-virtual {v0, v1}, Lcom/dogac/bin1/MainActivity;->js(Ljava/lang/String;)V

    .line 82
    :cond_9
    return-void
.end method
