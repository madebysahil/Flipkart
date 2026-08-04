const fs = require('fs');
const path = require('path');

const targetDirs = [
  path.join(__dirname, 'src'),
  __dirname
];

const extensionsToReplace = ['.jpg', '.jpeg', '.png'];
const ignoreDirs = ['node_modules', '.git', 'dist'];

let updatedFilesCount = 0;

function processFile(filePath) {
  // Only process certain file types
  if (!/\.(js|jsx|ts|tsx|css|json|html)$/.test(filePath)) return;
  if (filePath.endsWith('package.json') || filePath.endsWith('package-lock.json')) return;

  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  // Global regex replacement
  extensionsToReplace.forEach(ext => {
    // We want to replace .jpg, .png etc with .webp
    // A simple approach: regex replace ignoring case
    const regex = new RegExp(`\\${ext}`, 'gi');
    
    // We should be careful not to replace something like "image/png", but replacing ".png" is usually safe.
    content = content.replace(regex, '.webp');
  });

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated references in: ${filePath}`);
    updatedFilesCount++;
  }
}

function traverseDir(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      if (!ignoreDirs.includes(file)) {
        traverseDir(fullPath);
      }
    } else {
      processFile(fullPath);
    }
  }
}

console.log("Starting reference update...");
targetDirs.forEach(dir => {
  if (dir === __dirname) {
    // only process specific files in root
    const rootFiles = ['index.html', 'config.json'];
    rootFiles.forEach(f => {
      const fp = path.join(__dirname, f);
      if (fs.existsSync(fp)) processFile(fp);
    });
  } else {
    traverseDir(dir);
  }
});
console.log(`Total files updated: ${updatedFilesCount}`);
