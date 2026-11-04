.class Lcom/dogac/bin1/EkranGozu$7;
.super Ljava/lang/Object;
.source "EkranGozu.java"

# interfaces
.implements Ljava/lang/Runnable;


# annotations
.annotation system Ldalvik/annotation/EnclosingMethod;
    value = Lcom/dogac/bin1/EkranGozu;->bitir(Landroid/content/Context;[Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V
.end annotation

.annotation system Ldalvik/annotation/InnerClass;
    accessFlags = 0x0
    name = null
.end annotation


# direct methods
.method constructor <init>()V
    .locals 0

    .line 204
    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    return-void
.end method


# virtual methods
.method public run()V
    .locals 2

    .line 204
    sget-object v0, Lcom/dogac/bin1/MainActivity;->ornek:Lcom/dogac/bin1/MainActivity;

    if-eqz v0, :cond_0

    const-string v1, "window.carvisEkran&&window.carvisEkran()"

    invoke-virtual {v0, v1}, Lcom/dogac/bin1/MainActivity;->js(Ljava/lang/String;)V

    :cond_0
    return-void
.end method
