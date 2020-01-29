'use strict';


const AxePuppeteer = jest.fn();
AxePuppeteer.prototype.analyze = jest.fn();
AxePuppeteer.prototype.include = jest.fn(() => {
	return {
		analyze: jest.fn(),
	};
});

module.exports = {
	AxePuppeteer,
};
