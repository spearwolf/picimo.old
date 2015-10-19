'use strict';

import AABB2 from './aabb2';

/**
 * @class Picimo.core.Viewport
 * @extends Picimo.core.AABB2
 * @param {number} x - x
 * @param {number} y - y
 * @param {number} width - width
 * @param {number} height - height
 */

export default function Viewport ( x, y, width, height ) {

    var min_x = parseInt( x, 10 );
    var min_y = parseInt( y, 10 );

    AABB2.call( this,
            min_x, ( min_x + parseInt( width, 10 ) - 1 ),
            min_y, ( min_y + parseInt( height, 10 ) - 1 ) );

}

Viewport.prototype = Object.create( AABB2.prototype );
Viewport.prototype.constructor = Viewport;


Object.defineProperties( Viewport.prototype, {

    /**
     * @member {Picimo.core.Viewport} Picimo.core.Viewport#x
     */

    x: {
        get: function () {

            return this.min_x;

        },
        set: function ( x ) {

            var w = this.width;

            this.min_x = x;
            this.max_x = x + w - 1;

        },
        enumerable: true
    },

    /**
     * @member {Picimo.core.Viewport} Picimo.core.Viewport#y
     */

    y: {
        get: function () {

            return this.min_y;

        },
        set: function ( y ) {

            var h = this.height;

            this.min_y = y;
            this.max_y = y + h - 1;

        },
        enumerable: true
    },

    /**
     * @member {Picimo.core.Viewport} Picimo.core.Viewport#width
     */

    'width': {
        get: function () { return this.max_x - this.min_x + 1; },
        set: function ( w ) {

            this.max_x = this.min_x + w - 1;

        },
        enumerable: true
    },

    /**
     * @member {Picimo.core.Viewport} Picimo.core.Viewport#height
     */

    'height': {
        get: function () { return this.max_y - this.min_y + 1; },
        set: function ( h ) {

            this.max_y = this.min_y + h - 1;

        },
        enumerable: true
    },

});

