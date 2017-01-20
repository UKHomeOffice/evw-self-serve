'use strict';

const EvwBaseController = require('../../common/controllers/evw-base');

module.exports = class CheckYourAnswersController extends EvwBaseController {
  locals(req, res) {
    return Object.assign({
      knowDepartureDetailsYes: req.sessionModel.get('know-departure-details') === 'Yes',
      knowDepartureDetailsNo: req.sessionModel.get('know-departure-details') === 'No'
    }, super.locals.call(this, req, res));
  }
};
