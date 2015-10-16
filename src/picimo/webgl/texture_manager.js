'use strict';

import utils from '../utils';
import WebGlTexture from './web_gl_texture';

// for some background informations see:
//      https://www.khronos.org/webgl/wiki/TextureState

/**
 * @class Picimo.webgl.TextureManager
 */

export default function TextureManager ( app ) {

    utils.object.definePropertyPublicRO( this, 'app', app );

    utils.object.definePropertiesPrivateRO( this, {

        _textureCache  : new Map,  // image -> texture
        _boundTextures : []        // [ texUnit ] -> image

    });

    for ( var i = 0; i < app.glx.MAX_TEXTURE_IMAGE_UNITS; i++ ) {

        this._boundTextures[ i ] = null;

    }

    this._lastBoundTexUnit = 0;

}


/**
 * @method Picimo.webgl.TextureManager#bindWebGlTexture
 * @description
 * Bind the given *texture* to a *webgl texture unit*.
 * @param {Picimo.webgl.WebGlTexture} glTexture
 * @return {number} texture unit
 */

TextureManager.prototype.bindWebGlTexture = function ( glTexture ) {

    var texUnit = this._boundTextures.indexOf( glTexture );

    if ( texUnit < 0 ) {

        for ( var i = 0; i < this._boundTextures.length; i++ ) {

            if ( ! this._boundTextures[ i ] ) {

                texUnit = i;
                this._boundTextures[ i ] = glTexture;
                break;

            }

        }

        var glx = this.app.glx;

        if ( texUnit < 0 ) {

            texUnit = this._lastBoundTexUnit;

            var prevGlTex = this._boundTextures[ texUnit ];
            if ( prevGlTex ) prevGlTex.texUnit = -1;

            this._lastBoundTexUnit = ( this._lastBoundTexUnit + 1 ) % glx.MAX_TEXTURE_IMAGE_UNITS;

        }

        glx.activeTexture( texUnit );
        glx.bindTexture2d( glTexture.glId );

        glTexture.texUnit = texUnit;

    }

    return texUnit;

};


/**
 * @method Picimo.webgl.TextureManager#findOrCreateWebGlTexture
 * @description
 * Find or create **Picimo.webgl.WebGlTexture** from **Picimo.core.Texture** or **Picimo.core.TextureAtlas** or *everything* which has an **image** property.
 * The *image* from the **image** property should have an **uid** property otherwise the *image object* itself will be used as cache key.
 * @param {Object} texture
 * @return {Picimo.webgl.WebGlTexture} webgl texture
 */

TextureManager.prototype.findOrCreateWebGlTexture = function ( texture ) {

    var tex = texture.texture ? texture.texture : texture;
    var image = tex.image.domElement ? tex.image.domElement : tex.image;
    var uid = tex.image.uid ? tex.image.uid : image;

    var glTex = this._textureCache.get( uid );

    if ( ! glTex ) {

        glTex = new WebGlTexture( this.app.glx );
        glTex.image = image;

        this._textureCache.set( uid, glTex );

    }

    return glTex;

};

