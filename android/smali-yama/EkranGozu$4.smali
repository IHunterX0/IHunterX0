.class Lcom/dogac/bin1/EkranGozu$4;
.super Ljava/lang/Object;
.source "EkranGozu.java"

# interfaces
.implements Landroid/view/View$OnTouchListener;


# annotations
.annotation system Ldalvik/annotation/EnclosingMethod;
    value = Lcom/dogac/bin1/EkranGozu;->kur()V
.end annotation

.annotation system Ldalvik/annotation/InnerClass;
    accessFlags = 0x0
    name = null
.end annotation


# instance fields
.field bas:J

.field dx:F

.field dy:F

.field surukle:Z

.field final uzun:Ljava/lang/Runnable;

.field final synthetic val$wm:Landroid/view/WindowManager;

.field x0:I

.field y0:I


# direct methods
.method constructor <init>(Landroid/view/WindowManager;)V
    .locals 0
    .annotation system Ldalvik/annotation/Signature;
        value = {
            "()V"
        }
    .end annotation

    .line 113
    iput-object p1, p0, Lcom/dogac/bin1/EkranGozu$4;->val$wm:Landroid/view/WindowManager;

    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    .line 115
    new-instance p1, Lcom/dogac/bin1/EkranGozu$4$1;

    invoke-direct {p1, p0}, Lcom/dogac/bin1/EkranGozu$4$1;-><init>(Lcom/dogac/bin1/EkranGozu$4;)V

    iput-object p1, p0, Lcom/dogac/bin1/EkranGozu$4;->uzun:Ljava/lang/Runnable;

    return-void
.end method


