'use strict';

const _ = require('lodash');
const util = require('util');
const controllers = require('hof').controllers;
const BaseController = controllers.base;

const EmailUsController = function EmailUsController() {
  BaseController.apply(this, arguments);
};

util.inherits(EmailUsController, BaseController);

EmailUsController.prototype.locals = function locals(req, res) {
  const mod = req.sessionModel.toJSON()
  // this.transport = mod['transport-options'];
  console.log(req.sessionModel.toJSON());

  return _.extend(
    { transport:mod['transport-options'] },
    BaseController.prototype.locals.call(this, req, res)
  );
};

module.exports = EmailUsController;
