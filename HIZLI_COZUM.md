# ⚡ HIZLI ÇÖZÜM - Version Code Sorunu

## 🎯 Tek Komutla Çözüm

PowerShell'de şu komutu çalıştırın:

```powershell
.\BUILD_ANDROID.ps1
```

Bu script:
1. ✅ Prebuild yapar
2. ✅ build.gradle'da versionCode'u **20** yapar
3. ✅ versionName'i **2.0.3** yapar
4. ✅ Keystore'u kopyalar

---

## 🔧 Manuel Çözüm (Eğer script çalışmazsa)

### 1. Prebuild yap:
```powershell
npx expo prebuild --platform android --clean
```

### 2. build.gradle'ı aç ve düzelt:

`android\app\build.gradle` dosyasını açın ve şunu bulun:

```gradle
defaultConfig {
    versionCode 2    // ← BURAYI 20 YAP!
    versionName "2.0.2"  // ← BURAYI 2.0.3 YAP!
}
```

**DEĞİŞTİR:**
```gradle
defaultConfig {
    versionCode 20    // ← 20!
    versionName "2.0.3"  // ← 2.0.3!
}
```

### 3. Build al:

**Android Studio:**
- Build > Generate Signed Bundle / APK
- Android App Bundle seç
- Release seç
- Build al

**Terminal:**
```powershell
cd android
.\gradlew clean
.\gradlew bundleRelease
```

---

## ✅ Kontrol

Build aldıktan sonra `.aab` dosyasını kontrol edin:

1. Android Studio'da `.aab` dosyasını açın
2. Build > Analyze APK
3. AndroidManifest.xml'i açın
4. `android:versionCode="20"` olduğunu kontrol edin

---

## 🚨 ÖNEMLİ

**Android Studio build alırken `app.json` değil, `build.gradle` kullanılır!**

Bu yüzden `build.gradle` dosyasını **MUTLAKA** kontrol edin!
