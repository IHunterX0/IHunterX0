.class public Lcom/k2fsa/sherpa/onnx/OfflineTtsConfig;
.super Ljava/lang/Object;
.source "OfflineTtsConfig.java"


# instance fields
.field public maxNumSentences:I

.field public model:Lcom/k2fsa/sherpa/onnx/OfflineTtsModelConfig;

.field public ruleFars:Ljava/lang/String;

.field public ruleFsts:Ljava/lang/String;

.field public silenceScale:F


# direct methods
.method public constructor <init>()V
    .locals 1

    .line 2
    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    new-instance v0, Lcom/k2fsa/sherpa/onnx/OfflineTtsModelConfig;

    invoke-direct {v0}, Lcom/k2fsa/sherpa/onnx/OfflineTtsModelConfig;-><init>()V

    iput-object v0, p0, Lcom/k2fsa/sherpa/onnx/OfflineTtsConfig;->model:Lcom/k2fsa/sherpa/onnx/OfflineTtsModelConfig;

    const-string v0, ""

    iput-object v0, p0, Lcom/k2fsa/sherpa/onnx/OfflineTtsConfig;->ruleFsts:Ljava/lang/String;

    iput-object v0, p0, Lcom/k2fsa/sherpa/onnx/OfflineTtsConfig;->ruleFars:Ljava/lang/String;

    const/4 v0, 0x1

    iput v0, p0, Lcom/k2fsa/sherpa/onnx/OfflineTtsConfig;->maxNumSentences:I

    const v0, 0x3e4ccccd    # 0.2f

    iput v0, p0, Lcom/k2fsa/sherpa/onnx/OfflineTtsConfig;->silenceScale:F

    return-void
.end method
