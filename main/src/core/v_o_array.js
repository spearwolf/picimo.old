/**
 * Vertex Object Array
 *
 * @desc
 * An array of *vertex objects*.
 * Has a maximum capacity and a reference to the *vertex object descriptor*.
 *
 */
export default class VOArray {

    /**
     * @param {VODescriptor} descriptor - *Vertex object* descriptor
     * @param {number} capacity - Maximum number of *vertex objects*
     * @param {?ArrayBuffer|Uint8Array} arrayBuffer - array buffer or uint8 typed array
     */
    constructor (descriptor, capacity, arrayBuffer) {

        this.descriptor = descriptor;
        this.capacity = capacity;

        this.uint8Array = arrayBuffer !== undefined ?
            ( arrayBuffer instanceof Uint8Array ? arrayBuffer : new Uint8Array( arrayBuffer ) ) :
            new Uint8Array( capacity * descriptor.bytesPerVO );

        this.uint16Array = new Uint16Array( this.uint8Array.buffer );
        this.float32Array = new Float32Array( this.uint8Array.buffer );

        Object.freeze(this);

    }

    get buffer () {
        return this.descriptor.getAnyTypedArray(this);
    }

    /**
     * Copy **all** *vertex object* data from an external vertex array to the internal array
     * @param {VOArray} fromVOArray - The source vertex array
     * @param {number} [toOffset=0] - *Vertex object* offset for the internal vertex array
     */
    copy (fromVOArray, toOffset) {

        let offset = 0;

        if ( toOffset === undefined ) {

            offset = toOffset * this.descriptor.bytesPerVO;

        }

        this.uint8Array.set( fromVOArray.uint8Array, offset );

    }

    /**
     * Create a VOArray *sub* array
     * @desc
     * This will **not** *copy* the internal vertex data.
     * Both (the new VOArray and the current one) will share the
     * same memory buffer.
     *
     * @param {number} begin - Index of first vertex object
     * @param {number} [size=1]
     * @return {VOArray}
     */
    subarray (begin, size = 1) {

        const uint8Array = this.uint8Array.subarray(
                begin * this.descriptor.bytesPerVO,
                (begin + size) * this.descriptor.bytesPerVO );

        return new VOArray( this.descriptor, size, uint8Array );

    }

}
