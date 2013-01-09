jQuery(function(){
	initSlideTabs();
});

function initSlideTabs(){
	jQuery('ul.tabset').each(function(){
		var _list = jQuery(this);
		var _links = _list.find('a.tab');
		var tabParent = jQuery('.tab-holder');
		var w = 0;
		var defW = tabParent.width();

		_links.each(function() {
			var _link = jQuery(this);
			var _href = _link.attr('href');
			var _tab = jQuery(_href);
			
			w++;
			
			_tab.css({
				float:'left',
				width: defW
			});
			
			_link.click(function(){
				var index = _links.index(_link);
				tabParent.animate({marginLeft: -defW * index});
				_links.filter('.active').removeClass('active');
				_link.addClass('active');
				return false;
			});
		});
		
		tabParent.width(defW*w)
	});
}