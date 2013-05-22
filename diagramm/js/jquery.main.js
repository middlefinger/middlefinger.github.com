jQuery(function(){
	initChart();
});

function initChart(){
	var diagramm = jQuery('#diagramm');
	var w = 300;
	var h = 300;
	var paper = Raphael(diagramm[0], w, h, 0, 0);
	var base = [
		{
			date: '01.01.2012',
			qty: 7
		},
		{
			date: '01.01.2012',
			qty: 4
		},
		{
			date: '01.01.2012',
			qty: 8
		},
		{
			date: '01.01.2012',
			qty: 2
		},
		{
			date: '01.01.2012',
			qty: 9
		},
		{
			date: '01.02.2012',
			qty: 5
		},
		{
			date: '01.03.2012',
			qty: 2
		},
		{
			date: '01.04.2012',
			qty: 4
		},
		{
			date: '01.05.2012',
			qty: 1
		}
	];
	var dist = 10;
	var prev = 0;
	var sign = '-';
	
	var line = paper.path('M0,' + h + 'm0,0');
	
	var calcPathDef = ''
	var calcPath = ''
	
	for(var i=0; i < base.length; i++){

		calcPathDef += ('l' + (i*dist) + ',0');
		calcPath += ('l' + (i*dist) + ',' + (base[i].qty > prev ? sign : '') + ''+ (dist*base[i].qty)) + ' ';
	
		prev = base[i].qty;
	}
	
	var p = paper.path('M30,' + h + ' m0,0' + calcPathDef);
	var l = paper.path('M10,' + h + ' L10,' + h + ' M10,' + h + ' L10,' + h);


	l.animate(Raphael.animation({path: 'M10,' + h + ' L10,30 M10,' + h + ' L' + (h-30) + ',' + h}, 750, function(){
		p.animate(Raphael.animation({path: 'M30,' + h + ' m0,0' + calcPath}, 750));
	}));
}