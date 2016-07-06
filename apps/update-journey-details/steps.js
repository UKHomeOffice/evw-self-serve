'use strict';

let features = require('characteristic')(__dirname + '/../../config/features.yml');

module.exports = {
  '/': {
    controller: require('../common/controllers/start'),
    next: '/how-will-you-arrive',
    forks: [{
        target: '/flight-number',
        condition: () => features.isEnabled('update_details')
      }]
  },
  '/how-will-you-arrive': {
    template: 'how-will-you-arrive',
    fields: [
      'transport-options'
    ],
    next: '/email-us'
  },
  '/email-us': {
    template: 'email-us',
    controller: require('./controllers/email-us')
  },
  '/flight-number': {
    template: 'flight-number',
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
        return typeof req.sessionModel.get('flightDetails') === 'undefined';
      }
    }]
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
    fields: [
      'departure-date',
      'departure-time'
    ],
    next: '/check-your-answers'
  },
  '/check-your-answers': {
    template: 'check-your-answers.html',
    next: '/declaration'
  },
  '/flight-not-found': {
    template: 'flight-not-found'
  },
  '/declaration': {
    template: 'declaration',
    fields: [
      'accept-declaration'
    ],
    next: '/next-page',
    clearSession: true
  }
};
