const puppeteer = require('puppeteer');
const composer = require('./helpers/composer');
var fs = require('fs');
const { AxePuppeteer } = require('axe-puppeteer');
const AxeReports = require('axe-reports');

const cosmiconfig = require('cosmiconfig');
const explorer = cosmiconfig('cruller');

const config = explorer.searchSync().config;

/**
 * Creates a crawler
 * @class 
 */

class Cruller {
    init(perms,results) {
        this.permutation = perms,
        this.results = results;
    }

    /**
     * Starts the crawler with given a given permutation and set of puppeteer opts
     * @param {array} perms 
     * @param {object} opts 
     */
    
    async startUp(perms, opts = {}) {

        this.permutation = perms;
        // Connect to or start a browser
        if (process.env.PIPELINE == 'true') {
            opts.browserWSEndpoint = config.browserlessUrl;
            this.browser = await puppeteer.connect(opts);
        } else if (process.env.HEADLESSCHROME == 'true') {
            opts.headless = true;
            this.browser = await puppeteer.launch(opts);
        } else {
            opts.headless = false;
            this.browser = await puppeteer.launch(opts);
        }

        // Create a page
        this.page = await this.browser.newPage();

        await config.setupFunction(this.page, config.variables, this.permutation);

        // Create page stamps
        let pageNames = fs.readdirSync(`${process.cwd()}/${config.stampDirectory}/pages`);
        pageNames = pageNames.map((item) => {return item.substring(0, item.length-3);});
        pageNames.splice( pageNames.indexOf('index'), 1 );
        let curStamp;
        let curPage;
        for (let pageName of pageNames) {
            curStamp = composer({page: pageName, envMap: this.permutation});
            curPage = curStamp({puppeteerPage: this.page, baseUrl: config.variables[this.permutation.banner], puppeteerBrowser: this.browser});
            this[pageName + 'Page'] = curPage;
        }
    }

    /**
     * Starts new tab in opened browser with given a given permutation and set of puppeteer opts
     * @param {array} perms 
     */
    
    async openNewTab(perms) {

        this.permutation = perms;
        // Create a page
        this.page = await this.browser.newPage();

        await config.setupFunction(this.page, config.variables, this.permutation);

        // Create page stamps
        let pageNames = fs.readdirSync(`${process.cwd()}/${config.stampDirectory}/pages`);
        pageNames = pageNames.map((item) => {return item.substring(0, item.length-3);});
        pageNames.splice( pageNames.indexOf('index'), 1 );
        let curStamp;
        let curPage;
        for (let pageName of pageNames) {
            curStamp = composer({page: pageName, envMap: this.permutation});
            curPage = curStamp({puppeteerPage: this.page, baseUrl: config.variables[this.permutation.banner], puppeteerBrowser: this.browser});
            this[pageName + 'Page'] = curPage;
        }
    }
        
    // validations
    /**
     * Validate current page has the url of a given page object
     * @param {object} expectedPage 
     */
    async accessibilityCheck(expectedPage, createNewFile = config.accessibilityReport.createNewFile){
        await expectedPage.setBypassCSP(true);
        const builder = new AxePuppeteer(expectedPage);
        const results = await builder.configure(config.accessibility).analyze();
        // accessibility report creation
        const fileType = config.accessibilityReport.fileType;
        const filename = config.accessibilityReport.fileName;
        AxeReports.processResults(results, fileType, filename, createNewFile);

        // accessibility result handle for validation purpose
        return results;
    }

    async onPage(expectedPage) {
        const onPage = this.page.url().includes(expectedPage.path);
        return new Promise(resolve => {
            resolve(onPage);
        });
    }

    /**
     * Validate that a given element is visible on the current page
     * @param {string} expectedElement 
     */
    async elementVisible(expectedElement) {
        try {
            await this.page.waitForSelector(expectedElement, {visible: true});
        } catch(e) { console.error(e); }
        const elementVisible = await this.page.$(expectedElement) !== null;
        return new Promise(resolve => {
            resolve(elementVisible);
        });
    }
}

module.exports = Cruller;