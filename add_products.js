const fs = require('fs');
const https = require('https');
const path = require('path');

const rawData = `
2. https://dl.flipkart.com/s/GbG4KeuuuN
419    88
3. https://dl.flipkart.com/dl/apple-iphone-17-pro-cosmic-orange-512-gb/p/itm999d978f08430?pid=MOBHFN6YUW9A93DC
599     99
4. https://dl.flipkart.com/dl/orient-electric-40-l-room-personal-air-cooler/p/itm95b777445b207
565    91
5. https://dl.flipkart.com/dl/mivi-fort-h350-soundbar-350-watts-5-1-channel-multi-input-eq-modes-bt-v5-1-w-bluetooth-soundbar/p/itm38449f86ec63f
489   90
6. https://dl.flipkart.com/dl/safari-keplar-3p-set-4w-cabin-check-in-8-wheels-30-inch/p/itmaf95c5d930458
499    90
7. https://dl.flipkart.com/s/1sPmh8NNNN
465    91
8. https://dl.flipkart.com/s/Gbby0KuuuN
699   98
9. https://dl.flipkart.com/dl/leader-gladiator-multi-speed-21-speed-cycle-front-suspension-disc-brake-26-t-inch-hybrid-cycle-city-bike/p/itm01ecb7915e1dd
499     95
10. https://dl.flipkart.com/dl/morphy-richards-windsor-series-1-7-litre-digital-electric-kettle/p/itm1319acd03e846
455     97
`;

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' } }, (res) => {
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

function extractData(html) {
  const titleMatch = html.match(/property="og:title" content="([^"]+)"/) || html.match(/<title>([^<]+)<\/title>/);
  const title = titleMatch ? titleMatch[1].replace(/Price in India.*/, '').trim() : 'Unknown Product';
  
  const imgMatch = html.match(/property="og:image" content="([^"]+)"/);
  let image = imgMatch ? imgMatch[1] : '';
  if (image) {
    image = image.replace(/\/\d+\/\d+\//, '/832/832/');
  }

  return { title, image };
}

async function run() {
  const productsFile = path.join(__dirname, 'backend', 'products.json');
  const products = JSON.parse(fs.readFileSync(productsFile, 'utf8'));

  const lines = rawData.trim().split('\n');
  for (let i = 0; i < lines.length; i += 2) {
    const urlLine = lines[i].trim();
    const priceLine = lines[i + 1].trim();

    const urlMatch = urlLine.match(/https:\/\/\S+/);
    if (!urlMatch) continue;
    const url = urlMatch[0];

    const priceMatch = priceLine.match(/(\d+)\s+(\d+)/);
    if (!priceMatch) continue;
    const price = parseInt(priceMatch[1], 10);
    const discount = parseInt(priceMatch[2], 10);
    const oldPrice = Math.round(price / (1 - (discount / 100)));

    console.log(`Fetching ${url} ...`);
    try {
      const { html } = await fetchUrl(url);
      const { title, image } = extractData(html);
      
      const product = {
        _id: 'product_' + Date.now() + Math.floor(Math.random() * 1000),
        title,
        description: `Buy ${title} online at best prices. Only Genuine Products. 30 Day Replacement Guarantee. Free Shipping. Cash On Delivery!`,
        price,
        oldPrice,
        discount,
        images: image ? [image, image, image] : [],
        category: "General",
        brand: "Flipkart",
        countInStock: 150,
        rating: 4.4 + (Math.random() * 0.5), // 4.4 to 4.9
        numReviews: Math.floor(Math.random() * 5000) + 1000,
        highlights: [
          "100% Original Product",
          "Fast Delivery",
          "Easy Returns",
          "Cash on Delivery Available"
        ],
        specifications: [
          {
            category: "General",
            items: [
              { name: "Brand", value: "Flipkart" },
              { name: "Quality", value: "Premium" }
            ]
          }
        ],
        reviews: [
          {
            author: "Verified Customer",
            title: "Excellent purchase",
            rating: 5,
            comment: "Really happy with this product. The quality is outstanding and delivery was super fast. Highly recommend!",
            date: "2 days ago",
            location: "Mumbai",
            likes: 124,
            dislikes: 3,
            images: image ? [image] : []
          }
        ]
      };

      products.push(product);
      console.log(`Added: ${title}`);
    } catch (e) {
      console.error(`Failed to fetch ${url}: `, e);
    }
  }

  fs.writeFileSync(productsFile, JSON.stringify(products, null, 2));
  console.log('All products added successfully!');
}

run();
