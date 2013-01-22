app.ui.page = Backbone.View.extend({
	className: 'page',
	render: function(){
		this.$el.data('target', this.model.toJSON().content);
		return this;
	}
});