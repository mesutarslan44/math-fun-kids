/**
 * Yansıma/Simetri Oyunu - Symmetry/Mirror Game
 * 10 Seviye, ayna görüntüsünü bulma
 * Uzamsal algı geliştirme
 */

// Emoji şekilleri - yansıma soruları için
const SHAPE_PAIRS = [
    ['◀️', '▶️'],  // Sol-Sağ ok
    ['⬅️', '➡️'],
    ['↖️', '↗️'],
    ['↙️', '↘️'],
    ['👈', '👉'],
    ['🤛', '🤜'],
    ['🦶', '🦶'],  // Aynı (simetrik)
    ['⭐', '⭐'],
    ['❤️', '❤️'],
    ['🔶', '🔶'],
];

// Grid tabanlı şekiller (0 = boş, 1 = dolu)
const GRID_PATTERNS = {
    // Basit 2x2 patterns
    simple: [
        [[1, 0], [0, 1]], // Çapraz
        [[1, 1], [0, 0]], // Üst
        [[0, 0], [1, 1]], // Alt
        [[1, 0], [1, 0]], // Sol
        [[0, 1], [0, 1]], // Sağ
    ],
    // 3x3 patterns
    medium: [
        [[1, 0, 0], [0, 1, 0], [0, 0, 1]], // Çapraz
        [[1, 1, 0], [1, 0, 0], [0, 0, 0]], // L
        [[1, 1, 1], [0, 0, 0], [0, 0, 0]], // Üst çizgi
        [[1, 0, 1], [0, 1, 0], [1, 0, 1]], // X
        [[0, 1, 0], [1, 1, 1], [0, 1, 0]], // +
    ],
    // 4x4 patterns
    hard: [
        [[1, 1, 0, 0], [1, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]], // L büyük
        [[1, 0, 0, 1], [0, 1, 1, 0], [0, 1, 1, 0], [1, 0, 0, 1]], // Çerçeve
        [[1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0], [1, 1, 1, 1]], // İki çizgi
        [[1, 0, 1, 0], [0, 1, 0, 1], [1, 0, 1, 0], [0, 1, 0, 1]], // Dama
    ],
};

// Yansıma fonksiyonları
const mirrorHorizontal = (pattern) => {
    return pattern.map(row => [...row].reverse());
};

const mirrorVertical = (pattern) => {
    return [...pattern].reverse();
};

// Seviye konfigürasyonu
export const SYMMETRY_LEVELS = [
    {
        id: 1,
        title: 'Ayna Başlangıç',
        description: 'Basit yansımalar',
        gridSize: 2,
        questionsCount: 5,
        mirrorType: 'horizontal',
        timeLimit: null,
    },
    {
        id: 2,
        title: 'Sağ-Sol Ayna',
        description: 'Yatay simetri',
        gridSize: 2,
        questionsCount: 5,
        mirrorType: 'horizontal',
        timeLimit: null,
    },
    {
        id: 3,
        title: 'Üst-Alt Ayna',
        description: 'Dikey simetri',
        gridSize: 2,
        questionsCount: 5,
        mirrorType: 'vertical',
        timeLimit: null,
    },
    {
        id: 4,
        title: 'Büyük Şekiller',
        description: '3x3 grid',
        gridSize: 3,
        questionsCount: 5,
        mirrorType: 'horizontal',
        timeLimit: null,
    },
    {
        id: 5,
        title: 'Karışık Ayna',
        description: 'Her iki yön',
        gridSize: 3,
        questionsCount: 5,
        mirrorType: 'mixed',
        timeLimit: null,
    },
    {
        id: 6,
        title: 'Hızlı Simetri',
        description: '15 saniye limit',
        gridSize: 3,
        questionsCount: 5,
        mirrorType: 'mixed',
        timeLimit: 15000,
    },
    {
        id: 7,
        title: 'Karmaşık Şekiller',
        description: '4x4 grid',
        gridSize: 4,
        questionsCount: 5,
        mirrorType: 'horizontal',
        timeLimit: null,
    },
    {
        id: 8,
        title: 'Uzman Ayna',
        description: '4x4 karışık',
        gridSize: 4,
        questionsCount: 5,
        mirrorType: 'mixed',
        timeLimit: null,
    },
    {
        id: 9,
        title: 'Zamana Karşı',
        description: '10 saniye limit',
        gridSize: 4,
        questionsCount: 5,
        mirrorType: 'mixed',
        timeLimit: 10000,
    },
    {
        id: 10,
        title: 'Simetri Ustası 🏆',
        description: 'En zor seviye',
        gridSize: 4,
        questionsCount: 6,
        mirrorType: 'mixed',
        timeLimit: 8000,
    },
];

export const getSymmetryLevelById = (levelId) => {
    return SYMMETRY_LEVELS.find(level => level.id === levelId);
};

// Rastgele pattern oluştur
export const generateRandomPattern = (size) => {
    const pattern = [];
    for (let i = 0; i < size; i++) {
        const row = [];
        for (let j = 0; j < size; j++) {
            // Daha ilginç şekiller için weighted random
            row.push(Math.random() > 0.5 ? 1 : 0);
        }
        pattern.push(row);
    }
    // En az 2 dolu hücre olsun
    let filledCount = pattern.flat().filter(x => x === 1).length;
    if (filledCount < 2) {
        pattern[0][0] = 1;
        pattern[size - 1][size - 1] = 1;
    }
    return pattern;
};

