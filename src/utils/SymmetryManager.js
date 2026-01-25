import AsyncStorage from '@react-native-async-storage/async-storage';
import { SYMMETRY_LEVELS } from '../data/symmetryGameData';

const SYMMETRY_PROGRESS_KEY = '@math_fun_kids_symmetry_progress';

export const getSymmetryProgress = async () => {
    try {
        const stored = await AsyncStorage.getItem(SYMMETRY_PROGRESS_KEY);
        return stored ? JSON.parse(stored) : {};
    } catch (e) {
        console.error('Failed to get Symmetry progress', e);
        return {};
    }
};

export const saveSymmetryLevelProgress = async (levelId, score, total) => {
    try {
        const progress = await getSymmetryProgress();
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

        await AsyncStorage.setItem(SYMMETRY_PROGRESS_KEY, JSON.stringify(progress));

        return {
            success: true,
            percentage,
            passed: percentage >= 70,
        };
    } catch (e) {
        console.error('Failed to save Symmetry progress', e);
        return { success: false };
    }
};

export const getSymmetryLevelsWithStatus = async () => {
    const progress = await getSymmetryProgress();

    return SYMMETRY_LEVELS.map((level, index) => {
        const levelProgress = progress[level.id] || {
            completed: false,
            highScore: 0,
            attempts: 0,
        };

        let isLocked = false;
        if (index > 0) {
            const prevLevelProgress = progress[SYMMETRY_LEVELS[index - 1].id];
            isLocked = !prevLevelProgress?.completed;
        }

        return {
            ...level,
            locked: isLocked,
            progress: levelProgress,
        };
    });
};
