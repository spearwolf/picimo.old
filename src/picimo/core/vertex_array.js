/* global Float32Array */
(function(){
    "use strict";

    /**
     * @class Picimo.core.VertexArray
     * @param {Picimo.core.VertexArrayDescriptor} descriptor - The descriptor.
     * @param {number} capacity
     * @param {Float32Array} [vertices]
     */
    function VertexArray ( descriptor, capacity, vertices ) {

        this.descriptor = descriptor;
        this.capacity   = capacity;

        if ( vertices !== undefined ) {

            this.vertices = vertices;

        } else {

            this.vertices = new Float32Array( capacity * descriptor.vertexCount * descriptor.vertexAttrCount );

        }

    }

    /**
     * @method Picimo.core.VertexArray#copy
     * @param {Picimo.core.VertexArray} fromVertexArray
     * @param {number} [toInstanceOffset=0]
     */
    VertexArray.prototype.copy = function ( fromVertexArray, toInstanceOffset ) {

        var offset = 0;

        if ( toInstanceOffset === undefined ) {

            offset = toInstanceOffset * this.descriptor.vertexCount * this.descriptor.vertexAttrCount;

        }

        this.vertices.set( fromVertexArray.vertices, offset );

    };

    /**
     * @method Picimo.core.VertexArray#subarray
     * @param {number} begin
     * @param {number} [size=1]
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
