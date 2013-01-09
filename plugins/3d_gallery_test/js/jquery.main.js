jQuery(function(){
	initGallery();
});

function initGallery(){
	var activeClass = 'active';
	var speed = 1000;
	var autoRotation = false;
	
	jQuery('.gallery').each(function(){
		// default settings
		var gallery = jQuery(this);
		var listHolder = gallery.find('.holder');
		var list = listHolder.find('> ul');
		var li = list.children();
		var count = li.length;
		var switcher = gallery.find('.switcher > ul > li');
		var prev = gallery.find('a.prev');
		var next = gallery.find('a.next');
		var active = 0;
		var prevAc = active;
		
		var listHolderW = listHolder.width();
		var listHolderH = listHolder.height();
		var liWidth = li.width();
		var liHeight = li.height();
		
		var start = Math.PI/2;
		var step = 2*Math.PI/count;
		var angle, x, y, width, height;
		var radius = 200;
		var tilt = -1;
		var distance = 0.7;
		
		var wait = false;
		var switchAc = 0;
		
		li.css({ position: 'absolute', top: 0, left: 0, zIndex: 1});
		
		rotate(true);
		
		next.click(function(){
			prevAc = active;
			active++;
			rotate();
			return false;
		});
		prev.click(function(){
			prevAc = active;
			active--;
			rotate();
			return false;
		});
		switcher.click(function(){
			prevAc = active;
			active = switcher.index(jQuery(this));
			switchAc = active;

			if(prevAc > switchAc && prevAc - switchAc > 1){
				speed = 200;
				active = prevAc-1;
				rotate(false, prevAc - switchAc, -1);
			}
			else if(prevAc < switchAc && switchAc - prevAc > 1){
				speed = 200;
				active = prevAc+1;
				rotate(false, switchAc - prevAc, 1);
			}
			else{
				prevAc = active;
				active = switcher.index(jQuery(this));
				rotate();
			}
			
			return false;
		});
		
		li.click(function(){
			prevAc = active;
			active = li.index(jQuery(this));
			rotate();
			return false;
		});
		
		// x = Math.min(0, radius * Math.cos(angle)); //this makes a half carousel
		function rotate(flag, qty, direction){
			if(Math.abs(active) > count - 1) active = 0;
			li.each(function(i){
				angle = start + (i - active ) * step;
				x = radius * Math.cos(angle);
				y = tilt * Math.sin(angle);
				
				width = Math.max(liWidth - (distance * liWidth), liWidth * ((tilt + y) / (2 * tilt)));
				height = parseInt(width * liHeight /liWidth, 10);
				
				if(flag){
					li.eq(i).css({
						top: listHolderH/6 + y - height/15,
						left: listHolderW/2 - x - width/2,
						width: width,
						height: height,
						zIndex: parseInt(100 * (tilt + y) / (2 * tilt),10),
						opacity: parseInt(100 * (tilt + y) / (2 * tilt),10)/100
					});
				}
				else{
					li.eq(i).animate({
						top: listHolderH/2 + y - height/15,
						left: listHolderW/2 - x - width/2,
						width: width,
						height: height,
						zIndex: parseInt(100 * (tilt + y) / (2 * tilt),10),
						opacity: parseInt(100 * (tilt + y) / (2 * tilt),10)/100
					}, {queue: false, easing: 'linear', duration: speed, complete: function(){
						if(i == li.length-1){
							if(qty && qty > 1){
								if(direction < 0){
									active--;
									rotate(false, --qty, -1);
								}
								else{
									active++;
									rotate(false, --qty, 1);
								}
							}
							else if(qty && qty == 1){
								speed = 1000;
							}
						}
					}});
				}
			});
		}
	});
}