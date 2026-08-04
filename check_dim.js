const sharp = require('sharp');
async function check() {
  const m1 = await sharp('public/images/freedom_1.jpg').metadata();
  console.log('Img 1:', m1.width, m1.height);
  const m2 = await sharp('public/images/freedom_2.jpg').metadata();
  console.log('Img 2:', m2.width, m2.height);
}
check();
