const pkgConfig = require('../package.json');
const cruConfig = require('../cruller.config');
const cosmiconfig = jest.fn((_, options) => {
    return {
        searchSync:jest.fn(() => ({
            config: options ? pkgConfig.cruller : cruConfig
        })),
    };
});


module.exports = cosmiconfig;
