/* global Uint32Array */
(function(){
    "use strict";

    var utils = require( '../utils' );

    /**
     * @class Picimo.core.VertexIndexArray
     * @param {number} vertexObjectCount - Number of vertex objects
     * @param {number} objectIndexCount - Number of vertex indices per object
     */
    function VertexIndexArray ( vertexObjectCount, objectIndexCount ) {

        var size = vertexObjectCount * objectIndexCount;

        utils.object.definePropertiesPublicRO( this, {
        
            /**
             * @member {number} Picimo.core.VertexIndexArray#vertexObjectCount - Number of vertex objects.
             * @readonly
             */
            vertexObjectCount: vertexObjectCount,

            /**
             * @member {number} Picimo.core.VertexIndexArray#objectIndexCount - Number of vertex indices per object.
             * @readonly
             */
            objectIndexCount: objectIndexCount,

            /**
             * @member {number} Picimo.core.VertexIndexArray#size - Size of array buffer.
             * @readonly
             */
            size: size,

            /**
             * @member {Uint32Array} Picimo.core.VertexIndexArray#indices - The uint index array buffer.
             * @readonly
             */
            indices: new Uint32Array( size )
        
        });

    }


    /**
     * @function Picimo.core.VertexIndexArray.Generate
     * @param {number} vertexObjectCount
     * @param {Array} indices
     * @return {Picimo.core.VertexIndexArray}
     * @example
     * // Create a VertexIndexBuffer for ten quads where each quad made up of two triangles (six vertices)
     * var quadIndices = Picimo.core.VertexIndexArray.Generate( 10, [ 0,1,2, 0,2,3 ] );
     * quadIndices.size                 // => 60
     * quadIndices.objectIndexCount     // => 6
     *
     */
    VertexIndexArray.Generate = function ( vertexObjectCount, indices ) {

        var arr = new VertexIndexArray( vertexObjectCount, indices.length );
        var i, j;

        for ( i = 0; i < vertexObjectCount; ++i ) {

            for ( j = 0; j < indices.length; ++j ) {

                arr[ ( i * arr.objectIndexCount ) + j ] = indices[ j ] + ( i * arr.objectIndexCount );

            }

        }

        return arr;

    };


    module.exports = VertexIndexArray;

})();
