/* jshint esversion:6 */

export function createVO ( obj, descriptor, voArray ) {

    // set VODescriptor
    //
    obj.descriptor = descriptor || ( voArray ? voArray.descriptor : null );

    if ( ! obj.descriptor ) {

        throw new Error( 'could not detect VODescriptor!' );

    }

    // set VOArray
    //
    obj.voArray = voArray || obj.descriptor.createVOArray();

    if ( obj.descriptor !== obj.voArray.descriptor &&
        ( obj.descriptor.vertexCount !== obj.voArray.descriptor.vertexCount ||
            obj.descriptor.vertexAttrCount !== obj.voArray.descriptor.vertexAttrCount)) {

        throw new Error( 'Incompatible vertex object descriptors!' );

    }

    return obj;

}

