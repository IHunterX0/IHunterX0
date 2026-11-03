.class public Lcom/k2fsa/sherpa/onnx/OfflineTtsKokoroModelConfig;
.super Ljava/lang/Object;
.source "OfflineTtsKokoroModelConfig.java"


# instance fields
.field public dataDir:Ljava/lang/String;

.field public dictDir:Ljava/lang/String;

.field public lang:Ljava/lang/String;

.field public lengthScale:F

.field public lexicon:Ljava/lang/String;

.field public model:Ljava/lang/String;

.field public tokens:Ljava/lang/String;

.field public voices:Ljava/lang/String;


# direct methods
.method public constructor <init>()V
    .locals 1

    .line 2
    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    const-string v0, ""

    iput-object v0, p0, Lcom/k2fsa/sherpa/onnx/OfflineTtsKokoroModelConfig;->model:Ljava/lang/String;

    iput-object v0, p0, Lcom/k2fsa/sherpa/onnx/OfflineTtsKokoroModelConfig;->voices:Ljava/lang/String;

    iput-object v0, p0, Lcom/k2fsa/sherpa/onnx/OfflineTtsKokoroModelConfig;->tokens:Ljava/lang/String;

    iput-object v0, p0, Lcom/k2fsa/sherpa/onnx/OfflineTtsKokoroModelConfig;->dataDir:Ljava/lang/String;

    iput-object v0, p0, Lcom/k2fsa/sherpa/onnx/OfflineTtsKokoroModelConfig;->lexicon:Ljava/lang/String;

    iput-object v0, p0, Lcom/k2fsa/sherpa/onnx/OfflineTtsKokoroModelConfig;->lang:Ljava/lang/String;

    iput-object v0, p0, Lcom/k2fsa/sherpa/onnx/OfflineTtsKokoroModelConfig;->dictDir:Ljava/lang/String;

    const/high16 v0, 0x3f800000    # 1.0f

    iput v0, p0, Lcom/k2fsa/sherpa/onnx/OfflineTtsKokoroModelConfig;->lengthScale:F

    return-void
.end method
