const fs = require('fs');
const path = require('path');

const src = path.join(__dirname, 'src', 'data', 'words.json');
const destDir = path.join(__dirname, 'dist', 'data');
const dest = path.join(destDir, 'words.json');

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

fs.copyFileSync(src, dest);
console.log('words.json copied to dist/data');