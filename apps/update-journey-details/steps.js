'use strict';

module.exports = {
  '/select-details': {
    template: 'select-details',
    controller: require('./controllers/select-details'),
    fields: [
      'select-details',
      'update-to-uk',
      'update-from-uk',
      'update-accommodation',
      'uk-phone'
    ],
    forks: [{
      target: '/visit-information',
      condition: {
        field: 'update-accommodation',
        value: 'true'
      }
    },
    {
      target: '/uk-departure',
      condition: {
        field: 'update-from-uk',
        value: 'true'
      }
    },
    {
      target: '/how-will-you-arrive',
      condition: {
        field: 'update-to-uk',
        value: 'true'
      }
    }]
  },
  '/how-will-you-arrive': {
    template: 'how-will-you-arrive',
    fields: [
      'transport-options'
    ],
    next: '/email-us',
    forks: [{
      target: '/flight-number',
      condition: {
        field: 'transport-options',
        value: 'by-plane'
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
    next: '/check-your-answers',
    forks: [{
      target: '/visit-information',
      condition: function (req) {
        return req.sessionModel.get('update-accommodation');
      }
    },
    {
      target: '/uk-departure',
      condition: function (req) {
        return req.sessionModel.get('update-from-uk');
      }
    },
    {
      target: '/flight-not-found',
      condition: {
        field: 'is-this-your-flight',
        value: 'no'
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
    forks: [{
      target: '/visit-information',
      condition: function (req) {
        return req.sessionModel.get('update-accommodation');
      }
    }],
    options: {
      dateKeys: ['uk-date-of-departure']
    }
  },
  '/visit-information': {
    template: 'visit-information',
    controller: require('../common/controllers/evw-base'),
    fields: [
      'uk-address-1',
      'uk-address-2',
      'uk-address-3',
      'uk-address-4',
      'uk-postcode'
    ],
    next: '/check-your-answers'
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
