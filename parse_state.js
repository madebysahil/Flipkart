const fs = require('fs');

const html = fs.readFileSync('C:\\\\Users\\\\SahiL\\\\Code\\\\Flipkart1\\\\atomberg.html', 'utf8');

const match = html.match(/window\.__INITIAL_STATE__\s*=\s*(.*?);<\/script>/);
if (!match) {
  console.log("No initial state found");
  process.exit(1);
}

const state = JSON.parse(match[1]);
const reviews = [];

// Traverse object recursively to find reviews
function findReviews(obj) {
  if (!obj || typeof obj !== 'object') return;
  if (Array.isArray(obj)) {
    obj.forEach(findReviews);
  } else {
    // If it looks like a review
    if (obj.rating && obj.author && obj.text) {
       reviews.push(obj);
    }
    // Flipkart sometimes uses "value.text", "value.rating", etc.
    Object.values(obj).forEach(findReviews);
  }
}

findReviews(state);

// Alternative: look for something that has author and title
const betterReviews = [];
function findBetterReviews(obj) {
  if (!obj || typeof obj !== 'object') return;
  if (Array.isArray(obj)) {
    obj.forEach(findBetterReviews);
  } else {
    if (obj.type === 'ProductReviewValue' || (obj.author && obj.rating && (obj.text || obj.title))) {
       betterReviews.push(obj);
    }
    Object.values(obj).forEach(findBetterReviews);
  }
}

findBetterReviews(state);

console.log('BETTER REVIEWS:', betterReviews.length);
if (betterReviews.length > 0) {
  console.log(betterReviews.slice(0, 2).map(r => ({
    title: r.title,
    text: r.text,
    rating: r.rating,
    author: r.author
  })));
}

// Write the parsed state to a file so we can grep it if we need to
fs.writeFileSync('C:\\\\Users\\\\SahiL\\\\Code\\\\Flipkart1\\\\state.json', JSON.stringify(state, null, 2));
