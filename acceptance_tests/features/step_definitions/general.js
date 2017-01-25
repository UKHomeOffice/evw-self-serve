'use strict';

const moment = require('moment');
const base = 'http://localhost:8080';
const urlise = (text) => text.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-');
const setUrl = (app, page) => `${base}/${urlise(app)}/${page ? urlise(page) : ''}`;
const futureDate = (future) => {
    let times = future.split(' ');
    let amount = Number(times[0]);
    let unit = times[1].slice(0,-1); //day/s month/s
    return moment().add(amount, unit);
};
module.exports = function () {

    this.When(/^I start the "([^"]*)" app$/, function (app) {
        this.url(setUrl(app))
        .waitForElementVisible('body', 1000);
    });

    this.When(/^I (?:start on|go to) the "([^"]*)" page of the "([^"]*)" app$/, function (page, app) {
        this.url(setUrl(app, page))
        .waitForElementVisible('body', 1000);
    });

    this.Given(/^I start the Update journey details app$/, function () {
        this.url(`${base}/update-journey-details/how-will-you-arrive?evwNumber=EVW123&token=TOKEN123`)
        .waitForElementVisible('body', 1000);
    });

    this.Given(/^I start the Update journey details app with an invalid token$/, function () {
        this.url(`${base}/update-journey-details/how-will-you-arrive?evwNumber=EVW123&token=invalid`)
        .waitForElementVisible('body', 1000);
    });

    this.When(/^I wait for "([^"]*)"$/, function (time) {
        this.pause(time*1000);
    });

    this.Given(/^I (?:am|should be) on the "([^"]*)" page of the "([^"]*)" app$/, function (page, app) {
        this.assert.urlEquals(setUrl(app, page));
    });

    this.Given(/^I sleep for "([^"]*)"$/, function (time) {
        this.pause(time*1000);
    });

    this.When(/^I click "([^"]*)"$/, function (value) {
        this.click(`input[value=${urlise(value)}]`);
    });

    this.When(/^I click id "([^"]*)"$/, function (id) {
        this.click('#'+urlise(id));
    });

    this.When(/^I click exact id "([^"]*)"$/, function (id) {
        this.click('#'+id);
    });

    this.When(/^I enter "([^"]*)" into "([^"]*)"$/, function (value, field) {
        this.clearValue('#'+urlise(field)).setValue('#'+urlise(field), value);
    });

    this.When(/^I enter "([^"]*)" into "([^"]*)" class$/, function (value, field) {
        this.clearValue('.'+urlise(field)).setValue('.'+urlise(field), value);
    });

    this.When(/^I enter the date "([^"]*)" into "([^"]*)"$/, function (date, field) {
        let d = date.split('-');
        this.clearValue('#'+urlise(field)+'-day').setValue('#'+urlise(field)+'-day', d[0]);
        this.clearValue('#'+urlise(field)+'-month').setValue('#'+urlise(field)+'-month', d[1]);
        this.clearValue('#'+urlise(field)+'-year').setValue('#'+urlise(field)+'-year', d[2]);
    });

    this.When(/^I enter the time "([^"]*)" into "([^"]*)"$/, function (time, field) {
        let t = time.split(':');
        this.clearValue('#'+urlise(field)+'-hours').setValue('#'+urlise(field)+'-hours', t[0]);
        this.clearValue('#'+urlise(field)+'-minutes').setValue('#'+urlise(field)+'-minutes', t[1]);
    });

    this.When(/^I enter a date "([^"]*)" in the future into "([^"]*)"$/, function (future, field) {
        let val = futureDate(future);
        // console.log('future date', val.format('DD-MM-YYYY'));
        let target = urlise(field);

        this.clearValue('#' + target + '-day').setValue('#' + target + '-day', val.format('DD'));
        this.clearValue('#' + target + '-month').setValue('#' + target + '-month', val.format('MM'));
        this.clearValue('#' + target + '-year').setValue('#' + target + '-year', val.format('YYYY'));
    });

    //And the "Arrival date" should contain a date "2 months" in the future
    this.Then(/^the "([^"]*)" should contain a date "([^"]*)" in the future$/, function (field, future) {
        let val = futureDate(future);
        let target = urlise(field);
        // console.log(val.format('DD-MM-YYYY'), 'does it need formatting?');
        this.assert.containsText('.' + target, val.format('DD/MM/YYYY'));
    });

    this.When(/^I continue$/, function () {
        this.click(`input[type=submit]`);
    });

    this.Then(/^the page title should contain "([^"]*)"$/, function (string) {
        this.assert.containsText('h1.heading-large', string);
    });

    this.Then(/^the validation summary should contain$/, function (strings) {
        strings.split(/\n/).forEach( function (string) {
            this.assert.containsText('.validation-summary', string);
        }, this);
    });

    this.Then(/^the content list should contain$/, function (strings) {
        strings.split(/\n/).forEach( function (string) {
            this.assert.containsText('ul.list', string);
        }, this);
    });

    this.Then(/^the "([^"]*)" should contain "([^"]*)"$/, function (field, value) {
        this.assert.containsText(`.${urlise(field)}`, value);
    });

    this.Then(/^the page body should contain "([^"]*)"$/, function (value) {
        this.assert.containsText('body', value);
    });

    this.When(/^I (?:click|select) "([^"]*)" for "([^"]*)"$/, function (value, field) {
        this.click(`input[name=${urlise(field)}][value="${value}"]`);
    });

    this.When(/^I select "([^"]*)" from dropdown list for "([^"]*)"$/, function (value, selectList) {
        this.click(`select[name="${urlise(selectList)}"] option[value="${value}"]`);
    });
};
