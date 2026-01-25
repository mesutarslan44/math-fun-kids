import AsyncStorage from '@react-native-async-storage/async-storage';
import { CUBE_LEVELS } from '../data/cubeGameData';

const CUBE_PROGRESS_KEY = '@math_fun_kids_cube_progress';

/**
 * Get user's Cube Game progress
 */
export const getCubeProgress = async () => {
    try {
        const stored = await AsyncStorage.getItem(CUBE_PROGRESS_KEY);
        return stored ? JSON.parse(stored) : {};
    } catch (e) {
        console.error('Failed to get Cube progress', e);
        return {};
    }
};

/**
 * Save level completion
 */
export const saveCubeLevelProgress = async (levelId, score, total) => {
    try {
        const progress = await getCubeProgress();
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

        await AsyncStorage.setItem(CUBE_PROGRESS_KEY, JSON.stringify(progress));

        return {
            success: true,
            percentage,
            passed: percentage >= 70,
        };
    } catch (e) {
        console.error('Failed to save Cube progress', e);
        return { success: false };
    }
};

/**
 * Get all levels with their locked/unlocked status
 */
export const getCubeLevelsWithStatus = async () => {
    const progress = await getCubeProgress();

    return CUBE_LEVELS.map((level, index) => {
        const levelProgress = progress[level.id] || {
            completed: false,
            highScore: 0,
            attempts: 0,
        };

        let isLocked = false;
        if (index > 0) {
            const prevLevelProgress = progress[CUBE_LEVELS[index - 1].id];
            isLocked = !prevLevelProgress?.completed;
        }

        return {
            ...level,
            locked: isLocked,
            progress: levelProgress,
        };
    });
};
