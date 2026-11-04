.class public Lcom/dogac/bin1/EkranGozu;
.super Ljava/lang/Object;
.source "EkranGozu.java"


# static fields
.field static acik:Z

.field static final ana:Landroid/os/Handler;

.field static final gorunurluk:Ljava/lang/Runnable;

.field static izliyor:Z

.field static lp:Landroid/view/WindowManager$LayoutParams;

.field static nokta:Landroid/view/View;

.field static son:Ljava/lang/String;

.field static yakalaniyor:Z


# direct methods
.method static constructor <clinit>()V
    .locals 2

    .line 36
    new-instance v0, Landroid/os/Handler;

    invoke-static {}, Landroid/os/Looper;->getMainLooper()Landroid/os/Looper;

    move-result-object v1

    invoke-direct {v0, v1}, Landroid/os/Handler;-><init>(Landroid/os/Looper;)V

    sput-object v0, Lcom/dogac/bin1/EkranGozu;->ana:Landroid/os/Handler;

    const/4 v0, 0x0

    .line 40
    sput-object v0, Lcom/dogac/bin1/EkranGozu;->son:Ljava/lang/String;

    .line 142
    new-instance v0, Lcom/dogac/bin1/EkranGozu$5;

    invoke-direct {v0}, Lcom/dogac/bin1/EkranGozu$5;-><init>()V

    sput-object v0, Lcom/dogac/bin1/EkranGozu;->gorunurluk:Ljava/lang/Runnable;

    return-void
.end method

.method public constructor <init>()V
    .locals 0

    .line 35
    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    return-void
.end method