// Pattern'i string'e çevir (karşılaştırma için)
const patternToString = (pattern) => JSON.stringify(pattern);

// Benzersiz rastgele pattern oluştur
const generateUniquePattern = (size, existingPatterns) => {
    let attempts = 0;
    let newPattern;

    do {
        newPattern = generateRandomPattern(size);
        attempts++;
    } while (
        existingPatterns.some(p => patternToString(p) === patternToString(newPattern)) &&
        attempts < 20
    );

    // 20 denemeden sonra hala benzersiz değilse, pattern'i değiştir
    if (existingPatterns.some(p => patternToString(p) === patternToString(newPattern))) {
        // Pattern'in bir hücresini tersine çevir
        const i = Math.floor(Math.random() * size);
        const j = Math.floor(Math.random() * size);
        newPattern[i][j] = newPattern[i][j] === 1 ? 0 : 1;
    }

    return newPattern;
};

// 180 derece döndürme
const rotate180 = (pattern) => {
    return pattern.map(row => [...row].reverse()).reverse();
};

// Çapraz yansıma
const mirrorDiagonal = (pattern) => {
    const size = pattern.length;
    const result = [];
    for (let i = 0; i < size; i++) {
        const row = [];
        for (let j = 0; j < size; j++) {
            row.push(pattern[j][i]);
        }
        result.push(row);
    }
    return result;
};

// Bir soru oluştur
export const generateSymmetryQuestion = (level) => {
    const size = level.gridSize;

    // Orijinal pattern oluştur - simetrik olmayan bir tane seç
    let original;
    let correctAnswer;
    let attempts = 0;

    // Yansıma tipini belirle
    let mirrorType = level.mirrorType;
    if (mirrorType === 'mixed') {
        mirrorType = Math.random() > 0.5 ? 'horizontal' : 'vertical';
    }

    // Orijinal ve doğru cevabın farklı olduğundan emin ol
    do {
        original = generateRandomPattern(size);
        correctAnswer = mirrorType === 'horizontal'
            ? mirrorHorizontal(original)
            : mirrorVertical(original);
        attempts++;
    } while (
        patternToString(original) === patternToString(correctAnswer) &&
        attempts < 30
    );

    // Eğer hala aynıysa (simetrik şekil), bir hücreyi değiştir
    if (patternToString(original) === patternToString(correctAnswer)) {
        original[0][size - 1] = original[0][size - 1] === 1 ? 0 : 1;
        correctAnswer = mirrorType === 'horizontal'
            ? mirrorHorizontal(original)
            : mirrorVertical(original);
    }

    // Benzersiz yanlış seçenekler oluştur
    const wrongOptions = [];
    const existingPatterns = [correctAnswer];

    // Yanlış 1: Orijinalin kendisi (doğru cevaptan farklıysa)
    if (patternToString(original) !== patternToString(correctAnswer)) {
        wrongOptions.push(original);
        existingPatterns.push(original);
    }

    // Yanlış 2: Ters yansıma (doğru horizontal ise vertical, tersi)
    const wrongMirror = mirrorType === 'horizontal'
        ? mirrorVertical(original)
        : mirrorHorizontal(original);

    if (!existingPatterns.some(p => patternToString(p) === patternToString(wrongMirror))) {
        wrongOptions.push(wrongMirror);
        existingPatterns.push(wrongMirror);
    }

    // Yanlış 3: 180 derece döndürme
    const rotated = rotate180(original);
    if (!existingPatterns.some(p => patternToString(p) === patternToString(rotated))) {
        wrongOptions.push(rotated);
        existingPatterns.push(rotated);
    }

    // Yanlış 4: Çapraz yansıma
    const diagonal = mirrorDiagonal(original);
    if (!existingPatterns.some(p => patternToString(p) === patternToString(diagonal))) {
        wrongOptions.push(diagonal);
        existingPatterns.push(diagonal);
    }

    // Eğer hala 3 yanlış şık yoksa, benzersiz rastgele pattern'ler ekle
    while (wrongOptions.length < 3) {
        const uniquePattern = generateUniquePattern(size, existingPatterns);
        wrongOptions.push(uniquePattern);
        existingPatterns.push(uniquePattern);
    }

    // Sadece 3 yanlış şık al
    const finalWrongOptions = wrongOptions.slice(0, 3);

    // Tüm seçenekleri karıştır
    const allOptions = [correctAnswer, ...finalWrongOptions];
    const shuffledOptions = allOptions.sort(() => Math.random() - 0.5);
    const correctIndex = shuffledOptions.findIndex(opt =>
        patternToString(opt) === patternToString(correctAnswer)
    );

    return {
        original,
        mirrorType,
        options: shuffledOptions,
        correctIndex,
        mirrorLabel: mirrorType === 'horizontal' ? '↔️ Yatay Ayna' : '↕️ Dikey Ayna',
    };
};
