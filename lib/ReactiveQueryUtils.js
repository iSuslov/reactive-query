ReactiveQueryUtils = new function () {
	/**
	 * isInteger
	 * @type {*|Function}
	 */
	this.isInteger = Number.isInteger || function (value) {
			return typeof value === "number" &&
				isFinite(value) &&
				Math.floor(value) === value;
		}

	/**
	 * Performs soft merge in resultTarget
	 */
	this.mergeSpecial = function (customData, currentData, resultTarget, complexKey) {
		var key = complexKey.name;
		var isValid = complexKey.isValid;

		var currentVal = currentData.get(key);
		var customVal = customData ? customData[key] : undefined;

		var isCurrentValValid = typeof currentVal !== "undefined" && isValid(currentVal);
		var isCustomValValid = typeof customVal !== "undefined" && isValid(customVal);
		if ((!isCurrentValValid && !isCustomValValid) || customVal === null) {
			return; //removed, or undefined in both objects key.
		}

		if (isCurrentValValid ^ isCustomValValid) { //if XOR is true
			resultTarget[key] = isCustomValValid ? customVal : currentVal;
		} else { // if XOR is false then isCurrentValValid and isCustomValValid are both true, since other cases checked
			if (_.isObject(customVal)) {
				resultTarget[key] = _.clone(currentVal);
				_.each(customVal.$unset, function (unsetKey) {
					if (_.isString(unsetKey)) {
						delete resultTarget[key][unsetKey];
					} else if (_.isArray(unsetKey)) {
						var currVal = resultTarget[key][unsetKey[0]];
						var index = _.findIndex(currVal, function(item){
							return item.hasOwnProperty(unsetKey[1]);
						});
						currVal.splice(index, 1);
					}
				});
				delete customVal["$unset"];
				_.each(customVal, function (v, k) {
					resultTarget[key][k] = v;
				});
			} else {
				resultTarget[key] = customVal;
			}
		}
	}
	/**
	 * Sets data to reactive dict
	 * @param newData {object} decoded and deserialized query param value
	 * @param oldData {ReactiveDict} reactive dict controller data
	 * @param key {ReactiveQueryKey} key object
	 * @returns {boolean} `true` if value was changed, otherwise `false`
	 */
	this.forceData = function (newData, oldData, key) {
		var newValue = newData != undefined && key.isValid(newData[key.name]) ? newData[key.name] : null;
		var oldValue = ReactiveQueryUtils.getWithoutReactivity(oldData, key.name);
		var isEqual = _.isEqual(newValue, oldValue);
		if (!isEqual) {
			oldData.set(key.name, newValue);
			key.onChange && key.onChange(oldValue, newValue, key.name);
		}
		return !isEqual;
	}

	/**
	 * Encodes query param to a URI-save string.
	 * @param object {Object} object param
	 * @returns {string}
	 */
	this.encodeParam = function (object) {
		var r1 = /(")([^"]*)(")(:)/g
		var string = JSON.stringify(object).replace(/\(/g, "\\(").replace(/\)/g, "\\)")
			.replace(r1, "$2$4")
			.replace(/{/g, "(")
			.replace(/}/g, ")");
		return encodeURI(string.substring(1, string.length - 1));
	}
	/**
	 * Decode query param, encoded by this utils
	 * @param param {string}
	 */
	this.decodeParam = function (param) {
		var string = '{' + decodeURI(param) + '}';
		var r1 = /([{])([^:]*)[:]/g //names with :
		var r2 = /([,])([^,"]*)[:]/g //names after ,
		string = string
			.replace(/([^\\])(\))/g, '$1}').replace(/([^\\])(\()/g, '$1{').replace(/([^\\])(\))/g, '$1}')
			.replace(/\\\)/g, ')').replace(/\\\(/g, '(')
			.replace(r1, '{"$2":')
			.replace(r2, ',"$2":');
		return JSON.parse(string);
	}
	/**
	 * Returns a value from reactive data source, but without reactive dependency
	 * @param variable {(ReactiveVar|ReactiveDict)} reactive data source
	 * @param [key] {string} key is required only if ReactiveDict is provided
	 * @returns {any} value from reactive data source
	 */
	this.getWithoutReactivity = function (variable, key) {
		return Tracker.nonreactive(function () {
			return variable.get(key);
		})
	}

	var ALLOWED_KEY_PROPERTIES = ["name", "value", "onChange", "isValid"];
	/**
	 *
	 * @param key {ReactiveQueryKey}
	 */
	this.validateKeyOrDie = function (key) {
		if (_.isString(key)) return;
		if (_.isObject(key)) {
			var unknownKeys = _.difference(_.keys(key), _.values(ALLOWED_KEY_PROPERTIES)).join(", ");
			if (unknownKeys) {
				throw new Error("Key " + key.name + " has unknown properties: " + unknownKeys)
			}
			return
		}
		throw new Error("Key " + key + " is malformed, only {string} or {object} with property `name` of type" +
			" {string} allowed")
	}

	/**
	 * Normalize and return ReactiveQueryKey array of keys
	 * @param keys {Array.<ReactiveQueryKey>|object.<ReactiveQueryKey>}
	 * @returns {Array.<ReactiveQueryKey>} normalized array of
	 */
	this.normalizeKeys = function (keys) {
		var dummy = function () {
			return true;
		}
		return _.map(keys, function (v) {
			var obj = {}
			if (_.isObject(v)) {
				_.extend(obj, v);
				obj.isValid = v.isValid || dummy;
			} else {
				obj.name = v;
				obj.isValid = dummy;
			}
			return obj;
		})
	}
}
