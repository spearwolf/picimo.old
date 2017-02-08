/* jshint esversion:6 */

// Add the .glx and .gl (alias to glx.gl) properties to an object.
// Returns the object.
//
// foo = {}
// defineGlxProperty(glx)
//
// foo.glx    // => glx
// foo.gl     // => glx.gl
//
export default function (obj) {
    let _glx;

    Object.defineProperties(obj, {
        glx: {
            set: function (glx) {
                _glx = glx;
                Object.defineProperty(this, 'gl', {
                    value: ( typeof glx === 'object' ? glx.gl : undefined ),
                    configurable: true
                });
            },
            get: function () {
                return _glx;
            },
        }
    });

    return obj;
}
