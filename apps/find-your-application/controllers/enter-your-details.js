'use strict';

const EvwBaseController = require('../../common/controllers/evw-base');
const lookup = require('../../../lib/evw-lookup');
const logger = require('../../../lib/logger');

module.exports = class EnterYourDetailsController extends EvwBaseController {
  process(req, res, callback) {
    let values = lookup.format(req.form.values);

    lookup.find(values.evwNumber, values.dateOfBirth).then((response) => {
      let result = response.body;

      // Application not found
      if (result.error === 'CASE_NOT_FOUND') {
        req.sessionModel.set('caseNotFound', true);
      } else if (result.error === 'CASE_NOT_UPDATABLE') {
        req.sessionModel.set('caseNotUpdatable', true);
      }

      callback();
    },
    (err) => logger.error(err));
  }
}