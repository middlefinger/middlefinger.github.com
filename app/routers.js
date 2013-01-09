app.routers.Workspace = Backbone.Router.extend({
	routes: {
		'help': 'help',
		'search/:query': 'search',
		'search/:query/p:page': 'search',
	},
	help: function(){
		console.log('help');
	},
	search: function(query, page){
		console.log('search', ', query =', query, ', page =', page);
	}
});

jQuery(function(){
	app.routers.workspace = new app.routers.Workspace;
	Backbone.history.start();
});