const { After, AfterAll } = require('cucumber');
const { getScope } = require('./utils');

After(() => {
    const scope = getScope();
    // Reset breakpoints to defaults
    if (scope.breakpoint) {
        scope.breakpoint = scope.defaultBreakpoint;
    }
});

AfterAll(async () => {
    const scope = getScope();
    // Close browser after running all tests
    if (scope.browser) {
        await scope.browser.close();
    }
});
