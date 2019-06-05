const stampit = require('@stamp/it');

const sharedBase = stampit({
    props: {
        myProp: 'this property is accessible from any page'
    },
    
    methods: {
        /**
         *  Shared page functions.
         *  @namespace Shared
         */
    
        /**
         * Sample method on the Shared page to show how methods run differently depending on the parameters given.
         * @memberof Shared         
         * @async
         */
        async sharedAction() {
            console.log('this action is accessible from any page');                               
        }
    }
});


const sharedTablet = stampit({
    props: {
        extraTabletProp: 'this property is accesible from any Tablet page'
    },

    methods: {
        async sharedAction() {
            console.log('perform extra tablet step');
            console.log('tablet: ' + this.extraTabletProp);
            return(this.myProp);
        }
    }
});

module.exports = { sharedBase, sharedTablet };
