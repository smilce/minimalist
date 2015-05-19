;;;(function (window,undefiend){





	
    var p = {
        _init: function(){

            this._buildPanel();
            this._initListener();
            this._initEvents();
            if(this._content){
                this._setContent(this._content);
            }

            document.body.appendChild(this._panel);

        },
        _buildPanel: function(){
            this._panel = document.createElement("div");
            lib.dom.setStyle(this._panel, {
                position: "fixed",
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
                "-webkit-justify-content": "center",
                "-webkit-align-items": "center",
                display: "none"
            });
            var mask = document.createElement("div");
            lib.dom.setStyle(mask, {
                width:"100%",
                height:"100%",
                'background-color':"#CCC"
            });
            this._panel.appendChild(mask);
            var contentPanel = document.createElement("div");
            lib.dom.setStyle(contentPanel, {
                position: "absolute",
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
                "-webkit-justify-content": "center",
                "-webkit-align-items": "center",
                "display": "-webkit-flex"
            });
            this._panel.appendChild(contentPanel);
            this._contentPanl = document.createElement("div");
            lib.dom.setStyle(this._contentPanl, {
                display: "inline-block"
            });
            contentPanel.appendChild(this._contentPanl);
        },
        _initListener: function(){
            var that = this;
            this.addListener("show", function(){
                that._togglePanel();
            });
            this.addListener("hide", function(){
                that._togglePanel();
            });
            this.addListener("setContent", function(content){
                that._setContentDom(content);
            });
        },
        _initEvents: function(){
            lib.on(this._panel, "click", this.hide.bind(this));
            lib.on(this._contentPanl, "click", function(e){
                e.stopPropagation();
            });
        },
        _posContent: function(){
            
        },
        _togglePanel: function(){
            this._isShow ? this._panel.style.display = "" : this._panel.style.display = "none";
        },
        _show: function(){
            if(this._isShow) return;
            this._isShow = true;
            this.excuteEv("show");
        },
        _hide: function(){
            if(!this._isShow) return;
            this._isShow = false;
            this.excuteEv("hide");
        },
        _setContent: function(content){
            var type = lib.type.getType(content);
            switch(type){
                case "string":
                    content = content;
                break;
                case "function":
                    content = content();
                    if(!content) return;
                break;
                case "object":
                    if(!content.nodeType){
                        return;
                    }
                break;
                default: 
                    return;
                break;
            }
            this._content = content;
            this.excuteEv("setContent",[content]);
        },
        _checkContent: function(content){
            if(!content) return;
            if(content == this._content){
                this._show();
                return;
            }
            this._setContent(content);
        },
        _setContentDom: function(content){
            if(content.nodeType){
                this._contentPanl.appendChild(content);
            }else{
                this._contentPanl.innerHTML = content;
            }
        },
        _setOptions: function(arg){
            var that = this;
            lib.object.each(arg,function(key,value){
                that._options[key] = value;
                that.excuteEv("OptionChange",[key, value]);
            });
        },
        show: function(){
            this._show();
        },
        hide: function(){
            this._hide();
        },
        setContent: function(content){ 
            this._checkContent(content);
        },
        getContent: function(){
            return this._contentPanl;
        },
        set: function(key, value){
            var arr = {};
            if(lib.type.getType(key) === "object"){
                arr = key;
            }else{
                arr[key] = value;
            }
            this._setOptions(arr);
        },
    }
    lib.object.enableEvents(p);
	var t= lib.object.inherit(null,function(arg){
        var defaults = {
            isShow: false,
            options: {}
        }
        var args = {};
        lib.object.each(arg, function(key, value){
            if(key == "defaults"){
                args._option = value;
                return;
            }
            args["_"+key] = value;
        });
        lib.object.extend(this, defaults, args);
        this._init.apply(this, arguments);
        
	},p);
	
	lib.extend.addComponent("Dialog",t);





})(window);