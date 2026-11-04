.class Lcom/dogac/bin1/EkranGozu$4$1;
.super Ljava/lang/Object;
.source "EkranGozu.java"

# interfaces
.implements Ljava/lang/Runnable;


# annotations
.annotation system Ldalvik/annotation/EnclosingClass;
    value = Lcom/dogac/bin1/EkranGozu$4;
.end annotation

.annotation system Ldalvik/annotation/InnerClass;
    accessFlags = 0x0
    name = null
.end annotation


# instance fields
.field final synthetic this$0:Lcom/dogac/bin1/EkranGozu$4;


# direct methods
.method constructor <init>(Lcom/dogac/bin1/EkranGozu$4;)V
    .locals 0
    .annotation system Ldalvik/annotation/MethodParameters;
        accessFlags = {
            0x8010
        }
        names = {
            null
        }
    .end annotation

    .line 115
    iput-object p1, p0, Lcom/dogac/bin1/EkranGozu$4$1;->this$0:Lcom/dogac/bin1/EkranGozu$4;

    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    return-void
.end method


# virtual methods
.method public run()V
    .locals 2

    .line 116
    iget-object v0, p0, Lcom/dogac/bin1/EkranGozu$4$1;->this$0:Lcom/dogac/bin1/EkranGozu$4;

    iget-boolean v0, v0, Lcom/dogac/bin1/EkranGozu$4;->surukle:Z

    if-nez v0, :cond_1

    sget-object v0, Lcom/dogac/bin1/EkranGozu;->nokta:Landroid/view/View;

    if-nez v0, :cond_0

    goto :goto_0

    .line 117
    :cond_0
    sget-object v0, Lcom/dogac/bin1/EkranGozu;->nokta:Landroid/view/View;

    const/4 v1, 0x0

    invoke-virtual {v0, v1}, Landroid/view/View;->performHapticFeedback(I)Z

    .line 118
    invoke-static {v1}, Lcom/dogac/bin1/EkranGozu;->ayarla(Z)Ljava/lang/String;

    sget-object v0, Lcom/dogac/bin1/MainActivity;->ornek:Lcom/dogac/bin1/MainActivity;

    if-eqz v0, :cond_1

    const-string v1, "window.carvisEkranKapandi&&window.carvisEkranKapandi()"

    invoke-virtual {v0, v1}, Lcom/dogac/bin1/MainActivity;->js(Ljava/lang/String;)V

    :cond_1
    :goto_0
    return-void
.end method
