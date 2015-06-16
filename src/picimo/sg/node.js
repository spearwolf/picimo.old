(function(){
    "use strict";

    var utils     = require( '../utils' );
    var NodeState = require( './node_state' );

    /**
     * @class Picimo.sg.Node
     * @description
     * The generic base class for all scene graph nodes.
     *
     * @param {Picimo.App} app - The app instance
     * @param {Object} [options] - The options
     * @param {Picimo.sg.Scene} [options.scene] - The parent scene
     * @param {boolean} [options.display=true]
     * @param {boolean} [options.isRoot=false]
     * @param {function} [options.onInit]
     * @param {function} [options.onInitGl]
     * @param {function} [options.onResize]
     * @param {function} [options.onFrame]
     * @param {function} [options.onRenderFrame]
     * @param {function} [options.onFrameEnd]
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

        if ( options !== undefined ) {

            this.on( options, {
                'onInit'       : 'init',
                'onInitGl'     : 'initGl',
                'onResize'     : 'resize',
                'onFrame'      : 'frame',
                'onRenderFrame': 'renderFrame',
                'onFrameEnd'   : 'frameEnd',
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

                this.emit( 'frame' );
                this.emit( 'renderFrame' );
                this.emit( 'frameEnd' );

            }

        }

    };

    function onInit ( node, finish ) {

        node.state.set( NodeState.INIT );

        var initPromises = [];
        node.emit( 'init', initPromises.push.bind( initPromises ) );

        utils.Promise.all( initPromises ).then( onInitGl.bind( node, node ), onFail.bind( node, node ) );

    }

    function onInitGl( node ) {

        if ( ! node.ready ) return;

        var initGlPromises = [];
        node.emit( 'initGl', initGlPromises.push.bind( initGlPromises ) );

        utils.Promise.all( initGlPromises ).then( onInitDone.bind( node, node ), onFail.bind( node, node ) );

    }

    function onInitDone ( node ) {

        if ( node.ready ) {

            node.state.set( NodeState.READY );

        }

    }

    function onFail ( node ) {

        if ( node.ready ) {

            node.state.set( NodeState.ERROR );

        }

    }


    utils.custom_event.eventize( Node.prototype );

    Node.prototype.scene   = null;
    Node.prototype.display = true;
    Node.prototype.isRoot  = false;

    Object.defineProperties( Node.prototype, {

        /**
         * @member {boolean} Picimo.sg.Node#ready
         */

        'ready': {

            get: function () {

                return ( ! this.state.is( NodeState.ERROR|NodeState.DESTROYED )) && ( this.scene != null || this.isRoot );

            },

            enumerable: true

        }

    });


    module.exports = Node;

})();
