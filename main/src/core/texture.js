
/**
 * @example
 * let c = document.createElement("canvas");
 * let t = new Picimo.Texture.fromCanvas(c);
 * t.width    // => 300
 * t.height   // => 150
 *
 * let tt = new Picimo.Texture( t, 30, 15, 100, 100 )
 * t.width    // => 100
 *
 */

export default class Texture {

    /**
     * @param {Texture} [parent]
     * @param {number} [x=0]
     * @param {number} [y=0]
     * @param {number} [width]
     * @param {number} [height]
     */
    constructor (parent, x, y, width, height) {

        this._parent = parent;
        this._image  = null;
        this._width  = width;
        this._height = height;

        /**
         * @type {number}
         */
        this.x = x != null ? x : 0;

        /**
         * @type {number}
         */
        this.y = y != null ? y : 0;

    }

    /**
     * @type {?Texture}
     */
    get parent () {
        return this._parent;
    }

    /**
     * @param {?Texture} parent
     * @type {?Texture}
     */
    set parent (parent) {
        this._parent = parent;
    }

    /**
     * @type {?Texture}
     */
    get root () {
        return this._parent || this;
        //return this._parent ? this._parent : this;
    }

    /**
     * @type {Image|HTMLImageElement|HTMLCanvasElement}
     */
    get image () {
        return this._image || (this._parent && this._parent.image) || null;
        //return this._image ? this._image : ( this._parent ? this._parent.image : null );
    }

    /**
     * @param {Image|HTMLImageElement|HTMLCanvasElement} image
     * @type {Image|HTMLImageElement|HTMLCanvasElement}
     */
    set image ( image ) {
        this._image = image;
    }

    /**
     * @type {number}
     */
    get root_width () {

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

    }

    /**
     * @type {number}
     */
    get root_height () {

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

    }

    /**
     * @type {number}
     */
    get width () {

        if ( this._width != null ) {

            return this._width;

        }

        return this.root_width;

    }

    /**
     * @param {number} width
     * @type {number}
     */
    set width ( width ) {

        this._width = width;

    }

    /**
     * @type {number}
     */
    get height () {

        if ( this._height != null ) {

            return this._height;

        }

        return this.root_height;

    }

    /**
     * @param {number} height
     * @type {number}
     */
    set height ( height ) {

        this._height = height;

    }

    /**
     * @type {number}
     */
    get min_s () {

        var x = this.x;
        var tex = this;

        while ( ( tex = tex.parent ) != null ) {

            x += tex.x;

        }

        return x / this.root_width;

    }

    /**
     * @type {number}
     */
    get min_t () {

        var y = this.y;
        var tex = this;

        while ( ( tex = tex.parent ) != null ) {

            y += tex.y;

        }

        return y / this.root_height;

    }

    /**
     * @type {number}
     */
    get max_s () {

        var x = this.x + this.width;
        var tex = this;

        while ( ( tex = tex.parent ) != null ) {

            x += tex.x;

        }

        return x / this.root_width;

    }

    /**
     * @type {number}
     */
    get max_t () {

        var y = this.y + this.height;
        var tex = this;

        while ( ( tex = tex.parent ) != null ) {

            y += tex.y;

        }

        return y / this.root_height;

    }

    /**
     * @param {Object} obj - Any object which has a `.setTexCoords()` method
     */
    setTexCoords (obj) {

        let x0 = this.min_s;
        let y0 = this.min_t;
        let x1 = this.max_s;
        let y1 = this.max_t;

        obj.setTexCoords(
            x0, y0,
            x1, y0,
            x1, y1,
            x0, y1 );

    }

    /**
     * @param {HTMLImageElement|HTMLCanvasElement} canvas
     * @return {Texture}
     */
    static fromCanvas (canvas) {

        let texture = new Texture;
        texture.image = canvas;

        return texture;

    }

}  // => class Texture

