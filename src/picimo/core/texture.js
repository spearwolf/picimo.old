'use strict';

/**
 * @class Picimo.core.Texture
 * @param {Picimo.core.Texture} [parent]
 * @param {number} [x=0]
 * @param {number} [y=0]
 * @param {number} [width]
 * @param {number} [height]
 * @example
 * var t = new Picimo.core.Texture;
 * t.image = document.createElement("canvas")
 * t.width                                       // => 300
 * t.height                                      // => 150
 *
 * var tt = new Picimo.core.Texture( t, 30, 15, 100, 100 )
 * t.width                                       // => 100
 *
 */

export default function Texture ( parent, x, y, width, height ) {

    this._parent = parent;
    this._image  = null;
    this._width  = width;
    this._height = height;

    /**
     * @member {number} Picimo.core.Texture#x
     */
    this.x = x != null ? x : 0;

    /**
     * @member {number} Picimo.core.Texture#y
     */
    this.y = y != null ? y : 0;

}


Object.defineProperties( Texture.prototype, {

    /**
     * @member {Picimo.core.Texture} Picimo.core.Texture#parent
     */

    parent: {

        get: function () { return this._parent; },

        set: function ( parent ) {

            this._parent = parent;

        },

        enumerable: true

    },

    /**
     * @member {Picimo.core.Texture} Picimo.core.Texture#root
     * @readonly
     */

    root: {

        get: function () {

            return this._parent ? this._parent : this;

        },

        enumerable: true

    },

    /**
     * @member {image|canvas} Picimo.core.Texture#image
     */

    image: {

        get: function () {

            return this._image ? this._image : ( this._parent ? this._parent.image : null );

        },

        set: function ( image ) {

            this._image = image;

        },

        enumerable: true

    },

    /**
     * @member {number} Picimo.core.Texture#root_width
     * @readonly
     */

    root_width: {

        get: function () {

            var root = this.root;

            if ( this === root ) {

                if ( this._width != null ) {

                    return this._width;

                } else if ( this._image ) {

                    return this._image.width;

                } else {

                    return 0;

                }

            } else {

                return root.root_width;

            }

        },

        enumerable: true

    },

    /**
     * @member {number} Picimo.core.Texture#root_height
     * @readonly
     */

    root_height: {

        get: function () {

            var root = this.root;

            if ( this === root ) {

                if ( this._height != null ) {

                    return this._height;

                } else if ( this._image ) {

                    return this._image.height;

                } else {

                    return 0;

                }

            } else {

                return root.root_height;

            }

        },

        enumerable: true

    },

    /**
     * @member {number} Picimo.core.Texture#width
     */

    width: {

        get: function () {

            if ( this._width != null ) {

                return this._width;

            }

            return this.root_width;

        },

        set: function ( width ) {

            this._width = width;

        },

        enumerable: true

    },

    /**
     * @member {number} Picimo.core.Texture#height
     */

    height: {

        get: function () {

            if ( this._height != null ) {

                return this._height;

            }

            return this.root_height;

        },

        set: function ( height ) {

            this._height = height;

        },

        enumerable: true

    },

    /**
     * @member {number} Picimo.core.Texture#min_s
     * @readonly
     */

    min_s: {

        get: function () {

            var x = this.x;
            var tex = this;

            while ( ( tex = tex.parent ) != null ) {

                x += tex.x;

            }

            return x / this.root_width;

        },

        enumerable: true

    },

    /**
     * @member {number} Picimo.core.Texture#min_t
     * @readonly
     */

    min_t: {

        get: function () {

            var y = this.y;
            var tex = this;

            while ( ( tex = tex.parent ) != null ) {

                y += tex.y;

            }

            return y / this.root_height;

        },

        enumerable: true

    },

    /**
     * @member {number} Picimo.core.Texture#max_s
     * @readonly
     */

    max_s: {

        get: function () {

            var x = this.x + this.width;
            var tex = this;

            while ( ( tex = tex.parent ) != null ) {

                x += tex.x;

            }

            return x / this.root_width;

        },

        enumerable: true

    },

    /**
     * @member {number} Picimo.core.Texture#max_t
     * @readonly
     */

    max_t: {

        get: function () {

            var y = this.y + this.height;
            var tex = this;

            while ( ( tex = tex.parent ) != null ) {

                y += tex.y;

            }

            return y / this.root_height;

        },

        enumerable: true

    },

});


/**
 * @method Picimo.core.Texture#setTexCoords
 * @param {Object} obj - Any object which has a `.setTexCoords()` method
 */

Texture.prototype.setTexCoords = function ( obj ) {

    var x0 = this.min_s;
    var y0 = this.min_t;
    var x1 = this.max_s;
    var y1 = this.max_t;

    obj.setTexCoords(
        x0, y0,
        x1, y0,
        x1, y1,
        x0, y1 );

};

