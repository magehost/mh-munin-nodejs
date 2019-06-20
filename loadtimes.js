#!/usr/bin/nodejs

//
// To test during dev:
//     chgrp -R  munin  /data/repos/mh-munin-nodejs
//     sudo  -u munin  nodejs  /data/repos/mh-munin-nodejs/loadtimes.js  https://magehost.pro/
//

// After updating: don't forget to increase version in package.json

'use strict';

const puppeteer = require('puppeteer');

if (process.argv.length < 3) {
    console.log("\n\tUsage: " + __filename + " [URL]\n");
    process.exit(-1);
}

(async () => {
    const browser = await puppeteer.launch( { ignoreHTTPSErrors: true} ).catch(
        function (err) {
            console.log('ERROR Creating browser: ' + err);
            process.exit(22);
        });
    const page = await browser.newPage().catch(
        function (err) {
            console.log('ERROR Creating new page: ' + err);
            browser.close();
            process.exit(27);
        });
    await page.setUserAgent('MageHost.pro Munin LoadTimes Measure').catch(
        function (err) {
            console.log('ERROR Setting user agent: ' + err);
            browser.close();
            process.exit(32);
        });
    await page.setRequestInterception(true);
    page.on('request', request => {
        if ( request.url().includes('google-analytics') &&
             (request.url().includes('/collect') || request.url().includes('/batch')) ) {
            request.abort();
        } else {
            request.continue();
        }
    });
    page.goto(process.argv[2], {timeout: 20 * 1000}).then(function () {
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
            process.exit(46);
        });
    }).catch(function (err) {
        console.log('ERROR URL Load failed: ' + err);
        browser.close();
        process.exit(51);
    });
})();

