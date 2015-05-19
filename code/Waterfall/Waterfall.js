(function(){

	 // @import lib
    var lib = {
        extend: function(target, source) {
            if (source) {
                for (var prop in source) {
                    if (source.hasOwnProperty(prop)) {
                        target[prop] = source[prop];
                    }
                }
            }
            return target;
        },
        enableEvents: function(obj){
            lib.extend(obj, lib.Events);
        },
        Events: {
            on: function(ev, fn, context) {
                this.events = this.events || {};
                this.events[ev] = this.events[ev] || [];
                this.events[ev].push({
                    fn: fn,
                    context: context || this
                });

                if (this.events[ev].hasExcute) {
                    this.excute(ev, this.events[ev].hasExcute.args);
                }

            },
            excute: function(ev, args) {

                var that = this;
                if (!that.events || !that.events[ev]) {
                    this.events = this.events || {};
                    this.events[ev] = this.events[ev] || [];
                    that.events[ev].hasExcute = {
                        args: args
                    };
                    return;
                }

                if (that.events[ev]) {
                    for (var i = 0,
                    f; f = that.events[ev][i]; i++) {
                        f.fn.apply(f.context || this, args || []); //ie下第二个参数必须是数组
                    }
                }

            }
        }
    }

	/* 瀑布流组件
	*/
	function Waterfall(arg){
		arg = arg||{};

		// 已经加载的dom，稳定的，不会变化
		this._loadedItems = [];
		// 当前加载到第几个数据
		this._index = 0;
		// 存储每个元素的位置信息等，会动态变化
		this._posItems = [];

		this._init(arg);

	}
	Waterfall.prototype = {
		_init: function(arg){
			this._panel= arg.render||document.body;
			this._width = arg.width||230;
			this._marginWidth = arg.marginWidth||0;
			this._marginHeight = arg.marginHeight||0;	
			this._tpl = arg.tpl;
			this._resetCalVal();
			if(arg.data){
				this.addData(arg.data);
			}

			//this._initEvent();
		},
		_resetCalVal: function(){
			this._panelWidth = this._panel.scrollWidth;
			this._num = Math.floor((this._panelWidth - this._width)/
				(this._width + this._marginWidth)) + 1;
		},
		_initEvent: function(){
			var timer = null,
				that = this;
			this._panel.onresize =function(){
				console.log(12)
				if(!timer){
					timer = setTimeout(function(){
						that.resetPanelView();
						clearTimeout(timer);
						timer = null;
					},300);
				}
				
			}
		},
		_toDom: function(str){
			var helper = document.createElement('div'),
				eleType = helper.ELEMENT_NODE,
				dom;
			helper.innerHTML = str;
			dom = helper.firstChild;
			while(dom&&dom.nodeType!==eleType){
				dom = dom.nextSibling;
			}
			return dom
		},
		_buildItem: function(data){

			var item = this._toDom(this._tpl.replace(/<%(\w+)%>/g, function($0, $1){
				return data[$1]||$1;
			}));

			this._panel.appendChild(item);
			this._loadedItems.push(item);

			this._resetItemPos(item);
		},
		_resetItemPos: function(item){
			var current = 0,
				posItems = this._posItems;	//应该放在哪一列
			if(posItems.length<this._num){
				current = posItems.length;
			}else{
				posItems.forEach(function(item, index){
					if(posItems[current].bottom > item.bottom){
						current = index;
					}
				});
			}
			
			(!posItems[current])&&(posItems[current]={bottom:0});
			(!posItems[current].items)&&(posItems[current].items=[]);
			item.style.top = 
				posItems[current].bottom + "px";

			item.style.left = 
				current* (this._width + this._marginWidth) + "px";
			posItems[current].items.push(item);

			posItems[current].bottom=
				posItems[current].bottom+ item.offsetHeight;
		},

		addData: function(data){
			var that = this;
			data.forEach(function(d, index){
				that._buildItem(d);
				
			});
		},
		resetPanelView: function(){
			this._resetCalVal();
			this._posItems = [];

			this._resetItemPos();
		}
	}


	lib.enableEvents(Waterfall.prototype);
	window.Waterfall = Waterfall;

})();