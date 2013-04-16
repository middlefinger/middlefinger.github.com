jQuery(function(){
	initTest();
});

(function() {
	Raphael.fn.triangle = function (cx, cy, r) {
	r *= 1.75;
	return this.path("M".concat(cx, ",", cy, "m0-", r * .58, "l", r * .5, ",", r * .87, "-", r, ",0z"));
};
})();

function initTest(){
	var wrapper = jQuery('#wrapper');
	var paper = Raphael(wrapper[0], 500, 500, 200, 200);
	
	var tri = [];
	
	for(var i = 0; i < 10; i++){
		tri[i] = paper.triangle(300,300,50+(i*10));
		tri[i].attr({
			'opacity':1-(i/10),
			'stroke': "#000000"
		});
	}
	
	var mouse = null, rot = 0;
	
    document.onmousemove = function (e) {
        e = e || window.event;
        if (mouse == null) {
            mouse = e.clientX;
            return;
        }
        rot += e.clientX - mouse;
		
		for(var i = 0; i < 10; i++){
			tri[i].attr({transform: "r" + rot/(i+9) + 't-0,-10'});
		}
		
        mouse = e.pageX;
    };
}