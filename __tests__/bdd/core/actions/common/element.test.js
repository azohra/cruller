const { getSelector, getScope } = require('../../../../../lib/bdd/core/utils');
const { elementPresent } = require('../../../../../lib/bdd/core/actions/common/utils');
const element = require('../../../../../lib/bdd/core/actions/common/element');

jest.mock('../../../../../lib/bdd/core/actions/common/utils')
jest.mock('../../../../../lib/bdd/core/utils');

let elem;

describe('element', () => {
	beforeAll(() => {
		const click = jest.fn();
		const contentFrame = jest.fn(() => {
			return {
				click,
			};
		})
		const $eval = jest.fn((_, cb) => {
			cb(elem);
			return 'test';
		});
		const hover = jest.fn();
		const $ = jest.fn(() => {
			return {
				contentFrame,
			};
		});
		elem = document.createElement('div');    
		getScope.mockImplementation(() => ({
			context: {
				currentPage: {
					$eval,
					hover,
					$,
				},
			},
		}));
		getSelector.mockImplementation(jest.fn());
	});

	describe('focusItem', () => {
		afterEach(() => {
			getScope.mockClear();
			elementPresent.mockClear();
		});

		it('should focus on item', async () => {
			const $eval = jest.spyOn(getScope().context.currentPage, '$eval');
			const focus = jest.spyOn(elem, 'focus');
			focus.mockClear();
			await element.focusItem();
			expect(elementPresent.mock.calls.length).toBe(1);
			expect($eval).toHaveBeenCalled();
			expect(focus).toHaveBeenCalled();
		});
	});

	describe('hoverItem', () => {
		afterEach(() => {
			getScope.mockClear();
			elementPresent.mockClear();
		});

		it('should hover on item', async () => {
			const hover = jest.spyOn(getScope().context.currentPage, 'hover');
			await element.hoverItem({});
			expect(elementPresent.mock.calls.length).toBe(1);
			expect(hover).toHaveBeenCalled();
		});
	});

	describe('clickItem', () => {
		afterEach(() => {
			getScope.mockClear();
			elementPresent.mockClear();
		});

		it('should click on item', async () => {
			const $eval = jest.spyOn(getScope().context.currentPage, '$eval');
			const click = jest.spyOn(elem, 'click');
			click.mockClear();
			await element.clickItem();
			expect(elementPresent.mock.calls.length).toBe(1);
			expect($eval).toHaveBeenCalled();
			expect(click).toHaveBeenCalled();
		});
	});

	describe('hasText', () => {
		afterEach(() => {
			getScope.mockClear();
			elementPresent.mockClear();
		});

		it('should has text', async () => {
			const $eval = jest.spyOn(getScope().context.currentPage, '$eval');
			await element.hasText(null, /test/);
			expect(elementPresent.mock.calls.length).toBe(1);
			expect($eval).toHaveBeenCalled();
		});
	});

	describe('clickOnIframeElement', () => {
		afterEach(() => {
			getScope.mockClear();
			elementPresent.mockClear();
		});

		it('should click on iframe element', async () => {
			const $ = jest.spyOn(getScope().context.currentPage, '$');
			const contentFrame = jest.spyOn(getScope().context.currentPage.$(), 'contentFrame');
			const click = jest.spyOn(getScope().context.currentPage.$().contentFrame(), 'click');
			await element.clickOnIframeElement();
			expect(elementPresent.mock.calls.length).toBe(2);
			expect($).toHaveBeenCalled();
			expect(contentFrame).toHaveBeenCalled();
			expect(click).toHaveBeenCalled();
		});
	});
});
