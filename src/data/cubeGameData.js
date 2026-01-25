/**
 * Küp Sayma Oyunu - Cube Counting Game
 * 10 Seviye, 3 boyutlu düşünme
 * Blok yapılarındaki küpleri say
 */

// 3D küp yapıları - her satır bir kat (alt → üst)
// Sayılar o konumdaki küp sayısını gösterir (0 = boş)
export const CUBE_LEVELS = [
    // ==================== SEVİYE 1 - Tek Sıra ====================
    {
        id: 1,
        title: 'Küçük Yapılar',
        description: 'Basit küp sayma',
        requiredScore: 0,
        questions: [
            {
                structure: [[1, 1, 1]], // 3 küp yan yana
                answer: 3,
                hint: 'Küpleri tek tek say',
            },
            {
                structure: [[1, 1, 1, 1]], // 4 küp
                answer: 4,
                hint: 'Yan yana 4 küp',
            },
            {
                structure: [[2]], // 2 küp üst üste
                answer: 2,
                hint: 'Üst üste dizili',
            },
            {
                structure: [[1, 2]], // 1 + 2 üst üste
                answer: 3,
                hint: 'Bir küp tek, bir küp çift',
            },
            {
                structure: [[1, 1], [1, 0]], // L şekli
                answer: 3,
                hint: 'L harfi gibi',
            },
        ],
    },
    // ==================== SEVİYE 2 ====================
    {
        id: 2,
        title: 'İki Katlı',
        description: 'Üst üste yapılar',
        requiredScore: 70,
        questions: [
            {
                structure: [[2, 2]], // 4 küp (2x2)
                answer: 4,
                hint: 'İki sütun, ikişer küp',
            },
            {
                structure: [[2, 1, 2]],
                answer: 5,
                hint: 'Ortadaki tek, yanlardaki çift',
            },
            {
                structure: [[1, 1, 1], [0, 1, 0]], // T şekli
                answer: 4,
                hint: 'T harfi şeklinde',
            },
            {
                structure: [[2, 2, 2]],
                answer: 6,
                hint: '3 sütun, ikişer küp',
            },
            {
                structure: [[1, 2, 1]],
                answer: 4,
                hint: 'Ortası yüksek',
            },
        ],
    },
    // ==================== SEVİYE 3 ====================
    {
        id: 3,
        title: 'Merdiven',
        description: 'Basamak yapıları',
        requiredScore: 70,
        questions: [
            {
                structure: [[1, 2, 3]], // Merdiven
                answer: 6,
                hint: '1 + 2 + 3 = ?',
            },
            {
                structure: [[3, 2, 1]], // Ters merdiven
                answer: 6,
                hint: 'Azalan basamaklar',
            },
            {
                structure: [[1, 2, 3, 2, 1]], // Piramit
                answer: 9,
                hint: 'Ortası en yüksek',
            },
            {
                structure: [[2, 2], [2, 2]], // Küp 2x2x2
                answer: 8,
                hint: '2x2x2 küp',
            },
            {
                structure: [[1, 3, 1]],
                answer: 5,
                hint: 'Ortadaki kule',
            },
        ],
    },
    // ==================== SEVİYE 4 ====================
    {
        id: 4,
        title: 'Kale Yapıları',
        description: 'Karmaşık şekiller',
        requiredScore: 70,
        questions: [
            {
                structure: [[3, 1, 3]], // Kale duvarı
                answer: 7,
                hint: 'İki kule arasında köprü',
            },
            {
                structure: [[2, 2, 2], [0, 2, 0]], // T kule
                answer: 8,
                hint: 'Üstte T şekli',
            },
            {
                structure: [[1, 1, 1], [1, 0, 1], [1, 1, 1]], // Çerçeve
                answer: 8,
                hint: 'Ortası boş çerçeve',
            },
            {
                structure: [[2, 1, 2], [1, 1, 1]], // L yapı
                answer: 8,
                hint: 'Alt kat + üst kat',
            },
            {
                structure: [[3, 3]],
                answer: 6,
                hint: 'İki yüksek kule',
            },
        ],
    },
    // ==================== SEVİYE 5 ====================
    {
        id: 5,
        title: '3D Zeka',
        description: 'Gizli küpleri bul',
        requiredScore: 70,
        questions: [
            {
                structure: [[2, 2], [2, 2]], // 2x2x2
                answer: 8,
                hint: 'Arkadakileri unutma',
            },
            {
                structure: [[3, 3, 3]],
                answer: 9,
                hint: '3 sütun, üçer küp',
            },
            {
                structure: [[1, 2, 3, 2, 1]],
                answer: 9,
                hint: 'Simetrik yapı',
            },
            {
                structure: [[2, 2, 2], [2, 2, 2]], // 3x2x2
                answer: 12,
                hint: '2 kat, 6 sütun',
            },
            {
                structure: [[4, 2, 4]],
                answer: 10,
                hint: 'Yüksek kuleler',
            },
        ],
    },
    // ==================== SEVİYE 6 ====================
    {
        id: 6,
        title: 'Piramitler',
        description: 'Üçgen yapılar',
        requiredScore: 70,
        questions: [
            {
                structure: [[1, 1, 1], [0, 2, 0]],
                answer: 5,
                hint: 'Alt kat 3, üst kat 2',
            },
            {
                structure: [[1, 2, 3, 4]],
                answer: 10,
                hint: 'Yükselen basamaklar',
            },
            {
                structure: [[3, 3, 3], [0, 3, 0]],
                answer: 12,
                hint: 'Ortada yüksek kule',
            },
            {
                structure: [[2, 2, 2], [1, 2, 1]],
                answer: 10,
                hint: 'İki katlı yapı',
            },
            {
                structure: [[4, 4]],
                answer: 8,
                hint: 'İki yüksek kule',
            },
        ],
    },
    // ==================== SEVİYE 7 ====================
    {
        id: 7,
        title: 'Gökdelen',
        description: 'Yüksek yapılar',
        requiredScore: 70,
        questions: [
            {
                structure: [[5]],
                answer: 5,
                hint: 'Tek kule',
            },
            {
                structure: [[3, 3], [3, 3]], // 2x2x3
                answer: 12,
                hint: '2x2 taban, 3 kat',
            },
            {
                structure: [[1, 2, 3, 4, 5]],
                answer: 15,
                hint: 'Merdiven yapısı',
            },
            {
                structure: [[4, 1, 4], [0, 4, 0]],
                answer: 13,
                hint: 'H şekli',
            },
            {
                structure: [[2, 3, 2], [2, 3, 2]],
                answer: 14,
                hint: 'Ortası yüksek bina',
            },
        ],
    },
    // ==================== SEVİYE 8 ====================
    {
        id: 8,
        title: 'Karmaşık Yapı',
        description: 'Uzman seviyesi',
        requiredScore: 70,
        questions: [
            {
                structure: [[3, 3, 3], [3, 3, 3]], // 3x2x3
                answer: 18,
                hint: '6 sütun, üçer küp',
            },
            {
                structure: [[1, 2, 3, 4, 3, 2, 1]],
                answer: 16,
                hint: 'Piramit şekli',
            },
            {
                structure: [[4, 4, 4], [0, 4, 0]],
                answer: 16,
                hint: 'T kulesi',
            },
            {
                structure: [[2, 2, 2], [2, 2, 2], [2, 2, 2]], // 3x3x2
                answer: 18,
                hint: '3x3 taban, 2 kat',
            },
            {
                structure: [[5, 5]],
                answer: 10,
                hint: 'İkiz kuleler',
            },
        ],
    },
    // ==================== SEVİYE 9 ====================
    {
        id: 9,
        title: 'Usta Mimar',
        description: 'Profesyonel yapılar',
        requiredScore: 70,
        questions: [
            {
                structure: [[3, 3, 3], [3, 3, 3], [3, 3, 3]], // 3x3x3
                answer: 27,
                hint: 'Tam küp 3x3x3',
            },
            {
                structure: [[5, 1, 5], [1, 5, 1]],
                answer: 18,
                hint: 'Dama deseni',
            },
            {
                structure: [[4, 4, 4, 4]],
                answer: 16,
                hint: '4 yüksek kule',
            },
            {
                structure: [[1, 3, 5, 3, 1]],
                answer: 13,
                hint: 'Sivri piramit',
            },
            {
                structure: [[2, 4, 2], [4, 2, 4]],
                answer: 18,
                hint: 'Zikzak yapı',
            },
        ],
    },
    // ==================== SEVİYE 10 - USTA ====================
    {
        id: 10,
        title: '3D Şampiyonu 🏆',
        description: 'En zorlu yapılar',
        requiredScore: 70,
        questions: [
            {
                structure: [[4, 4, 4], [4, 4, 4], [4, 4, 4]], // 3x3x4
                answer: 36,
                hint: '3x3 taban, 4 kat',
            },
            {
                structure: [[1, 2, 3, 4, 5, 4, 3, 2, 1]],
                answer: 25,
                hint: 'Büyük piramit',
            },
            {
                structure: [[5, 5, 5], [5, 0, 5], [5, 5, 5]],
                answer: 40,
                hint: 'Ortası boş kutu',
            },
            {
                structure: [[3, 3, 3, 3], [3, 3, 3, 3]], // 4x2x3
                answer: 24,
                hint: 'Dikdörtgen yapı',
            },
            {
                structure: [[6, 3, 6], [3, 6, 3]],
                answer: 27,
                hint: 'Satranç tahtası',
            },
        ],
    },
];

export const getCubeLevelById = (levelId) => {
    return CUBE_LEVELS.find(level => level.id === levelId);
};

// Yapıdaki toplam küp sayısını hesapla
export const calculateTotalCubes = (structure) => {
    let total = 0;
    for (const row of structure) {
        for (const cell of row) {
            total += cell;
        }
    }
    return total;
};

// Rastgele soru seç
export const getRandomCubeQuestion = (levelId) => {
    const level = getCubeLevelById(levelId);
    if (!level) return null;
    const randomIndex = Math.floor(Math.random() * level.questions.length);
    return { ...level.questions[randomIndex], levelId };
};
