;(function() {
	window.app = {
		core: {state: null},
		routers: {},
		models: {},
		ui: {}
	};
})();

jQuery(function(){
	app.routers.workspace = new app.routers.Workspace;
	Backbone.history.start();
});