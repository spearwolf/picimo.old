(function () {
    "use strict";

    module.exports = function addShaderValue ( obj ) {

        obj.setValue = function ( val, debug ) {

            var hasSerial = val.serial != null;

            if ( debug ) {
            
                console.log(
                    'setValue(): hasSerial=', hasSerial,
                    'valueChanged=', this.valueChanged,
                    'val!==this.value', (val!==this.value),
                    'val.serial=', val.serial,
                    'this.valueSerial=', this.valueSerial,
                    'val.serial!==this.valueSerial=', (val.serial!==this.valueSerial) );
            
            }

            if ( ! this.valueChanged ) {

                this.valueChanged = val !== this.value;

                if ( ! this.valueChanged && hasSerial ) {

                    this.valueChanged = val.serial !== this.valueSerial;
                }

            }

            if ( hasSerial ) this.valueSerial = val.serial;

            this.value = val;

        };

        obj.value        = null;
        obj.valueSerial  = 0;
        obj.valueChanged = false;

    };

})();
