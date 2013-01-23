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
			jQuery('#colorbox').on('click', ['a.prev-work', 'a.next-work', 'a.return'], handlerColorBox);
			// jQuery('#colorbox').on('click', 'a.prev-work', prevColorBox);
			// jQuery('#colorbox').on('click', 'a.next-work', nextColorBox);
			// jQuery('#colorbox').on('click', 'a.return', closeColorBox);
		},
		onComplete:function(){
			jQuery('#colorbox').data('gallery', new fadeGallery('#colorbox .gallery-holder', {
				list: '.g1 > ul',
				thumbs: '.thumbs > ul > li',
				thumasdbs: '.thumbs > ul > li',
				onLoad: function(that){
					// console.log(that);
				}
			}));
		},
		onClosed:function(){
			jQuery('#colorbox').data('gallery').destroy();
			jQuery('#colorbox').data('gallery', null);
			
			jQuery('#colorbox').off('click', 'a.prev-work', prevColorBox);
			jQuery('#colorbox').off('click', 'a.next-work', nextColorBox);
			jQuery('#colorbox').off('click', 'a.return', closeColorBox);
		}
	});
	
	function handlerColorBox(e){
		var el = e.target;
		console.log(el, e);
	}
	
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
	this.options = this.extend({
		list: 'ul',
		el: '> li',
		thumbs: 'ul.thumbs > li',
		speed: 500,
		activeClass: 'active',
		onLoad: false
	}, opt);
	this.init(node);
}
fadeGallery.prototype = {
	extend: function(obj, newObj){
		if(newObj) 
			for(var key in newObj) {
				if(obj.hasOwnProperty(key) && obj[key] != newObj[key]) obj[key] = newObj[key];
			}
		return obj;
	},
	init: function(node){
		this.node = jQuery(node).eq(0);
		if(this.node.length){
			this.list = this.node.find(this.options.list);
			this.el = this.list.find(this.options.el);
			this.thumbs = this.node.find(this.options.thumbs);
			if(!this.list.length || !this.el.length || !this.thumbs) return
			this.prepare();
			this.attachEvents();
		}
		else return;
	},
	prepare: function(){
		this.active = 0;
		this.wait = false;
		this.el.not(this.el.eq(this.active)).css({display: 'none', opacity:0}).end().eq(this.active).css({display: 'block', opacity:''});
		if(typeof this.options.onLoad === 'function') this.options.onLoad(this);
	},
	attachEvents: function(){
		this.node.on('click', this.thumbs, jQuery.proxy(this.switchSlides, this));
	},
	switchSlides: function(e){
		var el  = e.target.nodeName.toLowerCase() == 'li' ? jQuery(e.target) : jQuery(e.target).closest('li');
		var index = this.thumbs.index(el);
		if(!this.wait && this.active != index){
			this.wait = true;
			this.active = index;
			this.el.not(this.el.eq(this.active)).animate({opacity: 0}, {queue:false, duration: this.options.speed, complete: function(){
				jQuery(this).css({display:'none', opacity:0});
			}});
			this.el.eq(this.active).css({display: 'block', opacity: 0}).animate({opacity: 1}, {queue:false, duration: this.options.speed, complete: jQuery.proxy(function(){
				if(typeof this.options.onLoad === 'function') this.options.onLoad(this);
				this.wait = false;
			}, this)});
		}
		e.preventDefault();
	},
	destroy: function(){
		this.node.off('click');
	}
}