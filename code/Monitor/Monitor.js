(function(){
    function Monitor(arg){
        arg = arg||{};
        this._id = 'monitor_'+new Date().getTime()+''+ Math.ceil(Math.random()*10000);
        this._render = arg.render||document.body;
        this._log = [];

        this._init();
    }
    Monitor.prototype={
        _defaultEvents: {},
        _init: function(arg){
            this._tpl = arg.tpl||'<p class="<%type%>"><%time%>：<%data%></p>';
            this._activeEvents = arg.active||[];
            if(typeof this._activeEvents !== 'array'){
                this._activeEvents = [this._activeEvents];
            }
            this._activeCatch = arg.errorCatch;

           this._initEvent();
        },
        _initEvent: function(){
            var defaultEvents = this._defaultEvents;
            for(var ev in defaultEvents){
                if(defaultEvents.hasOwnProperty(ev)&&this._activeEvents.indexOf(ev) > -1){
                    defaultEvents[ev](this);
                }
            }
        },
        _buildPanel: function(){
            var _panel = document.createElement('div'),
                id = this._id;
            while(document.getElementById(id)){
                id = 'monitor_'+new Date().getTime()+''+Math.random()*10000;
                this._id = id;
            }
            _panel.id = id;
            _panel.dataRole = 'monitor';
            _panel.style.cssText = 'position: fixed;top: 0;bottom: 0;left: 0;right: 0;background-color: rgba(102, 51, 153, 1);z-index: 9999;overflow-y: auto;color: rgb(255, 255, 255);font-size: 16px;line-height: 30px;padding: 10px; display:none;'
            this._panel = _panel;
            this._content = document.createElement('div');

            this._buildClose();
            this._panel.appendChild(this._content);
            this._render.appendChild(this._panel);

        },
        _buildClose: function(){
            var close = document.createElement('button');
            close.style.cssText = 'position: absolute;right: 10px;top: 10px; width: 30px;height: 30px;padding: 0;background: none;border: none;color: white;font-size: 24px;';
            close.textContent = 'X';

            close.onclick = this.hide.bind(this);
            this._panel.appendChild(close);
        },
        _addLog: function(type, data){
            var logData = {
                type: type,
                time: this._dateFormat('hh:mm:ss'),
                data: data
            }
            this._log.push(logData);
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
        _buildLog: function(){
            var str = [],
                tpl = this._tpl,
                panel = document.getElementById(this._id);
            this._log.forEach(function(log){
                str.push(tpl.replace(/<%(\w+)%>/g, function($0, $1){
                    return log[$1]||$1;
                }));
            });
            if(!panel||!panel.dataRole||panel.dataRole!=='monitor'){
                this._buildPanel();
            }
            this._content.innerHTML = str.join('');
        },
        show: function(){
            this._buildLog();
            this._panel.style.display='';
        },
        hide: function(){
            this._content.innerHTML = '';
            this._panel.style.display = 'none';
        },
        log: function(data){
            this._addLog('log', data);
        },
        error: function(){
            this._addLog('error', data);
        }
    }
    Monitor.addEvent = function(ev, fn){
        Monitor.prototype._defaultEvents[ev] = fn;
    }
    Monitor.addEvent('click10', function(monitor){
        var num = 0,
            timer;
        window.onclick = function(){ 
            num++; 
            console.log(num); 
            if(num==10){
                monitor.show();
                num=0
            } ; 
            if(timer){
                return;
            }
            timer = setTimeout(function(){
                clearTimeout(timer);
                timer = null;
                num=0
            }, 3000) 
        }
    });

    window.Monitor = Monitor;

})();