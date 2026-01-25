import AsyncStorage from '@react-native-async-storage/async-storage';
import Logger from './Logger';

const THEME_KEY = '@math_fun_kids_theme';

// Tüm temalar artık ücretsiz!
export const THEMES = {
    default: {
        id: 'default',
        name: 'Gökyüzü',
        colors: ['#87CEEB', '#E0F6FF'],
        icon: '☀️',
    },
    forest: {
        id: 'forest',
        name: 'Orman',
        colors: ['#228B22', '#90EE90'],
        icon: '🌲',
    },
    ocean: {
        id: 'ocean',
        name: 'Okyanus',
        colors: ['#006994', '#00CED1'],
        icon: '🌊',
    },
    space: {
        id: 'space',
        name: 'Uzay',
        colors: ['#1a1a2e', '#4a4e69'],
        icon: '🚀',
    },
    candy: {
        id: 'candy',
        name: 'Şeker',
        colors: ['#FF69B4', '#FFB6C1'],
        icon: '🍭',
    },
    sunset: {
        id: 'sunset',
        name: 'Gün Batımı',
        colors: ['#FF6B6B', '#FFE66D'],
        icon: '🌅',
    },
    purple: {
        id: 'purple',
        name: 'Mor Rüya',
        colors: ['#9B59B6', '#E8DAEF'],
        icon: '💜',
    },
    mint: {
        id: 'mint',
        name: 'Nane',
        colors: ['#1ABC9C', '#A3E4D7'],
        icon: '🍃',
    },
};

export const getCurrentTheme = async () => {
    try {
        const themeId = await AsyncStorage.getItem(THEME_KEY);
        return THEMES[themeId] || THEMES.default;
    } catch (e) {
        return THEMES.default;
    }
};

export const setCurrentTheme = async (themeId) => {
    try {
        await AsyncStorage.setItem(THEME_KEY, themeId);
    } catch (e) {
        Logger.error('Failed to set theme', e);
    }
};

export const getAllThemesWithStatus = async () => {
    const current = await getCurrentTheme();

    return Object.values(THEMES).map(theme => ({
        ...theme,
        active: current.id === theme.id,
    }));
};
