;(function ($, window, document, undefined) {
	var pluginName = 'autocompleteSendTo',
	defaults = {
		input: 'value',
		drop: '.drop',
		holder: 'ul',
		wrapEl: 'li',
		target: false,
		startCount: 1,
		selectedClass: 'selected',
		buttonSend: 'input:submit',
		onstart: false,
		onerror: false,
		onupdate: false,
		onselect: false,
		onshow: false,
		onhide: false
	};

	function Plugin(element, options) {
		this.element = jQuery(element);
		this.options = $.extend( {}, defaults, options) ;
		this._defaults = defaults;
		this._name = pluginName;
		this.init();
	}

	Plugin.prototype = {
		init: function() {
			this.defineElements();
			this.addEvents();
			if(typeof this.options.onstart === 'function') this.options.onstart(self);
		},
		refresh: function() {
			this.input = this.element.find(this.options.input);
			this.drop = this.element.find(this.options.drop).empty();
			this.buttonSend = this.element.find(this.options.buttonSend);
			this.list = jQuery('<' + this.options.holder + '/>').prependTo(this.drop);
			this.drop.parent().hide();
			this.buttonSend.hide();
			this.selectedItems = null;
		},
		defineElements: function() {
			this.input = this.element.find(this.options.input);
			this.drop = this.element.find(this.options.drop);
			this.buttonSend = this.element.find(this.options.buttonSend);
			this.list = this.drop.find(this.options.holder).length ? this.drop.find(this.options.holder) : jQuery('<' + this.options.holder + '/>').prependTo(this.drop);
			this.drop.parent().hide();
			if(this.drop.find('.' + this.options.selectedClass).length == 0) this.buttonSend.hide();
		},
		defineTarget: function(param1, param2){
			if(typeof this.options.target === 'function'){
				return this.options.target(this, param1, param2);
			}
		},
		addEvents: function() {
			var self = this;
			self.input.bind({
				'keyup': jQuery.proxy(self.loadData, self)
			});
			self.drop.on('click', 'ul > li', function() {
				jQuery(this).toggleClass(self.options.selectedClass);
				self.selectedItems = self.list.children().filter('.' + self.options.selectedClass);
				if(self.selectedItems.length > 0){
					self.buttonSend.show();
				}
				else{
					self.buttonSend.hide();
				}
				if(typeof self.options.onselect === 'function') self.options.onselect(self);
			});
		},
		loadData: function() {
			var self = this;
			
			if(this.input.val().length >= this.options.startCount){
				this.list.children().filter(':not(.'+this.options.selectedClass+')').remove();
				
				this.drop.parent().show();
				
				if(this.acXHR && this.acXHR && typeof this.acXHR.abort === 'function') {
					this.acXHR.abort(); 
				}
				this.acXHR = jQuery.ajax({
					url: self.defineTarget(self.input.val(), self.drop.parent().data('id')),
					dataType: 'json',
					success: function(msg) {
						jQuery.proxy(self.renderingEl(msg), self);
					},
					error: function() {
						// ajax error handling
						if(typeof self.options.onerror === 'function') {
							self.options.onerror.apply(this,arguments);
						}
					}
				});
			}
			else{
				this.drop.parent().hide();
				if(typeof this.options.onhide === 'function') this.options.onhide(self);
				this.defineElements();
			}
		},
		renderingEl: function(msg) {
			for(var i = msg.length-1; i >= 0; i--){
				if(
					msg[i].firstName.toLowerCase().indexOf(this.input.val().toLowerCase()) !=-1 || 
					msg[i].lastName.toLowerCase().indexOf(this.input.val().toLowerCase()) !=-1
				){
					if(jQuery(this.selectedItems).filter(':contains('+ msg[i].firstName + ' ' + msg[i].lastName +')').length <= 0){
						jQuery('<li data-id="' + msg[i].id + '"><span>' + msg[i].firstName + ' ' + msg[i].lastName + '</span></li>').prependTo(this.list);
					}
				}
			}
			if(typeof this.options.onshow === 'function') this.options.onshow(this);
		}
	};
	$.fn[pluginName] = function ( options ) {
		return this.each(function () {
			if (!$.data(this, 'plugin_' + pluginName)) {
				$.data(this, 'plugin_' + pluginName,
				new Plugin( this, options ));
			}
		});
	};
})(jQuery, window, document);