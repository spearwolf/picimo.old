/* jshint esversion:6 */
import { definePropertiesPublicRO } from '../utils/obj_props';

export default class VertexIndexArray {

    /**
     * @param {number} vertexObjectCount - Number of vertex objects
     * @param {number} objectIndexCount - Number of vertex indices per object
     */
    constructor (vertexObjectCount, objectIndexCount) {

        var size = vertexObjectCount * objectIndexCount;

        definePropertiesPublicRO( this, {

            /**
             * Number of vertex objects.
             */
            vertexObjectCount: vertexObjectCount,

            /**
             * Number of vertex indices per object.
             */
            objectIndexCount: objectIndexCount,

            /**
             * Size of array buffer.
             */
            size: size,

            /**
             * The uint index array buffer.
             * @readonly
             */
            indices: new Uint32Array( size )

        });

    } // => constructor

    /**
     * @param {number} vertexObjectCount
     * @param {number[]} indices
     * @param {number} [objectOffset=0]
     * @param {number} [stride=4]
     * @return {VertexIndexArray}
     * @example
     * // Create a VertexIndexBuffer for 10 quads where each quad made up of 2x triangles (4x vertices and 6x indices)
     * var quadIndices = Picimo.core.VertexIndexArray.Generate( 10, [ 0,1,2, 0,2,3 ], 4 );
     * quadIndices.size                 // => 60
     * quadIndices.objectIndexCount     // => 6
     */
    static Generate (vertexObjectCount, indices, objectOffset, stride) {

        var arr = new VertexIndexArray( vertexObjectCount, indices.length );
        var i, j;

        if ( stride === undefined ) stride = 4;
        if ( objectOffset === undefined ) objectOffset = 0;

        for ( i = 0; i < vertexObjectCount; ++i ) {

            for ( j = 0; j < indices.length; ++j ) {

                arr.indices[ ( i * arr.objectIndexCount ) + j ] = indices[ j ] + ( ( i + objectOffset ) * stride );

            }

        }

        return arr;

    }

} // => class VertexIndexArray

