;(function(){
	window.app = {
		models: {},
		routers: {},
		ui: {},
		core: {
			active: null,
			previous: null
		},
		collections: {}
	};
	
	window.jsonPages = [
		{
			title: 'Simple page 1',
			content:'js/app/templates/page01.tpl'
		},
		{
			title: 'Simple page 2',
			content:'js/app/templates/page02.tpl'
		},
		{
			title: 'Simple page 3',
			content:'js/app/templates/page03.tpl'
		}
	];
})();