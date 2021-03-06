var SET_OF_KEYS = {
	PAGE: {name: "p", isValid: ReactiveQueryUtils.isInteger},
	COUNT: {name: "c", isValid: ReactiveQueryUtils.isInteger},
	SORT: {name: "s", isValid: _.isString},
	ORDER: {name: "o", isValid: ReactiveQueryUtils.isInteger},
	FILTER: {name: "f", isValid: _.isObject}
}

Tinytest.add('Force data method test return values', function (test) {
	var currentData = new ReactiveDict();
	currentData.set("page", 3);
	currentData.set("count", 10);
	currentData.set("filter", {orderId: "50", customer: "Messi"});
	currentData.set("sort", "users");
	currentData.set("order", 1);

	function test1(reactiveQueryKey, customData, expectedValue, isChanged) {
		var _isChanged = ReactiveQueryUtils.forceData(customData, currentData, reactiveQueryKey);
		test.equal(currentData.get(reactiveQueryKey.name), expectedValue, reactiveQueryKey.name + " wrong");
		test.equal(isChanged, _isChanged, reactiveQueryKey.name + " return value is wrong");
	}

	var filter = {"one.two": [{second: "94"}, 4, {a: [5, 4, {base: 90.4}]}]}
	test1(SET_OF_KEYS.FILTER, {f: filter}, filter, true);
	test1(SET_OF_KEYS.FILTER, {f: filter}, filter, false);

	test1(SET_OF_KEYS.COUNT, {c: 20}, 20, true);
	test1(SET_OF_KEYS.COUNT, {c: 20}, 20, false);
});

Tinytest.add('Force data method test with null data', function (test) {
	var currentData = new ReactiveDict();
	currentData.set("page", 3);
	currentData.set("count", 20);
	currentData.set("filter", {orderId: "50", customer: "Messi"});
	currentData.set("sort", "users");
	currentData.set("order", 1);

	function test1(reactiveQueryKey) {
		ReactiveQueryUtils.forceData(null, currentData, reactiveQueryKey);
		test.equal(currentData.get(reactiveQueryKey.name), null, reactiveQueryKey.name + " wrong");
	}
	function test2(reactiveQueryKey) {
		var a;
		ReactiveQueryUtils.forceData(a, currentData, reactiveQueryKey);
		test.equal(currentData.get(reactiveQueryKey.name), null, reactiveQueryKey.name + " wrong");
	}

	test1(SET_OF_KEYS.PAGE);
	test1(SET_OF_KEYS.COUNT);
	test1(SET_OF_KEYS.ORDER);
	test1(SET_OF_KEYS.SORT);
	test1(SET_OF_KEYS.FILTER);

	test2(SET_OF_KEYS.PAGE);
	test2(SET_OF_KEYS.COUNT);
	test2(SET_OF_KEYS.ORDER);
	test2(SET_OF_KEYS.SORT);
	test2(SET_OF_KEYS.FILTER);
});

Tinytest.add('Force data method test without filter', function (test) {
	var currentData = new ReactiveDict();
	currentData.set("page", 3);
	currentData.set("count", 20);
	currentData.set("filter", {orderId: "50", customer: "Messi"});
	currentData.set("sort", "users");
	currentData.set("order", 1);

	function test1(reactiveQueryKey, customData, expectedValue) {
		ReactiveQueryUtils.forceData(customData, currentData, reactiveQueryKey);
		test.equal(currentData.get(reactiveQueryKey.name), expectedValue, reactiveQueryKey.name + " wrong");
	}

	test1(SET_OF_KEYS.PAGE, {p: 1}, 1);
	test1(SET_OF_KEYS.PAGE, {p: "2"}, null);
	test1(SET_OF_KEYS.PAGE, {p: 11}, 11);
	test1(SET_OF_KEYS.PAGE, {}, null);

	test1(SET_OF_KEYS.COUNT, {c: 1}, 1);
	test1(SET_OF_KEYS.COUNT, {c: "2"}, null);
	test1(SET_OF_KEYS.COUNT, {c: 11}, 11);
	test1(SET_OF_KEYS.COUNT, {}, null);

	test1(SET_OF_KEYS.ORDER, {o: 1}, 1);
	test1(SET_OF_KEYS.ORDER, {o: "2"}, null);
	test1(SET_OF_KEYS.ORDER, {o: 11}, 11);
	test1(SET_OF_KEYS.ORDER, {}, null);

	test1(SET_OF_KEYS.SORT, {s: "2"}, "2");
	test1(SET_OF_KEYS.SORT, {s: 1}, null);
	test1(SET_OF_KEYS.SORT, {s: "number1"}, "number1");
	test1(SET_OF_KEYS.SORT, {}, null);
});

