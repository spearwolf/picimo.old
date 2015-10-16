'use strict';

import object_utils from './object_utils';

// usage:
//
//    var foo = {}
//    Deferred.make(foo);
//
//    foo.ready               // => false
//    foo.deferred.promise    // pending
//
//    foo.ready = true        // fulfill the promise -> foo.deferred._resolve( foo )
//

export default function Deferred ( obj ) {

    object_utils.definePropertyPrivateRO( this, '_obj', obj );

    this._ready = false;

    var deferred = this;

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


Deferred.make = function ( obj ) {

    object_utils.definePropertyPublicRO( obj, 'deferred', new Deferred( obj ) );
    return obj;

};

