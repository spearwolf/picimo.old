import { addUid } from '../../utils';
import { definePropertiesPublicRO } from '../../utils/object_utils';

export default function UniformValue ( isRestorable, value ) {

    addUid(this);

    definePropertiesPublicRO(this, {

        isRestorable      : !! isRestorable,
        isUniformValueCmd : true,

        restoreCmd : Object.freeze({

            isUniformValueRestoreCmd : true,
            uid                      : this.uid

        }),

    });

    this.value = null;
    this.prevValue = null;

    if (value !== undefined) {
        this.setValue(value);
    }

}


/**
 * This method gets called from the renderer to set the new uniform value.
 *
 * @param currentValue - The current uniform value.
 * @returns The new uniform value or if the value is null return the current value.
 */

UniformValue.prototype.getValue = function ( currentValue ) {

    if ( typeof this.value === 'function' ) return this.value( currentValue );

    if ( ! this.value ) return currentValue;

    return this.value;

};


/**
 * Set the uniform value.
 *
 * @param value - The uniform value or a function which returns the value.
 * @returns self
 */

UniformValue.prototype.setValue = function ( value ) {

    this.value = value;

    return this;

};

