(function(){
    "use strict";

    function ObjectPool(createObject) {

        this._createObject = createObject ? createObject : function() { return {}; };
        
        this.objects    = [];
        this.inUseCount = 0;
    }

    module.exports = ObjectPool;


    ObjectPool.prototype.create = function() {

        var obj;

        if (this.inUseCount < this.objects.length) {
        
            obj = this.objects[this.inUseCount]; 

        } else {

            obj = this._createObject();
            this.objects.push(obj);
        }

        ++this.inUseCount;

        return obj;
    };

    ObjectPool.prototype.releaseAll = function() {
        this.inUseCount = 0;
    };

})();
