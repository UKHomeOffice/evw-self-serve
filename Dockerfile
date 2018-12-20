FROM quay.io/ukhomeofficedigital/nodejs-base:v8

ARG NPM_AUTH_USERNAME
ARG NPM_AUTH_TOKEN

ENV NODE_ENV=development \
    NPM_AUTH_USERNAME=${NPM_AUTH_USERNAME} \
    NPM_AUTH_TOKEN=${NPM_AUTH_TOKEN}
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

RUN yum install -y make gcc gcc-c++ krb5-devel git bzip2 && \
    npm i -g npm@6

# Bare minimum npm requirements
COPY package.json .npmrc /app/

COPY app.js /app/
COPY config.js /app/
COPY nightwatch.conf.js /app/
COPY cypress /app/cypress
COPY cypress.json /app/
COPY CONTRIBUTING.md /app/
COPY LICENSE package.json /app/
COPY README.md /app/
COPY version /app/
COPY acceptance_tests /app/acceptance_tests
COPY apps /app/apps
COPY lib /app/lib
COPY assets /app/assets
COPY errors /app/errors
COPY middleware /app/middleware
COPY data /app/data
COPY test /app/test

# Install node dependencies
RUN CI=true MONGOMS_VERSION=3.4.18 npm --production=false install --unsafe-perm

RUN npm test && \
    npm prune && \
    mkdir -p /app/public/images/upload.tmp && \
    chown -R nodejs:nodejs /app/public/images/upload.tmp

USER 999

EXPOSE 8089

CMD npm start
