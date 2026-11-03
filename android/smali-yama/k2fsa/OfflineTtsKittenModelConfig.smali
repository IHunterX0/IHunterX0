.class public Lcom/k2fsa/sherpa/onnx/OfflineTtsKittenModelConfig;
.super Ljava/lang/Object;
.source "OfflineTtsKittenModelConfig.java"


# instance fields
.field public dataDir:Ljava/lang/String;

.field public lengthScale:F

.field public lexicon:Ljava/lang/String;

.field public model:Ljava/lang/String;

.field public tokens:Ljava/lang/String;

.field public voices:Ljava/lang/String;


# direct methods
.method public constructor <init>()V
    .locals 2

    .line 2
    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    const-string v0, ""

    iput-object v0, p0, Lcom/k2fsa/sherpa/onnx/OfflineTtsKittenModelConfig;->model:Ljava/lang/String;

    iput-object v0, p0, Lcom/k2fsa/sherpa/onnx/OfflineTtsKittenModelConfig;->voices:Ljava/lang/String;

    iput-object v0, p0, Lcom/k2fsa/sherpa/onnx/OfflineTtsKittenModelConfig;->tokens:Ljava/lang/String;

    iput-object v0, p0, Lcom/k2fsa/sherpa/onnx/OfflineTtsKittenModelConfig;->dataDir:Ljava/lang/String;

    const/high16 v1, 0x3f800000    # 1.0f

    iput v1, p0, Lcom/k2fsa/sherpa/onnx/OfflineTtsKittenModelConfig;->lengthScale:F

    iput-object v0, p0, Lcom/k2fsa/sherpa/onnx/OfflineTtsKittenModelConfig;->lexicon:Ljava/lang/String;

    return-void
.end method
