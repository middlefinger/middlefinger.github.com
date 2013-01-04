jQuery(function(){
	jQuery('<div class="popup" />').html('<p>Hello world !</p>').appendTo(jQuery('body')).customDialog({
		title: 'Title',
		close: 'X',
		buttons: {
			'ok': function(){
				alert('ok');
				return false;
			},
			'cancel': function(e){
				this.close();
				return false;
			}
		},
		height: '50%',
		dialogClass: 'content',
		modal: true,
		location: {
			fixed: true,
			position: 'center'
		},
		autoOpen: false
	});
	
	jQuery('.lightbox').customDialog();
	
	jQuery('a.open-popup').click(function(){
		jQuery('.popup').customDialog('open');
		return false;
	});
	jQuery('a.open-lightbox').click(function(){
		jQuery(jQuery(this).attr('href')).customDialog('open');
		return false;
	});
	
	jQuery('<div id="ajax-lightbox" />').appendTo(jQuery('body')).customDialog({
		title: 'Ajax Lightbox',
		close: 'Close',
		buttons: {
			'Send': function(){
				alert('Content sent successfully !');
				this.close();
				return false;
			}
		},
		width: '50%',
		height: '50%',
		modal: true
	});
	
	jQuery('a.load-content').click(function(){
		var target = jQuery(this).attr('href');
		var lightbox = jQuery(jQuery(this).attr('rel'));
		jQuery.ajax({
			url: target,
			dataType: 'html',
			success: function(msg){
				lightbox.html(msg);
				lightbox.customDialog('open');
			},
			error: function(){
				alert('Ajax Error !');
			}
		});
		return false;
	});
	
});

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

