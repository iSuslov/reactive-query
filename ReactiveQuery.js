/**
 * @typedef {object|string} ReactiveQueryKey
 * @property {string} name Key name
 * @property {*} [value] Default value
 * @property {function} [isValid] Should return `true` or `false`, receives the value as first argument
 * @property {function} [onChange] Runs if the value is changed, signature: onChange(oldValue, newValue, key.name)
 */

 /**
 * @typedef {object} QueryParamObject
 * @property {string} name of the query parameter
 * @property {value} serialized URI-encoded value of the query parameter
 */

/**
 *
 * @param name {string}
 * @param keys {(Array.<ReactiveQueryKey>|Object.<string,ReactiveQueryKey>)} array or object of ReactiveQueryKey
 * @constructor
 */

ReactiveQuery = function (name, keys) {
	if (!name || !_.isString(name)) {
		throw new Error("Name of type {string} is required, since it is used as a name for the query param");
	}
	if(!_.isObject(keys) || !_.keys(keys).length || _.each(keys, ReactiveQueryUtils.validateKeyOrDie)){
		throw new Error("Keys object required");
	}

	/**
	 * @private
	 * {array} normalized array of keys
	 */
	var entireKeys = ReactiveQueryUtils.normalizeKeys(_.clone(keys));
	var currentData = new ReactiveDict();
	// set default values if any
	_.each(entireKeys, function(key){
		if(typeof key.value !== "undefined"){
			currentData.set(key.name, key.value);
		}
	});

	/**
	 * Similar to ReactiveDict, gets the value by the key
	 * @param key {ReactiveQueryKey} key to get data
	 * @param [reactive] {boolean} Default true; pass false to disable reactivity
	 * @throws Error If key is malformed
	 * @returns {*} any serializable data
	 */
	this.get = function (key, reactive) {
		ReactiveQueryUtils.validateKeyOrDie(key);
		var key = _.isObject(key) ? key.name: key;
		if(reactive === false){
			return ReactiveQueryUtils.getWithoutReactivity(currentData, key)
		}
		return currentData.get(key);
	}

	/**
	 * **NOT SIMILAR to ReactiveDict or ReactiveVar**.
	 * Updates the data based on query params, ignores invalid data (if isValid callback is defined for the
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
	 * @param {CustomControllerData} [customData] custom data.
	 * @returns {object} Current (possibly modified if customData argument provided) data as a key-value pairs
	 */
	this.whatIf = function (customData) {
		return generateData(customData);
	}

	/**
	 * Provides merged data based on the customData. Ignores invalid data (if isValid callback is defined for the key)
	 * If no customData provided or null, returns current data as {QueryParamObject}.
	 * @param {CustomControllerData} [customData] custom data
	 * @returns {QueryParamObject}
	 */
	this.whatIfAsQueryParam = function (customData) {
		var data = generateData(customData);
		return {
			name: name,
			value: ReactiveQueryUtils.encodeParam(data)
		}
	}

	/**
	 * @private
	 * Generate data based on current controller data, merged with custom data, using specified key
	 * @param customData {CustomControllerData}
	 * @param keyType {String} type of keys to use. 'normal' or 'uri'
	 * @returns {CustomControllerData}
	 */
	function generateData(customData) {
		var result = {};
		entireKeys.forEach(function(key){
			ReactiveQueryUtils.mergeSpecial(customData, currentData, result, key);
		});
		return result
	}
}