const sharp = require('sharp');
sharp('C:/Users/SahiL/.gemini/antigravity-ide/brain/6c696015-e932-45ce-b4f3-2efc7c866831/media__1785831103154.jpg')
  .webp({ quality: 90 })
  .toFile('public/images/freedom_1.webp')
  .then(() => console.log('Image 1 done'));

sharp('C:/Users/SahiL/.gemini/antigravity-ide/brain/6c696015-e932-45ce-b4f3-2efc7c866831/media__1785831109039.png')
  .webp({ quality: 90 })
  .toFile('public/images/freedom_2.webp')
  .then(() => console.log('Image 2 done'));
