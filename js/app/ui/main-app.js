app.ui.mainApp = Backbone.View.extend({
	initialize: function(){
		_.bindAll(this, "render");
		this.body = jQuery('body');
		this.w = this.body.width();
		
		jQuery(window).bind('resize', jQuery.proxy(this.setLeft, this));

		app.collections.mainPages.fetch({success: this.render, error: function(){console.log(arguments);}});
	},
	render: function(){
		var that = this;
		_.each(app.collections.mainPages.models, function(item, count){
			that.renderEl(item, count);
		}, this);
		
		return this;
	},
	renderEl: function(item, count){
		item.set('count', count);
		
		var view = new app.ui.page({model: item});
		this.$el.append(view.render().el);
		
		view.render().$el.css({
			left: (count > 0 ? this.w : 0)
		});
		this.$el.css({height:view.render().$el.height()});
	},
	setLeft: function(){
		this.w = this.body.width();
		app.routers.mainWorkspace.pagesHolder.children('.active').css({left:0});
		app.routers.mainWorkspace.pagesHolder.children('.page').not('.active').css({left: this.w});
	},
	loadContent: function(obj){
		console.log(obj);
		var that = this;
		if(!jQuery(obj).hasClass('loaded')){
			that.$el.addClass('loading');
			jQuery.ajax({
				url: jQuery(obj).data('target'),
				dataType: 'text',
				success: function(msg){
					setTimeout(function(){
						that.$el.removeClass('loading');
						jQuery(obj).show();
					}, 500);
					jQuery(obj).html(msg).hide().addClass('loaded');
					that.$el.animate({height:jQuery(obj).height()}, {queue:false, duration:500});
				},
				error: function(){
					alert('Ajax error !');
				}
			});
		}
		else{
			that.$el.animate({height:jQuery(obj).height()}, {queue:false, duration:500});
		}
	},
	openPage: function(id){
		console.log('open page', id);
		console.log(window.app.core.active, id);
		var that = this;
		if(window.app.core.active != id){
			console.log('open page - done');
			window.app.core.previous = window.app.core.active;
			window.app.core.active = id;
			
			if(window.app.core.active != window.app.core.previous){
				if(window.app.core.active > window.app.core.previous){
					app.routers.mainWorkspace.pagesHolder.children('.page')
						.eq(window.app.core.previous)
						.removeClass('active')
						.animate({left:-this.w}, {queue:false, duration:500});
					app.routers.mainWorkspace.pagesHolder.children('.page')
						.eq(window.app.core.active)
						.addClass('active')
						.css({left: this.w})
						.animate({left:0}, {queue:false, duration:500, complete: function(){
							that.loadContent(this);
						}});
				}
				else{
					app.routers.mainWorkspace.pagesHolder.children('.page')
						.eq(window.app.core.previous)
						.removeClass('active')
						.animate({left:this.w}, {queue:false, duration:500});
					app.routers.mainWorkspace.pagesHolder.children('.page')
						.eq(window.app.core.active)
						.addClass('active')
						.css({left: -this.w})
						.animate({left:0}, {queue:false, duration:500, complete: function(){
							that.loadContent(this);
						}});
				}
			}
		}
	}
});