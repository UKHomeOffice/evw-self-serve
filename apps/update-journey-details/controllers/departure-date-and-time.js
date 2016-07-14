'use strict';

const EvwBaseController = require('../../common/controllers/evw-base');

module.exports = class EnterYourDetailsController extends EvwBaseController {

  constructor(options) {
    super(options);
    super.applyDatesTimes(options.fields);
  }
}