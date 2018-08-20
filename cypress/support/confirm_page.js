const moment = require('moment');
const _ = require('lodash');


/**************************************************************************************
This module checks values on a confirm page of the application

the map contains the classes of all items that will be checked.  
Not all get checked - only the ones present on the page.

Values extracted from the page as element text are compared to either the
specified attribute of the applicant record, or the return of a function that is passed 
the applicant record. 
In this way, any special formatting (such as dates) can be carried out
***************************************************************************************/

    var checkMap = {
        'nationality-value':'nationality',
        'passport-number-value': 'passportNumber',
        'passport-issue-date-value': ((applicant)=>{
            return moment(applicant['passportIssue']).format("DD/MM/YYYY")
        }),
        'passport-expiry-date-value': ((applicant)=>{
            return moment(applicant['passportExpiry']).format("DD/MM/YYYY")
        }),
        'passport-issue-place-value' : 'passportIssuedPlace',
        'check-name-value': 'name',
        'gender-value': ((applicant)=>{
            return applicant['gender'].toLowerCase();
        }),
        'date-of-birth-value': ((applicant)=>{
            return moment(applicant['dateOfBirth']).format("DD/MM/YYYY")
        }),
        'place-of-birth-value' : 'placeOfBirth'
    }

    Cypress.Commands.add('checkConfirmationValue' ,{}, (subject, applicant) => {
        var className = subject.attr('class');
        var mapValue = checkMap[className];
        if(mapValue) {
            var value = subject.get(0).innerText;
            var appValue = _.isFunction(mapValue) ? mapValue(applicant) : applicant[mapValue]
            cy.log('Check value:',value);
            cy.log('Applicant value:', appValue);
            expect(appValue).to.equal(value)
        }
    });