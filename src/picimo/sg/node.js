(function(){
    "use strict";

    /**
     * @class Picimo.sg.Node
     *
     * @param {Picimo.App} app - The app instance
     * @param {Object} [options] - The options
     *
     */

    function Node ( app, options ) {

        if ( ! app ) throw new Error( '[Picimo.sg.Node] app is null!' );

        Object.defineProperty( this, 'app', { value: app, enumerable: true });

        this._ready = ( ! options ) || options.ready !== false;

        this.on( 'frame', 99999, onFrame );

    }

    function onFrame () {

        if ( ! this.ready ) return;

        // TODO
        // - init
        // - resize

    }

    require( '../../utils/custom_event' ).eventize( Node.prototype );

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
