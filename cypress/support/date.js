// ***********************************************
// Date utilities
// ***********************************************
const moment = require('moment');
const _ = require('lodash');
const rgLastSection = /\-([a-z]*)$/;

cy.setApplicantDates = function(applicant) {
	cy.log(applicant.yearsToPassportExpiry);
	_.extend(applicant, {
		'passportExpiry': moment().add(applicant.yearsToPassportExpiry || 0,'years'),
		'passportIssue': moment().subtract(applicant.passportIssuedYears || 0, 'years'),
		'dateOfBirth': moment().subtract(applicant.age || 0, 'years'),
		'departureDate': moment().add(applicant.daysToDeparture || 1, 'days'),
		'arrivalDate': moment().add(applicant.daysToArrival || 1, 'days')
	});
	applicant.dateOfBirth = moment().subtract(applicant.age || 0, 'years').format('YYYY-MM-DDThh:mm:ss')
	cy.log(applicant.dateOfBirth);
}

Cypress.Commands.add('populateDateGroup' ,{ prevSubject: 'element'}, (subject, date) => {
	const d = moment(date).format("DD-MM-YYYY").split('-');
	var fields = subject.find('input');
	fields.each(function() {
		//var nameRes = rgLastSection.exec(this.name);
		cy.get('#'+this.id).type(d.shift())
	});
});

Cypress.Commands.add('populateTimeGroup' ,{ prevSubject: 'element'}, (subject, timeStr) => {
	const d = timeStr.split(':');
	var fields = subject.find('input');
	fields.each(function() {
		//var nameRes = rgLastSection.exec(this.name);
		cy.get('#'+this.id).type(d.shift())
	});
});
