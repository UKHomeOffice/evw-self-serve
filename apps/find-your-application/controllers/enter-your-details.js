'use strict';

const util = require('util');
const EvwBaseController = require('../../common/controllers/evw-base');
const lookup = require('../../../lib/evw-lookup');
const logger = require('../../../lib/logger');

let EnterYourDetailsController = function EnterYourDetailsController() {
  EvwBaseController.apply(this, arguments);
};

util.inherits(EnterYourDetailsController, EvwBaseController);

// const handleError = (error, req) => {

//   // too late
//   if (error === 'CASE_NOT_UPDATABLE') {
//     req.sessionModel.set('caseUpdateable', false);
//   } else {


// }

EnterYourDetailsController.prototype.saveValues = function saveValues(req, res, callback) {
  console.log('do u even get errs❌');
  let values = lookup.format(req.form.values);

  lookup.find(values.evwNumber, values.dateOfBirth).then( (response) => {
    let result = response.body;

    // Application found
    if (result.success) {
      req.sessionModel.set('caseUpdateable', true);
    }

    // Application not found
    if (result.error) {
      console.log('result.error', result.error);
      EnterYourDetailsController.prototype.validateField.call(this, 'rubbish', req, true);
    }

    callback();
  }, (err) => logger.error(err));

  // return Object.assign(
  //   BaseController.prototype.locals.call(this, req, res)
  // );
}

module.exports = EnterYourDetailsController;