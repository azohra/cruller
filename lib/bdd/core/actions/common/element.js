const { assert } = require('chai');
const { getSelector, getScope } = require('../../utils');
const { elementPresent } = require('./utils');

/**
 * Function to focus on an element
 * @param {string} selector The element selector
 */
const focusItem = async selector => {
    const scope = getScope();
    const { currentPage } = scope.context;
    await elementPresent(getSelector(selector));
    return await currentPage.$eval(getSelector(selector), elem => elem.focus());
};

/**
 * Function to hover over an element
 * @param {string} selector The element selector
 */
const hoverItem = async selector => {
    const scope = getScope();
    const { currentPage } = scope.context;
    await elementPresent(getSelector(selector));
    return await currentPage.hover(getSelector(selector));
};

/**
 * Function to click on an element
 * @param {string} selector The element selector
 */
const clickItem = async selector => {
    const scope = getScope();
    const { currentPage } = scope.context;
    await elementPresent(getSelector(selector));
    return await currentPage.$eval(getSelector(selector), elem => elem.click());
};

/**
 * Function to check if and element has the desired text content
 * @param {string} selector The element selector
 * @param {string} value The value to test
 */
const hasText = async (selector, value) => {
    const scope = getScope();
    const { currentPage } = scope.context;
    await elementPresent(getSelector(selector));
    const text = await currentPage.$eval(
        getSelector(selector),
        el => el.textContent
    );
    assert.match(text, value);
    return;
};

/**
 * Function to click and element inside an iframe
 * @param {string} elSelector The element inside the iframe to click
 * @param {string} iframeSelector The iframe selector
 */

const clickOnIframeElement = async (elSelector, iframeSelector) => {
    const scope = getScope();
    const { currentPage } = scope.context;
    await elementPresent(getSelector(iframeSelector));
    const frameElement = await currentPage.$(getSelector(iframeSelector));
    const frame = await frameElement.contentFrame();
    await elementPresent(elSelector, frame);
    return await frame.click(getSelector(elSelector));
};

module.exports = {
    focusItem,
    hoverItem,
    clickItem,
    hasText,
    clickOnIframeElement,
};