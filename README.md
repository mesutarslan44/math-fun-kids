# Bilsem ve Eğlenceli Matematik

Çocuklar için tasarlanmış, BİLSEM sınavlarına hazırlık ve matematik becerilerini geliştirmeye yönelik eğitici oyun uygulaması.

## 📱 Özellikler

### 🎮 Oyun Modları

- **BİLSEM Zeka Soruları**: 10 seviye, akıl oyunları, örüntü ve mantık soruları
- **Görsel Hafıza**: Kart eşleştirme, odaklanma ve bellek geliştirme
- **Küp Sayma**: 3 boyutlu düşünme, blok sayma
- **Yansıma/Simetri**: Ayna görüntüsü, uzamsal algı
- **Şifreleme**: Sembol çözme, soyut düşünme
- **Gölge**: Silüet bulma, dikkat geliştirme
- **Hızlı Oyun**: Toplama, çıkarma, çarpma, bölme işlemleri

### ✨ Diğer Özellikler

- 🎁 Günlük ödül sistemi
- 🏆 Başarım ve rozet sistemi
- 📊 Ebeveyn istatistikleri
- 🎨 8 farklı tema
- 🤖 10 farklı maskot karakteri
- 📈 Liderlik tablosu
- ⏱️ Zaman yarışı modu

## 🚀 Kurulum

### Gereksinimler

- Node.js 18+ 
- npm veya yarn
- Expo CLI
- Android Studio (Android için) veya Xcode (iOS için)

### Adımlar

1. **Projeyi klonlayın**
```bash
git clone <repository-url>
cd math-fun-kids
```

2. **Bağımlılıkları yükleyin**
```bash
npm install
```

3. **Uygulamayı başlatın**
```bash
# Development mode
npm start

# Android
npm run android

# iOS
npm run ios
```

## 📦 Build

### Android (AAB)

```bash
eas build --platform android --profile production
```

### iOS (IPA)

```bash
eas build --platform ios --profile production
```

## 🛠️ Teknolojiler

- **React Native** 0.81.5
- **Expo** ~54.0.27
- **React Navigation** 7.x
- **AsyncStorage** - Yerel veri saklama
- **Expo AV** - Ses ve müzik
- **Expo Haptics** - Dokunsal geri bildirim
- **Sentry** - Hata takibi (production)

## 📁 Proje Yapısı

```
math-fun-kids/
├── src/
│   ├── components/      # Yeniden kullanılabilir bileşenler
│   ├── constants/       # Sabitler ve tema
│   ├── data/           # Oyun verileri
│   ├── screens/        # Ekran bileşenleri
│   └── utils/          # Yardımcı fonksiyonlar
├── assets/             # Görseller ve ses dosyaları
├── App.js              # Ana uygulama bileşeni
├── app.json            # Expo yapılandırması
└── package.json        # Bağımlılıklar
```

## 🔧 Yapılandırma

### Environment Variables

Production build için Sentry DSN ayarlayın:

```bash
EXPO_PUBLIC_SENTRY_DSN=your_sentry_dsn_here
```

### Versiyon Güncelleme

Versiyon bilgisi `app.json` dosyasında tutulur. Tüm versiyon referansları otomatik olarak buradan çekilir.

## 🧪 Test

```bash
npm test
```

## 📝 Lisans

Bu proje özel bir projedir. Tüm hakları saklıdır.

## 👥 İletişim

- **E-posta**: mstrtsln44@gmail.com
- **Uygulama Adı**: Bilsem ve Eğlenceli Matematik

## 📄 Dokümantasyon

- [Gizlilik Politikası](PRIVACY_POLICY.md)
- [Kullanım Koşulları](TERMS_OF_SERVICE.md)

## 🐛 Hata Bildirimi

Hataları bildirmek için:
1. Uygulama içindeki hata mesajlarını kontrol edin
2. Sentry dashboard'u kontrol edin (production)
3. E-posta ile iletişime geçin: mstrtsln44@gmail.com

## 🔄 Versiyon Geçmişi

### v2.0.1 (Mevcut)
- Logger utility eklendi
- Production console.log temizliği
- Versiyon tutarlılığı düzeltildi
- Sentry entegrasyonu
- Privacy Policy ve ToS eklendi

### v2.0.0
- İlk production release
- Google Play Console kapalı test tamamlandı

## 🎯 Gelecek Özellikler

- [ ] Çoklu dil desteği (i18n)
- [ ] Bulut senkronizasyonu
- [ ] Sosyal paylaşım özellikleri
- [ ] Daha fazla oyun modu
- [ ] Ebeveyn kontrol paneli

## ⚠️ Önemli Notlar

- Uygulama tamamen offline çalışır
- Tüm veriler cihazda yerel olarak saklanır
- 13 yaş altı çocuklar için COPPA uyumludur
- Kişisel bilgi toplanmaz veya paylaşılmaz

---

**Not**: Bu uygulama eğitici amaçlıdır ve çocukların matematik becerilerini geliştirmelerine yardımcı olmak için tasarlanmıştır.
