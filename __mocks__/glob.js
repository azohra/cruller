'use strict';

const glob = jest.genMockFromModule('glob');

glob.sync = jest.fn();

module.exports = glob;
