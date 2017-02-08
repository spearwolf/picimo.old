/* jshint esversion:6 */

/**
 * @example
 * var foo = {}
 * makeReadyPromise(foo)
 *
 * foo.ready         // => false
 * foo.promise       // pending
 *
 * foo.promise.then(function (foo) { .. })
 *
 * foo.ready = true  // fulfill promise with foo as value
 *
 */

export default function makeReadyPromise (obj) {

    const NTD = function () {};

    let isReady = false;
    let resolvePromise = NTD;

    Object.defineProperties(obj, {

        ready: {

            get: function () { return isReady; },
            set: function ( ready ) {
                if (!isReady && ready) {            // transition false => true
                    isReady = true;
                    resolvePromise();
                } else if (isReady && !ready) {
                    console.error('Oops.. readyPromise transition true => false');
                }
            },
            enumerable: true,

        },

        promise: {

            value: new Promise(function (resolve_) {

                const resolve = resolve_.bind(obj, obj);

                if (isReady) {
                    resolve();
                } else {
                    resolvePromise = function () {
                        resolvePromise = NTD;
                        resolve();
                    };
                }

            }),
            enumerable: true,

        }

    });

    return obj;

}