.method static agac(Lcom/dogac/bin1/CarvisErisim;)[Ljava/lang/String;
    .locals 6

    .line 209
    const-string v0, ""

    .line 210
    new-instance v1, Ljava/util/LinkedHashSet;

    invoke-direct {v1}, Ljava/util/LinkedHashSet;-><init>()V

    .line 212
    :try_start_0
    invoke-virtual {p0}, Lcom/dogac/bin1/CarvisErisim;->getRootInActiveWindow()Landroid/view/accessibility/AccessibilityNodeInfo;

    move-result-object v2

    if-eqz v2, :cond_0

    .line 214
    invoke-virtual {v2}, Landroid/view/accessibility/AccessibilityNodeInfo;->getPackageName()Ljava/lang/CharSequence;

    move-result-object v3

    invoke-static {v3}, Ljava/lang/String;->valueOf(Ljava/lang/Object;)Ljava/lang/String;

    move-result-object v0
    :try_end_0
    .catchall {:try_start_0 .. :try_end_0} :catchall_1

    const/4 v3, 0x0

    .line 215
    :try_start_1
    invoke-virtual {p0}, Lcom/dogac/bin1/CarvisErisim;->getPackageManager()Landroid/content/pm/PackageManager;

    move-result-object v4

    invoke-virtual {p0}, Lcom/dogac/bin1/CarvisErisim;->getPackageManager()Landroid/content/pm/PackageManager;

    move-result-object p0

    invoke-virtual {p0, v0, v3}, Landroid/content/pm/PackageManager;->getApplicationInfo(Ljava/lang/String;I)Landroid/content/pm/ApplicationInfo;

    move-result-object p0

    invoke-virtual {v4, p0}, Landroid/content/pm/PackageManager;->getApplicationLabel(Landroid/content/pm/ApplicationInfo;)Ljava/lang/CharSequence;

    move-result-object p0

    invoke-static {p0}, Ljava/lang/String;->valueOf(Ljava/lang/Object;)Ljava/lang/String;

    move-result-object p0
    :try_end_1
    .catchall {:try_start_1 .. :try_end_1} :catchall_0

    goto :goto_0

    :catchall_0
    move-object p0, v0

    .line 216
    :goto_0
    :try_start_2
    invoke-static {v2, v1, v3}, Lcom/dogac/bin1/EkranGozu;->topla(Landroid/view/accessibility/AccessibilityNodeInfo;Ljava/util/LinkedHashSet;I)V
    :try_end_2
    .catchall {:try_start_2 .. :try_end_2} :catchall_2

    goto :goto_1

    :catchall_1
    :cond_0
    move-object p0, v0

    .line 219
    :catchall_2
    :goto_1
    new-instance v2, Ljava/lang/StringBuilder;

    invoke-direct {v2}, Ljava/lang/StringBuilder;-><init>()V

    .line 220
    invoke-virtual {v1}, Ljava/util/LinkedHashSet;->iterator()Ljava/util/Iterator;

    move-result-object v1

    :goto_2
    invoke-interface {v1}, Ljava/util/Iterator;->hasNext()Z

    move-result v3

    if-eqz v3, :cond_2

    invoke-interface {v1}, Ljava/util/Iterator;->next()Ljava/lang/Object;

    move-result-object v3

    check-cast v3, Ljava/lang/String;

    invoke-virtual {v2}, Ljava/lang/StringBuilder;->length()I

    move-result v4

    invoke-virtual {v3}, Ljava/lang/String;->length()I

    move-result v5

    add-int/2addr v4, v5

    const/16 v5, 0x1770

    if-le v4, v5, :cond_1

    goto :goto_3

    :cond_1
    invoke-virtual {v2, v3}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    const/16 v3, 0xa

    invoke-virtual {v2, v3}, Ljava/lang/StringBuilder;->append(C)Ljava/lang/StringBuilder;

    goto :goto_2

    .line 221
    :cond_2
    :goto_3
    invoke-virtual {v2}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v1

    filled-new-array {v0, p0, v1}, [Ljava/lang/String;

    move-result-object p0

    return-object p0
.end method

.method public static ayarla(Z)Ljava/lang/String;
    .locals 2

    .line 46
    invoke-static {}, Lcom/dogac/bin1/EkranGozu;->baglam()Landroid/content/Context;

    move-result-object v0

    if-eqz v0, :cond_0

    .line 47
    invoke-static {v0}, Lcom/dogac/bin1/EkranGozu;->tercih(Landroid/content/Context;)Landroid/content/SharedPreferences;

    move-result-object v0

    invoke-interface {v0}, Landroid/content/SharedPreferences;->edit()Landroid/content/SharedPreferences$Editor;

    move-result-object v0

    const-string v1, "acik"

    invoke-interface {v0, v1, p0}, Landroid/content/SharedPreferences$Editor;->putBoolean(Ljava/lang/String;Z)Landroid/content/SharedPreferences$Editor;

    move-result-object v0

    invoke-interface {v0}, Landroid/content/SharedPreferences$Editor;->apply()V

    .line 48
    :cond_0
    sput-boolean p0, Lcom/dogac/bin1/EkranGozu;->acik:Z

    .line 49
    sget-object v0, Lcom/dogac/bin1/CarvisErisim;->ornek:Lcom/dogac/bin1/CarvisErisim;

    if-nez v0, :cond_2

    if-eqz p0, :cond_1

    .line 51
    sget-object p0, Lcom/dogac/bin1/MainActivity;->ornek:Lcom/dogac/bin1/MainActivity;

    if-eqz p0, :cond_1

    .line 52
    new-instance v0, Lcom/dogac/bin1/EkranGozu$1;

    invoke-direct {v0, p0}, Lcom/dogac/bin1/EkranGozu$1;-><init>(Lcom/dogac/bin1/MainActivity;)V

    invoke-virtual {p0, v0}, Lcom/dogac/bin1/MainActivity;->runOnUiThread(Ljava/lang/Runnable;)V

    .line 56
    :cond_1
    const-string p0, "erisim-kapali"

    return-object p0

    .line 58
    :cond_2
    sget-object p0, Lcom/dogac/bin1/EkranGozu;->ana:Landroid/os/Handler;

    new-instance v0, Lcom/dogac/bin1/EkranGozu$2;

    invoke-direct {v0}, Lcom/dogac/bin1/EkranGozu$2;-><init>()V

    invoke-virtual {p0, v0}, Landroid/os/Handler;->post(Ljava/lang/Runnable;)Z

    .line 59
    const-string p0, "ok"

    return-object p0
.end method

.method static baglam()Landroid/content/Context;
    .locals 1

    .line 43
    sget-object v0, Lcom/dogac/bin1/CarvisErisim;->ornek:Lcom/dogac/bin1/CarvisErisim;

    if-eqz v0, :cond_0

    sget-object v0, Lcom/dogac/bin1/CarvisErisim;->ornek:Lcom/dogac/bin1/CarvisErisim;

    goto :goto_0

    :cond_0
    sget-object v0, Lcom/dogac/bin1/MainActivity;->ornek:Lcom/dogac/bin1/MainActivity;

    :goto_0
    return-object v0
.end method

.method static bitir(Landroid/content/Context;[Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V
    .locals 5

    const/4 v0, 0x1

    const/4 v1, 0x0

    .line 190
    :try_start_0
    new-instance v2, Lorg/json/JSONObject;

    invoke-direct {v2}, Lorg/json/JSONObject;-><init>()V

    .line 191
    const-string v3, "paket"

    aget-object v4, p1, v1

    invoke-virtual {v2, v3, v4}, Lorg/json/JSONObject;->put(Ljava/lang/String;Ljava/lang/Object;)Lorg/json/JSONObject;

    const-string v3, "uygulama"

    aget-object v4, p1, v0

    invoke-virtual {v2, v3, v4}, Lorg/json/JSONObject;->put(Ljava/lang/String;Ljava/lang/Object;)Lorg/json/JSONObject;

    const-string v3, "metin"

    const/4 v4, 0x2

    aget-object p1, p1, v4

    invoke-virtual {v2, v3, p1}, Lorg/json/JSONObject;->put(Ljava/lang/String;Ljava/lang/Object;)Lorg/json/JSONObject;

    if-eqz p2, :cond_0

    .line 192
    const-string p1, "resim"

    invoke-virtual {v2, p1, p2}, Lorg/json/JSONObject;->put(Ljava/lang/String;Ljava/lang/Object;)Lorg/json/JSONObject;

    :cond_0
    if-eqz p3, :cond_1

    .line 193
    const-string p1, "not"

    invoke-virtual {v2, p1, p3}, Lorg/json/JSONObject;->put(Ljava/lang/String;Ljava/lang/Object;)Lorg/json/JSONObject;

    .line 194
    :cond_1
    const-string p1, "t"

    invoke-static {}, Ljava/lang/System;->currentTimeMillis()J

    move-result-wide p2

    invoke-virtual {v2, p1, p2, p3}, Lorg/json/JSONObject;->put(Ljava/lang/String;J)Lorg/json/JSONObject;

    .line 195
    invoke-virtual {v2}, Lorg/json/JSONObject;->toString()Ljava/lang/String;

    move-result-object p1

    sput-object p1, Lcom/dogac/bin1/EkranGozu;->son:Ljava/lang/String;
    :try_end_0
    .catchall {:try_start_0 .. :try_end_0} :catchall_0

    .line 197
    :catchall_0
    sput-boolean v1, Lcom/dogac/bin1/EkranGozu;->yakalaniyor:Z

    .line 198
    sget-object p1, Lcom/dogac/bin1/EkranGozu;->nokta:Landroid/view/View;

    if-eqz p1, :cond_2

    invoke-virtual {p1, v1}, Landroid/view/View;->setVisibility(I)V

    .line 200
    :cond_2
    :try_start_1
    new-instance p1, Landroid/content/Intent;

    const-class p2, Lcom/dogac/bin1/MainActivity;

    invoke-direct {p1, p0, p2}, Landroid/content/Intent;-><init>(Landroid/content/Context;Ljava/lang/Class;)V

    const/high16 p2, 0x30020000

    invoke-virtual {p1, p2}, Landroid/content/Intent;->addFlags(I)Landroid/content/Intent;

    move-result-object p1

    .line 201
    const-string p2, "ekranGozu"

    invoke-virtual {p1, p2, v0}, Landroid/content/Intent;->putExtra(Ljava/lang/String;Z)Landroid/content/Intent;

    .line 202
    invoke-virtual {p0, p1}, Landroid/content/Context;->startActivity(Landroid/content/Intent;)V
    :try_end_1
    .catchall {:try_start_1 .. :try_end_1} :catchall_1

    .line 204
    :catchall_1
    sget-object p0, Lcom/dogac/bin1/EkranGozu;->ana:Landroid/os/Handler;

    new-instance p1, Lcom/dogac/bin1/EkranGozu$7;

    invoke-direct {p1}, Lcom/dogac/bin1/EkranGozu$7;-><init>()V

    const-wide/16 p2, 0x28a

    invoke-virtual {p0, p1, p2, p3}, Landroid/os/Handler;->postDelayed(Ljava/lang/Runnable;J)Z

    return-void
.end method

.method static dp(Landroid/content/Context;I)I
    .locals 0

    int-to-float p1, p1

    .line 76
    invoke-virtual {p0}, Landroid/content/Context;->getResources()Landroid/content/res/Resources;

    move-result-object p0

    invoke-virtual {p0}, Landroid/content/res/Resources;->getDisplayMetrics()Landroid/util/DisplayMetrics;

    move-result-object p0

    iget p0, p0, Landroid/util/DisplayMetrics;->density:F

    mul-float/2addr p1, p0

    invoke-static {p1}, Ljava/lang/Math;->round(F)I

    move-result p0

    return p0
.end method

.method public static durum()Ljava/lang/String;
    .locals 6

    .line 64
    :try_start_0
    invoke-static {}, Lcom/dogac/bin1/EkranGozu;->baglam()Landroid/content/Context;

    move-result-object v0

    .line 65
    new-instance v1, Lorg/json/JSONObject;

    invoke-direct {v1}, Lorg/json/JSONObject;-><init>()V

    .line 66
    const-string v2, "erisim"

    sget-object v3, Lcom/dogac/bin1/CarvisErisim;->ornek:Lcom/dogac/bin1/CarvisErisim;

    const/4 v4, 0x1

    const/4 v5, 0x0

    if-eqz v3, :cond_0

    move v3, v4

    goto :goto_0

    :cond_0
    move v3, v5

    :goto_0
    invoke-virtual {v1, v2, v3}, Lorg/json/JSONObject;->put(Ljava/lang/String;Z)Lorg/json/JSONObject;
    :try_end_0
    .catchall {:try_start_0 .. :try_end_0} :catchall_0

    .line 67
    const-string v2, "acik"

    if-eqz v0, :cond_1

    :try_start_1
    invoke-static {v0}, Lcom/dogac/bin1/EkranGozu;->tercih(Landroid/content/Context;)Landroid/content/SharedPreferences;

    move-result-object v0

    invoke-interface {v0, v2, v5}, Landroid/content/SharedPreferences;->getBoolean(Ljava/lang/String;Z)Z

    move-result v0

    if-eqz v0, :cond_1

    move v0, v4

    goto :goto_1

    :cond_1
    move v0, v5

    :goto_1
    invoke-virtual {v1, v2, v0}, Lorg/json/JSONObject;->put(Ljava/lang/String;Z)Lorg/json/JSONObject;

    .line 68
    const-string v0, "nokta"

    sget-object v2, Lcom/dogac/bin1/EkranGozu;->nokta:Landroid/view/View;

    if-eqz v2, :cond_2

    move v2, v4

    goto :goto_2

    :cond_2
    move v2, v5

    :goto_2
    invoke-virtual {v1, v0, v2}, Lorg/json/JSONObject;->put(Ljava/lang/String;Z)Lorg/json/JSONObject;

    .line 69
    const-string v0, "goruntu"

    sget v2, Landroid/os/Build$VERSION;->SDK_INT:I

    const/16 v3, 0x1e

    if-lt v2, v3, :cond_3

    goto :goto_3

    :cond_3
    move v4, v5

    :goto_3
    invoke-virtual {v1, v0, v4}, Lorg/json/JSONObject;->put(Ljava/lang/String;Z)Lorg/json/JSONObject;

    .line 70
    invoke-virtual {v1}, Lorg/json/JSONObject;->toString()Ljava/lang/String;

    move-result-object v0
    :try_end_1
    .catchall {:try_start_1 .. :try_end_1} :catchall_0

    return-object v0

    .line 71
    :catchall_0
    const-string v0, "{}"

    return-object v0
.end method

.method static kaldir()V
    .locals 2

    .line 152
    sget-object v0, Lcom/dogac/bin1/CarvisErisim;->ornek:Lcom/dogac/bin1/CarvisErisim;

    .line 153
    sget-object v1, Lcom/dogac/bin1/EkranGozu;->nokta:Landroid/view/View;

    if-eqz v1, :cond_0

    if-eqz v0, :cond_0

    :try_start_0
    const-string v1, "window"

    invoke-virtual {v0, v1}, Lcom/dogac/bin1/CarvisErisim;->getSystemService(Ljava/lang/String;)Ljava/lang/Object;

    move-result-object v0

    check-cast v0, Landroid/view/WindowManager;

    sget-object v1, Lcom/dogac/bin1/EkranGozu;->nokta:Landroid/view/View;

    invoke-interface {v0, v1}, Landroid/view/WindowManager;->removeView(Landroid/view/View;)V
    :try_end_0
    .catchall {:try_start_0 .. :try_end_0} :catchall_0

    :catchall_0
    :cond_0
    const/4 v0, 0x0

    .line 154
    sput-object v0, Lcom/dogac/bin1/EkranGozu;->nokta:Landroid/view/View;

    return-void
.end method

.method static kur()V
    .locals 10

    .line 79
    sget-object v0, Lcom/dogac/bin1/CarvisErisim;->ornek:Lcom/dogac/bin1/CarvisErisim;

    if-eqz v0, :cond_2

    .line 80
    sget-object v1, Lcom/dogac/bin1/EkranGozu;->nokta:Landroid/view/View;

    if-eqz v1, :cond_0

    goto/16 :goto_0

    .line 81
    :cond_0
    const-string v1, "window"

    invoke-virtual {v0, v1}, Lcom/dogac/bin1/CarvisErisim;->getSystemService(Ljava/lang/String;)Ljava/lang/Object;

    move-result-object v1

    check-cast v1, Landroid/view/WindowManager;

    const/16 v2, 0x36

    .line 82
    invoke-static {v0, v2}, Lcom/dogac/bin1/EkranGozu;->dp(Landroid/content/Context;I)I

    move-result v2

    .line 83
    new-instance v3, Lcom/dogac/bin1/EkranGozu$3;

    invoke-direct {v3, v0}, Lcom/dogac/bin1/EkranGozu$3;-><init>(Landroid/content/Context;)V

    sput-object v3, Lcom/dogac/bin1/EkranGozu;->nokta:Landroid/view/View;

    .line 106
    new-instance v9, Landroid/view/WindowManager$LayoutParams;

    const/16 v7, 0x208

    const/4 v8, -0x3

    const/16 v6, 0x7f0

    move-object v3, v9

    move v4, v2

    move v5, v2

    invoke-direct/range {v3 .. v8}, Landroid/view/WindowManager$LayoutParams;-><init>(IIIII)V

    sput-object v9, Lcom/dogac/bin1/EkranGozu;->lp:Landroid/view/WindowManager$LayoutParams;

    const/16 v3, 0x33

    .line 108
    iput v3, v9, Landroid/view/WindowManager$LayoutParams;->gravity:I

    .line 109
    invoke-virtual {v0}, Lcom/dogac/bin1/CarvisErisim;->getResources()Landroid/content/res/Resources;

    move-result-object v3

    invoke-virtual {v3}, Landroid/content/res/Resources;->getDisplayMetrics()Landroid/util/DisplayMetrics;

    move-result-object v3

    iget v3, v3, Landroid/util/DisplayMetrics;->widthPixels:I

    invoke-virtual {v0}, Lcom/dogac/bin1/CarvisErisim;->getResources()Landroid/content/res/Resources;

    move-result-object v4

    invoke-virtual {v4}, Landroid/content/res/Resources;->getDisplayMetrics()Landroid/util/DisplayMetrics;

    move-result-object v4

    iget v4, v4, Landroid/util/DisplayMetrics;->heightPixels:I

    .line 110
    invoke-static {v0}, Lcom/dogac/bin1/EkranGozu;->tercih(Landroid/content/Context;)Landroid/content/SharedPreferences;

    move-result-object v5

    .line 111
    sget-object v6, Lcom/dogac/bin1/EkranGozu;->lp:Landroid/view/WindowManager$LayoutParams;

    sub-int/2addr v3, v2

    const/4 v2, 0x6

    invoke-static {v0, v2}, Lcom/dogac/bin1/EkranGozu;->dp(Landroid/content/Context;I)I

    move-result v0

    sub-int/2addr v3, v0

    const-string v0, "x"

    invoke-interface {v5, v0, v3}, Landroid/content/SharedPreferences;->getInt(Ljava/lang/String;I)I

    move-result v0

    iput v0, v6, Landroid/view/WindowManager$LayoutParams;->x:I

    sget-object v0, Lcom/dogac/bin1/EkranGozu;->lp:Landroid/view/WindowManager$LayoutParams;

    int-to-float v2, v4

    const v3, 0x3ed70a3d    # 0.42f

    mul-float/2addr v2, v3

    float-to-int v2, v2

    const-string v3, "y"

    invoke-interface {v5, v3, v2}, Landroid/content/SharedPreferences;->getInt(Ljava/lang/String;I)I

    move-result v2

    iput v2, v0, Landroid/view/WindowManager$LayoutParams;->y:I

    .line 112
    sget-object v0, Lcom/dogac/bin1/EkranGozu;->nokta:Landroid/view/View;

    const-string v2, "Carvis ekran g\u00f6z\u00fc"

    invoke-virtual {v0, v2}, Landroid/view/View;->setContentDescription(Ljava/lang/CharSequence;)V

    .line 113
    sget-object v0, Lcom/dogac/bin1/EkranGozu;->nokta:Landroid/view/View;

    new-instance v2, Lcom/dogac/bin1/EkranGozu$4;

    invoke-direct {v2, v1}, Lcom/dogac/bin1/EkranGozu$4;-><init>(Landroid/view/WindowManager;)V

    invoke-virtual {v0, v2}, Landroid/view/View;->setOnTouchListener(Landroid/view/View$OnTouchListener;)V

    .line 137
    :try_start_0
    sget-object v0, Lcom/dogac/bin1/EkranGozu;->nokta:Landroid/view/View;

    sget-object v2, Lcom/dogac/bin1/EkranGozu;->lp:Landroid/view/WindowManager$LayoutParams;

    invoke-interface {v1, v0, v2}, Landroid/view/WindowManager;->addView(Landroid/view/View;Landroid/view/ViewGroup$LayoutParams;)V
    :try_end_0
    .catchall {:try_start_0 .. :try_end_0} :catchall_0

    .line 138
    sget-boolean v0, Lcom/dogac/bin1/EkranGozu;->izliyor:Z

    if-nez v0, :cond_1

    const/4 v0, 0x1

    sput-boolean v0, Lcom/dogac/bin1/EkranGozu;->izliyor:Z

    sget-object v0, Lcom/dogac/bin1/EkranGozu;->ana:Landroid/os/Handler;

    sget-object v1, Lcom/dogac/bin1/EkranGozu;->gorunurluk:Ljava/lang/Runnable;

    const-wide/16 v2, 0x2bc

    invoke-virtual {v0, v1, v2, v3}, Landroid/os/Handler;->postDelayed(Ljava/lang/Runnable;J)Z

    :cond_1
    return-void

    :catchall_0
    const/4 v0, 0x0

    .line 137
    sput-object v0, Lcom/dogac/bin1/EkranGozu;->nokta:Landroid/view/View;

    :cond_2
    :goto_0
    return-void
.end method

.method public static sonYakalama()Ljava/lang/String;
    .locals 1

    .line 74
    sget-object v0, Lcom/dogac/bin1/EkranGozu;->son:Ljava/lang/String;

    if-nez v0, :cond_0

    const-string v0, ""

    :cond_0
    return-object v0
.end method

.method static tercih(Landroid/content/Context;)Landroid/content/SharedPreferences;
    .locals 2

    .line 42
    const-string v0, "ekranGozu"

    const/4 v1, 0x0

    invoke-virtual {p0, v0, v1}, Landroid/content/Context;->getSharedPreferences(Ljava/lang/String;I)Landroid/content/SharedPreferences;

    move-result-object p0

    return-object p0
.end method

.method static topla(Landroid/view/accessibility/AccessibilityNodeInfo;Ljava/util/LinkedHashSet;I)V
    .locals 4
    .annotation system Ldalvik/annotation/Signature;
        value = {
            "(",
            "Landroid/view/accessibility/AccessibilityNodeInfo;",
            "Ljava/util/LinkedHashSet<",
            "Ljava/lang/String;",
            ">;I)V"
        }
    .end annotation

    if-eqz p0, :cond_3

    const/16 v0, 0x2d

    if-gt p2, v0, :cond_3

    .line 225
    invoke-virtual {p1}, Ljava/util/LinkedHashSet;->size()I

    move-result v0

    const/16 v1, 0x190

    if-le v0, v1, :cond_0

    goto :goto_2

    .line 226
    :cond_0
    invoke-virtual {p0}, Landroid/view/accessibility/AccessibilityNodeInfo;->getText()Ljava/lang/CharSequence;

    move-result-object v0

    invoke-virtual {p0}, Landroid/view/accessibility/AccessibilityNodeInfo;->getContentDescription()Ljava/lang/CharSequence;

    move-result-object v1

    const/4 v2, 0x1

    if-eqz v0, :cond_1

    .line 227
    invoke-interface {v0}, Ljava/lang/CharSequence;->toString()Ljava/lang/String;

    move-result-object v3

    invoke-virtual {v3}, Ljava/lang/String;->trim()Ljava/lang/String;

    move-result-object v3

    invoke-virtual {v3}, Ljava/lang/String;->length()I

    move-result v3

    if-lez v3, :cond_1

    invoke-interface {v0}, Ljava/lang/CharSequence;->toString()Ljava/lang/String;

    move-result-object v0

    invoke-virtual {v0}, Ljava/lang/String;->trim()Ljava/lang/String;

    move-result-object v0

    invoke-virtual {p1, v0}, Ljava/util/LinkedHashSet;->add(Ljava/lang/Object;)Z

    goto :goto_0

    :cond_1
    if-eqz v1, :cond_2

    .line 228
    invoke-interface {v1}, Ljava/lang/CharSequence;->toString()Ljava/lang/String;

    move-result-object v0

    invoke-virtual {v0}, Ljava/lang/String;->trim()Ljava/lang/String;

    move-result-object v0

    invoke-virtual {v0}, Ljava/lang/String;->length()I

    move-result v0

    if-le v0, v2, :cond_2

    new-instance v0, Ljava/lang/StringBuilder;

    const-string v3, "["

    invoke-direct {v0, v3}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-interface {v1}, Ljava/lang/CharSequence;->toString()Ljava/lang/String;

    move-result-object v1

    invoke-virtual {v1}, Ljava/lang/String;->trim()Ljava/lang/String;

    move-result-object v1

    invoke-virtual {v0, v1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    const-string v1, "]"

    invoke-virtual {v0, v1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    invoke-virtual {v0}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v0

    invoke-virtual {p1, v0}, Ljava/util/LinkedHashSet;->add(Ljava/lang/Object;)Z

    :cond_2
    :goto_0
    const/4 v0, 0x0

    .line 229
    :goto_1
    invoke-virtual {p0}, Landroid/view/accessibility/AccessibilityNodeInfo;->getChildCount()I

    move-result v1

    if-ge v0, v1, :cond_3

    :try_start_0
    invoke-virtual {p0, v0}, Landroid/view/accessibility/AccessibilityNodeInfo;->getChild(I)Landroid/view/accessibility/AccessibilityNodeInfo;

    move-result-object v1

    add-int/lit8 v3, p2, 0x1

    invoke-static {v1, p1, v3}, Lcom/dogac/bin1/EkranGozu;->topla(Landroid/view/accessibility/AccessibilityNodeInfo;Ljava/util/LinkedHashSet;I)V
    :try_end_0
    .catchall {:try_start_0 .. :try_end_0} :catchall_0

    :catchall_0
    add-int/lit8 v0, v0, 0x1

    goto :goto_1

    :cond_3
    :goto_2
    return-void
.end method

.method static yakala()V
    .locals 4

    .line 158
    sget-object v0, Lcom/dogac/bin1/CarvisErisim;->ornek:Lcom/dogac/bin1/CarvisErisim;

    if-eqz v0, :cond_1

    .line 159
    sget-boolean v1, Lcom/dogac/bin1/EkranGozu;->yakalaniyor:Z

    if-eqz v1, :cond_0

    goto :goto_0

    :cond_0
    const/4 v1, 0x1

    .line 160
    sput-boolean v1, Lcom/dogac/bin1/EkranGozu;->yakalaniyor:Z

    .line 161
    sget-object v1, Lcom/dogac/bin1/EkranGozu;->nokta:Landroid/view/View;

    const/4 v2, 0x6

    invoke-virtual {v1, v2}, Landroid/view/View;->performHapticFeedback(I)Z

    .line 163
    invoke-static {v0}, Lcom/dogac/bin1/EkranGozu;->agac(Lcom/dogac/bin1/CarvisErisim;)[Ljava/lang/String;

    move-result-object v1

    .line 164
    sget-object v2, Lcom/dogac/bin1/EkranGozu;->nokta:Landroid/view/View;

    const/4 v3, 0x4

    invoke-virtual {v2, v3}, Landroid/view/View;->setVisibility(I)V

    .line 165
    sget-object v2, Lcom/dogac/bin1/EkranGozu;->ana:Landroid/os/Handler;

    new-instance v3, Lcom/dogac/bin1/EkranGozu$6;

    invoke-direct {v3, v0, v1}, Lcom/dogac/bin1/EkranGozu$6;-><init>(Lcom/dogac/bin1/CarvisErisim;[Ljava/lang/String;)V

    const-wide/16 v0, 0x8c

    invoke-virtual {v2, v3, v0, v1}, Landroid/os/Handler;->postDelayed(Ljava/lang/Runnable;J)Z

    :cond_1
    :goto_0
    return-void
.end method
