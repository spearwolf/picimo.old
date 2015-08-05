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
     * @param {string} [options.name]
     * @param {number} [options.renderPrio] - The render priority determinates the render order of the child nodes.
     * @param {function} [options.onInit]
     * @param {function} [options.onInitGl]
     * @param {function} [options.onFrame]
     * @param {function} [options.onRenderFrame]
     * @param {function} [options.onFrameEnd]
     * @param {function} [options.onDestroy]
     * @param {function} [options.onDestroyGl]
     * @param {function} [options.onChildrenUpdated]
     *
     */

    function Node ( app, options ) {

        if ( ! app ) throw new Error( '[Picimo.sg.Node] app is null!' );

        this._readyFunc = null;

        /**
         * @member {number} Picimo.sg.Node#renderPrio
         */

        this._renderPrio = parseFloat( options.renderPrio || 0 );

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
         * @member {string} Picimo.sg.Node#name - The node name (optional).
         */

        this.name = options ? options.name : undefined;

        /**
         * @member {Picimo.sg.Node} Picimo.sg.Node#children - The child nodes array.
         */
        this.children = [];


        events.eventize( this );

        if ( options !== undefined ) {

            this.on( options, {

                'onInit'            : 'init',
                'onInitGl'          : 'initGl',
                'onFrame'           : 'frame',
                'onRenderFrame'     : 'renderFrame',
                'onFrameEnd'        : 'frameEnd',
                'onDestroyGl'       : 'destroyGl',
                'onDestroy'         : 'destroy',
                'onChildrenUpdated' : 'childrenUpdated',

            });

        }

    }

    /**
     * @method Picimo.sg.Node#setReadyFunc
     * @param {function} The *ready function* should return a boolean.
     * @return self
     */

    Node.prototype.setReadyFunc = function ( readyFunc ) {

        this._readyFunc = readyFunc;

        return this;

    };


    /**
     * @method Picimo.sg.Node#addChild
     * @param {Picimo.sg.Node}
     */

    Node.prototype.addChild = function ( node ) {

        this.children.push( node );

        node.parent = this;

        // resort child nodes
        node.children = node.children.sort( sortByRenderPrio );

        /**
         * Announce a children update.
         * @event Picimo.sg.Node#childrenUpdated
         * @memberof Picimo.sg.Node
         */

        this.emit( 'childrenUpdated' );

        return node;

    };

    /**
     * Find a child node by name.
     * @method Picimo.sg.Node#find
     * @param {string} name
     * @return {Picimo.sg.Node}
     */

    Node.prototype.find = function ( name ) {

        if ( name == null ) return;

        if ( this.name === name ) return this;

        var node, i;

        for ( i = 0; i < this.children.length; ++i ) {

                node = this.children[ i ].find( name );

                if ( node ) return node;

        }

    };


    Node.prototype.renderFrame = function () {

        if ( ! this.ready ) return;

        if ( this.state.is( NodeState.CREATE ) ) {

            // create -> initialize

            onInit( this );

        }

        if ( this.state.is( NodeState.READY ) ) {

            // initialize -> ready to render

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
             * This is the first event. Will be called only once and never again.
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
             * Will be called just after *init*. Should only be used to perform webgl related tasks.
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

    function sortByRenderPrio ( a, b ) {

        return -a.renderPrio - ( -b.renderPrio );

    }




    Object.defineProperties( Node.prototype, {

        'renderPrio': {

            get: function () { return this._renderPrio; },

            set: function ( prio ) {

                this._renderPrio = parseFloat( prio || 0 );

                if ( this.parent ) this.parent.emit( "childrenUpdated" );

            },

            enumerable: true

        },

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
         * A node is *not* ready if ..
         * 1. the state is set to *destroyed* or *error*
         * 2. you explicitly set it to *false* (but default is *true*)
         * 3. you defined a *ready function* ( via `setReadyFunc` ) and the function returned false
         *
         * If a node is not ready, it will be ignored by the renderloop (no init or frame or .. events).
         */
        'ready': {

            get: function () {

                return ( ( !! this._ready ) &&
                        ( ! this.state.is( NodeState.ERROR|NodeState.DESTROYED )) &&
                        ( ! this._readyFunc || !! this._readyFunc() ) );

            },

            set: function ( ready ) {

                this._ready = !! ready;

            },

            enumerable: true

        }

    });


    module.exports = Node;

})();
