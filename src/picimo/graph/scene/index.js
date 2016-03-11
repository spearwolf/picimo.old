'use strict';

import Node from '../node';
import * as math from '../../math';
import { cmd } from '../../render';

import {
    initTransform,
    initProjection,
    initWithoutProjection,
    initRootScene,
    updateProjection
} from './init';

import { onFrame, onFrameEnd } from './frame';

import createFactories from './factories';


/**
 * @class Picimo.graph.Scene
 * @extends Picimo.graph.Node
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
 * @param {Picimo.render.cmd.BlendMode} [options.blendMode] - Blend mode
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
     * @member {Picimo.render.cmd.BlendMode} Picimo.graph.Scene#blendMode
     */
    this.blendMode = options.blendMode;

    /**
     * @member {string} Picimo.graph.Scene#sizeVariety - *cover* or *contain*
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
            viewMatrix: this.viewMatrixUniform,
            projectionMatrix: new cmd.UniformValue(true, this.projection)
        }
    };

    this.renderPostCmd = {
        uniforms: {
            viewMatrix: this.renderCmd.uniforms.viewMatrix.restoreCmd,
            projectionMatrix: this.renderCmd.uniforms.projectionMatrix.restoreCmd
        }
    };

    if (this.isRootNode) initRootScene(this);

    this.on("frame", onFrame);
    this.on("frameEnd", onFrameEnd);

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
     * @member {Picimo.graph.Scene} Picimo.graph.Scene#scene - The parent scene.
     */

    'scene': {

        get: function () {

            if ( this.isRootNode ) return;

            let node = this.parentNode;

            while ( node ) {

                if ( "width" in node && "height" in node && "pixelRatio" in node && "devicePixelRatio" in node ) {

                    return node;

                }

                node = node.parentNode;

            }

        },

        enumerable: true

    },

});


/**
 * @method Picimo.graph.Scene#setSize
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

Scene.prototype.computeViewMatrix = function (viewMatrix) {

    if (!viewMatrix) viewMatrix = new math.Matrix4();

    if (this.hasOwnProjection) {
        viewMatrix.multiply(this.projection, this.transform);
    } else {
        let parentScene = this.scene;
        if (parentScene) {
            viewMatrix.multiply(parentScene.computeViewMatrix(), this.transform);
        } else {
            viewMatrix.copy(this.transform);
        }
    }

    return viewMatrix;

};

