# mh-munin-nodejs
MageHost's NodeJS scripts for Munin

## Install
```
(
    umask 0022
    cd /usr/lib
    npm install git+ssh://git@github.com:magehost/mh-munin-nodejs.git
)
sudo -u munin /usr/lib/node_modules/mh-munin-nodejs/loadtimes.js  https://magehost.pro
```
