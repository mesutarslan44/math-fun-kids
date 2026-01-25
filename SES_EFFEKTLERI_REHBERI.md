# 🎵 Ses Efektleri Ekleme Rehberi

## 📥 Adım 1: Ses Dosyalarını İndirin

### Ücretsiz Ses Efekti Siteleri:

1. **Mixkit.co** (Önerilen - Kayıt gerekmez)
   - https://mixkit.co/free-sound-effects/
   - Arama: "success", "failure", "click"
   - Format: MP3 veya WAV

2. **Pixabay** (Önerilen - Kayıt gerekmez)
   - https://pixabay.com/sound-effects/
   - Arama: "success sound", "error sound", "button click"
   - Format: MP3

3. **Freesound.org** (Kayıt gerekir)
   - https://freesound.org/
   - Creative Commons lisanslı sesler

4. **Zapsplat.com** (Kayıt gerekir)
   - https://www.zapsplat.com/
   - Ücretsiz kayıt

### İhtiyacımız Olan Sesler:

1. **success.mp3** - Başarı sesi
   - Önerilen: Kısa, neşeli "ding" veya "yay!" sesi
   - Süre: 0.3-0.8 saniye
   - Örnek arama: "success", "correct", "ding", "achievement"

2. **failure.mp3** - Hata sesi
   - Önerilen: Yumuşak, kibar "uh-oh" veya "try again" sesi
   - Süre: 0.3-0.8 saniye
   - Örnek arama: "error", "wrong", "failure", "buzz"

3. **click.mp3** - Buton tıklama sesi
   - Önerilen: Kısa "click" veya "pop" sesi
   - Süre: 0.1-0.3 saniye
   - Örnek arama: "click", "button", "pop", "tap"

## 📁 Adım 2: Dosyaları Yerleştirin

1. İndirdiğiniz ses dosyalarını şu klasöre kopyalayın:
   ```
   assets/
   ├── success.mp3
   ├── failure.mp3
   └── click.mp3
   ```

2. Dosya isimleri tam olarak şöyle olmalı:
   - `success.mp3` (küçük harf)
   - `failure.mp3` (küçük harf)
   - `click.mp3` (küçük harf)

## 🔧 Adım 3: SoundManager.js'i Güncelleyin

`src/utils/SoundManager.js` dosyasında şu satırları bulun:

```javascript
const SOUND_EFFECTS = {
    success: null, // require('../../assets/success.mp3'), // İndirdiğinizde açın
    failure: null, // require('../../assets/failure.mp3'), // İndirdiğinizde açın
    click: null,   // require('../../assets/click.mp3'),   // İndirdiğinizde açın
};
```

Ve şöyle değiştirin:

```javascript
const SOUND_EFFECTS = {
    success: require('../../assets/success.mp3'),
    failure: require('../../assets/failure.mp3'),
    click: require('../../assets/click.mp3'),
};
```

## ✅ Adım 4: Test Edin

1. Uygulamayı yeniden başlatın
2. Bir soruya doğru cevap verin → Başarı sesi çalmalı
3. Yanlış cevap verin → Hata sesi çalmalı
4. Bir butona tıklayın → Click sesi çalmalı

## 🎛️ Ses Ayarları

Kullanıcılar ses efektlerini kapatabilir:
- Ayarlar → Ses Efektleri (Switch)

## 💡 İpuçları

- **Ses kalitesi**: MP3 formatı önerilir (daha küçük dosya boyutu)
- **Ses süresi**: Kısa sesler daha iyi (0.1-1 saniye)
- **Ses seviyesi**: Kod içinde volume: 0.5 olarak ayarlı (değiştirilebilir)
- **Dosya boyutu**: Her ses dosyası 50-200 KB arası ideal

## 🚫 Ses Dosyası Yoksa Ne Olur?

Eğer ses dosyalarını eklemezseniz:
- Uygulama **hata vermez**
- Sadece **haptic feedback** (titreşim) çalışır
- Bu da yeterli bir geri bildirimdir

## 📝 Not

Ses dosyalarını ekledikten sonra:
1. `npm start` ile uygulamayı yeniden başlatın
2. Metro bundler cache'i temizlemek için: `npx expo start --clear`
