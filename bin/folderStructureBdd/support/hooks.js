const { After } = require('cucumber');
require('../../../lib/bdd/core/hooks');
const { browser } = require('../../../lib/bdd/core/actions');

// Custom hooks for tag @example
After({ tags: '@example' }, () => {
    browser.closeBrowser();
});
