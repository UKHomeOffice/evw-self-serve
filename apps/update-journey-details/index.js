'use strict';

var hof = require('hof');
var wizard = hof.wizard;
var mixins = hof.mixins;
var i18nFuture = hof.i18n;
var router = require('express').Router();
var path = require('path');
var _ = require('underscore');
var controllers = require('hof').controllers;
const formatting = require('../../lib/formatting');
var BaseController = controllers.base;

var fields = _.extend({}, require('../common/fields/'), require('./fields/'));
var i18n = i18nFuture({
  path: path.resolve(__dirname, './translations/__lng__/__ns__.json')
});

router.use((req, res, next) => {
  res.locals.dateHint = () => (txt) => formatting.dateHint(txt);
  next();
});

router.use(mixins(fields, {
  translate: i18n.translate.bind(i18n)
}));

router.use((req, res, next) => {
  req.fields = fields;
  next();
});

// Redirect users from a permanent initial URL, to our actual first Home Office Forms step
// /update-journey-details/how-will-you-arrive is a temporary redirect in case the user follows an old e-mail link. Once we've deployed an updated evw-domain-lib, with e-mails pointing to /update-journey-details/start, we can delete that URL, and just leave /update-journey-details/start
router.use([
    '/update-journey-details/start',
    '/update-journey-details/how-will-you-arrive'
  ], function (req, res, next) {
    let evwNumber = req.query.evwNumber;
    let token = (req.query.token || '').replace('?hof-cookie-check', '');

    if(evwNumber && token) {
      return res.redirect(`/update-journey-details/select-details?evwNumber=${evwNumber}&token=${token}`);
    }

    next();
});

router.use('/update-journey-details/', wizard(require('./steps'), fields, {
  controller: BaseController,
  templatePath: path.resolve(__dirname, 'views'),
  translate: i18n.translate.bind(i18n)
}));

module.exports = router;
