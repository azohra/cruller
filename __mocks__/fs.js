const fs = jest.genMockFromModule('fs');

fs.readFile = jest.fn((_, cb) => cb());

module.exports = fs;