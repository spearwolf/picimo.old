(function () {
    "use strict";

    module.exports = function addShaderValue ( obj ) {

        obj.setValue = function ( val ) {

            this.valueChanged = val !== this.value;

            if ( ! this.valueChanged && val.serial && val.serial !== this.valueSerial ) {

                this.valueSerial = val.serial;
                this.valueChanged = true;

            }

            this.value = val;

        };

        obj.value = null;
        obj.valueChanged = false;
        obj.valueSerial = 0;

    };

})();
