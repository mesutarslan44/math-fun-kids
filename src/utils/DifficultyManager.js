import AsyncStorage from '@react-native-async-storage/async-storage';
import Logger from './Logger';

const DIFFICULTY_KEY = '@math_fun_kids_difficulty';

// Difficulty levels with number ranges
export const DIFFICULTY_CONFIG = {
    easy: {
        label: 'Kolay',
        maxNumber: 10,
        color: '#6BCB77',
    },
    medium: {
        label: 'Orta',
        maxNumber: 20,
        color: '#FF9F1C',
    },
    hard: {
        label: 'Zor',
        maxNumber: 50,
        color: '#FF6B6B',
    },
    expert: {
        label: 'Uzman',
        maxNumber: 100,
        color: '#9B59B6',
    },
    master: {
        label: 'Usta',
        maxNumber: 200,
        color: '#E74C3C',
    },
};

export const getDifficulty = async () => {
    try {
        const stored = await AsyncStorage.getItem(DIFFICULTY_KEY);
        return stored || 'easy';
    } catch (e) {
        return 'easy';
    }
};

export const setDifficulty = async (level) => {
    try {
        await AsyncStorage.setItem(DIFFICULTY_KEY, level);
    } catch (e) {
        Logger.error('Failed to set difficulty', e);
    }
};
