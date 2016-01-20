var SET_OF_KEYS = {
	PAGE: {name: "p", isValid: ReactiveQueryUtils.isInteger},
	COUNT: {name: "c", isValid: ReactiveQueryUtils.isInteger},
	SORT: {name: "s", isValid: _.isString},
	ORDER: {name: "o", isValid: ReactiveQueryUtils.isInteger},
	FILTER: {name: "f", isValid: _.isObject}
}
var currentData = new ReactiveDict();
currentData.set(SET_OF_KEYS.PAGE.name, 3);
currentData.set(SET_OF_KEYS.COUNT.name, 20);
currentData.set(SET_OF_KEYS.FILTER.name, {orderId: "50", customer: "Messi"});
currentData.set(SET_OF_KEYS.SORT.name, "users");
currentData.set(SET_OF_KEYS.ORDER.name, 1);

Tinytest.add('Merge data method test without customData (undefined)', function (test) {
	var resultTarget = {};
	var cd = new ReactiveDict();
	cd.set(SET_OF_KEYS.PAGE.name, 3);
	cd.set(SET_OF_KEYS.COUNT.name, 20);
	cd.set(SET_OF_KEYS.FILTER.name, {orderId: "50", customer: "Messi"});
	cd.set(SET_OF_KEYS.SORT.name, "users");
	cd.set(SET_OF_KEYS.ORDER.name, 1);
	function test1(key) {
		ReactiveQueryUtils.mergeSpecial(undefined, cd, resultTarget, getKeyByName(key));
		test.equal(resultTarget[key], cd.get(key), key + ' is changed, but should not');
	}

	test1(SET_OF_KEYS.PAGE.name);
	test1(SET_OF_KEYS.COUNT.name);
	test1(SET_OF_KEYS.SORT.name);
	test1(SET_OF_KEYS.ORDER.name);
	test1(SET_OF_KEYS.FILTER.name);
});

Tinytest.add('Merge data method test with empty customData', function (test) {
	var resultTarget = {};

	function test1(key, customData, cd, rt, typeChecker) {
		ReactiveQueryUtils.mergeSpecial(customData, cd, rt, getKeyByName(key));
		test.equal(rt[key], cd.get(key), key + ' is changed, but should not');
	}

	test1(SET_OF_KEYS.PAGE.name, {}, currentData, resultTarget);
	test1(SET_OF_KEYS.COUNT.name, {}, currentData, resultTarget);
	test1(SET_OF_KEYS.SORT.name, {}, currentData, resultTarget);
	test1(SET_OF_KEYS.ORDER.name, {}, currentData, resultTarget);
	test1(SET_OF_KEYS.FILTER.name, {}, currentData, resultTarget);
});

Tinytest.add('Merge data method test with customData = null', function (test) {
	var resultTarget = {};

	function test1(key, cd, rt, typeChecker) {
		ReactiveQueryUtils.mergeSpecial(null, cd, rt, getKeyByName(key));
		test.equal(rt[key], cd.get(key), key + ' is changed, but should not');
	}

	test1(SET_OF_KEYS.PAGE.name, currentData, resultTarget);
	test1(SET_OF_KEYS.COUNT.name, currentData, resultTarget);
	test1(SET_OF_KEYS.SORT.name, currentData, resultTarget);
	test1(SET_OF_KEYS.ORDER.name, currentData, resultTarget);
	test1(SET_OF_KEYS.FILTER.name, currentData, resultTarget);
});

Tinytest.add('Merge data normal', function (test) {
	var customData = {
		p: 1,
		c: 20,
		f: {orderId: "0", "custom": {$gt: 3}},
		s: "customers"
	}
	var resultTarget = {};

	function test2(key, v) {
		ReactiveQueryUtils.mergeSpecial(customData, currentData, resultTarget, getKeyByName(key));
		test.equal(resultTarget[key], v, key + ' value is wrong');
	}

	test2(SET_OF_KEYS.PAGE.name, 1);
	test2(SET_OF_KEYS.COUNT.name, 20);
	test2(SET_OF_KEYS.SORT.name, "customers");
	test2(SET_OF_KEYS.ORDER.name, 1);
	test2(SET_OF_KEYS.FILTER.name, {orderId: "0", "custom": {$gt: 3}, customer: "Messi"});
});

Tinytest.add('Merge data with empty current data', function (test) {
	var customData = {
		p: 1,
		c: 20,
		f: {orderId: "0", "custom": {$gt: 3}},
		s: "customers"
	}
//on empty current data
	var resultTarget = {};

	function test3(key, v) {
		ReactiveQueryUtils.mergeSpecial(customData, new ReactiveDict(), resultTarget, getKeyByName(key));
		test.equal(resultTarget[key], v, key + ' value is wrong');
	}

	test3(SET_OF_KEYS.PAGE.name, 1);
	test3(SET_OF_KEYS.COUNT.name, 20);
	test3(SET_OF_KEYS.SORT.name, "customers");
	test3(SET_OF_KEYS.ORDER.name, undefined);
	test3(SET_OF_KEYS.FILTER.name, {orderId: "0", "custom": {$gt: 3}});
});

Tinytest.add('Merge data with unset and null', function (test) {

	var customData = {
		p: "6",
		c: 20,
		f: {orderId: "0", "custom": {$gt: 3}, $unset: ['customer']},
		s: null
	}

	//delete and bad values
	var resultTarget = {};

	function test4(key, v) {
		ReactiveQueryUtils.mergeSpecial(customData, currentData, resultTarget, getKeyByName(key));
		test.equal(resultTarget[key], v, key + ' value is wrong');
	}

	test4(SET_OF_KEYS.PAGE.name, 3);
	test4(SET_OF_KEYS.COUNT.name, 20);
	test4(SET_OF_KEYS.SORT.name, undefined);
	test4(SET_OF_KEYS.ORDER.name, 1);
	test4(SET_OF_KEYS.FILTER.name, {orderId: "0", "custom": {$gt: 3}});
})

function getKeyByName(name){
	return _.find(SET_OF_KEYS, function (key) {
		return key.name === name;
	});
}