.class Lcom/dogac/bin1/Yama$2;
.super Ljava/lang/Object;
.source "Yama.java"

# interfaces
.implements Ljava/lang/Runnable;


# annotations
.annotation system Ldalvik/annotation/EnclosingMethod;
    value = Lcom/dogac/bin1/Yama;->sonuc(Landroid/app/Activity;IILandroid/content/Intent;)Z
.end annotation

.annotation system Ldalvik/annotation/InnerClass;
    accessFlags = 0x0
    name = null
.end annotation


# instance fields
.field final synthetic val$boyut:J

.field final synthetic val$dosyaAdi:Ljava/lang/String;

.field final synthetic val$in:Ljava/io/InputStream;


# direct methods
.method constructor <init>(Ljava/io/InputStream;JLjava/lang/String;)V
    .locals 0
    .annotation system Ldalvik/annotation/Signature;
        value = {
            "()V"
        }
    .end annotation

    .line 108
    iput-object p1, p0, Lcom/dogac/bin1/Yama$2;->val$in:Ljava/io/InputStream;

    iput-wide p2, p0, Lcom/dogac/bin1/Yama$2;->val$boyut:J

    iput-object p4, p0, Lcom/dogac/bin1/Yama$2;->val$dosyaAdi:Ljava/lang/String;

    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    return-void
.end method


# virtual methods
.method public run()V
    .locals 4

    .line 108
    iget-object v0, p0, Lcom/dogac/bin1/Yama$2;->val$in:Ljava/io/InputStream;

    iget-wide v1, p0, Lcom/dogac/bin1/Yama$2;->val$boyut:J

    iget-object v3, p0, Lcom/dogac/bin1/Yama$2;->val$dosyaAdi:Ljava/lang/String;

    invoke-static {v0, v1, v2, v3}, Lcom/dogac/bin1/Yama;->kur(Ljava/io/InputStream;JLjava/lang/String;)Ljava/lang/String;

    move-result-object v0

    invoke-static {v0}, Lcom/dogac/bin1/Yama;->bildir(Ljava/lang/String;)V

    return-void
.end method
