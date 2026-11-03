.class public Lcom/k2fsa/sherpa/onnx/OfflineTts;
.super Ljava/lang/Object;
.source "OfflineTts.java"


# instance fields
.field private ptr:J


# direct methods
.method static constructor <clinit>()V
    .locals 1

    .line 4
    const-string v0, "sherpa-onnx-jni"

    invoke-static {v0}, Ljava/lang/System;->loadLibrary(Ljava/lang/String;)V

    return-void
.end method

.method public constructor <init>(Lcom/k2fsa/sherpa/onnx/OfflineTtsConfig;)V
    .locals 4

    .line 6
    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    invoke-direct {p0, p1}, Lcom/k2fsa/sherpa/onnx/OfflineTts;->newFromFile(Lcom/k2fsa/sherpa/onnx/OfflineTtsConfig;)J

    move-result-wide v0

    iput-wide v0, p0, Lcom/k2fsa/sherpa/onnx/OfflineTts;->ptr:J

    iget-wide v0, p0, Lcom/k2fsa/sherpa/onnx/OfflineTts;->ptr:J

    const-wide/16 v2, 0x0

    cmp-long p1, v0, v2

    if-eqz p1, :cond_0

    return-void

    :cond_0
    new-instance p1, Ljava/lang/IllegalArgumentException;

    const-string v0, "Ge\u00e7ersiz OfflineTtsConfig"

    invoke-direct {p1, v0}, Ljava/lang/IllegalArgumentException;-><init>(Ljava/lang/String;)V

    throw p1
.end method

.method private native delete(J)V
.end method

.method private native generateWithConfigImpl(JLjava/lang/String;Lcom/k2fsa/sherpa/onnx/GenerationConfig;Ljava/lang/Object;)Lcom/k2fsa/sherpa/onnx/GeneratedAudio;
.end method

.method private native getSampleRate(J)I
.end method

.method private native newFromFile(Lcom/k2fsa/sherpa/onnx/OfflineTtsConfig;)J
.end method


# virtual methods
.method public generateWithConfig(Ljava/lang/String;Lcom/k2fsa/sherpa/onnx/GenerationConfig;)Lcom/k2fsa/sherpa/onnx/GeneratedAudio;
    .locals 6

    .line 8
    iget-wide v1, p0, Lcom/k2fsa/sherpa/onnx/OfflineTts;->ptr:J

    const/4 v5, 0x0

    move-object v0, p0

    move-object v3, p1

    move-object v4, p2

    invoke-direct/range {v0 .. v5}, Lcom/k2fsa/sherpa/onnx/OfflineTts;->generateWithConfigImpl(JLjava/lang/String;Lcom/k2fsa/sherpa/onnx/GenerationConfig;Ljava/lang/Object;)Lcom/k2fsa/sherpa/onnx/GeneratedAudio;

    move-result-object p1

    return-object p1
.end method

.method public release()V
    .locals 4

    .line 9
    iget-wide v0, p0, Lcom/k2fsa/sherpa/onnx/OfflineTts;->ptr:J

    const-wide/16 v2, 0x0

    cmp-long v0, v0, v2

    if-eqz v0, :cond_0

    iget-wide v0, p0, Lcom/k2fsa/sherpa/onnx/OfflineTts;->ptr:J

    invoke-direct {p0, v0, v1}, Lcom/k2fsa/sherpa/onnx/OfflineTts;->delete(J)V

    iput-wide v2, p0, Lcom/k2fsa/sherpa/onnx/OfflineTts;->ptr:J

    :cond_0
    return-void
.end method

.method public sampleRate()I
    .locals 2

    .line 7
    iget-wide v0, p0, Lcom/k2fsa/sherpa/onnx/OfflineTts;->ptr:J

    invoke-direct {p0, v0, v1}, Lcom/k2fsa/sherpa/onnx/OfflineTts;->getSampleRate(J)I

    move-result v0

    return v0
.end method
