const { assert } = require('chai');
const { getSelector, getScope } = require('../../utils');
const { elementPresent } = require('./utils');

/**
 * Function to get the value of a form field
 * @param {string} selector The element selector
 */
const getValue = async selector => {
    const scope = getScope();
    const { currentPage } = scope.context;
    return await currentPage.$eval(getSelector(selector), el => el.value);
};

/**
 * Function to check if a form element has a particular value
 * @param {string} selector The element selector
 * @param {string|number} text The value expected
 */
const hasValue = async (selector, text) => {
    await elementPresent(getSelector(selector));
    const value = await getValue(getSelector(selector));
    assert.equal(text, value);
    return;
};

/**
 * Function to enter a value in a form element
 * @param {string} selector The element selector
 * @param {string} value The vale to be filled
 */
const fillInFormField = async (selector, value) => {
    const scope = getScope();
    const { currentPage } = scope.context;
    await elementPresent(getSelector(selector));
    await currentPage.focus(getSelector(selector));
    await currentPage.type(getSelector(selector), value, { delay: 50 });
    return;
};

/**
 * Function to empty the form input field
 * @param {string} selector The element selector
 */
const emptyFormField = async selector => {
    const scope = getScope();
    const { currentPage } = scope.context;
    await elementPresent(getSelector(selector));
    const value = await getValue(getSelector(selector));
    await currentPage.focus(getSelector(selector));
    await currentPage.keyboard.press('End');
    for (let i = 0; i < value.length; i++) {
        await currentPage.keyboard.press('Backspace');
    }
    return;
};

/**
 * The value to be selected from a select form input
 * @param {string} value The value to be selected
 * @param {string} selector The element selector
 */
const selectValueFromField = async (value, selector) => {
    const scope = getScope();
    const { currentPage } = scope.context;
    await elementPresent(getSelector(selector));
    await currentPage.select(getSelector(selector), value);
    return;
};

module.exports = {
    getValue,
    hasValue,
    fillInFormField,
    emptyFormField,
    selectValueFromField
};
