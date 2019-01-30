'use strict';

/*eslint no-process-env: 0*/
/*eslint no-inline-comments: 0*/
/*eslint camelcase: 0*/

let port = process.env.PORT || 8080;

module.exports = {
  appName: 'EVW Self Serve',
  env: process.env.NODE_ENV,
  port: port,
  baseUrl: process.env.TEST_URL || process.env.BASE_URL || 'http://localhost',
  listen_host: process.env.LISTEN_HOST || '0.0.0.0',
  gaCode: process.env.GOOGLE_ANALYTICS_CODE || false,
  assetPath: process.env.ASSET_PATH || '/public',
  govukAssetPath: process.env.GOVUK_ASSET_PATH || '/govuk-assets',
  appPath: 'find-your-application/enter-your-details',
  session: {
    name: 'evwselfserve.sid',
    secret: process.env.SESSION_SECRET || 'howdoesyourgardengrow',
    ttl: process.env.SESSION_TTL || 1200 /* 20 mins */
  },
  mongo: {
    connectionString: process.env.MONGO_CONNECTION_STRING || 'mongodb://localhost:27017/evw-self-serve',
    sslEnabled: process.env.MONGO_SSL_ENABLED === 'true',
    sslCA: process.env.MONGO_SSL_CA || '/etc/ssl/certs/ca-certificates.crt',
    sslCert: process.env.MONGO_SSL_CERT || '/mnt/certs/tls.pem',
    sslKey: process.env.MONGO_SSL_KEY || '/mnt/certs/tls-key.pem'

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
      endpoint: 'self-serve/update'
    },
    evwDetails: {
      method: 'GET',
      endpoint: 'self-serve/get'
    }
  },
  cypress: {
    caseworkerBase: process.env.EVW_CASEWORKER_BASE || 'https://dev-evwcase.notprod.homeoffice.gov.uk/caseworker',
    customerBase: process.env.EVW_CUSTOMER_BASE || 'https://dev-evw.notprod.homeoffice.gov.uk',
    caseworker: {
      'username': 'smoke',
      'password': 'whysoserious'
    }
  }
};
