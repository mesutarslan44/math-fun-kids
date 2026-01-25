/**
 * Gölge Oyunu - Shadow/Silhouette Game
 * 10 Seviye, doğru silüeti bulma
 * Dikkat ve görsel algı geliştirme
 */

// Emoji şekilleri ve silüetleri
// Her nesnenin farklı varyasyonları var
const SHAPE_SETS = {
    animals: [
        { name: 'köpek', shapes: ['🐕', '🐩', '🐶', '🦮', '🐕‍🦺'] },
        { name: 'kedi', shapes: ['🐈', '🐱', '🐈‍⬛', '😺', '😸'] },
        { name: 'tavşan', shapes: ['🐇', '🐰', '🐰', '🐇', '🐰'] },
        { name: 'ayı', shapes: ['🐻', '🧸', '🐻‍❄️', '🐨', '🐼'] },
        { name: 'kuş', shapes: ['🐦', '🐤', '🐥', '🐣', '🦜'] },
    ],
    objects: [
        { name: 'ev', shapes: ['🏠', '🏡', '🏘️', '🏚️', '🛖'] },
        { name: 'araba', shapes: ['🚗', '🚕', '🚙', '🏎️', '🚓'] },
        { name: 'ağaç', shapes: ['🌲', '🌳', '🌴', '🎄', '🪴'] },
        { name: 'çiçek', shapes: ['🌸', '🌺', '🌻', '🌹', '🌷'] },
        { name: 'yıldız', shapes: ['⭐', '🌟', '✨', '💫', '⚡'] },
    ],
    vehicles: [
        { name: 'uçak', shapes: ['✈️', '🛩️', '🛫', '🛬', '🛸'] },
        { name: 'gemi', shapes: ['🚢', '⛵', '🛥️', '🚤', '⛴️'] },
        { name: 'tren', shapes: ['🚂', '🚃', '🚄', '🚅', '🚆'] },
        { name: 'bisiklet', shapes: ['🚲', '🛴', '🛵', '🏍️', '🚴'] },
        { name: 'roket', shapes: ['🚀', '🛸', '🛰️', '🚀', '🚀'] },
    ],
    food: [
        { name: 'elma', shapes: ['🍎', '🍏', '🍐', '🍊', '🍋'] },
        { name: 'muz', shapes: ['🍌', '🍈', '🍉', '🍇', '🍓'] },
        { name: 'pasta', shapes: ['🎂', '🍰', '🧁', '🍪', '🍩'] },
        { name: 'pizza', shapes: ['🍕', '🌭', '🍔', '🌮', '🌯'] },
        { name: 'dondurma', shapes: ['🍦', '🍧', '🍨', '🧊', '🍬'] },
    ],
};

// Grid tabanlı silüetler (daha karmaşık şekiller için)
// 1 = dolu (gölge), 0 = boş
const GRID_SILHOUETTES = [
    // Basit şekiller
    {
        name: 'L',
        pattern: [[1, 0], [1, 0], [1, 1]],
        rotations: [
            [[1, 1, 1], [1, 0, 0]], // 90°
            [[1, 1], [0, 1], [0, 1]], // 180°
            [[0, 0, 1], [1, 1, 1]], // 270°
        ]
    },
    {
        name: 'T',
        pattern: [[1, 1, 1], [0, 1, 0], [0, 1, 0]],
        rotations: [
            [[0, 1], [1, 1], [0, 1]], // 90°
            [[0, 1, 0], [0, 1, 0], [1, 1, 1]], // 180°
            [[1, 0], [1, 1], [1, 0]], // 270°
        ]
    },
    {
        name: 'Artı',
        pattern: [[0, 1, 0], [1, 1, 1], [0, 1, 0]],
        rotations: [
            [[0, 1, 0], [1, 1, 1], [0, 1, 0]], // Aynı
        ]
    },
    {
        name: 'Z',
        pattern: [[1, 1, 0], [0, 1, 0], [0, 1, 1]],
        rotations: [
            [[0, 0, 1], [1, 1, 1], [1, 0, 0]],
            [[1, 1, 0], [0, 1, 0], [0, 1, 1]],
            [[0, 0, 1], [1, 1, 1], [1, 0, 0]],
        ]
    },
    {
        name: 'Köşe',
        pattern: [[1, 1, 1], [1, 0, 0], [1, 0, 0]],
        rotations: [
            [[1, 1, 1], [0, 0, 1], [0, 0, 1]],
            [[0, 0, 1], [0, 0, 1], [1, 1, 1]],
            [[1, 0, 0], [1, 0, 0], [1, 1, 1]],
        ]
    },
];

