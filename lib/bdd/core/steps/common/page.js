const { Given, Then } = require('cucumber');
const { page } = require('../../actions');

Given('I go to url {string}', page.goToURL);

Then('I refresh the page', page.reloadPage);

Then('I scroll to the bottom of the page', page.autoScroll);

Then('I should see page title as {string}', page.hasPageTitle);

Then('I wait for page navigation', page.waitForPageNavigation);
