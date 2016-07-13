'use strict';

const util = require('util');
const controllers = require('hof').controllers;
const BaseController = controllers.base;
const ErrorClass = require('hof').controllers.error;
const validateLib = require('validate.js');
const logger = require('../../../lib/logger');
const options = {
  fullMessages: false,
};

let EvwBaseController = function EvwBaseController() {
  BaseController.apply(this, arguments);
};

util.inherits(EvwBaseController, BaseController);

let formatValue = (formValues, keyToValidate) => {
  if (keyToValidate.indexOf('date') > -1) {
    return `${formValues[keyToValidate + '-year']}-${formValues[keyToValidate + '-month']}-${formValues[keyToValidate + '-day']}`;
  }

  if (keyToValidate.indexOf('time') > -1) {
    return `${formValues[keyToValidate + '-hours']}:${formValues[keyToValidate + '-minutes']}`;
  }

  return formValues[keyToValidate];
};

EvwBaseController.prototype.validateField = function validateField(keyToValidate, req, custom) {
  if(custom) {
    console.log('custom');
    return new ErrorClass('evw-number', {
      type: 'wrong'
    });
  };
  console.log(keyToValidate, 'validating');
  try {
    let fieldValue = formatValue(req.form.values, keyToValidate);
    let rules = require(`../../../validation/${keyToValidate}`).rules(fieldValue, req.sessionModel);

    req.sessionModel.set(keyToValidate, fieldValue);

    let field = {};
    field[keyToValidate] = fieldValue;

    let schema = {};
    schema[keyToValidate] = rules;

    let validationErrors = validateLib.validate(field, schema, options);

    if (validationErrors !== undefined) {
      return new ErrorClass(keyToValidate, {
        type: validationErrors[keyToValidate]
      });
    }
  } catch (e) {
    logger.info(`No validation rules found for ${keyToValidate}`);
  }
};

module.exports = EvwBaseController;
