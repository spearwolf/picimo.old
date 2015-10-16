'use strict';

/**
 * @namespace Picimo.utils
 * @summary
 * Helper functions, utilities and 3rd-party libraries.
 */

module.exports = {

    /**
     * @namespace Picimo.utils.object
     * @summary
     *   Common object properties helper functions.
     */
    object: require( './object_utils' ),

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
    glMatrix: require( 'gl-matrix' ),

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
    Color: require( 'color-js' ),


    addReadyPromise: require( './add_ready_promise' ),
    addGlxProperty: require( './add_glx_property' ),
    addUid: require( './add_uid' ),

    /**
     * @private
     */
    ObjectPool: require( './object_pool' ),

    /**
     * @private
     */
    Queue: require( './queue' )

};

