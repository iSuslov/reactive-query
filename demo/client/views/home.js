Template.home.helpers({
	isCheckboxChecked: function(value){
		return Details.get(DETAILS_QUERY.CHECKBOX) ? "checked": "";
	},
	isRadioChecked: function(value){
		return Details.get(DETAILS_QUERY.RADIO) === value ? "checked": "";
	},
	isModalOpened: function () {
		return Actions.get(ACTIONS_QUERY.IS_MODAL_OPEN);
	}
});

Template.home.events({
	'click .open-modal': function (event, template) {
		goActions(ACTIONS_QUERY.IS_MODAL_OPEN, true);
	},
	'click .close-modal': function (event, template) {
		goActions(ACTIONS_QUERY.IS_MODAL_OPEN, null); //or false
	},
	'change #checkbox': function(event, template){
		goDetails(DETAILS_QUERY.CHECKBOX, $(event.currentTarget).is(":checked"));
	},
	'change [name=gender]': function(event, template){
		var v = $(event.currentTarget).val();
		console.log(v)
		goDetails(DETAILS_QUERY.RADIO, v);
	}
});

function goActions(key, value){
	var query = Router.current().params.query;
	var newQueryParam = Actions.whatIfAsQueryParam(key, value);
	query[newQueryParam.name] = newQueryParam.value;
	Router.go('home', null, {query: query});
}

function goDetails(key, value){
	var query = Router.current().params.query;
	var newQueryParam = Details.whatIfAsQueryParam(key, value);
	query[newQueryParam.name] = newQueryParam.value;
	Router.go('home', null, {query: query});
}