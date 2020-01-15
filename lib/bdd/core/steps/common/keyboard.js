const { Then } = require('cucumber');
const { keyboard } = require('../../actions');

Then('I press {string} on keyboard', keyboard.pressKeyboardButton);

Then('I press tab', keyboard.pressTab);

Then('I press enter', keyboard.pressEnter);

Then('I type {string}', keyboard.typeText);
