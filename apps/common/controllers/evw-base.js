'use strict';

const controllers = require('hof').controllers;
const BaseController = controllers.base;
const ErrorController = controllers.error;
const formatting = require('../../../lib/formatting');
const is = require('../../../config').integrationService;
const logger = require('../../../lib/logger');
const request = require('request');

module.exports = class EvwBaseController extends BaseController {



  constructor(settings) {
    super(settings);
    this.dateKeys = settings.options && settings.options.dateKeys || [];
    this.timeKeys = settings.options && settings.options.timeKeys || [];
    this.millis = 0;
  }

  authenticate(callback) {
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
          logger.info(`An error occurred while authenticating with ${is.login.url} Error: ${err}`);
          return callback(null, err);
        }
        if ( body.jwt == undefined) {
          logger.info('undefined body');
          return callback('JWT Token undefined')
        }
        logger.info(body);
        logger.info(`Setting bearer auth token to: ${body.jwt}`);
        is.auth = {'bearer': body.jwt};
        this.millis = now;
      });
    }
    return callback(is.auth);
  }

  getNextStep (req, res) {
    this.confirmStep = '/check-your-answers';
    return super.getNextStep(req, res);
  }

  process(req, res, callback) {
    this.dateKeys.forEach(key => {
      req.form.values[key] = formatting.getDate(req.form.values, key);
      req.form.values[`${key}-formatted`] = formatting.getFormattedDate(req.form.values[key]);
    });
    this.timeKeys.forEach(key => {
      req.form.values[key] = formatting.getFormattedTime(formatting.getTime(req.form.values, key));
    });
    super.process(req, res, callback);
  }

  validateField(key, req) {
    let error = super.validateField(key, req);
    if (req.fields &&
      req.fields[key] &&
      req.fields[key].hasOwnProperty('validators')
    ) {
      let value = req.form.values[key];
      req.fields[key].validators.forEach((validator) => {
        validator.formValues = Object.assign({}, req.sessionModel.attributes, req.form.values);
        if (validator.type(value, typeof validator.arguments === 'function' ? validator.arguments() : validator.arguments)) {
          error = new ErrorController(key, {
            type: validator.type.name
          });
        }
      });
    }
    return error;
  }

};
