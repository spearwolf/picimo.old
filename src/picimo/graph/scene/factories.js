'use strict';

import SpriteGroup from '../sprite_group';
import Picture from '../picture';

export default function (Scene) {

    Scene.prototype.appendSpriteGroup = function (textureAtlas, options = {}, extension = null) {

        options.parentNode = this;
        options.textureAtlas = textureAtlas;

        return appendNode(new SpriteGroup(this.app, options), this, extension);

    };

    Scene.prototype.appendPicture = function (url, options = {}, extension = null) {

        options.parentNode = this;
        options.texture = this.app.loadTexture(url);

        return appendNode(new Picture(this.app, options), this, extension);

    };

    Scene.prototype.appendGroup = function (options = {}, extension = null) {

        options.parentNode = this;
        options.projection = false;

        return appendNode(new Scene(this.app, options), this, extension);

    };

}

function appendNode (node, scene, extension) {

    scene.appendChild(node);

    if (extension) node.connect(extension);

    return node;

}

