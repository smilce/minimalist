;;;(function (window,undefiend){

    var tipPrototype = {
        _init: function(){
            this._buildItem();
            this._initListener();
            this._initEvents();
            if(this.content){
                this._setContent(this.content);
            }
        },
        _default: {
            isShow: false,
            options: {},
            hasArrow: false,
            direction: "top"
        },
        _buildItem: function(){
            var div = this.render;
            if(!div){
                div = document.createElement("div");
                document.body.appendChild(div);
                lib.dom.setStyle(div,{
                    background: "rgb(170, 205, 241)",
                    width: 300
                });
            }
            lib.dom.setStyle(div,{
                position: "absolute",
                display: "none"
            });
            this.contentPanl = document.createElement("div");
            this.contentPanl.className = "tipContent";
            lib.dom.setStyle(this.contentPanl,{
                position: "absolute"
            });
            this.panel = div;
            this.panel.appendChild(this.contentPanl);
            if(this.hasArrow){
                var arrow = this.arrow = document.createElement("div");
                var opt = this.options;
                if(opt.arrowClass){
                    arrow.className = opt.arrowClass;
                }else{
                    lib.dom.setStyle(arrow, {
                        width: 12,
                        height: 12,
                        "background-color": "white",
                        position: "absolute",
                        left: 20,
                        "-webkit-transform": "rotate(45deg)",
                    });
                }
                this.panel.appendChild(arrow);
            }
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
            this.addListener("OptionChange", function(key, value){
                if(key === "arrowClass"){
                    that.arrow.className = value;
                }
            });
        },
        _initEvents: function(){
            lib.on(window, "resize", function(){
                if(this.isShow)
                    this._posContent();
            }.bind(this));
        },
        _posContent: function(){
            var opt = this.options,
                top = 0,
                left = 0,
                target = this.target,
                panel = this.panel,
                content = this.contentPanl;
            var 
                arrowTop = 0,
                arrowLeft = 0,
                arrow = null,
                hasArrow = null;
            if(this.hasArrow){
                arrowTop = 0,
                arrow = this.arrow,
                hasArrow = this.hasArrow;
            }
            var tLeft = target.offsetLeft,
                pWidth = panel.offsetWidth,
                wWidth = window.innerWidth,
                plus = 0;
            switch(this.direction){
                case "top":

                    if(tLeft+pWidth>wWidth)
                        plus = wWidth - (tLeft+pWidth) - 15;
 
                    left = tLeft + plus + (opt.offsetLeft||0);
                    top = (target.offsetTop - panel.offsetHeight) + (opt.offsetTop||0);
                    if(hasArrow){
                        arrowTop = (panel.offsetHeight - (arrow.offsetHeight/2)) + (opt.arrowOffsetTop||0);
                        
                        if(Math.abs(plus)+45 > pWidth)
                            arrowLeft = pWidth - 30;
                        else
                            arrowLeft = -plus+20;
                        
                    }
                break;
                case "bottom":
                    if(tLeft+pWidth>wWidth)
                        plus = wWidth - (tLeft+pWidth) - 15;
 
                    left = tLeft + plus + (opt.offsetLeft||0);
                    top = (target.offsetTop + target.offsetHeight) + (opt.offsetTop||0);
                    lib.dom.setStyle(content, {
                        "z-index": 1 
                    });
                    if(hasArrow){
                        var height = arrow.offsetHeight/2;
                        arrowTop = -height;
                        top = top + height;

                        if(Math.abs(plus)+45 > pWidth)
                            arrowLeft = pWidth - 30;
                        else
                            arrowLeft = -plus+20;
                    }
                break;
            }
            this._contentToPos(left,top);
            (hasArrow)&&(this._arrowToPos(arrowTop,arrowLeft));
            /*var opt = this.options,
                top = 0,
                left = 0,
                target = this.target,
                panel = this.panel,
                content = this.contentPanl;
                if(opt.left){
                    left = opt.left;
                }else{

                    left = target.offsetLeft;
                }
                if(opt.top){
                    top = opt.top;
                }else{
                    var 
                        tTop = target.offsetTop,
                        tHeight = target.offsetHeight,
                        cHeight = panel.offsetHeight,
                        wHeight = window.innerHeight;
                    top = wHeight - tTop > tTop ? tTop + tHeight : tTop - cHeight;
                }*/
        },
        _contentToPos: function(left, top){
            var panel = this.panel,
                content = this.contentPanl;
            lib.dom.setStyle(panel,{
                top: top,
                left: left,
                width: content.offsetWidth,
                height: content.offsetHeight
            });
        },
        _arrowToPos: function(top, left){
            var arrow = this.arrow;
            lib.dom.setStyle(arrow, {
                top: top,
                left: left
            });
        },
        _togglePanel: function(){
            this.isShow ? lib.show(this.panel) : lib.hide(this.panel);
        },
        _show: function(){
            if(this.isShow) return;
            this.isShow = true;
            this.excuteEv("show");
            this._posContent();
        },
        _hide: function(){
            if(!this.isShow) return;
            this.isShow = false;
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
            this.content = content;
            this.excuteEv("setContent",[content]);
            this.isShow ? this._posContent() : this._show();
        },
        _checkContent: function(content){
            if(!content) return;
            if(content == this.content){
                this._show();
                return;
            }
            this._setContent(content);
        },
        _setContentDom: function(content){
            if(content.nodeType){
                this.contentPanl.appendChild(content);
            }else{
                this.contentPanl.innerHTML = content;
            }
        },
        _setTarget: function(target){
            target = lib.g(target);
            if(!target) return;
            if(target==this.target){
                this.isShow ? this._posContent() : this._show();
            }else{
                this.target = target;
                this.isShow ? this._posContent() : this._show();
                this.excuteEv("setTarget",[this.target]);
            }
            
        },
        _setOptions: function(arg){
            var that = this;
            lib.object.each(arg,function(key,value){
                that.options[key] = value;
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
        setTarget: function(target){
            this._setTarget(target);
        },
        resetPosition: function(){
            this._posContent();
        },
        getContent: function(){
            return this.panel;
        },
        getTarget: function(){
            return this.target;
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
        setDirection: function(dir){
            this.direction = dir;
        }
    }
    lib.object.enableEvents(tipPrototype);
	var t= lib.object.inherit(null,function(arg){

        lib.object.extend(this, this._default, arg);
        this._init.apply(this, arguments);
        
	},tipPrototype);
	
	lib.extend.addComponent("Tip",t);





})(window);