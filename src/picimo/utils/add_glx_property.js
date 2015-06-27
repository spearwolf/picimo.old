(function(){
    "use strict";

    module.exports = function addGlxProperty(obj) {

        Object.defineProperties(
            obj, {
                glx: {
                    set: function(glx) {
                        this._glx = glx;
                        Object.defineProperty(this, 'gl', {
                            value: ( typeof glx === 'object' ? glx.gl : undefined ),
                            enumerable: true,
                            configurable: true
                        });
                    },
                    get: function() {
                        return this._glx;
                    },
                    enumerable: true
                }
            });
    };

    module.exports.addGlxProperty = module.exports;

})();
