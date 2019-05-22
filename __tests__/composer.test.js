const Cruller = require('../lib/crawler');
    
describe('Composition', () => {
    let crawler;
    
    test('Mobile stamp uses mobile function', async () => {
        crawler = new Cruller;
        await crawler.startUp({breakpoint: 'mobile', banner: 'crullerWiki'}, {});
        expect(await crawler.homePage.homeMethod()).toEqual('used for mobile');
    });

    test('Tablet stamp uses tablet function', async () => {
        crawler = new Cruller;
        await crawler.startUp({breakpoint: 'tablet', banner: 'crullerWiki'}, {});
        expect(await crawler.homePage.homeMethod()).toEqual('used for tablet');
    });

    test('Desktop stamp uses desktop function', async () => {
        crawler = new Cruller;
        await crawler.startUp({breakpoint: 'desktop', banner: 'crullerWiki'}, {});
        expect(await crawler.homePage.homeMethod()).toEqual('used for desktop');
    });

    
    afterEach(async () => {
        await crawler.browser.close();
    });
}, 80000);

