import AsyncStorage from '@react-native-async-storage/async-storage';
import { SHADOW_LEVELS } from '../data/shadowGameData';

const SHADOW_PROGRESS_KEY = '@math_fun_kids_shadow_progress';

export const getShadowProgress = async () => {
    try {
        const stored = await AsyncStorage.getItem(SHADOW_PROGRESS_KEY);
        return stored ? JSON.parse(stored) : {};
    } catch (e) {
        console.error('Failed to get Shadow progress', e);
        return {};
    }
};

export const saveShadowLevelProgress = async (levelId, score, total) => {
    try {
        const progress = await getShadowProgress();
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

        await AsyncStorage.setItem(SHADOW_PROGRESS_KEY, JSON.stringify(progress));

        return {
            success: true,
            percentage,
            passed: percentage >= 70,
        };
    } catch (e) {
        console.error('Failed to save Shadow progress', e);
        return { success: false };
    }
};

export const getShadowLevelsWithStatus = async () => {
    const progress = await getShadowProgress();

    return SHADOW_LEVELS.map((level, index) => {
        const levelProgress = progress[level.id] || {
            completed: false,
            highScore: 0,
            attempts: 0,
        };

        let isLocked = false;
        if (index > 0) {
            const prevLevelProgress = progress[SHADOW_LEVELS[index - 1].id];
            isLocked = !prevLevelProgress?.completed;
        }

        return {
            ...level,
            locked: isLocked,
            progress: levelProgress,
        };
    });
};
