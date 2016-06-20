'use strict';

const util = require('util');
const controllers = require('hof').controllers;
const DateController = controllers.date;

let EnterYourDetailsController = function EnterYourDetailsController() {
  this.dateKey = 'dob';
  DateController.apply(this, arguments);
};

util.inherits(EnterYourDetailsController, DateController);

/*
 * The validateField method can be overidden in the following way to
 * always allow date to be omitted, regardless of settings in fields directory
 */
// FirstPageController.prototype.validateField = function validateField(keyToValidate, req) {
//   return DateController.prototype.validateField.call(this, keyToValidate, req, false);
// };

module.exports = EnterYourDetailsController;