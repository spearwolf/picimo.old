'use strict';

import eventize from 'eventize-js';
import * as utils from '../../utils';
import NodeState from '../node_state';
import defineReady from './ready';

export default function Node (app, options = {}) {

    if ( ! app ) {
        throw new Error('[Picimo.sg.Node] app should not be undefined!');
    }

    utils.object.definePropertyPublicRO(this, 'app', app);

    defineReady(this, options.ready !== false);

    this._renderPrio = parseFloat(options.renderPrio || 0);

    this.state = new NodeState( NodeState.CREATE );

    this.display = ( ! options ) || options.display !== false;

    this.name = options.name || undefined;

    setParentNode(this, options.parentNode);

    this.children = [];

    eventize(this);

    this.on('childrenUpdated', eventize.PRIO_MAX, sortChildrenByRenderPrio);

    this.connect( options, {

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

function setParentNode (node, parent) {
    Object.defineProperty(node, 'parentNode', {
        value: ( parent instanceof Node ? parent : null ),
        configurable: true
    });
}

function sortChildrenByRenderPrio () {
    this.children = this.children.sort(sortByRenderPrio);
}

function sortByRenderPrio (a, b) {
    return -a.renderPrio - ( -b.renderPrio );
}


/**
 * @method Picimo.sg.Node#appendChild
 * @param {Picimo.sg.Node}
 */

Node.prototype.appendChild = function (node) {

    if (this.children.indexOf(node) !== -1) return node;

    this.children.push(node);

    setParentNode(node, this);

    /**
     * Announce a children update.
     * @event Picimo.sg.Node#childrenUpdated
     * @memberof Picimo.sg.Node
     */

    this.emit('childrenUpdated');

    return node;

};


Node.prototype.findNode = function (name) {

    if (!name) return;
    if (this.name === name) return this;

    let node, i, len;

    for (i = 0, len = this.children.length; i < len; ++i ) {

        node = this.children[i].findNode(name);
        if (node) {
            return node;
        }

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

        Promise.all( initPromises ).then( onInitGl.bind( node, node ), onFail.bind( node, node ) );

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

        Promise.all( initGlPromises ).then( onInitDone.bind( node, node ), onFail.bind( node, node ) );

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

                promise = new Promise( promise );

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

    'renderPrio': {

        get: function () { return this._renderPrio; },

        set: function ( prio ) {

            this._renderPrio = parseFloat( prio || 0 );

            if ( this.parentNode ) this.parentNode.emit( "childrenUpdated" );

        },

        enumerable: true

    },

    /**
     * @member {Picimo.sg.Node} Picimo.sg.Node#isRootNode - *True* if this node has no parent.
     * @readonly
     */
    'isRootNode': {

        get: function () { return ! this.parentNode; },
        enumerable: true

    },

});

