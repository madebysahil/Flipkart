const fs = require('fs');

// 1. Remove from backend/products.json
const productsPath = 'backend/products.json';
let products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));
const initialLen = products.length;
products = products.filter(p => !p.title || !p.title.toLowerCase().includes('skynest'));
if (products.length !== initialLen) {
  fs.writeFileSync(productsPath, JSON.stringify(products, null, 2));
  console.log('Removed from backend/products.json');
}

// 2. Remove from config.json
const configPath = 'config.json';
let config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
let configUpdated = false;
if (config.PRODUCTS) {
  for (const key of Object.keys(config.PRODUCTS)) {
    if (config.PRODUCTS[key]._name && config.PRODUCTS[key]._name.toLowerCase().includes('skynest')) {
      delete config.PRODUCTS[key];
      configUpdated = true;
    }
  }
  if (configUpdated) {
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
    console.log('Removed from config.json');
  }
}
