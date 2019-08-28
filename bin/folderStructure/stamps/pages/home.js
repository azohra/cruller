const stampit = require('@stamp/it');

const homeBase = stampit({
    props: {
        path: '/',
        homeProp: 'used for desktop',
        searchBar: '[aria-label="Search"]'
    },

    methods: {
        async search() {
            await this.puppeteerPage.waitForSelector(this.searchBar, {visible: true});
            await this.puppeteerPage.type(this.searchBar, 'cruller npm', {delay: 20});
            await this.puppeteerPage.keyboard.press('Enter');
        },

        async homeMethod() {
            console.log('desktop: ' + this.homeProp);
            return(this.homeProp);
        }
    }
});

const homeYahoo = stampit({
    props: {
        searchBar: '#uh-search-form'
    }
});

const homeBing = stampit({
    props: {
        searchBar: '#sb_form_q'
    }
});

const homeTablet = stampit({
    props: {
        homeProp: 'used for tablet'
    },

    methods: {
        async homeMethod() {
            console.log('perform extra tablet step');
            console.log('tablet: ' + this.homeProp);
            return(this.homeProp);
        }
    }
});

const homeMobile = stampit({
    props: {
        homeProp: 'used for mobile'
    },

    methods: {
        async homeMethod() {
            console.log('perform extra mobile step');
            console.log('mobile: ' + this.homeProp);
            return(this.homeProp);
        }
    }
});

module.exports = { homeBase, homeYahoo, homeBing, homeTablet, homeMobile };