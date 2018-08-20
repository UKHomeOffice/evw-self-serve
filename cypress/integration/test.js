const _ = require('lodash');

let store = {};

const config = require('../../config');
const customerBase = config.cypress.customerBase
const caseworkerBase = config.cypress.caseworkerBase;
const caseworker = config.cypress.caseworker;
let applicant;

describe('Initial happy path', () => {
    beforeEach( () => {
        cy.fixture('applicant_details').then( (result) => {
            store.applicant = result.applicants['smoke'];
            cy.setApplicantDates(store.applicant);
            applicant = store.applicant;
        });          
    })
    it('Customer: completes initial application', () => {
        cy.log(`Applicant details: ${JSON.stringify(applicant)}`);
        cy.visit(`${customerBase}/start`);
        cy.contains('Electronic visa waiver');
        cy.contains('Make a new application');
        cy.get('#apply').parent().find('.inner').click();
        cy.get('#continue').click();
        cy.contains('Electronic visa waiver');
        cy.get('#continue').click();
        cy.contains('What is your nationality?');
        cy.get(`label:contains(${applicant.nationality})`).click();
        cy.get('#continue').click();
        cy.contains('Your passport details');
        cy.get('#passport-number').type(applicant.passportNumber);
        cy.get('#passport-issue-date-group').populateDateGroup(applicant.passportIssue);
        cy.get('#passport-expiry-date-group').populateDateGroup(applicant.passportExpiry);
        cy.get('#passport-issue-place').type(applicant.passportIssuedPlace);
        cy.get('#country-of-birth_typeahead').type(applicant.countryOfBirth);
        cy.get('#continue').click();
        cy.get('#passport-image').upload_file('SMOKE.png', 'image/png');
        cy.contains('Is your passport image clear?');
        cy.get('#check-passport-image-Yes').click();
        cy.get('#continue').click();
        cy.contains('Your name');
        cy.get('#name').type(applicant.name);
        cy.get('#continue').click();
        cy.get('#check-name').should('have.value', applicant.name);
        cy.get('#continue').click();
        cy.contains('Your personal details');
        cy.get(`label:contains(${applicant.gender})`).click();
        cy.get('#date-of-birth-group').populateDateGroup(applicant.dateOfBirth);
        cy.get('#place-of-birth').type(applicant.placeOfBirth);
        cy.get('#other-names-No').click();
        cy.get('#continue').click();
        cy.contains('Other nationalities');
        cy.get('#have-other-nationalities-No').click();
        cy.get('#had-previous-nationalities-No').click();
        cy.get('#continue').click();
        cy.contains('How will you arrive in the UK');
        cy.get(`label:contains(${applicant.formOfTravel})`).click();
        cy.get('#continue').click();
        cy.contains('Your train details');
        cy.get('#train-number').type(applicant.trainNumber);
        cy.get('#train-departure-date-group').populateDateGroup(applicant.departureDate);

        cy.get('#train-departure-time-group').populateTimeGroup(applicant.trainDepartureTime)
        cy.get('#train-departure-country_typeahead').type(applicant.countryDepartingFrom);
        cy.get('#train-departure-station_typeahead').type(applicant.stationDepartingFrom);
        cy.get('#train-arrival-station_typeahead').type(applicant.arrivalStation);
        cy.get('#train-arrival-date-group').populateDateGroup(applicant.arrivalDate);
        cy.get('#train-arrival-time-group').populateTimeGroup(applicant.trainArrivalTime);
        cy.get('#continue').click();
        cy.contains('About your visit');
        cy.get(`label:contains(${applicant.reasonForVisit})`).click();
        cy.get('#travelling-with-others-No').click();
        cy.get('#continue').click();
        cy.contains('Your stay and departure');
        cy.get('#uk-address-1').type(applicant.ukAddress);
        cy.get('#uk-postcode').type(applicant.ukPostcode);
        cy.get('#uk-phone').type(applicant.ukPhone);
        cy.get('#know-departure-details-No').click();
        cy.contains('How long are you staying in the UK for?');
        cy.get(`label:contains(${applicant.durationOfStay})`).click();
        cy.get('#uk-visit-more-than-once-No').click();
        cy.get('#continue').click();
        cy.contains('Your contact details');
        cy.get('#country-applied-from_typeahead').type(applicant.countryAppliedFrom);
        cy.get('#home-address-1').type(applicant.homeAddress);
        cy.get('#home-postcode').type(applicant.homePostcode);
        cy.get('#home-country_typeahead').type(applicant.homeCountry);
        cy.get('#home-phone').type(applicant.homePhone);
        cy.get('#mobile').type(applicant.mobileNumber);
        cy.get('#email').type(applicant.emailAddress);
        cy.get('#confirm-email').type(applicant.emailAddress);
        cy.get('#employed-No').click();
        cy.get('#continue').click();
        cy.contains('Applying for someone else');
        cy.get('#applying-for-other-No').click();
        cy.get('#continue').click();

        cy.contains('Check your answers');
        cy.get('table#summary').find('tr td:nth-child(2)').each((el,index)=>{
            cy.checkConfirmationValue(el,applicant);
        });
        cy.get('#continue').click();
        cy.contains('Declaration');
        cy.get('#declaration').click();
        cy.get('#continue').click();
        // Skips payment

        // On the final page -> read the application reference
        cy.get('#application-reference').invoke('text').then((text)=>{
            cy.log('application ref',text);
            store.appRef = text;
        })
        // Wait for the OCR to process. A better solution to this would be preferable
        cy.wait(20000);
    });
    it('Caseworker: Validates initial application', () => {
        cy.log('In caseworker',store.appRef)
        cy.visit(`${caseworkerBase}/login`);
        cy.get('#username').type(caseworker.username);
        cy.get('#password').type(caseworker.password);
        cy.get('input#submit').click();
        // we should be in looking at the smoke bucket
        cy.get('#dataTable .tablesorter-filter-row input.tablesorter-filter#1').type(store.appRef)
        // wait for only one row so thet the filter doesn't update while we are clicking
        cy.get('#dataTable tbody tr:nth-child(2)').should('not.exist');
        cy.get(`#dataTable tbody tr td:contains(${store.appRef})`).click();
        cy.get('#isPassportImageCorrect_true').click();
        cy.get('#isPrimaryNameCorrect_false').click();
        cy.get('#primaryNameInput').clear().type('Supermans');
        cy.get('#lastNameErrorDetailContainer input.select2-search__field').type('{enter}');
        cy.clickElements([
            '#isGivenNameCorrect_true',
            '#isDateOfBirthCorrect_true',
            '#journeyDetails_isArrivalTravelNumberCorrect_true',
            '#journeyDetails_isArrivalDateCorrect_true',
            '#journeyDetails_isDepartureForUkPortCorrect_true',
            '#journeyDetails_isDepartureForUkCountryCodeCorrect_true',
            '#journeyDetails_isDepartureForUkDateCorrect_true',
            '#journeyDetails_isDepartureForUkTimeCorrect_true',
            '#journeyDetails_isArrivalPortCorrect_true',
            '#journeyDetails_isArrivalTimeCorrect_true',
        ]);
        cy.get('#saveVerify').click();
    })
    it('Customer: change travel details', () => {
        cy.visit(`${customerBase}/start`);
        cy.url().should('contain', '/start')
        cy.get('label[for=update]').click();
        cy.get('#continue').click();
        cy.url().should('contain', '/find-your-application/enter-your-details')
        cy.get('#evw-number').type(store.appRef);
        cy.get('#dob-group').populateDateGroup(store.applicant.dateOfBirth);
        cy.get('#details').click();
        cy.contains('Check your email');
    })

    it('caseworker: access travel update email', () => {
        cy.log('In caseworker',store.appRef)
        cy.visit(`${caseworkerBase}/login`);
        cy.get('#username').type(caseworker.username);
        cy.get('#password').type(caseworker.password);
        cy.get('input#submit').click();
        // we should be in looking at the smoke bucket
        cy.get('#dataTable .tablesorter-filter-row input.tablesorter-filter#1').type(store.appRef);
        // wait for only one row so thet the filter doesn't update while we are clicking
        cy.get('#dataTable tbody tr:nth-child(2)').should('not.exist');
        cy.get(`#dataTable tbody tr td:contains(${store.appRef})`).click();
        cy.contains('Correspondence').click();
        cy.get('.emailLink').contains('Flight details update').click();
        cy.get('#update_journey_link').click();

        cy.log('Customer app: updating journey',store.appRef);
        cy.contains('Your new journey to the UK')
        cy.url().should('contain', '/update-journey-details/how-will-you-arrive')
        cy.get('#transport-options-by-train').click();
        cy.get('.button').contains('Continue').click();
        cy.url().should('contain', 'update-journey-details/email-us')
    })

    it('caseworker: access email link for Evw download', () => {
        cy.log('In caseworker', store.appRef)
        cy.visit(`${caseworkerBase}/login`);
        cy.get('#username').type(caseworker.username);
        cy.get('#password').type(caseworker.password);
        cy.get('input#submit').click();
        // we should be in looking at the smoke bucket
        cy.get('#dataTable .tablesorter-filter-row input.tablesorter-filter#1').type(store.appRef);
        // wait for only one row so thet the filter doesn't update while we are clicking
        cy.get('#dataTable tbody tr:nth-child(2)').should('not.exist');
        cy.get(`#dataTable tbody tr td:contains(${store.appRef})`).click();
        cy.contains('Correspondence').click();
        cy.get('.emailLink').contains('Evw verified email').click();
        cy.get('#download_pdf').contains('Download').click();
        cy.get('#passport-number').type(applicant.passportNumber);
        cy.get('#date-of-birth-group').populateDateGroup(applicant.dateOfBirth);
        cy.get('#continue').click();
        cy.url().should('contain', 'download/pdf')
    });
});

