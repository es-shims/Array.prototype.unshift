'use strict';

var DeletePropertyOrThrow = require('es-abstract/2023/DeletePropertyOrThrow');
var Get = require('es-abstract/2023/Get');
var HasProperty = require('es-abstract/2023/HasProperty');
var LengthOfArrayLike = require('es-abstract/2023/LengthOfArrayLike');
var Set = require('es-abstract/2023/Set');
var ToObject = require('es-object-atoms/ToObject');
var ToString = require('es-abstract/2023/ToString');

var forEach = require('es-abstract/helpers/forEach');
var MAX_SAFE_INTEGER = require('es-abstract/helpers/maxSafeInteger');

var $TypeError = require('es-errors/type');
var callBound = require('call-bind/callBound');
var isString = require('is-string');

// Check failure of by-index access of string characters (IE < 9) and failure of `0 in boxedString` (Rhino)
var boxedString = Object('a');
var splitString = boxedString[0] !== 'a' || !(0 in boxedString);

var strSplit = callBound('String.prototype.split');

// eslint-disable-next-line no-unused-vars
module.exports = function unshift(items) {
	var O = ToObject(this); // step 1
	var self = splitString && isString(O) ? strSplit(O, '') : O;
	var len = LengthOfArrayLike(self); // step 2
	var argCount = arguments.length; // step 3

	if (argCount > 0) { // step 4
		if ((len + argCount) > MAX_SAFE_INTEGER) {
			throw new $TypeError('unshift cannot produce an array of length larger than (2 ** 53) - 1'); // step 4.a
		}
		var k = len; // step 4.b
		while (k > 0) { // step 4.c
			var from = ToString(k - 1); // step 4.c.i
			var to = ToString(k + argCount - 1); // step 4.c.ii
			var fromPresent = HasProperty(O, from); // step 4.c.iii
			if (fromPresent) { // step 4.c.iv
				var fromValue = Get(O, from); // step 4.c.iv.1
				Set(O, to, fromValue, true); // step 4.c.iv.2
			} else { // step 4.c.v
				DeletePropertyOrThrow(O, to); // step 4.c.v.2
			}
			k -= 1; // step 4.c.vi
		}
		var j = 0; // step 4.d
		forEach(arguments, function (E) { // step 4.e
			Set(O, ToString(j), E, true); // step 4.e.i
			j += 1; // step 4.e.ii
		});
	}

	Set(O, 'length', len + argCount, true); // step 5

	return len + argCount; // step 6
};

module.exports.prototype = undefined;
