;;;(function (window,undefiend){

	var Promise = function () {  
		this.thens = [];
	};
    Promise.prototype = {
        resolve: function () {
        	console.error(this.thens)
        	this.thens.shift()();
        },
        then: function (n) { 
        	this.thens.push(n);
        	return this; 
        }
    };
	
    var aPrototype = {
    	_init: function(){

    	},
        _default: {

        },
	    setDead: function(dom){
	    	var promise = new Promise(),process;
	    	lib.dom.setStyle(dom, {
				position: "relative",
				"z-index": 9999
			});
	    	lib.dom.setStyle(dom, {
				'-webkit-transition': '-webkit-transform .3s ease-out',

				'-webkit-backface-visibility': 'visible',
				'-webkit-transform': 'perspective(180px) rotateY(0deg)',
				'-webkit-transform-origin': '50% 50%',
			});

			promise.then(function(){
				dom.style.WebkitTransform = 'perspective(180px) rotateY(80deg)';
			}).then(function(){
				dom.style.WebkitTransform = 'perspective(180px) rotateY(80deg) translateX(400px)';
			}).then(function(){
				dom.style.display = "none";
				dom.removeEventListener('webkitTransitionEnd',process,false);
				promise.resolve();
				promise = null;
				process = null;
			});
			process = function(e){ 
				promise.resolve();
			};
			dom.addEventListener('webkitTransitionEnd',process,false);
			promise.resolve();
			return promise;
	    }
    };
    lib.object.enableEvents(aPrototype);
	var a= lib.object.inherit(null,function(arg){
		arg=arg||{};
        lib.object.extend(this, this._default, arg);
        this._init.apply(this, arguments);
        
	},aPrototype);
	
	lib.extend.addComponent("Animation",a);





})(window);
