const get = require('lodash.get');
const fs = require('fs');
const { getSelector, getScope } = require('../../../../../lib/bdd/core/utils');
const utils = require('../../../../../lib/bdd/core/actions/common/utils');
const scope = require('../../../../../lib/bdd/core/scope');
const defaultSettings = require('../../../../../lib/bdd/core/utils/default-settings');

jest.mock('fs');
jest.mock('path');
jest.mock('lodash.get');
jest.mock('../../../../../lib/bdd/core/actions/common/browser');
jest.mock('../../../../../lib/bdd/core/utils');

describe('utils', () => {
    beforeAll(() => {
        const waitForSelector = jest.fn(() => 'test');
        const screenshot = jest.fn(() => Promise.resolve('test'));
        const attach = jest.fn();
        getScope.mockImplementation(() => ({
            context: {
                currentPage: {
                    waitForSelector,
                    screenshot,
                },
            },
            attach,
            settings: {
                reportsPath: '/reports/'
            },
        }));
        getSelector.mockImplementation(jest.fn());
    });

    describe('wait', () => {
        afterEach(() => {
            getScope.mockClear();
        });

        it('should call the delay function within wait', async () => {
            const setTimeout = jest.spyOn(window, 'setTimeout');
            await utils.wait(0);
            expect(setTimeout).toHaveBeenCalled();
        });
    });

    describe('elementPresent', () => {
        afterEach(() => {
            getScope.mockClear();
        });

        it('should present the element with context', async () => {
            const context = {
                waitForSelector: jest.fn(() => 'test'),
            };
            const waitForSelector = jest.spyOn(context, 'waitForSelector');
            await utils.elementPresent(null, context);
            expect(waitForSelector).toHaveBeenCalled();
        });

        it('should present the element without context', async () => {
            const waitForSelector = jest.spyOn(getScope().context.currentPage, 'waitForSelector');
            await utils.elementPresent();
            expect(waitForSelector).toHaveBeenCalled();
        });
    });

    describe('setBreakpoint', () => {
        afterEach(() => {
            getScope.mockClear();
        });

        it('should present the element with context', async () => {
            await utils.setBreakpoint('desktop');
            expect(scope.breakpoint).toBe(get(
                scope,
                'settings.breakpoints.desktop',
                defaultSettings.breakpoints.desktop
            ));
        });
    });

    describe('takeScreenshot', () => {
        afterEach(() => {
            getScope.mockClear();
        });

        it('should present the element with context', async () => {
            fs.existsSync = jest.fn(() => true);
            const screenshot = jest.spyOn(getScope().context.currentPage, 'screenshot');
            const attach = jest.spyOn(getScope(), 'attach');
            await utils.takeScreenshot();
            expect(screenshot).toHaveBeenCalled();
            expect(attach).toHaveBeenCalled();
        });

        it('should screenshot and attach not being called when existsSync is false', async () => {
            fs.existsSync = jest.fn(() => false);
            const screenshot = jest.spyOn(getScope().context.currentPage, 'screenshot');
            const attach = jest.spyOn(getScope(), 'attach');
            screenshot.mockClear();
            attach.mockClear();
            await utils.takeScreenshot();
            expect(screenshot).toHaveBeenCalledTimes(0);
            expect(attach).toHaveBeenCalledTimes(0);
        });
    });
});
