const { Given, Then } = require('cucumber');
const { browser } = require('../../actions');

Given('I open a browser window', browser.openBrowser);

Then('I close the browser', browser.closeBrowser);
