const fs = require('fs');
const path = require('path');
const get = require('lodash.get');
const defaultSettings = require('../../utils/default-settings');
const { getSelector, getScope } = require('../../utils');
const { assert } = require('chai');

/**
 * Promise based setTimeout function
 * @param {number} duration The time in  milliseconds
 */
const delay = duration => new Promise(resolve => setTimeout(resolve, duration));

/**
 * Function to wait on the current page before running any action
 * @param {number} timeInSeconds The time to wait in seconds
 */
const wait = async timeInSeconds => {
    const time = parseInt(timeInSeconds) * 1000;
    await delay(time);
};

/**
 * Function to check if the element is present
 * @param {string} selector The element selector
 * @param {object} context The page/frame object
 */
const elementPresent = async (selector, context) => {
    const scope = getScope();
    let elPresent;
    if (context) {
        elPresent = await context.waitForSelector(getSelector(selector), {
            visible: true
        });
    } else {
        const { currentPage } = scope.context;
        elPresent = await currentPage.waitForSelector(getSelector(selector), {
            visible: true
        });
    }
    assert.notEqual(elPresent, null);
    return elPresent;
};

/**
 * Function to set the viewport size while testing the current page
 * @param {string} value The name of the break point
 */
const setBreakpoint = value => {
    const scope = getScope();
    scope.breakpoint = get(
        scope,
        `settings.breakpoints[${value}]`,
        defaultSettings.breakpoints.desktop
    );
};

/**
 * Function to take the screen shot for the current page and attach to report
 * @param {string} value The name of the screenshot
 */
const takeScreenshot = async value => {
    const scope = getScope();
    const { context, attach, settings } = scope;
    const { currentPage } = context;
    const { reportsPath } = settings;
    const basePath = path.resolve(
        process.cwd(),
        path.join(reportsPath, 'screenshots')
    );
    if (fs.existsSync(basePath)) {
        return await currentPage
            .screenshot({
                path: path.resolve(
                    process.cwd(),
                    path.join(basePath, `${value}.png`)
                )
            })
            .then(buffer => {
                return attach(buffer, 'image/png');
            });
    }
    return;
};

module.exports = {
    delay,
    wait,
    setBreakpoint,
    elementPresent,
    takeScreenshot
};
