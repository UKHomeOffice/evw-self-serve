'use strict';

const path = require('path');
const hof = require('hof');
const i18n = hof.i18n({
  path: path.resolve(__dirname, '../../common/translations/__lng__/__ns__.json')
});
const EvwBaseController = require('../../common/controllers/evw-base');
const request = require('request');
const is = require('../../../config').integrationService;
const logger = require('../../../lib/logger');
const authenticate = require('../../../lib/authenticate');
const ValidationError = require('hof').controllers.error;

const fourOhfourIt = (res) => {
  return res.status(404).render('404', {
    title: i18n.translate('errors.404.title'),
    description: i18n.translate('errors.404.description')
  });
}


module.exports = class SelectDetailsController extends EvwBaseController {
  checkValidated(req, res, callback) {
    let valid = req.sessionModel.get('validated');
    if(valid) {
      callback();
    } else {
      this.validateApp(req,res,callback);
    }
  }

  validateApp(req, res, callback) {
    let evwNumber = req.query.evwNumber;
    let token = (req.query.token || '').replace('?hof-cookie-check', '');

    if(!evwNumber || !token) {
      return fourOhfourIt(res);
    }

    authenticate(request, function (auth, authError) {
      if (authError) {
        logger.info('error sending update to integration service', authError);
        return;
      }
      request[is.evwDetails.method.toLowerCase()]({
        url: [
          is.url,
          is.evwDetails.endpoint,
          evwNumber,
          token
        ].join('/'),
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: is.timeout,
        auth: auth
      }, function (err, response, body) {
        let parsed;

        if (err) {
          logger.error('error verifying application', err);
          return callback(err);
        }

        try {
          parsed = JSON.parse(body);
        } catch (e) {
          parsed = body;
          logger.info('could not parse body, attempting without json parse', body);
        }


        // 404 it in lieu of a more specific error page
        if (parsed.error) {
          req.sessionModel.reset();
          logger.error('error verifying application', parsed.error);
          return fourOhfourIt(res);
          /* eslint no-warning-comments: 1*/
          // TODO change to a invalid page
        }
        let startLink = req.path.replace(/^\/([^\/]*).*$/, '$1') + `?evwNumber=${evwNumber}&token=${token}`;
        logger.info('setting startLink', startLink);
        req.sessionModel.set('startLink', startLink);
        req.sessionModel.set('validated', true);
        req.sessionModel.set('evw-number', evwNumber);
        req.sessionModel.set('token', token);

        req.sessionModel.set('evw-details', parsed);

        return callback();
      });
    });
  }

  getValues(req, res, callback) {
    return this.checkValidated(req, res, callback);
  }

  locals(req, res) {
    const evwDetails = req.sessionModel.get('evw-details');

    var locals = {
                'evwNumber': req.sessionModel.get('evw-number'),
                  'evwName': evwDetails['name'],
          'toUKArrivalPort': evwDetails.arrival.portOfArrival.split(',')[0],
      'fromUKDeparturePort': evwDetails.departure.portOfDeparture,
             'tripDuration': evwDetails.departure.ukDuration,
            'accommodation': evwDetails.accommodation.ukAddress.join(', '),
                  'ukPhone': evwDetails.accommodation.ukVisitPhoneNumber
    };

    if (evwDetails.arrival.travelBy !== 'Land') {
      locals.toUKDeparturePort = evwDetails.arrival.inwardDeparturePort.split(',')[0];
    }

    return Object.assign(locals, super.locals.call(this, req, res));
  }

  validate(req, res, callback) {
    // If no options are selected, return a validation error to be displayed on the parent fieldset
    if (
         req.form.values['update-to-uk']   === ''
      && req.form.values['update-from-uk'] === ''
      && req.form.values['update-accommodation'] === ''
    ) {

      const validationError = new ValidationError(
        'select-details',
        {
          type: 'none-selected'
        },
        req
      );

      callback({
        'select-details': validationError
      });
    }
    else {
      return super.validate(req, res, callback);
    }
  }
}
