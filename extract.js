const fs = require('fs');
const html = fs.readFileSync('C:\\\\Users\\\\SahiL\\\\.gemini\\\\antigravity-ide\\\\brain\\\\a39c4d77-582f-4151-8865-b533ab9f496d\\\\.system_generated\\\\steps\\\\2710\\\\content.md', 'utf8');

// Extract OG Title
const titleMatch = html.match(/property="og:title"\s+content="([^"]+)"/i);
const title = titleMatch ? titleMatch[1] : 'Title not found';

// Extract OG Image
const imageMatch = html.match(/property="og:image"\s+content="([^"]+)"/i);
const image = imageMatch ? imageMatch[1] : 'Image not found';

// Extract Specs (just finding list items in the highlights section if possible)
const highlights = [];
const specMatches = html.matchAll(/<li[^>]*>([^<]+)<\/li>/g);
for (const match of specMatches) {
  if (match[1].length > 10 && match[1].length < 100) {
    highlights.push(match[1]);
  }
}

console.log('TITLE:', title);
console.log('IMAGE:', image);
console.log('HIGHLIGHTS:', highlights.slice(0, 10));
