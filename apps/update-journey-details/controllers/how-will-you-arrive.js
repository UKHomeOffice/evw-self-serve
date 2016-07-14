'use strict';

const path = require('path');
const hof = require('hof');
const i18n = hof.i18n({
  path: path.resolve(__dirname, '../../common/translations/__lng__/__ns__.json')
});
const EvwBaseController = require('../../common/controllers/evw-base');

module.exports = class HowWillYouArriveController extends EvwBaseController {
  getValues(req, res, callback) {
    if (req.params.action && req.params.token) {
      req.sessionModel.set('evw-number', req.params.action);
      req.sessionModel.set('token', req.params.token);
      return callback();
    }

    return res.status(404).render('404', {
      title: i18n.translate('errors.404.title'),
      description: i18n.translate('errors.404.description')
    });
  }
}
