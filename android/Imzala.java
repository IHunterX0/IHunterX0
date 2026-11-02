import com.android.apksig.ApkSigner;
import java.io.*; import java.security.*; import java.security.cert.X509Certificate; import java.util.*;
public class Imzala {
  public static void main(String[] a) throws Exception {
    KeyStore ks = KeyStore.getInstance("PKCS12");
    try (FileInputStream f = new FileInputStream(a[0])) { ks.load(f, a[1].toCharArray()); }
    PrivateKey k = (PrivateKey) ks.getKey("carvis", a[1].toCharArray());
    X509Certificate c = (X509Certificate) ks.getCertificate("carvis");
    ApkSigner.SignerConfig sc = new ApkSigner.SignerConfig.Builder("carvis", k, List.of(c)).build();
    new ApkSigner.Builder(List.of(sc)).setInputApk(new File(a[2])).setOutputApk(new File(a[3]))
      .setMinSdkVersion(26).setV1SigningEnabled(true).setV2SigningEnabled(true).setV3SigningEnabled(true).build().sign();
    System.out.println("imzalandı");
  }
}
