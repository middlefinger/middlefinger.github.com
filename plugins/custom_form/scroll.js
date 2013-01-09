;(function($) {
	var types = ['DOMMouseScroll', 'mousewheel'];
	if ($.event.fixHooks) {
		for ( var i=types.length; i; ) {
			$.event.fixHooks[ types[--i] ] = $.event.mouseHooks;
		}
	}
	$.event.special.mousewheel = {
		setup: function() {
			if ( this.addEventListener ) {
				for ( var i=types.length; i; ) {
					this.addEventListener( types[--i], handler, false );
				}
			} else {
				this.onmousewheel = handler;
			}
		},
		teardown: function() {
			if ( this.removeEventListener ) {
				for ( var i=types.length; i; ) {
					this.removeEventListener( types[--i], handler, false );
				}
			} else {
				this.onmousewheel = null;
			}
		}
	};
	$.fn.extend({
		mousewheel: function(fn) {
			return fn ? this.bind("mousewheel", fn) : this.trigger("mousewheel");
		},
		unmousewheel: function(fn) {
			return this.unbind("mousewheel", fn);
		}
	});
	function handler(event) {
		var orgEvent = event || window.event, args = [].slice.call( arguments, 1 ), delta = 0, returnValue = true, deltaX = 0, deltaY = 0;
		event = $.event.fix(orgEvent);
		event.type = "mousewheel";
		// Old school scrollwheel delta
		if ( orgEvent.wheelDelta ) { delta = orgEvent.wheelDelta/120; }
		if ( orgEvent.detail     ) { delta = -orgEvent.detail/3; }
		// New school multidimensional scroll (touchpads) deltas
		deltaY = delta;
		// Gecko
		if ( orgEvent.axis !== undefined && orgEvent.axis === orgEvent.HORIZONTAL_AXIS ) {
			deltaY = 0;
			deltaX = -1*delta;
		}
		// Webkit
		if ( orgEvent.wheelDeltaY !== undefined ) { deltaY = orgEvent.wheelDeltaY/120; }
		if ( orgEvent.wheelDeltaX !== undefined ) { deltaX = -1*orgEvent.wheelDeltaX/120; }
		// Add event and delta to the front of the arguments
		args.unshift(event, delta, deltaX, deltaY);
		return ($.event.dispatch || $.event.handle).apply(this, args);
	}
})(jQuery);

Widget = function(name, body){
	function WidgetFunc(options) {
		this.options = jQuery.extend({}, this.options, options);
		this._create();
	}
	WidgetFunc.prototype = {
		_create: function() {},
		destroy: function() {}
	};
	jQuery.extend(WidgetFunc.prototype, body);
	jQuery.fn[name] = function(options) {
		return this.each(function(){
			var item = jQuery(this), instance;
			if(typeof options === 'object' || typeof options === 'undefined') {
				if(typeof item.data(name) !== 'object'){
					instance = new WidgetFunc(jQuery.extend({holder: this}, options));
					item.data(name, instance);
				}
				else{
					item.data(name)._create();
				}
			} else if(typeof options === 'string' && item.data(name)) {
				instance = item.data(name);
				if(options === 'destroy') item.data(name, false);
				instance[options]();
			}
		});
	};
	return WidgetFunc;
};

