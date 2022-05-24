'use strict';

var implementation = require('./implementation');

var callBind = require('call-bind');

var $unshiftApply = Array.prototype.unshift && callBind.apply(Array.prototype.unshift);

module.exports = function getPolyfill() {
	if (!Array.prototype.unshift) {
		return implementation;
	}
	if ([].unshift(0) !== 1) {
		/* eslint no-invalid-this: 1 */
		// eslint-disable-next-line no-unused-vars
		return function unshift(items) {
			$unshiftApply(this, arguments);
			return this.length;
		};
	}

	return Array.prototype.unshift;
};
