(function(){
    "use strict";

    var utils     = require( '../utils' );
    var events    = require( '../events' );
    var NodeState = require( './node_state' );

    /**
     * @class Picimo.sg.Node
     * @extends Picimo.events.CustomEvent
     *
     * @classdesc
     * The generic base class for all scene graph nodes.
     *
     * ### States and Events
     * <img src="images/node-events.png" srcset="images/node-events.png 1x,images/node-events@2x.png 2x" alt="Node Events and States">
     *
     *
     * @param {Picimo.App} app - The app instance
     * @param {Object} [options] - The options
     * @param {boolean} [options.display=true]
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
         * @member {Picimo.App} Picimo.sg.Node#parent - The parent node.
         */

        this._ready = ( ! options ) || options.ready !== false;

        /**
         * @member {Picimo.sg.Node} Picimo.sg.Node#children - The child nodes array.
         */
        this.children = [];

    
        events.eventize( this );

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

    /**
     * @method Picimo.sg.Node#addChild
     * @param {Picimo.sg.Node}
     */
    Node.prototype.addChild = function ( node ) {

        this.children.push( node );

        node.parent = this;

        return node;

    };

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

                try {

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

                } catch ( err ) {

                    console.error( '[frame,renderFrame]', err );

                    this.ready = false;
                    return;

                }


                for ( var i = 0; i < this.children.length; ++i ) {

                    this.children[ i ].renderFrame();

                }


                try {

                    /**
                     * Is called after the on *frame* and *renderFrame* events.
                     * @event Picimo.sg.Node#frameEnd
                     * @memberof Picimo.sg.Node
                     */
                    this.emit( 'frameEnd' );

                } catch ( err ) {

                    console.error( '[frameEnd]', err );

                    this.ready = false;

                }

            }

        }

    };

    /**
     * @method Picimo.sg.Node#destroy
     */
    Node.prototype.destroy = function () {

        if ( this.state.is( NodeState.DESTROYED ) ) return;


        for ( var i = 0; i < this.children.length; ++i ) {

            this.children[ i ].destroy();

        }


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

                console.error( '[destroyGl]', err );

            }

            try {

                /**
                 * Is only called if the *init* event successfully resolved and just after the *destroyGl* event.
                 * @event Picimo.sg.Node#destroy
                 * @memberof Picimo.sg.Node
                 */
                this.emit( 'destroy' );

            } catch ( err ) {

                console.error( '[destroy]', err );

            }

        }

    };

    function onInit ( node ) {

        node.state.set( NodeState.INIT );

        var initPromises = [];

        try {

            /**
             * This is the first event. Is called only once.
             * @event Picimo.sg.Node#init
             * @memberof Picimo.sg.Node
             */
            node.emit( 'init', makeDoneFunc( initPromises, node ) );

            utils.Promise.all( initPromises ).then( onInitGl.bind( node, node ), onFail.bind( node, node ) );

        } catch ( err ) {

            console.error( '[init]', err );

            this.ready = false;

        }

    }

    function onInitGl ( node ) {

        node._initialized = true;

        if ( ! node.ready ) return;

        var initGlPromises = [];

        try {

            /**
             * Is called just after *init*. Should only be used to perform webgl related tasks.
             * @event Picimo.sg.Node#initGl
             * @memberof Picimo.sg.Node
             */
            node.emit( 'initGl', makeDoneFunc( initGlPromises, node ) );

            utils.Promise.all( initGlPromises ).then( onInitDone.bind( node, node ), onFail.bind( node, node ) );

        } catch ( err ) {

            console.error( '[initGl]', err );

            this.ready = false;

        }
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



    Object.defineProperties( Node.prototype, {

        /**
         * @member {Picimo.sg.Node} Picimo.sg.Node#isRoot - *True* if this node has no parent.
         * @readonly
         */
        'isRoot': {
        
            get: function () { return ! this.parent; },
            enumerable: true

        },

        /**
         * @member {boolean} Picimo.sg.Node#ready
         * @description
         * A node ist *not* ready if ..
         * 1. the state is set to *destroyed* or *error*
         * 3. you explicitly set it to *false* (but default is *true*)
         */
        'ready': {

            get: function () {

                return ( ( !! this._ready ) &&
                        ( ! this.state.is( NodeState.ERROR|NodeState.DESTROYED )) );

            },

            set: function ( ready ) {

                this._ready = !! ready;

            },

            enumerable: true

        }

    });


    module.exports = Node;

})();
