const assert = function() {
	return this;
};

assert.notEqual = jest.fn();
assert.equal = jest.fn();

// assert.prototype.notEqual = function() {
// 	return this;
// };

// assert.prototype.equal = function() {
// 	return this;
// };

module.exports = {
	assert,
};
