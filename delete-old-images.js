const fs = require('fs');
const path = require('path');

const targetDirs = [
  path.join(__dirname, 'public'),
  path.join(__dirname, 'src', 'assets')
];

let deletedCount = 0;

function processDirectory(dir) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (/\.(jpg|jpeg|png)$/i.test(file)) {
      fs.unlinkSync(fullPath);
      console.log(`Deleted: ${file}`);
      deletedCount++;
    }
  }
}

targetDirs.forEach(dir => {
  if (fs.existsSync(dir)) {
    processDirectory(dir);
  }
});

console.log(`Total old images deleted: ${deletedCount}`);
