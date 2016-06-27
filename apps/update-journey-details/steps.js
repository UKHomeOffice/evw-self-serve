'use strict';

module.exports = {
  '/': {
    controller: require('../common/controllers/start'),
    next: '/how-will-you-arrive'
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
    controller: require('./controllers/email-us'),
    clearSession: false
  },
  '/enter-your-details': {
    template: 'enter-your-details',
    controller: require('./controllers/enter-your-details'),
    fields: [
      'dob',
      'dob-day',
      'dob-month',
      'dob-year',
      'evw-number'
    ],
    next: '/link-sent'
  },
  '/link-sent': {
    template: 'link-sent'
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
    // Commented out until validation is sorted
    // controller: require('./controllers/arrival-date'),
    fields: [
      'arrival-date'
    ],
    next: '/is-this-your-flight',
    clearSession: false
  },
  '/is-this-your-flight': {
    template: 'is-this-your-flight',
    controller: require('./controllers/is-this-your-flight'),
    fields: [
      'is-this-your-flight'
    ],
    next: '/flight-not-found',
    // Commented out because having this prevents us from entering the form on the /flight-details page
    // It will need to be added back in
    // forks: [{
    //   target: '/flight-number',
    //   condition: {
    //     field: 'is-this-your-flight',
    //     value: 'no'
    //   }
    // }],
    next: '/check-your-answers',
  },
  '/check-your-answers': {
    template: 'check-your-answers.html',
    backLink: false,
    clearSession: true
  '/flight-not-found': {
    template: 'flight-not-found'
  }
};