// Seviye konfigürasyonu
export const SHADOW_LEVELS = [
    {
        id: 1,
        title: 'Basit Gölgeler',
        description: 'Hayvan silüetleri',
        category: 'animals',
        optionsCount: 3,
        questionsCount: 5,
        timeLimit: null,
    },
    {
        id: 2,
        title: 'Nesne Gölgeleri',
        description: 'Günlük nesneler',
        category: 'objects',
        optionsCount: 3,
        questionsCount: 5,
        timeLimit: null,
    },
    {
        id: 3,
        title: 'Taşıt Silüetleri',
        description: 'Araç gereçler',
        category: 'vehicles',
        optionsCount: 4,
        questionsCount: 5,
        timeLimit: null,
    },
    {
        id: 4,
        title: 'Yiyecek Gölgeleri',
        description: 'Lezzetli şekiller',
        category: 'food',
        optionsCount: 4,
        questionsCount: 5,
        timeLimit: null,
    },
    {
        id: 5,
        title: 'Karışık Gölgeler',
        description: 'Tüm kategoriler',
        category: 'mixed',
        optionsCount: 4,
        questionsCount: 5,
        timeLimit: null,
    },
    {
        id: 6,
        title: 'Hızlı Gölge',
        description: '10 saniye limit',
        category: 'mixed',
        optionsCount: 4,
        questionsCount: 5,
        timeLimit: 10000,
    },
    {
        id: 7,
        title: 'Şekil Gölgeleri',
        description: 'Geometrik şekiller',
        category: 'grid',
        optionsCount: 4,
        questionsCount: 5,
        timeLimit: null,
    },
    {
        id: 8,
        title: 'Dönen Gölgeler',
        description: 'Döndürülmüş şekiller',
        category: 'grid_rotated',
        optionsCount: 4,
        questionsCount: 5,
        timeLimit: null,
    },
    {
        id: 9,
        title: 'Süper Dikkat',
        description: '8 saniye limit',
        category: 'mixed',
        optionsCount: 5,
        questionsCount: 6,
        timeLimit: 8000,
    },
    {
        id: 10,
        title: 'Gölge Ustası 🏆',
        description: 'En zor seviye',
        category: 'all',
        optionsCount: 6,
        questionsCount: 6,
        timeLimit: 6000,
    },
];

export const getShadowLevelById = (levelId) => {
    return SHADOW_LEVELS.find(level => level.id === levelId);
};

// Rastgele emoji soru oluştur
const generateEmojiQuestion = (category, optionsCount) => {
    let categoryData;

    if (category === 'mixed' || category === 'all') {
        const categories = ['animals', 'objects', 'vehicles', 'food'];
        const randomCat = categories[Math.floor(Math.random() * categories.length)];
        categoryData = SHAPE_SETS[randomCat];
    } else {
        categoryData = SHAPE_SETS[category];
    }

    if (!categoryData) return null;

    // Rastgele bir nesne seç
    const targetIndex = Math.floor(Math.random() * categoryData.length);
    const target = categoryData[targetIndex];

    // Doğru cevap (ilk emoji - ana şekil)
    const correctEmoji = target.shapes[0];

    // Yanlış seçenekler oluştur
    const wrongEmojis = [];
    const usedIndices = [targetIndex];

    // Farklı nesnelerden seçenekler al
    while (wrongEmojis.length < optionsCount - 1 && usedIndices.length < categoryData.length) {
        let randomIndex;
        do {
            randomIndex = Math.floor(Math.random() * categoryData.length);
        } while (usedIndices.includes(randomIndex));

        usedIndices.push(randomIndex);
        wrongEmojis.push(categoryData[randomIndex].shapes[0]);
    }

    // Seçenekleri karıştır
    const allOptions = [correctEmoji, ...wrongEmojis];
    const shuffled = allOptions.sort(() => Math.random() - 0.5);

    return {
        type: 'emoji',
        target: correctEmoji,
        shadow: '⬛', // Gölge temsili
        options: shuffled,
        correctIndex: shuffled.indexOf(correctEmoji),
        hint: `"${target.name}" arıyorsun`,
    };
};

// Grid tabanlı soru oluştur
const generateGridQuestion = (rotated, optionsCount) => {
    const silhouette = GRID_SILHOUETTES[Math.floor(Math.random() * GRID_SILHOUETTES.length)];

    // Hedef pattern (gölge olarak gösterilecek)
    const targetPattern = silhouette.pattern;

    // Doğru cevap
    const correctAnswer = rotated && silhouette.rotations.length > 0
        ? silhouette.rotations[Math.floor(Math.random() * silhouette.rotations.length)]
        : targetPattern;

    // Yanlış seçenekler
    const wrongOptions = [];
    const usedPatterns = [JSON.stringify(correctAnswer)];

    // Diğer silüetlerden yanlış seçenekler al
    for (const other of GRID_SILHOUETTES) {
        if (wrongOptions.length >= optionsCount - 1) break;

        const patterns = [other.pattern, ...other.rotations];
        for (const p of patterns) {
            if (wrongOptions.length >= optionsCount - 1) break;
            if (!usedPatterns.includes(JSON.stringify(p))) {
                wrongOptions.push(p);
                usedPatterns.push(JSON.stringify(p));
            }
        }
    }

    // Seçenekleri karıştır
    const allOptions = [correctAnswer, ...wrongOptions.slice(0, optionsCount - 1)];
    const shuffled = allOptions.sort(() => Math.random() - 0.5);

    return {
        type: 'grid',
        target: targetPattern,
        shadow: targetPattern, // Şekil gölge olarak
        options: shuffled,
        correctIndex: shuffled.findIndex(opt => JSON.stringify(opt) === JSON.stringify(correctAnswer)),
        hint: `"${silhouette.name}" şeklini bul`,
    };
};

// Soru oluştur
export const generateShadowQuestion = (level) => {
    if (level.category === 'grid' || level.category === 'grid_rotated') {
        return generateGridQuestion(level.category === 'grid_rotated', level.optionsCount);
    } else {
        return generateEmojiQuestion(level.category, level.optionsCount);
    }
};
