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
		onCleanup:function(){},
		onClosed:function(){
			jQuery('#colorbox').off('click', 'a.prev-work', prevColorBox);
			jQuery('#colorbox').off('click', 'a.next-work', nextColorBox);
			jQuery('#colorbox').off('click', 'a.return', closeColorBox);
		}
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