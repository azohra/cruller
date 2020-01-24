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