# virtual methods
.method public onTouch(Landroid/view/View;Landroid/view/MotionEvent;)Z
    .locals 5

    .line 121
    invoke-virtual {p2}, Landroid/view/MotionEvent;->getActionMasked()I

    move-result v0

    const/4 v1, 0x0

    const/4 v2, 0x1

    if-eqz v0, :cond_7

    if-eq v0, v2, :cond_4

    const/4 v3, 0x2

    if-eq v0, v3, :cond_1

    const/4 p1, 0x3

    if-eq v0, p1, :cond_0

    return v1

    .line 132
    :cond_0
    sget-object p1, Lcom/dogac/bin1/EkranGozu;->ana:Landroid/os/Handler;

    iget-object p2, p0, Lcom/dogac/bin1/EkranGozu$4;->uzun:Ljava/lang/Runnable;

    invoke-virtual {p1, p2}, Landroid/os/Handler;->removeCallbacks(Ljava/lang/Runnable;)V

    return v2

    .line 124
    :cond_1
    iget-boolean v0, p0, Lcom/dogac/bin1/EkranGozu$4;->surukle:Z

    if-nez v0, :cond_2

    invoke-virtual {p2}, Landroid/view/MotionEvent;->getRawX()F

    move-result v0

    iget v1, p0, Lcom/dogac/bin1/EkranGozu$4;->dx:F

    sub-float/2addr v0, v1

    float-to-double v0, v0

    invoke-virtual {p2}, Landroid/view/MotionEvent;->getRawY()F

    move-result v3

    iget v4, p0, Lcom/dogac/bin1/EkranGozu$4;->dy:F

    sub-float/2addr v3, v4

    float-to-double v3, v3

    invoke-static {v0, v1, v3, v4}, Ljava/lang/Math;->hypot(DD)D

    move-result-wide v0

    invoke-virtual {p1}, Landroid/view/View;->getContext()Landroid/content/Context;

    move-result-object p1

    const/16 v3, 0xa

    invoke-static {p1, v3}, Lcom/dogac/bin1/EkranGozu;->dp(Landroid/content/Context;I)I

    move-result p1

    int-to-double v3, p1

    cmpl-double p1, v0, v3

    if-lez p1, :cond_2

    iput-boolean v2, p0, Lcom/dogac/bin1/EkranGozu$4;->surukle:Z

    sget-object p1, Lcom/dogac/bin1/EkranGozu;->ana:Landroid/os/Handler;

    iget-object v0, p0, Lcom/dogac/bin1/EkranGozu$4;->uzun:Ljava/lang/Runnable;

    invoke-virtual {p1, v0}, Landroid/os/Handler;->removeCallbacks(Ljava/lang/Runnable;)V

    .line 125
    :cond_2
    iget-boolean p1, p0, Lcom/dogac/bin1/EkranGozu$4;->surukle:Z

    if-eqz p1, :cond_3

    sget-object p1, Lcom/dogac/bin1/EkranGozu;->lp:Landroid/view/WindowManager$LayoutParams;

    iget v0, p0, Lcom/dogac/bin1/EkranGozu$4;->x0:I

    invoke-virtual {p2}, Landroid/view/MotionEvent;->getRawX()F

    move-result v1

    iget v3, p0, Lcom/dogac/bin1/EkranGozu$4;->dx:F

    sub-float/2addr v1, v3

    float-to-int v1, v1

    add-int/2addr v0, v1

    iput v0, p1, Landroid/view/WindowManager$LayoutParams;->x:I

    sget-object p1, Lcom/dogac/bin1/EkranGozu;->lp:Landroid/view/WindowManager$LayoutParams;

    iget v0, p0, Lcom/dogac/bin1/EkranGozu$4;->y0:I

    invoke-virtual {p2}, Landroid/view/MotionEvent;->getRawY()F

    move-result p2

    iget v1, p0, Lcom/dogac/bin1/EkranGozu$4;->dy:F

    sub-float/2addr p2, v1

    float-to-int p2, p2

    add-int/2addr v0, p2

    iput v0, p1, Landroid/view/WindowManager$LayoutParams;->y:I

    :try_start_0
    iget-object p1, p0, Lcom/dogac/bin1/EkranGozu$4;->val$wm:Landroid/view/WindowManager;

    sget-object p2, Lcom/dogac/bin1/EkranGozu;->nokta:Landroid/view/View;

    sget-object v0, Lcom/dogac/bin1/EkranGozu;->lp:Landroid/view/WindowManager$LayoutParams;

    invoke-interface {p1, p2, v0}, Landroid/view/WindowManager;->updateViewLayout(Landroid/view/View;Landroid/view/ViewGroup$LayoutParams;)V
    :try_end_0
    .catchall {:try_start_0 .. :try_end_0} :catchall_0

    :catchall_0
    :cond_3
    return v2

    .line 128
    :cond_4
    sget-object p2, Lcom/dogac/bin1/EkranGozu;->ana:Landroid/os/Handler;

    iget-object v0, p0, Lcom/dogac/bin1/EkranGozu$4;->uzun:Ljava/lang/Runnable;

    invoke-virtual {p2, v0}, Landroid/os/Handler;->removeCallbacks(Ljava/lang/Runnable;)V

    .line 129
    iget-boolean p2, p0, Lcom/dogac/bin1/EkranGozu$4;->surukle:Z

    if-eqz p2, :cond_5

    invoke-virtual {p1}, Landroid/view/View;->getContext()Landroid/content/Context;

    move-result-object p1

    invoke-static {p1}, Lcom/dogac/bin1/EkranGozu;->tercih(Landroid/content/Context;)Landroid/content/SharedPreferences;

    move-result-object p1

    invoke-interface {p1}, Landroid/content/SharedPreferences;->edit()Landroid/content/SharedPreferences$Editor;

    move-result-object p1

    sget-object p2, Lcom/dogac/bin1/EkranGozu;->lp:Landroid/view/WindowManager$LayoutParams;

    iget p2, p2, Landroid/view/WindowManager$LayoutParams;->x:I

    const-string v0, "x"

    invoke-interface {p1, v0, p2}, Landroid/content/SharedPreferences$Editor;->putInt(Ljava/lang/String;I)Landroid/content/SharedPreferences$Editor;

    move-result-object p1

    sget-object p2, Lcom/dogac/bin1/EkranGozu;->lp:Landroid/view/WindowManager$LayoutParams;

    iget p2, p2, Landroid/view/WindowManager$LayoutParams;->y:I

    const-string v0, "y"

    invoke-interface {p1, v0, p2}, Landroid/content/SharedPreferences$Editor;->putInt(Ljava/lang/String;I)Landroid/content/SharedPreferences$Editor;

    move-result-object p1

    invoke-interface {p1}, Landroid/content/SharedPreferences$Editor;->apply()V

    goto :goto_0

    .line 130
    :cond_5
    invoke-static {}, Ljava/lang/System;->currentTimeMillis()J

    move-result-wide p1

    iget-wide v0, p0, Lcom/dogac/bin1/EkranGozu$4;->bas:J

    sub-long/2addr p1, v0

    const-wide/16 v0, 0x2bc

    cmp-long p1, p1, v0

    if-gez p1, :cond_6

    invoke-static {}, Lcom/dogac/bin1/EkranGozu;->yakala()V

    :cond_6
    :goto_0
    return v2

    .line 122
    :cond_7
    invoke-virtual {p2}, Landroid/view/MotionEvent;->getRawX()F

    move-result p1

    iput p1, p0, Lcom/dogac/bin1/EkranGozu$4;->dx:F

    invoke-virtual {p2}, Landroid/view/MotionEvent;->getRawY()F

    move-result p1

    iput p1, p0, Lcom/dogac/bin1/EkranGozu$4;->dy:F

    sget-object p1, Lcom/dogac/bin1/EkranGozu;->lp:Landroid/view/WindowManager$LayoutParams;

    iget p1, p1, Landroid/view/WindowManager$LayoutParams;->x:I

    iput p1, p0, Lcom/dogac/bin1/EkranGozu$4;->x0:I

    sget-object p1, Lcom/dogac/bin1/EkranGozu;->lp:Landroid/view/WindowManager$LayoutParams;

    iget p1, p1, Landroid/view/WindowManager$LayoutParams;->y:I

    iput p1, p0, Lcom/dogac/bin1/EkranGozu$4;->y0:I

    iput-boolean v1, p0, Lcom/dogac/bin1/EkranGozu$4;->surukle:Z

    invoke-static {}, Ljava/lang/System;->currentTimeMillis()J

    move-result-wide p1

    iput-wide p1, p0, Lcom/dogac/bin1/EkranGozu$4;->bas:J

    sget-object p1, Lcom/dogac/bin1/EkranGozu;->ana:Landroid/os/Handler;

    iget-object p2, p0, Lcom/dogac/bin1/EkranGozu$4;->uzun:Ljava/lang/Runnable;

    const-wide/16 v0, 0x2ee

    invoke-virtual {p1, p2, v0, v1}, Landroid/os/Handler;->postDelayed(Ljava/lang/Runnable;J)Z

    return v2
.end method
