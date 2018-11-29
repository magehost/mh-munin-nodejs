#!/usr/bin/nodejs

'use strict';

const puppeteer = require('puppeteer');

if (process.argv.length < 3) {
    console.log("\n\tUsage: " + __filename + " [URL]\n");
    process.exit(-1);
}

(async () => {
    const browser = await puppeteer.launch( { ignoreHTTPSErrors: true} );
    const page = await browser.newPage();
    const defaultUserAgent = await page.evaluate('navigator.userAgent');
    await page.setUserAgent(defaultUserAgent + ' - MageHost.pro Munin LoadTimes Measure');
    page.goto(process.argv[2]).then(function () {
        page.evaluate(() => {
            return JSON.stringify({
                'timing': performance.timing,
                'entry': performance.getEntriesByType('navigation')[0]
            });
        }).then(function (json) {
            console.log(json);
            browser.close();
        }).catch(function (err) {
            console.log('ERROR Page Evaluate failed: ' + err);
            browser.close();
        });
    }).catch(function (err) {
        console.log('ERROR URL Load failed: ' + err);
        browser.close();
    });
})();
