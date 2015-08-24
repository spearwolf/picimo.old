(function(){
    'use strict';

    /**
     * @class Picimo.webgl.WebGlTexture
     *
     * @param {Picimo.webgl.WebGlContext} glx
     * @param {boolean} [repeatable=false]
     *
     */

    function WebGlTexture ( glx, repeatable ) {

        this.glx = glx;
        this.width = 0;
        this.height = 0;
        this.isRepeatable = repeatable === true;
        this.image = null;

        Object.seal( this );

    }

    function reset ( texture ) {

        texture.glId = 0;

        texture.needsInit   = true;
        texture.needsConf   = true;

        /**
         * @member {boolean} Picimo.webgl.WebGlTexture#needsUpload
         */

        texture.needsUpload = true;

        /**
         * @member {number} Picimo.webgl.WebGlTexture#texUnit
         */

        texture.texUnit = -1;

        // TODO unbind texture

    }

    Object.defineProperties( WebGlTexture.prototype, {

        /**
         * @member {WebGlContext} Picimo.webgl.WebGlTexture#glx
         */

        /**
         * @member {WebGlRenderingContext} Picimo.webgl.WebGlTexture#gl
         */

        glx: {

            set: function ( glx ) {

                if ( glx !== this._glx ) {

                    this._glx = glx;
                    this.gl = glx.gl;

                    reset( this );

                }

            },

            get: function () {

                return this._glx;

            }

        },

        /**
         * @member {boolean} Picimo.webgl.WebGlTexture#isRepeatable
         */
        isRepeatable: {

            get: function () {

                return this._isRepeatable;

            },

            set: function ( repeatable ) {

                var isRepeatable = !! repeatable;

                if ( this._isRepeatable !== isRepeatable ) {

                    this._isRepeatable = isRepeatable;
                    this.needsConf = true;

                }

            }

        },

        /**
         * @member {number} Picimo.webgl.WebGlTexture#width
         */
        width: {

            get: function () {

                return this._width;

            },

            set: function ( width ) {

                if ( this._width !== width ) {

                    this._width = width;
                    this.needsConf = true;

                }

            }

        },

        /**
         * @member {number} Picimo.webgl.WebGlTexture#height
         */
        height: {

            get: function () {

                return this._height;

            },

            set: function ( height ) {

                if ( this._height !== height ) {

                    this._height = height;
                    this.needsConf = true;

                }

            }

        },

        /**
         * @member {Image} Picimo.webgl.WebGlTexture#image
         */
        image: {

            get: function () {

                return this._image;

            },

            set: function ( image ) {

                if ( this._image !== image ) {

                    this._image = image;
                    this.needsUpload = true;

                    if ( image ) {

                        this.width = image.width;
                        this.height = image.height;

                    } else {

                        this.width = 0;
                        this.height = 0;

                    }

                }

            }

        },

        canConf: {

            get: function () {

                return this.width > 0 && this.height > 0;

            }

        },

        canUpload: {

            get: function () {

                return this.image && this.width > 0 && this.height > 0;

            }

        }

    });


    /**
     * @method Picimo.webgl.WebGlTexture#bind
     * @return {number} texture unit
     */

    WebGlTexture.prototype.bind = function () {

        if ( ! this.glId ) initialize( this );

        this.texUnit = this.glx.app.texture.bindWebGlTexture( this );

    };

    function initialize ( texture ) {

        if ( texture.needsInit ) {

            texture.glId = texture.gl.createTexture();
            texture.needsInit = false;

        }

    }

    function configure ( texture ) {

        if ( ! texture.glId ) initialize( texture );

        if ( texture.needsConf && texture.canConf ) {

            texture.bind();

            var gl = texture.gl;

            gl.pixelStorei( gl.UNPACK_FLIP_Y_WEBGL, true );
            gl.pixelStorei( gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false );

            var wrap = texture.isRepeatable ? gl.REPEAT : gl.CLAMP_TO_EDGE;

            gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wrap );
            gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, wrap );

            gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST );
            gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST );

            gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGBA, texture.width, texture.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null );

            texture.needsConf = false;

        }

    }


    /**
     * @method Picimo.webgl.WebGlTexture#upload
     * @see Picimo.webgl.WebGlTexture#needsUpload
     * @return self
     */

    WebGlTexture.prototype.upload = function () {

        configure( this );

        if ( this.needsUpload && this.canUpload ) {

            this.bind();

            var gl = this.gl;

            gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.image );

            this.needsUpload = false;

        }

        return this;

    };


    /**
     * @method Picimo.webgl.WebGlTexture#destroy
     */

    WebGlTexture.prototype.destroy = function () {

        reset( this );

    };


    module.exports = WebGlTexture;

})();
