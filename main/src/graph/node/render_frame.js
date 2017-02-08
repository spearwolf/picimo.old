/* jshint esversion:6 */
import NodeState from '../node_state';
import { definePropertyPublicRO } from '../../utils/obj_props';

/**
 * @ignore
 */
export default function renderFrame () {

    if ( ! this.ready ) return;

    if (this.state.is( NodeState.DESTROYED )) return;

    if (this.state.is( NodeState.CREATE )) {

        onInit(this); // create -> initialize

    }

    if (this.state.is( NodeState.READY )) {

        // initialize -> ready to render

        if (this.display) {

            try {

                /*
                 * Is called only if node is *ready* and *display*-able.
                 */
                this.emit( 'frame' );

                /*
                 * Is called just after the *frame* event and before the *frameEnd* event. The *render commands* should be generated here.
                 */
                this.emit( 'renderFrame' );

            } catch (err) {

                console.error( '[frame,renderFrame]', err );
                this.ready = false;
                return;

            }

            for (var i = 0; i < this.children.length; ++i) {

                this.children[i].renderFrame();

            }

            try {

                /**
                 * Is called after the on *frame* and *renderFrame* events.
                 */
                this.emit( 'frameEnd' );

            } catch (err) {

                console.error( '[frameEnd]', err );
                this.ready = false;

            }

        }

    }

}  // --- renderFrame


/**
 * @ignore
 */
function onInit (node) {

    node.state.set( NodeState.INIT );

    var initPromises = [];

    try {

        /*
         * This is the first event. Will be called only once and never again.
         */
        node.emit( 'init', makeDoneFunc( initPromises, node ) );

        Promise.all( initPromises ).then( onInitGl.bind( node, node ), onFail.bind( node, node ) );

    } catch ( err ) {

        console.error( '[init]', err );
        this.ready = false;

    }

}

/**
 * @ignore
 */
function onInitGl (node) {

    definePropertyPublicRO(node, 'initDone', true);

    if ( ! node.ready ) return;

    var initGlPromises = [];

    try {

        /*
         * Will be called just after *init*. Should only be used to perform render related tasks.
         */
        node.emit( 'initGl', makeDoneFunc( initGlPromises, node ) );

        Promise.all( initGlPromises ).then( onInitDone.bind( node, node ), onFail.bind( node, node ) );

    } catch ( err ) {

        console.error( '[initGl]', err );
        this.ready = false;

    }
}

/**
 * @ignore
 */
function onInitDone (node) {

    definePropertyPublicRO(node, 'initGlDone', true);

    if ( node.ready ) {

        node.state.set( NodeState.READY );

    }

}

/**
 * @ignore
 */
function makeDoneFunc (arr) {

    return function ( promise ) {

        if ( promise ) {

            if ( typeof promise === 'function' ) {

                promise = new Promise( promise );

            }

            arr.push( promise );

        }

    };

}

/**
 * @ignore
 */
function onFail (node) {

    if ( node.ready ) {

        node.state.set( NodeState.ERROR );

    }

}

