package com.dogac.bin1;

/* loaded from: classes3.dex */
public class AcilisAlici extends android.content.BroadcastReceiver {
    @Override // android.content.BroadcastReceiver
    public void onReceive(android.content.Context c, android.content.Intent i) {
        com.dogac.bin1.CarvisServis.baslatIstegi(c.getApplicationContext());
    }
}
