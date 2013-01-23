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
		},
		onComplete:function(){
			jQuery('#colorbox').data({
				'size': jQuery('#colorbox .description .size'),
				'price': jQuery('#colorbox .description .price dd'),
				'title': jQuery('#cboxTitle').text()
			}).find('a.order').attr('href', '#order').colorbox({
				inline: true, 
				onComplete: function(){
					jQuery('#colorbox .img-holder').empty().append(jQuery('#colorbox').data('image'));
					jQuery('#colorbox .description .title').text(jQuery('#colorbox').data('title'));
					jQuery('#colorbox .description .size').text(jQuery('#colorbox').data('size').text());
					jQuery('#colorbox .description .price dd').text(jQuery('#colorbox').data('price').text());
				}
			});
			
			jQuery('#colorbox').data('gallery', new fadeGallery('#colorbox .gallery-holder', {
				list: '.g1 > ul',
				thumbs: '.thumbs > ul > li',
				thumasdbs: '.thumbs > ul > li',
				onLoad: function(that){
					jQuery('#colorbox').data('image', that.el.eq(that.active).find('img').clone());
					if(jQuery('#colorbox').data('size').length){
						jQuery('#colorbox').data('size').text(that.el.eq(that.active).find('img').data('size'));
					}
					if(jQuery('#colorbox').data('price').length){
						jQuery('#colorbox').data('price').text(that.el.eq(that.active).find('img').data('price'));
					}
				}
			}));
		},
		onClosed:function(){
			jQuery('#colorbox').off('click', ['a.prev-work', 'a.next-work', 'a.return'], handlerColorBox);
			jQuery('#colorbox').data('gallery').destroy();
			jQuery('#colorbox').data('gallery', null);
		}
	});
	
	function handlerColorBox(e){
		if(e.target.className === 'prev-work') cBox.colorbox.prev();
		else if(e.target.className === 'next-work') cBox.colorbox.next();
		else if(e.target.className === 'return')cBox.colorbox.close();
		e.preventDefault();
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