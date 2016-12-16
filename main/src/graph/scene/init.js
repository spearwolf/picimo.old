import Matrix4 from '../../math/matrix4';
import UniformValue from '../../render/cmd/uniform_value';
import eventize from '@spearwolf/eventize';
import { definePropertiesPublicRO } from '../../utils/object_utils';
import { onRootFrame } from './frame';

/**
 * @ignore
 */
export function initTransform (scene) {  // --- {{{

    // Every scene has a transformation matrix !

    scene.transform = new Matrix4();

    scene.viewMatrixUniform = new UniformValue(true,
        _computeViewMatrix.bind(null, scene, new Matrix4()) );

    if (scene.hasOwnProjection) {

        scene.on("init", eventize.PRIO_A, function () {

            this.projectionNeedsUpdate = true;
            updateProjection(this);

        });

    }

}

/**
 * @ignore
 */
function _computeViewMatrix (scene, viewMatrix, current) {
    if (!current || scene.hasOwnProjection) {
        scene.computeViewMatrix(viewMatrix);
    } else {
        viewMatrix.multiply(current, scene.transform);
    }
    return viewMatrix;
}

// --- initTransform }}}

/**
 * @ignore
 */
export function initWithoutProjection (scene) {  // --- {{{

    definePropertiesPublicRO(scene, {

        projection: null,
        hasOwnProjection: false,
        projectionNeedsUpdate: false

    });

    Object.defineProperties(scene, {

        'width' : { get: function () {

            var parent = this.scene;
            return parent ? parent.width : this.app.width;

        }, enumerable: true },

        'height' : { get: function () {

            var parent = this.scene;
            return parent ? parent.height : this.app.height;

        }, enumerable: true },

        'pixelRatio' : { get: function () {

            var parent = this.scene;
            return parent ? parent.pixelRatio : this.app.devicePixelRatio;

        }, enumerable: true },

        'devicePixelRatio' : { get: function () {

            var parent = this.scene;
            return parent ? parent.devicePixelRatio : this.app.devicePixelRatio;

        }, enumerable: true },

    });

}

// --- initWithoutProjection }}}

/**
 * @ignore
 */
export function initRootScene (scene) {  // --- {{{

    scene.rootRenderCmd = {

        uniforms: {

            iGlobalTime : 0,
            iFrameNo    : 0,
            iResolution : [0, 0],

        }

    };

    scene.on("frame", onRootFrame);

}

// --- initRootScene }}}

/**
 * @ignore
 */
export function initProjection (scene, options) {  // --- {{{

    definePropertiesPublicRO(scene, {

        projection       : new Matrix4(),
        hasOwnProjection : true

    });

    scene.projectionNeedsUpdate = true;

    scene._desiredPixelRatio = options.pixelRatio ? parseFloat( options.pixelRatio ) : ( scene.isRootNode ? 1 : 0 );
    scene._desiredWidth      = options.width ? parseFloat( options.width ) : 0;
    scene._desiredHeight     = options.height ? parseFloat( options.height ) : 0;

    Object.defineProperties( scene, {

        'width': {

            get: function () {

                return this._computedWidth ? this._computedWidth : this._desiredWidth;

            },

            set: function ( w ) {

                var desiredWidth = parseFloat( w );

                if ( this._desiredWidth !== desiredWidth ) {

                    this._desiredWidth = desiredWidth;

                    if ( desiredWidth ) this._desiredPixelRatio = 0;

                    this.projectionNeedsUpdate = true;

                }

            },

            enumerable: true

        },

        'height': {

            get: function () {

                return this._computedHeight ? this._computedHeight : this._desiredHeight;

            },

            set: function ( h ) {

                var desiredHeight = parseFloat( h );

                if ( this._desiredHeight !== desiredHeight ) {

                    this._desiredHeight = desiredHeight;

                    if ( desiredHeight ) this._desiredPixelRatio = 0;

                    this.projectionNeedsUpdate = true;

                }

            },

            enumerable: true

        },

        'pixelRatio': {

            get: function () {

                if ( this._computedPixelRatio ) {

                    return this._computedPixelRatio;

                } else if ( this._desiredPixelRatio ) {

                    return this._desiredPixelRatio;

                }

                var parent = this.scene;

                if ( parent ) {

                    return parent.pixelRatio;

                }

                return 0;

            },

            set: function ( ratio ) {

                var desiredPixelRatio = parseFloat( ratio );

                if ( this._desiredPixelRatio !== desiredPixelRatio ) {

                    this._desiredPixelRatio = desiredPixelRatio;

                    if ( desiredPixelRatio ) {

                        this._computedPixelRatio = 0;
                        this._desiredWidth       = 0;
                        this._desiredHeight      = 0;

                    }

                    this.projectionNeedsUpdate = true;

                }

            },

            enumerable: true

        },

        'sizeFit': {

            get: function () {

                return this._sizeFit;

            },

            set: function ( variety ) {

                var sizeFit = variety === 'cover' ? 'cover' : 'contain';

                if ( this._sizeFit !== sizeFit ) {

                    this._sizeFit = sizeFit;
                    this.projectionNeedsUpdate = true;

                }

            },

            enumerable: true

        },


    });

    updateProjection(scene);

}

// --- initProjection }}}

/**
 * @ignore
 */
export function updateProjection (scene) {  // --- {{{

    if ( ! scene.hasOwnProjection || ! scene.projectionNeedsUpdate ) return;

    var factor;

    if ( scene._desiredWidth || scene._desiredHeight ) {

        var appRatio   = scene.app.height / scene.app.width;            // <1 : landscape, >1 : portrait
        var sceneRatio = scene._desiredHeight / scene._desiredWidth;
        var isCover    = scene._desiredWidth && scene._desiredHeight && scene.sizeFit === 'cover';

        if ( ( ! scene._desiredWidth && scene._desiredHeight ) || appRatio < sceneRatio ) {

            scene._computedWidth  = ( scene._desiredHeight / scene.app.height ) * scene.app.width;
            scene._computedHeight = scene._desiredHeight;

            if ( isCover ) {

                factor = scene._desiredWidth / scene._computedWidth;

                scene._computedWidth  *= factor;
                scene._computedHeight *= factor;

            }

        } else if ( ( scene._desiredWidth && ! scene._desiredHeight ) || appRatio > sceneRatio ) {

            scene._computedWidth  = scene._desiredWidth;
            scene._computedHeight = ( scene._desiredWidth / scene.app.width ) * scene.app.height;

            if ( isCover ) {

                factor = scene._desiredHeight / scene._computedHeight;

                scene._computedWidth  *= factor;
                scene._computedHeight *= factor;

            }

        } else {

            scene._computedWidth  = scene._desiredWidth;
            scene._computedHeight = scene._desiredHeight;

        }

        scene._computedPixelRatio = ( scene.app.width / scene._computedWidth ) / scene.app.devicePixelRatio;


    } else if ( scene._desiredPixelRatio ) {

        var parentScene = scene.scene;
        var master      = parentScene ? parentScene : scene.app;
        var ratio       = parentScene ? parentScene.pixelRatio : scene.app.devicePixelRatio;

        factor = scene._desiredPixelRatio * ratio;

        scene._computedWidth  = master.width  / factor;
        scene._computedHeight = master.height / factor;

    }

    scene.devicePixelRatio = scene.app.width / scene._computedWidth;
    scene.projectionNeedsUpdate = false;

    scene.projection.ortho( scene.width, scene.height );

    /*
     * Announce a projection matrix change.
     * @param {Matrix4} projection - The changed projection matrix.
     */
    scene.emit( "projectionUpdated", scene.projection );

}

// --- updateProjection }}}

