import createVertexObjects from './create_vertex_objects';

export default class VOPool {

    /**
     * @param {VODescriptor} descriptor - vertex object descriptor
     * @param {Object} [options] - Advanved options
     * @param {number} [options.capacity] - Maximum number of *vertex objects*
     * @param {VOArray} [options.voArray] - Vertex object array
     * @param {VertexObject} [options.voZero] - *vertex object* **prototype**
     * @param {VertexObject} [options.voNew] - *vertex object* **prototype**
     * @param {VertexObject} [options.maxAllocVOSize] - never allocate more than *maxAllocVOSize* vertex objects at once
     */

    constructor ( descriptor, options ) {

        this.descriptor = descriptor;
        this.capacity = options && options.capacity || this.descriptor.maxIndexedVOPoolSize;
        this.maxAllocVOSize = options && options.maxAllocVOSize || 0;

        this.voArray = options && options.voArray || descriptor.createVOArray( this.capacity );
        this.voZero = options && options.voZero || descriptor.createVO();
        this.voNew = options && options.voNew || descriptor.createVO();

        this.availableVOs = [];
        this.usedVOs = [];

        createVertexObjects( this, this.maxAllocVOSize );

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

        return this.capacity - this.usedVOs.length;

    }

    /**
     * Number of **allocated** *vertex objects*.
     * @type {number}
     */

    get allocatedCount () {

        return this.availableVOs.length + this.usedVOs.length;

    }

    /**
     * Return **size** *vertex objects*
     * @return {VertexObject|VertexObject[]}
     */

    alloc ( size = 1 ) {

        if ( size > 1 ) {

            const arr = [];
            for ( let i = 0; i < size; ++i ) {
                const vo = this.alloc( 1 );
                if (vo !== undefined) {
                    arr.push(vo);
                } else {
                    break;
                }
            }
            return arr;

        }

        const vo = this.availableVOs.shift();

        if ( vo === undefined ) {

            if ( (this.capacity - this.allocatedCount) > 0 ) {

                createVertexObjects( this, this.maxAllocVOSize );
                return this.alloc();

            } else {

                return;

            }

        }

        this.usedVOs.push( vo );

        vo.voArray.copy( this.voNew.voArray );

        return vo;

    }


    /**
     * @param {VertexObject|VertexObject[]} vo - vertex object(s)
     */

    free ( vo ) {

        if ( Array.isArray( vo ) ) {

            vo.forEach(_vo => _vo.free());
            return;

        }

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

