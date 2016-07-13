'use strict';

const util = require('util');
const controllers = require('hof').controllers;
const DateController = controllers.date;
const ErrorClass = require('hof').controllers.error;
const validateLib = require('validate.js');
const logger = require('../../../lib/logger');
const options = {
  fullMessages: false,
};

let EvwBaseController = function EvwBaseController() {
  DateController.apply(this, arguments);
};

util.inherits(EvwBaseController, DateController);

EvwBaseController.prototype.applyDates = function firstDates(fields) {
  Object.keys(fields).forEach((key) => {
    let type = fields[key].type;
    if(type && type.indexOf('date') > -1) {
      this.dateKey = key;
    };
  });
}

// Format date/time
let formatValue = (formValues, key) => {
  if(key.match(/dob$|date$/gi) ) {
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
    return DateController.prototype.validateField.apply(this, arguments);
  } catch (e) {
    return DateController.prototype.validateField.apply(this, arguments);
    logger.info(`No validation rules found for ${keyToValidate}`);
  }
};

module.exports = EvwBaseController;
