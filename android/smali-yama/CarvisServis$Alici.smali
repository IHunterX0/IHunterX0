.class Lcom/dogac/bin1/CarvisServis$Alici;
.super Landroid/content/BroadcastReceiver;
.source "CarvisServis.java"


# Rahatsız Etmeyin / ekran / şarj değişince CarvisServis.durumDegisti() çağırır
.field final s:Lcom/dogac/bin1/CarvisServis;


.method constructor <init>(Lcom/dogac/bin1/CarvisServis;)V
    .locals 0

    invoke-direct {p0}, Landroid/content/BroadcastReceiver;-><init>()V

    iput-object p1, p0, Lcom/dogac/bin1/CarvisServis$Alici;->s:Lcom/dogac/bin1/CarvisServis;

    return-void
.end method

.method public onReceive(Landroid/content/Context;Landroid/content/Intent;)V
    .locals 1

    iget-object v0, p0, Lcom/dogac/bin1/CarvisServis$Alici;->s:Lcom/dogac/bin1/CarvisServis;

    invoke-virtual {v0}, Lcom/dogac/bin1/CarvisServis;->durumDegisti()V

    return-void
.end method
