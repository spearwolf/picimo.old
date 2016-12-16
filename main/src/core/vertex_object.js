import { definePropertyPrivate, definePropertyPrivateRO } from '../utils/object_utils';

/**
 * @param {!VertexObjectDescriptor} [descriptor] - Vertex descriptor
 * @param {?VertexArray} [vertexArray] - Vertex array
 */
export default function VertexObject ( descriptor, vertexArray ) {

    if ( this.descriptor !== undefined ) return;

    let _descriptor = descriptor ? descriptor : ( vertexArray ? vertexArray.descriptor : null );
    if ( ! _descriptor ) {

        throw new Error( 'VertexObject#descriptor is null!' );

    }
    definePropertyPrivateRO( this, 'descriptor', _descriptor );

    let _vertexArray = vertexArray ? vertexArray : descriptor.createVertexArray();
    definePropertyPrivate( this, 'vertexArray', _vertexArray );

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

