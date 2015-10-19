'use strict';

import utils from '../utils';

/**
 * @class Picimo.core.VertexObject
 * @param {Picimo.core.VertexObjectDescriptor} [descriptor] - Vertex descriptor.
 * @param {Picimo.core.VertexArray} [vertexArray] - Vertex array.
 */
export default function VertexObject ( descriptor, vertexArray ) {

    if ( this.descriptor !== undefined ) return;

    /**
     * @member {Picimo.core.VertexObjectDescriptor} Picimo.core.VertexObject#descriptor - Vertex object descriptor.
     * @readonly
     */

    var _descriptor = descriptor ? descriptor : ( vertexArray ? vertexArray.descriptor : null );
    if ( ! _descriptor ) {

        throw new Error( 'VertexObject.descriptor is null!' );

    }
    utils.object.definePropertyPrivateRO( this, 'descriptor', _descriptor );

    /** @member {Picimo.core.VertexArray} Picimo.core.VertexObject#vertexArray - Vertex array. */
    var _vertexArray = vertexArray ? vertexArray : descriptor.createVertexArray();
    utils.object.definePropertyPrivate( this, 'vertexArray', _vertexArray );

    if ( this.descriptor !== this.vertexArray.descriptor && ( this.descriptor.vertexCount !== this.vertexArray.descriptor.vertexCount || this.descriptor.vertexAttrCount !== this.vertexArray.descriptor.vertexAttrCount) ) {

        throw new Error( 'Incompatible vertex object descriptors!' );

    }

}

Object.defineProperties( VertexObject.prototype, {

    'vertices': {
        get: function () {

            return this.vertexArray.vertices;

        }
    }

});

