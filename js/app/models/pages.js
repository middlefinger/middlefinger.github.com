app.models.page = Backbone.Model.extend({
	defaults:{
		title: 'Title',
		content: ''
	}
});

app.collections.pages = Backbone.Collection.extend({
	url: 'js/base/base.json',
	model: app.models.page,
	initialize: function(){
		this.fetch();
	}
});