'use strict';

const axeReports = jest.genMockFromModule('axe-reports');

axeReports.processResults = jest.fn();

module.exports = axeReports;
