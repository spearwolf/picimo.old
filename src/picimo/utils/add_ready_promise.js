'use strict';

// usage:
//
//    var foo = {}
//    addReadyPromise(foo);
//
//    foo.ready         // => false
//    foo.promise       // pending
//
//    foo.promise.then(function (foo) { /* foo is fulfilled */ })
//
//    foo.ready = true  // fulfill promise with foo as value
//

export default function addReadyPromise (obj) {

    var _ready = false;
    var _resolver = null;

    Object.defineProperties(obj, {

        ready: {

            get: function () { return _ready },
            set: function ( ready ) {

                if (!_ready && ready) {
                    _ready = true;

                    if (_resolver) {
                        _resolver();
                        _resolver = null;
                    }

                } else if (_ready && !ready) {
                    this._ready = false;
                }

            },
            enumerable: true,

        },

        promise: {

            value: new Promise(function (resolve) {
                _resolver = resolve.bind(obj, obj);
                if (_ready) {
                    _resolver();
                    _resolver = null;
                }
            }),
            enumerable: true,

        }

    });

    return obj;

}

