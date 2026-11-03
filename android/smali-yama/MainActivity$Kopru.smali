.class Lcom/dogac/bin1/MainActivity$Kopru;
.super Ljava/lang/Object;
.source "MainActivity.java"


# annotations
.annotation system Ldalvik/annotation/EnclosingClass;
    value = Lcom/dogac/bin1/MainActivity;
.end annotation

.annotation system Ldalvik/annotation/InnerClass;
    accessFlags = 0x0
    name = "Kopru"
.end annotation


# instance fields
.field final synthetic this$0:Lcom/dogac/bin1/MainActivity;


# direct methods
.method public static synthetic $r8$lambda$8Y2CrdYW2zdjz0frrw4EUOBKGDQ(Lcom/dogac/bin1/MainActivity$Kopru;)V
    .locals 0

    invoke-direct {p0}, Lcom/dogac/bin1/MainActivity$Kopru;->lambda$sesAyarla$3()V

    return-void
.end method

.method public static synthetic $r8$lambda$EQlMaSAMCS-MOyKc1ZxZYe1A8UA(Lcom/dogac/bin1/MainActivity$Kopru;)V
    .locals 0

    invoke-direct {p0}, Lcom/dogac/bin1/MainActivity$Kopru;->lambda$erisimAyarAc$4()V

    return-void
.end method

.method public static synthetic $r8$lambda$M2AYSpcFdz3jWS-uyNNQg_O2QOw(Lcom/dogac/bin1/MainActivity$Kopru;)V
    .locals 0

    invoke-direct {p0}, Lcom/dogac/bin1/MainActivity$Kopru;->lambda$dinlemeyiKes$2()V

    return-void
.end method

.method public static synthetic $r8$lambda$Pypyewpaatk4WOTLMXItVHvZwVU(Lcom/dogac/bin1/MainActivity$Kopru;)V
    .locals 0

    invoke-direct {p0}, Lcom/dogac/bin1/MainActivity$Kopru;->lambda$sus$1()V

    return-void
.end method

.method public static synthetic $r8$lambda$_bgyZ4I4l3rLDM5DUynt_QeNQMY(Lcom/dogac/bin1/MainActivity$Kopru;)V
    .locals 0

    invoke-direct {p0}, Lcom/dogac/bin1/MainActivity$Kopru;->lambda$kullanimIzniAc$6()V

    return-void
.end method

