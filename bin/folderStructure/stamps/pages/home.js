const stampit = require('@stamp/it');

const homeBase = stampit({
    props: {
        path: '/',
        homeProp: 'used for desktop'
    },

    methods: {
        async homeMethod() {
            console.log('desktop: ' + this.homeProp);
            return(this.homeProp);
        }
    }
});

const homeTablet = stampit({
    props: {
        path: '/',
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
        path: '/',
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