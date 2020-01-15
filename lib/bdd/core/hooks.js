const { After, AfterAll } = require('cucumber');
const scope = require('./scope');

After(() => {
    // Reset breakpoints to defaults
    if (scope.breakpoint) {
        scope.breakpoint = scope.defaultBreakpoint;
    }
});

AfterAll(async () => {
    // Close browser after running all tests
    if (scope.browser) {
        await scope.browser.close();
    }
});
