/**
 * Basic class for error handling
 * @constructor
 */

ReactiveQuerySettings = {
	onError: function (error) {
		console.warn && console.warn("Error in ListController: " + error);
	},
	queryParamName: function(name){
		return id;
	}
}