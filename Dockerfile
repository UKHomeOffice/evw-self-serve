FROM centos/nodejs-10-centos7

ARG NPM_AUTH_USERNAME
ARG NPM_AUTH_TOKEN

ENV NODE_ENV=development \
    NPM_AUTH_USERNAME=${NPM_AUTH_USERNAME} \
    NPM_AUTH_TOKEN=${NPM_AUTH_TOKEN} \
    ASSET_PATH=/update-journey-details/public
#    MONGO_CONNECTION_STRING=mongodb://mongo:27017/applicationdb
#    PORT=8080 \
#    PROTOCOL=http \
#    INTEGRATION_PORT=8090 \
#    SESSION_SECRET=itdoesnotlooksecurebutitis \
#    SESSION_TTL=1200 \
#    RTP_WORLDPAY_STUB=false \
#    WORLDPAY_URI= \
#    WORLDPAY_BASE= \
#    WORLDPAY_MAC= \
#    INTEGRATION_SERVICE_URL= \
#    INTEGRATION_SERVICE_PROTOCOL=

USER root

WORKDIR /app

RUN yum update -qy ca-certificates

RUN yum install -y make gcc gcc-c++ krb5-devel git bzip2 nmap-ncat socat&& \
    npm i -g npm@6

# Bare minimum npm requirements
COPY package.json .npmrc /app/

COPY . /app/


# Install node dependencies
RUN CI=true MONGOMS_VERSION=3.4.18 npm --production=false install --unsafe-perm

RUN npm test && \
    npm prune

USER 1000

EXPOSE 8080

CMD npm start
