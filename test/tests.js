'use strict';

var hasOwn = require('hasown');
// var MAX_SAFE_INTEGER = require('es-abstract/helpers/maxSafeInteger');

// var canDistinguishSparseFromUndefined = 0 in [undefined]; // IE 6 - 8 have a bug where this returns false.
// eslint-disable-next-line no-sparse-arrays, array-bracket-spacing
var holesExist = !(0 in [, ]); // FF 3 fails this check

module.exports = function (unshift, t) {
	t.equal(unshift([], undefined), 1, '[].unshift(undefined) yields 1');
	t.equal(unshift([], 0), 1, '[].unshift(0) yields 1');

	// t['throws'](
	// 	function () { unshift({ length: MAX_SAFE_INTEGER }, 42); },
	// 	TypeError,
	// 	'throws on too-large final length'
	// );

	t.test('works on arrays', function (st) {
		var arr = [1];
		var result = unshift(arr, undefined);
		st.equal(result, 2);
		st.equal(arr.length, 2);
		st.ok(hasOwn(arr, 0), '0 is an own property');
		st.ok(hasOwn(arr, 1), '1 is an own property');
		st.equal(arr[0], undefined, '0 is undefined');
		st.equal(arr[1], 1, '1 is 1');

		st.end();
	});

	t.test('works on sparse arrays', function (st) {
		var sparse = [1, , 3]; // eslint-disable-line no-sparse-arrays
		st.notOk(hasOwn(sparse, 1), 'index 1 is a hole', { skip: !holesExist });
		st.equal(sparse.length, 3, 'original length is 3');

		var result = unshift(sparse, 42);

		st.equal(result, 4, 'result is 4');
		st.equal(sparse.length, 4, 'new length is 4');

		st.deepEqual(sparse, [42, 1, , 3], 'preserves the hole'); // eslint-disable-line no-sparse-arrays
		st.notOk(hasOwn(sparse, 2), 'index 2 is a hole', { skip: !holesExist });

		st.end();
	});

	t.test('is generic', function (st) {
		var obj = { 0: 1, length: 1 };
		var result = unshift(obj, undefined);
		st.equal(result, 2);
		st.equal(obj.length, 2);
		st.ok(hasOwn(obj, 0), '0 is an own property');
		st.ok(hasOwn(obj, 1), '1 is an own property');
		st.deepEqual(obj, { 0: undefined, 1: 1, length: 2 });

		st.end();
	});
};
