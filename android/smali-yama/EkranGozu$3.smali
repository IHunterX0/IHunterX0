.class Lcom/dogac/bin1/EkranGozu$3;
.super Landroid/view/View;
.source "EkranGozu.java"


# annotations
.annotation system Ldalvik/annotation/EnclosingMethod;
    value = Lcom/dogac/bin1/EkranGozu;->kur()V
.end annotation

.annotation system Ldalvik/annotation/InnerClass;
    accessFlags = 0x0
    name = null
.end annotation


# instance fields
.field final p:Landroid/graphics/Paint;

.field t0:J


# direct methods
.method constructor <init>(Landroid/content/Context;)V
    .locals 2

    .line 83
    invoke-direct {p0, p1}, Landroid/view/View;-><init>(Landroid/content/Context;)V

    .line 84
    new-instance p1, Landroid/graphics/Paint;

    const/4 v0, 0x1

    invoke-direct {p1, v0}, Landroid/graphics/Paint;-><init>(I)V

    iput-object p1, p0, Lcom/dogac/bin1/EkranGozu$3;->p:Landroid/graphics/Paint;

    .line 85
    invoke-static {}, Ljava/lang/System;->currentTimeMillis()J

    move-result-wide v0

    iput-wide v0, p0, Lcom/dogac/bin1/EkranGozu$3;->t0:J

    return-void
.end method


