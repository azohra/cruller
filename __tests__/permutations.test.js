const Cruller = require('../lib/crawler');
    
describe('Set correct permutation', () => {
    let crawler;
    
    test('Mobile permutation is set', async () => {
        crawler = new Cruller;
        await crawler.startUp({breakpoint: 'mobile', banner: 'crullerWiki'}, {});
        expect(crawler.permutation).toEqual({'banner': 'crullerWiki', 'breakpoint': 'mobile'});
        expect(crawler.page.viewport()).toEqual({'height': 2000, 'width': 650});
    });

    test('Tablet permutation is set', async () => {
        crawler = new Cruller;
        await crawler.startUp({breakpoint: 'tablet', banner: 'crullerWiki'}, {});
        expect(crawler.permutation).toEqual({'banner': 'crullerWiki', 'breakpoint': 'tablet'});
        expect(crawler.page.viewport()).toEqual({'height': 2000, 'width': 900});
    });

    test('Desktop permutation is set', async () => {
        crawler = new Cruller;
        await crawler.startUp({breakpoint: 'desktop', banner: 'crullerWiki'}, {});
        expect(crawler.permutation).toEqual({'banner': 'crullerWiki', 'breakpoint': 'desktop'});
        expect(crawler.page.viewport()).toEqual({'height': 2000, 'width': 1200});
    });
    
    afterEach(async () => {
        await crawler.browser.close();
    });
}, 80000);

