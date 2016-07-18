'use strict';

const path = require('path');
const hof = require('hof');
const i18n = hof.i18n({
  path: path.resolve(__dirname, '../../common/translations/__lng__/__ns__.json')
});
const EvwBaseController = require('../../common/controllers/evw-base');
const request = require('request');
const is = require('../../../config').integrationService;

const fourOhfourIt = (res) => {
  return res.status(404).render('404', {
    title: i18n.translate('errors.404.title'),
    description: i18n.translate('errors.404.description')
  });
}

const checkValidated = (req, res, callback) => {
  let valid = req.sessionModel.get('validated');
  if(valid) {
    callback();
  } else {
    validateApp(req,res,callback);
  }
};

const validateApp = (req, res, callback) => {
  let evwNumber = req.query.evwNumber;
  let token = req.query.token;

  if(!evwNumber || !token) {
    return fourOhfourIt(res);
  }

  request[is.check.method.toLowerCase()]({
    url: [
        is.url,
        is.check.endpoint,
        evwNumber,
        token
    ].join('/'),
    headers: {
        'Content-Type': 'application/json'
    },
    timeout: is.timeout
  }, function (err, response, body) {
    var json = JSON.parse(body);

    // 404 it in lieu of a more specific error page
    if (json.error) {
      req.sessionModel.reset();
      return fourOhfourIt(res);
      /* eslint no-warning-comments: 1*/
      // TODO change to a invalid page
    }

    req.sessionModel.set('validated', true);
    req.sessionModel.set('evw-number', evwNumber);
    req.sessionModel.set('token', token);
    return callback();
  });
}

module.exports = class HowWillYouArriveController extends EvwBaseController {
  getValues(req, res, callback) {
    return checkValidated(req, res, callback);
  }
}