'use strict';

const util = require('util');
const controllers = require('hof').controllers;
// const BaseController = controllers.base;
const DateController = controllers.date;
const ErrorClass = require('hof').controllers.error;
const validateLib = require('validate.js');
const logger = require('../../../lib/logger');
const options = {
  fullMessages: false,
};

let EvwBaseController = function EvwBaseController() {
  // this.dateKey = 'dob';
  DateController.apply(this, arguments);
};

util.inherits(EvwBaseController, DateController);

EvwBaseController.prototype.applyDates = function firstDates(fields) {
  console.log('got these fields', fields)
  Object.keys(fields).forEach((key) => {
    if(key.match(/dob$|date$/gi) ) {
      this.dateKey = key;
    };
  });
  console.log('set dateKey to', this.dateKey);
}

// Format date/time
let formatValue = (formValues, key) => {
  // if (key.indexOf('date') > -1) {

  if(key.match(/dob|date/gi) ) {
    return `${formValues[key + '-year']}-${formValues[key + '-month']}-${formValues[key + '-day']}`;
  }

  if (key.indexOf('time') > -1) {
    return `${formValues[key + '-hours']}:${formValues[key + '-minutes']}`;
  }

  return formValues[key];
};

EvwBaseController.prototype.validateField = function validateField(keyToValidate, req) {
  try {
    let fieldValue = formatValue(req.form.values, keyToValidate);
    let rules = require(`../../../validation/${keyToValidate}`).rules(fieldValue, req.sessionModel);

    req.sessionModel.set(keyToValidate, fieldValue);

    let field = {};
    field[keyToValidate] = fieldValue;

    let schema = {};
    schema[keyToValidate] = rules;

    let validationErrors = validateLib.validate(field, schema, options);

    // found custom rules
    if (validationErrors !== undefined) {
      return new ErrorClass(keyToValidate, {
        type: validationErrors[keyToValidate]
      });
    }
    // 'normal' validators
    // TODO is this needed here?
    // return DateController.prototype.validateField.apply(this, arguments);
  } catch (e) {
    return DateController.prototype.validateField.apply(this, arguments);
    console.log(this);
    logger.info(`No validation rules found for ${keyToValidate}`);
  }
};

module.exports = EvwBaseController;
