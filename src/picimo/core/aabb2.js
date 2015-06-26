(function(){
    "use strict";

    //var vec2 = require( 'gl-matrx' ).vec2;

    /**
     * Represents a 2d axis aligned boundary box.
     * @class Picimo.core.AABB2
     * @param {number} [x0=0] - x0
     * @param {number} [x1=0] - x1
     * @param {number} [y0=0] - y0
     * @param {number} [y1=0] - y1
     */

    function AABB2 ( x0, x1, y0, y1 ) {

        if ( x0 === undefined ) x0 = 0;
        if ( y0 === undefined ) y0 = 0;
        if ( x1 === undefined ) x1 = 0;
        if ( y1 === undefined ) y1 = 0;

        /**
         * @member {Picimo.core.AABB2} Picimo.core.AABB2#min_x - Minimum x value
         */

        /**
         * @member {Picimo.core.AABB2} Picimo.core.AABB2#max_x - Maximum x value
         */

        if ( x0 < x1 ) {

            this.min_x = x0;
            this.max_x = x1;

        } else {

            this.min_x = x1;
            this.max_x = x0;

        }

        /**
         * @member {Picimo.core.AABB2} Picimo.core.AABB2#min_y - Minimum y value
         */

        /**
         * @member {Picimo.core.AABB2} Picimo.core.AABB2#max_y - Maximum y value
         */

        if ( y0 < y1 ) {

            this.min_y = y0;
            this.max_y = y1;

        } else {

            this.min_y = y1;
            this.max_y = y0;

        }

        Object.seal( this );

    }


    Object.defineProperties( AABB2.prototype, {

        /**
         * @member {Picimo.core.AABB2} Picimo.core.AABB2#width
         * @readonly
         */
        'width': {
            get: function () { return this.max_x - this.min_x; },
            enumerable: true
        },

        /**
         * @member {Picimo.core.AABB2} Picimo.core.AABB2#height
         * @readonly
         */
        'height': {
            get: function () { return this.max_y - this.min_y; },
            enumerable: true
        }

    });


    /**
     * Extend the boundary box.
     * @method Picimo.core.AABB2#addPoint
     * @param {number} x - x
     * @param {number} y - y
     */

    AABB2.prototype.addPoint = function ( x, y ) {

        if ( x < this.min_x ) {

            this.min_x = x;

        } else if ( x > this.max_x ) {

            this.max_x = x;

        }

        if ( y < this.min_y ) {

            this.min_y = y;

        } else if ( y > this.max_y ) {

            this.max_y = y;

        }

    };


    /**
     * Determinates wether or the 2d point is inside this AABB.
     * @method Picimo.core.AABB2#isInside
     * @param {number} x - x
     * @param {number} y - y
     * @return {boolean}
     */

    AABB2.prototype.isInside = function ( x, y ) {

        if ( x >= this.min_x && x <= this.max_x &&
             y >= this.min_y && y <= this.max_y ) {

            return true;

        }

        return false;

    };


    /**
     * Determinates wether or not this AABB intersects *aabb*.
     * @method Picimo.core.AABB2#isIntersection
     * @param {AABB2} aabb - aabb
     * @return {boolean}
     */

    AABB2.prototype.isIntersection = function ( aabb ) {

        if ( aabb.max_x < this.min_x || aabb.min_x > this.max_x ||
             aabb.max_y < this.min_y || aabb.min_y > this.max_y ) {

            return false;

        }

        return true;

    };


    module.exports = AABB2;

})();
