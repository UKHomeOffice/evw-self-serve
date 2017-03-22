'use strict';

/*eslint no-process-env: 0*/
/*eslint no-inline-comments: 0*/
/*eslint camelcase: 0*/

let port = process.env.PORT || 8080;

module.exports = {
  appName: 'EVW Self Serve',
  env: process.env.NODE_ENV,
  port: port,
  baseUrl: process.env.BASE_URL || 'http://localhost',
  listen_host: process.env.LISTEN_HOST || '0.0.0.0',
  gaCode: process.env.GOOGLE_ANALYTICS_CODE || false,
  assetPath: process.env.ASSET_PATH || '/public',
  govukAssetPath: process.env.GOVUK_ASSET_PATH || '/govuk-assets',
  appPath: 'find-your-application/enter-your-details',
  session: {
    secret: process.env.SESSION_SECRET || 'howdoesyourgardengrow',
    ttl: process.env.SESSION_TTL || 1200 /* 20 mins */
  },
  mongo: {
    connectionString: process.env.MONGO_CONNECTION_STRING || 'mongodb://localhost:27017/evw-self-serve'
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
