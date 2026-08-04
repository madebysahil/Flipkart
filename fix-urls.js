const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src', 'pages');

const files = fs.readdirSync(srcDir).filter(f => f.endsWith('.jsx'));

for (const file of files) {
  const filePath = path.join(srcDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Replace external image URLs that end with .webp back to .png
  content = content.replace(/(https:\/\/(?:rukminim1\.flixcart\.com|rukminim2\.flixcart\.com|static-assets-web\.flixcart\.com)[^\"]+)\.webp/g, '$1.png');

  fs.writeFileSync(filePath, content, 'utf8');
}
console.log('Fixed external image URLs');
