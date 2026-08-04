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

const url = 'https://dl.flipkart.com/dl/skynest-portable-usb-rechargeable-juicer-blender-mini-smoothie-maker-bottle-105-w-mixer-grinder/p/itm8e13ae14d0192?pid=MIXHZV5SPWBUFB4H&lid=LSTMIXHZV5SPWBUFB4HMVFJPW&marketplace=FLIPKART&q=owme+portable+usb+rechergeable+juicer+blender&store=j9e/m38/7ek&srno=s_1_14&otracker=search&otracker1=search&fm=organic&iid=en_tQHJu6LpcKL_I2Qxpw6d6IbzonnAUI5daqX4BYZhYSW4QwnPgKHyjcc7Vo30zw_Q5rkLK6OHXf4KCFOgMSMYesW2MWZVzG31YC3cmP5EMlFctth8ewyJt_1_MV8STRo4&ppt=hp&ppn=homepage&ssid=r5pvo00hsw0000001785569391813&qH=38f2e8232069e7d8&ov_redirect=true&_refId=&_appId=CL';

fetchUrl(url).then(({html}) => {
  const fs = require('fs');
  fs.writeFileSync('C:\\\\Users\\\\SahiL\\\\Code\\\\Flipkart1\\\\blender.html', html);
  console.log('Saved to blender.html. Size:', html.length);
}).catch(console.error);
