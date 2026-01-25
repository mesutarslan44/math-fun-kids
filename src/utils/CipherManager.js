import AsyncStorage from '@react-native-async-storage/async-storage';
import { CIPHER_LEVELS } from '../data/cipherGameData';

const CIPHER_PROGRESS_KEY = '@math_fun_kids_cipher_progress';

export const getCipherProgress = async () => {
    try {
        const stored = await AsyncStorage.getItem(CIPHER_PROGRESS_KEY);
        return stored ? JSON.parse(stored) : {};
    } catch (e) {
        console.error('Failed to get Cipher progress', e);
        return {};
    }
};

export const saveCipherLevelProgress = async (levelId, score, total) => {
    try {
        const progress = await getCipherProgress();
        const percentage = Math.round((score / total) * 100);

        if (!progress[levelId]) {
            progress[levelId] = {
                completed: false,
                highScore: 0,
                attempts: 0,
            };
        }

        progress[levelId].attempts += 1;

        if (percentage > progress[levelId].highScore) {
            progress[levelId].highScore = percentage;
        }

        if (percentage >= 70) {
            progress[levelId].completed = true;
        }

        await AsyncStorage.setItem(CIPHER_PROGRESS_KEY, JSON.stringify(progress));

        return {
            success: true,
            percentage,
            passed: percentage >= 70,
        };
    } catch (e) {
        console.error('Failed to save Cipher progress', e);
        return { success: false };
    }
};

export const getCipherLevelsWithStatus = async () => {
    const progress = await getCipherProgress();

    return CIPHER_LEVELS.map((level, index) => {
        const levelProgress = progress[level.id] || {
            completed: false,
            highScore: 0,
            attempts: 0,
        };

        let isLocked = false;
        if (index > 0) {
            const prevLevelProgress = progress[CIPHER_LEVELS[index - 1].id];
            isLocked = !prevLevelProgress?.completed;
        }

        return {
            ...level,
            locked: isLocked,
            progress: levelProgress,
        };
    });
};
