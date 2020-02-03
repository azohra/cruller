const { Given, Then } = require('cucumber');
const { utils } = require('../../actions');

Then('I wait for {string} to be present', async string => {
    await utils.elementPresent(string);
});

Then('I wait for {int} seconds', utils.wait);

Given('I set viewport as {string}', utils.setBreakpoint);

Given('I take a screenshot named {string}', utils.takeScreenshot);
