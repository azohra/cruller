const { Given, Then } = require('cucumber');
const { page } = require('../../actions');

Given('I go to url {string}', page.goToURL);

Given('I go to url {string} incognito', async url => {
    await page.goToURL(url, true);
});

Then('I refresh the page', page.reloadPage);

Then('I scroll to the bottom of the page', page.autoScroll);

Then('I should see page title as {string}', page.hasPageTitle);

Then('I wait for page navigation', page.waitForPageNavigation);
