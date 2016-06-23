module.exports = function () {

    this.When(/^I click confirm details$/, function () {
        this.click(`input[value="Confirm details"]`);
        this.pause(10)
    });
};
