# mh-munin-nodejs
MageHost's NodeJS scripts for Munin

## Install
```
(
    apt-get --yes --no-install-recommends  install  gconf-service libasound2 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils wget
    umask 0022
    cd /usr/local/lib
    npm install --no-progress git+ssh://git@github.com:magehost/mh-munin-nodejs.git
    sudo -u munin  /usr/local/lib/node_modules/mh-munin-nodejs/loadtimes.js  https://magehost.pro
)
```

## Update
```
(
    umask 0022
    cd /usr/local/lib
    npm update mh-munin-nodejs
    sudo -u munin  /usr/local/lib/node_modules/mh-munin-nodejs/loadtimes.js  https://magehost.pro
)
```

## Develop
### As non-root user on Linux:
```
git clone git@github.com:magehost/mh-munin-nodejs.git
cd mh-munin-nodejs
npm install
./loadtimes.js https://magehost.pro
```
### On Mac:
```
brew install node
git clone git@github.com:magehost/mh-munin-nodejs.git
cd mh-munin-nodejs
npm install
node ./loadtimes.js https://magehost.pro
```
