const https = require('https');
https.get('https://www.flipkart.com', res => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const matches = data.match(/https:\/\/rukminim[^"'\s]+/g);
    if (matches) {
      const flaps = Array.from(new Set(matches)).filter(u => u.includes('flap') || u.includes('image'));
      console.log(flaps.slice(0, 30).join('\n'));
    }
  });
});
