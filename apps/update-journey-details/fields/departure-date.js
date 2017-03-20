'use strict';

const afterDate = require('../../../lib/validators').afterDate;
const beforeDate = require('../../../lib/validators').beforeDate;
const moment = require('moment');

module.exports = {
  'departure-date': {
    validate: ['required', 'date'],
    validators: [{
      type: beforeDate,
      arguments: () => moment().add(48, 'hours').format('YYYY-MM-DD')
    }, {
      type: afterDate,
      arguments: () => moment().add(3, 'months').format('YYYY-MM-DD')
    }]
  },
  'departure-date-day': {
    label: 'fields.departure-date-day.label'
  },
  'departure-date-month': {
    label: 'fields.departure-date-month.label'
  },
  'departure-date-year': {
    label: 'fields.departure-date-year.label'
  }
};
