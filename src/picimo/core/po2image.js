/* global HTMLCanvasElement */
/* global HTMLImageElement */
(function(){
    "use strict";

    var utils = require( '../utils' );
    var math  = require( '../math' );

    /**
     * @class Picimo.core.Po2Image
     * @description
     * A power-of-two image.
     * @param {Picimo.App} app
     */

    function Po2Image ( app, image ) {

        /**
         * @member {Picimo.App} Picimo.core.Po2Image#app
         * @readonly
         */
        utils.object.definePropertyPublicRO( this, 'app', app );

        /**
         * @member {number} Picimo.core.Po2Image#uid
         * @readonly
         */
        utils.addUid( this );

        /**
         * @member {Picimo.utils.Deferred} Picimo.core.Po2Image#deferred
         * @readonly
         */

        /**
         * @member {boolean} Picimo.core.Po2Image#ready
         */

        utils.Deferred.make( this );

        /**
         * @member {String} Picimo.core.Po2Image#url
         */
        this.url = null;

        /**
         * @member {HTMLImageElement|HTMLCanvasElement} Picimo.core.Po2Image#domElement
         */
        this.domElement = image;

        /**
         * @member {HTMLImageElement|HTMLCanvasElement} Picimo.core.Po2Image#image
         */
        this.image = null;


        Object.seal( this );

    }


    Po2Image.prototype.load = function ( url ) {

        var img = document.createElement( 'img' );
        this.domElement = img;

        this.url = this.app.getAssetUrl( url );
        img.src = this.url;

        return this;

    };


    Object.defineProperties( Po2Image.prototype, {

        'domElement': {

            get: function () { return this._domElement; },

            set: function ( image ) {

                if ( image instanceof HTMLCanvasElement ) {

                    setDomElement( this, image );

                } else if ( image instanceof HTMLImageElement ) {

                    if ( image.width === 0 && image.height === 0 ) {

                        this._domElement = image;
                        this.ready = false;

                        var self = this;

                        image.onload = function () {

                            self.image = convertToPowerOfTwo( image );
                            self.ready = true;

                        };

                    } else {

                        setDomElement( this, image );

                    }

                } else {

                    setDomElement( this, null );

                }

            },

            enumerable: true

        },

        'width': {

            get: function () {

                return this.image ? this.image.width : 0;

            },

            enumerable: true

        },

        'height': {

            get: function () {

                return this.image ? this.image.height : 0;

            },

            enumerable: true

        }

    });


    function setDomElement( image, domElement ) {

        image._domElement = domElement;
        image.image = domElement ? convertToPowerOfTwo( domElement ) : null;
        image.ready = !! domElement;

    }


    function convertToPowerOfTwo ( image ) {

        if ( math.isPowerOfTwo( image.width ) && math.isPowerOfTwo( image.height ) ) {

            return image;

        } else {

            var w = math.findNextPowerOfTwo( image.width );
            var h = math.findNextPowerOfTwo( image.height );

            var canvas = document.createElement( 'canvas' );

            canvas.width  = w;
            canvas.height = h;

            canvas.getContext( '2d' ).drawImage( image, 0, 0 );

            return canvas;

        }

    }


    module.exports = Po2Image;

})();
