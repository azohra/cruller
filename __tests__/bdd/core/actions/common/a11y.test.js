const fs = require('fs');
const { getSelector, getScope } = require('../../../../../lib/bdd/core/utils');
const a11y = require('../../../../../lib/bdd/core/actions/common/a11y');
const AxeReports = require('axe-reports');
const { AxePuppeteer } = require('axe-puppeteer');

jest.mock('fs');
jest.mock('path');
jest.mock('axe-reports');
jest.mock('axe-puppeteer');
jest.mock('../../../../../lib/bdd/core/utils');

describe('a11y', () => {
	beforeAll(() => {
		getScope.mockImplementation(() => ({
			attach: jest.fn(),
			context: {
				currentPage: {},
			},
			settings: {
				reportsPath: 'test/path',
				a11y: {
					reportName: 'Test',
					reportType: 'csv'
				}
			}
		}));
		getSelector.mockImplementation(jest.fn())
	});
	describe('createA11yReport', () => {
		let processResults;
		let readFile;
		afterEach(() => {
			if(processResults) {
				processResults.mockReset();
			}
			if(readFile) {
				readFile.mockReset();
			}
		});
		it('should generate report', async () => {
			processResults = jest.spyOn(AxeReports, 'processResults');
			await a11y.createA11yReport({});
			expect(processResults).toHaveBeenCalled();
		});
		it('should throw and error on file read', async () => {
			processResults = jest.spyOn(AxeReports, 'processResults');
			jest.spyOn(fs, 'readFile').mockImplementation((_, cb) => cb('Error'));
			try {
				await a11y.createA11yReport({});
			} catch(e) {
				expect(processResults).toHaveBeenCalled();
				expect(e.toString()).toContain('Error');
			}
		});
		it('should throw and error on generating report', async () => {
			processResults = jest.spyOn(AxeReports, 'processResults').mockImplementation(() => {
				throw new Error('Error');
			});
			try {
				await a11y.createA11yReport({});
			} catch(e) {
				expect(processResults).toHaveBeenCalled();
				expect(e.toString()).toContain('Error');
			}
		});
	});

	describe('checkPageA11y', () => {
		it('should attach report', async () => {
			jest.spyOn(fs, 'readFile').mockImplementation((_, cb) => cb());
			const scope = getScope();
			// const attach = jest.spyOn(scope, 'attach');
			const analyze = jest.spyOn(AxePuppeteer.prototype, 'analyze');
			// const report = jest.spyOn(a11y, 'createA11yReport').mockImplementation(jest.fn(() => Promise.resolve('test')));
			await a11y.checkPageA11y();
			expect(analyze).toHaveBeenCalled();
			// expect(report).toHaveBeenCalled();
			// expect(attach).toHaveBeenCalled();
		});
	});

	describe('checkElementA11y', () => {
		it('should attach report', async () => {
			const scope = getScope();
			// const attach = jest.spyOn(scope, 'attach');
			const analyze = jest.spyOn(AxePuppeteer.prototype, 'analyze');
			const include = jest.spyOn(AxePuppeteer.prototype, 'include');
			// const report = jest.spyOn(a11y, 'createA11yReport').mockImplementation(jest.fn(() => Promise.resolve('test')));
			await a11y.checkElementA11y();
			expect(analyze).toHaveBeenCalled();
			expect(include).toHaveBeenCalled();
			// expect(report).toHaveBeenCalled();
			// expect(attach).toHaveBeenCalled();
		});
	});
});
