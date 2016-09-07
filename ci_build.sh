#!/bin/bash

set -e

export PROJECT_NAME=evw-self-serve
export VERSION=1.0.0

# export MONGO_HOST=rt_caseworker_mongo
# docker stop ${MONGO_HOST} 2>/dev/null || true
# docker rm ${MONGO_HOST} 2>/dev/null || true
# docker run -d --name=${MONGO_HOST} -P \
#   quay.io/ukhomeofficedigital/mongo

if docker run -i --rm=true \
  -v ${PWD}:/app \
  -e BUILD_NUMBER=${BUILD_NUMBER} \
  -e "VERSION=${VERSION}" \
  -w /app \
  quay.io/ukhomeofficedigital/nodejs:v4.4.2 \
 npm test; then

    ok=0
else
    ok=1
fi

if [ ${ok} -ne 0 ]; then
    echo "Failed build"
    exit 1
fi

if [ "${BUILD_NUMBER}" != "" ]; then
  docker build -t docker.digital.homeoffice.gov.uk/${PROJECT_NAME}:${BUILD_NUMBER} .
  docker push docker.digital.homeoffice.gov.uk/${PROJECT_NAME}:${BUILD_NUMBER}
fi

exit 0
