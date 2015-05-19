;;;(function (window,undefiend){

	var dataFlag = /\^([^\^]+)\^/g; 

	var sPrototype = {
		_init: function(){

			this._prefix = "suggestion-" + (this._prefix||"");
			this._buildDom();
            this._initListener();
            this._initEvents();		

		},
		_buildDom: function(){
			this._panel = lib.g(this._render);

			this._listPanel = document.createElement("div");
			this._listPanel.className = this._prefix+"listsPanel";
			this._panel.appendChild(this._listPanel);
			this._list = lib.extend.useComponent("ViewList",{
				events: {
					mouseover: function(e, model){
						this._setSelected(model);
					},
					mousedown: function(e, model){
						this.mouseItem = model.getEl();
						e.preventDefault();
						e.stopPropagation();
					},
					mouseup: function(e, model){
						if(e.which==1&&model.getEl().innerHTML==this.mouseItem.innerHTML){
		            		this.setSelected(model);
		            		this._submit();
		            	}
		                this.mouseItem = null;
					}
				},
				context: this
			});
		},
		_initListener: function(){
			this.addListener("returnData", this._renderItem, this);
			this.addListener("addData", this._renderItem, this);
			this.addListener("selected", function(model, el){
				$(el).addClass("current");
			},this);
			this.addListener("unSelected", function(model, el){
				$(el).removeClass("current");
			},this);
			this.addListener("show", this._toggleShow, this);
			this.addListener("hide", this._toggleShow, this);

		},
		_initEvents: function(){
			lib.on(document,"mousedown",function(e){
				
				/*if(this._stopPropagation){
					this._stopPropagation = false;
					return;
				}*/
				if(this._currentInput&&e.target!==this._currentInput){

					this.hide();
				}
			}.bind(this));


			lib.on(window,"resize",this._resizePanel.bind(this));

			this._initInputEvent(this._currentInput);
			
		},
		//初始化当前input的事件
		_initInputEvent: function(input){
			//移除上一个绑定的input事件
			if(this._oldEvents.currentInput){
				lib.un(this._currentInput,"input", this._oldEvents.currentInput.input);
				lib.un(this._currentInput,"keydown", this._oldEvents.currentInput.keydown);
				this._oldEvents.currentInput = null;
			}
			if(input.tagName == "INPUT"&&input.type == "text"){
				var that = this;

				this._oldEvents.currentInput = {};
				this._oldEvents.currentInput.input = function(e){
					if(that._getData&&that._currentInput.value != ""){
						that.getData(that._currentInput.value);
					}else{
						that.hide();
					}
				}
				this._oldEvents.currentInput.keydown = function(e){
					if(!that._isShow){
	                	if(e.which===40&&that._currentInput.value!==""){
	                		that.getData(that._currentInput.value);
	                		e.preventDefault();
	                	}
	                	if(e.which===13)
	                		that._submit();
	                }else{
	                	switch(e.which){
		                    case 40:
		                        that.setSelected(1);
		                        e.preventDefault();
		                    break;
		                    case 38:
		                        that.setSelected(-1);
		                        e.preventDefault();
		                    break;
		                    case 27:
		                        that.hide();
		                    break;
		                    case 13:
		                    	that.submit();
		                    break;
		                }
	                }
	                
				}
				lib.on(input,"keydown",this._oldEvents.currentInput.keydown);
				lib.on(input,"input",this._oldEvents.currentInput.input);
			}
		},
		_renderItem: function(data){
			var div = document.createElement("div");
			div.className = this._prefix+"listPanel";
			this._renderHeader(div);
			var ul = document.createElement("ul");
			ul.className = this._prefix+"list"
			var fragment = document.createDocumentFragment();
			this._list.set("render", fragment);
			if(this._formatData){

				this._list.set("format", function(data){

					var li = document.createElement("li");
					var type = lib.type.getType(this._formatData);
					data = ["number", "string"].indexOf(lib.type.getType(data)) > -1 ? {item: data} : data;
					var str = type == "object" ? this._formatData[(data.custom ? data.custom : "defaults")] : this._formatData;
					li.innerHTML = str.replace(dataFlag,function($1, $2){
						return data[$2] ? data[$2] : ($2==="query")&&(this._query);
					}.bind(this));						
        			li.className = this._prefix+"item";
        			li.setAttribute("key", this._birthKey(data));
        			return li;
				}.bind(this));

			}else{
				this._list.set("format", function(data){
					var li = document.createElement("li");

					var isArray =  lib.type.getType(data)==="array";
					var eachFn = isArray ? lib.array.each : lib.object.each;
					eachFn(data,function(key,value){
						var s = document.createElement("span");
						s.innerHTML = isArray ? key : value;
						li.appendChild(s);
					},this);
					li.className = this._prefix+"item";
					li.setAttribute("key", this._birthKey(data));
					return li;
				}.bind(this));
			}
			this._list.add(data);
			ul.appendChild(fragment);
			div.appendChild(ul);
			this._renderFooter(div);
			this._listPanel.appendChild(div);
		},
		_renderFooter: function(div){
			if(this._footer){
				var footer = document.createElement("div");
				footer.className = this._prefix+"footer";
				footer.innerHTML = this._footer;
				div.appendChild(footer);
			}
		},
		_renderHeader: function(div){
			if(this._header){
				var header = document.createElement("div");
				header.className = this._prefix+"header";
				header.innerHTML = this._header;
				div.appendChild(header);
			}
		},
		_resetList: function(){
			this._current = null;
			this._list.reset();
			this._paths = [];

			this._listPanel.innerHTML = "";
		},
		_saveToList: function(p, d){
			this._list[p] = lib.object.lightClone(d);
			this._paths.push(p);
		},
		_getDataInfo: function(d){
			var p = d.getAttribute("path");
			return {
				data: this._list[p],
				index: this._paths.indexOf(p)
			}
		},
		_getCurrentData: function(){
			var data,c;
			if(!(c = this._current))
				return {};
			data = this._getDataInfo(c).data;

			return data ? lib.object.lightClone(data) : {};
		},
		_setSelected: function(c){
			this._removeSeleted();
			if(c){
				this._current = c;
           		this.excuteEv("selected",[c.getModel(), c.getEl()]);
			}
		},
		_removeSeleted: function(){
			if(this._current===null) return;
			this.excuteEv("unSelected", [this._current.getModel(), this._current.getEl()]);
			this._current = null;
		},
		_birthKey: function(c){
			var text = "";
			if(this._key){
				var type = lib.type.getType(this._key);
				var str = type == "object" ? this._key[(c.custom ? c.custom : "defaults")] : this._key;
				text = str.replace(dataFlag,function($1, $2){
					return c[$2] ? c[$2] : ($2==="query")&&(this._query);
				}.bind(this));
				/*var keys = this._key.split(" ");
				lib.array.each(keys,function(t){
					if(t===""){
						text+=" ";
					}else if(c[t]!==null){
						text+=c[t];
					}else{
						text+=t;
					}
				}.bind(this));*/
			}else{
				lib.object.each(c,function(t,v){
					text+=v;
				});
			}
			return text;
		},
		_getKey: function(){
			if(!this._current) return this._query;
			return this._current.getEl().getAttribute("key");
		},
		_setCurrentValue: function(text){
			if(!text){
				text = this._getKey();
			}
			this._currentInput.value = text;
			this.excuteEv("setValue", [text]);
		},
		_submit: function(c){
			this.hide();
            this.excuteEv("submit",[this._currentInput.value,this._current ? this._current.getModel():{}]);
		},
		_throwError: function(ero){
			throw ero;
		},
		_toggleShow: function(){
			this._panel.style.display = this._isShow ? "" : "none";
		},
		_resizePanel: function(){
			if(this._isShow){
				lib.dom.setStyle(this._panel,{
					left: this._currentInput.offsetLeft+((this._option&&this._option.offsetLeft)||0),
					top: this._currentInput.offsetTop+this._currentInput.offsetHeight+((this._option&&this._option.offsetTop)||0),
					width: this._currentInput.offsetWidth+((this._option&&this._option.offsetWidth)||0)
				});
			}
		},
		_setOther: function(num){
			var index = this._current ? this._list.getItemIndex(this._current) : -1,
				length = this._list.getLength()+1;
			index = index + num;
			var flag = index + 1,
				currentItem = null,
				current;
			switch((current = flag%length)){
				case 0:
					
				break;
				default:
					(current < 0)&&(current = current + length);
					currentItem = this._list.getItem(current - 1);
				break;
			}

            this._setSelected(currentItem);
		},
		setSelected: function(num){
			if(typeof num === "number"){
				this._setOther(num);
			}else{
				this._setSelected(num);
			}
			this._setCurrentValue();
		},
		// 数据返回，重新设置suggestion的数据
		returnData: function(data){

			this._resetList();

			if(!this._canReceive) return;
			if(lib.type.getType(data)!=="array"){
				this._throwError("the data's type must be array!");
				return;
			}
			if(data.length <= 0){
				this.hide();
				return;
			}
			data = data.slice(0);
			this.excuteEv("returnData",[data]);
			this.show();
			this._resizePanel();

		},
		// 数据返回，向suggestion增加数据
		addData: function(data){
			if(!this._canReceive) return;
			if(lib.type.getType(data)!=="array"){
				this._throwError("the data is wrong type!");
				return;
			}
			if(data.length<=0){
				if(this._list.getLength()===0){
					this.hide();
				}
				return;
			}
			data = data.slice(0);
			this.excuteEv("addData",[data]);
		},
		show: function(){
			if(this._isShow) return;
			this._isShow = true;
			this.excuteEv("show");
		},
		hide: function(){
			this._canReceive = false;
			if(this._isShow){
				this._panel.style.display = "none";
				this._isShow = false;
			}
		},
		setCurrentInput: function(input){

			if(input == this._currentInput) return;
			this.hide();
			this._initInputEvent(input);

			this._currentInput = input;
			
		},
		setGetData: function(g){

			this._getData = g;

			this.excuteEv("setGetData", [g]);
		},
		getData: function(value){
			this._query = value;
			this._canReceive = true;
			var t = this._getData;
			if(lib.type.getType(t)==="function"){
				t.call(this,value);
			}else{
				var u=t.url,
					k=t.key,
					f=t.filter;
				if(this._needCache&&this._cache[u]&&this._cache[u][value]){
					this.returnData(this._cache[u][value]);
				}else{
					var url = lib.array.toString([u,"&",k,"=",value]);
					var that = this;
					lib.send.jsonp(url,{
			            callback: function(data){
			            	var temp = f(data);
			            	if(that._needCache){
			            		(!that._cache[u])&&(that._cache[u]={});
			            		that._cache[u][value] = temp;
			            	}
			                that.returnData(temp);
			            } 
			        });
				}
				
			}
		},
		setKey: function(key){
			this._key = key;
		},
		setFormat: function(format){
			this._formatData = format;
		},
		setFooter: function(f){
			this._footer = f;
		},
		setHeader: function(h){
			this._header = h;
		},
		submit: function(){
			this._setCurrentValue();
		    this._submit();
		},
		resetData: function(){
			this._resetList();
			this.show();
			this._resizePanel();
		},
		reset: function(){
			this._footer = null;
			this._header = null;
			this._formatData = null;
			this._getData = null;
			this._key = null;
			this._prefix = "suggestion-";
		},
		setPrefix: function(fix){
			this._prefix = "suggestion-" + (fix||"");
		},
		getCurrentInput: function(){
			return this._currentInput;
		},
		setStopPropagation: function(value){
			this._stopPropagation = value;
		},
		setCanReceive: function(value){
			this._canReceive = value;
		}
	}
	lib.object.enableEvents(sPrototype);
	var s = lib.object.inherit(null,function(arg){

		var _default = {
			_parent : document.body,
			_item : [],
			_needCache : true,
			_defaults : {},
			_paths: [],
			//this._getData = arg.getData;
	        _list  : [],
	        _autocomplete : true,
	        _oldEvents : {},
	        _canReceive : false,
	        _cache: [],
	        _currentInput: null
	        //this.stopPropagation = false;
	        //this.max = arg.max||null;
	        //this.panel = lib.g(arg.render);
		};

		var args = {};
		lib.object.each(arg, function(key, value){
			if(key == "defaults"){
				args._option = value;
				return;
			}
			args["_"+key] = value;
		});


        lib.object.extend(this, _default, args);
        this._init.apply(this, arguments);
        
	},sPrototype);
	
	lib.extend.addComponent("Suggestion",s);


})(window);