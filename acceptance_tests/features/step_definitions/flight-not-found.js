module.exports = function () {

    this.When(/^I retry$/, function () {
        this.click(`.retry-button`);
    });

};
