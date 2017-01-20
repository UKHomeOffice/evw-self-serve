'use strict';

const moment = require('moment');
const afterDate = require('../../../lib/validators').afterDate;

module.exports = {
  'arrival-date': {
    validate: ['required', 'date', {
      type: 'after',
      arguments: moment().add(1, 'day').format('YYYY-MM-DD')
    }],
    validators: [{
      type: afterDate,
      arguments: moment().add(3, 'months').format('YYYY-MM-DD')
    }]
  },
  'arrival-date-day': {
    label: 'fields.arrival-date-day.label'
  },
  'arrival-date-month': {
    label: 'fields.arrival-date-month.label'
  },
  'arrival-date-year': {
    label: 'fields.arrival-date-year.label'
  }
};
