'use strict';


const controllers = require('hof').controllers;
const DateController = controllers.date;
const ErrorClass = require('hof').controllers.error;
const validateLib = require('validate.js');
const logger = require('../../../lib/logger');
const formatting = require('../../../lib/formatting');
const validationRules = require('evw-validation-rules')['evw-self-serve'];

module.exports = class EvwBaseController extends DateController {

  constructor(options) {
    super(options);
    this.applyDatesTimes(options.fields);
  }

  getNextStep (req, res) {
    this.confirmStep = '/check-your-answers';
    return super.getNextStep(req, res);
  }

  process(req, res, callback) {
    return super.process(req, res, function processTime() {
      if(this.timeKey) {
        req.form.values[this.timeKey] = formatting.getTime(req.form.values, this.timeKey);
      }
      callback();
    }.bind(this));
  }

  applyDatesTimes(fields) {
    Object.keys(fields).forEach((key) => {
      let type = fields[key].type;
      if(type && type.indexOf('date') > -1) {
        this.dateKey = key;
      };
      if(type && type.indexOf('time') > -1) {
        this.timeKey = key;
      };
    });
  }

  validateField(key, req) {

    if(validationRules.hasOwnProperty(key)) {

      let value = formatting.setDateTimes(req.form.values, key);
      let rules = validationRules[key](value, req.sessionModel);

      req.sessionModel.set(key, value);

      let field = {};
      field[key] = value;

      let schema = {};
      schema[key] = rules;

      let validationErrors = validateLib.validate(field, schema, {
        fullMessages: false,
      });

      // found custom rules, got an error
      if (validationErrors !== undefined) {
        return new ErrorClass(key, {
          type: validationErrors[key]
        });
      }
    } else {
      logger.info(`No custom validation rules found for ${key}`);
    }

    return super.validateField(key, req);

  };
}

