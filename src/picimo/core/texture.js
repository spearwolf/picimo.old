(function(){
    "use strict";

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

    function Texture ( parent, x, y, width, height ) {

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

                if ( parent != null && this._image != null ) {

                    throw new Error( "Texture can have a parent or an image but not both!" );

                }

                this._parent = parent;

            },

            enumerable: true

        },

        /**
         * @member {Image|Canvas} Picimo.core.Texture#image
         */

        image: {

            get: function () {

                return this._parent ? this._parent.image : this._image;

            },

            set: function ( image ) {

                if ( image != null && this._parent != null ) {

                    throw new Error( "Texture can have a parent or an image but not both!" );

                }

                this._image = image;

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

                var image = this.image;

                if ( image ) {

                    return image.width;

                }

                return 0;

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

                var image = this.image;

                if ( image ) {

                    return image.height;

                }

                return 0;

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

                return x / this.image.width;

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

                return y / this.image.height;

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

                return x / this.image.width;

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

                return y / this.image.height;

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


    module.exports = Texture;

})();
