/* global HTMLCanvasElement */
/* global HTMLImageElement */
'use strict';

import * as utils from '../utils';
import * as math from '../math';

/**
 * A power of two image.
 */
export default class PowerOfTwoImage {

    /**
     * @param {!App} app
     * @param {?HTMLImageElement|HTMLCanvasElement} image
     */
    constructor (app, image) {

        utils.object.definePropertyPublicRO( this, 'app', app );
        utils.addUid( this );
        utils.makeReadyPromise( this );

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

}


function setDomElement ( image, domElement ) {

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

