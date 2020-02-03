const cosmiconfig = require('cosmiconfig');
const glob = require('glob');
const scope = require('../../../../lib/bdd/core/scope');
const defaultSettings = require('../../../../lib/bdd/core/utils/default-settings');
const utils = require('../../../../lib/bdd/core/utils');

jest.mock('cosmiconfig');
jest.mock('glob');

describe('utils', () => {
    beforeAll(() => {
        const searchSync = jest.fn();
        cosmiconfig.mockImplementation(() => {
            return {
                searchSync,
            };
        });
        scope.settings = {
            selectors: {
                hello: 'world',
            }
        };
    });

    describe('getSelector', () => {
        it('should get the selector from the scope if exists', () => {
            expect(utils.getSelector('hello')).toBe('world');
        });

        it('should get the string parameter if does not exists', () => {
            expect(utils.getSelector('test')).toBe('test');
        });
    });

    describe('updateSettings', () => {
        it('should update the settings', () => {
            const sync = jest.spyOn(glob, 'sync').mockImplementation(() => {
                return [
                    '',
                ];
            });
            const search = jest.spyOn(cosmiconfig(), 'searchSync').mockImplementation(() => {
                return {
                    config: {
                        selectorFiles: ['./bin/folderStructureBdd/support/selectors/**/*.js'],
                    },
                };
            });
            utils.updateSettings();
            expect(search).toHaveBeenCalled();
            expect(sync).toHaveBeenCalled();
        });

        it('should not update the settings when search is undefined', () => {
            const sync = jest.spyOn(glob, 'sync').mockImplementation(() => {
                return [
                    '',
                ];
            });
            const search = jest.spyOn(cosmiconfig(), 'searchSync').mockImplementation(() => {
                return null;
            });
            sync.mockClear();
            utils.updateSettings();
            expect(search).toHaveBeenCalled();
            expect(sync).toHaveBeenCalledTimes(0);
            expect(scope.settings).toEqual(defaultSettings);
        });

        it('should not update the settings when config is undefined', () => {
            const sync = jest.spyOn(glob, 'sync').mockImplementation(() => {
                return [
                    '',
                ];
            });
            const search = jest.spyOn(cosmiconfig(), 'searchSync').mockImplementation(() => {
                return {
                    config: null,
                };
            });
            sync.mockClear();
            utils.updateSettings();
            expect(search).toHaveBeenCalled();
            expect(sync).toHaveBeenCalledTimes(0);
            expect(scope.settings).toEqual(defaultSettings);
        });
    });

    describe('getScope', () => {
        it('should get the scope', () => {
            expect(utils.getScope()).toBe(scope);
        });
    });
});
