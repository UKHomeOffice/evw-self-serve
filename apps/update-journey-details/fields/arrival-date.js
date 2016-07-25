'use strict';

module.exports = {
  'arrival-date': {
    type: ['date'],
    validate: [] // blank because dates are being 'future' validated by default
  },
  'arrival-date-day': {
      validate: ['required', 'numeric'],
      label: 'fields.arrival-date-day.label'
  },
  'arrival-date-month': {
      validate: ['required', 'numeric'],
      label: 'fields.arrival-date-month.label'
  },
  'arrival-date-year': {
      validate: ['required', 'numeric'],
      label: 'fields.arrival-date-year.label'
  }
};
