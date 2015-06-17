(function(){
    "use strict";

    var utils     = require( '../utils' );
    var NodeState = require( './node_state' );

    /**
     * @class Picimo.sg.Node
     * @classdesc
     * The generic base class for all scene graph nodes.
     *
     * ### States and Events
     * <img src="images/node-events.png" srcset="images/node-events.png 1x,images/node-events@2x.png 2x" alt="Node Events and States">
     *
     * @param {Picimo.App} app - The app instance
     * @param {Object} [options] - The options
     * @param {Picimo.sg.Scene} [options.scene] - The parent scene
     * @param {boolean} [options.display=true]
     * @param {boolean} [options.isRoot=false]
     * @param {boolean} [options.ready=true]
     * @param {function} [options.onInit]
     * @param {function} [options.onInitGl]
     * @param {function} [options.onResize]
     * @param {function} [options.onFrame]
     * @param {function} [options.onRenderFrame]
     * @param {function} [options.onFrameEnd]
     * @param {function} [options.onDestroy]
     * @param {function} [options.onDestroyGl]
     *
     */

    function Node ( app, options ) {

        if ( ! app ) throw new Error( '[Picimo.sg.Node] app is null!' );

        /**
         * @member {Picimo.App} Picimo.sg.Node#app - The app instance
         * @readonly
         */
        utils.object.definePropertyPublicRO( this, 'app', app );

        /**
         * @member {Picimo.sg.NodeState} Picimo.sg.Node#state
         */
        this.state = new NodeState( NodeState.CREATE );

        /**
         * @member {boolean} Picimo.sg.Node#display
         * @description
         * If set to *false* the node won't be rendered. The *frame*, *renderFrame* and *frameEnd* events won't be emitted.
         * BUT initialization will be happen. (If you don't want the node to initialize set the *ready* attribute to *false*).
         */
        this.display = ( ! options ) || ( options.display !== false );

        /**
         * @member {Picimo.sg.Node} Picimo.sg.Node#scene - The parent scene.
         */
        this.scene = ( options && options.scene != null ) ? options.scene : null;

        /**
         * @member {Picimo.sg.Node} Picimo.sg.Node#isRoot - *True* if this is the root node of the scene graph.
         * @readonly
         */
        utils.object.definePropertyPublicRO( this, 'isRoot', ( ( !! options ) && options.isRoot === true ) );

        this._ready = ( ! options ) || options.ready !== false;

        if ( options !== undefined ) {

            this.on( options, {
                'onInit'       : 'init',
                'onInitGl'     : 'initGl',
                'onResize'     : 'resize',
                'onFrame'      : 'frame',
                'onRenderFrame': 'renderFrame',
                'onFrameEnd'   : 'frameEnd',
                'onDestroyGl'  : 'destroyGl',
                'onDestroy'    : 'destroy',
            });

        }

    }

    Node.prototype.renderFrame = function () {

        if ( ! this.ready ) return;

        if ( this.state.is( NodeState.CREATE ) ) {

            // create -> initialize

            onInit( this );

        }

        if ( this.state.is( NodeState.READY ) ) {

            // initialize -> ready to render

            // TODO resize

            if ( this.display ) {

                /**
                 * Is called only if node is *ready* and *display*-able.
                 * @event Picimo.sg.Node#frame
                 * @memberof Picimo.sg.Node
                 */
                this.emit( 'frame' );

                /**
                 * Is called just after the *frame* event and before the *frameEnd* event. The *render commands* should be generated here.
                 * @event Picimo.sg.Node#renderFrame
                 * @memberof Picimo.sg.Node
                 */
                this.emit( 'renderFrame' );

                /**
                 * Is called after the on *frame* and *renderFrame* events.
                 * @event Picimo.sg.Node#frameEnd
                 * @memberof Picimo.sg.Node
                 */
                this.emit( 'frameEnd' );

            }

        }

    };

    /**
     * @method Picimo.sg.Node#destroy
     */
    Node.prototype.destroy = function () {

        if ( this.state.is( NodeState.DESTROYED ) ) return;

        this.state.set( NodeState.DESTROYED );

        if ( this._initialized ) {

            try {

                /**
                 * Is only called if the *init* event successfully resolved. *Even if the *initGl* event failed*.
                 * Is called before the *destroy* event.
                 * @event Picimo.sg.Node#destroyGl
                 * @memberof Picimo.sg.Node
                 */
                this.emit( 'destroyGl' );

            } catch ( err ) {

                console.error( 'destroyGl', err );

            }

            try {

                /**
                 * Is only called if the *init* event successfully resolved and just after the *destroyGl* event.
                 * @event Picimo.sg.Node#destroy
                 * @memberof Picimo.sg.Node
                 */
                this.emit( 'destroy' );

            } catch ( err ) {

                console.error( 'destroy', err );

            }

        }

    };

    function onInit ( node, finish ) {

        node.state.set( NodeState.INIT );

        var initPromises = [];

        /**
         * This is the first event. Is called only once.
         * @event Picimo.sg.Node#init
         * @memberof Picimo.sg.Node
         */
        node.emit( 'init', makeDoneFunc( initPromises, node ) );

        utils.Promise.all( initPromises ).then( onInitGl.bind( node, node ), onFail.bind( node, node ) );

    }

    function onInitGl( node ) {

        node._initialized = true;

        if ( ! node.ready ) return;

        var initGlPromises = [];

        /**
         * Is called just after *init*. Should only be used to perform webgl related tasks.
         * @event Picimo.sg.Node#initGl
         * @memberof Picimo.sg.Node
         */
        node.emit( 'initGl', makeDoneFunc( initGlPromises, node ) );

        utils.Promise.all( initGlPromises ).then( onInitDone.bind( node, node ), onFail.bind( node, node ) );

    }

    function onInitDone ( node ) {

        if ( node.ready ) {

            node.state.set( NodeState.READY );

        }

    }

    function makeDoneFunc ( arr ) {

        return function ( promise ) {

            if ( promise ) {

                if ( typeof promise === 'function' ) {

                    promise = new utils.Promise( promise );

                }

                arr.push( promise );

            }

        };

    }

    function onFail ( node ) {

        if ( node.ready ) {

            node.state.set( NodeState.ERROR );

        }

    }


    utils.custom_event.eventize( Node.prototype );

    Node.prototype.scene          = null;
    Node.prototype.display        = true;
    Node.prototype.isRoot         = false;
    Node.prototype._ready         = true;
    Node.prototype._initialized   = false;

    Object.defineProperties( Node.prototype, {

        /**
         * @member {boolean} Picimo.sg.Node#ready
         * @description
         * A node ist *not* ready if ..
         * 1. the state is set to *destroyed* or *error*
         * 2. the parent *scene* is set or if not the *isRoot* flag is set to *true*
         * 3. you explicitly set it to *false* (but default is *true*)
         */
        'ready': {

            get: function () {

                return ( ( !! this._ready ) &&
                        ( ! this.state.is( NodeState.ERROR|NodeState.DESTROYED )) &&
                        ( this.scene != null || this.isRoot ) );

            },

            set: function ( ready ) {

                this._ready = !! ready;

            },

            enumerable: true

        }

    });


    module.exports = Node;

})();
