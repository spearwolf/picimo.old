(function(){
    "use strict";

    /**
     * @namespace Picimo.utils
     * @summary
     * Helper functions, utilities and 3rd-party libraries.
     */

    module.exports = {

        /**
         * @namespace Picimo.utils.object
         * @summary
         * Common object properties helper functions.
         */
        object : require( './object_utils' ),

        Deferred : require( './deferred' ),

        /**
         * @class Picimo.utils.Map
         *
         * @summary
         *   ES6 Map
         *
         * @description
         *   An ES6 Map Implementation.
         *   This is the *native* Implementation of your javascript environment or the polyfill/shim of the *core-js* library.
         */
        Map : require( './map' ),

        /**
         * @class Picimo.utils.Promise
         *
         * @summary
         *   ES6 Promise
         *
         * @description
         *   An ES6 Promise Implementation.
         *   This is the *native* Implementation of your javascript environment or the polyfill/shim of the *core-js* library.
         */
        Promise : require( './promise' ),

        /**
         * @namespace Picimo.utils.glMatrix
         *
         * @summary
         *   The fantastic <b>gl-matrix</b> library.
         *
         * @see
         * https://github.com/toji/gl-matrix
         *
         */
        glMatrix : require( 'gl-matrix' ),

        /**
         * @class Picimo.utils.Color
         *
         * @summary
         *   The fantastic color management API <b>net.brehaut.Color</b>
         *
         * @see
         * https://github.com/brehaut/color-js
         *
         */
        Color : require( 'color-js' ),

        /**
         * @private
         */
        addGlxProperty : require( './add_glx_property' ),

        /**
         * @private
         */
        addUid : require( './add_uid' )

    };

})();
