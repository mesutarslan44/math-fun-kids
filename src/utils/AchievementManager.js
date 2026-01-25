import AsyncStorage from '@react-native-async-storage/async-storage';

const ACHIEVEMENTS_KEY = '@math_fun_kids_achievements';

export const ACHIEVEMENT_LIST = [
    // ==================== GENEL BAŞARIMLAR ====================
    {
        id: 'first_correct',
        title: 'İlk Adım! 🎯',
        description: 'İlk doğru cevabını ver',
        icon: '🎯',
        category: 'general',
        condition: (s) => s.correctAnswers >= 1
    },
    {
        id: 'score_50',
        title: '50 Doğru!',
        description: '50 doğru cevaba ulaş',
        icon: '⭐',
        category: 'general',
        condition: (s) => s.correctAnswers >= 50
    },
    {
        id: 'score_100',
        title: 'Yüzlük Kulüp 💯',
        description: '100 doğru cevaba ulaş',
        icon: '💯',
        category: 'general',
        condition: (s) => s.correctAnswers >= 100
    },
    {
        id: 'score_500',
        title: 'Süper Öğrenci',
        description: '500 doğru cevaba ulaş',
        icon: '🏆',
        category: 'general',
        condition: (s) => s.correctAnswers >= 500
    },
    {
        id: 'sessions_10',
        title: 'Düzenli Oyuncu',
        description: '10 oturum tamamla',
        icon: '🎮',
        category: 'general',
        condition: (s) => s.sessionsPlayed >= 10
    },
    {
        id: 'sessions_50',
        title: 'Sadık Öğrenci',
        description: '50 oturum tamamla',
        icon: '📚',
        category: 'general',
        condition: (s) => s.sessionsPlayed >= 50
    },

    // ==================== MATEMATİK BAŞARIMLARI ====================
    {
        id: 'math_addition',
        title: 'Toplama Ustası',
        description: 'Toplamada 20 soru çöz',
        icon: '➕',
        category: 'math',
        condition: (s) => s.modeStats?.addition?.played >= 20
    },
    {
        id: 'math_subtraction',
        title: 'Çıkarma Ustası',
        description: 'Çıkarmada 20 soru çöz',
        icon: '➖',
        category: 'math',
        condition: (s) => s.modeStats?.subtraction?.played >= 20
    },
    {
        id: 'math_multiplication',
        title: 'Çarpım Ustası',
        description: 'Çarpmada 20 soru çöz',
        icon: '✖️',
        category: 'math',
        condition: (s) => s.modeStats?.multiplication?.played >= 20
    },
    {
        id: 'math_division',
        title: 'Bölme Ustası',
        description: 'Bölmede 20 soru çöz',
        icon: '➗',
        category: 'math',
        condition: (s) => s.modeStats?.division?.played >= 20
    },
    {
        id: 'math_all',
        title: 'Matematik Kralı 👑',
        description: 'Tüm işlemlerde 20+ soru',
        icon: '👑',
        category: 'math',
        condition: (s) =>
            s.modeStats?.addition?.played >= 20 &&
            s.modeStats?.subtraction?.played >= 20 &&
            s.modeStats?.multiplication?.played >= 20 &&
            s.modeStats?.division?.played >= 20
    },

    // ==================== KATEGORİ BAŞARIMLARI ====================
    {
        id: 'bilsem_level1',
        title: 'BİLSEM Başlangıç',
        description: 'BİLSEM 1. seviyeyi tamamla',
        icon: '🧠',
        category: 'bilsem',
        condition: (s) => s.bilsemLevels?.includes(1)
    },
    {
        id: 'bilsem_level5',
        title: 'BİLSEM Orta',
        description: 'BİLSEM 5. seviyeyi tamamla',
        icon: '🎓',
        category: 'bilsem',
        condition: (s) => s.bilsemLevels?.includes(5)
    },
    {
        id: 'bilsem_master',
        title: 'BİLSEM Ustası 🧙',
        description: 'BİLSEM 10. seviyeyi tamamla',
        icon: '🧙',
        category: 'bilsem',
        condition: (s) => s.bilsemLevels?.includes(10)
    },
    {
        id: 'memory_level5',
        title: 'Hafıza Şampiyonu',
        description: 'Görsel Hafıza 5. seviye',
        icon: '👁️',
        category: 'memory',
        condition: (s) => s.memoryLevels?.includes(5)
    },
    {
        id: 'memory_master',
        title: 'Hafıza Ustası',
        description: 'Görsel Hafıza 10. seviye',
        icon: '🧿',
        category: 'memory',
        condition: (s) => s.memoryLevels?.includes(10)
    },
    {
        id: 'cube_level5',
        title: 'Küp Sayıcı',
        description: 'Küp Sayma 5. seviye',
        icon: '📦',
        category: 'cube',
        condition: (s) => s.cubeLevels?.includes(5)
    },
    {
        id: 'cube_master',
        title: '3D Uzman',
        description: 'Küp Sayma 10. seviye',
        icon: '🧊',
        category: 'cube',
        condition: (s) => s.cubeLevels?.includes(10)
    },
    {
        id: 'symmetry_level5',
        title: 'Simetri Avcısı',
        description: 'Yansıma 5. seviye',
        icon: '🪞',
        category: 'symmetry',
        condition: (s) => s.symmetryLevels?.includes(5)
    },
    {
        id: 'symmetry_master',
        title: 'Ayna Ustası',
        description: 'Yansıma 10. seviye',
        icon: '🔄',
        category: 'symmetry',
        condition: (s) => s.symmetryLevels?.includes(10)
    },
    {
        id: 'cipher_level5',
        title: 'Şifre Çözücü',
        description: 'Şifreleme 5. seviye',
        icon: '🔐',
        category: 'cipher',
        condition: (s) => s.cipherLevels?.includes(5)
    },
    {
        id: 'cipher_master',
        title: 'Şifre Kırıcı',
        description: 'Şifreleme 10. seviye',
        icon: '🗝️',
        category: 'cipher',
        condition: (s) => s.cipherLevels?.includes(10)
    },
    {
        id: 'shadow_level5',
        title: 'Gölge Avcısı',
        description: 'Gölge 5. seviye',
        icon: '👤',
        category: 'shadow',
        condition: (s) => s.shadowLevels?.includes(5)
    },
    {
        id: 'shadow_master',
        title: 'Karanlık Usta',
        description: 'Gölge 10. seviye',
        icon: '🌑',
        category: 'shadow',
        condition: (s) => s.shadowLevels?.includes(10)
    },

    // ==================== ÖZEL BAŞARIMLAR ====================
    {
        id: 'all_categories',
        title: 'Tüm Kategoriler! 🌟',
        description: 'Her kategoride 5. seviye',
        icon: '🌟',
        category: 'special',
        condition: (s) =>
            s.bilsemLevels?.includes(5) &&
            s.memoryLevels?.includes(5) &&
            s.cubeLevels?.includes(5) &&
            s.symmetryLevels?.includes(5) &&
            s.cipherLevels?.includes(5) &&
            s.shadowLevels?.includes(5)
    },
    {
        id: 'ultimate_master',
        title: 'Efsane! 🏅',
        description: 'Tüm kategorilerde 10. seviye',
        icon: '🏅',
        category: 'special',
        condition: (s) =>
            s.bilsemLevels?.includes(10) &&
            s.memoryLevels?.includes(10) &&
            s.cubeLevels?.includes(10) &&
            s.symmetryLevels?.includes(10) &&
            s.cipherLevels?.includes(10) &&
            s.shadowLevels?.includes(10)
    },
];

