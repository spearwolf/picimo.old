(function(){
    "use strict";

    var utils = require( '../utils' );

    /**
     * @class Picimo.sg.Node
     *
     * @param {Picimo.App} app - The app instance
     * @param {Object} [options] - The options
     *
     */

    function Node ( app, options ) {

        if ( ! app ) throw new Error( '[Picimo.sg.Node] app is null!' );

        utils.object.definePropertyPublicRO( this, 'app', app );

        this._ready = ( ! options ) || options.ready !== false;

    }


    Node.prototype.onFrame = function () {

        if ( ! this.ready ) return;

        // TODO
        // - init
        // - resize

    };


    utils.custom_event.eventize( Node.prototype );

    Object.defineProperties( Node.prototype, {

        /**
         * @member {boolean} Picimo.sg.Node#ready
         */

        'ready': {

            get: function () {

                return this._ready;

            },

            set: function ( ready ) {

                this._ready = !! ready;

            },

            enumerable: true

        }

    });


    module.exports = Node;

})();
