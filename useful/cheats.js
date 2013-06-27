Function.prototype.bind = function(scope){
	var _function = this;
	return function() {
		return _function.apply(scope, arguments);
	}
}

/MSIE 6/.test(navigator.userAgent)

bind: function(fn, scope, args){
	var newScope = scope || this;
	return function() {
		return fn.apply(newScope, args || arguments);
	}
}

proxy: function(fn, context){
	return function(){return fn.apply(context, arguments)}
}

var indices = [];
for (i = 0; i < elementsCount; i++) {
	indices[indices.length] = i;
}
indices = indices.sort(getRandomOrd);
function getRandomOrd() {
	return(Math.round(Math.random()) - 0.5); 
}

setCookie('zzz', '123', 30, '/');

e.pageX
var xxx = (e.originalEvent.changedTouches ? e.originalEvent.changedTouches[0] : e).pageX

var self = this
self.onResize = $.proxy(self.onResize, this);
win.resize(self.onResize);
win.unbind('resize',self.onResize);

a = (new Function('return '+ '{left:-30, top:-30}')())

/*
 * Utility module
 */
lib = {
	hasClass: function(el,cls) {
		return el && el.className ? el.className.match(new RegExp('(\\s|^)'+cls+'(\\s|$)')) : false;
	},
	addClass: function(el,cls) {
		if (el && !this.hasClass(el,cls)) el.className += " "+cls;
	},
	removeClass: function(el,cls) {
		if (el && this.hasClass(el,cls)) {el.className=el.className.replace(new RegExp('(\\s|^)'+cls+'(\\s|$)'),' ');}
	},
	extend: function(obj) {
		for(var i = 1; i < arguments.length; i++) {
			for(var p in arguments[i]) {
				if(arguments[i].hasOwnProperty(p)) {
					obj[p] = arguments[i][p];
				}
			}
		}
		return obj;
	},
	each: function(obj, callback) {
		var property, len;
		if(typeof obj.length === 'number') {
			for(property = 0, len = obj.length; property < len; property++) {
				if(callback.call(obj[property], property, obj[property]) === false) {
					break;
				}
			}
		} else {
			for(property in obj) {
				if(obj.hasOwnProperty(property)) {
					if(callback.call(obj[property], property, obj[property]) === false) {
						break;
					}
				}
			}
		}
	},
	event: (function() {
		var fixEvent = function(e) {
			e = e || window.event;
			if(e.isFixed) return e; else e.isFixed = true;
			if(!e.target) e.target = e.srcElement;
			e.preventDefault = e.preventDefault || function() {this.returnValue = false;};
			e.stopPropagation = e.stopPropagaton || function() {this.cancelBubble = true;};
			return e;
		};
		return {
			add: function(elem, event, handler) {
				if(!elem.events) {
					elem.events = {};
					elem.handle = function(e) {
						var ret, handlers = elem.events[e.type];
						e = fixEvent(e);
						for(var i = 0, len = handlers.length; i < len; i++) {
							ret = handlers[i].call(elem, e);
							if(ret === false) {
								e.preventDefault();
								e.stopPropagaton();
							}
						}
					};
				}
				if(!elem.events[event]) {
					elem.events[event] = [];
					if(elem.addEventListener) elem.addEventListener(event, elem.handle, false);
					else if(elem.attachEvent) elem.attachEvent('on'+event, elem.handle);
				}
				elem.events[event].push(handler);
			},
			remove: function(elem, event, handler) {
				var handlers = elem.events[event];
				for(var i = handlers.length - 1; i >= 0; i--) {
					if(handlers[i] === handler) {
						handlers.splice(i,1);
					}
				}
				if(!handlers.length) {
					delete elem.events[event];
					if(elem.removeEventListener) elem.removeEventListener(event, elem.handle);
					else if(elem.detachEvent) elem.detachEvent('on'+event, elem.handle);
				}
			}
		};
	}()),
	queryElementsBySelector: function(selector, scope) {
		scope = scope || document;
		if(selector === '>*') return scope.children;
		if(typeof document.querySelectorAll === 'function') {
			return scope.querySelectorAll(selector);
		}
		var selectors = selector.split(',');
		var resultList = [];
		for(var s = 0; s < selectors.length; s++) {
			var currentContext = [scope || document];
			var tokens = selectors[s].replace(/^\s+/,'').replace(/\s+$/,'').split(' ');
			for (var i = 0; i < tokens.length; i++) {
				token = tokens[i].replace(/^\s+/,'').replace(/\s+$/,'');
				if (token.indexOf('#') > -1) {
					var bits = token.split('#'), tagName = bits[0], id = bits[1];
					var element = document.getElementById(id);
					if (element && tagName && element.nodeName.toLowerCase() != tagName) {
						return [];
					}
					currentContext = element ? [element] : [];
					continue;
				}
				if (token.indexOf('.') > -1) {
					var bits = token.split('.'), tagName = bits[0] || '*', className = bits[1], found = [], foundCount = 0;
					for (var h = 0; h < currentContext.length; h++) {
						var elements;
						if (tagName == '*') {
							elements = currentContext[h].getElementsByTagName('*');
						} else {
							elements = currentContext[h].getElementsByTagName(tagName);
						}
						for (var j = 0; j < elements.length; j++) {
							found[foundCount++] = elements[j];
						}
					}
					currentContext = [];
					var currentContextIndex = 0;
					for (var k = 0; k < found.length; k++) {
						if (found[k].className && found[k].className.match(new RegExp('(\\s|^)'+className+'(\\s|$)'))) {
							currentContext[currentContextIndex++] = found[k];
						}
					}
					continue;
				}
				if (token.match(/^(\w*)\[(\w+)([=~\|\^\$\*]?)=?"?([^\]"]*)"?\]$/)) {
					var tagName = RegExp.$1 || '*', attrName = RegExp.$2, attrOperator = RegExp.$3, attrValue = RegExp.$4;
					if(attrName.toLowerCase() == 'for' && this.browser.msie && this.browser.version < 8) {
						attrName = 'htmlFor';
					}
					var found = [], foundCount = 0;
					for (var h = 0; h < currentContext.length; h++) {
						var elements;
						if (tagName == '*') {
							elements = currentContext[h].getElementsByTagName('*');
						} else {
							elements = currentContext[h].getElementsByTagName(tagName);
						}
						for (var j = 0; elements[j]; j++) {
							found[foundCount++] = elements[j];
						}
					}
					currentContext = [];
					var currentContextIndex = 0, checkFunction;
					switch (attrOperator) {
						case '=': checkFunction = function(e) { return (e.getAttribute(attrName) == attrValue) }; break;
						case '~': checkFunction = function(e) { return (e.getAttribute(attrName).match(new RegExp('(\\s|^)'+attrValue+'(\\s|$)'))) }; break;
						case '|': checkFunction = function(e) { return (e.getAttribute(attrName).match(new RegExp('^'+attrValue+'-?'))) }; break;
						case '^': checkFunction = function(e) { return (e.getAttribute(attrName).indexOf(attrValue) == 0) }; break;
						case '$': checkFunction = function(e) { return (e.getAttribute(attrName).lastIndexOf(attrValue) == e.getAttribute(attrName).length - attrValue.length) }; break;
						case '*': checkFunction = function(e) { return (e.getAttribute(attrName).indexOf(attrValue) > -1) }; break;
						default : checkFunction = function(e) { return e.getAttribute(attrName) };
					}
					currentContext = [];
					var currentContextIndex = 0;
					for (var k = 0; k < found.length; k++) {
						if (checkFunction(found[k])) {
							currentContext[currentContextIndex++] = found[k];
						}
					}
					continue;
				}
				tagName = token;
				var found = [], foundCount = 0;
				for (var h = 0; h < currentContext.length; h++) {
					var elements = currentContext[h].getElementsByTagName(tagName);
					for (var j = 0; j < elements.length; j++) {
						found[foundCount++] = elements[j];
					}
				}
				currentContext = found;
			}
			resultList = [].concat(resultList,currentContext);
		}
		return resultList;
	},
	trim: function (str) {
		return str.replace(/^\s+/, '').replace(/\s+$/, '');
	},
	bind: function(f, scope, forceArgs){
		return function() {return f.apply(scope, forceArgs ? [forceArgs] : arguments);};
	}
};

