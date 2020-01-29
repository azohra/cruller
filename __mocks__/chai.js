const assert = function() {
	return this;
};

assert.notEqual = jest.fn();
assert.equal = jest.fn();

module.exports = {
	assert,
};
