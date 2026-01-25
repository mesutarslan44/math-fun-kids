import { Platform } from 'react-native';

const theme = {
    colors: {
        primary: '#667eea', // Premium Mor
        secondary: '#FF6B6B', // Soft Red
        accent: '#764ba2', // Magenta
        success: '#6BCB77', // Green
        background: '#F8F9FF', // Açık Mor-Beyaz
        text: '#1A1A2E', // Daha koyu, daha iyi kontrast
        textSecondary: '#4A5568', // Orta ton metin
        white: '#FFFFFF',
        purple: '#9D4EDD',
        orange: '#FF9F1C',
        gold: '#FFD700',
        secondaryLight: '#FFE5E5',
        textLight: '#718096', // Daha yumuşak, daha okunabilir
        textMuted: '#A0AEC0', // Çok hafif metin
        green: '#6BCB77',
        gradient: ['#667eea', '#764ba2'], // Premium Gradient
        // Dinamik renkler için yardımcı fonksiyonlar
        getTextColor: (bgColor) => {
            // Arka plan rengine göre uygun metin rengi döndür
            const isLight = bgColor && (
                bgColor.includes('white') || 
                bgColor.includes('#FFF') || 
                bgColor.includes('rgba(255')
            );
            return isLight ? '#1A1A2E' : '#FFFFFF';
        },
    },
    fonts: {
        // Using system fonts for reliability
        bold: Platform.select({
            ios: 'System',
            android: 'sans-serif-bold',
            default: 'System',
        }),
        semiBold: Platform.select({
            ios: 'System',
            android: 'sans-serif-medium',
            default: 'System',
        }),
        medium: Platform.select({
            ios: 'System',
            android: 'sans-serif-medium',
            default: 'System',
        }),
        regular: Platform.select({
            ios: 'System',
            android: 'sans-serif',
            default: 'System',
        }),
    },
    spacing: {
        s: 8,
        m: 16,
        l: 24,
        xl: 32,
    },
    borderRadius: {
        s: 8,
        m: 16,
        l: 24,
        xl: 50, // Fully rounded
    },
    text: {
        header: {
            fontSize: 32,
            fontWeight: 'bold',
            fontFamily: Platform.select({
                ios: 'System',
                android: 'sans-serif-bold',
                default: 'System',
            }),
            color: '#1A1A2E', // Daha koyu, daha iyi kontrast
            letterSpacing: -0.5, // Daha kompakt
        },
        subheader: {
            fontSize: 24,
            fontWeight: '600',
            fontFamily: Platform.select({
                ios: 'System',
                android: 'sans-serif-medium',
                default: 'System',
            }),
            color: '#1A1A2E',
            letterSpacing: -0.3,
        },
        body: {
            fontSize: 18,
            fontFamily: Platform.select({
                ios: 'System',
                android: 'sans-serif',
                default: 'System',
            }),
            color: '#1A1A2E',
            lineHeight: 26, // Daha okunabilir satır aralığı
        },
        caption: {
            fontSize: 14,
            fontFamily: Platform.select({
                ios: 'System',
                android: 'sans-serif',
                default: 'System',
            }),
            color: '#718096', // Daha yumuşak
            lineHeight: 20,
        },
        // Özel stiller
        onDark: {
            color: '#FFFFFF',
        },
        onLight: {
            color: '#1A1A2E',
        },
        accent: {
            color: '#667eea',
            fontFamily: Platform.select({
                ios: 'System',
                android: 'sans-serif-medium',
                default: 'System',
            }),
        },
        success: {
            color: '#6BCB77',
            fontFamily: Platform.select({
                ios: 'System',
                android: 'sans-serif-medium',
                default: 'System',
            }),
        },
        warning: {
            color: '#FF9F1C',
            fontFamily: Platform.select({
                ios: 'System',
                android: 'sans-serif-medium',
                default: 'System',
            }),
        },
    },
};

export default theme;
