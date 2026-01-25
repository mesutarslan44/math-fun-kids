import AsyncStorage from '@react-native-async-storage/async-storage';

const DAILY_REWARD_KEY = '@math_fun_kids_daily_reward';
const REWARD_AMOUNT = 50;

export const checkDailyReward = async () => {
    try {
        const lastDate = await AsyncStorage.getItem(DAILY_REWARD_KEY);
        const today = new Date().toDateString();

        if (lastDate !== today) {
            return { available: true, amount: REWARD_AMOUNT };
        }
        return { available: false, amount: 0 };
    } catch (e) {
        return { available: false, amount: 0 };
    }
};

export const claimDailyReward = async () => {
    try {
        const today = new Date().toDateString();
        await AsyncStorage.setItem(DAILY_REWARD_KEY, today);

        // Add to total score
        const savedScore = await AsyncStorage.getItem('totalScore');
        const newTotal = (savedScore ? parseInt(savedScore) : 0) + REWARD_AMOUNT;
        await AsyncStorage.setItem('totalScore', newTotal.toString());

        return newTotal;
    } catch (e) {
        return null;
    }
};
