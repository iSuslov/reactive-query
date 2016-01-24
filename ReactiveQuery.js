
/**
 * It could be just a String value, which will be treated as a name of parameter, or an object.
 * @typedef {object|string} ReactiveQueryKey
 * @property {string} name Key name
 * @property {*} [value] Default value
 * @property {function} [isValid] Should return `true` or `false`, receives the value as first argument
 * @property {function} [onChange] Runs if the value is changed, signature: onChange(oldValue, newValue, key.name)
 */

/**
 * @typedef {object} QueryParamObject
 * @property {string} name of the query parameter
 * @property {string} value serialized URI-encoded value of the query parameter
 */

/**
 * ReactiveQuery constructor.
 * @param name {string}
 * @param keys {(Array.<ReactiveQueryKey>|Object.<string,ReactiveQueryKey>)} array or object of ReactiveQueryKey
 * @constructor
 */
ReactiveQuery = function (name, keys) {
	if (!name || !_.isString(name)) {
		throw new Error("Name of type {string} is required, since it is used as a name for the query param");
	}
	if (!_.isObject(keys) || !_.keys(keys).length || _.each(keys, ReactiveQueryUtils.validateKeyOrDie)) {
		throw new Error("Keys object required");
	}

	/**
	 * @private
	 * {array} normalized array of keys
	 */
	var entireKeys = ReactiveQueryUtils.normalizeKeys(_.clone(keys));
	var currentData = new ReactiveDict();
	// set default values if any
	_.each(entireKeys, function (key) {
		if (typeof key.value !== "undefined") {
			currentData.set(key.name, key.value);
		}
	});
	/**
	 * Get ReactiveQuery name which is used as query param name
	 * @returns {String} name
	 */
	this.getName = function(){
		return name;
	}
	/**
	 * Similar to ReactiveDict, gets the value by the key
	 * @param key {ReactiveQueryKey} key to get data
	 * @param [reactive] {boolean} Default true; pass false to disable reactivity
	 * @throws Error If key is malformed
	 * @returns {*} any serializable data
	 */
	this.get = function (key, reactive) {
		ReactiveQueryUtils.validateKeyOrDie(key);
		var key = _.isObject(key) ? key.name : key;
		if (reactive === false) {
			return ReactiveQueryUtils.getWithoutReactivity(currentData, key)
		}
		return currentData.get(key);
	}
	/**
	 * **NOT SIMILAR to ReactiveDict or ReactiveVar**.
	 * Updates the data based on query params, ignores and deletes invalid data (if isValid callback is defined for the
	 * key).
	 * Typically it should be used when a url changes.
	 * @param params {object} query params object like this {name1: value1, name2: value2}, URI-encoded values expected
	 * The same structure as returned by the `iron-router` method Router.current().params.query
	 */
	this.set = function (params) {
		var paramEncoded = params[name];
		var param = null;
		try {
			param = _.isString(paramEncoded) ? ReactiveQueryUtils.decodeParam(paramEncoded) : null;
		} catch (e) {
			console.warn && console.warn("Malformed url param `" + name + "`: ", e);
		}
		entireKeys.forEach(function (key) {
			ReactiveQueryUtils.forceData(param, currentData, key);
		});
	}
	/**
	 * Provides merged data based on the customData. Ignores invalid data (if isValid callback is defined for the key)
	 * If no customData provided or null, returns current data.
	 * If value is an object, you can use $unset as an entire key, to delete values from object.
	 * For example {$unset: {name: 1, surname}, question: "?"} for {name: "A", surname: "B",  question: ""}
	 * will result {question: "?"}
	 * @param {...*} [arguments] any number of arguments as key value, for example whatIf(key,value,key2,value2)
	 * @returns {object} Current (possibly modified if customData argument provided) data as a key-value pairs
	 */
	this.whatIf = function () {
		return generateData(parseArgs(arguments), currentData, entireKeys);
	}
	/**
	 * Provides merged data based on the customData. Ignores invalid data (if isValid callback is defined for the key)
	 * If no customData provided or null, returns current data as {QueryParamObject}.
	 * If value is an object, you can use $unset as an entire key, to delete values from object.
	 * For example {$unset: {name: 1, surname}, question: "?"} for {name: "A", surname: "B",  question: ""}
	 * will result {question: "?"}
	 * @param {...*} [arguments] any number of arguments as key value, for example whatIfAsQueryParam(key,value,key2,value2)
	 * @returns {QueryParamObject}
	 */
	this.whatIfAsQueryParam = function () {
		var data = generateData(parseArgs(arguments), currentData, entireKeys);
		return {
			name: name,
			value: ReactiveQueryUtils.encodeParam(data)
		}
	}
}

function parseArgs(args) {
	if(typeof args === "undefined"){
		return;
	}

	var i = 0, n = args.length, result = {};
	for (; i < n; i += 2) {
		if (typeof args[i] !== "undefined" && typeof args[i + 1] !== "undefined") {
			var key = _.isObject(args[i])? args[i].name : args[i];
			result[key] = args[i + 1];
		}
	}

	if (Object.keys(result).length) {
		return result;
	}
}

/**
 * @private
 * Generate data based on current controller data, merged with custom data, using specified key
 * @param customData {CustomControllerData}
 * @param keyType {String} type of keys to use. 'normal' or 'uri'
 * @returns {Object}
 */
function generateData(customData, currentData, entireKeys) {
	var result = {};
	entireKeys.forEach(function (key) {
		ReactiveQueryUtils.mergeSpecial(customData, currentData, result, key);
	});
	return result
}