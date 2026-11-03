.class Lcom/dogac/bin1/Uygulamalar$2;
.super Ljava/lang/Object;
.source "Uygulamalar.java"

# interfaces
.implements Ljava/lang/Runnable;


# annotations
.annotation system Ldalvik/annotation/EnclosingMethod;
    value = Lcom/dogac/bin1/Uygulamalar;->anaEkranAyari()V
.end annotation

.annotation system Ldalvik/annotation/InnerClass;
    accessFlags = 0x0
    name = null
.end annotation


# instance fields
.field final synthetic val$a:Lcom/dogac/bin1/MainActivity;


# direct methods
.method constructor <init>(Lcom/dogac/bin1/MainActivity;)V
    .locals 0
    .annotation system Ldalvik/annotation/Signature;
        value = {
            "()V"
        }
    .end annotation

    .line 67
    iput-object p1, p0, Lcom/dogac/bin1/Uygulamalar$2;->val$a:Lcom/dogac/bin1/MainActivity;

    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    return-void
.end method


# virtual methods
.method public run()V
    .locals 4

    .line 68
    const/high16 v0, 0x10000000

    :try_start_0
    iget-object v1, p0, Lcom/dogac/bin1/Uygulamalar$2;->val$a:Lcom/dogac/bin1/MainActivity;

    new-instance v2, Landroid/content/Intent;

    const-string v3, "android.settings.HOME_SETTINGS"

    invoke-direct {v2, v3}, Landroid/content/Intent;-><init>(Ljava/lang/String;)V

    invoke-virtual {v2, v0}, Landroid/content/Intent;->addFlags(I)Landroid/content/Intent;

    move-result-object v2

    invoke-virtual {v1, v2}, Lcom/dogac/bin1/MainActivity;->startActivity(Landroid/content/Intent;)V
    :try_end_0
    .catchall {:try_start_0 .. :try_end_0} :catchall_0

    goto :goto_0

    .line 69
    :catchall_0
    move-exception v1

    :try_start_1
    iget-object v1, p0, Lcom/dogac/bin1/Uygulamalar$2;->val$a:Lcom/dogac/bin1/MainActivity;

    new-instance v2, Landroid/content/Intent;

    const-string v3, "android.settings.SETTINGS"

    invoke-direct {v2, v3}, Landroid/content/Intent;-><init>(Ljava/lang/String;)V

    invoke-virtual {v2, v0}, Landroid/content/Intent;->addFlags(I)Landroid/content/Intent;

    move-result-object v0

    invoke-virtual {v1, v0}, Lcom/dogac/bin1/MainActivity;->startActivity(Landroid/content/Intent;)V
    :try_end_1
    .catchall {:try_start_1 .. :try_end_1} :catchall_1

    goto :goto_0

    :catchall_1
    move-exception v0

    :goto_0
    nop

    .line 70
    return-void
.end method
