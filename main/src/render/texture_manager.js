import { definePropertyPublicRO, definePropertiesPrivateRO, definePropertyPrivate } from '../utils/object_utils';
import WebGlTexture from './web_gl_texture';

// for some background informations see:
//      https://www.khronos.org/render/wiki/TextureState

export default class TextureManager {

    /**
     * @param {App} app - app
     */

    constructor ( app ) {

        definePropertyPublicRO( this, 'app', app );

        const { MAX_TEXTURE_IMAGE_UNITS } = app.glx;

        definePropertiesPrivateRO( this, {

            textureCache  : new Map,                               // image -> texture
            boundTextures : new Array(MAX_TEXTURE_IMAGE_UNITS)     // [ texUnit ] -> image

        });

        for ( let i = 0; i < MAX_TEXTURE_IMAGE_UNITS; ++i ) {

            this.boundTextures[ i ] = null;

        }

        definePropertyPrivate( this, 'lastBoundTexUnit', 0);

    }

    /**
     * Bind a *texture* to a *texture unit*.
     * @return {number} texture unit
     */

    bindWebGlTexture ( glTexture ) {

        let texUnit = this.boundTextures.indexOf( glTexture );

        if ( texUnit < 0 ) {

            // texture is unbound
            // find a free texture unit ..

            for ( let i = 0; i < this.boundTextures.length; ++i ) {

                if ( ! this.boundTextures[ i ] ) {

                    texUnit = i;
                    this.boundTextures[ i ] = glTexture;
                    break;

                }

            }

            const { glx } = this.app;

            if ( texUnit < 0 ) {

                // no free texture found
                // so we choose the lru texture unit

                texUnit = this.lastBoundTexUnit;

                let prevGlTex = this.boundTextures[ texUnit ];
                if ( prevGlTex ) prevGlTex.texUnit = -1;

                this.lastBoundTexUnit = ( this.lastBoundTexUnit + 1 ) % glx.MAX_TEXTURE_IMAGE_UNITS;

            }

            glx.activeTexture( texUnit );
            glx.bindTexture2d( glTexture.glId );

            glTexture.texUnit = texUnit;

        }

        return texUnit;

    }

    /**
     * Find or create a **WebGlTexture** from **Texture** or **TextureAtlas** or *everything* which has an **image** property.
     * The *image* from the **image** property should have an **uid** property otherwise the *image object* itself will be used as cache key.
     * @param {Object} texture
     * @return {WebGlTexture} render texture
     */

    findOrCreateWebGlTexture ( texture ) {

        const tex   = texture.texture ? texture.texture : texture;
        const image = tex.image.domElement ? tex.image.domElement : tex.image;
        const uid   = tex.image.uid ? tex.image.uid : image;

        let glTex = this.textureCache.get( uid );

        if ( ! glTex ) {

            glTex = new WebGlTexture( this.app.glx );
            glTex.image = image;

            this.textureCache.set( uid, glTex );

        }

        return glTex;

    }

}  // => TextureManager

