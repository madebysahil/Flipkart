const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const targetDirs = [
  path.join(__dirname, 'public'),
  path.join(__dirname, 'src', 'assets')
];

let totalOldSize = 0;
let totalNewSize = 0;
let convertedCount = 0;

async function processDirectory(dir) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      await processDirectory(fullPath);
    } else if (/\.(jpg|jpeg|png)$/i.test(file)) {
      const ext = path.extname(file);
      const name = path.basename(file, ext);
      const outputDir = path.dirname(fullPath);
      const newPath = path.join(outputDir, `${name}.webp`);

      const oldSize = stat.size;
      
      let quality = 80; // default for products
      let lossless = false;

      // Logic to determine quality
      if (fullPath.includes('banners') || fullPath.includes('hero')) {
        quality = 90;
      } else if (fullPath.includes('icons') || file.includes('logo') || file.includes('icon') || ext.toLowerCase() === '.png') {
        quality = 90;
      }

      try {
        await sharp(fullPath)
          .webp({ quality: quality, lossless: false, force: true })
          .toFile(newPath);

        const newStat = fs.statSync(newPath);
        totalOldSize += oldSize;
        totalNewSize += newStat.size;
        convertedCount++;

        console.log(`Converted: ${file} -> ${name}.webp`);
      } catch (err) {
        console.error(`Error converting ${file}:`, err);
      }
    }
  }
}

async function main() {
  console.log("Starting Image Optimization...");
  for (const dir of targetDirs) {
    if (fs.existsSync(dir)) {
      await processDirectory(dir);
    }
  }
  console.log("-----------------------------------------");
  console.log(`Total images converted: ${convertedCount}`);
  if (convertedCount > 0) {
    console.log(`Old size: ${(totalOldSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`New size: ${(totalNewSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`Savings: ${((totalOldSize - totalNewSize) / 1024 / 1024).toFixed(2)} MB (${Math.round((1 - totalNewSize/totalOldSize) * 100)}%)`);
  }
  
  // Save stats for final report
  fs.writeFileSync('optimization-stats.json', JSON.stringify({
    convertedCount,
    totalOldSize,
    totalNewSize
  }));
}

main();
