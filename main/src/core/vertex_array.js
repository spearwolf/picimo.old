'use strict';

export default class VertexArray {

    /**
     * @param {VertexObjectDescriptor} descriptor - The vertex descriptor
     * @param {number} capacity - Maximum number of vertex objects
     * @param {?Float32Array} vertices
     */
    constructor (descriptor, capacity, vertices) {

        /**
         * @type {VertexObjectDescriptor}
         */
        this.descriptor = descriptor;

        /**
         * @type {number}
         */
        this.capacity = capacity;

        /**
         * The float array buffer
         * @type {Float32Array}
         */
        this.vertices = vertices !== undefined ? vertices : new Float32Array( capacity * descriptor.vertexCount * descriptor.vertexAttrCount );

    }

    /**
     * @param {VertexArray} fromVertexArray
     * @param {number} [toOffset=0] - Vertex object offset
     */
    copy (fromVertexArray, toOffset) {

        let offset = 0;

        if ( toOffset === undefined ) {

            offset = toOffset * this.descriptor.vertexCount * this.descriptor.vertexAttrCount;

        }

        this.vertices.set( fromVertexArray.vertices, offset );

    }

    /**
     * @param {number} begin - Index of first vertex object
     * @param {number} [size=1]
     * @return {VertexArray}
     */
    subarray (begin, size) {

        if ( size === undefined ) {

            size = 1;

        }

        var vertices = this.vertices.subarray(
                begin * this.descriptor.vertexCount * this.descriptor.vertexAttrCount,
                (begin + size) * this.descriptor.vertexCount * this.descriptor.vertexAttrCount );

        return new VertexArray( this.descriptor, size, vertices );

    }

} // => class VertexArray

