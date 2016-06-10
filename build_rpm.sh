#!/bin/bash

TARGET=fpm/build/usr/share/evw-self-serve

rm -rf ${TARGET}/*
cp -rf app.js config.js CONTRIBUTING.md LICENSE package.json README.md version apps lib assets errors lib middleware $TARGET/

cd fpm

fpm --before-install scripts/preinstall.sh \
    --after-install scripts/postinstall.sh \
    --before-remove scripts/preuninstall.sh \
    --after-remove scripts/postuninstall.sh \
    -C build -t rpm -s dir -d nodejs \
    -p NAME_VERSION.ARCH.TYPE \
    -n evw-self-serve -v "$updatesVersion-$BUILD_NUMBER" -a all . \
    || fail "Failed to build rpm"


