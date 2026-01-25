const { generateQuestion } = require('./src/utils/gameLogic');

console.log("Testing Addition Logic:");
for (let i = 0; i < 5; i++) {
    const q = generateQuestion('addition');
    console.log(`Q: ${q.question}, A: ${q.answer}, Options: ${q.options.join(', ')}`);
}

console.log("\nTesting Subtraction Logic:");
for (let i = 0; i < 5; i++) {
    const q = generateQuestion('subtraction');
    console.log(`Q: ${q.question}, A: ${q.answer}, Options: ${q.options.join(', ')}`);
}

console.log("\nTesting Multiplication Logic:");
for (let i = 0; i < 5; i++) {
    const q = generateQuestion('multiplication');
    console.log(`Q: ${q.question}, A: ${q.answer}, Options: ${q.options.join(', ')}`);
}

console.log("\nTesting Division Logic:");
for (let i = 0; i < 5; i++) {
    const q = generateQuestion('division');
    console.log(`Q: ${q.question}, A: ${q.answer}, Options: ${q.options.join(', ')}`);
}
