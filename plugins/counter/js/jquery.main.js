// page init
jQuery(function(){
	countDown('countdown',{
		selector: 'div',
		daysClassName: 'days',
		hoursClassName: 'hours',
		minutesClassName: 'mins',
		secondsClassName: 'sec',
		startTimerClassName: 'start-count'
	})
});

function countDown(context, options){
	if (!(this instanceof countDown)) return new countDown(context, options);
	this.init(context, options)
}

countDown.prototype = {
	settings:{
		selector: 'div',
		daysClassName: 'day',
		hoursClassName: 'hour',
		minutesClassName: 'min',
		secondsClassName: 'sec',
		startTimerClassName: 'start'
	},
	init: function(context, options){
		for ( var i in options ) {
			if (Object.prototype.hasOwnProperty.call(options, i)) {
				this.settings[i] = options[i]; 
			}
		}
		this.holder = document.getElementById(context);
		if(!this.holder) return;
		else this.setup();
	},
	setup: function(){
		for(var i = 0; i < this.holder.getElementsByTagName(this.settings.selector).length; i++){
			if(this.hasClass(this.holder.getElementsByTagName(this.settings.selector)[i], this.settings.daysClassName)){
				this.dayHolder = this.holder.getElementsByTagName(this.settings.selector)[i];
			}
			if(this.hasClass(this.holder.getElementsByTagName(this.settings.selector)[i], this.settings.hoursClassName)){
				this.hourHolder = this.holder.getElementsByTagName(this.settings.selector)[i];
			}
			if(this.hasClass(this.holder.getElementsByTagName(this.settings.selector)[i], this.settings.minutesClassName)){
				this.minHolder = this.holder.getElementsByTagName(this.settings.selector)[i];
			}
			if(this.hasClass(this.holder.getElementsByTagName(this.settings.selector)[i], this.settings.secondsClassName)){
				this.secHolder = this.holder.getElementsByTagName(this.settings.selector)[i];
			}
		}
		for(var i = 0; i < this.holder.getElementsByTagName('input').length; i++){
			if(this.hasClass(this.holder.getElementsByTagName('input')[i], this.settings.startTimerClassName)){
				this.startTimer = this.holder.getElementsByTagName('input')[i];
			}
		}
		this.startTime = parseInt(this.startTimer.value);
		this.day = 0, this.hour = 0, this.min = 0, this.sec = 0;
		if(this.dayHolder && this.hourHolder && this.minHolder && this.secHolder) this.startCountDown();
	},
	startCountDown: function(){
		this.timer = setInterval(this.bindScope(function(){
			this.calculate(this.startTime);
			this.startTime--;
			if(this.startTime < 0) clearInterval(this.timer);
			this.showCounter(this.day, this.hour, this.min, this.sec);
		}, this), 1000);
	},
	calculate: function(time){
		var temp = time/3600;
		
		this.day = Math.floor(temp/24);
		this.hour = Math.floor(temp) - this.day*24;
		this.min = Math.floor(temp*60) - (this.day*24 + this.hour)*60;
		this.sec = time - (this.day*24*60 + this.hour*60 + this.min)*60;
		
		return 	this.day = this.day < 10 ? '0'+this.day : ''+this.day, 
				this.hour = this.hour < 10 ? '0'+this.hour : ''+this.hour, 
				this.min = this.min < 10 ? '0'+this.min : ''+this.min, 
				this.sec = this.sec < 10 ? '0'+this.sec : ''+this.sec;
	},
	showCounter: function(day, hours, min, sec){
		for(var i=0; i < arguments.length; i++){
			var arr = arguments[i].split('');
			for(var y=0; y < arr.length; y++){
				if(i==0) 		this.dayHolder.getElementsByTagName('span')[y].innerHTML = arr[y]
				else if(i==1) 	this.hourHolder.getElementsByTagName('span')[y].innerHTML = arr[y]
				else if(i==2)	this.minHolder.getElementsByTagName('span')[y].innerHTML = arr[y]
				else			this.secHolder.getElementsByTagName('span')[y].innerHTML = arr[y]
			}
		}
	},
	changeText: function(el, txt){
		return el.innerHTML = txt;
	},
	bindScope: function(f, scope) {
		return function() {return f.apply(scope, arguments)}
	},
	hasClass: function(el,cls) {
		return el.className ? el.className.match(new RegExp('(\\s|^)'+cls+'(\\s|$)')) : false;
	}
}