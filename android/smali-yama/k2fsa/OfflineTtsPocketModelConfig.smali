.class public Lcom/k2fsa/sherpa/onnx/OfflineTtsPocketModelConfig;
.super Ljava/lang/Object;
.source "OfflineTtsPocketModelConfig.java"


# instance fields
.field public decoder:Ljava/lang/String;

.field public encoder:Ljava/lang/String;

.field public lmFlow:Ljava/lang/String;

.field public lmMain:Ljava/lang/String;

.field public textConditioner:Ljava/lang/String;

.field public tokenScoresJson:Ljava/lang/String;

.field public vocabJson:Ljava/lang/String;

.field public voiceEmbeddingCacheCapacity:I


# direct methods
.method public constructor <init>()V
    .locals 1

    .line 2
    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    const-string v0, ""

    iput-object v0, p0, Lcom/k2fsa/sherpa/onnx/OfflineTtsPocketModelConfig;->lmFlow:Ljava/lang/String;

    iput-object v0, p0, Lcom/k2fsa/sherpa/onnx/OfflineTtsPocketModelConfig;->lmMain:Ljava/lang/String;

    iput-object v0, p0, Lcom/k2fsa/sherpa/onnx/OfflineTtsPocketModelConfig;->encoder:Ljava/lang/String;

    iput-object v0, p0, Lcom/k2fsa/sherpa/onnx/OfflineTtsPocketModelConfig;->decoder:Ljava/lang/String;

    iput-object v0, p0, Lcom/k2fsa/sherpa/onnx/OfflineTtsPocketModelConfig;->textConditioner:Ljava/lang/String;

    iput-object v0, p0, Lcom/k2fsa/sherpa/onnx/OfflineTtsPocketModelConfig;->vocabJson:Ljava/lang/String;

    iput-object v0, p0, Lcom/k2fsa/sherpa/onnx/OfflineTtsPocketModelConfig;->tokenScoresJson:Ljava/lang/String;

    const/16 v0, 0x32

    iput v0, p0, Lcom/k2fsa/sherpa/onnx/OfflineTtsPocketModelConfig;->voiceEmbeddingCacheCapacity:I

    return-void
.end method
