'use strict';

var define = require('define-properties');
var getPolyfill = require('./polyfill');

module.exports = function shimArrayPrototypeUnshift() {
	var polyfill = getPolyfill();

	define(
		Array.prototype,
		{ unshift: polyfill },
		{ unshift: function () { return Array.prototype.unshift !== polyfill; } }
	);

	return polyfill;
};
