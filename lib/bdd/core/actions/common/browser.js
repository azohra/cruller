const scope = require('../../scope');

/**
 * Function to close the browser
 */
const closeBrowser = async () => {
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
    const { headless } = scope.settings;
    if (!scope.browser) {
        scope.browser = await scope.driver.launch({
            headless
        });
    }
    return;
};

module.exports = {
    closeBrowser,
    openBrowser,
};