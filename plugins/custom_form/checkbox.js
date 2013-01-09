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

;(function($, window, document, undefined) {
	Widget('customCheckbox', {
		options: {
			checkboxStructure: '<div></div>',
			checkboxDisabled: 'disabled',
			checkboxDefault: 'checkboxArea',
			checkboxChecked: 'checkboxAreaChecked',
			checkboxHidden: 'outtaHere'
		},
		_create: function() {
			this.defineElements();
		},
		destroy: function() {
			this.detachEvents();
		},
		defineElements: function(callback){
			this.checkbox = jQuery(this.options.holder);
			if(!this.checkbox.hasClass(this.options.checkboxHidden) && this.checkbox.is(':checkbox')){
				this.replaced = jQuery(this.options.checkboxStructure);
				this._replaced = this.replaced;
				if(this.checkbox.is(':disabled')) this.replaced.addClass(this.options.checkboxDisabled);
				else if(this.checkbox.is(':checked')) this.replaced.addClass(this.options.checkboxChecked);
				else this.replaced.addClass(this.options.checkboxDefault);
			   
				this.replaced.insertBefore(this.checkbox);
				this.checkbox.addClass(this.options.checkboxHidden);
				this.attachEvents();
			}
		},
		attachEvents: function(){
			this.replaced.click(jQuery.proxy(function() {
				if(this.checkbox.is(':checked')) this.checkbox.removeAttr('checked');
				else this.checkbox.attr('checked', 'checked');
				this.changeState();
			}, this));
			this.checkbox.click(jQuery.proxy(this.changeState, this));
		},
		changeState: function(){
			this.checkbox.change();
			if(this.checkbox.is(':checked')) this._replaced.removeClass().addClass(this.options.checkboxChecked);
			else this._replaced.removeClass().addClass(this.options.checkboxDefault);
		},
		removeElements: function() {
			this.replaced.remove();
		},
		detachEvents: function() {
			this.checkbox.add(this.replaced).unbind('click');
			this.removeElements();
		}
	});
})(jQuery, window, document);