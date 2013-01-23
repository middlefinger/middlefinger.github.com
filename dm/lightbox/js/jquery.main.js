jQuery(function(){
	initLb();
});

function initLb(){
	jQuery('ul.image-list a').colorbox({
		rel: 'gr',
		previous: '&lt;',
		next: '&gt;',
		close: 'X',
		onOpen:function(){ console.log('onOpen: colorbox is about to open'); },
		onLoad:function(){ console.log('onLoad: colorbox has started to load the targeted content'); },
		onComplete:function(){ console.log('onComplete: colorbox has displayed the loaded content'); },
		onCleanup:function(){ console.log('onCleanup: colorbox has begun the close process'); },
		onClosed:function(){ console.log('onClosed: colorbox has completely closed'); }
	});
}