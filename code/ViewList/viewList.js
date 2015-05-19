;;;(function (window,undefiend){

    function Item(arg){
        this._format = arg.format;
        this._el = arg.format(arg.data);
        this._data = arg.data;
        this._events = arg.events;
        this._context = arg.context;
        this._init();
    }
    Item.prototype = {
        _init: function(){
            var that = this;
            lib.object.each(that._events, function(ev, fn){
                lib.on(that._el, ev, function(e){
                    var a = Array.prototype.slice.call(arguments);
                    a.push(that);
                    fn.apply(that._context, a);
                });
            });
        },
        getModel: function(){
            return this._data;
        },
        getEl: function(){
            return this._el;
        },
        get: function(key){
            return lib.type.getType==="object" ? this._data[key] : this._data;
        },
        set: function(key, value){
            lib.object.set(this._data, key, value, function(result){
                this._el.innerHTML = this._format(this._data).innerHTML;
            }.bind(this));
        }
    }



	
    var viewListPrototype = {
        _init: function(){

            if(this._data){
                this.add(this._data);
            }
           
        },
        _default: {
            _list: []
        },
        reset: function(){
            this._list = [];
        },
        getItem: function(index){
            return this._list[index];
        },
        set: function(key, value){
            this["_"+key] = value;
        },
        add: function(data){
            lib.array.each(data, function(data){
                var item = new Item({
                    format: this._format,
                    data: data,
                    events: this._events,
                    context: this._context
                });
                var el = item.getEl();
                this._render.appendChild(el);
                this._list.push(item);

            }.bind(this));
        },
        getItemIndex: function(model){
            return this._list.indexOf(model);
        },
        getLength: function(){
            return this._list.length;
        }
    }
    lib.object.enableEvents(viewListPrototype);
	var v= lib.object.inherit(null,function(arg){

        var args = {};
        lib.object.each(arg, function(key, value){
            args["_"+key] = value;
        });

        lib.object.extend(this, this._default, args);
        this._init.apply(this, arguments);
        
	},viewListPrototype);
	
	lib.extend.addComponent("ViewList",v);





})(window);