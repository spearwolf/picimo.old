(function(){
    "use strict";

    var utils = require( '../utils' );

    /**
     * @class Picimo.core.VertexObjectPool
     * @param {Picimo.core.VertexObjectDescriptor} descriptor - Vertex object descriptor.
     * @param {number} capacity - Maximum number of vertex objects.
     * @param {Picimo.core.VertexArray} [vertexArray] - Vertex array.
     */

    function VertexObjectPool ( descriptor, capacity, vertexArray ) {

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
            'ZERO' : descriptor.createVertexObject()

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

        vo.vertexArray.copy( this.ZERO.vertexArray );

        return vo;

    };


    /**
     * @method Picimo.core.VertexObjectPool#free
     * @param {Picimo.core.VertexObject} vo - The vertex object
     * @throws Will throw an error if something went wrong.
     */

    VertexObjectPool.prototype.free = function ( vo ) {

        if ( vo.pool !== this ) {

            throw new Error( "couldn't free(vo): vertex object is from other pool" );

        }

        var idx = this.usedVOs.indexOf( vo );

        if ( idx === -1 )  {

            throw new Error( "couldn't free(vo): vertex object not found in usedVOs array!" );

        }

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

    };


    function createVertexObjects( pool ) {

        pool.availableVOs = [];

        var vertexArray, vertexObject;
        var i;

        for ( i = 0; i < pool.capacity; i++ ) {

            vertexArray = pool.vertexArray.subarray( i );
            vertexObject = pool.descriptor.createVertexObject( vertexArray, pool );

            pool.availableVOs.push( vertexObject );

        }

        pool.usedVOs = [];

    }


    module.exports = VertexObjectPool;

})();
