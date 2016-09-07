# FROM quay.io/ukhomeofficedigital/nodejs:v4.4.2
#
# RUN npm install -g nodemon
#
# USER nodejs
#
# EXPOSE 8080
#
# CMD ["npm", "start"]


FROM quay.io/ukhomeofficedigital/nodejs-base:v4.4.7

MAINTAINER Jay Keshur <Jay.Keshur@digital.homeoffice.gov.uk>

ENV NODE_ENV=development \
    PORT=8080 \
    BASE_URL=http://localhost \
    SESSION_SECRET=howdoesyourgardengrow \
    SESSION_TTL=1200 \
    MONGO_CONNECTION_STRING='mongodb://localhost:27017/evw-self-serve' \
    INTEGRATION_SERVICE_URL=http://localhost:9300 \
    INTEGRATION_SERVICE_PORT=9300 \
    FLIGHT_SERVICE_URL=http://localhost:9350
    # CONNECTOR=redis \
    # REDIS_PORT=6379 \
    # REDIS_HOST=127.0.0.1 \

ENV PATH=${PATH}:/opt/nodejs/bin
# Ensure downstream builds are patched.
RUN yum clean all && \
    yum update -y && \
    yum install -y bzip2 && \
    yum clean all && \
    rpm --rebuilddb && \
    rm -rf node_modules && \
    npm install npm@3.9.0 -g

# Copy downstream in which should help
# ensure everyone using this has a similar
# app structure.
COPY . /app

# Install node depenencies, make sure unit
# tests are passing, then prune the dev deps.
RUN npm --production=false install --unsafe-perm --no-optional && \
    npm prune && \

# Make sure only user nobody can access these
# files, forcing downstream to set it.
    chown -R nodejs:nodejs .

RUN npm test

USER nodejs

EXPOSE 8080

CMD npm start
