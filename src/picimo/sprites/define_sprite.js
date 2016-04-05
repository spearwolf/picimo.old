'use strict';

import SpriteFactory from './sprite_factory';

export default function (typeName, options, proto, spriteFactory = SpriteFactory) {

    let descriptor = spriteFactory.createDescriptor(typeName, options.constructor, options.vertexCount, options.vertexAttrCount, options.attributes, options.aliases);

    if (proto) {
        Object.assign(descriptor.proto, proto);
    }

    return descriptor;

}

