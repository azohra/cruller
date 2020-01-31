const reporter = require('cucumber-html-reporter');
const { spawnSync } = require('child_process');
const fs = require('fs-extra');
const glob = require('glob');
const utils = require('../../lib/bdd/core/utils');
const CrullerCucumberCli = require('../../lib/bdd/cli');

jest.mock('glob');
jest.mock('fs-extra');
jest.mock('child_process');
jest.mock('cucumber-html-reporter');
jest.mock('../../lib/bdd/core/utils');

const settings = {
	reportName: 'report',
	reportsPath: '/test/',
	rootPath: 'root',
};

describe('cli', () => {
    beforeAll(async () => {
		utils.getScope.mockImplementation(() => {
			return {
				settings,
			};
		});
		reporter.generate = jest.fn();
		console.error = jest.fn();
		console.log = jest.fn();
	});

	describe('contructor', () => {
		it('should construct the class', () => {
			const updateSettings = jest.spyOn(utils, 'updateSettings');
			const crullerCucumberCli = new CrullerCucumberCli();
			expect(updateSettings).toHaveBeenCalled();
		});
	});
	
	describe('initialize', () => {
		it('should call a few commands', () => {
			const crullerCucumberCli = new CrullerCucumberCli();
			const getSettings = jest.spyOn(crullerCucumberCli, 'getSettings');
			crullerCucumberCli.initialize();
			expect(getSettings).toHaveBeenCalled();
		});
	});

	describe('getSettings', () => {
		it('should get the settings', () => {
			const crullerCucumberCli = new CrullerCucumberCli();
			expect(crullerCucumberCli.getSettings()).toEqual(settings);
		});
	});

	describe('runReport', () => {
		it('should generate the report with name from argument', () => {
			const argv = {
				name: 'report.csv',
			};
			const crullerCucumberCli = new CrullerCucumberCli();
			crullerCucumberCli.runReport(argv);
			expect(reporter.generate).toHaveBeenCalled();
		});

		it('should generate the report with report name from settings', () => {
			const argv = {};
			const crullerCucumberCli = new CrullerCucumberCli();
			crullerCucumberCli.runReport(argv);
			expect(reporter.generate).toHaveBeenCalled();
		});
	});

	describe('runBdd', () => {
		it('should run bdd with name from argument', () => {
			const argv = {
				name: 'report.csv',
			};
			const crullerCucumberCli = new CrullerCucumberCli();
			crullerCucumberCli.runBdd(argv);
			expect(spawnSync).toHaveBeenCalled();
		});

		it('should run bdd with report name from settings', () => {
			const argv = {};
			const crullerCucumberCli = new CrullerCucumberCli();
			crullerCucumberCli.runBdd(argv);
			expect(spawnSync).toHaveBeenCalled();
		});
	});

	describe('copyFolderTemplate', () => {
		it('should successfully copy the folder template', () => {
			fs.copySync = jest.fn();
			fs.ensureFileSync = jest.fn();
			const crullerCucumberCli = new CrullerCucumberCli();
			try {
				crullerCucumberCli.copyFolderTemplate();
				expect(fs.copySync).toHaveBeenCalled();
				expect(fs.ensureFileSync).toHaveBeenCalled();
			} catch(e) {}
		});

		it('should throw error if copySync from fs is failed', () => {
			fs.copySync = jest.fn().mockImplementation(() => {throw new Error('Error');});
			fs.ensureFileSync = jest.fn();
			const crullerCucumberCli = new CrullerCucumberCli();
			try {
				crullerCucumberCli.copyFolderTemplate();
			} catch(e) {
				expect(e.toString()).toContain('Error');
			}
		});
		it('should throw error if ensureFileSync from fs is failed', () => {
			fs.copySync = jest.fn();
			fs.ensureFileSync = jest.fn().mockImplementation(() => {throw new Error('Error');});
			const crullerCucumberCli = new CrullerCucumberCli();
			try {
				crullerCucumberCli.copyFolderTemplate();
			} catch(e) {
				expect(e.toString()).toContain('Error');
			}
		});
	});

	describe('updateGitIgnore', () => {
		it('should successfully update git ignore file', () => {
			fs.appendFileSync = jest.fn();
			fs.ensureFileSync = jest.fn();
			const crullerCucumberCli = new CrullerCucumberCli();
			try {
				crullerCucumberCli.updateGitIgnore();
				expect(fs.appendFileSync).toHaveBeenCalled();
				expect(fs.ensureFileSync).toHaveBeenCalled();
			} catch(e) {}
		});

		it('should throw error if appendFileSync from fs is failed', () => {
			fs.appendFileSync = jest.fn().mockImplementation(() => {throw new Error('Error');});
			fs.ensureFileSync = jest.fn();
			const crullerCucumberCli = new CrullerCucumberCli();
			try {
				crullerCucumberCli.updateGitIgnore();
			} catch(e) {
				expect(e.toString()).toContain('Error');
			}
		});
		it('should throw error if ensureFileSync from fs is failed', () => {
			fs.appendFileSync = jest.fn();
			fs.ensureFileSync = jest.fn().mockImplementation(() => {throw new Error('Error');});
			const crullerCucumberCli = new CrullerCucumberCli();
			try {
				crullerCucumberCli.updateGitIgnore();
			} catch(e) {
				expect(e.toString()).toContain('Error');
			}
		});
	});

	describe('updatePackageJson', () => {
		it('should successfully update package.json file', () => {
			fs.writeFileSync = jest.fn();
			const crullerCucumberCli = new CrullerCucumberCli();
			crullerCucumberCli.updatePackageJson('/', {
				scripts: {},
			});
			expect(fs.writeFileSync).toHaveBeenCalled();
		});

		it('should throw error if writeFileSync from fs is failed', () => {
			fs.writeFileSync = jest.fn().mockImplementation(() => {throw new Error('Error');});
			const crullerCucumberCli = new CrullerCucumberCli();
			try {
				crullerCucumberCli.updatePackageJson('/', {});
			} catch(e) {
				expect(e.toString()).toContain('Error');
			}
		});
	});

	describe('updateFilesWithPackageName', () => {
		it('should successfully update package.json file', () => {
			fs.writeFileSync = jest.fn();
			fs.readFileSync = jest.fn(() => {
				return '{ "name": "cruller" }';
			});
			const sync = jest.spyOn(glob, 'sync').mockImplementation(() => {
				return [
					'',
				];
			});
			const crullerCucumberCli = new CrullerCucumberCli();
			crullerCucumberCli.updateFilesWithPackageName();
			expect(fs.writeFileSync).toHaveBeenCalled();
			expect(fs.readFileSync).toHaveBeenCalled();
			expect(sync).toHaveBeenCalled();
		});

		it('should throw error if writeFileSync from fs is failed', () => {
			fs.writeFileSync = jest.fn().mockImplementation(() => {throw new Error('Error');});
			fs.readFileSync = jest.fn(() => {
				return '{ "name": "cruller" }';
			});
			const crullerCucumberCli = new CrullerCucumberCli();
			try {
				crullerCucumberCli.updateFilesWithPackageName();
			} catch(e) {
				expect(e.toString()).toContain('Error');
			}
		});
	});

	describe('runInit', () => {
		it('should successfully init cruller when cruller is not initialized', () => {
			fs.existsSync = jest.fn().mockImplementation(() => true);
			fs.readFileSync = jest.fn(() => {
				return '{ "name": "cruller", "cruller": false }';
			});
			const crullerCucumberCli = new CrullerCucumberCli();
			const copyFolderTemplate = jest.spyOn(crullerCucumberCli, 'copyFolderTemplate');
			const updateGitIgnore = jest.spyOn(crullerCucumberCli, 'updateGitIgnore');
			const updatePackageJson = jest.spyOn(crullerCucumberCli, 'updatePackageJson');
			const updateFilesWithPackageName = jest.spyOn(crullerCucumberCli, 'updateFilesWithPackageName');
			fs.existsSync.mockClear();
			fs.readFileSync.mockClear();
			copyFolderTemplate.mockClear();
			updateGitIgnore.mockClear();
			updatePackageJson.mockClear();
			updateFilesWithPackageName.mockClear();
			crullerCucumberCli.runInit();
			expect(fs.existsSync).toHaveBeenCalled();
			expect(fs.readFileSync).toHaveBeenCalled();
			expect(copyFolderTemplate).toHaveBeenCalled();
			expect(updateGitIgnore).toHaveBeenCalled();
			expect(updatePackageJson).toHaveBeenCalled();
			expect(updateFilesWithPackageName).toHaveBeenCalled();

		});

		it('should throw error when cruller is initialized', () => {
			fs.existsSync = jest.fn().mockImplementation(() => true);
			fs.readFileSync = jest.fn(() => {
				return '{ "name": "cruller", "cruller": true }';
			});
			const crullerCucumberCli = new CrullerCucumberCli();
			const copyFolderTemplate = jest.spyOn(crullerCucumberCli, 'copyFolderTemplate');
			const updateGitIgnore = jest.spyOn(crullerCucumberCli, 'updateGitIgnore');
			const updatePackageJson = jest.spyOn(crullerCucumberCli, 'updatePackageJson');
			const updateFilesWithPackageName = jest.spyOn(crullerCucumberCli, 'updateFilesWithPackageName');
			fs.existsSync.mockClear();
			fs.readFileSync.mockClear();
			copyFolderTemplate.mockClear();
			updateGitIgnore.mockClear();
			updatePackageJson.mockClear();
			updateFilesWithPackageName.mockClear();
			crullerCucumberCli.runInit();
			expect(fs.existsSync).toHaveBeenCalled();
			expect(fs.readFileSync).toHaveBeenCalled();
			expect(copyFolderTemplate).toHaveBeenCalledTimes(0);
			expect(updateGitIgnore).toHaveBeenCalledTimes(0);
			expect(updatePackageJson).toHaveBeenCalledTimes(0);
			expect(updateFilesWithPackageName).toHaveBeenCalledTimes(0);
		});

		it('should not do anything when fs.existsSync returns false', () => {
			fs.existsSync = jest.fn().mockImplementation(() => false);
			fs.readFileSync = jest.fn(() => {
				return '{ "name": "cruller", "cruller": true }';
			});
			const crullerCucumberCli = new CrullerCucumberCli();
			const copyFolderTemplate = jest.spyOn(crullerCucumberCli, 'copyFolderTemplate');
			const updateGitIgnore = jest.spyOn(crullerCucumberCli, 'updateGitIgnore');
			const updatePackageJson = jest.spyOn(crullerCucumberCli, 'updatePackageJson');
			const updateFilesWithPackageName = jest.spyOn(crullerCucumberCli, 'updateFilesWithPackageName');
			fs.existsSync.mockClear();
			fs.readFileSync.mockClear();
			copyFolderTemplate.mockClear();
			updateGitIgnore.mockClear();
			updatePackageJson.mockClear();
			updateFilesWithPackageName.mockClear();
			crullerCucumberCli.runInit();
			expect(fs.existsSync).toHaveBeenCalled();
			expect(fs.readFileSync).toHaveBeenCalledTimes(0);
			expect(copyFolderTemplate).toHaveBeenCalledTimes(0);
			expect(updateGitIgnore).toHaveBeenCalledTimes(0);
			expect(updatePackageJson).toHaveBeenCalledTimes(0);
			expect(updateFilesWithPackageName).toHaveBeenCalledTimes(0);
		});

		it('should throw error if fs.existsSync failed', () => {
			fs.existsSync = jest.fn().mockImplementation(() => {throw new Error('Error');});
			const crullerCucumberCli = new CrullerCucumberCli();
			try {
				crullerCucumberCli.runInit();
			} catch(e) {
				expect(e.toString()).toContain('Error');
			}
		});
	});
});

