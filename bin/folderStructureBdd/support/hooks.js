const { After } = require('cucumber');
require('../../../lib/bdd').hooks;
const { browser } = require('../../../lib/bdd').actions;

// Custom hooks for tag @example
After({ tags: '@example' }, () => {
    browser.closeBrowser();
});
