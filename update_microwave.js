const fs = require('fs');
const path = require('path');

const srcDir = 'C:\\\\Users\\\\SahiL\\\\.gemini\\\\antigravity-ide\\\\brain\\\\a39c4d77-582f-4151-8865-b533ab9f496d';
const destDir = path.join(__dirname, 'public', 'images');

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

fs.copyFileSync(path.join(srcDir, 'media__1785652935091.png'), path.join(destDir, 'microwave_1.png'));
fs.copyFileSync(path.join(srcDir, 'media__1785652966779.png'), path.join(destDir, 'microwave_2.png'));
fs.copyFileSync(path.join(srcDir, 'media__1785652974873.jpg'), path.join(destDir, 'microwave_3.jpg'));
fs.copyFileSync(path.join(srcDir, 'media__1785652985744.png'), path.join(destDir, 'microwave_4.png'));

const productsPath = path.join(__dirname, 'backend', 'products.json');
const products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));

const microwave = products.find(p => p.title.includes('Samsung 23 L Ceramic Cavity'));
if (microwave) {
  microwave.images = [
    '/images/microwave_1.png',
    '/images/microwave_2.png',
    '/images/microwave_3.jpg',
    '/images/microwave_4.png'
  ];
}

fs.writeFileSync(productsPath, JSON.stringify(products, null, 2));
console.log('Updated microwave images successfully.');
