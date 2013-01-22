var simpleJson = [
	{
		"title": "Simple title 1",
		"html": "<span>Simple html 1</span>"
	},
	{
		"title": "Simple title 2",
		"html": "<span>Simple html 2</span>"
	},
	{
		"title": "Simple title 3",
		"html": "<span>Simple html 3</span>"
	},
	{
		"title": "Simple title 4",
		"html": "<span>Simple html 4</span>"
	}
];

jQuery(function(){
	initModelTest();
});

function initModelTest(){

	Backbone.emulateHTTP = true;
	Backbone.emulateJSON = true;
	
	var simpleModel = Backbone.Model.extend({
		defaults:{
			title: 'Defaults title',
			html: '<p>Simple paragraph</p>'
		}
	});
	var modelList = Backbone.Collection.extend({
		url: 'app/base.json',
		model: simpleModel
	});

	var models = new modelList;

	var simpleView = Backbone.View.extend({
		template: _.template(jQuery('#tmpl').html()),
		render: function(){
			this.$el.html(this.template(this.model.toJSON()));
			return this;
		}
	});

	var mainView = Backbone.View.extend({
		el: jQuery('#content'),
		initialize: function(){
			var that = this;
			models.fetch();
			this.render();
		},
		render: function(){
			var that = this;
			_.each(models.models, function(item){
				that.renderEl(item);
			}, this);
		},
		renderEl: function(item){
			var view = new simpleView({model: item});
			this.$el.append(view.render().el);
		}
	});

	var mainApp = new mainView;

}