Tinytest.add('Force data method test filter only', function (test) {
	var currentData = new ReactiveDict();
	currentData.set("page", 3);
	currentData.set("count", 20);
	currentData.set("filter", {orderId: "50", customer: "Messi"});
	currentData.set("sort", "users");
	currentData.set("order", 1);

	function test1(reactiveQueryKey, customData, expectedValue) {
		ReactiveQueryUtils.forceData(customData, currentData, reactiveQueryKey);
		test.equal(currentData.get(reactiveQueryKey.name), expectedValue, reactiveQueryKey.name + " wrong");
	}

	var filter = {"one.two": [{second: "94"}, 4, {a: [5, 4, {base: 90.4}]}]}
	test1(SET_OF_KEYS.FILTER, {f: filter}, filter);
});
/**
 * Ensure it triggers Tracker only on real data change. If data is the same as it was before, then no Tracker
 * triggering
 */
Tinytest.addAsync('Force data method reactivity test', function (test, onComplete) {
	var currentData = new ReactiveDict();
	currentData.set("p", 3);
	currentData.set("c", 20);
	currentData.set("f", {orderId: "50", customer: "Messi"});
	currentData.set("s", "users");
	currentData.set("o", 1);


	var totalWait = 0;
	function test1(reactiveQueryKey, customData, expectedRunTimes) {
		Meteor.setTimeout(function () {
			ReactiveQueryUtils.forceData(customData, currentData, reactiveQueryKey);
		}, totalWait);
		totalWait += 100;
	}

	var runs = {
		"p": 0,
		"c": 0,
		"f": 0,
		"s": 0,
		"o": 0
	}
	Object.keys(runs).forEach(function (runKey) {
		Tracker.autorun(function () {
			currentData.get(runKey);
			runs[runKey]++;
		});
	});

	test.equal(runs["p"], 1, "Page run more than " + 1);

	test1(SET_OF_KEYS.FILTER, {"f": {orderId: "50", customer: "Messi"}}, 1);
	test1(SET_OF_KEYS.FILTER, {"f": {orderId: "51", customer: "Messi"}}, 2);
	test1(SET_OF_KEYS.FILTER, {"f": {orderId: 51, customer: "Messi"}}, 3);
	test1(SET_OF_KEYS.FILTER, {"f": {orderId: "51", customer: "Messi"}}, 4);
	test1(SET_OF_KEYS.FILTER, {"f": {orderId: "51", array: [1,2,3]}}, 5);
	test1(SET_OF_KEYS.FILTER, {"f": {orderId: "51", array: [1,2,3]}}, 5);
	test1(SET_OF_KEYS.FILTER, {"f": {orderId: "51", array: [1,2,3]}}, 5);
	test1(SET_OF_KEYS.FILTER, {"f": {orderId: "51", array: [1,"2",3]}}, 6);
	test1(SET_OF_KEYS.FILTER, {"f": {array: [1,"2",3]}}, 7);

	Meteor.setTimeout(function () {
		test.equal(runs["f"], 7, "Filter runs more or less");
		onComplete();
	}, totalWait + 1000)

});

