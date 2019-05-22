const stampit = require('@stamp/it');

/* Visitable page stamp with pageUrl and puppeteerPage props.
 */
const visitable = stampit({
    props: {
        puppeteerPage: null,
        puppeteerBrowser: null,
        pageUrl: null,
        baseUrl: null
    },

    init({ puppeteerPage = this.puppeteerPage, baseUrl = this.baseUrl, puppeteerBrowser = this.puppeteerBrowser }) {
        this.puppeteerPage = puppeteerPage;
        this.baseUrl = baseUrl;
        this.puppeteerBrowser = puppeteerBrowser;
    },

    methods: {
        async visit() {
            await this.puppeteerPage.goto(this.baseUrl + this.pageUrl);
        },
        
        async waitClick(prop) {
            await this.puppeteerPage.waitForSelector(this[prop], {visible: true});
            await this.puppeteerPage.click(this[prop]);
        },
        
        async waitClickNavigate(prop) {
            await Promise.all([ // required to avoid race condition
                this.puppeteerPage.waitForNavigation(),
                this.waitClick(prop),
            ]);
        },

        async emptyField(prop) {
            let element = await this.puppeteerPage.$(prop);
            let valueHandle = await element.getProperty('value');
            let stringValue = await valueHandle.jsonValue();
            for (let i = 0; i < stringValue.length; i++) {
                await this.puppeteerPage.keyboard.press('Backspace');
            }
        }, 

        async clickByIndex(prop, index) {
            const elementHandle = await this.puppeteerPage.$$(this[prop]);
            await elementHandle[index].click();  

        }
    }
});

module.exports = visitable;
