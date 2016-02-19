'use strict';

import SpriteGroup from '../sprite_group';
import Picture from '../picture';

export default function (Scene) {

    /**
     * @method Picimo.sg.Scene#appendSpriteGroup
     * @param {Picimo.core.TextureAtlas|Promise} textureAtlas
     * @param {options} [options]
     * @param {object} [extension]
     * @return Picimo.sg.SpriteGroup
     */

    Scene.prototype.appendSpriteGroup = function (textureAtlas, options = {}, extension) {

        options.parent = this;
        options.textureAtlas = textureAtlas;

        var node = this.addChild(new SpriteGroup(this.app, options));

        if (extension) node.connect(extension);

        return node;

    };


    Scene.prototype.appendPicture = function (url, options = {}, extension) {

        options.parent = this;
        options.texture = this.app.loadTexture(url);

        var node = this.addChild(new Picture(this.app, options));

        if (extension) node.connect(extension);

        return node;

    };

}

