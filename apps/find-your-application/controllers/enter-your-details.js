'use strict';

const EvwBaseController = require('../../common/controllers/evw-base');
const lookup = require('../../../lib/evw-lookup');
const logger = require('../../../lib/logger');

module.exports = class EnterYourDetailsController extends EvwBaseController {

  constructor(options) {
    super(options);
    super.applyDates(options.fields);
  }

  process(req, res, callback) {
    // reset any previous lookup errors
    req.sessionModel.set('evwLookupError', null);
    let values = lookup.format(req.form.values);

    lookup.find(values.evwNumber, values.dateOfBirth).then((response) => {
      let result = response.body;

      // Application not found / too late
      if (result.error) {
        req.sessionModel.set('evwLookupError', result.error);
      }
      super.process(req, res, callback);
    },
    (err) => logger.error(err));

  }

}