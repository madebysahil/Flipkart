const fs = require('fs');

const lines = fs.readFileSync('C:\\\\Users\\\\SahiL\\\\.gemini\\\\antigravity-ide\\\\brain\\\\a39c4d77-582f-4151-8865-b533ab9f496d\\\\.system_generated\\\\logs\\\\transcript.jsonl', 'utf8').split('\\n');
const urls = [];
for (const line of lines) {
  if (!line.trim()) continue;
  try {
    const obj = JSON.parse(line);
    if (obj.type === 'USER_INPUT' && obj.content) {
      const match = obj.content.match(/https:\/\/dl\.flipkart\.com\/[^\s<>"]+/g);
      if (match) {
        urls.push(...match);
      }
    }
  } catch (e) {}
}

console.log([...new Set(urls)]);
