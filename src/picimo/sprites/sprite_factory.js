'use strict';

import { VertexObjectDescriptor } from '../core';

export default (function () {

    let registry = new Map;
    let api = {

        createDescriptor (name, ...args) {

            let vod = new VertexObjectDescriptor(...args);
            registry.set(name, vod);

            return vod;

        },

        getDescriptor (descriptor = 'default') {
            return descriptor instanceof VertexObjectDescriptor ? descriptor : registry.get(descriptor);
        },

        createSprite (descriptor, ...args) {
            let d = this.getDescriptor(descriptor);
            if (d) return d.create(...args);
        }

    };

    return api;

})();

