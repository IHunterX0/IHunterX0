.class public Lcom/k2fsa/sherpa/onnx/GeneratedAudio;
.super Ljava/lang/Object;
.source "GeneratedAudio.java"


# instance fields
.field public final sampleRate:I

.field public final samples:[F


# direct methods
.method public constructor <init>([FI)V
    .locals 0

    .line 2
    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    iput-object p1, p0, Lcom/k2fsa/sherpa/onnx/GeneratedAudio;->samples:[F

    iput p2, p0, Lcom/k2fsa/sherpa/onnx/GeneratedAudio;->sampleRate:I

    return-void
.end method
