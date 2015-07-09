(function(){
    "use strict";

    /**
     * @namespace Picimo.math
     * @summary
     * Math helper functions.
     */

    module.exports = {

        Matrix4: require( './matrix4' ),

        /**
         * @function Picimo.math.maxOf
         * @param {number} a
         * @param {number} b
         * @return {number}
         */

        maxOf: function ( a, b ) {
        
            return a > b ? a : b;
        
        },

        /**
         * @function Picimo.math.findNextPowerOfTwo
         * @param {number} x
         * @return {number}
         */

        findNextPowerOfTwo: function ( x ) {
        
            var p = 1;

            while ( x > p ) {
            
                p <<= 1;
            
            }
        
            return p;
        
        },

        /**
         * @function Picimo.math.isPowerOfTwo
         * @param {number} n
         * @return {boolean}
         */

        isPowerOfTwo: function ( n ) {
        
            return n !== 0 && ( n & ( n - 1 ) ) === 0;
        
        }

    };

})();
