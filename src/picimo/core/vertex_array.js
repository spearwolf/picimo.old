/* global Float32Array */
(function(){
    "use strict";

    /**
     * @class Picimo.core.VertexArray
     * @param {Picimo.core.VertexObjectDescriptor} descriptor - The descriptor.
     * @param {number} capacity - Maximum number of vertex objects
     * @param {Float32Array} [vertices]
     */
    function VertexArray ( descriptor, capacity, vertices ) {

        this.descriptor = descriptor;
        this.capacity   = capacity;

        /**
         * @member {Float32Array} Picimo.core.VertexArray#vertices - The float array buffer.
         */

        if ( vertices !== undefined ) {

            this.vertices = vertices;

        } else {

            this.vertices = new Float32Array( capacity * descriptor.vertexCount * descriptor.vertexAttrCount );

        }

    }

    /**
     * @method Picimo.core.VertexArray#copy
     * @param {Picimo.core.VertexArray} fromVertexArray
     * @param {number} [toOffset=0] - Vertex object offset
     */
    VertexArray.prototype.copy = function ( fromVertexArray, toOffset ) {

        var offset = 0;

        if ( toOffset === undefined ) {

            offset = toOffset * this.descriptor.vertexCount * this.descriptor.vertexAttrCount;

        }

        this.vertices.set( fromVertexArray.vertices, offset );

    };

    /**
     * @method Picimo.core.VertexArray#subarray
     * @param {number} begin - Index of first vertex object
     * @param {number} [size=1] -
     * @return {Picimo.core.VertexArray}
     */
    VertexArray.prototype.subarray = function ( begin, size ) {

        if ( size === undefined ) {

            size = 1;

        }

        var vertices = this.vertices.subarray(
                begin * this.descriptor.vertexCount * this.descriptor.vertexAttrCount,
                (begin + size) * this.descriptor.vertexCount * this.descriptor.vertexAttrCount );

        return new VertexArray( this.descriptor, size, vertices );

    };


    module.exports = VertexArray;

})();
