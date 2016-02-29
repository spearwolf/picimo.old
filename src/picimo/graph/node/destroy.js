'use strict';

import NodeState from '../node_state';


export default function destroy () {

    if ( this.state.is( NodeState.DESTROYED ) ) return;


    for ( var i = 0; i < this.children.length; ++i ) {

        this.children[ i ].destroy();

    }


    if ( this.initGlDone ) {

        try {

            /**
             * Is only called if the *init* event successfully resolved. *Even if the *initGl* event failed*.
             * Is called before the *destroy* event.
             * @event Picimo.graph.Node#destroyGl
             * @memberof Picimo.graph.Node
             */
            this.emit( 'destroyGl' );

        } catch ( err ) {

            console.error( '[destroyGl]', err );

        }

    }

    if ( this.initDone ) {

        try {

            /**
             * Is only called if the *init* event successfully resolved and just after the *destroyGl* event.
             * @event Picimo.graph.Node#destroy
             * @memberof Picimo.graph.Node
             */
            this.emit( 'destroy' );

        } catch ( err ) {

            console.error( '[destroy]', err );

        }

    }


    this.state.set( NodeState.DESTROYED );


    if (this.parentNode) {
        this.parentNode.removeChild(this);
    }

}

