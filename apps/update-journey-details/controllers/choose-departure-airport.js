'use strict';

const path = require('path');
const EvwBaseController = require('../../common/controllers/evw-base');
const hof = require('hof');
const i18n = hof.i18n({
  path: path.resolve(__dirname, '../../update-journey-details/translations/__lng__/__ns__.json')
});

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
    let legend = i18n.translate('fields.departures.preLegend');

    legend = `${legend} ${flight.flightNumber}`; // => e.g. 'Please select where you are boarding flight BA0072'

    let deps = Object.assign(res.locals.options.fields.departures, {
      options: departures
    });

    let ret = Object.assign({
      legend: legend,
      departures: deps
    }, super.locals.call(this, req, res));

    return ret;
  }

};