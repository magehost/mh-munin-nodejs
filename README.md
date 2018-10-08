# mh-munin-nodejs
MageHost's NodeJS scripts for Munin

## Install
```
(
    apt-get --yes  install  libxss1
    umask 0022
    cd /usr/local/lib
    npm install --no-progress git+ssh://git@github.com:magehost/mh-munin-nodejs.git
    sudo -u munin  /usr/local/lib/node_modules/mh-munin-nodejs/loadtimes.js  https://magehost.pro
)
```

## Develop
As non-root user:
```
git clone git@github.com:magehost/mh-munin-nodejs.git
cd mh-munin-nodejs
npm install
./loadtimes.js https://magehost.pro
```
