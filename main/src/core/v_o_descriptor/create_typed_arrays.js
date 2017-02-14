/* jshint esversion:6 */

export default function (descriptor) {

    descriptor.typedArrays = {
        float32 : false,
        int16   : false,
        int32   : false,
        int8    : false,
        uint16  : false,
        uint32  : false,
        uint8   : false,
    };

    Object.keys(descriptor.attr).forEach(name => {
        descriptor.typedArrays[descriptor.attr[name].type] = true;
    });

    Object.freeze(descriptor.typedArrays);

    descriptor.typeList = Object.keys(descriptor.typedArrays).filter(type => descriptor.typedArrays[type]).sort();

}

