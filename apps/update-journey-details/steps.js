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
    next: '/departure-date'
  },
  '/departure-date': {
    template: 'departure-date',
    controller: require('./controllers/departure-date'),
    fields: [
      'departure-date',
      'departure-date-day',
      'departure-date-month',
      'departure-date-year'
    ],
    next: '/is-this-your-flight',
    forks: [{
      target: '/flight-not-found',
      condition: function(req) {
        return req.sessionModel.get('flightDetails') === null;
      }
    }]
  },
  '/is-this-your-flight': {
    template: 'is-this-your-flight',
    controller: require('./controllers/is-this-your-flight'),
    fields: [
      'is-this-your-flight'
    ],
    next: '/check-your-answers',
    forks: [{
      target: '/flight-not-found',
      condition: {
        field: 'is-this-your-flight',
        value: 'no'
      }
    }]
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
