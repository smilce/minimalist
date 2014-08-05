define(function (){


    /*function sum(){
        var _nums = [];
        var _sum = function(){
            var args = _nums.slice(0).concat(Array.prototype.slice.call(arguments));
            return sum.apply(args, args);
        }
        _nums.push.apply(_nums, Array.prototype.slice.call(arguments));
        _sum.toString = function(){
            return _nums.reduce(function(prev, arg){
                return prev+arg;
            }, 0)
        }
        return _sum;
    }*/

    var browserConsole = window.console;



    var


    document = window.document,
    location = window.location,

    push = Array.prototype.push,
    splice = Array.prototype.splice,
    slice = Array.prototype.slice,
    indexOf = Array.prototype.indexOf,

    toString = {}.toString,
    hasOwn = {}.hasOwnProperty;

    Array.prototype.forEach = Array.prototype.forEach || function(fn){
        for (var i = 0, len = this.length; i < len; i++) {
            fn(this[i], i);
        }
    }
    Array.prototype.indexOf = Array.prototype.indexOf || function(item) {
        for (var i = 0, len = this.length; i < len; i++) {
            if (this[i] === item)
                return i;
        }
        return -1;
    }
    Array.prototype.map = Array.prototype.map || function(fn) {
        var arr = [];
        for (var i = 0, len = this.length; i < len; i++) {
            arr.push(fn(this[i], i));
        }
        return arr;
    }
    Function.prototype.bind = Function.prototype.bind || function(context){
        var that = this;
        return function(){
            that.call(context);
        }
    }


	var lib = {};
    lib.isIE = navigator.userAgent.indexOf("MSIE")>0
    lib.event = {};
    lib.event.on = lib.on = function(el,ev,fn){
        el = this.dom.g(el);
        if (el.addEventListener) {
            el.addEventListener(ev, fn, false);
        } else if (el.attachEvent) {
            el.attachEvent('on' + ev, function(){
                fn.call(el);
            });
        }
        
        
        return el;
    }

    /*function $(id){
        return new _init(id); 
    }
    function _init(id){
        this._el = document.getElementById(id.replace('#', ''));
    }
    _init.prototype.val = function() {
        return this._el.value;
    };
    _init.prototype.on = function(ev, fn){
        var el = this._el;
        if (el.addEventListener) {
            el.addEventListener(ev, fn, false);
        } else if (el.attachEvent) {
            el.attachEvent('on' + ev, function(){
                fn.call(el);
            });
        }
        
        return this;
    }
    _init.prototype.click = function(fn){
        return this.on('click', fn);
    }*/

	lib.event.un = lib.un = function(el,ev,fn){
        el = lib.dom.g(el);
        el.removeEventListener(ev, fn, false);
        return el;
    }
    lib.event.onSome = function(el, evs, fn){
        var lib = window.lib,
            el = lib.g(el),
            type = lib.getType(evs);
        //todo if el is node
        if(type === 'string'){
            lib.on(el, evs, fn);
        }else if(type === 'array'){
            lib.each(evs, function(ev){
                lib.on(el, ev, fn);
            });
        }else{
            throw 'you provide error arguments'
        }
    }
    lib.event.domStopDefault = lib.domStopDefault = function(el, ev){
        lib.event.onSome(el, ev, function(e){
            e.preventDefault();
        })
    }
    lib.dom = {};
    lib.dom.g = lib.g = function(el){               
        if(typeof el == "string") return document.getElementById(el);           
        return el;
    }
    lib.dom.getCurrentStyle = function(el,key){
      key = key.replace (/([A-Z])/g, "-$1");
      key = key.toLowerCase();
      return document.defaultView.getComputedStyle(el,null)[key];
    }
    lib.dom.show = lib.show = function(el){
        el = this.g(el);
        el.style.display="";
    }
    lib.dom.hide = lib.hide = function(el){
        el = this.g(el);
        el.style.display="none";
    }
    lib.dom.addClass = function(dom, name){
        /*var names = dom.classList;
        names.add(name);*/
        $(dom).addClass(name);
    }
    lib.dom.removeClass = function(dom, name){
        /*var names = dom.classList;
        names.remove(name);*/
        $(dom).removeClass(name);
    }
    lib.dom.hasClass = function(dom,classname){
        dom = lib.g(dom);
        return dom.className.indexOf(classname) > -1 ? true : false;
    }
    lib.dom.toggleClass = function(dom,classname){
        dom = lib.g(dom);
        var names = dom.className;
        (!names) && (names = "");
        if(lib.dom.hasClass(dom,classname)){
            var n = names.split(" ");
            n.pop();
            dom.className = n.join(" ");
        }else{
            dom.setAttribute("className", (dom.getAttribute("className")||"") + " " + classname)
        }
    }
    lib.dom.setHtml = function(dom, c){
        c.nodeType ? (dom.innerHTML = "", dom.appendChild(c)) : dom.innerHTML = c;
    }
    lib.dom.getAbsPos = function(dom){
        return {
            left: dom.getBoundingClientRect().left + document.body.scrollLeft,
            top: dom.getBoundingClientRect().top + document.body.scrollTop
        }
    }
    /*
    **  获取一段字符串在font-size为12px下，在dom中的宽度
    */
   
    lib.dom.getStringWidth = function(str){
        var helper = arguments.callee.helper;
        if(!helper){
            helper = arguments.callee.helper = document.createElement("span");
            lib.dom.setStyle(helper, {
                position: "absolute",
                left: "-9999px"
            });
            document.body.appendChild(helper)
        }
        helper.innerHTML = String(str)
                .replace(/&/g,'&amp;')
                .replace(/</g,'&lt;')
                .replace(/>/g,'&gt;')
                .replace(/"/g, "&quot;")
                .replace(/'/g, "&#39;");
        return helper.offsetWidth;
    }
    lib.dom.str2html = function(str, tag){

    }
    
    lib.number = {};
    lib.number.IsNum = function (e) {
        var k = window.event ? e.keyCode : e.which;
        if (((k >= 48) && (k <= 57)) || k == 8 || k == 0) {
        } else {
            if (window.event) {
                window.event.returnValue = false;
            }
            else {
                e.preventDefault(); //for firefox 
            }
        }
    } 

    lib.date = {};
    lib.date.getDate = function(count, date){
        /*var newDate = new Date(); 
        if(date){
            newDate.setDate(date.getDate()+count);
        }else{
            newDate.setDate(newDate.getDate()+count);
        }*/
        if(!date) date = new Date();
        var y,m,d;
            y = date.getFullYear();
            m = date.getMonth();
            d = date.getDate()+count;
            if(d == 0){
                d = 31;
                m = m - 1;
            }
        var newDate = new Date(y, m, d);

        return newDate;
    }
    lib.dom.scanParent = function(element, scaner){
        if (!element || !scaner) return;
        while (element) {
            if (scaner(element)) return true;
            element = element.parentNode;
        }
    }
    lib.dom.prefix = ["left","top","bottom","right","width","height"];
    lib.dom.setStyle = function(dom,atrs){
        dom = lib.g(dom);
        var oldStyle = dom.getAttribute("style");
        var text = "";
        lib.object.each(atrs,function(key,value){
            text = lib.array.toString([text,key,":",value, 
                (lib.array.has(lib.dom.prefix, key)&&/^-{0,1}\d*\.*\d*$/.test(value)) ? "px;" : ";"]);
        });
        dom.style.cssText = oldStyle ? oldStyle + text : text;
    }
    lib.localData = {};
    lib.localData.getData = function(key){
        var data = window.localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    }
    lib.localData.setData = function(key, value){
        var data = window.localStorage.setItem(key, JSON.stringify(value));
    }
    lib.send = {};
    lib.send.ajax = function(url){
        var xhr = new XMLHttpRequest(); // note: IE never uses XHR (it supports true preloading), so no more need for ActiveXObject fallback for IE <= 7
        var promiseFn = [];
        var promise = {
            then: function(fn,context){
                promiseFn.push({
                    fn: fn,
                    context: context
                });
            }
        };
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4) {
                xhr.onreadystatechange = function(){}; // fix a memory leak in IE
                var data = JSON.parse(xhr.responseText);
                promiseFn.forEach(function(item){
                    item.fn.call(item.context, data);
                });
                promise = null;
                context = null;
                xhr = null;
                promiseFn = null;
            }
        };
        xhr.open("GET",url);
        xhr.send();
        return promise;
    }
    lib.send.jsonp = function(url,arg){
        var script = document.createElement("script");
        if(!arg.onlySend){
            var receiver = arg.receiver ? arg.receiver : "callback" + new Date().getTime().toString();
            var receiverFlag = arg.receiverFlag || "callback";
            var callback = arg.callback||null;
            window[receiver] = function(data){
                window[receiver] = null;
                callback&&callback(data);
            }
            if(arg.charset){
                script.setAttribute("charset",arg.charset);
            }
            script.src = url+"&"+receiverFlag+"="+receiver;
        }else{
            script.src = url;
        }           
        
        script.onload = script.onreadystatechange = function() {
            if ((script.readyState && script.readyState != "complete" && script.readyState != "loaded")) return;
            script.onload = script.onreadystatechange = null;
            document.body.removeChild(script);
        };
        //homepage "http://suggestion.baidu.com/su?p=3&cb=getDate&wd=åˆ?;
        //tieba http://tieba.baidu.com/sug?query=%E4%B9%B3&_=1368115379385&callback=getDate
        // zhidao http://nssug.baidu.com/su?wd=åˆ?prod=zhidao&t=1368115749867
        //image http://nssug.baidu.com/su?wd=1&ie=utf-8&prod=image&t=0.5681813715491444&callback=getDate
        // video http://nssug.baidu.com/su?wd=åˆ?prod=video_ala&oe=utf-8&t=0.49744463502429426
        // news http://nssug.baidu.com/su?wd=zhang'yi'mou&prod=news&t=1368280119775
        // map http://map.baidu.com/su?wd=%E9%BE%99&cid=131&type=0&newmap=1

        document.body.appendChild(script)
    }
    var GB2312UnicodeConverter = {
        ToUnicode: function (str) {
            return escape(str).toLocaleLowerCase().replace(/%u/gi, '\\u');
        }
        , ToGB2312: function (str) {
            return unescape(str.replace(/\\u/gi, '%u'));
        }
    };
    lib.type = {};
    lib.type.isBaiduBrowser = window.navigator.userAgent.indexOf("BIDUBrowser")>-1?true:false;
    lib.type.getType = lib.getType = function(c){
        var t = Object.prototype.toString.call(c);
        return t.substring(8,t.length -1).toLowerCase(); 
    }

    function each(obj, iterator, context){
        obj.forEach(iterator, context);
    }

    lib.array={};
    lib.array.each=function(obj, iterator, context){
        each(obj, iterator, context);
    }
    lib.array.has=function(obj, value){
        return obj.indexOf(value) > -1 ? true : false;
    }
    lib.array.toString=function(arg){
        return arg.join("");
    }
    lib.array.o2t=function(arr, number){
        var 
            list = [],
            l;

        while((l = arr.splice(0,number)).length>0){
            list.push(l);
        }

        return list;
    };
    lib.array.many = function(fn, start, num){
        for(var i=start,end=start+num;i<end;i++){
            fn();
        }
    }
    /* 判断两个数组是否完全相同，即长度相同，每一项也都相同
    * @left 
    * @right
    */
    lib.array.isSame = function(left, right){
        if(!left||!right){
            throw "you must provide two array."
        }
        var len,l,r,c,index;
        if((l = left.length)!==right.length){
            return false;
        }
        l = left.slice(0), r = right.slice(0), c = l.shift();
        while(c){
            if((index = r.indexOf(c)) < 0){ 
                return false;
            }else{
                r.splice(index, 1);
                c=l.shift();
            }
        }
        if(l.length===0&&r.length===0){
            return true;
        }
        return false;
    }
    lib.array.toArray = function(array){
        return  Array.prototype.slice.apply(array, []);
    }
    lib.array.iterator = function(num, fn){
        var i = 0;
        for(;i++<num;){
            fn(i);
        }
    }
    lib.array.zip = function(){
        var result = [],
            len = Number.MAX_VALUE,
            arrs = lib.array.toArray(arguments),
            arrNum = arrs.length;
        lib.each(arrs, function(index, item){
            if(item.length < len) len = item.length;
        });
        lib.array.iterator(len, function(i){
            var arr = [];
            lib.array.iterator(arrNum, function(j){
                arr.push(arrs[j][i]);
            });
            result.push(arr);
        })
        return result;
    }
    
    function Founder(arg){
        this.author = "minoliu";
        this.version = "0.0.0.0";
        this.web = (arg&&arg.web)||"http://www.snowmino.com";

    }
    Founder.prototype = {
        constructor: Founder
    }

    lib.object = {};
    lib.object.Events = {
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

            if(this.events[ev].hasExcute){
                this.excuteEv(ev, this.events[ev].hasExcute.args);
            }
        },
        excuteEv: function(ev,args){

            var that = this;
            if(!that.events||!that.events[ev]){
                //throw "no "+ev;
                return;
            }
            if(that.events[ev]){
                for(var i=0,f;f=that.events[ev][i];i++){
                    f.fn.apply(f.context||this,args||[]);
                }
            }

            that.events[ev].hasExcute = {
                args: args
            };
        }
    }
    lib.object.each = function(obj, iterator, context){
        for(var o in obj){
            iterator.call(context, o, obj[o]);
        }
    };
    lib.object.hasValue = function(obj, value){
        for(var o in obj){
            if(obj.hasOwnProperty(o)&&obj[o] === value){
                return true;
            }
        }
        return false;
    };
    lib.object.extend = function(obj){
        each(slice.call(arguments, 1),function(source){
            for(var prop in source){
                obj[prop] = source[prop];
            }
        }); 
        return obj;
    };
    lib.object.inherit = function (parent, context, protoProps){
        parent = parent || Founder;
        var child = function(){
            context.apply(this, arguments);
            parent.apply(this, arguments);
        }
        var empty = function(){this.constructor = child};
        empty.prototype = parent.prototype;
        child.prototype = new empty;

        if(protoProps) lib.object.extend(child.prototype, protoProps);

        child.__super__ = parent.prototype;

        return child;
    }
    lib.object.enableEvents = function(c){
        lib.object.extend(c, lib.object.Events);
    }
    lib.object.set = function(obj, key, value, prefix, callback){
        var arr = {};
        if(lib.type.getType(key) === "object"){
            arr = key;
        }else{
            arr[key] = value;
        }
        lib.object.each(arr,function(key,value){
            obj[key] = value;
        });
        callback&&callback(arr);
    }
    lib.object.createAfter = function(){

        return Object.create(lib.object.createAfter.prototype, {
            events: {
                value: [],
                writable: true,
                configurable: true,
                enumerable: true
            }
        });
    }
    lib.object.createAfter.prototype = {
        add: function(event, content){
            this.events.push({
                event: event,
                content: content||arguments.callee.caller
            });
        },
        fire: function(){
            var arg = arguments;
            this.events.forEach(function(data){
                data.event.apply(data.content, arg);
            });
        }
    }
    lib.canEach = ['array','object'];
    lib.each = function(obj, iterator, context){
        var type = lib.getType(obj);
        if(lib.canEach.indexOf(type) < 0){
            if(obj.length!==undefined){
                obj = lib.array.toArray(obj);
                type = 'array';
            }else{
                throw "the first arguments can't be eached , please change it"
            }
        }
        lib[type].each(obj, iterator, context);
    }

    lib.extend = {};
    lib.extend.components = {};
    lib.extend.addComponent = function(name, fn){
        lib.extend.components[name] = fn;
    }
    lib.extend.useComponent = function(name, args){
        return new lib.extend.components[name](args);
    }
    lib.string = lib.string || {};
    lib.string.getRandomHan = function(start, end){
        var num = Math.round(Math.random()*(end - start)) + start,
            result="";
        while(num){
            result += "%u" + (Math.round(Math.random()*20923) + 19968).toString(16);
            num --;
        }
        return unescape(result);
    }

    lib.string.getRandomWord = function(start, end){
        var num = Math.round(Math.random()*(end - start)) + start,
            result="";
        while(num){
            result += String.fromCharCode(Math.round(Math.random()*25) + 97);
            num --;
        }
        return result;
    }
    lib.string.encodeHTML = function(str){
        return String(str)
                .replace(/&/g,'&amp;')
                .replace(/</g,'&lt;')
                .replace(/>/g,'&gt;')
                .replace(/"/g, "&quot;")
                .replace(/'/g, "&#39;");
    }
    lib.string.toUpperCase  = function(str, num){
        return str.substring(0,1).toUpperCase()+str.substring(1)
    }
    lib.querystring = {};
    lib.querystring.stringify = function(obj){
        var str = "";
        lib.each(obj, function(key, value){
            str  = str + key + "=" + value + "&";
        });
        str = str.substring(0, str.length-1);
        return str;
    }
    var path = 0;
    lib.uniquePath = function(prefix) {
        var id = path++;
        return prefix ? prefix + id : id;
    };
    lib.noConflictId = function(prefix){
        var id = (prefix||"noConflict") + new Date().getTime();
        if(lib.g(id))
            return lib.noConflictId(prefix);
        return id;
    }
    lib.radix = {
        dic: (function(){
            var dic = [];
            for(var i=0;i<36;i++){ dic[i] = i<10 ? i :  String.fromCharCode(i+87)}
            return dic;
        })(),
        // 获取36进制数
        get36: function(num) {
            if(num===0){
                return this.dic[num];
            }
            var result = [];
            while (num >= 1) {
                result.unshift(this.dic[num % 36]);
                num = Math.floor(num / 36)
            }
            return result.join("");
        }
    }
    function define(tagNameOrFunction) {
        var createFunction, tagName;
        if (typeof tagNameOrFunction == 'function') {
          createFunction = tagNameOrFunction;
          tagName = '';
        } else {
          createFunction = document.createElement;
          tagName = tagNameOrFunction;
        }

        function f() {
          var el = document.createElement(tagName);
          f.decorate(el);
          
          return el;
        }

        f.decorate = function(el) {
          el.__proto__ = f.prototype;
          el.decorate();
        };

        return f;
    }
    lib.define = define;
    function Item(arg){
        this._el = arg.el;
        this._data = arg.data;
        this._events = arg.events;
        this._context = arg.context;
        this._init();
    }
    Item.prototype = {
        _init: function(){
            var el = this._el,
                context = this._context,
                that = this;
            lib.object.each(this._events, function(ev, fn){
                lib.on(el, ev, function(){
                    var a = Array.prototype.slice.call(arguments);
                    a.push(that);
                    fn.apply(context, a);
                });
            });
        },
        getModel: function(){
            return this._data;
        },
        getEl: function(){
            return this._el;
        }
    }

    lib.extend.addComponent("Item", Item);

    lib.extension = {};
    lib.extension.tabpage = {};
    lib.extension.tabpage.addCustom = function(item){
        var showUrl = item.url.match(/http[s]*:\/\/([^\?\/\#]+)[\?\/\#]/);
        showUrl = showUrl ? showUrl[1] : item.url.replace(/http[s]*\:\/\//, "");
        var hasTitle = item.title = item.title||showUrl;
        item.fontSize = lib.dom.getStringWidth(hasTitle) < 100 ? "big" : "normal";
        item.customTitle = lib.string.encodeHTML(hasTitle).replace(/([\u4e00-\u9fa5]+)/g, "<span class='chinese'> $1</span>");
    }

    lib.url = {};
    lib.url.getProtocol = function(value){
        value = value.match(/^(\w+):\/\//);
        return value ? value[1] : "http";
    }
    lib.url.simplify = function(url){
        return url.replace(/\/$/,"").replace(/(\w+\:\/\/)?(www\.)?/,"");
    }
    lib.url.isSame = function(a, b){
        return (lib.url.getProtocol(a)===lib.url.getProtocol(b))&&
                (lib.url.simplify(a) === lib.url.simplify(b));
    }
    lib.path = {};
    lib.path.extname = function(path){
        var pos=path.lastIndexOf(".");
        return pos > -1 ? path.substring(pos+1) : '';
    }

    window.lib = lib;

    return lib;

});
