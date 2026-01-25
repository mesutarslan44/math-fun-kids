import AsyncStorage from '@react-native-async-storage/async-storage';
import { MEMORY_LEVELS } from '../data/memoryGameData';

const MEMORY_PROGRESS_KEY = '@math_fun_kids_memory_progress';

/**
 * Get user's Memory Game progress
 */
export const getMemoryProgress = async () => {
    try {
        const stored = await AsyncStorage.getItem(MEMORY_PROGRESS_KEY);
        return stored ? JSON.parse(stored) : {};
    } catch (e) {
        console.error('Failed to get Memory progress', e);
        return {};
    }
};

/**
 * Save level completion
 */
export const saveMemoryLevelProgress = async (levelId, moves, timeMs) => {
    try {
        const progress = await getMemoryProgress();

        if (!progress[levelId]) {
            progress[levelId] = {
                completed: false,
                bestMoves: null,
                bestTime: null,
                attempts: 0,
            };
        }

        progress[levelId].attempts += 1;
        progress[levelId].completed = true;

        // Update best scores
        if (!progress[levelId].bestMoves || moves < progress[levelId].bestMoves) {
            progress[levelId].bestMoves = moves;
        }
        if (!progress[levelId].bestTime || timeMs < progress[levelId].bestTime) {
            progress[levelId].bestTime = timeMs;
        }

        await AsyncStorage.setItem(MEMORY_PROGRESS_KEY, JSON.stringify(progress));

        return {
            success: true,
            isNewBest: moves <= progress[levelId].bestMoves,
        };
    } catch (e) {
        console.error('Failed to save Memory progress', e);
        return { success: false };
    }
};

/**
 * Get all levels with their locked/unlocked status
 */
export const getMemoryLevelsWithStatus = async () => {
    const progress = await getMemoryProgress();

    return MEMORY_LEVELS.map((level, index) => {
        const levelProgress = progress[level.id] || {
            completed: false,
            bestMoves: null,
            bestTime: null,
            attempts: 0,
        };

        // First level is always unlocked
        // Other levels unlock when previous level is completed
        let isLocked = false;
        if (index > 0) {
            const prevLevelProgress = progress[MEMORY_LEVELS[index - 1].id];
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
export const isMemoryLevelUnlocked = async (levelId) => {
    if (levelId === 1) return true;

    const progress = await getMemoryProgress();
    const prevLevelProgress = progress[levelId - 1];

    return prevLevelProgress?.completed === true;
};
