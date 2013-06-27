jQuery(function(){
	initTest();
});

(function() {
	Raphael.fn.triangle = function (cx, cy, R, n) {
		var sqrt3 = a = h = r = centerY = 0;
		sqrt3 = Math.sqrt(3);
		a = sqrt3*R;
		h = (sqrt3/2) * a;
		r = (sqrt3/6) * a;
		centerY = (R*2 - h) / 2;
		
		var path = this.path("M"+(cx+R)+","+(cy+R)+" m0,-"+(R)+" l"+(a/2)+","+(h)+",-"+(a)+" 0z");

		path.property = {
			cx:0,
			cy:centerY
		};

		return path;
	};
})();

function initTest(){
	var wrapper = jQuery('#wrapper');
	var paper = Raphael(wrapper[0], 700, 700, 200, 200);
	
	var tri = [];
	var circles = [];
	var sq = [];
	
	var sqrt3 = Math.sqrt(3);
	var R = 50;
	var a = sqrt3*R;
	var h = (sqrt3/2) * a;
	var r = (sqrt3/6) * a;
	var centerY = (R*2 - h) / 2;
	
	
	var s1 = paper.rect(500, 500, 100, 100).attr({stroke:'black'});
	var c0 = paper.circle(550, 550, 1).attr({stroke:'black'});
	var c1 = paper.circle(550, 550, R).attr({stroke:'green'});
	var c2 = paper.circle(550, 550, r).attr({stroke:'blue'});
	
	// console.log("M550,550 m0,-50 l"+(a/2)+","+(h)+",-"+(a)+" 0z");
	
	
	// var p1 = paper.path("M550,550 m0,-50 l"+(a/2)+","+(h)+",-"+(a)+" 0z").attr({stroke: "black"});
	
	// var t = paper.triangle(400, 400, 150).attr({stroke: "black"});
	var t = paper.triangle(500, 500, 50).attr({stroke: "black"});
	
	for(var i = 0; i < 20; i++){
		tri[i] = paper.triangle((300 - (i*10)), (300 - (i*10)), (10 + (i*10)));
		tri[i].attr({
			'opacity':1-(i/15),
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
		
		// p1.attr({transform: 'T0,'+centerY+'r'+rot+'t0,-'+centerY})

		t.attr({transform: 'T0,'+t.property.cy+'r'+rot+'t0,-'+t.property.cy})
		
		for(var i = 0; i < 20; i++){
			tri[i].attr({transform: 'T0,'+tri[i].property.cy+'r'+(rot / (i+9))+'t0,-'+tri[i].property.cy});
		}
		
        mouse = e.pageX;
    };
}