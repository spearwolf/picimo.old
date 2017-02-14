
/**
 * Pre-allocate a bunch of vertex objects.
 * @private
 */
export default function ( voPool, maxAllocSize = 0 ) {

    const max = voPool.capacity - voPool.usedCount - voPool.allocatedCount;
    const len = voPool.allocatedCount + ( maxAllocSize > 0 && maxAllocSize < max ? maxAllocSize : max );

    for ( let i = voPool.allocatedCount; i < len; i++ ) {

        let voArray = voPool.voArray.subarray( i );

        let vertexObject = voPool.descriptor.createVO( voArray );
        vertexObject.free = voPool.free.bind( voPool, vertexObject );

        //Object.freeze(vertexObject);

        voPool.availableVOs.push( vertexObject );

    }

}

