(function(){
    "use strict";

    function Queue() {

        this.entries = [];
        this.length  = 0;

    }

    module.exports = Queue;


    Queue.prototype.push = function(obj) {

        var item;

        if (this.length < this.entries.length) {

            this.entries[this.length].data = obj;

        } else {

            item = Object.create(null);
            item.data = obj;

            this.entries.push(item);
        }

        ++this.length;

    };

    Queue.prototype.pop = function() {

        var item, obj;

        if (this.length > 0) {

            --this.length;

            item      = this.entries[this.length];
            obj       = item.data;
            item.data = null;

            return obj;

        }

    };

    Queue.prototype.clear = function() {

        var i = this.length;
        for (; i--;) {
            this.entries[i].data = null;
        }

        this.length = 0;

    };

    Queue.prototype.forEach = function(fn) {

        var len = this.length;
        var i, item;

        for (i = 0; i < len; i++) {
            item = this.entries[i].data;
            if (item != null) fn.call(item, item);
        }

    };

})();
