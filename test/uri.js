Tinytest.add('Encode and decode URI: {"some.entire": [1, 4, "5"]}', function (test) {
	function test1(object) {
		var encoded = ReactiveQueryUtils.encodeParam(object);
		test.equal(ReactiveQueryUtils.decodeParam(encoded),
			object, 'Can not handle: ' + JSON.stringify(object));
	}

	test1({"some.entire": [1, 4, "5"]});
});

Tinytest.add('Encode and decode URI: {$and: [{first: "string", second: 4}]}', function (test) {
	function test1(object) {
		var encoded = ReactiveQueryUtils.encodeParam(object);
		test.equal(ReactiveQueryUtils.decodeParam(encoded),
			object, 'Can not handle: ' + JSON.stringify(object));
	}

	test1({$and: [{first: "string", second: 4}]});
});


Tinytest.add('Encode and decode URI: {"one.two": [{second: "94"}, 4, {a: [5,4, {base: 90.4}]}]}', function (test) {
	function test1(object) {
		var encoded = ReactiveQueryUtils.encodeParam(object);
		test.equal(ReactiveQueryUtils.decodeParam(encoded),
			object, 'Can not handle: ' + JSON.stringify(object));
	}

	test1({"one.two": [{second: "94"}, 4, {a: [5, 4, {base: 90.4}]}]});
});

Tinytest.add('Encode and decode URI: {"%^#*& #^": "%!@% (*%\'_"}', function (test) {
	function test1(object) {
		var encoded = ReactiveQueryUtils.encodeParam(object);
		test.equal(ReactiveQueryUtils.decodeParam(encoded),
			object, 'Can not handle: ' + JSON.stringify(object));
	}

	test1({"%^#*& #^": "%!@% (*%'_"});
});