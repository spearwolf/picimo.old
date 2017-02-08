/* jshint esversion:6 */
/* global HTMLCanvasElement */
/* global HTMLImageElement */
import addUid from '../utils/add_uid';
import makeReadyPromise from '../utils/make_ready_promise';
import { definePropertyPublicRO } from '../utils/obj_props';
import { isPowerOfTwo, findNextPowerOfTwo } from '../utils/math_helpers';

/**
 * A power of two image.
 */
export default class PowerOfTwoImage {

    /**
     * @param {!App} app
     * @param {?HTMLImageElement|HTMLCanvasElement} image
     */
    constructor (app, image) {

        definePropertyPublicRO( this, 'app', app );
        addUid( this );
        makeReadyPromise( this );

        /**
         * @type {string}
         */
        this.url = null;

        /**
         * @type {HTMLImageElement|HTMLCanvasElement}
         */
        this.domElement = image;

        /**
         * The power of two converted image (may be the original image)
         *
         * @type {HTMLImageElement|HTMLCanvasElement}
         */
        this.image = null;

        Object.seal( this );

    }

    /**
     * @param {string} url
     * @return {PowerOfTwoImage} self
     */
    load ( url ) {

        var img = document.createElement( 'img' );
        this.domElement = img;

        this.url = this.app.getAssetUrl( url );
        img.src = this.url;

        return this;

    }

    /**
     * The original image
     *
     * @type {HTMLImageElement|HTMLCanvasElement}
     */
    get domElement () {
        return this._domElement;
    }

    /**
     * @type {HTMLImageElement|HTMLCanvasElement}
     * @param {HTMLImageElement|HTMLCanvasElement} image
     */
    set domElement (image) {

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

    }

    /**
     * @type {number}
     */
    get width () {
        return this.image ? this.image.width : 0;
    }

    /**
     * @type {number}
     */
    get height () {
        return this.image ? this.image.height : 0;
    }

}  // => class PowerOfTwoImage


/**
 * @ignore
 */
function setDomElement ( image, domElement ) {

    image._domElement = domElement;
    image.image = domElement ? convertToPowerOfTwo( domElement ) : null;
    image.ready = !! domElement;

}

/**
 * @ignore
 */
function convertToPowerOfTwo ( image ) {

    if ( isPowerOfTwo( image.width ) && isPowerOfTwo( image.height ) ) {

        return image;

    } else {

        var w = findNextPowerOfTwo( image.width );
        var h = findNextPowerOfTwo( image.height );

        var canvas = document.createElement( 'canvas' );

        canvas.width  = w;
        canvas.height = h;

        canvas.getContext( '2d' ).drawImage( image, 0, 0 );

        return canvas;

    }

}

