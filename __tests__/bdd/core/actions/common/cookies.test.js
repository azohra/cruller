const { getScope } = require('../../../../../lib/bdd/core/utils');
const { assert } = require('chai');
const cookies = require('../../../../../lib/bdd/core/actions/common/cookies');

jest.mock('chai');
jest.mock('lodash.get');
jest.mock('../../../../../lib/bdd/core/utils');

describe('cookies', () => {
	beforeAll(() => {
		const setCookie = jest.fn();
		const deleteCookie = jest.fn();
		const cookies = jest.fn(() => {
			return ['hello', 'world'];
		});
		getScope.mockImplementation(() => ({
			context: {
				currentPage: {
					setCookie,
					deleteCookie,
					cookies,
				},
			},
		}));
	});

	describe('setCookie', () => {
		afterEach(() => {
			getScope.mockClear();
		});

		it('should call setCookie', async () => {
			const setCookie = jest.spyOn(getScope().context.currentPage, 'setCookie');
			await cookies.setCookie({});
			expect(setCookie).toHaveBeenCalled();
		});
	});

	describe('getCookie', () => {
		afterEach(() => {
			getScope.mockClear();
		});

		it('should get the correct cookie', async () => {
			const getCookies = jest.spyOn(getScope().context.currentPage, 'cookies');
			const notEqual = jest.spyOn(assert, 'notEqual');
			const equal = jest.spyOn(assert, 'equal');
			await cookies.getCookie({});
			expect(getCookies).toHaveBeenCalled();
			expect(notEqual).toHaveBeenCalled();
			expect(equal).toHaveBeenCalled();
		});
	});

	describe('deleteCookie', () => {
		afterEach(() => {
			getScope.mockClear();
		});

		it('should call deleteCookie', async () => {
			const deleteCookie = jest.spyOn(getScope().context.currentPage, 'deleteCookie');
			await cookies.deleteCookie({});
			expect(deleteCookie).toHaveBeenCalled();
		});
	});

	describe('setCookies', () => {
		afterEach(() => {
			getScope.mockClear();
		});

		it('should call setCookies', async () => {
			const hashes = jest.fn().mockImplementation(() => {
				return [Promise.resolve(['hello', 'world'])];
			});
			const data = {
				hashes,
			};
			const setCookie = jest.spyOn(getScope().context.currentPage, 'setCookie');
			await cookies.setCookies(data);
			expect(setCookie).toHaveBeenCalled();
			expect(setCookie).toHaveBeenCalledTimes(2);
		});
	});

	describe('getCookies', () => {
		afterEach(() => {
			getScope.mockClear();
		});

		it('should call getCookies', async () => {
			const hashes = jest.fn().mockImplementation(() => {
				return [Promise.resolve(['hello', 'world'])];
			});
			const data = {
				hashes,
			};
			const getCookie = jest.spyOn(getScope().context.currentPage, 'cookies');
			await cookies.getCookies(data);
			expect(getCookie).toHaveBeenCalled();
			expect(getCookie).toHaveBeenCalledTimes(2);
		});
	});

	describe('deleteCookies', () => {
		afterEach(() => {
			getScope.mockClear();
		});

		it('should call deleteCookies', async () => {
			const hashes = jest.fn().mockImplementation(() => {
				return [Promise.resolve(['hello', 'world'])];
			});
			const data = {
				hashes,
			};
			const deleteCookie = jest.spyOn(getScope().context.currentPage, 'deleteCookie');
			await cookies.deleteCookies(data);
			expect(deleteCookie).toHaveBeenCalled();
			expect(deleteCookie).toHaveBeenCalledTimes(2);
		});
	});
});
