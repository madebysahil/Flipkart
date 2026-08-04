const sharp = require('sharp');
sharp('C:/Users/SahiL/.gemini/antigravity-ide/brain/6c696015-e932-45ce-b4f3-2efc7c866831/media__1785829692646.jpg').webp({ quality: 80 }).toFile('public/images/freedom_1.webp').then(() => console.log('Image 1 done'));
sharp('C:/Users/SahiL/.gemini/antigravity-ide/brain/6c696015-e932-45ce-b4f3-2efc7c866831/media__1785829693917.jpg').webp({ quality: 80 }).toFile('public/images/freedom_2.webp').then(() => console.log('Image 2 done'));
