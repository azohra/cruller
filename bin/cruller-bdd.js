#! /usr/bin/env node
const glob = require('glob');
const fs = require('fs-extra');
const path = require('path');
const yargs = require('yargs');
const { spawnSync } = require('child_process');
const reporter = require('cucumber-html-reporter');
const scope = require('../lib/bdd/core/scope');
const { updateSettings } = require('../lib/bdd/core/utils');

// Add settings to scope object
updateSettings();
// Get settings from scope
const { settings } = scope;
const { reportsPath, reportName, rootPath } = settings;
/**
 * Function to create the report based on the bdd run
 */
const runReport = argv => {
    // Get settings from scope settings
    const { reportsPath, reportName } = settings;
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
};

/**
 * Function to run the  cucumber bdd
 * @param {object} argv The yargs object
 */
const runBdd = argv => {
    const reportFile = `${argv.name || reportName}.json`;
    spawnSync(
        './node_modules/.bin/cucumber-js',
        [
            path.resolve(process.cwd(), rootPath),
            '-r',
            path.resolve(process.cwd(), rootPath),
            '-f',
            `json:${path.resolve(
                process.cwd(),
                path.join(reportsPath, reportFile)
            )}`,
            ...process.argv.slice(2)
        ],
        {
            shell: true,
            stdio: 'inherit'
        }
    );
};

/**
 * Function to copy the base bdd template to project folder
 */
const copyFolderTemplate = () => {
    try {
        fs.copySync(
            path.join(__dirname, 'folderStructureBdd', 'feature-files'),
            path.resolve(process.cwd(), `./${rootPath}/feature-files`),
            {
                overwrite: false,
                errorOnExist: true
            }
        );
        fs.copySync(
            path.join(__dirname, 'folderStructureBdd', 'step_definitions'),
            path.resolve(process.cwd(), `./${rootPath}/step_definitions`),
            {
                overwrite: false,
                errorOnExist: true
            }
        );
        fs.copySync(
            path.join(__dirname, 'folderStructureBdd', 'support'),
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
};

/**
 * Function to add data to gitignore files
 */
const updateGitIgnore = () => {
    try {
        fs.ensureFileSync(path.resolve(process.cwd(), '.gitignore'));
        fs.appendFileSync(
            path.resolve(process.cwd(), '.gitignore'),
            '\nbdd/reports/*\n!bdd/reports/.gitkeep\n'
        );
    } catch (_e) {
        console.error(new Error('Unable update git ignore file!'));
    }
};

/**
 * Function to update the package.json file with cruller data
 * @param {string} pkgPath The path to package.json file
 * @param {object} pkgData The data parsed from package.json file
 */
const updatePackageJson = (pkgPath, pkgData) => {
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
};

/**
 * Function to update template files with package folder
 */
const updateFilesWithPackageName = () => {
    try {
        const pkgPath = path.resolve(__dirname, '../package.json');
        const pkgContent = fs.readFileSync(pkgPath);
        const pkgData = JSON.parse(pkgContent);
        const searchRgx = new RegExp(/'(.+\/)+lib\/bdd'/, 'g');
        const filesGlob = path.join(process.cwd(), `./${rootPath}/**/*.js`);
        const files = glob.sync(filesGlob);
        files.forEach(f => {
            const data = fs.readFileSync(f, 'utf8');
            const result = data.replace(searchRgx, `'${pkgData.name}/lib/bdd'`);
            fs.writeFileSync(f, result, 'utf8');
        });
    } catch (e) {
        console.log(e);
    }
};

// Set up the command line interface
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
        handler: argv => {
            runBdd(argv);
        }
    })
    .command({
        command: 'report',
        aliases: ['summarize'],
        desc: 'Run the cruller bdd report',
        handler: argv => {
            runReport(argv);
        }
    })
    .command({
        command: 'init',
        aliases: ['initialize', 'i'],
        desc: 'Initialize cruller in the current working directory',
        handler: () => {
            try {
                const pkgPath = path.resolve(process.cwd(), './package.json');
                if (fs.existsSync(pkgPath)) {
                    const pkgContent = fs.readFileSync(pkgPath);
                    const pkgData = JSON.parse(pkgContent);
                    if (!pkgData.cruller) {
                        copyFolderTemplate();
                        updateGitIgnore();
                        updatePackageJson(pkgPath, pkgData);
                        updateFilesWithPackageName();
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
    })
    .demandCommand()
    .wrap(0)
    .help().argv;
