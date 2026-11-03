.class Lcom/dogac/bin1/MainActivity$1;
.super Landroid/webkit/WebViewClient;
.source "MainActivity.java"


# annotations
.annotation system Ldalvik/annotation/EnclosingMethod;
    value = Lcom/dogac/bin1/MainActivity;->onCreate(Landroid/os/Bundle;)V
.end annotation

.annotation system Ldalvik/annotation/InnerClass;
    accessFlags = 0x0
    name = null
.end annotation


# instance fields
.field final synthetic this$0:Lcom/dogac/bin1/MainActivity;

.field final synthetic val$yukleyici:Landroidx/webkit/WebViewAssetLoader;


# direct methods
.method constructor <init>(Lcom/dogac/bin1/MainActivity;Landroidx/webkit/WebViewAssetLoader;)V
    .locals 0
    .param p1, "this$0"    # Lcom/dogac/bin1/MainActivity;

    .line 69
    iput-object p1, p0, Lcom/dogac/bin1/MainActivity$1;->this$0:Lcom/dogac/bin1/MainActivity;

    iput-object p2, p0, Lcom/dogac/bin1/MainActivity$1;->val$yukleyici:Landroidx/webkit/WebViewAssetLoader;

    invoke-direct {p0}, Landroid/webkit/WebViewClient;-><init>()V

    return-void
.end method


# virtual methods
.method public shouldInterceptRequest(Landroid/webkit/WebView;Landroid/webkit/WebResourceRequest;)Landroid/webkit/WebResourceResponse;
    .locals 3
    .param p1, "v"    # Landroid/webkit/WebView;
    .param p2, "r"    # Landroid/webkit/WebResourceRequest;

    invoke-interface {p2}, Landroid/webkit/WebResourceRequest;->getUrl()Landroid/net/Uri;

    move-result-object v0

    invoke-static {v0}, Lcom/dogac/bin1/Yama;->yanit(Landroid/net/Uri;)Landroid/webkit/WebResourceResponse;

    move-result-object v0

    if-eqz v0, :yama_yok

    return-object v0

    :yama_yok
    .line 71
    iget-object v0, p0, Lcom/dogac/bin1/MainActivity$1;->val$yukleyici:Landroidx/webkit/WebViewAssetLoader;

    invoke-interface {p2}, Landroid/webkit/WebResourceRequest;->getUrl()Landroid/net/Uri;

    move-result-object v1

    invoke-virtual {v0, v1}, Landroidx/webkit/WebViewAssetLoader;->shouldInterceptRequest(Landroid/net/Uri;)Landroid/webkit/WebResourceResponse;

    move-result-object v0

    .line 72
    .local v0, "c":Landroid/webkit/WebResourceResponse;
    if-eqz v0, :cond_1

    invoke-interface {p2}, Landroid/webkit/WebResourceRequest;->getUrl()Landroid/net/Uri;

    move-result-object v1

    invoke-virtual {v1}, Landroid/net/Uri;->getPath()Ljava/lang/String;

    move-result-object v1

    if-eqz v1, :cond_1

    .line 73
    invoke-interface {p2}, Landroid/webkit/WebResourceRequest;->getUrl()Landroid/net/Uri;

    move-result-object v1

    invoke-virtual {v1}, Landroid/net/Uri;->getPath()Ljava/lang/String;

    move-result-object v1

    .line 74
    .local v1, "p":Ljava/lang/String;
    const-string v2, ".js"

    invoke-virtual {v1, v2}, Ljava/lang/String;->endsWith(Ljava/lang/String;)Z

    move-result v2

    if-nez v2, :cond_0

    const-string v2, ".html"

    invoke-virtual {v1, v2}, Ljava/lang/String;->endsWith(Ljava/lang/String;)Z

    move-result v2

    if-nez v2, :cond_0

    const-string v2, ".json"

    invoke-virtual {v1, v2}, Ljava/lang/String;->endsWith(Ljava/lang/String;)Z

    move-result v2

    if-nez v2, :cond_0

    const-string v2, ".css"

    invoke-virtual {v1, v2}, Ljava/lang/String;->endsWith(Ljava/lang/String;)Z

    move-result v2

    if-eqz v2, :cond_1

    :cond_0
    const-string v2, "utf-8"

    invoke-virtual {v0, v2}, Landroid/webkit/WebResourceResponse;->setEncoding(Ljava/lang/String;)V

    .line 76
    .end local v1    # "p":Ljava/lang/String;
    :cond_1
    return-object v0
.end method

.method public shouldOverrideUrlLoading(Landroid/webkit/WebView;Landroid/webkit/WebResourceRequest;)Z
    .locals 4
    .param p1, "v"    # Landroid/webkit/WebView;
    .param p2, "r"    # Landroid/webkit/WebResourceRequest;

    .line 79
    invoke-interface {p2}, Landroid/webkit/WebResourceRequest;->getUrl()Landroid/net/Uri;

    move-result-object v0

    .line 80
    .local v0, "u":Landroid/net/Uri;
    const-string v1, "appassets.androidplatform.net"

    invoke-virtual {v0}, Landroid/net/Uri;->getHost()Ljava/lang/String;

    move-result-object v2

    invoke-virtual {v1, v2}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v1

    if-eqz v1, :cond_0

    const/4 v1, 0x0

    return v1

    .line 81
    :cond_0
    if-eqz v2, :spotify_degil

    const-string v1, "spotify.com"

    invoke-virtual {v2, v1}, Ljava/lang/String;->endsWith(Ljava/lang/String;)Z

    move-result v1

    if-eqz v1, :spotify_degil

    const-string v1, "open.spotify.com"

    invoke-virtual {v1, v2}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v1

    if-nez v1, :spotify_degil

    const/4 v1, 0x0

    return v1

    :spotify_degil
    :try_start_0
    iget-object v1, p0, Lcom/dogac/bin1/MainActivity$1;->this$0:Lcom/dogac/bin1/MainActivity;

    new-instance v2, Landroid/content/Intent;

    const-string v3, "android.intent.action.VIEW"

    invoke-direct {v2, v3, v0}, Landroid/content/Intent;-><init>(Ljava/lang/String;Landroid/net/Uri;)V

    invoke-virtual {v1, v2}, Lcom/dogac/bin1/MainActivity;->startActivity(Landroid/content/Intent;)V
    :try_end_0
    .catch Ljava/lang/Exception; {:try_start_0 .. :try_end_0} :catch_0

    goto :goto_0

    :catch_0
    move-exception v1

    .line 82
    :goto_0
    const/4 v1, 0x1

    return v1
.end method
