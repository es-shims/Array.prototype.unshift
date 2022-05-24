'use strict';

var define = require('define-properties');
var RequireObjectCoercible = require('es-abstract/2021/RequireObjectCoercible');
var callBound = require('call-bind/callBound');

var implementation = require('./implementation');
var getPolyfill = require('./polyfill');
var shim = require('./shim');

var polyfill = getPolyfill();

var $slice = callBound('Array.prototype.slice');

// eslint-disable-next-line no-unused-vars
var bound = function unshift(array, items) {
	RequireObjectCoercible(array);
	return polyfill.apply(array, $slice(arguments, 1));
};
define(bound, {
	getPolyfill: getPolyfill,
	implementation: implementation,
	shim: shim
});

module.exports = bound;
