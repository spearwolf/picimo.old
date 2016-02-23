'use strict';

import * as utils from '../utils';

/**
 * @class Picimo.sg.NodeState
 * @param {number} [initialValue=0] - The initial state
 */
export default function NodeState ( initialValue ) {

    this.value = initialValue | 0;

    Object.seal( this );

}

/**
 * @method Picimo.sg.NodeState#is
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
 * @method Picimo.sg.NodeState#set
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

    var states = [];

    if ( this.is( NodeState.CREATE ) ) states.push( 'CREATE' );
    if ( this.is( NodeState.INIT ) ) states.push( 'INIT' );
    if ( this.is( NodeState.READY ) ) states.push( 'READY' );
    if ( this.is( NodeState.ERROR ) ) states.push( 'ERROR' );
    if ( this.is( NodeState.DESTROYED ) ) states.push( 'DESTROYED' );

    return "[" + states.join( "," ) + "]";

};


utils.object.definePropertiesPublicRO( NodeState, {

    /**
     * @memberof Picimo.sg.NodeState
     * @constant
     * @static
     */
    CREATE : 1,

    /**
     * @memberof Picimo.sg.NodeState
     * @constant
     * @static
     */
    INIT : 2,

    /**
     * @memberof Picimo.sg.NodeState
     * @constant
     * @static
     */
    READY : 4,

    /**
     * @memberof Picimo.sg.NodeState
     * @constant
     * @static
     */
    ERROR : 8,

    /**
     * @memberof Picimo.sg.NodeState
     * @constant
     * @static
     */
    DESTROYED : 16

});


Object.freeze( NodeState );

