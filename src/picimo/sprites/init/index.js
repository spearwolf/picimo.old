'use strict';

import SpriteFactory from '../sprite_factory';

import defaultSprite from './default_sprite';
import simpleSprite from './simple_sprite';

export default function () {

    defaultSprite(SpriteFactory);
    simpleSprite(SpriteFactory);

    return SpriteFactory.createSubFactory();

}

