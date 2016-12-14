'use strict';

export default function ( spriteFactory ) {

    let descriptor = spriteFactory.getDescriptor('default');
    if (descriptor) return descriptor;

    descriptor = spriteFactory.createDescriptor( 'default',

        function () {

            this.setAnchor( 0, 0 );  // anchor
            this.setRgb( 1, 1, 1 );

        },

        4, 16,

        [
            { name: 'xwyh',      size: 2, attrNames: [ 'xw', 'yh' ] },
            { name: 'size',      size: 2, attrNames: [ 'width', 'height' ], uniform: true },
            { name: 'scale',     size: 2, attrNames: [ 'sx', 'sy' ], uniform: true },
            { name: 'pos',       size: 2, attrNames: [ 'x', 'y' ], uniform: true },
            { name: 'texCoords', size: 2, attrNames: [ 's', 't' ] },
            { name: 'rotate',    size: 1, uniform: true },
            { name: 'texUnit',   size: 1, uniform: true },
            { name: 'rgb',       size: 3, attrNames: [ 'r', 'g', 'b' ], uniform: true },
            { name: 'opacity',   size: 1, uniform: true },

        ], {
            // both are referenced by our shader

            'rot_texUnit' : { size: 2, offset: 10, uniform: true },
            'color'       : { size: 4, offset: 12, uniform: true },

        });


    descriptor.proto.setAnchor = function ( x, y ) {

        this.setXwyh( -0.5 - x, 0.5 - y, 0.5 - x, 0.5 - y, 0.5 - x, -0.5 - y, -0.5 - x, -0.5 - y );

    };

    return descriptor;

}
