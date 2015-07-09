(function (){
    "use strict";

    var Node  = require( './node' );
    var utils = require( '../utils' );
    var math  = require( '../math' );

    /**
     * @class Picimo.sg.Scene
     * @extends Picimo.sg.Node
     *
     * @param {Picimo.App} app - The app instance
     * @param {Object} [options] - The options
     * @param {Picimo.webgl.cmd.BlendMode} [options.blendMode] - Blend mode
     * @param {number} [options.renderPrio] - The render priority determinates the render order.
     * @param {number} [options.width] - Wanted scene width
     * @param {number} [options.height] - Wanted scene height
     * @param {number} [options.pixelRatio] - Wanted pixel ratio
     * @param {boolean} [options.projection=true] - Determinates if this scene should have an own projection matrix.
     *
     */

    function Scene ( app, options ) {

        if ( options === undefined ) options = {};

        Node.call( this, app, options );

        /**
         * @member {Picimo.webgl.cmd.BlendMode} Picimo.sg.Scene#blendMode
         */

        this.blendMode = options.blendMode;

        /**
         * @member {number} Picimo.sg.Scene#renderPrio
         */

        this._renderPrio = parseFloat( options.renderPrio || 0 );


        if ( options.projection === false ) {

            utils.object.definePropertiesPublicRO( this, {

                /**
                 * @member {Picimo.math.Matrix4} Picimo.sg.Scene#projection
                 * @readonly
                 */

                projection : null,

                /**
                 * @member {boolean} Picimo.sg.Scene#hasOwnProjection
                 * @readonly
                 */

                hasOwnProjection : false,

                projectionNeedsUpdate : false

            });

            Object.defineProperties( this, {

                /**
                 * @member {number} Picimo.sg.Scene#width
                 * @readonly
                 */

                'width' : { get: function () {

                    var parent = this.scene;
                    return parent ? parent.width : this.app.width;

                }, enumerable: true },

                /**
                 * @member {number} Picimo.sg.Scene#height
                 * @readonly
                 */
                'height' : { get: function () {

                    var parent = this.scene;
                    return parent ? parent.height : this.app.height;

                }, enumerable: true },

                /**
                 * @member {number} Picimo.sg.Scene#pixelRatio
                 */
                'pixelRatio' : { get: function () {

                    var parent = this.scene;
                    return parent ? parent.pixelRatio : this.app.devicePixelRatio;

                }, enumerable: true },

                /**
                 * @member {number} Picimo.sg.Scene#devicePixelRatio
                 * @readonly
                 */

                'devicePixelRatio' : { get: function () {

                    var parent = this.scene;
                    return parent ? parent.devicePixelRatio : this.app.devicePixelRatio;

                }, enumerable: true },

            });

        } else {

            initProjection( this, options );

        }


        this.on( "childrenUpdated", onChildrenUpdated );

        this.on( "init", Number.MAX_VALUE, function () {

            if ( this.hasOwnProjection ) {

                this.projectionNeedsUpdate = true;
                updateProjection( this );

            }

        });

        this.on( "frame", updateProjection.bind( this, this ) );


        this.on( options, {
            'onChildrenUpdated'   : 'childrenUpdated',
            'onProjectionUpdated' : 'projectionUpdated',
        });

    }

    Scene.prototype = Object.create( Node.prototype );
    Scene.prototype.constructor = Scene;


    /**
     * @method Picimo.sg.Scene#setSize
     * @param {number} width - Wanted scene width
     * @param {number} height - Wanted scene height
     * @return self
     */

    Scene.prototype.setSize = function ( width, height ) {

        var w = parseFloat( width );
        var h = parseFloat( height );

        if ( w && ! h ) h = w;
        else if ( h && ! w ) w = h;

        if ( w && h && this._desiredWidth !== w || this._desiredHeight !== h ) {

            this._desiredWidth         = w;
            this._desiredHeight        = h;
            this._desiredPixelRatio    = 0;
            this.projectionNeedsUpdate = true;

            updateProjection( this );

        }

        return this;

    };


    function initProjection ( scene, options ) {

        utils.object.definePropertiesPublicRO( scene, {

            projection       : new math.Matrix4(),
            hasOwnProjection : true

        });

        scene.projectionNeedsUpdate = true;

        scene._desiredPixelRatio = options.pixelRatio ? parseFloat( options.pixelRatio ) : ( scene.isRoot ? 1 : 0 );
        scene._desiredWidth      = options.width ? parseFloat( options.width ) : 0;
        scene._desiredHeight     = options.height ? parseFloat( options.height ) : 0;

        Object.defineProperties( scene, {

            'width': {

                get: function () {

                    return this._computedWidth ? this._computedWidth : this._desiredWidth;

                },

                /*
                set: function ( w ) {

                    var desiredWidth = parseFloat( w );

                    if ( this._desiredWidth !== desiredWidth ) {

                        this._desiredWidth = desiredWidth;

                        if ( desiredWidth ) this._desiredPixelRatio = 0;

                        this.projectionNeedsUpdate = true;

                    }

                },
                */

                enumerable: true

            },

            'height': {

                get: function () {

                    return this._computedHeight ? this._computedHeight : this._desiredHeight;

                },

                /*
                set: function ( h ) {

                    var desiredHeight = parseFloat( h );

                    if ( this._desiredHeight !== desiredHeight ) {

                        this._desiredHeight = desiredHeight;

                        if ( desiredHeight ) this._desiredPixelRatio = 0;

                        this.projectionNeedsUpdate = true;

                    }

                },
                */

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

            }

        });

        updateProjection( scene );

    }


    function updateProjection ( scene ) {

        if ( ! scene.hasOwnProjection ) return;

        var factor;

        if ( scene._desiredWidth && scene._desiredHeight ) {

            var appRatio = scene.app.height / scene.app.width;            // <1 : landscape, >1 : portrait
            var sceneRatio = scene._desiredHeight / scene._desiredWidth;

            if ( appRatio < sceneRatio ) {

                factor = scene._desiredHeight / scene.app.height;
                scene._computedWidth  = factor * scene.app.width;
                scene._computedHeight = scene._desiredHeight;

            } else if ( appRatio > sceneRatio ) {

                factor = scene._desiredWidth / scene.app.width;
                scene._computedWidth  = scene._desiredWidth;
                scene._computedHeight = factor * scene.app.height;

            } else {

                scene._computedWidth  = scene._desiredWidth;
                scene._computedHeight = scene._desiredHeight;

            }

            scene._computedPixelRatio = ( scene.app.width / scene._computedWidth ) / scene.app.devicePixelRatio;

        } else if ( scene._desiredPixelRatio ) {

            var parentScene = scene.scene;
            var ratio = parentScene ? parentScene.pixelRatio : scene.app.devicePixelRatio;

            factor = scene._desiredPixelRatio * ratio;

            var master = parentScene ? parentScene : scene.app;

            scene._computedWidth  = master.width / factor;
            scene._computedHeight = master.height / factor;

        }

        scene.devicePixelRatio = scene.app.width / scene._computedWidth;
        scene.projectionNeedsUpdate = false;

        scene.projection.ortho( scene.width, scene.height );

        /**
         * Announce a projection matrix change.
         * @event Picimo.sg.Scene#projectionUpdated
         * @memberof Picimo.sg.Scene
         * @param {Picimo.math.Matrix4} - The changed projection matrix.
         */

        scene.emit( "projectionUpdated", scene.projection );

    }


    Object.defineProperties( Scene.prototype, {

        'renderPrio': {

            get: function () { return this._renderPrio; },

            set: function ( prio ) {

                this._renderPrio = parseFloat( prio );

                if ( this.parent ) this.parent.emit( "childrenUpdated" );

            },

            enumerable: true

        },


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


    Scene.prototype.addChild = function ( node ) {

        Node.prototype.addChild.call( this, node );

        /**
         * Announce a children update.
         * @event Picimo.sg.Scene#childrenUpdated
         * @memberof Picimo.sg.Scene
         */

        this.emit( 'childrenUpdated' );

        return node;

    };


    function onChildrenUpdated () {

        this.children = this.children.sort( sortByRenderPrio );

    }

    function sortByRenderPrio ( a, b ) {

        return -a.renderPrio - ( -b.renderPrio );

    }


    module.exports = Scene;

})();
