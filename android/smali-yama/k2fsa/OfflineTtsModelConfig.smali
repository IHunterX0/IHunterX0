.class public Lcom/k2fsa/sherpa/onnx/OfflineTtsModelConfig;
.super Ljava/lang/Object;
.source "OfflineTtsModelConfig.java"


# instance fields
.field public debug:Z

.field public kitten:Lcom/k2fsa/sherpa/onnx/OfflineTtsKittenModelConfig;

.field public kokoro:Lcom/k2fsa/sherpa/onnx/OfflineTtsKokoroModelConfig;

.field public matcha:Lcom/k2fsa/sherpa/onnx/OfflineTtsMatchaModelConfig;

.field public numThreads:I

.field public pocket:Lcom/k2fsa/sherpa/onnx/OfflineTtsPocketModelConfig;

.field public provider:Ljava/lang/String;

.field public supertonic:Lcom/k2fsa/sherpa/onnx/OfflineTtsSupertonicModelConfig;

.field public vits:Lcom/k2fsa/sherpa/onnx/OfflineTtsVitsModelConfig;

.field public zipvoice:Lcom/k2fsa/sherpa/onnx/OfflineTtsZipVoiceModelConfig;


# direct methods
.method public constructor <init>()V
    .locals 1

    .line 2
    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    .line 3
    new-instance v0, Lcom/k2fsa/sherpa/onnx/OfflineTtsVitsModelConfig;

    invoke-direct {v0}, Lcom/k2fsa/sherpa/onnx/OfflineTtsVitsModelConfig;-><init>()V

    iput-object v0, p0, Lcom/k2fsa/sherpa/onnx/OfflineTtsModelConfig;->vits:Lcom/k2fsa/sherpa/onnx/OfflineTtsVitsModelConfig;

    .line 4
    new-instance v0, Lcom/k2fsa/sherpa/onnx/OfflineTtsMatchaModelConfig;

    invoke-direct {v0}, Lcom/k2fsa/sherpa/onnx/OfflineTtsMatchaModelConfig;-><init>()V

    iput-object v0, p0, Lcom/k2fsa/sherpa/onnx/OfflineTtsModelConfig;->matcha:Lcom/k2fsa/sherpa/onnx/OfflineTtsMatchaModelConfig;

    .line 5
    new-instance v0, Lcom/k2fsa/sherpa/onnx/OfflineTtsKokoroModelConfig;

    invoke-direct {v0}, Lcom/k2fsa/sherpa/onnx/OfflineTtsKokoroModelConfig;-><init>()V

    iput-object v0, p0, Lcom/k2fsa/sherpa/onnx/OfflineTtsModelConfig;->kokoro:Lcom/k2fsa/sherpa/onnx/OfflineTtsKokoroModelConfig;

    .line 6
    new-instance v0, Lcom/k2fsa/sherpa/onnx/OfflineTtsZipVoiceModelConfig;

    invoke-direct {v0}, Lcom/k2fsa/sherpa/onnx/OfflineTtsZipVoiceModelConfig;-><init>()V

    iput-object v0, p0, Lcom/k2fsa/sherpa/onnx/OfflineTtsModelConfig;->zipvoice:Lcom/k2fsa/sherpa/onnx/OfflineTtsZipVoiceModelConfig;

    .line 7
    new-instance v0, Lcom/k2fsa/sherpa/onnx/OfflineTtsKittenModelConfig;

    invoke-direct {v0}, Lcom/k2fsa/sherpa/onnx/OfflineTtsKittenModelConfig;-><init>()V

    iput-object v0, p0, Lcom/k2fsa/sherpa/onnx/OfflineTtsModelConfig;->kitten:Lcom/k2fsa/sherpa/onnx/OfflineTtsKittenModelConfig;

    .line 8
    new-instance v0, Lcom/k2fsa/sherpa/onnx/OfflineTtsPocketModelConfig;

    invoke-direct {v0}, Lcom/k2fsa/sherpa/onnx/OfflineTtsPocketModelConfig;-><init>()V

    iput-object v0, p0, Lcom/k2fsa/sherpa/onnx/OfflineTtsModelConfig;->pocket:Lcom/k2fsa/sherpa/onnx/OfflineTtsPocketModelConfig;

    .line 9
    new-instance v0, Lcom/k2fsa/sherpa/onnx/OfflineTtsSupertonicModelConfig;

    invoke-direct {v0}, Lcom/k2fsa/sherpa/onnx/OfflineTtsSupertonicModelConfig;-><init>()V

    iput-object v0, p0, Lcom/k2fsa/sherpa/onnx/OfflineTtsModelConfig;->supertonic:Lcom/k2fsa/sherpa/onnx/OfflineTtsSupertonicModelConfig;

    .line 10
    const/4 v0, 0x1

    iput v0, p0, Lcom/k2fsa/sherpa/onnx/OfflineTtsModelConfig;->numThreads:I

    const/4 v0, 0x0

    iput-boolean v0, p0, Lcom/k2fsa/sherpa/onnx/OfflineTtsModelConfig;->debug:Z

    const-string v0, "cpu"

    iput-object v0, p0, Lcom/k2fsa/sherpa/onnx/OfflineTtsModelConfig;->provider:Ljava/lang/String;

    return-void
.end method
