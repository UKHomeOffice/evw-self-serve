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
    controller: require('./controllers/flight-number'),
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
    }],
    options: {
      dateKeys: ['departure-date']
    }
  },
  '/is-this-your-flight': {
    template: 'is-this-your-flight',
    controller: require('./controllers/is-this-your-flight'),
    fields: [
      'is-this-your-flight'
    ],
    next: '/return-travel',
    forks: [{
      target: '/flight-not-found',
      condition: {
        field: 'is-this-your-flight',
        value: 'no'
      }
    }]
  },
  '/return-travel': {
    template: 'return-travel',
    controller: require('../common/controllers/evw-base'),
    fields: [
      'travel-details-changed'
    ],
    next: '/check-your-answers',
    forks: [{
      target: '/uk-departure',
      condition: {
        field: 'travel-details-changed',
        value: 'Yes'
      }
    }]
  },
  '/uk-departure': {
    template: 'uk-departure',
    controller: require('../common/controllers/evw-base'),
    fields: [
      'know-departure-details',
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
    controller: require('./controllers/check-your-answers'),
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
