/* jshint esversion:6 */
import { definePropertiesPublicRO } from '../utils/obj_props';

export default function NodeState (initialStateValue) {

    if (!(this instanceof NodeState)) {
        return new NodeState(initialStateValue);
    }

    this.value = initialStateValue | 0;
    Object.seal( this );

}

/**
 * @param {number} state
 * @return {boolean}
 * @example
 * state.is( NodeState.CREATE | NodeState.INIT )
 */
NodeState.prototype.is = function ( state ) {

    return ( this.value & ( state | 0 ) ) > 0; //=== state;

};

NodeState.prototype.isNot = function ( state ) {

    return ! this.is(state);

};

/**
 * @param {number} state
 * @example
 * state.set( NodeState.READY )
 * @return *self*
 */
NodeState.prototype.set = function ( state ) {

    this.value = state | 0;
    return this;

};


NodeState.prototype.toString = function () {

    let states = [];

    if ( this.is( NodeState.CREATE ) ) states.push( 'CREATE' );
    if ( this.is( NodeState.INIT ) ) states.push( 'INIT' );
    if ( this.is( NodeState.READY ) ) states.push( 'READY' );
    if ( this.is( NodeState.ERROR ) ) states.push( 'ERROR' );
    if ( this.is( NodeState.DESTROYED ) ) states.push( 'DESTROYED' );

    return "[" + states.join( "," ) + "]";

};


definePropertiesPublicRO( NodeState, {

    CREATE    : 1,
    INIT      : 2,
    READY     : 4,
    ERROR     : 8,
    DESTROYED : 16

});


Object.freeze( NodeState );

