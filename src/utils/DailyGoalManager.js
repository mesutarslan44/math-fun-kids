import AsyncStorage from '@react-native-async-storage/async-storage';
import Logger from './Logger';
import { getStats } from './StatsManager';

const DAILY_GOAL_KEY = '@math_fun_kids_daily_goal';
const DEFAULT_GOAL = 20; // 20 soru varsayılan hedef

export const getDailyGoal = async () => {
    try {
        const stored = await AsyncStorage.getItem(DAILY_GOAL_KEY);
        if (stored) {
            const goal = JSON.parse(stored);
            const today = new Date().toDateString();
            
            // Eğer bugünün hedefi varsa onu döndür
            if (goal.date === today) {
                return goal;
            }
        }
        
        // Yeni gün, varsayılan hedef oluştur
        return {
            target: DEFAULT_GOAL,
            current: 0,
            date: new Date().toDateString(),
            completed: false,
        };
    } catch (e) {
        Logger.error('Failed to get daily goal', e);
        return {
            target: DEFAULT_GOAL,
            current: 0,
            date: new Date().toDateString(),
            completed: false,
        };
    }
};

export const setDailyGoal = async (target) => {
    try {
        const goal = {
            target: target,
            current: 0,
            date: new Date().toDateString(),
            completed: false,
        };
        await AsyncStorage.setItem(DAILY_GOAL_KEY, JSON.stringify(goal));
        return goal;
    } catch (e) {
        Logger.error('Failed to set daily goal', e);
        return null;
    }
};

export const updateDailyGoalProgress = async (questionsAnswered = 1) => {
    try {
        const goal = await getDailyGoal();
        const today = new Date().toDateString();
        
        // Eğer bugünün hedefi değilse, yeni hedef oluştur
        if (goal.date !== today) {
            const newGoal = {
                target: goal.target, // Önceki hedefi koru
                current: questionsAnswered,
                date: today,
                completed: questionsAnswered >= goal.target,
            };
            await AsyncStorage.setItem(DAILY_GOAL_KEY, JSON.stringify(newGoal));
            return newGoal;
        }
        
        // Mevcut hedefi güncelle
        const wasCompleted = goal.completed;
        goal.current += questionsAnswered;
        goal.completed = goal.current >= goal.target;
        
        // Eğer hedef yeni tamamlandıysa, istatistikleri güncelle
        if (goal.completed && !wasCompleted) {
            try {
                const stats = await getStats();
                stats.dailyGoalsCompleted = (stats.dailyGoalsCompleted || 0) + 1;
                await AsyncStorage.setItem('@math_fun_kids_stats', JSON.stringify(stats));
            } catch (e) {
                Logger.error('Failed to update stats for daily goal', e);
            }
        }
        
        await AsyncStorage.setItem(DAILY_GOAL_KEY, JSON.stringify(goal));
        return goal;
    } catch (e) {
        Logger.error('Failed to update daily goal', e);
        return null;
    }
};

export const getDailyGoalProgress = async () => {
    const goal = await getDailyGoal();
    const progress = goal.current / goal.target;
    return {
        ...goal,
        progress: Math.min(progress, 1), // Max 100%
        percentage: Math.round((goal.current / goal.target) * 100),
    };
};

export const checkDailyGoalCompleted = async () => {
    const goal = await getDailyGoal();
    return goal.completed && !goal.celebrated;
};

export const markDailyGoalCelebrated = async () => {
    try {
        const goal = await getDailyGoal();
        goal.celebrated = true;
        await AsyncStorage.setItem(DAILY_GOAL_KEY, JSON.stringify(goal));
    } catch (e) {
        Logger.error('Failed to mark goal as celebrated', e);
    }
};
