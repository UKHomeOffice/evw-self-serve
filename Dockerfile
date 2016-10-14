FROM quay.io/ukhomeofficedigital/nodejs-base:v4.4.7

MAINTAINER Jay Keshur <Jay.Keshur@digital.homeoffice.gov.uk>

ENV NODE_ENV=development \
    PORT=8080 \
    GOOGLE_ANALYTICS_CODE=false \
    ASSET_PATH=/public \
    GOVUK_ASSET_PATH=/govuk-assets \
    SESSION_SECRET=howdoesyourgardengrow \
    SESSION_TTL=1200 \
    MONGO_CONNECTION_STRING=mongodb://localhost:27017/evw-self-serve \
    FLIGHT_SERVICE_URL=http://localhost:9350 \
    INTEGRATION_SERVICE_URL=http://localhost:9300 \
    INTEGRATION_SERVICE_PORT=9300

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

RUN npm run sass
RUN npm test

USER nodejs

EXPOSE 8080

CMD npm start
