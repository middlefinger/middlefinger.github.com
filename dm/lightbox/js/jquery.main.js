jQuery(function(){
	initLb();
});

function initLb(){
	var cBox = jQuery('ul.image-list a').colorbox({
		rel: 'gr',
		previous: '&lt;',
		next: '&gt;',
		close: 'X',
		onOpen:function(){
			jQuery('#colorbox').on('click', 'a.prev-work', prevColorBox);
			jQuery('#colorbox').on('click', 'a.next-work', nextColorBox);
			jQuery('#colorbox').on('click', 'a.return', closeColorBox);
		},
		onLoad:function(){ console.log('onLoad: colorbox has started to load the targeted content', arguments); },
		onComplete:function(){ console.log('onComplete: colorbox has displayed the loaded content', arguments); },
		onCleanup:function(){ console.log('onCleanup: colorbox has begun the close process', arguments); },
		onClosed:function(){ console.log('onClosed: colorbox has completely closed', arguments); }
	});
	
	function closeColorBox(){
		cBox.colorbox.close();
	}
	function prevColorBox(){
		cBox.colorbox.prev();
	}
	function nextColorBox(){
		cBox.colorbox.next();
	}
}