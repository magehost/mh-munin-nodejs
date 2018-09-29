#!/usr/bin/nodejs

const puppeteer = require('puppeteer');

async function run() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://www.github.com/');

  // https://developer.mozilla.org/en-US/docs/Web/API/Performance/getEntries
  //console.log("\n==== performance.getEntries() ====\n");
  //console.log( await page.evaluate( () => JSON.stringify(performance.getEntries(), null, "  ") ) );

  // https://github.com/alex-vv/chrome-load-timer/blob/master/src/performance.js
  console.log( await page.evaluate( () => JSON.stringify(performance.getEntriesByType('navigation')[0], null, "  ") ) );
  
  // https://developer.mozilla.org/en-US/docs/Web/API/Performance/toJSON
  console.log("\n==== performance.toJSON() ====\n");
  console.log( await page.evaluate( () => JSON.stringify(performance.toJSON(), null, "  ") ) );

  // https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#pagemetrics
  console.log("\n==== page.metrics() ====\n");
  const perf = await page.metrics();
  console.log( JSON.stringify(perf, null, "  ") );

  browser.close();
}

run();
