#!/usr/bin/node

//
// To test during dev:
//     chgrp -R  munin  /data/repos/mh-munin-nodejs
//     sudo  -u munin  nodejs  /data/repos/mh-munin-nodejs/loadtimes.js  https://magehost.pro/
//

// After updating: don't forget to increase version in package.json

'use strict';

const puppeteer = require('puppeteer');
const fs = require('fs-extra')

if (process.argv.length < 3) {
    console.log("\n\tUsage: " + __filename + " [URL]\n");
    process.exit(-1);
}

const tempDir = '/dev/shm/' + require("os").userInfo().username + '/mh-munin-nodejs/datadir-' + process.pid; 
if (fs.existsSync(tempDir)) {
    fs.removeSync(tempDir, { recursive: true });
}
fs.mkdirSync(tempDir, { recursive: true, mode: 0o2700 });

function exitHandler(options, exitCode) {
    fs.removeSync(tempDir);
    if (options.exit) process.exit();
}
//do something when app is closing
process.on('exit', exitHandler.bind(null,{normalExit:true}));
//catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, {exit:true}));
// catches "kill pid" (for example: nodemon restart)
process.on('SIGUSR1', exitHandler.bind(null, {exit:true}));
process.on('SIGUSR2', exitHandler.bind(null, {exit:true}));
//catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, {exit:true}));

(async () => {
    const browser = await puppeteer.launch( {
       ignoreHTTPSErrors: true,
       headless: true,  // Set to false to open X-Windows Chromium to debug
       args: [
           //  default options
           '--disable-background-networking',
           '--enable-features=NetworkService,NetworkServiceInProcess',
           '--disable-background-timer-throttling',
           '--disable-backgrounding-occluded-windows',
           '--disable-breakpad',
           '--disable-client-side-phishing-detection',
           '--disable-component-extensions-with-background-pages',
           '--disable-default-apps',
           //'--disable-dev-shm-usage',
           '--disable-extensions',
           '--disable-features=TranslateUI',
           '--disable-hang-monitor',
           '--disable-ipc-flooding-protection',
           '--disable-popup-blocking',
           '--disable-prompt-on-repost',
           '--disable-renderer-backgrounding',
           '--disable-sync',
           '--force-color-profile=srgb',
           '--metrics-recording-only',
           '--no-first-run',
           '--enable-automation',
           '--password-store=basic',
           '--use-mock-keychain',
           '--headless',
           '--hide-scrollbars',
           '--mute-audio about:blank',
           '--remote-debugging-port=0',
           '--user-data-dir='+tempDir,
           //  /default options      
           //  Inspiration: https://github.com/puppeteer/puppeteer/issues/824    
           '--disable-dev-profile',
           '--disable-translate',
           '--audio-output-channels=0',
       ]
    } ).catch(
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
        if ( request.url().includes('code.jquery.com/') ||  // our IP will be blocked if we keep hitting
             ( request.url().includes('google-analytics') &&
               ( request.url().includes('/collect') ||
                 request.url().includes('/batch') ||
                 request.url().includes('/__utm')
               )
             )
           ) {
            // console.log("# SKIP:  " + request.url() + "\n");
            request.abort();
        } else {
            // console.log("# Allow: " + request.url() + "\n");
            request.continue();
        }
    });
    page.goto(process.argv[2], {timeout: 20 * 1000}).then(function () {
        page.evaluate(() => {
            return JSON.stringify({
                'sampleTime': Math.floor(Date.now() / 1000),
                'timing': performance.timing,
                'entry': performance.getEntriesByType('navigation')[0]
            });
        }).then(function (json) {
            console.log(json);
            browser.close();
//            fs.rmdirSync(tempDir, { recursive: true });
        }).catch(function (err) {
            console.log('ERROR Page Evaluate failed: ' + err);
            browser.close();
//            fs.rmdirSync(tempDir, { recursive: true });
            process.exit(46);
        });
    }).catch(function (err) {
        console.log('ERROR URL Load failed: ' + err);
        browser.close();
//        fs.rmdirSync(tempDir, { recursive: true });
        process.exit(51);
    });
})();
