const { getSelector, getScope } = require('../../../../../lib/bdd/core/utils');
const { elementPresent } = require('../../../../../lib/bdd/core/actions/common/utils');
const { assert } = require('chai');
const form = require('../../../../../lib/bdd/core/actions/common/form');

jest.mock('../../../../../lib/bdd/core/actions/common/utils')
jest.mock('../../../../../lib/bdd/core/utils');

let input = {
	value: 'test',
};

describe('form', () => {
	beforeAll(() => {
		const press = jest.fn();
		const $eval = jest.fn((_, cb) => cb(input));
		const focus = jest.fn();
		const type = jest.fn();
		const select = jest.fn();
		getScope.mockImplementation(() => ({
			context: {
				currentPage: {
					$eval,
					focus,
					type,
					keyboard: {
						press,
					},
					select,
				},
			},
		}));
		getSelector.mockImplementation(jest.fn());
	});

	describe('getValue', () => {
		afterEach(() => {
			getScope.mockClear();
			elementPresent.mockClear();
			
		});

		it('should get the form value', async () => {
			const $eval = jest.spyOn(getScope().context.currentPage, '$eval');
			await form.getValue();
			expect($eval).toHaveBeenCalled();
		});
	});

	describe('hasValue', () => {
		afterEach(() => {
			getScope.mockClear();
			elementPresent.mockClear();
			
		});

		it('should check form has value', async () => {
			const $eval = jest.spyOn(getScope().context.currentPage, '$eval');
			const equal = jest.spyOn(assert, 'equal');
			await form.hasValue(null, input.value);
			expect(elementPresent.mock.calls.length).toBe(1);
			expect($eval).toHaveBeenCalled();
			expect(equal).toHaveBeenCalled();
		});
	});

	describe('fillInFormField', () => {
		afterEach(() => {
			getScope.mockClear();
			elementPresent.mockClear();
			
		});

		it('should fill in form field', async () => {
			const focus = jest.spyOn(getScope().context.currentPage, 'focus');
			const type = jest.spyOn(getScope().context.currentPage, 'type');
			await form.fillInFormField();
			expect(elementPresent.mock.calls.length).toBe(1);
			expect(focus).toHaveBeenCalled();
			expect(type).toHaveBeenCalled();
		});
	});

	describe('emptyFormField', () => {
		afterEach(() => {
			getScope.mockClear();
			elementPresent.mockClear();
		});

		it('should empty form field', async () => {
			const focus = jest.spyOn(getScope().context.currentPage, 'focus');
			const press = jest.spyOn(getScope().context.currentPage.keyboard, 'press');
			await form.emptyFormField();
			expect(elementPresent.mock.calls.length).toBe(1);
			expect(focus).toHaveBeenCalled();
			expect(press).toHaveBeenCalled();
			expect(press).toHaveBeenCalledTimes(Number(input.value.length + 1));
		});
	});

	describe('selectValueFromField', () => {
		afterEach(() => {
			getScope.mockClear();
			elementPresent.mockClear();
			
		});

		it('should select value from field', async () => {
			const select = jest.spyOn(getScope().context.currentPage, 'select');
			await form.selectValueFromField();
			expect(elementPresent.mock.calls.length).toBe(1);
			expect(select).toHaveBeenCalled();
		});
	});
});
