'use strict';

import SpriteGroup from '../sprite_group';
import Picture from '../picture';
import Canvas from '../canvas';

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

    Scene.prototype.appendCanvas = function (canvasSizeOrCanvas, options = {}, extension = null) {

        options.parentNode = this;

        let opts = Object.assign({}, options);

        if (typeof canvasSizeOrCanvas === 'number' || Array.isArray(canvasSizeOrCanvas)) {
            opts.canvasSize = canvasSizeOrCanvas;
        } else if (typeof canvasSizeOrCanvas === 'object') {
            opts.canvas = canvasSizeOrCanvas;
        }

        return appendNode(new Canvas(this.app, opts), this, extension);

    };

    Scene.prototype.appendScene = function (options = {}, extension = null) {

        options.parentNode = this;
        return appendNode(new Scene(this.app, options), this, extension);

    };

}

function appendNode (node, scene, extension) {

    scene.appendChild(node);

    if (extension) node.connect(extension);

    return node;

}

