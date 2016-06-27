'use strict';

const base = 'http://localhost:8080/update-journey-details/';
const urlise = (text) => text.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-');

module.exports = function () {

    this.When(/^I (?:start on|go to) the "([^"]*)" page$/, function (page) {
        this.url(base + urlise(page))
        .waitForElementVisible('body', 1000);
    });

    this.Given(/^I (?:am|should be) on the "([^"]*)" page$/, function (page) {
        this.assert.urlEquals(base + urlise(page));
    });

    this.When(/^I click "([^"]*)"$/, function (value) {
        this.click(`input[value=${urlise(value)}]`);
    });

    this.When(/^I enter "([^"]*)" into "([^"]*)"$/, function (value, field) {
        this.setValue('#'+urlise(field), value);
    });

    this.When(/^I enter the date "([^"]*)" into "([^"]*)"$/, function (date, field) {
        let d = date.split('-');
        this.setValue('#'+urlise(field)+'-day', d[0]);
        this.setValue('#'+urlise(field)+'-month', d[1]);
        this.setValue('#'+urlise(field)+'-year', d[2]);
    });

    this.When(/^I continue$/, function () {
        this.click(`input[value=Continue]`);
    });

    this.Then(/^the page title should contain "([^"]*)"$/, function (string) {
        this.assert.containsText('h1.heading-large', string);
    });

};
