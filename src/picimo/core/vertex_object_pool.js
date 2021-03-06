'use strict';

import * as utils from '../utils';

/**
 * @class Picimo.core.VertexObjectPool
 * @param {Picimo.core.VertexObjectDescriptor} descriptor - Vertex object descriptor.
 * @param {number} capacity - Maximum number of vertex objects.
 * @param {Picimo.core.VertexArray} [vertexArray] - Vertex array.
 */

export default function VertexObjectPool ( descriptor, capacity, vertexArray ) {

    utils.object.definePropertiesPublicRO( this, {

        /**
         * @member {Picimo.core.VertexObjectDescriptor} Picimo.core.VertexObjectPool#descriptor - Vertex object descriptor.
         * @readonly
         */
        'descriptor' : descriptor,

        /**
         * @member {number} Picimo.core.VertexObjectPool#capacity - Maximum number of vertex objects.
         * @readonly
         */
        'capacity' : capacity,

        /**
         * @member {Picimo.core.VertexArray} Picimo.core.VertexObjectPool#vertexArray - Vertex array.
         * @readonly
         */
        'vertexArray' : ( vertexArray != null ? vertexArray : descriptor.createVertexArray( capacity ) ),

        /**
         * @member {Picimo.core.VertexObject} Picimo.core.VertexObjectPool#ZERO - The *zero* vertex object.
         * @readonly
         */
        'ZERO' : descriptor.create(),

        /**
         * @member {Picimo.core.VertexObject} Picimo.core.VertexObjectPool#NEW - The *new* vertex object.
         * @readonly
         */
        'NEW' : descriptor.create()

    });

    createVertexObjects( this );

}

Object.defineProperties( VertexObjectPool.prototype, {

    /**
     * @member {number} Picimo.core.VertexObjectPool#usedCount - Number of in-use vertex objects.
     * @readonly
     */
    'usedCount': {

        get: function () {

            return this.usedVOs.length;

        },

        enumerable: true

    },

    /**
     * @member {number} Picimo.core.VertexObjectPool#availableCount - Number of free and unused vertex objects.
     * @readonly
     */
    'availableCount': {

        get: function () {

            return this.availableVOs.length;

        },

        enumerable: true

    }

});


/**
 * @method Picimo.core.VertexObjectPool#alloc
 * @throws Will throw an error if capacity reached and no vertex object is available.
 * @return {Picimo.core.VertexObject}
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
 * @method Picimo.core.VertexObjectPool#free
 * @param {Picimo.core.VertexObject} vo - The vertex object
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

