'use strict';

module.exports = {
  'evw-number': {
    validate: ['required', 'alphanum']
  },
  'dob': {
    validate: ['required', 'date', 'before'],
    legend: 'fields.date-of-birth.legend',
    hint: 'fields.dob.hint'
  },
  'dob-day': {
    label: 'fields.dob-day.label'
  },
  'dob-month': {
    label: 'fields.dob-month.label'
  },
  'dob-year': {
    label: 'fields.dob-year.label'
  }
};
