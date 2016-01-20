Tinytest.add('Check malformed name param', function (test) {
	var exceptionFires = false;
	try {
		new ReactiveQuery(null)
	} catch (e) {
		exceptionFires = true;
	}
	test.isTrue(exceptionFires);
});
Tinytest.add('Check malformed keys param', function (test) {
	var exceptionFires = false;
	try {
		new ReactiveQuery("something", {a: {onChange: 1, name: "opa"}})
	} catch (e) {
		console.error(e);
		exceptionFires = true;
	}
	test.isFalse(exceptionFires);

	try {
		new ReactiveQuery("something")
	} catch (e) {
		exceptionFires = true;
	}
	test.isTrue(exceptionFires);

	exceptionFires = false;
	try {
		new ReactiveQuery("something", {})
	} catch (e) {
		exceptionFires = true;
	}
	test.isTrue(exceptionFires);
});

Tinytest.add('Check default values', function (test) {
	var keys = {
		ONE: "one",
		TWO: {
			value: "something",
			name: "two"
		}
	};
	var myReactivityQuery = new ReactiveQuery("my", keys);

	test.isUndefined(myReactivityQuery.get(keys.ONE));
	test.equal(myReactivityQuery.get(keys.TWO), keys.TWO.value);
});

Tinytest.add('Check get as query param', function (test) {
	var keys = {
		ONE: {
			value: 54,
			name: "one"
		},
		TWO: {
			value: "something",
			name: "two"
		}
	};
	var myReactivityQuery = new ReactiveQuery("my", keys);

	var queryParam = myReactivityQuery.getAsQueryParam();
	test.equal(queryParam.name, "my", "Query param name should be `my` ");
	var decodedParamValue = ReactiveQueryUtils.decodeParam(queryParam.value);
	test.equal(decodedParamValue, {one: 54, two: "something"}, "Query value is wrong");
});

Tinytest.add('Check mimic method', function (test) {
	var keys = {
		ONE: {
			value: 54,
			name: "one"
		},
		TWO: {
			value: "something",
			name: "two"
		}
	};
	var myReactivityQuery = new ReactiveQuery("my", keys);

	var mimicObject = myReactivityQuery.mimic({one: 11});
	test.equal(mimicObject, {one: 11, two: "something"}, "Query value is wrong");
});

Tinytest.add('Check set method', function (test) {
	var keys = {
		ONE: {
			value: 54,
			name: "one"
		},
		TWO: {
			value: "something",
			name: "two"
		},
		HUNDRED: "hundred"
	};
	var myReactivityQuery = new ReactiveQuery("my", keys);
	var params = {my: {}};
	params.my = ReactiveQueryUtils.encodeParam({hundred: 100});
	myReactivityQuery.set(params);

	test.equal(myReactivityQuery.mimic(), {hundred: 100}, "Query value is wrong");
	test.isUndefined(myReactivityQuery.get(keys.ONE));
	test.isUndefined(myReactivityQuery.get(keys.TWO));
	test.equal(myReactivityQuery.get(keys.HUNDRED), 100);
});

Tinytest.add('Check isValid callback with set method', function (test) {
	var keys = {
		ONE: {
			value: 54,
			isValid: function(val){
				return _.isNumber(val);
			},
			name: "one"
		},
		TWO: {
			value: "something",
			name: "two"
		},
		HUNDRED: "hundred"
	};
	var myReactivityQuery = new ReactiveQuery("my", keys);
	var params = {my: {}};
	params.my = ReactiveQueryUtils.encodeParam({hundred: 100, one: "10"});
	myReactivityQuery.set(params);

	test.isUndefined(myReactivityQuery.get(keys.TWO));
	test.isNull(myReactivityQuery.get(keys.ONE));
	test.equal(myReactivityQuery.get(keys.HUNDRED), 100);
});

Tinytest.add('Check isValid callback with mimic method', function (test) {
	var keys = {
		ONE: {
			value: 54,
			isValid: function(val){
				return _.isNumber(val);
			},
			name: "one"
		},
		TWO: {
			value: "something",
			name: "two",
			isValid: function (val) {
				return _.isString(val);
			}
		},
		HUNDRED: "hundred"
	};
	var myReactivityQuery = new ReactiveQuery("my", keys);
	var mimicData = myReactivityQuery.mimic({hundred: 100, one: "10", two: "other"});

	test.equal(mimicData, {one: 54, hundred: 100, two: "other"}, "Query value is wrong");
	test.equal(myReactivityQuery.get(keys.TWO), "something");
	test.equal(myReactivityQuery.get(keys.ONE), 54);
	test.isUndefined(myReactivityQuery.get(keys.HUNDRED));
});

Tinytest.add('Check onChange callback', function (test) {
	var timesChanged = 0;
	var paramsRecord = {

	}
	var onChange = function(oldData, newData, keyName){
		timesChanged ++;
		paramsRecord.oldData= oldData;
		paramsRecord.newData= newData;
		paramsRecord.keyName= keyName;
	}
	var keys = {
		ONE: {
			value: 54,
			name: "one",
			onChange: onChange
		}
	};

	var myReactivityQuery = new ReactiveQuery("my", keys);
	var params = {my: {}};
	params.my = ReactiveQueryUtils.encodeParam({hundred: 100, one: "10", two: "other"});
	myReactivityQuery.set(params);

	test.equal(timesChanged, 1, "onChange callback run 1 time");
	test.equal(paramsRecord.oldData, 54);
	test.equal(paramsRecord.newData, "10");
	test.equal(paramsRecord.keyName, "one");
});