const { setWorldConstructor, setDefaultTimeout } = require('cucumber');
const puppeteer = require('puppeteer');
const scope = require('./core/scope');
const actions = require('./core/actions');
const steps = require('./core/steps');
const hooks = require('./core/hooks');
const get = require('lodash.get');
const defaultSettings = require('./core/utils/default-settings');
const { updateSettings } = require('./core/utils');

/**
 * The core cruller cucumber setup function
 * @param {object} settings The settings override
 * @param {object} customData Data added by user to scope object
 */
const CrullerCucumber = function(settings = {}, customData = {}) {
    const cucumberWorld = function({ attach, parameters }) {
        // The settings object
        updateSettings(settings);
        // Viewport breakpoints
        scope.breakpoint = get(
            scope,
            'settings.breakpoints.desktop',
            defaultSettings.breakpoints.desktop
        );
        // Attachments as per
        // https://github.com/cucumber/cucumber-js/blob/master/docs/support_files/attachments.md
        scope.attach = attach;
        // Parameters via CLI
        scope.parameters = parameters;
        // The web driver
        scope.driver = puppeteer;
        // The context object
        scope.context = {};
        // Custom data added to scope object
        scope.customData = customData;
    };
    // Override default timeout
    setDefaultTimeout(60 * 1000);
    // Set world constructor
    setWorldConstructor(cucumberWorld);
};

module.exports = CrullerCucumber;
module.exports.scope = scope;
module.exports.actions = actions;
module.exports.steps = steps;
module.exports.hooks = hooks;
