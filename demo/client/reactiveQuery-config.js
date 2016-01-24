//define keys for query
DETAILS_QUERY = {
	CHECKBOX: {
		name: "c"
	},
	RADIO: {
		name: "r"
	}
}

ACTIONS_QUERY = {
	IS_MODAL_OPEN: {
		name: "m",
		isValid: _.isBoolean
	}
}

Details = new ReactiveQuery("details", DETAILS_QUERY);
Actions = new ReactiveQuery("actions", ACTIONS_QUERY);
