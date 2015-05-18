(function  () {

	var _proto = {
		_init: function(){
			
			this._dateNumberInMonth = {
				1: 31,
				3: 31,
				5: 31,
				7: 31,
				8: 31,
				10: 31,
				12: 31,
				4: 30,
				6: 30,
				9: 30,
				11: 30
			};
			this._resetDate();
		},
		_resetDate: function(){
			var _curDate = this._curDate,
				_curMonth = _curDate.getMonth(),
				_helpDate = new Date(_curDate),
				_dateDatas = this._dateDatas = [],
				_dateNumberInMonth = this._dateNumberInMonth;
			this._dateNumberInMonth[2] = _curDate.getFullYear()%4===0 ? 29 : 28;

			var i=0,len=0;

			_helpDate.setDate(1);
			len = _helpDate.getDay() - 1;
			len = len >= this._firstDay ? len - this._firstDay : len + (7 - this._firstDay);
			len--;
			_helpDate.setMonth(_curMonth-1);
			var prevMonth = _curMonth===0?12:_curMonth,
				preLastDate = _dateNumberInMonth[prevMonth];
			while(len>-1){
				_helpDate.setDate(preLastDate - len);
				_dateDatas.push({
				//	id: this._dateFormat('yyyyMMdd', _helpDate),
				//	text: preLastDate - len,
				});
				len--;
			}

			// 本月所有天数
			var curDaysNumber = _dateNumberInMonth[_curMonth+1];
			_helpDate = new Date();
			_helpDate.setMonth(_curMonth);
			for(i=0;i<curDaysNumber;i++){
				_helpDate.setDate(i+1);
				_dateDatas.push({
					id: this._dateFormat('yyyyMMdd', _helpDate),
					text: i+1
				});
			}

			// 用下个月的前几天补全日历中最后可能空缺的那几天
			len = (7 - _dateDatas.length%7)%7;
			_helpDate = new Date();
			_helpDate.setMonth(_curMonth+1);
			for(i=1;i<=len;i++){
				_helpDate.setDate(i);
				_dateDatas.push({
				//	id: this._dateFormat('yyyyMMdd', _helpDate),
				//	text: i
				});
			}


			
			this.excute('reset', [this._curDate, this._checkFutureLimit()]);

			this.reRender();
		},
		_checkFutureLimit: function(){
			var overflowLimit = [],
				curDate = new Date(this._curDate),
				prevCheck,nextCheck;

			curDate.setMonth(curDate.getMonth() - 1);
			prevCheck = this._checkLimit(curDate);

			curDate.setMonth(curDate.getMonth() + 2);
			nextCheck = this._checkLimit(curDate);

			overflowLimit.push.apply(overflowLimit, prevCheck);
			overflowLimit.push.apply(overflowLimit, nextCheck);

			return overflowLimit;
		},
		_checkLimit: function(curDate){
			var overflowLimit = [];
			if(this._limit&&this._limit.month){
				var minMonth = this._limit.month[0],
					maxMonth = this._limit.month[1],
					curDate = curDate||this._curDate,
					now = new Date();

				if(now.getMonth()+(now.getFullYear()-curDate.getFullYear())*12 -  curDate.getMonth() >= minMonth){
					overflowLimit.push('overflowMin');
				}

				if(curDate.getMonth()+(curDate.getFullYear()-now.getFullYear())*12 -  now.getMonth() > maxMonth){
					overflowLimit.push('overflowMax');
				}
			}
			return overflowLimit;
		},
		_dateFormat: function(format, date){
		    if(!date){
		      date = new Date();
		    }
		    var o = {
		    "M+" : date.getMonth()+1, //month
		    "d+" : date.getDate(), //day
		    "h+" : date.getHours(), //hour
		    "m+" : date.getMinutes(), //minute
		    "s+" : date.getSeconds(), //second
		    "q+" : Math.floor((date.getMonth()+3)/3), //quarter
		    "S" : date.getMilliseconds() //millisecond
		    }
		    if(/(y+)/.test(format)) format=format.replace(RegExp.$1,
		    (date.getFullYear()+"").substr(4- RegExp.$1.length));
		    for(var k in o)if(new RegExp("("+ k +")").test(format))
		    format = format.replace(RegExp.$1,
		    RegExp.$1.length==1? o[k] :
		    ("00"+ o[k]).substr((""+ o[k]).length));
		    return format;
		},
		_initEvent: function(){
			var that = this;
			this._panel.addEventListener('click', function(e){
				var dateItem = e.target;
				while(dateItem&&dateItem!==this){
					if(dateItem.getAttribute('date-type')){
						that.excute('selected', [dateItem.id]);
						break;
					}
					dateItem = dateItem.parentNode;
				}
			}, false)
		},
		reRender: function(){
			var _dateDatas = this._dateDatas,
				i=0,len=_dateDatas.length;

			if(this._render){
				if(!this._panel){
					var table = document.createElement('table'),
						tHeader = document.createElement('thead'),
						tBody = document.createElement('tBody'),
						fra = document.createDocumentFragment(),
						header = this._header,
						panelHeader = document.createElement('tr');
					header.forEach(function(h,index){
						panelHeader.innerHTML += '<td>' + h + '</td>';
					});

					tHeader.appendChild(panelHeader);
					fra.appendChild(tHeader);
					fra.appendChild(tBody);

					this._panel = tBody;
					table.appendChild(fra);
					this._render.appendChild(table);

					this._initEvent();

				}

				var panel = this._panel,
					fra = document.createDocumentFragment();
				for(i=0;i<len;i+=7){
					var tr = document.createElement('tr'),
						str = '',
						dateTpl = this._dateTpl;
					_dateDatas.slice(i,i+7).forEach(function(d){
						str += d.id ? '<td id='+d.id+' date-type=date-item>' + dateTpl(d) + '</td>' : '<td></td>' ;
					});
					tr.innerHTML = str;
					fra.appendChild(tr);
				}
				panel.innerHTML = '';
				panel.appendChild(fra);
				
			}
		},
		setMonth: function(month){
			var oldMonth = this._curDate.getMonth();
			month = month -1;
			this._curDate.setMonth(month);
			if(this._checkLimit().length>0){
				this._curDate.setMonth(oldMonth);
				return;
			}
			this._resetDate();
		},
		nextMonth: function(){
			this.setMonth(this._curDate.getMonth()+2);
		},
		prevMonth: function(){
			this.setMonth(this._curDate.getMonth());
		},
		getMonth: function(){
			return this._curDate.getMonth()+1;
		},

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
	}

	function Calender(arg){
		arg = arg||{};
		this._curDate = arg.curDate||new Date();
		this._dateDatas = [];
		this._header = ['一','二','三','四','五','六','日'];
		// 每周的第一天为周几
		this._firstDay = 7 - 1;
		this._limit = {
			month: [6, 0]
		}
		this._render = arg.render;
		this._header.unshift.apply(this._header, this._header.splice(this._firstDay));
		this._dateTpl = arg.dateTpl;

		this._init();
	}

	Calender.prototype = _proto;

	window.Calender = Calender;

})();