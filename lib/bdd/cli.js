const glob = require('glob');
const fs = require('fs-extra');
const path = require('path');
const yargs = require('yargs');
const { spawnSync } = require('child_process');
const reporter = require('cucumber-html-reporter');
const { updateSettings, getScope } = require('./core/utils');

/**
 * CLI class for cruller cucumber
 */
class CrullerCucumberCli {
    constructor(
        config = {
            templatesRoot: ''
        }
    ) {
        // Set config object
        this.config = config;
        // Update the scope object
        updateSettings();
        // Initialize the CLI using yargs
        this.initialize();
    }

    /**
	 * Function to create the report based on the bdd run
	 * @param {object} argv The command line arguments provided by yargs
	 */
    runReport(argv) {
        // Get settings from scope settings
        const { reportsPath, reportName } = this.getSettings();
        const fileName = argv.name || reportName;
        const screenshotsFolderName = 'screenshots';
        const options = {
            theme: 'bootstrap',
            jsonFile: path.resolve(
                process.cwd(),
                path.join(reportsPath, `${fileName}.json`)
            ),
            output: path.resolve(
                process.cwd(),
                path.join(reportsPath, `${fileName}.html`)
            ),
            reportSuiteAsScenarios: true,
            scenarioTimestamp: true,
            launchReport: true,
            screenshotsDirectory: path.resolve(
                process.cwd(),
                path.join(reportsPath, screenshotsFolderName)
            ),
            storeScreenshots: true
        };
        // Generate the report
        reporter.generate(options);
    }

    /**
	 * Function to run the  cucumber bdd
	 * @param {object} argv The yargs object
	 */
    runBdd(argv) {
        // Get settings from scope settings
        const { reportsPath, reportName, rootPath } = this.getSettings();
        const bddDirPath = path.resolve(process.cwd(), rootPath);
        const reportFileName = `${argv.name || reportName}.json`;
        const reportFilePath = path.resolve(
            process.cwd(),
            path.join(reportsPath, reportFileName)
        );
        spawnSync(
            './node_modules/.bin/cucumber-js',
            [
                bddDirPath,
                '-r',
                bddDirPath,
                '-f',
                `json:${reportFilePath}`,
                ...process.argv.slice(2)
            ],
            {
                shell: true,
                stdio: 'inherit'
            }
        );
    }

    /**
	 * Function to copy the base bdd template to project folder
	 */
    copyFolderTemplate() {
        // Get template root
        const { templatesRoot } = this.config;
        // Get settings from scope settings
        const { reportsPath, rootPath } = this.getSettings();
        try {
            fs.copySync(
                path.join(templatesRoot, 'folderStructureBdd', 'feature-files'),
                path.resolve(process.cwd(), `./${rootPath}/feature-files`),
                {
                    overwrite: false,
                    errorOnExist: true
                }
            );
            fs.copySync(
                path.join(templatesRoot, 'folderStructureBdd', 'step_definitions'),
                path.resolve(process.cwd(), `./${rootPath}/step_definitions`),
                {
                    overwrite: false,
                    errorOnExist: true
                }
            );
            fs.copySync(
                path.join(templatesRoot, 'folderStructureBdd', 'support'),
                path.resolve(process.cwd(), `./${rootPath}/support`),
                {
                    overwrite: false,
                    errorOnExist: true
                }
            );
            fs.ensureFileSync(
                path.resolve(process.cwd(), `./${reportsPath}/.gitkeep`)
            );
        } catch (_e) {
            console.error(
                new Error('Seems like the a folder named bdd already exists!')
            );
        }
    }

    /**
	 * Function to add data to gitignore files
	 */
    updateGitIgnore() {
        try {
            fs.ensureFileSync(path.resolve(process.cwd(), '.gitignore'));
            fs.appendFileSync(
                path.resolve(process.cwd(), '.gitignore'),
                '\nbdd/reports/*\n!bdd/reports/.gitkeep\n'
            );
        } catch (_e) {
            console.error(new Error('Unable update git ignore file!'));
        }
    }

