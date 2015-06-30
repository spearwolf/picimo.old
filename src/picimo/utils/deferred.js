(function(){
    "use strict";

    var Promise      = require( './promise' );
    var object_utils = require( './object_utils' );

    /**
     * @class Picimo.utils.Deferred
     * @summary
     * A simple and generic deferred interface.
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

    }

    Object.defineProperties( Deferred.prototype, {
    
        /**
         * @member {boolean} Picimo.utils.Deferred#ready
         */

        'ready': {

            get: function () { return this._ready; },

            set: function ( ready ) {

                if ( ! this._ready && !! ready ) {
                
                    this._ready = true;
                    
                    if ( this._resolve ) {
                   
                        this._resolve( this._obj );
                        this._resolve = null;

                    }
                
                } else if ( !! this._ready && ! ready ) {
                
                    this._ready = false;
                
                }
            
            }
        
        }
    
    });

    /**
     * @method Picimo.utils.Deferred#then
     * @param {function} callback
     */

    Deferred.prototype.then = function ( callback ) {

        if ( this.ready ) {

            callback( this._obj );

        } else {

            var deferred = this;

            this.promise.then( function () {

                callback( deferred._obj );

            });

        }

    };

    /**
     * @method Picimo.utils.Deferred#forward
     * @param {string} propertyName
     * @param {function} callback
     */

    Deferred.prototype.forward = function ( propertyName, callback ) {

        this.then( function ( self ) {

            callback( self[ propertyName ] );
        
        });

    };


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


    /**
     * @memberof Picimo.utils.Deferred
     * @function then
     * @static
     * @param {Object} obj
     * @param {function} callback
     */
    Deferred.then = function ( obj, callback ) {

        if ( obj.deferred !== undefined ) {

            obj.deferred.then( callback );

        } else {

            callback( obj );

        }

    };


    module.exports = Deferred;

})();
