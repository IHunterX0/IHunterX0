.class public Lcom/k2fsa/sherpa/onnx/GenerationConfig;
.super Ljava/lang/Object;
.source "GenerationConfig.java"


# instance fields
.field public extra:Ljava/util/Map;
    .annotation system Ldalvik/annotation/Signature;
        value = {
            "Ljava/util/Map<",
            "Ljava/lang/String;",
            "Ljava/lang/String;",
            ">;"
        }
    .end annotation
.end field

.field public numSteps:I

.field public referenceAudio:[F

.field public referenceSampleRate:I

.field public referenceText:Ljava/lang/String;

.field public sid:I

.field public silenceScale:F

.field public speed:F


# direct methods
.method public constructor <init>()V
    .locals 2

    .line 2
    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    const v0, 0x3e4ccccd    # 0.2f

    iput v0, p0, Lcom/k2fsa/sherpa/onnx/GenerationConfig;->silenceScale:F

    const/high16 v0, 0x3f800000    # 1.0f

    iput v0, p0, Lcom/k2fsa/sherpa/onnx/GenerationConfig;->speed:F

    const/4 v0, 0x0

    iput v0, p0, Lcom/k2fsa/sherpa/onnx/GenerationConfig;->sid:I

    const/4 v1, 0x0

    iput-object v1, p0, Lcom/k2fsa/sherpa/onnx/GenerationConfig;->referenceAudio:[F

    iput v0, p0, Lcom/k2fsa/sherpa/onnx/GenerationConfig;->referenceSampleRate:I

    iput-object v1, p0, Lcom/k2fsa/sherpa/onnx/GenerationConfig;->referenceText:Ljava/lang/String;

    const/4 v0, 0x5

    iput v0, p0, Lcom/k2fsa/sherpa/onnx/GenerationConfig;->numSteps:I

    iput-object v1, p0, Lcom/k2fsa/sherpa/onnx/GenerationConfig;->extra:Ljava/util/Map;

    return-void
.end method
