.class public Lcom/k2fsa/sherpa/onnx/OfflineTtsSupertonicModelConfig;
.super Ljava/lang/Object;
.source "OfflineTtsSupertonicModelConfig.java"


# instance fields
.field public durationPredictor:Ljava/lang/String;

.field public textEncoder:Ljava/lang/String;

.field public ttsJson:Ljava/lang/String;

.field public unicodeIndexer:Ljava/lang/String;

.field public vectorEstimator:Ljava/lang/String;

.field public vocoder:Ljava/lang/String;

.field public voiceStyle:Ljava/lang/String;


# direct methods
.method public constructor <init>()V
    .locals 1

    .line 2
    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    const-string v0, ""

    iput-object v0, p0, Lcom/k2fsa/sherpa/onnx/OfflineTtsSupertonicModelConfig;->durationPredictor:Ljava/lang/String;

    iput-object v0, p0, Lcom/k2fsa/sherpa/onnx/OfflineTtsSupertonicModelConfig;->textEncoder:Ljava/lang/String;

    iput-object v0, p0, Lcom/k2fsa/sherpa/onnx/OfflineTtsSupertonicModelConfig;->vectorEstimator:Ljava/lang/String;

    iput-object v0, p0, Lcom/k2fsa/sherpa/onnx/OfflineTtsSupertonicModelConfig;->vocoder:Ljava/lang/String;

    iput-object v0, p0, Lcom/k2fsa/sherpa/onnx/OfflineTtsSupertonicModelConfig;->ttsJson:Ljava/lang/String;

    iput-object v0, p0, Lcom/k2fsa/sherpa/onnx/OfflineTtsSupertonicModelConfig;->unicodeIndexer:Ljava/lang/String;

    iput-object v0, p0, Lcom/k2fsa/sherpa/onnx/OfflineTtsSupertonicModelConfig;->voiceStyle:Ljava/lang/String;

    return-void
.end method