export const getUnlockedAchievements = async () => {
    try {
        const stored = await AsyncStorage.getItem(ACHIEVEMENTS_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch (e) {
        return [];
    }
};

export const checkAndUnlockAchievements = async (stats) => {
    try {
        const unlocked = await getUnlockedAchievements();
        const newlyUnlocked = [];

        for (const achievement of ACHIEVEMENT_LIST) {
            if (!unlocked.includes(achievement.id) && achievement.condition(stats)) {
                unlocked.push(achievement.id);
                newlyUnlocked.push(achievement);
            }
        }

        if (newlyUnlocked.length > 0) {
            await AsyncStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(unlocked));
        }

        return newlyUnlocked;
    } catch (e) {
        return [];
    }
};

export const getAllAchievementsWithStatus = async () => {
    const unlocked = await getUnlockedAchievements();
    return ACHIEVEMENT_LIST.map(a => ({
        ...a,
        unlocked: unlocked.includes(a.id),
    }));
};

// Kategori bazlı başarım sayısı
export const getAchievementStats = async () => {
    const unlocked = await getUnlockedAchievements();
    const total = ACHIEVEMENT_LIST.length;
    const unlockedCount = unlocked.length;

    const byCategory = {};
    for (const a of ACHIEVEMENT_LIST) {
        if (!byCategory[a.category]) {
            byCategory[a.category] = { total: 0, unlocked: 0 };
        }
        byCategory[a.category].total++;
        if (unlocked.includes(a.id)) {
            byCategory[a.category].unlocked++;
        }
    }

    return { total, unlockedCount, byCategory };
};
