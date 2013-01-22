app.models.page = Backbone.Model.extend({
	defaults:{
		title: 'Title',
		content: ''
	}
});

app.collections.pages = Backbone.Collection.extend({
	url: '../../base/base.json',
	model: app.models.page
});