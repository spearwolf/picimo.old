'use strict';

import defaultSprite from './default_sprite';
import simpleSprite from './simple_sprite';

export default function (spriteFactory) {

    defaultSprite(spriteFactory);
    simpleSprite(spriteFactory);

    return spriteFactory;

}
