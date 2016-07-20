'use strict';

const config = require('../../../config');
const moment = require('moment');
const base = config.baseUrl || 'http://localhost:8080'; // TODO pull from config

const urlise = (text) => text.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-');

const futureDate = (future) => {
    let times = future.split(' ');
    let amount = Number(times[0]);
    let unit = times[1].slice(0,-1); //day/s month/s
    return moment().add(amount, unit);
}

module.exports = function () {

    this.Given(/^I start the Update journey details app with smoke params$/, function () {
        this.url(`${base}/update-journey-details/how-will-you-arrive?evwNumber=EVW123456&token=74d3e5a47154150525964d90d0a99138a2633b49fbd9f829f9387414c1a458ef`)
        .waitForElementVisible('body', 1000);
    });

    this.Then(/^I enter a date "([^"]*)" in the future into "([^"]*)"$/, function (future, field) {
        let val = futureDate(future);
        let target = urlise(field);

        this.setValue('#' + target + '-day', val.day());
        this.setValue('#' + target + '-month', val.month());
        this.setValue('#' + target + '-year', val.year());
    });

    // this.Then(/^the "([^"]*)" should contain a date "([^"]*)" in the future$/, function (field, future) {
    //     let val = futureDate(future);
    //     let target = urlise(field);
    //     this.assert.containsText('#' + target + '-day', val.day());
    //     this.assert.containsText('#' + target + '-month', val.month());
    //     this.assert.containsText('#' + target + '-year', val.year());
    // });

}