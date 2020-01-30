const assert = function() {
	return this;
};

assert.notEqual = jest.fn();
assert.equal = jest.fn();
assert.match = jest.fn();

module.exports = {
	assert,
};
