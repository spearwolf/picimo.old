import { definePropertiesPublicRO } from '../utils/object_utils';

/**
 * @param {VertexObjectDescriptor} descriptor - Vertex object descriptor
 * @param {number} capacity - Maximum number of vertex objects
 * @param {Picimo.core.VertexArray} [vertexArray] - Vertex array
 */

export default function VertexObjectPool ( descriptor, capacity, vertexArray ) {

    definePropertiesPublicRO( this, {

        'descriptor' : descriptor,

        // Maximum number of vertex objects
        'capacity' : capacity,

        'vertexArray' : ( vertexArray != null ? vertexArray : descriptor.createVertexArray( capacity ) ),

        'ZERO' : descriptor.create(),

        'NEW' : descriptor.create()

    });

    createVertexObjects( this );

}

Object.defineProperties( VertexObjectPool.prototype, {

    // Number of in-use vertex objects
    'usedCount': {

        get: function () {

            return this.usedVOs.length;

        },

        enumerable: true

    },

    // Number of free and unused vertex objects
    'availableCount': {

        get: function () {

            return this.availableVOs.length;

        },

        enumerable: true

    }

});


/**
 * @throws throw error when capacity reached and no vertex object is available.
 * @return {VertexObject}
 */

VertexObjectPool.prototype.alloc = function () {

    var vo = this.availableVOs.shift();

    if ( vo === undefined ) {

        throw new Error( "VertexObjectPool capacity(=" + this.capacity + ") reached!" );

    }

    this.usedVOs.push( vo );

    vo.vertexArray.copy( this.NEW.vertexArray );

    return vo;

};


/**
 * @param {VertexObject} vo - The vertex object
 */

VertexObjectPool.prototype.free = function ( vo ) {

    var idx = this.usedVOs.indexOf( vo );

    if ( idx === -1 ) return;

    var lastIdx = this.usedVOs.length - 1;

    if ( idx !== lastIdx ) {

        var last = this.usedVOs[ lastIdx ];
        vo.vertexArray.copy( last.vertexArray );

        var tmp = last.vertexArray;
        last.vertexArray = vo.vertexArray;
        vo.vertexArray = tmp;

        this.usedVOs.splice( idx, 1, last );

    }

    this.usedVOs.pop();
    this.availableVOs.unshift( vo );

    vo.vertexArray.copy( this.ZERO.vertexArray );

};


/**
 * @ignore
 */
function createVertexObjects ( pool ) {

    pool.availableVOs = [];

    var vertexArray, vertexObject;
    var i;

    for ( i = 0; i < pool.capacity; i++ ) {

        vertexArray = pool.vertexArray.subarray( i );

        vertexObject = pool.descriptor.create( vertexArray );
        vertexObject.destroy = pool.free.bind( pool, vertexObject );

        pool.availableVOs.push( vertexObject );

    }

    pool.usedVOs = [];

}

