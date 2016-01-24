[![Build Status](https://travis-ci.org/iSuslov/reactive-query.svg?branch=master)](https://travis-ci.org/iSuslov/reactive-query)

```
meteor add zuzel:reactive-query
```

<a href="https://atmospherejs.com/zuzel/reactive-query">https://atmospherejs.com/zuzel/reactive-query</a>

<a href="http://reactive-query.meteor.com/">DEMO</a>

# reactive-query
Reactive query is a meteor package that makes it easy to serialize application state in URL query params
Can save data as a query param without ruining URL.

#Example:

## reactiveQuery-config.js
```js
//define keys for query
ACTIONS_QUERY = {
    IS_MODAL_OPEN: {
        name: "m",
        isValid: _.isBoolean
    }
}
Actions = new ReactiveQuery("actions", ACTIONS_QUERY);
```

## Router.js
```js
Router.route('/', {
    name: 'home',
    onBeforeAction: function () {
        Actions.set(this.params.query);
        this.next();
    }
});
```

## Template controller
```js
Template.home.helpers({
    isModalOpened: function () {
        return Actions.get(ACTIONS_QUERY.IS_MODAL_OPEN);
    }
});
Template.home.events({
    'click .open-modal': function (event, template) {
        goActions(ACTIONS_QUERY.IS_MODAL_OPEN, true);
    }
    'click .close-modal': function (event, template) {
        goActions(ACTIONS_QUERY.IS_MODAL_OPEN, null); //or false
    }
});
function goActions(key, value){
	var query = Router.current().params.query;
	var newQueryParam = Actions.whatIfAsQueryParam(key, value);
	query[newQueryParam.name] = newQueryParam.value;
	Router.go('home', null, {query: query});
}
```

## Template
```
 {{#if isModalOpened}}
    <div class="modal-simple-fade fit">
        <div class="modal-simple">
            <h1>Hello! You can reload this page..</h1>
            <span>..and I'm still here waiting for you..</span>
            <button type="button" class="close-modal" style="position: absolute; bottom: 20px; right: 20px;">
                Close
            </button>
        </div>
    </div>
 {{/if}}
```

#API Reference:
<a name="QueryParamObject"></a>
## QueryParamObject : <code>object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | of the query parameter |
| value | <code>string</code> | serialized URI-encoded value of the query parameter |


<a name="ReactiveQueryKey"></a>
## ReactiveQueryKey : <code>object</code> &#124; <code>string</code>
It could be just a String value, which will be treated as a name of parameter, or an object.

**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | Key name |
| value | <code>\*</code> | Default value |
| isValid | <code>function</code> | Should return `true` or `false`, receives the value as first argument |
| onChange | <code>function</code> | Runs if the value is changed, signature: onChange(oldValue, newValue, key.name) |


<a name="ReactiveQuery"></a>
## ReactiveQuery
**Kind**: global class  

* [ReactiveQuery](#ReactiveQuery)
    * [new ReactiveQuery(name, keys)](#new_ReactiveQuery_new)
    * [.getName()](#ReactiveQuery+getName) ⇒ <code>String</code>
    * [.get(key, [reactive])](#ReactiveQuery+get) ⇒ <code>\*</code>
    * [.set(params)](#ReactiveQuery+set)
    * [.whatIf([...arguments])](#ReactiveQuery+whatIf) ⇒ <code>object</code>
    * [.whatIfAsQueryParam([...arguments])](#ReactiveQuery+whatIfAsQueryParam) ⇒ <code>[QueryParamObject](#QueryParamObject)</code>

<a name="new_ReactiveQuery_new"></a>
### new ReactiveQuery(name, keys)
ReactiveQuery constructor.


| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> |  |
| keys | <code>[Array.&lt;ReactiveQueryKey&gt;](#ReactiveQueryKey)</code> &#124; <code>Object.&lt;string, ReactiveQueryKey&gt;</code> | array or object of ReactiveQueryKey |

<a name="ReactiveQuery+getName"></a>
### reactiveQuery.getName() ⇒ <code>String</code>
Get ReactiveQuery name which is used as query param name

**Kind**: instance method of <code>[ReactiveQuery](#ReactiveQuery)</code>  
**Returns**: <code>String</code> - name  
<a name="ReactiveQuery+get"></a>
### reactiveQuery.get(key, [reactive]) ⇒ <code>\*</code>
Similar to ReactiveDict, gets the value by the key

**Kind**: instance method of <code>[ReactiveQuery](#ReactiveQuery)</code>  
**Returns**: <code>\*</code> - any serializable data  
**Throws**:

- Error If key is malformed


| Param | Type | Description |
| --- | --- | --- |
| key | <code>[ReactiveQueryKey](#ReactiveQueryKey)</code> | key to get data |
| [reactive] | <code>boolean</code> | Default true; pass false to disable reactivity |

<a name="ReactiveQuery+set"></a>
### reactiveQuery.set(params)
**NOT SIMILAR to ReactiveDict or ReactiveVar**.
Updates the data based on query params, ignores and deletes invalid data (if isValid callback is defined for the
key).
Typically it should be used when a url changes.

**Kind**: instance method of <code>[ReactiveQuery](#ReactiveQuery)</code>  

| Param | Type | Description |
| --- | --- | --- |
| params | <code>object</code> | query params object like this {name1: value1, name2: value2}, URI-encoded values expected The same structure as returned by the `iron-router` method Router.current().params.query |

<a name="ReactiveQuery+whatIf"></a>
### reactiveQuery.whatIf([...arguments]) ⇒ <code>object</code>
Provides merged data based on the customData. Ignores invalid data (if isValid callback is defined for the key)
If no customData provided or null, returns current data.
If value is an object, you can use $unset as an entire key, to delete values from object.
For example {$unset: {name: 1, surname}, question: "?"} for {name: "A", surname: "B",  question: ""}
will result {question: "?"}

**Kind**: instance method of <code>[ReactiveQuery](#ReactiveQuery)</code>  
**Returns**: <code>object</code> - Current (possibly modified if customData argument provided) data as a key-value pairs  

| Param | Type | Description |
| --- | --- | --- |
| [...arguments] | <code>\*</code> | any number of arguments as key value, for example whatIf(key,value,key2,value2) |

<a name="ReactiveQuery+whatIfAsQueryParam"></a>
### reactiveQuery.whatIfAsQueryParam([...arguments]) ⇒ <code>[QueryParamObject](#QueryParamObject)</code>
Provides merged data based on the customData. Ignores invalid data (if isValid callback is defined for the key)
If no customData provided or null, returns current data as {QueryParamObject}.
If value is an object, you can use $unset as an entire key, to delete values from object.
For example {$unset: {name: 1, surname}, question: "?"} for {name: "A", surname: "B",  question: ""}
will result {question: "?"}

**Kind**: instance method of <code>[ReactiveQuery](#ReactiveQuery)</code>  

| Param | Type | Description |
| --- | --- | --- |
| [...arguments] | <code>\*</code> | any number of arguments as key value, for example whatIfAsQueryParam(key,value,key2,value2) |

