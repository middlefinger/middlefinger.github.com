jQuery(function(){
	initAccordion();
	initTabs();
});

function initTabs(){
	jQuery('#nav ul.main').tabs({
		links:'li a:not(.opener)'
	});
}

function initAccordion(){
	jQuery('#nav ul').simpleAccordion({
		elements: '> li',
		opener: 'a.opener',
		slideHolder: '> ul',
		activeClass: 'active',
		openAll: true,
		switchLink: 'a.switch'
	});
}

;(function(win, jQ){
	jQ.fn.tabs = function(options){
		var settings = jQ.extend({
			links: 'a.tab',
			attr: 'href',
			activeClassTab: 'active',
			activeClassLink: 'active'
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
						links.not(link).filter('.' + settings.activeClassLink).each(function(){
							jQ(jQ(this).removeClass(settings.activeClassLink).attr(settings.attr)).removeClass(settings.activeClassTab).hide();
						});
						link.addClass(settings.activeClassLink);
						tab.addClass(settings.activeClassTab).show();
						e.preventDefault();
					});
				}
			});
		});
	};
	jQ.fn.simpleAccordion = function(options){
		var settings = jQ.extend({
			elements: '> li',
			opener: 'a.opener',
			slideHolder: '> ul',
			activeClass: 'active',
			openAll: true,
			switchLink:'a.switch',
			speed: 300
		}, options);
		var all = false;
		
		return this.each(function(){
			var holder = jQ(this),
				els = holder.find(settings.elements),
				switchLink = holder.find(settings.switchLink),
				wait = false;
				
			switchLink.find('.off').hide();
				
			
			switchLink.click(function(e){
				all = true;
				if(els.filter('.' + settings.activeClass).length){
					els.filter('.' + settings.activeClass).find(settings.opener).trigger('click');
				}
				else{
					els.find(settings.opener).trigger('click');
				}
				all = false;
				e.preventDefault();
			});
				
			els.each(function(){
				var el = jQ(this),
					opener = el.find(settings.opener).eq(0),
					slideHolder = el.find(settings.slideHolder);
				
				if(!el.hasClass(settings.activeClass)){
					slideHolder.hide();
				}
				
				function toggleFlag(){
					wait = false;
					checkOpenLink();
				}
				function checkOpenLink(){
					if(els.filter('.' + settings.activeClass).length){
						switchLink.find('.on').hide();
						switchLink.find('.off').show();
					}
					else{
						switchLink.find('.on').show();
						switchLink.find('.off').hide();
					}
				}
				
				opener.click(function(e){
					if(!wait){
						wait = all ? false : true;
						if(el.hasClass(settings.activeClass)){
							el.removeClass(settings.activeClass);
							slideHolder.slideUp(settings.speed, toggleFlag);
						}
						else{
							el.addClass(settings.activeClass);
							slideHolder.slideDown(settings.speed, toggleFlag);
						}
					}
					e.preventDefault();
				});
			});
		});
	};
})(window,jQuery);