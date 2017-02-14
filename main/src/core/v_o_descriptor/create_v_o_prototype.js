/* jshint esversion:6 */
import VOAttrDescriptor from '../v_o_attr_descriptor';

export default function (descriptor, proto) {

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

