'use strict';

const moment = require('moment');
require('moment-timezone');
const EvwBaseController = require('../../common/controllers/evw-base');
const is = require('../../../config').integrationService;
const request = require('request');
const logger = require('../../../lib/logger');
const Validator = require('jsonschema').Validator;
const v = new Validator();
const schema = require('evw-schemas').evw.selfServe.schema;
const authenticate = require('../../../lib/authenticate');


const propMap = (model) => {
  const f = model.flightDetails;
  const getOptionValue = value => typeof value === 'string' ? value.substr(value.indexOf('_') + 1) : '';

  const getDepartureJourneyDetails = () => {
    let departureJourneyProps = {};

    if (model['update-from-uk'] === 'true') {
      departureJourneyProps.departure = {};

      if (!(model['know-departure-details'] === undefined)) {
        Object.assign(departureJourneyProps.departure, {
          knowDepartureDetails: model['know-departure-details']
        });
      }
      if (model['know-departure-details'] === 'No') {
        Object.assign(departureJourneyProps.departure, {
          ukDuration: model['uk-duration']
        });
      }
      if (model['know-departure-details'] === 'Yes') {
        Object.assign(departureJourneyProps.departure, {
          departureTravel: model['uk-departure-travel-number'],
          portOfDeparture: getOptionValue(model['uk-port-of-departure']),
          departureDate: model['uk-date-of-departure']
        });
      }

    }
    return departureJourneyProps;
  };

  const getArrivalJourneyDetails = () => {
    let arrivalJourneyProps = {};

    if (model['update-to-uk'] === 'true') {
      arrivalJourneyProps.arrival = {
        flightDetailsCheck: 'Yes',// hard-coded until we implement un-happy path
        travelBy: 'Plane'
      };

      const departureDateTime = moment.utc(`${f.departureDateRaw} ${f.departureTime}`);

      Object.assign(arrivalJourneyProps.arrival, {
        arrivalTravel: f.flightNumber,
        arrivalDate: f.arrivalDateRaw,
        arrivalTime: f.arrivalTime,
        portOfArrival: f.arrivalAirport,
        portOfArrivalCode: f.portOfArrivalPlaneCode,
        inwardDepartureCountry: f.inwardDepartureCountryPlaneCode,
        inwardDeparturePort: f.departureAirport,
        inwardDeparturePortCode: f.inwardDeparturePortPlaneCode,
        departureForUKDate: departureDateTime.format('YYYY-MM-DD'),
        departureForUKTime: departureDateTime.format('HH:mm')
      });
    }

    return arrivalJourneyProps;
  };

  const getAccommodationDetails = () => {
    let accommodationProps = {};

    if (model['update-accommodation'] === 'true') {
      accommodationProps.accommodation = {
        'ukAddress': [
          model['uk-address-1'],
          model['uk-address-2'],
          model['uk-address-3'],
          model['uk-address-4'],
          model['uk-postcode']
        ],
        'ukVisitPhoneNumber': model['uk-phone']
      };
    }

    return accommodationProps;
  };

  return Object.assign({
    membershipNumber: model['evw-number'],
    token: model.token,
    dateCreated: moment().format('YYYY-MM-DD hh:mm:ss')
  }, getArrivalJourneyDetails(), getDepartureJourneyDetails(), getAccommodationDetails());
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
    authenticate(request, function (auth, authError) {
      if (authError) {
        logger.error('error sending update to integration service', authError);
        return callback(authError);
      }
      request[is.update.method.toLowerCase()]({
        url: [
          is.url,
          is.update.endpoint
        ].join('/'),
        json: propMap(req.sessionModel.attributes),
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: is.timeout,
        auth: auth
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
          emailAddress: body.emailAddress,
          didUpdateToUK: req.sessionModel.attributes['update-to-uk'] === 'true'
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
    });
  }

  locals(req, res) {
    return Object.assign(
      {
        updateNumber: req.context.updateNumber,
        emailAddress: req.context.emailAddress,
        didUpdateToUK: req.context.didUpdateToUK
      },
      super.locals(req, res)
    );
 }
}

module.exports = ConfirmationController;
module.exports.propMap = propMap;
