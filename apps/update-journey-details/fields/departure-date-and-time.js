'use strict';

module.exports = {
  'departure-date': {
    type: [ 'date' ],
    validate: [] // blanked out validation because 'future was being applied for some wtf reason'
  },
  'departure-date-day': {
    validate: ['required', 'numeric'],
    label: 'fields.departure-date-day.label'
  },
  'departure-date-month': {
    validate: ['required', 'numeric'],
    label: 'fields.departure-date-month.label'
  },
  'departure-date-year': {
    validate: ['required', 'numeric'],
    label: 'fields.departure-date-year.label'
  },
  'departure-time': {
    validate: [ 'required' ],
    type: [ 'time' ]
  },
  'departure-time-hours': {
    validate: ['required', 'numeric'],
    label: 'fields.departure-time-hours.label'
  },
  'departure-time-minutes': {
    validate: ['required', 'numeric'],
    label: 'fields.departure-time-minutes.label'
  }
};
