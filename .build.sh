#!/bin/bash

# Read app version from root level version.properties
evwCustomerSelfServeVersion=$(grep -i ^version ./version.properties | cut -d'=' -f 2)

# Write app version and build number to conf/version.conf
export build_number=${BUILD_NUMBER:-1}
echo "buildNumber=\""$evwCustomerSelfServeVersion"_"$BUILD_NUMBER\" > version.conf

npm i --no-optional --cache-min 9999999 --loglevel error || echo 'failed to install from cache'; npm i
if [ "$?" -ne "0" ]; then echo "[build.sh] npm install failure"; exit 1; fi

npm run test:ci

if [ $? -ne 0 ]; then
  echo "[build.sh] failure"
  exit 1
else
  echo "[build.sh] done"
fi

