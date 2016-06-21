'use strict';

module.exports = {
    'evw-number': {
        validate: ['required', 'alphanum']
    },
    'dob': {
        legend: 'fields.date-of-birth.legend',
        hint: 'fields.dob.hint',
        validate: ['format', 'future', 'past']
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
        validate: ['required', 'numeric'],
        label: 'fields.dob-year.label'
    }
};
