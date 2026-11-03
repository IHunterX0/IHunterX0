.class public Lcom/k2fsa/sherpa/onnx/OfflineTtsZipVoiceModelConfig;
.super Ljava/lang/Object;
.source "OfflineTtsZipVoiceModelConfig.java"


# instance fields
.field public dataDir:Ljava/lang/String;

.field public decoder:Ljava/lang/String;

.field public encoder:Ljava/lang/String;

.field public featScale:F

.field public guidanceScale:F

.field public lexicon:Ljava/lang/String;

.field public tShift:F

.field public targetRms:F

.field public tokens:Ljava/lang/String;

.field public vocoder:Ljava/lang/String;


# direct methods
.method public constructor <init>()V
    .locals 2

    .line 2
    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    const-string v0, ""

    iput-object v0, p0, Lcom/k2fsa/sherpa/onnx/OfflineTtsZipVoiceModelConfig;->tokens:Ljava/lang/String;

    iput-object v0, p0, Lcom/k2fsa/sherpa/onnx/OfflineTtsZipVoiceModelConfig;->encoder:Ljava/lang/String;

    iput-object v0, p0, Lcom/k2fsa/sherpa/onnx/OfflineTtsZipVoiceModelConfig;->decoder:Ljava/lang/String;

    iput-object v0, p0, Lcom/k2fsa/sherpa/onnx/OfflineTtsZipVoiceModelConfig;->vocoder:Ljava/lang/String;

    iput-object v0, p0, Lcom/k2fsa/sherpa/onnx/OfflineTtsZipVoiceModelConfig;->dataDir:Ljava/lang/String;

    iput-object v0, p0, Lcom/k2fsa/sherpa/onnx/OfflineTtsZipVoiceModelConfig;->lexicon:Ljava/lang/String;

    const v0, 0x3dcccccd    # 0.1f

    iput v0, p0, Lcom/k2fsa/sherpa/onnx/OfflineTtsZipVoiceModelConfig;->featScale:F

    const/high16 v1, 0x3f000000    # 0.5f

    iput v1, p0, Lcom/k2fsa/sherpa/onnx/OfflineTtsZipVoiceModelConfig;->tShift:F

    iput v0, p0, Lcom/k2fsa/sherpa/onnx/OfflineTtsZipVoiceModelConfig;->targetRms:F

    const/high16 v0, 0x3f800000    # 1.0f

    iput v0, p0, Lcom/k2fsa/sherpa/onnx/OfflineTtsZipVoiceModelConfig;->guidanceScale:F

    return-void
.end method
