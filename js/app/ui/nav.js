app.ui.nav = Backbone.View.extend({
	el: '<ul id="nav" />',
	template: _.template('<li><a href="#" data-page="<%= count %>"><%= title %></a></li>'),
	events: {
		'click a': 'clickEl'
	},
	initialize: function(){
		this.render();
	},
	render: function(){
		var that = this;
		
		_.each(app.collections.mainPages.models, function(item){
			that.renderEl(item);
		}, this);
		
		return this;
	},
	renderEl: function(item){
		this.$el.append(this.template(item.toJSON()));
	},
	clickEl: function(e){
		app.routers.mainWorkspace.navigate('page-' + jQuery(e.target).data('page'), {trigger: true});
		e.preventDefault();
	}
});