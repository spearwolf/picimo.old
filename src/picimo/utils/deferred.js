(function(){
    "use strict";

    var Promise      = require( './promise' );
    var object_utils = require( './object_utils' );

    /**
     * @class Picimo.utils.Deferred
     * @summary
     * A simple and generic deferred interface.
     * @param {Object} obj - Any object.
     */

    function Deferred ( obj ) {

        object_utils.definePropertyPrivateRO( this, '_obj', obj );

        this._ready = false;

        var deferred = this;

        /**
         * @member {Picimo.utils.Promise} Picimo.utils.Deferred#promise
         */

        object_utils.definePropertyPublicRO( this, 'promise', new Promise( function ( resolve ) {

            object_utils.definePropertyPrivate( deferred, '_resolve', resolve );

        }));


        Object.defineProperties( obj, {
        
            'ready': {

                get: function () { return deferred._ready; },

                set: function ( ready ) {

                    if ( ! deferred._ready && !! ready ) {
                    
                        deferred._ready = true;
                        
                        if ( deferred._resolve ) {
                       
                            deferred._resolve( deferred._obj );
                            deferred._resolve = null;

                        }
                    
                    } else if ( !! deferred._ready && ! ready ) {
                    
                        deferred._ready = false;
                    
                    }
                
                }
            
            }
        
        });

    }


    /**
     * @memberof Picimo.utils.Deferred
     * @function make
     * @static
     * @param {Object} obj
     * @return obj
     */
    Deferred.make = function ( obj ) {

        object_utils.definePropertyPublicRO( obj, 'deferred', new Deferred( obj ) );
        return obj;

    };


    module.exports = Deferred;

})();
