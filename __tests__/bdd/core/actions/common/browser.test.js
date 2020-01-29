jest.mock('../../../../../lib/bdd/core/utils');
const { getScope } = require('../../../../../lib/bdd/core/utils');
const { closeBrowser, openBrowser } = require('../../../../../lib/bdd/core/actions/common/browser');

describe('Run browser action validation', () => {
	beforeEach(() => {
		getScope.mockClear();
	});

	test('check for closeBrowser will be called', () => {
		const close = jest.fn();
		getScope.mockImplementation(() => {
			return {
				browser: {
					close,
				},
			};
		});
		closeBrowser();
		expect(getScope.mock.calls.length).toBe(1);
		expect(getScope().browser.close.mock.calls.length).toBe(1);
	});

	test('check for connect function in openBrowser will be called with browserless', () => {
		process.env = {
			PIPELINE: 'true',
			BROWSERLESS_KEY: 'some-key',
		};
		const connect = jest.fn();
		const launch = jest.fn();
		getScope.mockImplementation(() => {
			return {
				browser: null,
				settings: {
					headless: true,
				},
				driver: {
					connect,
					launch,
				},
			};
		});
		openBrowser();
		expect(getScope.mock.calls.length).toBe(1);
		expect(getScope().driver.connect.mock.calls.length).toBe(1);
		expect(getScope().driver.launch.mock.calls.length).toBe(0);
	});

	test('check for launch function in openBrowser will be called with browserless', () => {
		process.env = {
			PIPELINE: 'false',
			BROWSERLESS_KEY: 'some-key',
		};
		const connect = jest.fn();
		const launch = jest.fn();
		getScope.mockImplementation(() => {
			return {
				browser: null,
				settings: {
					headless: true,
				},
				driver: {
					connect,
					launch,
				},
			};
		});
		openBrowser();
		expect(getScope.mock.calls.length).toBe(1);
		expect(getScope().driver.connect.mock.calls.length).toBe(0);
		expect(getScope().driver.launch.mock.calls.length).toBe(1);
	});
});
