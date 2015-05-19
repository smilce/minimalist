;;;(function (window,undefiend){

	
    var dPrototype = {
        _init: function(){

            this._content = lib.g(this._content);
            this._initListener();
            this._mask = document.createElement("div");
            lib.dom.setStyle(this._mask, {
                position: 'absolute',
                left: 0,
                top: 0,
                bottom: 0,
                right: 0,
                'background-color': 'rgba(113,160,225,.3)',
                cursor: "move"                
            });

            
        },
        _initListener: function(){
            var handler = this._handler||this._content;
            lib.on(handler, "mousedown", this._dragstart.bind(this));
        },
        _dragstart: function(e){


            var content = this._content,
                pos = content.getBoundingClientRect(),
                opt = this._option;
            var dragDom = this.dragDom = content.cloneNode(true);

            opt.moveEv = this._dragmove.bind(this);
            opt.upEv = this._dragend.bind(this);

            lib.on(document, "mousemove", opt.moveEv);
            lib.on(document, "mouseup", opt.upEv);
            
            //dragDom.id = lib.noConflictId("darg");
            lib.dom.setStyle(dragDom, {
                position: "absolute",
                left: 0,
                top: 0,

            });
            dragDom.appendChild(this._mask);
            lib.dom.setStyle(this._content, {
                opacity: 0.2
            });
            content.parentNode.appendChild(dragDom);

            var dragPos = dragDom.getBoundingClientRect();

            var left = pos.left - dragPos.left,
                top = pos.top - dragPos.top;

            lib.dom.setStyle(dragDom, {
                left: left,
                top: top
            });
            opt.sLeft = e.pageX;
            opt.sTop = e.pageY;
            opt.oriLeft = left;
            opt.oriTop = top;
            this.excuteEv("dragStart",[e, dragDom]);

            this._running();

            e.stopPropagation();
            e.preventDefault();

        },
        _dragmove: function(e){
            var opt = this._option;
            opt._running = true;
            opt.pTop = opt.cTop;
            opt.pLeft = opt.cLeft;
            opt.cTop = e.pageY;
            opt.cLeft = e.pageX;
            console.error(e.pageY)
            /*
            if(e.clientY > window.innerHeight - 120){
                if(opt.cTop > opt.pTop){
                    lib.g("box").scrollTop += opt.cTop-opt.pTop;
                }
            }
            if(e.clientY<=0){
                lib.g("box").scrollTop += -1;
            }*/

            

            e.stopPropagation();
            e.preventDefault();
     
        },
        _dragend: function(){
            var opt = this._option;
            this._clearTimer();
            this.dragDom.parentNode.removeChild(this.dragDom);


            lib.un(document, "mousemove", opt.moveEv);
            lib.un(document, "mouseup", opt.upEv);
            this._option = {};
            this._content.style.opacity="";
            
            this.excuteEv("dragEnd");
        },
        _running: function(){
            var opt = this._option;
            this._clearTimer();
            opt.timer = setInterval(function(){
                if(!opt._running) return;   //鼠标开始移动才拖拽
                /*if(opt.cLeft===opt.oLeft||opt.cTop===opt.oTop){
                    if(!opt.hasPause){
                        lib.dom.setStyle(this.dragDom, {
                            left: opt.oriLeft + (opt.cLeft - opt.sLeft),
                            top: opt.oriTop + (opt.cTop - opt.sTop)
                        });
                        opt.oLeft = opt.cLeft;
                        opt.oTop = opt.cTop;
                        opt.hasPause = true;
                        this.excuteEv("dragmove");
                    }
                    return;
                }  //拖拽中途鼠标补动，暂停拖拽*/
               

                if(opt.oLeft!==opt.cLeft||opt.oTop!==opt.cTop){
                    this.once = false;
                    lib.dom.setStyle(this.dragDom, {
                        left: opt.oriLeft + (opt.cLeft - opt.sLeft),
                        top: opt.oriTop + (opt.cTop - opt.sTop)
                    });
                    this.excuteEv("dragmove");

                    /*if(opt.pauseTimer){
                        clearTimeout(opt.pauseTimer);
                    }
                    opt.pauseTimer = setTimeout(function(){
                            this.excuteEv("dragPause");
                            clearTimeout(opt.pauseTimer);
                            opt.pauseTimer = null;
                    }.bind(this), 100);*/
                }else{
                    if(!this.once){
                        lib.dom.setStyle(this.dragDom, {
                            left: opt.oriLeft + (opt.cLeft - opt.sLeft),
                            top: opt.oriTop + (opt.cTop - opt.sTop)
                        });
                        this.once = true;
                    }
                }           
                opt.oLeft = opt.cLeft;
                opt.oTop = opt.cTop;
                
            }.bind(this),17);
        },
        _clearTimer: function(){
            var opt = this._option;
            if(opt.timer){
                clearInterval(opt.timer);
                opt.timer = null;
            }
                
        }
    }

    lib.object.enableEvents(dPrototype);
    var d = lib.object.inherit(null,function(arg){
        
        var defaults = {
           _option: {},
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

        this._init.apply(this, arg);
        
    },dPrototype);
    
    lib.extend.addComponent("Drag",d);




})(window);