/* jshint esversion:6 */
import delegateMethods from '../utils/delegate_methods';
import { definePropertyPublicRO, definePropertyPrivateRO } from '../utils/obj_props';
import { initSprites, defineSprite } from '../sprites';

/**
 * @ignore
 */
export default function ( app ) {

    let spriteFactory = initSprites();

    definePropertyPrivateRO( app, 'spriteFactory', spriteFactory );

    definePropertyPublicRO( app, 'defineSprite', function (typeName, spriteOptions, spriteProto) {

        return defineSprite( typeName, spriteOptions, spriteProto, spriteFactory );

    });

    delegateMethods(spriteFactory, app, {

        createSprite     : 'createSprite',
        getDescriptor    : 'getSpriteDescriptor',

    });

}

