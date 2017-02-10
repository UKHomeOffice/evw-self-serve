'use strict';

const moment = require('moment');
require('moment-timezone');
const EvwBaseController = require('../../common/controllers/evw-base');
const is = require('../../../config').integrationService;
const request = require('request');
const logger = require('../../../lib/logger');
const Validator = require('jsonschema').Validator;
const v = new Validator();
const schema = require('evw-schemas').evw.updateJourney.schema;
const getTypeaheadValue = require('../../../lib/typeahead-options').getTypeaheadValue;
const allAirportsPortsStations = require('../../../lib/typeahead-options').all;

const propMap = (model) => {
  const f = model.flightDetails;
  const departureDateTime = moment.utc(`${f.departureDateRaw} ${f.departureTime}`);

  const getReturnJourneyDetails = () => {
    let returnJourneyProps = {
      haveDepartureFromUkDetailsChanged: model['travel-details-changed']
    };
    if (model['travel-details-changed'] === 'No') {
      return returnJourneyProps;
    }
    Object.assign(returnJourneyProps, {
      knowDepartureDetails: model['know-departure-details']
    });
    if (model['know-departure-details'] === 'No') {
      Object.assign(returnJourneyProps, {
        ukDuration: model['uk-duration']
      });
    }
    if (model['know-departure-details'] === 'Yes') {
      Object.assign(returnJourneyProps, {
        departureTravel: model['uk-departure-travel-number'],
        portOfDeparture: getTypeaheadValue(model['uk-port-of-departure'], allAirportsPortsStations),
        departureDate: model['uk-date-of-departure']
      });
    }
   return returnJourneyProps;
  };

  return Object.assign({
    membershipNumber: model['evw-number'],
    token: model.token,
    arrivalTravel: f.flightNumber,
    arrivalDate: f.arrivalDateRaw,
    arrivalTime: f.arrivalTime,
    departureForUKDate: departureDateTime.format('YYYY-MM-DD'),
    departureForUKTime: departureDateTime.format('HH:mm'),
    portOfArrival: f.arrivalAirport,
    portOfArrivalCode: f.portOfArrivalPlaneCode,
    inwardDepartureCountry: f.inwardDepartureCountryPlaneCode,
    inwardDeparturePort: f.departureAirport,
    inwardDeparturePortCode: f.inwardDeparturePortPlaneCode,
    dateCreated: moment().format('YYYY-MM-DD hh:mm:ss'),
    flightDetailsCheck: 'Yes' // hard-coded until we implement un-happy path
  }, getReturnJourneyDetails());
};

class ConfirmationController extends EvwBaseController {
  getValues(req, res, callback) {

    const transformData = ConfirmationController.propMap(req.sessionModel.attributes);
    logger.info('schema validating', transformData);

    const result = v.validate(transformData, schema);
    if (!result.valid) {
      logger.error('error schema validating update', transformData.membershipNumber, result);
      return callback(result);
    }

    logger.info('sending update', transformData);

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
        logger.error('error sending update to integration service', err);
        return callback(err);
      }

      if (body.error) {
        logger.error('body error sending update to integration service', body.error || err);
        return callback(body.error);
        /* eslint no-warning-comments: 1*/
        // TODO change to an error page
      }

      req.context = {
        updateNumber: body.membershipNumber,
        emailAddress: body.currentDetails.contactDetails.emailAddress
      };

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
