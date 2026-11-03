package com.k2fsa.sherpa.onnx;
/** sherpa-onnx v1.13.8 Kotlin API'sinin (Tts.kt) JNI ile birebir uyumlu Java karşılığı; yalnız dosyadan yükleme ve GenerationConfig ile üretim. */
public class OfflineTts {
  static { System.loadLibrary("sherpa-onnx-jni"); }
  private long ptr;
  public OfflineTts(OfflineTtsConfig config) { ptr = newFromFile(config); if (ptr == 0L) throw new IllegalArgumentException("Geçersiz OfflineTtsConfig"); }
  public int sampleRate() { return getSampleRate(ptr); }
  public GeneratedAudio generateWithConfig(String text, GenerationConfig config) { return generateWithConfigImpl(ptr, text, config, null); }
  public void release() { if (ptr != 0L) { delete(ptr); ptr = 0L; } }
  private native long newFromFile(OfflineTtsConfig config);
  private native void delete(long ptr);
  private native int getSampleRate(long ptr);
  private native GeneratedAudio generateWithConfigImpl(long ptr, String text, GenerationConfig config, Object callback);
}
