import attachSpriteHelpers from './simple_sprite_helpers';

export default function ( spriteFactory ) {

    let descriptor = spriteFactory.getDescriptor('simple');
    if (descriptor) return descriptor;

    descriptor = spriteFactory.createDescriptor( 'simple',

        null,

        4,  // vertices
        12, // attrs per vertex

        // ## sprite features
        //
        // +-+-+-+-+ +-+-+-+-+ +-+-+-+-+
        // |0|1|2|3| |4|5|6|7| |8|9|A|B|
        // +-+-+-+-+ +-+-+-+-+ +-+-+-+-+
        //
        // |o-o-o|                       (3) position: x,y,z
        //       |o|                     (1) rotate
        //           |o-o|               (2) tex-coords: s, t
        //               |o-o|           (3) translate: tx, ty
        //                     |o|       (1) scale
        //                       |o|     (1) opacity
        //

        [

            { name: 'position', size: 3, attrNames: [ 'x', 'y', 'z' ] },
            { name: 'rotate', size: 1, uniform: true },
            { name: 'texCoords', size: 2, attrNames: [ 's', 't' ] },
            { name: 'translate', size: 2, uniform: true, attrNames: [ 'tx', 'ty' ] },
            { name: 'scale', size: 1, uniform: true },
            { name: 'opacity', size: 1, uniform: true }

        ],

        {
            pos2d: { size: 2, offset: 0 },
            posZ:  { size: 1, offset: 2, uniform: true },
            uv:    'texCoords'

        }

    );

    attachSpriteHelpers( descriptor.proto );

    return descriptor;

}
