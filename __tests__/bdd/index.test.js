jest.mock('cucumber');
jest.mock('puppeteer');
jest.mock('lodash.get');
const CrullerCucumber = require('../../lib/bdd/index');
const { setDefaultTimeout, setWorldConstructor } = require('cucumber');
const get = require('lodash.get');
const puppeteer = require('puppeteer')
const utils = require('../../lib/bdd/core/utils/index');
const scope = require('../../lib/bdd/core/scope');
const defaultSettings = require('../../lib/bdd/core/utils/default-settings');
jest.mock('../../lib/bdd/core/utils/index');
jest.mock('../../lib/bdd/core/scope');

const cucumberWorldParams = {
	attach: 'attach',
	parameters: 'parameters'
};

describe('Run index validation', () => {
	beforeEach(() => {
		setDefaultTimeout.mockClear();
		setWorldConstructor.mockClear();
	});
	
    test('check for CrullerCucumber type', () => {
        expect(typeof CrullerCucumber).toBe('function');
	});
	
	test('check for setDefaultTimeout will be called', () => {
		CrullerCucumber();
        expect(setDefaultTimeout.mock.calls.length).toBe(1);
	});
	
	test('check for setDefaultTimeout will be called with correct value', () => {
		CrullerCucumber();
        expect(setDefaultTimeout.mock.calls[0][0]).toBe(60 * 1000);
	});
	
	test('check for setWorldConstructor will be called', () => {
		CrullerCucumber();
        expect(setWorldConstructor.mock.calls.length).toBe(1);
	});

	test('check for updateSettings in cucumberWorld will be called', () => {
		setWorldConstructor.mockImplementation((cucumberWorld) => cucumberWorld(cucumberWorldParams));
		const spy = jest.spyOn(utils, 'updateSettings');
		CrullerCucumber();
		expect(spy).toHaveBeenCalled();
	});

	test('check for scope in cucumberWorld will be set correctly', () => {
		setWorldConstructor.mockImplementation((cucumberWorld) => cucumberWorld(cucumberWorldParams));
		CrullerCucumber();
		expect(scope.breakpoint).toBe(get(
            scope,
            'settings.breakpoints.desktop',
            defaultSettings.breakpoints.desktop
        ));
		expect(scope.attach).toBe(cucumberWorldParams.attach);
		expect(scope.parameters).toBe(cucumberWorldParams.parameters);
		expect(scope.driver).toBe(puppeteer);
		expect(scope.context).toStrictEqual({});
		expect(scope.customData).toStrictEqual({});
	});
});
