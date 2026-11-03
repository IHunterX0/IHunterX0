.class public Lcom/dogac/bin1/MainActivity;
.super Landroid/app/Activity;
.source "MainActivity.java"


# annotations
.annotation system Ldalvik/annotation/MemberClasses;
    value = {
        Lcom/dogac/bin1/MainActivity$Kopru;
    }
.end annotation


# static fields
.field static final ADRES:Ljava/lang/String; = "https://appassets.androidplatform.net/assets/www/index.html"

.field static final DOSYA_SEC:I = 0xc

.field static final IZIN_MIKROFON:I = 0xb

.field static final VARSAYILAN_SES:Ljava/lang/String; = "tr-tr-x-ama-local"

.field static ornek:Lcom/dogac/bin1/MainActivity;

.field static volatile oturumAcik:Z


# instance fields
.field dinlemeBaglami:Ljava/lang/String;

.field dosyaGeri:Landroid/webkit/ValueCallback;
    .annotation system Ldalvik/annotation/Signature;
        value = {
            "Landroid/webkit/ValueCallback<",
            "[",
            "Landroid/net/Uri;",
            ">;"
        }
    .end annotation
.end field

.field onPlanda:Z

.field tanima:Landroid/speech/SpeechRecognizer;

.field terimListesi:Ljava/util/ArrayList;
    .annotation system Ldalvik/annotation/Signature;
        value = {
            "Ljava/util/ArrayList<",
            "Ljava/lang/String;",
            ">;"
        }
    .end annotation
.end field

.field tts:Landroid/speech/tts/TextToSpeech;

.field ttsHazir:Z

.field uyandirmaIstendi:Z

.field web:Landroid/webkit/WebView;


# direct methods
.method public static synthetic $r8$lambda$2qQiAWbLdJZTHwVOLwpEKMxVAHI(Lcom/dogac/bin1/MainActivity;Ljava/lang/String;)V
    .locals 0

    invoke-direct {p0, p1}, Lcom/dogac/bin1/MainActivity;->lambda$uyanIstegi$2(Ljava/lang/String;)V

    return-void
.end method

.method public static synthetic $r8$lambda$Bw9J7-tPygb_RDACNb7XPbvQaX8(Lcom/dogac/bin1/MainActivity;)V
    .locals 0

    invoke-direct {p0}, Lcom/dogac/bin1/MainActivity;->lambda$uyanIstegi$1()V

    return-void
.end method

.method public static synthetic $r8$lambda$DNDnY7i3hNIbtx-kUegi5jCbfbM(Lcom/dogac/bin1/MainActivity;Ljava/lang/String;)V
    .locals 0

    invoke-direct {p0, p1}, Lcom/dogac/bin1/MainActivity;->lambda$indirilenlereKaydet$7(Ljava/lang/String;)V

    return-void
.end method

.method public static synthetic $r8$lambda$EbxALbc5fvVTWAVtKX_DVHc2c2o(Lcom/dogac/bin1/MainActivity;)V
    .locals 0

    invoke-direct {p0}, Lcom/dogac/bin1/MainActivity;->lambda$tekCumleDinle$5()V

    return-void
.end method

.method public static synthetic $r8$lambda$PO4j78di7Ci0tsqbrKdmoPPujn0(Lcom/dogac/bin1/MainActivity;I)V
    .locals 0

    invoke-direct {p0, p1}, Lcom/dogac/bin1/MainActivity;->lambda$onCreate$0(I)V

    return-void
.end method

.method public static synthetic $r8$lambda$atnSEuwgXOyw_o448_weZumivHM(Lcom/dogac/bin1/MainActivity;Landroid/content/Intent;)V
    .locals 0

    invoke-direct {p0, p1}, Lcom/dogac/bin1/MainActivity;->lambda$tekCumleDinle$6(Landroid/content/Intent;)V

    return-void
.end method

.method public static synthetic $r8$lambda$pECGNJgxGz4ZexdOVfzDS5UPltU(Lcom/dogac/bin1/MainActivity;Ljava/lang/String;)V
    .locals 0

    invoke-direct {p0, p1}, Lcom/dogac/bin1/MainActivity;->lambda$js$4(Ljava/lang/String;)V

    return-void
.end method

.method public static synthetic $r8$lambda$rAVsKgShP9l6Xyl1qUwZmcvNDDg(Lcom/dogac/bin1/MainActivity;)V
    .locals 0

    invoke-direct {p0}, Lcom/dogac/bin1/MainActivity;->lambda$uyanIstegi$3()V

    return-void
.end method

.method static constructor <clinit>()V
    .locals 1

    .line 190
    const/4 v0, 0x0

    sput-boolean v0, Lcom/dogac/bin1/MainActivity;->oturumAcik:Z

    return-void
.end method

.method public constructor <init>()V
    .locals 1

    .line 39
    invoke-direct {p0}, Landroid/app/Activity;-><init>()V

    .line 44
    const/4 v0, 0x0

    iput-boolean v0, p0, Lcom/dogac/bin1/MainActivity;->ttsHazir:Z

    .line 47
    iput-boolean v0, p0, Lcom/dogac/bin1/MainActivity;->onPlanda:Z

    .line 48
    iput-boolean v0, p0, Lcom/dogac/bin1/MainActivity;->uyandirmaIstendi:Z

    .line 49
    const-string v0, ""

    iput-object v0, p0, Lcom/dogac/bin1/MainActivity;->dinlemeBaglami:Ljava/lang/String;

    return-void
.end method

