# Android Studio Build Rehberi - Play Console Yükleme

## 📋 Versiyon Bilgileri
- **Version Name:** 2.0.3
- **Version Code:** 10 ⚠️ (build.gradle'da kontrol edin!)
- **Package Name:** com.mathfunkids.app

## 🔐 Keystore Bilgileri
- **Dosya:** `math-fun-kids.keystore` (proje kök dizininde)
- **Şifre:** `MathFun2024!`
- **Alias:** `math-fun-kids`
- **Key Şifre:** `MathFun2024!`

---

## 🚀 Android Studio ile Build Alma

### 1. Projeyi Android Studio'ya Açma

```bash
# Önce Expo prebuild yapın (native klasörlerini oluşturur)
npx expo prebuild --platform android
```

Ardından Android Studio'yu açın ve `android` klasörünü proje olarak açın.

### 2. Gradle Yapılandırması

`android/app/build.gradle` dosyasını açın ve şu ayarları kontrol edin:

```gradle
android {
    compileSdkVersion 34
    
    defaultConfig {
        applicationId "com.mathfunkids.app"
        minSdkVersion 24
        targetSdkVersion 34
        versionCode 10
        versionName "2.0.3"
    }
    
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
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
    }
}
```

### 3. Keystore Dosyasını Kopyalama

`math-fun-kids.keystore` dosyasını `android/app/` klasörüne kopyalayın.

### 4. Build Alma

#### Yöntem 1: Android Studio GUI
1. **Build** menüsünden **Generate Signed Bundle / APK** seçin
2. **Android App Bundle** seçin (Play Console için önerilen)
3. Keystore bilgilerini girin:
   - Keystore path: `android/app/math-fun-kids.keystore`
   - Keystore password: `MathFun2024!`
   - Key alias: `math-fun-kids`
   - Key password: `MathFun2024!`
4. **release** build variant'ını seçin
5. Build'i başlatın
6. Oluşan `.aab` dosyası: `android/app/release/app-release.aab`

#### Yöntem 2: Terminal/Command Line
```bash
cd android
./gradlew bundleRelease
```

Çıktı: `app/build/outputs/bundle/release/app-release.aab`

---

## 📦 EAS Build ile (Alternatif)

Eğer EAS Build kullanmak isterseniz:

```bash
# EAS CLI kurulumu (ilk kez)
npm install -g eas-cli

# Login
eas login

# Build
eas build --platform android --profile production
```

**Not:** EAS Build için keystore bilgileri otomatik olarak yönetilir.

---

## ✅ Play Console'a Yükleme Öncesi Kontrol Listesi

- [ ] Version code artırıldı (10) ⚠️ build.gradle'da kontrol edin!
- [ ] Version name güncellendi (2.0.2)
- [ ] Keystore dosyası doğru konumda
- [ ] Signing config doğru yapılandırıldı
- [ ] ProGuard rules kontrol edildi (eğer minifyEnabled true ise)
- [ ] Test edildi (release build)
- [ ] `.aab` dosyası oluşturuldu

---

## 📤 Play Console'a Yükleme

1. [Google Play Console](https://play.google.com/console) giriş yapın
2. Uygulamanızı seçin
3. **Production** veya **Internal testing** > **Create new release**
4. `.aab` dosyasını yükleyin
5. Release notes ekleyin
6. Review ve submit edin

---

## 🔍 Sorun Giderme

### Keystore Bulunamıyor
- Keystore dosyasının `android/app/` klasöründe olduğundan emin olun
- Yol göreceli olmalı: `file('../math-fun-kids.keystore')` veya `file('math-fun-kids.keystore')`

### Signing Hatası
- Şifrelerin doğru olduğundan emin olun
- Keystore dosyasının bozuk olmadığını kontrol edin:
  ```bash
  keytool -list -v -keystore math-fun-kids.keystore
  ```

### Version Code Hatası
- Play Console'da daha yüksek bir version code kullanılmış olabilir
- Mevcut version code'u kontrol edin ve daha yüksek bir değer kullanın

---

## 📝 Notlar

- **Version Code** her zaman artmalı (Play Console gereksinimi)
- **Version Name** kullanıcıya gösterilen versiyon numarasıdır
- `.aab` formatı Play Console için önerilir (daha küçük dosya boyutu)
- Release build'i test etmeyi unutmayın!
