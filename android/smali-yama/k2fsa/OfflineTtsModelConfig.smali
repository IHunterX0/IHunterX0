.class public final Lcom/k2fsa/sherpa/onnx/OfflineTtsModelConfig;
.super Ljava/lang/Object;
.source "Tts.kt"


# annotations
.annotation runtime Lkotlin/Metadata;
    d1 = {
        "\u0000H\n\u0002\u0018\u0002\n\u0002\u0010\u0000\n\u0000\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0000\n\u0002\u0010\u0008\n\u0000\n\u0002\u0010\u000b\n\u0000\n\u0002\u0010\u000e\n\u0002\u00089\u0008\u0086\u0008\u0018\u00002\u00020\u0001Bi\u0012\u0008\u0008\u0002\u0010\u0002\u001a\u00020\u0003\u0012\u0008\u0008\u0002\u0010\u0004\u001a\u00020\u0005\u0012\u0008\u0008\u0002\u0010\u0006\u001a\u00020\u0007\u0012\u0008\u0008\u0002\u0010\u0008\u001a\u00020\t\u0012\u0008\u0008\u0002\u0010\n\u001a\u00020\u000b\u0012\u0008\u0008\u0002\u0010\u000c\u001a\u00020\r\u0012\u0008\u0008\u0002\u0010\u000e\u001a\u00020\u000f\u0012\u0008\u0008\u0002\u0010\u0010\u001a\u00020\u0011\u0012\u0008\u0008\u0002\u0010\u0012\u001a\u00020\u0013\u0012\u0008\u0008\u0002\u0010\u0014\u001a\u00020\u0015\u00a2\u0006\u0002\u0010\u0016J\t\u0010?\u001a\u00020\u0003H\u00c6\u0003J\t\u0010@\u001a\u00020\u0015H\u00c6\u0003J\t\u0010A\u001a\u00020\u0005H\u00c6\u0003J\t\u0010B\u001a\u00020\u0007H\u00c6\u0003J\t\u0010C\u001a\u00020\tH\u00c6\u0003J\t\u0010D\u001a\u00020\u000bH\u00c6\u0003J\t\u0010E\u001a\u00020\rH\u00c6\u0003J\t\u0010F\u001a\u00020\u000fH\u00c6\u0003J\t\u0010G\u001a\u00020\u0011H\u00c6\u0003J\t\u0010H\u001a\u00020\u0013H\u00c6\u0003Jm\u0010I\u001a\u00020\u00002\u0008\u0008\u0002\u0010\u0002\u001a\u00020\u00032\u0008\u0008\u0002\u0010\u0004\u001a\u00020\u00052\u0008\u0008\u0002\u0010\u0006\u001a\u00020\u00072\u0008\u0008\u0002\u0010\u0008\u001a\u00020\t2\u0008\u0008\u0002\u0010\n\u001a\u00020\u000b2\u0008\u0008\u0002\u0010\u000c\u001a\u00020\r2\u0008\u0008\u0002\u0010\u000e\u001a\u00020\u000f2\u0008\u0008\u0002\u0010\u0010\u001a\u00020\u00112\u0008\u0008\u0002\u0010\u0012\u001a\u00020\u00132\u0008\u0008\u0002\u0010\u0014\u001a\u00020\u0015H\u00c6\u0001J\u0013\u0010J\u001a\u00020\u00132\u0008\u0010K\u001a\u0004\u0018\u00010\u0001H\u00d6\u0003J\t\u0010L\u001a\u00020\u0011H\u00d6\u0001J\t\u0010M\u001a\u00020\u0015H\u00d6\u0001R\u001a\u0010\u0012\u001a\u00020\u0013X\u0086\u000e\u00a2\u0006\u000e\n\u0000\u001a\u0004\u0008\u0017\u0010\u0018\"\u0004\u0008\u0019\u0010\u001aR\u001a\u0010\n\u001a\u00020\u000bX\u0086\u000e\u00a2\u0006\u000e\n\u0000\u001a\u0004\u0008\u001b\u0010\u001c\"\u0004\u0008\u001d\u0010\u001eR\u001a\u0010\u0006\u001a\u00020\u0007X\u0086\u000e\u00a2\u0006\u000e\n\u0000\u001a\u0004\u0008\u001f\u0010 \"\u0004\u0008!\u0010\"R\u001a\u0010\u0004\u001a\u00020\u0005X\u0086\u000e\u00a2\u0006\u000e\n\u0000\u001a\u0004\u0008#\u0010$\"\u0004\u0008%\u0010&R\u001a\u0010\u0010\u001a\u00020\u0011X\u0086\u000e\u00a2\u0006\u000e\n\u0000\u001a\u0004\u0008\'\u0010(\"\u0004\u0008)\u0010*R\u001a\u0010\u000c\u001a\u00020\rX\u0086\u000e\u00a2\u0006\u000e\n\u0000\u001a\u0004\u0008+\u0010,\"\u0004\u0008-\u0010.R\u001a\u0010\u0014\u001a\u00020\u0015X\u0086\u000e\u00a2\u0006\u000e\n\u0000\u001a\u0004\u0008/\u00100\"\u0004\u00081\u00102R\u001a\u0010\u000e\u001a\u00020\u000fX\u0086\u000e\u00a2\u0006\u000e\n\u0000\u001a\u0004\u00083\u00104\"\u0004\u00085\u00106R\u001a\u0010\u0002\u001a\u00020\u0003X\u0086\u000e\u00a2\u0006\u000e\n\u0000\u001a\u0004\u00087\u00108\"\u0004\u00089\u0010:R\u001a\u0010\u0008\u001a\u00020\tX\u0086\u000e\u00a2\u0006\u000e\n\u0000\u001a\u0004\u0008;\u0010<\"\u0004\u0008=\u0010>\u00a8\u0006N"
    }
    d2 = {
        "Lcom/k2fsa/sherpa/onnx/OfflineTtsModelConfig;",
        "",
        "vits",
        "Lcom/k2fsa/sherpa/onnx/OfflineTtsVitsModelConfig;",
        "matcha",
        "Lcom/k2fsa/sherpa/onnx/OfflineTtsMatchaModelConfig;",
        "kokoro",
        "Lcom/k2fsa/sherpa/onnx/OfflineTtsKokoroModelConfig;",
        "zipvoice",
        "Lcom/k2fsa/sherpa/onnx/OfflineTtsZipVoiceModelConfig;",
        "kitten",
        "Lcom/k2fsa/sherpa/onnx/OfflineTtsKittenModelConfig;",
        "pocket",
        "Lcom/k2fsa/sherpa/onnx/OfflineTtsPocketModelConfig;",
        "supertonic",
        "Lcom/k2fsa/sherpa/onnx/OfflineTtsSupertonicModelConfig;",
        "numThreads",
        "",
        "debug",
        "",
        "provider",
        "",
        "(Lcom/k2fsa/sherpa/onnx/OfflineTtsVitsModelConfig;Lcom/k2fsa/sherpa/onnx/OfflineTtsMatchaModelConfig;Lcom/k2fsa/sherpa/onnx/OfflineTtsKokoroModelConfig;Lcom/k2fsa/sherpa/onnx/OfflineTtsZipVoiceModelConfig;Lcom/k2fsa/sherpa/onnx/OfflineTtsKittenModelConfig;Lcom/k2fsa/sherpa/onnx/OfflineTtsPocketModelConfig;Lcom/k2fsa/sherpa/onnx/OfflineTtsSupertonicModelConfig;IZLjava/lang/String;)V",
        "getDebug",
        "()Z",
        "setDebug",
        "(Z)V",
        "getKitten",
        "()Lcom/k2fsa/sherpa/onnx/OfflineTtsKittenModelConfig;",
        "setKitten",
        "(Lcom/k2fsa/sherpa/onnx/OfflineTtsKittenModelConfig;)V",
        "getKokoro",
        "()Lcom/k2fsa/sherpa/onnx/OfflineTtsKokoroModelConfig;",
        "setKokoro",
        "(Lcom/k2fsa/sherpa/onnx/OfflineTtsKokoroModelConfig;)V",
        "getMatcha",
        "()Lcom/k2fsa/sherpa/onnx/OfflineTtsMatchaModelConfig;",
        "setMatcha",
        "(Lcom/k2fsa/sherpa/onnx/OfflineTtsMatchaModelConfig;)V",
        "getNumThreads",
        "()I",
        "setNumThreads",
        "(I)V",
        "getPocket",
        "()Lcom/k2fsa/sherpa/onnx/OfflineTtsPocketModelConfig;",
        "setPocket",
        "(Lcom/k2fsa/sherpa/onnx/OfflineTtsPocketModelConfig;)V",
        "getProvider",
        "()Ljava/lang/String;",
        "setProvider",
        "(Ljava/lang/String;)V",
        "getSupertonic",
        "()Lcom/k2fsa/sherpa/onnx/OfflineTtsSupertonicModelConfig;",
        "setSupertonic",
        "(Lcom/k2fsa/sherpa/onnx/OfflineTtsSupertonicModelConfig;)V",
        "getVits",
        "()Lcom/k2fsa/sherpa/onnx/OfflineTtsVitsModelConfig;",
        "setVits",
        "(Lcom/k2fsa/sherpa/onnx/OfflineTtsVitsModelConfig;)V",
        "getZipvoice",
        "()Lcom/k2fsa/sherpa/onnx/OfflineTtsZipVoiceModelConfig;",
        "setZipvoice",
        "(Lcom/k2fsa/sherpa/onnx/OfflineTtsZipVoiceModelConfig;)V",
        "component1",
        "component10",
        "component2",
        "component3",
        "component4",
        "component5",
        "component6",
        "component7",
        "component8",
        "component9",
        "copy",
        "equals",
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
.field private debug:Z

.field private kitten:Lcom/k2fsa/sherpa/onnx/OfflineTtsKittenModelConfig;

.field private kokoro:Lcom/k2fsa/sherpa/onnx/OfflineTtsKokoroModelConfig;

.field private matcha:Lcom/k2fsa/sherpa/onnx/OfflineTtsMatchaModelConfig;

.field private numThreads:I

.field private pocket:Lcom/k2fsa/sherpa/onnx/OfflineTtsPocketModelConfig;

.field private provider:Ljava/lang/String;

.field private supertonic:Lcom/k2fsa/sherpa/onnx/OfflineTtsSupertonicModelConfig;

.field private vits:Lcom/k2fsa/sherpa/onnx/OfflineTtsVitsModelConfig;

.field private zipvoice:Lcom/k2fsa/sherpa/onnx/OfflineTtsZipVoiceModelConfig;


# direct methods
.method public constructor <init>()V
    .locals 13

    const/16 v11, 0x3ff

    const/4 v12, 0x0

    const/4 v1, 0x0

    const/4 v2, 0x0

    const/4 v3, 0x0

    const/4 v4, 0x0

    const/4 v5, 0x0

    const/4 v6, 0x0

    const/4 v7, 0x0

    const/4 v8, 0x0

    const/4 v9, 0x0

    const/4 v10, 0x0

    move-object v0, p0

    invoke-direct/range {v0 .. v12}, Lcom/k2fsa/sherpa/onnx/OfflineTtsModelConfig;-><init>(Lcom/k2fsa/sherpa/onnx/OfflineTtsVitsModelConfig;Lcom/k2fsa/sherpa/onnx/OfflineTtsMatchaModelConfig;Lcom/k2fsa/sherpa/onnx/OfflineTtsKokoroModelConfig;Lcom/k2fsa/sherpa/onnx/OfflineTtsZipVoiceModelConfig;Lcom/k2fsa/sherpa/onnx/OfflineTtsKittenModelConfig;Lcom/k2fsa/sherpa/onnx/OfflineTtsPocketModelConfig;Lcom/k2fsa/sherpa/onnx/OfflineTtsSupertonicModelConfig;IZLjava/lang/String;ILkotlin/jvm/internal/DefaultConstructorMarker;)V

    return-void
.end method

.method public constructor <init>(Lcom/k2fsa/sherpa/onnx/OfflineTtsVitsModelConfig;Lcom/k2fsa/sherpa/onnx/OfflineTtsMatchaModelConfig;Lcom/k2fsa/sherpa/onnx/OfflineTtsKokoroModelConfig;Lcom/k2fsa/sherpa/onnx/OfflineTtsZipVoiceModelConfig;Lcom/k2fsa/sherpa/onnx/OfflineTtsKittenModelConfig;Lcom/k2fsa/sherpa/onnx/OfflineTtsPocketModelConfig;Lcom/k2fsa/sherpa/onnx/OfflineTtsSupertonicModelConfig;IZLjava/lang/String;)V
    .locals 1
    .param p1, "vits"    # Lcom/k2fsa/sherpa/onnx/OfflineTtsVitsModelConfig;
    .param p2, "matcha"    # Lcom/k2fsa/sherpa/onnx/OfflineTtsMatchaModelConfig;
    .param p3, "kokoro"    # Lcom/k2fsa/sherpa/onnx/OfflineTtsKokoroModelConfig;
    .param p4, "zipvoice"    # Lcom/k2fsa/sherpa/onnx/OfflineTtsZipVoiceModelConfig;
    .param p5, "kitten"    # Lcom/k2fsa/sherpa/onnx/OfflineTtsKittenModelConfig;
    .param p6, "pocket"    # Lcom/k2fsa/sherpa/onnx/OfflineTtsPocketModelConfig;
    .param p7, "supertonic"    # Lcom/k2fsa/sherpa/onnx/OfflineTtsSupertonicModelConfig;
    .param p8, "numThreads"    # I
    .param p9, "debug"    # Z
    .param p10, "provider"    # Ljava/lang/String;

    const-string v0, "vits"

    invoke-static {p1, v0}, Lkotlin/jvm/internal/Intrinsics;->checkNotNullParameter(Ljava/lang/Object;Ljava/lang/String;)V

    const-string v0, "matcha"

    invoke-static {p2, v0}, Lkotlin/jvm/internal/Intrinsics;->checkNotNullParameter(Ljava/lang/Object;Ljava/lang/String;)V

    const-string v0, "kokoro"

    invoke-static {p3, v0}, Lkotlin/jvm/internal/Intrinsics;->checkNotNullParameter(Ljava/lang/Object;Ljava/lang/String;)V

    const-string v0, "zipvoice"

    invoke-static {p4, v0}, Lkotlin/jvm/internal/Intrinsics;->checkNotNullParameter(Ljava/lang/Object;Ljava/lang/String;)V

    const-string v0, "kitten"

    invoke-static {p5, v0}, Lkotlin/jvm/internal/Intrinsics;->checkNotNullParameter(Ljava/lang/Object;Ljava/lang/String;)V

    const-string v0, "pocket"

    invoke-static {p6, v0}, Lkotlin/jvm/internal/Intrinsics;->checkNotNullParameter(Ljava/lang/Object;Ljava/lang/String;)V

    const-string v0, "supertonic"

    invoke-static {p7, v0}, Lkotlin/jvm/internal/Intrinsics;->checkNotNullParameter(Ljava/lang/Object;Ljava/lang/String;)V

    const-string v0, "provider"

    invoke-static {p10, v0}, Lkotlin/jvm/internal/Intrinsics;->checkNotNullParameter(Ljava/lang/Object;Ljava/lang/String;)V

    .line 94
    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    .line 95
    iput-object p1, p0, Lcom/k2fsa/sherpa/onnx/OfflineTtsModelConfig;->vits:Lcom/k2fsa/sherpa/onnx/OfflineTtsVitsModelConfig;

    .line 96
    iput-object p2, p0, Lcom/k2fsa/sherpa/onnx/OfflineTtsModelConfig;->matcha:Lcom/k2fsa/sherpa/onnx/OfflineTtsMatchaModelConfig;

    .line 97
    iput-object p3, p0, Lcom/k2fsa/sherpa/onnx/OfflineTtsModelConfig;->kokoro:Lcom/k2fsa/sherpa/onnx/OfflineTtsKokoroModelConfig;

    .line 98
    iput-object p4, p0, Lcom/k2fsa/sherpa/onnx/OfflineTtsModelConfig;->zipvoice:Lcom/k2fsa/sherpa/onnx/OfflineTtsZipVoiceModelConfig;

    .line 99
    iput-object p5, p0, Lcom/k2fsa/sherpa/onnx/OfflineTtsModelConfig;->kitten:Lcom/k2fsa/sherpa/onnx/OfflineTtsKittenModelConfig;

    .line 100
    iput-object p6, p0, Lcom/k2fsa/sherpa/onnx/OfflineTtsModelConfig;->pocket:Lcom/k2fsa/sherpa/onnx/OfflineTtsPocketModelConfig;

    .line 101
    iput-object p7, p0, Lcom/k2fsa/sherpa/onnx/OfflineTtsModelConfig;->supertonic:Lcom/k2fsa/sherpa/onnx/OfflineTtsSupertonicModelConfig;

    .line 103
    iput p8, p0, Lcom/k2fsa/sherpa/onnx/OfflineTtsModelConfig;->numThreads:I

    .line 104
    iput-boolean p9, p0, Lcom/k2fsa/sherpa/onnx/OfflineTtsModelConfig;->debug:Z

    .line 105
    iput-object p10, p0, Lcom/k2fsa/sherpa/onnx/OfflineTtsModelConfig;->provider:Ljava/lang/String;

    .line 94
    return-void
.end method

.method public synthetic constructor <init>(Lcom/k2fsa/sherpa/onnx/OfflineTtsVitsModelConfig;Lcom/k2fsa/sherpa/onnx/OfflineTtsMatchaModelConfig;Lcom/k2fsa/sherpa/onnx/OfflineTtsKokoroModelConfig;Lcom/k2fsa/sherpa/onnx/OfflineTtsZipVoiceModelConfig;Lcom/k2fsa/sherpa/onnx/OfflineTtsKittenModelConfig;Lcom/k2fsa/sherpa/onnx/OfflineTtsPocketModelConfig;Lcom/k2fsa/sherpa/onnx/OfflineTtsSupertonicModelConfig;IZLjava/lang/String;ILkotlin/jvm/internal/DefaultConstructorMarker;)V
    .locals 18

    .line 94
    move/from16 v0, p11

    and-int/lit8 v1, v0, 0x1

    if-eqz v1, :cond_0

    .line 95
    new-instance v1, Lcom/k2fsa/sherpa/onnx/OfflineTtsVitsModelConfig;

    const/16 v11, 0xff

    const/4 v12, 0x0

    const/4 v3, 0x0

    const/4 v4, 0x0

    const/4 v5, 0x0

    const/4 v6, 0x0

    const/4 v7, 0x0

    const/4 v8, 0x0

    const/4 v9, 0x0

    const/4 v10, 0x0

    move-object v2, v1

    invoke-direct/range {v2 .. v12}, Lcom/k2fsa/sherpa/onnx/OfflineTtsVitsModelConfig;-><init>(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;FFFILkotlin/jvm/internal/DefaultConstructorMarker;)V

    goto :goto_0

    .line 94
    :cond_0
    move-object/from16 v1, p1

    :goto_0
    and-int/lit8 v2, v0, 0x2

    if-eqz v2, :cond_1

    .line 96
    new-instance v2, Lcom/k2fsa/sherpa/onnx/OfflineTtsMatchaModelConfig;

    const/16 v12, 0xff

    const/4 v13, 0x0

    const/4 v4, 0x0

    const/4 v5, 0x0

    const/4 v6, 0x0

    const/4 v7, 0x0

    const/4 v8, 0x0

    const/4 v9, 0x0

    const/4 v10, 0x0

    const/4 v11, 0x0

    move-object v3, v2

    invoke-direct/range {v3 .. v13}, Lcom/k2fsa/sherpa/onnx/OfflineTtsMatchaModelConfig;-><init>(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;FFILkotlin/jvm/internal/DefaultConstructorMarker;)V

    goto :goto_1

    .line 94
    :cond_1
    move-object/from16 v2, p2

    :goto_1
    and-int/lit8 v3, v0, 0x4

    if-eqz v3, :cond_2

    .line 97
    new-instance v3, Lcom/k2fsa/sherpa/onnx/OfflineTtsKokoroModelConfig;

    const/16 v13, 0xff

    const/4 v14, 0x0

    const/4 v5, 0x0

    const/4 v6, 0x0

    const/4 v7, 0x0

    const/4 v8, 0x0

    const/4 v9, 0x0

    const/4 v10, 0x0

    const/4 v11, 0x0

    const/4 v12, 0x0

    move-object v4, v3

    invoke-direct/range {v4 .. v14}, Lcom/k2fsa/sherpa/onnx/OfflineTtsKokoroModelConfig;-><init>(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;FILkotlin/jvm/internal/DefaultConstructorMarker;)V

    goto :goto_2

    .line 94
    :cond_2
    move-object/from16 v3, p3

    :goto_2
    and-int/lit8 v4, v0, 0x8

    if-eqz v4, :cond_3

    .line 98
    new-instance v4, Lcom/k2fsa/sherpa/onnx/OfflineTtsZipVoiceModelConfig;

    const/16 v16, 0x3ff

    const/16 v17, 0x0

    const/4 v6, 0x0

    const/4 v7, 0x0

    const/4 v8, 0x0

    const/4 v9, 0x0

    const/4 v10, 0x0

    const/4 v11, 0x0

    const/4 v12, 0x0

    const/4 v13, 0x0

    const/4 v14, 0x0

    const/4 v15, 0x0

    move-object v5, v4

    invoke-direct/range {v5 .. v17}, Lcom/k2fsa/sherpa/onnx/OfflineTtsZipVoiceModelConfig;-><init>(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;FFFFILkotlin/jvm/internal/DefaultConstructorMarker;)V

    goto :goto_3

    .line 94
    :cond_3
    move-object/from16 v4, p4

    :goto_3
    and-int/lit8 v5, v0, 0x10

    if-eqz v5, :cond_4

    .line 99
    new-instance v5, Lcom/k2fsa/sherpa/onnx/OfflineTtsKittenModelConfig;

    const/16 v12, 0x1f

    const/4 v13, 0x0

    const/4 v7, 0x0

    const/4 v8, 0x0

    const/4 v9, 0x0

    const/4 v10, 0x0

    const/4 v11, 0x0

    move-object v6, v5

    invoke-direct/range {v6 .. v13}, Lcom/k2fsa/sherpa/onnx/OfflineTtsKittenModelConfig;-><init>(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;FILkotlin/jvm/internal/DefaultConstructorMarker;)V

    goto :goto_4

    .line 94
    :cond_4
    move-object/from16 v5, p5

    :goto_4
    and-int/lit8 v6, v0, 0x20

    if-eqz v6, :cond_5

    .line 100
    new-instance v6, Lcom/k2fsa/sherpa/onnx/OfflineTtsPocketModelConfig;

    const/16 v16, 0xff

    const/16 v17, 0x0

    const/4 v8, 0x0

    const/4 v9, 0x0

    const/4 v10, 0x0

    const/4 v11, 0x0

    const/4 v12, 0x0

    const/4 v13, 0x0

    const/4 v14, 0x0

    const/4 v15, 0x0

    move-object v7, v6

    invoke-direct/range {v7 .. v17}, Lcom/k2fsa/sherpa/onnx/OfflineTtsPocketModelConfig;-><init>(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;IILkotlin/jvm/internal/DefaultConstructorMarker;)V

    goto :goto_5

    .line 94
    :cond_5
    move-object/from16 v6, p6

    :goto_5
    and-int/lit8 v7, v0, 0x40

    if-eqz v7, :cond_6

    .line 101
    new-instance v7, Lcom/k2fsa/sherpa/onnx/OfflineTtsSupertonicModelConfig;

    const/16 v16, 0x7f

    const/16 v17, 0x0

    const/4 v9, 0x0

    const/4 v10, 0x0

    const/4 v11, 0x0

    const/4 v12, 0x0

    const/4 v13, 0x0

    const/4 v14, 0x0

    const/4 v15, 0x0

    move-object v8, v7

    invoke-direct/range {v8 .. v17}, Lcom/k2fsa/sherpa/onnx/OfflineTtsSupertonicModelConfig;-><init>(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;ILkotlin/jvm/internal/DefaultConstructorMarker;)V

    goto :goto_6

    .line 94
    :cond_6
    move-object/from16 v7, p7

    :goto_6
    and-int/lit16 v8, v0, 0x80

    if-eqz v8, :cond_7

    .line 103
    const/4 v8, 0x1

    goto :goto_7

    .line 94
    :cond_7
    move/from16 v8, p8

    :goto_7
    and-int/lit16 v9, v0, 0x100

    if-eqz v9, :cond_8

    .line 104
    const/4 v9, 0x0

    goto :goto_8

    .line 94
    :cond_8
    move/from16 v9, p9

    :goto_8
    and-int/lit16 v0, v0, 0x200

    if-eqz v0, :cond_9

    .line 105
    const-string v0, "cpu"

    goto :goto_9

    .line 94
    :cond_9
    move-object/from16 v0, p10

    :goto_9
    move-object/from16 p1, p0

    move-object/from16 p2, v1

    move-object/from16 p3, v2

    move-object/from16 p4, v3

    move-object/from16 p5, v4

    move-object/from16 p6, v5

    move-object/from16 p7, v6

    move-object/from16 p8, v7

    move/from16 p9, v8

    move/from16 p10, v9

    move-object/from16 p11, v0

    invoke-direct/range {p1 .. p11}, Lcom/k2fsa/sherpa/onnx/OfflineTtsModelConfig;-><init>(Lcom/k2fsa/sherpa/onnx/OfflineTtsVitsModelConfig;Lcom/k2fsa/sherpa/onnx/OfflineTtsMatchaModelConfig;Lcom/k2fsa/sherpa/onnx/OfflineTtsKokoroModelConfig;Lcom/k2fsa/sherpa/onnx/OfflineTtsZipVoiceModelConfig;Lcom/k2fsa/sherpa/onnx/OfflineTtsKittenModelConfig;Lcom/k2fsa/sherpa/onnx/OfflineTtsPocketModelConfig;Lcom/k2fsa/sherpa/onnx/OfflineTtsSupertonicModelConfig;IZLjava/lang/String;)V

    .line 106
    return-void
.end method

.method public static synthetic copy$default(Lcom/k2fsa/sherpa/onnx/OfflineTtsModelConfig;Lcom/k2fsa/sherpa/onnx/OfflineTtsVitsModelConfig;Lcom/k2fsa/sherpa/onnx/OfflineTtsMatchaModelConfig;Lcom/k2fsa/sherpa/onnx/OfflineTtsKokoroModelConfig;Lcom/k2fsa/sherpa/onnx/OfflineTtsZipVoiceModelConfig;Lcom/k2fsa/sherpa/onnx/OfflineTtsKittenModelConfig;Lcom/k2fsa/sherpa/onnx/OfflineTtsPocketModelConfig;Lcom/k2fsa/sherpa/onnx/OfflineTtsSupertonicModelConfig;IZLjava/lang/String;ILjava/lang/Object;)Lcom/k2fsa/sherpa/onnx/OfflineTtsModelConfig;
    .locals 11

    move-object v0, p0

    move/from16 v1, p11

    and-int/lit8 v2, v1, 0x1

    if-eqz v2, :cond_0

    iget-object v2, v0, Lcom/k2fsa/sherpa/onnx/OfflineTtsModelConfig;->vits:Lcom/k2fsa/sherpa/onnx/OfflineTtsVitsModelConfig;

    goto :goto_0

    :cond_0
    move-object v2, p1

    :goto_0
    and-int/lit8 v3, v1, 0x2

    if-eqz v3, :cond_1

    iget-object v3, v0, Lcom/k2fsa/sherpa/onnx/OfflineTtsModelConfig;->matcha:Lcom/k2fsa/sherpa/onnx/OfflineTtsMatchaModelConfig;

    goto :goto_1

    :cond_1
    move-object v3, p2

    :goto_1
    and-int/lit8 v4, v1, 0x4

    if-eqz v4, :cond_2

    iget-object v4, v0, Lcom/k2fsa/sherpa/onnx/OfflineTtsModelConfig;->kokoro:Lcom/k2fsa/sherpa/onnx/OfflineTtsKokoroModelConfig;

    goto :goto_2

    :cond_2
    move-object v4, p3

    :goto_2
    and-int/lit8 v5, v1, 0x8

    if-eqz v5, :cond_3

    iget-object v5, v0, Lcom/k2fsa/sherpa/onnx/OfflineTtsModelConfig;->zipvoice:Lcom/k2fsa/sherpa/onnx/OfflineTtsZipVoiceModelConfig;

    goto :goto_3

    :cond_3
    move-object v5, p4

    :goto_3
    and-int/lit8 v6, v1, 0x10

    if-eqz v6, :cond_4

    iget-object v6, v0, Lcom/k2fsa/sherpa/onnx/OfflineTtsModelConfig;->kitten:Lcom/k2fsa/sherpa/onnx/OfflineTtsKittenModelConfig;

    goto :goto_4

    :cond_4
    move-object/from16 v6, p5

    :goto_4
    and-int/lit8 v7, v1, 0x20

    if-eqz v7, :cond_5

    iget-object v7, v0, Lcom/k2fsa/sherpa/onnx/OfflineTtsModelConfig;->pocket:Lcom/k2fsa/sherpa/onnx/OfflineTtsPocketModelConfig;

    goto :goto_5

    :cond_5
    move-object/from16 v7, p6

    :goto_5
    and-int/lit8 v8, v1, 0x40

    if-eqz v8, :cond_6

    iget-object v8, v0, Lcom/k2fsa/sherpa/onnx/OfflineTtsModelConfig;->supertonic:Lcom/k2fsa/sherpa/onnx/OfflineTtsSupertonicModelConfig;

    goto :goto_6

    :cond_6
    move-object/from16 v8, p7

    :goto_6
    and-int/lit16 v9, v1, 0x80

    if-eqz v9, :cond_7

    iget v9, v0, Lcom/k2fsa/sherpa/onnx/OfflineTtsModelConfig;->numThreads:I

    goto :goto_7

    :cond_7
    move/from16 v9, p8

    :goto_7
    and-int/lit16 v10, v1, 0x100

    if-eqz v10, :cond_8

    iget-boolean v10, v0, Lcom/k2fsa/sherpa/onnx/OfflineTtsModelConfig;->debug:Z

    goto :goto_8

    :cond_8
    move/from16 v10, p9

    :goto_8
    and-int/lit16 v1, v1, 0x200

    if-eqz v1, :cond_9

    iget-object v1, v0, Lcom/k2fsa/sherpa/onnx/OfflineTtsModelConfig;->provider:Ljava/lang/String;

    goto :goto_9

    :cond_9
    move-object/from16 v1, p10

    :goto_9
    move-object p1, v2

    move-object p2, v3

    move-object p3, v4

    move-object p4, v5

    move-object/from16 p5, v6

    move-object/from16 p6, v7

    move-object/from16 p7, v8

    move/from16 p8, v9

    move/from16 p9, v10

    move-object/from16 p10, v1

    invoke-virtual/range {p0 .. p10}, Lcom/k2fsa/sherpa/onnx/OfflineTtsModelConfig;->copy(Lcom/k2fsa/sherpa/onnx/OfflineTtsVitsModelConfig;Lcom/k2fsa/sherpa/onnx/OfflineTtsMatchaModelConfig;Lcom/k2fsa/sherpa/onnx/OfflineTtsKokoroModelConfig;Lcom/k2fsa/sherpa/onnx/OfflineTtsZipVoiceModelConfig;Lcom/k2fsa/sherpa/onnx/OfflineTtsKittenModelConfig;Lcom/k2fsa/sherpa/onnx/OfflineTtsPocketModelConfig;Lcom/k2fsa/sherpa/onnx/OfflineTtsSupertonicModelConfig;IZLjava/lang/String;)Lcom/k2fsa/sherpa/onnx/OfflineTtsModelConfig;

    move-result-object v0

    return-object v0
.end method


# virtual methods
.method public final component1()Lcom/k2fsa/sherpa/onnx/OfflineTtsVitsModelConfig;
    .locals 1

    iget-object v0, p0, Lcom/k2fsa/sherpa/onnx/OfflineTtsModelConfig;->vits:Lcom/k2fsa/sherpa/onnx/OfflineTtsVitsModelConfig;

    return-object v0
.end method

.method public final component10()Ljava/lang/String;
    .locals 1

    iget-object v0, p0, Lcom/k2fsa/sherpa/onnx/OfflineTtsModelConfig;->provider:Ljava/lang/String;

    return-object v0
.end method

.method public final component2()Lcom/k2fsa/sherpa/onnx/OfflineTtsMatchaModelConfig;
    .locals 1

    iget-object v0, p0, Lcom/k2fsa/sherpa/onnx/OfflineTtsModelConfig;->matcha:Lcom/k2fsa/sherpa/onnx/OfflineTtsMatchaModelConfig;

    return-object v0
.end method

.method public final component3()Lcom/k2fsa/sherpa/onnx/OfflineTtsKokoroModelConfig;
    .locals 1

    iget-object v0, p0, Lcom/k2fsa/sherpa/onnx/OfflineTtsModelConfig;->kokoro:Lcom/k2fsa/sherpa/onnx/OfflineTtsKokoroModelConfig;

    return-object v0
.end method

.method public final component4()Lcom/k2fsa/sherpa/onnx/OfflineTtsZipVoiceModelConfig;
    .locals 1

    iget-object v0, p0, Lcom/k2fsa/sherpa/onnx/OfflineTtsModelConfig;->zipvoice:Lcom/k2fsa/sherpa/onnx/OfflineTtsZipVoiceModelConfig;

    return-object v0
.end method

.method public final component5()Lcom/k2fsa/sherpa/onnx/OfflineTtsKittenModelConfig;
    .locals 1

    iget-object v0, p0, Lcom/k2fsa/sherpa/onnx/OfflineTtsModelConfig;->kitten:Lcom/k2fsa/sherpa/onnx/OfflineTtsKittenModelConfig;

    return-object v0
.end method

.method public final component6()Lcom/k2fsa/sherpa/onnx/OfflineTtsPocketModelConfig;
    .locals 1

    iget-object v0, p0, Lcom/k2fsa/sherpa/onnx/OfflineTtsModelConfig;->pocket:Lcom/k2fsa/sherpa/onnx/OfflineTtsPocketModelConfig;

    return-object v0
.end method

.method public final component7()Lcom/k2fsa/sherpa/onnx/OfflineTtsSupertonicModelConfig;
    .locals 1

    iget-object v0, p0, Lcom/k2fsa/sherpa/onnx/OfflineTtsModelConfig;->supertonic:Lcom/k2fsa/sherpa/onnx/OfflineTtsSupertonicModelConfig;

    return-object v0
.end method

.method public final component8()I
    .locals 1

    iget v0, p0, Lcom/k2fsa/sherpa/onnx/OfflineTtsModelConfig;->numThreads:I

    return v0
.end method

.method public final component9()Z
    .locals 1

    iget-boolean v0, p0, Lcom/k2fsa/sherpa/onnx/OfflineTtsModelConfig;->debug:Z

    return v0
.end method

.method public final copy(Lcom/k2fsa/sherpa/onnx/OfflineTtsVitsModelConfig;Lcom/k2fsa/sherpa/onnx/OfflineTtsMatchaModelConfig;Lcom/k2fsa/sherpa/onnx/OfflineTtsKokoroModelConfig;Lcom/k2fsa/sherpa/onnx/OfflineTtsZipVoiceModelConfig;Lcom/k2fsa/sherpa/onnx/OfflineTtsKittenModelConfig;Lcom/k2fsa/sherpa/onnx/OfflineTtsPocketModelConfig;Lcom/k2fsa/sherpa/onnx/OfflineTtsSupertonicModelConfig;IZLjava/lang/String;)Lcom/k2fsa/sherpa/onnx/OfflineTtsModelConfig;
    .locals 16

    const-string v0, "vits"

    move-object/from16 v12, p1

    invoke-static {v12, v0}, Lkotlin/jvm/internal/Intrinsics;->checkNotNullParameter(Ljava/lang/Object;Ljava/lang/String;)V

    const-string v0, "matcha"

    move-object/from16 v13, p2

    invoke-static {v13, v0}, Lkotlin/jvm/internal/Intrinsics;->checkNotNullParameter(Ljava/lang/Object;Ljava/lang/String;)V

    const-string v0, "kokoro"

    move-object/from16 v14, p3

    invoke-static {v14, v0}, Lkotlin/jvm/internal/Intrinsics;->checkNotNullParameter(Ljava/lang/Object;Ljava/lang/String;)V

    const-string v0, "zipvoice"

    move-object/from16 v15, p4

    invoke-static {v15, v0}, Lkotlin/jvm/internal/Intrinsics;->checkNotNullParameter(Ljava/lang/Object;Ljava/lang/String;)V

    const-string v0, "kitten"

    move-object/from16 v11, p5

    invoke-static {v11, v0}, Lkotlin/jvm/internal/Intrinsics;->checkNotNullParameter(Ljava/lang/Object;Ljava/lang/String;)V

    const-string v0, "pocket"

    move-object/from16 v10, p6

    invoke-static {v10, v0}, Lkotlin/jvm/internal/Intrinsics;->checkNotNullParameter(Ljava/lang/Object;Ljava/lang/String;)V

    const-string v0, "supertonic"

    move-object/from16 v9, p7

    invoke-static {v9, v0}, Lkotlin/jvm/internal/Intrinsics;->checkNotNullParameter(Ljava/lang/Object;Ljava/lang/String;)V

    const-string v0, "provider"

    move-object/from16 v8, p10

    invoke-static {v8, v0}, Lkotlin/jvm/internal/Intrinsics;->checkNotNullParameter(Ljava/lang/Object;Ljava/lang/String;)V

    new-instance v0, Lcom/k2fsa/sherpa/onnx/OfflineTtsModelConfig;

    move-object v1, v0

    move-object/from16 v2, p1

    move-object/from16 v3, p2

    move-object/from16 v4, p3

    move-object/from16 v5, p4

    move-object/from16 v6, p5

    move-object/from16 v7, p6

    move-object/from16 v8, p7

    move/from16 v9, p8

    move/from16 v10, p9

    move-object/from16 v11, p10

    invoke-direct/range {v1 .. v11}, Lcom/k2fsa/sherpa/onnx/OfflineTtsModelConfig;-><init>(Lcom/k2fsa/sherpa/onnx/OfflineTtsVitsModelConfig;Lcom/k2fsa/sherpa/onnx/OfflineTtsMatchaModelConfig;Lcom/k2fsa/sherpa/onnx/OfflineTtsKokoroModelConfig;Lcom/k2fsa/sherpa/onnx/OfflineTtsZipVoiceModelConfig;Lcom/k2fsa/sherpa/onnx/OfflineTtsKittenModelConfig;Lcom/k2fsa/sherpa/onnx/OfflineTtsPocketModelConfig;Lcom/k2fsa/sherpa/onnx/OfflineTtsSupertonicModelConfig;IZLjava/lang/String;)V

    return-object v0
.end method

.method public equals(Ljava/lang/Object;)Z
    .locals 5

    const/4 v0, 0x1

    if-ne p0, p1, :cond_0

    return v0

    :cond_0
    instance-of v1, p1, Lcom/k2fsa/sherpa/onnx/OfflineTtsModelConfig;

    const/4 v2, 0x0

    if-nez v1, :cond_1

    return v2

    :cond_1
    move-object v1, p1

    check-cast v1, Lcom/k2fsa/sherpa/onnx/OfflineTtsModelConfig;

    iget-object v3, p0, Lcom/k2fsa/sherpa/onnx/OfflineTtsModelConfig;->vits:Lcom/k2fsa/sherpa/onnx/OfflineTtsVitsModelConfig;

    iget-object v4, v1, Lcom/k2fsa/sherpa/onnx/OfflineTtsModelConfig;->vits:Lcom/k2fsa/sherpa/onnx/OfflineTtsVitsModelConfig;

    invoke-static {v3, v4}, Lkotlin/jvm/internal/Intrinsics;->areEqual(Ljava/lang/Object;Ljava/lang/Object;)Z

    move-result v3

    if-nez v3, :cond_2

    return v2

    :cond_2
    iget-object v3, p0, Lcom/k2fsa/sherpa/onnx/OfflineTtsModelConfig;->matcha:Lcom/k2fsa/sherpa/onnx/OfflineTtsMatchaModelConfig;

    iget-object v4, v1, Lcom/k2fsa/sherpa/onnx/OfflineTtsModelConfig;->matcha:Lcom/k2fsa/sherpa/onnx/OfflineTtsMatchaModelConfig;

    invoke-static {v3, v4}, Lkotlin/jvm/internal/Intrinsics;->areEqual(Ljava/lang/Object;Ljava/lang/Object;)Z

    move-result v3

    if-nez v3, :cond_3

    return v2

    :cond_3
    iget-object v3, p0, Lcom/k2fsa/sherpa/onnx/OfflineTtsModelConfig;->kokoro:Lcom/k2fsa/sherpa/onnx/OfflineTtsKokoroModelConfig;

    iget-object v4, v1, Lcom/k2fsa/sherpa/onnx/OfflineTtsModelConfig;->kokoro:Lcom/k2fsa/sherpa/onnx/OfflineTtsKokoroModelConfig;

    invoke-static {v3, v4}, Lkotlin/jvm/internal/Intrinsics;->areEqual(Ljava/lang/Object;Ljava/lang/Object;)Z

    move-result v3

    if-nez v3, :cond_4

    return v2

    :cond_4
    iget-object v3, p0, Lcom/k2fsa/sherpa/onnx/OfflineTtsModelConfig;->zipvoice:Lcom/k2fsa/sherpa/onnx/OfflineTtsZipVoiceModelConfig;

    iget-object v4, v1, Lcom/k2fsa/sherpa/onnx/OfflineTtsModelConfig;->zipvoice:Lcom/k2fsa/sherpa/onnx/OfflineTtsZipVoiceModelConfig;

    invoke-static {v3, v4}, Lkotlin/jvm/internal/Intrinsics;->areEqual(Ljava/lang/Object;Ljava/lang/Object;)Z

    move-result v3

    if-nez v3, :cond_5

    return v2

    :cond_5
    iget-object v3, p0, Lcom/k2fsa/sherpa/onnx/OfflineTtsModelConfig;->kitten:Lcom/k2fsa/sherpa/onnx/OfflineTtsKittenModelConfig;

    iget-object v4, v1, Lcom/k2fsa/sherpa/onnx/OfflineTtsModelConfig;->kitten:Lcom/k2fsa/sherpa/onnx/OfflineTtsKittenModelConfig;

    invoke-static {v3, v4}, Lkotlin/jvm/internal/Intrinsics;->areEqual(Ljava/lang/Object;Ljava/lang/Object;)Z

    move-result v3

    if-nez v3, :cond_6

    return v2

    :cond_6
    iget-object v3, p0, Lcom/k2fsa/sherpa/onnx/OfflineTtsModelConfig;->pocket:Lcom/k2fsa/sherpa/onnx/OfflineTtsPocketModelConfig;

    iget-object v4, v1, Lcom/k2fsa/sherpa/onnx/OfflineTtsModelConfig;->pocket:Lcom/k2fsa/sherpa/onnx/OfflineTtsPocketModelConfig;

    invoke-static {v3, v4}, Lkotlin/jvm/internal/Intrinsics;->areEqual(Ljava/lang/Object;Ljava/lang/Object;)Z

    move-result v3

    if-nez v3, :cond_7

    return v2

    :cond_7
    iget-object v3, p0, Lcom/k2fsa/sherpa/onnx/OfflineTtsModelConfig;->supertonic:Lcom/k2fsa/sherpa/onnx/OfflineTtsSupertonicModelConfig;

    iget-object v4, v1, Lcom/k2fsa/sherpa/onnx/OfflineTtsModelConfig;->supertonic:Lcom/k2fsa/sherpa/onnx/OfflineTtsSupertonicModelConfig;

    invoke-static {v3, v4}, Lkotlin/jvm/internal/Intrinsics;->areEqual(Ljava/lang/Object;Ljava/lang/Object;)Z

    move-result v3

    if-nez v3, :cond_8

    return v2

    :cond_8
    iget v3, p0, Lcom/k2fsa/sherpa/onnx/OfflineTtsModelConfig;->numThreads:I

    iget v4, v1, Lcom/k2fsa/sherpa/onnx/OfflineTtsModelConfig;->numThreads:I

    if-eq v3, v4, :cond_9

    return v2

    :cond_9
    iget-boolean v3, p0, Lcom/k2fsa/sherpa/onnx/OfflineTtsModelConfig;->debug:Z

    iget-boolean v4, v1, Lcom/k2fsa/sherpa/onnx/OfflineTtsModelConfig;->debug:Z

    if-eq v3, v4, :cond_a

    return v2

    :cond_a
    iget-object v3, p0, Lcom/k2fsa/sherpa/onnx/OfflineTtsModelConfig;->provider:Ljava/lang/String;

    iget-object v1, v1, Lcom/k2fsa/sherpa/onnx/OfflineTtsModelConfig;->provider:Ljava/lang/String;

    invoke-static {v3, v1}, Lkotlin/jvm/internal/Intrinsics;->areEqual(Ljava/lang/Object;Ljava/lang/Object;)Z

    move-result v1

    if-nez v1, :cond_b

    return v2

    :cond_b
    return v0
.end method

.method public final getDebug()Z
    .locals 1

    .line 104
    iget-boolean v0, p0, Lcom/k2fsa/sherpa/onnx/OfflineTtsModelConfig;->debug:Z

    return v0
.end method

.method public final getKitten()Lcom/k2fsa/sherpa/onnx/OfflineTtsKittenModelConfig;
    .locals 1

    .line 99
    iget-object v0, p0, Lcom/k2fsa/sherpa/onnx/OfflineTtsModelConfig;->kitten:Lcom/k2fsa/sherpa/onnx/OfflineTtsKittenModelConfig;

    return-object v0
.end method

.method public final getKokoro()Lcom/k2fsa/sherpa/onnx/OfflineTtsKokoroModelConfig;
    .locals 1

    .line 97
    iget-object v0, p0, Lcom/k2fsa/sherpa/onnx/OfflineTtsModelConfig;->kokoro:Lcom/k2fsa/sherpa/onnx/OfflineTtsKokoroModelConfig;

    return-object v0
.end method

.method public final getMatcha()Lcom/k2fsa/sherpa/onnx/OfflineTtsMatchaModelConfig;
    .locals 1

    .line 96
    iget-object v0, p0, Lcom/k2fsa/sherpa/onnx/OfflineTtsModelConfig;->matcha:Lcom/k2fsa/sherpa/onnx/OfflineTtsMatchaModelConfig;

    return-object v0
.end method

.method public final getNumThreads()I
    .locals 1

    .line 103
    iget v0, p0, Lcom/k2fsa/sherpa/onnx/OfflineTtsModelConfig;->numThreads:I

    return v0
.end method

.method public final getPocket()Lcom/k2fsa/sherpa/onnx/OfflineTtsPocketModelConfig;
    .locals 1

    .line 100
    iget-object v0, p0, Lcom/k2fsa/sherpa/onnx/OfflineTtsModelConfig;->pocket:Lcom/k2fsa/sherpa/onnx/OfflineTtsPocketModelConfig;

    return-object v0
.end method

.method public final getProvider()Ljava/lang/String;
    .locals 1

    .line 105
    iget-object v0, p0, Lcom/k2fsa/sherpa/onnx/OfflineTtsModelConfig;->provider:Ljava/lang/String;

    return-object v0
.end method

.method public final getSupertonic()Lcom/k2fsa/sherpa/onnx/OfflineTtsSupertonicModelConfig;
    .locals 1

    .line 101
    iget-object v0, p0, Lcom/k2fsa/sherpa/onnx/OfflineTtsModelConfig;->supertonic:Lcom/k2fsa/sherpa/onnx/OfflineTtsSupertonicModelConfig;

    return-object v0
.end method

.method public final getVits()Lcom/k2fsa/sherpa/onnx/OfflineTtsVitsModelConfig;
    .locals 1

    .line 95
    iget-object v0, p0, Lcom/k2fsa/sherpa/onnx/OfflineTtsModelConfig;->vits:Lcom/k2fsa/sherpa/onnx/OfflineTtsVitsModelConfig;

    return-object v0
.end method

.method public final getZipvoice()Lcom/k2fsa/sherpa/onnx/OfflineTtsZipVoiceModelConfig;
    .locals 1

    .line 98
    iget-object v0, p0, Lcom/k2fsa/sherpa/onnx/OfflineTtsModelConfig;->zipvoice:Lcom/k2fsa/sherpa/onnx/OfflineTtsZipVoiceModelConfig;

    return-object v0
.end method

.method public hashCode()I
    .locals 3

    iget-object v0, p0, Lcom/k2fsa/sherpa/onnx/OfflineTtsModelConfig;->vits:Lcom/k2fsa/sherpa/onnx/OfflineTtsVitsModelConfig;

    invoke-virtual {v0}, Lcom/k2fsa/sherpa/onnx/OfflineTtsVitsModelConfig;->hashCode()I

    move-result v0

    mul-int/lit8 v1, v0, 0x1f

    iget-object v2, p0, Lcom/k2fsa/sherpa/onnx/OfflineTtsModelConfig;->matcha:Lcom/k2fsa/sherpa/onnx/OfflineTtsMatchaModelConfig;

    invoke-virtual {v2}, Lcom/k2fsa/sherpa/onnx/OfflineTtsMatchaModelConfig;->hashCode()I

    move-result v2

    add-int/2addr v1, v2

    mul-int/lit8 v0, v1, 0x1f

    iget-object v2, p0, Lcom/k2fsa/sherpa/onnx/OfflineTtsModelConfig;->kokoro:Lcom/k2fsa/sherpa/onnx/OfflineTtsKokoroModelConfig;

    invoke-virtual {v2}, Lcom/k2fsa/sherpa/onnx/OfflineTtsKokoroModelConfig;->hashCode()I

    move-result v2

    add-int/2addr v0, v2

    mul-int/lit8 v1, v0, 0x1f

    iget-object v2, p0, Lcom/k2fsa/sherpa/onnx/OfflineTtsModelConfig;->zipvoice:Lcom/k2fsa/sherpa/onnx/OfflineTtsZipVoiceModelConfig;

    invoke-virtual {v2}, Lcom/k2fsa/sherpa/onnx/OfflineTtsZipVoiceModelConfig;->hashCode()I

    move-result v2

    add-int/2addr v1, v2

    mul-int/lit8 v0, v1, 0x1f

    iget-object v2, p0, Lcom/k2fsa/sherpa/onnx/OfflineTtsModelConfig;->kitten:Lcom/k2fsa/sherpa/onnx/OfflineTtsKittenModelConfig;

    invoke-virtual {v2}, Lcom/k2fsa/sherpa/onnx/OfflineTtsKittenModelConfig;->hashCode()I

    move-result v2

    add-int/2addr v0, v2

    mul-int/lit8 v1, v0, 0x1f

    iget-object v2, p0, Lcom/k2fsa/sherpa/onnx/OfflineTtsModelConfig;->pocket:Lcom/k2fsa/sherpa/onnx/OfflineTtsPocketModelConfig;

    invoke-virtual {v2}, Lcom/k2fsa/sherpa/onnx/OfflineTtsPocketModelConfig;->hashCode()I

    move-result v2

    add-int/2addr v1, v2

    mul-int/lit8 v0, v1, 0x1f

    iget-object v2, p0, Lcom/k2fsa/sherpa/onnx/OfflineTtsModelConfig;->supertonic:Lcom/k2fsa/sherpa/onnx/OfflineTtsSupertonicModelConfig;

    invoke-virtual {v2}, Lcom/k2fsa/sherpa/onnx/OfflineTtsSupertonicModelConfig;->hashCode()I

    move-result v2

    add-int/2addr v0, v2

    mul-int/lit8 v1, v0, 0x1f

    iget v2, p0, Lcom/k2fsa/sherpa/onnx/OfflineTtsModelConfig;->numThreads:I

    invoke-static {v2}, Ljava/lang/Integer;->hashCode(I)I

    move-result v2

    add-int/2addr v1, v2

    mul-int/lit8 v0, v1, 0x1f

    iget-boolean v2, p0, Lcom/k2fsa/sherpa/onnx/OfflineTtsModelConfig;->debug:Z

    if-eqz v2, :cond_0

    const/4 v2, 0x1

    :cond_0
    add-int/2addr v0, v2

    mul-int/lit8 v1, v0, 0x1f

    iget-object v2, p0, Lcom/k2fsa/sherpa/onnx/OfflineTtsModelConfig;->provider:Ljava/lang/String;

    invoke-virtual {v2}, Ljava/lang/String;->hashCode()I

    move-result v2

    add-int/2addr v1, v2

    return v1
.end method

.method public final setDebug(Z)V
    .locals 0
    .param p1, "<set-?>"    # Z

    .line 104
    iput-boolean p1, p0, Lcom/k2fsa/sherpa/onnx/OfflineTtsModelConfig;->debug:Z

    return-void
.end method

.method public final setKitten(Lcom/k2fsa/sherpa/onnx/OfflineTtsKittenModelConfig;)V
    .locals 1
    .param p1, "<set-?>"    # Lcom/k2fsa/sherpa/onnx/OfflineTtsKittenModelConfig;

    const-string v0, "<set-?>"

    invoke-static {p1, v0}, Lkotlin/jvm/internal/Intrinsics;->checkNotNullParameter(Ljava/lang/Object;Ljava/lang/String;)V

    .line 99
    iput-object p1, p0, Lcom/k2fsa/sherpa/onnx/OfflineTtsModelConfig;->kitten:Lcom/k2fsa/sherpa/onnx/OfflineTtsKittenModelConfig;

    return-void
.end method

.method public final setKokoro(Lcom/k2fsa/sherpa/onnx/OfflineTtsKokoroModelConfig;)V
    .locals 1
    .param p1, "<set-?>"    # Lcom/k2fsa/sherpa/onnx/OfflineTtsKokoroModelConfig;

    const-string v0, "<set-?>"

    invoke-static {p1, v0}, Lkotlin/jvm/internal/Intrinsics;->checkNotNullParameter(Ljava/lang/Object;Ljava/lang/String;)V

    .line 97
    iput-object p1, p0, Lcom/k2fsa/sherpa/onnx/OfflineTtsModelConfig;->kokoro:Lcom/k2fsa/sherpa/onnx/OfflineTtsKokoroModelConfig;

    return-void
.end method

.method public final setMatcha(Lcom/k2fsa/sherpa/onnx/OfflineTtsMatchaModelConfig;)V
    .locals 1
    .param p1, "<set-?>"    # Lcom/k2fsa/sherpa/onnx/OfflineTtsMatchaModelConfig;

    const-string v0, "<set-?>"

    invoke-static {p1, v0}, Lkotlin/jvm/internal/Intrinsics;->checkNotNullParameter(Ljava/lang/Object;Ljava/lang/String;)V

    .line 96
    iput-object p1, p0, Lcom/k2fsa/sherpa/onnx/OfflineTtsModelConfig;->matcha:Lcom/k2fsa/sherpa/onnx/OfflineTtsMatchaModelConfig;

    return-void
.end method

.method public final setNumThreads(I)V
    .locals 0
    .param p1, "<set-?>"    # I

    .line 103
    iput p1, p0, Lcom/k2fsa/sherpa/onnx/OfflineTtsModelConfig;->numThreads:I

    return-void
.end method

.method public final setPocket(Lcom/k2fsa/sherpa/onnx/OfflineTtsPocketModelConfig;)V
    .locals 1
    .param p1, "<set-?>"    # Lcom/k2fsa/sherpa/onnx/OfflineTtsPocketModelConfig;

    const-string v0, "<set-?>"

    invoke-static {p1, v0}, Lkotlin/jvm/internal/Intrinsics;->checkNotNullParameter(Ljava/lang/Object;Ljava/lang/String;)V

    .line 100
    iput-object p1, p0, Lcom/k2fsa/sherpa/onnx/OfflineTtsModelConfig;->pocket:Lcom/k2fsa/sherpa/onnx/OfflineTtsPocketModelConfig;

    return-void
.end method

.method public final setProvider(Ljava/lang/String;)V
    .locals 1
    .param p1, "<set-?>"    # Ljava/lang/String;

    const-string v0, "<set-?>"

    invoke-static {p1, v0}, Lkotlin/jvm/internal/Intrinsics;->checkNotNullParameter(Ljava/lang/Object;Ljava/lang/String;)V

    .line 105
    iput-object p1, p0, Lcom/k2fsa/sherpa/onnx/OfflineTtsModelConfig;->provider:Ljava/lang/String;

    return-void
.end method

.method public final setSupertonic(Lcom/k2fsa/sherpa/onnx/OfflineTtsSupertonicModelConfig;)V
    .locals 1
    .param p1, "<set-?>"    # Lcom/k2fsa/sherpa/onnx/OfflineTtsSupertonicModelConfig;

    const-string v0, "<set-?>"

    invoke-static {p1, v0}, Lkotlin/jvm/internal/Intrinsics;->checkNotNullParameter(Ljava/lang/Object;Ljava/lang/String;)V

    .line 101
    iput-object p1, p0, Lcom/k2fsa/sherpa/onnx/OfflineTtsModelConfig;->supertonic:Lcom/k2fsa/sherpa/onnx/OfflineTtsSupertonicModelConfig;

    return-void
.end method

.method public final setVits(Lcom/k2fsa/sherpa/onnx/OfflineTtsVitsModelConfig;)V
    .locals 1
    .param p1, "<set-?>"    # Lcom/k2fsa/sherpa/onnx/OfflineTtsVitsModelConfig;

    const-string v0, "<set-?>"

    invoke-static {p1, v0}, Lkotlin/jvm/internal/Intrinsics;->checkNotNullParameter(Ljava/lang/Object;Ljava/lang/String;)V

    .line 95
    iput-object p1, p0, Lcom/k2fsa/sherpa/onnx/OfflineTtsModelConfig;->vits:Lcom/k2fsa/sherpa/onnx/OfflineTtsVitsModelConfig;

    return-void
.end method

.method public final setZipvoice(Lcom/k2fsa/sherpa/onnx/OfflineTtsZipVoiceModelConfig;)V
    .locals 1
    .param p1, "<set-?>"    # Lcom/k2fsa/sherpa/onnx/OfflineTtsZipVoiceModelConfig;

    const-string v0, "<set-?>"

    invoke-static {p1, v0}, Lkotlin/jvm/internal/Intrinsics;->checkNotNullParameter(Ljava/lang/Object;Ljava/lang/String;)V

    .line 98
    iput-object p1, p0, Lcom/k2fsa/sherpa/onnx/OfflineTtsModelConfig;->zipvoice:Lcom/k2fsa/sherpa/onnx/OfflineTtsZipVoiceModelConfig;

    return-void
.end method

.method public toString()Ljava/lang/String;
    .locals 2

    new-instance v0, Ljava/lang/StringBuilder;

    invoke-direct {v0}, Ljava/lang/StringBuilder;-><init>()V

    const-string v1, "OfflineTtsModelConfig(vits="

    invoke-virtual {v0, v1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v0

    iget-object v1, p0, Lcom/k2fsa/sherpa/onnx/OfflineTtsModelConfig;->vits:Lcom/k2fsa/sherpa/onnx/OfflineTtsVitsModelConfig;

    invoke-virtual {v0, v1}, Ljava/lang/StringBuilder;->append(Ljava/lang/Object;)Ljava/lang/StringBuilder;

    move-result-object v0

    const-string v1, ", matcha="

    invoke-virtual {v0, v1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v0

    iget-object v1, p0, Lcom/k2fsa/sherpa/onnx/OfflineTtsModelConfig;->matcha:Lcom/k2fsa/sherpa/onnx/OfflineTtsMatchaModelConfig;

    invoke-virtual {v0, v1}, Ljava/lang/StringBuilder;->append(Ljava/lang/Object;)Ljava/lang/StringBuilder;

    move-result-object v0

    const-string v1, ", kokoro="

    invoke-virtual {v0, v1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v0

    iget-object v1, p0, Lcom/k2fsa/sherpa/onnx/OfflineTtsModelConfig;->kokoro:Lcom/k2fsa/sherpa/onnx/OfflineTtsKokoroModelConfig;

    invoke-virtual {v0, v1}, Ljava/lang/StringBuilder;->append(Ljava/lang/Object;)Ljava/lang/StringBuilder;

    move-result-object v0

    const-string v1, ", zipvoice="

    invoke-virtual {v0, v1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v0

    iget-object v1, p0, Lcom/k2fsa/sherpa/onnx/OfflineTtsModelConfig;->zipvoice:Lcom/k2fsa/sherpa/onnx/OfflineTtsZipVoiceModelConfig;

    invoke-virtual {v0, v1}, Ljava/lang/StringBuilder;->append(Ljava/lang/Object;)Ljava/lang/StringBuilder;

    move-result-object v0

    const-string v1, ", kitten="

    invoke-virtual {v0, v1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v0

    iget-object v1, p0, Lcom/k2fsa/sherpa/onnx/OfflineTtsModelConfig;->kitten:Lcom/k2fsa/sherpa/onnx/OfflineTtsKittenModelConfig;

    invoke-virtual {v0, v1}, Ljava/lang/StringBuilder;->append(Ljava/lang/Object;)Ljava/lang/StringBuilder;

    move-result-object v0

    const-string v1, ", pocket="

    invoke-virtual {v0, v1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v0

    iget-object v1, p0, Lcom/k2fsa/sherpa/onnx/OfflineTtsModelConfig;->pocket:Lcom/k2fsa/sherpa/onnx/OfflineTtsPocketModelConfig;

    invoke-virtual {v0, v1}, Ljava/lang/StringBuilder;->append(Ljava/lang/Object;)Ljava/lang/StringBuilder;

    move-result-object v0

    const-string v1, ", supertonic="

    invoke-virtual {v0, v1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v0

    iget-object v1, p0, Lcom/k2fsa/sherpa/onnx/OfflineTtsModelConfig;->supertonic:Lcom/k2fsa/sherpa/onnx/OfflineTtsSupertonicModelConfig;

    invoke-virtual {v0, v1}, Ljava/lang/StringBuilder;->append(Ljava/lang/Object;)Ljava/lang/StringBuilder;

    move-result-object v0

    const-string v1, ", numThreads="

    invoke-virtual {v0, v1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v0

    iget v1, p0, Lcom/k2fsa/sherpa/onnx/OfflineTtsModelConfig;->numThreads:I

    invoke-virtual {v0, v1}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    move-result-object v0

    const-string v1, ", debug="

    invoke-virtual {v0, v1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v0

    iget-boolean v1, p0, Lcom/k2fsa/sherpa/onnx/OfflineTtsModelConfig;->debug:Z

    invoke-virtual {v0, v1}, Ljava/lang/StringBuilder;->append(Z)Ljava/lang/StringBuilder;

    move-result-object v0

    const-string v1, ", provider="

    invoke-virtual {v0, v1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v0

    iget-object v1, p0, Lcom/k2fsa/sherpa/onnx/OfflineTtsModelConfig;->provider:Ljava/lang/String;

    invoke-virtual {v0, v1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v0

    const/16 v1, 0x29

    invoke-virtual {v0, v1}, Ljava/lang/StringBuilder;->append(C)Ljava/lang/StringBuilder;

    move-result-object v0

    invoke-virtual {v0}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v0

    return-object v0
.end method
