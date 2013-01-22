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
	var simpleModel = Backbone.Model.extend({
		url: 'base.json',
		defaults:{
			title: 'Defaults title',
			html: '<p>Simple paragraph</p>'
		}
	});
	var modelList = Backbone.Collection.extend({
		model: simpleModel,
		urlRoot:'/'
	});
	var models = new modelList;

	for(var i = 0; i < models.models.length; i++){
		var modelJson = models.models[i].toJSON();
		for(var key in modelJson){
			alert(key + ' = ' + modelJson[key])
		}
	}
}