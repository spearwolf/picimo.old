'use strict';

import Node from '../node';

import {
    initTransform,
    initProjection,
    initWithoutProjection,
    initRootScene,
    updateProjection
} from './init';

import { onFrame } from './frame';

import createFactories from './factories';


/**
 * @class Picimo.sg.Scene
 * @extends Picimo.sg.Node
 *
 * @classdesc
 * Allows you to determinate a **blend mode**.
 *
 * Can have a custom **projection** matrix which determinates the **width, height** and **pixelRatio**.
 *
 * Introduces new events such as **onResize** and **onProjectionUpdated**.
 *
 *
 * @param {Picimo.App} app                                 - The app instance
 * @param {Object} [options]                               - The options
 * @param {Picimo.webgl.cmd.BlendMode} [options.blendMode] - Blend mode
 * @param {number} [options.width]                         - Wanted scene width
 * @param {number} [options.height]                        - Wanted scene height
 * @param {string} [options.sizeVariety="contain"]         - *cover* or *contain*
 * @param {number} [options.pixelRatio]                    - Wanted pixel ratio
 * @param {boolean} [options.projection=true]              - Determinates if this scene should have an own projection matrix.
 * @param {function} [options.onResize]
 * @param {function} [options.onProjectionUpdated]
 *
 */

export default function Scene (app, options = {}) {

    Node.call(this, app, options);

    /**
     * @member {Picimo.webgl.cmd.BlendMode} Picimo.sg.Scene#blendMode
     */
    this.blendMode = options.blendMode;

    /**
     * @member {string} Picimo.sg.Scene#sizeVariety - *cover* or *contain*
     */
    this._sizeVariety = options.sizeVariety === 'cover' ? 'cover' : 'contain';

    if (options.projection === false) {

        initWithoutProjection(this);

    } else {

        initProjection(this, options);

    }

    initTransform(this);

    this.prevWidth = null;
    this.prevHeight = null;
    this.prevPixelRatio = null;
    this.parentResolution = { width: null, height: null, pixelRatio: null, devicePixelRatio: null };

    this.renderCmd = {
        uniforms: {                             // -> onFrame
            sceneInfo: [0, 0, 0],               // [ width, height, pixelRatio ]
            transform: this.transformUniform,
        }
    };

    if (this.isRoot) initRootScene(this);

    this.on("frame", onFrame);

    this.connect(options, {

        'onResize'            : 'resize',
        'onProjectionUpdated' : 'projectionUpdated',

    });

}

Scene.prototype = Object.create( Node.prototype );
Scene.prototype.constructor = Scene;

createFactories(Scene);


Object.defineProperties( Scene.prototype, {

    /**
     * @member {Picimo.sg.Scene} Picimo.sg.Scene#scene - The parent scene.
     */

    'scene': {

        get: function () {

            if ( this.isRoot ) return;

            var node = this.parent;

            while ( node ) {

                if ( "width" in node && "height" in node && "pixelRatio" in node && "devicePixelRatio" in node ) {

                    return node;

                }

                node = node.parent;

            }

        },

        enumerable: true

    }

});


/**
 * @method Picimo.sg.Scene#setSize
 * @param {number} width - Wanted scene width
 * @param {number} height - Wanted scene height
 * @param {string} [sizeVariety="contain"] - *cover* or *contain*
 * @return self
 */

Scene.prototype.setSize = function (width, height, sizeVariety) {

    let w = parseFloat(width);
    let h = parseFloat(height);

    if (w && !h) {
        h = w;
    } else if (h && !w) {
        w = h;
    }

    if (w && h && this._desiredWidth !== w || this._desiredHeight !== h || this.sizeVariety !== sizeVariety) {

        this._desiredWidth         = w;
        this._desiredHeight        = h;
        this._desiredPixelRatio    = 0;
        this.sizeVariety           = sizeVariety;
        this.projectionNeedsUpdate = true;

        updateProjection(this);  // TODO remove?

    }

    return this;

};

