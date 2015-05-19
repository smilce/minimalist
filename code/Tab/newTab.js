;;;(function (window,undefiend){

	
    var tabPrototype = {
        _init: function(){
            

            this._initListener();
            this._render = lib.g(this._render);
            if(!this._handlers&&!this._content){
                this._throwError("Must provide a handles or a contents!");
                return;
            }



            var items = [],
                i = 0,
                hLen = -1,
                cLen = -1,
                iLen = -1;

            if(this._handlers){
                this._handlers = Array.prototype.slice.call(this._handlers);
                hLen = this._handlers.length;
            }
            if(this._content){
                this._content = Array.prototype.slice.call(this._content);
                cLen = this._content.length;
            }
            if(this._id){
                iLen = this._id.length;
            }

            var len = Math.max(hLen, cLen, iLen);

            for(;i<len;i++){
                items.push({
                    handler: this._handlers ? this._handlers[i] : null,
                    content: this._content ? this._content[i] : null,
                    id: this._id ? this._id[i] : i
                });
            }

            this._addItems(items);

            this._setSelected(this._currentIndex);
        },
        _initListener: function(){
            this.addListener("selected", this._setSelectedPanel, this);
            this.addListener("unSelected", this._setUnSelectedPanel, this);
        },
        _addItems: function(items){

            var hFra,
                cFra,
                index = this._list.length - 1;

            lib.array.each(items, function(item, i){

                index++;


                // 初始化list项
                if(!this._list[index])
                    this._list[index] = {};

                if(item.handler){
                    var d = this._addHandler(item.handler, index);
                    if(d){
                        if(!hFra){
                            hFra = document.createDocumentFragment();
                        }
                        hFra.appendChild(d);
                    }
                }

                if(item.content){
                    var d = this._addContent(item.content, index);
                    if(d){
                        if(!cFra){
                            cFra = document.createDocumentFragment();
                        }
                        cFra.appendChild(d);
                    }
                }

                if(item.id)
                    this._list[index].id = item.id;

            }.bind(this));

            if(hFra)
                this._handlerPanel.appendChild(hFra);

            if(cFra)
                this._contentPanel.appendChild(cFra);

        },
        _addHandler: function(handler, index){
            var d;
            if(!handler.nodeType){

                d = document.createElement("li");
                d.innerHTML = handler;
                handler = d;

                if(!this._handlerPanel){
                    this._handlerPanel = document.createElement("ul");
                    this._handlerPanel.className = "handlerPanel";
                    this._render.appendChild(this._handlerPanel);
                }

            }
            
                
            this._bindHandlerEve(handler, index);
            this._list[index].handler = handler;

            if(d) return d;
        },
        _addContent: function(content, index, needContain){
            var d;

            if(!content.nodeType||needContain){

                d = document.createElement("div");
                d.className = "content";
                lib.dom.setHtml(d, content);
                content = d;

                if(!this._contentPanel){
                    this._contentPanel = document.createElement("div");
                    this._contentPanel.className = "contentPanel";
                    this._render.appendChild(this._contentPanel);
                }
            }
            this._list[index].content = content;

            if(d) return d;
        },
        _bindHandlerEve: function(handler, index){
            lib.on(handler, this._tabEvent, function(){
                this.setSelected(index);
            }.bind(this));
        },
        _setSelectedPanel: function(index){
            index = index||0;
            var data = this._list[index];
            if(!data)
                return;

            if(data.handler)
                lib.dom.addClass(data.handler, "selected");
            if(data.content)
                lib.dom.addClass(data.content, "selected");
        },
        _setUnSelectedPanel: function(){
            if(this._currentIndex === null||this._currentIndex === undefiend)
                return;
            var data = this._list[this._currentIndex];
            if(!data)
                return;

            if(data.handler)
                lib.dom.removeClass(data.handler, "selected");
            if(data.content)
                lib.dom.removeClass(data.content, "selected");
        },
        _setSelected: function(index){
            this._removeSelected();
            this._currentIndex = index;

            this.excuteEv("selected",[index, this._list[index]]);
        },
        _removeSelected: function(){
            this.excuteEv("unSelected");
            this._currentIndex = null;
        },
        _throwError: function(ero){
            throw ero;
        },
        setSelected: function(index){
            if(index === this._currentIndex)
                return;
            this._setSelected(index);
        },
        add: function(data, isSelected){
            if(lib.type.getType(data) === "object")
                data = [data];
            this._addItems(data);
        },
        getContent: function(index){
            return this._list[index] ? this._list[index].content : null;
        },
        setContent: function(index, content, needContain){
            var item = this._list[index];
            if(!item)
                return;
            if(!item.content){
                this._addContent(content, index, needContain);

                this._contentPanel.appendChild(item.content);
            }else{
                lib.dom.setHtml(item.content, content);
            }


            if(index === this._currentIndex){
                lib.dom.addClass(item.content, "selected");
            }
        }
    }

    lib.object.enableEvents(tabPrototype);
    var t = lib.object.inherit(null,function(arg){
        
        var defaults = {
            _currentIndex : 0,
            _tabEvent : "click",
            _render: document.body,
            _list: []
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
        
    },tabPrototype);
    
    lib.extend.addComponent("Tab",t);




})(window);