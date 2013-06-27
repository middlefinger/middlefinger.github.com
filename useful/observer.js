var observerable = {
	listeners: {},
	add: function(obj, evt, callback){
		if(!this.listeners.hasOwnProperty(evt)){
			this.listeners[evt] = [];
		}
		this.listeners[evt].push(callback);
	},
	remove: function(obj, evt, callback){
		if(this.listeners.hasOwnProperty(evt)){
			var i, length;
			for(i = 0, length = this.listeners[evt].length; i < length; i++){
				if(this.listeners[evt][i] === obj[callback]){
					this.listeners[evt].splice(i,1);
				}
			}
		}
	},
	trigger: function(evt, args){
		if(this.listeners.hasOwnProperty(evt)){
			var i, length;
			for(i = 0, length = this.listeners[evt].length; i < length; i++){
				this.listeners[evt][i](args);
			}
		}
	}
};