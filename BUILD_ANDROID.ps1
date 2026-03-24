# Android Build Script - Otomatik Version Code Guncelleme
# Bu script tum adimlari otomatik yapar

Write-Host "Android Build Baslatiliyor..." -ForegroundColor Green

# 1. Prebuild yap
Write-Host "`nStep 1: Prebuild yapiliyor..." -ForegroundColor Yellow
npx expo prebuild --platform android --clean

if ($LASTEXITCODE -ne 0) {
    Write-Host "Prebuild basarisiz!" -ForegroundColor Red
    exit 1
}

# 2. build.gradle dosyasini kontrol et ve guncelle
$buildGradlePath = "android\app\build.gradle"

if (Test-Path $buildGradlePath) {
    Write-Host "`nStep 2: build.gradle guncelleniyor..." -ForegroundColor Yellow
    
    $content = Get-Content $buildGradlePath -Raw -Encoding UTF8
    
    # Version code'u 20 yap
    $content = $content -replace 'versionCode\s+\d+', 'versionCode 20'
    
    # Version name'i 2.0.3 yap
    $content = $content -replace 'versionName\s+"[^"]+"', 'versionName "2.0.3"'
    
    Set-Content -Path $buildGradlePath -Value $content -NoNewline -Encoding UTF8
    
    Write-Host "build.gradle guncellendi: versionCode=20, versionName=2.0.3" -ForegroundColor Green
    
    # Kontrol et
    $checkContent = Get-Content $buildGradlePath -Raw -Encoding UTF8
    if ($checkContent -match 'versionCode\s+20') {
        Write-Host "Version code kontrolu: 20 OK" -ForegroundColor Green
    } else {
        Write-Host "UYARI: Version code hala 20 degil! Manuel kontrol edin!" -ForegroundColor Red
    }
} else {
    Write-Host "build.gradle dosyasi bulunamadi: $buildGradlePath" -ForegroundColor Red
    exit 1
}

# 3. Keystore'u kopyala
Write-Host "`nStep 3: Keystore kopyalaniyor..." -ForegroundColor Yellow
$keystoreSource = "math-fun-kids.keystore"
$keystoreDest = "android\app\math-fun-kids.keystore"

if (Test-Path $keystoreSource) {
    Copy-Item $keystoreSource $keystoreDest -Force
    Write-Host "Keystore kopyalandi" -ForegroundColor Green
} else {
    Write-Host "UYARI: Keystore dosyasi bulunamadi: $keystoreSource" -ForegroundColor Yellow
}

# 4. Build al
Write-Host "`nStep 4: Build almak icin Android Studio'da:" -ForegroundColor Yellow
Write-Host "  1. Android Studio'yu acin" -ForegroundColor Cyan
Write-Host "  2. File > Open > android klasorunu secin" -ForegroundColor Cyan
Write-Host "  3. Build > Generate Signed Bundle / APK" -ForegroundColor Cyan
Write-Host "  4. Android App Bundle secin" -ForegroundColor Cyan
Write-Host "  5. Keystore bilgilerini girin" -ForegroundColor Cyan
Write-Host "  6. Release secin ve build'i baslatin" -ForegroundColor Cyan

Write-Host "`nVEYA terminal'den:" -ForegroundColor Cyan
Write-Host "  cd android" -ForegroundColor White
Write-Host "  .\gradlew clean" -ForegroundColor White
Write-Host "  .\gradlew bundleRelease" -ForegroundColor White

Write-Host "`nHazirlik tamamlandi!" -ForegroundColor Green
Write-Host "Kontrol: android\app\build.gradle dosyasinda versionCode=20 oldugunu kontrol edin" -ForegroundColor Yellow
