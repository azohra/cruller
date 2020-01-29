jest.mock('glob');
jest.mock('fs-extra');
jest.mock('path');
jest.mock('yargs');
jest.mock('child_process');
jest.mock('cucumber-html-reporter');
jest.mock('../../lib/bdd/core/utils/index');

const CrullerCucumberCli = require('../../lib/bdd/cli');
const { updateSettings, getScope } = require('../../lib/bdd/core/utils/index');
getScope.mockImplementation(() => {
	return {
		settings: 'settings',
	};
});



describe('Run cli validation', () => {
	let crullerCucumberCli;

    beforeAll(async () => {
        crullerCucumberCli = new CrullerCucumberCli();
        await crullerCucumberCli.initialize();
    });
	
	test('check for crullerCucumberCli is properly constructed', () => {
		expect(CrullerCucumberCli.config).toEqual({
            templatesRoot: '',
        });
		expect(updateSettings.mock.calls.length).toBe(1);
		expect(crullerCucumberCli.initialize.mock.calls.length).toBe(1);
	});
});

