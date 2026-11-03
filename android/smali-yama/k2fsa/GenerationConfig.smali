.class public final Lcom/k2fsa/sherpa/onnx/GenerationConfig;
.super Ljava/lang/Object;
.source "Tts.kt"


# annotations
.annotation runtime Lkotlin/Metadata;
    d1 = {
        "\u00008\n\u0002\u0018\u0002\n\u0002\u0010\u0000\n\u0000\n\u0002\u0010\u0007\n\u0002\u0008\u0002\n\u0002\u0010\u0008\n\u0000\n\u0002\u0010\u0014\n\u0002\u0008\u0002\n\u0002\u0010\u000e\n\u0002\u0008\u0002\n\u0002\u0010$\n\u0002\u0008%\n\u0002\u0010\u000b\n\u0002\u0008\u0004\u0008\u0086\u0008\u0018\u00002\u00020\u0001Bg\u0012\u0008\u0008\u0002\u0010\u0002\u001a\u00020\u0003\u0012\u0008\u0008\u0002\u0010\u0004\u001a\u00020\u0003\u0012\u0008\u0008\u0002\u0010\u0005\u001a\u00020\u0006\u0012\n\u0008\u0002\u0010\u0007\u001a\u0004\u0018\u00010\u0008\u0012\u0008\u0008\u0002\u0010\t\u001a\u00020\u0006\u0012\n\u0008\u0002\u0010\n\u001a\u0004\u0018\u00010\u000b\u0012\u0008\u0008\u0002\u0010\u000c\u001a\u00020\u0006\u0012\u0016\u0008\u0002\u0010\r\u001a\u0010\u0012\u0004\u0012\u00020\u000b\u0012\u0004\u0012\u00020\u000b\u0018\u00010\u000e\u00a2\u0006\u0002\u0010\u000fJ\t\u0010*\u001a\u00020\u0003H\u00c6\u0003J\t\u0010+\u001a\u00020\u0003H\u00c6\u0003J\t\u0010,\u001a\u00020\u0006H\u00c6\u0003J\u000b\u0010-\u001a\u0004\u0018\u00010\u0008H\u00c6\u0003J\t\u0010.\u001a\u00020\u0006H\u00c6\u0003J\u000b\u0010/\u001a\u0004\u0018\u00010\u000bH\u00c6\u0003J\t\u00100\u001a\u00020\u0006H\u00c6\u0003J\u0017\u00101\u001a\u0010\u0012\u0004\u0012\u00020\u000b\u0012\u0004\u0012\u00020\u000b\u0018\u00010\u000eH\u00c6\u0003Jk\u00102\u001a\u00020\u00002\u0008\u0008\u0002\u0010\u0002\u001a\u00020\u00032\u0008\u0008\u0002\u0010\u0004\u001a\u00020\u00032\u0008\u0008\u0002\u0010\u0005\u001a\u00020\u00062\n\u0008\u0002\u0010\u0007\u001a\u0004\u0018\u00010\u00082\u0008\u0008\u0002\u0010\t\u001a\u00020\u00062\n\u0008\u0002\u0010\n\u001a\u0004\u0018\u00010\u000b2\u0008\u0008\u0002\u0010\u000c\u001a\u00020\u00062\u0016\u0008\u0002\u0010\r\u001a\u0010\u0012\u0004\u0012\u00020\u000b\u0012\u0004\u0012\u00020\u000b\u0018\u00010\u000eH\u00c6\u0001J\u0013\u00103\u001a\u0002042\u0008\u00105\u001a\u0004\u0018\u00010\u0001H\u00d6\u0003J\t\u00106\u001a\u00020\u0006H\u00d6\u0001J\t\u00107\u001a\u00020\u000bH\u00d6\u0001R(\u0010\r\u001a\u0010\u0012\u0004\u0012\u00020\u000b\u0012\u0004\u0012\u00020\u000b\u0018\u00010\u000eX\u0086\u000e\u00a2\u0006\u000e\n\u0000\u001a\u0004\u0008\u0010\u0010\u0011\"\u0004\u0008\u0012\u0010\u0013R\u001a\u0010\u000c\u001a\u00020\u0006X\u0086\u000e\u00a2\u0006\u000e\n\u0000\u001a\u0004\u0008\u0014\u0010\u0015\"\u0004\u0008\u0016\u0010\u0017R\u001c\u0010\u0007\u001a\u0004\u0018\u00010\u0008X\u0086\u000e\u00a2\u0006\u000e\n\u0000\u001a\u0004\u0008\u0018\u0010\u0019\"\u0004\u0008\u001a\u0010\u001bR\u001a\u0010\t\u001a\u00020\u0006X\u0086\u000e\u00a2\u0006\u000e\n\u0000\u001a\u0004\u0008\u001c\u0010\u0015\"\u0004\u0008\u001d\u0010\u0017R\u001c\u0010\n\u001a\u0004\u0018\u00010\u000bX\u0086\u000e\u00a2\u0006\u000e\n\u0000\u001a\u0004\u0008\u001e\u0010\u001f\"\u0004\u0008 \u0010!R\u001a\u0010\u0005\u001a\u00020\u0006X\u0086\u000e\u00a2\u0006\u000e\n\u0000\u001a\u0004\u0008\"\u0010\u0015\"\u0004\u0008#\u0010\u0017R\u001a\u0010\u0002\u001a\u00020\u0003X\u0086\u000e\u00a2\u0006\u000e\n\u0000\u001a\u0004\u0008$\u0010%\"\u0004\u0008&\u0010\'R\u001a\u0010\u0004\u001a\u00020\u0003X\u0086\u000e\u00a2\u0006\u000e\n\u0000\u001a\u0004\u0008(\u0010%\"\u0004\u0008)\u0010\'\u00a8\u00068"
    }
    d2 = {
        "Lcom/k2fsa/sherpa/onnx/GenerationConfig;",
        "",
        "silenceScale",
        "",
        "speed",
        "sid",
        "",
        "referenceAudio",
        "",
        "referenceSampleRate",
        "referenceText",
        "",
        "numSteps",
        "extra",
        "",
        "(FFI[FILjava/lang/String;ILjava/util/Map;)V",
        "getExtra",
        "()Ljava/util/Map;",
        "setExtra",
        "(Ljava/util/Map;)V",
        "getNumSteps",
        "()I",
        "setNumSteps",
        "(I)V",
        "getReferenceAudio",
        "()[F",
        "setReferenceAudio",
        "([F)V",
        "getReferenceSampleRate",
        "setReferenceSampleRate",
        "getReferenceText",
        "()Ljava/lang/String;",
        "setReferenceText",
        "(Ljava/lang/String;)V",
        "getSid",
        "setSid",
        "getSilenceScale",
        "()F",
        "setSilenceScale",
        "(F)V",
        "getSpeed",
        "setSpeed",
        "component1",
        "component2",
        "component3",
        "component4",
        "component5",
        "component6",
        "component7",
        "component8",
        "copy",
        "equals",
        "",
        "other",
        "hashCode",
        "toString",
        "sherpa_onnx_release"
    }
    k = 0x1
    mv = {
        0x1,
        0x7,
        0x1
    }
    xi = 0x30
