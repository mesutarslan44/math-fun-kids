# ⚠️ VERSION CODE SORUNU - ÇÖZÜM

## 🔴 Sorun
Play Console hatası: **"2 sürüm kodu daha önce kullanıldı"**

## ✅ Çözüm

### 1. app.json'da Version Code Güncellendi
- **Yeni Version Code:** `10` (artık kesinlikle çalışacak)
- **Version Name:** `2.0.3` (yükseltildi)

### 2. Android Studio Build İçin ÖNEMLİ:

**Android Studio build alırken `app.json` değil, `android/app/build.gradle` dosyasındaki versionCode kullanılır!**

#### Adım 1: Prebuild Yap (Eğer yapmadıysan)
```bash
npx expo prebuild --platform android --clean
```

#### Adım 2: build.gradle Dosyasını Kontrol Et

`android/app/build.gradle` dosyasını açın ve şu satırı bulun:

```gradle
defaultConfig {
    applicationId "com.mathfunkids.app"
    minSdkVersion 24
    targetSdkVersion 34
    versionCode 2    // ← BURAYI DEĞİŞTİR!
    versionName "2.0.3"
}
```

**DEĞİŞTİR:**
```gradle
defaultConfig {
    applicationId "com.mathfunkids.app"
    minSdkVersion 24
    targetSdkVersion 34
    versionCode 10    // ← 10 YAP!
    versionName "2.0.3"
}
```

#### Adım 3: Gradle Sync Yap
Android Studio'da:
1. **File > Sync Project with Gradle Files**
2. Veya sağ üstteki **Sync Now** butonuna tıklayın

#### Adım 4: Temiz Build Al
```bash
cd android
./gradlew clean
./gradlew bundleRelease
```

VEYA Android Studio'da:
1. **Build > Clean Project**
2. **Build > Rebuild Project**
3. **Build > Generate Signed Bundle / APK**

---

## 🔍 Version Code'u Kontrol Et

Build aldıktan sonra, `.aab` dosyasının version code'unu kontrol edin:

```bash
# Windows PowerShell
cd android/app/build/outputs/bundle/release
bundletool.jar dump manifest app-release.aab | findstr "versionCode"
```

VEYA Android Studio'da:
1. `.aab` dosyasını açın
2. **Build > Analyze APK**
3. `AndroidManifest.xml` dosyasını açın
4. `android:versionCode="10"` olduğunu kontrol edin

---

## ✅ Kontrol Listesi

- [ ] `app.json`'da versionCode: **10** ✅
- [ ] `android/app/build.gradle`'da versionCode: **10** (MANUEL KONTROL ET!)
- [ ] Gradle sync yapıldı
- [ ] Clean build alındı
- [ ] `.aab` dosyasındaki versionCode kontrol edildi: **10**

---

## 🚨 ÖNEMLİ UYARI

**Android Studio build alırken:**
- ❌ `app.json`'daki versionCode kullanılmaz
- ✅ `android/app/build.gradle`'daki versionCode kullanılır

**Bu yüzden her build öncesi `build.gradle` dosyasını kontrol edin!**

---

## 📝 Gelecek İçin

Her yeni build için:
1. `app.json`'da versionCode'u artır
2. `npx expo prebuild` yap (build.gradle güncellenir)
3. VEYA manuel olarak `build.gradle`'da versionCode'u artır
4. Build al
