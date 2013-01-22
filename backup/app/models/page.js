jQuery(function(){

var simple = Backbone.Model.extend({
	url: 'http://morning-coast-3645.herokuapp.com/api',
	defaults:{
		title: "Default title of page",
		html: ""
	}
});
var simpleList = Backbone.Collection.extend({
	model: simple
});


	var simples = new simpleList;
	// simples.fetch();
	console.log(simples);
});