jQuery(function(){
	initLb();
});

function initLb(){
	jQuery('ul.image-list a').colorbox({
		rel: 'gr',
		previous: '&lt;',
		next: '&gt;'
		close: 'X;'
	});
}