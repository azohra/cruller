const stampit = require('@stamp/it');

const homeBase = stampit({
    props: {
        path: '/',
        homeProp: 'used for desktop'
    },

    methods: {
        /**
         *  Home page functions.
         *  @namespace Home
         */

        /**
         * Sample method on the home page to display the breakpoint the test is being run on
         * @memberof Home         
         * @async
         */
        async homeMethod() {
            console.log('desktop: ' + this.homeProp);
            return(this.homeProp);
        }
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

module.exports = { homeBase, homeTablet, homeMobile };