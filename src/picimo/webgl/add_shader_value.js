(function(){
    "use strict";

    module.exports = function addShaderValue ( obj ) {

        obj.setValue = function ( val ) {

            this.valueChanged = val !== this.value;
            this.value = val;

        };

        obj.value = null;
        obj.valueChanged = false;

    };

})();
