(function(){

	var lib = {
		extend: function(target, source) {
            if (source) {
                for(var prop in source) {
                    if(source.hasOwnProperty(prop)) {
                        target[prop] = source[prop];
                    }
                }
            }
            return target;
        },
        supportTextContent: !!document.body.textContent,
        content: function(dom, content){
        	lib.supportTextContent ? dom.textContent = content :
        		dom.innerHTML = content;
        	return dom;
        }
	}
	

	var events = {
        on: function(ev,fn,context){
            this.events = this.events || {};
            this.events[ev] = this.events[ev] || [];
            this.events[ev].push({
                fn: fn,
                context: context||this
            });

            if(this.events[ev].hasExcute){
                this.excute(ev, this.events[ev].hasExcute.args);
            }
        
        },
        excute: function(ev,args){

            var that = this;
            if(!that.events||!that.events[ev]){
                this.events = this.events || {};
                this.events[ev] = this.events[ev] || [];
                that.events[ev].hasExcute = {
                    args: args
                };
                //throw "no "+ev;
                return;
            }

            if(that.events[ev]){
                for(var i=0,f;f=that.events[ev][i];i++){
                    f.fn.apply(f.context||this,args||[]);//ie下第二个参数必须是数组
                }
            }
            
        }
    };

	function Pager(arg){
		this._id = 'pager_'+new Date().getTime()+''+
			Math.ceil(Math.random()*10000);
		this._init(arg);
	}
	Pager.prototype = {
		_init: function(arg){
			arg = arg||{};
			this._panel = arg.panel||document.body;
			this._count = arg.count;
			this._index = arg.index||1;
			this._itemSize = arg.size||10;
			this._pageSize = Math.ceil(this._count/this._itemSize);
			this._showSize = arg.showSize;


			var wrap = this._buildCommonPage();
			this._buildItemsPage();
			this._panel.appendChild(wrap);
		},
		_initEvent: function(){

		},
		_buildCommonPage: function(){
			var buildItem = this._buildItem,
				wrap = document.createElement('ul'),
				content = document.createElement('ul'),
				homepage = buildItem('首页', 'page-home'),
				endpage = buildItem('尾页', 'page-end'),
				prevpage = buildItem('上一页', 'page-prev'),
				nextpage = buildItem('下一页', 'page-next');

			content.className = 'page-items';

			wrap.appendChild(homepage);
			wrap.appendChild(prevpage);
			wrap.appendChild(content);
			wrap.appendChild(nextpage);
			wrap.appendChild(endpage);

			this._content = content;
			wrap.id = this._id;
			return wrap;
		},
		_buildItemsPage: function(){
			var fra = document.createDocumentFragment(),
				index = this._index,
				i=1,
				size=this._pageSize,
				showSize = this._showSize;

			// 显示所有页数 1, 没有指定折叠页数时需要展示的页数 2，展示页数大于总页数
			if(showSize===undefined||this._showSize>=size){
				this._buildNumItems(i, size, fra);
			// 显示指定页数个数，其他用省略号代替
			}else{

				// 当前页是最开始的几页
				if(index<=showSize){
					this._buildNumItems(index, showSize, fra);
					fra.appendChild(this._buildItem('...', 'page-item page-folder'));
				}else{
					fra.appendChild(this._buildItem('...', 'page-item page-folder'));
					var leftIndex = Math.ceil(index - showSize/2),
						rightIndex = showSize - leftIndex;
					this._buildNumItems( leftIndex, rightIndex, fra);
					fra.appendChild(this._buildItem('...', 'page-item page-folder'));
				}

			}

			this._content.innerHTML = '';
			this._content.appendChild(fra);
		},
		_buildNumItems: function(start, end, parent){
			var index = this._index;
			for(;start<=end;start++){
				if(start=index)
				parent.appendChild(this._buildItem(start, 
					'page-item' + ((index === start)&&('page-cur')) ));
			}
			return parent;
		},
		_buildItem: function(text, className){
			var li = document.createElement('li');
			lib.content(li, text);
			li.className = className;
			return li;
		}
	}

	lib.extend(Pager.prototype, events);

	window.Pager = Pager;

})();