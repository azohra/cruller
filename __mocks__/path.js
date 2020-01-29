const path = jest.genMockFromModule('path');

path.resolve = jest.fn(input => input);

module.exports = path;