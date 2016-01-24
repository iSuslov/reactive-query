Router.configure({
	layoutTemplate: 'layout',
	loadingTemplate: 'loading'
});

Router.route('/', {
	name: 'home',
	onBeforeAction: function () {
		Actions.set(this.params.query);
		Details.set(this.params.query);
		this.next();
	}
});
