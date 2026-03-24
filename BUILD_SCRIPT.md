# 🚀 Android Build Script - Hızlı Başlangıç

## Adım 1: Native Klasörlerini Oluştur

```bash
# Proje kök dizininde
npx expo prebuild --platform android --clean
```

Bu komut `android/` klasörünü oluşturur.

## Adım 2: Keystore'u Kopyala

```bash
# Windows PowerShell
Copy-Item math-fun-kids.keystore android/app/math-fun-kids.keystore

# Linux/Mac
cp math-fun-kids.keystore android/app/math-fun-kids.keystore
```

## Adım 3: Gradle Yapılandırması

`android/app/build.gradle` dosyasını açın ve `android` bloğuna şunu ekleyin:

```gradle
signingConfigs {
    release {
        if (project.hasProperty('MYAPP_RELEASE_STORE_FILE')) {
            storeFile file(MYAPP_RELEASE_STORE_FILE)
            storePassword MYAPP_RELEASE_STORE_PASSWORD
            keyAlias MYAPP_RELEASE_KEY_ALIAS
            keyPassword MYAPP_RELEASE_KEY_PASSWORD
        }
    }
}

buildTypes {
    release {
        signingConfig signingConfigs.release
        minifyEnabled true
        shrinkResources true
        proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
    }
}
```

## Adım 4: Gradle Properties

`android/gradle.properties` dosyasına ekleyin:

```properties
MYAPP_RELEASE_STORE_FILE=../math-fun-kids.keystore
MYAPP_RELEASE_KEY_ALIAS=math-fun-kids
MYAPP_RELEASE_STORE_PASSWORD=MathFun2024!
MYAPP_RELEASE_KEY_PASSWORD=MathFun2024!
```

**⚠️ ÖNEMLİ:** `gradle.properties` dosyasını `.gitignore`'a ekleyin!

## Adım 5: Android Studio'da Aç

1. Android Studio'yu açın
2. **File > Open** > `android` klasörünü seçin
3. Gradle sync'i bekleyin

## Adım 6: Build Al

### Terminal'den:
```bash
cd android
./gradlew bundleRelease
```

### Android Studio'dan:
1. **Build > Generate Signed Bundle / APK**
2. **Android App Bundle** seçin
3. Keystore bilgilerini girin
4. **release** variant'ını seçin
5. Build'i başlatın

## Çıktı

`.aab` dosyası şu konumda olacak:
- `android/app/build/outputs/bundle/release/app-release.aab`

---

## 🔐 Güvenlik Notu

Keystore şifrelerini asla git'e commit etmeyin! 
`gradle.properties` dosyasını `.gitignore`'a ekleyin.