.end annotation


# instance fields
.field private extra:Ljava/util/Map;
    .annotation system Ldalvik/annotation/Signature;
        value = {
            "Ljava/util/Map<",
            "Ljava/lang/String;",
            "Ljava/lang/String;",
            ">;"
        }
    .end annotation
.end field

.field private numSteps:I

.field private referenceAudio:[F

.field private referenceSampleRate:I

.field private referenceText:Ljava/lang/String;

.field private sid:I

.field private silenceScale:F

.field private speed:F


# direct methods
.method public constructor <init>()V
    .locals 11

    const/16 v9, 0xff

    const/4 v10, 0x0

    const/4 v1, 0x0

    const/4 v2, 0x0

    const/4 v3, 0x0

    const/4 v4, 0x0

    const/4 v5, 0x0

    const/4 v6, 0x0

    const/4 v7, 0x0

    const/4 v8, 0x0

    move-object v0, p0

    invoke-direct/range {v0 .. v10}, Lcom/k2fsa/sherpa/onnx/GenerationConfig;-><init>(FFI[FILjava/lang/String;ILjava/util/Map;ILkotlin/jvm/internal/DefaultConstructorMarker;)V

    return-void
.end method

.method public constructor <init>(FFI[FILjava/lang/String;ILjava/util/Map;)V
    .locals 0
    .param p1, "silenceScale"    # F
    .param p2, "speed"    # F
    .param p3, "sid"    # I
    .param p4, "referenceAudio"    # [F
    .param p5, "referenceSampleRate"    # I
    .param p6, "referenceText"    # Ljava/lang/String;
    .param p7, "numSteps"    # I
    .param p8, "extra"    # Ljava/util/Map;
    .annotation system Ldalvik/annotation/Signature;
        value = {
            "(FFI[FI",
            "Ljava/lang/String;",
            "I",
            "Ljava/util/Map<",
            "Ljava/lang/String;",
            "Ljava/lang/String;",
            ">;)V"
        }
    .end annotation

    .line 130
    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    .line 131
    iput p1, p0, Lcom/k2fsa/sherpa/onnx/GenerationConfig;->silenceScale:F

    .line 132
    iput p2, p0, Lcom/k2fsa/sherpa/onnx/GenerationConfig;->speed:F

    .line 133
    iput p3, p0, Lcom/k2fsa/sherpa/onnx/GenerationConfig;->sid:I

    .line 134
    iput-object p4, p0, Lcom/k2fsa/sherpa/onnx/GenerationConfig;->referenceAudio:[F

    .line 135
    iput p5, p0, Lcom/k2fsa/sherpa/onnx/GenerationConfig;->referenceSampleRate:I

    .line 136
    iput-object p6, p0, Lcom/k2fsa/sherpa/onnx/GenerationConfig;->referenceText:Ljava/lang/String;

    .line 137
    iput p7, p0, Lcom/k2fsa/sherpa/onnx/GenerationConfig;->numSteps:I

    .line 138
    iput-object p8, p0, Lcom/k2fsa/sherpa/onnx/GenerationConfig;->extra:Ljava/util/Map;

    .line 130
    return-void
.end method

.method public synthetic constructor <init>(FFI[FILjava/lang/String;ILjava/util/Map;ILkotlin/jvm/internal/DefaultConstructorMarker;)V
    .locals 9

    .line 130
    move/from16 v0, p9

    and-int/lit8 v1, v0, 0x1

    if-eqz v1, :cond_0

    .line 131
    const v1, 0x3e4ccccd    # 0.2f

    goto :goto_0

    .line 130
    :cond_0
    move v1, p1

    :goto_0
    and-int/lit8 v2, v0, 0x2

    if-eqz v2, :cond_1

    .line 132
    const/high16 v2, 0x3f800000    # 1.0f

    goto :goto_1

    .line 130
    :cond_1
    move v2, p2

    :goto_1
    and-int/lit8 v3, v0, 0x4

    const/4 v4, 0x0

    if-eqz v3, :cond_2

    .line 133
    move v3, v4

    goto :goto_2

    .line 130
    :cond_2
    move v3, p3

    :goto_2
    and-int/lit8 v5, v0, 0x8

    const/4 v6, 0x0

    if-eqz v5, :cond_3

    .line 134
    move-object v5, v6

    goto :goto_3

    .line 130
    :cond_3
    move-object v5, p4

    :goto_3
    and-int/lit8 v7, v0, 0x10

    if-eqz v7, :cond_4

    .line 135
    goto :goto_4

    .line 130
    :cond_4
    move v4, p5

    :goto_4
    and-int/lit8 v7, v0, 0x20

    if-eqz v7, :cond_5

    .line 136
    move-object v7, v6

    goto :goto_5

    .line 130
    :cond_5
    move-object v7, p6

    :goto_5
    and-int/lit8 v8, v0, 0x40

    if-eqz v8, :cond_6

    .line 137
    const/4 v8, 0x5

    goto :goto_6

    .line 130
    :cond_6
    move/from16 v8, p7

    :goto_6
    and-int/lit16 v0, v0, 0x80

    if-eqz v0, :cond_7

    .line 138
    goto :goto_7

    .line 130
    :cond_7
    move-object/from16 v6, p8

    :goto_7
    move-object p1, p0

    move p2, v1

    move p3, v2

    move p4, v3

    move-object p5, v5

    move p6, v4

    move-object/from16 p7, v7

    move/from16 p8, v8

    move-object/from16 p9, v6

    invoke-direct/range {p1 .. p9}, Lcom/k2fsa/sherpa/onnx/GenerationConfig;-><init>(FFI[FILjava/lang/String;ILjava/util/Map;)V

    .line 139
    return-void
.end method

.method public static synthetic copy$default(Lcom/k2fsa/sherpa/onnx/GenerationConfig;FFI[FILjava/lang/String;ILjava/util/Map;ILjava/lang/Object;)Lcom/k2fsa/sherpa/onnx/GenerationConfig;
    .locals 9

    move-object v0, p0

    move/from16 v1, p9

    and-int/lit8 v2, v1, 0x1

    if-eqz v2, :cond_0

    iget v2, v0, Lcom/k2fsa/sherpa/onnx/GenerationConfig;->silenceScale:F

    goto :goto_0

    :cond_0
    move v2, p1

    :goto_0
    and-int/lit8 v3, v1, 0x2

    if-eqz v3, :cond_1

    iget v3, v0, Lcom/k2fsa/sherpa/onnx/GenerationConfig;->speed:F

    goto :goto_1

    :cond_1
    move v3, p2

    :goto_1
    and-int/lit8 v4, v1, 0x4

    if-eqz v4, :cond_2

    iget v4, v0, Lcom/k2fsa/sherpa/onnx/GenerationConfig;->sid:I

    goto :goto_2

    :cond_2
    move v4, p3

    :goto_2
    and-int/lit8 v5, v1, 0x8

    if-eqz v5, :cond_3

    iget-object v5, v0, Lcom/k2fsa/sherpa/onnx/GenerationConfig;->referenceAudio:[F

    goto :goto_3

    :cond_3
    move-object v5, p4

    :goto_3
    and-int/lit8 v6, v1, 0x10

    if-eqz v6, :cond_4

    iget v6, v0, Lcom/k2fsa/sherpa/onnx/GenerationConfig;->referenceSampleRate:I

    goto :goto_4

    :cond_4
    move v6, p5

    :goto_4
    and-int/lit8 v7, v1, 0x20

    if-eqz v7, :cond_5

    iget-object v7, v0, Lcom/k2fsa/sherpa/onnx/GenerationConfig;->referenceText:Ljava/lang/String;

    goto :goto_5

    :cond_5
    move-object v7, p6

    :goto_5
    and-int/lit8 v8, v1, 0x40

    if-eqz v8, :cond_6

    iget v8, v0, Lcom/k2fsa/sherpa/onnx/GenerationConfig;->numSteps:I

    goto :goto_6

    :cond_6
    move/from16 v8, p7

    :goto_6
    and-int/lit16 v1, v1, 0x80

    if-eqz v1, :cond_7

    iget-object v1, v0, Lcom/k2fsa/sherpa/onnx/GenerationConfig;->extra:Ljava/util/Map;

    goto :goto_7

    :cond_7
    move-object/from16 v1, p8

    :goto_7
    move p1, v2

    move p2, v3

    move p3, v4

    move-object p4, v5

    move p5, v6

    move-object p6, v7

    move/from16 p7, v8

    move-object/from16 p8, v1

    invoke-virtual/range {p0 .. p8}, Lcom/k2fsa/sherpa/onnx/GenerationConfig;->copy(FFI[FILjava/lang/String;ILjava/util/Map;)Lcom/k2fsa/sherpa/onnx/GenerationConfig;

    move-result-object v0

    return-object v0
.end method


# virtual methods
.method public final component1()F
    .locals 1

    iget v0, p0, Lcom/k2fsa/sherpa/onnx/GenerationConfig;->silenceScale:F

    return v0
.end method

.method public final component2()F
    .locals 1

    iget v0, p0, Lcom/k2fsa/sherpa/onnx/GenerationConfig;->speed:F

    return v0
.end method

.method public final component3()I
    .locals 1

    iget v0, p0, Lcom/k2fsa/sherpa/onnx/GenerationConfig;->sid:I

    return v0
.end method

.method public final component4()[F
    .locals 1

    iget-object v0, p0, Lcom/k2fsa/sherpa/onnx/GenerationConfig;->referenceAudio:[F

    return-object v0
.end method

.method public final component5()I
    .locals 1

    iget v0, p0, Lcom/k2fsa/sherpa/onnx/GenerationConfig;->referenceSampleRate:I

    return v0
.end method

.method public final component6()Ljava/lang/String;
    .locals 1

    iget-object v0, p0, Lcom/k2fsa/sherpa/onnx/GenerationConfig;->referenceText:Ljava/lang/String;

    return-object v0
.end method

.method public final component7()I
    .locals 1

    iget v0, p0, Lcom/k2fsa/sherpa/onnx/GenerationConfig;->numSteps:I

    return v0
.end method

.method public final component8()Ljava/util/Map;
    .locals 1
    .annotation system Ldalvik/annotation/Signature;
        value = {
            "()",
            "Ljava/util/Map<",
            "Ljava/lang/String;",
            "Ljava/lang/String;",
            ">;"
        }
    .end annotation

    iget-object v0, p0, Lcom/k2fsa/sherpa/onnx/GenerationConfig;->extra:Ljava/util/Map;

    return-object v0
.end method

.method public final copy(FFI[FILjava/lang/String;ILjava/util/Map;)Lcom/k2fsa/sherpa/onnx/GenerationConfig;
    .locals 10
    .annotation system Ldalvik/annotation/Signature;
        value = {
            "(FFI[FI",
            "Ljava/lang/String;",
            "I",
            "Ljava/util/Map<",
            "Ljava/lang/String;",
            "Ljava/lang/String;",
            ">;)",
            "Lcom/k2fsa/sherpa/onnx/GenerationConfig;"
        }
    .end annotation

    new-instance v9, Lcom/k2fsa/sherpa/onnx/GenerationConfig;

    move-object v0, v9

    move v1, p1

    move v2, p2

    move v3, p3

    move-object v4, p4

    move v5, p5

    move-object/from16 v6, p6

    move/from16 v7, p7

    move-object/from16 v8, p8

    invoke-direct/range {v0 .. v8}, Lcom/k2fsa/sherpa/onnx/GenerationConfig;-><init>(FFI[FILjava/lang/String;ILjava/util/Map;)V

    return-object v9
.end method

.method public equals(Ljava/lang/Object;)Z
    .locals 5

    const/4 v0, 0x1

    if-ne p0, p1, :cond_0

    return v0

    :cond_0
    instance-of v1, p1, Lcom/k2fsa/sherpa/onnx/GenerationConfig;

    const/4 v2, 0x0

    if-nez v1, :cond_1

    return v2

    :cond_1
    move-object v1, p1

    check-cast v1, Lcom/k2fsa/sherpa/onnx/GenerationConfig;

    iget v3, p0, Lcom/k2fsa/sherpa/onnx/GenerationConfig;->silenceScale:F

    iget v4, v1, Lcom/k2fsa/sherpa/onnx/GenerationConfig;->silenceScale:F

    invoke-static {v3, v4}, Ljava/lang/Float;->compare(FF)I

    move-result v3

    if-eqz v3, :cond_2

    return v2

    :cond_2
    iget v3, p0, Lcom/k2fsa/sherpa/onnx/GenerationConfig;->speed:F

    iget v4, v1, Lcom/k2fsa/sherpa/onnx/GenerationConfig;->speed:F

    invoke-static {v3, v4}, Ljava/lang/Float;->compare(FF)I

    move-result v3

    if-eqz v3, :cond_3

    return v2

    :cond_3
    iget v3, p0, Lcom/k2fsa/sherpa/onnx/GenerationConfig;->sid:I

    iget v4, v1, Lcom/k2fsa/sherpa/onnx/GenerationConfig;->sid:I

    if-eq v3, v4, :cond_4

    return v2

    :cond_4
    iget-object v3, p0, Lcom/k2fsa/sherpa/onnx/GenerationConfig;->referenceAudio:[F

    iget-object v4, v1, Lcom/k2fsa/sherpa/onnx/GenerationConfig;->referenceAudio:[F

    invoke-static {v3, v4}, Lkotlin/jvm/internal/Intrinsics;->areEqual(Ljava/lang/Object;Ljava/lang/Object;)Z

    move-result v3

    if-nez v3, :cond_5

    return v2

    :cond_5
    iget v3, p0, Lcom/k2fsa/sherpa/onnx/GenerationConfig;->referenceSampleRate:I

    iget v4, v1, Lcom/k2fsa/sherpa/onnx/GenerationConfig;->referenceSampleRate:I

    if-eq v3, v4, :cond_6

    return v2

    :cond_6
    iget-object v3, p0, Lcom/k2fsa/sherpa/onnx/GenerationConfig;->referenceText:Ljava/lang/String;

    iget-object v4, v1, Lcom/k2fsa/sherpa/onnx/GenerationConfig;->referenceText:Ljava/lang/String;

    invoke-static {v3, v4}, Lkotlin/jvm/internal/Intrinsics;->areEqual(Ljava/lang/Object;Ljava/lang/Object;)Z

    move-result v3

    if-nez v3, :cond_7

    return v2

    :cond_7
    iget v3, p0, Lcom/k2fsa/sherpa/onnx/GenerationConfig;->numSteps:I

    iget v4, v1, Lcom/k2fsa/sherpa/onnx/GenerationConfig;->numSteps:I

    if-eq v3, v4, :cond_8

    return v2

    :cond_8
    iget-object v3, p0, Lcom/k2fsa/sherpa/onnx/GenerationConfig;->extra:Ljava/util/Map;

    iget-object v1, v1, Lcom/k2fsa/sherpa/onnx/GenerationConfig;->extra:Ljava/util/Map;

    invoke-static {v3, v1}, Lkotlin/jvm/internal/Intrinsics;->areEqual(Ljava/lang/Object;Ljava/lang/Object;)Z

    move-result v1

    if-nez v1, :cond_9

    return v2

    :cond_9
    return v0
.end method

.method public final getExtra()Ljava/util/Map;
    .locals 1
    .annotation system Ldalvik/annotation/Signature;
        value = {
            "()",
            "Ljava/util/Map<",
            "Ljava/lang/String;",
            "Ljava/lang/String;",
            ">;"
        }
    .end annotation

    .line 138
    iget-object v0, p0, Lcom/k2fsa/sherpa/onnx/GenerationConfig;->extra:Ljava/util/Map;

    return-object v0
.end method

.method public final getNumSteps()I
    .locals 1

    .line 137
    iget v0, p0, Lcom/k2fsa/sherpa/onnx/GenerationConfig;->numSteps:I

    return v0
.end method

.method public final getReferenceAudio()[F
    .locals 1

    .line 134
    iget-object v0, p0, Lcom/k2fsa/sherpa/onnx/GenerationConfig;->referenceAudio:[F

    return-object v0
.end method

.method public final getReferenceSampleRate()I
    .locals 1

    .line 135
    iget v0, p0, Lcom/k2fsa/sherpa/onnx/GenerationConfig;->referenceSampleRate:I

    return v0
.end method

.method public final getReferenceText()Ljava/lang/String;
    .locals 1

    .line 136
    iget-object v0, p0, Lcom/k2fsa/sherpa/onnx/GenerationConfig;->referenceText:Ljava/lang/String;

    return-object v0
.end method

.method public final getSid()I
    .locals 1

    .line 133
    iget v0, p0, Lcom/k2fsa/sherpa/onnx/GenerationConfig;->sid:I

    return v0
.end method

.method public final getSilenceScale()F
    .locals 1

    .line 131
    iget v0, p0, Lcom/k2fsa/sherpa/onnx/GenerationConfig;->silenceScale:F

    return v0
.end method

.method public final getSpeed()F
    .locals 1

    .line 132
    iget v0, p0, Lcom/k2fsa/sherpa/onnx/GenerationConfig;->speed:F

    return v0
.end method

.method public hashCode()I
    .locals 4

    iget v0, p0, Lcom/k2fsa/sherpa/onnx/GenerationConfig;->silenceScale:F

    invoke-static {v0}, Ljava/lang/Float;->hashCode(F)I

    move-result v0

    mul-int/lit8 v1, v0, 0x1f

    iget v2, p0, Lcom/k2fsa/sherpa/onnx/GenerationConfig;->speed:F

    invoke-static {v2}, Ljava/lang/Float;->hashCode(F)I

    move-result v2

    add-int/2addr v1, v2

    mul-int/lit8 v0, v1, 0x1f

    iget v2, p0, Lcom/k2fsa/sherpa/onnx/GenerationConfig;->sid:I

    invoke-static {v2}, Ljava/lang/Integer;->hashCode(I)I

    move-result v2

    add-int/2addr v0, v2

    mul-int/lit8 v1, v0, 0x1f

    iget-object v2, p0, Lcom/k2fsa/sherpa/onnx/GenerationConfig;->referenceAudio:[F

    const/4 v3, 0x0

    if-nez v2, :cond_0

    move v2, v3

    goto :goto_0

    :cond_0
    iget-object v2, p0, Lcom/k2fsa/sherpa/onnx/GenerationConfig;->referenceAudio:[F

    invoke-static {v2}, Ljava/util/Arrays;->hashCode([F)I

    move-result v2

    :goto_0
    add-int/2addr v1, v2

    mul-int/lit8 v0, v1, 0x1f

    iget v2, p0, Lcom/k2fsa/sherpa/onnx/GenerationConfig;->referenceSampleRate:I

    invoke-static {v2}, Ljava/lang/Integer;->hashCode(I)I

    move-result v2

    add-int/2addr v0, v2

    mul-int/lit8 v1, v0, 0x1f

    iget-object v2, p0, Lcom/k2fsa/sherpa/onnx/GenerationConfig;->referenceText:Ljava/lang/String;

    if-nez v2, :cond_1

    move v2, v3

    goto :goto_1

    :cond_1
    iget-object v2, p0, Lcom/k2fsa/sherpa/onnx/GenerationConfig;->referenceText:Ljava/lang/String;

    invoke-virtual {v2}, Ljava/lang/String;->hashCode()I

    move-result v2

    :goto_1
    add-int/2addr v1, v2

    mul-int/lit8 v0, v1, 0x1f

    iget v2, p0, Lcom/k2fsa/sherpa/onnx/GenerationConfig;->numSteps:I

    invoke-static {v2}, Ljava/lang/Integer;->hashCode(I)I

    move-result v2

    add-int/2addr v0, v2

    mul-int/lit8 v1, v0, 0x1f

    iget-object v2, p0, Lcom/k2fsa/sherpa/onnx/GenerationConfig;->extra:Ljava/util/Map;

    if-nez v2, :cond_2

    goto :goto_2

    :cond_2
    iget-object v2, p0, Lcom/k2fsa/sherpa/onnx/GenerationConfig;->extra:Ljava/util/Map;

    invoke-virtual {v2}, Ljava/lang/Object;->hashCode()I

    move-result v3

    :goto_2
    add-int/2addr v1, v3

    return v1
.end method

.method public final setExtra(Ljava/util/Map;)V
    .locals 0
    .param p1, "<set-?>"    # Ljava/util/Map;
    .annotation system Ldalvik/annotation/Signature;
        value = {
            "(",
            "Ljava/util/Map<",
            "Ljava/lang/String;",
            "Ljava/lang/String;",
            ">;)V"
        }
    .end annotation

    .line 138
    iput-object p1, p0, Lcom/k2fsa/sherpa/onnx/GenerationConfig;->extra:Ljava/util/Map;

    return-void
.end method

.method public final setNumSteps(I)V
    .locals 0
    .param p1, "<set-?>"    # I

    .line 137
    iput p1, p0, Lcom/k2fsa/sherpa/onnx/GenerationConfig;->numSteps:I

    return-void
.end method

.method public final setReferenceAudio([F)V
    .locals 0
    .param p1, "<set-?>"    # [F

    .line 134
    iput-object p1, p0, Lcom/k2fsa/sherpa/onnx/GenerationConfig;->referenceAudio:[F

    return-void
.end method

.method public final setReferenceSampleRate(I)V
    .locals 0
    .param p1, "<set-?>"    # I

    .line 135
    iput p1, p0, Lcom/k2fsa/sherpa/onnx/GenerationConfig;->referenceSampleRate:I

    return-void
.end method

.method public final setReferenceText(Ljava/lang/String;)V
    .locals 0
    .param p1, "<set-?>"    # Ljava/lang/String;

    .line 136
    iput-object p1, p0, Lcom/k2fsa/sherpa/onnx/GenerationConfig;->referenceText:Ljava/lang/String;

    return-void
.end method

.method public final setSid(I)V
    .locals 0
    .param p1, "<set-?>"    # I

    .line 133
    iput p1, p0, Lcom/k2fsa/sherpa/onnx/GenerationConfig;->sid:I

    return-void
.end method

.method public final setSilenceScale(F)V
    .locals 0
    .param p1, "<set-?>"    # F

    .line 131
    iput p1, p0, Lcom/k2fsa/sherpa/onnx/GenerationConfig;->silenceScale:F

    return-void
.end method

.method public final setSpeed(F)V
    .locals 0
    .param p1, "<set-?>"    # F

    .line 132
    iput p1, p0, Lcom/k2fsa/sherpa/onnx/GenerationConfig;->speed:F

    return-void
.end method

.method public toString()Ljava/lang/String;
    .locals 2

    new-instance v0, Ljava/lang/StringBuilder;

    invoke-direct {v0}, Ljava/lang/StringBuilder;-><init>()V

    const-string v1, "GenerationConfig(silenceScale="

    invoke-virtual {v0, v1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v0

    iget v1, p0, Lcom/k2fsa/sherpa/onnx/GenerationConfig;->silenceScale:F

    invoke-virtual {v0, v1}, Ljava/lang/StringBuilder;->append(F)Ljava/lang/StringBuilder;

    move-result-object v0

    const-string v1, ", speed="

    invoke-virtual {v0, v1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v0

    iget v1, p0, Lcom/k2fsa/sherpa/onnx/GenerationConfig;->speed:F

    invoke-virtual {v0, v1}, Ljava/lang/StringBuilder;->append(F)Ljava/lang/StringBuilder;

    move-result-object v0

    const-string v1, ", sid="

    invoke-virtual {v0, v1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v0

    iget v1, p0, Lcom/k2fsa/sherpa/onnx/GenerationConfig;->sid:I

    invoke-virtual {v0, v1}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    move-result-object v0

    const-string v1, ", referenceAudio="

    invoke-virtual {v0, v1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v0

    iget-object v1, p0, Lcom/k2fsa/sherpa/onnx/GenerationConfig;->referenceAudio:[F

    invoke-static {v1}, Ljava/util/Arrays;->toString([F)Ljava/lang/String;

    move-result-object v1

    invoke-virtual {v0, v1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v0

    const-string v1, ", referenceSampleRate="

    invoke-virtual {v0, v1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v0

    iget v1, p0, Lcom/k2fsa/sherpa/onnx/GenerationConfig;->referenceSampleRate:I

    invoke-virtual {v0, v1}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    move-result-object v0

    const-string v1, ", referenceText="

    invoke-virtual {v0, v1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v0

    iget-object v1, p0, Lcom/k2fsa/sherpa/onnx/GenerationConfig;->referenceText:Ljava/lang/String;

    invoke-virtual {v0, v1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v0

    const-string v1, ", numSteps="

    invoke-virtual {v0, v1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v0

    iget v1, p0, Lcom/k2fsa/sherpa/onnx/GenerationConfig;->numSteps:I

    invoke-virtual {v0, v1}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    move-result-object v0

    const-string v1, ", extra="

    invoke-virtual {v0, v1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v0

    iget-object v1, p0, Lcom/k2fsa/sherpa/onnx/GenerationConfig;->extra:Ljava/util/Map;

    invoke-virtual {v0, v1}, Ljava/lang/StringBuilder;->append(Ljava/lang/Object;)Ljava/lang/StringBuilder;

    move-result-object v0

    const/16 v1, 0x29

    invoke-virtual {v0, v1}, Ljava/lang/StringBuilder;->append(C)Ljava/lang/StringBuilder;

    move-result-object v0

    invoke-virtual {v0}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v0

    return-object v0
.end method