.method public static synthetic $r8$lambda$drtaCzREa8oVWqwd1S0Y7iUN-tU(Lcom/dogac/bin1/MainActivity$Kopru;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V
    .locals 0

    invoke-direct {p0, p1, p2, p3}, Lcom/dogac/bin1/MainActivity$Kopru;->lambda$konus$0(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V

    return-void
.end method

.method public static synthetic $r8$lambda$zr7MdqXp-U6U5RkGicBylRpn8pc(Lcom/dogac/bin1/MainActivity$Kopru;Z)V
    .locals 0

    invoke-direct {p0, p1}, Lcom/dogac/bin1/MainActivity$Kopru;->lambda$uyandirma$5(Z)V

    return-void
.end method

.method constructor <init>(Lcom/dogac/bin1/MainActivity;)V
    .locals 0
    .param p1, "this$0"    # Lcom/dogac/bin1/MainActivity;

    .line 291
    iput-object p1, p0, Lcom/dogac/bin1/MainActivity$Kopru;->this$0:Lcom/dogac/bin1/MainActivity;

    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    return-void
.end method

.method private synthetic lambda$dinlemeyiKes$2()V
    .locals 1

    .line 307
    iget-object v0, p0, Lcom/dogac/bin1/MainActivity$Kopru;->this$0:Lcom/dogac/bin1/MainActivity;

    iget-object v0, v0, Lcom/dogac/bin1/MainActivity;->tanima:Landroid/speech/SpeechRecognizer;

    if-eqz v0, :cond_0

    iget-object v0, p0, Lcom/dogac/bin1/MainActivity$Kopru;->this$0:Lcom/dogac/bin1/MainActivity;

    iget-object v0, v0, Lcom/dogac/bin1/MainActivity;->tanima:Landroid/speech/SpeechRecognizer;

    invoke-virtual {v0}, Landroid/speech/SpeechRecognizer;->cancel()V

    :cond_0
    invoke-static {}, Lcom/dogac/bin1/CarvisServis;->mikrofonuAl()V

    return-void
.end method

.method private synthetic lambda$erisimAyarAc$4()V
    .locals 3

    .line 333
    :try_start_0
    iget-object v0, p0, Lcom/dogac/bin1/MainActivity$Kopru;->this$0:Lcom/dogac/bin1/MainActivity;

    new-instance v1, Landroid/content/Intent;

    const-string v2, "android.settings.ACCESSIBILITY_SETTINGS"

    invoke-direct {v1, v2}, Landroid/content/Intent;-><init>(Ljava/lang/String;)V

    invoke-virtual {v0, v1}, Lcom/dogac/bin1/MainActivity;->startActivity(Landroid/content/Intent;)V
    :try_end_0
    .catch Ljava/lang/Exception; {:try_start_0 .. :try_end_0} :catch_0

    goto :goto_0

    :catch_0
    move-exception v0

    :goto_0
    return-void
.end method

.method private synthetic lambda$konus$0(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V
    .locals 3
    .param p1, "id"    # Ljava/lang/String;
    .param p2, "hiz"    # Ljava/lang/String;
    .param p3, "metin"    # Ljava/lang/String;

    .line 297
    iget-object v0, p0, Lcom/dogac/bin1/MainActivity$Kopru;->this$0:Lcom/dogac/bin1/MainActivity;

    iget-boolean v0, v0, Lcom/dogac/bin1/MainActivity;->ttsHazir:Z

    if-nez v0, :cond_0

    iget-object v0, p0, Lcom/dogac/bin1/MainActivity$Kopru;->this$0:Lcom/dogac/bin1/MainActivity;

    new-instance v1, Ljava/lang/StringBuilder;

    invoke-direct {v1}, Ljava/lang/StringBuilder;-><init>()V

    const-string v2, "carvisYerel.konusmaBitti("

    invoke-virtual {v1, v2}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v1

    invoke-static {p1}, Lcom/dogac/bin1/MainActivity;->jsStr(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v2

    invoke-virtual {v1, v2}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v1

    const-string v2, ")"

    invoke-virtual {v1, v2}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v1

    invoke-virtual {v1}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v1

    invoke-virtual {v0, v1}, Lcom/dogac/bin1/MainActivity;->js(Ljava/lang/String;)V

    return-void

    .line 298
    :cond_0
    :try_start_0
    iget-object v0, p0, Lcom/dogac/bin1/MainActivity$Kopru;->this$0:Lcom/dogac/bin1/MainActivity;

    iget-object v0, v0, Lcom/dogac/bin1/MainActivity;->tts:Landroid/speech/tts/TextToSpeech;

    invoke-static {p2}, Ljava/lang/Float;->parseFloat(Ljava/lang/String;)F

    move-result v1

    invoke-virtual {v0, v1}, Landroid/speech/tts/TextToSpeech;->setSpeechRate(F)I
    :try_end_0
    .catch Ljava/lang/Exception; {:try_start_0 .. :try_end_0} :catch_0

    goto :goto_0

    :catch_0
    move-exception v0

    .line 299
    :goto_0
    invoke-static {}, Lcom/dogac/bin1/CarvisServis;->konusmaBasladi()V

    .line 300
    if-nez p3, :cond_1

    const-string v0, ""

    goto :goto_1

    :cond_1
    move-object v0, p3

    :goto_1
    sput-object v0, Lcom/dogac/bin1/CarvisServis;->sonKonusma:Ljava/lang/String;

    .line 301
    new-instance v0, Landroid/os/Bundle;

    invoke-direct {v0}, Landroid/os/Bundle;-><init>()V

    .line 302
    .local v0, "p":Landroid/os/Bundle;
    iget-object v1, p0, Lcom/dogac/bin1/MainActivity$Kopru;->this$0:Lcom/dogac/bin1/MainActivity;

    iget-object v1, v1, Lcom/dogac/bin1/MainActivity;->tts:Landroid/speech/tts/TextToSpeech;

    const/4 v2, 0x0

    invoke-virtual {v1, p3, v2, v0, p1}, Landroid/speech/tts/TextToSpeech;->speak(Ljava/lang/CharSequence;ILandroid/os/Bundle;Ljava/lang/String;)I

    .line 303
    return-void
.end method

.method private synthetic lambda$kullanimIzniAc$6()V
    .locals 3

    .line 348
    :try_start_0
    iget-object v0, p0, Lcom/dogac/bin1/MainActivity$Kopru;->this$0:Lcom/dogac/bin1/MainActivity;

    new-instance v1, Landroid/content/Intent;

    const-string v2, "android.settings.USAGE_ACCESS_SETTINGS"

    invoke-direct {v1, v2}, Landroid/content/Intent;-><init>(Ljava/lang/String;)V

    invoke-virtual {v0, v1}, Lcom/dogac/bin1/MainActivity;->startActivity(Landroid/content/Intent;)V
    :try_end_0
    .catch Ljava/lang/Exception; {:try_start_0 .. :try_end_0} :catch_0

    goto :goto_0

    :catch_0
    move-exception v0

    :goto_0
    return-void
.end method

.method private synthetic lambda$sesAyarla$3()V
    .locals 1

    .line 323
    iget-object v0, p0, Lcom/dogac/bin1/MainActivity$Kopru;->this$0:Lcom/dogac/bin1/MainActivity;

    iget-object v0, v0, Lcom/dogac/bin1/MainActivity;->tts:Landroid/speech/tts/TextToSpeech;

    if-eqz v0, :cond_0

    iget-object v0, p0, Lcom/dogac/bin1/MainActivity$Kopru;->this$0:Lcom/dogac/bin1/MainActivity;

    iget-boolean v0, v0, Lcom/dogac/bin1/MainActivity;->ttsHazir:Z

    if-eqz v0, :cond_0

    iget-object v0, p0, Lcom/dogac/bin1/MainActivity$Kopru;->this$0:Lcom/dogac/bin1/MainActivity;

    invoke-virtual {v0}, Lcom/dogac/bin1/MainActivity;->sesUygula()V

    :cond_0
    return-void
.end method

.method private synthetic lambda$sus$1()V
    .locals 1

    .line 305
    iget-object v0, p0, Lcom/dogac/bin1/MainActivity$Kopru;->this$0:Lcom/dogac/bin1/MainActivity;

    iget-object v0, v0, Lcom/dogac/bin1/MainActivity;->tts:Landroid/speech/tts/TextToSpeech;

    if-eqz v0, :cond_0

    iget-object v0, p0, Lcom/dogac/bin1/MainActivity$Kopru;->this$0:Lcom/dogac/bin1/MainActivity;

    iget-object v0, v0, Lcom/dogac/bin1/MainActivity;->tts:Landroid/speech/tts/TextToSpeech;

    invoke-virtual {v0}, Landroid/speech/tts/TextToSpeech;->stop()I

    :cond_0
    return-void
.end method

.method private synthetic lambda$uyandirma$5(Z)V
    .locals 4
    .param p1, "acik"    # Z

    .line 336
    iget-object v0, p0, Lcom/dogac/bin1/MainActivity$Kopru;->this$0:Lcom/dogac/bin1/MainActivity;

    iput-boolean p1, v0, Lcom/dogac/bin1/MainActivity;->uyandirmaIstendi:Z

    .line 337
    iget-object v0, p0, Lcom/dogac/bin1/MainActivity$Kopru;->this$0:Lcom/dogac/bin1/MainActivity;

    const-string v1, "carvis"

    const/4 v2, 0x0

    invoke-virtual {v0, v1, v2}, Lcom/dogac/bin1/MainActivity;->getSharedPreferences(Ljava/lang/String;I)Landroid/content/SharedPreferences;

    move-result-object v0

    invoke-interface {v0}, Landroid/content/SharedPreferences;->edit()Landroid/content/SharedPreferences$Editor;

    move-result-object v0

    const-string v1, "uyandirma"

    invoke-interface {v0, v1, p1}, Landroid/content/SharedPreferences$Editor;->putBoolean(Ljava/lang/String;Z)Landroid/content/SharedPreferences$Editor;

    move-result-object v0

    invoke-interface {v0}, Landroid/content/SharedPreferences$Editor;->apply()V

    .line 338
    if-eqz p1, :cond_1

    iget-object v0, p0, Lcom/dogac/bin1/MainActivity$Kopru;->this$0:Lcom/dogac/bin1/MainActivity;

    invoke-virtual {v0}, Lcom/dogac/bin1/MainActivity;->mikrofonVar()Z

    move-result v0

    if-nez v0, :cond_0

    iget-object v0, p0, Lcom/dogac/bin1/MainActivity$Kopru;->this$0:Lcom/dogac/bin1/MainActivity;

    const/4 v1, 0x1

    new-array v1, v1, [Ljava/lang/String;

    const-string v3, "android.permission.RECORD_AUDIO"

    aput-object v3, v1, v2

    const/16 v2, 0xb

    invoke-virtual {v0, v1, v2}, Lcom/dogac/bin1/MainActivity;->requestPermissions([Ljava/lang/String;I)V

    goto :goto_0

    :cond_0
    iget-object v0, p0, Lcom/dogac/bin1/MainActivity$Kopru;->this$0:Lcom/dogac/bin1/MainActivity;

    invoke-virtual {v0}, Lcom/dogac/bin1/MainActivity;->servisBaslat()V

    goto :goto_0

    .line 339
    :cond_1
    iget-object v0, p0, Lcom/dogac/bin1/MainActivity$Kopru;->this$0:Lcom/dogac/bin1/MainActivity;

    new-instance v1, Landroid/content/Intent;

    iget-object v2, p0, Lcom/dogac/bin1/MainActivity$Kopru;->this$0:Lcom/dogac/bin1/MainActivity;

    const-class v3, Lcom/dogac/bin1/CarvisServis;

    invoke-direct {v1, v2, v3}, Landroid/content/Intent;-><init>(Landroid/content/Context;Ljava/lang/Class;)V

    invoke-virtual {v0, v1}, Lcom/dogac/bin1/MainActivity;->stopService(Landroid/content/Intent;)Z

    .line 340
    :goto_0
    return-void
.end method


# virtual methods
.method public anahtar()Ljava/lang/String;
    .locals 1
    .annotation runtime Landroid/webkit/JavascriptInterface;
    .end annotation

    .line 292
    const-string v0, "GEMINI_ANAHTARI_KALDIRILDI"

    return-object v0
.end method

.method public arkaPlan(Z)V
    .locals 3
    .param p1, "acik"    # Z
    .annotation runtime Landroid/webkit/JavascriptInterface;
    .end annotation

    .line 312
    iget-object v0, p0, Lcom/dogac/bin1/MainActivity$Kopru;->this$0:Lcom/dogac/bin1/MainActivity;

    const-string v1, "carvis"

    const/4 v2, 0x0

    invoke-virtual {v0, v1, v2}, Lcom/dogac/bin1/MainActivity;->getSharedPreferences(Ljava/lang/String;I)Landroid/content/SharedPreferences;

    move-result-object v0

    invoke-interface {v0}, Landroid/content/SharedPreferences;->edit()Landroid/content/SharedPreferences$Editor;

    move-result-object v0

    const-string v1, "arkaPlan"

    invoke-interface {v0, v1, p1}, Landroid/content/SharedPreferences$Editor;->putBoolean(Ljava/lang/String;Z)Landroid/content/SharedPreferences$Editor;

    move-result-object v0

    invoke-interface {v0}, Landroid/content/SharedPreferences$Editor;->apply()V

    return-void
.end method

.method public arkaPlanMi()Z
    .locals 3
    .annotation runtime Landroid/webkit/JavascriptInterface;
    .end annotation

    .line 313
    iget-object v0, p0, Lcom/dogac/bin1/MainActivity$Kopru;->this$0:Lcom/dogac/bin1/MainActivity;

    const-string v1, "carvis"

    const/4 v2, 0x0

    invoke-virtual {v0, v1, v2}, Lcom/dogac/bin1/MainActivity;->getSharedPreferences(Ljava/lang/String;I)Landroid/content/SharedPreferences;

    move-result-object v0

    const-string v1, "arkaPlan"

    const/4 v2, 0x1

    invoke-interface {v0, v1, v2}, Landroid/content/SharedPreferences;->getBoolean(Ljava/lang/String;Z)Z

    move-result v0

    return v0
.end method

.method public baglam(Ljava/lang/String;)V
    .locals 1
    .param p1, "b"    # Ljava/lang/String;
    .annotation runtime Landroid/webkit/JavascriptInterface;
    .end annotation

    .line 308
    iget-object v0, p0, Lcom/dogac/bin1/MainActivity$Kopru;->this$0:Lcom/dogac/bin1/MainActivity;

    iput-object p1, v0, Lcom/dogac/bin1/MainActivity;->dinlemeBaglami:Ljava/lang/String;

    return-void
.end method

.method public dinle()V
    .locals 3
    .annotation runtime Landroid/webkit/JavascriptInterface;
    .end annotation

    .line 306
    iget-object v0, p0, Lcom/dogac/bin1/MainActivity$Kopru;->this$0:Lcom/dogac/bin1/MainActivity;

    iget-object v1, p0, Lcom/dogac/bin1/MainActivity$Kopru;->this$0:Lcom/dogac/bin1/MainActivity;

    new-instance v2, Lcom/dogac/bin1/MainActivity$Kopru$$ExternalSyntheticLambda6;

    invoke-direct {v2, v1}, Lcom/dogac/bin1/MainActivity$Kopru$$ExternalSyntheticLambda6;-><init>(Lcom/dogac/bin1/MainActivity;)V

    invoke-virtual {v0, v2}, Lcom/dogac/bin1/MainActivity;->runOnUiThread(Ljava/lang/Runnable;)V

    return-void
.end method

.method public dinlemeyiKes()V
    .locals 2
    .annotation runtime Landroid/webkit/JavascriptInterface;
    .end annotation

    .line 307
    const/4 v0, 0x1

    sput-boolean v0, Lcom/dogac/bin1/Cihaz;->iptal:Z

    iget-object v0, p0, Lcom/dogac/bin1/MainActivity$Kopru;->this$0:Lcom/dogac/bin1/MainActivity;

    new-instance v1, Lcom/dogac/bin1/MainActivity$Kopru$$ExternalSyntheticLambda4;

    invoke-direct {v1, p0}, Lcom/dogac/bin1/MainActivity$Kopru$$ExternalSyntheticLambda4;-><init>(Lcom/dogac/bin1/MainActivity$Kopru;)V

    invoke-virtual {v0, v1}, Lcom/dogac/bin1/MainActivity;->runOnUiThread(Ljava/lang/Runnable;)V

    return-void
.end method

.method public erisimAcik()Z
    .locals 1
    .annotation runtime Landroid/webkit/JavascriptInterface;
    .end annotation

    .line 332
    invoke-static {}, Lcom/dogac/bin1/CarvisErisim;->aktif()Z

    move-result v0

    return v0
.end method

.method public erisimAyarAc()V
    .locals 2
    .annotation runtime Landroid/webkit/JavascriptInterface;
    .end annotation

    .line 333
    iget-object v0, p0, Lcom/dogac/bin1/MainActivity$Kopru;->this$0:Lcom/dogac/bin1/MainActivity;

    new-instance v1, Lcom/dogac/bin1/MainActivity$Kopru$$ExternalSyntheticLambda8;

    invoke-direct {v1, p0}, Lcom/dogac/bin1/MainActivity$Kopru$$ExternalSyntheticLambda8;-><init>(Lcom/dogac/bin1/MainActivity$Kopru;)V

    invoke-virtual {v0, v1}, Lcom/dogac/bin1/MainActivity;->runOnUiThread(Ljava/lang/Runnable;)V

    return-void
.end method

.method public groqAnahtar()Ljava/lang/String;
    .locals 1
    .annotation runtime Landroid/webkit/JavascriptInterface;
    .end annotation

    .line 293
    const-string v0, "GROQ_ANAHTARI_KALDIRILDI"

    return-object v0
.end method

.method public kaydet(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;
    .locals 1
    .param p1, "ad"    # Ljava/lang/String;
    .param p2, "b64"    # Ljava/lang/String;
    .param p3, "tip"    # Ljava/lang/String;
    .annotation runtime Landroid/webkit/JavascriptInterface;
    .end annotation

    .line 294
    iget-object v0, p0, Lcom/dogac/bin1/MainActivity$Kopru;->this$0:Lcom/dogac/bin1/MainActivity;

    invoke-virtual {v0, p1, p2, p3}, Lcom/dogac/bin1/MainActivity;->indirilenlereKaydet(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;

    move-result-object v0

    return-object v0
.end method

.method public konus(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V
    .locals 2
    .param p1, "metin"    # Ljava/lang/String;
    .param p2, "id"    # Ljava/lang/String;
    .param p3, "hiz"    # Ljava/lang/String;
    .annotation runtime Landroid/webkit/JavascriptInterface;
    .end annotation

    .line 296
    iget-object v0, p0, Lcom/dogac/bin1/MainActivity$Kopru;->this$0:Lcom/dogac/bin1/MainActivity;

    new-instance v1, Lcom/dogac/bin1/MainActivity$Kopru$$ExternalSyntheticLambda1;

    invoke-direct {v1, p0, p2, p3, p1}, Lcom/dogac/bin1/MainActivity$Kopru$$ExternalSyntheticLambda1;-><init>(Lcom/dogac/bin1/MainActivity$Kopru;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V

    invoke-virtual {v0, v1}, Lcom/dogac/bin1/MainActivity;->runOnUiThread(Ljava/lang/Runnable;)V

    .line 304
    return-void
.end method

.method public kullanim()Ljava/lang/String;
    .locals 14
    .annotation runtime Landroid/webkit/JavascriptInterface;
    .end annotation

    .line 351
    :try_start_0
    iget-object v0, p0, Lcom/dogac/bin1/MainActivity$Kopru;->this$0:Lcom/dogac/bin1/MainActivity;

    const-string v1, "usagestats"

    invoke-virtual {v0, v1}, Lcom/dogac/bin1/MainActivity;->getSystemService(Ljava/lang/String;)Ljava/lang/Object;

    move-result-object v0

    check-cast v0, Landroid/app/usage/UsageStatsManager;

    .line 352
    .local v0, "um":Landroid/app/usage/UsageStatsManager;
    invoke-static {}, Ljava/util/Calendar;->getInstance()Ljava/util/Calendar;

    move-result-object v1

    .local v1, "c":Ljava/util/Calendar;
    const/16 v2, 0xb

    const/4 v3, 0x0

    invoke-virtual {v1, v2, v3}, Ljava/util/Calendar;->set(II)V

    const/16 v2, 0xc

    invoke-virtual {v1, v2, v3}, Ljava/util/Calendar;->set(II)V

    const/16 v2, 0xd

    invoke-virtual {v1, v2, v3}, Ljava/util/Calendar;->set(II)V

    .line 353
    invoke-virtual {v1}, Ljava/util/Calendar;->getTimeInMillis()J

    move-result-wide v4

    invoke-static {}, Ljava/lang/System;->currentTimeMillis()J

    move-result-wide v6

    invoke-virtual {v0, v4, v5, v6, v7}, Landroid/app/usage/UsageStatsManager;->queryAndAggregateUsageStats(JJ)Ljava/util/Map;

    move-result-object v2

    .line 354
    .local v2, "l":Ljava/util/Map;, "Ljava/util/Map<Ljava/lang/String;Landroid/app/usage/UsageStats;>;"
    new-instance v4, Lorg/json/JSONArray;

    invoke-direct {v4}, Lorg/json/JSONArray;-><init>()V

    .line 355
    .local v4, "j":Lorg/json/JSONArray;
    iget-object v5, p0, Lcom/dogac/bin1/MainActivity$Kopru;->this$0:Lcom/dogac/bin1/MainActivity;

    invoke-virtual {v5}, Lcom/dogac/bin1/MainActivity;->getPackageManager()Landroid/content/pm/PackageManager;

    move-result-object v5

    .line 356
    .local v5, "pm":Landroid/content/pm/PackageManager;
    invoke-interface {v2}, Ljava/util/Map;->values()Ljava/util/Collection;

    move-result-object v6

    invoke-interface {v6}, Ljava/util/Collection;->iterator()Ljava/util/Iterator;

    move-result-object v6

    :goto_0
    invoke-interface {v6}, Ljava/util/Iterator;->hasNext()Z

    move-result v7

    if-eqz v7, :cond_1

    invoke-interface {v6}, Ljava/util/Iterator;->next()Ljava/lang/Object;

    move-result-object v7

    check-cast v7, Landroid/app/usage/UsageStats;

    .line 357
    .local v7, "s":Landroid/app/usage/UsageStats;
    invoke-virtual {v7}, Landroid/app/usage/UsageStats;->getTotalTimeInForeground()J

    move-result-wide v8

    const-wide/32 v10, 0xea60

    div-long/2addr v8, v10

    .local v8, "dk":J
    const-wide/16 v10, 0x1

    cmp-long v10, v8, v10

    if-gez v10, :cond_0

    goto :goto_0

    .line 358
    :cond_0
    invoke-virtual {v7}, Landroid/app/usage/UsageStats;->getPackageName()Ljava/lang/String;

    move-result-object v10
    :try_end_0
    .catch Ljava/lang/Exception; {:try_start_0 .. :try_end_0} :catch_1

    .line 359
    .local v10, "ad":Ljava/lang/String;
    :try_start_1
    invoke-virtual {v7}, Landroid/app/usage/UsageStats;->getPackageName()Ljava/lang/String;

    move-result-object v11

    invoke-virtual {v5, v11, v3}, Landroid/content/pm/PackageManager;->getApplicationInfo(Ljava/lang/String;I)Landroid/content/pm/ApplicationInfo;

    move-result-object v11

    invoke-virtual {v5, v11}, Landroid/content/pm/PackageManager;->getApplicationLabel(Landroid/content/pm/ApplicationInfo;)Ljava/lang/CharSequence;

    move-result-object v11

    invoke-virtual {v11}, Ljava/lang/Object;->toString()Ljava/lang/String;

    move-result-object v11
    :try_end_1
    .catch Ljava/lang/Exception; {:try_start_1 .. :try_end_1} :catch_0

    move-object v10, v11

    goto :goto_1

    :catch_0
    move-exception v11

    .line 360
    :goto_1
    :try_start_2
    new-instance v11, Lorg/json/JSONObject;

    invoke-direct {v11}, Lorg/json/JSONObject;-><init>()V

    const-string v12, "paket"

    invoke-virtual {v7}, Landroid/app/usage/UsageStats;->getPackageName()Ljava/lang/String;

    move-result-object v13

    invoke-virtual {v11, v12, v13}, Lorg/json/JSONObject;->put(Ljava/lang/String;Ljava/lang/Object;)Lorg/json/JSONObject;

    move-result-object v11

    const-string v12, "ad"

    invoke-virtual {v11, v12, v10}, Lorg/json/JSONObject;->put(Ljava/lang/String;Ljava/lang/Object;)Lorg/json/JSONObject;

    move-result-object v11

    const-string v12, "dk"

    invoke-virtual {v11, v12, v8, v9}, Lorg/json/JSONObject;->put(Ljava/lang/String;J)Lorg/json/JSONObject;

    move-result-object v11

    invoke-virtual {v4, v11}, Lorg/json/JSONArray;->put(Ljava/lang/Object;)Lorg/json/JSONArray;

    .line 361
    nop

    .end local v7    # "s":Landroid/app/usage/UsageStats;
    .end local v8    # "dk":J
    .end local v10    # "ad":Ljava/lang/String;
    goto :goto_0

    .line 362
    :cond_1
    invoke-virtual {v4}, Lorg/json/JSONArray;->toString()Ljava/lang/String;

    move-result-object v3
    :try_end_2
    .catch Ljava/lang/Exception; {:try_start_2 .. :try_end_2} :catch_1

    return-object v3

    .line 363
    .end local v0    # "um":Landroid/app/usage/UsageStatsManager;
    .end local v1    # "c":Ljava/util/Calendar;
    .end local v2    # "l":Ljava/util/Map;, "Ljava/util/Map<Ljava/lang/String;Landroid/app/usage/UsageStats;>;"
    .end local v4    # "j":Lorg/json/JSONArray;
    .end local v5    # "pm":Landroid/content/pm/PackageManager;
    :catch_1
    move-exception v0

    .local v0, "e":Ljava/lang/Exception;
    const-string v1, "[]"

    return-object v1
.end method

.method public kullanimIzniAc()V
    .locals 2
    .annotation runtime Landroid/webkit/JavascriptInterface;
    .end annotation

    .line 348
    iget-object v0, p0, Lcom/dogac/bin1/MainActivity$Kopru;->this$0:Lcom/dogac/bin1/MainActivity;

    new-instance v1, Lcom/dogac/bin1/MainActivity$Kopru$$ExternalSyntheticLambda7;

    invoke-direct {v1, p0}, Lcom/dogac/bin1/MainActivity$Kopru$$ExternalSyntheticLambda7;-><init>(Lcom/dogac/bin1/MainActivity$Kopru;)V

    invoke-virtual {v0, v1}, Lcom/dogac/bin1/MainActivity;->runOnUiThread(Ljava/lang/Runnable;)V

    return-void
.end method

.method public kullanimIzniVar()Z
    .locals 4
    .annotation runtime Landroid/webkit/JavascriptInterface;
    .end annotation

    .line 344
    iget-object v0, p0, Lcom/dogac/bin1/MainActivity$Kopru;->this$0:Lcom/dogac/bin1/MainActivity;

    const-string v1, "appops"

    invoke-virtual {v0, v1}, Lcom/dogac/bin1/MainActivity;->getSystemService(Ljava/lang/String;)Ljava/lang/Object;

    move-result-object v0

    check-cast v0, Landroid/app/AppOpsManager;

    .line 345
    .local v0, "ao":Landroid/app/AppOpsManager;
    invoke-static {}, Landroid/os/Process;->myUid()I

    move-result v1

    iget-object v2, p0, Lcom/dogac/bin1/MainActivity$Kopru;->this$0:Lcom/dogac/bin1/MainActivity;

    invoke-virtual {v2}, Lcom/dogac/bin1/MainActivity;->getPackageName()Ljava/lang/String;

    move-result-object v2

    const-string v3, "android:get_usage_stats"

    invoke-virtual {v0, v3, v1, v2}, Landroid/app/AppOpsManager;->checkOpNoThrow(Ljava/lang/String;ILjava/lang/String;)I

    move-result v1

    .line 346
    .local v1, "m":I
    if-nez v1, :cond_0

    const/4 v2, 0x1

    goto :goto_0

    :cond_0
    const/4 v2, 0x0

    :goto_0
    return v2
.end method

.method public medya(Ljava/lang/String;)Ljava/lang/String;
    .locals 1
    .param p1, "komut"    # Ljava/lang/String;
    .annotation runtime Landroid/webkit/JavascriptInterface;
    .end annotation

    .line 327
    iget-object v0, p0, Lcom/dogac/bin1/MainActivity$Kopru;->this$0:Lcom/dogac/bin1/MainActivity;

    invoke-static {v0, p1}, Lcom/dogac/bin1/Cihaz;->medya(Landroid/content/Context;Ljava/lang/String;)Ljava/lang/String;

    move-result-object v0

    return-object v0
.end method

.method public muzik(Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;
    .locals 1
    .param p1, "sorgu"    # Ljava/lang/String;
    .param p2, "uygulama"    # Ljava/lang/String;
    .annotation runtime Landroid/webkit/JavascriptInterface;
    .end annotation

    .line 328
    iget-object v0, p0, Lcom/dogac/bin1/MainActivity$Kopru;->this$0:Lcom/dogac/bin1/MainActivity;

    invoke-static {v0, p1, p2}, Lcom/dogac/bin1/Cihaz;->muzik(Landroid/app/Activity;Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;

    move-result-object v0

    return-object v0
.end method

.method public onPlandaMi()Z
    .locals 1
    .annotation runtime Landroid/webkit/JavascriptInterface;
    .end annotation

    .line 310
    iget-object v0, p0, Lcom/dogac/bin1/MainActivity$Kopru;->this$0:Lcom/dogac/bin1/MainActivity;

    iget-boolean v0, v0, Lcom/dogac/bin1/MainActivity;->onPlanda:Z

    return v0
.end method

.method public oneGetir()V
    .locals 3
    .annotation runtime Landroid/webkit/JavascriptInterface;
    .end annotation

    .line 311
    iget-object v0, p0, Lcom/dogac/bin1/MainActivity$Kopru;->this$0:Lcom/dogac/bin1/MainActivity;

    iget-object v1, p0, Lcom/dogac/bin1/MainActivity$Kopru;->this$0:Lcom/dogac/bin1/MainActivity;

    new-instance v2, Lcom/dogac/bin1/MainActivity$Kopru$$ExternalSyntheticLambda0;

    invoke-direct {v2, v1}, Lcom/dogac/bin1/MainActivity$Kopru$$ExternalSyntheticLambda0;-><init>(Lcom/dogac/bin1/MainActivity;)V

    invoke-virtual {v0, v2}, Lcom/dogac/bin1/MainActivity;->runOnUiThread(Ljava/lang/Runnable;)V

    return-void
.end method

.method public oturum(Z)V
    .locals 0
    .param p1, "acik"    # Z
    .annotation runtime Landroid/webkit/JavascriptInterface;
    .end annotation

    .line 309
    sput-boolean p1, Lcom/dogac/bin1/MainActivity;->oturumAcik:Z

    return-void
.end method

.method public secilenSes()Ljava/lang/String;
    .locals 4
    .annotation runtime Landroid/webkit/JavascriptInterface;
    .end annotation

    .line 320
    iget-object v0, p0, Lcom/dogac/bin1/MainActivity$Kopru;->this$0:Lcom/dogac/bin1/MainActivity;

    const-string v1, "carvis"

    const/4 v2, 0x0

    invoke-virtual {v0, v1, v2}, Lcom/dogac/bin1/MainActivity;->getSharedPreferences(Ljava/lang/String;I)Landroid/content/SharedPreferences;

    move-result-object v0

    .local v0, "sp":Landroid/content/SharedPreferences;
    new-instance v1, Ljava/lang/StringBuilder;

    invoke-direct {v1}, Ljava/lang/StringBuilder;-><init>()V

    const-string v2, "ses"

    const-string v3, "tr-tr-x-ama-local"

    invoke-interface {v0, v2, v3}, Landroid/content/SharedPreferences;->getString(Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;

    move-result-object v2

    invoke-virtual {v1, v2}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v1

    const-string v2, "|"

    invoke-virtual {v1, v2}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v1

    const-string v2, "perde"

    const v3, 0x3f59999a    # 0.85f

    invoke-interface {v0, v2, v3}, Landroid/content/SharedPreferences;->getFloat(Ljava/lang/String;F)F

    move-result v2

    invoke-virtual {v1, v2}, Ljava/lang/StringBuilder;->append(F)Ljava/lang/StringBuilder;

    move-result-object v1

    invoke-virtual {v1}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v1

    return-object v1
.end method

.method public sesAyarla(Ljava/lang/String;F)V
    .locals 3
    .param p1, "ad"    # Ljava/lang/String;
    .param p2, "perde"    # F
    .annotation runtime Landroid/webkit/JavascriptInterface;
    .end annotation

    .line 322
    iget-object v0, p0, Lcom/dogac/bin1/MainActivity$Kopru;->this$0:Lcom/dogac/bin1/MainActivity;

    const-string v1, "carvis"

    const/4 v2, 0x0

    invoke-virtual {v0, v1, v2}, Lcom/dogac/bin1/MainActivity;->getSharedPreferences(Ljava/lang/String;I)Landroid/content/SharedPreferences;

    move-result-object v0

    invoke-interface {v0}, Landroid/content/SharedPreferences;->edit()Landroid/content/SharedPreferences$Editor;

    move-result-object v0

    const-string v1, " (a\u011f)"

    const-string v2, ""

    invoke-virtual {p1, v1, v2}, Ljava/lang/String;->replace(Ljava/lang/CharSequence;Ljava/lang/CharSequence;)Ljava/lang/String;

    move-result-object v1

    const-string v2, "ses"

    invoke-interface {v0, v2, v1}, Landroid/content/SharedPreferences$Editor;->putString(Ljava/lang/String;Ljava/lang/String;)Landroid/content/SharedPreferences$Editor;

    move-result-object v0

    const v1, 0x3fcccccd    # 1.6f

    invoke-static {v1, p2}, Ljava/lang/Math;->min(FF)F

    move-result v1

    const/high16 v2, 0x3f000000    # 0.5f

    invoke-static {v2, v1}, Ljava/lang/Math;->max(FF)F

    move-result v1

    const-string v2, "perde"

    invoke-interface {v0, v2, v1}, Landroid/content/SharedPreferences$Editor;->putFloat(Ljava/lang/String;F)Landroid/content/SharedPreferences$Editor;

    move-result-object v0

    invoke-interface {v0}, Landroid/content/SharedPreferences$Editor;->apply()V

    .line 323
    iget-object v0, p0, Lcom/dogac/bin1/MainActivity$Kopru;->this$0:Lcom/dogac/bin1/MainActivity;

    new-instance v1, Lcom/dogac/bin1/MainActivity$Kopru$$ExternalSyntheticLambda2;

    invoke-direct {v1, p0}, Lcom/dogac/bin1/MainActivity$Kopru$$ExternalSyntheticLambda2;-><init>(Lcom/dogac/bin1/MainActivity$Kopru;)V

    invoke-virtual {v0, v1}, Lcom/dogac/bin1/MainActivity;->runOnUiThread(Ljava/lang/Runnable;)V

    .line 324
    return-void
.end method

.method public sesKaydi(Z)Ljava/lang/String;
    .locals 1
    .param p1, "basla"    # Z
    .annotation runtime Landroid/webkit/JavascriptInterface;
    .end annotation

    .line 331
    iget-object v0, p0, Lcom/dogac/bin1/MainActivity$Kopru;->this$0:Lcom/dogac/bin1/MainActivity;

    invoke-static {v0, p1}, Lcom/dogac/bin1/Cihaz;->sesKaydi(Landroid/app/Activity;Z)Ljava/lang/String;

    move-result-object v0

    return-object v0
.end method

.method public sesSeviyesi(I)Ljava/lang/String;
    .locals 1
    .param p1, "yuzde"    # I
    .annotation runtime Landroid/webkit/JavascriptInterface;
    .end annotation

    .line 326
    iget-object v0, p0, Lcom/dogac/bin1/MainActivity$Kopru;->this$0:Lcom/dogac/bin1/MainActivity;

    invoke-static {v0, p1}, Lcom/dogac/bin1/Cihaz;->sesSeviyesi(Landroid/content/Context;I)Ljava/lang/String;

    move-result-object v0

    return-object v0
.end method

.method public sesler()Ljava/lang/String;
    .locals 5
    .annotation runtime Landroid/webkit/JavascriptInterface;
    .end annotation

    .line 316
    new-instance v0, Lorg/json/JSONArray;

    invoke-direct {v0}, Lorg/json/JSONArray;-><init>()V

    .line 317
    .local v0, "j":Lorg/json/JSONArray;
    :try_start_0
    iget-object v1, p0, Lcom/dogac/bin1/MainActivity$Kopru;->this$0:Lcom/dogac/bin1/MainActivity;

    iget-object v1, v1, Lcom/dogac/bin1/MainActivity;->tts:Landroid/speech/tts/TextToSpeech;

    invoke-virtual {v1}, Landroid/speech/tts/TextToSpeech;->getVoices()Ljava/util/Set;

    move-result-object v1

    invoke-interface {v1}, Ljava/util/Set;->iterator()Ljava/util/Iterator;

    move-result-object v1

    :cond_0
    :goto_0
    invoke-interface {v1}, Ljava/util/Iterator;->hasNext()Z

    move-result v2

    if-eqz v2, :cond_2

    invoke-interface {v1}, Ljava/util/Iterator;->next()Ljava/lang/Object;

    move-result-object v2

    check-cast v2, Landroid/speech/tts/Voice;

    .local v2, "v":Landroid/speech/tts/Voice;
    const-string v3, "tr"

    invoke-virtual {v2}, Landroid/speech/tts/Voice;->getLocale()Ljava/util/Locale;

    move-result-object v4

    invoke-virtual {v4}, Ljava/util/Locale;->getLanguage()Ljava/lang/String;

    move-result-object v4

    invoke-virtual {v3, v4}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v3

    if-eqz v3, :cond_0

    new-instance v3, Ljava/lang/StringBuilder;

    invoke-direct {v3}, Ljava/lang/StringBuilder;-><init>()V

    invoke-virtual {v2}, Landroid/speech/tts/Voice;->getName()Ljava/lang/String;

    move-result-object v4

    invoke-virtual {v3, v4}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v3

    invoke-virtual {v2}, Landroid/speech/tts/Voice;->isNetworkConnectionRequired()Z

    move-result v4

    if-eqz v4, :cond_1

    const-string v4, " (a\u011f)"

    goto :goto_1

    :cond_1
    const-string v4, ""

    :goto_1
    invoke-virtual {v3, v4}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v3

    invoke-virtual {v3}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v3

    invoke-virtual {v0, v3}, Lorg/json/JSONArray;->put(Ljava/lang/Object;)Lorg/json/JSONArray;
    :try_end_0
    .catch Ljava/lang/Exception; {:try_start_0 .. :try_end_0} :catch_0

    goto :goto_0

    .end local v2    # "v":Landroid/speech/tts/Voice;
    :catch_0
    move-exception v1

    .line 318
    :cond_2
    invoke-virtual {v0}, Lorg/json/JSONArray;->toString()Ljava/lang/String;

    move-result-object v1

    return-object v1
.end method

.method public sessizMod()Z
    .locals 3
    .annotation runtime Landroid/webkit/JavascriptInterface;
    .end annotation

    .line 366
    iget-object v0, p0, Lcom/dogac/bin1/MainActivity$Kopru;->this$0:Lcom/dogac/bin1/MainActivity;

    const-string v1, "notification"

    invoke-virtual {v0, v1}, Lcom/dogac/bin1/MainActivity;->getSystemService(Ljava/lang/String;)Ljava/lang/Object;

    move-result-object v0

    check-cast v0, Landroid/app/NotificationManager;

    .line 367
    .local v0, "n":Landroid/app/NotificationManager;
    if-eqz v0, :cond_0

    invoke-virtual {v0}, Landroid/app/NotificationManager;->getCurrentInterruptionFilter()I

    move-result v1

    const/4 v2, 0x1

    if-eq v1, v2, :cond_0

    goto :goto_0

    :cond_0
    const/4 v2, 0x0

    :goto_0
    return v2
.end method

.method public sus()V
    .locals 2
    .annotation runtime Landroid/webkit/JavascriptInterface;
    .end annotation

    .line 305
    iget-object v0, p0, Lcom/dogac/bin1/MainActivity$Kopru;->this$0:Lcom/dogac/bin1/MainActivity;

    new-instance v1, Lcom/dogac/bin1/MainActivity$Kopru$$ExternalSyntheticLambda5;

    invoke-direct {v1, p0}, Lcom/dogac/bin1/MainActivity$Kopru$$ExternalSyntheticLambda5;-><init>(Lcom/dogac/bin1/MainActivity$Kopru;)V

    invoke-virtual {v0, v1}, Lcom/dogac/bin1/MainActivity;->runOnUiThread(Ljava/lang/Runnable;)V

    return-void
.end method

.method public uyandirma(Z)V
    .locals 2
    .param p1, "acik"    # Z
    .annotation runtime Landroid/webkit/JavascriptInterface;
    .end annotation

    .line 335
    iget-object v0, p0, Lcom/dogac/bin1/MainActivity$Kopru;->this$0:Lcom/dogac/bin1/MainActivity;

    new-instance v1, Lcom/dogac/bin1/MainActivity$Kopru$$ExternalSyntheticLambda3;

    invoke-direct {v1, p0, p1}, Lcom/dogac/bin1/MainActivity$Kopru$$ExternalSyntheticLambda3;-><init>(Lcom/dogac/bin1/MainActivity$Kopru;Z)V

    invoke-virtual {v0, v1}, Lcom/dogac/bin1/MainActivity;->runOnUiThread(Ljava/lang/Runnable;)V

    .line 341
    return-void
.end method

.method public uygulamaAc(Ljava/lang/String;)Ljava/lang/String;
    .locals 1
    .param p1, "ad"    # Ljava/lang/String;
    .annotation runtime Landroid/webkit/JavascriptInterface;
    .end annotation

    .line 329
    iget-object v0, p0, Lcom/dogac/bin1/MainActivity$Kopru;->this$0:Lcom/dogac/bin1/MainActivity;

    invoke-static {v0, p1}, Lcom/dogac/bin1/Cihaz;->uygulamaAc(Landroid/app/Activity;Ljava/lang/String;)Ljava/lang/String;

    move-result-object v0

    return-object v0
.end method

.method public whatsapp(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Z)Ljava/lang/String;
    .locals 1
    .param p1, "kisi"    # Ljava/lang/String;
    .param p2, "metin"    # Ljava/lang/String;
    .param p3, "islem"    # Ljava/lang/String;
    .param p4, "gonder"    # Z
    .annotation runtime Landroid/webkit/JavascriptInterface;
    .end annotation

    .line 330
    iget-object v0, p0, Lcom/dogac/bin1/MainActivity$Kopru;->this$0:Lcom/dogac/bin1/MainActivity;

    invoke-static {v0, p1, p2, p3, p4}, Lcom/dogac/bin1/Cihaz;->whatsapp(Landroid/app/Activity;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Z)Ljava/lang/String;

    move-result-object v0

    return-object v0
.end method

.method public spotifyCal(Ljava/lang/String;)Ljava/lang/String;
    .locals 2
    .annotation runtime Landroid/webkit/JavascriptInterface;
    .end annotation

    iget-object v0, p0, Lcom/dogac/bin1/MainActivity$Kopru;->this$0:Lcom/dogac/bin1/MainActivity;

    invoke-static {v0, p1}, Lcom/dogac/bin1/SpotifyYerel;->cal(Landroid/content/Context;Ljava/lang/String;)Ljava/lang/String;

    move-result-object v1

    return-object v1
.end method

.method public spotifyUri(Ljava/lang/String;)Ljava/lang/String;
    .locals 2
    .annotation runtime Landroid/webkit/JavascriptInterface;
    .end annotation

    iget-object v0, p0, Lcom/dogac/bin1/MainActivity$Kopru;->this$0:Lcom/dogac/bin1/MainActivity;

    invoke-static {v0, p1}, Lcom/dogac/bin1/SpotifyYerel;->uri(Landroid/content/Context;Ljava/lang/String;)Ljava/lang/String;

    move-result-object v1

    return-object v1
.end method

.method public spotifyKomut(Ljava/lang/String;)Ljava/lang/String;
    .locals 2
    .annotation runtime Landroid/webkit/JavascriptInterface;
    .end annotation

    iget-object v0, p0, Lcom/dogac/bin1/MainActivity$Kopru;->this$0:Lcom/dogac/bin1/MainActivity;

    invoke-static {v0, p1}, Lcom/dogac/bin1/SpotifyYerel;->komut(Landroid/content/Context;Ljava/lang/String;)Ljava/lang/String;

    move-result-object v1

    return-object v1
.end method

.method public spotifyDurum()Ljava/lang/String;
    .locals 2
    .annotation runtime Landroid/webkit/JavascriptInterface;
    .end annotation

    iget-object v0, p0, Lcom/dogac/bin1/MainActivity$Kopru;->this$0:Lcom/dogac/bin1/MainActivity;

    invoke-static {v0}, Lcom/dogac/bin1/SpotifyYerel;->durum(Landroid/content/Context;)Ljava/lang/String;

    move-result-object v1

    return-object v1
.end method

.method public spotifyYuklu()Z
    .locals 2
    .annotation runtime Landroid/webkit/JavascriptInterface;
    .end annotation

    iget-object v0, p0, Lcom/dogac/bin1/MainActivity$Kopru;->this$0:Lcom/dogac/bin1/MainActivity;

    invoke-static {v0}, Lcom/dogac/bin1/SpotifyYerel;->yuklu(Landroid/content/Context;)Z

    move-result v1

    return v1
.end method

.method public bildirimIzniAc()V
    .locals 2
    .annotation runtime Landroid/webkit/JavascriptInterface;
    .end annotation

    iget-object v0, p0, Lcom/dogac/bin1/MainActivity$Kopru;->this$0:Lcom/dogac/bin1/MainActivity;

    invoke-static {v0}, Lcom/dogac/bin1/SpotifyYerel;->bildirimIzniAc(Landroid/content/Context;)V

    return-void
.end method

.method public spotifyListeCal(Ljava/lang/String;)Ljava/lang/String;
    .locals 2
    .annotation runtime Landroid/webkit/JavascriptInterface;
    .end annotation

    iget-object v0, p0, Lcom/dogac/bin1/MainActivity$Kopru;->this$0:Lcom/dogac/bin1/MainActivity;

    invoke-static {v0, p1}, Lcom/dogac/bin1/SpotifyYerel;->listeCal(Landroid/content/Context;Ljava/lang/String;)Ljava/lang/String;

    move-result-object v1

    return-object v1
.end method

.method public spotifyListeDurum()Ljava/lang/String;
    .locals 1
    .annotation runtime Landroid/webkit/JavascriptInterface;
    .end annotation

    invoke-static {}, Lcom/dogac/bin1/SpotifyYerel;->listeDurum()Ljava/lang/String;

    move-result-object v0

    return-object v0
.end method

.method public spotifyListeSarkiCal(Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;
    .locals 2
    .annotation runtime Landroid/webkit/JavascriptInterface;
    .end annotation

    iget-object v0, p0, Lcom/dogac/bin1/MainActivity$Kopru;->this$0:Lcom/dogac/bin1/MainActivity;

    invoke-static {v0, p1, p2}, Lcom/dogac/bin1/SpotifyYerel;->listeSarkiCal(Landroid/content/Context;Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;

    move-result-object v1

    return-object v1
.end method

.method public httpIstek(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;I)V
    .locals 0
    .annotation runtime Landroid/webkit/JavascriptInterface;
    .end annotation

    invoke-static/range {p1 .. p5}, Lcom/dogac/bin1/YerelHttp;->istek(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;I)V

    return-void
.end method

.method public zvDurum()Ljava/lang/String;
    .locals 1
    .annotation runtime Landroid/webkit/JavascriptInterface;
    .end annotation

    invoke-static {}, Lcom/dogac/bin1/CarvisZv;->durum()Ljava/lang/String;

    move-result-object v0

    return-object v0
.end method

.method public zvIndir()V
    .locals 0
    .annotation runtime Landroid/webkit/JavascriptInterface;
    .end annotation

    invoke-static {}, Lcom/dogac/bin1/CarvisZv;->indir()V

    return-void
.end method

.method public zvKonus(Ljava/lang/String;Ljava/lang/String;FF)V
    .locals 0
    .annotation runtime Landroid/webkit/JavascriptInterface;
    .end annotation

    invoke-static {p1, p2, p3, p4}, Lcom/dogac/bin1/CarvisZv;->konus(Ljava/lang/String;Ljava/lang/String;FF)V

    return-void
.end method

.method public zvSus()V
    .locals 0
    .annotation runtime Landroid/webkit/JavascriptInterface;
    .end annotation

    invoke-static {}, Lcom/dogac/bin1/CarvisZv;->sus()V

    return-void
.end method
