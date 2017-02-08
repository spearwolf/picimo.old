/* jshint esversion:6 */
import addUid from '../utils/add_uid';
import { definePropertiesPublicRO } from '../utils/obj_props';

export default class UniformValue {

    constructor ( isRestorable, value ) {

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

    getValue ( currentValue ) {

        if ( typeof this.value === 'function' ) return this.value( currentValue );

        if ( ! this.value ) return currentValue;

        return this.value;

    }


    /**
     * Set the uniform value.
     *
     * @param value - The uniform value or a function which returns the value.
     * @returns self
     */

    setValue ( value ) {

        this.value = value;

        return this;

    }

}