# virtual methods
.method protected onDraw(Landroid/graphics/Canvas;)V
    .locals 24

    move-object/from16 v0, p0

    move-object/from16 v10, p1

    .line 87
    invoke-virtual/range {p0 .. p0}, Lcom/dogac/bin1/EkranGozu$3;->getWidth()I

    move-result v1

    int-to-float v1, v1

    invoke-virtual/range {p0 .. p0}, Lcom/dogac/bin1/EkranGozu$3;->getHeight()I

    move-result v2

    int-to-float v2, v2

    const/high16 v3, 0x40000000    # 2.0f

    div-float v9, v1, v3

    div-float v8, v2, v3

    invoke-static {v1, v2}, Ljava/lang/Math;->min(FF)F

    move-result v1

    div-float v7, v1, v3

    .line 88
    invoke-static {}, Ljava/lang/System;->currentTimeMillis()J

    move-result-wide v1

    iget-wide v3, v0, Lcom/dogac/bin1/EkranGozu$3;->t0:J

    sub-long/2addr v1, v3

    const-wide/16 v3, 0x960

    rem-long/2addr v1, v3

    long-to-float v1, v1

    const/high16 v2, 0x45160000    # 2400.0f

    div-float/2addr v1, v2

    float-to-double v2, v1

    const-wide v4, 0x400921fb54442d18L    # Math.PI

    mul-double/2addr v2, v4

    const-wide/high16 v4, 0x4000000000000000L    # 2.0

    mul-double/2addr v2, v4

    invoke-static {v2, v3}, Ljava/lang/Math;->sin(D)D

    move-result-wide v2

    const-wide/high16 v4, 0x3fe0000000000000L    # 0.5

    mul-double/2addr v2, v4

    add-double/2addr v2, v4

    double-to-float v6, v2

    .line 89
    iget-object v2, v0, Lcom/dogac/bin1/EkranGozu$3;->p:Landroid/graphics/Paint;

    sget-object v3, Landroid/graphics/Paint$Style;->FILL:Landroid/graphics/Paint$Style;

    invoke-virtual {v2, v3}, Landroid/graphics/Paint;->setStyle(Landroid/graphics/Paint$Style;)V

    .line 90
    iget-object v2, v0, Lcom/dogac/bin1/EkranGozu$3;->p:Landroid/graphics/Paint;

    new-instance v3, Landroid/graphics/RadialGradient;

    const v4, 0x445ef0dc

    const/4 v5, 0x0

    const v11, -0x33a10f24    # -5.844261E7f

    filled-new-array {v11, v4, v5}, [I

    move-result-object v15

    const/4 v4, 0x3

    new-array v4, v4, [F

    fill-array-data v4, :array_0

    sget-object v17, Landroid/graphics/Shader$TileMode;->CLAMP:Landroid/graphics/Shader$TileMode;

    move-object v11, v3

    move v12, v9

    move v13, v8

    move v14, v7

    move-object/from16 v16, v4

    invoke-direct/range {v11 .. v17}, Landroid/graphics/RadialGradient;-><init>(FFF[I[FLandroid/graphics/Shader$TileMode;)V

    invoke-virtual {v2, v3}, Landroid/graphics/Paint;->setShader(Landroid/graphics/Shader;)Landroid/graphics/Shader;

    .line 91
    iget-object v2, v0, Lcom/dogac/bin1/EkranGozu$3;->p:Landroid/graphics/Paint;

    sget-boolean v3, Lcom/dogac/bin1/EkranGozu;->yakalaniyor:Z

    const/16 v11, 0xff

    if-eqz v3, :cond_0

    move v3, v11

    goto :goto_0

    :cond_0
    const/high16 v3, 0x42b40000    # 90.0f

    mul-float/2addr v3, v6

    const/high16 v4, 0x43160000    # 150.0f

    add-float/2addr v3, v4

    float-to-int v3, v3

    :goto_0
    invoke-virtual {v2, v3}, Landroid/graphics/Paint;->setAlpha(I)V

    .line 92
    iget-object v2, v0, Lcom/dogac/bin1/EkranGozu$3;->p:Landroid/graphics/Paint;

    invoke-virtual {v10, v9, v8, v7, v2}, Landroid/graphics/Canvas;->drawCircle(FFFLandroid/graphics/Paint;)V

    .line 93
    iget-object v2, v0, Lcom/dogac/bin1/EkranGozu$3;->p:Landroid/graphics/Paint;

    const/4 v3, 0x0

    invoke-virtual {v2, v3}, Landroid/graphics/Paint;->setShader(Landroid/graphics/Shader;)Landroid/graphics/Shader;

    .line 94
    iget-object v2, v0, Lcom/dogac/bin1/EkranGozu$3;->p:Landroid/graphics/Paint;

    const v3, -0x19f9ebe8

    invoke-virtual {v2, v3}, Landroid/graphics/Paint;->setColor(I)V

    const v2, 0x3eeb851f    # 0.46f

    mul-float/2addr v2, v7

    iget-object v3, v0, Lcom/dogac/bin1/EkranGozu$3;->p:Landroid/graphics/Paint;

    invoke-virtual {v10, v9, v8, v2, v3}, Landroid/graphics/Canvas;->drawCircle(FFFLandroid/graphics/Paint;)V

    .line 95
    iget-object v3, v0, Lcom/dogac/bin1/EkranGozu$3;->p:Landroid/graphics/Paint;

    sget-object v4, Landroid/graphics/Paint$Style;->STROKE:Landroid/graphics/Paint$Style;

    invoke-virtual {v3, v4}, Landroid/graphics/Paint;->setStyle(Landroid/graphics/Paint$Style;)V

    iget-object v3, v0, Lcom/dogac/bin1/EkranGozu$3;->p:Landroid/graphics/Paint;

    const v4, 0x3da3d70a    # 0.08f

    mul-float/2addr v4, v7

    invoke-virtual {v3, v4}, Landroid/graphics/Paint;->setStrokeWidth(F)V

    iget-object v3, v0, Lcom/dogac/bin1/EkranGozu$3;->p:Landroid/graphics/Paint;

    const v4, -0x600010

    invoke-virtual {v3, v4}, Landroid/graphics/Paint;->setColor(I)V

    .line 96
    iget-object v3, v0, Lcom/dogac/bin1/EkranGozu$3;->p:Landroid/graphics/Paint;

    invoke-virtual {v10, v9, v8, v2, v3}, Landroid/graphics/Canvas;->drawCircle(FFFLandroid/graphics/Paint;)V

    .line 97
    iget-object v2, v0, Lcom/dogac/bin1/EkranGozu$3;->p:Landroid/graphics/Paint;

    const v3, 0x3d4ccccd    # 0.05f

    mul-float/2addr v3, v7

    invoke-virtual {v2, v3}, Landroid/graphics/Paint;->setStrokeWidth(F)V

    iget-object v2, v0, Lcom/dogac/bin1/EkranGozu$3;->p:Landroid/graphics/Paint;

    const/16 v3, 0xaa

    invoke-virtual {v2, v3}, Landroid/graphics/Paint;->setAlpha(I)V

    const/high16 v2, 0x43b40000    # 360.0f

    mul-float v12, v1, v2

    const v1, 0x3f3851ec    # 0.72f

    mul-float/2addr v1, v7

    sub-float v13, v9, v1

    sub-float v14, v8, v1

    add-float v15, v9, v1

    add-float v16, v8, v1

    const/16 v17, 0x0

    .line 99
    iget-object v5, v0, Lcom/dogac/bin1/EkranGozu$3;->p:Landroid/graphics/Paint;

    const/high16 v18, 0x428c0000    # 70.0f

    move-object/from16 v1, p1

    move v2, v13

    move v3, v14

    move v4, v15

    move-object/from16 v19, v5

    move/from16 v5, v16

    move/from16 v20, v6

    move v6, v12

    move/from16 v21, v7

    move/from16 v7, v18

    move/from16 v22, v8

    move/from16 v8, v17

    move/from16 v23, v9

    move-object/from16 v9, v19

    invoke-virtual/range {v1 .. v9}, Landroid/graphics/Canvas;->drawArc(FFFFFFZLandroid/graphics/Paint;)V

    const/high16 v1, 0x43340000    # 180.0f

    add-float v6, v12, v1

    const/4 v8, 0x0

    .line 100
    iget-object v9, v0, Lcom/dogac/bin1/EkranGozu$3;->p:Landroid/graphics/Paint;

    const/high16 v7, 0x428c0000    # 70.0f

    move-object/from16 v1, p1

    invoke-virtual/range {v1 .. v9}, Landroid/graphics/Canvas;->drawArc(FFFFFFZLandroid/graphics/Paint;)V

    .line 101
    iget-object v1, v0, Lcom/dogac/bin1/EkranGozu$3;->p:Landroid/graphics/Paint;

    sget-object v2, Landroid/graphics/Paint$Style;->FILL:Landroid/graphics/Paint$Style;

    invoke-virtual {v1, v2}, Landroid/graphics/Paint;->setStyle(Landroid/graphics/Paint$Style;)V

    iget-object v1, v0, Lcom/dogac/bin1/EkranGozu$3;->p:Landroid/graphics/Paint;

    invoke-virtual {v1, v11}, Landroid/graphics/Paint;->setAlpha(I)V

    iget-object v1, v0, Lcom/dogac/bin1/EkranGozu$3;->p:Landroid/graphics/Paint;

    const v2, -0x100004

    invoke-virtual {v1, v2}, Landroid/graphics/Paint;->setColor(I)V

    .line 102
    sget-boolean v1, Lcom/dogac/bin1/EkranGozu;->yakalaniyor:Z

    if-eqz v1, :cond_1

    const v1, 0x3e6147ae    # 0.22f

    goto :goto_1

    :cond_1
    const v1, 0x3d23d70a    # 0.04f

    mul-float v6, v20, v1

    const v1, 0x3e051eb8    # 0.13f

    add-float/2addr v1, v6

    :goto_1
    mul-float v7, v21, v1

    iget-object v1, v0, Lcom/dogac/bin1/EkranGozu$3;->p:Landroid/graphics/Paint;

    move/from16 v3, v22

    move/from16 v2, v23

    invoke-virtual {v10, v2, v3, v7, v1}, Landroid/graphics/Canvas;->drawCircle(FFFLandroid/graphics/Paint;)V

    const-wide/16 v1, 0x28

    .line 103
    invoke-virtual {v0, v1, v2}, Lcom/dogac/bin1/EkranGozu$3;->postInvalidateDelayed(J)V

    return-void

    nop

    :array_0
    .array-data 4
        0x0
        0x3ee66666    # 0.45f
        0x3f800000    # 1.0f
    .end array-data
.end method
