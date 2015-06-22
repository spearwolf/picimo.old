(function(){
    "use strict";

    var utils = require( '../utils' );

    /**
     * @class Picimo.core.VertexObject
     * @param {Picimo.core.VertexObjectDescriptor} [descriptor] - Vertex descriptor.
     * @param {Picimo.core.VertexArray} [vertexArray] - Vertex array.
     * @param {Picimo.core.VertexObjectPool} [pool] - Vertex object pool.
     */
    function VertexObject ( descriptor, vertexArray, pool ) {

        /** @member {Picimo.core.VertexObjectDescriptor} Picimo.core.VertexObject#descriptor - Vertex object descriptor. */
        var _descriptor = ( !! descriptor ) ? descriptor : ( ( !! vertexArray ) ? vertexArray.descriptor : null );
        utils.object.definePropertyPrivate( this, 'descriptor', _descriptor );

        if ( ! this.descriptor ) {

            throw new Error( 'VertexObject.descriptor is null!' );

        }

        /** @member {Picimo.core.VertexArray} Picimo.core.VertexObject#vertexArray - Vertex array. */
        var _vertexArray = ( !! vertexArray ) ? vertexArray : descriptor.createVertexArray();
        utils.object.definePropertyPrivate( this, 'vertexArray', _vertexArray );

        if ( this.descriptor !== this.vertexArray.descriptor && ( this.descriptor.vertexCount !== this.vertexArray.descriptor.vertexCount || this.descriptor.vertexAttrCount !== this.vertexArray.descriptor.vertexAttrCount) ) {

            throw new Error( 'Incompatible vertex object descriptors!' );

        }

        /** @member {Picimo.core.VertexObjectPool} Picimo.core.VertexObject#pool - Vertex object pool or _undefined_. */
        var _pool = ! pool ? null : pool;
        utils.object.definePropertyPrivate( this, 'pool', _pool );

        this.reset();

    }

    VertexObject.prototype.reset = function () { /* overwrite */ };

    VertexObject.prototype.destroy = function () {

        if ( this.pool ) {

            this.pool.free( this );

        } else {

            this.reset();

        }

    };

    Object.defineProperties( VertexObject.prototype, {

        'vertices': {
            get: function () {

                return this.vertexArray.vertices;

            }
        }

    });

    module.exports = VertexObject;

})();