.method static jsStr(Ljava/lang/String;)Ljava/lang/String;
    .locals 7
    .param p0, "s"    # Ljava/lang/String;

    .line 172
    if-nez p0, :cond_0

    const-string v0, "null"

    return-object v0

    .line 173
    :cond_0
    new-instance v0, Ljava/lang/StringBuilder;

    const-string v1, "\""

    invoke-direct {v0, v1}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    .line 174
    .local v0, "b":Ljava/lang/StringBuilder;
    invoke-virtual {p0}, Ljava/lang/String;->toCharArray()[C

    move-result-object v1

    array-length v2, v1

    const/4 v3, 0x0

    :goto_0
    const/16 v4, 0x22

    if-ge v3, v2, :cond_6

    aget-char v5, v1, v3

    .line 175
    .local v5, "c":C
    const/16 v6, 0x5c

    if-eq v5, v4, :cond_5

    if-ne v5, v6, :cond_1

    goto :goto_2

    .line 176
    :cond_1
    const/16 v4, 0xa

    if-ne v5, v4, :cond_2

    const-string v4, "\\n"

    invoke-virtual {v0, v4}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    goto :goto_3

    .line 177
    :cond_2
    const/16 v4, 0x20

    if-lt v5, v4, :cond_4

    const/16 v4, 0x2028

    if-eq v5, v4, :cond_4

    const/16 v4, 0x2029

    if-ne v5, v4, :cond_3

    goto :goto_1

    .line 178
    :cond_3
    invoke-virtual {v0, v5}, Ljava/lang/StringBuilder;->append(C)Ljava/lang/StringBuilder;

    goto :goto_3

    .line 177
    :cond_4
    :goto_1
    invoke-static {v5}, Ljava/lang/Integer;->valueOf(I)Ljava/lang/Integer;

    move-result-object v4

    filled-new-array {v4}, [Ljava/lang/Object;

    move-result-object v4

    const-string v6, "\\u%04x"

    invoke-static {v6, v4}, Ljava/lang/String;->format(Ljava/lang/String;[Ljava/lang/Object;)Ljava/lang/String;

    move-result-object v4

    invoke-virtual {v0, v4}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    goto :goto_3

    .line 175
    :cond_5
    :goto_2
    invoke-virtual {v0, v6}, Ljava/lang/StringBuilder;->append(C)Ljava/lang/StringBuilder;

    move-result-object v4

    invoke-virtual {v4, v5}, Ljava/lang/StringBuilder;->append(C)Ljava/lang/StringBuilder;

    .line 174
    .end local v5    # "c":C
    :goto_3
    add-int/lit8 v3, v3, 0x1

    goto :goto_0

    .line 180
    :cond_6
    invoke-virtual {v0, v4}, Ljava/lang/StringBuilder;->append(C)Ljava/lang/StringBuilder;

    move-result-object v1

    invoke-virtual {v1}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v1

    return-object v1
.end method

.method private synthetic lambda$indirilenlereKaydet$7(Ljava/lang/String;)V
    .locals 2
    .param p1, "ad"    # Ljava/lang/String;

    .line 286
    new-instance v0, Ljava/lang/StringBuilder;

    invoke-direct {v0}, Ljava/lang/StringBuilder;-><init>()V

    const-string v1, "\u0130ndirilenler/1001 klas\u00f6r\u00fcne kaydedildi: "

    invoke-virtual {v0, v1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v0

    invoke-virtual {v0, p1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v0

    invoke-virtual {v0}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v0

    const/4 v1, 0x1

    invoke-static {p0, v0, v1}, Landroid/widget/Toast;->makeText(Landroid/content/Context;Ljava/lang/CharSequence;I)Landroid/widget/Toast;

    move-result-object v0

    invoke-virtual {v0}, Landroid/widget/Toast;->show()V

    return-void
.end method

.method private synthetic lambda$js$4(Ljava/lang/String;)V
    .locals 2
    .param p1, "kod"    # Ljava/lang/String;

    .line 170
    iget-object v0, p0, Lcom/dogac/bin1/MainActivity;->web:Landroid/webkit/WebView;

    if-eqz v0, :cond_0

    iget-object v0, p0, Lcom/dogac/bin1/MainActivity;->web:Landroid/webkit/WebView;

    const/4 v1, 0x0

    invoke-virtual {v0, p1, v1}, Landroid/webkit/WebView;->evaluateJavascript(Ljava/lang/String;Landroid/webkit/ValueCallback;)V

    :cond_0
    return-void
.end method

.method private synthetic lambda$onCreate$0(I)V
    .locals 4
    .param p1, "st"    # I

    .line 96
    if-nez p1, :cond_0

    .line 97
    iget-object v0, p0, Lcom/dogac/bin1/MainActivity;->tts:Landroid/speech/tts/TextToSpeech;

    new-instance v1, Ljava/util/Locale;

    const-string v2, "tr"

    const-string v3, "TR"

    invoke-direct {v1, v2, v3}, Ljava/util/Locale;-><init>(Ljava/lang/String;Ljava/lang/String;)V

    invoke-virtual {v0, v1}, Landroid/speech/tts/TextToSpeech;->setLanguage(Ljava/util/Locale;)I

    .line 98
    invoke-virtual {p0}, Lcom/dogac/bin1/MainActivity;->sesUygula()V

    .line 99
    const/4 v0, 0x1

    iput-boolean v0, p0, Lcom/dogac/bin1/MainActivity;->ttsHazir:Z

    .line 100
    iget-object v0, p0, Lcom/dogac/bin1/MainActivity;->tts:Landroid/speech/tts/TextToSpeech;

    new-instance v1, Lcom/dogac/bin1/MainActivity$3;

    invoke-direct {v1, p0}, Lcom/dogac/bin1/MainActivity$3;-><init>(Lcom/dogac/bin1/MainActivity;)V

    invoke-virtual {v0, v1}, Landroid/speech/tts/TextToSpeech;->setOnUtteranceProgressListener(Landroid/speech/tts/UtteranceProgressListener;)I

    .line 110
    :cond_0
    return-void
.end method

.method private synthetic lambda$tekCumleDinle$5()V
    .locals 2

    .line 212
    iget-object v0, p0, Lcom/dogac/bin1/MainActivity;->dinlemeBaglami:Ljava/lang/String;

    new-instance v1, Lcom/dogac/bin1/MainActivity$4;

    invoke-direct {v1, p0}, Lcom/dogac/bin1/MainActivity$4;-><init>(Lcom/dogac/bin1/MainActivity;)V

    invoke-static {v0, v1}, Lcom/dogac/bin1/Cihaz;->geminiDinle(Ljava/lang/String;Lcom/dogac/bin1/Cihaz$Sonuc;)V

    return-void
.end method

.method private synthetic lambda$tekCumleDinle$6(Landroid/content/Intent;)V
    .locals 1
    .param p1, "i"    # Landroid/content/Intent;

    .line 255
    iget-object v0, p0, Lcom/dogac/bin1/MainActivity;->tanima:Landroid/speech/SpeechRecognizer;

    invoke-virtual {v0, p1}, Landroid/speech/SpeechRecognizer;->startListening(Landroid/content/Intent;)V

    return-void
.end method

.method private synthetic lambda$uyanIstegi$1()V
    .locals 1

    .line 119
    const-string v0, "carvisYerel.uyan()"

    invoke-virtual {p0, v0}, Lcom/dogac/bin1/MainActivity;->js(Ljava/lang/String;)V

    return-void
.end method

.method private synthetic lambda$uyanIstegi$2(Ljava/lang/String;)V
    .locals 2
    .param p1, "q"    # Ljava/lang/String;

    .line 121
    new-instance v0, Ljava/lang/StringBuilder;

    invoke-direct {v0}, Ljava/lang/StringBuilder;-><init>()V

    const-string v1, "m\u00fczik testi: "

    invoke-virtual {v0, v1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v0

    const-string v1, "spotify"

    invoke-static {p0, p1, v1}, Lcom/dogac/bin1/Cihaz;->muzik(Landroid/app/Activity;Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;

    move-result-object v1

    invoke-virtual {v0, v1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v0

    invoke-virtual {v0}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v0

    const-string v1, "Carvis"

    invoke-static {v1, v0}, Landroid/util/Log;->i(Ljava/lang/String;Ljava/lang/String;)I

    return-void
.end method

.method private synthetic lambda$uyanIstegi$3()V
    .locals 5

    .line 125
    iget-object v0, p0, Lcom/dogac/bin1/MainActivity;->tts:Landroid/speech/tts/TextToSpeech;

    if-nez v0, :cond_0

    return-void

    :cond_0
    invoke-virtual {p0}, Lcom/dogac/bin1/MainActivity;->sesUygula()V

    invoke-static {}, Lcom/dogac/bin1/CarvisServis;->konusmaBasladi()V

    iget-object v0, p0, Lcom/dogac/bin1/MainActivity;->tts:Landroid/speech/tts/TextToSpeech;

    const/4 v1, 0x0

    const-string v2, "deneme"

    const-string v3, "Merhaba efendim. Bug\u00fcn biyokimya \u00e7al\u0131\u015fmaya haz\u0131r m\u0131s\u0131n\u0131z?"

    const/4 v4, 0x0

    invoke-virtual {v0, v3, v4, v1, v2}, Landroid/speech/tts/TextToSpeech;->speak(Ljava/lang/CharSequence;ILandroid/os/Bundle;Ljava/lang/String;)I

    return-void
.end method


# virtual methods
.method indirilenlereKaydet(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;
    .locals 6
    .param p1, "ad"    # Ljava/lang/String;
    .param p2, "b64"    # Ljava/lang/String;
    .param p3, "tip"    # Ljava/lang/String;

    .line 270
    const/4 v0, 0x0

    :try_start_0
    invoke-static {p2, v0}, Landroid/util/Base64;->decode(Ljava/lang/String;I)[B

    move-result-object v0

    .line 271
    .local v0, "veri":[B
    sget v1, Landroid/os/Build$VERSION;->SDK_INT:I

    const/16 v2, 0x1d

    if-lt v1, v2, :cond_2

    .line 272
    new-instance v1, Landroid/content/ContentValues;

    invoke-direct {v1}, Landroid/content/ContentValues;-><init>()V

    .line 273
    .local v1, "cv":Landroid/content/ContentValues;
    const-string v2, "_display_name"

    invoke-virtual {v1, v2, p1}, Landroid/content/ContentValues;->put(Ljava/lang/String;Ljava/lang/String;)V

    .line 274
    const-string v2, "mime_type"

    invoke-virtual {v1, v2, p3}, Landroid/content/ContentValues;->put(Ljava/lang/String;Ljava/lang/String;)V

    .line 275
    const-string v2, "relative_path"

    new-instance v3, Ljava/lang/StringBuilder;

    invoke-direct {v3}, Ljava/lang/StringBuilder;-><init>()V

    sget-object v4, Landroid/os/Environment;->DIRECTORY_DOWNLOADS:Ljava/lang/String;

    invoke-virtual {v3, v4}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v3

    const-string v4, "/1001"

    invoke-virtual {v3, v4}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v3

    invoke-virtual {v3}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v3

    invoke-virtual {v1, v2, v3}, Landroid/content/ContentValues;->put(Ljava/lang/String;Ljava/lang/String;)V

    .line 276
    invoke-virtual {p0}, Lcom/dogac/bin1/MainActivity;->getContentResolver()Landroid/content/ContentResolver;

    move-result-object v2

    sget-object v3, Landroid/provider/MediaStore$Downloads;->EXTERNAL_CONTENT_URI:Landroid/net/Uri;

    invoke-virtual {v2, v3, v1}, Landroid/content/ContentResolver;->insert(Landroid/net/Uri;Landroid/content/ContentValues;)Landroid/net/Uri;

    move-result-object v2

    .line 277
    .local v2, "u":Landroid/net/Uri;
    invoke-virtual {p0}, Lcom/dogac/bin1/MainActivity;->getContentResolver()Landroid/content/ContentResolver;

    move-result-object v3

    invoke-virtual {v3, v2}, Landroid/content/ContentResolver;->openOutputStream(Landroid/net/Uri;)Ljava/io/OutputStream;

    move-result-object v3
    :try_end_0
    .catch Ljava/lang/Exception; {:try_start_0 .. :try_end_0} :catch_0

    .local v3, "o":Ljava/io/OutputStream;
    :try_start_1
    invoke-virtual {v3, v0}, Ljava/io/OutputStream;->write([B)V
    :try_end_1
    .catchall {:try_start_1 .. :try_end_1} :catchall_0

    if-eqz v3, :cond_0

    :try_start_2
    invoke-virtual {v3}, Ljava/io/OutputStream;->close()V
    :try_end_2
    .catch Ljava/lang/Exception; {:try_start_2 .. :try_end_2} :catch_0

    .line 278
    .end local v1    # "cv":Landroid/content/ContentValues;
    .end local v2    # "u":Landroid/net/Uri;
    .end local v3    # "o":Ljava/io/OutputStream;
    :cond_0
    goto :goto_1

    .line 277
    .restart local v1    # "cv":Landroid/content/ContentValues;
    .restart local v2    # "u":Landroid/net/Uri;
    .restart local v3    # "o":Ljava/io/OutputStream;
    :catchall_0
    move-exception v4

    if-eqz v3, :cond_1

    :try_start_3
    invoke-virtual {v3}, Ljava/io/OutputStream;->close()V
    :try_end_3
    .catchall {:try_start_3 .. :try_end_3} :catchall_1

    goto :goto_0

    :catchall_1
    move-exception v5

    :try_start_4
    invoke-virtual {v4, v5}, Ljava/lang/Throwable;->addSuppressed(Ljava/lang/Throwable;)V

    .end local p1    # "ad":Ljava/lang/String;
    .end local p2    # "b64":Ljava/lang/String;
    .end local p3    # "tip":Ljava/lang/String;
    :cond_1
    :goto_0
    throw v4

    .line 279
    .end local v1    # "cv":Landroid/content/ContentValues;
    .end local v2    # "u":Landroid/net/Uri;
    .end local v3    # "o":Ljava/io/OutputStream;
    .restart local p1    # "ad":Ljava/lang/String;
    .restart local p2    # "b64":Ljava/lang/String;
    .restart local p3    # "tip":Ljava/lang/String;
    :cond_2
    new-instance v1, Ljava/io/File;

    invoke-virtual {p0}, Lcom/dogac/bin1/MainActivity;->getCacheDir()Ljava/io/File;

    move-result-object v2

    const-string v3, "paylas"

    invoke-direct {v1, v2, v3}, Ljava/io/File;-><init>(Ljava/io/File;Ljava/lang/String;)V

    .local v1, "d":Ljava/io/File;
    invoke-virtual {v1}, Ljava/io/File;->mkdirs()Z

    .line 280
    new-instance v2, Ljava/io/File;

    invoke-direct {v2, v1, p1}, Ljava/io/File;-><init>(Ljava/io/File;Ljava/lang/String;)V

    .line 281
    .local v2, "f":Ljava/io/File;
    new-instance v3, Ljava/io/FileOutputStream;

    invoke-direct {v3, v2}, Ljava/io/FileOutputStream;-><init>(Ljava/io/File;)V
    :try_end_4
    .catch Ljava/lang/Exception; {:try_start_4 .. :try_end_4} :catch_0

    .local v3, "o":Ljava/io/FileOutputStream;
    :try_start_5
    invoke-virtual {v3, v0}, Ljava/io/FileOutputStream;->write([B)V
    :try_end_5
    .catchall {:try_start_5 .. :try_end_5} :catchall_2

    :try_start_6
    invoke-virtual {v3}, Ljava/io/FileOutputStream;->close()V

    .line 282
    .end local v3    # "o":Ljava/io/FileOutputStream;
    const-string v3, "com.dogac.bin1.dosya"

    invoke-static {p0, v3, v2}, Landroidx/core/content/FileProvider;->getUriForFile(Landroid/content/Context;Ljava/lang/String;Ljava/io/File;)Landroid/net/Uri;

    move-result-object v3

    .line 283
    .local v3, "u":Landroid/net/Uri;
    new-instance v4, Landroid/content/Intent;

    const-string v5, "android.intent.action.SEND"

    invoke-direct {v4, v5}, Landroid/content/Intent;-><init>(Ljava/lang/String;)V

    invoke-virtual {v4, p3}, Landroid/content/Intent;->setType(Ljava/lang/String;)Landroid/content/Intent;

    move-result-object v4

    const-string v5, "android.intent.extra.STREAM"

    invoke-virtual {v4, v5, v3}, Landroid/content/Intent;->putExtra(Ljava/lang/String;Landroid/os/Parcelable;)Landroid/content/Intent;

    move-result-object v4

    const/4 v5, 0x1

    invoke-virtual {v4, v5}, Landroid/content/Intent;->addFlags(I)Landroid/content/Intent;

    move-result-object v4

    .line 284
    .local v4, "i":Landroid/content/Intent;
    invoke-static {v4, p1}, Landroid/content/Intent;->createChooser(Landroid/content/Intent;Ljava/lang/CharSequence;)Landroid/content/Intent;

    move-result-object v5

    invoke-virtual {p0, v5}, Lcom/dogac/bin1/MainActivity;->startActivity(Landroid/content/Intent;)V

    .line 286
    .end local v1    # "d":Ljava/io/File;
    .end local v2    # "f":Ljava/io/File;
    .end local v3    # "u":Landroid/net/Uri;
    .end local v4    # "i":Landroid/content/Intent;
    :goto_1
    new-instance v1, Lcom/dogac/bin1/MainActivity$$ExternalSyntheticLambda0;

    invoke-direct {v1, p0, p1}, Lcom/dogac/bin1/MainActivity$$ExternalSyntheticLambda0;-><init>(Lcom/dogac/bin1/MainActivity;Ljava/lang/String;)V

    invoke-virtual {p0, v1}, Lcom/dogac/bin1/MainActivity;->runOnUiThread(Ljava/lang/Runnable;)V

    .line 287
    const-string v1, "ok"
    :try_end_6
    .catch Ljava/lang/Exception; {:try_start_6 .. :try_end_6} :catch_0

    return-object v1

    .line 281
    .restart local v1    # "d":Ljava/io/File;
    .restart local v2    # "f":Ljava/io/File;
    .local v3, "o":Ljava/io/FileOutputStream;
    :catchall_2
    move-exception v4

    :try_start_7
    invoke-virtual {v3}, Ljava/io/FileOutputStream;->close()V
    :try_end_7
    .catchall {:try_start_7 .. :try_end_7} :catchall_3

    goto :goto_2

    :catchall_3
    move-exception v5

    :try_start_8
    invoke-virtual {v4, v5}, Ljava/lang/Throwable;->addSuppressed(Ljava/lang/Throwable;)V

    .end local p1    # "ad":Ljava/lang/String;
    .end local p2    # "b64":Ljava/lang/String;
    .end local p3    # "tip":Ljava/lang/String;
    :goto_2
    throw v4
    :try_end_8
    .catch Ljava/lang/Exception; {:try_start_8 .. :try_end_8} :catch_0

    .line 288
    .end local v0    # "veri":[B
    .end local v1    # "d":Ljava/io/File;
    .end local v2    # "f":Ljava/io/File;
    .end local v3    # "o":Ljava/io/FileOutputStream;
    .restart local p1    # "ad":Ljava/lang/String;
    .restart local p2    # "b64":Ljava/lang/String;
    .restart local p3    # "tip":Ljava/lang/String;
    :catch_0
    move-exception v0

    .local v0, "e":Ljava/lang/Exception;
    invoke-virtual {v0}, Ljava/lang/Exception;->getMessage()Ljava/lang/String;

    move-result-object v1

    invoke-static {v1}, Ljava/lang/String;->valueOf(Ljava/lang/Object;)Ljava/lang/String;

    move-result-object v1

    return-object v1
.end method

.method js(Ljava/lang/String;)V
    .locals 1
    .param p1, "kod"    # Ljava/lang/String;

    .line 170
    new-instance v0, Lcom/dogac/bin1/MainActivity$$ExternalSyntheticLambda7;

    invoke-direct {v0, p0, p1}, Lcom/dogac/bin1/MainActivity$$ExternalSyntheticLambda7;-><init>(Lcom/dogac/bin1/MainActivity;Ljava/lang/String;)V

    invoke-virtual {p0, v0}, Lcom/dogac/bin1/MainActivity;->runOnUiThread(Ljava/lang/Runnable;)V

    return-void
.end method

.method mikrofonVar()Z
    .locals 1

    .line 182
    const-string v0, "android.permission.RECORD_AUDIO"

    invoke-virtual {p0, v0}, Lcom/dogac/bin1/MainActivity;->checkSelfPermission(Ljava/lang/String;)I

    move-result v0

    if-nez v0, :cond_0

    const/4 v0, 0x1

    goto :goto_0

    :cond_0
    const/4 v0, 0x0

    :goto_0
    return v0
.end method

.method protected onActivityResult(IILandroid/content/Intent;)V
    .locals 4
    .param p1, "k"    # I
    .param p2, "sonuc"    # I
    .param p3, "veri"    # Landroid/content/Intent;

    invoke-static {p0, p1, p2, p3}, Lcom/dogac/bin1/Yama;->sonuc(Landroid/app/Activity;IILandroid/content/Intent;)Z

    move-result v0

    if-eqz v0, :yama_degil

    return-void

    :yama_degil
    .line 151
    const/16 v0, 0xc

    if-ne p1, v0, :cond_3

    iget-object v0, p0, Lcom/dogac/bin1/MainActivity;->dosyaGeri:Landroid/webkit/ValueCallback;

    if-eqz v0, :cond_3

    .line 152
    const/4 v0, 0x0

    .line 153
    .local v0, "l":[Landroid/net/Uri;
    const/4 v1, -0x1

    if-ne p2, v1, :cond_2

    if-eqz p3, :cond_2

    .line 154
    invoke-virtual {p3}, Landroid/content/Intent;->getClipData()Landroid/content/ClipData;

    move-result-object v1

    if-eqz v1, :cond_1

    invoke-virtual {p3}, Landroid/content/Intent;->getClipData()Landroid/content/ClipData;

    move-result-object v1

    invoke-virtual {v1}, Landroid/content/ClipData;->getItemCount()I

    move-result v1

    .local v1, "n":I
    new-array v0, v1, [Landroid/net/Uri;

    const/4 v2, 0x0

    .local v2, "x":I
    :goto_0
    if-ge v2, v1, :cond_0

    invoke-virtual {p3}, Landroid/content/Intent;->getClipData()Landroid/content/ClipData;

    move-result-object v3

    invoke-virtual {v3, v2}, Landroid/content/ClipData;->getItemAt(I)Landroid/content/ClipData$Item;

    move-result-object v3

    invoke-virtual {v3}, Landroid/content/ClipData$Item;->getUri()Landroid/net/Uri;

    move-result-object v3

    aput-object v3, v0, v2

    add-int/lit8 v2, v2, 0x1

    goto :goto_0

    .end local v1    # "n":I
    .end local v2    # "x":I
    :cond_0
    goto :goto_1

    .line 155
    :cond_1
    invoke-virtual {p3}, Landroid/content/Intent;->getData()Landroid/net/Uri;

    move-result-object v1

    if-eqz v1, :cond_2

    const/4 v1, 0x1

    new-array v1, v1, [Landroid/net/Uri;

    const/4 v2, 0x0

    invoke-virtual {p3}, Landroid/content/Intent;->getData()Landroid/net/Uri;

    move-result-object v3

    aput-object v3, v1, v2

    move-object v0, v1

    .line 157
    :cond_2
    :goto_1
    iget-object v1, p0, Lcom/dogac/bin1/MainActivity;->dosyaGeri:Landroid/webkit/ValueCallback;

    invoke-interface {v1, v0}, Landroid/webkit/ValueCallback;->onReceiveValue(Ljava/lang/Object;)V

    const/4 v1, 0x0

    iput-object v1, p0, Lcom/dogac/bin1/MainActivity;->dosyaGeri:Landroid/webkit/ValueCallback;

    .line 159
    .end local v0    # "l":[Landroid/net/Uri;
    :cond_3
    invoke-super {p0, p1, p2, p3}, Landroid/app/Activity;->onActivityResult(IILandroid/content/Intent;)V

    .line 160
    return-void
.end method

.method public onBackPressed()V
    .locals 1

    .line 147
    iget-object v0, p0, Lcom/dogac/bin1/MainActivity;->web:Landroid/webkit/WebView;

    invoke-virtual {v0}, Landroid/webkit/WebView;->canGoBack()Z

    move-result v0

    if-eqz v0, :cond_0

    iget-object v0, p0, Lcom/dogac/bin1/MainActivity;->web:Landroid/webkit/WebView;

    invoke-virtual {v0}, Landroid/webkit/WebView;->goBack()V

    goto :goto_0

    :cond_0
    const/4 v0, 0x1

    invoke-virtual {p0, v0}, Lcom/dogac/bin1/MainActivity;->moveTaskToBack(Z)Z

    :goto_0
    return-void
.end method

.method protected onCreate(Landroid/os/Bundle;)V
    .locals 7
    .param p1, "b"    # Landroid/os/Bundle;

    .line 54
    invoke-super {p0, p1}, Landroid/app/Activity;->onCreate(Landroid/os/Bundle;)V

    .line 55
    sput-object p0, Lcom/dogac/bin1/MainActivity;->ornek:Lcom/dogac/bin1/MainActivity;

    .line 56
    invoke-virtual {p0}, Lcom/dogac/bin1/MainActivity;->getWindow()Landroid/view/Window;

    move-result-object v0

    const/16 v1, 0x80

    invoke-virtual {v0, v1}, Landroid/view/Window;->addFlags(I)V

    .line 57
    new-instance v0, Landroid/webkit/WebView;

    invoke-direct {v0, p0}, Landroid/webkit/WebView;-><init>(Landroid/content/Context;)V

    iput-object v0, p0, Lcom/dogac/bin1/MainActivity;->web:Landroid/webkit/WebView;

    .line 58
    iget-object v0, p0, Lcom/dogac/bin1/MainActivity;->web:Landroid/webkit/WebView;

    invoke-virtual {p0, v0}, Lcom/dogac/bin1/MainActivity;->setContentView(Landroid/view/View;)V

    .line 59
    new-instance v0, Landroidx/webkit/WebViewAssetLoader$Builder;

    invoke-direct {v0}, Landroidx/webkit/WebViewAssetLoader$Builder;-><init>()V

    new-instance v1, Landroidx/webkit/WebViewAssetLoader$AssetsPathHandler;

    invoke-direct {v1, p0}, Landroidx/webkit/WebViewAssetLoader$AssetsPathHandler;-><init>(Landroid/content/Context;)V

    .line 60
    const-string v2, "/assets/"

    invoke-virtual {v0, v2, v1}, Landroidx/webkit/WebViewAssetLoader$Builder;->addPathHandler(Ljava/lang/String;Landroidx/webkit/WebViewAssetLoader$PathHandler;)Landroidx/webkit/WebViewAssetLoader$Builder;

    move-result-object v0

    invoke-virtual {v0}, Landroidx/webkit/WebViewAssetLoader$Builder;->build()Landroidx/webkit/WebViewAssetLoader;

    move-result-object v0

    .line 61
    .local v0, "yukleyici":Landroidx/webkit/WebViewAssetLoader;
    iget-object v1, p0, Lcom/dogac/bin1/MainActivity;->web:Landroid/webkit/WebView;

    invoke-virtual {v1}, Landroid/webkit/WebView;->getSettings()Landroid/webkit/WebSettings;

    move-result-object v1

    .line 62
    .local v1, "s":Landroid/webkit/WebSettings;
    const/4 v2, 0x1

    invoke-virtual {v1, v2}, Landroid/webkit/WebSettings;->setJavaScriptEnabled(Z)V

    .line 63
    invoke-virtual {v1, v2}, Landroid/webkit/WebSettings;->setDomStorageEnabled(Z)V

    .line 64
    invoke-virtual {v1, v2}, Landroid/webkit/WebSettings;->setDatabaseEnabled(Z)V

    .line 65
    const/4 v3, 0x0

    invoke-virtual {v1, v3}, Landroid/webkit/WebSettings;->setMediaPlaybackRequiresUserGesture(Z)V

    .line 66
    invoke-virtual {v1, v3}, Landroid/webkit/WebSettings;->setAllowFileAccess(Z)V

    .line 67
    const/16 v4, 0x64

    invoke-virtual {v1, v4}, Landroid/webkit/WebSettings;->setTextZoom(I)V

    .line 68
    invoke-virtual {v1, v3}, Landroid/webkit/WebSettings;->setSupportMultipleWindows(Z)V

    .line 69
    iget-object v4, p0, Lcom/dogac/bin1/MainActivity;->web:Landroid/webkit/WebView;

    new-instance v5, Lcom/dogac/bin1/MainActivity$1;

    invoke-direct {v5, p0, v0}, Lcom/dogac/bin1/MainActivity$1;-><init>(Lcom/dogac/bin1/MainActivity;Landroidx/webkit/WebViewAssetLoader;)V

    invoke-virtual {v4, v5}, Landroid/webkit/WebView;->setWebViewClient(Landroid/webkit/WebViewClient;)V

    .line 85
    iget-object v4, p0, Lcom/dogac/bin1/MainActivity;->web:Landroid/webkit/WebView;

    new-instance v5, Lcom/dogac/bin1/MainActivity$2;

    invoke-direct {v5, p0}, Lcom/dogac/bin1/MainActivity$2;-><init>(Lcom/dogac/bin1/MainActivity;)V

    invoke-virtual {v4, v5}, Landroid/webkit/WebView;->setWebChromeClient(Landroid/webkit/WebChromeClient;)V

    .line 93
    iget-object v4, p0, Lcom/dogac/bin1/MainActivity;->web:Landroid/webkit/WebView;

    new-instance v5, Lcom/dogac/bin1/MainActivity$Kopru;

    invoke-direct {v5, p0}, Lcom/dogac/bin1/MainActivity$Kopru;-><init>(Lcom/dogac/bin1/MainActivity;)V

    const-string v6, "AndroidKopru"

    invoke-virtual {v4, v5, v6}, Landroid/webkit/WebView;->addJavascriptInterface(Ljava/lang/Object;Ljava/lang/String;)V

    .line 94
    iget-object v4, p0, Lcom/dogac/bin1/MainActivity;->web:Landroid/webkit/WebView;

    if-eqz p1, :cond_0

    invoke-virtual {v4, p1}, Landroid/webkit/WebView;->restoreState(Landroid/os/Bundle;)Landroid/webkit/WebBackForwardList;

    goto :goto_0

    :cond_0
    const-string v5, "https://appassets.androidplatform.net/assets/www/index.html"

    invoke-virtual {v4, v5}, Landroid/webkit/WebView;->loadUrl(Ljava/lang/String;)V

    .line 95
    :goto_0
    new-instance v4, Landroid/speech/tts/TextToSpeech;

    new-instance v5, Lcom/dogac/bin1/MainActivity$$ExternalSyntheticLambda1;

    invoke-direct {v5, p0}, Lcom/dogac/bin1/MainActivity$$ExternalSyntheticLambda1;-><init>(Lcom/dogac/bin1/MainActivity;)V

    invoke-direct {v4, p0, v5}, Landroid/speech/tts/TextToSpeech;-><init>(Landroid/content/Context;Landroid/speech/tts/TextToSpeech$OnInitListener;)V

    iput-object v4, p0, Lcom/dogac/bin1/MainActivity;->tts:Landroid/speech/tts/TextToSpeech;

    .line 111
    sget v4, Landroid/os/Build$VERSION;->SDK_INT:I

    const/16 v5, 0x21

    if-lt v4, v5, :cond_1

    const-string v4, "android.permission.POST_NOTIFICATIONS"

    invoke-virtual {p0, v4}, Lcom/dogac/bin1/MainActivity;->checkSelfPermission(Ljava/lang/String;)I

    move-result v5

    if-eqz v5, :cond_1

    .line 112
    new-array v2, v2, [Ljava/lang/String;

    aput-object v4, v2, v3

    const/16 v3, 0xa

    invoke-virtual {p0, v2, v3}, Lcom/dogac/bin1/MainActivity;->requestPermissions([Ljava/lang/String;I)V

    .line 113
    :cond_1
    invoke-virtual {p0}, Lcom/dogac/bin1/MainActivity;->getIntent()Landroid/content/Intent;

    move-result-object v2

    invoke-virtual {p0, v2}, Lcom/dogac/bin1/MainActivity;->uyanIstegi(Landroid/content/Intent;)V

    .line 114
    return-void
.end method

.method protected onDestroy()V
    .locals 1

    .line 148
    sget-object v0, Lcom/dogac/bin1/MainActivity;->ornek:Lcom/dogac/bin1/MainActivity;

    if-ne v0, p0, :cond_0

    const/4 v0, 0x0

    sput-object v0, Lcom/dogac/bin1/MainActivity;->ornek:Lcom/dogac/bin1/MainActivity;

    :cond_0
    iget-object v0, p0, Lcom/dogac/bin1/MainActivity;->tts:Landroid/speech/tts/TextToSpeech;

    if-eqz v0, :cond_1

    iget-object v0, p0, Lcom/dogac/bin1/MainActivity;->tts:Landroid/speech/tts/TextToSpeech;

    invoke-virtual {v0}, Landroid/speech/tts/TextToSpeech;->shutdown()V

    :cond_1
    iget-object v0, p0, Lcom/dogac/bin1/MainActivity;->tanima:Landroid/speech/SpeechRecognizer;

    if-eqz v0, :cond_2

    iget-object v0, p0, Lcom/dogac/bin1/MainActivity;->tanima:Landroid/speech/SpeechRecognizer;

    invoke-virtual {v0}, Landroid/speech/SpeechRecognizer;->destroy()V

    :cond_2
    iget-object v0, p0, Lcom/dogac/bin1/MainActivity;->web:Landroid/webkit/WebView;

    invoke-virtual {v0}, Landroid/webkit/WebView;->destroy()V

    invoke-super {p0}, Landroid/app/Activity;->onDestroy()V

    return-void
.end method

.method protected onNewIntent(Landroid/content/Intent;)V
    .locals 0
    .param p1, "i"    # Landroid/content/Intent;

    .line 116
    invoke-super {p0, p1}, Landroid/app/Activity;->onNewIntent(Landroid/content/Intent;)V

    invoke-virtual {p0, p1}, Lcom/dogac/bin1/MainActivity;->uyanIstegi(Landroid/content/Intent;)V

    return-void
.end method

.method protected onPause()V
    .locals 1

    .line 145
    invoke-super {p0}, Landroid/app/Activity;->onPause()V

    const/4 v0, 0x0

    iput-boolean v0, p0, Lcom/dogac/bin1/MainActivity;->onPlanda:Z

    return-void
.end method

.method public onRequestPermissionsResult(I[Ljava/lang/String;[I)V
    .locals 2
    .param p1, "k"    # I
    .param p2, "izinler"    # [Ljava/lang/String;
    .param p3, "sonuclar"    # [I

    .line 163
    const/16 v0, 0xb

    if-ne p1, v0, :cond_2

    .line 164
    array-length v0, p3

    const/4 v1, 0x0

    if-lez v0, :cond_0

    aget v0, p3, v1

    if-nez v0, :cond_0

    const/4 v1, 0x1

    :cond_0
    move v0, v1

    .line 165
    .local v0, "var":Z
    if-nez v0, :cond_1

    const-string v1, "carvisYerel.dinlemeHata(\'izin_yok\')"

    invoke-virtual {p0, v1}, Lcom/dogac/bin1/MainActivity;->js(Ljava/lang/String;)V

    goto :goto_0

    .line 166
    :cond_1
    iget-boolean v1, p0, Lcom/dogac/bin1/MainActivity;->uyandirmaIstendi:Z

    if-eqz v1, :cond_2

    invoke-virtual {p0}, Lcom/dogac/bin1/MainActivity;->servisBaslat()V

    .line 168
    .end local v0    # "var":Z
    :cond_2
    :goto_0
    return-void
.end method

.method protected onResume()V
    .locals 1

    .line 144
    invoke-super {p0}, Landroid/app/Activity;->onResume()V

    const/4 v0, 0x1

    iput-boolean v0, p0, Lcom/dogac/bin1/MainActivity;->onPlanda:Z

    iget-object v0, p0, Lcom/dogac/bin1/MainActivity;->web:Landroid/webkit/WebView;

    invoke-virtual {v0}, Landroid/webkit/WebView;->onResume()V

    return-void
.end method

.method protected onSaveInstanceState(Landroid/os/Bundle;)V
    .locals 1
    .param p1, "b"    # Landroid/os/Bundle;

    .line 146
    invoke-super {p0, p1}, Landroid/app/Activity;->onSaveInstanceState(Landroid/os/Bundle;)V

    iget-object v0, p0, Lcom/dogac/bin1/MainActivity;->web:Landroid/webkit/WebView;

    invoke-virtual {v0, p1}, Landroid/webkit/WebView;->saveState(Landroid/os/Bundle;)Landroid/webkit/WebBackForwardList;

    return-void
.end method

.method oneGetir()V
    .locals 2

    .line 200
    iget-boolean v0, p0, Lcom/dogac/bin1/MainActivity;->onPlanda:Z

    if-eqz v0, :cond_0

    return-void

    .line 201
    :cond_0
    :try_start_0
    new-instance v0, Landroid/content/Intent;

    const-class v1, Lcom/dogac/bin1/MainActivity;

    invoke-direct {v0, p0, v1}, Landroid/content/Intent;-><init>(Landroid/content/Context;Ljava/lang/Class;)V

    const/high16 v1, 0x30020000

    invoke-virtual {v0, v1}, Landroid/content/Intent;->addFlags(I)Landroid/content/Intent;

    move-result-object v0

    invoke-virtual {p0, v0}, Lcom/dogac/bin1/MainActivity;->startActivity(Landroid/content/Intent;)V
    :try_end_0
    .catch Ljava/lang/Exception; {:try_start_0 .. :try_end_0} :catch_0

    .line 202
    goto :goto_0

    :catch_0
    move-exception v0

    .local v0, "e":Ljava/lang/Exception;
    invoke-static {p0}, Lcom/dogac/bin1/CarvisServis;->ekranAcBildirimi(Landroid/content/Context;)V

    .line 203
    .end local v0    # "e":Ljava/lang/Exception;
    :goto_0
    return-void
.end method

.method servisBaslat()V
    .locals 2

    .line 185
    new-instance v0, Landroid/content/Intent;

    const-class v1, Lcom/dogac/bin1/CarvisServis;

    invoke-direct {v0, p0, v1}, Landroid/content/Intent;-><init>(Landroid/content/Context;Ljava/lang/Class;)V

    .line 186
    .local v0, "i":Landroid/content/Intent;
    invoke-virtual {p0, v0}, Lcom/dogac/bin1/MainActivity;->startForegroundService(Landroid/content/Intent;)Landroid/content/ComponentName;

    .line 187
    return-void
.end method

.method sesUygula()V
    .locals 9

    .line 130
    const-string v0, "Carvis"

    const-string v1, "carvis"

    const/4 v2, 0x0

    invoke-virtual {p0, v1, v2}, Lcom/dogac/bin1/MainActivity;->getSharedPreferences(Ljava/lang/String;I)Landroid/content/SharedPreferences;

    move-result-object v1

    .line 131
    .local v1, "sp":Landroid/content/SharedPreferences;
    const-string v2, "tr-tr-x-ama-local"

    const-string v3, "ses"

    invoke-interface {v1, v3, v2}, Landroid/content/SharedPreferences;->getString(Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;

    move-result-object v2

    .line 132
    .local v2, "ad":Ljava/lang/String;
    iget-object v4, p0, Lcom/dogac/bin1/MainActivity;->tts:Landroid/speech/tts/TextToSpeech;

    const-string v5, "perde"

    const v6, 0x3f59999a    # 0.85f

    invoke-interface {v1, v5, v6}, Landroid/content/SharedPreferences;->getFloat(Ljava/lang/String;F)F

    move-result v5

    invoke-virtual {v4, v5}, Landroid/speech/tts/TextToSpeech;->setPitch(F)I

    .line 134
    :try_start_0
    new-instance v4, Ljava/lang/StringBuilder;

    invoke-direct {v4}, Ljava/lang/StringBuilder;-><init>()V

    .line 135
    .local v4, "liste":Ljava/lang/StringBuilder;
    iget-object v5, p0, Lcom/dogac/bin1/MainActivity;->tts:Landroid/speech/tts/TextToSpeech;

    invoke-virtual {v5}, Landroid/speech/tts/TextToSpeech;->getVoices()Ljava/util/Set;

    move-result-object v5

    invoke-interface {v5}, Ljava/util/Set;->iterator()Ljava/util/Iterator;

    move-result-object v5

    :goto_0
    invoke-interface {v5}, Ljava/util/Iterator;->hasNext()Z

    move-result v6

    if-eqz v6, :cond_3

    invoke-interface {v5}, Ljava/util/Iterator;->next()Ljava/lang/Object;

    move-result-object v6

    check-cast v6, Landroid/speech/tts/Voice;

    .line 136
    .local v6, "v":Landroid/speech/tts/Voice;
    const-string v7, "tr"

    invoke-virtual {v6}, Landroid/speech/tts/Voice;->getLocale()Ljava/util/Locale;

    move-result-object v8

    invoke-virtual {v8}, Ljava/util/Locale;->getLanguage()Ljava/lang/String;

    move-result-object v8

    invoke-virtual {v7, v8}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v7

    if-nez v7, :cond_0

    goto :goto_0

    .line 137
    :cond_0
    invoke-virtual {v6}, Landroid/speech/tts/Voice;->getName()Ljava/lang/String;

    move-result-object v7

    invoke-virtual {v4, v7}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v7

    invoke-virtual {v6}, Landroid/speech/tts/Voice;->isNetworkConnectionRequired()Z

    move-result v8

    if-eqz v8, :cond_1

    const-string v8, "(a\u011f) "

    goto :goto_1

    :cond_1
    const-string v8, " "

    :goto_1
    invoke-virtual {v7, v8}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    .line 138
    invoke-virtual {v6}, Landroid/speech/tts/Voice;->getName()Ljava/lang/String;

    move-result-object v7

    invoke-virtual {v7, v2}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v7

    if-eqz v7, :cond_2

    iget-object v7, p0, Lcom/dogac/bin1/MainActivity;->tts:Landroid/speech/tts/TextToSpeech;

    invoke-virtual {v7, v6}, Landroid/speech/tts/TextToSpeech;->setVoice(Landroid/speech/tts/Voice;)I

    .line 139
    .end local v6    # "v":Landroid/speech/tts/Voice;
    :cond_2
    goto :goto_0

    .line 140
    :cond_3
    new-instance v5, Ljava/lang/StringBuilder;

    invoke-direct {v5}, Ljava/lang/StringBuilder;-><init>()V

    const-string v6, "sesler: "

    invoke-virtual {v5, v6}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v5

    invoke-virtual {v5, v4}, Ljava/lang/StringBuilder;->append(Ljava/lang/Object;)Ljava/lang/StringBuilder;

    move-result-object v5

    const-string v6, "| secili: "

    invoke-virtual {v5, v6}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v5

    iget-object v6, p0, Lcom/dogac/bin1/MainActivity;->tts:Landroid/speech/tts/TextToSpeech;

    invoke-virtual {v6}, Landroid/speech/tts/TextToSpeech;->getVoice()Landroid/speech/tts/Voice;

    move-result-object v6

    invoke-virtual {v6}, Landroid/speech/tts/Voice;->getName()Ljava/lang/String;

    move-result-object v6

    invoke-virtual {v5, v6}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v5

    invoke-virtual {v5}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v5

    invoke-static {v0, v5}, Landroid/util/Log;->i(Ljava/lang/String;Ljava/lang/String;)I
    :try_end_0
    .catch Ljava/lang/Exception; {:try_start_0 .. :try_end_0} :catch_0

    .line 141
    nop

    .end local v4    # "liste":Ljava/lang/StringBuilder;
    goto :goto_2

    :catch_0
    move-exception v4

    .local v4, "e":Ljava/lang/Exception;
    invoke-static {v0, v3, v4}, Landroid/util/Log;->e(Ljava/lang/String;Ljava/lang/String;Ljava/lang/Throwable;)I

    .line 142
    .end local v4    # "e":Ljava/lang/Exception;
    :goto_2
    return-void
.end method

.method tekCumleDinle()V
    .locals 6

    .line 207
    invoke-virtual {p0}, Lcom/dogac/bin1/MainActivity;->mikrofonVar()Z

    move-result v0

    const/4 v1, 0x0

    if-nez v0, :cond_0

    const/4 v0, 0x1

    new-array v0, v0, [Ljava/lang/String;

    const-string v2, "android.permission.RECORD_AUDIO"

    aput-object v2, v0, v1

    const/16 v1, 0xb

    invoke-virtual {p0, v0, v1}, Lcom/dogac/bin1/MainActivity;->requestPermissions([Ljava/lang/String;I)V

    return-void

    .line 208
    :cond_0
    invoke-static {p0}, Landroid/speech/SpeechRecognizer;->isRecognitionAvailable(Landroid/content/Context;)Z

    move-result v0

    if-nez v0, :cond_1

    const-string v0, "carvisYerel.dinlemeHata(\'tanima_yok\')"

    invoke-virtual {p0, v0}, Lcom/dogac/bin1/MainActivity;->js(Ljava/lang/String;)V

    return-void

    .line 209
    :cond_1
    invoke-static {}, Lcom/dogac/bin1/CarvisServis;->mikrofonuBirak()V

    .line 211
    invoke-static {}, Lcom/dogac/bin1/Cihaz;->sttKullanilabilir()Z

    move-result v0

    const-wide/16 v2, 0x12c

    if-eqz v0, :cond_2

    .line 212
    iget-object v0, p0, Lcom/dogac/bin1/MainActivity;->web:Landroid/webkit/WebView;

    new-instance v1, Lcom/dogac/bin1/MainActivity$$ExternalSyntheticLambda2;

    invoke-direct {v1, p0}, Lcom/dogac/bin1/MainActivity$$ExternalSyntheticLambda2;-><init>(Lcom/dogac/bin1/MainActivity;)V

    invoke-virtual {v0, v1, v2, v3}, Landroid/webkit/WebView;->postDelayed(Ljava/lang/Runnable;J)Z

    .line 216
    return-void

    .line 218
    :cond_2
    iget-object v0, p0, Lcom/dogac/bin1/MainActivity;->tanima:Landroid/speech/SpeechRecognizer;

    if-nez v0, :cond_3

    invoke-static {p0}, Landroid/speech/SpeechRecognizer;->createSpeechRecognizer(Landroid/content/Context;)Landroid/speech/SpeechRecognizer;

    move-result-object v0

    iput-object v0, p0, Lcom/dogac/bin1/MainActivity;->tanima:Landroid/speech/SpeechRecognizer;

    .line 219
    :cond_3
    iget-object v0, p0, Lcom/dogac/bin1/MainActivity;->tanima:Landroid/speech/SpeechRecognizer;

    new-instance v4, Lcom/dogac/bin1/MainActivity$5;

    invoke-direct {v4, p0}, Lcom/dogac/bin1/MainActivity$5;-><init>(Lcom/dogac/bin1/MainActivity;)V

    invoke-virtual {v0, v4}, Landroid/speech/SpeechRecognizer;->setRecognitionListener(Landroid/speech/RecognitionListener;)V

    .line 246
    new-instance v0, Landroid/content/Intent;

    const-string v4, "android.speech.action.RECOGNIZE_SPEECH"

    invoke-direct {v0, v4}, Landroid/content/Intent;-><init>(Ljava/lang/String;)V

    .line 247
    .local v0, "i":Landroid/content/Intent;
    const-string v4, "android.speech.extra.LANGUAGE_MODEL"

    const-string v5, "free_form"

    invoke-virtual {v0, v4, v5}, Landroid/content/Intent;->putExtra(Ljava/lang/String;Ljava/lang/String;)Landroid/content/Intent;

    .line 248
    const-string v4, "android.speech.extra.LANGUAGE"

    const-string v5, "tr-TR"

    invoke-virtual {v0, v4, v5}, Landroid/content/Intent;->putExtra(Ljava/lang/String;Ljava/lang/String;)Landroid/content/Intent;

    .line 249
    const-string v4, "android.speech.extra.PREFER_OFFLINE"

    invoke-virtual {v0, v4, v1}, Landroid/content/Intent;->putExtra(Ljava/lang/String;Z)Landroid/content/Intent;

    .line 250
    const-string v1, "android.speech.extras.SPEECH_INPUT_COMPLETE_SILENCE_LENGTH_MILLIS"

    const-wide/16 v4, 0x5dc

    invoke-virtual {v0, v1, v4, v5}, Landroid/content/Intent;->putExtra(Ljava/lang/String;J)Landroid/content/Intent;

    .line 251
    const-string v1, "android.speech.extra.MAX_RESULTS"

    const/4 v4, 0x5

    invoke-virtual {v0, v1, v4}, Landroid/content/Intent;->putExtra(Ljava/lang/String;I)Landroid/content/Intent;

    .line 253
    sget v1, Landroid/os/Build$VERSION;->SDK_INT:I

    const/16 v4, 0x21

    if-lt v1, v4, :cond_4

    const-string v1, "android.speech.extra.BIASING_STRINGS"

    invoke-virtual {p0}, Lcom/dogac/bin1/MainActivity;->terimler()Ljava/util/ArrayList;

    move-result-object v4

    invoke-virtual {v0, v1, v4}, Landroid/content/Intent;->putStringArrayListExtra(Ljava/lang/String;Ljava/util/ArrayList;)Landroid/content/Intent;

    .line 255
    :cond_4
    new-instance v1, Landroid/os/Handler;

    invoke-static {}, Landroid/os/Looper;->getMainLooper()Landroid/os/Looper;

    move-result-object v4

    invoke-direct {v1, v4}, Landroid/os/Handler;-><init>(Landroid/os/Looper;)V

    new-instance v4, Lcom/dogac/bin1/MainActivity$$ExternalSyntheticLambda3;

    invoke-direct {v4, p0, v0}, Lcom/dogac/bin1/MainActivity$$ExternalSyntheticLambda3;-><init>(Lcom/dogac/bin1/MainActivity;Landroid/content/Intent;)V

    invoke-virtual {v1, v4, v2, v3}, Landroid/os/Handler;->postDelayed(Ljava/lang/Runnable;J)Z

    .line 256
    return-void
.end method

.method terimler()Ljava/util/ArrayList;
    .locals 4
    .annotation system Ldalvik/annotation/Signature;
        value = {
            "()",
            "Ljava/util/ArrayList<",
            "Ljava/lang/String;",
            ">;"
        }
    .end annotation

    .line 260
    iget-object v0, p0, Lcom/dogac/bin1/MainActivity;->terimListesi:Ljava/util/ArrayList;

    if-eqz v0, :cond_0

    iget-object v0, p0, Lcom/dogac/bin1/MainActivity;->terimListesi:Ljava/util/ArrayList;

    return-object v0

    .line 261
    :cond_0
    new-instance v0, Ljava/util/ArrayList;

    invoke-direct {v0}, Ljava/util/ArrayList;-><init>()V

    iput-object v0, p0, Lcom/dogac/bin1/MainActivity;->terimListesi:Ljava/util/ArrayList;

    .line 262
    :try_start_0
    new-instance v0, Ljava/io/BufferedReader;

    new-instance v1, Ljava/io/InputStreamReader;

    invoke-virtual {p0}, Lcom/dogac/bin1/MainActivity;->getAssets()Landroid/content/res/AssetManager;

    move-result-object v2

    const-string v3, "terimler.txt"

    invoke-virtual {v2, v3}, Landroid/content/res/AssetManager;->open(Ljava/lang/String;)Ljava/io/InputStream;

    move-result-object v2

    const-string v3, "UTF-8"

    invoke-direct {v1, v2, v3}, Ljava/io/InputStreamReader;-><init>(Ljava/io/InputStream;Ljava/lang/String;)V

    invoke-direct {v0, v1}, Ljava/io/BufferedReader;-><init>(Ljava/io/Reader;)V
    :try_end_0
    .catch Ljava/lang/Exception; {:try_start_0 .. :try_end_0} :catch_0

    .line 263
    .local v0, "r":Ljava/io/BufferedReader;
    :cond_1
    :goto_0
    :try_start_1
    invoke-virtual {v0}, Ljava/io/BufferedReader;->readLine()Ljava/lang/String;

    move-result-object v1

    move-object v2, v1

    .local v2, "s":Ljava/lang/String;
    if-eqz v1, :cond_2

    invoke-virtual {v2}, Ljava/lang/String;->trim()Ljava/lang/String;

    move-result-object v1

    invoke-virtual {v1}, Ljava/lang/String;->isEmpty()Z

    move-result v1

    if-nez v1, :cond_1

    iget-object v1, p0, Lcom/dogac/bin1/MainActivity;->terimListesi:Ljava/util/ArrayList;

    invoke-virtual {v2}, Ljava/lang/String;->trim()Ljava/lang/String;

    move-result-object v3

    invoke-virtual {v1, v3}, Ljava/util/ArrayList;->add(Ljava/lang/Object;)Z
    :try_end_1
    .catchall {:try_start_1 .. :try_end_1} :catchall_0

    goto :goto_0

    .line 264
    .end local v2    # "s":Ljava/lang/String;
    :cond_2
    :try_start_2
    invoke-virtual {v0}, Ljava/io/BufferedReader;->close()V
    :try_end_2
    .catch Ljava/lang/Exception; {:try_start_2 .. :try_end_2} :catch_0

    goto :goto_2

    .line 262
    :catchall_0
    move-exception v1

    :try_start_3
    invoke-virtual {v0}, Ljava/io/BufferedReader;->close()V
    :try_end_3
    .catchall {:try_start_3 .. :try_end_3} :catchall_1

    goto :goto_1

    :catchall_1
    move-exception v2

    :try_start_4
    invoke-virtual {v1, v2}, Ljava/lang/Throwable;->addSuppressed(Ljava/lang/Throwable;)V

    :goto_1
    throw v1
    :try_end_4
    .catch Ljava/lang/Exception; {:try_start_4 .. :try_end_4} :catch_0

    .line 264
    .end local v0    # "r":Ljava/io/BufferedReader;
    :catch_0
    move-exception v0

    .local v0, "e":Ljava/lang/Exception;
    const-string v1, "Carvis"

    const-string v2, "terimler"

    invoke-static {v1, v2, v0}, Landroid/util/Log;->e(Ljava/lang/String;Ljava/lang/String;Ljava/lang/Throwable;)I

    .line 265
    .end local v0    # "e":Ljava/lang/Exception;
    :goto_2
    iget-object v0, p0, Lcom/dogac/bin1/MainActivity;->terimListesi:Ljava/util/ArrayList;

    return-object v0
.end method

.method uyanIstegi(Landroid/content/Intent;)V
    .locals 6
    .param p1, "i"    # Landroid/content/Intent;

    .line 118
    if-nez p1, :cond_0

    return-void

    .line 119
    :cond_0
    const-string v0, "uyan"

    const/4 v1, 0x0

    invoke-virtual {p1, v0, v1}, Landroid/content/Intent;->getBooleanExtra(Ljava/lang/String;Z)Z

    move-result v0

    if-eqz v0, :cond_1

    iget-object v0, p0, Lcom/dogac/bin1/MainActivity;->web:Landroid/webkit/WebView;

    new-instance v2, Lcom/dogac/bin1/MainActivity$$ExternalSyntheticLambda4;

    invoke-direct {v2, p0}, Lcom/dogac/bin1/MainActivity$$ExternalSyntheticLambda4;-><init>(Lcom/dogac/bin1/MainActivity;)V

    const-wide/16 v3, 0x4b0

    invoke-virtual {v0, v2, v3, v4}, Landroid/webkit/WebView;->postDelayed(Ljava/lang/Runnable;J)Z

    .line 121
    :cond_1
    const-string v0, "muzik"

    invoke-virtual {p1, v0}, Landroid/content/Intent;->hasExtra(Ljava/lang/String;)Z

    move-result v2

    if-eqz v2, :cond_2

    invoke-virtual {p1, v0}, Landroid/content/Intent;->getStringExtra(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v0

    .local v0, "q":Ljava/lang/String;
    iget-object v2, p0, Lcom/dogac/bin1/MainActivity;->web:Landroid/webkit/WebView;

    new-instance v3, Lcom/dogac/bin1/MainActivity$$ExternalSyntheticLambda5;

    invoke-direct {v3, p0, v0}, Lcom/dogac/bin1/MainActivity$$ExternalSyntheticLambda5;-><init>(Lcom/dogac/bin1/MainActivity;Ljava/lang/String;)V

    const-wide/16 v4, 0x320

    invoke-virtual {v2, v3, v4, v5}, Landroid/webkit/WebView;->postDelayed(Ljava/lang/Runnable;J)Z

    .line 123
    .end local v0    # "q":Ljava/lang/String;
    :cond_2
    const-string v0, "ses"

    invoke-virtual {p1, v0}, Landroid/content/Intent;->hasExtra(Ljava/lang/String;)Z

    move-result v2

    if-eqz v2, :cond_3

    .line 124
    const-string v2, "carvis"

    invoke-virtual {p0, v2, v1}, Lcom/dogac/bin1/MainActivity;->getSharedPreferences(Ljava/lang/String;I)Landroid/content/SharedPreferences;

    move-result-object v1

    invoke-interface {v1}, Landroid/content/SharedPreferences;->edit()Landroid/content/SharedPreferences$Editor;

    move-result-object v1

    invoke-virtual {p1, v0}, Landroid/content/Intent;->getStringExtra(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v2

    invoke-interface {v1, v0, v2}, Landroid/content/SharedPreferences$Editor;->putString(Ljava/lang/String;Ljava/lang/String;)Landroid/content/SharedPreferences$Editor;

    move-result-object v0

    const v1, 0x3f59999a    # 0.85f

    const-string v2, "perde"

    invoke-virtual {p1, v2, v1}, Landroid/content/Intent;->getFloatExtra(Ljava/lang/String;F)F

    move-result v1

    invoke-interface {v0, v2, v1}, Landroid/content/SharedPreferences$Editor;->putFloat(Ljava/lang/String;F)Landroid/content/SharedPreferences$Editor;

    move-result-object v0

    invoke-interface {v0}, Landroid/content/SharedPreferences$Editor;->apply()V

    .line 125
    iget-object v0, p0, Lcom/dogac/bin1/MainActivity;->web:Landroid/webkit/WebView;

    new-instance v1, Lcom/dogac/bin1/MainActivity$$ExternalSyntheticLambda6;

    invoke-direct {v1, p0}, Lcom/dogac/bin1/MainActivity$$ExternalSyntheticLambda6;-><init>(Lcom/dogac/bin1/MainActivity;)V

    const-wide/16 v2, 0x5dc

    invoke-virtual {v0, v1, v2, v3}, Landroid/webkit/WebView;->postDelayed(Ljava/lang/Runnable;J)Z

    .line 127
    :cond_3
    return-void
.end method

.method uyandir()V
    .locals 3

    .line 193
    const-string v0, "carvis"

    const/4 v1, 0x0

    invoke-virtual {p0, v0, v1}, Lcom/dogac/bin1/MainActivity;->getSharedPreferences(Ljava/lang/String;I)Landroid/content/SharedPreferences;

    move-result-object v0

    const-string v1, "arkaPlan"

    const/4 v2, 0x1

    invoke-interface {v0, v1, v2}, Landroid/content/SharedPreferences;->getBoolean(Ljava/lang/String;Z)Z

    move-result v0

    .line 195
    .local v0, "arkaPlan":Z
    iget-boolean v1, p0, Lcom/dogac/bin1/MainActivity;->onPlanda:Z

    if-nez v1, :cond_1

    sget-boolean v1, Lcom/dogac/bin1/MainActivity;->oturumAcik:Z

    if-nez v1, :cond_1

    if-eqz v0, :cond_0

    goto :goto_0

    .line 196
    :cond_0
    invoke-static {p0}, Lcom/dogac/bin1/CarvisServis;->ekranAcBildirimi(Landroid/content/Context;)V

    goto :goto_2

    .line 195
    :cond_1
    :goto_0
    new-instance v1, Ljava/lang/StringBuilder;

    invoke-direct {v1}, Ljava/lang/StringBuilder;-><init>()V

    const-string v2, "carvisYerel.uyan("

    invoke-virtual {v1, v2}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v1

    iget-boolean v2, p0, Lcom/dogac/bin1/MainActivity;->onPlanda:Z

    if-eqz v2, :cond_2

    const-string v2, "false"

    goto :goto_1

    :cond_2
    const-string v2, "true"

    :goto_1
    invoke-virtual {v1, v2}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v1

    const-string v2, ")"

    invoke-virtual {v1, v2}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v1

    invoke-virtual {v1}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v1

    invoke-virtual {p0, v1}, Lcom/dogac/bin1/MainActivity;->js(Ljava/lang/String;)V

    .line 197
    :goto_2
    return-void
.end method
