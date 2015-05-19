;;;(function (window, undefiend){

	'use strict';

	var 
		document = window.document;

    var aPrototype = {
    	_init: function(){
 
    		this._list = lib.array.o2t(this._list, this._number);
    		this._length = this._list.length-1;
    		this._panel = lib.g(this._panel);

    		this._setPanelPos();
    		this._buildLayer();
    		this._updateLayer(this._list[0], 0, 0);
    		this._updateLayer(this._list[1], 1, 1);
    		this._initEvent();
    		
    		this._panel.appendChild(this._content);
    	},
    	_setPanelPos: function(){
    		if(lib.dom.getCurrentStyle(this._panel, "position")==="static"){
    			lib.dom.setStyle(this._panel, {
    				position: "relative"
    			});
    		}
    		this._content = document.createElement("ul");
    		this._content.className = lib.array.toString([this._preFix,"-content"]);
    		if(this._option.contentId)
    			this._content.id = this._option.contentId;
    		lib.dom.setStyle(this._content, {
    			position: "absolute",
    			width: 9999,
    			padding: 0,
    			margin: 0,
    			'-webkit-transition': "left .3s ease-out"
    		});
    	},
    	_buildLayer: function(){
    		this._layer0 = document.createElement("li");
    		this._layer0.className = lib.array.toString([this._preFix,"-item"]);
    		this._itemWidth = this._panel.clientWidth;
    		lib.dom.setStyle(this._layer0, {
    			width: this._itemWidth,
    			height: "100%",
    			float: "left",
    			position: "relative"
    		});
    		this._layer1 = this._layer0.cloneNode();
    		this._content.appendChild(this._layer0);
    		this._content.appendChild(this._layer1);

    		var l = document.createElement("div");
    		if(this._option.itemClass)
    			l.className = this._option.itemClass;

    		var d = this._layerData;

    		for(var i=0;i<5;i++){
    			var l0 = l.cloneNode(),
    				l1 = l.cloneNode();  			
    			this._layer0.appendChild(l0);
    			this._layer1.appendChild(l1);

    			d.layer0.push({
    				dom: l0
    			});
    			d.layer1.push({
    				dom: l1
    			});

    			if(this._events){
    				lib.object.each(this._events, function(ev, fn){
    					var t = d.layer0[i];
    					lib.on(l0, ev, function(e){
    						fn.call(this,e,t);
    					});
    				});
    				lib.object.each(this._events, function(ev, fn){
    					var t = d.layer1[i];
    					lib.on(l1, ev, function(e){
    						fn.call(this,e,t);
    					});
    				});
    			}
    				
    		}
 

    	},
    	_updateLayer: function(data, index, pos){
    		var d = this._layerData["layer"+index];
    		lib.array.each(data, function(data,index){
    			d[index].data = data;
    			d[index].dom.innerHTML = this._format(data);
    		}.bind(this));
    		this._current["l"+index] = pos;
    	},
    	_initEvent: function(){
    		this._content.addEventListener('webkitTransitionEnd',function(){
    			this._running = false;
    		}.bind(this),false);
    	},
    	next: function(){
    		if(this._running) return;
    		var c = this._current;
    		c.total ++;

    		this._currentLayer++;
    		if(this._currentLayer===2){
    			if(c._layer0 !== c.total){

    				if(c.total === this._length+1)
    					c.total = 0;

    				this._updateLayer(this._list[c.total], 0, c.total);
    			}

    			this._layer0.style.left = (this._currentLayer*this._itemWidth) + "px";
    			var after = function(){
	    			this._layer0.style.left = 0;
	    			this._content.style.WebkitTransition = "";
	    			this._content.style.left = 0;
	    			setTimeout(function(){
	    				this._content.style.WebkitTransition = "left .3s ease-out";
	    			}.bind(this),0);
	    			this._content.removeEventListener('webkitTransitionEnd',after,false);
	    			this._currentLayer = 0;
	    		}.bind(this);
	    		this._content.addEventListener('webkitTransitionEnd',after,false);
    		}else{
    			if(c._layer1 !== c.total){
    				if(c.total === this._length+1)
    					c.total = 0;
    				this._updateLayer(this._list[c.total], 1, c.total);
    			}
    		}
    		this._running = true;
    		this._content.style.left = -(this._currentLayer*this._itemWidth) + "px";
    	},
    	prev: function(){
    		if(this._running) return;
    		var c = this._current;
    		c.total --;
    		this._currentLayer --;
    		if(this._currentLayer===-1){

    			if(c._layer1 !== c.total){

    				if(c.total === -1)
    					c.total = this._length;

    				this._updateLayer(this._list[c.total], 1, c.total);
    			}

    			this._currentLayer = 1;
    			this._layer1.style.left = -(2*this._itemWidth) + "px";
    			var after = function(){
	    			this._layer1.style.left = 0;
	    			this._content.style.WebkitTransition = "";
	    			this._content.style.left = -(this._itemWidth) + "px";
	    			setTimeout(function(){
	    				this._content.style.WebkitTransition = "left .5s ease-out";
	    			}.bind(this),0);
	    			this._content.removeEventListener('webkitTransitionEnd',after,false);
	    			this._currentLayer = 1;
	    		}.bind(this);
	    		this._content.addEventListener('webkitTransitionEnd',after,false);
    		}else{

    			if(c._layer0 !== c.total){
    				if(c.total === -1)
    					c.total = this._length;
    				this._updateLayer(this._list[c.total], 0, c.total);
    			}
    		}
    		this._running = true;
    		this._content.style.left = (this._currentLayer*this._itemWidth) + "px";
    	}
    };
    lib.object.enableEvents(aPrototype);
	var a= lib.object.inherit(null,function(arg){
		
		var defaults = {
           _option: {},
           _number: 3,
           _preFix: "smilce",
           _currentLayer: 0,
           _running: false,
           _current: {
           		total: 0,
           		layer0: 0,
           		layer1: 1
           },
           _layerData: {
           		layer0: [],
           		layer1: []
           }
        }

        var args = {};
        lib.object.each(arg, function(key, value){
            args["_"+key] = value;
        });

        lib.object.extend(this, defaults, args);

        this._init.apply(this, arg);
        
	},aPrototype);
	
	lib.extend.addComponent("Scroll",a);

})(this);
