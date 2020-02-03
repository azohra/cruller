const { getSelector, getScope } = require('../../../../../lib/bdd/core/utils');
const { setBreakpoint } = require('../../../../../lib/bdd/core/actions/common/utils');
const browser = require('../../../../../lib/bdd/core/actions/common/browser');
const page = require('../../../../../lib/bdd/core/actions/common/page');

jest.mock('../../../../../lib/bdd/core/actions/common/browser');
jest.mock('../../../../../lib/bdd/core/actions/common/utils');
jest.mock('../../../../../lib/bdd/core/utils');

describe('page', () => {
    beforeAll(() => {
        const reload = jest.fn();
        const newPage = jest.fn(() => {
            return {
                setViewport,
                goto,
            };
        });
        const createIncognitoBrowserContext = jest.fn(() => {
            return {
                newPage,
            };
        });
        const waitForNavigation = jest.fn();
        const setViewport = jest.fn();
        const goto = jest.fn();
        const evaluate = jest.fn((cb) => cb());
        const title = jest.fn(() => 'test');
        getScope.mockImplementation(() => ({
            context: {
                currentPage: {
                    reload,
                    waitForNavigation,
                    title,
                    setViewport,
                    goto,
                    evaluate,
                },
            },
            breakpoint: {
                height: 600,
                width: 600,
            },
            browser: {
                newPage,
                createIncognitoBrowserContext,
            },
        }));
        getSelector.mockImplementation(jest.fn());
        window.scrollBy = jest.fn();
    });

    describe('reloadPage', () => {
        afterEach(() => {
            getScope.mockClear();
            setBreakpoint.mockClear();
        });

        it('should reload current page', async () => {
            const reload = jest.spyOn(getScope().context.currentPage, 'reload');
            await page.reloadPage();
            expect(reload).toHaveBeenCalled();
        });
    });

    describe('waitForPageNavigation', () => {
        afterEach(() => {
            getScope.mockClear();
            setBreakpoint.mockClear();
        });

        it('should wait for page navigation', async () => {
            const waitForNavigation = jest.spyOn(getScope().context.currentPage, 'waitForNavigation');
            await page.waitForPageNavigation();
            expect(waitForNavigation).toHaveBeenCalled();
        });
    });

    describe('hasPageTitle', () => {
        afterEach(() => {
            getScope.mockClear();
            setBreakpoint.mockClear();
        });

        it('should check if has page title', async () => {
            const title = jest.spyOn(getScope().context.currentPage, 'title');
            await page.hasPageTitle('test');
            expect(title).toHaveBeenCalled();
        });
    });

    describe('goToURL', () => {
        afterEach(() => {
            getScope.mockClear();
            setBreakpoint.mockClear();
        });

        it('should go to expected url', async () => {
            process.env = {
                BREAKPOINT: true,
            };
            const openBrowser = jest.spyOn(browser, 'openBrowser');
            const setViewport = jest.spyOn(getScope().context.currentPage, 'setViewport');
            const goto = jest.spyOn(getScope().context.currentPage, 'goto');
            await page.goToURL('test');
            expect(setBreakpoint.mock.calls.length).toBe(1);
            expect(openBrowser).toHaveBeenCalled();
            expect(setViewport).toHaveBeenCalled();
            expect(goto).toHaveBeenCalled();
        });

        it('should go to expected url incognito view', async () => {
            process.env = {
                BREAKPOINT: false,
            };
            const openBrowser = jest.spyOn(browser, 'openBrowser');
            const setViewport = jest.spyOn(getScope().context.currentPage, 'setViewport');
            const goto = jest.spyOn(getScope().context.currentPage, 'goto');
            const createIncognitoBrowserContext = jest.spyOn(getScope().browser, 'createIncognitoBrowserContext');
            const newPage = jest.spyOn(getScope().browser.createIncognitoBrowserContext(), 'newPage');
            await page.goToURL('test', true);
            expect(setBreakpoint.mock.calls.length).toBe(0);
            expect(openBrowser).toHaveBeenCalled();
            expect(setViewport).toHaveBeenCalled();
            expect(goto).toHaveBeenCalled();
            expect(createIncognitoBrowserContext).toHaveBeenCalled();
            expect(newPage).toHaveBeenCalled();
        });
    });

    describe('autoScroll', () => {
        afterEach(() => {
            getScope.mockClear();
            setBreakpoint.mockClear();
        });

        it('should auto scroll with clearInterval being called', async () => {
            const evaluate = jest.spyOn(getScope().context.currentPage, 'evaluate');
            const clearInterval = jest.spyOn(window, 'clearInterval');
            await page.autoScroll();
            expect(evaluate).toHaveBeenCalled();
            expect(clearInterval).toHaveBeenCalled();
        });

        it('should clearInterval in auto scroll always being called once', async () => {
            const evaluate = jest.spyOn(getScope().context.currentPage, 'evaluate');
            const clearInterval = jest.spyOn(window, 'clearInterval');
            clearInterval.mockClear();
            jest.spyOn(document.body, 'scrollHeight', 'get').mockImplementation(() => 300);
            await page.autoScroll();
            expect(evaluate).toHaveBeenCalled();
            expect(clearInterval).toHaveBeenCalledTimes(1);
        });
    });
});
