'use strict';

import Resource from './resource';
import Texture from './texture';
import Po2Image from './po2image';


/**
 * @class Picimo.core.TextureAtlas
 * @extends Picimo.core.Resource
 * @param {Picimo.App} app
 * @param {String} imageUrl
 * @param {String|Object} conf
 */

export default function TextureAtlas ( app, imageUrl, conf ) {

    Resource.call( this, app, 'conf' );

    /**
     * @member {Object} Picimo.core.TextureAtlas#conf - The texture atlas configuration.
     */
    this.conf = conf;

    this.frameNames = null;

    /**
     * @member {Picimo.core.Texture} Picimo.core.TextureAtlas#texture - The root texture for the atlas image.
     */
    this.texture = null;

    this.frames = null;
    this.imageUrl = imageUrl;

    Object.seal( this );

}

TextureAtlas.prototype = Object.create( Resource.prototype );
TextureAtlas.prototype.constructor = TextureAtlas;


TextureAtlas.prototype.convertData = function ( data ) {

    return typeof data === 'string' ? JSON.parse( data ) : data;

};


/**
 * @method Picimo.core.TextureAtlas#getImageUrl
 * @param {string} url
 * @return {string} url
 */

TextureAtlas.prototype.getImageUrl = function ( url ) {

    if ( this.imageUrl !== undefined ) {

        return this.imageUrl;

    }

    return this.app.joinAssetUrl( this.url, url );

};

/**
 * @private
 */

TextureAtlas.prototype.onData = function ( conf ) {

    this.texture = new Texture();

    this.texture.width  = conf.meta.size.w;
    this.texture.height = conf.meta.size.h;
    this.texture.image  = new Po2Image( this.app ).load( this.getImageUrl( conf.meta.image ) );

    this.frameNames = [];
    this.frames = new Map;

    var name, frame;

    for ( name in conf.frames ) {

        if ( conf.frames.hasOwnProperty( name ) ) {

            this.frameNames.push( name );
            frame = conf.frames[ name ].frame;
            this.frames.set( name, new Texture( this.texture, frame.x, frame.y, frame.w, frame.h ) );

        }

    }

};

/**
 * @method Picimo.core.TextureAtlas#getTexture
 * @param {string} name
 * @return {Picimo.core.Texture} texture
 */

TextureAtlas.prototype.getTexture = function ( name ) {

    if ( this.frames ) {

        return this.frames.get( name );

    }

};


/**
 * @method Picimo.core.TextureAtlas#getRandomTexture
 * @return {Picimo.core.Texture} texture
 */

TextureAtlas.prototype.getRandomTexture = function () {

    if ( this.frames ) {

        return this.frames.get( this.frameNames[ parseInt( this.frameNames.length * Math.random(), 10 ) ] );

    }

};

