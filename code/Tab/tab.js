;;;(function (window,undefiend){

	//the ancester of all Class,providing the all base's methods and events
	var Events = {
		//register a fn or some fns to an event, an event can bind some fns
		addListener: function(ev,fn,context){
			//alert(typeof fn);
			//alert(Object.prototype.toString.call(fn));
			//alert(fn instanceof Function);
			this.events = this.events || {};
			this.events[ev] = this.events[ev] || [];
            this.events[ev].push({
            	fn: fn,
            	context: context||this
            });
        },
        excuteEv: function(ev,args){
            var that = this;
            if(that.events[ev]){
                for(var i=0,f;f=that.events[ev][i];i++){
                    f.fn.call(f.context,args);
                }
            }
        }
	}

	function Founder(arg){
		this.author = "小明有2个苹果";
		this.version = "0.0.0.0";
		this.web = (arg&&arg.web)||"http://www.smilce.com";

	}
	Founder.prototype = {
		constructor: Founder
	}
	
    var tabPrototype = {
        _init: function(){
            var titlePanel = document.createElement("ul");
            titlePanel.className = "tab-titlePanel";
            var contentPanel = document.createElement("div");
            contentPanel.className = "tab-contentPanel";
            var items = this.items;
            for(var i=0,item;item=items[i];i++){
                var title = document.createElement("li");
                title.innerHTML = item.title;
                var content = document.createElement("div");
                $(content).addClass("tab-content");

                titlePanel.appendChild(title);

                contentPanel.appendChild(content);

                this.items[i].titleDom = title;
                this.items[i].contentDom = content;

                var that = this;

                lib.on(this.items[i].titleDom,this.tabEvent,function(){

                    for(var i=0,len=that.items.length;i<len;i++){
                        if(this == that.items[i].titleDom){
                            that.setSelected(i);
                            break;
                        }
                    }

                });


                this._getData(i);
            }
            this.titlePanel = titlePanel;
            this.contentPanel = contentPanel;
        },
        render: function(el){
            this.panel = document.getElementById(el);
            this.panel.appendChild(this.titlePanel);
            this.panel.appendChild(this.contentPanel);

            
        },
        _showSelected: function(index){

            if(this.currentIndex>-1){
                this.items[this.currentIndex].titleDom.className = "";
                var contentDom = this.items[this.currentIndex].contentDom;
                $(contentDom).removeClass("selected-content");
            }

            this.items[index].titleDom.className = "selected-title";
            var contentDom = this.items[index].contentDom;
            $(contentDom).addClass("selected-content");

            this.currentIndex = index;
        },
        setSelected: function(index){
            this._showSelected(index);
            this._getData(index);
            this.excuteEv("selected");
        },
        _getData: function(index){
            var item = this.items[index];
            var content = item.content;
            if(!content) return;
            item.contentDom.innerHTML = content;
        },
        setContent: function(index,content){
            var item = this.items[index];
            if(content.nodeType){
                item.contentDom.innerHTML="";
                item.contentDom.appendChild(content);
            }else{
                item.contentDom.innerHTML = content;
            }
        },
        showTabByType: function(index){
            this._showSelected(index);
        },
        getCurrentIndex: function(){
            return this.currentIndex;
        }
    }

    lib.object.extend(tabPrototype, Events);

	var t = lib.object.inherit(Founder,function(arg){
		arg = arg||{};
		this.currentIndex = arg.currentIndex||0;
        this.items = arg.items||[];
        this.tabEvent = arg.tabEvent||"click";

        this._init();

        //this.setSelected(this.currentIndex);
        
	},tabPrototype);
	
	lib.extend.addComponent("Tab",t);

    var tab2Prototype = {
        _init: function(){
            var items = this.items;
            for(var i=0,item;item=items[i];i++){

                var that = this;

                lib.on(this.items[i],this.tabEvent,function(){
                    if(this!==that.items[that.currentIndex]){
                        for(var i=0,len=that.items.length;i<len;i++){
                            if(this == that.items[i]){
                                that.setSelected(i);
                                break;
                            }
                        }
                    }
                    

                });

            }
        },
        _showSelected: function(index){

            if(this.currentIndex>-1){
                var title = this.items[this.currentIndex];
                $(title).removeClass("selected-title");
            }

            var title = this.items[index];
            $(title).addClass("selected-title");

            this.currentIndex = index;
        },
        setSelected: function(index){
            this._showSelected(index);
            this.excuteEv("selected",[this.currentIndex]);
        },
        getCurrentIndex: function(){
            return this.currentIndex;
        }
    }

    lib.object.extend(tab2Prototype, Events);

    var t2 = lib.object.inherit(Founder,function(arg){
        arg = arg||{};
        this.currentIndex = arg.currentIndex||0;
        this.items = arg.items||[];
        this.tabEvent = arg.tabEvent||"click";

        this._init();

        //this.setSelected(this.currentIndex);
        
    },tab2Prototype);

    lib.extend.addComponent("PlainTab",t2);



})(window);