const fs = require('fs');
const html = fs.readFileSync('C:\\\\Users\\\\SahiL\\\\.gemini\\\\antigravity-ide\\\\brain\\\\a39c4d77-582f-4151-8865-b533ab9f496d\\\\.system_generated\\\\steps\\\\2710\\\\content.md', 'utf8');

const reviews = new Set();
const matches = html.matchAll(/https:\/\/rukminim[12]\.flixcart\.com\/blobio\/[^"]+/g);

for (const match of matches) {
  reviews.add(match[0]);
}

console.log('REVIEWS:');
console.log(Array.from(reviews).slice(0, 10).join('\n'));
