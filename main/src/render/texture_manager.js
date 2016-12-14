'use strict';

import * as utils from '../utils';
import WebGlTexture from './web_gl_texture';

// for some background informations see:
//      https://www.khronos.org/render/wiki/TextureState

export default class TextureManager {

    constructor ( app ) {

        utils.object.definePropertyPublicRO( this, 'app', app );

        const MAX_TEXTURE_IMAGE_UNITS = app.glx.MAX_TEXTURE_IMAGE_UNITS;

        utils.object.definePropertiesPrivateRO( this, {

            _textureCache  : new Map,                               // image -> texture
            _boundTextures : new Array(MAX_TEXTURE_IMAGE_UNITS)     // [ texUnit ] -> image

        });

        for ( let i = 0; i < MAX_TEXTURE_IMAGE_UNITS; i++ ) {

            this._boundTextures[ i ] = null;

        }

        //this._lastBoundTexUnit = 0;
        utils.object.definePropertyPrivate( this, '_lastBoundTexUnit', 0);

    }


    /**
     * Bind a *texture* to a *texture unit*.
     * @return {number} texture unit
     */

    bindWebGlTexture ( glTexture ) {

        let texUnit = this._boundTextures.indexOf( glTexture );

        if ( texUnit < 0 ) {

            // texture is unbound
            // find a free texture unit ..

            for ( let i = 0; i < this._boundTextures.length; i++ ) {

                if ( ! this._boundTextures[ i ] ) {

                    texUnit = i;
                    this._boundTextures[ i ] = glTexture;
                    break;

                }

            }

            const glx = this.app.glx;

            if ( texUnit < 0 ) {

                // no free texture found
                // so we choose the lru texture unit

                texUnit = this._lastBoundTexUnit;

                let prevGlTex = this._boundTextures[ texUnit ];
                if ( prevGlTex ) prevGlTex.texUnit = -1;

                this._lastBoundTexUnit = ( this._lastBoundTexUnit + 1 ) % glx.MAX_TEXTURE_IMAGE_UNITS;

            }

            glx.activeTexture( texUnit );
            glx.bindTexture2d( glTexture.glId );

            glTexture.texUnit = texUnit;

        }

        return texUnit;

    }

    /**
     * Find or create **Picimo.render.WebGlTexture** from **Picimo.core.Texture** or **Picimo.core.TextureAtlas** or *everything* which has an **image** property.
     * The *image* from the **image** property should have an **uid** property otherwise the *image object* itself will be used as cache key.
     * @param {Object} texture
     * @return {Picimo.render.WebGlTexture} render texture
     */

    findOrCreateWebGlTexture ( texture ) {

        const tex   = texture.texture ? texture.texture : texture;
        const image = tex.image.domElement ? tex.image.domElement : tex.image;
        const uid   = tex.image.uid ? tex.image.uid : image;

        let glTex = this._textureCache.get( uid );

        if ( ! glTex ) {

            glTex = new WebGlTexture( this.app.glx );
            glTex.image = image;

            this._textureCache.set( uid, glTex );

        }

        return glTex;

    }

}  // => TextureManager

