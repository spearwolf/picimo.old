(function(){
    "use strict";

    var utils = require( '../utils' );
    var WebGlTexture = require( './web_gl_texture' );

    // https://www.khronos.org/webgl/wiki/TextureState

    /**
     * @class Picimo.webgl.TextureManager
     */

    function TextureManager ( app ) {
        
        utils.object.definePropertyPublicRO( this, 'app', app );

        utils.object.definePropertiesPrivateRO( this, {

            _textures : new utils.Map(),  // image -> texture
        
        });

    }


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

        var glTex = this._textures.get( uid );

        if ( ! glTex ) {

            glTex = new WebGlTexture( this.app.glx );
            glTex.image = image;

            this._textures.set( uid, glTex );
        
        }

        return glTex;
    
    };


    module.exports = TextureManager;

})();
