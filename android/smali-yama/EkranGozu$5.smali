.class Lcom/dogac/bin1/EkranGozu$5;
.super Ljava/lang/Object;
.source "EkranGozu.java"

# interfaces
.implements Ljava/lang/Runnable;


# annotations
.annotation system Ldalvik/annotation/EnclosingClass;
    value = Lcom/dogac/bin1/EkranGozu;
.end annotation

.annotation system Ldalvik/annotation/InnerClass;
    accessFlags = 0x0
    name = null
.end annotation


# direct methods
.method constructor <init>()V
    .locals 0

    .line 142
    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    return-void
.end method


# virtual methods
.method public run()V
    .locals 3

    .line 143
    sget-object v0, Lcom/dogac/bin1/EkranGozu;->nokta:Landroid/view/View;

    const/4 v1, 0x0

    if-nez v0, :cond_0

    sput-boolean v1, Lcom/dogac/bin1/EkranGozu;->izliyor:Z

    return-void

    .line 144
    :cond_0
    sget-object v0, Lcom/dogac/bin1/CarvisErisim;->ornek:Lcom/dogac/bin1/CarvisErisim;

    if-nez v0, :cond_1

    const/4 v0, 0x0

    sput-object v0, Lcom/dogac/bin1/EkranGozu;->nokta:Landroid/view/View;

    sput-boolean v1, Lcom/dogac/bin1/EkranGozu;->izliyor:Z

    return-void

    .line 145
    :cond_1
    sget-object v0, Lcom/dogac/bin1/MainActivity;->ornek:Lcom/dogac/bin1/MainActivity;

    if-eqz v0, :cond_2

    .line 146
    invoke-virtual {v0}, Lcom/dogac/bin1/MainActivity;->hasWindowFocus()Z

    move-result v0

    if-eqz v0, :cond_2

    const/4 v0, 0x1

    goto :goto_0

    :cond_2
    move v0, v1

    .line 147
    :goto_0
    sget-boolean v2, Lcom/dogac/bin1/EkranGozu;->yakalaniyor:Z

    if-nez v2, :cond_4

    sget-object v2, Lcom/dogac/bin1/EkranGozu;->nokta:Landroid/view/View;

    if-eqz v0, :cond_3

    const/16 v1, 0x8

    :cond_3
    invoke-virtual {v2, v1}, Landroid/view/View;->setVisibility(I)V

    .line 148
    :cond_4
    sget-object v0, Lcom/dogac/bin1/EkranGozu;->ana:Landroid/os/Handler;

    const-wide/16 v1, 0x2bc

    invoke-virtual {v0, p0, v1, v2}, Landroid/os/Handler;->postDelayed(Ljava/lang/Runnable;J)Z

    return-void
.end method
