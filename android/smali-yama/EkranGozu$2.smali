.class Lcom/dogac/bin1/EkranGozu$2;
.super Ljava/lang/Object;
.source "EkranGozu.java"

# interfaces
.implements Ljava/lang/Runnable;


# annotations
.annotation system Ldalvik/annotation/EnclosingMethod;
    value = Lcom/dogac/bin1/EkranGozu;->ayarla(Z)Ljava/lang/String;
.end annotation

.annotation system Ldalvik/annotation/InnerClass;
    accessFlags = 0x0
    name = null
.end annotation


# direct methods
.method constructor <init>()V
    .locals 0

    .line 58
    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    return-void
.end method


# virtual methods
.method public run()V
    .locals 1

    .line 58
    sget-boolean v0, Lcom/dogac/bin1/EkranGozu;->acik:Z

    if-eqz v0, :cond_0

    invoke-static {}, Lcom/dogac/bin1/EkranGozu;->kur()V

    goto :goto_0

    :cond_0
    invoke-static {}, Lcom/dogac/bin1/EkranGozu;->kaldir()V

    :goto_0
    return-void
.end method
