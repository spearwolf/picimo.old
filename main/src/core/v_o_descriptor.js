import { createVO } from './v_o_helper';
import VOArray from './v_o_array';
import VOAttrDescriptor from './v_o_attr_descriptor';

export default class VertexObjectDescriptor {

    constructor ({ vertexCount, attributes, aliases, proto }) {

        this.vertexCount = parseInt( vertexCount, 10 );

        createAttributes(this, attributes);
        createAliases(this, aliases);
        createVOPrototype(this, proto);
        createTypedArrays(this);

        // === winterkälte jetzt

        Object.keys( this.attr ).forEach( name => Object.freeze( this.attr[name] ) );
        Object.freeze( this.attr );
        Object.freeze( this );

    }

    /**
     * @param {number} [size=1]
     * @returns {VOArray}
     */
    createVertexArray ( size = 1 ) {

        return new VOArray( this, size );

    }

    /**
     * Create a new *vertex object*
     *
     * @param {VOArray} [voArray]
     * @returns {Object} the *vertex object*
     */
    createVO ( voArray ) {

        return createVO(Object.create( this.voPrototype ), this, voArray);

    }

    /**
     * @param {string} name
     * @param {number} size - attribute item count
     * @returns {boolean}
     */
    hasAttribute ( name, size ) {

        const attr = this.attr[ name ];
        return attr && attr.size === size;

    }

}


function createTypedArrays (descriptor) {

    descriptor.typedArrays = {
        uint8: false,
        uint16: false,
        float32: false
    };

    Object.keys(descriptor.attr).forEach(name => {
        descriptor.typedArrays[descriptor.attr[name].type] = true;
    });

    const anyTypedArrayType = Object.keys(descriptor.typedArrays).find(type => descriptor.typedArrays[type]);
    descriptor.getAnyTypedArray = typedArrayGetter(anyTypedArrayType);

}

function typedArrayGetter (type) {
    switch (type) {
        case 'float32':
            return (voArray) => voArray.float32Array;
        case 'uint16':
            return (voArray) => voArray.uint16Array;
        case 'uint8':
            return (voArray) => voArray.uint8Array;
    }
}

function createVOPrototype (descriptor, proto) {

    const propertiesObject = {

        toArray: {

            value: function (attrNames) {
                const arr = [];
                const attrList = Array.isArray(attrNames) ?
                    attrNames.map(name => descriptor.attr[name])
                    : descriptor.attrList;
                const len = attrList.length;
                for (let i = 0; i < descriptor.vertexCount; ++i) {
                    for (let j = 0; j < len; ++j) {
                        const attr = attrList[j];
                        for (let k = 0; k < attr.size; ++k) {
                            arr.push(attr.getValue(this, i, k));
                        }
                    }
                }
                return arr;
            }

        }

    };

    Object.keys( descriptor.attr ).forEach( name => {

        const attr = descriptor.attr[ name ];

        VOAttrDescriptor.defineProperties( attr, propertiesObject, descriptor );

    });

    descriptor.voPrototype = Object.create( (typeof proto === 'object' ? proto : {}), propertiesObject );

}

function createAliases (descriptor, aliases) {

    if ( typeof aliases !== 'object' ) return;

    Object.keys( aliases ).forEach( name => {

        let attr = aliases[ name ];

        if ( typeof attr === 'string' ) {

            attr = descriptor.attr[ attr ];

            if ( attr !== undefined ) {

                descriptor.attr[ name ] = attr;

            }

        } else {

            descriptor.attr[ name ] = new VOAttrDescriptor( name, attr.type, attr.size, attr.offset, attr.byteOffset, !! attr.uniform, attr.attrNames );

        }

    });

}


function createAttributes (descriptor, attributes) {

    descriptor.attr = {};
    descriptor.attrNames = [];

    if ( Array.isArray( attributes ) ) {

        let offset = 0;
        let byteOffset = 0;

        for ( let i = 0; i < attributes.length; ++i ) {

            const attr = attributes[ i ];

            if ( attr.size === undefined ) throw new Error( 'vertex object attribute descriptor has no size!' );

            const type = attr.type || 'float32';

            if ( attr.name !== undefined ) {

                descriptor.attrNames.push( attr.name );
                descriptor.attr[ attr.name ] = new VOAttrDescriptor( attr.name, type, attr.size, offset, byteOffset, !! attr.uniform, attr.attrNames );

            }

            offset += attr.size;
            byteOffset += VOAttrDescriptor.bytesPerElement(type) * attr.size;

        }

        // bytes per vertex is always aligned to 4-bytes!
        descriptor.rightPadBytesPerVertex = byteOffset % 4 > 0 ? 4 - (byteOffset % 4) : 0;
        descriptor.bytesPerVertex = byteOffset + descriptor.rightPadBytesPerVertex;
        descriptor.bytesPerVO = descriptor.bytesPerVertex * descriptor.vertexCount;
        descriptor.vertexAttrCount = offset;

    }

    descriptor.attrList = descriptor.attrNames.map(name => descriptor.attr[name]);

}

