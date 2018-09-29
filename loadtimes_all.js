#!/usr/bin/nodejs

const puppeteer = require('puppeteer');

async function run() {
  if ( process.argv.length < 3 ) {
    console.log("\n\tUsage: " + __filename + " [URL]\n");
    process.exit(-1);
  }

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto( process.argv[2] );

  //// https://developer.mozilla.org/en-US/docs/Web/API/Performance/getEntries
  console.log("\n==== performance.getEntries() ====\n");
  console.log( await page.evaluate( () => JSON.stringify(performance.getEntries(), null, "  ") ) );

  //// https://github.com/alex-vv/chrome-load-timer/blob/master/src/performance.js
  //const perfEntry = await page.evaluate( () => JSON.stringify(performance.getEntriesByType('navigation')[0]) );
  //process.stdout.write( perfEntry );

  //// https://developer.mozilla.org/en-US/docs/Web/API/Performance/toJSON
  console.log("\n==== performance.toJSON() ====\n");
  console.log( await page.evaluate( () => JSON.stringify(performance.toJSON(), null, "  ") ) );

  //// https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#pagemetrics
  console.log("\n==== page.metrics() ====\n");
  const perf = await page.metrics();
  console.log( JSON.stringify(perf, null, "  ") );

  browser.close();
}

run();


