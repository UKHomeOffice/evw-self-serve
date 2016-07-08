'use strict';

const util = require('util');
const EvwBaseController = require('../../common/controllers/evw-base');
const flightLookup = require('../../../lib/flight-lookup');

const ArrivalDateController = function ArrivalDateController() {
  EvwBaseController.apply(this, arguments);
};

util.inherits(ArrivalDateController, EvwBaseController);

ArrivalDateController.prototype.saveValues = function saveValues(req, res, callback) {
    let lookupData = flightLookup.formatPost({
        flightNumber: req.sessionModel.get('flight-number'),
        arrivalDateDay: req.form.values['arrival-date-day'],
        arrivalDateMonth: req.form.values['arrival-date-month'],
        arrivalDateYear: req.form.values['arrival-date-year']
    });

    flightLookup.findFlight(lookupData.number, lookupData.date).then(function (foundData) {
        let flight = foundData.body.flights[0];

        // Flight found
        if (typeof flight !== 'undefined') {
            let mappedFlight = flightLookup.mapFlight(flight, req.sessionModel);
            req.sessionModel.set('flightDetails', mappedFlight);
        }

        // Flight not found, page gets set in steps.js

        callback();
    });
};

module.exports = ArrivalDateController;
