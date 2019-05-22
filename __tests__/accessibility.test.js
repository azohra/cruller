const Cruller = require('../lib/crawler');
    
describe('Run accessibility validation', () => {
    let crawler;
    let results;

    beforeAll(async () => {
        jest.setTimeout(20000);
        crawler = new Cruller;
        await crawler.startUp({breakpoint: 'desktop', banner: 'crullerWiki'}, {});
        results = await crawler.accessibilityCheck(crawler.page, true);
    });
    
    test('check for violations', async () => {
        expect (results).toHaveProperty('violations');
    });

    test('check for passes', async () => {
        expect (results).toHaveProperty('passes');
    });
    
    test('check for incomplete', async () => {
        expect (results).toHaveProperty('incomplete');
    });

    test('check for inapplicable', async () => {
        expect (results).toHaveProperty('inapplicable');
    });

    afterAll(async () => {
        await crawler.browser.close();
    });
}, 80000);

