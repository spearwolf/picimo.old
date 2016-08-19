'use strict';

import * as utils from '../utils';

import { initSprites, defineSprite } from '../sprites';

/**
 * @private
 */
export default function ( app ) {

    let spriteFactory = initSprites();

    utils.object.definePropertyPrivateRO( app, 'spriteFactory', spriteFactory );

    utils.object.definePropertyPublicRO( app, 'defineSprite', function (typeName, spriteOptions, spriteProto) {
        return defineSprite( typeName, spriteOptions, spriteProto, spriteFactory );
    });

    utils.delegateMethods(spriteFactory, app, {

        createSprite     : 'createSprite',
        getDescriptor    : 'getSpriteDescriptor',

    });

}

