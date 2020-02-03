const { getScope } = require('../../../../../lib/bdd/core/utils');
const keyboard = require('../../../../../lib/bdd/core/actions/common/keyboard');

jest.mock('../../../../../lib/bdd/core/utils');

describe('keyboard', () => {
    beforeAll(() => {
        const press = jest.fn((value) => value);
        const type = jest.fn();
        getScope.mockImplementation(() => ({
            context: {
                currentPage: {
                    keyboard: {
                        press,
                        type,
                    },
                },
            },
        }));
    });

    describe('pressKeyboardButton', () => {
        afterEach(() => {
            getScope.mockClear();
        });

        it('should press the keyboard button', async () => {
            const press = jest.spyOn(getScope().context.currentPage.keyboard, 'press');
            await keyboard.pressKeyboardButton();
            expect(press).toHaveBeenCalled();
        });
    });

    describe('pressTab', () => {
        afterEach(() => {
            getScope.mockClear();
        });

        it('should press the Tab key', async () => {
            const tab = await keyboard.pressTab();
            expect(tab).toBe('Tab');
        });
    });

    describe('pressEnter', () => {
        afterEach(() => {
            getScope.mockClear();
        });

        it('should press the Enter key', async () => {
            const enter = await keyboard.pressEnter();
            expect(enter).toBe('Enter');
        });
    });

    describe('typeText', () => {
        afterEach(() => {
            getScope.mockClear();
        });

        it('should type text', async () => {
            const type = jest.spyOn(getScope().context.currentPage.keyboard, 'type');
            await keyboard.typeText();
            expect(type).toHaveBeenCalled();
        });
    });
});
