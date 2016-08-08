'use strict';

const config = require('../../../config');
const base = config.baseUrl || 'http://localhost';
const port = config.port || '8080';
const request = require('request');


const fixture = {"objectId":"56ec2057084d726f6a4611b8","passport":{"givenNames":"Ahmed","surname":"Shehab Malbas Abdulla Alobeidli","passportNumber":"12345678Y","expiryDate":"2018-04-27","issueDate":"2013-04-28","placeOfIssue":"Kuwait","gender":"F","dateOfBirth":"1987-08-12","placeOfBirth":"KUWAIT","countryOfBirth":"KWT","nationality":"ARE","holdOtherNationalities":"No","heldPreviousNationalities":"No"},"payment":{"orderCode":"Free","feeInPence":0,"paid":true,"paymentDate":"2016-03-18 15:35:51"},"contactDetails":{"emailAddress":"test@gmail.com","secondEmail":"testing@gmail.com","homeAddress":["My House","STREET 32","HOUSE NUMBER 16","","KWT","00000"],"mobilePhoneNumber":"+123-99028325","phoneNumber":"+123-44422555","countryAppliedFrom":"Kuwait","countryAppliedFromCode":"KWT","areYouEmployed":"No"},"journey":{"travelBy":"Plane","arrivalTravel":"BA0156","arrivalDate":"2016-08-21","departureForUKDate":"2016-04-30 08:20:00","arrivalTime":"12:15","portOfArrival":"London - Heathrow","portOfArrivalCode":"LHR","ukAddress":["The hotel in London","Westminster, London W1 7YT,","","","W1 7YT"],"departureDate":"2016-04-21","departureTravel":"BA157","portOfDeparture" : "London - Heathrow, LHR","inwardDepartureCountry":"KWT","inwardDeparturePort":"Kuwait - Kuwait Intl","inwardDeparturePortCode":"KWI","reasonForTravel":"Tourism","travelWithOthers":"No","knowDepartureDetails":"Yes","ukVisitPhoneNumber":"+12345234234","visitMoreThanOnce":"No"},"miscellaneous":{"onBehalfOfMinor":"No","asAnAgent":"No", "flightDetailsCheck":"Yes"},"passportFileId":"56ec1bd8aee7c384447463f0","applicationReference":"EVW123456"};

module.exports = function () {

    this.Given(/^I add a canned case$/, function () {
        request.post({
          url: `${base}:9300/tester/canned-evw-case/CHECK_ACCEPTED`,
          json: fixture,
          headers: {
              'Content-Type': 'application/json'
          }
        }, function (err, response, body) {

          if (err) {
            console.log('   error sending canned case', err, body);
            this.assert.ok(false);
          }

          console.log('   case added =>', body.membershipNumber);
          this.assert.ok(!!body);
          // TODO make nightwatch return passing assertion
          // this.assert(pass, true);
          //
        }.bind(this));


    });

    this.Given(/^I start the Update journey details app with smoke params$/, function () {
        this.url(`${base}:${port}/update-journey-details/how-will-you-arrive?evwNumber=EVW123456&token=74d3e5a47154150525964d90d0a99138a2633b49fbd9f829f9387414c1a458ef`)
        .waitForElementVisible('body', 1000);
    });
}