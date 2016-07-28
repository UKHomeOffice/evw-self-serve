'use strict';

module.exports = {
  'evw-number': {
    validate: ['required', 'alphanum']
  },
  'dob': {
    validate: ['future'],
    type: [ 'date' ],
    legend: 'fields.date-of-birth.legend',
    hint: 'fields.dob.hint'
  },
  'dob-day': {
    validate: ['required', 'numeric'],
    label: 'fields.dob-day.label'
  },
  'dob-month': {
    validate: ['required', 'numeric'],
    label: 'fields.dob-month.label'
  },
  'dob-year': {
    validate: ['required', 'numeric', 'date-year'],
    label: 'fields.dob-year.label'
  }
};
