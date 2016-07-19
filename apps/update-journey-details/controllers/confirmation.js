'use strict';

const EvwBaseController = require('../../common/controllers/evw-base');
const is = require('../../../config').integrationService;
const request = require('request');
const logger = require('../../../lib/logger');

const propMap = (model) => {
  let f = model.flightDetails;

  return {
    membershipNumber: model['evw-number'],
    token: model.token,
    arrivalTravel: f.flightNumber,
    arrivalDate: model['arrival-date'].split('-').reverse().join('-'),
    arrivalTime: f.arrivalTime,
    departureForUKDate: model['departure-date'].split('-').reverse().join('-'),
    departureForUKTime: model['departure-time'],
    portOfArrival: f.arrivalAirport,
    portOfArrivalCode: f.portOfArrivalPlaneCode,
    inwardDepartureCountry: f.inwardDepartureCountryPlaneCode,
    inwardDeparturePort: f.departureAirport,
    inwardDeparturePortCode: f.inwardDeparturePortPlaneCode
  }
};

class ConfirmationController extends EvwBaseController {
  constructor(options) {
    super(options);
  }

  getValues(req, res, callback) {

    logger.info('sending update', propMap(req.sessionModel.attributes));

    request[is.update.method.toLowerCase()]({
      url: [
          is.url,
          is.update.endpoint
      ].join('/'),
      json: propMap(req.sessionModel.attributes),
      headers: {
          'Content-Type': 'application/json'
      },
      timeout: is.timeout
    }, function (err, response, body) {

      if (err) {
        req.sessionModel.reset();
        logger.error('error sending update to integration service', err);
        return callback(err);
      }

      if (body.error) {
        req.sessionModel.reset();
        logger.error('error sending update to integration service', body.error);
        return callback(body.error);
        /* eslint no-warning-comments: 1*/
        // TODO change to an error page
      }

      req.context = {
        updateNumber: body.membershipNumber,
        emailAddress: body.currentDetails.contactDetails.emailAddress
      }

      logger.info('application sent to integration service', body);

      // Manually reset the session.
      // This should be handled by the super.getValues function,
      // but due to a race condition it is possible the response
      // is sent before the session is reset.
      // When https://github.com/UKHomeOffice/hof-controllers/pull/72
      // is merged and released in a version of hof this can be removed.
      req.sessionModel.reset();

      return callback();
    });

  }

  locals(req, res) {
    return Object.assign(
      {
        updateNumber: req.context.updateNumber,
        emailAddress: req.context.emailAddress
      },
      super.locals(req, res)
    );
 }
}

module.exports = ConfirmationController;
module.exports.propMap = propMap;
