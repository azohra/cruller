module.exports = {
    variables: {
        baseurl: {
            crullerWiki: 'https://en.wikipedia.org/wiki/Cruller'
        },

        breakpoint: {
            mobile: {width: 650, height: 2000},
            tablet: {width: 900, height: 2000},
            desktop: {width: 1200, height: 2000}
        }
        // Add custom variables here
    },

    stampDirectory: 'bin/folderStructure/stamps',

    browserlessUrl: `wss://chrome.browserless.io?token=${process.env.BROWSERLESS_KEY}`,

    async setupFunction(page, variables, opts) {
        let permutation = {};
        // set bpoint
        await page.setViewport(variables.breakpoint[opts.breakpoint]);
        permutation.breakpoint = opts.breakpoint;

        // set banner
        permutation.baseurl = variables.baseurl[opts.banner];
        permutation.banner = opts.banner;

        // visit baseUrl
        await page.goto(permutation.baseurl);
    },

    envExceptions({envMap: envMap}) {
        // add any business-specific code to change environment variables here
        return envMap;
    },

    // accessibility configurations - refer README.md for configuration options
    accessibility : {
        runOnly: {
            type: 'tag',
            values: {
                include:['wcag2aa'],
                exclude: ['experimental']
            }
        },
        resultTypes: ['violations', 'incomplete', 'inapplicable'],
    },

    // accessibility report configurations
    accessibilityReport : {
        fileType: 'tsv', // supported values - 'tsv' or 'csv' 
        fileName: 'AccessibilityReport',
        createNewFile: false 
    },
};
