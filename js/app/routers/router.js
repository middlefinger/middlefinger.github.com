app.routers.Workspace = Backbone.Router.extend({
	routes:{
		'page-:id': 'page',
		'*action': 'main'
	},
	initialize: function(){
		console.log('init');
		this.pagesHolder = jQuery('#pages');
		app.collections.mainPages = new app.collections.pages;
		app.ui.mainPages = new app.ui.mainApp({el: this.pagesHolder});
		jQuery('#header').append(new app.ui.nav().$el);
		this.pagesHolder.children('.page').eq(window.app.core.active).addClass('active');
	},
	main: function(){
		console.log('main route');
		if(window.app.core.active == null) {
			app.ui.mainPages.openPage(0);
			app.routers.mainWorkspace.navigate('page-0', {trigger: true});
		}
	},
	page: function(id){
		console.log('page route');
		app.ui.mainPages.openPage(id);
	}
});

jQuery(function(){
	app.routers.mainWorkspace = new app.routers.Workspace;
	Backbone.history.start();
});