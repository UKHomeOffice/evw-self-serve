'use strict';

const base =  process.env.TEST_URL || 'http://localhost:8080';

module.exports = function () {

    this.Given(/^I start the Update journey details app using the old URL$/, function () {
        this.url(`${base}/update-journey-details/how-will-you-arrive?evwNumber=EVW123&token=TOKEN123`)
        .waitForElementVisible('body', 1000);
    });

};


