
export default class VOPool {

    /**
     * @param {VODescriptor} descriptor - vertex object descriptor
     * @param {number} capacity - Maximum number of *vertex objects*
     * @param {VOArray} [voArray] - Vertex object array
     * @param {VertexObject} [voZero] - *vertex object* **prototype**
     * @param {VertexObject} [voNew] - *vertex object* **prototype**
     */

    constructor ( descriptor, capacity, voArray, voZero, voNew ) {

        this.descriptor = descriptor;
        this.capacity = capacity;
        this.voArray = voArray || descriptor.createVOArray( capacity );

        this.voZero = voZero || descriptor.createVO();
        this.voNew = voNew || descriptor.createVO();

        createVertexObjects( this );

    }

    /**
     * Number of in use *vertex objects*.
     * @type {number}
     */

    get usedCount () {

        return this.usedVOs.length;

    }

    /**
     * Number of free and unused *vertex objects*.
     * @type {number}
     */

    get availableCount () {

        return this.availableVOs.length;

    }

    /**
     * @throws throw error when capacity reached and no vertex object is available.
     * @return {VertexObject}
     */

    alloc () {

        const vo = this.availableVOs.shift();

        if ( vo === undefined ) {

            throw new Error( "VOPool capacity(=" + this.capacity + ") is reached!" );

        }

        this.usedVOs.push( vo );

        vo.voArray.copy( this.voNew.voArray );

        return vo;

    }


    /**
     * @param {VertexObject} vo - The vertex object
     */

    free ( vo ) {

        const idx = this.usedVOs.indexOf( vo );

        if ( idx === -1 ) return;

        const lastIdx = this.usedVOs.length - 1;

        if ( idx !== lastIdx ) {

            const last = this.usedVOs[ lastIdx ];
            vo.voArray.copy( last.voArray );

            const tmp = last.voArray;
            last.voArray = vo.voArray;
            vo.voArray = tmp;

            this.usedVOs.splice( idx, 1, last );

        }

        this.usedVOs.pop();
        this.availableVOs.unshift( vo );

        vo.voArray.copy( this.voZero.voArray );

    }

}

/**
 * @ignore
 */
function createVertexObjects ( pool ) {

    pool.availableVOs = [];

    for ( let i = 0; i < pool.capacity; i++ ) {

        let voArray = pool.voArray.subarray( i );

        let vertexObject = pool.descriptor.createVO( voArray );
        vertexObject.free = pool.free.bind( pool, vertexObject );

        //Object.freeze(vertexObject);

        pool.availableVOs.push( vertexObject );

    }

    pool.usedVOs = [];

}

