.class Lcom/dogac/bin1/SpotifyYerel$1;
.super Ljava/lang/Object;
.source "SpotifyYerel.java"

# interfaces
.implements Ljava/lang/Runnable;


# annotations
.annotation system Ldalvik/annotation/EnclosingMethod;
    value = Lcom/dogac/bin1/SpotifyYerel;->dene(IJ)V
.end annotation

.annotation system Ldalvik/annotation/InnerClass;
    accessFlags = 0x0
    name = null
.end annotation


# instance fields
.field final synthetic val$kalan:I


# direct methods
.method constructor <init>(I)V
    .locals 0
    .annotation system Ldalvik/annotation/Signature;
        value = {
            "()V"
        }
    .end annotation

    .line 132
    iput p1, p0, Lcom/dogac/bin1/SpotifyYerel$1;->val$kalan:I

    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    return-void
.end method


# virtual methods
.method public run()V
    .locals 3

    .line 134
    nop

    .line 135
    :try_start_0
    invoke-static {}, Lcom/dogac/bin1/SpotifyYerel;->tikla()Ljava/lang/String;

    move-result-object v0
    :try_end_0
    .catch Ljava/lang/Exception; {:try_start_0 .. :try_end_0} :catch_0

    goto :goto_0

    :catch_0
    move-exception v0

    new-instance v1, Ljava/lang/StringBuilder;

    invoke-direct {v1}, Ljava/lang/StringBuilder;-><init>()V

    const-string v2, "hata:"

    invoke-virtual {v1, v2}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v1

    invoke-virtual {v0}, Ljava/lang/Exception;->getMessage()Ljava/lang/String;

    move-result-object v0

    invoke-virtual {v1, v0}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v0

    invoke-virtual {v0}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v0

    sput-object v0, Lcom/dogac/bin1/SpotifyYerel;->listeSon:Ljava/lang/String;

    const/4 v0, 0x0

    .line 136
    :goto_0
    if-eqz v0, :cond_0

    new-instance v1, Ljava/lang/StringBuilder;

    invoke-direct {v1}, Ljava/lang/StringBuilder;-><init>()V

    const-string v2, "tiklandi:"

    invoke-virtual {v1, v2}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v1

    invoke-virtual {v1, v0}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v0

    invoke-virtual {v0}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v0

    sput-object v0, Lcom/dogac/bin1/SpotifyYerel;->listeSon:Ljava/lang/String;

    return-void

    .line 137
    :cond_0
    iget v0, p0, Lcom/dogac/bin1/SpotifyYerel$1;->val$kalan:I

    const/4 v1, 0x1

    if-gt v0, v1, :cond_2

    sget-object v0, Lcom/dogac/bin1/SpotifyYerel;->listeSon:Ljava/lang/String;

    const-string v1, "hata"

    invoke-virtual {v0, v1}, Ljava/lang/String;->startsWith(Ljava/lang/String;)Z

    move-result v0

    if-nez v0, :cond_1

    const-string v0, "bulunamadi"

    sput-object v0, Lcom/dogac/bin1/SpotifyYerel;->listeSon:Ljava/lang/String;

    :cond_1
    return-void

    .line 138
    :cond_2
    iget v0, p0, Lcom/dogac/bin1/SpotifyYerel$1;->val$kalan:I

    sub-int/2addr v0, v1

    const-wide/16 v1, 0x1f4

    invoke-static {v0, v1, v2}, Lcom/dogac/bin1/SpotifyYerel;->dene(IJ)V

    .line 139
    return-void
.end method
