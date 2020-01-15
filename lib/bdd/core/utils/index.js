const glob = require('glob');
const cosmiconfig = require('cosmiconfig');
const merge = require('lodash.merge');
const defaultSettings = require('./default-settings');
const scope = require('../scope');

/**
 * Function to get the selector from label
 * @param {string} s The selector to search
 */
const getSelector = s => {
    const { settings } = scope;
    const { selectors } = settings;
    return selectors[s] || s;
};

/**
 * Function to update the scope settings object used by cucumber-js
 */
const updateSettings = (settings = {}) => {
    // The config mentioned in package.json
    const search = cosmiconfig('cruller', {
        searchPlaces: ['package.json']
    }).searchSync();
    // Set the default settings object
    scope.settings = merge({}, defaultSettings, settings);
    // Set settings object as a combination of package.json based settings
    // and default settings mentioned above
    if (search) {
        const { config } = search;
        if (config) {
            const { selectorFiles } = config;
            // search glob files for selectors
            selectorFiles.forEach(globPath => {
                glob.sync(globPath, {
                    nodir: true,
                    nonull: true,
                    cwd: process.cwd(),
                    absolute: true
                }).forEach(filePath => {
                    const selectors = require(filePath);
                    // Add selectors to the scope object
                    scope.settings.selectors = {
                        ...scope.settings.selectors,
                        ...selectors
                    };
                });
            });
            // Merge configs to settings
            scope.settings = merge({}, scope.settings, config);
            return;
        }
    }
};

module.exports = {
    getSelector,
    updateSettings
};
