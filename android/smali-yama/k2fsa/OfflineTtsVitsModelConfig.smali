.class public Lcom/k2fsa/sherpa/onnx/OfflineTtsVitsModelConfig;
.super Ljava/lang/Object;
.source "OfflineTtsVitsModelConfig.java"


# instance fields
.field public dataDir:Ljava/lang/String;

.field public dictDir:Ljava/lang/String;

.field public lengthScale:F

.field public lexicon:Ljava/lang/String;

.field public model:Ljava/lang/String;

.field public noiseScale:F

.field public noiseScaleW:F

.field public tokens:Ljava/lang/String;


# direct methods
.method public constructor <init>()V
    .locals 1

    .line 2
    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    const-string v0, ""

    iput-object v0, p0, Lcom/k2fsa/sherpa/onnx/OfflineTtsVitsModelConfig;->model:Ljava/lang/String;

    iput-object v0, p0, Lcom/k2fsa/sherpa/onnx/OfflineTtsVitsModelConfig;->lexicon:Ljava/lang/String;

    iput-object v0, p0, Lcom/k2fsa/sherpa/onnx/OfflineTtsVitsModelConfig;->tokens:Ljava/lang/String;

    iput-object v0, p0, Lcom/k2fsa/sherpa/onnx/OfflineTtsVitsModelConfig;->dataDir:Ljava/lang/String;

    iput-object v0, p0, Lcom/k2fsa/sherpa/onnx/OfflineTtsVitsModelConfig;->dictDir:Ljava/lang/String;

    const v0, 0x3f2ac083    # 0.667f

    iput v0, p0, Lcom/k2fsa/sherpa/onnx/OfflineTtsVitsModelConfig;->noiseScale:F

    const v0, 0x3f4ccccd    # 0.8f

    iput v0, p0, Lcom/k2fsa/sherpa/onnx/OfflineTtsVitsModelConfig;->noiseScaleW:F

    const/high16 v0, 0x3f800000    # 1.0f

    iput v0, p0, Lcom/k2fsa/sherpa/onnx/OfflineTtsVitsModelConfig;->lengthScale:F

    return-void
.end method
