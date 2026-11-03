.class public final Lcom/k2fsa/sherpa/onnx/OfflineTts;
.super Ljava/lang/Object;
.source "Tts.kt"


# annotations
.annotation system Ldalvik/annotation/MemberClasses;
    value = {
        Lcom/k2fsa/sherpa/onnx/OfflineTts$Companion;
    }
.end annotation

.annotation runtime Lkotlin/Metadata;
    d1 = {
        "\u0000X\n\u0002\u0018\u0002\n\u0002\u0010\u0000\n\u0000\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0002\u0008\u0006\n\u0002\u0010\t\n\u0000\n\u0002\u0010\u0002\n\u0002\u0008\u0004\n\u0002\u0018\u0002\n\u0000\n\u0002\u0010\u000e\n\u0000\n\u0002\u0010\u0008\n\u0000\n\u0002\u0010\u0007\n\u0002\u0008\u0003\n\u0002\u0018\u0002\n\u0002\u0010\u0014\n\u0002\u0018\u0002\n\u0002\u0008\u0004\n\u0002\u0018\u0002\n\u0002\u0008\u000b\u0018\u0000 .2\u00020\u0001:\u0001.B\u0019\u0012\n\u0008\u0002\u0010\u0002\u001a\u0004\u0018\u00010\u0003\u0012\u0006\u0010\u0004\u001a\u00020\u0005\u00a2\u0006\u0002\u0010\u0006J\u0012\u0010\r\u001a\u00020\u000e2\n\u0008\u0002\u0010\u0002\u001a\u0004\u0018\u00010\u0003J\u0011\u0010\u000f\u001a\u00020\u000e2\u0006\u0010\u000b\u001a\u00020\u000cH\u0082 J\u0008\u0010\u0010\u001a\u00020\u000eH\u0004J\u0006\u0010\u0011\u001a\u00020\u000eJ\"\u0010\u0012\u001a\u00020\u00132\u0006\u0010\u0014\u001a\u00020\u00152\u0008\u0008\u0002\u0010\u0016\u001a\u00020\u00172\u0008\u0008\u0002\u0010\u0018\u001a\u00020\u0019J-\u0010\u001a\u001a\u00020\u00132\u0006\u0010\u000b\u001a\u00020\u000c2\u0006\u0010\u0014\u001a\u00020\u00152\u0008\u0008\u0002\u0010\u0016\u001a\u00020\u00172\u0008\u0008\u0002\u0010\u0018\u001a\u00020\u0019H\u0082 JE\u0010\u001b\u001a\u00020\u00132\u0006\u0010\u0014\u001a\u00020\u00152\u0008\u0008\u0002\u0010\u0016\u001a\u00020\u00172\u0008\u0008\u0002\u0010\u0018\u001a\u00020\u00192!\u0010\u001c\u001a\u001d\u0012\u0013\u0012\u00110\u001e\u00a2\u0006\u000c\u0008\u001f\u0012\u0008\u0008 \u0012\u0004\u0008\u0008(!\u0012\u0004\u0012\u00020\u00170\u001dJP\u0010\"\u001a\u00020\u00132\u0006\u0010\u000b\u001a\u00020\u000c2\u0006\u0010\u0014\u001a\u00020\u00152\u0008\u0008\u0002\u0010\u0016\u001a\u00020\u00172\u0008\u0008\u0002\u0010\u0018\u001a\u00020\u00192!\u0010\u001c\u001a\u001d\u0012\u0013\u0012\u00110\u001e\u00a2\u0006\u000c\u0008\u001f\u0012\u0008\u0008 \u0012\u0004\u0008\u0008(!\u0012\u0004\u0012\u00020\u00170\u001dH\u0082 J\u0016\u0010#\u001a\u00020\u00132\u0006\u0010\u0014\u001a\u00020\u00152\u0006\u0010\u0004\u001a\u00020$J9\u0010%\u001a\u00020\u00132\u0006\u0010\u0014\u001a\u00020\u00152\u0006\u0010\u0004\u001a\u00020$2!\u0010\u001c\u001a\u001d\u0012\u0013\u0012\u00110\u001e\u00a2\u0006\u000c\u0008\u001f\u0012\u0008\u0008 \u0012\u0004\u0008\u0008(!\u0012\u0004\u0012\u00020\u00170\u001dJF\u0010&\u001a\u00020\u00132\u0006\u0010\u000b\u001a\u00020\u000c2\u0006\u0010\u0014\u001a\u00020\u00152\u0006\u0010\u0004\u001a\u00020$2#\u0010\u001c\u001a\u001f\u0012\u0013\u0012\u00110\u001e\u00a2\u0006\u000c\u0008\u001f\u0012\u0008\u0008 \u0012\u0004\u0008\u0008(!\u0012\u0004\u0012\u00020\u0017\u0018\u00010\u001dH\u0082 J\u0011\u0010\'\u001a\u00020\u00172\u0006\u0010\u000b\u001a\u00020\u000cH\u0082 J\u0011\u0010(\u001a\u00020\u00172\u0006\u0010\u000b\u001a\u00020\u000cH\u0082 J\u0019\u0010)\u001a\u00020\u000c2\u0006\u0010\u0002\u001a\u00020\u00032\u0006\u0010\u0004\u001a\u00020\u0005H\u0082 J\u0011\u0010*\u001a\u00020\u000c2\u0006\u0010\u0004\u001a\u00020\u0005H\u0082 J\u0006\u0010+\u001a\u00020\u0017J\u0006\u0010,\u001a\u00020\u000eJ\u0006\u0010-\u001a\u00020\u0017R\u001a\u0010\u0004\u001a\u00020\u0005X\u0086\u000e\u00a2\u0006\u000e\n\u0000\u001a\u0004\u0008\u0007\u0010\u0008\"\u0004\u0008\t\u0010\nR\u000e\u0010\u000b\u001a\u00020\u000cX\u0082\u000e\u00a2\u0006\u0002\n\u0000\u00a8\u0006/"
    }
    d2 = {
        "Lcom/k2fsa/sherpa/onnx/OfflineTts;",
        "",
        "assetManager",
        "Landroid/content/res/AssetManager;",
        "config",
        "Lcom/k2fsa/sherpa/onnx/OfflineTtsConfig;",
        "(Landroid/content/res/AssetManager;Lcom/k2fsa/sherpa/onnx/OfflineTtsConfig;)V",
        "getConfig",
        "()Lcom/k2fsa/sherpa/onnx/OfflineTtsConfig;",
        "setConfig",
        "(Lcom/k2fsa/sherpa/onnx/OfflineTtsConfig;)V",
        "ptr",
        "",
        "allocate",
        "",
        "delete",
        "finalize",
        "free",
        "generate",
        "Lcom/k2fsa/sherpa/onnx/GeneratedAudio;",
        "text",
        "",
        "sid",
        "",
        "speed",
        "",
        "generateImpl",
        "generateWithCallback",
        "callback",
        "Lkotlin/Function1;",
        "",
        "Lkotlin/ParameterName;",
        "name",
        "samples",
        "generateWithCallbackImpl",
        "generateWithConfig",
        "Lcom/k2fsa/sherpa/onnx/GenerationConfig;",
        "generateWithConfigAndCallback",
        "generateWithConfigImpl",
        "getNumSpeakers",
        "getSampleRate",
        "newFromAsset",
        "newFromFile",
        "numSpeakers",
        "release",
        "sampleRate",
        "Companion",
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


# static fields
.field public static final Companion:Lcom/k2fsa/sherpa/onnx/OfflineTts$Companion;


# instance fields
.field private config:Lcom/k2fsa/sherpa/onnx/OfflineTtsConfig;

.field private ptr:J


# direct methods
.method static constructor <clinit>()V
    .locals 2

    new-instance v0, Lcom/k2fsa/sherpa/onnx/OfflineTts$Companion;

    const/4 v1, 0x0

    invoke-direct {v0, v1}, Lcom/k2fsa/sherpa/onnx/OfflineTts$Companion;-><init>(Lkotlin/jvm/internal/DefaultConstructorMarker;)V

    sput-object v0, Lcom/k2fsa/sherpa/onnx/OfflineTts;->Companion:Lcom/k2fsa/sherpa/onnx/OfflineTts$Companion;

    .line 270
    nop

    .line 271
    const-string v0, "sherpa-onnx-jni"

    invoke-static {v0}, Ljava/lang/System;->loadLibrary(Ljava/lang/String;)V

    .line 272
    return-void
.end method

.method public constructor <init>(Landroid/content/res/AssetManager;Lcom/k2fsa/sherpa/onnx/OfflineTtsConfig;)V
    .locals 4
    .param p1, "assetManager"    # Landroid/content/res/AssetManager;
    .param p2, "config"    # Lcom/k2fsa/sherpa/onnx/OfflineTtsConfig;

    const-string v0, "config"

    invoke-static {p2, v0}, Lkotlin/jvm/internal/Intrinsics;->checkNotNullParameter(Ljava/lang/Object;Ljava/lang/String;)V

    .line 141
    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    .line 143
    iput-object p2, p0, Lcom/k2fsa/sherpa/onnx/OfflineTts;->config:Lcom/k2fsa/sherpa/onnx/OfflineTtsConfig;

    .line 147
    nop

    .line 148
    if-eqz p1, :cond_0

    .line 149
    iget-object v0, p0, Lcom/k2fsa/sherpa/onnx/OfflineTts;->config:Lcom/k2fsa/sherpa/onnx/OfflineTtsConfig;

    invoke-direct {p0, p1, v0}, Lcom/k2fsa/sherpa/onnx/OfflineTts;->newFromAsset(Landroid/content/res/AssetManager;Lcom/k2fsa/sherpa/onnx/OfflineTtsConfig;)J

    move-result-wide v0

    goto :goto_0

    .line 151
    :cond_0
    iget-object v0, p0, Lcom/k2fsa/sherpa/onnx/OfflineTts;->config:Lcom/k2fsa/sherpa/onnx/OfflineTtsConfig;

    invoke-direct {p0, v0}, Lcom/k2fsa/sherpa/onnx/OfflineTts;->newFromFile(Lcom/k2fsa/sherpa/onnx/OfflineTtsConfig;)J

    move-result-wide v0

    .line 148
    :goto_0
    iput-wide v0, p0, Lcom/k2fsa/sherpa/onnx/OfflineTts;->ptr:J

    .line 153
    iget-wide v0, p0, Lcom/k2fsa/sherpa/onnx/OfflineTts;->ptr:J

    const-wide/16 v2, 0x0

    cmp-long v0, v0, v2

    if-eqz v0, :cond_1

    const/4 v0, 0x1

    goto :goto_1

    :cond_1
    const/4 v0, 0x0

    :goto_1
    if-eqz v0, :cond_2

    .line 156
    nop

    .line 141
    return-void

    .line 153
    :cond_2
    const/4 v0, 0x0

    .line 154
    .local v0, "$i$a$-require-OfflineTts$1":I
    nop

    .line 153
    .end local v0    # "$i$a$-require-OfflineTts$1":I
    new-instance v0, Ljava/lang/IllegalArgumentException;

    const-string v1, "Invalid OfflineTtsConfig: failed to create native OfflineTts"

    invoke-virtual {v1}, Ljava/lang/Object;->toString()Ljava/lang/String;

    move-result-object v1

    invoke-direct {v0, v1}, Ljava/lang/IllegalArgumentException;-><init>(Ljava/lang/String;)V

    throw v0
.end method

.method public synthetic constructor <init>(Landroid/content/res/AssetManager;Lcom/k2fsa/sherpa/onnx/OfflineTtsConfig;ILkotlin/jvm/internal/DefaultConstructorMarker;)V
    .locals 0

    .line 141
    and-int/lit8 p3, p3, 0x1

    if-eqz p3, :cond_0

    .line 142
    const/4 p1, 0x0

    .line 141
    :cond_0
    invoke-direct {p0, p1, p2}, Lcom/k2fsa/sherpa/onnx/OfflineTts;-><init>(Landroid/content/res/AssetManager;Lcom/k2fsa/sherpa/onnx/OfflineTtsConfig;)V

    .line 274
    return-void
.end method

.method public static synthetic allocate$default(Lcom/k2fsa/sherpa/onnx/OfflineTts;Landroid/content/res/AssetManager;ILjava/lang/Object;)V
    .locals 0

    .line 200
    and-int/lit8 p2, p2, 0x1

    if-eqz p2, :cond_0

    const/4 p1, 0x0

    :cond_0
    invoke-virtual {p0, p1}, Lcom/k2fsa/sherpa/onnx/OfflineTts;->allocate(Landroid/content/res/AssetManager;)V

    return-void
.end method

.method private final native delete(J)V
.end method

.method public static synthetic generate$default(Lcom/k2fsa/sherpa/onnx/OfflineTts;Ljava/lang/String;IFILjava/lang/Object;)Lcom/k2fsa/sherpa/onnx/GeneratedAudio;
    .locals 0

    .line 162
    and-int/lit8 p5, p4, 0x2

    if-eqz p5, :cond_0

    .line 164
    const/4 p2, 0x0

    .line 162
    :cond_0
    and-int/lit8 p4, p4, 0x4

    if-eqz p4, :cond_1

    .line 165
    const/high16 p3, 0x3f800000    # 1.0f

    .line 162
    :cond_1
    invoke-virtual {p0, p1, p2, p3}, Lcom/k2fsa/sherpa/onnx/OfflineTts;->generate(Ljava/lang/String;IF)Lcom/k2fsa/sherpa/onnx/GeneratedAudio;

    move-result-object p0

    return-object p0
.end method

.method private final native generateImpl(JLjava/lang/String;IF)Lcom/k2fsa/sherpa/onnx/GeneratedAudio;
.end method

.method static synthetic generateImpl$default(Lcom/k2fsa/sherpa/onnx/OfflineTts;JLjava/lang/String;IFILjava/lang/Object;)Lcom/k2fsa/sherpa/onnx/GeneratedAudio;
    .locals 6

    .line 246
    and-int/lit8 p7, p6, 0x4

    if-eqz p7, :cond_0

    .line 249
    const/4 p4, 0x0

    move v4, p4

    goto :goto_0

    .line 246
    :cond_0
    move v4, p4

    :goto_0
    and-int/lit8 p4, p6, 0x8

    if-eqz p4, :cond_1

    .line 250
    const/high16 p5, 0x3f800000    # 1.0f

    move v5, p5

    goto :goto_1

    .line 246
    :cond_1
    move v5, p5

    :goto_1
    move-object v0, p0

    move-wide v1, p1

    move-object v3, p3

    invoke-direct/range {v0 .. v5}, Lcom/k2fsa/sherpa/onnx/OfflineTts;->generateImpl(JLjava/lang/String;IF)Lcom/k2fsa/sherpa/onnx/GeneratedAudio;

    move-result-object p0

    return-object p0
.end method

.method public static synthetic generateWithCallback$default(Lcom/k2fsa/sherpa/onnx/OfflineTts;Ljava/lang/String;IFLkotlin/jvm/functions/Function1;ILjava/lang/Object;)Lcom/k2fsa/sherpa/onnx/GeneratedAudio;
    .locals 0

    .line 170
    and-int/lit8 p6, p5, 0x2

    if-eqz p6, :cond_0

    .line 172
    const/4 p2, 0x0

    .line 170
    :cond_0
    and-int/lit8 p5, p5, 0x4

    if-eqz p5, :cond_1

    .line 173
    const/high16 p3, 0x3f800000    # 1.0f

    .line 170
    :cond_1
    invoke-virtual {p0, p1, p2, p3, p4}, Lcom/k2fsa/sherpa/onnx/OfflineTts;->generateWithCallback(Ljava/lang/String;IFLkotlin/jvm/functions/Function1;)Lcom/k2fsa/sherpa/onnx/GeneratedAudio;

    move-result-object p0

    return-object p0
.end method

.method private final native generateWithCallbackImpl(JLjava/lang/String;IFLkotlin/jvm/functions/Function1;)Lcom/k2fsa/sherpa/onnx/GeneratedAudio;
    .annotation system Ldalvik/annotation/Signature;
        value = {
            "(J",
            "Ljava/lang/String;",
            "IF",
            "Lkotlin/jvm/functions/Function1<",
            "-[F",
            "Ljava/lang/Integer;",
            ">;)",
            "Lcom/k2fsa/sherpa/onnx/GeneratedAudio;"
        }
    .end annotation
.end method

.method static synthetic generateWithCallbackImpl$default(Lcom/k2fsa/sherpa/onnx/OfflineTts;JLjava/lang/String;IFLkotlin/jvm/functions/Function1;ILjava/lang/Object;)Lcom/k2fsa/sherpa/onnx/GeneratedAudio;
    .locals 7

    .line 253
    and-int/lit8 p8, p7, 0x4

    if-eqz p8, :cond_0

    .line 256
    const/4 p4, 0x0

    move v4, p4

    goto :goto_0

    .line 253
    :cond_0
    move v4, p4

    :goto_0
    and-int/lit8 p4, p7, 0x8

    if-eqz p4, :cond_1

    .line 257
    const/high16 p5, 0x3f800000    # 1.0f

    move v5, p5

    goto :goto_1

    .line 253
    :cond_1
    move v5, p5

    :goto_1
    move-object v0, p0

    move-wide v1, p1

    move-object v3, p3

    move-object v6, p6

    invoke-direct/range {v0 .. v6}, Lcom/k2fsa/sherpa/onnx/OfflineTts;->generateWithCallbackImpl(JLjava/lang/String;IFLkotlin/jvm/functions/Function1;)Lcom/k2fsa/sherpa/onnx/GeneratedAudio;

    move-result-object p0

    return-object p0
.end method

.method private final native generateWithConfigImpl(JLjava/lang/String;Lcom/k2fsa/sherpa/onnx/GenerationConfig;Lkotlin/jvm/functions/Function1;)Lcom/k2fsa/sherpa/onnx/GeneratedAudio;
    .annotation system Ldalvik/annotation/Signature;
        value = {
            "(J",
            "Ljava/lang/String;",
            "Lcom/k2fsa/sherpa/onnx/GenerationConfig;",
            "Lkotlin/jvm/functions/Function1<",
            "-[F",
            "Ljava/lang/Integer;",
            ">;)",
            "Lcom/k2fsa/sherpa/onnx/GeneratedAudio;"
        }
    .end annotation
.end method

.method private final native getNumSpeakers(J)I
.end method

.method private final native getSampleRate(J)I
.end method

.method private final native newFromAsset(Landroid/content/res/AssetManager;Lcom/k2fsa/sherpa/onnx/OfflineTtsConfig;)J
.end method

.method private final native newFromFile(Lcom/k2fsa/sherpa/onnx/OfflineTtsConfig;)J
.end method


# virtual methods
.method public final allocate(Landroid/content/res/AssetManager;)V
    .locals 4
    .param p1, "assetManager"    # Landroid/content/res/AssetManager;

    .line 201
    iget-wide v0, p0, Lcom/k2fsa/sherpa/onnx/OfflineTts;->ptr:J

    const-wide/16 v2, 0x0

    cmp-long v0, v0, v2

    if-nez v0, :cond_3

    .line 202
    if-eqz p1, :cond_0

    .line 203
    iget-object v0, p0, Lcom/k2fsa/sherpa/onnx/OfflineTts;->config:Lcom/k2fsa/sherpa/onnx/OfflineTtsConfig;

    invoke-direct {p0, p1, v0}, Lcom/k2fsa/sherpa/onnx/OfflineTts;->newFromAsset(Landroid/content/res/AssetManager;Lcom/k2fsa/sherpa/onnx/OfflineTtsConfig;)J

    move-result-wide v0

    goto :goto_0

    .line 205
    :cond_0
    iget-object v0, p0, Lcom/k2fsa/sherpa/onnx/OfflineTts;->config:Lcom/k2fsa/sherpa/onnx/OfflineTtsConfig;

    invoke-direct {p0, v0}, Lcom/k2fsa/sherpa/onnx/OfflineTts;->newFromFile(Lcom/k2fsa/sherpa/onnx/OfflineTtsConfig;)J

    move-result-wide v0

    .line 202
    :goto_0
    iput-wide v0, p0, Lcom/k2fsa/sherpa/onnx/OfflineTts;->ptr:J

    .line 207
    iget-wide v0, p0, Lcom/k2fsa/sherpa/onnx/OfflineTts;->ptr:J

    cmp-long v0, v0, v2

    if-eqz v0, :cond_1

    const/4 v0, 0x1

    goto :goto_1

    :cond_1
    const/4 v0, 0x0

    :goto_1
    if-eqz v0, :cond_2

    goto :goto_2

    :cond_2
    const/4 v0, 0x0

    .line 208
    .local v0, "$i$a$-require-OfflineTts$allocate$1":I
    nop

    .line 207
    .end local v0    # "$i$a$-require-OfflineTts$allocate$1":I
    new-instance v0, Ljava/lang/IllegalArgumentException;

    const-string v1, "Invalid OfflineTtsConfig: failed to create native OfflineTts"

    invoke-virtual {v1}, Ljava/lang/Object;->toString()Ljava/lang/String;

    move-result-object v1

    invoke-direct {v0, v1}, Ljava/lang/IllegalArgumentException;-><init>(Ljava/lang/String;)V

    throw v0

    .line 211
    :cond_3
    :goto_2
    return-void
.end method

.method protected final finalize()V
    .locals 4

    .line 221
    iget-wide v0, p0, Lcom/k2fsa/sherpa/onnx/OfflineTts;->ptr:J

    const-wide/16 v2, 0x0

    cmp-long v0, v0, v2

    if-eqz v0, :cond_0

    .line 222
    iget-wide v0, p0, Lcom/k2fsa/sherpa/onnx/OfflineTts;->ptr:J

    invoke-direct {p0, v0, v1}, Lcom/k2fsa/sherpa/onnx/OfflineTts;->delete(J)V

    .line 223
    iput-wide v2, p0, Lcom/k2fsa/sherpa/onnx/OfflineTts;->ptr:J

    .line 225
    :cond_0
    return-void
.end method

.method public final free()V
    .locals 4

    .line 214
    iget-wide v0, p0, Lcom/k2fsa/sherpa/onnx/OfflineTts;->ptr:J

    const-wide/16 v2, 0x0

    cmp-long v0, v0, v2

    if-eqz v0, :cond_0

    .line 215
    iget-wide v0, p0, Lcom/k2fsa/sherpa/onnx/OfflineTts;->ptr:J

    invoke-direct {p0, v0, v1}, Lcom/k2fsa/sherpa/onnx/OfflineTts;->delete(J)V

    .line 216
    iput-wide v2, p0, Lcom/k2fsa/sherpa/onnx/OfflineTts;->ptr:J

    .line 218
    :cond_0
    return-void
.end method

.method public final generate(Ljava/lang/String;IF)Lcom/k2fsa/sherpa/onnx/GeneratedAudio;
    .locals 7
    .param p1, "text"    # Ljava/lang/String;
    .param p2, "sid"    # I
    .param p3, "speed"    # F

    const-string v0, "text"

    invoke-static {p1, v0}, Lkotlin/jvm/internal/Intrinsics;->checkNotNullParameter(Ljava/lang/Object;Ljava/lang/String;)V

    .line 167
    iget-wide v2, p0, Lcom/k2fsa/sherpa/onnx/OfflineTts;->ptr:J

    move-object v1, p0

    move-object v4, p1

    move v5, p2

    move v6, p3

    invoke-direct/range {v1 .. v6}, Lcom/k2fsa/sherpa/onnx/OfflineTts;->generateImpl(JLjava/lang/String;IF)Lcom/k2fsa/sherpa/onnx/GeneratedAudio;

    move-result-object v0

    return-object v0
.end method

.method public final generateWithCallback(Ljava/lang/String;IFLkotlin/jvm/functions/Function1;)Lcom/k2fsa/sherpa/onnx/GeneratedAudio;
    .locals 8
    .param p1, "text"    # Ljava/lang/String;
    .param p2, "sid"    # I
    .param p3, "speed"    # F
    .param p4, "callback"    # Lkotlin/jvm/functions/Function1;
    .annotation system Ldalvik/annotation/Signature;
        value = {
            "(",
            "Ljava/lang/String;",
            "IF",
            "Lkotlin/jvm/functions/Function1<",
            "-[F",
            "Ljava/lang/Integer;",
            ">;)",
            "Lcom/k2fsa/sherpa/onnx/GeneratedAudio;"
        }
    .end annotation

    const-string v0, "text"

    invoke-static {p1, v0}, Lkotlin/jvm/internal/Intrinsics;->checkNotNullParameter(Ljava/lang/Object;Ljava/lang/String;)V

    const-string v0, "callback"

    invoke-static {p4, v0}, Lkotlin/jvm/internal/Intrinsics;->checkNotNullParameter(Ljava/lang/Object;Ljava/lang/String;)V

    .line 176
    nop

    .line 177
    iget-wide v2, p0, Lcom/k2fsa/sherpa/onnx/OfflineTts;->ptr:J

    .line 178
    nop

    .line 179
    nop

    .line 180
    nop

    .line 181
    nop

    .line 176
    move-object v1, p0

    move-object v4, p1

    move v5, p2

    move v6, p3

    move-object v7, p4

    invoke-direct/range {v1 .. v7}, Lcom/k2fsa/sherpa/onnx/OfflineTts;->generateWithCallbackImpl(JLjava/lang/String;IFLkotlin/jvm/functions/Function1;)Lcom/k2fsa/sherpa/onnx/GeneratedAudio;

    move-result-object v0

    return-object v0
.end method

.method public final generateWithConfig(Ljava/lang/String;Lcom/k2fsa/sherpa/onnx/GenerationConfig;)Lcom/k2fsa/sherpa/onnx/GeneratedAudio;
    .locals 7
    .param p1, "text"    # Ljava/lang/String;
    .param p2, "config"    # Lcom/k2fsa/sherpa/onnx/GenerationConfig;

    const-string v0, "text"

    invoke-static {p1, v0}, Lkotlin/jvm/internal/Intrinsics;->checkNotNullParameter(Ljava/lang/Object;Ljava/lang/String;)V

    const-string v0, "config"

    invoke-static {p2, v0}, Lkotlin/jvm/internal/Intrinsics;->checkNotNullParameter(Ljava/lang/Object;Ljava/lang/String;)V

    .line 189
    iget-wide v2, p0, Lcom/k2fsa/sherpa/onnx/OfflineTts;->ptr:J

    const/4 v6, 0x0

    move-object v1, p0

    move-object v4, p1

    move-object v5, p2

    invoke-direct/range {v1 .. v6}, Lcom/k2fsa/sherpa/onnx/OfflineTts;->generateWithConfigImpl(JLjava/lang/String;Lcom/k2fsa/sherpa/onnx/GenerationConfig;Lkotlin/jvm/functions/Function1;)Lcom/k2fsa/sherpa/onnx/GeneratedAudio;

    move-result-object v0

    return-object v0
.end method

.method public final generateWithConfigAndCallback(Ljava/lang/String;Lcom/k2fsa/sherpa/onnx/GenerationConfig;Lkotlin/jvm/functions/Function1;)Lcom/k2fsa/sherpa/onnx/GeneratedAudio;
    .locals 7
    .param p1, "text"    # Ljava/lang/String;
    .param p2, "config"    # Lcom/k2fsa/sherpa/onnx/GenerationConfig;
    .param p3, "callback"    # Lkotlin/jvm/functions/Function1;
    .annotation system Ldalvik/annotation/Signature;
        value = {
            "(",
            "Ljava/lang/String;",
            "Lcom/k2fsa/sherpa/onnx/GenerationConfig;",
            "Lkotlin/jvm/functions/Function1<",
            "-[F",
            "Ljava/lang/Integer;",
            ">;)",
            "Lcom/k2fsa/sherpa/onnx/GeneratedAudio;"
        }
    .end annotation

    const-string v0, "text"

    invoke-static {p1, v0}, Lkotlin/jvm/internal/Intrinsics;->checkNotNullParameter(Ljava/lang/Object;Ljava/lang/String;)V

    const-string v0, "config"

    invoke-static {p2, v0}, Lkotlin/jvm/internal/Intrinsics;->checkNotNullParameter(Ljava/lang/Object;Ljava/lang/String;)V

    const-string v0, "callback"

    invoke-static {p3, v0}, Lkotlin/jvm/internal/Intrinsics;->checkNotNullParameter(Ljava/lang/Object;Ljava/lang/String;)V

    .line 197
    iget-wide v2, p0, Lcom/k2fsa/sherpa/onnx/OfflineTts;->ptr:J

    move-object v1, p0

    move-object v4, p1

    move-object v5, p2

    move-object v6, p3

    invoke-direct/range {v1 .. v6}, Lcom/k2fsa/sherpa/onnx/OfflineTts;->generateWithConfigImpl(JLjava/lang/String;Lcom/k2fsa/sherpa/onnx/GenerationConfig;Lkotlin/jvm/functions/Function1;)Lcom/k2fsa/sherpa/onnx/GeneratedAudio;

    move-result-object v0

    return-object v0
.end method

.method public final getConfig()Lcom/k2fsa/sherpa/onnx/OfflineTtsConfig;
    .locals 1

    .line 143
    iget-object v0, p0, Lcom/k2fsa/sherpa/onnx/OfflineTts;->config:Lcom/k2fsa/sherpa/onnx/OfflineTtsConfig;

    return-object v0
.end method

.method public final numSpeakers()I
    .locals 2

    .line 160
    iget-wide v0, p0, Lcom/k2fsa/sherpa/onnx/OfflineTts;->ptr:J

    invoke-direct {p0, v0, v1}, Lcom/k2fsa/sherpa/onnx/OfflineTts;->getNumSpeakers(J)I

    move-result v0

    return v0
.end method

.method public final release()V
    .locals 0

    .line 227
    invoke-virtual {p0}, Lcom/k2fsa/sherpa/onnx/OfflineTts;->finalize()V

    return-void
.end method

.method public final sampleRate()I
    .locals 2

    .line 158
    iget-wide v0, p0, Lcom/k2fsa/sherpa/onnx/OfflineTts;->ptr:J

    invoke-direct {p0, v0, v1}, Lcom/k2fsa/sherpa/onnx/OfflineTts;->getSampleRate(J)I

    move-result v0

    return v0
.end method

.method public final setConfig(Lcom/k2fsa/sherpa/onnx/OfflineTtsConfig;)V
    .locals 1
    .param p1, "<set-?>"    # Lcom/k2fsa/sherpa/onnx/OfflineTtsConfig;

    const-string v0, "<set-?>"

    invoke-static {p1, v0}, Lkotlin/jvm/internal/Intrinsics;->checkNotNullParameter(Ljava/lang/Object;Ljava/lang/String;)V

    .line 143
    iput-object p1, p0, Lcom/k2fsa/sherpa/onnx/OfflineTts;->config:Lcom/k2fsa/sherpa/onnx/OfflineTtsConfig;

    return-void
.end method
