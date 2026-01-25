import { DIFFICULTY_CONFIG } from './DifficultyManager';

export const generateQuestion = (mode, difficultyLevel = 'easy') => {
    const config = DIFFICULTY_CONFIG[difficultyLevel] || DIFFICULTY_CONFIG.easy;
    const maxNum = config.maxNumber;

    switch (mode) {
        case 'division':
            return generateDivisionQuestion(maxNum);
        case 'subtraction':
            return generateSubtractionQuestion(maxNum);
        case 'multiplication':
            return generateMultiplicationQuestion(maxNum);
        case 'addition':
        default:
            return generateAdditionQuestion(maxNum);
    }
};

const generateAdditionQuestion = (maxNum) => {
    const num1 = Math.floor(Math.random() * maxNum) + 1;
    const num2 = Math.floor(Math.random() * maxNum) + 1;
    const answer = num1 + num2;

    return {
        question: `${num1} + ${num2} = ?`,
        answer,
        options: generateOptions(answer),
    };
};

const generateSubtractionQuestion = (maxNum) => {
    const num1 = Math.floor(Math.random() * maxNum) + Math.floor(maxNum / 2);
    const num2 = Math.floor(Math.random() * num1);
    const answer = num1 - num2;

    return {
        question: `${num1} - ${num2} = ?`,
        answer,
        options: generateOptions(answer),
    };
};

const generateMultiplicationQuestion = (maxNum) => {
    const limit = Math.min(maxNum, 12); // Cap multiplication at 12
    const num1 = Math.floor(Math.random() * limit) + 1;
    const num2 = Math.floor(Math.random() * limit) + 1;
    const answer = num1 * num2;

    return {
        question: `${num1} x ${num2} = ?`,
        answer,
        options: generateOptions(answer),
    };
};

const generateDivisionQuestion = (maxNum) => {
    const limit = Math.min(maxNum, 10);
    const answer = Math.floor(Math.random() * limit) + 1;
    const divisor = Math.floor(Math.random() * limit) + 1;
    const dividend = answer * divisor;

    return {
        question: `${dividend} ÷ ${divisor} = ?`,
        answer,
        options: generateOptions(answer),
    };
};

const generateOptions = (correctAnswer) => {
    const options = new Set([correctAnswer]);

    // Generate 4 options total (1 correct + 3 wrong)
    const offsets = [-3, -2, -1, 1, 2, 3, 4, 5];

    // Shuffle offsets for variety
    const shuffledOffsets = offsets.sort(() => Math.random() - 0.5);

    for (const offset of shuffledOffsets) {
        if (options.size >= 4) break;
        const wrongAnswer = correctAnswer + offset;
        if (wrongAnswer >= 0 && wrongAnswer !== correctAnswer) {
            options.add(wrongAnswer);
        }
    }

    // Fallback if not enough options
    while (options.size < 4) {
        const extra = correctAnswer + options.size + 2;
        if (extra >= 0) {
            options.add(extra);
        }
    }

    return Array.from(options).sort(() => Math.random() - 0.5);
};
