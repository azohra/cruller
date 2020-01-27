const { expect } = require('chai');
const { getSelector, getScope } = require('../../utils');
const { setBreakpoint } = require('../../actions/common/utils');
const { openBrowser } = require('./browser');

/**
 * Function to reload page
 */
const reloadPage = async () => {
    const scope = getScope();
    await scope.context.currentPage.reload({
        waitUntil: 'networkidle2'
    });
    return;
};

/**
 * Function to check  if the page has navigated
 */
const waitForPageNavigation = async () => {
    const scope = getScope();
    const { currentPage } = scope.context;
    await currentPage.waitForNavigation({
        waitUntil: 'networkidle2'
    });
    return;
};

/**
 * Function to check if the  current page contains the desired title
 * @param {string} value The value to test
 */
const hasPageTitle = async value => {
    const scope = getScope();
    const { currentPage } = scope.context;
    const text = await currentPage.title();
    expect(text).to.contain(value);
    return;
};

/**
 * Function to open a url in a new tab
 * @param {string} value The url to test
 * @param {boolean} incognito Open a page incognito
 */
const goToURL = async (value, incognito = false) => {
    const scope = getScope();
    // Set breakpoint based on environment variable
    if(process.env.BREAKPOINT) {
        setBreakpoint(process.env.BREAKPOINT);
    }
    const { width, height } = scope.breakpoint;
    await openBrowser();
    if(incognito === true) {
        const incognitoContext = await scope.browser.createIncognitoBrowserContext();
        scope.context.currentPage = await incognitoContext.newPage();
    } else {
        scope.context.currentPage = await scope.browser.newPage();
    }
    scope.context.currentPage.setViewport({ width, height });
    const url = getSelector(value);
    const visit = await scope.context.currentPage.goto(url, {
        waitUntil: 'networkidle2'
    });
    return visit;
};

/**
 * Function to scroll the page to the bottom
 */
const autoScroll = async () => {
    const scope = getScope();
    const { currentPage } = scope.context;
    await currentPage.evaluate(async () => {
        await new Promise(resolve => {
            var totalHeight = 0;
            var distance = 100;
            var timer = setInterval(() => {
                // eslint-disable-next-line no-undef
                var scrollHeight = document.body.scrollHeight;
                // eslint-disable-next-line no-undef
                window.scrollBy(0, distance);
                totalHeight += distance;

                if (totalHeight >= scrollHeight) {
                    clearInterval(timer);
                    resolve();
                }
            }, 100);
        });
    });
    return;
};

module.exports = {
    reloadPage,
    hasPageTitle,
    waitForPageNavigation,
    goToURL,
    autoScroll
};
