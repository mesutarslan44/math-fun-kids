/**
 * Şifreleme Oyunu - Cipher/Decoding Game
 * 10 Seviye, sembolleri çözme
 * Soyut düşünme geliştirme
 */

// Sembol setleri
const CIPHER_SYMBOLS = {
    shapes: ['●', '■', '▲', '◆', '★', '♥', '♠', '♣', '♦', '⬟'],
    arrows: ['→', '←', '↑', '↓', '↗', '↘', '↙', '↖', '⟳', '⟲'],
    numbers: ['①', '②', '③', '④', '⑤', '⑥', '⑦', '⑧', '⑨', '⑩'],
    greek: ['α', 'β', 'γ', 'δ', 'ε', 'ζ', 'η', 'θ', 'ι', 'κ'],
    emoji: ['🔴', '🔵', '🟢', '🟡', '🟣', '🟠', '⚫', '⚪', '🔶', '🔷'],
};

// Seviye konfigürasyonu
export const CIPHER_LEVELS = [
    // ==================== SEVİYE 1 ====================
    {
        id: 1,
        title: 'Basit Şifre',
        description: '2 sembol değiştir',
        requiredScore: 0,
        questions: [
            {
                cipher: { '●': 1, '■': 2 },
                equation: '● + ● = ?',
                answer: 2,
                hint: '● = 1',
            },
            {
                cipher: { '●': 1, '■': 2 },
                equation: '■ + ● = ?',
                answer: 3,
                hint: '■ = 2, ● = 1',
            },
            {
                cipher: { '★': 3, '♥': 2 },
                equation: '★ + ♥ = ?',
                answer: 5,
                hint: '★ = 3',
            },
            {
                cipher: { '▲': 4, '◆': 1 },
                equation: '▲ - ◆ = ?',
                answer: 3,
                hint: '▲ = 4, ◆ = 1',
            },
            {
                cipher: { '●': 5, '■': 5 },
                equation: '● + ■ = ?',
                answer: 10,
                hint: 'İkisi de 5',
            },
        ],
    },
    // ==================== SEVİYE 2 ====================
    {
        id: 2,
        title: 'Üç Sembol',
        description: '3 sembol çöz',
        requiredScore: 70,
        questions: [
            {
                cipher: { '●': 1, '■': 2, '▲': 3 },
                equation: '● + ■ + ▲ = ?',
                answer: 6,
                hint: '1 + 2 + 3',
            },
            {
                cipher: { '★': 2, '♥': 3, '◆': 4 },
                equation: '★ × ♥ = ?',
                answer: 6,
                hint: '★ = 2',
            },
            {
                cipher: { '🔴': 5, '🔵': 3, '🟢': 2 },
                equation: '🔴 - 🔵 + 🟢 = ?',
                answer: 4,
                hint: '5 - 3 + 2',
            },
            {
                cipher: { 'α': 4, 'β': 2, 'γ': 6 },
                equation: 'γ ÷ β = ?',
                answer: 3,
                hint: 'γ = 6, β = 2',
            },
            {
                cipher: { '●': 3, '■': 3, '▲': 3 },
                equation: '● + ■ + ▲ = ?',
                answer: 9,
                hint: 'Hepsi eşit',
            },
        ],
    },
    // ==================== SEVİYE 3 ====================
    {
        id: 3,
        title: 'Denklem Çöz',
        description: 'Eksik sembolü bul',
        requiredScore: 70,
        questions: [
            {
                cipher: { '●': 2, '■': '?' },
                equation: '● + ■ = 5, ■ = ?',
                answer: 3,
                hint: '2 + ? = 5',
            },
            {
                cipher: { '★': 4, '♥': '?' },
                equation: '★ × ♥ = 12, ♥ = ?',
                answer: 3,
                hint: '4 × ? = 12',
            },
            {
                cipher: { '▲': '?', '◆': 2 },
                equation: '▲ - ◆ = 6, ▲ = ?',
                answer: 8,
                hint: '? - 2 = 6',
            },
            {
                cipher: { '🔴': 10, '🔵': '?' },
                equation: '🔴 ÷ 🔵 = 2, 🔵 = ?',
                answer: 5,
                hint: '10 ÷ ? = 2',
            },
            {
                cipher: { '●': '?', '■': 7 },
                equation: '● + ■ = 10, ● = ?',
                answer: 3,
                hint: '? + 7 = 10',
            },
        ],
    },
    // ==================== SEVİYE 4 ====================
    {
        id: 4,
        title: 'Çift İşlem',
        description: 'İki işlem çöz',
        requiredScore: 70,
        questions: [
            {
                cipher: { '●': 2, '■': 3, '▲': 4 },
                equation: '(● + ■) × ▲ = ?',
                answer: 20,
                hint: '(2 + 3) × 4',
            },
            {
                cipher: { '★': 6, '♥': 2, '◆': 3 },
                equation: '★ ÷ ♥ + ◆ = ?',
                answer: 6,
                hint: '6 ÷ 2 + 3',
            },
            {
                cipher: { '🔴': 5, '🔵': 3, '🟢': 2 },
                equation: '🔴 × 🟢 - 🔵 = ?',
                answer: 7,
                hint: '5 × 2 - 3',
            },
            {
                cipher: { 'α': 8, 'β': 4, 'γ': 2 },
                equation: 'α ÷ β × γ = ?',
                answer: 4,
                hint: '8 ÷ 4 × 2',
            },
            {
                cipher: { '●': 3, '■': 2, '▲': 5 },
                equation: '● × ■ + ▲ = ?',
                answer: 11,
                hint: '3 × 2 + 5',
            },
        ],
    },
    // ==================== SEVİYE 5 ====================
    {
        id: 5,
        title: 'Dört Sembol',
        description: '4 sembol dengesi',
        requiredScore: 70,
        questions: [
            {
                cipher: { '●': 1, '■': 2, '▲': 3, '◆': 4 },
                equation: '● + ■ + ▲ + ◆ = ?',
                answer: 10,
                hint: '1 + 2 + 3 + 4',
            },
            {
                cipher: { '★': 2, '♥': 2, '♠': 2, '♣': 2 },
                equation: '★ × ♥ × ♠ = ?',
                answer: 8,
                hint: 'Hepsi 2',
            },
            {
                cipher: { '🔴': 10, '🔵': 5, '🟢': 2, '🟡': 3 },
                equation: '🔴 - 🔵 + 🟢 × 🟡 = ?',
                answer: 11,
                hint: '10 - 5 + (2 × 3)',
            },
            {
                cipher: { 'α': 3, 'β': 4, 'γ': 2, 'δ': 6 },
                equation: 'α × β - γ - δ = ?',
                answer: 4,
                hint: '3 × 4 - 2 - 6',
            },
            {
                cipher: { '●': 5, '■': 4, '▲': 3, '◆': 2 },
                equation: '(● - ◆) × ▲ = ?',
                answer: 9,
                hint: '(5 - 2) × 3',
            },
        ],
    },
    // ==================== SEVİYE 6 ====================
    {
        id: 6,
        title: 'Örüntü Şifre',
        description: 'Sıradaki sayıyı bul',
        requiredScore: 70,
        questions: [
            {
                cipher: { '●': '?', '■': '?', '▲': '?' },
                equation: '●=2, ■=4, ▲=6, ◆=?',
                answer: 8,
                hint: '+2 örüntüsü',
            },
            {
                cipher: { '★': '?', '♥': '?', '◆': '?' },
                equation: '★=1, ♥=3, ◆=9, ♠=?',
                answer: 27,
                hint: '×3 örüntüsü',
            },
            {
                cipher: { '🔴': '?', '🔵': '?' },
                equation: '🔴=5, 🔵=10, 🟢=15, 🟡=?',
                answer: 20,
                hint: '+5 örüntüsü',
            },
            {
                cipher: { 'α': '?', 'β': '?' },
                equation: 'α=1, β=4, γ=9, δ=?',
                answer: 16,
                hint: 'Kare sayılar',
            },
            {
                cipher: { '●': '?', '■': '?' },
                equation: '●=100, ■=50, ▲=25, ◆=?',
                answer: 12,
                hint: '÷2 örüntüsü (25÷2=12.5, aşağı yuvarlanmış: 12)',
            },
        ],
    },
    // ==================== SEVİYE 7 ====================
    {
        id: 7,
        title: 'Karmaşık Şifre',
        description: 'Zor denklemler',
        requiredScore: 70,
        questions: [
            {
                cipher: { '●': 3, '■': 4, '▲': 5 },
                equation: '●² + ■ = ?',
                answer: 13,
                hint: '3² + 4 = 9 + 4',
            },
            {
                cipher: { '★': 6, '♥': 2 },
                equation: '★² ÷ ♥ = ?',
                answer: 18,
                hint: '36 ÷ 2',
            },
            {
                cipher: { '🔴': 4, '🔵': 3, '🟢': 2 },
                equation: '🔴 × 🔵 × 🟢 = ?',
                answer: 24,
                hint: '4 × 3 × 2',
            },
            {
                cipher: { 'α': 5, 'β': 3 },
                equation: 'α² - β² = ?',
                answer: 16,
                hint: '25 - 9',
            },
            {
                cipher: { '●': 7, '■': 3 },
                equation: '● + ■² = ?',
                answer: 16,
                hint: '7 + 9',
            },
        ],
    },
    // ==================== SEVİYE 8 ====================
    {
        id: 8,
        title: 'Çift Şifre',
        description: 'İki şifre birden',
        requiredScore: 70,
        questions: [
            {
                cipher: { '●': 2, '■': 3 },
                equation: '● + ● + ■ + ■ = ?',
                answer: 10,
                hint: '2 + 2 + 3 + 3',
            },
            {
                cipher: { '★': 4, '♥': 5 },
                equation: '★ × ★ - ♥ = ?',
                answer: 11,
                hint: '16 - 5',
            },
            {
                cipher: { '▲': 6, '◆': 2 },
                equation: '▲ × ◆ + ▲ = ?',
                answer: 18,
                hint: '12 + 6',
            },
            {
                cipher: { '🔴': 3, '🔵': 4 },
                equation: '(🔴 + 🔵)² = ?',
                answer: 49,
                hint: '7² = 49',
            },
            {
                cipher: { 'α': 5, 'β': 2 },
                equation: 'α × β × α = ?',
                answer: 50,
                hint: '5 × 2 × 5',
            },
        ],
    },
    // ==================== SEVİYE 9 ====================
    {
        id: 9,
        title: 'Uzman Şifreci',
        description: 'Profesyonel seviye',
        requiredScore: 70,
        questions: [
            {
                cipher: { '●': 2, '■': 3, '▲': 4, '◆': 5 },
                equation: '● × ■ × ▲ = ?',
                answer: 24,
                hint: '2 × 3 × 4',
            },
            {
                cipher: { '★': 10, '♥': 5, '♠': 2 },
                equation: '(★ - ♥) × ♠² = ?',
                answer: 20,
                hint: '5 × 4',
            },
            {
                cipher: { '🔴': 3, '🔵': 2, '🟢': 4 },
                equation: '🔴³ + 🔵 = ?',
                answer: 29,
                hint: '27 + 2',
            },
            {
                cipher: { 'α': 6, 'β': 2, 'γ': 3 },
                equation: 'α ÷ β + γ × γ = ?',
                answer: 12,
                hint: '3 + 9',
            },
            {
                cipher: { '●': 4, '■': 3 },
                equation: '●² + ■² = ?',
                answer: 25,
                hint: '16 + 9',
            },
        ],
    },
    // ==================== SEVİYE 10 - USTA ====================
    {
        id: 10,
        title: 'Şifre Ustası 🏆',
        description: 'En zor şifreler',
        requiredScore: 70,
        questions: [
            {
                cipher: { '●': 2, '■': 3, '▲': 4, '◆': 5, '★': 6 },
                equation: '(● + ■) × (▲ + ◆) = ?',
                answer: 45,
                hint: '5 × 9',
            },
            {
                cipher: { '🔴': 5, '🔵': 3 },
                equation: '🔴³ - 🔵³ = ?',
                answer: 98,
                hint: '125 - 27',
            },
            {
                cipher: { 'α': 4, 'β': 2, 'γ': 3, 'δ': 1 },
                equation: 'α × β × γ + δ = ?',
                answer: 25,
                hint: '24 + 1',
            },
            {
                cipher: { '●': 6, '■': 4, '▲': 2 },
                equation: '(● - ▲)² + ■² = ?',
                answer: 32,
                hint: '16 + 16',
            },
            {
                cipher: { '★': 7, '♥': 3 },
                equation: '★² - ★ × ♥ = ?',
                answer: 28,
                hint: '49 - 21',
            },
            {
                cipher: { '●': 8, '■': 2 },
                equation: '(● ÷ ■)³ = ?',
                answer: 64,
                hint: '4³ = 64',
            },
        ],
    },
];

export const getCipherLevelById = (levelId) => {
    return CIPHER_LEVELS.find(level => level.id === levelId);
};

// Rastgele soru seç
export const getRandomCipherQuestion = (levelId) => {
    const level = getCipherLevelById(levelId);
    if (!level) return null;
    const randomIndex = Math.floor(Math.random() * level.questions.length);
    return { ...level.questions[randomIndex], levelId };
};