// DOM ready handler
function bindReady(handler){
	var called = false;
	var ready = function() {
		if (called) return;
		called = true;
		handler();
	};
	if (document.addEventListener) {
		document.addEventListener('DOMContentLoaded', ready, false);
	} else if (document.attachEvent) {
		if (document.documentElement.doScroll && window == window.top) {
			var tryScroll = function(){
				if (called) return;
				if (!document.body) return;
				try {
					document.documentElement.doScroll('left');
					ready();
				} catch(e) {
					setTimeout(tryScroll, 0);
				}
			};
			tryScroll();
		}
		document.attachEvent('onreadystatechange', function(){
			if (document.readyState === 'complete') {
				ready();
			}
		});
	}
	if (window.addEventListener) window.addEventListener('load', ready, false);
	else if (window.attachEvent) window.attachEvent('onload', ready);
}

function hasClass(obj,cname) {
    return (obj.className ? obj.className.match(new RegExp('(\\s|^)'+cname+'(\\s|$)')) : false);
}
function addClass(obj,cname) {
    if (!hasClass(obj,cname)) obj.className += " "+cname;
}
function removeClass(obj,cname) {
    if (hasClass(obj,cname)) obj.className=obj.className.replace(new RegExp('(\\s|^)'+cname+'(\\s|$)'),' ');
}


