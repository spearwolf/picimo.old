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

        options.parentNode = this;
        options.textureAtlas = textureAtlas;

        var node = this.appendChild(new SpriteGroup(this.app, options));

        if (extension) node.connect(extension);

        return node;

    };


    Scene.prototype.appendPicture = function (url, options = {}, extension) {

        options.parentNode = this;
        options.texture = this.app.loadTexture(url);

        var node = this.appendChild(new Picture(this.app, options));

        if (extension) node.connect(extension);

        return node;

    };

}

