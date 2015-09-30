(function () {
    "use strict";

    var utils = require( '../../utils' );

    /**
     * @class Picimo.webgl.cmd.UniformValue
     *
     */

    function UniformValue ( isRestorable ) {

        utils.addUid( this );

        utils.object.definePropertiesPublicRO({

            isRestorable      : !! isRestorable,
            isUniformValueCmd : true,

            restoreCmd : Object.freeze({

                isUniformValueRestoreCmd : true,
                uid                      : this.uid

            }),

        });

        this.value = null;
        this.prevValue = null;

    }


    /**
     * This method gets called from the renderer to set the new uniform value.
     *
     * @method Picimo.webgl.cmd.UniformValue#getValue
     *
     * @param currentValue - The current uniform value.
     * @param uniforms - A map with all uniforms.
     *
     * @returns The new uniform value or if the value is null return the current value.
     *
     */

    UniformValue.prototype.getValue = function ( currentValue, uniforms ) {

        if ( ! this.value ) return currentValue;

        if ( typeof this.value === 'function' ) return this.value( currentValue, uniforms );

        return this.value;

    };


    /**
     * Set the uniform value.
     *
     * @method Picimo.webgl.cmd.UniformValue#setValue
     *
     * @param value - The uniform value or a function which returns the value.
     *
     * @returns self
     *
     */

    UniformValue.prototype.setValue = function ( value ) {

        this.value = value;

        return this;

    };

    module.exports = UniformValue;

})();
