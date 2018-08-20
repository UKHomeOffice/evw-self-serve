// ***********************************************
// Date utilities
// ***********************************************
const _ = require('lodash');

Cypress.Commands.add('clickElements' ,{}, (selectors) => {
	_.each(selectors,(selector)=>{
		cy.get(selector).click();
	})
});
