const fs = require('fs');

const html = fs.readFileSync('C:\\\\Users\\\\SahiL\\\\Code\\\\Flipkart1\\\\next_item2.html', 'utf8');

// Title
const titleMatch = html.match(/<title>([^<]+)<\/title>/);
const title = titleMatch ? titleMatch[1].replace(/Price in India.*/, '').trim() : 'Unknown Product';
console.log('TITLE:', title);

// Images
const images = new Set();
const imgMatches = html.matchAll(/https:\/\/rukminim[12]\.flixcart\.com\/image\/\d+\/\d+\/([^"]+\.jpeg\?q=\d+)/g);
for (const match of imgMatches) {
  images.add(`https://rukminim2.flixcart.com/image/832/832/${match[1]}`);
}
console.log('IMAGES:');
console.log(Array.from(images).slice(0, 5).join('\n'));

// Reviews
// In __INITIAL_STATE__, Flipkart stores reviews. Let's try to extract review text using regex
const reviews = [];
// A naive regex to grab review titles and comments which often look like: "title":"Terrific purchase","rating":5,..."text":"..."
const reviewMatches = html.matchAll(/"title":"([^"]+)","rating":(\d)[^}]+?"text":"([^"]+)"/g);
for (const match of reviewMatches) {
  reviews.push({ title: match[1], rating: match[2], text: match[3] });
}
console.log('REVIEWS:');
console.log(reviews.slice(0, 2));

// Review images
const reviewImages = new Set();
const blobioMatches = html.matchAll(/https:\/\/rukminim[12]\.flixcart\.com\/blobio\/[^"]+/g);
for (const match of blobioMatches) {
  reviewImages.add(match[0]);
}
console.log('REVIEW IMAGES:');
console.log(Array.from(reviewImages).slice(0, 5).join('\n'));
