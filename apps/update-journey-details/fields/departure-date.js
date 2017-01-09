'use strict';

module.exports = {
  'departure-date': {
    type: ['date'],
    validate: ['required']
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
  }
};