Widget('customScroll', {
	options: {
		lineWidth: 20
	},
	_create: function() {
		this.defineElements();
	},
	destroy: function() {
		this.detachEvents();
	},
	createStructure: function(){
		this.scrollBar = jQuery('<div class="scroll-bar">'+
									'<div class="scroll-line">'+
										'<div class="scroll-slider"></div>'+
									'</div>'+
								'</div>');
		this.box.wrapInner('<div class="scroll-content"></div>').append(this.scrollBar);
	},
	defineVariables: function(){
		this.box_h = this.box.height();
		this.box_w = this.box.width();
		this.slider_h = 0;
		this.slider_f = 0;
		this.cont_h = this.scrollContent.height();
		this._f = false;
		this._f1 = false;
		this._f2 = true;
	},
	defineElements: function(callback){
		this.box = jQuery(this.options.holder);
		this.line_w = this.options.lineWidth;
		if(this.box.is(':visible')){
			if(this.box.children('.scroll-content').length == 0){
				this.createStructure();
				this.scrollContent = this.box.children('.scroll-content');
				this.scrollSlider = this.scrollBar.find('.scroll-slider');
				this.scrollSliderH = this.scrollSlider.parent();
				this.defineVariables();
				this.setStyles();
				this.attachEvents();
			}
			else{
				this.scrollResize();
			}
		}
	},
	setStyles: function(){
		this.box.css({
			position: 'relative',
			overflow: 'hidden',
			width: this.box_w,
			height: this.box_h
		});
		this.scrollContent.css({
			position: 'absolute',
			top: 0,
			left: 0,
			zIndex: 1,
			width: this.box_w - this.line_w,
			height: 'auto'
		});
		this.scrollBar.css({
			position: 'absolute',
			top: 0,
			left: this.box_w - this.line_w,
			zIndex:2,
			width: this.line_w,
			height: this.box_h,
			overflow: 'hidden'
		});
		this.slider_h = this.scrollBar.height();
		this.scrollSliderH.css({
			position: 'relative',
			width: this.line_w - 4,
			height: this.slider_h - 4,
			overflow: 'hidden'
		});
		this.slider_h = 0;
		this.scrollSlider.css({
			position: 'absolute',
			top: 0,
			left: 0,
			width: this.line_w,
			height: this.slider_h,
			overflow: 'hidden',
			cursor: 'pointer'
		});
		this.box_h = this.box.height();
		this.cont_h = this.scrollContent.height();
		if(this.box_h < this.cont_h){
			this._f = true;
			this.slider_h = Math.round(this.box_h/this.cont_h*this.scrollSliderH.height());
			if(this.slider_h < 5) this.slider_h = 5;
			this.scrollSlider.height(this.slider_h);
			this.slider_h = this.scrollSlider.height();
			this.slider_f = (this.cont_h - this.box_h)/(this.scrollSliderH.height() - this.scrollSlider.height());
			this._s1 = (this.scrollSliderH.height() - this.scrollSlider.height())/20;
			this._s2 = (this.scrollSliderH.height() - this.scrollSlider.height())/3;
		}
		else{
			this._f = false;
			this.scrollBar.hide();
			this.scrollContent.css({width: this.box.width(), top: 0, left:0});
		}
		this.top = 0;
	},
	attachEvents: function(){
		var self = this;
		self.scrollSliderH.bind('click.scroll', function(e){
			if(self._f2){
				if(self.scrollSlider.offset().top + self.slider_h < e.pageY){
					self.top += self._s2;
				}
				else if(self.scrollSlider.offset().top > e.pageY){
					self.top -= _s2;
				}
				self.scrollCont();
			}
			else{
				self._f2 = true;
			}
		});
		self.t_y = 0;
		self.scrollSlider.bind({
			'mousedown.scroll': function() {
				self.t_y = e.pageY - $(this).position().top;
				self._f1 = true;
			},
			'mouseup.scroll': function() {
				self._f1 = false;
			}
		});
		jQuery('body').bind('mousemove.scroll', function(e){
			if(self._f1){
				 self._f2 = false;
				 self._top = e.pageY - self.t_y;
				 self.scrollCont();
			}
		});
		document.body.onselectstart = function(){
			if(self._f1) return false;
		};
		self.box.bind('mousewheel.scroll', function(event, delta){
			if(self._f){
				self.top -= delta*self._s1;
				self.scrollCont();
				if((self.top > 0) && (self.top+self.slider_h < self.scrollSliderH.height())) return false;
			}
		});
	},
	scrollCont: function(){
		if(this.top < 0) this.top = 0;
		else if(this.top+this.slider_h > this.scrollSliderH.height()) this.top = this.scrollSliderH.height() - this.slider_h;
		this.scrollSlider.css('top', this.top);
		this.scrollContent.css('top', -this.top*this.slider_f);
	},
	scrollResize: function(){
		this.box_h = jQuery(this.box).height();
		this.cont_h = jQuery(this.scrollContent).height();
		
		if(this.box_h < this. cont_h){
			this._f = true;
			this.scrollBar.show();
			this.scrollContent.width(this.box_w - this.line_w);
			this.slider_h = Math.round(this.box_h/this.cont_h*this.scrollSliderH.height());
			if(this.slider_h < 5) this.slider_h = 5;
			this.scrollSlider.height(this.slider_h);
			this.slider_h = this.scrollSlider.height();
			this.slider_f = (this.cont_h - this.box_h)/(this.scrollSliderH.height() - this.scrollSlider.height());
			if(this.cont_h + this.scrollContent.position().top < this.box_h) this.scrollContent.css('top', -(this.cont_h - this.box_h));
			this.top = - this.scrollContent.position().top/this.slider_f;
			this.scrollSlider.css('top', this.top);
			this._s1 = (this.scrollSliderH.height() - this.scrollSlider.height())/20;
			this._s2 = (this.scrollSliderH.height() - this.scrollSlider.height())/3;
		}
		else{
			this._f = false;
			jQuery(this.scrollBar).hide();
			jQuery(this.scrollContent).css({width: this.box.width(), top: 0, left:0});
		}
	},
	removeElements: function() {
		var content = this.box.find('.scroll-content').children().clone(true);
		content.find('li').filter(':not(.selected)').remove();
		this.box.attr('style', '').empty().append(content);
	},
	detachEvents: function() {
		jQuery('body').unbind('mousemove.scroll');
		this.box.find('.scroll-line').unbind('click.scroll');
		this.box.find('.scroll-slider').unbind('mousedown.scroll, mouseup.scroll');
		this.box.unbind('mousewheel.scroll');
		this.removeElements();
	}
});