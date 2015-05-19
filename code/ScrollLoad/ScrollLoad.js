(function() {

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

    function ScrollLoad(arg) {
        arg = arg || {};
        this._panel = arg.panel || document.body;
        this._furValue = arg.furValue || 100;
        this._lock = false;

        this._init();
    }
    ScrollLoad.prototype = {
        _init: function() {
            this._initEvent();
        },
        _initEvent: function() {
            var panel = this._panel,
            that = this;
            panel.onscroll = function() {
                if (document.documentElement.clientHeight + panel.scrollTop + that._furValue >= panel.scrollHeight && !that._lock) {
                    that._lock = true;
                    that.excute('load');

                    setTimeout(function() {
                        that.enabled();
                    },
                    2000);
                }
            }
        },
        enabled: function() {
            this._lock = false;
        }
    }

    lib.enableEvents(ScrollLoad.prototype);

    window.ScrollLoad = ScrollLoad;

})();