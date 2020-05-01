const is = require('../config').integrationService;
const logger = require('./logger');
const request = require('request');

const authenticate = (callback) => {
  let now = new Date().getTime();
  let tokenMillis = this.millis ? this.millis : 0;
  if ((now - tokenMillis) > (5 * 3600 * 1000)) {
    const auth = {
      user: is.user,
      pass: is.password,
    };
    logger.info(`logging into  ${is.url}/${is.login.endpoint} using ${is.user}:${is.password}`);
    request[is.login.method.toLowerCase()]({
      url: [
        is.url,
        is.login.endpoint
      ].join('/'),
      json: {},
      timeout: is.timeout,
      auth: auth
    }, function (err, res, body) {

      if (err || body.error) {
        logger.info(`An error occurred while authenticating with ${is.url} Error: ${err}`);
        return callback.call(this, null, err);
      }
      if ( body.jwt == undefined) {
        logger.info('undefined body');
        return callback.call(this, null, 'JWT Token undefined')
      }
      logger.info(body);
      logger.info(`Setting bearer auth token to: ${body.jwt}`);
      is.auth = {'bearer': body.jwt};
      this.millis = now;
      return callback(is.auth);
    });
  }
}

module.exports = authenticate
