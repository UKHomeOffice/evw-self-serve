'use strict';

/*eslint no-process-env: 0*/
/*eslint no-inline-comments: 0*/
/*eslint camelcase: 0*/

let port = process.env.PORT || 8080;

module.exports = {
  env: process.env.NODE_ENV,
  port: port,
  baseUrl: process.env.BASE_URL || 'http://localhost',
  listen_host: process.env.LISTEN_HOST || '0.0.0.0',
  gaTag: process.env.GA_TAG || false,
  assetPath: process.env.ASSET_PATH || '/public',
  govukAssetPath: process.env.GOVUK_ASSET_PATH || '/govuk-assets',
  appPath: 'find-your-application/enter-your-details',
  session: {
    secret: process.env.SESSION_SECRET || 'howdoesyourgardengrow',
    ttl: process.env.SESSION_TTL || 1200 /* 20 mins */
  },
  redis: {
    port: process.env.REDIS_PORT_6379_TCP_PORT || process.env.REDIS_PORT || 6379,
    host: process.env.REDIS_PORT_6379_TCP_ADDR || process.env.REDIS_HOST || '127.0.0.1'
  },
  flightService: {
    url: process.env.FLIGHT_SERVICE_URL || 'http://localhost:9350',
    timeout: 5000,
    check: {
        method: 'POST',
        endpoint: 'check-flight-details'
    }
  },
  integrationService: {
    url: process.env.INTEGRATION_SERVICE_URL || 'http://localhost:9300',
    port: process.env.INTEGRATION_SERVICE_PORT || 9300,
    timeout: 5000,
    verify: {
      method: 'POST',
      endpoint: 'verify/evw'
    },
    check: {
      method: 'GET',
      endpoint: 'check/update'
    },
    update: {
      method: 'POST',
      endpoint: 'update/journey-details'
    }
  }
};
