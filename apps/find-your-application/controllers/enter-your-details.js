'use strict';

const EvwBaseController = require('../../common/controllers/evw-base');
const controllers = require('hof').controllers;
const ErrorClass = controllers.error;
const lookup = require('../../../lib/evw-lookup');
const logger = require('../../../lib/logger');

module.exports = class EnterYourDetailsController extends EvwBaseController {
  process(req, res, callback) {
    super.process(req, res, () => {
      // reset any previous lookup errors
      req.sessionModel.set('evwLookupError', null);
      let values = lookup.format(req.form.values);

      lookup.find(values.evwNumber, values.dateOfBirth).then((response) => {
        let result = response.body;
        logger.info('application lookup result', response.body);

        if (result.emailAddress) {
          req.sessionModel.set('emailAddress', result.emailAddress);
        } else if (result.error) {
          req.sessionModel.set('evwLookupError', result.error);
        }
        callback();
      }, (err) => {
        logger.error(err);
        callback(err);
      });
    });
  }

  validateField(key, req) {
    if (key === 'evw-number') {
      const defaultValidationErrors = super.validateField(key, req);
      if (defaultValidationErrors) {
        return defaultValidationErrors;
      }
      const err = req.sessionModel.get('evwLookupError');
      if (err === 'CASE_NOT_FOUND' || err === 'INVALID_TOKEN') {
        return new ErrorClass(key, {
          key: key,
          type: 'not-found',
          redirect: undefined
        });
      }
      return false;
    }
    return super.validateField(key, req);
  }
};
