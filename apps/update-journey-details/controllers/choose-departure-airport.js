'use strict';

const EvwBaseController = require('../../common/controllers/evw-base');

module.exports = class ChooseDepartureAirportController extends EvwBaseController {

  process(req, res, callback) {
    super.process(req, res, () => {
      let flight = req.sessionModel.get('flightDetails');
      let choice = req.form.values.departures;
      let update = flight.departures.find((i) => i.inwardDeparturePortPlaneCode === choice);
      let mapped = Object.assign(flight, update);
      req.sessionModel.set('flightDetails', mapped);
      callback();
    });
  }

  locals(req, res) {
    let flight = req.sessionModel.get('flightDetails');
    let departures = flight.departures.map((item) => {
      return {
        value: item.inwardDeparturePortPlaneCode,
        label: item.departureAirport
      };
    });

    let deps = Object.assign(res.locals.options.fields.departures, {
      options: departures
    });

    let ret = Object.assign({
      flightNumber: flight.flightNumber,
      departures: deps
    }, super.locals.call(this, req, res));

    return ret;
  }

};