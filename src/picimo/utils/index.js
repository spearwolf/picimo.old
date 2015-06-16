(function(){
    "use strict";

    /**
     * @namespace Picimo.utils
     * @description
     * Helper functions and utilities.
     */

    var core = require( 'core-js/library' );

    module.exports = {

        custom_event : require( './custom_event' ),

        /**
         * @namespace Picimo.utils.object
         * @description
         * Generic object and properties helper functions.
         */
        object : require( './object_utils' ),

        /**
         * @class Picimo.utils.Map
         *
         * @description
         *   An ES6 compatible Map Implementation.
         *   This is the *native* Implementation of your javascript environment or the polyfill/shim of the *core-js* library.
         */
        Map : core.Map,

        /**
         * @class Picimo.utils.Promise
         *
         * @description
         *   An ES6 Promise Implementation.
         *   This is the *native* Implementation of your javascript environment or the polyfill/shim of the *core-js* library.
         */
        Promise : core.Promise,
    };

})();
