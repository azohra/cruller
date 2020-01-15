/**
 * This file contains the default settings for running BDD's
 */
// The breakpoints setting defaults
const breakpoints = {
    mobile: {
        width: 340,
        height: 480
    },
    tablet: {
        width: 1024,
        height: 768
    },
    desktop: {
        width: 1280,
        height: 800
    }
};

// The accessibility setting defaults
const a11y = {
    reportName: 'a11y-temp-report',
    reportType: 'csv'
};

// Puppeteer headless mode
const headless = false;

// Selectors default object
const selectors = {};

// Selector files
const selectorFiles = [];

// The location where the bdd is initialized
const rootPath = './bdd';

// The location where the reports are to be stored
const reportsPath  = './bdd/reports';

// The name of the report
const reportName = 'cruller_report';

module.exports = {
    breakpoints,
    headless,
    a11y,
    selectors,
    selectorFiles,
    rootPath,
    reportsPath,
    reportName,
};