// DOM ready
function bindReady(handler){
    var called = false
    function ready() {
        if (called) return;
        called = true
        handler()
    }
    if (document.addEventListener) {
        document.addEventListener( "DOMContentLoaded", ready, false )
    } else if (document.attachEvent) {
        if (document.documentElement.doScroll && window == window.top) {
            function tryScroll(){
                if (called) return
                if (!document.body) return
                try {
                    document.documentElement.doScroll("left")
                    ready()
                } catch(e) {
                    setTimeout(tryScroll, 0)
                }
            }
            tryScroll()
        }
        document.attachEvent("onreadystatechange", function(){
            if ( document.readyState === "complete" ) {
                ready()
            }
        })
    }
    if (window.addEventListener) window.addEventListener('load', ready, false)
    else if (window.attachEvent) window.attachEvent('onload', ready)
}

bindReady(function(){
    alert('DOM ready!');
});


function addHandler(object, event, handler) {
    if (typeof object.addEventListener != 'undefined') object.addEventListener(event, handler, false);
    else if (typeof object.attachEvent != 'undefined') object.attachEvent('on' + event, handler);
}
function removeHandler(object, event, handler) {
    if (typeof object.removeEventListener != 'undefined') object.removeEventListener(event, handler, false);
    else if (typeof object.detachEvent != 'undefined') object.detachEvent('on' + event, handler);
}


