import AsyncStorage from '@react-native-async-storage/async-storage';
import Logger from './Logger';

const LEADERBOARD_KEY = '@math_fun_kids_leaderboard';

export const getLeaderboard = async () => {
    try {
        const data = await AsyncStorage.getItem(LEADERBOARD_KEY);
        return data ? JSON.parse(data) : [];
    } catch (e) {
        return [];
    }
};

export const addToLeaderboard = async (name, score, mode = 'time_race') => {
    try {
        const leaderboard = await getLeaderboard();

        leaderboard.push({
            id: Date.now().toString(),
            name,
            score,
            mode,
            date: new Date().toISOString(),
        });

        // Sort by score descending and keep top 10
        leaderboard.sort((a, b) => b.score - a.score);
        const top10 = leaderboard.slice(0, 10);

        await AsyncStorage.setItem(LEADERBOARD_KEY, JSON.stringify(top10));
        return top10;
    } catch (e) {
        Logger.error('Failed to add to leaderboard', e);
        return [];
    }
};

export const clearLeaderboard = async () => {
    try {
        await AsyncStorage.removeItem(LEADERBOARD_KEY);
    } catch (e) {
        Logger.error('Failed to clear leaderboard', e);
    }
};
