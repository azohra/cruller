const { Then } = require('cucumber');
const { a11y } = require('../../actions');

Then('I run accessibility check on the page', a11y.checkPageA11y);

Then('I run accessibility check for {string}', a11y.checkElementA11y);
