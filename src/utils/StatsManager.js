import AsyncStorage from '@react-native-async-storage/async-storage';
import Logger from './Logger';

const STATS_KEY = '@math_fun_kids_stats';

const defaultStats = {
    totalQuestionsAnswered: 0,
    correctAnswers: 0,
    wrongAnswers: 0,
    totalPlayTime: 0, // in seconds
    sessionsPlayed: 0,
    lastPlayedDate: null,
    streakDays: 0,
    bestStreak: 0,
    currentStreak: 0,
    dailyGoalsCompleted: 0,
    fastAnswers: 0,
    perfectLevels: 0,
    modeStats: {
        addition: { played: 0, correct: 0 },
        subtraction: { played: 0, correct: 0 },
        multiplication: { played: 0, correct: 0 },
        division: { played: 0, correct: 0 },
    }
};

export const getStats = async () => {
    try {
        const stored = await AsyncStorage.getItem(STATS_KEY);
        return stored ? { ...defaultStats, ...JSON.parse(stored) } : defaultStats;
    } catch (e) {
        return defaultStats;
    }
};

export const recordAnswer = async (mode, isCorrect) => {
    try {
        const stats = await getStats();
        stats.totalQuestionsAnswered += 1;

        if (isCorrect) {
            stats.correctAnswers += 1;
            stats.modeStats[mode].correct += 1;
        } else {
            stats.wrongAnswers += 1;
        }
        stats.modeStats[mode].played += 1;

        await AsyncStorage.setItem(STATS_KEY, JSON.stringify(stats));
    } catch (e) {
        Logger.error('Failed to record answer', e);
    }
};

export const recordSession = async () => {
    try {
        const stats = await getStats();
        const today = new Date().toDateString();

        stats.sessionsPlayed += 1;

        if (stats.lastPlayedDate === today) {
            // Already played today, no streak change
        } else {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);

            if (stats.lastPlayedDate === yesterday.toDateString()) {
                stats.streakDays += 1;
                if (stats.streakDays > stats.bestStreak) {
                    stats.bestStreak = stats.streakDays;
                }
            } else {
                stats.streakDays = 1; // Reset streak
            }
            stats.lastPlayedDate = today;
        }

        await AsyncStorage.setItem(STATS_KEY, JSON.stringify(stats));
    } catch (e) {
        Logger.error('Failed to record session', e);
    }
};

export const resetStats = async () => {
    await AsyncStorage.setItem(STATS_KEY, JSON.stringify(defaultStats));
};
