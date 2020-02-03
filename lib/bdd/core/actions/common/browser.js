const { getScope } = require('../../utils');

/**
 * Function to close the browser
 */
const closeBrowser = async () => {
    const scope = getScope();
    if (scope.browser) {
        await scope.browser.close();
        scope.browser = null;
    }
    return;
};

/**
 * Function to open the browser and set it to the scope object
 */
const openBrowser = async () => {
    const scope = getScope();
    const { headless } = scope.settings;
    const config = {
        headless: process.env.HEADLESSCHROME === 'true' || headless
    };
    if (!scope.browser) {
        const isBrowserless = process.env.PIPELINE ===  'true';
        // Check if we should run in browserless mode.
        if (isBrowserless) {
            const browserlessKey = process.env.BROWSERLESS_KEY;
            const browserlessToken = browserlessKey ? `?token=${browserlessKey}` : '';
            const browserWSEndpoint = `wss://chrome.browserless.io${browserlessToken}`;
            config.browserWSEndpoint = browserWSEndpoint;
            scope.browser = await scope.driver.connect(config);
        } else {
            scope.browser = await scope.driver.launch(config);
        }
    }
    return;
};

module.exports = {
    closeBrowser,
    openBrowser
};
