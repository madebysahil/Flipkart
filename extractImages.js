const fs = require('fs');
const html = fs.readFileSync('C:\\\\Users\\\\SahiL\\\\.gemini\\\\antigravity-ide\\\\brain\\\\a39c4d77-582f-4151-8865-b533ab9f496d\\\\.system_generated\\\\steps\\\\2710\\\\content.md', 'utf8');

const images = new Set();
const matches = html.matchAll(/https:\/\/rukminim[12]\.flixcart\.com\/image\/\d+\/\d+\/([^"]+\.jpeg\?q=\d+)/g);

for (const match of matches) {
  // Try to find the original large image URLs by replacing the resolution
  images.add(`https://rukminim2.flixcart.com/image/832/832/${match[1]}`);
}

console.log('IMAGES:');
console.log(Array.from(images).slice(0, 15).join('\n'));
