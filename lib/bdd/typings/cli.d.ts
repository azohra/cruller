export = CrullerCucumberCli;
/**
 * CLI class for cruller cucumber
 */
declare class CrullerCucumberCli {
    constructor(config?: {
        templatesRoot: string;
    });
    config: {
        templatesRoot: string;
    };
    /**
     * Function to create the report based on the bdd run
     * @param {object} argv The command line arguments provided by yargs
     */
    runReport(argv: any): void;
    /**
     * Function to run the  cucumber bdd
     * @param {object} argv The yargs object
     */
    runBdd(argv: any): void;
    /**
     * Function to copy the base bdd template to project folder
     */
    copyFolderTemplate(): void;
    /**
     * Function to add data to gitignore files
     */
    updateGitIgnore(): void;
    /**
     * Function to update the package.json file with cruller data
     * @param {string} pkgPath The path to package.json file
     * @param {object} pkgData The data parsed from package.json file
     */
    updatePackageJson(pkgPath: string, pkgData: any): void;
    /**
     * Function to update template files with package folder
     */
    updateFilesWithPackageName(): void;
    /**
     * Function to copy a cruller-bdd project template to the CWD
     */
    runInit(): void;
    /**
     * Function to get the settings from scope
     */
    getSettings(): any;
    /**
     * Function to initialize the CLI commands used with cruller cucumber.
     * One module is installed run `cruller-cucumber --help` to see complete set of options
     */
    initialize(): void;
}
