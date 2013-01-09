app.routers.Workspace = Backbone.Router.extend({
	routes: {
		'': 'main',
		'*': 'main',
		'help': 'help',
		'search/:query': 'search',
		'search/:query/p:page': 'search',
	},
	main: function(){
		console.log('Main Page');
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