import AsyncStorage from '@react-native-async-storage/async-storage';

const LEVELS_KEY = '@math_fun_kids_levels';

export const LEVEL_CONFIG = [
    {
        id: 1,
        title: 'Başlangıç',
        mode: 'addition',
        description: 'Toplama İşlemi (1-10)',
        targetStars: 3,
        unlocks: 2,
    },
    {
        id: 2,
        title: 'Çıkarma Ustası',
        mode: 'subtraction',
        description: 'Çıkarma İşlemi',
        targetStars: 3,
        unlocks: 3,
        requiredStars: 2, // Needs 2 stars from previous level
    },
    {
        id: 3,
        title: 'Çarpım Tablosu',
        mode: 'multiplication',
        description: 'Çarpma İşlemi (1-5)',
        targetStars: 3,
        unlocks: 4,
        requiredStars: 2,
    },
    {
        id: 4,
        title: 'Bölme Zamanı',
        mode: 'division',
        description: 'Bölme İşlemi',
        targetStars: 3,
        unlocks: null,
        requiredStars: 2,
    },
];

export const getLevels = async () => {
    try {
        const storedLevels = await AsyncStorage.getItem(LEVELS_KEY);
        const userProgress = storedLevels ? JSON.parse(storedLevels) : {};

        return LEVEL_CONFIG.map(level => ({
            ...level,
            stars: userProgress[level.id] || 0,
            locked: level.id === 1 ? false : (userProgress[level.id - 1] || 0) < (level.requiredStars || 1),
        }));
    } catch (e) {
        console.error('Failed to load levels', e);
        return LEVEL_CONFIG;
    }
};

export const saveLevelProgress = async (levelId, stars) => {
    try {
        const storedLevels = await AsyncStorage.getItem(LEVELS_KEY);
        const userProgress = storedLevels ? JSON.parse(storedLevels) : {};

        // Only update if new score is better
        if (!userProgress[levelId] || stars > userProgress[levelId]) {
            userProgress[levelId] = stars;
            await AsyncStorage.setItem(LEVELS_KEY, JSON.stringify(userProgress));
            return true;
        }
        return false;
    } catch (e) {
        console.error('Failed to save progress', e);
        return false;
    }
};