Widget('customDialog', {
	options: {
		autoOpen: false,		// true - false
		buttons: false,			// object {'ok': [#, click, function], 'cancel': function(){}}
		closeOnEscape: false,	// true - false
		close: false,			// true -> cross, false -> none, 'string' - text of link
		dialogClass: false,		// string, false
		width: false,			// num || calculate
		height: false,			// num || calculate
		modal: false,			// with overlay
		location: false,		// {fixed: true, position: 'string' || [number]}, fixed, absolute || string -> center, top-center, bottom-center, left-center, right-center, top-left, top-right, bottom-left, bottom-right || [x,y]
		title: false,			// title in head of dialog
		zIndex: 1000,			// zIndex
		speed: 700				// speed of animation
	},
	_create: function() {
		this.defineElements();
	},
	destroy: function() {
		this.detachEvents();
	},
	defineElements: function(){
		this.body = jQuery('body');
		this.window = jQuery(window);
		this.main = jQuery(this.options.holder);
		if(this.main){
			this.createStructure();
			this.defineDimension();
			this.checkStates();
			this.attachEvents();
		}
	},
	createStructure: function(){
		this.button = {};
		this.dialog = jQuery('<div class="custom-dialog"></div>');
		this.content = this.dialog.append(this.main.addClass('customMain'));
		this.createHeader();
		this.createFooter();
		
		this.dialog.appendTo(this.body);
	},
	attachEvents: function(){
		this.window.bind({
			'resize.customDialog': jQuery.proxy(this.refreshPosition, this),
			'load.cutomDialog': jQuery.proxy(function(){
				if(this.options.autoOpen) this.open();
			}, this),
			'keyup.cutomDialog': jQuery.proxy(function(e){
				if(e.keyCode == 27) this.close();
			}, this)
		});
		if(this.options.close) this.button.close.bind('click.customDialog', jQuery.proxy(this.close, this));
		if(this.options.modal) this.overlay.bind('click.customDialog', jQuery.proxy(this.close, this));
	},
	detachEvents: function(){
		this.window.unbind('resize.customDialog, load.cutomDialog, keyup.cutomDialog');
		this.button.unbind();
		if(this.options.modal) this.overlay.unbind();
	},
	createHeader: function(){
		if(this.options.title || this.options.close){
			this.header = jQuery('<div class="header">'+
									(this.options.title ? '<h3 class="title">' + this.options.title + '</h3>' : '')+
									(this.options.close ? '<a href="#" class="btn-close">'+(typeof this.options.close === 'string' ? this.options.close : '')+'</a>' : '')+
								'</div>').prependTo(this.dialog);
			this.button.close = this.header.find('a');
		}
	},
	createFooter: function(){
		if(this.options.buttons){
			this.footer = jQuery('<div class="footer"></div>').appendTo(this.dialog);
			this.createButtons();
		}
	},
	createButtons: function(){
		for(var key in this.options.buttons){
			this.button[key] = jQuery('<a href="#">' + key + '</a>').bind('click', jQuery.proxy(this.options.buttons[key], this)).appendTo(this.footer);
		}
	},
	defineDimension: function(){
		this.winW = this.window.width();
		this.winH = this.window.height();
		this.bodyW = this.body.width();
		this.bodyH = this.body.height();
		this.headerH = this.header ? this.header.outerHeight(true) : 0;
		this.footerH = this.footer ? this.footer.outerHeight(true) : 0;
		this.fixH = this.headerH + this.footerH + parseInt(this.dialog.css('paddingTop')) + parseInt(this.dialog.css('paddingBottom')) + parseInt(this.main.css('paddingTop')) + parseInt(this.main.css('paddingTop'));
		
		this.dialog.css({
			top: -9999,
			left: -9999,
			zIndex: this.options.zIndex,
			display: 'none',
			width: this.options.width ? this.options.width : this.main.width(),
			height: this.options.height ? this.options.height : 'auto'
		});
		
		this.defineStyles();
	},
	checkStates: function(){
		if(this.options.dialogClass) this.main.addClass(this.options.dialogClass);
		if(this.options.modal) this.createOverlay();
	},
	createOverlay: function(){
		if(this.body.find('.custom-overlay').length == 0){
			this.overlay = jQuery('<div class="custom-overlay" />').css({
				display:'none',
				position:'fixed',
				left:0,
				top:0,
				width:'100%',
				height:'100%',
				backgroundColor:'#000000',
				opacity:0.5,
				zIndex: this.options.zIndex - 1
			}).appendTo(this.body);
		}
		else{
			this.overlay = this.body.find('.custom-overlay');
		}
	},
	defineStyles: function(){
		this.w = this.dialog.outerWidth(true);
		this.h = this.dialog.outerHeight(true);
		
		if(!this.options.location){
			this.position = false;
			this.place = 'center';
		}
		else if(typeof this.options.location === 'object'){
			this.position = this.options.location.fixed;
			this.place = this.options.location.position;
		}
		
		this.dialog.css({position: (this.position ? 'fixed' : 'absolute')});
		this.calculatePosition();
	},
	calculatePosition: function(){
		if(jQuery.isArray(this.place)){
			this.t = this.place[0]
			this.l = this.place[1];
		}
		else if(typeof this.place === 'string'){
			switch(this.place){
				case 'center':
					this.l = (this.winW - this.w) / 2;
					this.t = (this.winH - this.h) / 2;
					break;
				case 'top-center':
					this.l = (this.winW - this.w) / 2;
					this.t = 0;
					break;
				case 'bottom-center':
					this.l = (this.winW - this.w) / 2;
					this.t = this.winH - this.h;
					break;
				case 'left-center':
					this.l = 0;
					this.t = (this.winH - this.h) / 2;
					break;
				case 'right-center':
					this.l = this.winW - this.w;
					this.t = (this.winH - this.h) / 2;
					break;
				case 'top-left':
					this.l = 0;
					this.t = 0;
					break;
				case 'top-right':
					this.l = this.winW - this.w;
					this.t = 0;
					break;
				case 'bottom-left':
					this.l = 0;
					this.t = this.winH - this.h;
					break;
				case 'bottom-right':
					this.l = this.winW - this.w;
					this.t = this.winH - this.h;
					break;
				default: 
					this.l = (this.winW - this.w) / 2;
					this.t = (this.winH - this.h) / 2;
					break;
			}
		}
		
		if(this.options.height && this.options.height.indexOf('%') >= 1){
			this.main.css({
				width: 'auto',
				height: this.h - this.fixH
			});
		}
		
		if(!this.calculated) this.hide();
		this.calculated = true;
	},
	refreshPosition: function(){
		this.winW = this.window.width();
		this.winH = this.window.height();
		this.w = this.dialog.outerWidth(true);
		this.h = this.dialog.outerHeight(true);
		
		this.calculatePosition();
		this.dialog.css({
			left: this.l,
			top: this.t
		});
	},
	show: function(){
		this.showing = true;
		this.dialog.css({
			opacity:'',
			display:'block',
			left: this.l,
			top: this.t
		});
		return this.dialog;
	},
	hide: function(){
		this.showing = false;
		this.dialog.css({
			opacity:'',
			display:'none',
			left: -9999,
			top: -9999
		});
		return this.dialog;
	},
	open: function(){
		this.body.find('.custom-dialog').not(this.dialog).each(function(){
			jQuery(this).find('.customMain').customDialog('close');
		});
		if(this.options.modal){
			this.overlay.fadeIn(this.options.speed, jQuery.proxy(function(){
				this.show().css({opacity:0}).animate({opacity:1}, {queue:false, duration:this.options.speed})
			}, this));
		}
		else this.show().css({opacity:0}).animate({opacity:1}, {queue:false, duration:this.options.speed});
	},
	close: function(){
		if(this.showing){
			this.dialog.animate({opacity:0}, {queue:false, duration:this.options.speed, complete: jQuery.proxy(this.hide, this)});
			if(this.options.modal) this.overlay.fadeOut(this.options.speed);
		}
	}
});