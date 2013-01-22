app.ui.navigation = Backbone.View.extend({
	el: jQuery('#header'),
	model: app.models.Page,
	id: 'nav',
	template: _.template('<li><a href="#"></a></li>'),
	initialize: function(){
		// pages.fetch();
	},
	render: function(){
		// console.log(this.model)
		// this.$el.html(this.template(this.model.toJSON()));
		return this;
	}
});

var nav = new app.ui.navigation;

jQuery(function(){
	// console.log(nav);
	// nav.$el.append(nav.render().el);
});