// detect device type
var isTouchDevice = (function() {
    try {
        return ('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch;
    } catch (e) {
        return false;
    }
}());

Удалить пробелы на концах строки
function trim(str) {
	return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
}

Размеры окна
function getClientWidth(){return document.compatMode=='CSS1Compat' ? document.documentElement.clientWidth : document.body.clientWidth;}
function getClientHeight(){return document.compatMode=='CSS1Compat' ? document.documentElement.clientHeight : document.body.clientHeight;}

ScrollTop/ScrollLeft окна
function getScrollTop(){return window.pageYOffset || document.documentElement.scrollTop}
function getScrollLeft(){return window.pageXOffset || document.documentElement.scrollLeft}

// вызов из js:
window.print()
<!-- инлайново в HTML -->
<a href="javascript:window.print();">Print</a>


var currentBrowser = (function() {
    var rwebkit = /(webkit)[ \/]([\w.]+)/,
    ropera = /(opera)(?:.*version)?[ \/]([\w.]+)/,
    rmsie = /(msie) ([\w.]+)/,
    rmozilla = /(mozilla)(?:.*? rv:([\w.]+))?/;
    var ua = navigator.userAgent.toLowerCase();
    var match = rwebkit.exec( ua ) || ropera.exec( ua ) || rmsie.exec( ua ) || ua.indexOf("compatible") < 0 && rmozilla.exec( ua ) || [];
    var res = {};
    res[match[1]] = true;
    res.version = match[2] || "0";
    return res;
})();


function getCookie( name ) {
    var start = document.cookie.indexOf( name + "=" );
    var len = start + name.length + 1;
    if ( ( !start ) && ( name != document.cookie.substring( 0, name.length ) ) ) {
        return null;
    }
     if ( start == -1 ) return null;
    var end = document.cookie.indexOf( ';', len );
    if ( end == -1 ) end = document.cookie.length;
    return unescape( document.cookie.substring( len, end ) );
} 
function setCookie( name, value, expires, path, domain, secure ) {
    var today = new Date();
    today.setTime( today.getTime() );
    if ( expires ) {
        expires = expires * 1000 * 60 * 60 * 24;
    }
    var expires_date = new Date( today.getTime() + (expires) );
    document.cookie = name+'='+escape( value ) +
        ( ( expires ) ? ';expires='+expires_date.toGMTString() : '' ) + //expires.toGMTString()
        ( ( path ) ? ';path=' + path : '' ) +
        ( ( domain ) ? ';domain=' + domain : '' ) +
        ( ( secure ) ? ';secure' : '' );
} 
function deleteCookie( name, path, domain ) {
    if ( getCookie( name ) ) document.cookie = name + '=' +
            ( ( path ) ? ';path=' + path : '') +
            ( ( domain ) ? ';domain=' + domain : '' ) +
            ';expires=Thu, 01-Jan-1970 00:00:01 GMT';
}

Добавить сайт в закладки (не кроссбраузерно)
// bookmark current page
function addBookmark() {
    var success=false;
    try {
        window.external.AddFavorite(window.location, document.title);
        success=true;
    } catch(e) {}
    try {
        window.sidebar.addPanel(document.title,location.href,'');
        success=true;
    } catch(e) {}
    if(!success)
    {
        alert("Your browser does not support auto bookmarking. Press CTRL+D, or CMD+D to manually bookmark this page.");
    }
}

Определение размеров дефолтных скроллбаров:
var scrollSize = (function(){
    var content, hold, sizeBefore, sizeAfter;
    function buildSizer(){
        if(hold) removeSizer();
        content = document.createElement('div');
        hold = document.createElement('div');
        hold.style.cssText = 'position:absolute;overflow:hidden;width:100px;height:100px';
        hold.appendChild(content);
        document.body.appendChild(hold);
    }
    function removeSizer(){
        document.body.removeChild(hold);
        hold = null;
    }
    function calcSize(vertical) {
        buildSizer();
        content.style.cssText = 'height:'+(vertical ? '100%' : '200px');
        sizeBefore = (vertical ? content.offsetHeight : content.offsetWidth);
        hold.style.overflow = 'scroll'; content.innerHTML = 1;
        sizeAfter = (vertical ? content.offsetHeight : content.offsetWidth);
        if(vertical && hold.clientHeight) sizeAfter = hold.clientHeight;
        removeSizer();
        return sizeBefore - sizeAfter;
    }
    return {
        getWidth:function(){
            return calcSize(false);
        },
        getHeight:function(){
            return calcSize(true)
        }
    }
}());
// использовать можно так: alert(scrollSize.getWidth() + ' : '+ scrollSize.getHeight());

Закрыть окно браузера (не работает в FF, раскомментировать для частичной работы)
function closeWindow() {
    //netscape.security.PrivilegeManager.enablePrivilege('UniversalBrowserWrite');
    window.open('', '_self', '');
    window.close();
}

Предупреждение перед закрытием вкладки/окна браузера (Кроме Opera)
// init onbeforeunload event
function onPageUnload(func, message) {
    // W3C
    window.onbeforeunload = function() {
        func();
        return message;
    }
    // IE
    document.body.onunload = function() {
        if(window.event!=null && (window.event.clientX < 0 && window.event.clientY < 0)) {
            func();
        }
    }
}

// example usage
onPageUnload(function(){
    alert('Saving settings...');
}, 'Are you sure?');


Получить значение параметра из GET-строки (адресной строки браузера)
function getUrlAttr(name) {
    name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
    var regexS = "[\\?&]"+name+"=([^&#]*)";
    var regex = new RegExp( regexS );
    var results = regex.exec( window.location.href );
    if( results == null ) return ""; else return results[1];
}
// http://www.google.com/?q=test&browser=opera
// s = getUrlAttr('q'); s = getUrlAttr('browser');


Исправление position:fixed + scrollTop (iOS 5.x only)
// iOS fix
var win = jQuery(window);
if(isTouchDevice) {
    var origStyle = box.attr('style');
    var sTop = win.scrollTop();
    box.css({position: 'relative'});
    win.scrollTop(sTop);
    if(origStyle) {
        box.attr('style',origStyle);
    } else {
        box.css({position: ''});
    }
}
// фикс нужно вызывать на complete анимации scrollTop. В фиксе переменная "box" - это блок, который висит на fixed.



Чтобы кроссбраузерно отловить события активации/деактивации текущего окна браузера можно использовать следующий код:
// window focus handler
WinState = {
    init: function() {
        window.focus();
        this.focused = true;
        this.focusHandlers = [];
        this.blurHandlers = [];
        this.initHanders();
        return this;
    },
    initHanders: function() {
        if (/*@cc_on!@*/false) {
            document.attachEvent('onfocusin',this.bind(this.focusEvent));
            document.attachEvent('onfocusout',this.bind(this.blurEvent));
        } else {
            window.addEventListener('focus',this.bind(this.focusEvent),false);
            window.addEventListener('blur',this.bind(this.blurEvent),false);
        }
    },
    focusEvent: function(e) {
        this.focused = true;
        for(var i = 0; i < this.focusHandlers.length; i++) {
            if(typeof this.focusHandlers[i] === 'function') {
                this.focusHandlers[i](e || window.event);
            }
        }
    },
    blurEvent: function(e) {
        this.focused = false;
        for(var i = 0; i < this.blurHandlers.length; i++) {
            if(typeof this.blurHandlers[i] === 'function') {
                this.blurHandlers[i](e || window.event);
            }
        }
    },
    addFocusHandler: function(f) {
        this.focusHandlers.push(f);
    },
    addBlurHandler: function(f) {
        this.blurHandlers.push(f);
    },
    bind: function(fn, scope, args){
        var newScope = scope || this;
        return function() {
            return fn.apply(newScope, args || arguments);
        }
    }
}.init();