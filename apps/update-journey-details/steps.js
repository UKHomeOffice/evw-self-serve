'use strict';

let features = require('characteristic')(__dirname + '/../../config/features.yml');

module.exports = {
  '/how-will-you-arrive': {
    template: 'how-will-you-arrive',
    controller: require('./controllers/how-will-you-arrive'),
    fields: [
      'transport-options'
    ],
    next: '/email-us',
    forks: [{
      target: '/flight-number',
      condition: (req) => {
        return features.isEnabled('update_details') && req.form.values['transport-options'] === 'by-plane';
      }
    }]
  },
  '/email-us': {
    template: 'email-us',
    controller: require('./controllers/email-us')
  },
  '/flight-number': {
    template: 'flight-number',
    controller: require('../common/controllers/evw-base'),
    fields: [
      'flight-number'
    ],
    next: '/arrival-date'
  },
  '/arrival-date': {
    template: 'arrival-date',
    controller: require('./controllers/arrival-date'),
    fields: [
      'arrival-date',
      'arrival-date-day',
      'arrival-date-month',
      'arrival-date-year'
    ],
    next: '/is-this-your-flight',
    forks: [{
      target: '/flight-not-found',
      condition: function(req) {
        return req.sessionModel.get('flightDetails') === null;
      }
    }, {
      target: '/choose-departure-airport',
      condition: function(req) {
        return req.sessionModel.get('flightDetails') && req.sessionModel.get('flightDetails').departures.length > 1;
      }
    }],
    options: {
      dateKeys: ['arrival-date']
    }
  },
  '/choose-departure-airport': {
    template: 'choose-departure-airport',
    controller: require('./controllers/choose-departure-airport'),
    fields: [
      'departures'
    ],
    next: '/is-this-your-flight'
  },
  '/is-this-your-flight': {
    template: 'is-this-your-flight',
    controller: require('./controllers/is-this-your-flight'),
    fields: [
      'is-this-your-flight'
    ],
    next: '/departure-date-and-time',
    forks: [{
      target: '/flight-not-found',
      condition: {
        field: 'is-this-your-flight',
        value: 'no'
      }
    }]
  },
  '/departure-date-and-time': {
    template: 'departure-date-and-time',
    controller: require('./controllers/departure-date-and-time'),
    fields: [
      'departure-date',
      'departure-date-day',
      'departure-date-month',
      'departure-date-year',
      'departure-time',
      'departure-time-hours',
      'departure-time-minutes'
    ],
    next: '/uk-departure',
    options: {
      dateKeys: ['departure-date'],
      timeKeys: ['departure-time']
    }
  },
  '/uk-departure': {
    template: 'uk-departure',
    controller: require('../common/controllers/evw-base'),
    fields: [
      'travel-details-changed',
      'uk-duration',
      'uk-departure-travel-number',
      'uk-date-of-departure',
      'uk-date-of-departure-day',
      'uk-date-of-departure-month',
      'uk-date-of-departure-year',
      'uk-port-of-departure'
    ],
    next: '/check-your-answers',
    options: {
      dateKeys: ['uk-date-of-departure']
    }
  },
  '/check-your-answers': {
    template: 'check-your-answers.html',
    controller: require('../common/controllers/evw-base'),
    next: '/declaration'
  },
  '/flight-not-found': {
    template: 'flight-not-found',
    controller: require('./controllers/flight-not-found'),
    next: '/flight-number?retry=true'
  },
  '/declaration': {
    template: 'declaration',
    fields: [
      'accept-declaration'
    ],
    next: '/confirmation'
  },
  '/confirmation': {
    controller: require('./controllers/confirmation'),
    template: 'confirmation'
  }
};
