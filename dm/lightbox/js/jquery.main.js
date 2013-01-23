jQuery(function(){
	initLb();
	new fadeGallery('.post', {
		list: 'ul.image-list'
	});
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
		onComplete:function(){
			// paste code here
		},
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

function fadeGallery(node, opt){
	this.init(node, opt);
}
fadeGallery.prototype = {
	defualts: {
		list: 'ul',
		el: '> li',
		speed: 500,
		activeClass: 'active'
	},
	init: function(node, opt){
		this.node = jQuery(node).eq(0);
		if(this.node.length){
			this.extendOpt(this.defaults, opt);
		}
	},
	extendOpt: function(def, opt){
		for(var key in def){
			console.log(def, def[key]);
		}
	},
	destroy: function(){}
}