const { getScope } = require('../../utils');

/**
 * Function to press a keyboard button
 * @param {string} value The keyboard button to be  pressed
 * Check https://github.com/puppeteer/puppeteer/blob/master/lib/USKeyboardLayout.js for keyboard inputs
 */
const pressKeyboardButton = async value => {
    const scope = getScope();
    const { currentPage } = scope.context;
    return await currentPage.keyboard.press(value);
};

/**
 * Function to press the tab button on the keyboard
 */
const pressTab = async () => {
    return await pressKeyboardButton('Tab');
};

/**
 * Function to press the enter button on the keyboard
 */
const pressEnter = async () => {
    return await pressKeyboardButton('Enter');
};

/**
 * Function to simulate entering text via keyboard
 * @param {string} value The text to enter
 */
const typeText = async (value, delay = 100) => {
    const scope = getScope();
    const { currentPage } = scope.context;
    return await currentPage.keyboard.type(value, { delay });
};

module.exports = {
    pressKeyboardButton,
    pressTab,
    pressEnter,
    typeText,
};
