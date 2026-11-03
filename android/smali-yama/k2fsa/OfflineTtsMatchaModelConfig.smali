.class public Lcom/k2fsa/sherpa/onnx/OfflineTtsMatchaModelConfig;
.super Ljava/lang/Object;
.source "OfflineTtsMatchaModelConfig.java"


# instance fields
.field public acousticModel:Ljava/lang/String;

.field public dataDir:Ljava/lang/String;

.field public dictDir:Ljava/lang/String;

.field public lengthScale:F

.field public lexicon:Ljava/lang/String;

.field public noiseScale:F

.field public tokens:Ljava/lang/String;

.field public vocoder:Ljava/lang/String;


# direct methods
.method public constructor <init>()V
    .locals 1

    .line 2
    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    const-string v0, ""

    iput-object v0, p0, Lcom/k2fsa/sherpa/onnx/OfflineTtsMatchaModelConfig;->acousticModel:Ljava/lang/String;

    iput-object v0, p0, Lcom/k2fsa/sherpa/onnx/OfflineTtsMatchaModelConfig;->vocoder:Ljava/lang/String;

    iput-object v0, p0, Lcom/k2fsa/sherpa/onnx/OfflineTtsMatchaModelConfig;->lexicon:Ljava/lang/String;

    iput-object v0, p0, Lcom/k2fsa/sherpa/onnx/OfflineTtsMatchaModelConfig;->tokens:Ljava/lang/String;

    iput-object v0, p0, Lcom/k2fsa/sherpa/onnx/OfflineTtsMatchaModelConfig;->dataDir:Ljava/lang/String;

    iput-object v0, p0, Lcom/k2fsa/sherpa/onnx/OfflineTtsMatchaModelConfig;->dictDir:Ljava/lang/String;

    const/high16 v0, 0x3f800000    # 1.0f

    iput v0, p0, Lcom/k2fsa/sherpa/onnx/OfflineTtsMatchaModelConfig;->noiseScale:F

    iput v0, p0, Lcom/k2fsa/sherpa/onnx/OfflineTtsMatchaModelConfig;->lengthScale:F

    return-void
.end method
