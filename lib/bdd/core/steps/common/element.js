const { Then } = require('cucumber');
const { element } = require('../../actions');

Then('I click on {string}', element.clickItem);

Then('I hover on {string}', element.hoverItem);

Then('I focus on {string}', element.focusItem);

Then('I should see {string} have text {string}', element.hasText);

Then('I click on {string} inside iframe {string}', element.clickOnIframeElement);