    /**
	 * Function to update the package.json file with cruller data
	 * @param {string} pkgPath The path to package.json file
	 * @param {object} pkgData The data parsed from package.json file
	 */
    updatePackageJson(pkgPath, pkgData) {
        // Get settings from scope settings
        const settings = this.getSettings();
        const { rootPath } = settings;
        try {
            const crullerCmd = './node_modules/.bin/cruller-bdd';
            pkgData.scripts['cruller:run'] = `${crullerCmd} run`;
            pkgData.scripts['cruller:report'] = `${crullerCmd} report`;
            pkgData.cruller = settings;
            pkgData.cruller.selectorFiles = [
                `${rootPath}/support/selectors/**/*.js`
            ];
            fs.writeFileSync(pkgPath, JSON.stringify(pkgData, null, 2));
        } catch (_e) {
            console.error(new Error('Unable update package.json file!'));
        }
    }

    /**
	 * Function to update template files with package folder
	 */
    updateFilesWithPackageName() {
        // Get settings from scope settings
        const { rootPath } = this.getSettings();
        try {
            const pkgPath = path.resolve(__dirname, '../../package.json');
            const pkgContent = fs.readFileSync(pkgPath);
            const pkgData = JSON.parse(pkgContent);
            const searchRgx = new RegExp(/(\.+\/)+lib\/bdd/, 'g');
            const filesGlob = path.join(process.cwd(), `./${rootPath}/**/*.js`);
            const files = glob.sync(filesGlob);
            files.forEach(f => {
                const data = fs.readFileSync(f, 'utf8');
                // replace '../../lib/bdd' kind of imports with 'curller/lib/bdd'
                const result = data.replace(
                    searchRgx,
                    `${pkgData.name}/lib/bdd`
                );
                fs.writeFileSync(f, result, 'utf8');
            });
        } catch (e) {
            console.log(e);
        }
    }

    /**
	 * Function to copy a cruller-bdd project template to the CWD
	 */
    runInit() {
        try {
            const pkgPath = path.resolve(process.cwd(), './package.json');
            if (fs.existsSync(pkgPath)) {
                const pkgContent = fs.readFileSync(pkgPath);
                const pkgData = JSON.parse(pkgContent);
                if (!pkgData.cruller) {
                    this.copyFolderTemplate();
                    this.updateGitIgnore();
                    this.updatePackageJson(pkgPath, pkgData);
                    this.updateFilesWithPackageName();
                    return;
                }
                console.log(
                    new Error('Cruller already initialized in project!')
                );
            }
        } catch (e) {
            console.log(new Error('package.json not found in folder!'));
        }
    }

    /**
	 * Function to get the settings from scope
	 */
    getSettings() {
        const { settings } = getScope();
        return settings;
    }

    /**
	 * Function to initialize the CLI commands used with cruller cucumber.
	 * One module is installed run `cruller-cucumber --help` to see complete set of options
	 */
    initialize() {
        const { reportName } = this.getSettings();
        yargs
            .option('name', {
                demandOption: true,
                default: reportName,
                describe: 'Name of the report',
                type: 'string'
            })
            .command({
                command: 'run',
                aliases: ['start', 'test'],
                desc: 'Run the cruller bdd using cucumber cli arguments',
                handler: this.runBdd.bind(this)
            })
            .command({
                command: 'report',
                aliases: ['summarize'],
                desc: 'Run the cruller bdd report',
                handler: this.runReport.bind(this)
            })
            .command({
                command: 'init',
                aliases: ['initialize', 'i'],
                desc: 'Initialize cruller in the current working directory',
                handler: this.runInit.bind(this)
            })
            .demandCommand()
            .wrap(0)
            .help().argv;
    }
}

module.exports = CrullerCucumberCli;
