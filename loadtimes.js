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

  const perfJson = await page.evaluate( () => JSON.stringify(performance.getEntriesByType('navigation')[0]) );
  process.stdout.write( perfJson );  

  browser.close();
}

run();
