/* jshint esversion:6 */
import VOAttrDescriptor from '../v_o_attr_descriptor';

export default function (descriptor, aliases) {

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

