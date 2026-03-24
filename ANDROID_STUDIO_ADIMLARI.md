# ✅ Android Studio'da Yapılacaklar

## 📋 build.gradle'da versionCode=20 Görüyorsunuz

Harika! Şimdi Android Studio'da şunları yapın:

---

## 🔄 1. GRADLE SYNC (ÇOK ÖNEMLİ!)

build.gradle dosyasını değiştirdikten sonra **MUTLAKA** Gradle sync yapın:

### Yöntem 1: Otomatik
- Dosyayı kaydettiğinizde Android Studio otomatik olarak sync önerebilir
- Sağ üstte çıkan **"Sync Now"** butonuna tıklayın

### Yöntem 2: Manuel
1. Üst menüden **File** > **Sync Project with Gradle Files**
2. Veya klavye kısayolu: **Ctrl + Shift + O** (Windows/Linux) veya **Cmd + Shift + O** (Mac)

**Bekleyin:** Sync işlemi 1-3 dakika sürebilir.

---

## 🧹 2. CLEAN BUILD

Eski build dosyalarını temizlemek için:

1. Üst menüden **Build** > **Clean Project**
2. İşlem bitene kadar bekleyin (30 saniye - 1 dakika)

---

## 🔨 3. BUILD AL

### Yöntem 1: Android Studio GUI (Önerilen)

1. Üst menüden **Build** > **Generate Signed Bundle / APK**
2. **Android App Bundle** seçin (Play Console için)
3. **Next** butonuna tıklayın
4. Keystore bilgilerini girin:
   - **Key store path:** `C:\Users\mstrs\.gemini\math-fun-kids\android\app\math-fun-kids.keystore`
   - **Key store password:** `MathFun2024!`
   - **Key alias:** `math-fun-kids`
   - **Key password:** `MathFun2024!`
5. **Next** butonuna tıklayın
6. **release** build variant'ını seçin
7. **Finish** butonuna tıklayın
8. Build'in bitmesini bekleyin (5-10 dakika)

### Yöntem 2: Terminal (Alternatif)

Android Studio'nun alt kısmındaki **Terminal** sekmesinde:

```powershell
cd android
.\gradlew clean
.\gradlew bundleRelease
```

---

## 📦 4. .aab DOSYASINI BULUN

Build başarılı olduktan sonra dosya şu konumda olacak:

```
C:\Users\mstrs\.gemini\math-fun-kids\android\app\build\outputs\bundle\release\app-release.aab
```

Android Studio'da:
- Build bittiğinde sağ alt köşede bir bildirim çıkacak
- **"locate"** veya **"show in explorer"** linkine tıklayın

---

## ✅ 5. VERSION CODE KONTROLÜ

Build aldıktan sonra version code'un doğru olduğunu kontrol edin:

1. `.aab` dosyasına sağ tıklayın
2. **Analyze APK** seçin
3. `AndroidManifest.xml` dosyasını açın
4. Şu satırı bulun:
   ```xml
   android:versionCode="20"
   ```
5. **20** olduğunu kontrol edin ✅

---

## 🚨 ÖNEMLİ NOTLAR

### Signing Config Kontrolü

Eğer build alırken signing hatası alırsanız, `build.gradle` dosyasında `signingConfigs` bloğunun olduğundan emin olun:

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

Eğer bu blok yoksa, ekleyin!

---

## 📝 ÖZET - YAPILACAKLAR

1. ✅ **Gradle Sync** yap (File > Sync Project with Gradle Files)
2. ✅ **Clean Project** yap (Build > Clean Project)
3. ✅ **Build al** (Build > Generate Signed Bundle / APK)
4. ✅ **Version code kontrolü** yap (Analyze APK)

---

## 🎯 HAZIR!

Artık `.aab` dosyasını Play Console'a yükleyebilirsiniz!

**Version code 20** ile Play Console hatası almayacaksınız. ✅
