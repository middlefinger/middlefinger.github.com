jQuery(function(){
	jQuery('.gallery').scrollGallery();
});

;(function($){
	function scrollGallery(options){
		this.options = $.extend({
			gallery: '.holder',				// холдер для галереи
			control: '.control',			// холдер для контролов (скролл, пагинация)
			list: '.g1 > ul',				// список галереи
			prev: 'a.prev',					// кнопка previous
			next: 'a.next',					// кнопка next
			pagination: '.pagination',		// холдер для пагинации (внутри должен быть список ul > li > a)
			autoRotate: false,				// флаг авторотации
			infinity: false,				// флаг для циклического переключения слайдов
			delay: 7000,					// задержка авторотации
			speed: 700,						// скорость анимации
			activeClass: 'active',			// класс для активного слайда и активной пагинации
			disableClass: 'disabled',		// класс дизейбл для кнопок прев и некст
			addScroll: '.scroll'			// холдер для скролла
		}, options);
		this.init();
	}
	
	function scrollBar(options){
		this.options = $.extend({
			bar: '.bar',
			overlayClass: 'overlay',
			speed: 350,
			steps: 4
		}, options);
		this.init();
	}
	
	scrollGallery.prototype = {
		init: function(){
			if(this.options.el) {
				this.defineElements();
			}
		},
		defineElements: function(){
			this.gallery = $(this.options.el);
			this.holder = this.gallery.find(this.options.gallery);
			this.control = this.gallery.find(this.options.control);
			this.list = this.gallery.find(this.options.list);
			this.el = this.list.children();
			this.prev = this.gallery.find(this.options.prev).attr('rel', 'prev');
			this.next = this.gallery.find(this.options.next).attr('rel', 'next');
			if(this.options.pagination){
				this.pagination = this.gallery.find(this.options.pagination);
				this.paginationLinks = this.pagination.find('ul > li > a');
			}
			this.defineVariables();
			this.createEvents();
			this.prepareSlides();
			this.calculateCurrent(this.current);
			if(typeof this.options.onInit === 'function') this.options.onInit(this);
			
			if(this.options.addScroll){
				this.control.find(this.options.addScroll).scrollBar({
					steps: this.count + 1,
					onChange: $.proxy(function(obj){
						this.calculateCurrent(obj.step);
					}, this)
				});
				this.scroll = this.control.find(this.options.addScroll).data('scrollBar');
			}
		},
		defineVariables: function(){
			this.current = 0;
			this.previous = this.current;
			this.count = this.el.length - 1;
			this.wait = false;
			this.w = this.list.parent().width();
			this.fullW = 0;
			this.el.each($.proxy(function(i){
				this.fullW += this.el.eq(i).outerWidth(true);
			}, this));
			this.ratio = this.w / this.fullW;
		},
		createEvents: function(){
			this.prev.add(this.next).bind('click', $.proxy(function(e){
				this.calculateCurrent(e);
				e.preventDefault();
			}, this));
			if(this.options.pagination){
				this.paginationLinks.bind('click', $.proxy(function(e){
					this.calculateCurrent(this.paginationLinks.index(jQuery(e.target)));
					e.preventDefault();
				}, this));
			}
		},
		prepareSlides: function(){
			this.el.css({
				left: this.w,
				display: 'none'
			}).eq(this.current).css({
				left: 0,
				display: 'block'
			});
			this.toggleClasses();
			if(this.options.autoRotate) this.autoRotation();
		},
		toggleClasses: function(){
			this.el.removeClass(this.options.activeClass).eq(this.current).addClass(this.options.activeClass);
			if(this.options.pagination){
				this.paginationLinks.parent().removeClass(this.options.activeClass).eq(this.current).addClass(this.options.activeClass);
			}
		},
		calculateCurrent: function(obj, callback){
			if(!this.wait){
				this.wait = true;
				this.previous = this.current;
				
				if(typeof obj === 'object') this.route(obj.currentTarget.rel);
				else if(typeof obj === 'string') this.route(obj);
				else {
					this.current = obj;
					this.direction = this.current > this.previous ? 1 : -1;
				}
				
				this.checkInfinity();
				
				if(this.previous !== this.current) this.changeSlide(callback);
				else this.wait = false;
			}
		},
		route: function(method){
			if(method === 'prev') this.decrement();
			else if(method === 'next') this.increment();
		},
		decrement: function(){
			this.current--;
			this.direction = -1;
		},
		increment: function(){
			this.current++;
			this.direction = 1;
		},
		checkDisabled: function(){
			if(this.current <= 0){
				this.next.removeClass(this.options.disableClass);
				this.prev.addClass(this.options.disableClass);
			}
			else if(this.current >= this.count){
				this.prev.removeClass(this.options.disableClass);
				this.next.addClass(this.options.disableClass);
			}
			else{
				this.next.add(this.prev).removeClass(this.options.disableClass);
			}
		},
		checkInfinity: function(){
			if(this.options.infinity){
				if(this.current < 0) this.current = this.count;
				else if(this.current > this.count) this.current = 0;
			}
			else{
				if(this.current <= 0) this.current = 0;
				else if(this.current >= this.count) this.current = this.count;
				this.checkDisabled();
			}
		},
		changeSlide: function(){
			if(this.timer) clearTimeout(this.timer);
			this.el.eq(this.previous).animate({left: -this.direction * this.w}, {queue:false, duration: this.options.speed, complete: function(){
				jQuery(this).css({display:'none'});
			}});
			this.el.eq(this.current).css({
				left: this.direction * this.w,
				display: 'block'
			}).animate({left: 0}, {queue:false, duration: this.options.speed, complete: $.proxy(function(){
				this.wait = false;
				if(typeof this.options.onChange === 'function') this.options.onChange(this);
				if(this.options.autoRotate) this.autoRotation();
			}, this)});
			
			this.toggleClasses();
			if(this.scroll && !this.scroll.clickOnScroll) this.scroll.changePosition(this.current);
		},
		autoRotation: function(){
			if(this.options.autoRotate){
				if(this.timer) clearTimeout(this.timer);
				this.timer = setTimeout($.proxy(function(){
					this.calculateCurrent('next');
				}, this), this.options.delay);
			}
		}
	}

	scrollBar.prototype = {
		init: function(){
			if(this.options.el) {
				this.defineElements();
			}
		},
		defineElements: function(){
			this.body = $('body');
			this.holder = $(this.options.el);
			this.bar = this.holder.find(this.options.bar);
			this.overlay = $('<div class="'+this.options.overlayClass+'" />').appendTo(this.holder);
			this.defineVariables();
		},
		defineVariables: function(){
			this.scrollL = this.holder.offset().left;
			this.scrollW = this.holder.width();
			this.ratio = this.options.steps ? 1/this.options.steps : this.options.width/this.scrollW;
			this.barW = this.scrollW * this.ratio;
			this.step = 0;
			this.ratioScroll = this.scrollW/(this.options.steps || this.scrollW);
			this.clickOnScroll = false;
			this.prepareScroll();
			this.createEvents();
		},
		prepareScroll: function(){
			this.bar.css({
				width: this.barW,
				left: this.step * this.barW
			});
			this.overlay.css({
				position: 'absolute',
				left:0,
				top:0,
				width: this.holder.width(),
				height: this.holder.height(),
				backgroundColor: '#000000',
				opacity:0.1,
				zIndex:10
			});
			this.changePosition(this.step);
		},
		createEvents: function(){
			this.overlay.bind('mousedown', $.proxy(function(e){
				this.clickOnScroll = true;
				this.setPosition(e);
				this.attachEvents();
			}, this));
		},
		attachEvents: function(){
			this.body.bind({
				'mousemove.scroll': $.proxy(function(e){
					this.setPosition(e);
				}, this),
				'mouseup.scroll': $.proxy(function(){
					this.detachEvents();
				}, this)
			}).disableSelection();
		},
		detachEvents: function(){
			this.body.unbind('mousemove.scroll mouseup.scroll').enableSelection();
			if(this.options.steps) this.toPosition();
		},
		setPosition: function(e){
			this.baseL = (e.pageX - this.scrollL) - this.barW/2;
			if(this.baseL <= 0) this.baseL = 0;
			else if(this.baseL + this.barW >= this.scrollW) this.baseL = this.scrollW - this.barW;
			this.bar.css({left: this.baseL});
		},
		toPosition: function(){
			this.substrScroll = this.baseL % this.ratioScroll;
			
			if(this.substrScroll != 0){
				this.baseL = this.substrScroll > this.ratioScroll/2 ? this.baseL + (this.ratioScroll - this.substrScroll) : this.baseL - this.substrScroll;
				this.bar.animate({left: this.baseL}, {queue:false, duration: this.options.speed});
			}
			this.clickOnScroll = false;
			this.pers = Math.ceil((this.baseL * 100)/(this.scrollW - this.barW));
			this.step = this.baseL <= 0 || !this.baseL ? 0 : Math.floor(this.options.steps * (this.pers/100));
			// this.step = this.baseL <= 0 || !this.baseL ? 0 : this.options.steps - Math.ceil((this.scrollW - this.barW) / this.baseL);
			if(typeof this.options.onChange === 'function') this.options.onChange(this);
		},
		changePosition: function(n){
			this.bar.animate({left: n * (this.scrollW * this.ratio)}, {queue:false, duration:this.options.speed});
		}
	}
	
	$.fn.extend({
		scrollGallery: function(opt){
			this.each(function(){
				$(this).data('scrollGallery', new scrollGallery($.extend(opt,{el:this})));
			});
		},
		scrollBar: function(opt){
			this.each(function(){
				$(this).data('scrollBar', new scrollBar($.extend(opt,{el:this})));
			});
		},
		disableSelection : function() { 
			this.onselectstart = function() { return false; }; 
			this.unselectable = "on"; 
			$(this).css({
				'-moz-user-select': 'none',
				'-khtml-user-select': 'none',
				'-webkit-user-select': 'none',
				'-o-user-select': 'none',
				'user-select': 'none'
			});
		},
		enableSelection : function() { 
			this.onselectstart = function() {}; 
			this.unselectable = "off";
			$(this).css({
				'-moz-user-select': 'auto',
				'-khtml-user-select': 'auto',
				'-webkit-user-select': 'auto',
				'-o-user-select': 'auto',
				'user-select': 'auto'
			});
		} 
	});
}(jQuery));