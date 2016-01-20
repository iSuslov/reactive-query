[![Build Status](https://travis-ci.org/iSuslov/reactive-query.svg?branch=master)](https://travis-ci.org/iSuslov/reactive-query)
# reactive-query
Reactive query is a meteor package that makes it easy to serialize application state in URL query params

#API Reference:
<a name="QueryParamObject"></a>
## QueryParamObject : <code>object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | of the query parameter |
| serialized | <code>value</code> | URI encoded value of the query parameter |


<a name="ReactiveQueryKey"></a>
## ReactiveQueryKey : <code>object</code> &#124; <code>string</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | Key name |
| value | <code>\*</code> | Default value |
| isValid | <code>function</code> | Should return `true` or `false`, receives value as first argument |
| onChange | <code>function</code> | Runs if the value is changed, signature: onChange(oldValue, newValue, key.name) |


<a name="ReactiveQuery"></a>
## ReactiveQuery
**Kind**: global class  

* [ReactiveQuery](#ReactiveQuery)
    * [new ReactiveQuery(name, keys)](#new_ReactiveQuery_new)
    * [.get(key, [reactive])](#ReactiveQuery+get) ⇒ <code>\*</code>
    * [.set(params)](#ReactiveQuery+set)
    * [.whatIf([customData])](#ReactiveQuery+whatIf) ⇒ <code>object</code>
    * [.whatIfAsQueryParam([customData])](#ReactiveQuery+whatIfAsQueryParam) ⇒ <code>[QueryParamObject](#QueryParamObject)</code>

<a name="new_ReactiveQuery_new"></a>
### new ReactiveQuery(name, keys)

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> |  |
| keys | <code>[Array.&lt;ReactiveQueryKey&gt;](#ReactiveQueryKey)</code> &#124; <code>[object.&lt;ReactiveQueryKey&gt;](#ReactiveQueryKey)</code> | array or object of ReactiveQueryKey |

<a name="ReactiveQuery+get"></a>
### reactiveQuery.get(key, [reactive]) ⇒ <code>\*</code>
Similar to ReactiveDict, gets value by key

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
NOT SIMILAR to ReactiveDict or ReactiveVar
Force to update data based on query params, ignores invalid data (if isValid callback is defined for the key)
Typically it should be used when url changes.

**Kind**: instance method of <code>[ReactiveQuery](#ReactiveQuery)</code>  

| Param | Type | Description |
| --- | --- | --- |
| params | <code>object</code> | query params object like this {name1: value1, name2: value2}, URI-encoded values expected The same structure as returned by `iron-router` method Router.current().params.query |

<a name="ReactiveQuery+whatIf"></a>
### reactiveQuery.whatIf([customData]) ⇒ <code>object</code>
Provides modified data based on customData. Ignores invalid data (if isValid callback is defined for the key)
If no customData provided or null, returns current data.

**Kind**: instance method of <code>[ReactiveQuery](#ReactiveQuery)</code>  
**Returns**: <code>object</code> - data  

| Param | Type | Description |
| --- | --- | --- |
| [customData] | <code>CustomControllerData</code> | custom data. |

<a name="ReactiveQuery+whatIfAsQueryParam"></a>
### reactiveQuery.whatIfAsQueryParam([customData]) ⇒ <code>[QueryParamObject](#QueryParamObject)</code>
Provides modified controller data based on customData.
If no customData provided or null, returns current data as {QueryParamObject}.

**Kind**: instance method of <code>[ReactiveQuery](#ReactiveQuery)</code>  

| Param | Type | Description |
| --- | --- | --- |
| [customData] | <code>CustomControllerData</code> | custom data |

