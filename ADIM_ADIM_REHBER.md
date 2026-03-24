# 🚀 ADIM ADIM BUILD REHBERİ - PowerShell

## 📋 ÖN HAZIRLIK

### 1. PowerShell'i Açın
- Windows tuşuna basın
- "PowerShell" yazın
- **Windows PowerShell** veya **PowerShell** açın

### 2. Proje Klasörüne Gidin

PowerShell'de şu komutu yazın ve Enter'a basın:

```powershell
cd C:\Users\mstrs\.gemini\math-fun-kids
```

**ÖNEMLİ:** Bu komutu yazdıktan sonra Enter'a basın!

---

## 🔧 SCRIPT ÇALIŞTIRMA

### 3. Script'i Çalıştırın

Aynı PowerShell penceresinde şu komutu yazın ve Enter'a basın:

```powershell
.\BUILD_ANDROID.ps1
```

**ÖNEMLİ:** 
- `.\` ile başlamalı (nokta ve ters slash)
- Komutu yazdıktan sonra Enter'a basın
- Script çalışırken bekleyin (2-3 dakika sürebilir)

---

## ⚠️ EĞER HATA ALIRSANIZ

### Hata: "execution of scripts is disabled"

Bu hatayı alırsanız, şu komutu yazın ve Enter'a basın:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

Sonra tekrar script'i çalıştırın:

```powershell
.\BUILD_ANDROID.ps1
```

---

## ✅ SCRIPT BAŞARILI OLURSA

Script şunları yapacak:
1. ✅ Prebuild yapacak (android klasörü oluşacak)
2. ✅ build.gradle'da versionCode'u **20** yapacak
3. ✅ versionName'i **2.0.3** yapacak
4. ✅ Keystore'u kopyalayacak

Script bittikten sonra şu mesajı göreceksiniz:
```
✅ Hazırlık tamamlandı!
```

---

## 📱 ANDROID STUDIO'DA BUILD ALMA

### 4. Android Studio'yu Açın

1. Android Studio'yu açın
2. **File** > **Open** menüsüne tıklayın
3. `C:\Users\mstrs\.gemini\math-fun-kids\android` klasörünü seçin
4. **OK** butonuna tıklayın
5. Gradle sync'in bitmesini bekleyin (2-5 dakika)

### 5. Build Alın

1. Üst menüden **Build** > **Generate Signed Bundle / APK** seçin
2. **Android App Bundle** seçin
3. **Next** butonuna tıklayın
4. Keystore bilgilerini girin:
   - **Key store path:** `C:\Users\mstrs\.gemini\math-fun-kids\android\app\math-fun-kids.keystore`
   - **Key store password:** `MathFun2024!`
   - **Key alias:** `math-fun-kids`
   - **Key password:** `MathFun2024!`
5. **Next** butonuna tıklayın
6. **release** seçin
7. **Finish** butonuna tıklayın
8. Build'in bitmesini bekleyin (5-10 dakika)

### 6. .aab Dosyasını Bulun

Build bittikten sonra dosya şu konumda olacak:
```
C:\Users\mstrs\.gemini\math-fun-kids\android\app\build\outputs\bundle\release\app-release.aab
```

---

## 🔍 VERSION CODE KONTROLÜ

Build aldıktan sonra version code'un doğru olduğunu kontrol edin:

1. Android Studio'da `.aab` dosyasını bulun
2. Sağ tıklayın > **Analyze APK**
3. `AndroidManifest.xml` dosyasını açın
4. `android:versionCode="20"` olduğunu kontrol edin

---

## 📝 ÖZET - TAM KOMUTLAR

PowerShell'de sırayla şunları yazın:

```powershell
# 1. Klasöre git
cd C:\Users\mstrs\.gemini\math-fun-kids

# 2. Script'i çalıştır
.\BUILD_ANDROID.ps1
```

**Hepsi bu kadar!** Script her şeyi otomatik yapacak.

---

## 🆘 SORUN GİDERME

### Script çalışmıyor?
- PowerShell'i **Yönetici olarak çalıştır** (sağ tık > Run as administrator)
- Veya `Set-ExecutionPolicy` komutunu çalıştırın

### build.gradle bulunamıyor?
- Script çalıştıktan sonra `android` klasörü oluşmalı
- Eğer yoksa, manuel olarak `npx expo prebuild --platform android --clean` çalıştırın

### Version code hala 2?
- `android\app\build.gradle` dosyasını açın
- `versionCode 2` satırını bulun
- `2` yerine `20` yazın
- Dosyayı kaydedin

---

## ✅ KONTROL LİSTESİ

- [ ] PowerShell açıldı
- [ ] `cd C:\Users\mstrs\.gemini\math-fun-kids` komutu çalıştırıldı
- [ ] `.\BUILD_ANDROID.ps1` komutu çalıştırıldı
- [ ] Script başarıyla tamamlandı
- [ ] Android Studio'da `android` klasörü açıldı
- [ ] Build alındı
- [ ] Version code kontrol edildi: **20**

---

**Başarılar! 🚀**
