#!/usr/bin/nodejs

'use strict';

const puppeteer = require('puppeteer');

if ( process.argv.length < 3 ) {
    console.log("\n\tUsage: " + __filename + " [URL]\n");
    process.exit(-1);
}  

(async() => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const defaultUserAgent = await page.evaluate('navigator.userAgent');
  await page.setUserAgent(defaultUserAgent + ' - MageHost.pro Munin LoadTimes Measure');  
  await page.goto( process.argv[2] );
  console.log(
      await page.evaluate( () => { 
          var result = { 'timing': performance.timing,
                         'entry': performance.getEntriesByType('navigation')[0] }; 
          return JSON.stringify(result);
      })
  );
  await browser.close();
})();
