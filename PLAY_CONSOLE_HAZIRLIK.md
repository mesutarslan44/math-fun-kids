# 🎯 Play Console Yükleme - Hızlı Başlangıç

## ✅ Yapılan Hazırlıklar

- ✅ Versiyon numaraları güncellendi
  - Version: **2.0.3** (yükseltildi)
  - Version Code: **10** ⚠️ (build.gradle'da da kontrol edin!)
- ✅ Keystore bilgileri hazır
- ✅ EAS.json yapılandırıldı
- ✅ Build rehberleri oluşturuldu

---

## 🚀 Android Studio ile Build (Önerilen)

### 1️⃣ Native Klasörlerini Oluştur

```bash
npx expo prebuild --platform android --clean
```

### 2️⃣ Keystore'u Kopyala

```bash
# Windows PowerShell
Copy-Item math-fun-kids.keystore android/app/math-fun-kids.keystore
```

### 3️⃣ Android Studio'da Aç

1. Android Studio'yu açın
2. **File > Open** > `android` klasörünü seçin
3. Gradle sync'i bekleyin (birkaç dakika sürebilir)

### 4️⃣ Gradle Yapılandırması

**⚠️ ÇOK ÖNEMLİ:** `android/app/build.gradle` dosyasını açın ve **versionCode'u kontrol edin:**

```gradle
defaultConfig {
    applicationId "com.mathfunkids.app"
    minSdkVersion 24
    targetSdkVersion 34
    versionCode 10    // ← BURAYI KONTROL ET! 10 OLMALI!
    versionName "2.0.3"
}
```

**Eğer versionCode 2 veya başka bir değerse, 10 yapın!**

Sonra `android` bloğuna signing config ekleyin:

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

### 5️⃣ Build Al

**Android Studio GUI:**
1. **Build** > **Generate Signed Bundle / APK**
2. **Android App Bundle** seçin
3. Keystore bilgilerini girin:
   - Path: `android/app/math-fun-kids.keystore`
   - Password: `MathFun2024!`
   - Alias: `math-fun-kids`
   - Key Password: `MathFun2024!`
4. **release** seçin
5. Build'i başlatın

**Terminal:**
```bash
cd android
./gradlew bundleRelease
```

### 6️⃣ Çıktı Dosyası

`.aab` dosyası:
```
android/app/build/outputs/bundle/release/app-release.aab
```

---

## 📤 Play Console'a Yükleme

1. [Google Play Console](https://play.google.com/console) giriş yapın
2. Uygulamanızı seçin
3. **Production** > **Create new release**
4. `.aab` dosyasını yükleyin
5. **Release notes** ekleyin (örnek aşağıda)
6. **Review** ve **Submit**

### Örnek Release Notes:

```
🎉 Yeni Özellikler:
- Tema sistemi düzeltildi ve iyileştirildi
- Ses efektleri entegre edildi
- İstatistikler düzeltildi
- Performans iyileştirmeleri
- Karakter tasarımları güncellendi

🐛 Düzeltmeler:
- Async fonksiyon hataları düzeltildi
- Ses çift çalma sorunu çözüldü
- Tema değişiklikleri artık anında uygulanıyor
```

---

## 🔐 Keystore Bilgileri (Referans)

- **Dosya:** `math-fun-kids.keystore`
- **Şifre:** `MathFun2024!`
- **Alias:** `math-fun-kids`
- **Key Şifre:** `MathFun2024!`

---

## ⚠️ Önemli Notlar

1. **Version Code** her zaman artmalı (Play Console gereksinimi)
2. Keystore şifrelerini asla git'e commit etmeyin
3. Release build'i mutlaka test edin
4. `.aab` formatı Play Console için önerilir (daha küçük dosya)

---

## 📚 Detaylı Rehberler

- **Android Studio Build:** `ANDROID_BUILD_REHBERI.md`
- **Build Script:** `BUILD_SCRIPT.md`
- **Gradle Properties Örneği:** `gradle.properties.example`

---

## 🆘 Sorun mu Yaşıyorsunuz?

### Keystore Bulunamıyor
- Dosyanın `android/app/` klasöründe olduğundan emin olun
- Yolu kontrol edin: `file('../math-fun-kids.keystore')`

### Gradle Sync Hatası
- Android Studio'yu kapatıp tekrar açın
- **File > Invalidate Caches / Restart**

### Build Hatası
- `android/gradle.properties` dosyasını kontrol edin
- Keystore şifrelerinin doğru olduğundan emin olun

---

## ✅ Kontrol Listesi

- [ ] Versiyon numaraları güncellendi (2.0.3 / 10)
- [ ] **build.gradle'da versionCode 10 olduğunu kontrol ettim** ⚠️
- [ ] `npx expo prebuild` çalıştırıldı
- [ ] Keystore `android/app/` klasörüne kopyalandı
- [ ] `build.gradle` signing config eklendi
- [ ] Android Studio'da proje açıldı
- [ ] Release build alındı
- [ ] `.aab` dosyası oluşturuldu
- [ ] Release build test edildi
- [ ] Play Console'a yüklendi

---

**Başarılar! 🚀**
