const each = require('jest-each');
const B = require('cruller'); // replace B with project-specific name
const permutations = require('cruller').cartesian;

describe.each(permutations)('Sample %s %s', (banner, breakpoint) => {    
    let sample;
    beforeAll(async () => {
        sample = new B;
        await sample.startUp({banner: banner, breakpoint: breakpoint});
    }, 80000);

    afterAll(async () => {
        await sample.browser.close();
    });
    
    test('Search Test', async () => {
        await sample.homePage.search();
    }, 80000);
});
