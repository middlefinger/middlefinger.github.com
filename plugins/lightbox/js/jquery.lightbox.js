jQuery(function(){
	initLightbox();
});

function initLightbox(){
	jQuery('a.link-popup').simplebox();
}

;(function($) {
	$.fn.simplebox = function(options) { 
		return new Simplebox(this, options); 
	};
	
	function Simplebox(context, options) { this.init(context, options); };
	
	Simplebox.prototype = {
		options:{},
		init: function (context, options){
			this.options = $.extend({
				duration: 300,
				linkClose: 'a.close, a.btn-close',
				divFader: 'fader',
				faderColor: 'black',
				opacity: 0.5,
				wrapper: '#wrapper',
				linkPopup: '.link-submit',
				onCreate: false,
				onShow: false,
				onHide: false
			}, options || {});
			this.btn = $(context);
			this.select = $(this.options.wrapper).find('select');
			this.initFader();
			this.btnEvent(this, this.btn);
			if(typeof this.options.onCreate === 'function') this.options.onCreate(this);
		},
		btnEvent: function($this, el){
			el.click(function(){
				if ($(this).attr('href')) $this.checkContent($(this).attr('href'));
				else $this.checkContent($(this).attr('title'));
				return false;
			});
		},
		calcWinWidth: function(){
			this.winWidth = $('body').width();
			if ($(this.options.wrapper).width() > this.winWidth) this.winWidth = $(this.options.wrapper).width();
		},
		checkContent: function(obj){
			if($(obj).length) {
				this.popup = $(obj);
				this.toPrepare();
			}
			else if($('div[rel="'+obj+'"]').length){
				this.popup = $('div[rel="'+obj+'"]');
				this.toPrepare();
			}
			else{
				var _this = this;
				var holder = $('body');
				$.ajax({
					url:obj,
					type:'get',
					cache:false,
					dataType:'text',
					data:'ajax=1',
					success:function(msg) {
						_this.popup = $(msg).attr('rel', obj).appendTo(holder);
						_this.toPrepare();
					},
					error:function() {
						alert('AJAX Error!');
					}
				});
			}
		},
		toPrepare: function(){
			this.btnClose = this.popup.find(this.options.linkClose);
			this.submitBtn = this.popup.find(this.options.linkPopup);
			
			if ($.browser.msie) this.select.css({visibility: 'hidden'});
			this.calcWinWidth();
			this.bodyHeight = $('body').height();
			this.winHeight = $(window).height();
			this.winScroll = $(window).scrollTop();
			
			this.popupTop = this.winScroll + (this.winHeight/2) - this.popup.outerHeight(true)/2;
			if (this.popupTop < 0) this.popupTop = 0;
			if(this.popupTop + this.popup.outerHeight(true) > this.bodyHeight){
				this.popupTop = this.winScroll + (this.bodyHeight - (this.popupTop + this.popup.outerHeight(true)));
			}
			this.faderHeight = $(this.options.wrapper).outerHeight();
			if ($(window).height() > this.faderHeight) this.faderHeight = $(window).height();
			
			this.popup.css({
				top: this.popupTop,
				left: this.winWidth/2 - this.popup.outerWidth(true)/2
			}).hide();
			this.fader.css({
				width: this.winWidth,
				height: this.faderHeight
			});
			this.initAnimate(this);
			this.initCloseEvent(this, this.btnClose, true);
			this.initCloseEvent(this, this.fader, true);
			this.submitBtn.each(jQuery.proxy(function(i){
				this.initCloseEvent(this, this.submitBtn.eq(i), false);
			}, this));
		},
		initCloseEvent: function($this, el, flag){
			el.click(function(){
				$('body > div.outtaHere').removeClass('optionsDivVisible').addClass('optionsDivInvisible')
				$this.popup.fadeOut($this.options.duration, function(){
					if(typeof $this.options.onHide === 'function') $this.options.onHide($this);
					$this.popup.css({left: '-9999px'}).show();
					if ($.browser.msie) $this.select.css({visibility: 'visible'});
					$this.submitBtn.unbind('click');
					$this.fader.unbind('click');
					$this.btnClose.unbind('click');
					$(window).unbind('resize');
					if (flag) $this.fader.fadeOut($this.options.duration);
					else {
						if (el.attr('href')) $this.checkContent(el.attr('href'));
						else $this.checkContent(el.attr('title'));
					}
				}).removeClass('active');
				return false;
			});
		},
		initAnimate:function ($this){
			$this.fader.fadeIn($this.options.duration, function(){
				$this.popup.fadeIn($this.options.duration).addClass('active');
			});
			if(typeof $this.options.onShow === 'function') $this.options.onShow($this);
			$(window).resize(function(){
				$this.calcWinWidth();
				$this.popup.animate({
					left: $this.winWidth/2 - $this.popup.outerWidth(true)/2
				}, {queue:false, duration: $this.options.duration});
				$this.fader.css({width: $this.winWidth});
			});
		},
		initFader: function(){
			if ($(this.options.divFader).length > 0) this.fader = $(this.options.divFader);
			else{
				this.fader = $('<div class="'+this.options.divFader+'"></div>');
				$('body').append(this.fader);
				this.fader.css({
					position: 'absolute',
					zIndex: 998,
					left:0,
					top:0,
					background: this.options.faderColor,
					opacity: this.options.opacity
				}).hide();
			}
		}
	}
}(jQuery));
