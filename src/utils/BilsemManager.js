import AsyncStorage from '@react-native-async-storage/async-storage';
import { BILSEM_LEVELS } from '../data/bilsemQuestions';

const BILSEM_PROGRESS_KEY = '@math_fun_kids_bilsem_progress';

/**
 * Get user's BİLSEM progress
 * Returns: { [levelId]: { completed: boolean, score: number, attempts: number } }
 */
export const getBilsemProgress = async () => {
    try {
        const stored = await AsyncStorage.getItem(BILSEM_PROGRESS_KEY);
        return stored ? JSON.parse(stored) : {};
    } catch (e) {
        console.error('Failed to get BİLSEM progress', e);
        return {};
    }
};

/**
 * Save level completion
 */
export const saveBilsemLevelProgress = async (levelId, score, totalQuestions = 10) => {
    try {
        const progress = await getBilsemProgress();
        const percentage = Math.round((score / totalQuestions) * 100);

        if (!progress[levelId]) {
            progress[levelId] = {
                completed: false,
                highScore: 0,
                attempts: 0,
            };
        }

        progress[levelId].attempts += 1;

        // Update high score if better
        if (percentage > progress[levelId].highScore) {
            progress[levelId].highScore = percentage;
        }

        // Mark as completed if 70% or above
        if (percentage >= 70) {
            progress[levelId].completed = true;
        }

        await AsyncStorage.setItem(BILSEM_PROGRESS_KEY, JSON.stringify(progress));

        return {
            success: true,
            percentage,
            passed: percentage >= 70,
            isNewHighScore: percentage > (progress[levelId]?.highScore || 0),
        };
    } catch (e) {
        console.error('Failed to save BİLSEM progress', e);
        return { success: false };
    }
};

/**
 * Get all levels with their locked/unlocked status
 */
export const getBilsemLevelsWithStatus = async () => {
    const progress = await getBilsemProgress();

    return BILSEM_LEVELS.map((level, index) => {
        const levelProgress = progress[level.id] || {
            completed: false,
            highScore: 0,
            attempts: 0,
        };

        // First level is always unlocked
        // Other levels unlock when previous level is completed
        let isLocked = false;
        if (index > 0) {
            const prevLevelProgress = progress[BILSEM_LEVELS[index - 1].id];
            isLocked = !prevLevelProgress?.completed;
        }

        return {
            ...level,
            locked: isLocked,
            progress: levelProgress,
        };
    });
};

/**
 * Check if a specific level is unlocked
 */
export const isLevelUnlocked = async (levelId) => {
    if (levelId === 1) return true;

    const progress = await getBilsemProgress();
    const prevLevelProgress = progress[levelId - 1];

    return prevLevelProgress?.completed === true;
};

/**
 * Reset all BİLSEM progress
 */
export const resetBilsemProgress = async () => {
    try {
        await AsyncStorage.removeItem(BILSEM_PROGRESS_KEY);
        return true;
    } catch (e) {
        console.error('Failed to reset BİLSEM progress', e);
        return false;
    }
};
