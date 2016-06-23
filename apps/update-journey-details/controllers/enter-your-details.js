'use strict';

const util = require('util');
const DateController = require('hof').controllers.date;

let EnterYourDetailsController = function EnterYourDetailsController() {
  this.dateKey = 'dob';
  DateController.apply(this, arguments);
};

util.inherits(EnterYourDetailsController, DateController);

module.exports = EnterYourDetailsController;