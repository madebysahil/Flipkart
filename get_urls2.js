const fs = require('fs');
const path = require('path');

const logPath = 'C:\\\\Users\\\\SahiL\\\\.gemini\\\\antigravity-ide\\\\brain\\\\a39c4d77-582f-4151-8865-b533ab9f496d\\\\.system_generated\\\\logs\\\\transcript_full.jsonl';
if (!fs.existsSync(logPath)) {
  console.log('Log not found at ' + logPath);
  process.exit(1);
}

const lines = fs.readFileSync(logPath, 'utf8').split('\\n');
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

const uniqueUrls = [...new Set(urls)];
console.log(uniqueUrls.join('\\n'));
fs.writeFileSync('all_urls.txt', uniqueUrls.join('\\n'));
