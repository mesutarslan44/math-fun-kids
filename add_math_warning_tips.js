// Otomatik uyarı ipuçları ekleyici
// Kullanım:
//   node add_math_warning_tips.js "C:\\Users\\mstrs\\.gemini\\formula-handbook\\src\\data\\matematik.js"

const fs = require('fs');
const path = require('path');

function main() {
    const targetPath = process.argv[2];
    if (!targetPath) {
        console.error('Lütfen matematik veri dosyasının yolunu argüman olarak verin.');
        process.exit(1);
    }

    const absPath = path.resolve(targetPath);

    let content;
    try {
        content = fs.readFileSync(absPath, 'utf8');
    } catch (e) {
        console.error('Dosya okunamadı:', e.message);
        process.exit(1);
    }

    const lines = content.split('\n');

    let currentName = '';
    let currentId = '';
    let currentCategory = '';

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        // Kart bağlamını güncelle
        const idMatch = line.match(/\bid:\s*'([^']+)'/);
        if (idMatch) {
            currentId = idMatch[1];
        }

        const nameMatch = line.match(/\bname:\s*'([^']+)'/);
        if (nameMatch) {
            currentName = nameMatch[1];
        }

        const categoryMatch = line.match(/\bcategory:\s*'([^']+)'/);
        if (categoryMatch) {
            currentCategory = categoryMatch[1];
        }

        if (!line.includes('tips:')) continue;

        const openIdx = line.indexOf('[');
        const closeIdx = line.indexOf(']', openIdx);
        if (openIdx === -1 || closeIdx === -1) continue;

        const inside = line.slice(openIdx + 1, closeIdx);

        // Eğer zaten otomatik uyarı eklenmişse, tekrar ekleme
        if (inside.includes('işlem sırasını karıştırır; her adımda işaret ve katsayıları özellikle kontrol et.')) {
            continue;
        }

        // Konu adını ipucuna yedir
        let topicLabel = currentName || currentCategory || currentId || 'bu konu';
        topicLabel = topicLabel.replace(/'/g, '’');

        const newTipText =
            `Çoğu öğrenci "${topicLabel}" sorularında formülü bilse bile adımları hızlı geçip işlem sırasını karıştırır; her adımda işaret ve katsayıları özellikle kontrol et.`;

        // Yeni ipucunu ekle
        if (inside.trim() === '') {
            // Boş dizi: tips: []
            const replacement =
                line.slice(0, openIdx + 1) +
                `'${newTipText}'` +
                line.slice(closeIdx);
            lines[i] = replacement;
        } else {
            // Mevcut ipuçlarının sonuna ekle
            const before = line.slice(0, closeIdx);
            const after = line.slice(closeIdx);
            const insertion = `, '${newTipText}'`;
            lines[i] = before + insertion + after;
        }
    }

    const newContent = lines.join('\n');

    try {
        fs.writeFileSync(absPath, newContent, 'utf8');
    } catch (e) {
        console.error('Dosya yazılamadı:', e.message);
        process.exit(1);
    }

    console.log('Uyarı ipuçları başarıyla işlendi:', absPath);
}

main();

