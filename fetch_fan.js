const https = require('https');

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        let loc = res.headers.location;
        if (!loc.startsWith('http')) loc = 'https://flipkart.com' + loc;
        return fetchUrl(loc).then(resolve).catch(reject);
      }
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => resolve({ html: data, url: res.url }));
    }).on('error', reject);
  });
}

fetchUrl('https://dl.flipkart.com/s/GbG4KeuuuN').then(({html}) => {
  const fs = require('fs');
  fs.writeFileSync('C:\\\\Users\\\\SahiL\\\\Code\\\\Flipkart1\\\\atomberg.html', html);
  console.log('Saved to atomberg.html. Size:', html.length);
}).catch(console.error);
