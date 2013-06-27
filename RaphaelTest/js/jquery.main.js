// init image map
$(function(){
	$('img.test-map').each(function(){
		new SVGImageMap({
			image: this,
			inverseHover: true,
			onAreaClick: function(data) {
				alert('click - ' + data.id);
			}
		});
	});
});

/*
 * SVGImageMap class
 */
function SVGImageMap(options) {
	this.options = $.extend({
		image: null,
		animSpeed: 300,
		inverseHover: false,
		sourceAttrURL: 'data-map',
		wrapperClass: 'svg-imgmap-wrapper',
		defaultStyle: {
			fill: "url(images/none.gif)",
			stroke: "none"
		},
		hoverStyle: {
			fill: "url(images/bg-overlay.png)",
			stroke: "#00f"
		}
	}, options);
	this.init();
}
SVGImageMap.prototype = {
	init: function() {
		// initialize image
		this.image = $(this.options.image);
		if(this.image.length) {
			this.initStructure();
			this.getImageDimensions(function(origWidth, origHeight){
				// save original dimensions
				this.origWidth = origWidth;
				this.origHeight = origHeight;

				// calculate "donut hole" path
				this.donutHolePath = 'M 0 0 L 0 ' + origHeight + ' L ' + origWidth + ' ' + origHeight + ' L ' + origWidth +' 0 z ';

				// prepare structure and draw areas
				this.loadMapData(function(mapData){
					var self = this;
					this.createMapData(mapData);
					this.attachEvents();
				});
			});
		}
	},
	getImageDimensions: function(callback) {
		// measure natural dimensions of image
		var image = new Image(), self = this;
		image.onload = function(){
			image.onload = null;
			callback.call(self, image.width, image.height);
		};
		image.src = this.image.attr('src');
	},
	initStructure: function() {
		// wrap image, create paper
		this.wrapper = $('<div/>').addClass(this.options.wrapperClass);
		this.wrapper.insertBefore(this.image).append(this.image);
		this.paper = Raphael(this.wrapper.get(0), this.origWidth, this.origHeight);

		// apply styles
		this.wrapper.css({position:'relative'});
		this.image.prependTo(this.wrapper).css({position:'absolute',top:0,left:0});
	},
	loadMapData: function(callback) {
		// load map data from external file
		var self = this;
		$.ajax({
			url: this.image.attr(this.options.sourceAttrURL),
			type: 'get',
			dataType: 'json',
			cache: false,
			success: function(mapData) {
				if(typeof callback === 'function') {
					callback.call(self, mapData);
				}
			}
		});
	},
	createMapData: function(mapData) {
		// create svg region and inversion
		var self = this, noAnimation = 0;
		this.mapData = [];
		$.each(mapData, function(index, area){
			// expand path with spaces (for easy scaling later)
			area.path = area.path.replace(/M/g, 'M ').replace(/,/g, ' ').replace(/L/g, ' L');

			// create default and inverse path
			var defaultPath = self.paper.path(area.path).attr(self.options.defaultStyle);
			var donutPath = self.donutHolePath + area.path;
			var hoverPath = self.paper.path(donutPath).attr(self.options.hoverStyle);

			// handle overlay zIndexes and other styles
			defaultPath.toFront();
			hoverPath.hide().toBack();
			defaultPath[0].style.cursor = 'pointer';

			// save to collection
			var currentItemData = $.extend({
				defaultPath: defaultPath,
				hoverPath: hoverPath,
				donutPath: donutPath
			}, area);
			self.mapData.push(currentItemData);

			// attach hover and click events
			if(self.options.inverseHover) {
				hoverPath.attr({opacity: 0});
				defaultPath.mouseover(function(){
					if(noAnimation) {
						hoverPath.show().stop().attr({opacity: 1});
					} else {
						hoverPath.show().stop().animate({opacity: 1}, self.options.animSpeed);
					}
				}).mouseout(function(){
					if(noAnimation) {
						hoverPath.stop().attr({opacity: 0}).hide();
					} else {
						hoverPath.stop().animate({opacity: 0}, self.options.animSpeed, function(){
							hoverPath.hide();
						});
					}
				});
			} else {
				defaultPath.attr($.extend({opacity:0}, self.options.hoverStyle));
				defaultPath.mouseover(function(){
					if(noAnimation) {
						defaultPath.attr({opacity: 1});
					} else {
						defaultPath.stop().animate({opacity: 1}, self.options.animSpeed);
					}
				}).mouseout(function(){
					if(noAnimation) {
						defaultPath.attr({opacity: 0});
					} else {
						defaultPath.stop().animate({opacity: 0}, self.options.animSpeed);
					}
				});
			}

			// attach click event
			defaultPath.click(function() {
				// callback on click
				if(typeof self.options.onAreaClick) {
					self.options.onAreaClick.call(self, currentItemData);
				}
			});
		});
	},
	handleResize: function() {
		// stretch path
		this.currentScale = this.image.width() / this.origWidth;
		if(this.previousScale !== this.currentScale) {
			this.previousScale = this.currentScale;
			this.setScale(this.currentScale);
		}
	},
	scalePath: function(pathStr, k) {
		// scale path manually (to save quality in IE)
		var pathData = pathStr.split(' ');
		$.each(pathData, function(index, num){
			num = parseFloat(num);
			if(!isNaN(num)) {
				pathData[index] = num*k;
			}
		});
		return pathData.join(' ');
	},
	setScale: function(k) {
		// resize svg document
		var self = this;
		this.paper.setSize(this.origWidth*k, this.origHeight*k);

		// resize elements
		$.each(this.mapData, function(index, item){
			item.defaultPath.attr('path', self.scalePath(item.path, k));
			item.hoverPath.attr('path', self.scalePath(item.donutPath, k));
		});
	},
	attachEvents: function() {
		// handle hover
		var self = this;
		$(window).resize(function(){
			self.handleResize();
		});
		self.handleResize();
	}
};