const fs = jest.genMockFromModule('fs');

fs.readFile = jest.fn((_, cb) => cb());

fs.existsSync = jest.fn(() => true);

module.exports = fs;