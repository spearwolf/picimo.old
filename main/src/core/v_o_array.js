/* jshint esversion:6 */

import { BYTES_PER_ELEMENT, TYPED_ARRAY_CONSTRUCTOR } from '../utils/typed_array_helpers';

/**
 * Vertex Object Array
 *
 * @class VOArray
 *
 * @param {VODescriptor} descriptor - *Vertex object* descriptor
 * @param {number} capacity - Maximum number of *vertex objects*
 * @param {?ArrayBuffer|DataView|Float32Array} data
 *
 * @desc
 * An array of *vertex objects*.
 * Has a maximum capacity and a reference to the *vertex object descriptor*.
 *
 */

export default class VOArray {

    constructor (descriptor, capacity, data) {

        this.descriptor = descriptor;
        this.capacity = capacity;

        if (data instanceof ArrayBuffer) {
            this.float32Array = new Float32Array( data );
        } else if (data instanceof DataView) {
            this.float32Array = new Float32Array( data.buffer, data.byteOffset, data.byteLength / 4 );
        } else if (data instanceof Float32Array) {
            this.float32Array = data;
        } else {
            this.float32Array = new Float32Array( new ArrayBuffer( capacity * descriptor.bytesPerVO ) );
        }

        const { buffer, bufferByteOffset, bufferByteLength } = this;
        descriptor.typeList.filter(type => type !== 'float32').forEach(type => {
            this[`${type}Array`] = new (TYPED_ARRAY_CONSTRUCTOR[type])( buffer, bufferByteOffset, bufferByteLength / BYTES_PER_ELEMENT[type] );
        });

        Object.freeze(this);

    }

    /** @type {ArrayBuffer} */
    get buffer () {
        return this.float32Array.buffer;
    }

    /** @type {number} */
    get bufferByteOffset () {
        return this.float32Array.byteOffset;
    }

    /** @type {number} */
    get bufferByteLength () {
        return this.float32Array.byteLength;
    }

    /**
     * Copy **all** *vertex object* data from an external vertex array to the internal array
     * @param {VOArray} fromVOArray - The source vertex array
     * @param {number} [toOffset=0] - *Vertex object* offset for the internal vertex array
     */
    copy (fromVOArray, toOffset) {

        let offset = 0;

        if ( toOffset === undefined ) {

            offset = toOffset * (this.descriptor.bytesPerVO >> 2);

        }

        this.float32Array.set( fromVOArray.float32Array, offset );

    }

    /**
     * Create a VOArray *sub* array
     * @desc
     * This will **not** *copy* the internal vertex data - this will create a new view into the internal buffer.
     * Both (the new VOArray and the current one) will share the
     * same memory buffer.
     *
     * @param {number} begin - Index of first vertex object
     * @param {number} [size=1]
     * @return {VOArray}
     */
    subarray (begin, size = 1) {

        return new VOArray( this.descriptor, size,
            new DataView( this.buffer,
                (this.bufferByteOffset + (begin * this.descriptor.bytesPerVO)),
                size * this.descriptor.bytesPerVO ));

    }

}
