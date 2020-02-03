const fs = require('fs');
const path = require('path');
const { getSelector, getScope } = require('../../utils');
const { AxePuppeteer } = require('axe-puppeteer');
const AxeReports = require('axe-reports');

/**
 * Function to generate the  a11y report
 * @param {object} results The  axe-core results
 */
const createA11yReport = async results => {
    const scope = getScope();
    const { a11y, reportsPath } = scope.settings;
    const { reportName, reportType } = a11y;
    return await new Promise(async (resolve, reject) => {
        try {
            // Create the temp report based on results
            AxeReports.processResults(
                results,
                reportType,
                path.resolve(process.cwd(), path.join(reportsPath, reportName)),
                true
            );
            // Push the file output to buffer to be attached to cucumber report
            fs.readFile(
                path.resolve(
                    process.cwd(),
                    path.join(reportsPath, `${reportName}.${reportType}`)
                ),
                (err, buffer) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve(buffer);
                }
            );
        } catch (e) {
            reject(e);
        }
    });
};

/**
 * Function to check the a11y of the current page and attach report
 */
const checkPageA11y = async () => {
    const scope = getScope();
    const { attach, context } = scope;
    const { currentPage } = context;
    const results = await new AxePuppeteer(currentPage).analyze();
    const report = await createA11yReport(results);
    // Attach report to the cucumber object
    return attach(report, 'text/csv');
};

/**
 * Function to check the a11y of an element and attach report
 * @param {string} selector The element selector
 */
const checkElementA11y = async selector => {
    const scope = getScope();
    const { attach, context } = scope;
    const { currentPage } = context;
    const results = await new AxePuppeteer(currentPage)
        .include(getSelector(selector))
        .analyze();
    const report = await createA11yReport(results);
    // Attach report to the cucumber object
    return attach(report, 'text/csv');
};

module.exports = {
    createA11yReport,
    checkPageA11y,
    checkElementA11y
};
