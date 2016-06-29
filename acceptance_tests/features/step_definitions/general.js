'use strict';

const base = 'http://localhost:8080';
const urlise = (text) => text.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-');
const setUrl = (app, page) => `${base}/${urlise(app)}/${urlise(page)}`;

module.exports = function () {

    this.When(/^I (?:start on|go to) the "([^"]*)" page of the "([^"]*)" app$/, function (page, app) {
        this.url(setUrl(app, page))
        .waitForElementVisible('body', 1000);
    });

    this.Given(/^I (?:am|should be) on the "([^"]*)" page of the "([^"]*)" app$/, function (page, app) {
        this.assert.urlEquals(setUrl(app, page));
    });

    this.When(/^I click "([^"]*)"$/, function (value) {
        this.click(`input[value=${urlise(value)}]`);
    });

    this.When(/^I enter "([^"]*)" into "([^"]*)"$/, function (value, field) {
        this.setValue('#'+urlise(field), value);
    });

    this.When(/^I enter "([^"]*)" into "([^"]*)" class$/, function (value, field) {
        this.setValue('.'+urlise(field), value);
    });

    this.When(/^I enter the date "([^"]*)" into "([^"]*)"$/, function (date, field) {
        let d = date.split('-');
        this.setValue('#'+urlise(field)+'-day', d[0]);
        this.setValue('#'+urlise(field)+'-month', d[1]);
        this.setValue('#'+urlise(field)+'-year', d[2]);
    });

    this.When(/^I enter the time "([^"]*)" into "([^"]*)"$/, function (time, field) {
        let t = time.split(':');
        this.setValue('#'+urlise(field)+'-hours', t[0]);
        this.setValue('#'+urlise(field)+'-minutes', t[1]);
    });

    this.When(/^I continue$/, function () {
        this.click(`input[type=submit]`);
    });

    this.Then(/^the page title should contain "([^"]*)"$/, function (string) {
        this.assert.containsText('h1.heading-large', string);
    });

    this.Then(/^the "([^"]*)" class should contain$/, function (selector, strings) {
        strings.split(/\n/).forEach( function (string) {
            this.assert.containsText('.' + urlise(selector), string);
        }, this);
    });

    this.Then(/^the content list should contain$/, function (strings) {
        strings.split(/\n/).forEach( function (string) {
            this.assert.containsText('ul.list', string);
        }, this);
    });

};
