'use strict';

const base = 'http://localhost:8080/update-journey-details/';
const urlise = (text) => text.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-');

module.exports = function () {

    this.Given(/^I (?:am|should be) on the "([^"]*)" page$/, function (page) {
        this.url(base + urlise(page))
        .waitForElementVisible('body', 1000);
    });

    this.When(/^I click "([^"]*)"$/, function (value) {
        this.click(`input[value=${urlise(value)}]`);
    });

    this.When(/^I enter "([^"]*)" into "([^"]*)"$/, function (value, id) {
        this.setValue('#'+id, value);
    });

    this.When(/^I enter the date "([^"]*)" into "([^"]*)"$/, function (date, id) {
        let d = date.split('-');
        this.setValue('#'+id+'-day', d[0]);
        this.setValue('#'+id+'-month', d[1]);
        this.setValue('#'+id+'-year', d[2]);
    });

    this.When(/^I continue$/, function () {
        this.click(`input[value=Continue]`);
    });

    this.Then(/^the page title should contain "([^"]*)"$/, function (string) {
        this.assert.containsText('h1.heading-large', string);
    });

    this.When(/^I enter "([^"]*)" into the "([^"]*)" field$/, function (value, field) {
        this.setValue(`input[id=${urlise(field)}]`, value);
    });

};
