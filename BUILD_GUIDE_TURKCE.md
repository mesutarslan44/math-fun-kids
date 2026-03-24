# 🚀 Android Build - Türkçe Detaylı Rehber

## ⚠️ ÖNEMLİ: Version Code Sorunu

**Android Studio build alırken `app.json` değil, `android/app/build.gradle` dosyasındaki versionCode kullanılır!**

Bu yüzden her build öncesi `build.gradle` dosyasını kontrol edin!

---

## 📋 Mevcut Versiyon Bilgileri

- **Version Name:** 2.0.3
- **Version Code:** 10 (app.json'da)
- **Package:** com.mathfunkids.app

---

## 🔧 Adım Adım Build Alma

### 1. Native Klasörlerini Oluştur

```bash
# Proje kök dizininde
npx expo prebuild --platform android --clean
```

Bu komut `android/` klasörünü oluşturur ve `app.json`'daki ayarları `build.gradle`'a aktarır.

### 2. build.gradle'ı Kontrol Et (ÇOK ÖNEMLİ!)

`android/app/build.gradle` dosyasını açın ve şu satırı bulun:

```gradle
defaultConfig {
    applicationId "com.mathfunkids.app"
    minSdkVersion 24
    targetSdkVersion 34
    versionCode 2    // ← BURAYI KONTROL ET!
    versionName "2.0.3"
}
```

**Eğer versionCode 2 veya başka bir değerse, 10 yapın:**

```gradle
defaultConfig {
    applicationId "com.mathfunkids.app"
    minSdkVersion 24
    targetSdkVersion 34
    versionCode 10    // ← 10 OLMALI!
    versionName "2.0.3"
}
```

### 3. Keystore'u Kopyala

```bash
# Windows PowerShell
Copy-Item math-fun-kids.keystore android/app/math-fun-kids.keystore
```

### 4. Signing Config Ekle

`android/app/build.gradle` dosyasında `android` bloğuna ekleyin:

```gradle
signingConfigs {
    release {
        storeFile file('../math-fun-kids.keystore')
        storePassword 'MathFun2024!'
        keyAlias 'math-fun-kids'
        keyPassword 'MathFun2024!'
    }
}

buildTypes {
    release {
        signingConfig signingConfigs.release
        minifyEnabled true
        shrinkResources true
    }
}
```

### 5. Android Studio'da Aç

1. Android Studio'yu açın
2. **File > Open** > `android` klasörünü seçin
3. Gradle sync'i bekleyin (sağ üstteki **Sync Now** butonuna tıklayın)

### 6. Clean Build Yap

**Terminal'den:**
```bash
cd android
./gradlew clean
./gradlew bundleRelease
```

**Android Studio'dan:**
1. **Build > Clean Project**
2. **Build > Rebuild Project**
3. **Build > Generate Signed Bundle / APK**
   - **Android App Bundle** seçin
   - Keystore bilgilerini girin
   - **release** seçin

### 7. Çıktı Dosyası

`.aab` dosyası:
```
android/app/build/outputs/bundle/release/app-release.aab
```

---

## ✅ Version Code Kontrolü

Build aldıktan sonra version code'un doğru olduğunu kontrol edin:

### Yöntem 1: Android Studio
1. `.aab` dosyasını açın
2. **Build > Analyze APK**
3. `AndroidManifest.xml` dosyasını açın
4. `android:versionCode="10"` olduğunu kontrol edin

### Yöntem 2: Terminal
```bash
# bundletool gerekli (Google'dan indirin)
bundletool dump manifest --bundle=app-release.aab | findstr "versionCode"
```

---

## 🔍 Sorun Giderme

### Version Code Hala 2 Gösteriyor

1. `build.gradle` dosyasını açın
2. `versionCode` değerini 10 yapın
3. **File > Sync Project with Gradle Files**
4. **Build > Clean Project**
5. Tekrar build alın

### Keystore Bulunamıyor

- Keystore dosyasının `android/app/` klasöründe olduğundan emin olun
- Yolu kontrol edin: `file('../math-fun-kids.keystore')`

### Gradle Sync Hatası

- Android Studio'yu kapatıp tekrar açın
- **File > Invalidate Caches / Restart**

---

## 📝 Özet

1. ✅ `app.json`'da versionCode: **10**
2. ✅ `build.gradle`'da versionCode: **10** (MANUEL KONTROL!)
3. ✅ Gradle sync yapıldı
4. ✅ Clean build alındı
5. ✅ Version code kontrol edildi

**Her build öncesi `build.gradle` dosyasını kontrol edin!**
