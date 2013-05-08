jQuery(function(){
	initAccordion();
	initTabs();
});

function initTabs(){
	jQuery('#nav ul.main').tabs({
		links:'li a:not(.opener)'
	});
	jQuery('#nav ul.links').tabs({
		links:'li > a',
		tabHolder: '#content .tab-holder'
	});
	jQuery('#tab00').tabs({
		links:'.row .col a',
		tabHolder: '#content .tab-holder'
	});
}

function initAccordion(){
	jQuery('#nav ul.main').accordion({
		elements: 'li',
		opener: 'a.opener',
		slideHolder: '> ul',
		activeClass: 'active',
		openAll: true,
		switchLink: 'a.switch'
	});
}

(function(){
	jQuery.fn.accordion = function(options){
		var settings = jQuery.extend({
			elements: 'li',
			opener: 'a.opener',
			content: '> ul',
			activeClass: 'active',
			switchLink:'a.switch',
			speed: 300
		}, options),
		
		methods = {
			switchFlag: function(){
				wait = false;
			},
			close: function(el, content){
				el.removeClass(settings.activeClass);
				content.slideUp(settings.speed, this.switchFlag);
			},
			open: function(el, content){
				el.addClass(settings.activeClass);
				content.slideDown(settings.speed, this.switchFlag);
			},
			openAll: function(els){
				var self = this;
				
				els.each(function(){
					self.open(jQuery(this), jQuery(this).find(settings.content));
				});
			},
			closeAll: function(els){
				var self = this;
				
				els.each(function(){
					self.close(jQuery(this), jQuery(this).find(settings.content));
				});
			},
			on: function(link){
				link.find('.on').hide();
				link.find('.off').show();
			},
			off: function(link){
				link.find('.on').show();
				link.find('.off').hide();
			}
		},
		
		wait = false;

		return this.each(function(){
			var list = jQuery(this),
				els = list.find(settings.elements).has(settings.content),
				switchLink = list.find(settings.switchLink);

			methods.off(switchLink);
				
			switchLink.click(function(e){
				var openedEls = els.filter('.' + settings.activeClass);
				methods[openedEls.length ? 'closeAll' : 'openAll'](openedEls.length ? openedEls : els);
				methods[els.filter('.' + settings.activeClass).length ? 'on' : 'off'](switchLink);
				e.preventDefault();
			});
			
			els.each(function(){
				var el = jQuery(this),
					opener = el.find(settings.opener).eq(0),
					content = el.find(settings.content);

				if(!el.hasClass(settings.activeClass)) content.hide();
					
				opener.click(function(e){
					if(!wait){
						wait = true;
						methods[el.hasClass(settings.activeClass) ? 'close' : 'open'](el, content);
						methods[els.filter('.' + settings.activeClass).length ? 'on' : 'off'](switchLink);
					}
					
					e.preventDefault();
				});
			});
		});
	}
})();

;(function(win, jQ){
	jQ.fn.tabs = function(options){
		var settings = jQ.extend({
			links: 'a.tab',
			attr: 'href',
			activeClassTab: 'active',
			activeClassLink: 'active',
			tabHolder: '#content .tab-holder'
		}, options);
		
		return this.each(function(){
			var holder = jQ(this),
				links = holder.find(settings.links);
				
			links.each(function(){
				var link = jQ(this),
					tabId = link.attr(settings.attr),
					tab = jQ(tabId);
					
				if(tab.length){
					if(link.hasClass(settings.activeClassLink)){
						tab.addClass(settings.activeClassTab).show();
					}
					else{
						tab.removeClass(settings.activeClassTab).hide();
					}
						
					link.click(function(e){
						jQuery(settings.tabHolder).children('div.tab').removeClass(settings.activeClassTab).hide();
						if(!settings.tabHolder){
							links.not(link).filter('.' + settings.activeClassLink).each(function(){
								jQ(jQ(this).removeClass(settings.activeClassLink).attr(settings.attr)).removeClass(settings.activeClassTab).hide();
							});
						}
						link.addClass(settings.activeClassLink);
						tab.addClass(settings.activeClassTab).show();
						e.preventDefault();
					});
				}
			});
		});
	};
})(window,jQuery);