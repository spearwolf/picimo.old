import VertexObjectDescriptor from '../core/vertex_object_descriptor';

class SpriteFactory {

    constructor ( parentFactory = null ) {

        this.registry = new Map;
        this.parentFactory = parentFactory;

    }

    createDescriptor (name, ...args) {

        if (this.getDescriptor(name)) {
            throw new Error(`oops.. VertexObjectDescriptor '${name}' already exists!`);
        }

        let vod = new VertexObjectDescriptor(...args);
        this.registry.set(name, vod);

        return vod;

    }

    getDescriptor (descriptor = 'default') {
        if (descriptor instanceof VertexObjectDescriptor) {
            return descriptor;
        } else {
            let vod = this.registry.get(descriptor);
            if (!vod && this.parentFactory) {
                return this.parentFactory.getDescriptor(descriptor);
            } else {
                return vod;
            }
        }
    }

    createSprite (descriptor, ...args) {
        let vod = this.getDescriptor(descriptor);
        if (vod) {
            return vod.create(...args);
        }
    }

    createSubFactory () {
        return new SpriteFactory(this);
    }

}

export default (function () {

    return new SpriteFactory;

})();

