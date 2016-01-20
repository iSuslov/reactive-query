/**
 * @typedef {object|string} ReactiveQueryKey
 * @property {string} name Key name
 * @property {*} [value] Default value
 * @property {function} [isValid] Should return `true` or `false`, receives value as first argument
 * @property {function} [onChange] Runs if the value is changed, signature: onChange(oldValue, newValue, key.name)
 */

/**
 *
 * @param name {string}
 * @param keys {Array.<ReactiveQueryKey>|object.<ReactiveQueryKey>} array or object of ReactiveQueryKey
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
	 * {array} of keys
	 */
	var entireKeys = ReactiveQueryUtils.normalizeKeys(_.clone(keys));
	var currentData = new ReactiveDict();
	_.each(entireKeys, function(key){
		if(typeof key.value !== "undefined"){
			currentData.set(key.name, key.value);
		}
	});

	/**
	 * Similar to ReactiveDict, gets value by key
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
	 * Controller data as URI query param
	 * Provides modified controller data based on customData.
	 * If no customData provided or null, returns current data.
	 * @param {CustomControllerData} [customData] custom data
	 * @returns {ListControllerQuery}
	 */
	this.getAsQueryParam = function (customData) {
		var data = generateData(customData);
		return {
			name: name,
			value: ReactiveQueryUtils.encodeParam(data)
		}
	}

	/**
	 * Provides modified data based on customData. Ignores invalid data (if isValid callback is defined for the key)
	 * If no customData provided or null, returns current data.
	 * @param {CustomControllerData} [customData] custom data
	 */
	this.mimic = function (customData) {
		return generateData(customData);
	}

	/**
	 * Force to update data based on query params, ignores invalid data (if isValid callback is defined for the key)
	 * Typically it should be used when url changes.
	 * @param params {object} query params object like this {name1: value1, name2: value2}, URI-encoded values expected
	 * The same structure as returned by `iron-router` method Router.current().params.query
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