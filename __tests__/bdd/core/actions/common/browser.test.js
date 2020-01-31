const { getScope } = require('../../../../../lib/bdd/core/utils');
const { closeBrowser, openBrowser } = require('../../../../../lib/bdd/core/actions/common/browser');

jest.mock('../../../../../lib/bdd/core/utils');

describe('browser', () => {
	beforeEach(() => {
		getScope.mockClear();
	});

	describe('closeBrowser', () => {
		afterEach(() => {
			getScope.mockClear();
		});

		it('check for close will be called', () => {
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

		it('check for close will not be called when browser is null', () => {
			getScope.mockImplementation(() => {
				return {
					browser: null,
				};
			});
			closeBrowser();
			expect(getScope.mock.calls.length).toBe(1);
		});
	});

	describe('openBrowser', () => {
		afterEach(() => {
			getScope.mockClear();
		});

		it('check for connect function in openBrowser will be called with browserless', () => {
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

		it('check for launch function in openBrowser will be called with browserless', () => {
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

		it('check for neither connect nor launch in openBrowser will be called', () => {
			process.env = {
				PIPELINE: 'false',
				BROWSERLESS_KEY: 'some-key',
			};
			const connect = jest.fn();
			const launch = jest.fn();
			getScope.mockImplementation(() => {
				return {
					browser: {
						close: jest.fn(),
					},
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
			expect(getScope().driver.launch.mock.calls.length).toBe(0);
		});
}	);
});
