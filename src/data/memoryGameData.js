/**
 * Görsel Hafıza Oyunu - Visual Memory Game
 * 10 Seviye, resim hatırlama ve odaklanma
 * Her seviyede daha fazla kart ve daha kısa süre
 */

// Emoji seti - hafıza kartları için
export const MEMORY_EMOJIS = [
    '🍎', '🍊', '🍋', '🍇', '🍓', '🍒', '🥝', '🍑',
    '🌸', '🌺', '🌻', '🌹', '🌷', '💐', '🌼', '🪻',
    '🐶', '🐱', '🐰', '🐻', '🦊', '🐼', '🦁', '🐸',
    '🚗', '🚕', '🚌', '🚎', '🏎️', '🚓', '🚑', '🚒',
    '⭐', '🌙', '☀️', '🌈', '❄️', '⚡', '🔥', '💧',
    '🎈', '🎁', '🎀', '🎄', '🎃', '🎂', '🧸', '🎮',
];

// Seviye konfigürasyonu
export const MEMORY_LEVELS = [
    {
        id: 1,
        title: 'İlk Adım',
        description: '4 kart eşleştir',
        pairs: 2, // 4 kart (2 çift)
        viewTime: 3000, // 3 saniye göster
        requiredScore: 0,
    },
    {
        id: 2,
        title: 'Kolay Başlangıç',
        description: '6 kart eşleştir',
        pairs: 3,
        viewTime: 4000,
        requiredScore: 70,
    },
    {
        id: 3,
        title: 'Hafıza Ustası',
        description: '8 kart eşleştir',
        pairs: 4,
        viewTime: 4000,
        requiredScore: 70,
    },
    {
        id: 4,
        title: 'Dikkatli Göz',
        description: '10 kart eşleştir',
        pairs: 5,
        viewTime: 5000,
        requiredScore: 70,
    },
    {
        id: 5,
        title: 'Odaklanma',
        description: '12 kart eşleştir',
        pairs: 6,
        viewTime: 5000,
        requiredScore: 70,
    },
    {
        id: 6,
        title: 'Beyin Jimnastiği',
        description: '14 kart eşleştir',
        pairs: 7,
        viewTime: 6000,
        requiredScore: 70,
    },
    {
        id: 7,
        title: 'Süper Hafıza',
        description: '16 kart eşleştir',
        pairs: 8,
        viewTime: 6000,
        requiredScore: 70,
    },
    {
        id: 8,
        title: 'Deha',
        description: '18 kart eşleştir',
        pairs: 9,
        viewTime: 7000,
        requiredScore: 70,
    },
    {
        id: 9,
        title: 'Efsane',
        description: '20 kart eşleştir',
        pairs: 10,
        viewTime: 7000,
        requiredScore: 70,
    },
    {
        id: 10,
        title: 'Hafıza Şampiyonu 🏆',
        description: '24 kart eşleştir',
        pairs: 12,
        viewTime: 8000,
        requiredScore: 70,
    },
];

export const getMemoryLevelById = (levelId) => {
    return MEMORY_LEVELS.find(level => level.id === levelId);
};

// Rastgele kart çiftleri oluştur
export const generateCards = (pairCount) => {
    // Rastgele emoji seç
    const shuffledEmojis = [...MEMORY_EMOJIS].sort(() => Math.random() - 0.5);
    const selectedEmojis = shuffledEmojis.slice(0, pairCount);

    // Her emoji için 2 kart oluştur
    const cards = [];
    selectedEmojis.forEach((emoji, index) => {
        cards.push({ id: index * 2, emoji, pairId: index });
        cards.push({ id: index * 2 + 1, emoji, pairId: index });
    });

    // Kartları karıştır
    return cards.sort(() => Math.random() - 0.5);
};
