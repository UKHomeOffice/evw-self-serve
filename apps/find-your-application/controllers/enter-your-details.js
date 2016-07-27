'use strict';

const EvwBaseController = require('../../common/controllers/evw-base');
const lookup = require('../../../lib/evw-lookup');
const logger = require('../../../lib/logger');

module.exports = class EnterYourDetailsController extends EvwBaseController {

  constructor(options) {
    super(options);
    super.applyDatesTimes(options.fields);
  }

  process(req, res, callback) {
    super.process(req, res, () => {
      // reset any previous lookup errors
      req.sessionModel.set('evwLookupError', null);
      let values = lookup.format(req.form.values);

      lookup.find(values.evwNumber, values.dateOfBirth).then((response) => {
        let result = response.body;
        logger.info('application lookup result', response.body);

        if (result.emailAddress) { // Lookup successful
          req.sessionModel.set('emailAddress', result.emailAddress);
        } else if (result.error) { // Application not found / too late
          req.sessionModel.set('evwLookupError', result.error);
        }
        callback();
      }, (err) => {
        logger.error(err);
        callback(err);
      });
    });
  }
}
