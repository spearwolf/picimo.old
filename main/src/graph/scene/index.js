import Matrix4 from '../../math/matrix4';
import Node from '../node';
import createFactories from './factories';
import { UniformValue, BlendMode } from '../../render/cmd';
import { initProjection, initRootScene, initTransform, initWithoutProjection, updateProjection } from './init';
import { onFrame, onFrameEnd } from './frame';

/**
 * @desc
 * Allows you to determinate a **blend mode**.
 *
 * Can have a custom **projection** matrix which determinates the **width, height** and **pixelRatio**.
 *
 * Introduces new events such as **onResize** and **onProjectionUpdated**.
 *
 *
 * @param {App} app                                 - The app instance
 * @param {Object} [options]                        - The options
 * @param {BlendMode} [options.blendMode]           - Blend mode
 * @param {number} [options.width]                  - Wanted scene width
 * @param {number} [options.height]                 - Wanted scene height
 * @param {string} [options.sizeFit="contain"]      - *cover* or *contain*
 * @param {number} [options.pixelRatio]             - Wanted pixel ratio
 * @param {boolean} [options.projection=true]       - Determinates if this scene should have an own projection matrix.
 * @param {function} [options.onResize]
 * @param {function} [options.onProjectionUpdated]
 *
 */

export default function Scene (app, options = {}) {

    Node.call(this, app, options);

    this._sizeFit = options.sizeFit === 'cover' ? 'cover' : 'contain';

    if (options.projection) {

        initProjection(this, options);

    } else {

        initWithoutProjection(this);

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
        }
    };

    /**
     * @private
     */
    this.renderPostCmd = {
        uniforms: {
            viewMatrix: this.renderCmd.uniforms.viewMatrix.restoreCmd,
        }
    };

    /**
     * @type {BlendMode}
     */
    this.blendMode = options.blendMode;

    if (this.hasOwnProjection)  {
        this.renderCmd.uniforms.projectionMatrix = new UniformValue(true, this.projection);
        this.renderPostCmd.uniforms.projectionMatrix = this.renderCmd.uniforms.projectionMatrix.restoreCmd;
    }

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

    // The parent scene
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

    blendMode: {

        enumerable: true,

        get: function () {
            return this._blendMode;
        },

        set: function (blendMode) {
            let _blendMode = blendMode != null ? blendMode : null;
            this._blendMode = _blendMode;
            if (_blendMode) {
                this.renderCmd.blendMode = _blendMode;
                this.renderPostCmd.blendMode = false;
            } else {
                delete this.renderCmd.blendMode;
                delete this.renderPostCmd.blendMode;
            }
        }

    }

});


Scene.prototype.setBlendMode = function (depthTest, depthMask, depthFunc, blend, blendFuncSrc, blendFuncDst) {

    if (arguments.length === 0 || arguments[0] == null) {
        this.blendMode = undefined;
    } else if (arguments.length === 1 && typeof arguments[0] === 'string') {
        let name = arguments[0].toUpperCase();
        this.blendMode = BlendMode[name];
    } else {
        this.blendMode = new BlendMode(depthTest, depthMask, depthFunc, blend, blendFuncSrc, blendFuncDst);
    }

    return this.blendMode;

};

/**
 * @param {number} width - Wanted scene width
 * @param {number} height - Wanted scene height
 * @param {string} [sizeFit="contain"] - *cover* or *contain*
 * @return self
 */

Scene.prototype.setSize = function (width, height, sizeFit) {

    let w = parseFloat(width);
    let h = parseFloat(height);

    if (w && !h) {
        h = w;
    } else if (h && !w) {
        w = h;
    }

    if (w && h && this._desiredWidth !== w || this._desiredHeight !== h || this.sizeFit !== sizeFit) {

        this._desiredWidth         = w;
        this._desiredHeight        = h;
        this._desiredPixelRatio    = 0;
        this.sizeFit               = sizeFit;
        this.projectionNeedsUpdate = true;

        updateProjection(this);  // TODO remove?

    }

    return this;

};

Scene.prototype.computeViewMatrix = function (viewMatrix) {

    if (!viewMatrix) viewMatrix = new Matrix4();

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

