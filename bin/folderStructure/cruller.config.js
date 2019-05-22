module.exports = {
    variables: {
        baseurl: {
            google  : 'https://www.google.com/',
            // yahoo   : 'https://www.yahoo.com/',
            // bing    : 'https://www.bing.com/'
        },

        breakpoint: {
            mobile  : {width: 650, height: 2000},
            tablet  : {width: 900, height: 2000},
            desktop : {width: 1200, height: 2000}
        }
        // Add custom variables here
    },

    stampDirectory: 'stamps',

    browserlessUrl: '',

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
    }
};